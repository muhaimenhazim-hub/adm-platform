# -*- coding: utf-8 -*-
"""
================================================================================
ADM Investment Platform - Wallet & Withdrawal Backend Module
File: wallet.py
Blueprint: wallet_bp
Prefix: /api/wallet
Database: Configured centrally via config.py (Unified Connection Hub)
================================================================================
"""

import math
import random
from datetime import datetime, date, timezone, timedelta
from decimal import Decimal
import pymysql
from flask import Blueprint, request, jsonify, session
from config import get_db

wallet_bp = Blueprint('wallet_bp', __name__, url_prefix='/api/wallet')

def get_profit_cycle_state():
    """
    محاسبه دقیق وضعیت چرخه سود روزانه:
    - روز جهانی از ساعت 00:00 UTC آغاز می‌شود.
    - زمان آزادسازی سود روزانه ساعت 21:00 به وقت افغانستان (معادل 16:30 UTC) است.
    - بین 00:00 تا 16:30 UTC: سود در حالت در حال پردازش / در انتظار (Pending) قرار دارد.
    - از 16:30 تا 23:59:59 UTC (ساعت 21:00 تا 04:30 صبح افغانستان): سود آزاد (Released) است.
    - با ورود به روز جدید جهانی (00:00 UTC)، چرخه مجدداً برای روز جاری به حالت در انتظار می‌رود.
    """
    utc_now = datetime.now(timezone.utc)
    current_utc_date = utc_now.date()
    release_threshold_utc = datetime(
        current_utc_date.year, current_utc_date.month, current_utc_date.day,
        16, 30, 0, tzinfo=timezone.utc
    )
    is_released = utc_now >= release_threshold_utc
    return current_utc_date, is_released, utc_now

def get_deterministic_daily_rate(date_obj):
    """
    تولید نرخ قطعی و ثابت روزانه بین ۰.۸۰٪ تا ۱.۳۰٪ بر اساس تاریخ
    """
    seed = date_obj.year * 10000 + date_obj.month * 100 + date_obj.day
    val = (math.sin(seed * 12.9898) * 43758.5453) % 1.0
    return round(0.80 + (abs(val) * 0.50), 2)

def get_or_create_daily_rate(cursor, date_obj):
    """
    واکشی یا ثبت نرخ روزانه در دیتابیس جهت یکسان بودن قطعی در تمام صفحات
    """
    date_str = date_obj.strftime('%Y-%m-%d')
    cursor.execute("SELECT rate_percent, is_distributed FROM daily_yield_rates WHERE yield_date = %s", (date_str,))
    row = cursor.fetchone()
    if row:
        return float(row['rate_percent']), bool(row['is_distributed'])
    
    rate = get_deterministic_daily_rate(date_obj)
    try:
        cursor.execute(
            """
            INSERT INTO daily_yield_rates (yield_date, rate_percent, is_distributed, created_at)
            VALUES (%s, %s, 0, NOW())
            ON DUPLICATE KEY UPDATE rate_percent = rate_percent
            """,
            (date_str, rate)
        )
    except Exception:
        pass
    return rate, False

def generate_tx_id():
    return f"TX-{random.randint(1000000, 9999999)}"

def calculate_days_difference(last_action_date):
    if not last_action_date:
        return 0
    if isinstance(last_action_date, datetime):
        last_date = last_action_date.date()
    elif isinstance(last_action_date, date):
        last_date = last_action_date
    else:
        try:
            last_date = datetime.strptime(str(last_action_date)[:10], '%Y-%m-%d').date()
        except Exception:
            return 0
            
    diff = (datetime.now(timezone.utc).date() - last_date).days
    return max(0, diff)

def get_profit_fee_tier(days):
    if days < 10:
        return {"allowed": False, "fee_rate": Decimal('0.00'), "tier_name": "less_than_10_days"}
    elif 10 <= days < 15:
        return {"allowed": True, "fee_rate": Decimal('0.05'), "tier_name": "5%"}
    elif 15 <= days < 25:
        return {"allowed": True, "fee_rate": Decimal('0.03'), "tier_name": "3%"}
    elif 25 <= days < 35:
        return {"allowed": True, "fee_rate": Decimal('0.01'), "tier_name": "1%"}
    else:
        return {"allowed": True, "fee_rate": Decimal('0.00'), "tier_name": "0%"}

def get_current_user_id():
    user_id = session.get('user_id') or request.args.get('user_id') or request.headers.get('X-User-Id')
    if not user_id and request.is_json:
        data = request.get_json(silent=True) or {}
        user_id = data.get('userId') or data.get('user_id')
    try:
        return int(user_id) if user_id else None
    except Exception:
        return None

@wallet_bp.route('/overview', methods=['GET'])
def get_wallet_overview():
    user_id = get_current_user_id()
    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            if not user_id:
                cursor.execute("SELECT id FROM users ORDER BY id ASC LIMIT 1")
                first = cursor.fetchone()
                if first:
                    user_id = first['id']
                    session['user_id'] = user_id
                else:
                    return jsonify({"status": "unauthenticated", "success": False}), 401

            current_utc_date, is_released, _ = get_profit_cycle_state()
            daily_rate, is_distributed_db = get_or_create_daily_rate(cursor, current_utc_date)

            # آزادسازی خودکار لات‌های ۹۰ روزه منقضی‌شده
            cursor.execute("""
                UPDATE investment_lots
                SET status = 'unlocked'
                WHERE user_id = %s AND status = 'locked' AND unlock_date <= NOW()
            """, (user_id,))

            cursor.execute("""
                SELECT u.kyc_status,
                       COALESCE(b.active_capital, 0.00) AS active_capital,
                       COALESCE(b.locked_principal, 0.00) AS locked_principal,
                       COALESCE(b.unlocked_principal, 0.00) AS unlocked_principal,
                       COALESCE(b.withdrawable_profit, 0.00) AS withdrawable_profit,
                       COALESCE(b.total_lifetime_profit, 0.00) AS total_lifetime_profit,
                       COALESCE(b.last_profit_action_date, u.created_at) AS last_action
                FROM users u
                LEFT JOIN user_balances b ON u.id = b.user_id
                WHERE u.id = %s
            """, (user_id,))
            balance = cursor.fetchone()

            if not balance:
                cursor.execute("""
                    INSERT INTO user_balances (user_id, active_capital, locked_principal, unlocked_principal, withdrawable_profit, total_lifetime_profit)
                    VALUES (%s, 0.00, 0.00, 0.00, 0.00, 0.00)
                """, (user_id,))
                balance = {
                    'kyc_status': 'unverified',
                    'active_capital': 0.00,
                    'locked_principal': 0.00,
                    'unlocked_principal': 0.00,
                    'withdrawable_profit': 0.00,
                    'total_lifetime_profit': 0.00,
                    'last_action': None
                }

            active_capital = float(balance.get('active_capital') or 0.00)
            locked_principal = float(balance.get('locked_principal') or 0.00)
            unlocked_principal = float(balance.get('unlocked_principal') or 0.00)
            withdrawable_profit = float(balance.get('withdrawable_profit') or 0.00)
            total_lifetime_profit = float(balance.get('total_lifetime_profit') or 0.00)
            kyc_status = balance.get('kyc_status') or 'unverified'
            has_investment = (active_capital >= 50.00 and kyc_status == 'verified')

            today_profit = round((active_capital * daily_rate) / 100.0, 2) if has_investment else 0.00

            # با رسیدن ساعت ۹ شب، سود روزانه به مجموع کل سودها اضافه می‌شود اما به سود قابل برداشت (تا گذشت ۱۰ روز) اضافه نمی‌شود
            if is_released and has_investment and not is_distributed_db:
                total_lifetime_profit = round(total_lifetime_profit + today_profit, 2)

            days_since = calculate_days_difference(balance.get('last_action'))

            cursor.execute("""
                SELECT tx_id as id, type, amount, network, status, created_at as date
                FROM transactions
                WHERE user_id = %s
                ORDER BY created_at DESC
                LIMIT 50
            """, (user_id,))
            raw_txs = cursor.fetchall()

            transactions = []
            for tx in raw_txs:
                time_str = tx['date'].strftime('%Y-%m-%d %H:%M') if isinstance(tx.get('date'), datetime) else str(tx.get('date') or '')
                transactions.append({
                    "id": tx['id'],
                    "type": tx['type'],
                    "amount": float(tx['amount']),
                    "network": tx['network'] or 'TRC20',
                    "status": tx['status'],
                    "date": time_str
                })

            return jsonify({
                "status": "success",
                "success": True,
                "data": {
                    "active_capital": round(active_capital, 2),
                    "locked_principal": round(locked_principal, 2),
                    "unlocked_principal": round(unlocked_principal, 2),
                    "withdrawable_profit": round(withdrawable_profit, 2),
                    "total_lifetime_profit": round(total_lifetime_profit, 2),
                    "today_profit": round(today_profit, 2),
                    "is_released": is_released,
                    "days_since_last_action": days_since,
                    "transactions": transactions
                }
            }), 200

    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

@wallet_bp.route('/withdraw', methods=['POST'])
def process_withdrawal():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"status": "unauthenticated", "success": False, "message": "User not authenticated"}), 401

    data = request.get_json() or {}
    withdraw_type = data.get('type', 'profit')
    address = data.get('address', '').strip()
    network = data.get('network', 'TRC20').strip().upper()

    try:
        amount = Decimal(str(data.get('amount', 0)))
    except Exception:
        return jsonify({"status": "error", "success": False, "message": "Invalid withdrawal amount"}), 400

    if amount <= Decimal('0.00') or len(address) < 6:
        return jsonify({"status": "error", "success": False, "message": "Invalid withdrawal details"}), 400

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT active_capital, unlocked_principal, withdrawable_profit, last_profit_action_date
                FROM user_balances
                WHERE user_id = %s
                FOR UPDATE
            """, (user_id,))
            balance = cursor.fetchone()

            if not balance:
                return jsonify({"status": "error", "success": False, "message": "User balance record not found"}), 404

            active_capital = Decimal(str(balance.get('active_capital') or '0.00'))
            unlocked_principal = Decimal(str(balance.get('unlocked_principal') or '0.00'))
            withdrawable_profit = Decimal(str(balance.get('withdrawable_profit') or '0.00'))
            now = datetime.now(timezone.utc)
            tx_id = generate_tx_id()

            if withdraw_type == 'profit':
                min_required = active_capital * Decimal('0.10')
                if active_capital < Decimal('50.00') or withdrawable_profit < min_required:
                    return jsonify({"status": "error", "success": False, "message": "Rule 10% not met"}), 400

                if amount > withdrawable_profit:
                    return jsonify({"status": "error", "success": False, "message": "Insufficient withdrawable profit"}), 400

                days = calculate_days_difference(balance.get('last_profit_action_date'))
                fee_tier = get_profit_fee_tier(days)
                if not fee_tier["allowed"]:
                    return jsonify({"status": "error", "success": False, "message": "Withdrawal restricted within 10 days"}), 400

                fee = amount * fee_tier["fee_rate"]
                net_amount = amount - fee

                cursor.execute("""
                    UPDATE user_balances
                    SET withdrawable_profit = withdrawable_profit - %s,
                        last_profit_action_date = %s
                    WHERE user_id = %s
                """, (amount, now, user_id))

                cursor.execute("""
                    INSERT INTO transactions (tx_id, user_id, type, amount, fee, net_amount, network, status, created_at)
                    VALUES (%s, %s, 'withdraw_profit', %s, %s, %s, %s, 'pending', %s)
                """, (tx_id, user_id, amount, fee, net_amount, network, now))

            elif withdraw_type == 'principal':
                if amount > unlocked_principal:
                    return jsonify({"status": "error", "success": False, "message": "Amount exceeds unlocked principal"}), 400

                fee = amount * Decimal('0.05')
                net_amount = amount - fee

                cursor.execute("""
                    UPDATE user_balances
                    SET unlocked_principal = unlocked_principal - %s,
                        active_capital = GREATEST(0.00, active_capital - %s)
                    WHERE user_id = %s
                """, (amount, amount, user_id))

                cursor.execute("""
                    INSERT INTO transactions (tx_id, user_id, type, amount, fee, net_amount, network, status, created_at)
                    VALUES (%s, %s, 'withdraw_principal', %s, %s, %s, %s, 'pending', %s)
                """, (tx_id, user_id, amount, fee, net_amount, network, now))

            return jsonify({
                "status": "success",
                "success": True,
                "message": "Withdrawal request submitted successfully",
                "tx_id": tx_id
            }), 200

    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        if conn:
            conn.close()
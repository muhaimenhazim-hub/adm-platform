# -*- coding: utf-8 -*-
"""
================================================================================
ADM Investment Platform - Wallet & Withdrawal Backend Module
File: wallet.py
Blueprint: wallet_bp
Prefix: /api/wallet
Database: Configured centrally via config.py (Unified Connection Hub)
================================================================================
Golden Business Rules:
1. Daily Cycle: Releases at 21:00 AF Time (16:30 UTC).
2. Total Lifetime Profit: Aggregates personal daily yields, team commissions, 
   and direct referral bonuses.
3. 10-Day Retention Rule: ALL earnings (personal yields, team commissions, 
   direct referral bonuses) mature into withdrawable_profit ONLY after 10 full days.
4. Withdrawable Profit: Immediately deducted upon withdrawal.
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

# تعریف دقیق منطقه زمانی رسمی افغانستان (UTC + 4:30)
AFT_TZ = timezone(timedelta(hours=4, minutes=30))

def get_profit_cycle_state():
    """
    محاسبه وضعیت چرخه سود روزانه بر اساس ساعت رسمی افغانستان (UTC+4:30):
    - ساعت آزادسازی و واریز سود روزانه رأس ساعت ۲۱:۰۰ به وقت افغانستان (معادل ۱۶:۳۰ UTC) است.
    - بین 00:00 تا 20:59:59 افغانستان: سود در حالت در حال پردازش / تسویه دوره‌ای (Pending).
    - از ساعت ۲۱:۰۰ تا ۲۳:۵۹:۵۹ افغانستان: سود روز جاری آزاد، واریز و فعال (Released).
    """
    aft_now = datetime.now(AFT_TZ)
    current_aft_date = aft_now.date()
    release_threshold_aft = datetime(
        current_aft_date.year, current_aft_date.month, current_aft_date.day,
        21, 0, 0, tzinfo=AFT_TZ
    )
    is_released = (aft_now >= release_threshold_aft)
    return current_aft_date, is_released, aft_now

def get_deterministic_daily_rate(date_obj):
    """
    تولید نرخ قطعی و ثابت روزانه بین ۰.۸۰٪ تا ۱.۳۰٪ بر اساس تاریخ
    """
    seed = date_obj.year * 10000 + date_obj.month * 100 + date_obj.day
    val = (math.sin(seed * 12.9898) * 43758.5453) % 1.0
    return round(0.80 + (abs(val) * 0.50), 2)

def get_or_create_daily_rate(cursor, date_obj):
    """
    واکشی یا ثبت نرخ روزانه در دیتابیس جهت تطابق ۱۰۰٪ بین تمام صفحات
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
            
    aft_today = datetime.now(AFT_TZ).date()
    diff = (aft_today - last_date).days
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

def settle_daily_yields(cursor, conn, current_date, is_released):
    """
    موتور تسویه روزانه و اعمال قانون بلوغ ۱۰ روزه برای کلیه درآمدها در صفحه کیف‌پول:
    ۱. واریز سودهای روزانه و کمیسیون‌های تیمی رأس ساعت ۲۱:۰۰ افغانستان به مجموع کل بازدهی (total_lifetime_profit)
    ۲. انتقال سودهای روزانه سپری شده بیش از ۱۰ روز به سود قابل برداشت (withdrawable_profit)
    ۳. انتقال کمیسیون‌های تیمی و پاداش‌های رفرال سپری شده بیش از ۱۰ روز به سود قابل برداشت (withdrawable_profit)
    """
    try:
        cursor.execute("ALTER TABLE daily_yield_rates ADD COLUMN is_matured TINYINT(1) DEFAULT 0")
        if conn: conn.commit()
    except Exception:
        pass

    try:
        cursor.execute("ALTER TABLE referral_commissions ADD COLUMN is_matured TINYINT(1) DEFAULT 0")
        if conn: conn.commit()
    except Exception:
        pass

    latest_released_date = current_date if is_released else (current_date - timedelta(days=1))
    check_start_date = current_date - timedelta(days=45)
    has_changes = False

    # ۱. تسویه سود روزانه و کمیسیون تیمی به مجموع بازدهی کل
    curr = check_start_date
    while curr <= latest_released_date:
        d_str = curr.strftime('%Y-%m-%d')
        rate, is_distributed = get_or_create_daily_rate(cursor, curr)

        if not is_distributed:
            cursor.execute("""
                UPDATE user_balances b
                JOIN users u ON u.id = b.user_id
                SET b.total_lifetime_profit = b.total_lifetime_profit + ROUND((b.active_capital * %s) / 100.0, 2)
                WHERE b.active_capital >= 50.00
                  AND u.kyc_status = 'verified'
                  AND DATE(u.created_at) <= %s
            """, (rate, d_str))

            try:
                cursor.execute("""
                    UPDATE user_balances parent_bal
                    JOIN (
                        SELECT parent.id AS parent_id,
                               ROUND(SUM((child_bal.active_capital * %s / 100.0) * 0.10), 2) AS team_comm
                        FROM users child
                        JOIN users parent ON child.referred_by = parent.referral_code
                        JOIN user_balances child_bal ON child.id = child_bal.user_id
                        WHERE child_bal.active_capital >= 50.00
                          AND child.kyc_status = 'verified'
                          AND DATE(child.created_at) <= %s
                        GROUP BY parent.id
                    ) team_calc ON parent_bal.user_id = team_calc.parent_id
                    SET parent_bal.total_lifetime_profit = parent_bal.total_lifetime_profit + team_calc.team_comm
                """, (rate, d_str))
            except Exception:
                pass

            cursor.execute("UPDATE daily_yield_rates SET is_distributed = 1 WHERE yield_date = %s", (d_str,))
            has_changes = True

        curr += timedelta(days=1)

    # ۲. انتقال سودهای روزانه با قدمت ۱۰ روز یا بیشتر به سود قابل برداشت
    matured_cutoff = current_date - timedelta(days=10)
    curr_m = check_start_date

    while curr_m <= matured_cutoff:
        d_str = curr_m.strftime('%Y-%m-%d')
        try:
            cursor.execute("SELECT rate_percent, is_matured FROM daily_yield_rates WHERE yield_date = %s", (d_str,))
            row = cursor.fetchone()
            if row and not row.get('is_matured'):
                rate = float(row['rate_percent'])
                cursor.execute("""
                    UPDATE user_balances b
                    JOIN users u ON u.id = b.user_id
                    SET b.withdrawable_profit = b.withdrawable_profit + ROUND((b.active_capital * %s) / 100.0, 2)
                    WHERE b.active_capital >= 50.00
                      AND u.kyc_status = 'verified'
                      AND DATE(u.created_at) <= %s
                """, (rate, d_str))

                cursor.execute("UPDATE daily_yield_rates SET is_matured = 1 WHERE yield_date = %s", (d_str,))
                has_changes = True
        except Exception:
            pass

        curr_m += timedelta(days=1)

    # ۳. انتقال کمیسیون‌های تیمی و پاداش‌های رفرال با قدمت ۱۰ روز یا بیشتر به سود قابل برداشت
    try:
        cursor.execute("""
            SELECT id, leader_id, amount
            FROM referral_commissions
            WHERE is_matured = 0 AND DATEDIFF(NOW(), created_at) >= 10
        """)
        matured_comms = cursor.fetchall()
        for comm in matured_comms:
            cursor.execute("""
                UPDATE user_balances
                SET withdrawable_profit = withdrawable_profit + %s
                WHERE user_id = %s
            """, (comm['amount'], comm['leader_id']))

            cursor.execute("UPDATE referral_commissions SET is_matured = 1 WHERE id = %s", (comm['id'],))
            has_changes = True
    except Exception:
        pass

    if has_changes and conn:
        conn.commit()

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

            current_aft_date, is_released, _ = get_profit_cycle_state()

            # اجرای تسویه خودکار و بلوغ ۱۰ روزه درآمدها
            settle_daily_yields(cursor, conn, current_aft_date, is_released)

            daily_rate, _ = get_or_create_daily_rate(cursor, current_aft_date)

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

                # کسر قطعی از سود قابل برداشت و به‌روزرسانی تاریخ آخرین تراکنش
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

            conn.commit()

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
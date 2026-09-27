"""
================================================================================
ADM Investment Platform - Wallet & Withdrawal Backend Module
File: wallet.py
Blueprint: /api/wallet
Database: adm_db (MySQL XAMPP, port 3306)
================================================================================
"""

import random
from datetime import datetime, date
from decimal import Decimal
import pymysql
from flask import Blueprint, request, jsonify, session

wallet_bp = Blueprint('wallet_bp', __name__)

def get_db():
    return pymysql.connect(
        host='localhost',
        port=3306,
        user='root',
        password='',
        database='adm_db',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )

def generate_tx_id():
    return f"TX-{random.randint(1000000, 9999999)}"

def calculate_days_difference(last_action_date):
    if not last_action_date:
        return 999
    
    if isinstance(last_action_date, datetime):
        last_date = last_action_date.date()
    elif isinstance(last_action_date, date):
        last_date = last_action_date
    else:
        try:
            last_date = datetime.strptime(str(last_action_date)[:10], '%Y-%m-%d').date()
        except Exception:
            return 999
            
    diff = (datetime.utcnow().date() - last_date).days
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

@wallet_bp.route('/overview', methods=['GET'])
def get_wallet_overview():
    user_id = session.get('user_id')
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

            # آزادسازی لات‌های منقضی
            cursor.execute("""
                UPDATE investment_lots
                SET status = 'unlocked'
                WHERE user_id = %s AND status = 'locked' AND unlock_date <= NOW()
            """, (user_id,))

            cursor.execute("""
                SELECT active_capital, locked_principal, unlocked_principal, 
                       withdrawable_profit, last_profit_action_date
                FROM user_balances
                WHERE user_id = %s
            """, (user_id,))
            balance = cursor.fetchone()

            if not balance:
                cursor.execute("""
                    INSERT INTO user_balances (user_id, active_capital, locked_principal, unlocked_principal, withdrawable_profit)
                    VALUES (%s, 0.00, 0.00, 0.00, 0.00)
                """, (user_id,))
                balance = {
                    'active_capital': 0.00,
                    'locked_principal': 0.00,
                    'unlocked_principal': 0.00,
                    'withdrawable_profit': 0.00,
                    'last_profit_action_date': None
                }

            active_capital = Decimal(str(balance.get('active_capital') or '0.00'))
            locked_principal = Decimal(str(balance.get('locked_principal') or '0.00'))
            unlocked_principal = Decimal(str(balance.get('unlocked_principal') or '0.00'))
            withdrawable_profit = Decimal(str(balance.get('withdrawable_profit') or '0.00'))
            days_since = calculate_days_difference(balance.get('last_profit_action_date'))

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
                transactions.append({
                    "id": tx['id'],
                    "type": tx['type'],
                    "amount": float(tx['amount']),
                    "network": tx['network'] or 'TRC20',
                    "status": tx['status'],
                    "date": tx['date'].strftime('%Y-%m-%d %H:%M:%S') if tx['date'] else ''
                })

            return jsonify({
                "status": "success",
                "success": True,
                "data": {
                    "active_capital": float(active_capital),
                    "locked_principal": float(locked_principal),
                    "unlocked_principal": float(unlocked_principal),
                    "withdrawable_profit": float(withdrawable_profit),
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
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"status": "unauthenticated", "success": False}), 401

    data = request.get_json() or {}
    withdraw_type = data.get('type', 'profit')
    address = data.get('address', '').strip()
    network = data.get('network', 'TRC20').strip().upper()

    try:
        amount = Decimal(str(data.get('amount', 0)))
    except Exception:
        return jsonify({"status": "error", "success": False, "message": "Invalid amount"}), 400

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
                return jsonify({"status": "error", "success": False, "message": "User wallet not found"}), 404

            active_capital = Decimal(str(balance.get('active_capital') or '0.00'))
            unlocked_principal = Decimal(str(balance.get('unlocked_principal') or '0.00'))
            withdrawable_profit = Decimal(str(balance.get('withdrawable_profit') or '0.00'))
            now = datetime.utcnow()
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
                        pending_withdrawal = pending_withdrawal + %s,
                        last_profit_action_date = %s
                    WHERE user_id = %s
                """, (amount, net_amount, now, user_id))

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
                        active_capital = GREATEST(0.00, active_capital - %s),
                        pending_withdrawal = pending_withdrawal + %s
                    WHERE user_id = %s
                """, (amount, amount, net_amount, user_id))

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
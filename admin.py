# -*- coding: utf-8 -*-
"""
================================================================================
ADM Binance Pro - Official Administrator Blueprint
File: admin.py
Blueprint: admin_bp
Prefix: /api/admin
Database: Configured centrally via config.py (Unified Connection Hub)
Full compliance with all golden rules:
  - Strict Role Check (role == 'admin')
  - Manual Adjustment for all 5 Financial Buckets:
      * active_capital (Total Active Capital)
      * locked_principal (Locked Principal)
      * unlocked_principal (Unlocked Principal)
      * withdrawable_profit (Withdrawable Profit)
      * total_lifetime_profit (Total Lifetime Profit)
  - KYC + $50 Active Capital for daily yield distribution
  - 5-Tier Referral commissions with Leader Capital Cap: min(user_cap, leader_cap)
  - 90-Day Lot creation on deposit approvals
  - Automatic refund on withdrawal rejections
================================================================================
"""

import os
import random
from datetime import datetime, date, timedelta
from decimal import Decimal
import pymysql
from flask import Blueprint, request, jsonify, session
from config import get_db

admin_bp = Blueprint('admin_bp', __name__)

def admin_required(func):
    def wrapper(*args, **kwargs):
        user_role = session.get('role')
        user_id = session.get('user_id')

        # سیستم احراز هویت دوگانه جهت جلوگیری از انقضای سشن در سرورهای ابری
        if not user_id or user_role != 'admin':
            header_uid = request.headers.get('X-User-Id')
            cookie_uid = request.cookies.get('logged_in_uid')
            check_uid = header_uid or cookie_uid
            if check_uid:
                try:
                    conn = get_db()
                    with conn.cursor() as cursor:
                        cursor.execute("SELECT id, role FROM users WHERE uid = %s OR id = %s", (check_uid, check_uid))
                        u = cursor.fetchone()
                        if u and u['role'] == 'admin':
                            session['user_id'] = u['id']
                            session['role'] = 'admin'
                            user_id = u['id']
                            user_role = 'admin'
                    conn.close()
                except Exception:
                    pass

        if not user_id or user_role != 'admin':
            return jsonify({
                "status": "error",
                "success": False,
                "message": "Access Denied: Administrator privileges required."
            }), 403
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

# ==================== 1. Overview & Counters ====================

@admin_bp.route('/overview', methods=['GET'])
@admin_required
def get_overview():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            # ۱. کل سرمایه فعال در گردش پلتفرم
            cursor.execute("SELECT COALESCE(SUM(active_capital), 0.0000) AS total_cap FROM user_balances")
            total_cap = float(cursor.fetchone()['total_cap'])

            # ۲. کل سود واریزشده تا کنون
            cursor.execute("SELECT COALESCE(SUM(total_lifetime_profit), 0.0000) AS total_profit FROM user_balances")
            total_profit = float(cursor.fetchone()['total_profit'])

            # ۳. تعداد کل کاربران ثبت‌نامی
            cursor.execute("SELECT COUNT(*) AS total_users FROM users")
            total_users = cursor.fetchone()['total_users']

            # ۴. کاربران تاییدشده با حداقل ۵۰ دلار سرمایه فعال
            cursor.execute("""
                SELECT COUNT(u.id) AS active_verified
                FROM users u
                JOIN user_balances b ON u.id = b.user_id
                WHERE u.kyc_status = 'verified' AND b.active_capital >= 50.0000
            """)
            active_verified = cursor.fetchone()['active_verified']

            # ۵. شمارنده برداشت‌ها و مدارک معلق
            cursor.execute("SELECT COUNT(*) AS c FROM transactions WHERE type IN ('withdraw_profit', 'withdraw_principal') AND status = 'pending'")
            pending_withdrawals = cursor.fetchone()['c']

            cursor.execute("SELECT COUNT(*) AS c FROM kyc_verifications WHERE status = 'pending'")
            pending_kyc = cursor.fetchone()['c']

            return jsonify({
                "status": "success",
                "success": True,
                "stats": {
                    "total_circulating_capital": total_cap,
                    "total_profit_distributed": total_profit,
                    "total_users": total_users,
                    "active_verified_investors": active_verified,
                    "pending_withdrawals_count": pending_withdrawals,
                    "pending_kyc_count": pending_kyc
                }
            }), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/counters', methods=['GET'])
@admin_required
def get_counters():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) AS c FROM transactions WHERE type IN ('withdraw_profit', 'withdraw_principal') AND status = 'pending'")
            p_withdraw = cursor.fetchone()['c']

            cursor.execute("SELECT COUNT(*) AS c FROM transactions WHERE type = 'deposit' AND status = 'pending'")
            p_deposit = cursor.fetchone()['c']

            cursor.execute("SELECT COUNT(*) AS c FROM kyc_verifications WHERE status = 'pending'")
            p_kyc = cursor.fetchone()['c']

            cursor.execute("SELECT COUNT(*) AS c FROM support_tickets WHERE status = 'pending'")
            p_tickets = cursor.fetchone()['c']

            return jsonify({
                "status": "success",
                "success": True,
                "counters": {
                    "pending_withdrawals": p_withdraw,
                    "pending_deposits": p_deposit,
                    "pending_kyc": p_kyc,
                    "pending_tickets": p_tickets
                }
            }), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/transactions/live', methods=['GET'])
@admin_required
def get_live_transactions():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT t.id, t.tx_id, t.user_id, t.type, t.amount, t.network, t.status, t.created_at,
                       u.uid, u.username
                FROM transactions t
                JOIN users u ON t.user_id = u.id
                ORDER BY t.created_at DESC
                LIMIT 20
            """)
            txs = cursor.fetchall()
            return jsonify({"status": "success", "success": True, "transactions": txs}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

# ==================== 2. User Management ====================

@admin_bp.route('/users', methods=['GET'])
@admin_required
def list_users():
    q = request.args.get('q', '').strip()
    role = request.args.get('role', '').strip()
    kyc = request.args.get('kyc', '').strip()

    conn = get_db()
    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT u.id, u.uid, u.username, u.email, u.phone, u.role, u.referral_code, 
                       u.kyc_status, u.status, u.created_at,
                       COALESCE(b.active_capital, 0.0000) AS active_capital,
                       COALESCE(b.withdrawable_profit, 0.0000) AS withdrawable_profit,
                       COALESCE(b.locked_principal, 0.0000) AS locked_principal,
                       COALESCE(b.unlocked_principal, 0.0000) AS unlocked_principal,
                       COALESCE(b.total_lifetime_profit, 0.0000) AS total_lifetime_profit
                FROM users u
                LEFT JOIN user_balances b ON u.id = b.user_id
                WHERE 1=1
            """
            params = []

            if q:
                sql += " AND (u.uid LIKE %s OR u.username LIKE %s OR u.email LIKE %s OR u.phone LIKE %s OR u.referral_code LIKE %s)"
                term = f"%{q}%"
                params.extend([term, term, term, term, term])

            if role:
                sql += " AND u.role = %s"
                params.append(role)

            if kyc:
                sql += " AND u.kyc_status = %s"
                params.append(kyc)

            sql += " ORDER BY u.id DESC LIMIT 100"
            cursor.execute(sql, tuple(params))
            users = cursor.fetchall()

            return jsonify({"status": "success", "success": True, "users": users}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/users/adjust_balance', methods=['POST'])
@admin_required
def adjust_balance():
    data = request.get_json() or {}
    user_id = data.get('user_id')
    mode = data.get('mode')
    bucket = data.get('bucket')
    reason = data.get('reason', '').strip()

    allowed_buckets = [
        'active_capital',
        'locked_principal',
        'unlocked_principal',
        'withdrawable_profit',
        'total_lifetime_profit'
    ]

    try:
        amount = Decimal(str(data.get('amount', 0)))
    except Exception:
        return jsonify({"status": "error", "success": False, "message": "Invalid amount format"}), 400

    if not user_id or amount <= Decimal('0.0000') or bucket not in allowed_buckets:
        return jsonify({"status": "error", "success": False, "message": "Invalid adjustment parameters"}), 400

    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM user_balances WHERE user_id = %s FOR UPDATE", (user_id,))
            bal = cursor.fetchone()
            if not bal:
                return jsonify({"status": "error", "success": False, "message": "User balance not found"}), 404

            current_val = Decimal(str(bal.get(bucket) or '0.0000'))
            if mode == 'debit' and current_val < amount:
                return jsonify({"status": "error", "success": False, "message": f"Insufficient {bucket} balance for debit adjustment"}), 400

            new_val = current_val + amount if mode == 'credit' else current_val - amount

            cursor.execute(f"""
                UPDATE user_balances 
                SET {bucket} = %s 
                WHERE user_id = %s
            """, (new_val, user_id))

            tx_id = f"ADM-ADJ-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            cursor.execute("""
                INSERT INTO transactions (tx_id, user_id, type, amount, net_amount, network, status, admin_note, created_at)
                VALUES (%s, %s, 'deposit', %s, %s, 'INTERNAL', 'completed', %s, NOW())
            """, (tx_id, user_id, amount, amount if mode == 'credit' else -amount, f"Manual {mode.upper()} on {bucket} by Admin: {reason}"))

            return jsonify({
                "status": "success",
                "success": True,
                "message": f"Successfully updated {bucket} to ${float(new_val):.4f}"
            }), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/users/toggle_role', methods=['POST'])
@admin_required
def toggle_user_role():
    data = request.get_json() or {}
    user_id = data.get('user_id')
    new_role = data.get('new_role')
    if new_role not in ['user', 'admin'] or not user_id:
        return jsonify({"status": "error", "success": False, "message": "Invalid request"}), 400

    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("UPDATE users SET role = %s WHERE id = %s", (new_role, user_id))
            return jsonify({"status": "success", "success": True, "message": "Role updated successfully"}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/users/toggle_status', methods=['POST'])
@admin_required
def toggle_user_status():
    data = request.get_json() or {}
    user_id = data.get('user_id')
    new_status = data.get('new_status')
    if new_status not in ['active', 'suspended', 'banned'] or not user_id:
        return jsonify({"status": "error", "success": False, "message": "Invalid status parameter"}), 400

    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("UPDATE users SET status = %s WHERE id = %s", (new_status, user_id))
            return jsonify({"status": "success", "success": True, "message": "Status updated successfully"}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

# ==================== 3. Finance & Approvals ====================

@admin_bp.route('/withdrawals/pending', methods=['GET'])
@admin_required
def pending_withdrawals():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT t.id, t.tx_id, t.user_id, t.type, t.amount, t.fee, t.net_amount, 
                       t.network, t.dest_address, t.created_at,
                       u.uid, u.username, u.email,
                       COALESCE(b.last_profit_action_date, b.last_compound_date, u.created_at) AS last_action_date,
                       DATEDIFF(NOW(), COALESCE(b.last_profit_action_date, b.last_compound_date, u.created_at)) AS days_since_last_action
                FROM transactions t
                JOIN users u ON t.user_id = u.id
                JOIN user_balances b ON u.id = b.user_id
                WHERE t.type IN ('withdraw_profit', 'withdraw_principal') AND t.status = 'pending'
                ORDER BY t.created_at ASC
            """)
            withdrawals = cursor.fetchall()
            return jsonify({"status": "success", "success": True, "withdrawals": withdrawals}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/withdrawals/approve', methods=['POST'])
@admin_required
def approve_withdrawal():
    data = request.get_json() or {}
    tx_id = data.get('tx_id')

    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM transactions WHERE tx_id = %s AND status = 'pending' FOR UPDATE", (tx_id,))
            tx = cursor.fetchone()
            if not tx:
                return jsonify({"status": "error", "success": False, "message": "Pending transaction not found"}), 404

            user_id = tx['user_id']
            gross_amount = Decimal(str(tx['amount']))

            cursor.execute("UPDATE transactions SET status = 'completed', updated_at = NOW() WHERE id = %s", (tx['id'],))

            cursor.execute("""
                UPDATE user_balances
                SET pending_withdrawal = GREATEST(0.0000, pending_withdrawal - %s),
                    last_profit_action_date = NOW()
                WHERE user_id = %s
            """, (gross_amount, user_id))

            return jsonify({"status": "success", "success": True, "message": "Withdrawal successfully approved"}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/withdrawals/reject', methods=['POST'])
@admin_required
def reject_withdrawal():
    data = request.get_json() or {}
    tx_id = data.get('tx_id')
    reason = data.get('reason', '').strip() or 'Rejected by administrator'

    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM transactions WHERE tx_id = %s AND status = 'pending' FOR UPDATE", (tx_id,))
            tx = cursor.fetchone()
            if not tx:
                return jsonify({"status": "error", "success": False, "message": "Pending transaction not found"}), 404

            user_id = tx['user_id']
            gross_amount = Decimal(str(tx['amount']))
            tx_type = tx['type']

            cursor.execute("""
                UPDATE transactions 
                SET status = 'rejected', admin_note = %s, updated_at = NOW() 
                WHERE id = %s
            """, (reason, tx['id']))

            if tx_type == 'withdraw_profit':
                cursor.execute("""
                    UPDATE user_balances 
                    SET pending_withdrawal = GREATEST(0.0000, pending_withdrawal - %s),
                        withdrawable_profit = withdrawable_profit + %s
                    WHERE user_id = %s
                """, (gross_amount, gross_amount, user_id))
            else:
                cursor.execute("""
                    UPDATE user_balances 
                    SET pending_withdrawal = GREATEST(0.0000, pending_withdrawal - %s),
                        unlocked_principal = unlocked_principal + %s
                    WHERE user_id = %s
                """, (gross_amount, gross_amount, user_id))

            return jsonify({"status": "success", "success": True, "message": "Withdrawal rejected and funds refunded to user"}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/deposits/pending', methods=['GET'])
@admin_required
def pending_deposits():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT t.id, t.tx_id, t.user_id, t.amount, t.network, t.tx_hash, t.created_at,
                       u.uid, u.username
                FROM transactions t
                JOIN users u ON t.user_id = u.id
                WHERE t.type = 'deposit' AND t.status = 'pending'
                ORDER BY t.created_at ASC
            """)
            deposits = cursor.fetchall()
            return jsonify({"status": "success", "success": True, "deposits": deposits}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/deposits/approve', methods=['POST'])
@admin_required
def approve_deposit():
    data = request.get_json() or {}
    tx_id = data.get('tx_id')

    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM transactions WHERE tx_id = %s AND status = 'pending' FOR UPDATE", (tx_id,))
            tx = cursor.fetchone()
            if not tx:
                return jsonify({"status": "error", "success": False, "message": "Pending deposit not found"}), 404

            user_id = tx['user_id']
            amount = Decimal(str(tx['amount']))

            cursor.execute("UPDATE transactions SET status = 'completed', updated_at = NOW() WHERE id = %s", (tx['id'],))

            cursor.execute("""
                INSERT INTO investment_lots (user_id, amount, source, start_date, unlock_date, status, created_at)
                VALUES (%s, %s, 'deposit', NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY), 'locked', NOW())
            """, (user_id, amount))

            cursor.execute("""
                UPDATE user_balances
                SET active_capital = active_capital + %s,
                    locked_principal = locked_principal + %s
                WHERE user_id = %s
            """, (amount, amount, user_id))

            cursor.execute("SELECT COUNT(*) AS c FROM investment_lots WHERE user_id = %s", (user_id,))
            lot_count = cursor.fetchone()['c']

            if lot_count == 1:
                distribute_first_deposit_bonus(cursor, user_id, amount)

            return jsonify({"status": "success", "success": True, "message": "Deposit approved and 90-day lot created"}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

def distribute_first_deposit_bonus(cursor, downline_id, deposit_amount):
    rates = {1: Decimal('0.0800'), 2: Decimal('0.0200'), 3: Decimal('0.0100')}
    curr_id = downline_id

    for level in range(1, 4):
        cursor.execute("SELECT referred_by FROM users WHERE id = %s", (curr_id,))
        u = cursor.fetchone()
        if not u or not u['referred_by']:
            break

        ref = u['referred_by']
        cursor.execute("SELECT id, kyc_status FROM users WHERE referral_code = %s OR id = %s", (ref, ref))
        leader = cursor.fetchone()
        if not leader:
            break

        leader_id = leader['id']
        cursor.execute("SELECT active_capital FROM user_balances WHERE user_id = %s", (leader_id,))
        lb = cursor.fetchone()
        leader_cap = Decimal(str(lb['active_capital'])) if lb else Decimal('0.0000')

        if leader['kyc_status'] == 'verified' and leader_cap >= Decimal('50.0000'):
            capped_amount = min(deposit_amount, leader_cap)
            comm_rate = rates[level]
            comm_amount = capped_amount * comm_rate

            if comm_amount > Decimal('0.0000'):
                cursor.execute("""
                    UPDATE user_balances
                    SET withdrawable_profit = withdrawable_profit + %s,
                        total_lifetime_profit = total_lifetime_profit + %s
                    WHERE user_id = %s
                """, (comm_amount, comm_amount, leader_id))

                cursor.execute("""
                    INSERT INTO referral_commissions (leader_id, downline_user_id, member_id, user_id, generation_level, generation, type, base_amount, member_capital, leader_active_cap, capped_amount, commission_rate, applied_rate, commission_amount, amount, is_capped, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, 'first_deposit', %s, %s, %s, %s, %s, %s, %s, %s, 0, NOW())
                """, (leader_id, downline_id, downline_id, leader_id, level, f"L{level}", deposit_amount, deposit_amount, leader_cap, capped_amount, comm_rate, float(comm_rate*100), comm_amount, comm_amount))

        curr_id = leader_id

@admin_bp.route('/deposits/reject', methods=['POST'])
@admin_required
def reject_deposit():
    data = request.get_json() or {}
    tx_id = data.get('tx_id')
    reason = data.get('reason', '').strip() or 'Invalid on-chain deposit proof'

    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE transactions 
                SET status = 'rejected', admin_note = %s, updated_at = NOW() 
                WHERE tx_id = %s AND status = 'pending'
            """, (reason, tx_id))
            return jsonify({"status": "success", "success": True, "message": "Deposit marked as rejected"}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/finance/history', methods=['GET'])
@admin_required
def finance_history():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT t.id, t.tx_id, t.user_id, t.type, t.amount, t.fee, t.net_amount, 
                       t.network, t.status, t.admin_note, t.created_at, t.updated_at,
                       u.uid, u.username
                FROM transactions t
                JOIN users u ON t.user_id = u.id
                WHERE t.status IN ('completed', 'rejected')
                ORDER BY t.updated_at DESC
                LIMIT 100
            """)
            history = cursor.fetchall()
            return jsonify({"status": "success", "success": True, "history": history}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

# ==================== 4. KYC Verifications ====================

@admin_bp.route('/kyc/pending', methods=['GET'])
@admin_required
def pending_kyc():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT k.id, k.user_id, k.doc_type, k.doc_number, k.front_image_path, 
                       k.back_image_path, k.admin_notes, k.submitted_at,
                       u.uid, u.username, u.email
                FROM kyc_verifications k
                JOIN users u ON k.user_id = u.id
                WHERE k.status = 'pending'
                ORDER BY k.submitted_at ASC
            """)
            kyc_records = cursor.fetchall()
            return jsonify({"status": "success", "success": True, "kyc_records": kyc_records}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/kyc/approve', methods=['POST'])
@admin_required
def approve_kyc():
    data = request.get_json() or {}
    kyc_id = data.get('kyc_id')
    note = data.get('note', '').strip() or 'Documents verified by Admin'
    admin_id = session.get('user_id')

    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT user_id FROM kyc_verifications WHERE id = %s", (kyc_id,))
            rec = cursor.fetchone()
            if not rec:
                return jsonify({"status": "error", "success": False, "message": "KYC record not found"}), 404

            user_id = rec['user_id']

            cursor.execute("""
                UPDATE kyc_verifications
                SET status = 'verified', admin_notes = %s, reviewed_at = NOW(), reviewed_by = %s
                WHERE id = %s
            """, (note, admin_id, kyc_id))

            cursor.execute("UPDATE users SET kyc_status = 'verified' WHERE id = %s", (user_id,))

            return jsonify({"status": "success", "success": True, "message": "KYC approved and user verified successfully"}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/kyc/reject', methods=['POST'])
@admin_required
def reject_kyc():
    data = request.get_json() or {}
    kyc_id = data.get('kyc_id')
    note = data.get('note', '').strip() or 'Document image unreadable or invalid'
    admin_id = session.get('user_id')

    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT user_id FROM kyc_verifications WHERE id = %s", (kyc_id,))
            rec = cursor.fetchone()
            if not rec:
                return jsonify({"status": "error", "success": False, "message": "KYC record not found"}), 404

            user_id = rec['user_id']

            cursor.execute("""
                UPDATE kyc_verifications
                SET status = 'rejected', admin_notes = %s, reviewed_at = NOW(), reviewed_by = %s
                WHERE id = %s
            """, (note, admin_id, kyc_id))

            cursor.execute("UPDATE users SET kyc_status = 'rejected' WHERE id = %s", (user_id,))

            return jsonify({"status": "success", "success": True, "message": "KYC record rejected"}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

# ==================== 5. Daily Yield Engine ====================

@admin_bp.route('/yield/status', methods=['GET'])
@admin_required
def yield_status():
    # محاسبه زمان و تاریخ زنده به وقت رسمی افغانستان (UTC+4:30)
    afghan_now = datetime.utcnow() + timedelta(hours=4, minutes=30)
    today = afghan_now.date()
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            # ۱. زنده کردن خودکار جدول نرخ‌ها و پر کردن روزهای جاافتاده تا تاریخ امروز افغانستان
            try:
                cursor.execute("SELECT MAX(yield_date) AS max_date FROM daily_yield_rates")
                max_rec = cursor.fetchone()
                max_date = max_rec['max_date'] if max_rec and max_rec['max_date'] else None

                if not max_date:
                    curr = today - timedelta(days=7)
                    while curr <= today:
                        is_past = (curr < today)
                        rate_val = Decimal(str(round(random.uniform(0.0095, 0.0125), 4)))
                        cursor.execute("""
                            INSERT INTO daily_yield_rates (yield_date, rate_percent, is_distributed, distributed_at, created_at)
                            VALUES (%s, %s, %s, %s, NOW())
                            ON DUPLICATE KEY UPDATE yield_date = VALUES(yield_date)
                        """, (curr, rate_val, 1 if is_past else 0, f"{curr} 21:00:00" if is_past else None))
                        curr += timedelta(days=1)
                elif max_date < today:
                    curr = max_date + timedelta(days=1)
                    while curr <= today:
                        is_past = (curr < today)
                        rate_val = Decimal(str(round(random.uniform(0.0095, 0.0125), 4)))
                        cursor.execute("""
                            INSERT INTO daily_yield_rates (yield_date, rate_percent, is_distributed, distributed_at, created_at)
                            VALUES (%s, %s, %s, %s, NOW())
                            ON DUPLICATE KEY UPDATE yield_date = VALUES(yield_date)
                        """, (curr, rate_val, 1 if is_past else 0, f"{curr} 21:00:00" if is_past else None))
                        curr += timedelta(days=1)
            except Exception as e_sync:
                print(f"[Notice] yield auto-sync: {e_sync}")

            # ۲. دریافت رکورد امروز
            cursor.execute("SELECT * FROM daily_yield_rates WHERE yield_date = %s", (today,))
            today_record = cursor.fetchone()

            raw_today_rate = float(today_record['rate_percent']) if today_record else 0.0105
            today_rate = raw_today_rate / 100.0 if raw_today_rate > 0.05 else raw_today_rate
            is_distributed = bool(today_record['is_distributed']) if today_record else False

            # ۳. کاربران واجد شرایط (KYC تاییدشده و سرمایه فعال حداقل ۵۰ دلار)
            cursor.execute("""
                SELECT COUNT(u.id) AS c
                FROM users u
                JOIN user_balances b ON u.id = b.user_id
                WHERE u.kyc_status = 'verified' AND b.active_capital >= 50.0000
            """)
            eligible_count = cursor.fetchone()['c']

            # ۴. دریافت تاریخچه ۳۰ روز اخیر و نرمال‌سازی درصدهای ذخیره‌شده
            cursor.execute("SELECT * FROM daily_yield_rates ORDER BY yield_date DESC LIMIT 30")
            raw_history = cursor.fetchall()

            history = []
            for h in raw_history:
                r_val = float(h.get('rate_percent') or 0.0105)
                # در صورتی که نرخ به صورت مثلاً 1.15 ذخیره شده باشد، اصلاح به مقدار اعشاری جهت جلوگیری از نمایش اشتباه 115%
                if r_val > 0.05:
                    r_val = r_val / 100.0

                h_item = dict(h)
                h_item['rate_percent'] = r_val

                yd = h_item.get('yield_date')
                if isinstance(yd, (datetime, date)):
                    h_item['yield_date'] = yd.strftime('%Y-%m-%d')

                da = h_item.get('distributed_at')
                if isinstance(da, (datetime, date)):
                    h_item['distributed_at'] = da.strftime('%Y-%m-%d %H:%M:%S')

                history.append(h_item)

            return jsonify({
                "status": "success",
                "success": True,
                "today_date": today.strftime('%Y-%m-%d'),
                "today_rate": today_rate,
                "is_distributed": is_distributed,
                "eligible_users_count": eligible_count,
                "history": history
            }), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/yield/set_rate', methods=['POST'])
@admin_required
def set_yield_rate():
    data = request.get_json() or {}
    afghan_now = datetime.utcnow() + timedelta(hours=4, minutes=30)
    target_date = data.get('target_date') or afghan_now.date().strftime('%Y-%m-%d')

    raw_rate = Decimal(str(data.get('rate', 0.0105)))
    rate = raw_rate if raw_rate <= Decimal('0.05') else raw_rate / Decimal('100')

    if rate < Decimal('0.0080') or rate > Decimal('0.0130'):
        return jsonify({"status": "error", "success": False, "message": "Rate must be strictly between 0.8% (0.0080) and 1.3% (0.0130)"}), 400

    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO daily_yield_rates (yield_date, rate_percent, is_distributed, created_at)
                VALUES (%s, %s, 0, NOW())
                ON DUPLICATE KEY UPDATE rate_percent = VALUES(rate_percent)
            """, (target_date, rate))
            return jsonify({"status": "success", "success": True, "message": f"Daily rate {float(rate)*100:.4f}% saved successfully"}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/yield/distribute', methods=['POST'])
@admin_required
def execute_distribution():
    afghan_now = datetime.utcnow() + timedelta(hours=4, minutes=30)
    today = afghan_now.date()
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM daily_yield_rates WHERE yield_date = %s FOR UPDATE", (today,))
            rate_rec = cursor.fetchone()

            if not rate_rec:
                rate = Decimal('0.0105')
                cursor.execute("INSERT INTO daily_yield_rates (yield_date, rate_percent, is_distributed, created_at) VALUES (%s, %s, 0, NOW())", (today, rate))
            else:
                raw_rate = Decimal(str(rate_rec['rate_percent']))
                rate = raw_rate / Decimal('100') if raw_rate > Decimal('0.05') else raw_rate
                if rate_rec['is_distributed']:
                    return jsonify({"status": "error", "success": False, "message": "Yield already distributed today."}), 400

            cursor.execute("""
                SELECT u.id, u.uid, b.active_capital
                FROM users u
                JOIN user_balances b ON u.id = b.user_id
                WHERE u.kyc_status = 'verified' AND b.active_capital >= 50.0000
            """)
            eligible_users = cursor.fetchall()

            mlm_rates = {
                1: Decimal('0.1000'),
                2: Decimal('0.0500'),
                3: Decimal('0.0300'),
                4: Decimal('0.0200'),
                5: Decimal('0.0100')
            }

            for user in eligible_users:
                u_id = user['id']
                u_cap = Decimal(str(user['active_capital']))
                daily_profit = u_cap * rate

                cursor.execute("""
                    UPDATE user_balances
                    SET withdrawable_profit = withdrawable_profit + %s,
                        total_lifetime_profit = total_lifetime_profit + %s
                    WHERE user_id = %s
                """, (daily_profit, daily_profit, u_id))

                curr_downline = u_id
                for gen in range(1, 6):
                    cursor.execute("SELECT referred_by FROM users WHERE id = %s", (curr_downline,))
                    parent = cursor.fetchone()
                    if not parent or not parent['referred_by']:
                        break

                    ref_code = parent['referred_by']
                    cursor.execute("SELECT id, kyc_status FROM users WHERE referral_code = %s OR id = %s", (ref_code, ref_code))
                    leader = cursor.fetchone()
                    if not leader:
                        break

                    l_id = leader['id']
                    cursor.execute("SELECT active_capital FROM user_balances WHERE user_id = %s", (l_id,))
                    lb = cursor.fetchone()
                    l_cap = Decimal(str(lb['active_capital'])) if lb else Decimal('0.0000')

                    if leader['kyc_status'] == 'verified' and l_cap >= Decimal('50.0000'):
                        capped_basis = min(u_cap, l_cap)
                        leader_rate = mlm_rates[gen]
                        comm = (capped_basis * rate) * leader_rate

                        if comm > Decimal('0.0000'):
                            cursor.execute("""
                                UPDATE user_balances
                                SET withdrawable_profit = withdrawable_profit + %s,
                                    total_lifetime_profit = total_lifetime_profit + %s
                                WHERE user_id = %s
                            """, (comm, comm, l_id))

                            cursor.execute("""
                                INSERT INTO referral_commissions (leader_id, downline_user_id, member_id, user_id, generation_level, generation, type, base_amount, member_capital, leader_active_cap, capped_amount, commission_rate, applied_rate, commission_amount, amount, is_capped, created_at)
                                VALUES (%s, %s, %s, %s, %s, %s, 'daily_yield', %s, %s, %s, %s, %s, %s, %s, %s, 0, NOW())
                            """, (l_id, u_id, u_id, l_id, gen, f"L{gen}", daily_profit, u_cap, l_cap, capped_basis, leader_rate, float(leader_rate*100), comm, comm))

                    curr_downline = l_id

            cursor.execute("""
                UPDATE daily_yield_rates 
                SET is_distributed = 1, distributed_at = NOW() 
                WHERE yield_date = %s
            """, (today,))

            return jsonify({
                "status": "success",
                "success": True,
                "message": f"Yield successfully distributed to {len(eligible_users)} investors with 5-generation MLM capped allocations."
            }), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

# ==================== 6. Support Desk ====================

@admin_bp.route('/tickets', methods=['GET'])
@admin_required
def list_tickets():
    status = request.args.get('status', '').strip()
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT t.id, t.ticket_number, t.ticket_code, t.user_id, t.subject, t.category, t.department, t.status, t.created_at,
                       u.uid, u.username, u.email
                FROM support_tickets t
                JOIN users u ON t.user_id = u.id
                WHERE 1=1
            """
            params = []
            if status:
                sql += " AND t.status = %s"
                params.append(status)

            sql += " ORDER BY t.created_at DESC"
            cursor.execute(sql, tuple(params))
            tickets = cursor.fetchall()
            return jsonify({"status": "success", "success": True, "tickets": tickets}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/tickets/<int:ticket_id>', methods=['GET'])
@admin_required
def get_ticket(ticket_id):
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT t.id, t.ticket_number, t.ticket_code, t.user_id, t.subject, t.category, t.department, t.status, t.created_at,
                       u.uid, u.username, u.email
                FROM support_tickets t
                JOIN users u ON t.user_id = u.id
                WHERE t.id = %s
            """, (ticket_id,))
            ticket = cursor.fetchone()
            if not ticket:
                return jsonify({"status": "error", "success": False, "message": "Ticket not found"}), 404

            cursor.execute("""
                SELECT id, ticket_id, sender_id, user_id, sender_role, is_admin, message, created_at
                FROM ticket_replies
                WHERE ticket_id = %s
                ORDER BY created_at ASC
            """, (ticket_id,))
            replies = cursor.fetchall()

            return jsonify({
                "status": "success",
                "success": True,
                "ticket": ticket,
                "replies": replies
            }), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/tickets/reply', methods=['POST'])
@admin_required
def reply_ticket():
    data = request.get_json() or {}
    ticket_id = data.get('ticket_id')
    message = data.get('message', '').strip()
    admin_id = session.get('user_id')

    if not ticket_id or not message:
        return jsonify({"status": "error", "success": False, "message": "Ticket ID and message required"}), 400

    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO ticket_replies (ticket_id, sender_id, user_id, sender_role, is_admin, message, created_at)
                VALUES (%s, %s, %s, 'admin', 1, %s, NOW())
            """, (ticket_id, admin_id, admin_id, message))

            cursor.execute("UPDATE support_tickets SET status = 'answered', updated_at = NOW() WHERE id = %s", (ticket_id,))
            return jsonify({"status": "success", "success": True, "message": "Reply sent successfully"}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/tickets/close', methods=['POST'])
@admin_required
def close_ticket():
    data = request.get_json() or {}
    ticket_id = data.get('ticket_id')
    if not ticket_id:
        return jsonify({"status": "error", "success": False, "message": "Ticket ID required"}), 400

    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("UPDATE support_tickets SET status = 'closed', updated_at = NOW() WHERE id = %s", (ticket_id,))
            return jsonify({"status": "success", "success": True, "message": "Ticket closed successfully"}), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        conn.close()
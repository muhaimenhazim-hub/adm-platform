# -*- coding: utf-8 -*-
"""
ماژول اختصاصی داشبورد اصلی (Home Dashboard Backend)
مدیریت تراز مالی، شرط حداقل ۵۰ دلار سرمایه، کامپاند و درخواست‌های برداشت
"""

from flask import Blueprint, request, jsonify
import pymysql
from datetime import datetime, timezone, timedelta
from config import get_db

home_bp = Blueprint('home_bp', __name__, url_prefix='/api/home')

def get_settlement_time():
    settlement_tz = timezone(timedelta(hours=4, minutes=30))
    return datetime.now(settlement_tz)

# ==============================================================================
# ۱. دریافت آمار واقعی داشبورد با اعمال شرط حداقل ۵۰ دلار سرمایه و زمان تسویه
# ==============================================================================
@home_bp.route('/stats', methods=['POST'])
def get_dashboard_stats():
    data = request.get_json() or {}
    user_id = data.get('userId')

    if not user_id:
        return jsonify({'success': False, 'message': 'شناسه کاربر ارسال نشده است.'}), 400

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            # واکشی اطلاعات حساب و کیف‌پول به همراه تراز مالی
            sql = """
                SELECT u.id, u.uid, u.username, u.role, u.kyc_status, u.referral_code,
                       COALESCE(b.active_capital, 0.00) AS active_capital,
                       COALESCE(b.locked_principal, 0.00) AS locked_principal,
                       COALESCE(b.unlocked_principal, 0.00) AS unlocked_principal,
                       COALESCE(b.withdrawable_profit, 0.00) AS withdrawable_profit,
                       COALESCE(b.total_lifetime_profit, 0.00) AS total_lifetime_profit,
                       COALESCE(b.last_profit_action_date, u.created_at) AS last_action
                FROM users u
                LEFT JOIN user_balances b ON u.id = b.user_id
                WHERE u.id = %s
            """
            cursor.execute(sql, (user_id,))
            user = cursor.fetchone()

            if not user:
                return jsonify({'success': False, 'message': 'کاربر یافت نشد.'}), 404

            # واکشی آخرین نرخ سود روزانه سیستم
            cursor.execute("SELECT rate_percent, is_distributed FROM daily_yield_rates WHERE yield_date = CURDATE()")
            rate_row = cursor.fetchone()
            daily_rate = float(rate_row['rate_percent']) if rate_row else 1.1500

            active_cap = float(user['active_capital'] or 0.0)
            kyc_status = user['kyc_status']

            now_settlement = get_settlement_time()
            is_after_settlement = (now_settlement.hour >= 21) or bool(rate_row and rate_row.get('is_distributed'))

            # قانون طلایی: سرمایه زیر ۵۰ دلار یا عدم تأیید KYC = سود روزانه صفر
            if active_cap < 50.00 or kyc_status != 'verified':
                today_profit = 0.00
                display_rate = 0.00
                is_released = False
            else:
                today_profit = round((active_cap * daily_rate) / 100.0, 4)
                display_rate = daily_rate
                is_released = is_after_settlement

            # محاسبه تعداد روزهای سپری شده از آخرین اقدام (مبنای پله کارمزد)
            last_action_date = user['last_action']
            days_elapsed = 0
            if last_action_date:
                try:
                    if hasattr(last_action_date, 'tzinfo') and last_action_date.tzinfo:
                        diff = datetime.now(last_action_date.tzinfo) - last_action_date
                    else:
                        diff = datetime.now() - last_action_date
                    days_elapsed = max(0, diff.days)
                except Exception:
                    days_elapsed = 0

            return jsonify({
                'success': True,
                'data': {
                    'role': user['role'],
                    'uid': user['uid'],
                    'referralCode': user['referral_code'],
                    'activeCapital': active_cap,
                    'withdrawableProfit': float(user['withdrawable_profit'] or 0.0),
                    'unlockedPrincipal': float(user['unlocked_principal'] or 0.0),
                    'totalLifetimeProfit': float(user['total_lifetime_profit'] or 0.0),
                    'todayProfit': today_profit,
                    'dailyRate': display_rate,
                    'isReleased': is_released,
                    'daysElapsed': days_elapsed,
                    'kycStatus': kyc_status
                }
            }), 200

    except Exception as e:
        return jsonify({'success': False, 'message': f'خطای سرور: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

# ==============================================================================
# ۲. عملیات ترکیب سود (Compound)
# ==============================================================================
@home_bp.route('/compound', methods=['POST'])
def execute_compound():
    data = request.get_json() or {}
    user_id = data.get('userId')
    amount = data.get('amount')

    if not user_id:
        return jsonify({'success': False, 'message': 'شناسه کاربر نامعتبر است.'}), 400

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            # اگر مبلغ مشخص نشده بود، کل سود موجود را ترکیب می‌کند
            if not amount or float(amount) <= 0:
                cursor.execute("SELECT withdrawable_profit FROM user_balances WHERE user_id = %s", (user_id,))
                row = cursor.fetchone()
                amount = float(row['withdrawable_profit']) if row and row['withdrawable_profit'] else 0.0

            if amount <= 0:
                return jsonify({'success': False, 'message': 'موجودی سود قابل برداشت برای ترکیب صفر است.'}), 400

            # فراخوانی پروسیجر دیتابیس
            cursor.execute("CALL sp_execute_compound(%s, %s, @p_status, @p_msg)", (user_id, amount))
            cursor.execute("SELECT @p_status AS status_code, @p_msg AS message")
            result = cursor.fetchone()

            status_code = result['status_code'] if result else 500
            message = result['message'] if result else 'خطا در پردازش عملیات ترکیب سود'

            if status_code == 200:
                return jsonify({'success': True, 'message': message}), 200
            else:
                return jsonify({'success': False, 'message': message}), 400

    except Exception as e:
        return jsonify({'success': False, 'message': f'خطا: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

# ==============================================================================
# ۳. ثبت درخواست برداشت (Withdrawal)
# ==============================================================================
@home_bp.route('/withdraw', methods=['POST'])
def request_withdrawal():
    data = request.get_json() or {}
    user_id = data.get('userId')
    withdraw_type = data.get('type')  # 'profit' یا 'principal'
    amount = float(data.get('amount') or 0)
    address = data.get('address', '').strip()
    network = data.get('network', 'TRC20')

    if not user_id or amount <= 0 or len(address) < 6:
        return jsonify({'success': False, 'message': 'اطلاعات ورودی برداشت نامعتبر است.'}), 400

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            if withdraw_type == 'profit':
                cursor.execute("CALL sp_request_withdraw_profit(%s, %s, %s, %s, @p_status, @p_msg)",
                               (user_id, amount, network, address))
            else:
                cursor.execute("CALL sp_request_withdraw_principal(%s, %s, %s, %s, @p_status, @p_msg)",
                               (user_id, amount, network, address))

            cursor.execute("SELECT @p_status AS status_code, @p_msg AS message")
            result = cursor.fetchone()

            status_code = result['status_code'] if result else 500
            message = result['message'] if result else 'خطا در ثبت درخواست برداشت'

            if status_code == 200:
                return jsonify({'success': True, 'message': message}), 200
            else:
                return jsonify({'success': False, 'message': message}), 400

    except Exception as e:
        return jsonify({'success': False, 'message': f'خطا: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()
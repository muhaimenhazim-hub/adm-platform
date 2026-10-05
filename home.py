# -*- coding: utf-8 -*-
"""
==============================================================================
ADM Investment Platform - Home Dashboard Backend Blueprint
File: home.py
Prefix: /api/home
Database: Configured centrally via config.py (Unified Connection Hub)
==============================================================================
"""

import math
from datetime import datetime, timezone, timedelta
from flask import Blueprint, request, jsonify, session
import pymysql
from config import get_db

home_bp = Blueprint('home_bp', __name__, url_prefix='/api/home')

def get_profit_cycle_state():
    """
    محاسبه دقیق وضعیت چرخه سود روزانه هماهنگ با بخش سرمایه‌گذاری:
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

# ==============================================================================
# ۱. دریافت آمار واقعی داشبورد با اعمال شرط حداقل ۵۰ دلار و زمان تسویه ۹ شب
# ==============================================================================
@home_bp.route('/stats', methods=['POST'])
def get_dashboard_stats():
    data = request.get_json() or {}
    user_id = data.get('userId') or session.get('user_id')

    if not user_id:
        return jsonify({'success': False, 'message': 'شناسه کاربر ارسال نشده است.'}), 400

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            current_date, is_released, _ = get_profit_cycle_state()
            daily_rate, is_distributed_db = get_or_create_daily_rate(cursor, current_date)

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

            active_cap = float(user['active_capital'] or 0.0)
            kyc_status = user['kyc_status']
            has_investment = (active_cap >= 50.00 and kyc_status == 'verified')

            today_profit = round((active_cap * daily_rate) / 100.0, 2) if has_investment else 0.00
            display_rate = daily_rate if has_investment else 0.00

            total_lifetime = float(user['total_lifetime_profit'] or 0.0)
            withdrawable = float(user['withdrawable_profit'] or 0.0)

            # با رسیدن ساعت ۹ شب، سود روزانه به مجموع سودها و سود قابل برداشت کاربر اضافه می‌شود
            if is_released and has_investment and not is_distributed_db:
                total_lifetime = round(total_lifetime + today_profit, 2)
                withdrawable = round(withdrawable + today_profit, 2)

            # محاسبه تعداد روزهای سپری شده از آخرین اقدام جهت قانون ۱۰ روز نگهداری
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
                    'referral_code': user['referral_code'],
                    'activeCapital': active_cap,
                    'active_capital': active_cap,
                    'lockedPrincipal': float(user['locked_principal'] or 0.0),
                    'unlockedPrincipal': float(user['unlocked_principal'] or 0.0),
                    'unlocked_principal': float(user['unlocked_principal'] or 0.0),
                    'withdrawableProfit': withdrawable,
                    'withdrawable_profit': withdrawable,
                    'totalLifetimeProfit': total_lifetime,
                    'total_lifetime_profit': total_lifetime,
                    'todayProfit': today_profit,
                    'today_profit': today_profit,
                    'dailyRate': display_rate,
                    'daily_rate': display_rate,
                    'isReleased': is_released,
                    'is_released': is_released,
                    'daysElapsed': days_elapsed,
                    'days_since_last_compound': days_elapsed,
                    'kycStatus': kyc_status,
                    'hasInvestment': has_investment
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
    user_id = data.get('userId') or session.get('user_id')
    amount = data.get('amount')

    if not user_id:
        return jsonify({'success': False, 'message': 'شناسه کاربر نامعتبر است.'}), 400

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            if not amount or float(amount) <= 0:
                cursor.execute("SELECT withdrawable_profit FROM user_balances WHERE user_id = %s", (user_id,))
                row = cursor.fetchone()
                amount = float(row['withdrawable_profit']) if row and row['withdrawable_profit'] else 0.0

            if amount <= 0:
                return jsonify({'success': False, 'message': 'موجودی سود قابل برداشت برای ترکیب صفر است.'}), 400

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
    user_id = data.get('userId') or session.get('user_id')
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
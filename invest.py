# -*- coding: utf-8 -*-
"""
==============================================================================
ADM Investment Platform - Investment & Analytics Backend Blueprint
File: invest.py
Prefix: /api/invest
Database: Configured centrally via config.py (Unified Connection Hub)
==============================================================================
"""

import math
from datetime import datetime, timezone, timedelta
from flask import Blueprint, request, jsonify, session
import pymysql
from config import get_db

invest_bp = Blueprint('invest_bp', __name__, url_prefix='/api/invest')

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

# ==============================================================================
# ۱. دریافت اطلاعات کامل صفحه سرمایه‌گذاری و تفکیک موجودی سود ۱۰ روزه
# ==============================================================================
@invest_bp.route('/data', methods=['POST'])
def get_investment_data():
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

            sql_user = """
                SELECT u.id, u.role, u.kyc_status,
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
            cursor.execute(sql_user, (user_id,))
            user = cursor.fetchone()

            if not user:
                return jsonify({'success': False, 'message': 'کاربر یافت نشد.'}), 404

            active_cap = float(user['active_capital'] or 0.0)
            kyc_status = user['kyc_status']
            has_investment = (active_cap >= 50.00 and kyc_status == 'verified')

            today_profit = round((active_cap * daily_rate) / 100.0, 2) if has_investment else 0.00
            display_rate = daily_rate if has_investment else 0.00

            accumulated_profit = float(user['total_lifetime_profit'] or 0.0)
            available_profit = float(user['withdrawable_profit'] or 0.0)

            # با آزادسازی در ساعت ۹ شب، سود روزانه به «مجموع سودهای انباشته» اضافه می‌شود
            # اما موجودی سود فعلی (قابل برداشت/ترکیب) تنها شامل سودهای بالغ ۱۰ روزه است
            if is_released and has_investment and not is_distributed_db:
                accumulated_profit = round(accumulated_profit + today_profit, 2)

            last_action_date = user['last_action']
            days_held = 0
            if last_action_date:
                try:
                    if hasattr(last_action_date, 'tzinfo') and last_action_date.tzinfo:
                        diff = datetime.now(last_action_date.tzinfo) - last_action_date
                    else:
                        diff = datetime.now() - last_action_date
                    days_held = max(0, diff.days)
                except Exception:
                    days_held = 0

            # واکشی لات‌های سرمایه‌گذاری با تاریخ عددی
            sql_lots = """
                SELECT id, amount, source, 
                       DATE_FORMAT(start_date, '%%Y-%%m-%%d') as reg_date,
                       DATEDIFF(NOW(), start_date) as days_passed,
                       GREATEST(0, DATEDIFF(unlock_date, NOW())) as days_left,
                       status
                FROM investment_lots
                WHERE user_id = %s
                ORDER BY id DESC
            """
            cursor.execute(sql_lots, (user_id,))
            lots = cursor.fetchall()

            # ساخت سوابق سودهای روزانه با فرمت عددی استاندارد (۱۰ روز اخیر)
            profit_history = []
            for i in range(10):
                d = current_date - timedelta(days=i)
                d_str = d.strftime('%Y-%m-%d')
                r, _ = get_or_create_daily_rate(cursor, d)
                day_amt = round((active_cap * r) / 100.0, 2) if has_investment else 0.00
                
                if i == 0:
                    profit_history.append({
                        'date': d_str,
                        'rate': r,
                        'amount': day_amt,
                        'credited': is_released
                    })
                else:
                    profit_history.append({
                        'date': d_str,
                        'rate': r,
                        'amount': day_amt,
                        'credited': True
                    })

            return jsonify({
                'success': True,
                'data': {
                    'role': user['role'],
                    'hasInvestment': has_investment,
                    'accumulatedProfit': accumulated_profit,
                    'availableProfit': available_profit,
                    'totalCapital': active_cap,
                    'lockedCapital': float(user['locked_principal'] or 0.0),
                    'unlockedCapital': float(user['unlocked_principal'] or 0.0),
                    'todayProfit': today_profit,
                    'dailyRate': display_rate,
                    'isReleased': is_released,
                    'daysHeld': days_held,
                    'lots': lots,
                    'profitHistory': profit_history
                }
            }), 200

    except Exception as e:
        return jsonify({'success': False, 'message': f'خطای سرور: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

# ==============================================================================
# ۲. دریافت داده‌های نمودار بازدهی
# ==============================================================================
@invest_bp.route('/chart', methods=['POST'])
def get_chart_data():
    data = request.get_json() or {}
    range_type = data.get('range', '30')
    current_date, is_released, _ = get_profit_cycle_state()

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            if range_type == 'today':
                today_rate, _ = get_or_create_daily_rate(cursor, current_date)
                points = []
                for h in range(24):
                    hour_label = f"{h:02d}:00"
                    seed = current_date.year * 1000 + current_date.day * 50 + h
                    wave = (math.sin(seed * 0.6) + math.cos(seed * 1.2)) * 0.08
                    hourly_rate = max(0.80, min(1.30, today_rate + wave))
                    points.append({
                        'date': hour_label,
                        'rate': round(hourly_rate, 2)
                    })
                return jsonify({'success': True, 'points': points}), 200

            if range_type == '7':
                days_count = 7
            elif range_type == '30':
                days_count = 30
            else:
                days_count = 180

            points = []
            for i in range(days_count - 1, -1, -1):
                d = current_date - timedelta(days=i)
                d_str = d.strftime('%Y-%m-%d')
                r, _ = get_or_create_daily_rate(cursor, d)
                points.append({
                    'date': d_str,
                    'rate': round(r, 2)
                })

            return jsonify({'success': True, 'points': points}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        if conn:
            conn.close()

# ==============================================================================
# ۳. ثبت ترکیب سود به اصل سرمایه
# ==============================================================================
@invest_bp.route('/compound', methods=['POST'])
def execute_compound():
    data = request.get_json() or {}
    user_id = data.get('userId') or session.get('user_id')
    amount = data.get('amount')

    if not user_id or not amount or float(amount) <= 0:
        return jsonify({'success': False, 'message': 'مبلغ وارد شده معتبر نیست.'}), 400

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("CALL sp_execute_compound(%s, %s, @p_status, @p_msg)", (user_id, amount))
            cursor.execute("SELECT @p_status AS status_code, @p_msg AS message")
            result = cursor.fetchone()

            status_code = result['status_code'] if result else 500
            message = result['message'] if result else 'خطا در ثبت عملیات'

            if status_code == 200:
                return jsonify({'success': True, 'message': message}), 200
            else:
                return jsonify({'success': False, 'message': message}), 400

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        if conn:
            conn.close()
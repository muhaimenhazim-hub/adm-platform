# -*- coding: utf-8 -*-
"""
ماژول سرمایه‌گذاری پلتفرم ADM
پشتیبانی از نوسانات ساعتی ۲۴ ساعته (امروز)، هفتگی، ماهانه و تاریخی از ۲۰۲۳
"""

from flask import Blueprint, request, jsonify
import pymysql
import math
from datetime import datetime, timezone, timedelta
from config import get_db

invest_bp = Blueprint('invest_bp', __name__, url_prefix='/api/invest')

def get_afghanistan_time():
    afghan_tz = timezone(timedelta(hours=4, minutes=30))
    return datetime.now(afghan_tz)

# ==============================================================================
# ۱. دریافت اطلاعات کامل صفحه سرمایه‌گذاری و سودها
# ==============================================================================
@invest_bp.route('/data', methods=['POST'])
def get_investment_data():
    data = request.get_json() or {}
    user_id = data.get('userId')

    if not user_id:
        return jsonify({'success': False, 'message': 'شناسه کاربر ارسال نشده است.'}), 400

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
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

            cursor.execute("SELECT rate_percent FROM daily_yield_rates WHERE yield_date = CURDATE()")
            rate_row = cursor.fetchone()
            daily_rate = float(rate_row['rate_percent']) if rate_row else 1.1500

            active_cap = float(user['active_capital'] or 0.0)
            kyc_status = user['kyc_status']

            now_afghan = get_afghanistan_time()
            is_after_9pm = now_afghan.hour >= 21

            has_investment = (active_cap >= 50.00 and kyc_status == 'verified')

            if has_investment:
                today_profit = round((active_cap * daily_rate) / 100.0, 4)
                display_rate = daily_rate
                is_released = is_after_9pm
            else:
                today_profit = 0.00
                display_rate = 0.00
                is_released = False

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

            sql_lots = """
                SELECT id, amount, source, 
                       DATE_FORMAT(start_date, '%%Y/%%m/%%d') as reg_date,
                       DATEDIFF(NOW(), start_date) as days_passed,
                       GREATEST(0, DATEDIFF(unlock_date, NOW())) as days_left,
                       status
                FROM investment_lots
                WHERE user_id = %s
                ORDER BY id DESC
            """
            cursor.execute(sql_lots, (user_id,))
            lots = cursor.fetchall()

            sql_history = """
                SELECT DATE_FORMAT(yield_date, '%%Y/%%m/%%d') as record_date,
                       rate_percent, is_distributed
                FROM daily_yield_rates
                ORDER BY yield_date DESC
                LIMIT 10
            """
            cursor.execute(sql_history)
            history_rows = cursor.fetchall()

            profit_history = []
            for h in history_rows:
                rate = float(h['rate_percent'])
                user_day_amount = round((active_cap * rate) / 100.0, 2) if has_investment else 0.00
                profit_history.append({
                    'date': h['record_date'],
                    'rate': rate,
                    'amount': user_day_amount,
                    'credited': bool(h['is_distributed'])
                })

            return jsonify({
                'success': True,
                'data': {
                    'role': user['role'],
                    'hasInvestment': has_investment,
                    'accumulatedProfit': float(user['total_lifetime_profit'] or 0.0),
                    'availableProfit': float(user['withdrawable_profit'] or 0.0),
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
# ۲. دریافت داده‌های نمودار (۲۴ ساعته امروز، ۷ روز، ۳۰ روز و کلی)
# ==============================================================================
@invest_bp.route('/chart', methods=['POST'])
def get_chart_data():
    data = request.get_json() or {}
    range_type = data.get('range', '30')
    today = datetime.now().date()

    conn = None
    real_db_rates = {}
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("SELECT yield_date, rate_percent FROM daily_yield_rates")
            for r in cursor.fetchall():
                real_db_rates[str(r['yield_date'])] = float(r['rate_percent'])
    except Exception:
        real_db_rates = {}
    finally:
        if conn:
            conn.close()

    points = []

    # الف) حالت روزانه: نوسانات ۲۴ ساعته امروز
    if range_type == 'today':
        today_base_rate = real_db_rates.get(today.strftime('%Y-%m-%d'), 1.15)
        for h in range(24):
            hour_label = f"{h:02d}:00"
            seed = today.year * 1000 + today.day * 50 + h
            wave = (math.sin(seed * 0.6) + math.cos(seed * 1.2)) * 0.10
            hourly_rate = max(0.80, min(1.30, today_base_rate + wave))
            points.append({
                'date': hour_label,
                'rate': round(hourly_rate, 2)
            })
        return jsonify({'success': True, 'points': points}), 200

    # ب) حالت‌های ۷ روز، ۳۰ روز و همه (از ۲۰۲۳ تا امروز)
    if range_type == '7':
        start_date = today - timedelta(days=6)
        step_days = 1
    elif range_type == '30':
        start_date = today - timedelta(days=29)
        step_days = 1
    else:
        start_date = datetime(2023, 1, 1).date()
        diff_total = (today - start_date).days
        step_days = max(1, diff_total // 180)

    current_d = start_date
    while current_d <= today:
        d_str = current_d.strftime('%Y-%m-%d')
        if d_str in real_db_rates:
            rate = real_db_rates[d_str]
        else:
            seed = current_d.year * 412 + current_d.month * 37 + current_d.day
            wave = (math.sin(seed * 0.85) + math.cos(seed * 1.45)) / 2.0
            rate = 1.05 + (wave * 0.22)
            rate = max(0.80, min(1.30, rate))

        points.append({
            'date': d_str,
            'rate': round(rate, 2)
        })
        current_d += timedelta(days=step_days)

    today_str = today.strftime('%Y-%m-%d')
    if points and points[-1]['date'] != today_str:
        today_rate = real_db_rates.get(today_str, 1.15)
        points.append({
            'date': today_str,
            'rate': round(today_rate, 2)
        })

    return jsonify({'success': True, 'points': points}), 200

# ==============================================================================
# ۳. ثبت ترکیب سود به اصل سرمایه
# ==============================================================================
@invest_bp.route('/compound', methods=['POST'])
def execute_compound():
    data = request.get_json() or {}
    user_id = data.get('userId')
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
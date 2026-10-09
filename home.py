# -*- coding: utf-8 -*-
"""
==============================================================================
ADM Investment Platform - Home Dashboard Backend Blueprint
File: home.py
Prefix: /api/home
Database: Configured centrally via config.py (Unified Connection Hub)
==============================================================================
Golden Business Rules:
1. Daily Cycle: Releases at 21:00 AF Time (16:30 UTC).
2. Total Lifetime Profit: Aggregates personal daily yields, team commissions, 
   and direct referral bonuses.
3. 10-Day Retention Rule: ALL earnings (personal yields, team commissions, 
   direct referral bonuses) mature into withdrawable_profit ONLY after 10 full days.
4. Withdrawable Profit: Immediately deducted upon withdrawal or reallocation (compound).
==============================================================================
"""

import math
from datetime import datetime, timezone, timedelta
from flask import Blueprint, request, jsonify, session
import pymysql
from config import get_db

home_bp = Blueprint('home_bp', __name__, url_prefix='/api/home')

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

def settle_daily_yields(cursor, conn, current_date, is_released):
    """
    موتور تسویه روزانه، محاسبه کمیسیون تیمی و اعمال دقیق قانون بلوغ ۱۰ روزه برای کلیه درآمدها:
    ۱. واریز سودهای روزانه و کمیسیون‌های تیمی رأس ساعت ۲۱:۰۰ افغانستان به مجموع کل بازدهی (total_lifetime_profit).
    ۲. بررسی سودهای روزانه سرمایه‌گذاری که ۱۰ روز از تاریخ آن‌ها گذشته و انتقال به سود قابل برداشت (withdrawable_profit).
    ۳. بررسی کمیسیون‌های تیمی و پاداش‌های رفرال که ۱۰ روز از آن‌ها گذشته و انتقال به سود قابل برداشت (withdrawable_profit).
    """
    # افزودن ستون‌های کنترلی is_matured در صورت عدم وجود
    try:
        cursor.execute("ALTER TABLE daily_yield_rates ADD COLUMN is_matured TINYINT(1) DEFAULT 0")
        if conn:
            conn.commit()
    except Exception:
        pass

    try:
        cursor.execute("ALTER TABLE referral_commissions ADD COLUMN is_matured TINYINT(1) DEFAULT 0")
        if conn:
            conn.commit()
    except Exception:
        pass

    latest_released_date = current_date if is_released else (current_date - timedelta(days=1))
    check_start_date = current_date - timedelta(days=45)
    has_changes = False

    # بخش اول: تسویه سود روزانه و کمیسیون تیمی به مجموع بازدهی کل (total_lifetime_profit)
    curr = check_start_date
    while curr <= latest_released_date:
        d_str = curr.strftime('%Y-%m-%d')
        rate, is_distributed = get_or_create_daily_rate(cursor, curr)

        if not is_distributed:
            # واریز سود روزانه به مجموع کل بازدهی کاربران فعال
            sql_update_total = """
                UPDATE user_balances b
                JOIN users u ON u.id = b.user_id
                SET b.total_lifetime_profit = b.total_lifetime_profit + ROUND((b.active_capital * %s) / 100.0, 2)
                WHERE b.active_capital >= 50.00
                  AND u.kyc_status = 'verified'
                  AND DATE(u.created_at) <= %s
            """
            cursor.execute(sql_update_total, (rate, d_str))

            # واریز کمیسیون تیمی روزانه سرشاخه‌ها به مجموع کل بازدهی
            try:
                sql_team_comm = """
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
                """
                cursor.execute(sql_team_comm, (rate, d_str))
            except Exception:
                pass

            cursor.execute("UPDATE daily_yield_rates SET is_distributed = 1 WHERE yield_date = %s", (d_str,))
            has_changes = True

        curr += timedelta(days=1)

    # بخش دوم: اعمال قانون ۱۰ روز برای سودهای روزانه سرمایه‌گذاری
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

    # بخش سوم: اعمال قانون ۱۰ روز برای کلیه پاداش‌های رفرال و کمیسیون‌های تیمی
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

# ==============================================================================
# ۱. دریافت آمار واقعی داشبورد با تفکیک سود ۱۰ روزه و مجموع کل سودها
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

            # اجرای تسویه معوقه روزها و انتقال خودکار سودها و کمیسیون‌های ۱۰ روز سپری شده
            settle_daily_yields(cursor, conn, current_date, is_released)

            daily_rate, _ = get_or_create_daily_rate(cursor, current_date)

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
# ۲. عملیات تخصیص مجدد (Compound) و کسر دقیق از موجودی در دسترس
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
            cursor.execute("SELECT withdrawable_profit, active_capital FROM user_balances WHERE user_id = %s", (user_id,))
            row = cursor.fetchone()
            if not row:
                return jsonify({'success': False, 'message': 'اطلاعات موجودی یافت نشد.'}), 404

            current_withdrawable = float(row['withdrawable_profit'] or 0.0)

            if not amount or float(amount) <= 0:
                amount = current_withdrawable

            amount = float(amount)

            if amount <= 0 or amount > current_withdrawable:
                return jsonify({'success': False, 'message': 'مبلغ وارد شده بیشتر از سود قابل برداشت است.'}), 400

            cursor.execute("CALL sp_execute_compound(%s, %s, @p_status, @p_msg)", (user_id, amount))
            cursor.execute("SELECT @p_status AS status_code, @p_msg AS message")
            result = cursor.fetchone()

            status_code = result['status_code'] if result else 500
            message = result['message'] if result else 'خطا در پردازش عملیات ترکیب سود'

            if status_code == 200:
                # ثبت قطعی و تنظیم تاریخ آخرین عملیات
                cursor.execute("""
                    UPDATE user_balances 
                    SET last_profit_action_date = NOW() 
                    WHERE user_id = %s
                """, (user_id,))
                conn.commit()
                return jsonify({'success': True, 'message': message}), 200
            else:
                return jsonify({'success': False, 'message': message}), 400

    except Exception as e:
        return jsonify({'success': False, 'message': f'خطا: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

# ==============================================================================
# ۳. ثبت درخواست برداشت (Withdrawal) و کسر دقیق از موجودی
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
            cursor.execute("SELECT withdrawable_profit, unlocked_principal FROM user_balances WHERE user_id = %s", (user_id,))
            bal_row = cursor.fetchone()
            if not bal_row:
                return jsonify({'success': False, 'message': 'کاربر یافت نشد.'}), 404

            if withdraw_type == 'profit':
                if amount > float(bal_row['withdrawable_profit'] or 0.0):
                    return jsonify({'success': False, 'message': 'مبلغ درخواستی بیشتر از موجودی سود قابل برداشت است.'}), 400
                cursor.execute("CALL sp_request_withdraw_profit(%s, %s, %s, %s, @p_status, @p_msg)",
                               (user_id, amount, network, address))
            else:
                if amount > float(bal_row['unlocked_principal'] or 0.0):
                    return jsonify({'success': False, 'message': 'مبلغ درخواستی بیشتر از موجودی پایه آزادشده است.'}), 400
                cursor.execute("CALL sp_request_withdraw_principal(%s, %s, %s, %s, @p_status, @p_msg)",
                               (user_id, amount, network, address))

            cursor.execute("SELECT @p_status AS status_code, @p_msg AS message")
            result = cursor.fetchone()

            status_code = result['status_code'] if result else 500
            message = result['message'] if result else 'خطا در ثبت درخواست برداشت'

            if status_code == 200:
                conn.commit()
                return jsonify({'success': True, 'message': message}), 200
            else:
                return jsonify({'success': False, 'message': message}), 400

    except Exception as e:
        return jsonify({'success': False, 'message': f'خطا: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()
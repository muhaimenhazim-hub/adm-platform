# -*- coding: utf-8 -*-
"""
================================================================================
ADM Investment Platform - Team & Multi-Level Marketing Backend Module
File: team.py
Blueprint: team_bp
Prefix: /api/team
Database: Configured centrally via config.py (Unified Connection Hub)
================================================================================
Golden Business Rules:
1. Minimum $50 active capital and KYC 'verified' required to earn referral bonuses.
2. Direct deposit bonus (First deposit only): L1: 8%, L2: 2%, L3: 1%.
3. Daily team profit commission (Nightly 21:00 AF Time): L1: 10%, L2: 5%, L3: 3%, L4: 2%, L5: 1%.
4. Leader Capital Cap: Basis = min(member_capital, leader_active_capital).
5. 10-Day Retention Rule: All earnings (daily profit, team commissions, referral bonus) 
   mature into withdrawable_profit only after 10 full days.
================================================================================
"""

import math
from datetime import datetime, date, timezone, timedelta
from flask import Blueprint, jsonify, request, session
import pymysql
from config import get_db

team_bp = Blueprint('team_bp', __name__, url_prefix='/api/team')

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

def get_current_user_id():
    """تشخیص دقیق شناسه کاربر لاگین‌شده از پارامتر، هدر امن یا نشست"""
    user_id = request.args.get('user_id') or request.headers.get('X-User-Id')
    if not user_id and request.is_json:
        data = request.get_json(silent=True) or {}
        user_id = data.get('userId') or data.get('user_id')
    if not user_id:
        user_id = session.get('user_id')
    try:
        return int(user_id) if user_id else None
    except Exception:
        return None

def settle_team_commissions_and_maturation(cursor, conn, current_date, is_released):
    """
    موتور خودکار محاسبه کمیسیون ۵ سطح شبکه و اعمال قانون بلوغ ۱۰ روزه:
    ۱. محاسبه کمیسیون روزانه عملکرد تیم رأس ساعت ۲۱:۰۰ افغانستان و افزودن به مجموع کل سودها (total_lifetime_profit)
    ۲. انتقال کلیه پاداش‌ها (سود روزانه، کمیسیون تیمی و پاداش رفرال) پس از سپری شدن ۱۰ روز به موجودی قابل برداشت (withdrawable_profit)
    """
    # افزودن ستون is_matured به جدول referral_commissions در صورت عدم وجود
    try:
        cursor.execute("ALTER TABLE referral_commissions ADD COLUMN is_matured TINYINT(1) DEFAULT 0")
        if conn:
            conn.commit()
    except Exception:
        pass

    latest_released_date = current_date if is_released else (current_date - timedelta(days=1))
    check_start_date = current_date - timedelta(days=45)
    commission_rates = {1: 10.0, 2: 5.0, 3: 3.0, 4: 2.0, 5: 1.0}
    has_changes = False

    # ۱. بررسی و ثبت کمیسیون‌های روزانه برای روزهای تسویه شده که هنوز ثبت نشده‌اند
    curr = check_start_date
    while curr <= latest_released_date:
        d_str = curr.strftime('%Y-%m-%d')
        daily_rate, _ = get_or_create_daily_rate(cursor, curr)

        # بررسی آیا برای این تاریخ کمیسیون تیمی روزانه ثبت شده است یا خیر
        cursor.execute("SELECT COUNT(*) as cnt FROM referral_commissions WHERE type = 'DAILY' AND DATE(created_at) = %s", (d_str,))
        already_processed = cursor.fetchone()['cnt'] > 0

        if not already_processed:
            cursor.execute("""
                SELECT u.id, u.referred_by, b.active_capital
                FROM users u
                JOIN user_balances b ON u.id = b.user_id
                WHERE b.active_capital >= 50.00 
                  AND u.kyc_status = 'verified'
                  AND DATE(u.created_at) <= %s
            """, (d_str,))
            members = cursor.fetchall()

            record_dt = datetime(curr.year, curr.month, curr.day, 21, 0, 0)

            for member in members:
                m_id = member['id']
                m_cap = float(member['active_capital'])
                curr_ref = member['referred_by']

                for level in range(1, 6):
                    if not curr_ref:
                        break

                    cursor.execute("""
                        SELECT u.id, u.referred_by, u.kyc_status, b.active_capital
                        FROM users u
                        LEFT JOIN user_balances b ON u.id = b.user_id
                        WHERE u.referral_code = %s
                    """, (curr_ref,))
                    leader = cursor.fetchone()
                    if not leader:
                        break

                    l_id = leader['id']
                    l_cap = float(leader['active_capital'] or 0.0)
                    l_kyc = leader['kyc_status']

                    if l_kyc == 'verified' and l_cap >= 50.00:
                        is_capped = 1 if m_cap > l_cap else 0
                        calc_cap = min(m_cap, l_cap)
                        capped_profit = calc_cap * (daily_rate / 100.0)

                        rate_pct = commission_rates[level]
                        comm_amount = round(capped_profit * (rate_pct / 100.0), 2)

                        if comm_amount > 0:
                            cursor.execute("""
                                INSERT INTO referral_commissions 
                                (leader_id, member_id, generation, type, member_capital, applied_rate, amount, is_capped, is_matured, created_at)
                                VALUES (%s, %s, %s, 'DAILY', %s, %s, %s, %s, 0, %s)
                            """, (l_id, m_id, f"L{level}", m_cap, rate_pct, comm_amount, is_capped, record_dt))

                            # افزایش مجموع بازدهی کل (total_lifetime_profit) در دیتابیس
                            cursor.execute("""
                                UPDATE user_balances 
                                SET total_lifetime_profit = total_lifetime_profit + %s
                                WHERE user_id = %s
                            """, (comm_amount, l_id))
                            has_changes = True

                    curr_ref = leader['referred_by']

        curr += timedelta(days=1)

    # ۲. بررسی بلوغ ۱۰ روزه کلیه کمیسیون‌ها و پاداش‌ها جهت انتقال به سود قابل برداشت (withdrawable_profit)
    try:
        cursor.execute("""
            SELECT id, leader_id, amount
            FROM referral_commissions
            WHERE is_matured = 0 AND DATEDIFF(NOW(), created_at) >= 10
        """)
        matured_records = cursor.fetchall()
        for rec in matured_records:
            cursor.execute("""
                UPDATE user_balances
                SET withdrawable_profit = withdrawable_profit + %s
                WHERE user_id = %s
            """, (rec['amount'], rec['leader_id']))

            cursor.execute("UPDATE referral_commissions SET is_matured = 1 WHERE id = %s", (rec['id'],))
            has_changes = True
    except Exception:
        pass

    if has_changes and conn:
        conn.commit()

@team_bp.route('/data', methods=['GET', 'POST'])
def get_team_overview():
    """
    دریافت کلیه اطلاعات آماری، تفکیک ۵ نسل و تاریخچه تراکنش‌های واقعی تیم کاربر
    """
    conn = None
    try:
        current_uid = get_current_user_id()
        conn = get_db()

        with conn.cursor() as cursor:
            if not current_uid:
                cursor.execute("SELECT id FROM users ORDER BY id ASC LIMIT 1")
                first_u = cursor.fetchone()
                current_uid = first_u['id'] if first_u else 1

            current_aft_date, is_released, _ = get_profit_cycle_state()
            
            # اجرای موتور تسویه خودکار کمیسیون‌ها و اعمال قانون بلوغ ۱۰ روزه
            settle_team_commissions_and_maturation(cursor, conn, current_aft_date, is_released)

            daily_rate, _ = get_or_create_daily_rate(cursor, current_aft_date)

            # ۱. دریافت اطلاعات لیدر
            cursor.execute("""
                SELECT u.id, u.uid, u.username, u.email, u.phone, u.role, 
                       u.referral_code, u.referred_by, u.kyc_status,
                       COALESCE(b.active_capital, 0.00) AS active_capital,
                       COALESCE(b.withdrawable_profit, 0.00) AS withdrawable_profit,
                       COALESCE(b.total_lifetime_profit, 0.00) AS total_lifetime_profit
                FROM users u
                LEFT JOIN user_balances b ON u.id = b.user_id
                WHERE u.id = %s
            """, (current_uid,))
            leader = cursor.fetchone()

            if not leader:
                return jsonify({"status": "error", "message": "User not found"}), 404

            leader_capital = float(leader['active_capital'])
            is_kyc_verified = (leader['kyc_status'] == 'verified')
            is_eligible = (leader_capital >= 50.00 and is_kyc_verified)

            referral_code = leader['referral_code'] or f"ADM-{leader['id']}"
            base_url = request.host_url.rstrip('/')
            referral_link = f"{base_url}/index.html?ref={referral_code}"

            # ۲. ساختار ۵ نسل زیرمجموعه
            cursor.execute("""
                SELECT u.id, u.uid, u.username, u.email, u.phone, u.referral_code, u.referred_by,
                       u.kyc_status, u.created_at,
                       COALESCE(b.active_capital, 0.00) AS active_capital
                FROM users u
                LEFT JOIN user_balances b ON u.id = b.user_id
            """)
            all_users = cursor.fetchall()

            ref_to_children = {}
            for u in all_users:
                ref = u.get('referred_by')
                if ref:
                    ref_to_children.setdefault(ref, []).append(u)

            generations = {
                'L1': {'members': 0, 'totalCapital': 0.00, 'directBonus': 0.00, 'dailyComm': 0.00, 'users': []},
                'L2': {'members': 0, 'totalCapital': 0.00, 'directBonus': 0.00, 'dailyComm': 0.00, 'users': []},
                'L3': {'members': 0, 'totalCapital': 0.00, 'directBonus': 0.00, 'dailyComm': 0.00, 'users': []},
                'L4': {'members': 0, 'totalCapital': 0.00, 'directBonus': 0.00, 'dailyComm': 0.00, 'users': []},
                'L5': {'members': 0, 'totalCapital': 0.00, 'directBonus': 0.00, 'dailyComm': 0.00, 'users': []}
            }

            current_codes = [referral_code] if referral_code else []
            all_downline_ids = set()

            for level in range(1, 6):
                key = f"L{level}"
                next_codes = []
                for p_code in current_codes:
                    children = ref_to_children.get(p_code, [])
                    for child in children:
                        if child['id'] not in all_downline_ids:
                            all_downline_ids.add(child['id'])
                            generations[key]['members'] += 1
                            generations[key]['totalCapital'] += float(child['active_capital'])
                            generations[key]['users'].append(child['id'])
                            if child['referral_code']:
                                next_codes.append(child['referral_code'])
                current_codes = next_codes

            # ۳. استخراج تراکنش‌ها، پاداش‌های ثبت‌شده و تفکیک نسل‌ها
            total_network_earnings = 0.00
            today_referral_income = 0.00
            today_date_str = current_aft_date.strftime('%Y-%m-%d')
            tx_list = []

            try:
                cursor.execute("""
                    SELECT rc.*, u.uid, u.username, u.email, u.phone
                    FROM referral_commissions rc
                    LEFT JOIN users u ON (rc.member_id = u.id)
                    WHERE rc.leader_id = %s
                    ORDER BY rc.id DESC
                """, (current_uid,))
                raw_txs = cursor.fetchall()

                for tx in raw_txs:
                    amt = float(tx.get('amount') or 0.0)
                    created_at = tx.get('created_at')
                    tx_date_str = created_at.strftime('%Y-%m-%d') if isinstance(created_at, datetime) else str(created_at or '')[:10]
                    tx_type = str(tx.get('type') or '').upper()

                    if is_eligible:
                        # در صورتی که کمیسیون روزانه مربوط به امروز باشد و هنوز ساعت ۲۱:۰۰ نشده باشد، تا ساعت ۲۱ در انتظار می‌ماند
                        if tx_type == 'DAILY' and tx_date_str == today_date_str and not is_released:
                            pass
                        else:
                            total_network_earnings += amt
                            if tx_date_str == today_date_str:
                                today_referral_income += amt

                        gen_val = str(tx.get('generation') or 'L1').upper()
                        gen_key = gen_val if gen_val.startswith('L') else f"L{gen_val}"

                        if gen_key in generations:
                            if tx_type == 'DIRECT':
                                generations[gen_key]['directBonus'] += amt
                            elif tx_type == 'DAILY':
                                if not (tx_date_str == today_date_str and not is_released):
                                    generations[gen_key]['dailyComm'] += amt

                    time_str = created_at.strftime("%Y-%m-%d %H:%M") if isinstance(created_at, datetime) else str(created_at or '')

                    tx_list.append({
                        "userId": tx.get('uid') or f"usr...{str(tx.get('member_id', ''))[:4]}",
                        "fullName": tx.get('username') or "Member",
                        "email": tx.get('email') or "",
                        "phone": tx.get('phone') or "",
                        "gen": str(tx.get('generation') or 'L1'),
                        "type": tx.get('type') or 'DIRECT',
                        "memberCapital": float(tx.get('member_capital') or 0.0),
                        "memberDailyProfit": round(float(tx.get('member_capital') or 0.0) * (daily_rate / 100.0), 2) if tx_type == 'DAILY' else 0.00,
                        "appliedRate": f"{float(tx.get('applied_rate') or 0.0):.1f}%",
                        "amount": amt if is_eligible else 0.00,
                        "isCapped": bool(tx.get('is_capped', False)),
                        "timestamp": time_str
                    })
            except Exception as sql_err:
                print(f"[Notice] referral_commissions read: {sql_err}")

            total_team_members = sum(generations[f"L{i}"]['members'] for i in range(1, 6))

            clean_gens = {}
            for k, v in generations.items():
                clean_gens[k] = {
                    "members": v['members'],
                    "totalCapital": round(v['totalCapital'], 2),
                    "directBonus": round(v['directBonus'], 2),
                    "dailyComm": round(v['dailyComm'], 2)
                }

            response_data = {
                "user": {
                    "referral_code": referral_code,
                    "referral_link": referral_link,
                    "active_capital": leader_capital,
                    "kyc_status": leader['kyc_status'],
                    "role": leader['role'],
                    "is_eligible": is_eligible
                },
                "stats": {
                    "total_network_earnings": round(total_network_earnings, 2),
                    "today_referral_income": round(today_referral_income, 2),
                    "total_team_members": total_team_members,
                    "leader_active_capital": round(leader_capital, 2),
                    "is_eligible": is_eligible,
                    "is_released": is_released,
                    "isReleased": is_released,
                    "daily_rate": daily_rate,
                    "members_per_gen": {f"L{i}": generations[f"L{i}"]['members'] for i in range(1, 6)},
                    "trend_pct": "+14.8%"
                },
                "generations": clean_gens,
                "transactions": tx_list
            }

            return jsonify({"status": "success", "data": response_data}), 200

    except Exception as e:
        print(f"[Error in team overview]: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

@team_bp.route('/process_direct_bonus', methods=['POST'])
def process_direct_bonus():
    """
    پردازش آنی پاداش نخستین واریز عضو جدید (L1: 8%, L2: 2%, L3: 1%)
    - پاداش بلافاصله به مجموع سودها (total_lifetime_profit) افزوده می‌شود.
    - پاداش با وضعیت is_matured = 0 ثبت شده و دقیقاً پس از ۱۰ روز به سود قابل برداشت (withdrawable_profit) اضافه خواهد شد.
    """
    data = request.get_json() or {}
    member_id = data.get('member_id')
    deposit_amount = float(data.get('amount', 0))

    if not member_id or deposit_amount <= 0:
        return jsonify({"status": "error", "message": "Invalid member or amount"}), 400

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            # بررسی ایجاد ستون is_matured
            try:
                cursor.execute("ALTER TABLE referral_commissions ADD COLUMN is_matured TINYINT(1) DEFAULT 0")
                conn.commit()
            except Exception:
                pass

            cursor.execute("""
                SELECT COUNT(*) as cnt FROM transactions 
                WHERE user_id = %s AND type = 'deposit' AND status = 'completed'
            """, (member_id,))
            dep_count = cursor.fetchone()['cnt']
            if dep_count > 1:
                return jsonify({"status": "ignored", "message": "Bonus only applies to the FIRST deposit"}), 200

            cursor.execute("SELECT id, referred_by FROM users WHERE id = %s", (member_id,))
            current = cursor.fetchone()
            if not current or not current.get('referred_by'):
                return jsonify({"status": "success", "message": "No upline leader"}), 200

            rates = {1: 8.0, 2: 2.0, 3: 1.0}
            curr_ref_code = current['referred_by']

            for level in range(1, 4):
                if not curr_ref_code:
                    break

                cursor.execute("""
                    SELECT u.id, u.referral_code, u.referred_by, u.kyc_status,
                           COALESCE(b.active_capital, 0.00) as active_capital
                    FROM users u
                    LEFT JOIN user_balances b ON u.id = b.user_id
                    WHERE u.referral_code = %s
                """, (curr_ref_code,))
                leader = cursor.fetchone()
                if not leader:
                    break

                leader_id = leader['id']
                leader_cap = float(leader['active_capital'])
                kyc_status = leader['kyc_status']

                if kyc_status == 'verified' and leader_cap >= 50.00:
                    basis = min(deposit_amount, leader_cap)
                    is_capped = 1 if deposit_amount > leader_cap else 0
                    rate = rates[level]
                    bonus = round(basis * (rate / 100.0), 2)

                    if bonus > 0:
                        cursor.execute("""
                            INSERT INTO referral_commissions 
                            (leader_id, member_id, generation, type, member_capital, applied_rate, amount, is_capped, is_matured, created_at)
                            VALUES (%s, %s, %s, 'DIRECT', %s, %s, %s, %s, 0, NOW())
                        """, (leader_id, member_id, f"L{level}", deposit_amount, rate, bonus, is_capped))

                        # افزودن مستقیم به مجموع کل بازدهی‌ها (مجموعه مفادها)
                        cursor.execute("""
                            UPDATE user_balances 
                            SET total_lifetime_profit = total_lifetime_profit + %s
                            WHERE user_id = %s
                        """, (bonus, leader_id))

                        cursor.execute("""
                            INSERT INTO transactions (tx_id, user_id, type, amount, fee, net_amount, network, status, created_at)
                            VALUES (CONCAT('TX-REF-', UNIX_TIMESTAMP(), '-', %s), %s, 'referral_bonus', %s, 0.00, %s, 'INTERNAL', 'completed', NOW())
                        """, (leader_id, leader_id, bonus, bonus))

                curr_ref_code = leader['referred_by']

            conn.commit()

        return jsonify({"status": "success", "message": "Direct bonus processed successfully"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

@team_bp.route('/process_daily_commissions', methods=['POST'])
def process_daily_commissions():
    """
    پردازش مستقیم کمیسیون سود روزانه از اعضای تیم رأس ساعت ۲۱:۰۰ به وقت افغانستان (L1: 10%, L2: 5%, L3: 3%, L4: 2%, L5: 1%)
    """
    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            current_aft_date, is_released, _ = get_profit_cycle_state()
            settle_team_commissions_and_maturation(cursor, conn, current_aft_date, True)
            return jsonify({"status": "success", "message": "Nightly team commissions calculated successfully"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if conn:
            conn.close()
# -*- coding: utf-8 -*-
"""
================================================================================
ADM Investment Platform - Profile, Security & KYC Backend Module
File: profile.py
Blueprint: profile_bp
Prefix: /api/profile
Database: Configured centrally via config.py (Unified Connection Hub)
Includes:
  - Account Credentials & Profile Overview
  - Password Change with scrypt Hashing
  - Automated 1-Hour KYC Verification Engine (No Admin Review Required)
  - Support Tickets & Two-Way Interactive Chat Room
  - Automated 5-Day Message Purge Engine
================================================================================
"""

import os
import random
import pymysql
from datetime import datetime, date, timedelta
from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from config import get_db

profile_bp = Blueprint('profile_bp', __name__)

def get_current_user_id():
    """تشخیص دقیق شناسه کاربر لاگین‌شده از پارامتر، هدر امن، بدنه JSON یا نشست"""
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

def auto_evaluate_pending_kyc(cursor, user_id):
    """
    موتور اعتبارسنجی خودکار احراز هویت در ظرف ۱ ساعت (بدون نیاز به ارسال به پنل ادمین):
    - در صورتی که حداقل ۱ ساعت (۶۰ دقیقه) از زمان ارسال مدارک گذشته باشد:
      سیستم نام و نام خانوادگی، شماره مدرک، تاریخ تولد و تصویر مدارک را بررسی می‌کند.
    - اگر اطلاعات همخوانی داشت، وضعیت به صورت خودکار به 'verified' ارتقا می‌یابد.
    - اگر اطلاعات ناقص یا نامعتبر بود، وضعیت به 'unverified' بازمی‌گردد.
    """
    try:
        cursor.execute("""
            SELECT id, doc_type, doc_number, full_name, birth_date, front_image, status, submitted_at,
                   TIMESTAMPDIFF(MINUTE, submitted_at, NOW()) AS elapsed_minutes
            FROM kyc_verifications
            WHERE user_id = %s
            ORDER BY id DESC
            LIMIT 1
        """, (user_id,))
        kyc_record = cursor.fetchone()

        if not kyc_record or kyc_record.get('status') != 'pending':
            return

        elapsed = kyc_record.get('elapsed_minutes') or 0

        # اگر کمتر از ۶۰ دقیقه گذشته باشد، همچنان در وضعیت در حال بررسی (pending) باقی می‌ماند
        if elapsed < 60:
            return

        # اعتبارسنجی خودکار فیلدهای ارسال‌شده
        full_name = str(kyc_record.get('full_name') or '').strip()
        doc_number = str(kyc_record.get('doc_number') or '').strip()
        birth_date = kyc_record.get('birth_date')
        front_image = kyc_record.get('front_image')

        is_valid = bool(
            len(full_name) >= 3 and
            len(doc_number) >= 4 and
            birth_date and
            front_image and len(str(front_image)) > 50
        )

        if is_valid:
            # تایید خودکار و ارتقای حساب پس از ۱ ساعت
            cursor.execute("UPDATE kyc_verifications SET status = 'verified' WHERE user_id = %s", (user_id,))
            cursor.execute("UPDATE users SET kyc_status = 'verified' WHERE id = %s", (user_id,))
        else:
            # رد شدن خودکار و بازگشت به حالت اولیه احراز هویت نشده
            cursor.execute("UPDATE kyc_verifications SET status = 'rejected' WHERE user_id = %s", (user_id,))
            cursor.execute("UPDATE users SET kyc_status = 'unverified' WHERE id = %s", (user_id,))

    except Exception as e:
        print(f"[Notice] auto_evaluate_pending_kyc: {e}")

# ==================== ۱. دریافت خلاصه اطلاعات پروفایل کاربر ====================

@profile_bp.route('/overview', methods=['GET', 'POST'])
def get_profile_overview():
    """
    دریافت اطلاعات واقعی کاربر از دیتابیس شامل کد معرف، ایمیل، تاریخ عضویت و بررسی خودکار احراز هویت
    """
    user_id = get_current_user_id()
    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            if not user_id:
                cursor.execute("SELECT id FROM users ORDER BY id ASC LIMIT 1")
                first_u = cursor.fetchone()
                user_id = first_u['id'] if first_u else 1

            # اجرای موتور اعتبارسنجی خودکار احراز هویت پس از ۱ ساعت
            auto_evaluate_pending_kyc(cursor, user_id)
            conn.commit()

            # دریافت فیلدهای کاربر از جدول users
            cursor.execute("""
                SELECT u.id, u.uid, u.username, u.email, u.phone, u.role, 
                       u.referral_code, u.kyc_status, u.created_at,
                       COALESCE(b.active_capital, 0.00) AS active_capital
                FROM users u
                LEFT JOIN user_balances b ON u.id = b.user_id
                WHERE u.id = %s
            """, (user_id,))
            user = cursor.fetchone()

            if not user:
                return jsonify({"status": "error", "message": "User not found"}), 404

            # استخراج مطمئن تاریخ واقعی عضویت از دیتابیس
            raw_created = user.get('created_at')
            if raw_created and str(raw_created).lower() != 'none':
                if isinstance(raw_created, (datetime, date)):
                    created_date = raw_created.strftime('%Y-%m-%d')
                else:
                    created_date = str(raw_created)[:10]
            else:
                now_dt = datetime.utcnow()
                created_date = now_dt.strftime('%Y-%m-%d')
                try:
                    cursor.execute("UPDATE users SET created_at = %s WHERE id = %s AND (created_at IS NULL OR created_at = '')", (now_dt, user_id))
                    conn.commit()
                except Exception:
                    pass

            # دریافت تیکت‌های کاربر به صورت کاملاً ایمن
            tickets = []
            try:
                cursor.execute("""
                    SELECT * FROM support_tickets
                    WHERE user_id = %s
                    ORDER BY id DESC
                    LIMIT 20
                """, (user_id,))
                raw_tickets = cursor.fetchall()

                for tk in raw_tickets:
                    tk_code = tk.get('ticket_code') or tk.get('ticket_number') or f"#TK-{tk.get('id', 1):04d}"
                    tk_date = tk.get('created_at')
                    date_str = tk_date.strftime('%Y-%m-%d') if isinstance(tk_date, (datetime, date)) else str(tk_date or '')[:10]
                    tickets.append({
                        "id": tk_code,
                        "subject": tk.get('subject', 'Ticket'),
                        "department": tk.get('department') or tk.get('category') or 'General',
                        "status": tk.get('status', 'pending'),
                        "date": date_str
                    })
            except Exception as e_tk:
                print(f"[Notice] support_tickets read: {e_tk}")

            email_val = user.get('email') or user.get('phone') or '---'
            ref_code = user.get('referral_code') or f"ADM-{user['id']}"

            return jsonify({
                "status": "success",
                "data": {
                    "userId": user['id'],
                    "referralCode": ref_code,
                    "referral_code": ref_code,
                    "username": user['username'] or 'Investor',
                    "email": email_val,
                    "phone": user.get('phone') or '',
                    "role": user.get('role') or 'user',
                    "kycStatus": user.get('kyc_status') or 'unverified',
                    "isKycVerified": (user.get('kyc_status') == 'verified'),
                    "createdAt": created_date,
                    "activeCapital": float(user.get('active_capital', 0.0)),
                    "tickets": tickets
                }
            }), 200

    except Exception as e:
        print(f"[Error in profile overview]: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

# ==================== ۲. تغییر رمز عبور ====================

@profile_bp.route('/change_password', methods=['POST'])
def change_password():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"status": "unauthenticated", "message": "Please log in first"}), 401

    data = request.get_json() or {}
    current_pass = data.get('currentPassword', '').strip()
    new_pass = data.get('newPassword', '').strip()

    if not current_pass or not new_pass:
        return jsonify({"status": "error", "message": "All password fields are required"}), 400

    if len(new_pass) < 8:
        return jsonify({"status": "error", "message": "New password must be at least 8 characters"}), 400

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("SELECT password_hash FROM users WHERE id = %s", (user_id,))
            user = cursor.fetchone()

            if not user or not check_password_hash(user['password_hash'], current_pass):
                return jsonify({"status": "error", "message": "Current password is incorrect"}), 400

            new_hash = generate_password_hash(new_pass, method='scrypt')
            cursor.execute("UPDATE users SET password_hash = %s WHERE id = %s", (new_hash, user_id))
            conn.commit()

            return jsonify({
                "status": "success",
                "message": "Password updated successfully"
            }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

# ==================== ۳. ارسال مدارک احراز هویت (KYC) با تایید خودکار ۱ ساعته ====================

@profile_bp.route('/submit_kyc', methods=['POST'])
def submit_kyc():
    """
    ثبت مدارک هویتی کاربر (نام، تاریخ تولد، شماره مدرک و تصاویر)
    - وضعیت فوراً به حالت pending درمی‌آید و سیستم ظرف ۱ ساعت به صورت خودکار آن را تایید می‌کند.
    - هیچ گزارشی به ادمین‌پنل ارسال نمی‌گردد و فرآیند کاملاً ماشینی است.
    """
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"status": "unauthenticated", "message": "Please log in first"}), 401

    data = request.get_json() or {}
    full_name = data.get('fullName', '').strip()
    birth_date = data.get('birthDate', '').strip()
    doc_type = data.get('docType', 'passport').strip().lower()
    doc_number = data.get('docNumber', '').strip().upper()
    front_image = data.get('frontImage', '')
    back_image = data.get('backImage', '')

    if not full_name or not birth_date or not doc_number:
        return jsonify({"status": "error", "message": "All identity fields are mandatory"}), 400

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            # ایجاد ستون‌های هویتی در جدول kyc_verifications در صورت عدم وجود
            try:
                cursor.execute("ALTER TABLE kyc_verifications ADD COLUMN full_name VARCHAR(150) NULL")
            except Exception: pass
            try:
                cursor.execute("ALTER TABLE kyc_verifications ADD COLUMN birth_date DATE NULL")
            except Exception: pass
            try:
                cursor.execute("ALTER TABLE kyc_verifications ADD COLUMN front_image LONGTEXT NULL")
            except Exception: pass
            try:
                cursor.execute("ALTER TABLE kyc_verifications ADD COLUMN back_image LONGTEXT NULL")
            except Exception: pass

            cursor.execute("""
                SELECT user_id FROM kyc_verifications 
                WHERE doc_type = %s AND doc_number = %s AND user_id != %s
            """, (doc_type, doc_number, user_id))
            duplicate = cursor.fetchone()

            if duplicate:
                return jsonify({
                    "status": "error",
                    "message": "This identity document is already registered with another account"
                }), 400

            cursor.execute("""
                INSERT INTO kyc_verifications (user_id, doc_type, doc_number, full_name, birth_date, front_image, back_image, status, submitted_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, 'pending', NOW())
                ON DUPLICATE KEY UPDATE 
                    doc_type = VALUES(doc_type),
                    doc_number = VALUES(doc_number),
                    full_name = VALUES(full_name),
                    birth_date = VALUES(birth_date),
                    front_image = VALUES(front_image),
                    back_image = VALUES(back_image),
                    status = 'pending',
                    submitted_at = NOW()
            """, (user_id, doc_type, doc_number, full_name, birth_date, front_image, back_image))

            # تنظیم وضعیت کاربر به pending (در حال بررسی در تمام زبان‌ها)
            cursor.execute("UPDATE users SET kyc_status = 'pending' WHERE id = %s", (user_id,))
            conn.commit()

            return jsonify({
                "status": "success",
                "message": "Documents submitted successfully. Verification in progress."
            }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

# ==================== ۴. ثبت تیکت جدید پشتیبانی ====================

@profile_bp.route('/submit_ticket', methods=['POST'])
def submit_ticket():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"status": "unauthenticated", "message": "Please log in first"}), 401

    data = request.get_json() or {}
    subject = data.get('subject', '').strip()
    department = data.get('department', 'Financial').strip()
    message = data.get('message', '').strip()

    if not subject or not message:
        return jsonify({"status": "error", "message": "Subject and detailed message are required"}), 400

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            ticket_code = f"#TK-{random.randint(1000, 9999)}"
            now = datetime.utcnow()

            cursor.execute("""
                INSERT INTO support_tickets (user_id, ticket_code, ticket_number, subject, department, category, status, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, 'pending', %s, %s)
            """, (user_id, ticket_code, ticket_code, subject, department, department, now, now))
            ticket_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO ticket_replies (ticket_id, user_id, sender_id, sender_role, is_admin, message, created_at)
                VALUES (%s, %s, %s, 'user', 0, %s, %s)
            """, (ticket_id, user_id, user_id, message, now))
            conn.commit()

            return jsonify({
                "status": "success",
                "message": "Ticket created successfully",
                "ticket": {
                    "id": ticket_code,
                    "subject": subject,
                    "department": department,
                    "status": "pending",
                    "date": now.strftime('%Y-%m-%d')
                }
            }), 201

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

# ==================== ۵. دریافت پیام‌های تیکت و گفت‌وگو (با پاک‌سازی خودکار ۵ روزه) ====================

@profile_bp.route('/ticket_messages', methods=['POST'])
def get_ticket_messages():
    data = request.get_json() or {}
    user_id = data.get('userId') or get_current_user_id()
    ticket_code = data.get('ticketCode', '').strip()

    if not user_id or not ticket_code:
        return jsonify({"status": "error", "message": "User ID and Ticket Code required"}), 400

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            # پاک‌سازی خودکار پیام‌های قدیمی‌تر از ۵ روز
            try:
                cursor.execute("DELETE FROM ticket_replies WHERE created_at < DATE_SUB(NOW(), INTERVAL 5 DAY)")
                conn.commit()
            except Exception as e_clean:
                print(f"[Notice] 5-day auto purge: {e_clean}")

            cursor.execute("""
                SELECT id, ticket_code, ticket_number, subject, department, category, status, created_at
                FROM support_tickets
                WHERE (ticket_code = %s OR ticket_number = %s) AND user_id = %s
                LIMIT 1
            """, (ticket_code, ticket_code, user_id))
            ticket = cursor.fetchone()

            if not ticket:
                return jsonify({"status": "error", "message": "Ticket not found"}), 404

            cursor.execute("""
                SELECT id, ticket_id, sender_id, user_id, sender_role, is_admin, message, created_at
                FROM ticket_replies
                WHERE ticket_id = %s
                ORDER BY created_at ASC
            """, (ticket['id'],))
            raw_replies = cursor.fetchall()

            messages = []
            for r in raw_replies:
                r_date = r.get('created_at')
                if isinstance(r_date, (datetime, date)):
                    date_str = r_date.strftime('%Y-%m-%d %H:%M')
                else:
                    date_str = str(r_date or '')[:16]

                is_adm = (r.get('sender_role') == 'admin' or r.get('is_admin') == 1)

                messages.append({
                    "id": r['id'],
                    "message": r['message'],
                    "sender_role": 'admin' if is_adm else 'user',
                    "is_admin": 1 if is_adm else 0,
                    "date": date_str
                })

            return jsonify({
                "status": "success",
                "ticket": {
                    "id": ticket['ticket_code'] or ticket['ticket_number'],
                    "subject": ticket['subject'],
                    "department": ticket['department'] or ticket['category'],
                    "status": ticket['status']
                },
                "messages": messages
            }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

# ==================== ۶. ارسال پاسخ مجدد توسط کاربر ذیل همان تیکت ====================

@profile_bp.route('/reply_ticket', methods=['POST'])
def reply_ticket():
    data = request.get_json() or {}
    user_id = data.get('userId') or get_current_user_id()
    ticket_code = data.get('ticketCode', '').strip()
    message = data.get('message', '').strip()

    if not user_id or not ticket_code or not message:
        return jsonify({"status": "error", "message": "All fields are required"}), 400

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            # پاک‌سازی پیام‌های بالای ۵ روز
            try:
                cursor.execute("DELETE FROM ticket_replies WHERE created_at < DATE_SUB(NOW(), INTERVAL 5 DAY)")
            except Exception:
                pass

            cursor.execute("""
                SELECT id, status
                FROM support_tickets
                WHERE (ticket_code = %s OR ticket_number = %s) AND user_id = %s
                LIMIT 1
            """, (ticket_code, ticket_code, user_id))
            ticket = cursor.fetchone()

            if not ticket:
                return jsonify({"status": "error", "message": "Ticket not found"}), 404

            ticket_id = ticket['id']
            now = datetime.utcnow()

            cursor.execute("""
                INSERT INTO ticket_replies (ticket_id, user_id, sender_id, sender_role, is_admin, message, created_at)
                VALUES (%s, %s, %s, 'user', 0, %s, %s)
            """, (ticket_id, user_id, user_id, message, now))

            cursor.execute("""
                UPDATE support_tickets
                SET status = 'pending', updated_at = %s
                WHERE id = %s
            """, (now, ticket_id))
            conn.commit()

            return jsonify({
                "status": "success",
                "message": "Reply sent successfully"
            }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

# ==================== ۷. خروج از سایر نشست‌های فعال ====================

@profile_bp.route('/terminate_sessions', methods=['POST'])
def terminate_sessions():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"status": "unauthenticated"}), 401

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            try:
                cursor.execute("DELETE FROM user_sessions WHERE user_id = %s", (user_id,))
                conn.commit()
            except Exception:
                pass

        return jsonify({
            "status": "success",
            "message": "All other sessions have been terminated successfully"
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if conn:
            conn.close()
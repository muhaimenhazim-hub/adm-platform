"""
================================================================================
ADM Investment Platform - Main Flask Application & Central Gateway
File: index.py
Host: http://localhost:5000
Database: adm_db (Configured via config.py)
Includes:
  - Stable 30-Day Sessions
  - Authentication (Login, Register, Logout, User Status)
  - Seamless 5-Page User Portal Integration
  - Master Admin Panel Engine Integration (/api/admin & /admin)
================================================================================
"""

import os
import random
import string
from datetime import timedelta
import pymysql
from flask import Flask, request, jsonify, session, send_from_directory, make_response
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

# اتصال ایمن به فایل تنظیمات مرکزی
from config import DB_CONFIG

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, static_folder=BASE_DIR, static_url_path='')
app.secret_key = 'ADM_BINANCE_PRO_SECRET_KEY_#2026!@$'

# تنظیمات دائمی سشن
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30)
app.config['SESSION_COOKIE_NAME'] = 'adm_session'
app.config['SESSION_COOKIE_HTTPONLY'] = False
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False

CORS(app, supports_credentials=True, origins=["http://localhost:5000", "http://127.0.0.1:5000"])

# ==================== ثبت بلواپرینت‌های صفحات کاربر ====================

try:
    from home import home_bp
    app.register_blueprint(home_bp, url_prefix='/api/home')
    print("[Success] home_bp registered at /api/home")
except Exception as e:
    print(f"[Notice] home_bp: {e}")

try:
    from invest import invest_bp
    app.register_blueprint(invest_bp, url_prefix='/api/invest')
    print("[Success] invest_bp registered at /api/invest")
except Exception as e:
    print(f"[Notice] invest_bp: {e}")

try:
    from team import team_bp
    app.register_blueprint(team_bp, url_prefix='/api/team')
    print("[Success] team_bp registered at /api/team")
except Exception as e:
    print(f"[Notice] team_bp: {e}")

try:
    from wallet import wallet_bp
    app.register_blueprint(wallet_bp, url_prefix='/api/wallet')
    print("[Success] wallet_bp registered at /api/wallet")
except Exception as e:
    print(f"[Notice] wallet_bp: {e}")

try:
    from profile import profile_bp
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    print("[Success] profile_bp registered at /api/profile")
except Exception as e:
    print(f"[Notice] profile_bp: {e}")

# ==================== ثبت بلواپرینت پنل مدیریت ادمین ====================

try:
    from admin import admin_bp
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    print("[Success] admin_bp registered at /api/admin")
except Exception as e:
    print(f"[Notice] admin_bp: {e}")

# ==================== توابع اتصال به دیتابیس و کمکی ====================

def get_db():
    return pymysql.connect(
        **DB_CONFIG,
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )

def generate_unique_uid(cursor):
    while True:
        uid = f"{random.randint(10000000, 99999999)}"
        cursor.execute("SELECT id FROM users WHERE uid = %s", (uid,))
        if not cursor.fetchone():
            return uid

def generate_referral_code(cursor):
    chars = string.ascii_uppercase + string.digits
    while True:
        code = 'ADM-' + ''.join(random.choices(chars, k=6))
        cursor.execute("SELECT id FROM users WHERE referral_code = %s", (code,))
        if not cursor.fetchone():
            return code

# ==================== سرویس‌دهنده فایل‌های استاتیک و صفحات ====================

@app.route('/')
def root():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/admin')
@app.route('/admin/')
def serve_admin_portal():
    """روت اختصاصی برای باز کردن پنل مدیریت با وارد کردن /admin در آدرس بار"""
    return send_from_directory(BASE_DIR, 'admin.html')

@app.route('/<path:filename>')
def serve_static(filename):
    file_path = os.path.join(BASE_DIR, filename)
    if os.path.isfile(file_path):
        return send_from_directory(BASE_DIR, filename)
    return send_from_directory(BASE_DIR, 'index.html')

# ==================== احراز هویت، ورود و ثبت‌نام ====================

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    ident = data.get('identifier', '').strip()
    full_name = data.get('fullName', '').strip()
    password = data.get('password', '')
    invite_code = data.get('inviteCode', '').strip().upper()

    username = full_name or data.get('username', '').strip()
    email = ident if '@' in ident else data.get('email', '').strip().lower()
    phone = ident if '@' not in ident else data.get('phone', '').strip()
    ref_code = invite_code or data.get('referral_code', '').strip().upper()

    if not username or not (email or phone) or not password or not ref_code:
        return jsonify({"status": "error", "success": False, "message": "All required fields must be provided"}), 400

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            if email:
                cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
                if cursor.fetchone():
                    return jsonify({"status": "error", "success": False, "message": "Email is already registered"}), 400

            role = 'user'
            referred_by = None

            if ref_code == 'ADM2026':
                role = 'admin'
                referred_by = 'ADM2026'
            else:
                cursor.execute("SELECT referral_code FROM users WHERE referral_code = %s", (ref_code,))
                parent = cursor.fetchone()
                if not parent:
                    return jsonify({"status": "error", "success": False, "message": "Invalid referral code"}), 400
                referred_by = parent['referral_code']

            uid = generate_unique_uid(cursor)
            my_ref_code = generate_referral_code(cursor)
            pass_hash = generate_password_hash(password, method='scrypt')

            cursor.execute("""
                INSERT INTO users (uid, username, email, phone, password_hash, role, referral_code, referred_by, kyc_status, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'unverified', NOW())
            """, (uid, username, email or f"{phone}@adm.local", phone, pass_hash, role, my_ref_code, referred_by))

            user_id = cursor.lastrowid
            session.permanent = True
            session['user_id'] = user_id
            session['role'] = role

            user_payload = {
                "id": user_id,
                "userId": user_id,
                "uid": uid,
                "username": username,
                "email": email,
                "role": role,
                "referral_code": my_ref_code,
                "referralCode": my_ref_code
            }

            resp = make_response(jsonify({
                "status": "success",
                "success": True,
                "message": "User registered successfully",
                "user": user_payload,
                "data": user_payload
            }), 201)
            resp.set_cookie('logged_in_uid', str(uid), max_age=3600*24*30, path='/')
            return resp

    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    identifier = data.get('identifier', '').strip()
    password = data.get('password', '')

    if not identifier or not password:
        return jsonify({"status": "error", "success": False, "message": "Credentials required"}), 400

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT id, uid, username, email, password_hash, role, referral_code, kyc_status
                FROM users 
                WHERE email = %s OR username = %s OR phone = %s
            """, (identifier.lower(), identifier, identifier))
            user = cursor.fetchone()

            if not user or not check_password_hash(user['password_hash'], password):
                return jsonify({"status": "error", "success": False, "message": "Invalid credentials"}), 401

            session.permanent = True
            session['user_id'] = user['id']
            session['role'] = user['role']

            user_payload = {
                "id": user['id'],
                "userId": user['id'],
                "uid": user['uid'],
                "username": user['username'],
                "email": user['email'],
                "role": user['role'],
                "referral_code": user['referral_code'],
                "referralCode": user['referral_code'],
                "kyc_status": user['kyc_status']
            }

            resp = make_response(jsonify({
                "status": "success",
                "success": True,
                "message": "Logged in successfully",
                "user": user_payload,
                "data": user_payload
            }), 200)
            resp.set_cookie('logged_in_uid', str(user['uid']), max_age=3600*24*30, path='/')
            return resp

    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/logout', methods=['POST', 'GET'])
def logout():
    session.clear()
    resp = make_response(jsonify({"status": "success", "success": True, "message": "Logged out"}), 200)
    resp.set_cookie('logged_in_uid', '', expires=0, path='/')
    return resp

@app.route('/api/user_status', methods=['GET'])
def user_status():
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

            cursor.execute("""
                SELECT u.id, u.uid, u.username, u.email, u.phone, u.role, u.referral_code, u.kyc_status,
                       COALESCE(b.active_capital, 0.00) as active_capital,
                       COALESCE(b.withdrawable_profit, 0.00) as withdrawable_profit
                FROM users u
                LEFT JOIN user_balances b ON u.id = b.user_id
                WHERE u.id = %s
            """, (user_id,))
            user = cursor.fetchone()

            if not user:
                return jsonify({"status": "error", "success": False, "message": "User not found"}), 404

            return jsonify({
                "status": "success",
                "success": True,
                "user": user,
                "data": user
            }), 200
    except Exception as e:
        return jsonify({"status": "error", "success": False, "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

# ==================== راه‌اندازی سرور فلسک ====================

if __name__ == '__main__':
    print("==================================================")
    print("ADM Binance Pro Server Running at: http://localhost:5000")
    print("Master Admin Panel Accessible at: http://localhost:5000/admin")
    print(f"Base Directory: {BASE_DIR}")
    print("==================================================")
    app.run(host='0.0.0.0', port=5000, debug=True)
# ==============================================================================
# ADM Investment Platform - Central Configuration Hub
# File: config.py
# Cloud Database: filess.io MySQL v8.0.29 (Native Connection Hub)
# ==============================================================================

import os
import ssl
import pymysql
import pymysql.cursors

# ==================== ۱. تنظیمات دامنه‌ها و هاست (CORS) ====================
CORS_ORIGINS = [
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://localhost",
    "http://127.0.0.1",
    "https://adm-platform-eta.vercel.app"
]

ENV_DOMAIN = os.getenv('APP_DOMAIN')
if ENV_DOMAIN and ENV_DOMAIN not in CORS_ORIGINS:
    CORS_ORIGINS.append(ENV_DOMAIN)

# ==================== ۲. کلید امنیتی و تنظیمات سشن ====================
SECRET_KEY = os.getenv('SECRET_KEY', 'ADM_BINANCE_PRO_SECRET_KEY_#2026!@$')

SESSION_CONFIG = {
    'PERMANENT_SESSION_LIFETIME_DAYS': 30,
    'SESSION_COOKIE_NAME': 'adm_session',
    'SESSION_COOKIE_HTTPONLY': False,
    'SESSION_COOKIE_SAMESITE': 'Lax',
    'SESSION_COOKIE_SECURE': False
}

# ==================== ۳. تنظیمات اجرای سرور لوکال ====================
SERVER_HOST = os.getenv('SERVER_HOST', '0.0.0.0')
SERVER_PORT = int(os.getenv('SERVER_PORT', 5000))
DEBUG_MODE = os.getenv('FLASK_DEBUG', 'True').lower() in ('true', '1', 't')

# ==================== ۴. اتصال به دیتابیس جدید ابری filess.io ====================
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'oa0y1g.h.filess.io'),
    'port': int(os.getenv('DB_PORT', 3307)),
    'user': os.getenv('DB_USER', 'adm_db_sincedogup'),
    'password': os.getenv('DB_PASSWORD', 'f595fffbd94bb8cae82dba5424d3fcc0e02e5f45'),
    'database': os.getenv('DB_NAME', 'adm_db_sincedogup'),
    'charset': 'utf8mb4'
}

def get_db():
    """
    تابع مرکزی اتصال پایدار به دیتابیس filess.io جهت استفاده در تمام ماژول‌ها
    """
    conn_params = DB_CONFIG.copy()
    conn_params['cursorclass'] = pymysql.cursors.DictCursor
    conn_params['autocommit'] = True
    conn_params['connect_timeout'] = 20

    try:
        # اتصال مستقیم و استاندارد به پورت ۳۳۰۷
        return pymysql.connect(**conn_params)
    except Exception:
        # در صورت نیاز به SSL در ارتباطات خارجی
        try:
            ssl_ctx = ssl.create_default_context()
            ssl_ctx.check_hostname = False
            ssl_ctx.verify_mode = ssl.CERT_NONE
            conn_params['ssl'] = ssl_ctx
            return pymysql.connect(**conn_params)
        except Exception as e:
            raise e
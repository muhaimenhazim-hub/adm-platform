# ==============================================================================
# ADM Investment Platform - Central Configuration Hub
# File: config.py
# Cloud Database: Aiven MySQL 8.0 Native
# ==============================================================================

import os
import ssl
import pymysql
import pymysql.cursors

# ==================== ۱. تنظیمات دامنه‌ها و هاست (CORS) ====================
# در صورت تغییر هاست یا دامنه، تنها کافی است دامنه جدید را به این لیست اضافه کنید
CORS_ORIGINS = [
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://localhost",
    "http://127.0.0.1",
    "https://adm-platform-eta.vercel.app"  # دامنه هاست فعلی (در هاست جدید این خط را ویرایش کنید)
]

# خواندن دامنه داینامیک از متغیر محیطی هاست (در صورت تعریف شدن در پنل هاست)
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
    'SESSION_COOKIE_SECURE': False  # اگر هاست جدید SSL اجباری داشت، می‌تواند True شود
}

# ==================== ۳. تنظیمات اجرای سرور لوکال ====================
SERVER_HOST = os.getenv('SERVER_HOST', '0.0.0.0')
SERVER_PORT = int(os.getenv('SERVER_PORT', 5000))
DEBUG_MODE = os.getenv('FLASK_DEBUG', 'True').lower() in ('true', '1', 't')

# ==================== ۴. اتصال به دیتابیس ابری Aiven MySQL ====================
try:
    ssl_ctx = ssl.create_default_context()
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE
except Exception:
    ssl_ctx = None

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'mysql-eda35d1-muhaimenhazim-88cc.k.aivencloud.com'),
    'port': int(os.getenv('DB_PORT', 27339)),
    'user': os.getenv('DB_USER', 'avnadmin'),
    'password': os.getenv('DB_PASSWORD', 'AVNS_W5EzPKNrPd3n8fecxl8'),
    'database': os.getenv('DB_NAME', 'defaultdb'),
    'charset': 'utf8mb4'
}

if ssl_ctx:
    DB_CONFIG['ssl'] = ssl_ctx

def get_db():
    """
    تابع مرکزی اتصال پایدار به دیتابیس جهت استفاده در تمام ماژول‌ها
    """
    conn_params = DB_CONFIG.copy()
    conn_params['cursorclass'] = pymysql.cursors.DictCursor
    conn_params['autocommit'] = True
    conn_params['connect_timeout'] = 15
    return pymysql.connect(**conn_params)
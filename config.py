# ==============================================================================
# ADM Investment Platform - Central Configuration
# File: config.py
# Cloud Database: Aiven MySQL 8.0 Native (Unified Connection Hub)
# ==============================================================================

import os
import ssl
import pymysql
import pymysql.cursors

# ایجاد اتصال امن و رمزنگاری‌شده SSL مطابق با استاندارد دیتابیس ابری Aiven
try:
    ssl_ctx = ssl.create_default_context()
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE
except Exception:
    ssl_ctx = None

# تنظیمات اتصال مرکزی به دیتابیس
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

# کلید اختصاصی امنیت سشن‌ها
SECRET_KEY = os.getenv('SECRET_KEY', 'ADM_BINANCE_PRO_SECRET_KEY_#2026!@$')

def get_db():
    """
    تابع مرکزی و یکپارچه اتصال به دیتابیس برای تمام ماژول‌ها
    (index.py, home.py, invest.py, wallet.py, team.py, profile.py)
    """
    conn_params = DB_CONFIG.copy()
    conn_params['cursorclass'] = pymysql.cursors.DictCursor
    conn_params['autocommit'] = True
    conn_params['connect_timeout'] = 15
    return pymysql.connect(**conn_params)
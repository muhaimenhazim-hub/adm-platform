/**
 * ADM Investment Platform - Frontend Central Configuration
 * File: config.js
 */

const APP_CONFIG = {
    // تشخیص خودکار آدرس سرور (پشتیبانی همزمان از اجرای لوکال پایتون و سرور ابری)
    API_BASE_URL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000'
        : window.location.origin,

    /**
     * تابع کمکی استاندارد برای ساخت مسیرهای API
     * @param {string} endpoint - مسیر اندپوینت مورد نظر مثلاً /api/home/stats
     * @returns {string} آدرس کامل و بدون خطای اندپوینت
     */
    getApiUrl: function (endpoint) {
        const base = this.API_BASE_URL.replace(/\/+$/, '');
        const path = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
        return `${base}${path}`;
    }
};

// ثبت به عنوان متغیر سراسری در مرورگر جهت دسترسی تمام اسکریپت‌ها
window.APP_CONFIG = APP_CONFIG;
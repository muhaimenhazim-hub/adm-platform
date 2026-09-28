/**
 * ==============================================================================
 * ADM Investment Platform - Home Dashboard Frontend Controller
 * File: home.js
 * Dependent on: config.js (window.APP_CONFIG)
 * Backend Controller: home.py (API: /api/home/*)
 * ==============================================================================
 */

const dashboardI18n = {
    en: {
        dir: 'ltr',
        langName: 'English',
        adminPanel: 'Admin Panel',
        totalActiveCapital: 'Total Active Capital',
        withdrawableProfit: 'Withdrawable Profit',
        todayEarnings: "Today's Earnings",
        totalLifetimeProfit: 'Total Lifetime Profit',
        depositBtn: 'Deposit',
        compoundBtn: 'Compound',
        withdrawBtn: 'Withdraw',
        inviteBtn: 'Invite Friends',
        navHome: 'Dashboard',
        navInvest: 'Invest',
        navTeam: 'Team',
        navWallet: 'Wallet',
        navProfile: 'Profile',
        backBtn: 'Back',
        depositModalTitle: 'Deposit Funds (USDT)',
        chooseNetwork: 'Select Transfer Network:',
        netTrxArrival: 'Arrival time: ~2 mins',
        netBnbArrival: 'Arrival time: ~1 min',
        netMinDeposit: 'Min. deposit: 1 USDT',
        walletAddressLabel: 'Platform Deposit Address:',
        addressPendingNotice: 'Secure deposit gateway will be connected soon.',
        copyBtn: 'Copy',
        qrPlaceholder: 'Scan Deposit QR',
        depositWarningText: 'Note: This deposit is registered as a new independent Lot with an active 90-day lock cycle. After 90 days, the principal is completely unlocked and withdrawable.',
        withdrawModalTitle: 'Withdraw Funds (USDT)',
        unlockedPrincipal: 'Unlocked Principal',
        withdrawProfitTab: 'Withdraw Profit',
        withdrawPrincipalTab: 'Withdraw Unlocked Principal',
        withdrawAmountLabel: 'Amount (USDT):',
        destAddressLabel: 'Destination Wallet Address (USDT - TRC20/BEP20):',
        estimatedFee: 'Estimated Network/Platform Fee:',
        netReceive: 'Net Amount You Receive:',
        ruleTenPercentText: 'Minimum 10% profit accumulation requirement',
        processingTimeNotice: 'Withdrawals are processed within 1 to 12 business hours.',
        confirmWithdrawBtn: 'Confirm Withdrawal',
        compoundModalTitle: 'Compound Profit to Principal',
        daysSinceLast: 'Days elapsed since last transaction:',
        daysUnit: 'Day(s)',
        confirmCompoundBtn: 'Confirm & Add to Principal',
        inviteModalTitle: 'Invite Your Friends',
        myInviteCode: 'My Referral Code:',
        myInviteLink: 'Direct Registration Link:',
        copiedNotice: 'Copied to clipboard!',
        withdrawSuccess: 'Withdrawal request submitted successfully.',
        compoundErrUnder10: 'You cannot compound yet! You must wait another {days} day(s) to reach 10 days.',
        compoundSuccessMsg: 'Conditions met. Tiered fees apply upon compounding.',
        comingSoon: 'This section will be available soon.',
        tiers: [
            { label: 'Under 10 days:', val: 'Disallowed (Error)', isErr: true },
            { label: 'Between 10 to 15 days:', val: '5% Fee' },
            { label: 'Between 15 to 25 days:', val: '3% Fee' },
            { label: 'Between 25 to 35 days:', val: '1% Fee' },
            { label: 'Between 35 to 50 days:', val: '0% (Free)', isGreen: true },
            { label: 'Over 50 days:', val: '0% + 3% Bonus', isGreen: true }
        ]
    },
    fr: {
        dir: 'ltr',
        langName: 'Français',
        adminPanel: 'Panneau Admin',
        totalActiveCapital: 'Capital Actif Total',
        withdrawableProfit: 'Profit Retirable',
        todayEarnings: "Gains d'aujourd'hui",
        totalLifetimeProfit: 'Gains Totaux Cumulés',
        depositBtn: 'Dépôt',
        compoundBtn: 'Composer',
        withdrawBtn: 'Retrait',
        inviteBtn: 'Inviter',
        navHome: 'Accueil',
        navInvest: 'Investir',
        navTeam: 'Équipe',
        navWallet: 'Portefeuille',
        navProfile: 'Profil',
        backBtn: 'Retour',
        depositModalTitle: 'Dépôt de fonds (USDT)',
        chooseNetwork: 'Choisir le réseau :',
        netTrxArrival: "Temps d'arrivée : ~2 min",
        netBnbArrival: "Temps d'arrivée : ~1 min",
        netMinDeposit: 'Dépôt min. : 1 USDT',
        walletAddressLabel: 'Adresse de dépôt :',
        addressPendingNotice: 'La passerelle de dépôt sera bientôt active.',
        copyBtn: 'Copier',
        qrPlaceholder: 'QR Code Dépôt',
        depositWarningText: 'Remarque : Ce dépôt constitue un nouveau Lot soumis à un blocage de 90 jours. Après 90 jours, le capital est totalement libéré.',
        withdrawModalTitle: 'Retrait de fonds (USDT)',
        unlockedPrincipal: 'Capital libéré',
        withdrawProfitTab: 'Retirer le profit',
        withdrawPrincipalTab: 'Retirer le capital libéré',
        withdrawAmountLabel: 'Montant (USDT) :',
        destAddressLabel: 'Adresse de destination (TRC20/BEP20) :',
        estimatedFee: 'Frais estimés :',
        netReceive: 'Montant net reçu :',
        ruleTenPercentText: 'Condition de 10% de profit minimum requise',
        processingTimeNotice: 'Traitement sous 1 à 12 heures ouvrables.',
        confirmWithdrawBtn: 'Confirmer le retrait',
        compoundModalTitle: 'Composer le profit',
        daysSinceLast: 'Jours écoulés :',
        daysUnit: 'Jour(s)',
        confirmCompoundBtn: 'Confirmer et réinvestir',
        inviteModalTitle: 'Inviter des amis',
        myInviteCode: 'Code de parrainage :',
        myInviteLink: 'Lien direct :',
        copiedNotice: 'Copié !',
        withdrawSuccess: 'Demande de retrait transmise.',
        compoundErrUnder10: 'Impossible de composer ! Veuillez attendre encore {days} jour(s) pour atteindre 10 jours.',
        compoundSuccessMsg: 'Conditions remplies. Les frais échelonnés seront appliqués.',
        comingSoon: 'Bientôt disponible.',
        tiers: [
            { label: 'Moins de 10 jours :', val: 'Interdit (Erreur)', isErr: true },
            { label: 'Entre 10 et 15 jours :', val: '5% Frais' },
            { label: 'Entre 15 et 25 jours :', val: '3% Frais' },
            { label: 'Entre 25 et 35 jours :', val: '1% Frais' },
            { label: 'Entre 35 et 50 jours :', val: '0% (Gratuit)', isGreen: true },
            { label: 'Plus de 50 jours :', val: '0% + 3% Bonus', isGreen: true }
        ]
    },
    ru: {
        dir: 'ltr',
        langName: 'Русский',
        adminPanel: 'Панель админа',
        totalActiveCapital: 'Всего активного капитала',
        withdrawableProfit: 'Прибыль к выводу',
        todayEarnings: 'Прибыль сегодня',
        totalLifetimeProfit: 'Общий накопленный доход',
        depositBtn: 'Пополнить',
        compoundBtn: 'Реинвест',
        withdrawBtn: 'Вывод',
        inviteBtn: 'Пригласить',
        navHome: 'Главная',
        navInvest: 'Инвестиции',
        navTeam: 'Команда',
        navWallet: 'Кошелек',
        navProfile: 'Профиль',
        backBtn: 'Назад',
        depositModalTitle: 'Пополнение счета (USDT)',
        chooseNetwork: 'Выберите сеть:',
        netTrxArrival: 'Время зачисления: ~2 мин',
        netBnbArrival: 'Время зачисления: ~1 мин',
        netMinDeposit: 'Мин. депозит: 1 USDT',
        walletAddressLabel: 'Адрес для депозита:',
        addressPendingNotice: 'Шлюз кошелька будет подключен в ближайшее время.',
        copyBtn: 'Копировать',
        qrPlaceholder: 'QR код депозита',
        depositWarningText: 'Внимание: Этот депозит регистрируется как отдельный лот с циклом блокировки 90 дней. По истечении срока капитал полностью разблокирован.',
        withdrawModalTitle: 'Вывод средств (USDT)',
        unlockedPrincipal: 'Разблокированный капитал',
        withdrawProfitTab: 'Вывод прибыли',
        withdrawPrincipalTab: 'Вывод основного капитала',
        withdrawAmountLabel: 'Сумма (USDT):',
        destAddressLabel: 'Адрес кошелька (TRC20/BEP20):',
        estimatedFee: 'Комиссия платформы:',
        netReceive: 'Сумма к получению:',
        ruleTenPercentText: 'Условие минимум 10% прибыли',
        processingTimeNotice: 'Обработка от 1 до 12 рабочих часов.',
        confirmWithdrawBtn: 'Подтвердить вывод',
        compoundModalTitle: 'Реинвестировать прибыль',
        daysSinceLast: 'Дней с последней операции:',
        daysUnit: 'Дн.',
        confirmCompoundBtn: 'Подтвердить и реинвестировать',
        inviteModalTitle: 'Пригласить друзей',
        myInviteCode: 'Реферальный код:',
        myInviteLink: 'Ссылка:',
        copiedNotice: 'Скопировано!',
        withdrawSuccess: 'Заявка на вывод отправлена.',
        compoundErrUnder10: 'Реинвест недоступен! Подождите еще {days} дн.',
        compoundSuccessMsg: 'Условия соблюдены. Действует ступенчатая комиссия.',
        comingSoon: 'Раздел скоро будет доступен.',
        tiers: [
            { label: 'Менее 10 дней:', val: 'Запрещено (Ошибка)', isErr: true },
            { label: 'От 10 до 15 дней:', val: '5% Комиссия' },
            { label: 'От 15 до 24 дней:', val: '3% Комиссия' },
            { label: 'От 25 до 34 дней:', val: '1% Комиссия' },
            { label: 'От 35 до 49 дней:', val: '0% (Бесплатно)', isGreen: true },
            { label: 'Более 50 дней:', val: '0% + 3% Бонус', isGreen: true }
        ]
    },
    ar: {
        dir: 'rtl',
        langName: 'العربية',
        adminPanel: 'لوحة الإدارة',
        totalActiveCapital: 'إجمالي رأس المال النشط',
        withdrawableProfit: 'الأرباح القابلة للسحب',
        todayEarnings: 'أرباح اليوم',
        totalLifetimeProfit: 'إجمالي الأرباح التراكمية',
        depositBtn: 'إيداع',
        compoundBtn: 'الفائدة المركبة',
        withdrawBtn: 'سحب',
        inviteBtn: 'دعوة الأصدقاء',
        navHome: 'الرئيسية',
        navInvest: 'الاستثمار',
        navTeam: 'الفريق',
        navWallet: 'المحفظة',
        navProfile: 'الملف',
        backBtn: 'رجوع',
        depositModalTitle: 'شحن الحساب (USDT)',
        chooseNetwork: 'اختر الشبكة:',
        netTrxArrival: 'وقت الوصول: ~2 دقيقة',
        netBnbArrival: 'وقت الوصول: ~1 دقيقة',
        netMinDeposit: 'الحد الأدنى للإيداع: 1 USDT',
        walletAddressLabel: 'عنوان الإيداع:',
        addressPendingNotice: 'سيتم ربط بوابة المحفظة قريباً.',
        copyBtn: 'نسخ',
        qrPlaceholder: 'رمز QR للإيداع',
        depositWarningText: 'تنبيه: يُسجل هذا الإيداع كدفعة مستقلة (Lot) مع فترة قفل 90 يومًا. بعد 90 يومًا، يصبح رأس المال متاحًا للسحب بالكامل.',
        withdrawModalTitle: 'سحب الأموال (USDT)',
        unlockedPrincipal: 'رأس المال المحرر',
        withdrawProfitTab: 'سحب الأرباح',
        withdrawPrincipalTab: 'سحب رأس المال المحرر',
        withdrawAmountLabel: 'المبلغ (USDT):',
        destAddressLabel: 'عنوان المحفظة المستلمة:',
        estimatedFee: 'العمولة المقدرة:',
        netReceive: 'المبلغ الصافي المستلم:',
        ruleTenPercentText: 'شرط بلوغ 10% كحد أدنى للأرباح',
        processingTimeNotice: 'تتم معالجة السحوبات خلال 1 إلى 12 ساعة عمل.',
        confirmWithdrawBtn: 'تأكيد السحب',
        compoundModalTitle: 'إضافة الأرباح لرأس المال',
        daysSinceLast: 'الأيام المنقضية:',
        daysUnit: 'يوم',
        confirmCompoundBtn: 'تأكيد وإضافة لرأس المال',
        inviteModalTitle: 'دعوة الأصدقاء',
        myInviteCode: 'رمز الإحالة:',
        myInviteLink: 'رابط التسجيل:',
        copiedNotice: 'تم النسخ بنجاح!',
        withdrawSuccess: 'تم إرسال طلب السحب.',
        compoundErrUnder10: 'لا يمكن إضافة الأرباح الآن! يجب الانتظار {days} يوم/أيام إضافية.',
        compoundSuccessMsg: 'الشروط مستوفاة. سيتم تطبيق جدول العمولات المتدرج.',
        comingSoon: 'سيتوفر هذا القسم قريباً.',
        tiers: [
            { label: 'أقل من 10 أيام:', val: 'غير مسموح (خطأ)', isErr: true },
            { label: 'بين 10 و 15 يوماً:', val: '5% عمولة' },
            { label: 'بين 15 و 25 يوماً:', val: '3% عمولة' },
            { label: 'بين 25 و 35 يوماً:', val: '1% عمولة' },
            { label: 'بين 35 و 50 يوماً:', val: '0% (مجاناً)', isGreen: true },
            { label: 'أكثر من 50 يوماً:', val: '0% + 3% مكافأة', isGreen: true }
        ]
    },
    fa: {
        dir: 'rtl',
        langName: 'فارسی',
        adminPanel: 'پنل مدیریت',
        totalActiveCapital: 'کل سرمایه فعال',
        withdrawableProfit: 'سود قابل برداشت',
        todayEarnings: 'سود امروز',
        totalLifetimeProfit: 'مجموع کل سودهای دریافتی',
        depositBtn: 'افزایش سرمایه',
        compoundBtn: 'ترکیب سود',
        withdrawBtn: 'برداشت وجه',
        inviteBtn: 'دعوت از دوستان',
        navHome: 'داشبورد',
        navInvest: 'سرمایه‌گذاری',
        navTeam: 'تیم و شبکه',
        navWallet: 'کیف‌پول',
        navProfile: 'پروفایل',
        backBtn: 'بازگشت',
        depositModalTitle: 'شارژ حساب / واریز جدید (USDT)',
        chooseNetwork: 'انتخاب شبکه انتقال:',
        netTrxArrival: 'زمان رسیدن: ~۲ دقیقه',
        netBnbArrival: 'زمان رسیدن: ~۱ دقیقه',
        netMinDeposit: 'حداقل واریز: 1 USDT',
        walletAddressLabel: 'آدرس اختصاصی واریز:',
        addressPendingNotice: 'درگاه اختصاصی کیف‌پول به زودی فعال و متصل می‌گردد.',
        copyBtn: 'کپی آدرس',
        qrPlaceholder: 'QR Code واریز',
        depositWarningText: 'توجه: این واریز به عنوان یک لات (Lot) جدید ثبت شده و تایمر ۹۰‌روزه قفل اختصاصی آن از همین لحظه فعال می‌گردد. پس از ۹۰ روز اصل این مبلغ کاملاً آزاد و قابل برداشت خواهد بود.',
        withdrawModalTitle: 'برداشت از حساب (Withdrawal)',
        unlockedPrincipal: 'اصل سرمایه آزادشده',
        withdrawProfitTab: 'برداشت سود',
        withdrawPrincipalTab: 'برداشت اصل سرمایه آزادشده',
        withdrawAmountLabel: 'مبلغ برداشت (USDT):',
        destAddressLabel: 'آدرس کیف‌پول مقصد (USDT - TRC20/BEP20):',
        estimatedFee: 'کارمزد پلتفرم و شبکه:',
        netReceive: 'مبلغ خالص دریافتی شما:',
        ruleTenPercentText: 'شرط حداقل ۱۰٪ سود جهت برداشت انباشته',
        processingTimeNotice: 'زمان بررسی و پردازش واریزها به کیف‌پول بین ۱ الی ۱۲ ساعت کاری می‌باشد.',
        confirmWithdrawBtn: 'تایید و درخواست برداشت',
        compoundModalTitle: 'ترکیب سود به اصل سرمایه',
        daysSinceLast: 'مدت روز از آخرین تراکنش:',
        daysUnit: 'روز',
        confirmCompoundBtn: 'تأیید و افزودن به اصل سرمایه',
        inviteModalTitle: 'دعوت از دوستان',
        myInviteCode: 'کد دعوت اختصاصی:',
        myInviteLink: 'لینک مستقیم ثبت‌نام:',
        copiedNotice: 'در حافظه کپی شد!',
        withdrawSuccess: 'درخواست برداشت شما با موفقیت ثبت شد.',
        compoundErrUnder10: 'شما در حال حاضر مجاز به ترکیب سود نیستید! برای پوره شدن ۱۰ روز، باید {days} روز دیگر صبر کنید.',
        compoundSuccessMsg: 'شرایط سود فراهم است. کارمزد طبق جدول پله‌ای اعمال می‌گردد.',
        comingSoon: 'این بخش به زودی فعال خواهد شد.',
        tiers: [
            { label: 'کمتر از ۱۰ روز:', val: 'غیرمجاز (خطا)', isErr: true },
            { label: 'بین ۱۰ تا ۱۵ روز:', val: '۵٪ کارمزد' },
            { label: 'بین ۱۵ تا ۲۵ روز:', val: '۳٪ کارمزد' },
            { label: 'بین ۲۵ تا ۳۵ روز:', val: '۱٪ کارمزد' },
            { label: 'بین ۳۵ تا ۵۰ روز:', val: '۰٪ (رایگان)', isGreen: true },
            { label: 'بیش از ۵۰ روز:', val: '۰٪ + ۳٪ بانس پاداش', isGreen: true }
        ]
    }
};

/**
 * تابع ایمن دریافت آدرس از کانفیگ مرکزی
 */
function resolveApiUrl(endpoint) {
    if (window.APP_CONFIG && typeof window.APP_CONFIG.getApiUrl === 'function') {
        return window.APP_CONFIG.getApiUrl(endpoint);
    }
    return endpoint;
}

const STORAGE_LANG_KEY = 'platform_lang';
let currentLanguage = localStorage.getItem(STORAGE_LANG_KEY) || 'fa';

// وضعیت داده‌های زنده دریافتی از دیتابیس
let platformUser = {
    role: 'user',
    activeCapital: 0.00,
    withdrawableProfit: 0.00,
    totalLifetimeEarnings: 0.00,
    unlockedPrincipal: 0.00,
    daysSinceLastCompound: 0,
    referralCode: 'ADM2026',
    dailyRate: 1.15,
    todayProfit: 0.00,
    isReleased: false
};

// دریافت عناصر کنترل صفحه
const langDropdown = document.getElementById('langDropdown');
const langTriggerBtn = document.getElementById('langTriggerBtn');
const currentLangLabel = document.getElementById('currentLangLabel');
const langMenu = document.getElementById('langMenu');
const adminPanelBtn = document.getElementById('adminPanelBtn');
const toastNotification = document.getElementById('toastNotification');

const depositModal = document.getElementById('depositModal');
const withdrawModal = document.getElementById('withdrawModal');
const compoundModal = document.getElementById('compoundModal');
const inviteModal = document.getElementById('inviteModal');

const withdrawAmountInput = document.getElementById('withdrawAmountInput');
const withdrawAddressInput = document.getElementById('withdrawAddressInput');
const modalFeeValue = document.getElementById('modalFeeValue');
const modalNetReceive = document.getElementById('modalNetReceive');
const confirmWithdrawBtn = document.getElementById('confirmWithdrawBtn');
const setMaxAmountBtn = document.getElementById('setMaxAmountBtn');
const tenPercentRuleDot = document.getElementById('tenPercentRuleDot');
const tabWithdrawProfit = document.getElementById('tabWithdrawProfit');
const tabWithdrawPrincipal = document.getElementById('tabWithdrawPrincipal');

let currentWithdrawType = 'profit';
let currentNetwork = 'TRC20';

if (adminPanelBtn) {
    adminPanelBtn.addEventListener('click', () => {
        window.location.href = 'admin.html';
    });
}

/**
 * دریافت اطلاعات زنده از سرور پایتون و دیتابیس Aiven
 */
async function fetchUserDashboardData() {
    let sessionUser = {};
    try {
        sessionUser = JSON.parse(sessionStorage.getItem('current_user') || localStorage.getItem('current_user') || '{}');
    } catch (e) {
        sessionUser = {};
    }
    const currentUserId = sessionUser.userId || sessionUser.id || localStorage.getItem('user_id') || sessionStorage.getItem('user_id');

    if (!currentUserId) {
        window.location.href = 'index.html';
        return;
    }

    const apiUrl = resolveApiUrl('/api/home/stats');

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ userId: currentUserId })
        });
        const result = await response.json();

        if (response.ok && (result.success || result.status === 'success')) {
            const d = result.data || result.user || {};
            platformUser.role = d.role || 'user';
            platformUser.activeCapital = parseFloat(d.activeCapital || d.active_capital || 0.0);
            platformUser.withdrawableProfit = parseFloat(d.withdrawableProfit || d.withdrawable_profit || 0.0);
            platformUser.unlockedPrincipal = parseFloat(d.unlockedPrincipal || d.unlocked_principal || 0.0);
            platformUser.totalLifetimeEarnings = parseFloat(d.totalLifetimeProfit || d.total_lifetime_profit || 0.0);
            platformUser.todayProfit = parseFloat(d.todayProfit || d.today_profit || 0.0);
            platformUser.dailyRate = parseFloat(d.dailyRate || d.daily_rate || 1.15);
            platformUser.isReleased = (d.isReleased !== undefined) ? d.isReleased : (d.is_released !== undefined ? d.is_released : false);
            platformUser.daysSinceLastCompound = d.daysElapsed !== undefined ? d.daysElapsed : (d.days_since_last_compound || 0);
            platformUser.referralCode = d.referralCode || d.referral_code || 'ADM2026';

            // بروزرسانی داینامیک کد و لینک دعوت با توجه به دامنه فعال
            const hostUrl = window.location.origin;
            const refCodeElem = document.getElementById('txtInviteCode');
            const refLinkElem = document.getElementById('txtInviteLink');
            if (refCodeElem) refCodeElem.textContent = platformUser.referralCode;
            if (refLinkElem) refLinkElem.textContent = `${hostUrl}/?ref=${platformUser.referralCode}`;

            if (platformUser.role === 'admin' && adminPanelBtn) {
                adminPanelBtn.classList.remove('hidden');
            }

            updateDashboardStats();
        } else {
            showToast(result.message || 'خطا در دریافت اطلاعات داشبورد', true);
        }
    } catch (e) {
        showToast('خطا در دریافت اطلاعات داشبورد', true);
    }
}

function updateDashboardStats() {
    const elCapital = document.getElementById('statTotalCapital');
    const elWithdrawable = document.getElementById('statWithdrawableProfit');
    const elLifetime = document.getElementById('statTotalLifetime');

    if (elCapital) elCapital.textContent = platformUser.activeCapital.toLocaleString('en-US', { minimumFractionDigits: 2 });
    if (elWithdrawable) elWithdrawable.textContent = platformUser.withdrawableProfit.toLocaleString('en-US', { minimumFractionDigits: 2 });
    if (elLifetime) elLifetime.textContent = platformUser.totalLifetimeEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 });

    const rateBadge = document.getElementById('statDailyRate');
    const todayProfitEl = document.getElementById('statTodayProfit');

    const hasInvestment = platformUser.activeCapital >= 50.00;

    if (!hasInvestment) {
        if (rateBadge) rateBadge.textContent = '0.00%';
        if (todayProfitEl) todayProfitEl.textContent = '0.00';
    } else if (platformUser.isReleased) {
        if (rateBadge) rateBadge.textContent = `+${platformUser.dailyRate.toFixed(2)}%`;
        if (todayProfitEl) todayProfitEl.textContent = platformUser.todayProfit.toLocaleString('en-US', { minimumFractionDigits: 2 });
    } else {
        if (rateBadge) rateBadge.textContent = '---';
        if (todayProfitEl) todayProfitEl.textContent = '---';
    }
}

function showToast(message, isError = false) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.className = isError ? 'toast-alert error show' : 'toast-alert show';
    setTimeout(() => { if (toastNotification) toastNotification.className = 'toast-alert'; }, 3800);
}

function renderCompoundTiers() {
    const dict = dashboardI18n[currentLanguage];
    const container = document.getElementById('tierRulesList');
    if (!container) return;

    let html = '<ul>';
    dict.tiers.forEach(t => {
        let badgeClass = '';
        if (t.isErr) badgeClass = 'class="badge-danger"';
        else if (t.isGreen) badgeClass = 'class="text-green"';

        html += `<li><span>${t.label}</span> <strong ${badgeClass}>${t.val}</strong></li>`;
    });
    html += '</ul>';
    container.innerHTML = html;

    const daysEl = document.getElementById('modalDaysElapsed');
    if (daysEl) {
        daysEl.textContent = `${platformUser.daysSinceLastCompound} ${dict.daysUnit}`;
    }
}

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem(STORAGE_LANG_KEY, lang);
    const dict = dashboardI18n[lang];

    document.documentElement.lang = lang;
    document.documentElement.dir = dict.dir;
    if (currentLangLabel) currentLangLabel.textContent = dict.langName;

    if (langMenu) {
        langMenu.querySelectorAll('.lang-item').forEach(i => {
            i.classList.toggle('active', i.getAttribute('data-value') === lang);
        });
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
    });

    if (langDropdown) langDropdown.classList.remove('open');
    renderCompoundTiers();
}

if (langTriggerBtn && langDropdown) {
    langTriggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!langDropdown.contains(e.target)) langDropdown.classList.remove('open');
    });
}

if (langMenu) {
    langMenu.querySelectorAll('.lang-item').forEach(item => {
        item.addEventListener('click', function () {
            setLanguage(this.getAttribute('data-value'));
        });
    });
}

/**
 * ناوبری تب‌های داخلی و صفحات جانبی
 */
function switchNavTab(tab) {
    if (tab === 'home') {
        document.querySelectorAll('.spa-view').forEach(v => v.classList.remove('active'));
        const homeView = document.getElementById('view-home');
        if (homeView) homeView.classList.add('active');
        document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-target') === 'home');
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
window.switchNavTab = switchNavTab;

document.querySelectorAll('.bottom-nav .nav-item').forEach(button => {
    button.addEventListener('click', function (e) {
        const target = this.getAttribute('data-target') || this.getAttribute('href');

        if (target === 'invest' || target === 'invest.html') {
            e.preventDefault();
            window.location.href = 'invest.html';
            return;
        }
        if (target === 'team' || target === 'team.html') {
            e.preventDefault();
            window.location.href = 'team.html';
            return;
        }
        if (target === 'wallet' || target === 'wallet.html') {
            e.preventDefault();
            window.location.href = 'wallet.html';
            return;
        }
        if (target === 'profile' || target === 'profile.html') {
            e.preventDefault();
            window.location.href = 'profile.html';
            return;
        }
        if (target === 'home' || target === 'home.html') {
            e.preventDefault();
            switchNavTab('home');
            return;
        }
        showToast(dashboardI18n[currentLanguage].comingSoon);
    });
});

// باز و بسته کردن مودال‌ها
function openDepositModal() { if (depositModal) depositModal.classList.remove('hidden'); }
function closeDepositModal() { if (depositModal) depositModal.classList.add('hidden'); }
window.openDepositModal = openDepositModal;
window.closeDepositModal = closeDepositModal;

const openDepositModalBtn = document.getElementById('openDepositModalBtn');
if (openDepositModalBtn) {
    openDepositModalBtn.addEventListener('click', openDepositModal);
}

document.querySelectorAll('.network-card').forEach(card => {
    card.addEventListener('click', function () {
        document.querySelectorAll('.network-card').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        currentNetwork = this.getAttribute('data-network') || 'TRC20';
    });
});

function openWithdrawModal() {
    const profitEl = document.getElementById('modalProfitBalance');
    const unlockedEl = document.getElementById('modalUnlockedBalance');
    if (profitEl) profitEl.textContent = platformUser.withdrawableProfit.toLocaleString('en-US', { minimumFractionDigits: 2 });
    if (unlockedEl) unlockedEl.textContent = platformUser.unlockedPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2 });
    if (withdrawAmountInput) withdrawAmountInput.value = '';
    if (withdrawAddressInput) withdrawAddressInput.value = '';
    calculateWithdrawal();
    if (withdrawModal) withdrawModal.classList.remove('hidden');
}

function closeWithdrawModal() { if (withdrawModal) withdrawModal.classList.add('hidden'); }
window.openWithdrawModal = openWithdrawModal;
window.closeWithdrawModal = closeWithdrawModal;

const openWithdrawModalBtn = document.getElementById('openWithdrawModalBtn');
if (openWithdrawModalBtn) {
    openWithdrawModalBtn.addEventListener('click', openWithdrawModal);
}

if (tabWithdrawProfit && tabWithdrawPrincipal) {
    tabWithdrawProfit.addEventListener('click', () => {
        currentWithdrawType = 'profit';
        tabWithdrawProfit.classList.add('active');
        tabWithdrawPrincipal.classList.remove('active');
        if (withdrawAmountInput) withdrawAmountInput.value = '';
        calculateWithdrawal();
    });

    tabWithdrawPrincipal.addEventListener('click', () => {
        currentWithdrawType = 'principal';
        tabWithdrawPrincipal.classList.add('active');
        tabWithdrawProfit.classList.remove('active');
        if (withdrawAmountInput) withdrawAmountInput.value = '';
        calculateWithdrawal();
    });
}

if (setMaxAmountBtn && withdrawAmountInput) {
    setMaxAmountBtn.addEventListener('click', () => {
        if (currentWithdrawType === 'profit') {
            withdrawAmountInput.value = platformUser.withdrawableProfit;
        } else {
            withdrawAmountInput.value = platformUser.unlockedPrincipal;
        }
        calculateWithdrawal();
    });
}

if (withdrawAmountInput) withdrawAmountInput.addEventListener('input', calculateWithdrawal);
if (withdrawAddressInput) withdrawAddressInput.addEventListener('input', calculateWithdrawal);

/**
 * محاسبه پله‌ای کارمزد و قوانین برداشت
 */
function calculateWithdrawal() {
    if (!withdrawAmountInput || !withdrawAddressInput) return;
    const amount = parseFloat(withdrawAmountInput.value) || 0;
    const address = withdrawAddressInput.value.trim();
    let fee = 0;
    let net = 0;
    let isValid = false;

    const isTenPercentMet = platformUser.withdrawableProfit >= (platformUser.activeCapital * 0.10);
    if (tenPercentRuleDot) {
        tenPercentRuleDot.className = isTenPercentMet ? 'status-indicator ready' : 'status-indicator';
    }

    if (currentWithdrawType === 'profit') {
        const days = platformUser.daysSinceLastCompound;
        let feePercent = 0;
        if (days < 10) feePercent = 100;
        else if (days < 15) feePercent = 5;
        else if (days < 25) feePercent = 3;
        else if (days < 35) feePercent = 1;
        else feePercent = 0;

        fee = (amount * feePercent) / 100;
        net = Math.max(0, amount - fee);

        if (amount > 0 && amount <= platformUser.withdrawableProfit && isTenPercentMet && address.length > 5 && days >= 10) {
            isValid = true;
        }
    } else {
        fee = amount * 0.05;
        net = Math.max(0, amount - fee);
        if (amount > 0 && amount <= platformUser.unlockedPrincipal && address.length > 5) {
            isValid = true;
        }
    }

    if (modalFeeValue) modalFeeValue.textContent = `$${fee.toFixed(2)}`;
    if (modalNetReceive) modalNetReceive.textContent = `$${net.toFixed(2)}`;
    if (confirmWithdrawBtn) confirmWithdrawBtn.disabled = !isValid;
}

/**
 * ثبت نهایی درخواست برداشت
 */
if (confirmWithdrawBtn) {
    confirmWithdrawBtn.addEventListener('click', async () => {
        const amount = parseFloat(withdrawAmountInput.value);
        const address = withdrawAddressInput.value.trim();
        let sessionUser = {};
        try {
            sessionUser = JSON.parse(sessionStorage.getItem('current_user') || localStorage.getItem('current_user') || '{}');
        } catch (e) {
            sessionUser = {};
        }
        const currentUserId = sessionUser.userId || sessionUser.id || localStorage.getItem('user_id');

        const withdrawApiUrl = resolveApiUrl('/api/home/withdraw');

        try {
            const response = await fetch(withdrawApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    userId: currentUserId,
                    type: currentWithdrawType,
                    amount: amount,
                    address: address,
                    network: currentNetwork
                })
            });

            const result = await response.json();
            if (response.ok && (result.success || result.status === 'success')) {
                closeWithdrawModal();
                showToast(result.message || dashboardI18n[currentLanguage].withdrawSuccess, false);
                fetchUserDashboardData();
            } else {
                showToast(result.message, true);
            }
        } catch (e) {
            showToast('خطا در ارسال درخواست برداشت', true);
        }
    });
}

function openCompoundModal() {
    const dict = dashboardI18n[currentLanguage];
    renderCompoundTiers();
    const alertBox = document.getElementById('compoundStatusAlert');
    const confirmBtn = document.getElementById('confirmCompoundBtn');

    if (platformUser.daysSinceLastCompound < 10) {
        const remaining = 10 - platformUser.daysSinceLastCompound;
        if (alertBox) {
            alertBox.textContent = dict.compoundErrUnder10.replace('{days}', remaining);
            alertBox.className = 'compound-status-msg error';
        }
        if (confirmBtn) confirmBtn.disabled = true;
    } else {
        if (alertBox) {
            alertBox.textContent = dict.compoundSuccessMsg;
            alertBox.className = 'compound-status-msg success';
        }
        if (confirmBtn) confirmBtn.disabled = false;
    }
    if (compoundModal) compoundModal.classList.remove('hidden');
}

function closeCompoundModal() { if (compoundModal) compoundModal.classList.add('hidden'); }
window.openCompoundModal = openCompoundModal;
window.closeCompoundModal = closeCompoundModal;

const actionCompoundBtn = document.getElementById('actionCompound');
if (actionCompoundBtn) {
    actionCompoundBtn.addEventListener('click', openCompoundModal);
}

/**
 * ارسال درخواست ترکیب سود
 */
const confirmCompoundBtn = document.getElementById('confirmCompoundBtn');
if (confirmCompoundBtn) {
    confirmCompoundBtn.addEventListener('click', async () => {
        let sessionUser = {};
        try {
            sessionUser = JSON.parse(sessionStorage.getItem('current_user') || localStorage.getItem('current_user') || '{}');
        } catch (e) {
            sessionUser = {};
        }
        const currentUserId = sessionUser.userId || sessionUser.id || localStorage.getItem('user_id');

        const compoundApiUrl = resolveApiUrl('/api/home/compound');

        try {
            const response = await fetch(compoundApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    userId: currentUserId,
                    amount: platformUser.withdrawableProfit
                })
            });

            const result = await response.json();
            if (response.ok && (result.success || result.status === 'success')) {
                closeCompoundModal();
                showToast(result.message || dashboardI18n[currentLanguage].compoundSuccessMsg, false);
                fetchUserDashboardData();
            } else {
                showToast(result.message, true);
            }
        } catch (e) {
            showToast('خطا در پردازش ترکیب سود', true);
        }
    });
}

function openInviteModal() { if (inviteModal) inviteModal.classList.remove('hidden'); }
function closeInviteModal() { if (inviteModal) inviteModal.classList.add('hidden'); }
window.openInviteModal = openInviteModal;
window.closeInviteModal = closeInviteModal;

const actionInviteBtn = document.getElementById('actionInvite');
if (actionInviteBtn) {
    actionInviteBtn.addEventListener('click', openInviteModal);
}

function copyText(txt) {
    const refCode = platformUser.referralCode || 'ADM2026';
    const textToCopy = (txt && txt.includes('http')) ? `${window.location.origin}/?ref=${refCode}` : refCode;
    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(dashboardI18n[currentLanguage].copiedNotice, false);
    });
}
window.copyText = copyText;

function initPlatformVideo() {
    const video = document.querySelector('.platform-video');
    if (video) {
        video.muted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {});
        }
    }
}

function initHomePage() {
    document.querySelectorAll('.spa-view').forEach(v => v.classList.remove('active'));
    const homeView = document.getElementById('view-home');
    if (homeView) homeView.classList.add('active');

    setLanguage(currentLanguage);
    initPlatformVideo();
    fetchUserDashboardData();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomePage);
} else {
    initHomePage();
}
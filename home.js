/**
 * ==============================================================================
 * ADM Platform - Home Dashboard Frontend Controller
 * File: home.js (Instant Zero-Second Balance Rendering Engine)
 * Dependent on: config.js (window.APP_CONFIG)
 * Backend Controller: home.py (API: /api/home/*)
 * ==============================================================================
 */

const dashboardI18n = {
    en: {
        dir: 'ltr',
        langName: 'English',
        adminPanel: 'Admin Panel',
        totalActiveCapital: 'Total Active Base',
        withdrawableProfit: 'Available Settlement Balance',
        todayEarnings: "Current Cycle Yield",
        totalLifetimeProfit: 'Total Lifetime Yield',
        depositBtn: 'Allocate Funds',
        compoundBtn: 'Reallocate',
        withdrawBtn: 'Settlement',
        inviteBtn: 'Invite Friends',
        navHome: 'Dashboard',
        navInvest: 'Performance',
        navTeam: 'Team',
        navWallet: 'Wallet',
        navProfile: 'Profile',
        backBtn: 'Back',
        depositModalTitle: 'Allocate Funds (USDT)',
        chooseNetwork: 'Select Transfer Network:',
        netTrxArrival: 'Arrival time: ~2 mins',
        netBnbArrival: 'Arrival time: ~1 min',
        netMinDeposit: 'Min. deposit: 1 USDT',
        walletAddressLabel: 'Platform Deposit Address:',
        addressPendingNotice: 'Secure deposit gateway will be connected soon.',
        copyBtn: 'Copy',
        qrPlaceholder: 'Scan Deposit QR',
        depositWarningText: 'Note: This entry is registered as a new independent Lot with an active 90-day retention cycle. After the cycle, the base balance is completely available.',
        withdrawModalTitle: 'Account Settlement (USDT)',
        unlockedPrincipal: 'Matured Base Balance',
        withdrawProfitTab: 'Settle Yield',
        withdrawPrincipalTab: 'Settle Matured Base',
        withdrawAmountLabel: 'Amount (USDT):',
        destAddressLabel: 'Destination Wallet Address (USDT - TRC20/BEP20):',
        estimatedFee: 'Estimated Processing/Network Fee:',
        netReceive: 'Net Amount You Receive:',
        ruleTenPercentText: 'Minimum 10% accumulation requirement for settlement',
        processingTimeNotice: 'Settlement requests are processed within 1 to 12 business hours.',
        confirmWithdrawBtn: 'Confirm Settlement',
        compoundModalTitle: 'Reallocate Yield to Base Balance',
        daysSinceLast: 'Days elapsed since last transaction:',
        daysUnit: 'Day(s)',
        confirmCompoundBtn: 'Confirm & Reallocate',
        inviteModalTitle: 'Invite Your Friends',
        myInviteCode: 'My Referral Code:',
        myInviteLink: 'Direct Registration Link:',
        copiedNotice: 'Copied to clipboard!',
        withdrawSuccess: 'Settlement request submitted successfully.',
        compoundErrUnder10: 'Cannot reallocate yet! You must wait another {days} day(s) to reach 10 days.',
        compoundSuccessMsg: 'Conditions met. Tiered fees apply upon reallocation.',
        comingSoon: 'This section will be available soon.',
        errFetchDashboard: 'Error fetching dashboard data.',
        errWithdraw: 'Error submitting settlement request.',
        errCompound: 'Error processing reallocation.',
        errConnection: 'Network connection error with backend server.',
        errInvalidAmount: 'Please enter a valid amount.',
        errInsufficientBalance: 'Amount exceeds available balance.',
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
        totalActiveCapital: 'Base Active Totale',
        withdrawableProfit: 'Solde Disponible pour Règlement',
        todayEarnings: "Rendement du cycle",
        totalLifetimeProfit: 'Rendement Cumulé Total',
        depositBtn: 'Allouer des fonds',
        compoundBtn: 'Réallouer',
        withdrawBtn: 'Règlement',
        inviteBtn: 'Inviter',
        navHome: 'Accueil',
        navInvest: 'Performance',
        navTeam: 'Équipe',
        navWallet: 'Portefeuille',
        navProfile: 'Profil',
        backBtn: 'Retour',
        depositModalTitle: 'Allocation de fonds (USDT)',
        chooseNetwork: 'Choisir le réseau :',
        netTrxArrival: "Temps d'arrivée : ~2 min",
        netBnbArrival: "Temps d'arrivée : ~1 min",
        netMinDeposit: 'Dépôt min. : 1 USDT',
        walletAddressLabel: 'Adresse de dépôt :',
        addressPendingNotice: 'La passerelle de dépôt sera bientôt active.',
        copyBtn: 'Copier',
        qrPlaceholder: 'QR Code Dépôt',
        depositWarningText: 'Remarque : Cette opération constitue un nouveau Lot soumis à un cycle de 90 jours. Après cette période, le solde de base est totalement disponible.',
        withdrawModalTitle: 'Règlement du compte (USDT)',
        unlockedPrincipal: 'Solde de base libéré',
        withdrawProfitTab: 'Régler le rendement',
        withdrawPrincipalTab: 'Régler le solde libéré',
        withdrawAmountLabel: 'Montant (USDT) :',
        destAddressLabel: 'Adresse de destination (TRC20/BEP20) :',
        estimatedFee: 'Frais estimés :',
        netReceive: 'Montant net reçu :',
        ruleTenPercentText: "Condition de 10% d'accumulation requise pour le règlement",
        processingTimeNotice: 'Traitement sous 1 à 12 heures ouvrables.',
        confirmWithdrawBtn: 'Confirmer le règlement',
        compoundModalTitle: 'Réallouer le rendement au solde de base',
        daysSinceLast: 'Jours écoulés :',
        daysUnit: 'Jour(s)',
        confirmCompoundBtn: 'Confirmer et réallouer',
        inviteModalTitle: 'Inviter des amis',
        myInviteCode: 'Code de parrainage :',
        myInviteLink: 'Lien direct :',
        copiedNotice: 'Copié !',
        withdrawSuccess: 'Demande de règlement transmise.',
        compoundErrUnder10: 'Impossible de réallouer ! Veuillez attendre encore {days} jour(s) pour atteindre 10 jours.',
        compoundSuccessMsg: 'Conditions remplies. Les frais échelonnés seront appliqués.',
        comingSoon: 'Bientôt disponible.',
        errFetchDashboard: 'Erreur lors de la récupération des données.',
        errWithdraw: 'Erreur lors de la transmission du règlement.',
        errCompound: 'Erreur lors du traitement de la réallocation.',
        errConnection: 'Erreur de connexion au serveur.',
        errInvalidAmount: 'Veuillez saisir un montant valide.',
        errInsufficientBalance: 'Le montant dépasse votre solde disponible.',
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
        totalActiveCapital: 'Всего активной базы',
        withdrawableProfit: 'Баланс к расчету',
        todayEarnings: 'Доходность текущего цикла',
        totalLifetimeProfit: 'Общий накопленный доход',
        depositBtn: 'Пополнить',
        compoundBtn: 'Перераспределить',
        withdrawBtn: 'Вывод / Расчет',
        inviteBtn: 'Пригласить',
        navHome: 'Главная',
        navInvest: 'Показатели',
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
        depositWarningText: 'Внимание: Эта операция регистрируется как отдельный лот с циклом удержания 90 дней. По истечении срока базовый баланс полностью доступен.',
        withdrawModalTitle: 'Заявка на расчет (USDT)',
        unlockedPrincipal: 'Освобожденный базовый баланс',
        withdrawProfitTab: 'Расчет доходности',
        withdrawPrincipalTab: 'Расчет основного баланса',
        withdrawAmountLabel: 'Сумма (USDT):',
        destAddressLabel: 'Адрес кошелька (TRC20/BEP20):',
        estimatedFee: 'Комиссия обработки:',
        netReceive: 'Сумма к получению:',
        ruleTenPercentText: 'Условие накопления минимум 10% для расчета',
        processingTimeNotice: 'Обработка от 1 до 12 рабочих часов.',
        confirmWithdrawBtn: 'Подтвердить расчет',
        compoundModalTitle: 'Перераспределение дохода в базовый баланс',
        daysSinceLast: 'Дней с последней операции:',
        daysUnit: 'Дн.',
        confirmCompoundBtn: 'Подтвердить и перераспределить',
        inviteModalTitle: 'Пригласить друзей',
        myInviteCode: 'Реферальный код:',
        myInviteLink: 'Ссылка:',
        copiedNotice: 'Скопировано!',
        withdrawSuccess: 'Заявка на расчет отправлена.',
        compoundErrUnder10: 'Перераспределение недоступно! Подождите еще {days} дн.',
        compoundSuccessMsg: 'Условия соблюдены. Действует ступенчатая комиссия.',
        comingSoon: 'Раздел скоро будет доступен.',
        errFetchDashboard: 'Ошибка при получении данных.',
        errWithdraw: 'Ошибка при отправке заявки.',
        errCompound: 'Ошибка при обработке перераспределения.',
        errConnection: 'Ошибка подключения к серверу.',
        errInvalidAmount: 'Пожалуйста, введите корректную сумму.',
        errInsufficientBalance: 'Сумма превышает доступный баланс.',
        tiers: [
            { label: 'Менее 10 дней:', val: 'Запрещено (Ошибка)', isErr: true },
            { label: 'От 10 до 15 дней:', val: '5% Комиссия' },
            { label: 'От 15 до 25 дней:', val: '3% Комиссия' },
            { label: 'От 25 до 35 дней:', val: '1% Комиссия' },
            { label: 'От 35 до 50 дней:', val: '0% (Бесплатно)', isGreen: true },
            { label: 'Более 50 дней:', val: '0% + 3% Бонус', isGreen: true }
        ]
    },
    ar: {
        dir: 'rtl',
        langName: 'العربية',
        adminPanel: 'لوحة الإدارة',
        totalActiveCapital: 'إجمالي الرصيد النشط',
        withdrawableProfit: 'الرصيد المتاح للتسوية',
        todayEarnings: 'عائد الدورة الحالية',
        totalLifetimeProfit: 'إجمالي العوائد التراكمية',
        depositBtn: 'تخصيص رصيد',
        compoundBtn: 'إعادة التخصيص',
        withdrawBtn: 'طلب تسوية',
        inviteBtn: 'دعوة الأصدقاء',
        navHome: 'الرئيسية',
        navInvest: 'المؤشرات',
        navTeam: 'الفريق',
        navWallet: 'المحفظة',
        navProfile: 'الملف',
        backBtn: 'رجوع',
        depositModalTitle: 'تخصيص رصيد (USDT)',
        chooseNetwork: 'اختر الشبكة:',
        netTrxArrival: 'وقت الوصول: ~2 دقيقة',
        netBnbArrival: 'وقت الوصول: ~1 دقيقة',
        netMinDeposit: 'الحد الأدنى للإيداع: 1 USDT',
        walletAddressLabel: 'عنوان الإيداع:',
        addressPendingNotice: 'سيتم ربط بوابة المحفظة قريباً.',
        copyBtn: 'نسخ',
        qrPlaceholder: 'رمز QR للإيداع',
        depositWarningText: 'تنبيه: يُسجل هذا التخصيص كدفعة مستقلة (Lot) مع دورة تشغيلية لمدة 90 يومًا. بعد انتهاء الدورة، يصبح الرصيد متاحاً بالكامل.',
        withdrawModalTitle: 'تسوية الحساب (USDT)',
        unlockedPrincipal: 'الرصيد الأساسي المحرر',
        withdrawProfitTab: 'تسوية العائد',
        withdrawPrincipalTab: 'تسوية الرصيد المحرر',
        withdrawAmountLabel: 'المبلغ (USDT):',
        destAddressLabel: 'عنوان المحفظة المستلمة:',
        estimatedFee: 'الرسوم المقدرة:',
        netReceive: 'المبلغ الصافي المستلم:',
        ruleTenPercentText: 'شرط بلوغ 10% كحد أدنى للتسوية',
        processingTimeNotice: 'تتم معالجة الطلبات خلال 1 إلى 12 ساعة عمل.',
        confirmWithdrawBtn: 'تأكيد التسوية',
        compoundModalTitle: 'إعادة تخصيص العائد للرصيد الأساسي',
        daysSinceLast: 'الأيام المنقضية:',
        daysUnit: 'يوم',
        confirmCompoundBtn: 'تأكيد وإعادة التخصيص',
        inviteModalTitle: 'دعوة الأصدقاء',
        myInviteCode: 'رمز الإحالة:',
        myInviteLink: 'رابط التسجيل:',
        copiedNotice: 'تم النسخ بنجاح!',
        withdrawSuccess: 'تم إرسال طلب التسوية بنجاح.',
        compoundErrUnder10: 'لا يمكن إعادة التخصيص الآن! يجب الانتظار {days} يوم/أيام إضافية.',
        compoundSuccessMsg: 'الشروط مستوفاة. سيتم تطبيق جدول الرسوم المتدرج.',
        comingSoon: 'سيتوفر هذا القسم قريباً.',
        errFetchInvest: 'خطأ في استرداد البيانات.',
        errWithdraw: 'خطأ في إرسال طلب التسوية.',
        errCompound: 'خطأ في معالجة إعادة التخصيص.',
        errConnection: 'خطأ في الاتصال بالخادم.',
        errInvalidAmount: 'يرجى إدخال مبلغ صحيح.',
        errInsufficientBalance: 'المبلغ المدخل يتجاوز الرصيد المتاح.',
        tiers: [
            { label: 'أقل من 10 أيام:', val: 'غير مسموح (خطأ)', isErr: true },
            { label: 'بين 10 و 15 يوماً:', val: '5% رسوم' },
            { label: 'بين 15 و 25 يوماً:', val: '3% رسوم' },
            { label: 'بين 25 و 35 يوماً:', val: '1% رسوم' },
            { label: 'بين 35 و 50 يوماً:', val: '0% (مجاناً)', isGreen: true },
            { label: 'أكثر من 50 يوماً:', val: '0% + 3% مكافأة', isGreen: true }
        ]
    },
    fa: {
        dir: 'rtl',
        langName: 'فارسی',
        adminPanel: 'پنل مدیریت',
        totalActiveCapital: 'کل موجودی پایه فعال',
        withdrawableProfit: 'موجودی در دسترس تسویه',
        todayEarnings: 'بازدهی دوره جاری',
        totalLifetimeProfit: 'مجموع کل بازدهی‌های ثبت‌شده',
        depositBtn: 'تخصيص موجودی',
        compoundBtn: 'تخصیص مجدد',
        withdrawBtn: 'درخواست تسویه',
        inviteBtn: 'دعوت از دوستان',
        navHome: 'داشبورد',
        navInvest: 'شاخص‌ها',
        navTeam: 'تیم و شبکه',
        navWallet: 'کیف‌پول',
        navProfile: 'پروفایل',
        backBtn: 'بازگشت',
        depositModalTitle: 'شارژ حساب / تخصیص جدید (USDT)',
        chooseNetwork: 'انتخاب شبکه انتقال:',
        netTrxArrival: 'زمان رسیدن: ~۲ دقیقه',
        netBnbArrival: 'زمان رسیدن: ~۱ دقیقه',
        netMinDeposit: 'حداقل واریز: 1 USDT',
        walletAddressLabel: 'آدرس اختصاصی واریز:',
        addressPendingNotice: 'درگاه اختصاصی کیف‌پول به زودی فعال و متصل می‌گردد.',
        copyBtn: 'کپی آدرس',
        qrPlaceholder: 'QR Code واریز',
        depositWarningText: 'توجه: این تخصیص به عنوان یک لات (Lot) جدید ثبت شده و چرخه ۹۰‌روزه اختصاصی آن فعال می‌گردد. پس از پایان دوره، موجودی پایه کاملاً آزاد و در دسترس خواهد بود.',
        withdrawModalTitle: 'تسویه حساب (USDT)',
        unlockedPrincipal: 'موجودی پایه آزادشده',
        withdrawProfitTab: 'تسویه بازدهی',
        withdrawPrincipalTab: 'تسویه موجودی پایه آزادشده',
        withdrawAmountLabel: 'مبلغ تسویه (USDT):',
        destAddressLabel: 'آدرس کیف‌پول مقصد (USDT - TRC20/BEP20):',
        estimatedFee: 'کارمزد پردازش و شبکه:',
        netReceive: 'مبلغ خالص دریافتی شما:',
        ruleTenPercentText: 'شرط حداقل ۱۰٪ انباشت جهت ثبت تسویه',
        processingTimeNotice: 'زمان بررسی و پردازش درخواست‌های تسویه بین ۱ الی ۱۲ ساعت کاری می‌باشد.',
        confirmWithdrawBtn: 'تایید و ثبت تسویه',
        compoundModalTitle: 'تخصیص مجدد به موجودی پایه',
        daysSinceLast: 'مدت روز از آخرین تراکنش:',
        daysUnit: 'روز',
        confirmCompoundBtn: 'تأیید و تخصیص مجدد',
        inviteModalTitle: 'دعوت از دوستان',
        myInviteCode: 'کد دعوت اختصاصی:',
        myInviteLink: 'لینک مستقیم ثبت‌نام:',
        copiedNotice: 'در حافظه کپی شد!',
        withdrawSuccess: 'درخواست تسویه شما با موفقیت ثبت شد.',
        compoundErrUnder10: 'شما در حال حاضر مجاز به تخصیص مجدد نیستید! برای سپری شدن ۱۰ روز، باید {days} روز دیگر صبر کنید.',
        compoundSuccessMsg: 'شرایط فراهم است. کارمزد طبق جدول پله‌ای اعمال می‌گردد.',
        comingSoon: 'این بخش به زودی فعال خواهد شد.',
        errFetchDashboard: 'خطا در دریافت اطلاعات داشبورد.',
        errWithdraw: 'خطا در ارسال درخواست تسویه.',
        errCompound: 'خطا در پردازش تخصیص مجدد.',
        errConnection: 'خطا در برقراری ارتباط با سرور.',
        errInvalidAmount: 'لطفاً یک مبلغ معتبر وارد کنید.',
        errInsufficientBalance: 'مبلغ وارد شده بیشتر از موجودی قابل تسویه است.',
        tiers: [
            { label: 'کمتر از ۱۰ روز:', val: 'غیرمجاز (خطا)', isErr: true },
            { label: 'بین ۱۰ تا ۱۵ روز:', val: '۵٪ کارمزد' },
            { label: 'بین ۱۵ تا ۲۵ روز:', val: '۳٪ کارمزد' },
            { label: 'بین ۲۵ تا ۳۵ روز:', val: '۱٪ کارمزد' },
            { label: 'بین ۳۵ تا ۵۰ روز:', val: '۰٪ (رایگان)', isGreen: true },
            { label: 'بیش از ۵۰ روز:', val: '۰٪ + ۳٪ پاداش', isGreen: true }
        ]
    }
};

function resolveApiUrl(endpoint) {
    if (window.APP_CONFIG && typeof window.APP_CONFIG.getApiUrl === 'function') {
        return window.APP_CONFIG.getApiUrl(endpoint);
    }
    return endpoint;
}

const STORAGE_LANG_KEY = 'platform_lang';
let currentLanguage = localStorage.getItem(STORAGE_LANG_KEY) || 'en';
if (!dashboardI18n[currentLanguage]) currentLanguage = 'en';

// مقداردهی اولیه از کش آنی مرورگر جهت حذف پرش به صفر در اولین ثانیه
let platformUser = {
    role: localStorage.getItem('user_role') || 'user',
    activeCapital: parseFloat(localStorage.getItem('cache_active_cap') || '0.00'),
    withdrawableProfit: parseFloat(localStorage.getItem('cache_withdrawable_profit') || '0.00'),
    totalLifetimeEarnings: parseFloat(localStorage.getItem('cache_lifetime_profit') || '0.00'),
    unlockedPrincipal: parseFloat(localStorage.getItem('cache_unlocked_cap') || '0.00'),
    daysSinceLastCompound: parseInt(localStorage.getItem('cache_days_held') || '0', 10),
    referralCode: localStorage.getItem('user_ref_code') || 'ADM2026',
    dailyRate: parseFloat(localStorage.getItem('cache_daily_rate') || '1.15'),
    todayProfit: parseFloat(localStorage.getItem('cache_today_profit') || '0.00'),
    isReleased: localStorage.getItem('cache_is_released') === 'true',
    hasInvestment: parseFloat(localStorage.getItem('cache_active_cap') || '0.00') >= 50.00
};

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

function showToast(message, isError = false) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.className = isError ? 'toast-alert error show' : 'toast-alert show';
    setTimeout(() => { if (toastNotification) toastNotification.className = 'toast-alert'; }, 3800);
}
window.showToast = showToast;

/**
 * دریافت اطلاعات زنده داشبورد متصل به بک‌اند و ذخیره در کش آنی
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
    const dict = dashboardI18n[currentLanguage] || dashboardI18n.en;

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
            platformUser.isReleased = (d.isReleased !== undefined) ? Boolean(d.isReleased) : Boolean(d.is_released);
            platformUser.hasInvestment = (d.hasInvestment !== undefined) ? Boolean(d.hasInvestment) : (platformUser.activeCapital >= 50.00);
            platformUser.daysSinceLastCompound = d.daysElapsed !== undefined ? d.daysElapsed : (d.days_since_last_compound || 0);
            platformUser.referralCode = d.referralCode || d.referral_code || 'ADM2026';

            // ذخیره برای باز شدن آنی در دفعات بعدی و بین صفحات
            localStorage.setItem('cache_active_cap', platformUser.activeCapital);
            localStorage.setItem('cache_withdrawable_profit', platformUser.withdrawableProfit);
            localStorage.setItem('cache_lifetime_profit', platformUser.totalLifetimeEarnings);
            localStorage.setItem('cache_unlocked_cap', platformUser.unlockedPrincipal);
            localStorage.setItem('cache_days_held', platformUser.daysSinceLastCompound);
            localStorage.setItem('cache_daily_rate', platformUser.dailyRate);
            localStorage.setItem('cache_today_profit', platformUser.todayProfit);
            localStorage.setItem('cache_is_released', platformUser.isReleased);
            localStorage.setItem('user_ref_code', platformUser.referralCode);
            localStorage.setItem('user_role', platformUser.role);

            // تنظیم کد دعوت و بارکد
            const hostUrl = window.location.origin;
            const fullInviteUrl = `${hostUrl}/index.html?ref=${platformUser.referralCode}`;
            const refCodeElem = document.getElementById('txtInviteCode');
            const refLinkElem = document.getElementById('txtInviteLink');
            if (refCodeElem) refCodeElem.textContent = platformUser.referralCode;
            if (refLinkElem) refLinkElem.textContent = fullInviteUrl;

            const qrImgElem = document.getElementById('inviteQrImg');
            if (qrImgElem) {
                qrImgElem.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(fullInviteUrl)}&margin=1`;
            }

            if (platformUser.role === 'admin' && adminPanelBtn) {
                adminPanelBtn.classList.remove('hidden');
            } else if (adminPanelBtn) {
                adminPanelBtn.classList.add('hidden');
            }

            updateDashboardStats();
        } else {
            showToast(result.message || dict.errFetchDashboard, true);
        }
    } catch (e) {
        showToast(dict.errFetchDashboard, true);
    }
}

/**
 * به‌روزرسانی فوری کارت‌های آماری
 */
function updateDashboardStats() {
    const elCapital = document.getElementById('statTotalCapital');
    const elWithdrawable = document.getElementById('statWithdrawableProfit');
    const elLifetime = document.getElementById('statTotalLifetime');

    if (elCapital) elCapital.textContent = platformUser.activeCapital.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (elWithdrawable) elWithdrawable.textContent = platformUser.withdrawableProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (elLifetime) elLifetime.textContent = platformUser.totalLifetimeEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const rateBadge = document.getElementById('statDailyRate');
    const todayProfitEl = document.getElementById('statTodayProfit');

    if (!platformUser.hasInvestment) {
        if (rateBadge) rateBadge.textContent = '0.00%';
        if (todayProfitEl) todayProfitEl.textContent = '0.00';
    } else if (platformUser.isReleased) {
        if (rateBadge) rateBadge.textContent = `+${platformUser.dailyRate.toFixed(2)}%`;
        if (todayProfitEl) todayProfitEl.textContent = platformUser.todayProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
        if (rateBadge) rateBadge.textContent = '---';
        if (todayProfitEl) todayProfitEl.textContent = '---';
    }
}

function renderCompoundTiers() {
    const dict = dashboardI18n[currentLanguage] || dashboardI18n.en;
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
    if (!dashboardI18n[lang]) lang = 'en';
    currentLanguage = lang;
    localStorage.setItem(STORAGE_LANG_KEY, lang);
    const dict = dashboardI18n[lang];

    const isRtl = (lang === 'fa' || lang === 'ar');
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
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
    updateDashboardStats();
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
        const dict = dashboardI18n[currentLanguage] || dashboardI18n.en;
        showToast(dict.comingSoon);
    });
});

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
    if (profitEl) profitEl.textContent = platformUser.withdrawableProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (unlockedEl) unlockedEl.textContent = platformUser.unlockedPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

if (confirmWithdrawBtn) {
    confirmWithdrawBtn.addEventListener('click', async () => {
        const amount = parseFloat(withdrawAmountInput.value);
        const address = withdrawAddressInput.value.trim();
        const dict = dashboardI18n[currentLanguage] || dashboardI18n.en;
        let sessionUser = {};
        try {
            sessionUser = JSON.parse(sessionStorage.getItem('current_user') || localStorage.getItem('current_user') || '{}');
        } catch (e) {
            sessionUser = {};
        }
        const currentUserId = sessionUser.userId || sessionUser.id || localStorage.getItem('user_id');

        if (!amount || isNaN(amount) || amount <= 0) {
            showToast(dict.errInvalidAmount, true);
            return;
        }

        const maxAvailable = currentWithdrawType === 'profit' ? platformUser.withdrawableProfit : platformUser.unlockedPrincipal;
        if (amount > maxAvailable) {
            showToast(dict.errInsufficientBalance, true);
            return;
        }

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
                showToast(result.message || dict.withdrawSuccess, false);

                if (currentWithdrawType === 'profit') {
                    platformUser.withdrawableProfit = Math.max(0, platformUser.withdrawableProfit - amount);
                } else {
                    platformUser.unlockedPrincipal = Math.max(0, platformUser.unlockedPrincipal - amount);
                }
                updateDashboardStats();
                fetchUserDashboardData();
            } else {
                showToast(result.message || dict.errWithdraw, true);
            }
        } catch (e) {
            showToast(dict.errWithdraw, true);
        }
    });
}

function openCompoundModal() {
    const dict = dashboardI18n[currentLanguage] || dashboardI18n.en;
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
        const dict = dashboardI18n[currentLanguage] || dashboardI18n.en;
        const compoundAmount = platformUser.withdrawableProfit;

        try {
            const response = await fetch(compoundApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    userId: currentUserId,
                    amount: compoundAmount
                })
            });

            const result = await response.json();
            if (response.ok && (result.success || result.status === 'success')) {
                closeCompoundModal();
                showToast(result.message || dict.compoundSuccessMsg, false);

                platformUser.withdrawableProfit = 0.00;
                platformUser.activeCapital += compoundAmount;
                updateDashboardStats();
                fetchUserDashboardData();
            } else {
                showToast(result.message || dict.errCompound, true);
            }
        } catch (e) {
            showToast(dict.errCompound, true);
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
    const dict = dashboardI18n[currentLanguage] || dashboardI18n.en;
    const refCode = platformUser.referralCode || 'ADM2026';
    const textToCopy = (txt && txt.includes('http')) ? `${window.location.origin}/index.html?ref=${refCode}` : (txt || refCode);
    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(dict.copiedNotice, false);
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
    // ۱. رندر در ثانیه صفر (همان لحظه اول مقادیر واقعی از کش خوانده و روی کارت‌ها درج می‌شوند)
    updateDashboardStats();
    setLanguage(currentLanguage);

    document.querySelectorAll('.spa-view').forEach(v => v.classList.remove('active'));
    const homeView = document.getElementById('view-home');
    if (homeView) homeView.classList.add('active');

    initPlatformVideo();
    // ۲. به‌روزرسانی زنده از سرور در پس‌زمینه
    fetchUserDashboardData();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomePage);
} else {
    initHomePage();
}

window.addEventListener('pageshow', () => {
    updateDashboardStats();
    setLanguage(currentLanguage);
    fetchUserDashboardData();
});
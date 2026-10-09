/**
 * ==============================================================================
 * ADM Platform - Performance & Analytics Frontend Controller
 * File: invest.js
 * Dependent on: config.js (window.APP_CONFIG)
 * Backend Controller: invest.py (API: /api/invest/*)
 * ==============================================================================
 */

const dashboardI18n = {
    en: {
        dir: 'ltr',
        langName: 'English',
        adminPanel: 'Admin Panel',
        accumulatedProfit: 'Total Accumulated Yield',
        todayProfit: 'Current Cycle Yield',
        pendingRelease: 'Calculating / Periodic Settlement in Progress',
        profitReleased: 'Yield Credited & Available',
        noInvestmentNotice: 'No Active Allocation (Min. $50)',
        totalCapitalTitle: 'Total Base Balance',
        lockedCapLabel: 'Allocated:',
        unlockedCapLabel: 'Available:',
        chartSectionTitle: 'Performance & Analytics History',
        chartSectionSub: 'Historical performance indicators of active period',
        tfToday: 'Today (24h)',
        tf7Days: 'Last 7 Days',
        tf30Days: 'Last 30 Days',
        tfAll: 'All History',
        dailyHistoryTableTitle: 'Recent Performance Records',
        thDate: 'Date',
        thDailyYield: 'Rate',
        thAmount: 'Amount',
        thStatus: 'Status',
        statusCredited: 'Credited',
        statusPending: 'Pending',
        noLotsFound: 'No active records found',
        noRecordsFound: 'No records found',
        compoundModuleTitle: 'Reallocation Module (Compound)',
        compoundModuleDesc: 'Reallocate accumulated yields back into your base balance.',
        currentAvailableProfit: 'Available Balance:',
        amountToCompound: 'Amount to Reallocate (USDT):',
        profitHoldDuration: 'Holding Duration:',
        commissionFeeRate: 'Processing Fee Rate:',
        commissionAmount: 'Fee Deduction:',
        netCapitalAdded: 'Net Added to Balance:',
        btnCompoundNow: 'Confirm & Reallocate',
        matrixTitle: 'Reallocation Fee Schedule:',
        lotSectionTitle: 'Lot-Based Retention Cycle Ledger',
        lotSectionSub: 'Each entry is recorded as an independent lot with a dedicated retention cycle.',
        thLotId: 'Lot ID',
        thRegDate: 'Creation Date',
        thLotAmount: 'Amount (USDT)',
        thLotSource: 'Source',
        thDaysLeft: 'Days Remaining',
        thLockStatus: 'Status',
        sourceDirect: 'Direct Allocation',
        sourceCompound: 'Reallocation',
        daysLeftTxt: '{days} days left',
        completedTxt: 'Completed (0 days)',
        badgeLocked: '🔒 Allocated',
        badgeUnlocked: '🔓 Available',
        navHome: 'Dashboard',
        navInvest: 'Performance',
        navTeam: 'Team',
        navWallet: 'Wallet',
        navProfile: 'Profile',
        comingSoon: 'This section will be available soon.',
        copiedNotice: 'Copied to clipboard!',
        compoundSuccess: 'Successfully processed! Added to base balance with a new cycle.',
        errBelow10Days: 'Operation not available yet! Minimum 10 days holding required.',
        errExceedBalance: 'Entered amount exceeds available balance.',
        errInvalidAmount: 'Please enter a valid amount.',
        daysUnit: 'Days',
        errFetchInvest: 'Error fetching data from server.',
        errCompound: 'Error processing request.',
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
        accumulatedProfit: 'Rendement Cumulé Total',
        todayProfit: "Rendement du cycle",
        pendingRelease: 'En cours / Règlement périodique en attente',
        profitReleased: 'Rendement crédité et disponible',
        noInvestmentNotice: 'Aucune allocation active (Min. 50$)',
        totalCapitalTitle: 'Solde de Base Total',
        lockedCapLabel: 'Alloué :',
        unlockedCapLabel: 'Disponible :',
        chartSectionTitle: 'Historique des performances et analyses',
        chartSectionSub: 'Indicateurs de performance de la période active',
        tfToday: "Aujourd'hui (24h)",
        tf7Days: '7 derniers jours',
        tf30Days: '30 derniers jours',
        tfAll: 'Tout',
        dailyHistoryTableTitle: 'Historique récent des performances',
        thDate: 'Date',
        thDailyYield: 'Taux',
        thAmount: 'Montant',
        thStatus: 'Statut',
        statusCredited: 'Crédité',
        statusPending: 'En attente',
        noLotsFound: 'Aucun enregistrement actif trouvé',
        noRecordsFound: 'Aucun enregistrement trouvé',
        compoundModuleTitle: 'Module de Réallocation',
        compoundModuleDesc: 'Réallouez les rendements accumulés dans votre solde de base.',
        currentAvailableProfit: 'Solde disponible :',
        amountToCompound: 'Montant à réallouer (USDT) :',
        profitHoldDuration: 'Durée de rétention :',
        commissionFeeRate: 'Taux de frais de traitement :',
        commissionAmount: 'Frais déduits :',
        netCapitalAdded: 'Montant net ajouté au solde :',
        btnCompoundNow: 'Confirmer et réallouer',
        matrixTitle: 'Barème des frais de traitement :',
        lotSectionTitle: 'Registre des cycles de rétention',
        lotSectionSub: 'Chaque opération est enregistrée en tant que lot indépendant.',
        thLotId: 'ID du Lot',
        thRegDate: "Date d'enregistrement",
        thLotAmount: 'Montant (USDT)',
        thLotSource: 'Origine',
        thDaysLeft: 'Jours restants',
        thLockStatus: 'Statut',
        sourceDirect: 'Allocation directe',
        sourceCompound: 'Réallocation',
        daysLeftTxt: '{days} jours restants',
        completedTxt: 'Terminé (0 jour)',
        badgeLocked: '🔒 Alloué',
        badgeUnlocked: '🔓 Disponible',
        navHome: 'Accueil',
        navInvest: 'Performance',
        navTeam: 'Équipe',
        navWallet: 'Portefeuille',
        navProfile: 'Profil',
        comingSoon: 'Bientôt disponible.',
        copiedNotice: 'Copié !',
        compoundSuccess: 'Opération réussie ! Ajouté au solde avec un nouveau cycle.',
        errBelow10Days: 'Opération indisponible ! Rétention minimale de 10 jours requise.',
        errExceedBalance: 'Le montant dépasse le solde disponible.',
        errInvalidAmount: 'Veuillez saisir un montant valide.',
        daysUnit: 'Jours',
        errFetchInvest: 'Erreur lors de la récupération des données.',
        errCompound: 'Erreur lors du traitement de la demande.',
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
        accumulatedProfit: 'Общая накопленная доходность',
        todayProfit: 'Доходность текущего цикла',
        pendingRelease: 'В обработке / Периодический расчет',
        profitReleased: 'Доход начислен и доступен',
        noInvestmentNotice: 'Нет активного распределения (Мин. $50)',
        totalCapitalTitle: 'Общий базовый баланс',
        lockedCapLabel: 'Выделено:',
        unlockedCapLabel: 'Доступно:',
        chartSectionTitle: 'График показателей и аналитики',
        chartSectionSub: 'Индикаторы эффективности за активный период',
        tfToday: 'Сегодня (24ч)',
        tf7Days: '7 дней',
        tf30Days: '30 дней',
        tfAll: 'Все',
        dailyHistoryTableTitle: 'История недавних показателей',
        thDate: 'Дата',
        thDailyYield: 'Ставка',
        thAmount: 'Сумма',
        thStatus: 'Статус',
        statusCredited: 'Начислено',
        statusPending: 'В ожидании',
        noLotsFound: 'Активных записей не найдено',
        noRecordsFound: 'История записей пуста',
        compoundModuleTitle: 'Модуль перераспределения',
        compoundModuleDesc: 'Перераспределяйте накопленные показатели в базовый баланс.',
        currentAvailableProfit: 'Доступный баланс:',
        amountToCompound: 'Сумма для перераспределения (USDT):',
        profitHoldDuration: 'Период удержания:',
        commissionFeeRate: 'Комиссия за обработку:',
        commissionAmount: 'Сумма комиссии:',
        netCapitalAdded: 'Чистая сумма к балансу:',
        btnCompoundNow: 'Подтвердить и перераспределить',
        matrixTitle: 'Шкала комиссий за обработку:',
        lotSectionTitle: 'Журнал учетных циклов (Lots)',
        lotSectionSub: 'Каждая запись регистрируется как отдельный лот с установленным циклом.',
        thLotId: 'ID Лота',
        thRegDate: 'Дата создания',
        thLotAmount: 'Сумма (USDT)',
        thLotSource: 'Источник',
        thDaysLeft: 'Осталось дней',
        thLockStatus: 'Статус',
        sourceDirect: 'Прямое распределение',
        sourceCompound: 'Перераспределение',
        daysLeftTxt: 'Осталось {days} дн.',
        completedTxt: 'Завершен (0 дн.)',
        badgeLocked: '🔒 Выделено',
        badgeUnlocked: '🔓 Доступно',
        navHome: 'Главная',
        navInvest: 'Показатели',
        navTeam: 'Команда',
        navWallet: 'Кошелек',
        navProfile: 'Профиль',
        comingSoon: 'Раздел скоро будет доступен.',
        copiedNotice: 'Скопировано!',
        compoundSuccess: 'Успешно обработано! Добавлено в базовый баланс с новым циклом.',
        errBelow10Days: 'Операция недоступна! Требуется минимум 10 дней удержания.',
        errExceedBalance: 'Сумма превышает доступный баланс.',
        errInvalidAmount: 'Пожалуйста, введите корректную сумму.',
        daysUnit: 'Дней',
        errFetchInvest: 'Ошибка при получении данных с сервера.',
        errCompound: 'Ошибка при обработке запроса.',
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
        accumulatedProfit: 'إجمالي العوائد التراكمية',
        todayProfit: 'عائد الدورة الحالية',
        pendingRelease: 'قيد المعالجة / تسوية دورية',
        profitReleased: 'تم احتساب العائد وإتاحته',
        noInvestmentNotice: 'لا يوجد تخصيص نشط (الحد الأدنى 50$)',
        totalCapitalTitle: 'إجمالي الرصيد الأساسي',
        lockedCapLabel: 'مخصص:',
        unlockedCapLabel: 'متاح:',
        chartSectionTitle: 'مخطط الأداء والتحليلات',
        chartSectionSub: 'مؤشرات الأداء التاريخية للدورة النشطة',
        tfToday: 'اليوم (24 ساعة)',
        tf7Days: 'آخر 7 أيام',
        tf30Days: 'آخر 30 يوماً',
        tfAll: 'الكل',
        dailyHistoryTableTitle: 'سجل مؤشرات الأداء الأخيرة',
        thDate: 'التاريخ',
        thDailyYield: 'المعدل',
        thAmount: 'المبلغ',
        thStatus: 'الحالة',
        statusCredited: 'تم التسجيل',
        statusPending: 'معلق',
        noLotsFound: 'لا توجد سجلات نشطة',
        noRecordsFound: 'لا توجد سجلات',
        compoundModuleTitle: 'نظام إعادة التخصيص والتدوير',
        compoundModuleDesc: 'إعادة تخصيص العوائد المتراكمة ضمن الرصيد الأساسي.',
        currentAvailableProfit: 'الرصيد المتاح:',
        amountToCompound: 'المبلغ المراد تخصيصه (USDT):',
        profitHoldDuration: 'مدة الاحتفاظ:',
        commissionFeeRate: 'نسبة رسوم المعالجة:',
        commissionAmount: 'مبلغ الرسوم:',
        netCapitalAdded: 'المبلغ الصافي المضاف للرصيد:',
        btnCompoundNow: 'تأكيد وإعادة التخصيص',
        matrixTitle: 'جدول رسوم المعالجة:',
        lotSectionTitle: 'سجل دورات الاحتفاظ بالدفعات',
        lotSectionSub: 'يُسجل كل إدخال كدفعة مستقلة تخضع لدورة تشغيلية محددة.',
        thLotId: 'رقم الدفعة (Lot ID)',
        thRegDate: 'تاريخ التسجيل',
        thLotAmount: 'المبلغ (USDT)',
        thLotSource: 'المصدر',
        thDaysLeft: 'الأيام المتبقية',
        thLockStatus: 'الحالة',
        sourceDirect: 'تخصيص مباشر',
        sourceCompound: 'إعادة تخصيص',
        daysLeftTxt: 'باقي {days} يوم',
        completedTxt: 'مكتمل (0 يوم)',
        badgeLocked: '🔒 مخصص',
        badgeUnlocked: '🔓 متاح',
        navHome: 'الرئيسية',
        navInvest: 'المؤشرات',
        navTeam: 'الفريق',
        navWallet: 'المحفظة',
        navProfile: 'الملف',
        comingSoon: 'سيتوفر هذا القسم قريباً.',
        copiedNotice: 'تم النسخ بنجاح!',
        compoundSuccess: 'تمت العملية بنجاح! أضيفت للرصيد مع دورة جديدة.',
        errBelow10Days: 'لا يمكن إتمام العملية حالياً! يجب الاحتفاظ لمدة 10 أيام على الأقل.',
        errExceedBalance: 'المبلغ المدخل يتجاوز الرصيد المتاح.',
        errInvalidAmount: 'يرجى إدخال مبلغ صحيح.',
        daysUnit: 'يوم',
        errFetchInvest: 'خطأ في استرداد البيانات من الخادم.',
        errCompound: 'خطأ في معالجة الطلب.',
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
        accumulatedProfit: 'مجموع بازدهی انباشته',
        todayProfit: 'بازدهی دوره جاری',
        pendingRelease: 'در حال پردازش / تسویه دوره‌ای',
        profitReleased: 'بازدهی ثبت و فعال شد',
        noInvestmentNotice: 'فاقد تخصیص فعال (حداقل ۵۰ دلار)',
        totalCapitalTitle: 'موجودی پایه کل',
        lockedCapLabel: 'تخصیص‌یافته:',
        unlockedCapLabel: 'آزاد:',
        chartSectionTitle: 'نمودار عملکرد و تحلیل آماری',
        chartSectionSub: 'تاریخچه شاخص‌های ثبت‌شده در دوره فعال',
        tfToday: 'امروز (۲۴ ساعته)',
        tf7Days: '۷ روز گذشته',
        tf30Days: '۳۰ روز گذشته',
        tfAll: 'همه',
        dailyHistoryTableTitle: 'گزارش سوابق دوره‌ای',
        thDate: 'تاریخ',
        thDailyYield: 'شاخص عملکرد',
        thAmount: 'مقدار ثبت‌شده',
        thStatus: 'وضعیت',
        statusCredited: 'تایید شد',
        statusPending: 'در انتظار',
        noLotsFound: 'هیچ رکورد فعالی وجود ندارد',
        noRecordsFound: 'هیچ سابقه‌ای یافت نشد',
        compoundModuleTitle: 'سیستم تخصیص مجدد و بازتولید',
        compoundModuleDesc: 'مدیریت و انتقال منابع به حجم عملیاتی اصلی سیستم.',
        currentAvailableProfit: 'موجودی در دسترس:',
        amountToCompound: 'مقدار مورد نظر جهت تخصیص (USDT):',
        profitHoldDuration: 'مدت زمان چرخه فعال:',
        commissionFeeRate: 'کارمزد پردازش:',
        commissionAmount: 'مبلغ پردازش:',
        netCapitalAdded: 'مقدار خالص افزوده شده به حساب:',
        btnCompoundNow: 'تایید و انتقال به موجودی اصلی',
        matrixTitle: 'قوانین پردازش سیستم:',
        lotSectionTitle: 'دفتر کل دوره‌های نگهداری (Lot Records)',
        lotSectionSub: 'سوابق کلیه تخصیص‌ها و دوره‌های زمانی در این جدول ثبت و مدیریت می‌گردد.',
        thLotId: 'شناسه لات',
        thRegDate: 'تاریخ ثبت',
        thLotAmount: 'مبلغ (USDT)',
        thLotSource: 'منبع',
        thDaysLeft: 'روزهای باقی‌مانده',
        thLockStatus: 'وضعیت',
        sourceDirect: 'تخصیص مستقیم',
        sourceCompound: 'تخصیص مجدد',
        daysLeftTxt: '{days} روز مانده',
        completedTxt: 'پایان دوره (۰ روز)',
        badgeLocked: '🔒 تخصیص‌یافته',
        badgeUnlocked: '🔓 آزاد',
        navHome: 'داشبورد',
        navInvest: 'شاخص‌ها',
        navTeam: 'تیم و شبکه',
        navWallet: 'کیف‌پول',
        navProfile: 'پروفایل',
        comingSoon: 'این بخش به زودی فعال خواهد شد.',
        copiedNotice: 'در حافظه کپی شد!',
        compoundSuccess: 'عملیات با موفقیت انجام شد و با دوره جدید به موجودی پایه افزوده گردید.',
        errBelow10Days: 'در حال حاضر مجاز نیستید! حداقل ۱۰ روز نگهداری الزامی است.',
        errExceedBalance: 'مبلغ وارد شده از موجودی در دسترس بیشتر است.',
        errInvalidAmount: 'لطفاً یک مبلغ معتبر وارد کنید.',
        daysUnit: 'روز',
        errFetchInvest: 'خطا در دریافت اطلاعات از سرور.',
        errCompound: 'خطا در پردازش درخواست.',
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

let investState = {
    role: 'user',
    hasInvestment: false,
    accumulatedProfit: 0.00,
    availableProfit: 0.00,
    totalCapital: 0.00,
    lockedCapital: 0.00,
    unlockedCapital: 0.00,
    todayProfit: 0.00,
    dailyRate: 0.00,
    isReleased: false,
    daysHeld: 0,
    lots: [],
    profitHistory: []
};

// دریافت عناصر کنترل صفحه
const langDropdown = document.getElementById('langDropdown');
const langTriggerBtn = document.getElementById('langTriggerBtn');
const currentLangLabel = document.getElementById('currentLangLabel');
const langMenu = document.getElementById('langMenu');
const adminPanelBtn = document.getElementById('adminPanelBtn');
const toastNotification = document.getElementById('toastNotification');

const compoundAmountInput = document.getElementById('compoundAmountInput');
const compoundMaxBtn = document.getElementById('compoundMaxBtn');
const txtFeeRate = document.getElementById('txtFeeRate');
const txtFeeAmount = document.getElementById('txtFeeAmount');
const txtNetCompound = document.getElementById('txtNetCompound');
const btnExecuteCompound = document.getElementById('btnExecuteCompound');

const canvas = document.getElementById('profitHistoryCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const yAxisCanvas = document.getElementById('yAxisCanvas');
const yCtx = yAxisCanvas ? yAxisCanvas.getContext('2d') : null;
const tooltip = document.getElementById('chartTooltip');

let currentRange = '30';
let chartPoints = [];

function showToast(message, isError = false) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.className = isError ? 'toast-alert error show' : 'toast-alert show';
    setTimeout(() => { if (toastNotification) toastNotification.className = 'toast-alert'; }, 3800);
}
window.showToast = showToast;

if (adminPanelBtn) {
    adminPanelBtn.addEventListener('click', () => {
        window.location.href = 'admin.html';
    });
}

/**
 * دریافت اطلاعات سرمایه‌گذاری متصل به بک‌اند به صورت کاملاً زنده
 */
async function fetchInvestData() {
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

    const apiUrl = resolveApiUrl('/api/invest/data');
    const dict = dashboardI18n[currentLanguage] || dashboardI18n.en;

    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ userId: currentUserId })
        });
        const result = await res.json();

        if (res.ok && (result.success || result.status === 'success')) {
            investState = result.data;

            if (investState.role === 'admin' && adminPanelBtn) {
                adminPanelBtn.classList.remove('hidden');
            } else if (adminPanelBtn) {
                adminPanelBtn.classList.add('hidden');
            }

            updateSummaryCards();
            renderDailyProfitsTable();
            renderLotsTable();
            renderCompoundRulesMatrix();
            updateCompoundCalculations();
        } else {
            showToast(result.message || dict.errFetchInvest, true);
        }
    } catch (e) {
        showToast(dict.errFetchInvest, true);
    }
}

function updateSummaryCards() {
    const dict = dashboardI18n[currentLanguage] || dashboardI18n.en;

    const statAccProfit = document.getElementById('statAccumulatedProfit');
    const statTotalCap = document.getElementById('statTotalCapital');
    const statLockedCap = document.getElementById('statLockedCapital');
    const statUnlockedCap = document.getElementById('statUnlockedCapital');
    const txtCurProfit = document.getElementById('txtCurrentProfit');

    if (statAccProfit) statAccProfit.textContent = investState.accumulatedProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (statTotalCap) statTotalCap.textContent = investState.totalCapital.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (statLockedCap) statLockedCap.textContent = `$${investState.lockedCapital.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (statUnlockedCap) statUnlockedCap.textContent = `$${investState.unlockedCapital.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (txtCurProfit) txtCurProfit.textContent = investState.availableProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const rateBadge = document.getElementById('statDailyRate');
    const todayProfitEl = document.getElementById('statTodayProfit');
    const dot = document.getElementById('releaseStatusDot');
    const txt = document.getElementById('releaseStatusText');

    if (!investState.hasInvestment) {
        if (rateBadge) rateBadge.textContent = '0.00%';
        if (todayProfitEl) todayProfitEl.textContent = '0.00';
        if (dot) dot.style.display = 'none';
        if (txt) txt.textContent = dict.noInvestmentNotice;
    } else {
        if (dot) dot.style.display = 'inline-block';
        if (investState.isReleased) {
            if (rateBadge) rateBadge.textContent = `+${investState.dailyRate.toFixed(2)}%`;
            if (todayProfitEl) todayProfitEl.textContent = investState.todayProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            dot.className = 'status-pulse-dot released';
            if (txt) txt.textContent = dict.profitReleased;
        } else {
            if (rateBadge) rateBadge.textContent = '---';
            if (todayProfitEl) todayProfitEl.textContent = '---';
            dot.className = 'status-pulse-dot';
            if (txt) txt.textContent = dict.pendingRelease;
        }
    }
}

function renderDailyProfitsTable() {
    const tbody = document.getElementById('dailyProfitsTableBody');
    const dict = dashboardI18n[currentLanguage] || dashboardI18n.en;
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!investState.profitHistory || investState.profitHistory.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#848E9C; padding:20px;">${dict.noRecordsFound}</td></tr>`;
        return;
    }

    investState.profitHistory.forEach(rec => {
        const tr = document.createElement('tr');
        const isCredited = Boolean(rec.credited);
        const statusClass = isCredited ? 'credited' : 'pending';
        const statusLabel = isCredited ? dict.statusCredited : dict.statusPending;
        const rateTxt = isCredited ? `+${rec.rate.toFixed(2)}%` : '---';
        const amountTxt = isCredited ? `+$${parseFloat(rec.amount || 0).toFixed(2)}` : '---';

        tr.innerHTML = `
            <td>${rec.date}</td>
            <td class="${isCredited ? 'text-green' : ''}">${rateTxt}</td>
            <td><strong>${amountTxt}</strong></td>
            <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderLotsTable() {
    const tbody = document.getElementById('lotsTableBody');
    const dict = dashboardI18n[currentLanguage] || dashboardI18n.en;
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!investState.lots || investState.lots.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#848E9C; padding:20px;">${dict.noLotsFound}</td></tr>`;
        return;
    }

    investState.lots.forEach(lot => {
        const remainingDays = lot.days_left;
        const percent = Math.min(100, Math.round((lot.days_passed / 90) * 100));
        const isUnlocked = lot.status === 'unlocked' || remainingDays === 0;

        const sourceTxt = lot.source === 'deposit' ? dict.sourceDirect : dict.sourceCompound;
        const daysTxt = isUnlocked ? dict.completedTxt : dict.daysLeftTxt.replace('{days}', remainingDays);
        const statusPill = isUnlocked 
            ? `<span class="lot-status-pill unlocked">${dict.badgeUnlocked}</span>` 
            : `<span class="lot-status-pill locked">${dict.badgeLocked}</span>`;
        const fillClass = isUnlocked ? 'progress-fill-line completed' : 'progress-fill-line';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>#LOT-${lot.id}</strong></td>
            <td>${lot.reg_date}</td>
            <td>$${parseFloat(lot.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>${sourceTxt}</td>
            <td>
                <div class="days-progress-wrapper">
                    <div class="days-progress-bar"><div class="${fillClass}" style="width: ${percent}%;"></div></div>
                    <span class="days-count-txt">${daysTxt}</span>
                </div>
            </td>
            <td>${statusPill}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderCompoundRulesMatrix() {
    const matrixList = document.getElementById('compoundMatrixList');
    if (!matrixList) return;
    const dict = dashboardI18n[currentLanguage] || dashboardI18n.en;

    matrixList.innerHTML = '';
    dict.tiers.forEach(tier => {
        const li = document.createElement('li');
        let valBadge = `<strong>${tier.val}</strong>`;
        if (tier.isErr) valBadge = `<span class="badge-red">${tier.val}</span>`;
        else if (tier.isGreen) valBadge = `<strong class="text-green">${tier.val}</strong>`;

        li.innerHTML = `<span>${tier.label}</span> ${valBadge}`;
        matrixList.appendChild(li);
    });

    const txtHoldDays = document.getElementById('txtHoldDays');
    if (txtHoldDays) {
        txtHoldDays.textContent = `${investState.daysHeld} ${dict.daysUnit}`;
    }
}

async function loadChartData() {
    const chartApiUrl = resolveApiUrl('/api/invest/chart');

    try {
        const res = await fetch(chartApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ range: currentRange })
        });
        const result = await res.json();
        if (res.ok && result.success) {
            chartPoints = result.points;
            drawProfitChart();
        }
    } catch (e) {}
}

function drawStickyYAxis(paddingTop, chartHeight, minVal, maxVal) {
    if (!yAxisCanvas || !yCtx) return;

    yAxisCanvas.width = 58 * window.devicePixelRatio;
    yAxisCanvas.height = 290 * window.devicePixelRatio;
    yCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

    yCtx.clearRect(0, 0, 58, 290);
    yCtx.fillStyle = '#848E9C';
    yCtx.font = '11px Inter, sans-serif';
    yCtx.textAlign = 'right';

    const yLevels = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.3];
    yLevels.forEach(v => {
        const y = paddingTop + chartHeight - ((v - minVal) / (maxVal - minVal)) * chartHeight;
        yCtx.fillText(`${v.toFixed(1)}%`, 48, y + 4);
        
        yCtx.strokeStyle = '#2E323A';
        yCtx.lineWidth = 1;
        yCtx.beginPath();
        yCtx.moveTo(50, y);
        yCtx.lineTo(58, y);
        yCtx.stroke();
    });
}

function drawProfitChart() {
    if (!canvas || !ctx || !chartPoints || chartPoints.length === 0) return;
    const wrapper = document.getElementById('canvasScrollWrapper');

    let computedWidth = 980;
    if (currentRange === 'today') computedWidth = 980;
    else if (currentRange === '7') computedWidth = 980;
    else if (currentRange === '30') computedWidth = 1250;
    else if (currentRange === 'all') computedWidth = 3200;

    if (wrapper) wrapper.style.width = `${computedWidth}px`;

    canvas.width = computedWidth * window.devicePixelRatio;
    canvas.height = 290 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = computedWidth;
    const height = 290;
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 35, right: 45, bottom: 45, left: 25 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const minVal = 0.00;
    const maxVal = 1.35;

    drawStickyYAxis(padding.top, chartH, minVal, maxVal);

    ctx.strokeStyle = '#1E2329';
    ctx.lineWidth = 1;
    const yLevels = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.3];
    yLevels.forEach(v => {
        const y = padding.top + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    });

    const yMinLegal = padding.top + chartH - ((0.80 - minVal) / (maxVal - minVal)) * chartH;
    ctx.strokeStyle = 'rgba(240, 185, 11, 0.25)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, yMinLegal);
    ctx.lineTo(width, yMinLegal);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#848E9C';
    ctx.font = '11px Inter, sans-serif';

    chartPoints.forEach((pt, idx) => {
        const x = padding.left + (idx / Math.max(1, chartPoints.length - 1)) * chartW;
        const clampedRate = Math.max(0.80, Math.min(1.30, pt.rate));
        const y = padding.top + chartH - ((clampedRate - minVal) / (maxVal - minVal)) * chartH;
        pt.x = x;
        pt.y = y;

        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        const labelInterval = (currentRange === 'all') ? 14 : (currentRange === '30' ? 3 : (currentRange === 'today' ? 2 : 1));
        if (idx % labelInterval === 0 || idx === chartPoints.length - 1) {
            ctx.fillText(pt.date, x, height - 12);
        }
    });

    ctx.save();
    ctx.strokeStyle = '#0ECB81';
    ctx.lineWidth = 2.6;
    ctx.shadowColor = 'rgba(14, 203, 129, 0.7)';
    ctx.shadowBlur = 9;
    ctx.stroke();
    ctx.restore();

    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.lineTo(padding.left, padding.top + chartH);
    const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    grad.addColorStop(0, 'rgba(14, 203, 129, 0.25)');
    grad.addColorStop(1, 'rgba(14, 203, 129, 0.0)');
    ctx.fillStyle = grad;
    ctx.fill();

    chartPoints.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = '#0ECB81';
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = '#0B0E11';
        ctx.stroke();
    });

    const scrollBox = document.querySelector('.chart-scroll-container');
    if (scrollBox && (currentRange === '30' || currentRange === 'all')) {
        setTimeout(() => {
            scrollBox.scrollLeft = scrollBox.scrollWidth;
        }, 80);
    }
}

if (canvas) {
    canvas.addEventListener('mousemove', (e) => {
        if (!tooltip) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;

        let closest = null;
        let minDist = 9999;
        chartPoints.forEach(pt => {
            const dist = Math.abs(pt.x - mouseX);
            if (dist < minDist) {
                minDist = dist;
                closest = pt;
            }
        });

        if (closest && minDist < 35) {
            tooltip.textContent = `${closest.date}: +${closest.rate.toFixed(2)}%`;
            tooltip.style.left = `${closest.x}px`;
            tooltip.style.top = `${closest.y}px`;
            tooltip.classList.remove('hidden');
        } else {
            tooltip.classList.add('hidden');
        }
    });

    canvas.addEventListener('mouseleave', () => {
        if (tooltip) tooltip.classList.add('hidden');
    });
}

document.querySelectorAll('.tf-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentRange = this.getAttribute('data-range');
        loadChartData();
    });
});

function updateCompoundCalculations() {
    if (!compoundAmountInput) return;
    const amount = parseFloat(compoundAmountInput.value) || 0;
    const days = investState.daysHeld;
    let feePercent = 0;
    let bonusPercent = 0;
    let isAllowed = true;

    if (days < 10) {
        isAllowed = false;
        feePercent = 0;
    } else if (days >= 10 && days < 15) {
        feePercent = 5;
    } else if (days >= 15 && days < 25) {
        feePercent = 3;
    } else if (days >= 25 && days < 35) {
        feePercent = 1;
    } else if (days >= 35 && days < 50) {
        feePercent = 0;
    } else if (days >= 50) {
        feePercent = 0;
        bonusPercent = 3;
    }

    const feeAmount = (amount * feePercent) / 100;
    const bonusAmount = (amount * bonusPercent) / 100;
    const netAdded = Math.max(0, amount - feeAmount + bonusAmount);

    if (txtFeeRate) txtFeeRate.textContent = `${feePercent}%`;
    if (txtFeeAmount) txtFeeAmount.textContent = `$${feeAmount.toFixed(2)}`;
    if (txtNetCompound) txtNetCompound.textContent = `$${netAdded.toFixed(2)}`;

    const isValid = isAllowed && amount > 0 && amount <= investState.availableProfit;
    if (btnExecuteCompound) btnExecuteCompound.disabled = !isValid;
}

if (compoundMaxBtn && compoundAmountInput) {
    compoundMaxBtn.addEventListener('click', () => {
        compoundAmountInput.value = investState.availableProfit;
        updateCompoundCalculations();
    });
}

if (compoundAmountInput) {
    compoundAmountInput.addEventListener('input', updateCompoundCalculations);
}

if (btnExecuteCompound) {
    btnExecuteCompound.addEventListener('click', async () => {
        const amount = parseFloat(compoundAmountInput.value);
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

        if (investState.daysHeld < 10) {
            showToast(dict.errBelow10Days, true);
            return;
        }

        if (amount > investState.availableProfit) {
            showToast(dict.errExceedBalance, true);
            return;
        }

        const compoundApiUrl = resolveApiUrl('/api/invest/compound');

        try {
            const res = await fetch(compoundApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    userId: currentUserId,
                    amount: amount
                })
            });

            const result = await res.json();
            if (res.ok && (result.success || result.status === 'success')) {
                compoundAmountInput.value = '';
                showToast(result.message || dict.compoundSuccess, false);
                fetchInvestData();
            } else {
                showToast(result.message || dict.errCompound, true);
            }
        } catch (e) {
            showToast(dict.errCompound, true);
        }
    });
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
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });

    if (langDropdown) langDropdown.classList.remove('open');
    renderCompoundRulesMatrix();
    updateSummaryCards();
    renderDailyProfitsTable();
    renderLotsTable();
    drawProfitChart();
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

function universalRedirect(targetUrl) {
    if (!targetUrl) return;
    const current = window.location.pathname.split('/').pop() || 'invest.html';
    if (current.toLowerCase() !== targetUrl.toLowerCase()) {
        window.location.href = targetUrl;
    }
}

function bindBulletproofNav() {
    const navButtons = document.querySelectorAll('.bottom-nav .nav-item, nav .nav-item, footer .nav-item, .nav-item, nav a, nav button');

    navButtons.forEach((btn, index) => {
        btn.removeAttribute('onclick');
        btn.onclick = null;

        btn.addEventListener('click', function (e) {
            e.stopImmediatePropagation();
            e.preventDefault();

            const text = (this.textContent || '').trim().toLowerCase();
            const combined = `${text} ${index}`;

            if (combined.includes('home') || combined.includes('داشبورد') || index === 0) {
                universalRedirect('home.html');
                return;
            }
            if (combined.includes('invest') || combined.includes('سرمایه') || index === 1) {
                return;
            }
            if (combined.includes('team') || combined.includes('تیم') || index === 2) {
                universalRedirect('team.html');
                return;
            }
            if (combined.includes('wallet') || combined.includes('کیف') || index === 3) {
                universalRedirect('wallet.html');
                return;
            }
            if (combined.includes('profile') || combined.includes('پروفایل') || index === 4) {
                universalRedirect('profile.html');
                return;
            }
        }, true);
    });
}

function initInvestPage() {
    setLanguage(currentLanguage);
    bindBulletproofNav();
    fetchInvestData();
    loadChartData();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInvestPage);
} else {
    initInvestPage();
}

window.addEventListener('pageshow', () => {
    setLanguage(currentLanguage);
    fetchInvestData();
});
/**
 * پلتفرم سرمایه‌گذاری بایننس - اسکریپت جامع کیف‌پول و برداشت (Wallet)
 */

// دیکشنری ۵ زبانه کامل پلتفرم
const walletI18n = {
    en: {
        dir: 'ltr',
        langName: 'English',
        adminPanel: 'Admin Panel',
        navHome: 'Dashboard',
        navInvest: 'Invest',
        navTeam: 'Team',
        navWallet: 'Wallet',
        navProfile: 'Profile',
        walletOverviewTitle: 'Wallet & Asset Management',
        walletOverviewSub: 'Manage deposits, withdraw profits, and release principal funds.',
        totalActiveCapital: 'Total Active Capital',
        lockedPrincipal: 'Locked Principal:',
        unlockedPrincipal: 'Unlocked Principal:',
        withdrawableProfit: 'Withdrawable Profit',
        tenPercentMetBadge: '10% Rule Met',
        tenPercentNotMetBadge: 'Under 10% Minimum',
        processingTimeNotice: 'Withdrawals are processed within 1 to 12 business hours.',
        ruleTenPercentText: 'Minimum 10% profit accumulation requirement',
        actionDepositTab: 'Deposit Funds',
        actionWithdrawTab: 'Withdraw Funds',
        selectActionPrompt: 'Please select either Deposit or Withdraw above to proceed with transactions.',
        depositModalTitle: 'Deposit Funds (USDT)',
        chooseNetwork: 'Select Transfer Network (Deposit Network):',
        netTrxArrival: 'Arrival time: ~2 mins',
        netBnbArrival: 'Arrival time: ~1 min',
        netMinDeposit: 'Min. deposit: 1 USDT',
        walletAddressLabel: 'Platform Deposit Address:',
        copyBtn: 'Copy Address',
        qrPlaceholder: 'Scan Deposit QR',
        depositWarningText: 'Note: This deposit is registered as a new independent Lot with an active 90-day lock cycle. After 90 days, the principal is completely unlocked and withdrawable.',
        withdrawModalTitle: 'Withdraw Funds (USDT)',
        withdrawProfitTab: 'Withdraw Profit',
        withdrawPrincipalTab: 'Withdraw Unlocked Principal',
        withdrawAmountLabel: 'Amount (USDT):',
        destAddressLabel: 'Destination Wallet Address (USDT - TRC20/BEP20):',
        estimatedFee: 'Estimated Network/Platform Fee:',
        feeTierLabel: 'Applied Fee Tier:',
        netReceive: 'Net Amount You Receive:',
        confirmWithdrawBtn: 'Confirm Withdrawal',
        feeTierExplanation: 'Profit withdrawal fee mirrors compound tiers: <10 days locked; 10-15 days: 5%; 15-25 days: 3%; 25-35 days: 1%; >35 days: 0%. Unlocked principal withdrawal carries a flat 5% fee after 90 days.',
        txHistoryTitle: 'Wallet Transaction History',
        txHistorySub: 'Complete records of deposits, profit withdrawals, and released capital.',
        filterAllTypes: 'All Transaction Types',
        filterDeposit: 'Deposit (USDT)',
        filterWithdrawProfit: 'Withdraw Profit',
        filterWithdrawPrincipal: 'Withdraw Principal',
        filterAllStatuses: 'All Statuses',
        filterCompleted: 'Completed',
        filterPending: 'Pending',
        filterRejected: 'Rejected',
        searchTxPlaceholder: 'Search TXID or Address...',
        thTxId: 'TX ID',
        thType: 'Operation Type',
        thAmount: 'Amount (USDT)',
        thNetwork: 'Network',
        thStatus: 'Status',
        thDate: 'Date & Time',
        noTxFound: 'No transactions found matching your criteria.',
        statusCompleted: 'Completed',
        statusPending: 'Pending',
        statusRejected: 'Rejected',
        typeDeposit: 'Deposit',
        typeWithdrawProfit: 'Withdraw Profit',
        typeWithdrawPrincipal: 'Withdraw Principal',
        copiedNotice: 'Copied to clipboard!',
        withdrawSuccess: 'Withdrawal request submitted successfully.',
        prevPage: 'Previous',
        nextPage: 'Next',
        pageInfo: 'Page {cur} of {total}'
    },
    fr: {
        dir: 'ltr',
        langName: 'Français',
        adminPanel: 'Panneau Admin',
        navHome: 'Accueil',
        navInvest: 'Investir',
        navTeam: 'Équipe',
        navWallet: 'Portefeuille',
        navProfile: 'Profil',
        walletOverviewTitle: 'Portefeuille et Gestion des Actifs',
        walletOverviewSub: 'Gérez vos dépôts, retraits de profits et libérations de capital.',
        totalActiveCapital: 'Capital Actif Total',
        lockedPrincipal: 'Capital bloqué :',
        unlockedPrincipal: 'Capital libéré :',
        withdrawableProfit: 'Profit Retirable',
        tenPercentMetBadge: 'Règle des 10% respectée',
        tenPercentNotMetBadge: 'Moins de 10% requis',
        processingTimeNotice: 'Traitement sous 1 à 12 heures ouvrables.',
        ruleTenPercentText: 'Condition de 10% de profit minimum requise',
        actionDepositTab: 'Dépôt de fonds',
        actionWithdrawTab: 'Retrait de fonds',
        selectActionPrompt: 'Veuillez sélectionner Dépôt ou Retrait ci-dessus pour continuer.',
        depositModalTitle: 'Dépôt de fonds (USDT)',
        chooseNetwork: 'Choisir le réseau de transfert :',
        netTrxArrival: "Temps d'arrivée : ~2 min",
        netBnbArrival: "Temps d'arrivée : ~1 min",
        netMinDeposit: 'Dépôt min. : 1 USDT',
        walletAddressLabel: 'Adresse de dépôt de la plateforme :',
        copyBtn: 'Copier',
        qrPlaceholder: 'QR Code Dépôt',
        depositWarningText: 'Remarque : Ce dépôt constitue un nouveau Lot soumis à un blocage de 90 jours. Après 90 jours, le capital est totalement libéré.',
        withdrawModalTitle: 'Retrait de fonds (USDT)',
        withdrawProfitTab: 'Retirer le profit',
        withdrawPrincipalTab: 'Retirer le capital libéré',
        withdrawAmountLabel: 'Montant (USDT) :',
        destAddressLabel: 'Adresse de destination (TRC20/BEP20) :',
        estimatedFee: 'Frais estimés :',
        feeTierLabel: 'Palier de frais appliqué :',
        netReceive: 'Montant net reçu :',
        confirmWithdrawBtn: 'Confirmer le retrait',
        feeTierExplanation: 'Frais identiques au réinvestissement : <10 j non autorisé ; 10-15 j 5% ; 15-25 j 3% ; 25-35 j 1% ; >35 j 0%. Capital libéré : 5% fixe.',
        txHistoryTitle: 'Historique des transactions',
        txHistorySub: 'Historique complet des dépôts, retraits et libérations.',
        filterAllTypes: 'Tous les types',
        filterDeposit: 'Dépôt (USDT)',
        filterWithdrawProfit: 'Retrait de profit',
        filterWithdrawPrincipal: 'Retrait de capital',
        filterAllStatuses: 'Tous les statuts',
        filterCompleted: 'Terminé',
        filterPending: 'En attente',
        filterRejected: 'Rejeté',
        searchTxPlaceholder: 'Rechercher TXID ou adresse...',
        thTxId: 'ID Transaction',
        thType: 'Type d’opération',
        thAmount: 'Montant (USDT)',
        thNetwork: 'Réseau',
        thStatus: 'Statut',
        thDate: 'Date et Heure',
        noTxFound: 'Aucune transaction trouvée.',
        statusCompleted: 'Terminé',
        statusPending: 'En attente',
        statusRejected: 'Rejeté',
        typeDeposit: 'Dépôt',
        typeWithdrawProfit: 'Retrait Profit',
        typeWithdrawPrincipal: 'Retrait Capital',
        copiedNotice: 'Copié dans le presse-papiers !',
        withdrawSuccess: 'Demande de retrait transmise avec succès.',
        prevPage: 'Précédent',
        nextPage: 'Suivant',
        pageInfo: 'Page {cur} sur {total}'
    },
    ru: {
        dir: 'ltr',
        langName: 'Русский',
        adminPanel: 'Панель админа',
        navHome: 'Главная',
        navInvest: 'Инвестиции',
        navTeam: 'Команда',
        navWallet: 'Кошелек',
        navProfile: 'Профиль',
        walletOverviewTitle: 'Кошелек и Управление Активами',
        walletOverviewSub: 'Управление пополнениями, выводом прибыли и капитала.',
        totalActiveCapital: 'Всего активного капитала',
        lockedPrincipal: 'Заблокированный капитал:',
        unlockedPrincipal: 'Разблокированный капитал:',
        withdrawableProfit: 'Прибыль к выводу',
        tenPercentMetBadge: 'Условие 10% выполнено',
        tenPercentNotMetBadge: 'Менее 10% прибыли',
        processingTimeNotice: 'Обработка от 1 до 12 рабочих часов.',
        ruleTenPercentText: 'Условие минимум 10% прибыли',
        actionDepositTab: 'Пополнить счет',
        actionWithdrawTab: 'Вывести средства',
        selectActionPrompt: 'Пожалуйста, выберите операцию пополнения или вывода выше для продолжения.',
        depositModalTitle: 'Пополнение счета (USDT)',
        chooseNetwork: 'Выберите сеть перевода:',
        netTrxArrival: 'Время зачисления: ~2 мин',
        netBnbArrival: 'Время зачисления: ~1 мин',
        netMinDeposit: 'Мин. депозит: 1 USDT',
        walletAddressLabel: 'Адрес платформы для депозита:',
        copyBtn: 'Копировать',
        qrPlaceholder: 'QR код депозита',
        depositWarningText: 'Внимание: Этот депозит регистрируется как отдельный лот с циклом блокировки 90 дней. По истечении срока капитал полностью разблокирован.',
        withdrawModalTitle: 'Вывод средств (USDT)',
        withdrawProfitTab: 'Вывод прибыли',
        withdrawPrincipalTab: 'Вывод капитала',
        withdrawAmountLabel: 'Сумма (USDT):',
        destAddressLabel: 'Адрес кошелька (TRC20/BEP20):',
        estimatedFee: 'Комиссия платформы:',
        feeTierLabel: 'Примененный уровень комиссии:',
        netReceive: 'Сумма к получению:',
        confirmWithdrawBtn: 'Подтвердить вывод',
        feeTierExplanation: 'Комиссия вывода аналогична реинвесту: <10 дн. блок; 10-15 дн. 5%; 15-25 дн. 3%; 25-35 дн. 1%; >35 дн. 0%. Разблокированный капитал: 5% фикс.',
        txHistoryTitle: 'История транзакций кошелька',
        txHistorySub: 'Полный журнал операций депозитов, вывода прибыли и капитала.',
        filterAllTypes: 'Все типы операций',
        filterDeposit: 'Пополнение (USDT)',
        filterWithdrawProfit: 'Вывод прибыли',
        filterWithdrawPrincipal: 'Вывод капитала',
        filterAllStatuses: 'Все статусы',
        filterCompleted: 'Выполнено',
        filterPending: 'В обработке',
        filterRejected: 'Отклонено',
        searchTxPlaceholder: 'Поиск TXID или адреса...',
        thTxId: 'TX ID',
        thType: 'Тип операции',
        thAmount: 'Сумма (USDT)',
        thNetwork: 'Сеть',
        thStatus: 'Статус',
        thDate: 'Дата и время',
        noTxFound: 'Транзакции не найдены.',
        statusCompleted: 'Выполнено',
        statusPending: 'В процессе',
        statusRejected: 'Отклонено',
        typeDeposit: 'Пополнение',
        typeWithdrawProfit: 'Вывод прибыли',
        typeWithdrawPrincipal: 'Вывод капитала',
        copiedNotice: 'Скопировано в буфер обмена!',
        withdrawSuccess: 'Заявка на вывод успешно отправлена.',
        prevPage: 'Назад',
        nextPage: 'Вперед',
        pageInfo: 'Стр. {cur} из {total}'
    },
    ar: {
        dir: 'rtl',
        langName: 'العربية',
        adminPanel: 'لوحة الإدارة',
        navHome: 'الرئيسية',
        navInvest: 'الاستثمار',
        navTeam: 'الفريق',
        navWallet: 'المحفظة',
        navProfile: 'الملف',
        walletOverviewTitle: 'المحفظة وإدارة الأصول',
        walletOverviewSub: 'إدارة عمليات الإيداع، سحب الأرباح وتحرير رأس المال.',
        totalActiveCapital: 'إجمالي رأس المال النشط',
        lockedPrincipal: 'رأس المال المقفل:',
        unlockedPrincipal: 'رأس المال المحرر:',
        withdrawableProfit: 'الأرباح القابلة للسحب',
        tenPercentMetBadge: 'شرط 10% مكتمل',
        tenPercentNotMetBadge: 'أقل من 10% كحد أدنى',
        processingTimeNotice: 'تتم معالجة السحوبات خلال 1 إلى 12 ساعة عمل.',
        ruleTenPercentText: 'شرط بلوغ 10% كحد أدنى للأرباح',
        actionDepositTab: 'شحن الحساب',
        actionWithdrawTab: 'سحب الأموال',
        selectActionPrompt: 'يرجى تحديد خيار الإيداع أو السحب أعلاه لمتابعة المعاملة.',
        depositModalTitle: 'شحن الحساب (USDT)',
        chooseNetwork: 'اختر شبكة التحويل:',
        netTrxArrival: 'وقت الوصول: ~2 دقيقة',
        netBnbArrival: 'وقت الوصول: ~1 دقيقة',
        netMinDeposit: 'الحد الأدنى للإيداع: 1 USDT',
        walletAddressLabel: 'عنوان الإيداع المخصص:',
        copyBtn: 'نسخ',
        qrPlaceholder: 'رمز QR للإيداع',
        depositWarningText: 'تنبيه: يُسجل هذا الإيداع كدفعة مستقلة (Lot) مع فترة قفل 90 يومًا. بعد 90 يومًا، يصبح رأس المال متاحًا للسحب بالكامل.',
        withdrawModalTitle: 'سحب الأموال (USDT)',
        withdrawProfitTab: 'سحب الأرباح',
        withdrawPrincipalTab: 'سحب رأس المال المحرر',
        withdrawAmountLabel: 'المبلغ (USDT):',
        destAddressLabel: 'عنوان المحفظة المستلمة:',
        estimatedFee: 'العمولة المقدرة:',
        feeTierLabel: 'شريحة العمولة المطبقة:',
        netReceive: 'المبلغ الصافي المستلم:',
        confirmWithdrawBtn: 'تأكيد السحب',
        feeTierExplanation: 'رسوم سحب الأرباح مطابقة تماماً للمركب: أقل من 10 أيام غير متاح؛ 10-15 يوم: 5%؛ 15-25 يوم: 3%؛ 25-35 يوم: 1%؛ أكثر من 35 يوم: 0%. رأس المال المحرر: عمولة ثابتة 5%.',
        txHistoryTitle: 'سجل معاملات المحفظة',
        txHistorySub: 'سجل شامل لعمليات الشحن، سحب الأرباح ورأس المال.',
        filterAllTypes: 'جميع أنواع المعاملات',
        filterDeposit: 'إيداع (USDT)',
        filterWithdrawProfit: 'سحب أرباح',
        filterWithdrawPrincipal: 'سحب رأس مال',
        filterAllStatuses: 'جميع الحالات',
        filterCompleted: 'مكتمل',
        filterPending: 'قيد الانتظار',
        filterRejected: 'مرفوض',
        searchTxPlaceholder: 'بحث برقم المعاملة أو العنوان...',
        thTxId: 'رقم المعاملة (TXID)',
        thType: 'نوع العملية',
        thAmount: 'المبلغ (USDT)',
        thNetwork: 'الشبكة',
        thStatus: 'الحالة',
        thDate: 'التاريخ والوقت',
        noTxFound: 'لم يتم العثور على أي معاملات.',
        statusCompleted: 'مكتمل',
        statusPending: 'قيد الانتظار',
        statusRejected: 'مرفوض',
        typeDeposit: 'إيداع',
        typeWithdrawProfit: 'سحب أرباح',
        typeWithdrawPrincipal: 'سحب رأس مال',
        copiedNotice: 'تم النسخ بنجاح!',
        withdrawSuccess: 'تم إرسال طلب السحب بنجاح.',
        prevPage: 'السابق',
        nextPage: 'التالي',
        pageInfo: 'صفحة {cur} من {total}'
    },
    fa: {
        dir: 'rtl',
        langName: 'فارسی',
        adminPanel: 'پنل مدیریت',
        navHome: 'داشبورد',
        navInvest: 'سرمایه‌گذاری',
        navTeam: 'تیم و شبکه',
        navWallet: 'کیف‌پول',
        navProfile: 'پروفایل',
        walletOverviewTitle: 'کیف‌پول و مدیریت دارایی‌ها',
        walletOverviewSub: 'مدیریت تراکنش‌های واریز، برداشت سود و آزادسازی اصل سرمایه',
        totalActiveCapital: 'کل سرمایه فعال',
        lockedPrincipal: 'اصل سرمایه قفل‌شده:',
        unlockedPrincipal: 'اصل سرمایه آزادشده:',
        withdrawableProfit: 'سود قابل برداشت',
        tenPercentMetBadge: 'شرط ۱۰٪ محقق شده',
        tenPercentNotMetBadge: 'کمتر از ۱۰٪ نصاب سود',
        processingTimeNotice: 'زمان بررسی و پردازش واریزها بین ۱ الی ۱۲ ساعت کاری می‌باشد.',
        ruleTenPercentText: 'شرط حداقل ۱۰٪ سود جهت برداشت انباشته',
        actionDepositTab: 'شارژ حساب / واریز',
        actionWithdrawTab: 'برداشت وجه',
        selectActionPrompt: 'لطفاً برای انجام عملیات، یکی از گزینه‌های واریز یا برداشت را انتخاب نمایید.',
        depositModalTitle: 'شارژ حساب / واریز جدید (USDT)',
        chooseNetwork: 'انتخاب شبکه انتقال (Deposit Network):',
        netTrxArrival: 'زمان رسیدن: ~۲ دقیقه',
        netBnbArrival: 'زمان رسیدن: ~۱ دقیقه',
        netMinDeposit: 'حداقل واریز: 1 USDT',
        walletAddressLabel: 'آدرس اختصاصی واریز:',
        copyBtn: 'کپی آدرس',
        qrPlaceholder: 'QR Code واریز',
        depositWarningText: 'توجه: این واریز به عنوان یک لات (Lot) جدید ثبت شده و تایمر ۹۰‌روزه قفل اختصاصی آن از همین لحظه فعال می‌گردد. پس از ۹۰ روز اصل این مبلغ کاملاً آزاد و قابل برداشت خواهد بود.',
        withdrawModalTitle: 'برداشت از حساب (Withdrawal)',
        withdrawProfitTab: 'برداشت سود',
        withdrawPrincipalTab: 'برداشت اصل سرمایه آزادشده',
        withdrawAmountLabel: 'مبلغ برداشت (USDT):',
        destAddressLabel: 'آدرس کیف‌پول مقصد (USDT - TRC20/BEP20):',
        estimatedFee: 'کارمزد پلتفرم و شبکه:',
        feeTierLabel: 'نرخ کارمزد اعمال‌شده:',
        netReceive: 'مبلغ خالص دریافتی شما:',
        confirmWithdrawBtn: 'تایید و درخواست برداشت',
        feeTierExplanation: 'کارمزد برداشت سود دقیقاً مشابه ترکیب سود است: زیر ۱۰ روز مجاز نیست؛ ۱۰-۱۵ روز ۵٪؛ ۱۵-۲۵ روز ۳٪؛ ۲۵-۳۵ روز ۱٪؛ بیش از ۳۵ روز رایگان (۰٪). کارمزد برداشت اصل سرمایه آزادشده بعد از ۹۰ روز به صورت ثابت ۵٪ می‌باشد.',
        txHistoryTitle: 'تاریخچه تراکنش‌های کیف‌پول',
        txHistorySub: 'فهرست کامل واریزها، برداشت سود و آزادسازی‌های انجام شده',
        filterAllTypes: 'همه انواع تراکنش',
        filterDeposit: 'واریز (Deposit)',
        filterWithdrawProfit: 'برداشت سود',
        filterWithdrawPrincipal: 'برداشت اصل سرمایه',
        filterAllStatuses: 'همه وضعیت‌ها',
        filterCompleted: 'تکمیل شده',
        filterPending: 'در حال بررسی',
        filterRejected: 'رد شده',
        searchTxPlaceholder: 'جستجوی شناسه تراکنش (TXID)...',
        thTxId: 'شناسه تراکنش',
        thType: 'نوع عملیات',
        thAmount: 'مبلغ (USDT)',
        thNetwork: 'شبکه',
        thStatus: 'وضعیت',
        thDate: 'تاریخ و ساعت',
        noTxFound: 'هیچ تراکنشی مطابق با فیلترهای انتخابی یافت نشد.',
        statusCompleted: 'تکمیل شده',
        statusPending: 'در حال بررسی',
        statusRejected: 'رد شده',
        typeDeposit: 'واریز جدید',
        typeWithdrawProfit: 'برداشت سود',
        typeWithdrawPrincipal: 'برداشت اصل سرمایه',
        copiedNotice: 'در حافظه کپی شد!',
        withdrawSuccess: 'درخواست برداشت شما با موفقیت ثبت شد.',
        prevPage: 'قبلی',
        nextPage: 'بعدی',
        pageInfo: 'صفحه {cur} از {total}'
    }
};

// کلید مشترک ذخیره زبان بین تمام صفحات
const STORAGE_LANG_KEY = 'platform_lang';
let currentLanguage = localStorage.getItem(STORAGE_LANG_KEY) || 'fa';

// داده‌های مالی کاربر
let walletUser = {
    role: 'user',
    activeCapital: 0.00,
    lockedPrincipal: 0.00,
    unlockedPrincipal: 0.00,
    withdrawableProfit: 0.00,
    daysSinceLastAction: 20
};

// تراکنش‌های نمونه کیف‌پول در صورت عدم اتصال به سرور
let transactionData = [];

let currentActiveTab = null; // هیچ‌کدام پیش‌فرض باز نیست
let currentWithdrawType = 'profit'; // 'profit' یا 'principal'
let selectedFilterType = 'all';
let selectedFilterStatus = 'all';
let currentPage = 1;
const itemsPerPage = 5;

// متغیرهای DOM
const toastNotification = document.getElementById('toastNotification');
const langDropdown = document.getElementById('langDropdown');
const langTriggerBtn = document.getElementById('langTriggerBtn');
const currentLangLabel = document.getElementById('currentLangLabel');
const langMenu = document.getElementById('langMenu');
const adminPanelBtn = document.getElementById('adminPanelBtn');

// تب‌ها و پنل‌های عملیاتی
const tabSwitchDeposit = document.getElementById('tabSwitchDeposit');
const tabSwitchWithdraw = document.getElementById('tabSwitchWithdraw');
const panelPlaceholder = document.getElementById('panelPlaceholder');
const panelDeposit = document.getElementById('panelDeposit');
const panelWithdraw = document.getElementById('panelWithdraw');

// فرم برداشت
const withdrawModalProfit = document.getElementById('withdrawModalProfit');
const withdrawModalUnlocked = document.getElementById('withdrawModalUnlocked');
const tabWithdrawProfit = document.getElementById('tabWithdrawProfit');
const tabWithdrawPrincipal = document.getElementById('tabWithdrawPrincipal');
const withdrawAmountInput = document.getElementById('withdrawAmountInput');
const withdrawAddressInput = document.getElementById('withdrawAddressInput');
const setMaxAmountBtn = document.getElementById('setMaxAmountBtn');
const modalFeeValue = document.getElementById('modalFeeValue');
const feeTierValue = document.getElementById('feeTierValue');
const modalNetReceive = document.getElementById('modalNetReceive');
const tenPercentRuleDot = document.getElementById('tenPercentRuleDot');
const confirmWithdrawBtn = document.getElementById('confirmWithdrawBtn');

// منوهای کشویی سفارشی فیلترها
const filterTypeDropdown = document.getElementById('filterTypeDropdown');
const filterTypeTriggerBtn = document.getElementById('filterTypeTriggerBtn');
const selectedTypeLabel = document.getElementById('selectedTypeLabel');
const filterTypeMenu = document.getElementById('filterTypeMenu');

const filterStatusDropdown = document.getElementById('filterStatusDropdown');
const filterStatusTriggerBtn = document.getElementById('filterStatusTriggerBtn');
const selectedStatusLabel = document.getElementById('selectedStatusLabel');
const filterStatusMenu = document.getElementById('filterStatusMenu');

const txSearchInput = document.getElementById('txSearchInput');
const txHistoryTbody = document.getElementById('txHistoryTbody');
const noTxMessage = document.getElementById('noTxMessage');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const paginationInfo = document.getElementById('paginationInfo');

// آدرس‌های پیش‌فرض شبکه‌ها
const depositAddresses = {
    TRC20: 'T9yD14Nj9j7xAB4dbGeiX9h82kL90XmnZa',
    BEP20: '0x71C8fb8613375776419707255146614f2430b321'
};

/**
 * نمایش اعلان Toast
 */
function showToast(message, isError = false) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.className = isError ? 'toast-alert error show' : 'toast-alert show';
    setTimeout(() => {
        toastNotification.className = 'toast-alert';
    }, 3500);
}

/**
 * محاسبه کارمزد پلکانی برداشت سود بر اساس روزهای سپری‌شده (دقیقاً مشابه کامپاند)
 */
function getProfitWithdrawalFeeRate(days) {
    if (days < 10) {
        return { feePercent: 0, isBlocked: true, label: 'کمتر از ۱۰ روز (غیرمجاز)' };
    } else if (days >= 10 && days < 15) {
        return { feePercent: 0.05, isBlocked: false, label: '5%' };
    } else if (days >= 15 && days < 25) {
        return { feePercent: 0.03, isBlocked: false, label: '3%' };
    } else if (days >= 25 && days < 35) {
        return { feePercent: 0.01, isBlocked: false, label: '1%' };
    } else {
        return { feePercent: 0.00, isBlocked: false, label: '0% (رایگان)' };
    }
}

/**
 * به‌روزرسانی کارت‌های موجودی و آمار
 */
function updateWalletBalances() {
    const statActive = document.getElementById('statActiveCapital');
    const statLocked = document.getElementById('statLockedPrincipal');
    const statUnlocked = document.getElementById('statUnlockedPrincipal');
    const statProfit = document.getElementById('statWithdrawableProfit');

    if (statActive) statActive.textContent = Number(walletUser.activeCapital).toLocaleString('en-US', { minimumFractionDigits: 2 });
    if (statLocked) statLocked.textContent = `$${Number(walletUser.lockedPrincipal).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    if (statUnlocked) statUnlocked.textContent = `$${Number(walletUser.unlockedPrincipal).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    if (statProfit) statProfit.textContent = Number(walletUser.withdrawableProfit).toLocaleString('en-US', { minimumFractionDigits: 2 });

    if (withdrawModalProfit) withdrawModalProfit.textContent = Number(walletUser.withdrawableProfit).toLocaleString('en-US', { minimumFractionDigits: 2 });
    if (withdrawModalUnlocked) withdrawModalUnlocked.textContent = Number(walletUser.unlockedPrincipal).toLocaleString('en-US', { minimumFractionDigits: 2 });

    const dict = walletI18n[currentLanguage] || walletI18n.fa;
    const isTenPercentMet = walletUser.activeCapital >= 50 && (walletUser.withdrawableProfit >= (walletUser.activeCapital * 0.10));
    const profitBadge = document.getElementById('profitRuleBadge');
    const overviewDot = document.getElementById('overviewRuleDot');

    if (profitBadge) {
        profitBadge.textContent = isTenPercentMet ? dict.tenPercentMetBadge : dict.tenPercentNotMetBadge;
        profitBadge.className = isTenPercentMet ? 'status-pill ready' : 'status-pill error';
    }
    if (overviewDot) {
        overviewDot.className = isTenPercentMet ? 'rule-dot ready' : 'rule-dot';
    }
}

/**
 * به‌روزرسانی متن لیبل منوهای فیلتر بر اساس زبان جاری
 */
function updateFilterDropdownLabels() {
    const dict = walletI18n[currentLanguage] || walletI18n.fa;
    const typeKeyMap = {
        'all': 'filterAllTypes',
        'deposit': 'filterDeposit',
        'withdraw_profit': 'filterWithdrawProfit',
        'withdraw_principal': 'filterWithdrawPrincipal'
    };
    const statusKeyMap = {
        'all': 'filterAllStatuses',
        'completed': 'filterCompleted',
        'pending': 'filterPending',
        'rejected': 'filterRejected'
    };

    if (typeKeyMap[selectedFilterType] && dict[typeKeyMap[selectedFilterType]]) {
        if (selectedTypeLabel) selectedTypeLabel.textContent = dict[typeKeyMap[selectedFilterType]];
    }
    if (statusKeyMap[selectedFilterStatus] && dict[statusKeyMap[selectedFilterStatus]]) {
        if (selectedStatusLabel) selectedStatusLabel.textContent = dict[statusKeyMap[selectedFilterStatus]];
    }
}

/**
 * تغییر زبان و به‌روزرسانی المان‌های رابط کاربری
 */
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem(STORAGE_LANG_KEY, lang);
    const dict = walletI18n[lang] || walletI18n.fa;

    document.documentElement.lang = lang;
    document.documentElement.dir = dict.dir || 'rtl';
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

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (dict[key]) {
            el.placeholder = dict[key];
        }
    });

    if (langDropdown) langDropdown.classList.remove('open');
    updateFilterDropdownLabels();
    updateWalletBalances();
    calculateWithdrawal();
    renderTransactionsTable();
}

// رویدادهای دراپ‌داون زبان
if (langTriggerBtn) {
    langTriggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (filterTypeDropdown) filterTypeDropdown.classList.remove('open');
        if (filterStatusDropdown) filterStatusDropdown.classList.remove('open');
        if (langDropdown) langDropdown.classList.toggle('open');
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
 * مدیریت دراپ‌داون‌های مدرن فیلترها
 */
if (filterTypeTriggerBtn) {
    filterTypeTriggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (langDropdown) langDropdown.classList.remove('open');
        if (filterStatusDropdown) filterStatusDropdown.classList.remove('open');
        if (filterTypeDropdown) filterTypeDropdown.classList.toggle('open');
    });
}

if (filterTypeMenu) {
    filterTypeMenu.querySelectorAll('.dropdown-menu-item').forEach(item => {
        item.addEventListener('click', function () {
            selectedFilterType = this.getAttribute('data-value');
            filterTypeMenu.querySelectorAll('.dropdown-menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            updateFilterDropdownLabels();
            if (filterTypeDropdown) filterTypeDropdown.classList.remove('open');
            currentPage = 1;
            renderTransactionsTable();
        });
    });
}

if (filterStatusTriggerBtn) {
    filterStatusTriggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (langDropdown) langDropdown.classList.remove('open');
        if (filterTypeDropdown) filterTypeDropdown.classList.remove('open');
        if (filterStatusDropdown) filterStatusDropdown.classList.toggle('open');
    });
}

if (filterStatusMenu) {
    filterStatusMenu.querySelectorAll('.dropdown-menu-item').forEach(item => {
        item.addEventListener('click', function () {
            selectedFilterStatus = this.getAttribute('data-value');
            filterStatusMenu.querySelectorAll('.dropdown-menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            updateFilterDropdownLabels();
            if (filterStatusDropdown) filterStatusDropdown.classList.remove('open');
            currentPage = 1;
            renderTransactionsTable();
        });
    });
}

document.addEventListener('click', (e) => {
    if (langDropdown && !langDropdown.contains(e.target)) langDropdown.classList.remove('open');
    if (filterTypeDropdown && !filterTypeDropdown.contains(e.target)) filterTypeDropdown.classList.remove('open');
    if (filterStatusDropdown && !filterStatusDropdown.contains(e.target)) filterStatusDropdown.classList.remove('open');
});

/**
 * مدیریت سوییچ بین تب واریز و برداشت
 */
function showDepositTab() {
    currentActiveTab = 'deposit';
    if (tabSwitchDeposit) tabSwitchDeposit.classList.add('active');
    if (tabSwitchWithdraw) tabSwitchWithdraw.classList.remove('active');
    if (panelPlaceholder) panelPlaceholder.classList.add('hidden');
    if (panelDeposit) panelDeposit.classList.remove('hidden');
    if (panelWithdraw) panelWithdraw.classList.add('hidden');
}

function showWithdrawTab() {
    currentActiveTab = 'withdraw';
    if (tabSwitchWithdraw) tabSwitchWithdraw.classList.add('active');
    if (tabSwitchDeposit) tabSwitchDeposit.classList.remove('active');
    if (panelPlaceholder) panelPlaceholder.classList.add('hidden');
    if (panelWithdraw) panelWithdraw.classList.remove('hidden');
    if (panelDeposit) panelDeposit.classList.add('hidden');
    calculateWithdrawal();
}

if (tabSwitchDeposit) tabSwitchDeposit.addEventListener('click', showDepositTab);
if (tabSwitchWithdraw) tabSwitchWithdraw.addEventListener('click', showWithdrawTab);

/**
 * مدیریت انتخاب شبکه واریز
 */
document.querySelectorAll('.network-card').forEach(card => {
    card.addEventListener('click', function () {
        document.querySelectorAll('.network-card').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const net = this.getAttribute('data-network');
        const addrDisplay = document.getElementById('depositAddressDisplay');
        if (addrDisplay && depositAddresses[net]) {
            addrDisplay.textContent = depositAddresses[net];
        }
    });
});

// کپی آدرس واریز
const copyDepBtn = document.getElementById('copyDepositAddrBtn');
if (copyDepBtn) {
    copyDepBtn.addEventListener('click', () => {
        const addr = document.getElementById('depositAddressDisplay').textContent.trim();
        navigator.clipboard.writeText(addr).then(() => {
            const dict = walletI18n[currentLanguage] || walletI18n.fa;
            showToast(dict.copiedNotice, false);
        });
    });
}

/**
 * مدیریت برداشت وجه و محاسبات آنلاین کارمزد پلکانی
 */
if (tabWithdrawProfit) {
    tabWithdrawProfit.addEventListener('click', () => {
        currentWithdrawType = 'profit';
        tabWithdrawProfit.classList.add('active');
        if (tabWithdrawPrincipal) tabWithdrawPrincipal.classList.remove('active');
        if (withdrawAmountInput) withdrawAmountInput.value = '';
        calculateWithdrawal();
    });
}

if (tabWithdrawPrincipal) {
    tabWithdrawPrincipal.addEventListener('click', () => {
        currentWithdrawType = 'principal';
        tabWithdrawPrincipal.classList.add('active');
        if (tabWithdrawProfit) tabWithdrawProfit.classList.remove('active');
        if (withdrawAmountInput) withdrawAmountInput.value = '';
        calculateWithdrawal();
    });
}

if (setMaxAmountBtn) {
    setMaxAmountBtn.addEventListener('click', () => {
        if (withdrawAmountInput) {
            withdrawAmountInput.value = currentWithdrawType === 'profit' ? walletUser.withdrawableProfit : walletUser.unlockedPrincipal;
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

    // بررسی شرط حداقل ۱۰٪ سود
    const isTenPercentMet = walletUser.activeCapital >= 50 && (walletUser.withdrawableProfit >= (walletUser.activeCapital * 0.10));
    if (tenPercentRuleDot) {
        tenPercentRuleDot.className = isTenPercentMet ? 'status-indicator ready' : 'status-indicator';
    }

    if (currentWithdrawType === 'profit') {
        const tier = getProfitWithdrawalFeeRate(walletUser.daysSinceLastAction);
        if (feeTierValue) feeTierValue.textContent = tier.label;

        if (amount > 0) {
            fee = amount * tier.feePercent;
            net = Math.max(0, amount - fee);
        }

        if (!tier.isBlocked && isTenPercentMet && amount > 0 && amount <= walletUser.withdrawableProfit && address.length > 5) {
            isValid = true;
        }
    } else {
        if (feeTierValue) feeTierValue.textContent = '5% (ثابت اصل سرمایه)';
        if (amount > 0) {
            fee = amount * 0.05;
            net = Math.max(0, amount - fee);
        }

        if (amount > 0 && amount <= walletUser.unlockedPrincipal && address.length > 5) {
            isValid = true;
        }
    }

    if (modalFeeValue) modalFeeValue.textContent = `$${fee.toFixed(2)}`;
    if (modalNetReceive) modalNetReceive.textContent = `$${net.toFixed(2)}`;
    if (confirmWithdrawBtn) confirmWithdrawBtn.disabled = !isValid;
}

// ثبت نهایی درخواست برداشت
if (confirmWithdrawBtn) {
    confirmWithdrawBtn.addEventListener('click', async () => {
        const amount = parseFloat(withdrawAmountInput.value);
        const destAddr = withdrawAddressInput.value.trim();
        const net = destAddr.startsWith('0x') ? 'BEP20' : 'TRC20';

        try {
            const res = await fetch('/api/wallet/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    type: currentWithdrawType,
                    amount: amount,
                    address: destAddr,
                    network: net
                })
            });

            const data = await res.json();
            const dict = walletI18n[currentLanguage] || walletI18n.fa;

            if (data.status === 'success' || data.success) {
                showToast(dict.withdrawSuccess, false);
                withdrawAmountInput.value = '';
                withdrawAddressInput.value = '';
                await fetchWalletOverview();
            } else {
                showToast(data.message || 'Error occurred', true);
            }
        } catch (e) {
            showToast('Connection error occurred', true);
        }
    });
}

/**
 * مدیریت جدول تاریخچه تراکنش‌ها و فیلترها
 */
function getFilteredTransactions() {
    const type = selectedFilterType;
    const status = selectedFilterStatus;
    const search = txSearchInput ? txSearchInput.value.trim().toLowerCase() : '';

    return transactionData.filter(tx => {
        const matchesType = (type === 'all') || (tx.type === type);
        const matchesStatus = (status === 'all') || (tx.status === status);
        const matchesSearch = !search || String(tx.id).toLowerCase().includes(search);
        return matchesType && matchesStatus && matchesSearch;
    });
}

function renderTransactionsTable() {
    if (!txHistoryTbody) return;
    const dict = walletI18n[currentLanguage] || walletI18n.fa;
    const filtered = getFilteredTransactions();
    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

    txHistoryTbody.innerHTML = '';

    if (pageItems.length === 0) {
        if (noTxMessage) noTxMessage.classList.remove('hidden');
    } else {
        if (noTxMessage) noTxMessage.classList.add('hidden');
        pageItems.forEach(tx => {
            const tr = document.createElement('tr');

            let typeLabel = '';
            let amountClass = 'tx-amount';
            let amountSign = '';

            if (tx.type === 'deposit') {
                typeLabel = dict.typeDeposit;
                amountClass += ' pos';
                amountSign = '+';
            } else if (tx.type === 'withdraw_profit') {
                typeLabel = dict.typeWithdrawProfit;
                amountClass += ' neg';
                amountSign = '-';
            } else {
                typeLabel = dict.typeWithdrawPrincipal;
                amountClass += ' neg';
                amountSign = '-';
            }

            let statusLabel = dict.statusCompleted;
            if (tx.status === 'pending') statusLabel = dict.statusPending;
            if (tx.status === 'rejected') statusLabel = dict.statusRejected;

            tr.innerHTML = `
                <td>
                    <span class="tx-id-badge">
                        ${tx.id}
                        <svg class="tx-copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" onclick="copyTxId('${tx.id}')">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </span>
                </td>
                <td><span class="tx-type-tag">${typeLabel}</span></td>
                <td><span class="${amountClass}">${amountSign}$${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></td>
                <td><span class="network-chip">${tx.network}</span></td>
                <td><span class="status-badge ${tx.status}">${statusLabel}</span></td>
                <td class="tx-date-cell">${tx.date}</td>
            `;
            txHistoryTbody.appendChild(tr);
        });
    }

    if (paginationInfo) paginationInfo.textContent = dict.pageInfo ? dict.pageInfo.replace('{cur}', currentPage).replace('{total}', totalPages) : `Page ${currentPage}`;
    if (prevPageBtn) prevPageBtn.disabled = currentPage <= 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;
}

window.copyTxId = function (txId) {
    navigator.clipboard.writeText(txId).then(() => {
        const dict = walletI18n[currentLanguage] || walletI18n.fa;
        showToast(dict.copiedNotice, false);
    });
};

if (txSearchInput) {
    txSearchInput.addEventListener('input', () => { currentPage = 1; renderTransactionsTable(); });
}

if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTransactionsTable();
        }
    });
}

if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(getFilteredTransactions().length / itemsPerPage) || 1;
        if (currentPage < totalPages) {
            currentPage++;
            renderTransactionsTable();
        }
    });
}

/**
 * ناوبری نوار پایین در فاز Capture برای جلوگیری از تداخل
 */
document.querySelectorAll('.bottom-nav .nav-item').forEach(link => {
    link.addEventListener('click', function (e) {
        const target = this.getAttribute('data-target');
        if (target === 'wallet') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        window.location.href = `${target}.html`;
    }, true);
});

/**
 * دریافت اطلاعات زنده کیف‌پول از سرور (بدون ریدایرکت مخرب)
 */
async function fetchWalletOverview() {
    try {
        const res = await fetch('/api/wallet/overview', {
            method: 'GET',
            credentials: 'include'
        });

        if (res.ok) {
            const data = await res.json();
            if (data.data) {
                const d = data.data;
                walletUser.activeCapital = d.active_capital || 0;
                walletUser.lockedPrincipal = d.locked_principal || 0;
                walletUser.unlockedPrincipal = d.unlocked_principal || 0;
                walletUser.withdrawableProfit = d.withdrawable_profit || 0;
                walletUser.daysSinceLastAction = d.days_since_last_action || 0;

                if (Array.isArray(d.transactions)) {
                    transactionData = d.transactions;
                }
            }
        }
    } catch (e) {
        console.warn('Wallet fetch notice:', e);
    }

    updateWalletBalances();
    calculateWithdrawal();
    renderTransactionsTable();
}

/**
 * راه‌اندازی اولیه صفحه
 */
async function initWalletPage() {
    try {
        const userRes = await fetch('/api/user_status', {
            method: 'GET',
            credentials: 'include'
        });
        if (userRes.ok) {
            const data = await userRes.json();
            const u = data.user || data.data;
            if (u) {
                walletUser.role = u.role || 'user';
                if (walletUser.role === 'admin' && adminPanelBtn) {
                    adminPanelBtn.classList.remove('hidden');
                    adminPanelBtn.addEventListener('click', () => {
                        window.location.href = 'admin.html';
                    });
                }
            }
        }
    } catch (e) {
        console.warn('Admin check notice:', e);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const actionParam = urlParams.get('action');
    if (actionParam === 'withdraw') {
        showWithdrawTab();
    } else if (actionParam === 'deposit') {
        showDepositTab();
    } else {
        currentActiveTab = null;
        if (tabSwitchDeposit) tabSwitchDeposit.classList.remove('active');
        if (tabSwitchWithdraw) tabSwitchWithdraw.classList.remove('active');
        if (panelDeposit) panelDeposit.classList.add('hidden');
        if (panelWithdraw) panelWithdraw.classList.add('hidden');
        if (panelPlaceholder) panelPlaceholder.classList.remove('hidden');
    }

    setLanguage(currentLanguage);
    await fetchWalletOverview();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWalletPage);
} else {
    initWalletPage();
}
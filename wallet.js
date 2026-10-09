/**
 * ==============================================================================
 * ADM Platform - Asset & Settlement Frontend Controller
 * File: wallet.js
 * Dependent on: config.js (window.APP_CONFIG)
 * Backend Controller: wallet.py (API: /api/wallet/*)
 * ==============================================================================
 */

const walletI18n = {
    en: {
        dir: 'ltr',
        langName: 'English',
        adminPanel: 'Admin Panel',
        navHome: 'Dashboard',
        navInvest: 'Performance',
        navTeam: 'Team',
        navWallet: 'Wallet',
        navProfile: 'Profile',
        walletOverviewTitle: 'Asset & Settlement Management',
        walletOverviewSub: 'Manage allocations, yield settlements, and released base balances.',
        totalActiveCapital: 'Total Active Base',
        lockedPrincipal: 'Allocated Base:',
        unlockedPrincipal: 'Matured Base:',
        withdrawableProfit: 'Available Settlement Balance',
        tenPercentMetBadge: '10% Condition Met',
        tenPercentNotMetBadge: 'Under 10% Minimum',
        processingTimeNotice: 'Settlement requests are processed within 1 to 12 business hours.',
        ruleTenPercentText: 'Minimum 10% accumulation requirement for settlement',
        actionDepositTab: 'Allocate Funds',
        actionWithdrawTab: 'Settlement',
        selectActionPrompt: 'Please select either Allocate or Settlement above to proceed.',
        depositModalTitle: 'Allocate Funds (USDT)',
        chooseNetwork: 'Select Transfer Network (Transfer Network):',
        netTrxArrival: 'Arrival time: ~2 mins',
        netBnbArrival: 'Arrival time: ~1 min',
        netMinDeposit: 'Min. deposit: 1 USDT',
        walletAddressLabel: 'Platform Deposit Address:',
        copyBtn: 'Copy Address',
        qrPlaceholder: 'Scan Deposit QR',
        depositWarningText: 'Note: This entry is registered as a new independent Lot with an active 90-day retention cycle. After the cycle, the base balance is completely available.',
        withdrawModalTitle: 'Account Settlement (USDT)',
        withdrawProfitTab: 'Settle Yield',
        withdrawPrincipalTab: 'Settle Matured Base',
        withdrawAmountLabel: 'Amount (USDT):',
        destAddressLabel: 'Destination Wallet Address (USDT - TRC20/BEP20):',
        estimatedFee: 'Estimated Processing/Network Fee:',
        feeTierLabel: 'Applied Fee Tier:',
        netReceive: 'Net Amount You Receive:',
        confirmWithdrawBtn: 'Confirm Settlement',
        feeTierExplanation: 'Yield settlement fee schedule: <10 days disallowed; 10-15 days: 5%; 15-25 days: 3%; 25-35 days: 1%; >35 days: 0%. Matured base carries a flat 5% processing fee after 90 days.',
        txHistoryTitle: 'Transaction History',
        txHistorySub: 'Complete records of allocations, yield settlements, and processed balances.',
        filterAllTypes: 'All Transaction Types',
        filterDeposit: 'Allocation (USDT)',
        filterWithdrawProfit: 'Yield Settlement',
        filterWithdrawPrincipal: 'Base Settlement',
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
        typeDeposit: 'Allocation',
        typeWithdrawProfit: 'Yield Settlement',
        typeWithdrawPrincipal: 'Base Settlement',
        copiedNotice: 'Copied to clipboard!',
        withdrawSuccess: 'Settlement request submitted successfully.',
        prevPage: 'Previous',
        nextPage: 'Next',
        pageInfo: 'Page {cur} of {total}',
        tierBlockedUnder10: 'Under 10 days (Disallowed)',
        tierFree: '0% (Free)',
        feeTierFixedPrincipal: '5% (Fixed Base)',
        errConnection: 'Network connection error with backend server.',
        errInvalidAmount: 'Please enter a valid amount.',
        errInsufficientBalance: 'Entered amount exceeds your available balance.'
    },
    fr: {
        dir: 'ltr',
        langName: 'Français',
        adminPanel: 'Panneau Admin',
        navHome: 'Accueil',
        navInvest: 'Performance',
        navTeam: 'Équipe',
        navWallet: 'Portefeuille',
        navProfile: 'Profil',
        walletOverviewTitle: 'Gestion des Actifs et Règlements',
        walletOverviewSub: 'Gérez vos allocations, règlements de rendements et soldes disponibles.',
        totalActiveCapital: 'Base Active Totale',
        lockedPrincipal: 'Base allouée :',
        unlockedPrincipal: 'Base libérée :',
        withdrawableProfit: 'Solde Disponible pour Règlement',
        tenPercentMetBadge: 'Condition de 10% respectée',
        tenPercentNotMetBadge: 'Moins de 10% requis',
        processingTimeNotice: 'Traitement sous 1 à 12 heures ouvrables.',
        ruleTenPercentText: "Condition de 10% d'accumulation requise pour le règlement",
        actionDepositTab: 'Allouer des fonds',
        actionWithdrawTab: 'Règlement',
        selectActionPrompt: 'Veuillez sélectionner Allouer ou Règlement ci-dessus pour continuer.',
        depositModalTitle: 'Allocation de fonds (USDT)',
        chooseNetwork: 'Choisir le réseau de transfert :',
        netTrxArrival: "Temps d'arrivée : ~2 min",
        netBnbArrival: "Temps d'arrivée : ~1 min",
        netMinDeposit: 'Dépôt min. : 1 USDT',
        walletAddressLabel: 'Adresse de dépôt de la plateforme :',
        copyBtn: 'Copier',
        qrPlaceholder: 'QR Code Dépôt',
        depositWarningText: 'Remarque : Cette opération constitue un nouveau Lot soumis à un cycle de 90 jours. Après cette période, le solde de base est totalement disponible.',
        withdrawModalTitle: 'Règlement du compte (USDT)',
        withdrawProfitTab: 'Régler le rendement',
        withdrawPrincipalTab: 'Régler le solde libéré',
        withdrawAmountLabel: 'Montant (USDT) :',
        destAddressLabel: 'Adresse de destination (TRC20/BEP20) :',
        estimatedFee: 'Frais estimés :',
        feeTierLabel: 'Palier de frais appliqué :',
        netReceive: 'Montant net reçu :',
        confirmWithdrawBtn: 'Confirmer le règlement',
        feeTierExplanation: 'Frais identiques au calendrier : <10 j non autorisé ; 10-15 j 5% ; 15-25 j 3% ; 25-35 j 1% ; >35 j 0%. Solde libéré : 5% fixe.',
        txHistoryTitle: 'Historique des transactions',
        txHistorySub: 'Historique complet des allocations, règlements et libérations.',
        filterAllTypes: 'Tous les types',
        filterDeposit: 'Allocation (USDT)',
        filterWithdrawProfit: 'Règlement Rendement',
        filterWithdrawPrincipal: 'Règlement Base',
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
        typeDeposit: 'Allocation',
        typeWithdrawProfit: 'Règlement Rendement',
        typeWithdrawPrincipal: 'Règlement Base',
        copiedNotice: 'Copié dans le presse-papiers !',
        withdrawSuccess: 'Demande de règlement transmise avec succès.',
        prevPage: 'Précédent',
        nextPage: 'Suivant',
        pageInfo: 'Page {cur} sur {total}',
        tierBlockedUnder10: 'Moins de 10 jours (Interdit)',
        tierFree: '0% (Gratuit)',
        feeTierFixedPrincipal: '5% (Base libérée)',
        errConnection: 'Erreur de connexion au serveur.',
        errInvalidAmount: 'Veuillez saisir un montant valide.',
        errInsufficientBalance: 'Le montant dépasse votre solde disponible.'
    },
    ru: {
        dir: 'ltr',
        langName: 'Русский',
        adminPanel: 'Панель админа',
        navHome: 'Главная',
        navInvest: 'Показатели',
        navTeam: 'Команда',
        navWallet: 'Кошелек',
        navProfile: 'Профиль',
        walletOverviewTitle: 'Управление Активами и Расчетами',
        walletOverviewSub: 'Управление распределениями, расчетом доходности и базовым балансом.',
        totalActiveCapital: 'Всего активной базы',
        lockedPrincipal: 'Выделенная база:',
        unlockedPrincipal: 'Освобожденная база:',
        withdrawableProfit: 'Баланс к расчету',
        tenPercentMetBadge: 'Условие 10% выполнено',
        tenPercentNotMetBadge: 'Менее 10% накопления',
        processingTimeNotice: 'Обработка от 1 до 12 рабочих часов.',
        ruleTenPercentText: 'Условие накопления минимум 10% для расчета',
        actionDepositTab: 'Пополнить счет',
        actionWithdrawTab: 'Заявка на расчет',
        selectActionPrompt: 'Пожалуйста, выберите операцию распределения или расчета выше.',
        depositModalTitle: 'Пополнение счета (USDT)',
        chooseNetwork: 'Выберите сеть перевода:',
        netTrxArrival: 'Время зачисления: ~2 мин',
        netBnbArrival: 'Время зачисления: ~1 мин',
        netMinDeposit: 'Мин. депозит: 1 USDT',
        walletAddressLabel: 'Адрес платформы для депозита:',
        copyBtn: 'Копировать',
        qrPlaceholder: 'QR код депозита',
        depositWarningText: 'Внимание: Эта операция регистрируется как отдельный лот с циклом удержания 90 дней. По истечении срока базовый баланс полностью доступен.',
        withdrawModalTitle: 'Заявка на расчет (USDT)',
        withdrawProfitTab: 'Расчет доходности',
        withdrawPrincipalTab: 'Расчет базового баланса',
        withdrawAmountLabel: 'Сумма (USDT):',
        destAddressLabel: 'Адрес кошелька (TRC20/BEP20):',
        estimatedFee: 'Комиссия обработки:',
        feeTierLabel: 'Примененный уровень комиссии:',
        netReceive: 'Сумма к получению:',
        confirmWithdrawBtn: 'Подтвердить расчет',
        feeTierExplanation: 'Комиссия расчета доходности: <10 дн. блок; 10-15 дн. 5%; 15-25 дн. 3%; 25-35 дн. 1%; >35 дн. 0%. Разблокированная база: 5% фикс.',
        txHistoryTitle: 'История транзакций',
        txHistorySub: 'Полный журнал операций распределения, расчета доходности и баланса.',
        filterAllTypes: 'Все типы операций',
        filterDeposit: 'Распределение (USDT)',
        filterWithdrawProfit: 'Расчет доходности',
        filterWithdrawPrincipal: 'Расчет базы',
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
        typeDeposit: 'Распределение',
        typeWithdrawProfit: 'Расчет доходности',
        typeWithdrawPrincipal: 'Расчет базы',
        copiedNotice: 'Скопировано в буфер обмена!',
        withdrawSuccess: 'Заявка на расчет успешно отправлена.',
        prevPage: 'Назад',
        nextPage: 'Вперед',
        pageInfo: 'Стр. {cur} из {total}',
        tierBlockedUnder10: 'Менее 10 дней (Запрещено)',
        tierFree: '0% (Бесплатно)',
        feeTierFixedPrincipal: '5% (Фикс. база)',
        errConnection: 'Ошибка подключения к серверу.',
        errInvalidAmount: 'Пожалуйста, введите корректную сумму.',
        errInsufficientBalance: 'Сумма превышает доступный баланс.'
    },
    ar: {
        dir: 'rtl',
        langName: 'العربية',
        adminPanel: 'لوحة الإدارة',
        navHome: 'الرئيسية',
        navInvest: 'المؤشرات',
        navTeam: 'الفريق',
        navWallet: 'المحفظة',
        navProfile: 'الملف',
        walletOverviewTitle: 'إدارة الأصول والتسويات',
        walletOverviewSub: 'إدارة عمليات التخصيص، تسوية العوائد والأرصدة المحررة.',
        totalActiveCapital: 'إجمالي الرصيد النشط',
        lockedPrincipal: 'الرصيد المخصص:',
        unlockedPrincipal: 'الرصيد المحرر:',
        withdrawableProfit: 'الرصيد المتاح للتسوية',
        tenPercentMetBadge: 'شرط 10% مكتمل',
        tenPercentNotMetBadge: 'أقل من 10% كحد أدنى',
        processingTimeNotice: 'تتم معالجة الطلبات خلال 1 إلى 12 ساعة عمل.',
        ruleTenPercentText: 'شرط بلوغ 10% كحد أدنى للتسوية',
        actionDepositTab: 'تخصيص رصيد',
        actionWithdrawTab: 'طلب تسوية',
        selectActionPrompt: 'يرجى تحديد خيار التخصيص أو التسوية أعلاه للمتابعة.',
        depositModalTitle: 'تخصيص رصيد (USDT)',
        chooseNetwork: 'اختر شبكة التحويل:',
        netTrxArrival: 'وقت الوصول: ~2 دقيقة',
        netBnbArrival: 'وقت الوصول: ~1 دقيقة',
        netMinDeposit: 'الحد الأدنى للإيداع: 1 USDT',
        walletAddressLabel: 'عنوان الإيداع المخصص:',
        copyBtn: 'نسخ',
        qrPlaceholder: 'رمز QR للإيداع',
        depositWarningText: 'تنبيه: يُسجل هذا التخصيص كدفعة مستقلة (Lot) مع دورة تشغيلية لمدة 90 يومًا. بعد انتهاء الدورة، يصبح الرصيد متاحاً بالكامل.',
        withdrawModalTitle: 'تسوية الحساب (USDT)',
        withdrawProfitTab: 'تسوية العائد',
        withdrawPrincipalTab: 'تسوية الرصيد المحرر',
        withdrawAmountLabel: 'المبلغ (USDT):',
        destAddressLabel: 'عنوان المحفظة المستلمة:',
        estimatedFee: 'الرسوم المقدرة:',
        feeTierLabel: 'شريحة الرسوم المطبقة:',
        netReceive: 'المبلغ الصافي المستلم:',
        confirmWithdrawBtn: 'تأكيد التسوية',
        feeTierExplanation: 'رسوم تسوية العائد مطابقة للجدول: أقل من 10 أيام غير متاح؛ 10-15 يوم: 5%؛ 15-25 يوم: 3%؛ 25-35 يوم: 1%؛ أكثر من 35 يوم: 0%. الرصيد المحرر: رسوم ثابتة 5%.',
        txHistoryTitle: 'سجل المعاملات',
        txHistorySub: 'سجل شامل لعمليات التخصيص، تسوية العوائد والرصيد الأساسي.',
        filterAllTypes: 'جميع أنواع المعاملات',
        filterDeposit: 'تخصيص (USDT)',
        filterWithdrawProfit: 'تسوية عوائد',
        filterWithdrawPrincipal: 'تسوية رصيد',
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
        typeDeposit: 'تخصيص',
        typeWithdrawProfit: 'تسوية عوائد',
        typeWithdrawPrincipal: 'تسوية رصيد',
        copiedNotice: 'تم النسخ بنجاح!',
        withdrawSuccess: 'تم إرسال طلب التسوية بنجاح.',
        prevPage: 'السابق',
        nextPage: 'التالي',
        pageInfo: 'صفحة {cur} من {total}',
        tierBlockedUnder10: 'أقل من 10 أيام (غير مسموح)',
        tierFree: '0% (مجاناً)',
        feeTierFixedPrincipal: '5% (الرصيد المحرر)',
        errConnection: 'خطأ في الاتصال بالخادم.',
        errInvalidAmount: 'يرجى إدخال مبلغ صحيح.',
        errInsufficientBalance: 'المبلغ المدخل يتجاوز الرصيد المتاح.'
    },
    fa: {
        dir: 'rtl',
        langName: 'فارسی',
        adminPanel: 'پنل مدیریت',
        navHome: 'داشبورد',
        navInvest: 'شاخص‌ها',
        navTeam: 'تیم و شبکه',
        navWallet: 'کیف‌پول',
        navProfile: 'پروفایل',
        walletOverviewTitle: 'مدیریت دارایی‌ها و تسویه‌ها',
        walletOverviewSub: 'مدیریت تراکنش‌های تخصیص، تسویه بازدهی و آزادسازی موجودی پایه',
        totalActiveCapital: 'کل موجودی پایه فعال',
        lockedPrincipal: 'موجودی پایه تخصیص‌یافته:',
        unlockedPrincipal: 'موجودی پایه آزادشده:',
        withdrawableProfit: 'موجودی در دسترس تسویه',
        tenPercentMetBadge: 'شرط ۱۰٪ محقق شده',
        tenPercentNotMetBadge: 'کمتر از ۱۰٪ نصاب',
        processingTimeNotice: 'زمان بررسی و پردازش درخواست‌های تسویه بین ۱ الی ۱۲ ساعت کاری می‌باشد.',
        ruleTenPercentText: 'شرط حداقل ۱۰٪ انباشت جهت ثبت تسویه',
        actionDepositTab: 'شارژ حساب / تخصیص',
        actionWithdrawTab: 'درخواست تسویه',
        selectActionPrompt: 'لطفاً برای انجام عملیات، یکی از گزینه‌های تخصیص یا تسویه را انتخاب نمایید.',
        depositModalTitle: 'شارژ حساب / تخصیص جدید (USDT)',
        chooseNetwork: 'انتخاب شبکه انتقال (Transfer Network):',
        netTrxArrival: 'زمان رسیدن: ~۲ دقیقه',
        netBnbArrival: 'زمان رسیدن: ~۱ دقیقه',
        netMinDeposit: 'حداقل واریز: 1 USDT',
        walletAddressLabel: 'آدرس اختصاصی واریز:',
        copyBtn: 'کپی آدرس',
        qrPlaceholder: 'QR Code واریز',
        depositWarningText: 'توجه: این تخصیص به عنوان یک لات (Lot) جدید ثبت شده و چرخه ۹۰‌روزه اختصاصی آن فعال می‌گردد. پس از پایان دوره، موجودی پایه کاملاً آزاد و در دسترس خواهد بود.',
        withdrawModalTitle: 'تسویه حساب (USDT)',
        withdrawProfitTab: 'تسویه بازدهی',
        withdrawPrincipalTab: 'تسویه موجودی پایه آزادشده',
        withdrawAmountLabel: 'مبلغ تسویه (USDT):',
        destAddressLabel: 'آدرس کیف‌پول مقصد (USDT - TRC20/BEP20):',
        estimatedFee: 'کارمزد پردازش و شبکه:',
        feeTierLabel: 'نرخ کارمزد اعمال‌شده:',
        netReceive: 'مبلغ خالص دریافتی شما:',
        confirmWithdrawBtn: 'تایید و ثبت تسویه',
        feeTierExplanation: 'کارمزد تسویه بازدهی طبق جدول دوره‌ای اعمال می‌شود: زیر ۱۰ روز مجاز نیست؛ ۱۰-۱۵ روز ۵٪؛ ۱۵-۲۵ روز ۳٪؛ ۲۵-۳۵ روز ۱٪؛ بیش از ۳۵ روز رایگان (۰٪). کارمزد تسویه موجودی پایه آزادشده بعد از ۹۰ روز به صورت ثابت ۵٪ می‌باشد.',
        txHistoryTitle: 'تاریخچه تراکنش‌های سیستم',
        txHistorySub: 'فهرست کامل تخصیص‌ها، تسویه بازدهی و سوابق عملیاتی',
        filterAllTypes: 'همه انواع تراکنش',
        filterDeposit: 'تخصیص (USDT)',
        filterWithdrawProfit: 'تسویه بازدهی',
        filterWithdrawPrincipal: 'تسویه موجودی پایه',
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
        typeDeposit: 'تخصیص جدید',
        typeWithdrawProfit: 'تسویه بازدهی',
        typeWithdrawPrincipal: 'تسویه موجودی پایه',
        copiedNotice: 'در حافظه کپی شد!',
        withdrawSuccess: 'درخواست تسویه با موفقیت ثبت شد.',
        prevPage: 'قبلی',
        nextPage: 'بعدی',
        pageInfo: 'صفحه {cur} از {total}',
        tierBlockedUnder10: 'کمتر از ۱۰ روز (غیرمجاز)',
        tierFree: '۰٪ (رایگان)',
        feeTierFixedPrincipal: '۵٪ (ثابت موجودی پایه)',
        errConnection: 'خطا در برقراری ارتباط با سرور.',
        errInvalidAmount: 'لطفاً یک مبلغ معتبر وارد کنید.',
        errInsufficientBalance: 'مبلغ وارد شده بیشتر از موجودی قابل تسویه است.'
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
if (!walletI18n[currentLanguage]) currentLanguage = 'en';

let walletUser = {
    role: 'user',
    activeCapital: 0.00,
    lockedPrincipal: 0.00,
    unlockedPrincipal: 0.00,
    withdrawableProfit: 0.00,
    daysSinceLastAction: 0
};

let transactionData = [];

let currentActiveTab = null;
let currentWithdrawType = 'profit';
let selectedFilterType = 'all';
let selectedFilterStatus = 'all';
let currentPage = 1;
const itemsPerPage = 5;

const toastNotification = document.getElementById('toastNotification');
const langDropdown = document.getElementById('langDropdown');
const langTriggerBtn = document.getElementById('langTriggerBtn');
const currentLangLabel = document.getElementById('currentLangLabel');
const langMenu = document.getElementById('langMenu');
const adminPanelBtn = document.getElementById('adminPanelBtn');

const tabSwitchDeposit = document.getElementById('tabSwitchDeposit');
const tabSwitchWithdraw = document.getElementById('tabSwitchWithdraw');
const panelPlaceholder = document.getElementById('panelPlaceholder');
const panelDeposit = document.getElementById('panelDeposit');
const panelWithdraw = document.getElementById('panelWithdraw');

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

const depositAddresses = {
    TRC20: 'T9yD14Nj9j7xAB4dbGeiX9h82kL90XmnZa',
    BEP20: '0x71C8fb8613375776419707255146614f2430b321'
};

function showToast(message, isError = false) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.className = isError ? 'toast-alert error show' : 'toast-alert show';
    setTimeout(() => {
        toastNotification.className = 'toast-alert';
    }, 3500);
}
window.showToast = showToast;

function getProfitWithdrawalFeeRate(days) {
    const dict = walletI18n[currentLanguage] || walletI18n.en;
    if (days < 10) {
        return { feePercent: 0, isBlocked: true, label: dict.tierBlockedUnder10 };
    } else if (days >= 10 && days < 15) {
        return { feePercent: 0.05, isBlocked: false, label: '5%' };
    } else if (days >= 15 && days < 25) {
        return { feePercent: 0.03, isBlocked: false, label: '3%' };
    } else if (days >= 25 && days < 35) {
        return { feePercent: 0.01, isBlocked: false, label: '1%' };
    } else {
        return { feePercent: 0.00, isBlocked: false, label: dict.tierFree };
    }
}

function updateWalletBalances() {
    const statActive = document.getElementById('statActiveCapital');
    const statLocked = document.getElementById('statLockedPrincipal');
    const statUnlocked = document.getElementById('statUnlockedPrincipal');
    const statProfit = document.getElementById('statWithdrawableProfit');

    if (statActive) statActive.textContent = Number(walletUser.activeCapital).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (statLocked) statLocked.textContent = `$${Number(walletUser.lockedPrincipal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (statUnlocked) statUnlocked.textContent = `$${Number(walletUser.unlockedPrincipal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (statProfit) statProfit.textContent = Number(walletUser.withdrawableProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (withdrawModalProfit) withdrawModalProfit.textContent = Number(walletUser.withdrawableProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (withdrawModalUnlocked) withdrawModalUnlocked.textContent = Number(walletUser.unlockedPrincipal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const dict = walletI18n[currentLanguage] || walletI18n.en;
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

function updateFilterDropdownLabels() {
    const dict = walletI18n[currentLanguage] || walletI18n.en;
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

function setLanguage(lang) {
    if (!walletI18n[lang]) lang = 'en';
    currentLanguage = lang;
    localStorage.setItem(STORAGE_LANG_KEY, lang);
    const dict = walletI18n[lang];

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

const copyDepBtn = document.getElementById('copyDepositAddrBtn');
if (copyDepBtn) {
    copyDepBtn.addEventListener('click', () => {
        const addr = document.getElementById('depositAddressDisplay').textContent.trim();
        navigator.clipboard.writeText(addr).then(() => {
            const dict = walletI18n[currentLanguage] || walletI18n.en;
            showToast(dict.copiedNotice, false);
        });
    });
}

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

    const isTenPercentMet = walletUser.activeCapital >= 50 && (walletUser.withdrawableProfit >= (walletUser.activeCapital * 0.10));
    if (tenPercentRuleDot) {
        tenPercentRuleDot.className = isTenPercentMet ? 'status-indicator ready' : 'status-indicator';
    }

    const dict = walletI18n[currentLanguage] || walletI18n.en;

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
        if (feeTierValue) feeTierValue.textContent = dict.feeTierFixedPrincipal;
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

if (confirmWithdrawBtn) {
    confirmWithdrawBtn.addEventListener('click', async () => {
        const amount = parseFloat(withdrawAmountInput.value);
        const destAddr = withdrawAddressInput.value.trim();
        const net = destAddr.startsWith('0x') ? 'BEP20' : 'TRC20';
        const dict = walletI18n[currentLanguage] || walletI18n.en;

        if (!amount || isNaN(amount) || amount <= 0) {
            showToast(dict.errInvalidAmount, true);
            return;
        }

        const maxAvailable = currentWithdrawType === 'profit' ? walletUser.withdrawableProfit : walletUser.unlockedPrincipal;
        if (amount > maxAvailable) {
            showToast(dict.errInsufficientBalance, true);
            return;
        }

        let sessionUser = {};
        try {
            sessionUser = JSON.parse(sessionStorage.getItem('current_user') || localStorage.getItem('current_user') || '{}');
        } catch (e) {
            sessionUser = {};
        }
        const currentUserId = sessionUser.userId || sessionUser.id || localStorage.getItem('user_id') || '';

        const withdrawApiUrl = resolveApiUrl('/api/wallet/withdraw');

        try {
            const res = await fetch(withdrawApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    userId: currentUserId,
                    type: currentWithdrawType,
                    amount: amount,
                    address: destAddr,
                    network: net
                })
            });

            const data = await res.json();

            if (res.ok && (data.status === 'success' || data.success)) {
                showToast(data.message || dict.withdrawSuccess, false);

                // کسر قطعی و لحظه‌ای مبلغ تسویه‌شده از موجودی در رابط کاربری
                if (currentWithdrawType === 'profit') {
                    walletUser.withdrawableProfit = Math.max(0, walletUser.withdrawableProfit - amount);
                } else {
                    walletUser.unlockedPrincipal = Math.max(0, walletUser.unlockedPrincipal - amount);
                }
                updateWalletBalances();

                withdrawAmountInput.value = '';
                withdrawAddressInput.value = '';
                await fetchWalletOverview();
            } else {
                showToast(data.message || dict.errConnection, true);
            }
        } catch (e) {
            showToast(dict.errConnection, true);
        }
    });
}

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
    const dict = walletI18n[currentLanguage] || walletI18n.en;
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
                <td><span class="${amountClass}">${amountSign}$${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></td>
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
        const dict = walletI18n[currentLanguage] || walletI18n.en;
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

async function fetchWalletOverview() {
    let sessionUser = {};
    try {
        sessionUser = JSON.parse(sessionStorage.getItem('current_user') || localStorage.getItem('current_user') || '{}');
    } catch (e) {
        sessionUser = {};
    }
    const currentUserId = sessionUser.userId || sessionUser.id || localStorage.getItem('user_id') || '';

    const baseApi = resolveApiUrl('/api/wallet/overview');
    const queryUrl = currentUserId ? `${baseApi}?user_id=${encodeURIComponent(currentUserId)}` : baseApi;

    try {
        const res = await fetch(queryUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': String(currentUserId)
            },
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

async function initWalletPage() {
    setLanguage(currentLanguage);

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

    try {
        const statusUrl = resolveApiUrl('/api/user_status');
        const userRes = await fetch(statusUrl, {
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

    await fetchWalletOverview();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWalletPage);
} else {
    initWalletPage();
}

window.addEventListener('pageshow', () => {
    setLanguage(currentLanguage);
    fetchWalletOverview();
});
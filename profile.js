/**
 * ==============================================================================
 * ADM Investment Platform - Profile, Security & Helpdesk Frontend Controller
 * File: profile.js
 * Dependent on: config.js (window.APP_CONFIG)
 * Backend Controller: profile.py (API: /api/profile/*)
 * ==============================================================================
 */

// تابع استاندارد دریافت اندپوینت از کانفیگ مرکزی
function resolveApiUrl(endpoint) {
    if (window.APP_CONFIG && typeof window.APP_CONFIG.getApiUrl === 'function') {
        return window.APP_CONFIG.getApiUrl(endpoint);
    }
    return endpoint;
}

// دیکشنری ۵ زبانه کامل پلتفرم همراه با کلیدهای اختصاصی خطا و پشتیبانی
const profileI18n = {
    en: {
        dir: 'ltr',
        langName: 'English',
        adminPanel: 'Admin Panel',
        navHome: 'Dashboard',
        navInvest: 'Invest',
        navTeam: 'Team',
        navWallet: 'Wallet',
        navProfile: 'Profile',
        profileTitle: 'Profile & Security Center',
        profileSub: 'Manage your account credentials, 2FA, identity verification, and support tickets.',
        emailLabel: 'Email / Phone:',
        referralCodeLabel: 'Referral Code:',
        memberSinceLabel: 'Member Since:',
        kycVerifiedBadge: 'KYC Verified',
        kycPendingBadge: 'KYC Pending Review',
        kycUnverifiedBadge: 'KYC Unverified',
        kycYieldRuleText: 'System Rule: Unverified accounts do not receive daily yield.',
        tabSecurity: 'Security Center',
        tabKyc: 'KYC Verification',
        tabSupport: 'Help & Tickets',
        uploadPhoto: 'Choose from Gallery',
        takePhoto: 'Take Photo with Camera',
        removePhoto: 'Remove Profile Photo',
        avatarRemoved: 'Profile photo removed successfully.',
        changePasswordTitle: 'Change Account Password',
        currentPasswordLabel: 'Current Password:',
        newPasswordLabel: 'New Password (min. 8 chars):',
        confirmPasswordLabel: 'Confirm New Password:',
        passwordStrengthLabel: 'Password Strength:',
        strengthWeak: 'Weak',
        strengthMedium: 'Medium',
        strengthStrong: 'Strong',
        savePasswordBtn: 'Update Password',
        twoFaTitle: 'Two-Factor Authentication (2FA)',
        twoFaSub: 'Add an extra layer of protection for logins and withdrawals.',
        scanQrGoogle: 'Scan QR in Authenticator',
        twoFaSecretLabel: 'Secret Key:',
        copyBtn: 'Copy',
        verifyCodeLabel: '6-Digit 2FA Code:',
        enableTwoFaBtn: 'Enable 2FA',
        sessionsTitle: 'Active Login Sessions',
        sessionsSub: 'Devices currently authorized to access this account.',
        terminateAllSessionsBtn: 'Terminate Other Sessions',
        currentSessionTag: 'This Device (Online)',
        session1Meta: 'IP: 185.192.44.12 • Frankfurt, Germany • Just now',
        session2Meta: 'IP: 91.240.118.5 • Dubai, UAE • 2 hours ago',
        kycTitle: 'Identity Verification (KYC Level 2)',
        kycSub: 'Submit documents to increase daily withdrawal limits.',
        docTypeLabel: 'Document Type:',
        passport: 'International Passport',
        nationalId: 'National Identity Card',
        drivingLicense: "Driver's License",
        docNumberLabel: 'Document Number:',
        uploadDocFront: 'Front of Identity Document',
        uploadDocBack: 'Back of Identity Document',
        clickToUpload: 'Click to upload image',
        submitKycBtn: 'Submit Documents for Review',
        supportTitle: 'Submit a New Support Ticket',
        supportSub: '24/7 technical and financial support within 2 hours.',
        ticketSubjectLabel: 'Ticket Subject:',
        ticketSubjectPlaceholder: 'Enter ticket title...',
        ticketCategoryLabel: 'Department:',
        catFinancial: 'Financial, Deposits & Withdrawals',
        catSecurity: 'Account Security & 2FA',
        catKyc: 'Identity Verification (KYC)',
        catGeneral: 'General Inquiries & Network',
        ticketMsgLabel: 'Detailed Message:',
        ticketMsgPlaceholder: 'Describe your issue in detail...',
        sendTicketBtn: 'Submit Ticket',
        recentTicketsTitle: 'Your Recent Support Tickets',
        thTicketId: 'Ticket ID',
        thSubject: 'Subject',
        thDepartment: 'Department',
        thStatus: 'Status',
        thDate: 'Date',
        thChatAction: 'Chat',
        openChatBtn: 'View & Reply',
        autoPurgeNotice: 'Messages older than 5 days are automatically cleared for optimization and security.',
        replyPlaceholder: 'Write your response...',
        sendReplyBtn: 'Send',
        loadingChat: 'Loading conversation...',
        noMessages: 'No messages found.',
        replySuccess: 'Reply sent successfully.',
        ticketStatusAnswered: 'Answered',
        ticketStatusClosed: 'Closed',
        ticketStatusPending: 'In Review',
        logoutBtn: 'Log Out of Account',
        copiedNotice: 'Copied to clipboard!',
        passMismatch: 'New passwords do not match!',
        passSuccess: 'Password changed successfully.',
        twoFaSuccess: 'Two-factor authentication successfully enabled!',
        twoFaCodeErr: 'Code must be 6 digits.',
        sessionsTerminated: 'All other sessions have been terminated.',
        kycSuccess: 'Documents compressed and submitted successfully!',
        ticketSuccess: 'Ticket submitted successfully.',
        avatarSuccess: 'Avatar image updated.',
        officialSupportName: 'ADM Official Support',
        errConnection: 'Network connection error with backend server.',
        errDocNumRequired: 'Identity document number is required.',
        errGeneral: 'An error occurred. Please try again.',
        errLoadChat: 'Failed to load conversation messages.'
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
        profileTitle: 'Profil et Centre de Sécurité',
        profileSub: 'Gérez vos identifiants, 2FA, vérification d’identité et tickets de support.',
        emailLabel: 'Email / Téléphone :',
        referralCodeLabel: 'Code de parrainage :',
        memberSinceLabel: 'Membre depuis :',
        kycVerifiedBadge: 'KYC Vérifié',
        kycPendingBadge: 'KYC En attente',
        kycUnverifiedBadge: 'KYC Non vérifié',
        kycYieldRuleText: 'Règle du système : Les comptes non vérifiés ne reçoivent pas de rendement quotidien.',
        tabSecurity: 'Sécurité et Connexion',
        tabKyc: 'Vérification KYC',
        tabSupport: 'Support et Tickets',
        uploadPhoto: 'Choisir depuis la galerie',
        takePhoto: 'Prendre une photo',
        removePhoto: 'Supprimer la photo',
        avatarRemoved: 'Photo de profil supprimée avec succès.',
        changePasswordTitle: 'Modifier le mot de passe',
        currentPasswordLabel: 'Mot de passe actuel :',
        newPasswordLabel: 'Nouveau mot de passe (min. 8 car.) :',
        confirmPasswordLabel: 'Confirmer le mot de passe :',
        passwordStrengthLabel: 'Force du mot de passe :',
        strengthWeak: 'Faible',
        strengthMedium: 'Moyen',
        strengthStrong: 'Fort',
        savePasswordBtn: 'Mettre à jour le mot de passe',
        twoFaTitle: 'Authentification à deux facteurs (2FA)',
        twoFaSub: 'Protection renforcée pour vos retraits et connexions.',
        scanQrGoogle: 'Scanner le QR dans l’application',
        twoFaSecretLabel: 'Clé secrète :',
        copyBtn: 'Copier',
        verifyCodeLabel: 'Code 2FA à 6 chiffres :',
        enableTwoFaBtn: 'Activer 2FA',
        sessionsTitle: 'Sessions actives',
        sessionsSub: 'Appareils actuellement connectés à ce compte.',
        terminateAllSessionsBtn: 'Fermer les autres sessions',
        currentSessionTag: 'Cet appareil (En ligne)',
        session1Meta: 'IP : 185.192.44.12 • Francfort, Allemagne • À l\'instant',
        session2Meta: 'IP : 91.240.118.5 • Dubaï, EAU • Il y a 2 heures',
        kycTitle: 'Vérification d’identité (KYC Niveau 2)',
        kycSub: 'Fournissez vos documents pour augmenter vos limites de retrait.',
        docTypeLabel: 'Type de document :',
        passport: 'Passeport International',
        nationalId: 'Carte Nationale d’Identité',
        drivingLicense: 'Permis de conduire',
        docNumberLabel: 'Numéro du document :',
        uploadDocFront: 'Recto du document',
        uploadDocBack: 'Verso du document',
        clickToUpload: 'Cliquer pour télécharger',
        submitKycBtn: 'Soumettre pour vérification',
        supportTitle: 'Ouvrir un nouveau ticket',
        supportSub: 'Assistance 24/7 sous 2 heures ouvrables.',
        ticketSubjectLabel: 'Objet du ticket :',
        ticketSubjectPlaceholder: 'Titre du ticket...',
        ticketCategoryLabel: 'Département :',
        catFinancial: 'Finances, Dépôts et Retraits',
        catSecurity: 'Sécurité et 2FA',
        catKyc: 'Vérification d’identité (KYC)',
        catGeneral: 'Questions générales',
        ticketMsgLabel: 'Message détaillé :',
        ticketMsgPlaceholder: 'Décrivez votre problème en détail...',
        sendTicketBtn: 'Envoyer le ticket',
        recentTicketsTitle: 'Vos tickets récents',
        thTicketId: 'ID Ticket',
        thSubject: 'Objet',
        thDepartment: 'Département',
        thStatus: 'Statut',
        thDate: 'Date',
        thChatAction: 'Discussion',
        openChatBtn: 'Voir et répondre',
        autoPurgeNotice: 'Les messages de plus de 5 jours sont automatiquement purgés pour des raisons de sécurité.',
        replyPlaceholder: 'Écrivez votre réponse...',
        sendReplyBtn: 'Envoyer',
        loadingChat: 'Chargement de la conversation...',
        noMessages: 'Aucun message trouvé.',
        replySuccess: 'Réponse transmise avec succès.',
        ticketStatusAnswered: 'Répondu',
        ticketStatusClosed: 'Fermé',
        ticketStatusPending: 'En cours',
        logoutBtn: 'Se déconnecter',
        copiedNotice: 'Copié dans le presse-papiers !',
        passMismatch: 'Les mots de passe ne correspondent pas !',
        passSuccess: 'Mot de passe mis à jour avec succès.',
        twoFaSuccess: 'Authentification 2FA activée avec succès !',
        twoFaCodeErr: 'Le code doit contenir 6 chiffres.',
        sessionsTerminated: 'Toutes les autres sessions ont été fermées.',
        kycSuccess: 'Documents compressés et transmis avec succès !',
        ticketSuccess: 'Ticket envoyé avec succès.',
        avatarSuccess: 'Photo d’avatar mise à jour.',
        officialSupportName: 'Support officiel ADM',
        errConnection: 'Erreur de connexion au serveur.',
        errDocNumRequired: 'Le numéro de document est obligatoire.',
        errGeneral: 'Une erreur est survenue. Veuillez réessayer.',
        errLoadChat: 'Échec du chargement des messages.'
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
        profileTitle: 'Профиль и Центр безопасности',
        profileSub: 'Управление безопасностью, 2FA, верификацией и тикетами поддержки.',
        emailLabel: 'Email / Телефон:',
        referralCodeLabel: 'Реферальный код:',
        memberSinceLabel: 'Дата регистрации:',
        kycVerifiedBadge: 'Верифицирован (KYC)',
        kycPendingBadge: 'KYC На проверке',
        kycUnverifiedBadge: 'Не верифицирован',
        kycYieldRuleText: 'Правило системы: Неверифицированные аккаунты не получают ежедневную прибыль.',
        tabSecurity: 'Безопасность',
        tabKyc: 'Верификация (KYC)',
        tabSupport: 'Поддержка и тикеты',
        uploadPhoto: 'Выбрать из галереи',
        takePhoto: 'Сделать фото камерой',
        removePhoto: 'Удалить фото профиля',
        avatarRemoved: 'Фото профиля успешно удалено.',
        changePasswordTitle: 'Смена пароля аккаунта',
        currentPasswordLabel: 'Текущий пароль:',
        newPasswordLabel: 'Новый пароль (мин. 8 симв.):',
        confirmPasswordLabel: 'Подтвердите пароль:',
        passwordStrengthLabel: 'Сложность пароля:',
        strengthWeak: 'Слабый',
        strengthMedium: 'Средний',
        strengthStrong: 'Надежный',
        savePasswordBtn: 'Обновить пароль',
        twoFaTitle: 'Двухфакторная аутентификация (2FA)',
        twoFaSub: 'Дополнительная защита для входа и вывода средств.',
        scanQrGoogle: 'Сканируйте QR в Google Authenticator',
        twoFaSecretLabel: 'Секретный ключ:',
        copyBtn: 'Копировать',
        verifyCodeLabel: '6-значный код 2FA:',
        enableTwoFaBtn: 'Включить 2FA',
        sessionsTitle: 'Активные сессии',
        sessionsSub: 'Устройства, авторизованные в аккаунте.',
        terminateAllSessionsBtn: 'Завершить другие сеансы',
        currentSessionTag: 'Это устройство (Онлайн)',
        session1Meta: 'IP: 185.192.44.12 • Франкфурт, Германия • Только что',
        session2Meta: 'IP: 91.240.118.5 • Дубай, ОАЭ • 2 часа назад',
        kycTitle: 'Верификация личности (KYC Уровень 2)',
        kycSub: 'Отправьте документы для повышения лимитов на вывод.',
        docTypeLabel: 'Тип документа:',
        passport: 'Заграничный паспорт',
        nationalId: 'ID карта / Паспорт',
        drivingLicense: 'Водительское удостоверение',
        docNumberLabel: 'Номер документа:',
        uploadDocFront: 'Лицевая сторона документа',
        uploadDocBack: 'Обратная сторона документа',
        clickToUpload: 'Нажмите для загрузки',
        submitKycBtn: 'Отправить на проверку',
        supportTitle: 'Создать новый тикет',
        supportSub: 'Круглосуточная поддержка 24/7 в течение 2 часов.',
        ticketSubjectLabel: 'Тема тикета:',
        ticketSubjectPlaceholder: 'Введите тему...',
        ticketCategoryLabel: 'Отдел:',
        catFinancial: 'Финансы, ввод и вывод',
        catSecurity: 'Безопасность и 2FA',
        catKyc: 'Верификация (KYC)',
        catGeneral: 'Общие вопросы',
        ticketMsgLabel: 'Текст обращения:',
        ticketMsgPlaceholder: 'Подробно опишите проблему...',
        sendTicketBtn: 'Отправить тикет',
        recentTicketsTitle: 'Ваши недавние обращения',
        thTicketId: 'ID Тикета',
        thSubject: 'Тема',
        thDepartment: 'Отдел',
        thStatus: 'Статус',
        thDate: 'Дата',
        thChatAction: 'Чат',
        openChatBtn: 'Просмотр и ответ',
        autoPurgeNotice: 'Сообщения старше 5 дней автоматически удаляются для оптимизации.',
        replyPlaceholder: 'Напишите ваш ответ...',
        sendReplyBtn: 'Отправить',
        loadingChat: 'Загрузка переписки...',
        noMessages: 'Сообщений пока нет.',
        replySuccess: 'Ответ успешно отправлен.',
        ticketStatusAnswered: 'Отвечено',
        ticketStatusClosed: 'Закрыт',
        ticketStatusPending: 'В обработке',
        logoutBtn: 'Выйти из аккаунта',
        copiedNotice: 'Скопировано в буфер обмена!',
        passMismatch: 'Пароли не совпадают!',
        passSuccess: 'Пароль успешно обновлен.',
        twoFaSuccess: '2FA успешно активирована!',
        twoFaCodeErr: 'Код должен состоять из 6 цифр.',
        sessionsTerminated: 'Все остальные сеансы завершены.',
        kycSuccess: 'Документы сжаты и отправлены на проверку!',
        ticketSuccess: 'Тикет успешно создан.',
        avatarSuccess: 'Аватар успешно обновлен.',
        officialSupportName: 'Официальная поддержка ADM',
        errConnection: 'Ошибка подключения к серверу.',
        errDocNumRequired: 'Номер документа обязателен.',
        errGeneral: 'Произошла ошибка. Пожалуйста, попробуйте еще раз.',
        errLoadChat: 'Не удалось загрузить сообщения.'
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
        profileTitle: 'الملف الشخصي ومركز الأمان',
        profileSub: 'إدارة أمان الحساب، المصادقة الثنائية، التحقق من الهوية وتذاكر الدعم.',
        emailLabel: 'البريد / الهاتف:',
        referralCodeLabel: 'رمز الإحالة:',
        memberSinceLabel: 'تاريخ الانضمام:',
        kycVerifiedBadge: 'تم التحقق من الهوية',
        kycPendingBadge: 'قيد مراجعة الهوية',
        kycUnverifiedBadge: 'غير موثق',
        kycYieldRuleText: 'قانون المنصة: الحسابات غير الموثقة لا تحصل على الأرباح اليومية.',
        tabSecurity: 'مركز الأمان والدخول',
        tabKyc: 'التحقق من الهوية (KYC)',
        tabSupport: 'الدعم والتذاكر',
        uploadPhoto: 'اختيار من المعرض',
        takePhoto: 'التقاط صورة بالكاميرا',
        removePhoto: 'حذف الصورة الشخصية',
        avatarRemoved: 'تم حذف الصورة الشخصية بنجاح.',
        changePasswordTitle: 'تغيير كلمة مرور الحساب',
        currentPasswordLabel: 'كلمة المرور الحالية:',
        newPasswordLabel: 'كلمة المرور الجديدة (8 أحرف على الأقل):',
        confirmPasswordLabel: 'تأكيد كلمة المرور:',
        passwordStrengthLabel: 'قوة كلمة المرور:',
        strengthWeak: 'ضعيفة',
        strengthMedium: 'متوسطة',
        strengthStrong: 'قوية',
        savePasswordBtn: 'تحديث كلمة المرور',
        twoFaTitle: 'المصادقة الثنائية (Google 2FA)',
        twoFaSub: 'طبقة حماية إضافية لعمليات السحب والدخول.',
        scanQrGoogle: 'امسح الرمز في تطبيق المصادقة',
        twoFaSecretLabel: 'المفتاح السري:',
        copyBtn: 'نسخ',
        verifyCodeLabel: 'رمز المصادقة المكون من 6 أرقام:',
        enableTwoFaBtn: 'تفعيل 2FA',
        sessionsTitle: 'الجلسات والأجهزة النشطة',
        sessionsSub: 'الأجهزة المصرح لها بالوصول لهذا الحساب.',
        terminateAllSessionsBtn: 'تسجيل الخروج من بقية الأجهزة',
        currentSessionTag: 'هذا الجهاز (متصل)',
        session1Meta: 'IP: 185.192.44.12 • فرانكفورت، ألمانيا • الآن',
        session2Meta: 'IP: 91.240.118.5 • دبي، الإمارات • منذ ساعتين',
        kycTitle: 'التحقق من الهوية (KYC المستوى 2)',
        kycSub: 'ارفع مستنداتك لرفع الحد اليومي للسحوبات.',
        docTypeLabel: 'نوع الوثيقة:',
        passport: 'جواز سفر دولي',
        nationalId: 'بطاقة الهوية الوطنية',
        drivingLicense: 'رخصة القيادة',
        docNumberLabel: 'رقم الوثيقة:',
        uploadDocFront: 'الوجه الأمامي للوثيقة',
        uploadDocBack: 'الوجه الخلفي للوثيقة',
        clickToUpload: 'انقر لاختيار الصورة',
        submitKycBtn: 'إرسال المستندات للمراجعة',
        supportTitle: 'فتح تذكرة دعم فني جديدة',
        supportSub: 'دعم فني ومالي 24/7 في غضون ساعتي عمل.',
        ticketSubjectLabel: 'موضوع التذكرة:',
        ticketSubjectPlaceholder: 'أدخل عنوان التذكرة...',
        ticketCategoryLabel: 'القسم المختص:',
        catFinancial: 'المالية، الإيداع والسحب',
        catSecurity: 'الأمان و 2FA',
        catKyc: 'التحقق من الهوية (KYC)',
        catGeneral: 'استفسارات عامة',
        ticketMsgLabel: 'نص الرسالة:',
        ticketMsgPlaceholder: 'اكتب تفاصيل طلبك بالتفصيل...',
        sendTicketBtn: 'إرسال التذكرة',
        recentTicketsTitle: 'تذاكر الدعم الأخيرة',
        thTicketId: 'رقم التذكرة',
        thSubject: 'الموضوع',
        thDepartment: 'القسم',
        thStatus: 'الحالة',
        thDate: 'التاريخ',
        thChatAction: 'المحادثة',
        openChatBtn: 'عرض والرد',
        autoPurgeNotice: 'تُحذف الرسائل الأقدم من 5 أيام تلقائيًا لتحسين الأمان والنظام.',
        replyPlaceholder: 'اكتب ردك هنا...',
        sendReplyBtn: 'إرسال',
        loadingChat: 'جارٍ تحميل المحادثة...',
        noMessages: 'لا توجد رسائل.',
        replySuccess: 'تم إرسال الرد بنجاح.',
        ticketStatusAnswered: 'تم الرد',
        ticketStatusClosed: 'مغلقة',
        ticketStatusPending: 'قيد المراجعة',
        logoutBtn: 'تسجيل الخروج من الحساب',
        copiedNotice: 'تم النسخ بنجاح!',
        passMismatch: 'كلمتا المرور غير متطابقتين!',
        passSuccess: 'تم تغيير كلمة المرور بنجاح.',
        twoFaSuccess: 'تم تفعيل المصادقة الثنائية بنجاح!',
        twoFaCodeErr: 'يجب أن يتكون الرمز من 6 أرقام.',
        sessionsTerminated: 'تم إنهاء جميع الجلسات الأخرى.',
        kycSuccess: 'تم ضغط وإرسال المستندات بنجاح!',
        ticketSuccess: 'تم إرسال التذكرة بنجاح.',
        avatarSuccess: 'تم تحديث الصورة الشخصية.',
        officialSupportName: 'فريق دعم ADM الرسمي',
        errConnection: 'خطأ في الاتصال بالخادم.',
        errDocNumRequired: 'رقم الوثيقة مطلوب.',
        errGeneral: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
        errLoadChat: 'فشل تحميل الرسائل.'
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
        profileTitle: 'پروفایل و تنظیمات امنیتی',
        profileSub: 'مدیریت حساب کاربری، امنیت ورود، احراز هویت و پشتیبانی تیکت‌ها',
        emailLabel: 'ایمیل / شماره:',
        referralCodeLabel: 'کد معرف اختصاصی:',
        memberSinceLabel: 'عضویت از:',
        kycVerifiedBadge: 'احراز هویت شده',
        kycPendingBadge: 'در حال بررسی هویت',
        kycUnverifiedBadge: 'احراز هویت نشده',
        kycYieldRuleText: 'قانون سیستم: حساب‌هایی که احراز هویت نشده باشند سود روزانه دریافت نمی‌کنند.',
        tabSecurity: 'مرکز امنیت و ورود',
        tabKyc: 'مدیریت احراز هویت',
        tabSupport: 'پشتیبانی و تیکت‌ها',
        uploadPhoto: 'انتخاب از گالری',
        takePhoto: 'گرفتن عکس با دوربین',
        removePhoto: 'حذف عکس پروفایل',
        avatarRemoved: 'عکس پروفایل با موفقیت حذف شد.',
        changePasswordTitle: 'تغییر رمز عبور حساب کاربری',
        currentPasswordLabel: 'رمز عبور فعلی:',
        newPasswordLabel: 'رمز عبور جدید (حداقل ۸ کاراکتر):',
        confirmPasswordLabel: 'تکرار رمز عبور جدید:',
        passwordStrengthLabel: 'قدرت رمز عبور:',
        strengthWeak: 'ضعیف',
        strengthMedium: 'متوسط',
        strengthStrong: 'قوی',
        savePasswordBtn: 'به‌روزرسانی رمز عبور',
        twoFaTitle: 'تایید دو مرحله‌ای (Google Authenticator 2FA)',
        twoFaSub: 'محافظت دوچندان از درخواست‌های برداشت و ورود به پلتفرم',
        scanQrGoogle: 'اسکن بارکد در اپلیکیشن',
        twoFaSecretLabel: 'کلید مخفی اختصاصی (Secret Key):',
        copyBtn: 'کپی',
        verifyCodeLabel: 'کد ۶ رقمی اپلیکیشن جهت فعال‌سازی:',
        enableTwoFaBtn: 'فعال‌سازی 2FA',
        sessionsTitle: 'نشست‌های فعال و دستگاه‌های متصل',
        sessionsSub: 'دستگاه‌هایی که در حال حاضر به این حساب دسترسی دارند',
        terminateAllSessionsBtn: 'خروج از سایر دستگاه‌ها',
        currentSessionTag: 'همین دستگاه (آنلاین)',
        session1Meta: 'IP: 185.192.44.12 • فرانکفورت، آلمان • هم‌اکنون',
        session2Meta: 'IP: 91.240.118.5 • دبی، امارات • ۲ ساعت پیش',
        kycTitle: 'ارسال و اعتبارسنجی مدارک شناسایی (KYC Level 2)',
        kycSub: 'جهت افزایش سقف برداشت روزانه و تضمین امنیت حساب',
        docTypeLabel: 'نوع مدرک شناسایی:',
        passport: 'گذرنامه بین‌المللی (Passport)',
        nationalId: 'کارت ملی هوشمند',
        drivingLicense: 'گواهینامه رانندگی',
        docNumberLabel: 'شماره مدرک شناسایی:',
        uploadDocFront: 'تصویر روی مدرک شناسایی',
        uploadDocBack: 'تصویر پشت مدرک شناسایی',
        clickToUpload: 'برای انتخاب تصویر کلیک کنید',
        submitKycBtn: 'ثبت و ارسال مدارک جهت بررسی',
        supportTitle: 'ارسال تیکت جدید به واحد پشتیبانی',
        supportSub: 'پاسخ‌گویی تیم پشتیبانی ۲۴/۷ و در کمتر از ۲ ساعت کاری',
        ticketSubjectLabel: 'موضوع تیکت:',
        ticketSubjectPlaceholder: 'عنوان مشکل یا سوال...',
        ticketCategoryLabel: 'دپارتمان مربوطه:',
        catFinancial: 'مسائل مالی، واریز و برداشت',
        catSecurity: 'امنیت حساب و 2FA',
        catKyc: 'احراز هویت (KYC)',
        catGeneral: 'سوالات عمومی و شبکه رفرال',
        ticketMsgLabel: 'شرح پیام شما:',
        ticketMsgPlaceholder: 'توضیحات کامل درخواست خود را بنویسید...',
        sendTicketBtn: 'ارسال تیکت',
        recentTicketsTitle: 'تیکت‌های اخیر شما',
        thTicketId: 'شناسه تیکت',
        thSubject: 'موضوع',
        thDepartment: 'دپارتمان',
        thStatus: 'وضعیت',
        thDate: 'تاریخ',
        thChatAction: 'گفت‌وگو',
        openChatBtn: 'مشاهده و پاسخ',
        autoPurgeNotice: 'پیام‌های قدیمی‌تر از ۵ روز به صورت خودکار جهت بهینه‌سازی و امنیت پاک‌سازی می‌شوند.',
        replyPlaceholder: 'پاسخ خود را بنویسید...',
        sendReplyBtn: 'ارسال',
        loadingChat: 'در حال بارگذاری پیام‌ها...',
        noMessages: 'پیامی در این تیکت یافت نشد.',
        replySuccess: 'پاسخ شما با موفقیت ثبت شد.',
        ticketStatusAnswered: 'پاسخ داده شده',
        ticketStatusClosed: 'بسته شده',
        ticketStatusPending: 'در حال بررسی',
        logoutBtn: 'خروج از حساب کاربری (Log Out)',
        copiedNotice: 'در حافظه کپی شد!',
        passMismatch: 'رمز عبور جدید با تکرار آن یکسان نیست!',
        passSuccess: 'کلمه عبور شما با موفقیت تغییر یافت.',
        twoFaCodeErr: 'کد باید ۶ رقمی باشد.',
        twoFaSuccess: 'تایید دو مرحله‌ای با موفقیت فعال شد!',
        sessionsTerminated: 'تمامی نشست‌های متصل دیگر با موفقیت مسدود شدند.',
        kycSuccess: 'مدارک با موفقیت فشرده‌سازی و جهت بررسی ارسال گردیدند!',
        ticketSuccess: 'تیکت شما با موفقیت ثبت شد.',
        avatarSuccess: 'تصویر آواتار به‌روز شد.',
        officialSupportName: 'تیم پشتیبانی رسمی ADM',
        errConnection: 'خطا در برقراری ارتباط با سرور.',
        errDocNumRequired: 'شماره مدرک شناسایی الزامی است.',
        errGeneral: 'خطایی رخ داده است. لطفاً مجدداً تلاش کنید.',
        errLoadChat: 'خطا در دریافت پیام‌های گفت‌وگو.'
    }
};

const STORAGE_LANG_KEY = 'platform_lang';
// زبان انتخابی سیستم با فال‌بک پیش‌فرض انگلیسی
let currentLanguage = localStorage.getItem(STORAGE_LANG_KEY) || 'en';
if (!profileI18n[currentLanguage]) currentLanguage = 'en';

const savedSession = JSON.parse(sessionStorage.getItem('current_user') || '{}');
let currentUser = {
    userId: savedSession.userId || savedSession.id || localStorage.getItem('user_id') || '',
    username: savedSession.username || localStorage.getItem('user_name') || 'Investor',
    email: savedSession.email || localStorage.getItem('user_email') || '---',
    referralCode: savedSession.referral_code || savedSession.referralCode || localStorage.getItem('user_ref_code') || '---',
    role: savedSession.role || localStorage.getItem('user_role') || 'user',
    createdAt: localStorage.getItem('user_created_at') || '---',
    kycStatus: savedSession.kyc_status || 'unverified',
    tickets: []
};

let selectedDocType = 'passport';
let selectedTicketCategory = 'financial';
let frontImageBase64 = '';
let backImageBase64 = '';

// المان‌های DOM
const toastNotification = document.getElementById('toastNotification');
const langDropdown = document.getElementById('langDropdown');
const langTriggerBtn = document.getElementById('langTriggerBtn');
const currentLangLabel = document.getElementById('currentLangLabel');
const langMenu = document.getElementById('langMenu');
const adminPanelBtn = document.getElementById('adminPanelBtn');

const tabButtons = document.querySelectorAll('.p-tab-btn');
const tabContents = document.querySelectorAll('.profile-tab-content');

const displayUsername = document.getElementById('displayUsername');
const displayEmail = document.getElementById('displayEmail');
const displayReferralCode = document.getElementById('displayReferralCode');
const displayCreatedAt = document.getElementById('displayCreatedAt');
const displayKycBadge = document.getElementById('displayKycBadge');
const avatarInitials = document.getElementById('avatarInitials');
const avatarImage = document.getElementById('avatarImage');
const avatarMenuTriggerBtn = document.getElementById('avatarMenuTriggerBtn');
const avatarActionMenu = document.getElementById('avatarActionMenu');
const btnUploadGallery = document.getElementById('btnUploadGallery');
const btnCaptureCamera = document.getElementById('btnCaptureCamera');
const btnRemoveAvatar = document.getElementById('btnRemoveAvatar');
const avatarUploadInput = document.getElementById('avatarUploadInput');
const avatarCameraInput = document.getElementById('avatarCameraInput');

const docTypeDropdown = document.getElementById('docTypeDropdown');
const docTypeTriggerBtn = document.getElementById('docTypeTriggerBtn');
const selectedDocTypeLabel = document.getElementById('selectedDocTypeLabel');
const docTypeMenu = document.getElementById('docTypeMenu');

const ticketCatDropdown = document.getElementById('ticketCatDropdown');
const ticketCatTriggerBtn = document.getElementById('ticketCatTriggerBtn');
const selectedTicketCatLabel = document.getElementById('selectedTicketCatLabel');
const ticketCatMenu = document.getElementById('ticketCatMenu');

const changePasswordForm = document.getElementById('changePasswordForm');
const currentPassInput = document.getElementById('currentPassInput');
const newPassInput = document.getElementById('newPassInput');
const confirmPassInput = document.getElementById('confirmPassInput');
const passStrengthBar = document.getElementById('passStrengthBar');
const passStrengthLabel = document.getElementById('passStrengthLabel');

const copySecretBtn = document.getElementById('copySecretBtn');
const secretKeyDisplay = document.getElementById('secretKeyDisplay');
const btnEnableTwoFa = document.getElementById('btnEnableTwoFa');
const twoFaCodeInput = document.getElementById('twoFaCodeInput');

const terminateSessionsBtn = document.getElementById('terminateSessionsBtn');
const sessionsListWrap = document.getElementById('sessionsListWrap');

const kycSubmitForm = document.getElementById('kycSubmitForm');
const kycDocNumberInput = document.getElementById('kycDocNumberInput');
const fileDocFront = document.getElementById('fileDocFront');
const fileDocBack = document.getElementById('fileDocBack');
const previewDocFront = document.getElementById('previewDocFront');
const previewDocBack = document.getElementById('previewDocBack');
const labelDocFront = document.getElementById('labelDocFront');
const labelDocBack = document.getElementById('labelDocBack');

const newTicketForm = document.getElementById('newTicketForm');
const ticketSubjectInput = document.getElementById('ticketSubjectInput');
const ticketMessageInput = document.getElementById('ticketMessageInput');
const ticketsTbody = document.getElementById('ticketsTbody');

const directLogoutBtn = document.getElementById('directLogoutBtn');

// المان‌های گفت‌وگوی چت تیکت
const ticketChatModal = document.getElementById('ticketChatModal');
const closeChatModalBtn = document.getElementById('closeChatModalBtn');
const chatModalTicketCode = document.getElementById('chatModalTicketCode');
const chatModalTicketStatus = document.getElementById('chatModalTicketStatus');
const chatModalTicketSubject = document.getElementById('chatModalTicketSubject');
const chatModalTicketDept = document.getElementById('chatModalTicketDept');
const chatMessagesContainer = document.getElementById('chatMessagesContainer');
const chatReplyForm = document.getElementById('chatReplyForm');
const activeChatTicketId = document.getElementById('activeChatTicketId');
const chatReplyMessageInput = document.getElementById('chatReplyMessageInput');
const btnSendChatReply = document.getElementById('btnSendChatReply');

function showToast(message, isError = false) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.className = isError ? 'toast-alert error show' : 'toast-alert show';
    setTimeout(() => {
        toastNotification.className = 'toast-alert';
    }, 3600);
}
window.showToast = showToast;

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * دریافت اطلاعات زنده پروفایل از دیتابیس
 */
async function fetchProfileData() {
    let sessionUser = {};
    try {
        sessionUser = JSON.parse(sessionStorage.getItem('current_user') || localStorage.getItem('current_user') || '{}');
    } catch (e) {
        sessionUser = {};
    }
    const currentUserId = sessionUser.userId || sessionUser.id || localStorage.getItem('user_id') || '';
    const baseApi = resolveApiUrl('/api/profile/overview');
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
            const json = await res.json();
            if (json.status === 'success' && json.data) {
                const d = json.data;
                currentUser.userId = d.userId || currentUserId;
                currentUser.username = d.username || 'Investor';
                currentUser.email = d.email || d.phone || '---';
                currentUser.referralCode = d.referralCode || d.referral_code || '---';
                currentUser.role = d.role || 'user';
                currentUser.createdAt = (d.createdAt && d.createdAt !== 'None' && d.createdAt !== 'null') ? d.createdAt : (currentUser.createdAt !== '---' ? currentUser.createdAt : '2026-09-26');
                currentUser.kycStatus = d.kycStatus || 'unverified';
                currentUser.tickets = d.tickets || [];

                localStorage.setItem('user_role', currentUser.role);
                localStorage.setItem('user_name', currentUser.username);
                localStorage.setItem('user_ref_code', currentUser.referralCode);
                localStorage.setItem('user_created_at', currentUser.createdAt);
                if (currentUser.email && currentUser.email !== '---') {
                    localStorage.setItem('user_email', currentUser.email);
                }

                renderProfileInfo();
            }
        } else {
            renderProfileInfo();
        }
    } catch (e) {
        console.warn('fetchProfileData notice:', e);
        renderProfileInfo();
    }
}

/**
 * نمایش مشخصات کاربر در کارت بالای صفحه
 */
function renderProfileInfo() {
    const dict = profileI18n[currentLanguage] || profileI18n.en;

    if (displayUsername) displayUsername.textContent = currentUser.username || localStorage.getItem('user_name') || 'Investor';
    if (displayEmail) displayEmail.textContent = currentUser.email || localStorage.getItem('user_email') || '---';
    if (displayReferralCode) displayReferralCode.textContent = currentUser.referralCode || localStorage.getItem('user_ref_code') || '---';
    if (displayCreatedAt) displayCreatedAt.textContent = currentUser.createdAt || localStorage.getItem('user_created_at') || '---';

    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar && avatarImage) {
        avatarImage.src = savedAvatar;
        avatarImage.classList.remove('hidden');
        if (avatarInitials) avatarInitials.classList.add('hidden');
    } else if (avatarInitials) {
        const uname = currentUser.username || localStorage.getItem('user_name') || 'ADM';
        avatarInitials.textContent = uname.substring(0, 2).toUpperCase();
        avatarInitials.classList.remove('hidden');
        if (avatarImage) avatarImage.classList.add('hidden');
    }

    if (adminPanelBtn) {
        const role = currentUser.role || localStorage.getItem('user_role');
        if (role === 'admin') {
            adminPanelBtn.classList.remove('hidden');
            adminPanelBtn.onclick = () => window.location.href = 'admin.html';
        } else {
            adminPanelBtn.classList.add('hidden');
        }
    }

    if (displayKycBadge) {
        displayKycBadge.className = 'kyc-badge';
        if (currentUser.kycStatus === 'verified') {
            displayKycBadge.classList.add('verified');
            displayKycBadge.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>${dict.kycVerifiedBadge}</span>`;
        } else if (currentUser.kycStatus === 'pending') {
            displayKycBadge.classList.add('pending');
            displayKycBadge.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> <span>${dict.kycPendingBadge}</span>`;
        } else {
            displayKycBadge.classList.add('unverified');
            displayKycBadge.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> <span>${dict.kycUnverifiedBadge}</span>`;
        }
    }

    renderTicketsTable();
}

/**
 * رندر جدول تیکت‌ها
 */
function renderTicketsTable() {
    if (!ticketsTbody) return;
    const dict = profileI18n[currentLanguage] || profileI18n.en;
    ticketsTbody.innerHTML = '';

    if (!currentUser.tickets || currentUser.tickets.length === 0) {
        ticketsTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; color:var(--text-secondary);">---</td></tr>`;
        return;
    }

    currentUser.tickets.forEach(tk => {
        const tr = document.createElement('tr');
        let statusClass = 'pending';
        let statusLabel = dict.ticketStatusPending;

        if (tk.status === 'answered') {
            statusClass = 'completed';
            statusLabel = dict.ticketStatusAnswered;
        } else if (tk.status === 'closed') {
            statusClass = 'closed';
            statusLabel = dict.ticketStatusClosed;
        }

        const safeCode = escapeHtml(tk.id);
        const safeSubject = escapeHtml(tk.subject);
        const safeDept = escapeHtml(tk.department);
        const safeStatus = escapeHtml(tk.status);

        tr.innerHTML = `
            <td><strong>${safeCode}</strong></td>
            <td>${safeSubject}</td>
            <td>${safeDept}</td>
            <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
            <td>${tk.date}</td>
            <td>
                <button type="button" class="btn-open-chat" onclick="openTicketChat('${safeCode}', '${safeSubject}', '${safeDept}', '${safeStatus}')">
                    ${dict.openChatBtn}
                </button>
            </td>
        `;
        ticketsTbody.appendChild(tr);
    });
}

/**
 * باز کردن پنجره گفت‌وگو
 */
window.openTicketChat = async function (ticketCode, subject, department, status) {
    if (!ticketChatModal) return;
    const dict = profileI18n[currentLanguage] || profileI18n.en;

    if (chatModalTicketCode) chatModalTicketCode.textContent = ticketCode;
    if (chatModalTicketSubject) chatModalTicketSubject.textContent = subject;
    if (chatModalTicketDept) chatModalTicketDept.textContent = department;
    if (activeChatTicketId) activeChatTicketId.value = ticketCode;

    if (chatModalTicketStatus) {
        chatModalTicketStatus.className = `chat-status-pill ${status}`;
        let stLabel = dict.ticketStatusPending;
        if (status === 'answered') stLabel = dict.ticketStatusAnswered;
        else if (status === 'closed') stLabel = dict.ticketStatusClosed;
        chatModalTicketStatus.textContent = stLabel;
    }

    ticketChatModal.classList.remove('hidden');
    await loadTicketMessages(ticketCode);
};

/**
 * دریافت پیام‌های تیکت از سرور
 */
async function loadTicketMessages(ticketCode) {
    const dict = profileI18n[currentLanguage] || profileI18n.en;
    if (!chatMessagesContainer) return;
    chatMessagesContainer.innerHTML = `<div style="text-align:center; padding:30px 10px; color:#848E9C; font-size:12.5px;">${dict.loadingChat}</div>`;

    const chatApi = resolveApiUrl('/api/profile/ticket_messages');

    try {
        const res = await fetch(chatApi, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                userId: currentUser.userId,
                ticketCode: ticketCode
            })
        });

        if (res.ok) {
            const data = await res.json();
            if (data.status === 'success' && data.messages && data.messages.length > 0) {
                chatMessagesContainer.innerHTML = '';
                data.messages.forEach(msg => {
                    const isUser = (msg.sender_role === 'user' || msg.is_admin === 0 || msg.is_admin === false);
                    const bubble = document.createElement('div');
                    bubble.className = `chat-bubble ${isUser ? 'user-msg' : 'admin-msg'}`;

                    const senderTitle = isUser 
                        ? (currentUser.username || 'You') 
                        : dict.officialSupportName;

                    bubble.innerHTML = `
                        <div class="bubble-text">${escapeHtml(msg.message)}</div>
                        <div class="bubble-meta-row">
                            <span class="chat-sender-badge">${senderTitle}</span>
                            <span>${msg.date || ''}</span>
                        </div>
                    `;
                    chatMessagesContainer.appendChild(bubble);
                });
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
            } else {
                chatMessagesContainer.innerHTML = `<div style="text-align:center; padding:30px 10px; color:#848E9C; font-size:12.5px;">${dict.noMessages}</div>`;
            }
        } else {
            chatMessagesContainer.innerHTML = `<div style="text-align:center; padding:30px 10px; color:#F6465D; font-size:12.5px;">${dict.errLoadChat}</div>`;
        }
    } catch (e) {
        chatMessagesContainer.innerHTML = `<div style="text-align:center; padding:30px 10px; color:#F6465D; font-size:12.5px;">${dict.errConnection}</div>`;
    }
}

if (closeChatModalBtn) {
    closeChatModalBtn.addEventListener('click', () => {
        if (ticketChatModal) ticketChatModal.classList.add('hidden');
    });
}

if (ticketChatModal) {
    ticketChatModal.addEventListener('click', (e) => {
        if (e.target === ticketChatModal) {
            ticketChatModal.classList.add('hidden');
        }
    });
}

if (chatReplyForm) {
    chatReplyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dict = profileI18n[currentLanguage] || profileI18n.en;
        const ticketCode = activeChatTicketId ? activeChatTicketId.value.trim() : '';
        const msgText = chatReplyMessageInput ? chatReplyMessageInput.value.trim() : '';

        if (!ticketCode || !msgText) return;

        const replyApi = resolveApiUrl('/api/profile/reply_ticket');

        try {
            if (btnSendChatReply) btnSendChatReply.disabled = true;

            const res = await fetch(replyApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    userId: currentUser.userId,
                    ticketCode: ticketCode,
                    message: msgText
                })
            });

            const data = await res.json();
            if (res.ok && data.status === 'success') {
                if (chatReplyMessageInput) chatReplyMessageInput.value = '';
                showToast(dict.replySuccess, false);
                await loadTicketMessages(ticketCode);
            } else {
                showToast(data.message || dict.errGeneral, true);
            }
        } catch (err) {
            showToast(dict.errConnection, true);
        } finally {
            if (btnSendChatReply) btnSendChatReply.disabled = false;
        }
    });
}

function updateDropdownLabels() {
    const dict = profileI18n[currentLanguage] || profileI18n.en;
    const docMap = {
        'passport': 'passport',
        'national_id': 'nationalId',
        'driving_license': 'drivingLicense'
    };
    const catMap = {
        'financial': 'catFinancial',
        'security': 'catSecurity',
        'kyc': 'catKyc',
        'general': 'catGeneral'
    };

    if (selectedDocTypeLabel && dict[docMap[selectedDocType]]) {
        selectedDocTypeLabel.textContent = dict[docMap[selectedDocType]];
    }
    if (selectedTicketCatLabel && dict[catMap[selectedTicketCategory]]) {
        selectedTicketCatLabel.textContent = dict[catMap[selectedTicketCategory]];
    }
}

function setLanguage(lang) {
    if (!profileI18n[lang]) lang = 'en';
    currentLanguage = lang;
    localStorage.setItem(STORAGE_LANG_KEY, lang);
    const dict = profileI18n[lang];

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
    updateDropdownLabels();
    renderProfileInfo();
}

if (langTriggerBtn) {
    langTriggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (docTypeDropdown) docTypeDropdown.classList.remove('open');
        if (ticketCatDropdown) ticketCatDropdown.classList.remove('open');
        if (avatarActionMenu) avatarActionMenu.classList.remove('show');
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

if (docTypeTriggerBtn) {
    docTypeTriggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (langDropdown) langDropdown.classList.remove('open');
        if (ticketCatDropdown) ticketCatDropdown.classList.remove('open');
        if (avatarActionMenu) avatarActionMenu.classList.remove('show');
        docTypeDropdown.classList.toggle('open');
    });

    docTypeMenu.querySelectorAll('.dropdown-menu-item').forEach(item => {
        item.addEventListener('click', function () {
            selectedDocType = this.getAttribute('data-value');
            docTypeMenu.querySelectorAll('.dropdown-menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            updateDropdownLabels();
            docTypeDropdown.classList.remove('open');
        });
    });
}

if (ticketCatTriggerBtn) {
    ticketCatTriggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (langDropdown) langDropdown.classList.remove('open');
        if (docTypeDropdown) docTypeDropdown.classList.remove('open');
        if (avatarActionMenu) avatarActionMenu.classList.remove('show');
        ticketCatDropdown.classList.toggle('open');
    });

    ticketCatMenu.querySelectorAll('.dropdown-menu-item').forEach(item => {
        item.addEventListener('click', function () {
            selectedTicketCategory = this.getAttribute('data-value');
            ticketCatMenu.querySelectorAll('.dropdown-menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            updateDropdownLabels();
            ticketCatDropdown.classList.remove('open');
        });
    });
}

if (avatarMenuTriggerBtn && avatarActionMenu) {
    avatarMenuTriggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (langDropdown) langDropdown.classList.remove('open');
        if (docTypeDropdown) docTypeDropdown.classList.remove('open');
        if (ticketCatDropdown) ticketCatDropdown.classList.remove('open');
        avatarActionMenu.classList.toggle('show');
    });

    if (btnUploadGallery) {
        btnUploadGallery.addEventListener('click', () => {
            avatarActionMenu.classList.remove('show');
            if (avatarUploadInput) avatarUploadInput.click();
        });
    }

    if (btnCaptureCamera) {
        btnCaptureCamera.addEventListener('click', () => {
            avatarActionMenu.classList.remove('show');
            if (avatarCameraInput) avatarCameraInput.click();
        });
    }

    if (btnRemoveAvatar) {
        btnRemoveAvatar.addEventListener('click', () => {
            avatarActionMenu.classList.remove('show');
            localStorage.removeItem('user_avatar');
            if (avatarImage) {
                avatarImage.src = '';
                avatarImage.classList.add('hidden');
            }
            if (avatarInitials) {
                avatarInitials.classList.remove('hidden');
            }
            const dict = profileI18n[currentLanguage] || profileI18n.en;
            showToast(dict.avatarRemoved, false);
        });
    }
}

document.addEventListener('click', (e) => {
    if (langDropdown && !langDropdown.contains(e.target)) langDropdown.classList.remove('open');
    if (docTypeDropdown && !docTypeDropdown.contains(e.target)) docTypeDropdown.classList.remove('open');
    if (ticketCatDropdown && !ticketCatDropdown.contains(e.target)) ticketCatDropdown.classList.remove('open');
    if (avatarActionMenu && !avatarActionMenu.contains(e.target) && e.target !== avatarMenuTriggerBtn) {
        avatarActionMenu.classList.remove('show');
    }
});

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabTarget = btn.getAttribute('data-tab');
        const targetContent = document.getElementById(`tab-${tabTarget}`);
        const isCurrentlyActive = btn.classList.contains('active');

        if (isCurrentlyActive) {
            btn.classList.remove('active');
            if (targetContent) targetContent.classList.remove('active');
            return;
        }

        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        if (targetContent) targetContent.classList.add('active');
    });
});

if (newPassInput) {
    newPassInput.addEventListener('input', () => {
        const val = newPassInput.value;
        const dict = profileI18n[currentLanguage] || profileI18n.en;
        let score = 0;

        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        if (score <= 1) {
            passStrengthBar.style.width = '25%';
            passStrengthBar.style.background = 'var(--danger-red)';
            passStrengthLabel.textContent = dict.strengthWeak;
            passStrengthLabel.className = 'text-danger';
        } else if (score === 2 || score === 3) {
            passStrengthBar.style.width = '60%';
            passStrengthBar.style.background = 'var(--brand-yellow)';
            passStrengthLabel.textContent = dict.strengthMedium;
            passStrengthLabel.className = 'text-yellow';
        } else {
            passStrengthBar.style.width = '100%';
            passStrengthBar.style.background = 'var(--profit-green)';
            passStrengthLabel.textContent = dict.strengthStrong;
            passStrengthLabel.className = 'text-green';
        }
    });
}

window.togglePassVisibility = function (inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        btnEl.style.color = 'var(--brand-yellow)';
    } else {
        input.type = 'password';
        btnEl.style.color = 'var(--text-secondary)';
    }
};

if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dict = profileI18n[currentLanguage] || profileI18n.en;

        if (newPassInput.value !== confirmPassInput.value) {
            showToast(dict.passMismatch, true);
            return;
        }

        const passApi = resolveApiUrl('/api/profile/change_password');

        try {
            const res = await fetch(passApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    userId: currentUser.userId,
                    currentPassword: currentPassInput.value,
                    newPassword: newPassInput.value
                })
            });

            const data = await res.json();
            if (res.ok && data.status === 'success') {
                showToast(dict.passSuccess, false);
                changePasswordForm.reset();
                passStrengthBar.style.width = '25%';
                passStrengthBar.style.background = 'var(--danger-red)';
                passStrengthLabel.textContent = dict.strengthWeak;
            } else {
                showToast(data.message || dict.errGeneral, true);
            }
        } catch (err) {
            showToast(dict.errConnection, true);
        }
    });
}

const copyRefCodeBtn = document.getElementById('copyRefCodeBtn');
if (copyRefCodeBtn) {
    copyRefCodeBtn.addEventListener('click', () => {
        const ref = displayReferralCode ? displayReferralCode.textContent.trim() : currentUser.referralCode;
        navigator.clipboard.writeText(ref).then(() => {
            const dict = profileI18n[currentLanguage] || profileI18n.en;
            showToast(dict.copiedNotice, false);
        });
    });
}

if (copySecretBtn) {
    copySecretBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(secretKeyDisplay.textContent.trim()).then(() => {
            const dict = profileI18n[currentLanguage] || profileI18n.en;
            showToast(dict.copiedNotice, false);
        });
    });
}

if (btnEnableTwoFa) {
    btnEnableTwoFa.addEventListener('click', () => {
        const dict = profileI18n[currentLanguage] || profileI18n.en;
        const code = twoFaCodeInput.value.trim();
        if (code.length === 6) {
            showToast(dict.twoFaSuccess, false);
            twoFaCodeInput.value = '';
        } else {
            showToast(dict.twoFaCodeErr, true);
        }
    });
}

if (terminateSessionsBtn) {
    terminateSessionsBtn.addEventListener('click', async () => {
        const dict = profileI18n[currentLanguage] || profileI18n.en;
        const termApi = resolveApiUrl('/api/profile/terminate_sessions');

        try {
            const res = await fetch(termApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ userId: currentUser.userId })
            });

            if (res.ok) {
                const currentDeviceEl = sessionsListWrap.querySelector('.session-item');
                sessionsListWrap.innerHTML = '';
                if (currentDeviceEl) sessionsListWrap.appendChild(currentDeviceEl);
                showToast(dict.sessionsTerminated, false);
            }
        } catch (err) {
            showToast(dict.sessionsTerminated, false);
        }
    });
}

function compressImage(file, maxWidth = 1000, quality = 0.72) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
        };
    });
}

if (fileDocFront) {
    fileDocFront.addEventListener('change', async function () {
        if (this.files && this.files[0]) {
            frontImageBase64 = await compressImage(this.files[0]);
            previewDocFront.src = frontImageBase64;
            previewDocFront.classList.remove('hidden');
            if (labelDocFront) labelDocFront.classList.add('hidden');
        }
    });
}

if (fileDocBack) {
    fileDocBack.addEventListener('change', async function () {
        if (this.files && this.files[0]) {
            backImageBase64 = await compressImage(this.files[0]);
            previewDocBack.src = backImageBase64;
            previewDocBack.classList.remove('hidden');
            if (labelDocBack) labelDocBack.classList.add('hidden');
        }
    });
}

if (kycSubmitForm) {
    kycSubmitForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dict = profileI18n[currentLanguage] || profileI18n.en;
        const docNum = kycDocNumberInput.value.trim();

        if (!docNum) {
            showToast(dict.errDocNumRequired, true);
            return;
        }

        const kycApi = resolveApiUrl('/api/profile/submit_kyc');

        try {
            const res = await fetch(kycApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    userId: currentUser.userId,
                    docType: selectedDocType,
                    docNumber: docNum,
                    frontImage: frontImageBase64,
                    backImage: backImageBase64
                })
            });

            const data = await res.json();
            if (res.ok && data.status === 'success') {
                showToast(dict.kycSuccess, false);
                currentUser.kycStatus = 'pending';
                renderProfileInfo();
            } else {
                showToast(data.message || dict.errGeneral, true);
            }
        } catch (err) {
            showToast(dict.errConnection, true);
        }
    });
}

if (newTicketForm) {
    newTicketForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dict = profileI18n[currentLanguage] || profileI18n.en;
        const subject = ticketSubjectInput.value.trim();
        const department = selectedTicketCatLabel.textContent;
        const msg = ticketMessageInput.value.trim();

        if (!subject || !msg) return;

        const ticketApi = resolveApiUrl('/api/profile/submit_ticket');

        try {
            const res = await fetch(ticketApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    userId: currentUser.userId,
                    subject: subject,
                    department: department,
                    message: msg
                })
            });

            const data = await res.json();
            if (res.ok && data.status === 'success') {
                showToast(dict.ticketSuccess, false);
                newTicketForm.reset();
                if (data.ticket) {
                    currentUser.tickets.unshift(data.ticket);
                    renderTicketsTable();
                }
            } else {
                showToast(data.message || dict.errGeneral, true);
            }
        } catch (err) {
            showToast(dict.errConnection, true);
        }
    });
}

async function handleAvatarFileSelect(file) {
    if (!file) return;
    const compressed = await compressImage(file, 250, 0.85);
    localStorage.setItem('user_avatar', compressed);
    if (avatarImage) {
        avatarImage.src = compressed;
        avatarImage.classList.remove('hidden');
    }
    if (avatarInitials) avatarInitials.classList.add('hidden');
    const dict = profileI18n[currentLanguage] || profileI18n.en;
    showToast(dict.avatarSuccess, false);
}

if (avatarUploadInput) {
    avatarUploadInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            handleAvatarFileSelect(this.files[0]);
        }
    });
}

if (avatarCameraInput) {
    avatarCameraInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            handleAvatarFileSelect(this.files[0]);
        }
    });
}

if (directLogoutBtn) {
    directLogoutBtn.addEventListener('click', async () => {
        try {
            const logoutApi = resolveApiUrl('/api/logout');
            await fetch(logoutApi, { method: 'POST', credentials: 'include' });
        } catch (e) {}
        sessionStorage.clear();
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_ref_code');
        localStorage.removeItem('user_created_at');
        window.location.href = 'index.html';
    });
}

document.querySelectorAll('.bottom-nav .nav-item').forEach(link => {
    link.addEventListener('click', function (e) {
        const target = this.getAttribute('data-target');
        if (target === 'profile') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        window.location.href = `${target}.html`;
    }, true);
});

async function initProfilePage() {
    // ۱. اعمال قطعی و فوری زبان در ثانیه صفر
    setLanguage(currentLanguage);
    // ۲. دریافت اطلاعات زنده از سرور
    await fetchProfileData();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfilePage);
} else {
    initProfilePage();
}

window.addEventListener('pageshow', () => {
    setLanguage(currentLanguage);
    fetchProfileData();
});
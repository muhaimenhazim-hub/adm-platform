/**
 * ==============================================================================
 * ADM Platform - Team & Network Module
 * File: team.js (Connected to /api/team/data - 100% Real Live Database Data)
 * ==============================================================================
 */

(function () {
  'use strict';

  function resolveApiUrl(endpoint) {
    if (window.APP_CONFIG && typeof window.APP_CONFIG.getApiUrl === 'function') {
      return window.APP_CONFIG.getApiUrl(endpoint);
    }
    return endpoint;
  }

  const translations = {
    fa: {
      admin_panel: "پنل ادمین",
      referral_program: "برنامه همکاری شبکه",
      invite_friends_title: "همکاران خود را دعوت کنید و با هم رشد کنید",
      invite_friends_desc: "دریافت پاداش معرفی تا ۳ سطح و کارمزد عملکرد تا ۵ سطح بدون محدودیت",
      referral_code_label: "کد دعوت اختصاصی شما",
      referral_link_label: "لینک ثبت‌نام مستقیم",
      copy: "کپی",
      copy_link: "کپی لینک",
      copied_toast: "در حافظه کپی شد!",
      share: "اشتراک‌گذاری",
      total_network_earnings: "مجموع پاداش کل شبکه",
      from_last_month: "نسبت به ماه قبل",
      today_referral_income: "پاداش امروز از شبکه",
      total_team_members: "تعداد کل اعضای تیم",
      members_count: "عضو فعال",
      your_active_capital: "موجودی پایه فعال شما",
      cap_rule_status: "سقف محاسبه کارمزد: فعال",
      cap_max_prefix: "حداکثر",
      cap_ineligible_status: "غیرفعال (حداقل ۵۰ USDT موجودی فعال و احراز هویت الزامی است)",
      rules_title: "قوانین و محاسبات مالی پاداش و کارمزد شبکه",
      direct_deposit_bonus_title: "پاداش معرفی اولیه (۳ سطح - فقط تخصیص اول)",
      direct_deposit_bonus_desc: "این پاداش تنها در زمان نخستین تخصیص عضو جدید تعلق می‌گیرد (عملیات بعدی فاقد پاداش معرفی هستند):",
      daily_profit_comm_title: "کارمزد روزانه از عملکرد تیم (۵ سطح)",
      daily_profit_comm_desc: "بر مبنای شاخص عملکرد خالص ثبت‌شده اعضای شبکه در سیستم محاسبه می‌گردد:",
      capping_rule_title: "قانون سقف عملکرد لیدر (Leader Allocation Cap)",
      capping_rule_desc: "لیدر باید دارای حداقل ۵۰ دلار موجودی فعال و احراز هویت تأییدشده باشد. در صورتی که موجودی هر یک از اعضا بیشتر از موجودی شما باشد، مبنا بر اساس موجودی فعال شما سقف‌گذاری می‌شود.",
      cap_formula_badge: "فرمول: مبنای محاسبه = حداقل (موجودی عضو, موجودی شما)",
      generations_breakdown_title: "آمار تفکیکی ۵ سطح زیرمجموعه",
      generations_breakdown_subtitle: "بررسی حجم موجودی، تعداد نفرات و مجموع پاداش‌های دریافتی از هر سطح",
      gen_1: "سطح اول",
      gen_2: "سطح دوم",
      gen_3: "سطح سوم",
      gen_4: "سطح چهارم",
      gen_5: "سطح پنجم",
      lvl_1_tag: "L1 (سطح ۱)",
      lvl_2_tag: "L2 (سطح ۲)",
      lvl_3_tag: "L3 (سطح ۳)",
      gen_l1_opt: "سطح L1",
      gen_l2_opt: "سطح L2",
      gen_l3_opt: "سطح L3",
      gen_l4_opt: "سطح L4",
      gen_l5_opt: "سطح L5",
      active_members_in_gen: "اعضای این سطح",
      total_capital_in_gen: "کل موجودی فعال سطح",
      direct_bonus_received: "پاداش تخصیص اولیه دریافتی",
      daily_comm_received: "مجموع کارمزد دوره‌ای دریافتی",
      network_tx_title: "ریز تراکنش‌ها و تاریخچه پاداش‌های شبکه",
      live_sync: "همگام‌سازی لحظه‌ای",
      search_member_placeholder: "جستجو با نام، ایمیل یا موبایل...",
      all_generations: "همه سطوح (L1 - L5)",
      all_types: "همه انواع پاداش",
      type_direct: "پاداش تخصیص اولیه",
      type_daily: "کارمزد عملکرد شبکه",
      col_member_info: "عضو تیم (نام / ایمیل / موبایل)",
      col_gen: "سطح",
      col_type: "نوع پاداش",
      col_capital_calc: "موجودی عضو / مبنای محاسبه",
      col_rate_earned: "درصد اعمال‌شده",
      col_amount: "مبلغ دریافتی (USDT)",
      col_date: "تاریخ و ساعت",
      nav_home: "داشبورد",
      nav_invest: "شاخص‌ها",
      nav_team: "تیم و شبکه",
      nav_wallet: "کیف‌پول",
      nav_profile: "پروفایل",
      cap_triggered_tag: "قانون سقف اعمال شد",
      profit_prefix: "شاخص:",
      no_results: "هیچ رکوردی در شبکه یافت نشد.",
      share_text_payload: "به پلتفرم کاری و آماری ADM بپیوندید. کد دعوت من:",
      error_network: "خطا در برقراری ارتباط با سرور پلتفرم.",
      error_occurred: "خطایی رخ داده است. لطفاً مجدداً تلاش نمایید."
    },

    en: {
      admin_panel: "Admin Panel",
      referral_program: "Referral Network Program",
      invite_friends_title: "Invite Partners & Collaborate Together",
      invite_friends_desc: "Receive up to 3 levels of initial bonus & up to 5 levels of performance commissions.",
      referral_code_label: "Your Exclusive Referral Code",
      referral_link_label: "Direct Referral Registration Link",
      copy: "Copy",
      copy_link: "Copy Link",
      copied_toast: "Copied to clipboard!",
      share: "Share",
      total_network_earnings: "Total Network Rewards",
      from_last_month: "vs last month",
      today_referral_income: "Today's Referral Income",
      total_team_members: "Total Team Members",
      members_count: "Active Members",
      your_active_capital: "Your Active Base Balance",
      cap_rule_status: "Commission Capping: ACTIVE",
      cap_max_prefix: "Max",
      cap_ineligible_status: "Ineligible (Min 50 USDT active balance & KYC required)",
      rules_title: "Financial Rules & Referral Calculation Standards",
      direct_deposit_bonus_title: "Initial Allocation Bonus (3 Levels - First Allocation Only)",
      direct_deposit_bonus_desc: "Granted once upon the new member's initial allocation:",
      daily_profit_comm_title: "Performance Commission (5 Levels - Periodic)",
      daily_profit_comm_desc: "Calculated periodically based on verified net metrics across downline levels:",
      capping_rule_title: "Leader Allocation Capping Rule",
      capping_rule_desc: "Leaders must maintain at least 50 USDT active balance and verified status. Bonuses are capped to your active balance.",
      cap_formula_badge: "Formula: Basis = Min(Member Balance, Your Balance)",
      generations_breakdown_title: "5 Levels Breakdown & Analytics",
      generations_breakdown_subtitle: "Track active balance volume, headcounts, and accumulated rewards per level",
      gen_1: "Level 1",
      gen_2: "Level 2",
      gen_3: "Level 3",
      gen_4: "Level 4",
      gen_5: "Level 5",
      lvl_1_tag: "L1 (Level 1)",
      lvl_2_tag: "L2 (Level 2)",
      lvl_3_tag: "L3 (Level 3)",
      gen_l1_opt: "Level L1",
      gen_l2_opt: "Level L2",
      gen_l3_opt: "Level L3",
      gen_l4_opt: "Level L4",
      gen_l5_opt: "Level L5",
      active_members_in_gen: "Members",
      total_capital_in_gen: "Total Active Base",
      direct_bonus_received: "Direct Bonuses Received",
      daily_comm_received: "Total Periodic Commissions",
      network_tx_title: "Network Transactions & Reward Ledger",
      live_sync: "Live Synchronized",
      search_member_placeholder: "Search by Name, Email or Phone...",
      all_generations: "All Levels (L1 - L5)",
      all_types: "All Reward Types",
      type_direct: "Initial Allocation Bonus",
      type_daily: "Performance Commission",
      col_member_info: "Team Member (Name / Email / Phone)",
      col_gen: "Level",
      col_type: "Reward Type",
      col_capital_calc: "Member Balance / Basis",
      col_rate_earned: "Applied Rate",
      col_amount: "Amount Earned (USDT)",
      col_date: "Date & Time",
      nav_home: "Dashboard",
      nav_invest: "Performance",
      nav_team: "Team",
      nav_wallet: "Wallet",
      nav_profile: "Profile",
      cap_triggered_tag: "Cap Applied",
      profit_prefix: "Rate:",
      no_results: "No team records found.",
      share_text_payload: "Join the ADM platform and workspace! My referral code:",
      error_network: "Network connection error with backend server.",
      error_occurred: "An error occurred. Please try again."
    },

    fr: {
      admin_panel: "Panneau d'admin",
      referral_program: "Programme d'affiliation réseau",
      invite_friends_title: "Invitez des partenaires et collaborez",
      invite_friends_desc: "Recevez jusqu'à 3 niveaux de bonus initial et jusqu'à 5 niveaux de commissions de performance.",
      referral_code_label: "Votre code d'invitation exclusif",
      referral_link_label: "Lien d'inscription direct",
      copy: "Copier",
      copy_link: "Copier le lien",
      copied_toast: "Copié dans le presse-papier !",
      share: "Partager",
      total_network_earnings: "Gains totaux du réseau",
      from_last_month: "par rapport au mois dernier",
      today_referral_income: "Revenus du réseau aujourd'hui",
      total_team_members: "Membres totaux de l'équipe",
      members_count: "Membres actifs",
      your_active_capital: "Votre solde de base actif",
      cap_rule_status: "Plafond de commission : ACTIF",
      cap_max_prefix: "Max",
      cap_ineligible_status: "Inéligible (Min 50 USDT et KYC requis)",
      rules_title: "Règles financières et normes de calcul",
      direct_deposit_bonus_title: "Bonus d'allocation initiale (3 Niveaux)",
      direct_deposit_bonus_desc: "Accordé lors de la première allocation du nouveau membre :",
      daily_profit_comm_title: "Commission de performance (5 Niveaux)",
      daily_profit_comm_desc: "Calculée périodiquement selon les indicateurs du réseau :",
      capping_rule_title: "Règle du plafond du solde",
      capping_rule_desc: "Si le solde d'un membre dépasse le vôtre, la commission est plafonnée à votre solde actif.",
      cap_formula_badge: "Formule : Base = Min(Solde Membre, Votre Solde)",
      generations_breakdown_title: "Analyse détaillée des 5 niveaux",
      generations_breakdown_subtitle: "Suivez le volume des soldes et les gains cumulés",
      gen_1: "Niveau 1",
      gen_2: "Niveau 2",
      gen_3: "Niveau 3",
      gen_4: "Niveau 4",
      gen_5: "Niveau 5",
      lvl_1_tag: "L1 (Niv 1)",
      lvl_2_tag: "L2 (Niv 2)",
      lvl_3_tag: "L3 (Niv 3)",
      gen_l1_opt: "Niveau L1",
      gen_l2_opt: "Niveau L2",
      gen_l3_opt: "Niveau L3",
      gen_l4_opt: "Niveau L4",
      gen_l5_opt: "Niveau L5",
      active_members_in_gen: "Membres",
      total_capital_in_gen: "Solde actif total",
      direct_bonus_received: "Bonus directs reçus",
      daily_comm_received: "Commissions périodiques",
      network_tx_title: "Grand livre des transactions du réseau",
      live_sync: "Synchronisé en direct",
      search_member_placeholder: "Nom, e-mail ou téléphone...",
      all_generations: "Tous les niveaux (L1 - L5)",
      all_types: "Tous les types",
      type_direct: "Bonus d'allocation initiale",
      type_daily: "Commission de performance",
      col_member_info: "Membre (Nom / E-mail / Téléphone)",
      col_gen: "Niveau",
      col_type: "Type de récompense",
      col_capital_calc: "Solde / Base de calcul",
      col_rate_earned: "Taux appliqué",
      col_amount: "Montant reçu (USDT)",
      col_date: "Date et heure",
      nav_home: "Tableau de bord",
      nav_invest: "Performance",
      nav_team: "Équipe",
      nav_wallet: "Portefeuille",
      nav_profile: "Profil",
      cap_triggered_tag: "Plafond appliqué",
      profit_prefix: "Taux :",
      no_results: "Aucun enregistrement trouvé.",
      share_text_payload: "Rejoignez la plateforme ADM ! Mon code d'invitation :",
      error_network: "Erreur de connexion au serveur.",
      error_occurred: "Une erreur est survenue. Veuillez réessayer."
    },

    ru: {
      admin_panel: "Панель админа",
      referral_program: "Партнерская программа",
      invite_friends_title: "Приглашайте партнеров и развивайтесь вместе",
      invite_friends_desc: "Получайте до 3 уровней начального бонуса и до 5 уровней комиссий от показателей сети.",
      referral_code_label: "Ваш эксклюзивный код приглашения",
      referral_link_label: "Прямая ссылка для регистрации",
      copy: "Копировать",
      copy_link: "Копировать ссылку",
      copied_toast: "Скопировано в буфер обмена!",
      share: "Поделиться",
      total_network_earnings: "Всего вознаграждений сети",
      from_last_month: "к прошлому месяцу",
      today_referral_income: "Доход сети сегодня",
      total_team_members: "Всего участников сети",
      members_count: "Участников",
      your_active_capital: "Ваш активный базовый баланс",
      cap_rule_status: "Лимит начислений: АКТИВЕН",
      cap_max_prefix: "Макс",
      cap_ineligible_status: "Недоступно (Мин 50 USDT и KYC обязательны)",
      rules_title: "Финансовые правила и регламент расчетов сети",
      direct_deposit_bonus_title: "Бонус за начальное распределение (3 уровня)",
      direct_deposit_bonus_desc: "Выплачивается при первом распределении нового участника :",
      daily_profit_comm_title: "Комиссия за показатели сети (5 уровней)",
      daily_profit_comm_desc: "Периодически рассчитывается на основе показателей партнеров:",
      capping_rule_title: "Правило лимита баланса (Capping Rule)",
      capping_rule_desc: "Если баланс реферала превышает ваш собственный, вознаграждения начисляются строго в пределах вашего баланса.",
      cap_formula_badge: "Формула: База = Мин(Баланс партнера, Ваш баланс)",
      generations_breakdown_title: "Аналитика по 5 уровням структуры",
      generations_breakdown_subtitle: "Объем балансов, количество участников и начисленные бонусы",
      gen_1: "1-й уровень",
      gen_2: "2-й уровень",
      gen_3: "3-й уровень",
      gen_4: "4-й уровень",
      gen_5: "5-й уровень",
      lvl_1_tag: "L1 (Ур 1)",
      lvl_2_tag: "L2 (Ур 2)",
      lvl_3_tag: "L3 (Ур 3)",
      gen_l1_opt: "Уровень L1",
      gen_l2_opt: "Уровень L2",
      gen_l3_opt: "Уровень L3",
      gen_l4_opt: "Уровень L4",
      gen_l5_opt: "Уровень L5",
      active_members_in_gen: "Участников",
      total_capital_in_gen: "Общий баланс уровня",
      direct_bonus_received: "Бонусы за регистрацию",
      daily_comm_received: "Периодические комиссии",
      network_tx_title: "История транзакций партнерской сети",
      live_sync: "Онлайн синхронизация",
      search_member_placeholder: "Поиск по имени, email или тел...",
      all_generations: "Все уровни (L1 - L5)",
      all_types: "Все типы начислений",
      type_direct: "Бонус за начальное распределение",
      type_daily: "Комиссия за показатели",
      col_member_info: "Партнер (Имя / Email / Телефон)",
      col_gen: "Уровень",
      col_type: "Тип",
      col_capital_calc: "Баланс / База расчета",
      col_rate_earned: "Ставка",
      col_amount: "Начислено (USDT)",
      col_date: "Дата и время",
      nav_home: "Главная",
      nav_invest: "Показатели",
      nav_team: "Команда",
      nav_wallet: "Кошелек",
      nav_profile: "Профиль",
      cap_triggered_tag: "Сработал лимит",
      profit_prefix: "Показатель:",
      no_results: "Данные не найдены.",
      share_text_payload: "Присоединяйтесь к платформе ADM! Мой код приглашения:",
      error_network: "Ошибка подключения к серверу.",
      error_occurred: "Произошла ошибка. Пожалуйста, попробуйте еще раз."
    },

    ar: {
      admin_panel: "لوحة المسؤول",
      referral_program: "برنامج إحالة الشبكة",
      invite_friends_title: "قم بدعوة الشركاء وتطوير العمل معاً",
      invite_friends_desc: "احصل على مكافآت التخصيص حتى ۳ أجيال وعمولات الأداء حتى ۵ أجيال.",
      referral_code_label: "رمز الدعوة الحصري الخاص بك",
      referral_link_label: "رابط التسجيل المباشر",
      copy: "نسخ",
      copy_link: "نسخ الرابط",
      copied_toast: "تم النسخ إلى الحافظة!",
      share: "مشاركة",
      total_network_earnings: "إجمالي مكافآت الشبكة",
      from_last_month: "مقارنة بالشهر الماضي",
      today_referral_income: "أرباح الشبكة اليوم",
      total_team_members: "إجمالي أعضاء الفريق",
      members_count: "عضو نشط",
      your_active_capital: "رصيدك الأساسي النشط",
      cap_rule_status: "سقف الاحتساب: مفعّل",
      cap_max_prefix: "الحد الأقصى",
      cap_ineligible_status: "غير مؤهل (يلزم 50 USDT كحد أدنى وتوثيق الهوية)",
      rules_title: "قواعد الحسابات المالية لشبكة الإحالة",
      direct_deposit_bonus_title: "مكافأة التخصيص الأول (۳ أجيال - لمرة واحدة)",
      direct_deposit_bonus_desc: "تُمنح عند قيام العضو الجديد بتخصيصه الأول :",
      daily_profit_comm_title: "عمولة أداء الشبكة (۵ أجيال)",
      daily_profit_comm_desc: "تُصرف بناءً على مؤشرات الأداء الصافية لفريق العمل:",
      capping_rule_title: "قاعدة سقف الرصيد (Capping Rule)",
      capping_rule_desc: "إذا تجاوز رصيد أي عضو في فريقك رصيدك، تُحسب العمولات حصراً بناءً على سقف رصيدك.",
      cap_formula_badge: "المعادلة: الأساس = الحد الأدنى (رصيد العضو, رصيدك)",
      generations_breakdown_title: "تحليل وتفصيل أجيال الشبكة الـ ۵",
      generations_breakdown_subtitle: "متابعة حجم الأرصدة والمكافآت التراكمية لكل جيل",
      gen_1: "الجيل الأول",
      gen_2: "الجيل الثاني",
      gen_3: "الجيل الثالث",
      gen_4: "الجيل الرابع",
      gen_5: "الجيل الخامس",
      lvl_1_tag: "L1 (الجيل ۱)",
      lvl_2_tag: "L2 (الجيل ۲)",
      lvl_3_tag: "L3 (الجيل ۳)",
      gen_l1_opt: "الجيل L1",
      gen_l2_opt: "الجيل L2",
      gen_l3_opt: "الجيل L3",
      gen_l4_opt: "الجيل L4",
      gen_l5_opt: "الجيل L5",
      active_members_in_gen: "الأعضاء",
      total_capital_in_gen: "إجمالي الرصيد النشط",
      direct_bonus_received: "مكافآت التخصيص المستلمة",
      daily_comm_received: "إجمالي العمولات الدورية",
      network_tx_title: "سجل حركات وعمولات الشبكة",
      live_sync: "مزامنة مباشرة",
      search_member_placeholder: "البحث بالاسم، البريد أو الهاتف...",
      all_generations: "جميع الأجيال (L1 - L5)",
      all_types: "جميع أنواع المكافآت",
      type_direct: "مكافأة التخصيص الأول",
      type_daily: "عمولة أداء الشبكة",
      col_member_info: "عضو الفريق (الاسم / البريد / الهاتف)",
      col_gen: "الجيل",
      col_type: "النوع",
      col_capital_calc: "الرصيد / أساس الاحتساب",
      col_rate_earned: "النسبة",
      col_amount: "المبلغ (USDT)",
      col_date: "التاريخ والوقت",
      nav_home: "الرئيسية",
      nav_invest: "المؤشرات",
      nav_team: "الفريق",
      nav_wallet: "المحفظة",
      nav_profile: "الملف الشخصي",
      cap_triggered_tag: "تم تطبيق السقف",
      profit_prefix: "المعدل:",
      no_results: "لا توجد سجلات مطابقة.",
      share_text_payload: "انضم إلى منصة ADM! رمز الدعوة الخاص بي:",
      error_network: "خطأ في الاتصال بالخادم.",
      error_occurred: "حدث خطأ. يرجى المحاولة مرة أخرى."
    }
  };

  const langNames = {
    en: "English",
    fr: "Français",
    ru: "Русский",
    ar: "العربية",
    fa: "فارسی"
  };

  let serverGenerationsData = {
    L1: { members: 0, totalCapital: 0.00, directBonus: 0.00, dailyComm: 0.00 },
    L2: { members: 0, totalCapital: 0.00, directBonus: 0.00, dailyComm: 0.00 },
    L3: { members: 0, totalCapital: 0.00, directBonus: 0.00, dailyComm: 0.00 },
    L4: { members: 0, totalCapital: 0.00, directBonus: 0.00, dailyComm: 0.00 },
    L5: { members: 0, totalCapital: 0.00, directBonus: 0.00, dailyComm: 0.00 }
  };

  let serverTransactionsData = [];
  let currentLeaderCapital = 0.00;
  let isLeaderEligible = true;
  let isReleasedToday = false;

  let currentLang = localStorage.getItem('platform_lang') || 'en';
  if (!translations[currentLang]) currentLang = 'en';

  let activeGenerationTab = "L1";
  let currentFilterGen = "ALL";
  let currentFilterType = "ALL";

  function closeAllDropdowns(exceptMenu = null) {
    const langMenu = document.getElementById('langMenu');
    const langDropdownWrapper = document.getElementById('langDropdownWrapper');
    const menuDropdownGen = document.getElementById('menuDropdownGen');
    const dropdownGenWrapper = document.getElementById('dropdownGenWrapper');
    const menuDropdownType = document.getElementById('menuDropdownType');
    const dropdownTypeWrapper = document.getElementById('dropdownTypeWrapper');

    if (langMenu && langMenu !== exceptMenu) {
      langMenu.classList.remove('show');
      if (langDropdownWrapper) langDropdownWrapper.classList.remove('open');
    }
    if (menuDropdownGen && menuDropdownGen !== exceptMenu) {
      menuDropdownGen.classList.remove('show');
      if (dropdownGenWrapper) dropdownGenWrapper.classList.remove('open');
    }
    if (menuDropdownType && menuDropdownType !== exceptMenu) {
      menuDropdownType.classList.remove('show');
      if (dropdownTypeWrapper) dropdownTypeWrapper.classList.remove('open');
    }
  }

  function updateFilterDropdownLabels() {
    const t = translations[currentLang] || translations.en;
    const selectedGenLabel = document.getElementById('selectedGenLabel');
    const selectedTypeLabel = document.getElementById('selectedTypeLabel');

    if (selectedGenLabel) {
      if (currentFilterGen === "ALL") {
        selectedGenLabel.textContent = t.all_generations;
      } else {
        selectedGenLabel.textContent = t[`gen_${currentFilterGen.toLowerCase()}_opt`] || currentFilterGen;
      }
    }
    if (selectedTypeLabel) {
      if (currentFilterType === "ALL") {
        selectedTypeLabel.textContent = t.all_types;
      } else if (currentFilterType === "DIRECT") {
        selectedTypeLabel.textContent = t.type_direct;
      } else if (currentFilterType === "DAILY") {
        selectedTypeLabel.textContent = t.type_daily;
      }
    }
  }

  function renderGenerationsTab(genKey) {
    const data = serverGenerationsData[genKey] || { members: 0, totalCapital: 0, directBonus: 0, dailyComm: 0 };
    activeGenerationTab = genKey;

    document.querySelectorAll('.b-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-gen') === genKey);
    });

    const genMembersCount = document.getElementById('genMembersCount');
    const genTotalCapital = document.getElementById('genTotalCapital');
    const genDirectBonus = document.getElementById('genDirectBonus');
    const genDailyComm = document.getElementById('genDailyComm');

    if (genMembersCount) genMembersCount.textContent = data.members;
    if (genTotalCapital) genTotalCapital.textContent = data.totalCapital.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (genDirectBonus) genDirectBonus.textContent = data.directBonus.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (genDailyComm) genDailyComm.textContent = data.dailyComm.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function renderTable() {
    const transactionsTableBody = document.getElementById('transactionsTableBody');
    if (!transactionsTableBody) return;

    const memberSearchInput = document.getElementById('memberSearchInput');
    const searchTerm = memberSearchInput ? memberSearchInput.value.trim().toLowerCase() : '';
    const t = translations[currentLang] || translations.en;

    const filtered = serverTransactionsData.filter(tx => {
      const matchSearch =
        (tx.userId && tx.userId.toLowerCase().includes(searchTerm)) ||
        (tx.fullName && tx.fullName.toLowerCase().includes(searchTerm)) ||
        (tx.email && tx.email.toLowerCase().includes(searchTerm)) ||
        (tx.phone && tx.phone.toLowerCase().includes(searchTerm));

      const matchGen = (currentFilterGen === 'ALL') || (tx.gen === currentFilterGen);
      const matchType = (currentFilterType === 'ALL') || (tx.type === currentFilterType);
      return matchSearch && matchGen && matchType;
    });

    transactionsTableBody.innerHTML = '';

    if (filtered.length === 0) {
      transactionsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 36px;">
            ${t.no_results}
          </td>
        </tr>`;
      return;
    }

    filtered.forEach(tx => {
      const tr = document.createElement('tr');
      const isDirect = tx.type === 'DIRECT';
      const typeBadgeClass = isDirect ? 'direct' : 'daily';
      const typeText = isDirect ? t.type_direct : t.type_daily;

      const capTagHtml = tx.isCapped 
        ? `<span class="cap-tag-alert">⚠️ ${t.cap_triggered_tag}</span>` 
        : '';

      const capitalDisplay = isDirect 
        ? `${tx.memberCapital.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT` 
        : `${t.profit_prefix} ${tx.memberDailyProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`;

      tr.innerHTML = `
        <td>
          <div class="user-info-cell">
            <span class="user-name-title">${tx.fullName}</span>
            <span class="user-sub-details">${tx.email} &bull; ${tx.phone} (${tx.userId})</span>
          </div>
        </td>
        <td><span class="table-badge-gen">${tx.gen}</span></td>
        <td><span class="table-badge-type ${typeBadgeClass}">${typeText}</span></td>
        <td>
          <div class="basis-group">
            <span>${capitalDisplay}</span>
            ${capTagHtml}
          </div>
        </td>
        <td><span class="text-warning">${tx.appliedRate}</span></td>
        <td><strong class="text-success">+${tx.amount.toFixed(2)}</strong></td>
        <td class="text-muted" style="direction: ltr; text-align: end;">${tx.timestamp}</td>
      `;

      transactionsTableBody.appendChild(tr);
    });
  }

  function applyLanguage(lang) {
    if (!translations[lang]) lang = 'en';
    currentLang = lang;
    localStorage.setItem('platform_lang', lang);

    const isRtl = (lang === 'fa' || lang === 'ar');
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

    const currentLangLabel = document.getElementById('currentLangLabel');
    if (currentLangLabel) {
      currentLangLabel.textContent = langNames[lang];
    }

    document.querySelectorAll('#langMenu li').forEach(li => {
      li.classList.toggle('active', li.getAttribute('data-lang') === lang);
    });

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        el.placeholder = translations[lang][key];
      }
    });

    const capStatusText = document.getElementById('capStatusText');
    const capStatusPill = document.getElementById('capStatusPill');
    const t = translations[currentLang] || translations.en;

    if (capStatusText) {
      if (!isLeaderEligible) {
        capStatusText.textContent = t.cap_ineligible_status;
        if (capStatusPill) capStatusPill.classList.add('ineligible');
      } else {
        const maxPrefix = t.cap_max_prefix || (lang === 'fa' ? 'حداکثر' : 'Max');
        capStatusText.textContent = `${t.cap_rule_status} (${maxPrefix} ${currentLeaderCapital.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT)`;
        if (capStatusPill) capStatusPill.classList.remove('ineligible');
      }
    }

    updateFilterDropdownLabels();
    renderGenerationsTab(activeGenerationTab);
    renderTable();
  }

  let toastTimer = null;
  function showToast(msg) {
    const toastNotification = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');
    if (!toastNotification || !toastMessage) return;

    const t = translations[currentLang] || translations.en;
    toastMessage.textContent = msg || t.copied_toast;
    toastNotification.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2500);
  }

  function setupCopyButton(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.onclick = () => {
      const t = translations[currentLang] || translations.en;
      navigator.clipboard.writeText(input.value).then(() => {
        showToast(t.copied_toast);
      }).catch(() => {
        input.select();
        document.execCommand('copy');
        showToast(t.copied_toast);
      });
    };
  }

  async function fetchTeamData() {
    let sessionUser = {};
    try {
      sessionUser = JSON.parse(sessionStorage.getItem('current_user') || localStorage.getItem('current_user') || '{}');
    } catch (e) {
      sessionUser = {};
    }
    const currentUserId = sessionUser.userId || sessionUser.id || localStorage.getItem('user_id') || '';
    
    const baseApi = resolveApiUrl('/api/team/data');
    const queryUrl = currentUserId ? `${baseApi}?user_id=${encodeURIComponent(currentUserId)}` : baseApi;
    const t = translations[currentLang] || translations.en;

    try {
      const res = await fetch(queryUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': String(currentUserId)
        },
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Network response not ok');
      }

      const json = await res.json();
      if (json.status === 'success' && json.data) {
        const d = json.data;

        const role = (d.user && d.user.role) ? d.user.role : (localStorage.getItem('user_role') || 'user');
        localStorage.setItem('user_role', role);
        const adminBadgeBtn = document.getElementById('adminBadgeBtn');
        if (adminBadgeBtn) {
          if (role === 'admin') adminBadgeBtn.classList.remove('hidden');
          else adminBadgeBtn.classList.add('hidden');
        }

        const referralCodeInput = document.getElementById('referralCodeInput');
        const referralLinkInput = document.getElementById('referralLinkInput');

        let myCode = '';
        if (d.user && d.user.referral_code) myCode = d.user.referral_code;
        else if (d.user && d.user.referralCode) myCode = d.user.referralCode;
        else if (sessionUser.referralCode) myCode = sessionUser.referralCode;
        else if (sessionUser.referral_code) myCode = sessionUser.referral_code;
        else if (currentUserId) myCode = `ADM-${String(currentUserId).padStart(6, '0')}`;
        else myCode = 'ADM2026';

        const myLink = `${window.location.origin}/index.html?ref=${myCode}`;

        if (referralCodeInput) referralCodeInput.value = myCode;
        if (referralLinkInput) referralLinkInput.value = myLink;

        if (d.stats) {
          isLeaderEligible = Boolean(d.stats.is_eligible);
          isReleasedToday = Boolean(d.stats.is_released !== undefined ? d.stats.is_released : d.stats.isReleased);
          currentLeaderCapital = Number(d.stats.leader_active_capital) || 0.00;

          const totalNetworkEarnings = document.getElementById('totalNetworkEarnings');
          const todayReferralIncome = document.getElementById('todayReferralIncome');
          const totalTeamMembers = document.getElementById('totalTeamMembers');
          const leaderActiveCapital = document.getElementById('leaderActiveCapital');

          if (totalNetworkEarnings) {
            totalNetworkEarnings.textContent = (Number(d.stats.total_network_earnings) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }

          if (todayReferralIncome) {
            const todayInc = Number(d.stats.today_referral_income) || 0;
            if (!isLeaderEligible) {
              todayReferralIncome.textContent = '+0.00';
            } else if (isReleasedToday || todayInc > 0) {
              todayReferralIncome.textContent = `+${todayInc.toFixed(2)}`;
            } else {
              todayReferralIncome.textContent = '---';
            }
          }

          if (totalTeamMembers) totalTeamMembers.textContent = d.stats.total_team_members || 0;
          if (leaderActiveCapital) leaderActiveCapital.textContent = currentLeaderCapital.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          if (d.stats.members_per_gen) {
            for (let i = 1; i <= 5; i++) {
              const pill = document.getElementById(`pillL${i}`);
              if (pill) pill.textContent = `L${i}: ${d.stats.members_per_gen[`L${i}`] || 0}`;
            }
          }
        }

        if (d.generations) serverGenerationsData = d.generations;
        if (d.transactions) serverTransactionsData = d.transactions;

        applyLanguage(currentLang);
      }
    } catch (err) {
      console.warn("fetchTeamData notice:", err);
      const fallbackCode = localStorage.getItem('user_uid') ? `ADM-${localStorage.getItem('user_uid')}` : 'ADM2026';
      const refCodeInput = document.getElementById('referralCodeInput');
      const refLinkInput = document.getElementById('referralLinkInput');
      if (refCodeInput && refCodeInput.value.includes('Loading')) refCodeInput.value = fallbackCode;
      if (refLinkInput && refLinkInput.value.includes('Loading')) refLinkInput.value = `${window.location.origin}/index.html?ref=${fallbackCode}`;
      
      applyLanguage(currentLang);
      showToast(t.error_network);
    }
  }

  function bindInteractiveEvents() {
    const userRole = localStorage.getItem('user_role') || 'user';
    const adminBadgeBtn = document.getElementById('adminBadgeBtn');
    if (adminBadgeBtn && userRole === 'admin') {
      adminBadgeBtn.classList.remove('hidden');
    }

    const langDropdownWrapper = document.getElementById('langDropdownWrapper');
    const langToggleBtn = document.getElementById('langToggleBtn');
    const langMenu = document.getElementById('langMenu');

    if (langToggleBtn && langMenu) {
      langToggleBtn.onclick = (e) => {
        e.stopPropagation();
        closeAllDropdowns(langMenu);
        langMenu.classList.toggle('show');
        if (langDropdownWrapper) langDropdownWrapper.classList.toggle('open');
      };

      langMenu.querySelectorAll('li').forEach(li => {
        li.onclick = () => {
          applyLanguage(li.getAttribute('data-lang'));
          langMenu.classList.remove('show');
          if (langDropdownWrapper) langDropdownWrapper.classList.remove('open');
        };
      });
    }

    setupCopyButton('btnCopyCode', 'referralCodeInput');
    setupCopyButton('btnCopyLink', 'referralLinkInput');

    const btnDirectShare = document.getElementById('btnDirectShare');
    if (btnDirectShare) {
      btnDirectShare.onclick = () => {
        const t = translations[currentLang] || translations.en;
        const refLink = document.getElementById('referralLinkInput') ? document.getElementById('referralLinkInput').value : '';
        const refCode = document.getElementById('referralCodeInput') ? document.getElementById('referralCodeInput').value : '';
        const sharePayload = `${t.share_text_payload} ${refCode}\n${refLink}`;

        if (navigator.share) {
          navigator.share({
            title: 'ADM Platform',
            text: sharePayload,
            url: refLink
          }).catch(() => {});
        } else {
          navigator.clipboard.writeText(sharePayload).then(() => {
            showToast(t.copied_toast);
          });
        }
      };
    }

    const genTabsNav = document.getElementById('genTabsNav');
    if (genTabsNav) {
      genTabsNav.querySelectorAll('.b-tab-btn').forEach(btn => {
        btn.onclick = () => {
          renderGenerationsTab(btn.getAttribute('data-gen'));
        };
      });
    }

    const btnDropdownGen = document.getElementById('btnDropdownGen');
    const menuDropdownGen = document.getElementById('menuDropdownGen');
    const dropdownGenWrapper = document.getElementById('dropdownGenWrapper');
    const selectedGenLabel = document.getElementById('selectedGenLabel');

    if (btnDropdownGen && menuDropdownGen) {
      btnDropdownGen.onclick = (e) => {
        e.stopPropagation();
        closeAllDropdowns(menuDropdownGen);
        menuDropdownGen.classList.toggle('show');
        if (dropdownGenWrapper) dropdownGenWrapper.classList.toggle('open');
      };

      menuDropdownGen.querySelectorAll('li').forEach(li => {
        li.onclick = (e) => {
          e.stopPropagation();
          currentFilterGen = li.getAttribute('data-value');
          menuDropdownGen.querySelectorAll('li').forEach(item => item.classList.remove('active'));
          li.classList.add('active');
          if (selectedGenLabel) selectedGenLabel.textContent = li.textContent;
          menuDropdownGen.classList.remove('show');
          if (dropdownGenWrapper) dropdownGenWrapper.classList.remove('open');
          renderTable();
        };
      });
    }

    const btnDropdownType = document.getElementById('btnDropdownType');
    const menuDropdownType = document.getElementById('menuDropdownType');
    const dropdownTypeWrapper = document.getElementById('dropdownTypeWrapper');
    const selectedTypeLabel = document.getElementById('selectedTypeLabel');

    if (btnDropdownType && menuDropdownType) {
      btnDropdownType.onclick = (e) => {
        e.stopPropagation();
        closeAllDropdowns(menuDropdownType);
        menuDropdownType.classList.toggle('show');
        if (dropdownTypeWrapper) dropdownTypeWrapper.classList.toggle('open');
      };

      menuDropdownType.querySelectorAll('li').forEach(li => {
        li.onclick = (e) => {
          e.stopPropagation();
          currentFilterType = li.getAttribute('data-value');
          menuDropdownType.querySelectorAll('li').forEach(item => item.classList.remove('active'));
          li.classList.add('active');
          if (selectedTypeLabel) selectedTypeLabel.textContent = li.textContent;
          menuDropdownType.classList.remove('show');
          if (dropdownTypeWrapper) dropdownTypeWrapper.classList.remove('open');
          renderTable();
        };
      });
    }

    document.onclick = () => closeAllDropdowns();

    const memberSearchInput = document.getElementById('memberSearchInput');
    if (memberSearchInput) {
      memberSearchInput.oninput = renderTable;
    }

    document.querySelectorAll('.bottom-nav .nav-item').forEach(navItem => {
      navItem.onclick = function (e) {
        const targetHref = this.getAttribute('href');
        if (targetHref && targetHref !== '#' && !this.classList.contains('active')) {
          e.preventDefault();
          window.location.href = targetHref;
        }
      };
    });
  }

  function initTeamPage() {
    applyLanguage(currentLang);
    bindInteractiveEvents();
    fetchTeamData();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTeamPage);
  } else {
    initTeamPage();
  }

  window.addEventListener('pageshow', () => {
    applyLanguage(currentLang);
    fetchTeamData();
  });

  window.initTeamPage = initTeamPage;

})();
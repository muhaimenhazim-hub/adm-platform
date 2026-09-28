/**
 * ==============================================================================
 * ADM Investment Platform - Team & Network Module Frontend Controller
 * File: team.js (Connected dynamically via window.APP_CONFIG to /api/team/data)
 * ==============================================================================
 */

(function () {
  'use strict';

  // تابع استاندارد دریافت اندپوینت از کانفیگ مرکزی
  function resolveApiUrl(endpoint) {
    if (window.APP_CONFIG && typeof window.APP_CONFIG.getApiUrl === 'function') {
      return window.APP_CONFIG.getApiUrl(endpoint);
    }
    return endpoint;
  }

  // دیکشنری جامع ۵ زبانه استاندارد پلتفرم
  const translations = {
    fa: {
      admin_panel: "پنل ادمین",
      referral_program: "برنامه درآمدزایی شبکه",
      invite_friends_title: "دوستان خود را دعوت کنید و با هم سود ببرید",
      invite_friends_desc: "دریافت پاداش معرفی تا ۳ نسل و کمیسیون سود روزانه تا ۵ نسل بدون محدودیت",
      referral_code_label: "کد دعوت اختصاصی شما",
      referral_link_label: "لینک ثبت‌نام مستقیم",
      copy: "کپی",
      copy_link: "کپی لینک",
      copied_toast: "در کلیپ‌بورد کپی شد!",
      share: "اشتراک‌گذاری",
      total_network_earnings: "مجموع درآمد کل شبکه",
      from_last_month: "نسبت به ماه قبل",
      today_referral_income: "درآمد امروز از شبکه",
      total_team_members: "تعداد کل اعضای تیم",
      members_count: "عضو فعال",
      your_active_capital: "سرمایه فعال شما",
      cap_rule_status: "سقف محاسبه کمیسیون: فعال",
      cap_max_prefix: "حداکثر",
      cap_ineligible_status: "غیرفعال (حداقل ۵۰ USDT سرمایه فعال و احراز هویت الزامی است)",
      rules_title: "قوانین و محاسبات مالی پاداش و کمیسیون شبکه",
      direct_deposit_bonus_title: "پاداش معرفی اولیه (۳ نسل - فقط واریز اول)",
      direct_deposit_bonus_desc: "این پاداش یک‌بار برای همیشه تنها در زمان نخستین واریز عضو جدید تعلق می‌گیرد (واریزهای بعدی یا سود مرکب فاقد پاداش معرفی هستند):",
      daily_profit_comm_title: "کمیسیون روزانه از سود تیم (۵ نسل - هر شب)",
      daily_profit_comm_desc: "هر شب رأس ساعت ۲۱:۰۰ به وقت افغانستان بر مبنای سود خالصی که زیرمجموعه‌ها دریافت می‌کنند واریز می‌شود:",
      capping_rule_title: "قانون سقف سرمایه لیدر (Leader Capital Cap)",
      capping_rule_desc: "لیدر باید دارای حداقل ۵۰ دلار سرمایه فعال و احراز هویت تأییدشده باشد. همچنین در صورتی که سرمایه هر یک از اعضای زیرمجموعه بیشتر از سرمایه خود شما باشد، پاداش‌ها بر اساس «سرمایه فعال شما» سقف‌گذاری می‌گردد.",
      cap_formula_badge: "فرمول: مبنای محاسبه = حداقل (سرمایه عضو, سرمایه شما)",
      generations_breakdown_title: "آمار تفکیکی ۵ نسل زیرمجموعه",
      generations_breakdown_subtitle: "بررسی حجم سرمایه، تعداد نفرات و مجموع پاداش‌های دریافتی از هر سطح",
      gen_1: "نسل اول",
      gen_2: "نسل دوم",
      gen_3: "نسل سوم",
      gen_4: "نسل چهارم",
      gen_5: "نسل پنجم",
      lvl_1_tag: "L1 (نسل ۱)",
      lvl_2_tag: "L2 (نسل ۲)",
      lvl_3_tag: "L3 (نسل ۳)",
      gen_l1_opt: "نسل L1",
      gen_l2_opt: "نسل L2",
      gen_l3_opt: "نسل L3",
      gen_l4_opt: "نسل L4",
      gen_l5_opt: "نسل L5",
      active_members_in_gen: "اعضای این نسل",
      total_capital_in_gen: "کل سرمایه فعال نسل",
      direct_bonus_received: "پاداش واریز اولیه دریافتی",
      daily_comm_received: "مجموع کمیسیون روزانه دریافتی",
      network_tx_title: "ریز تراکنش‌ها و تاریخچه پاداش‌های شبکه",
      live_sync: "همگام‌سازی لحظه‌ای",
      search_member_placeholder: "جستجو با نام، ایمیل یا موبایل...",
      all_generations: "همه نسل‌ها (L1 - L5)",
      all_types: "همه انواع پاداش",
      type_direct: "پاداش واریز اولیه",
      type_daily: "کمیسیون سود روزانه",
      col_member_info: "عضو تیم (نام / ایمیل / موبایل)",
      col_gen: "نسل",
      col_type: "نوع پاداش",
      col_capital_calc: "سرمایه عضو / مبنای محاسبه",
      col_rate_earned: "درصد اعمال‌شده",
      col_amount: "مبلغ دریافتی (USDT)",
      col_date: "تاریخ و ساعت",
      nav_home: "داشبورد",
      nav_invest: "سرمایه‌گذاری",
      nav_team: "تیم و شبکه",
      nav_wallet: "کیف پول",
      nav_profile: "پروفایل",
      cap_triggered_tag: "قانون سقف اعمال شد",
      profit_prefix: "سود:",
      no_results: "هیچ رکوردی در شبکه یافت نشد.",
      share_text_payload: "به بزرگترین پلتفرم سرمایه‌گذاری کریپتو بپیوندید و روزانه تا ۱.۳٪ سود تضمینی دریافت کنید. کد دعوت من:"
    },

    en: {
      admin_panel: "Admin Panel",
      referral_program: "Referral Network Program",
      invite_friends_title: "Invite Friends & Earn Crypto Together",
      invite_friends_desc: "Receive up to 3 generations of initial bonus & up to 5 generations of daily profit commissions.",
      referral_code_label: "Your Exclusive Referral Code",
      referral_link_label: "Direct Referral Registration Link",
      copy: "Copy",
      copy_link: "Copy Link",
      copied_toast: "Copied to clipboard!",
      share: "Share",
      total_network_earnings: "Total Network Earnings",
      from_last_month: "vs last month",
      today_referral_income: "Today's Referral Income",
      total_team_members: "Total Team Members",
      members_count: "Active Members",
      your_active_capital: "Your Active Capital",
      cap_rule_status: "Commission Capping: ACTIVE",
      cap_max_prefix: "Max",
      cap_ineligible_status: "Ineligible (Min 50 USDT active capital & KYC required)",
      rules_title: "Financial Rules & Referral Calculation Standards",
      direct_deposit_bonus_title: "Initial Deposit Bonus (3 Gen - First Deposit Only)",
      direct_deposit_bonus_desc: "Paid strictly once upon the new member's first deposit (subsequent deposits and compounding do not yield direct bonuses):",
      daily_profit_comm_title: "Daily Profit Commission (5 Generations - Every Night)",
      daily_profit_comm_desc: "Released every night at 21:00 Afghanistan Time based on downline net profit:",
      capping_rule_title: "Leader Capital Capping Rule",
      capping_rule_desc: "Leaders must have at least 50 USDT active capital and verified KYC. If any member's capital exceeds yours, bonuses are strictly capped on your active capital.",
      cap_formula_badge: "Formula: Basis = Min(Member Capital, Your Capital)",
      generations_breakdown_title: "5 Generations Breakdown & Analytics",
      generations_breakdown_subtitle: "Track active capital volume, headcounts, and accumulated earnings per level",
      gen_1: "Generation 1",
      gen_2: "Generation 2",
      gen_3: "Generation 3",
      gen_4: "Generation 4",
      gen_5: "Generation 5",
      lvl_1_tag: "L1 (Gen 1)",
      lvl_2_tag: "L2 (Gen 2)",
      lvl_3_tag: "L3 (Gen 3)",
      gen_l1_opt: "Generation L1",
      gen_l2_opt: "Generation L2",
      gen_l3_opt: "Generation L3",
      gen_l4_opt: "Generation L4",
      gen_l5_opt: "Generation L5",
      active_members_in_gen: "Members",
      total_capital_in_gen: "Total Active Capital",
      direct_bonus_received: "Direct Bonuses Received",
      daily_comm_received: "Total Daily Commissions",
      network_tx_title: "Network Transactions & Reward Ledger",
      live_sync: "Live Synchronized",
      search_member_placeholder: "Search by Name, Email or Phone...",
      all_generations: "All Generations (L1 - L5)",
      all_types: "All Reward Types",
      type_direct: "Initial Deposit Bonus",
      type_daily: "Daily Profit Commission",
      col_member_info: "Team Member (Name / Email / Phone)",
      col_gen: "Level",
      col_type: "Reward Type",
      col_capital_calc: "Member Capital / Basis",
      col_rate_earned: "Applied Rate",
      col_amount: "Amount Earned (USDT)",
      col_date: "Date & Time",
      nav_home: "Dashboard",
      nav_invest: "Invest",
      nav_team: "Team",
      nav_wallet: "Wallet",
      nav_profile: "Profile",
      cap_triggered_tag: "Cap Applied",
      profit_prefix: "Profit:",
      no_results: "No team records found.",
      share_text_payload: "Join the leading crypto investment platform and earn up to 1.3% daily profit! My referral code:"
    },

    fr: {
      admin_panel: "Panneau d'admin",
      referral_program: "Programme d'affiliation réseau",
      invite_friends_title: "Invitez des amis et gagnez ensemble",
      invite_friends_desc: "Recevez jusqu'à 3 générations de bonus initial et jusqu'à 5 générations de commissions journalières.",
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
      your_active_capital: "Votre capital actif",
      cap_rule_status: "Plafond de commission : ACTIF",
      cap_max_prefix: "Max",
      cap_ineligible_status: "Inéligible (Min 50 USDT et KYC requis)",
      rules_title: "Règles financières et normes de calcul",
      direct_deposit_bonus_title: "Bonus de dépôt initial (3 Générations)",
      direct_deposit_bonus_desc: "Payé une seule fois lors du premier dépôt du nouveau membre :",
      daily_profit_comm_title: "Commission journalière sur les bénéfices (5 Générations)",
      daily_profit_comm_desc: "Payé chaque soir à 21h00 (heure d'Afghanistan) en fonction des bénéfices du réseau :",
      capping_rule_title: "Règle du plafond du capital",
      capping_rule_desc: "Si le capital d'un membre dépasse le vôtre, la commission est calculée sur la base de votre propre capital.",
      cap_formula_badge: "Formule : Base = Min(Capital Membre, Votre Capital)",
      generations_breakdown_title: "Analyse détaillée des 5 générations",
      generations_breakdown_subtitle: "Suivez le volume des capitaux et les gains cumulés",
      gen_1: "Génération 1",
      gen_2: "Génération 2",
      gen_3: "Génération 3",
      gen_4: "Génération 4",
      gen_5: "Génération 5",
      lvl_1_tag: "L1 (Gén 1)",
      lvl_2_tag: "L2 (Gén 2)",
      lvl_3_tag: "L3 (Gén 3)",
      gen_l1_opt: "Génération L1",
      gen_l2_opt: "Génération L2",
      gen_l3_opt: "Génération L3",
      gen_l4_opt: "Génération L4",
      gen_l5_opt: "Génération L5",
      active_members_in_gen: "Membres",
      total_capital_in_gen: "Capital actif total",
      direct_bonus_received: "Bonus directs reçus",
      daily_comm_received: "Commissions journalières",
      network_tx_title: "Grand livre des transactions du réseau",
      live_sync: "Synchronisé en direct",
      search_member_placeholder: "Nom, e-mail ou téléphone...",
      all_generations: "Toutes les générations (L1 - L5)",
      all_types: "Tous les types",
      type_direct: "Bonus de premier dépôt",
      type_daily: "Commission journalière",
      col_member_info: "Membre (Nom / E-mail / Téléphone)",
      col_gen: "Niveau",
      col_type: "Type de récompense",
      col_capital_calc: "Capital / Base de calcul",
      col_rate_earned: "Taux appliqué",
      col_amount: "Montant reçu (USDT)",
      col_date: "Date et heure",
      nav_home: "Tableau de bord",
      nav_invest: "Investir",
      nav_team: "Équipe",
      nav_wallet: "Portefeuille",
      nav_profile: "Profil",
      cap_triggered_tag: "Plafond appliqué",
      profit_prefix: "Bénéfice :",
      no_results: "Aucun enregistrement trouvé.",
      share_text_payload: "Rejoignez la plateforme crypto et gagnez jusqu'à 1,3% par jour ! Mon code d'invitation :"
    },

    ru: {
      admin_panel: "Панель админа",
      referral_program: "Партнерская программа",
      invite_friends_title: "Приглашайте друзей и зарабатывайте вместе",
      invite_friends_desc: "Получайте до 3 уровней бонуса за первый депозит и до 5 уровней ежедневных комиссий от прибыли.",
      referral_code_label: "Ваш эксклюзивный реферальный код",
      referral_link_label: "Прямая ссылка для регистрации",
      copy: "Копировать",
      copy_link: "Копировать ссылку",
      copied_toast: "Скопировано в буфер обмена!",
      share: "Поделиться",
      total_network_earnings: "Всего заработано в сети",
      from_last_month: "к прошлому месяцу",
      today_referral_income: "Доход сети сегодня",
      total_team_members: "Всего участников сети",
      members_count: "Участников",
      your_active_capital: "Ваш активный депозит",
      cap_rule_status: "Лимит начислений: АКТИВЕН",
      cap_max_prefix: "Макс",
      cap_ineligible_status: "Недоступно (Мин 50 USDT и KYC обязательны)",
      rules_title: "Финансовые правила и регламент расчетов сети",
      direct_deposit_bonus_title: "Бонус за первый депозит (3 уровня)",
      direct_deposit_bonus_desc: "Выплачивается строго один раз при первом депозите нового участника :",
      daily_profit_comm_title: "Ежедневная комиссия от прибыли (5 уровней)",
      daily_profit_comm_desc: "Начисляется каждый вечер в 21:00 (время Афганистана) на основе прибыли партнеров:",
      capping_rule_title: "Правило лимита депозита (Capping Rule)",
      capping_rule_desc: "Если депозит реферала превышает ваш собственный, вознаграждения начисляются строго в пределах вашего капитала.",
      cap_formula_badge: "Формула: База = Мин(Депозит партнера, Ваш депозит)",
      generations_breakdown_title: "Аналитика по 5 уровням структуры",
      generations_breakdown_subtitle: "Объем депозитов, количество участников и начисленные бонусы",
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
      total_capital_in_gen: "Общий капитал уровня",
      direct_bonus_received: "Бонусы за регистрацию",
      daily_comm_received: "Ежедневные комиссии",
      network_tx_title: "История транзакций партнерской сети",
      live_sync: "Онлайн синхронизация",
      search_member_placeholder: "Поиск по имени, email или тел...",
      all_generations: "Все уровни (L1 - L5)",
      all_types: "Все типы начислений",
      type_direct: "Бонус за первый депозит",
      type_daily: "Комиссия с прибыли",
      col_member_info: "Партнер (Имя / Email / Телефон)",
      col_gen: "Уровень",
      col_type: "Тип",
      col_capital_calc: "Депозит / База расчета",
      col_rate_earned: "Ставка",
      col_amount: "Начислено (USDT)",
      col_date: "Дата и время",
      nav_home: "Главная",
      nav_invest: "Инвестиции",
      nav_team: "Команда",
      nav_wallet: "Кошелек",
      nav_profile: "Профиль",
      cap_triggered_tag: "Сработал лимит",
      profit_prefix: "Прибыль:",
      no_results: "Данные не найдены.",
      share_text_payload: "Присоединяйтесь к ведущей инвестиционной платформе и зарабатывайте до 1.3% в день! Код:"
    },

    ar: {
      admin_panel: "لوحة المسؤول",
      referral_program: "برنامج إحالة الشبكة",
      invite_friends_title: "قم بدعوة أصدقائك واكسب العملات المشفرة معاً",
      invite_friends_desc: "احصل على مكافآت الإيداع حتى ۳ أجيال وعمولات يومية من الأرباح حتى ۵ أجيال.",
      referral_code_label: "رمز الدعوة الحصري الخاص بك",
      referral_link_label: "رابط التسجيل المباشر",
      copy: "نسخ",
      copy_link: "نسخ الرابط",
      copied_toast: "تم النسخ إلى الحافظة!",
      share: "مشاركة",
      total_network_earnings: "إجمالي أرباح الشبكة",
      from_last_month: "مقارنة بالشهر الماضي",
      today_referral_income: "أرباح الشبكة اليوم",
      total_team_members: "إجمالي أعضاء الفريق",
      members_count: "عضو نشط",
      your_active_capital: "رأس مالك النشط",
      cap_rule_status: "سقف الاحتساب: مفعّل",
      cap_max_prefix: "الحد الأقصى",
      cap_ineligible_status: "غير مؤهل (يلزم 50 USDT كحد أدنى وتوثيق الهوية)",
      rules_title: "قواعد الحسابات المالية لشبكة الإحالة",
      direct_deposit_bonus_title: "مكافأة الإيداع الأول (۳ أجيال - لمرة واحدة)",
      direct_deposit_bonus_desc: "تُدفع مرة واحدة فقط عند قيام العضو الجديد بإيداعه الأول :",
      daily_profit_comm_title: "عمولة الأرباح اليومية (۵ أجيال - كل ليلة)",
      daily_profit_comm_desc: "تُصرف كل ليلة الساعة ۲۱:۰۰ بتوقيت أفغانستان بناءً على صافي أرباح الفريق:",
      capping_rule_title: "قاعدة سقف رأس المال (Capping Rule)",
      capping_rule_desc: "إذا تجاوز رأس مال أي عضو في فريقك رأس مالك، تُحسب العمولات حصراً بناءً على سقف رأس مالك.",
      cap_formula_badge: "المعادلة: الأساس = الحد الأدنى (رأس مال العضو, رأس مالك)",
      generations_breakdown_title: "تحليل وتفصيل أجيال الشبكة الـ ۵",
      generations_breakdown_subtitle: "متابعة حجم رؤوس الأموال والأرباح التراكمية لكل جيل",
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
      total_capital_in_gen: "إجمالي رأس المال النشط",
      direct_bonus_received: "مكافآت الإيداع المستلمة",
      daily_comm_received: "إجمالي العمولات اليومية",
      network_tx_title: "سجل حركات وعمولات الشبكة",
      live_sync: "مزامنة مباشرة",
      search_member_placeholder: "البحث بالاسم، البريد أو الهاتف...",
      all_generations: "جميع الأجيال (L1 - L5)",
      all_types: "جميع أنواع المكافآت",
      type_direct: "مكافأة الإيداع الأول",
      type_daily: "عمولة الأرباح اليومية",
      col_member_info: "عضو الفريق (الاسم / البريد / الهاتف)",
      col_gen: "الجيل",
      col_type: "النوع",
      col_capital_calc: "رأس المال / أساس الاحتساب",
      col_rate_earned: "النسبة",
      col_amount: "المبلغ (USDT)",
      col_date: "التاريخ والوقت",
      nav_home: "الرئيسية",
      nav_invest: "الاستثمار",
      nav_team: "الفريق",
      nav_wallet: "المحفظة",
      nav_profile: "الملف الشخصي",
      cap_triggered_tag: "تم تطبيق السقف",
      profit_prefix: "الربح:",
      no_results: "لا توجد سجلات مطابقة.",
      share_text_payload: "انضم إلى منصة الاستثمار الرائدة في العملات المشفرة واربح يومياً حتى ۱.۳٪! رمز الدعوة:"
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

  let currentLang = localStorage.getItem('platform_lang') || 'fa';
  if (!translations[currentLang]) currentLang = 'fa';

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
    const t = translations[currentLang] || translations.fa;
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
    if (genTotalCapital) genTotalCapital.textContent = data.totalCapital.toLocaleString('en-US', { minimumFractionDigits: 2 });
    if (genDirectBonus) genDirectBonus.textContent = data.directBonus.toLocaleString('en-US', { minimumFractionDigits: 2 });
    if (genDailyComm) genDailyComm.textContent = data.dailyComm.toLocaleString('en-US', { minimumFractionDigits: 2 });
  }

  function renderTable() {
    const transactionsTableBody = document.getElementById('transactionsTableBody');
    if (!transactionsTableBody) return;

    const memberSearchInput = document.getElementById('memberSearchInput');
    const searchTerm = memberSearchInput ? memberSearchInput.value.trim().toLowerCase() : '';
    const t = translations[currentLang] || translations.fa;

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
        ? `${tx.memberCapital.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT` 
        : `${t.profit_prefix} ${tx.memberDailyProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT`;

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
    if (!translations[lang]) lang = 'fa';
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
    const t = translations[currentLang] || translations.fa;

    if (capStatusText) {
      if (!isLeaderEligible) {
        capStatusText.textContent = t.cap_ineligible_status;
        if (capStatusPill) capStatusPill.classList.add('ineligible');
      } else {
        const maxPrefix = t.cap_max_prefix || (lang === 'fa' ? 'حداکثر' : 'Max');
        capStatusText.textContent = `${t.cap_rule_status} (${maxPrefix} ${currentLeaderCapital.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT)`;
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
    toastMessage.textContent = msg || translations[currentLang].copied_toast;
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
      navigator.clipboard.writeText(input.value).then(() => {
        showToast(translations[currentLang].copied_toast);
      }).catch(() => {
        input.select();
        document.execCommand('copy');
        showToast(translations[currentLang].copied_toast);
      });
    };
  }

  /**
   * دریافت داده‌های زنده از پایگاه‌داده و جایگذاری قطعی کد و لینک دعوت
   */
  async function fetchTeamData() {
    let sessionUser = {};
    try {
      sessionUser = JSON.parse(sessionStorage.getItem('current_user') || localStorage.getItem('current_user') || '{}');
    } catch (e) {
      sessionUser = {};
    }
    const currentUserId = sessionUser.userId || sessionUser.id || localStorage.getItem('user_id') || '';
    
    // اتصال داینامیک از طریق config.js
    const baseApi = resolveApiUrl('/api/team/data');
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

      if (!res.ok) {
        throw new Error('Network response not ok');
      }

      const json = await res.json();
      if (json.status === 'success' && json.data) {
        const d = json.data;

        // نقش ادمین
        const role = (d.user && d.user.role) ? d.user.role : (localStorage.getItem('user_role') || 'user');
        localStorage.setItem('user_role', role);
        const adminBadgeBtn = document.getElementById('adminBadgeBtn');
        if (adminBadgeBtn) {
          if (role === 'admin') adminBadgeBtn.classList.remove('hidden');
          else adminBadgeBtn.classList.add('hidden');
        }

        // جایگذاری قطعی کد و لینک دعوت
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

        if (referralCodeInput) {
          referralCodeInput.value = myCode;
        }
        if (referralLinkInput) {
          referralLinkInput.value = myLink;
        }

        // آمارها
        if (d.stats) {
          isLeaderEligible = Boolean(d.stats.is_eligible);
          currentLeaderCapital = Number(d.stats.leader_active_capital) || 0.00;

          const totalNetworkEarnings = document.getElementById('totalNetworkEarnings');
          const todayReferralIncome = document.getElementById('todayReferralIncome');
          const totalTeamMembers = document.getElementById('totalTeamMembers');
          const leaderActiveCapital = document.getElementById('leaderActiveCapital');

          if (totalNetworkEarnings) totalNetworkEarnings.textContent = (Number(d.stats.total_network_earnings) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
          if (todayReferralIncome) todayReferralIncome.textContent = `+${(Number(d.stats.today_referral_income) || 0).toFixed(2)}`;
          if (totalTeamMembers) totalTeamMembers.textContent = d.stats.total_team_members || 0;
          if (leaderActiveCapital) leaderActiveCapital.textContent = currentLeaderCapital.toLocaleString('en-US', { minimumFractionDigits: 2 });

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
        if (langDropdownWrapper) langDropdownWrapper.classList.remove('open');
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
        const refLink = document.getElementById('referralLinkInput') ? document.getElementById('referralLinkInput').value : '';
        const refCode = document.getElementById('referralCodeInput') ? document.getElementById('referralCodeInput').value : '';
        const sharePayload = `${translations[currentLang].share_text_payload} ${refCode}\n${refLink}`;

        if (navigator.share) {
          navigator.share({
            title: 'ADM Binance Platform',
            text: sharePayload,
            url: refLink
          }).catch(() => {});
        } else {
          navigator.clipboard.writeText(sharePayload).then(() => {
            showToast(translations[currentLang].copied_toast);
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

    // دراپ‌داون نسل‌ها
    const btnDropdownGen = document.getElementById('btnDropdownGen');
    const menuDropdownGen = document.getElementById('menuDropdownGen');
    const dropdownGenWrapper = document.getElementById('dropdownGenWrapper');
    const selectedGenLabel = document.getElementById('selectedGenLabel');

    if (btnDropdownGen && menuDropdownGen) {
      btnDropdownGen.onclick = (e) => {
        e.stopPropagation();
        closeAllDropdowns(menuDropdownGen);
        menuDropdownGen.classList.toggle('show');
        if (dropdownGenWrapper) dropdownGenWrapper.classList.remove('open');
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

    // دراپ‌داون نوع پاداش
    const btnDropdownType = document.getElementById('btnDropdownType');
    const menuDropdownType = document.getElementById('menuDropdownType');
    const dropdownTypeWrapper = document.getElementById('dropdownTypeWrapper');
    const selectedTypeLabel = document.getElementById('selectedTypeLabel');

    if (btnDropdownType && menuDropdownType) {
      btnDropdownType.onclick = (e) => {
        e.stopPropagation();
        closeAllDropdowns(menuDropdownType);
        menuDropdownType.classList.toggle('show');
        if (dropdownTypeWrapper) dropdownTypeWrapper.classList.remove('open');
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

    // ناوبری ۵ گزینه‌ای نوار پایین
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
    bindInteractiveEvents();
    fetchTeamData();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTeamPage);
  } else {
    initTeamPage();
  }

  window.addEventListener('pageshow', () => {
    fetchTeamData();
  });

  window.initTeamPage = initTeamPage;

})();
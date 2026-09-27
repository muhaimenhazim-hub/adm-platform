/**
 * ============================================================================
 * ADM BINANCE PRO - MASTER ADMIN PANEL JAVASCRIPT ENGINE
 * File: admin.js
 * Exclusively Supporting: English (en) & Persian/Dari (fa) with RTL/LTR
 * Completely synced with adm_db & admin.py API endpoints
 * ============================================================================
 */

(function () {
    "use strict";

    // -------------------------------------------------------------------------
    // 1. Two-Language Dictionary (English & Persian)
    // -------------------------------------------------------------------------
    const i18n = {
        en: {
            menu_main: "MAIN NAVIGATION",
            menu_system: "SYSTEM AUTOMATION",
            tab_overview: "Dashboard Overview",
            tab_users: "User Management",
            tab_finance: "Finance & Approvals",
            tab_kyc: "KYC Verifications",
            tab_yield: "Daily Yield Engine",
            tab_support: "Support Desk",
            engine_active: "Engine Active",
            logout: "Back to Dashboard",
            header_subtitle: "Real-time system health & balance metrics",
            stat_total_capital: "Total Circulating Capital",
            stat_active_locked: "Locked & Working in Lots",
            stat_total_profit: "Total Profit Distributed",
            stat_accumulated: "Lifetime yield payouts",
            stat_registered_users: "Registered Investors",
            stat_pending_actions: "Pending Requests",
            yield_engine_head: "Automated Nightly Yield Engine (21:00 UTC+4:30)",
            yield_engine_desc: "Daily yield targets between 0.8% and 1.3%. System executes automatic batch profit allocation for verified users having >= $50 active capital.",
            btn_instant_distribute: "Distribute Today's Yield",
            recent_transactions: "Live Transaction Stream",
            refresh: "Refresh",
            col_txid: "TX ID",
            col_user: "User / Identity",
            col_type: "Type",
            col_amount: "Amount",
            col_network: "Network",
            col_status: "Status",
            col_date: "Date & Time",
            col_active_capital: "Active Capital",
            col_profit_balance: "Withdrawable Profit",
            col_kyc: "KYC",
            col_created: "Registered",
            col_actions: "Actions",
            filter_all_roles: "All Roles",
            filter_all_kyc: "All KYC Statuses",
            sub_pending_withdrawals: "Pending Withdrawals",
            sub_pending_deposits: "Pending Deposits",
            sub_finance_history: "Financial Log History",
            withdrawals_title: "Pending Withdrawal Requests",
            withdrawals_subtitle: "Verify destination wallet address, selected blockchain network, and last action cooldown tier before approving payout.",
            col_dest_address: "Destination Wallet Address",
            col_requested_amount: "Amount",
            col_cooldown_tier: "Cooldown & Fee Tier",
            col_net_payout: "Net to Send",
            deposits_title: "Manual / On-Chain Deposit Verification",
            deposits_subtitle: "Confirm incoming USDT hash on blockchain explorer before locking as a 90-day investment lot.",
            col_txhash: "Transaction Hash (TXID)",
            col_fee: "Fee",
            col_note: "Admin Note",
            kyc_desk_title: "Identity Verification Desk",
            kyc_desk_subtitle: "KYC approval unlocks daily yield allocation and referral commission participation.",
            col_doc_type: "Document Type",
            col_doc_number: "Document Number",
            col_front_view: "Front View",
            col_back_view: "Back View",
            yield_config_title: "Today's Profit Configuration",
            label_daily_rate: "Daily Profit Percentage (%)",
            yield_range_hint: "Standard boundary: 0.8000% to 1.3000% (approx ~31% monthly compounded).",
            label_target_date: "Application Date",
            engine_rules_title: "Eligibility & Cap Validation:",
            rule_kyc_50: "Only users with Verified KYC and Active Capital >= $50.00 receive profit.",
            rule_mlm_cap: "Referral commissions (L1: 10%, L2: 5%, L3: 3%, L4: 2%, L5: 1%) are strictly capped by the Leader's active capital.",
            btn_save_rate: "Save Rate Preset",
            btn_distribute_now: "Distribute Now",
            yield_monitor_title: "Engine Real-Time Monitor",
            metric_today_rate: "Today's Active Rate:",
            metric_today_distributed: "Distributed Today:",
            metric_next_run: "Scheduled Execution:",
            metric_eligible_users: "Estimated Beneficiaries:",
            yield_history_title: "Daily Rate Execution Log",
            col_rate: "Yield Rate (%)",
            col_distributed: "Distributed?",
            col_execution_time: "Execution Timestamp",
            support_tickets_title: "Support Tickets",
            filter_all: "All Tickets",
            filter_pending: "Pending / Open",
            filter_answered: "Answered",
            filter_closed: "Closed",
            loading_tickets: "Loading support inquiries...",
            ticket_select_prompt: "Select a support ticket to start conversation",
            ticket_select_sub: "Direct replies from this panel are pushed straight to the user's dashboard profile.",
            btn_close_ticket: "Close Ticket",
            reply_as_admin: "Sending as: ADM Official Support",
            btn_send_reply: "Send Reply",
            modal_adjust_balance: "Manual Balance Adjustment",
            label_action_type: "Adjustment Mode",
            opt_credit: "Credit (+) Add Funds",
            opt_debit: "Debit (-) Deduct Funds",
            label_balance_target: "Target Balance Bucket",
            bucket_capital: "Total Active Capital",
            bucket_locked: "Locked Principal",
            bucket_unlocked: "Unlocked Principal",
            bucket_profit: "Withdrawable Profit",
            bucket_lifetime: "Total Lifetime Profit",
            label_adjust_amount: "Amount (USD)",
            label_admin_reason: "Reason / Audit Memo",
            cancel: "Cancel",
            btn_confirm_adjust: "Apply Adjustment",
            modal_reject_withdrawal: "Reject Withdrawal & Refund Balance",
            reject_warning_text: "Rejecting this payout will immediately refund the full requested amount back to the user's withdrawable balance.",
            label_rejection_reason: "Rejection Reason (Visible to user)",
            btn_confirm_reject: "Confirm Rejection",
            modal_inspect_kyc: "Inspect Identity Documents",
            label_kyc_note: "Verification Note (Included in rejection notification):",
            btn_reject: "Reject Document",
            btn_approve: "Approve & Verify User",
            loading_data: "Loading data from server...",
            no_records: "No records found in this category.",
            msg_copied: "Address copied to clipboard!",
            msg_operation_success: "Operation executed successfully."
        },
        fa: {
            menu_main: "ناوبری اصلی",
            menu_system: "اتوماسیون سیستمی",
            tab_overview: "داشبورد عمومی",
            tab_users: "مدیریت کاربران",
            tab_finance: "امور مالی و تاییدها",
            tab_kyc: "تایید مدارک هویت (KYC)",
            tab_yield: "موتور سود روزانه",
            tab_support: "میز پشتیبانی و تیکت‌ها",
            engine_active: "موتور فعال است",
            logout: "بازگشت به داشبورد",
            header_subtitle: "پایش لحظه‌ای سلامت سیستم، سرمایه در گردش و سودها",
            stat_total_capital: "کل سرمایه فعال در گردش",
            stat_active_locked: "قفل‌شده در لات‌های ۹۰ روزه",
            stat_total_profit: "کل سود واریزشده تا کنون",
            stat_accumulated: "پرداخت قطعی به کاربران",
            stat_registered_users: "کل کاربران ثبت‌نامی",
            stat_pending_actions: "درخواست‌های در انتظار",
            yield_engine_head: "موتور هوشمند توزیع سود شبانه (ساعت ۲۱:۰۰ به وقت افغانستان)",
            yield_engine_desc: "نرخ روزانه بین ۰.۸٪ تا ۱.۳٪ تنظیم می‌شود. واریز خودکار فقط برای کاربران دارای احراز هویت تاییدشده و سرمایه فعال ۵۰ دلار یا بیشتر اعمال می‌گردد.",
            btn_instant_distribute: "توزیع فوری سود امروز",
            recent_transactions: "جریان زنده آخرین تراکنش‌ها",
            refresh: "بروزرسانی",
            col_txid: "شناسه تراکنش",
            col_user: "کاربر / مشخصات",
            col_type: "نوع عملیات",
            col_amount: "مبلغ",
            col_network: "شبکه بلاکچین",
            col_status: "وضعیت",
            col_date: "تاریخ و ساعت",
            col_active_capital: "سرمایه فعال",
            col_profit_balance: "سود قابل برداشت",
            col_kyc: "احراز هویت",
            col_created: "تاریخ عضویت",
            col_actions: "عملیات",
            filter_all_roles: "تمام نقش‌ها",
            filter_all_kyc: "تمام وضعیت‌های KYC",
            sub_pending_withdrawals: "برداشت‌های معلق",
            sub_pending_deposits: "واریزهای در انتظار",
            sub_finance_history: "تاریخچه کامل مالی",
            withdrawals_title: "درخواست‌های برداشت در انتظار تایید",
            withdrawals_subtitle: "آدرس کیف‌پول کاربر، شبکه انتقال، و فاصله زمانی آخرین عملیات را پیش از تایید دقیقاً بررسی نمایید.",
            col_dest_address: "آدرس کیف‌پول مقصد",
            col_requested_amount: "مبلغ درخواستی",
            col_cooldown_tier: "فاصله روزها و پله کارمزد",
            col_net_payout: "خالص واریزی",
            deposits_title: "بررسی و تایید واریزهای ارزی",
            deposits_subtitle: "تایید هش تراکنش (TXID) روی اکسپلورر شبکه قبل از فعال‌سازی لات ۹۰ روزه سرمایه‌گذاری.",
            col_txhash: "هش تراکنش (TXID)",
            col_fee: "کارمزد",
            col_note: "یادداشت مدیر",
            kyc_desk_title: "میز اعتبارسنجی اسناد هویتی",
            kyc_desk_subtitle: "تایید هویت، کاربر را مجاز به دریافت سود روزانه ساعت ۲۱:۰۰ و کمیسیون‌های تیمی شبکه می‌نماید.",
            col_doc_type: "نوع مدرک",
            col_doc_number: "شماره مدرک",
            col_front_view: "تصویر روی مدرک",
            col_back_view: "تصویر پشت مدرک",
            yield_config_title: "تنظیم نرخ سود روزانه پلتفرم",
            label_daily_rate: "درصد سود امروز (%)",
            yield_range_hint: "دامنه مجاز: ۰.۸۰۰۰٪ تا ۱.۳۰۰۰٪ (مجموعاً حدود ۳۱٪ در ماه)",
            label_target_date: "تاریخ اعمال سود",
            engine_rules_title: "قوانین طلایی صلاحیت و سقف لیدر:",
            rule_kyc_50: "تنها کاربران احراز هویت شده (Verified) با سرمایه فعال حداقل ۵۰ دلار سود دریافت می‌کنند.",
            rule_mlm_cap: "پورسانت‌های تیمی ۵ نسل طبق قانون سقف سرمایه لیدر بر مبنای min(downline_profit, leader_capital) محدود می‌گردد.",
            btn_save_rate: "ذخیره پیش‌نویس نرخ",
            btn_distribute_now: "توزیع آنی سود",
            yield_monitor_title: "پایشگر وضعیت موتور سود",
            metric_today_rate: "نرخ سود امروز:",
            metric_today_distributed: "واریز شده امروز؟",
            metric_next_run: "زمان اجرای برنامه‌ریزی‌شده:",
            metric_eligible_users: "تعداد کاربران واجد شرایط:",
            yield_history_title: "سیاهه نرخ‌ها و توزیع‌های گذشته",
            col_rate: "نرخ سود (%)",
            col_distributed: "توزیع شد؟",
            col_execution_time: "زمان دقیق اجرا",
            support_tickets_title: "تیکت‌های پشتیبانی کاربران",
            filter_all: "تمام تیکت‌ها",
            filter_pending: "در انتظار پاسخ",
            filter_answered: "پاسخ داده شده",
            filter_closed: "بسته شده",
            loading_tickets: "در حال دریافت پیام‌های پشتیبانی...",
            ticket_select_prompt: "جهت آغاز مکالمه یک تیکت را از لیست انتخاب کنید",
            ticket_select_sub: "پاسخ ارسالی شما فوراً در بخش پروفایل کاربر نمایش داده خواهد شد.",
            btn_close_ticket: "بستن تیکت",
            reply_as_admin: "ارسال به عنوان: تیم پشتیبانی رسمی ADM",
            btn_send_reply: "ارسال پاسخ",
            modal_adjust_balance: "تنظیم دستی موجودی کاربر",
            label_action_type: "نوع عملیات",
            opt_credit: "افزایش موجودی (+ شارژ)",
            opt_debit: "کاهش موجودی (- کسر)",
            label_balance_target: "موجودی هدف",
            bucket_capital: "کل سرمایه فعال (Active Capital)",
            bucket_locked: "اصل سرمایه قفل‌شده (Locked Principal)",
            bucket_unlocked: "اصل سرمایه آزادشده (Unlocked Principal)",
            bucket_profit: "سود قابل برداشت (Withdrawable Profit)",
            bucket_lifetime: "مجموع کل سودهای دریافتی (Total Lifetime Profit)",
            label_adjust_amount: "مبلغ به دلار (USD)",
            label_admin_reason: "دلیل تغییر / شرح حسابرسی",
            cancel: "انصراف",
            btn_confirm_adjust: "اعمال تغییرات",
            modal_reject_withdrawal: "رد درخواست برداشت و بازگشت وجه",
            reject_warning_text: "با رد این درخواست، مبلغ کسر شده به صورت آنی به موجودی قابل برداشت کاربر بازگردانده می‌شود.",
            label_rejection_reason: "علت رد درخواست (نمایش به کاربر)",
            btn_confirm_reject: "تایید رد درخواست",
            modal_inspect_kyc: "بررسی دقیق مدارک هویتی",
            label_kyc_note: "یادداشت مدیر (در صورت رد برای کاربر ارسال می‌شود):",
            btn_reject: "رد مدارک",
            btn_approve: "تایید و احراز هویت",
            loading_data: "در حال دریافت اطلاعات از سرور...",
            no_records: "رکوردی در این بخش وجود ندارد.",
            msg_copied: "آدرس در حافظه کپی شد!",
            msg_operation_success: "عملیات با موفقیت انجام شد."
        }
    };

    let currentLang = localStorage.getItem("adm_admin_lang") || "en";
    let activeTicketId = null;

    // تابع تبدیل خودکار ارقام فارسی/عربی به انگلیسی و پشتیبانی از تایپ آزاد اعشاری
    function normalizeAmountInput(val) {
        if (!val) return "";
        return String(val)
            .replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
            .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
            .replace(/[،,٫]/g, ".")
            .trim();
    }

    // -------------------------------------------------------------------------
    // 2. Initialization and Language Management (EN & FA Only)
    // -------------------------------------------------------------------------
    document.addEventListener("DOMContentLoaded", function () {
        initLanguage();
        initNavigation();
        initLiveClock();
        bindGlobalEvents();

        // Initial Data Fetching
        loadOverviewMetrics();
        loadLiveTransactions();
        loadPendingCounters();
    });

    function initLanguage() {
        const langMenu = document.getElementById("langMenu");
        if (langMenu) {
            langMenu.innerHTML = `
                <div class="dropdown-item" data-lang="en"><span>🇺🇸</span> English (LTR)</div>
                <div class="dropdown-item" data-lang="fa"><span>🇦🇫</span> دری / فارسی (RTL)</div>
            `;
            langMenu.querySelectorAll(".dropdown-item").forEach(item => {
                item.addEventListener("click", function () {
                    const selected = this.getAttribute("data-lang");
                    setLanguage(selected);
                    langMenu.classList.remove("show");
                });
            });
        }

        const langBtn = document.getElementById("langBtn");
        if (langBtn) {
            langBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                langMenu.classList.toggle("show");
            });
        }

        document.addEventListener("click", function () {
            if (langMenu) langMenu.classList.remove("show");
        });

        setLanguage(currentLang);
    }

    function setLanguage(lang) {
        if (!i18n[lang]) lang = "en";
        currentLang = lang;
        localStorage.setItem("adm_admin_lang", lang);

        const isRtl = lang === "fa";
        document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
        document.documentElement.setAttribute("lang", lang);
        document.body.setAttribute("dir", isRtl ? "rtl" : "ltr");

        const flagEl = document.getElementById("currentFlag");
        const labelEl = document.getElementById("currentLangLabel");
        if (flagEl) flagEl.textContent = isRtl ? "🇦🇫" : "🇺🇸";
        if (labelEl) labelEl.textContent = isRtl ? "دری / فارسی" : "English";

        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (i18n[lang][key]) {
                if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                    el.placeholder = i18n[lang][key];
                } else {
                    el.textContent = i18n[lang][key];
                }
            }
        });
    }

    function t(key) {
        return (i18n[currentLang] && i18n[currentLang][key]) ? i18n[currentLang][key] : key;
    }

    // -------------------------------------------------------------------------
    // 3. Navigation & Tab Management
    // -------------------------------------------------------------------------
    function initNavigation() {
        const menuItems = document.querySelectorAll(".sidebar-menu .menu-item");
        menuItems.forEach(item => {
            item.addEventListener("click", function (e) {
                e.preventDefault();
                menuItems.forEach(m => m.classList.remove("active"));
                this.classList.add("active");

                const targetTab = this.getAttribute("data-tab");
                switchTab(targetTab);

                document.getElementById("adminSidebar").classList.remove("mobile-open");
            });
        });

        const toggleBtn = document.getElementById("mobileSidebarToggle");
        const closeBtn = document.getElementById("mobileSidebarClose");
        const sidebar = document.getElementById("adminSidebar");

        if (toggleBtn) toggleBtn.addEventListener("click", () => sidebar.classList.add("mobile-open"));
        if (closeBtn) closeBtn.addEventListener("click", () => sidebar.classList.remove("mobile-open"));

        const subNavBtns = document.querySelectorAll(".pane-sub-nav .sub-nav-btn");
        subNavBtns.forEach(btn => {
            btn.addEventListener("click", function () {
                subNavBtns.forEach(b => b.classList.remove("active"));
                this.classList.add("active");

                const sub = this.getAttribute("data-sub");
                document.querySelectorAll(".sub-view-pane").forEach(pane => pane.classList.remove("active"));
                const target = document.getElementById(`subview-${sub}`);
                if (target) target.classList.add("active");

                if (sub === "withdrawals") loadPendingWithdrawals();
                if (sub === "deposits") loadPendingDeposits();
                if (sub === "completed") loadFinanceHistory();
            });
        });
    }

    function switchTab(tabId) {
        document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
        const targetPane = document.getElementById(`pane-${tabId}`);
        if (targetPane) targetPane.classList.add("active");

        const titleMap = {
            overview: "tab_overview",
            users: "tab_users",
            finance: "tab_finance",
            kyc: "tab_kyc",
            yield: "tab_yield",
            support: "tab_support"
        };
        const titleEl = document.getElementById("pageSectionTitle");
        if (titleEl && titleMap[tabId]) {
            titleEl.setAttribute("data-i18n", titleMap[tabId]);
            titleEl.textContent = t(titleMap[tabId]);
        }

        if (tabId === "overview") { loadOverviewMetrics(); loadLiveTransactions(); }
        else if (tabId === "users") loadUsers();
        else if (tabId === "finance") loadPendingWithdrawals();
        else if (tabId === "kyc") loadPendingKYC();
        else if (tabId === "yield") loadYieldEngineData();
        else if (tabId === "support") loadTickets();
    }

    // -------------------------------------------------------------------------
    // 4. Afghanistan Live Clock (UTC+4:30)
    // -------------------------------------------------------------------------
    function initLiveClock() {
        const clockEl = document.getElementById("serverClock");
        setInterval(() => {
            const now = new Date();
            const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
            const afghanTime = new Date(utcTime + (4.5 * 3600000));
            const hours = String(afghanTime.getHours()).padStart(2, '0');
            const minutes = String(afghanTime.getMinutes()).padStart(2, '0');
            const seconds = String(afghanTime.getSeconds()).padStart(2, '0');
            if (clockEl) clockEl.textContent = `${hours}:${minutes}:${seconds} (UTC+4:30)`;
        }, 1000);
    }

    // -------------------------------------------------------------------------
    // 5. Overview Metrics & Live Transactions
    // -------------------------------------------------------------------------
    async function loadOverviewMetrics() {
        try {
            const res = await fetch("/api/admin/overview", { credentials: "include" });
            const data = await res.json();
            if (data.success) {
                document.getElementById("statTotalCapital").textContent = `$${parseFloat(data.stats.total_circulating_capital || 0).toFixed(4)}`;
                document.getElementById("statTotalProfit").textContent = `$${parseFloat(data.stats.total_profit_distributed || 0).toFixed(4)}`;
                document.getElementById("statTotalUsers").textContent = data.stats.total_users || 0;
                document.getElementById("statActiveUsers").textContent = `${data.stats.active_verified_investors || 0} ${currentLang === 'fa' ? 'سرمایه‌گذار تاییدشده' : 'Verified Investors'}`;
                
                const pendingTotal = (data.stats.pending_withdrawals_count || 0) + (data.stats.pending_kyc_count || 0);
                document.getElementById("statPendingActionsTotal").textContent = pendingTotal;
                document.getElementById("statPendingWithdrawCount").textContent = `${data.stats.pending_withdrawals_count || 0} ${currentLang === 'fa' ? 'برداشت معلق' : 'Withdrawals'}`;
                document.getElementById("statPendingKycCount").textContent = `${data.stats.pending_kyc_count || 0} KYC`;
            }
        } catch (err) {
            console.error("Overview error:", err);
        }
    }

    async function loadLiveTransactions() {
        const tbody = document.getElementById("liveStreamTableBody");
        try {
            const res = await fetch("/api/admin/transactions/live", { credentials: "include" });
            const data = await res.json();
            if (data.success && data.transactions && data.transactions.length > 0) {
                tbody.innerHTML = data.transactions.map(tx => `
                    <tr>
                        <td><span class="font-bold text-gold">${escapeHtml(tx.tx_id)}</span></td>
                        <td>${escapeHtml(tx.username || '')} <small class="text-muted">(${escapeHtml(tx.uid || '')})</small></td>
                        <td>${renderTxTypeBadge(tx.type)}</td>
                        <td class="font-bold">$${parseFloat(tx.amount).toFixed(4)}</td>
                        <td>${renderNetworkBadge(tx.network)}</td>
                        <td>${renderStatusBadge(tx.status)}</td>
                        <td>${formatDate(tx.created_at)}</td>
                    </tr>
                `).join("");
            } else {
                tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">${t('no_records')}</td></tr>`;
            }
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-danger">Failed to load transactions.</td></tr>`;
        }
    }

    async function loadPendingCounters() {
        try {
            const res = await fetch("/api/admin/counters", { credentials: "include" });
            const data = await res.json();
            if (data.success) {
                const fwCount = document.getElementById("badgePendingFinance");
                const kycCount = document.getElementById("badgePendingKYC");
                const tixCount = document.getElementById("badgePendingTickets");

                const totalFinance = (data.counters.pending_withdrawals || 0) + (data.counters.pending_deposits || 0);
                if (fwCount) fwCount.textContent = totalFinance;
                if (kycCount) kycCount.textContent = data.counters.pending_kyc || 0;
                if (tixCount) tixCount.textContent = data.counters.pending_tickets || 0;

                const countWSub = document.getElementById("countWithdrawSub");
                const countDSub = document.getElementById("countDepositSub");
                if (countWSub) countWSub.textContent = data.counters.pending_withdrawals || 0;
                if (countDSub) countDSub.textContent = data.counters.pending_deposits || 0;
            }
        } catch (e) {
            console.warn("Counters error:", e);
        }
    }

    // -------------------------------------------------------------------------
    // 6. User Management
    // -------------------------------------------------------------------------
    async function loadUsers() {
        const tbody = document.getElementById("usersTableBody");
        const query = document.getElementById("userSearchInput") ? document.getElementById("userSearchInput").value.trim() : "";
        const role = document.getElementById("filterUserRole") ? document.getElementById("filterUserRole").value : "";
        const kyc = document.getElementById("filterUserKyc") ? document.getElementById("filterUserKyc").value : "";

        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">${t('loading_data')}</td></tr>`;

        try {
            const url = `/api/admin/users?q=${encodeURIComponent(query)}&role=${encodeURIComponent(role)}&kyc=${encodeURIComponent(kyc)}`;
            const res = await fetch(url, { credentials: "include" });
            const data = await res.json();

            if (data.success && data.users && data.users.length > 0) {
                tbody.innerHTML = data.users.map(u => {
                    const locked = parseFloat(u.locked_principal || 0).toFixed(2);
                    const unlocked = parseFloat(u.unlocked_principal || 0).toFixed(2);
                    const totalCap = parseFloat(u.active_capital || 0).toFixed(4);

                    return `
                    <tr>
                        <td class="font-bold text-gold">${escapeHtml(u.uid)}</td>
                        <td>
                            <div><strong>${escapeHtml(u.username)}</strong></div>
                            <small class="text-muted">${escapeHtml(u.email || u.phone || '')}</small>
                        </td>
                        <td>
                            <div class="font-bold">$${totalCap}</div>
                            <small class="text-muted" style="font-size:10.5px;">قفل: $${locked} | آزاد: $${unlocked}</small>
                        </td>
                        <td class="font-bold text-success">$${parseFloat(u.withdrawable_profit || 0).toFixed(4)}</td>
                        <td>${renderKycBadge(u.kyc_status)}</td>
                        <td>${renderUserStatusBadge(u.status)}</td>
                        <td>${formatDate(u.created_at)}</td>
                        <td>
                            <div class="card-actions">
                                <button class="adm-btn btn-secondary btn-sm" onclick="window.AdminApp.openBalanceModal(${u.id}, '${escapeHtml(u.username)}', '${u.uid}')">&plusmn; Balance</button>
                                <button class="adm-btn btn-secondary btn-sm" onclick="window.AdminApp.toggleUserRole(${u.id}, '${u.role}')">${u.role === 'admin' ? 'Demote' : 'Make Admin'}</button>
                                <button class="adm-btn btn-danger btn-sm" onclick="window.AdminApp.toggleUserStatus(${u.id}, '${u.status}')">${u.status === 'banned' ? 'Unban' : 'Ban'}</button>
                            </div>
                        </td>
                    </tr>
                `;
                }).join("");
            } else {
                tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">${t('no_records')}</td></tr>`;
            }
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-danger">Error loading users.</td></tr>`;
        }
    }

    // -------------------------------------------------------------------------
    // 7. Finance & Approvals (Withdrawals, Deposits, Logs)
    // -------------------------------------------------------------------------
    async function loadPendingWithdrawals() {
        const tbody = document.getElementById("pendingWithdrawalsBody");
        tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted">${t('loading_data')}</td></tr>`;

        try {
            const res = await fetch("/api/admin/withdrawals/pending", { credentials: "include" });
            const data = await res.json();

            if (data.success && data.withdrawals && data.withdrawals.length > 0) {
                tbody.innerHTML = data.withdrawals.map(w => {
                    const days = parseInt(w.days_since_last_action || 0);
                    const tierInfo = evaluateFeeTier(days);
                    const destAddr = w.dest_address || '---';

                    return `
                        <tr>
                            <td><span class="font-bold text-gold">${escapeHtml(w.tx_id)}</span></td>
                            <td>
                                <div><strong>${escapeHtml(w.username)}</strong></div>
                                <small class="text-muted">UID: ${escapeHtml(w.uid)}</small>
                            </td>
                            <td><span class="badge-status badge-info">${escapeHtml(w.type)}</span></td>
                            <td>${renderNetworkBadge(w.network)}</td>
                            <td>
                                <div class="address-chip" title="${escapeHtml(destAddr)}">
                                    <span>${escapeHtml(destAddr)}</span>
                                    <button class="copy-icon-btn" onclick="window.AdminApp.copyText('${escapeHtml(destAddr)}')">
                                        <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                                    </button>
                                </div>
                            </td>
                            <td class="font-bold">$${parseFloat(w.amount).toFixed(4)}</td>
                            <td>
                                <div class="fee-tier-pill">
                                    <span class="fee-tier-badge ${tierInfo.cssClass}">${tierInfo.label}</span>
                                    <span class="cooldown-days-label">${days} ${currentLang === 'fa' ? 'روز گذشته' : 'days elapsed'}</span>
                                </div>
                            </td>
                            <td class="font-bold text-success">$${parseFloat(w.net_amount).toFixed(4)}</td>
                            <td>
                                <div class="card-actions">
                                    <button class="adm-btn btn-success btn-sm" onclick="window.AdminApp.approveWithdrawal('${w.tx_id}')">Approve</button>
                                    <button class="adm-btn btn-danger btn-sm" onclick="window.AdminApp.openRejectModal('${w.tx_id}')">Reject</button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join("");
            } else {
                tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted">${t('no_records')}</td></tr>`;
            }
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-danger">Failed to load withdrawals.</td></tr>`;
        }
    }

    function evaluateFeeTier(days) {
        if (days < 10) {
            return {
                label: currentLang === 'fa' ? 'مسدود (زیر ۱۰ روز)' : 'Blocked (< 10 Days)',
                cssClass: 'tier-danger'
            };
        } else if (days >= 10 && days < 15) {
            return {
                label: currentLang === 'fa' ? 'پله ۵٪ کارمزد' : '5% Fee Tier',
                cssClass: 'tier-orange'
            };
        } else if (days >= 15 && days < 25) {
            return {
                label: currentLang === 'fa' ? 'پله ۳٪ کارمزد' : '3% Fee Tier',
                cssClass: 'tier-yellow'
            };
        } else if (days >= 25 && days < 35) {
            return {
                label: currentLang === 'fa' ? 'پله ۱٪ کارمزد' : '1% Fee Tier',
                cssClass: 'tier-blue'
            };
        } else if (days >= 35 && days <= 50) {
            return {
                label: currentLang === 'fa' ? 'پله ۰٪ (رایگان)' : '0% Free Tier',
                cssClass: 'tier-free'
            };
        } else {
            return {
                label: currentLang === 'fa' ? '۰٪ + ۳٪ بانس پاداش' : '0% + 3% Bonus',
                cssClass: 'tier-bonus'
            };
        }
    }

    async function loadPendingDeposits() {
        const tbody = document.getElementById("pendingDepositsBody");
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">${t('loading_data')}</td></tr>`;

        try {
            const res = await fetch("/api/admin/deposits/pending", { credentials: "include" });
            const data = await res.json();

            if (data.success && data.deposits && data.deposits.length > 0) {
                tbody.innerHTML = data.deposits.map(d => `
                    <tr>
                        <td><span class="font-bold text-gold">${escapeHtml(d.tx_id)}</span></td>
                        <td>${escapeHtml(d.username)} <small class="text-muted">(${escapeHtml(d.uid)})</small></td>
                        <td class="font-bold text-success">$${parseFloat(d.amount).toFixed(4)}</td>
                        <td>${renderNetworkBadge(d.network)}</td>
                        <td>
                            <div class="address-chip" title="${escapeHtml(d.tx_hash || 'N/A')}">
                                <span>${escapeHtml(d.tx_hash || 'No Hash')}</span>
                                ${d.tx_hash ? `
                                    <button class="copy-icon-btn" onclick="window.AdminApp.copyText('${escapeHtml(d.tx_hash)}')">
                                        <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                                    </button>
                                ` : ''}
                            </div>
                        </td>
                        <td>${formatDate(d.created_at)}</td>
                        <td>
                            <div class="card-actions">
                                <button class="adm-btn btn-success btn-sm" onclick="window.AdminApp.approveDeposit('${d.tx_id}')">Approve Lot</button>
                                <button class="adm-btn btn-danger btn-sm" onclick="window.AdminApp.rejectDeposit('${d.tx_id}')">Reject</button>
                            </div>
                        </td>
                    </tr>
                `).join("");
            } else {
                tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">${t('no_records')}</td></tr>`;
            }
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-danger">Failed to load deposits.</td></tr>`;
        }
    }

    async function loadFinanceHistory() {
        const tbody = document.getElementById("financeHistoryBody");
        tbody.innerHTML = `<tr><td colspan="10" class="text-center py-4 text-muted">${t('loading_data')}</td></tr>`;

        try {
            const res = await fetch("/api/admin/finance/history", { credentials: "include" });
            const data = await res.json();

            if (data.success && data.history && data.history.length > 0) {
                tbody.innerHTML = data.history.map(h => `
                    <tr>
                        <td class="font-bold text-gold">${escapeHtml(h.tx_id)}</td>
                        <td>${escapeHtml(h.username)} <small class="text-muted">(${escapeHtml(h.uid)})</small></td>
                        <td>${renderTxTypeBadge(h.type)}</td>
                        <td class="font-bold">$${parseFloat(h.amount).toFixed(4)}</td>
                        <td class="text-danger">$${parseFloat(h.fee || 0).toFixed(4)}</td>
                        <td class="font-bold text-success">$${parseFloat(h.net_amount).toFixed(4)}</td>
                        <td>${renderNetworkBadge(h.network)}</td>
                        <td>${renderStatusBadge(h.status)}</td>
                        <td><small class="text-muted">${escapeHtml(h.admin_note || '---')}</small></td>
                        <td>${formatDate(h.updated_at || h.created_at)}</td>
                    </tr>
                `).join("");
            } else {
                tbody.innerHTML = `<tr><td colspan="10" class="text-center py-4 text-muted">${t('no_records')}</td></tr>`;
            }
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="10" class="text-center py-4 text-danger">Failed to load finance history.</td></tr>`;
        }
    }

    // -------------------------------------------------------------------------
    // 8. KYC Verifications
    // -------------------------------------------------------------------------
    async function loadPendingKYC() {
        const tbody = document.getElementById("kycTableBody");
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">${t('loading_data')}</td></tr>`;

        try {
            const res = await fetch("/api/admin/kyc/pending", { credentials: "include" });
            const data = await res.json();

            if (data.success && data.kyc_records && data.kyc_records.length > 0) {
                tbody.innerHTML = data.kyc_records.map((k, idx) => `
                    <tr>
                        <td>${idx + 1}</td>
                        <td>
                            <div><strong>${escapeHtml(k.username)}</strong></div>
                            <small class="text-muted">UID: ${escapeHtml(k.uid)} | ${escapeHtml(k.email || '')}</small>
                        </td>
                        <td><span class="badge-status badge-info">${escapeHtml(k.doc_type)}</span></td>
                        <td class="font-bold">${escapeHtml(k.doc_number)}</td>
                        <td>
                            <img src="${escapeHtml(k.front_image_path)}" class="kyc-thumb-img" alt="Front" onclick="window.AdminApp.inspectKyc(${JSON.stringify(k).replace(/"/g, '&quot;')})">
                        </td>
                        <td>
                            ${k.back_image_path ? `
                                <img src="${escapeHtml(k.back_image_path)}" class="kyc-thumb-img" alt="Back" onclick="window.AdminApp.inspectKyc(${JSON.stringify(k).replace(/"/g, '&quot;')})">
                            ` : '<span class="text-muted">N/A</span>'}
                        </td>
                        <td>${formatDate(k.submitted_at)}</td>
                        <td>
                            <button class="adm-btn btn-primary btn-sm" onclick="window.AdminApp.inspectKyc(${JSON.stringify(k).replace(/"/g, '&quot;')})">Inspect & Decide</button>
                        </td>
                    </tr>
                `).join("");
            } else {
                tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">${t('no_records')}</td></tr>`;
            }
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-danger">Failed to load KYC verifications.</td></tr>`;
        }
    }

    // -------------------------------------------------------------------------
    // 9. Daily Yield Engine
    // -------------------------------------------------------------------------
    async function loadYieldEngineData() {
        try {
            const res = await fetch("/api/admin/yield/status", { credentials: "include" });
            const data = await res.json();

            if (data.success) {
                const todayRate = parseFloat(data.today_rate || 0);
                const rateInput = document.getElementById("yieldInputRate");
                const dateInput = document.getElementById("yieldTargetDate");

                if (rateInput && !rateInput.value && todayRate > 0) {
                    rateInput.value = (todayRate * 100).toFixed(4);
                }
                if (dateInput) {
                    dateInput.value = data.today_date || new Date().toISOString().split('T')[0];
                }

                document.getElementById("monitorTodayRate").textContent = `${(todayRate * 100).toFixed(4)}%`;
                const distStatus = document.getElementById("monitorTodayStatus");
                if (distStatus) {
                    distStatus.textContent = data.is_distributed ? (currentLang === 'fa' ? 'بله، واریز شد' : 'YES, COMPLETED') : (currentLang === 'fa' ? 'خیر، در انتظار ساعت ۲۱:۰۰' : 'NO, PENDING');
                    distStatus.className = `metric-state ${data.is_distributed ? 'text-success' : 'text-danger'}`;
                }

                document.getElementById("monitorEligibleUsers").textContent = `${data.eligible_users_count || 0} ${currentLang === 'fa' ? 'کاربر واجد شرایط' : 'Eligible Users'}`;

                const tbody = document.getElementById("yieldHistoryBody");
                if (data.history && data.history.length > 0) {
                    tbody.innerHTML = data.history.map((h, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${formatDate(h.yield_date, true)}</td>
                            <td class="font-bold text-gold">${(parseFloat(h.rate_percent) * 100).toFixed(4)}%</td>
                            <td>${h.is_distributed ? '<span class="badge-status badge-success">YES</span>' : '<span class="badge-status badge-warning">PENDING</span>'}</td>
                            <td>${h.distributed_at ? formatDate(h.distributed_at) : '---'}</td>
                        </tr>
                    `).join("");
                } else {
                    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">${t('no_records')}</td></tr>`;
                }
            }
        } catch (err) {
            console.error("Yield engine error:", err);
        }
    }

    // -------------------------------------------------------------------------
    // 10. Support Desk
    // -------------------------------------------------------------------------
    async function loadTickets() {
        const container = document.getElementById("ticketsContainer");
        const filterStatus = document.getElementById("filterTicketStatus") ? document.getElementById("filterTicketStatus").value : "";
        container.innerHTML = `<div class="text-center py-4 text-muted">${t('loading_tickets')}</div>`;

        try {
            const res = await fetch(`/api/admin/tickets?status=${encodeURIComponent(filterStatus)}`, { credentials: "include" });
            const data = await res.json();

            if (data.success && data.tickets && data.tickets.length > 0) {
                container.innerHTML = data.tickets.map(tk => `
                    <div class="ticket-item-row ${activeTicketId === tk.id ? 'active' : ''}" onclick="window.AdminApp.openTicketConversation(${tk.id})">
                        <div class="ticket-row-header">
                            <span class="ticket-number-tag">${escapeHtml(tk.ticket_number)}</span>
                            ${renderTicketStatusBadge(tk.status)}
                        </div>
                        <div class="ticket-row-subject">${escapeHtml(tk.subject)}</div>
                        <div class="ticket-row-meta">
                            <span>UID: ${escapeHtml(tk.uid)}</span>
                            <span>${formatDate(tk.created_at, true)}</span>
                        </div>
                    </div>
                `).join("");
            } else {
                container.innerHTML = `<div class="text-center py-4 text-muted">${t('no_records')}</div>`;
            }
        } catch (err) {
            container.innerHTML = `<div class="text-center py-4 text-danger">Failed to load support tickets.</div>`;
        }
    }

    async function openTicketConversation(ticketId) {
        activeTicketId = ticketId;
        document.getElementById("ticketEmptyState").classList.add("hidden");
        const activeState = document.getElementById("ticketActiveState");
        activeState.classList.remove("hidden");

        document.querySelectorAll(".ticket-item-row").forEach(el => el.classList.remove("active"));

        try {
            const res = await fetch(`/api/admin/tickets/${ticketId}`, { credentials: "include" });
            const data = await res.json();

            if (data.success) {
                const tk = data.ticket;
                document.getElementById("activeTicketNumber").textContent = tk.ticket_number;
                document.getElementById("activeTicketCategory").textContent = tk.category;
                document.getElementById("activeTicketSubject").textContent = tk.subject;
                document.getElementById("activeTicketUserMeta").textContent = `${currentLang === 'fa' ? 'کاربر:' : 'User:'} ${tk.username} (UID: ${tk.uid}, Email: ${tk.email || 'N/A'})`;

                const chatBox = document.getElementById("ticketChatBox");
                chatBox.innerHTML = (data.replies || []).map(r => `
                    <div class="chat-bubble ${r.sender_role}">
                        <div class="bubble-text">${escapeHtml(r.message)}</div>
                        <div class="bubble-meta">
                            <span>${r.sender_role === 'admin' ? 'ADM Official Support' : escapeHtml(tk.username)}</span>
                            <span>${formatDate(r.created_at)}</span>
                        </div>
                    </div>
                `).join("");

                chatBox.scrollTop = chatBox.scrollHeight;
            }
        } catch (err) {
            showToast("Failed to load conversation", "error");
        }
    }

    // -------------------------------------------------------------------------
    // 11. Modal Logic & Form Submissions
    // -------------------------------------------------------------------------
    function bindGlobalEvents() {
        document.querySelectorAll("[data-close]").forEach(btn => {
            btn.addEventListener("click", function () {
                const targetId = this.getAttribute("data-close");
                closeModal(targetId);
            });
        });

        const searchInput = document.getElementById("userSearchInput");
        if (searchInput) searchInput.addEventListener("input", debounce(loadUsers, 400));
        const roleFilter = document.getElementById("filterUserRole");
        if (roleFilter) roleFilter.addEventListener("change", loadUsers);
        const kycFilter = document.getElementById("filterUserKyc");
        if (kycFilter) kycFilter.addEventListener("change", loadUsers);

        const ticketFilter = document.getElementById("filterTicketStatus");
        if (ticketFilter) ticketFilter.addEventListener("change", loadTickets);

        const btnRefLive = document.getElementById("btnRefreshLiveStream");
        if (btnRefLive) btnRefLive.addEventListener("click", () => { loadOverviewMetrics(); loadLiveTransactions(); });
        const btnRefW = document.getElementById("btnRefreshWithdrawals");
        if (btnRefW) btnRefW.addEventListener("click", loadPendingWithdrawals);
        const btnRefD = document.getElementById("btnRefreshDeposits");
        if (btnRefD) btnRefD.addEventListener("click", loadPendingDeposits);
        const btnRefH = document.getElementById("btnRefreshFinHistory");
        if (btnRefH) btnRefH.addEventListener("click", loadFinanceHistory);
        const btnRefKYC = document.getElementById("btnRefreshKYC");
        if (btnRefKYC) btnRefKYC.addEventListener("click", loadPendingKYC);

        // تنظیم دستی هر کدام از ۵ بخش مالی داشبورد با پذیرش تایپ دستی و عددی
        const formBal = document.getElementById("formBalanceAdjust");
        if (formBal) {
            formBal.addEventListener("submit", async function (e) {
                e.preventDefault();
                const userId = document.getElementById("adjustUserId").value;
                const mode = document.getElementById("adjustActionType").value;
                const bucket = document.getElementById("adjustTargetBucket").value;
                const rawAmount = document.getElementById("adjustAmount").value;
                const normalizedAmount = normalizeAmountInput(rawAmount);
                const amount = parseFloat(normalizedAmount);
                const reason = document.getElementById("adjustReason").value.trim();

                if (isNaN(amount) || amount <= 0) {
                    showToast(currentLang === 'fa' ? "لطفاً یک مبلغ عددی معتبر وارد کنید." : "Please enter a valid numeric amount.", "error");
                    return;
                }

                try {
                    const res = await fetch("/api/admin/users/adjust_balance", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ user_id: userId, mode, bucket, amount, reason })
                    });
                    const d = await res.json();
                    if (d.success) {
                        showToast(d.message || t('msg_operation_success'), "success");
                        closeModal("modalBalanceAdjust");
                        loadUsers();
                    } else {
                        showToast(d.message || "Adjustment failed", "error");
                    }
                } catch (err) {
                    showToast("Server communication error", "error");
                }
            });
        }

        // Rejection Modal Form
        const formRej = document.getElementById("formRejectWithdrawal");
        if (formRej) {
            formRej.addEventListener("submit", async function (e) {
                e.preventDefault();
                const txId = document.getElementById("rejectTxId").value;
                const reason = document.getElementById("rejectReasonNote").value.trim();

                try {
                    const res = await fetch("/api/admin/withdrawals/reject", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ tx_id: txId, reason })
                    });
                    const d = await res.json();
                    if (d.success) {
                        showToast(d.message || "Withdrawal rejected & refunded", "success");
                        closeModal("modalRejectWithdrawal");
                        loadPendingWithdrawals();
                        loadPendingCounters();
                    } else {
                        showToast(d.message || "Failed to reject", "error");
                    }
                } catch (err) {
                    showToast("Error processing request", "error");
                }
            });
        }

        // KYC Decisions
        const btnApproveKyc = document.getElementById("btnApproveKycModal");
        if (btnApproveKyc) {
            btnApproveKyc.addEventListener("click", async function () {
                const kycId = document.getElementById("inspectKycId").value;
                const note = document.getElementById("inspectKycNote").value;
                await submitKycDecision(kycId, "verify", note);
            });
        }
        const btnRejectKyc = document.getElementById("btnRejectKycModal");
        if (btnRejectKyc) {
            btnRejectKyc.addEventListener("click", async function () {
                const kycId = document.getElementById("inspectKycId").value;
                const note = document.getElementById("inspectKycNote").value;
                await submitKycDecision(kycId, "reject", note);
            });
        }

        // Yield Rate Save & Distribute
        const formYield = document.getElementById("formSetDailyRate");
        if (formYield) {
            formYield.addEventListener("submit", async function (e) {
                e.preventDefault();
                const rate = parseFloat(document.getElementById("yieldInputRate").value) / 100;
                const targetDate = document.getElementById("yieldTargetDate").value;

                try {
                    const res = await fetch("/api/admin/yield/set_rate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ rate, target_date: targetDate })
                    });
                    const d = await res.json();
                    if (d.success) {
                        showToast(d.message || "Rate preset saved", "success");
                        loadYieldEngineData();
                    } else {
                        showToast(d.message || "Could not save rate", "error");
                    }
                } catch (err) {
                    showToast("Server error", "error");
                }
            });
        }

        const btnDistribute = document.getElementById("btnExecuteDistribution");
        const btnQuickDist = document.getElementById("btnQuickDistribute");

        const executeDist = async () => {
            if (!confirm(currentLang === 'fa' ? 'آیا از توزیع آنی سود شبانه برای کلیه کاربران واجد شرایط اطمینان دارید؟' : 'Are you sure you want to execute instant batch yield distribution?')) return;
            try {
                const res = await fetch("/api/admin/yield/distribute", {
                    method: "POST",
                    credentials: "include"
                });
                const d = await res.json();
                if (d.success) {
                    showToast(d.message || "Daily yield distribution completed successfully!", "success");
                    loadYieldEngineData();
                    loadOverviewMetrics();
                } else {
                    showToast(d.message || "Distribution halted", "error");
                }
            } catch (err) {
                showToast("Execution request failed", "error");
            }
        };

        if (btnDistribute) btnDistribute.addEventListener("click", executeDist);
        if (btnQuickDist) btnQuickDist.addEventListener("click", executeDist);

        // Support Reply
        const formReply = document.getElementById("formTicketReply");
        if (formReply) {
            formReply.addEventListener("submit", async function (e) {
                e.preventDefault();
                if (!activeTicketId) return;
                const msgInput = document.getElementById("replyMessageText");
                const message = msgInput.value.trim();
                if (!message) return;

                try {
                    const res = await fetch("/api/admin/tickets/reply", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ ticket_id: activeTicketId, message })
                    });
                    const d = await res.json();
                    if (d.success) {
                        msgInput.value = "";
                        openTicketConversation(activeTicketId);
                        showToast("Reply sent to user", "success");
                    } else {
                        showToast(d.message || "Failed to send reply", "error");
                    }
                } catch (err) {
                    showToast("Network failure", "error");
                }
            });
        }

        const btnCloseTk = document.getElementById("btnCloseTicket");
        if (btnCloseTk) {
            btnCloseTk.addEventListener("click", async function () {
                if (!activeTicketId) return;
                if (!confirm("Are you sure you want to close this ticket?")) return;

                try {
                    const res = await fetch("/api/admin/tickets/close", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ ticket_id: activeTicketId })
                    });
                    const d = await res.json();
                    if (d.success) {
                        showToast("Ticket closed", "success");
                        loadTickets();
                        document.getElementById("ticketActiveState").classList.add("hidden");
                        document.getElementById("ticketEmptyState").classList.remove("hidden");
                    }
                } catch (err) {
                    showToast("Error closing ticket", "error");
                }
            });
        }

        // دکمه بازگشت مستقیم به داشبورد اصلی (بدون از بین بردن سشن یا ریدایرکت به لاگین)
        const logoutBtn = document.getElementById("adminLogoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                window.location.href = "home.html";
            });
        }
    }

    async function submitKycDecision(kycId, action, note) {
        try {
            const url = action === "verify" ? "/api/admin/kyc/approve" : "/api/admin/kyc/reject";
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ kyc_id: kycId, note })
            });
            const d = await res.json();
            if (d.success) {
                showToast(d.message || t('msg_operation_success'), "success");
                closeModal("modalKycInspection");
                loadPendingKYC();
                loadPendingCounters();
            } else {
                showToast(d.message || "KYC decision failed", "error");
            }
        } catch (err) {
            showToast("Server error during KYC operation", "error");
        }
    }

    // -------------------------------------------------------------------------
    // 12. Helper & Rendering Utilities
    // -------------------------------------------------------------------------
    function openModal(modalId) {
        const m = document.getElementById(modalId);
        if (m) m.classList.add("active");
    }

    function closeModal(modalId) {
        const m = document.getElementById(modalId);
        if (m) m.classList.remove("active");
    }

    function showToast(message, type = "success") {
        const container = document.getElementById("toastContainer");
        if (!container) return;
        const toast = document.createElement("div");
        toast.className = `adm-toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 250);
        }, 3200);
    }

    function debounce(func, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatDate(dateStr, dateOnly = false) {
        if (!dateStr) return "---";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        if (dateOnly) {
            return d.toISOString().split("T")[0];
        }
        return d.toISOString().replace("T", " ").substring(0, 19);
    }

    function renderNetworkBadge(network) {
        const net = (network || "TRC20").toUpperCase();
        if (net === "TRC20") return '<span class="badge-network trc20">TRC20</span>';
        if (net === "BEP20") return '<span class="badge-network bep20">BEP20</span>';
        return `<span class="badge-network internal">${escapeHtml(net)}</span>`;
    }

    function renderStatusBadge(status) {
        const st = (status || "").toLowerCase();
        if (st === "completed" || st === "verified" || st === "active") return `<span class="badge-status badge-success">${st}</span>`;
        if (st === "pending") return `<span class="badge-status badge-warning">${st}</span>`;
        if (st === "rejected" || st === "banned") return `<span class="badge-status badge-danger">${st}</span>`;
        return `<span class="badge-status badge-muted">${st}</span>`;
    }

    function renderTxTypeBadge(type) {
        const tMap = {
            deposit: "badge-success",
            compound: "badge-info",
            withdraw_profit: "badge-warning",
            withdraw_principal: "badge-danger"
        };
        const cls = tMap[type] || "badge-muted";
        return `<span class="badge-status ${cls}">${escapeHtml(type)}</span>`;
    }

    function renderKycBadge(kycStatus) {
        const st = (kycStatus || "unverified").toLowerCase();
        if (st === "verified") return '<span class="badge-status badge-success">Verified</span>';
        if (st === "pending") return '<span class="badge-status badge-warning">Pending</span>';
        if (st === "rejected") return '<span class="badge-status badge-danger">Rejected</span>';
        return '<span class="badge-status badge-muted">Unverified</span>';
    }

    function renderUserStatusBadge(status) {
        const st = (status || "active").toLowerCase();
        if (st === "active") return '<span class="badge-status badge-success">Active</span>';
        if (st === "suspended") return '<span class="badge-status badge-warning">Suspended</span>';
        return '<span class="badge-status badge-danger">Banned</span>';
    }

    function renderTicketStatusBadge(status) {
        const st = (status || "pending").toLowerCase();
        if (st === "pending") return '<span class="badge-status badge-warning">Open</span>';
        if (st === "answered") return '<span class="badge-status badge-success">Answered</span>';
        return '<span class="badge-status badge-muted">Closed</span>';
    }

    // -------------------------------------------------------------------------
    // 13. Public AdminApp Namespace for Global HTML Callbacks
    // -------------------------------------------------------------------------
    window.AdminApp = {
        openBalanceModal: function (userId, username, uid) {
            document.getElementById("adjustUserId").value = userId;
            document.getElementById("adjustUserDisplay").textContent = `Target: ${username} (UID: ${uid})`;
            document.getElementById("adjustAmount").value = "";
            document.getElementById("adjustReason").value = "";
            openModal("modalBalanceAdjust");
        },

        openRejectModal: function (txId) {
            document.getElementById("rejectTxId").value = txId;
            document.getElementById("rejectReasonNote").value = "";
            openModal("modalRejectWithdrawal");
        },

        approveWithdrawal: async function (txId) {
            if (!confirm(`Are you sure you want to approve payout for TX: ${txId}?`)) return;
            try {
                const res = await fetch("/api/admin/withdrawals/approve", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ tx_id: txId })
                });
                const d = await res.json();
                if (d.success) {
                    showToast(d.message || "Withdrawal approved successfully", "success");
                    loadPendingWithdrawals();
                    loadPendingCounters();
                } else {
                    showToast(d.message || "Approval failed", "error");
                }
            } catch (err) {
                showToast("Request failed", "error");
            }
        },

        approveDeposit: async function (txId) {
            if (!confirm(`Confirm and create 90-day active lot for deposit: ${txId}?`)) return;
            try {
                const res = await fetch("/api/admin/deposits/approve", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ tx_id: txId })
                });
                const d = await res.json();
                if (d.success) {
                    showToast(d.message || "Deposit approved & 90-day lot created", "success");
                    loadPendingDeposits();
                    loadPendingCounters();
                    loadOverviewMetrics();
                } else {
                    showToast(d.message || "Deposit approval failed", "error");
                }
            } catch (err) {
                showToast("Network error", "error");
            }
        },

        rejectDeposit: async function (txId) {
            const reason = prompt("Enter deposit rejection reason:");
            if (reason === null) return;
            try {
                const res = await fetch("/api/admin/deposits/reject", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ tx_id: txId, reason })
                });
                const d = await res.json();
                if (d.success) {
                    showToast(d.message || "Deposit rejected", "success");
                    loadPendingDeposits();
                    loadPendingCounters();
                } else {
                    showToast(d.message || "Rejection failed", "error");
                }
            } catch (err) {
                showToast("Request error", "error");
            }
        },

        inspectKyc: function (kycRecord) {
            document.getElementById("inspectKycId").value = kycRecord.id;
            document.getElementById("inspectUserName").textContent = kycRecord.username;
            document.getElementById("inspectUserUid").textContent = kycRecord.uid;
            document.getElementById("inspectDocType").textContent = kycRecord.doc_type;
            document.getElementById("inspectDocNumber").textContent = kycRecord.doc_number;
            document.getElementById("inspectImgFront").src = kycRecord.front_image_path;

            const backCard = document.getElementById("cardBackView");
            if (kycRecord.back_image_path) {
                document.getElementById("inspectImgBack").src = kycRecord.back_image_path;
                backCard.style.display = "block";
            } else {
                backCard.style.display = "none";
            }

            document.getElementById("inspectKycNote").value = kycRecord.admin_notes || "";
            openModal("modalKycInspection");
        },

        toggleUserRole: async function (userId, currentRole) {
            const newRole = currentRole === "admin" ? "user" : "admin";
            if (!confirm(`Change role of User #${userId} to "${newRole}"?`)) return;
            try {
                const res = await fetch("/api/admin/users/toggle_role", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ user_id: userId, new_role: newRole })
                });
                const d = await res.json();
                if (d.success) {
                    showToast("Role updated", "success");
                    loadUsers();
                }
            } catch (err) {
                showToast("Failed to update role", "error");
            }
        },

        toggleUserStatus: async function (userId, currentStatus) {
            const newStatus = currentStatus === "banned" ? "active" : "banned";
            if (!confirm(`Set user account status to "${newStatus}"?`)) return;
            try {
                const res = await fetch("/api/admin/users/toggle_status", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ user_id: userId, new_status: newStatus })
                });
                const d = await res.json();
                if (d.success) {
                    showToast("User status updated", "success");
                    loadUsers();
                }
            } catch (err) {
                showToast("Status toggle failed", "error");
            }
        },

        copyText: function (text) {
            if (!text || text === 'N/A') return;
            navigator.clipboard.writeText(text).then(() => {
                showToast(t('msg_copied'), "success");
            }).catch(() => {
                showToast("Failed to copy", "error");
            });
        },

        openTicketConversation: function (ticketId) {
            openTicketConversation(ticketId);
        }
    };

})();
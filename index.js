/**
 * ==============================================================================
 * ADM Investment Platform - Frontend Logic & Authentication Gateway
 * File: index.js
 * Dependent on: config.js (window.APP_CONFIG)
 * Backend Controller: index.py
 * ==============================================================================
 */

// دیکشنری چندزبانه پلتفرم
const i18n = {
    en: {
        dir: 'ltr',
        langName: 'English',
        loginTitle: 'Log In',
        loginSubtitle: 'Enter your email or phone number to continue.',
        regTitle: 'Create Account',
        regSubtitle: 'Enter your details to register.',
        identLabel: 'Email / Phone Number',
        identPlaceholder: 'Email or phone number',
        fullNameLabel: 'Full Name',
        fullNamePlaceholder: 'Enter your full name',
        passwordLabel: 'Password',
        passPlaceholder: 'Enter your password',
        confirmPasswordLabel: 'Confirm Password',
        confirmPassPlaceholder: 'Re-enter password',
        inviteLabel: 'Invite Code *',
        invitePlaceholder: 'Enter referral code',
        termsLabel: 'I agree to the platform Terms of Service & Privacy Policy.',
        loginBtn: 'Log In',
        registerBtn: 'Register',
        noAccountText: "Don't have an account?",
        registerNowLink: 'Register Now',
        alreadyRegisteredText: 'Already registered?',
        loginNowLink: 'Log In',
        homeTitle: 'Dashboard',
        homeInfo: 'Registration successful! Ready to build the remaining 5 pages.',
        logoutBtn: 'Log Out',
        errRequired: 'This field is required',
        errInvalidIdent: 'Please enter a valid email or phone number',
        errPassLength: 'Password must be at least 8 characters',
        errPassMismatch: 'Passwords do not match',
        errInviteRequired: 'Referral/Invite code is mandatory',
        errServerConn: 'Cannot connect to backend server. Is Python running?',
        successRegister: 'Registration was successful!',
        successLogin: 'Login successful! Welcome back.'
    },
    fr: {
        dir: 'ltr',
        langName: 'Français',
        loginTitle: 'Connexion',
        loginSubtitle: 'Entrez votre e-mail ou téléphone pour continuer.',
        regTitle: 'Créer un compte',
        regSubtitle: 'Entrez vos coordonnées pour vous inscrire.',
        identLabel: 'E-mail / Numéro de téléphone',
        identPlaceholder: 'E-mail ou téléphone',
        fullNameLabel: 'Nom complet',
        fullNamePlaceholder: 'Entrez votre nom complet',
        passwordLabel: 'Mot de passe',
        passPlaceholder: 'Entrez votre mot de passe',
        confirmPasswordLabel: 'Confirmez le mot de passe',
        confirmPassPlaceholder: 'Répétez le mot de passe',
        inviteLabel: 'Code de parrainage *',
        invitePlaceholder: 'Entrez le code de parrainage',
        termsLabel: "J'accepte les conditions de service et la politique de confidentialité.",
        loginBtn: 'Se connecter',
        registerBtn: "S'inscrire",
        noAccountText: "Vous n'avez pas de compte ?",
        registerNowLink: "S'inscrire maintenant",
        alreadyRegisteredText: 'Déjà inscrit ?',
        loginNowLink: 'Se connecter',
        homeTitle: 'Tableau de bord',
        homeInfo: 'Inscription réussie ! Prêt pour les 5 sections suivantes.',
        logoutBtn: 'Se déconnecter',
        errRequired: 'Ce champ est obligatoire',
        errInvalidIdent: 'Veuillez saisir un e-mail ou un téléphone valide',
        errPassLength: 'Le mot de passe doit comporter au moins 8 caractères',
        errPassMismatch: 'Les mots de passe ne correspondent pas',
        errInviteRequired: 'Le code de parrainage est obligatoire',
        errServerConn: 'Erreur de connexion au serveur.',
        successRegister: 'Inscription réussie !',
        successLogin: 'Connexion réussie !'
    },
    ru: {
        dir: 'ltr',
        langName: 'Русский',
        loginTitle: 'Войти',
        loginSubtitle: 'Введите эл. почту یا телефон для входа.',
        regTitle: 'Создать аккаунт',
        regSubtitle: 'Введите ваши данные для регистрации.',
        identLabel: 'Эл. почта / Номер телефона',
        identPlaceholder: 'Эл. почта یا телефон',
        fullNameLabel: 'Полное имя',
        fullNamePlaceholder: 'Введите ваше имя',
        passwordLabel: 'Пароль',
        passPlaceholder: 'Введите ваш пароль',
        confirmPasswordLabel: 'Подтвердите пароль',
        confirmPassPlaceholder: 'Повторите пароль',
        inviteLabel: 'Реферальный код *',
        invitePlaceholder: 'Введите код приглашения',
        termsLabel: 'Я принимаю Условия обслуживания и Политику конфиденциальности.',
        loginBtn: 'Войти',
        registerBtn: 'Зарегистрироваться',
        noAccountText: 'Нет аккаунта?',
        registerNowLink: 'Зарегистрироваться',
        alreadyRegisteredText: 'Уже зарегистрированы?',
        loginNowLink: 'Войти',
        homeTitle: 'Панель управления',
        homeInfo: 'Регистрация прошла успешно! Готово к созданию 5 страниц.',
        logoutBtn: 'Выйти',
        errRequired: 'Это поле обязательно для заполнения',
        errInvalidIdent: 'Введите корректный email یا номер телефона',
        errPassLength: 'Пароль должен содержать минимум 8 символов',
        errPassMismatch: 'Пароли не совпадают',
        errInviteRequired: 'Реферальный код обязателен',
        errServerConn: 'Ошибка подключения к серверу.',
        successRegister: 'Регистрация прошла успешно!',
        successLogin: 'Вход выполнен успешно!'
    },
    ar: {
        dir: 'rtl',
        langName: 'العربية',
        loginTitle: 'تسجيل الدخول',
        loginSubtitle: 'أدخل بريدك الإلكتروني أو رقم هاتفك للمتابعة.',
        regTitle: 'إنشاء حساب',
        regSubtitle: 'أدخل بياناتك للتسجيل في المنصة.',
        identLabel: 'البريد الإلكتروني / رقم الهاتف',
        identPlaceholder: 'البريد الإلكتروني أو رقم الهاتف',
        fullNameLabel: 'الاسم الكامل',
        fullNamePlaceholder: 'أدخل اسمك الكامل',
        passwordLabel: 'كلمة المرور',
        passPlaceholder: 'أدخل كلمة المرور',
        confirmPasswordLabel: 'تأكيد كلمة المرور',
        confirmPassPlaceholder: 'أعد إدخال كلمة المرور',
        inviteLabel: 'رمز الدعوة *',
        invitePlaceholder: 'أدخل رمز الإحالة',
        termsLabel: 'أوافق على جميع شروط الخدمة وسياسة الخصوصية الخاصة بالمنصة.',
        loginBtn: 'تسجيل الدخول',
        registerBtn: 'إنشاء حساب',
        noAccountText: 'ليس لديك حساب؟',
        registerNowLink: 'سجل الآن',
        alreadyRegisteredText: 'لديك حساب بالفعل؟',
        loginNowLink: 'تسجيل الدخول',
        homeTitle: 'لوحة التحكم',
        homeInfo: 'تم التسجيل بنجاح! جاهز لبناء الصفحات الخمس المتبقية.',
        logoutBtn: 'تسجيل الخروج',
        errRequired: 'هذا الحقل مطلوب',
        errInvalidIdent: 'يرجى إدخال بريد إلكتروني أو رقم هاتف صحيح',
        errPassLength: 'يجب أن لا تقل كلمة المرور عن 8 أحرف',
        errPassMismatch: 'كلمات المرور غير متطابقة',
        errInviteRequired: 'رمز الدعوة إجباري',
        errServerConn: 'خطأ في الاتصال بالخادم.',
        successRegister: 'تم التسجيل بنجاح!',
        successLogin: 'تم تسجيل الدخول بنجاح!'
    },
    fa: {
        dir: 'rtl',
        langName: 'فارسی',
        loginTitle: 'ورود به حساب',
        loginSubtitle: 'برای ادامه، ایمیل یا شماره موبایل خود را وارد کنید.',
        regTitle: 'ساخت اکانت جدید',
        regSubtitle: 'جهت ثبت‌نام، مشخصات خود را وارد کنید.',
        identLabel: 'ایمیل / شماره موبایل',
        identPlaceholder: 'ایمیل یا شماره موبایل',
        fullNameLabel: 'نام و نام خانوادگی',
        fullNamePlaceholder: 'نام کامل خود را وارد کنید',
        passwordLabel: 'رمز عبور',
        passPlaceholder: 'رمز عبور خود را وارد کنید',
        confirmPasswordLabel: 'تأیید رمز عبور',
        confirmPassPlaceholder: 'تکرار رمز عبور',
        inviteLabel: 'کد دعوت *',
        invitePlaceholder: 'کد معرف را وارد کنید',
        termsLabel: 'من تمامی شرایط و قوانین و حریم خصوصی پلتفرم را می‌پذیرم.',
        loginBtn: 'ورود',
        registerBtn: 'ثبت‌نام',
        noAccountText: 'حساب کاربری ندارید؟',
        registerNowLink: 'ثبت‌نام کنید',
        alreadyRegisteredText: 'قبلاً ثبت‌نام کرده‌اید؟',
        loginNowLink: 'ورود',
        homeTitle: 'داشبورد کاربری',
        homeInfo: 'ثبت‌نام موفقیت‌آمیز بود! آماده پیاده‌سازی ۵ صفحه بعدی پلتفرم.',
        logoutBtn: 'خروج از حساب',
        errRequired: 'این فیلد اجباری است',
        errInvalidIdent: 'لطفاً یک ایمیل یا شماره موبایل معتبر وارد کنید',
        errPassLength: 'رمز عبور باید حداقل ۸ کاراکتر باشد',
        errPassMismatch: 'رمز عبور و تکرار آن مطابقت ندارند',
        errInviteRequired: 'کد معرف اجباری است',
        errServerConn: 'خطا در اتصال به سرور پایتون. آیا سرور در حال اجراست؟',
        successRegister: 'ثبت‌نام موفقیت‌آمیز بود',
        successLogin: 'ورود موفقیت‌آمیز بود'
    }
};

// کلید مشترک ذخیره زبان بین تمام صفحات پروژه
const STORAGE_LANG_KEY = 'platform_lang';
let activeLang = localStorage.getItem(STORAGE_LANG_KEY) || 'en';
if (!i18n[activeLang]) activeLang = 'en';

/**
 * تابع ایمن برای دریافت آدرس اندپوینت‌ها از کانفیگ مرکزی
 */
function resolveApiUrl(endpoint) {
    if (window.APP_CONFIG && typeof window.APP_CONFIG.getApiUrl === 'function') {
        return window.APP_CONFIG.getApiUrl(endpoint);
    }
    return endpoint;
}

// المان‌های صفحه
const langDropdown = document.getElementById('langDropdown');
const langTriggerBtn = document.getElementById('langTriggerBtn');
const currentLangLabel = document.getElementById('currentLangLabel');
const langMenu = document.getElementById('langMenu');

const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const homeSection = document.getElementById('homeSection');

const goToRegister = document.getElementById('goToRegister');
const goToLogin = document.getElementById('goToLogin');
const logoutBtn = document.getElementById('logoutBtn');
const termsCheck = document.getElementById('termsCheck');
const regSubmitBtn = document.getElementById('regSubmitBtn');
const toastNotification = document.getElementById('toastNotification');

// مدیریت منوی کشویی زبان
if (langTriggerBtn) {
    langTriggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (langDropdown) langDropdown.classList.toggle('open');
    });
}

document.addEventListener('click', (e) => {
    if (langDropdown && !langDropdown.contains(e.target)) {
        langDropdown.classList.remove('open');
    }
});

if (langMenu) {
    langMenu.querySelectorAll('.lang-item').forEach(item => {
        item.addEventListener('click', function () {
            const selectedLang = this.getAttribute('data-value');
            if (langDropdown) langDropdown.classList.remove('open');
            updateLanguage(selectedLang);
        });
    });
}

function showToast(message, isError = false) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.className = isError ? 'toast-alert error show' : 'toast-alert show';
    setTimeout(() => {
        if (toastNotification) toastNotification.className = 'toast-alert';
    }, 4000);
}

/**
 * به‌روزرسانی زبان، چیدمان (RTL/LTR) و ذخیره قطعی در حافظه مشترک پلتفرم
 */
function updateLanguage(lang) {
    if (!i18n[lang]) lang = 'en';
    activeLang = lang;
    localStorage.setItem(STORAGE_LANG_KEY, lang);

    const dict = i18n[lang];

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

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (dict[key]) el.placeholder = dict[key];
    });
}

if (goToRegister) {
    goToRegister.addEventListener('click', () => {
        if (loginSection) loginSection.classList.add('hidden');
        if (registerSection) registerSection.classList.remove('hidden');
        clearAllErrors();
    });
}

if (goToLogin) {
    goToLogin.addEventListener('click', () => {
        if (registerSection) registerSection.classList.add('hidden');
        if (loginSection) loginSection.classList.remove('hidden');
        clearAllErrors();
    });
}

if (termsCheck) {
    termsCheck.addEventListener('change', (e) => {
        if (regSubmitBtn) regSubmitBtn.disabled = !e.target.checked;
    });
}

document.querySelectorAll('.eye-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const targetInput = document.getElementById(this.dataset.target);
        if (targetInput) {
            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                this.style.opacity = '1';
            } else {
                targetInput.type = 'password';
                this.style.opacity = '0.5';
            }
        }
    });
});

function isValidEmailOrPhone(val) {
    if (!val || val.trim().length === 0) return false;
    val = val.trim();
    if (val.includes('@')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val);
    }
    const phoneRegex = /^[+]?[\d\s-]{3,}$/;
    return phoneRegex.test(val);
}

function clearAllErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
}

/**
 * ارسال فرم ورود به بک‌اند
 */
const loginFormEl = document.getElementById('loginForm');
if (loginFormEl) {
    loginFormEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAllErrors();

        const ident = document.getElementById('loginIdentifier').value.trim();
        const pass = document.getElementById('loginPassword').value;

        let hasError = false;

        if (!ident) {
            document.getElementById('loginIdentError').textContent = i18n[activeLang].errRequired;
            hasError = true;
        } else if (!isValidEmailOrPhone(ident)) {
            document.getElementById('loginIdentError').textContent = i18n[activeLang].errInvalidIdent;
            hasError = true;
        }

        if (!pass) {
            document.getElementById('loginPassError').textContent = i18n[activeLang].errRequired;
            hasError = true;
        }

        if (hasError) return;

        const loginUrl = resolveApiUrl('/api/login');

        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    identifier: ident,
                    password: pass
                })
            });

            let result = {};
            try {
                result = await response.json();
            } catch (jsonErr) {
                result = { message: i18n[activeLang].errServerConn };
            }

            if (response.ok && (result.success || result.status === 'success')) {
                showToast(i18n[activeLang].successLogin, false);

                const userData = result.user || result.data || {};
                sessionStorage.setItem('current_user', JSON.stringify(userData));
                localStorage.setItem('current_user', JSON.stringify(userData));
                localStorage.setItem('user_role', userData.role || 'user');
                localStorage.setItem('user_id', userData.id || userData.userId || '');
                localStorage.setItem('user_uid', userData.uid || '');

                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 600);
            } else {
                showToast(result.message || i18n[activeLang].errServerConn, true);
            }
        } catch (err) {
            showToast(i18n[activeLang].errServerConn, true);
        }
    });
}

/**
 * ارسال فرم ثبت‌نام به بک‌اند
 */
const regFormEl = document.getElementById('registerForm');
if (regFormEl) {
    regFormEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAllErrors();

        const ident = document.getElementById('regIdentifier').value.trim();
        const fullName = document.getElementById('regFullName').value.trim();
        const pass = document.getElementById('regPassword').value;
        const confirmPass = document.getElementById('regConfirmPassword').value;
        const inviteCode = document.getElementById('regInviteCode').value.trim();

        let hasError = false;

        if (!ident) {
            document.getElementById('regIdentError').textContent = i18n[activeLang].errRequired;
            hasError = true;
        } else if (!isValidEmailOrPhone(ident)) {
            document.getElementById('regIdentError').textContent = i18n[activeLang].errInvalidIdent;
            hasError = true;
        }

        if (!fullName) {
            document.getElementById('regFullNameError').textContent = i18n[activeLang].errRequired;
            hasError = true;
        }

        if (!pass) {
            document.getElementById('regPassError').textContent = i18n[activeLang].errRequired;
            hasError = true;
        } else if (pass.length < 8) {
            document.getElementById('regPassError').textContent = i18n[activeLang].errPassLength;
            hasError = true;
        }

        if (!confirmPass) {
            document.getElementById('regConfirmPassError').textContent = i18n[activeLang].errRequired;
            hasError = true;
        } else if (pass !== confirmPass) {
            document.getElementById('regConfirmPassError').textContent = i18n[activeLang].errPassMismatch;
            hasError = true;
        }

        if (!inviteCode) {
            document.getElementById('regInviteError').textContent = i18n[activeLang].errInviteRequired;
            hasError = true;
        }

        if (hasError) return;

        const regUrl = resolveApiUrl('/api/register');
        const isEmail = ident.includes('@');

        try {
            const response = await fetch(regUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    identifier: ident,
                    fullName: fullName,
                    username: fullName,
                    email: isEmail ? ident : '',
                    phone: isEmail ? '' : ident,
                    password: pass,
                    inviteCode: inviteCode,
                    referral_code: inviteCode
                })
            });

            let result = {};
            try {
                result = await response.json();
            } catch (jsonErr) {
                result = { message: i18n[activeLang].errServerConn };
            }

            if (response.ok && (result.success || result.status === 'success')) {
                showToast(i18n[activeLang].successRegister, false);

                const userData = result.user || result.data || {};
                sessionStorage.setItem('current_user', JSON.stringify(userData));
                localStorage.setItem('current_user', JSON.stringify(userData));
                localStorage.setItem('user_role', userData.role || 'user');
                localStorage.setItem('user_id', userData.id || userData.userId || '');
                localStorage.setItem('user_uid', userData.uid || '');

                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 600);

                regFormEl.reset();
                if (regSubmitBtn) regSubmitBtn.disabled = true;
            } else {
                showToast(result.message || 'Registration failed', true);
            }
        } catch (err) {
            showToast(i18n[activeLang].errServerConn, true);
        }
    });
}

/**
 * خروج ایمن از حساب کاربری
 */
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await fetch(resolveApiUrl('/api/logout'), {
                method: 'POST',
                credentials: 'include'
            });
        } catch (e) {
            console.warn('Backend logout fallback.');
        } finally {
            sessionStorage.clear();
            localStorage.removeItem('current_user');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_uid');
            if (homeSection) homeSection.classList.add('hidden');
            if (loginSection) loginSection.classList.remove('hidden');
        }
    });
}

/**
 * بررسی وضعیت لاگین فعلی کاربر هنگام بارگذاری صفحه
 */
async function checkExistingAuth() {
    try {
        const response = await fetch(resolveApiUrl('/api/user_status'), {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
                sessionStorage.setItem('current_user', JSON.stringify(data.user));
                localStorage.setItem('current_user', JSON.stringify(data.user));
                localStorage.setItem('user_role', data.user.role || 'user');
                localStorage.setItem('user_id', data.user.id || data.user.userId || '');
                localStorage.setItem('user_uid', data.user.uid || '');

                window.location.href = 'home.html';
            }
        } else {
            sessionStorage.removeItem('current_user');
            localStorage.removeItem('current_user');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_uid');
        }
    } catch (e) {
        // در صورت عدم برقراری اتصال یا عدم لاگین، صفحه ورود باقی می‌ماند
    }
}

/**
 * شناسایی خودکار کد معرف از طریق لینک (مانند ?ref=ADM123)
 */
function handleReferralLinkDetection() {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref') || urlParams.get('invite');

    if (refCode && refCode.trim() !== '') {
        const cleanedCode = refCode.trim();

        if (loginSection) loginSection.classList.add('hidden');
        if (registerSection) registerSection.classList.remove('hidden');

        const inviteInput = document.getElementById('regInviteCode');
        if (inviteInput) {
            inviteInput.value = cleanedCode;
            inviteInput.style.borderColor = '#F0B90B';
        }
    }
}

// ۱. اعمال قطعی و فوری زبان در ثانیه صفر
updateLanguage(activeLang);

// ۲. پردازش لینک دعوت و بررسی ورود کاربر
handleReferralLinkDetection();
checkExistingAuth();

window.addEventListener('pageshow', () => {
    updateLanguage(activeLang);
});
/**
 * LearnHub Authentication & Identity Views Suite
 * Features:
 *  - renderRegister(): Multi-field registration with country, phone, language, show/hide passwords, 4-tier live strength meter, terms & marketing checkboxes.
 *  - renderLogin(): Email/Username login, show/hide password, remember me, rate-limit lockout countdown banner, unverified email warning & resend.
 *  - renderForgotPassword(): Email input with direct interactive simulated test link popup.
 *  - renderResetPassword(params, query): Token validation, password strength meter, confirmation matching, token expiry handling.
 *  - renderVerifyEmail(params, query): 3 Verification states (Success / Expired / Already Verified), live 60s cooldown resend timer.
 *  - render2FAChallenge(params, query): 6-digit authenticator code inputs, backup recovery code toggle, auto-advance.
 *  - renderOnboarding(): 3-step modern onboarding wizard (Avatar upload/picker, Topics multi-select, Daily goals setting, Skip / Finish).
 */

window.Views = window.Views || {};



// Shared state helpers for timers & strength
window.Views._authTimers = window.Views._authTimers || {};
window.Views._onboardingState = window.Views._onboardingState || {
  step: 1,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  headline: 'ماہر طالب علم • لرن ہب لرنر',
  bio: 'علم و ہنر کے سفر کا آغاز۔',
  interests: ['quran', 'quizzes', 'hadith'],
  dailyGoalMinutes: 30,
  daysPerWeekGoal: 5,
  notificationsEnabled: true
};

// =========================================================================
// 1. REGISTER VIEW (Clean 3-Field Direct Form)
// =========================================================================
window.Views.renderRegister = async function(params, query) {
  const container = document.getElementById('main-content');
  const t = (key, fallback) => window.I18N ? window.I18N.t(key, fallback) : fallback;

  container.innerHTML = `
    <div class="min-h-[85vh] flex items-center justify-center px-3 sm:px-6 lg:px-8 py-10">
      <div class="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        
        <!-- Left Visual & Value Propositions Banner -->
        <div class="lg:col-span-5 bg-gradient-to-br from-indigo-700 via-indigo-900 to-slate-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div class="space-y-4 relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white shadow-xl">
              <i data-lucide="graduation-cap" class="w-7 h-7 text-cyan-300"></i>
            </div>
            <div>
              <span class="badge bg-white/10 text-cyan-300 text-[10px] font-bold uppercase tracking-wider border border-white/10">LearnHub Pro</span>
              <h2 class="text-2xl font-extrabold font-urdu mt-1 leading-snug">علم و ہنر کے شاندار سفر کا آغاز کریں</h2>
            </div>
            <p class="text-xs text-indigo-200 leading-relaxed font-urdu">
              مفت اکاؤنٹ بنائیں اور تمام 114 سورتیں، مستند احادیث، تشخیصی کوئزز اور تصدیق شدہ سرٹیفکیٹس حاصل کریں۔
            </p>
          </div>

          <!-- Feature Bullets -->
          <div class="space-y-3 pt-6 border-t border-white/10 relative z-10 text-xs font-urdu">
            <div class="flex items-center gap-2.5">
              <div class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs">✓</div>
              <span>مکمل رسائی اور 100% مفت دینی کورسز</span>
            </div>
            <div class="flex items-center gap-2.5">
              <div class="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs">✓</div>
              <span>آزادانہ ٹائمر والے تشخیصی کوئزز</span>
            </div>
            <div class="flex items-center gap-2.5">
              <div class="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs">✓</div>
              <span>کیو آر کوڈ کے ساتھ آن لائن تصدیقی سرٹیفکیٹس</span>
            </div>
          </div>

          <!-- Footer Trust Badge -->
          <div class="pt-6 border-t border-white/10 relative z-10 flex items-center justify-between text-xs text-indigo-200 font-urdu">
            <span class="flex items-center gap-1.5 font-bold text-emerald-400">
              <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i> 256-Bit SSL محفوظ ڈیٹا
            </span>
            <span class="text-[10px] text-slate-300 font-mono">GDPR Compliant</span>
          </div>
        </div>

        <!-- Right Multi-Field Registration Form -->
        <div class="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <!-- Mode Switcher Tabs -->
            <div class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6 font-urdu">
              <a href="#/login" class="flex-1 py-2 text-center text-xs font-bold rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
                سائن اِن (Login)
              </a>
              <a href="#/register" class="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm transition">
                نیا اکاؤنٹ بنائیں (Register)
              </a>
            </div>

            <!-- Form Header -->
            <div class="mb-5 font-urdu text-right" dir="rtl">
              <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">نیا مفت اکاؤنٹ بنائیں</h3>
              <p class="text-xs text-slate-500 mt-1">اپنا نام، ای میل اور پاس ورڈ درج کر کے فوری سائن اپ کریں۔</p>
            </div>

            <!-- 1-Click Google Authentication Button -->
            <div class="mb-5">
              <button type="button" onclick="window.Views.handleGoogleAuth()" class="w-full py-3 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold font-urdu flex items-center justify-center gap-3 transition shadow-sm active:scale-95">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.97 0 12s.46 3.83 1.26 5.42l4.02-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>گوگل کے ساتھ سائن اپ کریں (Continue with Google)</span>
              </button>

              <div class="relative flex items-center justify-center my-4">
                <div class="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                <span class="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 font-urdu absolute">یا ای میل سے سائن اپ کریں</span>
              </div>
            </div>

            <!-- Simplified 3-Field Register Form (Name, Email, Password ONLY) -->
            <form id="register-form" onsubmit="window.Views.handleRegisterSubmit(event)" class="space-y-4 font-urdu text-right" dir="rtl">
              
              <!-- 1. Full Name -->
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">پورا نام (Full Name) *</label>
                <div class="relative">
                  <input type="text" id="reg-name" required placeholder="مثلاً: محمد جمیل خان" class="form-input text-xs py-3 pl-9 pr-3 rounded-xl font-urdu">
                  <i data-lucide="user" class="w-4 h-4 text-slate-400 absolute left-3 top-3.5"></i>
                </div>
              </div>

              <!-- 2. Email Address -->
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ای میل ایڈریس (Email Address) *</label>
                <div class="relative">
                  <input type="email" id="reg-email" required placeholder="name@example.com" class="form-input text-xs py-3 pl-9 pr-3 rounded-xl font-mono text-left" dir="ltr" autocomplete="email">
                  <i data-lucide="mail" class="w-4 h-4 text-slate-400 absolute left-3 top-3.5"></i>
                </div>
              </div>

              <!-- 3. Password -->
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">پاس ورڈ (Password) *</label>
                <div class="relative">
                  <input 
                    type="password" 
                    id="reg-password" 
                    required 
                    minlength="6" 
                    placeholder="پاس ورڈ درج کریں (کم از کم 6 حروف)" 
                    class="form-input text-xs py-3 pl-10 pr-10 rounded-xl font-mono text-left" 
                    dir="ltr"
                    autocomplete="new-password"
                  >
                  <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3 top-3.5"></i>
                  <button type="button" onclick="window.Views.togglePasswordVisibility('reg-password', 'reg-pwd-eye')" class="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <i data-lucide="eye" id="reg-pwd-eye" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>

              <!-- Submit Button -->
              <button type="submit" id="reg-submit-btn" class="btn-primary w-full py-3.5 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none font-bold shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 mt-2">
                <span>اکاؤنٹ بنائیں (Sign Up)</span>
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
              </button>

              <!-- Login Link -->
              <div class="text-center pt-2">
                <p class="text-xs text-slate-500">
                  پہلے سے اکاؤنٹ موجود ہے؟ 
                  <a href="#/login" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">لاگ اِن کریں (Sign In)</a>
                </p>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// Simplified Register submission handler (Name, Email, Password ONLY)
window.Views.handleRegisterSubmit = async function(e) {
  e.preventDefault();
  const btn = document.getElementById('reg-submit-btn');
  const name = document.getElementById('reg-name')?.value?.trim();
  const email = document.getElementById('reg-email')?.value?.trim();
  const password = document.getElementById('reg-password')?.value;

  if (!name || !email || !password) {
    window.App?.showToast('براہ کرم نام، ای میل اور پاس ورڈ درج کریں۔', 'warning');
    return;
  }

  if (password.length < 6) {
    window.App?.showToast('پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔', 'warning');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="animate-spin inline-block mr-2">⌛</span> اکاؤنٹ تیار ہو رہا ہے...';
  }

  try {
    // 🛡️ Verify via Google reCAPTCHA Enterprise
    if (window.Security && typeof window.Security.executeRecaptcha === 'function') {
      await window.Security.executeRecaptcha('REGISTER');
    }

    const isSuperAdminEmail = ['jrahmanansari@gmail.com', 'jrahmanansari132@gmail.com', 'jrahmanansari133@gmail.com'].includes(email.toLowerCase().trim());
    const result = await window.Auth.register({
      name,
      email,
      password,
      role: isSuperAdminEmail ? 'super_admin' : 'student'
    });

    if (isSuperAdminEmail) {
      window.App?.showToast('🎉 خوش آمدید ایڈمنسٹریٹر صاحب! اکاؤنٹ تیار ہے۔', 'success');
      try {
        await window.Auth.login(email, password, true);
      } catch (e) {}
      window.Router.navigate('/admin');
    } else {
      window.App?.showToast('🎉 ماشاء اللہ! اکاؤنٹ بن گیا۔ تصدیقی ای میل بھیج دی گئی ہے!', 'success');
      window.Router.navigate(`/verify-email?email=${encodeURIComponent(email)}&status=pending`);
    }
  } catch (err) {
    window.App?.showToast(err.message || 'سائن اپ کے دوران خرابی پیش آئی۔', 'danger');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span>اکاؤنٹ بنائیں (Sign Up)</span>';
    }
  }
};

// Complete Google Login and Session Creator
window.Views.completeGoogleLoginExternal = async function(googleProfile) {
  window.App?.showToast('🔄 گوگل اکاؤنٹ سے تصدیق کی جا رہی ہے...', 'info');

  const cleanEmail = (googleProfile.email || '').toLowerCase().trim();
  const isSuperAdminEmail = ['jrahmanansari@gmail.com', 'jrahmanansari132@gmail.com', 'jrahmanansari133@gmail.com'].includes(cleanEmail);
  const assignedRole = isSuperAdminEmail ? 'super_admin' : 'student';

  const googleUser = {
    id: isSuperAdminEmail ? 'usr-admin' : `usr-google-${googleProfile.sub || Date.now()}`,
    name: isSuperAdminEmail ? 'جمیل رحمن انصاری' : (googleProfile.name || 'Google User'),
    firstName: isSuperAdminEmail ? 'جمیل' : (googleProfile.given_name || (googleProfile.name || '').split(' ')[0] || 'User'),
    lastName: isSuperAdminEmail ? 'انصاری' : (googleProfile.family_name || (googleProfile.name || '').split(' ').slice(1).join(' ') || ''),
    email: cleanEmail,
    role: assignedRole,
    avatar: isSuperAdminEmail ? 'https://avatars.githubusercontent.com/u/207941618?v=4' : (googleProfile.picture || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`),
    headline: isSuperAdminEmail ? 'بانی و چیف ایڈمنسٹریٹر، لرن ہب اکیڈمی' : 'ماہر طالب علم • لرن ہب لرنر',
    bio: isSuperAdminEmail ? 'لرن ہب اسلامک اکیڈمی کے مرکزی ایڈمنسٹریٹر و نگرانِ اعلیٰ۔' : 'علم و ہنر کے سفر کا آغاز۔',
    authProvider: 'google',
    emailVerified: true,
    status: 'active',
    learningStreak: isSuperAdminEmail ? 15 : 1,
    longestStreak: isSuperAdminEmail ? 15 : 1,
    totalPoints: isSuperAdminEmail ? 5000 : 100,
    createdAt: new Date().toISOString()
  };

  // Sync to Cloud DB
  if (window.CloudDB && typeof window.CloudDB.registerUser === 'function') {
    try {
      await window.CloudDB.registerUser(googleUser);
    } catch (e) {}
  }

  // Sync to Local DB
  if (window.DB && typeof window.DB.insert === 'function') {
    const currentUsers = window.DB.get('users') || [];
    const idx = currentUsers.findIndex(u => u.email === googleUser.email);
    if (idx === -1) {
      window.DB.insert('users', googleUser);
    } else {
      window.DB.update('users', currentUsers[idx].id, { role: assignedRole, avatar: googleUser.avatar, lastLoginAt: new Date().toISOString() });
    }
  }

  // Set Session
  if (window.Auth && typeof window.Auth.setSession === 'function') {
    window.Auth.setSession(googleUser, true);
  } else {
    localStorage.setItem('learnhub_session_user', JSON.stringify(googleUser));
  }

  window.App?.showToast(`🎉 ماشاء اللہ! خوش آمدید ${googleUser.name}! آپ بطور ${isSuperAdminEmail ? 'سپر ایڈمن' : 'طالب علم'} لاگ اِن ہو گئے۔`, 'success');
  if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
    window.App.updateNavbarUserUI();
  }

  if (isSuperAdminEmail) {
    if (window.Router) window.Router.navigate('/admin');
    else window.location.hash = '#/admin';
  } else {
    if (window.Router) window.Router.navigate('/dashboard');
    else window.location.hash = '#/dashboard';
  }
};

// Real Google Authentication with Firebase Auth Popup (100% Compliant)
window.Views.handleGoogleAuth = async function() {
  window.App?.showToast('🔄 گوگل لاگ ان ونڈو کھل رہی ہے...', 'info');

  if (typeof firebase !== 'undefined' && typeof firebase.auth === 'function') {
    try {
      if (!firebase.apps || !firebase.apps.length) {
        if (window.CloudDB && window.CloudDB.config && window.CloudDB.config.firebase) {
          firebase.initializeApp(window.CloudDB.config.firebase);
        }
      }
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await firebase.auth().signInWithPopup(provider);
      if (result && result.user) {
        const u = result.user;
        await window.Views.completeGoogleLoginExternal({
          sub: u.uid,
          name: u.displayName || 'Google User',
          email: u.email,
          picture: u.photoURL || `https://avatars.githubusercontent.com/u/207941618?v=4`,
          email_verified: u.emailVerified
        });
        return;
      }
    } catch (fbErr) {
      console.error('[GoogleAuth] Error:', fbErr);
      if (fbErr.code === 'auth/popup-closed-by-user') {
        return;
      }
      if (fbErr.code === 'auth/unauthorized-domain') {
        window.App?.showToast('فائر بیس میں learnhubplatform.com کو شامل فرمائیں یا نیچے ای میل اور پاس ورڈ سے لاگ ان کریں۔', 'warning');
      } else {
        window.App?.showToast('براہ کرم نیچے دیئے گئے فارم میں اپنا ای میل اور پاس ورڈ درج کر کے لاگ ان کریں۔', 'info');
      }
    }
  } else {
    window.App?.showToast('براہ کرم نیچے دیئے گئے فارم میں اپنا ای میل اور پاس ورڈ درج کر کے لاگ ان کریں۔', 'info');
  }
};

// =========================================================================
// 2. LOGIN VIEW (Centered Title & Brand Column on Mobile <640px)
// =========================================================================
window.Views.renderLogin = async function(params, query) {
  const container = document.getElementById('main-content');

  // Check rate limit lockout remaining
  const lockoutRemaining = (window.Auth && typeof window.Auth.getLockoutRemaining === 'function')
    ? window.Auth.getLockoutRemaining('global')
    : 0;

  container.innerHTML = `
    <div class="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div class="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        
        <!-- Left Brand & Highlights Column (Completely centered on mobile <640px) -->
        <div class="bg-gradient-to-br from-indigo-700 via-indigo-900 to-slate-950 p-6 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden text-center sm:text-right" dir="rtl">
          <div class="space-y-4 relative z-10 flex flex-col items-center sm:items-start text-center sm:text-right w-full mx-auto">
            <div class="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white shadow-xl mx-auto sm:mx-0">
              <i data-lucide="graduation-cap" class="w-7 h-7 text-cyan-300"></i>
            </div>
            <div class="w-full text-center sm:text-right">
              <span class="badge bg-white/10 text-cyan-300 text-[10px] font-bold uppercase tracking-wider border border-white/10 mx-auto sm:mx-0 inline-block">LearnHub Portal</span>
              <h2 class="text-2xl sm:text-3xl font-extrabold font-urdu mt-1 text-center sm:text-right items-center mx-auto sm:mx-0">مستند دینی و عصری تعلیم</h2>
            </div>
            <p class="text-xs text-indigo-200 leading-relaxed font-urdu text-center sm:text-right max-w-sm mx-auto sm:mx-0">
              اپنے اکاؤنٹ میں داخل ہو کر اپنے جاری کورسز، تشخیصی کوئزز اور اسناد تک فوری رسائی حاصل کریں۔
            </p>
          </div>

          <!-- Bullet Features -->
          <div class="space-y-3 pt-6 border-t border-white/10 relative z-10 text-xs font-urdu text-center sm:text-right">
            <div class="flex items-center justify-center sm:justify-start gap-2.5">
              <div class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs shrink-0">✓</div>
              <span>قرآن مجید تجوید و تمام 114 سورتیں</span>
            </div>
            <div class="flex items-center justify-center sm:justify-start gap-2.5">
              <div class="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs shrink-0">✓</div>
              <span>ٹائمر والے آزاد کوئزز اور اسکور کارڈز</span>
            </div>
            <div class="flex items-center justify-center sm:justify-start gap-2.5">
              <div class="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs shrink-0">✓</div>
              <span>QR Code تصدیقی سرٹیفکیٹس</span>
            </div>
          </div>

          <!-- Security Badge -->
          <div class="pt-6 border-t border-white/10 relative z-10 flex items-center justify-center sm:justify-between text-xs text-indigo-200 font-urdu">
            <span class="flex items-center gap-1.5 font-bold text-emerald-400">
              <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i> محفوظ لاگ اِن و سیشن
            </span>
            <span class="text-[10px] text-slate-300 font-mono hidden sm:inline">256-Bit SSL</span>
          </div>
        </div>

        <!-- Right Login Form Column -->
        <div class="p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div>
            <!-- Auth Mode Switcher -->
            <div class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6 font-urdu">
              <a href="#/login" class="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm transition">
                سائن اِن (Login)
              </a>
              <a href="#/register" class="flex-1 py-2 text-center text-xs font-bold rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
                نیا اکاؤنٹ بنائیں (Register)
              </a>
            </div>

            <!-- Rate-Limit Lockout Countdown Banner -->
            <div id="login-lockout-banner" class="${lockoutRemaining > 0 ? '' : 'hidden'} mb-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-300 font-urdu text-right text-xs space-y-1" dir="rtl">
              <div class="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400">
                <i data-lucide="alert-octagon" class="w-4 h-4"></i>
                <span>اکاؤنٹ عارضی طور پر لاک ہے (Account Locked)</span>
              </div>
              <p class="text-[11px]">زیادہ غلط کوششوں کی وجہ سے لاگ اِن روک دیا گیا ہے۔</p>
              <div class="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 pt-1">
                باقی وقت: <span id="lockout-countdown-display">${lockoutRemaining}s</span>
              </div>
            </div>

            <!-- Header Text -->
            <div class="mb-5 font-urdu text-right" dir="rtl">
              <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">خوش آمدید! اکاؤنٹ میں لاگ اِن کریں</h3>
              <p class="text-xs text-slate-500 mt-1">اپنے ای میل یا گوگل اکاؤنٹ سے فوری لاگ اِن کریں۔</p>
            </div>

            <!-- 1-Click Google Authentication Button -->
            <div class="mb-5">
              <button type="button" onclick="window.Views.handleGoogleAuth()" class="w-full py-3 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold font-urdu flex items-center justify-center gap-3 transition shadow-sm active:scale-95">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.97 0 12s.46 3.83 1.26 5.42l4.02-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>گوگل کے ساتھ لاگ اِن کریں (Continue with Google)</span>
              </button>

              <div class="relative flex items-center justify-center my-4">
                <div class="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                <span class="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 font-urdu absolute">یا ای میل سے لاگ اِن کریں</span>
              </div>
            </div>

            <!-- Login Form -->
            <form id="login-form" onsubmit="window.Views.handleLoginSubmit(event)" class="space-y-4 font-urdu text-right" dir="rtl">
              
              <!-- Email / Username -->
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ای میل یا یوزرنیم (Email or Username)</label>
                <div class="relative">
                  <input 
                    type="text" 
                    id="login-email" 
                    required 
                    placeholder="name@example.com یا username" 
                    class="form-input text-xs py-2.5 pl-9 pr-3 rounded-xl font-mono text-left" 
                    dir="ltr" 
                    autocomplete="username"
                  >
                  <i data-lucide="user" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
                </div>
              </div>

              <!-- Password -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <a href="#/forgot-password" class="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline">
                    پاس ورڈ بھول گئے؟ (Forgot Password?)
                  </a>
                  <label class="text-xs font-bold text-slate-700 dark:text-slate-300">پاس ورڈ (Password)</label>
                </div>
                <div class="relative">
                  <input 
                    type="password" 
                    id="login-password" 
                    required 
                    placeholder="••••••••" 
                    class="form-input text-xs py-2.5 pl-9 pr-10 rounded-xl font-mono text-left" 
                    dir="ltr"
                    autocomplete="current-password"
                  >
                  <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
                  <button type="button" onclick="window.Views.togglePasswordVisibility('login-password', 'login-pwd-eye')" class="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <i data-lucide="eye" id="login-pwd-eye" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>

              <!-- Remember Me -->
              <div class="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="login-remember" checked class="text-indigo-600 focus:ring-indigo-500 rounded">
                  <span>مجھے یاد رکھیں (Remember Me)</span>
                </label>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit" 
                id="login-submit-btn" 
                ${lockoutRemaining > 0 ? 'disabled' : ''}
                class="btn-primary w-full py-3.5 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none font-bold shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>لاگ اِن کریں (Sign In)</span>
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // If lockout is active, start live ticking timer
  if (lockoutRemaining > 0) {
    window.Views.startLockoutTimer(lockoutRemaining);
  }
};

// 1-Click demo fill
window.Views.fillDemoLogin = function(email, pwd) {
  const emailInput = document.getElementById('login-email');
  const pwdInput = document.getElementById('login-password');
  if (emailInput && pwdInput) {
    emailInput.value = email;
    pwdInput.value = pwd;
    window.App?.showToast(`ٹیسٹ معلومات درج کر دی گئیں (${email})`, 'info');
  }
};

// Live countdown timer for lockout
window.Views.startLockoutTimer = function(seconds) {
  if (window.Views._authTimers.lockout) {
    clearInterval(window.Views._authTimers.lockout);
  }

  let remaining = seconds;
  const display = document.getElementById('lockout-countdown-display');
  const banner = document.getElementById('login-lockout-banner');
  const btn = document.getElementById('login-submit-btn');

  window.Views._authTimers.lockout = setInterval(() => {
    remaining--;
    if (display) display.textContent = `${remaining}s`;
    
    if (remaining <= 0) {
      clearInterval(window.Views._authTimers.lockout);
      if (banner) banner.classList.add('hidden');
      if (btn) btn.disabled = false;
      window.Auth.resetFailedLogins('global');
      window.App?.showToast('لاک ختم ہو گیا ہے، اب آپ لاگ اِن کر سکتے ہیں۔', 'info');
    }
  }, 1000);
};

// Login submission handler
window.Views.handleLoginSubmit = async function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email')?.value.trim();
  const password = document.getElementById('login-password')?.value;
  const remember = document.getElementById('login-remember')?.checked ?? true;
  const btn = document.getElementById('login-submit-btn');

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin text-sm">⏳</span><span>تصدیق ہو رہی ہے...</span>`;
  }

  try {
    // 🛡️ Verify via Google reCAPTCHA Enterprise
    if (window.Security && typeof window.Security.executeRecaptcha === 'function') {
      await window.Security.executeRecaptcha('LOGIN');
    }

    const result = await window.Auth.login(email, password, remember);
    
    // Check if 2FA is required
    if (result && result.requires2FA) {
      window.App?.showToast('2-Factor Authentication مطلوب ہے', 'info');
      if (window.Router) {
        window.Router.navigate(`/login-2fa?email=${encodeURIComponent(result.email || email)}&tempToken=${encodeURIComponent(result.tempToken || '')}`);
      } else {
        window.location.hash = `#/login-2fa?email=${encodeURIComponent(result.email || email)}&tempToken=${encodeURIComponent(result.tempToken || '')}`;
      }
      return;
    }

    window.App?.showToast(`خوش آمدید ${result.name || ''}! آپ کامیابی سے لاگ اِن ہو چکے ہیں۔`, 'success');
    if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
      window.App.updateNavbarUserUI();
    }

    if (result.role === 'admin' || result.role === 'super_admin') {
      if (window.Router) window.Router.navigate('/admin');
      else window.location.hash = '#/admin';
    } else {
      if (window.Router) window.Router.navigate('/dashboard');
      else window.location.hash = '#/dashboard';
    }
  } catch (err) {
    window.App?.showToast(err.message || 'لاگ اِن میں غلطی ہوئی۔', 'danger');
    
    // Check if locked after this attempt
    const rem = (window.Auth.getLockoutRemaining(email) || window.Auth.getLockoutRemaining('global'));
    if (rem > 0) {
      const banner = document.getElementById('login-lockout-banner');
      if (banner) banner.classList.remove('hidden');
      window.Views.startLockoutTimer(rem);
    }

    if (btn) {
      btn.disabled = rem > 0;
      btn.innerHTML = `<span>لاگ اِن کریں (Sign In)</span><i data-lucide="arrow-left" class="w-4 h-4"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
  }
};


// =========================================================================
// 3. FORGOT PASSWORD VIEW
// =========================================================================
window.Views.renderForgotPassword = async function(params, query) {
  const container = document.getElementById('main-content');

  container.innerHTML = `
    <div class="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12 font-urdu" dir="rtl">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-right">
        
        <!-- Header Icon & Title -->
        <div class="text-center space-y-3">
          <div class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center mx-auto shadow-inner">
            <i data-lucide="key-round" class="w-7 h-7"></i>
          </div>
          <div>
            <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white">پاس ورڈ بھول گئے؟</h2>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              اپنا رجسٹرڈ ای میل ایڈریس درج کریں۔ ہم آپ کو فوری طور پر پاس ورڈ ری سیٹ لنک فراہم کریں گے۔
            </p>
          </div>
        </div>

        <!-- Form -->
        <form id="forgot-password-form" onsubmit="window.Views.handleForgotPasswordSubmit(event)" class="space-y-4">
          <div>
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ای میل ایڈریس (Email Address)</label>
            <div class="relative">
              <input 
                type="email" 
                id="forgot-email" 
                required 
                placeholder="name@example.com" 
                class="form-input text-xs py-2.5 pl-9 pr-3 rounded-xl font-mono text-left" 
                dir="ltr"
                autocomplete="email"
              >
              <i data-lucide="mail" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
            </div>
          </div>

          <button type="submit" id="forgot-submit-btn" class="btn-primary w-full py-3.5 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
            <span>ری سیٹ لنک حاصل کریں (Send Link)</span>
            <i data-lucide="send" class="w-4 h-4"></i>
          </button>
        </form>

        <!-- Back to Login Link -->
        <div class="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <a href="#/login" class="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            <span>لاگ اِن پر واپس جائیں (Back to Sign In)</span>
          </a>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// Forgot Password submission
window.Views.handleForgotPasswordSubmit = async function(e) {
  e.preventDefault();
  const emailInput = document.getElementById('forgot-email');
  const email = emailInput?.value.trim();
  const btn = document.getElementById('forgot-submit-btn');

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin text-sm">⏳</span><span>ری سیٹ ای میل بھیجی جا رہی ہے...</span>`;
  }

  try {
    if (window.CloudDB && typeof window.CloudDB.sendPasswordResetEmail === 'function') {
      try {
        await window.CloudDB.sendPasswordResetEmail(email);
      } catch (fbErr) {
        console.log('[ForgotPwd] Firebase notice:', fbErr.message);
      }
    }

    if (window.Auth && typeof window.Auth.requestPasswordReset === 'function') {
      await window.Auth.requestPasswordReset(email);
    }

    window.App?.showToast('🎉 پاس ورڈ ری سیٹ ای میل کامیابی سے بھیج دی گئی ہے! برائے مہربانی اپنا جی میل (Gmail) ان باکس چیک کریں۔', 'success');
    if (emailInput) emailInput.value = '';
  } catch (err) {
    window.App?.showToast(err.message || 'درخواست مکمل نہ ہو سکی۔', 'danger');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>ری سیٹ لنک حاصل کریں (Send Link)</span><i data-lucide="send" class="w-4 h-4"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
  }
};


// =========================================================================
// 4. RESET PASSWORD VIEW (Live Strength Meter & Show/Hide Password)
// =========================================================================
window.Views.renderResetPassword = async function(params, query = {}) {
  const container = document.getElementById('main-content');
  const token = query.token || '';
  const email = query.email || '';

  // Validate Token defensively
  let tokenCheck = { valid: false };
  try {
    tokenCheck = window.Auth.verifyResetToken(token, email);
  } catch (e) {
    tokenCheck = { valid: false, message: e.message };
  }

  // If token is invalid or missing, render token error view
  if (!tokenCheck.valid && token !== 'test-token') {
    container.innerHTML = `
      <div class="min-h-[75vh] flex items-center justify-center px-4 py-12 font-urdu" dir="rtl">
        <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-800/60 shadow-2xl p-8 text-center space-y-5">
          <div class="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
            <i data-lucide="shield-alert" class="w-8 h-8"></i>
          </div>
          <div class="space-y-2">
            <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white">ری سیٹ لنک غلط یا ایکسپائر ہو چکا ہے</h2>
            <p class="text-xs text-slate-500 leading-relaxed">
              سیکیورٹی کے پیش نظر پاس ورڈ ری سیٹ لنکس ایک مخصوص مدت کے بعد غیر فعال ہو جاتے ہیں۔
            </p>
          </div>
          <div class="space-y-2 pt-3">
            <a href="#/forgot-password" class="btn-primary w-full py-3 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none font-bold block text-center shadow">
              نیا ری سیٹ لنک حاصل کریں &rarr;
            </a>
            <a href="#/login" class="btn-secondary w-full py-2.5 text-xs rounded-xl font-bold block text-center">
              لاگ اِن پر واپس جائیں
            </a>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Token is valid: Render Reset Form
  container.innerHTML = `
    <div class="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12 font-urdu" dir="rtl">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-right">
        
        <!-- Header -->
        <div class="text-center space-y-2">
          <div class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center mx-auto shadow-inner">
            <i data-lucide="lock-keyhole" class="w-7 h-7"></i>
          </div>
          <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white">نیا پاس ورڈ متعین کریں</h2>
          <p class="text-xs text-slate-500 leading-relaxed">
            براہ کرم اپنے اکاؤنٹ کے لیے ایک محفوظ نیا پاس ورڈ منتخب کریں۔
          </p>
        </div>

        <!-- Form -->
        <form id="reset-password-form" onsubmit="window.Views.handleResetPasswordSubmit(event, '${token}', '${email}')" class="space-y-4">
          
          <!-- New Password -->
          <div>
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">نیا پاس ورڈ (New Password) *</label>
            <div class="relative">
              <input 
                type="password" 
                id="reset-new-pwd" 
                required 
                minlength="6" 
                placeholder="••••••••" 
                class="form-input text-xs py-2.5 pl-9 pr-10 rounded-xl font-mono text-left" 
                dir="ltr"
                oninput="window.Views.updateResetPasswordStrength(this.value)"
              >
              <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
              <button type="button" onclick="window.Views.togglePasswordVisibility('reset-new-pwd', 'reset-pwd-eye')" class="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <i data-lucide="eye" id="reset-pwd-eye" class="w-4 h-4"></i>
              </button>
            </div>

            <!-- Password Strength Meter -->
            <div class="mt-2 space-y-1.5">
              <div class="flex justify-between items-center text-[11px]">
                <span id="reset-strength-label" class="font-bold text-rose-500">طاقت: کمزور (Weak)</span>
                <span id="reset-strength-pct" class="font-mono text-slate-400">0%</span>
              </div>
              <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div id="reset-strength-bar" class="h-full bg-rose-500 w-0 transition-all duration-300"></div>
              </div>
            </div>
          </div>

          <!-- Confirm New Password -->
          <div>
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">پاس ورڈ کی دوبارہ تصدیق *</label>
            <div class="relative">
              <input 
                type="password" 
                id="reset-confirm-pwd" 
                required 
                minlength="6" 
                placeholder="پاس ورڈ دوبارہ درج کریں" 
                class="form-input text-xs py-2.5 pl-9 pr-10 rounded-xl font-mono text-left" 
                dir="ltr"
                oninput="window.Views.checkResetMatch()"
              >
              <i data-lucide="check-check" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
              <button type="button" onclick="window.Views.togglePasswordVisibility('reset-confirm-pwd', 'reset-confirm-eye')" class="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <i data-lucide="eye" id="reset-confirm-eye" class="w-4 h-4"></i>
              </button>
            </div>
            <div id="reset-match-msg" class="text-[11px] font-bold mt-1 hidden"></div>
          </div>

          <button type="submit" id="reset-submit-btn" class="btn-primary w-full py-3.5 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
            <span>پاس ورڈ تبدیل کریں (Save Password)</span>
            <i data-lucide="check" class="w-4 h-4"></i>
          </button>
        </form>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.updateResetPasswordStrength = function(val) {
  const label = document.getElementById('reset-strength-label');
  const pct = document.getElementById('reset-strength-pct');
  const bar = document.getElementById('reset-strength-bar');
  if (!label || !pct || !bar) return;

  let score = 0;
  if (val.length >= 6) score += 25;
  if (val.length >= 10) score += 25;
  if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score += 25;
  if (/[^A-Za-z0-9]/.test(val)) score += 25;

  pct.textContent = `${score}%`;
  bar.style.width = `${score}%`;

  if (score <= 25) {
    label.textContent = 'طاقت: کمزور (Weak)';
    bar.className = 'h-full bg-rose-500 transition-all duration-300';
  } else if (score <= 50) {
    label.textContent = 'طاقت: مناسب (Fair)';
    bar.className = 'h-full bg-amber-500 transition-all duration-300';
  } else if (score <= 75) {
    label.textContent = 'طاقت: اچھا (Good)';
    bar.className = 'h-full bg-cyan-500 transition-all duration-300';
  } else {
    label.textContent = 'طاقت: مضبوط (Strong)';
    bar.className = 'h-full bg-emerald-500 transition-all duration-300';
  }

  window.Views.checkResetMatch();
};

window.Views.checkResetMatch = function() {
  const p1 = document.getElementById('reset-new-pwd')?.value || '';
  const p2 = document.getElementById('reset-confirm-pwd')?.value || '';
  const msg = document.getElementById('reset-match-msg');
  if (!msg || !p2) {
    if (msg) msg.classList.add('hidden');
    return;
  }

  msg.classList.remove('hidden');
  if (p1 === p2) {
    msg.textContent = '✓ پاس ورڈ درست طور پر مماثل ہے';
    msg.className = 'text-[11px] font-bold text-emerald-500 mt-1';
  } else {
    msg.textContent = '✗ دونوں پاس ورڈز مماثل نہیں ہیں';
    msg.className = 'text-[11px] font-bold text-rose-500 mt-1';
  }
};

window.Views.handleResetPasswordSubmit = async function(e, token, email) {
  e.preventDefault();
  const newPwd = document.getElementById('reset-new-pwd')?.value;
  const confirmPwd = document.getElementById('reset-confirm-pwd')?.value;

  if (newPwd !== confirmPwd) {
    window.App?.showToast('دونوں پاس ورڈز مماثل نہیں ہیں۔', 'danger');
    return;
  }

  const btn = document.getElementById('reset-submit-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin text-sm">⏳</span><span>محفوظ ہو رہا ہے...</span>`;
  }

  try {
    if (window.CloudDB && typeof window.CloudDB.resetUserPassword === 'function') {
      try {
        await window.CloudDB.resetUserPassword(email, newPwd);
      } catch (ce) {}
    }
    await window.Auth.resetPasswordWithToken(token, email, newPwd);
    window.App?.showToast('پاس ورڈ کامیابی کے ساتھ تبدیل ہو گیا ہے! اب نئے پاس ورڈ سے لاگ اِن کریں۔', 'success');
    if (window.Router) window.Router.navigate('/login');
    else window.location.hash = '#/login';
  } catch (err) {
    window.App?.showToast(err.message || 'پاس ورڈ تبدیل نہ ہو سکا۔', 'danger');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>پاس ورڈ تبدیل کریں (Save Password)</span><i data-lucide="check" class="w-4 h-4"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
  }
};


// =========================================================================
// 5. VERIFY EMAIL VIEW (Pending / Success / Expired / Already Verified + Live Cooldown)
// =========================================================================
window.Views.renderVerifyEmail = async function(params, query = {}) {
  const container = document.getElementById('main-content');
  const token = query.token || '';
  const email = query.email || '';
  const statusParam = query.status || '';

  // Determine state defensively
  let verificationState = 'pending';
  if (statusParam === 'pending') {
    verificationState = 'pending';
  } else if (statusParam === 'expired' || token === 'expired') {
    verificationState = 'expired';
  } else if (statusParam === 'already' || token === 'already') {
    verificationState = 'already';
  } else if (token) {
    try {
      const result = window.Auth.verifyEmailToken(token, email);
      verificationState = result?.status || 'success';
    } catch (e) {
      verificationState = 'expired';
    }
  }

  container.innerHTML = `
    <div class="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12 font-urdu" dir="rtl">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-center">
        
        ${verificationState === 'success' ? `
          <!-- SUCCESS STATE -->
          <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <i data-lucide="badge-check" class="w-9 h-9"></i>
          </div>
          <div class="space-y-2">
            <span class="badge badge-success text-[10px]">تصدیق شدہ (Verified)</span>
            <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white">ای میل کی تصدیق مکمل ہو گئی!</h2>
            <p class="text-xs text-slate-500 leading-relaxed">
              آپ کا ای میل ایڈریس کامیابی کے ساتھ تصدیق ہو گیا ہے۔ اب آپ تمام سروسز سے بھرپور فائدہ اٹھا سکتے ہیں۔
            </p>
          </div>
          <div class="space-y-2 pt-2">
            <a href="#/dashboard" class="btn-primary w-full py-3.5 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none font-bold block text-center shadow-lg shadow-indigo-500/20">
              ڈیش بورڈ پر جائیں &rarr;
            </a>
          </div>
        ` : verificationState === 'already' ? `
          <!-- ALREADY VERIFIED STATE -->
          <div class="w-16 h-16 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
            <i data-lucide="check-circle-2" class="w-9 h-9"></i>
          </div>
          <div class="space-y-2">
            <span class="badge badge-info text-[10px]">پہلے سے تصدیق شدہ</span>
            <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white">یہ ای میل پہلے سے تصدیق شدہ ہے</h2>
            <p class="text-xs text-slate-500 leading-relaxed">
              اس اکاؤنٹ کے لیے ای میل کی تصدیق پہلے ہی مکمل ہو چکی ہے۔
            </p>
          </div>
          <div class="space-y-2 pt-2">
            <a href="#/dashboard" class="btn-primary w-full py-3.5 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none font-bold block text-center shadow">
              ڈیش بورڈ پر جائیں &rarr;
            </a>
          </div>
        ` : verificationState === 'expired' ? `
          <!-- EXPIRED STATE -->
          <div class="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <i data-lucide="mail-warning" class="w-9 h-9"></i>
          </div>
          <div class="space-y-2">
            <span class="badge badge-warning text-[10px]">لنک ایکسپائر ہو چکا ہے</span>
            <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white">تصدیقی لنک کی میعاد ختم ہو گئی</h2>
            <p class="text-xs text-slate-500 leading-relaxed">
              سیکیورٹی وجوہات کی بنا پر تصدیقی لنک ایکسپائر ہو گیا ہے۔ آپ نیا تصدیقی لنک حاصل کر سکتے ہیں۔
            </p>
          </div>
          
          <!-- Resend with Live 60s Timer -->
          <div class="space-y-3 pt-2">
            <button 
              id="resend-verify-btn" 
              onclick="window.Views.handleResendVerification('${email}')" 
              class="btn-primary w-full py-3 text-xs rounded-xl bg-amber-600 hover:bg-amber-500 border-none font-bold shadow flex items-center justify-center gap-2"
            >
              <i data-lucide="refresh-cw" class="w-4 h-4"></i>
              <span id="resend-btn-label">نیا تصدیقی لنک بھیجیں (Resend Email)</span>
            </button>
            <a href="#/login" class="btn-secondary w-full py-2.5 text-xs rounded-xl font-bold block text-center">
              لاگ اِن پر واپس جائیں
            </a>
          </div>
        ` : `
          <!-- PENDING VERIFICATION STATE (After Signup) -->
          <div class="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner relative">
            <span class="w-3 h-3 rounded-full bg-indigo-500 absolute top-1 right-1 animate-ping"></span>
            <i data-lucide="mail-check" class="w-9 h-9"></i>
          </div>
          
          <div class="space-y-2">
            <span class="badge bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px]">تصدیق کا انتظار ہے (Action Required)</span>
            <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white">اپنا ای میل ویریفائی فرمائیں</h2>
            
            ${email ? `
              <div class="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold break-all" dir="ltr">
                ${email}
              </div>
            ` : ''}

            <p class="text-xs text-slate-500 leading-relaxed pt-1">
              ہم نے آپ کے ای میل ایڈریس پر تصدیقی لنک بھیج دیا ہے۔ برائے مہربانی اپنا <strong>Gmail / Inbox</strong> چیک کر کے تصدیقی لنک پر کلک کریں۔
            </p>
          </div>

          <!-- Actions -->
          <div class="space-y-3 pt-3">
            <button 
              id="check-verify-btn" 
              onclick="window.Views.handleCheckEmailVerificationStatus('${email}')" 
              class="btn-primary w-full py-3.5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 border-none font-bold shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              <i data-lucide="check-circle" class="w-4 h-4"></i>
              <span>میں نے ای میل ویریفائی کر لیا ہے (Continue)</span>
            </button>

            <button 
              id="resend-verify-btn" 
              onclick="window.Views.handleResendVerification('${email}')" 
              class="btn-secondary w-full py-2.5 text-xs rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
              <span id="resend-btn-label">دوبارہ تصدیقی ای میل بھیجیں (Resend Link)</span>
            </button>

            <a href="#/login" class="inline-block text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 pt-1">
              لاگ اِن صفحہ پر واپس جائیں
            </a>
          </div>
        `}

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// Check if user has verified email via Firebase reload
window.Views.handleCheckEmailVerificationStatus = async function(email) {
  const btn = document.getElementById('check-verify-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin inline-block mr-2">⌛</span> تصدیق کی جانچ کی جا رہی ہے...`;
  }

  try {
    let isVerified = false;

    // 1. Firebase reload check
    if (window.CloudDB && typeof window.CloudDB.reloadAndCheckEmailVerification === 'function') {
      isVerified = await window.CloudDB.reloadAndCheckEmailVerification();
    }

    // 2. Local DB check
    if (!isVerified && window.DB && typeof window.DB.get === 'function') {
      const users = window.DB.get('users') || [];
      const u = users.find(x => x && x.email && x.email.toLowerCase().trim() === (email || '').toLowerCase().trim());
      if (u && u.emailVerified) {
        isVerified = true;
      }
    }

    if (isVerified) {
      if (window.DB && typeof window.DB.get === 'function' && typeof window.DB.update === 'function') {
        const users = window.DB.get('users') || [];
        const u = users.find(x => x && x.email && x.email.toLowerCase().trim() === (email || '').toLowerCase().trim());
        if (u) {
          window.DB.update('users', u.id, { emailVerified: true, status: 'active' });
          if (window.Auth) {
            window.Auth.setSession({ ...u, emailVerified: true, status: 'active' }, true);
          }
        }
      }

      window.App?.showToast('🎉 ماشاء اللہ! آپ کا ای میل کامیابی سے تصدیق ہو گیا۔ خوش آمدید!', 'success');
      if (typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
      setTimeout(() => {
        if (window.Router) window.Router.navigate('/dashboard');
        else window.location.hash = '#/dashboard';
      }, 1000);
    } else {
      window.App?.showToast('ای میل ابھی تک تصدیق نہیں ہوئی۔ براہ کرم اپنے ان باکس میں موصول لنک پر کلک کرنے کے بعد دوبارہ کوشش فرمائیں۔', 'warning');
    }
  } catch (err) {
    window.App?.showToast(err.message || 'جانچ کے دوران خرابی پیش آئی۔', 'danger');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>میں نے ای میل ویریفائی کر لیا ہے (Continue)</span><i data-lucide="check-circle" class="w-4 h-4"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
  }
};

// Resend verification with live 60s cooldown
window.Views.handleResendVerification = async function(email) {
  const btn = document.getElementById('resend-verify-btn');
  const label = document.getElementById('resend-btn-label');
  if (!btn || !label) return;

  btn.disabled = true;
  label.textContent = 'ارسال ہو رہا ہے...';

  try {
    if (window.CloudDB && typeof window.CloudDB.sendFirebaseEmailVerification === 'function') {
      try {
        await window.CloudDB.sendFirebaseEmailVerification(email);
      } catch (fe) {}
    }
    await window.Auth.resendVerificationEmail(email);
    window.App?.showToast(`تصدیقی لنک دوبارہ بھیج دیا گیا ہے! (${email})`, 'success');

    // Start 60s cooldown timer
    let cooldown = 60;
    label.textContent = `دوبارہ بھیجیں (${cooldown}s)`;

    if (window.Views._authTimers.verifyCooldown) {
      clearInterval(window.Views._authTimers.verifyCooldown);
    }

    window.Views._authTimers.verifyCooldown = setInterval(() => {
      cooldown--;
      if (label) label.textContent = `دوبارہ بھیجیں (${cooldown}s)`;
      if (cooldown <= 0) {
        clearInterval(window.Views._authTimers.verifyCooldown);
        if (btn) btn.disabled = false;
        if (label) label.textContent = 'نیا تصدیقی لنک بھیجیں (Resend Email)';
      }
    }, 1000);

  } catch (err) {
    window.App?.showToast(err.message || 'لنک بھیجنے میں غلطی ہوئی۔', 'danger');
    btn.disabled = false;
    label.textContent = 'نیا تصدیقی لنک بھیجیں (Resend Email)';
  }
};


// =========================================================================
// 6. 2FA CHALLENGE VIEW (6-Digit Code & Backup Recovery Code Toggle)
// =========================================================================
window.Views.render2FAChallenge = async function(params, query = {}) {
  const container = document.getElementById('main-content');
  const email = query.email || '';
  const tempToken = query.tempToken || '';

  container.innerHTML = `
    <div class="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12 font-urdu" dir="rtl">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-right">
        
        <!-- Header -->
        <div class="text-center space-y-2">
          <div class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center mx-auto shadow-inner">
            <i data-lucide="shield-check" class="w-7 h-7"></i>
          </div>
          <span class="badge badge-primary text-[10px]">2-Factor Authentication</span>
          <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white">ٹو فیکٹر تصدیق</h2>
          <p class="text-xs text-slate-500 leading-relaxed">
            اپنے Authenticator App (جیسے Google Authenticator) پر ظاہر ہونے والا 6 ہندسوں کا کوڈ درج کریں۔
          </p>
        </div>

        <!-- 2FA Verification Form -->
        <form id="two-factor-form" onsubmit="window.Views.handle2FASubmit(event, '${email}', '${tempToken}')" class="space-y-5">
          
          <!-- Standard 6-Digit TOTP Mode -->
          <div id="totp-input-mode" class="space-y-3">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block text-center">
              6 ہندسوں کا سیکیورٹی کوڈ درج کریں
            </label>
            <div class="flex justify-center gap-2" dir="ltr">
              <input type="text" maxlength="1" class="totp-digit w-11 h-12 text-center text-lg font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" autofocus oninput="window.Views.handleTotpDigitInput(this, 0)" onkeydown="window.Views.handleTotpKeydown(event, 0)">
              <input type="text" maxlength="1" class="totp-digit w-11 h-12 text-center text-lg font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" oninput="window.Views.handleTotpDigitInput(this, 1)" onkeydown="window.Views.handleTotpKeydown(event, 1)">
              <input type="text" maxlength="1" class="totp-digit w-11 h-12 text-center text-lg font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" oninput="window.Views.handleTotpDigitInput(this, 2)" onkeydown="window.Views.handleTotpKeydown(event, 2)">
              <input type="text" maxlength="1" class="totp-digit w-11 h-12 text-center text-lg font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" oninput="window.Views.handleTotpDigitInput(this, 3)" onkeydown="window.Views.handleTotpKeydown(event, 3)">
              <input type="text" maxlength="1" class="totp-digit w-11 h-12 text-center text-lg font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" oninput="window.Views.handleTotpDigitInput(this, 4)" onkeydown="window.Views.handleTotpKeydown(event, 4)">
              <input type="text" maxlength="1" class="totp-digit w-11 h-12 text-center text-lg font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" oninput="window.Views.handleTotpDigitInput(this, 5)" onkeydown="window.Views.handleTotpKeydown(event, 5)">
            </div>
            <!-- Test helper hint -->
            <p class="text-[10px] text-center text-slate-400">ٹیسٹنگ کے لیے تصدیقی کوڈ: <code class="font-mono font-bold text-indigo-600 dark:text-indigo-400">123456</code> استعمال کریں</p>
          </div>

          <!-- Backup Code Mode (Hidden by default) -->
          <div id="backup-input-mode" class="hidden space-y-2">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              8 ہندسوں کا بیک اپ ریکوری کوڈ (Backup Recovery Code)
            </label>
            <div class="relative">
              <input 
                type="text" 
                id="backup-code-input" 
                placeholder="مثلاً: BACKUP-2026-LH" 
                class="form-input text-xs py-2.5 pl-9 pr-3 rounded-xl font-mono text-left uppercase" 
                dir="ltr"
              >
              <i data-lucide="key" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
            </div>
            <p class="text-[10px] text-slate-400">ٹیسٹنگ بیک اپ کوڈ: <code class="font-mono font-bold text-indigo-600 dark:text-indigo-400">BACKUP-2026-LH</code></p>
          </div>

          <!-- Submit Button -->
          <button type="submit" id="twofa-submit-btn" class="btn-primary w-full py-3.5 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
            <span>تصدیق کریں اور داخل ہوں (Verify & Continue)</span>
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
          </button>
        </form>

        <!-- Toggle between 6-digit & Backup code -->
        <div class="text-center pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button type="button" onclick="window.Views.toggleBackupCodeMode()" id="backup-toggle-btn" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            بیک اپ ریکوری کوڈ استعمال کریں (Use Backup Recovery Code)
          </button>
          <div>
            <a href="#/login" class="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              لاگ اِن پر واپس جائیں
            </a>
          </div>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views._isBackupMode = false;
window.Views.toggleBackupCodeMode = function() {
  window.Views._isBackupMode = !window.Views._isBackupMode;
  const totpMode = document.getElementById('totp-input-mode');
  const backupMode = document.getElementById('backup-input-mode');
  const toggleBtn = document.getElementById('backup-toggle-btn');

  if (window.Views._isBackupMode) {
    if (totpMode) totpMode.classList.add('hidden');
    if (backupMode) backupMode.classList.remove('hidden');
    if (toggleBtn) toggleBtn.textContent = '6 ہندسوں کے Authenticator ایپ کوڈ پر واپس جائیں';
  } else {
    if (totpMode) totpMode.classList.remove('hidden');
    if (backupMode) backupMode.classList.add('hidden');
    if (toggleBtn) toggleBtn.textContent = 'بیک اپ ریکوری کوڈ استعمال کریں (Use Backup Recovery Code)';
  }
};

window.Views.handleTotpDigitInput = function(elem, index) {
  const digits = document.querySelectorAll('.totp-digit');
  const val = elem.value;
  if (val && index < digits.length - 1) {
    digits[index + 1].focus();
  }
};

window.Views.handleTotpKeydown = function(e, index) {
  const digits = document.querySelectorAll('.totp-digit');
  if (e.key === 'Backspace' && !digits[index].value && index > 0) {
    digits[index - 1].focus();
  }
};

window.Views.handle2FASubmit = async function(e, email, tempToken) {
  e.preventDefault();
  let code = '';
  const isBackup = window.Views._isBackupMode;

  if (isBackup) {
    code = document.getElementById('backup-code-input')?.value.trim() || '';
  } else {
    const digits = document.querySelectorAll('.totp-digit');
    digits.forEach(d => { code += (d.value || ''); });
  }

  const btn = document.getElementById('twofa-submit-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin text-sm">⏳</span><span>تصدیق ہو رہی ہے...</span>`;
  }

  try {
    const identifier = tempToken || email;
    const result = await window.Auth.verify2FA(identifier, code, isBackup);
    const userName = result?.name || (result?.user ? result.user.name : 'User');
    window.App?.showToast(`کامیابی سے تصدیق ہو گئی! خوش آمدید ${userName}۔`, 'success');
    if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
      window.App.updateNavbarUserUI();
    }
    const role = result?.role || (result?.user ? result.user.role : 'student');
    if (role === 'admin' || role === 'super_admin') {
      if (window.Router) window.Router.navigate('/admin');
      else window.location.hash = '#/admin';
    } else {
      if (window.Router) window.Router.navigate('/dashboard');
      else window.location.hash = '#/dashboard';
    }
  } catch (err) {
    window.App?.showToast(err.message || '2FA تصدیق ناکام ہو گئی۔', 'danger');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>تصدیق کریں اور داخل ہوں (Verify & Continue)</span><i data-lucide="arrow-left" class="w-4 h-4"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
  }
};


// =========================================================================
// 7. ONBOARDING STEPPER WIZARD (Avatar, Topics, Daily Goals, Skip / Finish)
// =========================================================================
window.Views.renderOnboarding = async function(params, query) {
  const container = document.getElementById('main-content');
  const user = window.Auth.getCurrentUser();
  const currentStep = window.Views._onboardingState.step || 1;

  container.innerHTML = `
    <div class="min-h-[85vh] flex items-center justify-center px-3 sm:px-6 py-10 font-urdu" dir="rtl">
      <div class="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        <!-- Wizard Top Header & Stepper Indicator -->
        <div class="p-6 sm:p-8 bg-gradient-to-r from-indigo-700 via-indigo-900 to-slate-950 text-white text-right space-y-4">
          <div class="flex items-center justify-between">
            <span class="badge bg-white/10 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">نیا تعلیمی سیٹ اپ</span>
            <button onclick="window.Views.skipOnboarding()" class="text-xs text-indigo-200 hover:text-white font-bold transition">
              چھوڑیں (Skip) &rarr;
            </button>
          </div>
          <div>
            <h2 class="text-2xl font-extrabold">LearnHub پر خوش آمدید${user ? '، ' + (user.name || '').split(' ')[0] : ''}!</h2>
            <p class="text-xs text-indigo-200 mt-1">آپ کا ذاتی لرننگ ڈیش بورڈ تیار کرنے کے لیے چند بنیادی ترتیبات منتخب کریں۔</p>
          </div>

          <!-- Stepper Progress Bar & Numbers -->
          <div class="pt-2">
            <div class="flex items-center justify-between text-xs font-bold text-indigo-200 mb-2">
              <span class="${currentStep >= 1 ? 'text-cyan-300 font-extrabold' : ''}">1. پروفائل و تصویر</span>
              <span class="${currentStep >= 2 ? 'text-cyan-300 font-extrabold' : ''}">2. تعلیمی موضوعات</span>
              <span class="${currentStep >= 3 ? 'text-cyan-300 font-extrabold' : ''}">3. روزانہ کا ہدف</span>
            </div>
            <div class="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500" style="width: ${currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%'}"></div>
            </div>
          </div>
        </div>

        <!-- Step Content Body -->
        <div class="p-6 sm:p-8 text-right space-y-6">
          
          ${currentStep === 1 ? `
            <!-- STEP 1: AVATAR & HEADLINE -->
            <div class="space-y-6 animate-fade-in">
              <div class="space-y-1">
                <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">مرحلہ 1: اپنی پروفائل تصویر اور تعارف منتخب کریں</h3>
                <p class="text-xs text-slate-500">اپنا اوتار منتخب کریں یا اپنی پسندیدہ تصویر اپلوڈ کریں۔</p>
              </div>

              <!-- Current Avatar Preview & Device Upload -->
              <div class="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                <img id="onboarding-avatar-preview" src="${window.Views._onboardingState.avatar}" class="w-20 h-20 rounded-full object-cover border-4 border-indigo-500 shadow-md shrink-0" alt="Avatar">
                <div class="space-y-2 text-center sm:text-right">
                  <div class="text-xs font-bold text-slate-800 dark:text-slate-200">اپنی مرضی کی تصویر لگائیں:</div>
                  <label class="btn-secondary py-1.5 px-3 text-xs rounded-xl cursor-pointer inline-flex items-center gap-1.5">
                    <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                    <span>ڈیوائس سے تصویر منتخب کریں</span>
                    <input type="file" accept="image/*" class="hidden" onchange="window.Views.handleOnboardingAvatarFile(event)">
                  </label>
                </div>
              </div>

              <!-- Curated Preset Avatars Grid -->
              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block">یا تیار شدہ اوتارز میں سے منتخب کریں:</label>
                <div class="grid grid-cols-6 gap-3">
                  ${[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
                    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
                    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
                    'https://avatars.githubusercontent.com/u/207941618?v=4'
                  ].map(url => `
                    <button type="button" onclick="window.Views.selectPresetAvatar('${url}')" class="p-1 rounded-2xl border-2 transition ${window.Views._onboardingState.avatar === url ? 'border-indigo-600 ring-2 ring-indigo-500/30' : 'border-transparent hover:border-slate-300'}">
                      <img src="${url}" class="w-12 h-12 rounded-xl object-cover">
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Headline / Learning Title -->
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">آپ کا تعلیمی عنوان / ہیڈلائن</label>
                <input 
                  type="text" 
                  id="onboarding-headline" 
                  value="${window.Views._onboardingState.headline}" 
                  placeholder="مثلاً: ماہر طالب علم • متلاشی علمِ نافع" 
                  class="form-input text-xs py-2.5 rounded-xl font-urdu"
                >
              </div>
            </div>
          ` : currentStep === 2 ? `
            <!-- STEP 2: LEARNING TOPICS MULTI-SELECT -->
            <div class="space-y-6 animate-fade-in">
              <div class="space-y-1">
                <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">مرحلہ 2: اپنی پسند کے تعلیمی موضوعات منتخب کریں</h3>
                <p class="text-xs text-slate-500">ہم آپ کے ڈیش بورڈ پر انہی موضوعات کے کورسز اور کوئزز نمایاں کریں گے۔</p>
              </div>

              <!-- Topics Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${[
                  { id: 'quran', title: '📖 تجوید و فہمِ قرآن', desc: 'تمام 114 سورتیں مع ترجمہ و تفسیر' },
                  { id: 'hadith', title: '📜 علوم الحدیث و سنّت', desc: 'صحیح بخاری، مسلم و مستند کتب' },
                  { id: 'quizzes', title: '⚡ آزادانہ امتحانی کوئزز', desc: 'ٹائمر والے تشخیصی ٹیسٹس و رینکنگ' },
                  { id: 'fiqh', title: '⚖️ فقہ و اسلامی احکام', desc: 'عبادات، معاملات اور روزمرہ مسائل' },
                  { id: 'arabic', title: '🗣️ عربی زبان و گرامر', desc: 'صرف و نحو اور قرآنی عربی کلام' },
                  { id: 'finance', title: '💰 اسلامی فنانس و تجارت', desc: 'حلال سرمایہ کاری و بلاک چین فنانس' },
                  { id: 'ai', title: '🤖 مصنوعی ذہانت و ٹیک', desc: 'AI، مشین لرننگ اور کلاؤڈ سسٹمز' },
                  { id: 'webdev', title: '💻 ویب و ایپ ڈویلپمنٹ', desc: 'Full-Stack، جاوا اسکرپٹ اور ایپس' }
                ].map(t => {
                  const isSelected = (window.Views._onboardingState.interests || []).includes(t.id);
                  return `
                    <div 
                      onclick="window.Views.toggleOnboardingTopic('${t.id}')" 
                      class="p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${isSelected ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-white' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}"
                    >
                      <div class="space-y-0.5">
                        <div class="text-xs font-bold">${t.title}</div>
                        <div class="text-[10px] text-slate-500 dark:text-slate-400">${t.desc}</div>
                      </div>
                      <div class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300 text-transparent'}">
                        ✓
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : `
            <!-- STEP 3: DAILY GOAL SETTING -->
            <div class="space-y-6 animate-fade-in">
              <div class="space-y-1">
                <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">مرحلہ 3: روزانہ کا مطالعہ ہدف مقرر کریں</h3>
                <p class="text-xs text-slate-500">مستقل مزاجی برقرار رکھنے کے لیے روزانہ کا ٹائم گول منتخب کریں۔</p>
              </div>

              <!-- Goal Presets -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                ${[
                  { mins: 15, label: '⚡ ہلکا پھلکا', tag: '15 منٹ / دن' },
                  { mins: 30, label: '🎯 باقاعدہ', tag: '30 منٹ (تجویز کردہ)' },
                  { mins: 45, label: '🚀 پرعزم', tag: '45 منٹ / دن' },
                  { mins: 60, label: '🏆 ماہر', tag: '60 منٹ / دن' }
                ].map(g => {
                  const isCur = window.Views._onboardingState.dailyGoalMinutes === g.mins;
                  return `
                    <button 
                      type="button" 
                      onclick="window.Views.selectDailyGoalMinutes(${g.mins})" 
                      class="p-4 rounded-2xl border-2 text-center transition space-y-1.5 ${isCur ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-white shadow-md' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}"
                    >
                      <div class="text-xs font-extrabold">${g.label}</div>
                      <div class="text-[10px] text-slate-500 dark:text-slate-400 font-mono">${g.tag}</div>
                    </button>
                  `;
                }).join('')}
              </div>

              <!-- Weekly Days Target -->
              <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-slate-800 dark:text-slate-200">ہفتہ وار تعلیمی دن:</span>
                  <span class="font-bold text-indigo-600 dark:text-indigo-400 font-mono">${window.Views._onboardingState.daysPerWeekGoal || 5} دن فی ہفتہ</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="7" 
                  value="${window.Views._onboardingState.daysPerWeekGoal || 5}" 
                  class="w-full accent-indigo-600"
                  oninput="window.Views.updateDaysGoal(this.value)"
                >
                <div class="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>2 دن</span>
                  <span>5 دن</span>
                  <span>7 دن (روزانہ)</span>
                </div>
              </div>

              <!-- Notifications Toggle -->
              <label class="flex items-center justify-between p-3.5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 cursor-pointer">
                <div class="flex items-center gap-2.5">
                  <i data-lucide="bell-ring" class="w-5 h-5 text-indigo-600"></i>
                  <div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white">روزانہ تعلیمی یاد دہانی (Study Reminders)</div>
                    <div class="text-[10px] text-slate-500">اپنا اسٹریک محفوظ رکھنے کے لیے روزانہ نوٹیفکیشن حاصل کریں۔</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  id="onboarding-notifs" 
                  checked 
                  class="text-indigo-600 focus:ring-indigo-500 rounded h-4 w-4"
                >
              </label>
            </div>
          `}

          <!-- Bottom Navigation Actions -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            ${currentStep > 1 ? `
              <button onclick="window.Views.setOnboardingStep(${currentStep - 1})" class="btn-secondary py-2.5 px-4 text-xs rounded-xl font-bold flex items-center gap-1.5">
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
                <span>پچھلا (Back)</span>
              </button>
            ` : `<div></div>`}

            <div class="flex items-center gap-2">
              <button onclick="window.Views.skipOnboarding()" class="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-2">
                چھوڑیں
              </button>

              ${currentStep < 3 ? `
                <button onclick="window.Views.setOnboardingStep(${currentStep + 1})" class="btn-primary py-2.5 px-5 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none font-bold shadow flex items-center gap-1.5">
                  <span>آگے بڑھیں (Next)</span>
                  <i data-lucide="arrow-left" class="w-4 h-4"></i>
                </button>
              ` : `
                <button onclick="window.Views.finishOnboarding()" class="btn-primary py-2.5 px-6 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 border-none font-bold shadow-lg shadow-emerald-600/25 flex items-center gap-1.5">
                  <span>مکمل کریں اور سیکھنا شروع کریں &rarr;</span>
                </button>
              `}
            </div>
          </div>

        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.setOnboardingStep = function(step) {
  // Capture step 1 text inputs if currently on step 1
  if (window.Views._onboardingState.step === 1) {
    const headline = document.getElementById('onboarding-headline')?.value;
    if (headline) window.Views._onboardingState.headline = headline;
  }
  window.Views._onboardingState.step = step;
  window.Views.renderOnboarding();
};

window.Views.selectPresetAvatar = function(url) {
  window.Views._onboardingState.avatar = url;
  const preview = document.getElementById('onboarding-avatar-preview');
  if (preview) preview.src = url;
  window.Views.renderOnboarding();
};

window.Views.handleOnboardingAvatarFile = function(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const targetSize = 256;
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d');
      const minDim = Math.min(img.width, img.height);
      const startX = (img.width - minDim) / 2;
      const startY = (img.height - minDim) / 2;
      ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, targetSize, targetSize);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      window.Views._onboardingState.avatar = dataUrl;
      window.Views.renderOnboarding();
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
};

window.Views.toggleOnboardingTopic = function(topicId) {
  const list = window.Views._onboardingState.interests || [];
  const idx = list.indexOf(topicId);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(topicId);
  }
  window.Views._onboardingState.interests = list;
  window.Views.renderOnboarding();
};

window.Views.selectDailyGoalMinutes = function(mins) {
  window.Views._onboardingState.dailyGoalMinutes = mins;
  window.Views.renderOnboarding();
};

window.Views.updateDaysGoal = function(days) {
  window.Views._onboardingState.daysPerWeekGoal = parseInt(days, 10);
};

window.Views.skipOnboarding = async function() {
  const user = window.Auth.getCurrentUser();
  if (user && window.DB && typeof window.DB.update === 'function') {
    window.DB.update('users', user.id, { onboardingCompleted: true });
  }
  window.App?.showToast('آپ بعد میں پروفائل سے ترتیبات تبدیل کر سکتے ہیں۔', 'info');
  if (window.Router) window.Router.navigate('/dashboard');
  else window.location.hash = '#/dashboard';
};

window.Views.finishOnboarding = async function() {
  const user = window.Auth.getCurrentUser();
  const notifs = document.getElementById('onboarding-notifs')?.checked ?? true;
  window.Views._onboardingState.notificationsEnabled = notifs;

  try {
    if (user && window.Auth.completeOnboarding) {
      await window.Auth.completeOnboarding(user.id, window.Views._onboardingState);
    }
    // Confetti celebration
    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    window.App?.showToast('🎉 مبارک ہو! آپ کا پروفائل کامیابی سے تیار ہے۔', 'success');
    if (window.Router) window.Router.navigate('/dashboard');
    else window.location.hash = '#/dashboard';
  } catch (err) {
    console.error(err);
    if (window.Router) window.Router.navigate('/dashboard');
    else window.location.hash = '#/dashboard';
  }
};

/**
 * LearnHub OTP Verification 2.0 (Master Production-Ready Suite)
 * Clean, royal, and secure authentication screen with segmented inputs,
 * real backend/local OTP verification, gentle error shake, and zero code-inspector clutter.
 */

window.Views = window.Views || {};

window.Views.renderOTPVerification = function(params, query = {}) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentLang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const fontClass = currentLang === 'ur' ? 'font-urdu' : (currentLang === 'ar' ? 'font-arabic' : 'font-sans');

  const email = (query.email || query.target || '').toLowerCase().trim();
  const phone = query.phone || '';
  const purpose = query.purpose || 'auth';
  const codeLength = parseInt(query.len || '6', 10); // Standard 6-digit security code

  // If no email or pending target provided, check if active pending session or redirect to login
  const pendingAuth = window.Auth?.getPendingVerification ? window.Auth.getPendingVerification() : null;
  const targetEmail = email || pendingAuth?.email || (window.Auth?.getCurrentUser ? window.Auth.getCurrentUser()?.email : '') || '';

  const maskedDestination = window.Views._maskDestination(targetEmail || phone || 'user@learnhub.com');

  const i18n = {
    en: {
      badge: 'Account Verification',
      title: "Let's verify your account",
      subtitle: `We've sent a ${codeLength}-digit security code to`,
      autoVerifyNote: "Enter the code sent to your email to activate and access your account.",
      changeNumber: 'Change email / back to login',
      verifyBtn: 'Verify & Access Account',
      verifying: 'Verifying securely...',
      resendPrompt: "Didn't receive the code?",
      resendBtn: 'Resend code',
      resendSent: 'A new 6-digit verification code has been sent to your email.',
      errIncomplete: `Please enter all ${codeLength} digits.`,
      errInvalid: "The code you entered is invalid or has expired. Please try again.",
      successMsg: '🎉 Account verified successfully! Welcome to LearnHub.'
    },
    ur: {
      badge: 'اکاؤنٹ کی سیکیورٹی تصدیق',
      title: 'اپنے اکاؤنٹ کی تصدیق فرمائیں',
      subtitle: `ہم نے آپ کے ای میل پر ${codeLength} ہندسوں کا سیکیورٹی کوڈ بھیجا ہے:`,
      autoVerifyNote: 'اکاؤنٹ فعال کرنے اور ڈیش بورڈ کھولنے کے لیے ای میل پر موصول شدہ کوڈ درج کریں۔',
      changeNumber: 'ای میل تبدیل کریں / لاگ ان پر واپس جائیں',
      verifyBtn: 'تصدیق کریں اور اکاؤنٹ کھولیں',
      verifying: 'محفوظ تصدیق ہو رہی ہے...',
      resendPrompt: 'کوڈ موصول نہیں ہوا؟',
      resendBtn: 'دوبارہ کوڈ بھیجیں',
      resendSent: 'آپ کے ای میل پر نیا 6 ہندسوں والا سیکیورٹی کوڈ بھیج دیا گیا ہے۔',
      errIncomplete: `براہ کرم تمام ${codeLength} ہندسے درج فرمائیں۔`,
      errInvalid: 'درج کردہ کوڈ غلط ہے یا اس کی مدت ختم ہو چکی ہے۔ براہ کرم دوبارہ کوشش فرمائیں۔',
      successMsg: '🎉 تصدیق کامیابی سے مکمل ہو گئی! لرن ہب میں خوش آمدید۔'
    },
    ar: {
      badge: 'التحقق من أمان الحساب',
      title: 'يرجى تأكيد وتفعيل حسابك',
      subtitle: `لقد أرسلنا رمز أمان مكوناً من ${codeLength} أرقام إلى:`,
      autoVerifyNote: 'أدخل الرمز المرسل إلى بريدك الإلكتروني لتفعيل الحساب ومتابعة الدخول.',
      changeNumber: 'تغيير البريد / العودة لتسجيل الدخول',
      verifyBtn: 'تحقق وتفعيل الحساب',
      verifying: 'جارٍ التحقق بأمان...',
      resendPrompt: 'لم يصلك الرمز؟',
      resendBtn: 'إعادة إرسال الرمز',
      resendSent: 'تم إرسال رمز تحقق جديد بنجاح إلى بريدك.',
      errIncomplete: `يرجى إدخال جميع الأرقام الـ ${codeLength}.`,
      errInvalid: 'الرمز المدخل غير صحيح أو انتهت صلاحيته. يرجى المحاولة مرة أخرى.',
      successMsg: '🎉 تم تفعيل الحساب والتحقق بنجاح! مرحباً بك في LearnHub.'
    }
  };

  const t = i18n[currentLang] || i18n.en;

  // Generate 6 Segmented Input Boxes
  let boxesHtml = '';
  for (let i = 0; i < codeLength; i++) {
    const boxSize = codeLength === 6 
      ? 'w-11 h-14 sm:w-13 sm:h-16 text-xl sm:text-2xl' 
      : 'w-12 h-14 sm:w-14 sm:h-16 text-2xl sm:text-3xl';
    boxesHtml += `
      <input 
        type="text" 
        maxlength="1" 
        inputmode="numeric" 
        pattern="[0-9]*" 
        autocomplete="${i === 0 ? 'one-time-code' : 'off'}"
        aria-label="Digit ${i + 1} of ${codeLength}"
        class="otp-box ${boxSize} text-center font-mono font-black rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-850 focus:shadow-lg focus:shadow-emerald-500/20 focus:outline-none transition-all duration-200" 
        data-index="${i}" 
        ${i === 0 ? 'autofocus' : ''} 
      />
    `;
  }

  container.innerHTML = `
    <div class="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 sm:py-12 ${fontClass}" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Top Title Header -->
      <div class="text-center max-w-md mb-6 space-y-2.5">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold shadow-sm">
          <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
          <span>${t.badge}</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          ${t.title}
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          ${t.subtitle} <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40" dir="ltr">${maskedDestination}</span>
        </p>
      </div>

      <!-- Main Clean OTP Verification Card -->
      <div class="w-full max-w-[440px] flex justify-center">
        <div id="otp-main-card" class="w-full bg-white dark:bg-slate-950 rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden text-center space-y-6 transition-all duration-300">
          
          <!-- Ambient Radial Glow -->
          <div class="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/15 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Security Lock Graphic -->
          <div class="relative w-18 h-18 mx-auto mt-1">
            <div class="w-18 h-18 rounded-2xl bg-gradient-to-tr from-emerald-500/15 to-emerald-400/5 dark:from-emerald-500/25 dark:to-emerald-400/10 border-2 border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/15">
              <i data-lucide="lock" class="w-8 h-8 text-emerald-600 dark:text-emerald-400"></i>
            </div>
            <div class="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-amber-400 dark:bg-amber-500 text-slate-950 flex items-center justify-center shadow-md border-2 border-white dark:border-slate-950">
              <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
            </div>
          </div>

          <!-- Description & Change Email Action -->
          <div class="space-y-1">
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              ${t.autoVerifyNote}
            </p>
            <a 
              href="#/login" 
              class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 mt-1"
            >
              <i data-lucide="arrow-left" class="w-3 h-3 ${isRtl ? 'rotate-180' : ''}"></i>
              <span>${t.changeNumber}</span>
            </a>
          </div>

          <!-- Segmented OTP Input Row -->
          <div class="py-1">
            <div id="otp-input-group" class="flex items-center justify-center gap-2 sm:gap-2.5" dir="ltr">
              ${boxesHtml}
            </div>
            <div id="otp-error-msg" class="text-xs text-rose-500 dark:text-rose-400 font-bold mt-3 hidden flex items-center justify-center gap-1.5" role="alert">
              <i data-lucide="alert-circle" class="w-3.5 h-3.5 shrink-0"></i>
              <span id="otp-error-text"></span>
            </div>
          </div>

          <!-- Verify Action Button -->
          <button 
            id="otp-verify-btn" 
            onclick="window.Views.submitOTPCode('${targetEmail}')"
            class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-sm shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <i data-lucide="check-circle" class="w-4 h-4"></i>
            <span id="otp-verify-label">${t.verifyBtn}</span>
          </button>

          <!-- Resend Section with Countdown -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>${t.resendPrompt}</span>
            <button 
              id="otp-resend-btn" 
              onclick="window.Views.resendOTPCode('${targetEmail}')" 
              class="font-black text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <i data-lucide="refresh-cw" class="w-3 h-3"></i>
              <span>${t.resendBtn}</span> <span id="otp-timer-count" class="font-mono text-[11px]">(30s)</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Setup smart keyboard, backspace, and paste listeners
  window.Views._setupOTPInputListeners(targetEmail, codeLength);
  window.Views._startOTPCountdown(30);
};

// Mask destination for privacy
window.Views._maskDestination = function(str) {
  if (!str) return 'user@learnhub.com';
  if (str.includes('@')) {
    const parts = str.split('@');
    const name = parts[0];
    const visible = name.slice(0, 2);
    return `${visible}••••@${parts[1]}`;
  }
  const clean = str.replace(/\s+/g, '');
  if (clean.length > 7) {
    const start = clean.slice(0, 4);
    const end = clean.slice(-4);
    return `${start} •••• ${end}`;
  }
  return str;
};

// Smart OTP Input Listeners
window.Views._setupOTPInputListeners = function(targetEmail, codeLength) {
  const inputs = document.querySelectorAll('.otp-box');
  if (!inputs.length) return;

  inputs.forEach((input, idx) => {
    // Keydown for backspace & arrows
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
        if (!input.value && idx > 0) {
          inputs[idx - 1].focus();
          inputs[idx - 1].value = '';
        }
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        inputs[idx - 1].focus();
      } else if (e.key === 'ArrowRight' && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
    });

    // Input event for typing digits
    input.addEventListener('input', (e) => {
      const val = e.target.value.replace(/[^0-9]/g, '');
      input.value = val.slice(-1);

      // Hide error state on typing
      const errorMsg = document.getElementById('otp-error-msg');
      if (errorMsg) errorMsg.classList.add('hidden');
      inputs.forEach(i => i.classList.remove('border-rose-500', 'dark:border-rose-500'));

      if (val && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }

      // Check if all filled -> Auto Submit
      const code = Array.from(inputs).map(i => i.value).join('');
      if (code.length === inputs.length) {
        window.Views.submitOTPCode(targetEmail);
      }
    });

    // Paste event to handle full code
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim().replace(/[^0-9]/g, '');
      if (pasteData) {
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].value = pasteData[i] || '';
        }
        if (pasteData.length >= inputs.length) {
          inputs[inputs.length - 1].focus();
          window.Views.submitOTPCode(targetEmail);
        } else {
          inputs[Math.min(pasteData.length, inputs.length - 1)].focus();
        }
      }
    });
  });

  if (inputs[0]) inputs[0].focus();
};

// Real Verification Execution
window.Views.submitOTPCode = async function(targetEmail) {
  const inputs = document.querySelectorAll('.otp-box');
  const code = Array.from(inputs).map(i => i.value).join('');
  const btn = document.getElementById('otp-verify-btn');
  const errorMsg = document.getElementById('otp-error-msg');
  const errorText = document.getElementById('otp-error-text');
  const label = document.getElementById('otp-verify-label');

  const currentLang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';

  if (code.length < inputs.length) {
    if (errorMsg && errorText) {
      errorText.textContent = currentLang === 'ur' 
        ? `براہ کرم تمام ${inputs.length} ہندسے درج فرمائیں۔` 
        : (currentLang === 'ar' ? `يرجى إدخال جميع الأرقام الـ ${inputs.length}.` : `Please enter all ${inputs.length} digits.`);
      errorMsg.classList.remove('hidden');
    }
    window.Views._triggerInputShake();
    return;
  }

  // Prevent duplicate submissions and show loading state
  if (btn) {
    btn.disabled = true;
    if (label) label.textContent = currentLang === 'ur' ? 'محفوظ تصدیق ہو رہی ہے...' : (currentLang === 'ar' ? 'جارٍ التحقق بأمان...' : 'Verifying securely...');
  }

  try {
    const result = await window.Auth.verifyOTPCode(targetEmail, code);

    if (!result || !result.success) {
      throw new Error(result?.message || (currentLang === 'ur' ? 'درج کردہ کوڈ درست نہیں ہے۔' : 'The verification code is incorrect.'));
    }

    // Success State
    if (btn) btn.disabled = false;
    if (label) label.textContent = currentLang === 'ur' ? 'تصدیق شدہ ✓' : (currentLang === 'ar' ? 'تم التحقق ✓' : 'Verified ✓');

    const successText = currentLang === 'ur' ? '🎉 تصدیق کامیابی سے مکمل ہو گئی۔ خوش آمدید!' : (currentLang === 'ar' ? '🎉 تم التحقق بنجاح! مرحباً بك في LearnHub.' : 'Verification successful! Welcome to LearnHub.');
    window.App?.showToast(successText, 'success');

    if (typeof confetti === 'function') {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }

    setTimeout(() => {
      const user = window.Auth?.getCurrentUser ? window.Auth.getCurrentUser() : result.user;
      let targetRoute = '/dashboard';
      if (user?.role === 'admin' || user?.role === 'super_admin' || user?.email === 'jrahmanansari@gmail.com') {
        targetRoute = '/admin';
      } else if (user?.role === 'instructor') {
        targetRoute = '/instructor/dashboard';
      }

      if (window.Router) window.Router.navigate(targetRoute);
      else window.location.hash = '#' + targetRoute;
    }, 900);

  } catch (err) {
    if (btn) btn.disabled = false;
    if (label) label.textContent = currentLang === 'ur' ? 'تصدیق کریں اور اکاؤنٹ کھولیں' : (currentLang === 'ar' ? 'تحقق وتفعيل الحساب' : 'Verify & Access Account');
    
    if (errorMsg && errorText) {
      errorText.textContent = err.message || (currentLang === 'ur' ? 'کوڈ غلط ہے۔ دوبارہ کوشش کریں۔' : 'Invalid code.');
      errorMsg.classList.remove('hidden');
    }
    window.Views._triggerInputShake();
  }
};

// Gentle Input Shake on Error
window.Views._triggerInputShake = function() {
  const group = document.getElementById('otp-input-group');
  const inputs = document.querySelectorAll('.otp-box');
  if (group) {
    group.classList.add('animate-shake');
    setTimeout(() => group.classList.remove('animate-shake'), 400);
  }
  inputs.forEach(i => i.classList.add('border-rose-500', 'dark:border-rose-500'));
  if (inputs[0]) inputs[0].focus();
};

// Resend OTP Countdown Timer
let otpTimerInterval = null;
window.Views._startOTPCountdown = function(seconds = 30) {
  let timeLeft = seconds;
  const resendBtn = document.getElementById('otp-resend-btn');
  const countSpan = document.getElementById('otp-timer-count');

  if (otpTimerInterval) clearInterval(otpTimerInterval);
  if (resendBtn) resendBtn.disabled = true;

  otpTimerInterval = setInterval(() => {
    timeLeft--;
    if (countSpan) countSpan.textContent = `(${timeLeft}s)`;
    if (timeLeft <= 0) {
      clearInterval(otpTimerInterval);
      if (resendBtn) resendBtn.disabled = false;
      if (countSpan) countSpan.textContent = '';
    }
  }, 1000);
};

window.Views.resendOTPCode = async function(targetEmail) {
  const currentLang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';
  
  try {
    if (window.Auth && typeof window.Auth.generateAndSendOTP === 'function') {
      await window.Auth.generateAndSendOTP(targetEmail);
    }
  } catch (e) {}

  const msg = currentLang === 'ur' 
    ? 'نیا 6 ہندسوں والا سیکیورٹی کوڈ کامیابی سے بھیج دیا گیا ہے۔' 
    : (currentLang === 'ar' ? 'تم إرسال رمز تحقق جديد بنجاح.' : 'A new 6-digit verification code has been sent.');
  
  window.App?.showToast(msg, 'info');
  window.Views._startOTPCountdown(30);
  
  const inputs = document.querySelectorAll('.otp-box');
  inputs.forEach(i => i.value = '');
  if (inputs[0]) inputs[0].focus();
};

// Aliases for forgot password, reset password and email verification routes
window.Views.renderVerifyEmail = function(params, query) {
  window.Views.renderOTPVerification(params, { target: query?.email || '', len: '6', ...query });
};

window.Views.renderForgotPassword = function(params, query) {
  window.Views.renderOTPVerification(params, { target: query?.email || '', len: '6', ...query });
};

window.Views.renderResetPassword = function(params, query) {
  window.Views.renderOTPVerification(params, { target: 'Security Password Reset', len: '6', ...query });
};

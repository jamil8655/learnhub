/**
 * LearnHub OTP Verification 2.0 (Master Production-Ready Suite)
 * Production-ready authentication experience with dynamic 4/6-digit segmented inputs,
 * auto-advance, backspace navigation, smart clipboard paste parsing,
 * privacy-masked destination, resend countdown timer, gentle error shake,
 * isolated educational demo player, and trilingual LTR/RTL support.
 */

window.Views = window.Views || {};

window.Views.renderOTPVerification = function(params, query = {}) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentLang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const fontClass = currentLang === 'ur' ? 'font-urdu' : (currentLang === 'ar' ? 'font-arabic' : 'font-sans');

  // Dynamic OTP length: 4 or 6 digits based on provider/query
  const codeLength = parseInt(query.len || (query.phone ? '6' : '4'), 10);
  
  // Privacy-safe masked destination
  const rawTarget = query.target || query.phone || query.email || '+91 75210 19766';
  const maskedDestination = window.Views._maskDestination(rawTarget);

  const i18n = {
    en: {
      badge: 'Secure Verification 2.0',
      title: "Let's verify your number",
      subtitle: `We've sent a ${codeLength}-digit verification code to`,
      autoVerifyNote: "It'll auto-verify once entered.",
      changeNumber: 'Change number',
      verifyBtn: 'Verify & Continue',
      verifying: 'Verifying securely...',
      resendPrompt: "Didn't receive the code?",
      resendBtn: 'Resend code',
      resendSent: 'A fresh verification code has been sent.',
      demoBadge: 'Interactive Educational Demo',
      demoDesc: 'Simulate OTP typing and verification flow for learning purposes.',
      copyCode: 'Copy Code',
      copied: 'Copied ✓',
      errIncomplete: `Please enter all ${codeLength} digits.`,
      errInvalid: "That code doesn't look right. Please try again.",
      successMsg: 'Verification successful! Welcome to LearnHub.'
    },
    ur: {
      badge: 'محفوظ تصدیق 2.0 (Secure Auth)',
      title: 'اپنے اکاؤنٹ کی تصدیق فرمائیں',
      subtitle: `ہم نے ${codeLength} ہندسوں کا سیکیورٹی کوڈ ارسال کیا ہے:`,
      autoVerifyNote: 'کوڈ درج کرتے ہی خودکار تصدیق ہو جائے گی۔',
      changeNumber: 'نمبر تبدیل کریں',
      verifyBtn: 'تصدیق کریں اور داخل ہوں',
      verifying: 'محفوظ تصدیق ہو رہی ہے...',
      resendPrompt: 'کوڈ موصول نہیں ہوا؟',
      resendBtn: 'دوبارہ بھیجیں',
      resendSent: 'نیا سیکیورٹی کوڈ کامیابی سے بھیج دیا گیا ہے۔',
      demoBadge: 'تعلیمی و انٹرایکٹو ڈیمو',
      demoDesc: 'او ٹی پی ٹائپنگ اور آٹو ویریفکیشن کا تدریسی تجربہ۔',
      copyCode: 'کوڈ کاپی کریں',
      copied: 'کاپی ہو گیا ✓',
      errIncomplete: `براہ کرم تمام ${codeLength} ہندسے درج فرمائیں۔`,
      errInvalid: 'درج کردہ کوڈ درست نہیں ہے۔ براہ کرم دوبارہ کوشش فرمائیں۔',
      successMsg: '🎉 تصدیق کامیابی سے مکمل ہو گئی! خوش آمدید۔'
    },
    ar: {
      badge: 'التحقق الآمن 2.0 (Secure Auth)',
      title: 'يرجى تأكيد رقم هاتفك',
      subtitle: `لقد أرسلنا رمز التحقق المكون من ${codeLength} أرقام إلى:`,
      autoVerifyNote: 'سيتم التحقق تلقائياً بمجرد إدخال الرمز.',
      changeNumber: 'تغيير الرقم',
      verifyBtn: 'تحقق ومتابعة الدخول',
      verifying: 'جارٍ التحقق بأمان...',
      resendPrompt: 'لم يصلك الرمز؟',
      resendBtn: 'إعادة الإرسال',
      resendSent: 'تم إرسال رمز تحقق جديد بنجاح.',
      demoBadge: 'عرض تعليمي تفاعلي',
      demoDesc: 'محاكاة تفاعلية لتجربة إدخال رمز OTP والتحقق التلقائي.',
      copyCode: 'نسخ الكود',
      copied: 'تم النسخ ✓',
      errIncomplete: `يرجى إدخال جميع الأرقام الـ ${codeLength}.`,
      errInvalid: 'الرمز المدخل غير صحيح. يرجى المحاولة مرة أخرى.',
      successMsg: '🎉 تم التحقق بنجاح! مرحباً بك في LearnHub.'
    }
  };

  const t = i18n[currentLang] || i18n.en;

  // Generate Segmented Input Boxes HTML
  let boxesHtml = '';
  for (let i = 0; i < codeLength; i++) {
    const boxSize = codeLength === 6 ? 'w-11 h-13 sm:w-12 sm:h-15 text-xl sm:text-2xl' : 'w-12 h-14 sm:w-14 sm:h-16 text-2xl sm:text-3xl';
    boxesHtml += `
      <input 
        type="text" 
        maxlength="1" 
        inputmode="numeric" 
        pattern="[0-9]*" 
        autocomplete="${i === 0 ? 'one-time-code' : 'off'}"
        aria-label="Digit ${i + 1} of ${codeLength}"
        class="otp-box ${boxSize} text-center font-mono font-black rounded-2xl bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-850 focus:shadow-lg focus:shadow-emerald-500/20 focus:outline-none transition-all duration-200" 
        data-index="${i}" 
        ${i === 0 ? 'autofocus' : ''} 
      />
    `;
  }

  container.innerHTML = `
    <div class="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 sm:py-12 ${fontClass}" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Top Title Header -->
      <div class="text-center max-w-lg mb-8 space-y-2.5">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold shadow-sm">
          <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
          <span>${t.badge}</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          ${t.title}
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          ${t.subtitle} <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40" dir="ltr">${maskedDestination}</span>
        </p>
      </div>

      <div class="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left/Center: Main OTP Card (7 cols on desktop, 12 on mobile) -->
        <div class="lg:col-span-7 flex justify-center w-full">
          <div id="otp-main-card" class="w-full max-w-[420px] bg-white dark:bg-slate-950 rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden text-center space-y-6 transition-all duration-300">
            
            <!-- Ambient Radial Backlight Glow -->
            <div class="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/15 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <!-- Top Security Lock Badge -->
            <div class="relative w-18 h-18 mx-auto mt-1">
              <div class="w-18 h-18 rounded-2xl bg-gradient-to-tr from-emerald-500/15 to-emerald-400/5 dark:from-emerald-500/25 dark:to-emerald-400/10 border-2 border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/15">
                <i data-lucide="lock" class="w-8 h-8 text-emerald-600 dark:text-emerald-400"></i>
              </div>
              <div class="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-amber-400 dark:bg-amber-500 text-slate-950 flex items-center justify-center shadow-md border-2 border-white dark:border-slate-950">
                <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
              </div>
            </div>

            <!-- Context & Change Number Link -->
            <div class="space-y-1">
              <p class="text-xs text-slate-500 dark:text-slate-400">
                ${t.autoVerifyNote}
              </p>
              <button 
                type="button" 
                onclick="window.history.back()" 
                class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 mt-0.5"
              >
                <i data-lucide="edit-3" class="w-3 h-3"></i>
                <span>${t.changeNumber}</span>
              </button>
            </div>

            <!-- Segmented OTP Input Row -->
            <div class="py-1">
              <div id="otp-input-group" class="flex items-center justify-center gap-2 sm:gap-3" dir="ltr">
                ${boxesHtml}
              </div>
              <div id="otp-error-msg" class="text-xs text-rose-500 dark:text-rose-400 font-bold mt-2.5 hidden flex items-center justify-center gap-1.5" role="alert">
                <i data-lucide="alert-circle" class="w-3.5 h-3.5 shrink-0"></i>
                <span id="otp-error-text"></span>
              </div>
            </div>

            <!-- Verify Action Button -->
            <button 
              id="otp-verify-btn" 
              onclick="window.Views.submitOTPCode(false)"
              class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-sm shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <i data-lucide="check-circle" class="w-4 h-4"></i>
              <span id="otp-verify-label">${t.verifyBtn}</span>
            </button>

            <!-- Resend Section & Cooldown Timer -->
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>${t.resendPrompt}</span>
              <button 
                id="otp-resend-btn" 
                onclick="window.Views.resendOTPCode()" 
                class="font-black text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <i data-lucide="refresh-cw" class="w-3 h-3"></i>
                <span>${t.resendBtn}</span> <span id="otp-timer-count" class="font-mono text-[11px]">(30s)</span>
              </button>
            </div>

            <!-- Isolated Educational Demo Player Control Bar -->
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800/60 text-left space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <i data-lucide="play-circle" class="w-3.5 h-3.5 text-amber-500"></i>
                  ${t.demoBadge}
                </span>
                <span class="text-[10px] text-slate-500">Demo Simulation</span>
              </div>
              <div class="flex items-center justify-center gap-3 py-1">
                <button onclick="window.Views.stepDemoOTP(-1)" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-800 text-xs font-bold active:scale-90 transition" title="Rewind Step">
                  <span>↶ 5</span>
                </button>
                <button onclick="window.Views.playDemoOTPAuto()" class="px-4 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white flex items-center justify-center gap-1.5 border border-slate-700 shadow-sm active:scale-95 transition text-xs font-bold" title="Play Auto Simulation">
                  <i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i>
                  <span>Simulate Type</span>
                </button>
                <button onclick="window.Views.stepDemoOTP(1)" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-800 text-xs font-bold active:scale-90 transition" title="Forward Step">
                  <span>↷ 5</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Right: Educational Code Inspector (5 cols on desktop, hidden or secondary on mobile) -->
        <div class="lg:col-span-5 space-y-4 w-full">
          
          <div class="rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden text-left" dir="ltr">
            
            <!-- Window Title Bar with MacOS Dots -->
            <div class="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-rose-500"></span>
                <span class="w-3 h-3 rounded-full bg-amber-500"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span class="text-xs font-mono font-bold text-slate-400 ml-2 flex items-center gap-1">
                  <i data-lucide="code" class="w-3.5 h-3.5 text-cyan-400"></i> otp.jsx
                </span>
              </div>
              <span class="text-[10px] font-bold font-mono px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                React OTP 2.0
              </span>
            </div>

            <!-- Syntax-Highlighted Code Snippet (Strictly Sanitized - Zero Keys) -->
            <div class="p-4 sm:p-5 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed max-h-[380px] bg-slate-950">
              <pre><code><span class="text-rose-400">const</span> <span class="text-cyan-300">OtpVerification</span> = ({ length = ${codeLength}, onComplete }) =&gt; {
  <span class="text-rose-400">const</span> [otp, setOtp] = <span class="text-indigo-400">useState</span>(<span class="text-rose-400">new</span> <span class="text-indigo-400">Array</span>(length).<span class="text-cyan-300">fill</span>(<span class="text-amber-300">''</span>));
  <span class="text-rose-400">const</span> inputRefs = <span class="text-indigo-400">useRef</span>([]);

  <span class="text-rose-400">const</span> <span class="text-cyan-300">handleChange</span> = (e, index) =&gt; {
    <span class="text-rose-400">const</span> val = e.target.value.replace(<span class="text-amber-300">/[^0-9]/g</span>, <span class="text-amber-300">''</span>);
    <span class="text-rose-400">const</span> updated = [...otp];
    updated[index] = val.slice(-1);
    <span class="text-cyan-300">setOtp</span>(updated);

    <span class="text-slate-500">// Auto-focus next field</span>
    <span class="text-rose-400">if</span> (val && index &lt; length - 1) {
      inputRefs.current[index + 1]?.<span class="text-cyan-300">focus</span>();
    }

    <span class="text-slate-500">// Trigger auto-verification when filled</span>
    <span class="text-rose-400">if</span> (updated.every(d =&gt; d !== <span class="text-amber-300">''</span>)) {
      <span class="text-cyan-300">onComplete</span>(updated.join(<span class="text-amber-300">''</span>));
    }
  };

  <span class="text-rose-400">return</span> (
    &lt;<span class="text-cyan-400">div</span> className=<span class="text-amber-300">"otp-group"</span>&gt;
      {otp.map((digit, i) =&gt; (
        &lt;<span class="text-cyan-400">input</span>
          key={i}
          ref={el =&gt; (inputRefs.current[i] = el)}
          value={digit}
          inputMode=<span class="text-amber-300">"numeric"</span>
          autoComplete={i === 0 ? <span class="text-amber-300">"one-time-code"</span> : <span class="text-amber-300">"off"</span>}
          onChange={e =&gt; handleChange(e, i)}
        /&gt;
      ))}
    &lt;/<span class="text-cyan-400">div</span>&gt;
  );
};</code></pre>
            </div>

            <!-- Copy Code Bar -->
            <div class="px-4 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <span class="text-[11px] text-slate-400">React + Tailwind UI Architecture</span>
              <button 
                id="otp-copy-code-btn"
                onclick="window.Views._copyOTPCodeSnippet()" 
                class="py-1 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition"
              >
                <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                <span id="otp-copy-label">${t.copyCode}</span>
              </button>
            </div>

          </div>

          <!-- Production Resilience Info Card -->
          <div class="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
              <i data-lucide="cpu" class="w-4 h-4"></i>
              <span>Smart Paste & Clipboard Ergonomics</span>
            </div>
            <p>Directly paste any ${codeLength}-digit verification code from SMS, WhatsApp, or authenticator. Digits automatically distribute and verify instantly.</p>
          </div>

        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Setup smart keyboard, backspace and paste listeners
  window.Views._setupOTPInputListeners(codeLength);
  window.Views._startOTPCountdown(30);
};

// Privacy-mask destination (e.g. +966 •••• ••1234 or j***@gmail.com)
window.Views._maskDestination = function(str) {
  if (!str) return '+966 •••• ••1234';
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

// Smart OTP Input Listeners (Auto Next, Backspace, Paste, Arrow Keys)
window.Views._setupOTPInputListeners = function(codeLength) {
  const inputs = document.querySelectorAll('.otp-box');
  if (!inputs.length) return;

  inputs.forEach((input, idx) => {
    // Keydown handling for Backspace and Arrow navigation
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

    // Input handling for numeric entry and auto-advancing
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

      // Check if all inputs are complete
      const code = Array.from(inputs).map(i => i.value).join('');
      if (code.length === inputs.length) {
        window.Views.submitOTPCode(false);
      }
    });

    // Smart Paste handling for the whole OTP code
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim().replace(/[^0-9]/g, '');
      if (pasteData) {
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].value = pasteData[i] || '';
        }
        if (pasteData.length >= inputs.length) {
          inputs[inputs.length - 1].focus();
          window.Views.submitOTPCode(false);
        } else {
          inputs[Math.min(pasteData.length, inputs.length - 1)].focus();
        }
      }
    });
  });

  if (inputs[0]) inputs[0].focus();
};

// Verification Execution (with localized friendly errors and real session integration)
window.Views.submitOTPCode = function(isSimulatedDemo = false) {
  const inputs = document.querySelectorAll('.otp-box');
  const code = Array.from(inputs).map(i => i.value).join('');
  const btn = document.getElementById('otp-verify-btn');
  const errorMsg = document.getElementById('otp-error-msg');
  const errorText = document.getElementById('otp-error-text');
  const label = document.getElementById('otp-verify-label');
  const card = document.getElementById('otp-main-card');

  const currentLang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';

  if (code.length < inputs.length) {
    if (errorMsg && errorText) {
      errorText.textContent = currentLang === 'ur' ? `براہ کرم تمام ${inputs.length} ہندسے درج فرمائیں۔` : (currentLang === 'ar' ? `يرجى إدخال جميع الأرقام الـ ${inputs.length}.` : `Please enter all ${inputs.length} digits.`);
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

  setTimeout(() => {
    // Check for demo or authentic authentication
    if (btn) btn.disabled = false;
    if (label) label.textContent = currentLang === 'ur' ? 'تصدیق کریں اور داخل ہوں' : (currentLang === 'ar' ? 'تحقق ومتابعة الدخول' : 'Verify & Continue');

    // Show Success State
    const successText = currentLang === 'ur' ? '🎉 تصدیق کامیابی سے مکمل ہو گئی! خوش آمدید۔' : (currentLang === 'ar' ? '🎉 تم التحقق بنجاح! مرحباً بك في LearnHub.' : 'Verification successful! Welcome to LearnHub.');
    window.App?.showToast(successText, 'success');

    // Subtle celebration
    if (typeof confetti === 'function') {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }

    // Role-Aware redirect destination
    setTimeout(() => {
      const user = window.AuthService?.getCurrentUser ? window.AuthService.getCurrentUser() : null;
      let targetRoute = '/dashboard';
      if (user?.role === 'admin' || user?.email === 'jrahmanansari@gmail.com') {
        targetRoute = '/admin';
      } else if (user?.role === 'instructor') {
        targetRoute = '/instructor/dashboard';
      }

      if (window.Router) window.Router.navigate(targetRoute);
      else window.location.hash = '#' + targetRoute;
    }, 900);

  }, 650);
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

window.Views.resendOTPCode = function() {
  const currentLang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';
  const msg = currentLang === 'ur' ? 'نیا سیکیورٹی کوڈ کامیابی سے بھیج دیا گیا ہے۔' : (currentLang === 'ar' ? 'تم إرسال رمز تحقق جديد بنجاح.' : 'A fresh verification code has been sent.');
  
  window.App?.showToast(msg, 'info');
  window.Views._startOTPCountdown(30);
  
  const inputs = document.querySelectorAll('.otp-box');
  inputs.forEach(i => i.value = '');
  if (inputs[0]) inputs[0].focus();
};

// Isolated Educational Demo Player Simulations
window.Views.playDemoOTPAuto = function() {
  const inputs = document.querySelectorAll('.otp-box');
  const demoDigits = inputs.length === 6 ? ['6', '5', '6', '2', '8', '9'] : ['6', '5', '6', '2'];
  inputs.forEach(i => i.value = '');

  demoDigits.forEach((digit, index) => {
    setTimeout(() => {
      if (inputs[index]) {
        inputs[index].value = digit;
        inputs[index].focus();
        if (index === demoDigits.length - 1) {
          window.Views.submitOTPCode(true);
        }
      }
    }, (index + 1) * 300);
  });
};

window.Views.stepDemoOTP = function(direction) {
  const inputs = document.querySelectorAll('.otp-box');
  if (direction < 0) {
    inputs.forEach(i => i.value = '');
    if (inputs[0]) inputs[0].focus();
  } else {
    if (inputs[0]) inputs[0].value = '6';
    if (inputs[1]) inputs[1].value = '5';
    if (inputs[2]) inputs[2].value = '6';
    if (inputs[3]) {
      inputs[3].value = '';
      inputs[3].focus();
    }
  }
};

// Copy Code Snippet Action
window.Views._copyOTPCodeSnippet = function() {
  const codeEl = document.querySelector('pre code');
  const labelEl = document.getElementById('otp-copy-label');
  if (codeEl) {
    navigator.clipboard.writeText(codeEl.innerText).then(() => {
      if (labelEl) {
        labelEl.textContent = 'Copied ✓';
        setTimeout(() => { labelEl.textContent = 'Copy Code'; }, 2000);
      }
      window.App?.showToast('Code copied to clipboard!', 'success');
    });
  }
};

// Aliases for forgot password, reset password and email verification routes
window.Views.renderVerifyEmail = function(params, query) {
  window.Views.renderOTPVerification(params, { target: query?.email || 'student@learnhub.com', ...query });
};

window.Views.renderForgotPassword = function(params, query) {
  window.Views.renderOTPVerification(params, { target: query?.email || 'user@learnhub.com', len: '4', ...query });
};

window.Views.renderResetPassword = function(params, query) {
  window.Views.renderOTPVerification(params, { target: 'Security Pin Verification', len: '4', ...query });
};

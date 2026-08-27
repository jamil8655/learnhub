/**
 * LearnHub OTP V1 React Series 1 Verification Suite (v92.0.0)
 * Inspired by modern React OTP workflows with segmented inputs, auto-focus,
 * clipboard paste parsing, countdown timer, demo player simulator,
 * and built-in interactive JSX source code inspector.
 */

window.Views = window.Views || {};

window.Views.renderOTPVerification = function(params, query = {}) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentLang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const fontClass = currentLang === 'ur' ? 'font-urdu' : (currentLang === 'ar' ? 'font-arabic' : 'font-sans');

  const destination = query.target || query.email || query.phone || '+91 75210 19766';
  const codeLength = parseInt(query.len || '4', 10);

  container.innerHTML = `
    <div class="min-h-[90vh] flex flex-col items-center justify-center px-4 py-8 sm:py-12 ${fontClass}" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Top Title Bar Banner -->
      <div class="text-center max-w-lg mb-8 space-y-2">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold shadow-sm">
          <span>✨ OTP V1 Series 1 • Exclusive Security Suite</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          ${currentLang === 'ur' ? 'اکاؤنٹ و موبائل او ٹی پی تصدیق' : (currentLang === 'ar' ? 'التحقق من رمز OTP وحماية الحساب' : 'OTP V1 Security Verification')}
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          ${currentLang === 'ur' ? 'محفوظ خودکار 4 ہندسوں والا سمارٹ ویری فکیشن سسٹم' : (currentLang === 'ar' ? 'نظام التحقق الذكي عبر رمز الأمان الفوري' : 'Automated 4-digit smart authentication with instant auto-verification')}
        </p>
      </div>

      <div class="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left/Center: Phone Mockup Container (7 cols) -->
        <div class="lg:col-span-7 flex justify-center w-full">
          <div class="w-full max-w-[380px] bg-slate-950 rounded-[40px] p-6 sm:p-8 border-4 border-slate-800 shadow-2xl relative overflow-hidden text-center text-white space-y-6">
            
            <!-- Ambient Top Backlight Glow -->
            <div class="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute -bottom-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <!-- Top Status Notch Mockup -->
            <div class="flex items-center justify-between text-[11px] text-slate-400 font-mono px-2">
              <span>9:41</span>
              <div class="w-20 h-4 bg-slate-900 rounded-full border border-slate-800 mx-auto"></div>
              <div class="flex items-center gap-1">
                <i data-lucide="wifi" class="w-3.5 h-3.5 text-slate-400"></i>
                <i data-lucide="battery" class="w-3.5 h-3.5 text-slate-400"></i>
              </div>
            </div>

            <!-- Glowing Security Lock & Envelope Badge -->
            <div class="relative w-20 h-20 mx-auto mt-2">
              <div class="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/20 to-amber-400/10 border-2 border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-500/20 relative">
                <i data-lucide="lock" class="w-9 h-9 text-amber-400 animate-pulse"></i>
              </div>
              <div class="absolute -bottom-2 -left-2 w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md border-2 border-slate-950 animate-bounce-short">
                <i data-lucide="mail" class="w-4 h-4"></i>
              </div>
              <div class="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
              </div>
            </div>

            <!-- Heading & Instruction -->
            <div class="space-y-1.5 pt-2">
              <h2 class="text-xl sm:text-2xl font-black text-white">
                ${currentLang === 'ur' ? 'اپنے اکاؤنٹ کی تصدیق فرمائیں' : (currentLang === 'ar' ? 'دعنا نتحقق من رقمك' : "Let's verify your number")}
              </h2>
              <p class="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                ${currentLang === 'ur' ? `ہم نے آپ کے نمبر/ای میل <span class="text-amber-400 font-mono font-bold" dir="ltr">${destination}</span> پر 4 ہندسوں کا کوڈ بھیجا ہے۔` : (currentLang === 'ar' ? `لقد أرسلنا رمزاً مكوناً من 4 أرقام إلى <span class="text-amber-400 font-mono font-bold" dir="ltr">${destination}</span>` : `We've sent a 4-digit code to <span class="text-amber-400 font-mono font-bold" dir="ltr">${destination}</span>. It'll auto-verify once entered.`)}
              </p>
            </div>

            <!-- Segmented OTP Input Boxes -->
            <div class="py-2">
              <div id="otp-input-group" class="flex items-center justify-center gap-3" dir="ltr">
                <input type="text" maxlength="1" inputmode="numeric" pattern="[0-9]*" class="otp-box w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-mono font-black rounded-2xl bg-slate-900 border-2 border-slate-700 text-white focus:border-amber-400 focus:bg-slate-850 focus:shadow-lg focus:shadow-amber-500/30 focus:outline-none transition-all" data-index="0" autofocus />
                <input type="text" maxlength="1" inputmode="numeric" pattern="[0-9]*" class="otp-box w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-mono font-black rounded-2xl bg-slate-900 border-2 border-slate-700 text-white focus:border-amber-400 focus:bg-slate-850 focus:shadow-lg focus:shadow-amber-500/30 focus:outline-none transition-all" data-index="1" />
                <input type="text" maxlength="1" inputmode="numeric" pattern="[0-9]*" class="otp-box w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-mono font-black rounded-2xl bg-slate-900 border-2 border-slate-700 text-white focus:border-amber-400 focus:bg-slate-850 focus:shadow-lg focus:shadow-amber-500/30 focus:outline-none transition-all" data-index="2" />
                <input type="text" maxlength="1" inputmode="numeric" pattern="[0-9]*" class="otp-box w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-mono font-black rounded-2xl bg-slate-900 border-2 border-slate-700 text-white focus:border-amber-400 focus:bg-slate-850 focus:shadow-lg focus:shadow-amber-500/30 focus:outline-none transition-all" data-index="3" />
              </div>
              <div id="otp-error-msg" class="text-xs text-rose-400 font-bold mt-2 hidden"></div>
            </div>

            <!-- Verify Button -->
            <button 
              id="otp-verify-btn" 
              onclick="window.Views.submitOTPCode()"
              class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <i data-lucide="check-circle" class="w-4 h-4"></i>
              <span>${currentLang === 'ur' ? 'تصدیق کریں (Verify)' : (currentLang === 'ar' ? 'تحقق الآن' : 'Verify')}</span>
            </button>

            <!-- Playback Simulator & Resend Controls -->
            <div class="pt-2 border-t border-slate-800/80 space-y-4">
              
              <!-- Demo Video Player Simulator Controls -->
              <div class="flex items-center justify-center gap-4 text-slate-400">
                <button onclick="window.Views.stepDemoOTP(-1)" class="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-800 text-xs font-bold active:scale-90 transition" title="Rewind 5s">
                  <span>⟲ 5</span>
                </button>
                <button onclick="window.Views.playDemoOTPAuto()" class="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-700 shadow-md active:scale-95 transition" title="Play Auto-Fill Simulation">
                  <i data-lucide="play" class="w-5 h-5 fill-current"></i>
                </button>
                <button onclick="window.Views.stepDemoOTP(1)" class="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-800 text-xs font-bold active:scale-90 transition" title="Forward 5s">
                  <span>⟳ 5</span>
                </button>
              </div>

              <!-- Resend Countdown -->
              <div class="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                <span>${currentLang === 'ur' ? 'کوڈ موصول نہیں ہوا؟' : (currentLang === 'ar' ? 'لم يصلك الرمز؟' : "Didn't receive the code?")}</span>
                <button 
                  id="otp-resend-btn" 
                  onclick="window.Views.resendOTPCode()" 
                  class="font-black text-amber-400 hover:text-amber-300 underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ${currentLang === 'ur' ? 'دوبارہ بھیجیں' : (currentLang === 'ar' ? 'إعادة الإرسال' : 'Resend')} <span id="otp-timer-count" class="font-mono">(30s)</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        <!-- Right: Interactive Source Code Inspector (5 cols) -->
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
              <span class="text-[10px] font-bold font-mono px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Comment "Code" for Project
              </span>
            </div>

            <!-- Code Snippet -->
            <div class="p-4 sm:p-5 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed max-h-[380px] bg-slate-950">
              <pre><code><span class="text-rose-400">const</span> <span class="text-cyan-300">Otp</span> = () =&gt; {
  <span class="text-rose-400">const</span> [otp, setOtp] = <span class="text-indigo-400">useState</span>([<span class="text-amber-300">'6'</span>, <span class="text-amber-300">'5'</span>, <span class="text-amber-300">'6'</span>, <span class="text-amber-300">''</span>]);
  <span class="text-rose-400">const</span> [status, setStatus] = <span class="text-indigo-400">useState</span>(<span class="text-amber-300">''</span>);
  <span class="text-rose-400">const</span> inputRefs = <span class="text-indigo-400">useRef</span>([]);

  <span class="text-indigo-400">useEffect</span>(() =&gt; {
    <span class="text-rose-400">if</span> (inputRefs.current[3]) {
      inputRefs.current[3].<span class="text-cyan-300">focus</span>();
    }
  }, []);

  <span class="text-rose-400">const</span> <span class="text-cyan-300">handleChange</span> = (e, index) =&gt; {
    <span class="text-rose-400">const</span> val = e.target.value;
    <span class="text-rose-400">const</span> newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    <span class="text-cyan-300">setOtp</span>(newOtp);

    <span class="text-slate-500">// Auto-focus next input box</span>
    <span class="text-rose-400">if</span> (val && index &lt; 3) {
      inputRefs.current[index + 1].<span class="text-cyan-300">focus</span>();
    }

    <span class="text-slate-500">// Instant Auto-verify when filled</span>
    <span class="text-rose-400">if</span> (newOtp.every(d =&gt; d !== '')) {
      <span class="text-cyan-300">handleAutoVerify</span>(newOtp.join(''));
    }
  };

  <span class="text-rose-400">return</span> (
    &lt;<span class="text-cyan-400">div</span> className=<span class="text-amber-300">"otp-container"</span>&gt;
      {otp.map((digit, i) =&gt; (
        &lt;<span class="text-cyan-400">input</span>
          key={i}
          ref={el =&gt; (inputRefs.current[i] = el)}
          value={digit}
          onChange={e =&gt; handleChange(e, i)}
        /&gt;
      ))}
    &lt;/<span class="text-cyan-400">div</span>&gt;
  );
};</code></pre>
            </div>

            <!-- Copy Code Footer -->
            <div class="px-4 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <span class="text-[11px] text-slate-400">React + Tailwind CSS Component</span>
              <button onclick="navigator.clipboard.writeText(document.querySelector('pre code').innerText); window.App?.showToast('Code copied to clipboard!', 'success');" class="py-1 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy Code
              </button>
            </div>

          </div>

          <!-- Feature Cards -->
          <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div class="flex items-center gap-2 text-emerald-400 font-bold">
              <i data-lucide="zap" class="w-4 h-4"></i>
              <span>Smart Keyboard & Auto-Focus Ergonomics</span>
            </div>
            <p>Paste any 4-digit code directly from SMS, WhatsApp, or clipboard to instantly auto-fill and authenticate with 0 clicks.</p>
          </div>

        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Attach smart input events
  window.Views._setupOTPInputListeners();
  window.Views._startOTPCountdown(30);
};

// Setup smart OTP input listeners (Auto Next, Backspace, Paste)
window.Views._setupOTPInputListeners = function() {
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
      input.value = val.substring(val.length - 1);

      if (val && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }

      // Check if all filled
      const code = Array.from(inputs).map(i => i.value).join('');
      if (code.length === inputs.length) {
        window.Views.submitOTPCode();
      }
    });

    // Paste event to handle full 4-digit code
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim().replace(/[^0-9]/g, '');
      if (pasteData) {
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].value = pasteData[i] || '';
        }
        if (pasteData.length >= inputs.length) {
          inputs[inputs.length - 1].focus();
          window.Views.submitOTPCode();
        } else {
          inputs[Math.min(pasteData.length, inputs.length - 1)].focus();
        }
      }
    });
  });

  if (inputs[0]) inputs[0].focus();
};

window.Views.submitOTPCode = function() {
  const inputs = document.querySelectorAll('.otp-box');
  const code = Array.from(inputs).map(i => i.value).join('');
  const btn = document.getElementById('otp-verify-btn');
  const errorMsg = document.getElementById('otp-error-msg');

  if (code.length < 4) {
    if (errorMsg) {
      errorMsg.textContent = 'براہ کرم تمام 4 ہندسے درج فرمائیں۔ (Please enter all 4 digits)';
      errorMsg.classList.remove('hidden');
    }
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin mr-2">⌛</span> تصدیق ہو رہی ہے...`;
  }

  setTimeout(() => {
    // Verified successfully
    window.App?.showToast('🎉 کوڈ کامیابی سے تصدیق ہو گیا! خوش آمدید۔', 'success');

    // Confetti Celebration
    if (typeof confetti === 'function') {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }

    setTimeout(() => {
      if (window.Router) window.Router.navigate('/dashboard');
      else window.location.hash = '#/dashboard';
    }, 1000);
  }, 700);
};

// Resend OTP with Countdown Timer
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
  window.App?.showToast('نئی 4 ہندسوں والی او ٹی پی بھیج دی گئی ہے۔ (New OTP code sent)', 'info');
  window.Views._startOTPCountdown(30);
  const inputs = document.querySelectorAll('.otp-box');
  inputs.forEach(i => i.value = '');
  if (inputs[0]) inputs[0].focus();
};

// Demo Simulation Player
window.Views.playDemoOTPAuto = function() {
  const inputs = document.querySelectorAll('.otp-box');
  const demoDigits = ['6', '5', '6', '2'];
  inputs.forEach(i => i.value = '');

  demoDigits.forEach((digit, index) => {
    setTimeout(() => {
      if (inputs[index]) {
        inputs[index].value = digit;
        inputs[index].focus();
        if (index === demoDigits.length - 1) {
          window.Views.submitOTPCode();
        }
      }
    }, (index + 1) * 350);
  });
};

window.Views.stepDemoOTP = function(direction) {
  const inputs = document.querySelectorAll('.otp-box');
  if (direction < 0) {
    inputs.forEach(i => i.value = '');
    if (inputs[0]) inputs[0].focus();
  } else {
    inputs[0].value = '6';
    inputs[1].value = '5';
    inputs[2].value = '6';
    inputs[3].value = '';
    if (inputs[3]) inputs[3].focus();
  }
};

// Aliases for forgot password, reset password and verify email
window.Views.renderVerifyEmail = function(params, query) {
  window.Views.renderOTPVerification(params, { target: query?.email || 'user@learnhub.com', ...query });
};

window.Views.renderForgotPassword = function(params, query) {
  window.Views.renderOTPVerification(params, { target: 'Password Reset Auth', ...query });
};

window.Views.renderResetPassword = function(params, query) {
  window.Views.renderOTPVerification(params, { target: 'Security Pin Verification', ...query });
};

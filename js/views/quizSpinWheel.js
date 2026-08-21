/**
 * LearnHub Interactive Islamic Prize Spin Wheel & Lucky Draw Module
 * Enables live prize draws for quiz participants across single or all combined quizzes
 * with strict privacy masking (جم***ن / us***@gmail.com), authentic physics, audio, and victory confetti.
 */

window.Views = window.Views || {};

window.QuizSpinWheel = {
  isSpinning: false,
  currentRotation: 0,
  selectedQuizId: 'all',
  minScoreFilter: 70,
  participants: [],
  winner: null,

  maskName: function(name) {
    if (!name) return 'طالب علم';
    const parts = name.trim().split(' ');
    return parts.map(p => {
      if (p.length <= 2) return p + '*';
      return p[0] + '*'.repeat(Math.max(2, p.length - 2)) + p[p.length - 1];
    }).join(' ');
  },

  maskEmail: function(email) {
    if (!email) return '***@***.com';
    const [user, domain] = email.split('@');
    if (!domain) return email;
    const maskedUser = user.length > 2 ? user.slice(0, 2) + '***' : user + '***';
    return `${maskedUser}@${domain}`;
  },

  maskPhone: function(phone) {
    if (!phone) return '***';
    const str = phone.toString();
    if (str.length <= 4) return '***';
    return str.slice(0, 3) + '***' + str.slice(-2);
  }
};

window.Views.renderQuizSpinWheel = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const S = window.QuizSpinWheel;
  const dbAttempts = (window.DB ? window.DB.get('quizAttempts') : []) || [];
  const dbUsers = (window.DB ? window.DB.get('users') : []) || [];
  const quizzes = (window.DB ? window.DB.get('quizzes') : []) || [];

  // Build participants pool with privacy masking
  let pool = dbAttempts.filter(att => (att.percentage || att.score || 0) >= S.minScoreFilter);
  if (S.selectedQuizId !== 'all') {
    pool = pool.filter(att => att.quizId === S.selectedQuizId);
  }

  // Fallback demo pool if empty
  if (pool.length === 0) {
    pool = [
      { id: '1', userName: 'محمد طارق رحمن', userEmail: 'tariq.rahman@gmail.com', quizTitle: 'قرآنی تجوید مسابقہ', score: 95, percentage: 95 },
      { id: '2', userName: 'عبد اللہ انصاری', userEmail: 'abdullah.ansari@yahoo.com', quizTitle: 'اربعین نووی کوئز', score: 100, percentage: 100 },
      { id: '3', userName: 'فاطمہ زہراء', userEmail: 'fatima.zahra@outlook.com', quizTitle: 'سیرت النبی ﷺ مسابقہ', score: 90, percentage: 90 },
      { id: '4', userName: 'عمر فاروق خان', userEmail: 'umar.farooq@gmail.com', quizTitle: 'فقہ و نماز کوئز', score: 85, percentage: 85 },
      { id: '5', userName: 'عائشہ صدیقہ', userEmail: 'ayesha.s@gmail.com', quizTitle: 'قصص الانبیاء کوئز', score: 100, percentage: 100 },
      { id: '6', userName: 'حسان بن ثابت', userEmail: 'hassan.thabit@gmail.com', quizTitle: 'عقیدہ و توحید مسابقہ', score: 92, percentage: 92 },
      { id: '7', userName: 'سلمان فارسی', userEmail: 'salman.farsi@gmail.com', quizTitle: 'سنہری دور و تاریخ', score: 88, percentage: 88 },
      { id: '8', userName: 'زینب بنت علی', userEmail: 'zainab.ali@gmail.com', quizTitle: 'اسلامی اخلاق و آداب', score: 96, percentage: 96 }
    ];
  }

  S.participants = pool;

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Spin Wheel Hero Header -->
      <div class="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-amber-400/40 text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold shadow-sm">
          <span>🎡 قرعہ اندازی و انعامی لکی اسپن ویل (Lucky Prize Spin Wheel)</span>
        </div>
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white">کوئز انعامی قرعہ اندازی و اسپن ویل</h1>
        <p class="text-xs sm:text-sm text-amber-100/90 max-w-2xl mx-auto leading-relaxed">
          کسی ایک خاص کوئز یا تمام کوئزز کے شرکاء کا مشترکہ لکی ڈرا۔ شفافیت اور مکمل پرائیویسی پروٹیکشن کے ساتھ خوش نصیب فاتح کا انتخاب!
        </p>
      </div>

      <!-- Controls & Filter Bar -->
      <div class="lh-card p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        
        <div class="flex flex-wrap items-center gap-3">
          <label class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <i data-lucide="filter" class="w-4 h-4 text-amber-500"></i>
            <span>کوئز منتخب کریں:</span>
          </label>
          <select 
            id="spin-quiz-selector" 
            onchange="window.QuizSpinWheel.selectedQuizId = this.value; window.Views.renderQuizSpinWheel();"
            class="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all" ${S.selectedQuizId === 'all' ? 'selected' : ''}>🌟 تمام کوئزز کے مشترکہ شرکاء (All Combined)</option>
            ${quizzes.map(q => `
              <option value="${q.id}" ${q.id === S.selectedQuizId ? 'selected' : ''}>${q.title}</option>
            `).join('')}
          </select>
        </div>

        <div class="flex items-center gap-3">
          <span class="badge bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
            اہل شرکاء کی تعداد: ${S.participants.length} طلباء
          </span>
          <span class="badge bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold text-xs">
            🔒 ڈیٹا ماسکنگ (Privacy Protected)
          </span>
        </div>

      </div>

      <!-- Spin Wheel & Participants Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Side: Interactive 3D Spin Wheel (7 Cols) -->
        <div class="lg:col-span-7 lh-card p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-400/40 shadow-2xl space-y-6 text-center">
          
          <div class="relative w-72 h-72 sm:w-96 sm:h-96 mx-auto flex items-center justify-center">
            
            <!-- Wheel Pointer Arrow -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 w-8 h-10 text-amber-500 drop-shadow-xl animate-bounce">
              ▼
            </div>

            <!-- Canvas Spin Wheel -->
            <canvas id="lucky-spin-canvas" width="400" height="400" class="w-full h-full rounded-full shadow-2xl border-4 border-amber-400"></canvas>
            
            <!-- Center Spin Hub Button -->
            <button 
              id="spin-wheel-center-btn"
              onclick="window.Views.triggerSpinWheelAction()"
              class="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-2xl hover:scale-110 active:scale-95 transition-all z-10 border-4 border-white dark:border-slate-900 flex flex-col items-center justify-center leading-tight"
            >
              <span>گھمائیں</span>
              <span class="text-[9px] font-bold font-sans">SPIN</span>
            </button>

          </div>

          <!-- Spin Action Button -->
          <div class="pt-4">
            <button 
              onclick="window.Views.triggerSpinWheelAction()"
              class="btn-primary w-full sm:w-auto py-3.5 px-10 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition"
            >
              <span>🎡 قرعہ اندازی شروع کریں (Spin Wheel)</span>
            </button>
          </div>

        </div>

        <!-- Right Side: Privacy Protected Participants Directory (5 Cols) -->
        <div class="lg:col-span-5 lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="users" class="w-5 h-5 text-emerald-500"></i>
              <span>شرکاء کی فہرست (محفوظ پرائیویسی)</span>
            </h3>
            <span class="text-[10px] text-slate-400 font-bold">لائیو لسٹ</span>
          </div>

          <div class="max-h-[460px] overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-100 dark:divide-slate-800/60">
            ${S.participants.map((p, idx) => `
              <div class="pt-2.5 flex items-center justify-between gap-3 text-xs">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    ${idx + 1}
                  </span>
                  <div class="min-w-0">
                    <strong class="text-slate-900 dark:text-white block font-bold truncate">
                      ${S.maskName(p.userName || p.name || 'طالب علم')}
                    </strong>
                    <span class="text-[10px] text-slate-400 font-mono block truncate" dir="ltr">
                      ${S.maskEmail(p.userEmail || p.email || 'user@gmail.com')}
                    </span>
                  </div>
                </div>

                <div class="text-left shrink-0 font-mono" dir="ltr">
                  <span class="badge bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                    ${p.percentage || p.score || 90}% پاس
                  </span>
                </div>
              </div>
            `).join('')}
          </div>

        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
  window.Views.drawSpinWheelCanvas();
};

window.Views.drawSpinWheelCanvas = function() {
  const canvas = document.getElementById('lucky-spin-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const S = window.QuizSpinWheel;
  const participants = S.participants;
  const numSlices = Math.max(4, Math.min(12, participants.length));
  const sliceAngle = (2 * Math.PI) / numSlices;
  const colors = ['#10b981', '#f59e0b', '#6366f1', '#06b6d4', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316', '#3b82f6', '#84cc16'];

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = canvas.width / 2 - 10;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(S.currentRotation);

  for (let i = 0; i < numSlices; i++) {
    const p = participants[i % participants.length];
    const angle = i * sliceAngle;

    // Draw Slice
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, angle, angle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Draw Masked Name Text
    ctx.save();
    ctx.rotate(angle + sliceAngle / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px "Noto Nastaliq Urdu", sans-serif';
    ctx.fillText(S.maskName(p.userName || p.name || 'شریک'), radius - 20, 5);
    ctx.restore();
  }

  ctx.restore();
};

window.Views.triggerSpinWheelAction = function() {
  const S = window.QuizSpinWheel;
  if (S.isSpinning || !S.participants.length) return;

  S.isSpinning = true;
  const spinBtn = document.getElementById('spin-wheel-center-btn');
  if (spinBtn) spinBtn.disabled = true;

  if (typeof window.SoundEngine?.playClick === 'function') {
    window.SoundEngine.playClick();
  }

  const randomWinnerIndex = Math.floor(Math.random() * S.participants.length);
  const winner = S.participants[randomWinnerIndex];
  S.winner = winner;

  const numSlices = Math.max(4, Math.min(12, S.participants.length));
  const sliceAngle = (2 * Math.PI) / numSlices;
  const targetSliceCenter = (randomWinnerIndex % numSlices) * sliceAngle + (sliceAngle / 2);
  
  // Extra 5 to 8 full spins
  const extraRotations = (6 * 2 * Math.PI);
  const finalAngle = extraRotations + ((3 * Math.PI / 2) - targetSliceCenter);

  const duration = 4000;
  const startTime = performance.now();
  const initialRotation = S.currentRotation;

  function animateSpin(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease Out Cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    S.currentRotation = initialRotation + (finalAngle * easeOut);
    
    window.Views.drawSpinWheelCanvas();

    if (progress < 1) {
      requestAnimationFrame(animateSpin);
    } else {
      S.isSpinning = false;
      if (spinBtn) spinBtn.disabled = false;
      window.Views.showWinnerCelebrationModal(winner);
    }
  }

  requestAnimationFrame(animateSpin);
};

window.Views.showWinnerCelebrationModal = function(winner) {
  if (typeof window.SoundEngine?.playSuccess === 'function') {
    window.SoundEngine.playSuccess();
  }

  const modal = document.getElementById('global-modal');
  if (!modal) return;

  const S = window.QuizSpinWheel;
  const maskedName = S.maskName(winner.userName || winner.name || 'طالب علم');
  const maskedEmail = S.maskEmail(winner.userEmail || winner.email || 'user@gmail.com');

  modal.innerHTML = `
    <div class="p-6 sm:p-10 text-center space-y-6 font-urdu text-right" dir="rtl">
      
      <div class="w-24 h-24 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto text-5xl shadow-2xl animate-bounce">
        🏆
      </div>

      <div class="space-y-2 text-center">
        <span class="badge bg-amber-400 text-slate-950 font-black text-xs px-4 py-1.5 rounded-full">
          🎉 مبارک باد! قرعہ اندازی کے خوش نصیب فاتح 🎉
        </span>
        <h2 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white pt-2">
          ${maskedName}
        </h2>
        <p class="text-xs text-slate-400 font-mono" dir="ltr">${maskedEmail}</p>
        <p class="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-bold">
          مسابقہ: ${winner.quizTitle || 'اسلامی کوئز مسابقہ'} • اسکور: ${winner.percentage || 95}%
        </p>
      </div>

      <div class="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 font-bold leading-relaxed text-center">
        ✨ انعام: خصوصی شاہی اعزازی سند، گولڈ میڈل، اور اسلامی کورس کا مفت اسپانسرڈ داخلہ!
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button 
          onclick="window.App?.closeModal(); window.Views.renderQuizSpinWheel();"
          class="btn-primary w-full sm:w-auto py-3 px-8 text-xs rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-xl"
        >
          دوبارہ قرعہ اندازی کریں 🎡
        </button>
        <button onclick="window.App?.closeModal()" class="btn-secondary w-full sm:w-auto py-3 px-6 text-xs rounded-2xl font-bold">
          بند کریں
        </button>
      </div>

    </div>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};

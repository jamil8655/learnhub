/**
 * LearnHub Interactive Islamic Prize Spin Wheel & Lucky Draw Module
 * Royal Teal & Gold Mobile Edition
 */

window.Views = window.Views || {};

window.QuizSpinWheel = {
  isSpinning: false,
  currentRotation: 0,
  selectedQuizId: 'all',
  minScoreFilter: 70,
  participants: [
    { id: '1', userName: 'محمد طارق رحمن', userEmail: 'tariq.rahman@gmail.com', quizTitle: 'قرآنی تجوید مسابقہ', score: 95 },
    { id: '2', userName: 'عبد اللہ انصاری', userEmail: 'abdullah.ansari@yahoo.com', quizTitle: 'اربعین نووی کوئز', score: 100 },
    { id: '3', userName: 'فاطمہ زہراء', userEmail: 'fatima.zahra@outlook.com', quizTitle: 'سیرت النبی ﷺ مسابقہ', score: 90 },
    { id: '4', userName: 'عمر فاروق خان', userEmail: 'umar.farooq@gmail.com', quizTitle: 'فقہ و نماز کوئز', score: 85 },
    { id: '5', userName: 'عائشہ صدیقہ', userEmail: 'ayesha.s@gmail.com', quizTitle: 'قصص الانبیاء کوئز', score: 100 },
    { id: '6', userName: 'حسان بن ثابت', userEmail: 'hassan.thabit@gmail.com', quizTitle: 'عقیدہ و توحید مسابقہ', score: 92 }
  ],
  winner: null
};

window.Views.renderQuizSpinWheel = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const S = window.QuizSpinWheel;

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="rtl">
      
      <!-- Top Majestic Header (Teal & Gold) -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-4xl mx-auto px-4 py-5 sm:py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">🎡</span>
              <div>
                <h1 class="text-xl sm:text-2xl font-black font-arabic leading-tight">عَجَلَةُ الْحَظِّ وَالْجَوَائِزِ الإِسْلامِيَّةِ</h1>
                <p class="text-[11px] text-teal-200 font-sans">Islamic Quiz Lucky Spin Wheel & Prize Draw</p>
              </div>
            </div>
            <span class="px-3 py-1 rounded-xl bg-teal-900/80 text-amber-300 border border-teal-600/60 text-xs font-bold shadow-xs">
              انعامی قرعہ اندازی
            </span>
          </div>
        </div>

        <!-- 100% SINGLE-LINE Horizontal Controls Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-1.5">
          <div class="max-w-4xl mx-auto px-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            <span class="text-teal-200 text-xs font-bold shrink-0">🎯 شرکاء کی تعداد:</span>
            <span class="text-amber-300 font-bold text-xs shrink-0 font-mono">${S.participants.length} طلباء شامل</span>
            <span class="text-teal-400 shrink-0">•</span>
            <span class="text-teal-200 text-xs font-bold shrink-0">شرطِ شمولیت:</span>
            <span class="text-teal-100 font-bold text-xs shrink-0">70% یا زائد نمبرات</span>
          </div>
        </div>
      </div>

      <!-- Main Spin Wheel Arena -->
      <div class="max-w-md mx-auto px-4 py-8 space-y-6 text-center">
        
        <!-- Wheel Visual Container -->
        <div class="relative py-4 flex justify-center items-center">
          <div id="lucky-spin-circle" class="w-64 h-64 rounded-full bg-gradient-to-tr from-amber-500 via-teal-700 to-teal-900 border-8 border-amber-400 shadow-2xl flex items-center justify-center text-white transition-all duration-[3000ms] cubic-bezier(0.1, 0.7, 0.1, 1)">
            <div class="w-20 h-20 rounded-full bg-slate-950 border-4 border-amber-400 flex flex-col items-center justify-center shadow-inner">
              <span class="text-2xl">🎁</span>
              <span class="text-[9px] font-bold text-amber-300 font-urdu">انعام</span>
            </div>
          </div>
          <!-- Pointer -->
          <div class="absolute top-2 text-2xl filter drop-shadow-md">
            🔻
          </div>
        </div>

        <!-- Spin Action Button -->
        <button 
          id="spin-wheel-btn"
          onclick="window.Views.spinWheelAction()"
          class="w-full py-3.5 px-6 rounded-2xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-black text-sm shadow-lg border-2 border-amber-400 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>🎡 قرعہ اندازی شروع کریں (SPIN)</span>
        </button>

        <!-- Winner Display Area -->
        <div id="lucky-winner-card" class="hidden p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-400 shadow-xl space-y-2 animate-bounce">
          <!-- Rendered dynamically -->
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.spinWheelAction = function() {
  const S = window.QuizSpinWheel;
  if (S.isSpinning) return;
  S.isSpinning = true;

  const btn = document.getElementById('spin-wheel-btn');
  if (btn) btn.disabled = true;

  const wheel = document.getElementById('lucky-spin-circle');
  const randRots = 1800 + Math.floor(Math.random() * 1440);
  S.currentRotation += randRots;

  if (wheel) {
    wheel.style.transform = `rotate(${S.currentRotation}deg)`;
  }

  setTimeout(() => {
    S.isSpinning = false;
    if (btn) btn.disabled = false;
    const winnerIdx = Math.floor(Math.random() * S.participants.length);
    const winner = S.participants[winnerIdx];
    
    const card = document.getElementById('lucky-winner-card');
    if (card) {
      card.classList.remove('hidden');
      card.innerHTML = `
        <span class="text-2xl block">🎉🏆🎉</span>
        <h3 class="text-base font-black text-slate-900 dark:text-white font-arabic">مبارک ہو! فاتح منتخب ہو گیا:</h3>
        <p class="text-lg font-black text-amber-500 font-urdu">${winner.userName}</p>
        <p class="text-xs text-teal-700 dark:text-teal-400 font-bold">${winner.quizTitle} • حاصل کردہ نمبر: ${winner.score}%</p>
      `;
    }

    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    window.App?.showToast(`🎉 مبارک ہو! فاتح: ${winner.userName}`, 'success');
  }, 3200);
};

/**
 * LearnHub Interactive Islamic Prize Spin Wheel & Lucky Draw Module
 * Royal Teal & Gold Trilingual Edition (English-First Default)
 */

window.Views = window.Views || {};

window.QuizSpinWheel = {
  isSpinning: false,
  currentRotation: 0,
  selectedQuizId: 'all',
  minScoreFilter: 70,
  participants: [
    { id: '1', userName: 'Tariq Rahman', userEmail: 'tariq.rahman@gmail.com', quizTitle: 'Tajweed Master Exam', score: 95 },
    { id: '2', userName: 'Abdullah Ansari', userEmail: 'abdullah.ansari@yahoo.com', quizTitle: '40 Hadith Nawawi Quiz', score: 100 },
    { id: '3', userName: 'Fatima Zahra', userEmail: 'fatima.zahra@outlook.com', quizTitle: 'Seerah Timeline Exam', score: 90 },
    { id: '4', userName: 'Umar Farooq Khan', userEmail: 'umar.farooq@gmail.com', quizTitle: 'Fiqh al-Salah Test', score: 85 },
    { id: '5', userName: 'Ayesha Siddiqa', userEmail: 'ayesha.s@gmail.com', quizTitle: 'Stories of Prophets', score: 100 },
    { id: '6', userName: 'Hassan bin Thabit', userEmail: 'hassan.thabit@gmail.com', quizTitle: 'Aqeedah & Tawheed Quiz', score: 92 }
  ],
  winner: null
};

window.Views.renderQuizSpinWheel = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';

  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');
  const S = window.QuizSpinWheel;

  const L = {
    title: isRtl ? (lang === 'ur' ? 'عَجَلَةُ الْحَظِّ وَالْجَوَائِزِ الإِسْلامِيَّةِ' : 'عجلة الجوائز الإسلامية') : 'Islamic Quiz Lucky Spin & Rewards Wheel',
    sub: isRtl ? 'اعلیٰ نمبرات حاصل کرنے والے طلباء کے لیے انعامی قرعہ اندازی' : 'Daily Academic Honors & Prize Draw for Top-Scoring Scholars',
    badge: isRtl ? 'انعامی قرعہ اندازی' : 'Academic Lucky Draw',
    participantsLabel: isRtl ? '🎯 شرکاء کی تعداد:' : '🎯 Qualified Scholars:',
    studentsCount: isRtl ? `${S.participants.length} طلباء شامل` : `${S.participants.length} Eligible Scholars`,
    conditionLabel: isRtl ? 'شرطِ شمولیت:' : 'Eligibility Threshold:',
    conditionText: isRtl ? '70% یا زائد نمبرات' : 'Score >= 70%',
    prizeLabel: isRtl ? 'انعام' : 'Reward',
    spinBtn: isRtl ? '🎡 قرعہ اندازی شروع کریں (SPIN)' : '🎡 SPIN THE REWARDS WHEEL',
    winnerAnnounce: isRtl ? '🎉 مبارک ہو! فاتح منتخب ہو گئے:' : '🎉 Congratulations! Winning Scholar Drawn:'
  };

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 ${fontClass} text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Top Majestic Header (Teal & Gold) -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-4xl mx-auto px-4 py-5 sm:py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">🎡</span>
              <div>
                <h1 class="text-xl sm:text-2xl font-black font-arabic leading-tight">${L.title}</h1>
                <p class="text-[11px] text-teal-200 font-sans">${L.sub}</p>
              </div>
            </div>
            <span class="px-3 py-1 rounded-xl bg-teal-900/80 text-amber-300 border border-teal-600/60 text-xs font-bold shadow-xs">
              ${L.badge}
            </span>
          </div>
        </div>

        <!-- 100% SINGLE-LINE Horizontal Controls Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-1.5">
          <div class="max-w-4xl mx-auto px-3 flex items-center gap-2 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            <span class="text-teal-200 text-xs font-bold shrink-0">${L.participantsLabel}</span>
            <span class="text-amber-300 font-bold text-xs shrink-0 font-mono">${L.studentsCount}</span>
            <span class="text-teal-400 shrink-0">•</span>
            <span class="text-teal-200 text-xs font-bold shrink-0">${L.conditionLabel}</span>
            <span class="text-teal-100 font-bold text-xs shrink-0">${L.conditionText}</span>
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
              <span class="text-[10px] font-bold text-amber-300 font-sans">${L.prizeLabel}</span>
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
          <span>${L.spinBtn}</span>
        </button>

        <!-- Winner Display Area -->
        <div id="lucky-winner-card" class="hidden p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-400 shadow-xl space-y-2">
          <!-- Rendered dynamically -->
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.spinWheelAction = function() {
  const S = window.QuizSpinWheel;
  if (S.isSpinning || S.participants.length === 0) return;

  S.isSpinning = true;
  const wheel = document.getElementById('lucky-spin-circle');
  const btn = document.getElementById('spin-wheel-btn');
  const winnerCard = document.getElementById('lucky-winner-card');

  if (winnerCard) winnerCard.classList.add('hidden');
  if (btn) {
    btn.disabled = true;
    btn.classList.add('opacity-60', 'cursor-not-allowed');
  }

  const randomDegrees = 1440 + Math.floor(Math.random() * 1440);
  S.currentRotation += randomDegrees;

  if (wheel) {
    wheel.style.transform = 'rotate(' + S.currentRotation + 'deg)';
  }

  setTimeout(() => {
    S.isSpinning = false;
    const winnerIdx = Math.floor(Math.random() * S.participants.length);
    S.winner = S.participants[winnerIdx];

    if (btn) {
      btn.disabled = false;
      btn.classList.remove('opacity-60', 'cursor-not-allowed');
    }

    if (winnerCard && S.winner) {
      winnerCard.innerHTML = `
        <div class="space-y-2">
          <span class="text-3xl">🏆</span>
          <h3 class="text-base font-extrabold text-amber-500">${S.winner.userName}</h3>
          <p class="text-xs text-slate-600 dark:text-slate-300 font-semibold">${S.winner.quizTitle} (${S.winner.score}%)</p>
          <div class="inline-block px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-400/40">
            🏅 Award: Verified Diploma & Gold Honors
          </div>
        </div>
      `;
      winnerCard.classList.remove('hidden');
    }

    window.App?.showToast('🎉 Winner Drawn: ' + S.winner.userName, 'success');
  }, 3200);
};

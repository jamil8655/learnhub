/**
 * LearnHub Real-Time Islamic Quiz Battle Arena (v174.0.0)
 * Royal Teal & Gold Interactive Matchmaking & Speed Battle Suite
 */

window.Views = window.Views || {};

window.Views.selectedBattleCategory = 'quran';

window.Views.setBattleCategory = function(cat) {
  window.Views.selectedBattleCategory = cat;
  window.Views.renderQuizBattle();
};

window.Views.startBattleMatchmaking = function() {
  const container = document.getElementById('battle-arena-content');
  if (!container) return;

  const catNames = {
    quran: 'علوم القرآن',
    hadith: 'حدیث و سنت',
    seerah: 'سیرت النبی ﷺ',
    fiqh: 'فقہ و عبادات'
  };
  const cat = window.Views.selectedBattleCategory || 'quran';
  const catName = catNames[cat] || 'عمومی اسلامی معلومات';

  container.innerHTML = `
    <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6 text-center animate-fade-in">
      <div class="w-20 h-20 rounded-full border-4 border-amber-400 border-t-teal-700 animate-spin mx-auto flex items-center justify-center text-2xl shadow-lg">
        ⚔️
      </div>
      <div class="space-y-2">
        <span class="px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold font-mono">
          شعبہ: ${catName}
        </span>
        <h2 class="text-xl font-black text-slate-900 dark:text-white">لائیو حریف تلاش کیا جا رہا ہے...</h2>
        <p class="text-xs text-slate-500">آن لائن طلباء کے ساتھ میچ میکنگ جاری ہے (تخمینہ: 3 سیکنڈ)</p>
      </div>
      <div class="pt-2">
        <button onclick="window.Views.renderQuizBattle()" class="btn-secondary py-2 px-6 rounded-xl text-xs font-bold">
          منسوخ کریں (Cancel)
        </button>
      </div>
    </div>
  `;

  setTimeout(() => {
    window.Views.launchBattleRound();
  }, 2500);
};

window.Views.launchBattleRound = function() {
  const container = document.getElementById('battle-arena-content');
  if (!container) return;

  const questionsPool = [
    { q: 'قرآن مجید کی سب سے عظیم آیت کون سی ہے؟', options: ['آیت الکرسی', 'آیت المداینہ', 'آیت البر', 'آیت الحجاب'], correct: 0 },
    { q: 'صحیح بخاری کے مصنف کا اصل نام کیا ہے؟', options: ['محمد بن اسماعیلؒ', 'مسلم بن الحجاجؒ', 'احمد بن حنبلؒ', 'مالک بن انسؒ'], correct: 0 },
    { q: 'غزوہ بدر کس ہجری سال میں پیش آیا؟', options: ['2 ہجری', '3 ہجری', '5 ہجری', '8 ہجری'], correct: 0 }
  ];
  const q = questionsPool[Math.floor(Math.random() * questionsPool.length)];

  container.innerHTML = `
    <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6 text-center animate-fade-in">
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">آپ</div>
          <span class="text-xs font-bold text-slate-700 dark:text-slate-300">طالبِ علم</span>
        </div>
        <div class="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-500 font-mono font-bold text-xs animate-pulse">
          ⚡ راؤنڈ 1 / 3
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-slate-700 dark:text-slate-300">عبداللہ (مدینہ)</span>
          <div class="w-8 h-8 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">حریف</div>
        </div>
      </div>

      <div class="space-y-2 text-center py-2">
        <span class="text-xs text-teal-600 dark:text-teal-400 font-bold">سوال نمبر 1:</span>
        <h3 class="text-lg font-black text-slate-900 dark:text-white leading-relaxed">${q.q}</h3>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="battle-options-box">
        ${q.options.map((opt, idx) => `
          <button onclick="window.Views.answerBattleOption(${idx}, ${q.correct})" class="battle-opt-btn p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-teal-500 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 transition text-center shadow-xs">
            ${opt}
          </button>
        `).join('')}
      </div>

      <div id="battle-feedback-box" class="hidden"></div>
    </div>
  `;
};

window.Views.answerBattleOption = function(selectedIdx, correctIdx) {
  const btns = document.querySelectorAll('.battle-opt-btn');
  btns.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correctIdx) {
      btn.className = 'p-4 rounded-2xl bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-md border-2 border-emerald-400';
    } else if (idx === selectedIdx) {
      btn.className = 'p-4 rounded-2xl bg-rose-600 text-white font-black text-xs sm:text-sm shadow-md border-2 border-rose-400';
    }
  });

  const fbBox = document.getElementById('battle-feedback-box');
  if (fbBox) {
    fbBox.classList.remove('hidden');
    const isWin = selectedIdx === correctIdx;
    fbBox.innerHTML = `
      <div class="p-4 rounded-2xl ${isWin ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'} text-xs font-bold flex items-center justify-between">
        <span>${isWin ? 'ماشاءاللہ! درست جواب (+50 XP)' : 'افسوس! غلط جواب (+10 XP)'}</span>
        <button onclick="window.Views.renderQuizBattle()" class="btn-primary py-1.5 px-4 rounded-xl text-xs font-bold">
          اگلا مقابلہ
        </button>
      </div>
    `;
    if (isWin && window.CloudDB && typeof window.CloudDB.recordXpTransaction === 'function') {
      const user = window.Auth ? window.Auth.getCurrentUser() : null;
      if (user) window.CloudDB.recordXpTransaction(user.id, 50, 'quiz_battle_win', 'Won 1v1 Quiz Battle');
    }
  }
};

window.Views.renderQuizBattle = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentCat = window.Views.selectedBattleCategory || 'quran';

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="rtl">
      
      <!-- Top Majestic Header (Teal & Gold) -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-4xl mx-auto px-4 py-5 sm:py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">⚔️</span>
              <div>
                <h1 class="text-xl sm:text-2xl font-black font-arabic leading-tight">مَيْدَانُ التَّحَدِّي وَالْمُنَافَسَةِ</h1>
                <p class="text-[11px] text-teal-200 font-sans">Real-Time Islamic 1v1 Quiz Battle Arena</p>
              </div>
            </div>
            <span class="px-3 py-1 rounded-xl bg-teal-900/80 text-amber-300 border border-teal-600/60 text-xs font-bold shadow-xs">
              1v1 لائیو مقابلہ
            </span>
          </div>
        </div>

        <!-- 100% SINGLE-LINE Horizontal Battle Categories Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-1.5">
          <div class="max-w-4xl mx-auto px-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            <button onclick="window.Views.setBattleCategory('quran')" class="shrink-0 py-1 px-3 rounded-xl ${currentCat === 'quran' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 border border-teal-700/40'}">
              📖 علوم القرآن
            </button>
            <button onclick="window.Views.setBattleCategory('hadith')" class="shrink-0 py-1 px-3 rounded-xl ${currentCat === 'hadith' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 border border-teal-700/40'}">
              📜 حدیث و سنت
            </button>
            <button onclick="window.Views.setBattleCategory('seerah')" class="shrink-0 py-1 px-3 rounded-xl ${currentCat === 'seerah' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 border border-teal-700/40'}">
              🕌 سیرت النبی ﷺ
            </button>
            <button onclick="window.Views.setBattleCategory('fiqh')" class="shrink-0 py-1 px-3 rounded-xl ${currentCat === 'fiqh' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 border border-teal-700/40'}">
              ⚖️ فقہ و عبادات
            </button>
          </div>
        </div>
      </div>

      <!-- Main Matchmaking Canvas -->
      <div class="max-w-md mx-auto px-4 py-8 space-y-6 text-center" id="battle-arena-content">
        
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 mx-auto flex items-center justify-center text-2xl border border-teal-600/30">
            ⚔️
          </div>

          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white">آن لائن حریف کی تلاش</h2>
            <p class="text-xs text-slate-500 mt-1">کسی بھی ساتھی طالب علم کے ساتھ علمی مقابلہ شروع کریں</p>
          </div>

          <button onclick="window.Views.startBattleMatchmaking()" class="w-full py-3 rounded-2xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs shadow-xs border border-teal-600 active:scale-95 transition cursor-pointer">
            فوری مقابلہ شروع کریں (Find Match)
          </button>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

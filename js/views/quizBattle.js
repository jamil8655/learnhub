/**
 * LearnHub 1-v-1 Islamic Quiz Battle Arena Module
 * Fast-paced 5-round rapid-fire live duel vs Friend or AI Challenger
 * with live tug-of-war score bar and victory confetti.
 */

window.Views = window.Views || {};

window.QuizBattle = {
  round: 1,
  maxRounds: 5,
  playerScore: 0,
  opponentScore: 0,
  currentQIndex: 0,
  selectedAnswer: null,
  isGameOver: false,
  questions: [
    {
      q: 'قرآن مجید کی سب سے عظیم اور لمبی آیت کون سی ہے؟',
      options: ['آیۃ الکرسی', 'آیتِ مدائنت (قرض کی آیت)', 'آیتِ تطہیر', 'آیتِ شفا'],
      correct: 1,
      exp: 'قرآن مجید کی سب سے لمبی آیت سورۃ البقرہ کی آیت نمبر 282 ہے جسے "آیۃ المدائنت" (قرض کا لین دین) کہتے ہیں۔'
    },
    {
      q: 'اربعین نووی میں کل کتنی منتخب احادیث جمع کی گئی ہیں؟',
      options: ['40 احادیث', '42 احادیث', '50 احادیث', '100 احادیث'],
      correct: 1,
      exp: 'امام نووی رحمہ اللہ نے بنیادی طور پر 42 احادیثِ صحیحہ جمع فرمائی تھیں۔'
    },
    {
      q: 'رسول اللہ ﷺ نے مدینہ منورہ پہنچ کر سب سے پہلے کون سی مسجد تعمیر فرمائی؟',
      options: ['مسجد نبوی', 'مسجد قبا', 'مسجد قبلتین', 'مسجد جمعہ'],
      correct: 1,
      exp: 'سب سے پہلی مسجد "مسجدِ قبا" ہے جس کی بنیاد رسول اللہ ﷺ نے ہجرت کے وقت رکھی۔'
    },
    {
      q: 'اسلام کے کس رکن کو "ستونِ دین" (عماد الدین) قرار دیا گیا ہے؟',
      options: ['روزہ', 'نماز', 'زکوٰۃ', 'حج'],
      correct: 1,
      exp: 'رسول اللہ ﷺ نے فرمایا: "الصَّلَاةُ عِمَادُ الدِّينِ" (نماز دین کا ستون ہے)۔'
    },
    {
      q: 'غزوہ بدر کس ہجری میں اور کس ماہِ مبارک میں پیش آیا؟',
      options: ['2 ہجری، رمضان المبارک', '3 ہجری، شوال', '5 ہجری، ذوالقعدہ', '8 ہجری، رمضان'],
      correct: 0,
      exp: 'غزوہ بدر 17 رمضان المبارک 2 ہجری کو حق و باطل کا پہلا فیصلہ کن معرکہ تھا۔'
    }
  ]
};

window.Views.renderQuizBattle = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const B = window.QuizBattle;
  const user = window.Auth ? window.Auth.getCurrentUser() : { name: 'جمیل رحمن' };
  const currentQ = B.questions[B.currentQIndex] || B.questions[0];

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Battle Top Scoreboard Header -->
      <div class="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden border-2 border-rose-500/40">
        <div class="flex items-center justify-between gap-4">
          
          <!-- Player 1 (You) -->
          <div class="flex items-center gap-3 text-right">
            <img src="${user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}" class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-emerald-400 object-cover shadow-lg shrink-0">
            <div>
              <h4 class="font-black text-sm sm:text-base text-white truncate max-w-[120px] sm:max-w-none">${user?.name || 'آپ'}</h4>
              <div class="text-xl sm:text-2xl font-mono font-black text-emerald-400">${B.playerScore} Pts</div>
            </div>
          </div>

          <!-- VS Badge & Round Counter -->
          <div class="text-center shrink-0">
            <span class="w-10 h-10 rounded-full bg-rose-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-lg animate-pulse">VS</span>
            <div class="text-[10px] font-bold text-slate-400 mt-1">راؤنڈ ${B.round} / ${B.maxRounds}</div>
          </div>

          <!-- Player 2 (Challenger) -->
          <div class="flex items-center gap-3 text-left" dir="ltr">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-rose-400 object-cover shadow-lg shrink-0">
            <div>
              <h4 class="font-black text-sm sm:text-base text-white truncate max-w-[120px] sm:max-w-none">شیخ حذیفہ (مخالف)</h4>
              <div class="text-xl sm:text-2xl font-mono font-black text-rose-400">${B.opponentScore} Pts</div>
            </div>
          </div>

        </div>
      </div>

      ${!B.isGameOver ? `
        <!-- Active Question Card -->
        <div class="lh-card p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/30 shadow-2xl space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span class="badge bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
              تیز رفتار سوال نمبر ${B.currentQIndex + 1}
            </span>
            <span class="text-xs font-mono font-bold text-amber-500">⏱️ وقت: 15 سیکنڈ</span>
          </div>

          <h2 class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-relaxed">
            ${currentQ.q}
          </h2>

          <!-- Options Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            ${currentQ.options.map((opt, idx) => `
              <button 
                onclick="window.Views.selectBattleOption(${idx})"
                class="p-4 rounded-2xl border-2 text-right transition-all flex items-center justify-between font-bold text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 active:scale-95 shadow-sm"
              >
                <span>${opt}</span>
                <span class="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs flex items-center justify-center font-mono">${idx + 1}</span>
              </button>
            `).join('')}
          </div>
        </div>
      ` : `
        <!-- Game Over / Victory Modal -->
        <div class="lh-card p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border-4 ${B.playerScore >= B.opponentScore ? 'border-amber-400 shadow-amber-500/20' : 'border-rose-500'} shadow-2xl text-center space-y-6">
          <div class="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center text-5xl shadow-2xl ${B.playerScore >= B.opponentScore ? 'bg-amber-400 text-slate-950 animate-bounce' : 'bg-slate-200 text-slate-600'}">
            ${B.playerScore >= B.opponentScore ? '🏆' : '🥈'}
          </div>

          <div class="space-y-2">
            <span class="badge bg-amber-400 text-slate-950 font-black text-xs px-4 py-1.5 rounded-full">
              ${B.playerScore >= B.opponentScore ? '🎉 فتح مبارک! (Victory)' : '🤝 شاندار مقابلہ! (Well Played)'}
            </span>
            <h2 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              ${B.playerScore >= B.opponentScore ? 'آپ نے مقابلہ جیت لیا!' : 'مخالف کھلاڑی فتح یاب ہوا'}
            </h2>
            <div class="text-2xl font-mono font-black text-amber-500">
              ${B.playerScore} Pts vs ${B.opponentScore} Pts
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button onclick="window.Views.restartBattle()" class="btn-primary py-3 px-8 text-xs rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-xl">
              دوبارہ مقابلہ کھیلیں ⚔️
            </button>
            <a href="#/adventure" class="btn-secondary py-3 px-6 text-xs rounded-2xl font-bold">
              ایڈونچر نقشہ پر واپس جائیں
            </a>
          </div>
        </div>
      `}

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.selectBattleOption = function(optIndex) {
  const B = window.QuizBattle;
  const currentQ = B.questions[B.currentQIndex];

  if (optIndex === currentQ.correct) {
    B.playerScore += 100;
    if (typeof window.SoundEngine?.playSuccess === 'function') {
      window.SoundEngine.playSuccess();
    }
  } else {
    if (typeof window.SoundEngine?.playWrong === 'function') {
      window.SoundEngine.playWrong();
    }
  }

  // Opponent AI Simulation score
  if (Math.random() > 0.35) {
    B.opponentScore += 100;
  }

  if (B.currentQIndex < B.questions.length - 1) {
    B.currentQIndex++;
    B.round++;
  } else {
    B.isGameOver = true;
  }

  window.Views.renderQuizBattle();
};

window.Views.restartBattle = function() {
  const B = window.QuizBattle;
  B.round = 1;
  B.playerScore = 0;
  B.opponentScore = 0;
  B.currentQIndex = 0;
  B.isGameOver = false;
  window.Views.renderQuizBattle();
};

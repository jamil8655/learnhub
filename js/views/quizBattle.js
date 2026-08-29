/**
 * LearnHub 1-v-1 Islamic Quiz Battle Arena Module
 * Pure White Luxury SaaS Edition
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
    <div class="min-h-screen bg-white dark:bg-slate-900 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="rtl">
      
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        <!-- Scoreboard Header -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-700 shadow-sm">
          <div class="flex items-center justify-between gap-4">
            
            <!-- Player 1 (You) -->
            <div class="flex items-center gap-3 text-right">
              <img src="${user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}" class="w-12 h-12 rounded-2xl border-2 border-teal-600 object-cover shadow-sm shrink-0">
              <div>
                <h4 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[110px] sm:max-w-none">${user?.name || 'آپ'}</h4>
                <div class="text-lg sm:text-xl font-mono font-black text-teal-700 dark:text-teal-400">${B.playerScore} Pts</div>
              </div>
            </div>

            <!-- VS Badge -->
            <div class="text-center shrink-0">
              <span class="w-9 h-9 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center mx-auto shadow-md">VS</span>
              <div class="text-[10px] font-bold text-slate-400 mt-1">راؤنڈ ${B.round} / ${B.maxRounds}</div>
            </div>

            <!-- Player 2 (Challenger) -->
            <div class="flex items-center gap-3 text-left" dir="ltr">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" class="w-12 h-12 rounded-2xl border-2 border-rose-500 object-cover shadow-sm shrink-0">
              <div>
                <h4 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[110px] sm:max-w-none">شیخ حذیفہ (مخالف)</h4>
                <div class="text-lg sm:text-xl font-mono font-black text-rose-500">${B.opponentScore} Pts</div>
              </div>
            </div>

          </div>
        </div>

        ${!B.isGameOver ? `
          <!-- Question Card -->
          <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-5">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <span class="inline-block px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-xs border border-teal-600/30">
                تیز رفتار سوال نمبر ${B.currentQIndex + 1}
              </span>
              <span class="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">⏱️ وقت: 15 سیکنڈ</span>
            </div>

            <h2 class="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
              ${currentQ.q}
            </h2>

            <!-- Options -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              ${currentQ.options.map((opt, idx) => `
                <button 
                  onclick="window.Views.selectBattleOption(${idx})"
                  class="p-4 rounded-2xl border text-right transition-all flex items-center justify-between font-bold text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 hover:border-teal-600 hover:bg-teal-50/50 dark:hover:bg-teal-950/40 active:scale-95 shadow-sm"
                >
                  <span>${opt}</span>
                  <span class="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs flex items-center justify-center font-mono">${idx + 1}</span>
                </button>
              `).join('')}
            </div>
          </div>
        ` : `
          <!-- Game Over Modal -->
          <div class="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm text-center space-y-5">
            <div class="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-md ${B.playerScore >= B.opponentScore ? 'bg-amber-400 text-slate-950 animate-bounce' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}">
              ${B.playerScore >= B.opponentScore ? '🏆' : '🥈'}
            </div>

            <div class="space-y-1">
              <span class="inline-block px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-600/30">
                ${B.playerScore >= B.opponentScore ? '🎉 فتح مبارک! (Victory)' : '🤝 شاندار مقابلہ! (Well Played)'}
              </span>
              <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white pt-2">
                ${B.playerScore >= B.opponentScore ? 'آپ نے مقابلہ جیت لیا!' : 'مخالف کھلاڑی فتح یاب ہوا'}
              </h2>
              <div class="text-xl font-mono font-black text-teal-700 dark:text-teal-400 pt-1">
                ${B.playerScore} Pts vs ${B.opponentScore} Pts
              </div>
            </div>

            <div class="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button onclick="window.Views.restartBattle()" class="py-2.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition active:scale-95">
                دوبارہ مقابلہ کھیلیں ⚔️
              </button>
              <a href="#/adventure" class="py-2.5 px-6 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition">
                ایڈونچر نقشہ پر واپس جائیں
              </a>
            </div>
          </div>
        `}

      </div>
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

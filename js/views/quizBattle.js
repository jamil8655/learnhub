/**
 * LearnHub Real-Time Islamic Quiz Battle Arena
 * Royal Teal & Gold Mobile Edition
 */

window.Views = window.Views || {};

window.Views.renderQuizBattle = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

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
            <button class="shrink-0 py-1 px-3 rounded-xl bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40">
              📖 علوم القرآن
            </button>
            <button class="shrink-0 py-1 px-3 rounded-xl bg-teal-950/60 text-teal-200 border border-teal-700/40">
              📜 حدیث و سنت
            </button>
            <button class="shrink-0 py-1 px-3 rounded-xl bg-teal-950/60 text-teal-200 border border-teal-700/40">
              🕌 سیرت النبی ﷺ
            </button>
            <button class="shrink-0 py-1 px-3 rounded-xl bg-teal-950/60 text-teal-200 border border-teal-700/40">
              ⚖️ فقہ و عبادات
            </button>
          </div>
        </div>
      </div>

      <!-- Main Matchmaking Canvas -->
      <div class="max-w-md mx-auto px-4 py-8 space-y-6 text-center">
        
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 mx-auto flex items-center justify-center text-2xl border border-teal-600/30">
            ⚔️
          </div>

          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white">آن لائن حریف کی تلاش</h2>
            <p class="text-xs text-slate-500 mt-1">کسی بھی ساتھی طالب علم کے ساتھ علمی مقابلہ شروع کریں</p>
          </div>

          <button onclick="window.App?.showToast('حریف کی تلاش جاری ہے... 🔍', 'info')" class="w-full py-3 rounded-2xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs shadow-xs border border-teal-600">
            فوری مقابلہ شروع کریں (Find Match)
          </button>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

/**
 * LearnHub Settings Suite v144
 * Royal Teal & Gold Mobile Edition
 */

window.Views = window.Views || {};

window.Views.renderSettings = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentLang = window.I18N ? window.I18N.getLanguage() : 'ur';
  const isDark = document.documentElement.classList.contains('dark');
  const notifPush = localStorage.getItem('learnhub_setting_notif_push') !== 'false';
  const soundTasbeeh = localStorage.getItem('learnhub_setting_tasbeeh_audio') !== 'false';

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="rtl">
      
      <!-- Top Majestic Header (Teal & Gold) -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-4xl mx-auto px-4 py-5 sm:py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">⚙️</span>
              <div>
                <h1 class="text-xl sm:text-2xl font-black font-arabic leading-tight">إِعْدَادَاتُ التَّطْبِيقِ</h1>
                <p class="text-[11px] text-teal-200 font-sans">App Settings & Preferences • LearnHub Platform</p>
              </div>
            </div>
            <button onclick="window.history.back()" class="p-2 rounded-xl bg-teal-900/80 text-amber-300 border border-teal-600/60 text-xs font-bold">
              &larr; واپس
            </button>
          </div>
        </div>

        <!-- 100% SINGLE-LINE Horizontal Quick Preferences Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-1.5">
          <div class="max-w-4xl mx-auto px-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            <span class="text-teal-200 text-xs font-bold shrink-0">زبان (Language):</span>
            <button onclick="window.I18N && window.I18N.setLanguage('ur'); window.Views.renderSettings();" class="shrink-0 py-1 px-2.5 rounded-xl font-bold ${currentLang === 'ur' ? 'bg-teal-700 text-amber-300 border border-amber-400/40' : 'bg-teal-950/60 text-teal-200'}">
              اردو
            </button>
            <button onclick="window.I18N && window.I18N.setLanguage('ar'); window.Views.renderSettings();" class="shrink-0 py-1 px-2.5 rounded-xl font-bold ${currentLang === 'ar' ? 'bg-teal-700 text-amber-300 border border-amber-400/40' : 'bg-teal-950/60 text-teal-200'}">
              عربي
            </button>
            <button onclick="window.I18N && window.I18N.setLanguage('en'); window.Views.renderSettings();" class="shrink-0 py-1 px-2.5 rounded-xl font-bold ${currentLang === 'en' ? 'bg-teal-700 text-amber-300 border border-amber-400/40' : 'bg-teal-950/60 text-teal-200'}">
              English
            </button>
          </div>
        </div>
      </div>

      <!-- Main Settings Body Canvas -->
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-5 space-y-4">
        
        <!-- Appearance Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
          <h3 class="text-xs font-black text-teal-800 dark:text-teal-300">ظاہری شکل و صورت (Theme):</h3>
          
          <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p class="font-bold text-slate-900 dark:text-white">ڈارک موڈ (Dark Theme)</p>
              <p class="text-[10px] text-slate-500">رات کے وقت مطالعے کے لیے آنکھوں کے لیے آرام دہ</p>
            </div>
            <button onclick="window.App?.toggleDarkMode(); window.Views.renderSettings();" class="py-1.5 px-4 rounded-xl font-bold text-xs ${isDark ? 'bg-teal-800 text-amber-300 border border-teal-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'}">
              ${isDark ? 'آن ہے 🌙' : 'آف ہے ☀️'}
            </button>
          </div>

          <div class="flex items-center justify-between py-2 text-xs">
            <div>
              <p class="font-bold text-slate-900 dark:text-white">تسبیح آڈیو کلکس (Sound Effects)</p>
              <p class="text-[10px] text-slate-500">ذکر کے دوران صوتی فیڈ بیک</p>
            </div>
            <button onclick="localStorage.setItem('learnhub_setting_tasbeeh_audio', '${!soundTasbeeh}'); window.Views.renderSettings();" class="py-1.5 px-4 rounded-xl font-bold text-xs ${soundTasbeeh ? 'bg-teal-800 text-amber-300 border border-teal-600' : 'bg-slate-200 text-slate-700'}">
              ${soundTasbeeh ? 'فعال 🔊' : 'غیر فعال 🔇'}
            </button>
          </div>
        </div>

        <!-- About & Version Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between text-xs">
          <div>
            <p class="font-bold text-slate-900 dark:text-white">LearnHub Super Islamic App</p>
            <p class="text-[10px] text-teal-700 dark:text-teal-400">ورژن 147.0.0 • مستند اسلامی پلیٹ فارم</p>
          </div>
          <span class="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-mono font-bold">
            v147.0.0
          </span>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

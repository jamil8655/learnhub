/**
 * LearnHub V2 Modern User Profile & Settings
 */

window.Views = window.Views || {};
window.Views.v2 = window.Views.v2 || {};

window.Views.v2.renderProfile = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const user = window.Auth.getCurrentUser() || { name: 'صارف', email: '', role: 'student', xp: 350, level: 1 };
  const isRtl = window.I18N ? window.I18N.isRTL() : false;
  const theme = window.UI_CONFIG ? window.UI_CONFIG.getTheme() : 'light';

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Profile Header Card -->
      <div class="v2-card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-start">
        <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}" class="w-24 h-24 rounded-3xl object-cover border-4 border-emerald-500 shadow-xl" alt="${user.name}">
        <div class="flex-1 space-y-1">
          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 class="text-2xl font-black text-slate-900 dark:text-white">${user.name}</h1>
            <span class="v2-badge v2-badge-emerald">${user.role === 'admin' || user.role === 'super_admin' ? 'ایڈمنسٹریٹر' : 'طالب علم'}</span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-mono">${user.email}</p>
          <div class="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span class="flex items-center gap-1"><i data-lucide="zap" class="w-4 h-4 text-amber-500"></i> ${user.xp || 350} XP</span>
            <span class="flex items-center gap-1"><i data-lucide="award" class="w-4 h-4 text-cyan-500"></i> لیول ${user.level || 1}</span>
            <span class="flex items-center gap-1"><i data-lucide="flame" class="w-4 h-4 text-orange-500"></i> ${user.streak || 5} روزانہ تسلسل</span>
          </div>
        </div>
      </div>

      <!-- Settings & Appearance -->
      <div class="v2-card p-6 space-y-6">
        <h2 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
          <i data-lucide="palette" class="w-5 h-5 text-indigo-500"></i>
          <span>تھیم و ترتیبات (Appearance & Theme)</span>
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button onclick="window.UI_CONFIG.setTheme('light')" class="p-4 rounded-2xl border-2 ${theme === 'light' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 dark:border-slate-700'} text-center space-y-2 transition">
            <div class="text-2xl">☀️</div>
            <div class="text-xs font-black text-slate-900 dark:text-white">دن کا موڈ (Light)</div>
          </button>

          <button onclick="window.UI_CONFIG.setTheme('sepia')" class="p-4 rounded-2xl border-2 ${theme === 'sepia' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200 dark:border-slate-700'} text-center space-y-2 transition">
            <div class="text-2xl">📜</div>
            <div class="text-xs font-black text-slate-900 dark:text-white">کتابی موڈ (Sepia)</div>
          </button>

          <button onclick="window.UI_CONFIG.setTheme('dark')" class="p-4 rounded-2xl border-2 ${theme === 'dark' ? 'border-indigo-500 bg-indigo-950/50' : 'border-slate-200 dark:border-slate-700'} text-center space-y-2 transition">
            <div class="text-2xl">🌙</div>
            <div class="text-xs font-black text-slate-900 dark:text-white">رات کا موڈ (Dark)</div>
          </button>
        </div>
      </div>

      <!-- Account Actions -->
      <div class="v2-card p-6 flex items-center justify-between">
        <div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white">لاگ آؤٹ کریں</h3>
          <p class="text-xs text-slate-500">اپنے سیشن کو محفوظ طریقے سے بند کریں۔</p>
        </div>
        <button onclick="window.Auth.logout(); window.Router.navigate('/login');" class="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md">
          <i data-lucide="log-out" class="w-4 h-4"></i>
          <span>سائن آؤٹ</span>
        </button>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

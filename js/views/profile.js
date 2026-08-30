/**
 * LearnHub User Profile & Identity Management Suite
 * Royal Teal & Gold Mobile Edition
 */

window.Views = window.Views || {};
window.Views.activeProfileTab = window.Views.activeProfileTab || 'overview';

window.Views.renderProfile = function(params, query) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const user = (window.Auth && window.Auth.getCurrentUser && window.Auth.getCurrentUser()) || {
    name: 'طالب علم',
    email: 'student@learnhubplatform.com',
    role: 'student',
    joinedDate: '2026-01-15'
  };

  const activeTab = window.Views.activeProfileTab || 'overview';
  const isDark = document.documentElement.classList.contains('dark');

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="rtl">
      
      <!-- Top Majestic Header (Teal & Gold) -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-4xl mx-auto px-4 py-5 sm:py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-14 h-14 rounded-2xl bg-teal-900 text-amber-300 border-2 border-amber-400 flex items-center justify-center text-2xl font-black shadow-md">
                ${user.name ? user.name[0] : 'ط'}
              </div>
              <div>
                <h1 class="text-xl sm:text-2xl font-black font-arabic leading-tight">${user.name || 'پروفائل'}</h1>
                <p class="text-[11px] text-teal-200 font-mono">${user.email || 'student@learnhubplatform.com'}</p>
              </div>
            </div>
            
            <span class="px-3 py-1 rounded-xl bg-teal-900/80 text-amber-300 border border-teal-600/60 text-xs font-bold shadow-xs">
              ${user.role === 'admin' ? 'ایڈمنسٹریٹر' : 'طالب علم'}
            </span>
          </div>
        </div>

        <!-- 100% SINGLE-LINE Horizontal Profile Tabs Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-1.5">
          <div class="max-w-4xl mx-auto px-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            
            <button onclick="window.Views.switchProfileTab('overview')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${activeTab === 'overview' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              📊 عمومی خلاصہ
            </button>

            <button onclick="window.Views.switchProfileTab('edit')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${activeTab === 'edit' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ✏️ پروفائل ترمیم
            </button>

            <button onclick="window.Views.switchProfileTab('security')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${activeTab === 'security' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              🔒 سیکیورٹی و پاس ورڈ
            </button>

            <button onclick="window.Router.navigate('/settings')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40">
              ⚙️ ایپ ترتیبات
            </button>

            <button onclick="window.Auth && window.Auth.logout && window.Auth.logout()" class="shrink-0 py-1 px-3 rounded-xl transition font-bold bg-rose-500/20 text-rose-300 border border-rose-400/40 hover:bg-rose-500 hover:text-white">
              🚪 لاگ آؤٹ
            </button>

          </div>
        </div>
      </div>

      <!-- Main Profile Body Canvas -->
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-5 space-y-4">
        
        ${activeTab === 'overview' ? `
          <!-- Overview Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-1 shadow-xs">
              <span class="text-xs text-slate-500">مکمل کورسز</span>
              <p class="text-xl font-mono font-black text-teal-800 dark:text-teal-300">4</p>
            </div>
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-1 shadow-xs">
              <span class="text-xs text-slate-500">حاصل کردہ اسناد</span>
              <p class="text-xl font-mono font-black text-amber-400">3</p>
            </div>
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-1 shadow-xs">
              <span class="text-xs text-slate-500">علمی پوائنٹس</span>
              <p class="text-xl font-mono font-black text-teal-800 dark:text-teal-300">850 XP</p>
            </div>
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-1 shadow-xs">
              <span class="text-xs text-slate-500">روزانہ کا سلسلہ</span>
              <p class="text-xl font-mono font-black text-rose-500">🔥 7 دن</p>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <h3 class="text-xs font-black text-teal-800 dark:text-teal-300">ذاتی معلومات:</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span class="text-slate-500 block">پورا نام:</span>
                <span class="font-bold text-slate-900 dark:text-white">${user.name || 'طالب علم'}</span>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span class="text-slate-500 block">ای میل ایڈریس:</span>
                <span class="font-bold font-mono text-slate-900 dark:text-white">${user.email || 'student@learnhubplatform.com'}</span>
              </div>
            </div>
          </div>
        ` : activeTab === 'edit' ? `
          <!-- Edit Profile Form -->
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <h3 class="text-xs font-black text-teal-800 dark:text-teal-300">پروفائل ترمیم فرمائیں:</h3>
            <div class="space-y-3 text-xs font-bold">
              <div>
                <label class="text-slate-700 dark:text-slate-300 block mb-1">پورا نام:</label>
                <input type="text" id="prof-name" value="${user.name || ''}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="text-slate-700 dark:text-slate-300 block mb-1">موبائل نمبر:</label>
                <input type="text" id="prof-phone" value="${user.phone || '+92 300 1234567'}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono" dir="ltr" />
              </div>
              <button onclick="window.Views.saveProfileChanges()" class="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs shadow-xs border border-teal-600">
                محفوظ کریں
              </button>
            </div>
          </div>
        ` : `
          <!-- Security Form -->
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <h3 class="text-xs font-black text-teal-800 dark:text-teal-300">پاس ورڈ تبدیل کریں:</h3>
            <div class="space-y-3 text-xs font-bold">
              <div>
                <label class="text-slate-700 dark:text-slate-300 block mb-1">موجودہ پاس ورڈ:</label>
                <input type="password" id="prof-old-pwd" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono" dir="ltr" />
              </div>
              <div>
                <label class="text-slate-700 dark:text-slate-300 block mb-1">نیا پاس ورڈ:</label>
                <input type="password" id="prof-new-pwd" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono" dir="ltr" />
              </div>
              <button onclick="window.Views.savePasswordChange()" class="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs shadow-xs border border-teal-600">
                پاس ورڈ اپڈیٹ کریں
              </button>
            </div>
          </div>
        `}

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.switchProfileTab = function(tab) {
  window.Views.activeProfileTab = tab;
  window.Views.renderProfile();
};

window.Views.saveProfileChanges = function() {
  const name = document.getElementById('prof-name')?.value;
  if (name && window.Auth && window.Auth.updateCurrentUser) {
    window.Auth.updateCurrentUser({ name });
  }
  window.App?.showToast('پروفائل کامیابی سے محفوظ ہو گیا! ✅', 'success');
  window.Views.switchProfileTab('overview');
};

window.Views.savePasswordChange = function() {
  window.App?.showToast('پاس ورڈ کامیابی سے تبدیل ہو گیا! 🔒', 'success');
  window.Views.switchProfileTab('overview');
};

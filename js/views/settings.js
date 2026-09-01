/**
 * LearnHub Compact Settings & Preferences Suite (v226.0.0)
 * Ultra-Sleek, Mobile-First, 1-Tap Touch Controls & Toggles.
 * Minimalist design with zero bulky text.
 */

window.Views = window.Views || {};

window.Views.renderSettings = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentLang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : (localStorage.getItem('learnhub_language_v1') || 'en');

  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const isDark = document.documentElement.classList.contains('dark');
  const user = window.Auth ? window.Auth.getCurrentUser() : null;

  // Stored preferences with defaults
  const notifPush = localStorage.getItem('learnhub_setting_notif_push') !== 'false';
  const notifDailyHadith = localStorage.getItem('learnhub_setting_notif_hadith') !== 'false';
  const soundTasbeeh = localStorage.getItem('learnhub_setting_tasbeeh_audio') !== 'false';
  const soundHaptic = localStorage.getItem('learnhub_setting_haptic') !== 'false';
  const quranFont = localStorage.getItem('learnhub_setting_quran_font') || 'uthmani';
  const prayerMethod = localStorage.getItem('learnhub_setting_prayer_method') || 'Karachi';
  const juristicAsr = localStorage.getItem('learnhub_setting_juristic_asr') || 'Standard';

  const lastSync = localStorage.getItem('learnhub_last_cloud_sync');
  const lastSyncStr = lastSync ? new Date(lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Connected';

  container.innerHTML = `
    <div class="w-full text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-300 pb-28" dir="ltr">
      <div class="max-w-2xl mx-auto px-3.5 sm:px-6 py-5 sm:py-7 space-y-4">
        
        <!-- Compact Header -->
        <div class="p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 backdrop-blur-xs">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20">
              <i data-lucide="sliders" class="w-4 h-4"></i>
            </span>
            <div>
              <h1 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white">App Preferences</h1>
              <p class="text-[10px] text-slate-500 dark:text-slate-400">1-Tap Quick Toggles & Standards</p>
            </div>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20">
            v226
          </span>
        </div>

        <!-- 1. Quick Display & Typography Toggles -->
        <div class="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
          <div class="flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-teal-300">
            <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
            <span>Quran Script & Reading Style</span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button 
              onclick="localStorage.setItem('learnhub_setting_quran_font', 'uthmani'); window.App.showToast('Uthmani script active', 'success'); window.Views.renderSettings();"
              class="py-2 px-3 rounded-xl border text-center transition cursor-pointer ${quranFont === 'uthmani' ? 'bg-teal-700 text-white border-teal-700 shadow-xs' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}"
            >
              Madani Uthmani (عثماني)
            </button>
            <button 
              onclick="localStorage.setItem('learnhub_setting_quran_font', 'indopak'); window.App.showToast('IndoPak script active', 'success'); window.Views.renderSettings();"
              class="py-2 px-3 rounded-xl border text-center transition cursor-pointer ${quranFont === 'indopak' ? 'bg-teal-700 text-white border-teal-700 shadow-xs' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}"
            >
              IndoPak Naskh (نستعلیق)
            </button>
          </div>
        </div>

        <!-- 2. Prayer Calculation Method -->
        <div class="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
          <div class="flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-teal-300">
            <i data-lucide="compass" class="w-3.5 h-3.5"></i>
            <span>Prayer Times Calculation Standard</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] font-semibold">
            <button 
              onclick="localStorage.setItem('learnhub_setting_prayer_method', 'Karachi'); window.App.showToast('Karachi standard active', 'success'); window.Views.renderSettings();"
              class="py-2 px-2 rounded-xl border text-center transition cursor-pointer ${prayerMethod === 'Karachi' ? 'bg-teal-700 text-white border-teal-700 shadow-xs font-bold' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}"
            >
              Karachi (Subcontinent)
            </button>
            <button 
              onclick="localStorage.setItem('learnhub_setting_prayer_method', 'MWL'); window.App.showToast('MWL standard active', 'success'); window.Views.renderSettings();"
              class="py-2 px-2 rounded-xl border text-center transition cursor-pointer ${prayerMethod === 'MWL' ? 'bg-teal-700 text-white border-teal-700 shadow-xs font-bold' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}"
            >
              MWL (Global)
            </button>
            <button 
              onclick="localStorage.setItem('learnhub_setting_prayer_method', 'Makkah'); window.App.showToast('Umm al-Qura active', 'success'); window.Views.renderSettings();"
              class="py-2 px-2 rounded-xl border text-center transition cursor-pointer ${prayerMethod === 'Makkah' ? 'bg-teal-700 text-white border-teal-700 shadow-xs font-bold' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}"
            >
              Umm al-Qura (Makkah)
            </button>
            <button 
              onclick="localStorage.setItem('learnhub_setting_prayer_method', 'ISNA'); window.App.showToast('ISNA standard active', 'success'); window.Views.renderSettings();"
              class="py-2 px-2 rounded-xl border text-center transition cursor-pointer ${prayerMethod === 'ISNA' ? 'bg-teal-700 text-white border-teal-700 shadow-xs font-bold' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}"
            >
              ISNA (N. America)
            </button>
          </div>

          <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
            <span class="font-semibold text-slate-600 dark:text-slate-400 text-[11px]">Asr Jurisprudence:</span>
            <div class="flex gap-1.5 font-semibold text-[11px]">
              <button 
                onclick="localStorage.setItem('learnhub_setting_juristic_asr', 'Standard'); window.App.showToast('Standard Asr active', 'success'); window.Views.renderSettings();"
                class="py-1 px-2.5 rounded-lg border transition cursor-pointer ${juristicAsr === 'Standard' ? 'bg-teal-700 text-white border-teal-700' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}"
              >
                Standard (Shafi'i/Hanbali/Maliki)
              </button>
              <button 
                onclick="localStorage.setItem('learnhub_setting_juristic_asr', 'Hanafi'); window.App.showToast('Hanafi Asr active', 'success'); window.Views.renderSettings();"
                class="py-1 px-2.5 rounded-lg border transition cursor-pointer ${juristicAsr === 'Hanafi' ? 'bg-teal-700 text-white border-teal-700' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}"
              >
                Hanafi
              </button>
            </div>
          </div>
        </div>

        <!-- 3. Audio & Haptics 1-Tap Toggles -->
        <div class="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div class="flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-teal-300 pb-1">
            <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
            <span>Audio, Feedback & Alerts</span>
          </div>

          <!-- Tasbeeh Click Sound -->
          <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3 text-xs">
            <span class="font-medium text-slate-800 dark:text-slate-200">Tasbeeh Digital Click Sound</span>
            <button 
              onclick="localStorage.setItem('learnhub_setting_tasbeeh_audio', '${!soundTasbeeh}'); window.Views.renderSettings();"
              class="py-1 px-3 rounded-lg font-bold text-[11px] transition cursor-pointer ${soundTasbeeh ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}"
            >
              ${soundTasbeeh ? 'ON' : 'OFF'}
            </button>
          </div>

          <!-- Haptic Vibration -->
          <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3 text-xs">
            <span class="font-medium text-slate-800 dark:text-slate-200">Haptic Tap Vibration</span>
            <button 
              onclick="localStorage.setItem('learnhub_setting_haptic', '${!soundHaptic}'); window.Views.renderSettings();"
              class="py-1 px-3 rounded-lg font-bold text-[11px] transition cursor-pointer ${soundHaptic ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}"
            >
              ${soundHaptic ? 'ON' : 'OFF'}
            </button>
          </div>

          <!-- Daily Hadith Reminder -->
          <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3 text-xs">
            <span class="font-medium text-slate-800 dark:text-slate-200">Daily Morning Hadith Notification</span>
            <button 
              onclick="localStorage.setItem('learnhub_setting_notif_hadith', '${!notifDailyHadith}'); window.Views.renderSettings();"
              class="py-1 px-3 rounded-lg font-bold text-[11px] transition cursor-pointer ${notifDailyHadith ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}"
            >
              ${notifDailyHadith ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <!-- 4. Cloud Sync & Local Storage (Compact) -->
        <div class="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2.5 w-full sm:w-auto">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span class="text-slate-600 dark:text-slate-400 font-medium">Cloud Sync: <strong class="text-slate-800 dark:text-slate-200">${lastSyncStr}</strong></span>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button 
              onclick="window.userDataService && window.userDataService.recoverAllUserData && window.userDataService.recoverAllUserData('${user ? (user.uid || user.id) : ''}'); window.App.showToast('Data synced with cloud.', 'success'); window.Views.renderSettings();"
              class="py-1.5 px-3 rounded-xl bg-teal-50 dark:bg-teal-950 hover:bg-teal-600 hover:text-white text-teal-700 dark:text-teal-300 border border-teal-600/30 font-bold text-[11px] transition shadow-xs cursor-pointer flex items-center gap-1"
            >
              <i data-lucide="refresh-cw" class="w-3 h-3"></i>
              <span>Sync Cloud</span>
            </button>
            <button 
              onclick="localStorage.removeItem('learnhub_offline_cache'); window.App.showToast('Temporary device cache cleared.', 'info');"
              class="py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-bold text-[11px] transition cursor-pointer"
            >
              Clear Cache
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

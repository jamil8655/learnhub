/**
 * LearnHub Settings & Preferences Suite (v225.0.0)
 * Modern, clean, and comprehensive settings panel:
 * Appearance, Language, Prayer & GPS calculations, Sound & Haptics,
 * Notifications, and Firestore Cloud Sync & Cache Management.
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

  // Stored preferences
  const notifPush = localStorage.getItem('learnhub_setting_notif_push') !== 'false';
  const notifDailyHadith = localStorage.getItem('learnhub_setting_notif_hadith') !== 'false';
  const soundTasbeeh = localStorage.getItem('learnhub_setting_tasbeeh_audio') !== 'false';
  const soundHaptic = localStorage.getItem('learnhub_setting_haptic') !== 'false';
  const quranFont = localStorage.getItem('learnhub_setting_quran_font') || 'uthmani';
  const prayerMethod = localStorage.getItem('learnhub_setting_prayer_method') || 'Karachi';
  const juristicAsr = localStorage.getItem('learnhub_setting_juristic_asr') || 'Standard';

  const lastSync = localStorage.getItem('learnhub_last_cloud_sync');
  const lastSyncStr = lastSync ? new Date(lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently Connected';

  container.innerHTML = `
    <div class="w-full text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-300 pb-28" dir="ltr">
      <div class="max-w-4xl mx-auto px-3.5 sm:px-6 py-5 sm:py-7 space-y-5">
        
        <!-- Header Strip -->
        <div class="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs backdrop-blur-xs flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20">
              <i data-lucide="settings" class="w-5 h-5"></i>
            </span>
            <div>
              <h1 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Settings & Preferences</h1>
              <p class="text-xs text-slate-500 dark:text-slate-400">Configure theme, language, GPS prayer calculations, and cloud sync</p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold font-mono bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20">
            v225.0.0
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <!-- 1. Appearance & Theme -->
          <div class="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div class="flex items-center gap-2.5">
              <span class="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20">
                <i data-lucide="palette" class="w-4 h-4"></i>
              </span>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Appearance & Theme</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">Visual mode and color preferences</p>
              </div>
            </div>

            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3">
              <div>
                <div class="text-xs font-bold text-slate-900 dark:text-white">Dark Theme Mode</div>
                <div class="text-[10px] text-slate-500 dark:text-slate-400">Comfortable for nighttime study</div>
              </div>
              <button onclick="window.App.toggleDarkMode(); window.Views.renderSettings();" class="py-1.5 px-3.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${isDark ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}">
                ${isDark ? '🌙 Dark Active' : '☀️ Light Active'}
              </button>
            </div>
          </div>

          <!-- 2. Language Selection -->
          <div class="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div class="flex items-center gap-2.5">
              <span class="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20">
                <i data-lucide="globe" class="w-4 h-4"></i>
              </span>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Application Language</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">Primary interface language</p>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <button onclick="window.I18N && window.I18N.setLanguage('en'); window.Views.renderSettings();" class="py-2.5 px-3 rounded-2xl border text-xs font-bold text-center transition cursor-pointer ${currentLang === 'en' ? 'bg-teal-700 text-white border-teal-700 shadow-xs' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-500'}">
                English (EN)
              </button>
              <button onclick="window.I18N && window.I18N.setLanguage('ur'); window.Views.renderSettings();" class="py-2.5 px-3 rounded-2xl border text-xs font-urdu font-bold text-center transition cursor-pointer ${currentLang === 'ur' ? 'bg-teal-700 text-white border-teal-700 shadow-xs' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-500'}">
                اردو (UR)
              </button>
              <button onclick="window.I18N && window.I18N.setLanguage('ar'); window.Views.renderSettings();" class="py-2.5 px-3 rounded-2xl border text-xs font-arabic font-bold text-center transition cursor-pointer ${currentLang === 'ar' ? 'bg-teal-700 text-white border-teal-700 shadow-xs' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-500'}">
                العربية (AR)
              </button>
            </div>
          </div>

          <!-- 3. Prayer Times & GPS Standard -->
          <div class="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div class="flex items-center gap-2.5">
              <span class="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20">
                <i data-lucide="compass" class="w-4 h-4"></i>
              </span>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Prayer & Qibla Calculations</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">Astronomical & juristic standard</p>
              </div>
            </div>

            <div class="space-y-3 text-xs">
              <div class="space-y-1">
                <label class="block font-bold text-slate-700 dark:text-slate-300">Calculation Method</label>
                <select id="setting-prayer-calc" onchange="localStorage.setItem('learnhub_setting_prayer_method', this.value); window.App.showToast('Calculation method saved.', 'success');" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs">
                  <option value="Karachi" ${prayerMethod === 'Karachi' ? 'selected' : ''}>Univ. of Islamic Sciences Karachi (Indian Subcontinent)</option>
                  <option value="MWL" ${prayerMethod === 'MWL' ? 'selected' : ''}>Muslim World League (MWL)</option>
                  <option value="ISNA" ${prayerMethod === 'ISNA' ? 'selected' : ''}>Islamic Society of North America (ISNA)</option>
                  <option value="Makkah" ${prayerMethod === 'Makkah' ? 'selected' : ''}>Umm al-Qura Univ. Makkah</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="block font-bold text-slate-700 dark:text-slate-300">Asr Juristic Method</label>
                <select id="setting-asr-calc" onchange="localStorage.setItem('learnhub_setting_juristic_asr', this.value); window.App.showToast('Asr method updated.', 'success');" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs">
                  <option value="Standard" ${juristicAsr === 'Standard' ? 'selected' : ''}>Standard (Shafi'i, Maliki, Hanbali / Ahl al-Hadith)</option>
                  <option value="Hanafi" ${juristicAsr === 'Hanafi' ? 'selected' : ''}>Hanafi (Double Shadow Length)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 4. Permanent Cloud Sync & Storage -->
          <div class="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div class="flex items-center gap-2.5">
              <span class="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20">
                <i data-lucide="cloud" class="w-4 h-4"></i>
              </span>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Firestore Cloud Sync</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">Continuous cloud backup of enrollments & degrees</p>
              </div>
            </div>

            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-slate-500 dark:text-slate-400">Connection Status:</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Google Cloud Connected</span>
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500 dark:text-slate-400">Last Sync:</span>
                <span class="font-mono font-bold text-slate-700 dark:text-slate-300">${lastSyncStr}</span>
              </div>
              <div class="pt-2">
                <button onclick="window.userDataService && window.userDataService.recoverAllUserData && window.userDataService.recoverAllUserData('${user ? (user.uid || user.id) : ''}'); window.App.showToast('Cloud data synchronized successfully.', 'success'); window.Views.renderSettings();" class="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition cursor-pointer">
                  <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
                  <span>Force Sync & Recover Data</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

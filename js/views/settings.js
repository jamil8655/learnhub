/**
 * LearnHub Android-Native Settings Suite
 * Full Trilingual Localization (English, Urdu, Arabic)
 * Standard Android Material Switches & Preference Categories
 */

window.Views = window.Views || {};

window.Views.renderSettings = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentLang = window.I18N ? window.I18N.getLanguage() : 'en';
  const isRtl = window.I18N ? window.I18N.isRTL() : false;
  const fontClass = currentLang === 'ur' ? 'font-urdu' : (currentLang === 'ar' ? 'font-arabic' : 'font-sans');
  const textAlign = isRtl ? 'text-right' : 'text-left';

  // Load preferences from localStorage
  const isDark = document.documentElement.classList.contains('dark');
  const notifPush = localStorage.getItem('learnhub_setting_notif_push') !== 'false';
  const notifHadith = localStorage.getItem('learnhub_setting_notif_hadith') !== 'false';
  const notifAdhan = localStorage.getItem('learnhub_setting_notif_adhan') !== 'false';
  const dlWifiOnly = localStorage.getItem('learnhub_setting_dl_wifi') === 'true';
  const soundHaptics = localStorage.getItem('learnhub_setting_haptics') !== 'false';
  const soundTasbeeh = localStorage.getItem('learnhub_setting_tasbeeh_audio') !== 'false';

  const t = (key, fallback) => window.I18N ? window.I18N.t(key, fallback) : fallback;

  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 ${fontClass} ${textAlign} pb-28" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Top Screen Header -->
      <div class="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <button onclick="window.history.back()" class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition" aria-label="Back">
            <i data-lucide="${isRtl ? 'arrow-right' : 'arrow-left'}" class="w-5 h-5"></i>
          </button>
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">${t('settingsTitle', 'Settings')}</h1>
            <p class="text-xs text-slate-500">${t('settingsSubtitle', 'Manage app preferences, language and notifications')}</p>
          </div>
        </div>
      </div>

      <!-- Section 1: Appearance & Theme -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
        <div class="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">${t('settingsCatAppearance', 'Appearance & Display')}</div>

        <!-- Dark Mode Toggle -->
        <div class="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-700/80">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
              <i data-lucide="moon" class="w-4 h-4"></i>
            </div>
            <div>
              <div class="text-sm font-semibold text-slate-900 dark:text-white">${t('settingsDarkMode', 'Dark Theme')}</div>
              <div class="text-xs text-slate-500">${t('settingsDarkModeDesc', 'Reduce eye strain in low-light environments')}</div>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" id="setting-darkmode" ${isDark ? 'checked' : ''} onchange="window.Views.toggleDarkModeSetting(this.checked)" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-700"></div>
          </label>
        </div>

        <!-- Language Selector Row -->
        <div class="flex items-center justify-between gap-4 py-2">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
              <i data-lucide="globe" class="w-4 h-4"></i>
            </div>
            <div>
              <div class="text-sm font-semibold text-slate-900 dark:text-white">${t('settingsLanguage', 'Application Language')}</div>
              <div class="text-xs text-slate-500">${t('settingsLanguageDesc', 'Choose English, Urdu or Arabic interface')}</div>
            </div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <button onclick="window.I18N.setLanguage('en'); window.Views.renderSettings();" class="px-2.5 py-1 rounded-lg text-xs font-semibold ${currentLang === 'en' ? 'bg-teal-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'} transition">EN</button>
            <button onclick="window.I18N.setLanguage('ur'); window.Views.renderSettings();" class="px-2.5 py-1 rounded-lg text-xs font-urdu font-semibold ${currentLang === 'ur' ? 'bg-teal-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'} transition">اردو</button>
            <button onclick="window.I18N.setLanguage('ar'); window.Views.renderSettings();" class="px-2.5 py-1 rounded-lg text-xs font-arabic font-semibold ${currentLang === 'ar' ? 'bg-teal-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'} transition">عربي</button>
          </div>
        </div>
      </div>

      <!-- Section 2: Notifications & Reminders -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
        <div class="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">${t('settingsCatNotifs', 'Notifications & Reminders')}</div>

        <!-- Push Notifications -->
        <div class="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-700/80">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
              <i data-lucide="bell" class="w-4 h-4"></i>
            </div>
            <div>
              <div class="text-sm font-semibold text-slate-900 dark:text-white">${t('settingsPushNotifs', 'Push Notifications')}</div>
              <div class="text-xs text-slate-500">${t('settingsPushNotifsDesc', 'Receive alerts for quiz completions & new courses')}</div>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" ${notifPush ? 'checked' : ''} onchange="localStorage.setItem('learnhub_setting_notif_push', this.checked); window.App?.showToast('Notification preference saved', 'success');" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-700"></div>
          </label>
        </div>

        <!-- Daily Hadith Reminder -->
        <div class="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-700/80">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
              <i data-lucide="scroll" class="w-4 h-4"></i>
            </div>
            <div>
              <div class="text-sm font-semibold text-slate-900 dark:text-white">${t('settingsDailyHadith', 'Daily Hadith & Dua Digest')}</div>
              <div class="text-xs text-slate-500">${t('settingsDailyHadithDesc', 'Morning inspiration from Sahih Hadith collections')}</div>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" ${notifHadith ? 'checked' : ''} onchange="localStorage.setItem('learnhub_setting_notif_hadith', this.checked); window.App?.showToast('Hadith preference saved', 'success');" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-700"></div>
          </label>
        </div>

        <!-- Prayer Times Alert -->
        <div class="flex items-center justify-between gap-4 py-2">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
              <i data-lucide="compass" class="w-4 h-4"></i>
            </div>
            <div>
              <div class="text-sm font-semibold text-slate-900 dark:text-white">${t('settingsPrayerAlert', 'Prayer Time Adhan Reminders')}</div>
              <div class="text-xs text-slate-500">${t('settingsPrayerAlertDesc', 'Astronomical solar timing countdown & alerts')}</div>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" ${notifAdhan ? 'checked' : ''} onchange="localStorage.setItem('learnhub_setting_notif_adhan', this.checked); window.App?.showToast('Prayer alert preference saved', 'success');" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-700"></div>
          </label>
        </div>
      </div>

      <!-- Section 3: Downloads & Offline Data -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
        <div class="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">${t('settingsCatStorage', 'Downloads & Storage')}</div>

        <!-- Wi-Fi Only Download -->
        <div class="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-700/80">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
              <i data-lucide="wifi" class="w-4 h-4"></i>
            </div>
            <div>
              <div class="text-sm font-semibold text-slate-900 dark:text-white">${t('settingsWifiOnly', 'Download Over Wi-Fi Only')}</div>
              <div class="text-xs text-slate-500">${t('settingsWifiOnlyDesc', 'Save mobile cellular data for Quran audio & PDF books')}</div>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" ${dlWifiOnly ? 'checked' : ''} onchange="localStorage.setItem('learnhub_setting_dl_wifi', this.checked); window.App?.showToast('Network preference saved', 'success');" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-700"></div>
          </label>
        </div>

        <!-- Clear Offline Cache -->
        <div class="flex items-center justify-between gap-4 py-2">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </div>
            <div>
              <div class="text-sm font-semibold text-slate-900 dark:text-white">${t('settingsClearCache', 'Clear Cached Media & Chapters')}</div>
              <div class="text-xs text-slate-500">${t('settingsClearCacheDesc', 'Free up device storage used by offline files')}</div>
            </div>
          </div>
          <button onclick="window.Views.clearOfflineCache()" class="btn-secondary py-1.5 px-3 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-800 shrink-0">
            ${t('settingsClearBtn', 'Clear Cache')}
          </button>
        </div>
      </div>

      <!-- Section 4: Sound & Haptics -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
        <div class="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">${t('settingsCatSound', 'Audio & Feedback')}</div>

        <!-- Haptic Feedback -->
        <div class="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-700/80">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
              <i data-lucide="smartphone" class="w-4 h-4"></i>
            </div>
            <div>
              <div class="text-sm font-semibold text-slate-900 dark:text-white">${t('settingsHaptics', 'Haptic Vibration Feedback')}</div>
              <div class="text-xs text-slate-500">${t('settingsHapticsDesc', 'Vibrate on digital Tasbeeh count & quiz answers')}</div>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" ${soundHaptics ? 'checked' : ''} onchange="localStorage.setItem('learnhub_setting_haptics', this.checked); window.App?.showToast('Haptic preference saved', 'success');" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-700"></div>
          </label>
        </div>

        <!-- Tasbeeh Audio Click -->
        <div class="flex items-center justify-between gap-4 py-2">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
              <i data-lucide="volume-2" class="w-4 h-4"></i>
            </div>
            <div>
              <div class="text-sm font-semibold text-slate-900 dark:text-white">${t('settingsTasbeehAudio', 'Audio Clicks on Counters')}</div>
              <div class="text-xs text-slate-500">${t('settingsTasbeehAudioDesc', 'Play soft acoustic click when incrementing Tasbeeh')}</div>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" ${soundTasbeeh ? 'checked' : ''} onchange="localStorage.setItem('learnhub_setting_tasbeeh_audio', this.checked); window.App?.showToast('Audio preference saved', 'success');" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-700"></div>
          </label>
        </div>
      </div>

      <!-- Section 5: About & Legal -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-3">
        <div class="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">${t('settingsCatAbout', 'About & Legal')}</div>

        <div class="space-y-1">
          <a href="#/privacy" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 transition">
            <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">${t('settingsPrivacy', 'Privacy Policy')}</span>
            <i data-lucide="${isRtl ? 'chevron-left' : 'chevron-right'}" class="w-4 h-4 text-slate-400"></i>
          </a>
          <a href="#/terms" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 transition">
            <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">${t('settingsTerms', 'Terms of Service')}</span>
            <i data-lucide="${isRtl ? 'chevron-left' : 'chevron-right'}" class="w-4 h-4 text-slate-400"></i>
          </a>
          <a href="#/support" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 transition">
            <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">${t('settingsHelp', 'Help Desk & Support')}</span>
            <i data-lucide="${isRtl ? 'chevron-left' : 'chevron-right'}" class="w-4 h-4 text-slate-400"></i>
          </a>
        </div>

        <div class="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs text-slate-500">
          <span>LearnHub Android Edition</span>
          <span class="font-mono">v1.0.0 (Build 110)</span>
        </div>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.toggleDarkModeSetting = function(enable) {
  if (enable) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
  window.App?.showToast(enable ? 'Dark Theme Enabled' : 'Light Theme Enabled', 'info');
};

window.Views.clearOfflineCache = async function() {
  if (confirm('Clear all offline cached pages and downloaded media?')) {
    if ('caches' in window) {
      const keys = await caches.keys();
      for (const k of keys) {
        if (k.includes('runtime') || k.includes('audio') || k.includes('books')) {
          await caches.delete(k);
        }
      }
    }
    window.App?.showToast('Offline cache cleared successfully', 'success');
  }
};

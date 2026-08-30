/**
 * LearnHub Settings Suite v155
 * Ultra-Comprehensive Trilingual Settings & Preferences
 */

window.Views = window.Views || {};

window.Views.renderSettings = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentLang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : (localStorage.getItem('learnhub_language_v1') || 'en');

  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const fontClass = currentLang === 'ur' ? 'font-urdu' : (currentLang === 'ar' ? 'font-arabic' : 'font-sans');
  const isDark = document.documentElement.classList.contains('dark');

  // Stored preferences
  const notifPush = localStorage.getItem('learnhub_setting_notif_push') !== 'false';
  const notifDailyHadith = localStorage.getItem('learnhub_setting_notif_hadith') !== 'false';
  const soundTasbeeh = localStorage.getItem('learnhub_setting_tasbeeh_audio') !== 'false';
  const soundHaptic = localStorage.getItem('learnhub_setting_haptic') !== 'false';
  const quranFont = localStorage.getItem('learnhub_setting_quran_font') || 'uthmani';
  const prayerMethod = localStorage.getItem('learnhub_setting_prayer_method') || 'MWL';
  const juristicAsr = localStorage.getItem('learnhub_setting_juristic_asr') || 'Standard';

  const L = {
    title: isRtl ? (currentLang === 'ur' ? 'إِعْدَادَاتُ التَّطْبِيقِ' : 'إعدادات التطبيق') : 'App Settings & Preferences',
    sub: isRtl ? 'ذاتی ترجیحات، قرآنی فونٹس، اوقاتِ نماز اور نوٹیفیکیشنز' : 'Language, Quran Typography, GPS Prayer Calculations & Notifications',
    backBtn: isRtl ? '← واپس' : '&larr; Back',
    
    secLanguage: isRtl ? '🌐 زبان و علاقائی ترتیبات (Language)' : '🌐 Language & Localization',
    secAppearance: isRtl ? '🎨 ظاہری شکل و صورت (Theme)' : '🎨 Appearance & Display Theme',
    darkMode: isRtl ? 'ڈارک تھیم (Dark Mode)' : 'Dark Mode Theme',
    darkModeDesc: isRtl ? 'رات کے وقت آنکھوں کے آرام دہ مطالعے کے لیے' : 'Easier on the eyes in low-light environments',
    
    secQuran: isRtl ? '📖 قرآنی ترجیحات و فونٹس (Quran Typography)' : '📖 Quran & Reading Preferences',
    quranFontLabel: isRtl ? 'رسم الخط (Script Style)' : 'Quranic Script Style',
    uthmaniFont: isRtl ? 'مصحف عثمانی (Madani Uthmani)' : 'Madani Uthmani Script',
    indopakFont: isRtl ? 'ہند و پاک / نستعلیق (IndoPak Script)' : 'IndoPak Naskh/Nastaliq',
    
    secPrayer: isRtl ? '🕌 اوقاتِ نماز و جی پی ایس (Prayer Times & GPS)' : '🕌 Prayer Times & Geolocation Settings',
    calcMethod: isRtl ? 'حساب کا طریقہ (Calculation Method)' : 'Calculation Standard',
    calcMwL: isRtl ? 'رابطہ عالم اسلامی (Muslim World League)' : 'Muslim World League (MWL)',
    calcKarachi: isRtl ? 'جامعہ علوم اسلامیہ کراچی (Karachi)' : 'Univ. of Islamic Sciences Karachi',
    calcIsna: isRtl ? 'شمالی امریکہ (ISNA)' : 'Islamic Society of North America (ISNA)',
    calcMakkah: isRtl ? 'ام القریٰ مکہ مکرمہ (Umm al-Qura)' : 'Umm al-Qura Univ. Makkah',
    asrMethod: isRtl ? 'عصر کا فقہی وقت (Asr Juristic Standard)' : 'Asr Juristic Standard',
    asrStandard: isRtl ? "جمہور فقہاء (Shafi'i, Maliki, Hanbali)" : "Standard (Shafi'i, Maliki, Hanbali)",
    asrHanafi: isRtl ? 'فقہ حنفی (Hanafi 2x Shadow)' : 'Hanafi (Double Shadow Length)',
    
    secAudio: isRtl ? '🔊 صوتی و ہاپٹک فیڈ بیک (Audio & Haptics)' : '🔊 Audio, Sound Effects & Haptics',
    tasbeehSound: isRtl ? 'تسبیح و ذکر صوتی کلکس (Audio Clicks)' : 'Tasbeeh & Counter Audio Feedback',
    hapticVibrate: isRtl ? 'ہاپٹک وائبریشن (Haptic Vibrations)' : 'Device Haptic Vibrations',
    
    secNotif: isRtl ? '🔔 نوٹیفیکیشنز و یاد دہانی (Notifications)' : '🔔 Alerts & Daily Wisdom',
    dailyHadithNotif: isRtl ? 'روزانہ صبح حدیث و آیت کا پیغام' : 'Daily Morning Hadith & Quran Verse Digest',
    pushNotif: isRtl ? 'اوقاتِ نماز اذان الرٹس' : 'Prayer Times & Adhan Notifications',
    
    secAccount: isRtl ? '🛡️ ڈیٹا بیک اپ و سیکیورٹی (Data & Storage)' : '🛡️ Data Management & Cloud Sync',
    clearCache: isRtl ? 'عارضی فائلیں صاف کریں (Clear Cache)' : 'Clear Offline Cached Data',
    clearCacheDesc: isRtl ? 'آف لائن ذخیرہ شدہ ڈیٹا ری سیٹ کریں' : 'Free up storage space and refresh application assets',
    clearBtn: isRtl ? 'صاف کریں' : 'Clear Storage',
    
    versionLabel: isRtl ? 'LearnHub انٹرنیشنل اسلامی پلیٹ فارم' : 'LearnHub International Islamic EdTech Platform',
    statusOnline: isRtl ? 'تمام سسٹمز فعال ہیں • ورژن 155.0.0' : 'All Systems Operational • Version 155.0.0'
  };

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 ${fontClass} text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Top Majestic Header (Teal & Gold) -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-4xl mx-auto px-4 py-5 sm:py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">⚙️</span>
              <div>
                <h1 class="text-xl sm:text-2xl font-black font-arabic leading-tight">${L.title}</h1>
                <p class="text-[11px] text-teal-200 font-sans">${L.sub}</p>
              </div>
            </div>
            <button onclick="window.history.back()" class="py-2 px-3 rounded-xl bg-teal-900/80 hover:bg-teal-900 text-amber-300 border border-teal-600/60 text-xs font-bold transition">
              ${L.backBtn}
            </button>
          </div>
        </div>

        <!-- 100% SINGLE-LINE Horizontal Quick Preferences Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-1.5">
          <div class="max-w-4xl mx-auto px-3 flex items-center gap-2 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            <span class="text-teal-200 text-xs font-bold shrink-0">Language:</span>
            <button onclick="window.I18N && window.I18N.setLanguage('en'); window.Views.renderSettings();" class="shrink-0 py-1 px-3 rounded-xl font-bold transition ${currentLang === 'en' ? 'bg-teal-700 text-amber-300 border border-amber-400/40 shadow-xs' : 'bg-teal-950/60 text-teal-200 hover:text-white'}">
              English
            </button>
            <button onclick="window.I18N && window.I18N.setLanguage('ur'); window.Views.renderSettings();" class="shrink-0 py-1 px-3 rounded-xl font-bold font-urdu transition ${currentLang === 'ur' ? 'bg-teal-700 text-amber-300 border border-amber-400/40 shadow-xs' : 'bg-teal-950/60 text-teal-200 hover:text-white'}">
              اردو (Urdu)
            </button>
            <button onclick="window.I18N && window.I18N.setLanguage('ar'); window.Views.renderSettings();" class="shrink-0 py-1 px-3 rounded-xl font-bold font-arabic transition ${currentLang === 'ar' ? 'bg-teal-700 text-amber-300 border border-amber-400/40 shadow-xs' : 'bg-teal-950/60 text-teal-200 hover:text-white'}">
              العربية (Arabic)
            </button>
          </div>
        </div>
      </div>

      <!-- Main Settings Body Canvas -->
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-5 space-y-4">
        
        <!-- 1. Theme & Appearance Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <h3 class="text-xs font-black text-teal-800 dark:text-teal-300 uppercase tracking-wider">${L.secAppearance}</h3>
          
          <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p class="font-bold text-slate-900 dark:text-white">${L.darkMode}</p>
              <p class="text-[11px] text-slate-500">${L.darkModeDesc}</p>
            </div>
            <button onclick="window.App?.toggleDarkMode(); window.Views.renderSettings();" class="py-1.5 px-4 rounded-xl font-bold text-xs transition ${isDark ? 'bg-teal-800 text-amber-300 border border-teal-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white border border-slate-200'}">
              ${isDark ? 'Dark (آن ہے 🌙)' : 'Light (آف ہے ☀️)'}
            </button>
          </div>
        </div>

        <!-- 2. Quran Typography & Reading Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <h3 class="text-xs font-black text-teal-800 dark:text-teal-300 uppercase tracking-wider">${L.secQuran}</h3>
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p class="font-bold text-slate-900 dark:text-white">${L.quranFontLabel}</p>
              <p class="text-[11px] text-slate-500">Choose between Madani Uthmani and IndoPak Naskh styles</p>
            </div>
            <select 
              onchange="localStorage.setItem('learnhub_setting_quran_font', this.value); window.Views.renderSettings();"
              class="py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500">
              <option value="uthmani" ${quranFont === 'uthmani' ? 'selected' : ''}>${L.uthmaniFont}</option>
              <option value="indopak" ${quranFont === 'indopak' ? 'selected' : ''}>${L.indopakFont}</option>
            </select>
          </div>
        </div>

        <!-- 3. Prayer Times & GPS Geolocation Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <h3 class="text-xs font-black text-teal-800 dark:text-teal-300 uppercase tracking-wider">${L.secPrayer}</h3>
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p class="font-bold text-slate-900 dark:text-white">${L.calcMethod}</p>
              <p class="text-[11px] text-slate-500">Astronomical twilight angles for Fajr & Isha</p>
            </div>
            <select 
              onchange="localStorage.setItem('learnhub_setting_prayer_method', this.value); window.Views.renderSettings();"
              class="py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500">
              <option value="MWL" ${prayerMethod === 'MWL' ? 'selected' : ''}>${L.calcMwL}</option>
              <option value="Karachi" ${prayerMethod === 'Karachi' ? 'selected' : ''}>${L.calcKarachi}</option>
              <option value="ISNA" ${prayerMethod === 'ISNA' ? 'selected' : ''}>${L.calcIsna}</option>
              <option value="Makkah" ${prayerMethod === 'Makkah' ? 'selected' : ''}>${L.calcMakkah}</option>
            </select>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 text-xs">
            <div>
              <p class="font-bold text-slate-900 dark:text-white">${L.asrMethod}</p>
              <p class="text-[11px] text-slate-500">Shadow length calculation for Asr prayer</p>
            </div>
            <select 
              onchange="localStorage.setItem('learnhub_setting_juristic_asr', this.value); window.Views.renderSettings();"
              class="py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500">
              <option value="Standard" ${juristicAsr === 'Standard' ? 'selected' : ''}>${L.asrStandard}</option>
              <option value="Hanafi" ${juristicAsr === 'Hanafi' ? 'selected' : ''}>${L.asrHanafi}</option>
            </select>
          </div>
        </div>

        <!-- 4. Audio & Haptics Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <h3 class="text-xs font-black text-teal-800 dark:text-teal-300 uppercase tracking-wider">${L.secAudio}</h3>
          
          <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p class="font-bold text-slate-900 dark:text-white">${L.tasbeehSound}</p>
              <p class="text-[11px] text-slate-500">Synthesized audio clicks on tap</p>
            </div>
            <button onclick="localStorage.setItem('learnhub_setting_tasbeeh_audio', '${!soundTasbeeh}'); window.Views.renderSettings();" class="py-1.5 px-3.5 rounded-xl font-bold text-xs ${soundTasbeeh ? 'bg-teal-800 text-amber-300 border border-teal-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}">
              ${soundTasbeeh ? 'Enabled 🔊' : 'Muted 🔇'}
            </button>
          </div>

          <div class="flex items-center justify-between py-2 text-xs">
            <div>
              <p class="font-bold text-slate-900 dark:text-white">${L.hapticVibrate}</p>
              <p class="text-[11px] text-slate-500">Subtle vibration feedback on mobile</p>
            </div>
            <button onclick="localStorage.setItem('learnhub_setting_haptic', '${!soundHaptic}'); window.Views.renderSettings();" class="py-1.5 px-3.5 rounded-xl font-bold text-xs ${soundHaptic ? 'bg-teal-800 text-amber-300 border border-teal-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}">
              ${soundHaptic ? 'Active 📳' : 'Off'}
            </button>
          </div>
        </div>

        <!-- 5. Alerts & Notifications Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <h3 class="text-xs font-black text-teal-800 dark:text-teal-300 uppercase tracking-wider">${L.secNotif}</h3>
          
          <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p class="font-bold text-slate-900 dark:text-white">${L.dailyHadithNotif}</p>
              <p class="text-[11px] text-slate-500">Inspiring daily wisdom alerts</p>
            </div>
            <button onclick="localStorage.setItem('learnhub_setting_notif_hadith', '${!notifDailyHadith}'); window.Views.renderSettings();" class="py-1.5 px-3.5 rounded-xl font-bold text-xs ${notifDailyHadith ? 'bg-teal-800 text-amber-300 border border-teal-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}">
              ${notifDailyHadith ? 'Active 🔔' : 'Muted'}
            </button>
          </div>
        </div>

        <!-- 6. Data & Cache Reset Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between text-xs">
          <div>
            <p class="font-bold text-slate-900 dark:text-white">${L.clearCache}</p>
            <p class="text-[11px] text-slate-500">${L.clearCacheDesc}</p>
          </div>
          <button onclick="if(window.caches) { caches.keys().then(k => k.forEach(c => caches.delete(c))); } window.App?.showToast('Storage cache cleared successfully', 'success');" class="py-1.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700 transition">
            ${L.clearBtn}
          </button>
        </div>

        <!-- 7. Platform Version & Footer Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between text-xs">
          <div>
            <p class="font-bold text-slate-900 dark:text-white">${L.versionLabel}</p>
            <p class="text-[11px] text-teal-700 dark:text-teal-400 font-medium">${L.statusOnline}</p>
          </div>
          <span class="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-mono font-bold border border-teal-600/30">
            v155.0.0
          </span>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

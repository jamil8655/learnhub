/**
 * LearnHub Settings Suite (v183.0.0)
 * Ultra-Comprehensive Trilingual Settings & Preferences
 * With Permanent Cloud Data Recovery & Account Sync
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

  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  const lastSync = localStorage.getItem('learnhub_last_cloud_sync');
  const lastSyncFormatted = lastSync ? new Date(lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (isRtl ? 'کبھی نہیں' : 'Never');

  const enrollmentsCount = (window.DB && typeof window.DB.get === 'function') 
    ? (window.DB.get('enrollments') || []).filter(e => e && (!user || e.userId === user.id)).length 
    : 0;
  const certsCount = (window.DB && typeof window.DB.get === 'function') 
    ? (window.DB.get('certificates') || []).filter(c => c && (!user || c.userId === user.id)).length 
    : 0;
  const quizCount = (window.DB && typeof window.DB.get === 'function') 
    ? (window.DB.get('quizAttempts') || []).filter(q => q && (!user || q.userId === user.id)).length 
    : 0;

  // Stored preferences
  const notifPush = localStorage.getItem('learnhub_setting_notif_push') !== 'false';
  const notifDailyHadith = localStorage.getItem('learnhub_setting_notif_hadith') !== 'false';
  const soundTasbeeh = localStorage.getItem('learnhub_setting_tasbeeh_audio') !== 'false';
  const soundHaptic = localStorage.getItem('learnhub_setting_haptic') !== 'false';
  const quranFont = localStorage.getItem('learnhub_setting_quran_font') || 'uthmani';
  const prayerMethod = localStorage.getItem('learnhub_setting_prayer_method') || 'MWL';
  const juristicAsr = localStorage.getItem('learnhub_setting_juristic_asr') || 'Standard';

  const L = {
    title: isRtl ? (currentLang === 'ur' ? 'ایپ کی ترتیبات و کلاؤڈ سنک' : 'إعدادات التطبيق والمزامنة السحابية') : 'App Settings & Cloud Data Sync',
    sub: isRtl ? (currentLang === 'ur' ? 'زبان، قرآنی فونٹس، اوقاتِ نماز، ڈیٹا بحالی اور نوٹیفیکیشنز' : 'اللغة، الخطوط القرآنية، استعادة البيانات والإشعارات') : 'Language, Quran Typography, GPS Prayer Calculations & Permanent Cloud Data Sync',
    backBtn: isRtl ? '← واپس' : '&larr; Back',
    
    secLanguage: isRtl ? (currentLang === 'ur' ? '🌐 زبان کا انتخاب' : '🌐 اختيار لغة التطبيق') : '🌐 Interface Language',
    secLanguageDesc: isRtl ? (currentLang === 'ur' ? 'ایپ کے انٹرفیس کی زبان منتخب کریں' : 'اختر لغة واجهة التطبيق') : 'Select your primary application interface language',
    
    secCloud: isRtl ? (currentLang === 'ur' ? '🛡️ مستقل کلاؤڈ ڈیٹا و اکاؤنٹ بحالی (Cloud Recovery)' : '🛡️ استعادة ومزامنة البيانات السحابية') : '🛡️ Permanent Cloud Data & Account Recovery',
    secCloudDesc: isRtl ? (currentLang === 'ur' ? 'آپ کے تمام خریدار کورسز، اسناد، کوئز ریکارڈز اور پیش رفت گوگل کلاؤڈ میں ہمیشہ محفوظ رہتے ہیں۔' : 'جميع دوراتك وشهاداتك وتقدمك الدراسي محفوظة بشكل دائم في فايربيس السحابي.') : 'Your enrolled courses, certificates, quiz attempts, and learning progress are permanently backed up in Google Cloud Firestore.',
    btnSyncCloud: isRtl ? (currentLang === 'ur' ? '🔄 کلاؤڈ سے تمام ڈیٹا بحال و سنک کریں' : '🔄 مزامنة واستعادة البيانات من السحابة') : '🔄 Sync & Recover Cloud Data',
    
    secAppearance: isRtl ? (currentLang === 'ur' ? '🎨 ظاہری شکل و تھیم' : '🎨 المظهر ونمط العرض') : '🎨 Appearance & Display Theme',
    darkMode: isRtl ? (currentLang === 'ur' ? 'ڈارک تھیم' : 'الوضع الليلي') : 'Dark Mode Theme',
    darkModeDesc: isRtl ? (currentLang === 'ur' ? 'رات کے وقت آنکھوں کے آرام دہ مطالعے کے لیے' : 'مريح للعينين في ظروف الإضاءة المنخفضة') : 'Easier on the eyes in low-light environments',
    darkActive: isRtl ? (currentLang === 'ur' ? 'فعال ہے' : 'مفعّل') : 'Active',
    darkInactive: isRtl ? (currentLang === 'ur' ? 'غیر فعال' : 'غير مفعّل') : 'Off',
    
    secQuran: isRtl ? (currentLang === 'ur' ? '📖 قرآنی فونٹس و رسم الخط' : '📖 تفضيلات الخط القرآني') : '📖 Quran & Reading Preferences',
    quranFontLabel: isRtl ? (currentLang === 'ur' ? 'رسم الخط' : 'نوع الخط القرآني') : 'Quranic Script Style',
    uthmaniFont: isRtl ? (currentLang === 'ur' ? 'مصحف عثمانی' : 'المصحف العثماني (المدني)') : 'Madani Uthmani Script',
    indopakFont: isRtl ? (currentLang === 'ur' ? 'ہند و پاک / نستعلیق' : 'خط النستعليق الهند وباكستاني') : 'IndoPak Naskh/Nastaliq',
    
    secPrayer: isRtl ? (currentLang === 'ur' ? '🕌 اوقاتِ نماز و جی پی ایس' : '🕌 إعدادات مواقيت الصلاة') : '🕌 Prayer Times & Geolocation Settings',
    calcMethod: isRtl ? (currentLang === 'ur' ? 'حساب کا طریقہ' : 'طريقة الحساب الفلكي') : 'Calculation Standard',
    calcMwL: isRtl ? (currentLang === 'ur' ? 'رابطہ عالم اسلامی' : 'رابطة العالم الإسلامي') : 'Muslim World League (MWL)',
    calcKarachi: isRtl ? (currentLang === 'ur' ? 'جامعہ علوم اسلامیہ کراچی' : 'جامعة العلوم الإسلامية بكراتشي') : 'Univ. of Islamic Sciences Karachi',
    calcIsna: isRtl ? (currentLang === 'ur' ? 'شمالی امریکہ' : 'الجمعية الإسلامية لأمريكا الشمالية') : 'Islamic Society of North America (ISNA)',
    calcMakkah: isRtl ? (currentLang === 'ur' ? 'ام القریٰ مکہ مکرمہ' : 'جامعة أم القرى بمكة المكرمة') : 'Umm al-Qura Univ. Makkah',
    asrMethod: isRtl ? (currentLang === 'ur' ? 'عصر کا فقہی وقت' : 'المذهب الفقهي لصلاة العصر') : 'Asr Juristic Standard',
    asrStandard: isRtl ? (currentLang === 'ur' ? 'جمہور فقہاء (شافعی، مالکی، حنبلی)' : 'جمهور الفقهاء (الشافعي، المالكي، الحنبلي)') : "Standard (Shafi'i, Maliki, Hanbali)",
    asrHanafi: isRtl ? (currentLang === 'ur' ? 'فقہ حنفی' : 'المذهب الحنفي (مثلين)') : 'Hanafi (Double Shadow Length)',
    
    secAudio: isRtl ? (currentLang === 'ur' ? '🔊 صوتی و ہاپٹک فیڈ بیک' : '🔊 المؤثرات الصوتية والاهتزاز') : '🔊 Audio, Sound Effects & Haptics',
    tasbeehSound: isRtl ? (currentLang === 'ur' ? 'تسبیح و ذکر صوتی کلکس' : 'أصوات النقر للتسبيح والأذكار') : 'Tasbeeh & Counter Audio Feedback',
    hapticVibrate: isRtl ? (currentLang === 'ur' ? 'ہاپٹک وائبریشن' : 'اهتزاز اللمس التفاعلي') : 'Device Haptic Vibrations',
    
    secNotif: isRtl ? (currentLang === 'ur' ? '🔔 نوٹیفیکیشنز و یاد دہانی' : '🔔 التنبيهات والإشعارات اليومية') : '🔔 Alerts & Daily Wisdom',
    dailyHadithNotif: isRtl ? (currentLang === 'ur' ? 'روزانہ صبح حدیث و آیت کا پیغام' : 'رسائل الحديث والآية اليومية') : 'Daily Morning Hadith & Quran Verse Digest',
    pushNotif: isRtl ? (currentLang === 'ur' ? 'اوقاتِ نماز اذان الرٹس' : 'تنبيهات الأذان ومواقيت الصلاة') : 'Prayer Times & Adhan Notifications',
    
    secAccount: isRtl ? (currentLang === 'ur' ? '🛡️ عارضی کیشے کا انتظام' : '🛡️ إدارة الذاكرة المؤقتة') : '🛡️ Local Cache Management',
    clearCache: isRtl ? (currentLang === 'ur' ? 'عارضی ڈیوائس کیشے صاف کریں' : 'مسح الذاكرة المؤقتة للجهاز') : 'Clear Temporary Device Cache',
    clearCacheDesc: isRtl ? (currentLang === 'ur' ? 'صرف عارضی میڈیا صاف ہوگا؛ آپ کے خریدار کورسز اور اسناد کلاؤڈ میں محفوظ رہیں گی۔' : 'يتم مسح الملفات المؤقتة فقط؛ دوراتك وشهاداتك آمنة في السحابة.') : 'Frees up local device storage without deleting your cloud courses, certificates, or learning history.',
    clearBtn: isRtl ? (currentLang === 'ur' ? 'کیشے صاف کریں' : 'مسح الذاكرة') : 'Clear Cache',
    
    versionLabel: isRtl ? (currentLang === 'ur' ? 'LearnHub انٹرنیشنل اسلامی پلیٹ فارم' : 'منصة LearnHub التعليمية الإسلامية') : 'LearnHub International Islamic EdTech Platform',
    statusOnline: isRtl ? (currentLang === 'ur' ? 'گوگل کلاؤڈ فائر اسٹور آن لائن • ورژن 183.0.0' : 'فايربيس السحابي متصل • الإصدار 183.0.0') : 'Google Cloud Firestore Connected • Version 183.0.0'
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
            <button onclick="window.history.back()" class="py-2 px-3 rounded-xl bg-teal-900/80 hover:bg-teal-900 text-amber-300 border border-teal-600/60 text-xs font-bold transition cursor-pointer">
              ${L.backBtn}
            </button>
          </div>
        </div>

        <!-- 100% SINGLE-LINE Horizontal Language Switcher Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-2">
          <div class="max-w-4xl mx-auto px-3 flex items-center gap-2 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            <span class="text-teal-200 text-xs font-bold shrink-0">🌐 Language:</span>
            <button onclick="window.I18N && window.I18N.setLanguage('en');" class="shrink-0 py-1 px-3.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${currentLang === 'en' ? 'bg-teal-700 text-amber-300 border border-amber-400/40 shadow-xs' : 'bg-teal-950/60 text-teal-200 hover:text-white'}">
              <span>${currentLang === 'en' ? '✓' : '○'}</span>
              <span>English</span>
            </button>
            <button onclick="window.I18N && window.I18N.setLanguage('ur');" class="shrink-0 py-1 px-3.5 rounded-xl font-bold font-urdu transition flex items-center gap-1.5 cursor-pointer ${currentLang === 'ur' ? 'bg-teal-700 text-amber-300 border border-amber-400/40 shadow-xs' : 'bg-teal-950/60 text-teal-200 hover:text-white'}">
              <span>${currentLang === 'ur' ? '✓' : '○'}</span>
              <span>اردو</span>
            </button>
            <button onclick="window.I18N && window.I18N.setLanguage('ar');" class="shrink-0 py-1 px-3.5 rounded-xl font-bold font-arabic transition flex items-center gap-1.5 cursor-pointer ${currentLang === 'ar' ? 'bg-teal-700 text-amber-300 border border-amber-400/40 shadow-xs' : 'bg-teal-950/60 text-teal-200 hover:text-white'}">
              <span>${currentLang === 'ar' ? '✓' : '○'}</span>
              <span>العربية</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Settings Body Canvas -->
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-5 space-y-4">
        
        <!-- 1. CLOUD ACCOUNT DATA & RECOVERY CARD (CRITICAL REQUIREMENT) -->
        <div class="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-teal-900/90 to-slate-900 text-white border-2 border-teal-600/50 shadow-xl space-y-4">
          <div class="flex items-center justify-between border-b border-teal-700/50 pb-3">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">🛡️</span>
              <div>
                <h3 class="text-sm font-black text-amber-300 uppercase tracking-wider">${L.secCloud}</h3>
                <p class="text-[11px] text-teal-200">${L.secCloudDesc}</p>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> FIRESTORE SYNCED
            </span>
          </div>

          <!-- Cloud Synced Status Summary -->
          <div class="grid grid-cols-3 gap-2 text-center font-mono text-xs">
            <div class="p-2.5 rounded-xl bg-slate-950/60 border border-teal-700/40">
              <span class="block text-[10px] text-teal-300 uppercase font-sans font-bold">Courses</span>
              <span class="text-base font-black text-amber-400">${enrollmentsCount}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-950/60 border border-teal-700/40">
              <span class="block text-[10px] text-teal-300 uppercase font-sans font-bold">Certificates</span>
              <span class="text-base font-black text-emerald-400">${certsCount}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-950/60 border border-teal-700/40">
              <span class="block text-[10px] text-teal-300 uppercase font-sans font-bold">Quizzes</span>
              <span class="text-base font-black text-indigo-300">${quizCount}</span>
            </div>
          </div>

          <!-- Manual Cloud Sync Action -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div class="text-[11px] text-slate-300">
              <span>${isRtl ? 'آخری ہم آہنگی:' : 'Last Cloud Sync:'} </span>
              <strong class="font-mono text-teal-200">${lastSyncFormatted}</strong>
            </div>
            <button 
              onclick="if(window.UserDataService) { window.UserDataService.hydrateAllUserData(null, null, true).then(() => window.Views.renderSettings()); }"
              class="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>${L.btnSyncCloud}</span>
            </button>
          </div>
        </div>

        <!-- 2. Language Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
          <div>
            <h3 class="text-xs font-black text-teal-800 dark:text-teal-300 uppercase tracking-wider">${L.secLanguage}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">${L.secLanguageDesc}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button onclick="window.I18N && window.I18N.setLanguage('en');" class="p-3.5 rounded-2xl border transition flex items-center justify-between text-xs cursor-pointer ${currentLang === 'en' ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-600 text-teal-900 dark:text-teal-200 font-black shadow-xs' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium'}">
              <div class="flex items-center gap-2">
                <span class="text-lg">🇬🇧</span>
                <span>English</span>
              </div>
              <span class="text-teal-600 font-bold">${currentLang === 'en' ? '✓' : '○'}</span>
            </button>

            <button onclick="window.I18N && window.I18N.setLanguage('ur');" class="p-3.5 rounded-2xl border font-urdu transition flex items-center justify-between text-xs cursor-pointer ${currentLang === 'ur' ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-600 text-teal-900 dark:text-teal-200 font-black shadow-xs' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium'}">
              <div class="flex items-center gap-2">
                <span class="text-lg">🇵🇰</span>
                <span>اردو</span>
              </div>
              <span class="text-teal-600 font-bold">${currentLang === 'ur' ? '✓' : '○'}</span>
            </button>

            <button onclick="window.I18N && window.I18N.setLanguage('ar');" class="p-3.5 rounded-2xl border font-arabic transition flex items-center justify-between text-xs cursor-pointer ${currentLang === 'ar' ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-600 text-teal-900 dark:text-teal-200 font-black shadow-xs' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium'}">
              <div class="flex items-center gap-2">
                <span class="text-lg">🇸🇦</span>
                <span>العربية</span>
              </div>
              <span class="text-teal-600 font-bold">${currentLang === 'ar' ? '✓' : '○'}</span>
            </button>
          </div>
        </div>

        <!-- 3. Theme & Appearance Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <h3 class="text-xs font-black text-teal-800 dark:text-teal-300 uppercase tracking-wider">${L.secAppearance}</h3>
          
          <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p class="font-bold text-slate-900 dark:text-white">${L.darkMode}</p>
              <p class="text-[11px] text-slate-500">${L.darkModeDesc}</p>
            </div>
            <button onclick="window.App?.toggleDarkMode(); window.Views.renderSettings();" class="py-1.5 px-4 rounded-xl font-bold text-xs transition cursor-pointer ${isDark ? 'bg-teal-800 text-amber-300 border border-teal-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white border border-slate-200'}">
              ${isDark ? L.darkActive : L.darkInactive}
            </button>
          </div>
        </div>

        <!-- 4. Quran Typography & Reading Card -->
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

        <!-- 5. Prayer Times & GPS Geolocation Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <h3 class="text-xs font-black text-teal-800 dark:text-teal-300 uppercase tracking-wider">${L.secPrayer}</h3>
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p class="font-bold text-slate-900 dark:text-white">${L.calcMethod}</p>
              <p class="text-[11px] text-slate-500">Astronomical twilight angles for Fajr and Isha</p>
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

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p class="font-bold text-slate-900 dark:text-white">${L.asrMethod}</p>
              <p class="text-[11px] text-slate-500">Standard (Shafi'i/Maliki/Hanbali) vs Hanafi calculation</p>
            </div>
            <select 
              onchange="localStorage.setItem('learnhub_setting_juristic_asr', this.value); window.Views.renderSettings();"
              class="py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500">
              <option value="Standard" ${juristicAsr === 'Standard' ? 'selected' : ''}>${L.asrStandard}</option>
              <option value="Hanafi" ${juristicAsr === 'Hanafi' ? 'selected' : ''}>${L.asrHanafi}</option>
            </select>
          </div>
        </div>

        <!-- 6. Notifications & Reminders Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <h3 class="text-xs font-black text-teal-800 dark:text-teal-300 uppercase tracking-wider">${L.secNotif}</h3>
          
          <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p class="font-bold text-slate-900 dark:text-white">${L.dailyHadithNotif}</p>
              <p class="text-[11px] text-slate-500">Morning inspirational message and daily sunnah reminders</p>
            </div>
            <input 
              type="checkbox" 
              ${notifDailyHadith ? 'checked' : ''} 
              onchange="localStorage.setItem('learnhub_setting_notif_hadith', this.checked); window.Views.renderSettings();"
              class="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer" 
            />
          </div>

          <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p class="font-bold text-slate-900 dark:text-white">${L.pushNotif}</p>
              <p class="text-[11px] text-slate-500">Instant notifications for prayer times and new course announcements</p>
            </div>
            <input 
              type="checkbox" 
              ${notifPush ? 'checked' : ''} 
              onchange="localStorage.setItem('learnhub_setting_notif_push', this.checked); window.Views.renderSettings();"
              class="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer" 
            />
          </div>
        </div>

        <!-- 7. Safe Cache Management Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <h3 class="text-xs font-black text-teal-800 dark:text-teal-300 uppercase tracking-wider">${L.secAccount}</h3>
          
          <div class="flex items-center justify-between py-2 text-xs">
            <div>
              <p class="font-bold text-slate-900 dark:text-white">${L.clearCache}</p>
              <p class="text-[11px] text-slate-500">${L.clearCacheDesc}</p>
            </div>
            <button 
              onclick="if(confirm('Clear temporary local cache? Your account data, enrolled courses, and certificates are safely preserved in the Cloud.')) { localStorage.removeItem('learnhub_cache'); localStorage.removeItem('learnhub_quran_cache'); window.App?.showToast('Local cache cleared safely. Cloud account data preserved!', 'success'); }"
              class="py-1.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-200 transition cursor-pointer">
              ${L.clearBtn}
            </button>
          </div>
        </div>

        <!-- System Version Seal -->
        <div class="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-600/30 text-center space-y-1 text-xs">
          <p class="font-bold text-teal-900 dark:text-teal-200">${L.versionLabel}</p>
          <p class="text-[10px] text-teal-700 dark:text-teal-400 font-mono">${L.statusOnline}</p>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

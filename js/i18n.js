/**
 * LearnHub Internationalization (i18n) Engine
 * Full multi-language support for Urdu (ur), Arabic (ar), Hindi (hi), and English (en)
 * with dynamic RTL/LTR bidirectional layout transformation and instant re-rendering.
 */

const LANG_STORAGE_KEY = 'learnhub_language_v1';

const TRANSLATIONS = {
  en: {
    brandName: 'LearnHub',
    proPlatform: 'Islamic Academy',
    navCourses: 'Courses',
    navQuran: 'Holy Quran',
    navHadith: 'Hadith Library',
    navLibrary: 'Digital Library',
    navArticles: 'Articles & Guides',
    navQuizzes: 'Quizzes & Game',
    navPrayerTimes: 'Prayer Times & Qibla',
    navLiveStreams: 'Haramain Live',
    navZakat: 'Zakat Calculator',
    navAzkar: 'Daily Duas & Azkar',
    navNotes: 'Study Notebook',
    navSupport: 'Help & Support',
    navDashboard: 'Dashboard',
    navCertificates: 'Certificates',
    navAdmin: 'Admin Panel',
    navSignIn: 'Sign In',
    navGetStarted: 'Get Started',
    navSignOut: 'Sign Out',
    searchPlaceholder: 'Quick search (Quran, Hadith, Books, Courses)...',
    language: 'Language',
    roleStudent: 'Student',
    roleInstructor: 'Instructor',
    roleAdmin: 'Administrator',
    profileSettings: 'Profile & Settings',
    heroTitle: 'Master Islamic & Modern Sciences with Authenticated Scholars',
    heroSubtitle: 'Access complete classical libraries, interactive Tajweed, 10 renowned Qaris recitations, real-time Qibla compass, and verified certificates.',
    startLearning: 'Start Learning Free',
    exploreLibrary: 'Explore 300+ Books',
    quranBanner: 'Holy Quran — Complete 114 Surahs with 10 Reciters',
    hadithBanner: 'Comprehensive Hadith Sciences & Riyadh us-Saliheen',
    libraryBanner: 'Ahl al-Hadith & Classical Salafi Library',
    readBook: 'Read Complete Book',
    downloadPdf: 'Download PDF',
    viewsCount: 'Views',
    downloadsCount: 'Downloads',
    liveMakkah: 'Masjid al-Haram Live (Makkah)',
    liveMadinah: 'Masjid an-Nabawi Live (Madinah)',
    qiblaCompass: 'Real-Time Qibla Compass',
    prayerTimes: 'Prayer Times',
    gpsLocation: 'My Current Location (GPS)',
    salawatCounter: 'Salawat Counter',
    sendDurood: 'Send Salawat +1',
    copyText: 'Copy Text',
    copiedToast: 'Copied to clipboard!',
    bookmarkText: 'Bookmark',
    audioListen: 'Listen Audio',
    searchInLibrary: 'Search books by title, author or subject...',
    searchInHadith: 'Search Hadith by number, narrator, text...',
    searchInQuran: 'Search Surah by name, number or meaning...'
  },

  ur: {
    brandName: 'لرن ہب',
    proPlatform: 'اسلامک اکیڈمی',
    navCourses: 'کورسز',
    navQuran: 'القرآن الکریم',
    navHadith: 'ذخیرۂ احادیث',
    navLibrary: 'اسلامی کتب خانہ',
    navArticles: 'مضامین و رہنمائی',
    navQuizzes: 'ایڈونچر و امتحانات',
    navPrayerTimes: 'اوقاتِ نماز و قبلہ',
    navLiveStreams: 'حرمین شریفین لائیو',
    navZakat: 'زکوٰۃ کیلکولیٹر',
    navAzkar: 'مسنون دعائیں و اذکار',
    navNotes: 'علمی ڈائری و نوٹس',
    navSupport: 'مدد و سپورٹ',
    navDashboard: 'ڈیش بورڈ',
    navCertificates: 'اسناد و سرٹیفکیٹس',
    navAdmin: 'ایڈمن پینل',
    navSignIn: 'لاگ ان کریں',
    navGetStarted: 'شروع کریں',
    navSignOut: 'لاگ آؤٹ',
    searchPlaceholder: 'فوری تلاش کریں (قرآن، حدیث، کتب، کورسز)...',
    language: 'زبان',
    roleStudent: 'طالب علم',
    roleInstructor: 'استاد محترم',
    roleAdmin: 'ایڈمنسٹریٹر',
    profileSettings: 'پروفائل اور ترتیبات',
    heroTitle: 'مستند دینی و عصری علوم میں کمال حاصل کریں',
    heroSubtitle: '300+ نایاب اسلامی کتب، 10 قراء کی تلاوت، لائیو قبلہ کمپاس، صحاح ستہ اور مستند اسناد حاصل کریں۔',
    startLearning: 'مفت تعلیم شروع کریں',
    exploreLibrary: '300+ کتب دیکھیں',
    quranBanner: 'قرآن مجید — مکمل 114 سورتیں مع 10 معروف قراء کی تلاوت',
    hadithBanner: 'جامع ذخیرۂ احادیثِ نبویہ ﷺ و اربعین نووی',
    libraryBanner: 'کتب خانہ اہلِ سنت و ذخیرۂ سلف صالحین',
    readBook: 'مکمل کتاب پڑھیں',
    downloadPdf: 'پی ڈی ایف حاصل کریں',
    viewsCount: 'وزٹس',
    downloadsCount: 'ڈاؤنلوڈز',
    liveMakkah: 'مسجد الحرام (مکہ مکرمہ لائیو)',
    liveMadinah: 'مسجد نبوی (مدینہ منورہ لائیو)',
    qiblaCompass: 'لائیو قبلہ کمپاس',
    prayerTimes: 'اوقاتِ نماز',
    gpsLocation: 'میرا موجودہ مقام (GPS)',
    salawatCounter: 'درود شریف کاؤنٹر',
    sendDurood: 'درود شریف پڑھا +1',
    copyText: 'کاپی کریں',
    copiedToast: 'متن کاپی ہو گیا!',
    bookmarkText: 'محفوظ کریں',
    audioListen: 'تلاوت سنیں',
    searchInLibrary: 'کتاب کا نام، مصنف یا موضوع تلاش کریں...',
    searchInHadith: 'حدیث نمبر، راوی، متن یا اردو ترجمہ تلاش کریں...',
    searchInQuran: 'سورت کا نام، نمبر یا مفہوم تلاش کریں...'
  },

  ar: {
    brandName: 'ليرن هب',
    proPlatform: 'الأكاديمية الإسلامية',
    navCourses: 'الدورات التعليمية',
    navQuran: 'القرآن الكريم',
    navHadith: 'المكتبة الحديثية',
    navLibrary: 'المكتبة الرقمية',
    navArticles: 'المقالات والبحوث',
    navQuizzes: 'المغامرة والاختبارات',
    navPrayerTimes: 'مواقيت الصلاة والقبلة',
    navLiveStreams: 'البث المباشر للحرمين',
    navZakat: 'حاسبة الزكاة الشرعية',
    navAzkar: 'الأدعية والأذكار',
    navNotes: 'المذكرة العلمية',
    navSupport: 'الدعم الفني',
    navDashboard: 'لوحة التحكم',
    navCertificates: 'الشهادات المعتمدة',
    navAdmin: 'لوحة الإدارة',
    navSignIn: 'تسجيل الدخول',
    navGetStarted: 'ابدأ الآن',
    navSignOut: 'تسجيل الخروج',
    searchPlaceholder: 'بحث سريع في القرآن، الحديث، الكتب...',
    language: 'اللغة',
    roleStudent: 'طالب علم',
    roleInstructor: 'أستاذ / شيخ',
    roleAdmin: 'مدير النظام',
    profileSettings: 'الملف الشخصي والإعدادات',
    heroTitle: 'أتقن العلوم الشرعية والنافعة مع كبار العلماء',
    heroSubtitle: 'أكثر من 300 كتاب سلفي، تلاوات 10 قراء، بوصلة القبلة بالاستشعار الحي، والشهادات الموثقة.',
    startLearning: 'ابدأ التعلم مجاناً',
    exploreLibrary: 'تصفح 300+ كتاب',
    quranBanner: 'القرآن الكريم — 114 سورة كاملة مع 10 من كبار القراء',
    hadithBanner: 'الجامع الشامل للأحاديث النبوية الصحيحة والأربعين النووية',
    libraryBanner: 'مكتبة أهل الحديث وتراث السلف الصالح',
    readBook: 'قراءة الكتاب كاملاً',
    downloadPdf: 'تحميل PDF',
    viewsCount: 'زيارات',
    downloadsCount: 'تحميلات',
    liveMakkah: 'المسجد الحرام بمكة المكرمة مباشر',
    liveMadinah: 'المسجد النبوي بالمدينة المنورة مباشر',
    qiblaCompass: 'بوصلة القبلة الحية',
    prayerTimes: 'مواقيت الصلاة',
    gpsLocation: 'موقعي الحالي (GPS)',
    salawatCounter: 'عداد الصلاة على النبي ﷺ',
    sendDurood: 'صليت على النبي +1',
    copyText: 'نسخ النص',
    copiedToast: 'تم نسخ النص بنجاح!',
    bookmarkText: 'حفظ كإشارة',
    audioListen: 'استماع للتلاوة',
    searchInLibrary: 'ابحث عن الكتب والمؤلفين...',
    searchInHadith: 'ابحث في الأحاديث والرواة...',
    searchInQuran: 'ابحث عن السور والآيات...'
  },

  hi: {
    brandName: 'लर्नहब',
    proPlatform: 'इस्लामिक अकैडमी',
    navCourses: 'कोर्सेस',
    navQuran: 'अल-क़ुरआन अल-करीम',
    navHadith: 'हदीस शरीफ़',
    navLibrary: 'इस्लामिक लाइब्रेरी',
    navArticles: 'आर्टिकल्स व गाइड्स',
    navQuizzes: 'क्विज़ व गेम्स',
    navPrayerTimes: 'नमाज़ का समय व क़िबला',
    navLiveStreams: 'हरमैन शरीफ़ैन लाइव',
    navZakat: 'ज़कात कैलकुलेटर',
    navAzkar: 'दुआएं व अज़कार',
    navNotes: 'स्टडी नोट्स व डायरी',
    navSupport: 'मदद व सपोर्ट',
    navDashboard: 'डैशबोर्ड',
    navCertificates: 'सर्टिफ़िकेट्स',
    navAdmin: 'एडमिन पैनल',
    navSignIn: 'लॉग इन करें',
    navGetStarted: 'शुरू करें',
    navSignOut: 'लॉग आउट',
    searchPlaceholder: 'जल्द सर्च करें (क़ुरआन, हदीस, किताबें, कोर्सेस)...',
    language: 'भाषा (Language)',
    roleStudent: 'विद्यार्थी (Student)',
    roleInstructor: 'उस्ताद (Instructor)',
    roleAdmin: 'एडमिनिस्ट्रेटर',
    profileSettings: 'प्रोफ़ाइल व सेटिंग्स',
    heroTitle: 'प्रमाणिक धार्मिक व आधुनिक ज्ञान में दक्षता प्राप्त करें',
    heroSubtitle: '300+ दुर्लभ इस्लामिक किताबें, 10 प्रसिद्ध क़ारियों की आवाज़, लाइव क़िबला कम्पास और प्रमाणित सर्टिफ़िकेट्स।',
    startLearning: 'मुफ़्त सीखना शुरू करें',
    exploreLibrary: '300+ किताबें देखें',
    quranBanner: 'पवित्र क़ुरआन — पूरी 114 सूरतें 10 प्रसिद्ध क़ारियों की तिलावत के साथ',
    hadithBanner: 'हदीस शरीफ़ व अरबाईन नववी का संग्रह',
    libraryBanner: 'अहले सुन्नत व सल्फ़ सालेहीन का पुस्तकालय',
    readBook: 'पूरी किताब पढ़ें',
    downloadPdf: 'PDF डाउनलोड करें',
    viewsCount: 'विज़िट्स',
    downloadsCount: 'डाउनलोड्स',
    liveMakkah: 'मस्जिद अल-हराम लाइव (मक्का)',
    liveMadinah: 'मस्जिद अन-नबवी लाइव (मदीना)',
    qiblaCompass: 'लाइव क़िबला कम्पास',
    prayerTimes: 'नमाज़ के औक़ात',
    gpsLocation: 'मेरा वर्तमान स्थान (GPS)',
    salawatCounter: 'दुरूद शरीफ़ काउंटर',
    sendDurood: 'दुरूद शरीफ़ पढ़ा +1',
    copyText: 'कॉपी करें',
    copiedToast: 'टेक्स्ट कॉपी हो गया!',
    bookmarkText: 'सेव करें',
    audioListen: 'तिलावत सुनें',
    searchInLibrary: 'किताब का नाम, लेखक या विषय खोजें...',
    searchInHadith: 'हदीस नंबर, रावी, टेक्स्ट खोजें...',
    searchInQuran: 'सूरत का नाम, नंबर या अर्थ खोजें...'
  }
};

class InternationalizationService {
  constructor() {
    this.currentLanguage = this.loadLanguage();
    this.applyLanguage(this.currentLanguage);
  }

  loadLanguage() {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved && ['ur', 'ar', 'hi', 'en'].includes(saved)) {
      return saved;
    }
    return 'ur'; // Default to Urdu
  }

  setLanguage(lang) {
    if (!['ur', 'ar', 'hi', 'en'].includes(lang)) return;
    this.currentLanguage = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    this.applyLanguage(lang);
    
    // Auto-close mobile drawer
    const drawer = document.getElementById('mobile-menu-drawer');
    if (drawer) drawer.classList.add('hidden');

    // Trigger full app re-render
    window.dispatchEvent(new CustomEvent('learnhub:lang_changed', { detail: { lang } }));
    if (window.Router) {
      window.Router.handleRouting();
    }

    const toastMsgs = {
      ur: 'زبان کامیابی سے تبدیل ہو گئی: اردو 🇵🇰',
      ar: 'تم تغيير اللغة بنجاح: العربية 🇸🇦',
      hi: 'भाषा सफलतापूर्वक बदल दी गई: हिन्दी 🇮🇳',
      en: 'Language switched successfully: English 🇬🇧'
    };
    window.App?.showToast(toastMsgs[lang] || 'Language updated!', 'success');
  }

  applyLanguage(lang) {
    const isRtl = lang === 'ur' || lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.body.dir = isRtl ? 'rtl' : 'ltr';
    
    // Font styling
    document.body.classList.remove('font-urdu', 'font-arabic', 'font-hindi', 'font-sans');
    if (lang === 'ur') {
      document.body.classList.add('font-urdu');
    } else if (lang === 'ar') {
      document.body.classList.add('font-arabic');
    } else if (lang === 'hi') {
      document.body.classList.add('font-hindi');
    } else {
      document.body.classList.add('font-sans');
    }

    // Update Top Navbar Language Badge
    const langLabel = document.getElementById('current-lang-label');
    if (langLabel) {
      const labels = {
        ur: '🇵🇰 اردو',
        ar: '🇸🇦 عربي',
        hi: '🇮🇳 हिन्दी',
        en: '🇬🇧 English'
      };
      langLabel.textContent = labels[lang] || '🇵🇰 اردو';
    }

    // Update Mobile Drawer Language Buttons Active States
    ['ur', 'ar', 'hi', 'en'].forEach(code => {
      const btn = document.getElementById(`mobile-lang-${code}`);
      if (btn) {
        if (code === lang) {
          btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-md transition';
        } else {
          btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition';
        }
      }
    });
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  isRTL() {
    return this.currentLanguage === 'ur' || this.currentLanguage === 'ar';
  }

  t(key, fallback = '') {
    const dict = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.ur;
    if (dict && dict[key]) return dict[key];
    if (TRANSLATIONS.ur && TRANSLATIONS.ur[key]) return TRANSLATIONS.ur[key];
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) return TRANSLATIONS.en[key];
    return fallback || key;
  }

  getSupportedLanguages() {
    return [
      { code: 'ur', name: 'اردو (Urdu)', flag: '🇵🇰', dir: 'rtl' },
      { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦', dir: 'rtl' },
      { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳', dir: 'ltr' },
      { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' }
    ];
  }
}

window.I18N = new InternationalizationService();

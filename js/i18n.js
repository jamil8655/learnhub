/**
 * LearnHub Universal Internationalization (i18n) Engine
 * Full trilingual localization for English (en - LTR), Urdu (ur - RTL), and Arabic (ar - RTL)
 * Provides dynamic dictionary lookup, DOM translation, font switching, and instant reactive re-rendering.
 */

const LANG_STORAGE_KEY = 'learnhub_language_v1';

const TRANSLATIONS = {
  en: {
    // Brand & Navigation
    brandName: 'LearnHub',
    proPlatform: 'Islamic Academy',
    navCourses: 'Courses',
    navQuran: 'Holy Quran',
    navHadith: 'Hadith Library',
    navLibrary: 'Digital Library',
    navArticles: 'Articles & Insights',
    navQuizzes: 'Islamic Adventure & Quizzes',
    navAdventure: 'Islamic Adventure',
    navPrayerTimes: 'Prayer Times & Qibla',
    navLiveStreams: 'Haramain Live',
    navZakat: 'Zakat Calculator',
    navAzkar: 'Daily Duas & Azkar',
    navNotes: 'Study Notes',
    navSupport: 'Help & Support',
    navDashboard: 'Dashboard',
    navCertificates: 'Certificates',
    navAdmin: 'Admin Console',
    navSignIn: 'Sign In',
    navGetStarted: 'Get Started Free',
    navSignOut: 'Sign Out',
    searchPlaceholder: 'Search Quran, Hadith, Books, Courses...',
    language: 'Language',
    roleStudent: 'Student',
    roleInstructor: 'Instructor',
    roleAdmin: 'Administrator',
    profileSettings: 'Profile & Settings',

    // Hero & Home Section
    heroBadge: '🌟 Official Islamic Learning Platform',
    heroTitle: 'Master Authentic Islamic & Modern Sciences with Renowned Scholars',
    heroSubtitle: 'Access comprehensive Islamic courses, 300+ classical books, 114 Surahs with 10 renowned Qaris, live Haramain broadcast, and verifiable digital certificates.',
    startLearning: 'Start Learning Now',
    exploreLibrary: 'Explore 300+ Books',
    exploreCourses: 'Browse Masterclasses',
    exploreAdventure: 'Play Islamic Adventure',
    statsStudents: 'Active Learners',
    statsSurahs: 'Surahs of Quran',
    statsBooks: 'Classical Islamic Books',
    statsCertificates: 'Verified Certificates',

    // Islamic Sections & Banners
    quranTitle: 'The Noble Quran (114 Surahs)',
    quranSubtitle: 'Word-by-word tajweed, multi-qari recitation, verse by verse Urdu & English translations.',
    hadithTitle: 'Hadith Sciences & Riyadh us-Saliheen',
    hadithSubtitle: 'Authentic traditions from Sahih al-Bukhari, Muslim, and modern takhreej references.',
    libraryTitle: 'Classical Islamic & Salafi Library',
    librarySubtitle: 'Over 300 curated classical literature, tafseers, fiqh, and seerah books available online and in PDF.',
    readBook: 'Read Online',
    downloadPdf: 'Download PDF',
    bookAuthor: 'Author',
    bookPages: 'Pages',
    bookCategory: 'Category',
    bookRating: 'Rating',
    viewsCount: 'Views',
    downloadsCount: 'Downloads',

    // Features & Spiritual Tools
    liveMakkah: 'Masjid al-Haram Live (Makkah)',
    liveMadinah: 'Masjid an-Nabawi Live (Madinah)',
    qiblaCompass: 'Real-Time Qibla Compass',
    prayerTimes: 'Prayer Times',
    fajr: 'Fajr',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    gpsLocation: 'My Location (GPS)',
    salawatCounter: 'Salawat Counter',
    sendDurood: 'Send Salawat +1',
    copyText: 'Copy Text',
    copiedToast: 'Copied to clipboard!',
    bookmarkText: 'Bookmark',
    audioListen: 'Listen Recitation',
    zakatTitle: 'Shariah Zakat Calculator',
    zakatSubtitle: 'Calculate your exact annual Zakat on gold, silver, cash, and investments accurately.',

    // Courses & Learning
    courseLessons: 'Lessons',
    courseDuration: 'Hours',
    courseEnroll: 'Enroll in Course',
    courseEnrolled: 'Enrolled',
    courseFree: 'FREE',
    courseCurriculum: 'Course Curriculum',
    courseInstructor: 'Lead Instructor',
    courseReviews: 'Student Reviews',
    continueLearning: 'Continue Learning',
    completedPercentage: 'Completed',

    // Adventure Game & Puzzles
    gameTitle: 'Islamic Educational Adventure Saga',
    gameSubtitle: 'Class 1 to Class 10 progression, 100 levels per grade, interactive puzzles, and leaderboards.',
    gameLevel: 'Level',
    gameXp: 'XP',
    gameCoins: 'Coins',
    gameHearts: 'Lives',
    gameStreak: 'Daily Streak',
    gameStartStage: 'Start Level',
    gameNextQuestion: 'Next Challenge',
    gameFinishStage: 'Complete Level',
    gameVictory: 'Victory! Level Completed',
    gameDefeat: 'Stage Incomplete - Try Again',
    gameScore: 'Score',
    gameAccuracy: 'Accuracy',
    gameDailyMissions: 'Daily Missions',
    gameArena1v1: '1-v-1 Arena Battle',
    gameShop: 'Power-Up Store',
    gameHint: 'Scholar Hint',
    game5050: '50/50 Fifty-Fifty',
    gameTimeBoost: 'Time Boost +15s',

    // Admin Central Console
    adminTitle: 'Central Administrative Console',
    adminSubtitle: 'Comprehensive governance across curriculum, books, examinations, and deployments.',
    adminSidebarMain: 'ACADEMIC GOVERNANCE',
    adminSidebarDashboard: 'Dashboard & KPIs',
    adminSidebarReleases: 'Release Manager & Deploy',
    adminSidebarCourses: 'Courses & Lessons',
    adminSidebarLibrary: 'Library (300+ Books)',
    adminSidebarQuizzes: 'Examinations Studio',
    adminSidebarGameStudio: 'Adventure Game Studio',
    adminSidebarUsersSection: 'STUDENTS & FACULTY',
    adminSidebarUsers: 'Users & Students Portal',
    adminSidebarInstructors: 'Scholars & Faculty',
    adminSidebarCertificates: 'Royal Certificates',
    adminSidebarFinanceSection: 'FINANCE & CUSTOMER DESK',
    adminSidebarOrders: 'Orders & Coupons',
    adminSidebarSupport: 'Customer Support Desk',
    adminSidebarSecuritySection: 'SECURITY & SYSTEM',
    adminSidebarAuditLogs: 'Security Audit Logs',
    adminSidebarSettings: 'System Settings & Backup',
    adminDeployAll: 'Deploy All Changes to Live Users 🚀',
    adminStagingAlert: 'Staged Drafts Ready for Deployment',
    adminDraft: 'Draft / Testing',
    adminPublished: 'Live Published ✓',
    adminActionPublish: 'Publish Live',
    adminActionDelete: 'Delete',
    adminActionEdit: 'Edit',

    // Common Buttons & Messages
    btnSave: 'Save Changes',
    btnCancel: 'Cancel',
    btnDelete: 'Delete',
    btnEdit: 'Edit',
    btnConfirm: 'Confirm',
    btnBack: 'Go Back',
    btnViewDetails: 'View Details',
    msgSuccess: 'Operation completed successfully!',
    msgError: 'An unexpected error occurred.',
    offlineNotice: 'You are currently offline. Changes are saved locally.'
  },

  ur: {
    // Brand & Navigation
    brandName: 'لرن ہب',
    proPlatform: 'اسلامک اکیڈمی',
    navCourses: 'کورسز',
    navQuran: 'القرآن الکریم',
    navHadith: 'ذخیرۂ احادیث',
    navLibrary: 'اسلامی کتب خانہ',
    navArticles: 'مضامین و رہنمائی',
    navQuizzes: 'ایڈونچر و امتحانات',
    navAdventure: 'اسلامی ایڈونچر گیم',
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
    navGetStarted: 'مفت شروع کریں',
    navSignOut: 'لاگ آؤٹ',
    searchPlaceholder: 'فوری تلاش کریں (قرآن، حدیث، کتب، کورسز)...',
    language: 'زبان',
    roleStudent: 'طالب علم',
    roleInstructor: 'استاد محترم',
    roleAdmin: 'ایڈمنسٹریٹر',
    profileSettings: 'پروفائل اور ترتیبات',

    // Hero & Home Section
    heroBadge: '🌟 مستند آن لائن اسلامک لرننگ پلیٹ فارم',
    heroTitle: 'مستند دینی و جدید علوم میں کمال حاصل کریں جید اساتذہ کے ساتھ',
    heroSubtitle: '300+ نایاب اسلامی کتب، 114 سورتیں مع 10 قراء کی تلاوت، لائیو حرمین شریفین براڈکاسٹ، اور کیو آر کوڈ تصدیق شدہ شاہی اسناد حاصل کریں۔',
    startLearning: 'مفت تعلیم شروع کریں',
    exploreLibrary: '300+ کتب کا مطالعہ کریں',
    exploreCourses: 'اسلامی کورسز دیکھیں',
    exploreAdventure: 'ایڈونچر گیم کھیلیں',
    statsStudents: 'فعال طلباء',
    statsSurahs: 'قرآنی سورتیں',
    statsBooks: 'مستند اسلامی کتب',
    statsCertificates: 'جاری شدہ شاہی اسناد',

    // Islamic Sections & Banners
    quranTitle: 'القرآن الکریم (مکمل 114 سورتیں)',
    quranSubtitle: 'لفظ بہ لفظ تجوید، 10 نامور قراء کی تلاوت، اور مستند اردو و انگریزی تفاسیر۔',
    hadithTitle: 'ذخیرۂ احادیثِ نبویہ ﷺ و ریاض الصالحین',
    hadithSubtitle: 'صحیح بخاری، صحیح مسلم، سنن اربعہ اور جدید علمی تخریج کے ساتھ۔',
    libraryTitle: 'کتب خانہ اہلِ سنت و ذخیرۂ سلف صالحین',
    librarySubtitle: '300 سے زائد نایاب تفاسیر، کتبِ حدیث، فقہ اور سیرت النبی ﷺ آن لائن مطالعہ و پی ڈی ایف کے لیے دستیاب۔',
    readBook: 'آن لائن پڑھیں',
    downloadPdf: 'پی ڈی ایف حاصل کریں',
    bookAuthor: 'مصنف',
    bookPages: 'صفحات',
    bookCategory: 'کیٹیگری',
    bookRating: 'درجہ بندی',
    viewsCount: 'مشاہدات',
    downloadsCount: 'ڈاؤنلوڈز',

    // Features & Spiritual Tools
    liveMakkah: 'مسجد الحرام (مکہ مکرمہ لائیو)',
    liveMadinah: 'مسجد نبوی (مدینہ منورہ لائیو)',
    qiblaCompass: 'لائیو قبلہ کمپاس',
    prayerTimes: 'اوقاتِ نماز',
    fajr: 'فجر',
    dhuhr: 'ظہر',
    asr: 'عصر',
    maghrib: 'مغرب',
    isha: 'عشاء',
    gpsLocation: 'میرا موجودہ مقام (GPS)',
    salawatCounter: 'درود شریف کاؤنٹر',
    sendDurood: 'درود شریف پڑھا +1',
    copyText: 'کاپی کریں',
    copiedToast: 'متن کاپی ہو گیا!',
    bookmarkText: 'محفوظ کریں',
    audioListen: 'تلاوت سنیں',
    zakatTitle: 'شرعی زکوٰۃ کیلکولیٹر',
    zakatSubtitle: 'سونے، چاندی، نقدی اور تجارتی مال پر اپنی سالانہ زکوٰۃ کا مکمل شرعی حساب لگائیں۔',

    // Courses & Learning
    courseLessons: 'اسباق',
    courseDuration: 'گھنٹے',
    courseEnroll: 'کورس میں داخلہ لیں',
    courseEnrolled: 'داخلہ مکمل',
    courseFree: 'مفت (FREE)',
    courseCurriculum: 'کورس کا مکمل نصاب',
    courseInstructor: 'استاد محترم',
    courseReviews: 'طلباء کی آراء',
    continueLearning: 'تعلیم جاری رکھیں',
    completedPercentage: 'مکمل ہوا',

    // Adventure Game & Puzzles
    gameTitle: 'اسلامی ایڈونچر گیم و چیلنجز',
    gameSubtitle: 'کلاس 1 تا کلاس 10 کا تدریجی نصاب، ہر کلاس میں 100 مراحل، پزلز اور 1-v-1 میدان۔',
    gameLevel: 'لیول',
    gameXp: 'علمی ترقی (XP)',
    gameCoins: 'طلائی سکے (Coins)',
    gameHearts: 'زندگیاں (Hearts)',
    gameStreak: 'مسلسل حاضری (Streak)',
    gameStartStage: 'مرحلہ شروع کریں',
    gameNextQuestion: 'اگلا سوال',
    gameFinishStage: 'مرحلہ مکمل ہوا',
    gameVictory: 'مبارک! مرحلہ فتح ہو گیا',
    gameDefeat: 'مرحلہ ناکام - دوبارہ کوشش کریں',
    gameScore: 'اسکور',
    gameAccuracy: 'درستگی',
    gameDailyMissions: 'روزانہ مشنز',
    gameArena1v1: '1-v-1 علمی مقابلہ',
    gameShop: 'سکوں کی دکان',
    gameHint: 'عالم کا اشارہ',
    game5050: 'نصف اختیارات (50/50)',
    gameTimeBoost: 'وقت کا اضافہ (+15s)',

    // Admin Central Console
    adminTitle: 'مرکزی ایڈمن کنٹرول روم',
    adminSubtitle: 'نصاب، کتب، امتحانات اور تمام ترامیم کی منظم نگرانی اور لائیو ریلیز مینیجر۔',
    adminSidebarMain: '📊 مرکزی اکیڈمک انتظام',
    adminSidebarDashboard: 'ڈیش بورڈ و تجزیات',
    adminSidebarReleases: 'ریلیز مینیجر و پبلشنگ',
    adminSidebarCourses: 'کورسز و اسباق',
    adminSidebarLibrary: 'کتب خانہ (300+ کتب)',
    adminSidebarQuizzes: 'معروضی امتحانات',
    adminSidebarGameStudio: 'گیم اسٹوڈیو و ایڈونچر',
    adminSidebarUsersSection: '👥 طلباء و فیکلٹی',
    adminSidebarUsers: 'صارفین و طلباء پورٹل',
    adminSidebarInstructors: 'اساتذۂ کرام و شیوخ',
    adminSidebarCertificates: 'شاہی اسناد مینجمنٹ',
    adminSidebarFinanceSection: '💳 مالیات و کسٹمر سروس',
    adminSidebarOrders: 'آرڈرز و کوپنز',
    adminSidebarSupport: 'کسٹمر سپورٹ ڈیسک',
    adminSidebarSecuritySection: '🛡️ سیکیورٹی و کنٹرول',
    adminSidebarAuditLogs: 'سیکیورٹی آڈٹ لاگز',
    adminSidebarSettings: 'ترتیبات و بیک اپ',
    adminDeployAll: 'تمام ترامیم لائیو شائع کریں 🚀',
    adminStagingAlert: 'غیر شائع شدہ مسودات ریلیز کے لیے تیار ہیں',
    adminDraft: 'مسودہ (Draft)',
    adminPublished: 'لائیو شائع شدہ ✓',
    adminActionPublish: 'شائع کریں',
    adminActionDelete: 'حذف کریں',
    adminActionEdit: 'ترمیم',

    // Common Buttons & Messages
    btnSave: 'محفوظ کریں',
    btnCancel: 'منسوخ',
    btnDelete: 'حذف کریں',
    btnEdit: 'ترمیم کریں',
    btnConfirm: 'تصدیق کریں',
    btnBack: 'واپس جائیں',
    btnViewDetails: 'تفصیلات دیکھیں',
    msgSuccess: 'عمل کامیابی سے مکمل ہو گیا!',
    msgError: 'ایک غیر متوقع مسئلہ پیش آیا۔',
    offlineNotice: 'آپ اس وقت آف لائن ہیں۔ تبدیلیاں لوکل محفوظ کی جا رہی ہیں۔'
  },

  ar: {
    // Brand & Navigation
    brandName: 'ليرن هب',
    proPlatform: 'الأكاديمية الإسلامية',
    navCourses: 'الدورات التعليمية',
    navQuran: 'القرآن الكريم',
    navHadith: 'المكتبة الحديثية',
    navLibrary: 'المكتبة الرقمية',
    navArticles: 'المقالات والبحوث',
    navQuizzes: 'المغامرة والاختبارات',
    navAdventure: 'مغامرة إسلامية',
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
    navGetStarted: 'ابدأ مجاناً',
    navSignOut: 'تسجيل الخروج',
    searchPlaceholder: 'بحث سريع في القرآن، الحديث، الكتب، الدورات...',
    language: 'اللغة',
    roleStudent: 'طالب علم',
    roleInstructor: 'أستاذ / شيخ',
    roleAdmin: 'مدير النظام',
    profileSettings: 'الملف الشخصي والإعدادات',

    // Hero & Home Section
    heroBadge: '🌟 المنصة الرائدة للعلوم الشرعية والمعاصرة',
    heroTitle: 'أتقن العلوم الشرعية والنافعة بتأصيل علمي مع كبار العلماء',
    heroSubtitle: 'أكثر من 300 كتاب من تراث السلف الصالح، تلاوات 10 قراء، بوصلة القبلة الذكية، وبث حي للحرمين مع شهادات موثقة برمز الاستجابة السريعة.',
    startLearning: 'ابدأ التعلم الآن',
    exploreLibrary: 'تصفح 300+ كتاب',
    exploreCourses: 'تصفح الدورات الشرعية',
    exploreAdventure: 'العب المغامرة الإسلامية',
    statsStudents: 'الطلاب المسجلون',
    statsSurahs: 'سور القرآن الكريم',
    statsBooks: 'الكتب والمراجع المعتمدة',
    statsCertificates: 'الشهادات الصادرة',

    // Islamic Sections & Banners
    quranTitle: 'القرآن الكريم (114 سورة كاملة)',
    quranSubtitle: 'تجويد كلمة بكلمة، تلاوات خاشعة لعشرة من كبار القراء، وتفاسير معتمدة.',
    hadithTitle: 'الجامع الشامل للحديث الشريف ورياض الصالحين',
    hadithSubtitle: 'أحاديث صحيحة من صحيحي البخاري ومسلم والسنن مع التخريج العلمي الحديث.',
    libraryTitle: 'مكتبة أهل الحديث وتراث السلف الصالح',
    librarySubtitle: 'أكثر من 300 كتاب ومصنف في التفسير، العقيدة، الفقه والسيرة للقراءة المباشرة والتحميل.',
    readBook: 'قراءة أونلاين',
    downloadPdf: 'تحميل PDF',
    bookAuthor: 'المؤلف',
    bookPages: 'الصفحات',
    bookCategory: 'التصنيف',
    bookRating: 'التقييم',
    viewsCount: 'المشاهدات',
    downloadsCount: 'التحميلات',

    // Features & Spiritual Tools
    liveMakkah: 'المسجد الحرام (مكة المكرمة مباشر)',
    liveMadinah: 'المسجد النبوي (المدينة المنورة مباشر)',
    qiblaCompass: 'بوصلة القبلة الحية',
    prayerTimes: 'مواقيت الصلاة',
    fajr: 'الفجر',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
    gpsLocation: 'موقعي الحالي (GPS)',
    salawatCounter: 'عداد الصلاة على النبي ﷺ',
    sendDurood: 'صليت على النبي +1',
    copyText: 'نسخ النص',
    copiedToast: 'تم نسخ النص بنجاح!',
    bookmarkText: 'حفظ كإشارة',
    audioListen: 'استماع للتلاوة',
    zakatTitle: 'حاسبة الزكاة الشرعية',
    zakatSubtitle: 'احسب زكاتك السنوية على الذهب، الفضة، السيولة النقدية وعروض التجارة بدقة شرعية.',

    // Courses & Learning
    courseLessons: 'الدروس',
    courseDuration: 'ساعات',
    courseEnroll: 'التسجيل في الدورة',
    courseEnrolled: 'مسجل بالفعل',
    courseFree: 'مجاناً (FREE)',
    courseCurriculum: 'المنهج الدراسي للدورة',
    courseInstructor: 'الشيخ المحاضر',
    courseReviews: 'تقييمات الطلاب',
    continueLearning: 'متابعة التعلم',
    completedPercentage: 'نسبة الإنجاز',

    // Adventure Game & Puzzles
    gameTitle: 'ملحمة المغامرة الإسلامية التعليمية',
    gameSubtitle: 'منهج متدرج من الصف الأول حتى العاشر، 100 مرحلة لكل صف، ألغاز ذكية ومنافسات حية.',
    gameLevel: 'المستوى',
    gameXp: 'نقاط الخبرة (XP)',
    gameCoins: 'النقود الذهبية',
    gameHearts: 'القلوب المتبقية',
    gameStreak: 'أيام الحضور المتواصل',
    gameStartStage: 'بدء المرحلة',
    gameNextQuestion: 'التحدي التالي',
    gameFinishStage: 'إتمام المرحلة',
    gameVictory: 'مبارك! تم اجتياز المرحلة بنجاح',
    gameDefeat: 'لم تجتز المرحلة - أعد المحاولة',
    gameScore: 'النقاط',
    gameAccuracy: 'الدقة',
    gameDailyMissions: 'المهام اليومية',
    gameArena1v1: 'تحدي المواجهة 1-v-1',
    gameShop: 'متجر المكافآت',
    gameHint: 'إشارة الشيخ',
    game5050: 'حذف خيارين (50/50)',
    gameTimeBoost: 'زيادة الوقت (+15 ثانية)',

    // Admin Central Console
    adminTitle: 'لوحة التحكم والإدارة المركزية',
    adminSubtitle: 'إدارة متكاملة للمناهج، المكتبة، الاختبارات، وعمليات النشر والإصدار.',
    adminSidebarMain: '📊 الإدارة الأكاديمية المركزية',
    adminSidebarDashboard: 'لوحة التحكم والتحليلات',
    adminSidebarReleases: 'مدير الإصدارات والنشر',
    adminSidebarCourses: 'الدورات والدروس',
    adminSidebarLibrary: 'المكتبة (300+ كتاب)',
    adminSidebarQuizzes: 'الاختبارات الموضوعية',
    adminSidebarGameStudio: 'استوديو الألعاب والمغامرة',
    adminSidebarUsersSection: '👥 الطلاب وأعضاء الهيئة',
    adminSidebarUsers: 'بوابة الطلاب والمستخدمين',
    adminSidebarInstructors: 'العلماء والأساتذة',
    adminSidebarCertificates: 'إدارة الشهادات المعتمدة',
    adminSidebarFinanceSection: '💳 المالية وخدمة العملاء',
    adminSidebarOrders: 'الطلبات وكوبونات الخصم',
    adminSidebarSupport: 'مكتب الدعم الفني',
    adminSidebarSecuritySection: '🛡️ الأمان والنظام',
    adminSidebarAuditLogs: 'سجلات المراقبة والأمان',
    adminSidebarSettings: 'الإعدادات والنسخ الاحتياطي',
    adminDeployAll: 'نشر كافة التعديلات لجميع الطلاب 🚀',
    adminStagingAlert: 'مسودات وتعديلات جاهزة للنشر',
    adminDraft: 'مسودة (Draft)',
    adminPublished: 'منشور ومتاح ✓',
    adminActionPublish: 'نشر الآن',
    adminActionDelete: 'حذف',
    adminActionEdit: 'تعديل',

    // Common Buttons & Messages
    btnSave: 'حفظ التغييرات',
    btnCancel: 'إلغاء',
    btnDelete: 'حذف',
    btnEdit: 'تعديل',
    btnConfirm: 'تأكيد',
    btnBack: 'رجوع',
    btnViewDetails: 'عرض التفاصيل',
    msgSuccess: 'تمت العملية بنجاح!',
    msgError: 'حدث خطأ غير متوقع.',
    offlineNotice: 'أنت غير متصل بالإنترنت حالياً. يتم حفظ التغييرات محلياً.'
  }
};

class InternationalizationService {
  constructor() {
    this.currentLanguage = this.loadLanguage();
    this.applyLanguage(this.currentLanguage);
  }

  loadLanguage() {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved && ['en', 'ur', 'ar'].includes(saved)) {
      return saved;
    }
    return 'en'; // Default to English as requested
  }

  getLanguage() {
    return this.currentLanguage || 'ur';
  }

  getCurrentLanguage() {
    return this.currentLanguage || 'ur';
  }

  isRTL() {
    return this.currentLanguage === 'ur' || this.currentLanguage === 'ar';
  }

  setLanguage(lang) {
    if (!['en', 'ur', 'ar'].includes(lang)) return;
    this.currentLanguage = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    this.applyLanguage(lang);

    // Close mobile drawer if open
    const drawer = document.getElementById('mobile-menu-drawer');
    if (drawer) drawer.classList.add('hidden');

    window.dispatchEvent(new CustomEvent('learnhub:language_changed', { detail: { language: lang } }));
  }

  t(key, fallback = '') {
    const dict = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS['en'];
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    // Fallback to English dictionary
    if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key] !== undefined) {
      return TRANSLATIONS['en'][key];
    }
    return fallback || key;
  }

  applyLanguage(lang = this.currentLanguage) {
    if (!lang) lang = this.currentLanguage || 'ur';
    const isRtl = lang === 'ur' || lang === 'ar';
    if (document.documentElement) {
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }

    // Body font family switching with safe null check
    if (document.body) {
      document.body.classList.remove('font-urdu', 'font-arabic', 'font-sans');
      if (lang === 'ur') {
        document.body.classList.add('font-urdu');
      } else if (lang === 'ar') {
        document.body.classList.add('font-arabic');
      } else {
        document.body.classList.add('font-sans');
      }
    }

    // Auto-translate static DOM elements
    this.translateDOM();

    // Update current language label on switcher
    const langLabel = document.getElementById('current-lang-label');
    if (langLabel) {
      if (lang === 'ur') langLabel.textContent = '🇵🇰 اردو';
      else if (lang === 'ar') langLabel.textContent = '🇸🇦 العربية';
      else langLabel.textContent = '🇬🇧 English';
    }

    // Re-render UI components
    if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
      window.App.updateNavbarUserUI();
    }
    if (window.Router && typeof window.Router.handleRouting === 'function') {
      window.Router.handleRouting();
    }
  }

  translateDOM(root = document) {
    // Elements with data-i18n
    root.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key, el.textContent);
      }
    });

    // Placeholders with data-i18n-placeholder
    root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.setAttribute('placeholder', this.t(key, el.getAttribute('placeholder')));
      }
    });

    // Titles with data-i18n-title
    root.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        el.setAttribute('title', this.t(key, el.getAttribute('title')));
      }
    });
  }
}

// Global Singleton Instance
window.I18N = new InternationalizationService();
window.__ = (key, fallback) => window.I18N.t(key, fallback);

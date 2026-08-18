/**
 * LearnHub Internationalization (i18n) Engine
 * Full multi-language support for English (en), Urdu (ur), and Arabic (ar) with RTL formatting.
 */

const LANG_STORAGE_KEY = 'learnhub_language_v1';

const TRANSLATIONS = {
  en: {
    // Navigation
    brandName: 'LearnHub',
    proPlatform: 'Pro Platform',
    navCourses: 'Courses',
    navQuizzes: 'Standalone Quizzes',
    navDiscussions: 'Discussions',
    navResources: 'Resources',
    navSupport: 'Support',
    navDashboard: 'Dashboard',
    navMyCourses: 'My Courses',
    navCertificates: 'Certificates',
    navAchievements: 'Achievements',
    navWishlist: 'Wishlist',
    navAdmin: 'Admin Panel',
    navSignIn: 'Sign In',
    navGetStarted: 'Get Started',
    navSignOut: 'Sign Out',
    searchPlaceholder: 'Quick Search...',
    language: 'Language',

    // Hero Section
    badgeHero: 'Next-Gen Learning & Standalone Assessments',
    heroTitlePrefix: 'Master Tech Skills with',
    heroTitleGradient: 'World-Class Mentors',
    heroSubtitle: 'Access hands-on courses, test real-world mastery with standalone timed quizzes, and earn verifiable industry credentials.',
    heroSearchInput: 'Search courses, standalone quizzes, instructors, skills...',
    heroSearchBtn: 'Search',
    popularTags: 'Popular:',
    activeLearners: 'Active Learners',
    satisfactionRate: 'Satisfaction Rate',
    verifiedCerts: 'Verified Certs',
    continueLearning: 'Continue Learning',
    standaloneAssessment: 'Standalone Assessment',
    startDiagnostic: 'Start Timed Diagnostic',
    verifiedCredential: 'Verified Industry Certificate',

    // Sections
    exploreCategories: 'Explore Categories',
    exploreCategoriesSub: 'Learn in-demand technologies',
    browseAllCategories: 'Browse all categories',
    topRated: 'Top Rated',
    featuredMasterclasses: 'Featured Masterclasses',
    featuredMasterclassesSub: 'Structured comprehensive courses taught by industry leaders.',
    viewAllCourses: 'View All Courses',
    standaloneSpotlightBadge: 'Standalone Diagnostic Engine',
    standaloneSpotlightTitle: 'Test Your Skills Directly With Standalone Quizzes',
    standaloneSpotlightSub: 'No course enrollment required. Take timed assessments, receive instant question-by-question explanations, and benchmark your knowledge.',
    browseAllQuizzes: 'Browse All Quizzes',
    startQuiz: 'Start Quiz',
    expertMentors: 'Expert Mentors',
    topInstructorsTitle: 'Learn from the World\'s Best',
    topInstructorsSub: 'Every instructor on LearnHub is an active industry practitioner with deep engineering credentials.',
    verifiableCredentialsBadge: 'Verifiable Credentials',
    verifiableCertsTitle: 'Earn Professional Certificates That Stand Out',
    verifiableCertsSub: 'Upon 100% course completion or high-scoring diagnostic quiz achievement, receive an encrypted, digitally verifiable certificate with a permanent URL and QR verification code.',
    studentFeedback: 'Student Feedback',
    trustedByEngineers: 'Trusted by Engineers Everywhere',
    stayAhead: 'Stay Ahead of Emerging Tech',
    newsletterSub: 'Join 65,000+ engineers receiving weekly deep-dive tutorials, standalone diagnostic challenges, and curriculum updates.',
    subscribe: 'Subscribe',

    // Courses & Player
    curriculumLessons: 'Curriculum & Lessons',
    whatYouMaster: 'What you will master',
    requirements: 'Requirements',
    description: 'Description',
    instructor: 'Instructor',
    reviews: 'Reviews',
    enrollFree: 'Enroll in Free Course',
    buyNow: 'Buy Now & Start Learning',
    markComplete: 'Mark as Complete',
    completed: 'Completed ✓',
    previousLesson: 'Previous',
    nextLesson: 'Next',
    finishCourse: 'Finish Masterclass 🎓',

    // Standalone Quizzes
    diagnosticAssessments: 'Standalone Diagnostic Assessments',
    skillVerificationQuizzes: 'Skill Verification Quizzes',
    skillVerificationSub: 'Take independent timed quizzes to validate your engineering proficiency.',
    myQuizAttempts: 'My Quiz Attempts',
    timeLimit: 'Time Limit',
    passingGrade: 'Passing Grade',
    maxAttempts: 'Max Retakes',
    startTimedQuiz: 'Start Timed Quiz',
    questionNavigator: 'Question Navigator',
    flagQuestion: 'Flag question',
    submitQuiz: 'Submit Quiz',
    examPassed: 'EXAM PASSED',
    examFailed: 'EXAM FAILED',
    retakeExam: 'Retake Exam',
    questionBreakdown: 'Question Breakdown & Explanations',

    // Dashboard
    welcomeBack: 'Welcome back',
    dailyStreak: 'Daily Streak',
    daysActive: 'Days Active',
    personalBest: 'Personal Best',
    enrolledCourses: 'Enrolled Courses',
    completedCourses: 'Completed Courses',
    quizAttempts: 'Quiz Attempts',
    certificatesEarned: 'Certificates Earned',
    learningActivity: 'Learning Activity',
    past14Days: 'Past 14 Days',

    // Admin
    adminConsole: 'Administration Control Center',
    platformOverview: 'Platform Overview',
    newCourse: 'New Course',
    newQuiz: 'New Standalone Quiz',
    addCoupon: 'Add Coupon',
    grossRevenue: 'Total Gross Revenue',
    quizPassRate: 'Standalone Quiz Pass Rate',
    exitToLearner: 'Exit to Learner View'
  },

  ur: {
    // Navigation (اردو)
    brandName: 'لرن ہب',
    proPlatform: 'پرو پلیٹ فارم',
    navCourses: 'کورسز',
    navQuizzes: 'آزاد کوئزز',
    navDiscussions: 'مباحثے',
    navResources: 'وسائل و مواد',
    navSupport: 'مدد و رہنمائی',
    navDashboard: 'ڈیش بورڈ',
    navMyCourses: 'میرے کورسز',
    navCertificates: 'سرٹیفکیٹس',
    navAchievements: 'کامیابیاں',
    navWishlist: 'پسندیدہ فہرست',
    navAdmin: 'ایڈمن پینل',
    navSignIn: 'لاگ ان کریں',
    navGetStarted: 'شروع کریں',
    navSignOut: 'لاگ آؤٹ',
    searchPlaceholder: 'فوری تلاش کریں...',
    language: 'زبان',

    // Hero Section
    badgeHero: 'جدید ترین تعلیمی نظام اور آزاد امتحانات',
    heroTitlePrefix: 'ٹیکنالوجی کی جدید مہارتیں سیکھیں',
    heroTitleGradient: 'ماہر اساتذہ کے ساتھ',
    heroSubtitle: 'عملی کورسز حاصل کریں، آزادانہ ٹائمر والے کوئزز کے ذریعے اپنی مہارت جانچیں، اور تصدیق شدہ سرٹیفکیٹس حاصل کریں۔',
    heroSearchInput: 'کورسز، آزاد کوئزز، اساتذہ یا مہارتیں تلاش کریں...',
    heroSearchBtn: 'تلاش کریں',
    popularTags: 'مقبول:',
    activeLearners: 'فعال طلباء',
    satisfactionRate: 'اطمینان کی شرح',
    verifiedCerts: 'تصدیق شدہ اسناد',
    continueLearning: 'تعلیم جاری رکھیں',
    standaloneAssessment: 'آزادانہ امتحانی کوئز',
    startDiagnostic: 'ٹائمر والا کوئز شروع کریں',
    verifiedCredential: 'تصدیق شدہ تعلیمی سرٹیفکیٹ',

    // Sections
    exploreCategories: 'تعلیمی زمرہ جات',
    exploreCategoriesSub: 'مارکیٹ میں طلب رکھنے والی ٹیکنالوجیز سیکھیں',
    browseAllCategories: 'تمام زمرہ جات دیکھیں',
    topRated: 'اعلیٰ ترین درجہ بندی',
    featuredMasterclasses: 'نمایاں ماسٹر کلاسز',
    featuredMasterclassesSub: 'انڈسٹری کے ماہرین کے جامع اور معیاری کورسز۔',
    viewAllCourses: 'تمام کورسز دیکھیں',
    standaloneSpotlightBadge: 'آزادانہ کوئز انجن',
    standaloneSpotlightTitle: 'بغیر کورس میں داخلہ لیے براہِ راست کوئز دیں',
    standaloneSpotlightSub: 'کسی کورس میں داخلے کی ضرورت نہیں۔ مقررہ وقت میں ٹیسٹ دیں، ہر سوال کی تفصیلی وضاحت دیکھیں اور اپنی صلاحیت کا جائزہ لیں۔',
    browseAllQuizzes: 'تمام کوئزز دیکھیں',
    startQuiz: 'کوئز شروع کریں',
    expertMentors: 'ماہر اساتذہ',
    topInstructorsTitle: 'دنیا کے بہترین اساتذہ سے سیکھیں',
    topInstructorsSub: 'ہمارے تمام اساتذہ سافٹ ویئر انڈسٹری میں وسیع عملی تجربہ رکھتے ہیں۔',
    verifiableCredentialsBadge: 'قابلِ تصدیق اسناد',
    verifiableCertsTitle: 'پیشہ ورانہ سرٹیفکیٹس حاصل کریں',
    verifiableCertsSub: 'کورس 100% مکمل کرنے پر فوری ڈیجیٹل سرٹیفکیٹ حاصل کریں جس کی آن لائن پورٹل پر فوری تصدیق کی جا سکتی ہے۔',
    studentFeedback: 'طالب علموں کی آراء',
    trustedByEngineers: 'دنیا بھر کے سافٹ ویئر انجینئرز کا اعتماد',
    stayAhead: 'ٹیکنالوجی کے میدان میں آگے رہیں',
    newsletterSub: 'ہزاروں انجینئرز کے ساتھ شامل ہوں اور ہفتہ وار اسباق، چیلنجز اور اپ ڈیٹس حاصل کریں۔',
    subscribe: 'سبسکرائب کریں',

    // Courses & Player
    curriculumLessons: 'کورس کا نصاب اور اسباق',
    whatYouMaster: 'آپ کیا سیکھیں گے',
    requirements: 'بنیادی ضروریات',
    description: 'تفصیلات',
    instructor: 'استاد',
    reviews: 'ریویوز',
    enrollFree: 'مفت کورس میں داخلہ لیں',
    buyNow: 'خریدیں اور فوری پڑھنا شروع کریں',
    markComplete: 'مکمل نشان زد کریں',
    completed: 'مکمل ہو گیا ✓',
    previousLesson: 'پچھلا سبق',
    nextLesson: 'اگلا سبق',
    finishCourse: 'ماسٹر کلاس مکمل کریں 🎓',

    // Standalone Quizzes
    diagnosticAssessments: 'آزادانہ تشخیصی امتحانات',
    skillVerificationQuizzes: 'مہارت کی جانچ کے کوئزز',
    skillVerificationSub: 'اپنی انجینئرنگ صلاحیتوں کی توثیق کے لیے آزاد ٹائمڈ کوئزز دیں۔',
    myQuizAttempts: 'میری سابقہ کوئز کوششیں',
    timeLimit: 'وقت کی حد',
    passingGrade: 'کامیابی کے نمبر',
    maxAttempts: 'زیادہ سے زیادہ کوششیں',
    startTimedQuiz: 'ٹائم والا کوئز شروع کریں',
    questionNavigator: 'سوالات کی فہرست',
    flagQuestion: 'سوال پر نشان لگائیں',
    submitQuiz: 'کوئز جمع کروائیں',
    examPassed: 'امتحان پاس ہو گیا',
    examFailed: 'امتحان فیل ہو گیا',
    retakeExam: 'دوبارہ کوئز دیں',
    questionBreakdown: 'سوالات کا جائزہ اور وضاحتیں',

    // Dashboard
    welcomeBack: 'خوش آمدید',
    dailyStreak: 'روزانہ پڑھائی کا سلسلہ',
    daysActive: 'دن مسلسل فعال',
    personalBest: 'بہترین ریکارڈ',
    enrolledCourses: 'داخلہ شدہ کورسز',
    completedCourses: 'مکمل شدہ کورسز',
    quizAttempts: 'کوئز کی کوششیں',
    certificatesEarned: 'حاصل کردہ سرٹیفکیٹس',
    learningActivity: 'پڑھائی کی سرگرمی',
    past14Days: 'گزشتہ 14 دن',

    // Admin
    adminConsole: 'ایڈمنسٹریشن کنٹرول سینٹر',
    platformOverview: 'پلیٹ فارم جائزہ',
    newCourse: 'نیا کورس بنائیں',
    newQuiz: 'نیا کوئز بنائیں',
    addCoupon: 'کوپن شامل کریں',
    grossRevenue: 'کل آمدنی',
    quizPassRate: 'کوئز پاس کرنے کی شرح',
    exitToLearner: 'طالب علم کے منظر پر واپس جائیں'
  },

  ar: {
    // Navigation (العربية)
    brandName: 'ليرن هب',
    proPlatform: 'منصة احترافية',
    navCourses: 'الدورات التعليمية',
    navQuizzes: 'اختبارات مستقلة',
    navDiscussions: 'المناقشات',
    navResources: 'المصادر والملفات',
    navSupport: 'الدعم والمساعدة',
    navDashboard: 'لوحة التعلم',
    navMyCourses: 'دوراتي',
    navCertificates: 'شهاداتي',
    navAchievements: 'الإنجازات',
    navWishlist: 'المفضلة',
    navAdmin: 'لوحة الإدارة',
    navSignIn: 'تسجيل الدخول',
    navGetStarted: 'ابدأ الآن',
    navSignOut: 'تسجيل الخروج',
    searchPlaceholder: 'بحث سريع...',
    language: 'اللغة',

    // Hero Section
    badgeHero: 'جيل جديد من التعلم والتقييمات المستقلة',
    heroTitlePrefix: 'أتقن المهارات التقنية مع',
    heroTitleGradient: 'أفضل الخبراء والمدربين',
    heroSubtitle: 'احصل على دورات تطبيقية، واختبر مهاراتك من خلال اختبارات مستقلة ومؤقتة، واحصل على شهادات موثقة ومعتمدة.',
    heroSearchInput: 'ابحث عن الدورات، الاختبارات المستقلة، المدربين...',
    heroSearchBtn: 'بحث',
    popularTags: 'الأكثر طلباً:',
    activeLearners: 'متعلم نشط',
    satisfactionRate: 'نسبة الرضا',
    verifiedCerts: 'شهادات معتمدة',
    continueLearning: 'متابعة التعلم',
    standaloneAssessment: 'تقييم تشخيصي مستقل',
    startDiagnostic: 'بدء الاختبار المؤقت',
    verifiedCredential: 'شهادة إتمام معتمدة',

    // Sections
    exploreCategories: 'استكشف التخصصات',
    exploreCategoriesSub: 'تعلم التقنيات الأكثر طلباً في سوق العمل',
    browseAllCategories: 'عرض جميع التخصصات',
    topRated: 'الأعلى تقييماً',
    featuredMasterclasses: 'الدورات المميزة',
    featuredMasterclassesSub: 'دورات شاملة واحترافية يقدمها نخبة من خبراء الصناعة.',
    viewAllCourses: 'عرض جميع الدورات',
    standaloneSpotlightBadge: 'محرك الاختبارات المستقلة',
    standaloneSpotlightTitle: 'اختبر مهاراتك مباشرة باختبارات مستقلة',
    standaloneSpotlightSub: 'لا يشترط التسجيل في دورة مسبقة. خض اختبارات محددة بوقت، واطلع على الشروحات الفورية لكل سؤال وقيم مستواك.',
    browseAllQuizzes: 'عرض كافة الاختبارات',
    startQuiz: 'بدء الاختبار',
    expertMentors: 'نخبة المدربين',
    topInstructorsTitle: 'تعلم من أفضل الكفاءات العالمية',
    topInstructorsSub: 'جميع مدربينا خبراء ممارسون يمتلكون سنوات من الخبرة الهندسية.',
    verifiableCredentialsBadge: 'شهادات قابلة للتحقق',
    verifiableCertsTitle: 'احصل على شهادات مهنية تعزز سيرتك الذاتية',
    verifiableCertsSub: 'عند إتمام 100% من متطلبات الدورة، تحصل على شهادة رقمية مشفرة برابط تحقق مباشر ورمز QR.',
    studentFeedback: 'آراء المتعلمين',
    trustedByEngineers: 'موثوق من آلاف المهندسين حول العالم',
    stayAhead: 'ابق في صدارة التطور التقني',
    newsletterSub: 'انضم إلى أكثر من 65,000 مهندس يتلقون نصائح أسبوعية وتحديات تقنية دورية.',
    subscribe: 'اشتراك',

    // Courses & Player
    curriculumLessons: 'المنهج والدروس',
    whatYouMaster: 'ماذا ستتعلم في هذه الدورة',
    requirements: 'المتطلبات الأساسية',
    description: 'الوصف الكامل',
    instructor: 'المدرب',
    reviews: 'التقييمات',
    enrollFree: 'التسجيل في الدورة المجانية',
    buyNow: 'الشراء وبدء التعلم فوراً',
    markComplete: 'تحديد كمكتمل',
    completed: 'مكتمل ✓',
    previousLesson: 'الدرس السابق',
    nextLesson: 'الدرس التالي',
    finishCourse: 'إنهاء الدورة والحصول على الشهادة 🎓',

    // Standalone Quizzes
    diagnosticAssessments: 'تقييمات تشخيصية مستقلة',
    skillVerificationQuizzes: 'اختبارات التحقق من المهارات',
    skillVerificationSub: 'اختبر مهاراتك البرمجية والتقنية بشكل مستقل وسريع.',
    myQuizAttempts: 'محاولاتي السابقة',
    timeLimit: 'الوقت المتاح',
    passingGrade: 'نسبة النجاح',
    maxAttempts: 'أقصى عدد للمحاولات',
    startTimedQuiz: 'بدء الاختبار المحدد بوقت',
    questionNavigator: 'لوحة الأسئلة',
    flagQuestion: 'تمييز السؤال للمراجعة',
    submitQuiz: 'تسليم الاختبار',
    examPassed: 'تم اجتياز الاختبار بنجاح',
    examFailed: 'لم يتم اجتياز الاختبار',
    retakeExam: 'إعادة الاختبار',
    questionBreakdown: 'مراجعة الإجابات والشروحات',

    // Dashboard
    welcomeBack: 'مرحباً بك مجدداً',
    dailyStreak: 'سلسلة التعلم اليومية',
    daysActive: 'أيام متتالية',
    personalBest: 'أفضل رقم قياسي',
    enrolledCourses: 'الدورات المسجلة',
    completedCourses: 'الدورات المكتملة',
    quizAttempts: 'محاولات الاختبارات',
    certificatesEarned: 'الشهادات المكتسبة',
    learningActivity: 'نشاط التعلم',
    past14Days: 'آخر 14 يوماً',

    // Admin
    adminConsole: 'مركز التحكم الإداري',
    platformOverview: 'نظرة عامة على المنصة',
    newCourse: 'إنشاء دورة جديدة',
    newQuiz: 'إنشاء اختبار مستقل',
    addCoupon: 'إضافة كوبون خصم',
    grossRevenue: 'إجمالي الإيرادات',
    quizPassRate: 'نسبة اجتياز الاختبارات',
    exitToLearner: 'العودة لواجهة الطالب'
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
    return 'ur'; // Default to Urdu as requested by user
  }

  setLanguage(lang) {
    if (!['en', 'ur', 'ar'].includes(lang)) return;
    this.currentLanguage = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    this.applyLanguage(lang);
    window.dispatchEvent(new CustomEvent('learnhub:lang_changed', { detail: { lang } }));
    if (window.Router) {
      window.Router.handleRouting();
    }
  }

  applyLanguage(lang) {
    const isRtl = lang === 'ur' || lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.body.dir = isRtl ? 'rtl' : 'ltr';
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  isRTL() {
    return this.currentLanguage === 'ur' || this.currentLanguage === 'ar';
  }

  t(key, fallback = '') {
    const dict = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.en;
    if (dict && dict[key]) {
      return dict[key];
    }
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  }

  getSupportedLanguages() {
    return [
      { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
      { code: 'ur', name: 'اردو (Urdu)', flag: '🇵🇰', dir: 'rtl' },
      { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦', dir: 'rtl' }
    ];
  }
}

window.I18N = new InternationalizationService();

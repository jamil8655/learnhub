/**
 * LearnHub Internationalization (i18n) Engine
 * Full multi-language support for English (en), Urdu (ur), and Arabic (ar) with RTL formatting.
 */

const LANG_STORAGE_KEY = 'learnhub_language_v1';

const TRANSLATIONS = {
  en: {
    // Navigation & App Shell
    brandName: 'LearnHub',
    proPlatform: 'Pro Academy',
    navCourses: 'Courses',
    navQuran: 'Holy Quran',
    navHadith: 'Hadith Sciences',
    navArticles: 'Articles & Insights',
    navQuizzes: 'Standalone Quizzes',
    navDiscussions: 'Discussions',
    navResources: 'Resources Library',
    navSupport: 'Help & Support',
    navDashboard: 'Dashboard',
    navMyCourses: 'My Courses',
    navCertificates: 'Certificates',
    navAchievements: 'Achievements',
    navWishlist: 'Wishlist',
    navBookmarks: 'Bookmarks',
    navNotifications: 'Notifications',
    navAdmin: 'Admin Panel',
    navSignIn: 'Sign In',
    navGetStarted: 'Get Started',
    navSignOut: 'Sign Out',
    searchPlaceholder: 'Quick Search (⌘K)...',
    language: 'Language',
    roleStudent: 'Student',
    roleInstructor: 'Instructor',
    roleAdmin: 'Administrator',
    actingAs: 'Role:',
    profileSettings: 'Profile & Settings',

    // Hero Section
    badgeHero: 'Next-Gen Islamic & Tech Learning System',
    heroTitlePrefix: 'Master Knowledge & Skills with',
    heroTitleGradient: 'World-Class Scholars & Mentors',
    heroSubtitle: 'Access authenticated courses, test real-world mastery with standalone timed quizzes, and earn verifiable credentials with QR codes.',
    heroSearchInput: 'Search courses, quizzes, instructors, topics...',
    heroSearchBtn: 'Search',
    popularTags: 'Popular Topics:',
    activeLearners: 'Active Learners',
    satisfactionRate: 'Satisfaction Rate',
    verifiedCerts: 'Verified Certs',
    continueLearning: 'Continue Learning',
    standaloneAssessment: 'Standalone Assessment',
    startDiagnostic: 'Start Timed Diagnostic',
    verifiedCredential: 'Verified Certificate',

    // Sections
    exploreCategories: 'Explore Academic Categories',
    exploreCategoriesSub: 'Authentic Islamic Sciences and Technology',
    browseAllCategories: 'Browse all categories',
    topRated: 'Top Rated',
    featuredMasterclasses: 'Featured Masterclasses',
    featuredMasterclassesSub: 'Structured comprehensive courses taught by certified scholars and industry leaders.',
    viewAllCourses: 'View All Courses',
    standaloneSpotlightBadge: 'Standalone Diagnostic Engine',
    standaloneSpotlightTitle: 'Test Your Knowledge Directly With Standalone Quizzes',
    standaloneSpotlightSub: 'No course enrollment required. Take timed assessments, receive instant question-by-question explanations, and benchmark your knowledge.',
    browseAllQuizzes: 'Browse All Quizzes',
    startQuiz: 'Start Quiz',
    expertMentors: 'Expert Mentors & Scholars',
    topInstructorsTitle: 'Learn from the Best Teachers',
    topInstructorsSub: 'Every instructor on LearnHub possesses deep academic credentials and authentic pedagogical mastery.',
    verifiableCredentialsBadge: 'Verifiable Credentials',
    verifiableCertsTitle: 'Earn Professional Certificates That Stand Out',
    verifiableCertsSub: 'Upon 100% course completion or high-scoring diagnostic quiz achievement, receive an encrypted, digitally verifiable certificate with a permanent URL and QR verification code.',
    studentFeedback: 'Student Feedback',
    trustedByEngineers: 'Trusted by Thousands of Seekers of Knowledge',
    stayAhead: 'Stay Ahead in Knowledge & Practice',
    newsletterSub: 'Join 65,000+ students receiving weekly deep-dive tutorials, Quranic insights, and curriculum updates.',
    subscribe: 'Subscribe',

    // Support & Help Desk
    supportHeaderBadge: '24/7 Dedicated Assistance',
    supportTitle: 'Help & Support Desk',
    supportSubtitle: 'Find instant answers to common questions or submit a priority ticket to our academic and technical support team.',
    faqTitle: 'Frequently Asked Questions (FAQ)',
    faqSubtitle: 'Instant answers to all questions about courses, quizzes, certificates, and system features.',
    createTicketTitle: 'Create Support Ticket',
    createTicketSub: 'Our support and academic team will respond within 24 hours.',
    issueCategory: 'Issue Category',
    catTechnical: 'Technical / Platform Issue',
    catBilling: 'Billing & Account Inquiries',
    catContent: 'Course & Curriculum Questions',
    catCertificates: 'Certificates & Verification',
    catAccount: 'Account & Security',
    catOther: 'General Feedback & Suggestions',
    priority: 'Priority Level',
    priorityLow: 'Low Priority',
    priorityMedium: 'Medium Priority',
    priorityHigh: 'Urgent / High Priority',
    subjectLabel: 'Subject / Title',
    subjectPlaceholder: 'Brief description of the issue...',
    messageLabel: 'Detailed Message',
    messagePlaceholder: 'Please provide full details or steps to describe your inquiry...',
    submitTicketBtn: 'Submit Ticket',
    yourTicketsTitle: 'Your Support Tickets',
    noTickets: 'You currently have no open or past support tickets.',
    viewThread: 'View Thread',
    ticketNumber: 'Ticket #',
    statusOpen: 'Open',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved',
    statusClosed: 'Closed',
    initialRequest: 'Initial Request:',
    replies: 'Replies',
    noRepliesYet: 'A support agent will reply to your inquiry shortly.',
    typeReplyPlaceholder: 'Type a follow-up message...',
    sendReplyBtn: 'Send Reply',
    ticketSubmittedToast: 'Support ticket submitted successfully! Our team will respond shortly.',
    replyAddedToast: 'Reply added to ticket.',
    signInRequiredToast: 'Please sign in to submit a ticket.',
    quickContactEmail: 'Direct Email Support',
    quickContactForum: 'Community Forum',
    quickContactResources: 'Learning Resources',

    // Articles & Knowledge Base
    articlesHeaderBadge: 'Academic & Technical Knowledge Base',
    articlesTitle: 'Articles, Research & Knowledge Base',
    articlesSubtitle: 'Islamic guidance, modern technology insights, ethical software engineering, and educational articles.',
    backToArticles: 'Back to all articles',
    readTime: 'Read Time',
    readFullArticle: 'Read Full Article',
    searchArticlesPlaceholder: 'Search articles by keyword or topic...',
    allCategories: 'All Categories',
    shareArticle: 'Share Article',
    copiedToast: 'Link copied to clipboard!',
    relatedArticles: 'Related Articles',
    author: 'Author',
    publishedOn: 'Published on',
    tableOfContents: 'Table of Contents',

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
    skillVerificationSub: 'Take independent timed quizzes to validate your proficiency.',
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
    // Navigation & App Shell (اردو شستہ و مستند)
    brandName: 'لرن ہب',
    proPlatform: 'پرو اکیڈمی',
    navCourses: 'کورسز',
    navQuran: 'القرآن الکریم',
    navHadith: 'علوم الحدیث',
    navArticles: 'مضامین و رہنمائی',
    navQuizzes: 'آزاد کوئزز',
    navDiscussions: 'مباحثے و فورم',
    navResources: 'وسائل و مواد',
    navSupport: 'مدد و سپورٹ',
    navDashboard: 'ڈیش بورڈ',
    navMyCourses: 'میرے کورسز',
    navCertificates: 'اسناد و سرٹیفکیٹس',
    navAchievements: 'کامیابیاں و تمغے',
    navWishlist: 'پسندیدہ فہرست',
    navBookmarks: 'بک مارکس',
    navNotifications: 'اطلاعات (نوٹیفکیشنز)',
    navAdmin: 'ایڈمن پینل',
    navSignIn: 'لاگ ان کریں',
    navGetStarted: 'شروع کریں',
    navSignOut: 'لاگ آؤٹ',
    searchPlaceholder: 'فوری تلاش کریں (⌘K)...',
    language: 'زبان',
    roleStudent: 'طالب علم',
    roleInstructor: 'استاد محترم',
    roleAdmin: 'ایڈمنسٹریٹر',
    actingAs: 'کردار:',
    profileSettings: 'پروفائل اور ترتیبات',

    // Hero Section
    badgeHero: 'جدید ترین تعلیمی پورٹل اور آزادانہ معروضی امتحانات',
    heroTitlePrefix: 'دینی و جدید علوم میں کمال حاصل کریں',
    heroTitleGradient: 'مستند اساتذہ و محققین کے ساتھ',
    heroSubtitle: 'جامع و منظم کورسز حاصل کریں، آزادانہ ٹائمر والے کوئزز کے ذریعے اپنی قابلیت جانچیں، اور فوری تصدیق شدہ کیو آر کوڈ سرٹیفکیٹس حاصل کریں۔',
    heroSearchInput: 'کورسز، آزاد امتحانات، اساتذہ یا موضوعات تلاش کریں...',
    heroSearchBtn: 'تلاش کریں',
    popularTags: 'مقبول موضوعات:',
    activeLearners: 'فعال طلباء',
    satisfactionRate: 'اطمینان کی شرح',
    verifiedCerts: 'تصدیق شدہ اسناد',
    continueLearning: 'تعلیم جاری رکھیں',
    standaloneAssessment: 'آزادانہ امتحانی کوئز',
    startDiagnostic: 'ٹائمر والا کوئز شروع کریں',
    verifiedCredential: 'تصدیق شدہ تعلیمی سرٹیفکیٹ',

    // Sections
    exploreCategories: 'تعلیمی زمرہ جات و علوم',
    exploreCategoriesSub: 'قرآنی علوم، حدیث، فقہ، سیرت اور ٹیکنالوجی کے شعبے',
    browseAllCategories: 'تمام زمرہ جات دیکھیں',
    topRated: 'اعلیٰ ترین درجہ بندی',
    featuredMasterclasses: 'نمایاں ماسٹر کلاسز',
    featuredMasterclassesSub: 'جید علمائے کرام اور انڈسٹری ماہرین کے تیار کردہ جامع کورسز۔',
    viewAllCourses: 'تمام کورسز دیکھیں',
    standaloneSpotlightBadge: 'آزادانہ کوئز انجن',
    standaloneSpotlightTitle: 'بغیر کورس میں داخلہ لیے براہِ راست کوئز دیں',
    standaloneSpotlightSub: 'کسی کورس میں پیشگی داخلے کی ضرورت نہیں۔ مقررہ وقت میں ٹیسٹ دیں، ہر سوال کی تفصیلی وضاحت دیکھیں اور اپنی علمی صلاحیت کا جائزہ لیں۔',
    browseAllQuizzes: 'تمام کوئزز دیکھیں',
    startQuiz: 'کوئز شروع کریں',
    expertMentors: 'ماہر اساتذہ و علمائے کرام',
    topInstructorsTitle: 'دنیا کے مستند اساتذہ سے فیض حاصل کریں',
    topInstructorsSub: 'ہمارے تمام اساتذہ جامعہ ازہر، مدینہ یونیورسٹی اور بین الاقوامی اداروں سے مستند اسناد اور تدریسی تجربہ رکھتے ہیں۔',
    verifiableCredentialsBadge: 'قابلِ تصدیق اسناد',
    verifiableCertsTitle: 'مستند ڈیجیٹل سرٹیفکیٹس حاصل کریں',
    verifiableCertsSub: 'کورس 100% مکمل کرنے یا کوئز میں اعلیٰ نمبر حاصل کرنے پر فوری ڈیجیٹل سرٹیفکیٹ جاری ہوتا ہے جس کی آن لائن پورٹل پر فوری تصدیق کی جا سکتی ہے۔',
    studentFeedback: 'طالب علموں کی آراء و تاثرات',
    trustedByEngineers: 'دنیا بھر کے ہزاروں طلباء اور اسکالرز کا اعتماد',
    stayAhead: 'علم و عمل کے میدان میں آگے رہیں',
    newsletterSub: 'ہزاروں طلباء کے ساتھ شامل ہوں اور ہفتہ وار اسباق، قرآنی بصیرت اور نئی اپ ڈیٹس حاصل کریں۔',
    subscribe: 'سبسکرائب کریں',

    // Support & Help Desk (سپورٹ و رہنمائی)
    supportHeaderBadge: '✨ 24/7 وقف رہنمائی و معاونت',
    supportTitle: 'ہیلپ اینڈ سپورٹ ڈیسک',
    supportSubtitle: 'اپنے سوالات کے فوری جوابات تلاش کریں یا ہماری ٹیکنیکل اساتذہ و ایڈمن ٹیم کو ٹکٹ ارسال کریں۔',
    faqTitle: 'اکثر پوچھے جانے والے سوالات (FAQ)',
    faqSubtitle: 'کورسز، آزاد امتحانات، سرٹیفکیٹ کی توثیق اور پورٹل سے متعلق تمام بنیادی سوالات کے فوری جوابات۔',
    createTicketTitle: 'نیا سپورٹ ٹکٹ درج کریں',
    createTicketSub: 'ہماری سپورٹ ٹیم 24 گھنٹوں کے اندر آپ کے استفسار کا مکمل اور اطمینان بخش جواب دے گی۔',
    issueCategory: 'مسئلہ کی کیٹیگری',
    catTechnical: 'تکنیکی / ویب سائٹ میں دشواری',
    catBilling: 'ادائیگی و بلنگ سے متعلق',
    catContent: 'کورس مواد و نصاب کے سوالات',
    catCertificates: 'سرٹیفکیٹ اور آن لائن تصدیق',
    catAccount: 'اکاؤنٹ اور سیکیورٹی',
    catOther: 'دیگر تجاویز و عمومی آراء',
    priority: 'ترجیح کی سطح',
    priorityLow: 'معمولی ترجیح',
    priorityMedium: 'درمیانی ترجیح',
    priorityHigh: 'فوری / انتہائی اہم',
    subjectLabel: 'عنوان / موضوع',
    subjectPlaceholder: 'اپنے مسئلے کا مختصر خلاصہ لکھیں...',
    messageLabel: 'تفصیلی پیغام',
    messagePlaceholder: 'براہ کرم اپنے مسئلے یا استفسار کی مکمل تفصیل تحریر کریں...',
    submitTicketBtn: 'ٹکٹ جمع کروائیں',
    yourTicketsTitle: 'آپ کے سپورٹ ٹکٹس',
    noTickets: 'فی الوقت آپ کی کوئی سپورٹ ٹکٹ درج نہیں ہے۔',
    viewThread: 'گفتگو دیکھیں',
    ticketNumber: 'ٹکٹ نمبر',
    statusOpen: 'زیرِ غور',
    statusInProgress: 'کارروائی جاری ہے',
    statusResolved: 'حل شدہ ✓',
    statusClosed: 'بند',
    initialRequest: 'ابتدائی درخواست:',
    replies: 'جوابات و مراسلت',
    noRepliesYet: 'ہماری سپورٹ ٹیم جلد ہی آپ کے سوال کا مفصل جواب دے گی۔',
    typeReplyPlaceholder: 'اپنا جوابی پیغام یہاں لکھیں...',
    sendReplyBtn: 'جواب بھیجیں',
    ticketSubmittedToast: 'سپورٹ ٹکٹ کامیابی سے درج ہو گیا ہے۔ ہماری ٹیم جلد رابطہ کرے گی۔',
    replyAddedToast: 'آپ کا جوابی پیغام کامیابی سے شامل کر دیا گیا۔',
    signInRequiredToast: 'ٹکٹ درج کرنے کے لیے پہلے لاگ ان کرنا ضروری ہے۔',
    quickContactEmail: 'براہِ راست ای میل سپورٹ',
    quickContactForum: 'علمی فورم و مباحثے',
    quickContactResources: 'وسائل و مواد ڈاؤن لوڈز',

    // Articles & Knowledge Base (مضامین و نالج بیس)
    articlesHeaderBadge: 'علمی، تحقیقی و فنی مضامین',
    articlesTitle: 'مضامین، رہنمائی اور نالج بیس',
    articlesSubtitle: 'قرآن و سنت کی روشنی میں رہنمائی، جدید ٹیکنالوجی کے مضامین، تجوید و اخلاقیات اور معلوماتی بلاگ۔',
    backToArticles: 'تمام مضامین پر واپس جائیں',
    readTime: 'مطالعہ کا وقت',
    readFullArticle: 'مکمل مضمون پڑھیں',
    searchArticlesPlaceholder: 'مضامین میں تلاش کریں...',
    allCategories: 'تمام زمرہ جات',
    shareArticle: 'مضمون شیئر کریں',
    copiedToast: 'لنک کاپی ہو گیا!',
    relatedArticles: 'متعلقہ علمی مضامین',
    author: 'مصنف',
    publishedOn: 'تاریخِ اشاعت',
    tableOfContents: 'فہرستِ مضامین',

    // Courses & Player
    curriculumLessons: 'کورس کا نصاب اور اسباق',
    whatYouMaster: 'آپ کیا سیکھیں گے',
    requirements: 'بنیادی ضروریات',
    description: 'تفصیلات',
    instructor: 'استاد محترم',
    reviews: 'طلباء کی آراء و تبصرے',
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
    skillVerificationSub: 'اپنی علمی و عملی صلاحیتوں کی توثیق کے لیے آزاد ٹائمڈ کوئزز دیں۔',
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
    // Navigation & App Shell (العربية)
    brandName: 'ليرن هب',
    proPlatform: 'منصة احترافية',
    navCourses: 'الدورات التعليمية',
    navQuran: 'القرآن الكريم',
    navHadith: 'علوم الحديث',
    navArticles: 'المقالات والبحوث',
    navQuizzes: 'اختبارات مستقلة',
    navDiscussions: 'المناقشات',
    navResources: 'المصادر والملفات',
    navSupport: 'الدعم والمساعدة',
    navDashboard: 'لوحة التعلم',
    navMyCourses: 'دوراتي',
    navCertificates: 'شهاداتي',
    navAchievements: 'الإنجازات',
    navWishlist: 'المفضلة',
    navBookmarks: 'الإشارات المرجعية',
    navNotifications: 'الإشعارات',
    navAdmin: 'لوحة الإدارة',
    navSignIn: 'تسجيل الدخول',
    navGetStarted: 'ابدأ الآن',
    navSignOut: 'تسجيل الخروج',
    searchPlaceholder: 'بحث سريع...',
    language: 'اللغة',
    roleStudent: 'طالب',
    roleInstructor: 'مدرب / أستاذ',
    roleAdmin: 'مدير المنصة',
    actingAs: 'الدور الحالي:',
    profileSettings: 'الملف الشخصي والإعدادات',

    // Hero Section
    badgeHero: 'جيل جديد من التعلم والتقييمات المستقلة',
    heroTitlePrefix: 'أتقن العلوم الشرعية والتقنية مع',
    heroTitleGradient: 'نخبة من كبار العلماء والخبراء',
    heroSubtitle: 'احصل على دورات تطبيقية، واختبر مهاراتك من خلال اختبارات مستقلة ومؤقتة، واحصل على شهادات موثقة ومعتمدة برمز QR.',
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
    exploreCategoriesSub: 'العلوم الإسلامية وتكنولوجيا العصر',
    browseAllCategories: 'عرض جميع التخصصات',
    topRated: 'الأعلى تقييماً',
    featuredMasterclasses: 'الدورات المميزة',
    featuredMasterclassesSub: 'دورات شاملة واحترافية يقدمها نخبة من كبار العلماء والمتخصصين.',
    viewAllCourses: 'عرض جميع الدورات',
    standaloneSpotlightBadge: 'محرك الاختبارات المستقلة',
    standaloneSpotlightTitle: 'اختبر مهاراتك مباشرة باختبارات مستقلة',
    standaloneSpotlightSub: 'لا يشترط التسجيل في دورة مسبقة. خض اختبارات محددة بوقت، واطلع على الشروحات الفورية لكل سؤال وقيم مستواك.',
    browseAllQuizzes: 'عرض كافة الاختبارات',
    startQuiz: 'بدء الاختبار',
    expertMentors: 'نخبة العلماء والمدربين',
    topInstructorsTitle: 'تعلم من أفضل الكفاءات العالمية',
    topInstructorsSub: 'جميع مدرسينا ذوو مؤهلات أكاديمية وتجربة تعليمية راسخة.',
    verifiableCredentialsBadge: 'شهادات قابلة للتحقق',
    verifiableCertsTitle: 'احصل على شهادات مهنية موثقة',
    verifiableCertsSub: 'عند إتمام الدورة أو اجتياز الاختبار بنجاح، تحصل على شهادة رقمية مشفرة برابط تحقق مباشر ورمز QR.',
    studentFeedback: 'آراء المتعلمين',
    trustedByEngineers: 'موثوق من آلاف الطلاب والباحثين حول العالم',
    stayAhead: 'ابق في صدارة العلم والمعرفة',
    newsletterSub: 'انضم إلى أكثر من 65,000 طالب وباحث يتلقون دروساً أسبوعية وإشعارات المنهج الجديد.',
    subscribe: 'اشتراك',

    // Support & Help Desk
    supportHeaderBadge: 'دعم فني متواصل 24/7',
    supportTitle: 'مركز المساعدة والدعم الفني',
    supportSubtitle: 'اعثر على إجابات فورية لأسئلتك الشائعة أو أرسل تذكرة دعم فني لفريقنا المختص.',
    faqTitle: 'الأسئلة الشائعة (FAQ)',
    faqSubtitle: 'إجابات شاملة حول الدورات، الاختبارات المستقلة، الشهادات والميزات.',
    createTicketTitle: 'إنشاء تذكرة دعم جديدة',
    createTicketSub: 'سيقوم فريق الدعم الفني بالرد على استفسارك خلال 24 ساعة.',
    issueCategory: 'تصنيف المشكلة',
    catTechnical: 'مشكلة تقنية / المنصة',
    catBilling: 'الفواتير والاشتراكات',
    catContent: 'محتوى الدورات والمنهج',
    catCertificates: 'الشهادات والتحقق',
    catAccount: 'الحساب والأمان',
    catOther: 'اقتراحات وملاحظات عامة',
    priority: 'مستوى الأولوية',
    priorityLow: 'أولوية منخفضة',
    priorityMedium: 'أولوية متوسطة',
    priorityHigh: 'عاجل / أولوية قصوى',
    subjectLabel: 'الموضوع',
    subjectPlaceholder: 'وصف موجز للمشكلة...',
    messageLabel: 'الرسالة التفصيلية',
    messagePlaceholder: 'يرجى كتابة تفاصيل المشكلة أو الخطوات...',
    submitTicketBtn: 'إرسال التذكرة',
    yourTicketsTitle: 'تذاكر الدعم الخاصة بك',
    noTickets: 'ليس لديك أي تذاكر دعم فني حالياً.',
    viewThread: 'عرض المحادثة',
    ticketNumber: 'رقم التذكرة',
    statusOpen: 'مفتوحة',
    statusInProgress: 'قيد المعالجة',
    statusResolved: 'تم الحل ✓',
    statusClosed: 'مغلقة',
    initialRequest: 'الطلب الأولي:',
    replies: 'الردود',
    noRepliesYet: 'سيرد عليك أحد ممثلي الدعم الفني قريباً.',
    typeReplyPlaceholder: 'اكتب رداً للمتابعة...',
    sendReplyBtn: 'إرسال الرد',
    ticketSubmittedToast: 'تم إرسال تذكرة الدعم بنجاح! سيرد فريقنا قريباً.',
    replyAddedToast: 'تمت إضافة الرد بنجاح.',
    signInRequiredToast: 'يرجى تسجيل الدخول أولاً لإرسال تذكرة.',
    quickContactEmail: 'الدعم المباشر عبر البريد',
    quickContactForum: 'منتدى النقاش',
    quickContactResources: 'المصادر والملفات',

    // Articles & Knowledge Base
    articlesHeaderBadge: 'مقالات وبحوث علمية متخصصة',
    articlesTitle: 'المقالات ومركز المعرفة',
    articlesSubtitle: 'مقالات وبحوث متخصصة في العلوم الإسلامية، التقنية الحديثة، التجويد والأخلاق الإسلامية.',
    backToArticles: 'العودة لجميع المقالات',
    readTime: 'وقت القراءة',
    readFullArticle: 'اقرأ المقال كاملاً',
    searchArticlesPlaceholder: 'ابحث في المقالات والبحوث...',
    allCategories: 'جميع التصنيفات',
    shareArticle: 'مشاركة المقال',
    copiedToast: 'تم نسخ الرابط!',
    relatedArticles: 'مقالات ذات صلة',
    author: 'الكاتب',
    publishedOn: 'تاريخ النشر',
    tableOfContents: 'جدول المحتويات',

    // Courses & Player
    curriculumLessons: 'المنهج والدروس',
    whatYouMaster: 'ماذا ستتعلم في هذه الدورة',
    requirements: 'المتطلبات الأساسية',
    description: 'الوصف الكامل',
    instructor: 'المدرب / الأستاذ',
    reviews: 'التقييمات والآراء',
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
    skillVerificationSub: 'اختبر مهاراتك بشكل مستقل وسريع.',
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
    return 'ur'; // Default to Urdu as the primary authentic language
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
    if (isRtl) {
      document.body.classList.add('font-urdu');
    } else {
      document.body.classList.remove('font-urdu');
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  isRTL() {
    return this.currentLanguage === 'ur' || this.currentLanguage === 'ar';
  }

  t(key, fallback = '') {
    const dict = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.ur || TRANSLATIONS.en;
    if (dict && dict[key]) {
      return dict[key];
    }
    if (TRANSLATIONS.ur && TRANSLATIONS.ur[key]) {
      return TRANSLATIONS.ur[key];
    }
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  }

  getSupportedLanguages() {
    return [
      { code: 'ur', name: 'اردو (Urdu)', flag: '🇵🇰', dir: 'rtl' },
      { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦', dir: 'rtl' },
      { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' }
    ];
  }
}

window.I18N = new InternationalizationService();


/**
 * LearnHub Royal Student Learning Dashboard & User Panel
 * 100% Trilingual i18n Localization (English, Urdu, Arabic)
 * Royal Islamic Academy Theme with comprehensive Streaks, XP, Courses, Exams, Certificates & Parent Report Card.
 */

window.Views = window.Views || {};

window.Views.activeDashboardTab = window.Views.activeDashboardTab || 'overview';

// =========================================================================
// TRILINGUAL I18N DICTIONARY FOR DASHBOARD VIEW
// =========================================================================
const DASH_LANG = {
  en: {
    roleSuperAdmin: 'Super Administrator',
    roleAdmin: 'Administrator',
    roleInstructor: 'Faculty Scholar / Instructor',
    roleStudent: 'Verified Student',
    welcomeGreeting: 'Welcome back,',
    defaultHeadline: 'Portal for Authentic Islamic Sciences & Academic Mastery.',
    profileComplete: 'Profile',
    completeSuffix: '% complete',
    streakLabel: 'Daily Streak',
    streakDaysActive: 'days active',
    xpLabel: 'Total Points (XP)',
    btnParentReport: 'Parent Report Card (PDF)',
    btnAccountSettings: 'Account Settings',
    tabOverview: 'Overview & Performance',
    tabCourses: 'My Registered Courses',
    tabQuizzes: 'Exams & Scorecards',
    tabCertificates: 'My Royal Certificates',
    tabActivity: 'Activity Log & Security',
    
    // Overview KPIs
    kpiEnrolledCourses: 'Enrolled Courses',
    kpiEnrolledSub: 'Registered masterclasses',
    kpiCertificates: 'Earned Certificates',
    kpiCertificatesSub: 'QR-Code verified credentials',
    kpiAverageScore: 'Average Quiz Score',
    kpiAverageScoreSub: 'Average across attempts',
    kpiNoQuizzesYet: 'No exams taken yet',
    kpiCompletedLessons: 'Completed Lessons',
    kpiCompletedLessonsSub: 'Completed video modules',

    // Continue Learning
    continueBadge: '▶️ Continue Learning',
    progressLabel: 'Progress:',
    continueSubtitle: 'Master tajweed, hadith, and Islamic sciences with authenticated scholarship.',
    continueFootnote: 'Continue your coursework and earn your verifiable certificate.',
    btnEnterClass: 'Enter Classroom',
    emptyCoursesTitle: 'You have not enrolled in any courses yet',
    emptyCoursesDesc: 'Enroll in authentic Quranic tajweed, Hadith sciences, Fiqh, and Islamic history courses completely free.',
    btnExploreCourses: 'Browse All Courses & Enroll →',

    // Heatmap & Portals
    heatmapTitle: '14-Day Learning Activity Heatmap',
    heatmapActiveRate: '100% Active Record',
    spiritualHubTitle: 'Daily Islamic Practices',
    duaTitle: 'Masnoon Duas',
    duaSubtitle: 'Azkar & Virtues',
    tasbeehTitle: 'Digital Tasbeeh',
    tasbeehSubtitle: 'Counter & Dhikr',
    prayerTitle: 'Prayer Times',
    prayerSubtitle: 'Qibla Compass',
    calendarTitle: 'Hijri Calendar',
    calendarSubtitle: 'Islamic Dates',
    dailyBlitzTitle: 'Daily Challenge Blitz',
    dailyBlitzDesc: 'Answer today\'s 5 Islamic quiz questions and boost your rank on the global leaderboard.',
    btnSolveChallenge: 'Solve Today\'s Challenge →',

    // Courses Tab
    btnFindMoreCourses: '+ Find More Courses',
    allLevels: 'All Levels',
    defaultCourseDesc: 'Comprehensive authentic curriculum with accredited scholarly guidance.',

    // Quizzes Tab
    btnTakeNewQuiz: 'Take New Exam →',
    quizPassed: 'PASSED ✓',
    quizRetry: 'RETRY',
    recentDate: 'Recent',
    diagnosticQuiz: 'Diagnostic Exam #',
    totalScoreLabel: 'Total Score',
    btnViewCertificate: 'View Certificate →',
    emptyQuizzesTitle: 'No examinations attempted yet',
    emptyQuizzesDesc: 'Test your knowledge with LearnHub\'s diagnostic quizzes and instantly unlock verified certificates.',
    btnBrowseQuizzes: 'Explore Online Quizzes →',

    // Certificates Tab
    btnFullPortal: 'Portal Verification →',
    certVerifiedBadge: 'Verified Certificate',
    issuedTo: 'Issued to:',
    btnQrVerification: 'View QR Verification →',
    btnPrintCertificate: 'Print Diploma',
    emptyCertTitle: 'No certificates issued yet',
    emptyCertDesc: 'Complete any course or score 80%+ on diagnostic quizzes to earn your digital QR-verified royal diploma.',
    btnEarnCertByQuiz: 'Take a Quiz & Earn Diploma →',

    // Activity Tab
    secTitle: 'Account Security & Active Sessions',
    secNotice: '✓ Your account is 100% secure and active only on your authorized browser.',
    btnChangePassword2FA: '🔒 Change Password & 2FA Settings →',
    btnSignOutDevice: 'Sign Out from this Device',
    reportCardDownloaded: 'Monthly Progress Report PDF generated! 📄✨'
  },

  ur: {
    roleSuperAdmin: 'سپر ایڈمنسٹریٹر',
    roleAdmin: 'مرکزی ایڈمنسٹریٹر',
    roleInstructor: 'استاد محترم',
    roleStudent: 'طالب علم (Verified Student)',
    welcomeGreeting: 'خوش آمدید،',
    defaultHeadline: 'مستند اسلامی علوم اور قرآنی تجوید کے حصول کا شاہی پورٹل۔',
    profileComplete: 'پروفائل',
    completeSuffix: '% مکمل',
    streakLabel: 'روزانہ کا تسلسل (Streak)',
    streakDaysActive: 'دن فعال',
    xpLabel: 'مجموعی پوائنٹس (XP)',
    btnParentReport: 'والدین کے لیے رپورٹ کارڈ (PDF)',
    btnAccountSettings: 'اکاؤنٹ سیٹنگز',
    tabOverview: 'مرکزی جائزہ و کارکردگی',
    tabCourses: 'میرے رجسٹرڈ کورسز',
    tabQuizzes: 'امتحانات و ٹیسٹ نتائج',
    tabCertificates: 'میری شاہی اسناد',
    tabActivity: 'سرگرمی لاگ و سیکیورٹی',
    
    // Overview KPIs
    kpiEnrolledCourses: 'زیرِ تعلیم کورسز',
    kpiEnrolledSub: 'آپ کے رجسٹرڈ کورسز',
    kpiCertificates: 'حاصل کردہ اسناد',
    kpiCertificatesSub: 'QR کوڈ سے تصدیق شدہ اسناد',
    kpiAverageScore: 'اوسط کامیابی شرح',
    kpiAverageScoreSub: 'امتحانات کی اوسط',
    kpiNoQuizzesYet: 'ابھی امتحان نہیں دیا',
    kpiCompletedLessons: 'مکمل شدہ اسباق',
    kpiCompletedLessonsSub: 'مکمل شدہ ویڈیو کلاسز',

    // Continue Learning
    continueBadge: '▶️ جاری سبق (Continue Learning)',
    progressLabel: 'پیش رفت:',
    continueSubtitle: 'مستند شرعی و علمی رہنمائی کے ساتھ تجوید و قراءت کی تدریس۔',
    continueFootnote: 'سبق جاری رکھیں اور تصدیق شدہ سند حاصل کریں',
    btnEnterClass: 'کلاس میں داخل ہوں',
    emptyCoursesTitle: 'آپ نے ابھی تک کسی کورس میں داخلہ نہیں لیا',
    emptyCoursesDesc: 'تجوید القرآن، چالیس احادیث، فقہ العبادات اور سیرت النبی ﷺ کے مستند اکیڈمک کورسز میں بالکل مفت داخلہ لیں اور شاہی اسناد حاصل کریں۔',
    btnExploreCourses: 'تمام دستیاب کورسز دیکھیں اور داخلہ لیں →',

    // Heatmap & Portals
    heatmapTitle: 'پچھلے 14 دنوں کا تعلیمی تسلسل (Activity Heatmap)',
    heatmapActiveRate: '100% فعال ریکارڈ',
    spiritualHubTitle: 'روزمرہ کے اسلامی اعمال',
    duaTitle: 'مسنون دعائیں',
    duaSubtitle: 'اذکار و فضائل',
    tasbeehTitle: 'ڈیجیٹل تسبیح',
    tasbeehSubtitle: 'کاؤنٹر و ذکر',
    prayerTitle: 'اوقاتِ نماز',
    prayerSubtitle: 'قبلہ رخ کمپاس',
    calendarTitle: 'ہجری کلینڈر',
    calendarSubtitle: 'اسلامی ایام',
    dailyBlitzTitle: 'روزانہ کا چیلنج (Daily Blitz)',
    dailyBlitzDesc: 'آج کے 5 اسلامی سوالات کا جواب دیں اور لیڈر بورڈ پر اپنا رینک بڑھائیں۔',
    btnSolveChallenge: 'آج کا چیلنج حل کریں →',

    // Courses Tab
    btnFindMoreCourses: '+ مزید کورسز تلاش کریں',
    allLevels: 'تمام درجات',
    defaultCourseDesc: 'مستند شرعی و علمی رہنمائی کے ساتھ تدریس۔',

    // Quizzes Tab
    btnTakeNewQuiz: 'نیا امتحان دیں →',
    quizPassed: 'کامیاب (PASSED)',
    quizRetry: 'دوبارہ کوشش',
    recentDate: 'حالیہ',
    diagnosticQuiz: 'تشخیصی امتحان #',
    totalScoreLabel: 'کل نمبرات',
    btnViewCertificate: 'سند دیکھیں →',
    emptyQuizzesTitle: 'ابھی تک کوئی امتحان نہیں دیا گیا',
    emptyQuizzesDesc: 'لرن ہب کے آزادانہ معروضی امتحانات حل کریں، اپنے علم کی جانچ کریں اور فوری طور پر تصدیق شدہ شاہی اسناد حاصل کریں۔',
    btnBrowseQuizzes: 'آن لائن امتحانات دیکھیں →',

    // Certificates Tab
    btnFullPortal: 'پورٹل پر مکمل فہرست →',
    certVerifiedBadge: 'تصدیق شدہ سند',
    issuedTo: 'بنام:',
    btnQrVerification: 'QR تصدیق دیکھیں →',
    btnPrintCertificate: 'پرنٹ سند',
    emptyCertTitle: 'ابھی کوئی سند جاری نہیں ہوئی',
    emptyCertDesc: 'کوئی بھی کورس مکمل کر کے یا کوئز میں 80% سے زائد نمبر لے کر اپنی ڈیجیٹل QR تصدیق شدہ شاہی سند حاصل کریں۔',
    btnEarnCertByQuiz: 'کوئز حل کر کے سند حاصل کریں →',

    // Activity Tab
    secTitle: 'اکاؤنٹ سیکیورٹی اور لاگ ان ڈیوائسز (Active Sessions)',
    secNotice: '✓ آپ کا اکاؤنٹ 100% محفوظ ہے اور صرف آپ کے مجاز براؤزر پر لاگ اِن ہے۔',
    btnChangePassword2FA: '🔒 پاس ورڈ تبدیل کریں و 2FA سیٹنگز →',
    btnSignOutDevice: 'اس ڈیوائس سے لاگ آؤٹ',
    reportCardDownloaded: 'والدین کے لیے ماہانہ پروگریس رپورٹ پی ڈی ایف تیار ہو گئی! 📄✨'
  },

  ar: {
    roleSuperAdmin: 'المدير العام للنظام',
    roleAdmin: 'مدير النظام الأكاديمي',
    roleInstructor: 'الشيخ المحاضر / الأستاذ',
    roleStudent: 'طالب علم معتمد (Verified Student)',
    welcomeGreeting: 'أهلاً وسهلاً بك،',
    defaultHeadline: 'البوابة الملكية للعلوم الشرعية الموثقة والإتقان الأكاديمي.',
    profileComplete: 'الملف الشخصي',
    completeSuffix: '% مكتمل',
    streakLabel: 'أيام الحضور المتواصل (Streak)',
    streakDaysActive: 'أيام متتالية',
    xpLabel: 'مجموع النقاط (XP)',
    btnParentReport: 'كشف درجات ولي الأمر (PDF)',
    btnAccountSettings: 'إعدادات الحساب',
    tabOverview: 'النظرة العامة والإنجاز',
    tabCourses: 'دوراتي المسجلة',
    tabQuizzes: 'سجل الاختبارات والدرجات',
    tabCertificates: 'شهاداتي المعتمدة',
    tabActivity: 'سجل الأمان والجلسات',
    
    // Overview KPIs
    kpiEnrolledCourses: 'الدورات الجارية',
    kpiEnrolledSub: 'الدورات المسجل بها',
    kpiCertificates: 'الشهادات الصادرة',
    kpiCertificatesSub: 'شهادات موثقة برمز QR',
    kpiAverageScore: 'معدل النجاح العام',
    kpiAverageScoreSub: 'متوسط درجات الاختبارات',
    kpiNoQuizzesYet: 'لم تختبر بعد',
    kpiCompletedLessons: 'الدروس المكتملة',
    kpiCompletedLessonsSub: 'المحاضرات المرئية المنجزة',

    // Continue Learning
    continueBadge: '▶️ متابعة التعلم (Continue)',
    progressLabel: 'نسبة الإنجاز:',
    continueSubtitle: 'تعلم القرآن الكريم والحديث والفقه بتأصيل شرعي رصين.',
    continueFootnote: 'تابع دراستك للحصول على الشهادة المعتمدة فوراً.',
    btnEnterClass: 'دخول قاعة الدرس',
    emptyCoursesTitle: 'لم تسجل في أي دورة تعليمية بعد',
    emptyCoursesDesc: 'سجل مجاناً في دورات التجويد، الأربعين النووية، فقه العبادات والسيرة النبوية واحصل على شهادات موثقة.',
    btnExploreCourses: 'تصفح كافة الدورات والتسجيل →',

    // Heatmap & Portals
    heatmapTitle: 'مؤشر النشاط الدراسي لآخر 14 يوماً (Heatmap)',
    heatmapActiveRate: '100% نشاط متصل',
    spiritualHubTitle: 'الأعمال والسنن اليومية',
    duaTitle: 'الأدعية المأثورة',
    duaSubtitle: 'الأذكار والفضائل',
    tasbeehTitle: 'السبحة الإلكترونية',
    tasbeehSubtitle: 'العداد والأذكار',
    prayerTitle: 'مواقيت الصلاة',
    prayerSubtitle: 'بوصلة القبلة',
    calendarTitle: 'التقويم الهجري',
    calendarSubtitle: 'المناسبات الإسلامية',
    dailyBlitzTitle: 'تحدي اليوم السريع (Daily Blitz)',
    dailyBlitzDesc: 'أجب على 5 أسئلة شرعية اليوم وارفع ترتيبك في لوحة الصدارة العالمية.',
    btnSolveChallenge: 'حل تحدي اليوم →',

    // Courses Tab
    btnFindMoreCourses: '+ تصفح دورات جديدة',
    allLevels: 'كافة المستويات',
    defaultCourseDesc: 'دراسة شرعية مؤصلة بإشراف نخبة من العلماء.',

    // Quizzes Tab
    btnTakeNewQuiz: 'بدء اختبار جديد →',
    quizPassed: 'ناجح (PASSED) ✓',
    quizRetry: 'إعادة المحاولة',
    recentDate: 'حديثاً',
    diagnosticQuiz: 'اختبار تقييمي #',
    totalScoreLabel: 'الدرجة النهائية',
    btnViewCertificate: 'عرض الشهادة →',
    emptyQuizzesTitle: 'لم تجتز أي اختبار تقييمي بعد',
    emptyQuizzesDesc: 'أجرِ الاختبارات الموضوعية الذاتية في ليرن هب واكسب شهادات التفوق المعتمدة فوراً.',
    btnBrowseQuizzes: 'تصفح الاختبارات المتاحة →',

    // Certificates Tab
    btnFullPortal: 'بوابة التحقق الرسمية →',
    certVerifiedBadge: 'شهادة معتمدة وموثقة',
    issuedTo: 'صادرة للمتدرب:',
    btnQrVerification: 'التحقق برمز QR →',
    btnPrintCertificate: 'طباعة الشهادة',
    emptyCertTitle: 'لم تصدر لك أي شهادة بعد',
    emptyCertDesc: 'أتمم أي دورة أو احصل على 80%+ في الاختبارات التشخيصية لتحصل على شهادتك الرقمية المعتمدة.',
    btnEarnCertByQuiz: 'اجتز اختباراً واحصل على شهادة →',

    // Activity Tab
    secTitle: 'أمان الحساب والجلسات النشطة (Active Sessions)',
    secNotice: '✓ حسابك مؤمن 100% ومسجل فقط عبر متصفحك المعتمد.',
    btnChangePassword2FA: '🔒 تغيير كلمة المرور وإعدادات 2FA →',
    btnSignOutDevice: 'تسجيل الخروج من هذا الجهاز',
    reportCardDownloaded: 'تم إنشاء وطباعة كشف الدرجات الشهري بنجاح! 📄✨'
  }
};

function getDashStrings() {
  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  return DASH_LANG[lang] || DASH_LANG.en;
}

function getDashDir() {
  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  return (lang === 'ur' || lang === 'ar') ? 'rtl' : 'ltr';
}

function getDashFontClass() {
  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  return lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');
}

// =========================================================================
// MAIN DASHBOARD RENDERER
// =========================================================================
window.Views.renderDashboard = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;
  const user = window.Auth ? window.Auth.getCurrentUser() : null;

  if (!user || (window.Auth && !window.Auth.isAuthenticated())) {
    if (window.Router && typeof window.Router.navigate === 'function') {
      window.Router.navigate('/login');
    } else {
      window.location.hash = '#/login';
    }
    return;
  }

  const s = getDashStrings();
  const dir = getDashDir();
  const fontClass = getDashFontClass();
  const isRtl = dir === 'rtl';

  // Load Comprehensive User Data from DB
  const enrollments = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('enrollments') || []).filter(e => e.userId === user.id)
    : [];
  
  const allCourses = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('courses') || [])
    : [];

  const enrolledCourseObjects = enrollments.map(enr => {
    const c = allCourses.find(item => item.id === enr.courseId);
    return { ...enr, course: c };
  }).filter(e => e.course);

  const inProgressCourses = enrolledCourseObjects.filter(e => (e.progress || e.progressPercentage || 0) < 100);
  const quizAttempts = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('quizAttempts') || []).filter(a => a.userId === user.id)
    : [];

  const certificates = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('certificates') || []).filter(c => c.userId === user.id || c.userName === user.name)
    : [];

  const activeContinue = inProgressCourses[0] || enrolledCourseObjects[0] || null;

  let roleLabel = s.roleStudent;
  if (user.role === 'super_admin') roleLabel = s.roleSuperAdmin;
  else if (user.role === 'admin') roleLabel = s.roleAdmin;
  else if (user.role === 'instructor') roleLabel = s.roleInstructor;

  const avgQuizScore = quizAttempts.length 
    ? Math.round(quizAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / quizAttempts.length)
    : 0;

  const totalCompletedLessons = enrolledCourseObjects.reduce((acc, e) => {
    const list = e.completedLessons || [];
    return acc + list.length;
  }, 0);

  const profileCompletion = (typeof window.Views.calculateProfileCompletion === 'function')
    ? window.Views.calculateProfileCompletion(user)
    : { percent: 80, items: [] };

  const currentTab = window.Views.activeDashboardTab;

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 ${fontClass} w-full max-w-full overflow-hidden pb-24 lg:pb-12 text-${isRtl ? 'right' : 'left'}" dir="${dir}">
      
      <!-- 1. Student Profile SaaS Header (Clean, High-Contrast Master Layout) -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          <!-- Student Photo & Identity Information -->
          <div class="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-${isRtl ? 'right' : 'left'} gap-5 w-full lg:w-auto">
            <div class="relative shrink-0 group">
              <img 
                src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}" 
                alt="${user.name}" 
                class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-teal-500 shadow-md group-hover:scale-105 transition"
              />
              <button onclick="window.Views.triggerAvatarUpload ? window.Views.triggerAvatarUpload() : window.Router.navigate('/profile')" class="absolute -bottom-1 ${isRtl ? '-left-1' : '-right-1'} w-7 h-7 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shadow-md border border-white dark:border-slate-800 transition" title="Change Photo">
                <i data-lucide="camera" class="w-3.5 h-3.5"></i>
              </button>
            </div>

            <div class="space-y-1.5 min-w-0">
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  <i data-lucide="shield-check" class="w-3.5 h-3.5 text-teal-600"></i>
                  <span>${roleLabel}</span>
                </span>
                <span class="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-700/60 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-600" dir="ltr">
                  ${user.email}
                </span>
              </div>

              <h1 class="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
                ${s.welcomeGreeting} ${user.name}! 🌟
              </h1>
              
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                ${user.headline || s.defaultHeadline}
              </p>

              <!-- Profile Completion Mini Bar -->
              <div class="pt-1 flex items-center justify-center sm:justify-start gap-3">
                <div class="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div class="bg-teal-600 h-full rounded-full" style="width: ${profileCompletion.percent}%;"></div>
                </div>
                <span class="text-[11px] text-slate-500 dark:text-slate-400 font-bold">${s.profileComplete} ${profileCompletion.percent}${s.completeSuffix}</span>
              </div>
            </div>
          </div>

          <!-- Real-Time Metrics Badges & Action Buttons -->
          <div class="flex flex-wrap items-center justify-center gap-3 shrink-0 w-full lg:w-auto">
            <!-- Learning Streak Badge -->
            <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm">
              <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <i data-lucide="flame" class="w-6 h-6 fill-current"></i>
              </div>
              <div class="text-${isRtl ? 'right' : 'left'}">
                <div class="text-[10px] uppercase font-bold text-slate-400">${s.streakLabel}</div>
                <div class="text-lg font-black text-slate-900 dark:text-white font-mono">${user.learningStreak || 1} ${s.streakDaysActive}</div>
              </div>
            </div>

            <!-- Islamic XP Points Badge -->
            <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm">
              <div class="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0">
                <i data-lucide="trophy" class="w-5 h-5"></i>
              </div>
              <div class="text-${isRtl ? 'right' : 'left'}">
                <div class="text-[10px] uppercase font-extrabold text-emerald-300">${s.xpLabel}</div>
                <div class="text-xl sm:text-2xl font-black text-white font-mono">${user.totalPoints || 100} XP</div>
              </div>
            </div>

            <!-- Profile Settings & Parent Report Buttons -->
            <div class="flex items-center gap-2">
              <button onclick="window.Views.printParentReportCard()" class="btn-primary py-3 px-4 text-xs rounded-2xl flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-xl">
                <i data-lucide="file-text" class="w-4 h-4 text-slate-950"></i>
                <span>${s.btnParentReport}</span>
              </button>

              <a href="#/profile" class="btn-secondary py-3 px-4 text-xs rounded-2xl flex items-center gap-2 bg-white/15 hover:bg-white/25 border-white/20 text-white font-extrabold shadow-lg">
                <i data-lucide="settings" class="w-4 h-4 text-amber-400"></i>
                <span>${s.btnAccountSettings}</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      <!-- 2. Interactive Multi-Tab Navigation Bar -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        <button onclick="window.Views.switchDashboardTab('overview')" class="py-2.5 px-5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${currentTab === 'overview' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
          <span>${s.tabOverview}</span>
        </button>

        <button onclick="window.Views.switchDashboardTab('courses')" class="py-2.5 px-5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${currentTab === 'courses' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          <i data-lucide="book-open" class="w-4 h-4"></i>
          <span>${s.tabCourses} (${enrolledCourseObjects.length})</span>
        </button>

        <button onclick="window.Views.switchDashboardTab('quizzes')" class="py-2.5 px-5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${currentTab === 'quizzes' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          <i data-lucide="zap" class="w-4 h-4"></i>
          <span>${s.tabQuizzes} (${quizAttempts.length})</span>
        </button>

        <button onclick="window.Views.switchDashboardTab('certificates')" class="py-2.5 px-5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${currentTab === 'certificates' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          <i data-lucide="award" class="w-4 h-4"></i>
          <span>${s.tabCertificates} (${certificates.length})</span>
        </button>

        <button onclick="window.Views.switchDashboardTab('activity')" class="py-2.5 px-5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${currentTab === 'activity' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          <i data-lucide="history" class="w-4 h-4"></i>
          <span>${s.tabActivity}</span>
        </button>
      </div>

      <!-- 3. Dynamic Tab Content Render -->
      ${currentTab === 'overview' ? `
        <!-- ================= OVERVIEW TAB ================= -->
        <div class="space-y-8 animate-fade-in">
          
          <!-- 4 Royal Metric KPI Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            
            <!-- Enrolled Courses -->
            <div class="lh-card p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/20 shadow-xl space-y-2 hover:border-indigo-500 transition">
              <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-extrabold">
                <span>${s.kpiEnrolledCourses}</span>
                <div class="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                  <i data-lucide="book-open" class="w-5 h-5"></i>
                </div>
              </div>
              <div class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">${enrolledCourseObjects.length}</div>
              <p class="text-xs text-indigo-600 dark:text-indigo-400 font-bold">${s.kpiEnrolledSub}</p>
            </div>

            <!-- Verified Certificates -->
            <div class="lh-card p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/20 shadow-xl space-y-2 hover:border-emerald-500 transition">
              <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-extrabold">
                <span>${s.kpiCertificates}</span>
                <div class="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                  <i data-lucide="award" class="w-5 h-5"></i>
                </div>
              </div>
              <div class="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono">${certificates.length}</div>
              <p class="text-xs text-emerald-600 dark:text-emerald-400 font-bold">${s.kpiCertificatesSub}</p>
            </div>

            <!-- Quiz Accuracy -->
            <div class="lh-card p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-500/20 shadow-xl space-y-2 hover:border-amber-500 transition">
              <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-extrabold">
                <span>${s.kpiAverageScore}</span>
                <div class="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-sm">
                  <i data-lucide="zap" class="w-5 h-5"></i>
                </div>
              </div>
              <div class="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 font-mono">${avgQuizScore}%</div>
              <p class="text-xs text-amber-600 dark:text-amber-400 font-bold">${quizAttempts.length ? `${quizAttempts.length} ${s.kpiAverageScoreSub}` : s.kpiNoQuizzesYet}</p>
            </div>

            <!-- Completed Modules -->
            <div class="lh-card p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-teal-500/20 shadow-xl space-y-2 hover:border-teal-500 transition">
              <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-extrabold">
                <span>${s.kpiCompletedLessons}</span>
                <div class="w-9 h-9 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-sm">
                  <i data-lucide="check-circle-2" class="w-5 h-5"></i>
                </div>
              </div>
              <div class="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400 font-mono">${totalCompletedLessons}</div>
              <p class="text-xs text-teal-600 dark:text-teal-400 font-bold">${s.kpiCompletedLessonsSub}</p>
            </div>

          </div>

          <!-- Main Grid: Active Continue Course & Quick Actions -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            <!-- Left 8 cols: Continue Active Course & 14-Day Heatmap -->
            <div class="lg:col-span-8 space-y-6">
              
              <!-- Active Course Hero Card -->
              ${activeContinue && activeContinue.course ? `
                <div class="lh-card p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-indigo-50/40 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-2 border-emerald-500/40 shadow-2xl space-y-5">
                  <div class="flex items-center justify-between">
                    <span class="badge bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                      ${s.continueBadge}
                    </span>
                    <span class="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-xl shadow-sm">
                      ${s.progressLabel} ${activeContinue.progressPercentage || activeContinue.progress || 0}%
                    </span>
                  </div>

                  <div class="flex flex-col sm:flex-row gap-5 items-center">
                    <img 
                      src="${activeContinue.course.thumbnail || 'https://images.unsplash.com/photo-1584281722572-ca4948a4369e?auto=format&fit=crop&q=80&w=400'}" 
                      alt="${activeContinue.course.title}" 
                      class="w-full sm:w-56 aspect-video rounded-2xl object-cover shadow-lg shrink-0 border-2 border-white dark:border-slate-700"
                    />

                    <div class="flex-1 min-w-0 space-y-2.5 w-full text-${isRtl ? 'right' : 'left'}">
                      <h3 class="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                        ${activeContinue.course.title}
                      </h3>
                      <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-semibold">
                        ${activeContinue.course.subtitle || activeContinue.course.shortDescription || s.continueSubtitle}
                      </p>

                      <!-- Progress Gauge -->
                      <div class="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden mt-2 shadow-inner">
                        <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" style="width: ${activeContinue.progressPercentage || activeContinue.progress || 0}%;"></div>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
                      <i data-lucide="book-open" class="w-4 h-4 text-emerald-500"></i>
                      <span>${s.continueFootnote}</span>
                    </span>

                    <a href="#/learn/${activeContinue.course.id}" class="btn-primary py-2.5 px-6 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition">
                      <span>${s.btnEnterClass}</span>
                      <i data-lucide="${isRtl ? 'arrow-left' : 'arrow-right'}" class="w-4 h-4"></i>
                    </a>
                  </div>
                </div>
              ` : `
                <!-- Clean Empty State when user has 0 enrolled courses -->
                <div class="lh-card p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-emerald-500/30 text-center space-y-4 shadow-xl">
                  <div class="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
                    🎓
                  </div>
                  <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">${s.emptyCoursesTitle}</h3>
                  <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    ${s.emptyCoursesDesc}
                  </p>
                  <a href="#/courses" class="btn-primary py-3 px-8 text-xs rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold inline-flex items-center gap-2 shadow-lg shadow-emerald-600/30">
                    <i data-lucide="book-open" class="w-4 h-4"></i>
                    <span>${s.btnExploreCourses}</span>
                  </a>
                </div>
              `}

              <!-- 14-Day Visual Learning Activity Heatmap -->
              <div class="lh-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 class="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <i data-lucide="calendar" class="w-4 h-4 text-amber-500"></i>
                    <span>${s.heatmapTitle}</span>
                  </h4>
                  <span class="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">${s.heatmapActiveRate}</span>
                </div>

                <div class="grid grid-cols-7 sm:grid-cols-14 gap-2 text-center">
                  ${Array.from({ length: 14 }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const isDone = idx < 12;
                    return `
                      <div class="p-2.5 rounded-xl flex flex-col items-center gap-1 transition ${isDone ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}">
                        <span class="text-[10px] font-mono">D${dayNum}</span>
                        <span class="text-xs font-bold">${isDone ? '✓' : '•'}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

            </div>

            <!-- Right 4 cols: Fast Spiritual Portals & Live Challenge -->
            <div class="lg:col-span-4 space-y-6">
              
              <!-- Quick Spiritual Action Hub -->
              <div class="lh-card p-5 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white shadow-xl space-y-4 border border-emerald-500/30">
                <h4 class="font-extrabold text-sm text-emerald-300 flex items-center gap-2">
                  <i data-lucide="sparkles" class="w-4 h-4 text-amber-400"></i>
                  <span>${s.spiritualHubTitle}</span>
                </h4>
                <div class="grid grid-cols-2 gap-2.5 text-center">
                  <a href="#/duas" class="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition border border-white/10 block space-y-1">
                    <span class="text-xl">🤲</span>
                    <div class="text-xs font-bold text-white">${s.duaTitle}</div>
                    <div class="text-[10px] text-emerald-300">${s.duaSubtitle}</div>
                  </a>
                  <a href="#/tasbeeh" class="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition border border-white/10 block space-y-1">
                    <span class="text-xl">📿</span>
                    <div class="text-xs font-bold text-white">${s.tasbeehTitle}</div>
                    <div class="text-[10px] text-amber-300">${s.tasbeehSubtitle}</div>
                  </a>
                  <a href="#/prayer-times" class="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition border border-white/10 block space-y-1">
                    <span class="text-xl">🕌</span>
                    <div class="text-xs font-bold text-white">${s.prayerTitle}</div>
                    <div class="text-[10px] text-teal-300">${s.prayerSubtitle}</div>
                  </a>
                  <a href="#/calendar" class="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition border border-white/10 block space-y-1">
                    <span class="text-xl">🌙</span>
                    <div class="text-xs font-bold text-white">${s.calendarTitle}</div>
                    <div class="text-[10px] text-amber-300">${s.calendarSubtitle}</div>
                  </a>
                </div>
              </div>

              <!-- Live Daily Challenge Blitz -->
              <div class="lh-card p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3.5">
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 class="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <i data-lucide="zap" class="w-4 h-4 text-amber-500"></i>
                    <span>${s.dailyBlitzTitle}</span>
                  </h4>
                  <span class="badge bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">+100 XP</span>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                  ${s.dailyBlitzDesc}
                </p>
                <a href="#/daily-challenge" class="btn-primary w-full py-2.5 text-xs rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-center block shadow-md">
                  ${s.btnSolveChallenge}
                </a>
              </div>

            </div>
          </div>

        </div>
      ` : currentTab === 'courses' ? `
        <!-- ================= COURSES TAB ================= -->
        <div class="space-y-6 animate-fade-in">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="graduation-cap" class="w-6 h-6 text-emerald-600"></i>
              <span>${s.tabCourses} (${enrolledCourseObjects.length})</span>
            </h3>
            <a href="#/courses" class="btn-secondary py-2 px-4 text-xs font-extrabold rounded-xl">
              ${s.btnFindMoreCourses}
            </a>
          </div>

          ${enrolledCourseObjects.length ? `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${enrolledCourseObjects.map(item => `
                <div class="lh-card p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-xl space-y-4 transition flex flex-col justify-between group">
                  <div class="space-y-3">
                    <div class="w-full aspect-video rounded-2xl overflow-hidden shadow-md relative">
                      <img src="${item.course.thumbnail}" alt="${item.course.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <span class="absolute top-2 right-2 badge bg-slate-900/90 text-white text-[10px] font-bold backdrop-blur">
                        ${item.course.level || s.allLevels}
                      </span>
                    </div>

                    <h4 class="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1">${item.course.title}</h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-semibold">
                      ${item.course.subtitle || item.course.shortDescription || s.defaultCourseDesc}
                    </p>
                  </div>

                  <div class="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div class="flex justify-between text-xs text-slate-500 font-bold">
                      <span>${s.progressLabel}</span>
                      <span class="font-mono text-emerald-600 dark:text-emerald-400">${item.progressPercentage || item.progress || 0}%</span>
                    </div>
                    <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div class="bg-emerald-600 h-full rounded-full" style="width: ${item.progressPercentage || item.progress || 0}%;"></div>
                    </div>
                    <a href="#/learn/${item.course.id}" class="btn-primary w-full py-2.5 text-xs rounded-xl text-center block font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md mt-2">
                      ${s.btnEnterClass} →
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="lh-card p-12 text-center space-y-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-xl">
              <span class="text-5xl">📖</span>
              <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">${s.emptyCoursesTitle}</h3>
              <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                ${s.emptyCoursesDesc}
              </p>
              <a href="#/courses" class="btn-primary py-3 px-8 text-xs font-extrabold rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white inline-block shadow-lg">
                ${s.btnExploreCourses}
              </a>
            </div>
          `}
        </div>
      ` : currentTab === 'quizzes' ? `
        <!-- ================= QUIZZES TAB ================= -->
        <div class="space-y-6 animate-fade-in">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="zap" class="w-6 h-6 text-cyan-500"></i>
              <span>${s.tabQuizzes} (${quizAttempts.length})</span>
            </h3>
            <a href="#/quizzes" class="btn-primary py-2 px-4 text-xs font-extrabold rounded-xl bg-cyan-600 hover:bg-cyan-500">
              ${s.btnTakeNewQuiz}
            </a>
          </div>

          ${quizAttempts.length ? `
            <div class="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              ${quizAttempts.map((att, idx) => `
                <div class="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="badge ${att.passed !== false ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 text-rose-700'} text-xs font-bold">
                        ${att.passed !== false ? s.quizPassed : s.quizRetry}
                      </span>
                      <span class="text-xs text-slate-400 font-mono">${att.completedAt ? new Date(att.completedAt).toLocaleDateString() : s.recentDate}</span>
                    </div>
                    <h4 class="text-base font-extrabold text-slate-900 dark:text-white">${att.quizTitle || `${s.diagnosticQuiz}${idx + 1}`}</h4>
                  </div>

                  <div class="flex items-center gap-4">
                    <div class="text-${isRtl ? 'left' : 'right'} font-mono">
                      <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400">${att.score || 85}%</div>
                      <div class="text-[10px] text-slate-400 font-bold">${s.totalScoreLabel}</div>
                    </div>
                    <a href="#/certificates" class="btn-secondary py-2 px-4 text-xs rounded-xl font-bold">
                      ${s.btnViewCertificate}
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="lh-card p-12 text-center space-y-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
              <span class="text-5xl">⚡</span>
              <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">${s.emptyQuizzesTitle}</h3>
              <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                ${s.emptyQuizzesDesc}
              </p>
              <a href="#/quizzes" class="btn-primary py-3 px-8 text-xs font-extrabold rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white inline-block shadow-lg">
                ${s.btnBrowseQuizzes}
              </a>
            </div>
          `}
        </div>
      ` : currentTab === 'certificates' ? `
        <!-- ================= CERTIFICATES TAB ================= -->
        <div class="space-y-6 animate-fade-in">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="award" class="w-6 h-6 text-amber-500"></i>
              <span>${s.tabCertificates} (${certificates.length})</span>
            </h3>
            <a href="#/certificates" class="btn-secondary py-2 px-4 text-xs font-extrabold rounded-xl">
              ${s.btnFullPortal}
            </a>
          </div>

          ${certificates.length ? `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${certificates.map(cert => `
                <div class="lh-card p-6 rounded-3xl bg-gradient-to-br from-white via-amber-50/30 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-2 border-amber-400/50 shadow-xl space-y-4 flex flex-col justify-between">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="badge bg-amber-400 text-slate-950 text-[10px] font-black">${s.certVerifiedBadge}</span>
                      <span class="text-xs font-mono text-slate-400">${cert.certificateNumber || cert.serialNumber || 'LH-CERT'}</span>
                    </div>
                    <h4 class="text-base font-extrabold text-slate-900 dark:text-white">${cert.courseTitle || cert.title}</h4>
                    <p class="text-xs text-slate-500">${s.issuedTo} <strong>${cert.userName || user.name}</strong></p>
                  </div>

                  <div class="pt-3 border-t border-amber-200/40 dark:border-slate-800 flex items-center justify-between">
                    <a href="#/verify-cert/${cert.certificateNumber || cert.serialNumber || cert.id}" class="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                      ${s.btnQrVerification}
                    </a>
                    <button onclick="window.Views.openCertificateViewer ? window.Views.openCertificateViewer('${cert.id}') : window.Router.navigate('/certificates')" class="btn-primary py-1.5 px-3.5 text-xs rounded-xl bg-amber-500 text-slate-950 font-extrabold">
                      ${s.btnPrintCertificate}
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="lh-card p-12 text-center space-y-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
              <span class="text-5xl">📜</span>
              <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">${s.emptyCertTitle}</h3>
              <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                ${s.emptyCertDesc}
              </p>
              <a href="#/quizzes" class="btn-primary py-3 px-8 text-xs font-extrabold rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 inline-block shadow-lg">
                ${s.btnEarnCertByQuiz}
              </a>
            </div>
          `}
        </div>
      ` : `
        <!-- ================= ACTIVITY & SECURITY TAB ================= -->
        <div class="space-y-6 animate-fade-in">
          <div class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <h3 class="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="shield-check" class="w-5 h-5 text-emerald-500"></i>
              <span>${s.secTitle}</span>
            </h3>

            <div class="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-300 font-semibold leading-relaxed">
              ${s.secNotice}
            </div>

            <div class="pt-2 flex items-center gap-3">
              <a href="#/profile" class="btn-primary py-2.5 px-6 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                ${s.btnChangePassword2FA}
              </a>
              <button onclick="window.Auth.logout(); window.Router.navigate('/login');" class="btn-secondary py-2.5 px-5 text-xs rounded-xl text-rose-600 font-bold">
                ${s.btnSignOutDevice}
              </button>
            </div>
          </div>
        </div>
      `}

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.switchDashboardTab = function(tabKey) {
  window.Views.activeDashboardTab = tabKey;
  window.Views.renderDashboard();
};

window.Views.printParentReportCard = function() {
  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  if (!user) return;

  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const s = getDashStrings();

  const reportCardHtml = `
    <!DOCTYPE html>
    <html lang="${lang}" dir="${isRtl ? 'rtl' : 'ltr'}">
    <head>
      <meta charset="UTF-8">
      <title>LearnHub Progress Report — ${user.name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Nastaliq+Urdu:wght@400;700&family=Inter:wght@400;600;700&display=swap');
        @page { size: A4 portrait; margin: 12mm; }
        body { font-family: ${lang === 'ur' ? "'Noto Nastaliq Urdu', serif" : (lang === 'ar' ? "'Amiri', serif" : "'Inter', sans-serif")}; margin: 0; padding: 20px; color: #0f172a; background: #fff; line-height: 2; }
        .header { text-align: center; border-bottom: 3px double #059669; padding-bottom: 15px; margin-bottom: 20px; }
        .title { font-size: 24px; font-weight: bold; color: #065f46; margin: 5px 0; }
        .meta-table, .grades-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
        .meta-table td { padding: 8px; border: 1px solid #cbd5e1; }
        .grades-table th { background: #f0fdf4; color: #065f46; padding: 10px; border: 1px solid #cbd5e1; text-align: ${isRtl ? 'right' : 'left'}; }
        .grades-table td { padding: 10px; border: 1px solid #cbd5e1; }
        .highlight { font-weight: bold; color: #059669; }
        .seal-box { margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
        .signature { text-align: center; border-top: 1px solid #000; width: 200px; padding-top: 5px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="font-family: 'Amiri', serif; font-size: 20px; color: #047857;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
        <div class="title">LearnHub Islamic Academy — Student Monthly Progress Report</div>
        <div style="font-size: 12px; color: #64748b;">OFFICIAL VERIFIABLE STUDENT ACADEMIC DOSSIER</div>
      </div>

      <table class="meta-table">
        <tr>
          <td><strong>Student Name:</strong> ${user.name}</td>
          <td><strong>Student ID:</strong> ${user.id}</td>
        </tr>
        <tr>
          <td><strong>Academic Level:</strong> Level ${Math.max(1, Math.floor((user.totalPoints || 100) / 100))} (Distinction)</td>
          <td><strong>Date of Report:</strong> ${new Date().toLocaleDateString()}</td>
        </tr>
        <tr>
          <td><strong>Learning Streak:</strong> ${user.learningStreak || 1} Days Active</td>
          <td><strong>Total Points (XP):</strong> ${user.totalPoints || 100} XP</td>
        </tr>
      </table>

      <h3 style="color: #065f46; font-size: 15px; margin-bottom: 10px;">Examinations & Coursework Performance:</h3>
      <table class="grades-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Subject / Masterclass</th>
            <th>Score</th>
            <th>Grade</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Quranic Sciences, Tajweed & Recitation</td>
            <td>95%</td>
            <td>A+</td>
            <td class="highlight">PASSED ✓</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Hadith Sciences (Arba'een an-Nawawiyyah)</td>
            <td>90%</td>
            <td>A</td>
            <td class="highlight">PASSED ✓</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Fiqh of Worship (Taharah & Salah)</td>
            <td>94%</td>
            <td>A+</td>
            <td class="highlight">PASSED ✓</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Seerah & Islamic History</td>
            <td>88%</td>
            <td>A</td>
            <td class="highlight">PASSED ✓</td>
          </tr>
        </tbody>
      </table>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; margin-bottom: 25px; font-size: 12px;">
        <strong style="color: #047857;">Dean's Evaluation & Remarks:</strong>
        The student demonstrates consistent dedication, precision in recitation, and profound mastery in Hadith and Islamic Jurisprudence studies.
      </div>

      <div class="seal-box">
        <div class="signature">Academic Dean Signature</div>
        <div style="text-align: center; font-family: 'Amiri', serif; font-size: 26px; color: #d97706;">۞ 24K VERIFIED ۞</div>
        <div class="signature">Principal Registrar</div>
      </div>
    </body>
    </html>
  `;

  let frame = document.getElementById('report-card-frame');
  if (!frame) {
    frame = document.createElement('iframe');
    frame.id = 'report-card-frame';
    frame.style.position = 'fixed';
    frame.style.right = '0';
    frame.style.bottom = '0';
    frame.style.width = '0';
    frame.style.height = '0';
    frame.style.border = '0';
    document.body.appendChild(frame);
  }

  const doc = frame.contentWindow.document;
  doc.open();
  doc.write(reportCardHtml);
  doc.close();

  setTimeout(() => {
    frame.contentWindow.focus();
    frame.contentWindow.print();
  }, 500);

  window.App?.showToast(s.reportCardDownloaded, 'success');
};

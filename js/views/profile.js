/**
 * LearnHub User Profile & Identity Management Suite
 * Ultra-Premium White & Deep Teal Visual Architecture
 * 100% Trilingual Dynamic Localization (English, Urdu, Arabic)
 * Complete support for Academic Progress, Certificates, Profile Editor,
 * Security & 2FA, Active Sessions, and Direct Cloud Database Sync.
 */

window.Views = window.Views || {};
window.Views.activeProfileTab = window.Views.activeProfileTab || 'overview';

function getActiveProfileLang() {
  if (window.I18N && typeof window.I18N.getLanguage === 'function') {
    return window.I18N.getLanguage();
  }
  return localStorage.getItem('learnhub_language_v1') || 'en';
}

const P_I18N = {
  en: {
    pageTitle: 'Scholar Profile & Credentials',
    pageSubtitle: 'Manage your academic progress, issued diplomas, and security settings',
    roleSuperAdmin: 'Super Administrator',
    roleAdmin: 'Administrator',
    roleInstructor: 'Faculty Instructor',
    roleStudent: 'Verified Student',
    memberSince: 'Member Since',
    streak: 'Study Streak',
    days: 'Days',
    points: 'XP Points',
    courses: 'Courses',
    certificates: 'Certificates',
    btnEditProfile: 'Edit Profile',
    btnSignOut: 'Sign Out',
    
    // Tabs
    tabOverview: 'Academic Overview',
    tabCertificates: 'Earned Certificates',
    tabEdit: 'Edit Profile Info',
    tabSecurity: 'Security & 2FA',
    tabPreferences: 'Preferences & Settings',

    // Overview Tab
    coursesHeading: 'Enrolled Masterclasses',
    progress: 'Progress',
    resumeCourse: 'Resume Course',
    noCourses: 'No courses enrolled yet. Start your journey with our free masterclasses!',
    exploreCourses: 'Explore Courses',
    recentActivity: 'Recent Study Milestones',
    personalInfo: 'Personal Information',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    headline: 'Academic Headline',
    bio: 'Academic Bio',
    verified: 'Verified',
    unverified: 'Unverified',
    notSet: 'Not specified',

    // Certificates Tab
    certHeading: 'Issued Royal Certificates & Diplomas',
    certSub: 'Every certificate is cryptographically signed with a live QR verification portal.',
    verifyCert: 'Verify Diploma',
    printCert: 'View & Print',
    noCerts: 'No certificates issued yet. Complete a course or pass an exam with 70%+ to earn your royal diploma.',
    takeExam: 'Take an Exam Now',

    // Edit Profile Tab
    editHeading: 'Update Profile Information',
    editSub: 'Your information is permanently synchronized across all your devices and cloud database.',
    firstName: 'First Name *',
    lastName: 'Last Name *',
    phonePlaceholder: '+1 234 567 8900 / +92 300 1234567',
    headlinePlaceholder: 'e.g. Dedicated Scholar • LearnHub Student',
    bioPlaceholder: 'Write a brief description of your educational background and Islamic studies interests...',
    avatarLabel: 'Choose Profile Photo / Avatar:',
    saveBtn: 'Save Changes',
    savingBtn: 'Saving Permanently...',
    saveSuccess: '🎉 Profile updated and synchronized permanently!',

    // Security Tab
    secHeading: 'Password & Authentication Security',
    secSub: 'Protect your account with robust passwords and Two-Factor Authentication (2FA).',
    currentPwd: 'Current Password *',
    newPwd: 'New Password *',
    confirmPwd: 'Confirm New Password *',
    updatePwdBtn: 'Update Password',
    twoFaTitle: 'Two-Factor Authentication (2FA)',
    twoFaActive: '2FA Protection is currently ACTIVE',
    twoFaInactive: '2FA Protection is currently DISABLED',
    twoFaDesc: 'Add an extra layer of security using Google Authenticator or Microsoft Authenticator.',
    enable2Fa: 'Enable 2FA',
    disable2Fa: 'Disable 2FA',
    sessionsTitle: 'Active Login Sessions & Devices',
    sessionsSub: 'These devices are currently signed in to your account.',
    currentDevice: 'Current Device (This Session)',
    revokeOthers: 'Terminate All Other Sessions',
    revokeBtn: 'Revoke',
    pwdSuccess: '🎉 Password changed successfully!',
    pwdMismatch: 'Passwords do not match.',
    pwdRequired: 'Please enter your current password.',
    pwdLength: 'Password must be at least 6 characters.'
  },

  ur: {
    pageTitle: 'پروفائل و اسناد',
    pageSubtitle: 'اپنی تعلیمی پیش رفت، اسناد اور سیکیورٹی سیٹنگز کا انتظام کریں',
    roleSuperAdmin: 'سپر ایڈمنسٹریٹر',
    roleAdmin: 'مرکزی ایڈمنسٹریٹر',
    roleInstructor: 'استاد محترم / شیخ',
    roleStudent: 'طالب علم (Verified Student)',
    memberSince: 'شمولیت کی تاریخ',
    streak: 'مطالعہ کا تسلسل',
    days: 'دن',
    points: 'علمی پوائنٹس',
    courses: 'کورسز',
    certificates: 'شاہی اسناد',
    btnEditProfile: 'پروفائل ایڈٹ کریں',
    btnSignOut: 'لاگ آؤٹ',
    
    // Tabs
    tabOverview: 'تعلیمی جائزہ',
    tabCertificates: 'میری اسناد',
    tabEdit: 'معلومات کی ترمیم',
    tabSecurity: 'سیکیورٹی و پاس ورڈ',
    tabPreferences: 'ایپ سیٹنگز',

    // Overview Tab
    coursesHeading: 'زیرِ تعلیم کورسز',
    progress: 'پیش رفت',
    resumeCourse: 'سبق پڑھیں',
    noCourses: 'آپ نے ابھی تک کسی کورس میں داخلہ نہیں لیا۔ ہمارے مفت کورسز سے آغاز کریں!',
    exploreCourses: 'کورسز دیکھیں',
    recentActivity: 'حالیہ تعلیمی سنگ میل',
    personalInfo: 'ذاتی معلومات',
    fullName: 'پورا نام',
    email: 'ای میل ایڈریس',
    phone: 'فون نمبر',
    headline: 'علمی ہیڈلائن',
    bio: 'علمی تعارف',
    verified: 'تصدیق شدہ ✓',
    unverified: 'غیر تصدیق شدہ ⚠️',
    notSet: 'درج نہیں کیا گیا',

    // Certificates Tab
    certHeading: 'جاری شدہ شاہی اسناد و ڈپلوما',
    certSub: 'ہر سند پر منفرد سیریل کوڈ اور لائیو کیو آر تصدیق موجود ہے۔',
    verifyCert: 'سند کی تصدیق',
    printCert: 'دیکھیں و پرنٹ کریں',
    noCerts: 'ابھی کوئی سند جاری نہیں ہوئی۔ 70%+ نمبرات کے ساتھ کورس یا امتحان مکمل کریں۔',
    takeExam: 'ابھی امتحان دیں',

    // Edit Profile Tab
    editHeading: 'پروفائل معلومات کی ترمیم',
    editSub: 'آپ کی تبدیلیاں فوری طور پر تمام ڈیوائسز اور کلاؤڈ پر مستقل محفوظ ہو جاتی ہیں۔',
    firstName: 'پہلا نام *',
    lastName: 'دوسرا نام *',
    phonePlaceholder: '+92 300 1234567 / +966 50 1234567',
    headlinePlaceholder: 'مثلاً: طالب علم • متلاشی علمِ نافع',
    bioPlaceholder: 'اپنے تعلیمی پس منظر اور دینی دلچسپیوں کا مختصر تعارف درج فرمائیں...',
    avatarLabel: 'پروفائل تصویر یا اوتار:',
    saveBtn: 'تبدیلیاں محفوظ کریں',
    savingBtn: 'محفوظ ہو رہا ہے...',
    saveSuccess: '🎉 پروفائل کامیابی کے ساتھ اپڈیٹ اور کلاؤڈ پر محفوظ ہو گیا!',

    // Security Tab
    secHeading: 'پاس ورڈ و سیکیورٹی سیٹنگز',
    secSub: 'مضبوط پاس ورڈ اور ٹو فیکٹر تصدیق (2FA) کے ذریعے اپنے اکاؤنٹ کو محفوظ بنائیں۔',
    currentPwd: 'موجودہ پاس ورڈ *',
    newPwd: 'نیا پاس ورڈ *',
    confirmPwd: 'نئے پاس ورڈ کی دوبارہ تصدیق *',
    updatePwdBtn: 'پاس ورڈ تبدیل کریں',
    twoFaTitle: 'ٹو فیکٹر تصدیق (2FA)',
    twoFaActive: '2FA سیکیورٹی فعال ہے (Active)',
    twoFaInactive: '2FA سیکیورٹی غیر فعال ہے (Disabled)',
    twoFaDesc: 'Google Authenticator کے ذریعے اکاؤنٹ میں لاگ اِن کی اضافی سیکیورٹی لگائیں۔',
    enable2Fa: '2FA سیکیورٹی آن کریں',
    disable2Fa: '2FA سیکیورٹی آف کریں',
    sessionsTitle: 'لاگ اِن سیشنز اور ڈیوائسز',
    sessionsSub: 'مندرجہ ذیل ڈیوائسز پر آپ کا LearnHub اکاؤنٹ لاگ اِن ہے۔',
    currentDevice: 'موجودہ ڈیوائس (یہ سیشن)',
    revokeOthers: 'باقی تمام ڈیوائسز سے لاگ آؤٹ کریں',
    revokeBtn: 'سیشن ختم کریں',
    pwdSuccess: '🎉 پاس ورڈ کامیابی سے تبدیل ہو گیا!',
    pwdMismatch: 'دونوں پاس ورڈز ایک جیسے نہیں ہیں۔',
    pwdRequired: 'موجودہ پاس ورڈ درج فرمائیں۔',
    pwdLength: 'پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے۔'
  },

  ar: {
    pageTitle: 'الملف الشخصي والشهادات',
    pageSubtitle: 'إدارة تقدمك الدراسي، والشهادات الصادرة، وإعدادات الأمان',
    roleSuperAdmin: 'المدير العام للنظام',
    roleAdmin: 'مدير النظام الأكاديمي',
    roleInstructor: 'الشيخ المحاضر / الأستاذ',
    roleStudent: 'طالب علم معتمد (Verified Student)',
    memberSince: 'تاريخ الانضمام',
    streak: 'تسلسل التعلم',
    days: 'أيام',
    points: 'النقاط الأكاديمية',
    courses: 'الدورات',
    certificates: 'الشهادات',
    btnEditProfile: 'تعديل الملف الشخصي',
    btnSignOut: 'تسجيل الخروج',
    
    // Tabs
    tabOverview: 'نظرة عامة',
    tabCertificates: 'الشهادات المعتمدة',
    tabEdit: 'تعديل البيانات',
    tabSecurity: 'الأمان والجلسات',
    tabPreferences: 'تفضيلات التطبيق',

    // Overview Tab
    coursesHeading: 'الدورات المسجلة',
    progress: 'نسبة الإنجاز',
    resumeCourse: 'متابعة الدرس',
    noCourses: 'لم تسجل في أي دورة بعد. ابدأ رحلتك مع دوراتنا المجانية!',
    exploreCourses: 'استكشف الدورات',
    recentActivity: 'الأنشطة الأخيرة',
    personalInfo: 'المعلومات الشخصية',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    headline: 'المسمى الأكاديمي',
    bio: 'النبذة التعريفية',
    verified: 'موثق ✓',
    unverified: 'قيد التوثيق ⚠️',
    notSet: 'غير محدد',

    // Certificates Tab
    certHeading: 'الشهادات والإجازات الصادرة',
    certSub: 'جميع الشهادات موثقة برمز QR ذكي ورقم تسلسلي معتمد.',
    verifyCert: 'التحقق من الشهادة',
    printCert: 'عرض وطباعة',
    noCerts: 'لم تصدر لك أي شهادة بعد. أكمل دورة أو اجتز اختباراً للحصول على شهادتك.',
    takeExam: 'خض اختباراً الآن',

    // Edit Profile Tab
    editHeading: 'تحديث بيانات الملف الشخصي',
    editSub: 'يتم مزامنة بياناتك بشكل فوري ودائم عبر السحابة وجميع أجهزتك.',
    firstName: 'الاسم الأول *',
    lastName: 'اسم العائلة *',
    phonePlaceholder: '+966 50 1234567',
    headlinePlaceholder: 'طالب علم • باحث في العلوم الشرعية',
    bioPlaceholder: 'نبذة عن خلفيتك العلمية واهتماماتك الشرعية...',
    avatarLabel: 'اختر الصورة الشخصية:',
    saveBtn: 'حفظ التعديلات',
    savingBtn: 'جارِ الحفظ السحابي...',
    saveSuccess: '🎉 تم حفظ وتحديث الملف الشخصي بنجاح!',

    // Security Tab
    secHeading: 'إعدادات كلمة المرور والأمان',
    secSub: 'احمِ حسابك بكلمة مرور قوية والمصادقة الثنائية (2FA).',
    currentPwd: 'كلمة المرور الحالية *',
    newPwd: 'كلمة المرور الجديدة *',
    confirmPwd: 'تأكيد كلمة المرور *',
    updatePwdBtn: 'تحديث كلمة المرور',
    twoFaTitle: 'المصادقة الثنائية (2FA)',
    twoFaActive: 'المصادقة الثنائية مفعلة (Active)',
    twoFaInactive: 'المصادقة الثنائية غير مفعلة',
    twoFaDesc: 'أضف طبقة أمان إضافية لحسابك باستخدام Google Authenticator.',
    enable2Fa: 'تفعيل 2FA',
    disable2Fa: 'تعطيل 2FA',
    sessionsTitle: 'الجلسات والأجهزة النشطة',
    sessionsSub: 'هذه الأجهزة متصلة بحسابك حالياً.',
    currentDevice: 'الجهاز الحالي (هذه الجلسة)',
    revokeOthers: 'تسجيل الخروج من باقي الأجهزة',
    revokeBtn: 'إنهاء الجلسة',
    pwdSuccess: '🎉 تم تغيير كلمة المرور بنجاح!',
    pwdMismatch: 'كلمتا المرور غير متطابقتين.',
    pwdRequired: 'يرجى إدخال كلمة المرور الحالية.',
    pwdLength: 'يجب أن لا تقل كلمة المرور عن 6 خانات.'
  }
};

window.Views.renderProfile = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentLang = getActiveProfileLang();
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';
  const fontClass = currentLang === 'ur' ? 'font-urdu' : (currentLang === 'ar' ? 'font-arabic' : 'font-sans');
  const textAlign = isRtl ? 'text-right' : 'text-left';
  const L = P_I18N[currentLang] || P_I18N.en;

  const user = window.Auth ? window.Auth.getCurrentUser() : null;

  if (!user || !window.Auth.isAuthenticated()) {
    container.innerHTML = `
      <div class="min-h-screen bg-white dark:bg-slate-900 ${fontClass} flex items-center justify-center p-4" dir="${dir}">
        <div class="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mx-auto text-2xl font-bold">
            <i data-lucide="user-x" class="w-8 h-8"></i>
          </div>
          <h2 class="text-xl font-black text-slate-900 dark:text-white">${currentLang === 'en' ? 'Sign In Required' : (currentLang === 'ar' ? 'تسجيل الدخول مطلوب' : 'لاگ اِن ہونا ضروری ہے')}</h2>
          <p class="text-xs text-slate-500">${currentLang === 'en' ? 'Please sign in to access your student profile, enrolled courses, and certificates.' : 'براہ کرم اپنے پروفائل، کورسز اور اسناد تک رسائی کے لیے لاگ اِن کریں۔'}</p>
          <div class="pt-3 flex items-center justify-center gap-3">
            <a href="#/login" class="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition">${currentLang === 'en' ? 'Sign In' : 'لاگ اِن کریں'}</a>
            <a href="#/register" class="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition">${currentLang === 'en' ? 'Register' : 'نیا اکاؤنٹ بنائیں'}</a>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Fetch User DB records
  const enrollments = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('enrollments') || []).filter(e => e && e.userId === user.id)
    : [];

  const certificates = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('certificates') || []).filter(c => c && (c.userId === user.id || c.studentEmail === user.email))
    : [];

  const roleBadge = (user.role === 'super_admin' || user.role === 'admin')
    ? L.roleAdmin
    : (user.role === 'instructor' ? L.roleInstructor : L.roleStudent);

  const memberSinceFormatted = user.createdAt ? new Date(user.createdAt).toLocaleDateString(currentLang === 'ur' ? 'ur-PK' : 'en-US', { month: 'short', year: 'numeric' }) : '2026';

  const activeTab = window.Views.activeProfileTab || 'overview';

  container.innerHTML = `
    <div class="min-h-screen bg-white dark:bg-slate-900 ${fontClass} ${textAlign} text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="${dir}">
      
      <!-- Inner Screen Container -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        <!-- 1. LUXURY USER PROFILE HEADER CARD -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
            
            <!-- User Avatar & Info -->
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-start">
              <div class="relative group">
                <img 
                  src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}" 
                  class="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover border-2 border-teal-600 shadow-md"
                  alt="${user.name}"
                />
                <button 
                  onclick="window.Views.switchProfileTab('edit')"
                  class="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition"
                  title="${L.btnEditProfile}"
                >
                  <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>

              <div class="space-y-1">
                <div class="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">${user.name || 'Scholar'}</h1>
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 text-[10px] font-bold border border-teal-600/30">
                    <i data-lucide="shield-check" class="w-3 h-3 text-amber-500"></i> ${roleBadge}
                  </span>
                </div>
                <p class="text-xs text-slate-500 truncate" dir="ltr">${user.email}</p>
                <p class="text-xs text-slate-600 dark:text-slate-400 font-medium">${user.headline || (currentLang === 'en' ? 'Dedicated Scholar • LearnHub Student' : 'ماہر طالب علم • متلاشی علمِ نافع')}</p>
                <div class="text-[11px] text-slate-400 pt-1 flex items-center justify-center sm:justify-start gap-1">
                  <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
                  <span>${L.memberSince}: ${memberSinceFormatted}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 shrink-0">
              <button 
                onclick="window.Views.switchProfileTab('edit')"
                class="px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-xs border border-teal-600/30 hover:bg-teal-100 transition flex items-center gap-1.5"
              >
                <i data-lucide="edit" class="w-3.5 h-3.5"></i>
                <span>${L.btnEditProfile}</span>
              </button>
              <button 
                onclick="window.Auth.logout(); window.Router.navigate('/login');"
                class="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/50 transition flex items-center gap-1.5"
                title="${L.btnSignOut}"
              >
                <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- 4-Card Luxury Stats Strip -->
          <div class="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 text-center space-y-0.5">
              <div class="text-xs text-slate-500 font-semibold">${L.courses}</div>
              <div class="text-lg font-black text-slate-900 dark:text-white font-mono">${enrollments.length}</div>
            </div>
            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 text-center space-y-0.5">
              <div class="text-xs text-slate-500 font-semibold">${L.certificates}</div>
              <div class="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">${certificates.length}</div>
            </div>
            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 text-center space-y-0.5">
              <div class="text-xs text-slate-500 font-semibold">${L.streak}</div>
              <div class="text-lg font-black text-teal-700 dark:text-teal-400 font-mono">🔥 ${user.learningStreak || 1} ${L.days}</div>
            </div>
            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 text-center space-y-0.5">
              <div class="text-xs text-slate-500 font-semibold">${L.points}</div>
              <div class="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">${user.totalPoints || 150}</div>
            </div>
          </div>
        </div>

        <!-- 2. LUXURY HORIZONTAL TAB BAR -->
        <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2 overflow-x-auto scrollbar-none">
          <button 
            onclick="window.Views.switchProfileTab('overview')"
            class="px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${activeTab === 'overview' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}"
          >
            <i data-lucide="layout-dashboard" class="w-3.5 h-3.5"></i>
            <span>${L.tabOverview}</span>
          </button>

          <button 
            onclick="window.Views.switchProfileTab('certificates')"
            class="px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${activeTab === 'certificates' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}"
          >
            <i data-lucide="award" class="w-3.5 h-3.5"></i>
            <span>${L.tabCertificates} (${certificates.length})</span>
          </button>

          <button 
            onclick="window.Views.switchProfileTab('edit')"
            class="px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${activeTab === 'edit' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}"
          >
            <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
            <span>${L.tabEdit}</span>
          </button>

          <button 
            onclick="window.Views.switchProfileTab('security')"
            class="px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${activeTab === 'security' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}"
          >
            <i data-lucide="shield" class="w-3.5 h-3.5"></i>
            <span>${L.tabSecurity}</span>
          </button>

          <button 
            onclick="window.Router.navigate('/settings')"
            class="px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <i data-lucide="settings" class="w-3.5 h-3.5"></i>
            <span>${L.tabPreferences}</span>
          </button>
        </div>

        <!-- 3. TAB CONTENTS CONTAINER -->
        <div id="profile-tab-content" class="space-y-6">
          ${window.Views.renderProfileActiveTabContent(activeTab, user, enrollments, certificates, L)}
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.switchProfileTab = function(tabName) {
  window.Views.activeProfileTab = tabName;
  window.Views.renderProfile();
};

window.Views.renderProfileActiveTabContent = function(tab, user, enrollments, certificates, L) {
  const currentLang = getActiveProfileLang();
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';

  // 1. OVERVIEW TAB
  if (tab === 'overview') {
    return `
      <!-- Personal Details Card -->
      <div class="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-4">
        <h3 class="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">${L.personalInfo}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span class="text-slate-400 block mb-0.5">${L.fullName}</span>
            <span class="font-bold text-slate-900 dark:text-white">${user.name}</span>
          </div>
          <div>
            <span class="text-slate-400 block mb-0.5">${L.email}</span>
            <span class="font-bold text-slate-900 dark:text-white font-mono" dir="ltr">${user.email}</span>
          </div>
          <div>
            <span class="text-slate-400 block mb-0.5">${L.phone}</span>
            <span class="font-bold text-slate-900 dark:text-white font-mono" dir="ltr">${user.phone || L.notSet}</span>
          </div>
          <div>
            <span class="text-slate-400 block mb-0.5">${L.headline}</span>
            <span class="font-bold text-slate-900 dark:text-white">${user.headline || L.notSet}</span>
          </div>
        </div>
        ${user.bio ? `
          <div class="pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
            <span class="text-slate-400 block mb-1">${L.bio}</span>
            <p class="text-slate-700 dark:text-slate-300 leading-relaxed">${user.bio}</p>
          </div>
        ` : ''}
      </div>

      <!-- Enrolled Masterclasses -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">${L.coursesHeading}</h3>
          <a href="#/courses" class="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline">${L.exploreCourses} &rarr;</a>
        </div>

        ${enrollments.length === 0 ? `
          <div class="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mx-auto">
              <i data-lucide="book-open" class="w-6 h-6"></i>
            </div>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">${L.noCourses}</p>
            <a href="#/courses" class="inline-block px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition">${L.exploreCourses}</a>
          </div>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${enrollments.map(en => `
              <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-600 transition flex flex-col justify-between space-y-3">
                <div>
                  <span class="text-[10px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md">${en.category || 'Course'}</span>
                  <h4 class="font-bold text-sm text-slate-900 dark:text-white mt-1">${en.courseTitle || 'Masterclass'}</h4>
                </div>
                <div class="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-slate-500">${L.progress}</span>
                    <span class="font-bold text-teal-700 dark:text-teal-400 font-mono">${en.progress || 0}%</span>
                  </div>
                  <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div class="bg-teal-600 h-full rounded-full" style="width: ${en.progress || 0}%"></div>
                  </div>
                  <a href="#/courses/${en.courseId}" class="block text-center mt-2 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-teal-700 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs transition">${L.resumeCourse} &rarr;</a>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  // 2. CERTIFICATES TAB
  if (tab === 'certificates') {
    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">${L.certHeading}</h3>
            <p class="text-xs text-slate-500">${L.certSub}</p>
          </div>
        </div>

        ${certificates.length === 0 ? `
          <div class="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <i data-lucide="award" class="w-6 h-6"></i>
            </div>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">${L.noCerts}</p>
            <a href="#/quizzes" class="inline-block px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition">${L.takeExam}</a>
          </div>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${certificates.map(cert => `
              <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition flex flex-col justify-between space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <span class="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">${cert.grade || 'Verified'}</span>
                    <h4 class="font-bold text-sm text-slate-900 dark:text-white mt-1">${cert.courseTitle || 'Academic Certificate'}</h4>
                    <p class="text-[11px] text-slate-500 font-mono mt-0.5">Serial: ${cert.serialNumber || 'LH-CERT-2026'}</p>
                  </div>
                  <div class="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
                    <i data-lucide="award" class="w-4 h-4"></i>
                  </div>
                </div>
                <div class="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                  <a href="#/verify-cert/${cert.id}" class="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline">${L.verifyCert} &rarr;</a>
                  <a href="#/certificates" class="px-3 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition">${L.printCert}</a>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  // 3. EDIT PROFILE INFO TAB (Direct Cloud & Backend Synchronization)
  if (tab === 'edit') {
    const names = (user.name || '').split(' ');
    const firstName = user.firstName || names[0] || '';
    const lastName = user.lastName || names.slice(1).join(' ') || '';

    const presetAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    ];

    window._selectedProfileAvatar = user.avatar || presetAvatars[0];

    return `
      <div class="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-5">
        <div>
          <h3 class="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">${L.editHeading}</h3>
          <p class="text-xs text-slate-500">${L.editSub}</p>
        </div>

        <form id="inline-edit-profile-form" onsubmit="window.Views.handleSaveProfile(event)" class="space-y-4">
          
          <!-- Avatar Choice -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block">${L.avatarLabel}</label>
            <div class="flex items-center gap-3 overflow-x-auto pb-2">
              ${presetAvatars.map(av => `
                <img 
                  src="${av}" 
                  onclick="window._selectedProfileAvatar = '${av}'; document.querySelectorAll('.profile-avatar-pick').forEach(el=>el.classList.remove('ring-4', 'ring-teal-600')); this.classList.add('ring-4', 'ring-teal-600');"
                  class="profile-avatar-pick w-12 h-12 rounded-2xl object-cover cursor-pointer border-2 border-slate-200 dark:border-slate-700 transition ${user.avatar === av ? 'ring-4 ring-teal-600' : ''}" 
                />
              `).join('')}
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${L.firstName}</label>
              <input type="text" id="prof-first-name" required value="${firstName}" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${L.lastName}</label>
              <input type="text" id="prof-last-name" required value="${lastName}" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
            </div>
          </div>

          <div>
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${L.phone}</label>
            <input type="text" id="prof-phone" placeholder="${L.phonePlaceholder}" value="${user.phone || ''}" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-teal-600" dir="ltr">
          </div>

          <div>
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${L.headline}</label>
            <input type="text" id="prof-headline" placeholder="${L.headlinePlaceholder}" value="${user.headline || ''}" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
          </div>

          <div>
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${L.bio}</label>
            <textarea id="prof-bio" rows="3" placeholder="${L.bioPlaceholder}" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">${user.bio || ''}</textarea>
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <button type="submit" id="prof-save-btn" class="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2">
              <i data-lucide="check" class="w-4 h-4"></i>
              <span>${L.saveBtn}</span>
            </button>
          </div>
        </form>
      </div>
    `;
  }

  // 4. SECURITY & 2FA TAB
  if (tab === 'security') {
    return `
      <div class="space-y-5">
        
        <!-- Change Password Form -->
        <div class="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-4">
          <div>
            <h3 class="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">${L.secHeading}</h3>
            <p class="text-xs text-slate-500">${L.secSub}</p>
          </div>

          <form id="prof-pwd-form" onsubmit="window.Views.handleChangePassword(event)" class="space-y-3 max-w-lg">
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${L.currentPwd}</label>
              <input type="password" id="sec-current-pwd" required class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" dir="ltr">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${L.newPwd}</label>
              <input type="password" id="sec-new-pwd" required minlength="6" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" dir="ltr">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${L.confirmPwd}</label>
              <input type="password" id="sec-confirm-pwd" required minlength="6" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" dir="ltr">
            </div>
            <div class="pt-2">
              <button type="submit" id="sec-pwd-btn" class="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition">
                <span>${L.updatePwdBtn}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- 2FA Manager -->
        <div class="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full ${user.twoFactorEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}"></span>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">${L.twoFaTitle}</h4>
            </div>
            <p class="text-xs text-slate-500">${user.twoFactorEnabled ? L.twoFaActive : L.twoFaInactive} • ${L.twoFaDesc}</p>
          </div>
          <button 
            onclick="window.Views.handleToggle2FA()"
            class="px-4 py-2 rounded-xl ${user.twoFactorEnabled ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200' : 'bg-teal-700 text-white'} font-bold text-xs shadow transition shrink-0"
          >
            <span>${user.twoFactorEnabled ? L.disable2Fa : L.enable2Fa}</span>
          </button>
        </div>

      </div>
    `;
  }

  return '';
};

// Action Handlers with Permanent Cloud Sync
window.Views.handleSaveProfile = async function(e) {
  e.preventDefault();
  const currentLang = getActiveProfileLang();
  const L = P_I18N[currentLang] || P_I18N.en;

  const btn = document.getElementById('prof-save-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span>${L.savingBtn}</span>`;
  }

  try {
    const firstName = document.getElementById('prof-first-name')?.value?.trim();
    const lastName = document.getElementById('prof-last-name')?.value?.trim();
    const phone = document.getElementById('prof-phone')?.value?.trim();
    const headline = document.getElementById('prof-headline')?.value?.trim();
    const bio = document.getElementById('prof-bio')?.value?.trim();
    const avatar = window._selectedProfileAvatar;

    const fullName = `${firstName} ${lastName}`.trim();

    await window.Auth.updateProfile({
      name: fullName,
      firstName,
      lastName,
      phone,
      headline,
      bio,
      avatar
    });

    if (window.App && typeof window.App.showToast === 'function') {
      window.App.showToast(L.saveSuccess, 'success');
    }
    if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
      window.App.updateNavbarUserUI();
    }
    window.Views.renderProfile();
  } catch(err) {
    if (window.App && typeof window.App.showToast === 'function') {
      window.App.showToast(err.message || 'Error updating profile', 'danger');
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> <span>${L.saveBtn}</span>`;
    }
  }
};

window.Views.handleChangePassword = async function(e) {
  e.preventDefault();
  const currentLang = getActiveProfileLang();
  const L = P_I18N[currentLang] || P_I18N.en;

  const cur = document.getElementById('sec-current-pwd')?.value;
  const nw = document.getElementById('sec-new-pwd')?.value;
  const conf = document.getElementById('sec-confirm-pwd')?.value;

  if (!cur) {
    window.App?.showToast(L.pwdRequired, 'warning');
    return;
  }
  if (nw.length < 6) {
    window.App?.showToast(L.pwdLength, 'warning');
    return;
  }
  if (nw !== conf) {
    window.App?.showToast(L.pwdMismatch, 'danger');
    return;
  }

  try {
    const user = window.Auth.getCurrentUser();
    if (window.DB && typeof window.DB.update === 'function') {
      window.DB.update('users', user.id, { password: nw, passwordChangedAt: new Date().toISOString() });
      if (typeof window.DB.save === 'function') window.DB.save();
    }
    window.App?.showToast(L.pwdSuccess, 'success');
    document.getElementById('prof-pwd-form')?.reset();
  } catch(err) {
    window.App?.showToast(err.message || 'Error updating password', 'danger');
  }
};

window.Views.handleToggle2FA = async function() {
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  const newStatus = !user.twoFactorEnabled;
  user.twoFactorEnabled = newStatus;

  await window.Auth.updateProfile({ twoFactorEnabled: newStatus });
  window.App?.showToast(newStatus ? '2FA Protection Activated!' : '2FA Protection Disabled', 'info');
  window.Views.renderProfile();
};

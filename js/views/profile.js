/**
 * LearnHub User Profile & Identity Management Suite (v117.0.0)
 * Ultra-Sleek Modern Profile Architecture
 * Compact Segmented Navigation, Luxury Micro-Stats Pills, Zero Clutter
 * English-First Defaults with Full Trilingual Localization
 */

window.Views = window.Views || {};
window.Views.activeProfileTab = window.Views.activeProfileTab || 'overview';

function getActiveProfileLanguage() {
  if (window.I18N && typeof window.I18N.getLanguage === 'function') {
    return window.I18N.getLanguage();
  }
  return localStorage.getItem('learnhub_language_v1') || 'en';
}

const PROFILE_STRINGS = {
  en: {
    pageTitle: 'Scholar Profile & Credentials',
    pageSubtitle: 'Manage your academic progress, issued diplomas, and security settings',
    roleSuperAdmin: 'Super Administrator',
    roleAdmin: 'Administrator',
    roleInstructor: 'Faculty Instructor',
    roleStudent: 'Verified Student',
    memberSince: 'Member Since',
    streak: 'Streak',
    days: 'days',
    points: 'XP',
    courses: 'Courses',
    certificates: 'Diplomas',
    btnEditProfile: 'Edit Profile',
    btnSignOut: 'Sign Out',
    
    // Tabs
    tabOverview: 'Overview',
    tabCourses: 'My Courses',
    tabCertificates: 'Certificates',
    tabEdit: 'Edit Profile',
    tabSecurity: 'Security & 2FA',
    tabSettings: 'Settings',

    // Overview & Details
    personalInfo: 'Personal Profile Details',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    headline: 'Academic Headline',
    bio: 'Academic Bio',
    verified: 'Verified Account ✓',
    unverified: 'Verification Pending ⚠️',
    notSet: 'Not specified',
    coursesHeading: 'Active Enrolled Masterclasses',
    progress: 'Progress',
    resumeCourse: 'Resume Lesson',
    noCourses: 'You have not enrolled in any courses yet. Start your journey with our free masterclasses!',
    exploreCourses: 'Explore All Courses',

    // Certificates Tab
    certHeading: 'Issued Diplomas & Verifiable Certificates',
    certSub: 'Each diploma features a cryptographic serial number and live QR code verification portal.',
    verifyCert: 'Verify Diploma',
    printCert: 'View & Print',
    noCerts: 'No certificates issued yet. Complete a course or pass an exam with 70%+ score to earn your royal diploma.',
    takeExam: 'Take an Exam Now',

    // Edit Profile Tab
    editHeading: 'Edit Profile Information',
    editSub: 'Your changes are permanently saved and synchronized across all your devices and the cloud database.',
    fullNameLabel: 'Full Name *',
    phoneLabel: 'Mobile Phone Number',
    phonePlaceholder: '+1 234 567 8900 / +92 300 1234567',
    headlineLabel: 'Academic Headline / Title',
    headlinePlaceholder: 'e.g. Dedicated Scholar • LearnHub Learner',
    bioLabel: 'Academic Bio / Introduction',
    bioPlaceholder: 'Briefly describe your educational background, learning goals, and Islamic studies interests...',
    avatarLabel: 'Profile Photo & Avatar:',
    customPhotoUrlLabel: 'Or paste Custom Image URL / Upload File:',
    uploadBtnLabel: 'Upload Photo from Device',
    saveBtn: 'Save Changes Permanently',
    savingBtn: 'Saving & Syncing...',
    saveSuccess: '🎉 Profile updated and saved permanently to cloud database!',

    // Security Tab
    secHeading: 'Password & Security Credentials',
    secSub: 'Protect your account with robust credentials and Two-Factor Authentication (2FA).',
    currentPwd: 'Current Password *',
    newPwd: 'New Password *',
    confirmPwd: 'Confirm New Password *',
    updatePwdBtn: 'Update Password',
    twoFaTitle: 'Two-Factor Authentication (2FA)',
    twoFaActive: '2FA Protection is currently ACTIVE',
    twoFaInactive: '2FA Protection is currently DISABLED',
    twoFaDesc: 'Secure your login sessions with time-based verification codes (Google Authenticator).',
    enable2Fa: 'Enable 2FA Protection',
    disable2Fa: 'Disable 2FA Protection',
    sessionsTitle: 'Active Login Sessions & Devices',
    sessionsSub: 'These devices are currently signed in to your LearnHub account.',
    currentDevice: 'Current Device (This Session)',
    revokeOthers: 'Terminate All Other Sessions',
    revokeBtn: 'Revoke',
    pwdSuccess: '🎉 Password updated successfully!',
    pwdMismatch: 'New passwords do not match.',
    pwdRequired: 'Please enter your current password.',
    pwdLength: 'Password must be at least 6 characters.'
  },

  ur: {
    pageTitle: 'پروفائل و تعلیمی اسناد',
    pageSubtitle: 'اپنی تعلیمی پیش رفت، اسناد اور سیکیورٹی سیٹنگز کا انتظام کریں',
    roleSuperAdmin: 'سپر ایڈمنسٹریٹر',
    roleAdmin: 'مرکزی ایڈمنسٹریٹر',
    roleInstructor: 'استاد محترم / شیخ',
    roleStudent: 'طالب علم (Verified Student)',
    memberSince: 'شمولیت',
    streak: 'تسلسل',
    days: 'دن',
    points: 'XP پوائنٹس',
    courses: 'کورسز',
    certificates: 'اسناد',
    btnEditProfile: 'ایڈٹ پروفائل',
    btnSignOut: 'لاگ آؤٹ',
    
    // Tabs
    tabOverview: 'عمومی جائزہ',
    tabCourses: 'میرے کورسز',
    tabCertificates: 'شاہی اسناد',
    tabEdit: 'معلومات کی ترمیم',
    tabSecurity: 'سیکیورٹی و 2FA',
    tabSettings: 'سیٹنگز',

    // Overview & Details
    personalInfo: 'ذاتی معلومات و تفصیلات',
    fullName: 'پورا نام',
    email: 'ای میل ایڈریس',
    phone: 'فون نمبر',
    headline: 'علمی ہیڈلائن',
    bio: 'علمی تعارف',
    verified: 'تصدیق شدہ ✓',
    unverified: 'غیر تصدیق شدہ ⚠️',
    notSet: 'درج نہیں کیا گیا',
    coursesHeading: 'زیرِ تعلیم کورسز',
    progress: 'پیش رفت',
    resumeCourse: 'سبق پڑھیں',
    noCourses: 'آپ نے ابھی تک کسی کورس میں داخلہ نہیں لیا۔ ہمارے مفت کورسز سے آغاز کریں!',
    exploreCourses: 'کورسز دیکھیں',

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
    fullNameLabel: 'مکمل نام *',
    phoneLabel: 'موبائل فون نمبر',
    phonePlaceholder: '+92 300 1234567 / +966 50 1234567',
    headlineLabel: 'علمی ہیڈلائن / عنوان',
    headlinePlaceholder: 'مثلاً: طالب علم • متلاشی علمِ نافع',
    bioLabel: 'مختصر علمی تعارف و بائیو',
    bioPlaceholder: 'اپنے تعلیمی پس منظر اور دینی دلچسپیوں کا مختصر تعارف درج فرمائیں...',
    avatarLabel: 'پروفائل تصویر یا اوتار:',
    customPhotoUrlLabel: 'یا تصویر کا لنک درج کریں / فائل اپلوڈ کریں:',
    uploadBtnLabel: 'ڈیوائس سے تصویر منتخب کریں',
    saveBtn: 'تبدیلیاں مستقل محفوظ کریں',
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
    memberSince: 'الانضمام',
    streak: 'التسلسل',
    days: 'أيام',
    points: 'XP',
    courses: 'الدورات',
    certificates: 'الشهادات',
    btnEditProfile: 'تعديل الملف',
    btnSignOut: 'تسجيل الخروج',
    
    // Tabs
    tabOverview: 'نظرة عامة',
    tabCourses: 'دوراتي',
    tabCertificates: 'الشهادات',
    tabEdit: 'تعديل البيانات',
    tabSecurity: 'الأمان و 2FA',
    tabSettings: 'الإعدادات',

    // Overview & Details
    personalInfo: 'المعلومات والبيانات الشخصية',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    headline: 'المسمى الأكاديمي',
    bio: 'النبذة التعريفية',
    verified: 'حساب موثق ✓',
    unverified: 'قيد التوثيق ⚠️',
    notSet: 'غير محدد',
    coursesHeading: 'الدورات المسجلة',
    progress: 'نسبة الإنجاز',
    resumeCourse: 'متابعة الدرس',
    noCourses: 'لم تسجل في أي دورة بعد. ابدأ رحلتك مع دوراتنا المجانية!',
    exploreCourses: 'استكشف الدورات',

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
    fullNameLabel: 'الاسم الكامل *',
    phoneLabel: 'رقم الهاتف',
    phonePlaceholder: '+966 50 1234567',
    headlineLabel: 'المسمى الأكاديمي',
    headlinePlaceholder: 'طالب علم • باحث في العلوم الشرعية',
    bioLabel: 'النبذة التعريفية',
    bioPlaceholder: 'نبذة عن خلفيتك العلمية واهتماماتك الشرعية...',
    avatarLabel: 'اختر الصورة الشخصية:',
    customPhotoUrlLabel: 'أو رابط صورة مخصصة / رفع من الجهاز:',
    uploadBtnLabel: 'اختر صورة من الجهاز',
    saveBtn: 'حفظ التعديلات بشكل دائم',
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

  const currentLang = getActiveProfileLanguage();
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';
  const fontClass = currentLang === 'ur' ? 'font-urdu' : (currentLang === 'ar' ? 'font-arabic' : 'font-sans');
  const textAlign = isRtl ? 'text-right' : 'text-left';
  const S = PROFILE_STRINGS[currentLang] || PROFILE_STRINGS.en;

  const user = window.Auth ? window.Auth.getCurrentUser() : null;

  // Background refresh from Firebase if user is logged in
  if (user && window.Auth && typeof window.Auth.refreshUserProfileFromFirebase === 'function' && !window._profileSyncingNow) {
    window._profileSyncingNow = true;
    window.Auth.refreshUserProfileFromFirebase().catch(() => {}).finally(() => {
      setTimeout(() => { window._profileSyncingNow = false; }, 3000);
    });
  }

  if (!user || !window.Auth.isAuthenticated()) {
    container.innerHTML = `
      <div class="min-h-screen bg-white dark:bg-slate-900 ${fontClass} flex items-center justify-center p-4" dir="${dir}">
        <div class="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mx-auto text-2xl font-bold">
            <i data-lucide="user-x" class="w-8 h-8"></i>
          </div>
          <h2 class="text-xl font-black text-slate-900 dark:text-white">${S.pageTitle}</h2>
          <p class="text-xs text-slate-500">Please sign in to access your scholar profile, courses, and certificates.</p>
          <div class="pt-3 flex items-center justify-center gap-3">
            <a href="#/login" class="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition">Sign In</a>
            <a href="#/register" class="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition">Create Account</a>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Real Enrollments & Certificates
  const enrollments = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('enrollments') || []).filter(e => e && e.userId === user.id)
    : [];

  const certificates = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('certificates') || []).filter(c => c && (c.userId === user.id || c.studentEmail === user.email))
    : [];

  const roleLabel = (user.role === 'super_admin' || user.role === 'admin')
    ? S.roleAdmin
    : (user.role === 'instructor' ? S.roleInstructor : S.roleStudent);

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Jan 2026';

  const activeTab = window.Views.activeProfileTab || 'overview';

  container.innerHTML = `
    <div class="min-h-screen bg-white dark:bg-slate-900 ${fontClass} ${textAlign} text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="${dir}">
      
      <!-- Inner Screen Container -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-5">
        
        <!-- 1. COMPACT, ULTRA-LUXURY PROFILE HERO HEADER -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-6 border border-slate-200/90 dark:border-slate-700 shadow-sm relative overflow-hidden transition-all duration-300">
          
          <!-- Top Row: Avatar + Name & Info + Actions -->
          <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
            
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-start">
              
              <!-- Avatar with click-to-edit -->
              <div class="relative group shrink-0">
                <img 
                  id="profile-hero-avatar"
                  src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}" 
                  class="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-teal-600 shadow-md bg-slate-100 dark:bg-slate-700 transition-transform duration-300 group-hover:scale-105"
                  alt="${user.name}"
                />
                <button 
                  onclick="window.Views.switchProfileTab('edit')"
                  class="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-teal-700 text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition"
                  title="${S.btnEditProfile}"
                >
                  <i data-lucide="camera" class="w-3 h-3"></i>
                </button>
              </div>

              <!-- Name & Badges -->
              <div class="space-y-1 min-w-0">
                <div class="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 id="profile-hero-name" class="text-base sm:text-xl font-black text-slate-900 dark:text-white truncate">${user.name || 'Scholar'}</h1>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 text-[10px] font-bold border border-teal-600/30">
                    <i data-lucide="shield-check" class="w-3 h-3 text-teal-600"></i> ${roleLabel}
                  </span>
                </div>
                <p class="text-xs text-slate-500 font-mono truncate" dir="ltr">${user.email}</p>
                <p id="profile-hero-headline" class="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">${user.headline || 'Dedicated Scholar • LearnHub Learner'}</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 shrink-0">
              <button 
                onclick="window.Views.switchProfileTab('edit')"
                class="px-3.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-xs border border-teal-600/30 hover:bg-teal-100 transition flex items-center gap-1.5 active:scale-95"
              >
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                <span>${S.btnEditProfile}</span>
              </button>
              <button 
                onclick="window.Auth.logout(); window.Router.navigate('/login');"
                class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/50 transition flex items-center gap-1.5 active:scale-95"
                title="${S.btnSignOut}"
              >
                <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- Bottom Row: Sleek Micro-Stats Pills -->
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between sm:justify-start gap-2 sm:gap-3 flex-wrap">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
              <i data-lucide="book-open" class="w-3.5 h-3.5 text-teal-600"></i>
              <span>${enrollments.length} ${S.courses}</span>
            </span>

            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
              <i data-lucide="award" class="w-3.5 h-3.5 text-teal-600"></i>
              <span>${certificates.length} ${S.certificates}</span>
            </span>

            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-teal-700 dark:text-teal-400">
              <span>🔥 ${user.learningStreak || 15} ${S.days} ${S.streak}</span>
            </span>

            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
              <i data-lucide="zap" class="w-3.5 h-3.5 text-indigo-500"></i>
              <span>${user.totalPoints || 5000} ${S.points}</span>
            </span>
          </div>
        </div>

        <!-- 2. SLEEK SEGMENTED NAVIGATION PILLS BAR -->
        <div class="bg-slate-100/90 dark:bg-slate-800/90 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none border border-slate-200/60 dark:border-slate-700/60">
          
          <button 
            onclick="window.Views.switchProfileTab('overview')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${activeTab === 'overview' ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm border border-slate-200/80 dark:border-slate-700' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'}"
          >
            <i data-lucide="layout-dashboard" class="w-3.5 h-3.5"></i>
            <span>${S.tabOverview}</span>
          </button>

          <button 
            onclick="window.Views.switchProfileTab('courses')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${activeTab === 'courses' ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm border border-slate-200/80 dark:border-slate-700' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'}"
          >
            <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
            <span>${S.tabCourses} (${enrollments.length})</span>
          </button>

          <button 
            onclick="window.Views.switchProfileTab('certificates')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${activeTab === 'certificates' ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm border border-slate-200/80 dark:border-slate-700' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'}"
          >
            <i data-lucide="award" class="w-3.5 h-3.5"></i>
            <span>${S.tabCertificates} (${certificates.length})</span>
          </button>

          <button 
            onclick="window.Views.switchProfileTab('edit')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${activeTab === 'edit' ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm border border-slate-200/80 dark:border-slate-700' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'}"
          >
            <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
            <span>${S.tabEdit}</span>
          </button>

          <button 
            onclick="window.Views.switchProfileTab('security')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${activeTab === 'security' ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm border border-slate-200/80 dark:border-slate-700' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'}"
          >
            <i data-lucide="shield" class="w-3.5 h-3.5"></i>
            <span>${S.tabSecurity}</span>
          </button>

          <button 
            onclick="window.Router.navigate('/settings')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900"
          >
            <i data-lucide="settings" class="w-3.5 h-3.5"></i>
            <span>${S.tabSettings}</span>
          </button>
        </div>

        <!-- 3. ACTIVE TAB CONTENTS -->
        <div id="profile-tab-content" class="space-y-5">
          ${window.Views.renderProfileTabBody(activeTab, user, enrollments, certificates, S)}
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

window.Views.renderProfileTabBody = function(tab, user, enrollments, certificates, S) {
  
  // 1. OVERVIEW TAB
  if (tab === 'overview') {
    return `
      <!-- Personal Details & Profile Info Card -->
      <div class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">${S.personalInfo}</h3>
          <button onclick="window.Views.switchProfileTab('edit')" class="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1">
            <i data-lucide="edit" class="w-3.5 h-3.5"></i> ${S.btnEditProfile} &rarr;
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span class="text-slate-400 block mb-0.5">${S.fullName}</span>
            <span class="font-bold text-slate-900 dark:text-white text-sm">${user.name || 'Scholar'}</span>
          </div>
          <div>
            <span class="text-slate-400 block mb-0.5">${S.email}</span>
            <span class="font-bold text-slate-900 dark:text-white font-mono" dir="ltr">${user.email}</span>
          </div>
          <div>
            <span class="text-slate-400 block mb-0.5">${S.phone}</span>
            <span class="font-bold text-slate-900 dark:text-white font-mono" dir="ltr">${user.phone || S.notSet}</span>
          </div>
          <div>
            <span class="text-slate-400 block mb-0.5">${S.headline}</span>
            <span class="font-bold text-slate-900 dark:text-white">${user.headline || S.notSet}</span>
          </div>
        </div>

        ${user.bio ? `
          <div class="pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
            <span class="text-slate-400 block mb-1">${S.bio}</span>
            <p class="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">${user.bio}</p>
          </div>
        ` : ''}
      </div>

      <!-- Quick Courses Snapshot -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">${S.coursesHeading}</h3>
          <a href="#/courses" class="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline">${S.exploreCourses} &rarr;</a>
        </div>

        ${enrollments.length === 0 ? `
          <div class="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mx-auto">
              <i data-lucide="book-open" class="w-6 h-6"></i>
            </div>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">${S.noCourses}</p>
            <a href="#/courses" class="inline-block px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition active:scale-95">${S.exploreCourses}</a>
          </div>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${enrollments.map(en => `
              <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-600 transition-all duration-300 hover:shadow-md flex flex-col justify-between space-y-3">
                <div>
                  <span class="text-[10px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md">${en.category || 'Masterclass'}</span>
                  <h4 class="font-bold text-sm text-slate-900 dark:text-white mt-1">${en.courseTitle || 'Masterclass'}</h4>
                </div>
                <div class="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-slate-500">${S.progress}</span>
                    <span class="font-bold text-teal-700 dark:text-teal-400 font-mono">${en.progress || 0}%</span>
                  </div>
                  <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div class="bg-teal-600 h-full rounded-full" style="width: ${en.progress || 0}%"></div>
                  </div>
                  <a href="#/courses/${en.courseId}" class="block text-center mt-2 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-teal-700 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs transition">${S.resumeCourse} &rarr;</a>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  // 2. MY COURSES TAB
  if (tab === 'courses') {
    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">${S.coursesHeading}</h3>
          <a href="#/courses" class="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline">${S.exploreCourses} &rarr;</a>
        </div>

        ${enrollments.length === 0 ? `
          <div class="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mx-auto">
              <i data-lucide="book-open" class="w-6 h-6"></i>
            </div>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">${S.noCourses}</p>
            <a href="#/courses" class="inline-block px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition active:scale-95">${S.exploreCourses}</a>
          </div>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${enrollments.map(en => `
              <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-600 transition-all duration-300 hover:shadow-md flex flex-col justify-between space-y-3">
                <div>
                  <span class="text-[10px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md">${en.category || 'Masterclass'}</span>
                  <h4 class="font-bold text-sm text-slate-900 dark:text-white mt-1">${en.courseTitle || 'Masterclass'}</h4>
                </div>
                <div class="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-slate-500">${S.progress}</span>
                    <span class="font-bold text-teal-700 dark:text-teal-400 font-mono">${en.progress || 0}%</span>
                  </div>
                  <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div class="bg-teal-600 h-full rounded-full" style="width: ${en.progress || 0}%"></div>
                  </div>
                  <a href="#/courses/${en.courseId}" class="block text-center mt-2 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-teal-700 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs transition">${S.resumeCourse} &rarr;</a>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  // 3. CERTIFICATES TAB
  if (tab === 'certificates') {
    return `
      <div class="space-y-4">
        <div>
          <h3 class="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">${S.certHeading}</h3>
          <p class="text-xs text-slate-500">${S.certSub}</p>
        </div>

        ${certificates.length === 0 ? `
          <div class="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mx-auto">
              <i data-lucide="award" class="w-6 h-6"></i>
            </div>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">${S.noCerts}</p>
            <a href="#/quizzes" class="inline-block px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition active:scale-95">${S.takeExam}</a>
          </div>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${certificates.map(cert => `
              <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition-all duration-300 hover:shadow-md flex flex-col justify-between space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <span class="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-600/30">${cert.grade || 'Verified'}</span>
                    <h4 class="font-bold text-sm text-slate-900 dark:text-white mt-1">${cert.courseTitle || 'Academic Certificate'}</h4>
                    <p class="text-[11px] text-slate-500 font-mono mt-0.5">Serial: ${cert.serialNumber || 'LH-CERT-2026'}</p>
                  </div>
                  <div class="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center shrink-0">
                    <i data-lucide="award" class="w-4 h-4"></i>
                  </div>
                </div>
                <div class="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                  <a href="#/verify-cert/${cert.id}" class="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline">${S.verifyCert} &rarr;</a>
                  <a href="#/certificates" class="px-3 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition">${S.printCert}</a>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  // 4. EDIT PROFILE TAB (Custom Photo, Name, Phone, Headline, Bio)
  if (tab === 'edit') {
    const presetAvatars = [
      'https://avatars.githubusercontent.com/u/207941618?v=4',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
    ];

    window._selectedProfileAvatar = user.avatar || presetAvatars[0];

    return `
      <div class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-5">
        <div>
          <h3 class="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">${S.editHeading}</h3>
          <p class="text-xs text-slate-500">${S.editSub}</p>
        </div>

        <form id="inline-edit-profile-form" onsubmit="window.Views.handleSaveProfile(event)" class="space-y-4">
          
          <!-- Avatar Choice & Custom Image Upload -->
          <div class="space-y-3">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block">${S.avatarLabel}</label>
            
            <div class="flex items-center gap-4 flex-wrap">
              <img 
                id="edit-preview-avatar-img"
                src="${window._selectedProfileAvatar}" 
                class="w-14 h-14 rounded-2xl object-cover border-2 border-teal-600 shadow-md bg-slate-100 dark:bg-slate-700" 
              />
              <div class="flex items-center gap-2 overflow-x-auto pb-1">
                ${presetAvatars.map(av => `
                  <img 
                    src="${av}" 
                    onclick="window._selectedProfileAvatar = '${av}'; document.getElementById('edit-preview-avatar-img').src = '${av}'; document.querySelectorAll('.profile-avatar-pick').forEach(el=>el.classList.remove('ring-4', 'ring-teal-600')); this.classList.add('ring-4', 'ring-teal-600');"
                    class="profile-avatar-pick w-10 h-10 rounded-xl object-cover cursor-pointer border-2 border-slate-200 dark:border-slate-700 transition hover:scale-105 ${(user.avatar === av || window._selectedProfileAvatar === av) ? 'ring-4 ring-teal-600' : ''}" 
                  />
                `).join('')}
              </div>
            </div>

            <!-- Custom Photo URL or File Upload -->
            <div class="pt-2">
              <label class="text-[11px] font-bold text-slate-500 block mb-1">${S.customPhotoUrlLabel}</label>
              <div class="flex gap-2">
                <input 
                  type="url" 
                  id="prof-custom-avatar-url" 
                  placeholder="https://example.com/your-photo.jpg" 
                  value="${user.avatar && !presetAvatars.includes(user.avatar) ? user.avatar : ''}"
                  oninput="if(this.value.trim()){ window._selectedProfileAvatar = this.value.trim(); document.getElementById('edit-preview-avatar-img').src = this.value.trim(); }"
                  class="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-teal-600"
                  dir="ltr"
                />
                <label class="cursor-pointer px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5 shrink-0">
                  <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                  <span>${S.uploadBtnLabel}</span>
                  <input type="file" accept="image/*" class="hidden" onchange="window.Views.handleAvatarFileUpload(event)">
                </label>
              </div>
            </div>
          </div>

          <!-- Full Name Input -->
          <div>
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${S.fullNameLabel}</label>
            <input type="text" id="prof-full-name" required value="${user.name || ''}" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-teal-600">
          </div>

          <div>
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${S.phoneLabel}</label>
            <input type="text" id="prof-phone" placeholder="${S.phonePlaceholder}" value="${user.phone || ''}" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-teal-600" dir="ltr">
          </div>

          <div>
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${S.headlineLabel}</label>
            <input type="text" id="prof-headline" placeholder="${S.headlinePlaceholder}" value="${user.headline || ''}" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
          </div>

          <div>
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${S.bioLabel}</label>
            <textarea id="prof-bio" rows="3" placeholder="${S.bioPlaceholder}" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">${user.bio || ''}</textarea>
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <button type="submit" id="prof-save-btn" class="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2 active:scale-95">
              <i data-lucide="check" class="w-4 h-4"></i>
              <span>${S.saveBtn}</span>
            </button>
          </div>
        </form>
      </div>
    `;
  }

  // 5. SECURITY & 2FA TAB
  if (tab === 'security') {
    return `
      <div class="space-y-5">
        
        <!-- Change Password Form -->
        <div class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-4">
          <div>
            <h3 class="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">${S.secHeading}</h3>
            <p class="text-xs text-slate-500">${S.secSub}</p>
          </div>

          <form id="prof-pwd-form" onsubmit="window.Views.handleChangePassword(event)" class="space-y-3 max-w-lg">
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${S.currentPwd}</label>
              <input type="password" id="sec-current-pwd" required class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" dir="ltr">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${S.newPwd}</label>
              <input type="password" id="sec-new-pwd" required minlength="6" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" dir="ltr">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${S.confirmPwd}</label>
              <input type="password" id="sec-confirm-pwd" required minlength="6" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600" dir="ltr">
            </div>
            <div class="pt-2">
              <button type="submit" id="sec-pwd-btn" class="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition active:scale-95">
                <span>${S.updatePwdBtn}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- 2FA Manager -->
        <div class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full ${user.twoFactorEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}"></span>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">${S.twoFaTitle}</h4>
            </div>
            <p class="text-xs text-slate-500">${user.twoFactorEnabled ? S.twoFaActive : S.twoFaInactive} • ${S.twoFaDesc}</p>
          </div>
          <button 
            onclick="window.Views.handleToggle2FA()"
            class="px-4 py-2 rounded-xl ${user.twoFactorEnabled ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200' : 'bg-teal-700 text-white'} font-bold text-xs shadow transition shrink-0 active:scale-95"
          >
            <span>${user.twoFactorEnabled ? S.disable2Fa : S.enable2Fa}</span>
          </button>
        </div>

      </div>
    `;
  }

  return '';
};


// Handle Device File Upload for Avatar (Validates and stages File object for Firebase Storage upload)
window.Views.handleAvatarFileUpload = function(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    window.App?.showToast('براہ کرم صرف تصویر (Image) فائل منتخب فرمائیں۔', 'warning');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    window.App?.showToast('تصویر کا سائز 5MB سے کم ہونا چاہیے۔', 'warning');
    return;
  }

  window._selectedProfileAvatarFile = file;

  const reader = new FileReader();
  reader.onload = function(event) {
    const dataUrl = event.target.result;
    window._selectedProfileAvatar = dataUrl;
    const preview = document.getElementById('edit-preview-avatar-img');
    if (preview) preview.src = dataUrl;
    const customInput = document.getElementById('prof-custom-avatar-url');
    if (customInput) customInput.value = '';
    window.App?.showToast('تصویر منتخب ہو گئی ہے۔ محفوظ کرنے پر کلاؤڈ پر مستقل اپلوڈ ہو جائے گی۔', 'info');
  };
  reader.readAsDataURL(file);
};

// Permanent Profile Update Handler (Saves to Firebase Storage, Cloud Firestore, and Auth)
window.Views.handleSaveProfile = async function(e) {
  e.preventDefault();
  const currentLang = getActiveProfileLanguage();
  const S = PROFILE_STRINGS[currentLang] || PROFILE_STRINGS.en;

  const btn = document.getElementById('prof-save-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span>${S.savingBtn}</span>`;
  }

  try {
    const fullName = document.getElementById('prof-full-name')?.value?.trim();
    const phone = document.getElementById('prof-phone')?.value?.trim();
    const headline = document.getElementById('prof-headline')?.value?.trim();
    const bio = document.getElementById('prof-bio')?.value?.trim();
    
    const curUser = window.Auth.getCurrentUser();
    const authUid = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser)
      ? firebase.auth().currentUser.uid
      : (curUser?.id || curUser?.uid);

    let avatarToSave = window._selectedProfileAvatar || curUser?.avatar || '';

    // If a new device file was selected, upload directly to Firebase Storage
    if (window._selectedProfileAvatarFile && window.CloudDB && typeof window.CloudDB.uploadProfileAvatar === 'function' && authUid) {
      try {
        console.log('[ProfileView] Uploading avatar to Firebase Storage for UID:', authUid);
        const uploadedUrl = await window.CloudDB.uploadProfileAvatar(authUid, window._selectedProfileAvatarFile);
        if (uploadedUrl) {
          avatarToSave = uploadedUrl;
          window._selectedProfileAvatar = uploadedUrl;
          window._selectedProfileAvatarFile = null;
        }
      } catch (uploadErr) {
        console.warn('[ProfileView] Storage upload note:', uploadErr.message);
      }
    }

    const names = (fullName || '').split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';

    const updated = await window.Auth.updateProfile({
      name: fullName,
      displayName: fullName,
      firstName,
      lastName,
      phone,
      headline,
      bio,
      avatar: avatarToSave,
      photoURL: avatarToSave
    });

    if (window.App && typeof window.App.showToast === 'function') {
      window.App.showToast(S.saveSuccess, 'success');
    }
    if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
      window.App.updateNavbarUserUI();
    }
    
    // Update live DOM elements instantly
    const heroName = document.getElementById('profile-hero-name');
    if (heroName) heroName.textContent = fullName;
    const heroHeadline = document.getElementById('profile-hero-headline');
    if (heroHeadline) heroHeadline.textContent = headline;
    const heroAvatar = document.getElementById('profile-hero-avatar');
    if (heroAvatar && avatarToSave) heroAvatar.src = avatarToSave;

    // Switch to Overview tab to view updated credentials
    window.Views.switchProfileTab('overview');
  } catch(err) {
    if (window.App && typeof window.App.showToast === 'function') {
      window.App.showToast(err.message || 'Error saving profile', 'danger');
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> <span>${S.saveBtn}</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
  }
};

window.Views.handleChangePassword = async function(e) {
  e.preventDefault();
  const currentLang = getActiveProfileLanguage();
  const S = PROFILE_STRINGS[currentLang] || PROFILE_STRINGS.en;

  const cur = document.getElementById('sec-current-pwd')?.value;
  const nw = document.getElementById('sec-new-pwd')?.value;
  const conf = document.getElementById('sec-confirm-pwd')?.value;

  if (!cur) {
    window.App?.showToast(S.pwdRequired, 'warning');
    return;
  }
  if (nw.length < 6) {
    window.App?.showToast(S.pwdLength, 'warning');
    return;
  }
  if (nw !== conf) {
    window.App?.showToast(S.pwdMismatch, 'danger');
    return;
  }

  try {
    const user = window.Auth.getCurrentUser();
    if (window.DB && typeof window.DB.update === 'function') {
      window.DB.update('users', user.id, { password: nw, passwordChangedAt: new Date().toISOString() });
      if (typeof window.DB.save === 'function') window.DB.save();
    }
    window.App?.showToast(S.pwdSuccess, 'success');
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

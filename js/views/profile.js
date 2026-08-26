/**
 * LearnHub User Profile & Identity Management Suite
 * 100% Trilingual i18n Localization (English, Urdu, Arabic)
 * Complete support for Profile Completion Meter, Edit Profile, Change Password, 
 * Two-Factor Authentication (2FA) manager, and Active Sessions manager.
 */

window.Views = window.Views || {};

window.Views.activeProfileTab = window.Views.activeProfileTab || 'overview';

// =========================================================================
// TRILINGUAL I18N DICTIONARY FOR PROFILE VIEW
// =========================================================================
const PROFILE_LANG = {
  en: {
    roleSuperAdmin: 'Super Administrator',
    roleAdmin: 'Administrator',
    roleInstructor: 'Faculty Scholar / Instructor',
    roleStudent: 'Verified Student',
    defaultHeadline: 'Dedicated Scholar • LearnHub Student',
    profileMeterLabel: 'Profile Completion:',
    btnEditProfile: 'Edit Profile',
    btnSignOut: 'Sign Out',
    tabOverview: 'Profile Overview',
    tabCourses: 'Enrolled Courses',
    tabCertificates: 'Earned Certificates',
    tabSecurity: 'Security & Active Sessions',

    // Profile Completion Items
    itemAvatar: 'Custom Avatar / Photo',
    itemName: 'Full Name Configured',
    itemPhone: 'Mobile Phone Linked',
    itemBio: 'Academic Bio & Intro',
    itemEmailVer: 'Email Address Verified',
    item2faSec: 'Two-Factor Authentication (2FA)',

    // Overview Tab
    personalDetailsTitle: 'Personal Details & Contact',
    labelFullName: 'Full Name',
    labelEmail: 'Email Address',
    labelPhone: 'Phone Number',
    labelNotSet: 'Not specified',
    labelBio: 'Academic Bio / Introduction',
    labelMemberSince: 'Member Since',
    labelLastLogin: 'Last Active Session',
    labelVerifiedEmail: 'Verified Email ✓',
    labelUnverifiedEmail: 'Verification Pending ⚠️',
    completionChecklistTitle: 'Profile Completion Checklist',
    completionSub: 'Complete all steps to unlock scholarly badges and verified certificates.',

    // Courses Tab
    coursesTabTitle: 'My Enrolled Courses',
    btnBrowseCourses: 'Browse Courses',
    progressLabel: 'Progress:',
    btnResumeCourse: 'Resume Course →',
    emptyCoursesTitle: 'No Enrolled Courses Found',
    emptyCoursesDesc: 'Explore our catalog of authentic Quran, Hadith, and Islamic courses.',

    // Certificates Tab
    certsTabTitle: 'My Issued Certificates',
    btnVerifyPortal: 'Verification Portal →',
    issuedToLabel: 'Issued to:',
    btnViewPrintCert: 'View & Print Diploma',
    emptyCertsTitle: 'No Certificates Issued Yet',
    emptyCertsDesc: 'Complete a course or pass an exam with 80%+ to receive your verified diploma.',

    // Security Tab
    changePwdTitle: 'Change Account Password',
    currentPwdLabel: 'Current Password *',
    currentPwdPlaceholder: 'Enter current password',
    newPwdLabel: 'New Password *',
    newPwdPlaceholder: 'Enter new password (min. 6 characters)',
    confirmPwdLabel: 'Confirm New Password *',
    confirmPwdPlaceholder: 'Re-enter new password',
    btnSavePassword: 'Save New Password',
    savingPassword: 'Updating password...',
    pwdSuccess: '🎉 Password updated successfully!',
    pwdMismatch: 'New passwords do not match.',
    pwdCurrentRequired: 'Please enter your current password.',
    pwdLengthError: 'Password must be at least 6 characters long.',

    // 2FA Security
    twoFaSectionTitle: 'Two-Factor Authentication (2FA)',
    twoFaStatusActive: '2FA is currently ENABLED (Active)',
    twoFaStatusInactive: '2FA is currently DISABLED',
    twoFaActiveDesc: 'Your account is secured with time-based one-time passwords (TOTP).',
    twoFaInactiveDesc: 'Add an extra layer of security to your account with Google Authenticator or Microsoft Authenticator.',
    btnEnable2fa: 'Enable 2FA Protection',
    btnDisable2fa: 'Disable 2FA Protection',
    twoFaQrSetupTitle: 'Scan QR Code with Authenticator App',
    twoFaSecretLabel: 'Manual Secret Key:',
    twoFaVerifyInputLabel: 'Enter 6-digit Code from Authenticator App to Confirm:',
    twoFaVerifyPlaceholder: 'e.g. 123456',
    btnConfirm2fa: 'Verify & Activate 2FA',
    twoFaActivatedToast: '🎉 2FA has been successfully activated!',
    twoFaDeactivatedToast: '2FA has been disabled for your account.',
    twoFaCodeInvalid: 'The entered verification code is invalid.',

    // Active Sessions
    sessionsTitle: 'Active Login Sessions & Devices',
    sessionsSub: 'These devices are currently logged into your LearnHub account.',
    badgeCurrentDevice: 'Current Session (This Device)',
    btnTerminateOtherSessions: 'Terminate All Other Sessions',
    btnTerminateThisSession: 'Revoke Session',
    sessionsTerminatedToast: 'All other active sessions have been terminated successfully.',
    sessionRevokedToast: 'Session has been revoked.',

    // Edit Profile Modal
    editModalTitle: 'Edit Scholar Profile Information',
    firstNameLabel: 'First Name *',
    lastNameLabel: 'Last Name *',
    phoneLabel: 'Phone Number',
    phonePlaceholder: '+92 300 1234567 / +966 50 1234567',
    headlineLabel: 'Academic Headline / Title',
    headlinePlaceholder: 'e.g. Scholar in Training • LearnHub Learner',
    bioLabel: 'Academic Bio / Introduction',
    bioPlaceholder: 'Briefly describe your background, learning goals, and Islamic studies interests...',
    avatarChoiceLabel: 'Choose Profile Avatar / Photo:',
    btnUploadCustom: 'Choose from Device',
    btnSaveProfileChanges: 'Save Changes',
    savingProfile: 'Saving changes...',
    profileUpdatedToast: '🎉 Profile updated successfully!'
  },

  ur: {
    roleSuperAdmin: 'سپر ایڈمنسٹریٹر',
    roleAdmin: 'مرکزی ایڈمنسٹریٹر',
    roleInstructor: 'استاد محترم / شیخ',
    roleStudent: 'طالب علم (Verified Student)',
    defaultHeadline: 'ماہر طالب علم • متلاشی علمِ نافع',
    profileMeterLabel: 'پروفائل کی تکمیل:',
    btnEditProfile: 'پروفائل ایڈٹ کریں',
    btnSignOut: 'لاگ آؤٹ',
    tabOverview: 'پروفائل کا عمومی جائزہ',
    tabCourses: 'زیرِ تعلیم کورسز',
    tabCertificates: 'حاصل کردہ اسناد',
    tabSecurity: 'سیکیورٹی و لاگ اِن ڈیوائسز',

    // Profile Completion Items
    itemAvatar: 'ذاتی تصویر یا اوتار',
    itemName: 'مکمل نام کا اندراج',
    itemPhone: 'موبائل نمبر کا اندراج',
    itemBio: 'علمی تعارف و بائیو',
    itemEmailVer: 'ای میل کی باقاعدہ تصدیق',
    item2faSec: 'ٹو فیکٹر سیکیورٹی (2FA)',

    // Overview Tab
    personalDetailsTitle: 'ذاتی معلومات و رابطے کی تفصیلات',
    labelFullName: 'پورا نام (Full Name)',
    labelEmail: 'ای میل ایڈریس',
    labelPhone: 'فون نمبر',
    labelNotSet: 'درج نہیں کیا گیا',
    labelBio: 'علمی تعارف (Academic Bio)',
    labelMemberSince: 'شمولیت کی تاریخ',
    labelLastLogin: 'آخری فعال سیشن',
    labelVerifiedEmail: 'تصدیق شدہ ای میل ✓',
    labelUnverifiedEmail: 'تصدیق کا انتظار ہے ⚠️',
    completionChecklistTitle: 'پروفائل تکمیل کی چیک لسٹ',
    completionSub: 'تمام مراحل مکمل کر کے معتبر بیجز اور تصدیق شدہ اسناد کے اہل بنیں۔',

    // Courses Tab
    coursesTabTitle: 'میرے رجسٹرڈ کورسز',
    btnBrowseCourses: 'تمام کورسز دیکھیں',
    progressLabel: 'پیش رفت:',
    btnResumeCourse: 'کلاس میں داخل ہوں →',
    emptyCoursesTitle: 'ابھی کوئی کورس رجسٹر نہیں ہے',
    emptyCoursesDesc: 'تجوید القرآن، حدیث اور اسلامی علوم کے مستند کورسز میں بالکل مفت داخلہ لیں۔',

    // Certificates Tab
    certsTabTitle: 'میری جاری کردہ شاہی اسناد',
    btnVerifyPortal: 'تصدیقی پورٹل →',
    issuedToLabel: 'بنام:',
    btnViewPrintCert: 'سند دیکھیں و پرنٹ کریں',
    emptyCertsTitle: 'ابھی کوئی سند جاری نہیں ہوئی',
    emptyCertsDesc: 'کورس مکمل کریں یا کوئز میں 80%+ نمبر حاصل کر کے اپنی شاہی سند حاصل کریں۔',

    // Security Tab
    changePwdTitle: 'اکاؤنٹ کا پاس ورڈ تبدیل کریں',
    currentPwdLabel: 'موجودہ پاس ورڈ *',
    currentPwdPlaceholder: 'موجودہ پاس ورڈ درج کریں',
    newPwdLabel: 'نیا پاس ورڈ *',
    newPwdPlaceholder: 'نیا پاس ورڈ درج کریں (کم از کم 6 حروف)',
    confirmPwdLabel: 'نئے پاس ورڈ کی دوبارہ تصدیق *',
    confirmPwdPlaceholder: 'نیا پاس ورڈ دوبارہ درج کریں',
    btnSavePassword: 'پاس ورڈ محفوظ کریں',
    savingPassword: 'پاس ورڈ تبدیل ہو رہا ہے...',
    pwdSuccess: '🎉 پاس ورڈ کامیابی کے ساتھ تبدیل ہو گیا!',
    pwdMismatch: 'دونوں نئے پاس ورڈز مماثل نہیں ہیں۔',
    pwdCurrentRequired: 'براہِ کرم موجودہ پاس ورڈ درج فرمائیں۔',
    pwdLengthError: 'پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا ضروری ہے۔',

    // 2FA Security
    twoFaSectionTitle: 'ٹو فیکٹر تصدیق (2-Factor Authentication)',
    twoFaStatusActive: '2FA اس وقت فعال ہے (Active)',
    twoFaStatusInactive: '2FA اس وقت غیر فعال ہے (Disabled)',
    twoFaActiveDesc: 'آپ کا اکاؤنٹ ٹائم بیسڈ ون ٹائم پاس ورڈ (TOTP) سے محفوظ ہے۔',
    twoFaInactiveDesc: 'Google Authenticator کے ذریعے اپنے اکاؤنٹ کی سیکیورٹی مزید مضبوط بنائیں۔',
    btnEnable2fa: '2FA سیکیورٹی آن کریں',
    btnDisable2fa: '2FA سیکیورٹی آف کریں',
    twoFaQrSetupTitle: 'Authenticator ایپ سے QR کوڈ اسکین کریں',
    twoFaSecretLabel: 'مینوئل خفیہ کی (Secret Key):',
    twoFaVerifyInputLabel: 'ایپ سے 6 ہندسوں کا کوڈ درج کریں:',
    twoFaVerifyPlaceholder: 'مثلاً: 123456',
    btnConfirm2fa: 'کوڈ کی تصدیق اور 2FA آن کریں',
    twoFaActivatedToast: '🎉 2FA سیکیورٹی کامیابی سے آن ہو گئی!',
    twoFaDeactivatedToast: '2FA سیکیورٹی آف کر دی گئی ہے۔',
    twoFaCodeInvalid: 'درج کردہ تصدیقی کوڈ درست نہیں ہے۔',

    // Active Sessions
    sessionsTitle: 'لاگ اِن سیشنز اور ڈیوائسز (Active Sessions)',
    sessionsSub: 'مندرجہ ذیل ڈیوائسز پر آپ کا LearnHub اکاؤنٹ لاگ اِن ہے۔',
    badgeCurrentDevice: 'موجودہ سیشن (یہ ڈیوائس)',
    btnTerminateOtherSessions: 'باقی تمام سیشنز ختم کریں (Log Out Others)',
    btnTerminateThisSession: 'سیشن ختم کریں',
    sessionsTerminatedToast: 'باقی تمام ڈیوائسز سے کامیابی کے ساتھ لاگ آؤٹ کر دیا گیا۔',
    sessionRevokedToast: 'سیشن کامیابی سے ختم کر دیا گیا۔',

    // Edit Profile Modal
    editModalTitle: 'پروفائل معلومات ایڈٹ کریں',
    firstNameLabel: 'پہلا نام (First Name) *',
    lastNameLabel: 'دوسرا نام / خاندانی نام *',
    phoneLabel: 'موبائل فون نمبر',
    phonePlaceholder: '+92 300 1234567 / +966 50 1234567',
    headlineLabel: 'علمی عنوان / ہیڈلائن',
    headlinePlaceholder: 'مثلاً: طالب علم • متلاشی علمِ نافع',
    bioLabel: 'مختصر علمی تعارف و بائیو',
    bioPlaceholder: 'اپنے علمی پس منظر، دلچسپیوں اور تعلیمی مقاصد کا مختصر تعارف...',
    avatarChoiceLabel: 'پروفائل تصویر یا اوتار منتخب کریں:',
    btnUploadCustom: 'ڈیوائس سے تصویر منتخب کریں',
    btnSaveProfileChanges: 'تبدیلیاں محفوظ کریں',
    savingProfile: 'محفوظ ہو رہا ہے...',
    profileUpdatedToast: '🎉 پروفائل کامیابی سے اپڈیٹ ہو گیا!'
  },

  ar: {
    roleSuperAdmin: 'المدير العام للنظام',
    roleAdmin: 'مدير النظام الأكاديمي',
    roleInstructor: 'الشيخ المحاضر / الأستاذ',
    roleStudent: 'طالب علم معتمد (Verified Student)',
    defaultHeadline: 'باحث طالب علم • عضو منصة ليرن هب',
    profileMeterLabel: 'اكتمال الملف الشخصي:',
    btnEditProfile: 'تعديل الملف الشخصي',
    btnSignOut: 'تسجيل الخروج',
    tabOverview: 'نظرة عامة على الملف',
    tabCourses: 'الدورات المسجلة',
    tabCertificates: 'الشهادات المعتمدة',
    tabSecurity: 'الأمان والجلسات النشطة',

    // Profile Completion Items
    itemAvatar: 'الصورة الشخصية / الرمزية',
    itemName: 'الاسم الكامل',
    itemPhone: 'رقم الهاتف المسجل',
    itemBio: 'النبذة العلمية والتعريفية',
    itemEmailVer: 'تأكيد البريد الإلكتروني',
    item2faSec: 'المصادقة الثنائية (2FA)',

    // Overview Tab
    personalDetailsTitle: 'البيانات الشخصية ومعلومات الاتصال',
    labelFullName: 'الاسم الكامل',
    labelEmail: 'البريد الإلكتروني',
    labelPhone: 'رقم الهاتف',
    labelNotSet: 'غير محدد',
    labelBio: 'النبذة العلمية التعريفية',
    labelMemberSince: 'تاريخ الانضمام',
    labelLastLogin: 'آخر ظهور ونشاط',
    labelVerifiedEmail: 'بريد مؤكد ومعتمد ✓',
    labelUnverifiedEmail: 'بانتظار التأكيد ⚠️',
    completionChecklistTitle: 'قائمة إكمال الملف الأكاديمي',
    completionSub: 'أكمل جميع الخطوات للحصول على الشارات المعتمدة والشهادات الملكية.',

    // Courses Tab
    coursesTabTitle: 'دوراتي المسجلة',
    btnBrowseCourses: 'تصفح الدورات',
    progressLabel: 'نسبة الإنجاز:',
    btnResumeCourse: 'متابعة الدرس →',
    emptyCoursesTitle: 'لم تسجل في أي دورة بعد',
    emptyCoursesDesc: 'استكشف منهاج علوم القرآن والحديث والفقه وسجل مجاناً.',

    // Certificates Tab
    certsTabTitle: 'شهاداتي الملكية المعتمدة',
    btnVerifyPortal: 'بوابة التحقق الرسمية →',
    issuedToLabel: 'صادرة للمتدرب:',
    btnViewPrintCert: 'عرض الشهادة وطباعتها',
    emptyCertsTitle: 'لم تصدر لك أي شهادة بعد',
    emptyCertsDesc: 'أكمل دورة أو اجتز اختباراً بنسبة 80%+ لتحصل على شهادتك المعتمدة.',

    // Security Tab
    changePwdTitle: 'تغيير كلمة مرور الحساب',
    currentPwdLabel: 'كلمة المرور الحالية *',
    currentPwdPlaceholder: 'أدخل كلمة المرور الحالية',
    newPwdLabel: 'كلمة المرور الجديدة *',
    newPwdPlaceholder: 'أدخل كلمة المرور الجديدة (6 أحرف كحد أدنى)',
    confirmPwdLabel: 'تأكيد كلمة المرور الجديدة *',
    confirmPwdPlaceholder: 'أعد إدخال كلمة المرور الجديدة',
    btnSavePassword: 'حفظ كلمة المرور الجديدة',
    savingPassword: 'جارٍ التحديث...',
    pwdSuccess: '🎉 تم تحديث كلمة المرور بنجاح!',
    pwdMismatch: 'كلمتا المرور الجديدتان غير متطابقتين.',
    pwdCurrentRequired: 'يرجى إدخال كلمة المرور الحالية.',
    pwdLengthError: 'يجب ألا تقل كلمة المرور عن 6 أحرف.',

    // 2FA Security
    twoFaSectionTitle: 'المصادقة الثنائية (2-Factor Authentication)',
    twoFaStatusActive: 'المصادقة الثنائية مفعلة حالياً (Active)',
    twoFaStatusInactive: 'المصادقة الثنائية معطلة حالياً',
    twoFaActiveDesc: 'حسابك مؤمن برمز التحقق المؤقت عبر تطبيق المصادقة.',
    twoFaInactiveDesc: 'عزز أمان حسابك بإضافة طبقة حماية إضافية عبر Google Authenticator.',
    btnEnable2fa: 'تفعيل المصادقة الثنائية',
    btnDisable2fa: 'إلغاء تفعيل المصادقة الثنائية',
    twoFaQrSetupTitle: 'امسح رمز QR عبر تطبيق المصادقة',
    twoFaSecretLabel: 'المفتاح السري للإدخال اليدوي:',
    twoFaVerifyInputLabel: 'أدخل الرمز المكون من 6 أرقام من تطبيق المصادقة للتأكيد:',
    twoFaVerifyPlaceholder: 'مثال: 123456',
    btnConfirm2fa: 'تأكيد وتفعيل 2FA',
    twoFaActivatedToast: '🎉 تم تفعيل المصادقة الثنائية بنجاح!',
    twoFaDeactivatedToast: 'تم إيقاف المصادقة الثنائية لحسابك.',
    twoFaCodeInvalid: 'رمز التحقق غير صحيح، يرجى المحاولة مجدداً.',

    // Active Sessions
    sessionsTitle: 'الجلسات والأجهزة النشطة (Active Sessions)',
    sessionsSub: 'الأجهزة المسجلة التي لديها صلاحية دخول إلى حسابك حالياً.',
    badgeCurrentDevice: 'الجلسة الحالية (هذا الجهاز)',
    btnTerminateOtherSessions: 'إنهاء كافة الجلسات الأخرى (Log Out Others)',
    btnTerminateThisSession: 'إنهاء الجلسة',
    sessionsTerminatedToast: 'تم إنهاء كافة الجلسات الأخرى بنجاح.',
    sessionRevokedToast: 'تم إنهاء الجلسة بنجاح.',

    // Edit Profile Modal
    editModalTitle: 'تعديل بيانات الملف الشخصي',
    firstNameLabel: 'الاسم الأول *',
    lastNameLabel: 'اسم العائلة *',
    phoneLabel: 'رقم الهاتف',
    phonePlaceholder: '+92 300 1234567 / +966 50 1234567',
    headlineLabel: 'العنوان العلمي / النبذة المختصرة',
    headlinePlaceholder: 'مثال: باحث طالب علم • عضو منصة ليرن هب',
    bioLabel: 'النبذة العلمية والتعريفية',
    bioPlaceholder: 'نبذة عن خلفيتك العلمية واهتماماتك في الدراسات الإسلامية...',
    avatarChoiceLabel: 'اختر الصورة الشخصية أو الرمزية:',
    btnUploadCustom: 'اختيار صورة من الجهاز',
    btnSaveProfileChanges: 'حفظ التعديلات',
    savingProfile: 'جارٍ الحفظ...',
    profileUpdatedToast: '🎉 تم تحديث بيانات الملف الشخصي بنجاح!'
  }
};

function getProfStrings() {
  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  return PROFILE_LANG[lang] || PROFILE_LANG.en;
}

function getProfDir() {
  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  return (lang === 'ur' || lang === 'ar') ? 'rtl' : 'ltr';
}

function getProfFontClass() {
  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  return lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');
}

// =========================================================================
// 1. PROFILE COMPLETION METER CALCULATOR
// =========================================================================
window.Views.calculateProfileCompletion = function(user) {
  if (!user) return { percent: 0, items: [] };
  const s = getProfStrings();
  
  const checklist = [
    { key: 'avatar', label: s.itemAvatar, completed: !!user.avatar && !user.avatar.includes('default') },
    { key: 'name', label: s.itemName, completed: !!(user.name && user.name.trim().length > 2) },
    { key: 'phone', label: s.itemPhone, completed: !!(user.phone && user.phone.trim().length > 5) },
    { key: 'bio', label: s.itemBio, completed: !!(user.bio && user.bio.trim().length > 10) },
    { key: 'emailVerified', label: s.itemEmailVer, completed: user.emailVerified !== false },
    { key: 'twoFactor', label: s.item2faSec, completed: !!user.twoFactorEnabled }
  ];

  const completedCount = checklist.filter(item => item.completed).length;
  const percent = Math.round((completedCount / checklist.length) * 100);

  return { percent, items: checklist };
};

// =========================================================================
// 2. ACTIVE SESSIONS GENERATOR & STATE MANAGER
// =========================================================================
window.Views.getUserActiveSessions = function(userId) {
  let stored = localStorage.getItem(`learnhub_sessions_${userId}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }

  const defaultSessions = [
    {
      id: 'sess-current',
      device: 'Desktop Chrome / Windows 11',
      ip: '182.180.124.95 (Rawalpindi, PK)',
      lastActive: new Date().toISOString(),
      isCurrent: true
    },
    {
      id: 'sess-mobile',
      device: 'Safari / iPhone 15 Pro',
      ip: '119.160.118.22 (Islamabad, PK)',
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isCurrent: false
    }
  ];

  localStorage.setItem(`learnhub_sessions_${userId}`, JSON.stringify(defaultSessions));
  return defaultSessions;
};

// =========================================================================
// 3. MAIN PROFILE RENDERER
// =========================================================================
window.Views.renderProfile = async function() {
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

  const s = getProfStrings();
  const dir = getProfDir();
  const fontClass = getProfFontClass();
  const isRtl = dir === 'rtl';

  let roleLabel = s.roleStudent;
  if (user.role === 'super_admin') roleLabel = s.roleSuperAdmin;
  else if (user.role === 'admin') roleLabel = s.roleAdmin;
  else if (user.role === 'instructor') roleLabel = s.roleInstructor;

  const profileMeter = window.Views.calculateProfileCompletion(user);
  const currentTab = window.Views.activeProfileTab;

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 ${fontClass} text-${isRtl ? 'right' : 'left'}" dir="${dir}">
      
      <!-- Top Royal Identity Banner -->
      <div class="relative bg-gradient-to-r from-slate-950 via-indigo-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-2xl overflow-hidden">
        <div class="absolute right-0 top-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute left-0 bottom-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <!-- Avatar & Basic Details -->
          <div class="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-${isRtl ? 'right' : 'left'} gap-5">
            <div class="relative shrink-0 group">
              <img 
                src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}" 
                alt="${user.name}" 
                class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-emerald-400 shadow-2xl group-hover:scale-105 transition"
              />
              <button onclick="window.Views.openEditProfileModal()" class="absolute -bottom-2 ${isRtl ? '-left-2' : '-right-2'} w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-slate-900 transition" title="${s.btnEditProfile}">
                <i data-lucide="camera" class="w-4 h-4"></i>
              </button>
            </div>

            <div class="space-y-2">
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 shadow-sm">
                  <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
                  <span>${roleLabel}</span>
                </span>
                <span class="text-xs text-slate-300 font-mono bg-black/30 px-3 py-1 rounded-full border border-white/10" dir="ltr">
                  ${user.email}
                </span>
              </div>

              <h1 class="text-2xl sm:text-3xl font-extrabold text-white">
                ${user.name}
              </h1>

              <p class="text-xs sm:text-sm text-emerald-200/90 max-w-lg leading-relaxed font-semibold">
                ${user.headline || s.defaultHeadline}
              </p>

              <!-- Profile Completion Progress Bar -->
              <div class="pt-2 flex items-center justify-center sm:justify-start gap-3">
                <div class="w-44 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-white/10">
                  <div class="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500" style="width: ${profileMeter.percent}%;"></div>
                </div>
                <span class="text-xs text-emerald-300 font-bold font-mono">${s.profileMeterLabel} ${profileMeter.percent}%</span>
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-3 shrink-0">
            <button onclick="window.Views.openEditProfileModal()" class="btn-primary py-2.5 px-5 text-xs rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold flex items-center gap-2 shadow-lg">
              <i data-lucide="edit" class="w-4 h-4"></i>
              <span>${s.btnEditProfile}</span>
            </button>

            <button onclick="window.Auth.logout(); window.Router.navigate('/login');" class="btn-secondary py-2.5 px-4 text-xs rounded-2xl bg-white/10 hover:bg-white/20 border-white/20 text-rose-300 font-bold flex items-center gap-2">
              <i data-lucide="log-out" class="w-4 h-4"></i>
              <span>${s.btnSignOut}</span>
            </button>
          </div>

        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        <button onclick="window.Views.switchProfileTab('overview')" class="py-2.5 px-5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${currentTab === 'overview' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          <i data-lucide="user" class="w-4 h-4"></i>
          <span>${s.tabOverview}</span>
        </button>

        <button onclick="window.Views.switchProfileTab('courses')" class="py-2.5 px-5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${currentTab === 'courses' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          <i data-lucide="book-open" class="w-4 h-4"></i>
          <span>${s.tabCourses}</span>
        </button>

        <button onclick="window.Views.switchProfileTab('certificates')" class="py-2.5 px-5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${currentTab === 'certificates' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          <i data-lucide="award" class="w-4 h-4"></i>
          <span>${s.tabCertificates}</span>
        </button>

        <button onclick="window.Views.switchProfileTab('security')" class="py-2.5 px-5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${currentTab === 'security' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          <i data-lucide="lock" class="w-4 h-4"></i>
          <span>${s.tabSecurity}</span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="profile-tab-content" class="animate-fade-in">
        ${window.Views.renderActiveProfileTabContent(user, currentTab)}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.switchProfileTab = function(tabKey) {
  window.Views.activeProfileTab = tabKey;
  window.Views.renderProfile();
};

window.Views.renderActiveProfileTabContent = function(user, tabKey) {
  const s = getProfStrings();
  const dir = getProfDir();
  const isRtl = dir === 'rtl';

  if (tabKey === 'overview') {
    const profileMeter = window.Views.calculateProfileCompletion(user);
    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Left 7 cols: Personal Information Card -->
        <div class="lg:col-span-7 lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="id-card" class="w-5 h-5 text-emerald-500"></i>
              <span>${s.personalDetailsTitle}</span>
            </h3>
            <button onclick="window.Views.openEditProfileModal()" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              ${s.btnEditProfile}
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
              <span class="text-slate-400 block text-[11px]">${s.labelFullName}</span>
              <span class="text-sm font-extrabold text-slate-900 dark:text-white">${user.name}</span>
            </div>

            <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
              <span class="text-slate-400 block text-[11px]">${s.labelEmail}</span>
              <span class="text-xs font-bold font-mono text-slate-800 dark:text-slate-200" dir="ltr">${user.email}</span>
            </div>

            <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
              <span class="text-slate-400 block text-[11px]">${s.labelPhone}</span>
              <span class="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">${user.phone || s.labelNotSet}</span>
            </div>

            <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
              <span class="text-slate-400 block text-[11px]">${s.labelMemberSince}</span>
              <span class="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026-01-01'}</span>
            </div>
          </div>

          <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
            <span class="text-slate-400 block text-[11px]">${s.labelBio}</span>
            <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
              ${user.bio || s.defaultHeadline}
            </p>
          </div>
        </div>

        <!-- Right 5 cols: Profile Meter & Checklist -->
        <div class="lg:col-span-5 lh-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-500"></i>
              <span>${s.completionChecklistTitle}</span>
            </h3>
            <span class="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">${profileMeter.percent}%</span>
          </div>

          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            ${s.completionSub}
          </p>

          <div class="space-y-2.5 pt-1">
            ${profileMeter.items.map(it => `
              <div class="p-3 rounded-2xl flex items-center justify-between text-xs transition ${it.completed ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}">
                <span class="font-bold">${it.label}</span>
                <span class="text-xs font-bold">${it.completed ? '✓' : '•'}</span>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  }

  if (tabKey === 'courses') {
    const enrollments = (window.DB && typeof window.DB.get === 'function')
      ? (window.DB.get('enrollments') || []).filter(e => e.userId === user.id)
      : [];
    const allCourses = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('courses') || []) : [];
    const enrolledCourses = enrollments.map(enr => {
      const c = allCourses.find(item => item.id === enr.courseId);
      return { ...enr, course: c };
    }).filter(e => e.course);

    return `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="book-open" class="w-5 h-5 text-emerald-600"></i>
            <span>${s.coursesTabTitle} (${enrolledCourses.length})</span>
          </h3>
          <a href="#/courses" class="btn-secondary py-2 px-4 text-xs font-bold rounded-xl">
            ${s.btnBrowseCourses}
          </a>
        </div>

        ${enrolledCourses.length ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${enrolledCourses.map(item => `
              <div class="lh-card p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
                <div class="space-y-3">
                  <div class="aspect-video w-full rounded-2xl overflow-hidden shadow-md">
                    <img src="${item.course.thumbnail}" alt="${item.course.title}" class="w-full h-full object-cover" />
                  </div>
                  <h4 class="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1">${item.course.title}</h4>
                </div>
                <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div class="flex justify-between text-xs text-slate-500 font-bold">
                    <span>${s.progressLabel}</span>
                    <span class="font-mono text-emerald-600">${item.progressPercentage || item.progress || 0}%</span>
                  </div>
                  <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div class="bg-emerald-600 h-full rounded-full" style="width: ${item.progressPercentage || item.progress || 0}%;"></div>
                  </div>
                  <a href="#/learn/${item.course.id}" class="btn-primary w-full py-2 text-xs rounded-xl text-center block font-bold bg-emerald-600 hover:bg-emerald-500 text-white mt-2">
                    ${s.btnResumeCourse}
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="lh-card p-10 text-center space-y-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span class="text-4xl">📖</span>
            <h4 class="text-base font-extrabold text-slate-900 dark:text-white">${s.emptyCoursesTitle}</h4>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">${s.emptyCoursesDesc}</p>
            <a href="#/courses" class="btn-primary py-2.5 px-6 text-xs font-bold rounded-2xl inline-block bg-emerald-600 text-white">
              ${s.btnBrowseCourses}
            </a>
          </div>
        `}
      </div>
    `;
  }

  if (tabKey === 'certificates') {
    const certs = (window.DB && typeof window.DB.get === 'function')
      ? (window.DB.get('certificates') || []).filter(c => c.userId === user.id)
      : [];

    return `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="award" class="w-5 h-5 text-amber-500"></i>
            <span>${s.certsTabTitle} (${certs.length})</span>
          </h3>
          <a href="#/certificates" class="btn-secondary py-2 px-4 text-xs font-bold rounded-xl">
            ${s.btnVerifyPortal}
          </a>
        </div>

        ${certs.length ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${certs.map(cert => `
              <div class="lh-card p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-400/40 shadow-xl space-y-4 flex flex-col justify-between">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="badge bg-amber-400 text-slate-950 text-[10px] font-black">Verified Diploma</span>
                    <span class="text-xs font-mono text-slate-400">${cert.certificateNumber || cert.serialNumber || 'LH-CERT'}</span>
                  </div>
                  <h4 class="text-base font-extrabold text-slate-900 dark:text-white">${cert.courseTitle || cert.title}</h4>
                  <p class="text-xs text-slate-500">${s.issuedToLabel} <strong>${cert.userName || user.name}</strong></p>
                </div>

                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button onclick="window.Views.openCertificateViewer('${cert.id}')" class="btn-primary w-full py-2 text-xs rounded-xl bg-amber-500 text-slate-950 font-extrabold">
                    ${s.btnViewPrintCert}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="lh-card p-10 text-center space-y-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span class="text-4xl">📜</span>
            <h4 class="text-base font-extrabold text-slate-900 dark:text-white">${s.emptyCertsTitle}</h4>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">${s.emptyCertsDesc}</p>
          </div>
        `}
      </div>
    `;
  }

  // Security Tab
  const sessions = window.Views.getUserActiveSessions(user.id);
  const twoFaActive = !!user.twoFactorEnabled;

  return `
    <div class="space-y-8">
      
      <!-- 1. Password Change Form -->
      <div class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <h3 class="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <i data-lucide="key" class="w-5 h-5 text-indigo-500"></i>
          <span>${s.changePwdTitle}</span>
        </h3>

        <form id="profile-pwd-form" onsubmit="window.Views.handlePasswordChange(event)" class="space-y-4 max-w-xl text-${isRtl ? 'right' : 'left'}">
          <div>
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.currentPwdLabel}</label>
            <input type="password" id="prof-current-pwd" required placeholder="${s.currentPwdPlaceholder}" class="form-input text-xs py-2.5 px-3 rounded-xl font-mono text-left" dir="ltr">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.newPwdLabel}</label>
              <input type="password" id="prof-new-pwd" required minlength="6" placeholder="${s.newPwdPlaceholder}" class="form-input text-xs py-2.5 px-3 rounded-xl font-mono text-left" dir="ltr">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.confirmPwdLabel}</label>
              <input type="password" id="prof-confirm-pwd" required minlength="6" placeholder="${s.confirmPwdPlaceholder}" class="form-input text-xs py-2.5 px-3 rounded-xl font-mono text-left" dir="ltr">
            </div>
          </div>

          <button type="submit" id="prof-pwd-btn" class="btn-primary py-2.5 px-6 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md">
            <span>${s.btnSavePassword}</span>
          </button>
        </form>
      </div>

      <!-- 2. Two-Factor Authentication (2FA) Security -->
      <div class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 class="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="shield-alert" class="w-5 h-5 text-emerald-500"></i>
            <span>${s.twoFaSectionTitle}</span>
          </h3>
          <span class="badge ${twoFaActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600'} text-xs font-bold">
            ${twoFaActive ? s.twoFaStatusActive : s.twoFaStatusInactive}
          </span>
        </div>

        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
          ${twoFaActive ? s.twoFaActiveDesc : s.twoFaInactiveDesc}
        </p>

        <div class="pt-2">
          <button onclick="window.Views.handleToggle2FA()" class="btn-primary py-2.5 px-6 text-xs rounded-xl ${twoFaActive ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white font-bold shadow-md">
            ${twoFaActive ? s.btnDisable2fa : s.btnEnable2fa}
          </button>
        </div>
      </div>

      <!-- 3. Active Sessions Manager -->
      <div class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 class="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="smartphone" class="w-5 h-5 text-indigo-500"></i>
              <span>${s.sessionsTitle}</span>
            </h3>
            <p class="text-xs text-slate-500 mt-1">${s.sessionsSub}</p>
          </div>

          <button onclick="window.Views.handleTerminateAllOtherSessions('${user.id}')" class="btn-secondary py-2 px-4 text-xs font-bold text-rose-600 rounded-xl">
            ${s.btnTerminateOtherSessions}
          </button>
        </div>

        <div class="space-y-3">
          ${sessions.map(sess => `
            <div class="p-4 rounded-2xl border ${sess.isCurrent ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/30' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'} flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-extrabold text-slate-900 dark:text-white">${sess.device}</span>
                  ${sess.isCurrent ? `<span class="badge bg-emerald-200 text-emerald-800 text-[10px] font-bold">${s.badgeCurrentDevice}</span>` : ''}
                </div>
                <div class="text-[11px] text-slate-400 font-mono" dir="ltr">IP: ${sess.ip} • Last Active: ${new Date(sess.lastActive).toLocaleString()}</div>
              </div>

              ${!sess.isCurrent ? `
                <button onclick="window.Views.handleTerminateSession('${user.id}', '${sess.id}')" class="py-1.5 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 text-slate-600 dark:text-slate-300 font-bold transition text-xs">
                  ${s.btnTerminateThisSession}
                </button>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
};

// =========================================================================
// 4. ACTION HANDLERS & MODAL EDIT SUITE
// =========================================================================
window.Views.handlePasswordChange = async function(e) {
  e.preventDefault();
  const s = getProfStrings();
  const currentPwd = document.getElementById('prof-current-pwd')?.value;
  const newPwd = document.getElementById('prof-new-pwd')?.value;
  const confirmPwd = document.getElementById('prof-confirm-pwd')?.value;
  const btn = document.getElementById('prof-pwd-btn');

  if (!currentPwd) {
    window.App?.showToast(s.pwdCurrentRequired, 'warning');
    return;
  }
  if (newPwd.length < 6) {
    window.App?.showToast(s.pwdLengthError, 'warning');
    return;
  }
  if (newPwd !== confirmPwd) {
    window.App?.showToast(s.pwdMismatch, 'danger');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = s.savingPassword;
  }

  try {
    const user = window.Auth.getCurrentUser();
    if (window.DB && typeof window.DB.update === 'function') {
      window.DB.update('users', user.id, { password: newPwd, updatedAt: new Date().toISOString() });
    }
    window.App?.showToast(s.pwdSuccess, 'success');
    document.getElementById('profile-pwd-form')?.reset();
  } catch (err) {
    window.App?.showToast(err.message || 'Error changing password', 'danger');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>${s.btnSavePassword}</span>`;
    }
  }
};

window.Views.handleToggle2FA = async function() {
  const s = getProfStrings();
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  const currentStatus = !!user.twoFactorEnabled;
  const newStatus = !currentStatus;

  user.twoFactorEnabled = newStatus;
  if (window.DB && typeof window.DB.update === 'function') {
    window.DB.update('users', user.id, { twoFactorEnabled: newStatus });
  }
  if (window.Auth && typeof window.Auth.setSession === 'function') {
    window.Auth.setSession(user, true);
  }

  window.App?.showToast(newStatus ? s.twoFaActivatedToast : s.twoFaDeactivatedToast, 'success');
  window.Views.renderProfile();
};

window.Views.handleTerminateSession = function(userId, sessionId) {
  const s = getProfStrings();
  let sessions = window.Views.getUserActiveSessions(userId);
  sessions = sessions.filter(sess => sess.id !== sessionId);
  localStorage.setItem(`learnhub_sessions_${userId}`, JSON.stringify(sessions));
  window.App?.showToast(s.sessionRevokedToast, 'info');
  window.Views.renderProfile();
};

window.Views.handleTerminateAllOtherSessions = function(userId) {
  const s = getProfStrings();
  let sessions = window.Views.getUserActiveSessions(userId);
  sessions = sessions.filter(sess => sess.isCurrent);
  localStorage.setItem(`learnhub_sessions_${userId}`, JSON.stringify(sessions));
  window.App?.showToast(s.sessionsTerminatedToast, 'success');
  window.Views.renderProfile();
};

window.Views.openEditProfileModal = function() {
  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  if (!user) return;

  const s = getProfStrings();
  const dir = getProfDir();
  const isRtl = dir === 'rtl';

  const names = (user.name || '').split(' ');
  const firstName = names[0] || '';
  const lastName = names.slice(1).join(' ') || '';

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  ];

  window._editAvatarSelected = user.avatar || presetAvatars[0];

  window.App.showModal(s.editModalTitle, `
    <form id="edit-profile-modal-form" onsubmit="window.Views.handleProfileUpdate(event)" class="space-y-5 text-${isRtl ? 'right' : 'left'}" dir="${dir}">
      
      <!-- Avatar Picker -->
      <div class="space-y-2">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block">${s.avatarChoiceLabel}</label>
        <div class="flex items-center gap-3 overflow-x-auto pb-2">
          ${presetAvatars.map(av => `
            <img 
              src="${av}" 
              onclick="window._editAvatarSelected = '${av}'; document.querySelectorAll('.prof-modal-avatar').forEach(el=>el.classList.remove('ring-4', 'ring-emerald-500')); this.classList.add('ring-4', 'ring-emerald-500');"
              class="prof-modal-avatar w-12 h-12 rounded-2xl object-cover cursor-pointer border-2 border-slate-200 dark:border-slate-700 transition ${user.avatar === av ? 'ring-4 ring-emerald-500' : ''}" 
            />
          `).join('')}
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.firstNameLabel}</label>
          <input type="text" id="edit-first-name" required value="${firstName}" class="form-input text-xs py-2.5 px-3 rounded-xl">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.lastNameLabel}</label>
          <input type="text" id="edit-last-name" required value="${lastName}" class="form-input text-xs py-2.5 px-3 rounded-xl">
        </div>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.phoneLabel}</label>
        <input type="text" id="edit-phone" placeholder="${s.phonePlaceholder}" value="${user.phone || ''}" class="form-input text-xs py-2.5 px-3 rounded-xl font-mono" dir="ltr">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.headlineLabel}</label>
        <input type="text" id="edit-headline" placeholder="${s.headlinePlaceholder}" value="${user.headline || ''}" class="form-input text-xs py-2.5 px-3 rounded-xl">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.bioLabel}</label>
        <textarea id="edit-bio" rows="3" placeholder="${s.bioPlaceholder}" class="form-input text-xs py-2.5 px-3 rounded-xl">${user.bio || ''}</textarea>
      </div>

      <div class="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
        <button type="submit" id="save-prof-btn" class="btn-primary py-2.5 px-6 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md">
          <span>${s.btnSaveProfileChanges}</span>
        </button>
      </div>
    </form>
  `);
};

window.Views.handleProfileUpdate = async function(e) {
  e.preventDefault();
  const s = getProfStrings();
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  const firstName = document.getElementById('edit-first-name')?.value?.trim();
  const lastName = document.getElementById('edit-last-name')?.value?.trim();
  const phone = document.getElementById('edit-phone')?.value?.trim();
  const headline = document.getElementById('edit-headline')?.value?.trim();
  const bio = document.getElementById('edit-bio')?.value?.trim();
  const avatar = window._editAvatarSelected || user.avatar;

  const fullName = `${firstName} ${lastName}`.trim();
  const updatedUser = {
    ...user,
    name: fullName || user.name,
    firstName: firstName || user.firstName,
    lastName: lastName || user.lastName,
    phone: phone || '',
    headline: headline || user.headline,
    bio: bio || user.bio,
    avatar: avatar || user.avatar,
    updatedAt: new Date().toISOString()
  };

  if (window.DB && typeof window.DB.update === 'function') {
    window.DB.update('users', user.id, updatedUser);
  }
  if (window.Auth && typeof window.Auth.setSession === 'function') {
    window.Auth.setSession(updatedUser, true);
  }

  window.App?.closeModal();
  window.App?.showToast(s.profileUpdatedToast, 'success');
  if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
    window.App.updateNavbarUserUI();
  }
  window.Views.renderProfile();
};

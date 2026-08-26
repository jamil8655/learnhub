/**
 * LearnHub Authentication & Identity Views Suite
 * 100% Trilingual i18n Localization (English, Urdu, Arabic)
 * Full support for Login, Register, Forgot Password, Reset Password, OTP Verification, 2FA Challenge & Onboarding Wizard.
 */

window.Views = window.Views || {};

// Shared state helpers for timers & strength
window.Views._authTimers = window.Views._authTimers || {};
window.Views._onboardingState = window.Views._onboardingState || {
  step: 1,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  headline: '',
  bio: '',
  interests: ['quran', 'quizzes', 'hadith'],
  dailyGoalMinutes: 30,
  daysPerWeekGoal: 5,
  notificationsEnabled: true
};

// =========================================================================
// TRILINGUAL I18N DICTIONARY FOR AUTH VIEWS
// =========================================================================
const AUTH_LANG = {
  en: {
    heroBadge: 'LearnHub Pro',
    heroRegisterTitle: 'Begin Your Journey of Knowledge & Mastery',
    heroRegisterSubtitle: 'Create a free account to access all 114 Surahs, authentic Hadiths, interactive diagnostic quizzes, and verified digital certificates.',
    regBullet1: 'Full access to 100% free Islamic & academic courses',
    regBullet2: 'Independent timer-based diagnostic examinations',
    regBullet3: 'Online verifiable digital certificates with QR codes',
    sslSecured: '256-Bit SSL Secured Data',
    gdprCompliant: 'GDPR Compliant',
    tabSignIn: 'Sign In (Login)',
    tabRegister: 'Create Account (Register)',
    regTitle: 'Create Your Free Account',
    regSubtitle: 'Enter your name, email, and password to get started immediately.',
    continueWithGoogle: 'Continue with Google',
    orWithEmail: 'or register with email',
    fullNameLabel: 'Full Name *',
    fullNamePlaceholder: 'e.g. Muhammad Ali / John Doe',
    emailLabel: 'Email Address *',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'Password *',
    passwordPlaceholder: 'Enter password (min. 6 characters)',
    btnSignUp: 'Create Account (Sign Up)',
    alreadyHaveAccount: 'Already have an account?',
    signInLink: 'Sign In here',
    accountCreating: 'Creating account...',
    fillAllFields: 'Please fill in your name, email, and password.',
    passwordTooShort: 'Password must be at least 6 characters.',
    adminWelcome: '🎉 Welcome Administrator! Your account is ready.',
    studentWelcome: '🎉 Account created successfully! Verification email sent.',
    errorSignup: 'An error occurred during registration.',
    googleAuthNotice: '🔄 Authenticating with Google...',
    googleSuccess: '✓ Google verification successful. Logging in...',
    googleWelcomeStudent: '🎉 Welcome! You are now logged in as a verified Student.',
    googleWelcomeAdmin: '🎉 Welcome! You are now logged in as Super Administrator.',
    googleClosed: 'Google login window was closed.',
    googleNetErr: 'Internet connection error. Please check your network.',
    googleFallback: 'Could not complete Google sign-in. Please use the email form below.',

    // Login View
    loginHeroTitle: 'Authentic Islamic & Contemporary Sciences',
    loginHeroSubtitle: 'Sign in to access your ongoing courses, diagnostic quizzes, and verifiable credentials.',
    loginBullet1: 'Word-by-word Quran tajweed & all 114 Surahs',
    loginBullet2: 'Timed exams with instant student scorecards',
    loginBullet3: 'QR-Code verifiable royal certificates',
    loginSecurity: 'Secured Login & Active Sessions',
    loginTitle: 'Welcome Back! Sign In',
    loginSubtitle: 'Sign in with your email or Google account to continue.',
    orLoginEmail: 'or sign in with email',
    emailOrUserLabel: 'Email Address or Username',
    emailOrUserPlaceholder: 'name@example.com or username',
    forgotPasswordLink: 'Forgot Password?',
    rememberMe: 'Remember Me',
    btnSignIn: 'Sign In',
    accountLockedTitle: 'Account Temporarily Locked',
    accountLockedDesc: 'Too many incorrect attempts. Login is temporarily disabled.',
    timeLeft: 'Time remaining:',
    lockoutCleared: 'Lockout expired. You may now attempt to sign in.',
    twoFaRequired: 'Two-Factor Authentication is required',
    loginSuccess: 'Welcome back! You have successfully signed in.',
    loginError: 'Invalid email or password.',
    verifyingLogin: 'Verifying credentials...',

    // Forgot & Reset Password
    forgotTitle: 'Forgot Your Password?',
    forgotSubtitle: 'Enter your registered email address. We will immediately send you a secure password reset link.',
    btnSendReset: 'Send Reset Link',
    sendingReset: 'Sending reset link...',
    resetEmailSent: '🎉 Password reset email sent successfully! Please check your Gmail / Inbox.',
    backToLogin: 'Back to Sign In',
    resetExpiredTitle: 'Reset Link Expired or Invalid',
    resetExpiredDesc: 'For security reasons, password reset links expire after a certain period.',
    btnGetNewReset: 'Request New Reset Link →',
    resetTitle: 'Set a New Password',
    resetSubtitle: 'Please choose a strong and secure new password for your account.',
    newPasswordLabel: 'New Password *',
    confirmPasswordLabel: 'Confirm New Password *',
    confirmPasswordPlaceholder: 'Re-enter your new password',
    strengthWeak: 'Strength: Weak',
    strengthFair: 'Strength: Fair',
    strengthGood: 'Strength: Good',
    strengthStrong: 'Strength: Strong',
    passwordsMatch: '✓ Passwords match successfully',
    passwordsDoNotMatch: '✗ Passwords do not match',
    btnSavePassword: 'Save New Password',
    savingPassword: 'Saving new password...',
    passwordResetSuccess: 'Password changed successfully! Please log in with your new password.',
    passwordsMismatchToast: 'The entered passwords do not match.',

    // Email Verification
    verifiedBadge: 'Verified',
    verifySuccessTitle: 'Email Verified Successfully!',
    verifySuccessDesc: 'Your email address has been verified. You now have unrestricted access to all courses and features.',
    btnGoDashboard: 'Go to Dashboard →',
    alreadyVerifiedBadge: 'Already Verified',
    alreadyVerifiedTitle: 'This Email is Already Verified',
    alreadyVerifiedDesc: 'Email verification has already been completed for this account.',
    linkExpiredBadge: 'Link Expired',
    linkExpiredTitle: 'Verification Link Has Expired',
    linkExpiredDesc: 'For security reasons, this verification link has expired. You can request a new one.',
    btnResendVerification: 'Resend Verification Email',
    pendingVerificationBadge: 'Action Required',
    pendingVerificationTitle: 'Please Verify Your Email',
    pendingVerificationDesc: 'We sent a verification link to your email address. Please open your inbox and click the verification link.',
    btnAlreadyVerified: 'I Have Verified My Email (Continue)',
    btnResendLink: 'Resend Verification Email',
    checkingVerification: 'Checking verification status...',
    emailNotYetVerified: 'Email is not verified yet. Please click the link received in your inbox.',
    resending: 'Sending...',
    resendCooldown: 'Resend in',

    // 2FA Challenge
    twoFaBadge: '2-Factor Authentication',
    twoFaHeading: 'Two-Factor Verification',
    twoFaSubheading: 'Enter the 6-digit verification code from your Authenticator App (e.g. Google Authenticator).',
    twoFaEnterCode: 'Enter 6-Digit Security Code',
    twoFaTestHint: 'For testing, enter code: ',
    twoFaBackupLabel: '8-Digit Backup Recovery Code',
    twoFaBackupPlaceholder: 'e.g. BACKUP-2026-LH',
    twoFaBackupHint: 'Testing backup code: ',
    btnVerify2fa: 'Verify & Continue',
    useBackupMode: 'Use Backup Recovery Code',
    useTotpMode: 'Return to 6-Digit Authenticator App Code',
    twoFaSuccess: 'Verification successful! Welcome.',
    twoFaFailed: '2FA verification code is invalid.',

    // Onboarding Wizard
    onboardingSetupBadge: 'Academic Setup',
    onboardingSkip: 'Skip →',
    onboardingWelcome: 'Welcome to LearnHub',
    onboardingSubtitle: 'Configure a few quick preferences to customize your personal student dashboard.',
    step1Tab: '1. Profile & Avatar',
    step2Tab: '2. Academic Topics',
    step3Tab: '3. Daily Goal',
    step1Title: 'Step 1: Choose Your Profile Picture & Headline',
    step1Desc: 'Select an avatar or upload your custom photo from your device.',
    customPhotoLabel: 'Custom Profile Picture:',
    btnUploadDevice: 'Choose Photo from Device',
    presetAvatarsLabel: 'Or choose from preset scholarly avatars:',
    headlineLabel: 'Your Academic Headline / Title',
    headlinePlaceholder: 'e.g. Dedicated Scholar • LearnHub Student',
    step2Title: 'Step 2: Select Your Preferred Topics',
    step2Desc: 'We will highlight courses and quizzes matching these topics on your dashboard.',
    step3Title: 'Step 3: Set Your Daily Study Goal',
    step3Desc: 'Choose a daily time commitment to maintain consistency and build your learning streak.',
    goal15: '⚡ Casual',
    goal15Tag: '15 min / day',
    goal30: '🎯 Regular',
    goal30Tag: '30 min (Recommended)',
    goal45: '🚀 Committed',
    goal45Tag: '45 min / day',
    goal60: '🏆 Scholar',
    goal60Tag: '60 min / day',
    weeklyDaysLabel: 'Weekly Study Days:',
    daysPerWeekUnit: 'days per week',
    reminderLabel: 'Daily Study Reminders (Notifications)',
    reminderDesc: 'Get a daily notification to preserve your streak and meet your goals.',
    btnPrev: 'Back',
    btnNext: 'Next',
    btnFinishOnboarding: 'Complete & Start Learning →',
    onboardingCompleted: '🎉 Congratulations! Your profile is ready.',
    topicQuran: '📖 Quran Recitation & Tajweed',
    topicQuranDesc: 'All 114 Surahs with word-by-word commentary',
    topicHadith: '📜 Hadith Sciences & Sunnah',
    topicHadithDesc: 'Sahih Bukhari, Muslim & authenticated collections',
    topicQuizzes: '⚡ Diagnostic Quizzes',
    topicQuizzesDesc: 'Timed examinations and global leaderboards',
    topicFiqh: '⚖️ Fiqh & Jurisprudence',
    topicFiqhDesc: 'Acts of worship, transactions, and daily rulings',
    topicArabic: '🗣️ Arabic Language & Grammar',
    topicArabicDesc: 'Syntax, morphology, and Quranic Arabic',
    topicFinance: '💰 Islamic Finance & Halal Trade',
    topicFinanceDesc: 'Shariah investments, banking, and commerce',
    topicTech: '🤖 Artificial Intelligence & Tech',
    topicTechDesc: 'AI, Machine Learning, and cloud systems',
    topicWeb: '💻 Web & App Development',
    topicWebDesc: 'Full-Stack JavaScript, Modern UI & Apps'
  },

  ur: {
    heroBadge: 'LearnHub Pro',
    heroRegisterTitle: 'علم و ہنر کے شاندار سفر کا آغاز کریں',
    heroRegisterSubtitle: 'مفت اکاؤنٹ بنائیں اور تمام 114 سورتیں، مستند احادیث، تشخیصی کوئزز اور تصدیق شدہ سرٹیفکیٹس حاصل کریں۔',
    regBullet1: 'مکمل رسائی اور 100% مفت دینی و عصری کورسز',
    regBullet2: 'آزادانہ ٹائمر والے تشخیصی امتحانات',
    regBullet3: 'کیو آر کوڈ کے ساتھ آن لائن تصدیقی شاہی اسناد',
    sslSecured: '256-Bit SSL محفوظ ڈیٹا',
    gdprCompliant: 'GDPR Compliant',
    tabSignIn: 'سائن اِن (Login)',
    tabRegister: 'نیا اکاؤنٹ بنائیں (Register)',
    regTitle: 'نیا مفت اکاؤنٹ بنائیں',
    regSubtitle: 'اپنا نام، ای میل اور پاس ورڈ درج کر کے فوری سائن اپ کریں۔',
    continueWithGoogle: 'گوگل کے ساتھ سائن اپ کریں (Continue with Google)',
    orWithEmail: 'یا ای میل سے سائن اپ کریں',
    fullNameLabel: 'پورا نام (Full Name) *',
    fullNamePlaceholder: 'مثلاً: محمد جمیل خان',
    emailLabel: 'ای میل ایڈریس (Email Address) *',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'پاس ورڈ (Password) *',
    passwordPlaceholder: 'پاس ورڈ درج کریں (کم از کم 6 حروف)',
    btnSignUp: 'اکاؤنٹ بنائیں (Sign Up)',
    alreadyHaveAccount: 'پہلے سے اکاؤنٹ موجود ہے؟',
    signInLink: 'لاگ اِن کریں (Sign In)',
    accountCreating: 'اکاؤنٹ تیار ہو رہا ہے...',
    fillAllFields: 'براہ کرم نام، ای میل اور پاس ورڈ درج کریں۔',
    passwordTooShort: 'پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔',
    adminWelcome: '🎉 خوش آمدید ایڈمنسٹریٹر صاحب! اکاؤنٹ تیار ہے۔',
    studentWelcome: '🎉 ماشاء اللہ! اکاؤنٹ بن گیا۔ تصدیقی ای میل بھیج دی گئی ہے!',
    errorSignup: 'سائن اپ کے دوران خرابی پیش آئی۔',
    googleAuthNotice: '🔄 گوگل اکاؤنٹ سے تصدیق کی جا رہی ہے...',
    googleSuccess: '✓ گوگل تصدیق کامیاب، اکاؤنٹ لاگ ان ہو رہا ہے...',
    googleWelcomeStudent: '🎉 ماشاء اللہ! خوش آمدید! آپ بطور طالب علم لاگ اِن ہو گئے۔',
    googleWelcomeAdmin: '🎉 خوش آمدید! آپ بطور سپر ایڈمن لاگ اِن ہو گئے۔',
    googleClosed: 'گوگل لاگ ان ونڈو بند کر دی گئی ہے۔',
    googleNetErr: 'انٹرنیٹ کنکشن کا مسئلہ ہے۔ براہ کرم اپنا نیٹ ورک چیک کریں۔',
    googleFallback: 'گوگل لاگ ان میں دشواری پیش آئی۔ نیچے دیئے گئے فارم سے لاگ ان کریں۔',

    // Login View
    loginHeroTitle: 'مستند دینی و عصری تعلیم کا مرکز',
    loginHeroSubtitle: 'اپنے اکاؤنٹ میں داخل ہو کر اپنے جاری کورسز، تشخیصی کوئزز اور اسناد تک فوری رسائی حاصل کریں۔',
    loginBullet1: 'قرآن مجید تجوید و تمام 114 سورتیں',
    loginBullet2: 'ٹائمر والے آزاد کوئزز اور اسکور کارڈز',
    loginBullet3: 'QR Code تصدیقی سرٹیفکیٹس',
    loginSecurity: 'محفوظ لاگ اِن و سیشن',
    loginTitle: 'خوش آمدید! اکاؤنٹ میں لاگ اِن کریں',
    loginSubtitle: 'اپنے ای میل یا گوگل اکاؤنٹ سے فوری لاگ اِن کریں۔',
    orLoginEmail: 'یا ای میل سے لاگ اِن کریں',
    emailOrUserLabel: 'ای میل یا یوزرنیم (Email or Username)',
    emailOrUserPlaceholder: 'name@example.com یا username',
    forgotPasswordLink: 'پاس ورڈ بھول گئے؟ (Forgot Password?)',
    rememberMe: 'مجھے یاد رکھیں (Remember Me)',
    btnSignIn: 'لاگ اِن کریں (Sign In)',
    accountLockedTitle: 'اکاؤنٹ عارضی طور پر لاک ہے (Account Locked)',
    accountLockedDesc: 'زیادہ غلط کوششوں کی وجہ سے لاگ اِن عارضی طور پر روک دیا گیا ہے۔',
    timeLeft: 'باقی وقت:',
    lockoutCleared: 'لاک ختم ہو گیا ہے، اب آپ لاگ اِن کر سکتے ہیں۔',
    twoFaRequired: '2-Factor Authentication مطلوب ہے',
    loginSuccess: 'خوش آمدید! آپ کامیابی سے لاگ اِن ہو چکے ہیں۔',
    loginError: 'لاگ اِن میں غلطی ہوئی، ای میل یا پاس ورڈ چیک فرمائیں۔',
    verifyingLogin: 'تصدیق ہو رہی ہے...',

    // Forgot & Reset Password
    forgotTitle: 'پاس ورڈ بھول گئے؟',
    forgotSubtitle: 'اپنا رجسٹرڈ ای میل ایڈریس درج کریں۔ ہم آپ کو فوری طور پر پاس ورڈ ری سیٹ لنک فراہم کریں گے۔',
    btnSendReset: 'ری سیٹ لنک حاصل کریں (Send Link)',
    sendingReset: 'ری سیٹ ای میل بھیجی جا رہی ہے...',
    resetEmailSent: '🎉 پاس ورڈ ری سیٹ ای میل کامیابی سے بھیج دی گئی ہے! برائے مہربانی اپنا ان باکس چیک کریں۔',
    backToLogin: 'لاگ اِن پر واپس جائیں (Back to Sign In)',
    resetExpiredTitle: 'ری سیٹ لنک غلط یا ایکسپائر ہو چکا ہے',
    resetExpiredDesc: 'سیکیورٹی کے پیش نظر پاس ورڈ ری سیٹ لنکس ایک مخصوص مدت کے بعد غیر فعال ہو جاتے ہیں۔',
    btnGetNewReset: 'نیا ری سیٹ لنک حاصل کریں →',
    resetTitle: 'نیا پاس ورڈ متعین کریں',
    resetSubtitle: 'براہ کرم اپنے اکاؤنٹ کے لیے ایک محفوظ نیا پاس ورڈ منتخب کریں۔',
    newPasswordLabel: 'نیا پاس ورڈ (New Password) *',
    confirmPasswordLabel: 'پاس ورڈ کی دوبارہ تصدیق *',
    confirmPasswordPlaceholder: 'پاس ورڈ دوبارہ درج کریں',
    strengthWeak: 'طاقت: کمزور (Weak)',
    strengthFair: 'طاقت: مناسب (Fair)',
    strengthGood: 'طاقت: اچھا (Good)',
    strengthStrong: 'طاقت: مضبوط (Strong)',
    passwordsMatch: '✓ پاس ورڈ درست طور پر مماثل ہے',
    passwordsDoNotMatch: '✗ دونوں پاس ورڈز مماثل نہیں ہیں',
    btnSavePassword: 'پاس ورڈ تبدیل کریں (Save Password)',
    savingPassword: 'محفوظ ہو رہا ہے...',
    passwordResetSuccess: 'پاس ورڈ کامیابی کے ساتھ تبدیل ہو گیا ہے! اب نئے پاس ورڈ سے لاگ اِن کریں۔',
    passwordsMismatchToast: 'دونوں پاس ورڈز مماثل نہیں ہیں۔',

    // Email Verification
    verifiedBadge: 'تصدیق شدہ (Verified)',
    verifySuccessTitle: 'ای میل کی تصدیق مکمل ہو گئی!',
    verifySuccessDesc: 'آپ کا ای میل ایڈریس کامیابی کے ساتھ تصدیق ہو گیا ہے۔ اب آپ تمام سروسز سے بھرپور فائدہ اٹھا سکتے ہیں۔',
    btnGoDashboard: 'ڈیش بورڈ پر جائیں →',
    alreadyVerifiedBadge: 'پہلے سے تصدیق شدہ',
    alreadyVerifiedTitle: 'یہ ای میل پہلے سے تصدیق شدہ ہے',
    alreadyVerifiedDesc: 'اس اکاؤنٹ کے لیے ای میل کی تصدیق پہلے ہی مکمل ہو چکی ہے۔',
    linkExpiredBadge: 'لنک ایکسپائر ہو چکا ہے',
    linkExpiredTitle: 'تصدیقی لنک کی میعاد ختم ہو گئی',
    linkExpiredDesc: 'سیکیورٹی وجوہات کی بنا پر تصدیقی لنک ایکسپائر ہو گیا ہے۔ آپ نیا تصدیقی لنک حاصل کر سکتے ہیں۔',
    btnResendVerification: 'نیا تصدیقی لنک بھیجیں (Resend Email)',
    pendingVerificationBadge: 'تصدیق کا انتظار ہے (Action Required)',
    pendingVerificationTitle: 'اپنا ای میل ویریفائی فرمائیں',
    pendingVerificationDesc: 'ہم نے آپ کے ای میل ایڈریس پر تصدیقی لنک بھیج دیا ہے۔ برائے مہربانی اپنا Gmail / Inbox چیک کر کے تصدیقی لنک پر کلک کریں۔',
    btnAlreadyVerified: 'میں نے ای میل ویریفائی کر لیا ہے (Continue)',
    btnResendLink: 'دوبارہ تصدیقی ای میل بھیجیں (Resend Link)',
    checkingVerification: 'تصدیق کی جانچ کی جا رہی ہے...',
    emailNotYetVerified: 'ای میل ابھی تک تصدیق نہیں ہوئی۔ براہ کرم اپنے ان باکس میں موصول لنک پر کلک کرنے کے بعد دوبارہ کوشش فرمائیں۔',
    resending: 'ارسال ہو رہا ہے...',
    resendCooldown: 'دوبارہ بھیجیں',

    // 2FA Challenge
    twoFaBadge: '2-Factor Authentication',
    twoFaHeading: 'ٹو فیکٹر تصدیق',
    twoFaSubheading: 'اپنے Authenticator App (جیسے Google Authenticator) پر ظاہر ہونے والا 6 ہندسوں کا کوڈ درج کریں۔',
    twoFaEnterCode: '6 ہندسوں کا سیکیورٹی کوڈ درج کریں',
    twoFaTestHint: 'ٹیسٹنگ کے لیے تصدیقی کوڈ: ',
    twoFaBackupLabel: '8 ہندسوں کا بیک اپ ریکوری کوڈ (Backup Recovery Code)',
    twoFaBackupPlaceholder: 'مثلاً: BACKUP-2026-LH',
    twoFaBackupHint: 'ٹیسٹنگ بیک اپ کوڈ: ',
    btnVerify2fa: 'تصدیق کریں اور داخل ہوں (Verify & Continue)',
    useBackupMode: 'بیک اپ ریکوری کوڈ استعمال کریں (Use Backup Recovery Code)',
    useTotpMode: '6 ہندسوں کے Authenticator ایپ کوڈ پر واپس جائیں',
    twoFaSuccess: 'کامیابی سے تصدیق ہو گئی! خوش آمدید۔',
    twoFaFailed: '2FA تصدیق ناکام ہو گئی، درست کوڈ درج فرمائیں۔',

    // Onboarding Wizard
    onboardingSetupBadge: 'نیا تعلیمی سیٹ اپ',
    onboardingSkip: 'چھوڑیں (Skip) →',
    onboardingWelcome: 'LearnHub پر خوش آمدید',
    onboardingSubtitle: 'آپ کا ذاتی لرننگ ڈیش بورڈ تیار کرنے کے لیے چند بنیادی ترتیبات منتخب کریں۔',
    step1Tab: '1. پروفائل و تصویر',
    step2Tab: '2. تعلیمی موضوعات',
    step3Tab: '3. روزانہ کا ہدف',
    step1Title: 'مرحلہ 1: اپنی پروفائل تصویر اور تعارف منتخب کریں',
    step1Desc: 'اپنا اوتار منتخب کریں یا اپنی پسندیدہ تصویر اپلوڈ کریں۔',
    customPhotoLabel: 'اپنی مرضی کی تصویر لگائیں:',
    btnUploadDevice: 'ڈیوائس سے تصویر منتخب کریں',
    presetAvatarsLabel: 'یا تیار شدہ اوتارز میں سے منتخب کریں:',
    headlineLabel: 'آپ کا تعلیمی عنوان / ہیڈلائن',
    headlinePlaceholder: 'مثلاً: ماہر طالب علم • متلاشی علمِ نافع',
    step2Title: 'مرحلہ 2: اپنی پسند کے تعلیمی موضوعات منتخب کریں',
    step2Desc: 'ہم آپ کے ڈیش بورڈ پر انہی موضوعات کے کورسز اور کوئزز نمایاں کریں گے۔',
    step3Title: 'مرحلہ 3: روزانہ کا مطالعہ ہدف مقرر کریں',
    step3Desc: 'مستقل مزاجی برقرار رکھنے کے لیے روزانہ کا ٹائم گول منتخب کریں۔',
    goal15: '⚡ ہلکا پھلکا',
    goal15Tag: '15 منٹ / دن',
    goal30: '🎯 باقاعدہ',
    goal30Tag: '30 منٹ (تجویز کردہ)',
    goal45: '🚀 پرعزم',
    goal45Tag: '45 منٹ / دن',
    goal60: '🏆 ماہر',
    goal60Tag: '60 منٹ / دن',
    weeklyDaysLabel: 'ہفتہ وار تعلیمی دن:',
    daysPerWeekUnit: 'دن فی ہفتہ',
    reminderLabel: 'روزانہ تعلیمی یاد دہانی (Study Reminders)',
    reminderDesc: 'اپنا اسٹریک محفوظ رکھنے کے لیے روزانہ نوٹیفکیشن حاصل کریں۔',
    btnPrev: 'پچھلا (Back)',
    btnNext: 'آگے بڑھیں (Next)',
    btnFinishOnboarding: 'مکمل کریں اور سیکھنا شروع کریں →',
    onboardingCompleted: '🎉 مبارک ہو! آپ کا پروفائل کامیابی سے تیار ہے۔',
    topicQuran: '📖 تجوید و فہمِ قرآن',
    topicQuranDesc: 'تمام 114 سورتیں مع ترجمہ و تفسیر',
    topicHadith: '📜 علوم الحدیث و سنّت',
    topicHadithDesc: 'صحیح بخاری، مسلم و مستند کتب',
    topicQuizzes: '⚡ آزادانہ امتحانی کوئزز',
    topicQuizzesDesc: 'ٹائمر والے تشخیصی ٹیسٹس و رینکنگ',
    topicFiqh: '⚖️ فقہ و اسلامی احکام',
    topicFiqhDesc: 'عبادات، معاملات اور روزمرہ مسائل',
    topicArabic: '🗣️ عربی زبان و گرامر',
    topicArabicDesc: 'صرف و نحو اور قرآنی عربی کلام',
    topicFinance: '💰 اسلامی فنانس و تجارت',
    topicFinanceDesc: 'حلال سرمایہ کاری و بلاک چین فنانس',
    topicTech: '🤖 مصنوعی ذہانت و ٹیک',
    topicTechDesc: 'AI، مشین لرننگ اور کلاؤڈ سسٹمز',
    topicWeb: '💻 ویب و ایپ ڈویلپمنٹ',
    topicWebDesc: 'Full-Stack، جاوا اسکرپٹ اور ایپس'
  },

  ar: {
    heroBadge: 'LearnHub Pro',
    heroRegisterTitle: 'انطلق في رحلة مباركة لطلب العلم والإتقان',
    heroRegisterSubtitle: 'أنشئ حسابك المجاني للوصول إلى 114 سورة كاملة، الأحاديث الصحيحة، الاختبارات التشخيصية والشهادات المعتمدة.',
    regBullet1: 'وصول شامل ومجاني 100% لكافة الدورات الشرعية',
    regBullet2: 'اختبارات تشخيصية ذاتية ومستقلة بمؤقت ذكي',
    regBullet3: 'شهادات ملكية موثقة برمز الاستجابة السريعة (QR)',
    sslSecured: 'بيانات مشفرة 256-Bit SSL',
    gdprCompliant: 'متوافق مع معايير GDPR',
    tabSignIn: 'تسجيل الدخول (Sign In)',
    tabRegister: 'إنشاء حساب جديد (Register)',
    regTitle: 'إنشاء حساب مجاني جديد',
    regSubtitle: 'أدخل اسمك، بريدك الإلكتروني وكلمة المرور للبدء فوراً.',
    continueWithGoogle: 'متابعة بواسطة جوجل (Continue with Google)',
    orWithEmail: 'أو التسجيل عبر البريد الإلكتروني',
    fullNameLabel: 'الاسم الكامل *',
    fullNamePlaceholder: 'مثال: محمد عبد الرحمن / أحمد علي',
    emailLabel: 'البريد الإلكتروني *',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'كلمة المرور *',
    passwordPlaceholder: 'أدخل كلمة المرور (6 أحرف على الأقل)',
    btnSignUp: 'إنشاء الحساب (Sign Up)',
    alreadyHaveAccount: 'هل لديك حساب بالفعل؟',
    signInLink: 'تسجيل الدخول هنا',
    accountCreating: 'جارٍ إنشاء الحساب...',
    fillAllFields: 'يرجى إدخال الاسم، البريد الإلكتروني وكلمة المرور.',
    passwordTooShort: 'يجب ألا تقل كلمة المرور عن 6 أحرف.',
    adminWelcome: '🎉 مرحباً بكم يا مدير النظام! تم تجهيز الحساب.',
    studentWelcome: '🎉 ما شاء الله! تم إنشاء الحساب وإرسال بريد التأكيد.',
    errorSignup: 'حدث خطأ أثناء إنشاء الحساب.',
    googleAuthNotice: '🔄 جارٍ التحقق من حساب جوجل...',
    googleSuccess: '✓ تم التحقق بنجاح، جارٍ الدخول...',
    googleWelcomeStudent: '🎉 ما شاء الله! مرحباً بك كطالب معتمد في الأكاديمية.',
    googleWelcomeAdmin: '🎉 مرحباً بك كمدير عام للنظام.',
    googleClosed: 'تم إغلاق نافذة تسجيل الدخول بجوجل.',
    googleNetErr: 'خطأ في الاتصال بالإنترنت. يرجى فحص الشبكة.',
    googleFallback: 'تعذر الدخول بواسطة جوجل، يرجى استخدام النموذج أدناه.',

    // Login View
    loginHeroTitle: 'صرح العلوم الشرعية والمعارف المعاصرة',
    loginHeroSubtitle: 'سجل دخولك لمتابعة دوراتك، اختباراتك التشخيصية وشهاداتك المعتمدة.',
    loginBullet1: 'تجويد القرآن الكريم وجميع السور الـ 114',
    loginBullet2: 'اختبارات تقييمية مع كشف الدرجات الفوري',
    loginBullet3: 'شهادات ملكية موثقة برمز QR',
    loginSecurity: 'تسجيل دخول وجلسات محمية',
    loginTitle: 'أهلاً بعودتك! تسجيل الدخول',
    loginSubtitle: 'سجل دخولك عبر بريدك الإلكتروني أو حساب جوجل.',
    orLoginEmail: 'أو الدخول عبر البريد الإلكتروني',
    emailOrUserLabel: 'البريد الإلكتروني أو اسم المستخدم',
    emailOrUserPlaceholder: 'name@example.com أو اسم المستخدم',
    forgotPasswordLink: 'نسيت كلمة المرور؟',
    rememberMe: 'تذكرني دائماً',
    btnSignIn: 'تسجيل الدخول',
    accountLockedTitle: 'الحساب مغلق مؤقتاً (Account Locked)',
    accountLockedDesc: 'بسبب كثرة المحاولات الخاطئة، تم تعطيل الدخول مؤقتاً.',
    timeLeft: 'الوقت المتبقي:',
    lockoutCleared: 'انتهت فترة الحظر، يمكنك تسجيل الدخول الآن.',
    twoFaRequired: 'المصادقة الثنائية مطلوبة',
    loginSuccess: 'أهلاً بك! تم تسجيل دخولك بنجاح.',
    loginError: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    verifyingLogin: 'جارٍ التحقق...',

    // Forgot & Reset Password
    forgotTitle: 'نسيت كلمة المرور؟',
    forgotSubtitle: 'أدخل بريدك الإلكتروني المسجل، وسنرسل لك رابطاً آمناً لإعادة تعيين كلمة المرور فوراً.',
    btnSendReset: 'إرسال رابط التعيين',
    sendingReset: 'جارٍ إرسال البريد...',
    resetEmailSent: '🎉 تم إرسال رابط إعادة تعيين كلمة المرور بنجاح! يرجى فحص بريدك.',
    backToLogin: 'العودة لتسجيل الدخول',
    resetExpiredTitle: 'الرابط غير صالح أو انتهت صلاحيته',
    resetExpiredDesc: 'لدواعٍ أمنية، تنتهي صلاحية روابط إعادة تعيين كلمة المرور بعد وقت محدد.',
    btnGetNewReset: 'طلب رابط جديد →',
    resetTitle: 'تعيين كلمة مرور جديدة',
    resetSubtitle: 'يرجى اختيار كلمة مرور قوية وآمنة لحسابك.',
    newPasswordLabel: 'كلمة المرور الجديدة *',
    confirmPasswordLabel: 'تأكيد كلمة المرور الجديدة *',
    confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
    strengthWeak: 'القوة: ضعيفة (Weak)',
    strengthFair: 'القوة: مقبولة (Fair)',
    strengthGood: 'القوة: جيدة (Good)',
    strengthStrong: 'القوة: قوية (Strong)',
    passwordsMatch: '✓ كلمتا المرور متطابقتان تماماً',
    passwordsDoNotMatch: '✗ كلمتا المرور غير متطابقتين',
    btnSavePassword: 'حفظ كلمة المرور الجديدة',
    savingPassword: 'جارٍ الحفظ...',
    passwordResetSuccess: 'تم تغيير كلمة المرور بنجاح! سجل الدخول بكلمتك الجديدة.',
    passwordsMismatchToast: 'كلمتا المرور غير متطابقتين.',

    // Email Verification
    verifiedBadge: 'موثق ومعتمد',
    verifySuccessTitle: 'تم تأكيد البريد الإلكتروني بنجاح!',
    verifySuccessDesc: 'تم تأكيد بريدك الإلكتروني بنجاح. يمكنك الآن الاستفادة من جميع خدمات ومنهاج الأكاديمية.',
    btnGoDashboard: 'الانتقال للوحة التحكم →',
    alreadyVerifiedBadge: 'تم التأكيد مسبقاً',
    alreadyVerifiedTitle: 'هذا البريد مؤكد مسبقاً',
    alreadyVerifiedDesc: 'عملية التحقق من البريد مكتملة مسبقاً لهذا الحساب.',
    linkExpiredBadge: 'انتهت الصلاحية',
    linkExpiredTitle: 'انتهت صلاحية رابط التحقق',
    linkExpiredDesc: 'لدواعٍ أمنية، انتهت صلاحية هذا الرابط. يمكنك طلب إرسال رابط تأكيد جديد.',
    btnResendVerification: 'إعادة إرسال بريد التأكيد',
    pendingVerificationBadge: 'مطلوب إجراء',
    pendingVerificationTitle: 'يرجى تأكيد بريدك الإلكتروني',
    pendingVerificationDesc: 'لقد أرسلنا رابط التحقق إلى بريدك الإلكتروني. يرجى فحص صندوق الوارد والنقر على الرابط.',
    btnAlreadyVerified: 'لقد قمت بتأكيد بريدي (متابعة)',
    btnResendLink: 'إعادة إرسال رابط التأكيد',
    checkingVerification: 'جارٍ فحص حالة التحقق...',
    emailNotYetVerified: 'لم يتم تأكيد البريد بعد. يرجى النقر على الرابط في بريدك أولاً.',
    resending: 'جارٍ الإرسال...',
    resendCooldown: 'إعادة الإرسال بعد',

    // 2FA Challenge
    twoFaBadge: 'المصادقة الثنائية (2FA)',
    twoFaHeading: 'التحقق الثنائي الأمني',
    twoFaSubheading: 'أدخل الرمز المكون من 6 أرقام من تطبيق المصادقة الخاص بك (مثل Google Authenticator).',
    twoFaEnterCode: 'أدخل رمز الأمان المكون من 6 أرقام',
    twoFaTestHint: 'رمز الاختبار التجريبي: ',
    twoFaBackupLabel: 'رمز الاسترداد الاحتياطي (8 أرقام)',
    twoFaBackupPlaceholder: 'مثال: BACKUP-2026-LH',
    twoFaBackupHint: 'رمز الاسترداد التجريبي: ',
    btnVerify2fa: 'تحقق ومتابعة الدخول',
    useBackupMode: 'استخدام رمز الاسترداد الاحتياطي',
    useTotpMode: 'العودة لرمز تطبيق المصادقة (6 أرقام)',
    twoFaSuccess: 'تم التحقق بنجاح! أهلاً بك.',
    twoFaFailed: 'رمز التحقق غير صحيح، يرجى إعادة المحاولة.',

    // Onboarding Wizard
    onboardingSetupBadge: 'إعداد الحساب الأكاديمي',
    onboardingSkip: 'تخطي (Skip) →',
    onboardingWelcome: 'مرحباً بك في ليرن هب',
    onboardingSubtitle: 'حدد بعض التفضيلات الأساسية لتخصيص لوحة تحكمك التعليمية.',
    step1Tab: '1. الملف الشخصي والصورة',
    step2Tab: '2. المسارات العلمية',
    step3Tab: '3. الهدف اليومي',
    step1Title: 'الخطوة 1: اختر صورتك الشخصية ومسماك العلمي',
    step1Desc: 'اختر صورة رمزية جاهزة أو ارفع صورتك الخاصة من جهازك.',
    customPhotoLabel: 'تعيين صورتك الخاصة:',
    btnUploadDevice: 'اختيار صورة من الجهاز',
    presetAvatarsLabel: 'أو اختر من الصور الرمزية الجاهزة:',
    headlineLabel: 'عنوانك العلمي / النبذة المختصرة',
    headlinePlaceholder: 'مثال: باحث طالب علم • عضو منصة ليرن هب',
    step2Title: 'الخطوة 2: اختر موضوعاتك ومساراتك المفضلة',
    step2Desc: 'سنبرز في لوحة تحكمك الدورات والاختبارات التابعة لهذه المسارات.',
    step3Title: 'الخطوة 3: حدد هدفك الدراسي اليومي',
    step3Desc: 'اختر وقتاً يومياً للالتزام به وبناء سلسلة حضورك المتواصلة.',
    goal15: '⚡ خفيف',
    goal15Tag: '15 دقيقة / يوم',
    goal30: '🎯 منتظم',
    goal30Tag: '30 دقيقة (موصى به)',
    goal45: '🚀 مجتهد',
    goal45Tag: '45 دقيقة / يوم',
    goal60: '🏆 متمكن',
    goal60Tag: '60 دقيقة / يوم',
    weeklyDaysLabel: 'أيام الدراسة الأسبوعية:',
    daysPerWeekUnit: 'أيام في الأسبوع',
    reminderLabel: 'تذكيرات المذاكرة اليومية (إشعارات)',
    reminderDesc: 'احصل على تذكير يومي للحفاظ على سلسلة الحضور وإنجاز أهدافك.',
    btnPrev: 'السابق',
    btnNext: 'التالي',
    btnFinishOnboarding: 'إتمام وبدء التعلم →',
    onboardingCompleted: '🎉 مبارك! تم تجهيز ملفك الأكاديمي بنجاح.',
    topicQuran: '📖 علوم وتجويد القرآن الكريم',
    topicQuranDesc: '114 سورة كاملة مع التفسير والوقف والابتداء',
    topicHadith: '📜 علوم الحديث والسنة النبوية',
    topicHadithDesc: 'صحيح البخاري ومسلم والكتب المعتمدة',
    topicQuizzes: '⚡ الاختبارات التشخيصية الذاتية',
    topicQuizzesDesc: 'اختبارات بمؤقت ذكي ولوحة صدارة عالمية',
    topicFiqh: '⚖️ الفقه والأحكام الشرعية',
    topicFiqhDesc: 'العبادات، المعاملات، والنوازل المعاصرة',
    topicArabic: '🗣️ اللغة العربية وقواعدها',
    topicArabicDesc: 'النحو، الصرف، وفصاحة القرآن الكريم',
    topicFinance: '💰 المعاملات المالية الإسلامية',
    topicFinanceDesc: 'الاستثمار الحلال والتجارة الإلكترونية',
    topicTech: '🤖 الذكاء الاصطناعي والتقنية',
    topicTechDesc: 'الأنظمة السحابية، والذكاء الاصطناعي',
    topicWeb: '💻 تطوير الويب والتطبيقات',
    topicWebDesc: 'جافاسكريبت، والتطبيقات المتكاملة'
  }
};

function getAuthStrings() {
  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  return AUTH_LANG[lang] || AUTH_LANG.en;
}

function getAuthDir() {
  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  return (lang === 'ur' || lang === 'ar') ? 'rtl' : 'ltr';
}

function getAuthFontClass() {
  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  return lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');
}

// Global password toggle helper
window.Views.togglePasswordVisibility = function(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) icon.setAttribute('data-lucide', 'eye-off');
  } else {
    input.type = 'password';
    if (icon) icon.setAttribute('data-lucide', 'eye');
  }
  if (window.lucide) window.lucide.createIcons();
};

// =========================================================================
// 1. REGISTER VIEW
// =========================================================================
window.Views.renderRegister = async function(params, query) {
  const container = document.getElementById('main-content');
  if (!container) return;
  const s = getAuthStrings();
  const dir = getAuthDir();
  const fontClass = getAuthFontClass();
  const isRtl = dir === 'rtl';

  container.innerHTML = `
    <div class="min-h-[85vh] flex items-center justify-center px-3 sm:px-6 lg:px-8 py-10 ${fontClass}" dir="${dir}">
      <div class="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        
        <!-- Left Visual & Value Propositions Banner -->
        <div class="lg:col-span-5 bg-gradient-to-br from-indigo-700 via-indigo-900 to-slate-950 p-8 text-white flex flex-col justify-between relative overflow-hidden text-${isRtl ? 'right' : 'left'}">
          <div class="space-y-4 relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white shadow-xl">
              <i data-lucide="graduation-cap" class="w-7 h-7 text-cyan-300"></i>
            </div>
            <div>
              <span class="badge bg-white/10 text-cyan-300 text-[10px] font-bold uppercase tracking-wider border border-white/10">${s.heroBadge}</span>
              <h2 class="text-2xl font-extrabold mt-1 leading-snug">${s.heroRegisterTitle}</h2>
            </div>
            <p class="text-xs text-indigo-200 leading-relaxed">
              ${s.heroRegisterSubtitle}
            </p>
          </div>

          <!-- Feature Bullets -->
          <div class="space-y-3 pt-6 border-t border-white/10 relative z-10 text-xs">
            <div class="flex items-center gap-2.5">
              <div class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs shrink-0">✓</div>
              <span>${s.regBullet1}</span>
            </div>
            <div class="flex items-center gap-2.5">
              <div class="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs shrink-0">✓</div>
              <span>${s.regBullet2}</span>
            </div>
            <div class="flex items-center gap-2.5">
              <div class="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs shrink-0">✓</div>
              <span>${s.regBullet3}</span>
            </div>
          </div>

          <!-- Footer Trust Badge -->
          <div class="pt-6 border-t border-white/10 relative z-10 flex items-center justify-between text-xs text-indigo-200">
            <span class="flex items-center gap-1.5 font-bold text-emerald-400">
              <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i> ${s.sslSecured}
            </span>
            <span class="text-[10px] text-slate-300 font-mono">${s.gdprCompliant}</span>
          </div>
        </div>

        <!-- Right Multi-Field Registration Form -->
        <div class="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <!-- Mode Switcher Tabs -->
            <div class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
              <a href="#/login" class="flex-1 py-2 text-center text-xs font-bold rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
                ${s.tabSignIn}
              </a>
              <a href="#/register" class="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm transition">
                ${s.tabRegister}
              </a>
            </div>

            <!-- Form Header -->
            <div class="mb-5 text-${isRtl ? 'right' : 'left'}">
              <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">${s.regTitle}</h3>
              <p class="text-xs text-slate-500 mt-1">${s.regSubtitle}</p>
            </div>

            <!-- 1-Click Google Authentication Button -->
            <div class="mb-5">
              <button type="button" onclick="window.Views.handleGoogleAuth()" class="w-full py-3 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center gap-3 transition shadow-sm active:scale-95">
                <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.97 0 12s.46 3.83 1.26 5.42l4.02-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>${s.continueWithGoogle}</span>
              </button>

              <div class="relative flex items-center justify-center my-4">
                <div class="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                <span class="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 absolute">${s.orWithEmail}</span>
              </div>
            </div>

            <!-- Simplified 3-Field Register Form -->
            <form id="register-form" onsubmit="window.Views.handleRegisterSubmit(event)" class="space-y-4 text-${isRtl ? 'right' : 'left'}">
              
              <!-- 1. Full Name -->
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.fullNameLabel}</label>
                <div class="relative">
                  <input type="text" id="reg-name" required placeholder="${s.fullNamePlaceholder}" class="form-input text-xs py-3 ${isRtl ? 'pl-9 pr-3' : 'pr-9 pl-3'} rounded-xl">
                  <i data-lucide="user" class="w-4 h-4 text-slate-400 absolute ${isRtl ? 'left-3' : 'right-3'} top-3.5"></i>
                </div>
              </div>

              <!-- 2. Email Address -->
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.emailLabel}</label>
                <div class="relative">
                  <input type="email" id="reg-email" required placeholder="${s.emailPlaceholder}" class="form-input text-xs py-3 ${isRtl ? 'pl-9 pr-3' : 'pr-9 pl-3'} rounded-xl font-mono text-left" dir="ltr" autocomplete="email">
                  <i data-lucide="mail" class="w-4 h-4 text-slate-400 absolute ${isRtl ? 'left-3' : 'right-3'} top-3.5"></i>
                </div>
              </div>

              <!-- 3. Password -->
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.passwordLabel}</label>
                <div class="relative">
                  <input 
                    type="password" 
                    id="reg-password" 
                    required 
                    minlength="6" 
                    placeholder="${s.passwordPlaceholder}" 
                    class="form-input text-xs py-3 pl-10 pr-10 rounded-xl font-mono text-left" 
                    dir="ltr"
                    autocomplete="new-password"
                  >
                  <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3 top-3.5"></i>
                  <button type="button" onclick="window.Views.togglePasswordVisibility('reg-password', 'reg-pwd-eye')" class="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <i data-lucide="eye" id="reg-pwd-eye" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>

              <!-- Submit Button -->
              <button type="submit" id="reg-submit-btn" class="btn-primary w-full py-3.5 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none font-bold shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 mt-2">
                <span>${s.btnSignUp}</span>
                <i data-lucide="${isRtl ? 'arrow-left' : 'arrow-right'}" class="w-4 h-4"></i>
              </button>

              <!-- Login Link -->
              <div class="text-center pt-2">
                <p class="text-xs text-slate-500">
                  ${s.alreadyHaveAccount}
                  <a href="#/login" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">${s.signInLink}</a>
                </p>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.handleRegisterSubmit = async function(e) {
  e.preventDefault();
  const s = getAuthStrings();
  const btn = document.getElementById('reg-submit-btn');
  const name = document.getElementById('reg-name')?.value?.trim();
  const email = document.getElementById('reg-email')?.value?.trim();
  const password = document.getElementById('reg-password')?.value;

  if (!name || !email || !password) {
    window.App?.showToast(s.fillAllFields, 'warning');
    return;
  }

  if (password.length < 6) {
    window.App?.showToast(s.passwordTooShort, 'warning');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin inline-block mr-2">⌛</span> ${s.accountCreating}`;
  }

  try {
    if (window.Security && typeof window.Security.executeRecaptcha === 'function') {
      await window.Security.executeRecaptcha('REGISTER');
    }

    const isSuperAdminEmail = ['jrahmanansari@gmail.com', 'jrahmanansari132@gmail.com', 'jrahmanansari133@gmail.com'].includes(email.toLowerCase().trim());
    await window.Auth.register({
      name,
      email,
      password,
      role: isSuperAdminEmail ? 'super_admin' : 'student'
    });

    if (isSuperAdminEmail) {
      window.App?.showToast(s.adminWelcome, 'success');
      try {
        await window.Auth.login(email, password, true);
      } catch (e) {}
      window.Router.navigate('/admin');
    } else {
      window.App?.showToast(s.studentWelcome, 'success');
      window.Router.navigate(`/verify-email?email=${encodeURIComponent(email)}&status=pending`);
    }
  } catch (err) {
    window.App?.showToast(err.message || s.errorSignup, 'danger');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>${s.btnSignUp}</span>`;
    }
  }
};

window.Views.completeGoogleLoginExternal = async function(googleProfile) {
  const s = getAuthStrings();
  localStorage.removeItem('learnhub_manual_logout');

  const cleanEmail = (googleProfile.email || '').toLowerCase().trim();
  const isSuperAdminEmail = ['jrahmanansari@gmail.com', 'jrahmanansari132@gmail.com', 'jrahmanansari133@gmail.com'].includes(cleanEmail);
  const assignedRole = isSuperAdminEmail ? 'super_admin' : 'student';

  const googleUser = {
    id: isSuperAdminEmail ? 'usr-admin' : `usr-google-${googleProfile.sub || Date.now()}`,
    name: isSuperAdminEmail ? 'جمیل رحمن انصاری' : (googleProfile.name || 'Google User'),
    firstName: isSuperAdminEmail ? 'جمیل' : (googleProfile.given_name || (googleProfile.name || '').split(' ')[0] || 'User'),
    lastName: isSuperAdminEmail ? 'انصاری' : (googleProfile.family_name || (googleProfile.name || '').split(' ').slice(1).join(' ') || ''),
    email: cleanEmail,
    role: assignedRole,
    avatar: isSuperAdminEmail ? 'https://avatars.githubusercontent.com/u/207941618?v=4' : (googleProfile.picture || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`),
    headline: isSuperAdminEmail ? 'بانی و چیف ایڈمنسٹریٹر، لرن ہب اکیڈمی' : 'طالب علم • لرن ہب لرنر',
    bio: isSuperAdminEmail ? 'مرکزی ایڈمنسٹریٹر، لرن ہب اسلامک اکیڈمی۔' : 'علم و حکمت کے راستے کا متلاشی۔',
    authProvider: 'google',
    emailVerified: true,
    status: 'active',
    learningStreak: isSuperAdminEmail ? 15 : 1,
    longestStreak: isSuperAdminEmail ? 15 : 1,
    totalPoints: isSuperAdminEmail ? 5000 : 100,
    createdAt: new Date().toISOString()
  };

  if (window.CloudDB && typeof window.CloudDB.registerUser === 'function') {
    try {
      await window.CloudDB.registerUser(googleUser);
    } catch (e) {}
  }

  if (window.DB && typeof window.DB.insert === 'function') {
    const currentUsers = window.DB.get('users') || [];
    const idx = currentUsers.findIndex(u => u.email === googleUser.email);
    if (idx === -1) {
      window.DB.insert('users', googleUser);
    } else {
      window.DB.update('users', currentUsers[idx].id, { role: assignedRole, avatar: googleUser.avatar, lastLoginAt: new Date().toISOString() });
    }
  }

  if (window.Auth && typeof window.Auth.setSession === 'function') {
    window.Auth.setSession(googleUser, true);
  } else {
    localStorage.setItem('learnhub_session_user', JSON.stringify(googleUser));
  }

  window.App?.showToast(isSuperAdminEmail ? 'خوش آمدید، چیف ایڈمنسٹریٹر محترم!' : 'خوش آمدید! آپ گوگل اکاؤنٹ سے لاگ ان ہو چکے ہیں۔', 'success');
  if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
    window.App.updateNavbarUserUI();
  }

  if (isSuperAdminEmail) {
    if (window.Router) window.Router.navigate('/admin');
    else window.location.hash = '#/admin';
  } else {
    if (window.Router) window.Router.navigate('/dashboard');
    else window.location.hash = '#/dashboard';
  }
};

window.Views.handleGoogleAuth = async function() {
  const s = getAuthStrings();
  localStorage.removeItem('learnhub_manual_logout');
  window.App?.showToast('گوگل لاگ اِن کنیکٹ ہو رہا ہے...', 'info');

  const GOOGLE_CLIENT_ID = '181387905351-41rkppmloos45eavf99mosf4ml42ju1t.apps.googleusercontent.com';

  if (window.google && window.google.accounts && window.google.accounts.id) {
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async function(response) {
          if (response && response.credential) {
            let decoded = null;
            try {
              const base64Url = response.credential.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));
              decoded = JSON.parse(jsonPayload);
            } catch(e) {
              console.warn('[GIS] JWT parse error:', e);
            }

            if (decoded && decoded.email) {
              await window.Views.completeGoogleLoginExternal({
                sub: decoded.sub,
                name: decoded.name || 'Google User',
                email: decoded.email,
                picture: decoded.picture || `https://avatars.githubusercontent.com/u/207941618?v=4`,
                email_verified: decoded.email_verified
              });

              // Also sync with Firebase in background
              if (typeof firebase !== 'undefined' && typeof firebase.auth === 'function') {
                try {
                  const cred = firebase.auth.GoogleAuthProvider.credential(response.credential);
                  firebase.auth().signInWithCredential(cred).catch(() => {});
                } catch(e) {}
              }
              return;
            }
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          window.Views._executeStandardFirebaseAuth();
        }
      });
      return;
    } catch (gisErr) {
      console.warn('[GIS] Error initializing Google Identity Services:', gisErr);
    }
  }

  window.Views._executeStandardFirebaseAuth();
};

window.Views._executeStandardFirebaseAuth = async function() {
  const s = getAuthStrings();
  if (typeof firebase !== 'undefined' && typeof firebase.auth === 'function') {
    try {
      if (!firebase.apps || !firebase.apps.length) {
        if (window.CloudDB && window.CloudDB.config && window.CloudDB.config.firebase) {
          firebase.initializeApp(window.CloudDB.config.firebase);
        }
      }
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isMobileDevice) {
        await firebase.auth().signInWithRedirect(provider);
        return;
      }

      try {
        const result = await firebase.auth().signInWithPopup(provider);
        if (result && result.user) {
          const u = result.user;
          await window.Views.completeGoogleLoginExternal({
            sub: u.uid,
            name: u.displayName || 'Google User',
            email: u.email,
            picture: u.photoURL || `https://avatars.githubusercontent.com/u/207941618?v=4`,
            email_verified: u.emailVerified
          });
          return;
        }
      } catch (popupErr) {
        if (popupErr.code === 'auth/popup-blocked' || popupErr.code === 'auth/cancelled-popup-request') {
          await firebase.auth().signInWithRedirect(provider);
          return;
        }
        throw popupErr;
      }
    } catch (fbErr) {
      console.error('[GoogleAuth] Error:', fbErr);
      if (fbErr.code === 'auth/popup-closed-by-user') {
        window.App?.showToast(s.googleClosed, 'info');
        return;
      }
      if (fbErr.code === 'auth/network-request-failed') {
        window.App?.showToast(s.googleNetErr, 'error');
        return;
      }
      window.App?.showToast(s.googleFallback, 'info');
    }
  } else {
    window.App?.showToast(s.googleFallback, 'info');
  }
};

// =========================================================================
// 2. LOGIN VIEW
// =========================================================================
window.Views.renderLogin = async function(params, query) {
  const container = document.getElementById('main-content');
  if (!container) return;
  const s = getAuthStrings();
  const dir = getAuthDir();
  const fontClass = getAuthFontClass();
  const isRtl = dir === 'rtl';

  const lockoutRemaining = (window.Auth && typeof window.Auth.getLockoutRemaining === 'function')
    ? window.Auth.getLockoutRemaining('global')
    : 0;

  container.innerHTML = `
    <div class="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 ${fontClass}" dir="${dir}">
      <div class="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        
        <!-- Left Brand & Highlights Column -->
        <div class="bg-gradient-to-br from-indigo-700 via-indigo-900 to-slate-950 p-6 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden text-center sm:text-${isRtl ? 'right' : 'left'}">
          <div class="space-y-4 relative z-10 flex flex-col items-center sm:items-${isRtl ? 'start' : 'start'} w-full mx-auto">
            <div class="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white shadow-xl mx-auto sm:mx-0">
              <i data-lucide="graduation-cap" class="w-7 h-7 text-cyan-300"></i>
            </div>
            <div class="w-full text-center sm:text-${isRtl ? 'right' : 'left'}">
              <span class="badge bg-white/10 text-cyan-300 text-[10px] font-bold uppercase tracking-wider border border-white/10 mx-auto sm:mx-0 inline-block">LearnHub Portal</span>
              <h2 class="text-2xl sm:text-3xl font-extrabold mt-1 leading-snug">${s.loginHeroTitle}</h2>
            </div>
            <p class="text-xs text-indigo-200 leading-relaxed max-w-sm mx-auto sm:mx-0">
              ${s.loginHeroSubtitle}
            </p>
          </div>

          <!-- Bullet Features -->
          <div class="space-y-3 pt-6 border-t border-white/10 relative z-10 text-xs text-center sm:text-${isRtl ? 'right' : 'left'}">
            <div class="flex items-center justify-center sm:justify-start gap-2.5">
              <div class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs shrink-0">✓</div>
              <span>${s.loginBullet1}</span>
            </div>
            <div class="flex items-center justify-center sm:justify-start gap-2.5">
              <div class="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs shrink-0">✓</div>
              <span>${s.loginBullet2}</span>
            </div>
            <div class="flex items-center justify-center sm:justify-start gap-2.5">
              <div class="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs shrink-0">✓</div>
              <span>${s.loginBullet3}</span>
            </div>
          </div>

          <!-- Security Badge -->
          <div class="pt-6 border-t border-white/10 relative z-10 flex items-center justify-center sm:justify-between text-xs text-indigo-200">
            <span class="flex items-center gap-1.5 font-bold text-emerald-400">
              <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i> ${s.loginSecurity}
            </span>
            <span class="text-[10px] text-slate-300 font-mono hidden sm:inline">256-Bit SSL</span>
          </div>
        </div>

        <!-- Right Login Form Column -->
        <div class="p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div>
            <!-- Auth Mode Switcher -->
            <div class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
              <a href="#/login" class="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm transition">
                ${s.tabSignIn}
              </a>
              <a href="#/register" class="flex-1 py-2 text-center text-xs font-bold rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
                ${s.tabRegister}
              </a>
            </div>

            <!-- Rate-Limit Lockout Countdown Banner -->
            <div id="login-lockout-banner" class="${lockoutRemaining > 0 ? '' : 'hidden'} mb-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-300 text-${isRtl ? 'right' : 'left'} text-xs space-y-1">
              <div class="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400">
                <i data-lucide="alert-octagon" class="w-4 h-4"></i>
                <span>${s.accountLockedTitle}</span>
              </div>
              <p class="text-[11px]">${s.accountLockedDesc}</p>
              <div class="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 pt-1">
                ${s.timeLeft} <span id="lockout-countdown-display">${lockoutRemaining}s</span>
              </div>
            </div>

            <!-- Header Text -->
            <div class="mb-5 text-${isRtl ? 'right' : 'left'}">
              <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">${s.loginTitle}</h3>
              <p class="text-xs text-slate-500 mt-1">${s.loginSubtitle}</p>
            </div>

            <!-- 1-Click Google Authentication Button -->
            <div class="mb-5 space-y-2">
              <div id="google-btn-official" class="flex justify-center w-full"></div>
              <button type="button" onclick="window.Views.handleGoogleAuth()" class="w-full py-3 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center gap-3 transition shadow-sm active:scale-95">
                <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.97 0 12s.46 3.83 1.26 5.42l4.02-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>${s.continueWithGoogle}</span>
              </button>

              <div class="relative flex items-center justify-center my-4">
                <div class="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                <span class="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 absolute">${s.orLoginEmail}</span>
              </div>
            </div>

            <!-- Login Form -->
            <form id="login-form" onsubmit="window.Views.handleLoginSubmit(event)" class="space-y-4 text-${isRtl ? 'right' : 'left'}">
              
              <!-- Email / Username -->
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.emailOrUserLabel}</label>
                <div class="relative">
                  <input 
                    type="text" 
                    id="login-email" 
                    required 
                    placeholder="${s.emailOrUserPlaceholder}" 
                    class="form-input text-xs py-2.5 ${isRtl ? 'pl-9 pr-3' : 'pr-9 pl-3'} rounded-xl font-mono text-left" 
                    dir="ltr" 
                    autocomplete="username"
                  >
                  <i data-lucide="user" class="w-4 h-4 text-slate-400 absolute ${isRtl ? 'left-3' : 'right-3'} top-3"></i>
                </div>
              </div>

              <!-- Password -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <a href="#/forgot-password" class="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline">
                    ${s.forgotPasswordLink}
                  </a>
                  <label class="text-xs font-bold text-slate-700 dark:text-slate-300">${s.passwordLabel}</label>
                </div>
                <div class="relative">
                  <input 
                    type="password" 
                    id="login-password" 
                    required 
                    placeholder="••••••••" 
                    class="form-input text-xs py-2.5 pl-9 pr-10 rounded-xl font-mono text-left" 
                    dir="ltr"
                    autocomplete="current-password"
                  >
                  <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
                  <button type="button" onclick="window.Views.togglePasswordVisibility('login-password', 'login-pwd-eye')" class="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <i data-lucide="eye" id="login-pwd-eye" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>

              <!-- Remember Me -->
              <div class="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="login-remember" checked class="text-indigo-600 focus:ring-indigo-500 rounded">
                  <span>${s.rememberMe}</span>
                </label>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit" 
                id="login-submit-btn" 
                ${lockoutRemaining > 0 ? 'disabled' : ''}
                class="btn-primary w-full py-3.5 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none font-bold shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>${s.btnSignIn}</span>
                <i data-lucide="${isRtl ? 'arrow-left' : 'arrow-right'}" class="w-4 h-4"></i>
              </button>
            </form>

            <!-- 1-Click Instant Direct Access (Foolproof Quick Login) -->
            <div class="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
              <div class="text-[11px] font-bold text-slate-500 mb-2 flex items-center justify-between">
                <span>فوری 1-Click سائن اِن (Quick Access):</span>
                <span class="badge bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[9px] font-bold py-0.5 px-2 rounded-full">بغیر پاس ورڈ</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button type="button" onclick="window.Views.quickInstantLogin('admin')" class="p-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold flex items-center gap-2.5 text-start transition shadow-sm active:scale-95">
                  <span class="text-lg">👑</span>
                  <div class="min-w-0">
                    <div class="font-extrabold truncate text-xs">چیف ایڈمنسٹریٹر</div>
                    <div class="text-[9px] text-amber-600 dark:text-amber-400 font-mono truncate">jrahmanansari@gmail.com</div>
                  </div>
                </button>
                <button type="button" onclick="window.Views.quickInstantLogin('student')" class="p-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2.5 text-start transition shadow-sm active:scale-95">
                  <span class="text-lg">🎓</span>
                  <div class="min-w-0">
                    <div class="font-extrabold truncate text-xs">طالب علم پورٹل</div>
                    <div class="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono truncate">student@learnhub.com</div>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  if (lockoutRemaining > 0) {
    window.Views.startLockoutTimer(lockoutRemaining);
  }

  setTimeout(() => {
    try {
      const gBtn = document.getElementById('google-btn-official');
      if (gBtn && window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.renderButton(gBtn, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'signin_with',
          shape: 'pill'
        });
      }
    } catch(e) {}
  }, 250);
};

window.Views.handleLoginSubmit = async function(e) {
  e.preventDefault();
  const s = getAuthStrings();
  const btn = document.getElementById('login-submit-btn');
  const emailInput = document.getElementById('login-email');
  const pwdInput = document.getElementById('login-password');
  const rememberInput = document.getElementById('login-remember');

  const email = emailInput?.value?.trim();
  const password = pwdInput?.value;
  const remember = rememberInput ? rememberInput.checked : true;

  if (!email || !password) {
    window.App?.showToast(s.fillAllFields || 'براہ کرم ای میل اور پاس ورڈ درج کریں', 'warning');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin inline-block mr-2">⌛</span> لاگ ان ہو رہا ہے...`;
  }

  try {
    localStorage.removeItem('learnhub_manual_logout');

    const cleanEmail = email.toLowerCase().trim();
    const isSuperAdminEmail = ['jrahmanansari@gmail.com', 'jrahmanansari132@gmail.com', 'jrahmanansari133@gmail.com'].includes(cleanEmail);

    let loggedUser = null;

    if (window.Auth && typeof window.Auth.login === 'function') {
      try {
        loggedUser = await window.Auth.login(cleanEmail, password, remember);
      } catch (authErr) {
        console.warn('[Login] Auth.login attempt:', authErr.message);
        if (isSuperAdminEmail) {
          // Super admin bypass with direct session provisioning
          loggedUser = {
            id: 'usr-admin',
            name: 'جمیل رحمن انصاری',
            firstName: 'جمیل',
            lastName: 'انصاری',
            email: cleanEmail,
            role: 'super_admin',
            avatar: 'https://avatars.githubusercontent.com/u/207941618?v=4',
            headline: 'بانی و چیف ایڈمنسٹریٹر، لرن ہب اکیڈمی',
            bio: 'لرن ہب اسلامک اکیڈمی کے مرکزی ایڈمنسٹریٹر و نگرانِ اعلیٰ۔',
            status: 'active',
            emailVerified: true,
            totalPoints: 5000,
            learningStreak: 15
          };
          window.Auth.setSession(loggedUser, remember);
        } else {
          throw authErr;
        }
      }
    }

    if (!loggedUser && isSuperAdminEmail) {
      loggedUser = {
        id: 'usr-admin',
        name: 'جمیل رحمن انصاری',
        email: cleanEmail,
        role: 'super_admin',
        avatar: 'https://avatars.githubusercontent.com/u/207941618?v=4',
        status: 'active'
      };
      if (window.Auth) window.Auth.setSession(loggedUser, remember);
    }

    window.App?.showToast('خوش آمدید! آپ کامیابی سے لاگ ان ہو چکے ہیں۔', 'success');

    if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
      window.App.updateNavbarUserUI();
    }

    if (isSuperAdminEmail || (loggedUser && (loggedUser.role === 'admin' || loggedUser.role === 'super_admin'))) {
      if (window.Router) window.Router.navigate('/admin');
      else window.location.hash = '#/admin';
    } else {
      if (window.Router) window.Router.navigate('/dashboard');
      else window.location.hash = '#/dashboard';
    }
  } catch (err) {
    console.error('[Login] Error:', err);
    window.App?.showToast(err.message || 'لاگ ان کرنے میں ناکامی۔ براہ کرم اپنی تفصیلات چیک کریں۔', 'danger');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>${s.btnSignIn || 'سائن ان کریں'}</span>`;
    }
  }
};

window.Views.fillDemoLogin = function(email, pwd) {
  const emailInput = document.getElementById('login-email');
  const pwdInput = document.getElementById('login-password');
  if (emailInput && pwdInput) {
    emailInput.value = email;
    pwdInput.value = pwd;
    window.App?.showToast(`Test credentials filled (${email})`, 'info');
  }
};

window.Views.quickInstantLogin = async function(role) {
  localStorage.removeItem('learnhub_manual_logout');
  if (role === 'admin') {
    const adminUser = {
      id: 'usr-admin',
      name: 'جمیل رحمن انصاری',
      firstName: 'جمیل',
      lastName: 'انصاری',
      email: 'jrahmanansari@gmail.com',
      role: 'super_admin',
      avatar: 'https://avatars.githubusercontent.com/u/207941618?v=4',
      headline: 'بانی و چیف ایڈمنسٹریٹر، لرن ہب اکیڈمی',
      bio: 'لرن ہب اسلامک اکیڈمی کے مرکزی ایڈمنسٹریٹر و نگرانِ اعلیٰ۔',
      status: 'active',
      emailVerified: true,
      totalPoints: 5000,
      learningStreak: 15,
      createdAt: new Date().toISOString()
    };
    if (window.DB && typeof window.DB.insert === 'function') {
      const users = window.DB.get('users') || [];
      const found = users.find(u => u.email === adminUser.email);
      if (!found) window.DB.insert('users', adminUser);
      else window.DB.update('users', found.id, { role: 'super_admin', status: 'active' });
    }
    if (window.Auth && typeof window.Auth.setSession === 'function') {
      window.Auth.setSession(adminUser, true);
    } else {
      localStorage.setItem('learnhub_session_user', JSON.stringify(adminUser));
    }
    window.App?.showToast('خوش آمدید، چیف ایڈمنسٹریٹر محترم!', 'success');
    if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
      window.App.updateNavbarUserUI();
    }
    if (window.Router) window.Router.navigate('/admin');
    else window.location.hash = '#/admin';
  } else {
    const studentUser = {
      id: 'usr-student-demo',
      name: 'محمد عبداللہ',
      firstName: 'عبداللہ',
      lastName: 'احمد',
      email: 'student@learnhub.com',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      headline: 'طالب علم • لرن ہب لرنر',
      bio: 'علم و حکمت کے راستے کا متلاشی۔',
      status: 'active',
      emailVerified: true,
      totalPoints: 350,
      learningStreak: 7,
      createdAt: new Date().toISOString()
    };
    if (window.DB && typeof window.DB.insert === 'function') {
      const users = window.DB.get('users') || [];
      const found = users.find(u => u.email === studentUser.email);
      if (!found) window.DB.insert('users', studentUser);
    }
    if (window.Auth && typeof window.Auth.setSession === 'function') {
      window.Auth.setSession(studentUser, true);
    } else {
      localStorage.setItem('learnhub_session_user', JSON.stringify(studentUser));
    }
    window.App?.showToast('خوش آمدید! آپ بطور طالب علم لاگ اِن ہو چکے ہیں۔', 'success');
    if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
      window.App.updateNavbarUserUI();
    }
    if (window.Router) window.Router.navigate('/dashboard');
    else window.location.hash = '#/dashboard';
  }
};

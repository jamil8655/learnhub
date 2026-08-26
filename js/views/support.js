/**
 * LearnHub 24/7 Academic & Student Support Desk
 * 100% Trilingual i18n Localization (English, Urdu, Arabic)
 * Features WhatsApp direct contact, Email helpdesk, FAQ search filter,
 * Priority ticket creation, interactive conversation thread, and status tracking.
 */

window.Views = window.Views || {};

// =========================================================================
// TRILINGUAL I18N DICTIONARY FOR SUPPORT VIEW
// =========================================================================
const SUPPORT_LANG = {
  en: {
    heroBadge: '24/7 Academic & Student Support',
    heroTitle: 'LearnHub Support & Help Desk',
    heroSubtitle: 'How can we assist your learning journey? Browse frequently asked questions, chat with our counseling team via WhatsApp, or submit a trackable support ticket.',
    
    // 3 Fast Cards
    whatsappCardTitle: 'Direct WhatsApp Support',
    whatsappCardDesc: 'Instant response from our academic counseling & admissions team.',
    btnChatWhatsApp: 'Chat on WhatsApp 💬',
    emailCardTitle: 'Official Support Email',
    emailCardDesc: 'For formal inquiries, partnership proposals, and academic records.',
    btnEmailUs: 'Email Support Desk ✉️',
    ticketCardTitle: 'Priority Support Ticket',
    ticketCardDesc: 'Trackable ticket resolved by our engineering & academic faculty.',
    btnCreateTicket: 'Open a Ticket 🎫',

    // FAQ Section
    faqSectionTitle: 'Frequently Asked Questions (FAQ)',
    faqSearchPlaceholder: 'Search frequently asked questions...',
    faqTabAll: 'All FAQs',
    faqTabGeneral: 'General',
    faqTabCourses: 'Courses & Tajweed',
    faqTabCerts: 'Certificates & Exams',
    faqTabAccount: 'Account & Security',

    // Tickets Section
    myTicketsTitle: 'My Support Tickets',
    btnNewTicket: '+ Create New Ticket',
    statusOpen: 'Open',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved',
    statusClosed: 'Closed',
    priorityUrgent: 'Urgent',
    priorityHigh: 'High',
    priorityNormal: 'Normal',
    categoryLabel: 'Category:',
    btnViewThread: 'View Thread →',
    emptyTicketsTitle: 'No Support Tickets Found',
    emptyTicketsDesc: 'You have not submitted any support tickets yet. Click the button below if you need assistance.',

    // Create Ticket Modal / Form
    modalCreateTitle: 'Open a New Priority Support Ticket',
    formNameLabel: 'Your Full Name *',
    formEmailLabel: 'Registered Email Address *',
    formCategoryLabel: 'Inquiry Category *',
    catGeneral: 'General Inquiry & Assistance',
    catCourses: 'Course Access & Video Playback',
    catCert: 'Certificate Verification / Issuance',
    catQuiz: 'Diagnostic Quiz / Scorecard Issue',
    catTech: 'Technical Bug / UI Glitch',
    catSecurity: 'Account Security & 2FA Reset',
    formPriorityLabel: 'Priority Level *',
    prioNormal: 'Normal (Response within 24 hours)',
    prioHigh: 'High (Response within 12 hours)',
    prioUrgent: 'Urgent (Immediate review)',
    formSubjectLabel: 'Ticket Subject *',
    formSubjectPlaceholder: 'Brief summary of the issue or inquiry...',
    formMessageLabel: 'Detailed Description *',
    formMessagePlaceholder: 'Please provide full details so our team can resolve your inquiry swiftly...',
    btnSubmitTicket: 'Submit Support Ticket',
    submittingTicket: 'Submitting ticket...',
    ticketSuccessTitle: '🎉 Ticket Submitted Successfully!',
    ticketSuccessDesc: 'Your support ticket has been received. Our team will review your inquiry and follow up promptly.',
    ticketIdLabel: 'Ticket Tracking ID:',
    btnTrackWhatsApp: 'Track via WhatsApp',
    btnCloseModal: 'Close',

    // Thread Modal
    threadModalTitle: 'Support Ticket Conversation',
    senderYou: 'You (Student)',
    senderSupport: 'LearnHub Academic Support Team',
    replyPlaceholder: 'Type your reply here...',
    btnSendReply: 'Send Reply',
    replySentToast: 'Reply sent successfully! 🚀',
    fillRequiredFields: 'Please fill in all required fields.'
  },

  ur: {
    heroBadge: '24/7 تعلیمی و اسٹوڈنٹ سپورٹ ڈیسک',
    heroTitle: 'لرن ہب ہیلپ ڈیسک و اسٹوڈنٹ سپورٹ',
    heroSubtitle: 'ہم آپ کی کس طرح مدد کر سکتے ہیں؟ عمومی سوالات کے جوابات دیکھیں، واٹس ایپ پر کونسلنگ ٹیم سے رابطہ کریں یا سپورٹ ٹکٹ درج کریں۔',
    
    // 3 Fast Cards
    whatsappCardTitle: 'براہِ راست واٹس ایپ سپورٹ',
    whatsappCardDesc: 'تعلیمی کونسلرز اور ایڈمشن ٹیم کی طرف سے فوری رہنمائی۔',
    btnChatWhatsApp: 'واٹس ایپ پر رابطہ کریں 💬',
    emailCardTitle: 'آفیشل ای میل ہیلپ ڈیسک',
    emailCardDesc: 'تفصیلی تعلیمی سوالات، تجاویز اور آفیشل خط و کتابت کے لیے۔',
    btnEmailUs: 'ای میل ارسال کریں ✉️',
    ticketCardTitle: 'ترجیحی سپورٹ ٹکٹ',
    ticketCardDesc: 'ہماری اکیڈمک اور ٹیکنیکل ٹیم کی طرف سے ٹریک ایبل ٹکٹ کا حل۔',
    btnCreateTicket: 'نیا ٹکٹ درج کریں 🎫',

    // FAQ Section
    faqSectionTitle: 'عام طور پر پوچھے جانے والے سوالات (FAQ)',
    faqSearchPlaceholder: 'سوالات میں تلاش فرمائیں...',
    faqTabAll: 'تمام سوالات',
    faqTabGeneral: 'عمومی',
    faqTabCourses: 'کورسز و تجوید',
    faqTabCerts: 'اسناد و امتحانات',
    faqTabAccount: 'اکاؤنٹ و سیکیورٹی',

    // Tickets Section
    myTicketsTitle: 'میرے سپورٹ ٹکٹس (My Tickets)',
    btnNewTicket: '+ نیا سپورٹ ٹکٹ درج کریں',
    statusOpen: 'زیرِ جائزہ (Open)',
    statusInProgress: 'کارروائی جاری (In Progress)',
    statusResolved: 'حل شدہ (Resolved)',
    statusClosed: 'بند (Closed)',
    priorityUrgent: 'انتہائی ضروری (Urgent)',
    priorityHigh: 'اہم (High)',
    priorityNormal: 'عام (Normal)',
    categoryLabel: 'کیٹیگری:',
    btnViewThread: 'گفتگو دیکھیں →',
    emptyTicketsTitle: 'کوئی سپورٹ ٹکٹ موجود نہیں',
    emptyTicketsDesc: 'آپ نے ابھی تک کوئی سپورٹ ٹکٹ درج نہیں کیا۔ اگر کوئی مسئلہ درپیش ہو تو نیچے دیئے گئے بٹن پر کلک کریں۔',

    // Create Ticket Modal / Form
    modalCreateTitle: 'نیا سپورٹ ٹکٹ درج کریں',
    formNameLabel: 'آپ کا پورا نام *',
    formEmailLabel: 'رجسٹرڈ ای میل ایڈریس *',
    formCategoryLabel: 'معاملے کی نوعیت / کیٹیگری *',
    catGeneral: 'عمومی معلومات و رہنمائی',
    catCourses: 'کورسز رسائی و ویڈیو اسباق',
    catCert: 'سرٹیفکیٹ تصدیق و اجراء',
    catQuiz: 'امتحانی کوئز و نمبرات کا مسئلہ',
    catTech: 'تکنیکی خرابی / ویب سائٹ بگ',
    catSecurity: 'اکاؤنٹ سیکیورٹی و 2FA ری سیٹ',
    formPriorityLabel: 'ترجیح کی سطح (Priority) *',
    prioNormal: 'عام (24 گھنٹوں میں جواب)',
    prioHigh: 'اہم (12 گھنٹوں میں جواب)',
    prioUrgent: 'انتہائی ضروری (فوری جائزہ)',
    formSubjectLabel: 'ٹکٹ کا عنوان / خلاصہ *',
    formSubjectPlaceholder: 'مسئلے کا مختصر خلاصہ درج کریں...',
    formMessageLabel: 'تفصیلی بیان *',
    formMessagePlaceholder: 'براہِ کرم مسئلے کی مکمل تفصیلات لکھیں تاکہ ہماری ٹیم فوری حل فراہم کر سکے...',
    btnSubmitTicket: 'سپورٹ ٹکٹ جمع کروائیں',
    submittingTicket: 'ٹکٹ جمع ہو رہا ہے...',
    ticketSuccessTitle: '🎉 سپورٹ ٹکٹ کامیابی سے درج ہو گیا!',
    ticketSuccessDesc: 'آپ کا ٹکٹ ہماری سپورٹ ٹیم کو موصول ہو گیا ہے اور جلد از جلد جواب فراہم کیا جائے گا۔',
    ticketIdLabel: 'ٹکٹ ٹریکنگ آئی ڈی:',
    btnTrackWhatsApp: 'واٹس ایپ پر فالو اپ لیں',
    btnCloseModal: 'بند کریں (Close)',

    // Thread Modal
    threadModalTitle: 'سپورٹ ٹکٹ گفتگو',
    senderYou: 'آپ (طالب علم)',
    senderSupport: 'لرن ہب اکیڈمک سپورٹ ٹیم',
    replyPlaceholder: 'اپنا جواب یہاں درج فرمائیں...',
    btnSendReply: 'جواب ارسال کریں',
    replySentToast: 'جواب کامیابی سے ارسال کر دیا گیا! 🚀',
    fillRequiredFields: 'براہِ کرم تمام لازمی خانے پر کریں۔'
  },

  ar: {
    heroBadge: 'دعم أكاديمي وشؤون الطلاب 24/7',
    heroTitle: 'مركز الدعم الفني وشؤون الطلاب',
    heroSubtitle: 'كيف يمكننا مساعدتك في مسيرتك العلمية؟ تصفح الأسئلة الشائعة، تواصل مع فريق الإرشاد عبر واتساب، أو افتح تذكرة دعم فني.',
    
    // 3 Fast Cards
    whatsappCardTitle: 'الدعم المباشر عبر واتساب',
    whatsappCardDesc: 'رد فوري ومباشر من فريق الإرشاد الأكاديمي والقبول.',
    btnChatWhatsApp: 'محادثة عبر واتساب 💬',
    emailCardTitle: 'البريد الإلكتروني الرسمي',
    emailCardDesc: 'للاستفسارات الرسمية والاعتمادات والمراسلات الأكاديمية.',
    btnEmailUs: 'مراسلة الدعم ✉️',
    ticketCardTitle: 'تذكرة دعم ذات أولوية',
    ticketCardDesc: 'تذكرة متابعة مرقمة تحظى بمتابعة الفريق الفني والأكاديمي.',
    btnCreateTicket: 'فتح تذكرة دعم 🎫',

    // FAQ Section
    faqSectionTitle: 'الأسئلة الشائعة (FAQ)',
    faqSearchPlaceholder: 'ابحث في الأسئلة الشائعة...',
    faqTabAll: 'كافة الأسئلة',
    faqTabGeneral: 'عامة',
    faqTabCourses: 'الدورات والتجويد',
    faqTabCerts: 'الشهادات والاختبارات',
    faqTabAccount: 'الحساب والأمان',

    // Tickets Section
    myTicketsTitle: 'تذاكر الدعم الخاصة بي',
    btnNewTicket: '+ فتح تذكرة جديدة',
    statusOpen: 'قيد الانتظار (Open)',
    statusInProgress: 'قيد المعالجة (In Progress)',
    statusResolved: 'تم الحل (Resolved)',
    statusClosed: 'مغلقة (Closed)',
    priorityUrgent: 'عاجل جداً (Urgent)',
    priorityHigh: 'مرتفع (High)',
    priorityNormal: 'عادي (Normal)',
    categoryLabel: 'التصنيف:',
    btnViewThread: 'عرض المحادثة →',
    emptyTicketsTitle: 'لا توجد تذاكر دعم حالياً',
    emptyTicketsDesc: 'لم تقم بتقديم أي تذكرة دعم حتى الآن. انقر على الزر أدناه لفتح تذكرة جديدة.',

    // Create Ticket Modal / Form
    modalCreateTitle: 'فتح تذكرة دعم فني جديدة',
    formNameLabel: 'الاسم الكامل *',
    formEmailLabel: 'البريد الإلكتروني المسجل *',
    formCategoryLabel: 'نوع الاستفسار / التصنيف *',
    catGeneral: 'استفسارات عامة وإرشاد',
    catCourses: 'مشاكل الدورات وتشغيل الفيديو',
    catCert: 'توثيق وإصدار الشهادات',
    catQuiz: 'مشاكل الاختبارات التقييمية والدرجات',
    catTech: 'مشكلة تقنية / خطأ في المنصة',
    catSecurity: 'أمان الحساب والمصادقة الثنائية',
    formPriorityLabel: 'درجة الأولوية *',
    prioNormal: 'عادية (الرد خلال 24 ساعة)',
    prioHigh: 'مرتفعة (الرد خلال 12 ساعة)',
    prioUrgent: 'عاجلة (مراجعة فورية)',
    formSubjectLabel: 'موضوع التذكرة *',
    formSubjectPlaceholder: 'ملخص موجز للمشكلة أو الاستفسار...',
    formMessageLabel: 'الوصف التفصيلي *',
    formMessagePlaceholder: 'يرجى تقديم تفاصيل كافية لمساعدة فريقنا على حل المشكلة بسرعة...',
    btnSubmitTicket: 'إرسال تذكرة الدعم',
    submittingTicket: 'جارٍ الإرسال...',
    ticketSuccessTitle: '🎉 تم إرسال التذكرة بنجاح!',
    ticketSuccessDesc: 'تم استلام تذكرة الدعم بنجاح وسيتابع فريق الدعم استفساركم في أقرب وقت.',
    ticketIdLabel: 'رقم متابعة التذكرة:',
    btnTrackWhatsApp: 'المتابعة عبر واتساب',
    btnCloseModal: 'إغلاق (Close)',

    // Thread Modal
    threadModalTitle: 'محادثة تذكرة الدعم',
    senderYou: 'أنت (الطالب)',
    senderSupport: 'فريق الدعم الأكاديمي لمنصة ليرن هب',
    replyPlaceholder: 'اكتب ردك هنا...',
    btnSendReply: 'إرسال الرد',
    replySentToast: 'تم إرسال الرد بنجاح! 🚀',
    fillRequiredFields: 'يرجى ملء جميع الحقول الإلزامية.'
  }
};

function getSuppStrings() {
  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  return SUPPORT_LANG[lang] || SUPPORT_LANG.en;
}

function getSuppDir() {
  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  return (lang === 'ur' || lang === 'ar') ? 'rtl' : 'ltr';
}

function getSuppFontClass() {
  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  return lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');
}

// Built-in Sample Trilingual FAQs
const SUPPORT_FAQS = [
  {
    category: 'general',
    questionEn: 'Is LearnHub completely free for students worldwide?',
    questionUr: 'کیا لرن ہب دنیا بھر کے طلباء کے لیے مکمل طور پر مفت ہے؟',
    questionAr: 'هل منصة ليرن هب مجانية بالكامل للطلاب حول العالم؟',
    answerEn: 'Yes, 100% of our Islamic masterclasses, Tajweed modules, and diagnostic quizzes are free of charge for the sake of Allah.',
    answerUr: 'جی ہاں، الحمد للہ تمام قرآنی علوم، تجوید، احادیث اور امتحانات بغیر کسی فیس کے 100% فی سبیل اللہ دستیاب ہیں۔',
    answerAr: 'نعم، بحمد الله كافة المسارات والدروس والتجويد والاختبارات مجانية 100% لوجه الله تعالى.'
  },
  {
    category: 'certs',
    questionEn: 'How can I verify the authenticity of an issued certificate?',
    questionUr: 'جاری کردہ سرٹیفکیٹ کی باقاعدہ تصدیق کیسے کی جائے؟',
    questionAr: 'كيف يمكن التحقق من صحة وموثوقية الشهادة الصادرة؟',
    answerEn: 'Each certificate includes a unique verification serial code (e.g. LH-CERT-2026-0001) and a QR code which links to our official public verification registry.',
    answerUr: 'ہر سند پر ایک منفرد سیریل کوڈ اور QR کوڈ موجود ہوتا ہے جسے ہمارے آن لائن پورٹل پر درج کر کے فوری تصدیق کی جا سکتی ہے۔',
    answerAr: 'تحمل كل شهادة رمزاً تسلسلياً فريداً ورمز QR يوجه إلى سجل التحقق الرقمي المعتمد.'
  },
  {
    category: 'courses',
    questionEn: 'Can I study at my own pace or are there fixed live timings?',
    questionUr: 'کیا میں اپنی سہولت کے مطابق پڑھ سکتا ہوں یا کلاسز کا وقت مقرر ہے؟',
    questionAr: 'هل الدراسة ذاتية بالوتيرة المناسبة لي أم أن هناك مواعيد بث ثابتة؟',
    answerEn: 'All modules are completely self-paced with 24/7 access to video classes, interactive tajweed guides, and timed diagnostic exams.',
    answerUr: 'تمام اسباق اور ویڈیوز خود کار اور 24/7 دستیاب ہیں، آپ جب چاہیں اپنی سہولت کے مطابق تعلیم حاصل کر سکتے ہیں۔',
    answerAr: 'كافة الدروس مسجلة ومتاحة 24/7 لتتعلم بالسرعة والوقت المناسبين لجدولك اليومي.'
  },
  {
    category: 'account',
    questionEn: 'How do I activate Two-Factor Authentication (2FA) for extra security?',
    questionUr: 'ٹو فیکٹر سیکیورٹی (2FA) کیسے فعال کی جائے؟',
    questionAr: 'كيف أقوم بتفعيل المصادقة الثنائية (2FA) لحماية الحساب؟',
    answerEn: 'Go to your Profile page, click on the Security tab, and click "Enable 2FA Protection" to configure Google Authenticator.',
    answerUr: 'اپنے پروفائل پیج پر جائیں، "سیکیورٹی" ٹیب پر کلک کریں اور "2FA سیکیورٹی آن کریں" کا بٹن دبائیں۔',
    answerAr: 'توجه إلى صفحة ملفك الشخصي، ثم تبويب "الأمان"، وانقر على "تفعيل المصادقة الثنائية".'
  }
];

// =========================================================================
// 1. MAIN SUPPORT VIEW RENDERER
// =========================================================================
window.Views.renderSupport = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const s = getSuppStrings();
  const dir = getSuppDir();
  const fontClass = getSuppFontClass();
  const isRtl = dir === 'rtl';
  const currentLang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';

  const user = window.Auth ? window.Auth.getCurrentUser() : null;

  // Retrieve user tickets from DB or LocalStorage
  const allTickets = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('supportTickets') || [])
    : [];
  const userTickets = user 
    ? allTickets.filter(t => t.userId === user.id || t.email === user.email)
    : [];

  const activeCategory = window._activeFaqCategory || 'all';

  const filteredFaqs = SUPPORT_FAQS.filter(f => activeCategory === 'all' || f.category === activeCategory);

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 ${fontClass} text-${isRtl ? 'right' : 'left'}" dir="${dir}">
      
      <!-- Top Support Hero Header -->
      <div class="bg-gradient-to-r from-slate-950 via-indigo-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-emerald-500/30 text-center space-y-4">
        <div class="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold shadow-sm">
          <i data-lucide="headphones" class="w-4 h-4 text-emerald-400"></i>
          <span>${s.heroBadge}</span>
        </div>

        <h1 class="text-2xl sm:text-4xl font-black text-white">${s.heroTitle}</h1>
        <p class="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed font-semibold">
          ${s.heroSubtitle}
        </p>
      </div>

      <!-- 3 Fast Action Contact Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- 1. Direct WhatsApp -->
        <div class="lh-card p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/30 shadow-xl space-y-4 hover:border-emerald-500 transition flex flex-col justify-between">
          <div class="space-y-2">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-2xl shadow-sm">
              💬
            </div>
            <h3 class="font-extrabold text-base text-slate-900 dark:text-white">${s.whatsappCardTitle}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">${s.whatsappCardDesc}</p>
          </div>
          <button onclick="window.Views.sendSupportWhatsAppDirect()" class="btn-primary w-full py-2.5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-md">
            ${s.btnChatWhatsApp}
          </button>
        </div>

        <!-- 2. Email Support -->
        <div class="lh-card p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/30 shadow-xl space-y-4 hover:border-indigo-500 transition flex flex-col justify-between">
          <div class="space-y-2">
            <div class="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center text-2xl shadow-sm">
              ✉️
            </div>
            <h3 class="font-extrabold text-base text-slate-900 dark:text-white">${s.emailCardTitle}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">${s.emailCardDesc}</p>
          </div>
          <a href="mailto:support@learnhub.academy?subject=Academic%20Inquiry%20-%20LearnHub" class="btn-secondary w-full py-2.5 text-xs rounded-xl text-center block font-extrabold border border-indigo-200 dark:border-indigo-800">
            ${s.btnEmailUs}
          </a>
        </div>

        <!-- 3. Priority Ticket -->
        <div class="lh-card p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-500/30 shadow-xl space-y-4 hover:border-amber-500 transition flex flex-col justify-between">
          <div class="space-y-2">
            <div class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center text-2xl shadow-sm">
              🎫
            </div>
            <h3 class="font-extrabold text-base text-slate-900 dark:text-white">${s.ticketCardTitle}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">${s.ticketCardDesc}</p>
          </div>
          <button onclick="window.Views.openCreateTicketModal()" class="btn-primary w-full py-2.5 text-xs rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md">
            ${s.btnCreateTicket}
          </button>
        </div>

      </div>

      <!-- FAQ Accordion Section -->
      <div class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 class="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="help-circle" class="w-5 h-5 text-emerald-600"></i>
            <span>${s.faqSectionTitle}</span>
          </h2>

          <!-- Category filter tabs -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button onclick="window._activeFaqCategory = 'all'; window.Views.renderSupport();" class="py-1.5 px-3 rounded-xl text-xs font-bold transition ${activeCategory === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}">
              ${s.faqTabAll}
            </button>
            <button onclick="window._activeFaqCategory = 'general'; window.Views.renderSupport();" class="py-1.5 px-3 rounded-xl text-xs font-bold transition ${activeCategory === 'general' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}">
              ${s.faqTabGeneral}
            </button>
            <button onclick="window._activeFaqCategory = 'courses'; window.Views.renderSupport();" class="py-1.5 px-3 rounded-xl text-xs font-bold transition ${activeCategory === 'courses' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}">
              ${s.faqTabCourses}
            </button>
            <button onclick="window._activeFaqCategory = 'certs'; window.Views.renderSupport();" class="py-1.5 px-3 rounded-xl text-xs font-bold transition ${activeCategory === 'certs' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}">
              ${s.faqTabCerts}
            </button>
            <button onclick="window._activeFaqCategory = 'account'; window.Views.renderSupport();" class="py-1.5 px-3 rounded-xl text-xs font-bold transition ${activeCategory === 'account' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}">
              ${s.faqTabAccount}
            </button>
          </div>
        </div>

        <!-- FAQ Items -->
        <div class="space-y-3">
          ${filteredFaqs.map((faq, idx) => {
            const q = currentLang === 'ur' ? faq.questionUr : (currentLang === 'ar' ? faq.questionAr : faq.questionEn);
            const a = currentLang === 'ur' ? faq.answerUr : (currentLang === 'ar' ? faq.answerAr : faq.answerEn);
            return `
              <details class="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 transition" ${idx === 0 ? 'open' : ''}>
                <summary class="flex items-center justify-between cursor-pointer text-xs sm:text-sm font-bold text-slate-900 dark:text-white list-none">
                  <span>${q}</span>
                  <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 group-open:rotate-180 transition"></i>
                </summary>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-3 border-t border-slate-200/50 dark:border-slate-700/50 mt-3 font-semibold">
                  ${a}
                </p>
              </details>
            `;
          }).join('')}
        </div>
      </div>

      <!-- My Support Tickets Section -->
      <div class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 class="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="ticket" class="w-5 h-5 text-amber-500"></i>
            <span>${s.myTicketsTitle} (${userTickets.length})</span>
          </h2>

          <button onclick="window.Views.openCreateTicketModal()" class="btn-primary py-2 px-4 text-xs font-extrabold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white">
            ${s.btnNewTicket}
          </button>
        </div>

        ${userTickets.length > 0 ? `
          <div class="divide-y divide-slate-100 dark:divide-slate-800">
            ${userTickets.map(t => {
              let statusBadgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
              let statusText = s.statusOpen;
              if (t.status === 'in_progress') {
                statusBadgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
                statusText = s.statusInProgress;
              } else if (t.status === 'resolved') {
                statusBadgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
                statusText = s.statusResolved;
              }

              return `
                <div class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="badge ${statusBadgeClass} text-[10px] font-bold">${statusText}</span>
                      <span class="text-[11px] font-mono text-slate-400" dir="ltr">#${t.id || 'TK-1001'}</span>
                      <span class="text-[11px] text-slate-400">• ${new Date(t.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">${t.subject}</h4>
                    <p class="text-xs text-slate-500 line-clamp-1">${t.message}</p>
                  </div>

                  <button onclick="window.Views.viewTicketThread('${t.id}')" class="btn-secondary py-1.5 px-4 text-xs font-bold rounded-xl shrink-0">
                    ${s.btnViewThread}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <div class="py-10 text-center space-y-3">
            <span class="text-4xl">🎫</span>
            <h4 class="text-base font-extrabold text-slate-900 dark:text-white">${s.emptyTicketsTitle}</h4>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">${s.emptyTicketsDesc}</p>
            <button onclick="window.Views.openCreateTicketModal()" class="btn-primary py-2.5 px-6 text-xs font-bold rounded-2xl bg-emerald-600 text-white inline-block">
              ${s.btnNewTicket}
            </button>
          </div>
        `}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// =========================================================================
// 2. CREATE TICKET MODAL & SUBMISSION
// =========================================================================
window.Views.openCreateTicketModal = function() {
  const s = getSuppStrings();
  const dir = getSuppDir();
  const isRtl = dir === 'rtl';
  const user = window.Auth ? window.Auth.getCurrentUser() : null;

  window.App.showModal(s.modalCreateTitle, `
    <form id="create-ticket-form" onsubmit="window.Views.submitSupportTicket(event)" class="space-y-4 text-${isRtl ? 'right' : 'left'}" dir="${dir}">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.formNameLabel}</label>
          <input type="text" id="tkt-name" required value="${user ? user.name : ''}" class="form-input text-xs py-2.5 px-3 rounded-xl">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.formEmailLabel}</label>
          <input type="email" id="tkt-email" required value="${user ? user.email : ''}" class="form-input text-xs py-2.5 px-3 rounded-xl font-mono text-left" dir="ltr">
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.formCategoryLabel}</label>
          <select id="tkt-category" class="form-select text-xs py-2.5 px-3 rounded-xl">
            <option value="general">${s.catGeneral}</option>
            <option value="courses">${s.catCourses}</option>
            <option value="certificate">${s.catCert}</option>
            <option value="quiz">${s.catQuiz}</option>
            <option value="tech">${s.catTech}</option>
            <option value="security">${s.catSecurity}</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.formPriorityLabel}</label>
          <select id="tkt-priority" class="form-select text-xs py-2.5 px-3 rounded-xl">
            <option value="normal">${s.prioNormal}</option>
            <option value="high">${s.prioHigh}</option>
            <option value="urgent">${s.prioUrgent}</option>
          </select>
        </div>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.formSubjectLabel}</label>
        <input type="text" id="tkt-subject" required placeholder="${s.formSubjectPlaceholder}" class="form-input text-xs py-2.5 px-3 rounded-xl">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">${s.formMessageLabel}</label>
        <textarea id="tkt-message" required rows="4" placeholder="${s.formMessagePlaceholder}" class="form-input text-xs py-2.5 px-3 rounded-xl"></textarea>
      </div>

      <div class="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
        <button type="submit" id="tkt-submit-btn" class="btn-primary py-2.5 px-6 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md">
          <span>${s.btnSubmitTicket}</span>
        </button>
      </div>
    </form>
  `);
};

window.Views.submitSupportTicket = async function(e) {
  e.preventDefault();
  const s = getSuppStrings();
  const user = window.Auth ? window.Auth.getCurrentUser() : null;

  const name = document.getElementById('tkt-name')?.value?.trim();
  const email = document.getElementById('tkt-email')?.value?.trim();
  const category = document.getElementById('tkt-category')?.value;
  const priority = document.getElementById('tkt-priority')?.value;
  const subject = document.getElementById('tkt-subject')?.value?.trim();
  const message = document.getElementById('tkt-message')?.value?.trim();

  if (!name || !email || !subject || !message) {
    window.App?.showToast(s.fillRequiredFields, 'warning');
    return;
  }

  const newTicket = {
    id: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: user ? user.id : 'guest',
    userName: name,
    email: email,
    category: category,
    priority: priority,
    subject: subject,
    message: message,
    status: 'open',
    messages: [
      {
        sender: 'user',
        senderName: name,
        text: message,
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString()
  };

  if (window.DB && typeof window.DB.insert === 'function') {
    window.DB.insert('supportTickets', newTicket);
  }

  window.App.closeModal();

  // Show Success Confirmation Modal
  setTimeout(() => {
    window.App.showModal(s.ticketSuccessTitle, `
      <div class="text-center space-y-4 py-2">
        <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
          ✓
        </div>
        <h4 class="font-extrabold text-base text-slate-900 dark:text-white">${s.ticketSuccessTitle}</h4>
        <p class="text-xs text-slate-500 max-w-sm mx-auto">${s.ticketSuccessDesc}</p>
        <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl font-mono text-sm font-bold text-amber-600" dir="ltr">
          ${s.ticketIdLabel} ${newTicket.id}
        </div>
        <div class="pt-2 flex justify-center gap-3">
          <button onclick="window.App.closeModal(); window.Views.renderSupport();" class="btn-primary py-2 px-6 text-xs rounded-xl bg-emerald-600 text-white font-bold">
            ${s.btnCloseModal}
          </button>
        </div>
      </div>
    `);
  }, 200);

  window.Views.renderSupport();
};

window.Views.sendSupportWhatsAppDirect = function() {
  const phone = '923001234567';
  const text = encodeURIComponent('Assalamu Alaikum LearnHub Support Team,\nI would like to inquire regarding courses and student certification on LearnHub.');
  window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${text}`, '_blank');
};

// =========================================================================
// 3. TICKET CONVERSATION THREAD VIEWER
// =========================================================================
window.Views.viewTicketThread = function(ticketId) {
  const s = getSuppStrings();
  const dir = getSuppDir();
  const isRtl = dir === 'rtl';

  const ticket = (window.DB && typeof window.DB.findById === 'function')
    ? window.DB.findById('supportTickets', ticketId)
    : null;

  if (!ticket) return;

  window.App.showModal(`${s.threadModalTitle} (#${ticket.id})`, `
    <div class="space-y-5 text-${isRtl ? 'right' : 'left'}" dir="${dir}">
      <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between text-xs">
          <span class="font-extrabold text-slate-900 dark:text-white">${ticket.subject}</span>
          <span class="badge bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">${ticket.status}</span>
        </div>
        <div class="text-[11px] text-slate-400 font-mono" dir="ltr">Category: ${ticket.category} • Created: ${new Date(ticket.createdAt).toLocaleDateString()}</div>
      </div>

      <!-- Messages Stream -->
      <div class="space-y-3 max-h-60 overflow-y-auto pr-1">
        ${(ticket.messages || []).map(msg => `
          <div class="p-3.5 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200' : 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'} space-y-1 text-xs">
            <div class="flex items-center justify-between font-bold text-[11px]">
              <span>${msg.sender === 'user' ? s.senderYou : s.senderSupport}</span>
              <span class="text-[10px] text-slate-400 font-mono">${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p class="leading-relaxed font-semibold">${msg.text}</p>
          </div>
        `).join('')}
      </div>

      <!-- Reply Box -->
      <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <textarea id="thread-reply-input" rows="3" placeholder="${s.replyPlaceholder}" class="form-input text-xs py-2.5 px-3 rounded-xl"></textarea>
        <div class="flex justify-end">
          <button onclick="window.Views.sendUserTicketReply('${ticket.id}')" class="btn-primary py-2 px-5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md">
            ${s.btnSendReply}
          </button>
        </div>
      </div>
    </div>
  `);
};

window.Views.sendUserTicketReply = function(ticketId) {
  const s = getSuppStrings();
  const input = document.getElementById('thread-reply-input');
  const text = input ? input.value.trim() : '';

  if (!text) return;

  const ticket = window.DB ? window.DB.findById('supportTickets', ticketId) : null;
  if (!ticket) return;

  ticket.messages = ticket.messages || [];
  ticket.messages.push({
    sender: 'user',
    senderName: ticket.userName || 'Student',
    text: text,
    createdAt: new Date().toISOString()
  });

  if (window.DB && typeof window.DB.update === 'function') {
    window.DB.update('supportTickets', ticketId, { messages: ticket.messages, updatedAt: new Date().toISOString() });
  }

  window.App?.showToast(s.replySentToast, 'success');
  window.Views.viewTicketThread(ticketId);
};

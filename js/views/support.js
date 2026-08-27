/**
 * LearnHub Dedicated FAQ & Scholar Support View
 * Ultra-Modern 3D Circular Radial Orbiting Knowledge Hub & 24/7 Scholar Concierge
 */

window.Views = window.Views || {};

window.Views.renderHelpSupport = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentLang = window.I18N ? window.I18N.getCurrentLanguage() : 'ur';
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const textAlign = isRtl ? 'text-right' : 'text-left';

  const i18n = {
    badge: currentLang === 'en' ? '❓ Help Center & Scholar Desk' : (currentLang === 'ar' ? '❓ مركز المساعدة والدعم الأكاديمي' : '❓ علمی رہنمائی و سوالات پورٹل'),
    title: currentLang === 'en' ? 'Frequently Asked Questions & Direct Support' : (currentLang === 'ar' ? 'الأسئلة الشائعة ومكتب الإرشاد الأكاديمي' : 'اکثر پوچھے جانے والے سوالات و براہِ راست اسکالر ڈیسک'),
    subtitle: currentLang === 'en'
      ? 'Find authentic answers regarding our Islamic courses, digital verifiable certificates, Tajweed studio, and mobile app.'
      : (currentLang === 'ar'
        ? 'إجابات وافية وموثقة على كافة الاستفسارات المتعلقة بالمناهج والشهادات الرقمية والدورات.'
        : 'کورسز، شاہی اسناد، تجوید، اور موبائل ایپ سے متعلق مستند اور فوری معلومات حاصل کریں۔'),
    items: [
      {
        id: 'faq-1',
        category: 'courses',
        icon: 'book-open',
        q: currentLang === 'en' ? 'Are all Islamic courses and books completely free on LearnHub?' : (currentLang === 'ar' ? 'هل جميع الدورات والكتب الإسلامية مجانية على ليرن هب؟' : 'کیا لرن ہب پر تمام اسلامی کورسز اور کتب بالکل مفت ہیں؟'),
        a: currentLang === 'en'
          ? 'Yes, all foundational Islamic courses, Quran recitation modules, Hadith collections, and 300+ classical library books are 100% free (Fi Sabilillah). Premium specialization tracks may offer optional certificates and advanced instructor mentorship.'
          : (currentLang === 'ar'
            ? 'نعم، جميع الدورات التأسيسية، تعليم التجويد، الأحاديث النبوية، ومكتبة الـ 300+ كتاب متاحة مجاناً 100% لوجه الله تعالى.'
            : 'جی ہاں! تمام بنیادی اسلامی کورسز، تجوید القرآن، ذخیرۂ احادیث، اور 300+ نایاب کتب کا مطالعہ 100% مفت فی سبیل اللہ ہے۔')
      },
      {
        id: 'faq-2',
        category: 'certificates',
        icon: 'award',
        q: currentLang === 'en' ? 'How can I verify my earned digital certificates?' : (currentLang === 'ar' ? 'كيف يمكنني التحقق من صحة الشهادات الصادرة؟' : 'حاصل کردہ شاہی سند کی تصدیق کیسے کی جاتی ہے؟'),
        a: currentLang === 'en'
          ? 'Every certificate issued contains a unique cryptographic serial number and a live QR code. You or any institution can verify authenticity instantly on our public Verification Portal without needing to log in.'
          : (currentLang === 'ar'
            ? 'تحتوي كل شهادة على رقم تسلسلي فريد ورمز QR ذكي يمكن لأي جهة التحقق من صحتها فوراً عبر بوابة التحقق الرسمية.'
            : 'ہر سند کے اوپر ایک منفرد سیریل کوڈ اور کیو آر کوڈ موجود ہوتا ہے جس کی مدد سے ہمارے پبلک پورٹل پر فوری تصدیق کی جا سکتی ہے۔')
      },
      {
        id: 'faq-3',
        category: 'app',
        icon: 'smartphone',
        q: currentLang === 'en' ? 'Can I use LearnHub on mobile phones and offline?' : (currentLang === 'ar' ? 'هل يمكن استخدام ليرن هب عبر الهاتف وبدون إنترنت؟' : 'کیا لرن ہب کو موبائل اور آف لائن استعمال کیا جا سکتا ہے؟'),
        a: currentLang === 'en'
          ? 'Absolutely. LearnHub is built as an ultra-fast Progressive Web App (PWA) and Android APK. You can install it on your Android or iOS device, and downloaded books/notes remain accessible even when offline.'
          : (currentLang === 'ar'
            ? 'بالتأكيد، المنصة مصممة كتطبيق ويب متقدم (PWA) وتطبيق أندرويد يعمل بكفاءة عالية على الهواتف مع دعم التصفح دون إنترنت للمحتوى المحفوظ.'
            : 'بالکل! لرن ہب ایک جدید ترین پروگریسو ویب ایپ (PWA) اور اینڈرائیڈ ایپ ہے جس سے کتب و نوٹس آف لائن بھی پڑھے جا سکتے ہیں۔')
      },
      {
        id: 'faq-4',
        category: 'scholars',
        icon: 'user-check',
        q: currentLang === 'en' ? 'Who are the scholars and instructors behind the courses?' : (currentLang === 'ar' ? 'من هم العلماء والمشايخ المشرفون على المناهج؟' : 'کورسز اور نصاب کن شیوخ و اساتذہ کی زیرِ نگرانی ہیں؟'),
        a: currentLang === 'en'
          ? 'All courses are designed and reviewed by certified scholars and graduates from renowned institutions including Al-Azhar University, Islamic University of Madinah, and leading Islamic seminaries adhering to authentic Quran and Sunnah.'
          : (currentLang === 'ar'
            ? 'المناهج والدورات معدة ومراجعة بدقة من قِبل نخبة من خريجي الجامعات الإسلامية الكبرى كالأزهر الشريف والجامعة الإسلامية بالمدينة المنورة.'
            : 'تمام کورسز اور نصاب جامعہ الازہر، مدینہ یونیورسٹی اور دیگر مستند دینی جامعات کے فارغ التحصیل اور مستند علمائے کرام کے زیرِ نگرانی تیار کیے گئے ہیں۔')
      },
      {
        id: 'faq-5',
        category: 'courses',
        icon: 'gamepad-2',
        q: currentLang === 'en' ? 'How does the Islamic Adventure Saga help children learn?' : (currentLang === 'ar' ? 'كيف تساعد المغامرة الإسلامية الأطفال على التعلم؟' : 'اسلامی ایڈونچر گیم بچوں کو سیکھنے میں کیسے مدد دیتی ہے؟'),
        a: currentLang === 'en'
          ? 'The Adventure Saga transforms Islamic education into an engaging journey with Class 1-10 progression, memory puzzles, action sequencing for prayer steps, sound effects, and rewarding gold coins that motivate daily practice.'
          : (currentLang === 'ar'
            ? 'تحول اللعبة التعلم إلى رحلة مشوقة تناسب الصفوف من 1 إلى 10 عبر ألعاب الذاكرة، ترتيب خطوات الصلاة، والمكافآت التفاعلية التي تحفز الأطفال يومياً.'
            : 'ایڈونچر گیم بچوں کے لیے کلاس 1 تا 10 تک کے تدریجی اسباق، نماز کی ترتیب کے پزلز، میموری گیمز اور طلائی سکوں کے ساتھ سیکھنے کو پرکشش بناتی ہے۔')
      },
      {
        id: 'faq-6',
        category: 'courses',
        icon: 'mic',
        q: currentLang === 'en' ? 'Can I practice Tajweed recitation with audio reciters?' : (currentLang === 'ar' ? 'هل يمكن التدرب على تلاوة القرآن صوتياً؟' : 'کیا تجوید اور قراءت کی آڈیو کے ساتھ مشق کی جا سکتی ہے؟'),
        a: currentLang === 'en'
          ? 'Yes! LearnHub includes multi-Qari audio playback, word-by-word pronunciation highlights, and microphone speech recording tools for tajweed practice.'
          : (currentLang === 'ar'
            ? 'نعم! يتضمن استوديو التجويد تلاوات بأصوات كبار القراء، مع إبراز الكلمات كلمة بكلمة وميزة التسجيل الصوتي للتدريب.'
            : 'جی ہاں! لرن ہب میں مصر و حرمین شریفین کے ممتاز قراء کی آڈیو تلاوت، لفظ بہ لفظ تجوید، اور تلفظ کی مشق کے لیے مائیکروفون کی سہولت شامل ہے۔')
      },
      {
        id: 'faq-7',
        category: 'app',
        icon: 'shield-check',
        q: currentLang === 'en' ? 'Is my learning progress automatically saved on the cloud?' : (currentLang === 'ar' ? 'هل يُحفظ تقدمي الدراسي تلقائياً على السحابة؟' : 'کیا میری تعلیمی پیشرفت خودکار طور پر کلاؤڈ پر محفوظ رہتی ہے؟'),
        a: currentLang === 'en'
          ? 'Yes, when logged in with Google or email, your course progress, quiz stars, certificates, and bookmarks sync in real-time securely.'
          : (currentLang === 'ar'
            ? 'نعم، يتم مزامنة جميع الدروس والنتائج والشهادات تلقائياً في حسابك المشفر في السحابة.'
            : 'جی ہاں! گوگل یا ای میل لاگ اِن کی صورت میں آپ کے تمام کورسز، کوئز کے ستارے، اور اسناد فائر بیس کلاؤڈ پر فوری محفوظ ہو جاتے ہیں۔')
      }
    ]
  };

  container.innerHTML = `
    <div class="min-h-screen bg-slate-950 text-white w-full relative overflow-hidden font-urdu" dir="${isRtl ? 'rtl' : 'ltr'}">
      <!-- Ambient Glow Spheres -->
      <div class="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
      <div class="absolute bottom-1/4 left-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-gold"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 relative z-10">
        
        <!-- Header -->
        <div class="max-w-4xl mx-auto text-center space-y-4 animate-fade-in-down">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black shadow-sm animate-float">
            <i data-lucide="help-circle" class="w-4 h-4 text-emerald-400"></i>
            <span>${i18n.badge}</span>
          </div>
          <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight">
            ${i18n.title}
          </h1>
          <p class="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            ${i18n.subtitle}
          </p>
        </div>

        <!-- Central Animated 3D Hub & Dial -->
        <div class="max-w-4xl mx-auto flex flex-col items-center space-y-8 animate-scale-in">
          
          <!-- 3D Glowing Central Sphere -->
          <div class="relative group cursor-pointer" onclick="window.Views.pulseFaqSphere()">
            <div id="faq-orbit-ring" class="absolute -inset-4 sm:-inset-6 rounded-full border-2 border-dashed border-amber-400/40 animate-[spin_12s_linear_infinite] pointer-events-none"></div>
            <div class="absolute -inset-8 sm:-inset-10 rounded-full border border-emerald-500/20 animate-[spin_20s_linear_infinite_reverse] pointer-events-none"></div>
            
            <div id="faq-core-sphere" class="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-emerald-950 via-slate-900 to-emerald-900 border-2 border-amber-400 shadow-[0_0_50px_rgba(16,185,129,0.35)] flex flex-col items-center justify-center text-center p-3 transition-all duration-500 transform group-hover:scale-105 group-hover:shadow-[0_0_70px_rgba(245,158,11,0.55)] active:scale-95">
              <span class="text-3xl mb-1 animate-bounce">💡</span>
              <span class="text-xs font-black text-amber-300 leading-tight">
                ${currentLang === 'en' ? 'Interactive Hub' : (currentLang === 'ar' ? 'المركز التفاعلي' : 'مرکزی استفسار دائرہ')}
              </span>
              <span class="text-[10px] text-emerald-400 font-bold mt-0.5">${i18n.items.length}+ Answers</span>
            </div>
          </div>

          <!-- Category Dial Pills -->
          <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl">
            <button onclick="window.Views.filterFaqCategory('all', this)" class="faq-cat-btn active px-4 py-2 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-lg border border-emerald-400/40 hover-lift active-press flex items-center gap-2 transition" data-faq-cat="all">
              <i data-lucide="layout-grid" class="w-3.5 h-3.5"></i>
              <span>${currentLang === 'en' ? 'All Questions' : (currentLang === 'ar' ? 'جميع الأسئلة' : 'تمام سوالات')}</span>
            </button>
            <button onclick="window.Views.filterFaqCategory('courses', this)" class="faq-cat-btn px-4 py-2 rounded-2xl bg-slate-900/90 text-slate-300 hover:text-white font-bold text-xs border border-slate-800 hover:border-emerald-500 hover-lift active-press flex items-center gap-2 transition" data-faq-cat="courses">
              <i data-lucide="book-open" class="w-3.5 h-3.5 text-emerald-400"></i>
              <span>${currentLang === 'en' ? 'Courses & Quran' : (currentLang === 'ar' ? 'الدورات والقرآن' : 'کورسز و تجوید')}</span>
            </button>
            <button onclick="window.Views.filterFaqCategory('certificates', this)" class="faq-cat-btn px-4 py-2 rounded-2xl bg-slate-900/90 text-slate-300 hover:text-white font-bold text-xs border border-slate-800 hover:border-amber-400 hover-lift active-press flex items-center gap-2 transition" data-faq-cat="certificates">
              <i data-lucide="award" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>${currentLang === 'en' ? 'Royal Certificates' : (currentLang === 'ar' ? 'الشهادات الرقمية' : 'شاہی اسناد و QR')}</span>
            </button>
            <button onclick="window.Views.filterFaqCategory('app', this)" class="faq-cat-btn px-4 py-2 rounded-2xl bg-slate-900/90 text-slate-300 hover:text-white font-bold text-xs border border-slate-800 hover:border-cyan-400 hover-lift active-press flex items-center gap-2 transition" data-faq-cat="app">
              <i data-lucide="smartphone" class="w-3.5 h-3.5 text-cyan-400"></i>
              <span>${currentLang === 'en' ? 'Mobile App & Offline' : (currentLang === 'ar' ? 'التطبيق وبلا إنترنت' : 'موبائل ایپ و آف لائن')}</span>
            </button>
            <button onclick="window.Views.filterFaqCategory('scholars', this)" class="faq-cat-btn px-4 py-2 rounded-2xl bg-slate-900/90 text-slate-300 hover:text-white font-bold text-xs border border-slate-800 hover:border-purple-400 hover-lift active-press flex items-center gap-2 transition" data-faq-cat="scholars">
              <i data-lucide="user-check" class="w-3.5 h-3.5 text-purple-400"></i>
              <span>${currentLang === 'en' ? 'Scholars & Library' : (currentLang === 'ar' ? 'العلماء والمكتبة' : 'اساتذہ و کتب خانہ')}</span>
            </button>
          </div>

          <!-- Live Search Input -->
          <div class="w-full max-w-xl relative">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2"></i>
            <input 
              type="text" 
              id="faq-search-box" 
              placeholder="${currentLang === 'en' ? 'Search questions instantly...' : (currentLang === 'ar' ? 'ابحث في الأسئلة...' : 'سوالات تلاش کریں (مثلاً: سند، آف لائن، تجوید)...')}" 
              oninput="window.Views.searchFaq(this.value)"
              class="w-full py-3.5 ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} rounded-2xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition shadow-inner ${textAlign}"
            />
          </div>
        </div>

        <!-- Directional Accordion Grid -->
        <div id="faq-accordion-container" class="max-w-4xl mx-auto space-y-4">
          <!-- Rendered dynamically -->
        </div>

        <!-- Direct Floating Concierge Capsule -->
        <div class="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div class="relative z-10 space-y-2">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black animate-float">
              <i data-lucide="headphones" class="w-4 h-4 text-emerald-400"></i>
              <span>24/7 Scholar Concierge</span>
            </div>
            <h3 class="text-xl sm:text-3xl font-black text-white">
              ${currentLang === 'en' ? 'Need Direct Academic Assistance?' : (currentLang === 'ar' ? 'هل تحتاج إلى استشارة مباشرة؟' : 'براہِ راست رابطہ و رہنمائی درکار ہے؟')}
            </h3>
            <p class="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              ${currentLang === 'en' ? 'Connect directly with our scholar desk, send an inquiry ticket, or chat instantly on WhatsApp.' : (currentLang === 'ar' ? 'تواصل فوراً مع مكتب الإشراف الأكاديمي أو أرسل رسالة عبر الواتساب.' : 'داخلہ رہنمائی، دینی مسائل، تجاویز یا تکنیکی سپورٹ کے لیے ہمارے ماہرین ہمہ وقت حاضر ہیں۔')}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 relative z-10 pt-2">
            <button onclick="window.Views.sendWhatsAppDirect()" class="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/40 text-white font-extrabold text-xs shadow-lg hover-lift active-press flex flex-col items-center justify-center gap-2 transition group">
              <div class="w-10 h-10 rounded-2xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition shadow-md">
                <i data-lucide="message-circle" class="w-5 h-5 text-emerald-400"></i>
              </div>
              <span class="text-xs font-black text-emerald-300">1-Click WhatsApp</span>
              <span class="text-[10px] text-slate-400 font-sans">+91 7521019766</span>
            </button>

            <button onclick="window.Views.openSupportModal()" class="p-4 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-slate-900 to-amber-500/10 border-2 border-amber-400/60 hover:border-amber-400 text-white font-extrabold text-xs shadow-xl hover-lift active-press flex flex-col items-center justify-center gap-2 transition group">
              <div class="w-10 h-10 rounded-2xl bg-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition shadow-md">
                <i data-lucide="send" class="w-5 h-5 text-amber-400"></i>
              </div>
              <span class="text-xs font-black text-amber-300">${currentLang === 'en' ? 'Write Message / Ticket' : (currentLang === 'ar' ? 'إرسال تذكرة / رسالة' : 'آن لائن پیغام و ٹکٹ درج کریں')}</span>
              <span class="text-[10px] text-slate-400 font-sans">Direct Scholar Desk</span>
            </button>

            <a href="mailto:support@learnhub.com" class="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 hover:border-indigo-400 hover:bg-indigo-950/30 text-white font-extrabold text-xs shadow-lg hover-lift active-press flex flex-col items-center justify-center gap-2 transition group">
              <div class="w-10 h-10 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition shadow-md">
                <i data-lucide="mail" class="w-5 h-5 text-indigo-400"></i>
              </div>
              <span class="text-xs font-black text-indigo-300">Official Email</span>
              <span class="text-[10px] text-slate-400 font-mono">support@learnhub.com</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  `;

  window.Views._faqItems = i18n.items;
  window.Views.renderFaqList(i18n.items);

  if (window.lucide) window.lucide.createIcons();
};

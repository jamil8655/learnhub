/**
 * LearnHub Help & Support Module (Urdu & Islamic Academy)
 * 100% Functional, Localized in Urdu with RTL Support.
 * Direct connection to JRahmanAnsari132@gmail.com via mailto & 1-Click WhatsApp to Jamil Rahman Ansari (+91 7521019766).
 * All tickets and inquiries are saved to window.DB.supportTickets for Admin Triage.
 */

window.Views = window.Views || {};

window.Views.renderSupport = async function() {
  const container = document.getElementById('main-content');
  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  const cms = window.DB.get('cmsContent') || {};
  
  // Default Comprehensive Urdu FAQs if not in CMS
  const defaultFaqs = [
    {
      question: 'لرن ہب پر کورسز اور اسباق تک رسائی کا طریقہ کار کیا ہے؟',
      answer: 'آپ کورسز کی فہرست میں سے اپنی پسند کے کسی بھی کورس پر کلک کر کے مکمل نصاب، ویڈیوز اور اسباق کا مطالعہ شروع کر سکتے ہیں۔ مفت کورسز میں فوری داخلہ حاصل کیا جا سکتا ہے۔'
    },
    {
      question: 'کیا کوئزز اور امتحانات بغیر کورس داخلے کے دیے جا سکتے ہیں؟',
      answer: 'جی بالکل! لرن ہب کا تشخیصی کوئز انجن مکمل آزاد اور خودمختار ہے۔ آپ کسی بھی وقت "آزاد کوئزز" کے شعبے میں جا کر ٹائمر والا امتحان دے سکتے ہیں اور فوری نمبرات و تفصیلی وضاحت حاصل کر سکتے ہیں۔'
    },
    {
      question: 'شاہی سرٹیفکیٹ کی آن لائن اور QR تصدیق کیسے کی جاتی ہے؟',
      answer: 'کورس یا کوئز مکمل کرنے پر آپ کو ایک منفرد سیریل نمبر والی سند جاری کی جاتی ہے۔ کوئی بھی ادارہ یا فرد "#/verify-cert/ID" پر جا کر یا سند پر موجود QR کوڈ اسکین کر کے سند کی صداقت کی تصدیق کر سکتا ہے۔'
    },
    {
      question: 'قرآن کریم، تجوید اور احادیثِ مبارکہ کے مواد کی سند کیا ہے؟',
      answer: 'لرن ہب کا تمام دینی مواد مستند کتب (صحیح بخاری، صحیح مسلم، ریاض الصالحین، اربعین نووی) اور جید اساتذہ کرام کے مراجع سے تصدیق شدہ ہے۔ عربی متن عثمانی رسم الخط میں درست اعراب کے ساتھ دیا گیا ہے۔'
    },
    {
      question: 'فیس، داخلہ رہنمائی یا فنی مدد کے لیے کس سے رابطہ کیا جائے؟',
      answer: 'آپ اس صفحے پر موجود فارم کے ذریعے سپورٹ ٹکٹ درج کر سکتے ہیں، براہِ راست ای میل (JRahmanAnsari132@gmail.com) بھیج سکتے ہیں یا نیچے دیے گئے بٹن پر کلک کر کے فوری طور پر جمیل رحمان انصاری صاحب سے واٹس ایپ پر رابطہ کر سکتے ہیں۔'
    }
  ];

  const faqs = (cms.faqs && cms.faqs.length) ? cms.faqs : defaultFaqs;
  const allTickets = window.DB.get('supportTickets') || [];
  const tickets = user 
    ? allTickets.filter(t => t.userId === user.id || t.userEmail === user.email) 
    : allTickets.slice(0, 5);

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-urdu" dir="rtl">
      
      <!-- Support Header & Direct Connect Channels -->
      <div class="text-center max-w-3xl mx-auto space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-sm">
          <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i>
          <span>24/7 براہِ راست مدد و رہنمائی کا مرکز</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          مدد، کسٹمر سپورٹ و استفسارات
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          عام سوالات کے فوری جوابات تلاش کریں یا نیا سپورٹ ٹکٹ درج کریں۔ آپ کا پیغام براہِ راست ایڈمن پینل، آفیشل ای میل اور واٹس ایپ پر موصول ہوگا۔
        </p>
      </div>

      <!-- 3 Direct Fast-Contact Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        
        <!-- Card 1: 1-Click WhatsApp -->
        <div class="lh-card p-6 rounded-3xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white border border-emerald-500/40 shadow-xl flex flex-col justify-between space-y-4 group hover:border-emerald-400 transition">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                <i data-lucide="message-circle" class="w-6 h-6"></i>
              </div>
              <span class="badge bg-emerald-400/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">فوری جواب</span>
            </div>
            <h3 class="text-base font-bold text-white pt-2">واٹس ایپ 1-کلک چیٹ</h3>
            <p class="text-xs text-emerald-100/80 leading-relaxed">
              براہِ راست جمیل رحمان انصاری صاحب سے واٹس ایپ پر فوری رابطہ کریں اور سوالات کے جوابات حاصل کریں۔
            </p>
            <div class="text-xs font-mono text-emerald-300 font-bold" dir="ltr">+91 7521019766</div>
          </div>

          <a 
            href="https://wa.me/917521019766?text=${encodeURIComponent('السلام علیکم جمیل صاحب،\nمجھے LearnHub پلیٹ فارم اور کورسز کے حوالے سے رہنمائی چاہیے۔')}" 
            target="_blank"
            class="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition"
          >
            <i data-lucide="message-circle" class="w-4 h-4"></i>
            <span>واٹس ایپ پر میسج بھیجیں</span>
          </a>
        </div>

        <!-- Card 2: Official Mailto -->
        <div class="lh-card p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-500/40 shadow-xl flex flex-col justify-between space-y-4 group hover:border-indigo-400 transition">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                <i data-lucide="mail" class="w-6 h-6"></i>
              </div>
              <span class="badge bg-indigo-400/20 text-indigo-300 text-[10px] font-bold border border-indigo-400/30">آفیشل ای میل</span>
            </div>
            <h3 class="text-base font-bold text-white pt-2">براہِ راست ای میل سپورٹ</h3>
            <p class="text-xs text-indigo-100/80 leading-relaxed">
              تفصیلی استفسار یا رسمی دستاویزات کے لیے آفیشل ای میل ایڈریس پر رابطہ فرمائیں۔
            </p>
            <div class="text-xs font-mono text-indigo-300 font-bold truncate break-all" dir="ltr">JRahmanAnsari132@gmail.com</div>
          </div>

          <a 
            href="mailto:JRahmanAnsari132@gmail.com?subject=${encodeURIComponent('LearnHub Support Inquiry')}&body=${encodeURIComponent('السلام علیکم ورحمۃ اللہ،\n\nمحترم جمیل رحمان انصاری صاحب،\n\n[اپنا پیغام یہاں درج کریں]\n\n---\nشکریہ')}"
            class="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition"
          >
            <i data-lucide="mail" class="w-4 h-4"></i>
            <span>ای میل کلائنٹ کھولیں</span>
          </a>
        </div>

        <!-- Card 3: Priority Resolution Desk -->
        <div class="lh-card p-6 rounded-3xl bg-gradient-to-br from-amber-950/80 to-slate-900 text-white border border-amber-500/40 shadow-xl flex flex-col justify-between space-y-4 group hover:border-amber-400 transition">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                <i data-lucide="clock" class="w-6 h-6"></i>
              </div>
              <span class="badge bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">24 گھنٹے ردعمل</span>
            </div>
            <h3 class="text-base font-bold text-white pt-2">ایڈمن سنٹرل ٹریج</h3>
            <p class="text-xs text-amber-100/80 leading-relaxed">
              تمام سپورٹ ٹکٹس مرکزی ایڈمن ڈیٹا بیس میں خودکار طور پر درج ہوتے ہیں اور ان کی مسلسل نگرانی کی جاتی ہے۔
            </p>
            <div class="text-xs text-amber-300 font-bold">100% تصدیق شدہ اسناد و مواد</div>
          </div>

          <button 
            onclick="document.getElementById('tkt-subject')?.focus(); window.scrollTo({top: 500, behavior: 'smooth'});"
            class="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition"
          >
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>نیا ٹکٹ درج کریں</span>
          </button>
        </div>

      </div>

      <!-- FAQ Accordion Section -->
      <div class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 class="font-extrabold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="help-circle" class="w-5 h-5 text-emerald-600"></i> اکثر پوچھے جانے والے اہم سوالات (FAQ)
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">پلیٹ فارم، امتحانات اور اسناد کے متعلق عمومی رہنمائی</p>
          </div>
          <span class="text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">${faqs.length} اہم سوالات</span>
        </div>

        <div class="space-y-3">
          ${faqs.map((faq, idx) => `
            <div class="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-200 hover:border-emerald-500/50">
              <button 
                onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('.chevron').classList.toggle('rotate-180');" 
                class="w-full p-4 text-right flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
              >
                <span class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center font-mono">${idx + 1}</span>
                  ${faq.question}
                </span>
                <i data-lucide="chevron-down" class="chevron w-4 h-4 text-slate-400 transition-transform"></i>
              </button>
              <div class="hidden p-4 pt-2 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60 leading-relaxed bg-slate-50/50 dark:bg-slate-850">
                ${faq.answer}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Support Tickets Form & Active Tickets Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left (Form): 100% Functional Ticket Submission Form -->
        <div class="lg:col-span-7 lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div class="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div class="flex items-center justify-between">
              <h3 class="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <i data-lucide="send" class="w-5 h-5 text-emerald-600"></i> نیا سپورٹ ٹکٹ درج کریں
              </h3>
              <span class="badge bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">1-Click Connected</span>
            </div>
            <p class="text-xs text-slate-500 mt-1">
              ٹکٹ جمع ہوتے ہی یہ خودکار طور پر ایڈمن ڈیٹا بیس میں لاگ ہوگی اور ای میل و واٹس ایپ پر بھی کنیکٹ ہوگی۔
            </p>
          </div>

          <form id="support-ticket-form" onsubmit="window.Views.submitSupportTicket(event)" class="space-y-4">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">آپ کا نامِ مبارک</label>
                <input 
                  type="text" 
                  id="tkt-name" 
                  required 
                  value="${user ? user.name : ''}" 
                  placeholder="مثلاً: محمد علی رضوی" 
                  class="form-input text-xs font-urdu"
                >
              </div>

              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ای میل ایڈریس یا فون نمبر</label>
                <input 
                  type="text" 
                  id="tkt-email" 
                  required 
                  value="${user ? user.email : ''}" 
                  placeholder="مثلاً: user@example.com یا فون نمبر" 
                  class="form-input text-xs font-urdu"
                >
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">مسئلے کا شعبہ / کیٹیگری</label>
                <select id="tkt-category" class="form-input text-xs font-urdu">
                  <option value="Technical">تکنیکی مسئلہ / ویب سائٹ پرابلم</option>
                  <option value="Course Content">تعلیمی نصاب و اسباق کی معلومات</option>
                  <option value="Billing">فیس، کوپن و ادائیگیاں</option>
                  <option value="Certificates">شاہی اسناد و سرٹیفکیٹ تصدیق</option>
                  <option value="Quizzes">کوئزز و تشخیصی امتحانات</option>
                  <option value="General">عمومی استفسار و مشاورت</option>
                </select>
              </div>

              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ترجیح (Priority)</label>
                <select id="tkt-priority" class="form-input text-xs font-urdu">
                  <option value="medium" selected>درمیانی (Normal / Medium)</option>
                  <option value="high">اہم ترین / فوری (Urgent / High)</option>
                  <option value="low">عام (Low Priority)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ٹکٹ کا مختصر عنوان</label>
              <input 
                type="text" 
                id="tkt-subject" 
                required 
                placeholder="اپنے سوال یا مسئلے کا مختصر خلاصہ لکھیں..." 
                class="form-input text-xs font-urdu"
              >
            </div>

            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">تفصیلی پیغام یا سوال</label>
              <textarea 
                id="tkt-message" 
                rows="4" 
                required 
                placeholder="براہِ کرم اپنے مسئلے کی مکمل تفصیل یا سوال کے اہم نکات درج فرمائیں..." 
                class="form-input text-xs font-urdu leading-relaxed"
              ></textarea>
            </div>

            <!-- Action Buttons: Direct Mailto & 1-Click WhatsApp -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button 
                type="submit" 
                class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2"
              >
                <i data-lucide="send" class="w-4 h-4"></i>
                <span>ٹکٹ جمع کریں اور ای میل بھیجیں</span>
              </button>

              <button 
                type="button" 
                onclick="window.Views.sendSupportWhatsAppDirect()" 
                class="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2 border border-emerald-400/40"
              >
                <i data-lucide="message-circle" class="w-4 h-4 text-emerald-300"></i>
                <span>واٹس ایپ پر 1-کلک میسج</span>
              </button>
            </div>

            <div class="pt-2 text-center text-[11px] text-slate-500 dark:text-slate-400 font-urdu">
              پیغام براہِ راست <strong>JRahmanAnsari132@gmail.com</strong> اور واٹس ایپ <strong>+91 7521019766</strong> (جمیل رحمان انصاری) پر ارسال ہوتا ہے۔
            </div>
          </form>
        </div>

        <!-- Right: My Active Support Tickets & Inquiries -->
        <div class="lg:col-span-5 lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div class="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h3 class="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <i data-lucide="inbox" class="w-4 h-4 text-indigo-600"></i> آپ کے سابقہ سپورٹ ٹکٹس (${tickets.length})
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">درج شدہ ٹکٹس اور ان کے جوابات کا ریکارڈ</p>
            </div>
            <span class="badge bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-bold">${tickets.length}</span>
          </div>

          ${tickets.length === 0 ? `
            <div class="text-center py-10 space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <i data-lucide="ticket" class="w-6 h-6"></i>
              </div>
              <p class="text-xs text-slate-400">فی الحال آپ کا کوئی کھلا یا سابقہ سپورٹ ٹکٹ موجود نہیں ہے۔</p>
            </div>
          ` : `
            <div class="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              ${tickets.map(tkt => `
                <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2 border border-slate-100 dark:border-slate-700/60 hover:border-emerald-500/40 transition">
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">${tkt.ticketNumber}</span>
                    <span class="badge ${tkt.status === 'resolved' ? 'badge-success' : tkt.status === 'in_progress' ? 'badge-warning' : 'badge-primary'} text-[10px] uppercase font-bold">
                      ${tkt.status === 'resolved' ? 'حل شدہ' : tkt.status === 'in_progress' ? 'زیرِ غور' : 'اوپن'}
                    </span>
                  </div>
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">${tkt.subject}</h4>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">${tkt.message}</p>
                  
                  <div class="pt-2 flex justify-between items-center border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-400">
                    <span>${new Date(tkt.createdAt).toLocaleDateString()}</span>
                    <div class="flex items-center gap-2">
                      <button onclick="window.Views.viewTicketThread('${tkt.id}')" class="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1">
                        <span>گفتگو دیکھیں (${(tkt.replies || []).length})</span>
                        <i data-lucide="arrow-left" class="w-3 h-3"></i>
                      </button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

/**
 * Handle Support Ticket Submission:
 * 1. Insert into DB (supportTickets) with full details.
 * 2. Log in Audit logs.
 * 3. Connect to JRahmanAnsari132@gmail.com via mailto.
 * 4. Display 1-Click WhatsApp modal button to send directly to Jamil Rahman Ansari (917521019766).
 */
window.Views.submitSupportTicket = function(e) {
  e.preventDefault();
  const user = window.Auth ? window.Auth.getCurrentUser() : null;

  const nameInput = document.getElementById('tkt-name');
  const emailInput = document.getElementById('tkt-email');
  const categoryInput = document.getElementById('tkt-category');
  const priorityInput = document.getElementById('tkt-priority');
  const subjectInput = document.getElementById('tkt-subject');
  const messageInput = document.getElementById('tkt-message');

  const name = nameInput ? nameInput.value.trim() : (user ? user.name : 'طالب علم');
  const email = emailInput ? emailInput.value.trim() : (user ? user.email : 'student@learnhub.com');
  const category = categoryInput ? categoryInput.value : 'Technical';
  const priority = priorityInput ? priorityInput.value : 'medium';
  const subject = subjectInput ? subjectInput.value.trim() : 'سپورٹ استفسار';
  const message = messageInput ? messageInput.value.trim() : '';

  if (!subject || !message) {
    window.App.showToast('براہِ کرم عنوان اور تفصیلی پیغام درج فرمائیں۔', 'warning');
    return;
  }

  const ticketNumber = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const ticketId = `tkt-${Date.now()}`;

  const ticket = {
    id: ticketId,
    ticketNumber,
    userId: user ? user.id : 'guest',
    userName: name,
    userEmail: email,
    contactInfo: email,
    category,
    priority,
    subject,
    message,
    status: 'open',
    createdAt: new Date().toISOString(),
    replies: []
  };

  // Save to DB
  window.DB.insert('supportTickets', ticket);
  window.DB.logAudit(name, 'TICKET_SUBMITTED', `${ticketNumber}: ${subject}`);

  // Prepare Mailto URL
  const mailSubject = encodeURIComponent(`[${ticketNumber}] LearnHub Support: ${subject}`);
  const mailBody = encodeURIComponent(`السلام علیکم ورحمۃ اللہ،\n\nمحترم جمیل رحمان انصاری صاحب،\n\nٹکٹ نمبر: ${ticketNumber}\nنام: ${name}\nای میل / رابطہ نمبر: ${email}\nکیٹیگری: ${category}\nترجیح: ${priority}\nعنوان: ${subject}\n\nپیغام:\n${message}\n\n---\nماخوذ از LearnHub Islamic Academy: https://jamil8655.github.io/learnhub/`);
  const mailtoUrl = `mailto:JRahmanAnsari132@gmail.com?subject=${mailSubject}&body=${mailBody}`;

  // Prepare WhatsApp 1-Click Message to Jamil Rahman Ansari (917521019766)
  const waText = encodeURIComponent(`السلام علیکم جمیل صاحب،\nمیں نے LearnHub پر سپورٹ ٹکٹ درج کی ہے۔\n\n🎫 ٹکٹ نمبر: ${ticketNumber}\n👤 نام: ${name}\n📞 رابطہ: ${email}\n📂 شعبہ: ${category}\n📌 عنوان: ${subject}\n\n📝 پیغام:\n${message}\n\n(LearnHub Support Portal)`);
  const whatsappUrl = `https://wa.me/917521019766?text=${waText}`;

  // Trigger mailto client
  try {
    window.location.href = mailtoUrl;
  } catch (err) {
    console.warn('Mailto invocation:', err);
  }

  // Show Success Confirmation Modal with instant 1-click WhatsApp button
  window.App.showModal('ٹکٹ کامیابی سے درج ہو گئی! ✅', `
    <div class="space-y-5 font-urdu text-right" dir="rtl">
      <div class="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">ٹکٹ نمبر: ${ticketNumber}</span>
          <span class="badge bg-emerald-500 text-slate-950 text-[10px] font-bold">ایڈمن لاگ محفوظ</span>
        </div>
        <h4 class="font-bold text-sm text-slate-900 dark:text-white">${subject}</h4>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${message}</p>
      </div>

      <div class="text-xs text-slate-600 dark:text-slate-300 space-y-1">
        <p class="font-bold text-slate-900 dark:text-white">آپ کا پیغام درج ذیل چینلز سے متصل کر دیا گیا ہے:</p>
        <p class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500"></i> ایڈمن سپورٹ سنٹرل ڈیٹا بیس میں محفوظ۔</p>
        <p class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500"></i> ای میل JRahmanAnsari132@gmail.com کے لیے تیار۔</p>
      </div>

      <!-- 1-Click WhatsApp Direct Button to Jamil Rahman Ansari -->
      <div class="space-y-2 pt-2">
        <a 
          href="${whatsappUrl}" 
          target="_blank"
          class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl transition"
        >
          <i data-lucide="message-circle" class="w-4 h-4"></i>
          <span>جمیل رحمان انصاری صاحب کو واٹس ایپ پر بھیجیں (1-Click)</span>
        </a>

        <a 
          href="${mailtoUrl}"
          class="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition"
        >
          <i data-lucide="mail" class="w-4 h-4"></i>
          <span>ای میل کلائنٹ کھولیں (JRahmanAnsari132@gmail.com)</span>
        </a>
      </div>

      <div class="pt-2 text-center">
        <button onclick="window.App.closeModal(); window.Views.renderSupport();" class="btn-secondary py-2 px-6 text-xs rounded-xl">
          بند کریں
        </button>
      </div>
    </div>
  `);

  window.App.showToast(`ٹکٹ #${ticketNumber} کامیابی سے لاگ ہو گئی!`, 'success');
  if (window.lucide) window.lucide.createIcons();
};

/**
 * 1-Click Direct WhatsApp Message from Support View Form
 */
window.Views.sendSupportWhatsAppDirect = function() {
  const name = document.getElementById('tkt-name')?.value || 'طالب علم';
  const category = document.getElementById('tkt-category')?.value || 'استفسار';
  const subject = document.getElementById('tkt-subject')?.value || 'مدد و رہنمائی';
  const message = document.getElementById('tkt-message')?.value || 'السلام علیکم، مجھے لرن ہب کے حوالے سے رہنمائی درکار ہے۔';

  const text = encodeURIComponent(`السلام علیکم جمیل صاحب،\nمیرا نام ${name} ہے۔\n\n📂 شعبہ: ${category}\n📌 عنوان: ${subject}\n\n📝 پیغام:\n${message}\n\n(ماخوذ از LearnHub Support: https://jamil8655.github.io/learnhub/)`);
  const whatsappUrl = `https://wa.me/917521019766?text=${text}`;

  // Log in DB so admin can see chat inquiry was initiated
  window.DB.insert('supportTickets', {
    id: `inq-wa-${Date.now()}`,
    ticketNumber: `WA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    userName: name,
    userEmail: 'WhatsApp Direct Chat',
    contactInfo: '+91 7521019766',
    category,
    priority: 'medium',
    subject: `WhatsApp Inquiry: ${subject}`,
    message: message,
    status: 'open',
    createdAt: new Date().toISOString(),
    replies: []
  });

  window.open(whatsappUrl, '_blank');
  window.App.showToast('واٹس ایپ چیٹ کھل رہی ہے...', 'success');
};

/**
 * View Ticket Thread with Replies & Direct WhatsApp/Email Response
 */
window.Views.viewTicketThread = function(ticketId) {
  const tkt = window.DB.findById('supportTickets', ticketId);
  if (!tkt) return;

  const statusUrdu = tkt.status === 'resolved' ? 'حل شدہ ✓' : tkt.status === 'in_progress' ? 'کارروائی جاری ہے' : 'زیرِ غور';
  const waReplyText = encodeURIComponent(`السلام علیکم جمیل صاحب،\nٹکٹ نمبر ${tkt.ticketNumber} (${tkt.subject}) کے سلسلے میں فالو اپ پیغام:\n`);
  const whatsappReplyUrl = `https://wa.me/917521019766?text=${waReplyText}`;

  window.App.showModal(`ٹکٹ نمبر: ${tkt.ticketNumber}`, `
    <div class="space-y-4 font-urdu text-right" dir="rtl">
      <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h4 class="font-bold text-base text-slate-900 dark:text-white">${tkt.subject}</h4>
          <span class="text-xs text-slate-400">کیٹیگری: ${tkt.category} | نام: ${tkt.userName}</span>
        </div>
        <span class="badge ${tkt.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'} text-xs font-bold">${statusUrdu}</span>
      </div>

      <div class="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl text-xs space-y-1.5 border border-slate-200 dark:border-slate-800">
        <div class="font-bold text-slate-700 dark:text-slate-300">ابتدائی درخواست:</div>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">${tkt.message}</p>
      </div>

      <!-- Thread Replies -->
      <div class="space-y-3 max-h-56 overflow-y-auto pr-1">
        <h5 class="text-xs font-bold text-slate-400">جوابات و مراسلت (${(tkt.replies || []).length})</h5>
        ${(tkt.replies || []).length === 0 ? `
          <p class="text-xs text-slate-400 py-2">ہمارے نمائندے کی جانب سے اس ٹکٹ پر جلد جواب فراہم کیا جائے گا۔</p>
        ` : tkt.replies.map(r => `
          <div class="p-3 rounded-2xl text-xs space-y-1 ${r.senderRole === 'admin' ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800' : 'bg-slate-100 dark:bg-slate-800'}">
            <div class="flex justify-between font-bold text-slate-900 dark:text-white">
              <span>${r.senderName} (${r.senderRole === 'admin' ? 'ایڈمنسٹریٹر' : 'طالب علم'})</span>
              <span class="text-[10px] text-slate-400 font-mono">${new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed">${r.message}</p>
          </div>
        `).join('')}
      </div>

      <!-- Add User Reply -->
      <div class="pt-2 space-y-2">
        <div class="flex gap-2">
          <input type="text" id="user-tkt-reply-input" placeholder="اپنا فالو اپ پیغام درج کریں..." class="form-input text-xs font-urdu flex-1">
          <button onclick="window.Views.sendUserTicketReply('${tkt.id}')" class="btn-primary py-2 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500">
            بھیجیں
          </button>
        </div>

        <div class="flex items-center justify-between pt-1">
          <a href="${whatsappReplyUrl}" target="_blank" class="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1">
            <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
            <span>واٹس ایپ پر جمیل صاحب سے اس ٹکٹ پر بات کریں</span>
          </a>
        </div>
      </div>
    </div>
  `);

  if (window.lucide) window.lucide.createIcons();
};

window.Views.sendUserTicketReply = function(ticketId) {
  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  const input = document.getElementById('user-tkt-reply-input');
  const msg = input ? input.value.trim() : '';
  if (!msg) return;

  const tkt = window.DB.findById('supportTickets', ticketId);
  if (!tkt) return;

  tkt.replies = tkt.replies || [];
  tkt.replies.push({
    id: `tr-${Date.now()}`,
    senderName: user ? user.name : (tkt.userName || 'طالب علم'),
    senderRole: user ? user.role : 'student',
    message: msg,
    createdAt: new Date().toISOString()
  });

  window.DB.update('supportTickets', ticketId, { replies: tkt.replies, status: 'open' });
  window.App.showToast('جواب ٹکٹ میں شامل کر دیا گیا۔', 'success');
  window.Views.viewTicketThread(ticketId);
};



/**
 * LearnHub Admin Control Suite & Executive Dashboard (Urdu & Islamic Academy)
 * Complete centralized governance: Courses, Hadiths, Quizzes, Certificates, Users, Database Backup/Restore.
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderDashboard = async function() {
  const container = document.getElementById('main-content');
  const analytics = await window.API.getAdminAnalytics();
  const kpis = analytics.kpis;
  const courses = window.DB.get('courses');
  const users = window.DB.get('users');
  const certificates = window.DB.get('certificates');
  const hadiths = (window.ALL_COMBINED_HADITHS && window.ALL_COMBINED_HADITHS.length) ? window.ALL_COMBINED_HADITHS : (window.DB.get('hadiths') || []);

  container.innerHTML = `
    <div class="space-y-8 font-urdu" dir="rtl">
      
      <!-- Top Header & Master Quick Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-l from-slate-900 to-emerald-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-emerald-500/30">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 text-xs font-bold rounded-full shadow mb-2">
            <i data-lucide="shield" class="w-3.5 h-3.5"></i> مرکزی ایڈمنسٹریشن کنٹرول روم
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white">پلیٹ فارم کا جامع کنٹرول روم</h1>
          <p class="text-xs sm:text-sm text-emerald-100/80 mt-1">یہاں سے آپ نئے کورسز، احادیث، امتحانات، اسناد اور ڈیٹا بیس کو مکمل کنٹرول کر سکتے ہیں۔</p>
        </div>

        <!-- Master Action Buttons -->
        <div class="flex flex-wrap gap-2.5">
          <button onclick="window.Views.admin.openCourseBuilderModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> نیا کورس بنائیں
          </button>
          <button onclick="window.Views.admin.openHadithBuilderModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow">
            <i data-lucide="scroll" class="w-4 h-4"></i> نئی حدیث درج کریں
          </button>
          <button onclick="window.Views.admin.openIssueCertificateModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 shadow">
            <i data-lucide="award" class="w-4 h-4"></i> سند جاری کریں
          </button>
          <button onclick="window.Views.admin.openQuizBuilderModal()" class="btn-secondary py-2.5 px-3 text-xs rounded-xl flex items-center gap-1.5">
            <i data-lucide="zap" class="w-4 h-4 text-cyan-400"></i> نیا کوئز
          </button>
          <button onclick="window.Views.admin.exportDatabaseJSON()" class="btn-secondary py-2.5 px-3 text-xs rounded-xl flex items-center gap-1.5 text-emerald-400" title="بیک اپ فائل ڈاؤنلوڈ کریں">
            <i data-lucide="download" class="w-4 h-4"></i> بیک اپ
          </button>
        </div>
      </div>

      <!-- KPI Metrics Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <!-- Total Learners -->
        <div class="lh-card p-5 space-y-2 border-t-4 border-t-emerald-500 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>کل رجسٹرڈ طلباء</span>
            <i data-lucide="users" class="w-4 h-4 text-emerald-500"></i>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">${users.length} رجسٹرڈ</div>
          <span class="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> فعال اکاؤنٹس
          </span>
        </div>

        <!-- Total Courses -->
        <div class="lh-card p-5 space-y-2 border-t-4 border-t-indigo-500 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>فعال اسلامی کورسز</span>
            <i data-lucide="book-open" class="w-4 h-4 text-indigo-500"></i>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">${courses.length} کورسز</div>
          <a href="#/admin/courses" class="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline">کورسز کا انتظام کریں &larr;</a>
        </div>

        <!-- Total Hadiths -->
        <div class="lh-card p-5 space-y-2 border-t-4 border-t-amber-500 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>کل احادیثِ مبارکہ</span>
            <i data-lucide="scroll" class="w-4 h-4 text-amber-500"></i>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">${hadiths.length}+ احادیث</div>
          <a href="#/admin/hadiths" class="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-bold">احادیث منیجر کھولیں &larr;</a>
        </div>

        <!-- Certificates Issued -->
        <div class="lh-card p-5 space-y-2 border-t-4 border-t-purple-500 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>جاری کردہ اسناد (QR)</span>
            <i data-lucide="award" class="w-4 h-4 text-purple-500"></i>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">${certificates.length} اسناد</div>
          <a href="#/admin/certificates" class="text-[11px] text-purple-600 dark:text-purple-400 hover:underline font-bold">تمام اسناد دیکھیں &larr;</a>
        </div>
      </div>

      <!-- Quick Control Hub (Power Tiles) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <!-- Tile 1: Courses Management -->
        <div class="lh-card p-6 space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <i data-lucide="book-open" class="w-6 h-6"></i>
            </div>
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white">کورسز و اسباق کنٹرول</h3>
              <p class="text-xs text-slate-500">نصاب، ویڈیوز اور اسباق شامل کریں</p>
            </div>
          </div>
          <div class="flex gap-2 pt-2">
            <a href="#/admin/courses" class="btn-secondary flex-1 py-2 text-xs rounded-xl text-center">لسٹ دیکھیں</a>
            <button onclick="window.Views.admin.openCourseBuilderModal()" class="btn-primary flex-1 py-2 text-xs rounded-xl">نیا کورس</button>
          </div>
        </div>

        <!-- Tile 2: Hadiths Management -->
        <div class="lh-card p-6 space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500 transition">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <i data-lucide="scroll" class="w-6 h-6"></i>
            </div>
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white">احادیثِ مبارکہ کنٹرول</h3>
              <p class="text-xs text-slate-500">نئی احادیث درج یا ایڈٹ کریں</p>
            </div>
          </div>
          <div class="flex gap-2 pt-2">
            <a href="#/admin/hadiths" class="btn-secondary flex-1 py-2 text-xs rounded-xl text-center">احادیث لسٹ</a>
            <button onclick="window.Views.admin.openHadithBuilderModal()" class="btn-primary flex-1 py-2 text-xs rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400">نئی حدیث</button>
          </div>
        </div>

        <!-- Tile 3: Certificate Generator -->
        <div class="lh-card p-6 space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-500 transition">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <i data-lucide="award" class="w-6 h-6"></i>
            </div>
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white">شاہی اسناد و سرٹیفکیٹس</h3>
              <p class="text-xs text-slate-500">QR Code والی اسناد جاری کریں</p>
            </div>
          </div>
          <div class="flex gap-2 pt-2">
            <a href="#/admin/certificates" class="btn-secondary flex-1 py-2 text-xs rounded-xl text-center">جاری شدہ اسناد</a>
            <button onclick="window.Views.admin.openIssueCertificateModal()" class="btn-primary flex-1 py-2 text-xs rounded-xl bg-purple-600 text-white hover:bg-purple-500">سند جاری کریں</button>
          </div>
        </div>

        <!-- Tile 4: Help Desk & Inquiries (Direct Connected to Email & WhatsApp) -->
        <div class="lh-card p-6 space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500 transition">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center">
              <i data-lucide="message-circle" class="w-6 h-6"></i>
            </div>
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white">ہیلپ ڈیسک و استفسارات</h3>
              <p class="text-xs text-slate-500">موصولہ ٹکٹس، ای میلز اور واٹس ایپ</p>
            </div>
          </div>
          <div class="flex gap-2 pt-2">
            <a href="#/admin/support" class="btn-secondary flex-1 py-2 text-xs rounded-xl text-center text-cyan-600 dark:text-cyan-400 font-bold">ٹکٹس دیکھیں</a>
            <a href="#/support" class="btn-primary flex-1 py-2 text-xs rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-center">سپورٹ پورٹل</a>
          </div>
        </div>

      </div>

      <!-- Database Tools & Backup Center -->
      <div class="lh-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="database" class="w-5 h-5 text-emerald-600"></i> ڈیٹا بیس بیک اپ اور ترتیبات
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">پوری ویب سائٹ کا تمام ڈیٹا ایک کلک پر محفوظ یا ری اسٹور کریں۔</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button onclick="window.Views.admin.exportDatabaseJSON()" class="btn-primary py-2 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5">
              <i data-lucide="download" class="w-3.5 h-3.5"></i> بیک اپ محفوظ کریں (JSON)
            </button>
            <label class="btn-secondary py-2 px-4 text-xs rounded-xl flex items-center gap-1.5 cursor-pointer">
              <i data-lucide="upload" class="w-3.5 h-3.5"></i> فائل اپلوڈ کریں
              <input type="file" accept=".json" class="hidden" onchange="window.Views.admin.importDatabaseJSON(event)">
            </label>
            <button onclick="window.Views.admin.resetDatabaseToSeed()" class="btn-secondary py-2 px-3 text-xs rounded-xl text-rose-600 hover:bg-rose-50 border-rose-200">
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> ڈیٹا ری سیٹ
            </button>
          </div>
        </div>

        <div class="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="info" class="w-4 h-4 text-emerald-500"></i>
            <span>تمام تبدیلیاں فوراً براؤزر میں لاگو ہو جاتی ہیں اور لائیو گٹ ہب ورژن کے ساتھ مکمل ہم آہنگ رہتی ہیں۔</span>
          </div>
          <span class="font-bold text-emerald-600">LearnHub Enterprise v2.0</span>
        </div>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// ==========================================
// 1. HADITHS MANAGER VIEW IN ADMIN
// ==========================================
window.Views.admin.renderHadiths = async function() {
  const container = document.getElementById('main-content');
  const hadiths = window.ALL_COMBINED_HADITHS || window.DB.get('hadiths') || [];

  container.innerHTML = `
    <div class="space-y-6 font-urdu" dir="rtl">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">احادیثِ مبارکہ منیجر</h1>
          <p class="text-xs sm:text-sm text-slate-500">نئی احادیث درج کریں، متن و ترجمہ ایڈٹ کریں اور تصدیق کریں۔</p>
        </div>
        <button onclick="window.Views.admin.openHadithBuilderModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 flex items-center gap-1.5 shadow">
          <i data-lucide="plus-circle" class="w-4 h-4"></i> نئی حدیث درج کریں
        </button>
      </div>

      <!-- Hadiths List Table -->
      <div class="lh-card overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <input 
            type="text" 
            placeholder="حدیث کا متن یا راوی تلاش کریں..." 
            class="form-input text-xs max-w-xs font-urdu"
            oninput="window.Views.admin.filterHadithAdminTable(this.value)"
          />
          <span class="text-xs text-slate-500">کل احادیث: <strong class="font-mono">${hadiths.length}</strong></span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs" id="admin-hadiths-table">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[11px]">
              <tr>
                <th class="p-3">حدیث نمبر / عنوان</th>
                <th class="p-3">راوی</th>
                <th class="p-3">عربی متن کا خلاصہ</th>
                <th class="p-3">کتاب / حوالہ</th>
                <th class="p-3 text-left">اختیارات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${hadiths.map(h => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td class="p-3">
                    <div class="font-bold text-slate-900 dark:text-white">${h.hadithNumber}</div>
                    <div class="text-[11px] text-amber-600">${h.chapter}</div>
                  </td>
                  <td class="p-3 font-semibold text-slate-700 dark:text-slate-300">
                    ${h.narrator}
                  </td>
                  <td class="p-3 text-slate-800 dark:text-slate-200 max-w-xs truncate font-arabic">
                    «${h.textArabic}»
                  </td>
                  <td class="p-3 font-bold text-slate-600 dark:text-slate-400">
                    ${h.book || 'اربعین نووی'}
                  </td>
                  <td class="p-3 text-left whitespace-nowrap" dir="ltr">
                    <button onclick="window.Views.admin.openHadithBuilderModal('${h.id}')" class="btn-secondary py-1 px-2.5 text-[11px] rounded-lg" title="ایڈٹ کریں">
                      <i data-lucide="edit" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="window.Views.admin.deleteHadith('${h.id}')" class="btn-secondary py-1 px-2.5 text-[11px] rounded-lg text-rose-600 hover:bg-rose-50" title="ڈیلیٹ کریں">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.openHadithBuilderModal = function(hadithId = null) {
  const hadiths = window.ALL_COMBINED_HADITHS || [];
  const existing = hadithId ? hadiths.find(h => h.id === hadithId) : null;

  window.App.showModal(existing ? 'حدیثِ مبارکہ میں ترمیم کریں' : 'نئی حدیثِ مبارکہ درج کریں', `
    <form onsubmit="window.Views.admin.saveHadith(event, '${hadithId || ''}')" class="space-y-4 font-urdu text-right" dir="rtl">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">حدیث نمبر / کوڈ</label>
          <input type="text" id="hd-num" required value="${existing ? existing.hadithNumber : 'حدیث ' + (hadiths.length + 1)}" class="form-input text-xs font-urdu">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">کتاب کا نام / حوالہ</label>
          <input type="text" id="hd-book" required value="${existing ? existing.book : 'صحیح بخاری / صحیح مسلم'}" class="form-input text-xs font-urdu">
        </div>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">عنوان / باب</label>
        <input type="text" id="hd-chapter" required value="${existing ? existing.chapter : ''}" placeholder="مثلاً: فضیلتِ اخلاص و نیت" class="form-input text-xs font-urdu">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">راویِ حدیث (عربی میں)</label>
        <input type="text" id="hd-narrator" required value="${existing ? existing.narrator : 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ'}" class="form-input text-xs font-arabic">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">عربی متن مع اعراب (Uthmani Arabic)</label>
        <textarea id="hd-arabic" rows="3" required class="form-input text-xs font-arabic leading-loose">${existing ? existing.textArabic : ''}</textarea>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">سلیس اردو ترجمہ و تشریح</label>
        <textarea id="hd-urdu" rows="3" required class="form-input text-xs font-urdu leading-relaxed">${existing ? existing.textUrdu : ''}</textarea>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">انگریزی ترجمہ (English Translation)</label>
        <input type="text" id="hd-english" value="${existing ? existing.textEnglish : ''}" class="form-input text-xs text-left" dir="ltr">
      </div>

      <div class="pt-2 flex gap-2">
        <button type="submit" class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400">
          محفوظ کریں
        </button>
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">منسوخ</button>
      </div>
    </form>
  `);
};

window.Views.admin.saveHadith = function(e, hadithId) {
  e.preventDefault();
  const num = document.getElementById('hd-num').value;
  const book = document.getElementById('hd-book').value;
  const chapter = document.getElementById('hd-chapter').value;
  const narrator = document.getElementById('hd-narrator').value;
  const textArabic = document.getElementById('hd-arabic').value;
  const textUrdu = document.getElementById('hd-urdu').value;
  const textEnglish = document.getElementById('hd-english').value;

  const newHadith = {
    id: hadithId || `hadith-${Date.now()}`,
    bookId: 'famous',
    hadithNumber: num,
    book,
    chapter,
    narrator,
    textArabic,
    textUrdu,
    textEnglish: textEnglish || 'Prophetic wisdom',
    grade: 'صحیح (Sahih)'
  };

  if (!window.ALL_COMBINED_HADITHS) window.ALL_COMBINED_HADITHS = [];
  
  if (hadithId) {
    const idx = window.ALL_COMBINED_HADITHS.findIndex(h => h.id === hadithId);
    if (idx !== -1) window.ALL_COMBINED_HADITHS[idx] = newHadith;
  } else {
    window.ALL_COMBINED_HADITHS.unshift(newHadith);
  }

  window.App.closeModal();
  window.App.showToast('حدیثِ مبارکہ کامیابی سے محفوظ ہو گئی!', 'success');
  window.Views.admin.renderHadiths();
};

window.Views.admin.deleteHadith = function(hadithId) {
  if (!confirm('کیا آپ واقعی یہ حدیث فہرست سے ہٹانا چاہتے ہیں؟')) return;
  if (window.ALL_COMBINED_HADITHS) {
    window.ALL_COMBINED_HADITHS = window.ALL_COMBINED_HADITHS.filter(h => h.id !== hadithId);
  }
  window.App.showToast('حدیث حذف کر دی گئی۔', 'info');
  window.Views.admin.renderHadiths();
};

// ==========================================
// 2. CERTIFICATES MANAGER VIEW IN ADMIN
// ==========================================
window.Views.admin.renderCertificates = async function() {
  const container = document.getElementById('main-content');
  const certificates = window.DB.get('certificates');

  container.innerHTML = `
    <div class="space-y-6 font-urdu" dir="rtl">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">اسناد و سرٹیفکیٹس کنٹرول</h1>
          <p class="text-xs sm:text-sm text-slate-500">تصدیق شدہ شاہی اسناد جاری کریں اور QR تصدیق کا جائزہ لیں۔</p>
        </div>
        <button onclick="window.Views.admin.openIssueCertificateModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 flex items-center gap-1.5 shadow">
          <i data-lucide="plus-circle" class="w-4 h-4"></i> نئی سند جاری کریں
        </button>
      </div>

      <div class="lh-card overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[11px]">
              <tr>
                <th class="p-3">سیریل نمبر</th>
                <th class="p-3">طالب علم کا نام</th>
                <th class="p-3">کورس / تعلیمی شعبہ</th>
                <th class="p-3">گریڈ / درجہ</th>
                <th class="p-3">تاریخِ فراغت</th>
                <th class="p-3 text-left">اختیارات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${certificates.map(cert => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td class="p-3 font-mono font-bold text-amber-600">
                    ${cert.certificateNumber || cert.serialNumber || 'LH-CERT-2026-8841'}
                  </td>
                  <td class="p-3 font-bold text-slate-900 dark:text-white">
                    ${cert.userName}
                  </td>
                  <td class="p-3 text-slate-700 dark:text-slate-300">
                    ${cert.courseTitle}
                  </td>
                  <td class="p-3">
                    <span class="badge bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-[10px] font-bold">
                      ${cert.grade || 'ممتاز (Distinction)'}
                    </span>
                  </td>
                  <td class="p-3 text-slate-500 font-mono">
                    ${cert.issueDate || '2026-02-18'}
                  </td>
                  <td class="p-3 text-left whitespace-nowrap" dir="ltr">
                    <a href="#/verify-cert/${cert.certificateNumber || cert.serialNumber}" class="btn-secondary py-1 px-2.5 text-[11px] rounded-lg text-indigo-600" title="آن لائن تصدیق دیکھیں">
                      <i data-lucide="qr-code" class="w-3.5 h-3.5"></i> دیکھیں
                    </a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.openIssueCertificateModal = function() {
  const users = window.DB.get('users');
  const courses = window.DB.get('courses');

  window.App.showModal('طالب علم کے لیے شاہی سند جاری کریں', `
    <form onsubmit="window.Views.admin.issueCertificate(event)" class="space-y-4 font-urdu text-right" dir="rtl">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">طالب علم کا انتخاب کریں</label>
        <select id="cert-user-select" class="form-input text-xs font-urdu">
          ${users.map(u => `<option value="${u.id}" data-name="${u.name}">${u.name} (${u.email})</option>`).join('')}
        </select>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">کورس کا انتخاب کریں</label>
        <select id="cert-course-select" class="form-input text-xs font-urdu">
          ${courses.map(c => `<option value="${c.id}" data-title="${c.title}">${c.title}</option>`).join('')}
        </select>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">حاصل کردہ گریڈ / درجہ</label>
        <select id="cert-grade-select" class="form-input text-xs font-urdu">
          <option value="ممتاز درجہ (Pass with Highest Distinction - 100%)">ممتاز درجہ (Pass with Highest Distinction - 100%)</option>
          <option value="شاندار کامیابی (First Division - 90%)">شاندار کامیابی (First Division - 90%)</option>
          <option value="کامیاب (Pass - 80%)">کامیاب (Pass - 80%)</option>
        </select>
      </div>

      <div class="pt-2 flex gap-2">
        <button type="submit" class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500">
          سندِ فراغت جاری کریں
        </button>
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">منسوخ</button>
      </div>
    </form>
  `);
};

window.Views.admin.issueCertificate = function(e) {
  e.preventDefault();
  const userSelect = document.getElementById('cert-user-select');
  const courseSelect = document.getElementById('cert-course-select');
  const grade = document.getElementById('cert-grade-select').value;

  const userId = userSelect.value;
  const userName = userSelect.options[userSelect.selectedIndex].getAttribute('data-name');
  const courseId = courseSelect.value;
  const courseTitle = courseSelect.options[courseSelect.selectedIndex].getAttribute('data-title');
  const certNumber = `LH-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  window.DB.insert('certificates', {
    id: `cert-${Date.now()}`,
    certificateNumber: certNumber,
    serialNumber: certNumber,
    userId,
    userName,
    courseId,
    courseTitle,
    instructorName: 'شیخ ڈاکٹر محمد الہاشمی',
    issueDate: new Date().toISOString().split('T')[0],
    verificationUrl: `#/verify-cert/${certNumber}`,
    grade,
    badgeColor: '#059669'
  });

  window.App.closeModal();
  window.App.showToast(`شاہی سند کامیابی سے جاری ہو گئی! (نمبر: ${certNumber})`, 'success');
  window.Router.navigate('/certificates');
};

// ==========================================
// 3. DATABASE BACKUP & RESTORE UTILITIES
// ==========================================
window.Views.admin.exportDatabaseJSON = function() {
  const data = window.DB.data;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `learnhub-islamic-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  window.App.showToast('ڈیٹا بیس بیک اپ فائل ڈاؤنلوڈ ہو گئی!', 'success');
};

window.Views.admin.importDatabaseJSON = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      window.DB.saveData(parsed);
      window.App.showToast('ڈیٹا بیس کامیابی سے ری اسٹور ہو گیا!', 'success');
      window.Router.handleRouting();
    } catch (err) {
      window.App.showToast('فائل کا فارمیٹ درست نہیں ہے۔', 'danger');
    }
  };
  reader.readAsText(file);
};

window.Views.admin.resetDatabaseToSeed = function() {
  if (!confirm('کیا آپ واقعی تمام ڈیٹا کو ڈیفالٹ اسلامی نصاب پر ری سیٹ کرنا چاہتے ہیں؟')) return;
  window.DB.resetToSeed();
  window.App.showToast('ڈیٹا بیس کامیابی سے ری سیٹ ہو گیا!', 'info');
  window.Router.handleRouting();
};

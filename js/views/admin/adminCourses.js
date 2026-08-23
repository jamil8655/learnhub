/**
 * LearnHub Admin Course & Lesson Management Views
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderCourses = async function() {
  const container = document.getElementById('main-content');
  const courses = await window.API.getCourses({ includeAllStatus: true });
  const categories = window.DB.get('categories') || [];
  const instructors = window.DB.get('instructors') || [];

  container.innerHTML = `
    <div class="space-y-6 font-urdu" dir="rtl">
      <!-- Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-l from-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-indigo-500/30">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-400 text-slate-950 text-xs font-bold rounded-full shadow mb-2">
            <i data-lucide="book-open" class="w-3.5 h-3.5"></i> نصاب و اسباق مینجمنٹ
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white">اسلامی ماسٹر کلاسز و کورسز کنٹرول</h1>
          <p class="text-xs sm:text-sm text-indigo-100/80 mt-1">نئے کورسز بنائیں، ویڈیو اسباق ترتیب دیں، اور فیس و سٹیٹس کا تعین کریں۔</p>
        </div>
        <button onclick="window.Views.admin.openCourseBuilderModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-900/30">
          <i data-lucide="plus-circle" class="w-4 h-4"></i> <span>نیا کورس بنائیں</span>
        </button>
      </div>

      <!-- Courses Table Card -->
      <div class="lh-card overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="relative flex-1 max-w-sm">
            <input 
              type="text" 
              placeholder="عنوان، استاد یا کیٹیگری سے تلاش کریں..." 
              class="form-input text-xs py-2.5 pr-9 pl-4 rounded-xl w-full text-right"
              oninput="window.Views.admin.filterCourseTable(this.value)"
            />
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute right-3 top-3"></i>
          </div>
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">کل کورسز: <strong class="text-emerald-600 dark:text-emerald-400">${courses.length}</strong></span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs" id="admin-courses-table">
            <thead class="bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase text-[11px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="p-3.5">کورس و تفصیل</th>
                <th class="p-3.5 text-center">کیٹیگری</th>
                <th class="p-3.5 text-center">استاد محترم</th>
                <th class="p-3.5 text-center">قیمت / فیس</th>
                <th class="p-3.5 text-center">طلباء</th>
                <th class="p-3.5 text-center">حیثیت</th>
                <th class="p-3.5 text-left">اختیارات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${courses.length === 0 ? `
                <tr>
                  <td colspan="7" class="p-8 text-center text-slate-400 text-xs">کوئی کورس دستیاب نہیں۔ "نیا کورس بنائیں" پر کلک کریں۔</td>
                </tr>
              ` : courses.map(course => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td class="p-3.5">
                    <div class="flex items-center gap-3">
                      <img src="${course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'}" class="w-12 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-sm">
                      <div class="min-w-0">
                        <div class="font-bold text-sm text-slate-900 dark:text-white truncate max-w-xs">${course.title}</div>
                        <div class="text-[11px] text-slate-400 font-mono">${course.lessonCount || 0} اسباق • ${course.durationHours || 10} گھنٹے</div>
                      </div>
                    </div>
                  </td>
                  <td class="p-3.5 text-center">
                    <span class="badge bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">${course.category?.name || 'اسلامی علوم'}</span>
                  </td>
                  <td class="p-3.5 text-center text-slate-700 dark:text-slate-300 font-bold">
                    ${course.instructor?.name || 'مستند شیخ'}
                  </td>
                  <td class="p-3.5 text-center font-bold font-mono">
                    ${course.isFree ? '<span class="text-emerald-600 dark:text-emerald-400 font-extrabold">مفت (FREE)</span>' : '$' + (course.price || 0).toFixed(2)}
                  </td>
                  <td class="p-3.5 text-center font-mono font-bold text-slate-700 dark:text-slate-300">${(course.enrolledCount || 0).toLocaleString()}</td>
                  <td class="p-3.5 text-center">
                    <button onclick="window.Views.admin.toggleCourseStatus('${course.id}')" class="badge ${course.status === 'published' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-400/30' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-400/30'} cursor-pointer text-[10px] uppercase font-bold" title="حیثیت تبدیل کریں">
                      ${course.status === 'published' ? 'شائع شدہ' : 'مسودہ'}
                    </button>
                  </td>
                  <td class="p-3.5 text-left space-x-1 whitespace-nowrap" dir="ltr">
                    <button onclick="window.Views.admin.openManageLessonsModal('${course.id}')" class="btn-secondary py-1 px-2.5 text-[11px] rounded-lg text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950/40" title="اسباق کا انتظام">
                      <i data-lucide="list-ordered" class="w-3.5 h-3.5"></i> اسباق
                    </button>
                    <button onclick="window.Views.admin.openCourseBuilderModal('${course.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg text-slate-600 dark:text-slate-300" title="ترمیم">
                      <i data-lucide="edit" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="window.Views.admin.deleteCourse('${course.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40" title="حذف کریں">
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

window.Views.admin.filterCourseTable = function(query) {
  const q = (query || '').toLowerCase().trim();
  const rows = document.querySelectorAll('#admin-courses-table tbody tr');
  rows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
};

// State storage for Course Builder Media & Dynamic Fields
window._CourseBuilderState = {
  uploadedThumbnail: '',
  uploadedPromoVideo: '',
  instructorMode: 'academy', // 'academy', 'custom', 'registered'
  outcomes: [],
  requirements: []
};

window.Views.admin.openCourseBuilderModal = function(courseId = null) {
  const course = courseId ? window.DB.findById('courses', courseId) : null;
  const categories = window.DB.get('categories') || [];
  const instructors = window.DB.get('instructors') || [];

  // Initialize state from existing course or defaults
  window._CourseBuilderState = {
    uploadedThumbnail: course?.thumbnail || '',
    uploadedPromoVideo: course?.promoVideo || '',
    instructorMode: (course?.instructor?.id === 'inst-academy' || !course?.instructorId) ? 'academy' : (course?.instructor?.isCustom ? 'custom' : 'registered'),
    outcomes: course?.learningOutcomes || [
      'قرآنی و نبوی علوم کی مستند اور بنیادی تفہیم حاصل کریں',
      'عملی قواعد اور شرعی مسائل کا فہم حاصل کریں',
      'کامیابی پر کیو آر کوڈ سے تصدیق شدہ شاہی سند حاصل کریں'
    ],
    requirements: course?.requirements || [
      'علم حاصل کرنے کا اخلاص اور شوق',
      'روزانہ 15 سے 20 منٹ کا تعلیمی وقت'
    ]
  };

  window.App.showModal(course ? `ترمیم کورس: ${course.title}` : 'نیا ماسٹر کلاس کورس لانچ کریں', `
    <form onsubmit="window.Views.admin.saveCourseForm(event, '${courseId || ''}')" class="space-y-6 max-h-[82vh] overflow-y-auto pr-1 text-right font-urdu" dir="rtl">
      
      <!-- 1. Basic Course Title & Subtitle Card -->
      <div class="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
          <span class="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <i data-lucide="book-open" class="w-4 h-4"></i> بنیادی معلومات (Course Overview)
          </span>
          <span class="text-[10px] text-slate-400 font-mono">Step 1 of 5</span>
        </div>

        <div>
          <label class="text-xs font-bold text-slate-800 dark:text-white block mb-1">کورس کا مکمل عنوان (Course Title) <span class="text-rose-500">*</span></label>
          <input type="text" id="cb-title" value="${course ? course.title : ''}" required class="form-input text-xs font-bold w-full" placeholder="مثلاً: جامع قرآنی تجوید و قراءت ماسٹر کلاس">
        </div>

        <div>
          <label class="text-xs font-bold text-slate-800 dark:text-white block mb-1">ذیلی عنوان و مختصر تعارف (Subtitle / Short Hook)</label>
          <input type="text" id="cb-short-desc" value="${course ? (course.shortDescription || course.subtitle || '') : ''}" required class="form-input text-xs w-full" placeholder="ایک جملے میں کورس کا مقصد (مثلاً: صحیح مخارج اور لحنِ جلی و خفی سے پاک تلاوت سیکھیں)">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="text-xs font-bold text-slate-800 dark:text-white block mb-1">شعبۂ تعلیم (Category) <span class="text-rose-500">*</span></label>
            <select id="cb-category" class="form-input text-xs font-urdu w-full">
              ${categories.map(c => `
                <option value="${c.id}" ${course && course.categoryId === c.id ? 'selected' : ''}>${c.name}</option>
              `).join('')}
            </select>
          </div>
          <div>
            <label class="text-xs font-bold text-slate-800 dark:text-white block mb-1">تعلیمی درجہ (Difficulty Level)</label>
            <select id="cb-level" class="form-input text-xs w-full">
              <option value="Beginner" ${course && (course.level === 'Beginner' || course.level === 'مبتدی') ? 'selected' : ''}>مبتدی (Beginner / بنیادی)</option>
              <option value="Intermediate" ${course && (course.level === 'Intermediate' || course.level === 'متوسط') ? 'selected' : ''}>متوسط (Intermediate)</option>
              <option value="Advanced" ${course && (course.level === 'Advanced' || course.level === 'متقدم') ? 'selected' : ''}>متقدم و متخصص (Advanced)</option>
              <option value="All Levels" ${!course || course.level === 'All Levels' || course.level === 'تمام درجات' || course.level === 'تمام طلباء کے لیے' ? 'selected' : ''}>عام فہم / تمام افراد کے لیے (All Levels)</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-bold text-slate-800 dark:text-white block mb-1">تدریسی زبان (Language)</label>
            <select id="cb-language" class="form-input text-xs w-full">
              <option value="ur" ${!course || course.language === 'ur' ? 'selected' : ''}>اردو (Urdu)</option>
              <option value="ar" ${course && course.language === 'ar' ? 'selected' : ''}>العربية (Arabic)</option>
              <option value="en" ${course && course.language === 'en' ? 'selected' : ''}>English</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 2. Flexible Faculty & Instructor Attribution (Optional & Dynamic) -->
      <div class="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
          <span class="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <i data-lucide="user-check" class="w-4 h-4"></i> تدریسی فیکلٹی و ادارہ جاتی انتساب (Faculty & Instructor)
          </span>
          <span class="text-[10px] text-slate-400 font-mono">Optional</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <label class="cursor-pointer flex items-center gap-2 p-2.5 rounded-xl transition ${window._CourseBuilderState.instructorMode === 'academy' ? 'bg-white dark:bg-slate-900 shadow-sm text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-400'}">
            <input type="radio" name="inst-mode" value="academy" ${window._CourseBuilderState.instructorMode === 'academy' ? 'checked' : ''} onchange="window.Views.admin.switchInstructorMode('academy')" class="text-emerald-600">
            <span class="text-xs">🏛️ اکیڈمی کورس (کوئی نام نہیں)</span>
          </label>
          <label class="cursor-pointer flex items-center gap-2 p-2.5 rounded-xl transition ${window._CourseBuilderState.instructorMode === 'custom' ? 'bg-white dark:bg-slate-900 shadow-sm text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-400'}">
            <input type="radio" name="inst-mode" value="custom" ${window._CourseBuilderState.instructorMode === 'custom' ? 'checked' : ''} onchange="window.Views.admin.switchInstructorMode('custom')" class="text-emerald-600">
            <span class="text-xs">✍️ کسٹم نام / مہمان شیخ</span>
          </label>
          <label class="cursor-pointer flex items-center gap-2 p-2.5 rounded-xl transition ${window._CourseBuilderState.instructorMode === 'registered' ? 'bg-white dark:bg-slate-900 shadow-sm text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-400'}">
            <input type="radio" name="inst-mode" value="registered" ${window._CourseBuilderState.instructorMode === 'registered' ? 'checked' : ''} onchange="window.Views.admin.switchInstructorMode('registered')" class="text-emerald-600">
            <span class="text-xs">👥 رجسٹرڈ فیکلٹی میں سے</span>
          </label>
        </div>

        <!-- Mode A: Academy Default (No Name) -->
        <div id="inst-pane-academy" class="${window._CourseBuilderState.instructorMode === 'academy' ? '' : 'hidden'} p-3.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5">
          <i data-lucide="shield-check" class="w-5 h-5 text-emerald-600 shrink-0"></i>
          <span>یہ کورس **لرن ہب اسلامک اکیڈمی** کے تحت آفیشل کورس کے طور پر شائع ہوگا۔ کسی مخصوص فرد کا نام لازمی نہیں۔</span>
        </div>

        <!-- Mode B: Custom Visiting Scholar Name -->
        <div id="inst-pane-custom" class="${window._CourseBuilderState.instructorMode === 'custom' ? '' : 'hidden'} space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">استاد / شیخ کا نام (Scholar Name)</label>
              <input type="text" id="cb-custom-inst-name" value="${course?.instructor?.name || ''}" class="form-input text-xs w-full" placeholder="مثلاً: فضیلۃ الشیخ حافظ زبیر علی زئی رحمہ اللہ">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">علمی منصب / ٹائٹل (Designation / Title)</label>
              <input type="text" id="cb-custom-inst-title" value="${course?.instructor?.headline || ''}" class="form-input text-xs w-full" placeholder="مثلاً: محقق و محدثِ عصر">
            </div>
          </div>
        </div>

        <!-- Mode C: Registered Instructors Dropdown -->
        <div id="inst-pane-registered" class="${window._CourseBuilderState.instructorMode === 'registered' ? '' : 'hidden'}">
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">رجسٹرڈ اساتذہ میں سے منتخب کریں:</label>
          <select id="cb-instructor" class="form-input text-xs font-urdu w-full">
            ${instructors.map(i => `
              <option value="${i.id}" ${course && course.instructorId === i.id ? 'selected' : ''}>${i.name} (${i.headline || 'استاد'})</option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- 3. Course Poster & Promo Video Studio (Direct Upload + Embed) -->
      <div class="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
          <span class="text-xs font-extrabold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
            <i data-lucide="image" class="w-4 h-4"></i> کورس پوسٹر و تعارفی پرومو ویڈیو (Visual & Media)
          </span>
          <span class="text-[10px] text-slate-400 font-mono">High-Definition</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Thumbnail Poster Upload -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-800 dark:text-white block">کورس پوسٹر / تھمب نیل (Course Poster):</label>
            <div class="border-2 border-dashed border-cyan-300 dark:border-cyan-700/60 rounded-2xl p-3.5 text-center bg-white/70 dark:bg-slate-900/70">
              <input type="file" id="cb-thumb-file" accept="image/*" onchange="window.Views.admin.handleCourseThumbnailUpload(this)" class="hidden">
              <label for="cb-thumb-file" class="cursor-pointer flex flex-col items-center justify-center space-y-1.5">
                <i data-lucide="upload" class="w-5 h-5 text-cyan-500"></i>
                <span class="text-xs font-bold text-slate-800 dark:text-slate-200">موبائل یا پی سی سے پوسٹر اپلوڈ کریں</span>
              </label>
            </div>
            <input type="text" id="cb-thumbnail" value="${course ? (course.thumbnail || '') : 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800'}" oninput="document.getElementById('course-thumb-preview').src = this.value" class="form-input text-xs font-mono w-full text-left" dir="ltr" placeholder="https://images.unsplash.com/...">
            <div class="w-full h-32 rounded-2xl overflow-hidden bg-black border border-slate-700 shadow-inner flex items-center justify-center">
              <img id="course-thumb-preview" src="${course?.thumbnail || 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800'}" class="w-full h-full object-cover">
            </div>
          </div>

          <!-- Promo Video Upload / Link -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-800 dark:text-white block">تعارفی پرومو ویڈیو (Course Promo / Teaser Video):</label>
            <div class="border-2 border-dashed border-indigo-300 dark:border-indigo-700/60 rounded-2xl p-3.5 text-center bg-white/70 dark:bg-slate-900/70">
              <input type="file" id="cb-promo-file" accept="video/*" onchange="window.Views.admin.handleCoursePromoUpload(this)" class="hidden">
              <label for="cb-promo-file" class="cursor-pointer flex flex-col items-center justify-center space-y-1.5">
                <i data-lucide="video" class="w-5 h-5 text-indigo-500"></i>
                <span class="text-xs font-bold text-slate-800 dark:text-slate-200">پرومو ویڈیو فائل اپلوڈ کریں (MP4)</span>
              </label>
            </div>
            <input type="text" id="cb-promo-url" value="${course ? (course.promoVideo || '') : ''}" class="form-input text-xs font-mono w-full text-left" dir="ltr" placeholder="https://youtube.com/watch?v=... یا https://domain.com/trailer.mp4">
            <p class="text-[10px] text-slate-400">طلباء کو کورس پیج پر داخلے سے قبل یہ ٹریلر ویڈیو دکھائی جائے گی۔</p>
          </div>
        </div>
      </div>

      <!-- 4. Dynamic Learning Outcomes & Requirements Engine -->
      <div class="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
          <span class="text-xs font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <i data-lucide="check-square" class="w-4 h-4"></i> حاصلاتِ تعلّم و پیشگی شرائط (What Students Will Learn)
          </span>
          <span class="text-[10px] text-slate-400 font-mono">Pedagogy</span>
        </div>

        <!-- Learning Outcomes -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-800 dark:text-white block">طالب علم اس کورس سے کیا سیکھے گا؟ (Learning Outcomes):</label>
          <div class="flex gap-2">
            <input type="text" id="outcome-new-input" placeholder="نیا حاصلِ تعلّم درج کریں (مثلاً: مخارج کی عملی تصحیح)" class="form-input text-xs flex-1">
            <button type="button" onclick="window.Views.admin.addCourseOutcome()" class="btn-primary py-2 px-3 text-xs bg-amber-600 hover:bg-amber-500 font-bold rounded-xl whitespace-nowrap">
              شامل کریں +
            </button>
          </div>
          <div id="outcomes-list" class="space-y-1.5 pt-1">
            ${window._CourseBuilderState.outcomes.map((out, oIdx) => `
              <div class="p-2 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-between text-xs border border-slate-200 dark:border-slate-700">
                <span class="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-500"></i> ${out}
                </span>
                <button type="button" onclick="window.Views.admin.removeCourseOutcome(${oIdx})" class="text-rose-500 hover:text-rose-700 p-1">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Detailed Description Body -->
        <div>
          <label class="text-xs font-bold text-slate-800 dark:text-white block mb-1">تفصیلی تعارف و نصابی خاکہ (Detailed Description):</label>
          <textarea id="cb-description" rows="4" required class="form-input text-xs w-full leading-relaxed" placeholder="کورس کی مکمل تفصیل، اسباق کی تفصیلات، اساتذہ کا طریقہ تدریس اور شرعی اہمیت...">${course ? (course.description || '') : ''}</textarea>
        </div>
      </div>

      <!-- 5. Pricing, Certification, Duration & Publication Control -->
      <div class="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
          <span class="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <i data-lucide="award" class="w-4 h-4"></i> فیس، اسناد اور اشاعت کی ترتیبات (Pricing & Certificate)
          </span>
          <span class="text-[10px] text-slate-400 font-mono">Final Step</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="text-xs font-bold text-slate-800 dark:text-white block mb-1">تخمینی دورانیہ (کل گھنٹے / Total Hours)</label>
            <input type="number" step="0.5" min="0.5" id="cb-hours" value="${course ? (course.durationHours || 12) : 12}" class="form-input text-xs font-mono w-full">
          </div>
          <div>
            <label class="text-xs font-bold text-slate-800 dark:text-white block mb-1">قیمت / فیس ($ Price)</label>
            <input type="number" step="0.01" min="0" id="cb-price" value="${course ? (course.price || 0) : '0.00'}" class="form-input text-xs font-mono w-full">
          </div>
          <div>
            <label class="text-xs font-bold text-slate-800 dark:text-white block mb-1">اصل قیمت ($ Original Price)</label>
            <input type="number" step="0.01" min="0" id="cb-orig-price" value="${course ? (course.originalPrice || '49.99') : '49.99'}" class="form-input text-xs font-mono w-full">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <label class="flex items-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 cursor-pointer">
            <input type="checkbox" id="cb-free" ${!course || course.isFree ? 'checked' : ''} onchange="document.getElementById('cb-price').value = this.checked ? 0 : 29.99" class="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4">
            <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">100% مفت کورس (Free for Ummah)</span>
          </label>
          <label class="flex items-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 cursor-pointer">
            <input type="checkbox" id="cb-cert" ${!course || course.certificateEligible !== false ? 'checked' : ''} class="rounded text-amber-500 focus:ring-amber-400 w-4 h-4">
            <span class="text-xs font-bold text-amber-600 dark:text-amber-400">شاہی سندِ فراغت جاری کریں (Certificate)</span>
          </label>
          <label class="flex items-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 cursor-pointer">
            <input type="checkbox" id="cb-publish" ${!course || course.status === 'published' ? 'checked' : ''} class="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4">
            <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400">فوری شائع کریں (Publish Live)</span>
          </label>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="pt-2 flex gap-3">
        <button type="submit" class="btn-primary flex-1 py-3 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2">
          <i data-lucide="check-circle" class="w-4 h-4"></i>
          <span>${course ? 'کورس میں ترامیم محفوظ کریں (Save Changes)' : 'ماسٹر کلاس کورس لانچ کریں (Launch Course)'}</span>
        </button>
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-3 px-5 text-xs rounded-xl font-bold">منسوخ</button>
      </div>
    </form>
  `);

  if (window.lucide) window.lucide.createIcons();
};

// Switch Instructor Attribution Mode
window.Views.admin.switchInstructorMode = function(mode) {
  window._CourseBuilderState.instructorMode = mode;
  document.getElementById('inst-pane-academy')?.classList.toggle('hidden', mode !== 'academy');
  document.getElementById('inst-pane-custom')?.classList.toggle('hidden', mode !== 'custom');
  document.getElementById('inst-pane-registered')?.classList.toggle('hidden', mode !== 'registered');
};

// Direct Thumbnail Image Upload Handler
window.Views.admin.handleCourseThumbnailUpload = function(input) {
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxW = 1280;
      const scale = Math.min(1, maxW / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedUrl = canvas.toDataURL('image/webp', 0.88);
      window._CourseBuilderState.uploadedThumbnail = compressedUrl;
      document.getElementById('cb-thumbnail').value = compressedUrl;
      document.getElementById('course-thumb-preview').src = compressedUrl;
      window.App.showToast(`کورس پوسٹر "${file.name}" اپلوڈ ہو گیا!`, 'success');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

// Direct Promo Video Upload Handler
window.Views.admin.handleCoursePromoUpload = function(input) {
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    window._CourseBuilderState.uploadedPromoVideo = dataUrl;
    document.getElementById('cb-promo-url').value = dataUrl;
    window.App.showToast(`پرومو ویڈیو "${file.name}" منتخب ہو گئی!`, 'success');
  };
  reader.readAsDataURL(file);
};

// Dynamic Learning Outcomes Add/Remove
window.Views.admin.addCourseOutcome = function() {
  const input = document.getElementById('outcome-new-input');
  const val = input.value.trim();
  if (!val) return;

  window._CourseBuilderState.outcomes.push(val);
  input.value = '';
  const listEl = document.getElementById('outcomes-list');
  listEl.innerHTML = window._CourseBuilderState.outcomes.map((out, oIdx) => `
    <div class="p-2 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-between text-xs border border-slate-200 dark:border-slate-700">
      <span class="flex items-center gap-2 text-slate-800 dark:text-slate-200">
        <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-500"></i> ${out}
      </span>
      <button type="button" onclick="window.Views.admin.removeCourseOutcome(${oIdx})" class="text-rose-500 hover:text-rose-700 p-1">
        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
      </button>
    </div>
  `).join('');
  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.removeCourseOutcome = function(idx) {
  window._CourseBuilderState.outcomes.splice(idx, 1);
  const listEl = document.getElementById('outcomes-list');
  listEl.innerHTML = window._CourseBuilderState.outcomes.map((out, oIdx) => `
    <div class="p-2 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-between text-xs border border-slate-200 dark:border-slate-700">
      <span class="flex items-center gap-2 text-slate-800 dark:text-slate-200">
        <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-500"></i> ${out}
      </span>
      <button type="button" onclick="window.Views.admin.removeCourseOutcome(${oIdx})" class="text-rose-500 hover:text-rose-700 p-1">
        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
      </button>
    </div>
  `).join('');
  if (window.lucide) window.lucide.createIcons();
};

// Save Complete Course Form
window.Views.admin.saveCourseForm = async function(e, courseId) {
  e.preventDefault();
  const title = document.getElementById('cb-title').value.trim();
  const shortDescription = document.getElementById('cb-short-desc').value.trim();
  const categoryId = document.getElementById('cb-category').value;
  const level = document.getElementById('cb-level').value;
  const language = document.getElementById('cb-language').value;
  const durationHours = parseFloat(document.getElementById('cb-hours').value) || 12.0;
  const isFree = document.getElementById('cb-free').checked;
  const price = isFree ? 0 : (parseFloat(document.getElementById('cb-price').value) || 0);
  const originalPrice = parseFloat(document.getElementById('cb-orig-price').value) || 49.99;
  const thumbnail = document.getElementById('cb-thumbnail').value.trim() || window._CourseBuilderState.uploadedThumbnail;
  const promoVideo = document.getElementById('cb-promo-url').value.trim() || window._CourseBuilderState.uploadedPromoVideo;
  const description = document.getElementById('cb-description').value.trim();
  const certificateEligible = document.getElementById('cb-cert').checked;
  const status = document.getElementById('cb-publish').checked ? 'published' : 'draft';

  // Determine Instructor Object & ID
  let instructorId = 'inst-academy';
  let instructorObj = {
    id: 'inst-academy',
    name: 'لرن ہب اسلامک اکیڈمی',
    headline: 'مرکزی تعلیمی و تدریسی بورڈ',
    avatar: 'https://avatars.githubusercontent.com/u/207941618?v=4'
  };

  if (window._CourseBuilderState.instructorMode === 'custom') {
    const customName = document.getElementById('cb-custom-inst-name')?.value.trim() || 'مہمان محقق';
    const customTitle = document.getElementById('cb-custom-inst-title')?.value.trim() || 'استادِ محترم';
    instructorId = `inst-custom-${Date.now()}`;
    instructorObj = {
      id: instructorId,
      name: customName,
      headline: customTitle,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      isCustom: true
    };
  } else if (window._CourseBuilderState.instructorMode === 'registered') {
    instructorId = document.getElementById('cb-instructor')?.value || 'inst-1';
    const regInst = window.DB.findById('instructors', instructorId);
    if (regInst) instructorObj = regInst;
  }

  let rawSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!rawSlug || rawSlug.length < 2) {
    rawSlug = `course-${Date.now()}`;
  }

  const courseData = {
    id: courseId || undefined,
    title,
    subtitle: shortDescription,
    shortDescription,
    slug: rawSlug,
    categoryId,
    instructorId,
    instructor: instructorObj,
    price,
    originalPrice,
    isFree,
    level,
    language,
    durationHours,
    thumbnail: thumbnail || 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800',
    promoVideo,
    description,
    certificateEligible,
    status,
    rating: 5.0,
    ratingCount: 1,
    enrolledCount: courseId ? (window.DB.findById('courses', courseId)?.enrolledCount || 0) : 0,
    learningOutcomes: window._CourseBuilderState.outcomes || [],
    requirements: window._CourseBuilderState.requirements || []
  };

  await window.API.saveCourse(courseData);
  window.App.closeModal();
  window.App.showToast(courseId ? 'کورس کی تمام معلومات کامیابی سے اپ ڈیٹ ہو گئیں!' : 'نیا ماسٹر کلاس کورس کامیابی سے لانچ ہو گیا!', 'success');
  window.Views.admin.renderCourses();
};

window.Views.admin.toggleCourseStatus = function(courseId) {
  const course = window.DB.findById('courses', courseId);
  if (!course) return;

  const newStatus = course.status === 'published' ? 'draft' : 'published';
  window.DB.update('courses', courseId, { status: newStatus });
  window.App.showToast(`کورس کا اسٹیٹس ${newStatus} میں تبدیل ہو گیا۔`, 'info');
  window.Views.admin.renderCourses();
};

window.Views.admin.duplicateCourse = function(courseId) {
  const course = window.DB.findById('courses', courseId);
  if (!course) return;

  const cloned = {
    ...JSON.parse(JSON.stringify(course)),
    id: `crs-${Date.now()}`,
    title: `${course.title} (کاپی)`,
    slug: `${course.slug || 'course'}-copy-${Date.now().toString(36)}`,
    status: 'draft',
    enrolledCount: 0
  };

  window.DB.insert('courses', cloned);

  // Also duplicate associated lessons
  const lessons = window.DB.get('lessons').filter(l => l.courseId === courseId);
  lessons.forEach(les => {
    const clonedLes = {
      ...JSON.parse(JSON.stringify(les)),
      id: `les-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      courseId: cloned.id
    };
    window.DB.insert('lessons', clonedLes);
  });

  window.App.showToast('کورس مع تمام اسباق ڈپلیکیٹ ہو گیا۔', 'success');
  window.Views.admin.renderCourses();
};

window.Views.admin.deleteCourse = async function(courseId) {
  if (confirm('کیا آپ واقعی یہ کورس اور اس کے تمام اسباق حذف کرنا چاہتے ہیں؟')) {
    await window.API.deleteCourse(courseId);
    window.App.showToast('کورس اور اسباق حذف کر دیے گئے۔', 'info');
    window.Views.admin.renderCourses();
  }
};

// ==========================================
// CURRICULUM LESSON MANAGER & MODALS
// ==========================================
window.Views.admin.openManageLessonsModal = function(courseId) {
  const course = window.DB.findById('courses', courseId);
  if (!course) return;
  const lessons = window.DB.get('lessons').filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);

  window.App.showModal(`Curriculum Lessons: ${course.title}`, `
    <div class="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
      <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <span class="text-xs text-slate-500">Total Lessons: <strong>${lessons.length}</strong></span>
        <button onclick="window.Views.admin.openAddLessonForm('${courseId}')" class="btn-primary py-1.5 px-3 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold flex items-center gap-1">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add Lesson
        </button>
      </div>

      <!-- Lessons List with Up/Down Reordering & Edit -->
      <div class="space-y-2.5" id="admin-lessons-list">
        ${lessons.length === 0 ? `
          <p class="text-xs text-slate-400 py-6 text-center">No lessons added yet. Click "Add Lesson" to build curriculum.</p>
        ` : lessons.map((les, idx) => `
          <div class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl flex items-center justify-between gap-3 border border-slate-200 dark:border-slate-700">
            <div class="flex items-center gap-3 min-w-0">
              <span class="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-extrabold shrink-0 font-mono">
                ${idx + 1}
              </span>
              <div class="min-w-0">
                <div class="text-xs font-bold text-slate-900 dark:text-white truncate">${les.title}</div>
                <div class="text-[10px] text-slate-400 uppercase font-mono mt-0.5">
                  ${les.type || 'video'} • ${les.durationMinutes || 15} mins ${les.isFreePreview ? '• <span class="text-emerald-500 font-bold">(Free Preview)</span>' : ''}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1 shrink-0" dir="ltr">
              <button onclick="window.Views.admin.moveLessonOrder('${courseId}', ${idx}, -1)" ${idx === 0 ? 'disabled' : ''} class="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-600 dark:text-slate-300" title="Move Up">
                <i data-lucide="arrow-up" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="window.Views.admin.moveLessonOrder('${courseId}', ${idx}, 1)" ${idx === lessons.length - 1 ? 'disabled' : ''} class="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-600 dark:text-slate-300" title="Move Down">
                <i data-lucide="arrow-down" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="window.Views.admin.openAddLessonForm('${courseId}', '${les.id}')" class="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400" title="Edit Lesson">
                <i data-lucide="edit" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="window.Views.admin.deleteLesson('${courseId}', '${les.id}')" class="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600" title="Delete Lesson">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="flex justify-end pt-2">
        <button type="button" onclick="window.App.closeModal(); window.Views.admin.renderCourses();" class="btn-secondary py-2 px-5 text-xs rounded-xl">
          Close Manager
        </button>
      </div>
    </div>
  `);

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.moveLessonOrder = async function(courseId, currentIndex, direction) {
  const lessons = window.DB.get('lessons').filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);
  const targetIndex = currentIndex + direction;

  if (targetIndex < 0 || targetIndex >= lessons.length) return;

  const temp = lessons[currentIndex];
  lessons[currentIndex] = lessons[targetIndex];
  lessons[targetIndex] = temp;

  await window.API.reorderLessons(lessons.map(l => l.id));
  window.Views.admin.openManageLessonsModal(courseId);
};

// State storage for active lesson media uploads & recorder
window._LessonStudioState = {
  activeTab: 'video',
  mediaRecorder: null,
  audioChunks: [],
  recordedAudioUrl: '',
  uploadedVideoUrl: '',
  uploadedAudioUrl: '',
  uploadedImageUrl: '',
  attachments: []
};

window.Views.admin.openAddLessonForm = function(courseId, lessonId = null) {
  const existing = lessonId ? window.DB.findById('lessons', lessonId) : null;
  const course = window.DB.findById('courses', courseId);
  const allCourseLessons = window.DB.get('lessons').filter(l => l.courseId === courseId);
  const sections = Array.from(new Set(allCourseLessons.map(l => l.sectionTitle).filter(Boolean)));

  // Reset state
  window._LessonStudioState = {
    activeTab: existing?.type || 'video',
    mediaRecorder: null,
    audioChunks: [],
    recordedAudioUrl: '',
    uploadedVideoUrl: existing?.videoUrl || '',
    uploadedAudioUrl: existing?.audioUrl || '',
    uploadedImageUrl: existing?.imageUrl || '',
    attachments: existing?.attachments || (existing?.resources || [])
  };

  window.App.showModal(existing ? `ترمیم سبق: ${existing.title}` : `نیا سبق شامل کریں — ${course?.title || ''}`, `
    <form onsubmit="window.Views.admin.saveNewLesson(event, '${courseId}', '${lessonId || ''}')" class="space-y-5 max-h-[82vh] overflow-y-auto pr-1 text-right font-urdu" dir="rtl">
      
      <!-- Top Title & Section Header -->
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div class="sm:col-span-8">
          <label class="text-xs font-bold text-slate-800 dark:text-white block mb-1">سبق کا عنوان (Lesson Title) <span class="text-rose-500">*</span></label>
          <input type="text" id="les-title" value="${existing ? existing.title : ''}" required class="form-input text-xs w-full font-bold" placeholder="مثلاً: سبق نمبر 1: تجوید کے بنیادی مخارج و صفات">
        </div>
        <div class="sm:col-span-4">
          <label class="text-xs font-bold text-slate-800 dark:text-white block mb-1">باب / عنوانِ فصل (Chapter/Section)</label>
          <input type="text" id="les-section" list="sections-list" value="${existing ? (existing.sectionTitle || '') : ''}" class="form-input text-xs w-full" placeholder="مثلاً: فصل اول: بنیادی قواعد">
          <datalist id="sections-list">
            ${sections.map(s => `<option value="${s}">`).join('')}
          </datalist>
        </div>
      </div>

      <!-- Multi-Media Content Mode Tabs -->
      <div>
        <label class="text-xs font-bold text-slate-800 dark:text-white block mb-2">تدریسی مواد کی قسم منتخب کریں (Select Content Type):</label>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button type="button" onclick="window.Views.admin.switchLessonMediaTab('video')" id="tab-btn-video" class="lesson-tab-btn py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${window._LessonStudioState.activeTab === 'video' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50'}">
            <i data-lucide="video" class="w-4 h-4"></i> <span>ویڈیو سبق</span>
          </button>
          <button type="button" onclick="window.Views.admin.switchLessonMediaTab('audio')" id="tab-btn-audio" class="lesson-tab-btn py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${window._LessonStudioState.activeTab === 'audio' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50'}">
            <i data-lucide="mic" class="w-4 h-4"></i> <span>صوتی درس / آڈیو</span>
          </button>
          <button type="button" onclick="window.Views.admin.switchLessonMediaTab('image')" id="tab-btn-image" class="lesson-tab-btn py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${window._LessonStudioState.activeTab === 'image' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50'}">
            <i data-lucide="image" class="w-4 h-4"></i> <span>انفوگرافک / تصویر</span>
          </button>
          <button type="button" onclick="window.Views.admin.switchLessonMediaTab('pdf')" id="tab-btn-pdf" class="lesson-tab-btn py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${window._LessonStudioState.activeTab === 'pdf' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50'}">
            <i data-lucide="file-text" class="w-4 h-4"></i> <span>پی ڈی ایف و کتب</span>
          </button>
          <button type="button" onclick="window.Views.admin.switchLessonMediaTab('text')" id="tab-btn-text" class="lesson-tab-btn py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${window._LessonStudioState.activeTab === 'text' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50'}">
            <i data-lucide="align-right" class="w-4 h-4"></i> <span>تحریر و آیات</span>
          </button>
        </div>
      </div>

      <!-- Tab Content Area 1: VIDEO (Direct Upload + YouTube / Embed Link) -->
      <div id="tab-content-video" class="media-tab-pane ${window._LessonStudioState.activeTab === 'video' ? '' : 'hidden'} space-y-4 p-4.5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
            <i data-lucide="video" class="w-4 h-4 text-emerald-500"></i> ویڈیو مواد اپلوڈ کریں یا لنک درج کریں
          </span>
          <span class="text-[11px] text-slate-400 font-mono">MP4, WebM, YouTube, Vimeo</span>
        </div>

        <!-- Direct File Upload from Mobile / PC -->
        <div class="border-2 border-dashed border-indigo-300 dark:border-indigo-700/60 rounded-2xl p-4 text-center bg-white/70 dark:bg-slate-900/70 hover:bg-indigo-50/50 transition">
          <input type="file" id="les-video-file" accept="video/mp4,video/webm,video/ogg,video/quicktime" onchange="window.Views.admin.handleVideoFileUpload(this)" class="hidden">
          <label for="les-video-file" class="cursor-pointer flex flex-col items-center justify-center space-y-2">
            <div class="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
              <i data-lucide="upload-cloud" class="w-5 h-5"></i>
            </div>
            <div class="text-xs font-bold text-slate-800 dark:text-slate-200">
              موبائل گیلری یا کمپیوٹر سے <span class="text-emerald-600 dark:text-emerald-400 underline">ویڈیو فائل اپلوڈ کریں</span>
            </div>
            <p class="text-[10px] text-slate-400">سپورٹڈ فارمیٹس: MP4, WebM, MOV (براہِ راست براؤزر میں پیش نظارہ)</p>
          </label>
        </div>

        <!-- Or Paste Link -->
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block">یا ویڈیو کا یوٹیوب / آن لائن لنک درج کریں (Video Link / URL):</label>
          <div class="flex gap-2" dir="ltr">
            <input type="text" id="les-url" value="${existing ? (existing.videoUrl || '') : ''}" oninput="window.Views.admin.updateVideoPreview(this.value)" class="form-input text-xs font-mono flex-1 text-left" placeholder="https://www.youtube.com/watch?v=... یا https://domain.com/lecture.mp4">
            <button type="button" onclick="window.Views.admin.testVideoUrl()" class="btn-secondary py-2 px-3 text-xs rounded-xl font-bold">ٹیسٹ</button>
          </div>
        </div>

        <!-- Live Video Preview Player -->
        <div id="video-preview-container" class="${existing?.videoUrl ? '' : 'hidden'} mt-3 rounded-2xl overflow-hidden bg-black border border-slate-700 aspect-video relative shadow-inner">
          <iframe id="video-preview-iframe" src="${existing?.videoUrl ? (existing.videoUrl.includes('youtube.com') ? existing.videoUrl.replace('watch?v=', 'embed/') : existing.videoUrl) : ''}" class="w-full h-full border-0 ${existing?.videoUrl && existing.videoUrl.startsWith('data:') ? 'hidden' : ''}" allowfullscreen></iframe>
          <video id="video-preview-native" src="${existing?.videoUrl && existing.videoUrl.startsWith('data:') ? existing.videoUrl : ''}" controls class="w-full h-full ${existing?.videoUrl && existing.videoUrl.startsWith('data:') ? '' : 'hidden'}"></video>
        </div>
      </div>

      <!-- Tab Content Area 2: AUDIO & DIRECT RECORDER -->
      <div id="tab-content-audio" class="media-tab-pane ${window._LessonStudioState.activeTab === 'audio' ? '' : 'hidden'} space-y-4 p-4.5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
            <i data-lucide="mic" class="w-4 h-4 text-emerald-500"></i> صوتی درس، تلاوت یا مائیکروفون سے لائیو ریکارڈنگ
          </span>
          <span class="text-[11px] text-slate-400 font-mono">MP3, WAV, M4A, OGG</span>
        </div>

        <!-- Audio Upload + Live Microphone Recorder Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- 1. Upload Audio File -->
          <div class="border-2 border-dashed border-emerald-300 dark:border-emerald-700/60 rounded-2xl p-4 text-center bg-white/70 dark:bg-slate-900/70">
            <input type="file" id="les-audio-file" accept="audio/*" onchange="window.Views.admin.handleAudioFileUpload(this)" class="hidden">
            <label for="les-audio-file" class="cursor-pointer flex flex-col items-center justify-center space-y-2">
              <div class="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <i data-lucide="upload" class="w-4 h-4"></i>
              </div>
              <span class="text-xs font-bold text-slate-800 dark:text-slate-200">آڈیو فائل منتخب کریں (MP3 / Audio)</span>
            </label>
          </div>

          <!-- 2. Live Mic Voice Recorder -->
          <div class="border-2 border-emerald-300 dark:border-emerald-700/60 rounded-2xl p-4 text-center bg-white/70 dark:bg-slate-900/70 flex flex-col items-center justify-center space-y-2">
            <div id="recorder-controls" class="flex items-center gap-2">
              <button type="button" id="btn-start-record" onclick="window.Views.admin.startVoiceRecording()" class="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span>لائیو درس ریکارڈ کریں</span>
              </button>
              <button type="button" id="btn-stop-record" onclick="window.Views.admin.stopVoiceRecording()" class="hidden py-2 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5">
                <i data-lucide="square" class="w-3.5 h-3.5 text-rose-400"></i>
                <span>ریکارڈنگ مکمل کریں (<span id="record-timer" class="font-mono">00:00</span>)</span>
              </button>
            </div>
            <span class="text-[10px] text-slate-400">مائیکروفون سے تلاوت یا استاد کا صوتی پیغام محفوظ کریں</span>
          </div>
        </div>

        <!-- Audio Link / URL Input -->
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">یا آڈیو کا آن لائن لنک درج کریں (Audio Stream URL):</label>
          <input type="text" id="les-audio-url" value="${existing ? (existing.audioUrl || '') : ''}" oninput="window.Views.admin.updateAudioPreview(this.value)" class="form-input text-xs font-mono w-full text-left" dir="ltr" placeholder="https://everyayah.com/... یا https://domain.com/lecture.mp3">
        </div>

        <!-- Audio Preview Player -->
        <div id="audio-preview-container" class="${(existing?.audioUrl || window._LessonStudioState.uploadedAudioUrl) ? '' : 'hidden'} p-3 rounded-2xl bg-emerald-950 text-white flex items-center gap-3">
          <i data-lucide="volume-2" class="w-5 h-5 text-emerald-400 shrink-0"></i>
          <audio id="audio-preview-player" src="${existing?.audioUrl || window._LessonStudioState.uploadedAudioUrl || ''}" controls class="w-full h-9 rounded-xl"></audio>
        </div>
      </div>

      <!-- Tab Content Area 3: IMAGES & INFOGRAPHICS -->
      <div id="tab-content-image" class="media-tab-pane ${window._LessonStudioState.activeTab === 'image' ? '' : 'hidden'} space-y-4 p-4.5 rounded-2xl bg-cyan-50/40 dark:bg-cyan-950/20 border border-cyan-200/60 dark:border-cyan-800/40">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-cyan-950 dark:text-cyan-200 flex items-center gap-2">
            <i data-lucide="image" class="w-4 h-4 text-cyan-500"></i> سبق کی تصاویر، تجوید کے ڈایاگرام اور چارٹس
          </span>
          <span class="text-[11px] text-slate-400 font-mono">JPG, PNG, WebP</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div class="sm:col-span-8 space-y-2">
            <div class="border-2 border-dashed border-cyan-300 dark:border-cyan-700/60 rounded-2xl p-4 text-center bg-white/70 dark:bg-slate-900/70">
              <input type="file" id="les-image-file" accept="image/*" onchange="window.Views.admin.handleImageFileUpload(this)" class="hidden">
              <label for="les-image-file" class="cursor-pointer flex flex-col items-center justify-center space-y-1.5">
                <div class="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                  <i data-lucide="camera" class="w-4 h-4"></i>
                </div>
                <span class="text-xs font-bold text-slate-800 dark:text-slate-200">تصویر یا مخارج کا نقشہ اپلوڈ کریں</span>
              </label>
            </div>
            <div>
              <label class="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">یا تصویر کا ویب لنک درج کریں:</label>
              <input type="text" id="les-image-url" value="${existing ? (existing.imageUrl || '') : ''}" oninput="window.Views.admin.updateImagePreview(this.value)" class="form-input text-xs font-mono w-full text-left" dir="ltr" placeholder="https://images.unsplash.com/...">
            </div>
          </div>
          <div class="sm:col-span-4 flex items-center justify-center">
            <div id="image-preview-container" class="w-full h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-hidden flex items-center justify-center relative shadow-sm">
              <img id="image-preview-img" src="${existing?.imageUrl || 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=600'}" class="w-full h-full object-cover">
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content Area 4: PDF & DOWNLOADABLE RESOURCES -->
      <div id="tab-content-pdf" class="media-tab-pane ${window._LessonStudioState.activeTab === 'pdf' ? '' : 'hidden'} space-y-4 p-4.5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-2">
            <i data-lucide="file-text" class="w-4 h-4 text-amber-500"></i> نصابی کتب، نوٹس اور پی ڈی ایف اٹیچمنٹس
          </span>
          <span class="text-[11px] text-slate-400 font-mono">PDF, DOC, ZIP</span>
        </div>

        <div class="p-3 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <div class="flex flex-col sm:flex-row gap-2">
            <input type="text" id="pdf-doc-title" placeholder="دستاویز کا نام (مثلاً: خلاصۂ درس و مشقی سوالات)" class="form-input text-xs flex-1">
            <input type="text" id="pdf-doc-url" placeholder="پی ڈی ایف لنک یا گوگل ڈرائیو ڈاؤن لوڈ یو آر ایل" class="form-input text-xs flex-1 text-left font-mono" dir="ltr">
            <button type="button" onclick="window.Views.admin.addPdfAttachment()" class="btn-primary py-2 px-4 text-xs rounded-xl bg-amber-600 hover:bg-amber-500 font-bold whitespace-nowrap">
              شامل کریں +
            </button>
          </div>

          <!-- Attachments List -->
          <div id="attachments-list" class="space-y-1.5 pt-2">
            ${(window._LessonStudioState.attachments || []).map((att, aIdx) => `
              <div class="p-2 bg-amber-500/10 rounded-xl flex items-center justify-between text-xs border border-amber-500/20">
                <span class="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <i data-lucide="file-check" class="w-3.5 h-3.5 text-amber-500"></i> ${att.title || 'دستاویز'}
                </span>
                <button type="button" onclick="window.Views.admin.removePdfAttachment(${aIdx})" class="text-rose-500 hover:text-rose-700 p-1">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Tab Content Area 5: RICH ISLAMIC TEXT & ARABIC AYAHS -->
      <div id="tab-content-text" class="media-tab-pane ${window._LessonStudioState.activeTab === 'text' ? '' : 'hidden'} space-y-4 p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
        <!-- Arabic Ayah / Hadith Box -->
        <div>
          <label class="text-xs font-bold text-slate-800 dark:text-white block mb-1">قرآنی آیات / حدیث شریف مع اعراب (Arabic Text with Vocalization):</label>
          <textarea id="les-arabic" rows="2" class="form-input text-sm font-arabic text-center leading-loose w-full bg-amber-50/30 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/50" placeholder="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ...">${existing ? (existing.arabicText || '') : ''}</textarea>
        </div>

        <!-- Urdu Lecture Notes & Summary -->
        <div>
          <label class="text-xs font-bold text-slate-800 dark:text-white block mb-1">تفصیلی خلاصہ و تشریح (Urdu Notes & Markdown):</label>
          <textarea id="les-body" rows="4" class="form-input text-xs w-full leading-relaxed" placeholder="سبق کی تشریح، اہم شرعی نکات، مثالیں اور قواعد درج کریں...">${existing ? (existing.contentBody || '') : ''}</textarea>
        </div>
      </div>

      <!-- Bottom Settings & Duration Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div>
          <label class="text-xs font-bold text-slate-800 dark:text-white block mb-1">دورانیہ (منٹ / Duration Minutes)</label>
          <input type="number" id="les-duration" value="${existing ? (existing.durationMinutes || 20) : 20}" min="1" required class="form-input text-xs w-full font-mono">
        </div>
        <div class="flex items-center">
          <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer pt-4">
            <input type="checkbox" id="les-preview" ${existing && existing.isFreePreview ? 'checked' : ''} class="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4">
            <span>مفت پیش نظارہ (Free Preview)</span>
          </label>
        </div>
        <div class="flex items-center">
          <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer pt-4">
            <input type="checkbox" id="les-prereq" ${existing && existing.isRequired ? 'checked' : ''} class="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4">
            <span>لازمی تکمیل (Required to unlock next)</span>
          </label>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="pt-2 flex gap-3">
        <button type="submit" class="btn-primary flex-1 py-3 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2">
          <i data-lucide="check-circle" class="w-4 h-4"></i>
          <span>${existing ? 'سبق اپ ڈیٹ کریں (Save Changes)' : 'سبق نصاب میں شامل کریں (Add Lesson)'}</span>
        </button>
        <button type="button" onclick="window.Views.admin.openManageLessonsModal('${courseId}')" class="btn-secondary py-3 px-5 text-xs rounded-xl font-bold">واپس</button>
      </div>
    </form>
  `);

  if (window.lucide) window.lucide.createIcons();
};

// Switch Tabs between Video, Audio, Image, PDF, Text
window.Views.admin.switchLessonMediaTab = function(tabName) {
  window._LessonStudioState.activeTab = tabName;
  document.querySelectorAll('.lesson-tab-btn').forEach(btn => {
    btn.classList.remove('bg-emerald-600', 'text-white', 'shadow-md');
    btn.classList.add('text-slate-600', 'dark:text-slate-300');
  });
  const activeBtn = document.getElementById(`tab-btn-${tabName}`);
  if (activeBtn) {
    activeBtn.classList.add('bg-emerald-600', 'text-white', 'shadow-md');
    activeBtn.classList.remove('text-slate-600', 'dark:text-slate-300');
  }

  document.querySelectorAll('.media-tab-pane').forEach(pane => pane.classList.add('hidden'));
  const activePane = document.getElementById(`tab-content-${tabName}`);
  if (activePane) activePane.classList.remove('hidden');
};

// Direct Video File Upload Handler
window.Views.admin.handleVideoFileUpload = function(input) {
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    window._LessonStudioState.uploadedVideoUrl = dataUrl;
    document.getElementById('les-url').value = dataUrl;
    
    const container = document.getElementById('video-preview-container');
    const iframe = document.getElementById('video-preview-iframe');
    const nativeVid = document.getElementById('video-preview-native');

    container.classList.remove('hidden');
    iframe.classList.add('hidden');
    nativeVid.classList.remove('hidden');
    nativeVid.src = dataUrl;
    window.App.showToast(`ویڈیو "${file.name}" کامیابی سے منتخب ہو گئی!`, 'success');
  };
  reader.readAsDataURL(file);
};

// Direct Audio File Upload Handler
window.Views.admin.handleAudioFileUpload = function(input) {
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    window._LessonStudioState.uploadedAudioUrl = dataUrl;
    document.getElementById('les-audio-url').value = dataUrl;
    
    const container = document.getElementById('audio-preview-container');
    const player = document.getElementById('audio-preview-player');
    container.classList.remove('hidden');
    player.src = dataUrl;
    window.App.showToast(`صوتی فائل "${file.name}" اپلوڈ ہو گئی!`, 'success');
  };
  reader.readAsDataURL(file);
};

// Direct Image File Upload Handler
window.Views.admin.handleImageFileUpload = function(input) {
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxW = 1200;
      const scale = Math.min(1, maxW / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedUrl = canvas.toDataURL('image/webp', 0.85);
      window._LessonStudioState.uploadedImageUrl = compressedUrl;
      document.getElementById('les-image-url').value = compressedUrl;
      document.getElementById('image-preview-img').src = compressedUrl;
      window.App.showToast(`تصویر "${file.name}" کامیابی سے شامل ہو گئی!`, 'success');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

// Live Voice Recording (MediaRecorder API)
window.Views.admin.startVoiceRecording = async function() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    window._LessonStudioState.audioChunks = [];
    const recorder = new MediaRecorder(stream);
    window._LessonStudioState.mediaRecorder = recorder;

    recorder.ondataavailable = function(e) {
      if (e.data.size > 0) window._LessonStudioState.audioChunks.push(e.data);
    };

    recorder.onstop = function() {
      const audioBlob = new Blob(window._LessonStudioState.audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onloadend = function() {
        const base64Audio = reader.result;
        window._LessonStudioState.recordedAudioUrl = base64Audio;
        document.getElementById('les-audio-url').value = base64Audio;
        
        const container = document.getElementById('audio-preview-container');
        const player = document.getElementById('audio-preview-player');
        container.classList.remove('hidden');
        player.src = base64Audio;
        window.App.showToast('🎙️ لائیو صوتی درس کامیابی سے ریکارڈ اور محفوظ ہو گیا!', 'success');
      };
      reader.readAsDataURL(audioBlob);
    };

    recorder.start();
    document.getElementById('btn-start-record').classList.add('hidden');
    document.getElementById('btn-stop-record').classList.remove('hidden');

    let seconds = 0;
    window._recordInterval = setInterval(() => {
      seconds++;
      const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
      const secs = String(seconds % 60).padStart(2, '0');
      const timerEl = document.getElementById('record-timer');
      if (timerEl) timerEl.innerText = `${mins}:${secs}`;
    }, 1000);

    window.App.showToast('🎙️ ریکارڈنگ شروع ہو گئی... بولنا شروع کریں!', 'info');
  } catch (err) {
    console.error('Microphone error:', err);
    window.App.showToast('مائیکروفون تک رسائی حاصل نہیں ہو سکی۔ براہ کرم اجازت دیجیے۔', 'danger');
  }
};

window.Views.admin.stopVoiceRecording = function() {
  if (window._LessonStudioState.mediaRecorder) {
    window._LessonStudioState.mediaRecorder.stop();
    window._LessonStudioState.mediaRecorder.stream.getTracks().forEach(track => track.stop());
  }
  if (window._recordInterval) clearInterval(window._recordInterval);
  document.getElementById('btn-start-record').classList.remove('hidden');
  document.getElementById('btn-stop-record').classList.add('hidden');
};

// PDF Attachment Handler
window.Views.admin.addPdfAttachment = function() {
  const title = document.getElementById('pdf-doc-title').value.trim();
  const url = document.getElementById('pdf-doc-url').value.trim();
  if (!title || !url) {
    window.App.showToast('براہ کرم دستاویز کا عنوان اور لنک درج کریں۔', 'warning');
    return;
  }

  window._LessonStudioState.attachments.push({ title, url, type: 'pdf' });
  document.getElementById('pdf-doc-title').value = '';
  document.getElementById('pdf-doc-url').value = '';

  const listEl = document.getElementById('attachments-list');
  listEl.innerHTML = window._LessonStudioState.attachments.map((att, aIdx) => `
    <div class="p-2 bg-amber-500/10 rounded-xl flex items-center justify-between text-xs border border-amber-500/20">
      <span class="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
        <i data-lucide="file-check" class="w-3.5 h-3.5 text-amber-500"></i> ${att.title}
      </span>
      <button type="button" onclick="window.Views.admin.removePdfAttachment(${aIdx})" class="text-rose-500 hover:text-rose-700 p-1">
        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
      </button>
    </div>
  `).join('');
  if (window.lucide) window.lucide.createIcons();
  window.App.showToast('دستاویز فہرست میں شامل ہو گئی۔', 'success');
};

window.Views.admin.removePdfAttachment = function(index) {
  window._LessonStudioState.attachments.splice(index, 1);
  const listEl = document.getElementById('attachments-list');
  listEl.innerHTML = window._LessonStudioState.attachments.map((att, aIdx) => `
    <div class="p-2 bg-amber-500/10 rounded-xl flex items-center justify-between text-xs border border-amber-500/20">
      <span class="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
        <i data-lucide="file-check" class="w-3.5 h-3.5 text-amber-500"></i> ${att.title}
      </span>
      <button type="button" onclick="window.Views.admin.removePdfAttachment(${aIdx})" class="text-rose-500 hover:text-rose-700 p-1">
        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
      </button>
    </div>
  `).join('');
  if (window.lucide) window.lucide.createIcons();
};

// URL Test & Previews
window.Views.admin.updateVideoPreview = function(url) {
  const container = document.getElementById('video-preview-container');
  const iframe = document.getElementById('video-preview-iframe');
  const nativeVid = document.getElementById('video-preview-native');
  if (!url) {
    container.classList.add('hidden');
    return;
  }
  container.classList.remove('hidden');
  if (url.includes('youtube.com/watch?v=')) {
    iframe.src = url.replace('watch?v=', 'embed/');
    iframe.classList.remove('hidden');
    nativeVid.classList.add('hidden');
  } else if (url.includes('youtu.be/')) {
    const vId = url.split('youtu.be/')[1]?.split('?')[0];
    iframe.src = `https://www.youtube.com/embed/${vId}`;
    iframe.classList.remove('hidden');
    nativeVid.classList.add('hidden');
  } else {
    nativeVid.src = url;
    nativeVid.classList.remove('hidden');
    iframe.classList.add('hidden');
  }
};

window.Views.admin.updateAudioPreview = function(url) {
  const container = document.getElementById('audio-preview-container');
  const player = document.getElementById('audio-preview-player');
  if (!url) { container.classList.add('hidden'); return; }
  container.classList.remove('hidden');
  player.src = url;
};

window.Views.admin.updateImagePreview = function(url) {
  if (url) document.getElementById('image-preview-img').src = url;
};

window.Views.admin.testVideoUrl = function() {
  const url = document.getElementById('les-url').value.trim();
  if (url) {
    window.Views.admin.updateVideoPreview(url);
    window.App.showToast('ویڈیو لوڈ ہو گئی!', 'info');
  }
};

// Save Complete Rich Multi-Media Lesson
window.Views.admin.saveNewLesson = async function(e, courseId, lessonId) {
  e.preventDefault();
  const title = document.getElementById('les-title').value.trim();
  const sectionTitle = document.getElementById('les-section').value.trim() || 'عام اسباق';
  const type = window._LessonStudioState.activeTab || 'video';
  const durationMinutes = parseInt(document.getElementById('les-duration').value, 10) || 20;
  const videoUrl = document.getElementById('les-url').value.trim() || window._LessonStudioState.uploadedVideoUrl;
  const audioUrl = document.getElementById('les-audio-url').value.trim() || window._LessonStudioState.uploadedAudioUrl || window._LessonStudioState.recordedAudioUrl;
  const imageUrl = document.getElementById('les-image-url').value.trim() || window._LessonStudioState.uploadedImageUrl;
  const arabicText = document.getElementById('les-arabic').value.trim();
  const contentBody = document.getElementById('les-body').value.trim();
  const isFreePreview = document.getElementById('les-preview').checked;
  const isRequired = document.getElementById('les-prereq').checked;

  const existingLessons = window.DB.get('lessons').filter(l => l.courseId === courseId);
  const newOrder = lessonId ? (window.DB.findById('lessons', lessonId)?.order || existingLessons.length) : (existingLessons.length + 1);

  await window.API.saveLesson({
    id: lessonId || undefined,
    courseId,
    order: newOrder,
    title,
    sectionTitle,
    type,
    durationMinutes,
    videoUrl,
    audioUrl,
    imageUrl,
    arabicText,
    contentBody,
    isFreePreview,
    isRequired,
    attachments: window._LessonStudioState.attachments || [],
    resources: window._LessonStudioState.attachments || []
  });

  window.App.showToast(lessonId ? 'سبق تمام ملٹی میڈیا مواد کے ساتھ اپ ڈیٹ ہو گیا!' : 'نیا سبق نصاب میں شامل ہو گیا!', 'success');
  window.Views.admin.openManageLessonsModal(courseId);
};

window.Views.admin.deleteLesson = async function(courseId, lessonId) {
  if (confirm('کیا آپ واقعی یہ سبق حذف کرنا چاہتے ہیں؟')) {
    await window.API.deleteLesson(lessonId);
    window.App.showToast('سبق نصاب سے ہٹا دیا گیا۔', 'info');
    window.Views.admin.openManageLessonsModal(courseId);
  }
};



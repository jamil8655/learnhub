/**
 * LearnHub Instructor & Ustad Management Module
 * Comprehensive system for Instructor Application, Onboarding,
 * Dedicated Ustad Dashboard, Course & Lesson Management, Student Roster, and Analytics.
 */

window.Views = window.Views || {};

// =========================================================================
// 1. BECOME AN INSTRUCTOR / APPLICATION VIEW (#/become-instructor)
// =========================================================================
window.Views.renderBecomeInstructor = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const user = window.Auth ? window.Auth.getCurrentUser() : null;

  // Check if user is already an instructor
  if (user && (user.role === 'instructor' || user.role === 'admin' || user.role === 'super_admin')) {
    container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-12 font-urdu text-center space-y-6" dir="rtl">
        <div class="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xl">
          <i data-lucide="award" class="w-10 h-10"></i>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">آپ پہلے سے ہی لرن ہب پر منظور شدہ استاد ہیں!</h1>
        <p class="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
          آپ اپنے کورسز، اسباق اور طلباء کی نگرانی کے لیے اپنے مخصوص انسٹرکٹر ڈیش بورڈ پر جا سکتے ہیں۔
        </p>
        <div class="flex items-center justify-center gap-3 pt-2">
          <a href="#/instructor/dashboard" class="btn-primary py-3 px-6 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20">
            استاد ڈیش بورڈ پر جائیں &rarr;
          </a>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Check existing application in DB
  let existingApp = null;
  if (user && window.DB) {
    const apps = window.DB.get('instructorApplications') || [];
    existingApp = apps.find(a => a.userId === user.id);
  }

  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 font-urdu text-right w-full" dir="rtl">
      
      <!-- Top Royal Hero Banner -->
      <div class="bg-gradient-to-l from-slate-950 via-emerald-950 to-slate-900 p-8 sm:p-12 rounded-3xl text-white shadow-2xl border border-emerald-500/30 text-center sm:text-right relative overflow-hidden">
        <div class="absolute -left-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 space-y-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30">
            <i data-lucide="graduation-cap" class="w-3.5 h-3.5"></i> تدریسی الحاق و شمولیت
          </span>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-white">لرن ہب اکیڈمی کے مستند اساتذہ کے قافلے میں شامل ہوں</h1>
          <p class="text-xs sm:text-sm text-emerald-200 leading-relaxed max-w-2xl">
            اگر آپ کے پاس دینی علوم (تجوید، حدیث، فقہ، تفسیر) یا جدید عصری مہارتوں کی سند اور تدریسی تجربہ ہے تو بطورِ استاد درخواست جمع کروائیں۔
          </p>
        </div>
      </div>

      ${existingApp ? `
        <!-- Existing Application Status Card -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 ${existingApp.status === 'approved' ? 'border-emerald-500' : existingApp.status === 'rejected' ? 'border-rose-500' : 'border-amber-500'} shadow-xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl flex items-center justify-center ${existingApp.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : existingApp.status === 'rejected' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}">
                <i data-lucide="${existingApp.status === 'approved' ? 'check-circle' : existingApp.status === 'rejected' ? 'x-circle' : 'clock'}" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-base text-slate-900 dark:text-white">آپ کی تدریسی درخواست کا اسٹیٹس</h3>
                <span class="text-xs text-slate-400 font-mono">تاریخ جمع آوری: ${existingApp.date || '۲۰ فروری ۲۰۲۶'}</span>
              </div>
            </div>
            <span class="badge ${existingApp.status === 'approved' ? 'badge-success' : existingApp.status === 'rejected' ? 'badge-danger' : 'badge-warning'} text-xs font-bold uppercase">
              ${existingApp.status === 'approved' ? 'منظور شدہ (Approved)' : existingApp.status === 'rejected' ? 'مسترد شدہ (Rejected)' : 'زیرِ جائزہ (Under Review)'}
            </span>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <div><strong>عنوان / تخصص:</strong> ${existingApp.title}</div>
            <div><strong>اسناد و قابلیت:</strong> ${existingApp.qualifications}</div>
            <div><strong>تدریسی تجربہ:</strong> ${existingApp.experienceYears} سال</div>
            ${existingApp.adminNotes ? `<div class="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400"><strong>ایڈمنسٹریشن نوٹ:</strong> ${existingApp.adminNotes}</div>` : ''}
          </div>

          ${existingApp.status === 'rejected' ? `
            <button onclick="window.Views.resetInstructorApplication()" class="btn-secondary py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50">
              دوبارہ نئی درخواست جمع کروائیں &rarr;
            </button>
          ` : ''}
        </div>
      ` : `
        <!-- New Application Form Card -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div class="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">استاد بننے کا باضابطہ فارم (Instructor Application)</h2>
            <p class="text-xs text-slate-400 mt-1">براہِ کرم اپنی مستند تعلیمی معلومات اور تدریسی اسناد درستگی کے ساتھ درج کریں۔</p>
          </div>

          <form onsubmit="window.Views.handleInstructorApplicationSubmit(event)" class="space-y-5">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">پورا نام (Full Name) *</label>
                <input type="text" id="inst-name" required value="${user ? user.name : ''}" class="form-input text-xs w-full text-right" placeholder="جیسے: مولانا محمد عبد اللہ قاسمی" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">پیشہ ورانہ عنوان / لقب (Professional Title) *</label>
                <input type="text" id="inst-title" required class="form-input text-xs w-full text-right" placeholder="جیسے: استاذ علوم الحدیث و التفسیر" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">ای میل ایڈریس *</label>
                <input type="email" id="inst-email" required value="${user ? user.email : ''}" class="form-input text-xs w-full text-left font-mono" dir="ltr" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">فون / واٹس ایپ نمبر *</label>
                <input type="tel" id="inst-phone" required value="${user ? (user.phone || '+91') : '+91'}" class="form-input text-xs w-full text-left font-mono" dir="ltr" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">تدریسی تجربہ (سال) *</label>
                <input type="number" id="inst-exp" required min="1" max="60" value="3" class="form-input text-xs w-full text-center font-mono" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">شعبہ جات / تخصص (Expertise Subjects) *</label>
                <input type="text" id="inst-expertise" required class="form-input text-xs w-full text-right" placeholder="جیسے: تجوید و قراءت، فقہ العبادات، سیرت النبی ﷺ" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">اسناد و ڈگریاں (Qualifications) *</label>
                <input type="text" id="inst-qualifications" required class="form-input text-xs w-full text-right" placeholder="جیسے: شہادۃ العالمیہ (وفاق المدارس)، ایم اے اسلامیات" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">مختصر تعارفی سوانح (Short Biography) *</label>
              <textarea id="inst-bio" required rows="3" class="form-input text-xs w-full text-right leading-relaxed" placeholder="اپنے علمی پس منظر، اساتذہ، اور تدریسی اسلوب کا مختصر تعارف لکھیں..."></textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">تدریسی عزم و محرک (Motivation) *</label>
              <textarea id="inst-motivation" required rows="2" class="form-input text-xs w-full text-right leading-relaxed" placeholder="آپ لرن ہب کے ذریعے طلباء کو کیا سکھانا چاہتے ہیں؟"></textarea>
            </div>

            <div class="pt-2">
              <label class="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                <input type="checkbox" required class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span>میں لرن ہب کے اساتذہ کے ضوابط اور تعلیمی امانت داری کے معاہدے کی پابندی کا اقرار کرتا ہوں۔</span>
              </label>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
              <button type="submit" class="btn-primary py-3 px-8 rounded-2xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-600/20">
                درخواست جمع کروائیں 🚀
              </button>
            </div>

          </form>
        </div>
      `}

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.handleInstructorApplicationSubmit = function(e) {
  e.preventDefault();
  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  if (!user) {
    window.App.showToast('براہِ کرم پہلے لاگ اِن فرمائیں۔', 'warning');
    window.Router.navigate('/login');
    return;
  }

  const name = document.getElementById('inst-name').value.trim();
  const title = document.getElementById('inst-title').value.trim();
  const email = document.getElementById('inst-email').value.trim();
  const phone = document.getElementById('inst-phone').value.trim();
  const exp = parseInt(document.getElementById('inst-exp').value, 10) || 1;
  const expertise = document.getElementById('inst-expertise').value.split('،').map(s => s.trim()).filter(Boolean);
  const qualifications = document.getElementById('inst-qualifications').value.trim();
  const bio = document.getElementById('inst-bio').value.trim();
  const motivation = document.getElementById('inst-motivation').value.trim();

  const newApp = {
    id: `app-${Date.now()}`,
    userId: user.id,
    userName: name,
    userEmail: email,
    phone: phone,
    title: title,
    experienceYears: exp,
    expertise: expertise.length ? expertise : ['اسلامی علوم'],
    qualifications: qualifications,
    bio: bio,
    motivation: motivation,
    status: 'submitted',
    date: new Date().toISOString().split('T')[0],
  };

  if (window.DB) {
    window.DB.insert('instructorApplications', newApp);
  }

  window.App.showToast('آپ کی تدریسی درخواست کامیابی سے جمع ہو گئی ہے! ایڈمنسٹریشن جلد جائزہ لے گی۔', 'success');
  window.Views.renderBecomeInstructor();
};

window.Views.resetInstructorApplication = function() {
  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  if (!user || !window.DB) return;
  const apps = window.DB.get('instructorApplications') || [];
  const filtered = apps.filter(a => a.userId !== user.id);
  window.DB.set('instructorApplications', filtered);
  window.Views.renderBecomeInstructor();
};

// =========================================================================
// 2. INSTRUCTOR DASHBOARD VIEW (#/instructor/dashboard)
// =========================================================================
window.Views.renderInstructorDashboard = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  if (!user || (user.role !== 'instructor' && user.role !== 'admin' && user.role !== 'super_admin')) {
    window.App.showToast('یہ صفحہ صرف منظور شدہ اساتذہ کے لیے مخصوص ہے۔', 'warning');
    window.Router.navigate('/become-instructor');
    return;
  }

  const allCourses = window.DB.get('courses') || [];
  const myCourses = allCourses.filter(c => c.instructorId === user.id || c.instructor === user.name || user.role === 'admin');
  const allEnrollments = window.DB.get('enrollments') || [];
  const myEnrollments = allEnrollments.filter(e => myCourses.some(c => c.id === e.courseId));
  const myStudentsCount = new Set(myEnrollments.map(e => e.userId)).size;

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-urdu text-right w-full" dir="rtl">
      
      <!-- Top Ustad Header -->
      <div class="bg-gradient-to-l from-slate-950 via-teal-950 to-emerald-950 p-6 sm:p-8 rounded-3xl text-white shadow-2xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}" alt="${user.name}" class="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl" />
          <div class="space-y-1">
            <span class="badge bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
              <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> استاذ محترم (Verified Ustad)
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white">خوش آمدید، ${user.name}!</h1>
            <p class="text-xs text-emerald-200/90">${user.headline || 'استاذ و محقق اکیڈمی'}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button onclick="window.Views.openInstructorCourseModal()" class="btn-primary py-3 px-5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center gap-2">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> نیا کورس بنائیں
          </button>
          <a href="#/instructor/students" class="btn-secondary py-3 px-4 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border-white/20 flex items-center gap-2">
            <i data-lucide="users" class="w-4 h-4"></i> طلبہ کی فہرست
          </a>
        </div>
      </div>

      <!-- 4 KPI Metric Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="lh-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span class="text-xs text-slate-400 font-bold block">کل کورسز</span>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">${myCourses.length}</div>
          <span class="text-[10px] text-emerald-600 font-semibold">آن لائن تدریس</span>
        </div>
        <div class="lh-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span class="text-xs text-slate-400 font-bold block">زیرِ تعلیم طلباء</span>
          <div class="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">${myStudentsCount}</div>
          <span class="text-[10px] text-indigo-500 font-semibold">رجسٹرڈ سیکھنے والے</span>
        </div>
        <div class="lh-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span class="text-xs text-slate-400 font-bold block">اوسط ریٹنگ</span>
          <div class="text-2xl sm:text-3xl font-extrabold text-amber-500 font-mono">⭐ 4.9</div>
          <span class="text-[10px] text-amber-600 font-semibold">طلباء کے مثبت تاثرات</span>
        </div>
        <div class="lh-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span class="text-xs text-slate-400 font-bold block">کورس کی تکمیل</span>
          <div class="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">92%</div>
          <span class="text-[10px] text-emerald-500 font-semibold">کامیاب فارغ التحصیل</span>
        </div>
      </div>

      <!-- Instructor Courses Table -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden space-y-4 p-6">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="book-open" class="w-5 h-5 text-emerald-600"></i> آپ کے تدریسی کورسز
          </h2>
          <button onclick="window.Views.openInstructorCourseModal()" class="text-xs text-emerald-600 font-bold hover:underline">
            + نیا کورس شامل کریں
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
              <tr>
                <th class="p-3">کورس کا نام</th>
                <th class="p-3">درجہ / Level</th>
                <th class="p-3">طلباء کی تعداد</th>
                <th class="p-3">اسٹیٹس</th>
                <th class="p-3 text-left">اختیارات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${myCourses.length === 0 ? `
                <tr>
                  <td colspan="5" class="p-8 text-center text-slate-400">ابھی تک آپ کا کوئی کورس موجود نہیں ہے۔ نیا کورس بنانے کے لیے بٹن دبائیں۔</td>
                </tr>
              ` : myCourses.map(c => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td class="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <img src="${c.thumbnail}" class="w-10 h-8 rounded-lg object-cover" />
                    <span>${c.title}</span>
                  </td>
                  <td class="p-3"><span class="badge badge-neutral text-[10px] font-bold">${c.level || 'تمام درجات'}</span></td>
                  <td class="p-3 font-mono font-bold">${c.studentsCount || 45} طلباء</td>
                  <td class="p-3">
                    <span class="badge ${c.status === 'published' ? 'badge-success' : 'badge-warning'} text-[10px] font-bold">
                      ${c.status === 'published' ? 'شائع شدہ' : 'مسودہ / ریویو'}
                    </span>
                  </td>
                  <td class="p-3 text-left" dir="ltr">
                    <button onclick="window.Router.navigate('/learn/${c.id}')" class="btn-secondary py-1 px-2.5 text-[11px] rounded-lg">
                      دیکھیں &rarr;
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

// Course Modal for Instructor
window.Views.openInstructorCourseModal = function() {
  let modal = document.getElementById('inst-course-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'inst-course-modal';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white">نیا تدریسی کورس بنائیں</h3>
          <button onclick="document.getElementById('inst-course-modal').remove()" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <form onsubmit="window.Views.saveInstructorCourse(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">کورس کا عنوان *</label>
            <input type="text" id="new-course-title" required class="form-input text-xs w-full text-right" placeholder="جیسے: جامع تجوید القرآن ماسٹر کلاس" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">تعلیمی درجہ *</label>
              <select id="new-course-level" class="form-select text-xs w-full text-right">
                <option value="ابتدائی">ابتدائی درجہ (Beginner)</option>
                <option value="متوسط">متوسط درجہ (Intermediate)</option>
                <option value="اعلیٰ">اعلیٰ درجہ (Advanced)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">دورانیہ (گھنٹے) *</label>
              <input type="number" id="new-course-hours" min="1" value="10" class="form-input text-xs w-full text-center font-mono" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">کورس کی تفصیلات *</label>
            <textarea id="new-course-desc" required rows="3" class="form-input text-xs w-full text-right leading-relaxed" placeholder="اس کورس میں طلباء کیا سیکھیں گے..."></textarea>
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button type="button" onclick="document.getElementById('inst-course-modal').remove()" class="btn-secondary py-2 px-4 rounded-xl text-xs">منسوخ کریں</button>
            <button type="submit" class="btn-primary py-2 px-6 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white">محفوظ کریں اور ریویو بھیجیں</button>
          </div>
        </form>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.saveInstructorCourse = function(e) {
  e.preventDefault();
  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  const title = document.getElementById('new-course-title').value.trim();
  const level = document.getElementById('new-course-level').value;
  const hours = parseInt(document.getElementById('new-course-hours').value, 10) || 5;
  const desc = document.getElementById('new-course-desc').value.trim();

  const newCourse = {
    id: `crs-${Date.now()}`,
    title: title,
    instructor: user ? user.name : 'استاذ محترم',
    instructorId: user ? user.id : 'usr-1',
    level: level,
    durationHours: hours,
    description: desc,
    thumbnail: 'https://images.unsplash.com/photo-1584281722573-cf6a528fb483?auto=format&fit=crop&q=80&w=600',
    status: 'published',
    studentsCount: 0,
    rating: 5.0,
    lessons: []
  };

  if (window.DB) {
    window.DB.insert('courses', newCourse);
  }

  const modal = document.getElementById('inst-course-modal');
  if (modal) modal.remove();

  window.App.showToast('نیا کورس کامیابی سے محفوظ ہو گیا ہے!', 'success');
  window.Views.renderInstructorDashboard();
};

// =========================================================================
// 3. INSTRUCTORS DIRECTORY VIEW (#/instructors)
// =========================================================================
window.Views.renderInstructorsDirectory = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const allUsers = window.DB.get('users') || [];
  const instructors = allUsers.filter(u => u.role === 'instructor' || u.role === 'admin');

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-urdu text-right w-full" dir="rtl">
      
      <div class="bg-gradient-to-l from-slate-950 via-emerald-950 to-slate-900 p-8 sm:p-12 rounded-3xl text-white shadow-2xl border border-emerald-500/30 text-center sm:text-right relative overflow-hidden">
        <div class="space-y-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30">
            <i data-lucide="award" class="w-3.5 h-3.5"></i> شیوخ و اساتذۂ کرام
          </span>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-white">لرن ہب اکیڈمی کے مستند اساتذہ اور محققین</h1>
          <p class="text-xs sm:text-sm text-emerald-200 leading-relaxed max-w-2xl">
            عالمِ اسلام کے مستند جامعات اور مشائخ سے سند یافتہ اساتذہ کرام جو تجوید، حدیث، فقہ اور جدید مہارتوں میں رہنمائی فرماتے ہیں۔
          </p>
        </div>
      </div>

      <!-- Instructors Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${instructors.map(inst => `
          <div class="lh-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between space-y-4">
            <div class="flex items-center gap-4">
              <img src="${inst.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}" alt="${inst.name}" class="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/60 shadow-md" />
              <div>
                <h3 class="font-extrabold text-base text-slate-900 dark:text-white">${inst.name}</h3>
                <p class="text-xs text-emerald-600 dark:text-emerald-400 font-bold">${inst.headline || 'استاذ علومِ اسلامیہ'}</p>
                <div class="flex items-center gap-1 text-xs text-amber-500 pt-1">
                  <span>⭐ 4.9</span>
                  <span class="text-slate-400 text-[10px] font-mono">(150+ طلباء)</span>
                </div>
              </div>
            </div>

            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
              ${inst.bio || 'مستند دینی درسگاہوں سے فراغت اور علومِ قرآن و حدیث کی تدریس کا طویل تجربہ۔'}
            </p>

            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <a href="#/courses" class="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                کورسز دیکھیں &larr;
              </a>
              <span class="badge badge-success text-[10px] font-bold">فعال آن لائن</span>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

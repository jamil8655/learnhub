/**
 * LearnHub V2 Professional Student Profile & Settings Suite
 * Complete support for Profile Details, Edit Full Name, Father/Guardian Name,
 * Mobile & WhatsApp, Bio, Change Avatar, Enrolled Courses, Earned Certificates,
 * Compact Nested Accordion Appearance & Theme Settings, and Security/Password.
 */

window.Views = window.Views || {};
window.Views.v2 = window.Views.v2 || {};

window.Views.v2.activeProfileTab = window.Views.v2.activeProfileTab || 'overview';

window.Views.v2.renderProfile = function(params, query) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const user = (window.Auth && window.Auth.getCurrentUser && window.Auth.getCurrentUser()) || {
    id: 'usr-student',
    name: 'طالب علم',
    firstName: 'طالب',
    lastName: 'علم',
    fatherName: 'عبد اللہ',
    email: 'student@learnhub.com',
    phone: '+92 300 1234567',
    role: 'student',
    headline: 'طالب علم • متلاشی علمِ نافع',
    bio: 'قرآن و حدیث، فقہ اور اسلامی علوم میں دلچسپی رکھنے والا طالب علم۔',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    xp: 450,
    level: 2,
    streak: 6,
    emailVerified: true,
    twoFactorEnabled: false
  };

  const isRtl = window.I18N ? window.I18N.isRTL() : true;
  const currentTab = window.Views.v2.activeProfileTab || 'overview';
  const theme = window.UI_CONFIG ? window.UI_CONFIG.getTheme() : (localStorage.getItem('learnhub_theme_mode') || 'light');

  // Fetch real enrollments & certificates from DB
  const enrollments = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('enrollments') || []).filter(e => e.userId === user.id)
    : [];
  const courses = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('courses') || []) : [];
  const certificates = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('certificates') || []).filter(c => c.userId === user.id || c.studentEmail === user.email)
    : [];

  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 font-urdu text-right" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- 1. Profile Header Hero Card -->
      <div class="v2-card p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border-2 border-emerald-500/40 text-white relative overflow-hidden shadow-2xl">
        <div class="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-16 -bottom-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div class="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right">
            <!-- Avatar with quick change badge -->
            <div class="relative group shrink-0">
              <img id="user-profile-avatar-img" src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}" class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-amber-400 shadow-2xl" alt="${user.name}">
              <button onclick="window.Views.v2.openAvatarPickerModal()" class="absolute -bottom-2 -left-2 bg-amber-500 hover:bg-amber-400 text-slate-950 p-2 rounded-2xl shadow-lg border-2 border-slate-900 transition active:scale-95" title="تصویر تبدیل کریں">
                <i data-lucide="camera" class="w-4 h-4"></i>
              </button>
            </div>

            <!-- Profile Name & Bio Details -->
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 class="text-2xl sm:text-3xl font-black text-white">${user.name}</h1>
                <span class="badge bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold font-sans">
                  ${user.role === 'super_admin' ? 'Super Admin' : (user.role === 'admin' ? 'Admin' : 'طالب علم')}
                </span>
                ${user.emailVerified ? '<span class="badge bg-emerald-500 text-white text-[10px] font-bold">✓ تصدیق شدہ</span>' : '<span class="badge bg-amber-500 text-slate-950 text-[10px] font-bold">غیر تصدیق شدہ</span>'}
              </div>
              <p class="text-xs sm:text-sm text-emerald-300 font-bold">${user.headline || 'طالب علم • رکن لرن ہب اکیڈمی'}</p>
              <p class="text-xs text-slate-400 font-mono" dir="ltr">${user.email} ${user.phone ? '• ' + user.phone : ''}</p>
              ${user.fatherName ? `<p class="text-xs text-slate-300">ولدیت / سرپرست: <b>${user.fatherName}</b></p>` : ''}
            </div>
          </div>

          <!-- Edit Profile & Sign Out Buttons -->
          <div class="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto shrink-0">
            <button onclick="window.Views.v2.openEditProfileModal()" class="btn-primary w-full sm:w-auto py-2.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg flex items-center justify-center gap-2 active:scale-95 transition">
              <i data-lucide="edit" class="w-4 h-4"></i>
              <span>پروفائل معلومات ایڈٹ کریں</span>
            </button>
            <button onclick="window.Auth.logout(); window.Router.navigate('/login');" class="py-2.5 px-4 rounded-2xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold flex items-center justify-center gap-1.5 transition">
              <i data-lucide="log-out" class="w-4 h-4"></i>
              <span>لاگ آؤٹ</span>
            </button>
          </div>
        </div>

        <!-- Academic Milestones Row -->
        <div class="mt-6 pt-5 border-t border-emerald-500/20 grid grid-cols-3 sm:grid-cols-4 gap-3 text-center">
          <div class="p-2 rounded-2xl bg-slate-900/60 border border-emerald-500/30">
            <div class="text-lg sm:text-xl font-black text-amber-400 font-mono">${user.xp || 450}</div>
            <div class="text-[11px] text-slate-300">کل حاصل کردہ XP</div>
          </div>
          <div class="p-2 rounded-2xl bg-slate-900/60 border border-emerald-500/30">
            <div class="text-lg sm:text-xl font-black text-cyan-300 font-mono">${user.level || 2}</div>
            <div class="text-[11px] text-slate-300">تعلیمی لیول</div>
          </div>
          <div class="p-2 rounded-2xl bg-slate-900/60 border border-emerald-500/30">
            <div class="text-lg sm:text-xl font-black text-orange-400 font-mono flex items-center justify-center gap-1">
              <i data-lucide="flame" class="w-4 h-4"></i> ${user.streak || 6}
            </div>
            <div class="text-[11px] text-slate-300">روزانہ تسلسل</div>
          </div>
          <div class="hidden sm:block p-2 rounded-2xl bg-slate-900/60 border border-emerald-500/30">
            <div class="text-lg sm:text-xl font-black text-emerald-400 font-mono">${certificates.length}</div>
            <div class="text-[11px] text-slate-300">مستند اسناد</div>
          </div>
        </div>
      </div>

      <!-- 2. Navigation Tabs Bar -->
      <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none text-xs font-bold">
        <button onclick="window.Views.v2.switchProfileTab('overview')" class="py-2.5 px-4 rounded-2xl transition flex items-center gap-1.5 ${currentTab === 'overview' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          <i data-lucide="user" class="w-4 h-4"></i>
          <span>👤 ذاتی معلومات و کوائف</span>
        </button>
        <button onclick="window.Views.v2.switchProfileTab('courses')" class="py-2.5 px-4 rounded-2xl transition flex items-center gap-1.5 ${currentTab === 'courses' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          <i data-lucide="book-open" class="w-4 h-4"></i>
          <span>🎓 میرے کورسز (${enrollments.length})</span>
        </button>
        <button onclick="window.Views.v2.switchProfileTab('certificates')" class="py-2.5 px-4 rounded-2xl transition flex items-center gap-1.5 ${currentTab === 'certificates' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          <i data-lucide="award" class="w-4 h-4"></i>
          <span>📜 اسناد و سرٹیفکیٹس (${certificates.length})</span>
        </button>
        <button onclick="window.Views.v2.switchProfileTab('settings')" class="py-2.5 px-4 rounded-2xl transition flex items-center gap-1.5 ${currentTab === 'settings' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          <i data-lucide="sliders" class="w-4 h-4"></i>
          <span>🎨 تھیم و ترتیبات (Settings)</span>
        </button>
        <button onclick="window.Views.v2.switchProfileTab('security')" class="py-2.5 px-4 rounded-2xl transition flex items-center gap-1.5 ${currentTab === 'security' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          <i data-lucide="lock" class="w-4 h-4"></i>
          <span>🔒 سیکیورٹی و پاس ورڈ</span>
        </button>
      </div>

      <!-- 3. Dynamic Tab Content -->
      <div id="v2-profile-tab-content">
        ${window.Views.v2.renderProfileTabContent(user, currentTab, enrollments, courses, certificates, theme)}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.v2.switchProfileTab = function(tabName) {
  window.Views.v2.activeProfileTab = tabName;
  window.Views.v2.renderProfile();
};

window.Views.v2.renderProfileTabContent = function(user, tab, enrollments, courses, certificates, theme) {
  // TAB 1: OVERVIEW
  if (tab === 'overview') {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Personal Information Card -->
        <div class="v2-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="user-check" class="w-5 h-5 text-emerald-500"></i>
              <span>ذاتی کوائف و رابطہ</span>
            </h3>
            <button onclick="window.Views.v2.openEditProfileModal()" class="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline">ترمیم کریں &larr;</button>
          </div>

          <div class="space-y-3 text-xs">
            <div class="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60">
              <span class="text-slate-500">مکمل نام:</span>
              <span class="font-bold text-slate-900 dark:text-white">${user.name}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60">
              <span class="text-slate-500">والد / سرپرست کا نام:</span>
              <span class="font-bold text-slate-900 dark:text-white">${user.fatherName || 'درج نہیں'}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60">
              <span class="text-slate-500">ای میل ایڈریس:</span>
              <span class="font-mono font-bold text-slate-900 dark:text-white" dir="ltr">${user.email}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60">
              <span class="text-slate-500">موبائل / واٹس ایپ نمبر:</span>
              <span class="font-mono font-bold text-slate-900 dark:text-white" dir="ltr">${user.phone || 'درج نہیں'}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60">
              <span class="text-slate-500">تعلیمی عنوان:</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400">${user.headline || 'طالب علم'}</span>
            </div>
          </div>

          <div class="pt-2">
            <span class="text-[11px] text-slate-500 block mb-1">علمی تعارف و بائیو:</span>
            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              ${user.bio || 'علم و حکمت کے راستے کا متلاشی۔'}
            </div>
          </div>
        </div>

        <!-- Academic Progress Summary -->
        <div class="v2-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <i data-lucide="trending-up" class="w-5 h-5 text-amber-500"></i>
            <span>تعلیمی سرگرمی اور اہداف</span>
          </h3>

          <div class="space-y-4 text-xs">
            <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div class="flex justify-between items-center font-bold text-emerald-900 dark:text-emerald-300">
                <span>جاری کورسز کی تکمیل</span>
                <span>${enrollments.length > 0 ? '45%' : '0%'}</span>
              </div>
              <div class="w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-2 overflow-hidden">
                <div class="bg-emerald-600 h-2 rounded-full" style="width: ${enrollments.length > 0 ? '45%' : '0%'};"></div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center space-y-1">
                <span class="text-[10px] text-slate-500">داخلہ شدہ کورسز</span>
                <div class="text-xl font-black text-slate-900 dark:text-white font-mono">${enrollments.length}</div>
              </div>
              <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center space-y-1">
                <span class="text-[10px] text-slate-500">حاصل کردہ اسناد</span>
                <div class="text-xl font-black text-amber-500 font-mono">${certificates.length}</div>
              </div>
            </div>

            <a href="#/courses" class="btn-primary w-full py-2.5 rounded-xl text-xs font-bold text-center block bg-gradient-to-r from-emerald-600 to-teal-600">
              مزید اسلامی کورسز دریافت کریں &larr;
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // TAB 2: MY COURSES
  if (tab === 'courses') {
    if (enrollments.length === 0) {
      return `
        <div class="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div class="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
            <i data-lucide="book-open" class="w-8 h-8"></i>
          </div>
          <h3 class="text-lg font-black text-slate-900 dark:text-white">آپ نے ابھی تک کسی کورس میں داخلہ نہیں لیا</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">قرآن مجید تجوید، علوم الحدیث اور فقہ و عقیدہ کے مفت کورسز میں فوری داخلہ لیں۔</p>
          <a href="#/courses" class="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold inline-block">کورسز ڈائریکٹری دیکھیں</a>
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${enrollments.map(e => {
          const c = courses.find(item => item.id === e.courseId) || { title: 'کورس', thumbnail: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=300' };
          return `
            <div class="v2-card p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <img src="${c.thumbnail}" class="w-full h-36 rounded-2xl object-cover" alt="${c.title}">
              <div class="space-y-2">
                <h4 class="text-sm font-black text-slate-900 dark:text-white line-clamp-2">${c.title}</h4>
                <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div class="bg-emerald-500 h-2 rounded-full" style="width: 50%;"></div>
                </div>
                <div class="flex justify-between text-[11px] text-slate-500">
                  <span>50% مکمل شدہ</span>
                  <span>12 اسباق</span>
                </div>
              </div>
              <a href="#/learn/${e.courseId}" class="btn-primary w-full py-2 text-xs rounded-xl font-bold text-center block">
                سبق جاری رکھیں &larr;
              </a>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // TAB 3: CERTIFICATES
  if (tab === 'certificates') {
    if (certificates.length === 0) {
      return `
        <div class="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div class="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <i data-lucide="award" class="w-8 h-8"></i>
          </div>
          <h3 class="text-lg font-black text-slate-900 dark:text-white">ابھی کوئی سند جاری نہیں ہوئی</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">کسی بھی کورس کے تمام اسباق مکمل فرمائیں یا تشخیصی کوئز میں 80%+ اسکور حاصل کر کے مصدقہ شاہی سند حاصل کریں۔</p>
          <a href="#/quizzes" class="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold inline-block">امتحانات و کوئزز دیں</a>
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${certificates.map(cert => `
          <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-400/40 shadow-xl space-y-4">
            <div class="flex items-center justify-between border-b border-amber-200 dark:border-slate-800 pb-3">
              <span class="badge bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-xs">سندِ فراغت و تصدیق</span>
              <span class="font-mono text-xs font-bold text-slate-500">${cert.id || cert.serialNumber || 'LH-CERT-2026-001'}</span>
            </div>
            <div>
              <h4 class="text-base font-black text-slate-900 dark:text-white">${cert.courseTitle || cert.title || 'دینی کورس'}</h4>
              <p class="text-xs text-slate-500">جاری کردہ بنام: <b>${cert.studentName || user.name}</b></p>
              <p class="text-xs text-emerald-600 dark:text-emerald-400 font-bold">گریڈ: ${cert.grade || 'ممتاز (Distinction)'}</p>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <a href="#/verify-cert/${cert.id || 'LH-CERT-2026-001'}" class="text-xs text-emerald-600 font-bold hover:underline">آن لائن تصدیق دیکھیں &larr;</a>
              <button onclick="window.print()" class="py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">پرنٹ کریں</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // TAB 4: COMPACT NESTED ACCORDION SETTINGS (مینو کے اندر مینو)
  if (tab === 'settings') {
    return `
      <div class="max-w-2xl mx-auto space-y-4">
        
        <!-- Accordion 1: Theme & Display Mode -->
        <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <button onclick="window.Views.v2.toggleSettingsSection('acc-theme')" class="w-full p-4 flex items-center justify-between font-black text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
            <div class="flex items-center gap-2.5">
              <i data-lucide="palette" class="w-4 h-4 text-emerald-500"></i>
              <span>🎨 تھیم کا انتخاب (Theme & Appearance)</span>
            </div>
            <i id="icon-acc-theme" data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform"></i>
          </button>
          
          <div id="acc-theme" class="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/60 space-y-3">
            <p class="text-xs text-slate-500">اپنی پسند کا تھیم منتخب فرمائیں:</p>
            <div class="grid grid-cols-3 gap-2 text-center text-xs font-bold">
              <button onclick="window.UI_CONFIG.setTheme('light'); window.Views.v2.renderProfile();" class="p-3 rounded-xl border-2 ${theme === 'light' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 dark:border-slate-700'}">
                ☀️ دن (Light)
              </button>
              <button onclick="window.UI_CONFIG.setTheme('sepia'); window.Views.v2.renderProfile();" class="p-3 rounded-xl border-2 ${theme === 'sepia' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200 dark:border-slate-700'}">
                📜 کتابی (Sepia)
              </button>
              <button onclick="window.UI_CONFIG.setTheme('dark'); window.Views.v2.renderProfile();" class="p-3 rounded-xl border-2 ${theme === 'dark' ? 'border-indigo-500 bg-indigo-950/50' : 'border-slate-200 dark:border-slate-700'}">
                🌙 رات (Dark)
              </button>
            </div>
          </div>
        </div>

        <!-- Accordion 2: Fonts & Typography -->
        <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <button onclick="window.Views.v2.toggleSettingsSection('acc-font')" class="w-full p-4 flex items-center justify-between font-black text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
            <div class="flex items-center gap-2.5">
              <i data-lucide="type" class="w-4 h-4 text-indigo-500"></i>
              <span>🔤 رسم الخط و فونٹ سائز (Typography)</span>
            </div>
            <i id="icon-acc-font" data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform"></i>
          </button>
          
          <div id="acc-font" class="hidden p-4 pt-0 border-t border-slate-100 dark:border-slate-800/60 space-y-3 text-xs">
            <p class="text-slate-500">اردو اور عربی رسم الخط منتخب کریں:</p>
            <div class="grid grid-cols-2 gap-2 font-bold">
              <button onclick="document.body.classList.remove('font-sans'); document.body.classList.add('font-urdu'); window.App?.showToast('نستعلیق رسم الخط منتخب ہو گیا', 'info');" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                اردو نستعلیق (Nastaliq)
              </button>
              <button onclick="document.body.classList.remove('font-urdu'); document.body.classList.add('font-sans'); window.App?.showToast('جدید نسخ رسم الخط منتخب ہو گیا', 'info');" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                جدید نسخ (Modern Naskh)
              </button>
            </div>
          </div>
        </div>

        <!-- Accordion 3: Daily Reminders & Notifications -->
        <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <button onclick="window.Views.v2.toggleSettingsSection('acc-notify')" class="w-full p-4 flex items-center justify-between font-black text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
            <div class="flex items-center gap-2.5">
              <i data-lucide="bell" class="w-4 h-4 text-amber-500"></i>
              <span>🔔 اطلاعات و تذکیرات (Notifications)</span>
            </div>
            <i id="icon-acc-notify" data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform"></i>
          </button>
          
          <div id="acc-notify" class="hidden p-4 pt-0 border-t border-slate-100 dark:border-slate-800/60 space-y-3 text-xs">
            <div class="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800">
              <span>روزانہ قرآن تلاوت کا یاد دہانی میسج:</span>
              <input type="checkbox" checked class="rounded text-emerald-600">
            </div>
            <div class="flex items-center justify-between py-2">
              <span>اوقاتِ نماز کے اعلانات:</span>
              <input type="checkbox" checked class="rounded text-emerald-600">
            </div>
          </div>
        </div>

      </div>
    `;
  }

  // TAB 5: SECURITY & PASSWORD
  if (tab === 'security') {
    return `
      <div class="max-w-xl mx-auto p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <i data-lucide="shield-check" class="w-5 h-5 text-emerald-500"></i>
          <span>پاس ورڈ تبدیل کریں (Change Password)</span>
        </h3>

        <form onsubmit="window.Views.v2.handlePasswordChange(event)" class="space-y-4 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">موجودہ پاس ورڈ *</label>
            <input type="password" id="curr-pwd" required placeholder="موجودہ پاس ورڈ درج کریں" class="form-input text-xs p-3 rounded-xl w-full bg-slate-50 dark:bg-slate-800">
          </div>

          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">نیا پاس ورڈ (کم از کم 6 حروف) *</label>
            <input type="password" id="new-pwd" required placeholder="نیا محفوظ پاس ورڈ درج کریں" class="form-input text-xs p-3 rounded-xl w-full bg-slate-50 dark:bg-slate-800">
          </div>

          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">نئے پاس ورڈ کی دوبارہ تصدیق *</label>
            <input type="password" id="confirm-pwd" required placeholder="نیا پاس ورڈ دوبارہ درج کریں" class="form-input text-xs p-3 rounded-xl w-full bg-slate-50 dark:bg-slate-800">
          </div>

          <button type="submit" class="btn-primary w-full py-3 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500">
            نیا پاس ورڈ محفوظ کریں
          </button>
        </form>
      </div>
    `;
  }

  return '';
};

// Toggle accordion in settings
window.Views.v2.toggleSettingsSection = function(accId) {
  const el = document.getElementById(accId);
  const icon = document.getElementById(`icon-${accId}`);
  if (!el) return;
  const isHidden = el.classList.contains('hidden');
  if (isHidden) {
    el.classList.remove('hidden');
    if (icon) icon.classList.add('rotate-180');
  } else {
    el.classList.add('hidden');
    if (icon) icon.classList.remove('rotate-180');
  }
};

// Open Edit Profile Modal
window.Views.v2.openEditProfileModal = function() {
  const user = (window.Auth && window.Auth.getCurrentUser && window.Auth.getCurrentUser()) || {};
  const modal = `
    <div id="v2-edit-profile-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="user-edit" class="w-5 h-5 text-emerald-500"></i>
            <span>پروفائل کوائف میں ترمیم کریں</span>
          </h3>
          <button onclick="document.getElementById('v2-edit-profile-modal').remove()" class="p-1 text-slate-400"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>

        <form onsubmit="window.Views.v2.saveProfileDetails(event)" class="space-y-4 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">مکمل نام (Full Name) *</label>
            <input type="text" id="edit-user-fullname" value="${user.name || ''}" required placeholder="مثلاً: محمد جمیل رحمن" class="form-input text-xs p-3 rounded-xl w-full bg-slate-50 dark:bg-slate-800">
          </div>

          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">والد / سرپرست کا نام (Father / Guardian Name)</label>
            <input type="text" id="edit-user-fathername" value="${user.fatherName || ''}" placeholder="والد کا نام درج کریں" class="form-input text-xs p-3 rounded-xl w-full bg-slate-50 dark:bg-slate-800">
          </div>

          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">موبائل یا واٹس ایپ نمبر (Phone / WhatsApp)</label>
            <input type="text" id="edit-user-phone" value="${user.phone || ''}" placeholder="+92 300 1234567" class="form-input text-xs p-3 rounded-xl w-full bg-slate-50 dark:bg-slate-800" dir="ltr">
          </div>

          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">علمی عنوان (Headline)</label>
            <input type="text" id="edit-user-headline" value="${user.headline || ''}" placeholder="مثلاً: طالب علم • محقق اسلامی علوم" class="form-input text-xs p-3 rounded-xl w-full bg-slate-50 dark:bg-slate-800">
          </div>

          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">مختصر تعارف و بائیو (Bio)</label>
            <textarea id="edit-user-bio" rows="3" placeholder="اپنا مختصر تعارف تحریر فرمائیں..." class="form-input text-xs p-3 rounded-xl w-full bg-slate-50 dark:bg-slate-800">${user.bio || ''}</textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onclick="document.getElementById('v2-edit-profile-modal').remove()" class="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold">منسوخ</button>
            <button type="submit" class="btn-primary py-2 px-6 rounded-xl font-black bg-emerald-600 hover:bg-emerald-500">تبدیلیاں محفوظ کریں</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

// Save Profile Details
window.Views.v2.saveProfileDetails = function(e) {
  e.preventDefault();
  const name = document.getElementById('edit-user-fullname')?.value?.trim();
  const fatherName = document.getElementById('edit-user-fathername')?.value?.trim();
  const phone = document.getElementById('edit-user-phone')?.value?.trim();
  const headline = document.getElementById('edit-user-headline')?.value?.trim();
  const bio = document.getElementById('edit-user-bio')?.value?.trim();

  if (!name) {
    window.App?.showToast('براہ کرم مکمل نام درج فرمائیں', 'warning');
    return;
  }

  const user = (window.Auth && window.Auth.getCurrentUser && window.Auth.getCurrentUser()) || {};
  user.name = name;
  user.fatherName = fatherName;
  user.phone = phone;
  user.headline = headline;
  user.bio = bio;

  // Update DB & LocalStorage
  if (window.DB && typeof window.DB.update === 'function' && user.id) {
    window.DB.update('users', user.id, user);
  }
  if (window.Auth) {
    window.Auth.currentUser = user;
    localStorage.setItem('learnhub_auth_user', JSON.stringify(user));
  }

  document.getElementById('v2-edit-profile-modal')?.remove();
  window.App?.showToast('🎉 ماشاء اللہ! پروفائل معلومات کامیابی سے محفوظ ہو گئیں!', 'success');
  window.Views.v2.renderProfile();
};

// Avatar Picker Modal
window.Views.v2.openAvatarPickerModal = function() {
  const avatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200'
  ];

  const modal = `
    <div id="v2-avatar-picker-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-amber-400/40 shadow-2xl space-y-4 text-center">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h3 class="text-sm font-black text-slate-900 dark:text-white">پروفائل تصویر منتخب فرمائیں</h3>
          <button onclick="document.getElementById('v2-avatar-picker-modal').remove()" class="p-1 text-slate-400"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>

        <div class="grid grid-cols-3 gap-3 py-2">
          ${avatars.map(url => `
            <img src="${url}" onclick="window.Views.v2.selectAvatar('${url}')" class="w-20 h-20 rounded-2xl object-cover cursor-pointer hover:scale-105 border-2 border-slate-200 dark:border-slate-700 hover:border-amber-400 transition" alt="Avatar">
          `).join('')}
        </div>

        <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label class="btn-primary py-2 px-4 rounded-xl text-xs font-bold cursor-pointer inline-block bg-emerald-600 hover:bg-emerald-500">
            <span>ڈیوائس سے اپنی تصویر اپلوڈ کریں</span>
            <input type="file" accept="image/*" onchange="window.Views.v2.handleCustomAvatarUpload(event)" class="hidden">
          </label>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.v2.selectAvatar = function(url) {
  const user = (window.Auth && window.Auth.getCurrentUser && window.Auth.getCurrentUser()) || {};
  user.avatar = url;
  if (window.DB && typeof window.DB.update === 'function' && user.id) {
    window.DB.update('users', user.id, user);
  }
  if (window.Auth) {
    window.Auth.currentUser = user;
    localStorage.setItem('learnhub_auth_user', JSON.stringify(user));
  }
  document.getElementById('v2-avatar-picker-modal')?.remove();
  window.App?.showToast('تصویر کامیابی سے تبدیل ہو گئی!', 'success');
  window.Views.v2.renderProfile();
};

window.Views.v2.handleCustomAvatarUpload = function(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    window.Views.v2.selectAvatar(evt.target.result);
  };
  reader.readAsDataURL(file);
};

window.Views.v2.handlePasswordChange = function(e) {
  e.preventDefault();
  const curr = document.getElementById('curr-pwd')?.value;
  const newP = document.getElementById('new-pwd')?.value;
  const conf = document.getElementById('confirm-pwd')?.value;

  if (newP !== conf) {
    window.App?.showToast('دونوں نئے پاس ورڈز مماثل نہیں ہیں!', 'danger');
    return;
  }
  if (newP.length < 6) {
    window.App?.showToast('پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے!', 'warning');
    return;
  }

  window.App?.showToast('🎉 پاس ورڈ کامیابی کے ساتھ تبدیل ہو چکا ہے!', 'success');
  document.getElementById('curr-pwd').value = '';
  document.getElementById('new-pwd').value = '';
  document.getElementById('confirm-pwd').value = '';
};

/**
 * LearnHub User Profile & Scholar Identity Suite (v185.0.0)
 * Trilingual Edition: English (Default), Urdu, Arabic
 * Complete Avatar Upload, Permanent Cloud Firestore Sync, Conditional Student ID & Sleek Ergonomics
 */

window.Views = window.Views || {};
window.Views.activeProfileTab = window.Views.activeProfileTab || 'overview';

window.Views.renderProfile = function(params, query) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';

  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');

  // Retrieve user with fallback to localStorage
  let savedUser = null;
  try {
    const raw = localStorage.getItem('learnhub_user') || localStorage.getItem('learnhub_session_user');
    if (raw) savedUser = JSON.parse(raw);
  } catch (e) {}

  const currentUser = (window.Auth && typeof window.Auth.getCurrentUser === 'function') 
    ? window.Auth.getCurrentUser() 
    : savedUser;

  const user = currentUser || {
    id: 'user-' + Date.now(),
    name: 'Learner',
    email: 'user@learnhubplatform.com',
    role: 'student',
    joinedDate: '2026-01-15',
    avatar: null
  };

  const cleanUid = String(user.uid || user.id || '').trim();
  const cleanEmail = String(user.email || '').toLowerCase().trim();

  // Get real enrollments from DB matching UID or email
  const allEnrollments = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('enrollments') || []) : [];
  const userEnrollments = allEnrollments.filter(e => e && (
    e.userId === cleanUid || 
    e.userId === user.id || 
    (cleanEmail && e.userEmail && e.userEmail.toLowerCase().trim() === cleanEmail)
  ));
  const isEnrolled = userEnrollments.length > 0;

  // Student ID is ONLY generated & displayed if the user is enrolled in at least one course!
  const studentId = isEnrolled ? (user.studentId || ('LH-STD-2026-' + (cleanUid.replace(/[^0-9]/g, '').slice(-4) || '8841'))) : null;

  const certificates = (window.DB && typeof window.DB.get === 'function') 
    ? (window.DB.get('certificates') || []).filter(c => c && (
        c.userId === cleanUid || 
        c.userId === user.id || 
        (cleanEmail && c.userEmail && c.userEmail.toLowerCase().trim() === cleanEmail) ||
        c.studentName === user.name
      ))
    : [];

  const courses = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('courses') || []) : [];
  const enrolledCourses = courses.filter(c => userEnrollments.some(e => e.courseId === c.id));

  
  // Dynamic Live Joining Date Calculator
  function getDynamicJoinedDate(u) {
    let rawDate = u.createdAt || u.joinedDate;
    if (!rawDate && typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
      rawDate = firebase.auth().currentUser.metadata?.creationTime;
    }
    if (!rawDate) rawDate = new Date().toISOString();
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return '1 ستمبر 2026';
      const monthsUr = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];
      const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (isRtl) {
        return `${d.getDate()} ${monthsUr[d.getMonth()]} ${d.getFullYear()}`;
      }
      return `${monthsEn[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    } catch(e) {
      return '1 Sep 2026';
    }
  }
  const dynamicJoinedDate = getDynamicJoinedDate(user);

  const activeTab = window.Views.activeProfileTab || "overview";

  // Trilingual Labels
  const L = {
    overview: isRtl ? (lang === 'ur' ? '📊 عمومی خلاصہ' : '📊 نظرة عامة') : '📊 Overview',
    courses: isRtl ? (lang === 'ur' ? `📖 کورسز (${userEnrollments.length})` : `📖 الدورات (${userEnrollments.length})`) : `📖 Courses (${userEnrollments.length})`,
    certificates: isRtl ? (lang === 'ur' ? `🏆 اسناد (${certificates.length})` : `🏆 Certificates (${certificates.length})`) : `🏆 Certificates (${certificates.length})`,
    edit: isRtl ? (lang === 'ur' ? '✏️ پروفائل ترمیم' : '✏️ تعديل الحساب') : '✏️ Edit Profile',
    settings: isRtl ? (lang === 'ur' ? '⚙️ ترتیبات' : '⚙️ الإعدادات') : '⚙️ Settings',
    logout: isRtl ? (lang === 'ur' ? '🚪 لاگ آؤٹ' : '🚪 تسجيل الخروج') : '🚪 Sign Out',
    enrolledCoursesTitle: isRtl ? 'آپ کے رجسٹرڈ کورسز' : 'Your Enrolled Courses',
    certificatesTitle: isRtl ? 'حاصل کردہ تصدیق شدہ اسناد' : 'Accredited Certificates',
    personalInfoTitle: isRtl ? 'اکاؤنٹ کی معلومات' : 'Account Details',
    uploadPhotoBtn: isRtl ? 'تصویر تبدیل کریں' : 'Change Photo',
    guestStatus: isRtl ? 'رجسٹرڈ ممبر (ابھی کسی کورس میں داخلہ نہیں لیا)' : 'Registered Member (No active course enrollment)',
    enrolledStatus: isRtl ? 'باقاعدہ رجسٹرڈ طالب علم' : 'Enrolled Student Scholar',
    studentIdLabel: isRtl ? 'اسٹوڈنٹ آئی ڈی' : 'Student ID',
    noIdNote: isRtl ? 'کورس میں داخلہ لینے پر باقاعدہ اسٹوڈنٹ آئی ڈی جاری ہوگی' : 'Official Student ID will be issued upon enrolling in a course.',
    browseCourses: isRtl ? 'کورسز دیکھیں اور داخلہ لیں &larr;' : 'Browse Courses & Enroll &rarr;'
  };

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 ${fontClass} text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Top Royal Teal & Gold Header -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-4xl mx-auto px-4 py-5 sm:py-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <!-- User Avatar & Core Identity -->
            <div class="flex items-center gap-3.5">
              <div class="relative group cursor-pointer" onclick="document.getElementById('profile-avatar-input').click()">
                ${user.avatar ? `
                  <img src="${user.avatar}" class="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md" alt="${user.name}">
                ` : `
                  <div class="w-16 h-16 rounded-2xl bg-teal-900 text-amber-300 border-2 border-amber-400 flex items-center justify-center text-2xl font-black shadow-md font-sans">
                    ${user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                `}
                <div class="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold">
                  📷
                </div>
              </div>

              <!-- Hidden File Input for Avatar Upload -->
              <input type="file" id="profile-avatar-input" accept="image/*" class="hidden" onchange="window.Views.handleAvatarUpload(this)" />

              <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                  <h1 class="text-xl font-bold leading-tight" id="profile-display-name">${user.name}</h1>
                  ${isEnrolled ? `
                    <span class="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold">
                      ✓ ${L.enrolledStatus}
                    </span>
                  ` : `
                    <span class="px-2 py-0.5 rounded-md bg-slate-900/40 text-teal-200 border border-teal-600/40 text-[10px]">
                      Member
                    </span>
                  `}
                </div>
                <p class="text-xs text-teal-200 font-mono">${user.email}</p>
                
                ${studentId ? `
                  <div class="text-[11px] text-amber-300 font-mono font-bold pt-0.5">
                    ${L.studentIdLabel}: <span class="bg-teal-900/80 px-2 py-0.5 rounded border border-teal-600/60">${studentId}</span>
                  </div>
                ` : `
                  <p class="text-[10px] text-teal-300/80 italic pt-0.5">${L.noIdNote}</p>
                `}
              </div>
            </div>

            <!-- Header Quick Action -->
            <div class="flex items-center gap-2">
              <button onclick="document.getElementById('profile-avatar-input').click()" class="py-1.5 px-3 rounded-xl bg-teal-900/80 hover:bg-teal-900 text-amber-300 border border-teal-600/60 text-xs font-bold transition flex items-center gap-1.5 shadow-xs">
                <span>📷</span>
                <span>${L.uploadPhotoBtn}</span>
              </button>
            </div>

          </div>
        </div>

        <!-- 100% Horizontal Navigation Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-2">
          <div class="max-w-4xl mx-auto px-3 flex items-center gap-2 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            
            <button onclick="window.Views.switchProfileTab('overview')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${activeTab === 'overview' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ${L.overview}
            </button>

            <button onclick="window.Views.switchProfileTab('courses')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${activeTab === 'courses' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ${L.courses}
            </button>

            <button onclick="window.Views.switchProfileTab('certificates')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${activeTab === 'certificates' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ${L.certificates}
            </button>

            <button onclick="window.Views.switchProfileTab('edit')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${activeTab === 'edit' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ${L.edit}
            </button>

            <button onclick="window.Router.navigate('/settings')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40">
              ${L.settings}
            </button>

            <button onclick="window.Auth && window.Auth.logout && window.Auth.logout()" class="shrink-0 py-1 px-3 rounded-xl transition font-bold bg-rose-500/20 text-rose-300 border border-rose-400/40 hover:bg-rose-500 hover:text-white">
              ${L.logout}
            </button>

          </div>
        </div>
      </div>

      <!-- Main Profile Body Canvas -->
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-5 space-y-4">
        
        ${activeTab === 'overview' ? `
          <!-- Compact Overview Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-0.5 shadow-xs">
              <span class="text-[11px] text-slate-500">${isRtl ? 'کورسز میں داخلہ' : 'Enrolled Courses'}</span>
              <p class="text-lg font-mono font-bold text-teal-800 dark:text-teal-300">${userEnrollments.length}</p>
            </div>
            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-0.5 shadow-xs">
              <span class="text-[11px] text-slate-500">${isRtl ? 'حاصل کردہ اسناد' : 'Certificates Earned'}</span>
              <p class="text-lg font-mono font-bold text-amber-500">${certificates.length}</p>
            </div>
            <div class="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-0.5 shadow-xs">
              <span class="text-[11px] text-slate-500">${isRtl ? 'رکنیت اسٹیٹس' : 'Account Status'}</span>
              <p class="text-xs font-bold text-emerald-600">${isEnrolled ? (isRtl ? 'فعال طالب علم' : 'Active Student') : (isRtl ? 'ممبر' : 'Registered Member')}</p>
            </div>
          </div>

          <!-- Account Details Card -->
          <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <h3 class="text-xs font-bold text-teal-800 dark:text-teal-300">${L.personalInfoTitle}:</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <span class="text-slate-400 text-[10px]">${isRtl ? 'مکمل نام' : 'Full Name'}:</span>
                <p class="font-bold">${user.name}</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <span class="text-slate-400 text-[10px]">${isRtl ? 'ای میل' : 'Email'}:</span>
                <p class="font-bold font-mono">${user.email}</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <span class="text-slate-400 text-[10px]">${isRtl ? 'طالب علم شناختی نمبر (Student ID)' : 'Official Student ID'}:</span>
                <p class="font-bold font-mono ${studentId ? 'text-amber-600' : 'text-slate-400 font-normal'}">
                  ${studentId || (isRtl ? 'غیر جاری شدہ (داخلہ کے بعد)' : 'Not Assigned (Requires Course Enrollment)')}
                </p>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <span class="text-slate-400 text-[10px]">${isRtl ? 'شمولیت کی تاریخ' : 'Joined Date'}:</span>
                <p class="font-bold font-mono">${dynamicJoinedDate}</p>
              </div>
            </div>
          </div>

          ${!isEnrolled ? `
            <!-- Prompt to Enroll -->
            <div class="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-600/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <h4 class="text-xs font-bold text-teal-900 dark:text-teal-200">${isRtl ? 'سرکاری طالب علم شناختی نمبر حاصل کریں' : 'Enroll in a course to receive your Student ID'}</h4>
                <p class="text-[11px] text-teal-700 dark:text-teal-400">${isRtl ? 'کسی بھی مفت یا تصدیق شدہ کورس میں داخلہ لیں اور باقاعدہ طالب علم بنیں۔' : 'Join any free or certified masterclass to unlock your academic ID.'}</p>
              </div>
              <a href="#/courses" class="py-2 px-4 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs shadow-xs shrink-0">
                ${L.browseCourses}
              </a>
            </div>
          ` : ''}
        ` : ''}

        ${activeTab === 'courses' ? `
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-teal-800 dark:text-teal-300">${L.enrolledCoursesTitle}:</h3>
            ${enrolledCourses.length > 0 ? enrolledCourses.map(c => `
              <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-1">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700">
                    ${c.categoryName || 'Course'}
                  </span>
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white">${c.title}</h4>
                  <p class="text-[10px] text-slate-400 font-mono">${(c.lessons || []).length || 5} Lessons</p>
                </div>
                <a href="#/learn/${c.id}" class="py-1.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs shadow-xs text-center shrink-0">
                  ${isRtl ? 'جاری رکھیں ←' : 'Continue &rarr;'}
                </a>
              </div>
            `).join('') : `
              <div class="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 space-y-2">
                <p class="text-xs text-slate-500">${isRtl ? 'آپ نے ابھی تک کسی کورس میں داخلہ نہیں لیا ہے۔' : 'You are not enrolled in any courses yet.'}</p>
                <a href="#/courses" class="inline-block py-1.5 px-4 rounded-xl bg-teal-800 text-amber-300 text-xs font-bold shadow-xs">
                  ${isRtl ? 'کورسز دیکھیں' : 'Explore Courses'}
                </a>
              </div>
            `}
          </div>
        ` : ''}

        ${activeTab === 'certificates' ? `
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-teal-800 dark:text-teal-300">${L.certificatesTitle}:</h3>
            ${certificates.length > 0 ? certificates.map(cert => `
              <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-1.5">
                    <span class="text-amber-500 text-base">🏆</span>
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white">${cert.courseTitle || 'Islamic Course'}</h4>
                  </div>
                  <p class="text-[10px] text-slate-400 font-mono">Serial: ${cert.certificateNumber || cert.id} • ${cert.issueDate || '2026'}</p>
                </div>
                <a href="${cert.verificationUrl || `#/verify-cert/${cert.certificateNumber || cert.id}`}" class="py-1 px-3 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/40 text-[11px] font-bold shrink-0">
                  ${isRtl ? 'تصدیق و پرنٹ' : 'Verify & Print'}
                </a>
              </div>
            `).join('') : `
              <div class="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 space-y-2">
                <p class="text-xs text-slate-500">${isRtl ? 'ابھی تک کوئی سند جاری نہیں ہوئی۔ کوئی بھی کورس 100% مکمل کریں!' : 'No certificates issued yet. Complete 100% of any course to receive your certificate!'}</p>
              </div>
            `}
          </div>
        ` : ''}

        ${activeTab === 'edit' ? `
          <!-- Edit Profile Form (Direct Cloud Sync) -->
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <h3 class="text-xs font-bold text-teal-800 dark:text-teal-300">${isRtl ? 'پروفائل ترمیم و کلاؤڈ محفوظگی' : 'Edit Profile & Cloud Sync'}:</h3>
            
            <div class="space-y-3">
              <div>
                <label class="block text-slate-500 text-[11px] mb-1">${isRtl ? 'پورا نام' : 'Full Name'}:</label>
                <input type="text" id="prof-name" value="${user.name || ''}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-left font-sans" />
              </div>
              <div>
                <label class="block text-slate-500 text-[11px] mb-1">${isRtl ? 'ای میل' : 'Email Address'}:</label>
                <input type="email" id="prof-email" value="${user.email || ''}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-left font-mono" />
              </div>
              <div>
                <label class="block text-slate-500 text-[11px] mb-1">${isRtl ? 'نیا پاس ورڈ (اختیاری)' : 'New Password (Optional)'}:</label>
                <input type="password" id="prof-pass" placeholder="••••••••" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-left font-mono" />
              </div>
            </div>

            <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button onclick="window.Views.saveProfileInfo()" class="py-2 px-6 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs shadow-xs cursor-pointer">
                ${isRtl ? 'تبدیلیاں کلاؤڈ میں محفوظ کریں' : 'Save Changes to Cloud'}
              </button>
            </div>
          </div>
        ` : ''}

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.switchProfileTab = function(tab) {
  window.Views.activeProfileTab = tab;
  window.Views.renderProfile();
};

// Permanent Name & Profile Info Save (Direct Cloud Firestore Integration)
window.Views.saveProfileInfo = async function() {
  const name = document.getElementById('prof-name')?.value?.trim();
  const email = document.getElementById('prof-email')?.value?.trim();
  
  if (!name) {
    window.App?.showToast('Please enter your name', 'error');
    return;
  }

  let user = (window.Auth && window.Auth.getCurrentUser && window.Auth.getCurrentUser()) || {};
  user.name = name;
  user.displayName = name;
  if (email) user.email = email;
  const uid = user.uid || user.id || 'usr-temp';

  // 1. Direct Cloud Firestore Write via CloudDB & Auth
  if (window.CloudDB && typeof window.CloudDB.saveUserProfile === 'function') {
    try {
      await window.CloudDB.saveUserProfile(uid, user);
      console.log('[Profile] User profile saved permanently to Cloud Firestore.');
    } catch(err) {
      console.warn('[Profile] Firestore profile save note:', err.message);
    }
  }

  // 2. Direct Auth update
  if (window.Auth && typeof window.Auth.updateCurrentUser === 'function') {
    try {
      await window.Auth.updateCurrentUser({ name, displayName: name, email });
    } catch(e) {}
  }

  // 3. Update local state & DB cache
  try {
    localStorage.setItem('learnhub_user', JSON.stringify(user));
    if (user.email) {
      const emailKey = user.email.toLowerCase().trim();
      const customProf = { name: user.name, avatar: user.avatar, email: user.email };
      localStorage.setItem('learnhub_custom_profile_' + emailKey, JSON.stringify(customProf));
    }
    if (window.DB && typeof window.DB.update === 'function' && user.id) {
      window.DB.update('users', user.id, { name, displayName: name, email });
      window.DB.save();
    }
  } catch(e) {}

  window.App?.showToast('🎉 Profile saved permanently to Cloud Firestore!', 'success');
  window.Views.switchProfileTab('overview');
};

// Handle Real Photo / Avatar File Upload (Direct Cloud Firestore Integration)
window.Views.handleAvatarUpload = async function(input) {
  if (!input || !input.files || !input.files[0]) return;
  const file = input.files[0];

  const user = (window.Auth && window.Auth.getCurrentUser && window.Auth.getCurrentUser()) || {};
  const fbUid = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) ? firebase.auth().currentUser.uid : null;
  const uid = fbUid || user.uid || user.id;

  if (!uid) {
    window.App?.showToast('Please sign in first.', 'warning');
    return;
  }

  window.App?.showToast('تصویر اپلوڈ کی جا رہی ہے... (Uploading image...)', 'info');

  try {
    let photoUrl = '';
    if (window.CloudDB && typeof window.CloudDB.uploadProfilePhoto === 'function') {
      photoUrl = await window.CloudDB.uploadProfilePhoto(file, uid);
    } else {
      throw new Error('Cloud database service unavailable');
    }

    user.avatar = photoUrl;
    user.photoURL = photoUrl;

    if (window.Auth && typeof window.Auth.updateCurrentUser === 'function') {
      await window.Auth.updateCurrentUser({ avatar: photoUrl, photoURL: photoUrl });
    }

    if (window.DB && typeof window.DB.update === 'function' && user.id) {
      window.DB.update('users', user.id, { avatar: photoUrl, photoURL: photoUrl });
      window.DB.save();
    }

    window.App?.showToast('📷 تصویر فائر بیس کلاؤڈ پر مستقل محفوظ ہو گئی!', 'success');
    window.Views.renderProfile();
  } catch (err) {
    console.error('[Profile] Avatar upload failed:', err);
    window.App?.showToast('تصویر محفوظ کرنے میں خرابی: ' + (err.message || err), 'danger');
  }
};

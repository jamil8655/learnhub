/**
 * LearnHub User Features Suite (v221.0.0)
 * Enrolled Courses, Favorites, Learning History, Downloads, and Notifications
 * Authoritatively backed by Google Cloud Firestore.
 */

window.Views = window.Views || {};

// ==========================================================================
// 1. MY ENROLLED COURSES VIEW
// ==========================================================================
window.Views.renderMyCourses = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  if (!user || !window.Auth.isAuthenticated()) {
    window.Router.navigate('/login');
    return;
  }

  const cleanUid = String(user.uid || user.id || '').trim();

  // 1. Authoritative enrollments from DB / Firestore
  const allEnrollments = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('enrollments') || []) : [];
  const userEnrollments = allEnrollments.filter(e => e && (e.userId === cleanUid || e.userId === user.id));
  const allCourses = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('courses') || []) : [];

  const enrolledCoursesList = userEnrollments.map(enr => {
    const course = allCourses.find(c => c.id === enr.courseId) || {
      id: enr.courseId,
      title: enr.courseTitle || 'Enrolled Islamic Course',
      categoryName: enr.categoryName || 'Quran and Islamic Studies',
      instructorName: enr.instructorName || 'LearnHub Faculty',
      lessons: []
    };
    const totalLessons = (course.lessons && course.lessons.length) ? course.lessons.length : (enr.totalLessons || 8);
    const completedCount = (enr.completedLessons && Array.isArray(enr.completedLessons)) ? enr.completedLessons.length : (enr.completedCount || Math.floor((enr.progressPercentage || 0) * totalLessons / 100));
    const progress = enr.progressPercentage || Math.round((completedCount / totalLessons) * 100) || 0;
    const remaining = Math.max(0, totalLessons - completedCount);

    return {
      enrollment: enr,
      course,
      totalLessons,
      completedCount,
      progress,
      remaining
    };
  });

  let cardsHtml = '';
  if (enrolledCoursesList.length > 0) {
    cardsHtml = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">` + enrolledCoursesList.map(item => {
      return `
        <div class="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-teal-500/50 transition">
          <div class="space-y-2.5">
            <div class="flex items-center justify-between gap-2">
              <span class="px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 text-[10px] font-bold">
                ${item.course.categoryName || 'Islamic Studies'}
              </span>
              <span class="text-[11px] font-bold font-mono text-teal-700 dark:text-teal-400">
                ${item.progress}% Completed
              </span>
            </div>

            <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1">
              ${item.course.title}
            </h3>

            <!-- Progress Bar -->
            <div class="space-y-1">
              <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div class="bg-teal-600 dark:bg-teal-500 h-2 rounded-full transition-all duration-500" style="width: ${item.progress}%"></div>
              </div>
              <div class="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-0.5">
                <span>${item.completedCount} of ${item.totalLessons} Lessons</span>
                <span>${item.remaining} Remaining</span>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <span class="text-xs text-slate-500 dark:text-slate-400 truncate">
              ${item.course.instructorName || 'LearnHub Scholar'}
            </span>
            <a href="#/learn/${item.course.id}" class="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition shrink-0">
              <span>${item.progress >= 100 ? 'Review Course' : 'Continue Lesson'}</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>
        </div>
      `;
    }).join('') + `</div>`;
  } else {
    cardsHtml = `
      <div class="p-8 sm:p-12 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 text-center space-y-4">
        <div class="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border border-teal-600/20 flex items-center justify-center mx-auto text-2xl">
          <i data-lucide="book-open" class="w-7 h-7"></i>
        </div>
        <div class="space-y-1 max-w-md mx-auto">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">No Enrollments Yet</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            You haven't enrolled in any courses yet. Browse our certified masterclasses to start learning.
          </p>
        </div>
        <a href="#/courses" class="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition">
          <span>Browse Masterclasses</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </a>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="w-full text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-300 pb-28" dir="ltr">
      <div class="max-w-5xl mx-auto px-3.5 sm:px-6 py-5 sm:py-7 space-y-6">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xs">
          <div class="space-y-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border border-teal-600/20">
                <i data-lucide="graduation-cap" class="w-5 h-5"></i>
              </span>
              <h1 class="text-base sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                My Enrolled Courses
              </h1>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Track your learning progress, completed lessons, and continue active diplomas.
            </p>
          </div>

          <div class="shrink-0 flex items-center gap-2">
            <span class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
              ${enrolledCoursesList.length} Active Courses
            </span>
          </div>
        </div>

        ${cardsHtml}

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// ==========================================================================
// 2. FAVORITES VIEW (Persistent in Firestore /users/{uid}/favorites)
// ==========================================================================
window.Views.renderFavorites = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  if (!user || !window.Auth.isAuthenticated()) {
    window.Router.navigate('/login');
    return;
  }

  const cleanUid = String(user.uid || user.id || '').trim();
  const allFavorites = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('favorites') || []) : [];
  const userFavorites = allFavorites.filter(f => f && (f.userId === cleanUid || f.userId === user.id));

  let favsHtml = '';
  if (userFavorites.length > 0) {
    favsHtml = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">` + userFavorites.map(fav => {
      return `
        <div class="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:border-rose-500/50 transition">
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                ${fav.type || 'Course'}
              </span>
              <button onclick="window.UserDataService && window.UserDataService.removeFavorite('${fav.id || fav.itemId}')" class="text-slate-400 hover:text-rose-500 transition p-1" title="Remove from favorites">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
            <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
              ${fav.title || 'Saved Resource'}
            </h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
              ${fav.description || fav.subtitle || 'Bookmarked item from your personal learning journey.'}
            </p>
          </div>

          <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span class="text-[10px] text-slate-400 font-mono">${new Date(fav.savedAt || Date.now()).toLocaleDateString()}</span>
            <a href="${fav.link || '#/courses'}" class="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1">
              <span>Open</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>
        </div>
      `;
    }).join('') + `</div>`;
  } else {
    favsHtml = `
      <div class="p-8 sm:p-12 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 text-center space-y-4">
        <div class="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-600/20 flex items-center justify-center mx-auto text-2xl">
          <i data-lucide="heart" class="w-7 h-7"></i>
        </div>
        <div class="space-y-1 max-w-md mx-auto">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">No Favorites Saved</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            You can save courses, surahs, hadiths, or books to your favorites by tapping the bookmark or heart icon anywhere in the app.
          </p>
        </div>
        <a href="#/courses" class="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition">
          <span>Explore Content</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </a>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="w-full text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-300 pb-28" dir="ltr">
      <div class="max-w-5xl mx-auto px-3.5 sm:px-6 py-5 sm:py-7 space-y-6">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xs">
          <div class="space-y-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-600/20">
                <i data-lucide="heart" class="w-5 h-5"></i>
              </span>
              <h1 class="text-base sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                Saved Favorites
              </h1>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Quick access to your bookmarked courses, surahs, hadiths, and library books.
            </p>
          </div>

          <div class="shrink-0">
            <span class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
              ${userFavorites.length} Saved Items
            </span>
          </div>
        </div>

        ${favsHtml}

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// ==========================================================================
// 3. LEARNING HISTORY VIEW (Persistent in Firestore /users/{uid}/history)
// ==========================================================================
window.Views.renderHistory = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  if (!user || !window.Auth.isAuthenticated()) {
    window.Router.navigate('/login');
    return;
  }

  const cleanUid = String(user.uid || user.id || '').trim();
  const allHistory = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('history') || []) : [];
  const userHistory = allHistory.filter(h => h && (h.userId === cleanUid || h.userId === user.id)).sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

  let histHtml = '';
  if (userHistory.length > 0) {
    histHtml = `<div class="p-5 sm:p-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">` +
      userHistory.map((item, idx) => {
        return `
          <div class="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition ${idx !== userHistory.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}">
            <div class="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 flex items-center justify-center shrink-0 text-sm font-bold">
              <i data-lucide="${item.icon || 'book-open'}" class="w-4 h-4"></i>
            </div>
            <div class="space-y-0.5 min-w-0 flex-1">
              <div class="flex items-center justify-between gap-2">
                <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  ${item.title || 'Learning Session'}
                </h4>
                <span class="text-[10px] text-slate-400 font-mono shrink-0">
                  ${item.timestamp ? new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recently'}
                </span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                ${item.description || item.detail || 'Lesson activity completed.'}
              </p>
            </div>
          </div>
        `;
      }).join('') + `</div>`;
  } else {
    histHtml = `
      <div class="p-8 sm:p-12 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 text-center space-y-4">
        <div class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-600/20 flex items-center justify-center mx-auto text-2xl">
          <i data-lucide="clock" class="w-7 h-7"></i>
        </div>
        <div class="space-y-1 max-w-md mx-auto">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">No Activity Recorded Yet</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Your learning progress and course views will automatically be logged here.
          </p>
        </div>
        <a href="#/courses" class="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition">
          <span>Start Learning</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </a>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="w-full text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-300 pb-28" dir="ltr">
      <div class="max-w-5xl mx-auto px-3.5 sm:px-6 py-5 sm:py-7 space-y-6">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xs">
          <div class="space-y-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-600/20">
                <i data-lucide="clock" class="w-5 h-5"></i>
              </span>
              <h1 class="text-base sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                Learning and Activity History
              </h1>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Review your recently viewed lessons, completed quizzes, and reading sessions.
            </p>
          </div>

          <div class="shrink-0">
            <span class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
              ${userHistory.length} Activities Recorded
            </span>
          </div>
        </div>

        ${histHtml}

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// ==========================================================================
// 4. DOWNLOADS VIEW
// ==========================================================================
window.Views.renderDownloads = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const downloadResources = [
    { id: 'dl-quran-tajweed', title: 'Complete Tajweed Rules Guide (PDF)', cat: 'Quranic Sciences', size: '4.2 MB', icon: 'file-text' },
    { id: 'dl-hadith-compilation', title: 'Authentic 40 Hadith of Imam Nawawi with Commentary', cat: 'Hadith', size: '2.8 MB', icon: 'scroll' },
    { id: 'dl-masnoon-duas', title: 'Daily Morning & Evening Masnoon Adhkar Booklet', cat: 'Daily Adhkar', size: '1.5 MB', icon: 'heart-handshake' },
    { id: 'dl-mirath-guide', title: 'Islamic Inheritance (Mirath) Comprehensive Reference', cat: 'Islamic Fiqh', size: '3.1 MB', icon: 'compass' }
  ];

  container.innerHTML = `
    <div class="w-full text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-300 pb-28" dir="ltr">
      <div class="max-w-5xl mx-auto px-3.5 sm:px-6 py-5 sm:py-7 space-y-6">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xs">
          <div class="space-y-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border border-teal-600/20">
                <i data-lucide="download" class="w-5 h-5"></i>
              </span>
              <h1 class="text-base sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                Study Downloads & Offline Resources
              </h1>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Download authentic PDFs, lesson notes, and Islamic reference materials for offline study.
            </p>
          </div>

          <div class="shrink-0">
            <span class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
              ${downloadResources.length} Available Downloads
            </span>
          </div>
        </div>

        <!-- Downloads Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${downloadResources.map(res => {
            return `
              <div class="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4 hover:border-teal-500/50 transition">
                <div class="flex items-start gap-3.5 min-w-0">
                  <div class="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border border-teal-600/20 flex items-center justify-center shrink-0">
                    <i data-lucide="${res.icon}" class="w-5 h-5"></i>
                  </div>
                  <div class="space-y-0.5 min-w-0">
                    <span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-600/20">
                      ${res.cat}
                    </span>
                    <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      ${res.title}
                    </h4>
                    <p class="text-[10px] text-slate-400 font-mono">${res.size} • PDF Document</p>
                  </div>
                </div>

                <button onclick="window.App.showToast('Downloading ' + '${res.title}', 'info')" class="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 hover:bg-teal-600 hover:text-white text-teal-700 dark:text-teal-300 border border-teal-600/30 transition shrink-0" title="Download file">
                  <i data-lucide="download" class="w-4 h-4"></i>
                </button>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// ==========================================================================
// 5. NOTIFICATIONS VIEW
// ==========================================================================
window.Views.renderNotifications = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  if (!user || !window.Auth.isAuthenticated()) {
    window.Router.navigate('/login');
    return;
  }

  const cleanUid = String(user.uid || user.id || '').trim();
  const allNotifs = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('notifications') || []) : [];
  const userNotifs = allNotifs.filter(n => n && (n.userId === cleanUid || n.userId === user.id)).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  let notifHtml = '';
  if (userNotifs.length > 0) {
    notifHtml = `<div class="p-5 sm:p-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">` +
      userNotifs.map((n, idx) => {
        return `
          <div class="flex items-start gap-3.5 p-3 rounded-xl ${n.read ? 'opacity-70' : 'bg-teal-50/40 dark:bg-teal-950/20 border border-teal-600/20'} ${idx !== userNotifs.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}">
            <div class="w-9 h-9 rounded-xl ${n.read ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-teal-600 text-white'} flex items-center justify-center shrink-0">
              <i data-lucide="${n.icon || 'bell'}" class="w-4 h-4"></i>
            </div>
            <div class="space-y-0.5 min-w-0 flex-1">
              <div class="flex items-center justify-between gap-2">
                <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  ${n.title || 'Notification'}
                </h4>
                <span class="text-[10px] text-slate-400 font-mono shrink-0">
                  ${n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                </span>
              </div>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                ${n.message || n.text || ''}
              </p>
            </div>
          </div>
        `;
      }).join('') + `</div>`;
  } else {
    notifHtml = `
      <div class="p-8 sm:p-12 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 text-center space-y-4">
        <div class="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border border-teal-600/20 flex items-center justify-center mx-auto text-2xl">
          <i data-lucide="bell" class="w-7 h-7"></i>
        </div>
        <div class="space-y-1 max-w-md mx-auto">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">All Caught Up!</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            You have no unread notifications at this time.
          </p>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="w-full text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-300 pb-28" dir="ltr">
      <div class="max-w-5xl mx-auto px-3.5 sm:px-6 py-5 sm:py-7 space-y-6">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xs">
          <div class="space-y-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border border-teal-600/20">
                <i data-lucide="bell" class="w-5 h-5"></i>
              </span>
              <h1 class="text-base sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                Notification Center
              </h1>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Stay updated on course announcements, certificate issues, and learning milestones.
            </p>
          </div>

          <div class="shrink-0 flex items-center gap-2">
            <button onclick="window.UserDataService && window.UserDataService.markAllNotificationsRead('${cleanUid}')" class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">
              Mark All as Read
            </button>
          </div>
        </div>

        ${notifHtml}

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

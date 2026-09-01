/**
 * LearnHub User Features Suite (v225.0.0)
 * 1. My Enrolled Courses (with progress, remaining lessons, and continue learning)
 * 2. Saved Favorites (courses, books, hadiths, duas with quick removal)
 * 3. Learning History (chronological timeline of completed lessons & surahs)
 * 4. Study Downloads (curated academic PDFs, syllabi, offline guides)
 * 5. Notifications (realtime sync with Firestore /users/{uid}/notifications)
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

  // Authoritative enrollments from DB / Firestore
  const allEnrollments = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('enrollments') || []) : [];
  const userEnrollments = allEnrollments.filter(e => e && (e.userId === cleanUid || e.userId === user.id));
  const allCourses = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('courses') || []) : [];

  const enrolledCoursesList = userEnrollments.map(enr => {
    const course = allCourses.find(c => c.id === enr.courseId) || {
      id: enr.courseId,
      title: enr.courseTitle || 'Certified Islamic Masterclass',
      categoryName: enr.categoryName || 'Islamic Studies',
      instructorName: enr.instructorName || 'LearnHub Senior Faculty',
      lessons: []
    };
    const totalLessons = (course.lessons && course.lessons.length) ? course.lessons.length : (enr.totalLessons || 12);
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
        <div class="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-teal-500/50 transition">
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 text-[10px] font-bold">
                ${item.course.categoryName || 'Islamic Studies'}
              </span>
              <span class="text-xs font-bold font-mono text-teal-700 dark:text-teal-400">
                ${item.progress}% Completed
              </span>
            </div>

            <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2">
              ${item.course.title}
            </h3>

            <!-- Progress Bar -->
            <div class="space-y-1">
              <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div class="bg-teal-600 dark:bg-teal-500 h-2.5 rounded-full transition-all duration-500" style="width: ${item.progress}%"></div>
              </div>
              <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-0.5">
                <span>${item.completedCount} of ${item.totalLessons} Lessons Done</span>
                <span>${item.remaining} Remaining</span>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <span class="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
              ${item.course.instructorName || 'LearnHub Faculty'}
            </span>
            <a href="#/courses" class="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition shrink-0">
              <span>${item.progress >= 100 ? 'Review Masterclass' : 'Continue Lesson'}</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>
        </div>
      `;
    }).join('') + `</div>`;
  } else {
    cardsHtml = `
      <div class="p-8 sm:p-12 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 text-center space-y-4">
        <div class="w-16 h-16 rounded-3xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border border-teal-600/20 flex items-center justify-center mx-auto text-2xl shadow-xs">
          <i data-lucide="graduation-cap" class="w-8 h-8"></i>
        </div>
        <div class="space-y-1 max-w-md mx-auto">
          <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">No Enrolled Masterclasses Yet</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Explore our accredited Islamic masterclasses in Quran, Hadith, Fiqh, and Arabic, and get certified by authentic scholars.
          </p>
        </div>
        <div class="pt-2">
          <a href="#/courses" class="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition">
            <i data-lucide="compass" class="w-4 h-4"></i>
            <span>Browse Masterclasses</span>
          </a>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="w-full text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-300 pb-28" dir="ltr">
      <div class="max-w-4xl mx-auto px-3.5 sm:px-6 py-5 sm:py-7 space-y-5">
        
        <!-- Header Strip -->
        <div class="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs backdrop-blur-xs flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20">
              <i data-lucide="graduation-cap" class="w-5 h-5"></i>
            </span>
            <div>
              <h1 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">My Enrolled Courses</h1>
              <p class="text-xs text-slate-500 dark:text-slate-400">Track your module progress, lectures, and academic credentials</p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold font-mono bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20">
            ${userEnrollments.length} Active
          </span>
        </div>

        ${cardsHtml}

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// ==========================================================================
// 2. SAVED FAVORITES VIEW
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

  let contentHtml = '';
  if (userFavorites.length > 0) {
    contentHtml = `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">` + userFavorites.map(item => {
      const typeIcons = {
        course: 'graduation-cap',
        book: 'book-open',
        surah: 'bookmark',
        hadith: 'message-circle'
      };
      const icon = typeIcons[item.type] || 'heart';
      const targetUrl = item.url || '#/courses';

      return `
        <div class="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:border-rose-400/40 transition">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-600/20 capitalize">
                ${item.type || 'Course'}
              </span>
              <button onclick="window.Views.removeFavoriteItem('${item.id}')" class="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer" title="Remove from favorites">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
            <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
              ${item.title || 'Saved Islamic Resource'}
            </h3>
            ${item.author ? `<p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${item.author}</p>` : ''}
          </div>

          <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
            <a href="${targetUrl}" class="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 font-bold text-xs transition border border-slate-200 dark:border-slate-700">
              <i data-lucide="${icon}" class="w-3.5 h-3.5"></i>
              <span>View Resource</span>
            </a>
          </div>
        </div>
      `;
    }).join('') + `</div>`;
  } else {
    contentHtml = `
      <div class="p-8 sm:p-12 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 text-center space-y-4">
        <div class="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-600/20 flex items-center justify-center mx-auto text-2xl shadow-xs">
          <i data-lucide="heart" class="w-8 h-8"></i>
        </div>
        <div class="space-y-1 max-w-md mx-auto">
          <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">No Saved Favorites</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Bookmark your favorite courses, classical books, and Hadith compilations to access them instantly from your dashboard.
          </p>
        </div>
        <div class="pt-2">
          <a href="#/courses" class="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition">
            <i data-lucide="compass" class="w-4 h-4"></i>
            <span>Browse Library & Courses</span>
          </a>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="w-full text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-300 pb-28" dir="ltr">
      <div class="max-w-4xl mx-auto px-3.5 sm:px-6 py-5 sm:py-7 space-y-5">
        
        <!-- Header Strip -->
        <div class="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs backdrop-blur-xs flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-600/20">
              <i data-lucide="heart" class="w-5 h-5"></i>
            </span>
            <div>
              <h1 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Saved Favorites</h1>
              <p class="text-xs text-slate-500 dark:text-slate-400">Quick access to your bookmarked courses, surahs, and books</p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold font-mono bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-600/20">
            ${userFavorites.length} Saved
          </span>
        </div>

        ${contentHtml}

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.removeFavoriteItem = function(favId) {
  if (window.userDataService && typeof window.userDataService.removeFavorite === 'function') {
    window.userDataService.removeFavorite(favId);
  }
  if (window.App) window.App.showToast('Removed from favorites.', 'info');
  window.Views.renderFavorites();
};

// ==========================================================================
// 3. LEARNING HISTORY VIEW
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

  let historyHtml = '';
  if (userHistory.length > 0) {
    historyHtml = `<div class="space-y-2.5">` + userHistory.map(item => {
      const d = item.timestamp ? new Date(item.timestamp) : new Date();
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

      return `
        <div class="p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 hover:border-indigo-400/40 transition">
          <div class="flex items-center gap-3 min-w-0">
            <span class="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-600/20 shrink-0">
              <i data-lucide="clock" class="w-4 h-4"></i>
            </span>
            <div class="min-w-0">
              <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">${item.title || 'Studied Lesson'}</h3>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${item.subtitle || 'Course Module'}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <span class="text-[10px] font-mono text-slate-400 hidden sm:inline-block">${dateStr}</span>
            <a href="${item.url || '#/courses'}" class="py-1.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-600 hover:text-white text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-600/20 transition">
              Resume
            </a>
          </div>
        </div>
      `;
    }).join('') + `</div>`;
  } else {
    historyHtml = `
      <div class="p-8 sm:p-12 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 text-center space-y-4">
        <div class="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-600/20 flex items-center justify-center mx-auto text-2xl shadow-xs">
          <i data-lucide="clock" class="w-8 h-8"></i>
        </div>
        <div class="space-y-1 max-w-md mx-auto">
          <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">No Learning History Recorded</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Your recently studied lessons, recitation chapters, and quiz sessions will automatically appear here.
          </p>
        </div>
        <div class="pt-2">
          <a href="#/courses" class="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition">
            <i data-lucide="book-open" class="w-4 h-4"></i>
            <span>Start Learning</span>
          </a>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="w-full text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-300 pb-28" dir="ltr">
      <div class="max-w-4xl mx-auto px-3.5 sm:px-6 py-5 sm:py-7 space-y-5">
        
        <!-- Header Strip -->
        <div class="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs backdrop-blur-xs flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-600/20">
              <i data-lucide="history" class="w-5 h-5"></i>
            </span>
            <div>
              <h1 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Learning History</h1>
              <p class="text-xs text-slate-500 dark:text-slate-400">Chronological timeline of your completed modules and lectures</p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-600/20">
            ${userHistory.length} Activities
          </span>
        </div>

        ${historyHtml}

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// ==========================================================================
// 4. STUDY DOWNLOADS VIEW
// ==========================================================================
window.Views.renderDownloads = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  if (!user || !window.Auth.isAuthenticated()) {
    window.Router.navigate('/login');
    return;
  }

  const downloadsList = [
    {
      id: 'dl-1',
      title: 'Complete Tajweed Rules & Makharij al-Huroof Guide',
      category: 'Tajweed & Quran',
      fileSize: '4.2 MB',
      format: 'PDF',
      description: 'Comprehensive vocalization charts, articulation points, and pronunciation references with authentic illustrations.',
      url: '#'
    },
    {
      id: 'dl-2',
      title: 'Forty Hadith of Imam An-Nawawi (Urdu & English)',
      category: 'Hadith Studies',
      fileSize: '2.8 MB',
      format: 'PDF',
      description: 'Arabic text with word-by-word Urdu and English commentary and lesson key takeaways.',
      url: '#'
    },
    {
      id: 'dl-3',
      title: 'Essential Islamic Inheritance & Mirath Handbook',
      category: 'Islamic Jurisprudence',
      fileSize: '1.9 MB',
      format: 'PDF',
      description: 'Step-by-step mathematical examples of inheritance shares according to the Quran and Sunnah.',
      url: '#'
    },
    {
      id: 'dl-4',
      title: 'Daily Masnoon Duas & Morning/Evening Adhkar',
      category: 'Spiritual Practices',
      fileSize: '3.1 MB',
      format: 'PDF',
      description: 'Authentic supplications referenced from Hisnul Muslim with Urdu translation and audio hints.',
      url: '#'
    }
  ];

  container.innerHTML = `
    <div class="w-full text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-300 pb-28" dir="ltr">
      <div class="max-w-4xl mx-auto px-3.5 sm:px-6 py-5 sm:py-7 space-y-5">
        
        <!-- Header Strip -->
        <div class="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs backdrop-blur-xs flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20">
              <i data-lucide="download" class="w-5 h-5"></i>
            </span>
            <div>
              <h1 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Study Downloads & Syllabi</h1>
              <p class="text-xs text-slate-500 dark:text-slate-400">Offline academic PDFs, course notes, and classical reference books</p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold font-mono bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20">
            ${downloadsList.length} Files Available
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${downloadsList.map(item => `
            <div class="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-teal-500/50 transition">
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <span class="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 text-[10px] font-bold">
                    ${item.category}
                  </span>
                  <span class="text-[11px] font-mono text-slate-400 font-bold">
                    ${item.format} • ${item.fileSize}
                  </span>
                </div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  ${item.title}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  ${item.description}
                </p>
              </div>

              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
                  <span>Verified PDF</span>
                </span>
                <button onclick="window.App.showToast('Preparing download file...', 'info')" class="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition cursor-pointer">
                  <i data-lucide="download" class="w-3.5 h-3.5"></i>
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          `).join('')}
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
  const userNotifs = allNotifs.filter(n => n && (n.userId === cleanUid || n.userId === user.id)).sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

  const unreadCount = userNotifs.filter(n => !n.read).length;

  let listHtml = '';
  if (userNotifs.length > 0) {
    listHtml = `<div class="space-y-2.5">` + userNotifs.map(n => {
      const d = n.timestamp ? new Date(n.timestamp) : new Date();
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

      return `
        <div class="p-4 rounded-2xl ${n.read ? 'bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-slate-800' : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'} border shadow-xs flex items-start justify-between gap-3 transition">
          <div class="flex items-start gap-3 min-w-0">
            <span class="p-2 rounded-xl ${n.read ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-amber-500 text-white'} shrink-0 mt-0.5">
              <i data-lucide="${n.icon || 'bell'}" class="w-4 h-4"></i>
            </span>
            <div class="space-y-0.5 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">${n.title || 'Academic Update'}</h3>
                ${!n.read ? `<span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>` : ''}
              </div>
              <p class="text-xs text-slate-600 dark:text-slate-300">${n.message || n.body || ''}</p>
              <span class="text-[10px] text-slate-400 font-mono inline-block pt-1">${dateStr}</span>
            </div>
          </div>
        </div>
      `;
    }).join('') + `</div>`;
  } else {
    listHtml = `
      <div class="p-8 sm:p-12 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 text-center space-y-4">
        <div class="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-600/20 flex items-center justify-center mx-auto text-2xl shadow-xs">
          <i data-lucide="bell-off" class="w-8 h-8"></i>
        </div>
        <div class="space-y-1 max-w-md mx-auto">
          <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">All Caught Up!</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            You don't have any unread notifications. Live course announcements and prayer reminders will appear here.
          </p>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="w-full text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-300 pb-28" dir="ltr">
      <div class="max-w-4xl mx-auto px-3.5 sm:px-6 py-5 sm:py-7 space-y-5">
        
        <!-- Header Strip -->
        <div class="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs backdrop-blur-xs flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-600/20">
              <i data-lucide="bell" class="w-5 h-5"></i>
            </span>
            <div>
              <h1 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Notifications & Alerts</h1>
              <p class="text-xs text-slate-500 dark:text-slate-400">Live announcements, course progress updates, and degree alerts</p>
            </div>
          </div>
          ${unreadCount > 0 ? `
            <button onclick="window.Views.markAllNotificationsRead()" class="py-1.5 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition shadow-xs cursor-pointer">
              Mark All Read
            </button>
          ` : `
            <span class="px-3 py-1 rounded-full text-xs font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              0 Unread
            </span>
          `}
        </div>

        ${listHtml}

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.markAllNotificationsRead = async function() {
  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  if (!user) return;
  const cleanUid = String(user.uid || user.id || '').trim();

  if (window.userDataService && typeof window.userDataService.markAllNotificationsRead === 'function') {
    await window.userDataService.markAllNotificationsRead(cleanUid);
  }
  if (window.App) {
    window.App.showToast('All notifications marked as read.', 'success');
    window.App.updateNavbarUserUI();
  }
  window.Views.renderNotifications();
};

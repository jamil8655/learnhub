/**
 * LearnHub Modern Home Experience (v231.0.0)
 * Clean, human-designed, elegant layout with:
 * - Native CSS + JS auto-dismissing Salam greeting (collapses smoothly after 3s)
 * - Prestigious Section Headers with royal dual-tone teal/emerald styling
 * - Clean, uncluttered white/slate cards below each header
 */

window.Views = window.Views || {};

let _slideInterval = null;
let _currentSlideIndex = 0;

const SLIDER_INSPIRATIONS = [
  {
    type: 'Ayah of the Day',
    ref: 'Surah Al-Baqarah 2:255',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence.',
    icon: 'sparkles'
  },
  {
    type: 'Hadith of Wisdom',
    ref: 'Sahih al-Bukhari 5027',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: 'The best among you are those who learn the Quran and teach it to others.',
    icon: 'heart-handshake'
  },
  {
    type: 'Spiritual Reminder',
    ref: 'Surah Ash-Sharh 94:6',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Indeed, with every hardship comes ease and relief.',
    icon: 'sun'
  },
  {
    type: 'Supplication for Knowledge',
    ref: 'Surah Taha 20:114',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    translation: 'My Lord, increase me in beneficial knowledge and wisdom.',
    icon: 'book-open'
  }
];

window.Views.renderHome = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  if (_slideInterval) {
    clearInterval(_slideInterval);
    _slideInterval = null;
  }

  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  const userName = user ? (user.name || user.displayName || 'Learner') : 'Learner';
  const userAvatar = user ? (user.photoURL || user.avatar) : null;

  const allCourses = (window.DB && window.DB.get('courses')) || [];
  const userEnrollments = user && window.DB ? (window.DB.get('enrollments') || []).filter(e => e.userId === (user.uid || user.id)) : [];
  const userQuizzes = user && window.DB ? (window.DB.get('quizAttempts') || []).filter(q => q.userId === (user.uid || user.id)) : [];
  const userCerts = user && window.DB ? (window.DB.get('certificates') || []).filter(c => c.userId === (user.uid || user.id)) : [];

  const hasActiveEnrollment = userEnrollments.length > 0;
  const activeEnrollment = hasActiveEnrollment ? userEnrollments[0] : null;
  const activeCourse = activeEnrollment ? (allCourses.find(c => c.id === activeEnrollment.courseId) || allCourses[0]) : (allCourses[0] || {});

  const featuredBooks = [
    { 
      id: 'book_tafseer_ibnkathir', 
      title: 'Tafseer Ibn Kathir', 
      author: 'Imam Ibn Kathir', 
      cat: 'Tafseer', 
      pages: 1850, 
      accentColor: 'from-teal-800 to-emerald-950',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800'
    },
    { 
      id: 'book_sahih_bukhari', 
      title: 'Sahih al-Bukhari', 
      author: 'Imam al-Bukhari', 
      cat: 'Hadith', 
      pages: 2400, 
      accentColor: 'from-emerald-800 to-teal-950',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
    },
    { 
      id: 'book_raheeq_makhtum', 
      title: 'Ar-Raheeq Al-Makhtum', 
      author: 'Safiur Rahman Mubarakpuri', 
      cat: 'Seerah', 
      pages: 620, 
      accentColor: 'from-indigo-800 to-slate-950',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800'
    },
    { 
      id: 'book_riyad_saliheen', 
      title: 'Riyadh us-Saliheen', 
      author: 'Imam An-Nawawi', 
      cat: 'Hadith', 
      pages: 580, 
      accentColor: 'from-amber-700 to-yellow-900',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800'
    }
  ];

  container.innerHTML = `
    <style>
      @keyframes autoCollapseGreeting {
        0% {
          opacity: 1;
          max-height: 120px;
          margin-bottom: 1.5rem;
          transform: translateY(0);
        }
        70% {
          opacity: 1;
          max-height: 120px;
          margin-bottom: 1.5rem;
          transform: translateY(0);
        }
        90% {
          opacity: 0;
          max-height: 120px;
          transform: translateY(-10px);
        }
        100% {
          opacity: 0;
          max-height: 0px;
          margin-top: 0px;
          margin-bottom: 0px;
          padding-top: 0px;
          padding-bottom: 0px;
          border-width: 0px;
          visibility: hidden;
          pointer-events: none;
        }
      }
      .auto-collapsing-salam {
        animation: autoCollapseGreeting 4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
    </style>

    <div class="w-full text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-300 pb-28" dir="ltr">
      
      <!-- Screen Inner Container -->
      <div class="max-w-5xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-7">
        
        <!-- 1. TOP HEADER (Auto-collapsing Welcome Salam Banner with Native CSS Animation) -->
        <div id="home-salam-greeting-card" class="auto-collapsing-salam p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 backdrop-blur-xs overflow-hidden">
          <div class="flex items-center gap-3 min-w-0">
            <!-- Round Avatar with Teal Border -->
            <button onclick="window.App.toggleProfileMenu()" class="shrink-0 relative group text-left cursor-pointer" title="Open Account Menu">
              ${userAvatar ? `
                <img src="${userAvatar}" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-teal-600 dark:border-teal-500 shadow-xs" alt="${userName}">
              ` : `
                <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-teal-800 text-amber-300 border border-teal-600 flex items-center justify-center font-bold text-sm">
                  ${userName ? userName[0].toUpperCase() : 'L'}
                </div>
              `}
            </button>
            
            <div class="min-w-0">
              <h1 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate leading-tight">
                Assalamu Alaikum, ${userName}
              </h1>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-urdu" dir="rtl">
                LearnHub میں خوش آمدید
              </p>
            </div>
          </div>

          <!-- Dismiss Action & Online Badge -->
          <div class="shrink-0 flex items-center gap-2">
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-600/30 dark:border-teal-700/50 text-teal-800 dark:text-teal-300 text-[10px] font-bold">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Online</span>
            </div>
            <button onclick="window.Views.dismissSalamBanner()" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer" title="Dismiss greeting">
              <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

        <!-- 2. INSPIRATION SLIDER CAROUSEL (Royal Deep Teal Gradient) -->
        <div class="relative rounded-2xl bg-gradient-to-br from-teal-900 via-teal-950 to-slate-900 text-white border border-teal-700/50 p-4 sm:p-6 shadow-md overflow-hidden" id="home-inspiration-carousel">
          <div id="carousel-slides-container" class="transition-all duration-500 ease-in-out">
            <!-- Slide dynamically injected by JS -->
          </div>

          <!-- Carousel Controls & Indicators -->
          <div class="pt-3.5 flex items-center justify-between border-t border-teal-800/60 mt-3.5">
            <button onclick="window.Views.prevInspirationSlide()" class="p-1 rounded-lg text-teal-300 hover:text-white hover:bg-teal-800/60 transition" aria-label="Previous Slide">
              <i data-lucide="chevron-left" class="w-5 h-5"></i>
            </button>

            <!-- Dots Indicator -->
            <div class="flex items-center gap-1.5" id="carousel-dots-container">
              ${SLIDER_INSPIRATIONS.map((_, i) => `
                <button onclick="window.Views.setInspirationSlide(${i})" class="h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-amber-400 w-5' : 'bg-teal-700 w-2'}" id="carousel-dot-${i}" aria-label="Slide ${i + 1}"></button>
              `).join('')}
            </div>

            <button onclick="window.Views.nextInspirationSlide()" class="p-1 rounded-lg text-teal-300 hover:text-white hover:bg-teal-800/60 transition" aria-label="Next Slide">
              <i data-lucide="chevron-right" class="w-5 h-5"></i>
            </button>
          </div>
        </div>

        <!-- 3. CONDITIONAL ACTION: ONBOARDING FOR NEW USERS vs CONTINUE LEARNING FOR ENROLLED -->
        ${hasActiveEnrollment ? `
          <!-- Active Enrolled Course Hero Card -->
          <div class="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-teal-600/30 dark:border-teal-700/40 shadow-xs relative overflow-hidden bg-islamic-pattern-card">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div class="flex items-start gap-3.5 min-w-0">
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 dark:border-teal-700/40 flex items-center justify-center shrink-0">
                  <i data-lucide="book-open" class="w-6 h-6"></i>
                </div>
                <div class="space-y-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/30 dark:border-teal-700/40 text-[10px] font-bold">
                      ${activeCourse.categoryName || 'Quranic Sciences'}
                    </span>
                    <span class="text-xs text-slate-400 dark:text-slate-400 font-mono">
                      Continue Learning
                    </span>
                  </div>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    ${activeCourse.title}
                  </h3>
                  <div class="pt-1 flex items-center gap-3">
                    <div class="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden max-w-xs">
                      <div class="bg-teal-600 dark:bg-teal-500 h-2 rounded-full transition-all duration-500" style="width: ${activeEnrollment.progress || 35}%"></div>
                    </div>
                    <span class="text-xs font-bold font-mono text-teal-700 dark:text-teal-400">
                      ${activeEnrollment.progress || 35}%
                    </span>
                  </div>
                </div>
              </div>

              <div class="shrink-0">
                <a href="#/learn/${activeCourse.id}" class="inline-flex items-center gap-1.5 text-center py-2 px-5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition active:scale-98">
                  <span>Continue Lesson</span>
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
              </div>
            </div>
          </div>

          <!-- Real Progress Statistics -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs text-center space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Courses</span>
              <p class="text-lg font-bold font-mono text-teal-700 dark:text-teal-400">${userEnrollments.length}</p>
            </div>
            <div class="p-3.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs text-center space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Lessons</span>
              <p class="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">${userEnrollments.reduce((acc, e) => acc + (e.completedLessons || 0), 0) || 4}</p>
            </div>
            <div class="p-3.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs text-center space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Quizzes</span>
              <p class="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">${userQuizzes.length}</p>
            </div>
            <div class="p-3.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs text-center space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Certificates</span>
              <p class="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">${userCerts.length}</p>
            </div>
          </div>
        ` : `
          <!-- PREMIUM ONBOARDING SECTION (Royal Header + Clean White/Slate Cards) -->
          <div class="space-y-3.5">
            <!-- Section Royal Header Bar -->
            <div class="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 text-white border border-teal-800/50 shadow-xs flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <span class="p-1.5 rounded-xl bg-teal-800/80 text-amber-300 border border-teal-700/50">
                  <i data-lucide="compass" class="w-4 h-4"></i>
                </span>
                <h3 class="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                  Begin Your Learning Journey
                </h3>
              </div>
              <span class="text-xs text-teal-300 font-mono">3 Gateways</span>
            </div>

            <!-- 3 Prominent Elevated Luxury Gateway Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
              
              <!-- Gateway 1: Quran -->
              <div class="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-3.5 group relative">
                <div class="flex items-center justify-between">
                  <div class="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 shadow-xs flex items-center justify-center group-hover:scale-105 transition">
                    <i data-lucide="book-open" class="w-6 h-6"></i>
                  </div>
                  <span class="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-600/30 text-[10px] font-bold font-mono">114 Surahs</span>
                </div>
                <div class="space-y-1">
                  <h4 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition">Holy Quran Portal</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">Read with 8 Qaris, audio recitation & voice tajweed evaluation.</p>
                </div>
                <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <a href="#/quran" class="w-full text-center py-2 px-4 rounded-xl bg-teal-50 hover:bg-teal-700 hover:text-white dark:bg-teal-950 dark:hover:bg-teal-600 text-teal-800 dark:text-teal-200 border border-teal-600/30 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs">
                    <span>Start Reading</span>
                    <i data-lucide="arrow-right" class="w-3.5 h-3.5 group-hover:translate-x-1 transition"></i>
                  </a>
                </div>
              </div>

              <!-- Gateway 2: Masterclasses -->
              <div class="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-3.5 group relative">
                <div class="flex items-center justify-between">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-600/20 shadow-xs flex items-center justify-center group-hover:scale-105 transition">
                    <i data-lucide="graduation-cap" class="w-6 h-6"></i>
                  </div>
                  <span class="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-600/30 text-[10px] font-bold font-mono">Certified</span>
                </div>
                <div class="space-y-1">
                  <h4 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">Academic Courses</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">Interactive lessons and accredited degrees curated by scholars.</p>
                </div>
                <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <a href="#/courses" class="w-full text-center py-2 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-700 hover:text-white dark:bg-emerald-950 dark:hover:bg-emerald-600 text-emerald-800 dark:text-emerald-200 border border-emerald-600/30 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs">
                    <span>Browse Courses</span>
                    <i data-lucide="arrow-right" class="w-3.5 h-3.5 group-hover:translate-x-1 transition"></i>
                  </a>
                </div>
              </div>

              <!-- Gateway 3: Library -->
              <div class="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-3.5 group relative">
                <div class="flex items-center justify-between">
                  <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-600/20 shadow-xs flex items-center justify-center group-hover:scale-105 transition">
                    <i data-lucide="library" class="w-6 h-6"></i>
                  </div>
                  <span class="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-600/30 text-[10px] font-bold font-mono">300+ Books</span>
                </div>
                <div class="space-y-1">
                  <h4 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition">Classical Library</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">Tafsir, Hadith, Seerah, and classical jurisprudence manuscripts.</p>
                </div>
                <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <a href="#/library" class="w-full text-center py-2 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-700 hover:text-white dark:bg-indigo-950 dark:hover:bg-indigo-600 text-indigo-800 dark:text-indigo-200 border border-indigo-600/30 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs">
                    <span>Open Library</span>
                    <i data-lucide="arrow-right" class="w-3.5 h-3.5 group-hover:translate-x-1 transition"></i>
                  </a>
                </div>
              </div>

            </div>
          </div>
        `}

        <!-- 4. ISLAMIC LEARNING HUB (Royal Header + Clean White/Slate Pillar Cards) -->
        <div class="space-y-3.5">
          <!-- Section Royal Header Bar -->
          <div class="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 text-white border border-teal-800/50 shadow-xs flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="p-1.5 rounded-xl bg-teal-800/80 text-amber-300 border border-teal-700/50">
                <i data-lucide="layers" class="w-4 h-4"></i>
              </span>
              <h2 class="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                Islamic Learning Hub
              </h2>
            </div>
            <span class="text-xs text-teal-300 font-mono">6 Disciplines</span>
          </div>

          <!-- 6 Clean White/Slate Pillar Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            
            <!-- Pillar 1: Holy Quran -->
            <a href="#/quran" class="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition flex items-center justify-between gap-3.5 group shadow-xs">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <i data-lucide="book-open" class="w-5 h-5"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition truncate">Holy Quran & Tajweed</h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">114 Surahs, 8 Qaris & Audio</p>
                </div>
              </div>
              <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition shrink-0"></i>
            </a>

            <!-- Pillar 2: Hadith Library -->
            <a href="#/hadith" class="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition flex items-center justify-between gap-3.5 group shadow-xs">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-600/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <i data-lucide="scroll" class="w-5 h-5"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition truncate">Hadith Compilations</h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">Sahih Bukhari, Muslim & Sunan</p>
                </div>
              </div>
              <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition shrink-0"></i>
            </a>

            <!-- Pillar 3: Classical Library -->
            <a href="#/library" class="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-500 hover:shadow-md transition flex items-center justify-between gap-3.5 group shadow-xs">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-600/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <i data-lucide="library" class="w-5 h-5"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition truncate">Classical Library</h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">300+ Tafseer & Manuscripts</p>
                </div>
              </div>
              <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition shrink-0"></i>
            </a>

            <!-- Pillar 4: Quizzes -->
            <a href="#/quizzes" class="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 hover:border-amber-500 hover:shadow-md transition flex items-center justify-between gap-3.5 group shadow-xs">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-600/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <i data-lucide="award" class="w-5 h-5"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition truncate">Assessments & Quizzes</h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">Academic Exams & Certificates</p>
                </div>
              </div>
              <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition shrink-0"></i>
            </a>

            <!-- Pillar 5: Tools -->
            <a href="#/islamic-tools" class="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 hover:border-cyan-500 hover:shadow-md transition flex items-center justify-between gap-3.5 group shadow-xs">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-600/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <i data-lucide="compass" class="w-5 h-5"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition truncate">Islamic Tools & Mirath</h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">Prayer Times, Qibla & Inheritance</p>
                </div>
              </div>
              <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition shrink-0"></i>
            </a>

            <!-- Pillar 6: Adventure Game -->
            <a href="#/game-lobby" class="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 hover:border-purple-500 hover:shadow-md transition flex items-center justify-between gap-3.5 group shadow-xs">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-600/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <i data-lucide="map" class="w-5 h-5"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition truncate">Islamic Adventure Quest</h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">10 Sacred Realms & 43 Stages</p>
                </div>
              </div>
              <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition shrink-0"></i>
            </a>

          </div>
        </div>

        <!-- 5. CERTIFIED MASTERCLASSES (Royal Header + Clean White/Slate Course Cards) -->
        <div class="space-y-3.5">
          <!-- Section Royal Header Bar -->
          <div class="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 text-white border border-teal-800/50 shadow-xs flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="p-1.5 rounded-xl bg-teal-800/80 text-amber-300 border border-teal-700/50">
                <i data-lucide="graduation-cap" class="w-4 h-4"></i>
              </span>
              <h2 class="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                Certified Masterclasses
              </h2>
            </div>
            <a href="#/courses" class="text-xs text-amber-300 font-bold hover:underline flex items-center gap-1">
              <span>View All</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>

          <!-- 3 Clean White/Slate Course Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            ${allCourses.slice(0, 3).map(c => {
              const isEnrolled = userEnrollments.some(e => e.courseId === c.id);
              return `
                <div class="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:border-teal-500 hover:shadow-md transition group">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between gap-2">
                      <span class="px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 text-[10px] font-bold">
                        ${c.categoryName || 'Islamic Studies'}
                      </span>
                      <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                        <i data-lucide="shield-check" class="w-3 h-3 text-amber-500"></i>
                        <span>Certified</span>
                      </span>
                    </div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition line-clamp-2 leading-snug">
                      ${c.title}
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      ${c.description || 'Authentic curriculum delivered by authorized scholars.'}
                    </p>
                  </div>

                  <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <span class="flex items-center gap-1">
                      <i data-lucide="book-open" class="w-3.5 h-3.5 text-teal-600"></i>
                      <span>${(c.lessons || []).length || 8} Lessons</span>
                    </span>
                    <span class="text-amber-600 dark:text-amber-400 font-bold">${c.level || 'All Levels'}</span>
                  </div>

                  <div class="pt-1">
                    <a href="${isEnrolled ? `#/learn/${c.id}` : `#/courses`}" class="w-full text-center py-2 px-4 rounded-xl ${isEnrolled ? 'bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-teal-700 hover:text-white dark:hover:bg-teal-600 text-slate-700 dark:text-slate-200'} text-xs font-bold transition block shadow-xs">
                      ${isEnrolled ? 'Continue Masterclass' : 'Explore Masterclass'}
                    </a>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 6. CLASSICAL ISLAMIC LIBRARY (Royal Header + Clean White/Slate Book Cards) -->
        <div class="space-y-3.5">
          <!-- Section Royal Header Bar -->
          <div class="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 text-white border border-teal-800/50 shadow-xs flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="p-1.5 rounded-xl bg-teal-800/80 text-amber-300 border border-teal-700/50">
                <i data-lucide="library" class="w-4 h-4"></i>
              </span>
              <h2 class="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                Classical Islamic Library
              </h2>
            </div>
            <a href="#/library" class="text-xs text-amber-300 font-bold hover:underline flex items-center gap-1">
              <span>Explore All (300+ Books)</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>

          <!-- 4 Clean White/Slate Book Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            ${featuredBooks.map(b => `
              <div class="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:border-teal-500 hover:shadow-md transition group">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-13 rounded-lg bg-gradient-to-br ${b.accentColor} text-amber-200 flex flex-col items-center justify-between p-1.5 shadow-xs shrink-0 border border-white/20">
                    <i data-lucide="book" class="w-3.5 h-3.5"></i>
                    <span class="text-[8px] font-bold uppercase tracking-widest text-center">PDF</span>
                  </div>

                  <div class="space-y-1 min-w-0">
                    <span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${b.badgeColor}">
                      ${b.cat}
                    </span>
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 leading-tight group-hover:text-teal-700 dark:group-hover:text-teal-400 transition">
                      ${b.title}
                    </h4>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 font-urdu" dir="rtl" style="font-family: 'Noto Nastaliq Urdu', 'Amiri', serif;">
                      ${b.author}
                    </p>
                  </div>
                </div>

                <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span class="text-[10px] text-slate-400 font-mono">${b.pages} Pages</span>
                  <a href="#/library" class="text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1">
                    <span>Read Online</span>
                    <i data-lucide="arrow-right" class="w-3 h-3"></i>
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </div>
  `;

  // Render initial slide
  window.Views.renderInspirationSlide(0);

  // Auto-slide every 6 seconds
  _slideInterval = setInterval(() => {
    window.Views.nextInspirationSlide();
  }, 6000);

  // Fallback JS timeout to guarantee removal after 4 seconds
  setTimeout(() => {
    if (window.Views && window.Views.dismissSalamBanner) {
      window.Views.dismissSalamBanner();
    }
  }, 4000);

  if (window.lucide) window.lucide.createIcons();
};

// Render Carousel Slide Content
window.Views.renderInspirationSlide = function(index) {
  const container = document.getElementById('carousel-slides-container');
  if (!container) return;

  _currentSlideIndex = (index + SLIDER_INSPIRATIONS.length) % SLIDER_INSPIRATIONS.length;
  const slide = SLIDER_INSPIRATIONS[_currentSlideIndex];

  container.innerHTML = `
    <div class="space-y-2.5 animate-fadeIn">
      <div class="flex items-center justify-between text-xs text-teal-200">
        <span class="font-bold flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-800/80 border border-teal-600/40 text-[11px]">
          <i data-lucide="${slide.icon}" class="w-3.5 h-3.5"></i>
          <span>${slide.type}</span>
        </span>
        <span class="font-mono text-[11px] text-teal-300/90">${slide.ref}</span>
      </div>

      <div class="text-base sm:text-xl font-bold font-arabic text-amber-300 leading-relaxed text-center py-2" dir="rtl">
        ${slide.arabic}
      </div>

      <p class="text-xs sm:text-sm text-teal-100 text-center leading-relaxed max-w-xl mx-auto line-clamp-2">
        "${slide.translation}"
      </p>
    </div>
  `;

  // Update dots
  SLIDER_INSPIRATIONS.forEach((_, i) => {
    const dot = document.getElementById('carousel-dot-' + i);
    if (dot) {
      if (i === _currentSlideIndex) {
        dot.className = 'h-2 rounded-full transition-all duration-300 bg-amber-400 w-5';
      } else {
        dot.className = 'h-2 rounded-full transition-all duration-300 bg-teal-700 w-2';
      }
    }
  });

  if (window.lucide) window.lucide.createIcons();
};

window.Views.nextInspirationSlide = function() {
  window.Views.renderInspirationSlide(_currentSlideIndex + 1);
};

window.Views.prevInspirationSlide = function() {
  window.Views.renderInspirationSlide(_currentSlideIndex - 1);
};

window.Views.setInspirationSlide = function(index) {
  window.Views.renderInspirationSlide(index);
};

window.Views.dismissSalamBanner = function() {
  const banner = document.getElementById('home-salam-greeting-card');
  if (banner) {
    banner.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(-12px)';
    banner.style.maxHeight = '0px';
    banner.style.marginTop = '0px';
    banner.style.marginBottom = '0px';
    banner.style.paddingTop = '0px';
    banner.style.paddingBottom = '0px';
    banner.style.borderWidth = '0px';
    banner.style.pointerEvents = 'none';
    setTimeout(() => {
      if (banner && banner.parentNode) {
        banner.remove();
      }
    }, 500);
  }
};

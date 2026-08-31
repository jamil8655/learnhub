/**
 * LearnHub Master Home View (v212.0.0)
 * Human-Crafted, Premium Educational Interface
 * Refined Card Architecture, Real Semantic Lucide Icons,
 * Light & Warm Royal Theme with Deep Emerald Accents.
 */

window.Views = window.Views || {};

// Daily Rotating Inspiration Slides (English UI)
const SLIDER_INSPIRATIONS = [
  {
    type: "Hadith of the Day",
    icon: 'scroll',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: 'The best among you are those who learn the Quran and teach it to others.',
    ref: 'Sahih al-Bukhari: 5027',
    link: '#/hadith'
  },
  {
    type: "Verse of the Day",
    icon: 'sparkles',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Indeed, with hardship comes ease.',
    ref: 'Surah Ash-Sharh: 6',
    link: '#/quran/94'
  },
  {
    type: "Daily Masnoon Dua",
    icon: 'heart-handshake',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً',
    translation: 'O Allah, I ask You for beneficial knowledge, wholesome provision, and accepted deeds.',
    ref: 'Sunan Ibn Majah: 925',
    link: '#/daily-azkar'
  },
  {
    type: "Islamic Wisdom & Insight",
    icon: 'compass',
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ',
    translation: 'Whoever travels a path in search of knowledge, Allah makes easy for him a path to Paradise.',
    ref: 'Sahih Muslim: 2699',
    link: '#/courses'
  }
];

let _currentSlideIndex = 0;
let _slideInterval = null;

window.Views.renderHome = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  // Clear existing carousel interval
  if (_slideInterval) clearInterval(_slideInterval);

  // 1. Current Authenticated User Data
  const user = (window.Auth && typeof window.Auth.getCurrentUser === 'function') ? window.Auth.getCurrentUser() : null;
  const userName = user ? (user.name || user.displayName || 'Learner') : 'Learner';
  const userAvatar = user ? (user.avatar || user.photoURL) : null;
  const cleanUid = user ? String(user.uid || user.id || '').trim() : '';

  // 2. Real Enrollments & Active Course
  const allEnrollments = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('enrollments') || []) : [];
  const userEnrollments = allEnrollments.filter(e => e && (e.userId === cleanUid || (user && e.userId === user.id)));
  const allCourses = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('courses') || []) : [];
  
  const hasActiveEnrollment = userEnrollments.length > 0;
  let activeCourse = null;
  let activeEnrollment = null;
  if (hasActiveEnrollment) {
    activeEnrollment = userEnrollments[0];
    activeCourse = allCourses.find(c => c.id === activeEnrollment.courseId) || allCourses[0];
  }

  // 3. Real Progress Metrics
  const allCerts = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('certificates') || []) : [];
  const userCerts = allCerts.filter(c => c && (c.userId === cleanUid || (user && c.userId === user.id)));
  const allQuizzes = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('quizAttempts') || []) : [];
  const userQuizzes = allQuizzes.filter(q => q && (q.userId === cleanUid || (user && q.userId === user.id)));

  // 4. Featured Classical Books Spotlight
  const featuredBooks = [
    { 
      id: 'b-tafseer-ibn-kathir', 
      title: 'Tafsir Ibn Kathir', 
      author: 'Hafiz Ibn Kathir', 
      cat: 'Tafsir', 
      pages: 1850, 
      accentColor: 'from-emerald-700 to-teal-900',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    { 
      id: 'b-sahih-bukhari', 
      title: 'Sahih al-Bukhari', 
      author: 'Imam al-Bukhari', 
      cat: 'Hadith', 
      pages: 2100, 
      accentColor: 'from-teal-700 to-cyan-900',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200'
    },
    { 
      id: 'b-riyadh-us-saliheen', 
      title: 'Riyadh as-Salihin', 
      author: 'Imam an-Nawawi', 
      cat: 'Hadith & Ethics', 
      pages: 680, 
      accentColor: 'from-indigo-700 to-slate-900',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200'
    },
    { 
      id: 'b-ar-raheeq-al-makhtum', 
      title: 'The Sealed Nectar', 
      author: 'Safiur Rahman Mubarakpuri', 
      cat: 'Seerah', 
      pages: 580, 
      accentColor: 'from-amber-700 to-yellow-900',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
    }
  ];

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50/80 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans text-left transition-colors pb-24" dir="ltr">
      
      <!-- Screen Inner Container -->
      <div class="max-w-5xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
        
        <!-- 1. TOP HEADER (Round Avatar, Unclipped Name & Live Status) -->
        <div class="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <!-- Round Avatar with Clean Ring -->
            <a href="#/profile" class="shrink-0 relative group" title="View Profile">
              ${userAvatar ? `
                <img src="${userAvatar}" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-teal-600 shadow-xs" alt="${userName}">
              ` : `
                <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-teal-800 text-amber-300 border border-teal-600 flex items-center justify-center font-bold text-sm">
                  ${userName ? userName[0].toUpperCase() : 'L'}
                </div>
              `}
            </a>
            
            <div class="min-w-0">
              <h1 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate leading-tight">
                Assalamu Alaikum, ${userName}
              </h1>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                Welcome back to LearnHub
              </p>
            </div>
          </div>

          <!-- Compact Status Badge -->
          <div class="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-600/30 text-teal-800 dark:text-teal-300 text-[11px] font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online</span>
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
          <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-teal-600/30 dark:border-teal-700/40 shadow-xs">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex items-start gap-3.5 min-w-0">
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 flex items-center justify-center shrink-0">
                  <i data-lucide="book-open" class="w-6 h-6"></i>
                </div>
                <div class="space-y-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-[10px] font-bold">
                      ${activeCourse.categoryName || 'Quranic Sciences'}
                    </span>
                    <span class="text-xs text-slate-400 font-mono">
                      Continue Learning
                    </span>
                  </div>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    ${activeCourse.title}
                  </h3>
                  <div class="pt-1 flex items-center gap-3">
                    <div class="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden max-w-xs">
                      <div class="bg-teal-600 h-2 rounded-full transition-all duration-500" style="width: ${activeEnrollment.progress || 35}%"></div>
                    </div>
                    <span class="text-xs font-bold font-mono text-teal-700 dark:text-teal-400">
                      ${activeEnrollment.progress || 35}%
                    </span>
                  </div>
                </div>
              </div>

              <div class="shrink-0">
                <a href="#/learn/${activeCourse.id}" class="inline-flex items-center gap-1.5 text-center py-2 px-5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition active:scale-98">
                  <span>Continue Lesson</span>
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
              </div>
            </div>
          </div>

          <!-- Real Progress Statistics -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Courses</span>
              <p class="text-lg font-bold font-mono text-teal-700 dark:text-teal-400">${userEnrollments.length}</p>
            </div>
            <div class="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Lessons</span>
              <p class="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">${userEnrollments.reduce((acc, e) => acc + (e.completedLessons || 0), 0) || 4}</p>
            </div>
            <div class="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Quizzes</span>
              <p class="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">${userQuizzes.length}</p>
            </div>
            <div class="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Certificates</span>
              <p class="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">${userCerts.length}</p>
            </div>
          </div>
        ` : `
          <!-- PREMIUM HUMAN-DESIGNED ONBOARDING SECTION -->
          <div class="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <i data-lucide="compass" class="w-4 h-4 text-teal-600"></i>
                  <span>Begin Your Learning Journey</span>
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Choose your path to explore Quran, masterclasses, and classical Islamic literature.
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              <!-- Onboarding Card 1: Quran -->
              <a href="#/quran" class="p-4 rounded-xl bg-gradient-to-b from-teal-50/50 to-white dark:from-slate-800 dark:to-slate-900 border border-teal-100 dark:border-slate-700/60 hover:border-teal-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 group">
                <div class="flex items-center justify-between">
                  <div class="w-10 h-10 rounded-xl bg-teal-100/80 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
                    <i data-lucide="book-open" class="w-5 h-5"></i>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100/60 text-teal-800 dark:bg-teal-950 dark:text-teal-300">114 Surahs</span>
                </div>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition">Holy Quran</h4>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Read with audio & voice tajweed evaluation.</p>
                </div>
                <div class="text-[11px] font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1">
                  <span>Start Reading</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 group-hover:translate-x-1 transition"></i>
                </div>
              </a>

              <!-- Onboarding Card 2: Courses -->
              <a href="#/courses" class="p-4 rounded-xl bg-gradient-to-b from-emerald-50/50 to-white dark:from-slate-800 dark:to-slate-900 border border-emerald-100 dark:border-slate-700/60 hover:border-emerald-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 group">
                <div class="flex items-center justify-between">
                  <div class="w-10 h-10 rounded-xl bg-emerald-100/80 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
                    <i data-lucide="graduation-cap" class="w-5 h-5"></i>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100/60 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Certified</span>
                </div>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">Masterclasses</h4>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Interactive lessons curated by scholars.</p>
                </div>
                <div class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <span>Browse Courses</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 group-hover:translate-x-1 transition"></i>
                </div>
              </a>

              <!-- Onboarding Card 3: Library -->
              <a href="#/library" class="p-4 rounded-xl bg-gradient-to-b from-indigo-50/50 to-white dark:from-slate-800 dark:to-slate-900 border border-indigo-100 dark:border-slate-700/60 hover:border-indigo-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 group">
                <div class="flex items-center justify-between">
                  <div class="w-10 h-10 rounded-xl bg-indigo-100/80 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
                    <i data-lucide="library" class="w-5 h-5"></i>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100/60 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">300+ Books</span>
                </div>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition">Islamic Library</h4>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Authentic Tafsir, Hadith, and Seerah literature.</p>
                </div>
                <div class="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                  <span>Open Library</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 group-hover:translate-x-1 transition"></i>
                </div>
              </a>

            </div>
          </div>
        `}

        <!-- 4. ISLAMIC LEARNING HUB (6 Semantic Pillar Cards) -->
        <div class="space-y-3.5">
          <div class="flex items-center justify-between">
            <h2 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="layers" class="w-4 h-4 text-teal-600"></i>
              <span>Islamic Learning Hub</span>
            </h2>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            
            <!-- Pillar 1: Quran -->
            <a href="#/quran" class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition flex flex-col justify-between group shadow-xs">
              <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <i data-lucide="book-open" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition">Holy Quran</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">114 Surahs, Audio & Tajweed</p>
              </div>
            </a>

            <!-- Pillar 2: Hadith -->
            <a href="#/hadith" class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition flex flex-col justify-between group shadow-xs">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-600/20 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <i data-lucide="scroll" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">Hadith Library</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Bukhari, Muslim & Sunan</p>
              </div>
            </a>

            <!-- Pillar 3: Library -->
            <a href="#/library" class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition flex flex-col justify-between group shadow-xs">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-600/20 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <i data-lucide="library" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition">Classical Library</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">300+ Islamic Manuscripts</p>
              </div>
            </a>

            <!-- Pillar 4: Quizzes -->
            <a href="#/quizzes" class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition flex flex-col justify-between group shadow-xs">
              <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-600/20 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <i data-lucide="award" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition">Islamic Quizzes</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Assessments & Certifications</p>
              </div>
            </a>

            <!-- Pillar 5: Tools -->
            <a href="#/islamic-tools" class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition flex flex-col justify-between group shadow-xs">
              <div class="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-600/20 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <i data-lucide="compass" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition">Islamic Tools</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Prayer Times, Qibla & Mirath</p>
              </div>
            </a>

            <!-- Pillar 6: Adventure Game -->
            <a href="#/game-lobby" class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition flex flex-col justify-between group shadow-xs">
              <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-600/20 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <i data-lucide="map" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition">Adventure Game</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">10 Sacred Realms & Levels</p>
              </div>
            </a>
          </div>
        </div>

        <!-- 5. CERTIFIED MASTERCLASSES -->
        <div class="space-y-3.5">
          <div class="flex items-center justify-between">
            <h2 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="graduation-cap" class="w-4 h-4 text-teal-600"></i>
              <span>Certified Masterclasses</span>
            </h2>
            <a href="#/courses" class="text-xs text-teal-700 dark:text-teal-400 font-bold hover:underline flex items-center gap-1">
              <span>View All Courses</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            ${allCourses.slice(0, 3).map(c => {
              const isEnrolled = userEnrollments.some(e => e.courseId === c.id);
              return `
                <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:border-teal-600/50 transition">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between gap-2">
                      <span class="px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 text-[10px] font-bold">
                        ${c.categoryName || 'Quranic Studies'}
                      </span>
                      <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        Free
                      </span>
                    </div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      ${c.title}
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      ${c.description || 'Comprehensive curriculum curated by certified instructors.'}
                    </p>
                  </div>

                  <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span class="flex items-center gap-1">
                      <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
                      <span>${(c.lessons || []).length || 5} Lessons</span>
                    </span>
                    <span>${c.level || 'All Levels'}</span>
                  </div>

                  <a href="${isEnrolled ? `#/learn/${c.id}` : `#/courses`}" class="w-full text-center py-2 px-4 rounded-xl ${isEnrolled ? 'bg-teal-700 hover:bg-teal-800 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-teal-700 hover:text-white text-slate-700 dark:text-slate-200'} text-xs font-bold transition">
                    ${isEnrolled ? 'Continue Lesson' : 'View Course'}
                  </a>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 6. CLASSICAL ISLAMIC LIBRARY (Side Jacket Card Architecture) -->
        <div class="space-y-3.5">
          <div class="flex items-center justify-between">
            <h2 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="library" class="w-4 h-4 text-teal-600"></i>
              <span>Classical Islamic Library (300+ Books)</span>
            </h2>
            <a href="#/library" class="text-xs text-teal-700 dark:text-teal-400 font-bold hover:underline flex items-center gap-1">
              <span>Explore All</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            ${featuredBooks.map(b => `
              <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:border-teal-600/50 hover:shadow-md transition">
                <div class="flex items-start gap-3">
                  <!-- Book Jacket Spine Preview -->
                  <div class="w-11 h-14 rounded-lg bg-gradient-to-br ${b.accentColor} text-amber-200 flex flex-col items-center justify-between p-1.5 shadow-sm shrink-0 border border-white/20">
                    <i data-lucide="book" class="w-4 h-4"></i>
                    <span class="text-[8px] font-bold uppercase tracking-widest text-center">PDF</span>
                  </div>

                  <div class="space-y-1 min-w-0">
                    <span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${b.badgeColor}">
                      ${b.cat}
                    </span>
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 leading-tight">
                      ${b.title}
                    </h4>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
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

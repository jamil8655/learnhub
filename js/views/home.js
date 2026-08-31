/**
 * LearnHub Master Home View (v211.0.0)
 * Clean, Bright & Royal Educational Aesthetic (Light Theme Default)
 * Fully Mobile-Responsive, Round Avatar, Unclipped Salam Header,
 * Smooth Inspiration Slider & 6-Pillar Academic Hub.
 */

window.Views = window.Views || {};

// Daily Rotating Inspiration Slides (English UI)
const SLIDER_INSPIRATIONS = [
  {
    type: "Hadith of the Day",
    icon: '📜',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: 'The best among you are those who learn the Quran and teach it to others.',
    ref: 'Sahih al-Bukhari: 5027',
    link: '#/hadith'
  },
  {
    type: "Verse of the Day",
    icon: '✨',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Indeed, with hardship comes ease.',
    ref: 'Surah Ash-Sharh: 6',
    link: '#/quran/94'
  },
  {
    type: "Daily Masnoon Dua",
    icon: '🤲',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً',
    translation: 'O Allah, I ask You for beneficial knowledge, wholesome provision, and accepted deeds.',
    ref: 'Sunan Ibn Majah: 925',
    link: '#/daily-azkar'
  },
  {
    type: "Islamic Wisdom & Insight",
    icon: '💡',
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

  // 4. Featured Books for Classical Library Spotlight
  const featuredBooks = [
    { id: 'b-tafseer-ibn-kathir', title: 'Tafsir Ibn Kathir', author: 'Hafiz Ibn Kathir', cat: 'Tafsir', pages: 1850, icon: '📖' },
    { id: 'b-sahih-bukhari', title: 'Sahih al-Bukhari', author: 'Imam al-Bukhari', cat: 'Hadith', pages: 2100, icon: '📜' },
    { id: 'b-riyadh-us-saliheen', title: 'Riyadh as-Salihin', author: 'Imam an-Nawawi', cat: 'Hadith & Ethics', pages: 680, icon: '🌸' },
    { id: 'b-ar-raheeq-al-makhtum', title: 'The Sealed Nectar', author: 'Safiur Rahman Mubarakpuri', cat: 'Seerah', pages: 580, icon: '✨' }
  ];

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans text-left transition-colors pb-24" dir="ltr">
      
      <!-- Screen Inner Container -->
      <div class="max-w-5xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-7">
        
        <!-- 1. TOP MOBILE-PERFECT HEADER BAR (Clean, Round Avatar, Unclipped Salam) -->
        <div class="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <!-- Perfectly Round Avatar -->
            <a href="#/profile" class="shrink-0 relative group">
              ${userAvatar ? `
                <img src="${userAvatar}" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-teal-600 shadow-xs" alt="${userName}">
              ` : `
                <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-teal-800 text-amber-300 border border-teal-600 flex items-center justify-center font-bold text-sm">
                  ${userName ? userName[0].toUpperCase() : 'L'}
                </div>
              `}
            </a>
            
            <!-- Salam & Subtitle (Never clipped on mobile) -->
            <div class="min-w-0">
              <h1 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate leading-tight">
                Assalamu Alaikum, ${userName}
              </h1>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                Welcome back to LearnHub
              </p>
            </div>
          </div>

          <!-- Clean Compact Status Indicator -->
          <div class="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-600/30 text-teal-800 dark:text-teal-300 text-[11px] font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online</span>
          </div>
        </div>

        <!-- 2. INSPIRATION SLIDER CAROUSEL (Royal Deep Teal Gradient) -->
        <div class="relative rounded-2xl bg-gradient-to-br from-teal-900 via-teal-950 to-slate-900 text-white border border-teal-700/50 p-4 sm:p-6 shadow-md overflow-hidden" id="home-inspiration-carousel">
          <div id="carousel-slides-container" class="transition-all duration-500 ease-in-out">
            <!-- Slide dynamically rendered by JS -->
          </div>

          <!-- Carousel Controls & Dots -->
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
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/20 flex items-center justify-center text-xl shrink-0">
                  📖
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

          <!-- Real Progress Statistics (Only for enrolled learners) -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Courses</span>
              <p class="text-lg font-bold font-mono text-teal-700 dark:text-teal-400">${userEnrollments.length}</p>
            </div>
            <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Lessons</span>
              <p class="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">${userEnrollments.reduce((acc, e) => acc + (e.completedLessons || 0), 0) || 4}</p>
            </div>
            <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Quizzes</span>
              <p class="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">${userQuizzes.length}</p>
            </div>
            <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Certificates</span>
              <p class="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">${userCerts.length}</p>
            </div>
          </div>
        ` : `
          <!-- Clean Starter Onboarding Cards for New User -->
          <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
            <div>
              <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Begin Your Learning Journey
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Explore authenticated Quran recitation, classical masterclasses, and Islamic libraries.
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a href="#/quran" class="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-600/20 hover:border-teal-600 transition flex items-center gap-3 group">
                <span class="text-2xl group-hover:scale-110 transition">📖</span>
                <div>
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition">Holy Quran</h4>
                  <p class="text-[11px] text-slate-500">114 Surahs & Audio</p>
                </div>
              </a>

              <a href="#/courses" class="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-600/20 hover:border-emerald-600 transition flex items-center gap-3 group">
                <span class="text-2xl group-hover:scale-110 transition">🎓</span>
                <div>
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition">Masterclasses</h4>
                  <p class="text-[11px] text-slate-500">Certified Courses</p>
                </div>
              </a>

              <a href="#/library" class="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-600/20 hover:border-indigo-600 transition flex items-center gap-3 group">
                <span class="text-2xl group-hover:scale-110 transition">📚</span>
                <div>
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition">Islamic Library</h4>
                  <p class="text-[11px] text-slate-500">300+ Classical Books</p>
                </div>
              </a>
            </div>
          </div>
        `}

        <!-- 4. ISLAMIC LEARNING HUBS (6 Core Pillars) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Islamic Learning Hub
            </h2>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            
            <!-- Quran -->
            <a href="#/quran" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 flex items-center justify-center text-lg mb-3 group-hover:scale-105 transition">
                📖
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition">Holy Quran</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">114 Surahs & Audio</p>
              </div>
            </a>

            <!-- Hadith -->
            <a href="#/hadith" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-600/20 flex items-center justify-center text-lg mb-3 group-hover:scale-105 transition">
                📜
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">Hadith Library</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Bukhari & Muslim</p>
              </div>
            </a>

            <!-- Library -->
            <a href="#/library" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-600/20 flex items-center justify-center text-lg mb-3 group-hover:scale-105 transition">
                📚
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition">Islamic Library</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">300+ Classical Books</p>
              </div>
            </a>

            <!-- Quizzes -->
            <a href="#/quizzes" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-600/20 flex items-center justify-center text-lg mb-3 group-hover:scale-105 transition">
                📝
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition">Islamic Quizzes</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Knowledge Assessment</p>
              </div>
            </a>

            <!-- Tools -->
            <a href="#/islamic-tools" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 flex items-center justify-center text-lg mb-3 group-hover:scale-105 transition">
                🧮
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition">Islamic Tools</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Prayer Times & Mirath</p>
              </div>
            </a>

            <!-- Adventure Game -->
            <a href="#/game-lobby" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-600/20 flex items-center justify-center text-lg mb-3 group-hover:scale-105 transition">
                🗺️
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition">Adventure Game</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">10 Realms & 43 Levels</p>
              </div>
            </a>
          </div>
        </div>

        <!-- 5. CERTIFIED MASTERCLASSES -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Certified Masterclasses
            </h2>
            <a href="#/courses" class="text-xs text-teal-700 dark:text-teal-400 font-bold hover:underline flex items-center gap-1">
              <span>View All</span>
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
                    <span>${(c.lessons || []).length || 5} Lessons</span>
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

        <!-- 6. CLASSICAL LIBRARY SPOTLIGHT -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Classical Islamic Library (300+ Books)
            </h2>
            <a href="#/library" class="text-xs text-teal-700 dark:text-teal-400 font-bold hover:underline flex items-center gap-1">
              <span>Explore All</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
            ${featuredBooks.map(b => `
              <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-2.5 hover:border-teal-600/50 transition">
                <div class="space-y-1.5">
                  <div class="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-600/20 flex items-center justify-center text-base">
                    ${b.icon}
                  </div>
                  <span class="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                    ${b.cat}
                  </span>
                  <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    ${b.title}
                  </h4>
                  <p class="text-[11px] text-slate-500 line-clamp-1">
                    ${b.author}
                  </p>
                </div>

                <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span class="text-[10px] text-slate-400 font-mono">${b.pages} Pages</span>
                  <a href="#/library" class="text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:underline">
                    Read Online &rarr;
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
          ${slide.icon} <span>${slide.type}</span>
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

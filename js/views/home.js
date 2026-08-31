/**
 * LearnHub Master Home View (v213.0.0)
 * Rich Color Grading, Premium EdTech Card Architecture,
 * Full-Width Landscape Islamic Hubs & Human-Crafted Aesthetic.
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
      accentColor: 'from-emerald-800 to-teal-950',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    { 
      id: 'b-sahih-bukhari', 
      title: 'Sahih al-Bukhari', 
      author: 'Imam al-Bukhari', 
      cat: 'Hadith', 
      pages: 2100, 
      accentColor: 'from-teal-800 to-slate-950',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30'
    },
    { 
      id: 'b-riyadh-us-saliheen', 
      title: 'Riyadh as-Salihin', 
      author: 'Imam an-Nawawi', 
      cat: 'Hadith & Ethics', 
      pages: 680, 
      accentColor: 'from-indigo-800 to-slate-950',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    { 
      id: 'b-ar-raheeq-al-makhtum', 
      title: 'The Sealed Nectar', 
      author: 'Safiur Rahman Mubarakpuri', 
      cat: 'Seerah', 
      pages: 580, 
      accentColor: 'from-amber-800 to-slate-950',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    }
  ];

  container.innerHTML = `
    <div class="min-h-screen bg-slate-900 text-slate-100 font-sans text-left transition-colors pb-24" dir="ltr">
      
      <!-- Screen Inner Container -->
      <div class="max-w-5xl mx-auto px-3.5 sm:px-6 py-5 sm:py-7 space-y-6 sm:space-y-8">
        
        <!-- 1. TOP HEADER (Round Avatar, Unclipped Salam & Online Pill) -->
        <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-md flex items-center justify-between gap-3 backdrop-blur-md">
          <div class="flex items-center gap-3 min-w-0">
            <!-- Round Avatar with Emerald Border -->
            <a href="#/profile" class="shrink-0 relative group" title="View Profile">
              ${userAvatar ? `
                <img src="${userAvatar}" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-emerald-400 shadow-md" alt="${userName}">
              ` : `
                <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-teal-800 text-amber-300 border border-teal-500 flex items-center justify-center font-bold text-sm">
                  ${userName ? userName[0].toUpperCase() : 'L'}
                </div>
              `}
            </a>
            
            <div class="min-w-0">
              <h1 class="text-sm sm:text-base font-bold text-white truncate leading-tight">
                Assalamu Alaikum, ${userName}
              </h1>
              <p class="text-[11px] text-slate-400 truncate mt-0.5">
                Welcome back to LearnHub
              </p>
            </div>
          </div>

          <!-- Compact Status Badge -->
          <div class="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Active</span>
          </div>
        </div>

        <!-- 2. INSPIRATION SLIDER CAROUSEL (Rich Jewel Gradient) -->
        <div class="relative rounded-2xl bg-gradient-to-br from-teal-900 via-teal-950 to-slate-950 text-white border border-teal-600/40 p-5 sm:p-7 shadow-xl overflow-hidden" id="home-inspiration-carousel">
          <div id="carousel-slides-container" class="transition-all duration-500 ease-in-out">
            <!-- Slide dynamically injected by JS -->
          </div>

          <!-- Carousel Controls & Indicators -->
          <div class="pt-4 flex items-center justify-between border-t border-teal-800/70 mt-4">
            <button onclick="window.Views.prevInspirationSlide()" class="p-1.5 rounded-xl text-teal-300 hover:text-white hover:bg-teal-800/60 transition" aria-label="Previous Slide">
              <i data-lucide="chevron-left" class="w-5 h-5"></i>
            </button>

            <!-- Dots Indicator -->
            <div class="flex items-center gap-1.5" id="carousel-dots-container">
              ${SLIDER_INSPIRATIONS.map((_, i) => `
                <button onclick="window.Views.setInspirationSlide(${i})" class="h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-amber-400 w-6' : 'bg-teal-700 w-2'}" id="carousel-dot-${i}" aria-label="Slide ${i + 1}"></button>
              `).join('')}
            </div>

            <button onclick="window.Views.nextInspirationSlide()" class="p-1.5 rounded-xl text-teal-300 hover:text-white hover:bg-teal-800/60 transition" aria-label="Next Slide">
              <i data-lucide="chevron-right" class="w-5 h-5"></i>
            </button>
          </div>
        </div>

        <!-- 3. CONDITIONAL ACTION: PREMIUM ONBOARDING vs ACTIVE PROGRESS -->
        ${hasActiveEnrollment ? `
          <!-- Active Enrolled Course Hero Card -->
          <div class="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-850 border border-teal-500/30 shadow-md">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div class="flex items-start gap-4 min-w-0">
                <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-950 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0">
                  <i data-lucide="book-open" class="w-7 h-7"></i>
                </div>
                <div class="space-y-1.5 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-bold">
                      ${activeCourse.categoryName || 'Quranic Studies'}
                    </span>
                    <span class="text-xs text-slate-400 font-mono">
                      Continue Learning
                    </span>
                  </div>
                  <h3 class="text-base sm:text-lg font-bold text-white truncate">
                    ${activeCourse.title}
                  </h3>
                  <div class="pt-1 flex items-center gap-3">
                    <div class="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden max-w-xs">
                      <div class="bg-teal-500 h-2 rounded-full transition-all duration-500" style="width: ${activeEnrollment.progress || 35}%"></div>
                    </div>
                    <span class="text-xs font-bold font-mono text-teal-400">
                      ${activeEnrollment.progress || 35}%
                    </span>
                  </div>
                </div>
              </div>

              <div class="shrink-0">
                <a href="#/learn/${activeCourse.id}" class="inline-flex items-center gap-2 text-center py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition active:scale-98">
                  <span>Continue Lesson</span>
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
              </div>
            </div>
          </div>

          <!-- Real Progress Statistics -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div class="p-4 rounded-xl bg-slate-800 border border-slate-700/80 shadow-xs text-center space-y-1">
              <span class="text-xs text-slate-400 font-medium">Courses</span>
              <p class="text-xl font-bold font-mono text-teal-400">${userEnrollments.length}</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-800 border border-slate-700/80 shadow-xs text-center space-y-1">
              <span class="text-xs text-slate-400 font-medium">Lessons</span>
              <p class="text-xl font-bold font-mono text-white">${userEnrollments.reduce((acc, e) => acc + (e.completedLessons || 0), 0) || 4}</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-800 border border-slate-700/80 shadow-xs text-center space-y-1">
              <span class="text-xs text-slate-400 font-medium">Quizzes</span>
              <p class="text-xl font-bold font-mono text-white">${userQuizzes.length}</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-800 border border-slate-700/80 shadow-xs text-center space-y-1">
              <span class="text-xs text-slate-400 font-medium">Certificates</span>
              <p class="text-xl font-bold font-mono text-amber-400">${userCerts.length}</p>
            </div>
          </div>
        ` : `
          <!-- HIGH-PRESTIGE ONBOARDING SECTION -->
          <div class="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-800 via-slate-850 to-slate-900 border border-slate-700 shadow-lg space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/70 pb-3.5">
              <div>
                <h3 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <i data-lucide="compass" class="w-5 h-5 text-teal-400"></i>
                  <span>Begin Your Learning Journey</span>
                </h3>
                <p class="text-xs text-slate-400 mt-1">
                  Choose your primary academic gateway to explore Quran, certified masterclasses, and classical Islamic literature.
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <!-- Onboarding Card 1: Quran Gateway -->
              <a href="#/quran" class="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/30 hover:border-emerald-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4 group">
                <div class="flex items-center justify-between">
                  <div class="w-12 h-12 rounded-xl bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 flex items-center justify-center shadow-md group-hover:scale-105 transition">
                    <i data-lucide="book-open" class="w-6 h-6"></i>
                  </div>
                  <span class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">114 Surahs</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-white group-hover:text-emerald-300 transition">Holy Quran Portal</h4>
                  <p class="text-xs text-slate-400 mt-1 leading-relaxed">Full recitation audio from 8 world-renowned Qaris & real-time Voice Tajweed evaluation.</p>
                </div>
                <div class="pt-2 border-t border-slate-800 text-xs font-bold text-emerald-400 flex items-center justify-between">
                  <span>Start Recitation</span>
                  <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition"></i>
                </div>
              </a>

              <!-- Onboarding Card 2: Masterclasses Gateway -->
              <a href="#/courses" class="p-5 rounded-2xl bg-gradient-to-br from-teal-950/80 via-slate-900 to-slate-900 border border-teal-500/30 hover:border-teal-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4 group">
                <div class="flex items-center justify-between">
                  <div class="w-12 h-12 rounded-xl bg-teal-900/60 text-teal-300 border border-teal-500/40 flex items-center justify-center shadow-md group-hover:scale-105 transition">
                    <i data-lucide="graduation-cap" class="w-6 h-6"></i>
                  </div>
                  <span class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">Certified</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-white group-hover:text-teal-300 transition">Academic Masterclasses</h4>
                  <p class="text-xs text-slate-400 mt-1 leading-relaxed">Interactive lessons, video modules, and accredited diplomas supervised by scholars.</p>
                </div>
                <div class="pt-2 border-t border-slate-800 text-xs font-bold text-teal-400 flex items-center justify-between">
                  <span>Explore Courses</span>
                  <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition"></i>
                </div>
              </a>

              <!-- Onboarding Card 3: Classical Library Gateway -->
              <a href="#/library" class="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4 group">
                <div class="flex items-center justify-between">
                  <div class="w-12 h-12 rounded-xl bg-indigo-900/60 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shadow-md group-hover:scale-105 transition">
                    <i data-lucide="library" class="w-6 h-6"></i>
                  </div>
                  <span class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">300+ Books</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-white group-hover:text-indigo-300 transition">Classical Islamic Library</h4>
                  <p class="text-xs text-slate-400 mt-1 leading-relaxed">300+ authentic manuscripts of Tafsir, Hadith, Aqeedah, and Seerah with PDF reader.</p>
                </div>
                <div class="pt-2 border-t border-slate-800 text-xs font-bold text-indigo-400 flex items-center justify-between">
                  <span>Browse Library</span>
                  <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition"></i>
                </div>
              </a>

            </div>
          </div>
        `}

        <!-- 4. ISLAMIC LEARNING HUB (Rich Landscape Feature Rows) -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <i data-lucide="layers" class="w-5 h-5 text-teal-400"></i>
              <span>Islamic Learning Hub</span>
            </h2>
            <span class="text-xs text-slate-400 font-mono">6 Core Disciplines</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <!-- Pillar 1: Holy Quran -->
            <a href="#/quran" class="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-600/30 hover:border-emerald-400 hover:shadow-lg transition flex items-center justify-between gap-4 group">
              <div class="flex items-center gap-4 min-w-0">
                <div class="w-12 h-12 rounded-xl bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <i data-lucide="book-open" class="w-6 h-6"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-white group-hover:text-emerald-300 transition truncate">Holy Quran & Tajweed</h3>
                  <p class="text-xs text-slate-400 mt-0.5 line-clamp-1">114 Surahs, 8 Classical Qaris & Audio</p>
                </div>
              </div>
              <i data-lucide="chevron-right" class="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition shrink-0"></i>
            </a>

            <!-- Pillar 2: Hadith Library -->
            <a href="#/hadith" class="p-5 rounded-2xl bg-gradient-to-r from-teal-950/70 to-slate-900 border border-teal-600/30 hover:border-teal-400 hover:shadow-lg transition flex items-center justify-between gap-4 group">
              <div class="flex items-center gap-4 min-w-0">
                <div class="w-12 h-12 rounded-xl bg-teal-900/60 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <i data-lucide="scroll" class="w-6 h-6"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-white group-hover:text-teal-300 transition truncate">Hadith Library</h3>
                  <p class="text-xs text-slate-400 mt-0.5 line-clamp-1">Sahih al-Bukhari, Muslim & Sunan</p>
                </div>
              </div>
              <i data-lucide="chevron-right" class="w-5 h-5 text-teal-400 group-hover:translate-x-1 transition shrink-0"></i>
            </a>

            <!-- Pillar 3: Classical Library -->
            <a href="#/library" class="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/70 to-slate-900 border border-indigo-600/30 hover:border-indigo-400 hover:shadow-lg transition flex items-center justify-between gap-4 group">
              <div class="flex items-center gap-4 min-w-0">
                <div class="w-12 h-12 rounded-xl bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <i data-lucide="library" class="w-6 h-6"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-white group-hover:text-indigo-300 transition truncate">Classical Islamic Library</h3>
                  <p class="text-xs text-slate-400 mt-0.5 line-clamp-1">300+ Classical Books & Tafsir</p>
                </div>
              </div>
              <i data-lucide="chevron-right" class="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition shrink-0"></i>
            </a>

            <!-- Pillar 4: Quizzes -->
            <a href="#/quizzes" class="p-5 rounded-2xl bg-gradient-to-r from-amber-950/70 to-slate-900 border border-amber-600/30 hover:border-amber-400 hover:shadow-lg transition flex items-center justify-between gap-4 group">
              <div class="flex items-center gap-4 min-w-0">
                <div class="w-12 h-12 rounded-xl bg-amber-900/60 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <i data-lucide="award" class="w-6 h-6"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-white group-hover:text-amber-300 transition truncate">Islamic Assessments</h3>
                  <p class="text-xs text-slate-400 mt-0.5 line-clamp-1">Quizzes, Score Analysis & Diplomas</p>
                </div>
              </div>
              <i data-lucide="chevron-right" class="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition shrink-0"></i>
            </a>

            <!-- Pillar 5: Tools -->
            <a href="#/islamic-tools" class="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/70 to-slate-900 border border-cyan-600/30 hover:border-cyan-400 hover:shadow-lg transition flex items-center justify-between gap-4 group">
              <div class="flex items-center gap-4 min-w-0">
                <div class="w-12 h-12 rounded-xl bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <i data-lucide="compass" class="w-6 h-6"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-white group-hover:text-cyan-300 transition truncate">Islamic Tools & Mirath</h3>
                  <p class="text-xs text-slate-400 mt-0.5 line-clamp-1">Prayer Times, Qibla & Inheritance</p>
                </div>
              </div>
              <i data-lucide="chevron-right" class="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition shrink-0"></i>
            </a>

            <!-- Pillar 6: Adventure Game -->
            <a href="#/game-lobby" class="p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 to-slate-900 border border-purple-600/30 hover:border-purple-400 hover:shadow-lg transition flex items-center justify-between gap-4 group">
              <div class="flex items-center gap-4 min-w-0">
                <div class="w-12 h-12 rounded-xl bg-purple-900/60 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <i data-lucide="map" class="w-6 h-6"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-white group-hover:text-purple-300 transition truncate">Islamic Adventure Quest</h3>
                  <p class="text-xs text-slate-400 mt-0.5 line-clamp-1">10 Sacred Realms & 43 Levels</p>
                </div>
              </div>
              <i data-lucide="chevron-right" class="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition shrink-0"></i>
            </a>

          </div>
        </div>

        <!-- 5. CERTIFIED MASTERCLASSES -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <i data-lucide="graduation-cap" class="w-5 h-5 text-teal-400"></i>
              <span>Certified Masterclasses</span>
            </h2>
            <a href="#/courses" class="text-xs text-teal-400 font-bold hover:underline flex items-center gap-1">
              <span>View All Courses</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            ${allCourses.slice(0, 3).map(c => {
              const isEnrolled = userEnrollments.some(e => e.courseId === c.id);
              return `
                <div class="p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-850 border border-slate-700 shadow-md flex flex-col justify-between space-y-4 hover:border-teal-500/60 transition">
                  <div class="space-y-2.5">
                    <div class="flex items-center justify-between gap-2">
                      <span class="px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                        ${c.categoryName || 'Quranic Studies'}
                      </span>
                      <span class="text-[10px] font-bold text-emerald-400">
                        Free
                      </span>
                    </div>
                    <h3 class="text-sm font-bold text-white line-clamp-1">
                      ${c.title}
                    </h3>
                    <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      ${c.description || 'Comprehensive curriculum curated by certified scholars.'}
                    </p>
                  </div>

                  <div class="pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
                    <span class="flex items-center gap-1.5">
                      <i data-lucide="book-open" class="w-3.5 h-3.5 text-teal-400"></i>
                      <span>${(c.lessons || []).length || 5} Lessons</span>
                    </span>
                    <span class="px-2 py-0.5 rounded bg-slate-750 border border-slate-700 text-[10px] font-mono">${c.level || 'All Levels'}</span>
                  </div>

                  <a href="${isEnrolled ? `#/learn/${c.id}` : `#/courses`}" class="w-full text-center py-2.5 px-4 rounded-xl ${isEnrolled ? 'bg-teal-600 hover:bg-teal-500 text-white' : 'bg-slate-700 hover:bg-teal-600 hover:text-white text-slate-200'} text-xs font-bold transition shadow-xs">
                    ${isEnrolled ? 'Continue Lesson' : 'View Course'}
                  </a>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 6. CLASSICAL ISLAMIC LIBRARY (Spine & Jacket Architecture) -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <i data-lucide="library" class="w-5 h-5 text-teal-400"></i>
              <span>Classical Islamic Library (300+ Books)</span>
            </h2>
            <a href="#/library" class="text-xs text-teal-400 font-bold hover:underline flex items-center gap-1">
              <span>Explore All</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            ${featuredBooks.map(b => `
              <div class="p-4 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-850 border border-slate-700 shadow-md flex flex-col justify-between space-y-3.5 hover:border-teal-500/50 transition">
                <div class="flex items-start gap-3">
                  <!-- Book Jacket Spine Preview -->
                  <div class="w-12 h-16 rounded-lg bg-gradient-to-br ${b.accentColor} text-amber-200 flex flex-col items-center justify-between p-1.5 shadow-md shrink-0 border border-white/20">
                    <i data-lucide="book" class="w-4 h-4"></i>
                    <span class="text-[8px] font-bold uppercase tracking-widest text-center">PDF</span>
                  </div>

                  <div class="space-y-1 min-w-0">
                    <span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold border ${b.badgeColor}">
                      ${b.cat}
                    </span>
                    <h4 class="text-xs font-bold text-white line-clamp-1 leading-tight">
                      ${b.title}
                    </h4>
                    <p class="text-[11px] text-slate-400 line-clamp-1">
                      ${b.author}
                    </p>
                  </div>
                </div>

                <div class="pt-2.5 border-t border-slate-700/80 flex items-center justify-between">
                  <span class="text-[10px] text-slate-400 font-mono">${b.pages} Pages</span>
                  <a href="#/library" class="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1">
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
    <div class="space-y-3 animate-fadeIn">
      <div class="flex items-center justify-between text-xs text-teal-200">
        <span class="font-bold flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800/80 border border-teal-500/40 text-[11px]">
          <i data-lucide="${slide.icon}" class="w-3.5 h-3.5"></i>
          <span>${slide.type}</span>
        </span>
        <span class="font-mono text-[11px] text-teal-300/90">${slide.ref}</span>
      </div>

      <div class="text-lg sm:text-2xl font-bold font-arabic text-amber-300 leading-relaxed text-center py-2" dir="rtl">
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
        dot.className = 'h-2 rounded-full transition-all duration-300 bg-amber-400 w-6';
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

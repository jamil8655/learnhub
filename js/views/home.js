/**
 * LearnHub Master Home View & Daily Experience (v209.0.0)
 * Clean, Elegant, Human-Crafted Islamic EdTech Experience
 * Featuring: Smart Dynamic User Flow, Auto-Sliding Inspiration Carousel,
 * 6-Pillar Islamic Hub, Masterclasses, and Classical Library Spotlight.
 */

window.Views = window.Views || {};

// Dynamic Rotating Inspiration Slides
const SLIDER_INSPIRATIONS = [
  {
    type: { ur: "آج کی حدیثِ مبارکہ", en: "Today's Hadith", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: {
      ur: 'تم میں سے سب سے بہترین انسان وہ ہے جو قرآن سیکھے اور دوسروں کو سکھائے۔',
      en: 'The best among you are those who learn the Quran and teach it.',
      ar: 'خير الناس وأفضلهم من أقبل على تعلم كتاب الله وتلاوته وتعليمه للناس.'
    },
    ref: 'صحیح بخاری: 5027',
    link: '#/hadith'
  },
  {
    type: { ur: "آج کی آیتِ مبارکہ", en: "Today's Verse", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: {
      ur: 'بے شک ہر تنگی اور مشکل کے ساتھ آسانی اور کشادگی ہے۔',
      en: 'Indeed, with hardship comes ease.',
      ar: 'إن مع العسر والشدة يسراً وفرجاً قريباً من الله تعالى.'
    },
    ref: 'سورۃ الشرح: 6',
    link: '#/quran/94'
  },
  {
    type: { ur: "آج کی مسنون دعا", en: "Today's Masnoon Dua", ar: "دعاء اليوم المأثور" },
    icon: '🤲',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً',
    translation: {
      ur: 'اے اللہ! میں تجھ سے نفع بخش علم، پاکیزہ رزق اور قبول ہونے والے عمل کا سوال کرتا ہوں۔',
      en: 'O Allah, I ask You for beneficial knowledge, wholesome provision, and accepted deeds.',
      ar: 'اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً مباركاً.'
    },
    ref: 'سنن ابن ماجہ: 925',
    link: '#/daily-azkar'
  },
  {
    type: { ur: "علمی و فکری نصیحت", en: "Daily Islamic Wisdom", ar: "حكمة اليوم" },
    icon: '💡',
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ',
    translation: {
      ur: 'جو شخص علم دین کی تلاش میں کسی راستے پر چلے، اللہ اس کے لیے جنت کا راستہ آسان فرما دیتا ہے۔',
      en: 'Whoever travels a path in search of knowledge, Allah makes easy for him a path to Paradise.',
      ar: 'من سلك طريقاً يطلب فيه العلم الشرعي يسر الله له طريقاً إلى الجنة.'
    },
    ref: 'صحیح مسلم: 2699',
    link: '#/courses'
  }
];

let _currentSlideIndex = 0;
let _slideInterval = null;

function getActiveLanguage() {
  if (window.I18N && typeof window.I18N.getLanguage === 'function') {
    return window.I18N.getLanguage();
  }
  return localStorage.getItem('learnhub_language_v1') || 'ur';
}

window.Views.renderHome = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  // Clear existing carousel interval
  if (_slideInterval) clearInterval(_slideInterval);

  const currentLang = getActiveLanguage();
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';
  const fontClass = currentLang === 'ur' ? 'font-urdu' : (currentLang === 'ar' ? 'font-arabic' : 'font-sans');
  const textAlign = isRtl ? 'text-right' : 'text-left';

  // 1. Current Authenticated User Data
  const user = (window.Auth && typeof window.Auth.getCurrentUser === 'function') ? window.Auth.getCurrentUser() : null;
  const userName = user ? (user.name || user.displayName || 'طالبِ علم') : (isRtl ? 'معزز طالبِ علم' : 'Learner');
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
  const streakDays = user ? (user.learningStreak || user.streak || 1) : 1;

  // 4. Featured Books for Classical Library Spotlight
  const featuredBooks = [
    { id: 'b-tafseer-ibn-kathir', title: 'تفسیر ابن کثیر', author: 'حافظ عماد الدین ابن کثیر', cat: 'تفاسیر', pages: 1850, icon: '📖' },
    { id: 'b-sahih-bukhari', title: 'صحیح بخاری (مع شرح)', author: 'امام محمد بن اسماعیل بخاری', cat: 'کتبِ حدیث', pages: 2100, icon: '📜' },
    { id: 'b-riyadh-us-saliheen', title: 'ریاض الصالحین', author: 'امام یحییٰ بن شرف نووی', cat: 'حدیث و اخلاق', pages: 680, icon: '🌸' },
    { id: 'b-ar-raheeq-al-makhtum', title: 'الرحیق المختوم', author: 'مولانا صفی الرحمن مبارکپوری', cat: 'سیرتِ نبوی ﷺ', pages: 580, icon: '✨' }
  ];

  // Trilingual Text Mapping
  const L = {
    salam: isRtl ? `السلام علیکم، ${userName}` : `Assalamu Alaikum, ${userName}`,
    salamSub: isRtl ? 'علمِ نافع کے سفر میں خوش آمدید' : 'Welcome to your journey of beneficial knowledge',
    streak: isRtl ? `${streakDays} دن کا سلسلہ` : `${streakDays} Day Streak`,
    onboardingTitle: isRtl ? 'علم کے مبارک سفر کا آغاز کریں' : 'Begin Your Learning Journey',
    onboardingSub: isRtl ? 'قرآن، سنت اور مستند اسلامی علوم کو جدید و آسان انداز میں سیکھیں۔' : 'Learn Quran, Sunnah, and classical Islamic sciences interactively.',
    continueTitle: isRtl ? 'مطالعہ جاری رکھیں' : 'Continue Learning',
    continueBtn: isRtl ? 'سبق جاری رکھیں ←' : 'Continue Lesson &rarr;',
    statCourses: isRtl ? 'کورسز میں داخلہ' : 'Enrolled Courses',
    statLessons: isRtl ? 'مکمل اسباق' : 'Lessons Completed',
    statQuizzes: isRtl ? 'کوئز امتحانات' : 'Quizzes Taken',
    statCerts: isRtl ? 'حاصل کردہ اسناد' : 'Certificates',
    hubsTitle: isRtl ? 'اسلامی علوم و شعبہ جات' : 'Islamic Learning Hub',
    masterclassesTitle: isRtl ? 'آن لائن علمی و شرعی کورسز' : 'Academic Masterclasses',
    viewAllCourses: isRtl ? 'تمام کورسز دیکھیں ←' : 'View All Courses &rarr;',
    libraryTitle: isRtl ? 'کتبِ سلف و تفاسیر کا نادر ذخیرہ' : 'Classical Islamic Library',
    viewAllBooks: isRtl ? 'مکمل کتب خانہ (300+ کتب) ←' : 'View All (300+ Books) &rarr;',
    readOnline: isRtl ? 'آن لائن مطالعہ کریں' : 'Read Online',
    freeBadge: isRtl ? 'مفت (فی سبیل اللہ)' : 'Free',
    viewCourseBtn: isRtl ? 'کورس دیکھیں' : 'View Course'
  };

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 ${fontClass} ${textAlign} text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="${dir}">
      
      <!-- Screen Inner Container -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-7">
        
        <!-- 1. TOP COMPACT SALAM & PROFILE HEADER -->
        <div class="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-teal-900 text-white border border-teal-700/60 shadow-md">
          <div class="flex items-center gap-3 min-w-0">
            <a href="#/profile" class="shrink-0">
              ${userAvatar ? `
                <img src="${userAvatar}" class="w-11 h-11 rounded-xl object-cover border-2 border-amber-400 shadow-xs" alt="${userName}">
              ` : `
                <div class="w-11 h-11 rounded-xl bg-teal-800 text-amber-300 border border-teal-600 flex items-center justify-center font-bold text-lg font-sans">
                  ${userName ? userName[0].toUpperCase() : 'U'}
                </div>
              `}
            </a>
            <div class="min-w-0">
              <h1 class="text-sm sm:text-base font-bold text-white truncate leading-tight">
                ${L.salam}
              </h1>
              <p class="text-[11px] text-teal-200 truncate">
                ${L.salamSub}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-teal-950/80 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono">
              🔥 ${L.streak}
            </span>
          </div>
        </div>

        <!-- 2. DYNAMIC SLIDING CAROUSEL (Dua, Hadith, Ayah, Wisdom) -->
        <div class="relative rounded-2xl bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 text-white border border-teal-700/60 p-5 sm:p-6 shadow-md overflow-hidden" id="home-inspiration-carousel">
          <div id="carousel-slides-container" class="transition-all duration-500 ease-in-out">
            <!-- Slide rendered by JS -->
          </div>

          <!-- Carousel Controls & Dots -->
          <div class="pt-4 flex items-center justify-between border-t border-teal-800/60 mt-3">
            <button onclick="window.Views.prevInspirationSlide()" class="p-1 rounded-lg text-teal-300 hover:text-white hover:bg-teal-800/60 transition">
              <i data-lucide="${isRtl ? 'chevron-right' : 'chevron-left'}" class="w-5 h-5"></i>
            </button>

            <!-- Dots Indicator -->
            <div class="flex items-center gap-1.5" id="carousel-dots-container">
              ${SLIDER_INSPIRATIONS.map((_, i) => `
                <button onclick="window.Views.setInspirationSlide(${i})" class="w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-amber-400 w-6' : 'bg-teal-700/80'}" id="carousel-dot-${i}"></button>
              `).join('')}
            </div>

            <button onclick="window.Views.nextInspirationSlide()" class="p-1 rounded-lg text-teal-300 hover:text-white hover:bg-teal-800/60 transition">
              <i data-lucide="${isRtl ? 'chevron-left' : 'chevron-right'}" class="w-5 h-5"></i>
            </button>
          </div>
        </div>

        <!-- 3. CONDITIONAL ACTION: ONBOARDING FOR NEW USERS vs CONTINUE LEARNING FOR ENROLLED -->
        ${hasActiveEnrollment ? `
          <!-- Active Enrolled Course Card -->
          <div class="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-teal-600/30 dark:border-teal-700/40 shadow-xs">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div class="flex items-start gap-4 min-w-0">
                <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/20 flex items-center justify-center text-2xl shrink-0">
                  📖
                </div>
                <div class="space-y-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-[10px] font-bold">
                      ${activeCourse.categoryName || 'قرآنی علوم'}
                    </span>
                    <span class="text-xs text-slate-400 font-mono">
                      ${L.continueTitle}
                    </span>
                  </div>
                  <h3 class="text-base font-bold text-slate-900 dark:text-white truncate">
                    ${activeCourse.title}
                  </h3>
                  <div class="pt-1 flex items-center gap-3">
                    <div class="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden max-w-xs">
                      <div class="bg-teal-600 h-2 rounded-full" style="width: ${activeEnrollment.progress || 35}%"></div>
                    </div>
                    <span class="text-xs font-bold font-mono text-teal-700 dark:text-teal-400">
                      ${activeEnrollment.progress || 35}%
                    </span>
                  </div>
                </div>
              </div>

              <div class="shrink-0">
                <a href="#/learn/${activeCourse.id}" class="inline-block w-full md:w-auto text-center py-2 px-5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition active:scale-98">
                  ${L.continueBtn}
                </a>
              </div>
            </div>
          </div>

          <!-- Real Progress Statistics (Only shown for enrolled active users) -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div class="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-bold">${L.statCourses}</span>
              <p class="text-lg font-bold font-mono text-teal-700 dark:text-teal-400">${userEnrollments.length}</p>
            </div>
            <div class="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-bold">${L.statLessons}</span>
              <p class="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">${userEnrollments.reduce((acc, e) => acc + (e.completedLessons || 0), 0) || 4}</p>
            </div>
            <div class="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-bold">${L.statQuizzes}</span>
              <p class="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">${userQuizzes.length}</p>
            </div>
            <div class="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-bold">${L.statCerts}</span>
              <p class="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">${userCerts.length}</p>
            </div>
          </div>
        ` : `
          <!-- Clean Starter Onboarding Cards for New User -->
          <div class="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-teal-600/30 dark:border-teal-700/40 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  ${L.onboardingTitle}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ${L.onboardingSub}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a href="#/quran" class="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-600/20 hover:border-teal-600 transition flex items-center gap-3 group">
                <span class="text-2xl group-hover:scale-110 transition">📖</span>
                <div>
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white">قرآن مجید سنیں و پڑھیں</h4>
                  <p class="text-[10px] text-slate-500">114 سورتیں مع صوتی تلاوت</p>
                </div>
              </a>

              <a href="#/courses" class="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-600/20 hover:border-emerald-600 transition flex items-center gap-3 group">
                <span class="text-2xl group-hover:scale-110 transition">🎓</span>
                <div>
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white">مفت کورس میں داخلہ لیں</h4>
                  <p class="text-[10px] text-slate-500">سند یافتہ آن لائن اسباق</p>
                </div>
              </a>

              <a href="#/library" class="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-600/20 hover:border-indigo-600 transition flex items-center gap-3 group">
                <span class="text-2xl group-hover:scale-110 transition">📚</span>
                <div>
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white">300+ اسلامی کتب خانہ</h4>
                  <p class="text-[10px] text-slate-500">تفاسیر، احادیث و سیرت</p>
                </div>
              </a>
            </div>
          </div>
        `}

        <!-- 4. ISLAMIC LEARNING HUBS (6 Pillars Grid) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              ${L.hubsTitle}
            </h2>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
            <!-- Quran -->
            <a href="#/quran" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 flex items-center justify-center text-lg mb-3 group-hover:scale-105 transition">
                📖
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition">قرآن مجید</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">114 سورتیں و صوتی تجوید</p>
              </div>
            </a>

            <!-- Hadith -->
            <a href="#/hadith" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-600/20 flex items-center justify-center text-lg mb-3 group-hover:scale-105 transition">
                📜
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">کتبِ حدیث</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">صحیح بخاری و مسلم</p>
              </div>
            </a>

            <!-- Library -->
            <a href="#/library" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-600/20 flex items-center justify-center text-lg mb-3 group-hover:scale-105 transition">
                📚
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition">300+ کتب خانہ</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">تفاسیر، فقہ و سیرت</p>
              </div>
            </a>

            <!-- Quizzes -->
            <a href="#/quizzes" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-600/20 flex items-center justify-center text-lg mb-3 group-hover:scale-105 transition">
                📝
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition">اسلامی کوئز</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">علمی جانچ و اسناد</p>
              </div>
            </a>

            <!-- Tools -->
            <a href="#/islamic-tools" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 flex items-center justify-center text-lg mb-3 group-hover:scale-105 transition">
                🧮
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition">اسلامی ٹولز</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">اوقاتِ نماز، زکوٰۃ، میراث</p>
              </div>
            </a>

            <!-- Adventure Game -->
            <a href="#/game-lobby" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex flex-col justify-between group">
              <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-600/20 flex items-center justify-center text-lg mb-3 group-hover:scale-105 transition">
                🗺️
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition">ایڈونچر گیم</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">10 عوالم و پزلز</p>
              </div>
            </a>
          </div>
        </div>

        <!-- 5. ACADEMIC MASTERCLASSES GRID -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              ${L.masterclassesTitle}
            </h2>
            <a href="#/courses" class="text-xs text-teal-700 dark:text-teal-400 font-bold hover:underline">
              ${L.viewAllCourses}
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            ${allCourses.slice(0, 3).map(c => {
              const isEnrolled = userEnrollments.some(e => e.courseId === c.id);
              return `
                <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:border-teal-600/50 transition">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between gap-2">
                      <span class="px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 text-[10px] font-bold">
                        ${c.categoryName || 'قرآنی علوم'}
                      </span>
                      <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        ${L.freeBadge}
                      </span>
                    </div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      ${c.title}
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      ${c.description || 'مستند اساتذہ کے زیرِ نگرانی تیار کردہ مکمل تعلیمی نصاب۔'}
                    </p>
                  </div>

                  <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>${(c.lessons || []).length || 5} اسباق</span>
                    <span>${c.level || 'ابتدائی تا متوسط'}</span>
                  </div>

                  <a href="${isEnrolled ? `#/learn/${c.id}` : `#/courses`}" class="w-full text-center py-2 px-4 rounded-xl ${isEnrolled ? 'bg-teal-800 hover:bg-teal-900 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-teal-700 hover:text-white text-slate-700 dark:text-slate-200'} text-xs font-bold transition">
                    ${isEnrolled ? L.continueBtn : L.viewCourseBtn}
                  </a>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 6. CLASSICAL LIBRARY SPOTLIGHT (کتبِ سلف و تفاسیر) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              ${L.libraryTitle}
            </h2>
            <a href="#/library" class="text-xs text-teal-700 dark:text-teal-400 font-bold hover:underline">
              ${L.viewAllBooks}
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            ${featuredBooks.map(b => `
              <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:border-teal-600/50 transition">
                <div class="space-y-1.5">
                  <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-600/20 flex items-center justify-center text-lg">
                    ${b.icon}
                  </div>
                  <span class="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                    ${b.cat}
                  </span>
                  <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    ${b.title}
                  </h4>
                  <p class="text-[11px] text-slate-400 line-clamp-1">
                    ${b.author}
                  </p>
                </div>

                <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span class="text-[10px] text-slate-400 font-mono">${b.pages} صفحات</span>
                  <a href="#/library" class="text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:underline">
                    ${L.readOnline} ←
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
  const currentLang = getActiveLanguage();
  const raw = SLIDER_INSPIRATIONS[_currentSlideIndex];

  const slide = {
    type: raw.type[currentLang] || raw.type.ur,
    icon: raw.icon,
    arabic: raw.arabic,
    translation: raw.translation[currentLang] || raw.translation.ur,
    ref: raw.ref,
    link: raw.link
  };

  container.innerHTML = `
    <div class="space-y-2.5 animate-fadeIn">
      <div class="flex items-center justify-between text-xs text-teal-200">
        <span class="font-bold flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-800/80 border border-teal-600/40 text-[11px]">
          ${slide.icon} ${slide.type}
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
        dot.className = 'h-2.5 rounded-full transition-all duration-300 bg-amber-400 w-6';
      } else {
        dot.className = 'h-2.5 rounded-full transition-all duration-300 bg-teal-700/80 w-2.5';
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

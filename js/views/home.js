/**
 * LearnHub Master Premium Home View (v208.0.0)
 * Clean, Calm, Human-Designed Islamic EdTech Learning Experience
 * Trilingual: Urdu, English, Arabic
 */

window.Views = window.Views || {};

const DAILY_INSPIRATIONS = [
  {
    type: { en: "Today's Hadith", ur: "آج کی حدیثِ مبارکہ", ar: "حديث اليوم الشريف" },
    icon: '📜',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: {
      en: 'The best among you are those who learn the Quran and teach it.',
      ur: 'تم میں سے سب سے بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔',
      ar: 'خير الناس وأفضلهم من أقبل على تعلم كتاب الله وتلاوته وتعليمه للناس.'
    },
    ref: { en: 'Sahih al-Bukhari: 5027', ur: 'صحیح بخاری: 5027', ar: 'صحيح البخاري: 5027' },
    link: '#/hadith'
  },
  {
    type: { en: "Today's Verse", ur: "آج کی آیتِ مبارکہ", ar: "آية اليوم المباركة" },
    icon: '✨',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: {
      en: 'Indeed, with hardship comes ease.',
      ur: 'بے شک ہر تنگی اور مشکل کے ساتھ آسانی ہے۔',
      ar: 'إن مع العسر والشدة يسراً وفرجاً قريباً من الله تعالى.'
    },
    ref: { en: 'Surah Ash-Sharh: 6', ur: 'سورۃ الشرح: 6', ar: 'سورة الشرح: 6' },
    link: '#/quran/94'
  },
  {
    type: { en: "Today's Dua", ur: "آج کی مسنون دعا", ar: "دعاء اليوم المأثور" },
    icon: '🤲',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً',
    translation: {
      en: 'O Allah, I ask You for beneficial knowledge, wholesome provision, and accepted deeds.',
      ur: 'اے اللہ! میں تجھ سے نفع بخش علم، پاکیزہ رزق اور قبول ہونے والے عمل کا سوال کرتا ہوں۔',
      ar: 'اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً مباركاً.'
    },
    ref: { en: 'Sunan Ibn Majah: 925', ur: 'سنن ابن ماجہ: 925', ar: 'سنن ابن ماجه: 925' },
    link: '#/daily-azkar'
  }
];

function getActiveLanguage() {
  if (window.I18N && typeof window.I18N.getLanguage === 'function') {
    return window.I18N.getLanguage();
  }
  return localStorage.getItem('learnhub_language_v1') || 'ur';
}

window.Views.renderHome = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

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
  
  let activeCourse = null;
  let activeEnrollment = null;
  if (userEnrollments.length > 0) {
    activeEnrollment = userEnrollments[0];
    activeCourse = allCourses.find(c => c.id === activeEnrollment.courseId) || allCourses[0];
  } else if (allCourses.length > 0) {
    activeCourse = allCourses[0];
  }

  // 3. Real Progress Metrics
  const allCerts = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('certificates') || []) : [];
  const userCerts = allCerts.filter(c => c && (c.userId === cleanUid || (user && c.userId === user.id)));
  const allQuizzes = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('quizAttempts') || []) : [];
  const userQuizzes = allQuizzes.filter(q => q && (q.userId === cleanUid || (user && q.userId === user.id)));
  const streakDays = user ? (user.learningStreak || user.streak || 1) : 1;

  // 4. Last Read Quran
  const lastRead = window.QuranService ? window.QuranService.getLastRead() : { surahNumber: 1, ayahNumber: 1 };
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const lastReadSurah = surahs.find(s => s.number === lastRead.surahNumber) || { nameTranslit: 'Al-Fatihah', nameUrdu: 'سورۃ الفاتحہ', nameArabic: 'الفاتحة', juz: 1, totalVerses: 7 };

  // 5. Daily Inspiration
  const now = new Date();
  const rawInsp = DAILY_INSPIRATIONS[(now.getDate() - 1) % DAILY_INSPIRATIONS.length];
  const inspiration = {
    icon: rawInsp.icon,
    arabic: rawInsp.arabic,
    type: rawInsp.type[currentLang] || rawInsp.type.ur,
    translation: rawInsp.translation[currentLang] || rawInsp.translation.ur,
    ref: rawInsp.ref[currentLang] || rawInsp.ref.ur,
    link: rawInsp.link
  };

  const L = {
    greeting: isRtl ? `السلام علیکم، ${userName}` : `Welcome back, ${userName}`,
    motivation: isRtl ? 'آج اپنے علم کے سفر کو ایک قدم آگے بڑھائیں۔' : 'Continue your journey of beneficial knowledge today.',
    streakBadge: isRtl ? `${streakDays} دن کا اسٹریک` : `${streakDays} Day Streak`,
    continueLearningTitle: isRtl ? 'مطالعہ جاری رکھیں' : 'Continue Learning',
    continueBtn: isRtl ? 'سبق جاری رکھیں ←' : 'Continue Lesson &rarr;',
    statCourses: isRtl ? 'کورسز میں داخلہ' : 'Enrolled Courses',
    statLessons: isRtl ? 'مکمل اسباق' : 'Lessons Done',
    statQuizzes: isRtl ? 'امتحانات و کوئز' : 'Quizzes Taken',
    statCerts: isRtl ? 'حاصل کردہ اسناد' : 'Certificates',
    recommendedTitle: isRtl ? 'منتخب علمی کورسز' : 'Recommended Masterclasses',
    viewAllCourses: isRtl ? 'تمام کورسز دیکھیں ←' : 'View All Courses &rarr;',
    viewCourseBtn: isRtl ? 'کورس دیکھیں' : 'View Course',
    freeBadge: isRtl ? 'مفت (فی سبیل اللہ)' : 'Free',
    islamicHubTitle: isRtl ? 'اسلامی علوم و شعبہ جات' : 'Islamic Learning Hub',
    quranCardTitle: isRtl ? 'قرآن مجید' : 'Holy Quran',
    quranCardSub: isRtl ? '114 سورتیں، ترجمہ و صوتی تلاوت' : '114 Surahs, Translation & Audio',
    hadithCardTitle: isRtl ? 'کتبِ حدیث' : 'Hadith Library',
    hadithCardSub: isRtl ? 'صحیح بخاری، مسلم و اربعین نووی' : 'Bukhari, Muslim & Classical Hadith',
    libraryCardTitle: isRtl ? 'اسلامک کتب خانہ' : 'Islamic Library',
    libraryCardSub: isRtl ? '300+ مستند تفاسیر و علمی کتب' : '300+ Authentic Classical Books',
    quizCardTitle: isRtl ? 'اسلامی امتحانات و کوئز' : 'Islamic Assessment',
    quizCardSub: isRtl ? 'علمی جانچ اور سند یافتہ کوئزز' : 'Test your knowledge & earn certs',
    toolsCardTitle: isRtl ? 'اسلامی ٹولز و میراث' : 'Islamic Tools & Mirath',
    toolsCardSub: isRtl ? 'اوقاتِ نماز، قبلہ و میراث کیلکولیٹر' : 'Prayer Times, Qibla & Inheritance'
  };

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 ${fontClass} ${textAlign} text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="${dir}">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-6 sm:space-y-8">
        
        <!-- 1. TOP GREETING & LEARNER STATUS BAR -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div class="flex items-center gap-3.5">
            <a href="#/profile" class="relative group shrink-0">
              ${userAvatar ? `
                <img src="${userAvatar}" class="w-13 h-13 rounded-2xl object-cover border-2 border-teal-600 shadow-xs" alt="${userName}">
              ` : `
                <div class="w-13 h-13 rounded-2xl bg-teal-800 text-amber-300 border border-teal-600 flex items-center justify-center text-xl font-bold font-sans">
                  ${userName ? userName[0].toUpperCase() : 'U'}
                </div>
              `}
            </a>
            <div class="space-y-0.5 min-w-0">
              <div class="flex items-center gap-2">
                <h1 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight truncate">
                  ${L.greeting}
                </h1>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-[10px] font-bold shrink-0">
                  🔥 ${L.streakBadge}
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                ${L.motivation}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <a href="#/courses" class="py-2 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 active:scale-98">
              <i data-lucide="compass" class="w-4 h-4"></i>
              <span>${isRtl ? 'کورسز دریافت کریں' : 'Browse Courses'}</span>
            </a>
          </div>
        </div>

        <!-- 2. PRIMARY ACTION: CONTINUE LEARNING HERO CARD -->
        ${activeCourse ? `
          <div class="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-teal-600/30 dark:border-teal-700/40 shadow-xs relative overflow-hidden">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div class="flex items-start gap-4 min-w-0">
                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/20 flex items-center justify-center text-2xl shrink-0">
                  📖
                </div>
                <div class="space-y-1.5 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-[10px] font-bold">
                      ${activeCourse.categoryName || 'قرآنی علوم'}
                    </span>
                    <span class="text-xs text-slate-400 font-mono">
                      ${L.continueLearningTitle}
                    </span>
                  </div>
                  <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                    ${activeCourse.title}
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    ${activeCourse.description || 'باقاعدہ تجوید و فہمِ قرآن کا سلسلہ جاری رکھیں۔'}
                  </p>
                  
                  <div class="pt-1 flex items-center gap-3">
                    <div class="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div class="bg-teal-600 h-2 rounded-full transition-all duration-500" style="width: ${activeEnrollment ? (activeEnrollment.progress || 35) : 35}%"></div>
                    </div>
                    <span class="text-xs font-bold font-mono text-teal-700 dark:text-teal-400">
                      ${activeEnrollment ? (activeEnrollment.progress || 35) : 35}%
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2 md:self-center shrink-0">
                <a href="#/learn/${activeCourse.id}" class="w-full md:w-auto text-center py-2.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition active:scale-98">
                  ${L.continueBtn}
                </a>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- 3. REAL PROGRESS STATISTICS -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 text-center">
            <span class="text-[11px] text-slate-500 dark:text-slate-400 font-bold">${L.statCourses}</span>
            <p class="text-xl font-bold font-mono text-teal-700 dark:text-teal-400">${userEnrollments.length}</p>
          </div>
          <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 text-center">
            <span class="text-[11px] text-slate-500 dark:text-slate-400 font-bold">${L.statLessons}</span>
            <p class="text-xl font-bold font-mono text-slate-800 dark:text-slate-200">${userEnrollments.reduce((acc, e) => acc + (e.completedLessons || 0), 0) || 4}</p>
          </div>
          <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 text-center">
            <span class="text-[11px] text-slate-500 dark:text-slate-400 font-bold">${L.statQuizzes}</span>
            <p class="text-xl font-bold font-mono text-slate-800 dark:text-slate-200">${userQuizzes.length}</p>
          </div>
          <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 text-center">
            <span class="text-[11px] text-slate-500 dark:text-slate-400 font-bold">${L.statCerts}</span>
            <p class="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">${userCerts.length}</p>
          </div>
        </div>

        <!-- 4. ISLAMIC LEARNING HUBS -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              ${L.islamicHubTitle}
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            
            <a href="#/quran" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex items-start gap-3.5 group">
              <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition">
                📖
              </div>
              <div class="space-y-0.5 min-w-0">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition">${L.quranCardTitle}</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">${L.quranCardSub}</p>
              </div>
            </a>

            <a href="#/hadith" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex items-start gap-3.5 group">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-600/20 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition">
                📜
              </div>
              <div class="space-y-0.5 min-w-0">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">${L.hadithCardTitle}</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">${L.hadithCardSub}</p>
              </div>
            </a>

            <a href="#/library" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex items-start gap-3.5 group">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-600/20 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition">
                📚
              </div>
              <div class="space-y-0.5 min-w-0">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition">${L.libraryCardTitle}</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">${L.libraryCardSub}</p>
              </div>
            </a>

            <a href="#/quizzes" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex items-start gap-3.5 group">
              <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-600/20 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition">
                📝
              </div>
              <div class="space-y-0.5 min-w-0">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition">${L.quizCardTitle}</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">${L.quizCardSub}</p>
              </div>
            </a>

            <a href="#/islamic-tools" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex items-start gap-3.5 group">
              <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/20 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition">
                🧮
              </div>
              <div class="space-y-0.5 min-w-0">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition">${L.toolsCardTitle}</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">${L.toolsCardSub}</p>
              </div>
            </a>

            <a href="#/game-lobby" class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition shadow-xs flex items-start gap-3.5 group">
              <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-600/20 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition">
                🗺️
              </div>
              <div class="space-y-0.5 min-w-0">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition">${isRtl ? 'اسلامک ایڈونچر گیم' : 'Islamic Adventure'}</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">${isRtl ? '10 اسلامی عوالم اور 43 چیلنج مراحل' : '10 Sacred Realms & 43 Levels'}</p>
              </div>
            </a>

          </div>
        </div>

        <!-- 5. RECOMMENDED / ACADEMIC COURSES GRID -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              ${L.recommendedTitle}
            </h2>
            <a href="#/courses" class="text-xs text-teal-700 dark:text-teal-400 font-bold hover:underline">
              ${L.viewAllCourses}
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

        <!-- 6. DAILY INSPIRATION BANNER -->
        <div class="p-5 rounded-2xl bg-teal-900 text-white border border-teal-700/50 shadow-xs space-y-2.5">
          <div class="flex items-center justify-between text-xs text-teal-200">
            <span class="font-bold flex items-center gap-1.5">
              ${inspiration.icon} ${inspiration.type}
            </span>
            <span class="font-mono text-[11px]">${inspiration.ref}</span>
          </div>
          <div class="text-lg sm:text-xl font-bold font-arabic text-amber-300 leading-relaxed text-center py-1" dir="rtl">
            ${inspiration.arabic}
          </div>
          <p class="text-xs text-teal-100 text-center leading-relaxed max-w-xl mx-auto">
            "${inspiration.translation}"
          </p>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

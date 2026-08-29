/**
 * LearnHub Ultra-Professional Standalone Quizzes Engine
 * Multi-lingual: English, Urdu, Arabic
 * 100% Independent timed examination suite with audio feedback, 50-50 lifeline,
 * keyboard shortcuts, question palette, secure grading, and comprehensive analytics.
 */

window.Views = window.Views || {};

/// Web Audio API Sound Generator (Zero External Assets Required)
const QuizAudio = {
  ctx: null,
  enabled: true,

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  playBeep(freq = 440, type = 'sine', duration = 0.1) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e){}
  },

  playSuccess() {
    if (!this.enabled) return;
    this.playBeep(523.25, 'triangle', 0.15); // C5
    setTimeout(() => this.playBeep(659.25, 'triangle', 0.15), 100); // E5
    setTimeout(() => this.playBeep(783.99, 'triangle', 0.3), 200); // G5
  },

  playClick() {
    this.playBeep(600, 'sine', 0.05);
  },

  playFlag() {
    this.playBeep(880, 'sine', 0.08);
  }
};

// ==========================================
// 1. PROFESSIONAL QUIZZES CATALOG
// ==========================================
window.Views.renderQuizzes = async function(params, query = {}) {
  const container = document.getElementById('main-content');
  const lang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;

  const categories = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('categories') || []) : [];

  const activeCategory = query.category || 'all';
  const activeSearch = query.search || '';

  const quizzes = await window.API.getQuizzes({
    category: activeCategory,
    difficulty: query.difficulty || 'all',
    search: activeSearch,
    sort: query.sort || 'popular'
  });

  const getDifficultyLabel = (diff) => {
    if (diff === 'beginner' || diff === 'ابتدائی' || diff === 'مبتدئ') return t('difficultyBeginner', 'Beginner');
    if (diff === 'intermediate' || diff === 'متوسط') return t('difficultyIntermediate', 'Intermediate');
    if (diff === 'advanced' || diff === 'اعلیٰ' || diff === 'متقدم') return t('difficultyAdvanced', 'Advanced');
    return diff || t('difficultyBeginner', 'Beginner');
  };

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 ${fontClass} w-full max-w-full overflow-hidden" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Top Clean SaaS Hero Banner -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div class="relative z-10 space-y-3 ${isRtl ? 'text-right' : 'text-left'}">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold">
            <i data-lucide="award" class="w-3.5 h-3.5 text-amber-500"></i>
            <span>${t('quizPortalHeroBadge', isRtl ? '✨ شاہی امتحانی پورٹل • آن لائن اسلامی معروضی امتحانات و اسناد' : '✨ Royal Examination Portal • Islamic Quizzes & Verified Certifications')}</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">${t('quizPortalHeroTitle', isRtl ? 'آن لائن اسلامی امتحانات و تشخیصی کوئزز' : 'Online Islamic Examinations & Knowledge Quizzes')}</h1>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            ${t('quizPortalHeroSubtitle', isRtl ? 'قرآنی علوم، حدیثِ نبوی ﷺ، فقہ العبادات اور سیرتِ طیبہ میں اپنی مہارت کا ٹیسٹ لیں۔ پاس ہونے پر فوری آن لائن تصدیق شدہ شاہی سندِ فراغت (QR Certificate) حاصل کریں۔' : 'Test your mastery in Quranic sciences, Hadith, Fiqh, and Seerah. Pass to claim an instant verified certificate.')}
          </p>

          <!-- Metrics Highlights & Lucky Spin Wheel Portal -->
          <div class="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 text-xs">
            <a href="#/quiz-wheel" class="btn-gold py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm">
              <span class="text-base">🎡</span>
              <span>${t('luckySpinWheelBtn', isRtl ? 'انعامی قرعہ اندازی و لکی اسپن ویل (Prize Draw) ←' : 'Prize Draw & Lucky Spin Wheel →')}</span>
            </a>
            <div class="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium">
              <i data-lucide="award" class="w-3.5 h-3.5 text-amber-500 shrink-0"></i>
              <span>${t('instantDigitalCertBadge', isRtl ? 'فوری ڈیجیٹل سرٹیفکیٹ' : 'Instant Digital Certificate')}</span>
            </div>
            <div class="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-teal-600 shrink-0"></i>
              <span>${t('timedCountdownBadge', isRtl ? 'مقررہ ٹائمر کے ساتھ' : 'Timed Countdown Exam')}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Bar & Search -->
      <div class="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 w-full">
        <!-- Search -->
        <div class="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="${t('searchQuizzesPlaceholder', isRtl ? 'کوئز تلاش کریں...' : 'Search quizzes...')}" 
            value="${activeSearch}"
            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 ${isRtl ? 'pl-4 pr-10 text-right' : 'pr-4 pl-10 text-left'} text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 ${fontClass}"
            oninput="window.Views.filterQuizSearch(this.value)"
          />
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-3"></i>
        </div>

        <!-- Category Filters (Smooth Horizontal Scroll on Mobile) -->
        <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 ${fontClass}" style="-webkit-overflow-scrolling: touch;">
          <button onclick="window.Views.filterQuizCategory('all')" class="whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${activeCategory === 'all' ? 'bg-teal-700 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200'}">
            ${t('allQuizzesTab', isRtl ? 'تمام امتحانات' : 'All Quizzes')} (${quizzes.length})
          </button>
          ${categories.map(cat => `
            <button onclick="window.Views.filterQuizCategory('${cat.id}')" class="whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${activeCategory === cat.id ? 'bg-teal-700 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200'}">
              ${cat.name}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Quizzes Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        ${quizzes.length === 0 ? `
          <div class="col-span-full lh-card p-8 sm:p-12 text-center text-slate-400 ${fontClass} text-xs sm:text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            ${t('noCoursesFound', isRtl ? 'کوئی امتحانی کوئز دستیاب نہیں ہے۔' : 'No quizzes available.')}
          </div>
        ` : quizzes.map(q => {
          return `
            <div class="lh-card overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between group w-full">
              
              <!-- Card Top Header -->
              <div class="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div class="flex items-center justify-between">
                  <span class="badge bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40 text-[11px] font-bold">
                    ${q.category?.name || t('navCourses', 'Islamic Sciences')}
                  </span>
                  <span class="badge bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-bold">
                    ${getDifficultyLabel(q.difficulty)}
                  </span>
                </div>

                <h3 class="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug group-hover:text-emerald-600 transition line-clamp-2">
                  ${q.title}
                </h3>

                <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  ${q.description || t('quizPortalHeroSubtitle', 'Test your knowledge, verify answers, and earn certificates.')}
                </p>

                <!-- Key Metrics Badges -->
                <div class="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-mono text-center">
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                    <span class="text-slate-400 block text-[9px] ${fontClass}">${t('durationLabel', isRtl ? 'دورانیہ' : 'Duration')}</span>
                    <span class="font-bold text-slate-800 dark:text-slate-200">⏱️ ${q.timeLimitMinutes} ${t('durationLabel', isRtl ? 'منٹ' : 'min')}</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                    <span class="text-slate-400 block text-[9px] ${fontClass}">${t('questionsCountLabel', isRtl ? 'سوالات' : 'Questions')}</span>
                    <span class="font-bold text-slate-800 dark:text-slate-200">❓ ${q.questionCount || 5}</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                    <span class="text-slate-400 block text-[9px] ${fontClass}">${t('passingPercentLabel', isRtl ? 'پاسنگ' : 'Pass')}</span>
                    <span class="font-bold text-emerald-600">🎯 ${q.passingPercentage}%</span>
                  </div>
                </div>
              </div>

              <!-- Card Action Button -->
              <div class="p-4 sm:p-6 pt-0">
                <a href="#/quizzes/${q.id}" class="w-full btn-primary py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 group-hover:scale-[1.01] transition">
                  <i data-lucide="play-circle" class="w-4 h-4"></i>
                  <span>${t('startExamBtn', isRtl ? 'امتحان شروع کریں' : 'Start Exam')}</span>
                </a>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.filterQuizCategory = function(catId) {
  window.Router.navigate(`/quizzes?category=${catId}`);
};

window.Views.filterQuizSearch = function(val) {
  window.Router.navigate(`/quizzes?search=${encodeURIComponent(val)}`);
};

// ==========================================
// 2. QUIZ DETAILS & BRIEFING VIEW
// ==========================================
window.Views.renderQuizDetails = async function(params) {
  const container = document.getElementById('main-content');
  const lang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;

  const quiz = await window.API.getQuizById(params.id);

  if (!quiz) {
    window.App.renderError(t('noCoursesFound', 'Quiz not found.'));
    return;
  }

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-5 sm:space-y-6 ${fontClass} w-full max-w-full overflow-hidden" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Back Navigation -->
      <a href="#/quizzes" class="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 font-bold transition">
        <i data-lucide="${isRtl ? 'arrow-right' : 'arrow-left'}" class="w-4 h-4"></i> ${t('backToQuizzesLink', isRtl ? 'تمام کوئزز کی فہرست پر واپس جائیں ←' : 'Back to Quizzes List ←')}
      </a>

      <!-- Exam Briefing Card -->
      <div class="lh-card p-4 sm:p-10 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 shadow-2xl space-y-5 sm:space-y-6">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <span class="badge bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-2">
              ${quiz.category?.name || t('navQuizzes', 'Examination Portal')}
            </span>
            <h1 class="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">${quiz.title}</h1>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-400/30">
              ${t('verifiedCertAvailable', isRtl ? '📜 تصدیق شدہ سند دستیاب' : '📜 Verified Certificate Available')}
            </span>
          </div>
        </div>

        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          ${quiz.description}
        </p>

        <!-- Exam Parameters Box -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 p-3.5 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
          <div class="p-1 sm:p-2">
            <span class="text-slate-400 text-[11px] sm:text-xs block mb-1">${t('durationLabel', isRtl ? 'وقت کی حد' : 'Time Limit')}</span>
            <strong class="text-sm sm:text-base text-slate-900 dark:text-white font-mono">${quiz.timeLimitMinutes} ${t('durationLabel', isRtl ? 'منٹ' : 'min')}</strong>
          </div>
          <div class="p-1 sm:p-2">
            <span class="text-slate-400 text-[11px] sm:text-xs block mb-1">${t('questionsCountLabel', isRtl ? 'کل سوالات' : 'Total Questions')}</span>
            <strong class="text-sm sm:text-base text-slate-900 dark:text-white font-mono">${quiz.questionCount || 5}</strong>
          </div>
          <div class="p-1 sm:p-2">
            <span class="text-slate-400 text-[11px] sm:text-xs block mb-1">${t('passingPercentLabel', isRtl ? 'پاسنگ فیصد' : 'Passing Mark')}</span>
            <strong class="text-sm sm:text-base text-emerald-600 font-mono">${quiz.passingPercentage}%</strong>
          </div>
          <div class="p-1 sm:p-2">
            <span class="text-slate-400 text-[11px] sm:text-xs block mb-1">${t('lifeline5050Btn', isRtl ? 'خصوصی لائف لائن' : 'Special Lifeline')}</span>
            <strong class="text-sm sm:text-base text-amber-600">50-50</strong>
          </div>
        </div>

        <!-- Exam Instructions -->
        <div class="space-y-3 p-4 sm:p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs text-slate-700 dark:text-slate-300 leading-loose">
          <h4 class="font-bold text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <i data-lucide="check-circle" class="w-4 h-4"></i> ${t('examBriefingTitle', isRtl ? 'امتحانی ہدایات و شرائط:' : 'Exam Guidelines & Rules:')}
          </h4>
          <ul class="space-y-1.5 list-disc list-inside">
            <li>${t('examConditionTimer', isRtl ? 'امتحان شروع ہوتے ہی ٹائمر شروع ہو جائے گا۔ وقت ختم ہونے پر پیپر خودکار طریقہ سے جمع ہو جائے گا۔' : 'Timer starts immediately when exam commences. Paper auto-submits on timeout.')}</li>
            <li>${t('examConditionPassing', isRtl ? `کامیابی کے لیے کم از کم ${quiz.passingPercentage}% نمبر حاصل کرنا لازمی ہے۔` : `Minimum ${quiz.passingPercentage}% score is required for verified passing certificate.`)}</li>
            <li>${t('examConditionLifeline', isRtl ? 'امتحان کے دوران آپ 50-50 لائف لائن کی مدد سے 2 غلط آپشنز خارج کر سکتے ہیں۔' : 'Use 50-50 Lifeline once to eliminate 2 incorrect answers.')}</li>
            <li>${t('examConditionShortcuts', isRtl ? 'کی بورڈ پر 1, 2, 3, 4 یا A, B, C, D دبا کر آپشن منتخب کر سکتے ہیں۔' : 'Use keyboard numbers (1-4) or letters (A-D) to quickly choose options.')}</li>
            <li>${t('examConditionCert', isRtl ? 'امتحان میں کامیابی پر فوری طور پر آن لائن تصدیق شدہ شاہی سندِ فراغت جاری ہو جائے گی۔' : 'Instant verified digital certificate is awarded upon passing.')}</li>
          </ul>
        </div>

        <!-- Launch Button -->
        <div class="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-slate-100 dark:border-slate-800">
          <div class="text-xs text-slate-500">
            ${t('courseFree', isRtl ? '100% مفت فی سبیل اللہ' : '100% Free Fe Sabilillah')}
          </div>
          <a href="#/quiz-take/${quiz.id}" class="w-full sm:w-auto btn-primary py-3 sm:py-3.5 px-6 sm:px-8 text-xs sm:text-sm rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2">
            <span>${t('startExamNowBtn', isRtl ? 'امتحان شروع کریں 🚀' : 'Start Exam Now 🚀')}</span>
          </a>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// ==========================================
// 3. LIVE EXAMINATION ENGINE & PLAYER
// ==========================================
window.QuizSession = {
  quiz: null,
  questions: [],
  currentIndex: 0,
  userAnswers: {},
  flaggedQuestions: {},
  lifelineUsed: false,
  eliminatedOptions: {},
  timeRemainingSeconds: 0,
  timerInterval: null,
  soundEnabled: true
};

window.Views.renderQuizTake = async function(params) {
  const lang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;

  const quiz = await window.API.getQuizById(params.id);

  if (!quiz) {
    window.App.renderError(t('noCoursesFound', 'Quiz not found.'));
    return;
  }

  const questions = await window.API.getQuizQuestionsForTake(quiz.id);

  if (!questions || questions.length === 0) {
    window.App.renderError(t('noCoursesFound', 'No questions available in this quiz.'));
    return;
  }

  // Initialize Session
  window.QuizSession.quiz = quiz;
  window.QuizSession.questions = questions;
  window.QuizSession.currentIndex = 0;
  window.QuizSession.userAnswers = {};
  window.QuizSession.flaggedQuestions = {};
  window.QuizSession.lifelineUsed = false;
  window.QuizSession.eliminatedOptions = {};
  window.QuizSession.timeRemainingSeconds = quiz.timeLimitMinutes * 60;

  window.onkeydown = function(e) {
    if (!window.QuizSession.quiz) return;
    const key = e.key.toUpperCase();
    if (['1', '2', '3', '4'].includes(key)) {
      window.Views.selectOption(parseInt(key, 10) - 1);
    } else if (['A', 'B', 'C', 'D'].includes(key)) {
      window.Views.selectOption(key.charCodeAt(0) - 65);
    } else if (key === 'F') {
      window.Views.toggleFlagCurrent();
    } else if (e.key === 'ArrowRight' || key === 'N') {
      window.Views.nextQuestion();
    } else if (e.key === 'ArrowLeft' || key === 'P') {
      window.Views.prevQuestion();
    }
  };

  clearInterval(window.QuizSession.timerInterval);
  window.QuizSession.timerInterval = setInterval(() => {
    window.QuizSession.timeRemainingSeconds--;
    window.Views.updateTimerDisplay();

    if (window.QuizSession.timeRemainingSeconds <= 60 && window.QuizSession.timeRemainingSeconds > 0) {
      QuizAudio.playBeep(800, 'sine', 0.05);
    }

    if (window.QuizSession.timeRemainingSeconds <= 0) {
      clearInterval(window.QuizSession.timerInterval);
      window.App.showToast(t('timedCountdownBadge', 'Time is up! Submitting paper...'), 'warning');
      window.Views.submitQuizExam();
    }
  }, 1000);

  window.Views.renderActiveQuestionUI();
};

window.Views.renderActiveQuestionUI = function() {
  const container = document.getElementById('main-content');
  const lang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;

  const S = window.QuizSession;
  const q = S.questions[S.currentIndex];
  const qNum = S.currentIndex + 1;
  const total = S.questions.length;
  const isFlagged = !!S.flaggedQuestions[q.id];
  const currentAnswer = S.userAnswers[q.id];
  const eliminated = S.eliminatedOptions[q.id] || [];

  const optLabels = lang === 'ur' ? ['الف', 'ب', 'ج', 'د'] : (lang === 'ar' ? ['أ', 'ب', 'ج', 'د'] : ['A', 'B', 'C', 'D']);

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6 ${fontClass} w-full max-w-full overflow-hidden" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Top Exam Control Bar -->
      <div class="lh-card p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 border-2 border-emerald-500/40 shadow-xl sticky top-16 sm:top-20 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur rounded-2xl">
        <div class="min-w-0 flex-1">
          <span class="text-[10px] sm:text-xs font-bold text-slate-400 block">${t('examLabel', isRtl ? 'امتحان:' : 'Exam:')}</span>
          <h2 class="font-extrabold text-xs sm:text-base text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">${S.quiz.title}</h2>
        </div>

        <div class="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <!-- 50-50 Lifeline Button -->
          <button 
            onclick="window.Views.useLifeline()" 
            class="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center gap-1 ${S.lifelineUsed ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:scale-105 border border-amber-400/40 shadow-sm'}"
            ${S.lifelineUsed ? 'disabled' : ''}>
            <i data-lucide="zap" class="w-3.5 h-3.5 shrink-0"></i>
            <span>50-50 ${S.lifelineUsed ? t('lifelineUsedLabel', '(Used)') : t('lifeline5050Btn', '50-50')}</span>
          </button>

          <!-- Countdown Timer Display -->
          <div class="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-slate-950 text-white rounded-xl font-mono text-xs sm:text-base font-bold shadow-md border border-slate-800" id="quiz-timer-box">
            <i data-lucide="clock" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 animate-pulse shrink-0"></i>
            <span id="quiz-timer-text">--:--</span>
          </div>

          <!-- Submit Button -->
          <button onclick="window.Views.confirmSubmitExam()" class="btn-primary py-1.5 sm:py-2 px-3 sm:px-5 text-[11px] sm:text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border-none font-bold shadow-md">
            ${t('submitExamBtn', isRtl ? 'جمع کریں ✓' : 'Submit ✓')}
          </button>
        </div>
      </div>

      <!-- Main Examination Arena -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        
        <!-- Question Content Box (Left 8 cols on laptop, full on mobile/tablet) -->
        <div class="lg:col-span-8 lh-card p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-xl rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 w-full overflow-hidden">
          <div class="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 sm:pb-4">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold font-mono border border-emerald-300/30">
                ${t('questionCountOf', isRtl ? 'سوال' : 'Question')} ${qNum} ${t('outOfLabel', isRtl ? 'از' : 'of')} ${total}
              </span>
              <span class="text-[11px] sm:text-xs text-slate-400 font-mono">(${q.marks || 10} ${t('marksLabel', isRtl ? 'نمبر' : 'pts')})</span>
            </div>

            <!-- Flag Button -->
            <button onclick="window.Views.toggleFlagCurrent()" class="text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${isFlagged ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-400/40' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}">
              <i data-lucide="flag" class="w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500 text-amber-500' : ''}"></i>
              <span>${isFlagged ? t('flaggedQuestionBtn', isRtl ? 'نشان زدہ' : 'Flagged') : t('flagQuestionBtn', isRtl ? 'نشان لگائیں' : 'Flag')}</span>
            </button>
          </div>

          <!-- Question Text -->
          <h3 class="text-sm sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed break-words">
            ${q.questionText}
          </h3>

          <!-- Options Grid (Never Cut Off, Full Touch Area) -->
          <div class="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2 w-full">
            ${q.options.map((opt, idx) => {
              const isSelected = currentAnswer === idx;
              const isElim = eliminated.includes(idx);

              if (isElim) {
                return `
                  <div class="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/30 text-slate-400 opacity-40 line-through text-xs sm:text-sm flex items-center gap-2.5 sm:gap-3 w-full">
                    <span class="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-400 font-bold flex items-center justify-center text-xs shrink-0">${optLabels[idx]}</span>
                    <span class="break-words min-w-0 flex-1">${opt} ${t('eliminatedOptionLabel', isRtl ? '(50-50 خارج)' : '(50-50 Eliminated)')}</span>
                  </div>
                `;
              }

              return `
                <div 
                  onclick="window.Views.selectOption(${idx})" 
                  class="p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition cursor-pointer flex items-center justify-between gap-2.5 sm:gap-3 group w-full min-h-[48px] sm:min-h-[52px] ${
                    isSelected 
                      ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-md scale-[1.005]' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }">
                  <div class="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-bold text-xs flex items-center justify-center transition shrink-0 ${
                      isSelected ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                    }">
                      ${optLabels[idx]}
                    </span>
                    <span class="text-xs sm:text-base font-semibold leading-relaxed break-words flex-1 min-w-0">${opt}</span>
                  </div>
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition shrink-0 ${isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'}">
                    ${isSelected ? '<i data-lucide="check" class="w-3 h-3 text-white"></i>' : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Bottom Question Navigator Controls -->
          <div class="flex items-center justify-between gap-2 pt-4 sm:pt-6 border-t border-slate-100 dark:border-slate-800">
            <button 
              onclick="window.Views.prevQuestion()" 
              class="btn-secondary py-2 sm:py-2.5 px-3.5 sm:px-5 text-xs rounded-xl flex items-center gap-1 font-bold"
              ${S.currentIndex === 0 ? 'disabled style="opacity:0.4"' : ''}>
              ${t('previousQuestionBtn', isRtl ? '→ پچھلا سوال (P)' : '← Previous (P)')}
            </button>

            <div class="text-[11px] text-slate-400 hidden sm:block font-mono">
              ${t('keyboardShortcutsHint', 'Shortcuts: 1, 2, 3, 4 | N, P, F')}
            </div>

            ${S.currentIndex < total - 1 ? `
              <button onclick="window.Views.nextQuestion()" class="btn-primary py-2 sm:py-2.5 px-4 sm:px-6 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 border-none font-bold text-white shadow-md flex items-center gap-1">
                ${t('nextQuestionBtn', isRtl ? 'اگلا سوال (N) ←' : 'Next (N) →')}
              </button>
            ` : `
              <button onclick="window.Views.confirmSubmitExam()" class="btn-primary py-2 sm:py-2.5 px-4 sm:px-6 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 border-none font-bold text-white shadow-md">
                ${t('submitPaperBtn', isRtl ? 'پیپر جمع کریں ✓' : 'Submit Paper ✓')}
              </button>
            `}
          </div>
        </div>

        <!-- Question Palette Navigator -->
        <div class="lg:col-span-4 lh-card p-4 sm:p-6 space-y-3 sm:space-y-4 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl w-full overflow-hidden">
          <h4 class="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>${t('questionPaletteTitle', isRtl ? 'سوالات کا نقشہ (Palette)' : 'Question Palette')}</span>
            <span class="text-emerald-600 font-bold font-mono">${Object.keys(S.userAnswers).length} / ${total} ${t('solvedQuestionsLabel', isRtl ? 'حل شدہ' : 'Answered')}</span>
          </h4>

          <!-- Matrix Grid -->
          <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-1.5 sm:gap-2">
            ${S.questions.map((qItem, idx) => {
              const isAns = S.userAnswers[qItem.id] !== undefined;
              const isFlg = S.flaggedQuestions[qItem.id];
              const isCurr = S.currentIndex === idx;

              let btnClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700';
              if (isFlg) btnClass = 'bg-amber-500 text-white font-bold ring-2 ring-amber-300 border-none';
              else if (isAns) btnClass = 'bg-emerald-600 text-white font-bold shadow border-none';

              if (isCurr) btnClass += ' ring-2 ring-emerald-500 scale-105 shadow-md';

              return `
                <button 
                  onclick="window.Views.jumpToQuestion(${idx})" 
                  class="w-full aspect-square min-h-[36px] max-h-[44px] rounded-xl text-xs font-mono font-bold transition flex items-center justify-center relative ${btnClass}">
                  ${idx + 1}
                  ${isFlg ? '<span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full"></span>' : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
  window.Views.updateTimerDisplay();
};

window.Views.selectOption = function(optIdx) {
  const S = window.QuizSession;
  const q = S.questions[S.currentIndex];
  if (!q) return;
  S.userAnswers[q.id] = optIdx;
  QuizAudio.playClick();
  window.Views.renderActiveQuestionUI();
};

window.Views.toggleFlagCurrent = function() {
  const S = window.QuizSession;
  const q = S.questions[S.currentIndex];
  if (!q) return;
  S.flaggedQuestions[q.id] = !S.flaggedQuestions[q.id];
  QuizAudio.playFlag();
  window.Views.renderActiveQuestionUI();
};

window.Views.useLifeline = function() {
  const S = window.QuizSession;
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;
  if (S.lifelineUsed) return;
  const q = S.questions[S.currentIndex];
  if (!q || !q.options || q.options.length <= 2) return;
  
  // Find correct answer index from DB to never eliminate it
  const dbQ = window.DB ? window.DB.findById('quizQuestions', q.id) || (window.DB.get('quizQuestions') || []).find(x => x.id === q.id) : null;
  const correctIdx = dbQ ? dbQ.correctAnswerIndex : (q.correctAnswerIndex !== undefined ? q.correctAnswerIndex : 0);

  // Eligible wrong options to eliminate
  const allWrongIdxs = q.options.map((_, i) => i).filter(i => i !== correctIdx);
  // Pick 2 wrong options to eliminate
  const shuffledWrong = allWrongIdxs.sort(() => Math.random() - 0.5);
  const eliminated = shuffledWrong.slice(0, 2);

  S.lifelineUsed = true;
  S.eliminatedOptions[q.id] = eliminated;
  
  // If user had previously selected one of the eliminated options, unselect it
  if (eliminated.includes(S.userAnswers[q.id])) {
    delete S.userAnswers[q.id];
  }

  window.App.showToast(t('lifelineAppliedToast', '50-50 lifeline applied! 2 incorrect choices removed. ✨'), 'info');
  window.Views.renderActiveQuestionUI();
};

window.Views.nextQuestion = function() {
  const S = window.QuizSession;
  if (S.currentIndex < S.questions.length - 1) {
    S.currentIndex++;
    QuizAudio.playClick();
    window.Views.renderActiveQuestionUI();
  }
};

window.Views.prevQuestion = function() {
  const S = window.QuizSession;
  if (S.currentIndex > 0) {
    S.currentIndex--;
    QuizAudio.playClick();
    window.Views.renderActiveQuestionUI();
  }
};

window.Views.jumpToQuestion = function(idx) {
  const S = window.QuizSession;
  if (idx >= 0 && idx < S.questions.length) {
    S.currentIndex = idx;
    QuizAudio.playClick();
    window.Views.renderActiveQuestionUI();
  }
};

window.Views.updateTimerDisplay = function() {
  const S = window.QuizSession;
  const timerText = document.getElementById('quiz-timer-text');
  if (!timerText) return;
  const remaining = Math.max(0, S.timeRemainingSeconds || 0);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  timerText.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

window.Views.confirmSubmitExam = function() {
  const S = window.QuizSession;
  const lang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;

  const answeredCount = Object.keys(S.userAnswers).length;
  const total = S.questions.length;

  window.App.showModal(t('confirmSubmitExamTitle', 'Submit Exam Paper'), `
    <div class="space-y-4 ${fontClass} ${isRtl ? 'text-right' : 'text-left'}" dir="${isRtl ? 'rtl' : 'ltr'}">
      <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        ${t('confirmSubmitExamPrompt', 'Are you sure you want to finish and submit your exam?')}
      </p>
      <div class="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2 text-xs border border-slate-200 dark:border-slate-700">
        <div class="flex justify-between"><span>${t('answeredQuestionsLabel', isRtl ? 'حل شدہ سوالات:' : 'Answered Questions:')}</span> <strong class="text-emerald-600 font-mono">${answeredCount} / ${total}</strong></div>
        <div class="flex justify-between"><span>${t('remainingQuestionsLabel', isRtl ? 'باقی ماندہ سوالات:' : 'Unanswered Questions:')}</span> <strong class="text-rose-500 font-mono">${total - answeredCount}</strong></div>
      </div>
      <div class="flex gap-2 pt-2">
        <button onclick="window.App.closeModal(); window.Views.submitQuizExam();" class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
          ${t('confirmSubmitYesBtn', isRtl ? 'ہاں، نتیجہ دیکھیں ✓' : 'Yes, Submit & View Score ✓')}
        </button>
        <button onclick="window.App.closeModal()" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">
          ${t('confirmSubmitGoBackBtn', isRtl ? 'واپس جائیں' : 'Back to Exam')}
        </button>
      </div>
    </div>
  `);
};

// ==========================================
// 4. RESULTS & ANALYTICS SCORECARD
// ==========================================
window.Views.submitQuizExam = async function() {
  const S = window.QuizSession;
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;

  if (!S || !S.quiz) {
    window.App.showToast(t('noCoursesFound', 'Quiz session not found.'), 'warning');
    window.Router.navigate('/quizzes');
    return;
  }
  if (S.timerInterval) clearInterval(S.timerInterval);
  window.onkeydown = null;
  window.App.showLoading(true);
  try {
    const timeSpent = Math.max(1, (S.quiz.timeLimitMinutes * 60) - (S.timeRemainingSeconds || 0));
    const userObj = typeof window.Auth?.getCurrentUser === 'function' ? window.Auth.getCurrentUser() : window.Auth?.currentUser;
    const curUserId = userObj?.id || 'usr-student-1';
    const result = await window.API.submitQuizAttempt(S.quiz.id, curUserId, S.userAnswers, timeSpent);
    window.App.showLoading(false);
    if (result.isPassed) {
      QuizAudio.playSuccess();
      if (window.confetti) window.confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
    }
    window.Views.renderQuizResultScorecard(result);
  } catch(err) {
    console.error('Quiz submit evaluation error:', err);
    window.App.showLoading(false);
    window.App.showToast(err.message || 'Evaluation error occurred', 'danger');
  }
};

window.Views.renderQuizResultScorecard = function(res) {
  const container = document.getElementById('main-content');
  const lang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;

  const S = window.QuizSession || {};
  const quiz = res.quiz || S.quiz || { title: t('navQuizzes', 'Islamic Examination'), id: 'qz-1' };
  const isPassed = !!(res.isPassed ?? res.passed);
  const breakdown = res.breakdown || res.detailedReview || [];
  const score = res.score ?? res.obtainedMarks ?? 0;
  const totalMarks = res.totalMarks || (breakdown.length * 10) || 30;
  const percentage = res.percentage ?? Math.round((score / totalMarks) * 100);
  const correctCount = res.correctCount ?? breakdown.filter(b => b.isCorrect).length;
  const totalQuestions = res.totalQuestions || breakdown.length || 3;
  const timeSpentSeconds = res.timeSpentSeconds ?? res.timeTakenSeconds ?? 60;

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 ${fontClass} w-full max-w-full overflow-hidden" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Scorecard Header Card -->
      <div class="lh-card p-5 sm:p-10 text-center space-y-5 sm:space-y-6 border-2 ${isPassed ? 'border-emerald-500 shadow-emerald-500/10' : 'border-rose-500 shadow-rose-500/10'} shadow-2xl relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900">
        
        <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto ${isPassed ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'} text-3xl sm:text-4xl shadow-xl">
          <i data-lucide="${isPassed ? 'award' : 'alert-circle'}" class="w-10 h-10 sm:w-12 sm:h-12"></i>
        </div>

        <div>
          <span class="badge ${isPassed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'} text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2">
            ${isPassed ? t('examPassedBanner', '🎉 Examination Passed (PASSED)') : t('examFailedBanner', '⚠️ Passing Marks Not Reached (TRY AGAIN)')}
          </span>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">${quiz.title}</h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            ${isPassed ? t('examPassedMsg', 'Congratulations! You demonstrated excellent proficiency in this exam.') : t('examFailedMsg', 'You did not meet the required passing mark. Review and retry.')}
          </p>
        </div>

        <!-- Metrics Gauge Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 max-w-2xl mx-auto pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800">
          <div class="bg-slate-50 dark:bg-slate-800/50 p-3 sm:p-4 rounded-2xl">
            <div class="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">${t('obtainedScoreLabel', isRtl ? 'حاصل کردہ اسکور' : 'Score Obtained')}</div>
            <div class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">${score} / ${totalMarks}</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/50 p-3 sm:p-4 rounded-2xl">
            <div class="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">${t('accuracyLabel', isRtl ? 'درستگی' : 'Accuracy')}</div>
            <div class="text-xl sm:text-2xl font-extrabold ${isPassed ? 'text-emerald-600' : 'text-rose-500'} mt-1 font-mono">${percentage}%</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/50 p-3 sm:p-4 rounded-2xl">
            <div class="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">${t('correctAnswersLabel', isRtl ? 'صحیح جوابات' : 'Correct Answers')}</div>
            <div class="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1 font-mono">${correctCount} / ${totalQuestions}</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/50 p-3 sm:p-4 rounded-2xl">
            <div class="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">${t('timeSpentLabel', isRtl ? 'صرف شدہ وقت' : 'Time Spent')}</div>
            <div class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">${Math.floor(timeSpentSeconds / 60)}m ${timeSpentSeconds % 60}s</div>
          </div>
        </div>

        <!-- Action Buttons & Certificate Claim -->
        <div class="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2">
          ${isPassed ? `
            <button onclick="window.Views.claimExamCertificate('${quiz.id}', '${(quiz.title || '').replace(/'/g, "\\'")}', ${percentage})" class="btn-primary w-full sm:w-auto py-2.5 sm:py-3 px-6 sm:px-8 text-xs rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-xl flex items-center justify-center gap-2">
              <i data-lucide="award" class="w-4 h-4"></i>
              <span>${t('claimCertificateBtn', isRtl ? 'شاہی سندِ فراغت حاصل کریں (QR Certificate) 🎓' : 'Claim Verified Certificate (QR) 🎓')}</span>
            </button>
          ` : ''}
          <a href="#/quiz-take/${quiz.id}" class="btn-primary flex-1 sm:flex-none py-2.5 sm:py-3 px-4 sm:px-6 text-xs rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center">
            ${t('retakeExamBtn', isRtl ? 'دوبارہ امتحان دیں' : 'Retake Exam')}
          </a>
          <a href="#/quizzes" class="btn-secondary flex-1 sm:flex-none py-2.5 sm:py-3 px-4 sm:px-6 text-xs rounded-xl sm:rounded-2xl font-bold text-center">
            ${t('browseAllQuizzesBtn', isRtl ? 'دیگر تمام کوئزز' : 'Browse All Quizzes')}
          </a>
        </div>
      </div>

      <!-- Question by Question Detailed Explanations Breakdown -->
      <div class="space-y-4">
        <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i data-lucide="book-open" class="w-5 h-5 text-emerald-600"></i> ${t('detailedReviewHeading', isRtl ? 'سوالات کا تفصیلی جائزہ اور جوابات کی تحقیق:' : 'Detailed Question Review & Explanations:')}
        </h3>

        ${breakdown.map((item, idx) => `
          <div class="lh-card p-4 sm:p-7 space-y-3 sm:space-y-4 ${isRtl ? 'border-r-4' : 'border-l-4'} ${item.isCorrect ? 'border-r-emerald-500 border-l-emerald-500' : 'border-r-rose-500 border-l-rose-500'} rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm w-full overflow-hidden">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span class="text-xs font-bold font-mono">${t('questionNumberLabel', isRtl ? 'سوال نمبر' : 'Question #')} ${idx + 1}</span>
              <span class="badge ${item.isCorrect ? 'badge-success bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'badge-danger bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'} text-[10px] font-bold">
                ${item.isCorrect ? t('correctAnswerBadge', isRtl ? `صحیح جواب (+${item.marks || 10} نمبر)` : `Correct (+${item.marks || 10} pts)`) : t('wrongAnswerBadge', isRtl ? 'غلط جواب (0 نمبر)' : 'Incorrect (0 pts)')}
              </span>
            </div>

            <h4 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">${item.questionText}</h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
              <div class="p-3 sm:p-3.5 rounded-xl ${item.isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300/30' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-300/30'}">
                <span class="text-[10px] uppercase font-bold block opacity-70 mb-1">${t('yourSelectedAnswerLabel', isRtl ? 'آپ کا منتخب کردہ جواب:' : 'Your Answer:')}</span>
                <span class="font-bold break-words">${item.selectedOptionText || t('skippedAnswerLabel', isRtl ? 'حل نہیں کیا گیا (Skipped)' : 'Skipped')}</span>
              </div>

              <div class="p-3 sm:p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300/30">
                <span class="text-[10px] uppercase font-bold block opacity-70 mb-1">${t('correctAnswerLabel', isRtl ? 'درست جواب:' : 'Correct Answer:')}</span>
                <span class="font-bold break-words">${item.correctOptionText}</span>
              </div>
            </div>

            <!-- In-Depth Explanation -->
            ${item.explanation ? `
              <div class="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-700">
                <strong class="text-cyan-700 dark:text-cyan-400 block mb-1">${t('detailedExplanationLabel', isRtl ? 'تفصیلی وضاحت (Explanation):' : 'Detailed Explanation:')}</strong>
                ${item.explanation}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.claimExamCertificate = function(quizId, quizTitle, percentage = 100) {
  const user = typeof window.Auth?.getCurrentUser === 'function' ? window.Auth.getCurrentUser() : window.Auth?.currentUser;
  const lang = window.I18N ? window.I18N.getCurrentLanguage() : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;

  const certNumber = `LH-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const certId = `cert-${Date.now()}`;

  const cert = {
    id: certId,
    certificateNumber: certNumber,
    serialNumber: certNumber,
    userId: user ? user.id : 'usr-student-1',
    userName: user?.name || (isRtl ? 'جمیل رحمن انصاری' : 'Jamil Rahman'),
    courseId: quizId,
    courseTitle: `${t('examLabel', isRtl ? 'امتحان:' : 'Exam:')} ${quizTitle}`,
    instructorName: isRtl ? 'شیخ ڈاکٹر محمد الہاشمی (Ph.D. Islamic Sciences)' : 'Dr. Muhammad Al-Hashimi (Ph.D. Islamic Sciences)',
    issueDate: new Date().toISOString().split('T')[0],
    verificationUrl: `#/verify-cert/${certNumber}`,
    grade: isRtl ? `ممتاز درجہ (Pass with Distinction - ${percentage}%)` : `Distinction Grade (${percentage}%)`,
    badgeColor: '#059669'
  };

  if (window.DB) {
    window.DB.insert('certificates', cert);
  }

  window.App.showToast(t('msgSuccess', 'Verified certificate generated successfully! 🎓⭐'), 'success');
  
  // Open the royal printable certificate modal immediately
  if (typeof window.Views.openCertificateViewer === 'function') {
    window.Views.openCertificateViewer(certId);
  } else {
    window.Router.navigate('/certificates');
  }
};

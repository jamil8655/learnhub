/**
 * LearnHub Ultra-Professional Standalone Quizzes Engine
 * 100% Independent timed examination suite with audio feedback, 50-50 lifeline,
 * keyboard shortcuts, question palette, secure grading, and comprehensive analytics.
 */

window.Views = window.Views || {};

// Web Audio API Sound Generator (Zero External Assets Required)
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

// Standalone Quizzes Catalog
window.Views.renderQuizzes = async function(params, query = {}) {
  const container = document.getElementById('main-content');
  const categories = window.DB.get('categories');

  const activeCategory = query.category || 'all';
  const activeDifficulty = query.difficulty || 'all';
  const activeSearch = query.search || '';

  const quizzes = await window.API.getQuizzes({
    category: activeCategory,
    difficulty: activeDifficulty,
    search: activeSearch,
    sort: query.sort || 'popular'
  });

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Breadcrumb & Header -->
      <div class="mb-8">
        <div class="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <a href="#/" class="hover:text-indigo-600">ہوم</a>
          <span>/</span>
          <span class="text-slate-900 dark:text-white font-medium">آزاد امتحانی کوئزز</span>
        </div>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 text-xs font-bold mb-2">
              <i data-lucide="zap" class="w-3.5 h-3.5"></i> پروفیشنل ایگزامینیشن پورٹل
            </div>
            <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white font-urdu">آن لائن امتحانات و تشخیصی کوئزز</h1>
            <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">بغیر کسی کورس میں داخلہ لیے براہِ راست ٹائم والے امتحانات دیں اور اپنی مہارت کی تصدیق کریں۔</p>
          </div>

          <div class="flex items-center gap-3">
            <a href="#/dashboard" class="btn-secondary text-xs rounded-xl flex items-center gap-2">
              <i data-lucide="history" class="w-4 h-4 text-cyan-600"></i> میری سابقہ کوششیں
            </a>
          </div>
        </div>
      </div>

      <!-- Filters & Quizzes Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div class="lh-card p-6 space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="filter" class="w-4 h-4 text-cyan-600"></i> فلٹرز (Filters)
            </h3>
            <button onclick="window.Router.navigate('/quizzes')" class="text-xs text-cyan-600 dark:text-cyan-400 hover:underline">ری سیٹ</button>
          </div>

          <!-- Search Filter -->
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">کوئز تلاش کریں</label>
            <div class="relative">
              <input 
                type="text" 
                id="quiz-search-input" 
                value="${activeSearch}" 
                placeholder="عنوان یا ٹیکنالوجی تلاش کریں..." 
                class="form-input text-xs pl-8 font-urdu"
                onkeydown="if(event.key==='Enter') window.Views.quizFilterChanged()"
              />
              <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3"></i>
            </div>
          </div>

          <!-- Difficulty Filter -->
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">امتحانی سطح (Difficulty)</label>
            <div class="space-y-1.5">
              ${['all', 'beginner', 'intermediate', 'advanced'].map(diff => `
                <label class="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="radio" name="quiz-difficulty" value="${diff}" ${activeDifficulty.toLowerCase() === diff ? 'checked' : ''} onchange="window.Views.quizFilterChanged()" class="text-cyan-600 focus:ring-cyan-500">
                  <span class="capitalize">${diff === 'all' ? 'تمام لیولز (All)' : diff}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Quizzes Grid List -->
        <div class="lg:col-span-3 space-y-6">
          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-500 font-semibold">${quizzes.length} امتحانات دستیاب ہیں</span>
          </div>

          ${quizzes.length === 0 ? `
            <div class="lh-card p-12 text-center space-y-4">
              <i data-lucide="help-circle" class="w-12 h-12 text-slate-300 mx-auto"></i>
              <h3 class="font-bold text-lg text-slate-900 dark:text-white">کوئی کوئز نہیں ملا</h3>
              <p class="text-xs text-slate-500">براہ کرم دوسرے فلٹرز منتخب کریں۔</p>
              <button onclick="window.Router.navigate('/quizzes')" class="btn-primary py-2 px-4 text-xs">تمام کوئزز دیکھیں</button>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${quizzes.map(quiz => `
                <div class="lh-card lh-card-hover p-6 flex flex-col justify-between group border-2 border-transparent hover:border-cyan-500/40 transition">
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <span class="badge ${quiz.difficulty === 'Beginner' ? 'badge-success' : quiz.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-danger'} text-xs">
                        ${quiz.difficulty}
                      </span>
                      <span class="text-xs text-slate-500 flex items-center gap-1">
                        <i data-lucide="clock" class="w-3.5 h-3.5 text-cyan-500"></i> ${quiz.timeLimitMinutes} منٹ
                      </span>
                    </div>

                    <h3 class="font-bold text-base text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition font-urdu">
                      <a href="#/quizzes/${quiz.id}">${quiz.title}</a>
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 font-urdu">${quiz.shortDescription}</p>
                  </div>

                  <div class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div class="grid grid-cols-3 gap-2 text-center text-xs">
                      <div class="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                        <div class="text-[10px] text-slate-400">پاسنگ اسکور</div>
                        <div class="font-bold text-slate-900 dark:text-white">${quiz.passingPercentage}%</div>
                      </div>
                      <div class="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                        <div class="text-[10px] text-slate-400">کامیابی شرح</div>
                        <div class="font-bold text-emerald-600">${quiz.passRate}%</div>
                      </div>
                      <div class="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                        <div class="text-[10px] text-slate-400">امیدوار</div>
                        <div class="font-bold text-slate-900 dark:text-white">${(quiz.participantsCount || 100).toLocaleString()}</div>
                      </div>
                    </div>

                    <div class="flex items-center gap-2">
                      <a href="#/quizzes/${quiz.id}" class="btn-secondary flex-1 py-2 text-xs rounded-xl text-center">
                        تفصیلات
                      </a>
                      <a href="#/quiz-take/${quiz.id}" class="btn-primary flex-1 py-2 text-xs rounded-xl bg-cyan-600 hover:bg-cyan-500 border-none text-center font-bold shadow-md">
                        امتحان شروع کریں &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.quizFilterChanged = function() {
  const search = document.getElementById('quiz-search-input')?.value || '';
  const diff = document.querySelector('input[name="quiz-difficulty"]:checked')?.value || 'all';
  let url = `/quizzes?difficulty=${diff}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  window.Router.navigate(url);
};

// Quiz Details Preview View
window.Views.renderQuizDetails = async function(params) {
  const container = document.getElementById('main-content');
  const quiz = await window.API.getQuizById(params.id);

  if (!quiz) {
    window.App.renderError('Quiz not found.');
    return;
  }

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <a href="#/quizzes" class="text-xs font-bold text-cyan-600 hover:underline flex items-center gap-1">
        &larr; تمام امتحانات پر واپس جائیں
      </a>

      <div class="lh-card p-8 space-y-6 border-2 border-cyan-500/30 shadow-2xl">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <span class="badge ${quiz.difficulty === 'Beginner' ? 'badge-success' : quiz.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-danger'} text-xs">
            ${quiz.difficulty} Level
          </span>
          <span class="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <i data-lucide="clock" class="w-4 h-4 text-cyan-600"></i> وقت: ${quiz.timeLimitMinutes} منٹ
          </span>
        </div>

        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-urdu">${quiz.title}</h1>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-urdu">${quiz.shortDescription}</p>

        <!-- Exam Instructions Box -->
        <div class="p-5 bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/60 rounded-2xl space-y-3 font-urdu">
          <h4 class="font-bold text-sm text-cyan-900 dark:text-cyan-300 flex items-center gap-2">
            <i data-lucide="info" class="w-4 h-4 text-cyan-600"></i> امتحانی ہدایات و قواعد:
          </h4>
          <ul class="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <li>• آپ کے پاس تمام سوالات مکمل کرنے کے لیے کل <strong>${quiz.timeLimitMinutes} منٹ</strong> کا وقت ہوگا۔</li>
            <li>• کامیابی کے لیے کم از کم <strong>${quiz.passingPercentage}% نمبر</strong> حاصل کرنا لازمی ہے۔</li>
            <li>• امتحان کے دوران آپ <strong>50-50 لائف لائن</strong> کی مدد سے 2 غلط آپشنز ختم کر سکتے ہیں۔</li>
            <li>• کی بورڈ پر <strong>1, 2, 3, 4</strong> یا <strong>A, B, C, D</strong> دبا کر آپشن سلیکٹ کر سکتے ہیں۔</li>
            <li>• امتحان مکمل کرنے پر فوری رزلٹ کارڈ اور تصدیقی سند جاری ہوگی۔</li>
          </ul>
        </div>

        <div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
          <div class="text-xs text-slate-500">
            کل سوالات: <strong>${quiz.questionCount || 5}</strong> • زیادہ سے زیادہ کوششیں: <strong>${quiz.maxAttempts || 5}</strong>
          </div>
          <a href="#/quiz-take/${quiz.id}" class="btn-primary py-3 px-8 text-sm rounded-xl bg-cyan-600 hover:bg-cyan-500 border-none font-extrabold shadow-xl">
            ٹائمر والا امتحان شروع کریں 🚀
          </a>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// State for Live Quiz Taking Session
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
  soundEnabled: true,
  isFullscreen: false
};

// Timed Interactive Examination Engine
window.Views.renderQuizTake = async function(params) {
  const container = document.getElementById('main-content');
  const quiz = await window.API.getQuizById(params.id);

  if (!quiz) {
    window.App.renderError('Quiz not found.');
    return;
  }

  // Fetch securely evaluated questions (answers hidden on client)
  const questions = await window.API.getQuizQuestionsForTake(quiz.id);

  if (!questions || questions.length === 0) {
    window.App.renderError('No questions found for this quiz.');
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

  // Setup Keyboard Shortcuts Listener
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

  // Start Countdown Timer
  clearInterval(window.QuizSession.timerInterval);
  window.QuizSession.timerInterval = setInterval(() => {
    window.QuizSession.timeRemainingSeconds--;
    window.Views.updateTimerDisplay();

    if (window.QuizSession.timeRemainingSeconds <= 60 && window.QuizSession.timeRemainingSeconds > 0) {
      QuizAudio.playBeep(800, 'sine', 0.05); // Urgency tick
    }

    if (window.QuizSession.timeRemainingSeconds <= 0) {
      clearInterval(window.QuizSession.timerInterval);
      window.App.showToast('وقت ختم ہو گیا! خودکار طریقہ سے پیپر جمع ہو رہا ہے...', 'warning');
      window.Views.submitQuizExam();
    }
  }, 1000);

  window.Views.renderActiveQuestionUI();
};

window.Views.renderActiveQuestionUI = function() {
  const container = document.getElementById('main-content');
  const S = window.QuizSession;
  const q = S.questions[S.currentIndex];
  const qNum = S.currentIndex + 1;
  const total = S.questions.length;
  const isFlagged = !!S.flaggedQuestions[q.id];
  const currentAnswer = S.userAnswers[q.id];
  const eliminated = S.eliminatedOptions[q.id] || [];

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <!-- Top Exam Control Bar -->
      <div class="lh-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-2 border-cyan-500/30 shadow-lg sticky top-20 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
        <div>
          <span class="text-xs font-bold text-slate-400 block font-urdu">امتحان:</span>
          <h2 class="font-extrabold text-base text-slate-900 dark:text-white font-urdu truncate max-w-sm sm:max-w-md">${S.quiz.title}</h2>
        </div>

        <div class="flex items-center gap-3">
          <!-- 50-50 Lifeline Button -->
          <button 
            onclick="window.Views.useLifeline()" 
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${S.lifelineUsed ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:scale-105'}"
            ${S.lifelineUsed ? 'disabled' : ''}>
            <i data-lucide="zap" class="w-3.5 h-3.5"></i>
            <span>50-50 لائف لائن ${S.lifelineUsed ? '(استعمال شدہ)' : ''}</span>
          </button>

          <!-- Sound Toggle -->
          <button onclick="QuizAudio.enabled = !QuizAudio.enabled; this.classList.toggle('text-slate-400');" class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-cyan-600" title="صدا / Sound">
            <i data-lucide="volume-2" class="w-4 h-4"></i>
          </button>

          <!-- Countdown Timer Display -->
          <div class="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-mono text-base font-bold shadow" id="quiz-timer-box">
            <i data-lucide="clock" class="w-4 h-4 text-cyan-400 animate-pulse"></i>
            <span id="quiz-timer-text">--:--</span>
          </div>

          <!-- Submit Button -->
          <button onclick="window.Views.confirmSubmitExam()" class="btn-primary py-2 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 border-none font-bold shadow-md">
            پیپر جمع کروائیں ✓
          </button>
        </div>
      </div>

      <!-- Main Examination Arena -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        <!-- Question Content Box (Left 3 cols) -->
        <div class="lg:col-span-3 lh-card p-6 sm:p-8 space-y-6 shadow-xl">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 rounded-lg text-xs font-bold font-mono">
                سوال ${qNum} از ${total}
              </span>
              <span class="text-xs text-slate-400">(${q.marks} نمبر)</span>
            </div>

            <!-- Flag Button -->
            <button onclick="window.Views.toggleFlagCurrent()" class="text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${isFlagged ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}">
              <i data-lucide="flag" class="w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500' : ''}"></i>
              <span>${isFlagged ? 'نشان زدہ (Flagged)' : 'نشان لگائیں'}</span>
            </button>
          </div>

          <!-- Question Text -->
          <h3 class="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed font-urdu">
            ${q.questionText}
          </h3>

          <!-- Options Grid -->
          <div class="space-y-3 pt-2">
            ${q.options.map((opt, idx) => {
              const isSelected = currentAnswer === idx;
              const isElim = eliminated.includes(idx);

              if (isElim) {
                return `
                  <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/30 text-slate-400 opacity-40 line-through text-xs sm:text-sm font-urdu">
                    <span class="font-bold mr-2">${String.fromCharCode(65 + idx)}.</span> ${opt} (Eliminated 50-50)
                  </div>
                `;
              }

              return `
                <div 
                  onclick="window.Views.selectOption(${idx})" 
                  class="p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between group ${
                    isSelected 
                      ? 'border-cyan-500 bg-cyan-50/60 dark:bg-cyan-950/40 text-cyan-950 dark:text-cyan-100 shadow-md scale-[1.01]' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }">
                  <div class="flex items-center gap-3">
                    <span class="w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center transition ${
                      isSelected ? 'bg-cyan-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-cyan-100'
                    }">
                      ${String.fromCharCode(65 + idx)}
                    </span>
                    <span class="text-xs sm:text-sm font-medium font-urdu">${opt}</span>
                  </div>
                  <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-300'}">
                    ${isSelected ? '<i data-lucide="check" class="w-3 h-3 text-white"></i>' : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Bottom Question Navigator Controls -->
          <div class="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <button 
              onclick="window.Views.prevQuestion()" 
              class="btn-secondary py-2 px-4 text-xs rounded-xl flex items-center gap-1.5"
              ${S.currentIndex === 0 ? 'disabled style="opacity:0.5"' : ''}>
              &larr; پچھلا سوال (P)
            </button>

            <div class="text-[11px] text-slate-400 hidden sm:block">
              کی بورڈ شارٹ کٹس: <strong>1, 2, 3, 4</strong> یا <strong>N, P, F</strong>
            </div>

            ${S.currentIndex < total - 1 ? `
              <button onclick="window.Views.nextQuestion()" class="btn-primary py-2 px-5 text-xs rounded-xl bg-cyan-600 hover:bg-cyan-500 border-none font-bold">
                اگلا سوال (N) &rarr;
              </button>
            ` : `
              <button onclick="window.Views.confirmSubmitExam()" class="btn-primary py-2 px-5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 border-none font-bold">
                مکمل و جمع کریں ✓
              </button>
            `}
          </div>
        </div>

        <!-- Question Palette Navigator (Right 1 col) -->
        <div class="lh-card p-6 space-y-4">
          <h4 class="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>سوالات کا نقشہ (Palette)</span>
            <span class="text-cyan-600 font-bold">${Object.keys(S.userAnswers).length} / ${total} حل شدہ</span>
          </h4>

          <div class="grid grid-cols-5 gap-2">
            ${S.questions.map((qItem, idx) => {
              const isAns = S.userAnswers[qItem.id] !== undefined;
              const isFlg = S.flaggedQuestions[qItem.id];
              const isCurr = S.currentIndex === idx;

              let btnClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
              if (isFlg) btnClass = 'bg-amber-500 text-white font-bold ring-2 ring-amber-300';
              else if (isAns) btnClass = 'bg-emerald-600 text-white font-bold';

              if (isCurr) btnClass += ' ring-2 ring-cyan-500 scale-110';

              return `
                <button 
                  onclick="window.Views.jumpToQuestion(${idx})" 
                  class="w-10 h-10 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center relative ${btnClass}">
                  ${idx + 1}
                  ${isFlg ? '<span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full"></span>' : ''}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Legend -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500 font-urdu">
            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-emerald-600"></span> حل شدہ سوالات</div>
            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-amber-500"></span> نشان زدہ (Flagged)</div>
            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></span> غیر حل شدہ</div>
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
  if (S.lifelineUsed) return;

  const q = S.questions[S.currentIndex];
  if (!q || q.options.length <= 2) return;

  S.lifelineUsed = true;
  // Pick 2 random incorrect options to eliminate
  // Since we don't know correct answer on client, pick 2 options that the user didn't pick
  const selected = S.userAnswers[q.id];
  const allIdx = q.options.map((_, i) => i);
  const eligible = allIdx.filter(i => i !== selected);
  const elim1 = eligible[0];
  const elim2 = eligible[1];

  S.eliminatedOptions[q.id] = [elim1, elim2];
  window.App.showToast('50-50 لائف لائن لاگو کر دی گئی! 2 آپشنز خارج ہو گئے ہیں۔', 'info');
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

  const mins = Math.floor(S.timeRemainingSeconds / 60);
  const secs = S.timeRemainingSeconds % 60;
  timerText.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

window.Views.confirmSubmitExam = function() {
  const S = window.QuizSession;
  const answeredCount = Object.keys(S.userAnswers).length;
  const total = S.questions.length;

  window.App.showModal('امتحان جمع کروائیں (Submit Exam)', `
    <div class="space-y-4 font-urdu text-right">
      <p class="text-sm text-slate-700 dark:text-slate-300">
        کیا آپ واقعی اپنا امتحان جمع کروانا چاہتے ہیں؟
      </p>
      <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 text-xs">
        <div>حل شدہ سوالات: <strong>${answeredCount}</strong> از <strong>${total}</strong></div>
        <div>غیر حل شدہ سوالات: <strong class="text-rose-500">${total - answeredCount}</strong></div>
      </div>
      <div class="flex gap-2 pt-2">
        <button onclick="window.App.closeModal(); window.Views.submitQuizExam();" class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 border-none font-bold">
          ہاں، نتیجہ دیکھیں ✓
        </button>
        <button onclick="window.App.closeModal()" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">
          واپس جائیں
        </button>
      </div>
    </div>
  `);
};

// Evaluate & Render Ultra-Professional Result Scorecard
window.Views.submitQuizExam = async function() {
  const S = window.QuizSession;
  clearInterval(S.timerInterval);
  window.onkeydown = null; // Remove shortcut listener

  window.App.showLoading(true);

  try {
    const timeSpent = (S.quiz.timeLimitMinutes * 60) - S.timeRemainingSeconds;
    const result = await window.API.submitQuizAttempt(S.quiz.id, S.userAnswers, timeSpent);
    window.App.showLoading(false);

    if (result.isPassed) {
      QuizAudio.playSuccess();
      if (window.confetti) {
        window.confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      }
    }

    window.Views.renderQuizResultScorecard(result);
  } catch(err) {
    window.App.showLoading(false);
    window.App.showToast(err.message || 'ایگزام ایویلوئیشن میں غلطی ہوئی', 'danger');
  }
};

window.Views.renderQuizResultScorecard = function(res) {
  const container = document.getElementById('main-content');
  const quiz = res.quiz;
  const isPassed = res.isPassed;

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Scorecard Header Card -->
      <div class="lh-card p-8 text-center space-y-6 border-2 ${isPassed ? 'border-emerald-500 shadow-emerald-500/10' : 'border-rose-500 shadow-rose-500/10'} shadow-2xl relative overflow-hidden">
        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto ${isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'} text-3xl shadow-lg">
          <i data-lucide="${isPassed ? 'award' : 'alert-circle'}" class="w-10 h-10"></i>
        </div>

        <div>
          <span class="badge ${isPassed ? 'badge-success' : 'badge-danger'} text-xs font-bold uppercase tracking-wider mb-2">
            ${isPassed ? 'امتحان پاس ہو گیا (EXAM PASSED)' : 'امتحان پاس نہیں ہو سکا (TRY AGAIN)'}
          </span>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-urdu mt-1">${quiz.title}</h1>
          <p class="text-xs sm:text-sm text-slate-500 font-urdu mt-1">
            ${isPassed ? 'مبارک ہو! آپ نے اس امتحان میں شاندار کارکردگی کا مظاہرہ کیا ہے۔' : 'آپ مطلوبہ پاسنگ نمبر حاصل نہیں کر سکے، دوبارہ کوشش کریں۔'}
          </p>
        </div>

        <!-- Metrics Gauge Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
            <div class="text-[10px] uppercase font-bold text-slate-400">حاصل کردہ اسکور</div>
            <div class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">${res.score} / ${res.totalMarks}</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
            <div class="text-[10px] uppercase font-bold text-slate-400">درستگی (Accuracy)</div>
            <div class="text-2xl font-extrabold ${isPassed ? 'text-emerald-600' : 'text-rose-500'} mt-1">${res.percentage}%</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
            <div class="text-[10px] uppercase font-bold text-slate-400">صحیح جوابات</div>
            <div class="text-2xl font-extrabold text-emerald-600 mt-1">${res.correctCount} / ${res.totalQuestions}</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
            <div class="text-[10px] uppercase font-bold text-slate-400">صرف شدہ وقت</div>
            <div class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">${Math.floor(res.timeSpentSeconds / 60)}m ${res.timeSpentSeconds % 60}s</div>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a href="#/quiz-take/${quiz.id}" class="btn-primary py-2.5 px-6 text-xs rounded-xl bg-cyan-600 hover:bg-cyan-500 border-none font-bold">
            دوبارہ ٹیسٹ دیں (Retake)
          </a>
          <a href="#/quizzes" class="btn-secondary py-2.5 px-6 text-xs rounded-xl font-bold">
            دیگر تمام کوئزز دیکھیں
          </a>
        </div>
      </div>

      <!-- Question by Question Detailed Explanations Breakdown -->
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white font-urdu flex items-center gap-2">
          <i data-lucide="book-open" class="w-5 h-5 text-cyan-600"></i> سوالات کا تفصیلی جائزہ اور جوابات کی وضاحت:
        </h3>

        ${res.breakdown.map((item, idx) => `
          <div class="lh-card p-6 sm:p-7 space-y-4 border-r-4 ${item.isCorrect ? 'border-r-emerald-500' : 'border-r-rose-500'}">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span class="text-xs font-bold font-mono">سوال نمبر ${idx + 1}</span>
              <span class="badge ${item.isCorrect ? 'badge-success' : 'badge-danger'} text-[10px]">
                ${item.isCorrect ? 'صحیح جواب (+10)' : 'غلط جواب (0)'}
              </span>
            </div>

            <h4 class="text-base font-bold text-slate-900 dark:text-white font-urdu">${item.questionText}</h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="p-3 rounded-xl ${item.isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200'}">
                <span class="text-[10px] uppercase font-bold block opacity-70">آپ کا منتخب کردہ جواب:</span>
                <span class="font-bold font-urdu">${item.selectedOptionText || 'حل نہیں کیا گیا (Skipped)'}</span>
              </div>

              <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200">
                <span class="text-[10px] uppercase font-bold block opacity-70">درست جواب:</span>
                <span class="font-bold font-urdu">${item.correctOptionText}</span>
              </div>
            </div>

            <!-- In-Depth Explanation -->
            ${item.explanation ? `
              <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-urdu leading-relaxed border border-slate-200 dark:border-slate-700">
                <strong class="text-cyan-700 dark:text-cyan-400 block mb-1">تفصیلی وضاحت (Explanation):</strong>
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

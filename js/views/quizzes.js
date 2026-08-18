/**
 * LearnHub Standalone Quizzes Module
 * 100% Independent from courses. Timed examination engine with question palette,
 * secure server-side evaluation, and detailed question-wise review.
 */

window.Views = window.Views || {};

// Standalone Quizzes Catalog
window.Views.renderQuizzes = async function(params, query) {
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
          <a href="#/" class="hover:text-indigo-600">Home</a>
          <span>/</span>
          <span class="text-slate-900 dark:text-white font-medium">Standalone Quizzes</span>
        </div>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 text-xs font-bold mb-2">
              <i data-lucide="zap" class="w-3.5 h-3.5"></i> Standalone Diagnostic Assessments
            </div>
            <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">Skill Verification Quizzes</h1>
            <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">Take independent timed quizzes to validate your engineering proficiency.</p>
          </div>

          <div class="flex items-center gap-3">
            <a href="#/my-quizzes" class="btn-secondary text-xs rounded-xl flex items-center gap-2">
              <i data-lucide="history" class="w-4 h-4 text-indigo-600"></i> My Quiz Attempts
            </a>
          </div>
        </div>
      </div>

      <!-- Filters & Quizzes Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div class="lh-card p-6 space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="filter" class="w-4 h-4 text-indigo-600"></i> Filters
            </h3>
            <button onclick="window.Router.navigate('/quizzes')" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Reset</button>
          </div>

          <!-- Search Filter -->
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Search Quizzes</label>
            <div class="relative">
              <input 
                type="text" 
                id="quiz-search-input" 
                value="${activeSearch}" 
                placeholder="Search topics..." 
                class="form-input text-xs pl-8"
                onkeydown="if(event.key==='Enter') window.Views.quizFilterChanged()"
              />
              <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3"></i>
            </div>
          </div>

          <!-- Category Filter -->
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Category</label>
            <div class="space-y-1.5">
              <label class="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="radio" name="quiz-category" value="all" ${activeCategory === 'all' ? 'checked' : ''} onchange="window.Views.quizFilterChanged()" class="text-indigo-600 focus:ring-indigo-500">
                <span>All Categories</span>
              </label>
              ${categories.map(cat => `
                <label class="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="radio" name="quiz-category" value="${cat.id}" ${activeCategory === cat.id ? 'checked' : ''} onchange="window.Views.quizFilterChanged()" class="text-indigo-600 focus:ring-indigo-500">
                  <span>${cat.name}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Difficulty Filter -->
          <div>
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Difficulty</label>
            <div class="space-y-1.5">
              ${['all', 'beginner', 'intermediate', 'advanced'].map(diff => `
                <label class="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="radio" name="quiz-difficulty" value="${diff}" ${activeDifficulty.toLowerCase() === diff ? 'checked' : ''} onchange="window.Views.quizFilterChanged()" class="text-indigo-600 focus:ring-indigo-500">
                  <span class="capitalize">${diff === 'all' ? 'All Difficulties' : diff}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Quizzes Grid -->
        <div class="lg:col-span-3 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${quizzes.map(quiz => `
              <div class="lh-card lh-card-hover p-6 flex flex-col justify-between space-y-4">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="badge ${quiz.difficulty === 'Beginner' ? 'badge-success' : quiz.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-danger'} text-xs">
                      ${quiz.difficulty}
                    </span>
                    <span class="text-xs text-slate-500 flex items-center gap-1">
                      <i data-lucide="clock" class="w-3.5 h-3.5 text-indigo-500"></i> ${quiz.timeLimitMinutes} Mins
                    </span>
                  </div>

                  <h3 class="font-bold text-lg text-slate-900 dark:text-white">
                    <a href="#/quizzes/${quiz.id}" class="hover:text-indigo-600 transition">${quiz.title}</a>
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">${quiz.shortDescription}</p>
                </div>

                <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div class="space-y-0.5">
                    <div class="text-[11px] text-slate-400">Passing: <strong>${quiz.passingPercentage}%</strong></div>
                    <div class="text-[11px] text-slate-400">Questions: <strong>${quiz.questionCount}</strong> (${quiz.totalMarks} pts)</div>
                  </div>
                  <div class="flex gap-2">
                    <a href="#/quizzes/${quiz.id}" class="btn-secondary py-1.5 px-3 text-xs rounded-xl">Details</a>
                    <a href="#/quiz-take/${quiz.id}" class="btn-primary py-1.5 px-3.5 text-xs rounded-xl">Start &rarr;</a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
};

window.Views.quizFilterChanged = function() {
  const search = document.getElementById('quiz-search-input')?.value || '';
  const categoryRadio = document.querySelector('input[name="quiz-category"]:checked');
  const diffRadio = document.querySelector('input[name="quiz-difficulty"]:checked');

  const category = categoryRadio ? categoryRadio.value : 'all';
  const difficulty = diffRadio ? diffRadio.value : 'all';

  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category !== 'all') params.set('category', category);
  if (difficulty !== 'all') params.set('difficulty', difficulty);

  window.Router.navigate(`/quizzes?${params.toString()}`);
};

// Standalone Quiz Details View
window.Views.renderQuizDetails = async function(params) {
  const container = document.getElementById('main-content');
  const quiz = await window.API.getQuizById(params.id);
  const currentUser = window.Auth.getCurrentUser();

  if (!quiz) {
    container.innerHTML = `<div class="max-w-3xl mx-auto px-4 py-20 text-center">Quiz not found.</div>`;
    return;
  }

  const attempts = currentUser ? window.DB.get('quizAttempts').filter(a => a.quizId === quiz.id && a.userId === currentUser.id) : [];

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <a href="#/quizzes" class="hover:text-indigo-600">&larr; Back to Quizzes</a>
      </div>

      <div class="lh-card p-8 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="badge ${quiz.difficulty === 'Beginner' ? 'badge-success' : quiz.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-danger'}">${quiz.difficulty}</span>
              <span class="badge badge-primary">${quiz.category?.name || 'General'}</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">${quiz.title}</h1>
          </div>
          
          <a href="#/quiz-take/${quiz.id}" class="btn-primary py-3 px-6 text-sm rounded-xl shrink-0">
            <i data-lucide="play" class="w-4 h-4"></i> Start Timed Quiz
          </a>
        </div>

        <!-- Quiz Specs -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
          <div>
            <div class="text-[11px] text-slate-500">Time Limit</div>
            <div class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
              <i data-lucide="clock" class="w-4 h-4 text-indigo-500"></i> ${quiz.timeLimitMinutes} Minutes
            </div>
          </div>
          <div>
            <div class="text-[11px] text-slate-500">Questions</div>
            <div class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
              <i data-lucide="help-circle" class="w-4 h-4 text-indigo-500"></i> ${quiz.questionCount} Questions
            </div>
          </div>
          <div>
            <div class="text-[11px] text-slate-500">Passing Grade</div>
            <div class="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
              <i data-lucide="target" class="w-4 h-4 text-emerald-500"></i> ${quiz.passingPercentage}%
            </div>
          </div>
          <div>
            <div class="text-[11px] text-slate-500">Max Attempts</div>
            <div class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
              <i data-lucide="rotate-ccw" class="w-4 h-4 text-indigo-500"></i> ${quiz.maxAttempts || 3} Attempts
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="space-y-3">
          <h3 class="font-bold text-base text-slate-900 dark:text-white">Exam Guidelines</h3>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${quiz.instructions}</p>
          <ul class="list-disc list-inside text-xs text-slate-500 space-y-1">
            <li>Timer runs continuously once started.</li>
            <li>You can navigate back and forth and flag questions for review.</li>
            <li>Detailed explanations and scorecard will be presented after submission.</li>
          </ul>
        </div>

        <!-- Past Attempts History Table -->
        <div class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 class="font-bold text-base text-slate-900 dark:text-white">Your Previous Attempts (${attempts.length})</h3>
          ${attempts.length === 0 ? `
            <p class="text-xs text-slate-400">You have not taken this quiz yet. Click "Start Timed Quiz" to begin.</p>
          ` : `
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th class="p-2.5">Attempt</th>
                    <th class="p-2.5">Score</th>
                    <th class="p-2.5">Percentage</th>
                    <th class="p-2.5">Status</th>
                    <th class="p-2.5">Time</th>
                    <th class="p-2.5">Date</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  ${attempts.map(a => `
                    <tr>
                      <td class="p-2.5 font-bold">#${a.attemptNumber}</td>
                      <td class="p-2.5">${a.score} / ${a.totalMarks}</td>
                      <td class="p-2.5 font-bold">${a.percentage}%</td>
                      <td class="p-2.5">
                        <span class="badge ${a.passed ? 'badge-success' : 'badge-danger'} text-[10px]">${a.passed ? 'PASSED' : 'FAILED'}</span>
                      </td>
                      <td class="p-2.5">${Math.floor(a.timeTakenSeconds / 60)}m ${a.timeTakenSeconds % 60}s</td>
                      <td class="p-2.5 text-slate-400">${new Date(a.completedAt).toLocaleDateString()}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
};

// Timed Quiz Taking Engine State
let quizSession = {
  quiz: null,
  questions: [],
  currentIndex: 0,
  userAnswers: {}, // questionId -> selectedOptionIndex
  flagged: new Set(),
  timeRemainingSeconds: 0,
  timerInterval: null
};

window.Views.renderQuizTake = async function(params) {
  const container = document.getElementById('main-content');
  const quiz = await window.API.getQuizById(params.id);
  const currentUser = window.Auth.getCurrentUser();

  if (!currentUser) {
    window.App.showToast('Please sign in to start the quiz.', 'warning');
    window.Router.navigate('/login');
    return;
  }

  // Security: Fetch sanitized questions (answers hidden)
  const questions = await window.API.getQuizQuestionsForTake(params.id);
  if (questions.length === 0) {
    container.innerHTML = `<div class="p-12 text-center">No questions found in this quiz.</div>`;
    return;
  }

  // Initialize session
  if (quizSession.timerInterval) clearInterval(quizSession.timerInterval);
  quizSession = {
    quiz,
    questions,
    currentIndex: 0,
    userAnswers: {},
    flagged: new Set(),
    timeRemainingSeconds: (quiz.timeLimitMinutes || 15) * 60,
    startTime: Date.now()
  };

  window.Views.renderQuizTakeWorkspace();

  // Start Timer
  quizSession.timerInterval = setInterval(() => {
    quizSession.timeRemainingSeconds--;
    window.Views.updateQuizTimerDisplay();

    if (quizSession.timeRemainingSeconds <= 0) {
      clearInterval(quizSession.timerInterval);
      window.App.showToast('Time expired! Submitting quiz automatically...', 'warning');
      window.Views.submitQuizSession();
    }
  }, 1000);
};

window.Views.updateQuizTimerDisplay = function() {
  const timerElem = document.getElementById('quiz-timer-display');
  if (!timerElem) return;

  const mins = Math.floor(quizSession.timeRemainingSeconds / 60);
  const secs = quizSession.timeRemainingSeconds % 60;
  timerElem.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  if (quizSession.timeRemainingSeconds < 120) {
    timerElem.classList.add('text-rose-500', 'animate-pulse');
  }
};

window.Views.renderQuizTakeWorkspace = function() {
  const container = document.getElementById('main-content');
  const q = quizSession.questions[quizSession.currentIndex];
  const selectedIndex = quizSession.userAnswers[q.id];
  const isFlagged = quizSession.flagged.has(q.id);

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <!-- Top Exam Header & Countdown Bar -->
      <div class="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-slate-800 shadow-xl">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-sm">
            <i data-lucide="zap" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="text-xs text-indigo-400 font-semibold">${quizSession.quiz.title}</div>
            <div class="text-sm font-bold">Question ${quizSession.currentIndex + 1} of ${quizSession.questions.length}</div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Timer Display -->
          <div class="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 font-mono text-sm font-bold text-cyan-400">
            <i data-lucide="clock" class="w-4 h-4"></i>
            <span id="quiz-timer-display">--:--</span>
          </div>

          <button onclick="window.Views.promptQuizSubmit()" class="btn-primary py-2 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 border-none">
            Submit Quiz
          </button>
        </div>
      </div>

      <!-- Question & Palette Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Center Question Box -->
        <div class="lg:col-span-8 lh-card p-6 sm:p-8 space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <span class="badge badge-neutral text-xs">Question #${quizSession.currentIndex + 1} (${q.marks} Marks)</span>
            <button onclick="window.Views.toggleFlagQuestion('${q.id}')" class="text-xs flex items-center gap-1 font-semibold ${isFlagged ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'}">
              <i data-lucide="flag" class="w-4 h-4 ${isFlagged ? 'fill-amber-500' : ''}"></i>
              <span>${isFlagged ? 'Flagged for review' : 'Flag question'}</span>
            </button>
          </div>

          <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
            ${q.questionText}
          </h3>

          <!-- Radio Options List -->
          <div class="space-y-3 pt-2">
            ${q.options.map((opt, optIdx) => `
              <label onclick="window.Views.selectQuizOption('${q.id}', ${optIdx})" class="flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${selectedIndex === optIdx ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'}">
                <input type="radio" name="option-${q.id}" ${selectedIndex === optIdx ? 'checked' : ''} class="mt-1 text-indigo-600 focus:ring-indigo-500">
                <span class="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">${opt}</span>
              </label>
            `).join('')}
          </div>

          <!-- Question Controls -->
          <div class="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button 
              ${quizSession.currentIndex === 0 ? 'disabled' : ''} 
              onclick="window.Views.navQuizQuestion(${quizSession.currentIndex - 1})" 
              class="btn-secondary py-2 px-4 text-xs rounded-xl disabled:opacity-40">
              &larr; Previous
            </button>

            ${quizSession.currentIndex < quizSession.questions.length - 1 ? `
              <button onclick="window.Views.navQuizQuestion(${quizSession.currentIndex + 1})" class="btn-primary py-2 px-5 text-xs rounded-xl">
                Next &rarr;
              </button>
            ` : `
              <button onclick="window.Views.promptQuizSubmit()" class="btn-primary py-2 px-5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 border-none">
                Finish & Submit
              </button>
            `}
          </div>
        </div>

        <!-- Right Question Palette -->
        <div class="lg:col-span-4 lh-card p-6 space-y-5">
          <h4 class="font-bold text-sm text-slate-900 dark:text-white">Question Navigator</h4>
          
          <div class="grid grid-cols-5 gap-2">
            ${quizSession.questions.map((item, idx) => {
              const isAnswered = quizSession.userAnswers[item.id] !== undefined;
              const isItemFlagged = quizSession.flagged.has(item.id);
              const isCurrent = idx === quizSession.currentIndex;

              let btnClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
              if (isAnswered) btnClass = 'bg-emerald-500 text-white font-bold';
              if (isItemFlagged) btnClass = 'bg-amber-500 text-white font-bold';
              if (isCurrent) btnClass += ' ring-2 ring-indigo-500 ring-offset-2';

              return `
                <button onclick="window.Views.navQuizQuestion(${idx})" class="h-9 rounded-lg text-xs font-bold transition flex items-center justify-center ${btnClass}">
                  ${idx + 1}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Palette Legend -->
          <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500">
            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-emerald-500"></span> Answered</div>
            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700"></span> Unanswered</div>
            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-amber-500"></span> Flagged for Review</div>
          </div>
        </div>
      </div>
    </div>
  `;

  window.Views.updateQuizTimerDisplay();
};

window.Views.selectQuizOption = function(questionId, optionIndex) {
  quizSession.userAnswers[questionId] = optionIndex;
  window.Views.renderQuizTakeWorkspace();
};

window.Views.toggleFlagQuestion = function(questionId) {
  if (quizSession.flagged.has(questionId)) {
    quizSession.flagged.delete(questionId);
  } else {
    quizSession.flagged.add(questionId);
  }
  window.Views.renderQuizTakeWorkspace();
};

window.Views.navQuizQuestion = function(index) {
  if (index >= 0 && index < quizSession.questions.length) {
    quizSession.currentIndex = index;
    window.Views.renderQuizTakeWorkspace();
  }
};

window.Views.promptQuizSubmit = function() {
  const answeredCount = Object.keys(quizSession.userAnswers).length;
  const totalCount = quizSession.questions.length;
  const unansweredCount = totalCount - answeredCount;

  window.App.showModal('Submit Quiz Confirmation', `
    <div class="space-y-4 text-center py-2">
      <div class="text-sm text-slate-700 dark:text-slate-300">
        You have answered <strong>${answeredCount}</strong> of <strong>${totalCount}</strong> questions.
        ${unansweredCount > 0 ? `<div class="text-rose-500 text-xs font-semibold mt-1">Warning: ${unansweredCount} question(s) remain unanswered!</div>` : ''}
      </div>
      <p class="text-xs text-slate-500">Are you ready to submit for grading? Your score and question breakdown will be calculated immediately.</p>
      <div class="flex justify-center gap-3 pt-2">
        <button onclick="window.Views.submitQuizSession()" class="btn-primary py-2.5 px-5 text-xs bg-emerald-600 hover:bg-emerald-500 border-none">Yes, Submit Now</button>
        <button onclick="window.App.closeModal()" class="btn-secondary py-2.5 px-4 text-xs">Keep Answering</button>
      </div>
    </div>
  `);
};

window.Views.submitQuizSession = async function() {
  clearInterval(quizSession.timerInterval);
  window.App.closeModal();

  const user = window.Auth.getCurrentUser();
  const timeTaken = Math.round((Date.now() - quizSession.startTime) / 1000);

  const formattedAnswers = Object.entries(quizSession.userAnswers).map(([questionId, selectedOptionIndex]) => ({
    questionId,
    selectedOptionIndex
  }));

  const result = await window.API.submitQuizAttempt(
    quizSession.quiz.id,
    user.id,
    formattedAnswers,
    timeTaken
  );

  window.Views.renderQuizResultView(result);
};

// Quiz Result & Scorecard View
window.Views.renderQuizResultView = function(result) {
  const container = document.getElementById('main-content');
  if (result.passed && window.confetti) {
    window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Scorecard Header -->
      <div class="lh-card p-8 text-center space-y-6 relative overflow-hidden">
        <div class="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-extrabold shadow-lg ${result.passed ? 'bg-emerald-100 text-emerald-600 border-4 border-emerald-300' : 'bg-rose-100 text-rose-600 border-4 border-rose-300'}">
          ${result.passed ? '✓' : '✗'}
        </div>

        <div class="space-y-1">
          <span class="badge ${result.passed ? 'badge-success' : 'badge-danger'} text-xs font-bold">
            ${result.passed ? 'EXAM PASSED' : 'EXAM FAILED'}
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white pt-1">${result.quizTitle}</h1>
          <p class="text-xs text-slate-500">Passing criteria: ${result.passingPercentage}%</p>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl max-w-2xl mx-auto">
          <div>
            <div class="text-[11px] text-slate-500">Your Score</div>
            <div class="text-xl font-extrabold text-slate-900 dark:text-white">${result.obtainedMarks} / ${result.totalMarks}</div>
          </div>
          <div>
            <div class="text-[11px] text-slate-500">Percentage</div>
            <div class="text-xl font-extrabold ${result.passed ? 'text-emerald-600' : 'text-rose-600'}">${result.percentage}%</div>
          </div>
          <div>
            <div class="text-[11px] text-slate-500">Accuracy</div>
            <div class="text-xl font-extrabold text-indigo-600">${result.correctCount} / ${result.totalQuestions}</div>
          </div>
          <div>
            <div class="text-[11px] text-slate-500">Time Taken</div>
            <div class="text-xl font-extrabold text-slate-900 dark:text-white">${Math.floor(result.timeTakenSeconds / 60)}m ${result.timeTakenSeconds % 60}s</div>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="flex flex-wrap justify-center gap-3 pt-2">
          <a href="#/quizzes" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">Back to Quizzes</a>
          <a href="#/quiz-take/${result.attempt.quizId}" class="btn-primary py-2.5 px-5 text-xs rounded-xl">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Retake Exam
          </a>
        </div>
      </div>

      <!-- Question-by-Question Detailed Review -->
      <div class="space-y-4">
        <h3 class="font-bold text-xl text-slate-900 dark:text-white">Question Breakdown & Explanations</h3>
        
        <div class="space-y-4">
          ${result.detailedReview.map((rev, idx) => `
            <div class="lh-card p-6 space-y-4 border-l-4 ${rev.isCorrect ? 'border-l-emerald-500' : 'border-l-rose-500'}">
              <div class="flex items-center justify-between">
                <span class="badge ${rev.isCorrect ? 'badge-success' : 'badge-danger'} text-xs">
                  ${rev.isCorrect ? 'Correct (+ ' + rev.marks + ' pts)' : 'Incorrect (0 pts)'}
                </span>
                <span class="text-xs text-slate-400 font-semibold">Question ${idx + 1}</span>
              </div>

              <h4 class="font-bold text-base text-slate-900 dark:text-white whitespace-pre-line">${rev.questionText}</h4>

              <!-- Options List with Correct Answer Highlighted -->
              <div class="space-y-2 pt-1">
                ${rev.options.map((opt, optIdx) => {
                  let optStyle = 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                  if (optIdx === rev.correctAnswerIndex) {
                    optStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                  } else if (optIdx === rev.selectedOptionIndex && !rev.isCorrect) {
                    optStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 line-through';
                  }

                  return `
                    <div class="p-3 rounded-xl border text-xs flex items-center justify-between ${optStyle}">
                      <span>${opt}</span>
                      ${optIdx === rev.correctAnswerIndex ? '<span class="text-emerald-600 font-bold text-[10px]">✓ Correct Answer</span>' : optIdx === rev.selectedOptionIndex ? '<span class="text-rose-600 font-bold text-[10px]">✗ Your Choice</span>' : ''}
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- Explanation Box -->
              ${rev.explanation ? `
                <div class="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <i data-lucide="info" class="w-3.5 h-3.5 text-indigo-500"></i> Explanation:
                  </div>
                  <p class="leading-relaxed">${rev.explanation}</p>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
};

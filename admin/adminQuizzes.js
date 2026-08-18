/**
 * LearnHub Admin Standalone Quizzes & Question Management Views
 * Completely independent from courses.
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderQuizzes = async function() {
  const container = document.getElementById('main-content');
  const quizzes = await window.API.getQuizzes({ includeAllStatus: true });

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-1">
            <i data-lucide="zap" class="w-3.5 h-3.5"></i> Standalone Assessment Engine
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">Standalone Skill Quizzes</h1>
          <p class="text-xs text-slate-500">Manage independent diagnostic exams, timed question banks, and analytics.</p>
        </div>
        <button onclick="window.Views.admin.openQuizBuilderModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-cyan-600 hover:bg-cyan-500 border-none">
          <i data-lucide="plus-circle" class="w-4 h-4"></i> Create Standalone Quiz
        </button>
      </div>

      <!-- Quizzes Table -->
      <div class="lh-card overflow-hidden">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <input 
            type="text" 
            placeholder="Search quizzes..." 
            class="form-input text-xs max-w-xs"
            oninput="window.Views.admin.filterQuizTable(this.value)"
          />
          <span class="text-xs text-slate-400">Total Quizzes: <strong>${quizzes.length}</strong></span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs" id="admin-quizzes-table">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
              <tr>
                <th class="p-3">Quiz Title</th>
                <th class="p-3">Category</th>
                <th class="p-3">Difficulty</th>
                <th class="p-3">Time Limit</th>
                <th class="p-3">Questions</th>
                <th class="p-3">Pass Rate</th>
                <th class="p-3">Status</th>
                <th class="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${quizzes.map(quiz => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td class="p-3 font-bold text-slate-900 dark:text-white">
                    ${quiz.title}
                  </td>
                  <td class="p-3">
                    <span class="badge badge-neutral text-[10px]">${quiz.category?.name || 'Technology'}</span>
                  </td>
                  <td class="p-3">
                    <span class="badge ${quiz.difficulty === 'Beginner' ? 'badge-success' : quiz.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-danger'} text-[10px]">
                      ${quiz.difficulty}
                    </span>
                  </td>
                  <td class="p-3 font-mono">${quiz.timeLimitMinutes} mins</td>
                  <td class="p-3 font-bold">${quiz.questionCount} (${quiz.totalMarks} pts)</td>
                  <td class="p-3">
                    <span class="text-emerald-600 font-bold">${quiz.passRate || 80}%</span>
                    <span class="text-[10px] text-slate-400">(${quiz.participantsCount || 0})</span>
                  </td>
                  <td class="p-3">
                    <button onclick="window.Views.admin.toggleQuizStatus('${quiz.id}')" class="badge ${quiz.status === 'published' ? 'badge-success' : 'badge-warning'} cursor-pointer text-[10px] uppercase">
                      ${quiz.status}
                    </button>
                  </td>
                  <td class="p-3 text-right space-x-1 whitespace-nowrap">
                    <button onclick="window.Views.admin.openManageQuestionsModal('${quiz.id}')" class="btn-secondary py-1 px-2.5 text-[11px] rounded-lg text-cyan-600 border-cyan-200">
                      <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> Questions
                    </button>
                    <button onclick="window.Views.admin.openQuizAnalyticsModal('${quiz.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg" title="Analytics">
                      <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="window.Views.admin.openQuizBuilderModal('${quiz.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg" title="Edit Quiz">
                      <i data-lucide="edit" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="window.Views.admin.deleteQuiz('${quiz.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg text-rose-600 hover:bg-rose-50" title="Delete">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

window.Views.admin.filterQuizTable = function(query) {
  const q = query.toLowerCase();
  const rows = document.querySelectorAll('#admin-quizzes-table tbody tr');
  rows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
};

window.Views.admin.openQuizBuilderModal = function(quizId = null) {
  const quiz = quizId ? window.DB.findById('quizzes', quizId) : null;
  const categories = window.DB.get('categories');

  window.App.showModal(quiz ? 'Edit Standalone Quiz' : 'Create Standalone Quiz', `
    <form onsubmit="window.Views.admin.saveQuizForm(event, '${quizId || ''}')" class="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Quiz Title</label>
        <input type="text" id="qb-title" value="${quiz ? quiz.title : ''}" required class="form-input text-xs">
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
          <select id="qb-category" class="form-input text-xs">
            ${categories.map(c => `
              <option value="${c.id}" ${quiz && quiz.categoryId === c.id ? 'selected' : ''}>${c.name}</option>
            `).join('')}
          </select>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Difficulty</label>
          <select id="qb-difficulty" class="form-input text-xs">
            <option value="Beginner" ${quiz && quiz.difficulty === 'Beginner' ? 'selected' : ''}>Beginner</option>
            <option value="Intermediate" ${quiz && quiz.difficulty === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
            <option value="Advanced" ${quiz && quiz.difficulty === 'Advanced' ? 'selected' : ''}>Advanced</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Time Limit (Mins)</label>
          <input type="number" id="qb-timelimit" value="${quiz ? quiz.timeLimitMinutes : '15'}" required class="form-input text-xs">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Passing %</label>
          <input type="number" id="qb-passpercent" value="${quiz ? quiz.passingPercentage : '75'}" required class="form-input text-xs">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Max Retakes</label>
          <input type="number" id="qb-maxattempts" value="${quiz ? (quiz.maxAttempts || '5') : '5'}" required class="form-input text-xs">
        </div>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Short Description</label>
        <input type="text" id="qb-short-desc" value="${quiz ? quiz.shortDescription : ''}" required class="form-input text-xs">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Exam Instructions</label>
        <textarea id="qb-instructions" rows="3" required class="form-input text-xs">${quiz ? quiz.instructions : 'Answer all questions within the allocated time limit.'}</textarea>
      </div>

      <div class="space-y-2 pt-2">
        <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" id="qb-rand-q" ${quiz && quiz.randomizeQuestions ? 'checked' : ''} class="rounded text-cyan-600">
          <span>Randomize Questions Order for each participant</span>
        </label>
        <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" id="qb-rand-opt" ${quiz && quiz.randomizeOptions ? 'checked' : ''} class="rounded text-cyan-600">
          <span>Randomize Answer Choices for each question</span>
        </label>
        <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" id="qb-publish" ${!quiz || quiz.status === 'published' ? 'checked' : ''} class="rounded text-cyan-600">
          <span>Publish Quiz Immediately</span>
        </label>
      </div>

      <button type="submit" class="btn-primary w-full py-2.5 text-xs rounded-xl bg-cyan-600 hover:bg-cyan-500 border-none">Save Standalone Quiz</button>
    </form>
  `);
};

window.Views.admin.saveQuizForm = function(e, quizId) {
  e.preventDefault();
  const title = document.getElementById('qb-title').value;
  const categoryId = document.getElementById('qb-category').value;
  const difficulty = document.getElementById('qb-difficulty').value;
  const timeLimitMinutes = parseInt(document.getElementById('qb-timelimit').value, 10) || 15;
  const passingPercentage = parseInt(document.getElementById('qb-passpercent').value, 10) || 75;
  const maxAttempts = parseInt(document.getElementById('qb-maxattempts').value, 10) || 5;
  const shortDescription = document.getElementById('qb-short-desc').value;
  const instructions = document.getElementById('qb-instructions').value;
  const randomizeQuestions = document.getElementById('qb-rand-q').checked;
  const randomizeOptions = document.getElementById('qb-rand-opt').checked;
  const status = document.getElementById('qb-publish').checked ? 'published' : 'draft';

  const quizData = {
    id: quizId || undefined,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    categoryId,
    difficulty,
    timeLimitMinutes,
    passingPercentage,
    maxAttempts,
    shortDescription,
    instructions,
    randomizeQuestions,
    randomizeOptions,
    status,
    participantsCount: 0,
    passRate: 100,
    averageScore: 100
  };

  if (quizId) {
    window.DB.update('quizzes', quizId, quizData);
    window.App.showToast('Quiz updated!', 'success');
  } else {
    window.DB.insert('quizzes', quizData);
    window.App.showToast('Standalone Quiz created!', 'success');
  }

  window.App.closeModal();
  window.Router.handleRouting();
};

window.Views.admin.toggleQuizStatus = function(quizId) {
  const quiz = window.DB.findById('quizzes', quizId);
  if (!quiz) return;

  const newStatus = quiz.status === 'published' ? 'draft' : 'published';
  window.DB.update('quizzes', quizId, { status: newStatus });
  window.App.showToast(`Quiz status updated to ${newStatus}.`, 'info');
  window.Router.handleRouting();
};

window.Views.admin.deleteQuiz = function(quizId) {
  if (confirm('Delete this standalone quiz and its questions?')) {
    window.DB.delete('quizzes', quizId);
    const questions = window.DB.get('quizQuestions').filter(q => q.quizId === quizId);
    questions.forEach(q => window.DB.delete('quizQuestions', q.id));
    window.App.showToast('Quiz deleted.', 'info');
    window.Router.handleRouting();
  }
};

// Question Management Modal
window.Views.admin.openManageQuestionsModal = function(quizId) {
  const quiz = window.DB.findById('quizzes', quizId);
  const questions = window.DB.get('quizQuestions').filter(q => q.quizId === quizId).sort((a, b) => a.order - b.order);

  window.App.showModal(`Questions Bank: ${quiz.title}`, `
    <div class="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
      <div class="flex items-center justify-between">
        <span class="text-xs text-slate-500">Total Questions: <strong>${questions.length}</strong></span>
        <button onclick="window.Views.admin.openAddQuestionForm('${quizId}')" class="btn-primary py-1.5 px-3 text-xs rounded-lg bg-cyan-600 hover:bg-cyan-500 border-none">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add Question
        </button>
      </div>

      <div class="space-y-3">
        ${questions.length === 0 ? `
          <p class="text-xs text-slate-400 py-4 text-center">No questions added yet. Click "Add Question" to build your exam bank.</p>
        ` : questions.map((q, idx) => `
          <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div class="flex items-center justify-between">
              <span class="badge badge-neutral text-[10px]">#${idx + 1} (${q.marks} pts) • ${q.type}</span>
              <button onclick="window.Views.admin.deleteQuestion('${quizId}', '${q.id}')" class="text-rose-500 hover:text-rose-700 text-xs">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>

            <div class="text-xs font-bold text-slate-900 dark:text-white whitespace-pre-line">${q.questionText}</div>

            <div class="space-y-1 pt-1 text-[11px]">
              ${q.options.map((opt, optIdx) => `
                <div class="flex items-center gap-2 ${optIdx === q.correctAnswerIndex ? 'text-emerald-600 font-bold' : 'text-slate-500'}">
                  <span>${optIdx === q.correctAnswerIndex ? '✓' : '•'}</span>
                  <span>${opt}</span>
                </div>
              `).join('')}
            </div>

            ${q.explanation ? `
              <div class="text-[10px] text-slate-400 italic pt-1">Explanation: ${q.explanation}</div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `);
};

window.Views.admin.openAddQuestionForm = function(quizId) {
  window.App.showModal('Add Question to Bank', `
    <form onsubmit="window.Views.admin.saveNewQuestion(event, '${quizId}')" class="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Question Type</label>
        <select id="qq-type" class="form-input text-xs" onchange="window.Views.admin.onQuestionTypeChange(this.value)">
          <option value="multiple_choice">Multiple Choice (4 Options)</option>
          <option value="true_false">True / False</option>
        </select>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Question Prompt</label>
        <textarea id="qq-text" rows="3" required placeholder="Type the question prompt..." class="form-input text-xs"></textarea>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Marks / Points</label>
        <input type="number" id="qq-marks" value="10" required class="form-input text-xs">
      </div>

      <!-- Options Container -->
      <div id="qq-options-container" class="space-y-2">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block">Options (Select radio for Correct Answer)</label>
        <div class="flex items-center gap-2">
          <input type="radio" name="qq-correct" value="0" checked class="text-cyan-600">
          <input type="text" id="qq-opt-0" required placeholder="Option 1" class="form-input text-xs">
        </div>
        <div class="flex items-center gap-2">
          <input type="radio" name="qq-correct" value="1" class="text-cyan-600">
          <input type="text" id="qq-opt-1" required placeholder="Option 2" class="form-input text-xs">
        </div>
        <div class="flex items-center gap-2" id="qq-opt-wrap-2">
          <input type="radio" name="qq-correct" value="2" class="text-cyan-600">
          <input type="text" id="qq-opt-2" placeholder="Option 3" class="form-input text-xs">
        </div>
        <div class="flex items-center gap-2" id="qq-opt-wrap-3">
          <input type="radio" name="qq-correct" value="3" class="text-cyan-600">
          <input type="text" id="qq-opt-3" placeholder="Option 4" class="form-input text-xs">
        </div>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Answer Explanation</label>
        <textarea id="qq-explanation" rows="2" placeholder="Detailed explanation shown during post-submission review..." class="form-input text-xs"></textarea>
      </div>

      <button type="submit" class="btn-primary w-full py-2.5 text-xs rounded-xl bg-cyan-600 hover:bg-cyan-500 border-none">Save Question</button>
    </form>
  `);
};

window.Views.admin.onQuestionTypeChange = function(type) {
  const opt0 = document.getElementById('qq-opt-0');
  const opt1 = document.getElementById('qq-opt-1');
  const wrap2 = document.getElementById('qq-opt-wrap-2');
  const wrap3 = document.getElementById('qq-opt-wrap-3');

  if (type === 'true_false') {
    if (opt0) opt0.value = 'True';
    if (opt1) opt1.value = 'False';
    if (wrap2) wrap2.style.display = 'none';
    if (wrap3) wrap3.style.display = 'none';
  } else {
    if (wrap2) wrap2.style.display = 'flex';
    if (wrap3) wrap3.style.display = 'flex';
  }
};

window.Views.admin.saveNewQuestion = function(e, quizId) {
  e.preventDefault();
  const type = document.getElementById('qq-type').value;
  const questionText = document.getElementById('qq-text').value;
  const marks = parseInt(document.getElementById('qq-marks').value, 10) || 10;
  const explanation = document.getElementById('qq-explanation').value;
  const correctRadio = document.querySelector('input[name="qq-correct"]:checked');
  const correctAnswerIndex = correctRadio ? parseInt(correctRadio.value, 10) : 0;

  let options = [];
  if (type === 'true_false') {
    options = ['True', 'False'];
  } else {
    options = [
      document.getElementById('qq-opt-0')?.value || '',
      document.getElementById('qq-opt-1')?.value || '',
      document.getElementById('qq-opt-2')?.value || '',
      document.getElementById('qq-opt-3')?.value || ''
    ].filter(Boolean);
  }

  const existingQuestions = window.DB.get('quizQuestions').filter(q => q.quizId === quizId);
  const newOrder = existingQuestions.length + 1;

  window.DB.insert('quizQuestions', {
    quizId,
    order: newOrder,
    type,
    marks,
    questionText,
    options,
    correctAnswerIndex,
    explanation
  });

  window.App.showToast('Question added!', 'success');
  window.Views.admin.openManageQuestionsModal(quizId);
};

window.Views.admin.deleteQuestion = function(quizId, questionId) {
  if (confirm('Delete this question?')) {
    window.DB.delete('quizQuestions', questionId);
    window.App.showToast('Question deleted.', 'info');
    window.Views.admin.openManageQuestionsModal(quizId);
  }
};

// Quiz Analytics Modal (Requirement #15)
window.Views.admin.openQuizAnalyticsModal = function(quizId) {
  const quiz = window.DB.findById('quizzes', quizId);
  const attempts = window.DB.get('quizAttempts').filter(a => a.quizId === quizId);

  window.App.showModal(`Quiz Telemetry: ${quiz.title}`, `
    <div class="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div class="text-[11px] text-slate-500">Total Attempts</div>
          <div class="text-xl font-bold">${attempts.length}</div>
        </div>
        <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div class="text-[11px] text-slate-500">Pass Rate</div>
          <div class="text-xl font-bold text-emerald-600">${quiz.passRate || 80}%</div>
        </div>
        <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div class="text-[11px] text-slate-500">Avg Score</div>
          <div class="text-xl font-bold text-cyan-600">${quiz.averageScore || 85}%</div>
        </div>
      </div>

      <div class="space-y-3">
        <h4 class="font-bold text-xs text-slate-400 uppercase">User Attempt Log</h4>
        ${attempts.length === 0 ? `
          <p class="text-xs text-slate-400">No participants recorded yet.</p>
        ` : attempts.map(a => {
          const u = window.DB.findById('users', a.userId);
          return `
            <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs">
              <div>
                <div class="font-bold text-slate-900 dark:text-white">${u ? u.name : 'Learner'}</div>
                <div class="text-[10px] text-slate-400">Time: ${Math.floor(a.timeTakenSeconds/60)}m ${a.timeTakenSeconds%60}s • ${new Date(a.completedAt).toLocaleDateString()}</div>
              </div>
              <div class="text-right">
                <div class="font-bold">${a.percentage}%</div>
                <span class="badge ${a.passed ? 'badge-success' : 'badge-danger'} text-[9px]">${a.passed ? 'PASSED' : 'FAILED'}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `);
};

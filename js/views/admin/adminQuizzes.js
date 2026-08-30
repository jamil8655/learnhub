/**
 * LearnHub Admin Standalone Quizzes & Question Management Views
 * With Google Gemini AI Question Generation Studio
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderQuizzes = async function() {
  const container = document.getElementById('main-content');
  const quizzes = await window.API.getQuizzes({ includeAllStatus: true });
  const allAttempts = window.DB.get('quizAttempts') || [];
  const allQuestions = window.DB.get('quizQuestions') || [];

  container.innerHTML = `
    <div class="space-y-5 font-urdu max-w-7xl mx-auto px-3 sm:px-6 py-4 select-none" dir="rtl">
      
      ${window.Views.admin.renderAdminNav('quizzes')}

      <!-- Executive Hero Header -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 rounded-3xl text-slate-900 dark:text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-600/30 text-[10px] font-bold">
            <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-600"></i>
            <span>امتحانات و آن لائن کوئزز انجن</span>
          </div>
          <h1 class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
            امتحانات و آن لائن کوئزز کنٹرول
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            سوالات کے بینکس، ٹائمرز، پاسنگ اسکور اور طلباء کی تفصیلی کارکردگی کا جائزہ۔
          </p>
        </div>

        <button onclick="window.Views.admin.openQuizBuilderModal()" class="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0 transition active:scale-95">
          <i data-lucide="plus-circle" class="w-4 h-4"></i>
          <span>نیا کوئز بنائیں</span>
        </button>
      </div>

      <!-- Quizzes Table -->
      <div class="lh-card overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <input 
            type="text" 
            placeholder="کوئز کا عنوان یا کیٹیگری تلاش کریں..." 
            class="form-input text-xs max-w-xs font-urdu text-right"
            oninput="window.Views.admin.filterQuizTable(this.value)"
          />
          <span class="text-xs text-slate-400">کل کوئزز: <strong class="text-slate-900 dark:text-white font-mono">${quizzes.length}</strong></span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs" id="admin-quizzes-table">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
              <tr>
                <th class="p-3.5">کوئز کا عنوان</th>
                <th class="p-3.5">شعبہ / کیٹیگری</th>
                <th class="p-3.5">درجہ / سختی</th>
                <th class="p-3.5">وقت کی حد</th>
                <th class="p-3.5">کل سوالات و نمبرات</th>
                <th class="p-3.5">شرحِ کامیابی (Pass Rate)</th>
                <th class="p-3.5">اسٹیٹس</th>
                <th class="p-3.5 text-left">اختیارات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${quizzes.length === 0 ? `
                <tr>
                  <td colspan="8" class="p-8 text-center text-slate-400">کوئی کوئز موجود نہیں ہے۔ نیا کوئز بنانے کے لیے بٹن دبائیں۔</td>
                </tr>
              ` : quizzes.map(quiz => {
                const qAttempts = allAttempts.filter(a => a.quizId === quiz.id);
                const passedCount = qAttempts.filter(a => a.passed).length;
                const livePassRate = qAttempts.length ? Math.round((passedCount / qAttempts.length) * 100) : 100;
                const questions = allQuestions.filter(q => q.quizId === quiz.id);
                const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 10), 0);

                return `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td class="p-3.5 font-bold text-slate-900 dark:text-white">
                      ${quiz.title}
                    </td>
                    <td class="p-3.5">
                      <span class="badge badge-neutral text-[10px] font-bold">${quiz.category?.name || 'اسلامی علوم'}</span>
                    </td>
                    <td class="p-3.5">
                      <span class="badge ${quiz.difficulty === 'Beginner' ? 'badge-success' : quiz.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-danger'} text-[10px] font-bold">
                        ${quiz.difficulty}
                      </span>
                    </td>
                    <td class="p-3.5 font-mono">${quiz.timeLimitMinutes} منٹ</td>
                    <td class="p-3.5 font-bold font-mono">${questions.length} سوالات (${totalMarks} نمبر)</td>
                    <td class="p-3.5">
                      <span class="text-teal-700 dark:text-teal-400 font-bold font-mono">${livePassRate}%</span>
                      <span class="text-[10px] text-slate-400 font-mono">(${qAttempts.length} طلباء)</span>
                    </td>
                    <td class="p-3.5">
                      <button onclick="window.Views.admin.toggleQuizStatus('${quiz.id}')" class="badge ${quiz.status === 'published' ? 'badge-success' : 'badge-warning'} cursor-pointer text-[10px] uppercase font-bold" title="اسٹیٹس تبدیل کرنے کے لیے کلک کریں">
                        ${quiz.status || 'draft'}
                      </button>
                    </td>
                    <td class="p-3.5 text-left space-x-1 whitespace-nowrap" dir="ltr">
                      <button onclick="window.Views.admin.openManageQuestionsModal('${quiz.id}')" class="btn-secondary py-1 px-2.5 text-[11px] rounded-lg text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-800 font-bold" title="سوالات کا بینک">
                        <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> سوالات (${questions.length})
                      </button>
                      <button onclick="window.Views.admin.openQuizAnalyticsModal('${quiz.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg" title="شماریات و اینالیٹکس">
                        <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="window.Views.admin.openQuizBuilderModal('${quiz.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg" title="ایڈٹ کریں">
                        <i data-lucide="edit" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="window.Views.admin.deleteQuiz('${quiz.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950" title="ڈیلیٹ کریں">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.openQuizBuilderModal = function(quizId = null) {
  const quiz = quizId ? window.DB.findById('quizzes', quizId) : null;
  const categories = window.DB.get('categories') || [];

  window.App.showModal(quiz ? 'کوئز کی تفصیلات ایڈٹ کریں' : 'نیا آن لائن کوئز بنائیں', `
    <form onsubmit="window.Views.admin.saveQuizForm(event, '${quizId || ''}')" class="space-y-4 max-h-[75vh] overflow-y-auto pr-1 font-urdu text-right" dir="rtl">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">کوئز کا عنوان *</label>
        <input type="text" id="qb-title" required value="${quiz ? quiz.title : ''}" class="form-input text-xs font-urdu" placeholder="مثلاً: صحیح بخاری کتاب الایمان کوئز...">
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">شعبہ / کیٹیگری *</label>
          <select id="qb-category" required class="form-input text-xs font-urdu">
            ${categories.map(c => `<option value="${c.id}" ${quiz && quiz.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">سختی کا درجہ (Difficulty)</label>
          <select id="qb-difficulty" class="form-input text-xs font-urdu">
            <option value="Beginner" ${quiz && quiz.difficulty === 'Beginner' ? 'selected' : ''}>ابتدائی (Beginner)</option>
            <option value="Intermediate" ${quiz && quiz.difficulty === 'Intermediate' ? 'selected' : ''}>متوسط (Intermediate)</option>
            <option value="Advanced" ${quiz && quiz.difficulty === 'Advanced' ? 'selected' : ''}>ایڈوانس (Advanced)</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">وقت کی حد (منٹ)</label>
          <input type="number" id="qb-timelimit" value="${quiz ? quiz.timeLimitMinutes : '15'}" min="1" required class="form-input text-xs font-mono">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">کامیابی فیصد (%)</label>
          <input type="number" id="qb-passpercent" value="${quiz ? quiz.passingPercentage : '75'}" min="1" max="100" required class="form-input text-xs font-mono">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">زیادہ سے زیادہ کوششیں</label>
          <input type="number" id="qb-maxattempts" value="${quiz ? (quiz.maxAttempts || '5') : '5'}" min="1" required class="form-input text-xs font-mono">
        </div>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">مختصر تعارف</label>
        <input type="text" id="qb-short-desc" value="${quiz ? quiz.shortDescription : ''}" required class="form-input text-xs font-urdu" placeholder="کوئز کارڈ پر نظر آنے والا خلاصہ...">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">امتحانی ہدایات</label>
        <textarea id="qb-instructions" rows="3" required class="form-input text-xs font-urdu">${quiz ? quiz.instructions : 'تمام سوالات کو مختص کردہ وقت کے اندر حل کریں۔ ہر سوال کے 10 نمبر ہیں۔'}</textarea>
      </div>

      <div class="space-y-2 pt-2">
        <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" id="qb-rand-q" ${quiz && quiz.randomizeQuestions ? 'checked' : ''} class="rounded text-teal-600 focus:ring-teal-500">
          <span>ہر طالب علم کے لیے سوالات کی ترتیب تبدیل کریں (Randomize)</span>
        </label>
        <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" id="qb-rand-opt" ${quiz && quiz.randomizeOptions ? 'checked' : ''} class="rounded text-teal-600 focus:ring-teal-500">
          <span>ہر سوال کے جوابات کی ترتیب تبدیل کریں</span>
        </label>
        <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" id="qb-publish" ${!quiz || quiz.status === 'published' ? 'checked' : ''} class="rounded text-teal-600 focus:ring-teal-500">
          <span>کوئز کو فوراً شائع کریں (Publish)</span>
        </label>
      </div>

      <div class="pt-2 flex gap-2">
        <button type="submit" class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold">
          ${quiz ? 'تبدیلیاں محفوظ کریں' : 'کوئز بنائیں'}
        </button>
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">منسوخ</button>
      </div>
    </form>
  `);
};

window.Views.admin.saveQuizForm = function(e, quizId) {
  e.preventDefault();
  const title = document.getElementById('qb-title').value.trim();
  const categoryId = document.getElementById('qb-category').value;
  const difficulty = document.getElementById('qb-difficulty').value;
  const timeLimitMinutes = parseInt(document.getElementById('qb-timelimit').value, 10) || 15;
  const passingPercentage = parseInt(document.getElementById('qb-passpercent').value, 10) || 75;
  const maxAttempts = parseInt(document.getElementById('qb-maxattempts').value, 10) || 5;
  const shortDescription = document.getElementById('qb-short-desc').value.trim();
  const instructions = document.getElementById('qb-instructions').value.trim();
  const randomizeQuestions = document.getElementById('qb-rand-q').checked;
  const randomizeOptions = document.getElementById('qb-rand-opt').checked;
  const status = document.getElementById('qb-publish').checked ? 'published' : 'draft';

  let rawSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!rawSlug || rawSlug.length < 2) {
    rawSlug = `quiz-${Date.now()}`;
  }

  const quizData = {
    id: quizId || undefined,
    title,
    slug: rawSlug,
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
    window.App.showToast('کوئز کامیابی سے اپ ڈیٹ ہو گیا!', 'success');
  } else {
    window.DB.insert('quizzes', quizData);
    window.App.showToast('نیا کوئز کامیابی سے شامل کر دیا گیا!', 'success');
  }

  window.App.closeModal();
  window.Views.admin.renderQuizzes();
};

window.Views.admin.toggleQuizStatus = function(quizId) {
  const quiz = window.DB.findById('quizzes', quizId);
  if (!quiz) return;

  const newStatus = quiz.status === 'published' ? 'draft' : 'published';
  window.DB.update('quizzes', quizId, { status: newStatus });
  window.App.showToast(`کوئز کا اسٹیٹس ${newStatus} میں تبدیل ہو گیا۔`, 'info');
  window.Views.admin.renderQuizzes();
};

window.Views.admin.deleteQuiz = function(quizId) {
  if (confirm('کیا آپ واقعی یہ کوئز اور اس کے تمام سوالات حذف کرنا چاہتے ہیں؟')) {
    window.DB.delete('quizzes', quizId);
    const questions = window.DB.get('quizQuestions').filter(q => q.quizId === quizId);
    questions.forEach(q => window.DB.delete('quizQuestions', q.id));
    window.App.showToast('کوئز اور سوالات حذف کر دیے گئے۔', 'info');
    window.Views.admin.renderQuizzes();
  }
};

// ==========================================
// QUESTION BANK MANAGEMENT & MODALS
// ==========================================
window.Views.admin.openManageQuestionsModal = function(quizId) {
  const quiz = window.DB.findById('quizzes', quizId);
  if (!quiz) return;
  const questions = window.DB.get('quizQuestions').filter(q => q.quizId === quizId).sort((a, b) => a.order - b.order);

  window.App.showModal(`سوالات کا بینک: ${quiz.title}`, `
    <div class="space-y-6 max-h-[75vh] overflow-y-auto pr-1 font-urdu text-right" dir="rtl">
      <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
        <span class="text-xs text-slate-500">کل سوالات: <strong class="font-mono">${questions.length}</strong></span>
        <div class="flex items-center gap-2">
          <button onclick="window.Views.admin.openAiQuestionGeneratorModal('${quizId}')" class="btn-primary py-1.5 px-3 text-xs rounded-xl bg-gradient-to-r from-teal-700 to-indigo-700 hover:from-teal-600 hover:to-indigo-600 text-white font-bold flex items-center gap-1.5 shadow-md active:scale-95">
            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-white"></i> 🤖 AI سے سوالات تیار کریں (Gemini)
          </button>
          <button onclick="window.Views.admin.openAddQuestionForm('${quizId}')" class="btn-primary py-1.5 px-3 text-xs rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold flex items-center gap-1 shadow">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i> دستی سوال
          </button>
        </div>
      </div>

      <div class="space-y-3">
        ${questions.length === 0 ? `
          <div class="p-8 text-center space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
            <p class="text-xs text-slate-500">ابھی تک اس کوئز میں کوئی سوال شامل نہیں کیا گیا ہے۔</p>
            <button onclick="window.Views.admin.openAiQuestionGeneratorModal('${quizId}')" class="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow transition inline-flex items-center gap-1.5">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Gemini AI سے فوری 5 سوالات جنریٹ کریں
            </button>
          </div>
        ` : questions.map((q, idx) => `
          <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div class="flex items-center justify-between">
              <span class="badge badge-neutral text-[10px] font-mono">سوال #${idx + 1} (${q.marks || 10} نمبر) • ${q.type}</span>
              <div class="flex items-center gap-1.5" dir="ltr">
                <button onclick="window.Views.admin.openAddQuestionForm('${quizId}', '${q.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg text-teal-700 dark:text-teal-400" title="سوال میں ترمیم کریں">
                  <i data-lucide="edit" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="window.Views.admin.deleteQuestion('${quizId}', '${q.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg text-rose-600 hover:bg-rose-50" title="ڈیلیٹ کریں">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>

            <div class="text-xs font-bold text-slate-900 dark:text-white whitespace-pre-line leading-relaxed">${q.questionText}</div>

            <div class="space-y-1.5 pt-1 text-[11px]">
              ${(q.options || []).map((opt, optIdx) => `
                <div class="flex items-center gap-2 ${optIdx === q.correctAnswerIndex ? 'text-teal-700 dark:text-teal-400 font-bold bg-teal-50/60 dark:bg-teal-950/40 p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800' : 'text-slate-600 dark:text-slate-400 px-1.5'}">
                  <span>${optIdx === q.correctAnswerIndex ? '✓ [صحیح جواب]' : '•'}</span>
                  <span>${opt}</span>
                </div>
              `).join('')}
            </div>

            ${q.explanation ? `
              <div class="text-[10px] text-slate-400 italic pt-1 border-t border-slate-200 dark:border-slate-700/60">تشریح و حوالہ: ${q.explanation}</div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <div class="flex justify-end pt-2">
        <button type="button" onclick="window.App.closeModal(); window.Views.admin.renderQuizzes();" class="btn-secondary py-2 px-5 text-xs rounded-xl">
          بینک بند کریں
        </button>
      </div>
    </div>
  `);

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.openAddQuestionForm = function(quizId, questionId = null) {
  const existing = questionId ? window.DB.findById('quizQuestions', questionId) : null;
  const isTF = existing && existing.type === 'true_false';

  window.App.showModal(existing ? 'سوال میں ترمیم کریں' : 'بینک میں نیا سوال شامل کریں', `
    <form onsubmit="window.Views.admin.saveNewQuestion(event, '${quizId}', '${questionId || ''}')" class="space-y-4 max-h-[75vh] overflow-y-auto pr-1 font-urdu text-right" dir="rtl">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">سوال کی قسم</label>
        <select id="qq-type" class="form-input text-xs font-urdu" onchange="window.Views.admin.onQuestionTypeChange(this.value)">
          <option value="multiple_choice" ${!isTF ? 'selected' : ''}>کثیر الانتخابی سوال (4 آپشنز)</option>
          <option value="true_false" ${isTF ? 'selected' : ''}>درست / غلط (True / False)</option>
        </select>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">سوال کا متن</label>
        <textarea id="qq-text" rows="3" required placeholder="سوال درج کریں..." class="form-input text-xs font-urdu leading-relaxed">${existing ? existing.questionText : ''}</textarea>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">نمبرات (Points)</label>
        <input type="number" id="qq-marks" value="${existing ? (existing.marks || 10) : 10}" min="1" required class="form-input text-xs font-mono">
      </div>

      <!-- Options Container -->
      <div id="qq-options-container" class="space-y-2">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block">جوابات کے آپشنز (صحیح جواب کے لیے ریڈیو بٹن منتخب کریں)</label>
        
        <div class="flex items-center gap-2" dir="ltr">
          <input type="radio" name="qq-correct" value="0" ${!existing || existing.correctAnswerIndex === 0 ? 'checked' : ''} class="text-teal-600 focus:ring-teal-500">
          <input type="text" id="qq-opt-0" required value="${existing && existing.options ? (existing.options[0] || '') : ''}" placeholder="پہلا آپشن (Option 1)" class="form-input text-xs font-urdu text-right" dir="rtl">
        </div>

        <div class="flex items-center gap-2" dir="ltr">
          <input type="radio" name="qq-correct" value="1" ${existing && existing.correctAnswerIndex === 1 ? 'checked' : ''} class="text-teal-600 focus:ring-teal-500">
          <input type="text" id="qq-opt-1" required value="${existing && existing.options ? (existing.options[1] || '') : ''}" placeholder="دوسرا آپشن (Option 2)" class="form-input text-xs font-urdu text-right" dir="rtl">
        </div>

        <div class="flex items-center gap-2" id="qq-opt-wrap-2" style="${isTF ? 'display:none;' : ''}" dir="ltr">
          <input type="radio" name="qq-correct" value="2" ${existing && existing.correctAnswerIndex === 2 ? 'checked' : ''} class="text-teal-600 focus:ring-teal-500">
          <input type="text" id="qq-opt-2" value="${existing && existing.options ? (existing.options[2] || '') : ''}" placeholder="تیسرا آپشن (Option 3)" class="form-input text-xs font-urdu text-right" dir="rtl">
        </div>

        <div class="flex items-center gap-2" id="qq-opt-wrap-3" style="${isTF ? 'display:none;' : ''}" dir="ltr">
          <input type="radio" name="qq-correct" value="3" ${existing && existing.correctAnswerIndex === 3 ? 'checked' : ''} class="text-teal-600 focus:ring-teal-500">
          <input type="text" id="qq-opt-3" value="${existing && existing.options ? (existing.options[3] || '') : ''}" placeholder="چوتھا آپشن (Option 4)" class="form-input text-xs font-urdu text-right" dir="rtl">
        </div>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">تفصیلی تشریح و حوالہ (Explanation & Reference)</label>
        <textarea id="qq-explanation" rows="2" placeholder="صحیح جواب کی تشریح یا حدیث/آیت کا حوالہ..." class="form-input text-xs font-urdu">${existing ? (existing.explanation || '') : ''}</textarea>
      </div>

      <div class="pt-2 flex gap-2">
        <button type="submit" class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold">
          ${existing ? 'تبدیلیاں محفوظ کریں' : 'سوال محفوظ کریں'}
        </button>
        <button type="button" onclick="window.Views.admin.openManageQuestionsModal('${quizId}')" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">واپس</button>
      </div>
    </form>
  `);
};

window.Views.admin.onQuestionTypeChange = function(val) {
  const opt2 = document.getElementById('qq-opt-wrap-2');
  const opt3 = document.getElementById('qq-opt-wrap-3');
  const opt0 = document.getElementById('qq-opt-0');
  const opt1 = document.getElementById('qq-opt-1');

  if (val === 'true_false') {
    if (opt2) opt2.style.display = 'none';
    if (opt3) opt3.style.display = 'none';
    if (opt0) opt0.value = 'درست (True)';
    if (opt1) opt1.value = 'غلط (False)';
  } else {
    if (opt2) opt2.style.display = 'flex';
    if (opt3) opt3.style.display = 'flex';
    if (opt0 && opt0.value === 'درست (True)') opt0.value = '';
    if (opt1 && opt1.value === 'غلط (False)') opt1.value = '';
  }
};

window.Views.admin.saveNewQuestion = function(e, quizId, questionId) {
  e.preventDefault();
  const type = document.getElementById('qq-type').value;
  const questionText = document.getElementById('qq-text').value.trim();
  const marks = parseInt(document.getElementById('qq-marks').value, 10) || 10;
  const explanation = document.getElementById('qq-explanation').value.trim();

  let options = [];
  if (type === 'true_false') {
    options = ['درست (True)', 'غلط (False)'];
  } else {
    options = [
      document.getElementById('qq-opt-0').value.trim(),
      document.getElementById('qq-opt-1').value.trim(),
      document.getElementById('qq-opt-2').value.trim(),
      document.getElementById('qq-opt-3').value.trim()
    ].filter(o => o.length > 0);
  }

  const selectedCorrect = document.querySelector('input[name="qq-correct"]:checked');
  const correctAnswerIndex = selectedCorrect ? parseInt(selectedCorrect.value, 10) : 0;

  const existingQuestions = window.DB.get('quizQuestions').filter(q => q.quizId === quizId);
  const nextOrder = existingQuestions.length + 1;

  const questionData = {
    quizId,
    type,
    questionText,
    marks,
    options,
    correctAnswerIndex,
    explanation,
    order: questionId ? (window.DB.findById('quizQuestions', questionId)?.order || 1) : nextOrder
  };

  if (questionId) {
    window.DB.update('quizQuestions', questionId, questionData);
    window.App.showToast('سوال کامیابی سے اپ ڈیٹ ہو گیا!', 'success');
  } else {
    window.DB.insert('quizQuestions', questionData);
    window.App.showToast('نیا سوال بینک میں شامل کر دیا گیا!', 'success');
  }

  window.Views.admin.openManageQuestionsModal(quizId);
};

window.Views.admin.deleteQuestion = function(quizId, qId) {
  if (confirm('کیا آپ واقعی یہ سوال حذف کرنا چاہتے ہیں؟')) {
    window.DB.delete('quizQuestions', qId);
    window.App.showToast('سوال حذف کر دیا گیا۔', 'info');
    window.Views.admin.openManageQuestionsModal(quizId);
  }
};

window.Views.admin.openQuizAnalyticsModal = function(quizId) {
  const quiz = window.DB.findById('quizzes', quizId);
  if (!quiz) return;
  const attempts = (window.DB.get('quizAttempts') || []).filter(a => a.quizId === quizId);

  window.App.showModal(`کوئز اینالیٹکس: ${quiz.title}`, `
    <div class="space-y-4 max-h-[75vh] overflow-y-auto pr-1 font-urdu text-right text-xs" dir="rtl">
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div class="text-slate-400">کل کوششیں</div>
          <div class="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">${attempts.length}</div>
        </div>
        <div class="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-emerald-200 dark:border-emerald-800">
          <div class="text-teal-700 dark:text-teal-400">کامیاب طلباء</div>
          <div class="text-xl font-bold font-mono text-teal-800 dark:text-teal-300 mt-1">${attempts.filter(a => a.passed).length}</div>
        </div>
        <div class="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800">
          <div class="text-cyan-600 dark:text-cyan-400">اوسط اسکور</div>
          <div class="text-xl font-bold font-mono text-cyan-700 dark:text-cyan-300 mt-1">${attempts.length ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length) : 0}%</div>
        </div>
      </div>
      <div class="flex justify-end pt-2">
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-1.5 px-4 rounded-xl">بند کریں</button>
      </div>
    </div>
  `);
};

// ==========================================
// GEMINI AI QUESTION GENERATOR MODAL & SUITE
// ==========================================
window.Views.admin.openAiQuestionGeneratorModal = function(quizId) {
  const quiz = window.DB.findById('quizzes', quizId);
  if (!quiz) return;

  window._generatedAiQuestions = [];

  window.App.showModal('🤖 Gemini AI خودکار سوالات جنریٹر', `
    <div class="space-y-4 max-h-[80vh] overflow-y-auto pr-1 font-urdu text-right" dir="rtl">
      
      <!-- Top Instructions Banner -->
      <div class="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs space-y-1">
        <div class="flex items-center gap-1.5 font-bold text-teal-800 dark:text-teal-300">
          <i data-lucide="sparkles" class="w-4 h-4 text-teal-600"></i>
          <span>Google Gemini AI خودکار شرعی امتحانی سوالات جنریٹر</span>
        </div>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
          اپنا مطلوبہ موضوع درج کریں، Gemini AI سیکنڈوں میں 4 کثیر الانتخابی آپشنز، درست جواب، تشریح اور قرآنی/حدیثی حوالہ جات کے ساتھ سوالات تیار کر دے گا۔
        </p>
      </div>

      <!-- Config Form -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div class="sm:col-span-2">
          <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">موضوع یا عنوان (Topic / Subject) *</label>
          <input 
            type="text" 
            id="ai-gen-topic" 
            required 
            value="${quiz.title || 'قرآنی تجوید و اسلامی فقہ'}" 
            placeholder="مثلاً: صحیح بخاری کے ابواب، تجوید القرآن کے احکام، سیرت النبی ﷺ..."
            class="form-input text-xs font-urdu text-right"
          />
        </div>

        <div>
          <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">سوالات کی تعداد</label>
          <select id="ai-gen-count" class="form-input text-xs font-mono">
            <option value="3">3 سوالات</option>
            <option value="5" selected>5 سوالات (تجویز کردہ)</option>
            <option value="10">10 سوالات</option>
            <option value="15">15 سوالات</option>
          </select>
        </div>

        <div>
          <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">سختی کا درجہ (Difficulty)</label>
          <select id="ai-gen-difficulty" class="form-input text-xs font-urdu">
            <option value="Beginner">ابتدائی (Beginner)</option>
            <option value="Intermediate" selected>متوسط (Intermediate)</option>
            <option value="Advanced">اعلیٰ و تحقیقی (Advanced / Scholar)</option>
          </select>
        </div>

        <div>
          <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">زبان (Language)</label>
          <select id="ai-gen-lang" class="form-input text-xs font-urdu">
            <option value="ur" selected>اردو (Urdu)</option>
            <option value="en">English (انگریزی)</option>
            <option value="ar">العربية (عربی)</option>
          </select>
        </div>

        <div>
          <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">فی سوال نمبرات (Points)</label>
          <input type="number" id="ai-gen-marks" value="10" min="1" class="form-input text-xs font-mono" />
        </div>
      </div>

      <div class="pt-2">
        <button 
          type="button" 
          id="ai-gen-submit-btn" 
          onclick="window.Views.admin.executeAiQuestionGeneration('${quizId}')"
          class="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95"
        >
          <i data-lucide="zap" class="w-4 h-4"></i>
          <span>Gemini AI سے سوالات تیار کریں</span>
        </button>
      </div>

      <!-- Live Generated Questions Preview Container -->
      <div id="ai-generated-results-container" class="hidden space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700"></div>

      <div class="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button type="button" onclick="window.App.closeModal(); window.Views.admin.openManageQuestionsModal('${quizId}');" class="btn-secondary py-2 px-4 text-xs rounded-xl">
          واپس جائیں
        </button>
      </div>
    </div>
  `);

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.executeAiQuestionGeneration = async function(quizId) {
  const topic = document.getElementById('ai-gen-topic')?.value?.trim();
  const count = parseInt(document.getElementById('ai-gen-count')?.value, 10) || 5;
  const difficulty = document.getElementById('ai-gen-difficulty')?.value || 'Intermediate';
  const language = document.getElementById('ai-gen-lang')?.value || 'ur';
  const marks = parseInt(document.getElementById('ai-gen-marks')?.value, 10) || 10;

  if (!topic) {
    window.App?.showToast('براہ کرم موضوع درج فرمائیں', 'warning');
    return;
  }

  const btn = document.getElementById('ai-gen-submit-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="inline-block animate-spin mr-2">⚡</span><span>Gemini AI سوالات تیار کر رہا ہے...</span>`;
  }

  try {
    const res = await window.AIScholarService.generateQuestionsWithGemini({
      topic,
      difficulty,
      count,
      language,
      category: 'Islamic Studies'
    });

    if (!res || !res.questions || res.questions.length === 0) {
      throw new Error('کوئی سوال تیار نہیں ہو سکا۔');
    }

    // Attach marks and temp IDs
    window._generatedAiQuestions = res.questions.map((q, idx) => ({
      ...q,
      marks: marks,
      selected: true,
      order: idx + 1
    }));

    const preview = document.getElementById('ai-generated-results-container');
    if (preview) {
      preview.classList.remove('hidden');
      preview.innerHTML = `
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
            <i data-lucide="check-circle-2" class="w-4 h-4 text-teal-700"></i>
            <span>تیار شدہ سوالات (${window._generatedAiQuestions.length})</span>
          </h4>
          <button 
            type="button" 
            onclick="window.Views.admin.batchInsertAiQuestions('${quizId}')"
            class="py-1.5 px-3 rounded-xl bg-teal-700 hover:bg-teal-500 text-white font-bold text-xs shadow transition flex items-center gap-1 active:scale-95"
          >
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
            <span>تمام کو کوئز میں شامل کریں (Batch Insert)</span>
          </button>
        </div>

        <div class="space-y-2.5">
          ${window._generatedAiQuestions.map((q, idx) => `
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 dark:text-white">سوال #${idx + 1}: ${q.questionText}</span>
                <span class="text-[10px] font-mono text-teal-700 dark:text-teal-300 font-bold bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md">${q.marks} Marks</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] pt-1">
                ${q.options.map((opt, oIdx) => `
                  <div class="p-1.5 rounded-lg ${oIdx === q.correctAnswerIndex ? 'bg-emerald-100 dark:bg-teal-950/80 text-emerald-800 dark:text-teal-300 font-bold border border-amber-300' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}">
                    <span>${oIdx === q.correctAnswerIndex ? '✓ ' : '• '}${opt}</span>
                  </div>
                `).join('')}
              </div>
              ${q.explanation ? `
                <div class="text-[10px] text-slate-500 italic pt-1 border-t border-slate-200 dark:border-slate-700">
                  تشریح: ${q.explanation} ${q.reference ? ' • حوالہ: ' + q.reference : ''}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <div class="pt-2">
          <button 
            type="button" 
            onclick="window.Views.admin.batchInsertAiQuestions('${quizId}')"
            class="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95"
          >
            <i data-lucide="check" class="w-4 h-4"></i>
            <span>تمام ${window._generatedAiQuestions.length} سوالات کو کوئز میں داخل کریں</span>
          </button>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
    }

    window.App?.showToast('🎉 Gemini AI نے کامیابی کے ساتھ سوالات تیار کر دیے!', 'success');
  } catch(err) {
    window.App?.showToast(err.message || 'AI سوالات تیار کرتے وقت خرابی پیش آئی۔', 'danger');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i data-lucide="zap" class="w-4 h-4"></i> <span>Gemini AI سے سوالات تیار کریں</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
  }
};

window.Views.admin.batchInsertAiQuestions = function(quizId) {
  if (!window._generatedAiQuestions || window._generatedAiQuestions.length === 0) {
    window.App?.showToast('شامل کرنے کے لیے کوئی سوال موجود نہیں', 'warning');
    return;
  }

  const existingQuestions = window.DB.get('quizQuestions').filter(q => q.quizId === quizId);
  let currentOrder = existingQuestions.length;

  window._generatedAiQuestions.forEach(q => {
    currentOrder++;
    window.DB.insert('quizQuestions', {
      quizId,
      questionText: q.questionText,
      type: q.type || 'multiple_choice',
      options: q.options || [],
      correctAnswerIndex: q.correctAnswerIndex || 0,
      marks: q.marks || 10,
      explanation: q.explanation || '',
      reference: q.reference || '',
      order: currentOrder
    });
  });

  if (window.DB && typeof window.DB.save === 'function') window.DB.save();

  window.App?.showToast(`🎉 ${window._generatedAiQuestions.length} سوالات کامیابی کے ساتھ کوئز میں شامل کر دیے گئے!`, 'success');
  window.Views.admin.openManageQuestionsModal(quizId);
};

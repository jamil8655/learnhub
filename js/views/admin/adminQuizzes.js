/**
 * LearnHub Admin Standalone Quizzes & Question Management Views
 * Completely independent from courses.
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderQuizzes = async function() {
  const container = document.getElementById('main-content');
  const quizzes = await window.API.getQuizzes({ includeAllStatus: true });
  const allAttempts = window.DB.get('quizAttempts') || [];
  const allQuestions = window.DB.get('quizQuestions') || [];

  container.innerHTML = `
    <div class="space-y-6 font-urdu" dir="rtl">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-1">
            <i data-lucide="zap" class="w-3.5 h-3.5"></i> امتحانات و کوئزز انجن
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">امتحانات و آن لائن کوئزز کنٹرول</h1>
          <p class="text-xs text-slate-500">سوالات کے بینکس، ٹائمرز، پاسنگ اسکور اور طلباء کی تفصیلی کارکردگی کا جائزہ۔</p>
        </div>
        <button onclick="window.Views.admin.openQuizBuilderModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 shadow">
          <i data-lucide="plus-circle" class="w-4 h-4"></i> نیا کوئز بنائیں
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
                      <span class="text-emerald-600 dark:text-emerald-400 font-bold font-mono">${livePassRate}%</span>
                      <span class="text-[10px] text-slate-400 font-mono">(${qAttempts.length} طلباء)</span>
                    </td>
                    <td class="p-3.5">
                      <button onclick="window.Views.admin.toggleQuizStatus('${quiz.id}')" class="badge ${quiz.status === 'published' ? 'badge-success' : 'badge-warning'} cursor-pointer text-[10px] uppercase font-bold" title="اسٹیٹس تبدیل کرنے کے لیے کلک کریں">
                        ${quiz.status || 'draft'}
                      </button>
                    </td>
                    <td class="p-3.5 text-left space-x-1 whitespace-nowrap" dir="ltr">
                      <button onclick="window.Views.admin.openManageQuestionsModal('${quiz.id}')" class="btn-secondary py-1 px-2.5 text-[11px] rounded-lg text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800 font-bold" title="سوالات کا بینک">
                        <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> سوالات (${questions.length})
                      </button>
                      <button onclick="window.Views.admin.openQuizAnalyticsModal('${quiz.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg" title="شماریات و اینالیٹکس">
                        <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="window.Views.admin.openQuizBuilderModal('${quiz.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg" title="ایڈٹ کریں">
                        <i data-lucide="edit" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="window.Views.admin.deleteQuiz('${quiz.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg text-rose-600 hover:bg-rose-50" title="ڈیلیٹ کریں">
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

window.Views.admin.filterQuizTable = function(query) {
  const q = (query || '').toLowerCase().trim();
  const rows = document.querySelectorAll('#admin-quizzes-table tbody tr');
  rows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
};

window.Views.admin.openQuizBuilderModal = function(quizId = null) {
  const quiz = quizId ? window.DB.findById('quizzes', quizId) : null;
  const categories = window.DB.get('categories') || [];

  window.App.showModal(quiz ? 'کوئز کی معلومات میں ترمیم کریں' : 'نیا امتحان / کوئز بنائیں', `
    <form onsubmit="window.Views.admin.saveQuizForm(event, '${quizId || ''}')" class="space-y-4 max-h-[75vh] overflow-y-auto pr-1 font-urdu text-right" dir="rtl">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">کوئز کا عنوان</label>
        <input type="text" id="qb-title" value="${quiz ? quiz.title : ''}" required class="form-input text-xs font-urdu" placeholder="مثلاً: اسلامی فقہ و نماز کے احکام پر جامع ٹیسٹ">
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">شعبہ / کیٹیگری</label>
          <select id="qb-category" class="form-input text-xs font-urdu">
            ${categories.map(c => `
              <option value="${c.id}" ${quiz && quiz.categoryId === c.id ? 'selected' : ''}>${c.name}</option>
            `).join('')}
          </select>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">درجہ / سختی</label>
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
          <input type="checkbox" id="qb-rand-q" ${quiz && quiz.randomizeQuestions ? 'checked' : ''} class="rounded text-cyan-600 focus:ring-cyan-500">
          <span>ہر طالب علم کے لیے سوالات کی ترتیب تبدیل کریں (Randomize)</span>
        </label>
        <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" id="qb-rand-opt" ${quiz && quiz.randomizeOptions ? 'checked' : ''} class="rounded text-cyan-600 focus:ring-cyan-500">
          <span>ہر سوال کے جوابات کی ترتیب تبدیل کریں</span>
        </label>
        <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" id="qb-publish" ${!quiz || quiz.status === 'published' ? 'checked' : ''} class="rounded text-cyan-600 focus:ring-cyan-500">
          <span>کوئز کو فوراً شائع کریں (Publish)</span>
        </label>
      </div>

      <div class="pt-2 flex gap-2">
        <button type="submit" class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
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
      <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <span class="text-xs text-slate-500">کل سوالات: <strong class="font-mono">${questions.length}</strong></span>
        <button onclick="window.Views.admin.openAddQuestionForm('${quizId}')" class="btn-primary py-1.5 px-3 text-xs rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1 shadow">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i> نیا سوال شامل کریں
        </button>
      </div>

      <div class="space-y-3">
        ${questions.length === 0 ? `
          <p class="text-xs text-slate-400 py-6 text-center">ابھی تک کوئی سوال شامل نہیں کیا گیا۔ نیا سوال درج کریں۔</p>
        ` : questions.map((q, idx) => `
          <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div class="flex items-center justify-between">
              <span class="badge badge-neutral text-[10px] font-mono">سوال #${idx + 1} (${q.marks || 10} نمبر) • ${q.type}</span>
              <div class="flex items-center gap-1.5" dir="ltr">
                <button onclick="window.Views.admin.openAddQuestionForm('${quizId}', '${q.id}')" class="btn-secondary py-1 px-2 text-[11px] rounded-lg text-cyan-600 dark:text-cyan-400" title="سوال میں ترمیم کریں">
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
                <div class="flex items-center gap-2 ${optIdx === q.correctAnswerIndex ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/60 dark:bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800' : 'text-slate-600 dark:text-slate-400 px-1.5'}">
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
          <input type="radio" name="qq-correct" value="0" ${!existing || existing.correctAnswerIndex === 0 ? 'checked' : ''} class="text-cyan-600 focus:ring-cyan-500">
          <input type="text" id="qq-opt-0" required value="${existing && existing.options ? (existing.options[0] || '') : ''}" placeholder="پہلا آپشن (Option 1)" class="form-input text-xs font-urdu text-right" dir="rtl">
        </div>

        <div class="flex items-center gap-2" dir="ltr">
          <input type="radio" name="qq-correct" value="1" ${existing && existing.correctAnswerIndex === 1 ? 'checked' : ''} class="text-cyan-600 focus:ring-cyan-500">
          <input type="text" id="qq-opt-1" required value="${existing && existing.options ? (existing.options[1] || '') : ''}" placeholder="دوسرا آپشن (Option 2)" class="form-input text-xs font-urdu text-right" dir="rtl">
        </div>

        <div class="flex items-center gap-2" id="qq-opt-wrap-2" style="${isTF ? 'display:none;' : ''}" dir="ltr">
          <input type="radio" name="qq-correct" value="2" ${existing && existing.correctAnswerIndex === 2 ? 'checked' : ''} class="text-cyan-600 focus:ring-cyan-500">
          <input type="text" id="qq-opt-2" value="${existing && existing.options ? (existing.options[2] || '') : ''}" placeholder="تیسرا آپشن (Option 3)" class="form-input text-xs font-urdu text-right" dir="rtl">
        </div>

        <div class="flex items-center gap-2" id="qq-opt-wrap-3" style="${isTF ? 'display:none;' : ''}" dir="ltr">
          <input type="radio" name="qq-correct" value="3" ${existing && existing.correctAnswerIndex === 3 ? 'checked' : ''} class="text-cyan-600 focus:ring-cyan-500">
          <input type="text" id="qq-opt-3" value="${existing && existing.options ? (existing.options[3] || '') : ''}" placeholder="چوتھا آپشن (Option 4)" class="form-input text-xs font-urdu text-right" dir="rtl">
        </div>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">تشریح و تصحیحی نوٹ (Answer Explanation)</label>
        <textarea id="qq-explanation" rows="2" placeholder="امتحان کے بعد طالب علم کو درست جواب سمجھانے کے لیے تشریح..." class="form-input text-xs font-urdu leading-relaxed">${existing ? (existing.explanation || '') : ''}</textarea>
      </div>

      <div class="pt-2 flex gap-2">
        <button type="submit" class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
          ${existing ? 'سوال محفوظ کریں' : 'سوال شامل کریں'}
        </button>
        <button type="button" onclick="window.Views.admin.openManageQuestionsModal('${quizId}')" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">واپس</button>
      </div>
    </form>
  `);
};

window.Views.admin.onQuestionTypeChange = function(type) {
  const opt0 = document.getElementById('qq-opt-0');
  const opt1 = document.getElementById('qq-opt-1');
  const wrap2 = document.getElementById('qq-opt-wrap-2');
  const wrap3 = document.getElementById('qq-opt-wrap-3');

  if (type === 'true_false') {
    if (opt0) opt0.value = 'درست (True)';
    if (opt1) opt1.value = 'غلط (False)';
    if (wrap2) wrap2.style.display = 'none';
    if (wrap3) wrap3.style.display = 'none';
  } else {
    if (wrap2) wrap2.style.display = 'flex';
    if (wrap3) wrap3.style.display = 'flex';
  }
};

window.Views.admin.saveNewQuestion = function(e, quizId, questionId) {
  e.preventDefault();
  const type = document.getElementById('qq-type').value;
  const questionText = document.getElementById('qq-text').value.trim();
  const marks = parseInt(document.getElementById('qq-marks').value, 10) || 10;
  const explanation = document.getElementById('qq-explanation').value.trim();
  const correctRadio = document.querySelector('input[name="qq-correct"]:checked');
  const correctAnswerIndex = correctRadio ? parseInt(correctRadio.value, 10) : 0;

  let options = [];
  if (type === 'true_false') {
    options = ['درست (True)', 'غلط (False)'];
  } else {
    options = [
      document.getElementById('qq-opt-0')?.value.trim() || '',
      document.getElementById('qq-opt-1')?.value.trim() || '',
      document.getElementById('qq-opt-2')?.value.trim() || '',
      document.getElementById('qq-opt-3')?.value.trim() || ''
    ].filter(Boolean);
  }

  const existingQuestions = window.DB.get('quizQuestions').filter(q => q.quizId === quizId);
  const newOrder = questionId ? (window.DB.findById('quizQuestions', questionId)?.order || existingQuestions.length) : (existingQuestions.length + 1);

  const qData = {
    id: questionId || undefined,
    quizId,
    order: newOrder,
    type,
    marks,
    questionText,
    options,
    correctAnswerIndex,
    explanation
  };

  if (questionId) {
    window.DB.update('quizQuestions', questionId, qData);
    window.App.showToast('سوال کامیابی سے اپ ڈیٹ ہو گیا!', 'success');
  } else {
    window.DB.insert('quizQuestions', qData);
    window.App.showToast('نیا سوال بینک میں شامل کر دیا گیا!', 'success');
  }

  window.Views.admin.openManageQuestionsModal(quizId);
};

window.Views.admin.deleteQuestion = function(quizId, questionId) {
  if (confirm('کیا آپ واقعی یہ سوال حذف کرنا چاہتے ہیں؟')) {
    window.DB.delete('quizQuestions', questionId);
    window.App.showToast('سوال حذف کر دیا گیا۔', 'info');
    window.Views.admin.openManageQuestionsModal(quizId);
  }
};

// Quiz Analytics Modal
window.Views.admin.openQuizAnalyticsModal = function(quizId) {
  const quiz = window.DB.findById('quizzes', quizId);
  if (!quiz) return;
  const attempts = (window.DB.get('quizAttempts') || []).filter(a => a.quizId === quizId);
  const passedCount = attempts.filter(a => a.passed).length;
  const livePassRate = attempts.length ? Math.round((passedCount / attempts.length) * 100) : 100;
  const avgScore = attempts.length ? Math.round(attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / attempts.length) : 100;

  window.App.showModal(`کوئز اینالیٹکس و کارکردگی: ${quiz.title}`, `
    <div class="space-y-6 max-h-[75vh] overflow-y-auto pr-1 font-urdu text-right" dir="rtl">
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div class="text-[11px] text-slate-500 font-bold">کل شرکت کنندگان</div>
          <div class="text-xl font-bold font-mono mt-1">${attempts.length}</div>
        </div>
        <div class="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div class="text-[11px] text-slate-500 font-bold">شرحِ کامیابی (Pass Rate)</div>
          <div class="text-xl font-bold text-emerald-600 font-mono mt-1">${livePassRate}%</div>
        </div>
        <div class="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div class="text-[11px] text-slate-500 font-bold">اوسط اسکور (Average)</div>
          <div class="text-xl font-bold text-cyan-600 font-mono mt-1">${avgScore}%</div>
        </div>
      </div>

      <div class="space-y-3">
        <h4 class="font-bold text-xs text-slate-400 uppercase">طلباء کی شرکت کا لائیو لاگ</h4>
        ${attempts.length === 0 ? `
          <p class="text-xs text-slate-400 py-4 text-center">ابھی تک کسی طالب علم نے اس امتحان میں شرکت نہیں کی۔</p>
        ` : attempts.map(a => {
          const u = window.DB.findById('users', a.userId);
          return `
            <div class="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-xs border border-slate-200 dark:border-slate-700">
              <div>
                <div class="font-bold text-slate-900 dark:text-white">${u ? u.name : 'طالب علم'}</div>
                <div class="text-[10px] text-slate-400 font-mono mt-0.5">وقت: ${Math.floor(a.timeTakenSeconds/60)} منٹ ${a.timeTakenSeconds%60} سیکنڈ • ${new Date(a.completedAt).toLocaleDateString('ur-PK')}</div>
              </div>
              <div class="text-left font-mono" dir="ltr">
                <div class="font-bold text-sm">${a.percentage}%</div>
                <span class="badge ${a.passed ? 'badge-success' : 'badge-danger'} text-[9px] font-bold">${a.passed ? 'کامیاب' : 'ناکام'}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="flex justify-end pt-2">
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-2 px-5 text-xs rounded-xl">بند کریں</button>
      </div>
    </div>
  `);

  if (window.lucide) window.lucide.createIcons();
};

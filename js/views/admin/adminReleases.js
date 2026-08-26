/**
 * LearnHub Universal Admin Release Manager & Staging Console
 * Central control room to review, preview, and deploy staged drafts across
 * all platform modules (Courses, Books, Quizzes, Articles, Announcements, Game Stages)
 * to live students and public visitors with 1-click.
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderReleaseManager = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const db = window.DB;
  const summary = db ? db.getStagedDraftsSummary() : { totalDrafts: 0, byCollection: {}, draftItems: [] };

  const coursesCount = (db.get('courses', { includeDrafts: true }) || []).length;
  const booksCount = (db.get('books', { includeDrafts: true }) || []).length;
  const quizzesCount = (db.get('quizzes', { includeDrafts: true }) || []).length;
  const articlesCount = (db.get('articles', { includeDrafts: true }) || []).length;
  const totalItems = coursesCount + booksCount + quizzesCount + articlesCount;

  container.innerHTML = `
    <div class="space-y-6 font-urdu text-right select-none" dir="rtl">
      
      <!-- Top Release Hero Header -->
      <div class="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/40 p-6 sm:p-8 rounded-3xl shadow-2xl text-white">
        <div class="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <span class="p-3 rounded-2xl bg-indigo-500/20 text-amber-400 border border-indigo-400/40 shadow-inner">
                <i data-lucide="rocket" class="w-8 h-8"></i>
              </span>
              <div>
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-indigo-200">
                  یونیورسل ریلیز مینیجر (Universal Release Hub)
                </h1>
                <p class="text-xs sm:text-sm text-slate-300">
                  تمام زیرِ کار مسودات (Drafts) کا مرکزی کنٹرول روم — آپ جب چاہیں ایک کلک سے لائیو ریلیز کریں۔
                </p>
              </div>
            </div>
          </div>

          <!-- Master 1-Click Deploy Action -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            ${summary.totalDrafts > 0 ? `
              <button 
                onclick="window.Views.admin.deployAllStagedDrafts()" 
                class="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition transform hover:scale-[1.02] active:scale-95 border border-emerald-200"
              >
                <i data-lucide="upload-cloud" class="w-5 h-5"></i>
                <span>تمام ${summary.totalDrafts} ترامیم لائیو شائع کریں 🚀</span>
              </button>
            ` : `
              <div class="py-3 px-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>
                <span>تمام مواد 100% لائیو اور اپ ٹو ڈیٹ ہے</span>
              </div>
            `}
          </div>
        </div>
      </div>

      <!-- Release Status KPI Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans">
        
        <!-- Pending Staged Drafts Card -->
        <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 ${summary.totalDrafts > 0 ? 'border-amber-400/60 bg-amber-50/10' : 'border-slate-200 dark:border-slate-800'} shadow-sm">
          <div class="flex items-center justify-between text-slate-500 mb-1">
            <span class="text-xs font-urdu font-black text-amber-600 dark:text-amber-400">غیر شائع شدہ مسودات</span>
            <i data-lucide="clock" class="w-4 h-4 text-amber-500"></i>
          </div>
          <div class="text-3xl font-black ${summary.totalDrafts > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}">${summary.totalDrafts}</div>
          <div class="text-[11px] text-slate-500 font-urdu mt-1">ایڈمن ٹیسٹنگ میں موجود</div>
        </div>

        <!-- Live Published Content Card -->
        <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-500 mb-1">
            <span class="text-xs font-urdu font-black text-emerald-600 dark:text-emerald-400">شائع شدہ لائیو مواد</span>
            <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500"></i>
          </div>
          <div class="text-3xl font-black text-slate-900 dark:text-white">${Math.max(0, totalItems - summary.totalDrafts)}</div>
          <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-urdu mt-1">طلباء کے لیے دستیاب</div>
        </div>

        <!-- Courses in Staging -->
        <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-500 mb-1">
            <span class="text-xs font-urdu font-bold text-indigo-600 dark:text-indigo-400">کورسز و اسباق مسودات</span>
            <i data-lucide="book-open" class="w-4 h-4 text-indigo-500"></i>
          </div>
          <div class="text-3xl font-black text-slate-900 dark:text-white">${summary.byCollection.courses || 0}</div>
          <div class="text-[11px] text-slate-500 font-urdu mt-1">زیرِ تکمیل کورسز</div>
        </div>

        <!-- Quizzes & Puzzles in Staging -->
        <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-500 mb-1">
            <span class="text-xs font-urdu font-bold text-purple-600 dark:text-purple-400">امتحانات و گیم سوالات</span>
            <i data-lucide="zap" class="w-4 h-4 text-purple-500"></i>
          </div>
          <div class="text-3xl font-black text-slate-900 dark:text-white">${(summary.byCollection.quizzes || 0) + (summary.byCollection.gameQuestions || 0)}</div>
          <div class="text-[11px] text-slate-500 font-urdu mt-1">زیرِ جانچ معمیات</div>
        </div>

      </div>

      <!-- Pending Staging Queue Table -->
      <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 class="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>زیرِ کار اسٹیجنگ کیو (Staging Deployment Queue)</span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                ${summary.draftItems.length} آئٹمز
              </span>
            </h3>
            <p class="text-xs text-slate-500">یہ تمام ترامیم ابھی صرف ایڈمن کو نظر آ رہی ہیں۔ آپ فرداً فرداً یا ایک ساتھ لائیو ریلیز کر سکتے ہیں۔</p>
          </div>
        </div>

        ${summary.draftItems.length === 0 ? `
          <div class="text-center py-12 space-y-3">
            <div class="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <i data-lucide="check-check" class="w-8 h-8"></i>
            </div>
            <div class="space-y-1">
              <h4 class="font-extrabold text-sm text-slate-800 dark:text-slate-200">کوئی مسودہ یا غیر شائع شدہ ترمیم باقی نہیں ہے</h4>
              <p class="text-xs text-slate-400">آپ کا تمام تخلیق کردہ مواد لائیو طلباء اور قارئین کے لیے شائع شدہ حالت میں ہے۔</p>
            </div>
          </div>
        ` : `
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-right border-collapse">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th class="py-3 px-3">عنوانِ آئٹم</th>
                  <th class="py-3 px-3">شعبہ (Category)</th>
                  <th class="py-3 px-3">حالت (Status)</th>
                  <th class="py-3 px-3">تاریخِ اندراج</th>
                  <th class="py-3 px-3 text-center">ایکشنز</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-bold">
                ${summary.draftItems.map(item => {
                  const typeLabel = 
                    item.collection === 'courses' ? 'کورسز و نصاب' :
                    item.collection === 'books' ? 'اسلامی کتب خانہ' :
                    item.collection === 'quizzes' ? 'معروضی امتحان' :
                    item.collection === 'gameQuestions' ? 'گیم ایڈونچر سوال' :
                    item.collection === 'articles' ? 'مضمون / آرٹیکل' : 'اعلان';

                  const badgeColor = 
                    item.collection === 'courses' ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' :
                    item.collection === 'books' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                    item.collection === 'quizzes' ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300' : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300';

                  return `
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td class="py-3.5 px-3 max-w-sm truncate text-slate-900 dark:text-white">${item.title}</td>
                      <td class="py-3.5 px-3">
                        <span class="px-2.5 py-1 rounded-xl text-[10px] font-bold ${badgeColor}">
                          ${typeLabel}
                        </span>
                      </td>
                      <td class="py-3.5 px-3">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1 w-fit">
                          <i data-lucide="eye-off" class="w-3 h-3"></i> <span>مسودہ (Draft)</span>
                        </span>
                      </td>
                      <td class="py-3.5 px-3 text-slate-400 font-mono text-[11px]" dir="ltr">
                        ${new Date(item.createdAt).toLocaleDateString('ur-PK')}
                      </td>
                      <td class="py-3.5 px-3 text-center">
                        <div class="flex items-center justify-center gap-2">
                          <button 
                            onclick="window.Views.admin.publishSingleStagedItem('${item.collection}', '${item.id}')" 
                            class="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition"
                            title="لائیو شائع کریں"
                          >
                            <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                            <span>شائع کریں</span>
                          </button>
                          <button 
                            onclick="window.Views.admin.discardStagedDraft('${item.collection}', '${item.id}')" 
                            class="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition" 
                            title="ڈرافٹ خارج کریں"
                          >
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `}

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.deployAllStagedDrafts = function() {
  if (confirm('کیا آپ تمام مسودات اور ترامیم کو ایک ساتھ لائیو طلباء اور قارئین کے لیے شائع کرنا چاہتے ہیں؟')) {
    const count = window.DB.publishAllStagedDrafts();
    window.App.showToast(`🎉 مبارک! تمام ${count} مسودات اور ترامیم کامیابی کے ساتھ لائیو شائع ہو گئیں!`, 'success');
    window.Views.admin.renderReleaseManager();
  }
};

window.Views.admin.publishSingleStagedItem = function(collectionName, id) {
  const success = window.DB.publishItem(collectionName, id);
  if (success) {
    window.App.showToast('آئٹم کامیابی سے لائیو شائع ہو گیا!', 'success');
    window.Views.admin.renderReleaseManager();
  }
};

window.Views.admin.discardStagedDraft = function(collectionName, id) {
  if (confirm('کیا آپ واقعی اس مسودے کو خارج (Delete) کرنا چاہتے ہیں؟')) {
    window.DB.delete(collectionName, id);
    window.App.showToast('مسودہ خارج کر دیا گیا۔', 'info');
    window.Views.admin.renderReleaseManager();
  }
};

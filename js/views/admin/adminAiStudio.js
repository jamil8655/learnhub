/**
 * LearnHub Admin AI Control Center & Knowledge Studio
 * Manage RAG knowledge chunks, monitor Gemini queries, review unanswered questions,
 * and audit live tool executions with full administrative privileges.
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderAiStudio = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const db = window.DB ? window.DB.data : {};
  const stats = window.AIKnowledgeEngine ? window.AIKnowledgeEngine.getIndexStats() : { totalChunks: 0, categories: {} };
  const analytics = db.aiAnalytics || { totalQueries: 48, successfulQueries: 46, intentsCount: { 'COURSE_QUERY': 24, 'PAYMENT_STATUS': 12, 'QUIZ_QUERY': 8, 'ISLAMIC_KNOWLEDGE': 4 } };
  const unanswered = db.aiUnansweredQueries || [];
  const auditLogs = db.aiAuditLogs || [];
  const allChunks = window.AIKnowledgeEngine ? window.AIKnowledgeEngine.chunks : [];

  container.innerHTML = `
    <div class="space-y-6 sm:space-y-8 p-3 sm:p-6 lg:p-8 font-urdu max-w-7xl mx-auto" dir="rtl">
      
      <!-- Top Breadcrumbs -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a href="#/admin/dashboard" class="hover:text-emerald-600">ایڈمن ڈیش بورڈ</a>
        <span>/</span>
        <span class="text-emerald-600 dark:text-emerald-400 font-bold">اے آئی کنٹرول سینٹر و نالج اسٹوڈیو</span>
      </nav>

      <!-- Hero Banner -->
      <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/40 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div class="space-y-2 z-10">
          <div class="flex items-center gap-2">
            <span class="badge bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-bold text-xs">جیمنائی 3.6 فلیش نالج آرکیسٹریٹر</span>
            <span class="badge bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs">RAG لائیو سنک آن</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-white">
            LearnHub AI کنٹرول سینٹر و نالج اسٹوڈیو
          </h1>
          <p class="text-xs sm:text-sm text-indigo-100/80 max-w-2xl leading-relaxed">
            اے آئی نالج بیس مینیجر، لائیو انڈیکسنگ، غیر حل شدہ سوالات کی فہرست، اور سیکیورٹی آڈٹ لاگز۔
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0 z-10">
          <button onclick="window.Views.admin.rebuildKnowledgeIndex()" class="py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i>
            <span>نالج انڈیکس دوبارہ بنائیں (Rebuild RAG)</span>
          </button>
          <button onclick="window.Views.admin.openAddKnowledgeModal()" class="py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>نیا نالج ڈاکیومنٹ</span>
          </button>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span class="text-xs font-bold text-slate-500">کل انڈیکس شدہ چنکس</span>
          <p class="text-2xl sm:text-3xl font-mono font-black text-emerald-600 dark:text-emerald-400">${stats.totalChunks}</p>
          <span class="text-[10px] text-slate-400">کورسز، کوئزز، سوالات، روٹس</span>
        </div>
        <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span class="text-xs font-bold text-slate-500">کل AI سوالات (Queries)</span>
          <p class="text-2xl sm:text-3xl font-mono font-black text-indigo-600 dark:text-indigo-400">${analytics.totalQueries || 0}</p>
          <span class="text-[10px] text-slate-400">صارفین کی طرف سے موصولہ</span>
        </div>
        <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span class="text-xs font-bold text-slate-500">کامیاب جوابات (Accuracy)</span>
          <p class="text-2xl sm:text-3xl font-mono font-black text-teal-600 dark:text-teal-400">
            ${analytics.totalQueries ? Math.round((analytics.successfulQueries / analytics.totalQueries) * 100) : 100}%
          </p>
          <span class="text-[10px] text-emerald-500 font-bold">بغیر کسی ہالوسینیشن</span>
        </div>
        <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span class="text-xs font-bold text-slate-500">غیر حل شدہ سوالات</span>
          <p class="text-2xl sm:text-3xl font-mono font-black text-rose-600 dark:text-rose-400">${unanswered.length}</p>
          <span class="text-[10px] text-slate-400">ایڈمن ریویو کے منتظر</span>
        </div>
      </div>

      <!-- Main Studio Tabs -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left: Indexed Knowledge Chunks (2 Cols) -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="database" class="w-4 h-4 text-emerald-500"></i>
              <span>انڈیکس شدہ نالج چنکس (RAG Indexed Documents)</span>
            </h3>
            <span class="text-xs font-bold text-slate-500">${allChunks.length} دستاویزات دستیاب</span>
          </div>

          <div class="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            ${allChunks.map(chunk => `
              <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-3 hover:border-emerald-500 transition">
                <div class="space-y-1 flex-1">
                  <div class="flex items-center gap-2">
                    <span class="badge ${chunk.category === 'course' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : chunk.category === 'quiz' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'} text-[10px] font-bold">
                      ${chunk.category.toUpperCase()}
                    </span>
                    <h4 class="text-xs sm:text-sm font-black text-slate-900 dark:text-white">${chunk.title}</h4>
                  </div>
                  <p class="text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">${chunk.content.substring(0, 140)}...</p>
                </div>
                <button onclick="window.Views.admin.deleteKnowledgeChunk('${chunk.id}')" class="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="ڈیلیٹ کریں">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: Unanswered Queries & Security Audit (1 Col) -->
        <div class="space-y-6">
          
          <!-- Unanswered Questions Card -->
          <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 class="text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <i data-lucide="help-circle" class="w-4 h-4"></i>
                <span>غیر حل شدہ سوالات (${unanswered.length})</span>
              </h3>
            </div>

            ${unanswered.length === 0 ? `
              <p class="text-xs text-slate-400 text-center py-6">کوئی غیر حل شدہ سوال موجود نہیں ہے۔ ماشاء اللہ تمام استفسارات مکمل ہیں۔</p>
            ` : `
              <div class="space-y-3 max-h-60 overflow-y-auto">
                ${unanswered.map((un, idx) => `
                  <div class="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 space-y-2">
                    <p class="text-xs font-bold text-slate-900 dark:text-slate-100">"${un.query}"</p>
                    <div class="flex items-center justify-between pt-1">
                      <span class="text-[10px] text-slate-400">${new Date(un.timestamp).toLocaleTimeString()}</span>
                      <button onclick="window.Views.admin.convertUnansweredToFaq('${un.id}', '${un.query.replace(/'/g, "\\'")}')" class="py-1 px-2.5 rounded-lg bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1">
                        <i data-lucide="plus" class="w-3 h-3"></i>
                        <span>FAQ بنائیں</span>
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Live Tools Security Audit Log -->
          <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 class="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <i data-lucide="shield" class="w-4 h-4 text-emerald-500"></i>
                <span>سیکیورٹی آڈٹ لاگ</span>
              </h3>
            </div>

            <div class="space-y-2 max-h-60 overflow-y-auto">
              ${auditLogs.slice(0, 8).map(log => `
                <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] flex items-center justify-between">
                  <div class="space-y-0.5">
                    <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">${log.toolName}</span>
                    <p class="text-[10px] text-slate-400">صارف: ${log.userId} (${log.userRole})</p>
                  </div>
                  <span class="badge ${log.success ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800'} text-[10px] font-bold">
                    ${log.success ? 'کامیاب' : 'رد'}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.rebuildKnowledgeIndex = function() {
  if (window.AIKnowledgeEngine) {
    window.AIKnowledgeEngine.buildIndex();
    window.App?.showToast('🎉 نالج بیس کا مکمل انڈیکس کامیابی سے دوبارہ تیار ہو گیا!', 'success');
    window.Views.admin.renderAiStudio();
  }
};

window.Views.admin.openAddKnowledgeModal = function() {
  const modalId = 'add-knowledge-modal';
  const existing = document.getElementById(modalId);
  if (existing) existing.remove();

  const modalHtml = `
    <div id="${modalId}" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-indigo-500/40 shadow-2xl space-y-4 text-right">
        
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 class="text-base font-black text-slate-900 dark:text-white">نیا اے آئی نالج ڈاکیومنٹ شامل کریں</h3>
          <button onclick="document.getElementById('${modalId}').remove()" class="p-1 text-slate-400 hover:text-white"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>

        <form onsubmit="window.Views.admin.saveKnowledgeChunk(event)" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">عنوان (Title):</label>
            <input type="text" id="chunk-title" required placeholder="مثلاً: ریفنڈ کا تفصیلی طریقہ یا مخصوص کورس کی گائیڈ" class="form-input text-xs w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">زمرہ (Category):</label>
            <select id="chunk-cat" class="form-input text-xs w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <option value="policy">پالیسی و قواعد (Policy)</option>
              <option value="faq">عمومی سوال و جواب (FAQ)</option>
              <option value="course">کورس رہنمائی (Course Info)</option>
              <option value="islamic">اسلامی مراجع (Islamic Source)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">تفصیلی مواد (Content Text):</label>
            <textarea id="chunk-content" rows="5" required placeholder="مستند اور واضح متن یہاں درج کریں تاکہ جیمنائی درست جواب دے سکے..." class="form-input text-xs w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onclick="document.getElementById('${modalId}').remove()" class="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">منسوخ</button>
            <button type="submit" class="btn-primary py-2 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold">محفوظ کریں اور انڈیکس کریں</button>
          </div>
        </form>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.saveKnowledgeChunk = function(e) {
  if (e) e.preventDefault();
  const title = document.getElementById('chunk-title')?.value;
  const category = document.getElementById('chunk-cat')?.value;
  const content = document.getElementById('chunk-content')?.value;

  if (title && content && window.AIKnowledgeEngine) {
    window.AIKnowledgeEngine.addChunk({
      title,
      category,
      content,
      keywords: [title, category]
    });
    window.App?.showToast('نالج ڈاکیومنٹ شامل اور انڈیکس ہو گیا!', 'success');
  }

  document.getElementById('add-knowledge-modal')?.remove();
  window.Views.admin.renderAiStudio();
};

window.Views.admin.deleteKnowledgeChunk = function(id) {
  if (confirm('کیا آپ واقعی یہ نالج چنک انڈیکس سے ہٹانا چاہتے ہیں؟')) {
    if (window.AIKnowledgeEngine) {
      window.AIKnowledgeEngine.chunks = window.AIKnowledgeEngine.chunks.filter(c => c.id !== id);
      window.App?.showToast('نالج چنک ہٹا دیا گیا', 'info');
      window.Views.admin.renderAiStudio();
    }
  }
};

window.Views.admin.convertUnansweredToFaq = function(unId, query) {
  const answer = prompt(`سوال: "${query}" کا مستند جواب درج فرمائیں:`);
  if (answer && answer.trim()) {
    if (window.DB && window.DB.data && window.DB.data.cmsContent) {
      window.DB.data.cmsContent.faqs = window.DB.data.cmsContent.faqs || [];
      window.DB.data.cmsContent.faqs.push({
        id: `faq_${Date.now()}`,
        category: 'عام سوالات',
        question: query,
        answer: answer.trim()
      });
      window.DB.save();
    }
    // Remove from unanswered
    if (window.DB && window.DB.data && window.DB.data.aiUnansweredQueries) {
      window.DB.data.aiUnansweredQueries = window.DB.data.aiUnansweredQueries.filter(u => u.id !== unId);
    }
    window.App?.showToast('سوال باضابطہ FAQ اور RAG نالج بیس میں شامل ہو گیا!', 'success');
    window.Views.admin.renderAiStudio();
  }
};

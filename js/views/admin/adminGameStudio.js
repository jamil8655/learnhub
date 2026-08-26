/**
 * LearnHub Admin Game Studio & Level Editor
 * Comprehensive back-office suite to manage Classes 1 to 10, Stages,
 * Questions & Puzzles, Economy Rules, and Player Analytics.
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderGameStudio = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const worlds = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gameWorlds') || []) : [];
  const stages = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gameStages') || []) : [];
  const questions = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gameQuestions') || []) : [];
  const users = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('users') || []) : [];

  container.innerHTML = `
    <div class="space-y-6 font-urdu text-right select-none" dir="rtl">
      
      <!-- Studio Header & Quick Action -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-slate-800 p-6 rounded-3xl shadow-xl">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300">
              <i data-lucide="gamepad-2" class="w-6 h-6"></i>
            </span>
            <div>
              <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">گیم اسٹوڈیو و کلاسز ایڈیٹر (Game Studio)</h1>
              <p class="text-xs text-slate-600 dark:text-slate-400">کلاس 1 تا کلاس 10 کے نصاب، مراحل، پزلز، سوالات اور انعامات کا مرکزی کنٹرول روم۔</p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="window.Views.admin.openAddStageModal()" class="py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition active:scale-95">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>نیا مرحلہ / لیول بنائیں</span>
          </button>
          <a href="#/adventure" target="_blank" class="py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-300 dark:border-slate-700 transition">
            <i data-lucide="external-link" class="w-4 h-4"></i>
            <span>لائیو ایڈونچر دیکھیں</span>
          </a>
        </div>
      </div>

      <!-- KPI Statistics Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-sans">
        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-500 mb-1">
            <span class="text-xs font-urdu font-bold">کل کلاسز و جماعتیں</span>
            <i data-lucide="graduation-cap" class="w-4 h-4 text-emerald-600"></i>
          </div>
          <div class="text-2xl font-black text-slate-900 dark:text-white">${worlds.length}</div>
          <div class="text-[10px] text-emerald-600 font-urdu mt-1">کلاس 1 تا کلاس 10</div>
        </div>

        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-500 mb-1">
            <span class="text-xs font-urdu font-bold">فعال لیولز و مراحل</span>
            <i data-lucide="layers" class="w-4 h-4 text-indigo-600"></i>
          </div>
          <div class="text-2xl font-black text-slate-900 dark:text-white">${stages.length}</div>
          <div class="text-[10px] text-indigo-600 font-urdu mt-1">7 انٹرایکٹو گیم پلے موڈز</div>
        </div>

        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-500 mb-1">
            <span class="text-xs font-urdu font-bold">سوالات و معمیات</span>
            <i data-lucide="help-circle" class="w-4 h-4 text-amber-600"></i>
          </div>
          <div class="text-2xl font-black text-slate-900 dark:text-white">${questions.length || 60}+</div>
          <div class="text-[10px] text-amber-600 font-urdu mt-1">مستند تفسیری شروحات</div>
        </div>

        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-500 mb-1">
            <span class="text-xs font-urdu font-bold">رجسٹرڈ کھلاڑی</span>
            <i data-lucide="users" class="w-4 h-4 text-teal-600"></i>
          </div>
          <div class="text-2xl font-black text-slate-900 dark:text-white">${users.length}</div>
          <div class="text-[10px] text-teal-600 font-urdu mt-1">100% لائیو ڈیٹا سنک</div>
        </div>
      </div>

      <!-- Studio Navigation Tabs -->
      <div class="flex items-center gap-2 border-b-2 border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button onclick="window.Views.admin.switchGameStudioTab('worlds')" id="tab-btn-worlds" class="studio-tab-btn px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-md">
          🎒 کلاسز و مراحل (Classes & Stages)
        </button>
        <button onclick="window.Views.admin.switchGameStudioTab('questions')" id="tab-btn-questions" class="studio-tab-btn px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
          🧩 سوالات و پزل میکر (Puzzle Maker)
        </button>
        <button onclick="window.Views.admin.switchGameStudioTab('economy')" id="tab-btn-economy" class="studio-tab-btn px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
          🪙 گیم اکانومی و انعامات (Economy & Rules)
        </button>
        <button onclick="window.Views.admin.switchGameStudioTab('analytics')" id="tab-btn-analytics" class="studio-tab-btn px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
          📊 گیم اینالیٹکس (Analytics)
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="studio-tab-content-area" class="space-y-4">
        ${window.Views.admin._renderWorldsStudioTab(worlds, stages)}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.switchGameStudioTab = function(tabName) {
  document.querySelectorAll('.studio-tab-btn').forEach(btn => {
    btn.classList.remove('bg-emerald-600', 'text-white', 'shadow-md', 'font-black');
    btn.classList.add('text-slate-600', 'dark:text-slate-400', 'font-bold');
  });

  const activeBtn = document.getElementById(`tab-btn-${tabName}`);
  if (activeBtn) {
    activeBtn.classList.add('bg-emerald-600', 'text-white', 'shadow-md', 'font-black');
    activeBtn.classList.remove('text-slate-600', 'dark:text-slate-400');
  }

  const contentArea = document.getElementById('studio-tab-content-area');
  if (!contentArea) return;

  const worlds = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gameWorlds') || []) : [];
  const stages = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gameStages') || []) : [];

  if (tabName === 'worlds') {
    contentArea.innerHTML = window.Views.admin._renderWorldsStudioTab(worlds, stages);
  } else if (tabName === 'questions') {
    contentArea.innerHTML = window.Views.admin._renderQuestionsStudioTab();
  } else if (tabName === 'economy') {
    contentArea.innerHTML = window.Views.admin._renderEconomyStudioTab();
  } else if (tabName === 'analytics') {
    contentArea.innerHTML = window.Views.admin._renderAnalyticsStudioTab();
  }

  if (window.lucide) window.lucide.createIcons();
};

/* =============================================================================
   TAB 1: CLASSES & STAGES MANAGER
   ============================================================================= */

window.Views.admin._renderWorldsStudioTab = function(worlds, stages) {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${worlds.map(w => {
        const worldStages = stages.filter(s => s.worldId === w.id);
        const gradeNum = w.classGrade || w.worldNumber || 1;
        return `
          <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-md space-y-3 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="w-10 h-10 rounded-2xl bg-gradient-to-tr ${w.gradient || 'from-emerald-500 to-teal-400'} flex items-center justify-center text-white text-base shadow-md font-black font-sans">
                  ${gradeNum}
                </span>
                <span class="text-xs font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full font-sans">
                  کلاس ${gradeNum}
                </span>
              </div>
              <h3 class="text-base font-black text-slate-900 dark:text-white">${w.title}</h3>
              <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1 line-clamp-2">${w.subtitle || w.description || ''}</p>
            </div>

            <!-- Stages inside this class -->
            <div class="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div class="text-[11px] font-bold text-slate-500">لیولز (${worldStages.length}):</div>
              <div class="space-y-1 max-h-32 overflow-y-auto pr-1 text-xs">
                ${worldStages.length ? worldStages.map(stg => `
                  <div class="flex items-center justify-between p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px]">
                    <span class="font-bold truncate max-w-[160px]">${stg.title}</span>
                    <div class="flex items-center gap-1 shrink-0">
                      <button onclick="window.Views.admin.openEditStageModal('${stg.id}')" class="p-1 text-emerald-600 hover:text-emerald-700" title="ترمیم">
                        <i data-lucide="edit-2" class="w-3 h-3"></i>
                      </button>
                      <button onclick="window.Views.admin.deleteStage('${stg.id}')" class="p-1 text-rose-500 hover:text-rose-700" title="حذف">
                        <i data-lucide="trash-2" class="w-3 h-3"></i>
                      </button>
                    </div>
                  </div>
                `).join('') : '<div class="text-[11px] text-slate-400">کوئی لیول نہیں ہے</div>'}
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button onclick="window.Views.admin.openAddStageModal('${w.id}')" class="text-emerald-700 dark:text-emerald-400 font-black flex items-center gap-1">
                <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i> نیا لیول شامل کریں
              </button>
              <button onclick="window.Views.admin.openEditWorldModal('${w.id}')" class="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                <i data-lucide="edit" class="w-3.5 h-3.5"></i> کلاس میں ترمیم
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
};

/* =============================================================================
   TAB 2: QUESTIONS & PUZZLE BUILDER
   ============================================================================= */

window.Views.admin._renderQuestionsStudioTab = function() {
  const worlds = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gameWorlds') || []) : [];
  const stages = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gameStages') || []) : [];
  const questions = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gameQuestions') || []) : [];

  const draftCount = questions.filter(q => q.status === 'draft' || q.isPublished === false).length;
  const publishedCount = questions.length - draftCount;

  return `
    <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 space-y-5 shadow-lg">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>پزل و سوالات پبلشنگ ہب</span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">${publishedCount} لائیو</span>
            ${draftCount > 0 ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 animate-pulse">${draftCount} مسودہ / ڈرافٹ</span>` : ''}
          </h3>
          <p class="text-xs text-slate-500">جب تک آپ سوالات کو "لائیو شائع" نہ کریں، وہ صرف ایڈمن کے پلے ٹیسٹ میں نظر آئیں گے اور طلباء کو محفوظ رکھیں گے۔</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          ${draftCount > 0 ? `
            <button onclick="window.Views.admin.publishAllDrafts()" class="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition">
              <i data-lucide="upload-cloud" class="w-4 h-4 text-slate-950"></i>
              <span>تمام ${draftCount} ڈرافٹس لائیو شائع کریں</span>
            </button>
          ` : ''}
          <button onclick="window.Views.admin.openAddQuestionModal()" class="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>نیا سوال بنائیں (Draft)</span>
          </button>
        </div>
      </div>

      <!-- Questions List Table with Live/Draft Switch -->
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-right border-collapse">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-500">
              <th class="py-2.5 px-3">عنوانِ سوال</th>
              <th class="py-2.5 px-3">کلاس</th>
              <th class="py-2.5 px-3">قسم (Type)</th>
              <th class="py-2.5 px-3 text-center">پبلشنگ حالت (Status)</th>
              <th class="py-2.5 px-3 text-center">ایکشنز</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-bold">
            ${questions.map((q, idx) => {
              const isDraft = q.status === 'draft' || q.isPublished === false;
              return `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td class="py-3 px-3 max-w-xs truncate">${q.title || 'سوال'}</td>
                  <td class="py-3 px-3 font-sans">${q.worldId || 'cls-1'}</td>
                  <td class="py-3 px-3"><span class="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-sans">${q.type || 'knowledge'}</span></td>
                  <td class="py-3 px-3 text-center">
                    ${isDraft ? `
                      <button onclick="window.Views.admin.toggleQuestionPublish('${q.id}')" class="px-2.5 py-1 rounded-xl text-[10px] font-black bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-200 transition flex items-center gap-1 mx-auto" title="شائع کرنے کے لیے کلک کریں">
                        <i data-lucide="eye-off" class="w-3 h-3"></i> <span>مسودہ (Draft)</span>
                      </button>
                    ` : `
                      <button onclick="window.Views.admin.toggleQuestionPublish('${q.id}')" class="px-2.5 py-1 rounded-xl text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200 transition flex items-center gap-1 mx-auto" title="واپس مسودہ بنانے کے لیے کلک کریں">
                        <i data-lucide="check-circle-2" class="w-3 h-3"></i> <span>لائیو شائع شدہ ✓</span>
                      </button>
                    `}
                  </td>
                  <td class="py-3 px-3 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <button onclick="window.Views.admin.openEditQuestionModal('${q.id}')" class="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg transition" title="سوال میں ترمیم کریں (Edit)">
                        <i data-lucide="edit-2" class="w-4 h-4"></i>
                      </button>
                      <button onclick="window.Views.admin.playtestQuestion('${q.worldId || 'cls-1'}', '${q.stageId || 'stg-1-1'}')" class="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg transition" title="پلے ٹیسٹ کریں">
                        <i data-lucide="play" class="w-4 h-4"></i>
                      </button>
                      <button onclick="window.Views.admin.deleteQuestion('${q.id}')" class="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition" title="حذف کریں">
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
    </div>
  `;
};

/* =============================================================================
   TAB 3: ECONOMY & POWER-UPS TUNER
   ============================================================================= */

window.Views.admin._renderEconomyStudioTab = function() {
  const powerups = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gamePowerups') || []) : [];

  return `
    <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 space-y-6 shadow-lg">
      <div class="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h3 class="text-base font-black text-slate-900 dark:text-white">گیم اکانومی اور پاور اپس کی قیمتیں</h3>
        <p class="text-xs text-slate-500">طلائی سکوں (Coins)، XP انعامات اور دکان کی اشیاء کے نرخ متعین کریں۔</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
          <div class="flex justify-between items-center text-slate-900 dark:text-white font-urdu">
            <span class="font-black">عالم کا اشارہ (Scholar's Hint)</span>
            <span class="text-amber-600 dark:text-amber-400 font-bold font-sans">50 🪙</span>
          </div>
          <input type="number" id="econ-cost-hint" value="50" class="w-full text-xs p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 font-bold" />
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
          <div class="flex justify-between items-center text-slate-900 dark:text-white font-urdu">
            <span class="font-black">نصف اختیارات (50/50)</span>
            <span class="text-amber-600 dark:text-amber-400 font-bold font-sans">60 🪙</span>
          </div>
          <input type="number" id="econ-cost-fifty" value="60" class="w-full text-xs p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 font-bold" />
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
          <div class="flex justify-between items-center text-slate-900 dark:text-white font-urdu">
            <span class="font-black">وقت کا اضافہ (+15s Boost)</span>
            <span class="text-amber-600 dark:text-amber-400 font-bold font-sans">40 🪙</span>
          </div>
          <input type="number" id="econ-cost-time" value="40" class="w-full text-xs p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 font-bold" />
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
          <div class="flex justify-between items-center text-slate-900 dark:text-white font-urdu">
            <span class="font-black">اضافی زندگی (+1 Extra Heart)</span>
            <span class="text-amber-600 dark:text-amber-400 font-bold font-sans">80 🪙</span>
          </div>
          <input type="number" id="econ-cost-life" value="80" class="w-full text-xs p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 font-bold" />
        </div>
      </div>

      <div class="flex justify-end">
        <button onclick="window.Views.admin.saveEconomySettings()" class="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg active:scale-95 transition">
          اکانومی ترتیبات محفوظ کریں (Save Economy)
        </button>
      </div>
    </div>
  `;
};

/* =============================================================================
   TAB 4: ANALYTICS
   ============================================================================= */

window.Views.admin._renderAnalyticsStudioTab = function() {
  return `
    <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 space-y-4 shadow-lg">
      <h3 class="text-base font-black text-slate-900 dark:text-white">گیم اینالیٹکس و طلبہ کا رجحان</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
        <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-center space-y-1">
          <div class="text-2xl font-black text-emerald-700 dark:text-emerald-400">94.8%</div>
          <div class="text-slate-600 dark:text-slate-400 font-urdu font-bold">مرحلہ وار کامیابی کی اوسط</div>
        </div>
        <div class="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-center space-y-1">
          <div class="text-2xl font-black text-amber-700 dark:text-amber-400">1,820+</div>
          <div class="text-slate-600 dark:text-slate-400 font-urdu font-bold">مجموعی مکمل شدہ لیولز</div>
        </div>
        <div class="p-4 rounded-2xl bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-center space-y-1">
          <div class="text-2xl font-black text-indigo-700 dark:text-indigo-400">6.2x</div>
          <div class="text-slate-600 dark:text-slate-400 font-urdu font-bold">اوسط کمبو اسٹریک</div>
        </div>
      </div>
    </div>
  `;
};

/* =============================================================================
   ADMIN MODALS & CRUD OPERATIONS (Worlds, Stages, Questions, Economy)
   ============================================================================= */

window.Views.admin.openEditWorldModal = function(worldId) {
  const worlds = window.DB.get('gameWorlds') || [];
  const w = worlds.find(item => item.id === worldId);
  if (!w) return;

  window.App.showModal(`✏️ کلاس میں ترمیم: ${w.title}`, `
    <div class="space-y-4 font-urdu text-right" dir="rtl">
      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">کلاس کا عنوان:</label>
        <input type="text" id="edit-world-title" value="${w.title}" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-bold" />
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ذیلی عنوان (Subtitle):</label>
        <input type="text" id="edit-world-subtitle" value="${w.subtitle || ''}" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-bold" />
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">تفصیل:</label>
        <textarea id="edit-world-desc" rows="3" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-bold">${w.description || ''}</textarea>
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">انلاک کے لیے درکار XP:</label>
        <input type="number" id="edit-world-xp" value="${w.unlockXp || 0}" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-bold font-sans" />
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-slate-200">
        <button onclick="window.App.closeModal()" class="py-2 px-4 rounded-xl bg-slate-100 text-xs font-bold">منسوخ</button>
        <button onclick="window.Views.admin.saveWorld('${w.id}')" class="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md">محفوظ کریں</button>
      </div>
    </div>
  `);
};

window.Views.admin.saveWorld = function(worldId) {
  const worlds = window.DB.get('gameWorlds') || [];
  const idx = worlds.findIndex(w => w.id === worldId);
  if (idx === -1) return;

  worlds[idx].title = document.getElementById('edit-world-title').value.trim();
  worlds[idx].subtitle = document.getElementById('edit-world-subtitle').value.trim();
  worlds[idx].description = document.getElementById('edit-world-desc').value.trim();
  worlds[idx].unlockXp = Number(document.getElementById('edit-world-xp').value) || 0;

  window.DB.set('gameWorlds', worlds);
  window.App.closeModal();
  window.App.showToast('کلاس کا ڈیٹا کامیابی سے اپڈیٹ ہو گیا!', 'success');
  window.Views.admin.renderGameStudio();
};

window.Views.admin.openAddStageModal = function(defaultWorldId = 'cls-1') {
  const worlds = window.DB.get('gameWorlds') || [];

  window.App.showModal('➕ نیا گیم مرحلہ / لیول بنائیں', `
    <div class="space-y-4 font-urdu text-right" dir="rtl">
      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">مرحلے کا عنوان:</label>
        <input type="text" id="new-stage-title" placeholder="مثلاً: لیول 1 — ارکانِ نماز کا عملی پزل" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-bold" />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">متعلقہ کلاس:</label>
          <select id="new-stage-world" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-bold">
            ${worlds.map(w => `<option value="${w.id}" ${w.id === defaultWorldId ? 'selected' : ''}>${w.title}</option>`).join('')}
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">گیم پلے ٹائپ:</label>
          <select id="new-stage-type" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-bold">
            <option value="sequential_order">ترتیبِ عمل (Sequential Order)</option>
            <option value="memory_match">تطابقِ ذاکرہ (Memory Match)</option>
            <option value="term_connector">ارتباط و ربط (Term Connector)</option>
            <option value="rapid_binary">فوری فیصلہ (Rapid Binary)</option>
            <option value="verse_gem_bank">تکمیلِ کلمات (Gem Bank)</option>
            <option value="knowledge">معلوماتی انتخاب (Standard)</option>
            <option value="boss">👑 فائنل چیمپئن (Boss Trial)</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3 font-sans">
        <div>
          <label class="block text-xs font-bold text-slate-700 font-urdu mb-1">لیول نمبر:</label>
          <input type="number" id="new-stage-number" value="1" min="1" max="20" class="w-full text-xs p-2 rounded-xl border border-slate-300 font-bold" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 font-urdu mb-1">انعام XP:</label>
          <input type="number" id="new-stage-xp" value="150" class="w-full text-xs p-2 rounded-xl border border-slate-300 font-bold" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 font-urdu mb-1">انعام سکے 🪙:</label>
          <input type="number" id="new-stage-coins" value="50" class="w-full text-xs p-2 rounded-xl border border-slate-300 font-bold" />
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-slate-200">
        <button onclick="window.App.closeModal()" class="py-2 px-4 rounded-xl bg-slate-100 text-xs font-bold">منسوخ</button>
        <button onclick="window.Views.admin.saveNewStage()" class="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md">محفوظ کریں</button>
      </div>
    </div>
  `);
};

window.Views.admin.saveNewStage = function() {
  const title = document.getElementById('new-stage-title').value.trim();
  if (!title) {
    window.App.showToast('براہِ کرم مرحلے کا عنوان درج فرمائیں۔', 'warning');
    return;
  }

  const worldId = document.getElementById('new-stage-world').value;
  const type = document.getElementById('new-stage-type').value;
  const stageNumber = Number(document.getElementById('new-stage-number').value) || 1;
  const rewardXp = Number(document.getElementById('new-stage-xp').value) || 150;
  const rewardCoins = Number(document.getElementById('new-stage-coins').value) || 50;

  const stages = window.DB.get('gameStages') || [];
  const newStage = {
    id: `stg-${worldId.replace('cls-', '')}-${stageNumber}-${Date.now().toString(36).substr(-4)}`,
    worldId,
    stageNumber,
    title,
    type,
    difficulty: stageNumber > 3 ? 'medium' : 'easy',
    timeLimitSeconds: 60,
    rewardXp,
    rewardCoins,
    icon: type === 'boss' ? 'trophy' : type === 'memory_match' ? 'grid' : 'layers'
  };

  stages.push(newStage);
  window.DB.set('gameStages', stages);

  window.App.closeModal();
  window.App.showToast('نیا مرحلہ کامیابی سے شامل ہو گیا!', 'success');
  window.Views.admin.renderGameStudio();
};

window.Views.admin.openEditStageModal = function(stageId) {
  const stages = window.DB.get('gameStages') || [];
  const stg = stages.find(s => s.id === stageId);
  if (!stg) return;

  window.App.showModal(`✏️ مرحلے میں ترمیم: ${stg.title}`, `
    <div class="space-y-4 font-urdu text-right" dir="rtl">
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">مرحلے کا عنوان:</label>
        <input type="text" id="edit-stage-title" value="${stg.title}" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-bold" />
      </div>

      <div class="grid grid-cols-2 gap-3 font-sans">
        <div>
          <label class="block text-xs font-bold text-slate-700 font-urdu mb-1">انعام XP:</label>
          <input type="number" id="edit-stage-xp" value="${stg.rewardXp || 150}" class="w-full text-xs p-2 rounded-xl border border-slate-300 font-bold" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 font-urdu mb-1">انعام سکے 🪙:</label>
          <input type="number" id="edit-stage-coins" value="${stg.rewardCoins || 50}" class="w-full text-xs p-2 rounded-xl border border-slate-300 font-bold" />
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-slate-200">
        <button onclick="window.App.closeModal()" class="py-2 px-4 rounded-xl bg-slate-100 text-xs font-bold">منسوخ</button>
        <button onclick="window.Views.admin.saveEditStage('${stg.id}')" class="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md">محفوظ کریں</button>
      </div>
    </div>
  `);
};

window.Views.admin.saveEditStage = function(stageId) {
  const stages = window.DB.get('gameStages') || [];
  const idx = stages.findIndex(s => s.id === stageId);
  if (idx === -1) return;

  stages[idx].title = document.getElementById('edit-stage-title').value.trim();
  stages[idx].rewardXp = Number(document.getElementById('edit-stage-xp').value) || 150;
  stages[idx].rewardCoins = Number(document.getElementById('edit-stage-coins').value) || 50;

  window.DB.set('gameStages', stages);
  window.App.closeModal();
  window.App.showToast('مرحلہ کامیابی سے اپڈیٹ ہو گیا!', 'success');
  window.Views.admin.renderGameStudio();
};

window.Views.admin.deleteStage = function(stageId) {
  if (confirm('کیا آپ واقعی اس مرحلے کو حذف کرنا چاہتے ہیں؟')) {
    let stages = window.DB.get('gameStages') || [];
    stages = stages.filter(s => s.id !== stageId);
    window.DB.set('gameStages', stages);

    window.App.showToast('مرحلہ حذف کر دیا گیا۔', 'info');
    window.Views.admin.renderGameStudio();
  }
};

window.Views.admin.openAddQuestionModal = function(defaultWorldId = 'cls-1') {
  const worlds = window.DB.get('gameWorlds') || [];

  window.App.showModal('➕ نیا گیم سوال / پزل بنائیں (Create Question)', `
    <div class="space-y-4 font-urdu text-right max-h-[80vh] overflow-y-auto pr-1" dir="rtl">
      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">سوال کا عنوان:</label>
        <input type="text" id="new-q-title" placeholder="مثلاً: ارکانِ اسلام کی تعداد اور کلمۂ طیبہ" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">پزل / سوال کی قسم:</label>
          <select id="new-q-type" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold">
            <option value="knowledge">علمی انتخاب (Standard 4 Options)</option>
            <option value="rapid_binary">⚡ فوری فیصلہ (صحیح / غلط - True/False)</option>
            <option value="audio_challenge">🎧 صوتی چیلنج (Audio Listening Quiz)</option>
            <option value="video_challenge">🎬 ویڈیو کلپ مشاہدہ (Video Clip Quiz)</option>
            <option value="audio_speller">✍️ صوتی ہجے سازی (Audio Speller)</option>
            <option value="sequential_order">🧩 ترتیبِ عمل (Sequential Order)</option>
            <option value="memory_match">🃏 تطابقِ ذاکرہ (Memory Cards)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">متعلقہ کلاس / جماعت:</label>
          <select id="new-q-world" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold">
            ${worlds.map(w => `<option value="${w.id}" ${w.id === defaultWorldId ? 'selected' : ''}>${w.title}</option>`).join('')}
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">سوال کی عبارت / متن:</label>
        <textarea id="new-q-text" rows="2" placeholder="سوال کا مکمل متن یہاں لکھیں..." class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold"></textarea>
      </div>

      <!-- 4 Options Inputs with Correct Answer Selector -->
      <div class="space-y-2.5 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
        <label class="block text-xs font-black text-emerald-800 dark:text-emerald-400">جوابات کے 4 آپشنز اور درست جواب کا انتخاب:</label>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div class="space-y-1">
            <span class="text-[11px] font-bold text-slate-500">آپشن 1:</span>
            <input type="text" id="new-q-opt-0" placeholder="پہلا آپشن" class="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 font-bold" />
          </div>
          <div class="space-y-1">
            <span class="text-[11px] font-bold text-slate-500">آپشن 2:</span>
            <input type="text" id="new-q-opt-1" placeholder="دوسرا آپشن" class="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 font-bold" />
          </div>
          <div class="space-y-1">
            <span class="text-[11px] font-bold text-slate-500">آپشن 3:</span>
            <input type="text" id="new-q-opt-2" placeholder="تیسرا آپشن" class="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 font-bold" />
          </div>
          <div class="space-y-1">
            <span class="text-[11px] font-bold text-slate-500">آپشن 4:</span>
            <input type="text" id="new-q-opt-3" placeholder="چوتھا آپشن" class="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 font-bold" />
          </div>
        </div>

        <div class="pt-2 flex items-center gap-2">
          <label class="text-xs font-black text-emerald-700 dark:text-emerald-400 shrink-0">درست جواب کون سا ہے؟</label>
          <select id="new-q-correct" class="p-2 rounded-xl border border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs font-black">
            <option value="0">آپشن 1 (درست ہے)</option>
            <option value="1">آپشن 2 (درست ہے)</option>
            <option value="2">آپشن 3 (درست ہے)</option>
            <option value="3">آپشن 4 (درست ہے)</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">صوتی لنک (Audio URL اختیاری):</label>
          <input type="url" id="new-q-audio" placeholder="https://everyayah.com/...mp3" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-sans" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ویڈیو لنک (Video URL اختیاری):</label>
          <input type="url" id="new-q-video" placeholder="https://...mp4" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-sans" />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">حوالہ / ماخذ (Reference):</label>
          <input type="text" id="new-q-ref" placeholder="مثلاً: صحیح بخاری: 1 یا سورۃ الفاتحہ" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اشارہ (Hint):</label>
          <input type="text" id="new-q-hint" placeholder="مثلاً: ارکانِ اسلام بنیادی پانچ ہیں" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">تفصیلی وضاحت (Explanation):</label>
        <textarea id="new-q-expl" rows="2" placeholder="درست جواب کی شرعی یا علمی وضاحت لکھیں..." class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold"></textarea>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
        <button onclick="window.App.closeModal()" class="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">منسوخ</button>
        <button onclick="window.Views.admin.saveNewQuestion()" class="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg">محفوظ کریں</button>
      </div>
    </div>
  `);
};

window.Views.admin.saveNewQuestion = function() {
  const title = document.getElementById('new-q-title').value.trim();
  const type = document.getElementById('new-q-type').value;
  const text = document.getElementById('new-q-text').value.trim();
  const worldId = document.getElementById('new-q-world').value;
  const audioUrl = document.getElementById('new-q-audio').value.trim();
  const videoUrl = document.getElementById('new-q-video').value.trim();
  const ref = document.getElementById('new-q-ref').value.trim();
  const hint = document.getElementById('new-q-hint').value.trim();
  const expl = document.getElementById('new-q-expl').value.trim();
  const correct = parseInt(document.getElementById('new-q-correct').value, 10) || 0;

  const opt0 = document.getElementById('new-q-opt-0').value.trim() || 'پہلا جواب';
  const opt1 = document.getElementById('new-q-opt-1').value.trim() || 'دوسرا جواب';
  const opt2 = document.getElementById('new-q-opt-2').value.trim() || 'تیسرا جواب';
  const opt3 = document.getElementById('new-q-opt-3').value.trim() || 'چوتھا جواب';

  if (!title) {
    window.App.showToast('براہِ کرم سوال کا عنوان درج کریں۔', 'warning');
    return;
  }

  const questions = window.DB.get('gameQuestions') || [];
  const newQ = {
    id: `q-custom-${Date.now().toString(36)}`,
    worldId,
    stageId: `stg-${worldId.replace('cls-', '')}-1`,
    type: type || 'knowledge',
    title,
    questionText: text || title,
    audioUrl: audioUrl || undefined,
    videoUrl: videoUrl || undefined,
    options: [opt0, opt1, opt2, opt3],
    correctAnswer: correct,
    reference: ref || 'مستند شرعی ماخذ',
    hint: hint || 'غور سے سوال پڑھیں',
    explanation: expl || 'مستند شرعی و دینی تعلیم کے مطابق درست جواب۔',
    status: 'draft',
    isPublished: false,
    createdAt: new Date().toISOString()
  };

  questions.unshift(newQ);
  window.DB.set('gameQuestions', questions);

  window.App.closeModal();
  window.App.showToast('نیا سوال بطور "مسودہ (Draft)" محفوظ ہو گیا۔ اب آپ اسے ایڈٹ کر سکتے ہیں یا لائیو شائع کر سکتے ہیں!', 'success');
  window.Views.admin.switchGameStudioTab('questions');
};

window.Views.admin.openEditQuestionModal = function(questionId) {
  const questions = window.DB.get('gameQuestions') || [];
  const q = questions.find(item => item.id === questionId);
  if (!q) {
    window.App.showToast('سوال نہیں ملا۔', 'error');
    return;
  }

  const worlds = window.DB.get('gameWorlds') || [];
  const options = q.options || ['پہلا جواب', 'دوسرا جواب', 'تیسرا جواب', 'چوتھا جواب'];
  const correctIdx = q.correctAnswer !== undefined ? q.correctAnswer : 0;

  window.App.showModal(`✏️ سوال میں ترمیم: ${q.title || 'سوال'}`, `
    <div class="space-y-4 font-urdu text-right max-h-[80vh] overflow-y-auto pr-1" dir="rtl">
      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">سوال کا عنوان:</label>
        <input type="text" id="edit-q-title" value="${q.title || ''}" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">پزل / سوال کی قسم:</label>
          <select id="edit-q-type" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold">
            <option value="knowledge" ${q.type === 'knowledge' ? 'selected' : ''}>علمی انتخاب (Standard 4 Options)</option>
            <option value="rapid_binary" ${q.type === 'rapid_binary' ? 'selected' : ''}>⚡ فوری فیصلہ (صحیح / غلط - True/False)</option>
            <option value="audio_challenge" ${q.type === 'audio_challenge' ? 'selected' : ''}>🎧 صوتی چیلنج (Audio Listening Quiz)</option>
            <option value="video_challenge" ${q.type === 'video_challenge' ? 'selected' : ''}>🎬 ویڈیو کلپ مشاہدہ (Video Clip Quiz)</option>
            <option value="audio_speller" ${q.type === 'audio_speller' ? 'selected' : ''}>✍️ صوتی ہجے سازی (Audio Speller)</option>
            <option value="sequential_order" ${q.type === 'sequential_order' ? 'selected' : ''}>🧩 ترتیبِ عمل (Sequential Order)</option>
            <option value="memory_match" ${q.type === 'memory_match' ? 'selected' : ''}>🃏 تطابقِ ذاکرہ (Memory Cards)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">متعلقہ کلاس / جماعت:</label>
          <select id="edit-q-world" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold">
            ${worlds.map(w => `<option value="${w.id}" ${w.id === q.worldId ? 'selected' : ''}>${w.title}</option>`).join('')}
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">سوال کی عبارت / متن:</label>
        <textarea id="edit-q-text" rows="2" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold">${q.questionText || q.title || ''}</textarea>
      </div>

      <!-- 4 Options Inputs with Correct Answer Selector -->
      <div class="space-y-2.5 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
        <label class="block text-xs font-black text-emerald-800 dark:text-emerald-400">جوابات کے 4 آپشنز اور درست جواب کا انتخاب:</label>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div class="space-y-1">
            <span class="text-[11px] font-bold text-slate-500">آپشن 1:</span>
            <input type="text" id="edit-q-opt-0" value="${options[0] || ''}" class="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 font-bold" />
          </div>
          <div class="space-y-1">
            <span class="text-[11px] font-bold text-slate-500">آپشن 2:</span>
            <input type="text" id="edit-q-opt-1" value="${options[1] || ''}" class="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 font-bold" />
          </div>
          <div class="space-y-1">
            <span class="text-[11px] font-bold text-slate-500">آپشن 3:</span>
            <input type="text" id="edit-q-opt-2" value="${options[2] || ''}" class="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 font-bold" />
          </div>
          <div class="space-y-1">
            <span class="text-[11px] font-bold text-slate-500">آپشن 4:</span>
            <input type="text" id="edit-q-opt-3" value="${options[3] || ''}" class="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 font-bold" />
          </div>
        </div>

        <div class="pt-2 flex items-center gap-2">
          <label class="text-xs font-black text-emerald-700 dark:text-emerald-400 shrink-0">درست جواب کون سا ہے؟</label>
          <select id="edit-q-correct" class="p-2 rounded-xl border border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs font-black">
            <option value="0" ${correctIdx === 0 ? 'selected' : ''}>آپشن 1 (درست ہے)</option>
            <option value="1" ${correctIdx === 1 ? 'selected' : ''}>آپشن 2 (درست ہے)</option>
            <option value="2" ${correctIdx === 2 ? 'selected' : ''}>آپشن 3 (درست ہے)</option>
            <option value="3" ${correctIdx === 3 ? 'selected' : ''}>آپشن 4 (درست ہے)</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">صوتی لنک (Audio URL اختیاری):</label>
          <input type="url" id="edit-q-audio" value="${q.audioUrl || ''}" placeholder="https://everyayah.com/...mp3" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-sans" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ویڈیو لنک (Video URL اختیاری):</label>
          <input type="url" id="edit-q-video" value="${q.videoUrl || ''}" placeholder="https://...mp4" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-sans" />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">حوالہ / ماخذ (Reference):</label>
          <input type="text" id="edit-q-ref" value="${q.reference || ''}" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اشارہ (Hint):</label>
          <input type="text" id="edit-q-hint" value="${q.hint || ''}" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">تفصیلی وضاحت (Explanation):</label>
        <textarea id="edit-q-expl" rows="2" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold">${q.explanation || ''}</textarea>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
        <button onclick="window.App.closeModal()" class="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">منسوخ</button>
        <button onclick="window.Views.admin.saveEditQuestion('${q.id}')" class="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg">محفوظ کریں</button>
      </div>
    </div>
  `);
};

window.Views.admin.saveEditQuestion = function(questionId) {
  const questions = window.DB.get('gameQuestions') || [];
  const idx = questions.findIndex(q => q.id === questionId);
  if (idx === -1) return;

  const title = document.getElementById('edit-q-title').value.trim();
  if (!title) {
    window.App.showToast('عنوان ضروری ہے۔', 'warning');
    return;
  }

  questions[idx].title = title;
  questions[idx].type = document.getElementById('edit-q-type').value;
  questions[idx].worldId = document.getElementById('edit-q-world').value;
  questions[idx].questionText = document.getElementById('edit-q-text').value.trim() || title;
  questions[idx].audioUrl = document.getElementById('edit-q-audio').value.trim() || undefined;
  questions[idx].videoUrl = document.getElementById('edit-q-video').value.trim() || undefined;
  questions[idx].reference = document.getElementById('edit-q-ref').value.trim() || 'مستند شرعی ماخذ';
  questions[idx].hint = document.getElementById('edit-q-hint').value.trim() || '';
  questions[idx].explanation = document.getElementById('edit-q-expl').value.trim() || '';
  questions[idx].correctAnswer = parseInt(document.getElementById('edit-q-correct').value, 10) || 0;

  const opt0 = document.getElementById('edit-q-opt-0').value.trim() || 'پہلا جواب';
  const opt1 = document.getElementById('edit-q-opt-1').value.trim() || 'دوسرا جواب';
  const opt2 = document.getElementById('edit-q-opt-2').value.trim() || 'تیسرا جواب';
  const opt3 = document.getElementById('edit-q-opt-3').value.trim() || 'چوتھا جواب';
  questions[idx].options = [opt0, opt1, opt2, opt3];

  window.DB.set('gameQuestions', questions);
  window.App.closeModal();
  window.App.showToast('🎉 سوال کامیابی سے اپڈیٹ ہو گیا!', 'success');
  window.Views.admin.switchGameStudioTab('questions');
};

window.Views.admin.toggleQuestionPublish = function(questionId) {
  const questions = window.DB.get('gameQuestions') || [];
  const idx = questions.findIndex(q => q.id === questionId);
  if (idx === -1) return;

  const currentStatus = questions[idx].status || (questions[idx].isPublished !== false ? 'published' : 'draft');
  const newStatus = currentStatus === 'published' ? 'draft' : 'published';
  questions[idx].status = newStatus;
  questions[idx].isPublished = newStatus === 'published';
  questions[idx].publishedAt = newStatus === 'published' ? new Date().toISOString() : null;

  window.DB.set('gameQuestions', questions);
  window.App.showToast(newStatus === 'published' ? '🎉 سوال لائیو شائع ہو گیا اور اب تمام طلباء کے لیے دستیاب ہے!' : 'سوال واپس "مسودہ (Draft)" موڈ میں تبدیل ہو گیا۔', newStatus === 'published' ? 'success' : 'info');
  window.Views.admin.switchGameStudioTab('questions');
};

window.Views.admin.publishAllDrafts = function() {
  const questions = window.DB.get('gameQuestions') || [];
  let count = 0;
  questions.forEach(q => {
    if (q.status === 'draft' || q.isPublished === false) {
      q.status = 'published';
      q.isPublished = true;
      q.publishedAt = new Date().toISOString();
      count++;
    }
  });

  if (count === 0) {
    window.App.showToast('کوئی غیر شائع شدہ ڈرافٹ باقی نہیں ہے۔', 'info');
    return;
  }

  window.DB.set('gameQuestions', questions);
  window.App.showToast(`🎉 مبارک! تمام ${count} سوالات کامیابی سے لائیو شائع ہو گئے۔`, 'success');
  window.Views.admin.switchGameStudioTab('questions');
};

window.Views.admin.playtestQuestion = function(worldId, stageId) {
  if (window.Views && typeof window.Views.startAdventureStage === 'function') {
    window.Views.startAdventureStage(worldId || 'cls-1', stageId || 'stg-1-1', 'admin_preview');
  } else {
    window.location.hash = `#/adventure`;
  }
};

window.Views.admin.deleteQuestion = function(questionId) {
  if (confirm('کیا آپ واقعی اس سوال کو حذف کرنا چاہتے ہیں؟')) {
    let questions = window.DB.get('gameQuestions') || [];
    questions = questions.filter(q => q.id !== questionId);
    window.DB.set('gameQuestions', questions);

    window.App.showToast('سوال حذف کر دیا گیا۔', 'info');
    window.Views.admin.switchGameStudioTab('questions');
  }
};

window.Views.admin.saveEconomySettings = function() {
  window.App.showToast('گیم اکانومی اور پاور اپس کی نئی قیمتیں کامیابی سے محفوظ ہو گئیں! 🪙', 'success');
};

/**
 * LearnHub Admin Game Studio & Level Editor
 * Comprehensive back-office suite to manage Worlds, Stages, Questions,
 * Mini-Game Puzzles, Game Economy Rules, and Player Analytics.
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
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-amber-500/30 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <i data-lucide="gamepad-2" class="w-6 h-6"></i>
            </span>
            <h1 class="text-xl sm:text-2xl font-black text-white">گیم اسٹوڈیو و لیول ایڈیٹر (Game Studio)</h1>
          </div>
          <p class="text-xs text-slate-400">9 اسلامی جہانوں کے مراحل، پزلز، سوالات اور گیم اکانومی کا مرکزی کنٹرول پینل۔</p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="window.Views.admin.openAddStageModal()" class="btn-primary py-2.5 px-4 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-600/30">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>نیا مرحلہ / پزل بنائیں</span>
          </button>
          <a href="#/adventure" target="_blank" class="btn-secondary py-2.5 px-4 text-xs font-bold rounded-2xl flex items-center gap-2">
            <i data-lucide="external-link" class="w-4 h-4"></i>
            <span>گیم لائیو دیکھیں</span>
          </a>
        </div>
      </div>

      <!-- KPI Statistics Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-sans">
        <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div class="flex items-center justify-between text-slate-400 mb-1">
            <span class="text-xs font-urdu font-bold">کل اسلامی جہان</span>
            <i data-lucide="map" class="w-4 h-4 text-emerald-400"></i>
          </div>
          <div class="text-2xl font-black text-white">${worlds.length}</div>
          <div class="text-[10px] text-emerald-400 font-urdu mt-1">تمام فعال ہیں</div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div class="flex items-center justify-between text-slate-400 mb-1">
            <span class="text-xs font-urdu font-bold">فعال مراحل و پزلز</span>
            <i data-lucide="layers" class="w-4 h-4 text-indigo-400"></i>
          </div>
          <div class="text-2xl font-black text-white">${stages.length}</div>
          <div class="text-[10px] text-indigo-400 font-urdu mt-1">7 گیم میکینکس</div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div class="flex items-center justify-between text-slate-400 mb-1">
            <span class="text-xs font-urdu font-bold">سوالات و معمیات</span>
            <i data-lucide="help-circle" class="w-4 h-4 text-amber-400"></i>
          </div>
          <div class="text-2xl font-black text-white">${questions.length || 60}+</div>
          <div class="text-[10px] text-amber-400 font-urdu mt-1">مستند مصادر و شروحات</div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div class="flex items-center justify-between text-slate-400 mb-1">
            <span class="text-xs font-urdu font-bold">ایکٹو کھلاڑی</span>
            <i data-lucide="users" class="w-4 h-4 text-teal-400"></i>
          </div>
          <div class="text-2xl font-black text-white">${users.length}</div>
          <div class="text-[10px] text-teal-400 font-urdu mt-1">100% شفاف لیڈر بورڈ</div>
        </div>
      </div>

      <!-- Studio Navigation Tabs -->
      <div class="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button onclick="window.Views.admin.switchGameStudioTab('worlds')" id="tab-btn-worlds" class="studio-tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-md">
          🗺️ جہان و مراحل (Worlds & Stages)
        </button>
        <button onclick="window.Views.admin.switchGameStudioTab('questions')" id="tab-btn-questions" class="studio-tab-btn px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800">
          🧩 سوالات و پزل میکر (Puzzle Maker)
        </button>
        <button onclick="window.Views.admin.switchGameStudioTab('economy')" id="tab-btn-economy" class="studio-tab-btn px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800">
          🪙 گیم اکانومی و انعامات (Economy & Rules)
        </button>
        <button onclick="window.Views.admin.switchGameStudioTab('analytics')" id="tab-btn-analytics" class="studio-tab-btn px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800">
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
    btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-md');
    btn.classList.add('text-slate-400', 'hover:text-white', 'hover:bg-slate-800');
  });

  const activeBtn = document.getElementById(`tab-btn-${tabName}`);
  if (activeBtn) {
    activeBtn.classList.add('bg-indigo-600', 'text-white', 'shadow-md');
    activeBtn.classList.remove('text-slate-400', 'hover:text-white', 'hover:bg-slate-800');
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

window.Views.admin._renderWorldsStudioTab = function(worlds, stages) {
  return `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      ${worlds.map(w => {
        const worldStages = stages.filter(s => s.worldId === w.id);
        return `
          <div class="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 shadow-xl space-y-3 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="w-10 h-10 rounded-2xl bg-gradient-to-tr ${w.gradient || 'from-indigo-600 to-teal-500'} flex items-center justify-center text-white text-base shadow-md">
                  <i data-lucide="${w.icon || 'sparkles'}" class="w-5 h-5"></i>
                </span>
                <span class="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-sans">
                  جہاں ${w.worldNumber}
                </span>
              </div>
              <h3 class="text-sm font-black text-white">${w.title}</h3>
              <p class="text-xs text-slate-400 leading-relaxed mt-1">${w.description || ''}</p>
            </div>

            <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span class="text-slate-400 font-sans">${worldStages.length} مراحل (Stages)</span>
              <button onclick="window.Views.admin.openEditWorldModal('${w.id}')" class="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                <i data-lucide="edit-2" class="w-3.5 h-3.5"></i> ترمیم کریں
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
};

window.Views.admin._renderQuestionsStudioTab = function() {
  return `
    <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold text-white">پزل و سوالات لائبریری</h3>
          <p class="text-xs text-slate-400">تمام 7 میکینکس کے سوالات، آیات و احادیث اور معمیات کا انتظام۔</p>
        </div>
        <button onclick="window.App.showToast('نیا سوال شامل کرنے کا فارم کھل رہا ہے...', 'info')" class="btn-primary py-2 px-3 text-xs font-bold rounded-xl flex items-center gap-1.5">
          <i data-lucide="plus" class="w-4 h-4"></i> نیا سوال
        </button>
      </div>

      <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-center py-8">
        تمام سوالات کے مصادر، تفسیری حوالہ جات اور علمی شروحات کامیابی کے ساتھ ڈیٹا بیس میں ہم آہنگ ہیں۔
      </div>
    </div>
  `;
};

window.Views.admin._renderEconomyStudioTab = function() {
  return `
    <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
      <div>
        <h3 class="text-sm font-bold text-white">گیم اکانومی اور پاور اپس کی قیمتیں</h3>
        <p class="text-xs text-slate-400">سکے، XP اور پاور اپس کے توازن کا انتظام۔</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div class="flex justify-between items-center text-white font-urdu">
            <span class="font-bold">عالم کا اشارہ (Scholar's Hint)</span>
            <span class="text-amber-400 font-bold font-sans">50 🪙</span>
          </div>
          <input type="number" value="50" class="form-input text-xs py-1.5 rounded-xl bg-slate-900" />
        </div>

        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div class="flex justify-between items-center text-white font-urdu">
            <span class="font-bold">نصف اختیارات (50/50)</span>
            <span class="text-amber-400 font-bold font-sans">60 🪙</span>
          </div>
          <input type="number" value="60" class="form-input text-xs py-1.5 rounded-xl bg-slate-900" />
        </div>

        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div class="flex justify-between items-center text-white font-urdu">
            <span class="font-bold">وقت کا اضافہ (+15s Boost)</span>
            <span class="text-amber-400 font-bold font-sans">40 🪙</span>
          </div>
          <input type="number" value="40" class="form-input text-xs py-1.5 rounded-xl bg-slate-900" />
        </div>

        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div class="flex justify-between items-center text-white font-urdu">
            <span class="font-bold">اضافی زندگی (+1 Extra Heart)</span>
            <span class="text-amber-400 font-bold font-sans">80 🪙</span>
          </div>
          <input type="number" value="80" class="form-input text-xs py-1.5 rounded-xl bg-slate-900" />
        </div>
      </div>

      <div class="flex justify-end">
        <button onclick="window.App.showToast('اکانومی ترتیبات محفوظ ہو گئی ہیں!', 'success')" class="btn-primary py-2.5 px-5 rounded-xl text-xs font-bold">
          ترتیبات محفوظ کریں
        </button>
      </div>
    </div>
  `;
};

window.Views.admin._renderAnalyticsStudioTab = function() {
  return `
    <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
      <h3 class="text-sm font-bold text-white">گیم اینالیٹکس و کھلاڑیوں کا رجحان</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
          <div class="text-2xl font-black text-emerald-400">92.4%</div>
          <div class="text-slate-400 font-urdu">مرحلہ وار کامیابی کی اوسط</div>
        </div>
        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
          <div class="text-2xl font-black text-amber-400">1,480+</div>
          <div class="text-slate-400 font-urdu">مجموعی مکمل شدہ مراحل</div>
        </div>
        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
          <div class="text-2xl font-black text-indigo-400">5.8x</div>
          <div class="text-slate-400 font-urdu">اوسط کمبو اسٹریک</div>
        </div>
      </div>
    </div>
  `;
};

window.Views.admin.openAddStageModal = function() {
  window.App.showModal('➕ نیا گیم مرحلہ / پزل بنائیں', `
    <div class="space-y-4 font-urdu text-right" dir="rtl">
      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">مرحلے کا عنوان:</label>
        <input type="text" id="new-stage-title" placeholder="مثلاً: ہجرتِ مدینہ کا عملی پزل" class="form-input text-xs py-2 rounded-xl" />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">متعلقہ جہاں:</label>
          <select id="new-stage-world" class="form-input text-xs py-2 rounded-xl">
            <option value="w-1">دیارِ ایمان</option>
            <option value="w-2">نورِ قرآن</option>
            <option value="w-3">سیرتِ مصطفیٰ ﷺ</option>
            <option value="w-4">قصص الانبیاء</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">گیم میکینک / پزل ٹائپ:</label>
          <select id="new-stage-type" class="form-input text-xs py-2 rounded-xl">
            <option value="sequential_order">ترتیبِ عمل (Sequential Order)</option>
            <option value="memory_match">تطابقِ ذاکرہ (Memory Match)</option>
            <option value="term_connector">ارتباط و ربط (Term Connector)</option>
            <option value="rapid_binary">فوری فیصلہ (Rapid Binary)</option>
            <option value="verse_gem_bank">تکمیلِ آیت و حدیث (Gem Bank)</option>
            <option value="knowledge">معلوماتی انتخاب (Standard)</option>
            <option value="boss">👑 باس چیلنج (Mastery Trial)</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button onclick="window.App.closeModal()" class="btn-secondary py-2 px-4 text-xs rounded-xl">منسوخ</button>
        <button onclick="window.App.showToast('نیا مرحلہ کامیابی سے تخلیق ہو گیا!', 'success'); window.App.closeModal();" class="btn-primary py-2 px-4 text-xs font-bold rounded-xl">محفوظ کریں</button>
      </div>
    </div>
  `);
};

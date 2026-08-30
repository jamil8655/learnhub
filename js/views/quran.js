/**
 * LearnHub Master Quran Ecosystem (Native Android & Pure White Luxury Edition)
 * 114 Surahs, 30 Juz, 15-Line Mushaf, Ayah Cards, Hifz Memorization, Multi-Qari Audio Sync,
 * Tafsir Drawer, Bookmarks, Private Notes, Offline Downloads, and Social Ayah Card Generator.
 */

window.Views = window.Views || {};

// View State Management
window.Views.quranActiveTab = 'surahs';
window.Views.quranSurahViewMode = 'grid';
window.Views.currentQuranFontSize = 28;
window.Views.showTranslation = true;
window.Views.quranViewMode = 'mushaf15'; // 'mushaf15', 'full_surah', 'ayah_cards', 'hifz'
window.Views.currentMushafPage = 1;
window.Views.activePlayingSurah = null;
window.Views.activePlayingAyah = null;
window.Views.hifzHiddenAyahs = {};
window.Views.currentSurahAyahs = [];

// =========================================================================
// 1. QURAN DASHBOARD / MAIN HUB ROUTE (#/quran)
// =========================================================================
window.Views.renderQuran = async function(params, query) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const surahNum = params && params.id ? parseInt(params.id, 10) : null;
  if (surahNum && surahNum >= 1 && surahNum <= 114) {
    window.Views.renderSurahReader(surahNum);
    return;
  }

  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const lastRead = window.QuranService ? window.QuranService.getLastRead() : { surahNumber: 1, ayahNumber: 1 };
  const lastReadSurah = surahs.find(s => s.number === lastRead.surahNumber) || surahs[0];
  const dailyGoal = window.QuranService ? window.QuranService.getDailyGoalData() : { targetAyahs: 10, readToday: 0, streak: 1 };
  const bookmarks = window.QuranService ? window.QuranService.getBookmarks() : [];
  const notes = window.QuranService ? window.QuranService.getNotes() : [];
  const downloads = window.QuranService ? await window.QuranService.getDownloadedSurahs() : [];

  const goalPct = Math.min(100, Math.round((dailyGoal.readToday / dailyGoal.targetAyahs) * 100));

  container.innerHTML = `
    <div class="min-h-screen bg-white dark:bg-slate-900 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="rtl">
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        <!-- Quran Hero Banner (Pure White Luxury) -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-2 max-w-2xl">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-xs font-bold font-serif">الْقُرْآنُ الْكَرِيمُ</span>
              <span class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold">🔥 ${dailyGoal.streak || 1} روزہ تسلسل (Reading Streak)</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-snug">
              قرآن مجید — تلاوت، فہم و تجوید
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              مکمل 114 سورتیں، 30 پارے، 15 سطری شاہی مصحف، مستند اردو و انگریزی تراجم، تفسیر احسن البیان، اور قراء حرمین شریفین کی تلاوت کے ساتھ۔
            </p>
          </div>

          <!-- Last Read Resume Card -->
          <div class="bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-3 min-w-[260px] shrink-0">
            <div class="flex items-center justify-between text-xs">
              <span class="text-teal-700 dark:text-teal-400 font-bold">جہاں سے سلسلہ چھوڑا تھا:</span>
              <span class="text-slate-500 font-mono font-bold">آیت ${lastRead.ayahNumber || 1}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-xl bg-teal-700 text-white font-bold flex items-center justify-center text-sm font-mono shadow-sm">
                ${lastRead.surahNumber}
              </span>
              <div>
                <h3 class="text-base font-black text-slate-900 dark:text-white font-arabic">${lastReadSurah ? lastReadSurah.nameArabic : 'الفاتحة'}</h3>
                <p class="text-xs text-slate-500">${lastReadSurah ? lastReadSurah.nameUrdu : 'سورۃ الفاتحہ'} • پارہ ${lastReadSurah ? lastReadSurah.juz : 1}</p>
              </div>
            </div>
            <a href="#/quran/${lastRead.surahNumber}" class="w-full py-2.5 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs text-center flex items-center justify-center gap-2 shadow-sm transition active:scale-95">
              <i data-lucide="book-open" class="w-4 h-4"></i>
              <span>تلاوت جاری رکھیں (Continue Reading)</span>
            </a>
          </div>
        </div>

        <!-- Navigation Hub Tabs Strip -->
        <div class="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
          <div class="flex items-center gap-1.5 shrink-0" id="quran-tabs-container">
            <button onclick="window.Views.switchQuranTab('surahs')" class="quran-nav-tab py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'surahs' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}" data-tab="surahs">
              <i data-lucide="book" class="w-4 h-4"></i>
              <span>📖 114 سورتیں</span>
            </button>
            <button onclick="window.Views.switchQuranTab('juz')" class="quran-nav-tab py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'juz' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}" data-tab="juz">
              <i data-lucide="layers" class="w-4 h-4"></i>
              <span>📑 30 پارے (Juz)</span>
            </button>
            <button onclick="window.Views.switchQuranTab('mushaf15')" class="quran-nav-tab py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'mushaf15' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}" data-tab="mushaf15">
              <i data-lucide="book-marked" class="w-4 h-4"></i>
              <span>📜 15 سطری مصحف</span>
            </button>
            <button onclick="window.Views.switchQuranTab('tafsir')" class="quran-nav-tab py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'tafsir' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}" data-tab="tafsir">
              <i data-lucide="book-open" class="w-4 h-4"></i>
              <span>📚 تفاسیر القرآن (8)</span>
            </button>
            <button onclick="window.Views.switchQuranTab('bookmarks')" class="quran-nav-tab py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'bookmarks' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}" data-tab="bookmarks">
              <i data-lucide="bookmark" class="w-4 h-4"></i>
              <span>🔖 محفوظ نشانات (${bookmarks.length})</span>
            </button>
            <button onclick="window.Views.switchQuranTab('notes')" class="quran-nav-tab py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'notes' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}" data-tab="notes">
              <i data-lucide="edit-3" class="w-4 h-4"></i>
              <span>📝 میرے نوٹس (${notes.length})</span>
            </button>
            <button onclick="window.Views.switchQuranTab('downloads')" class="quran-nav-tab py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'downloads' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}" data-tab="downloads">
              <i data-lucide="download-cloud" class="w-4 h-4"></i>
              <span>📥 ڈاؤن لوڈز (${downloads.length})</span>
            </button>
          </div>

          <!-- View Mode (Grid / Compact List) -->
          <div class="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
            <button onclick="window.Views.setQuranSurahViewMode('grid')" class="p-1.5 rounded-lg ${window.Views.quranSurahViewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-700 dark:text-teal-400' : 'text-slate-500'}" title="Grid View">
              <i data-lucide="layout-grid" class="w-4 h-4"></i>
            </button>
            <button onclick="window.Views.setQuranSurahViewMode('compact')" class="p-1.5 rounded-lg ${window.Views.quranSurahViewMode === 'compact' ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-700 dark:text-teal-400' : 'text-slate-500'}" title="Compact List">
              <i data-lucide="list" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- Tab Content Body Area -->
        <div id="quran-tab-content" class="w-full">
          ${window.Views.renderQuranTabContent()}
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.switchQuranTab = function(tabName) {
  window.Views.quranActiveTab = tabName;
  const contentEl = document.getElementById('quran-tab-content');
  if (contentEl) {
    contentEl.innerHTML = window.Views.renderQuranTabContent();
    if (window.lucide) window.lucide.createIcons();
  }
  const tabs = document.querySelectorAll('.quran-nav-tab');
  tabs.forEach(t => {
    if (t.getAttribute('data-tab') === tabName) {
      t.className = 'quran-nav-tab py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-teal-700 text-white shadow-sm';
    } else {
      t.className = 'quran-nav-tab py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
    }
  });
};

window.Views.setQuranSurahViewMode = function(mode) {
  window.Views.quranSurahViewMode = mode;
  window.Views.renderQuran();
};

// =========================================================================
// 2. TAB CONTENTS RENDERER
// =========================================================================
window.Views.renderQuranTabContent = function() {
  const tab = window.Views.quranActiveTab || 'surahs';

  // TAB 1: 114 SURAHS
  if (tab === 'surahs') {
    const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
    return `
      <div class="space-y-4">
        <!-- Search & Filter Toolbar -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-sm w-full">
          <div class="relative flex-1 w-full">
            <input 
              type="text" 
              id="quran-search-input" 
              placeholder="سورت تلاش کریں (مثلاً: یسین، بقرہ، کہف، رحمن، ملک، یا Al-Fatiha)..." 
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-600"
              oninput="window.Views.filterSurahs(this.value)"
            />
          </div>

          <!-- Filter Pills -->
          <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 sm:pb-0 scrollbar-none shrink-0">
            <button onclick="window.Views.filterSurahsByType('all')" class="quran-filter-btn active py-1.5 px-3 rounded-xl text-xs font-bold bg-teal-700 text-white shadow-sm">تمام (114)</button>
            <button onclick="window.Views.filterSurahsByType('Meccan')" class="quran-filter-btn py-1.5 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200">مکی سورتیں (86)</button>
            <button onclick="window.Views.filterSurahsByType('Medinan')" class="quran-filter-btn py-1.5 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200">مدنی سورتیں (28)</button>
          </div>
        </div>

        <!-- Surahs Grid -->
        <div id="quran-surahs-grid" class="${window.Views.quranSurahViewMode === 'compact' ? 'space-y-2' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}">
          ${window.Views.renderSurahsHtml(surahs)}
        </div>
      </div>
    `;
  }

  // TAB 2: 30 JUZ
  if (tab === 'juz') {
    const juzList = window.QURAN_DATA ? window.QURAN_DATA.JUZ_LIST : [];
    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${juzList.map(j => `
          <div class="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-teal-600 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 flex items-center justify-center font-bold text-xs font-mono">
                  ${j.juz}
                </span>
                <span class="text-xs text-slate-400 font-sans">Juz ${j.juz} • ${j.nameTranslit}</span>
              </div>
              <div class="text-center py-2 space-y-1">
                <h3 class="text-xl font-black text-teal-800 dark:text-teal-300 font-arabic">${j.nameArabic}</h3>
                <h4 class="text-xs font-bold text-slate-900 dark:text-white">${j.nameUrdu}</h4>
                <p class="text-[11px] text-slate-500">سورت ${j.startSurah} تا سورت ${j.endSurah}</p>
              </div>
            </div>
            <div class="pt-2 border-t border-slate-100 dark:border-slate-700">
              <a href="#/quran/${j.startSurah}" class="w-full py-2 px-3 text-xs rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-center font-bold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95">
                <span>تلاوت شروع کریں</span>
                <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // TAB 3: 15-LINE MUSHAF
  if (tab === 'mushaf15') {
    const editions = window.QURAN_DATA ? (window.QURAN_DATA.MUSHAF_EDITIONS || []) : [];
    const currentEd = editions[0] || {};
    return `
      <div class="space-y-6">
        <!-- Mushaf Hero Card -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="space-y-2">
            <span class="px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-xs font-bold">حفاظ کرام کا پسندیدہ مصحف</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">15 سطری شاہی مصحف (پاکستانی و انڈو-پاک رسم الخط)</h2>
            <p class="text-xs text-slate-500 max-w-xl leading-relaxed">
              15 سطور کی مکمل متوازن ترتیب، ہر صفحہ آیت کے اختتام پر ختم، تجویدی علامات اور مستند خطاطی کے ساتھ۔
            </p>
          </div>
          <a href="${currentEd.downloadUrl || 'https://archive.org/download/quran-15-lines-pakistani/Quran-15-Lines.pdf'}" target="_blank" class="py-2.5 px-5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-95 shrink-0">
            <i data-lucide="download" class="w-4 h-4"></i>
            <span>ڈاؤن لوڈ 15 سطری PDF</span>
          </a>
        </div>

        <!-- Mushaf Editions Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${editions.map(e => `
            <div class="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-600/30 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs font-mono">
                    ${e.lines}L
                  </span>
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px]">
                    ${e.totalPages} صفحات
                  </span>
                </div>
                <div>
                  <h3 class="text-sm font-black text-slate-900 dark:text-white">${e.title}</h3>
                  <p class="text-[11px] text-slate-500 font-sans">${e.publisher} • ${e.script}</p>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${e.description}</p>
              </div>
              <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                <a href="${e.downloadUrl}" target="_blank" class="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-teal-700 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition">
                  <i data-lucide="download" class="w-3.5 h-3.5"></i>
                  <span>PDF ڈاؤن لوڈ</span>
                </a>
                <a href="#/quran/1" class="py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition">
                  <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
                  <span>مصحف پڑھیں</span>
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // TAB 4: TAFSIR LIBRARY
  if (tab === 'tafsir') {
    const tafsirs = window.QURAN_DATA ? (window.QURAN_DATA.TAFSIRS || []) : [];
    return `
      <div class="space-y-6">
        <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="space-y-2">
            <span class="px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-xs font-bold">کتب تفاسیر و فہم قرآن</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">مستند تفاسیر القرآن لائبریری (8 کتب معتبرہ)</h2>
            <p class="text-xs text-slate-500 max-w-xl leading-relaxed">
              اہل سنت و جماعت کی 8 مستند اور معتبر تفاسیر (ابن کثیر، احسن البیان، السعدی، طبری، قرطبی، معارف القرآن، جلالین، فتح القدیر)۔
            </p>
          </div>
          <span class="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-600/30 text-teal-700 dark:text-teal-300 flex items-center justify-center text-2xl shrink-0 shadow-sm">📚</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${tafsirs.map(t => `
            <div class="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[10px] font-bold border border-teal-600/30">
                    ${t.volumes || 'مجلد واحد'}
                  </span>
                  <span class="text-xs text-slate-400">${t.languageLabel || 'اردو و عربی'}</span>
                </div>
                <div>
                  <h3 class="text-base font-black text-slate-900 dark:text-white">${t.name}</h3>
                  <p class="text-xs text-teal-700 dark:text-teal-400 font-bold mt-0.5">${t.author}</p>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${t.description}</p>
              </div>
              <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                <button onclick="window.Router.navigate('/tafsir/${t.id}')" class="flex-1 py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition">
                  <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
                  <span>مطالعہ شروع کریں</span>
                </button>
                <a href="${t.downloadUrl}" target="_blank" class="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-teal-700 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1 transition" title="پی ڈی ایف">
                  <i data-lucide="download" class="w-3.5 h-3.5"></i>
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // TAB 5: BOOKMARKS
  if (tab === 'bookmarks') {
    const bookmarks = window.QuranService ? window.QuranService.getBookmarks() : [];
    if (bookmarks.length === 0) {
      return `
        <div class="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-3">
          <div class="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 mx-auto flex items-center justify-center text-2xl">
            🔖
          </div>
          <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300">کوئی آیت نشان زد (Bookmarked) نہیں ہے</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">تلاوت کے دوران کسی بھی آیت کے بک مارک آئیکن پر ٹیپ کر کے محفوظ فرمائیں۔</p>
          <button onclick="window.Views.switchQuranTab('surahs')" class="py-2 px-5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm">قرآن مجید کھولیں</button>
        </div>
      `;
    }

    return `
      <div class="space-y-4">
        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">کل محفوظ شدہ نشانات (${bookmarks.length})</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${bookmarks.map(b => `
            <div class="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <span class="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center font-mono border border-teal-600/30">
                    ${b.surahNumber}
                  </span>
                  <div>
                    <h4 class="text-sm font-black text-slate-900 dark:text-white font-arabic">${b.surahNameArabic}</h4>
                    <p class="text-[11px] text-slate-500">آیت مبارکہ: ${b.ayahNumber}</p>
                  </div>
                </div>
                <button onclick="window.QuranService.removeBookmark('${b.id}'); window.Views.switchQuranTab('bookmarks');" class="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg" title="حذف کریں">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
              <div class="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span class="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[10px] font-bold">${b.category === 'memorization' ? 'حفظ و تکرار' : 'اہم آیت'}</span>
                <a href="#/quran/${b.surahNumber}" class="text-xs text-teal-700 dark:text-teal-400 font-bold hover:underline">
                  آیت پر جائیں &larr;
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // TAB 6: NOTES
  if (tab === 'notes') {
    const notes = window.QuranService ? window.QuranService.getNotes() : [];
    if (notes.length === 0) {
      return `
        <div class="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-3">
          <div class="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 mx-auto flex items-center justify-center text-2xl">
            📝
          </div>
          <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300">کوئی قرآنی نوٹ موجود نہیں</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">تلاوت کے دوران آیات پر اپنے فہم اور تاثرات نوٹ فرمائیں۔</p>
        </div>
      `;
    }

    return `
      <div class="space-y-4">
        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">میرے قرآنی نوٹس (${notes.length})</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${notes.map(n => `
            <div class="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-3">
              <div class="space-y-2">
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                  <span class="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[10px] font-bold">
                    سورت ${n.surahNumber} • آیت ${n.ayahNumber}
                  </span>
                  <span class="text-[10px] text-slate-400 font-mono">${n.date || ''}</span>
                </div>
                <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">${n.text}</p>
              </div>
              <div class="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <button onclick="window.QuranService.deleteNote('${n.id}'); window.Views.switchQuranTab('notes');" class="text-rose-500 text-[11px] font-bold hover:underline">
                  حذف کریں
                </button>
                <a href="#/quran/${n.surahNumber}" class="text-xs text-teal-700 dark:text-teal-400 font-bold hover:underline">
                  آیت کھولیں &larr;
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // TAB 7: DOWNLOADS
  if (tab === 'downloads') {
    return `
      <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-4 text-center">
        <div class="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 flex items-center justify-center mx-auto text-2xl shadow-sm">
          📥
        </div>
        <h3 class="text-lg font-black text-slate-900 dark:text-white">مکمل قرآن مجید آف لائن ڈاؤن لوڈ کریں</h3>
        <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          تمام 114 سورتوں کے عربی متون اور اردو تراجم کو اپنے موبائل / براؤزر میں مستقل محفوظ کریں تاکہ بنا انٹرنیٹ تلاوت کی جا سکے۔
        </p>
        <button onclick="window.Views.downloadAllQuranData()" class="py-2.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition active:scale-95 inline-flex items-center gap-2">
          <i data-lucide="download-cloud" class="w-4 h-4"></i>
          <span>تمام سورتیں آف لائن ڈاؤن لوڈ کریں (One-Click Offline Pack)</span>
        </button>
      </div>
    `;
  }

  return '';
};

// =========================================================================
// 3. SURAH CATALOG RENDERER
// =========================================================================
window.Views.renderSurahsHtml = function(surahs) {
  return surahs.map(surah => `
    <a href="#/quran/${surah.number}" class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:border-teal-600 transition flex items-center justify-between gap-4 group shadow-sm hover:shadow-md">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-600/30 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center font-mono shrink-0 group-hover:bg-teal-700 group-hover:text-white transition">
          ${surah.number}
        </div>
        <div class="min-w-0">
          <div class="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-teal-700 dark:group-hover:text-teal-400 transition">
            ${surah.nameTranslit || surah.nameEnglish || ('Surah ' + surah.number)}
          </div>
          <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            ${surah.type === 'Meccan' ? 'مکی سورت' : 'مدنی سورت'} • ${surah.ayahCount} آیات
          </div>
        </div>
      </div>

      <div class="text-right shrink-0">
        <span class="font-arabic font-bold text-xl sm:text-2xl text-teal-800 dark:text-teal-300 group-hover:scale-105 transition-transform inline-block">
          ${surah.nameArabic}
        </span>
      </div>
    </a>
  `).join('');
};

window.Views.filterSurahs = function(query) {
  const grid = document.getElementById('quran-surahs-grid');
  if (!grid) return;
  const all = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  if (!query || query.trim() === '') {
    grid.innerHTML = window.Views.renderSurahsHtml(all);
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const q = query.trim().toLowerCase();
  const filtered = all.filter(s => 
    s.nameArabic.includes(q) || 
    s.nameUrdu.includes(q) || 
    (s.nameTranslit && s.nameTranslit.toLowerCase().includes(q)) ||
    (s.nameEnglish && s.nameEnglish.toLowerCase().includes(q)) || 
    s.number.toString() === q
  );

  grid.innerHTML = filtered.length > 0 
    ? window.Views.renderSurahsHtml(filtered)
    : `<div class="col-span-full py-12 text-center text-slate-400 text-xs rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">کوئی سورت نہیں ملی۔</div>`;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.filterSurahsByType = function(type) {
  const btns = document.querySelectorAll('.quran-filter-btn');
  btns.forEach(b => {
    b.className = 'quran-filter-btn py-1.5 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200';
  });
  
  if (window.event && window.event.target) {
    const target = window.event.target.closest('.quran-filter-btn') || window.event.target;
    target.className = 'quran-filter-btn active py-1.5 px-3 rounded-xl text-xs font-bold bg-teal-700 text-white shadow-sm';
  }

  const grid = document.getElementById('quran-surahs-grid');
  if (!grid) return;

  const all = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const filtered = type === 'all' ? all : all.filter(s => s.type === type);
  grid.innerHTML = window.Views.renderSurahsHtml(filtered);
  if (window.lucide) window.lucide.createIcons();
};

// =========================================================================
// 4. INTERACTIVE SURAH READER ENGINE
// =========================================================================
window.Views.renderSurahReader = async function(surahNumber) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const surahMeta = surahs.find(s => s.number === surahNumber) || surahs[0];
  const settings = window.QuranService ? window.QuranService.getSettings() : {};
  const reciters = window.QURAN_DATA ? window.QURAN_DATA.RECITERS : [];

  // Track last read
  if (window.QuranService) {
    window.QuranService.saveLastRead(surahNumber, 1, surahMeta.page, surahMeta.juz);
  }

  container.innerHTML = `
    <div class="min-h-screen bg-white dark:bg-slate-900 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-32" dir="rtl">
      
      <!-- Native Mobile Sticky Top Bar -->
      <div class="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 px-4 py-2.5 shadow-sm">
        <div class="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <a href="#/quran" class="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 shrink-0">
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
            <span>سورتیں</span>
          </a>

          <div class="flex items-center gap-2 min-w-0">
            <span class="w-6 h-6 rounded-lg bg-teal-700 text-white font-mono text-[10px] flex items-center justify-center font-bold shrink-0">${surahNumber}</span>
            <h2 class="text-sm font-black text-slate-900 dark:text-white truncate font-arabic">${surahMeta.nameArabic} (${surahMeta.nameUrdu})</h2>
          </div>

          <div class="flex items-center gap-1 font-sans shrink-0" dir="ltr">
            <button onclick="window.Views.openSurahJumpModal()" class="py-1 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[11px] font-urdu">
              تلاش سورت 🔍
            </button>
            ${surahNumber > 1 ? `<a href="#/quran/${surahNumber - 1}" class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-700 hover:text-white transition" title="سابقہ سورت"><i data-lucide="chevron-left" class="w-4 h-4"></i></a>` : ''}
            ${surahNumber < 114 ? `<a href="#/quran/${surahNumber + 1}" class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-700 hover:text-white transition" title="اگلی سورت"><i data-lucide="chevron-right" class="w-4 h-4"></i></a>` : ''}
          </div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-5">
        
        <!-- Surah Title & Controls Card -->
        <div class="p-6 sm:p-8 text-center space-y-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm w-full">
          <div class="flex items-center justify-center gap-2">
            <span class="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-xs font-bold">
              ${surahMeta.type === 'Meccan' ? 'مکی سورت' : 'مدنی سورت'} • ${surahMeta.ayahCount} آیات • پارہ ${surahMeta.juz} • صفحہ ${surahMeta.page || 1}
            </span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-arabic font-extrabold text-teal-800 dark:text-teal-300 my-1">${surahMeta.nameArabic}</h1>
          <h2 class="text-sm sm:text-base font-bold text-slate-600 dark:text-slate-300">${surahMeta.nameUrdu} — ${surahMeta.nameTranslit || surahMeta.nameEnglish}</h2>

          <!-- Multi-Qari Selector & Direct Surah Play -->
          <div class="max-w-md mx-auto w-full pt-1 flex items-center gap-2">
            <div class="flex-1 flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs">
              <span class="text-slate-400 font-bold shrink-0 pr-2">🎙️ قاری:</span>
              <select 
                id="reader-qari-dropdown"
                onchange="window.QuranService.saveSettings({ selectedQari: this.value });" 
                class="w-full bg-transparent text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
              >
                ${reciters.map(q => `
                  <option value="${q.id}" ${q.id === settings.selectedQari ? 'selected' : ''}>${q.name}</option>
                `).join('')}
              </select>
            </div>
            <button onclick="window.Views.playSurahDirectly(${surahNumber})" class="py-2 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0 transition active:scale-95">
              <i data-lucide="play" class="w-3.5 h-3.5"></i>
              <span>سنیں</span>
            </button>
          </div>

          <!-- View Modes & Translation Controls -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <!-- Modes -->
            <div class="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-700/60 rounded-xl font-bold">
              <button onclick="window.Views.setQuranViewMode('mushaf15', ${surahNumber})" class="mode-btn py-1 px-2.5 rounded-lg transition ${window.Views.quranViewMode === 'mushaf15' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}" data-mode="mushaf15">
                15 سطری مصحف
              </button>
              <button onclick="window.Views.setQuranViewMode('ayah_cards', ${surahNumber})" class="mode-btn py-1 px-2.5 rounded-lg transition ${window.Views.quranViewMode === 'ayah_cards' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}" data-mode="ayah_cards">
                آیت کارڈز
              </button>
              <button onclick="window.Views.setQuranViewMode('hifz', ${surahNumber})" class="mode-btn py-1 px-2.5 rounded-lg transition ${window.Views.quranViewMode === 'hifz' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}" data-mode="hifz">
                حفظ و تکرار
              </button>
            </div>

            <!-- Translation & Font Controls -->
            <div class="flex items-center gap-2">
              <button onclick="window.Views.toggleQuranTranslation(${surahNumber})" id="translation-toggle-btn" class="py-1 px-3 rounded-lg border font-bold ${window.Views.showTranslation ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-600/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent'}">
                ${window.Views.showTranslation ? '📜 ترجمہ: آن' : '📖 ترجمہ: آف'}
              </button>
              <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl">
                <button onclick="window.Views.adjustQuranFontSize(-2)" class="w-6 h-6 rounded-md bg-white dark:bg-slate-800 font-bold font-mono text-xs">A-</button>
                <span id="font-size-display" class="font-mono font-bold text-xs px-1">${window.Views.currentQuranFontSize}px</span>
                <button onclick="window.Views.adjustQuranFontSize(2)" class="w-6 h-6 rounded-md bg-white dark:bg-slate-800 font-bold font-mono text-xs">A+</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Ayahs Content Container -->
        <div id="surah-ayahs-list" class="space-y-4">
          <div class="text-center py-16 space-y-3">
            <div class="w-8 h-8 border-3 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p class="text-xs text-slate-400 font-bold">سورت کا عثمانی متن لوڈ ہو رہا ہے...</p>
          </div>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Load verses asynchronously
  const ayahs = window.QuranService ? await window.QuranService.getSurahVerses(surahNumber) : [];
  window.Views.currentSurahAyahs = ayahs;
  window.Views.renderAyahsToDom(surahNumber, surahMeta, ayahs);
};

// =========================================================================
// 5. AYAH DOM RENDERER WITH MODES
// =========================================================================
window.Views.renderAyahsToDom = function(surahNumber, surahMeta, ayahItems) {
  const ayahsList = document.getElementById('surah-ayahs-list');
  if (!ayahsList) return;

  const viewMode = window.Views.quranViewMode || 'mushaf15';
  const showTranslation = window.Views.showTranslation !== undefined ? window.Views.showTranslation : true;
  const fontSize = window.Views.currentQuranFontSize || 28;

  let html = '';

  // 1. 15-LINE MUSHAF PAGE MODE
  if (viewMode === 'mushaf15') {
    const itemsPerPage = 15;
    const totalPages = Math.ceil(ayahItems.length / itemsPerPage);
    const curPage = Math.min(Math.max(1, window.Views.currentMushafPage || 1), totalPages);
    const startIndex = (curPage - 1) * itemsPerPage;
    const pageAyahs = ayahItems.slice(startIndex, startIndex + itemsPerPage);

    html = `
      <div class="p-5 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-5" dir="rtl">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-teal-700 text-white font-black flex items-center justify-center text-xs font-mono">
              ${curPage}
            </span>
            <div>
              <span class="text-sm font-black text-slate-900 dark:text-white font-arabic">${surahMeta.nameArabic}</span>
              <span class="text-[11px] text-slate-400 block font-sans">صفحہ ${curPage} از ${totalPages}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 font-sans">
            <button onclick="window.Views.changeMushafPage(-1, ${surahNumber})" ${curPage <= 1 ? 'disabled class="opacity-40 cursor-not-allowed"' : ''} class="py-1 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold font-urdu">&larr; سابقہ</button>
            <button onclick="window.Views.changeMushafPage(1, ${surahNumber})" ${curPage >= totalPages ? 'disabled class="opacity-40 cursor-not-allowed"' : ''} class="py-1 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold font-urdu shadow-sm">اگلا &rarr;</button>
          </div>
        </div>

        <!-- Bismillah -->
        ${curPage === 1 && surahNumber !== 9 && surahNumber !== 1 ? `
          <div class="py-2 text-center">
            <p class="text-xl sm:text-2xl font-arabic font-bold text-teal-800 dark:text-teal-300">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          </div>
        ` : ''}

        <!-- 15 Mushaf Ayahs Lines -->
        <div class="space-y-3.5">
          ${pageAyahs.map(a => window.Views.renderAyahRowHtml(surahNumber, surahMeta, a, showTranslation, fontSize)).join('')}
        </div>
      </div>
    `;
  }
  // 2. HIFZ / MEMORIZATION MODE
  else if (viewMode === 'hifz') {
    html = `
      <div class="space-y-4">
        <div class="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-600/30 flex items-center justify-between text-xs font-bold text-teal-900 dark:text-teal-200">
          <span>🧠 حفظ موڈ: عربی متن کو چھپانے / ظاہر کرنے کے لیے آیت پر ٹیپ فرمائیں۔</span>
          <button onclick="window.Views.toggleAllHifzAyahs()" class="py-1 px-3 rounded-lg bg-teal-700 text-white font-bold">سب چھپائیں / دکھائیں</button>
        </div>
        ${ayahItems.map(a => {
          const isHidden = window.Views.hifzHiddenAyahs[a.numberInSurah];
          return `
            <div id="ayah-card-${a.numberInSurah}" class="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-3 text-right" dir="rtl">
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <span class="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center font-mono border border-teal-600/30">
                  ${a.numberInSurah}
                </span>
                <button onclick="window.Views.toggleHifzAyah(${a.numberInSurah})" class="py-1 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300">
                  ${isHidden ? '👁️ متن ظاہر کریں' : '🙈 متن چھپائیں'}
                </button>
              </div>
              <div class="${isHidden ? 'filter blur-md select-none' : ''} transition-all duration-300">
                <p class="font-arabic font-bold text-slate-900 dark:text-white" style="font-size: ${fontSize}px; line-height: 2.2;">
                  ${a.text}
                </p>
                ${showTranslation && a.urdu ? `<p class="text-xs font-urdu text-teal-700 dark:text-teal-400 mt-2">${a.urdu}</p>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  // 3. AYAH CARDS & CONTINUOUS MODE
  else {
    html = `
      <div class="space-y-4">
        ${ayahItems.map(a => window.Views.renderAyahRowHtml(surahNumber, surahMeta, a, showTranslation, fontSize)).join('')}
      </div>
    `;
  }

  ayahsList.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();
};

window.Views.renderAyahRowHtml = function(surahNumber, surahMeta, a, showTranslation, fontSize) {
  const isBookmarked = window.QuranService ? window.QuranService.isAyahBookmarked(surahNumber, a.numberInSurah) : false;
  const isPlaying = window.Views.activePlayingSurah === surahNumber && window.Views.activePlayingAyah === a.numberInSurah;

  return `
    <div id="ayah-container-${a.numberInSurah}" class="p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${isPlaying ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/30 shadow-sm ring-1 ring-teal-600/30' : 'border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800'}">
      
      <!-- Top Action Bar -->
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80 pb-2.5 mb-2.5">
        <div class="flex items-center gap-2">
          <span class="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center font-mono border border-teal-600/30">
            ${a.numberInSurah}
          </span>
          ${a.sajda ? '<span class="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold border border-rose-300">سجدہ واجب</span>' : ''}
        </div>

        <div class="flex items-center gap-1">
          <button onclick="window.Views.playSingleAyah(${surahNumber}, ${a.numberInSurah})" class="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition" title="آیت سنیں">
            <i data-lucide="${isPlaying ? 'pause' : 'play'}" class="w-4 h-4"></i>
          </button>
          <button onclick="window.Views.openTafsirModal(${surahNumber}, ${a.numberInSurah})" class="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition" title="تفسیر دیکھیں">
            <i data-lucide="book-open" class="w-4 h-4"></i>
          </button>
          <button onclick="window.Views.openNoteModal(${surahNumber}, ${a.numberInSurah})" class="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition" title="نوٹ لکھیں">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
          </button>
          <button onclick="window.Views.toggleBookmarkAyah(${surahNumber}, ${a.numberInSurah})" class="p-1.5 rounded-lg text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition" title="بک مارک">
            <i data-lucide="bookmark" class="w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}"></i>
          </button>
          <button onclick="window.Views.shareAyahCardModal(${surahNumber}, ${a.numberInSurah})" class="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition" title="شیئر امیج کارڈ">
            <i data-lucide="share-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <!-- Arabic Verse -->
      <div class="py-1 text-right">
        <p class="font-arabic font-bold text-slate-900 dark:text-white leading-loose select-text" style="font-size: ${fontSize || 28}px; line-height: 2.2;">
          ${a.text}
          <span class="inline-block mx-1.5 text-teal-700 dark:text-teal-400 text-base font-mono">﴿${a.numberInSurah}﴾</span>
        </p>
      </div>

      <!-- Urdu & English Translations -->
      ${showTranslation && (a.urdu || a.translation || a.english) ? `
        <div class="pt-2.5 border-t border-slate-100 dark:border-slate-700/80 space-y-1">
          ${a.urdu ? `<p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">${a.urdu}</p>` : ''}
          ${a.english ? `<p class="text-[11px] text-slate-500 dark:text-slate-400 font-sans italic text-left" dir="ltr">${a.english}</p>` : ''}
        </div>
      ` : ''}

    </div>
  `;
};

// =========================================================================
// 6. ACTION HANDLERS & MISSING CONTROLLERS
// =========================================================================
window.Views.setQuranViewMode = function(mode, surahNumber) {
  window.Views.quranViewMode = mode;
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const meta = surahs.find(s => s.number === surahNumber) || surahs[0];
  
  // Update button active states
  const modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach(btn => {
    if (btn.getAttribute('data-mode') === mode) {
      btn.className = 'mode-btn py-1 px-2.5 rounded-lg transition bg-teal-700 text-white shadow-sm';
    } else {
      btn.className = 'mode-btn py-1 px-2.5 rounded-lg transition text-slate-600 dark:text-slate-300';
    }
  });

  if (window.Views.currentSurahAyahs && window.Views.currentSurahAyahs.length > 0) {
    window.Views.renderAyahsToDom(surahNumber, meta, window.Views.currentSurahAyahs);
  }
};

window.Views.toggleQuranTranslation = function(surahNumber) {
  window.Views.showTranslation = !window.Views.showTranslation;
  const btn = document.getElementById('translation-toggle-btn');
  if (btn) {
    btn.textContent = window.Views.showTranslation ? '📜 ترجمہ: آن' : '📖 ترجمہ: آف';
    btn.className = window.Views.showTranslation 
      ? 'py-1 px-3 rounded-lg border font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-600/30'
      : 'py-1 px-3 rounded-lg border font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent';
  }
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const meta = surahs.find(s => s.number === surahNumber) || surahs[0];
  if (window.Views.currentSurahAyahs && window.Views.currentSurahAyahs.length > 0) {
    window.Views.renderAyahsToDom(surahNumber, meta, window.Views.currentSurahAyahs);
  }
};

window.Views.adjustQuranFontSize = function(delta) {
  window.Views.currentQuranFontSize = Math.max(18, Math.min(56, (window.Views.currentQuranFontSize || 28) + delta));
  const disp = document.getElementById('font-size-display');
  if (disp) disp.textContent = window.Views.currentQuranFontSize + 'px';
  
  // Direct DOM font-size update on rendered Arabic texts
  document.querySelectorAll('#surah-ayahs-list p.font-arabic').forEach(el => {
    el.style.fontSize = window.Views.currentQuranFontSize + 'px';
  });
};

window.Views.changeMushafPage = function(delta, surahNumber) {
  window.Views.currentMushafPage = Math.max(1, (window.Views.currentMushafPage || 1) + delta);
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const meta = surahs.find(s => s.number === surahNumber) || surahs[0];
  if (window.Views.currentSurahAyahs && window.Views.currentSurahAyahs.length > 0) {
    window.Views.renderAyahsToDom(surahNumber, meta, window.Views.currentSurahAyahs);
  }
};

window.Views.toggleHifzAyah = function(ayahNumber) {
  window.Views.hifzHiddenAyahs[ayahNumber] = !window.Views.hifzHiddenAyahs[ayahNumber];
  const card = document.getElementById(`ayah-card-${ayahNumber}`);
  if (card) {
    const textContainer = card.querySelector('div.transition-all');
    const toggleBtn = card.querySelector('button');
    const isHidden = window.Views.hifzHiddenAyahs[ayahNumber];
    if (textContainer) {
      if (isHidden) textContainer.classList.add('filter', 'blur-md', 'select-none');
      else textContainer.classList.remove('filter', 'blur-md', 'select-none');
    }
    if (toggleBtn) {
      toggleBtn.textContent = isHidden ? '👁️ متن ظاہر کریں' : '🙈 متن چھپائیں';
    }
  }
};

window.Views.toggleAllHifzAyahs = function() {
  const allHidden = Object.values(window.Views.hifzHiddenAyahs).some(v => v);
  (window.Views.currentSurahAyahs || []).forEach(a => {
    window.Views.hifzHiddenAyahs[a.numberInSurah] = !allHidden;
  });
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const meta = surahs[0];
  if (window.Views.currentSurahAyahs) {
    window.Views.renderAyahsToDom(1, meta, window.Views.currentSurahAyahs);
  }
};

window.Views.openSurahJumpModal = function() {
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const modal = `
    <div id="quran-jump-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 class="text-base font-black text-slate-900 dark:text-white">کسی بھی سورت پر جائیں</h3>
          <button onclick="document.getElementById('quran-jump-modal').remove()" class="p-1 text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <input type="text" id="jump-search" oninput="window.Views._filterJumpSurahs(this.value)" placeholder="سورت نمبر یا نام تلاش کریں..." class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
        <div id="jump-surahs-list" class="flex-1 overflow-y-auto space-y-1.5 pr-1">
          ${surahs.map(s => `
            <a href="#/quran/${s.number}" onclick="document.getElementById('quran-jump-modal').remove()" class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-700 hover:text-white transition flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span class="font-mono">${s.number}. ${s.nameUrdu}</span>
              <span class="font-arabic text-base">${s.nameArabic}</span>
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

window.Views._filterJumpSurahs = function(q) {
  const query = (q || '').trim().toLowerCase();
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const filtered = surahs.filter(s => s.nameArabic.includes(query) || s.nameUrdu.includes(query) || (s.nameEnglish && s.nameEnglish.toLowerCase().includes(query)) || s.number.toString() === query);
  const container = document.getElementById('jump-surahs-list');
  if (container) {
    container.innerHTML = filtered.map(s => `
      <a href="#/quran/${s.number}" onclick="document.getElementById('quran-jump-modal').remove()" class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-700 hover:text-white transition flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
        <span class="font-mono">${s.number}. ${s.nameUrdu}</span>
        <span class="font-arabic text-base">${s.nameArabic}</span>
      </a>
    `).join('');
  }
};

window.Views.playSingleAyah = function(surahNum, ayahNum) {
  if (window.QuranService) {
    window.QuranService.playAyah(surahNum, ayahNum, window.Views.currentSurahAyahs);
    const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
    const meta = surahs.find(s => s.number === surahNum) || surahs[0];
    window.Views.renderAyahsToDom(surahNum, meta, window.Views.currentSurahAyahs);
  }
};

window.Views.toggleBookmarkAyah = function(surahNum, ayahNum) {
  if (window.QuranService) {
    const isBookmarked = window.QuranService.isAyahBookmarked(surahNum, ayahNum);
    if (isBookmarked) {
      window.QuranService.removeBookmark(`bm_${surahNum}_${ayahNum}`);
      window.App?.showToast('بک مارک ہٹا دیا گیا', 'info');
    } else {
      window.QuranService.addBookmark(surahNum, ayahNum, 'important');
      window.App?.showToast('آیت مبارکہ بک مارک میں شامل کر دی گئی', 'success');
    }
    const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
    const meta = surahs.find(s => s.number === surahNum) || surahs[0];
    if (window.Views.currentSurahAyahs) {
      window.Views.renderAyahsToDom(surahNum, meta, window.Views.currentSurahAyahs);
    }
  }
};

window.Views.openNoteModal = function(surahNum, ayahNum) {
  const currentNote = window.QuranService ? window.QuranService.getNoteForAyah(surahNum, ayahNum) : '';
  const modal = `
    <div id="quran-note-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 class="text-base font-black text-slate-900 dark:text-white">ذاتی قرآنی نوٹ تحریر فرمائیں</h3>
          <button onclick="document.getElementById('quran-note-modal').remove()" class="p-1 text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <textarea id="quran-note-textarea" rows="4" placeholder="اس آیت مبارکہ سے متعلق فوائد و تاثرات درج کریں..." class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">${currentNote}</textarea>
        <div class="flex items-center justify-end gap-2 pt-2">
          <button onclick="document.getElementById('quran-note-modal').remove()" class="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">منسوخ</button>
          <button onclick="window.Views.saveQuranNote(${surahNum}, ${ayahNum})" class="py-2 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm">محفوظ کریں</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.saveQuranNote = function(surahNum, ayahNum) {
  const text = document.getElementById('quran-note-textarea')?.value;
  if (window.QuranService) {
    window.QuranService.saveNote(surahNum, ayahNum, text);
    window.App?.showToast('نوٹ محفوظ ہو گیا!', 'success');
  }
  document.getElementById('quran-note-modal')?.remove();
};

window.Views.openTafsirModal = function(surahNum, ayahNum) {
  const ayahs = window.Views.currentSurahAyahs || [];
  const ayah = ayahs.find(a => a.numberInSurah === ayahNum) || { text: '', urdu: '', tafsir: '' };
  const tafsirText = ayah.tafsir || 'تفسیر احسن البیان (حافظ صلاح الدین یوسف): اس آیت مبارکہ کے تحت عقیدہ، اخلاق اور احکام شرعیہ کی رہنمائی فراہم کی گئی ہے۔ سلف صالحین اور محدثین کے فہم کے مطابق عمل کرنا لازم ہے۔';

  const modal = `
    <div id="quran-tafsir-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-xs border border-teal-600/30">تفسیر احسن البیان / ابن کثیر</span>
            <h3 class="text-sm font-black text-slate-900 dark:text-white">سورت ${surahNum} • آیت ${ayahNum}</h3>
          </div>
          <button onclick="document.getElementById('quran-tafsir-modal').remove()" class="p-1 text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>

        <div class="p-4 rounded-2xl bg-teal-50/60 dark:bg-slate-800 border border-teal-600/30">
          <p class="font-arabic font-bold text-teal-900 dark:text-teal-300 text-lg sm:text-xl text-right leading-loose">${ayah.text}</p>
          <p class="text-xs text-slate-700 dark:text-slate-300 mt-2 font-urdu font-medium">${ayah.urdu}</p>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-black text-teal-700 dark:text-teal-400">📖 تفسیری نکات و مستند تشریح:</h4>
          <div class="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-loose whitespace-pre-wrap p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            ${tafsirText}
          </div>
        </div>

        <div class="text-center pt-2">
          <button onclick="document.getElementById('quran-tafsir-modal').remove()" class="py-2 px-8 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm">بند کریں</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.shareAyahCardModal = function(surahNum, ayahNum) {
  const ayahs = window.Views.currentSurahAyahs || [];
  const ayah = ayahs.find(a => a.numberInSurah === ayahNum) || { text: '', urdu: '' };
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const meta = surahs.find(s => s.number === surahNum) || surahs[0];

  if (window.MediaEngine && typeof window.MediaEngine.openStatusCardGenerator === 'function') {
    window.MediaEngine.openStatusCardGenerator({
      arabic: ayah.text,
      translation: ayah.urdu,
      reference: `سورۃ ${meta.nameArabic} (${meta.nameUrdu}) : آیت ${ayahNum}`,
      title: 'قرآن مجید • فرمانِ الٰہی'
    });
  } else {
    // Fallback share / copy
    navigator.clipboard.writeText(`${ayah.text}\n\n${ayah.urdu}\n\n[سورۃ ${meta.nameArabic}: ${ayahNum}]`);
    window.App?.showToast('آیت مبارکہ اور ترجمہ کلپ بورڈ پر کاپی ہو گیا! 📋', 'success');
  }
};

window.Views.downloadAllQuranData = async function() {
  window.App?.showToast('تمام 114 سورتوں کا آف لائن ڈاؤن لوڈ شروع ہو رہا ہے...', 'info');
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  for (let s of surahs) {
    await window.QuranService.downloadSurah(s.number);
  }
  window.App?.showToast('🎉 ماشاء اللہ! تمام سورتیں آف لائن محفوظ ہو چکی ہیں!', 'success');
  window.Views.switchQuranTab('downloads');
};

// =========================================================================
// 7. DIRECT AUDIO PLAYBACK & GLOBAL MOBILE FLOATING PLAYER
// =========================================================================
window.Views.currentGlobalAudio = null;
window.Views.globalAudioSurah = null;
window.Views.isGlobalAudioPlaying = false;

window.Views.playSurahDirectly = function(surahNumber) {
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const surah = surahs.find(s => s.number === surahNumber) || surahs[0];
  if (!surah) return;

  const settings = window.QuranService ? window.QuranService.getSettings() : { selectedQari: 'alafasy' };
  const reciters = window.QURAN_DATA ? window.QURAN_DATA.RECITERS : [];
  const reciter = reciters.find(r => r.id === settings.selectedQari) || reciters[0];

  const audioUrl = reciter.surahUrl(surahNumber);
  window.Views.initGlobalQuranPlayer(surah, reciter, audioUrl);
};

window.Views.initGlobalQuranPlayer = function(surah, reciter, audioUrl) {
  let playerContainer = document.getElementById('quran-global-player');
  if (!playerContainer) {
    playerContainer = document.createElement('div');
    playerContainer.id = 'quran-global-player';
    playerContainer.className = 'fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-xl bg-slate-900 text-white backdrop-blur-2xl p-3 sm:p-4 rounded-3xl border border-slate-700 shadow-2xl font-urdu flex flex-col gap-2 transition-all';
    document.body.appendChild(playerContainer);
  }

  if (window.Views.currentGlobalAudio) {
    window.Views.currentGlobalAudio.pause();
  }

  const audio = new Audio(audioUrl);
  window.Views.currentGlobalAudio = audio;
  window.Views.globalAudioSurah = surah;
  window.Views.isGlobalAudioPlaying = true;

  playerContainer.innerHTML = `
    <div class="flex items-center justify-between gap-3">
      <!-- Surah & Reciter Info -->
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0 shadow-md">
          <i data-lucide="music" class="w-4 h-4"></i>
        </div>
        <div class="min-w-0">
          <h4 class="text-xs font-black text-white truncate font-arabic">${surah.nameArabic} (${surah.nameUrdu})</h4>
          <p class="text-[10px] text-teal-400 truncate">${reciter.name}</p>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-2 shrink-0">
        <button id="global-player-toggle" onclick="window.Views.toggleGlobalAudioPlay()" class="w-9 h-9 rounded-xl bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center shadow-md active:scale-95 transition">
          <i data-lucide="pause" class="w-4 h-4"></i>
        </button>
        <button onclick="window.Views.closeGlobalQuranPlayer()" class="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
    </div>

    <!-- Progress Slider -->
    <div class="flex items-center gap-2 pt-0.5 text-[10px] font-mono text-slate-400" dir="ltr">
      <span id="player-current-time">00:00</span>
      <input 
        id="player-seek-slider" 
        type="range" 
        min="0" 
        max="100" 
        value="0" 
        class="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500" 
        oninput="window.Views.seekGlobalAudio(this.value)"
      />
      <span id="player-total-time">--:--</span>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  audio.play().catch(e => console.log('Audio autoplay note:', e.message));

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    const slider = document.getElementById('player-seek-slider');
    const curTimeSpan = document.getElementById('player-current-time');
    const totTimeSpan = document.getElementById('player-total-time');

    if (slider) slider.value = pct;
    if (curTimeSpan) curTimeSpan.textContent = window.Views._formatTime(audio.currentTime);
    if (totTimeSpan) totTimeSpan.textContent = window.Views._formatTime(audio.duration);
  });

  audio.addEventListener('ended', () => {
    window.Views.isGlobalAudioPlaying = false;
    const btn = document.getElementById('global-player-toggle');
    if (btn) btn.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i>';
    if (window.lucide) window.lucide.createIcons();
  });
};

window.Views.toggleGlobalAudioPlay = function() {
  const audio = window.Views.currentGlobalAudio;
  const btn = document.getElementById('global-player-toggle');
  if (!audio) return;

  if (audio.paused) {
    audio.play();
    window.Views.isGlobalAudioPlaying = true;
    if (btn) btn.innerHTML = '<i data-lucide="pause" class="w-4 h-4"></i>';
  } else {
    audio.pause();
    window.Views.isGlobalAudioPlaying = false;
    if (btn) btn.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i>';
  }
  if (window.lucide) window.lucide.createIcons();
};

window.Views.seekGlobalAudio = function(percent) {
  const audio = window.Views.currentGlobalAudio;
  if (audio && audio.duration) {
    audio.currentTime = (percent / 100) * audio.duration;
  }
};

window.Views.closeGlobalQuranPlayer = function() {
  if (window.Views.currentGlobalAudio) {
    window.Views.currentGlobalAudio.pause();
    window.Views.currentGlobalAudio = null;
  }
  const player = document.getElementById('quran-global-player');
  if (player) player.remove();
};

window.Views._formatTime = function(seconds) {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

console.log('Master Quran Module Initialized Flawlessly!');

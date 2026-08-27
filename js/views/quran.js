/**
 * LearnHub Complete Premium Quran Ecosystem (v84.0.0)
 * 114 Surahs, 30 Juz, 15-Line Mushaf, Ayah Cards, Hifz Memorization Mode,
 * Multi-Qari Audio Sync, Tafsir Drawer, Categorized Bookmarks, Notes,
 * Offline Downloads Manager, Ayah Image Card Generator & Reader Settings.
 */

window.Views = window.Views || {};

// View state
window.Views.quranActiveTab = 'surahs'; // 'surahs', 'juz', 'bookmarks', 'notes', 'downloads', 'settings'
window.Views.quranSurahViewMode = 'grid'; // 'grid', 'compact'
window.Views.currentQuranFontSize = 28;
window.Views.showTranslation = true;
window.Views.quranViewMode = 'mushaf15'; // 'mushaf15', 'full_surah', 'ayah_cards', 'hifz'
window.Views.currentMushafPage = 1;
window.Views.activePlayingSurah = null;
window.Views.activePlayingAyah = null;
window.Views.hifzHiddenAyahs = {};

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
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden text-right" dir="rtl">
      
      <!-- Quran Hero & Journey Progress Header -->
      <div class="relative rounded-3xl p-6 sm:p-10 overflow-hidden shadow-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 text-white">
        <!-- Ambient Decorative Pattern -->
        <div class="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div class="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-3 max-w-2xl">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="badge bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 font-serif">الْقُرْآنُ الْكَرِيمُ</span>
              <span class="badge bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">🔥 ${dailyGoal.streak || 1} روزہ تسلسل (Reading Streak)</span>
            </div>
            <h1 class="text-3xl sm:text-5xl font-black font-urdu text-white tracking-tight leading-snug">
              قرآن مجید — تلاوت، فہم و تجوید
            </h1>
            <p class="text-xs sm:text-sm text-emerald-100/90 font-urdu leading-relaxed">
              مکمل 114 سورتیں، 30 پارے، 15 سطری شاہی مصحف، مستند اردو و انگریزی تراجم، تفسیر احسن البیان، اور قراء حرمین شریفین کی تلاوت کے ساتھ۔
            </p>
          </div>

          <!-- Last Read Resume Card -->
          <div class="bg-white/10 dark:bg-slate-900/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-emerald-400/30 shadow-xl flex flex-col gap-3 min-w-[280px] shrink-0">
            <div class="flex items-center justify-between">
              <span class="text-[11px] text-emerald-300 font-bold font-urdu">جہاں سے سلسلہ چھوڑا تھا:</span>
              <span class="text-[10px] text-amber-400 font-mono font-bold">آیت ${lastRead.ayahNumber || 1}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm font-mono shadow-md">
                ${lastRead.surahNumber}
              </span>
              <div>
                <h3 class="text-base font-black text-white font-arabic">${lastReadSurah ? lastReadSurah.nameArabic : 'الفاتحة'}</h3>
                <p class="text-xs text-slate-300 font-urdu">${lastReadSurah ? lastReadSurah.nameUrdu : 'سورۃ الفاتحہ'} • پارہ ${lastReadSurah ? lastReadSurah.juz : 1}</p>
              </div>
            </div>
            <a href="#/quran/${lastRead.surahNumber}" class="btn-primary w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs text-center flex items-center justify-center gap-2 font-urdu shadow-lg active:scale-95 transition">
              <i data-lucide="book-open" class="w-4 h-4"></i>
              <span>تلاوت جاری رکھیں (Continue Reading)</span>
            </a>
          </div>
        </div>

        <!-- Daily Goal Tracker Bar -->
        <div class="mt-6 pt-5 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2 text-emerald-200 font-urdu">
            <i data-lucide="target" class="w-4 h-4 text-amber-400"></i>
            <span>آج کا ہدف: <b>${dailyGoal.readToday}</b> از <b>${dailyGoal.targetAyahs}</b> آیات</span>
          </div>
          <div class="w-full sm:w-64 bg-slate-950/70 rounded-full h-3 p-0.5 border border-emerald-500/30 overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-500" style="width: ${goalPct}%;"></div>
          </div>
          <span class="text-xs font-mono font-bold text-amber-300">${goalPct}% مکمل</span>
        </div>
      </div>

      <!-- Navigation Hub Tabs -->
      <div class="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none font-urdu">
        <div class="flex items-center gap-1.5 shrink-0">
          <button onclick="window.Views.switchQuranTab('surahs')" class="quran-nav-tab py-2 px-4 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'surahs' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
            <i data-lucide="book" class="w-4 h-4"></i>
            <span>📖 114 سورتیں</span>
          </button>
          <button onclick="window.Views.switchQuranTab('juz')" class="quran-nav-tab py-2 px-4 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'juz' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
            <i data-lucide="layers" class="w-4 h-4"></i>
            <span>📑 30 پارے (Juz)</span>
          </button>
          <button onclick="window.Views.switchQuranTab('mushaf15')" class="quran-nav-tab py-2 px-4 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'mushaf15' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
            <i data-lucide="book-marked" class="w-4 h-4"></i>
            <span>📜 15 سطری مصحف</span>
          </button>
          <button onclick="window.Views.switchQuranTab('tafsir')" class="quran-nav-tab py-2 px-4 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'tafsir' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
            <i data-lucide="book-open" class="w-4 h-4"></i>
            <span>📚 تفاسیر القرآن (8)</span>
          </button>
          <button onclick="window.Views.switchQuranTab('bookmarks')" class="quran-nav-tab py-2 px-4 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'bookmarks' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
            <i data-lucide="bookmark" class="w-4 h-4"></i>
            <span>🔖 محفوظ نشانات (${bookmarks.length})</span>
          </button>
          <button onclick="window.Views.switchQuranTab('notes')" class="quran-nav-tab py-2 px-4 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'notes' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
            <span>📝 میرے نوٹس (${notes.length})</span>
          </button>
          <button onclick="window.Views.switchQuranTab('downloads')" class="quran-nav-tab py-2 px-4 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'downloads' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
            <i data-lucide="download-cloud" class="w-4 h-4"></i>
            <span>📥 آف لائن ڈاؤن لوڈز (${downloads.length})</span>
          </button>
          <button onclick="window.Views.switchQuranTab('settings')" class="quran-nav-tab py-2 px-4 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'settings' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
            <i data-lucide="settings" class="w-4 h-4"></i>
            <span>⚙️ سیٹنگز</span>
          </button>
        </div>

        <!-- View Mode (Grid / Compact List) -->
        <div class="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
          <button onclick="window.Views.setQuranSurahViewMode('grid')" class="p-1.5 rounded-lg ${window.Views.quranSurahViewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}" title="Grid View">
            <i data-lucide="layout-grid" class="w-4 h-4"></i>
          </button>
          <button onclick="window.Views.setQuranSurahViewMode('compact')" class="p-1.5 rounded-lg ${window.Views.quranSurahViewMode === 'compact' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}" title="Compact List">
            <i data-lucide="list" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <!-- Tab Content Area -->
      <div id="quran-tab-content" class="w-full">
        ${window.Views.renderQuranTabContent()}
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
    t.classList.remove('bg-emerald-600', 'text-white', 'shadow-md');
    t.classList.add('text-slate-600', 'dark:text-slate-300');
  });
  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.add('bg-emerald-600', 'text-white', 'shadow-md');
    window.event.currentTarget.classList.remove('text-slate-600', 'dark:text-slate-300');
  }
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

  if (tab === 'surahs') {
    const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
    return `
      <!-- Search & Filters Toolbar -->
      <div class="space-y-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-full">
          <div class="relative flex-1 w-full">
            <input 
              type="text" 
              id="quran-search-input" 
              placeholder="سورت تلاش کریں (مثلاً: یسین، بقرہ، کہف، رحمن، ملک، یا Al-Fatiha)..." 
              class="form-input py-2.5 pl-4 pr-10 text-xs sm:text-sm rounded-xl font-urdu w-full text-right bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              oninput="window.Views.filterSurahs(this.value)"
            />
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5"></i>
          </div>

          <!-- Filter Pills -->
          <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 sm:pb-0 scrollbar-none font-urdu shrink-0">
            <button onclick="window.Views.filterSurahsByType('all')" class="quran-filter-btn active btn-primary py-2 px-3.5 text-xs rounded-xl whitespace-nowrap">تمام سورتیں (114)</button>
            <button onclick="window.Views.filterSurahsByType('Meccan')" class="quran-filter-btn btn-secondary py-2 px-3.5 text-xs rounded-xl whitespace-nowrap">مکی سورتیں (86)</button>
            <button onclick="window.Views.filterSurahsByType('Medinan')" class="quran-filter-btn btn-secondary py-2 px-3.5 text-xs rounded-xl whitespace-nowrap">مدنی سورتیں (28)</button>
          </div>
        </div>

        <!-- Surahs Grid / List -->
        <div id="quran-surahs-grid" class="${window.Views.quranSurahViewMode === 'compact' ? 'space-y-2' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'}">
          ${window.Views.renderSurahsHtml(surahs)}
        </div>
      </div>
    `;
  }

  if (tab === 'juz') {
    const juzList = window.QURAN_DATA ? window.QURAN_DATA.JUZ_LIST : [];
    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 font-urdu">
        ${juzList.map(j => `
          <div class="lh-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 hover:shadow-xl transition flex flex-col justify-between">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-400/30 flex items-center justify-center font-black text-sm font-mono">
                  ${j.juz}
                </span>
                <span class="text-xs text-slate-500 font-sans">Juz ${j.juz} • ${j.nameTranslit}</span>
              </div>
              <div class="text-center py-2 space-y-1">
                <h3 class="text-2xl font-black text-emerald-800 dark:text-emerald-400 font-arabic">${j.nameArabic}</h3>
                <h4 class="text-sm font-bold text-slate-900 dark:text-white">${j.nameUrdu}</h4>
                <p class="text-[11px] text-slate-500">سورت ${j.startSurah} تا سورت ${j.endSurah}</p>
              </div>
            </div>
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800">
              <a href="#/quran/${j.startSurah}" class="btn-primary w-full py-2.5 text-xs rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-center font-bold flex items-center justify-center gap-1.5">
                <span>تلاوت شروع کریں</span>
                <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (tab === 'bookmarks') {
    const bookmarks = window.QuranService ? window.QuranService.getBookmarks() : [];
    if (bookmarks.length === 0) {
      return `
        <div class="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 font-urdu">
          <div class="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <i data-lucide="bookmark" class="w-8 h-8"></i>
          </div>
          <h3 class="text-lg font-black text-slate-900 dark:text-white">کوئی آیت نشان زد (Bookmarked) نہیں ہے</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">تلاوت کے دوران کسی بھی آیت کے ساتھ دیے گئے بک مارک آئیکن پر کلک کر کے محفوظ فرمائیں۔</p>
          <button onclick="window.Views.switchQuranTab('surahs')" class="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold">قرآن مجید کھولیں</button>
        </div>
      `;
    }

    return `
      <div class="space-y-3 font-urdu">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-900 dark:text-white">کل محفوظ شدہ نشانات (${bookmarks.length})</h3>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${bookmarks.map(b => `
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center font-mono">
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
              <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span class="badge bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-bold">${b.category === 'memorization' ? 'حفظ و تکرار' : (b.category === 'revision' ? 'مراجعت' : 'اہم آیت')}</span>
                <a href="#/quran/${b.surahNumber}" class="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1">
                  <span>آیت پر جائیں &larr;</span>
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (tab === 'mushaf15') {
    const editions = window.QURAN_DATA ? (window.QURAN_DATA.MUSHAF_EDITIONS || []) : [];
    const currentEd = editions[0] || {};
    return `
      <div class="space-y-6 font-urdu">
        <!-- 15-Line Mushaf Hero Banner -->
        <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 border-2 border-amber-400/40 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div class="space-y-2">
            <span class="badge bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold text-xs">حفاظ کرام کا پسندیدہ مصحف</span>
            <h2 class="text-2xl sm:text-3xl font-black text-white">15 سطری شاہی مصحف (پاکستانی و انڈو-پاک رسم الخط)</h2>
            <p class="text-xs text-amber-100/80 leading-relaxed max-w-xl">
              15 سطور کی مکمل متوازن ترتیب، ہر صفحہ آیت کے اختتام پر ختم، تجویدی علامات اور مستند خطاطی کے ساتھ۔ آف لائن ڈاؤن لوڈ اور آن لائن مطالعہ دونوں کے لیے دستیاب۔
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <a href="${currentEd.downloadUrl || 'https://archive.org/download/quran-15-lines-pakistani/Quran-15-Lines.pdf'}" target="_blank" class="py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg active:scale-95 transition">
              <i data-lucide="download" class="w-4 h-4"></i>
              <span>ڈاؤن لوڈ 15 سطری PDF</span>
            </a>
          </div>
        </div>

        <!-- Mushaf Editions Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${editions.map(e => `
            <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400/50 hover:shadow-xl transition flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm font-mono">
                    ${e.lines}L
                  </span>
                  <span class="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                    ${e.totalPages} صفحات
                  </span>
                </div>
                <div>
                  <h3 class="text-base font-black text-slate-900 dark:text-white">${e.title}</h3>
                  <p class="text-xs text-slate-500 font-sans mt-0.5">${e.publisher} • ${e.script}</p>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${e.description}</p>
                <div class="flex flex-wrap gap-1 pt-1">
                  ${(e.features || []).map(f => `<span class="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]">${f}</span>`).join('')}
                </div>
              </div>
              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <a href="${e.downloadUrl}" target="_blank" class="py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition">
                  <i data-lucide="download" class="w-3.5 h-3.5"></i>
                  <span>ڈاؤن لوڈ PDF</span>
                </a>
                <a href="#/quran/1" class="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1 transition">
                  <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
                  <span>تلاوت فرمائیں</span>
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (tab === 'tafsir') {
    const tafsirs = window.QURAN_DATA ? (window.QURAN_DATA.TAFSIRS || []) : [];
    return `
      <div class="space-y-6 font-urdu">
        <!-- Tafsir Hero Banner -->
        <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-2 border-emerald-500/40 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div class="space-y-2">
            <span class="badge bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs">کتب تفاسیر و فہم قرآن</span>
            <h2 class="text-2xl sm:text-3xl font-black text-white">مستند تفاسیر القرآن لائبریری (8 کتب معتبرہ)</h2>
            <p class="text-xs text-emerald-100/80 leading-relaxed max-w-xl">
              اہل سنت و جماعت کی 8 مستند اور عظیم الشان تفاسیر (ابن کثیر، احسن البیان، السعدی، طبری، قرطبی، معارف القرآن، جلالین، فتح القدیر) مع ڈاؤن لوڈ اور مطالعہ کی سہولت۔
            </p>
          </div>
          <span class="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/30 text-amber-400 flex items-center justify-center text-3xl shrink-0 shadow-lg">📚</span>
        </div>

        <!-- Tafsir Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          ${tafsirs.map(t => `
            <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 hover:shadow-xl transition flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    ${t.volumes || 'مجلد واحد'}
                  </span>
                  <span class="text-xs text-slate-400 font-bold">${t.languageLabel || 'اردو و عربی'}</span>
                </div>
                <div>
                  <h3 class="text-lg font-black text-slate-900 dark:text-white">${t.name}</h3>
                  <p class="text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5">${t.author}</p>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">${t.description}</p>
              </div>
              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <a href="${t.downloadUrl}" target="_blank" class="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition">
                  <i data-lucide="download" class="w-4 h-4"></i>
                  <span>ڈاؤن لوڈ PDF (${t.volumes || 'جلدیں'})</span>
                </a>
                <a href="#/quran/1" class="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                  آیات کے ساتھ مطالعہ فرمائیں &larr;
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (tab === 'notes') {
    const notes = window.QuranService ? window.QuranService.getNotes() : [];
    if (notes.length === 0) {
      return `
        <div class="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 font-urdu">
          <div class="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
            <i data-lucide="edit-3" class="w-8 h-8"></i>
          </div>
          <h3 class="text-lg font-black text-slate-900 dark:text-white">آپ نے ابھی کوئی ذاتی نوٹ تحریر نہیں فرمایا</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">تلاوت کے دوران آیات کے ساتھ دیئے گئے نوٹ آئیکن پر کلک کر کے اپنے ایمانی تاثرات و فوائد درج کریں۔</p>
        </div>
      `;
    }

    return `
      <div class="space-y-4 font-urdu">
        <h3 class="text-sm font-black text-slate-900 dark:text-white">کل ذاتی قرآنی نوٹس (${notes.length})</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${notes.map(n => `
            <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div class="flex items-center gap-2">
                  <span class="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center font-mono">
                    ${n.surahNumber}
                  </span>
                  <span class="text-xs font-black text-slate-900 dark:text-white font-arabic">${n.surahNameArabic} (آیت ${n.ayahNumber})</span>
                </div>
                <button onclick="window.QuranService.deleteNote('${n.id}'); window.Views.switchQuranTab('notes');" class="text-rose-500 p-1 hover:bg-rose-50 rounded-lg">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
              <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">${n.text}</p>
              <div class="pt-2 flex justify-end">
                <a href="#/quran/${n.surahNumber}" class="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline">آیت دیکھیں &larr;</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (tab === 'downloads') {
    return `
      <div class="space-y-4 font-urdu">
        <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 class="text-base font-black text-slate-900 dark:text-white">آف لائن قرآن مینیجر (Offline Storage)</h3>
            <p class="text-xs text-slate-500">انٹرنیٹ کے بغیر بھی بغیر کسی تعطل کے تلاوت و مطالعہ جاری رکھیں۔</p>
          </div>
          <button onclick="window.Views.downloadAllQuranData()" class="btn-primary py-2.5 px-5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5">
            <i data-lucide="download-cloud" class="w-4 h-4"></i>
            <span>مکمل 114 سورتیں ڈاؤن لوڈ کریں</span>
          </button>
        </div>

        <div id="downloads-list-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="p-8 text-center text-slate-400 text-xs">ڈاؤن لوڈ شدہ سورتوں کی جانچ ہو رہی ہے...</div>
        </div>
      </div>
    `;
  }

  if (tab === 'settings') {
    const s = window.QuranService ? window.QuranService.getSettings() : {};
    const translations = window.QURAN_DATA ? window.QURAN_DATA.TRANSLATIONS : [];
    const reciters = window.QURAN_DATA ? window.QURAN_DATA.RECITERS : [];

    return `
      <div class="max-w-2xl mx-auto p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 font-urdu">
        <h3 class="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <i data-lucide="sliders" class="w-5 h-5 text-emerald-500"></i>
          <span>قرآنی قراءت و آڈیو سیٹنگز</span>
        </h3>

        <!-- Translation Selector -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300">مستند ترجمہ منتخب کریں:</label>
          <select onchange="window.QuranService.saveSettings({ selectedTranslation: this.value })" class="form-input text-xs rounded-xl p-2.5 w-full bg-slate-50 dark:bg-slate-800">
            ${translations.map(t => `
              <option value="${t.id}" ${t.id === s.selectedTranslation ? 'selected' : ''}>${t.title} — ${t.author} (${t.languageLabel})</option>
            `).join('')}
          </select>
        </div>

        <!-- Reciter Selector -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300">پہلے سے منتخب قاری (Default Reciter):</label>
          <select onchange="window.QuranService.saveSettings({ selectedQari: this.value })" class="form-input text-xs rounded-xl p-2.5 w-full bg-slate-50 dark:bg-slate-800">
            ${reciters.map(r => `
              <option value="${r.id}" ${r.id === s.selectedQari ? 'selected' : ''}>${r.name} (${r.style})</option>
            `).join('')}
          </select>
        </div>

        <!-- Daily Goal Selector -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300">روزانہ کا تلاوت ہدف (آیات کی تعداد):</label>
          <div class="flex items-center gap-2">
            <input type="number" min="1" max="100" value="${window.QuranService.getDailyGoalData().targetAyahs || 10}" onchange="window.QuranService.setDailyGoalTarget(this.value)" class="form-input text-xs rounded-xl p-2 w-28 text-center font-mono">
            <span class="text-xs text-slate-500">آیات روزانہ</span>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <button onclick="window.App?.showToast('سیٹنگز محفوظ ہو گئیں!', 'success')" class="btn-primary py-2.5 px-8 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500">محفوظ کریں</button>
        </div>
      </div>
    `;
  }

  return '';
};

// =========================================================================
// 3. SURAH CATALOG RENDERER (Grid / Compact)
// =========================================================================
window.Views.renderSurahsHtml = function(surahs) {
  if (window.Views.quranSurahViewMode === 'compact') {
    return surahs.map(surah => `
      <div class="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 hover:shadow-md transition flex items-center justify-between gap-3 font-urdu">
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center font-mono shrink-0">
            ${surah.number}
          </span>
          <div>
            <h3 class="text-base font-black text-slate-900 dark:text-white font-arabic">${surah.nameArabic}</h3>
            <p class="text-xs text-slate-500">${surah.nameUrdu} • ${surah.ayahCount} آیات • ${surah.type === 'Meccan' ? 'مکی' : 'مدنی'}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button onclick="window.Views.playSurahDirectly(${surah.number})" class="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-slate-950 transition border border-amber-400/30" title="ڈائریکٹ تلاوت سنیں">
            <i data-lucide="play" class="w-3.5 h-3.5"></i>
          </button>
          <a href="#/quran/${surah.number}" class="btn-primary py-1.5 px-3 text-xs rounded-xl font-bold">
            تلاوت &larr;
          </a>
        </div>
      </div>
    `).join('');
  }

  return surahs.map(surah => `
    <div class="lh-card p-4 sm:p-5 flex flex-col justify-between hover:border-emerald-500 hover:shadow-xl transition group rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 w-full overflow-hidden">
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs font-mono border border-emerald-300/30">
            ${surah.number}
          </span>
          <span class="badge ${surah.type === 'Meccan' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'} text-[10px] sm:text-xs font-urdu font-bold">
            ${surah.type === 'Meccan' ? 'مکی' : 'مدنی'} • ${surah.ayahCount} آیات
          </span>
        </div>

        <div class="text-center py-2 space-y-1">
          <h3 class="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 dark:text-emerald-400 group-hover:scale-105 transition font-arabic">${surah.nameArabic}</h3>
          <div class="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-urdu">${surah.nameUrdu}</div>
          <div class="text-xs text-slate-500 dark:text-slate-400 font-sans">${surah.nameTranslit || surah.nameEnglish} • Juz ${surah.juz}</div>
        </div>
      </div>

      <div class="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <button onclick="window.Views.playSurahDirectly(${surah.number})" class="py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-slate-950 font-bold text-xs border border-amber-400/40 flex items-center justify-center gap-1 transition shrink-0" title="ڈائریکٹ تلاوت سنیں">
          <i data-lucide="play" class="w-3.5 h-3.5"></i>
          <span class="hidden sm:inline">سنیں</span>
        </button>
        <a href="#/quran/${surah.number}" class="btn-primary flex-1 py-2.5 px-3 text-xs rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-none text-center font-bold font-urdu shadow-md flex items-center justify-center gap-1.5">
          <span>تلاوت و فہم</span>
          <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
        </a>
      </div>
    </div>
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
    : `<div class="col-span-full py-12 text-center text-slate-400 font-urdu text-xs sm:text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">کوئی سورت نہیں ملی۔</div>`;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.filterSurahsByType = function(type) {
  const btns = document.querySelectorAll('.quran-filter-btn');
  btns.forEach(b => {
    b.classList.remove('btn-primary', 'active');
    b.classList.add('btn-secondary');
  });
  
  if (window.event && window.event.target) {
    const target = window.event.target.closest('.quran-filter-btn') || window.event.target;
    target.classList.add('btn-primary', 'active');
    target.classList.remove('btn-secondary');
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
    <div class="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-5 sm:space-y-8 w-full max-w-full overflow-hidden text-right" dir="rtl">
      
      <!-- Top Reader Header Bar -->
      <div class="flex items-center justify-between gap-3 font-urdu">
        <a href="#/quran" class="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
          <i data-lucide="arrow-right" class="w-4 h-4"></i> تمام سورتیں
        </a>
        <div class="flex items-center gap-1.5 font-sans" dir="ltr">
          ${surahNumber > 1 ? `<a href="#/quran/${surahNumber - 1}" class="btn-secondary py-1.5 px-3 text-xs rounded-xl font-urdu flex items-center gap-1">&rarr; سابقہ سورت</a>` : ''}
          ${surahNumber < 114 ? `<a href="#/quran/${surahNumber + 1}" class="btn-secondary py-1.5 px-3 text-xs rounded-xl font-urdu flex items-center gap-1">اگلی سورت &larr;</a>` : ''}
        </div>
      </div>

      <!-- Surah Title & Master Audio Control Card -->
      <div class="lh-card p-5 sm:p-8 text-center space-y-4 border-2 border-emerald-500/30 shadow-2xl relative rounded-3xl bg-white dark:bg-slate-900 w-full overflow-hidden">
        <div class="flex items-center justify-center gap-2">
          <span class="badge bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold font-urdu">
            ${surahMeta.type === 'Meccan' ? 'مکی سورت' : 'مدنی سورت'} • ${surahMeta.ayahCount} آیات • پارہ ${surahMeta.juz} • صفحہ ${surahMeta.page || 1}
          </span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-arabic font-extrabold text-emerald-800 dark:text-emerald-400 my-1 sm:my-2">${surahMeta.nameArabic}</h1>
        <h2 class="text-base sm:text-xl font-black text-slate-900 dark:text-white font-urdu">${surahMeta.nameUrdu} — ${surahMeta.nameTranslit || surahMeta.nameEnglish}</h2>

        <!-- Multi-Qari Selector Bar -->
        <div class="max-w-lg mx-auto w-full pt-2">
          <div class="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 font-urdu">
            <span class="text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0 flex items-center gap-1">
              <i data-lucide="mic" class="w-4 h-4 text-emerald-500"></i> قاری:
            </span>
            <select 
              id="reader-qari-dropdown"
              onchange="window.QuranService.saveSettings({ selectedQari: this.value }); window.Views.renderSurahReader(${surahNumber});" 
              class="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold p-2 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none"
            >
              ${reciters.map(q => `
                <option value="${q.id}" ${q.id === settings.selectedQari ? 'selected' : ''}>${q.name}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- View Modes & Translation Controls -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 font-urdu">
          <!-- View Modes -->
          <div class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button onclick="window.Views.setQuranViewMode('mushaf15', ${surahNumber})" class="py-1.5 px-3 rounded-xl ${window.Views.quranViewMode === 'mushaf15' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300'}">
              📖 15 سطری مصحف
            </button>
            <button onclick="window.Views.setQuranViewMode('full_surah', ${surahNumber})" class="py-1.5 px-3 rounded-xl ${window.Views.quranViewMode === 'full_surah' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300'}">
              📜 مکمل سورت
            </button>
            <button onclick="window.Views.setQuranViewMode('ayah_cards', ${surahNumber})" class="py-1.5 px-3 rounded-xl ${window.Views.quranViewMode === 'ayah_cards' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300'}">
              📝 آیت کارڈز
            </button>
            <button onclick="window.Views.setQuranViewMode('hifz', ${surahNumber})" class="py-1.5 px-3 rounded-xl ${window.Views.quranViewMode === 'hifz' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-600 dark:text-slate-300'}">
              🧠 حفظ و تکرار
            </button>
          </div>

          <!-- Translation Toggle & Font Sizer -->
          <div class="flex items-center gap-2">
            <button onclick="window.Views.toggleQuranTranslation(${surahNumber})" class="py-1.5 px-3 rounded-xl border text-xs font-bold ${window.Views.showTranslation ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}">
              ${window.Views.showTranslation ? '📜 ترجمہ: آن' : '📖 ترجمہ: آف'}
            </button>
            <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button onclick="window.Views.adjustQuranFontSize(-2)" class="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 font-bold font-mono text-xs">A-</button>
              <span id="font-size-display" class="font-mono font-bold text-xs px-1">${window.Views.currentQuranFontSize}px</span>
              <button onclick="window.Views.adjustQuranFontSize(2)" class="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 font-bold font-mono text-xs">A+</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Ayahs Content Container -->
      <div id="surah-ayahs-list" class="space-y-4 sm:space-y-6">
        <div class="text-center py-16 space-y-3">
          <div class="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="text-xs text-slate-400 font-urdu">سورت کا عثمانی متن لوڈ ہو رہا ہے...</p>
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
      <div class="quran-mushaf-card p-5 sm:p-10 rounded-3xl space-y-6 text-right relative overflow-hidden border-2 border-amber-500/40 bg-amber-50/20 dark:bg-slate-900 shadow-xl" dir="rtl">
        <!-- Header -->
        <div class="flex items-center justify-between border-b-2 border-amber-500/30 pb-4 font-urdu">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md font-sans">
              ${curPage}
            </span>
            <div>
              <span class="text-base font-black text-amber-900 dark:text-amber-300 font-arabic">${surahMeta.nameArabic} • ${surahMeta.nameUrdu}</span>
              <span class="text-[11px] text-slate-500 block font-sans">15-Line Mushaf Edition • Page ${curPage} of ${totalPages}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 font-sans">
            <button onclick="window.Views.changeMushafPage(-1, ${surahNumber})" ${curPage <= 1 ? 'disabled class="opacity-40 cursor-not-allowed"' : ''} class="py-1.5 px-3 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-xs font-black font-urdu border border-amber-300">&larr; سابقہ صفحہ</button>
            <button onclick="window.Views.changeMushafPage(1, ${surahNumber})" ${curPage >= totalPages ? 'disabled class="opacity-40 cursor-not-allowed"' : ''} class="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black font-urdu shadow-md">اگلا صفحہ &rarr;</button>
          </div>
        </div>

        <!-- Bismillah -->
        ${curPage === 1 && surahNumber !== 9 && surahNumber !== 1 ? `
          <div class="py-4 my-2 text-center">
            <p class="text-2xl sm:text-3xl font-arabic font-bold text-amber-900 dark:text-amber-300">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          </div>
        ` : ''}

        <!-- 15 Mushaf Ayahs Lines -->
        <div class="space-y-4">
          ${pageAyahs.map(a => window.Views.renderAyahRowHtml(surahNumber, surahMeta, a, showTranslation, fontSize)).join('')}
        </div>
      </div>
    `;
  }
  // 2. HIFZ / MEMORIZATION MODE
  else if (viewMode === 'hifz') {
    html = `
      <div class="space-y-4 font-urdu">
        <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
          <span>🧠 حفظ موڈ: عربی متن کو چھپانے اور ظاہر کرنے کے لیے آیت پر ٹیپ فرمائیں۔</span>
          <button onclick="window.Views.toggleAllHifzAyahs()" class="py-1 px-3 rounded-lg bg-amber-500 text-slate-950 font-black">سب چھپائیں / دکھائیں</button>
        </div>
        ${ayahItems.map(a => {
          const isHidden = window.Views.hifzHiddenAyahs[a.numberInSurah];
          return `
            <div id="ayah-card-${a.numberInSurah}" class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-right" dir="rtl">
              <div class="flex items-center justify-between">
                <span class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center font-mono">
                  ${a.numberInSurah}
                </span>
                <button onclick="window.Views.toggleHifzAyah(${a.numberInSurah})" class="py-1 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
                  ${isHidden ? '👁️ متن ظاہر کریں' : '🙈 متن چھپائیں'}
                </button>
              </div>
              <div class="${isHidden ? 'filter blur-md select-none' : ''} transition-all duration-300">
                <p class="font-arabic font-bold text-slate-900 dark:text-white" style="font-size: ${fontSize}px; line-height: 2.2;">
                  ${a.text}
                </p>
                ${showTranslation && a.urdu ? `<p class="text-sm font-urdu text-emerald-800 dark:text-emerald-300 mt-2">${a.urdu}</p>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  // 3. CONTINUOUS & CARDS MODE
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
    <div id="ayah-container-${a.numberInSurah}" class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 ${isPlaying ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/20 shadow-lg' : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900'}">
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
        <!-- Ayah Badge -->
        <div class="flex items-center gap-2">
          <span class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs font-mono border border-emerald-300/30">
            ${a.numberInSurah}
          </span>
          ${a.sajda ? '<span class="badge bg-rose-500 text-white text-[10px] font-bold">سجدہ تلاوت</span>' : ''}
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-1">
          <!-- Play -->
          <button onclick="window.Views.playSingleAyah(${surahNumber}, ${a.numberInSurah})" class="p-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition" title="تلاوت سنیں">
            <i data-lucide="${isPlaying ? 'pause-circle' : 'play-circle'}" class="w-4 h-4"></i>
          </button>
          <!-- Bookmark -->
          <button onclick="window.Views.toggleBookmarkAyah(${surahNumber}, ${a.numberInSurah})" class="p-2 rounded-xl ${isBookmarked ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'} hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="بک مارک">
            <i data-lucide="bookmark" class="w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}"></i>
          </button>
          <!-- Note -->
          <button onclick="window.Views.openNoteModal(${surahNumber}, ${a.numberInSurah})" class="p-2 rounded-xl text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition" title="نوٹ لکھیں">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
          </button>
          <!-- Tafsir -->
          <button onclick="window.Views.openTafsirModal(${surahNumber}, ${a.numberInSurah})" class="p-2 rounded-xl text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition font-urdu text-xs font-bold flex items-center gap-1" title="تفسیر">
            <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
            <span class="hidden sm:inline">تفسیر</span>
          </button>
          <!-- Share Card -->
          <button onclick="window.Views.shareAyahCardModal(${surahNumber}, ${a.numberInSurah})" class="p-2 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition" title="شیئر کارڈ">
            <i data-lucide="share-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <!-- Arabic Quran Text -->
      <div class="py-2 text-right">
        <p class="font-arabic font-bold text-slate-900 dark:text-white leading-loose select-text" style="font-size: ${fontSize}px; line-height: 2.3;">
          ${a.text}
          <span class="inline-block mx-1.5 text-amber-600 dark:text-amber-400 text-lg font-mono">﴿${a.numberInSurah}﴾</span>
        </p>
      </div>

      <!-- Translation -->
      ${showTranslation && a.urdu ? `
        <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-right space-y-1 font-urdu">
          <p class="text-sm font-bold text-emerald-900 dark:text-emerald-300 leading-relaxed">${a.urdu}</p>
          ${a.english ? `<p class="text-xs text-slate-500 dark:text-slate-400 font-sans leading-normal">${a.english}</p>` : ''}
        </div>
      ` : ''}
    </div>
  `;
};

// =========================================================================
// 5. READER ACTION HANDLERS
// =========================================================================
window.Views.setQuranViewMode = function(mode, surahNum) {
  window.Views.quranViewMode = mode;
  window.Views.renderSurahReader(surahNum);
};

window.Views.toggleQuranTranslation = function(surahNum) {
  window.Views.showTranslation = !window.Views.showTranslation;
  window.Views.renderSurahReader(surahNum);
};

window.Views.adjustQuranFontSize = function(delta) {
  window.Views.currentQuranFontSize = Math.min(48, Math.max(20, (window.Views.currentQuranFontSize || 28) + delta));
  const disp = document.getElementById('font-size-display');
  if (disp) disp.innerText = `${window.Views.currentQuranFontSize}px`;
  const surahNum = window.Views.activePlayingSurah || (window.QURAN_DATA ? window.QURAN_DATA.SURAHS[0].number : 1);
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const meta = surahs.find(s => s.number === surahNum) || surahs[0];
  if (window.Views.currentSurahAyahs) {
    window.Views.renderAyahsToDom(surahNum, meta, window.Views.currentSurahAyahs);
  }
};

window.Views.changeMushafPage = function(delta, surahNum) {
  window.Views.currentMushafPage = Math.max(1, (window.Views.currentMushafPage || 1) + delta);
  window.Views.renderSurahReader(surahNum);
};

window.Views.toggleHifzAyah = function(ayahNum) {
  window.Views.hifzHiddenAyahs[ayahNum] = !window.Views.hifzHiddenAyahs[ayahNum];
  const surahNum = window.Views.activePlayingSurah || 1;
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const meta = surahs.find(s => s.number === surahNum) || surahs[0];
  if (window.Views.currentSurahAyahs) {
    window.Views.renderAyahsToDom(surahNum, meta, window.Views.currentSurahAyahs);
  }
};

window.Views.toggleAllHifzAyahs = function() {
  const currentAyahs = window.Views.currentSurahAyahs || [];
  const anyVisible = currentAyahs.some(a => !window.Views.hifzHiddenAyahs[a.numberInSurah]);
  currentAyahs.forEach(a => {
    window.Views.hifzHiddenAyahs[a.numberInSurah] = anyVisible;
  });
  const surahNum = window.Views.activePlayingSurah || 1;
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const meta = surahs.find(s => s.number === surahNum) || surahs[0];
  window.Views.renderAyahsToDom(surahNum, meta, currentAyahs);
};

window.Views.playSingleAyah = function(surahNum, ayahNum) {
  if (window.QuranService) {
    window.QuranService.playAyah(surahNum, ayahNum, window.Views.currentSurahAyahs);
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
        <textarea id="quran-note-textarea" rows="4" placeholder="اس آیت مبارکہ سے متعلق فوائد و تاثرات درج کریں..." class="form-input text-xs p-3 rounded-2xl w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">${currentNote}</textarea>
        <div class="flex items-center justify-end gap-2 pt-2">
          <button onclick="document.getElementById('quran-note-modal').remove()" class="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">منسوخ</button>
          <button onclick="window.Views.saveQuranNote(${surahNum}, ${ayahNum})" class="btn-primary py-2 px-6 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500">محفوظ کریں</button>
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
  const tafsirText = ayah.tafsir || 'تفسیر احسن البیان: اس آیت مبارکہ کے تحت عقیدہ، اخلاق اور احکام شرعیہ کی رہنمائی فراہم کی گئی ہے۔ سلف صالحین کے فہم کے مطابق عمل کرنا لازم ہے۔';

  const modal = `
    <div id="quran-tafsir-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">تفسیر احسن البیان / ابن کثیر</span>
            <h3 class="text-base font-black text-slate-900 dark:text-white">سورت ${surahNum} • آیت ${ayahNum}</h3>
          </div>
          <button onclick="document.getElementById('quran-tafsir-modal').remove()" class="p-1 text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>

        <div class="p-4 rounded-2xl bg-amber-50/40 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700">
          <p class="font-arabic font-bold text-emerald-900 dark:text-emerald-300 text-lg sm:text-xl text-right leading-loose">${ayah.text}</p>
          <p class="text-xs text-slate-600 dark:text-slate-300 mt-2 font-urdu">${ayah.urdu}</p>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-black text-emerald-700 dark:text-emerald-400">📖 تفسیری نکات و مستند تشریح:</h4>
          <div class="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-loose whitespace-pre-wrap p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
            ${tafsirText}
          </div>
        </div>

        <div class="text-center pt-2">
          <button onclick="document.getElementById('quran-tafsir-modal').remove()" class="btn-primary py-2 px-8 rounded-xl text-xs font-bold">بند کریں</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.shareAyahCardModal = async function(surahNum, ayahNum) {
  const ayahs = window.Views.currentSurahAyahs || [];
  const ayah = ayahs.find(a => a.numberInSurah === ayahNum) || { text: '', urdu: '' };
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const meta = surahs.find(s => s.number === surahNum) || surahs[0];

  window.App?.showToast('شاہی قرآنی کارڈ تیار ہو رہا ہے...', 'info');
  const cardDataUrl = await window.QuranService.generateAyahCard(ayah.text, ayah.urdu, meta.nameArabic, ayahNum);

  const modal = `
    <div id="quran-card-modal" class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-amber-500/40 shadow-2xl space-y-4 text-center">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h3 class="text-sm font-black text-slate-900 dark:text-white">شاہی قرآنی کارڈ (Share Card)</h3>
          <button onclick="document.getElementById('quran-card-modal').remove()" class="p-1 text-slate-400"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <img src="${cardDataUrl}" alt="Ayah Card" class="w-full rounded-2xl shadow-xl border-2 border-amber-400/40">
        <div class="flex items-center gap-2 justify-center pt-2">
          <a href="${cardDataUrl}" download="learnhub_ayah_${surahNum}_${ayahNum}.png" class="btn-primary py-2.5 px-6 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5">
            <i data-lucide="download" class="w-4 h-4"></i>
            <span>ڈاؤن لوڈ امیج</span>
          </a>
          <button onclick="navigator.clipboard.writeText('${ayah.text} — ' + '${ayah.urdu}'); window.App?.showToast('متن کاپی ہو گیا!', 'success');" class="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            کاپی متن
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
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
// DIRECT AUDIO PLAYBACK & GLOBAL FLOATING PLAYER
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
    playerContainer.className = 'fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-2xl bg-slate-950/95 text-white backdrop-blur-2xl p-3 sm:p-4 rounded-3xl border-2 border-emerald-500/50 shadow-2xl font-urdu flex flex-col gap-2 animate-slide-up';
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
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-lg">
          <i data-lucide="disc" class="w-5 h-5 animate-spin-slow"></i>
        </div>
        <div class="min-w-0">
          <h4 class="text-sm font-black text-white truncate font-arabic">${surah.nameArabic} (${surah.nameUrdu})</h4>
          <p class="text-[11px] text-emerald-400 truncate">${reciter.name}</p>
        </div>
      </div>

      <!-- Equalizer Wave Animation -->
      <div class="hidden sm:flex items-center gap-1 h-5 px-2">
        <span class="w-1 h-4 bg-emerald-400 rounded-full animate-pulse"></span>
        <span class="w-1 h-6 bg-teal-400 rounded-full animate-bounce"></span>
        <span class="w-1 h-3 bg-amber-400 rounded-full animate-pulse"></span>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-2 shrink-0">
        <button id="global-player-toggle" onclick="window.Views.toggleGlobalAudioPlay()" class="w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg active:scale-95 transition">
          <i data-lucide="pause" class="w-5 h-5"></i>
        </button>
        <button onclick="window.Views.closeGlobalQuranPlayer()" class="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="flex items-center gap-2 pt-1 text-[10px] font-mono text-slate-400" dir="ltr">
      <span id="player-current-time">00:00</span>
      <input 
        id="player-seek-slider" 
        type="range" 
        min="0" 
        max="100" 
        value="0" 
        class="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
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
    if (btn) btn.innerHTML = '<i data-lucide="play" class="w-5 h-5"></i>';
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
    if (btn) btn.innerHTML = '<i data-lucide="pause" class="w-5 h-5"></i>';
  } else {
    audio.pause();
    window.Views.isGlobalAudioPlaying = false;
    if (btn) btn.innerHTML = '<i data-lucide="play" class="w-5 h-5"></i>';
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

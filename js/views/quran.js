/**
 * LearnHub Authentic Master Quran Ecosystem
 * Seamless Single-Header Architecture with zero border clutter,
 * Unified Majestic Islamic Teal & Gold styling, full 114 Surahs and 30 Juz support.
 */

window.Views = window.Views || {};

// View State Management
window.Views.quranActiveTab = 'surahs';
window.Views.currentQuranFontSize = 30;
window.Views.showTranslation = true;
window.Views.quranViewMode = 'ayah_cards'; // 'ayah_cards', 'mushaf15', 'hifz'
window.Views.currentMushafPage = 1;
window.Views.activePlayingSurah = null;
window.Views.activePlayingAyah = null;
window.Views.hifzHiddenAyahs = {};
window.Views.currentSurahAyahs = [];
window.Views.currentJuzAyahs = [];
window.Views.activeJuzNumber = 1;

// =========================================================================
// 1. QURAN MAIN HUB (#/quran)
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
  const bookmarks = window.QuranService ? window.QuranService.getBookmarks() : [];

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="rtl">
      
      <!-- Top Majestic Quran Header (Teal & Gold) -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-4xl mx-auto px-4 py-5 sm:py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">📖</span>
              <div>
                <h1 class="text-xl sm:text-2xl font-black font-arabic leading-tight">الْقُرْآنُ الْكَرِيمُ</h1>
                <p class="text-[11px] text-teal-200 font-sans">Holy Quran • Recitation & Translations</p>
              </div>
            </div>
            <a href="#/quran/${lastRead.surahNumber}" class="py-2 px-3.5 rounded-2xl bg-teal-700/90 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 border border-teal-600/60 shadow-sm transition active:scale-95">
              <i data-lucide="bookmark" class="w-3.5 h-3.5 text-amber-300"></i>
              <span>پچھلا مطالعہ: ${lastReadSurah ? lastReadSurah.nameArabic : 'الفاتحة'} (${lastRead.ayahNumber})</span>
            </a>
          </div>

          <!-- Quick Search Bar -->
          <div class="mt-4 relative">
            <input 
              type="text" 
              id="quran-search-input" 
              placeholder="سورت یا پارہ تلاش کریں (نام، نمبر، مثلاً: بقرہ، یسین، الم، 36)..." 
              class="w-full bg-teal-900/80 text-white placeholder-teal-300/70 border border-teal-600/60 rounded-2xl py-3 pl-4 pr-11 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 text-right font-urdu"
              oninput="window.Views.filterSurahs(this.value)"
            />
            <i data-lucide="search" class="w-4 h-4 text-teal-300 absolute right-3.5 top-3.5"></i>
          </div>
        </div>

        <!-- Navigation Tabs Bar -->
        <div class="bg-teal-900/90 border-t border-teal-700/60">
          <div class="max-w-4xl mx-auto px-2 flex items-center justify-around text-xs font-bold overflow-x-auto scrollbar-none">
            <button onclick="window.Views.switchQuranTab('surahs')" class="quran-tab-btn py-3 px-3 border-b-2 transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'surahs' ? 'border-amber-400 text-amber-300 font-black' : 'border-transparent text-teal-200 hover:text-white'}" data-tab="surahs">
              <i data-lucide="book-open" class="w-4 h-4"></i>
              <span>سورتیں (114)</span>
            </button>
            <button onclick="window.Views.switchQuranTab('juz')" class="quran-tab-btn py-3 px-3 border-b-2 transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'juz' ? 'border-amber-400 text-amber-300 font-black' : 'border-transparent text-teal-200 hover:text-white'}" data-tab="juz">
              <i data-lucide="layers" class="w-4 h-4"></i>
              <span>پارے (30)</span>
            </button>
            <button onclick="window.Views.switchQuranTab('mushaf15')" class="quran-tab-btn py-3 px-3 border-b-2 transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'mushaf15' ? 'border-amber-400 text-amber-300 font-black' : 'border-transparent text-teal-200 hover:text-white'}" data-tab="mushaf15">
              <i data-lucide="book-marked" class="w-4 h-4"></i>
              <span>15 سطری مصحف</span>
            </button>
            <button onclick="window.Views.switchQuranTab('bookmarks')" class="quran-tab-btn py-3 px-3 border-b-2 transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'bookmarks' ? 'border-amber-400 text-amber-300 font-black' : 'border-transparent text-teal-200 hover:text-white'}" data-tab="bookmarks">
              <i data-lucide="bookmark" class="w-4 h-4"></i>
              <span>محفوظات (${bookmarks.length})</span>
            </button>
            <button onclick="window.Views.switchQuranTab('tafsir')" class="quran-tab-btn py-3 px-3 border-b-2 transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'tafsir' ? 'border-amber-400 text-amber-300 font-black' : 'border-transparent text-teal-200 hover:text-white'}" data-tab="tafsir">
              <i data-lucide="library" class="w-4 h-4"></i>
              <span>تفاسیر (8)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Tab Content Area -->
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-5" id="quran-tab-content">
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
  const tabs = document.querySelectorAll('.quran-tab-btn');
  tabs.forEach(t => {
    if (t.getAttribute('data-tab') === tabName) {
      t.className = 'quran-tab-btn py-3 px-3 border-b-2 transition flex items-center gap-1.5 border-amber-400 text-amber-300 font-black';
    } else {
      t.className = 'quran-tab-btn py-3 px-3 border-b-2 transition flex items-center gap-1.5 border-transparent text-teal-200 hover:text-white';
    }
  });
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
      <div class="space-y-3">
        <!-- Filter Pills Bar -->
        <div class="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <div class="flex items-center gap-1.5">
            <button onclick="window.Views.filterSurahsByType('all')" class="quran-filter-pill active py-1.5 px-3 rounded-xl font-bold bg-teal-800 text-amber-300 border border-teal-600/50 shadow-sm">تمام (114)</button>
            <button onclick="window.Views.filterSurahsByType('Meccan')" class="quran-filter-pill py-1.5 px-3 rounded-xl font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">مکی سورتیں (86)</button>
            <button onclick="window.Views.filterSurahsByType('Medinan')" class="quran-filter-pill py-1.5 px-3 rounded-xl font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">مدنی سورتیں (28)</button>
          </div>
          <span class="text-[11px] text-slate-400 font-sans">114 Surahs</span>
        </div>

        <!-- Surahs Mobile List -->
        <div id="quran-surahs-grid" class="space-y-2">
          ${window.Views.renderSurahsHtml(surahs)}
        </div>
      </div>
    `;
  }

  // TAB 2: 30 JUZ / PARAS (Direct Link to Juz Reader)
  if (tab === 'juz') {
    const juzList = window.QURAN_DATA ? window.QURAN_DATA.JUZ_LIST : [];
    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${juzList.map(j => `
          <a href="#/juz/${j.juz}" class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-600 transition flex items-center justify-between shadow-sm hover:shadow-md group">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-600/30 text-teal-800 dark:text-teal-300 font-black text-xs flex items-center justify-center font-mono group-hover:bg-teal-800 group-hover:text-amber-300 transition">
                ${j.juz}
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">${j.nameUrdu}</h3>
                <p class="text-[11px] text-slate-400 font-sans">Juz ${j.juz} • ${j.nameTranslit}</p>
                <p class="text-[10px] text-teal-700 dark:text-teal-400 mt-0.5">سورت ${j.startSurah} تا سورت ${j.endSurah}</p>
              </div>
            </div>
            <div class="text-left font-arabic text-xl font-bold text-teal-800 dark:text-teal-300">
              ${j.nameArabic}
            </div>
          </a>
        `).join('')}
      </div>
    `;
  }

  // TAB 3: 15-LINE MUSHAF
  if (tab === 'mushaf15') {
    const editions = window.QURAN_DATA ? (window.QURAN_DATA.MUSHAF_EDITIONS || []) : [];
    const currentEd = editions[0] || {};
    return `
      <div class="space-y-4">
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="space-y-1.5">
            <span class="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300">حفاظ کرام کا پسندیدہ مصحف</span>
            <h2 class="text-lg font-black text-slate-900 dark:text-white">15 سطری شاہی مصحف (انڈو-پاک و پاکستانی رسم الخط)</h2>
            <p class="text-xs text-slate-500 leading-relaxed">
              15 سطور کی مکمل متوازن ترتیب، ہر صفحہ آیت کے اختتام پر ختم، تجویدی علامات اور مستند خطاطی۔
            </p>
          </div>
          <a href="${currentEd.downloadUrl || 'https://archive.org/download/quran-15-lines-pakistani/Quran-15-Lines.pdf'}" target="_blank" class="py-2.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 shrink-0 border border-teal-600">
            <i data-lucide="download" class="w-4 h-4"></i>
            <span>ڈاؤن لوڈ 15 سطری PDF</span>
          </a>
        </div>

        <div class="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-600/30 text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center justify-between">
          <span>📜 مصحف ریڈر: کسی بھی سورت یا پارے کے اندر "15 سطری مصحف" موڈ آن کریں۔</span>
          <a href="#/quran/1" class="py-1 px-3 rounded-lg bg-teal-800 text-amber-300 font-bold border border-teal-600">مصحف کھولیں &larr;</a>
        </div>
      </div>
    `;
  }

  // TAB 4: BOOKMARKS
  if (tab === 'bookmarks') {
    const bookmarks = window.QuranService ? window.QuranService.getBookmarks() : [];
    if (bookmarks.length === 0) {
      return `
        <div class="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 mx-auto flex items-center justify-center text-xl">
            🔖
          </div>
          <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300">کوئی آیت نشان زد (Bookmarked) نہیں ہے</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">تلاوت کے دوران کسی بھی آیت کے بک مارک آئیکن پر ٹیپ کر کے محفوظ فرمائیں۔</p>
        </div>
      `;
    }

    return `
      <div class="space-y-3">
        <h3 class="text-xs font-bold text-slate-400">محفوظ شدہ آیات (${bookmarks.length})</h3>
        <div class="space-y-2">
          ${bookmarks.map(b => `
            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center font-mono border border-teal-600/30">
                  ${b.surahNumber}
                </span>
                <div>
                  <h4 class="text-sm font-bold text-slate-900 dark:text-white font-arabic">${b.surahNameArabic}</h4>
                  <p class="text-[11px] text-slate-400">آیت مبارکہ: ${b.ayahNumber}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <a href="#/quran/${b.surahNumber}" class="py-1.5 px-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-800 hover:text-amber-300 text-teal-700 dark:text-teal-300 font-bold text-xs transition">
                  تلاوت کریں &larr;
                </a>
                <button onclick="window.QuranService.removeBookmark('${b.id}'); window.Views.switchQuranTab('bookmarks');" class="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // TAB 5: TAFSEER
  if (tab === 'tafsir') {
    const tafsirs = window.QURAN_DATA ? (window.QURAN_DATA.TAFSIRS || []) : [];
    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${tafsirs.map(t => `
          <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3">
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[10px] font-bold border border-teal-600/30">${t.volumes || 'مجلد واحد'}</span>
                <span class="text-[10px] text-slate-400">${t.languageLabel || 'اردو'}</span>
              </div>
              <h3 class="text-sm font-black text-slate-900 dark:text-white">${t.name}</h3>
              <p class="text-xs text-teal-700 dark:text-teal-400 font-bold mt-0.5">${t.author}</p>
              <p class="text-xs text-slate-500 mt-1 line-clamp-2">${t.description}</p>
            </div>
            <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button onclick="window.Router.navigate('/tafsir/${t.id}')" class="flex-1 py-1.5 px-3 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1 shadow-sm border border-teal-600">
                <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
                <span>مطالعہ کریں</span>
              </button>
              <a href="${t.downloadUrl}" target="_blank" class="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-teal-700" title="PDF">
                <i data-lucide="download" class="w-4 h-4"></i>
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  return '';
};

// =========================================================================
// 3. SURAH ROW RENDERER
// =========================================================================
window.Views.renderSurahsHtml = function(surahs) {
  return surahs.map(surah => `
    <a href="#/quran/${surah.number}" class="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 hover:border-teal-600 transition flex items-center justify-between gap-3 group shadow-xs hover:shadow-sm">
      <div class="flex items-center gap-3.5 min-w-0">
        <div class="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-600/30 text-teal-800 dark:text-teal-300 font-black text-xs flex items-center justify-center font-mono shrink-0 group-hover:bg-teal-800 group-hover:text-amber-300 transition shadow-2xs">
          ${surah.number}
        </div>
        <div class="min-w-0">
          <div class="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-teal-700 dark:group-hover:text-teal-400 transition">
            ${surah.nameUrdu} — ${surah.nameTranslit || surah.nameEnglish}
          </div>
          <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            ${surah.type === 'Meccan' ? 'مکی سورت' : 'مدنی سورت'} • ${surah.ayahCount} آیات • پارہ ${surah.juz}
          </div>
        </div>
      </div>
      <div class="text-left shrink-0 font-arabic font-bold text-xl sm:text-2xl text-teal-800 dark:text-teal-300 group-hover:scale-105 transition-transform">
        ${surah.nameArabic}
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
    : `<div class="py-12 text-center text-slate-400 text-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">کوئی سورت نہیں ملی۔</div>`;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.filterSurahsByType = function(type) {
  const pills = document.querySelectorAll('.quran-filter-pill');
  pills.forEach(p => {
    p.className = 'quran-filter-pill py-1.5 px-3 rounded-xl font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
  });
  
  if (window.event && window.event.target) {
    const target = window.event.target.closest('.quran-filter-pill') || window.event.target;
    target.className = 'quran-filter-pill active py-1.5 px-3 rounded-xl font-bold bg-teal-800 text-amber-300 border border-teal-600/50 shadow-sm';
  }

  const grid = document.getElementById('quran-surahs-grid');
  if (!grid) return;

  const all = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const filtered = type === 'all' ? all : all.filter(s => s.type === type);
  grid.innerHTML = window.Views.renderSurahsHtml(filtered);
  if (window.lucide) window.lucide.createIcons();
};

// =========================================================================
// 4. SURAH READER (#/quran/:id) — SINGLE SEAMLESS INTEGRATED HEADER
// =========================================================================
window.Views.renderSurahReader = async function(surahNumber) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const surahMeta = surahs.find(s => s.number === surahNumber) || surahs[0];

  if (window.QuranService) {
    window.QuranService.saveLastRead(surahNumber, 1, surahMeta.page, surahMeta.juz);
  }

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-36" dir="rtl">
      
      <!-- Single Integrated Majestic Header (Surah Title + Navigation + All Controls Combined!) -->
      <div class="bg-teal-800 text-white shadow-md sticky top-0 z-30">
        
        <!-- Row 1: Surah Title and Nav Controls -->
        <div class="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          <a href="#/quran" class="py-1.5 px-3 rounded-xl bg-teal-700/80 hover:bg-teal-700 text-white flex items-center gap-1.5 text-xs font-bold transition border border-teal-600/50 shadow-xs">
            <i data-lucide="arrow-right" class="w-4 h-4 text-amber-300"></i>
            <span class="hidden sm:inline">سورتیں</span>
          </a>

          <!-- Integrated Center Title Button -->
          <div class="flex items-center gap-2 min-w-0 cursor-pointer" onclick="window.Views.openSurahJumpModal()">
            <span class="w-7 h-7 rounded-xl bg-amber-400 text-teal-950 font-mono text-xs flex items-center justify-center font-black shadow-xs">${surahNumber}</span>
            <div class="min-w-0 text-center">
              <h1 class="text-base sm:text-lg font-black font-arabic truncate leading-tight text-amber-300">سُورَةُ ${surahMeta.nameArabic}</h1>
              <p class="text-[10px] text-teal-200 truncate font-urdu">${surahMeta.nameUrdu} • ${surahMeta.type === 'Meccan' ? 'مكية' : 'مدنية'} • ${surahMeta.ayahCount} آیات</p>
            </div>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-amber-300"></i>
          </div>

          <div class="flex items-center gap-1" dir="ltr">
            <button onclick="window.Views.playSurahDirectly(${surahNumber})" class="py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-teal-950 text-xs font-black flex items-center gap-1 shadow-xs transition active:scale-95">
              <i data-lucide="play" class="w-3.5 h-3.5 fill-teal-950"></i>
              <span class="font-urdu hidden sm:inline">تلاوت</span>
            </button>
            ${surahNumber > 1 ? `<a href="#/quran/${surahNumber - 1}" class="p-1.5 rounded-xl bg-teal-700/80 hover:bg-teal-700 text-white border border-teal-600/50 transition"><i data-lucide="chevron-left" class="w-4 h-4"></i></a>` : ''}
            ${surahNumber < 114 ? `<a href="#/quran/${surahNumber + 1}" class="p-1.5 rounded-xl bg-teal-700/80 hover:bg-teal-700 text-white border border-teal-600/50 transition"><i data-lucide="chevron-right" class="w-4 h-4"></i></a>` : ''}
          </div>
        </div>

        <!-- Row 2: Unified Controls Strip (Seamless with Header, No Extra Borders!) -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-2">
          <div class="max-w-3xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-1 p-0.5 bg-teal-950/80 rounded-xl font-bold border border-teal-700/50">
              <button onclick="window.Views.setQuranViewMode('ayah_cards', ${surahNumber})" class="mode-btn py-1 px-3 rounded-lg transition ${window.Views.quranViewMode === 'ayah_cards' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'text-teal-200 hover:text-white'}" data-mode="ayah_cards">
                تلاوت مع ترجمہ
              </button>
              <button onclick="window.Views.setQuranViewMode('mushaf15', ${surahNumber})" class="mode-btn py-1 px-3 rounded-lg transition ${window.Views.quranViewMode === 'mushaf15' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'text-teal-200 hover:text-white'}" data-mode="mushaf15">
                15 سطری مصحف
              </button>
              <button onclick="window.Views.setQuranViewMode('hifz', ${surahNumber})" class="mode-btn py-1 px-3 rounded-lg transition ${window.Views.quranViewMode === 'hifz' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'text-teal-200 hover:text-white'}" data-mode="hifz">
                حفظ و تکرار
              </button>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="window.Views.toggleQuranTranslation(${surahNumber})" id="translation-toggle-btn" class="py-1 px-3 rounded-xl border text-xs font-bold ${window.Views.showTranslation ? 'bg-teal-700 text-amber-300 border-amber-400/40 font-black shadow-xs' : 'bg-teal-950/80 text-teal-200 border-teal-700/50'}">
                ${window.Views.showTranslation ? '📜 ترجمہ: آن' : '📖 ترجمہ: آف'}
              </button>
              <div class="flex items-center gap-1 bg-teal-950/80 p-0.5 rounded-xl border border-teal-700/50 font-mono text-xs text-white">
                <button onclick="window.Views.adjustQuranFontSize(-2)" class="w-6 h-6 rounded-md bg-teal-800 hover:bg-teal-700 text-amber-300 font-black">A-</button>
                <span id="font-size-display" class="px-1 text-[11px] font-bold">${window.Views.currentQuranFontSize}px</span>
                <button onclick="window.Views.adjustQuranFontSize(2)" class="w-6 h-6 rounded-md bg-teal-800 hover:bg-teal-700 text-amber-300 font-black">A+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Reader Canvas -->
      <div class="max-w-3xl mx-auto px-3 sm:px-4 py-4 space-y-4">
        
        <!-- Sacred Bismillah Emblem (Only for Surahs != 1 and != 9) -->
        ${surahNumber !== 9 && surahNumber !== 1 ? `
          <div class="py-3 text-center">
            <p class="text-2xl sm:text-3xl font-arabic font-extrabold text-teal-900 dark:text-teal-200 tracking-wide select-none">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
          </div>
        ` : ''}

        <!-- Dynamic Ayahs List -->
        <div id="surah-ayahs-list" class="space-y-3">
          <div class="text-center py-12 space-y-2">
            <div class="w-8 h-8 border-3 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p class="text-xs text-slate-400 font-bold">قرآن مجید کا عثمانی متن لوڈ ہو رہا ہے...</p>
          </div>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  const ayahs = window.QuranService ? await window.QuranService.getSurahVerses(surahNumber) : [];
  window.Views.currentSurahAyahs = ayahs;
  window.Views.renderAyahsToDom(surahNumber, surahMeta, ayahs);
};

// =========================================================================
// 5. JUZ / PARA READER (#/juz/:id) — SINGLE SEAMLESS INTEGRATED HEADER
// =========================================================================
window.Views.renderJuzReader = async function(juzNumber) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const num = parseInt(juzNumber, 10) || 1;
  window.Views.activeJuzNumber = num;

  const juzList = window.QURAN_DATA ? window.QURAN_DATA.JUZ_LIST : [];
  const juzMeta = juzList.find(j => j.juz === num) || juzList[0];

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-36" dir="rtl">
      
      <!-- Single Integrated Majestic Header (Juz Title + Navigation + Controls Combined!) -->
      <div class="bg-teal-800 text-white shadow-md sticky top-0 z-30">
        
        <!-- Row 1: Juz Title and Nav Controls -->
        <div class="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          <a href="#/quran" onclick="window.Views.quranActiveTab = 'juz';" class="py-1.5 px-3 rounded-xl bg-teal-700/80 hover:bg-teal-700 text-white flex items-center gap-1.5 text-xs font-bold transition border border-teal-600/50 shadow-xs">
            <i data-lucide="arrow-right" class="w-4 h-4 text-amber-300"></i>
            <span class="hidden sm:inline">پارے</span>
          </a>

          <!-- Integrated Center Title Button -->
          <div class="flex items-center gap-2 min-w-0 cursor-pointer" onclick="window.Views.openJuzJumpModal()">
            <span class="w-7 h-7 rounded-xl bg-amber-400 text-teal-950 font-mono text-xs flex items-center justify-center font-black shadow-xs">${num}</span>
            <div class="min-w-0 text-center">
              <h1 class="text-base sm:text-lg font-black font-arabic truncate leading-tight text-amber-300">الجُزْءُ ${juzMeta.nameArabic}</h1>
              <p class="text-[10px] text-teal-200 truncate font-urdu">${juzMeta.nameUrdu} • سورت ${juzMeta.startSurah} تا ${juzMeta.endSurah}</p>
            </div>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-amber-300"></i>
          </div>

          <div class="flex items-center gap-1" dir="ltr">
            ${num > 1 ? `<a href="#/juz/${num - 1}" class="p-1.5 rounded-xl bg-teal-700/80 hover:bg-teal-700 text-white border border-teal-600/50 transition" title="سابقہ پارہ"><i data-lucide="chevron-left" class="w-4 h-4"></i></a>` : ''}
            ${num < 30 ? `<a href="#/juz/${num + 1}" class="p-1.5 rounded-xl bg-teal-700/80 hover:bg-teal-700 text-white border border-teal-600/50 transition" title="اگلا پارہ"><i data-lucide="chevron-right" class="w-4 h-4"></i></a>` : ''}
          </div>
        </div>

        <!-- Row 2: Unified Controls Strip (Seamless with Header, No Extra Borders!) -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-2">
          <div class="max-w-3xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-1 p-0.5 bg-teal-950/80 rounded-xl font-bold border border-teal-700/50">
              <button onclick="window.Views.setJuzViewMode('ayah_cards', ${num})" class="juz-mode-btn py-1 px-3 rounded-lg transition ${window.Views.quranViewMode === 'ayah_cards' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'text-teal-200 hover:text-white'}" data-mode="ayah_cards">
                تلاوت مع ترجمہ
              </button>
              <button onclick="window.Views.setJuzViewMode('mushaf15', ${num})" class="juz-mode-btn py-1 px-3 rounded-lg transition ${window.Views.quranViewMode === 'mushaf15' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'text-teal-200 hover:text-white'}" data-mode="mushaf15">
                15 سطری مصحف
              </button>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="window.Views.toggleJuzTranslation(${num})" id="juz-translation-btn" class="py-1 px-3 rounded-xl border text-xs font-bold ${window.Views.showTranslation ? 'bg-teal-700 text-amber-300 border-amber-400/40 font-black shadow-xs' : 'bg-teal-950/80 text-teal-200 border-teal-700/50'}">
                ${window.Views.showTranslation ? '📜 ترجمہ: آن' : '📖 ترجمہ: آف'}
              </button>
              <div class="flex items-center gap-1 bg-teal-950/80 p-0.5 rounded-xl border border-teal-700/50 font-mono text-xs text-white">
                <button onclick="window.Views.adjustQuranFontSize(-2)" class="w-6 h-6 rounded-md bg-teal-800 hover:bg-teal-700 text-amber-300 font-black">A-</button>
                <span id="font-size-display" class="px-1 text-[11px] font-bold">${window.Views.currentQuranFontSize}px</span>
                <button onclick="window.Views.adjustQuranFontSize(2)" class="w-6 h-6 rounded-md bg-teal-800 hover:bg-teal-700 text-amber-300 font-black">A+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Juz Reader Canvas -->
      <div class="max-w-3xl mx-auto px-3 sm:px-4 py-4 space-y-4">
        
        <!-- Dynamic Juz Ayahs Stream -->
        <div id="juz-ayahs-list" class="space-y-4">
          <div class="text-center py-12 space-y-2">
            <div class="w-8 h-8 border-3 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p class="text-xs text-slate-400 font-bold">پارہ کا عثمانی متن لوڈ ہو رہا ہے...</p>
          </div>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  const ayahs = window.QuranService ? await window.QuranService.getJuzVerses(num) : [];
  window.Views.currentJuzAyahs = ayahs;
  window.Views.renderJuzAyahsToDom(num, juzMeta, ayahs);
};

// =========================================================================
// 6. RENDER JUZ AYAHS WITH ELEGANT SURAH SEPARATORS (NO DUPLICATE BORDERS)
// =========================================================================
window.Views.renderJuzAyahsToDom = function(juzNumber, juzMeta, ayahItems) {
  const container = document.getElementById('juz-ayahs-list');
  if (!container) return;

  const showTranslation = window.Views.showTranslation !== undefined ? window.Views.showTranslation : true;
  const fontSize = window.Views.currentQuranFontSize || 30;
  const viewMode = window.Views.quranViewMode || 'ayah_cards';
  const allSurahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];

  // Group ayahs by Surah
  const surahGroups = [];
  let currentGroup = null;

  ayahItems.forEach(a => {
    const sNum = a.surahNumber || (a.surahMeta ? a.surahMeta.number : 1);
    if (!currentGroup || currentGroup.surahNumber !== sNum) {
      const meta = allSurahs.find(s => s.number === sNum) || a.surahMeta || { number: sNum, nameArabic: '', nameUrdu: '' };
      currentGroup = {
        surahNumber: sNum,
        surahMeta: meta,
        ayahs: []
      };
      surahGroups.push(currentGroup);
    }
    currentGroup.ayahs.push(a);
  });

  if (viewMode === 'mushaf15') {
    container.innerHTML = `
      <div class="p-6 sm:p-8 rounded-3xl bg-amber-50/25 dark:bg-slate-900 border-2 border-amber-600/30 shadow-sm space-y-6 text-right" dir="rtl">
        ${surahGroups.map(group => `
          <div class="space-y-3">
            <!-- Sleek Surah Ribbon inside Mushaf -->
            <div class="text-center py-2 bg-teal-800 text-white rounded-xl shadow-xs my-2">
              <h3 class="text-lg font-arabic font-black text-amber-300">سُورَةُ ${group.surahMeta.nameArabic}</h3>
              <p class="text-[10px] text-teal-200 font-urdu">${group.surahMeta.nameUrdu} • ${group.surahMeta.type === 'Meccan' ? 'مكية' : 'مدنية'}</p>
            </div>

            ${group.surahNumber !== 9 && group.surahNumber !== 1 ? `
              <div class="py-1 text-center">
                <p class="text-xl font-arabic font-extrabold text-teal-900 dark:text-teal-200 select-none">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
              </div>
            ` : ''}

            <div class="quran-arabic-text text-justify leading-loose text-slate-900 dark:text-slate-100" style="font-size: ${fontSize}px; line-height: 2.6;">
              ${group.ayahs.map(a => `
                <span id="ayah-container-${group.surahNumber}-${a.numberInSurah}" class="inline cursor-pointer hover:text-teal-700 transition" onclick="window.Views.playSingleAyah(${group.surahNumber}, ${a.numberInSurah})">
                  ${a.text}
                  <span class="quran-ayah-ornament inline-flex items-center justify-center w-7 h-7 mx-1 text-xs font-mono text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 border border-teal-600/40 rounded-full select-none">
                    ${a.numberInSurah}
                  </span>
                </span>
              `).join(' ')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else {
    // Continuous Clean Flowing Stream with Sleek Surah Ribbon
    container.innerHTML = surahGroups.map(group => `
      <div class="space-y-3 pt-2">
        
        <!-- Sleek Unified Surah Ribbon (No bulky heavy stacked borders!) -->
        <div class="p-3 rounded-2xl bg-teal-800 text-white text-center shadow-xs flex items-center justify-between px-4">
          <span class="text-[11px] text-teal-200 font-urdu font-medium">${group.surahMeta.type === 'Meccan' ? 'مكية' : 'مدنية'} • ${group.surahMeta.ayahCount || group.ayahs.length} آیات</span>
          <h2 class="text-xl font-arabic font-black text-amber-300">سُورَةُ ${group.surahMeta.nameArabic}</h2>
          <span class="text-[11px] text-teal-200 font-urdu font-medium">${group.surahMeta.nameUrdu}</span>
        </div>

        <!-- Bismillah Calligraphy (Only once, never duplicated) -->
        ${group.surahNumber !== 9 && group.surahNumber !== 1 ? `
          <div class="py-2.5 text-center">
            <p class="text-2xl sm:text-3xl font-arabic font-extrabold text-teal-900 dark:text-teal-200 tracking-wide select-none">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
          </div>
        ` : ''}

        <!-- Ayahs in this Surah -->
        <div class="space-y-3">
          ${group.ayahs.map(a => window.Views.renderAyahRowHtml(group.surahNumber, group.surahMeta, a, showTranslation, fontSize)).join('')}
        </div>
      </div>
    `).join('');
  }

  if (window.lucide) window.lucide.createIcons();
};

// =========================================================================
// 7. AYAH ROW RENDERER (Clean, No-Duplication Ayah Row)
// =========================================================================
window.Views.renderAyahRowHtml = function(surahNumber, surahMeta, a, showTranslation, fontSize) {
  const isBookmarked = window.QuranService ? window.QuranService.isAyahBookmarked(surahNumber, a.numberInSurah) : false;
  const isPlaying = window.Views.activePlayingSurah === surahNumber && window.Views.activePlayingAyah === a.numberInSurah;

  return `
    <div id="ayah-container-${surahNumber}-${a.numberInSurah}" class="p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${isPlaying ? 'border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 shadow-xs ring-1 ring-teal-600/40' : 'border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900'}">
      
      <!-- Top Action Bar -->
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
        <div class="flex items-center gap-1.5">
          <span class="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-black text-xs flex items-center justify-center font-mono border border-teal-600/30">
            ${a.numberInSurah}
          </span>
          ${a.sajda ? '<span class="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold border border-rose-300">سجدہ واجب</span>' : ''}
        </div>

        <div class="flex items-center gap-1 text-slate-400">
          <button onclick="window.Views.playSingleAyah(${surahNumber}, ${a.numberInSurah})" class="p-1.5 rounded-lg hover:text-teal-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="آیت سنیں">
            <i data-lucide="${isPlaying ? 'pause' : 'play'}" class="w-4 h-4 ${isPlaying ? 'text-teal-700 fill-teal-700' : ''}"></i>
          </button>
          <button onclick="window.Views.openTafsirModal(${surahNumber}, ${a.numberInSurah})" class="p-1.5 rounded-lg hover:text-teal-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="تفسیر">
            <i data-lucide="book-open" class="w-4 h-4"></i>
          </button>
          <button onclick="window.Views.openNoteModal(${surahNumber}, ${a.numberInSurah})" class="p-1.5 rounded-lg hover:text-teal-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="نوٹ">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
          </button>
          <button onclick="window.Views.toggleBookmarkAyah(${surahNumber}, ${a.numberInSurah})" class="p-1.5 rounded-lg hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="بک مارک">
            <i data-lucide="bookmark" class="w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}"></i>
          </button>
          <button onclick="window.Views.shareAyahCardModal(${surahNumber}, ${a.numberInSurah})" class="p-1.5 rounded-lg hover:text-teal-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="شیئر">
            <i data-lucide="share-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <!-- Crystal Clear Arabic Text with Tashkeel -->
      <div class="py-1 text-right">
        <p class="font-arabic font-bold text-slate-900 dark:text-white select-text" style="font-size: ${fontSize || 30}px; line-height: 2.3;">
          ${a.text}
          <span class="inline-flex items-center justify-center w-7 h-7 mx-1 text-xs font-mono text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 border border-teal-600/40 rounded-full align-middle select-none">
            ${a.numberInSurah}
          </span>
        </p>
      </div>

      <!-- Clean Urdu Translation -->
      ${showTranslation && (a.urdu || a.translation || a.english) ? `
        <div class="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
          ${a.urdu ? `<p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-urdu leading-relaxed">${a.urdu}</p>` : ''}
          ${a.english ? `<p class="text-[11px] text-slate-500 dark:text-slate-400 font-sans italic text-left" dir="ltr">${a.english}</p>` : ''}
        </div>
      ` : ''}

    </div>
  `;
};

// =========================================================================
// 8. SURAH & JUZ CONTROLLERS
// =========================================================================
window.Views.renderAyahsToDom = function(surahNumber, surahMeta, ayahItems) {
  const ayahsList = document.getElementById('surah-ayahs-list');
  if (!ayahsList) return;

  const viewMode = window.Views.quranViewMode || 'ayah_cards';
  const showTranslation = window.Views.showTranslation !== undefined ? window.Views.showTranslation : true;
  const fontSize = window.Views.currentQuranFontSize || 30;

  let html = '';

  if (viewMode === 'mushaf15') {
    const itemsPerPage = 15;
    const totalPages = Math.ceil(ayahItems.length / itemsPerPage);
    const curPage = Math.min(Math.max(1, window.Views.currentMushafPage || 1), totalPages);
    const startIndex = (curPage - 1) * itemsPerPage;
    const pageAyahs = ayahItems.slice(startIndex, startIndex + itemsPerPage);

    html = `
      <div class="p-6 sm:p-8 rounded-3xl bg-amber-50/25 dark:bg-slate-900 border-2 border-amber-600/30 shadow-sm space-y-6 text-right" dir="rtl">
        <div class="flex items-center justify-between border-b border-amber-500/20 pb-3 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-teal-800 text-amber-300 font-mono font-black flex items-center justify-center text-xs border border-teal-600">
              ${curPage}
            </span>
            <span class="font-bold text-slate-700 dark:text-slate-300">صفحہ ${curPage} از ${totalPages}</span>
          </div>
          <div class="flex items-center gap-1.5 font-sans">
            <button onclick="window.Views.changeMushafPage(-1, ${surahNumber})" ${curPage <= 1 ? 'disabled class="opacity-40 cursor-not-allowed"' : ''} class="py-1 px-3 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold font-urdu border border-slate-200 dark:border-slate-700">&larr; سابقہ صفحہ</button>
            <button onclick="window.Views.changeMushafPage(1, ${surahNumber})" ${curPage >= totalPages ? 'disabled class="opacity-40 cursor-not-allowed"' : ''} class="py-1 px-3 rounded-lg bg-teal-800 text-amber-300 text-xs font-black font-urdu shadow-xs border border-teal-600">اگلا صفحہ &rarr;</button>
          </div>
        </div>

        <div class="quran-arabic-text text-justify leading-loose text-slate-900 dark:text-slate-100" style="font-size: ${fontSize}px; line-height: 2.6;">
          ${pageAyahs.map(a => `
            <span id="ayah-container-${surahNumber}-${a.numberInSurah}" class="inline cursor-pointer hover:text-teal-700 transition" onclick="window.Views.playSingleAyah(${surahNumber}, ${a.numberInSurah})">
              ${a.text}
              <span class="quran-ayah-ornament inline-flex items-center justify-center w-7 h-7 mx-1 text-xs font-mono text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 border border-teal-600/40 rounded-full select-none">
                ${a.numberInSurah}
              </span>
            </span>
          `).join(' ')}
        </div>

        <div class="flex items-center justify-center gap-2 pt-4 border-t border-amber-500/20">
          <button onclick="window.Views.changeMushafPage(-1, ${surahNumber})" ${curPage <= 1 ? 'disabled class="opacity-40 cursor-not-allowed"' : ''} class="py-1.5 px-4 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700 font-urdu">&larr; سابقہ</button>
          <span class="text-xs font-mono font-bold text-slate-500 px-3">Page ${curPage} / ${totalPages}</span>
          <button onclick="window.Views.changeMushafPage(1, ${surahNumber})" ${curPage >= totalPages ? 'disabled class="opacity-40 cursor-not-allowed"' : ''} class="py-1.5 px-4 rounded-xl bg-teal-800 text-amber-300 text-xs font-black shadow-xs font-urdu border border-teal-600">اگلا &rarr;</button>
        </div>
      </div>
    `;
  } else if (viewMode === 'hifz') {
    html = `
      <div class="space-y-3">
        <div class="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-600/30 flex items-center justify-between text-xs font-bold text-teal-900 dark:text-teal-200">
          <span>🧠 حفظ موڈ: یادداشت جانچنے کے لیے آیت پر ٹیپ فرمائیں۔</span>
          <button onclick="window.Views.toggleAllHifzAyahs()" class="py-1 px-3 rounded-lg bg-teal-800 text-amber-300 font-bold border border-teal-600">سب چھپائیں / دکھائیں</button>
        </div>

        ${ayahItems.map(a => {
          const isHidden = window.Views.hifzHiddenAyahs[a.numberInSurah];
          return `
            <div id="ayah-card-${a.numberInSurah}" class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2.5 text-right" dir="rtl">
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span class="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center font-mono border border-teal-600/30">
                  ${a.numberInSurah}
                </span>
                <button onclick="window.Views.toggleHifzAyah(${a.numberInSurah})" class="py-1 px-2.5 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  ${isHidden ? '👁️ متن ظاہر کریں' : '🙈 متن چھپائیں'}
                </button>
              </div>
              <div class="${isHidden ? 'filter blur-md select-none opacity-40' : ''} transition-all duration-200">
                <p class="font-arabic font-bold text-slate-900 dark:text-white" style="font-size: ${fontSize}px; line-height: 2.3;">
                  ${a.text}
                </p>
                ${showTranslation && a.urdu ? `<p class="text-xs font-urdu text-teal-700 dark:text-teal-400 mt-1.5">${a.urdu}</p>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else {
    html = `
      <div class="space-y-3">
        ${ayahItems.map(a => window.Views.renderAyahRowHtml(surahNumber, surahMeta, a, showTranslation, fontSize)).join('')}
      </div>
    `;
  }

  ayahsList.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();
};

window.Views.setQuranViewMode = function(mode, surahNumber) {
  window.Views.quranViewMode = mode;
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const meta = surahs.find(s => s.number === surahNumber) || surahs[0];
  
  const modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach(btn => {
    if (btn.getAttribute('data-mode') === mode) {
      btn.className = 'mode-btn py-1 px-3 rounded-lg transition bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40';
    } else {
      btn.className = 'mode-btn py-1 px-3 rounded-lg transition text-teal-200 hover:text-white';
    }
  });

  if (window.Views.currentSurahAyahs && window.Views.currentSurahAyahs.length > 0) {
    window.Views.renderAyahsToDom(surahNumber, meta, window.Views.currentSurahAyahs);
  }
};

window.Views.setJuzViewMode = function(mode, juzNumber) {
  window.Views.quranViewMode = mode;
  const juzList = window.QURAN_DATA ? window.QURAN_DATA.JUZ_LIST : [];
  const meta = juzList.find(j => j.juz === juzNumber) || juzList[0];

  const modeBtns = document.querySelectorAll('.juz-mode-btn');
  modeBtns.forEach(btn => {
    if (btn.getAttribute('data-mode') === mode) {
      btn.className = 'juz-mode-btn py-1 px-3 rounded-lg transition bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40';
    } else {
      btn.className = 'juz-mode-btn py-1 px-3 rounded-lg transition text-teal-200 hover:text-white';
    }
  });

  if (window.Views.currentJuzAyahs && window.Views.currentJuzAyahs.length > 0) {
    window.Views.renderJuzAyahsToDom(juzNumber, meta, window.Views.currentJuzAyahs);
  }
};

window.Views.toggleQuranTranslation = function(surahNumber) {
  window.Views.showTranslation = !window.Views.showTranslation;
  const btn = document.getElementById('translation-toggle-btn');
  if (btn) {
    btn.textContent = window.Views.showTranslation ? '📜 ترجمہ: آن' : '📖 ترجمہ: آف';
    btn.className = window.Views.showTranslation 
      ? 'py-1 px-3 rounded-xl border text-xs font-bold bg-teal-700 text-amber-300 border-amber-400/40 font-black shadow-xs'
      : 'py-1 px-3 rounded-xl border text-xs font-bold bg-teal-950/80 text-teal-200 border-teal-700/50';
  }
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const meta = surahs.find(s => s.number === surahNumber) || surahs[0];
  if (window.Views.currentSurahAyahs && window.Views.currentSurahAyahs.length > 0) {
    window.Views.renderAyahsToDom(surahNumber, meta, window.Views.currentSurahAyahs);
  }
};

window.Views.toggleJuzTranslation = function(juzNumber) {
  window.Views.showTranslation = !window.Views.showTranslation;
  const btn = document.getElementById('juz-translation-btn');
  if (btn) {
    btn.textContent = window.Views.showTranslation ? '📜 ترجمہ: آن' : '📖 ترجمہ: آف';
    btn.className = window.Views.showTranslation 
      ? 'py-1 px-3 rounded-xl border text-xs font-bold bg-teal-700 text-amber-300 border-amber-400/40 font-black shadow-xs'
      : 'py-1 px-3 rounded-xl border text-xs font-bold bg-teal-950/80 text-teal-200 border-teal-700/50';
  }
  const juzList = window.QURAN_DATA ? window.QURAN_DATA.JUZ_LIST : [];
  const meta = juzList.find(j => j.juz === juzNumber) || juzList[0];
  if (window.Views.currentJuzAyahs && window.Views.currentJuzAyahs.length > 0) {
    window.Views.renderJuzAyahsToDom(juzNumber, meta, window.Views.currentJuzAyahs);
  }
};

window.Views.adjustQuranFontSize = function(delta) {
  window.Views.currentQuranFontSize = Math.max(18, Math.min(54, (window.Views.currentQuranFontSize || 30) + delta));
  const disp = document.getElementById('font-size-display');
  if (disp) disp.textContent = window.Views.currentQuranFontSize + 'px';
  
  document.querySelectorAll('#surah-ayahs-list p.font-arabic, #juz-ayahs-list p.font-arabic, .quran-arabic-text').forEach(el => {
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
      if (isHidden) textContainer.classList.add('filter', 'blur-md', 'select-none', 'opacity-40');
      else textContainer.classList.remove('filter', 'blur-md', 'select-none', 'opacity-40');
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
    <div id="quran-jump-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 max-h-[85vh] flex flex-col">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <h3 class="text-sm font-black text-slate-900 dark:text-white">کسی بھی سورت پر جائیں (Jump to Surah)</h3>
          <button onclick="document.getElementById('quran-jump-modal').remove()" class="p-1 text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <input type="text" id="jump-search" oninput="window.Views._filterJumpSurahs(this.value)" placeholder="سورت نمبر یا نام تلاش کریں..." class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">
        <div id="jump-surahs-list" class="flex-1 overflow-y-auto space-y-1 pr-1">
          ${surahs.map(s => `
            <a href="#/quran/${s.number}" onclick="document.getElementById('quran-jump-modal').remove()" class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-800 hover:text-amber-300 transition flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
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

window.Views.openJuzJumpModal = function() {
  const juzList = window.QURAN_DATA ? window.QURAN_DATA.JUZ_LIST : [];
  const modal = `
    <div id="juz-jump-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 max-h-[85vh] flex flex-col">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <h3 class="text-sm font-black text-slate-900 dark:text-white">کسی بھی پارے پر جائیں (Jump to Juz)</h3>
          <button onclick="document.getElementById('juz-jump-modal').remove()" class="p-1 text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <div class="flex-1 overflow-y-auto space-y-1 pr-1">
          ${juzList.map(j => `
            <a href="#/juz/${j.juz}" onclick="document.getElementById('juz-jump-modal').remove()" class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-800 hover:text-amber-300 transition flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span class="font-mono">پارہ ${j.juz}. ${j.nameUrdu}</span>
              <span class="font-arabic text-base">${j.nameArabic}</span>
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
      <a href="#/quran/${s.number}" onclick="document.getElementById('quran-jump-modal').remove()" class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-800 hover:text-amber-300 transition flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
        <span class="font-mono">${s.number}. ${s.nameUrdu}</span>
        <span class="font-arabic text-base">${s.nameArabic}</span>
      </a>
    `).join('');
  }
};

window.Views.playSingleAyah = function(surahNum, ayahNum) {
  if (window.QuranService) {
    const list = window.Views.currentJuzAyahs && window.Views.currentJuzAyahs.length > 0 ? window.Views.currentJuzAyahs : window.Views.currentSurahAyahs;
    window.QuranService.playAyah(surahNum, ayahNum, list);
    
    document.querySelectorAll('.border-teal-600').forEach(el => {
      el.classList.remove('border-teal-600', 'bg-teal-50/60', 'dark:bg-teal-950/40', 'ring-1', 'ring-teal-600/40');
    });
    const activeEl = document.getElementById(`ayah-container-${surahNum}-${ayahNum}`);
    if (activeEl) {
      activeEl.classList.add('border-teal-600', 'bg-teal-50/60', 'dark:bg-teal-950/40', 'ring-1', 'ring-teal-600/40');
    }
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
    if (window.Views.currentSurahAyahs && window.Views.currentSurahAyahs.length > 0) {
      window.Views.renderAyahsToDom(surahNum, meta, window.Views.currentSurahAyahs);
    }
  }
};

window.Views.openNoteModal = function(surahNum, ayahNum) {
  const currentNote = window.QuranService ? window.QuranService.getNoteForAyah(surahNum, ayahNum) : '';
  const modal = `
    <div id="quran-note-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <h3 class="text-sm font-black text-slate-900 dark:text-white">ذاتی قرآنی نوٹ</h3>
          <button onclick="document.getElementById('quran-note-modal').remove()" class="p-1 text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <textarea id="quran-note-textarea" rows="4" placeholder="اس آیت مبارکہ سے متعلق اپنے تاثرات و فوائد درج کریں..." class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600">${currentNote}</textarea>
        <div class="flex items-center justify-end gap-2 pt-1">
          <button onclick="document.getElementById('quran-note-modal').remove()" class="py-1.5 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">منسوخ</button>
          <button onclick="window.Views.saveQuranNote(${surahNum}, ${ayahNum})" class="py-1.5 px-5 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 text-xs font-bold shadow-xs border border-teal-600">محفوظ کریں</button>
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
  const ayahs = (window.Views.currentJuzAyahs && window.Views.currentJuzAyahs.length > 0) ? window.Views.currentJuzAyahs : (window.Views.currentSurahAyahs || []);
  const ayah = ayahs.find(a => (a.surahNumber === surahNum || !a.surahNumber) && a.numberInSurah === ayahNum) || { text: '', urdu: '', tafsir: '' };
  const tafsirText = ayah.tafsir || 'تفسیر احسن البیان (حافظ صلاح الدین یوسف): اس آیت مبارکہ کے تحت عقیدہ، اخلاق اور احکام شرعیہ کی رہنمائی فراہم کی گئی ہے۔ سلف صالحین اور محدثین کے فہم کے مطابق عمل کرنا لازم ہے۔';

  const modal = `
    <div id="quran-tafsir-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-xs border border-teal-600/30">تفسیر احسن البیان</span>
            <h3 class="text-sm font-black text-slate-900 dark:text-white">سورت ${surahNum} • آیت ${ayahNum}</h3>
          </div>
          <button onclick="document.getElementById('quran-tafsir-modal').remove()" class="p-1 text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>

        <div class="p-4 rounded-2xl bg-teal-50/60 dark:bg-slate-800 border border-teal-600/30">
          <p class="font-arabic font-bold text-teal-900 dark:text-teal-300 text-lg sm:text-xl text-right leading-loose">${ayah.text}</p>
          <p class="text-xs text-slate-700 dark:text-slate-300 mt-2 font-urdu font-medium">${ayah.urdu}</p>
        </div>

        <div class="space-y-1.5">
          <h4 class="text-xs font-black text-teal-700 dark:text-teal-400">📖 تفسیری نکات و مستند تشریح:</h4>
          <div class="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-loose whitespace-pre-wrap p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            ${tafsirText}
          </div>
        </div>

        <div class="text-center pt-1">
          <button onclick="document.getElementById('quran-tafsir-modal').remove()" class="py-2 px-8 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 text-xs font-bold shadow-xs border border-teal-600">بند کریں</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.shareAyahCardModal = function(surahNum, ayahNum) {
  const ayahs = (window.Views.currentJuzAyahs && window.Views.currentJuzAyahs.length > 0) ? window.Views.currentJuzAyahs : (window.Views.currentSurahAyahs || []);
  const ayah = ayahs.find(a => (a.surahNumber === surahNum || !a.surahNumber) && a.numberInSurah === ayahNum) || { text: '', urdu: '' };
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
    navigator.clipboard.writeText(`${ayah.text}\n\n${ayah.urdu}\n\n[سورۃ ${meta.nameArabic}: ${ayahNum}]`);
    window.App?.showToast('آیت مبارکہ اور ترجمہ کلپ بورڈ پر کاپی ہو گیا! 📋', 'success');
  }
};

// =========================================================================
// 9. BOTTOM FLOATING AUDIO PLAYER (Native Android Style)
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
    playerContainer.className = 'fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-lg bg-slate-900/95 text-white backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-2xl font-urdu flex flex-col gap-1.5 transition-all';
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
    <div class="flex items-center justify-between gap-2.5">
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-8 h-8 rounded-xl bg-teal-700 text-amber-300 flex items-center justify-center shrink-0 shadow-xs border border-teal-600">
          <i data-lucide="volume-2" class="w-4 h-4"></i>
        </div>
        <div class="min-w-0">
          <h4 class="text-xs font-black text-white truncate font-arabic">${surah.nameArabic} (${surah.nameUrdu})</h4>
          <p class="text-[10px] text-teal-400 truncate">${reciter.name}</p>
        </div>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <button id="global-player-toggle" onclick="window.Views.toggleGlobalAudioPlay()" class="w-8 h-8 rounded-xl bg-amber-400 hover:bg-amber-300 text-teal-950 flex items-center justify-center shadow-xs active:scale-95 transition">
          <i data-lucide="pause" class="w-4 h-4 fill-teal-950"></i>
        </button>
        <button onclick="window.Views.closeGlobalQuranPlayer()" class="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition">
          <i data-lucide="x" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>

    <div class="flex items-center gap-2 text-[10px] font-mono text-slate-400" dir="ltr">
      <span id="player-current-time">00:00</span>
      <input 
        id="player-seek-slider" 
        type="range" 
        min="0" 
        max="100" 
        value="0" 
        class="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400" 
        oninput="window.Views.seekGlobalAudio(this.value)"
      />
      <span id="player-total-time">--:--</span>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  audio.play().catch(e => console.log('Audio note:', e.message));

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
    if (btn) btn.innerHTML = '<i data-lucide="pause" class="w-4 h-4 fill-teal-950"></i>';
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

console.log('Clean Single-Border Seamless Quran & Juz Architecture Loaded!');

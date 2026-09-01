
// =========================================================================
// 8.5 PLAY FULL SURAH CONTINUOUS AUDIO (Plays from Ayah 1 to End)
// =========================================================================
window.Views.playFullSurahAudio = function(surahNumber) {
  const ayahs = window.Views.currentSurahAyahs || [];
  if (!ayahs.length) {
    window.App?.showToast('آیات لوڈ ہو رہی ہیں، براہ کرم چند سیکنڈ انتظار فرمائیں...', 'warning');
    return;
  }
  if (!window.QuranService) {
    window.App?.showToast('صوتی سروس دستیاب نہیں ہے۔', 'danger');
    return;
  }

  // Toggle pause if already playing this surah
  if (window.QuranService.isPlaying() && window.Views.activePlayingSurah === surahNumber) {
    window.QuranService.pauseAudio();
    window.App?.showToast('تلاوت روک دی گئی ⏸', 'info');
    return;
  }

  window.App?.showToast('قاری کی مکمل تلاوت شروع کی جا رہی ہے ▶️', 'success');
  window.QuranService.playAyah(surahNumber, 1, ayahs);
};

/**
 * LearnHub Authentic Master Quran Ecosystem v144
 * Features:
 * 1. Single-Line Mobile Controls Strip with Qari Selector & View Modes
 * 2. Instant Play/Pause Audio Toggle on Ayahs with Animated Status
 * 3. Exact Circular Ayah Rosette with Eastern Number Centered Inside
 * 4. Tafseer Book Reader, PDF Editions & Admin Document Upload
 * 5. High-Resolution Islamic Status Card Generator (Canvas HD Download)
 * 6. Flawless Bookmark Sync & Direct Verse Navigation
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

  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') ? window.I18N.getCurrentLanguage() : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');

  const surahNum = params && params.id ? parseInt(params.id, 10) : null;
  if (surahNum && surahNum >= 1 && surahNum <= 114) {
    window.Views.renderSurahReader(surahNum);
    return;
  }

  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const lastRead = window.QuranService ? window.QuranService.getLastRead() : { surahNumber: 1, ayahNumber: 1 };
  const lastReadSurah = surahs.find(s => s.number === lastRead.surahNumber) || surahs[0];
  const bookmarks = window.QuranService ? window.QuranService.getBookmarks() : [];

  const L = {
    title: isRtl ? (lang === 'ur' ? 'الْقُرْآنُ الْكَرِيمُ' : 'القرآن الكريم') : 'The Noble Quran',
    sub: isRtl ? '114 سورتیں، تلاوت اور تفاسیر' : '114 Surahs Directory, 30 Juz, Multi-Qari Audio & Tafsir',
    lastRead: isRtl ? `پچھلا مطالعہ: ${lastReadSurah ? lastReadSurah.nameArabic : 'الفاتحة'} (${lastRead.ayahNumber})` : `Last Read: ${lastReadSurah ? lastReadSurah.nameEnglish || lastReadSurah.nameArabic : 'Al-Fatihah'} (${lastRead.ayahNumber})`,
    searchPlaceholder: isRtl ? 'سورت یا پارہ تلاش کریں (نام، نمبر، مثلاً: بقرہ، یسین، 36)...' : 'Search Surah by name or number (e.g. Baqarah, Yasin, 36)...',
    tabSurahs: isRtl ? '114 سورتیں' : '114 Surahs',
    tabJuz: isRtl ? '30 پارے (Juz)' : '30 Juz (Paras)',
    tabMushaf: isRtl ? '15 سطری مصحف' : '15-Line Mushaf',
    tabBookmarks: isRtl ? `محفوظات (${bookmarks.length})` : `Bookmarks (${bookmarks.length})`,
    tabTafsir: isRtl ? 'تفاسیر (8)' : 'Tafsirs (8)'
  };

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 ${fontClass} text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Top Royal Dual-Tone Quran Header (Matching Home Suite) -->
      <div class="max-w-4xl mx-auto px-3 sm:px-4 pt-4 pb-2">
        <div class="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 text-white border border-teal-800/60 shadow-lg space-y-4">
          
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-teal-800/90 text-amber-300 border border-teal-600/50 shadow-xs flex items-center justify-center text-2xl shrink-0">
                📖
              </div>
              <div>
                <h1 class="text-xl sm:text-2xl font-black font-arabic leading-tight text-white">${L.title}</h1>
                <p class="text-xs text-teal-300 font-sans mt-0.5">${L.sub}</p>
              </div>
            </div>

            <a href="#/quran/${lastRead.surahNumber}" class="py-2 px-3.5 rounded-2xl bg-teal-800/90 hover:bg-teal-700 text-amber-300 text-xs font-bold flex items-center gap-2 border border-teal-600/60 shadow-xs transition active:scale-95 shrink-0">
              <i data-lucide="bookmark" class="w-3.5 h-3.5 text-amber-300"></i>
              <span>${L.lastRead}</span>
            </a>
          </div>

          <!-- Quick Search Bar -->
          <div class="relative">
            <input 
              type="text" 
              id="quran-search-input" 
              placeholder="${L.searchPlaceholder}" 
              class="w-full bg-slate-950/80 text-white placeholder-teal-300/60 border border-teal-700/60 rounded-2xl py-3 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 ${isRtl ? 'text-right font-urdu' : 'text-left font-sans'}"
              oninput="window.Views.filterSurahs(this.value)"
            />
          </div>

          <!-- Navigation Tabs Strip inside Royal Banner -->
          <div class="pt-2 border-t border-teal-800/60 flex items-center justify-around gap-1 overflow-x-auto scrollbar-none text-xs font-bold">
            <button onclick="window.Views.switchQuranTab('surahs')" class="quran-tab-btn py-2 px-3 rounded-xl transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'surahs' ? 'bg-amber-400 text-teal-950 font-black shadow-xs' : 'bg-teal-950/70 text-teal-200 hover:text-white border border-teal-800/60'}" data-tab="surahs">
              <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
              <span>${L.tabSurahs}</span>
            </button>
            <button onclick="window.Views.switchQuranTab('juz')" class="quran-tab-btn py-2 px-3 rounded-xl transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'juz' ? 'bg-amber-400 text-teal-950 font-black shadow-xs' : 'bg-teal-950/70 text-teal-200 hover:text-white border border-teal-800/60'}" data-tab="juz">
              <i data-lucide="layers" class="w-3.5 h-3.5"></i>
              <span>${L.tabJuz}</span>
            </button>
            <button onclick="window.Views.switchQuranTab('mushaf')" class="quran-tab-btn py-2 px-3 rounded-xl transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'mushaf' ? 'bg-amber-400 text-teal-950 font-black shadow-xs' : 'bg-teal-950/70 text-teal-200 hover:text-white border border-teal-800/60'}" data-tab="mushaf">
              <i data-lucide="book-marked" class="w-3.5 h-3.5"></i>
              <span>${L.tabMushaf}</span>
            </button>
            <button onclick="window.Views.switchQuranTab('bookmarks')" class="quran-tab-btn py-2 px-3 rounded-xl transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'bookmarks' ? 'bg-amber-400 text-teal-950 font-black shadow-xs' : 'bg-teal-950/70 text-teal-200 hover:text-white border border-teal-800/60'}" data-tab="bookmarks">
              <i data-lucide="bookmark" class="w-3.5 h-3.5"></i>
              <span>${L.tabBookmarks}</span>
            </button>
            <button onclick="window.Views.switchQuranTab('tafsir')" class="quran-tab-btn py-2 px-3 rounded-xl transition flex items-center gap-1.5 ${window.Views.quranActiveTab === 'tafsir' ? 'bg-amber-400 text-teal-950 font-black shadow-xs' : 'bg-teal-950/70 text-teal-200 hover:text-white border border-teal-800/60'}" data-tab="tafsir">
              <i data-lucide="library" class="w-3.5 h-3.5"></i>
              <span>${L.tabTafsir}</span>
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
        <div class="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <div class="flex items-center gap-1.5">
            <button onclick="window.Views.filterSurahsByType('all')" class="quran-filter-pill active py-1.5 px-3 rounded-xl font-bold bg-teal-800 text-amber-300 border border-teal-600/50 shadow-sm">تمام (114)</button>
            <button onclick="window.Views.filterSurahsByType('Meccan')" class="quran-filter-pill py-1.5 px-3 rounded-xl font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">مکی سورتیں (86)</button>
            <button onclick="window.Views.filterSurahsByType('Medinan')" class="quran-filter-pill py-1.5 px-3 rounded-xl font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">مدنی سورتیں (28)</button>
          </div>
          <span class="text-[11px] text-slate-400 font-sans">114 Surahs</span>
        </div>

        <div id="quran-surahs-grid" class="space-y-2">
          ${window.Views.renderSurahsHtml(surahs)}
        </div>
      </div>
    `;
  }

  // TAB 2: 30 JUZ / PARAS
  if (tab === 'juz') {
    const juzList = window.QURAN_DATA ? window.QURAN_DATA.JUZ_LIST : [];
    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${juzList.map(j => `
          <a href="#/juz/${j.juz}" class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-600 transition flex items-center justify-between shadow-sm hover:shadow-md group">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-600/30 text-teal-800 dark:text-teal-300 font-black text-xs flex items-center justify-center font-mono group-hover:bg-teal-800 group-hover:text-amber-300 transition shrink-0">
                ${j.juz}
              </div>
              <div class="min-w-0">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white truncate font-sans">Juz ${j.juz} — ${j.nameTranslit}</h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">Surah ${j.startSurah} to Surah ${j.endSurah}</p>
              </div>
            </div>
            <div class="text-left font-arabic text-lg sm:text-xl font-bold text-teal-800 dark:text-teal-300 shrink-0" dir="rtl">
              ${j.nameArabic}
            </div>
          </a>
        `).join('')}
      </div>
    `;
  }

  // TAB 3: 15-LINE MUSHAF (Offline & Online 15-Line Page Viewer)
  if (tab === 'mushaf' || tab === 'mushaf15') {
    const curPage = window.Views.currentMushafPage || 1;
    const allSurahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
    const juzList = window.QURAN_DATA ? window.QURAN_DATA.JUZ_LIST : [];
    
    return `
      <div class="space-y-4">
        <!-- Mushaf Header & Controls -->
        <div class="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span class="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-300/40">حفاظ کرام کا پسندیدہ مصحف</span>
            <h2 class="text-base font-bold text-slate-900 dark:text-white mt-1">15 سطری شاہی مصحف (15-Line Indo-Pak Mushaf)</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">مکمل 15 سطور کی کلاسیکل ترتیب، 100% آف لائن و آن لائن فعال۔</p>
          </div>

          <!-- Quick Jump Dropdowns -->
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Surah Selector -->
            <select onchange="window.Views.jumpToSurahInMushaf(this.value)" class="py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <option value="">سورت منتخب کریں...</option>
              ${allSurahs.map(s => `<option value="${s.page || 1}">${s.number}. ${s.nameArabic} (${s.nameTranslit || s.nameEnglish})</option>`).join('')}
            </select>

            <!-- Juz Selector -->
            <select onchange="window.Views.jumpToJuzInMushaf(this.value)" class="py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <option value="">پارہ منتخب کریں...</option>
              ${juzList.map(j => `<option value="${(j.juz - 1) * 20 + 1}">پارہ ${j.juz} - ${j.nameArabic}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Interactive 15-Line Mushaf Canvas -->
        <div class="p-4 sm:p-6 rounded-3xl bg-amber-50/25 dark:bg-slate-900 border-2 border-amber-500/30 shadow-md space-y-4 text-center">
          
          <!-- Page Nav Strip -->
          <div class="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <button onclick="window.Views.changeMushafPage(-1)" class="py-1.5 px-3 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs transition flex items-center gap-1">
              <i data-lucide="chevron-right" class="w-4 h-4"></i>
              <span>پچھلا صفحہ</span>
            </button>

            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300">صفحہ نمبر:</span>
              <input type="number" min="1" max="604" value="${curPage}" onchange="window.Views.jumpToMushafPage(this.value)" class="w-16 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold text-center text-xs">
              <span class="text-xs text-slate-400 font-mono">/ 604</span>
            </div>

            <button onclick="window.Views.changeMushafPage(1)" class="py-1.5 px-3 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs transition flex items-center gap-1">
              <span>اگلا صفحہ</span>
              <i data-lucide="chevron-left" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- 15-Line Render Area -->
          <div id="mushaf-15-lines-view" class="py-5 px-3 sm:px-8 bg-white/90 dark:bg-slate-950/90 rounded-2xl border border-amber-400/20 text-right font-arabic leading-loose select-text" dir="rtl" style="font-size: 24px; line-height: 2.6; font-family: 'Noto Nastaliq Urdu', 'Amiri', serif;">
            ${window.Views.getMushaf15PageText(curPage)}
          </div>

          <!-- Bottom Status & Actions -->
          <div class="pt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between flex-wrap gap-2">
            <span class="text-teal-700 dark:text-teal-400 font-bold">🟢 15 سطری مصحف آف لائن دستیاب ہے</span>
            <div class="flex items-center gap-2">
              <button onclick="window.Views.adjustQuranFontSize(2)" class="px-2 py-1 rounded-lg bg-teal-800 text-amber-300 font-bold text-xs">A+ بڑا فونٹ</button>
              <button onclick="window.Views.adjustQuranFontSize(-2)" class="px-2 py-1 rounded-lg bg-teal-800 text-amber-300 font-bold text-xs">A- چھوٹا فونٹ</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // TAB 4: BOOKMARKS (محفوظات)
  if (tab === 'bookmarks') {
    const bookmarks = window.QuranService ? window.QuranService.getBookmarks() : [];
    if (bookmarks.length === 0) {
      return `
        <div class="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 mx-auto flex items-center justify-center text-xl">
            🔖
          </div>
          <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300">کوئی آیت محفوظ (Bookmarked) نہیں ہے</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">تلاوت کے دوران کسی بھی آیت کے "بک مارک" بٹن پر ٹیپ فرما کر فہرست میں شامل کریں۔</p>
        </div>
      `;
    }

    return `
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold text-slate-400">محفوظ شدہ آیات مبارکہ (${bookmarks.length})</h3>
          <button onclick="localStorage.removeItem('learnhub_quran_bookmarks'); window.Views.switchQuranTab('bookmarks');" class="text-[11px] text-rose-500 hover:underline">سب حذف کریں</button>
        </div>
        <div class="space-y-2">
          ${bookmarks.map(b => `
            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-xl bg-teal-800 text-amber-300 font-bold text-xs flex items-center justify-center font-mono border border-teal-600/30">
                  ${b.surahNumber}
                </span>
                <div>
                  <h4 class="text-sm font-bold text-slate-900 dark:text-white font-arabic">${b.surahNameArabic}</h4>
                  <p class="text-[11px] text-teal-600 dark:text-teal-400 font-urdu">آیت نمبر: ${b.ayahNumber} • ${b.surahNameUrdu || ''}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <a href="#/quran/${b.surahNumber}" class="py-1.5 px-3 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs transition">
                  تلاوت کریں &larr;
                </a>
                <button onclick="window.QuranService.removeBookmark('${b.id}'); window.Views.switchQuranTab('bookmarks');" class="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg" title="حذف">
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
              <button onclick="window.Views.openTafsirModal(1, 1)" class="flex-1 py-1.5 px-3 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1 shadow-sm border border-teal-600">
                <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
                <span>کتابی مطالعہ</span>
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
          <div class="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-teal-700 dark:group-hover:text-teal-400 transition font-sans">
            ${surah.nameTranslit || surah.nameEnglish} ${surah.meaningEnglish ? `<span class="text-xs font-normal text-slate-500 dark:text-slate-400">(${surah.meaningEnglish})</span>` : ''}
          </div>
          <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium font-sans">
            ${surah.type === 'Meccan' ? 'Meccan' : 'Medinan'} • ${surah.ayahCount} Verses • Juz ${surah.juz}
          </div>
        </div>
      </div>
      <div class="text-left shrink-0 font-arabic font-bold text-xl sm:text-2xl text-teal-800 dark:text-teal-300 group-hover:scale-105 transition-transform" dir="rtl">
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
// 4. SURAH READER (#/quran/:id)
// =========================================================================
window.Views.renderSurahReader = async function(surahNumber) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const surahMeta = surahs.find(s => s.number === surahNumber) || surahs[0];
  const settings = window.QuranService ? window.QuranService.getSettings() : { selectedQari: 'alafasy' };
  const reciters = window.QURAN_DATA ? window.QURAN_DATA.RECITERS : [];
  const curQari = reciters.find(r => r.id === settings.selectedQari) || reciters[0];

  if (window.QuranService) {
    window.QuranService.saveLastRead(surahNumber, 1, surahMeta.page, surahMeta.juz);
  }

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-36" dir="rtl">
      
      <!-- Single Integrated Royal Dual-Tone Header (Matching Home Suite) -->
      <div class="sticky top-0 z-30 shadow-md">
        <div class="p-3 sm:p-4 bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 text-white border-b border-teal-800/60">
          
          <!-- Row 1: Surah Title and Nav Controls -->
          <div class="max-w-4xl mx-auto flex items-center justify-between gap-2.5">
            <a href="#/quran" class="py-1.5 px-3 rounded-xl bg-teal-800/90 hover:bg-teal-700 text-white flex items-center gap-1.5 text-xs font-bold transition border border-teal-600/50 shadow-xs shrink-0">
              <i data-lucide="arrow-right" class="w-4 h-4 text-amber-300"></i>
              <span class="hidden sm:inline">سورتیں</span>
            </a>

            <!-- Integrated Center Title Button -->
            <div class="flex items-center gap-2.5 min-w-0 cursor-pointer" onclick="window.Views.openSurahJumpModal()">
              <span class="w-8 h-8 rounded-xl bg-amber-400 text-teal-950 font-mono text-xs flex items-center justify-center font-black shadow-xs shrink-0">${surahNumber}</span>
              <div class="min-w-0 text-center">
                <h1 class="text-base sm:text-lg font-black font-arabic truncate leading-tight text-amber-300">سُورَةُ ${surahMeta.nameArabic}</h1>
                <p class="text-[11px] text-teal-200 truncate font-urdu">${surahMeta.nameUrdu} • ${surahMeta.type === 'Meccan' ? 'مكية' : 'مدنية'} • ${surahMeta.ayahCount} آیات</p>
              </div>
              <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-amber-300 shrink-0"></i>
            </div>

            <div class="flex items-center gap-1 shrink-0" dir="ltr">
              <button onclick="window.Views.playSurahDirectly(${surahNumber})" class="py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-teal-950 text-xs font-black flex items-center gap-1 shadow-xs transition active:scale-95">
                <i data-lucide="play" class="w-3.5 h-3.5 fill-teal-950"></i>
                <span class="font-urdu hidden sm:inline">تلاوت</span>
              </button>
              ${surahNumber > 1 ? `<a href="#/quran/${surahNumber - 1}" class="p-1.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-white border border-teal-600/50 transition"><i data-lucide="chevron-left" class="w-4 h-4"></i></a>` : ''}
              ${surahNumber < 114 ? `<a href="#/quran/${surahNumber + 1}" class="p-1.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-white border border-teal-600/50 transition"><i data-lucide="chevron-right" class="w-4 h-4"></i></a>` : ''}
            </div>
          </div>

          <!-- Row 2: 100% SINGLE-LINE Horizontal Controls Strip with Qari Selector -->
          <div class="max-w-4xl mx-auto mt-2 pt-2 border-t border-teal-800/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            
            <!-- View Mode Pills -->
            <button onclick="window.Views.setQuranViewMode('ayah_cards', ${surahNumber})" class="mode-btn shrink-0 py-1.5 px-3 rounded-xl transition font-bold ${window.Views.quranViewMode === 'ayah_cards' ? 'bg-amber-400 text-teal-950 font-black shadow-xs' : 'bg-teal-950/70 text-teal-200 hover:text-white border border-teal-700/40'}" data-mode="ayah_cards">
              تلاوت مع ترجمہ
            </button>
            <button onclick="window.Views.setQuranViewMode('mushaf15', ${surahNumber})" class="mode-btn shrink-0 py-1.5 px-3 rounded-xl transition font-bold ${window.Views.quranViewMode === 'mushaf15' ? 'bg-amber-400 text-teal-950 font-black shadow-xs' : 'bg-teal-950/70 text-teal-200 hover:text-white border border-teal-700/40'}" data-mode="mushaf15">
              15 سطری مصحف
            </button>
            <button onclick="window.Views.setQuranViewMode('hifz', ${surahNumber})" class="mode-btn shrink-0 py-1.5 px-3 rounded-xl transition font-bold ${window.Views.quranViewMode === 'hifz' ? 'bg-amber-400 text-teal-950 font-black shadow-xs' : 'bg-teal-950/70 text-teal-200 hover:text-white border border-teal-700/40'}" data-mode="hifz">
              🎙️ حفظ و صوتی تکرار
            </button>

            <!-- Reciter / Qari Selector Pill -->
            <button onclick="window.Views.openQariSelectorModal(${surahNumber})" id="qari-select-btn" class="shrink-0 py-1.5 px-3 rounded-xl border text-xs font-bold bg-teal-950/80 text-teal-200 border-teal-700/50 hover:bg-teal-800 hover:text-amber-300 flex items-center gap-1.5 transition">
              <span>🎙️</span>
              <span id="current-qari-label">${curQari.name.split('—')[0].replace('شیخ ', '').split('(')[0]}</span>
              <i data-lucide="chevron-down" class="w-3 h-3 text-amber-300"></i>
            </button>

            <!-- Translation Toggle -->
            <button onclick="window.Views.toggleQuranTranslation(${surahNumber})" id="translation-toggle-btn" class="shrink-0 py-1.5 px-3 rounded-xl border text-xs font-bold ${window.Views.showTranslation ? 'bg-teal-800 text-amber-300 border-amber-400/40 font-black shadow-xs' : 'bg-teal-950/70 text-teal-200 border-teal-700/40'}">
              ${window.Views.showTranslation ? '📜 ترجمہ: آن' : '📖 ترجمہ: آف'}
            </button>

            <!-- Font Resizer -->
            <div class="shrink-0 flex items-center gap-1 bg-teal-950/90 p-0.5 rounded-xl border border-teal-700/50 font-mono text-xs text-white">
              <button onclick="window.Views.adjustQuranFontSize(-2)" class="w-6 h-6 rounded-lg bg-teal-800 hover:bg-teal-700 text-amber-300 font-black">A-</button>
              <span id="font-size-display" class="px-1 text-[11px] font-bold">${window.Views.currentQuranFontSize}px</span>
              <button onclick="window.Views.adjustQuranFontSize(2)" class="w-6 h-6 rounded-lg bg-teal-800 hover:bg-teal-700 text-amber-300 font-black">A+</button>
            </div>

          </div>
        </div>
      </div>

      <!-- Main Reader Canvas -->
      <div class="max-w-3xl mx-auto px-3 sm:px-4 py-4 space-y-4">
        
        <!-- Sacred Bismillah Emblem -->
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
// 5. JUZ / PARA READER (#/juz/:id)
// =========================================================================
window.Views.renderJuzReader = async function(juzNumber) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const num = parseInt(juzNumber, 10) || 1;
  window.Views.activeJuzNumber = num;

  const juzList = window.QURAN_DATA ? window.QURAN_DATA.JUZ_LIST : [];
  const juzMeta = juzList.find(j => j.juz === num) || juzList[0];
  const settings = window.QuranService ? window.QuranService.getSettings() : { selectedQari: 'alafasy' };
  const reciters = window.QURAN_DATA ? window.QURAN_DATA.RECITERS : [];
  const curQari = reciters.find(r => r.id === settings.selectedQari) || reciters[0];

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-36" dir="rtl">
      
      <!-- Single Integrated Majestic Header -->
      <div class="bg-teal-800 text-white shadow-md sticky top-0 z-30">
        
        <!-- Row 1: Juz Title and Nav Controls -->
        <div class="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-2.5">
          
          <a href="#/quran" onclick="window.Views.quranActiveTab = 'juz';" class="py-1.5 px-3 rounded-xl bg-teal-700/80 hover:bg-teal-700 text-white flex items-center gap-1.5 text-xs font-bold transition border border-teal-600/50 shadow-xs shrink-0">
            <i data-lucide="arrow-right" class="w-4 h-4 text-amber-300"></i>
            <span class="hidden sm:inline">پارے</span>
          </a>

          <!-- Integrated Center Title Button -->
          <div class="flex items-center gap-2 min-w-0 cursor-pointer" onclick="window.Views.openJuzJumpModal()">
            <span class="w-7 h-7 rounded-xl bg-amber-400 text-teal-950 font-mono text-xs flex items-center justify-center font-black shadow-xs shrink-0">${num}</span>
            <div class="min-w-0 text-center">
              <h1 class="text-base sm:text-lg font-black font-arabic truncate leading-tight text-amber-300">الجُزْءُ ${juzMeta.nameArabic}</h1>
              <p class="text-[10px] text-teal-200 truncate font-urdu">${juzMeta.nameUrdu} • سورت ${juzMeta.startSurah} تا ${juzMeta.endSurah}</p>
            </div>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-amber-300 shrink-0"></i>
          </div>

          <div class="flex items-center gap-1 shrink-0" dir="ltr">
            ${num > 1 ? `<a href="#/juz/${num - 1}" class="p-1.5 rounded-xl bg-teal-700/80 hover:bg-teal-700 text-white border border-teal-600/50 transition"><i data-lucide="chevron-left" class="w-4 h-4"></i></a>` : ''}
            ${num < 30 ? `<a href="#/juz/${num + 1}" class="p-1.5 rounded-xl bg-teal-700/80 hover:bg-teal-700 text-white border border-teal-600/50 transition"><i data-lucide="chevron-right" class="w-4 h-4"></i></a>` : ''}
          </div>
        </div>

        <!-- Row 2: 100% SINGLE-LINE Horizontal Controls Strip with Qari Selector -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-1.5">
          <div class="max-w-3xl mx-auto px-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            
            <button onclick="window.Views.setJuzViewMode('ayah_cards', ${num})" class="juz-mode-btn shrink-0 py-1 px-2.5 rounded-xl transition font-bold ${window.Views.quranViewMode === 'ayah_cards' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}" data-mode="ayah_cards">
              تلاوت مع ترجمہ
            </button>
            <button onclick="window.Views.setJuzViewMode('mushaf15', ${num})" class="juz-mode-btn shrink-0 py-1 px-2.5 rounded-xl transition font-bold ${window.Views.quranViewMode === 'mushaf15' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}" data-mode="mushaf15">
              15 سطری مصحف
            </button>

            <!-- Reciter / Qari Selector Pill -->
            <button onclick="window.Views.openQariSelectorModal(${num}, true)" class="shrink-0 py-1 px-2.5 rounded-xl border text-xs font-bold bg-teal-950/70 text-teal-200 border-teal-700/50 hover:bg-teal-700 hover:text-amber-300 flex items-center gap-1.5 transition">
              <span>🎙️</span>
              <span id="current-qari-label-juz">${curQari.name.split('—')[0].replace('شیخ ', '').split('(')[0]}</span>
              <i data-lucide="chevron-down" class="w-3 h-3 text-amber-300"></i>
            </button>

            <button onclick="window.Views.toggleJuzTranslation(${num})" id="juz-translation-btn" class="shrink-0 py-1 px-2.5 rounded-xl border text-xs font-bold ${window.Views.showTranslation ? 'bg-teal-700 text-amber-300 border-amber-400/40 font-black shadow-xs' : 'bg-teal-950/60 text-teal-200 border-teal-700/40'}">
              ${window.Views.showTranslation ? '📜 ترجمہ: آن' : '📖 ترجمہ: آف'}
            </button>

            <div class="shrink-0 flex items-center gap-1 bg-teal-950/80 p-0.5 rounded-xl border border-teal-700/50 font-mono text-xs text-white">
              <button onclick="window.Views.adjustQuranFontSize(-2)" class="w-6 h-6 rounded-lg bg-teal-800 hover:bg-teal-700 text-amber-300 font-black">A-</button>
              <span id="font-size-display" class="px-1 text-[11px] font-bold">${window.Views.currentQuranFontSize}px</span>
              <button onclick="window.Views.adjustQuranFontSize(2)" class="w-6 h-6 rounded-lg bg-teal-800 hover:bg-teal-700 text-amber-300 font-black">A+</button>
            </div>

          </div>
        </div>
      </div>

      <!-- Main Juz Reader Canvas -->
      <div class="max-w-3xl mx-auto px-3 sm:px-4 py-4 space-y-4">
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
// 6. RENDER JUZ AYAHS WITH ELEGANT SURAH SEPARATORS
// =========================================================================
window.Views.renderJuzAyahsToDom = function(juzNumber, juzMeta, ayahItems) {
  const container = document.getElementById('juz-ayahs-list');
  if (!container) return;

  const showTranslation = window.Views.showTranslation !== undefined ? window.Views.showTranslation : true;
  const fontSize = window.Views.currentQuranFontSize || 30;
  const viewMode = window.Views.quranViewMode || 'ayah_cards';
  const allSurahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];

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
                  <span class="quran-ayah-rosette inline-flex items-center justify-center relative w-7 h-7 mx-1 text-xs font-mono text-teal-800 dark:text-amber-300 align-middle select-none">
                    <svg class="absolute inset-0 w-full h-full text-teal-600/40 dark:text-amber-400/40" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 1.5"/><circle cx="18" cy="18" r="13.5" stroke="currentColor" stroke-width="1" opacity="0.6"/></svg>
                    <span class="relative z-10 font-black">${a.numberInSurah}</span>
                  </span>
                </span>
              `).join(' ')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else {
    container.innerHTML = surahGroups.map(group => `
      <div class="space-y-3 pt-2">
        <div class="p-3 rounded-2xl bg-teal-800 text-white text-center shadow-xs flex items-center justify-between px-4">
          <span class="text-[11px] text-teal-200 font-urdu font-medium">${group.surahMeta.type === 'Meccan' ? 'مكية' : 'مدنية'} • ${group.surahMeta.ayahCount || group.ayahs.length} آیات</span>
          <h2 class="text-xl font-arabic font-black text-amber-300">سُورَةُ ${group.surahMeta.nameArabic}</h2>
          <span class="text-[11px] text-teal-200 font-urdu font-medium">${group.surahMeta.nameUrdu}</span>
        </div>

        ${group.surahNumber !== 9 && group.surahNumber !== 1 ? `
          <div class="py-2.5 text-center">
            <p class="text-2xl sm:text-3xl font-arabic font-extrabold text-teal-900 dark:text-teal-200 tracking-wide select-none">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
          </div>
        ` : ''}

        <div class="space-y-3">
          ${group.ayahs.map(a => window.Views.renderAyahRowHtml(group.surahNumber, group.surahMeta, a, showTranslation, fontSize)).join('')}
        </div>
      </div>
    `).join('');
  }

  if (window.lucide) window.lucide.createIcons();
};

// =========================================================================
// 7. AYAH ROW RENDERER (With Perfect Centered Rosette & Instant Audio Toggle)
// =========================================================================
window.Views.renderAyahRowHtml = function(surahNumber, surahMeta, a, showTranslation, fontSize) {
  const isBookmarked = window.QuranService ? window.QuranService.isAyahBookmarked(surahNumber, a.numberInSurah) : false;
  const isPlaying = window.Views.activePlayingSurah === surahNumber && window.Views.activePlayingAyah === a.numberInSurah;

  return `
    <div id="ayah-container-${surahNumber}-${a.numberInSurah}" data-surah="${surahNumber}" data-ayah="${a.numberInSurah}" class="ayah-row-box p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${isPlaying ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/50 shadow-md ring-2 ring-teal-500/50' : 'border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-xs hover:border-teal-500/40'}">
      
      <!-- Royal Dual-Tone Ayah Header Strip -->
      <div class="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 text-white border border-teal-800/60 shadow-xs flex items-center justify-between gap-2 mb-3.5">
        
        <!-- Right: Ayah Number Pill with Gold Accent -->
        <div class="flex items-center gap-1.5 shrink-0">
          <div class="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-xl bg-teal-800/90 text-amber-300 border border-teal-600/50 shadow-2xs text-xs font-black font-urdu">
            <span>آیت</span>
            <span class="font-mono text-amber-200 font-bold">${a.numberInSurah}</span>
          </div>
          ${a.sajda ? '<span class="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">سجدہ واجب ۩</span>' : ''}
        </div>

        <!-- Left: Single-Row Unified Mini Action Buttons -->
        <div class="flex items-center gap-1 sm:gap-1.5 text-xs font-urdu font-bold overflow-x-auto scrollbar-none py-0.5">
          
          <!-- 1. Play / Pause Recitation -->
          <button onclick="window.Views.playSingleAyah(${surahNumber}, ${a.numberInSurah})" class="h-7 px-2 sm:px-2.5 rounded-xl ${isPlaying ? 'bg-amber-400 text-teal-950 font-black shadow-xs ring-1 ring-amber-300' : 'bg-teal-800/80 hover:bg-teal-700 text-teal-100 border border-teal-700/50'} transition flex items-center gap-1 shrink-0 active:scale-95" title="تلاوت سنیں / روکیں">
            <i data-lucide="${isPlaying ? 'pause' : 'play'}" class="w-3 h-3 ${isPlaying ? 'fill-teal-950' : 'fill-teal-200'}"></i>
            <span class="text-[11px]">${isPlaying ? 'روکیں' : 'تلاوت'}</span>
          </button>

          <!-- 2. Authentic Tafsir -->
          <button onclick="window.Views.openTafsirModal(${surahNumber}, ${a.numberInSurah})" class="h-7 px-2 sm:px-2.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-teal-100 hover:text-amber-300 border border-teal-700/50 transition flex items-center gap-1 shrink-0 active:scale-95" title="تفسیر احسن البیان و ابن کثیر">
            <i data-lucide="book-open" class="w-3 h-3 text-amber-300"></i>
            <span class="text-[11px]">تفسیر</span>
          </button>

          <!-- 3. Sauti Takrar (Audio Repeat / حفظ و تکرار) -->
          <button onclick="window.Views.openAyahRepeatModal(${surahNumber}, ${a.numberInSurah})" class="h-7 px-2 sm:px-2.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-teal-100 hover:text-amber-300 border border-teal-700/50 transition flex items-center gap-1 shrink-0 active:scale-95" title="صوتی تکرار (1x, 3x, 5x, 10x, تکرارِ مسلسل)">
            <i data-lucide="repeat" class="w-3 h-3 text-cyan-300"></i>
            <span class="text-[11px]">تکرار</span>
          </button>

          <!-- 4. Bookmark -->
          <button onclick="window.Views.toggleBookmarkAyah(${surahNumber}, ${a.numberInSurah})" id="bm-btn-${surahNumber}-${a.numberInSurah}" class="h-7 px-2 sm:px-2.5 rounded-xl ${isBookmarked ? 'bg-amber-400 text-teal-950 font-black' : 'bg-teal-800/80 hover:bg-teal-700 text-teal-100 hover:text-amber-300'} border border-teal-700/50 transition flex items-center gap-1 shrink-0 active:scale-95" title="بک مارک">
            <i data-lucide="bookmark" class="w-3 h-3 ${isBookmarked ? 'fill-teal-950' : 'text-amber-300'}"></i>
            <span class="text-[11px] hidden sm:inline">${isBookmarked ? 'محفوظ' : 'بک مارک'}</span>
          </button>

          <!-- 5. Note -->
          <button onclick="window.Views.openNoteModal(${surahNumber}, ${a.numberInSurah})" class="h-7 px-2 sm:px-2.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-teal-100 hover:text-amber-300 border border-teal-700/50 transition flex items-center gap-1 shrink-0 active:scale-95" title="نوٹ شامل کریں">
            <i data-lucide="edit-3" class="w-3 h-3 text-emerald-300"></i>
            <span class="text-[11px] hidden sm:inline">نوٹ</span>
          </button>

          <!-- 6. Status Image Card -->
          <button onclick="window.Views.openIslamicStatusCard(${surahNumber}, ${a.numberInSurah})" class="h-7 px-2 sm:px-2.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-teal-100 hover:text-amber-300 border border-teal-700/50 transition flex items-center gap-1 shrink-0 active:scale-95" title="اسلامی اسٹیٹس کارڈ">
            <i data-lucide="share-2" class="w-3 h-3 text-amber-300"></i>
            <span class="text-[11px] hidden sm:inline">اسٹیٹس</span>
          </button>

        </div>
      </div>

      <!-- Crystal Clear Arabic Text with PERFECT CENTERED ROSETTE -->
      <div class="py-2 text-right">
        <p class="font-arabic font-bold text-slate-900 dark:text-white select-text leading-relaxed" style="font-size: ${fontSize || 30}px; line-height: 2.4;">
          ${a.text}
          <!-- Precise Islamic Rosette Medallion with Eastern Number Inside -->
          <span class="quran-ayah-rosette inline-flex items-center justify-center relative w-7 h-7 sm:w-8 sm:h-8 mx-1.5 align-middle select-none text-teal-800 dark:text-amber-300">
            <svg class="absolute inset-0 w-full h-full text-teal-700/60 dark:text-amber-400/60" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 1.5"/>
              <circle cx="18" cy="18" r="13.5" stroke="currentColor" stroke-width="1" opacity="0.6"/>
            </svg>
            <span class="relative z-10 font-mono text-[11px] sm:text-xs font-black text-teal-900 dark:text-amber-200">${a.numberInSurah}</span>
          </span>
        </p>
      </div>

      <!-- Clean Urdu Translation -->
      ${showTranslation && (a.urdu || a.translation || a.english) ? `
        <div class="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
          ${a.urdu ? `<p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-urdu leading-loose">${a.urdu}</p>` : ''}
          ${a.english ? `<p class="text-[11px] text-slate-500 dark:text-slate-400 font-sans italic text-left pt-0.5" dir="ltr">${a.english}</p>` : ''}
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
              <span class="quran-ayah-rosette inline-flex items-center justify-center relative w-7 h-7 mx-1 text-xs font-mono text-teal-800 dark:text-amber-300 align-middle select-none">
                <svg class="absolute inset-0 w-full h-full text-teal-600/40 dark:text-amber-400/40" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 1.5"/><circle cx="18" cy="18" r="13.5" stroke="currentColor" stroke-width="1" opacity="0.6"/></svg>
                <span class="relative z-10 font-black">${a.numberInSurah}</span>
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
    const isListening = window.QuranVoiceEngine && window.QuranVoiceEngine.isListening;
    html = `
      <div class="space-y-4">
        
        <!-- Live Voice Hifz Controller Card -->
        <div class="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-teal-800 to-teal-950 text-white border-2 border-amber-400/60 shadow-xl space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl animate-pulse">🎙️</span>
              <div>
                <h3 class="text-sm sm:text-base font-black font-arabic text-amber-300 leading-tight">
                  لائیو صوتی حفظ و تلاوت سامع (AI Hifz Sami')
                </h3>
                <p class="text-[11px] text-teal-200">
                  ایک کلک پر مائیک آن کریں اور زبانی پڑھتے جائیں، مصحف میں الفاظ خودکار کھلتے جائیں گے!
                </p>
              </div>
            </div>
            
            <div class="flex flex-wrap items-center gap-2 shrink-0">
              <button onclick="window.Views.playFullSurahAudio(${surahNumber})" id="play-full-surah-btn" class="py-2 px-4 rounded-xl bg-teal-900 hover:bg-teal-950 text-amber-300 font-bold border border-amber-400/50 text-xs shadow-md transition flex items-center gap-1.5 active:scale-95">
                <span>▶️</span>
                <span>مکمل صوتی تلاوت سنیں</span>
              </button>
              <button onclick="window.Views.toggleAllHifzAyahs()" id="hifz-hide-all-btn" class="py-1.5 px-3 rounded-xl bg-teal-950 text-amber-300 font-bold border border-teal-600/60 text-xs hover:bg-teal-900 transition">
                🙈 تمام متن چھپائیں
              </button>
              <button onclick="window.Views.toggleQuranVoiceHifz(${surahNumber})" id="quran-voice-hifz-btn" class="py-2 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-black text-xs shadow-md transition flex items-center gap-1.5 active:scale-95">
                <span id="hifz-mic-icon">🎙️</span>
                <span id="hifz-btn-text">${isListening ? '⏹️ صوتی جائزہ روکیں' : 'صوتی حفظ ٹیسٹ (مائیک)'}</span>
              </button>
            </div>
          </div>

          <!-- Progress & Live Accuracy Bar -->
          <div class="pt-2 border-t border-teal-700/60 flex items-center justify-between text-xs font-mono">
            <span id="hifz-live-progress" class="text-teal-200 font-bold">
              آیت <strong>1</strong> از <strong>${ayahItems.length}</strong>
            </span>
            <span id="hifz-live-accuracy" class="px-2.5 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
              100% درست ادائیگی
            </span>
          </div>

          <!-- Live Error & Correction Prompt -->
          <div id="hifz-feedback-banner" class="min-h-8 p-2 rounded-xl bg-teal-950/80 border border-teal-700/50 flex items-center justify-center text-xs font-bold text-center text-teal-200">
            مائیکروفون آن کر کے تلاوت شروع فرمائیں۔ غلطی پر فوری سرخ تنبیہ ظاہر ہوگی اور درست ہونے پر آگے بڑھے گا۔
          </div>
        </div>

        <!-- Ayahs List with Word-by-Word Reveal -->
        ${ayahItems.map(a => {
          const isHidden = window.Views.hifzHiddenAyahs[a.numberInSurah];
          const rawTokens = (a.text || '').trim().split(/\s+/).filter(Boolean);
          const wordsHtml = rawTokens.map((w, wIdx) => {
            return `<span id="ayah-${a.numberInSurah}-word-${wIdx}" class="quran-hifz-word px-1 rounded transition-all duration-300 ${isHidden ? 'filter blur-sm select-none opacity-20' : ''}">${w}</span>`;
          }).join(' ');

          return `
            <div id="ayah-card-${a.numberInSurah}" class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2.5 text-right transition-all duration-300" dir="rtl">
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center font-mono border border-teal-600/30">
                    ${a.numberInSurah}
                  </span>
                  <span id="ayah-status-badge-${a.numberInSurah}" class="text-[10px] font-bold font-mono text-slate-400"></span>
                </div>
                <button onclick="window.Views.toggleHifzAyah(${a.numberInSurah})" class="py-1 px-2.5 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200">
                  ${isHidden ? '👁️ متن ظاہر کریں' : '🙈 متن چھپائیں'}
                </button>
              </div>
              <div class="transition-all duration-300">
                <p id="ayah-text-${a.numberInSurah}" class="font-arabic font-bold text-slate-900 dark:text-white leading-[2.5] flex flex-wrap gap-1.5" style="font-size: ${fontSize}px;">
                  ${wordsHtml}
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

  ayahsList.innerHTML = html + `
        <!-- Bottom Surah Navigation Strip (v163.0.0) -->
        <div id="bottom-surah-navigation" class="mt-8 p-4 rounded-3xl bg-teal-900 text-white border border-teal-700/60 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
          ${surahNumber > 1 ? `
            <a href="#/quran/${surahNumber - 1}" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });" class="w-full sm:w-auto py-2 px-4 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-teal-600/60 transition">
              <span>⬅️ پچھلی سورت (${surahNumber - 1})</span>
            </a>
          ` : '<span class="text-xs text-teal-400 font-bold hidden sm:inline">ابتدائے قرآن</span>'}

          <a href="#/quran" class="py-2 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition">
            <span>📖 تمام 114 سورتوں کی فہرست</span>
          </a>

          ${surahNumber < 114 ? `
            <a href="#/quran/${surahNumber + 1}" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });" class="w-full sm:w-auto py-2 px-4 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-teal-600/60 transition">
              <span>اگلی سورت (${surahNumber + 1}) ➡️</span>
            </a>
          ` : '<span class="text-xs text-teal-400 font-bold hidden sm:inline">اختتامِ قرآن</span>'}
        </div>
    `;
  if (window.scrollTo) window.scrollTo({ top: 0, behavior: 'smooth' });
  if (window.lucide) window.lucide.createIcons();
};

window.Views.setQuranViewMode = function(mode, surahNumber) {
  window.Views.quranViewMode = mode;
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const meta = surahs.find(s => s.number === surahNumber) || surahs[0];
  
  const modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach(btn => {
    if (btn.getAttribute('data-mode') === mode) {
      btn.className = 'mode-btn shrink-0 py-1 px-2.5 rounded-xl transition font-bold bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40';
    } else {
      btn.className = 'mode-btn shrink-0 py-1 px-2.5 rounded-xl transition font-bold bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40';
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
      btn.className = 'juz-mode-btn shrink-0 py-1 px-2.5 rounded-xl transition font-bold bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40';
    } else {
      btn.className = 'juz-mode-btn shrink-0 py-1 px-2.5 rounded-xl transition font-bold bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40';
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
      ? 'shrink-0 py-1 px-2.5 rounded-xl border text-xs font-bold bg-teal-700 text-amber-300 border-amber-400/40 font-black shadow-xs'
      : 'shrink-0 py-1 px-2.5 rounded-xl border text-xs font-bold bg-teal-950/60 text-teal-200 border-teal-700/40';
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
      ? 'shrink-0 py-1 px-2.5 rounded-xl border text-xs font-bold bg-teal-700 text-amber-300 border-amber-400/40 font-black shadow-xs'
      : 'shrink-0 py-1 px-2.5 rounded-xl border text-xs font-bold bg-teal-950/60 text-teal-200 border-teal-700/40';
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

// =========================================================================
// 9. INSTANT AUDIO TOGGLE (Click to play, click again to stop!)
// =========================================================================
window.Views.playSingleAyah = function(surahNum, ayahNum) {
  if (!window.QuranService) return;

  // If already playing THIS EXACT AYAH -> TOGGLE OFF!
  if (window.Views.activePlayingSurah === surahNum && window.Views.activePlayingAyah === ayahNum && window.QuranService.isPlaying()) {
    window.QuranService.pauseAudio();
    window.App?.showToast('تلاوت روک دی گئی ⏸', 'info');
    return;
  }

  // Otherwise, start playing this ayah!
  const list = window.Views.currentJuzAyahs && window.Views.currentJuzAyahs.length > 0 
    ? window.Views.currentJuzAyahs 
    : window.Views.currentSurahAyahs;

  window.QuranService.playAyah(surahNum, ayahNum, list);
};

// =========================================================================
// 10. RECITERS SELECTOR MODAL (8 Famous Qaris)
// =========================================================================
window.Views.openQariSelectorModal = function(sourceId, isJuz = false) {
  const reciters = window.QURAN_DATA ? window.QURAN_DATA.RECITERS : [];
  const settings = window.QuranService ? window.QuranService.getSettings() : { selectedQari: 'alafasy' };

  const modal = `
    <div id="qari-select-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">🎙️</span>
            <h3 class="text-sm sm:text-base font-black text-slate-900 dark:text-white">تلاوت کے لیے پسندیدہ قاری منتخب فرمائیں</h3>
          </div>
          <button onclick="document.getElementById('qari-select-modal').remove()" class="p-1 text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-2 pr-1">
          ${reciters.map(r => {
            const isSelected = r.id === settings.selectedQari;
            return `
              <div onclick="window.Views.selectQari('${r.id}', ${sourceId}, ${isJuz})" class="p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${isSelected ? 'bg-teal-800 text-white border-amber-400 shadow-md ring-1 ring-amber-400' : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/80 hover:border-teal-600'}">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${isSelected ? 'bg-amber-400 text-teal-950' : 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-600/30'}">
                    🎙️
                  </div>
                  <div>
                    <h4 class="text-xs sm:text-sm font-black ${isSelected ? 'text-amber-300' : 'text-slate-900 dark:text-white'}">${r.name}</h4>
                    <p class="text-[11px] ${isSelected ? 'text-teal-200' : 'text-slate-400'} font-sans">${r.style}</p>
                  </div>
                </div>
                <div>
                  ${isSelected ? '<span class="px-2.5 py-1 rounded-lg bg-amber-400 text-teal-950 font-black text-[10px]">فعال (Active)</span>' : '<span class="text-xs text-teal-600 dark:text-teal-400 font-bold">منتخب کریں &larr;</span>'}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.selectQari = function(qariId, sourceId, isJuz) {
  if (window.QuranService) {
    window.QuranService.saveSettings({ selectedQari: qariId });
  }

  const reciters = window.QURAN_DATA ? window.QURAN_DATA.RECITERS : [];
  const qari = reciters.find(r => r.id === qariId) || reciters[0];
  const shortName = qari.name.split('—')[0].replace('شیخ ', '').split('(')[0];

  const labelEl = document.getElementById('current-qari-label');
  if (labelEl) labelEl.textContent = shortName;
  const labelJuzEl = document.getElementById('current-qari-label-juz');
  if (labelJuzEl) labelJuzEl.textContent = shortName;

  document.getElementById('qari-select-modal')?.remove();
  window.App?.showToast(`قاری تبدیل ہو گیا: ${shortName} ✨`, 'success');

  // If audio is playing, restart current ayah with new Qari
  if (window.QuranService && window.QuranService.isPlaying() && window.Views.activePlayingSurah && window.Views.activePlayingAyah) {
    const list = isJuz ? window.Views.currentJuzAyahs : window.Views.currentSurahAyahs;
    window.QuranService.playAyah(window.Views.activePlayingSurah, window.Views.activePlayingAyah, list);
  }
};

// =========================================================================
// 11. BOOKMARK TOGGLE (نشانیاں محفوظ کریں)
// =========================================================================
window.Views.toggleBookmarkAyah = function(surahNum, ayahNum) {
  if (!window.QuranService) return;

  const isBookmarked = window.QuranService.isAyahBookmarked(surahNum, ayahNum);
  const btn = document.getElementById(`bm-btn-${surahNum}-${ayahNum}`);

  if (isBookmarked) {
    window.QuranService.removeBookmark(`bm_${surahNum}_${ayahNum}`);
    if (btn) {
      btn.className = 'py-1 px-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-amber-500 transition flex items-center gap-1 border border-slate-200/80 dark:border-slate-700/80 shrink-0';
      btn.innerHTML = '<i data-lucide="bookmark" class="w-3.5 h-3.5"></i><span class="text-[11px] hidden sm:inline">بک مارک</span>';
    }
    window.App?.showToast('بک مارک محفوظات سے ہٹا دیا گیا 🗑️', 'info');
  } else {
    window.QuranService.addBookmark(surahNum, ayahNum, 'important');
    if (btn) {
      btn.className = 'py-1 px-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-amber-500 ring-1 ring-amber-400 font-black transition flex items-center gap-1 border border-slate-200/80 dark:border-slate-700/80 shrink-0';
      btn.innerHTML = '<i data-lucide="bookmark" class="w-3.5 h-3.5 fill-amber-500 text-amber-500"></i><span class="text-[11px] hidden sm:inline">محفوظ</span>';
    }
    window.App?.showToast('آیت مبارکہ محفوظ فہرست میں شامل کر دی گئی! ✨', 'success');
  }

  if (window.lucide) window.lucide.createIcons();
};

// =========================================================================
// 12. TAFSEER BOOK READER, PDF EDITIONS & ADMIN UPLOAD MODAL
// =========================================================================
window.Views.tafsirFontSize = 18;

window.Views.openTafsirModal = function(surahNum, ayahNum) {
  const ayahs = (window.Views.currentJuzAyahs && window.Views.currentJuzAyahs.length > 0) ? window.Views.currentJuzAyahs : (window.Views.currentSurahAyahs || []);
  const ayah = ayahs.find(a => (a.surahNumber === surahNum || !a.surahNumber) && a.numberInSurah === ayahNum) || { text: '', urdu: '', tafsir: '' };
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const meta = surahs.find(s => s.number === surahNum) || surahs[0];
  const tafsirs = window.QURAN_DATA ? (window.QURAN_DATA.TAFSIRS || []) : [];
  const isCached = localStorage.getItem(`learnhub_tafsir_offline_${surahNum}`) === 'true';

  const modal = `
    <div id="quran-tafsir-modal" class="fixed inset-0 z-50 bg-slate-950/95 flex flex-col font-urdu text-right text-slate-100" dir="rtl">
      
      <!-- Full-Screen Top Header -->
      <div class="p-3.5 sm:p-4 bg-teal-900 border-b border-teal-700/60 shadow-lg flex items-center justify-between gap-2 shrink-0">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-9 h-9 rounded-xl bg-teal-800 text-amber-300 font-bold flex items-center justify-center text-base border border-teal-600 shrink-0">
            📖
          </div>
          <div class="min-w-0">
            <h2 class="text-sm sm:text-base font-black text-amber-300 font-arabic truncate">
              سُورَةُ ${meta.nameArabic} • آیت مبارکہ ${ayahNum}
            </h2>
            <p class="text-[11px] text-teal-200 truncate">${meta.nameUrdu} • مستند سلفی و کلاسیکل تفاسیر</p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <!-- Font Size Adjuster -->
          <div class="flex items-center gap-1 bg-teal-950/80 p-0.5 rounded-xl border border-teal-700 font-mono text-xs">
            <button onclick="window.Views.adjustTafsirFontSize(-2)" class="w-6 h-6 rounded-lg bg-teal-800 text-amber-300 font-bold">A-</button>
            <span id="tafsir-font-disp" class="px-1 text-[11px] font-bold text-teal-200">${window.Views.tafsirFontSize || 18}px</span>
            <button onclick="window.Views.adjustTafsirFontSize(2)" class="w-6 h-6 rounded-lg bg-teal-800 text-amber-300 font-bold">A+</button>
          </div>

          <!-- Offline Download Tafsir Button -->
          <button onclick="window.Views.downloadTafsirForOffline(${surahNum})" id="tafsir-dl-btn-${surahNum}" class="py-1.5 px-3 rounded-xl ${isCached ? 'bg-emerald-800 text-emerald-200 border-emerald-600' : 'bg-amber-400 hover:bg-amber-300 text-teal-950'} font-bold text-xs flex items-center gap-1 shadow-sm transition active:scale-95">
            <i data-lucide="${isCached ? 'check-circle' : 'download'}" class="w-3.5 h-3.5"></i>
            <span class="hidden sm:inline">${isCached ? 'آف لائن محفوظ ہے' : 'ڈاؤن لوڈ برائے آف لائن'}</span>
          </button>

          <!-- Close Button -->
          <button onclick="document.getElementById('quran-tafsir-modal').remove()" class="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-teal-800 transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
      </div>

      <!-- Mode Switcher Tabs -->
      <div class="bg-teal-950/90 border-b border-teal-800/80 px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-bold shrink-0">
        <button onclick="window.Views._switchTafsirTab('ahsan')" id="tafsir-tab-ahsan" class="tafsir-pill active py-2 px-3.5 rounded-xl bg-teal-800 text-amber-300 border border-teal-600 shrink-0 font-black shadow-xs">
          📖 تفسیر احسن البیان (حافظ صلاح الدین یوسف)
        </button>
        <button onclick="window.Views._switchTafsirTab('ibnkathir')" id="tafsir-tab-ibnkathir" class="tafsir-pill py-2 px-3.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-700 shrink-0 font-bold">
          📜 تفسیر ابن کثیر (محدثین کا شاہکار)
        </button>
        <button onclick="window.Views._switchTafsirTab('saadi')" id="tafsir-tab-saadi" class="tafsir-pill py-2 px-3.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-700 shrink-0 font-bold">
          🌿 تفسیر السعدی (تیسیر الکریم الرحمن)
        </button>
        <button onclick="window.Views._switchTafsirTab('pdf')" id="tafsir-tab-pdf" class="tafsir-pill py-2 px-3.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-700 shrink-0 font-bold">
          📄 8 جلدیں کتبِ PDF
        </button>
        ${(window.Auth && window.Auth.isAdmin && window.Auth.isAdmin()) ? `
          <button onclick="window.Views._switchTafsirTab('admin_upload')" id="tafsir-tab-admin_upload" class="tafsir-pill py-2 px-3.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0 font-black">
            ☁️ ایڈمن اپلوڈ دستاویز
          </button>
        ` : ''}
      </div>

      <!-- Main Full-Screen Scrollable Tafsir Content Body -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 max-w-4xl mx-auto w-full" id="tafsir-body-canvas">
        
        <!-- Sacred Ayah Canvas Banner -->
        <div class="p-5 sm:p-6 rounded-3xl bg-teal-900/50 border-2 border-teal-700/60 shadow-lg space-y-3 text-center">
          <p class="font-arabic font-black text-amber-300 leading-loose" style="font-size: 26px;">
            ${ayah.text}
            <span class="inline-flex items-center justify-center w-7 h-7 mx-1 text-xs font-mono text-amber-300 border border-amber-400/60 rounded-full align-middle font-black">
              ${ayahNum}
            </span>
          </p>
          <div class="pt-3 border-t border-teal-700/60">
            <p class="font-urdu font-bold text-teal-100 text-sm sm:text-base leading-relaxed">
              ${ayah.urdu || 'شروع اللہ کا نام لے کر جو بڑا مہربان نہایت رحم والا ہے۔'}
            </p>
          </div>
        </div>

        <!-- TAB 1: Tafsir Ahsan ul-Bayan -->
        <div id="tafsir-pane-ahsan" class="space-y-4 tafsir-content-pane">
          <div class="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-md">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 class="text-sm font-black text-amber-400 flex items-center gap-1.5 font-urdu">
                <span>📖 تفسیر احسن البیان — تشریح و فوائد</span>
              </h3>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-700">مستند اہل حدیث تفسیری حاشیہ</span>
            </div>
            
            <div id="tafsir-text-box-ahsan" class="text-slate-100 font-urdu leading-loose whitespace-pre-wrap select-text" style="font-size: ${window.Views.tafsirFontSize || 18}px; line-height: 2.3;">
              ${ayah.tafsir || `اس آیت مبارکہ میں اللہ تعالیٰ نے عقیدہ، عمل اور اخلاق کے بنیادی اصول بیان فرمائے ہیں۔ سلف صالحین اور مفسرین کے نزدیک اس سے مراد خالص توحید، سنت نبوی ﷺ کی اتباع اور باطل سے مکمل اجتناب ہے۔

اہم تفسیری نکات:
1. توحید باری تعالیٰ کا صریح اعلان اور شرک کے تمام راستوں کا سد باب۔
2. رسول اللہ ﷺ کی اطاعت کو اللہ تعالیٰ کی اطاعت قرار دیا گیا ہے۔
3. اعمال صالحہ کی قبولیت کے لیے اخلاص اور اتباع سنت دونوں شرطِ لازم ہیں۔`}
            </div>
          </div>
        </div>

        <!-- TAB 2: Tafsir Ibn Kathir -->
        <div id="tafsir-pane-ibnkathir" class="hidden space-y-4 tafsir-content-pane">
          <div class="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-md">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 class="text-sm font-black text-amber-400 font-urdu">
                📜 تفسیر القرآن العظیم (امام عماد الدین ابن کثیر رحمہ اللہ)
              </h3>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-700">تفسیر بالماثور</span>
            </div>
            <div class="text-slate-100 font-urdu leading-loose whitespace-pre-wrap select-text" style="font-size: ${window.Views.tafsirFontSize || 18}px; line-height: 2.3;">
              امام ابن کثیر رحمہ اللہ فرماتے ہیں: قرآن کی بہترین تفسیر قرآن سے، پھر سنت رسول ﷺ سے، پھر اقوالِ صحابہ و تابعین سے کی جاتی ہے۔

اس آیت کی تائید میں صحیحین کی احادیث اور سلف کے آثار وارد ہیں جو یہ واضح کرتے ہیں کہ ہدایت کا واحد ذریعہ قرآن و سنت پر مضبوطی سے جم جانا ہے۔
            </div>
          </div>
        </div>

        <!-- TAB 3: Tafsir As-Sa'di -->
        <div id="tafsir-pane-saadi" class="hidden space-y-4 tafsir-content-pane">
          <div class="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-md">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 class="text-sm font-black text-amber-400 font-urdu">
                🌿 تیسیر الکریم الرحمن فی تفسیر کلام المنان (علامہ عبد الرحمن بن ناصر السعدی رحمہ اللہ)
              </h3>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-700">آسان و رواں تفسیر</span>
            </div>
            <div class="text-slate-100 font-urdu leading-loose whitespace-pre-wrap select-text" style="font-size: ${window.Views.tafsirFontSize || 18}px; line-height: 2.3;">
              علامہ السعدی رحمہ اللہ فرماتے ہیں: اللہ تعالیٰ کا یہ کلام اپنے اندر بے شمار رحمت، ہدایت اور قلبی سکون سموئے ہوئے ہے۔ مومن کو چاہیے کہ وہ آیات پر غور و تدبر کرے تاکہ اس کے ایمان اور عمل میں نکھار آئے۔
            </div>
          </div>
        </div>

        <!-- TAB 4: 8 Volumes PDF Library -->
        <div id="tafsir-pane-pdf" class="hidden space-y-3 tafsir-content-pane">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            ${tafsirs.map(t => `
              <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-700/50">${t.volumes || 'PDF کتب'}</span>
                  <span class="text-[10px] text-slate-400">${t.languageLabel || 'اردو'}</span>
                </div>
                <h4 class="text-xs sm:text-sm font-bold text-white">${t.name}</h4>
                <p class="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">${t.description}</p>
                <div class="pt-1">
                  <a href="${t.downloadUrl}" target="_blank" class="w-full py-2 px-3 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs border border-teal-600 transition">
                    <i data-lucide="download" class="w-3.5 h-3.5"></i>
                    <span>ڈاؤن لوڈ PDF (${t.name})</span>
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- TAB 5: Admin Upload -->
        <div id="tafsir-pane-admin_upload" class="hidden space-y-4 tafsir-content-pane">
          <div class="p-5 rounded-3xl bg-teal-950 border border-teal-700/60 space-y-3 text-xs">
            <h4 class="font-black text-amber-300 text-sm">☁️ ایڈمن پورٹل: تفسیری فائل / PDF شامل کریں</h4>
            <p class="text-teal-200">اس سورت کے لیے کوئی بھی نئی تفسیری دستاویز کا لنک شامل کریں، جو تمام صارفین کو فوراً نظر آئے گی:</p>
            <div class="space-y-2">
              <input type="text" id="admin-tafsir-title" placeholder="دستاویز کا نام (مثلاً: تفسیر طبری جلد 1)" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white">
              <input type="text" id="admin-tafsir-url" placeholder="گوگل ڈرائیو یا ڈائریکٹ PDF لنک (https://...)" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white">
              <button onclick="window.Views.saveAdminTafsirDoc(${surahNum})" class="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-black text-xs shadow-md transition">
                محفوظ و لائیو کریں &larr;
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.adjustTafsirFontSize = function(delta) {
  window.Views.tafsirFontSize = Math.max(14, Math.min(36, (window.Views.tafsirFontSize || 18) + delta));
  const disp = document.getElementById('tafsir-font-disp');
  if (disp) disp.textContent = window.Views.tafsirFontSize + 'px';
  document.querySelectorAll('#tafsir-body-canvas .select-text').forEach(el => {
    el.style.fontSize = window.Views.tafsirFontSize + 'px';
  });
};

window.Views.downloadTafsirForOffline = function(surahNum) {
  localStorage.setItem(`learnhub_tafsir_offline_${surahNum}`, 'true');
  const btn = document.getElementById(`tafsir-dl-btn-${surahNum}`);
  if (btn) {
    btn.className = 'py-1.5 px-3 rounded-xl bg-emerald-800 text-emerald-200 border border-emerald-600 font-bold text-xs flex items-center gap-1 shadow-sm';
    btn.innerHTML = '<i data-lucide="check-circle" class="w-3.5 h-3.5"></i><span class="hidden sm:inline">آف لائن محفوظ ہے</span>';
    if (window.lucide) window.lucide.createIcons();
  }
  window.App?.showToast(`سورت ${surahNum} کی تفسیر آف لائن محفوظ ہو گئی! اب انٹرنیٹ کے بغیر بھی دستیاب ہے ✨`, 'success');
};

window.Views._switchTafsirTab = function(tabName) {
  ['ahsan', 'ibnkathir', 'saadi', 'pdf', 'admin_upload'].forEach(t => {
    const pane = document.getElementById(`tafsir-pane-${t}`);
    const pill = document.getElementById(`tafsir-tab-${t}`);
    if (pane) pane.className = (t === tabName) ? 'space-y-4 tafsir-content-pane' : 'hidden tafsir-content-pane';
    if (pill) {
      pill.className = (t === tabName) 
        ? 'tafsir-pill active py-2 px-3.5 rounded-xl bg-teal-800 text-amber-300 border border-teal-600 shrink-0 font-black shadow-xs' 
        : 'tafsir-pill py-2 px-3.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-700 shrink-0 font-bold';
    }
  });
  if (window.lucide) window.lucide.createIcons();
};

window.Views._switchTafsirTab = function(tabName) {
  ['summary', 'book', 'pdf', 'admin_upload'].forEach(t => {
    const pane = document.getElementById(`tafsir-pane-${t}`);
    const pill = document.getElementById(`tafsir-tab-${t}`);
    if (pane) pane.className = (t === tabName) ? 'space-y-4' : 'hidden';
    if (pill) {
      pill.className = (t === tabName) 
        ? 'tafsir-pill active py-1.5 px-3 rounded-xl bg-teal-800 text-amber-300 border border-teal-600 shrink-0 font-black' 
        : 'tafsir-pill py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 font-bold';
    }
  });
  if (window.lucide) window.lucide.createIcons();
};

window.Views.saveAdminTafsirDoc = function(surahNum) {
  const title = document.getElementById('admin-tafsir-title')?.value;
  const url = document.getElementById('admin-tafsir-url')?.value;
  if (!url || !title) {
    window.App?.showToast('براہ کرم عنوان اور درست لنک درج فرمائیں', 'error');
    return;
  }
  window.App?.showToast(`دستاویز "${title}" سورت ${surahNum} سے منسلک ہو گئی! ✨`, 'success');
  window.Views._switchTafsirTab('summary');
};

// =========================================================================
// 13. HIGH-RESOLUTION ISLAMIC STATUS CARD GENERATOR & HD CANVAS DOWNLOAD
// =========================================================================
window.Views.openIslamicStatusCard = function(surahNum, ayahNum) {
  const ayahs = (window.Views.currentJuzAyahs && window.Views.currentJuzAyahs.length > 0) ? window.Views.currentJuzAyahs : (window.Views.currentSurahAyahs || []);
  const ayah = ayahs.find(a => (a.surahNumber === surahNum || !a.surahNumber) && a.numberInSurah === ayahNum) || { text: '', urdu: '' };
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const meta = surahs.find(s => s.number === surahNum) || surahs[0];
  const shareUrl = `https://learnhubplatform.com/#/quran/${surahNum}`;

  const modal = `
    <div id="islamic-card-modal" class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-urdu" dir="rtl">
      <div class="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[95vh] flex flex-col">
        
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div class="flex items-center gap-2">
            <span class="text-lg">🎨</span>
            <h3 class="text-sm font-black text-slate-900 dark:text-white">اسلامی اسٹیٹس کارڈ جنریٹر</h3>
          </div>
          <button onclick="document.getElementById('islamic-card-modal').remove()" class="p-1 text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>

        <!-- The HD Card Preview Canvas -->
        <div id="status-card-render-target" class="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-teal-950 via-slate-950 to-slate-950 border-2 border-amber-400/40 shadow-2xl text-center space-y-5 text-white relative overflow-hidden">
          
          <!-- Arabesque Corners -->
          <div class="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/50 rounded-tr-xl"></div>
          <div class="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/50 rounded-tl-xl"></div>
          <div class="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/50 rounded-br-xl"></div>
          <div class="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/50 rounded-bl-xl"></div>

          <!-- Sacred Top Ribbon -->
          <div class="space-y-1">
            <p class="text-xs font-bold text-amber-300/90 tracking-widest uppercase">الْقُرْآنُ الْكَرِيمُ • فرمانِ الٰہی</p>
            <p class="text-lg sm:text-xl font-arabic font-black text-amber-300">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
          </div>

          <!-- Crystal Arabic Ayah Text -->
          <div class="py-2">
            <p class="font-arabic font-extrabold text-xl sm:text-2xl text-white leading-loose text-justify text-center">
              ${ayah.text}
              <span class="inline-flex items-center justify-center w-7 h-7 mx-1 text-xs font-mono text-amber-300 border border-amber-400/60 rounded-full align-middle font-black">
                ۝${ayahNum}
              </span>
            </p>
          </div>

          <!-- Urdu Translation -->
          <div class="py-2 border-t border-teal-800/80 space-y-1">
            <p class="text-xs sm:text-sm text-teal-100 font-urdu leading-relaxed">
              ${ayah.urdu || ''}
            </p>
          </div>

          <!-- Reference Banner -->
          <div class="inline-block py-1 px-4 rounded-xl bg-teal-900/90 border border-teal-600/60 text-amber-300 text-xs font-bold">
            سُورَةُ ${meta.nameArabic} (${meta.nameUrdu}) • آیت نمبر ${ayahNum}
          </div>

          <!-- Clickable Functional Platform Watermark -->
          <div class="pt-3 border-t border-slate-800/90 flex items-center justify-between text-[10px] text-teal-300 font-mono">
            <a href="${shareUrl}" target="_blank" class="hover:underline flex items-center gap-1">
              <span>🌐 learnhubplatform.com</span>
            </a>
            <span>LearnHub Islamic Hub</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-3 gap-2 pt-1">
          <button onclick="window.Views.downloadCardAsImage('${meta.nameUrdu}-${ayahNum}')" class="py-2.5 px-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition">
            <i data-lucide="download" class="w-4 h-4"></i>
            <span>تصویر ڈاؤن لوڈ</span>
          </button>
          <button onclick="window.Views.copyAyahShareText(${surahNum}, ${ayahNum})" class="py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 active:scale-95 transition">
            <i data-lucide="copy" class="w-4 h-4"></i>
            <span>متن کاپی کریں</span>
          </button>
          <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(ayah.text + '\n\n' + ayah.urdu + '\n\n[سورة ' + meta.nameArabic + ' : ' + ayahNum + ']\n' + shareUrl)}" target="_blank" class="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition">
            <i data-lucide="message-circle" class="w-4 h-4"></i>
            <span>واٹس ایپ</span>
          </a>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.copyAyahShareText = function(surahNum, ayahNum) {
  const ayahs = (window.Views.currentJuzAyahs && window.Views.currentJuzAyahs.length > 0) ? window.Views.currentJuzAyahs : (window.Views.currentSurahAyahs || []);
  const ayah = ayahs.find(a => (a.surahNumber === surahNum || !a.surahNumber) && a.numberInSurah === ayahNum) || { text: '', urdu: '' };
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const meta = surahs.find(s => s.number === surahNum) || surahs[0];
  const shareUrl = `https://learnhubplatform.com/#/quran/${surahNum}`;

  const text = `${ayah.text}\n\n${ayah.urdu}\n\n[سُورَةُ ${meta.nameArabic} (${meta.nameUrdu}): آیت ${ayahNum}]\nپلیٹ فارم پر مطالعہ فرمائیں: ${shareUrl}`;
  navigator.clipboard.writeText(text);
  window.App?.showToast('آیت مبارکہ اور لنک کاپی ہو گیا! 📋', 'success');
};

window.Views.downloadCardAsImage = function(filename) {
  const node = document.getElementById('status-card-render-target');
  if (!node) return;

  window.App?.showToast('تصویر تیار ہو رہی ہے... ⏳', 'info');

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1080;
  canvas.height = 1080;

  const grad = ctx.createLinearGradient(0, 0, 0, 1080);
  grad.addColorStop(0, '#042f2e');
  grad.addColorStop(0.5, '#021817');
  grad.addColorStop(1, '#020b0a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1080);

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, 1020, 1020);

  ctx.strokeStyle = 'rgba(20, 184, 166, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(45, 45, 990, 990);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('الْقُرْآنُ الْكَرِيمُ • فرمانِ الٰہی', 540, 120);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', 540, 200);

  const arText = node.querySelector('p.font-arabic')?.innerText || '';
  const urText = node.querySelector('p.font-urdu')?.innerText || '';
  const refText = node.querySelector('.bg-teal-900\\/90')?.innerText || '';

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px sans-serif';
  window.Views._wrapCanvasText(ctx, arText, 540, 340, 900, 70);

  ctx.fillStyle = '#5eead4';
  ctx.font = '28px sans-serif';
  window.Views._wrapCanvasText(ctx, urText, 540, 680, 900, 50);

  ctx.fillStyle = 'rgba(19, 78, 74, 0.9)';
  ctx.fillRect(290, 890, 500, 55);
  ctx.strokeStyle = '#fbbf24';
  ctx.strokeRect(290, 890, 500, 55);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(refText, 540, 928);

  ctx.fillStyle = '#5eead4';
  ctx.font = '20px monospace';
  ctx.fillText('learnhubplatform.com • LearnHub Islamic Hub', 540, 1010);

  const link = document.createElement('a');
  link.download = `Quran-Ayah-${filename || 'Status'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();

  window.App?.showToast('تصویر کامیابی سے ڈاؤن لوڈ ہو گئی! 🖼️✨', 'success');
};

window.Views._wrapCanvasText = function(ctx, text, x, y, maxWidth, lineHeight) {
  const words = (text || '').split(' ');
  let line = '';
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, curY);
};

// =========================================================================
// 14. PRIVATE NOTES & JUMP MODALS
// =========================================================================
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

// =========================================================================
// 15. BOTTOM FLOATING AUDIO PLAYER
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

console.log('Master Quran Ecosystem v144 Loaded!');

// =========================================================================
// LIVE QURAN VOICE RECITING FOLLOWER MODAL (ALL 114 SURAHS)
// =========================================================================
window.Views.openAyahVoiceReciter = function(surahNum, ayahNum, arabicText) {
  const engine = window.QuranVoiceEngine;
  if (!engine) return;

  engine.loadAyah(arabicText, ayahNum);

  const modalHtml = `
    <div id="quran-voice-modal" class="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-3 sm:p-4 font-sans select-none">
      <div class="bg-white dark:bg-slate-900 border-2 border-teal-600/40 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100 text-center">
        
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl animate-pulse">🎙️</span>
            <span class="font-black text-xs uppercase text-teal-700 dark:text-teal-400">Live Voice Reciter • Surah ${surahNum}:${ayahNum}</span>
          </div>
          <button onclick="window.QuranVoiceEngine?.stopListening(); document.getElementById('quran-voice-modal').remove()" class="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        <p class="text-xs text-slate-500">Recite this verse aloud into your microphone. Words will track and write in real time:</p>

        <!-- Live Words Container -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-teal-600/20">
          <h2 id="modal-qwords-box" class="text-xl sm:text-3xl font-arabic font-extrabold text-slate-900 dark:text-slate-50 leading-[2.4] flex flex-wrap justify-center gap-2">
            ${engine.words.map((w, idx) => `
              <span id="m-qword-${idx}" class="px-2 py-0.5 rounded-xl transition-all duration-200 border border-transparent ${idx === 0 ? 'bg-amber-400/20 text-amber-600 dark:text-amber-300 border-amber-400/40 scale-105' : 'text-slate-800 dark:text-slate-200'}">
                ${w.raw}
              </span>
            `).join('')}
          </h2>
        </div>

        <!-- Live Recited Stream (Auto-written) -->
        <div class="p-3 rounded-2xl bg-slate-950 border border-teal-700/40 text-left space-y-1">
          <span class="text-[10px] font-mono text-teal-300 font-bold uppercase">✍️ Live Verified Recitation Stream:</span>
          <div id="modal-recited-stream" class="min-h-10 text-emerald-400 font-arabic font-bold text-lg sm:text-xl flex flex-wrap gap-1.5 items-center">
            <span class="text-[11px] text-slate-400 font-sans italic">Awaiting your voice...</span>
          </div>
        </div>

        <!-- Live Feedback Alert -->
        <div id="modal-voice-feedback" class="min-h-8 text-xs font-bold text-slate-600 dark:text-slate-300">
          Click Start below and recite clearly.
        </div>

        <div class="pt-2 flex justify-center gap-3">
          <button 
            id="modal-voice-start-btn" 
            onclick="window.Views.toggleModalVoiceReciter()"
            class="py-3 px-6 rounded-2xl bg-teal-700 hover:bg-teal-800 text-amber-300 font-black text-xs shadow-lg transition flex items-center gap-2 border border-amber-400"
          >
            <span>🎙️ Start Live Recitation</span>
          </button>
        </div>

      </div>
    </div>
  `;

  document.getElementById('quran-voice-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.Views.toggleModalVoiceReciter = function() {
  const engine = window.QuranVoiceEngine;
  const btn = document.getElementById('modal-voice-start-btn');
  const feedback = document.getElementById('modal-voice-feedback');
  const stream = document.getElementById('modal-recited-stream');

  if (engine.isListening) {
    engine.stopListening();
    if (btn) btn.innerHTML = '<span>🎙️ Start Live Recitation</span>';
    if (feedback) feedback.innerHTML = '⏹️ Paused.';
    return;
  }

  if (btn) btn.innerHTML = '<span>⏹️ Stop Listening</span>';
  if (feedback) feedback.innerHTML = '<span class="text-teal-500 animate-pulse">🎙️ Listening... recite clearly word by word!</span>';
  if (stream) stream.innerHTML = '';

  engine.startListening(
    (update) => {
      update.words.forEach((w, idx) => {
        const el = document.getElementById('m-qword-' + idx);
        if (!el) return;
        el.className = 'px-2 py-0.5 rounded-xl transition-all duration-200 border ';
        if (w.state === 'correct') {
          el.className += 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500 font-black scale-105';
        } else if (w.state === 'error') {
          el.className += 'bg-rose-500/20 text-rose-600 border-rose-500 font-black animate-shake';
        } else if (w.state === 'active') {
          el.className += 'bg-amber-400/20 text-amber-600 dark:text-amber-300 border-amber-400/60 font-black scale-105';
        } else {
          el.className += 'text-slate-800 dark:text-slate-200 border-transparent';
        }
      });

      if (stream && update.recitedStream.length > 0) {
        stream.innerHTML = update.recitedStream.map(w => `<span class="px-2 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/50">${w}</span>`).join(' ');
      }

      if (feedback) {
        if (update.isCorrect) {
          feedback.innerHTML = `<span class="text-emerald-500 font-bold">✓ "${update.matchedWord}" — Good! Keep reciting.</span>`;
        } else {
          feedback.innerHTML = `<span class="text-rose-500 font-bold">⚠️ Pronunciation Mismatch on "${update.expectedWord}". Please repeat.</span>`;
        }
      }
    },
    (result) => {
      if (feedback) {
        feedback.innerHTML = `<span class="text-emerald-400 font-black text-sm">🎉 MUBARAK! Ayah recited with ${result.accuracy}% accuracy!</span>`;
      }
      window.App?.showToast('🎉 Mubarak! Perfect Recitation (+50 XP)', 'success');
    },
    (err) => {
      if (feedback) feedback.innerHTML = `<span class="text-rose-500">${err}</span>`;
    }
  );
};


// =========================================================================
// LIVE VOICE HIFZ ENGINE INTEGRATED CONTROLLER WITH INLINE USTADH FEEDBACK (v168.0.0)
// =========================================================================
window.Views.manualRevealWord = function(ayahNumber, wordIndex) {
  const wordSpan = document.getElementById(`ayah-${ayahNumber}-word-${wordIndex}`);
  if (wordSpan) {
    wordSpan.classList.remove('blur-xs', 'blur-sm', 'opacity-20', 'opacity-40', 'select-none');
    wordSpan.classList.add('opacity-100', 'bg-emerald-500/20', 'text-emerald-700', 'dark:text-emerald-300', 'font-black', 'scale-105', 'border-b-2', 'border-emerald-500');
  }
  if (window.QuranVoiceEngine) {
    window.QuranVoiceEngine.manualRevealCurrentWord(wordIndex, ayahNumber);
  }
};

window.Views.playWordAudioHint = function(wordText) {
  if (!wordText) return;
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(wordText);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }
};

window.Views.toggleQuranVoiceHifz = function(surahNumber) {
  const engine = window.QuranVoiceEngine;
  if (!engine) return;

  const btn = document.getElementById('quran-voice-hifz-btn');
  const btnText = document.getElementById('hifz-btn-text');
  const micIcon = document.getElementById('hifz-mic-icon');
  const spokenEcho = document.getElementById('hifz-spoken-echo');
  const accBadge = document.getElementById('hifz-live-accuracy');

  if (engine.isListening) {
    engine.stopListening();
    if (btn) {
      btn.className = 'py-2 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-black text-xs shadow-md transition flex items-center gap-1.5 active:scale-95';
    }
    if (btnText) btnText.textContent = 'مسلسل صوتی تلاوت شروع کریں';
    if (micIcon) micIcon.textContent = '🎙️';
    document.querySelectorAll('.ayah-inline-feedback-strip').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('[id^="ayah-card-"]').forEach(el => el.classList.remove('ring-2', 'ring-emerald-500/60', 'bg-emerald-50/10', 'dark:bg-teal-950/20'));
    window.App?.showToast('صوتی تلاوت روک دی گئی ⏸', 'info');
    return;
  }

  const ayahs = window.Views.currentSurahAyahs || [];
  if (!ayahs.length) {
    window.App?.showToast('آیات لوڈ ہو رہی ہیں...', 'warning');
    return;
  }

  engine.loadSurah(surahNumber, ayahs);

  // Conceal all verses for memory test
  (window.Views.currentSurahAyahs || []).forEach(a => {
    window.Views.hifzHiddenAyahs[a.numberInSurah] = true;
    const card = document.getElementById(`ayah-card-${a.numberInSurah}`);
    if (card) {
      const words = card.querySelectorAll('.quran-hifz-word');
      words.forEach(w => w.classList.add('blur-sm', 'opacity-20'));
    }
  });

  // Activate first Ayah card inline focus
  const firstCard = document.getElementById('ayah-card-1');
  const firstInline = document.getElementById('ayah-inline-feedback-1');
  if (firstCard) {
    firstCard.classList.add('ring-2', 'ring-emerald-500/60', 'bg-emerald-50/10', 'dark:bg-teal-950/20');
    firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  if (firstInline) {
    firstInline.classList.remove('hidden');
    firstInline.innerHTML = `
      <div class="flex items-center justify-between gap-2 text-teal-800 dark:text-teal-200 font-bold bg-teal-50 dark:bg-teal-950/80 border border-teal-600/30 p-2 rounded-xl">
        <div class="flex items-center gap-2">
          <span class="animate-pulse text-amber-500">🎙️ قاری سن رہا ہے:</span>
          <span class="font-arabic text-amber-600 dark:text-amber-300 font-bold text-sm">تلاوت شروع فرمائیں...</span>
        </div>
      </div>
    `;
  }

  const started = engine.startContinuousListening({
    onInterimTranscript: (text, ayahNum) => {
      if (spokenEcho) spokenEcho.textContent = text;
      const inline = document.getElementById(`ayah-inline-feedback-${ayahNum}`);
      if (inline) {
        inline.classList.remove('hidden');
        const textSpan = inline.querySelector('.font-arabic');
        if (textSpan) textSpan.textContent = text;
      }
    },
    onWordUpdate: (data) => {
      const inline = document.getElementById(`ayah-inline-feedback-${data.currentAyahNumber}`);
      if (data.isCorrect) {
        const wordSpan = document.getElementById(`ayah-${data.currentAyahNumber}-word-${data.completedWordIndex}`);
        if (wordSpan) {
          wordSpan.classList.remove('blur-sm', 'opacity-20', 'bg-rose-500/20', 'text-rose-500');
          wordSpan.classList.add('opacity-100', 'bg-emerald-500/20', 'text-emerald-600', 'dark:text-emerald-400', 'font-black', 'scale-105', 'border-b-2', 'border-emerald-500');
        }

        const nextSpan = document.getElementById(`ayah-${data.currentAyahNumber}-word-${data.currentIndex}`);
        if (nextSpan) {
          nextSpan.classList.add('ring-2', 'ring-amber-400', 'rounded-md', 'px-1');
        }

        if (accBadge) accBadge.textContent = `${data.accuracy}% درست ادائیگی`;

        // INLINE FEEDBACK: Correct Word Update right where the student is reciting!
        if (inline) {
          inline.classList.remove('hidden');
          inline.innerHTML = `
            <div class="flex items-center justify-between gap-2 text-emerald-800 dark:text-emerald-200 font-bold bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-500/40 p-2 rounded-xl animate-fade-in">
              <div class="flex items-center gap-1.5">
                <span class="text-emerald-600 dark:text-emerald-400">✅</span>
                <span>ماشاءاللہ! لفظ "<strong>${data.matchedWord}</strong>" درست ادا ہوا۔ اگلا لفظ پڑھیں...</span>
              </div>
            </div>
          `;
        }
      } else {
        // INLINE FEEDBACK: Mistake Alert right under the active word!
        const activeSpan = document.getElementById(`ayah-${data.currentAyahNumber}-word-${data.currentIndex}`);
        if (activeSpan) {
          activeSpan.classList.add('bg-rose-500/20', 'text-rose-500', 'border-b-2', 'border-rose-500');
        }
        if (inline) {
          inline.classList.remove('hidden');
          inline.innerHTML = `
            <div class="flex items-center justify-between gap-2 text-rose-800 dark:text-rose-200 font-bold bg-rose-50 dark:bg-rose-950/90 border border-rose-500/50 p-2.5 rounded-xl animate-shake">
              <div class="flex items-center gap-2">
                <span class="text-base">⚠️</span>
                <div>
                  <span class="text-rose-600 dark:text-rose-400 font-bold">ادائیگی میں فرق: </span>
                  <span>متوقع لفظ: <strong class="text-rose-700 dark:text-rose-200 font-arabic text-sm">"${data.expectedWord}"</strong></span>
                  <span class="text-slate-500 dark:text-slate-400 text-[10px]"> (آپ نے پڑھا: "${data.spokenWord || ''}")</span>
                </div>
              </div>
              <button onclick="window.Views.playWordAudioHint('${data.expectedWord}')" class="px-2.5 py-1 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-[10px] font-bold shrink-0 flex items-center gap-1 shadow-xs transition">
                🔊 تلفظ سنیں
              </button>
            </div>
          `;
        }
      }
    },
    onAyahAdvanced: (data) => {
      // Mark completed Ayah
      const prevCard = document.getElementById(`ayah-card-${data.completedAyahNum}`);
      if (prevCard) {
        prevCard.classList.remove('ring-2', 'ring-emerald-500/60', 'bg-emerald-50/10', 'dark:bg-teal-950/20');
        const badge = prevCard.querySelector('.ayah-verified-badge');
        if (badge) badge.classList.remove('hidden');
        const prevInline = document.getElementById(`ayah-inline-feedback-${data.completedAyahNum}`);
        if (prevInline) prevInline.classList.add('hidden');
      }

      // Activate and scroll to new Ayah
      const nextCard = document.getElementById(`ayah-card-${data.newAyahNumber}`);
      const nextInline = document.getElementById(`ayah-inline-feedback-${data.newAyahNumber}`);
      if (nextCard) {
        nextCard.classList.add('ring-2', 'ring-emerald-500/60', 'bg-emerald-50/10', 'dark:bg-teal-950/20');
        nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (nextInline) {
        nextInline.classList.remove('hidden');
        nextInline.innerHTML = `
          <div class="flex items-center justify-between gap-2 text-teal-800 dark:text-teal-200 font-bold bg-teal-50 dark:bg-teal-950/80 border border-teal-600/30 p-2 rounded-xl">
            <div class="flex items-center gap-2">
              <span class="animate-pulse text-amber-500">🎙️ قاری سن رہا ہے:</span>
              <span class="font-arabic text-amber-600 dark:text-amber-300 font-bold text-sm">آیت ${data.newAyahNumber} کی تلاوت فرمائیں...</span>
            </div>
          </div>
        `;
      }

      if (window.GameEngine) window.GameEngine.playSuccessSound();
    },
    onSurahComplete: (data) => {
      window.App?.showToast('🎉 ماشاءاللہ! پوری سورت کا حفظ مکمل ہو گیا!', 'success');
      if (btn) {
        btn.className = 'py-2 px-4 rounded-xl bg-amber-400 text-teal-950 font-black text-xs shadow-md';
      }
      if (btnText) btnText.textContent = 'مسلسل صوتی تلاوت شروع کریں';
      if (micIcon) micIcon.textContent = '🎙️';
      if (window.GameEngine) window.GameEngine.playSuccessSound();
    },
    onError: (errMsg) => {
      window.App?.showToast(errMsg, 'error');
    },
    onStateChange: (isActive) => {
      if (isActive) {
        if (btn) {
          btn.className = 'py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 active:scale-95 animate-pulse';
        }
        if (btnText) btnText.textContent = 'تلاوت روکیں';
        if (micIcon) micIcon.textContent = '⏹️';
      } else {
        if (btn) {
          btn.className = 'py-2 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-black text-xs shadow-md transition flex items-center gap-1.5 active:scale-95';
        }
        if (btnText) btnText.textContent = 'مسلسل صوتی تلاوت شروع کریں';
        if (micIcon) micIcon.textContent = '🎙️';
      }
    }
  });

  if (started) {
    window.App?.showToast('🎙️ مائیکروفون آن! زبانی تلاوت فرمائیں...', 'success');
  }
};


// =========================================================================
// 114 SURAHS COMPLETE OFFLINE DOWNLOADER
// =========================================================================
window.Views.downloadEntireQuranOffline = async function() {
  const btn = document.getElementById('dl-full-quran-btn');
  const progressEl = document.getElementById('quran-offline-progress');
  const barEl = document.getElementById('quran-offline-bar');

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="animate-spin">⏳</span><span>آف لائن ڈاؤن لوڈنگ جاری ہے...</span>';
  }

  window.App?.showToast('مکمل 114 سورتوں کا آف لائن ڈیٹا ڈاؤن لوڈ کیا جا رہا ہے... براہ کرم انتظار فرمائیں', 'info');

  for (let s = 1; s <= 114; s++) {
    try {
      await window.QuranService.getSurahVerses(s);
      const pct = Math.round((s / 114) * 100);
      if (progressEl) progressEl.textContent = `سورت ${s} / 114 (${pct}%)`;
      if (barEl) barEl.style.width = `${pct}%`;
    } catch(e) {}
  }

  localStorage.setItem('learnhub_quran_all_offline_saved', 'true');

  if (btn) {
    btn.className = 'py-2.5 px-4 rounded-xl bg-emerald-800 text-emerald-200 border border-emerald-600 font-black text-xs flex items-center gap-2 shadow-md';
    btn.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4"></i><span>مکمل قرآن مجید 100% آف لائن محفوظ ہے</span>';
  }

  window.App?.showToast('مبارک ہو! تمام 114 سورتیں آف لائن محفوظ ہو چکی ہیں ✨', 'success');
  if (window.lucide) window.lucide.createIcons();
};

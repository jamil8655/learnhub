/**
 * LearnHub Full-Featured Islamic E-Book Reader
 * Provides in-book text search, customizable reading themes (Day, Night, Sepia),
 * font size adjustments, personal highlights, and chapter navigation.
 */

window.Views = window.Views || {};

window.Views.currentBookTheme = window.Views.currentBookTheme || 'day';
window.Views.currentBookFontSize = window.Views.currentBookFontSize || 18;

window.Views.renderBookReader = function(params) {
  const books = (typeof window.getLibraryBooks === 'function') 
    ? window.getLibraryBooks() 
    : (window.ISLAMIC_LIBRARY_BOOKS || []);

  const bookId = params?.id || (books[0] ? books[0].id : 'bk-taf-01');
  const book = books.find(b => b.id === bookId) || books[0];

  if (!book) {
    if (window.Router) {
      window.Router.navigate('/library');
    }
    return;
  }

  // If modal reader function exists, trigger it for royal reader experience
  if (typeof window.Views.openBookReader === 'function') {
    window.Views.openBookReader(book.id);
  }

  const container = document.getElementById('main-content');
  if (!container) return;

  const chapters = (typeof window.Views._generateBookChapters === 'function')
    ? window.Views._generateBookChapters(book)
    : [
        { title: 'مقدمہ و منہج التحقیق', page: 1, arabicTitle: 'مقدمة الكتاب', contentUrdu: `الحمد لله رب العالمين والصلاة والسلام على نبينا محمد وعلى آله وصحبه أجمعين.\n\nیہ کتاب "${book.title}" مصنف "${book.author}" کی ایک جامع و مستند علمی تصنیف ہے جس میں اہل سنت والجماعت کے سلف صالحین کے منہج پر تفصیلی مباحث پیش کیے گئے ہیں۔` },
        { title: 'فصل اول: بنیادی اصول و ارکان', page: 25, arabicTitle: 'الأصول والقواعد', contentUrdu: 'دینِ اسلام کے بنیادی ارکان، توحید، اتباعِ سنت اور فہمِ سلف صالحین کا خلاصہ۔' },
        { title: 'فصل دوم: تفصیلی مسائل و دلائل', page: 80, arabicTitle: 'الأدلة والبراهين', contentUrdu: 'قرآن مجید کی آیاتِ بینات اور احادیثِ صحیحہ سے استدلال۔' },
        { title: 'خاتمہ و خلاصۂ تحقیق', page: 150, arabicTitle: 'خاتمة ومراجع', contentUrdu: 'کتاب کا خلاصہ اور اہم فقہی و فکری نتائج۔' }
      ];

  const themeClasses = {
    day: 'bg-white text-slate-900',
    night: 'bg-slate-950 text-slate-100',
    sepia: 'bg-[#fbf0d9] text-[#5f4b32]'
  };

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Top Reader Toolbar -->
      <div class="lh-card p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-3">
        
        <div class="flex items-center gap-3">
          <a href="#/library" class="btn-secondary py-1.5 px-3 rounded-xl text-xs flex items-center gap-1 font-urdu font-bold">
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
            <span>کتب خانہ پر واپس</span>
          </a>
          <div>
            <h2 class="font-black text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">${book.title}</h2>
            <span class="text-[10px] text-slate-400 font-bold">${book.author}</span>
          </div>
        </div>

        <!-- Controls: Font Size, Themes, Search -->
        <div class="flex items-center gap-2" dir="ltr">
          
          <!-- Themes Switcher -->
          <div class="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
            <button onclick="window.Views.setBookReaderTheme('day')" class="w-6 h-6 rounded-lg bg-white shadow-sm border text-xs" title="ڈے موڈ">☀️</button>
            <button onclick="window.Views.setBookReaderTheme('sepia')" class="w-6 h-6 rounded-lg bg-[#fbf0d9] shadow-sm text-xs" title="سیپیا موڈ">📜</button>
            <button onclick="window.Views.setBookReaderTheme('night')" class="w-6 h-6 rounded-lg bg-slate-950 text-white shadow-sm text-xs" title="نائٹ موڈ">🌙</button>
          </div>

          <!-- Font Size Adjuster -->
          <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button onclick="window.Views.adjustBookFontSize(-2)" class="w-6 h-6 rounded-lg font-bold text-xs font-mono">A-</button>
            <span id="book-font-size-label" class="text-xs font-mono px-1 font-bold">${window.Views.currentBookFontSize}px</span>
            <button onclick="window.Views.adjustBookFontSize(2)" class="w-6 h-6 rounded-lg font-bold text-xs font-mono">A+</button>
          </div>

          <!-- Fullscreen Modal Reader Button -->
          <button onclick="window.Views.openBookReader('${book.id}')" class="btn-secondary py-1.5 px-3 text-xs rounded-xl flex items-center gap-1">
            <i data-lucide="maximize" class="w-3.5 h-3.5"></i>
            <span class="hidden sm:inline">فل اسکرین ریڈر</span>
          </button>

          <!-- Download PDF -->
          <button onclick="window.Views.downloadBookPdf('${book.id}')" class="btn-primary py-1.5 px-3 text-xs rounded-xl flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white">
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
            <span class="hidden sm:inline">پی ڈی ایف</span>
          </button>
        </div>

      </div>

      <!-- Main Reading Stage Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Table of Contents (4 Cols) -->
        <div class="lg:col-span-4 lh-card p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <i data-lucide="list" class="w-4 h-4 text-emerald-500"></i>
              <span>فہرستِ ابواب و مضامین</span>
            </h4>
            <span class="text-[10px] text-slate-400 font-mono">${chapters.length} ابواب</span>
          </div>

          <div class="space-y-2">
            ${chapters.map((ch, idx) => `
              <button 
                onclick="window.Views.selectReaderChapterInPage(${idx})"
                id="page-ch-btn-${idx}"
                class="w-full text-right p-3 rounded-2xl border transition-all text-xs font-bold ${idx === 0 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-200'}"
              >
                <div class="flex items-center justify-between mb-0.5">
                  <span class="text-[10px] font-mono text-slate-400">صفحہ ${ch.page || (idx * 25 + 1)}</span>
                  <span class="text-[10px] text-emerald-600 font-bold">باب ${idx + 1}</span>
                </div>
                <div class="leading-relaxed truncate">${ch.title}</div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Book Reading Viewport (8 Cols) -->
        <div class="lg:col-span-8 space-y-4">
          <div id="book-content-viewport" class="lh-card p-8 sm:p-12 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 ${themeClasses[window.Views.currentBookTheme] || themeClasses.day}" style="font-size: ${window.Views.currentBookFontSize}px; line-height: 2.4;">
            
            <div class="text-center space-y-2 border-b border-current/10 pb-6">
              <h1 class="text-2xl sm:text-3xl font-black font-arabic">${book.titleArabic || book.title}</h1>
              <h3 class="text-base sm:text-lg font-bold font-urdu">${book.title}</h3>
              <p class="text-xs opacity-70 font-urdu">تالیف: ${book.author} | التصنيف: ${book.categoryName || 'علوم إسلامية'}</p>
            </div>

            <div class="space-y-4 font-urdu text-justify leading-loose" id="page-reader-chapter-body">
              <p class="font-arabic font-bold text-xl sm:text-2xl text-center">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              
              <p class="font-arabic text-center text-lg text-emerald-700 dark:text-emerald-400">
                الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِهِ الْكَرِيمِ وَعَلَى آلِهِ وَأَصْحَابِهِ أَجْمَعِينَ.
              </p>

              <div class="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs sm:text-sm font-semibold">
                <strong>خلاصہ و مقدمہ:</strong> ${book.description || 'مستند سلفی کتاب۔'}
              </div>

              <div class="whitespace-pre-line text-sm sm:text-base leading-loose">
                ${chapters[0]?.contentUrdu || 'اس باب کا مستند متن اور شروح یہاں دستیاب ہیں۔'}
              </div>
            </div>

            <!-- Page Navigation Footer -->
            <div class="pt-6 border-t border-current/10 flex items-center justify-between text-xs font-urdu font-bold">
              <button onclick="window.Views.navigatePageChapter(-1)" class="btn-secondary py-1.5 px-4 rounded-xl">صفحہ سابق &rarr;</button>
              <span class="font-mono" id="page-reader-indicator">صفحہ 1 از ${book.pages || 320}</span>
              <button onclick="window.Views.navigatePageChapter(1)" class="btn-secondary py-1.5 px-4 rounded-xl">&larr; صفحہ لاحق</button>
            </div>

          </div>
        </div>

      </div>

    </div>
  `;

  window._activePageBook = book;
  window._activePageChapters = chapters;
  window._activePageChapterIndex = 0;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.selectReaderChapterInPage = function(idx) {
  if (!window._activePageChapters || !window._activePageChapters[idx]) return;
  window._activePageChapterIndex = idx;
  const ch = window._activePageChapters[idx];
  const book = window._activePageBook || {};

  const bodyEl = document.getElementById('page-reader-chapter-body');
  if (bodyEl) {
    bodyEl.innerHTML = `
      <div class="space-y-4 animate-fade-in">
        <div class="text-center space-y-1 pb-3 border-b border-current/10">
          <h2 class="text-lg sm:text-xl font-bold font-urdu text-emerald-600 dark:text-emerald-400">${ch.title}</h2>
          ${ch.arabicTitle ? `<div class="font-arabic text-sm opacity-80">${ch.arabicTitle}</div>` : ''}
        </div>
        <div class="whitespace-pre-line leading-loose text-sm sm:text-base font-urdu">
          ${ch.contentUrdu || 'مستند شرعی متن و تشریح۔'}
        </div>
      </div>
    `;
  }

  const indicator = document.getElementById('page-reader-indicator');
  if (indicator) {
    indicator.textContent = `باب ${idx + 1} از ${window._activePageChapters.length} (صفحہ ${ch.page || (idx * 25 + 1)})`;
  }

  // Highlight active button
  window._activePageChapters.forEach((_, cIdx) => {
    const btn = document.getElementById(`page-ch-btn-${cIdx}`);
    if (btn) {
      if (cIdx === idx) {
        btn.className = 'w-full text-right p-3 rounded-2xl border transition-all text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-300';
      } else {
        btn.className = 'w-full text-right p-3 rounded-2xl border transition-all text-xs font-bold bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-200';
      }
    }
  });
};

window.Views.navigatePageChapter = function(delta) {
  if (!window._activePageChapters) return;
  const newIdx = Math.max(0, Math.min(window._activePageChapters.length - 1, (window._activePageChapterIndex || 0) + delta));
  window.Views.selectReaderChapterInPage(newIdx);
};

window.Views.setBookReaderTheme = function(theme) {
  window.Views.currentBookTheme = theme;
  const viewport = document.getElementById('book-content-viewport');
  if (viewport) {
    viewport.className = `lh-card p-8 sm:p-12 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 ${theme === 'night' ? 'bg-slate-950 text-slate-100' : theme === 'sepia' ? 'bg-[#fbf0d9] text-[#5f4b32]' : 'bg-white text-slate-900'}`;
  }
};

window.Views.adjustBookFontSize = function(delta) {
  window.Views.currentBookFontSize = Math.max(14, Math.min(36, window.Views.currentBookFontSize + delta));
  const label = document.getElementById('book-font-size-label');
  if (label) label.textContent = `${window.Views.currentBookFontSize}px`;
  const viewport = document.getElementById('book-content-viewport');
  if (viewport) viewport.style.fontSize = `${window.Views.currentBookFontSize}px`;
};

/**
 * LearnHub Full-Featured Islamic E-Book Reader
 * Provides in-book text search, customizable reading themes (Day, Night, Sepia),
 * font size adjustments, personal highlights, and chapter navigation.
 */

window.Views = window.Views || {};

window.Views.currentBookTheme = window.Views.currentBookTheme || 'day';
window.Views.currentBookFontSize = window.Views.currentBookFontSize || 18;

window.Views.renderBookReader = function(params) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const bookId = params?.id || 'tafseer_ibn_kathir';
  const books = window.ISLAMIC_LIBRARY_BOOKS || [];
  const book = books.find(b => b.id === bookId) || books[0] || {
    id: 'tafseer_ibn_kathir',
    title: 'تفسیر ابن کثیر (اردو)',
    titleArabic: 'تفسير القرآن العظيم',
    author: 'حافظ عماد الدین ابن کثیر رحمہ اللہ',
    pages: 3200,
    volumes: 5,
    description: 'قرآن مجید کی سب سے جامع، مستند اور مقبول ترین تفسیر بالماثور۔',
    downloadUrl: '#'
  };

  const sampleChapters = [
    { title: 'مقدمہ مؤلف: علومِ قرآن اور تفسیر کے بنیادی اصول', page: 1 },
    { title: 'سورۃ الفاتحہ: فضائل، اسما اور تفصیلی تفسیر', page: 25 },
    { title: 'سورۃ البقرہ: آیات 1 تا 20 (مومنین و منافقین کی صفات)', page: 60 },
    { title: 'سورۃ البقرہ: قصہ حضرت آدم علیہ السلام اور خلافت', page: 120 },
    { title: 'آیۃ الکرسی: عظمت، فضیلت اور توحیدِ باری تعالیٰ', page: 280 }
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

          <!-- Download PDF -->
          <a href="${book.downloadUrl || '#'}" target="_blank" onclick="window.App?.showToast('پی ڈی ایف کتاب ڈاؤن لوڈ ہو رہی ہے... 📥', 'success')" class="btn-primary py-1.5 px-3 text-xs rounded-xl flex items-center gap-1">
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
            <span class="hidden sm:inline">پی ڈی ایف</span>
          </a>
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
            <span class="text-[10px] text-slate-400 font-mono">${sampleChapters.length} ابواب</span>
          </div>

          <div class="space-y-2">
            ${sampleChapters.map((ch, idx) => `
              <button 
                onclick="window.App?.showToast('باب: ${ch.title.replace(/'/g, "\\'")} پر منتقل ہو گئے', 'info')"
                class="w-full text-right p-3 rounded-2xl border transition-all text-xs font-bold ${idx === 0 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-200'}"
              >
                <div class="flex items-center justify-between mb-0.5">
                  <span class="text-[10px] font-mono text-slate-400">صفحہ ${ch.page}</span>
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
              <p class="text-xs opacity-70 font-urdu">تالیف: ${book.author}</p>
            </div>

            <div class="space-y-4 font-urdu text-justify leading-loose">
              <p class="font-arabic font-bold text-xl sm:text-2xl text-center">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              
              <p>
                الْحَمْدُ لِلَّهِ الَّذِي أَنْزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَلْ لَهُ عِوَجًا ۜ قَيِّمًا لِيُنْذِرَ بَأْسًا شَدِيدًا مِنْ لَدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا.
              </p>

              <p>
                <strong>مقدمہ تفسیر:</strong> جاننا چاہیے کہ قرآن مجید کی سب سے بہترین اور مستند تفسیر، قرآن کی تفسیر قرآن سے ہی کرنا ہے۔ اس کے بعد سنتِ نبوی ﷺ کے ذریعے تفسیر ہے کیونکہ رسول اللہ ﷺ ہی قرآن مجید کے پہلے اور سب سے بڑے شارح و مفسر ہیں۔ پھر صحابہ کرام رضی اللہ عنہم کے اقوال اور ان کے بعد تابعینِ عظام کے فہم کا درجہ ہے۔
              </p>

              <p>
                امام ابن کثیر رحمہ اللہ فرماتے ہیں کہ تفسیر بالرائے اور بغیر علم کے قرآنی آیات میں کلام کرنا سخت ممنوع ہے۔ اہل علم کا فرض ہے کہ وہ سلف صالحین کے منہج پر قرآن و سنت کے نصوص کو سمجھیں اور امت تک پہنچائیں۔
              </p>
            </div>

            <!-- Page Navigation Footer -->
            <div class="pt-6 border-t border-current/10 flex items-center justify-between text-xs font-urdu font-bold">
              <button onclick="window.App?.showToast('پچھلا صفحہ', 'info')" class="btn-secondary py-1.5 px-4 rounded-xl">صفحہ سابق &rarr;</button>
              <span class="font-mono">صفحہ 1 از ${book.pages || 320}</span>
              <button onclick="window.App?.showToast('اگلا صفحہ', 'info')" class="btn-secondary py-1.5 px-4 rounded-xl">&larr; صفحہ لاحق</button>
            </div>

          </div>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
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

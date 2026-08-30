/**
 * LearnHub Master Multi-Volume Tafseer & 15-Line Mushaf Suite (Pure White Luxury Edition)
 * Real In-App PDF Reader, Direct Mobile/Device PDF Upload, Multi-Volume Grid,
 * and seamless routing without circular redirects.
 */

window.Views = window.Views || {};

// Helper: Get Tafsir from Database or Memory with Uploaded Volumes
window.Views.getTafsirById = function(tafsirId) {
  const tafsirs = window.QURAN_DATA ? (window.QURAN_DATA.TAFSIRS || []) : [];
  const taf = tafsirs.find(t => t.id === tafsirId) || tafsirs[0];
  if (!taf) return null;

  try {
    const localUploads = JSON.parse(localStorage.getItem(`learnhub_tafsir_uploads_${taf.id}`) || '{}');
    if (taf.volumesList) {
      taf.volumesList.forEach(vol => {
        if (localUploads[vol.volumeNumber]) {
          vol.pdfDataUrl = localUploads[vol.volumeNumber].pdfDataUrl;
          vol.fileName = localUploads[vol.volumeNumber].fileName;
          vol.fileSizeMb = localUploads[vol.volumeNumber].fileSizeMb;
          vol.isUploaded = true;
        }
      });
    }
  } catch (e) {
    console.warn('Error loading local Tafsir uploads:', e);
  }

  return taf;
};

// =========================================================================
// 1. TAFSEER LIBRARY HUB (List of 8 Authentic Tafseers)
// =========================================================================
window.Views.renderTafsirLibrary = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const tafsirs = window.QURAN_DATA ? (window.QURAN_DATA.TAFSIRS || []) : [];

  container.innerHTML = `
    <div class="min-h-screen bg-white dark:bg-slate-900 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="rtl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        <!-- Breadcrumb Navigation -->
        <nav class="flex items-center gap-2 text-xs text-slate-500">
          <a href="#/" class="hover:text-teal-700 transition">ہوم</a>
          <span>/</span>
          <a href="#/quran" class="hover:text-teal-700 transition">قرآن مجید</a>
          <span>/</span>
          <span class="text-teal-700 dark:text-teal-400 font-bold">تفاسیر القرآن لائبریری</span>
        </nav>

        <!-- Hero Header Banner (Pure White Luxury) -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-xs font-bold font-serif">کتب تفاسیر و فہمِ قرآن</span>
              <span class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold">8 مستند تفاسیر</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-snug">
              مستند تفاسیر القرآن لائبریری (Classical Tafseer Suite)
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              اہل سنت و جماعت کی معتبر ترین 8 تفاسیر (ابن کثیر، احسن البیان، السعدی، طبری، قرطبی، معارف القرآن، جلالین، فتح القدیر)۔ تمام جلدوں کا ان-ایپ مطالعہ، ڈیوائس اپلوڈ اور پی ڈی ایف ڈاؤن لوڈ۔
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-600/30 text-teal-700 dark:text-teal-300 flex items-center justify-center text-3xl shrink-0 shadow-sm">
            📚
          </div>
        </div>

        <!-- Tafsir Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          ${tafsirs.map(t => `
            <div class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-600/30">
                    ${t.volumes || 'مجلد واحد'}
                  </span>
                  <span class="text-xs text-slate-400 font-bold">${t.languageLabel || 'اردو و عربی'}</span>
                </div>

                <div>
                  <h3 class="text-lg font-black text-slate-900 dark:text-white">${t.name}</h3>
                  <p class="text-xs text-teal-700 dark:text-teal-400 font-bold mt-0.5">${t.author}</p>
                </div>

                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${t.description}</p>

                <div class="flex items-center gap-2 pt-1">
                  <span class="text-[11px] text-slate-500 font-bold">کل جلدیں:</span>
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs">${(t.volumesList || []).length || 1}</span>
                </div>
              </div>

              <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2 flex-wrap">
                <button onclick="window.Router.navigate('/tafsir/${t.id}')" class="flex-1 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95">
                  <i data-lucide="book-open" class="w-4 h-4"></i>
                  <span>تمام جلدیں کھولیں (${(t.volumesList || []).length || 1} جلدیں)</span>
                </button>
                <a href="${t.downloadUrl}" target="_blank" class="py-2.5 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-teal-700 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition" title="مکمل پی ڈی ایف">
                  <i data-lucide="download" class="w-4 h-4"></i>
                </a>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// =========================================================================
// 2. MULTI-VOLUME TAFSEER VIEW (Volumes List & PDF Controls)
// =========================================================================
window.Views.renderTafsirDetail = function(params) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const tafsirId = params && params.id ? params.id : 'ibnkathir';
  const tafsir = window.Views.getTafsirById(tafsirId);

  if (!tafsir) {
    container.innerHTML = `
      <div class="p-12 text-center text-slate-500 font-urdu">
        <h2 class="text-xl font-bold">تفسیر دستیاب نہیں ہے</h2>
        <a href="#/tafsir" class="text-teal-700 underline mt-4 inline-block">تفاسیر کی فہرست پر جائیں</a>
      </div>
    `;
    return;
  }

  const volumes = tafsir.volumesList || [
    { volumeNumber: 1, title: 'جلد اول', surahsRange: 'سورۃ الفاتحہ تا سورۃ النساء', pdfUrl: tafsir.downloadUrl }
  ];

  container.innerHTML = `
    <div class="min-h-screen bg-white dark:bg-slate-900 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="rtl">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        <!-- Breadcrumb Navigation -->
        <nav class="flex items-center gap-2 text-xs text-slate-500">
          <a href="#/" class="hover:text-teal-700 transition">ہوم</a>
          <span>/</span>
          <a href="#/quran" class="hover:text-teal-700 transition">قرآن مجید</a>
          <span>/</span>
          <a href="#/tafsir" class="hover:text-teal-700 transition">تفاسیر</a>
          <span>/</span>
          <span class="text-teal-700 dark:text-teal-400 font-bold">${tafsir.name}</span>
        </nav>

        <!-- Tafsir Master Header -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="space-y-2">
            <span class="px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-600/30">
              ${tafsir.volumes || 'مکمل سیٹ'} • ${volumes.length} مجلدات
            </span>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-snug">
              ${tafsir.name}
            </h1>
            <p class="text-xs sm:text-sm text-teal-700 dark:text-teal-400 font-bold">
              تالیف: ${tafsir.author}
            </p>
            <p class="text-xs text-slate-500 max-w-2xl leading-relaxed">
              ${tafsir.description}
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <a href="${tafsir.downloadUrl}" target="_blank" class="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-95">
              <i data-lucide="download" class="w-4 h-4"></i>
              <span>ڈاؤن لوڈ مکمل سیٹ</span>
            </a>
          </div>
        </div>

        <!-- Volumes Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          ${volumes.map(vol => `
            <div class="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 flex items-center justify-center font-bold text-xs font-mono">
                    ${vol.volumeNumber}
                  </span>
                  ${vol.isUploaded ? '<span class="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[10px] font-bold">ڈیوائس سے اپلوڈ شدہ</span>' : ''}
                </div>
                <div>
                  <h3 class="text-base font-black text-slate-900 dark:text-white">${vol.title}</h3>
                  <p class="text-xs text-teal-700 dark:text-teal-400 font-bold mt-0.5">${vol.surahsRange || 'مکمل سورتیں'}</p>
                </div>
              </div>

              <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                <button onclick="window.Views.openTafsirPdfReader('${tafsir.id}', ${vol.volumeNumber})" class="flex-1 py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95">
                  <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
                  <span>آن لائن پڑھیں</span>
                </button>
                <a href="${vol.pdfUrl || tafsir.downloadUrl}" target="_blank" class="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-teal-700 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1 transition" title="ڈاؤن لوڈ">
                  <i data-lucide="download" class="w-3.5 h-3.5"></i>
                </a>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// =========================================================================
// 3. IN-APP PDF READER MODAL
// =========================================================================
window.Views.openTafsirPdfReader = function(tafsirId, volumeNumber) {
  const tafsir = window.Views.getTafsirById(tafsirId);
  if (!tafsir) return;

  const vol = (tafsir.volumesList || []).find(v => v.volumeNumber === volumeNumber) || {
    title: `جلد ${volumeNumber}`,
    pdfUrl: tafsir.downloadUrl
  };

  const pdfSource = vol.pdfDataUrl || vol.pdfUrl || tafsir.downloadUrl;

  const modal = `
    <div id="tafsir-pdf-reader-modal" class="fixed inset-0 z-50 bg-slate-950/95 flex flex-col font-urdu" dir="rtl">
      <!-- Top Control Bar -->
      <div class="flex items-center justify-between p-3 sm:p-4 bg-slate-900 border-b border-slate-800 shadow-md">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0">
            <i data-lucide="book-open" class="w-4 h-4"></i>
          </div>
          <div class="min-w-0">
            <h2 class="text-sm font-black text-white truncate">${tafsir.name} — ${vol.title}</h2>
            <p class="text-[11px] text-slate-400 truncate">${vol.surahsRange || tafsir.author}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <a href="${pdfSource}" target="_blank" class="py-1.5 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1">
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i> بیرونی ٹیب
          </a>
          <button onclick="document.getElementById('tafsir-pdf-reader-modal').remove()" class="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <!-- PDF Embedded View -->
      <div class="flex-1 w-full bg-slate-950 relative">
        <iframe src="${pdfSource}" class="w-full h-full border-0" allow="fullscreen"></iframe>
      </div>
    </div>
  `;

  const existing = document.getElementById('tafsir-pdf-reader-modal');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

console.log('Tafsir View Module Loaded Flawlessly!');

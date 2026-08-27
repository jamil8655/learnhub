/**
 * LearnHub Master Multi-Volume Tafseer & 15-Line Mushaf Suite
 * Real In-App PDF Reader, Direct Mobile/Device PDF Upload, Multi-Volume Grid,
 * and seamless routing without circular redirects.
 */

window.Views = window.Views || {};

// Helper: Get Tafsir from Database or Memory with Uploaded Volumes
window.Views.getTafsirById = function(tafsirId) {
  const tafsirs = window.QURAN_DATA ? (window.QURAN_DATA.TAFSIRS || []) : [];
  const taf = tafsirs.find(t => t.id === tafsirId) || tafsirs[0];
  if (!taf) return null;

  // Check if there are locally uploaded PDFs for this Tafsir in localStorage
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
    <div class="space-y-6 sm:space-y-8 p-3 sm:p-6 lg:p-8 font-urdu" dir="rtl">
      
      <!-- Breadcrumb Navigation -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a href="#/" class="hover:text-emerald-600 transition">ہوم</a>
        <span>/</span>
        <a href="#/quran" class="hover:text-emerald-600 transition">قرآن مجید</a>
        <span>/</span>
        <span class="text-emerald-600 dark:text-emerald-400 font-bold">تفاسیر القرآن لائبریری</span>
      </nav>

      <!-- Hero Header Banner -->
      <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-2 border-emerald-500/40 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div class="space-y-2 z-10">
          <div class="flex items-center gap-2">
            <span class="badge bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs">کتب تفاسیر و فہمِ قرآن</span>
            <span class="badge bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold text-xs">8 مستند تفاسیر</span>
          </div>
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            مستند تفاسیر القرآن لائبریری (Classical Tafseer Suite)
          </h1>
          <p class="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-2xl">
            اہل سنت و جماعت کی معتبر ترین 8 تفاسیر (ابن کثیر، احسن البیان، السعدی، طبری، قرطبی، معارف القرآن، جلالین، فتح القدیر)۔ تمام جلدوں کا ان-ایپ مطالعہ، ڈیوائس اپلوڈ اور پی ڈی ایف ڈاؤن لوڈ۔
          </p>
        </div>
        <div class="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-400/40 text-amber-400 flex items-center justify-center text-4xl shrink-0 shadow-xl z-10">
          📚
        </div>
      </div>

      <!-- Tafsir Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        ${tafsirs.map(t => `
          <div class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 hover:shadow-xl transition flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  ${t.volumes || 'مجلد واحد'}
                </span>
                <span class="text-xs text-slate-400 font-bold">${t.languageLabel || 'اردو و عربی'}</span>
              </div>

              <div>
                <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">${t.name}</h3>
                <p class="text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5">${t.author}</p>
              </div>

              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${t.description}</p>

              <div class="flex items-center gap-2 pt-1">
                <span class="text-[11px] text-slate-500 font-bold">کل جلدیں:</span>
                <span class="badge bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs">${(t.volumesList || []).length || 1}</span>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
              <button onclick="window.Router.navigate('/tafsir/${t.id}')" class="btn-primary flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md">
                <i data-lucide="book-open" class="w-4 h-4"></i>
                <span>تمام جلدیں کھولیں (${(t.volumesList || []).length || 1} جلدیں)</span>
              </button>
              <a href="${t.downloadUrl}" target="_blank" class="py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition" title="مکمل تفسیر ڈاؤن لوڈ کریں">
                <i data-lucide="download" class="w-3.5 h-3.5"></i>
              </a>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// =========================================================================
// 2. TAFSEER MULTI-VOLUME DETAIL VIEW (e.g. Tafseer Ibn Kathir Volumes 1-8)
// =========================================================================
window.Views.renderTafsirDetail = function(tafsirId) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const tafsir = window.Views.getTafsirById(tafsirId);
  if (!tafsir) {
    window.Views.renderTafsirLibrary();
    return;
  }

  const volumes = tafsir.volumesList || [
    { volumeNumber: 1, title: 'مجلد اول (مکمل)', surahRange: '1 تا 114', pages: 'مکمل', pdfUrl: tafsir.downloadUrl }
  ];

  container.innerHTML = `
    <div class="space-y-6 sm:space-y-8 p-3 sm:p-6 lg:p-8 font-urdu" dir="rtl">
      
      <!-- Breadcrumb Navigation -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a href="#/" class="hover:text-emerald-600 transition">ہوم</a>
        <span>/</span>
        <a href="#/quran" class="hover:text-emerald-600 transition">قرآن مجید</a>
        <span>/</span>
        <a href="#/tafsir" class="hover:text-emerald-600 transition">تفاسیر لائبریری</a>
        <span>/</span>
        <span class="text-emerald-600 dark:text-emerald-400 font-bold">${tafsir.name}</span>
      </nav>

      <!-- Tafsir Hero Details -->
      <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/30 shadow-xl space-y-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">مستند تفسیر</span>
              <span class="badge bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">${tafsir.volumes || 'مجلدات'}</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              ${tafsir.name}
            </h1>
            <p class="text-xs sm:text-sm text-amber-700 dark:text-amber-400 font-bold">
              مؤلف: ${tafsir.author}
            </p>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <a href="${tafsir.downloadUrl}" target="_blank" class="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md">
              <i data-lucide="download" class="w-4 h-4"></i>
              <span>مکمل پی ڈی ایف ڈاؤن لوڈ</span>
            </a>
          </div>
        </div>

        <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          ${tafsir.description}
        </p>
      </div>

      <!-- Volumes Grid Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div>
          <h2 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>تمام مجلدات و جلدیں (${volumes.length} جلدیں دستیاب)</span>
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            ہر جلد کا ان-ایپ آن لائن مطالعہ فرمائیں یا اپنے موبائل / کمپیوٹر سے پی ڈی ایف فائل اپلوڈ کریں۔
          </p>
        </div>
      </div>

      <!-- Volumes Grid Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        ${volumes.map(v => {
          const hasUploadedPdf = Boolean(v.pdfDataUrl);
          return `
            <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 ${hasUploadedPdf ? 'border-emerald-500/50 bg-emerald-50/10' : 'border-slate-200 dark:border-slate-800'} shadow-sm hover:shadow-xl transition flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-sm font-mono">
                    ${v.volumeNumber}
                  </span>
                  ${hasUploadedPdf ? `
                    <span class="badge bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                      <i data-lucide="check-circle" class="w-3 h-3 text-emerald-500"></i>
                      <span>ڈیوائس سے اپلوڈ شدہ</span>
                    </span>
                  ` : `
                    <span class="badge bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[10px]">
                      ${v.pages || 'صفحات'}
                    </span>
                  `}
                </div>

                <div>
                  <h3 class="text-base font-black text-slate-900 dark:text-white">${v.title}</h3>
                  <p class="text-xs text-slate-500 mt-0.5">سورتیں: ${v.surahRange || 'مکمل'}</p>
                </div>

                ${v.fileName ? `
                  <p class="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono truncate">
                    📄 ${v.fileName} (${v.fileSizeMb || ''})
                  </p>
                ` : ''}
              </div>

              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <button onclick="window.Views.openTafsirVolumeReader('${tafsir.id}', ${v.volumeNumber})" class="btn-primary flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md">
                    <i data-lucide="book-open" class="w-4 h-4"></i>
                    <span>آن لائن مطالعہ (ریڈر)</span>
                  </button>
                  <a href="${v.pdfDataUrl || v.pdfUrl || tafsir.downloadUrl}" download="${tafsir.id}_vol_${v.volumeNumber}.pdf" target="_blank" class="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1 transition" title="ڈاؤن لوڈ">
                    <i data-lucide="download" class="w-3.5 h-3.5"></i>
                  </a>
                </div>

                <!-- Admin Device Upload Button -->
                <button onclick="window.Views.openUploadTafsirVolumeModal('${tafsir.id}', ${v.volumeNumber})" class="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-700 dark:text-amber-300 hover:text-slate-950 font-bold text-[11px] border border-amber-400/30 flex items-center justify-center gap-1.5 transition">
                  <i data-lucide="upload-cloud" class="w-3.5 h-3.5"></i>
                  <span>${hasUploadedPdf ? 'تبدیل کریں (ڈیوائس سے نیا PDF اپلوڈ)' : 'ڈیوائس سے پی ڈی ایف اپلوڈ کریں'}</span>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// =========================================================================
// 3. IN-APP PDF READER MODAL (Fullscreen & Responsive)
// =========================================================================
window.Views.openTafsirVolumeReader = function(tafsirId, volumeNumber) {
  const tafsir = window.Views.getTafsirById(tafsirId);
  if (!tafsir) return;

  const volumes = tafsir.volumesList || [];
  const volume = volumes.find(v => v.volumeNumber === volumeNumber) || volumes[0] || {
    title: tafsir.name,
    pdfUrl: tafsir.downloadUrl
  };

  const pdfSource = volume.pdfDataUrl || volume.pdfUrl || tafsir.downloadUrl;

  const modal = `
    <div id="tafsir-pdf-reader-modal" class="fixed inset-0 z-50 bg-slate-950/95 flex flex-col font-urdu" dir="rtl">
      <!-- Top Reader Header Bar -->
      <div class="flex items-center justify-between p-3 sm:p-4 bg-slate-900 border-b border-slate-800 shadow-xl shrink-0">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <i data-lucide="book-open" class="w-5 h-5"></i>
          </div>
          <div class="min-w-0">
            <h2 class="text-sm sm:text-base font-black text-white truncate">${tafsir.name} — ${volume.title}</h2>
            <p class="text-[11px] text-amber-400 truncate">${tafsir.author}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <a href="${pdfSource}" download="${tafsir.id}_vol_${volumeNumber}.pdf" target="_blank" class="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow">
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
            <span class="hidden sm:inline">ڈاؤن لوڈ PDF</span>
          </a>
          <button onclick="document.getElementById('tafsir-pdf-reader-modal').remove()" class="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
      </div>

      <!-- Reader Body Container -->
      <div class="flex-1 w-full h-full bg-slate-900 relative overflow-hidden flex items-center justify-center">
        <iframe 
          src="${pdfSource}" 
          class="w-full h-full border-none" 
          title="Tafseer PDF Reader"
          style="min-height: 85vh;"
        ></iframe>
      </div>
    </div>
  `;

  const existing = document.getElementById('tafsir-pdf-reader-modal');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

// =========================================================================
// 4. DEVICE PDF UPLOADER MODAL (From Mobile or Computer)
// =========================================================================
window.Views.openUploadTafsirVolumeModal = function(tafsirId, volumeNumber) {
  const tafsir = window.Views.getTafsirById(tafsirId);
  if (!tafsir) return;

  const volumes = tafsir.volumesList || [];
  const volume = volumes.find(v => v.volumeNumber === volumeNumber) || { title: `جلد ${volumeNumber}` };

  const modal = `
    <div id="upload-tafsir-volume-modal" class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-emerald-500/40 shadow-2xl space-y-4">
        
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 class="text-base font-black text-slate-900 dark:text-white">ڈیوائس سے پی ڈی ایف فائل اپلوڈ کریں</h3>
            <p class="text-xs text-amber-600 dark:text-amber-400 font-bold">${tafsir.name} — ${volume.title}</p>
          </div>
          <button onclick="document.getElementById('upload-tafsir-volume-modal').remove()" class="p-1 text-slate-400"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <p class="text-slate-600 dark:text-slate-300">
            اپنے موبائل یا کمپیوٹر سے اس جلد کی مکمل پی ڈی ایف (PDF) فائل منتخب فرمائیں۔ یہ فائل براہِ راست محفوظ ہو جائے گی اور قارئین ایپ میں پڑھ سکیں گے۔
          </p>

          <!-- File Input -->
          <div class="p-4 rounded-2xl border-2 border-dashed border-emerald-400/50 bg-emerald-50/20 dark:bg-emerald-950/20 text-center space-y-2">
            <i data-lucide="upload-cloud" class="w-8 h-8 text-emerald-600 mx-auto"></i>
            <label class="block font-bold text-slate-800 dark:text-slate-200">فائل منتخب کریں (PDF):</label>
            <input 
              type="file" 
              id="tafsir-vol-file-input" 
              accept="application/pdf" 
              class="w-full text-xs font-sans text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer" 
              onchange="window.Views._onTafsirFileSelected(this)"
            />
            <div id="file-info-preview" class="hidden text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold pt-1"></div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button onclick="document.getElementById('upload-tafsir-volume-modal').remove()" class="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">منسوخ</button>
          <button onclick="window.Views.saveUploadedTafsirVolume('${tafsir.id}', ${volumeNumber})" class="btn-primary py-2 px-6 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500">اپلوڈ و محفوظ کریں</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

window.Views._pendingTafsirFile = null;

window.Views._onTafsirFileSelected = function(input) {
  const file = input.files && input.files[0];
  const infoEl = document.getElementById('file-info-preview');
  if (!file) return;

  const sizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
  window.Views._pendingTafsirFile = file;

  if (infoEl) {
    infoEl.textContent = `✓ منتخب شدہ: ${file.name} (${sizeMb})`;
    infoEl.classList.remove('hidden');
  }
};

window.Views.saveUploadedTafsirVolume = function(tafsirId, volumeNumber) {
  const file = window.Views._pendingTafsirFile;
  if (!file) {
    window.App?.showToast('براہ کرم پی ڈی ایف فائل منتخب فرمائیں', 'warning');
    return;
  }

  window.App?.showToast('فائل محفوظ کی جا رہی ہے، براہ کرم انتظار فرمائیں...', 'info');

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    try {
      const storageKey = `learnhub_tafsir_uploads_${tafsirId}`;
      const uploads = JSON.parse(localStorage.getItem(storageKey) || '{}');
      uploads[volumeNumber] = {
        pdfDataUrl: dataUrl,
        fileName: file.name,
        fileSizeMb: sizeMb,
        uploadedAt: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(uploads));

      window.App?.showToast(`🎉 ماشاء اللہ! ${file.name} کامیابی سے اپلوڈ ہو چکی ہے۔`, 'success');
      document.getElementById('upload-tafsir-volume-modal')?.remove();
      window.Views.renderTafsirDetail(tafsirId);
    } catch(err) {
      window.App?.showToast('اپلوڈ میں مسئلہ: ' + err.message, 'danger');
    }
  };

  reader.readAsDataURL(file);
};

// =========================================================================
// 5. 15-LINE MUSHAF IN-APP READER & UPLOAD SUITE
// =========================================================================
window.Views.render15LineMushafReader = function(editionId) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const editions = window.QURAN_DATA ? (window.QURAN_DATA.MUSHAF_EDITIONS || []) : [];
  const selectedEd = editions.find(e => e.id === editionId) || editions[0] || {};

  // Check locally uploaded Mushaf PDF
  const localMushafPdf = localStorage.getItem(`learnhub_mushaf_pdf_${selectedEd.id || 'pak_15line'}`);
  const pdfSource = localMushafPdf || selectedEd.downloadUrl || 'https://archive.org/download/quran-15-lines-pakistani/Quran-15-Lines.pdf';

  container.innerHTML = `
    <div class="space-y-6 p-3 sm:p-6 lg:p-8 font-urdu" dir="rtl">
      
      <!-- Breadcrumb Navigation -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a href="#/" class="hover:text-emerald-600 transition">ہوم</a>
        <span>/</span>
        <a href="#/quran" class="hover:text-emerald-600 transition">قرآن مجید</a>
        <span>/</span>
        <span class="text-emerald-600 dark:text-emerald-400 font-bold">${selectedEd.title}</span>
      </nav>

      <!-- Mushaf Header Bar -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div class="flex items-center gap-2">
            <span class="badge bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">15 سطری مصحف</span>
            <span class="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">${selectedEd.totalPages || 611} صفحات</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            ${selectedEd.title}
          </h1>
          <p class="text-xs text-slate-500">${selectedEd.publisher} • ${selectedEd.script}</p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <button onclick="window.Views.openUploadMushafModal('${selectedEd.id}')" class="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md">
            <i data-lucide="upload" class="w-4 h-4"></i>
            <span>ڈیوائس سے نیا مصحف اپلوڈ کریں</span>
          </button>
          <a href="${pdfSource}" download="mushaf_15_lines.pdf" target="_blank" class="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md">
            <i data-lucide="download" class="w-4 h-4"></i>
            <span>ڈاؤن لوڈ PDF</span>
          </a>
        </div>
      </div>

      <!-- In-App Embedded Full Viewer -->
      <div class="w-full rounded-3xl bg-slate-950 border-2 border-amber-400/40 shadow-2xl overflow-hidden" style="min-height: 80vh;">
        <iframe 
          src="${pdfSource}" 
          class="w-full border-none" 
          title="15 Line Mushaf Reader"
          style="min-height: 80vh; height: 100%;"
        ></iframe>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.openUploadMushafModal = function(editionId) {
  const modal = `
    <div id="upload-mushaf-modal" class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-amber-400/40 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 class="text-base font-black text-slate-900 dark:text-white">ڈیوائس سے 15 سطری مصحف اپلوڈ کریں</h3>
          <button onclick="document.getElementById('upload-mushaf-modal').remove()" class="p-1 text-slate-400"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <p class="text-slate-600 dark:text-slate-300">
            اپنے موبائل یا کمپیوٹر سے مکمل 15 سطری قرآنی مصحف کی پی ڈی ایف فائل منتخب فرمائیں۔
          </p>

          <div class="p-4 rounded-2xl border-2 border-dashed border-amber-400/50 bg-amber-50/20 text-center space-y-2">
            <i data-lucide="upload-cloud" class="w-8 h-8 text-amber-600 mx-auto"></i>
            <label class="block font-bold text-slate-800 dark:text-slate-200">فائل منتخب کریں (PDF):</label>
            <input 
              type="file" 
              id="mushaf-file-input" 
              accept="application/pdf" 
              class="w-full text-xs font-sans text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer" 
              onchange="window.Views._onMushafFileSelected(this)"
            />
            <div id="mushaf-info-preview" class="hidden text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold pt-1"></div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button onclick="document.getElementById('upload-mushaf-modal').remove()" class="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">منسوخ</button>
          <button onclick="window.Views.saveUploadedMushaf('${editionId}')" class="btn-primary py-2 px-6 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950">محفوظ کریں</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

window.Views._pendingMushafFile = null;

window.Views._onMushafFileSelected = function(input) {
  const file = input.files && input.files[0];
  const infoEl = document.getElementById('mushaf-info-preview');
  if (!file) return;

  const sizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
  window.Views._pendingMushafFile = file;

  if (infoEl) {
    infoEl.textContent = `✓ منتخب شدہ: ${file.name} (${sizeMb})`;
    infoEl.classList.remove('hidden');
  }
};

window.Views.saveUploadedMushaf = function(editionId) {
  const file = window.Views._pendingMushafFile;
  if (!file) {
    window.App?.showToast('براہ کرم پی ڈی ایف فائل منتخب فرمائیں', 'warning');
    return;
  }

  window.App?.showToast('مصحف محفوظ کیا جا رہا ہے...', 'info');

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    try {
      localStorage.setItem(`learnhub_mushaf_pdf_${editionId || 'pak_15line'}`, dataUrl);
      window.App?.showToast('🎉 ماشاء اللہ! 15 سطری مصحف کامیابی سے اپلوڈ ہو چکا ہے۔', 'success');
      document.getElementById('upload-mushaf-modal')?.remove();
      window.Views.render15LineMushafReader(editionId);
    } catch(err) {
      window.App?.showToast('اپلوڈ میں مسئلہ: ' + err.message, 'danger');
    }
  };

  reader.readAsDataURL(file);
};

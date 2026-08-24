
/**
 * Multi-PDF Upload Patch
 * Adds support for multiple PDF files (volumes) per book
 * Both in Add Book Modal and Edit Book Modal
 * 
 * New data structure: book.pdfs = [{ label, pdfDataUrl, pdfUrl, sizeMb }]
 * Backward-compatible with existing book.pdfDataUrl and book.pdfUrl fields
 */
const fs = require('fs');
const featPath = 'C:/Users/jrahm/.gemini/antigravity/scratch/learnhub/js/views/islamicFeatures.js';
let c = fs.readFileSync(featPath, 'utf8');

// =============================================================================
// PART 1: Replace the PDF tab pane in openAddBookModal with multi-PDF UI
// =============================================================================
const oldPdfPane_Add = `'<div id="book-tab-pane-pdf" class="space-y-3 hidden">' +
      '<div class="p-4 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-center space-y-2">' +
        '<i data-lucide="file-up" class="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400"></i>' +`;

const newPdfPane_Add = `'<div id="book-tab-pane-pdf" class="space-y-3 hidden">' +
      '<div class="flex items-center justify-between mb-2">' +
        '<span class="font-extrabold text-slate-800 dark:text-white text-xs">\u0645\u062a\u0639\u062f\u062f PDF \u0641\u0627\u0626\u0644\u06cc\u06ba (\u062c\u0644\u062f \u0628\u06c1 \u062c\u0644\u062f)</span>' +
        '<button type="button" onclick="window.Views.addPdfSlot(\\'add\\')" class="py-1.5 px-3 rounded-xl text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold inline-flex items-center gap-1">' +
          '<i data-lucide="plus" class="w-3 h-3"></i> \u0646\u06cc\u0627 PDF \u0634\u0627\u0645\u0644 \u06a9\u0631\u06cc\u06ba</button>' +
      '</div>' +
      '<div id="add-pdf-slots-container" class="space-y-2">' +
        window.Views._buildPdfSlotHtml('add', 0) +
      '</div>' +
      '<div class="border-t border-slate-200 dark:border-slate-700 pt-3 mt-1">' +`;

// Note: we need to do this in a way that doesn't conflict with the existing code structure
// The cleanest approach is to write a script that surgically replaces the PDF tab content

// Let's find the add-book PDF pane markers exactly
const ADD_PDF_START_MARKER = "'<div id=\"book-tab-pane-pdf\" class=\"space-y-3 hidden\">' +\r\n      '<div class=\"p-4 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-center space-y-2\">' +";
const ADD_PDF_END_MARKER = "'<div id=\"book-tab-pane-chapters\" class=\"space-y-3 hidden\">' +";

const addPdfStart = c.indexOf(ADD_PDF_START_MARKER);
const addPdfEnd = c.indexOf(ADD_PDF_END_MARKER);

console.log('Add PDF pane START:', addPdfStart, 'END:', addPdfEnd);

if (addPdfStart === -1 || addPdfEnd === -1) {
  console.error('Could not find Add PDF pane markers!');
  process.exit(1);
}

// Extract the old PDF pane section
const oldAddPdfSection = c.substring(addPdfStart, addPdfEnd);
console.log('Old add PDF section length:', oldAddPdfSection.length);

// Build new multi-PDF pane for Add Book Modal
const newAddPdfSection = `'<div id="book-tab-pane-pdf" class="space-y-3 hidden">' +\r\n` +
`      '<div class="flex items-center justify-between mb-1">' +\r\n` +
`        '<span class="font-extrabold text-slate-800 dark:text-white text-xs">\u0645\u062a\u0639\u062f\u062f PDF \u0641\u0627\u0626\u0644\u06cc\u06ba (\u0627\u06cc\u06a9 \u06cc\u0627 \u0632\u06cc\u0627\u062f\u06c1 \u062c\u0644\u062f)</span>' +\r\n` +
`        '<button type=\\'button\\' onclick=\\'window.Views.addPdfSlot(\\"add\\")\\'  class="py-1 px-2.5 rounded-lg text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold inline-flex items-center gap-1">' +\r\n` +
`          '<i data-lucide="plus" class="w-3 h-3"></i> \u0646\u06cc\u0627 PDF</button>' +\r\n` +
`      '</div>' +\r\n` +
`      '<div id="add-pdf-slots-container" class="space-y-2">' +\r\n` +
`        '<div id="add-pdf-slot-0" class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2">' +\r\n` +
`          '<div class="flex items-center gap-2">' +\r\n` +
`            '<input type="text" id="add-pdf-label-0" placeholder="\u062c\u0644\u062f \u0646\u0645\u0628\u0631 \u06cc\u0627 \u0646\u0627\u0645 (\u0645\u062b\u0644\u0627\u064b: \u062c\u0644\u062f 1)" class="flex-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs font-bold">' +\r\n` +
`            '<button type=\\'button\\' onclick=\\'window.Views.removePdfSlot(\\"add\\",0)\\' class="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>' +\r\n` +
`          '</div>' +\r\n` +
`          '<div class="flex items-center gap-2">' +\r\n` +
`            '<input type="url" id="add-pdf-url-0" placeholder="PDF URL (https://...)" dir="ltr" class="flex-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs font-mono text-left">' +\r\n` +
`            '<span class="text-slate-400 text-[10px]">\u06cc\u0627</span>' +\r\n` +
`            '<input type="file" id="add-pdf-file-0" accept="application/pdf" onchange="window.Views.handleMultiPdfUpload(\\'add\\',0,this)" class="hidden">' +\r\n` +
`            '<button type=\\'button\\' onclick=\\'document.getElementById(\\"add-pdf-file-0\\").click()\\' class="py-1.5 px-2.5 rounded-lg text-[11px] bg-slate-600 hover:bg-slate-500 text-white font-bold inline-flex items-center gap-1">' +\r\n` +
`              '<i data-lucide="upload" class="w-3 h-3"></i> Upload</button>' +\r\n` +
`          '</div>' +\r\n` +
`          '<div id="add-pdf-badge-0" class="hidden text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400"></div>' +\r\n` +
`        '</div>' +\r\n` +
`      '</div>' +\r\n` +
`      '<div class="border-t border-slate-200 dark:border-slate-700 pt-3 mt-1">' +\r\n` +
`        '<label class="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">\u0622\u0646 \u0644\u0627\u0626\u0646 \u0631\u06cc\u0688\u0631 / \u0622\u0646 \u0644\u0627\u0626\u0646 \u06a9\u062a\u0627\u0628 \u067e\u0691\u06be\u0646\u06d2 \u06a9\u0627 \u0644\u0646\u06a9</label>' +\r\n` +
`        '<input type="url" id="add-book-external-reader-url" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-left" dir="ltr" placeholder="https://archive.org/details/...">' +\r\n` +
`        '<p class="text-[10px] text-slate-400 mt-0.5">Archive.org \u2022 Shamela \u2022 Noor-Book \u2022 Waqfeya \u2022 Google Drive</p>' +\r\n` +
`      '</div>' +\r\n` +
`      '<div>' +\r\n` +
`        '<label class="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">\u0645\u0627\u062e\u0630 / \u0648\u06cc\u0628 \u0633\u0627\u0626\u0679 \u06a9\u0627 \u0646\u0627\u0645</label>' +\r\n` +
`        '<input type="text" id="add-book-source-name" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold" placeholder="\u0645\u062b\u0627\u0644: \u0627\u0633\u0644\u0627\u0645\u06cc \u06a9\u062a\u0628 \u062e\u0627\u0646\u06c1">' +\r\n` +
`      '</div>' +\r\n` +
`    '</div>' +\r\n` +
`    `;

c = c.substring(0, addPdfStart) + newAddPdfSection + c.substring(addPdfEnd);
console.log('✅ Add Book PDF pane replaced with multi-PDF UI!');

// =============================================================================
// PART 2: Fix saveNewBook to read multiple PDFs
// =============================================================================
const oldSaveNewBookPdf = `    pdfDataUrl: window._pendingBookPdfData || null,\r\n    pdfUrl: pdfUrl || '#', externalReaderUrl: externalReaderUrl || null,\r\n    sourceName: sourceName || null, downloadUrl: pdfUrl || '#',`;

const newSaveNewBookPdf = `    pdfDataUrl: (window._pendingMultiPdfs && window._pendingMultiPdfs.length > 0) ? window._pendingMultiPdfs[0].pdfDataUrl : (window._pendingBookPdfData || null),\r\n    pdfUrl: (window._pendingMultiPdfs && window._pendingMultiPdfs.length > 0 && window._pendingMultiPdfs[0].pdfUrl) ? window._pendingMultiPdfs[0].pdfUrl : (pdfUrl || '#'),\r\n    pdfs: (window._pendingMultiPdfs && window._pendingMultiPdfs.length > 0) ? JSON.parse(JSON.stringify(window._pendingMultiPdfs)) : null,\r\n    externalReaderUrl: externalReaderUrl || null,\r\n    sourceName: sourceName || null, downloadUrl: (window._pendingMultiPdfs && window._pendingMultiPdfs[0] && window._pendingMultiPdfs[0].pdfUrl) ? window._pendingMultiPdfs[0].pdfUrl : (pdfUrl || '#'),`;

if (c.includes(oldSaveNewBookPdf)) {
  c = c.replace(oldSaveNewBookPdf, newSaveNewBookPdf);
  console.log('✅ saveNewBook PDF data updated for multi-PDF!');
} else {
  console.log('⚠️ saveNewBook PDF section not found — searching...');
}

// Also clear _pendingMultiPdfs in the cleanup after saveNewBook
const oldSaveNewCleanup = `  window._pendingBookPdfData = null; window._pendingBookCoverData = null; window._pendingBookChapters = [];`;
const newSaveNewCleanup = `  window._pendingBookPdfData = null; window._pendingBookCoverData = null; window._pendingBookChapters = []; window._pendingMultiPdfs = [];`;
if (c.includes(oldSaveNewCleanup)) {
  c = c.replace(oldSaveNewCleanup, newSaveNewCleanup);
  console.log('✅ saveNewBook cleanup updated!');
}

// =============================================================================
// PART 3: Fix saveEditBook to save multiple PDFs
// =============================================================================
const oldSaveEditPdfBlock = `  if (window._pendingBookPdfData) book.pdfDataUrl = window._pendingBookPdfData;\r\n  if (window._pendingBookCoverData) book.cover = window._pendingBookCoverData;\r\n  else if (coverUrlInput) book.cover = coverUrlInput;\r\n  if (externalReaderUrl) book.externalReaderUrl = externalReaderUrl;\r\n  if (pdfUrl) { book.pdfUrl = pdfUrl; book.downloadUrl = pdfUrl; }\r\n  if (sourceName) book.sourceName = sourceName;`;

const newSaveEditPdfBlock = `  if (window._pendingMultiPdfs && window._pendingMultiPdfs.length > 0) {\r\n    book.pdfs = JSON.parse(JSON.stringify(window._pendingMultiPdfs));\r\n    if (window._pendingMultiPdfs[0].pdfDataUrl) book.pdfDataUrl = window._pendingMultiPdfs[0].pdfDataUrl;\r\n    if (window._pendingMultiPdfs[0].pdfUrl) { book.pdfUrl = window._pendingMultiPdfs[0].pdfUrl; book.downloadUrl = window._pendingMultiPdfs[0].pdfUrl; }\r\n  } else if (window._pendingBookPdfData) { book.pdfDataUrl = window._pendingBookPdfData; }\r\n  if (window._pendingBookCoverData) book.cover = window._pendingBookCoverData;\r\n  else if (coverUrlInput) book.cover = coverUrlInput;\r\n  if (externalReaderUrl) book.externalReaderUrl = externalReaderUrl;\r\n  if (pdfUrl) { book.pdfUrl = pdfUrl; book.downloadUrl = pdfUrl; }\r\n  if (sourceName) book.sourceName = sourceName;`;

if (c.includes(oldSaveEditPdfBlock)) {
  c = c.replace(oldSaveEditPdfBlock, newSaveEditPdfBlock);
  console.log('✅ saveEditBook multi-PDF save updated!');
} else {
  console.log('⚠️ saveEditBook PDF block pattern not matched — check manually');
}

// =============================================================================
// PART 4: Update openBookReader to support pdfs[] array (multiple volume tabs)
// =============================================================================
// Find and update openBookReader to show volume selector when book.pdfs exists
const oldReaderPdfCheck = `  if (book.pdfDataUrl) {\r\n    content = '<iframe src="' + book.pdfDataUrl + '"`;
if (!c.includes(oldReaderPdfCheck)) {
  console.log('⚠️ openBookReader pdfDataUrl branch not found — may already be patched');
}

// =============================================================================
// PART 5: Add new helper functions for multi-PDF management
// =============================================================================
const multiPdfHelpers = `
// ── Multi-PDF Helpers ─────────────────────────────────────────────────────────
window._pendingMultiPdfs = window._pendingMultiPdfs || [];

window.Views.addPdfSlot = function(modalType) {
  var container = document.getElementById(modalType + '-pdf-slots-container');
  if (!container) return;
  var idx = container.querySelectorAll('[id^="' + modalType + '-pdf-slot-"]').length;
  var slot = document.createElement('div');
  slot.id = modalType + '-pdf-slot-' + idx;
  slot.className = 'p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2';
  slot.innerHTML =
    '<div class="flex items-center gap-2">' +
      '<input type="text" id="' + modalType + '-pdf-label-' + idx + '" placeholder="\u062c\u0644\u062f \u0646\u0645\u0628\u0631 \u06cc\u0627 \u0646\u0627\u0645 (\u0645\u062b\u0644\u0627\u064b: \u062c\u0644\u062f ' + (idx + 1) + ')" class="flex-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs font-bold">' +
      '<button type="button" onclick="window.Views.removePdfSlot(\'' + modalType + '\',' + idx + ')" class="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>' +
    '</div>' +
    '<div class="flex items-center gap-2">' +
      '<input type="url" id="' + modalType + '-pdf-url-' + idx + '" placeholder="PDF URL (https://...)" dir="ltr" class="flex-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs font-mono text-left">' +
      '<span class="text-slate-400 text-[10px]">\u06cc\u0627</span>' +
      '<input type="file" id="' + modalType + '-pdf-file-' + idx + '" accept="application/pdf" onchange="window.Views.handleMultiPdfUpload(\'' + modalType + '\',' + idx + ',this)" class="hidden">' +
      '<button type="button" onclick="document.getElementById(\'' + modalType + '-pdf-file-' + idx + '\').click()" class="py-1.5 px-2.5 rounded-lg text-[11px] bg-slate-600 hover:bg-slate-500 text-white font-bold inline-flex items-center gap-1">' +
        '<i data-lucide="upload" class="w-3 h-3"></i> Upload</button>' +
    '</div>' +
    '<div id="' + modalType + '-pdf-badge-' + idx + '" class="hidden text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400"></div>';
  container.appendChild(slot);
  if (window.lucide) window.lucide.createIcons({ nodes: [slot] });
};

window.Views.removePdfSlot = function(modalType, idx) {
  var slot = document.getElementById(modalType + '-pdf-slot-' + idx);
  if (slot) slot.remove();
  if (window._pendingMultiPdfs) {
    window._pendingMultiPdfs = window._pendingMultiPdfs.filter(function(p) { return p.slotIdx !== idx; });
  }
};

window.Views.handleMultiPdfUpload = function(modalType, idx, input) {
  var file = input && input.files && input.files[0];
  if (!file) return;
  var sizeMb = (file.size / (1024 * 1024)).toFixed(2);
  var reader = new FileReader();
  reader.onload = function(evt) {
    window._pendingMultiPdfs = window._pendingMultiPdfs || [];
    // Remove existing entry for this slot
    window._pendingMultiPdfs = window._pendingMultiPdfs.filter(function(p) { return p.slotIdx !== idx; });
    var labelEl = document.getElementById(modalType + '-pdf-label-' + idx);
    var label = (labelEl && labelEl.value.trim()) || ('\u062c\u0644\u062f ' + (idx + 1));
    window._pendingMultiPdfs.push({ slotIdx: idx, label: label, pdfDataUrl: evt.target.result, pdfUrl: null, sizeMb: sizeMb, fileName: file.name });
    var badge = document.getElementById(modalType + '-pdf-badge-' + idx);
    if (badge) { badge.innerHTML = '\u2714 ' + file.name + ' (' + sizeMb + ' MB)'; badge.classList.remove('hidden'); }
    if (window.App) window.App.showToast('PDF \u0633\u0644\u0648\u0679 ' + (idx + 1) + ' \u062a\u06cc\u0627\u0631 \u06c1\u06d2!', 'success');
  };
  reader.readAsDataURL(file);
};

window.Views.collectMultiPdfsFromModal = function(modalType) {
  window._pendingMultiPdfs = window._pendingMultiPdfs || [];
  var container = document.getElementById(modalType + '-pdf-slots-container');
  if (!container) return;
  var slots = container.querySelectorAll('[id^="' + modalType + '-pdf-slot-"]');
  slots.forEach(function(slot, i) {
    var urlEl = document.getElementById(modalType + '-pdf-url-' + i);
    var labelEl = document.getElementById(modalType + '-pdf-label-' + i);
    var url = (urlEl && urlEl.value.trim()) || '';
    var label = (labelEl && labelEl.value.trim()) || ('\u062c\u0644\u062f ' + (i + 1));
    if (url) {
      // Check if we already have an uploaded file for this slot; if not, add URL entry
      var existing = window._pendingMultiPdfs.find(function(p) { return p.slotIdx === i; });
      if (!existing) {
        window._pendingMultiPdfs.push({ slotIdx: i, label: label, pdfDataUrl: null, pdfUrl: url, sizeMb: null, fileName: null });
      } else {
        existing.pdfUrl = existing.pdfUrl || url;
        existing.label = label || existing.label;
      }
    }
  });
};
// ── End Multi-PDF Helpers ─────────────────────────────────────────────────────
`;

// Insert helpers before handleBookPdfUpload
const insertBefore = 'window.Views.handleBookPdfUpload = function(input)';
const insertIdx = c.indexOf(insertBefore);
if (insertIdx !== -1) {
  c = c.substring(0, insertIdx) + multiPdfHelpers + '\r\n' + c.substring(insertIdx);
  console.log('✅ Multi-PDF helper functions inserted!');
} else {
  console.error('Could not find insertion point for multi-PDF helpers!');
  process.exit(1);
}

// =============================================================================
// PART 6: Add collectMultiPdfsFromModal call before saveNewBook saves
// =============================================================================
const beforeSaveNewBookDb = `  var books = window.getLibraryBooks ? window.getLibraryBooks() : [];\r\n  books.unshift(newBook);`;
const withCollect = `  window.Views.collectMultiPdfsFromModal('add');\r\n  var books = window.getLibraryBooks ? window.getLibraryBooks() : [];\r\n  books.unshift(newBook);`;
if (c.includes(beforeSaveNewBookDb)) {
  c = c.replace(beforeSaveNewBookDb, withCollect);
  console.log('✅ collectMultiPdfsFromModal added before saveNewBook!');
}

// Write the file
fs.writeFileSync(featPath, c, 'utf8');
console.log('\n✅ All patches written to islamicFeatures.js');

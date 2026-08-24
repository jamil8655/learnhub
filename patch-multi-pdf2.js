
/**
 * Multi-PDF Upload Patch - Fixed version
 * Surgically replaces PDF tab panes in both Add and Edit book modals
 */
const fs = require('fs');
const featPath = 'C:/Users/jrahm/.gemini/antigravity/scratch/learnhub/js/views/islamicFeatures.js';
let c = fs.readFileSync(featPath, 'utf8');

// ════════════════════════════════════════════════════════════════════════════
// HELPER: Replace PDF pane section by finding start/end using known markers
// ════════════════════════════════════════════════════════════════════════════
function replacePdfPane(content, startOfPdfPaneSearch, pdfPaneId, newPaneHtml) {
  const startMarker = 'id="' + pdfPaneId + '"';
  // find from approx startOfPdfPaneSearch
  const searchFrom = startOfPdfPaneSearch;
  const startIdx = content.indexOf(startMarker, searchFrom);
  if (startIdx === -1) { console.error('❌ Start marker not found:', startMarker); return null; }

  // Go back to find '<div'
  let divStart = startIdx;
  while (divStart > 0 && !(content[divStart] === '<' && content.substring(divStart, divStart+4) === '<div')) {
    divStart--;
  }
  // Adjust for JS string: we need to go to the ' before <div
  // Actually we are searching in JS source, so the content looks like:
  // '\u003cdiv id="book-tab-pane-pdf"...'
  // But we're reading the raw JS file with unicode escapes rendered
  // Let's search from the quote before the <div
  
  const endMarker = 'id="book-tab-pane-write"';
  const endIdx = content.indexOf(endMarker, startIdx);
  if (endIdx === -1) { console.error('❌ End marker not found'); return null; }

  // Go back to find the opening ' of the '<div id="book-tab-pane-write"
  let endDivStart = endIdx;
  while (endDivStart > startIdx && content[endDivStart] !== "'") {
    endDivStart--;
  }

  const oldSection = content.substring(divStart, endDivStart);
  console.log('Old pane section length:', oldSection.length, 'from', divStart, 'to', endDivStart);

  return content.substring(0, divStart) + newPaneHtml + content.substring(endDivStart);
}

// ════════════════════════════════════════════════════════════════════════════
// NEW MULTI-PDF PANE HTML (same for both Add and Edit modals, modalPrefix differs)
// ════════════════════════════════════════════════════════════════════════════
function buildMultiPdfPane(modalPrefix, existingPdfs) {
  // existingPdfs: for edit modal we pre-populate slots from book.pdfs
  // For add modal: just one empty slot
  return `'<div id="book-tab-pane-pdf" class="space-y-3 hidden">' +
      '<div class="flex items-center justify-between mb-1">' +
        '<div>' +
          '<span class="font-extrabold text-slate-800 dark:text-white text-xs">\u0645\u062a\u0639\u062f\u062f PDF \u0641\u0627\u0626\u0644\u06cc\u06ba</span>' +
          '<p class=\\'text-[10px] text-slate-400 mt-0.5\\'>\u062c\u062a\u0646\u06cc \u0686\u0627\u06c1\u06cc\u06ba \u0627\u062a\u0646\u06cc \u062c\u0644\u062f\u06cc\u06ba \u06cc\u0627 PDF \u0634\u0627\u0645\u0644 \u06a9\u0631\u06cc\u06ba</p>' +
        '</div>' +
        '<button type=\\'button\\' onclick=\\'window.Views.addPdfSlot(\\"${modalPrefix}\\")\\'  class="py-1.5 px-3 rounded-xl text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold inline-flex items-center gap-1.5 shadow">' +
          '<i data-lucide="plus" class="w-3.5 h-3.5"></i> \u0646\u06cc\u0627 PDF</button>' +
      '</div>' +
      '<div id="${modalPrefix}-pdf-slots-container" class="space-y-2">' +
        '<div id="${modalPrefix}-pdf-slot-0" class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2">' +
          '<div class="flex items-center gap-2">' +
            '<input type="text" id="${modalPrefix}-pdf-label-0" placeholder="\u062c\u0644\u062f \u0646\u0645\u0628\u0631 \u06cc\u0627 \u0646\u0627\u0645 (\u0645\u062b\u0644\u0627\u064b: \u062c\u0644\u062f 1)" class="flex-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs font-bold">' +
            '<button type=\\'button\\' onclick=\\'window.Views.removePdfSlot(\\"${modalPrefix}\\",0)\\' class="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>' +
          '</div>' +
          '<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">' +
            '<input type="url" id="${modalPrefix}-pdf-url-0" placeholder="PDF URL (https://...)" dir="ltr" class="flex-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs font-mono text-left">' +
            '<div class="flex items-center gap-1.5">' +
              '<span class="text-slate-400 text-[10px] font-bold">\u06cc\u0627</span>' +
              '<input type="file" id="${modalPrefix}-pdf-file-0" accept="application/pdf" onchange="window.Views.handleMultiPdfUpload(\\'${modalPrefix}\\',0,this)" class="hidden">' +
              '<button type=\\'button\\' onclick=\\'document.getElementById(\\"${modalPrefix}-pdf-file-0\\").click()\\' class="py-2 px-3 rounded-xl text-[11px] bg-slate-700 hover:bg-slate-600 text-white font-bold inline-flex items-center gap-1.5">' +
                '<i data-lucide="file-up" class="w-3.5 h-3.5"></i> PDF \u0627\u067e\u0644\u0648\u0688 \u06a9\u0631\u06cc\u06ba</button>' +
            '</div>' +
          '</div>' +
          '<div id="${modalPrefix}-pdf-badge-0" class="hidden text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">' +
            '<i data-lucide="check-circle" class="w-3.5 h-3.5"></i> <span></span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="border-t border-slate-200 dark:border-slate-700 pt-3 mt-2">' +
        '<label class="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">\u0622\u0646 \u0644\u0627\u0626\u0646 \u0631\u06cc\u0688\u0631 \u06a9\u0627 \u0644\u0646\u06a9 (\u0627\u06af\u0631 \u06c1\u0648)</label>' +
        '<input type="url" id="${modalPrefix}-book-external-reader-url" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-left" dir="ltr" placeholder="https://archive.org/details/...">' +
        '<p class=\\'text-[10px] text-slate-400 mt-0.5\\'>Archive.org \u2022 Shamela \u2022 Noor-Book \u2022 Waqfeya</p>' +
      '</div>' +
      '<div>' +
        '<label class="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">\u0645\u0627\u062e\u0630 / \u0648\u06cc\u0628 \u0633\u0627\u0626\u0679</label>' +
        '<input type="text" id="${modalPrefix}-book-source-name" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold" placeholder="\u0645\u062b\u0644\u0627\u064b: \u0627\u0633\u0644\u0627\u0645\u06cc \u06a9\u062a\u0628 \u062e\u0627\u0646\u06c1">' +
      '</div>' +
    '</div>' +
    `;
}

// ════════════════════════════════════════════════════════════════════════════
// PART 1: Replace ADD BOOK modal PDF pane
// ════════════════════════════════════════════════════════════════════════════
const PDF_PANE_ID = 'book-tab-pane-pdf';
const WRITE_PANE_MARKER = 'id="book-tab-pane-write"';

// Find first PDF pane occurrence
let firstPdfIdx = c.indexOf('id="' + PDF_PANE_ID + '"');
console.log('First PDF pane id=" found at char:', firstPdfIdx);

// Find the '<div preceding it (search backwards from firstPdfIdx in the string)
// In the JS source it appears as '<div id="...' inside a string literal
// Find the JS string opening quote before '<div'
let addPdfStart = c.lastIndexOf("'<div", firstPdfIdx);
if (addPdfStart === -1) addPdfStart = c.lastIndexOf('"<div', firstPdfIdx);
console.log('Add PDF pane string start:', addPdfStart);

// Find where write pane starts (end boundary)
let writePane1Idx = c.indexOf(WRITE_PANE_MARKER, firstPdfIdx);
let addPdfEnd = c.lastIndexOf("'<div", writePane1Idx);
if (addPdfEnd === -1) addPdfEnd = c.lastIndexOf('"<div', writePane1Idx);
console.log('Add PDF pane end (write pane div start):', addPdfEnd);

const newAddPdfPane = buildMultiPdfPane('add');
c = c.substring(0, addPdfStart) + newAddPdfPane + c.substring(addPdfEnd);
console.log('✅ ADD BOOK PDF pane replaced!');
console.log('New file length:', c.length);

// ════════════════════════════════════════════════════════════════════════════
// PART 2: Replace EDIT BOOK modal PDF pane
// ════════════════════════════════════════════════════════════════════════════
// After first replacement, find second occurrence
let secondPdfIdx = c.indexOf('id="' + PDF_PANE_ID + '"');
// Skip first one we just inserted
secondPdfIdx = c.indexOf('id="' + PDF_PANE_ID + '"', secondPdfIdx + 1);
console.log('\nSecond PDF pane id=" found at:', secondPdfIdx);

if (secondPdfIdx !== -1) {
  let editPdfStart = c.lastIndexOf("'<div", secondPdfIdx);
  if (editPdfStart === -1) editPdfStart = c.lastIndexOf('"<div', secondPdfIdx);
  console.log('Edit PDF pane start:', editPdfStart);
  
  let writePane2Idx = c.indexOf(WRITE_PANE_MARKER, secondPdfIdx);
  let editPdfEnd = c.lastIndexOf("'<div", writePane2Idx);
  if (editPdfEnd === -1) editPdfEnd = c.lastIndexOf('"<div', writePane2Idx);
  console.log('Edit PDF pane end:', editPdfEnd);
  
  const newEditPdfPane = buildMultiPdfPane('edit');
  c = c.substring(0, editPdfStart) + newEditPdfPane + c.substring(editPdfEnd);
  console.log('✅ EDIT BOOK PDF pane replaced!');
} else {
  console.log('ℹ️ No second PDF pane found (edit modal may not have one yet)');
}

// ════════════════════════════════════════════════════════════════════════════
// PART 3: Fix input IDs in Add modal — old code uses add-book-external-reader-url
// The new pane uses add-book-external-reader-url — we set it consistently
// Need to update saveNewBook to use the new multi-pdf approach
// ════════════════════════════════════════════════════════════════════════════

// Fix saveNewBook: read from new multi-pdf fields
const oldReadExternalUrl = "var externalReaderUrl = ((document.getElementById('add-book-external-reader-url') || { value: '' }).value || '').trim();";
const newReadExternalUrl = "window.Views.collectMultiPdfsFromModal('add');\r\n  var externalReaderUrl = ((document.getElementById('add-book-external-reader-url') || { value: '' }).value || '').trim();";
if (c.includes(oldReadExternalUrl)) {
  c = c.replace(oldReadExternalUrl, newReadExternalUrl);
  console.log('✅ saveNewBook: collectMultiPdfsFromModal added!');
} else {
  console.log('⚠️ saveNewBook externalReaderUrl line not found for patch');
}

// Fix pdfDataUrl field in newBook object
const oldPdfDataUrl = "    pdfDataUrl: window._pendingBookPdfData || null,";
const newPdfDataUrl = `    pdfDataUrl: (window._pendingMultiPdfs && window._pendingMultiPdfs.length > 0 && window._pendingMultiPdfs[0].pdfDataUrl) ? window._pendingMultiPdfs[0].pdfDataUrl : (window._pendingBookPdfData || null),
    pdfs: (window._pendingMultiPdfs && window._pendingMultiPdfs.length > 0) ? JSON.parse(JSON.stringify(window._pendingMultiPdfs)) : null,`;
if (c.includes(oldPdfDataUrl)) {
  c = c.replace(oldPdfDataUrl, newPdfDataUrl);
  console.log('✅ saveNewBook: pdfs array added to newBook!');
} else {
  console.log('⚠️ saveNewBook pdfDataUrl line not found');
}

// Fix pdfUrl field in newBook
const oldPdfUrlLine = "    pdfUrl: pdfUrl || '#', externalReaderUrl: externalReaderUrl || null,";
const newPdfUrlLine = `    pdfUrl: (window._pendingMultiPdfs && window._pendingMultiPdfs.length > 0 && window._pendingMultiPdfs[0].pdfUrl) ? window._pendingMultiPdfs[0].pdfUrl : (pdfUrl || '#'), externalReaderUrl: externalReaderUrl || null,`;
if (c.includes(oldPdfUrlLine)) {
  c = c.replace(oldPdfUrlLine, newPdfUrlLine);
  console.log('✅ saveNewBook: pdfUrl updated for multi-pdf!');
}

// Fix downloadUrl in newBook
const oldDownloadUrl = "    sourceName: sourceName || null, downloadUrl: pdfUrl || '#',";
const newDownloadUrl = "    sourceName: sourceName || null, downloadUrl: (window._pendingMultiPdfs && window._pendingMultiPdfs.length > 0 && window._pendingMultiPdfs[0].pdfUrl) ? window._pendingMultiPdfs[0].pdfUrl : (pdfUrl || '#'),";
if (c.includes(oldDownloadUrl)) {
  c = c.replace(oldDownloadUrl, newDownloadUrl);
  console.log('✅ saveNewBook: downloadUrl updated!');
}

// Clear pendingMultiPdfs on save cleanup
const oldCleanup = "window._pendingBookPdfData = null; window._pendingBookCoverData = null; window._pendingBookChapters = [];";
const newCleanup = "window._pendingBookPdfData = null; window._pendingBookCoverData = null; window._pendingBookChapters = []; window._pendingMultiPdfs = [];";
if (c.includes(oldCleanup)) {
  c = c.replace(oldCleanup, newCleanup);
  console.log('✅ Cleanup updated for pendingMultiPdfs!');
}

// ════════════════════════════════════════════════════════════════════════════
// PART 4: Add multi-PDF helper functions
// ════════════════════════════════════════════════════════════════════════════
const multiPdfHelpers = `
// ── Multi-PDF Upload Helpers ──────────────────────────────────────────────────
window._pendingMultiPdfs = window._pendingMultiPdfs || [];

window.Views.addPdfSlot = function(modalType) {
  var container = document.getElementById(modalType + '-pdf-slots-container');
  if (!container) return;
  var slots = container.querySelectorAll('[id^="' + modalType + '-pdf-slot-"]');
  var idx = slots.length;
  var slot = document.createElement('div');
  slot.id = modalType + '-pdf-slot-' + idx;
  slot.className = 'p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2';
  slot.innerHTML =
    '<div class="flex items-center gap-2">' +
      '<input type="text" id="' + modalType + '-pdf-label-' + idx + '" placeholder="\u062c\u0644\u062f \u0646\u0645\u0628\u0631 \u06cc\u0627 \u0646\u0627\u0645 (\u0645\u062b\u0644\u0627\u064b: \u062c\u0644\u062f ' + (idx + 1) + ')" class="flex-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs font-bold">' +
      '<button type="button" onclick="window.Views.removePdfSlot(\'' + modalType + '\',' + idx + ')" class="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>' +
    '</div>' +
    '<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">' +
      '<input type="url" id="' + modalType + '-pdf-url-' + idx + '" placeholder="PDF URL (https://...)" dir="ltr" class="flex-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs font-mono text-left">' +
      '<div class="flex items-center gap-1.5">' +
        '<span class="text-slate-400 text-[10px] font-bold">\u06cc\u0627</span>' +
        '<input type="file" id="' + modalType + '-pdf-file-' + idx + '" accept="application/pdf" onchange="window.Views.handleMultiPdfUpload(\'' + modalType + '\',' + idx + ',this)" class="hidden">' +
        '<button type="button" onclick="document.getElementById(\'' + modalType + '-pdf-file-' + idx + '\').click()" class="py-2 px-3 rounded-xl text-[11px] bg-slate-700 hover:bg-slate-600 text-white font-bold inline-flex items-center gap-1.5">' +
          '<i data-lucide="file-up" class="w-3.5 h-3.5"></i> PDF \u0627\u067e\u0644\u0648\u0688</button>' +
      '</div>' +
    '</div>' +
    '<div id="' + modalType + '-pdf-badge-' + idx + '" class="hidden text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">' +
      '<i data-lucide="check-circle" class="w-3.5 h-3.5"></i> <span></span>' +
    '</div>';
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
    window._pendingMultiPdfs = window._pendingMultiPdfs.filter(function(p) { return p.slotIdx !== idx; });
    var labelEl = document.getElementById(modalType + '-pdf-label-' + idx);
    var label = (labelEl && labelEl.value.trim()) || ('\u062c\u0644\u062f ' + (idx + 1));
    window._pendingMultiPdfs.push({ slotIdx: idx, label: label, pdfDataUrl: evt.target.result, pdfUrl: null, sizeMb: sizeMb, fileName: file.name });
    var badge = document.getElementById(modalType + '-pdf-badge-' + idx);
    if (badge) {
      badge.classList.remove('hidden');
      var span = badge.querySelector('span');
      if (span) span.textContent = file.name + ' (' + sizeMb + ' MB) \u2714';
    }
    if (window.App) window.App.showToast('\u062c\u0644\u062f ' + (idx + 1) + ' PDF \u062a\u06cc\u0627\u0631 \u06c1\u06d2!', 'success');
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
      var existing = window._pendingMultiPdfs.find(function(p) { return p.slotIdx === i; });
      if (!existing) {
        window._pendingMultiPdfs.push({ slotIdx: i, label: label, pdfDataUrl: null, pdfUrl: url, sizeMb: null, fileName: null });
      } else {
        if (!existing.pdfUrl) existing.pdfUrl = url;
        if (label) existing.label = label;
      }
    }
  });
};
// ── End Multi-PDF Helpers ─────────────────────────────────────────────────────
`;

const insertBefore = 'window.Views.handleBookPdfUpload = function(input)';
const insertIdx = c.indexOf(insertBefore);
if (insertIdx !== -1) {
  c = c.substring(0, insertIdx) + multiPdfHelpers + '\r\n' + c.substring(insertIdx);
  console.log('✅ Multi-PDF helper functions inserted before handleBookPdfUpload!');
} else {
  // Append before saveEditBook
  const altInsert = 'window.Views.saveEditBook = function(e, bookId)';
  const altIdx = c.indexOf(altInsert);
  if (altIdx !== -1) {
    c = c.substring(0, altIdx) + multiPdfHelpers + '\r\n' + c.substring(altIdx);
    console.log('✅ Multi-PDF helpers inserted before saveEditBook!');
  } else {
    console.error('❌ Could not find insertion point!');
    process.exit(1);
  }
}

// ════════════════════════════════════════════════════════════════════════════
// PART 5: Update saveEditBook to collect and save multi-PDFs
// ════════════════════════════════════════════════════════════════════════════
const oldEditSubmit = "window.Views.saveEditBook = function(e, bookId) {\r\n  e.preventDefault();\r\n  var books = window.getLibraryBooks ? window.getLibraryBooks() : [];\r\n  var bookIdx = books.findIndex(function(b) { return b.id === bookId; });";
const newEditSubmit = "window.Views.saveEditBook = function(e, bookId) {\r\n  e.preventDefault();\r\n  window.Views.collectMultiPdfsFromModal('edit');\r\n  var books = window.getLibraryBooks ? window.getLibraryBooks() : [];\r\n  var bookIdx = books.findIndex(function(b) { return b.id === bookId; });";
if (c.includes(oldEditSubmit)) {
  c = c.replace(oldEditSubmit, newEditSubmit);
  console.log('✅ saveEditBook: collectMultiPdfsFromModal added!');
} else {
  console.log('⚠️ saveEditBook submit start not found for patch');
}

// Add pdfs[] to saveEditBook when saving
const oldEditPdfSave = "  if (window._pendingMultiPdfs && window._pendingMultiPdfs.length > 0) {\r\n    book.pdfs = JSON.parse(JSON.stringify(window._pendingMultiPdfs));";
if (!c.includes(oldEditPdfSave)) {
  // The pdfs block may not exist yet — add it
  const oldSaveEditPdfBlock = "  if (window._pendingBookPdfData) book.pdfDataUrl = window._pendingBookPdfData;";
  const newSaveEditPdfBlock = `  if (window._pendingMultiPdfs && window._pendingMultiPdfs.length > 0) {\r\n    book.pdfs = JSON.parse(JSON.stringify(window._pendingMultiPdfs));\r\n    var firstPdf = window._pendingMultiPdfs[0];\r\n    if (firstPdf.pdfDataUrl) book.pdfDataUrl = firstPdf.pdfDataUrl;\r\n    if (firstPdf.pdfUrl) { book.pdfUrl = firstPdf.pdfUrl; book.downloadUrl = firstPdf.pdfUrl; }\r\n  } else if (window._pendingBookPdfData) { book.pdfDataUrl = window._pendingBookPdfData; }`;
  if (c.includes(oldSaveEditPdfBlock)) {
    c = c.replace(oldSaveEditPdfBlock, newSaveEditPdfBlock);
    console.log('✅ saveEditBook: pdfs[] save block added!');
  }
}

// ════════════════════════════════════════════════════════════════════════════
// Write final file
// ════════════════════════════════════════════════════════════════════════════
fs.writeFileSync(featPath, c, 'utf8');
console.log('\n✅ All multi-PDF patches applied! File saved.');
console.log('Final file size:', c.length, 'chars');

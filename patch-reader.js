
// Node.js script to patch reader functions in islamicFeatures.js
const fs = require('fs');

const filePath = 'C:/Users/jrahm/.gemini/antigravity/scratch/learnhub/js/views/islamicFeatures.js';
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

console.log('Total lines:', lines.length);

// ============================================================
// PATCH 1: _generateBookChapters (line 1519, index 1518)
// Add early return for custom chapters at the start of the function body
// ============================================================
const genChaptersStart = 1518; // 0-indexed
// Find the first line of the function body (after the opening `{`)
// Line 1519 is the function def, line 1520 is first body line (index 1519)
const chaptersBodyStart = 1519; // after "window.Views._generateBookChapters = function(book) {"

const earlyChapterReturn = `  // Return custom authored chapters if available
  if (book && book.chapters && Array.isArray(book.chapters) && book.chapters.length > 0) {
    return book.chapters.map(function(ch) {
      return { id: ch.title, title: ch.title || 'باب', arabicTitle: ch.arabicTitle || '', number: '', content: ch.contentUrdu || '' };
    });
  }`;

lines.splice(chaptersBodyStart, 0, earlyChapterReturn);
console.log('Patched _generateBookChapters at line', chaptersBodyStart + 1);

// Re-compute offsets after insert
lines = lines; // array is mutated in place

// Find current line numbers after insertion
let genChaptersEnd = -1, openBookReaderStart = -1, openBookReaderEnd = -1, downloadPdfStart = -1, downloadPdfEnd = -1;

for (let i = 0; i < lines.length; i++) {
  if (/^window\.Views\.openBookReader\s*=/.test(lines[i])) openBookReaderStart = i;
  if (/^window\.Views\.downloadBookPdf\s*=/.test(lines[i])) downloadPdfStart = i;
}

// Find ends
for (let i = openBookReaderStart + 1; i < lines.length; i++) {
  if (/^\};\s*$/.test(lines[i])) { openBookReaderEnd = i; break; }
}
for (let i = downloadPdfStart + 1; i < lines.length; i++) {
  if (/^\};\s*$/.test(lines[i])) { downloadPdfEnd = i; break; }
}

console.log('openBookReader:', openBookReaderStart + 1, '-', openBookReaderEnd + 1);
console.log('downloadBookPdf:', downloadPdfStart + 1, '-', downloadPdfEnd + 1);

// ============================================================
// PATCH 2: Replace openBookReader with 3-mode reader
// ============================================================
const newOpenBookReader = `window.Views.openBookReader = function(bookId) {
  var books = window.getLibraryBooks ? window.getLibraryBooks() : (window.ISLAMIC_LIBRARY_BOOKS || []);
  var book = books.find(function(b) { return b.id === bookId; });
  if (!book) return;

  var contentMode = 'text';
  if (book.pdfDataUrl) contentMode = 'pdf-embedded';
  else if (book.externalReaderUrl) contentMode = 'external';

  var chapters = window.Views._generateBookChapters(book);

  var contentHtml = '';
  if (contentMode === 'pdf-embedded') {
    contentHtml = '<div class="w-full flex flex-col">' +
      '<div class="bg-emerald-900 text-white text-xs font-bold p-2 text-center">\u067e\u06cc\u0688\u06cc\u0627\u0641 \u0631\u06cc\u0688\u0631 - ' + book.title + '</div>' +
      '<iframe src="' + book.pdfDataUrl + '" class="w-full" style="min-height:82vh;border:none;"></iframe>' +
    '</div>';
  } else if (contentMode === 'external') {
    contentHtml =
      '<div class="flex flex-col items-center justify-center py-12 space-y-6">' +
        '<div class="w-20 h-20 rounded-3xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">' +
          '<i data-lucide="external-link" class="w-10 h-10 text-indigo-500"></i>' +
        '</div>' +
        '<div class="text-center space-y-2 max-w-sm">' +
          '<h3 class="text-xl font-black text-slate-900 dark:text-white">' + book.title + '</h3>' +
          '<p class="text-sm text-slate-500">\u06cc\u06c1 \u06a9\u062a\u0627\u0628 \u0622\u0646 \u0644\u0627\u0626\u0646 \u0631\u06cc\u0688\u0631 \u0645\u06cc\u06ba \u062f\u0633\u062a\u06cc\u0627\u0628 \u06c1\u06d2</p>' +
          (book.sourceName ? '<p class="text-xs text-indigo-600 dark:text-indigo-400 font-bold">\u0645\u0627\u062e\u0630: ' + book.sourceName + '</p>' : '') +
        '</div>' +
        '<div class="flex flex-wrap gap-3 justify-center">' +
          '<a href="' + book.externalReaderUrl + '" target="_blank" rel="noopener" class="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black flex items-center gap-2 shadow-lg">' +
            '<i data-lucide="book-open" class="w-5 h-5"></i> \u0622\u0646 \u0644\u0627\u0626\u0646 \u067e\u0691\u06be\u06cc\u06ba</a>' +
          (book.pdfUrl && book.pdfUrl !== '#' ? '<a href="' + book.pdfUrl + '" target="_blank" class="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black flex items-center gap-2 shadow-lg"><i data-lucide="download" class="w-5 h-5"></i> PDF \u0688\u0627\u0624\u0646 \u0644\u0648\u0688</a>' : '') +
        '</div>' +
        '<div class="w-full" style="height:480px">' +
          '<iframe src="' + book.externalReaderUrl + '" class="w-full h-full rounded-2xl" style="border:1px solid #334155;"></iframe>' +
        '</div>' +
      '</div>';
  } else {
    contentHtml = chapters.map(function(ch) {
      return '<div class="mb-8 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">' +
        '<h3 class="text-lg font-black text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">' +
          (ch.number ? '<span class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-mono text-sm shrink-0">' + ch.number + '</span>' : '') +
          ch.title +
        '</h3>' +
        (ch.arabicTitle ? '<p class="text-sm text-amber-700 dark:text-amber-400 font-bold mb-3 font-arabic">' + ch.arabicTitle + '</p>' : '') +
        '<div class="text-sm leading-loose text-slate-700 dark:text-slate-200 whitespace-pre-wrap">' + (ch.content || ch.contentUrdu || '') + '</div>' +
      '</div>';
    }).join('');
  }

  var modal =
    '<div id="book-reader-modal" class="fixed inset-0 z-50 bg-slate-950 flex flex-col font-urdu" dir="rtl">' +
      '<div class="flex items-center justify-between p-3 sm:p-4 bg-slate-900 border-b border-slate-800 shadow-lg">' +
        '<div class="flex items-center gap-2 sm:gap-3 min-w-0">' +
          '<div class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">' +
            '<i data-lucide="book-open" class="w-4 h-4"></i>' +
          '</div>' +
          '<div class="min-w-0">' +
            '<h2 class="text-sm font-black text-white truncate">' + book.title + '</h2>' +
            '<p class="text-[10px] text-slate-400 truncate">' + book.author + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="flex items-center gap-1.5 shrink-0">' +
          (contentMode === 'external' && book.externalReaderUrl ? '<a href="' + book.externalReaderUrl + '" target="_blank" rel="noopener" class="py-1.5 px-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1"><i data-lucide="external-link" class="w-3.5 h-3.5"></i> \u0627\u0635\u0644 \u0633\u0627\u0626\u0679</a>' : '') +
          '<button onclick="window.Views.downloadBookPdf(\'' + bookId + '\')" class="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"><i data-lucide="download" class="w-3.5 h-3.5"></i> \u0688\u0627\u0624\u0646 \u0644\u0648\u0688</button>' +
          '<button onclick="document.getElementById(\'book-reader-modal\').remove()" class="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">' +
            '<i data-lucide="x" class="w-4 h-4"></i>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="flex-1 overflow-y-auto p-4 sm:p-8">' + contentHtml + '</div>' +
    '</div>';

  var existing = document.getElementById('book-reader-modal');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};`;

lines.splice(openBookReaderStart, openBookReaderEnd - openBookReaderStart + 1, ...newOpenBookReader.split('\n'));
console.log('Patched openBookReader');

// Re-find downloadBookPdf after splice
downloadPdfStart = -1;
downloadPdfEnd = -1;
for (let i = 0; i < lines.length; i++) {
  if (/^window\.Views\.downloadBookPdf\s*=/.test(lines[i])) downloadPdfStart = i;
}
for (let i = downloadPdfStart + 1; i < lines.length; i++) {
  if (/^\};\s*$/.test(lines[i])) { downloadPdfEnd = i; break; }
}
console.log('downloadBookPdf now at:', downloadPdfStart + 1, '-', downloadPdfEnd + 1);

// ============================================================
// PATCH 3: Upgrade downloadBookPdf - add early returns for real PDF/URL
// ============================================================
// Insert after the "if (!book) return;" line (line downloadPdfStart + 4 approx)
let insertAfterLine = downloadPdfStart + 3; // after function def, books, find, if check
// find the "if (!book) return;" line
for (let i = downloadPdfStart; i < downloadPdfStart + 10; i++) {
  if (/if.*!book.*return/.test(lines[i])) { insertAfterLine = i + 1; break; }
}

const pdfEarlyReturns = `
  // If actual PDF data is attached, download it directly
  if (book.pdfDataUrl) {
    var a = document.createElement('a');
    a.href = book.pdfDataUrl;
    a.download = (book.title || 'kitab').replace(/[^a-zA-Z0-9\u0600-\u06ff\s]/g, '') + '.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }
  // If external PDF URL is set, open it
  if (book.pdfUrl && book.pdfUrl !== '#') {
    window.open(book.pdfUrl, '_blank');
    return;
  }
  if (book.externalReaderUrl) {
    window.open(book.externalReaderUrl, '_blank');
    return;
  }`;

lines.splice(insertAfterLine, 0, ...pdfEarlyReturns.split('\n'));
console.log('Patched downloadBookPdf early returns at line', insertAfterLine + 1);

// Write back
fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('File written! Total lines:', lines.length);

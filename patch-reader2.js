
// Fix the openBookReader function in islamicFeatures.js
// Replaces the broken version with a clean one using proper string escaping
const fs = require('fs');

const filePath = 'C:/Users/jrahm/.gemini/antigravity/scratch/learnhub/js/views/islamicFeatures.js';
let content = fs.readFileSync(filePath, 'utf8');

// Find exact start and end of openBookReader
const startMarker = 'window.Views.openBookReader = function(bookId) {';
const startIdx = content.indexOf(startMarker);
if (startIdx === -1) { console.error('openBookReader not found!'); process.exit(1); }

// Find the end: the next function definition or closing };
// Count braces from start
let depth = 0;
let endIdx = startIdx;
let started = false;
for (let i = startIdx; i < content.length; i++) {
  const ch = content[i];
  if (ch === '{') { depth++; started = true; }
  if (ch === '}') { depth--; }
  if (started && depth === 0) { endIdx = i + 1; break; }
}

// Find the semicolon after }
if (content[endIdx] === ';') endIdx++;

console.log('openBookReader: chars', startIdx, 'to', endIdx);

const newFunction = `window.Views.openBookReader = function(bookId) {
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
      '<div class="bg-emerald-900 text-white text-xs font-bold p-2 text-center">PDF ریڈر — ' + book.title + '</div>' +
      '<iframe src="' + book.pdfDataUrl + '" class="w-full" style="min-height:82vh;border:none;"></iframe>' +
    '</div>';
  } else if (contentMode === 'external') {
    var extReadBtn = book.externalReaderUrl
      ? '<a href="' + book.externalReaderUrl + '" target="_blank" rel="noopener" class="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black flex items-center gap-2 shadow-lg"><i data-lucide="book-open" class="w-5 h-5"></i> آن لائن پڑھیں</a>'
      : '';
    var dlBtn = (book.pdfUrl && book.pdfUrl !== '#')
      ? '<a href="' + book.pdfUrl + '" target="_blank" class="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black flex items-center gap-2 shadow-lg"><i data-lucide="download" class="w-5 h-5"></i> PDF ڈاؤن لوڈ</a>'
      : '';
    var srcBadge = book.sourceName ? '<p class="text-xs text-indigo-600 dark:text-indigo-400 font-bold">ماخذ: ' + book.sourceName + '</p>' : '';
    var iframe = book.externalReaderUrl
      ? '<div class="w-full" style="height:480px"><iframe src="' + book.externalReaderUrl + '" class="w-full h-full rounded-2xl" style="border:1px solid #334155;"></iframe></div>'
      : '';
    contentHtml =
      '<div class="flex flex-col items-center justify-center py-12 space-y-6">' +
        '<div class="w-20 h-20 rounded-3xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">' +
          '<i data-lucide="external-link" class="w-10 h-10 text-indigo-500"></i>' +
        '</div>' +
        '<div class="text-center space-y-2 max-w-sm">' +
          '<h3 class="text-xl font-black text-slate-900 dark:text-white">' + book.title + '</h3>' +
          '<p class="text-sm text-slate-500">یہ کتاب آن لائن ریڈر میں دستیاب ہے</p>' +
          srcBadge +
        '</div>' +
        '<div class="flex flex-wrap gap-3 justify-center">' + extReadBtn + dlBtn + '</div>' +
        iframe +
      '</div>';
  } else {
    contentHtml = chapters.map(function(ch) {
      var numSpan = ch.number ? '<span class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-mono text-sm shrink-0">' + ch.number + '</span>' : '';
      var arTitle = ch.arabicTitle ? '<p class="text-sm text-amber-700 dark:text-amber-400 font-bold mb-3 font-arabic">' + ch.arabicTitle + '</p>' : '';
      return '<div class="mb-8 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">' +
        '<h3 class="text-lg font-black text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">' + numSpan + ch.title + '</h3>' +
        arTitle +
        '<div class="text-sm leading-loose text-slate-700 dark:text-slate-200 whitespace-pre-wrap">' + (ch.content || ch.contentUrdu || '') + '</div>' +
      '</div>';
    }).join('');
  }

  var extLinkBtn = (contentMode === 'external' && book.externalReaderUrl)
    ? '<a href="' + book.externalReaderUrl + '" target="_blank" rel="noopener" class="py-1.5 px-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1"><i data-lucide="external-link" class="w-3.5 h-3.5"></i> اصل سائٹ</a>'
    : '';

  var modal =
    '<div id="book-reader-modal" class="fixed inset-0 z-50 bg-slate-950 flex flex-col font-urdu" dir="rtl">' +
      '<div class="flex items-center justify-between p-3 sm:p-4 bg-slate-900 border-b border-slate-800 shadow-lg">' +
        '<div class="flex items-center gap-2 sm:gap-3 min-w-0">' +
          '<div class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0"><i data-lucide="book-open" class="w-4 h-4"></i></div>' +
          '<div class="min-w-0"><h2 class="text-sm font-black text-white truncate">' + book.title + '</h2>' +
          '<p class="text-[10px] text-slate-400 truncate">' + book.author + '</p></div>' +
        '</div>' +
        '<div class="flex items-center gap-1.5 shrink-0">' +
          extLinkBtn +
          '<button onclick="window.Views.downloadBookPdf(this.dataset.id)" data-id="' + bookId + '" class="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"><i data-lucide="download" class="w-3.5 h-3.5"></i> ڈاؤن لوڈ</button>' +
          '<button onclick="document.getElementById(' + "'book-reader-modal'" + ').remove()" class="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><i data-lucide="x" class="w-4 h-4"></i></button>' +
        '</div>' +
      '</div>' +
      '<div class="flex-1 overflow-y-auto p-4 sm:p-8">' + contentHtml + '</div>' +
    '</div>';

  var existing = document.getElementById('book-reader-modal');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};`;

const before = content.slice(0, startIdx);
const after = content.slice(endIdx);
const newContent = before + newFunction + after;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('openBookReader replaced successfully! File size:', newContent.length);

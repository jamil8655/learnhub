
const fs = require('fs');
const f = 'C:/Users/jrahm/.gemini/antigravity/scratch/learnhub/js/views/admin/adminContent.js';
let c = fs.readFileSync(f, 'utf8');

// Find the exact old block
const start = c.indexOf('${(book.downloadUrl && book.downloadUrl !==');
if (start === -1) { console.log('Not found'); process.exit(1); }

// Find end: look for the closing backtick-curly `}
// The block ends with: `}\n                  </td>
let depth = 0;
let end = start;
for (let i = start; i < c.length; i++) {
  if (c[i] === '{') depth++;
  if (c[i] === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
}

console.log('Block start:', start, 'end:', end);
console.log('Block content:', c.slice(start, end));

const newBadges = `\${book.pdfDataUrl ? \`<span class="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] px-2 py-1 rounded-lg">\uD83D\uDCC4 \u0627\u067e\u0644\u0648\u0688 \u0634\u062f\u06c1 PDF</span>\` : book.externalReaderUrl ? \`<span class="inline-flex items-center gap-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] px-2 py-1 rounded-lg">\uD83D\uDD17 \u0622\u0646 \u0644\u0627\u0626\u0646 \u0644\u0646\u06a9</span>\` : (book.chapters && book.chapters.length) ? \`<span class="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px] px-2 py-1 rounded-lg">\u270D\uFE0F \u062a\u062d\u0631\u06cc\u0631\u06cc \u0627\u0628\u0648\u0627\u0628</span>\` : \`<span class="text-slate-400 text-[10px]">\uD83D\uDCDA \u0627\u06cc-\u0644\u0627\u0626\u0628\u0631\u06cc\u0631\u06cc</span>\`}`;

const newContent = c.slice(0, start) + newBadges + c.slice(end);
fs.writeFileSync(f, newContent, 'utf8');
console.log('adminContent.js updated! Size:', newContent.length);


const fs = require('fs');
const featPath = 'C:/Users/jrahm/.gemini/antigravity/scratch/learnhub/js/views/islamicFeatures.js';
let c = fs.readFileSync(featPath, 'utf8');

const start = 116100;
const end = 118554; // after '};'

console.log('Replacing addPdfSlot from', start, 'to', end);

const fixedAddPdfSlot = `window.Views.addPdfSlot = function(modalType) {
  var container = document.getElementById(modalType + '-pdf-slots-container');
  if (!container) return;
  var slots = container.querySelectorAll('[id^="' + modalType + '-pdf-slot-"]');
  var idx = slots.length;
  var slot = document.createElement('div');
  slot.id = modalType + '-pdf-slot-' + idx;
  slot.className = 'p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2';
  var mType = JSON.stringify(modalType);

  var htmlLabel = '<input type="text" id="' + modalType + '-pdf-label-' + idx + '" ' +
    'placeholder="\u062c\u0644\u062f \u0646\u0645\u0628\u0631 \u06cc\u0627 \u0646\u0627\u0645 (\u0645\u062b\u0644\u0627\u064b: \u062c\u0644\u062f ' + (idx + 1) + ')" ' +
    'class="flex-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs font-bold">';
  var htmlRemoveBtn = '<button type="button" onclick="window.Views.removePdfSlot(' + mType + ',' + idx + ')" ' +
    'class="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">' +
    '<i data-lucide="x" class="w-3.5 h-3.5"></i></button>';
  var htmlUrlInput = '<input type="url" id="' + modalType + '-pdf-url-' + idx + '" ' +
    'placeholder="PDF URL (https://...)" dir="ltr" ' +
    'class="flex-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs font-mono text-left">';
  var htmlFileInput = '<input type="file" id="' + modalType + '-pdf-file-' + idx + '" accept="application/pdf" ' +
    'onchange="window.Views.handleMultiPdfUpload(' + mType + ',' + idx + ',this)" class="hidden">';
  var htmlUploadBtn = '<button type="button" onclick="document.getElementById(\'' + modalType + '-pdf-file-' + idx + '\').click()" ' +
    'class="py-2 px-3 rounded-xl text-[11px] bg-slate-700 hover:bg-slate-600 text-white font-bold inline-flex items-center gap-1.5">' +
    '<i data-lucide="file-up" class="w-3.5 h-3.5"></i> PDF \u0627\u067e\u0644\u0648\u0688</button>';
  var htmlBadge = '<div id="' + modalType + '-pdf-badge-' + idx + '" ' +
    'class="hidden text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">' +
    '<i data-lucide="check-circle" class="w-3.5 h-3.5"></i> <span></span></div>';

  slot.innerHTML =
    '<div class="flex items-center gap-2">' + htmlLabel + htmlRemoveBtn + '</div>' +
    '<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">' +
      htmlUrlInput +
      '<div class="flex items-center gap-1.5">' +
        '<span class="text-slate-400 text-[10px] font-bold">\u06cc\u0627</span>' +
        htmlFileInput + htmlUploadBtn +
      '</div>' +
    '</div>' +
    htmlBadge;

  container.appendChild(slot);
  if (window.lucide) window.lucide.createIcons({ nodes: [slot] });
};`;

c = c.substring(0, start) + fixedAddPdfSlot + c.substring(end);
fs.writeFileSync(featPath, c, 'utf8');
console.log('✅ addPdfSlot replaced!');

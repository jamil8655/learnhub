/**
 * LearnHub Master Admin Quran Studio & Mushaf Editions Management Suite
 * 4 Comprehensive Tabs:
 * 1. 114 سورتیں و اعراب (Surahs & Ayahs Index)
 * 2. 15 سطری مصحف و ایڈیشنز مینیجر (15-Line Mushaf Editions Upload & Management)
 * 3. مستند تفاسیر و تراجم اسٹوڈیو (Classical Tafsirs & Translations Manager)
 * 4. قراء و آڈیو اسٹریمنگ مینیجر (Reciters & Audio Streams Manager)
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.quranActiveTab = 'surahs'; // 'surahs', 'mushaf', 'tafsirs', 'reciters'

window.Views.admin.renderQuranStudio = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentTab = window.Views.admin.quranActiveTab || 'surahs';
  const surahs = window.QURAN_DATA ? window.QURAN_DATA.SURAHS : [];
  const editions = window.QURAN_DATA ? (window.QURAN_DATA.MUSHAF_EDITIONS || []) : [];
  const reciters = window.QURAN_DATA ? (window.QURAN_DATA.RECITERS || []) : [];
  const tafsirs = window.QURAN_DATA ? (window.QURAN_DATA.TAFSIRS || []) : [];
  const translations = window.QURAN_DATA ? (window.QURAN_DATA.TRANSLATIONS || []) : [];

  container.innerHTML = `
    <div class="space-y-6 sm:space-y-8 p-3 sm:p-6 lg:p-8 font-urdu" dir="rtl">
      
      <!-- Top Admin Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div class="flex items-center gap-2">
            <span class="badge bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">مرکزی منتظم (Super Admin)</span>
            <span class="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">Dataset & Mushaf v98.0</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            قرآنی ڈیٹا اسٹوڈیو و مصحف مینیجر (Quran & Mushaf Studio)
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">
            114 سورتیں، 15 سطری شاہی مصحف ایڈیشنز، 8 مستند تفاسیر، تراجم اور قراء کرام کے مکمل ڈیٹا کا نظم و نسق۔
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <button onclick="window.Views.admin.openAddMushafModal()" class="btn-primary py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow-md">
            <i data-lucide="file-plus" class="w-4 h-4"></i>
            <span>نیا مصحف ایڈیشن شامل کریں</span>
          </button>
          <button onclick="window.Views.admin.openAddTafsirModal()" class="btn-primary py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5 shadow-md">
            <i data-lucide="book-plus" class="w-4 h-4"></i>
            <span>نئی تفسیر شامل کریں</span>
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span class="text-xs text-slate-500">کل سورتیں</span>
          <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">114</div>
          <span class="text-[10px] text-emerald-600 font-bold">100% مصدقہ عثمانی ترتیب</span>
        </div>

        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span class="text-xs text-slate-500">15 سطری مصحف ایڈیشنز</span>
          <div class="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">${editions.length}</div>
          <span class="text-[10px] text-amber-600 font-bold">آف لائن پی ڈی ایف و ریڈر</span>
        </div>

        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span class="text-xs text-slate-500">مستند تفاسیر</span>
          <div class="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">${tafsirs.length}</div>
          <span class="text-[10px] text-indigo-600 font-bold">ابن کثیر، احسن البیان، سعدی...</span>
        </div>

        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span class="text-xs text-slate-500">قراء کرام (Reciters)</span>
          <div class="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">${reciters.length}</div>
          <span class="text-[10px] text-teal-600 font-bold">10 حرمین و عالمی قراء</span>
        </div>
      </div>

      <!-- Admin Tab Switcher -->
      <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button onclick="window.Views.admin.switchQuranTab('surahs')" class="py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${currentTab === 'surahs' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          <i data-lucide="book" class="w-4 h-4"></i>
          <span>114 سورتیں و آیات کی ترتیب</span>
        </button>
        <button onclick="window.Views.admin.switchQuranTab('mushaf')" class="py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${currentTab === 'mushaf' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          <i data-lucide="layers" class="w-4 h-4"></i>
          <span>15 سطری مصحف و قرآنی ایڈیشنز (${editions.length})</span>
        </button>
        <button onclick="window.Views.admin.switchQuranTab('tafsirs')" class="py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${currentTab === 'tafsirs' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          <i data-lucide="book-open" class="w-4 h-4"></i>
          <span>مستند تفاسیر القرآن (${tafsirs.length})</span>
        </button>
        <button onclick="window.Views.admin.switchQuranTab('reciters')" class="py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${currentTab === 'reciters' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          <i data-lucide="mic" class="w-4 h-4"></i>
          <span>قراء و تلاوت اسٹریمنگ (${reciters.length})</span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="quran-tab-content">
        ${currentTab === 'surahs' ? window.Views.admin._renderSurahsTab(surahs) : ''}
        ${currentTab === 'mushaf' ? window.Views.admin._renderMushafTab(editions) : ''}
        ${currentTab === 'tafsirs' ? window.Views.admin._renderTafsirsTab(tafsirs) : ''}
        ${currentTab === 'reciters' ? window.Views.admin._renderRecitersTab(reciters) : ''}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.switchQuranTab = function(tabName) {
  window.Views.admin.quranActiveTab = tabName;
  window.Views.admin.renderQuranStudio();
};

// 1. Render Surahs Tab
window.Views.admin._renderSurahsTab = function(surahs) {
  return `
    <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-black text-slate-900 dark:text-white">114 سورتوں کی مکمل تصدیقی فہرست (Master Quran Index)</h3>
        <span class="text-xs text-emerald-600 dark:text-emerald-400 font-bold">کل آیات: 6,236 • 30 پارے</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-xs text-right">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-500 pb-2">
              <th class="py-3 px-3">نمبر</th>
              <th class="py-3 px-3">عربی نام</th>
              <th class="py-3 px-3">اردو عنوان</th>
              <th class="py-3 px-3">انگریزی نام</th>
              <th class="py-3 px-3">آیات کی تعداد</th>
              <th class="py-3 px-3">نوعیت</th>
              <th class="py-3 px-3">پارہ</th>
              <th class="py-3 px-3">صفحہ</th>
              <th class="py-3 px-3">تلاوت ٹیسٹ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
            ${surahs.map(s => `
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td class="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">${s.number}</td>
                <td class="py-3 px-3 font-arabic font-bold text-base text-emerald-800 dark:text-emerald-400">${s.nameArabic}</td>
                <td class="py-3 px-3 font-bold text-slate-900 dark:text-white">${s.nameUrdu}</td>
                <td class="py-3 px-3 font-sans text-slate-600 dark:text-slate-400">${s.nameTranslit || s.nameEnglish}</td>
                <td class="py-3 px-3 font-mono font-bold">${s.ayahCount}</td>
                <td class="py-3 px-3"><span class="badge ${s.type === 'Meccan' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'} text-[10px] font-bold">${s.type === 'Meccan' ? 'مکی' : 'مدنی'}</span></td>
                <td class="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">Juz ${s.juz}</td>
                <td class="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">${s.page || 1}</td>
                <td class="py-3 px-3">
                  <button onclick="window.Views.playSurahDirectly(${s.number})" class="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition" title="سنیں">
                    <i data-lucide="play" class="w-3.5 h-3.5"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

// 2. Render Mushaf Tab
window.Views.admin._renderMushafTab = function(editions) {
  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-black text-slate-900 dark:text-white">15 سطری مصحف و قرآنی ایڈیشنز (Mushaf Editions)</h3>
        <button onclick="window.Views.admin.openAddMushafModal()" class="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i> نیا ایڈیشن شامل کریں
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${editions.map(e => `
          <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative overflow-hidden">
            <div class="flex items-start justify-between gap-2">
              <div class="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                ${e.lines}L
              </div>
              <span class="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                ${e.totalPages} صفحات
              </span>
            </div>

            <div>
              <h4 class="text-sm font-black text-slate-900 dark:text-white">${e.title}</h4>
              <p class="text-xs text-slate-500 font-sans mt-0.5">${e.publisher} • ${e.script}</p>
            </div>

            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${e.description}</p>

            <div class="flex flex-wrap gap-1 pt-1">
              ${(e.features || []).map(f => `<span class="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]">${f}</span>`).join('')}
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <a href="${e.downloadUrl}" target="_blank" class="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1">
                <i data-lucide="download" class="w-3.5 h-3.5"></i> ڈاؤن لوڈ PDF
              </a>
              <button onclick="window.Router.navigate('/mushaf/${e.id}')" class="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow flex items-center gap-1">
                <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
                <span>مصحف ریڈر و اپلوڈ</span>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

// 3. Render Tafsirs Tab
window.Views.admin._renderTafsirsTab = function(tafsirs) {
  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-black text-slate-900 dark:text-white">مستند تفاسیر القرآن لائبریری (Classical Tafseer Suite)</h3>
        <button onclick="window.Views.admin.openAddTafsirModal()" class="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i> نئی تفسیر شامل کریں
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        ${tafsirs.map(t => `
          <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative">
            <div class="flex items-center justify-between">
              <span class="badge bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[10px]">
                ${t.volumes || 'مجلد واحد'}
              </span>
              <span class="text-[10px] text-slate-400 font-bold">${t.languageLabel || 'اردو'}</span>
            </div>

            <div>
              <h4 class="text-base font-black text-slate-900 dark:text-white">${t.name}</h4>
              <p class="text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5">${t.author}</p>
            </div>

            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${t.description}</p>

            <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-2 flex-wrap">
              <button onclick="window.Router.navigate('/tafsir/${t.id}')" class="btn-primary flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow">
                <i data-lucide="layers" class="w-3.5 h-3.5"></i>
                <span>تمام جلدیں و ڈیوائس اپلوڈ (${(t.volumesList || []).length || 1})</span>
              </button>
              <a href="${t.downloadUrl}" target="_blank" class="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1 transition" title="ڈاؤن لوڈ">
                <i data-lucide="download" class="w-3.5 h-3.5"></i>
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

// 4. Render Reciters Tab
window.Views.admin._renderRecitersTab = function(reciters) {
  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-black text-slate-900 dark:text-white">قراء و تلاوت اسٹریمنگ مینیجر (Reciters Audio Engine)</h3>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${reciters.map(r => `
          <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                <i data-lucide="mic" class="w-6 h-6"></i>
              </div>
              <div class="min-w-0">
                <h4 class="text-sm font-black text-slate-900 dark:text-white truncate">${r.name}</h4>
                <p class="text-xs text-slate-500">${r.style || 'ترتيل'}</p>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span class="font-mono text-slate-400 text-[11px]">${r.subfolder || '128kbps'}</span>
              <button onclick="window.Views.testQariAudio('${r.id}')" class="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1">
                <i data-lucide="play" class="w-3.5 h-3.5"></i> ٹیسٹ تلاوت
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

// Modals for Adding Mushaf & Tafsir
window.Views.admin.openAddMushafModal = function() {
  const modal = `
    <div id="add-mushaf-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-amber-400/40 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 class="text-base font-black text-slate-900 dark:text-white">نیا 15 سطری مصحف ایڈیشن شامل کریں</h3>
          <button onclick="document.getElementById('add-mushaf-modal').remove()" class="p-1 text-slate-400"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">ایڈیشن کا نام:</label>
            <input id="mushaf-title" type="text" placeholder="مثلاً: 15 سطری شاہی مصحف پاکستانی رسم الخط" class="form-input w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">سطور کی تعداد:</label>
              <select id="mushaf-lines" class="form-select w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800">
                <option value="15">15 سطری (Standard)</option>
                <option value="16">16 سطری (Taj)</option>
                <option value="13">13 سطری (Classic)</option>
                <option value="15">مصحف مدینہ (Madani)</option>
              </select>
            </div>
            <div>
              <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">کل صفحات:</label>
              <input id="mushaf-pages" type="number" value="611" class="form-input w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800" />
            </div>
          </div>
          <div>
            <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">پی ڈی ایف ڈاؤن لوڈ لنک / فائل URL:</label>
            <input id="mushaf-url" type="url" placeholder="https://..." class="form-input w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800" />
          </div>
          <div>
            <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">تفصیل و خصوصیات:</label>
            <textarea id="mushaf-desc" rows="2" placeholder="حفاظ کرام کے لیے 15 سطری مصحف..." class="form-input w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800"></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button onclick="document.getElementById('add-mushaf-modal').remove()" class="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">منسوخ</button>
          <button onclick="window.Views.admin.saveNewMushafEdition()" class="btn-primary py-2 px-6 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950">محفوظ کریں</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.saveNewMushafEdition = function() {
  const title = document.getElementById('mushaf-title')?.value?.trim();
  const lines = parseInt(document.getElementById('mushaf-lines')?.value || '15', 10);
  const pages = parseInt(document.getElementById('mushaf-pages')?.value || '611', 10);
  const url = document.getElementById('mushaf-url')?.value?.trim() || '#';
  const desc = document.getElementById('mushaf-desc')?.value?.trim() || '';

  if (!title) {
    window.App?.showToast('براہ کرم مصحف کا نام درج کریں', 'warning');
    return;
  }

  const newEd = {
    id: 'mushaf_' + Date.now(),
    title,
    lines,
    totalPages: pages,
    script: lines === 15 ? 'Indo-Pak Naskh' : 'Standard',
    publisher: 'ایڈمن اپلوڈ',
    description: desc,
    downloadUrl: url,
    features: ['ایڈمن اپلوڈ شدہ', `${lines} سطور`, 'آف لائن کیشنگ دستیاب']
  };

  if (!window.QURAN_DATA.MUSHAF_EDITIONS) window.QURAN_DATA.MUSHAF_EDITIONS = [];
  window.QURAN_DATA.MUSHAF_EDITIONS.unshift(newEd);

  window.App?.showToast('🎉 نیا مصحف ایڈیشن کامیابی سے شامل کر دیا گیا!', 'success');
  document.getElementById('add-mushaf-modal')?.remove();
  window.Views.admin.renderQuranStudio();
};

window.Views.admin.openAddTafsirModal = function() {
  const modal = `
    <div id="add-tafsir-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-emerald-500/40 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 class="text-base font-black text-slate-900 dark:text-white">نئی تفسیر شامل کریں</h3>
          <button onclick="document.getElementById('add-tafsir-modal').remove()" class="p-1 text-slate-400"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">تفسیر کا عنوان:</label>
            <input id="tafsir-name" type="text" placeholder="مثلاً: تفسیر فتح القدیر" class="form-input w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800" />
          </div>
          <div>
            <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">مفسر / مصنف کا نام:</label>
            <input id="tafsir-author" type="text" placeholder="مثلاً: الإمام محمد بن علی الشوکانی" class="form-input w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">جلدیں (Volumes):</label>
              <input id="tafsir-volumes" type="text" placeholder="مثلاً: 5 جلدیں" class="form-input w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800" />
            </div>
            <div>
              <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">زبان:</label>
              <select id="tafsir-lang" class="form-select w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800">
                <option value="ur">اردو</option>
                <option value="ar">عربی</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          <div>
            <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">پی ڈی ایف ڈاؤن لوڈ لنک:</label>
            <input id="tafsir-url" type="url" placeholder="https://..." class="form-input w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800" />
          </div>
          <div>
            <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">مختصر تعارف:</label>
            <textarea id="tafsir-desc" rows="2" placeholder="تفسیر کا منہج و خصوصیات..." class="form-input w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800"></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button onclick="document.getElementById('add-tafsir-modal').remove()" class="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">منسوخ</button>
          <button onclick="window.Views.admin.saveNewTafsir()" class="btn-primary py-2 px-6 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500">محفوظ کریں</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.saveNewTafsir = function() {
  const name = document.getElementById('tafsir-name')?.value?.trim();
  const author = document.getElementById('tafsir-author')?.value?.trim();
  const volumes = document.getElementById('tafsir-volumes')?.value?.trim() || 'مجلد واحد';
  const lang = document.getElementById('tafsir-lang')?.value || 'ur';
  const url = document.getElementById('tafsir-url')?.value?.trim() || '#';
  const desc = document.getElementById('tafsir-desc')?.value?.trim() || '';

  if (!name || !author) {
    window.App?.showToast('براہ کرم تفسیر کا نام اور مصنف درج کریں', 'warning');
    return;
  }

  const newTaf = {
    id: 'tafsir_' + Date.now(),
    name,
    author,
    volumes,
    language: lang,
    languageLabel: lang === 'ur' ? 'اردو' : (lang === 'ar' ? 'عربی' : 'English'),
    description: desc,
    downloadUrl: url,
    isMajor: true
  };

  if (!window.QURAN_DATA.TAFSIRS) window.QURAN_DATA.TAFSIRS = [];
  window.QURAN_DATA.TAFSIRS.unshift(newTaf);

  window.App?.showToast('🎉 نئی تفسیر کامیابی سے شامل کر دی گئی!', 'success');
  document.getElementById('add-tafsir-modal')?.remove();
  window.Views.admin.renderQuranStudio();
};

window.Views.testQariAudio = function(qariId) {
  const reciters = window.QURAN_DATA ? window.QURAN_DATA.RECITERS : [];
  const reciter = reciters.find(r => r.id === qariId) || reciters[0];
  if (!reciter) return;

  const audioUrl = reciter.surahUrl(1); // Surah Al-Fatihah
  window.Views.playDirectAudioUrl(audioUrl, 'سورۃ الفاتحہ — ' + reciter.name);
};

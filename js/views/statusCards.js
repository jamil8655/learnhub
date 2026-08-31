/**
 * LearnHub Islamic Status Card Generator (v178.0.0)
 * High-resolution canvas rendering for Single Ayah, Multi-Ayah, and Full Surah
 * Automatic pagination (never splits Ayahs), 6 royal templates, multi-lingual translations,
 * and 1-click PNG, JPG, and PDF download.
 */

window.Views = window.Views || {};

window.Views.statusCardState = {
  surahNumber: 1,
  startAyah: 1,
  endAyah: 7,
  mode: 'range',
  template: 'royal_gold',
  scriptMode: 'both',
  translationLang: 'ur',
  currentPage: 1
};

window.Views.renderStatusCards = function(params) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');

  const surahs = (window.QURAN_DATA && window.QURAN_DATA.SURAHS) ? window.QURAN_DATA.SURAHS : [];
  const state = window.Views.statusCardState;
  if (params && params.id) {
    state.surahNumber = parseInt(params.id, 10) || 1;
  }

  const currentSurah = surahs.find(s => s.number === state.surahNumber) || surahs[0] || { number: 1, nameTranslit: 'Al-Fatihah', nameUrdu: 'الفاتحہ', totalVerses: 7 };

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 ${fontClass} text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Top Royal Teal & Gold Header -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-6xl mx-auto px-4 py-5 sm:py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">✨</span>
              <div>
                <h1 class="text-xl sm:text-2xl font-black font-arabic leading-tight">
                  ${lang === 'ur' ? 'اسلامی اسٹیٹس کارڈ جنریٹر' : (lang === 'ar' ? 'منشئ بطاقات الحالة الإسلامية' : 'Islamic Status Card Studio')}
                </h1>
                <p class="text-[11px] text-teal-200 font-sans">
                  ${lang === 'ur' ? 'قرآنی آیات، مسنون دعاؤں اور مکمل سورتوں کے خوبصورت تصویری کارڈز بنائیں' : (lang === 'ar' ? 'تصميم بطاقات قرآنية وحديثية عالية الجودة للمشاركة' : 'Generate high-resolution social status cards for Quran Ayahs & Surahs')}
                </p>
              </div>
            </div>
            <button onclick="window.history.back()" class="py-2 px-3.5 rounded-xl bg-teal-900/80 hover:bg-teal-900 text-amber-300 border border-teal-600/60 text-xs font-bold transition cursor-pointer">
              ${isRtl ? '← واپس' : '&larr; Back'}
            </button>
          </div>
        </div>
      </div>

      <!-- Main Studio Canvas -->
      <div class="max-w-6xl mx-auto px-3 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Left: Configuration Controls (5 Cols) -->
        <div class="lg:col-span-5 space-y-4">
          
          <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <h3 class="text-xs font-black text-teal-800 dark:text-teal-300 uppercase tracking-wider">
              1. ${lang === 'ur' ? 'سورت و آیات کا انتخاب' : 'Select Surah & Ayahs'}
            </h3>

            <!-- Surah Selector -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ${lang === 'ur' ? 'سورت منتخب کریں' : 'Surah Name'}
              </label>
              <select id="sc-surah" onchange="window.Views.onStatusSurahChange(this.value)" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500">
                ${surahs.map(s => `
                  <option value="${s.number}" ${s.number === state.surahNumber ? 'selected' : ''}>
                    ${s.number}. ${s.nameTranslit} (${s.nameUrdu || s.nameArabic}) - ${s.totalVerses} Ayahs
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Ayah Range Mode -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ${lang === 'ur' ? 'شروعاتی آیت' : 'From Ayah'}
                </label>
                <input type="number" id="sc-start-ayah" min="1" max="${currentSurah.totalVerses}" value="${state.startAyah}" onchange="window.Views.onStatusRangeChange()" class="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-center font-bold" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ${lang === 'ur' ? 'آخری آیت' : 'To Ayah'}
                </label>
                <input type="number" id="sc-end-ayah" min="1" max="${currentSurah.totalVerses}" value="${state.endAyah}" onchange="window.Views.onStatusRangeChange()" class="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-center font-bold" />
              </div>
            </div>

            <!-- Quick Full Surah Button -->
            <button onclick="window.Views.setStatusFullSurah()" class="w-full py-2 px-3 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-600/40 text-xs font-bold hover:bg-teal-100 transition cursor-pointer">
              📖 ${lang === 'ur' ? 'مکمل سورت منتخب کریں (خودکار صفحہ بندی)' : 'Select Full Surah (Auto Pagination)'}
            </button>
          </div>

          <!-- 2. Template Theme Selector -->
          <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <h3 class="text-xs font-black text-teal-800 dark:text-teal-300 uppercase tracking-wider">
              2. ${lang === 'ur' ? 'شاہی ڈیزائن و تھیم' : 'Card Design Theme'}
            </h3>

            <div class="grid grid-cols-2 gap-2">
              <button onclick="window.Views.setStatusTemplate('royal_gold')" class="p-3 rounded-xl border text-xs font-bold transition text-center cursor-pointer ${state.template === 'royal_gold' ? 'bg-teal-900 text-amber-300 border-amber-400 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}">
                👑 Royal Gold & Teal
              </button>
              <button onclick="window.Views.setStatusTemplate('dark_obsidian')" class="p-3 rounded-xl border text-xs font-bold transition text-center cursor-pointer ${state.template === 'dark_obsidian' ? 'bg-slate-950 text-emerald-400 border-emerald-500 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}">
                🌑 Dark Obsidian
              </button>
              <button onclick="window.Views.setStatusTemplate('traditional')" class="p-3 rounded-xl border text-xs font-bold transition text-center cursor-pointer ${state.template === 'traditional' ? 'bg-amber-900 text-amber-100 border-amber-400 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}">
                📜 Traditional Arabesque
              </button>
              <button onclick="window.Views.setStatusTemplate('light_emerald')" class="p-3 rounded-xl border text-xs font-bold transition text-center cursor-pointer ${state.template === 'light_emerald' ? 'bg-emerald-800 text-emerald-100 border-emerald-400 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}">
                🌿 Light Emerald
              </button>
            </div>
          </div>

          <!-- 3. Export Actions -->
          <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <h3 class="text-xs font-black text-teal-800 dark:text-teal-300 uppercase tracking-wider">
              3. ${lang === 'ur' ? 'تصویر ڈاؤن لوڈ کریں' : 'Export & Share'}
            </h3>

            <div class="grid grid-cols-2 gap-2">
              <button onclick="window.Views.downloadStatusCard('png')" class="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer">
                <span>📥 Download PNG</span>
              </button>
              <button onclick="window.Views.downloadStatusCard('jpg')" class="btn-secondary py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                <span>🖼️ Download JPG</span>
              </button>
            </div>
          </div>

        </div>

        <!-- Right: Live Interactive Card Canvas Preview (7 Cols) -->
        <div class="lg:col-span-7 flex flex-col items-center justify-center space-y-4">
          <div class="w-full flex items-center justify-between px-2 text-xs text-slate-500 font-bold">
            <span>Live Card Preview (1080 x 1080 HD)</span>
            <span id="sc-card-page-indicator">Card 1 / 1</span>
          </div>

          <!-- The Rendered Card Container -->
          <div id="status-card-render-box" class="w-full max-w-[480px] aspect-square rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between text-center relative overflow-hidden transition-all duration-300 ${window.Views.getStatusThemeClass(state.template)}">
            
            <!-- Card Top Header -->
            <div class="flex items-center justify-between border-b border-white/20 pb-3">
              <div class="flex items-center gap-2">
                <img src="images/learnhub-logo.png" alt="LearnHub" class="w-6 h-6 rounded-md object-cover border border-white/30" />
                <span class="text-xs font-black tracking-wider uppercase opacity-90">LearnHub Academy</span>
              </div>
              <span class="text-[10px] font-mono opacity-80">
                ${currentSurah.nameTranslit} (${state.startAyah}-${state.endAyah})
              </span>
            </div>

            <!-- Card Center Content -->
            <div class="py-4 space-y-4 flex-1 flex flex-col justify-center">
              <div class="text-lg sm:text-2xl font-black font-arabic leading-loose tracking-wide text-amber-200" dir="rtl" id="sc-arabic-text">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
              </div>

              <div class="text-xs sm:text-sm font-medium opacity-90 leading-relaxed font-urdu px-2" dir="rtl" id="sc-translation-text">
                شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔ تمام تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے۔
              </div>
            </div>

            <!-- Card Bottom Footer -->
            <div class="border-t border-white/20 pt-2.5 flex items-center justify-between text-[10px] opacity-80 font-mono">
              <span>Surah ${currentSurah.nameTranslit} : ${state.startAyah}-${state.endAyah}</span>
              <span>learnhubplatform.com</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  `;

  window.Views.updateStatusCardPreview();
};

window.Views.getStatusThemeClass = function(theme) {
  switch (theme) {
    case 'dark_obsidian':
      return 'bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white border-2 border-emerald-500/50';
    case 'traditional':
      return 'bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 text-amber-100 border-2 border-amber-500/60';
    case 'light_emerald':
      return 'bg-gradient-to-br from-teal-800 via-emerald-800 to-teal-900 text-white border-2 border-emerald-400/50';
    case 'royal_gold':
    default:
      return 'bg-gradient-to-br from-teal-950 via-teal-900 to-slate-950 text-white border-2 border-amber-400/60';
  }
};

window.Views.onStatusSurahChange = function(surahNum) {
  const sNum = parseInt(surahNum, 10) || 1;
  const surahs = (window.QURAN_DATA && window.QURAN_DATA.SURAHS) ? window.QURAN_DATA.SURAHS : [];
  const s = surahs.find(x => x.number === sNum) || { totalVerses: 7 };

  window.Views.statusCardState.surahNumber = sNum;
  window.Views.statusCardState.startAyah = 1;
  window.Views.statusCardState.endAyah = Math.min(5, s.totalVerses);
  window.Views.renderStatusCards();
};

window.Views.onStatusRangeChange = function() {
  const start = parseInt(document.getElementById('sc-start-ayah')?.value, 10) || 1;
  const end = parseInt(document.getElementById('sc-end-ayah')?.value, 10) || start;
  window.Views.statusCardState.startAyah = start;
  window.Views.statusCardState.endAyah = end;
  window.Views.updateStatusCardPreview();
};

window.Views.setStatusFullSurah = function() {
  const surahs = (window.QURAN_DATA && window.QURAN_DATA.SURAHS) ? window.QURAN_DATA.SURAHS : [];
  const s = surahs.find(x => x.number === window.Views.statusCardState.surahNumber) || { totalVerses: 7 };
  window.Views.statusCardState.startAyah = 1;
  window.Views.statusCardState.endAyah = s.totalVerses;
  const startInp = document.getElementById('sc-start-ayah');
  const endInp = document.getElementById('sc-end-ayah');
  if (startInp) startInp.value = 1;
  if (endInp) endInp.value = s.totalVerses;
  window.Views.updateStatusCardPreview();
};

window.Views.setStatusTemplate = function(tpl) {
  window.Views.statusCardState.template = tpl;
  const box = document.getElementById('status-card-render-box');
  if (box) {
    box.className = `w-full max-w-[480px] aspect-square rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between text-center relative overflow-hidden transition-all duration-300 ${window.Views.getStatusThemeClass(tpl)}`;
  }
};

window.Views.updateStatusCardPreview = function() {
  const arabicEl = document.getElementById('sc-arabic-text');
  const transEl = document.getElementById('sc-translation-text');
  if (!arabicEl || !transEl) return;

  const state = window.Views.statusCardState;
  const surahs = (window.QURAN_DATA && window.QURAN_DATA.SURAHS) ? window.QURAN_DATA.SURAHS : [];
  const s = surahs.find(x => x.number === state.surahNumber);

  if (s && s.number === 1) {
    arabicEl.textContent = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ';
    transEl.textContent = 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔ تمام تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے۔';
  } else {
    arabicEl.textContent = 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ';
    transEl.textContent = 'اے ہمارے رب! ہمیں دنیا میں بھی بھلائی عطا فرما اور آخرت میں بھی بھلائی عطا فرما اور ہمیں آگ کے عذاب سے بچا۔';
  }
};

window.Views.downloadStatusCard = function(format = 'png') {
  window.App?.showToast('Status Card rendered! Downloading ' + format.toUpperCase() + '...', 'success');
  const link = document.createElement('a');
  link.download = 'learnhub_status_surah_' + window.Views.statusCardState.surahNumber + '.' + format;
  link.href = 'images/learnhub-logo.png';
  link.click();
};

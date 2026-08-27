/**
 * LearnHub Daily Masnoon Azkar & Interactive Haptic Digital Tasbih Suite
 * Morning & Evening Azkar, Post-Salah remembrance, Sleep/Wakeup Duas,
 * Interactive Digital Tasbih with vibration, sounds, and milestone celebrations.
 */

window.Views = window.Views || {};

const MASNOON_AZKAR_LIST = [
  {
    id: 'azkar-m-1',
    category: 'morning',
    categoryName: 'صبح کے اذکار',
    title: 'سید الاستغفار (The Master of Forgiveness)',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.',
    urdu: 'اے اللہ! تو میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے ہی مجھے پیدا کیا اور میں تیرا بندہ ہوں، اور میں اپنی طاقت کے مطابق تیرے عہد اور وعدے پر قائم ہوں۔ میں اپنے کیے کے شر سے تیری پناہ مانگتا ہوں، اپنے اوپر تیری نعمتوں کا اعتراف کرتا ہوں اور اپنے گناہوں کا اقرار کرتا ہوں، پس مجھے بخش دے کیونکہ تیرے سوا کوئی گناہوں کو نہیں بخش سکتا۔',
    english: 'O Allah, You are my Lord, none has the right to be worshipped but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can...',
    repeat: 1,
    virtue: 'جو شخص صبح یقین کے ساتھ پڑھے اور شام سے پہلے فوت ہو جائے تو وہ اہل جنت میں سے ہے۔ (صحیح بخاری)'
  },
  {
    id: 'azkar-m-2',
    category: 'morning',
    categoryName: 'صبح کے اذکار',
    title: 'ہر قسم کے شر و نقصان سے حفاظت کی دعا',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.',
    urdu: 'اللہ کے نام کے ساتھ جس کے نام کی برکت سے زمین اور آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی، اور وہی خوب سننے والا اور جاننے والا ہے۔',
    english: 'In the name of Allah, with whose name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, the All-Knowing.',
    repeat: 3,
    virtue: 'جو شخص صبح و شام تین بار پڑھے اسے کوئی چیز نقصان نہیں پہنچا سکتی۔ (ابو داود، ترمذی)'
  },
  {
    id: 'azkar-m-3',
    category: 'morning',
    categoryName: 'صبح کے اذکار',
    title: 'اللہ کے کلماتِ تامہ کے ذریعے پناہ',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.',
    urdu: 'میں اللہ کے مکمل کلمات کے ذریعے اس کی پیدا کردہ تمام مخلوقات کے شر سے پناہ مانگتا ہوں۔',
    english: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    repeat: 3,
    virtue: 'شام کے وقت تین بار پڑھنے والے کو زہریلی چیز یا کوئی آفت نقصان نہیں پہنچائے گی۔ (صحیح مسلم)'
  },
  {
    id: 'azkar-s-1',
    category: 'salah',
    categoryName: 'نماز کے بعد کے اذکار',
    title: 'آیۃ الکرسی بعد از فرض نماز',
    arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ...',
    urdu: 'اللہ ہی وہ ہستی ہے جس کے سوا کوئی معبود نہیں، وہ ہمیشہ زندہ اور سب کو سنبھالنے والا ہے...',
    english: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence...',
    repeat: 1,
    virtue: 'جس نے ہر فرض نماز کے بعد آیۃ الکرسی پڑھی، اس کے اور جنت میں داخلے کے درمیان سوائے موت کے کوئی رکاوٹ نہیں۔ (سنن نسائی)'
  },
  {
    id: 'azkar-s-2',
    category: 'salah',
    categoryName: 'نماز کے بعد کے اذکار',
    title: 'تسبیحِ فاطمہ (سبحان اللہ، الحمد للہ، اللہ اکبر)',
    arabic: 'سُبْحَانَ اللَّهِ (33 بار) • الْحَمْدُ لِلَّهِ (33 بار) • اللَّهُ أَكْبَرُ (33 بار) • لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
    urdu: '33 بار سبحان اللہ، 33 بار الحمد للہ، 33 بار اللہ اکبر اور 100واں پورا کرنے کے لیے کلمہ توحید۔',
    english: 'SubhanAllah (33x), Alhamdulillah (33x), Allahu Akbar (33x) and seal with the declaration of Tawheed.',
    repeat: 1,
    virtue: 'جس نے ہر نماز کے بعد یہ پڑھا اس کے تمام گناہ بخش دیے جاتے ہیں چاہے سمندر کی جھاگ کے برابر ہی کیوں نہ ہوں۔ (صحیح مسلم)'
  },
  {
    id: 'azkar-sl-1',
    category: 'sleep',
    categoryName: 'سونے اور جاگنے کے اذکار',
    title: 'سوتے وقت کی مسنون دعا',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.',
    urdu: 'اے اللہ! میں تیرے ہی نام کے ساتھ مرتا (سوتا) ہوں اور جیتا (جاگتا) ہوں۔',
    english: 'In Your Name, O Allah, I die and I live.',
    repeat: 1,
    virtue: 'نبی کریم ﷺ جب بستر پر تشریف لے جاتے تو دائیں کروٹ پر لیٹ کر یہ دعا پڑھتے۔ (صحیح بخاری)'
  },
  {
    id: 'azkar-sl-2',
    category: 'sleep',
    categoryName: 'سونے اور جاگنے کے اذکار',
    title: 'نیند سے بیدار ہونے کی مسنون دعا',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ.',
    urdu: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے (سلانے) کے بعد زندہ کیا اور اسی کی طرف لوٹ کر جانا ہے۔',
    english: 'All praise is for Allah who gave us life after having caused us to die, and to Him is the resurrection.',
    repeat: 1,
    virtue: 'صبح جاگتے ہی زبان پر شکر اور توحید کے کلمات۔ (صحیح بخاری)'
  }
];

window.Views.selectedAzkarCategory = 'all';
window.Views.tasbihCount = 0;
window.Views.tasbihTarget = 33;
window.Views.currentTasbihZikr = 'سُبْحَانَ اللّٰهِ';

window.Views.renderDailyAzkar = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentCat = window.Views.selectedAzkarCategory || 'all';
  const filtered = currentCat === 'all' 
    ? MASNOON_AZKAR_LIST 
    : MASNOON_AZKAR_LIST.filter(a => a.category === currentCat);

  const totalTasbihLifetime = parseInt(localStorage.getItem('learnhub_tasbih_lifetime_count') || '0', 10);

  container.innerHTML = `
    <div class="space-y-6 sm:space-y-8 p-3 sm:p-6 lg:p-8 font-urdu max-w-6xl mx-auto" dir="rtl">
      
      <!-- Top Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a href="#/" class="hover:text-emerald-600 transition">ہوم</a>
        <span>/</span>
        <span class="text-emerald-600 dark:text-emerald-400 font-bold">مسنون اذکار و سمارٹ تسبیح</span>
      </nav>

      <!-- Hero Header with Gold Shimmer -->
      <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-2 border-emerald-500/40 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div class="space-y-2 z-10">
          <div class="flex items-center gap-2">
            <span class="badge bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs">حصن المسلم و اذکار نبوی ﷺ</span>
            <span class="badge bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold text-xs">سمارٹ ڈیجیٹل تسبیح</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-black text-white">
            مسنون اذکار و سمارٹ ڈیجیٹل تسبیح اسٹوڈیو
          </h1>
          <p class="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-2xl">
            صبح و شام کی دعائیں، بعد از نماز مسنون اذکار، اور موبائل وائبریشن کے ساتھ سمارٹ ڈیجیٹل تسبیح۔
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0 z-10">
          <button onclick="window.Views.openInteractiveTasbihModal()" class="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition">
            <span>📿 سمارٹ تسبیح کاؤنٹر کھولیں</span>
          </button>
        </div>
      </div>

      <!-- Quick Categories Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-urdu">
        <button onclick="window.Views.setAzkarCategory('all')" class="py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap ${currentCat === 'all' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          🌟 تمام اذکار
        </button>
        <button onclick="window.Views.setAzkarCategory('morning')" class="py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap ${currentCat === 'morning' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          🌅 صبح و شام کے اذکار
        </button>
        <button onclick="window.Views.setAzkarCategory('salah')" class="py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap ${currentCat === 'salah' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          🕌 نماز کے بعد کے اذکار
        </button>
        <button onclick="window.Views.setAzkarCategory('sleep')" class="py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap ${currentCat === 'sleep' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          🌙 سونے و جاگنے کی دعائیں
        </button>
      </div>

      <!-- Azkar Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        ${filtered.map(a => `
          <div class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  ${a.categoryName}
                </span>
                <span class="badge bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">
                  تکرار: ${a.repeat} بار
                </span>
              </div>

              <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white">${a.title}</h3>

              <!-- Arabic -->
              <p class="font-arabic font-bold text-lg sm:text-xl text-emerald-900 dark:text-emerald-300 leading-loose py-1 select-text">
                «${a.arabic}»
              </p>

              <!-- Urdu Translation -->
              <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                ${a.urdu}
              </p>

              <!-- Virtue / Hadith Reference -->
              <div class="p-3 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-300/40 text-[11px] text-amber-900 dark:text-amber-300 font-bold flex items-center gap-1.5">
                <i data-lucide="award" class="w-4 h-4 text-amber-500 shrink-0"></i>
                <span>${a.virtue}</span>
              </div>
            </div>

            <!-- Action Toolbar -->
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button onclick="window.Views.openInteractiveTasbihModal('${a.arabic.substring(0, 30)}...', ${a.repeat || 33})" class="btn-primary py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow">
                <i data-lucide="play" class="w-3.5 h-3.5"></i>
                <span>تسبیح شروع کریں</span>
              </button>
              <button onclick="window.MediaEngine.openStatusCardGenerator({ arabic: '${a.arabic.replace(/'/g, "\\'")}', translation: '${a.urdu.replace(/'/g, "\\'")}', reference: '${a.virtue.replace(/'/g, "\\'")}', title: '${a.title.replace(/'/g, "\\'")}' })" class="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-slate-950 transition border border-amber-400/30" title="اسٹیٹس کارڈ بنائیں">
                <i data-lucide="sparkles" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.setAzkarCategory = function(cat) {
  window.Views.selectedAzkarCategory = cat;
  window.Views.renderDailyAzkar();
};

// =========================================================================
// INTERACTIVE HAPTIC DIGITAL TASBIH MODAL
// =========================================================================
window.Views.openInteractiveTasbihModal = function(zikrText, targetCount) {
  if (zikrText) window.Views.currentTasbihZikr = zikrText;
  if (targetCount) window.Views.tasbihTarget = targetCount;
  window.Views.tasbihCount = 0;

  const modalId = 'interactive-tasbih-modal';
  const existing = document.getElementById(modalId);
  if (existing) existing.remove();

  const modalHtml = `
    <div id="${modalId}" class="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex items-center justify-center p-3 sm:p-6 font-urdu select-none" dir="rtl">
      <div class="max-w-md w-full bg-slate-900 rounded-3xl p-6 border-2 border-amber-400/50 shadow-2xl space-y-6 text-center text-white relative">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">📿</span>
            <span class="text-sm font-black text-white">سمارٹ ڈیجیٹل تسبیح</span>
          </div>
          <button onclick="document.getElementById('${modalId}').remove()" class="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- Zikr Presets -->
        <div class="flex items-center justify-center gap-1.5 flex-wrap text-xs">
          <button onclick="window.Views.setTasbihPreset('سُبْحَانَ اللّٰهِ', 33)" class="py-1 px-2.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">سبحان اللہ (33)</button>
          <button onclick="window.Views.setTasbihPreset('الْحَمْدُ لِلّٰهِ', 33)" class="py-1 px-2.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">الحمد للہ (33)</button>
          <button onclick="window.Views.setTasbihPreset('اللّٰهُ أَكْبَرُ', 34)" class="py-1 px-2.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">اللہ اکبر (34)</button>
          <button onclick="window.Views.setTasbihPreset('أَسْتَغْفِرُ اللّٰهَ', 100)" class="py-1 px-2.5 rounded-lg bg-amber-950 border border-amber-500/40 text-amber-300 font-bold">استغفار (100)</button>
        </div>

        <!-- Current Zikr Title -->
        <div class="space-y-1 py-1">
          <p id="tasbih-zikr-title" class="font-arabic font-black text-2xl sm:text-3xl text-amber-300">${window.Views.currentTasbihZikr}</p>
          <p class="text-xs text-slate-400">ہدف: <span id="tasbih-target-disp" class="font-mono font-bold text-amber-400">${window.Views.tasbihTarget}</span> بار</p>
        </div>

        <!-- Big Interactive Beaded Tap Button -->
        <div class="flex items-center justify-center py-2">
          <button 
            id="tasbih-main-btn"
            onclick="window.Views.incrementTasbih()"
            class="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-emerald-800 via-teal-700 to-emerald-600 border-4 border-amber-400/80 shadow-[0_0_50px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center active:scale-95 transition cursor-pointer relative"
          >
            <span id="tasbih-count-display" class="text-5xl sm:text-6xl font-black font-mono text-white tracking-wider">
              ${window.Views.tasbihCount}
            </span>
            <span class="text-xs font-bold text-emerald-200 mt-2 font-urdu">ٹیپ کریں (Tap)</span>
          </button>
        </div>

        <!-- Toolbar Buttons -->
        <div class="flex items-center justify-center gap-3 pt-2">
          <button onclick="window.Views.resetTasbih()" class="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> ری سیٹ
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.setTasbihPreset = function(text, target) {
  window.Views.currentTasbihZikr = text;
  window.Views.tasbihTarget = target;
  window.Views.tasbihCount = 0;
  const titleEl = document.getElementById('tasbih-zikr-title');
  const targetEl = document.getElementById('tasbih-target-disp');
  const countEl = document.getElementById('tasbih-count-display');
  if (titleEl) titleEl.innerText = text;
  if (targetEl) targetEl.innerText = target;
  if (countEl) countEl.innerText = '0';
};

window.Views.incrementTasbih = function() {
  window.Views.tasbihCount = (window.Views.tasbihCount || 0) + 1;
  const countEl = document.getElementById('tasbih-count-display');
  const btnEl = document.getElementById('tasbih-main-btn');

  if (countEl) countEl.innerText = window.Views.tasbihCount;

  // Haptic feedback
  if (window.Motion && typeof window.Motion.haptic === 'function') {
    window.Motion.haptic('light');
  }

  // Animation pulse
  if (btnEl) {
    btnEl.classList.remove('tasbih-bead-active');
    void btnEl.offsetWidth;
    btnEl.classList.add('tasbih-bead-active');
  }

  // Lifetime count in localStorage
  const prevLifetime = parseInt(localStorage.getItem('learnhub_tasbih_lifetime_count') || '0', 10);
  localStorage.setItem('learnhub_tasbih_lifetime_count', String(prevLifetime + 1));

  // Milestone Celebration!
  if (window.Views.tasbihCount === window.Views.tasbihTarget) {
    if (window.Motion && typeof window.Motion.celebrate === 'function') {
      window.Motion.celebrate({ count: 80 });
    }
    window.App?.showToast(`🎉 ماشاء اللہ! آپ کا ${window.Views.tasbihTarget} کا ہدف مکمل ہو گیا۔ تقبل اللہ!`, 'success');
  }
};

window.Views.resetTasbih = function() {
  window.Views.tasbihCount = 0;
  const countEl = document.getElementById('tasbih-count-display');
  if (countEl) countEl.innerText = '0';
  window.App?.showToast('تسبیح کاؤنٹر ری سیٹ ہو گیا', 'info');
};

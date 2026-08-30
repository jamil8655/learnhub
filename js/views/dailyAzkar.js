/**
 * LearnHub Masnoon Azkar & Interactive Smart Digital Tasbih Suite v144
 * Features:
 * - Single-Line Mobile Filter Strip (Morning, Evening, After Salah, Sleep/Wakeup, Protection, Tasbih)
 * - Interactive Smart Digital Tasbih with vibration, sounds, bead animation, and reset
 * - Arabic font resizer (A- / A+)
 * - Audio Recitation / Pronunciation
 * - 1080x1080 Dua Canvas Status Card Exporter
 * - 1-Click Copy & Daily Goal Tracker
 */

window.Views = window.Views || {};

window.Views.selectedAzkarCategory = 'all';
window.Views.azkarFontSize = 26;
window.Views.tasbihCount = 0;
window.Views.tasbihTarget = 33;
window.Views.currentTasbihZikr = 'سُبْحَانَ اللّٰهِ';

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
    virtue: 'جو شخص صبح و شام تین بار پڑھے اسے کوئی چیز نقصان نہیں پہنچائے گی۔ (ابو داود، ترمذی)'
  },
  {
    id: 'azkar-m-3',
    category: 'morning',
    categoryName: 'صبح و شام کے اذکار',
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
  },
  {
    id: 'azkar-p-1',
    category: 'protection',
    categoryName: 'حفاظت و شفا',
    title: 'بیماری و نظر بد سے شفا کی دعا',
    arabic: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَاسَ، اشْفِهِ وَأَنْتَ الشَّافِي، لاَ شِفَاءَ إِلاَّ شِفَاؤُكَ، شِفَاءً لاَ يُغَادِرُ سَقَمًا.',
    urdu: 'اے اللہ! تمام انسانوں کے رب! بیماری کو دور فرما دے، شفا عطا فرما، تو ہی شفا دینے والا ہے، تیری شفا کے سوا کوئی شفا نہیں، ایسی شفا دے جو کسی بیماری کو نہ چھوڑے۔',
    english: 'O Allah, Lord of the people, remove the difficulty and bring about healing. You are the Healer...',
    repeat: 1,
    virtue: 'نبی کریم ﷺ بیمار کی عیادت کے وقت یہ دعا پڑھ کر دم فرماتے تھے۔ (صحیح بخاری)'
  }
];

// =========================================================================
// 1. MAIN DAILY AZKAR & TASBIH HUB
// =========================================================================
window.Views.renderDailyAzkar = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentCat = window.Views.selectedAzkarCategory || 'all';
  const filtered = currentCat === 'all' 
    ? MASNOON_AZKAR_LIST 
    : MASNOON_AZKAR_LIST.filter(a => a.category === currentCat);

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="rtl">
      
      <!-- Top Majestic Header (Teal & Gold) -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-4xl mx-auto px-4 py-5 sm:py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">📿</span>
              <div>
                <h1 class="text-xl sm:text-2xl font-black font-arabic leading-tight">الأَذْكَارُ وَالأَدْعِيَةُ الْمَسْنُونَةُ</h1>
                <p class="text-[11px] text-teal-200 font-sans">Daily Remembrances • Digital Smart Tasbih</p>
              </div>
            </div>
            <button onclick="window.Views.openTasbihModal()" class="py-2 px-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-teal-950 text-xs font-black flex items-center gap-1.5 shadow-sm transition active:scale-95">
              <span>📿</span>
              <span>سمارٹ تسبیح</span>
            </button>
          </div>

          <!-- Quick Search Bar -->
          <div class="mt-4 relative">
            <input 
              type="text" 
              id="azkar-search-input" 
              placeholder="مسنون دعا یا ذکر تلاش کریں (مثلاً: صبح، مغفرت، شفا، حفاظت)..." 
              class="w-full bg-teal-900/80 text-white placeholder-teal-300/70 border border-teal-600/60 rounded-2xl py-3 pl-4 pr-11 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 text-right font-urdu"
              oninput="window.Views.filterAzkar(this.value)"
            />
            <i data-lucide="search" class="w-4 h-4 text-teal-300 absolute right-3.5 top-3.5"></i>
          </div>
        </div>

        <!-- 100% SINGLE-LINE Horizontal Filter Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-1.5">
          <div class="max-w-4xl mx-auto px-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            
            <button onclick="window.Views.filterAzkarCategory('all')" class="azkar-pill shrink-0 py-1 px-2.5 rounded-xl transition font-bold ${currentCat === 'all' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              تمام اذکار (${MASNOON_AZKAR_LIST.length})
            </button>
            <button onclick="window.Views.filterAzkarCategory('morning')" class="azkar-pill shrink-0 py-1 px-2.5 rounded-xl transition font-bold ${currentCat === 'morning' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              🌅 صبح و شام
            </button>
            <button onclick="window.Views.filterAzkarCategory('salah')" class="azkar-pill shrink-0 py-1 px-2.5 rounded-xl transition font-bold ${currentCat === 'salah' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              🕌 بعد نماز
            </button>
            <button onclick="window.Views.filterAzkarCategory('sleep')" class="azkar-pill shrink-0 py-1 px-2.5 rounded-xl transition font-bold ${currentCat === 'sleep' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              🌙 سونے جاگنے
            </button>
            <button onclick="window.Views.filterAzkarCategory('protection')" class="azkar-pill shrink-0 py-1 px-2.5 rounded-xl transition font-bold ${currentCat === 'protection' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              🛡️ حفاظت و شفا
            </button>

            <!-- Font Resizer -->
            <div class="shrink-0 flex items-center gap-1 bg-teal-950/80 p-0.5 rounded-xl border border-teal-700/50 font-mono text-xs text-white">
              <button onclick="window.Views.adjustAzkarFontSize(-2)" class="w-6 h-6 rounded-lg bg-teal-800 hover:bg-teal-700 text-amber-300 font-black">A-</button>
              <span id="azkar-font-size-display" class="px-1 text-[11px] font-bold">${window.Views.azkarFontSize}px</span>
              <button onclick="window.Views.adjustAzkarFontSize(2)" class="w-6 h-6 rounded-lg bg-teal-800 hover:bg-teal-700 text-amber-300 font-black">A+</button>
            </div>

          </div>
        </div>
      </div>

      <!-- Main Azkar Feed Canvas -->
      <div class="max-w-3xl mx-auto px-3 sm:px-4 py-4 space-y-4" id="azkar-feed-container">
        ${filtered.map(a => window.Views.renderAzkarCardHtml(a)).join('')}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// =========================================================================
// 2. LUXURY AZKAR CARD RENDERER
// =========================================================================
window.Views.renderAzkarCardHtml = function(a) {
  const fontSize = window.Views.azkarFontSize || 26;

  return `
    <div class="p-4 sm:p-5 rounded-2xl border transition-all duration-200 border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-xs hover:border-teal-500/40 space-y-3" id="azkar-card-${a.id}">
      
      <!-- Top Action Toolbar -->
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 gap-2 font-urdu">
        
        <div class="flex items-center gap-2 min-w-0">
          <span class="px-2.5 py-0.5 rounded-xl bg-teal-800 text-amber-300 text-xs font-black border border-teal-600/60 shadow-xs">
            ${a.categoryName}
          </span>
          <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">${a.title}</h3>
        </div>

        <div class="flex items-center gap-1 sm:gap-1.5 shrink-0" dir="ltr">
          <span class="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-black border border-amber-500/30">تعداد: ${a.repeat} بار</span>

          <!-- 1. Play Audio Speech -->
          <button onclick="window.Views.playDuaAudio('${a.id}')" class="py-1 px-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 hover:bg-teal-800 hover:text-white border border-teal-600/30 transition flex items-center gap-1 shrink-0" title="صوتی دعا سنیں">
            <i data-lucide="volume-2" class="w-3.5 h-3.5 text-teal-600 dark:text-teal-400"></i>
            <span class="text-[11px] hidden sm:inline">سماعت</span>
          </button>

          <!-- 2. Status Card Generator -->
          <button onclick="window.Views.openDuaCardModal('${a.id}')" class="py-1 px-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-teal-800 hover:text-amber-300 transition flex items-center gap-1 border border-slate-200/80 dark:border-slate-700/80 shrink-0" title="خوبصورت دعا اسٹیٹس کارڈ بنائیں">
            <i data-lucide="share-2" class="w-3.5 h-3.5 text-emerald-500"></i>
            <span class="text-[11px] hidden sm:inline">کارڈ</span>
          </button>

          <!-- 3. 1-Click Copy -->
          <button onclick="window.Views.copyDua('${a.id}')" class="py-1 px-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-teal-800 hover:text-amber-300 transition flex items-center gap-1 border border-slate-200/80 dark:border-slate-700/80 shrink-0" title="کاپی کریں">
            <i data-lucide="copy" class="w-3.5 h-3.5 text-indigo-500"></i>
          </button>
        </div>

      </div>

      <!-- Vocalized Arabic Text -->
      <div class="py-2 text-right">
        <p class="font-arabic font-bold text-slate-900 dark:text-white leading-relaxed select-text" style="font-size: ${fontSize}px; line-height: 2.4;">
          ${a.arabic}
        </p>
      </div>

      <!-- Urdu Translation -->
      <div class="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-right font-urdu">
        <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-loose">${a.urdu}</p>
      </div>

      <!-- Virtue & Reference Footer -->
      <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-teal-800 dark:text-teal-300 font-urdu bg-teal-50/50 dark:bg-teal-950/30 p-2.5 rounded-xl border border-teal-600/20">
        <div class="flex items-center gap-1.5">
          <span>✨</span>
          <span class="font-bold text-[11px] sm:text-xs">${a.virtue}</span>
        </div>
      </div>

    </div>
  `;
};

// =========================================================================
// 3. CONTROLLERS & ACTIONS
// =========================================================================
window.Views.filterAzkarCategory = function(cat) {
  window.Views.selectedAzkarCategory = cat;
  window.Views.renderDailyAzkar();
};

window.Views.adjustAzkarFontSize = function(delta) {
  window.Views.azkarFontSize = Math.max(18, Math.min(48, (window.Views.azkarFontSize || 26) + delta));
  const disp = document.getElementById('azkar-font-size-display');
  if (disp) disp.textContent = window.Views.azkarFontSize + 'px';
  document.querySelectorAll('#azkar-feed-container p.font-arabic').forEach(el => {
    el.style.fontSize = window.Views.azkarFontSize + 'px';
  });
};

window.Views.filterAzkar = function(query) {
  const q = (query || '').toLowerCase().trim();
  const feed = document.getElementById('azkar-feed-container');
  if (!feed) return;

  const matches = MASNOON_AZKAR_LIST.filter(a => 
    a.title.includes(q) ||
    a.arabic.includes(q) || 
    a.urdu.includes(q) || 
    a.categoryName.includes(q)
  );

  if (matches.length === 0) {
    feed.innerHTML = `<div class="p-10 text-center text-slate-400 font-urdu text-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">تلاش کے مطابق کوئی ذکر نہیں ملا۔</div>`;
    return;
  }

  feed.innerHTML = matches.map(a => window.Views.renderAzkarCardHtml(a)).join('');
  if (window.lucide) window.lucide.createIcons();
};

window.Views.playDuaAudio = function(duaId) {
  const d = MASNOON_AZKAR_LIST.find(item => item.id === duaId);
  if (!d) return;
  if (!('speechSynthesis' in window)) {
    window.App?.showToast('براؤزر میں آڈیو اسپیچ کی سہولت موجود نہیں ہے۔', 'warning');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(d.arabic);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.85;
  const voices = window.speechSynthesis.getVoices();
  const arVoice = voices.find(v => v.lang && v.lang.startsWith('ar'));
  if (arVoice) utterance.voice = arVoice;

  window.speechSynthesis.speak(utterance);
  window.App?.showToast('مسنون دعا کا عربی تلفظ جاری ہے... 🔊', 'info');
};

window.Views.copyDua = function(duaId) {
  const d = MASNOON_AZKAR_LIST.find(item => item.id === duaId);
  if (!d) return;
  const text = `${d.title}:\n${d.arabic}\n\nاردو ترجمہ:\n${d.urdu}\n\nفضیلت و حوالہ: ${d.virtue}\nماخوذ از LearnHub: https://learnhubplatform.com/#/duas`;
  navigator.clipboard.writeText(text).then(() => {
    window.App?.showToast('مسنون دعا متن اور ترجمے سمیت کاپی ہو گئی! 📋', 'success');
  });
};

// =========================================================================
// 4. SMART DIGITAL TASBIH MODAL
// =========================================================================
window.Views.openTasbihModal = function() {
  const modal = `
    <div id="tasbih-modal" class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="max-w-sm w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-center flex flex-col items-center">
        
        <div class="w-full flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div class="flex items-center gap-2">
            <span class="text-xl">📿</span>
            <h3 class="text-sm font-black text-slate-900 dark:text-white">سمارٹ ڈیجیٹل تسبیح</h3>
          </div>
          <button onclick="document.getElementById('tasbih-modal').remove()" class="p-1 text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>

        <!-- Zikr Selector Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full py-1 text-xs">
          <button onclick="window.Views.setTasbihZikr('سُبْحَانَ اللّٰهِ')" class="py-1 px-3 rounded-xl bg-teal-800 text-amber-300 font-bold border border-teal-600 shrink-0">سبحان اللہ</button>
          <button onclick="window.Views.setTasbihZikr('الْحَمْدُ لِلّٰهِ')" class="py-1 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold shrink-0">الحمد للہ</button>
          <button onclick="window.Views.setTasbihZikr('اللّٰهُ أَكْبَرُ')" class="py-1 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold shrink-0">اللہ اکبر</button>
          <button onclick="window.Views.setTasbihZikr('أَسْتَغْفِرُ اللّٰهَ')" class="py-1 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold shrink-0">استغفار</button>
        </div>

        <!-- Current Zikr Display -->
        <div class="py-2">
          <p id="tasbih-zikr-text" class="text-2xl font-arabic font-extrabold text-teal-800 dark:text-amber-300">${window.Views.currentTasbihZikr}</p>
        </div>

        <!-- Circular Tap Counter Button -->
        <div class="relative flex items-center justify-center cursor-pointer select-none group" onclick="window.Views.incrementTasbih()">
          <div class="w-48 h-48 rounded-full bg-gradient-to-tr from-teal-900 via-teal-800 to-teal-700 text-white flex flex-col items-center justify-center shadow-2xl border-4 border-amber-400/50 group-active:scale-95 transition-transform duration-100 ring-8 ring-teal-500/20">
            <span id="tasbih-number-display" class="font-mono text-5xl font-black text-amber-300">${window.Views.tasbihCount}</span>
            <span class="text-xs text-teal-200 mt-1">ہدف: ${window.Views.tasbihTarget}</span>
            <span class="text-[10px] text-amber-400/80 uppercase font-mono mt-0.5">ٹیپ کریں</span>
          </div>
        </div>

        <!-- Counter Actions -->
        <div class="flex items-center justify-center gap-3 w-full pt-2">
          <button onclick="window.Views.resetTasbih()" class="py-2 px-5 rounded-2xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-xs font-bold transition flex items-center gap-1 border border-rose-500/20">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
            <span>ری سیٹ</span>
          </button>
          <button onclick="window.Views.setTasbihTarget(33)" class="py-2 px-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">33</button>
          <button onclick="window.Views.setTasbihTarget(100)" class="py-2 px-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">100</button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.incrementTasbih = function() {
  window.Views.tasbihCount++;
  if (navigator.vibrate) {
    navigator.vibrate(40);
  }
  const disp = document.getElementById('tasbih-number-display');
  if (disp) disp.textContent = window.Views.tasbihCount;

  if (window.Views.tasbihCount % window.Views.tasbihTarget === 0) {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    window.App?.showToast(`ماشاء اللہ! ${window.Views.tasbihTarget} اذکار مکمل ہو گئے۔ 🎉`, 'success');
  }
};

window.Views.resetTasbih = function() {
  window.Views.tasbihCount = 0;
  const disp = document.getElementById('tasbih-number-display');
  if (disp) disp.textContent = '0';
};

window.Views.setTasbihTarget = function(tgt) {
  window.Views.tasbihTarget = tgt;
  window.Views.resetTasbih();
  window.App?.showToast(`ہدف مقرر کیا گیا: ${tgt}`, 'info');
};

window.Views.setTasbihZikr = function(zkr) {
  window.Views.currentTasbihZikr = zkr;
  const textEl = document.getElementById('tasbih-zikr-text');
  if (textEl) textEl.textContent = zkr;
};

// =========================================================================
// 5. HIGH-RES DUA STATUS CARD MODAL
// =========================================================================
window.Views.openDuaCardModal = function(duaId) {
  const d = MASNOON_AZKAR_LIST.find(item => item.id === duaId);
  if (!d) return;
  const shareUrl = `https://learnhubplatform.com/#/duas`;

  const modal = `
    <div id="dua-card-modal" class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-urdu" dir="rtl">
      <div class="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[95vh] flex flex-col">
        
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div class="flex items-center gap-2">
            <span class="text-lg">🎨</span>
            <h3 class="text-sm font-black text-slate-900 dark:text-white">مسنون دعا اسٹیٹس کارڈ</h3>
          </div>
          <button onclick="document.getElementById('dua-card-modal').remove()" class="p-1 text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>

        <div id="dua-card-target" class="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-teal-950 via-slate-950 to-slate-950 border-2 border-amber-400/40 shadow-2xl text-center space-y-4 text-white relative overflow-hidden">
          
          <div class="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/50 rounded-tr-xl"></div>
          <div class="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/50 rounded-tl-xl"></div>
          <div class="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/50 rounded-br-xl"></div>
          <div class="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/50 rounded-bl-xl"></div>

          <div class="space-y-1">
            <p class="text-xs font-bold text-amber-300/90 tracking-widest uppercase">الأَدْعِيَةُ الْمَسْنُونَةُ • مسنون دعائیں</p>
            <p class="text-base font-urdu text-teal-200 font-bold">${d.title}</p>
          </div>

          <div class="py-2">
            <p class="font-arabic font-extrabold text-xl sm:text-2xl text-white leading-loose text-justify text-center">
              ${d.arabic}
            </p>
          </div>

          <div class="py-2 border-t border-teal-800/80 space-y-1">
            <p class="text-xs sm:text-sm text-teal-100 font-urdu leading-relaxed">
              ${d.urdu}
            </p>
          </div>

          <div class="inline-block py-1 px-4 rounded-xl bg-teal-900/90 border border-teal-600/60 text-amber-300 text-xs font-bold">
            ${d.virtue}
          </div>

          <div class="pt-3 border-t border-slate-800/90 flex items-center justify-between text-[10px] text-teal-300 font-mono">
            <a href="${shareUrl}" target="_blank" class="hover:underline flex items-center gap-1">
              <span>🌐 learnhubplatform.com</span>
            </a>
            <span>LearnHub Azkar Suite</span>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 pt-1">
          <button onclick="window.Views.downloadDuaCanvasCard('${d.id}')" class="py-2.5 px-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition">
            <i data-lucide="download" class="w-4 h-4"></i>
            <span>تصویر ڈاؤن لوڈ</span>
          </button>
          <button onclick="window.Views.copyDua('${d.id}')" class="py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 active:scale-95 transition">
            <i data-lucide="copy" class="w-4 h-4"></i>
            <span>متن کاپی</span>
          </button>
          <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(d.arabic + '\n\n' + d.urdu + '\n\n[' + d.title + ']\n' + shareUrl)}" target="_blank" class="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition">
            <i data-lucide="message-circle" class="w-4 h-4"></i>
            <span>واٹس ایپ</span>
          </a>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modal);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.downloadDuaCanvasCard = function(duaId) {
  const node = document.getElementById('dua-card-target');
  if (!node) return;

  window.App?.showToast('تصویر تیار ہو رہی ہے... ⏳', 'info');

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1080;
  canvas.height = 1080;

  const grad = ctx.createLinearGradient(0, 0, 0, 1080);
  grad.addColorStop(0, '#042f2e');
  grad.addColorStop(0.5, '#021817');
  grad.addColorStop(1, '#020b0a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1080);

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, 1020, 1020);

  ctx.strokeStyle = 'rgba(20, 184, 166, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(45, 45, 990, 990);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('الأَدْعِيَةُ الْمَسْنُونَةُ • مسنون دعائیں', 540, 120);

  const arText = node.querySelector('p.font-arabic')?.innerText || '';
  const urText = node.querySelector('p.font-urdu')?.innerText || '';
  const refText = node.querySelector('.bg-teal-900\\/90')?.innerText || '';

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px sans-serif';
  window.Views._wrapCanvasText(ctx, arText, 540, 260, 900, 65);

  ctx.fillStyle = '#5eead4';
  ctx.font = '28px sans-serif';
  window.Views._wrapCanvasText(ctx, urText, 540, 650, 900, 50);

  ctx.fillStyle = 'rgba(19, 78, 74, 0.9)';
  ctx.fillRect(200, 890, 680, 55);
  ctx.strokeStyle = '#fbbf24';
  ctx.strokeRect(200, 890, 680, 55);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(refText, 540, 928);

  ctx.fillStyle = '#5eead4';
  ctx.font = '20px monospace';
  ctx.fillText('learnhubplatform.com • LearnHub Azkar Suite', 540, 1010);

  const link = document.createElement('a');
  link.download = `Masnoon-Dua-${duaId}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();

  window.App?.showToast('دعا کا خوبصورت کارڈ ڈاؤن لوڈ ہو گیا! 🖼️✨', 'success');
};

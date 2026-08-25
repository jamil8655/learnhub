/**
 * LearnHub Daily Masnoon Azkar & Supplications Suite
 * Morning & Evening Azkar, Post-Salah remembrance, Sleep/Wakeup Duas,
 * Protection & Healing Ruqyah with interactive counters and authentic references.
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

window.Views.renderDailyAzkar = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentCat = window.Views.selectedAzkarCategory || 'all';
  const filtered = currentCat === 'all' 
    ? MASNOON_AZKAR_LIST 
    : MASNOON_AZKAR_LIST.filter(a => a.category === currentCat);

  const isRtl = window.I18N ? window.I18N.isRTL() : true;

  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 ${isRtl ? 'font-urdu text-right' : 'text-left'} w-full max-w-full overflow-hidden" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Azkar Banner -->
      <div class="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-emerald-500/40 text-center space-y-3">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold shadow-sm">
          <span>✨ قلوب کا سکون: مسنون ادعیہ و اذکار</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-extrabold text-white font-arabic">صبح و شام کے مسنون اذکار و دعائیں</h1>
        <p class="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          حصن المسلم اور صحاحِ ستہ سے ماخوذ مستند اذکارِ نبویہ ﷺ مع تسبیح کاؤنٹر، عربی اعراب، اردو ترجمہ اور فضائل۔
        </p>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-urdu">
        <button onclick="window.Views.switchAzkarCategory('all')" class="py-2.5 px-4 rounded-2xl text-xs font-bold shrink-0 transition ${currentCat === 'all' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}">
          تمام مسنون دعائیں
        </button>
        <button onclick="window.Views.switchAzkarCategory('morning')" class="py-2.5 px-4 rounded-2xl text-xs font-bold shrink-0 transition ${currentCat === 'morning' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}">
          🌅 صبح و شام کے اذکار
        </button>
        <button onclick="window.Views.switchAzkarCategory('salah')" class="py-2.5 px-4 rounded-2xl text-xs font-bold shrink-0 transition ${currentCat === 'salah' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}">
          🕌 نماز کے بعد کے اذکار
        </button>
        <button onclick="window.Views.switchAzkarCategory('sleep')" class="py-2.5 px-4 rounded-2xl text-xs font-bold shrink-0 transition ${currentCat === 'sleep' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}">
          🌙 سونے اور جاگنے کے اذکار
        </button>
      </div>

      <!-- Azkar Cards List -->
      <div class="space-y-6">
        ${filtered.map(item => `
          <div class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative group hover:border-emerald-500 transition" id="azkar-card-${item.id}">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span class="badge bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300/40">
                ${item.categoryName} • تکرار: ${item.repeat} بار
              </span>
              
              <!-- Interactive Counter Button -->
              <button 
                onclick="window.Views.incrementAzkarCounter('${item.id}', ${item.repeat})"
                id="azkar-counter-btn-${item.id}"
                class="py-1.5 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-xs hover:bg-emerald-600 hover:text-white transition active:scale-95 flex items-center gap-1.5"
              >
                <span>پڑھا: </span>
                <span id="azkar-count-${item.id}" class="text-emerald-600 dark:text-emerald-400 font-extrabold">0</span> / ${item.repeat}
              </button>
            </div>

            <h3 class="text-base font-black text-slate-900 dark:text-white">${item.title}</h3>

            <!-- Arabic Text -->
            <p class="text-xl sm:text-2xl font-arabic font-bold text-emerald-900 dark:text-emerald-300 text-right leading-loose py-2 tracking-wide break-words" dir="rtl">
              «${item.arabic}»
            </p>

            <!-- Urdu Translation -->
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 text-right font-urdu space-y-1">
              <span class="text-xs font-bold text-slate-400 block mb-0.5">اردو ترجمہ و مفہوم:</span>
              <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">${item.urdu}</p>
            </div>

            <!-- Virtue / Reference -->
            <div class="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/60 border border-emerald-200 dark:border-slate-700 text-xs text-emerald-800 dark:text-emerald-300 font-bold leading-relaxed">
              ✨ <strong>فضیلت و حوالہ:</strong> ${item.virtue}
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.switchAzkarCategory = function(cat) {
  window.Views.selectedAzkarCategory = cat;
  window.Views.renderDailyAzkar();
};

window.Views.incrementAzkarCounter = function(id, max) {
  const countEl = document.getElementById(`azkar-count-${id}`);
  if (!countEl) return;
  let curr = parseInt(countEl.textContent || '0', 10);
  curr++;
  if (curr > max) curr = 1;
  countEl.textContent = curr;

  if (curr === max) {
    window.App?.showToast('ماشاءاللہ! ذکر مکمل ہو گیا ✨', 'success');
  }
};

/**
 * LearnHub Hadith Sharif Module
 * Authentic collections from Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami` at-Tirmidhi,
 * and 40 Hadith Nawawi with Arabic script, Urdu translation, English translation,
 * instant search, book filters, bookmarks, and 1-click sharing.
 */

window.Views = window.Views || {};

const EXPANDED_HADITHS = [
  {
    id: 'bukhari-1',
    bookId: 'bukhari',
    book: 'صحیح بخاری (Sahih al-Bukhari)',
    chapter: 'کتاب بدء الوحی (Book of Revelation)',
    hadithNumber: '1',
    narrator: 'عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.',
    textUrdu: 'تمام اعمال کا دارومدار نیتوں پر ہے اور ہر شخص کے لیے وہی ہے جس کی اس نے نیت کی۔ پس جس کی ہجرت دنیا کے لیے ہو جسے وہ پانا چاہتا ہے یا کسی عورت کے لیے جس سے وہ نکاح کرنا چاہتا ہے، تو اس کی ہجرت اسی کے لیے ہے جس کی طرف اس نے ہجرت کی۔',
    textEnglish: 'Actions are according to intentions, and everyone will get what was intended for them. Whoever migrated for the sake of the world or to marry a woman, his migration was for what he migrated to.',
    grade: 'صحیح (Sahih)'
  },
  {
    id: 'muslim-1',
    bookId: 'muslim',
    book: 'صحیح مسلم (Sahih Muslim)',
    chapter: 'کتاب العلم (Book of Knowledge)',
    hadithNumber: '2699',
    narrator: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ.',
    textUrdu: 'جو شخص علم حاصل کرنے کے لیے کسی راستے پر چلے، اللہ تعالیٰ اس کے لیے جنت کا راستہ آسان فرما دیتا ہے۔',
    textEnglish: 'Whoever treads a path in search of knowledge, Allah will make easy for him the path to Paradise.',
    grade: 'صحیح (Sahih)'
  },
  {
    id: 'bukhari-2',
    bookId: 'bukhari',
    book: 'صحیح بخاری (Sahih al-Bukhari)',
    chapter: 'کتاب الایمان (Book of Faith)',
    hadithNumber: '13',
    narrator: 'عَنْ أَنَسٍ رَضِيَ اللَّهُ عَنْهُ عَنِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ',
    textArabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.',
    textUrdu: 'تم میں سے کوئی شخص اس وقت تک سچا مومن نہیں ہو سکتا جب تک وہ اپنے بھائی کے لیے بھی وہی پسند نہ کرے جو وہ اپنی ذات کے لیے پسند کرتا ہے۔',
    textEnglish: 'None of you truly believes until he loves for his brother what he loves for himself.',
    grade: 'متفق علیہ (Agreed Upon)'
  },
  {
    id: 'bukhari-3',
    bookId: 'bukhari',
    book: 'صحیح بخاری (Sahih al-Bukhari)',
    chapter: 'کتاب فضائل القرآن (Virtues of the Quran)',
    hadithNumber: '5027',
    narrator: 'عَنْ عُثْمَانَ رَضِيَ اللَّهُ عَنْهُ عَنِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ',
    textArabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ.',
    textUrdu: 'تم میں سب سے بہترین وہ شخص ہے جو قرآن سیکھے اور دوسروں کو سکھائے۔',
    textEnglish: 'The best among you are those who learn the Quran and teach it.',
    grade: 'صحیح (Sahih)'
  },
  {
    id: 'tirmidhi-1',
    bookId: 'tirmidhi',
    book: 'جامع ترمذی (Jami` at-Tirmidhi)',
    chapter: 'کتاب البر والصلة (Righteousness & Relations)',
    hadithNumber: '1956',
    narrator: 'عَنْ أَبِي ذَرٍّ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ.',
    textUrdu: 'اپنے مسلمان بھائی کے سامنے مسکرانا بھی تمہارے لیے صدقہ ہے۔',
    textEnglish: 'Your smiling in the face of your brother is charity for you.',
    grade: 'حسن غریب (Hasan)'
  },
  {
    id: 'nawawi-1',
    bookId: 'nawawi',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'کتاب الزہد (Book of Asceticism)',
    hadithNumber: '31',
    narrator: 'عَنْ أَبِي الْعَبَّاسِ سَهْلِ بْنِ سَعْدٍ السَّاعِدِيِّ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'ازْهَدْ فِي الدُّنْيَا يُحِبَّكَ اللَّهُ، وَازْهَدْ فِيمَا فِي أَيْدِي النَّاسِ يُحِبَّكَ النَّاسُ.',
    textUrdu: 'دنیا سے بے رغبتی اختیار کرو اللہ تم سے محبت کرے گا، اور جو کچھ لوگوں کے پاس ہے اس سے بے نیازی برتو لوگ تم سے محبت کریں گے۔',
    textEnglish: 'Renounce the world and Allah will love you, and renounce what is in the hands of people and people will love you.',
    grade: 'حسن (Hasan)'
  }
];

window.Views.selectedHadithBook = 'all';

window.Views.renderHadith = async function() {
  const container = document.getElementById('main-content');
  const book = window.Views.selectedHadithBook;
  const bookmarks = JSON.parse(localStorage.getItem('learnhub_hadith_bookmarks') || '[]');

  const filtered = book === 'all' 
    ? EXPANDED_HADITHS 
    : book === 'bookmarks' 
      ? EXPANDED_HADITHS.filter(h => bookmarks.includes(h.id))
      : EXPANDED_HADITHS.filter(h => h.bookId === book);

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Hadith Hero Banner -->
      <div class="bg-gradient-to-r from-amber-700 via-amber-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-amber-500/30">
        <div class="relative z-10 space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold font-urdu">
            <span>✨ الحدیث النبوی الشریف</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold font-urdu">احادیثِ مبارکہ کا مستند خزانہ</h1>
          <p class="text-xs sm:text-sm text-amber-100 max-w-2xl font-urdu leading-relaxed">
            صحیح بخاری، صحیح مسلم، جامع ترمذی اور اربعین نووی سے منتخب شدہ ارشاداتِ نبوی ﷺ مکمل عربی اعراب، سلیس اردو ترجمہ اور انگریزی معانی کے ساتھ۔
          </p>

          <!-- Search Bar -->
          <div class="pt-2 max-w-md">
            <div class="relative">
              <input type="text" id="hadith-search-input" oninput="window.Views.filterHadiths(this.value)" placeholder="حدیث، راوی یا موضوع تلاش کریں..." class="w-full bg-white/10 backdrop-blur border border-white/20 text-white placeholder-amber-200/60 rounded-2xl py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 font-urdu">
              <i data-lucide="search" class="w-4 h-4 text-amber-300 absolute right-3.5 top-3"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Book Filter Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 font-urdu">
        <button onclick="window.Views.filterHadithBook('all')" class="hadith-tab-btn py-2 px-4 rounded-xl text-xs font-bold transition ${book === 'all' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
          تمام کتب (${EXPANDED_HADITHS.length})
        </button>
        <button onclick="window.Views.filterHadithBook('bukhari')" class="hadith-tab-btn py-2 px-4 rounded-xl text-xs font-bold transition ${book === 'bukhari' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
          صحیح بخاری
        </button>
        <button onclick="window.Views.filterHadithBook('muslim')" class="hadith-tab-btn py-2 px-4 rounded-xl text-xs font-bold transition ${book === 'muslim' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
          صحیح مسلم
        </button>
        <button onclick="window.Views.filterHadithBook('tirmidhi')" class="hadith-tab-btn py-2 px-4 rounded-xl text-xs font-bold transition ${book === 'tirmidhi' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
          جامع ترمذی
        </button>
        <button onclick="window.Views.filterHadithBook('nawawi')" class="hadith-tab-btn py-2 px-4 rounded-xl text-xs font-bold transition ${book === 'nawawi' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
          اربعین نووی
        </button>
        <button onclick="window.Views.filterHadithBook('bookmarks')" class="hadith-tab-btn py-2 px-4 rounded-xl text-xs font-bold transition ${book === 'bookmarks' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
          ⭐ محفوظ شدہ (${bookmarks.length})
        </button>
      </div>

      <!-- Hadith Feed List -->
      <div id="hadith-feed-container" class="space-y-6">
        ${filtered.length === 0 ? `
          <div class="lh-card p-12 text-center text-slate-400 font-urdu text-sm">
            کوئی حدیث دستیاب نہیں ہے۔
          </div>
        ` : filtered.map(h => {
          const isBookmarked = bookmarks.includes(h.id);
          return `
            <div class="lh-card p-6 sm:p-8 space-y-5 border-r-4 border-r-amber-500 hover:shadow-2xl transition relative group">
              
              <!-- Header Bar -->
              <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 font-urdu">
                <div>
                  <span class="font-extrabold text-amber-600 dark:text-amber-400 text-xs">${h.book}</span>
                  <span class="text-slate-400 text-xs mx-2">•</span>
                  <span class="text-xs text-slate-500">${h.chapter}</span>
                </div>
                
                <div class="flex items-center gap-2">
                  <span class="badge badge-success text-[10px]">${h.grade}</span>
                  <span class="badge badge-neutral text-[10px] font-mono">#${h.hadithNumber}</span>
                  
                  <!-- Copy Button -->
                  <button onclick="window.Views.copyHadith('${h.id}')" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-500 transition" title="کاپی کریں">
                    <i data-lucide="copy" class="w-4 h-4"></i>
                  </button>

                  <!-- Bookmark Button -->
                  <button onclick="window.Views.toggleHadithBookmark('${h.id}')" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${isBookmarked ? 'text-amber-500 fill-amber-500' : 'text-slate-400'} transition" title="بک مارک کریں">
                    <i data-lucide="bookmark" class="w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}"></i>
                  </button>
                </div>
              </div>

              <!-- Narrator -->
              <div class="text-xs font-bold text-slate-400 text-right font-urdu" dir="rtl">
                ${h.narrator}
              </div>

              <!-- Arabic Hadith Text -->
              <p class="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 text-right leading-loose py-2 tracking-wide" dir="rtl">
                «${h.textArabic}»
              </p>

              <!-- Urdu Translation -->
              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 text-right font-urdu" dir="rtl">
                <span class="text-[11px] uppercase font-extrabold text-amber-600 dark:text-amber-400 block mb-1">اردو ترجمہ:</span>
                <p class="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-urdu">${h.textUrdu}</p>
              </div>

              <!-- English Translation -->
              <div class="pt-2 text-left">
                <span class="text-[11px] uppercase font-bold text-indigo-500 block mb-0.5 font-mono">English Translation:</span>
                <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">${h.textEnglish}</p>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.filterHadithBook = function(bookId) {
  window.Views.selectedHadithBook = bookId;
  window.Views.renderHadith();
};

window.Views.filterHadiths = function(query) {
  const q = query.toLowerCase().trim();
  const feed = document.getElementById('hadith-feed-container');
  if (!feed) return;

  const matches = EXPANDED_HADITHS.filter(h => 
    h.textArabic.includes(q) || 
    h.textUrdu.includes(q) || 
    h.textEnglish.toLowerCase().includes(q) ||
    h.book.toLowerCase().includes(q) ||
    h.narrator.includes(q)
  );

  if (matches.length === 0) {
    feed.innerHTML = `<div class="lh-card p-12 text-center text-slate-400 font-urdu text-sm">تلاش کے مطابق کوئی حدیث نہیں ملی۔</div>`;
    return;
  }

  const bookmarks = JSON.parse(localStorage.getItem('learnhub_hadith_bookmarks') || '[]');
  feed.innerHTML = matches.map(h => `
    <div class="lh-card p-6 sm:p-8 space-y-4 border-r-4 border-r-amber-500 hover:shadow-xl transition">
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <span class="font-bold text-amber-600 text-xs font-urdu">${h.book}</span>
        <span class="badge badge-success text-[10px]">${h.grade}</span>
      </div>
      <p class="text-xl font-serif font-bold text-right leading-loose" dir="rtl">«${h.textArabic}»</p>
      <p class="text-sm text-slate-700 dark:text-slate-300 text-right font-urdu" dir="rtl">${h.textUrdu}</p>
      <p class="text-xs text-slate-500">${h.textEnglish}</p>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
};

window.Views.copyHadith = function(hadithId) {
  const h = EXPANDED_HADITHS.find(item => item.id === hadithId);
  if (!h) return;
  const text = `قال رسول الله ﷺ:\n${h.textArabic}\n\nاردو ترجمہ:\n${h.textUrdu}\n\nحوالہ: ${h.book} (حدیث نمبر: ${h.hadithNumber})\nماخوذ از LearnHub: https://jamil8655.github.io/learnhub/#/hadith`;
  navigator.clipboard.writeText(text).then(() => {
    window.App.showToast('حدیث مبارکہ متن اور ترجمہ سمیت کاپی ہو گئی!', 'success');
  }).catch(() => {
    window.App.showToast('کاپی نہیں ہو سکی', 'warning');
  });
};

window.Views.toggleHadithBookmark = function(hadithId) {
  let bookmarks = JSON.parse(localStorage.getItem('learnhub_hadith_bookmarks') || '[]');
  if (bookmarks.includes(hadithId)) {
    bookmarks = bookmarks.filter(id => id !== hadithId);
    window.App.showToast('حدیث بک مارکس سے ہٹا دی گئی۔', 'info');
  } else {
    bookmarks.push(hadithId);
    window.App.showToast('حدیث محفوظ شدہ فہرست میں شامل ہو گئی! ⭐', 'success');
  }
  localStorage.setItem('learnhub_hadith_bookmarks', JSON.stringify(bookmarks));
  window.Views.renderHadith();
};

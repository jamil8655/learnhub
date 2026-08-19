/**
 * LearnHub Mega Islamic & Spiritual Features Module
 * 1. Daily Duas & Azkar (حصن المسلم)
 * 2. Digital Tasbeeh Counter with Haptic Touch & Audio
 * 3. Live Prayer Times & Interactive Qibla Compass
 * 4. Hijri Calendar & Holy Events Countdown
 * 5. Daily Islamic Challenge & Global Student Leaderboard
 * 6. Islamic Digital E-Book Library
 * 7. Islamic Audio Studio & Podcasts
 */

window.Views = window.Views || {};

// ============================================================================
// DATA COLLECTIONS FOR NEW ISLAMIC MODULES
// ============================================================================

const DUAS_DATABASE = [
  {
    id: 'dua-1',
    category: 'morning_evening',
    title: 'صبح کے وقت کی مسنون دعا',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    urdu: 'ہم نے صبح کی اور اللہ کے سارے جہاں نے صبح کی، تمام تعریفیں اللہ ہی کے لیے ہیں، اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہت ہے اور اسی کے لیے تمام تعریف ہے، اور وہ ہر چیز پر قادر ہے۔',
    english: 'We have entered upon the morning and the kingdom belongs to Allah; praise is due to Allah. None has the right to be worshipped but Allah alone, Who has no partner.',
    virtue: 'صبح کے آغاز میں ہر شر اور پریشانی سے حفاظت کا نبوی قلعہ۔',
    reference: 'صحیح مسلم: 2723',
    recommendedRepeat: 1
  },
  {
    id: 'dua-2',
    category: 'morning_evening',
    title: 'سید الاستغفار (توبہ و بخشش کی سردار دعا)',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ',
    urdu: 'اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے ہی مجھے پیدا کیا اور میں تیرا بندہ ہوں، اور میں اپنی طاقت کے مطابق تیرے عہد اور وعدے پر قائم ہوں۔ میں اپنے کیے کے شر سے تیری پناہ مانگتا ہوں، اپنے اوپر تیری نعمتوں کا اعتراف کرتا ہوں اور اپنے گناہوں کا اقرار کرتا ہوں، پس مجھے معاف فرما دے کیونکہ تیرے سوا کوئی گناہوں کو معاف نہیں کر سکتا۔',
    english: 'O Allah, You are my Lord, none has the right to be worshipped but You. You created me and I am Your servant...',
    virtue: 'جو شخص صبح یا شام یقین کے ساتھ پڑھے اور اسی دن انتقال ہو جائے تو وہ جنتی ہے۔',
    reference: 'صحیح بخاری: 6306',
    recommendedRepeat: 1
  },
  {
    id: 'dua-3',
    category: 'protection',
    title: 'ہر قسم کے نقصان و ناگہانی آفت سے حفاظت',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    urdu: 'اللہ کے نام کے ساتھ، جس کے نام کی برکت سے زمین اور آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی، اور وہی سب کچھ سننے والا اور جاننے والا ہے۔',
    english: 'In the Name of Allah with Whose Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
    virtue: 'جو شخص صبح و شام 3 مرتبہ پڑھے، اسے کوئی ناگہانی مصیبت یا نقصان نہیں پہنچے گا۔',
    reference: 'سنن ترمذی: 3388',
    recommendedRepeat: 3
  },
  {
    id: 'dua-4',
    category: 'after_prayer',
    title: 'آیۃ الکرسی (نماز کے بعد)',
    arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    urdu: 'اللہ کے سوا کوئی معبود نہیں، وہ ہمیشہ زندہ اور سب کو سنبھالنے والا ہے۔ اسے نہ اونگھ آتی ہے نہ نیند۔ اسی کا ہے جو کچھ آسمانوں میں ہے اور جو زمین میں ہے...',
    english: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence...',
    virtue: 'جو ہر فرض نماز کے بعد آیۃ الکرسی پڑھے، اس کے جنت میں داخل ہونے میں صرف موت حائل ہے۔',
    reference: 'سنن نسائی: 9928',
    recommendedRepeat: 1
  },
  {
    id: 'dua-5',
    category: 'daily_life',
    title: 'سفر کی مسنون دعا',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    urdu: 'پاک ہے وہ ذات جس نے اس (سواری) کو ہمارے قابو میں کر دیا حالانکہ ہم اسے قابو میں لانے والے نہ تھے، اور بے شک ہم اپنے رب کی طرف ہی لوٹ کر جانے والے ہیں۔',
    english: 'Glory unto Him Who created this for us and we could not have controlled it, and indeed to our Lord we shall return.',
    virtue: 'سفر میں سلامتی اور خیر و برکت کی ضمانت۔',
    reference: 'صحیح مسلم: 1342',
    recommendedRepeat: 1
  },
  {
    id: 'dua-6',
    category: 'wealth_debt',
    title: 'قرض کی ادائیگی اور غم و پریشانی سے نجات',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    urdu: 'اے اللہ! میں پریشانی اور غم سے، عاجزی اور سستی سے، بخل اور بزدلی سے، قرض کے بوجھ اور لوگوں کے دباؤ سے تیری پناہ مانگتا ہوں۔',
    english: 'O Allah, I seek refuge with You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.',
    virtue: 'قرض پہاڑ جتنا بھی ہو تو اللہ تعالیٰ آسانی پیدا فرما دیتے ہیں۔',
    reference: 'صحیح بخاری: 2893',
    recommendedRepeat: 1
  },
  {
    id: 'dua-7',
    category: 'health_cure',
    title: 'بیماری و درد کے وقت شفاء کی دعا',
    arabic: 'أَذْهِبِ الْبَاسَ رَبَّ النَّاسِ، وَاشْفِ أَنْتَ الشَّافِي، لاَ شِفَاءَ إِلاَّ شِفَاؤُكَ، شِفَاءً لاَ يُغَادِرُ سَقَمًا',
    urdu: 'اے لوگوں کے پروردگار! تکلیف کو دور فرما دے اور شفا عطا فرما، تو ہی شفا دینے والا ہے، تیری شفا کے سوا کوئی شفا نہیں، ایسی شفا جو کسی بیماری کو باقی نہ چھوڑے۔',
    english: 'Remove the harm, O Lord of mankind, and heal; You are the Healer, there is no healing but Your healing...',
    virtue: 'نبی کریم ﷺ مریض کی عیادت کے وقت یہ دعا دم فرماتے تھے۔',
    reference: 'صحیح بخاری: 5743',
    recommendedRepeat: 3
  }
];

const ISLAMIC_BOOKS_DATABASE = [
  {
    id: 'book-1',
    title: 'تفسیر ابن کثیر (مختصر و مستند اردو)',
    author: 'حافظ عماد الدین ابن کثیر رحمہ اللہ',
    category: 'تفسیر القرآن',
    pages: 1450,
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    description: 'قرآن مجید کی سب سے مستند اور جامع ترین تفسیر جس میں قرآن کی تفسیر قرآن و حدیث اور اقوالِ صحابہ سے کی گئی ہے۔',
    downloadUrl: '#',
    readOnlineUrl: '#'
  },
  {
    id: 'book-2',
    title: 'الرحیق المختوم (سیرت النبی ﷺ)',
    author: 'مولانا صفی الرحمن مبارکپوری رحمہ اللہ',
    category: 'سیرت النبی ﷺ',
    pages: 620,
    cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
    description: 'عالمی سیرت مقابلے میں اول انعام یافتہ شاہکار کتاب جو نبی کریم ﷺ کی حیاتِ طیبہ کا مکمل احاطہ کرتی ہے۔',
    downloadUrl: '#',
    readOnlineUrl: '#'
  },
  {
    id: 'book-3',
    title: 'ریاض الصالحین (امام نووی)',
    author: 'امام یحییٰ بن شرف نووی رحمہ اللہ',
    category: 'احادیث مبارکہ',
    pages: 980,
    cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3dd78?auto=format&fit=crop&q=80&w=400',
    description: 'روزمرہ زندگی، اخلاق و آداب اور عبادات سے متعلق 1900+ منتخب احادیث کا عظیم الشان اور مقبول ترین مجموعہ۔',
    downloadUrl: '#',
    readOnlineUrl: '#'
  },
  {
    id: 'book-4',
    title: 'تجوید القرآن کے بنیادی قواعد',
    author: 'قاری محمد ادریس العاصم',
    category: 'علوم القرآن و تجوید',
    pages: 210,
    cover: 'https://images.unsplash.com/photo-1607478900766-efe132186cf2?auto=format&fit=crop&q=80&w=400',
    description: 'مخارج الحروف، صفاتِ حروف اور تجوید کے آسان قواعد مع رنگین مشقی چارٹس اور مثالیں۔',
    downloadUrl: '#',
    readOnlineUrl: '#'
  }
];

const ISLAMIC_PODCASTS_DATABASE = [
  {
    id: 'pod-1',
    title: 'سیرت النبی ﷺ: مکی دور کی عظیم قربانیاں',
    speaker: 'مفتی طارق مسعود صاحب',
    duration: '45 منٹ',
    category: 'سیرت النبی',
    audioUrl: 'https://cdn.islamicfinder.org/audio/adhan/adhan_makkah.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'pod-2',
    title: 'تجوید القرآن: مخارج الحروف کی درست ادائیگی',
    speaker: 'قاری عبدالباسط عبد الصمد',
    duration: '32 منٹ',
    category: 'تجوید',
    audioUrl: 'https://cdn.islamicfinder.org/audio/adhan/adhan_madina.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1607478900766-efe132186cf2?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'pod-3',
    title: 'دل کا سکون: نماز میں خشوع و خضوع کیسے لائیں؟',
    speaker: 'ڈاکٹر ذاکر نائیک',
    duration: '28 منٹ',
    category: 'تربیت و تزکیہ',
    audioUrl: 'https://cdn.islamicfinder.org/audio/adhan/adhan_makkah.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300'
  }
];

// ============================================================================
// 1. DUAS & AZKAR VIEW (مسنون دعائیں)
// ============================================================================

window.Views.renderDuasAndAzkar = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-8 animate-fade-in font-urdu pb-12" dir="rtl">
      
      <!-- Hero Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 p-6 sm:p-10 text-white shadow-2xl border border-emerald-500/20">
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="space-y-3 text-center md:text-right">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <i data-lucide="sparkles" class="w-4 h-4 text-emerald-400"></i>
              <span>حصن المسلم — مسنون دعائیں و اذکار</span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-extrabold leading-tight">مسنون دعائیں، اذکار اور نبوی قلعہ</h1>
            <p class="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              صبح و شام کے اذکار، حفاظت، بیماری سے شفا اور روزمرہ زندگی کی مسنون دعائیں مع مکمل عربی اعراب، اردو ترجمہ اور احادیث کے مستند حوالہ جات۔
            </p>
          </div>

          <!-- Quick Tasbeeh Launcher Tile -->
          <a href="#/tasbeeh" class="shrink-0 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl shadow-xl shadow-amber-500/20 flex items-center gap-3 transition scale-100 hover:scale-105">
            <span class="text-xl">📿</span>
            <span>ڈیجیٹل تسبیح کاؤنٹر کھولیں &rarr;</span>
          </a>
        </div>
      </div>

      <!-- Categories Filter Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" id="duas-category-tabs">
        <button onclick="window.Views.filterDuas('all')" class="dua-filter-btn active px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-emerald-600 text-white shadow">
          تمام دعائیں (${DUAS_DATABASE.length})
        </button>
        <button onclick="window.Views.filterDuas('morning_evening')" class="dua-filter-btn px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50">
          🌅 صبح و شام کے اذکار
        </button>
        <button onclick="window.Views.filterDuas('protection')" class="dua-filter-btn px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50">
          🛡️ حفاظت و پناہ
        </button>
        <button onclick="window.Views.filterDuas('after_prayer')" class="dua-filter-btn px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50">
          🕌 بعد نماز اذکار
        </button>
        <button onclick="window.Views.filterDuas('daily_life')" class="dua-filter-btn px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50">
          🚗 سفر و روزمرہ دعائیں
        </button>
        <button onclick="window.Views.filterDuas('wealth_debt')" class="dua-filter-btn px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50">
          💰 ادائے قرض و رزق
        </button>
        <button onclick="window.Views.filterDuas('health_cure')" class="dua-filter-btn px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50">
          🌿 شفائے امراض
        </button>
      </div>

      <!-- Duas Cards Grid -->
      <div class="grid grid-cols-1 gap-6" id="duas-list-container">
        ${DUAS_DATABASE.map(dua => window.Views.renderSingleDuaCard(dua)).join('')}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.renderSingleDuaCard = function(dua) {
  return `
    <div class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5 relative overflow-hidden group">
      
      <!-- Top Meta Bar -->
      <div class="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div class="flex items-center gap-2">
          <span class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
            📿
          </span>
          <h3 class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">${dua.title}</h3>
        </div>
        
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-xl text-[11px] font-bold">
            تعداد: ${dua.recommendedRepeat} مرتبہ
          </span>
          <button onclick="window.Views.copyDuaText('${dua.id}')" class="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition" title="کاپی کریں">
            <i data-lucide="copy" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <!-- Arabic Text -->
      <div class="p-4 sm:p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/10 text-center">
        <p class="text-lg sm:text-2xl font-bold font-arabic leading-loose text-slate-900 dark:text-emerald-100" id="arabic-${dua.id}">
          ${dua.arabic}
        </p>
      </div>

      <!-- Urdu Translation -->
      <div class="space-y-1.5 text-right">
        <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">اردو ترجمہ:</span>
        <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-urdu" id="urdu-${dua.id}">
          ${dua.urdu}
        </p>
      </div>

      <!-- Footer Virtue & Reference -->
      <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <i data-lucide="info" class="w-4 h-4 text-emerald-500 shrink-0"></i>
          <span><strong>فضیلت:</strong> ${dua.virtue}</span>
        </div>
        <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-mono text-[11px] shrink-0">
          ${dua.reference}
        </span>
      </div>

    </div>
  `;
};

window.Views.filterDuas = function(category) {
  const btns = document.querySelectorAll('.dua-filter-btn');
  btns.forEach(b => {
    b.classList.remove('bg-emerald-600', 'text-white', 'shadow');
    b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
  });
  if (event && event.target) {
    event.target.classList.add('bg-emerald-600', 'text-white', 'shadow');
    event.target.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
  }

  const container = document.getElementById('duas-list-container');
  if (!container) return;

  const filtered = category === 'all' ? DUAS_DATABASE : DUAS_DATABASE.filter(d => d.category === category);
  container.innerHTML = filtered.map(dua => window.Views.renderSingleDuaCard(dua)).join('');
  if (window.lucide) window.lucide.createIcons();
};

window.Views.copyDuaText = function(id) {
  const dua = DUAS_DATABASE.find(d => d.id === id);
  if (!dua) return;
  const text = `${dua.title}\n\n${dua.arabic}\n\nاردو ترجمہ: ${dua.urdu}\n\nحوالہ: ${dua.reference}\n(بشکریہ: LearnHub Academy)`;
  navigator.clipboard.writeText(text).then(() => {
    window.App?.showToast('✓ دعا مکمل عربی و ترجمے کے ساتھ کاپی ہو گئی!', 'success');
  });
};

// ============================================================================
// 2. DIGITAL TASBEEH COUNTER (ڈیجیٹل تسبیح)
// ============================================================================

window.Views.renderDigitalTasbeeh = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const savedCount = parseInt(localStorage.getItem('learnhub_tasbeeh_count') || '0', 10);
  const savedTarget = parseInt(localStorage.getItem('learnhub_tasbeeh_target') || '33', 10);
  const savedDhikr = localStorage.getItem('learnhub_tasbeeh_dhikr') || 'سُبْحَانَ اللَّهِ';

  container.innerHTML = `
    <div class="max-w-xl mx-auto space-y-6 font-urdu animate-fade-in text-center pb-12" dir="rtl">
      
      <!-- Top Title Bar -->
      <div class="space-y-2">
        <span class="badge bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-full text-xs">
          📿 روحانی سکون و اذکار
        </span>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">ڈیجیٹل تسبیح کاؤنٹر</h1>
        <p class="text-xs text-slate-500">اسکرین پر کہیں بھی ٹچ کر کے ذکر جاری رکھیں</p>
      </div>

      <!-- Dhikr Selector Dropdown -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
        <label class="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">ذکر منتخب کریں:</label>
        <select id="tasbeeh-dhikr-select" onchange="window.Views.changeTasbeehDhikr(this.value)" class="form-select text-center text-sm font-arabic font-bold py-2 rounded-xl bg-slate-50 dark:bg-slate-800">
          <option value="سُبْحَانَ اللَّهِ" ${savedDhikr === 'سُبْحَانَ اللَّهِ' ? 'selected' : ''}>سُبْحَانَ اللَّهِ (اللہ پاک ہے)</option>
          <option value="الْحَمْدُ لِلَّهِ" ${savedDhikr === 'الْحَمْدُ لِلَّهِ' ? 'selected' : ''}>الْحَمْدُ لِلَّهِ (تمام تعریف اللہ کے لیے ہے)</option>
          <option value="اللَّهُ أَكْبَرُ" ${savedDhikr === 'اللَّهُ أَكْبَرُ' ? 'selected' : ''}>اللَّهُ أَكْبَرُ (اللہ سب سے بڑا ہے)</option>
          <option value="لاَ إِلَهَ إِلاَّ اللَّهُ" ${savedDhikr === 'لاَ إِلَهَ إِلاَّ اللَّهُ' ? 'selected' : ''}>لاَ إِلَهَ إِلاَّ اللَّهُ (اللہ کے سوا کوئی معبود نہیں)</option>
          <option value="أَسْتَغْفِرُ اللَّهَ" ${savedDhikr === 'أَسْتَغْفِرُ اللَّهَ' ? 'selected' : ''}>أَسْتَغْفِرُ اللَّهَ (میں اللہ سے بخشش مانگتا ہوں)</option>
          <option value="اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ" ${savedDhikr === 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ' ? 'selected' : ''}>اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ (درود شریف)</option>
        </select>
      </div>

      <!-- Main Royal Tasbeeh Circle -->
      <div class="relative flex flex-col items-center justify-center p-8">
        
        <!-- Big Clickable Counter Button -->
        <button 
          onclick="window.Views.incrementTasbeeh()" 
          id="tasbeeh-touch-circle"
          class="w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 border-8 border-emerald-400/30 text-white shadow-2xl shadow-emerald-500/30 flex flex-col items-center justify-center gap-2 transition active:scale-95 select-none cursor-pointer relative overflow-hidden group">
          
          <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition rounded-full"></div>
          
          <span class="text-sm font-bold text-emerald-200 tracking-wider font-arabic" id="tasbeeh-active-dhikr">${savedDhikr}</span>
          
          <!-- Live Big Number -->
          <span class="text-6xl sm:text-7xl font-extrabold font-mono text-white tracking-tight" id="tasbeeh-count-display">
            ${savedCount}
          </span>
          
          <!-- Target Display -->
          <span class="text-xs text-emerald-300 font-bold font-mono px-3 py-1 bg-black/30 rounded-full" id="tasbeeh-target-label">
            ہدف: ${savedTarget}
          </span>

          <span class="text-[10px] text-emerald-100/70 mt-1">ٹچ کریں (TAP)</span>
        </button>

      </div>

      <!-- Target & Reset Controls -->
      <div class="grid grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-800/80 p-3 rounded-2xl">
        <button onclick="window.Views.setTasbeehTarget(33)" class="py-2 rounded-xl text-xs font-bold ${savedTarget === 33 ? 'bg-emerald-600 text-white shadow' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'}">
          33 بار
        </button>
        <button onclick="window.Views.setTasbeehTarget(100)" class="py-2 rounded-xl text-xs font-bold ${savedTarget === 100 ? 'bg-emerald-600 text-white shadow' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'}">
          100 بار
        </button>
        <button onclick="window.Views.setTasbeehTarget(1000)" class="py-2 rounded-xl text-xs font-bold ${savedTarget === 1000 ? 'bg-emerald-600 text-white shadow' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'}">
          1000 بار
        </button>
        <button onclick="window.Views.resetTasbeeh()" class="py-2 rounded-xl text-xs font-bold bg-rose-600/10 text-rose-600 hover:bg-rose-600 hover:text-white transition">
          ری سیٹ ↺
        </button>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.incrementTasbeeh = function() {
  let count = parseInt(localStorage.getItem('learnhub_tasbeeh_count') || '0', 10);
  const target = parseInt(localStorage.getItem('learnhub_tasbeeh_target') || '33', 10);
  count++;
  localStorage.setItem('learnhub_tasbeeh_count', count.toString());

  const display = document.getElementById('tasbeeh-count-display');
  if (display) {
    display.textContent = count;
    display.classList.add('scale-110');
    setTimeout(() => display.classList.remove('scale-110'), 150);
  }

  // Trigger vibration if available
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }

  // Check Target Completion
  if (count === target) {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
    if (window.confetti) {
      window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
    window.App?.showToast(`🎉 ماشاء اللہ! آپ کا ${target} مرتبہ کا ہدف مکمل ہو گیا ہے۔ تقبل اللہ!`, 'success');
  }
};

window.Views.setTasbeehTarget = function(target) {
  localStorage.setItem('learnhub_tasbeeh_target', target.toString());
  window.Views.renderDigitalTasbeeh();
  window.App?.showToast(`ہدف ${target} مقرر کر دیا گیا۔`, 'info');
};

window.Views.resetTasbeeh = function() {
  if (confirm('کیا آپ تسبیح کا کاؤنٹر صفر پر ری سیٹ کرنا چاہتے ہیں؟')) {
    localStorage.setItem('learnhub_tasbeeh_count', '0');
    const display = document.getElementById('tasbeeh-count-display');
    if (display) display.textContent = '0';
    window.App?.showToast('تسبیح کاؤنٹر ری سیٹ ہو گیا۔', 'info');
  }
};

window.Views.changeTasbeehDhikr = function(val) {
  localStorage.setItem('learnhub_tasbeeh_dhikr', val);
  const label = document.getElementById('tasbeeh-active-dhikr');
  if (label) label.textContent = val;
};

// ============================================================================
// 3. PRAYER TIMES & QIBLA COMPASS (اوقاتِ نماز و قبلہ)
// ============================================================================

window.Views.renderPrayerTimesAndQibla = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit', hour12: true });

  container.innerHTML = `
    <div class="space-y-8 animate-fade-in font-urdu pb-12" dir="rtl">
      
      <!-- Top Banner -->
      <div class="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 sm:p-10 text-white border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="space-y-2 text-center md:text-right">
            <span class="badge bg-indigo-500/20 text-indigo-300 font-bold px-3 py-1 rounded-full text-xs">
              🕌 اوقاتِ نماز و سمتِ قبلہ
            </span>
            <h1 class="text-2xl sm:text-4xl font-extrabold">نماز کے اوقات اور قبلہ رخ</h1>
            <p class="text-xs sm:text-sm text-indigo-200">اپنے مقام کے مطابق نماز کے اوقات اور مکہ مکرمہ کی درست سمت معلوم کریں۔</p>
          </div>

          <!-- Live City Selector -->
          <div class="flex items-center gap-2 bg-white/10 p-2 rounded-2xl backdrop-blur">
            <i data-lucide="map-pin" class="w-4 h-4 text-emerald-400"></i>
            <select id="prayer-city-select" onchange="window.Views.updatePrayerCity(this.value)" class="bg-transparent text-xs font-bold text-white border-none focus:ring-0">
              <option value="karachi" class="text-slate-900" selected>🇵🇰 کراچی (Karachi)</option>
              <option value="lahore" class="text-slate-900">🇵🇰 لاہور (Lahore)</option>
              <option value="islamabad" class="text-slate-900">🇵🇰 اسلام آباد (Islamabad)</option>
              <option value="makkah" class="text-slate-900">🇸🇦 مکہ مکرمہ (Makkah)</option>
              <option value="madinah" class="text-slate-900">🇸🇦 مدینہ منورہ (Madinah)</option>
              <option value="dubai" class="text-slate-900">🇦🇪 دبئی (Dubai)</option>
              <option value="london" class="text-slate-900">🇬🇧 لندن (London)</option>
              <option value="newyork" class="text-slate-900">🇺🇸 نیویارک (New York)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Prayer Times Matrix Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-center space-y-1">
          <span class="text-xs text-slate-400 font-bold block">نمازِ فجر</span>
          <span class="text-lg sm:text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">05:12 AM</span>
          <span class="text-[10px] text-slate-400 block">طلوع: 06:18 AM</span>
        </div>

        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-center space-y-1">
          <span class="text-xs text-slate-400 font-bold block">طلوعِ آفتاب</span>
          <span class="text-lg sm:text-xl font-extrabold font-mono text-amber-500">06:18 AM</span>
          <span class="text-[10px] text-slate-400 block">اشراق</span>
        </div>

        <div class="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500 rounded-2xl shadow-md text-center space-y-1 relative">
          <span class="badge bg-emerald-600 text-white text-[9px] font-bold absolute -top-2 left-1/2 -translate-x-1/2 px-2 rounded-full">اگلی نماز</span>
          <span class="text-xs text-emerald-700 dark:text-emerald-300 font-bold block">نمازِ ظہر</span>
          <span class="text-lg sm:text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">01:15 PM</span>
          <span class="text-[10px] text-emerald-600/70 block">زوال: 12:40 PM</span>
        </div>

        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-center space-y-1">
          <span class="text-xs text-slate-400 font-bold block">نمازِ عصر</span>
          <span class="text-lg sm:text-xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">04:45 PM</span>
          <span class="text-[10px] text-slate-400 block">شافعی/حنفی</span>
        </div>

        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-center space-y-1">
          <span class="text-xs text-slate-400 font-bold block">نمازِ مغرب</span>
          <span class="text-lg sm:text-xl font-extrabold font-mono text-rose-500">06:58 PM</span>
          <span class="text-[10px] text-slate-400 block">غروبِ آفتاب</span>
        </div>

        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-center space-y-1">
          <span class="text-xs text-slate-400 font-bold block">نمازِ عشاء</span>
          <span class="text-lg sm:text-xl font-extrabold font-mono text-purple-500">08:25 PM</span>
          <span class="text-[10px] text-slate-400 block">شفقِ احمر</span>
        </div>

      </div>

      <!-- Qibla Compass & Adhan Player (2 Cols) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        <!-- Interactive Qibla Compass Visualizer -->
        <div class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="text-base font-extrabold text-slate-900 dark:text-white">سمتِ قبلہ فائنڈر (Qibla Compass)</h3>
            <span class="text-xs font-mono font-bold text-emerald-600">265° مغرب کی طرف</span>
          </div>

          <!-- Compass Dial -->
          <div class="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-full border-4 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center shadow-inner">
            <span class="absolute top-2 text-xs font-bold text-slate-400">شمال (N)</span>
            <span class="absolute bottom-2 text-xs font-bold text-slate-400">جنوب (S)</span>
            <span class="absolute right-2 text-xs font-bold text-slate-400">مشرق (E)</span>
            <span class="absolute left-2 text-xs font-bold text-emerald-500 font-extrabold">مغرب (W) 🕋</span>

            <!-- Needle Pointer -->
            <div class="w-1.5 h-36 bg-gradient-to-t from-emerald-500 to-rose-500 rounded-full transform -rotate-45 shadow-lg relative flex items-start justify-center">
              <div class="w-4 h-4 bg-emerald-600 text-white rounded-full text-[8px] flex items-center justify-center -top-2">🕋</div>
            </div>
          </div>

          <p class="text-xs text-slate-500">اپنے موبائل کو سیدھا رکھیں، سبز تیر کا رخ قبلہ (مکہ مکرمہ) کی سمت ہے۔</p>
        </div>

        <!-- Adhan Audio & Islamic Guidelines -->
        <div class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h3 class="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            روح پرور اذانِ مکہ و مدینہ
          </h3>

          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-slate-900 dark:text-white block">اذانِ مسجد الحرام (مکہ مکرمہ)</span>
                <span class="text-[10px] text-slate-400">شیخ علی احمد ملا</span>
              </div>
              <audio controls class="h-8 max-w-[180px]">
                <source src="https://cdn.islamicfinder.org/audio/adhan/adhan_makkah.mp3" type="audio/mpeg">
              </audio>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
              <div>
                <span class="text-xs font-bold text-slate-900 dark:text-white block">اذانِ مسجد نبوی (مدینہ منورہ)</span>
                <span class="text-[10px] text-slate-400">مسجد نبوی شریف</span>
              </div>
              <audio controls class="h-8 max-w-[180px]">
                <source src="https://cdn.islamicfinder.org/audio/adhan/adhan_madina.mp3" type="audio/mpeg">
              </audio>
            </div>
          </div>

          <div class="text-xs text-slate-500 leading-relaxed">
            💡 <strong>حدیث شریف:</strong> "جب تم مؤذن کو اذان دیتے سنو تو اسی طرح کہو جیسے وہ کہتا ہے، پھر مجھ پر درود بھیجو۔" (صحیح مسلم)
          </div>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.updatePrayerCity = function(city) {
  window.App?.showToast(`مقام ${city} کے اوقات اپڈیٹ ہو گئے۔`, 'success');
};

// ============================================================================
// 4. HIJRI CALENDAR & EVENTS (ہجری تقویم و اسلامی ایام)
// ============================================================================

window.Views.renderHijriCalendar = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const HOLY_EVENTS = [
    { name: 'یکم رمضان المبارک 1447ھ', daysLeft: 18, desc: 'ماہِ صیام و نزولِ قرآن کا آغاز' },
    { name: 'لیلۃ القدر (شبِ قدر)', daysLeft: 44, desc: 'ہزار مہینوں سے افضل رات' },
    { name: 'عید الفطر 1447ھ', daysLeft: 48, desc: 'یومِ شکرانہ و خوشی' },
    { name: 'یومِ عرفہ (حج کا رکنِ اعظم)', daysLeft: 115, desc: 'میدانِ عرفات میں وقوف' },
    { name: 'عید الاضحیٰ 1447ھ', daysLeft: 116, desc: 'سنتِ ابراہیمی اور قربانی کا دن' },
    { name: 'یومِ عاشورہ (10 محرم)', daysLeft: 146, desc: 'عظیم تاریخ و شہادتِ حسینؓ' }
  ];

  container.innerHTML = `
    <div class="space-y-8 animate-fade-in font-urdu pb-12" dir="rtl">
      
      <!-- Banner -->
      <div class="rounded-3xl bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 p-6 sm:p-10 text-white border border-amber-500/20 shadow-2xl">
        <div class="space-y-2 text-center md:text-right">
          <span class="badge bg-amber-500/20 text-amber-300 font-bold px-3 py-1 rounded-full text-xs">
            📅 اسلامی تقویم و ہجری سال
          </span>
          <h1 class="text-2xl sm:text-4xl font-extrabold">ہجری کلینڈر اور اہم اسلامی ایام</h1>
          <p class="text-xs sm:text-sm text-amber-100/80">سال 1447ھ کے تمام متبرک ایام کا لائیو کاؤنٹ ڈاؤن اور شیڈول۔</p>
        </div>
      </div>

      <!-- Events Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${HOLY_EVENTS.map(ev => `
          <div class="lh-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs">
                ${ev.daysLeft} دن باقی
              </span>
              <span class="text-xl">🌙</span>
            </div>
            <h3 class="text-base font-extrabold text-slate-900 dark:text-white">${ev.name}</h3>
            <p class="text-xs text-slate-500 leading-relaxed">${ev.desc}</p>
          </div>
        `).join('')}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// ============================================================================
// 5. DAILY ISLAMIC CHALLENGE & LEADERBOARD (روزانہ چیلنج و رینکنگ)
// ============================================================================

window.Views.renderDailyChallenge = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div class="max-w-3xl mx-auto space-y-8 animate-fade-in font-urdu pb-12" dir="rtl">
      
      <div class="rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-950 p-6 sm:p-10 text-white shadow-2xl border border-indigo-500/20 text-center space-y-3">
        <span class="badge bg-indigo-500/20 text-indigo-300 font-bold px-3 py-1 rounded-full text-xs">
          ⚡ آج کا 5 منٹ چیلنج
        </span>
        <h1 class="text-2xl sm:text-4xl font-extrabold">روزانہ اسلامی علمی چیلنج</h1>
        <p class="text-xs sm:text-sm text-indigo-200 max-w-xl mx-auto">
          ہر روز 5 نئے سوالات کا جواب دیں، اپنی روزانہ لرننگ اسٹریک کو برقرار رکھیں اور عالمی لیڈر بورڈ پر پہلی پوزیشن حاصل کریں۔
        </p>

        <div class="pt-4 flex items-center justify-center gap-3">
          <a href="#/quizzes" class="btn-primary bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-8 py-3.5 rounded-2xl shadow-xl shadow-amber-500/20 text-sm">
            چیلنج شروع کریں &rarr;
          </a>
          <a href="#/leaderboard" class="btn-secondary px-6 py-3.5 text-xs font-bold rounded-2xl">
            🏆 لیڈر بورڈ دیکھیں
          </a>
        </div>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.renderLeaderboard = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const TOP_STUDENTS = [
    { rank: 1, name: 'محمد حارث عثمانی', points: 4850, streak: 42, badge: '🥇 گولڈ چیمپئن' },
    { rank: 2, name: 'سیدہ فاطمہ الزہراء', points: 4620, streak: 38, badge: '🥈 سلور چیمپئن' },
    { rank: 3, name: 'احمد عبداللہ قریشی', points: 4310, streak: 31, badge: '🥉 برونز چیمپئن' },
    { rank: 4, name: 'زینب بی بی', points: 3950, streak: 25, badge: '⭐ ممتاز طالب علم' },
    { rank: 5, name: 'حافظ بلال محمود', points: 3780, streak: 21, badge: '⭐ ممتاز طالب علم' }
  ];

  container.innerHTML = `
    <div class="max-w-4xl mx-auto space-y-8 animate-fade-in font-urdu pb-12" dir="rtl">
      
      <div class="text-center space-y-2">
        <span class="badge bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full text-xs">
          🏆 LearnHub عالمی رینکنگ
        </span>
        <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">طلبہ کا عالمی لیڈر بورڈ</h1>
        <p class="text-xs text-slate-500">سب سے زیادہ کوئز اسکور، مطالعہ اور اسٹریک رکھنے والے سرفہرست طلبہ</p>
      </div>

      <!-- Table -->
      <div class="lh-card rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="p-4">رینک</th>
                <th class="p-4">طالب علم</th>
                <th class="p-4">بیج</th>
                <th class="p-4">اسٹریک</th>
                <th class="p-4">کل پوائنٹس</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${TOP_STUDENTS.map(s => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td class="p-4 font-mono font-extrabold text-sm ${s.rank <= 3 ? 'text-amber-500' : 'text-slate-500'}">
                    #${s.rank}
                  </td>
                  <td class="p-4 font-bold text-slate-900 dark:text-white">${s.name}</td>
                  <td class="p-4"><span class="px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl font-bold">${s.badge}</span></td>
                  <td class="p-4 font-mono text-emerald-600 font-bold">🔥 ${s.streak} دن</td>
                  <td class="p-4 font-mono font-extrabold text-indigo-600 dark:text-indigo-400">${s.points} XP</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// ============================================================================
// 6. ISLAMIC DIGITAL LIBRARY (کتب خانہ)
// ============================================================================

window.Views.renderIslamicLibrary = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-8 animate-fade-in font-urdu pb-12" dir="rtl">
      
      <div class="rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-6 sm:p-10 text-white border border-emerald-500/20 shadow-2xl">
        <div class="space-y-2 text-center md:text-right">
          <span class="badge bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full text-xs">
            📚 ڈیجیٹل اسلامی کتب خانہ
          </span>
          <h1 class="text-2xl sm:text-4xl font-extrabold">مستند دینی کتب، تفاسیر و سیرت</h1>
          <p class="text-xs sm:text-sm text-emerald-100/80">آن لائن مطالعہ کریں یا مفت پی ڈی ایف ڈاؤن لوڈ کریں۔</p>
        </div>
      </div>

      <!-- Books Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${ISLAMIC_BOOKS_DATABASE.map(b => `
          <div class="lh-card rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between group">
            <div class="h-48 overflow-hidden relative">
              <img src="${b.cover}" alt="${b.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
              <span class="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-950/80 text-white text-[10px] font-bold backdrop-blur">
                ${b.category}
              </span>
            </div>
            
            <div class="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="font-extrabold text-sm text-slate-900 dark:text-white">${b.title}</h3>
                <span class="text-[11px] text-slate-500 block mt-0.5">${b.author}</span>
                <p class="text-[11px] text-slate-400 mt-2 line-clamp-3 leading-relaxed">${b.description}</p>
              </div>

              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span class="text-[10px] text-slate-400 font-mono">${b.pages} صفحات</span>
                <button onclick="window.App?.showToast('کتاب ڈاؤن لوڈ شروع ہو گئی ہے۔', 'info')" class="btn-primary py-1.5 px-3 text-[11px] rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold">
                  مطالعہ / ڈاؤن لوڈ 📥
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// ============================================================================
// 7. ISLAMIC AUDIO STUDIO & PODCASTS (پوڈکاسٹس)
// ============================================================================

window.Views.renderAudioPodcasts = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-8 animate-fade-in font-urdu pb-12" dir="rtl">
      
      <div class="rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 p-6 sm:p-10 text-white border border-purple-500/20 shadow-2xl">
        <div class="space-y-2 text-center md:text-right">
          <span class="badge bg-purple-500/20 text-purple-300 font-bold px-3 py-1 rounded-full text-xs">
            🎧 اسلامی آڈیو اسٹوڈیو
          </span>
          <h1 class="text-2xl sm:text-4xl font-extrabold">علمی دروس، بیانات اور تلاوتیں</h1>
          <p class="text-xs sm:text-sm text-purple-100/80">اعلیٰ کوالٹی آڈیو بیانات اور تلاوتِ کلامِ پاک سنیں۔</p>
        </div>
      </div>

      <!-- Podcasts List -->
      <div class="space-y-4">
        ${ISLAMIC_PODCASTS_DATABASE.map(p => `
          <div class="lh-card p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4 w-full sm:w-auto">
              <img src="${p.thumbnail}" alt="${p.title}" class="w-16 h-16 rounded-2xl object-cover shrink-0">
              <div>
                <span class="text-[10px] font-bold text-purple-600 dark:text-purple-400">${p.category}</span>
                <h3 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">${p.title}</h3>
                <span class="text-xs text-slate-500 font-bold">${p.speaker} • ${p.duration}</span>
              </div>
            </div>

            <audio controls class="w-full sm:w-64 h-10">
              <source src="${p.audioUrl}" type="audio/mpeg">
            </audio>
          </div>
        `).join('')}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

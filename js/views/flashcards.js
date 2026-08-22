/**
 * LearnHub Quranic Arabic & Hadith Flashcards Memorization Suite
 * Leitner 5-Box Spaced Repetition Algorithm with 3D Flip, Quranic Frequency & Audio Pronunciation.
 */

window.Views = window.Views || {};

window.Views.FLASHCARD_DECKS = [
  {
    id: 'deck_quran_words',
    title: 'قرآنی کلماتِ عامہ (Top 100 Quranic Words)',
    subtitle: 'قرآن مجید کے 50% الفاظ پر مشتمل کثیر الاستعمال قرآنی کلمات',
    icon: 'book-open',
    color: 'from-emerald-600 to-teal-700',
    totalCards: 15,
    cards: [
      { id: 1, arabic: 'رَبّ', harakat: 'رَبّ', urdu: 'پالنے والا، مالک و آقا', english: 'Lord, Sustainer', root: 'ر-ب-ب', type: 'اسم', frequency: '975 مرتبہ', ayah: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ (تمام تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے)' },
      { id: 2, arabic: 'آيَة', harakat: 'آيَة / آيَات', urdu: 'نشانی، علامت، قرآنی آیت', english: 'Sign, Verse', root: 'ء-ي-ي', type: 'اسم', frequency: '382 مرتبہ', ayah: 'إِنَّ فِي ذَٰلِكَ لَآيَةً لِّلْمُؤْمِنِينَ' },
      { id: 3, arabic: 'قَلْب', harakat: 'قَلْب / قُلُوب', urdu: 'دل', english: 'Heart', root: 'ق-ل-ب', type: 'اسم', frequency: '168 مرتبہ', ayah: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ' },
      { id: 4, arabic: 'سَمَاء', harakat: 'سَمَاء / سَمَاوَات', urdu: 'آسمان', english: 'Sky, Heaven', root: 'س-م-و', type: 'اسم', frequency: '310 مرتبہ', ayah: 'وَالسَّمَاءِ وَمَا بَنَاهَا' },
      { id: 5, arabic: 'أَرْض', harakat: 'أَرْض', urdu: 'زمین', english: 'Earth, Land', root: 'ء-ر-ض', type: 'اسم', frequency: '461 مرتبہ', ayah: 'وَإِلَى الْأَرْضِ كَيْفَ سُطِحَتْ' },
      { id: 6, arabic: 'عَبْد', harakat: 'عَبْد / عِبَاد', urdu: 'بندہ، غلام', english: 'Servant, Slave', root: 'ع-ب-د', type: 'اسم', frequency: '275 مرتبہ', ayah: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ' },
      { id: 7, arabic: 'نَفْس', harakat: 'نَفْس / أَنفُس', urdu: 'جان، روح، ذات', english: 'Soul, Self', root: 'ن-ف-س', type: 'اسم', frequency: '295 مرتبہ', ayah: 'كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ' },
      { id: 8, arabic: 'يَوْم', harakat: 'يَوْم / أَيَّام', urdu: 'دن', english: 'Day', root: 'ي-و-م', type: 'اسم', frequency: '405 مرتبہ', ayah: 'مَالِكِ يَوْمِ الدِّينِ' },
      { id: 9, arabic: 'صَلَاة', harakat: 'صَلَاة / صَلَوَات', urdu: 'نماز، دعا', english: 'Prayer', root: 'ص-ل-و', type: 'اسم', frequency: '83 مرتبہ', ayah: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ' },
      { id: 10, arabic: 'عِلْم', harakat: 'عِلْم', urdu: 'جاننا، علم و حکمت', english: 'Knowledge', root: 'ع-ل-م', type: 'اسم', frequency: '105 مرتبہ', ayah: 'وَقُل رَّبِّ زِدْنِي عِلْمًا' },
      { id: 11, arabic: 'حَقّ', harakat: 'حَقّ', urdu: 'سچ، انصاف، ثابت شدہ بات', english: 'Truth, Right', root: 'ح-ق-ق', type: 'اسم', frequency: '287 مرتبہ', ayah: 'وَقُلْ جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ' },
      { id: 12, arabic: 'نُور', harakat: 'نُور', urdu: 'روشنی، ہدایت', english: 'Light', root: 'ن-و-ر', type: 'اسم', frequency: '49 مرتبہ', ayah: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ' },
      { id: 13, arabic: 'رَحْمَة', harakat: 'رَحْمَة', urdu: 'مہربانی، رحمت و فضل', english: 'Mercy', root: 'ر-ح-م', type: 'اسم', frequency: '114 مرتبہ', ayah: 'وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ' },
      { id: 14, arabic: 'عَذَاب', harakat: 'عَذَاب', urdu: 'سزا، تکلیف دہ عذاب', english: 'Punishment, Torment', root: 'ع-ذ-ب', type: 'اسم', frequency: '373 مرتبہ', ayah: 'رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ' },
      { id: 15, arabic: 'جَنَّة', harakat: 'جَنَّة / جَنَّات', urdu: 'باغ، جنت الفردوس', english: 'Paradise, Garden', root: 'ج-ن-ن', type: 'اسم', frequency: '147 مرتبہ', ayah: 'ادْخُلُوا الْجَنَّةَ بِمَا كُنتُمْ تَعْمَلُونَ' }
    ]
  },
  {
    id: 'deck_particles_pronouns',
    title: 'حروف و ضمائر (Quranic Pronouns & Particles)',
    subtitle: 'قرآنی ضمائر، حروفِ جارہ اور حروفِ عطف کی مکمل مشق',
    icon: 'sparkles',
    color: 'from-amber-600 to-amber-800',
    totalCards: 10,
    cards: [
      { id: 101, arabic: 'هُوَ', harakat: 'هُوَ', urdu: 'وہ (ایک مذکر)', english: 'He / It', root: '-', type: 'ضمیر منفصل', frequency: '481 مرتبہ', ayah: 'قُلْ هُوَ اللَّهُ أَحَدٌ' },
      { id: 102, arabic: 'هُمْ', harakat: 'هُمْ', urdu: 'وہ سب (مذکر)', english: 'They (masc.)', root: '-', type: 'ضمیر منفصل', frequency: '445 مرتبہ', ayah: 'أُولَٰئِكَ هُمُ الْمُفْلِحُونَ' },
      { id: 103, arabic: 'أَنْتَ', harakat: 'أَنْتَ', urdu: 'تو (ایک مذکر)', english: 'You (singular masc.)', root: '-', type: 'ضمیر منفصل', frequency: '81 مرتبہ', ayah: 'إِنَّكَ أَنتَ الْعَلِيمُ الْحَكِيمُ' },
      { id: 104, arabic: 'نَحْنُ', harakat: 'نَحْنُ', urdu: 'ہم سب', english: 'We', root: '-', type: 'ضمیر منفصل', frequency: '86 مرتبہ', ayah: 'نَحْنُ نَقُصُّ عَلَيْكَ أَحْسَنَ الْقَصَصِ' },
      { id: 105, arabic: 'فِي', harakat: 'فِي', urdu: 'میں، اندر', english: 'In / Inside', root: '-', type: 'حرفِ جر', frequency: '1701 مرتبہ', ayah: 'فِي قُلُوبِهِم مَّرَضٌ' },
      { id: 106, arabic: 'مِنْ', harakat: 'مِنْ', urdu: 'سے، کی طرف سے', english: 'From', root: '-', type: 'حرفِ جر', frequency: '3226 مرتبہ', ayah: 'مِّن شَرِّ مَا خَلَقَ' },
      { id: 107, arabic: 'عَلَى', harakat: 'عَلَى', urdu: 'پر، اوپر', english: 'On / Upon', root: '-', type: 'حرفِ جر', frequency: '1445 مرتبہ', ayah: 'عَلَى صِرَاطٍ مُّسْتَقِيمٍ' },
      { id: 108, arabic: 'إِلَى', harakat: 'إِلَى', urdu: 'تک، کی جانب', english: 'To / Towards', root: '-', type: 'حرفِ جر', frequency: '742 مرتبہ', ayah: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ' },
      { id: 109, arabic: 'الَّذِي', harakat: 'الَّذِي / الَّذِينَ', urdu: 'وہ جو، جس نے', english: 'Who / Which', root: '-', type: 'اسم موصول', frequency: '1449 مرتبہ', ayah: 'الَّذِي أَطْعَمَهُم مِّن جُوعٍ' },
      { id: 110, arabic: 'إِنَّ', harakat: 'إِنَّ', urdu: 'بے شک، یقیناً', english: 'Indeed, Truly', root: '-', type: 'حرف مشبہ بالفعل', frequency: '1533 مرتبہ', ayah: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ' }
    ]
  },
  {
    id: 'deck_common_verbs',
    title: 'کثیر الاستعمال قرآنی افعال (High Frequency Verbs)',
    subtitle: 'قرآن مجید کے 10 بنیادی ترین افعال اور ان کے صیغے',
    icon: 'activity',
    color: 'from-cyan-600 to-blue-700',
    totalCards: 8,
    cards: [
      { id: 201, arabic: 'قَالَ', harakat: 'قَالَ / يَقُولُ', urdu: 'اس نے کہا / وہ کہتا ہے', english: 'He said / He says', root: 'ق-و-ل', type: 'فعل ماضی / مضارع', frequency: '1722 مرتبہ', ayah: 'قَالَ رَبِّ إِنِّي ظَلَمْتُ نَفْسِي' },
      { id: 202, arabic: 'کَانَ', harakat: 'کَانَ / يَكُونُ', urdu: 'وہ تھا / وہ ہوتا ہے', english: 'He was / He is', root: 'ک-و-ن', type: 'فعل ناقص', frequency: '1361 مرتبہ', ayah: 'وَكَانَ اللَّهُ عَلِيمًا حَكِيمًا' },
      { id: 203, arabic: 'آمَنَ', harakat: 'آمَنَ / يُؤْمِنُ', urdu: 'وہ ایمان لایا', english: 'He believed', root: 'ء-م-ن', type: 'فعل ماضی', frequency: '537 مرتبہ', ayah: 'الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ' },
      { id: 204, arabic: 'عَلِمَ', harakat: 'عَلِمَ / يَعْلَمُ', urdu: 'اس نے جانا / وہ جانتا ہے', english: 'He knew / He knows', root: 'ع-ل-م', type: 'فعل ماضی', frequency: '382 مرتبہ', ayah: 'عَلَّمَ الْإِنسَانَ مَا لَمْ يَعْلَمْ' },
      { id: 205, arabic: 'جَعَلَ', harakat: 'جَعَلَ / يَجْعَلُ', urdu: 'اس نے بنایا / مقرر کیا', english: 'He made / created', root: 'ج-ع-ل', type: 'فعل ماضی', frequency: '346 مرتبہ', ayah: 'وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ' },
      { id: 206, arabic: 'عَمِلَ', harakat: 'عَمِلَ / يَعْمَلُ', urdu: 'اس نے عمل کیا', english: 'He worked / did', root: 'ع-م-ل', type: 'فعل ماضی', frequency: '318 مرتبہ', ayah: 'مَنْ عَمِلَ صَالِحًا فَلِنَفْسِهِ' },
      { id: 207, arabic: 'دَعَا', harakat: 'دَعَا / يَدْعُو', urdu: 'اس نے پکارا / دعا مانگی', english: 'He called / prayed', root: 'د-ع-و', type: 'فعل ماضی', frequency: '212 مرتبہ', ayah: 'وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ' },
      { id: 208, arabic: 'هَدَى', harakat: 'هَدَى / يَهْدِي', urdu: 'اس نے سیدھا راستہ دکھایا', english: 'He guided', root: 'ه-د-ي', type: 'فعل ماضی', frequency: '190 مرتبہ', ayah: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ' }
    ]
  },
  {
    id: 'deck_hadith_terms',
    title: 'اصطلاحاتِ حدیث و فقہ (Hadith & Fiqh Terminology)',
    subtitle: 'علوم الحدیث اور فقہی اصطلاحات کی تفہیم و یادداشت',
    icon: 'award',
    color: 'from-purple-600 to-indigo-800',
    totalCards: 6,
    cards: [
      { id: 301, arabic: 'صَحِيح', harakat: 'حَدِيثٌ صَحِيحٌ', urdu: 'وہ حدیث جس کی سند متصل ہو، راوی عادل و ضابط ہوں اور شذوذ و علت سے پاک ہو', english: 'Authentic Hadith', root: 'ص-ح-ح', type: 'اصطلاحِ حدیث', frequency: 'درجۂ اول', ayah: 'مثال: صحیح بخاری و صحیح مسلم کی احادیث' },
      { id: 302, arabic: 'مُتَوَاتِر', harakat: 'حَدِيثٌ مُتَوَاتِرٌ', urdu: 'وہ حدیث جسے ہر دور میں اتنی کثیر تعداد نے روایت کیا ہو کہ جھوٹ پر متفق ہونا محال ہو', english: 'Mass-transmitted', root: 'و-ت-ر', type: 'اصطلاحِ حدیث', frequency: 'قطعی الثبوت', ayah: 'مثال: مَنْ كَذَبَ عَلَيَّ مُتَعَمِّدًا' },
      { id: 303, arabic: 'مَرْفُوع', harakat: 'حَدِيثٌ مَرْفُوعٌ', urdu: 'وہ حدیث جس کی نسبت خاص نبی کریم ﷺ کی ذاتِ اقدس کی طرف ہو (قول، فعل یا تقریر)', english: 'Attributed to Prophet ﷺ', root: 'ر-ف-ع', type: 'اصطلاحِ حدیث', frequency: 'بنیادی ماخذ', ayah: 'قال رسول الله صلى الله عليه وسلم...' },
      { id: 304, arabic: 'مَوْقُوف', harakat: 'حَدِيثٌ مَوْقُوفٌ', urdu: 'وہ اثر جس کی نسبت صحابی رسول ﷺ کی طرف ہو اور نبی ﷺ تک نہ پہنچتی ہو', english: 'Halted at Companion', root: 'و-ق-ف', type: 'اصطلاحِ حدیث', frequency: 'اثرِ صحابی', ayah: 'مثال: قال عمر بن الخطاب رضي الله عنه...' },
      { id: 305, arabic: 'سَنَد', harakat: 'السَّنَد / الإِسْنَاد', urdu: 'راویوں کا وہ سلسلہ جو متنِ حدیث تک پہنچاتا ہے', english: 'Chain of Narrators', root: 'س-ن-د', type: 'اصطلاحِ حدیث', frequency: 'دین کی اساس', ayah: 'الإسناد من الدين ولولا الإسناد لقال من شاء ما شاء' },
      { id: 306, arabic: 'مَتْن', harakat: 'مَتْنُ الحَدِيثِ', urdu: 'حدیث کے اصل کلمات اور عبارت جو سند کے اختتام پر مذکور ہوتی ہے', english: 'Text of Hadith', root: 'م-ت-ن', type: 'اصطلاحِ حدیث', frequency: 'اصلِ کلام', ayah: 'کلماتِ نبوی ﷺ' }
    ]
  }
];

/**
 * Main Flashcards Hub View
 */
window.Views.renderFlashcardsHub = function() {
  const container = document.getElementById('main-content');
  const decks = window.Views.FLASHCARD_DECKS;
  const user = window.Auth.getCurrentUser();

  // Load User Leitner Boxes State
  const leitnerStateKey = `learnhub_leitner_${user ? user.id : 'guest'}`;
  const leitnerState = JSON.parse(localStorage.getItem(leitnerStateKey) || '{}');

  let totalMastered = 0;
  let totalCardsCount = 0;
  decks.forEach(d => {
    totalCardsCount += d.cards.length;
    d.cards.forEach(c => {
      if (leitnerState[c.id] && leitnerState[c.id].box === 5) totalMastered++;
    });
  });

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      
      <!-- Hero Header -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 p-6 sm:p-10 border border-emerald-500/20 text-white shadow-2xl">
        <div class="relative z-10 max-w-3xl space-y-4 text-right">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <i data-lucide="sparkles" class="w-3.5 h-3.5 animate-spin"></i>
            <span>لائٹنر الگورتھم و اسمارٹ میموری سسٹم (Spaced Repetition)</span>
          </div>

          <h1 class="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-serif">
            قرآنی عربی و حدیث فلیش کارڈز
          </h1>
          <p class="text-xs sm:text-sm text-emerald-200/90 leading-relaxed max-w-2xl">
            قرآن مجید کے 1000 اہم ترین الفاظ اور اصطلاحاتِ حدیث کو 3D فلیش کارڈز، مادہ (Root Word)، قرآنی تکرار اور صوتی تلفظ کے ساتھ یاد کریں۔
          </p>

          <!-- Overall Mastery Stats -->
          <div class="flex flex-wrap items-center gap-4 pt-2">
            <div class="bg-slate-950/60 py-2 px-4 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <i data-lucide="brain" class="w-5 h-5"></i>
              </div>
              <div class="text-right">
                <div class="text-[10px] text-slate-400">کل الفاظ و اصطلاحات</div>
                <div class="text-sm font-extrabold text-white">${totalCardsCount} کلمات</div>
              </div>
            </div>

            <div class="bg-slate-950/60 py-2 px-4 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <i data-lucide="check-circle" class="w-5 h-5"></i>
              </div>
              <div class="text-right">
                <div class="text-[10px] text-slate-400">مکمل یاد شدہ (Box 5)</div>
                <div class="text-sm font-extrabold text-emerald-400">${totalMastered} کلمات</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Decks Grid -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i data-lucide="layers" class="w-5 h-5 text-emerald-500"></i>
          <span>مطالعہ کے لیے ڈیک منتخب کریں (Select Deck)</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${decks.map(deck => {
            let deckMastered = 0;
            deck.cards.forEach(c => {
              if (leitnerState[c.id] && leitnerState[c.id].box === 5) deckMastered++;
            });
            const deckProgress = Math.round((deckMastered / deck.cards.length) * 100);

            return `
              <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr ${deck.color} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition">
                      <i data-lucide="${deck.icon}" class="w-6 h-6"></i>
                    </div>
                    <span class="badge bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold py-1 px-3 rounded-full">
                      ${deck.cards.length} کارڈز
                    </span>
                  </div>

                  <div>
                    <h4 class="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-500 transition">${deck.title}</h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">${deck.subtitle}</p>
                  </div>

                  <!-- Progress Bar -->
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>یادداشت کی سطح: ${deckMastered} / ${deck.cards.length} کلمات</span>
                      <span class="font-bold text-emerald-500">${deckProgress}%</span>
                    </div>
                    <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" style="width: ${deckProgress}%;"></div>
                    </div>
                  </div>
                </div>

                <div class="pt-2 flex items-center justify-between gap-3">
                  <a href="#/flashcards/${deck.id}" class="btn-primary py-2.5 px-6 text-xs rounded-xl flex-1 text-center font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                    <i data-lucide="play" class="w-4 h-4"></i>
                    <span>مشق شروع کریں</span>
                  </a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

/**
 * Flashcards Study Arena View
 */
window.Views.renderFlashcardsStudyArena = function(params) {
  const container = document.getElementById('main-content');
  const deckId = params.deckId;
  const deck = window.Views.FLASHCARD_DECKS.find(d => d.id === deckId) || window.Views.FLASHCARD_DECKS[0];
  const user = window.Auth.getCurrentUser();

  const leitnerStateKey = `learnhub_leitner_${user ? user.id : 'guest'}`;
  const leitnerState = JSON.parse(localStorage.getItem(leitnerStateKey) || '{}');

  window.activeFlashcardIndex = window.activeFlashcardIndex || 0;
  if (window.activeFlashcardIndex >= deck.cards.length) window.activeFlashcardIndex = 0;

  const currentCard = deck.cards[window.activeFlashcardIndex];
  const currentBox = (leitnerState[currentCard.id] && leitnerState[currentCard.id].box) || 1;

  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6 animate-fadeIn">
      
      <!-- Top Arena Navigation Bar -->
      <div class="flex items-center justify-between">
        <a href="#/flashcards" class="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-500 flex items-center gap-1.5">
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
          <span>تمام فلیش کارڈ ڈیکس</span>
        </a>

        <div class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <span>کارڈ ${window.activeFlashcardIndex + 1} از ${deck.cards.length}</span>
          <span class="badge bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] py-0.5 px-2">باکس ${currentBox}</span>
        </div>
      </div>

      <!-- Spaced Repetition Box Indicator -->
      <div class="flex items-center justify-center gap-2 py-2">
        ${[1, 2, 3, 4, 5].map(b => `
          <div class="flex-1 text-center py-1.5 rounded-xl border text-[11px] font-bold transition-all ${b === currentBox ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}">
            باکس ${b}
          </div>
        `).join('')}
      </div>

      <!-- 3D Flip Flashcard Main Box -->
      <div class="relative perspective-1000 min-h-[380px] w-full cursor-pointer group" onclick="window.Views.toggleCardFlip()">
        <div id="flashcard-element" class="w-full h-full min-h-[380px] transition-transform duration-500 transform-style-3d relative rounded-3xl shadow-2xl">
          
          <!-- Front Face (Arabic Word & Frequency) -->
          <div class="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/80 border-2 border-emerald-500/30 rounded-3xl p-8 flex flex-col justify-between text-white text-center shadow-2xl">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span class="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] py-1 px-3">
                ${currentCard.type}
              </span>
              <button onclick="event.stopPropagation(); window.Views.speakArabic('${currentCard.arabic}')" class="p-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 transition" title="صوتی تلفظ سنیں">
                <i data-lucide="volume-2" class="w-4 h-4"></i>
              </button>
            </div>

            <div class="py-6 space-y-3">
              <div class="text-5xl sm:text-6xl font-extrabold text-amber-300 font-serif leading-normal drop-shadow-md">
                ${currentCard.harakat}
              </div>
              <div class="text-xs text-emerald-300 font-mono">
                مادہ: ${currentCard.root}
              </div>
            </div>

            <div class="flex items-center justify-between text-xs border-t border-slate-800/80 pt-4 text-slate-400">
              <span class="flex items-center gap-1.5 text-amber-400">
                <i data-lucide="flame" class="w-3.5 h-3.5"></i>
                <span>قرآن میں ${currentCard.frequency}</span>
              </span>
              <span class="text-emerald-400 flex items-center gap-1 text-[11px] animate-pulse">
                <span>معنی دیکھنے کے لیے کارڈ پر کلک کریں</span>
                <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i>
              </span>
            </div>
          </div>

          <!-- Back Face (Urdu / English Meaning & Ayah Example) -->
          <div class="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 border-2 border-teal-500/40 rounded-3xl p-8 flex flex-col justify-between text-white text-center shadow-2xl">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span class="badge bg-teal-500/20 text-teal-400 border border-teal-500/30 text-[10px] py-1 px-3">
                اردو و انگریزی معنی
              </span>
              <button onclick="event.stopPropagation(); window.Views.speakArabic('${currentCard.arabic}')" class="p-2 rounded-xl bg-slate-800 hover:bg-teal-500 hover:text-slate-950 transition">
                <i data-lucide="volume-2" class="w-4 h-4"></i>
              </button>
            </div>

            <div class="py-4 space-y-4">
              <h3 class="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                ${currentCard.urdu}
              </h3>
              <p class="text-xs sm:text-sm text-teal-300/90 font-sans">
                ${currentCard.english}
              </p>

              ${currentCard.ayah ? `
                <div class="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-right space-y-1">
                  <div class="text-xs text-amber-300 font-serif leading-relaxed">${currentCard.ayah}</div>
                </div>
              ` : ''}
            </div>

            <div class="text-center text-xs text-slate-400 border-t border-slate-800 pt-3">
              <span class="text-teal-400">واپس عربی دیکھنے کے لیے دوبارہ کلک کریں ↺</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Spaced Repetition Action Buttons -->
      <div class="flex items-center justify-center gap-4 pt-4">
        <button onclick="window.Views.rateCard('${deck.id}', ${currentCard.id}, false)" class="btn-secondary py-3.5 px-6 rounded-2xl flex-1 text-center font-bold text-xs bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 transition shadow-lg flex items-center justify-center gap-2">
          <i data-lucide="x-circle" class="w-4 h-4"></i>
          <span>مشکل ہے (Box 1 میں بھیجیں)</span>
        </button>

        <button onclick="window.Views.rateCard('${deck.id}', ${currentCard.id}, true)" class="btn-primary py-3.5 px-6 rounded-2xl flex-1 text-center font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white border-none transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
          <i data-lucide="check-circle-2" class="w-4 h-4"></i>
          <span>یاد ہے! (اگلے باکس میں بڑھائیں)</span>
        </button>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

/**
 * Toggle Card 3D Flip
 */
window.Views.toggleCardFlip = function() {
  const card = document.getElementById('flashcard-element');
  if (card) {
    card.classList.toggle('flipped');
  }
};

/**
 * Speech Synthesis for Arabic Vocalization
 */
window.Views.speakArabic = function(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  } else {
    window.App.showToast('آپ کا براؤزر ٹیکسٹ ٹو اسپیچ کو سپورٹ نہیں کرتا۔', 'info');
  }
};

/**
 * Leitner Box Advancement Logic
 */
window.Views.rateCard = function(deckId, cardId, isCorrect) {
  const user = window.Auth.getCurrentUser();
  const leitnerStateKey = `learnhub_leitner_${user ? user.id : 'guest'}`;
  const leitnerState = JSON.parse(localStorage.getItem(leitnerStateKey) || '{}');

  let currentBox = (leitnerState[cardId] && leitnerState[cardId].box) || 1;

  if (isCorrect) {
    currentBox = Math.min(5, currentBox + 1);
    window.App.showToast(`ما شاء اللہ! کارڈ اب باکس ${currentBox} میں ہے! 🎉`, 'success');
  } else {
    currentBox = 1;
    window.App.showToast('کوئی بات نہیں! یہ لفظ روزانہ دہرائی (Box 1) میں چلا گیا ہے۔', 'info');
  }

  leitnerState[cardId] = {
    box: currentBox,
    lastReviewed: new Date().toISOString()
  };

  localStorage.setItem(leitnerStateKey, JSON.stringify(leitnerState));

  // Advance to next card
  const deck = window.Views.FLASHCARD_DECKS.find(d => d.id === deckId);
  if (deck) {
    window.activeFlashcardIndex = (window.activeFlashcardIndex + 1) % deck.cards.length;
  }

  // If flipped, reset flip class before re-rendering
  const cardEl = document.getElementById('flashcard-element');
  if (cardEl) cardEl.classList.remove('flipped');

  setTimeout(() => {
    window.Views.renderFlashcardsStudyArena({ deckId: deckId });
  }, 200);
};

/**
 * LearnHub Hadith Takhreej, Sanad Chain & Multi-Book Research Engine
 * Pure White Luxury SaaS Edition
 */

window.Views = window.Views || {};

const TAKHREEJ_DATABASE = [
  {
    id: 'h-1',
    hadithNumber: '1',
    bookName: 'صحیح بخاری',
    chapterName: 'كتاب بدء الوحي (کتاب وحی کی ابتداء)',
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.',
    urdu: 'تمام اعمال کا دارومدار نیتوں پر ہے اور ہر شخص کے لیے وہی ہے جس کی اس نے نیت کی۔ پس جس کی ہجرت دنیا حاصل کرنے کے لیے ہو یا کسی عورت سے نکاح کے لیے، تو اس کی ہجرت اسی مقصد کے لیے شمار ہو گی جس کے لیے اس نے ہجرت کی۔',
    narrator: 'امیر المؤمنین حضرت عمر بن الخطاب رضی اللہ عنہ',
    grade: 'صحیح (متفق علیہ)',
    sanadChain: [
      { name: 'رسول اللہ ﷺ', role: 'صاحبِ رسالت' },
      { name: 'حضرت عمر بن الخطاب رضی اللہ عنہ', role: 'صحابی رسول' },
      { name: 'علقمہ بن وقاص اللیثی رحمہ اللہ', role: 'تابعی جلیل' },
      { name: 'محمد بن ابراہیم التیمی رحمہ اللہ', role: 'تابعی' },
      { name: 'یحییٰ بن سعید الانصاری رحمہ اللہ', role: 'امام و فقیہ' },
      { name: 'سفیان بن عیینہ رحمہ اللہ', role: 'محدثِ حرم' },
      { name: 'امام عبد اللہ بن زبیر الحمیدی رحمہ اللہ', role: 'استادِ بخاری' },
      { name: 'امام محمد بن اسماعیل بخاری رحمہ اللہ', role: 'مؤلف' }
    ],
    takhreej: [
      { book: 'صحیح بخاری', refs: ['حدیث 1 (بدء الوحي)', 'حدیث 54 (الإيمان)', 'حدیث 2529 (العتق)', 'حدیث 6689 (الأيمان والنذور)'] },
      { book: 'صحیح مسلم', refs: ['حدیث 1907 (الإمارة)'] },
      { book: 'جامع ترمذی', refs: ['حدیث 1647 (فضائل الجهاد)'] },
      { book: 'سنن ابی داود', refs: ['حدیث 2201 (الطلاق)'] },
      { book: 'سنن نسائی', refs: ['حدیث 75 (الطهارة)'] },
      { book: 'سنن ابن ماجہ', refs: ['حدیث 4227 (الزهد)'] }
    ],
    sharh: 'یہ حدیثِ مبارکہ اسلام کے بنیادی قواعد میں سے ایک تہائی دین ہے۔ امام شافعی اور امام احمد بن حنبل رحمہم اللہ نے فرمایا کہ یہ حدیث ستر (70) فقہی ابواب میں داخل ہوتی ہے۔'
  },
  {
    id: 'h-2',
    hadithNumber: '2',
    bookName: 'صحیح مسلم',
    chapterName: 'كتاب الإيمان (حدیثِ جبریل علیہ السلام)',
    arabic: 'قَالَ: فَأَخْبِرْنِي عَنِ الإِسْلاَمِ؟ قَالَ: الإِسْلاَمُ أَنْ تَشْهَدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَتُقِيمَ الصَّلاَةَ، وَتُؤْتِيَ الزَّكَاةَ، وَتَصُومَ رَمَضَانَ، وَتَحُجَّ الْبَيْتَ إِنِ اسْتَطَعْتَ إِلَيْهِ سَبِيلاً.',
    urdu: 'حضرت جبریل علیہ السلام نے پوچھا: مجھے اسلام کے بارے میں بتائیے؟ آپ ﷺ نے فرمایا: اسلام یہ ہے کہ تم گواہی دو کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں، نماز قائم کرو، زکوٰۃ ادا کرو، رمضان کے روزے رکھو، اور اگر استطاعت ہو تو بیت اللہ کا حج کرو۔',
    narrator: 'حضرت عبد اللہ بن عمر رضی اللہ عنہما عن ابیہ عمر بن الخطاب رضی اللہ عنہ',
    grade: 'صحیح مسلم',
    sanadChain: [
      { name: 'رسول اللہ ﷺ', role: 'صاحبِ رسالت' },
      { name: 'حضرت عمر بن الخطاب رضی اللہ عنہ', role: 'صحابی' },
      { name: 'حضرت عبد اللہ بن عمر رضی اللہ عنہما', role: 'صحابی جلیل' },
      { name: 'یحییٰ بن یعمر و حمید بن عبد الرحمن', role: 'تابعین' },
      { name: 'امام مسلم بن الحجاج النیسابوری رحمہ اللہ', role: 'مؤلف' }
    ],
    takhreej: [
      { book: 'صحیح مسلم', refs: ['حدیث 8 (کتاب الایمان)'] },
      { book: 'صحیح بخاری', refs: ['حدیث 50 (کتاب الایمان)'] },
      { book: 'سنن ابی داود', refs: ['حدیث 4695 (السنة)'] },
      { book: 'جامع ترمذی', refs: ['حدیث 2610 (الایمان)'] }
    ],
    sharh: 'اس حدیث کو "ام السنۃ" کہا جاتا ہے کیونکہ اس میں دین کے تینوں بنیادی مراتب: اسلام (ظاہری اعمال)، ایمان (باطنی عقائد)، اور احسان (اخلاص کی انتہا) کو جامع انداز میں بیان کیا گیا ہے۔'
  }
];

window.Views.renderHadithTakhreej = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div class="min-h-screen bg-white dark:bg-slate-900 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="rtl">
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        <!-- Hero Header -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-sm text-center space-y-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-xs font-bold shadow-sm">
            <i data-lucide="git-merge" class="w-4 h-4 text-teal-600"></i>
            <span>علم التخریج و دراسۃ الاسناد (Hadith Takhreej & Sanad Suite)</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">تخریجِ حدیث اور اسناد کا تحقیقی نظام</h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            کتبِ ستہ (بخاری، مسلم، ابوداود، ترمذی، نسائی، ابن ماجہ) کے متون کا تقابلی جائزہ، سلسلہ اسناد اور مستند شروحات۔
          </p>

          <!-- Search Input -->
          <div class="max-w-md mx-auto relative pt-2">
            <input 
              type="text" 
              id="takhreej-search-input"
              placeholder="حدیث کا لفظ، راوی کا نام یا کتاب تلاش کریں..." 
              oninput="window.Views.filterTakhreejHadiths(this.value)"
              class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-600 shadow-sm"
            />
          </div>
        </div>

        <!-- Hadiths List -->
        <div id="takhreej-hadiths-container" class="space-y-6">
          ${window.Views.renderTakhreejCardsHtml(TAKHREEJ_DATABASE)}
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.renderTakhreejCardsHtml = function(items) {
  if (!items || items.length === 0) {
    return `
      <div class="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-2">
        <p class="text-xs text-slate-500">کوئی حدیث مبارکہ نہیں ملی۔</p>
      </div>
    `;
  }

  return items.map(h => `
    <div class="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm p-6 sm:p-8 space-y-6">
      
      <!-- Top Info Row -->
      <div class="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-xs border border-teal-600/30">
            ${h.bookName} — حدیث ${h.hadithNumber}
          </span>
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400">${h.chapterName}</span>
        </div>
        <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
          ${h.grade}
        </span>
      </div>

      <!-- Arabic Matn -->
      <div class="space-y-2">
        <h2 class="text-xl sm:text-2xl font-arabic font-extrabold text-slate-900 dark:text-slate-50 leading-loose py-1 select-all">
          ${h.arabic}
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
          ${h.urdu}
        </p>
      </div>

      <!-- Sanad Chain -->
      <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700 space-y-3">
        <h4 class="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <i data-lucide="git-commit" class="w-4 h-4 text-teal-600"></i>
          <span>سلسلہ اسناد (Sanad Chain):</span>
        </h4>
        <div class="flex flex-wrap items-center gap-1.5 text-[11px]">
          ${h.sanadChain.map((node, i) => `
            <span class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium">
              ${node.name} <span class="text-[9px] text-teal-700 dark:text-teal-400 font-bold">(${node.role})</span>
            </span>
            ${i < h.sanadChain.length - 1 ? '<span class="text-slate-400 font-mono">&larr;</span>' : ''}
          `).join('')}
        </div>
      </div>

      <!-- Takhreej References & Sharh -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-600/30 space-y-2">
          <strong class="text-teal-800 dark:text-teal-300 block font-bold">📚 تخریج و مراجع کتبِ ستہ:</strong>
          <ul class="space-y-1 text-slate-700 dark:text-slate-300">
            ${h.takhreej.map(t => `
              <li>• <strong>${t.book}:</strong> ${t.refs.join('، ')}</li>
            `).join('')}
          </ul>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700 space-y-1.5">
          <strong class="text-slate-800 dark:text-slate-200 block font-bold">💡 فقہی و علمی فوائد و شرح:</strong>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">${h.sharh}</p>
        </div>
      </div>

    </div>
  `).join('');
};

window.Views.filterTakhreejHadiths = function(query) {
  const q = (query || '').toLowerCase().trim();
  const filtered = TAKHREEJ_DATABASE.filter(h => 
    h.arabic.includes(q) || 
    h.urdu.includes(q) || 
    h.narrator.includes(q) ||
    h.bookName.includes(q)
  );

  const container = document.getElementById('takhreej-hadiths-container');
  if (container) {
    container.innerHTML = window.Views.renderTakhreejCardsHtml(filtered);
    if (window.lucide) window.lucide.createIcons();
  }
};

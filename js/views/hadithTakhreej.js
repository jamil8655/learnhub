/**
 * LearnHub Hadith Takhreej, Sanad Chain & Multi-Book Research Engine
 * Searches authentic Hadiths across Kutub as-Sittah (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasai, Ibn Majah)
 * with Takhreej cross-references, Sanad chains, and vocabulary explanations.
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
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Takhreej Hero Header -->
      <div class="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-emerald-500/40 text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold shadow-sm">
          <i data-lucide="git-merge" class="w-4 h-4 text-emerald-400"></i>
          <span>علم التخریج و دراسۃ الاسناد (Hadith Takhreej & Sanad Suite)</span>
        </div>
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white">تخریجِ حدیث اور اسناد کا تحقیقی نظام</h1>
        <p class="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          کتبِ ستہ (بخاری، مسلم، ابوداود، ترمذی، نسائی، ابن ماجہ) کے متون کا تقابلی جائزہ، سلسلہ اسناد (Sanad Tree) اور مستند شروحات۔
        </p>

        <!-- Search Bar -->
        <div class="max-w-xl mx-auto relative pt-2">
          <input 
            type="text" 
            id="takhreej-search-input"
            placeholder="حدیث کا لفظ، راوی کا نام یا کتاب تلاش کریں (مثلاً: نیت، ہجرت، جبریل...)" 
            oninput="window.Views.filterTakhreejHadiths(this.value)"
            class="w-full bg-white dark:bg-slate-900 border-2 border-emerald-400/60 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-xl"
          />
        </div>
      </div>

      <!-- Hadiths Takhreej List -->
      <div id="takhreej-hadiths-container" class="space-y-6">
        ${window.Views.renderTakhreejCardsHtml(TAKHREEJ_DATABASE)}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.renderTakhreejCardsHtml = function(items) {
  return items.map(h => `
    <div class="lh-card rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
      
      <!-- Top Meta -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div class="flex items-center gap-2">
          <span class="badge bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
            ${h.bookName} • ${h.chapterName}
          </span>
          <span class="badge bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs">
            حکم: ${h.grade}
          </span>
        </div>
        <span class="text-xs font-mono font-bold text-slate-400">راوی: ${h.narrator}</span>
      </div>

      <!-- Arabic Matn -->
      <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <p class="text-xl sm:text-2xl font-arabic font-bold text-slate-900 dark:text-slate-50 leading-loose text-right">
          ${h.arabic}
        </p>
      </div>

      <!-- Urdu Translation -->
      <div class="space-y-1 text-right font-urdu">
        <strong class="text-xs text-emerald-700 dark:text-emerald-400 block font-bold">اردو ترجمہ:</strong>
        <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">${h.urdu}</p>
      </div>

      <!-- Sanad Tree & Takhreej Split Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        
        <!-- Sanad Chain of Narrators Tree -->
        <div class="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-3">
          <h4 class="font-black text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <i data-lucide="share-2" class="w-4 h-4"></i>
            <span>سلسلہ سند و رجال (Chain of Narrators):</span>
          </h4>
          
          <div class="space-y-2 pr-2 border-r-2 border-emerald-500">
            ${h.sanadChain.map((s, idx) => `
              <div class="flex items-center justify-between text-xs py-1">
                <span class="font-bold text-slate-900 dark:text-white">${idx + 1}. ${s.name}</span>
                <span class="badge bg-white dark:bg-slate-800 text-slate-500 text-[10px]">${s.role}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Takhreej Cross References Across Kutub as-Sittah -->
        <div class="p-5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-3">
          <h4 class="font-black text-xs sm:text-sm text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
            <i data-lucide="book-marked" class="w-4 h-4"></i>
            <span>تخریج و دیگر کتبِ حدیث میں مواضع (Cross References):</span>
          </h4>
          
          <div class="space-y-2">
            ${h.takhreej.map(t => `
              <div class="text-xs space-y-1">
                <strong class="text-slate-900 dark:text-white block font-bold font-arabic">${t.book}:</strong>
                <div class="flex flex-wrap gap-1.5">
                  ${t.refs.map(r => `<span class="badge bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono">${r}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Scholarly Explanation (Sharh) -->
      <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-urdu">
        <strong class="text-emerald-700 dark:text-emerald-400 block mb-1">💡 فوائد و شرح:</strong>
        ${h.sharh}
      </div>

    </div>
  `).join('');
};

window.Views.filterTakhreejHadiths = function(query) {
  const container = document.getElementById('takhreej-hadiths-container');
  if (!container) return;
  const q = query.trim().toLowerCase();
  const filtered = TAKHREEJ_DATABASE.filter(h => 
    h.arabic.includes(q) || 
    h.urdu.includes(q) || 
    h.narrator.includes(q) ||
    h.bookName.includes(q)
  );
  container.innerHTML = window.Views.renderTakhreejCardsHtml(filtered);
  if (window.lucide) window.lucide.createIcons();
};

/**
 * LearnHub Hadith Sharif Module
 * Sahih Bukhari, Sahih Muslim, and 40 Hadith Nawawi with Arabic, Urdu, and English translations.
 */

window.Views = window.Views || {};

const HADITH_COLLECTIONS = [
  {
    id: 'bukhari-1',
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
    id: 'nawawi-1',
    book: 'اربعین نووی (40 Hadith Nawawi)',
    chapter: 'حسن الخلق (Good Character)',
    hadithNumber: '13',
    narrator: 'عَنْ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللَّهُ عَنْهُ',
    textArabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.',
    textUrdu: 'تم میں سے کوئی شخص اس وقت تک سچا مومن نہیں ہو سکتا جب تک وہ اپنے بھائی کے لیے بھی وہی پسند نہ کرے جو وہ اپنی ذات کے لیے پسند کرتا ہے۔',
    textEnglish: 'None of you truly believes until he loves for his brother what he loves for himself.',
    grade: 'متفق علیہ (Agreed Upon)'
  }
];

window.Views.renderHadith = async function() {
  const container = document.getElementById('main-content');

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Hadith Banner -->
      <div class="bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div class="relative z-10 space-y-2">
          <span class="badge bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-300/30">الحديث النبوي الشريف</span>
          <h1 class="text-3xl sm:text-4xl font-extrabold">احادیث مبارکہ کا مستند مجموعہ</h1>
          <p class="text-xs sm:text-sm text-amber-100 max-w-2xl">صحیح بخاری، صحیح مسلم اور اربعین نووی سے منتخب شدہ احادیث عربی متن، اردو اور انگریزی ترجمہ کے ساتھ۔</p>
        </div>
      </div>

      <!-- Hadith Feed -->
      <div class="space-y-6">
        ${HADITH_COLLECTIONS.map(h => `
          <div class="lh-card p-6 sm:p-8 space-y-4 border-r-4 border-r-amber-500 hover:shadow-xl transition">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span class="font-bold text-amber-700 dark:text-amber-400 text-xs">${h.book}</span>
                <span class="text-slate-400 text-xs mx-1.5">•</span>
                <span class="text-xs text-slate-500">${h.chapter}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="badge badge-success text-[10px]">${h.grade}</span>
                <span class="badge badge-neutral text-[10px]">حدیث نمبر: ${h.hadithNumber}</span>
              </div>
            </div>

            <!-- Narrator -->
            <div class="text-xs font-bold text-slate-500 text-right">
              ${h.narrator}
            </div>

            <!-- Arabic Hadith Text -->
            <p class="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 text-right leading-loose py-2">
              «${h.textArabic}»
            </p>

            <!-- Urdu Translation -->
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
              <span class="text-[11px] uppercase font-bold text-amber-600 dark:text-amber-400 block mb-1">اردو ترجمہ:</span>
              <p class="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-urdu">${h.textUrdu}</p>
            </div>

            <!-- English Translation -->
            <div class="pt-2 text-left">
              <span class="text-[11px] uppercase font-bold text-indigo-500 block mb-0.5">English Meaning:</span>
              <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">${h.textEnglish}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

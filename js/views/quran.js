/**
 * LearnHub Quran Majeed Module
 * Surahs, Ayahs with Arabic typography, Urdu translation, English translation,
 * audio recitation, and search.
 */

window.Views = window.Views || {};

// Seed Surahs Data
const QURAN_SURAHS = [
  {
    number: 1,
    nameArabic: 'الفاتحة',
    nameEnglish: 'Al-Fatiha',
    nameUrdu: 'سورۃ الفاتحہ',
    meaning: 'The Opening',
    type: 'Meccan',
    ayahCount: 7,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3',
    ayahs: [
      { number: 1, textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', textUrdu: 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔', textEnglish: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' },
      { number: 2, textArabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', textUrdu: 'سب تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے۔', textEnglish: '[All] praise is [due] to Allah, Lord of the worlds -' },
      { number: 3, textArabic: 'الرَّحْمَٰنِ الرَّحِيمِ', textUrdu: 'بڑا مہربان، نہایت رحم فرمانے والا ہے۔', textEnglish: 'The Entirely Merciful, the Especially Merciful,' },
      { number: 4, textArabic: 'مَالِكِ يَوْمِ الدِّينِ', textUrdu: 'روزِ جزا کا مالک ہے۔', textEnglish: 'Sovereign of the Day of Recompense.' },
      { number: 5, textArabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', textUrdu: 'ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں۔', textEnglish: 'It is You we worship and You we ask for help.' },
      { number: 6, textArabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', textUrdu: 'ہمیں سیدھے راستے کی ہدایت فرما۔', textEnglish: 'Guide us to the straight path -' },
      { number: 7, textArabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', textUrdu: 'ان لوگوں کا راستہ جن پر تو نے انعام فرمایا، نہ کہ ان کا راستہ جن پر غضب کیا گیا اور نہ گمراہوں کا۔', textEnglish: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.' }
    ]
  },
  {
    number: 36,
    nameArabic: 'يس',
    nameEnglish: 'Ya-Sin',
    nameUrdu: 'سورۃ یٰسٓ',
    meaning: 'Ya-Sin',
    type: 'Meccan',
    ayahCount: 83,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/36.mp3',
    ayahs: [
      { number: 1, textArabic: 'يس', textUrdu: 'یٰسٓ (حقیقی معنی اللہ ہی بہتر جانتا ہے)۔', textEnglish: 'Ya, Seen.' },
      { number: 2, textArabic: 'وَالْقُرْآنِ الْحَكِيمِ', textUrdu: 'حکمت سے بھرپور قرآن کی قسم۔', textEnglish: 'By the wise Qur\'an.' },
      { number: 3, textArabic: 'إِنَّكَ لَمِنَ الْمُرْسَلِينَ', textUrdu: 'بے شک آپ رسولوں میں سے ہیں۔', textEnglish: 'Indeed you, [O Muhammad], are from among the messengers,' },
      { number: 4, textArabic: 'عَلَىٰ صِرَاطٍ مُسْتَقِيمٍ', textUrdu: 'سیدھے راستے پر ہیں۔', textEnglish: 'On a straight path.' }
    ]
  },
  {
    number: 67,
    nameArabic: 'الملك',
    nameEnglish: 'Al-Mulk',
    nameUrdu: 'سورۃ الملک',
    meaning: 'The Sovereignty',
    type: 'Meccan',
    ayahCount: 30,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/67.mp3',
    ayahs: [
      { number: 1, textArabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', textUrdu: 'بڑی برکت والی ہے وہ ذات جس کے ہاتھ میں ساری بادشاہی ہے، اور وہ ہر چیز پر قادر ہے۔', textEnglish: 'Blessed is He in whose hand is dominion, and He is over all things competent -' },
      { number: 2, textArabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ', textUrdu: 'جس نے موت اور زندگی کو پیدا کیا تاکہ تمہیں آزمائے کہ تم میں سے کون عمل کے اعتبار سے زیادہ بہتر ہے۔', textEnglish: '[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -' }
    ]
  },
  {
    number: 112,
    nameArabic: 'الإخلاص',
    nameEnglish: 'Al-Ikhlas',
    nameUrdu: 'سورۃ الاخلاص',
    meaning: 'The Sincerity',
    type: 'Meccan',
    ayahCount: 4,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/112.mp3',
    ayahs: [
      { number: 1, textArabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', textUrdu: 'آپ فرما دیجئے کہ وہ اللہ ایک ہے۔', textEnglish: 'Say, "He is Allah, [who is] One,' },
      { number: 2, textArabic: 'اللَّهُ الصَّمَدُ', textUrdu: 'اللہ سب سے بے نیاز اور سب کا سہارا ہے۔', textEnglish: 'Allah, the Eternal Refuge.' },
      { number: 3, textArabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', textUrdu: 'نہ اس سے کوئی پیدا ہوا اور نہ وہ کسی سے پیدا ہوا ہے۔', textEnglish: 'He neither begets nor is born,' },
      { number: 4, textArabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', textUrdu: 'اور نہ کوئی اس کا ہمسر ہے۔', textEnglish: 'Nor is there to Him any equivalent."' }
    ]
  }
];

window.Views.renderQuran = async function(params) {
  const container = document.getElementById('main-content');
  const surahNum = params && params.id ? parseInt(params.id, 10) : null;

  if (surahNum) {
    window.Views.renderSurahReader(surahNum);
    return;
  }

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Quran Header -->
      <div class="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <span class="badge bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">القرآن الكريم</span>
            <h1 class="text-3xl sm:text-4xl font-extrabold">قرآن مجید (تلاوت، ترجمہ و تفسیر)</h1>
            <p class="text-xs sm:text-sm text-emerald-100 max-w-xl">عربی متن، اردو اور انگریزی ترجمہ اور شیخ مشاری راشد العفاسی کی خوبصورت تلاوت کے ساتھ۔</p>
          </div>
          <div class="text-center md:text-left bg-slate-950/40 p-4 rounded-2xl border border-emerald-500/30">
            <div class="text-3xl font-serif font-extrabold text-emerald-300">114 سورتیں</div>
            <div class="text-xs text-slate-300">مکمل تلاوت و ترجمہ</div>
          </div>
        </div>
      </div>

      <!-- Surahs Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${QURAN_SURAHS.map(surah => `
          <div class="lh-card p-6 flex flex-col justify-between hover:border-emerald-500 hover:shadow-xl transition group">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ${surah.number}
                </span>
                <span class="badge badge-neutral text-[10px]">${surah.type} • ${surah.ayahCount} آیات</span>
              </div>

              <div class="text-center py-2">
                <h3 class="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-400">${surah.nameArabic}</h3>
                <div class="text-sm font-bold text-slate-900 dark:text-white mt-1">${surah.nameUrdu}</div>
                <div class="text-xs text-slate-400">${surah.nameEnglish} (${surah.meaning})</div>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <a href="#/quran/${surah.number}" class="btn-primary flex-1 py-2 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 border-none text-center">
                تلاوت و ترجمہ پڑھیں &rarr;
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

// Detailed Surah Reader View
window.Views.renderSurahReader = function(surahNumber) {
  const container = document.getElementById('main-content');
  const surah = QURAN_SURAHS.find(s => s.number === surahNumber) || QURAN_SURAHS[0];

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Back Link & Header -->
      <div class="flex items-center justify-between">
        <a href="#/quran" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
          &larr; تمام سورتوں کی فہرست پر واپس جائیں
        </a>
      </div>

      <div class="lh-card p-6 sm:p-8 text-center space-y-4 border-2 border-emerald-500/30">
        <span class="badge badge-success text-xs">${surah.type} • ${surah.ayahCount} آیات</span>
        <h1 class="text-4xl sm:text-5xl font-serif font-extrabold text-emerald-800 dark:text-emerald-400 my-2">${surah.nameArabic}</h1>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">${surah.nameUrdu} — ${surah.nameEnglish}</h2>
        
        <!-- Audio Player -->
        <div class="pt-4 max-w-md mx-auto">
          <audio controls class="w-full rounded-xl">
            <source src="${surah.audioUrl}" type="audio/mp3">
            Your browser does not support the audio player.
          </audio>
        </div>
      </div>

      <!-- Ayahs List -->
      <div class="space-y-6">
        ${surah.ayahs.map(ayah => `
          <div class="lh-card p-6 sm:p-8 space-y-4 border-r-4 border-r-emerald-500 hover:shadow-lg transition">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold font-mono">
                ${ayah.number}
              </span>
              <button onclick="navigator.clipboard.writeText('${ayah.textArabic} - ${ayah.textUrdu}'); window.App.showToast('آیت کاپی ہو گئی!', 'success');" class="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i> آیت کاپی کریں
              </button>
            </div>

            <!-- Arabic Mushaf Text -->
            <p class="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 text-right leading-loose py-2">
              ${ayah.textArabic}
            </p>

            <!-- Urdu Translation -->
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
              <span class="text-[11px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-1">اردو ترجمہ:</span>
              <p class="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-urdu">${ayah.textUrdu}</p>
            </div>

            <!-- English Translation -->
            <div class="pt-2 text-left">
              <span class="text-[11px] uppercase font-bold text-indigo-500 block mb-0.5">English Translation:</span>
              <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">${ayah.textEnglish}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

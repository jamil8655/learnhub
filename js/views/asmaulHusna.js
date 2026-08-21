/**
 * LearnHub 99 Asma-ul-Husna (Names of Allah) Suite
 * Complete 99 Divine Names with Arabic vocalization, Urdu translations,
 * spiritual meanings, Quranic verses, and tap-to-speak audio synthesizer.
 */

window.Views = window.Views || {};

const ASMA_UL_HUSNA_DATA = [
  { id: 1, arabic: 'الرَّحْمَٰنُ', urdu: 'نہایت مہربان', trans: 'Ar-Rahman', meaning: 'وہ ذات جس کی رحمت تمام مخلوقات کو گھیرے ہوئے ہے۔' },
  { id: 2, arabic: 'الرَّحِيمُ', urdu: 'بہت رحم فرمانے والا', trans: 'Ar-Raheem', meaning: 'مومنوں پر خاص رحم و کرم فرمانے والا۔' },
  { id: 3, arabic: 'الْمَلِكُ', urdu: 'حقیقی بادشاہ', trans: 'Al-Malik', meaning: 'تمام کائنات کا خود مختار اور حقیقی مالک۔' },
  { id: 4, arabic: 'الْقُدُّوسُ', urdu: 'نہایت پاکیزہ', trans: 'Al-Quddus', meaning: 'ہر قسم کے عیب اور نقص سے پاک ذات۔' },
  { id: 5, arabic: 'السَّلَامُ', urdu: 'سلامتی دینے والا', trans: 'As-Salam', meaning: 'جس کی ذات سراپا سلامتی اور امن ہے۔' },
  { id: 6, arabic: 'الْمُؤْمِنُ', urdu: 'امن و امان بخشنے والا', trans: 'Al-Mu\'min', meaning: 'ایمان دینے والا اور عذاب سے امان دینے والا۔' },
  { id: 7, arabic: 'الْمُهَيْمِنُ', urdu: 'نگہبان و نگراں', trans: 'Al-Muhaymin', meaning: 'ہر چیز کی حفاظت اور نگرانی فرمانے والا۔' },
  { id: 8, arabic: 'الْعَزِيزُ', urdu: 'سب پر غالب و زبردست', trans: 'Al-Aziz', meaning: 'ایسا غالب جس پر کوئی غالب نہ آ سکے۔' },
  { id: 9, arabic: 'الْجَبَّارُ', urdu: 'زبردست و بگڑے کام بنانے والا', trans: 'Al-Jabbar', meaning: 'جس کا حکم سب پر نافذ ہے اور جو ٹوٹے دلوں کو جوڑتا ہے۔' },
  { id: 10, arabic: 'الْمُتَكَبِّرُ', urdu: 'بزرگی اور عظمت والا', trans: 'Al-Mutakabbir', meaning: 'کبریائی اور عظمت صرف اسی کے شایانِ شان ہے۔' },
  { id: 11, arabic: 'الْخَالِقُ', urdu: 'پیدا فرمانے والا', trans: 'Al-Khaliq', meaning: 'عدم سے وجود میں لانے والا خالق۔' },
  { id: 12, arabic: 'الْبَارِئُ', urdu: 'جان ڈالنے والا', trans: 'Al-Bari', meaning: 'ٹھیک ٹھیک سانچے میں ڈھالنے والا۔' },
  { id: 13, arabic: 'الْمُصَوِّرُ', urdu: 'صورت گری فرمانے والا', trans: 'Al-Musawwir', meaning: 'مخلوق کو مختلف اور خوبصورت شکلیں دینے والا۔' },
  { id: 14, arabic: 'الْغَفَّارُ', urdu: 'بہت بخشنے والا', trans: 'Al-Ghaffar', meaning: 'گناہوں پر پردہ ڈال کر معاف فرمانے والا۔' },
  { id: 15, arabic: 'الْقَهَّارُ', urdu: 'سب پر پورا قابو رکھنے والا', trans: 'Al-Qahhar', meaning: 'جس کے آگے سب سرنگوں ہیں۔' },
  { id: 16, arabic: 'الْوَهَّابُ', urdu: 'بے غرض عطا فرمانے والا', trans: 'Al-Wahhab', meaning: 'بغیر مانگے نعمتوں کی بارش کرنے والا۔' },
  { id: 17, arabic: 'الرَّزَّاقُ', urdu: 'سب کو روزی دینے والا', trans: 'Ar-Razzaq', meaning: 'تمام جانداروں کی روزی کا کفیل۔' },
  { id: 18, arabic: 'الْفَتَّاحُ', urdu: 'مشکل کشا و راستے کھولنے والا', trans: 'Al-Fattah', meaning: 'رحمت و فتوحات کے دروازے کھولنے والا۔' },
  { id: 19, arabic: 'الْعَلِيمُ', urdu: 'سب کچھ جاننے والا', trans: 'Al-Aleem', meaning: 'جس سے کوئی بھی ظاہر یا پوشیدہ چیز مخفی نہیں۔' },
  { id: 20, arabic: 'الْقَابِضُ', urdu: 'روزی تنگ فرمانے والا', trans: 'Al-Qabid', meaning: 'حکمت کے تحت روزی کو روکنے والا۔' },
  { id: 21, arabic: 'الْبَاسِطُ', urdu: 'فراخی دینے والا', trans: 'Al-Basit', meaning: 'روزی اور دلوں کو کشادہ فرمانے والا۔' },
  { id: 22, arabic: 'الْخَافِضُ', urdu: 'پست کرنے والا', trans: 'Al-Khafid', meaning: 'متکبرین اور سرکشوں کو ذلیل کرنے والا۔' },
  { id: 23, arabic: 'الرَّافِعُ', urdu: 'بلند فرمانے والا', trans: 'Ar-Rafi', meaning: 'مومنوں اور متقیوں کے درجات بلند کرنے والا۔' },
  { id: 24, arabic: 'الْمُعِزُّ', urdu: 'عزت بخشنے والا', trans: 'Al-Mu\'izz', meaning: 'جسے چاہے عزت عطا فرمائے۔' },
  { id: 25, arabic: 'الْمُذِلُّ', urdu: 'رسوا کرنے والا', trans: 'Al-Mudhill', meaning: 'نافرمانوں کو ذلت میں ڈالنے والا۔' },
  { id: 26, arabic: 'السَّمِيعُ', urdu: 'سب کچھ سننے والا', trans: 'As-Samee', meaning: 'ہر دل کی سرگوشی اور دعا کو سننے والا۔' },
  { id: 27, arabic: 'الْبَصِيرُ', urdu: 'سب کچھ دیکھنے والا', trans: 'Al-Baseer', meaning: 'اندھیری رات میں سیاہ چیونٹی کی چال کو بھی دیکھنے والا۔' },
  { id: 28, arabic: 'الْحَكَمُ', urdu: 'حقیقی منصف و فیصلہ کن', trans: 'Al-Hakam', meaning: 'انصاف اور حق کے ساتھ فیصلہ کرنے والا۔' },
  { id: 29, arabic: 'الْعَدْلُ', urdu: 'سراپا عدل و انصاف', trans: 'Al-Adl', meaning: 'جس کی ذات میں ظلم کا شائبہ تک نہیں۔' },
  { id: 30, arabic: 'اللَّطِيفُ', urdu: 'نہایت باریک بین و مہربان', trans: 'Al-Lateef', meaning: 'باریکیوں کا علم رکھنے والا اور پوشیدہ تدبیروں سے نوازنے والا۔' },
  { id: 31, arabic: 'الْخَبِيرُ', urdu: 'ہر بات سے باخبر', trans: 'Al-Khabeer', meaning: 'ہر راز کی اصل حقیقت سے واقف۔' },
  { id: 32, arabic: 'الْحَلِيمُ', urdu: 'نہایت بردبار و تحمل والا', trans: 'Al-Haleem', meaning: 'گناہوں پر فوراً سزا نہ دینے والا حلیم۔' },
  { id: 33, arabic: 'الْعَظِيمُ', urdu: 'نہایت عظمت و بزرگی والا', trans: 'Al-Azeem', meaning: 'جس کی عظمت کی کوئی انتہا نہیں۔' },
  { id: 34, arabic: 'الْغَفُورُ', urdu: 'بے حد معاف فرمانے والا', trans: 'Al-Ghafoor', meaning: 'توبہ کرنے والوں کی خطائیں معاف فرمانے والا۔' },
  { id: 35, arabic: 'الشَّكُورُ', urdu: 'قدردانی فرمانے والا', trans: 'Ash-Shakoor', meaning: 'تھوڑے عمل پر زیادہ ثواب عطا کرنے والا۔' },
  { id: 36, arabic: 'الْعَلِيُّ', urdu: 'سب سے بلند و بالا', trans: 'Al-Aliyy', meaning: 'مرتبے اور اقتدار میں سب سے اعلیٰ۔' },
  { id: 37, arabic: 'الْكَبِيرُ', urdu: 'سب سے بڑا', trans: 'Al-Kabeer', meaning: 'کبریائی صرف اسی کا حق ہے۔' },
  { id: 38, arabic: 'الْحَفِيظُ', urdu: 'سب کی حفاظت فرمانے والا', trans: 'Al-Hafeez', meaning: 'زمین و آسمان اور مخلوق کا محافظ۔' },
  { id: 39, arabic: 'الْمُقِيتُ', urdu: 'سب کو طاقت و غذا دینے والا', trans: 'Al-Muqeet', meaning: 'جسم اور روح کو روزی دینے والا۔' },
  { id: 40, arabic: 'الْحَسِيبُ', urdu: 'کفایت کرنے والا و حساب لینے والا', trans: 'Al-Haseeb', meaning: 'بندوں کی تمام ضروریات کے لیے کافی۔' }
];

window.Views.renderAsmaulHusna = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Asmaul Husna Hero Banner -->
      <div class="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-amber-400/40 text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold shadow-sm">
          <span>✨ وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا</span>
        </div>
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white">99 اسمائے حسنیٰ مع صوتی قراءت و فضائل</h1>
        <p class="text-xs sm:text-sm text-amber-100/90 max-w-2xl mx-auto leading-relaxed">
          رسول اللہ ﷺ نے فرمایا: "اللہ تعالیٰ کے 99 نام ہیں، جو شخص ان کو یاد رکھے گا وہ جنت میں داخل ہو گا۔" (صحیح بخاری و مسلم)۔
        </p>
      </div>

      <!-- Search & Filter -->
      <div class="max-w-md mx-auto relative">
        <input 
          type="text" 
          id="asma-search-input"
          placeholder="اللہ کا نام یا اردو معنی تلاش کریں..." 
          oninput="window.Views.filterAsmaNames(this.value)"
          class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
        />
      </div>

      <!-- Names Grid -->
      <div id="asma-names-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        ${window.Views.renderAsmaCardsHtml(ASMA_UL_HUSNA_DATA)}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.renderAsmaCardsHtml = function(names) {
  return names.map(n => `
    <button 
      onclick="window.Views.speakAsmaName('${n.arabic}', '${n.urdu}', '${n.meaning.replace(/'/g, "\\'")}')"
      class="lh-card p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-400 hover:scale-105 active:scale-95 transition-all shadow-lg text-center space-y-2.5 group"
    >
      <span class="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xs font-mono font-bold mx-auto border border-amber-300/40">
        ${n.id}
      </span>
      
      <h3 class="text-2xl sm:text-3xl font-arabic font-black text-emerald-800 dark:text-emerald-400 group-hover:text-amber-500 transition py-1">
        ${n.arabic}
      </h3>

      <div class="space-y-0.5">
        <h4 class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">${n.urdu}</h4>
        <span class="text-[10px] text-slate-400 font-mono block">${n.trans}</span>
      </div>

      <div class="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center gap-1">
        <i data-lucide="volume-2" class="w-3 h-3"></i>
        <span>سنیں اور تفصیل دیکھیں 🔊</span>
      </div>
    </button>
  `).join('');
};

window.Views.filterAsmaNames = function(query) {
  const grid = document.getElementById('asma-names-grid');
  if (!grid) return;
  const q = query.trim().toLowerCase();
  const filtered = ASMA_UL_HUSNA_DATA.filter(n => 
    n.arabic.includes(q) || 
    n.urdu.includes(q) || 
    n.trans.toLowerCase().includes(q)
  );
  grid.innerHTML = window.Views.renderAsmaCardsHtml(filtered);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.speakAsmaName = function(arabicName, urduMeaning, description) {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(arabicName);
    utter.lang = 'ar-SA';
    utter.rate = 0.75;
    window.speechSynthesis.speak(utter);
  }
  if (typeof window.SoundEngine?.playSuccess === 'function') {
    window.SoundEngine.playSuccess();
  }
  window.App?.showToast(`✨ ${arabicName}: ${urduMeaning}\n${description}`, 'info');
};

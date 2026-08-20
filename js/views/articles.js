/**
 * LearnHub Articles & Knowledge Base Module
 * 100% Authentic Urdu Islamic & Tech Articles with rich reader, category filtering, search, and RTL typography.
 */

window.Views = window.Views || {};

const ARTICLES_LIST = [
  {
    id: 'art-1',
    title: 'قرآن مجید کو سمجھ کر پڑھنے کی اہمیت اور عملی طریقہ کار',
    slug: 'importance-of-understanding-quran',
    category: 'قرآنی علوم و فہم',
    categoryId: 'quran',
    author: 'ڈاکٹر محمد عثمان الہاشمی',
    authorTitle: 'محقق علوم القرآن و استاذ جامعہ',
    readTime: '۶ منٹ کا مطالعہ',
    date: '۱۸ فروری ۲۰۲۶',
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800',
    summary: 'قرآن مجید محض تلاوت و ثواب کے لیے نہیں بلکہ انسانی زندگی کے تمام فکری، اخلاقی اور سماجی شعبوں میں رہنمائی کا سرچشمہ ہے۔ اس مضمون میں فہمِ قرآن کے ۳ آسان اور عملی اصول بیان کیے گئے ہیں۔',
    content: `
      <p class="leading-loose mb-5 text-slate-700 dark:text-slate-300 text-base sm:text-lg">
        قرآن مجید اللہ رب العزت کا وہ آخری اور ابدی کلام ہے جو پوری انسانیت کے لیے رشد و ہدایت کا منبع ہے۔ تلاوت کا اجر اپنی جگہ مسلم ہے، لیکن قرآن کے نازل ہونے کا بنیادی مقصد اس کی آیات پر تدبر اور ان کے مطابق اپنی زندگی کو سنوارنا ہے۔
      </p>

      <div class="my-6 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border-r-4 border-emerald-500 text-right">
        <p class="font-serif text-xl sm:text-2xl text-emerald-900 dark:text-emerald-100 mb-2 leading-relaxed" dir="rtl">
          «كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ وَلِيَتَذَكَّرَ أُولُو الْأَلْبَابِ»
        </p>
        <span class="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 font-bold block">
          ترجمہ: "یہ ایک بابرکت کتاب ہے جو ہم نے آپ کی طرف نازل کی تاکہ یہ لوگ اس کی آیات میں غور و فکر کریں اور عقل والے نصیحت حاصل کریں۔" (سورۃ ص: ۲۹)
        </span>
      </div>

      <h3 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        روزانہ فہمِ قرآن کے ۳ عملی طریقے:
      </h3>

      <div class="space-y-4 my-4">
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
          <h4 class="font-bold text-base text-indigo-600 dark:text-indigo-400">۱. تھوڑی مقدار لیکن دائمی تسلسل</h4>
          <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            روزانہ زیادہ مقدار کے بجائے کم از کم ۵ تا ۱۰ آیات بامحاورہ ترجمہ و مختصر تفسیر کے ساتھ پڑھیں۔ رسول اللہ ﷺ کا فرمان ہے کہ اللہ کے نزدیک سب سے پسندیدہ عمل وہ ہے جو ہمیشہ کیا جائے خواہ تھوڑا ہو۔
          </p>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
          <h4 class="font-bold text-base text-emerald-600 dark:text-emerald-400">۲. قرآنی عربی کے بنیادی الفاظ کا ذخیرہ</h4>
          <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            قرآن مجید میں تقریباً ۸۰ فیصد ایسے الفاظ ہیں جو بار بار دہرائے جاتے ہیں۔ بنیادی گرامر اور چند سو کلمات کا مفہوم سیکھ لینے سے نماز اور تلاوت میں براہِ راست فہم پیدا ہو جاتا ہے۔
          </p>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
          <h4 class="font-bold text-base text-amber-600 dark:text-amber-400">۳. عملی زندگی میں فوری انطباق</h4>
          <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            جو آیت بھی پڑھیں، خود سے سوال کریں: "اس آیت میں میرے لیے کیا حکم ہے؟ اور میں اپنی سوچ یا معاملات میں کیا تبدیلی لاؤں؟" صحابہ کرام رضی اللہ عنہم ۱۰ آیات پڑھتے تو جب تک ان پر عمل نہ کر لیتے اگلی آیات نہ پڑھتے۔
          </p>
        </div>
      </div>

      <h3 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
        خلاصہ و نتیجہ:
      </h3>
      <p class="leading-loose text-slate-700 dark:text-slate-300 text-base sm:text-lg">
        قرآن سے سچا تعلق قائم کرنے کے لیے روزانہ وقت نکالنا ہماری روحانی و اخلاقی بقا کے لیے ناگزیر ہے۔ لرن ہب کے تفسیری کورسز اور قرآنی کوئزز اس سفر میں آپ کے بہترین معاون ثابت ہو سکتے ہیں۔
      </p>
    `
  },
  {
    id: 'art-2',
    title: 'جدید سافٹ ویئر انجینئرنگ اور مصنوعی ذہانت کے دور میں اسلامی اخلاقیات',
    slug: 'islamic-ethics-in-software-engineering',
    category: 'ٹیکنالوجی اور اخلاقیات',
    categoryId: 'tech-ethics',
    author: 'انجینئر طارق حمید',
    authorTitle: 'سینئر سسٹم آرکیٹیکٹ و ٹیکنیکل مشیر',
    readTime: '۸ منٹ کا مطالعہ',
    date: '۱۶ فروری ۲۰۲۶',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    summary: 'ڈیٹا پرائیویسی، امانت داری، اور مصنوعی ذہانت (AI) کے اس تیز ترین دور میں ایک مسلم ڈویلپر اور انجینئر کے لیے رہنماء اصول اور شرعی ذمہ داریاں۔',
    content: `
      <p class="leading-loose mb-5 text-slate-700 dark:text-slate-300 text-base sm:text-lg">
        ٹیکنالوجی بذاتِ خود نہ اچھی ہے نہ بری، بلکہ یہ ایک طاقتور ہتھیار اور وسیلہ ہے جس کا استعمال انسان کی نیت اور اخلاق پر منحصر ہے۔ دورِ حاضر میں جب مصنوعی ذہانت اور الگورتھمز روزمرہ زندگی کے فیصلے کر رہے ہیں، اسلامی اخلاقیات کی اہمیت دوچند ہو جاتی ہے۔
      </p>

      <h3 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        مسلم انجینئر کے ۳ بنیادی اخلاقی ستون:
      </h3>

      <ul class="space-y-4 my-4">
        <li class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <strong class="text-base text-indigo-600 dark:text-indigo-400 block mb-1">۱. صارفین کے ڈیٹا کی حفاظت اور امانت داری (Data Privacy)</strong>
          <span class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed block">
            صارفین کا ذاتی ڈیٹا، پاس ورڈز، اور گفتگو ڈویلپر کے پاس امانت ہیں۔ بغیر اجازت ڈیٹا بیچنا، مانیٹر کرنا، یا سیکیورٹی میں غفلت برتنا شرعی طور پر خیانت کے زمرے میں آتا ہے۔ اللہ تعالیٰ کا فرمان ہے: «إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا»۔
          </span>
        </li>

        <li class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <strong class="text-base text-emerald-600 dark:text-emerald-400 block mb-1">۲. الگورتھم کی شفافیت اور دھوکہ دہی سے اجتناب (Fair Algorithms)</strong>
          <span class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed block">
            ڈارک پیٹرنز (Dark Patterns)، غیر ارادی سبسکرپشنز میں صارفین کو الجھانا، یا تعصب پر مبنی مصنوعی ذہانت کے ماڈلز تیار کرنا اسلامی اصولِ عدل کے منافی ہے۔ کوڈنگ میں سچائی اور صفائی عبادت کا درجہ حاصل کر سکتی ہے۔
          </span>
        </li>

        <li class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <strong class="text-base text-amber-600 dark:text-amber-400 block mb-1">۳. انسانیت کے فائدے کے لیے ٹیکنالوجی کا فروغ (Naf'un lin-Nas)</strong>
          <span class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed block">
            رسول اللہ ﷺ نے فرمایا: «خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ» (سب سے بہترین انسان وہ ہے جو لوگوں کو سب سے زیادہ فائدہ پہنچائے)۔ ہمیں ایسے سافٹ ویئر اور سسٹمز بنانے چاہئیں جو علم پھیلائیں، غربت کم کریں، اور انسانی فلاح کو ممکن بنائیں۔
          </span>
        </li>
      </ul>
    `
  },
  {
    id: 'art-3',
    title: 'تجوید القرآن کے بنیادی اصول: مخارج اور صفات کی درست ادائیگی',
    slug: 'tajweed-makharij-and-sifat-fundamentals',
    category: 'تجوید و ترتیل',
    categoryId: 'tajweed',
    author: 'استاذہ فاطمہ الزہراء',
    authorTitle: 'ماہرہ تجوید و قراءاتِ عشرہ',
    readTime: '۷ منٹ کا مطالعہ',
    date: '۱۵ فروری ۲۰۲۶',
    image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=800',
    summary: 'قرآن مجید کی درست تلاوت کے لیے حروف کے ۱۷ مخارج، نون ساکن و تنوین کے قواعد، اور قلقلہ کی صحیح ادائیگی کی تفصیلی و آسان رہنمائی۔',
    content: `
      <p class="leading-loose mb-5 text-slate-700 dark:text-slate-300 text-base sm:text-lg">
        علمِ تجوید کا مقصد قرآن کریم کے ہر حرف کو اس کے صحیح مخرج (نکلنے کی جگہ) اور اس کی لازم و عارض صفات کے ساتھ ادا کرنا ہے تاکہ تلاوت میں کوئی غلطی (لحن) واقع نہ ہو۔
      </p>

      <div class="my-6 p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border-r-4 border-amber-500 text-right">
        <p class="font-serif text-xl sm:text-2xl text-amber-900 dark:text-amber-100 mb-2 leading-relaxed" dir="rtl">
          «وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا»
        </p>
        <span class="text-xs sm:text-sm text-amber-700 dark:text-amber-300 font-bold block">
          ترجمہ: "اور قرآن کو خوب ٹھہر ٹھہر کر اور درست قواعد کے ساتھ پڑھو۔" (سورۃ المزمل: ۴)
        </span>
      </div>

      <h3 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-4">
        اہم مخارج کی ۵ بنیادی تقسیمات:
      </h3>
      <ol class="list-decimal list-inside space-y-3 text-slate-700 dark:text-slate-300 text-base leading-relaxed">
        <li><strong>الجوف (منہ کا خالی حصہ)</strong>: حروفِ مدہ (الف، واؤ، یاء مدہ) کا مخرج۔</li>
        <li><strong>الحلق (گلا)</strong>: ۶ حروفِ حلقی (ہمزہ، ہاء، عین، حاء، غین، خاء) کا مخرج۔</li>
        <li><strong>اللسان (زبان)</strong>: ۱۸ حروف کے ۱۰ مختلف مخارج۔</li>
        <li><strong>الشفتان (دونوں ہونٹ)</strong>: ۴ حروف (ب، م، و، ف) کا مخرج۔</li>
        <li><strong>الخيشوم (ناک کا بانسہ)</strong>: غنہ کی آواز نکلنے کی جگہ۔</li>
      </ol>
    `
  },
  {
    id: 'art-4',
    title: 'سنتِ نبوی ﷺ اور دورِ حاضر کا طرزِ زندگی: وقت اور صحت کی قدر',
    slug: 'sunnah-lifestyle-productivity-health',
    category: 'سیرت و سنت',
    categoryId: 'seerah',
    author: 'ڈاکٹر انیس احمد صدیقی',
    authorTitle: 'استاد علوم الحدیث و محقق',
    readTime: '۵ منٹ کا مطالعہ',
    date: '۱۲ فروری ۲۰۲۶',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=800',
    summary: 'صبح سویرے بیدار ہونا، اعتدال پسند غذا، اور وقت کی برکت: رسول اکرم ﷺ کی سنتِ طیبہ دورِ جدید کے اسٹریس اور بے ترتیبی کا واحد اور کامل علاج ہے۔',
    content: `
      <p class="leading-loose mb-5 text-slate-700 dark:text-slate-300 text-base sm:text-lg">
        آج کی مصروف زندگی میں ذہنی تناؤ، نیند کی کمی اور وقت کی قلت عام شکایات ہیں۔ جب ہم رسول اکرم ﷺ کی پاکیزہ زندگی کا مطالعہ کرتے ہیں تو معلوم ہوتا ہے کہ آپ ﷺ کا معمول انتہائی متوازن، پرسکون اور برکتوں سے معمور تھا۔
      </p>

      <h3 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-4">
        صبح کی برکت کا نبوی فارمولا:
      </h3>
      <p class="leading-loose mb-4 text-slate-700 dark:text-slate-300 text-base">
        آپ ﷺ نے دعا فرمائی: <em>«اللَّهُمَّ بَارِكْ لِأُمَّتِي فِي بُكُورِهَا»</em> (اے اللہ! میری امت کے لیے صبح کے وقت کے کاموں میں برکت عطا فرما)۔ نمازِ فجر کے بعد کا وقت انسان کی ذہنی صلاحیت، تخلیقی کاموں اور حصولِ علم کے لیے سب سے زرخیز ہوتا ہے۔
      </p>
    `
  },
  {
    id: 'art-5',
    title: 'ڈیٹا سائنس اور الگورتھمز کی بنیاد: مسلم سائنسدانوں کا تاریخی کردار',
    slug: 'history-of-algorithms-and-muslim-scientists',
    category: 'تاریخ و سائنس',
    categoryId: 'history',
    author: 'پروفیسر ڈاکٹر عبد الرحیم',
    authorTitle: 'محقق تاریخِ سائنس و ریاضیات',
    readTime: '۹ منٹ کا مطالعہ',
    date: '۱۰ فروری ۲۰۲۶',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    summary: 'الخوارزمی کے الجبرا سے لے کر ابن الہیثم کے بصریاتی اصولوں تک: کس طرح قرآنی فکر نے مسلمانوں کو سائنسی انقلاب اور جدید کمپیوٹنگ کی بنیادیں رکھنے پر ابھارا۔',
    content: `
      <p class="leading-loose mb-5 text-slate-700 dark:text-slate-300 text-base sm:text-lg">
        لفظ "Algorithm" خود مسلم ریاضی دان محمد بن موسیٰ الخوارزمی کے نام سے ماخوذ ہے۔ قرآنی تعلیمات نے کائنات کے اصولوں پر غور و خوض، ریاضی، علمِ فلکیات اور طب کی تحقیق کو ایک مذہبی فریضہ بنا دیا تھا۔
      </p>
      <p class="leading-loose mb-4 text-slate-700 dark:text-slate-300 text-base">
        مسلم سائنسدانوں نے سائنسی طریقہ کار (Empirical Scientific Method) کی بنیاد رکھی جس پر آج کی تمام جدید کمپیوٹر سائنس اور ڈیٹا اینالیٹکس استوار ہے۔
      </p>
    `
  },
  {
    id: 'art-6',
    title: 'علم کے حصول کے آداب اور طالبِ علم کی بنیادی ذمہ داریاں',
    slug: 'etiquette-of-seeking-knowledge',
    category: 'اسلامی تعلیمات',
    categoryId: 'islamic-studies',
    author: 'مفتی عبد الرحمن القادری',
    authorTitle: 'صدر مفتی دار الافتاء و مدرس',
    readTime: '۶ منٹ کا مطالعہ',
    date: '۰۸ فروری ۲۰۲۶',
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800',
    summary: 'اخلاصِ نیت، اساتذہ کا احترام، مستقل مزاجی اور حاصل کردہ علم پر عمل: امام نوویؒ اور امام غزالیؒ کی روشنی میں حصولِ علم کے سنہرے آداب۔',
    content: `
      <p class="leading-loose mb-5 text-slate-700 dark:text-slate-300 text-base sm:text-lg">
        علم نافع وہ ہے جو انسان کے دل میں خوفِ خدا، تواضع اور مخلوقِ خدا کے لیے نفع رسانی کا جذبہ پیدا کرے۔ امام شافعی رحمۃ اللہ علیہ فرماتے ہیں کہ علم محض معلومات کا نام نہیں بلکہ وہ نور ہے جو سینوں کو روشن کرتا ہے۔
      </p>
      <ul class="list-disc list-inside space-y-3 text-slate-700 dark:text-slate-300 text-base">
        <li><strong>پہلا ادب</strong>: نیت کا اخلاص کہ علم محض دنیاوی شہرت یا بحث میں برتری کے لیے نہ ہو۔</li>
        <li><strong>دوسرا ادب</strong>: استاد کا ادب و احترام اور شکر گزاری۔</li>
        <li><strong>تیسرا ادب</strong>: صبر، محنت اور مسلسل مطالعہ۔</li>
        <li><strong>چوتھا ادب</strong>: جو سیکھیں اس پر پہلے خود عمل کریں اور دوسروں تک دیانت سے پہنچائیں۔</li>
      </ul>
    `
  }
];

window.Views.renderArticles = async function(params) {
  const container = document.getElementById('main-content');
  const articleId = params && params.id ? params.id : null;
  const currentLang = window.I18N ? window.I18N.getCurrentLanguage() : 'ur';

  // Detail View of a Single Article
  if (articleId) {
    const art = ARTICLES_LIST.find(a => a.id === articleId) || ARTICLES_LIST[0];
    const related = ARTICLES_LIST.filter(a => a.id !== art.id).slice(0, 2);

    container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-urdu" dir="rtl">
        
        <!-- Breadcrumb & Back Navigation -->
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <a href="#/articles" class="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 transition">
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
            <span>تمام مضامین کی فہرست پر واپس جائیں</span>
          </a>

          <button onclick="window.Views.copyArticleLink('${art.id}')" class="btn-secondary py-1.5 px-3 rounded-xl text-xs flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600">
            <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
            <span>مضمون شیئر کریں</span>
          </button>
        </div>

        <!-- Article Main Heading & Meta -->
        <div class="space-y-4 text-right">
          <div class="flex flex-wrap items-center gap-2">
            <span class="badge bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold px-3 py-1">
              ${art.category}
            </span>
            <span class="text-xs text-slate-400">•</span>
            <span class="text-xs text-slate-500 flex items-center gap-1">
              <i data-lucide="clock" class="w-3.5 h-3.5"></i> ${art.readTime}
            </span>
          </div>

          <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-relaxed sm:leading-loose">
            ${art.title}
          </h1>

          <!-- Author Header Card -->
          <div class="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div class="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md">
              <i data-lucide="user-check" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>${art.author}</span>
                <span class="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-sans">مستند مصنف ✓</span>
              </div>
              <div class="text-[11px] text-slate-500">${art.authorTitle} • بتاریخ ${art.date}</div>
            </div>
          </div>
        </div>

        <!-- Cover Image -->
        <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
          <img src="${art.image}" alt="${art.title}" class="w-full aspect-video object-cover">
        </div>

        <!-- Article Rich Content Body -->
        <article class="lh-card p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-right leading-loose">
          ${art.content}
        </article>

        <!-- Related Articles Recommendations -->
        <div class="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="sparkles" class="w-5 h-5 text-amber-500"></i> مزید متعلقہ علمی مضامین
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            ${related.map(rel => `
              <a href="#/articles/${rel.id}" class="lh-card p-5 rounded-2xl flex flex-col justify-between hover:shadow-xl hover:border-indigo-500/40 transition group">
                <div class="space-y-2.5">
                  <span class="badge bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-bold">${rel.category}</span>
                  <h4 class="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-normal">
                    ${rel.title}
                  </h4>
                  <p class="text-xs text-slate-500 line-clamp-2">${rel.summary}</p>
                </div>
                <div class="pt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80 mt-3">
                  <span>${rel.author}</span>
                  <span class="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                    مطالعہ کریں <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
                  </span>
                </div>
              </a>
            `).join('')}
          </div>
        </div>

      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Articles Catalog & Knowledge Base Listing
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-urdu" dir="rtl">
      
      <!-- Top Royal Hero Banner -->
      <div class="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-indigo-500/30">
        <div class="relative z-10 space-y-3 text-right">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold">
            <i data-lucide="book-open" class="w-4 h-4"></i>
            <span>علمی، تحقیقی و فنی مضامین • نالج بیس پورٹل</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold leading-tight">
            مضامین، علمی رہنمائی اور نالج بیس
          </h1>
          <p class="text-xs sm:text-sm text-indigo-200/90 max-w-3xl leading-relaxed">
            قرآن و سنت کی روشنی میں رہنمائی، جدید سافٹ ویئر انجینئرنگ میں اسلامی اخلاقیات، تجوید کے قواعد اور اسلامی تاریخ کے فکری و معلوماتی مقالات۔
          </p>

          <!-- Quick Metrics -->
          <div class="flex flex-wrap gap-4 pt-2 text-xs text-indigo-200">
            <div class="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10">
              <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i>
              <span>مستند اساتذہ و محققین کی تحریریں</span>
            </div>
            <div class="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10">
              <i data-lucide="clock" class="w-4 h-4 text-amber-400"></i>
              <span>مختصر اور پُراثر مطالعہ</span>
            </div>
            <div class="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10">
              <i data-lucide="share-2" class="w-4 h-4 text-cyan-400"></i>
              <span>آسان آن لائن اشتراک</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="lh-card p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Live Search -->
        <div class="relative w-full md:w-80">
          <input 
            type="text" 
            id="article-search-input"
            placeholder="مضامین میں تلاش کریں..." 
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-4 pr-10 text-xs focus:ring-2 focus:ring-indigo-500 text-right"
            oninput="window.Views.filterArticlesBySearch(this.value)"
          />
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute right-3.5 top-3"></i>
        </div>

        <!-- Category Pills (Scrollable on mobile/tablet) -->
        <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-1">
          <button onclick="window.Views.filterArticlesCategory('all')" id="btn-cat-all" class="art-cat-btn whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition bg-indigo-600 text-white shadow-md">
            تمام مضامین (${ARTICLES_LIST.length})
          </button>
          <button onclick="window.Views.filterArticlesCategory('quran')" id="btn-cat-quran" class="art-cat-btn whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200">
            قرآنی علوم
          </button>
          <button onclick="window.Views.filterArticlesCategory('tech-ethics')" id="btn-cat-tech-ethics" class="art-cat-btn whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200">
            ٹیکنالوجی و اخلاقیات
          </button>
          <button onclick="window.Views.filterArticlesCategory('tajweed')" id="btn-cat-tajweed" class="art-cat-btn whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200">
            تجوید و قراءت
          </button>
          <button onclick="window.Views.filterArticlesCategory('seerah')" id="btn-cat-seerah" class="art-cat-btn whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200">
            سیرت و سنت
          </button>
        </div>
      </div>

      <!-- Articles Grid (1 col mobile, 2 cols tablet, 3 cols laptop) -->
      <div id="articles-grid-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        ${window.Views.renderArticleCardsHTML(ARTICLES_LIST)}
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
};

window.Views.renderArticleCardsHTML = function(articles) {
  if (articles.length === 0) {
    return `
      <div class="col-span-full lh-card p-12 text-center text-slate-400 font-urdu text-sm space-y-2">
        <i data-lucide="file-x" class="w-8 h-8 mx-auto text-slate-400 mb-2"></i>
        <p>کوئی مضمون موصول نہیں ہوا۔ براہ کرم سرچ کی ورڈ تبدیل کریں۔</p>
      </div>
    `;
  }

  return articles.map(art => `
    <div class="lh-card overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div class="relative overflow-hidden aspect-video">
          <img src="${art.image}" alt="${art.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
          <div class="absolute top-3 right-3">
            <span class="badge bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold border border-white/20">
              ${art.category}
            </span>
          </div>
        </div>

        <div class="p-6 space-y-3 text-right">
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span class="flex items-center gap-1">
              <i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${art.date}
            </span>
            <span class="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
              <i data-lucide="clock" class="w-3.5 h-3.5"></i> ${art.readTime}
            </span>
          </div>

          <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
            <a href="#/articles/${art.id}">${art.title}</a>
          </h3>

          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
            ${art.summary}
          </p>
        </div>
      </div>

      <div class="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 pt-4 flex items-center justify-between">
        <span class="text-xs font-semibold text-slate-500">${art.author}</span>
        <a href="#/articles/${art.id}" class="btn-primary py-1.5 px-4 text-xs rounded-xl font-bold flex items-center gap-1.5 shadow-sm">
          <span>مکمل مضمون پڑھیں</span>
          <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
        </a>
      </div>
    </div>
  `).join('');
};

window.Views.filterArticlesCategory = function(catId) {
  const buttons = document.querySelectorAll('.art-cat-btn');
  buttons.forEach(b => {
    b.classList.remove('bg-indigo-600', 'text-white', 'shadow-md');
    b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
  });

  const activeBtn = document.getElementById(`btn-cat-${catId}`);
  if (activeBtn) {
    activeBtn.classList.add('bg-indigo-600', 'text-white', 'shadow-md');
    activeBtn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
  }

  const filtered = catId === 'all' 
    ? ARTICLES_LIST 
    : ARTICLES_LIST.filter(a => a.categoryId === catId);

  const container = document.getElementById('articles-grid-container');
  if (container) {
    container.innerHTML = window.Views.renderArticleCardsHTML(filtered);
    if (window.lucide) window.lucide.createIcons();
  }
};

window.Views.filterArticlesBySearch = function(query) {
  const q = (query || '').toLowerCase().trim();
  const filtered = ARTICLES_LIST.filter(a => 
    a.title.toLowerCase().includes(q) || 
    a.summary.toLowerCase().includes(q) ||
    a.author.toLowerCase().includes(q) ||
    a.category.toLowerCase().includes(q)
  );

  const container = document.getElementById('articles-grid-container');
  if (container) {
    container.innerHTML = window.Views.renderArticleCardsHTML(filtered);
    if (window.lucide) window.lucide.createIcons();
  }
};

window.Views.copyArticleLink = function(articleId) {
  const url = `${window.location.origin}/#/articles/${articleId}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      window.App.showToast('مضمون کا لنک کاپی ہو گیا ہے!', 'success');
    }).catch(() => {
      window.App.showToast('لنک کاپی ہو گیا: ' + url, 'info');
    });
  } else {
    window.App.showToast('لنک: ' + url, 'info');
  }
};

// =========================================================================
// PRIVACY POLICY VIEW (پرائیویسی پالیسی و ڈیٹا سیکیورٹی)
// =========================================================================
window.Views.renderPrivacyPolicy = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 font-urdu text-right w-full" dir="rtl">
      
      <!-- Hero Header -->
      <div class="bg-gradient-to-l from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 rounded-3xl text-white shadow-2xl border border-indigo-500/30 text-center sm:text-right relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 space-y-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30">
            <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> ڈیٹا تحفظ و امانت داری (Privacy Policy)
          </span>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-white">پرائیویسی پالیسی اور ڈیٹا کے تحفظ کے اصول</h1>
          <p class="text-xs sm:text-sm text-indigo-200 leading-relaxed max-w-2xl">
            لرن ہب اکیڈمی پر آپ کی ذاتی معلومات اور امتحانی ریکارڈ کا تحفظ ہماری اولین اخلاقی اور قانونی ذمہ داری ہے۔
          </p>
          <div class="text-[11px] text-slate-400 font-mono pt-1">
            آخری بار اپ ڈیٹ کیا گیا: ۲۰ فروری ۲۰۲۶
          </div>
        </div>
      </div>

      <!-- Legal Content Sections -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
        
        <!-- Section 1 -->
        <div class="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
          <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold font-mono">۱</span>
            <span>جمع کی جانے والی معلومات (Information We Collect)</span>
          </h3>
          <p class="text-xs sm:text-sm leading-loose text-slate-600 dark:text-slate-300">
            جب آپ لرن ہب پر اکاؤنٹ بناتے ہیں، کورسز میں داخلہ لیتے ہیں یا کوئزز حل کرتے ہیں، ہم درج ذیل بنیادی معلومات جمع کرتے ہیں:
          </p>
          <ul class="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 pr-2">
            <li><strong>شناختی معلومات:</strong> نام، ای میل ایڈریس، فون/واٹس ایپ نمبر، اور پروفائل تصویر۔</li>
            <li><strong>تعلیمی و امتحانی ریکارڈ:</strong> کورسز کی پیش رفت، کوئز کے اسکورز، وقت، اور جاری کردہ اسناد۔</li>
            <li><strong>تکنیکی سیشن لاگز:</strong> لاگ اِن کا وقت، ڈیوائس و براؤزر کی تفصیلات (اکاؤنٹ سیکیورٹی اور فراڈ سے بچاؤ کے لیے)۔</li>
          </ul>
        </div>

        <!-- Section 2 -->
        <div class="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
          <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">۲</span>
            <span>معلومات کے استعمال کا مقصد (How We Use Your Data)</span>
          </h3>
          <p class="text-xs sm:text-sm leading-loose text-slate-600 dark:text-slate-300">
            آپ کے ڈیٹا کو صرف اور صرف تعلیمی تجربے کو بہتر بنانے اور نظام کے درست انتظام کے لیے استعمال کیا جاتا ہے:
          </p>
          <ul class="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 pr-2">
            <li>آن لائن کلاسز، ویڈیو اسباق اور امتحانات تک ہموار رسائی فراہم کرنا۔</li>
            <li>کیو آر کوڈ (QR Code) سے تصدیق شدہ اسناد کا اجراء اور عوامی تصدیق۔</li>
            <li>طلبہ کی تعلیمی پروگریس، اسٹریک اور لیڈر بورڈ رینکنگ کا حساب۔</li>
            <li>اکاؤنٹ ریکوری، پاس ورڈ ری سیٹ اور ٹو فیکٹر سیکیورٹی (2FA) کا انتظام۔</li>
          </ul>
        </div>

        <!-- Section 3 -->
        <div class="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
          <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-xs font-bold font-mono">۳</span>
            <span>ڈیٹا کا تحفظ اور سیکیورٹی (Data Security & Encryption)</span>
          </h3>
          <p class="text-xs sm:text-sm leading-loose text-slate-600 dark:text-slate-300">
            ہم آپ کے ڈیٹا کے تحفظ کے لیے اعلیٰ ترین سیکیورٹی معیارات (256-Bit SSL Encryption) لاگو کرتے ہیں۔ پاس ورڈز کو کبھی بھی پلین ٹیکسٹ میں ظاہر نہیں کیا جاتا۔ ہم آپ کے ڈیٹا کو کسی بھی تھرڈ پارٹی مارکیٹنگ یا اشتہاری کمپنی کو فروخت نہیں کرتے۔
          </p>
        </div>

        <!-- Section 4 -->
        <div class="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
          <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold font-mono">۴</span>
            <span>آپ کے حقوق اور اختیارات (Your Privacy Rights)</span>
          </h3>
          <p class="text-xs sm:text-sm leading-loose text-slate-600 dark:text-slate-300">
            بحیثیت طالب علم آپ کو مکمل اختیار حاصل ہے کہ آپ:
          </p>
          <ul class="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 pr-2">
            <li>اپنے پروفائل سے ذاتی معلومات، فون نمبر اور تصویر کسی بھی وقت تبدیل کریں۔</li>
            <li>فعال ڈیوائسز اور سیشنز کو دیکھ کر کسی بھی مشکوک براؤزر سے لاگ آؤٹ کریں۔</li>
            <li>اپنے اکاؤنٹ کو غیر فعال (Deactivate) یا مکمل حذف (Delete Account) کرنے کی درخواست دیں۔</li>
          </ul>
        </div>

        <!-- Section 5 -->
        <div class="space-y-3">
          <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold font-mono">۵</span>
            <span>رابطہ برائے پرائیویسی سوالات (Contact Data Privacy Officer)</span>
          </h3>
          <p class="text-xs sm:text-sm leading-loose text-slate-600 dark:text-slate-300">
            اگر پرائیویسی پالیسی یا ذاتی ڈیٹا کے حوالے سے کوئی استفسار ہو تو آپ ہماری سپورٹ ٹیم سے براہِ راست رابطہ کر سکتے ہیں:
          </p>
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs" dir="ltr">
            <div>
              <span class="text-slate-400 block text-[10px] font-sans">Official Privacy Contact:</span>
              <span class="font-bold text-indigo-600 dark:text-indigo-400">privacy@learnhub.com</span>
            </div>
            <a href="#/support" class="btn-primary py-2 px-4 rounded-xl text-xs font-bold font-urdu">
              سپورٹ ڈیسک پر رابطہ کریں &rarr;
            </a>
          </div>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// =========================================================================
// TERMS OF SERVICE VIEW (شرائط و ضوابط و تعلیمی اصول)
// =========================================================================
window.Views.renderTermsOfService = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 font-urdu text-right w-full" dir="rtl">
      
      <!-- Hero Header -->
      <div class="bg-gradient-to-l from-slate-900 via-emerald-950 to-slate-900 p-8 sm:p-10 rounded-3xl text-white shadow-2xl border border-emerald-500/30 text-center sm:text-right relative overflow-hidden">
        <div class="absolute -left-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 space-y-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-full border border-amber-400/30">
            <i data-lucide="scale" class="w-3.5 h-3.5"></i> تعلیمی معاہدہ و ضوابط (Terms of Service)
          </span>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-white">لرن ہب اکیڈمی کے شرائط و ضوابط اور تعلیمی رہنما اصول</h1>
          <p class="text-xs sm:text-sm text-emerald-200 leading-relaxed max-w-2xl">
            لرن ہب پلیٹ فارم کے استعمال، کورسز میں شمولیت، امتحانات اور اسناد کے حصول کے لازمی قواعد۔
          </p>
          <div class="text-[11px] text-slate-400 font-mono pt-1">
            آخری بار اپ ڈیٹ کیا گیا: ۲۰ فروری ۲۰۲۶
          </div>
        </div>
      </div>

      <!-- Legal Content Sections -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
        
        <!-- Section 1 -->
        <div class="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
          <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold font-mono">۱</span>
            <span>شرائط کی پابندی (Acceptance of Terms)</span>
          </h3>
          <p class="text-xs sm:text-sm leading-loose text-slate-600 dark:text-slate-300">
            لرن ہب اکیڈمی پر اکاؤنٹ بناتے وقت یا کسی بھی کورس و کوئز میں شرکت کے ذریعے آپ ان تمام شرائط و ضوابط کی پاسداری کے پابند ہوتے ہیں۔ اگر آپ ان شرائط سے متفق نہیں ہیں تو براہ کرم اس پلیٹ فارم کا استعمال نہ کریں۔
          </p>
        </div>

        <!-- Section 2 -->
        <div class="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
          <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">۲</span>
            <span>علمی دیانت داری اور امتحانات کے اصول (Academic Integrity)</span>
          </h3>
          <p class="text-xs sm:text-sm leading-loose text-slate-600 dark:text-slate-300">
            اسلامی و عصری علوم میں دیانت داری بنیادی شرط ہے۔ طلبہ پر لازم ہے کہ:
          </p>
          <ul class="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 pr-2">
            <li>آزادانہ کوئزز اور فائنل ٹیسٹ خود اپنی محنت اور بغیر کسی غیر شرعی و غیر قانونی مدد کے حل کریں۔</li>
            <li>کسی دوسرے صارف کی شناخت یا اکاؤنٹ استعمال کر کے امتحان دینا سختی سے منع ہے۔</li>
            <li>غلط ذرائع سے امتحان پاس کرنے یا سرٹیفکیٹ میں تحریف کرنے پر سند منسوخ کر دی جائے گی۔</li>
          </ul>
        </div>

        <!-- Section 3 -->
        <div class="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
          <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold font-mono">۳</span>
            <span>اسناد اور سرٹیفکیٹس کی توثیق (Certificate Validity)</span>
          </h3>
          <p class="text-xs sm:text-sm leading-loose text-slate-600 dark:text-slate-300">
            لرن ہب سے جاری کردہ تمام اسناد کے ساتھ ایک یونیک کیو آر کوڈ اور سیریل نمبر دیا جاتا ہے، جسے دنیا کے کسی بھی کونے سے ہمارے پبلک پورٹل (<code class="font-mono text-indigo-600">#/verify-cert/:id</code>) پر آن لائن تصدیق کیا جا سکتا ہے۔
          </p>
        </div>

        <!-- Section 4 -->
        <div class="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
          <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-xs font-bold font-mono">۴</span>
            <span>کاپی رائٹ اور تعلیمی مواد کی ملکیت (Intellectual Property)</span>
          </h3>
          <p class="text-xs sm:text-sm leading-loose text-slate-600 dark:text-slate-300">
            اکیڈمی پر موجود تمام ویڈیوز، آڈیو تلاوتیں، نوٹس، مضامین اور امتحانی سوالات لرن ہب اکیڈمی اور اس کے مستند اساتذہ کی ملکیت ہیں۔ مواد کو بغیر اجازت کمرشل مقاصد کے لیے ری پروڈیوس یا فروخت کرنا ممنوع ہے۔
          </p>
        </div>

        <!-- Section 5 -->
        <div class="space-y-3">
          <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold font-mono">۵</span>
            <span>اکاؤنٹ کی معطلی اور اخراج (Account Termination)</span>
          </h3>
          <p class="text-xs sm:text-sm leading-loose text-slate-600 dark:text-slate-300">
            کسی بھی قسم کی بدکلامی، ہیکنگ کی کوشش، یا پلیٹ فارم کے سیکیورٹی ضوابط کی خلاف ورزی کی صورت میں ایڈمنسٹریشن کو اختیار حاصل ہے کہ وہ بغیر پیشگی اطلاع کے متعلقہ صارف کا اکاؤنٹ معطل یا ختم کر دے۔
          </p>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};



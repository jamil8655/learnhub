/**
 * LearnHub Articles & Knowledge Base Module
 * Islamic and Tech articles with reading time, author bio, and rich reader.
 */

window.Views = window.Views || {};

const ARTICLES_LIST = [
  {
    id: 'art-1',
    title: 'قرآن مجید کو سمجھ کر پڑھنے کی اہمیت اور عملی طریقہ کار',
    slug: 'importance-of-understanding-quran',
    category: 'اسلامی تعلیمات',
    author: 'ڈاکٹر محمد عثمان',
    readTime: '6 منٹ',
    date: '18 فروری 2026',
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800',
    summary: 'قرآن مجید صرف ثواب کے لیے نہیں بلکہ زندگی کے تمام شعبوں میں رہنمائی کا سرچشمہ ہے۔ اس مضمون میں آسان فہم تجاویز پیش کی گئی ہیں۔',
    content: `
      <p class="leading-relaxed mb-4">قرآن مجید اللہ تعالیٰ کی آخری اور ہمیشہ رہنے والی کتاب ہے جو پوری انسانیت کے لیے ہدایت کا سرچشمہ ہے۔ اللہ تعالیٰ کا فرمان ہے:</p>
      <blockquote class="p-4 my-4 border-r-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 rounded-xl font-serif text-lg">
        «كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ وَلِيَتَذَكَّرَ أُولُو الْأَلْبَابِ» (ص: 29)
      </blockquote>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">روزانہ کے لیے 3 عملی طریقے:</h3>
      <ol class="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
        <li><strong>تھوڑی مقدار لیکن تسلسل</strong>: روزانہ کم از کم 5 آیات مع ترجمہ پڑھیں۔</li>
        <li><strong>قرآنی عربی کے بنیادی الفاظ</strong>: قرآن میں بار بار آنے والے الفاظ کو یاد کریں۔</li>
        <li><strong>عملی زندگی میں اطلاق</strong>: پڑھی ہوئی آیات پر غور و فکر کریں اور عمل میں لائیں۔</li>
      </ol>
    `
  },
  {
    id: 'art-2',
    title: 'جدید سافٹ ویئر انجینئرنگ اور مصنوعی ذہانت کے دور میں اسلامی اخلاقیات',
    slug: 'islamic-ethics-in-software-engineering',
    category: 'ٹیکنالوجی اور اخلاقیات',
    author: 'انجینئر طارق حمید',
    readTime: '8 منٹ',
    date: '15 فروری 2026',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    summary: 'ڈیٹا پرائیویسی، امانت داری، اور مصنوعی ذہانت کے دور میں ایک مسلم ڈویلپر کے لیے اخلاقی اصول۔',
    content: `
      <p class="leading-relaxed mb-4">ٹیکنالوجی بذاتِ خود ایک طاقتور ذریعہ ہے۔ اس کا درست اور اخلاقی استعمال انسان کے ہاتھ میں ہے۔</p>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">اہم اخلاقی ستون:</h3>
      <ul class="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
        <li><strong>صارفین کے ڈیٹا کی حفاظت (امانت داری)</strong></li>
        <li><strong>کوڈ میں ایمانداری اور دھوکہ دہی سے پرہیز</strong></li>
        <li><strong>مصنوعی ذہانت کو معاشرے کی بھلائی کے لیے استعمال کرنا</strong></li>
      </ul>
    `
  }
];

window.Views.renderArticles = async function(params) {
  const container = document.getElementById('main-content');
  const articleId = params && params.id ? params.id : null;

  if (articleId) {
    const art = ARTICLES_LIST.find(a => a.id === articleId) || ARTICLES_LIST[0];
    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <a href="#/articles" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
          &larr; تمام مضامین پر واپس جائیں
        </a>

        <div class="space-y-4">
          <span class="badge badge-primary">${art.category}</span>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight font-urdu">${art.title}</h1>
          <div class="flex items-center gap-3 text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span class="font-bold text-slate-900 dark:text-white">${art.author}</span>
            <span>•</span>
            <span>${art.date}</span>
            <span>•</span>
            <span>مطالعہ کا وقت: ${art.readTime}</span>
          </div>
        </div>

        <img src="${art.image}" class="w-full aspect-video rounded-3xl object-cover shadow-xl">

        <div class="lh-card p-6 sm:p-8 prose dark:prose-invert max-w-none font-urdu text-base sm:text-lg">
          ${art.content}
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Articles Header -->
      <div class="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl space-y-2">
        <span class="badge bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">علمی و تحقیقی مضامین</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold font-urdu">مضامین، رہنمائی اور نالج بیس</h1>
        <p class="text-xs sm:text-sm text-indigo-200 max-w-2xl">قرآن و سنت کی روشنی میں رہنمائی، جدید ٹیکنالوجی کے مضامین اور معلوماتی بلاگ۔</p>
      </div>

      <!-- Articles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        ${ARTICLES_LIST.map(art => `
          <div class="lh-card overflow-hidden flex flex-col justify-between hover:shadow-2xl transition group">
            <div>
              <img src="${art.image}" class="w-full aspect-video object-cover group-hover:scale-105 transition duration-300">
              <div class="p-6 space-y-3">
                <div class="flex items-center justify-between text-xs text-slate-500">
                  <span class="badge badge-primary text-[10px]">${art.category}</span>
                  <span>${art.readTime}</span>
                </div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition font-urdu leading-normal">
                  <a href="#/articles/${art.id}">${art.title}</a>
                </h3>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 font-urdu">${art.summary}</p>
              </div>
            </div>

            <div class="p-6 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
              <span class="text-xs font-semibold text-slate-500">${art.author}</span>
              <a href="#/articles/${art.id}" class="btn-secondary py-1.5 px-3.5 text-xs rounded-xl font-bold">
                مکمل مضمون پڑھیں &rarr;
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

/**
 * LearnHub Virtual Islamic Heritage & Historic Landmarks Tour
 * Pure White Luxury SaaS Edition
 */

window.Views = window.Views || {};

const HERITAGE_PLACES = [
  {
    id: 'kaaba',
    title: 'الْكَعْبَةُ الْمُشَرَّفَةُ (بیت اللہ الحرام)',
    city: 'مکہ مکرمہ',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=600',
    description: 'روئے زمین پر اللہ کی عبادت کے لیے بنایا جانے والا پہلا گھر جسے حضرت ابراہیم علیہ السلام اور حضرت اسماعیل علیہ السلام نے تعمیر فرمایا۔',
    hadith: 'مسجد الحرام میں ایک نماز ایک لاکھ نمازوں کے برابر ہے۔ (صحیح بخاری)'
  },
  {
    id: 'hira',
    title: 'غَارُ حِرَاء (جبل النور)',
    city: 'مکہ مکرمہ',
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=600',
    description: 'وہ مقدس غار جہاں رسول اللہ ﷺ پر جبرائیل علیہ السلام کے ذریعے قرآن مجید کی پہلی وحی نازل ہوئی۔',
    hadith: 'پہلی وحی کا نزول اور بعثتِ نبوی کا آغاز یہیں سے ہوا۔ (صحیح بخاری)'
  },
  {
    id: 'quba',
    title: 'مَسْجِدُ قُبَاء (پہلی مسجد)',
    city: 'مدینہ منورہ',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    description: 'اسلام کی تاریخ میں تعمیر کی جانے والی سب سے پہلی مسجد جس کی بنیاد رسول اللہ ﷺ نے ہجرتِ مدینہ کے دوران رکھی۔',
    hadith: 'جس نے گھر سے وضو کیا اور مسجد قبا میں آ کر دو رکعت نماز پڑھی، اسے ایک عمرہ کا ثواب ملتا ہے۔ (سنن نسائی)'
  },
  {
    id: 'uhud',
    title: 'جَبَلُ أُحُدٍ وَمَقْبَرَةُ الشُّهَدَاءِ',
    city: 'مدینہ منورہ',
    image: 'https://images.unsplash.com/photo-1584281722572-ca4948a4369e?auto=format&fit=crop&q=80&w=600',
    description: 'غزوہ احد کا تاریخی میدان اور پہاڑ جس کے دامن میں سید الشہداء حضرت حمزہ رضی اللہ عنہ اور 70 جلیل القدر صحابہ کرام مدفون ہیں۔',
    hadith: 'رسول اللہ ﷺ نے فرمایا: احد وہ پہاڑ ہے جو ہم سے محبت کرتا ہے اور ہم اس سے محبت کرتے ہیں۔ (صحیح بخاری)'
  },
  {
    id: 'alaqsa',
    title: 'الْمَسْجِدُ الْأَقْصَى وَقُبَّةُ الصَّخْرَةِ',
    city: 'القدس (یروشلم)',
    image: 'https://images.unsplash.com/photo-1548625361-16a7f052ebf3?auto=format&fit=crop&q=80&w=600',
    description: 'مسلمانوں کا قبلہ اول اور واقعہ معراج میں رسول اللہ ﷺ کا اسراء و معراج کا مقام جہاں تمام انبیاء کی امامت فرمائی۔',
    hadith: 'تین مساجد کے علاوہ عبادت کی غرض سے سفر نہ کیا جائے: مسجد حرام، مسجد نبوی، اور مسجد اقصیٰ۔ (صحیح بخاری)'
  }
];

window.Views.renderIslamicHeritage = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div class="min-h-screen bg-white dark:bg-slate-900 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="rtl">
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        <!-- Hero Header -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-sm text-center space-y-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-xs font-bold shadow-sm">
            <i data-lucide="map-pin" class="w-4 h-4 text-teal-600"></i>
            <span>تاریخی اسلامی مقامات کا ورچوئل ٹور (Islamic Heritage Tour)</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">مقدس مقامات اور تاریخی آثار</h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            مکہ مکرمہ، مدینہ منورہ اور بیت المقدس کے تاریخی مقامات کی تفصیلی تاریخ اور مستند نبوی احادیث۔
          </p>
        </div>

        <!-- Places Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${HERITAGE_PLACES.map(place => `
            <div class="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
              <div>
                <div class="relative aspect-video overflow-hidden">
                  <img src="${place.image}" alt="${place.title}" class="w-full h-full object-cover group-hover:scale-105 transition-all duration-500">
                  <span class="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 text-teal-300 backdrop-blur font-bold text-[11px] border border-teal-500/30">
                    📍 ${place.city}
                  </span>
                </div>

                <div class="p-5 space-y-3">
                  <h3 class="text-base font-black text-slate-900 dark:text-white font-arabic">${place.title}</h3>
                  <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${place.description}</p>
                  
                  <div class="p-3 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-600/30 text-xs text-teal-950 dark:text-teal-200 leading-relaxed">
                    <strong class="text-teal-700 dark:text-teal-400 block mb-0.5 font-bold">✨ فضیلت و حدیث:</strong>
                    ${place.hadith}
                  </div>
                </div>
              </div>

              <div class="p-5 pt-0">
                <a href="#/live-streams" class="w-full py-2.5 px-4 text-xs rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95">
                  <i data-lucide="video" class="w-4 h-4"></i>
                  <span>لائیو 24/7 نشریات دیکھیں</span>
                </a>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

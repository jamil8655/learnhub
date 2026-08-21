/**
 * LearnHub Virtual Islamic Heritage & Historic Map Tour Module
 * Explores Makkah, Madinah, and Jerusalem historical landmarks with authentic Hadith citations.
 */

window.Views = window.Views || {};

const HERITAGE_PLACES = [
  {
    id: 'kaaba',
    title: 'الْكَعْبَةُ الْمُشَرَّفَةُ (بيت الله الحرام)',
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
    description: 'وہ مقدس غار جہاں رسول اللہ ﷺ پر جبرائیل علیہ السلام کے ذریعے قرآن مجید کی پہلی وحی (اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ) نازل ہوئی۔',
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
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Heritage Hero Banner -->
      <div class="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-emerald-500/40 text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold shadow-sm">
          <i data-lucide="map-pin" class="w-4 h-4 text-emerald-400"></i>
          <span>تاریخی اسلامی مقامات کا ورچوئل ٹور (Islamic Heritage Tour)</span>
        </div>
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white">مقدس مقامات اور تاریخی آثار</h1>
        <p class="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          مکہ مکرمہ، مدینہ منورہ اور بیت المقدس کے تاریخی مقامات کی تفصیلی تاریخ اور مستند نبوی احادیث۔
        </p>
      </div>

      <!-- Places Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${HERITAGE_PLACES.map(place => `
          <div class="lh-card rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all shadow-xl overflow-hidden flex flex-col justify-between group">
            <div>
              <div class="relative aspect-video overflow-hidden">
                <img src="${place.image}" alt="${place.title}" class="w-full h-full object-cover group-hover:scale-105 transition-all duration-500">
                <span class="absolute top-3 right-3 badge bg-slate-950/80 text-emerald-300 backdrop-blur font-bold text-xs border border-emerald-500/30">
                  📍 ${place.city}
                </span>
              </div>

              <div class="p-6 space-y-3">
                <h3 class="text-lg font-black text-slate-900 dark:text-white font-arabic">${place.title}</h3>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">${place.description}</p>
                
                <div class="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-300 font-urdu leading-relaxed">
                  <strong class="text-emerald-700 dark:text-emerald-400 block mb-0.5">✨ فضیلت و حدیث:</strong>
                  ${place.hadith}
                </div>
              </div>
            </div>

            <div class="p-6 pt-0">
              <a href="#/live-streams" class="btn-primary w-full py-2.5 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow-md">
                <i data-lucide="video" class="w-4 h-4"></i>
                <span>لائیو 24/7 نشریات دیکھیں</span>
              </a>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

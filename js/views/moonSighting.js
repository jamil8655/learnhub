/**
 * LearnHub Moon Sighting & Hijri Moon Phase Module
 * Pure White Luxury SaaS Edition
 */

window.Views = window.Views || {};

window.Views.renderMoonSighting = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const now = new Date();
  const knownNewMoon = new Date('2026-08-12T15:00:00Z');
  const diffDays = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
  const lunarAge = (diffDays % 29.53058867);
  const illumination = Math.round((1 - Math.cos((lunarAge / 29.53) * 2 * Math.PI)) * 50);

  let phaseName = 'ہلال (Waxing Crescent)';
  let moonIcon = '🌒';
  if (lunarAge < 1.5) { phaseName = 'محاق / نیا چاند (New Moon)'; moonIcon = '🌑'; }
  else if (lunarAge < 7.4) { phaseName = 'ہلال (Waxing Crescent)'; moonIcon = '🌒'; }
  else if (lunarAge < 9.2) { phaseName = 'تربیع اول (First Quarter)'; moonIcon = '🌓'; }
  else if (lunarAge < 13.5) { phaseName = 'احدب متزاید (Waxing Gibbous)'; moonIcon = '🌔'; }
  else if (lunarAge < 16.5) { phaseName = 'بدر / چودھویں کا پورا چاند (Full Moon)'; moonIcon = '🌕'; }
  else if (lunarAge < 22.1) { phaseName = 'احدب متناقص (Waning Gibbous)'; moonIcon = '🌖'; }
  else if (lunarAge < 24.1) { phaseName = 'تربیع ثانی (Last Quarter)'; moonIcon = '🌗'; }
  else { phaseName = 'محاق اخیر (Waning Crescent)'; moonIcon = '🌘'; }

  container.innerHTML = `
    <div class="min-h-screen bg-white dark:bg-slate-900 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="rtl">
      
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        <!-- Hero Header -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-sm text-center space-y-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-xs font-bold shadow-sm">
            <span>🌙 رویتِ ہلال و فلکیاتی قمری تقویم (Moon Sighting Engine)</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">رویتِ ہلال اور چاند کے منازل</h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            آج کے دن کے چاند کی فلکیاتی پوزیشن، روشنی کا فیصد اور رویتِ ہلال کی مسنون دعائیں۔
          </p>
        </div>

        <!-- Moon Visual Card & Status -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          <!-- Moon Graphic Card -->
          <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm text-center space-y-4">
            <div class="w-32 h-32 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-7xl mx-auto shadow-inner">
              ${moonIcon}
            </div>
            
            <div class="space-y-1">
              <span class="inline-block px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-xs font-bold">
                موجودہ فیز: ${phaseName}
              </span>
              <h3 class="text-3xl font-black text-slate-900 dark:text-white font-mono pt-2">${illumination}% روشن</h3>
              <p class="text-xs text-slate-500 font-mono">قمری عمر: ${lunarAge.toFixed(1)} دن</p>
            </div>
          </div>

          <!-- Sighting Dua & Ayyam al-Beed -->
          <div class="space-y-4">
            
            <!-- Dua Card -->
            <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-3">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-600/30">
                ✨ نیا چاند دیکھنے کی نبوی مسنون دعا:
              </span>
              
              <h3 class="text-lg font-black text-slate-900 dark:text-white font-arabic leading-loose pt-1">
                اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالْإِيمَانِ، وَالسَّلَامَةِ وَالْإِسْلَامِ، رَبِّي وَرَبُّكَ اللَّهُ
              </h3>

              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>ترجمہ:</strong> "اے اللہ! اس چاند کو ہم پر برکت، ایمان، سلامتی اور اسلام کے ساتھ طلوع فرما۔ (اے چاند!) میرا اور تیرا رب اللہ ہے۔" (جامع ترمذی: 3451)
              </p>
            </div>

            <!-- Ayyam al-Beed Card -->
            <div class="p-5 rounded-3xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-600/30 shadow-sm space-y-2">
              <h4 class="font-bold text-xs text-teal-900 dark:text-teal-200 flex items-center gap-2">
                <i data-lucide="calendar" class="w-4 h-4 text-teal-600"></i>
                <span>ایامِ بیض کے مسنون روزے (13، 14، 15 تاریخ):</span>
              </h4>
              <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                رسول اللہ ﷺ نے فرمایا: "ہر قمری مہینے میں تین دن (13، 14، 15 تاریخ) کے روزے رکھنا پورے سال کے روزوں کے برابر ہے۔" (صحیح بخاری)
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

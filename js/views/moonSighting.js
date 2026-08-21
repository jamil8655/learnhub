/**
 * LearnHub Moon Sighting & Hijri Moon Phase Module
 * Displays real-time astronomical moon illumination percentage,
 * new moon sighting dua, and Ayyam al-Beed fasting reminders.
 */

window.Views = window.Views || {};

window.Views.renderMoonSighting = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  // Approximate lunar age calculation (synodic month = 29.53 days)
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
    <div class="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Moon Phase Hero Banner -->
      <div class="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-indigo-400/40 text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 text-xs font-bold shadow-sm">
          <span>🌙 رویتِ ہلال و فلکیاتی قمری تقویم (Moon Sighting Engine)</span>
        </div>
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white">رویتِ ہلال اور چاند کے منازل</h1>
        <p class="text-xs sm:text-sm text-indigo-100/90 max-w-2xl mx-auto leading-relaxed">
          آج کے دن کے چاند کی فلکیاتی پوزیشن، روشنی کا فیصد، اور رویتِ ہلال کی مسنون دعائیں۔
        </p>
      </div>

      <!-- Moon Visual Card & Status -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        <!-- 3D Moon Graphic Card -->
        <div class="lh-card p-8 sm:p-12 rounded-3xl bg-slate-950 border-2 border-indigo-500/40 shadow-2xl text-center space-y-4">
          <div class="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-indigo-900/60 to-slate-900 flex items-center justify-center text-7xl sm:text-8xl mx-auto shadow-2xl shadow-indigo-500/20 border-2 border-indigo-400/30 animate-pulse">
            ${moonIcon}
          </div>
          
          <div class="space-y-1">
            <span class="badge bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold font-urdu">
              موجودہ فیز: ${phaseName}
            </span>
            <h3 class="text-3xl font-black text-white font-mono">${illumination}% روشن</h3>
            <p class="text-xs text-slate-400 font-mono">قمری عمر: ${lunarAge.toFixed(1)} دن</p>
          </div>
        </div>

        <!-- Sighting Dua & Ayyam al-Beed Virtues -->
        <div class="space-y-6">
          
          <!-- Dua on Sighting Moon -->
          <div class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-400/40 shadow-xl space-y-3">
            <span class="badge bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full">
              ✨ نیا چاند دیکھنے کی نبوی مسنون دعا:
            </span>
            
            <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-arabic leading-loose">
              اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالْإِيمَانِ، وَالسَّلَامَةِ وَالْإِسْلَامِ، رَبِّي وَرَبُّكَ اللَّهُ
            </h3>

            <p class="text-xs text-slate-600 dark:text-slate-300 font-urdu leading-relaxed">
              <strong>ترجمہ:</strong> "اے اللہ! اس چاند کو ہم پر برکت، ایمان، سلامتی اور اسلام کے ساتھ طلوع فرما۔ (اے چاند!) میرا اور تیرا رب اللہ ہے۔" (جامع ترمذی: 3451)
            </p>
          </div>

          <!-- Ayyam al-Beed Fasting Card -->
          <div class="lh-card p-6 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 shadow-md space-y-2">
            <h4 class="font-extrabold text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <i data-lucide="calendar" class="w-4 h-4 text-emerald-600"></i>
              <span>ایامِ بیض کے مسنون روزے (13، 14، 15 تاریخ):</span>
            </h4>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-urdu">
              رسول اللہ ﷺ نے فرمایا: "ہر قمری مہینے میں تین دن (13، 14، 15 تاریخ) کے روزے رکھنا پورے سال کے روزوں کے برابر ہے۔" (صحیح بخاری)
            </p>
          </div>

        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

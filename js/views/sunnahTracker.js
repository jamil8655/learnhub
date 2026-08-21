/**
 * LearnHub Daily Sunnah & Salah Habit Tracker Module
 * Interactive daily Islamic habit checklist, 5 daily prayers in congregation log,
 * Sunnah tracker, and live Daily Iman Score gauge.
 */

window.Views = window.Views || {};

window.Views.renderSunnahTracker = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const todayKey = new Date().toISOString().split('T')[0];
  const storageKey = `learnhub_sunnah_tracker_${todayKey}`;
  const trackedData = JSON.parse(localStorage.getItem(storageKey) || '{}');

  const salahList = [
    { id: 'fajr', name: 'نمازِ فجر', rakats: '2 سنت + 2 فرض', time: 'صبح صادق', icon: 'sunrise' },
    { id: 'dhuhr', name: 'نمازِ ظہر', rakats: '4 سنت + 4 فرض + 2 سنت', time: 'دوپہر', icon: 'sun' },
    { id: 'asr', name: 'نمازِ عصر', rakats: '4 فرض', time: 'سہ پہر', icon: 'cloud-sun' },
    { id: 'maghrib', name: 'نمازِ مغرب', rakats: '3 فرض + 2 سنت', time: 'غروبِ آفتاب', icon: 'sunset' },
    { id: 'isha', name: 'نمازِ عشاء', rakats: '4 فرض + 2 سنت + 3 وتر', time: 'رات', icon: 'moon' }
  ];

  const sunnahList = [
    { id: 'tahajjud', name: 'نمازِ تہجد و قیام اللیل', pts: 20, icon: 'sparkles' },
    { id: 'miswak', name: 'ہر وضو کے ساتھ مسواک کا اہتمام', pts: 10, icon: 'smile' },
    { id: 'ayat_kursi', name: 'ہر فرض نماز کے بعد آیۃ الکرسی', pts: 15, icon: 'shield' },
    { id: 'morning_dhikr', name: 'صبح کے مسنون اذکار کی پابندی', pts: 15, icon: 'sun' },
    { id: 'evening_dhikr', name: 'شام کے مسنون اذکار کی پابندی', pts: 15, icon: 'moon' },
    { id: 'surah_mulk', name: 'رات کو سونے سے قبل سورۃ الملک', pts: 20, icon: 'book' },
    { id: 'sadaqah', name: 'روزانہ کچھ نہ کچھ صدقہ و خیرات', pts: 15, icon: 'heart-handshake' },
    { id: 'quran_tilawat', name: 'کم از کم ایک رکوع / پارہ تلاوت', pts: 20, icon: 'book-open' }
  ];

  // Calculate Daily Iman Score
  let totalSalahPoints = 0;
  salahList.forEach(s => {
    if (trackedData[s.id]) totalSalahPoints += 20;
    if (trackedData[`${s.id}_jamaah`]) totalSalahPoints += 10;
  });

  let totalSunnahPoints = 0;
  sunnahList.forEach(sn => {
    if (trackedData[sn.id]) totalSunnahPoints += sn.pts;
  });

  const maxPoints = 280;
  const currentTotal = totalSalahPoints + totalSunnahPoints;
  const scorePercent = Math.min(100, Math.round((currentTotal / maxPoints) * 100));

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Sunnah Tracker Hero Banner -->
      <div class="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-emerald-500/40 text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold shadow-sm">
          <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i>
          <span>روزانہ کا اسلامی معمول (Daily Sunnah & Salah Tracker)</span>
        </div>
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white">روزانہ کی سنتوں اور نمازوں کا ٹریکر</h1>
        <p class="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          اپنے روزمرہ کے فرائض اور مسنون اعمال کو نوٹ کریں اور اپنا ڈیلی ایمانی اسکور بہتر بنائیں۔
        </p>

        <!-- Daily Score Ribbon -->
        <div class="max-w-md mx-auto bg-black/40 backdrop-blur p-4 rounded-3xl border border-emerald-500/30 space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-emerald-300">
            <span>آج کا ایمانی اسکور (Faith Meter)</span>
            <span class="font-mono text-base font-black text-amber-400">${scorePercent}%</span>
          </div>
          <div class="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div class="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500" style="width: ${scorePercent}%;"></div>
          </div>
        </div>
      </div>

      <!-- 5 Daily Prayers Matrix -->
      <div class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="sun" class="w-5 h-5 text-amber-500"></i>
            <span>پانچ وقت کی فرض نمازیں (Five Daily Prayers)</span>
          </h3>
          <span class="text-xs font-bold text-slate-400">تاریخ: ${new Date().toLocaleDateString('ur-PK')}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          ${salahList.map(s => {
            const isOffered = !!trackedData[s.id];
            const isJamaah = !!trackedData[`${s.id}_jamaah`];

            return `
              <div class="p-4 rounded-2xl border-2 transition-all space-y-3 flex flex-col justify-between ${isOffered ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500 shadow-md' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'}">
                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-base font-black text-slate-900 dark:text-white">${s.name}</span>
                    <i data-lucide="${s.icon}" class="w-4 h-4 ${isOffered ? 'text-emerald-600' : 'text-slate-400'}"></i>
                  </div>
                  <div class="text-[10px] text-slate-500 font-semibold">${s.rakats}</div>
                </div>

                <div class="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <button 
                    onclick="window.Views.toggleHabitItem('${s.id}')"
                    class="w-full py-2 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${isOffered ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600'}"
                  >
                    <i data-lucide="${isOffered ? 'check-circle' : 'circle'}" class="w-3.5 h-3.5"></i>
                    <span>${isOffered ? 'ادا کی ✓' : 'ادا نہیں کی'}</span>
                  </button>

                  <button 
                    onclick="window.Views.toggleHabitItem('${s.id}_jamaah')"
                    class="w-full py-1.5 px-2 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 ${isJamaah ? 'bg-amber-500 text-slate-950 font-black' : 'bg-transparent text-slate-400 hover:text-slate-600'}"
                  >
                    <span>🕌 باجماعت +10</span>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Sunan & Daily Virtues Checklist -->
      <div class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="sparkles" class="w-5 h-5 text-emerald-500"></i>
            <span>مسنون اعمال و اذکار (Sunnah & Daily Remembrance)</span>
          </h3>
          <span class="text-xs font-bold text-emerald-600 font-mono">+130 پوائنٹس</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          ${sunnahList.map(sn => {
            const isDone = !!trackedData[sn.id];
            return `
              <button 
                onclick="window.Views.toggleHabitItem('${sn.id}')"
                class="p-4 rounded-2xl border-2 text-right transition-all flex items-start gap-3 ${isDone ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500 shadow-md' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-emerald-400'}"
              >
                <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}">
                  <i data-lucide="${isDone ? 'check' : sn.icon}" class="w-4 h-4"></i>
                </div>

                <div class="flex-1 min-w-0 space-y-0.5">
                  <h4 class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-snug">${sn.name}</h4>
                  <span class="badge ${isDone ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'} text-[10px] font-mono font-bold">+${sn.pts} XP</span>
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.toggleHabitItem = function(habitKey) {
  const todayKey = new Date().toISOString().split('T')[0];
  const storageKey = `learnhub_sunnah_tracker_${todayKey}`;
  const trackedData = JSON.parse(localStorage.getItem(storageKey) || '{}');

  trackedData[habitKey] = !trackedData[habitKey];
  localStorage.setItem(storageKey, JSON.stringify(trackedData));

  if (typeof window.SoundEngine?.playSuccess === 'function' && trackedData[habitKey]) {
    window.SoundEngine.playSuccess();
  }

  window.Views.renderSunnahTracker();
};

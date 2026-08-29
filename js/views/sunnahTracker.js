/**
 * LearnHub Daily Sunnah & Daily Deeds Tracker
 * Pure White Luxury SaaS Edition
 */

window.Views = window.Views || {};

window.Views.renderSunnahTracker = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const today = new Date().toISOString().split('T')[0];
  const savedDeeds = JSON.parse(localStorage.getItem('learnhub_sunnah_' + today) || '{}');

  const SUNNAH_LIST = [
    { id: 'fajr_sunnah', title: 'فجر کی 2 سنتیں', reward: 'دنیا اور جو کچھ اس میں ہے اس سے بہتر' },
    { id: 'tahajjud', title: 'نمازِ تہجد و قیام اللیل', reward: 'اللہ کا قرب اور گناہوں کی معافی' },
    { id: 'morning_azkar', title: 'صبح کے مسنون اذکار', reward: 'دن بھر کے شرور اور آفات سے حفاظت' },
    { id: 'dhuha', title: 'نمازِ چاشت (صلاۃ الضحیٰ)', reward: 'جسم کے 360 جوڑوں کا صدقہ' },
    { id: 'quran_recitation', title: 'روزانہ قرآنی تلاوت (کم از کم 1 پاؤ)', reward: 'ہر حرف پر 10 نیکیاں' },
    { id: 'rawatib', title: 'سننِ رواتب (12 سنتِ مؤکدہ)', reward: 'جنت میں ایک محل کی ضمانت' },
    { id: 'evening_azkar', title: 'شام کے مسنون اذکار', reward: 'رات بھر شیطانی وسوسوں سے امان' },
    { id: 'ayyam_beed', title: 'مسنون روزہ (پیر/جمعرات/ایامِ بیض)', reward: 'ہر روزہ جہنم سے 70 سال دور کرتا ہے' },
    { id: 'istighfar_100', title: '100 مرتبہ استغفار اور توبہ', reward: 'غموں سے نجات اور رزق میں وسعت' },
    { id: 'durood_sharif', title: 'درود شریف کی کثرت (کم از کم 100 بار)', reward: '10 رحمتیں اور 10 درجات کی بلندی' }
  ];

  const completedCount = SUNNAH_LIST.filter(s => savedDeeds[s.id]).length;
  const progressPercent = Math.round((completedCount / SUNNAH_LIST.length) * 100);

  container.innerHTML = `
    <div class="min-h-screen bg-white dark:bg-slate-900 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="rtl">
      
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        <!-- Hero Header -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-sm text-center space-y-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-xs font-bold shadow-sm">
            <i data-lucide="sparkles" class="w-4 h-4 text-teal-600"></i>
            <span>روزمرہ مسنون اعمال و سنتیں (Daily Sunnah Tracker)</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">یومیہ مسنون اعمال کا محاسبہ</h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            اپنے یومیہ معمولات، سننِ مؤکدہ اور مسنون اذکار کو روزانہ چیک کریں اور اپنی نیکیوں کا گراف بلند رکھیں۔
          </p>

          <!-- Progress Bar -->
          <div class="max-w-md mx-auto pt-2 space-y-1.5">
            <div class="flex items-center justify-between text-xs font-bold">
              <span class="text-slate-500">آج کی پیش رفت:</span>
              <span class="text-teal-700 dark:text-teal-400 font-mono">${completedCount} / ${SUNNAH_LIST.length} (${progressPercent}%)</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div class="bg-teal-600 h-full rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
            </div>
          </div>
        </div>

        <!-- Sunnah Checklist -->
        <div class="space-y-3">
          ${SUNNAH_LIST.map((item, idx) => {
            const isDone = !!savedDeeds[item.id];

            return `
              <div 
                onclick="window.Views.toggleSunnahItem('${item.id}')"
                class="p-4 rounded-2xl border ${isDone ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-600/50 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-slate-300'} flex items-center justify-between gap-4 cursor-pointer transition active:scale-[0.99]"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-7 h-7 rounded-lg ${isDone ? 'bg-teal-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-transparent border border-slate-300 dark:border-slate-600'} flex items-center justify-center font-bold text-xs shrink-0 transition">
                    ✓
                  </div>
                  <div class="min-w-0">
                    <h4 class="font-bold text-xs sm:text-sm ${isDone ? 'text-teal-950 dark:text-teal-200 line-through opacity-80' : 'text-slate-900 dark:text-white'} truncate">${item.title}</h4>
                    <span class="text-[11px] text-slate-500 truncate block">${item.reward}</span>
                  </div>
                </div>

                <span class="text-[10px] font-bold ${isDone ? 'text-teal-700 dark:text-teal-300' : 'text-slate-400'} shrink-0">
                  ${isDone ? 'مکمل ✓' : 'باقی ⏳'}
                </span>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.toggleSunnahItem = function(id) {
  const today = new Date().toISOString().split('T')[0];
  const savedDeeds = JSON.parse(localStorage.getItem('learnhub_sunnah_' + today) || '{}');

  if (savedDeeds[id]) {
    delete savedDeeds[id];
  } else {
    savedDeeds[id] = true;
    if (typeof window.SoundEngine?.playSuccess === 'function') {
      window.SoundEngine.playSuccess();
    }
  }

  localStorage.setItem('learnhub_sunnah_' + today, JSON.stringify(savedDeeds));
  window.Views.renderSunnahTracker();
};

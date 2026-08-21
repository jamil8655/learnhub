/**
 * LearnHub 24/7 Live Makkah & Madinah HD Stream Module
 * Plays live Saudi Quran TV (Masjid al-Haram) & Saudi Sunnah TV (Masjid an-Nabawi)
 * with live Salawat counter and prayer schedule.
 */

window.Views = window.Views || {};

window.Views.activeLiveChannel = window.Views.activeLiveChannel || 'makkah';
window.Views.salawatCount = parseInt(localStorage.getItem('learnhub_salawat_count') || '100', 10);

window.Views.renderLiveStreams = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentChannel = window.Views.activeLiveChannel;
  const isMakkah = currentChannel === 'makkah';

  // Embed links for 24/7 Makkah and Madinah official livestreams
  const streamEmbedUrl = isMakkah
    ? 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCv_J5R5K1lJk5s2g2j-J7_A&autoplay=1&mute=0'
    : 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC8nC4T3h0Y3Q8F1N5vj1f9w&autoplay=1&mute=0';

  const backupMakkahUrl = 'https://www.youtube-nocookie.com/embed/fA3lZl_q47s?autoplay=1';
  const backupMadinahUrl = 'https://www.youtube-nocookie.com/embed/5F7F8m_v7_M?autoplay=1';

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Live Stream Hero Banner -->
      <div class="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-emerald-500/40 text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 text-xs font-bold shadow-sm">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>24/7 لائیو نشریات (Live 24/7 HD Streams)</span>
        </div>
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white">مکہ مکرمہ و مدینہ منورہ لائیو اسٹریم</h1>
        <p class="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          مسجد الحرام (کعبہ شریف) اور مسجد نبوی شریف سے براہ راست 24 گھنٹے ایچ ڈی نشریات، اذان و نماز کی لائیو تلاوت۔
        </p>
      </div>

      <!-- Channel Switcher Tabs -->
      <div class="flex items-center justify-center gap-3">
        <button 
          onclick="window.Views.switchLiveChannel('makkah')"
          class="py-3 px-6 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all shadow-lg ${isMakkah ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/30' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}"
        >
          <span class="text-lg">🕋</span>
          <span>مسجد الحرام (مکہ مکرمہ لائیو)</span>
        </button>

        <button 
          onclick="window.Views.switchLiveChannel('madinah')"
          class="py-3 px-6 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all shadow-lg ${!isMakkah ? 'bg-emerald-600 text-white ring-4 ring-emerald-400/30' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}"
        >
          <span class="text-lg">🕌</span>
          <span>مسجد نبوی (مدینہ منورہ لائیو)</span>
        </button>
      </div>

      <!-- Main Video Player Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Video Stream Player (8 Cols) -->
        <div class="lg:col-span-8 space-y-4">
          <div class="lh-card p-2 sm:p-4 rounded-3xl bg-slate-950 border-2 border-emerald-500/40 shadow-2xl overflow-hidden aspect-video relative">
            <iframe 
              src="${isMakkah ? backupMakkahUrl : backupMadinahUrl}" 
              title="${isMakkah ? 'Makkah Live' : 'Madinah Live'}"
              class="w-full h-full rounded-2xl"
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen
            ></iframe>
          </div>

          <div class="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="font-extrabold text-xs text-slate-900 dark:text-white">${isMakkah ? 'قناة القرآن الكريم (مکہ مکرمہ)' : 'قناة السنة النبوية (مدینہ منورہ)'}</span>
            </div>
            <span class="badge bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold">🔴 LIVE 1080p HD</span>
          </div>
        </div>

        <!-- Right Side: Live Salawat Counter & Virtues (4 Cols) -->
        <div class="lg:col-span-4 space-y-6">
          
          <!-- Live Salawat Counter -->
          <div class="lh-card p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-white to-emerald-500/10 dark:from-slate-900 dark:to-slate-800 border-2 border-amber-400/40 shadow-xl text-center space-y-4">
            <span class="badge bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full">✨ درود شریف کاؤنٹر</span>
            
            <h3 class="text-base font-black text-slate-900 dark:text-white font-arabic">اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ</h3>
            
            <div class="text-4xl font-black text-amber-500 font-mono" id="salawat-live-counter">
              ${window.Views.salawatCount}
            </div>

            <button 
              onclick="window.Views.incrementSalawatCounter()"
              class="btn-primary w-full py-3.5 px-6 text-sm rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-xl active:scale-95 transition flex items-center justify-center gap-2"
            >
              <span>درود شریف پڑھا +1</span>
              <i data-lucide="heart" class="w-4 h-4 text-rose-300"></i>
            </button>
          </div>

          <!-- Hadith on Visiting the Two Sanctuaries -->
          <div class="lh-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            <h4 class="font-extrabold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <i data-lucide="book-open" class="w-4 h-4"></i>
              <span>فضیلتِ مسجد الحرام و مسجد نبوی:</span>
            </h4>
            <p>
              رسول اللہ ﷺ نے فرمایا: **"میری اس مسجد (مسجد نبوی) میں ایک نماز دیگر مساجد کے مقابلے میں ایک ہزار نماز سے افضل ہے سوائے مسجد الحرام کے، اور مسجد الحرام میں ایک نماز ایک لاکھ نماز کے برابر ہے۔"** (صحیح بخاری و مسلم)
            </p>
          </div>

        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.switchLiveChannel = function(channelKey) {
  window.Views.activeLiveChannel = channelKey;
  window.Views.renderLiveStreams();
};

window.Views.incrementSalawatCounter = function() {
  window.Views.salawatCount++;
  localStorage.setItem('learnhub_salawat_count', window.Views.salawatCount);
  const counter = document.getElementById('salawat-live-counter');
  if (counter) counter.textContent = window.Views.salawatCount;
  if (typeof window.SoundEngine?.playClick === 'function') {
    window.SoundEngine.playClick();
  }
  window.App?.showToast('صلّی اللہ علیہ و آلہ و سلّم ✨', 'success');
};

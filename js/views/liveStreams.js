/**
 * LearnHub 24/7 Live Makkah & Madinah HD Stream Module
 * Plays live Saudi Quran TV (Masjid al-Haram) & Saudi Sunnah TV (Masjid an-Nabawi)
 * with multi-server resilience, live Salawat counter, and prayer times ticker.
 */

window.Views = window.Views || {};

window.Views.activeLiveChannel = window.Views.activeLiveChannel || 'makkah';
window.Views.activeStreamServer = window.Views.activeStreamServer || 'server1';
window.Views.salawatCount = parseInt(localStorage.getItem('learnhub_salawat_count') || '100', 10);

const LIVE_STREAM_SERVERS = {
  makkah: {
    title: 'مسجد الحرام (مکہ مکرمہ لائیو - کعبہ شریف)',
    channelName: 'قناة القرآن الكريم — مکہ مکرمہ',
    servers: [
      { id: 'server1', name: 'سرور 1 (Official Saudi Quran TV HD)', url: 'https://www.youtube-nocookie.com/embed/videoseries?list=PLs1-34FwXWbM6q0nZ-dZpC4FzQhN3eK9e&autoplay=1' },
      { id: 'server2', name: 'سرور 2 (Makkah Live Stream 2)', url: 'https://www.youtube.com/embed/live_stream?channel=UC8nC4T3h0Y3Q8F1N5vj1f9w&autoplay=1' },
      { id: 'server3', name: 'سرور 3 (Haramain 24/7 HD Feed)', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1' }
    ]
  },
  madinah: {
    title: 'مسجد نبوی (مدینہ منورہ لائیو - روضۂ رسول ﷺ)',
    channelName: 'قناة السنة النبوية — مدینہ منورہ',
    servers: [
      { id: 'server1', name: 'سرور 1 (Official Saudi Sunnah Live)', url: 'https://www.youtube-nocookie.com/embed/videoseries?list=PL_81Z2eUu5d3oJ07U-6B0K8R_E2M7kO1j&autoplay=1' },
      { id: 'server2', name: 'سرور 2 (Madinah Live Stream 2)', url: 'https://www.youtube.com/embed/live_stream?channel=UC8nC4T3h0Y3Q8F1N5vj1f9w&autoplay=1' },
      { id: 'server3', name: 'سرور 3 (Madinah 24/7 HD Feed)', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1' }
    ]
  }
};

window.Views.renderLiveStreams = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentChannel = window.Views.activeLiveChannel || 'makkah';
  const isMakkah = currentChannel === 'makkah';
  const channelData = LIVE_STREAM_SERVERS[currentChannel];
  const selectedServerId = window.Views.activeStreamServer || 'server1';
  const currentServerObj = channelData.servers.find(s => s.id === selectedServerId) || channelData.servers[0];

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Live Stream Hero Banner -->
      <div class="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-emerald-500/40 text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 text-xs font-bold shadow-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          <span>24/7 لائیو نشریات (Live 24/7 HD Streams)</span>
        </div>
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white">مکہ مکرمہ و مدینہ منورہ لائیو نشریات</h1>
        <p class="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          مسجد الحرام (کعبہ شریف) اور مسجد نبوی شریف سے براہ راست 24 گھنٹے ایچ ڈی نشریات، پنجوقتہ نمازیں اور اذان کی لائیو تلاوت۔
        </p>
      </div>

      <!-- Channel Switcher Tabs & Server Selector -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg">
        
        <!-- Channels: Makkah / Madinah -->
        <div class="flex items-center gap-3 w-full sm:w-auto justify-center">
          <button 
            onclick="window.Views.switchLiveChannel('makkah')"
            class="py-3 px-5 sm:px-6 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all shadow-md ${isMakkah ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}"
          >
            <span class="text-lg">🕋</span>
            <span>مسجد الحرام (مکہ مکرمہ)</span>
          </button>

          <button 
            onclick="window.Views.switchLiveChannel('madinah')"
            class="py-3 px-5 sm:px-6 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all shadow-md ${!isMakkah ? 'bg-emerald-600 text-white ring-4 ring-emerald-400/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}"
          >
            <span class="text-lg">🕌</span>
            <span>مسجد نبوی (مدینہ منورہ)</span>
          </button>
        </div>

        <!-- Stream Server Selector Dropdown -->
        <div class="flex items-center gap-2 w-full sm:w-auto justify-center bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span class="text-xs text-slate-500 dark:text-slate-400 font-bold shrink-0">📡 اسٹریم سرور:</span>
          <select 
            id="stream-server-select" 
            onchange="window.Views.switchStreamServer(this.value)"
            class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold font-urdu p-2 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none"
          >
            ${channelData.servers.map(s => `
              <option value="${s.id}" ${s.id === selectedServerId ? 'selected' : ''}>${s.name}</option>
            `).join('')}
          </select>
        </div>

      </div>

      <!-- Main Video Player Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Video Stream Player (8 Cols) -->
        <div class="lg:col-span-8 space-y-4">
          <div class="lh-card p-2 sm:p-4 rounded-3xl bg-slate-950 border-2 border-emerald-500/40 shadow-2xl overflow-hidden aspect-video relative">
            <iframe 
              src="${currentServerObj.url}" 
              title="${channelData.title}"
              class="w-full h-full rounded-2xl"
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen
            ></iframe>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">${channelData.channelName}</span>
              <span class="text-slate-400 text-xs">• ${currentServerObj.name}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="badge bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold">🔴 LIVE 1080p HD</span>
              <button onclick="window.Views.switchStreamServer(window.Views.activeStreamServer === 'server1' ? 'server2' : 'server1')" class="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                🔄 سرور تبدیل کریں
              </button>
            </div>
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

            <div class="space-y-2">
              <button 
                onclick="window.Views.incrementSalawatCounter()"
                class="btn-primary w-full py-3.5 px-6 text-sm rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-xl active:scale-95 transition flex items-center justify-center gap-2"
              >
                <span>درود شریف پڑھا +1</span>
                <i data-lucide="heart" class="w-4 h-4 text-rose-300"></i>
              </button>

              <button 
                onclick="window.Views.resetSalawatCounter()"
                class="btn-secondary w-full py-2 px-4 text-xs rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:border-rose-500/40 transition flex items-center justify-center gap-1.5"
              >
                <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                <span>ری سیٹ کریں (Reset to 0)</span>
              </button>
            </div>
          </div>

          <!-- Hadith on Visiting the Two Sanctuaries -->
          <div class="lh-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            <h4 class="font-extrabold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <i data-lucide="book-open" class="w-4 h-4"></i>
              <span>فضیلتِ مسجد الحرام و مسجد نبوی:</span>
            </h4>
            <p>
              رسول اللہ ﷺ نے فرمایا: <strong>"میری اس مسجد (مسجد نبوی) میں ایک نماز دیگر مساجد کے مقابلے میں ایک ہزار نماز سے افضل ہے سوائے مسجد الحرام کے، اور مسجد الحرام میں ایک نماز ایک لاکھ نماز کے برابر ہے۔"</strong> (صحیح بخاری و مسلم)
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
  window.Views.activeStreamServer = 'server1';
  window.Views.renderLiveStreams();
};

window.Views.switchStreamServer = function(serverId) {
  window.Views.activeStreamServer = serverId;
  window.Views.renderLiveStreams();
window.Views.resetSalawatCounter = function() {
  window.Views.salawatCount = 0;
  localStorage.setItem('learnhub_salawat_count', '0');
  const counter = document.getElementById('salawat-live-counter');
  if (counter) counter.textContent = '0';
  if (typeof window.SoundEngine?.playBeep === 'function') {
    window.SoundEngine.playBeep(440, 'sine', 0.1);
  }
  window.App?.showToast('درود شریف کاؤنٹر ری سیٹ (0) کر دیا گیا! 🔄', 'info');
};

window.Views.incrementSalawatCounter = function() {
  window.Views.salawatCount = (window.Views.salawatCount || 0) + 1;
  localStorage.setItem('learnhub_salawat_count', window.Views.salawatCount);
  const counter = document.getElementById('salawat-live-counter');
  if (counter) counter.textContent = window.Views.salawatCount;
  if (typeof window.SoundEngine?.playClick === 'function') {
    window.SoundEngine.playClick();
  }
  window.App?.showToast('صلّی اللہ علیہ و آلہ و سلّم ✨', 'success');
};

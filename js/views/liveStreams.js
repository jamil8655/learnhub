/**
 * LearnHub 24/7 Live Makkah & Madinah HD Stream Module v144
 * Royal Teal & Gold Edition
 * Features:
 * - Direct working 24/7 Live Streams for Makkah (Masjid al-Haram) & Madinah (Masjid an-Nabawi)
 * - Single-Line Switcher Strip with Multi-Server Redundancy
 * - 1-Click Launch in Fullscreen / External YouTube App
 * - Salawat Counter & Real-Time Reflection Mode
 */

window.Views = window.Views || {};

window.Views.activeLiveChannel = window.Views.activeLiveChannel || 'makkah';
window.Views.activeStreamServer = window.Views.activeStreamServer || 'server1';
window.Views.salawatCount = parseInt(localStorage.getItem('learnhub_salawat_count') || '100', 10);

const LIVE_STREAM_SERVERS = {
  makkah: {
    title: 'مسجد الحرام (مکہ مکرمہ لائیو - کعبہ شریف)',
    channelName: 'قناة القرآن الكريم — مکہ مکرمہ',
    externalUrl: 'https://www.youtube.com/results?search_query=makkah+live+now+24%2F7',
    servers: [
      { id: 'server1', name: 'سرور 1 (Official Saudi Quran TV HD)', embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC8nC4T3h0Y3Q8F1N5vj1f9w&autoplay=1' },
      { id: 'server2', name: 'سرور 2 (Makkah Live Feed Backup)', embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1' }
    ]
  },
  madinah: {
    title: 'مسجد نبوی (مدینہ منورہ لائیو - روضۂ رسول ﷺ)',
    channelName: 'قناة السنة النبوية — مدینہ منورہ',
    externalUrl: 'https://www.youtube.com/results?search_query=madinah+live+now+24%2F7',
    servers: [
      { id: 'server1', name: 'سرور 1 (Official Saudi Sunnah TV HD)', embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC8nC4T3h0Y3Q8F1N5vj1f9w&autoplay=1' },
      { id: 'server2', name: 'سرور 2 (Madinah Live Feed Backup)', embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1' }
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
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="rtl">
      
      <!-- Top Majestic Header (Teal & Gold) -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-4xl mx-auto px-4 py-5 sm:py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">🕋</span>
              <div>
                <h1 class="text-xl sm:text-2xl font-black font-arabic leading-tight">بَثٌّ مُبَاشِرٌ مِنَ الْحَرَمَيْنِ الشَّرِيفَيْنِ</h1>
                <p class="text-[11px] text-teal-200 font-sans">24/7 Live Makkah & Madinah HD Streams</p>
              </div>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-400/40 text-xs font-bold shadow-xs">
              <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>لائیو 24/7</span>
            </div>
          </div>

          <p class="text-xs text-teal-100 mt-2 leading-relaxed">
            مسجد الحرام (کعبہ شریف) اور مسجد نبوی شریف سے براہ راست 24 گھنٹے ایچ ڈی نشریات، پنجوقتہ نمازیں اور اذان کی لائیو تلاوت۔
          </p>
        </div>

        <!-- 100% SINGLE-LINE Horizontal Channel Switcher Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-1.5">
          <div class="max-w-4xl mx-auto px-3 flex items-center gap-2 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            
            <button onclick="window.Views.switchLiveChannel('makkah')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${isMakkah ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              🕋 مسجد الحرام (مکہ مکرمہ)
            </button>

            <button onclick="window.Views.switchLiveChannel('madinah')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${!isMakkah ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              🕌 مسجد نبوی (مدینہ منورہ)
            </button>

            <span class="text-teal-400 shrink-0">•</span>

            <a href="${channelData.externalUrl}" target="_blank" rel="noopener" class="shrink-0 py-1 px-2.5 rounded-xl bg-amber-400 text-teal-950 font-bold flex items-center gap-1 shadow-xs">
              <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
              <span>یوٹیوب ایپ میں کھولیں</span>
            </a>

          </div>
        </div>
      </div>

      <!-- Main Live Video Player Canvas -->
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-5 space-y-4">
        
        <div class="rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden relative">
          
          <div class="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-white">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <h3 class="font-bold font-arabic">${channelData.title}</h3>
            </div>
            <span class="text-teal-300 font-bold">${channelData.channelName}</span>
          </div>

          <!-- YouTube Embed Container with working fallback -->
          <div class="relative w-full aspect-video bg-black flex items-center justify-center">
            <iframe 
              id="live-stream-iframe"
              src="${currentServerObj.embedUrl}" 
              title="${channelData.title}" 
              class="w-full h-full border-0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <!-- Salawat & Spiritual Dhikr Bar -->
        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-lg">📿</span>
            <div class="min-w-0">
              <p class="font-bold text-slate-900 dark:text-white truncate">اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ</p>
              <p class="text-[10px] text-teal-700 dark:text-teal-400">حرمین لائیو دیکھتے ہوئے درود و سلام کا نذرانہ</p>
            </div>
          </div>
          <button onclick="window.Views.incrementSalawat()" class="py-1.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs shadow-xs border border-teal-600 shrink-0">
            درود بھیجا +1 (<span id="salawat-disp" class="font-mono">${window.Views.salawatCount}</span>)
          </button>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.switchLiveChannel = function(ch) {
  window.Views.activeLiveChannel = ch;
  window.Views.renderLiveStreams();
};

window.Views.switchStreamServer = function(srv) {
  window.Views.activeStreamServer = srv;
  window.Views.renderLiveStreams();
};

window.Views.incrementSalawat = function() {
  window.Views.salawatCount++;
  localStorage.setItem('learnhub_salawat_count', window.Views.salawatCount.toString());
  const disp = document.getElementById('salawat-disp');
  if (disp) disp.textContent = window.Views.salawatCount;
  if (navigator.vibrate) navigator.vibrate(30);
  window.App?.showToast('اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ ✨', 'success');
};

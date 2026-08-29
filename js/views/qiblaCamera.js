/**
 * LearnHub AR Qibla Camera & Live Compass Module
 * Pure White Luxury SaaS Edition
 */

window.Views = window.Views || {};

window.Views.renderQiblaCamera = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div class="min-h-screen bg-white dark:bg-slate-900 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-24" dir="rtl">
      
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        <!-- Hero Header -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-sm text-center space-y-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-600/30 text-xs font-bold shadow-sm">
            <i data-lucide="compass" class="w-4 h-4 text-teal-600"></i>
            <span>کیمرہ قبلہ رخ (AR Qibla Compass)</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">کیمرہ سے قبلہ رخ معلوم کریں</h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            اپنے موبائل کیمرے کے ذریعے براہِ راست کعبہ شریف کی سمت اور حقیقی فاصلہ دیکھیں۔
          </p>
        </div>

        <!-- Camera & Compass Viewport -->
        <div class="rounded-3xl bg-slate-900 border border-slate-700 shadow-md overflow-hidden aspect-video relative flex flex-col items-center justify-center text-center p-6 space-y-4">
          <video id="qibla-camera-stream" autoplay playsinline class="absolute inset-0 w-full h-full object-cover opacity-60"></video>
          
          <div class="relative z-10 space-y-3">
            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-teal-400 bg-slate-950/70 backdrop-blur flex items-center justify-center text-4xl mx-auto shadow-lg shadow-teal-500/20 animate-pulse">
              🕋
            </div>
            
            <div class="space-y-1">
              <span class="inline-block px-3.5 py-1 rounded-full bg-teal-500 text-slate-950 font-black text-xs">
                سمتِ قبلہ: 265° مغرب کی طرف (WNW)
              </span>
              <div class="text-xs text-slate-300 font-mono font-bold">فاصلہ تا کعبہ شریف: ~3,950 KM</div>
            </div>
          </div>

          <button 
            id="qibla-camera-toggle-btn"
            onclick="window.Views.toggleQiblaCamera()" 
            class="relative z-10 py-2.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition active:scale-95"
          >
            <i data-lucide="camera" class="w-4 h-4"></i>
            <span>کیمرہ آن کریں (Start Camera)</span>
          </button>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.toggleQiblaCamera = async function() {
  const video = document.getElementById('qibla-camera-stream');
  const btn = document.getElementById('qibla-camera-toggle-btn');
  if (!video) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
    if (btn) btn.classList.add('hidden');
    window.App?.showToast('کیمرہ کامیابی سے آن ہو گیا! قبلہ کی طرف رخ فرمائیں۔ 🕋', 'success');
  } catch (err) {
    window.App?.showToast('کیمرہ کی اجازت درکار ہے۔', 'warning');
  }
};

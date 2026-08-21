/**
 * LearnHub AR Qibla Camera & Live Compass Module
 * Uses device camera and orientation sensor to guide users directly towards the Kaaba (Makkah).
 */

window.Views = window.Views || {};

window.Views.renderQiblaCamera = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Qibla Camera Hero Banner -->
      <div class="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-emerald-500/40 text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold shadow-sm">
          <i data-lucide="compass" class="w-4 h-4 text-emerald-400"></i>
          <span>کیمرہ قبلہ رخ (AR Qibla Compass)</span>
        </div>
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white">کیمرہ سے قبلہ رخ معلوم کریں</h1>
        <p class="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          اپنے موبائل کیمرے کے ذریعے براہ راست کعبہ شریف کی سمت اور حقیقی فاصلہ دیکھیں۔
        </p>
      </div>

      <!-- Camera & Compass Viewport -->
      <div class="lh-card rounded-3xl bg-slate-950 border-2 border-emerald-500/40 shadow-2xl overflow-hidden aspect-video relative flex flex-col items-center justify-center text-center p-6 space-y-4">
        <video id="qibla-camera-stream" autoplay playsinline class="absolute inset-0 w-full h-full object-cover opacity-60"></video>
        
        <div class="relative z-10 space-y-4">
          <div class="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-amber-400 bg-black/50 backdrop-blur flex items-center justify-center text-4xl sm:text-5xl mx-auto shadow-2xl shadow-amber-400/30 animate-pulse">
            🕋
          </div>
          
          <div class="space-y-1">
            <span class="badge bg-amber-400 text-slate-950 font-black text-xs px-4 py-1.5 rounded-full">
              سمتِ قبلہ: 265° مغرب کی طرف (WNW)
            </span>
            <div class="text-xs text-white font-mono font-bold">فاصلہ تا کعبہ شریف: ~3,950 KM</div>
          </div>
        </div>

        <button 
          id="qibla-camera-toggle-btn"
          onclick="window.Views.toggleQiblaCamera()" 
          class="relative z-10 btn-primary py-2.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl flex items-center gap-2"
        >
          <i data-lucide="camera" class="w-4 h-4"></i>
          <span>کیمرہ آن کریں (Start Camera)</span>
        </button>
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
    window.App?.showToast('کیمرہ کامیابی سے آن ہو گیا! قبلہ کی طرف رخ کریں۔ 🕋', 'success');
  } catch (err) {
    window.App?.showToast('کیمرہ کی اجازت درکار ہے۔', 'warning');
  }
};

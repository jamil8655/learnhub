/**
 * LearnHub Interactive Permissions & Device Access Center
 * Manages runtime user permissions for Notifications, Microphone, Camera,
 * Precise GPS Location, Gallery Storage, and Haptic Feedback.
 */

window.Views = window.Views || {};
window.PermissionsService = window.PermissionsService || {};

(function() {
  const P = window.PermissionsService;

  P.getStatuses = async function() {
    const statuses = {
      notifications: 'default',
      microphone: 'prompt',
      camera: 'prompt',
      location: 'prompt',
      storage: 'granted',
      vibrate: ('vibrate' in navigator) ? 'granted' : 'unsupported'
    };

    if ('Notification' in window) {
      statuses.notifications = Notification.permission;
    }

    if (navigator.permissions) {
      try {
        const mic = await navigator.permissions.query({ name: 'microphone' });
        statuses.microphone = mic.state;
      } catch(e) {}

      try {
        const cam = await navigator.permissions.query({ name: 'camera' });
        statuses.camera = cam.state;
      } catch(e) {}

      try {
        const geo = await navigator.permissions.query({ name: 'geolocation' });
        statuses.location = geo.state;
      } catch(e) {}
    }

    return statuses;
  };

  P.requestNotification = async function() {
    if (!('Notification' in window)) {
      window.App?.showToast('آپ کا براؤزر نوٹیفکیشن سپورٹ نہیں کرتا۔', 'warning');
      return false;
    }
    const res = await Notification.requestPermission();
    if (res === 'granted') {
      window.App?.showToast('نوٹیفکیشن کی اجازت مل گئی! 🔔', 'success');
      return true;
    }
    return false;
  };

  P.requestMicrophone = async function() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      window.App?.showToast('مائیکروفون کی اجازت فعال ہو گئی! 🎙️', 'success');
      return true;
    } catch (e) {
      window.App?.showToast('مائیکروفون کی اجازت نہیں ملی۔', 'warning');
      return false;
    }
  };

  P.requestCamera = async function() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      window.App?.showToast('کیمرہ کی اجازت فعال ہو گئی! 📷', 'success');
      return true;
    } catch (e) {
      window.App?.showToast('کیمرہ کی اجازت نہیں ملی۔', 'warning');
      return false;
    }
  };

  P.requestLocation = function() {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        window.App?.showToast('لوکیشن کی سہولت دستیاب نہیں۔', 'warning');
        resolve(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          localStorage.setItem('learnhub_user_lat', pos.coords.latitude);
          localStorage.setItem('learnhub_user_lng', pos.coords.longitude);
          window.App?.showToast('لوکیشن (GPS) کی اجازت فعال ہو گئی! 📍', 'success');
          resolve(true);
        },
        (err) => {
          window.App?.showToast('لوکیشن کی اجازت نہیں دی گئی۔', 'warning');
          resolve(false);
        }
      );
    });
  };

  P.requestStorage = function() {
    window.App?.showToast('آف لائن اسٹوریج و فائل ڈاؤن لوڈ فعال ہے! 📁', 'success');
    return true;
  };

  P.requestAllPermissions = async function() {
    await P.requestNotification();
    await P.requestLocation();
    await P.requestMicrophone();
    await P.requestCamera();
    window.App?.showToast('تمام ضروری پرمیشنز کامیابی سے سیٹ ہو گئیں! ✨', 'success');
    window.Views.renderPermissionsManager();
  };

})();

window.Views.renderPermissionsManager = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const P = window.PermissionsService;
  const statuses = await P.getStatuses();

  const permissionCards = [
    {
      id: 'notifications',
      title: 'پش نوٹیفکیشنز (Push Notifications)',
      desc: 'اذان کے الرٹس، صبح و شام کے مسنون اذکار، اور روزانہ کی آیات و احادیث کے لیے۔',
      icon: 'bell',
      color: 'amber',
      status: statuses.notifications,
      handler: 'window.PermissionsService.requestNotification().then(() => window.Views.renderPermissionsManager())'
    },
    {
      id: 'location',
      title: 'مقام و لوکیشن (GPS Location)',
      desc: 'آپ کے شہر کے مطابق نماز کے درست ترین اوقات اور کعبہ شریف کی سمت کے لیے۔',
      icon: 'map-pin',
      color: 'emerald',
      status: statuses.location,
      handler: 'window.PermissionsService.requestLocation().then(() => window.Views.renderPermissionsManager())'
    },
    {
      id: 'microphone',
      title: 'مائیکروفون (Microphone Audio)',
      desc: 'صوتی تجوید ٹیسٹر میں تلاوت جانچنے اور اے آئی وائس اسسٹنٹ سے سوال پوچھنے کے لیے۔',
      icon: 'mic',
      color: 'teal',
      status: statuses.microphone,
      handler: 'window.PermissionsService.requestMicrophone().then(() => window.Views.renderPermissionsManager())'
    },
    {
      id: 'camera',
      title: 'کیمرہ (Camera for AR Qibla)',
      desc: 'موبائل کیمرے کے ذریعے لائیو کعبہ شریف کی سمت دیکھنے اور پروفائل تصویر کے لیے۔',
      icon: 'camera',
      color: 'cyan',
      status: statuses.camera,
      handler: 'window.PermissionsService.requestCamera().then(() => window.Views.renderPermissionsManager())'
    },
    {
      id: 'storage',
      title: 'گیلری و فائل ڈاؤن لوڈ (Storage)',
      desc: 'پی ڈی ایف کتابیں، اسناد ڈاؤن لوڈ کرنے اور پروفائل تصویر اپلوڈ کرنے کے لیے۔',
      icon: 'folder-down',
      color: 'indigo',
      status: statuses.storage,
      handler: 'window.PermissionsService.requestStorage()'
    },
    {
      id: 'vibrate',
      title: 'ہَیپٹک وائبریشن (Haptic Feedback)',
      desc: 'ڈیجیٹل تسبیح کاؤنٹر، کوئز کلکس اور گیمز میں قدرتی وائبریشن فیڈبیک کے لیے۔',
      icon: 'smartphone',
      color: 'rose',
      status: statuses.vibrate,
      handler: 'window.App?.showToast("وائبریشن فیڈبیک فعال ہے! 📳", "success")'
    }
  ];

  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-urdu text-right w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- Permissions Hero Header -->
      <div class="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-emerald-500/40 text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold shadow-sm">
          <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
          <span>ایپ پرمیشنز کنٹرول روم (App Permissions Manager)</span>
        </div>
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white">موبائل ایپ کی ضروری پرمیشنز</h1>
        <p class="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          ایپ کے تمام جدید فیچرز (اذان الرٹس، کیمرہ قبلہ، صوتی تجوید، اور آف لائن ڈاؤن لوڈ) کے لیے ضروری پرمیشنز کو آن کریں۔
        </p>

        <div class="pt-2">
          <button 
            onclick="window.PermissionsService.requestAllPermissions()"
            class="btn-primary py-3.5 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-400/20 active:scale-95 transition inline-flex items-center gap-2"
          >
            <i data-lucide="check-check" class="w-4 h-4"></i>
            <span>تمام پرمیشنز ایک ساتھ آن کریں (Allow All)</span>
          </button>
        </div>
      </div>

      <!-- Permission Items Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        ${permissionCards.map(card => {
          const isGranted = card.status === 'granted';
          return `
            <div class="lh-card p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 ${isGranted ? 'border-emerald-500/40 bg-emerald-50/10' : 'border-slate-200 dark:border-slate-800'} shadow-lg flex flex-col justify-between space-y-4">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${isGranted ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}">
                  <i data-lucide="${card.icon}" class="w-6 h-6"></i>
                </div>

                <div class="flex-1 min-w-0 space-y-1">
                  <div class="flex items-center justify-between">
                    <h3 class="font-black text-sm sm:text-base text-slate-900 dark:text-white truncate">${card.title}</h3>
                    <span class="badge ${isGranted ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'} text-[10px] shrink-0">
                      ${isGranted ? 'فعال ہے ✓' : 'غیر فعال'}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 leading-relaxed">${card.desc}</p>
                </div>
              </div>

              <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span class="text-[11px] font-mono text-slate-400">حالت: ${card.status.toUpperCase()}</span>
                <button 
                  onclick="${card.handler}"
                  class="py-2 px-4 rounded-xl text-xs font-black transition ${isGranted ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'}"
                >
                  ${isGranted ? 'دوبارہ چیک کریں 🔄' : 'اجازت دیں (Allow) &larr;'}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.openPermissionsModal = function() {
  const modal = document.getElementById('global-modal');
  if (!modal) return;

  modal.innerHTML = `
    <div class="p-6 sm:p-8 text-center space-y-6 font-urdu text-right" dir="rtl">
      <div class="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-4xl shadow-xl">
        🛡️
      </div>

      <div class="space-y-2 text-center">
        <h3 class="text-2xl font-black text-slate-900 dark:text-white">ایپ پرمیشنز کی اجازت</h3>
        <p class="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          نماز کے درست اوقات، اذان کے الرٹس، اور صوتی تجوید کے لیے ضروری پرمیشنز آن فرمائیں۔
        </p>
      </div>

      <div class="space-y-2 text-xs font-bold text-slate-700 dark:text-slate-300 max-w-xs mx-auto text-right">
        <div class="flex items-center gap-2"><span>🔔</span> <span>اذان و اذکار کے نوٹیفکیشنز</span></div>
        <div class="flex items-center gap-2"><span>📍</span> <span>مقام و قبلہ کے لیے لوکیشن (GPS)</span></div>
        <div class="flex items-center gap-2"><span>🎙️</span> <span>تلاوت کا امتحان کے لیے مائیکروفون</span></div>
        <div class="flex items-center gap-2"><span>📷</span> <span>کیمرہ قبلہ رخ کے لیے کیمرہ</span></div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button 
          onclick="window.PermissionsService.requestAllPermissions().then(() => window.App?.closeModal());"
          class="btn-primary w-full sm:w-auto py-3 px-8 text-xs rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-xl"
        >
          تمام پرمیشنز آن کریں (Allow)
        </button>
        <button onclick="window.App?.closeModal()" class="btn-secondary w-full sm:w-auto py-3 px-6 text-xs rounded-2xl font-bold">
          بعد میں کریں گے
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};

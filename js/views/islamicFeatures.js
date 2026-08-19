/**
 * LearnHub Mega Real-Time Islamic & Spiritual Features Module
 * 1. Real-Time Solar Prayer Times Calculator & Dynamic GPS / City Engine
 * 2. Real-Time Qibla Compass with Device Orientation Sensor API
 * 3. Real-Time Hijri Calendar Converter & Astronomical Holy Events Tracker
 * 4. Interactive Digital Tasbeeh with Web Audio Synthesizer & Haptic Feedback
 * 5. Real-Time Daily Islamic Challenge Blitz with Live Timers & XP Points Sync
 * 6. Global Student Leaderboard with Real-Time Ranking Calculations
 * 7. Islamic Digital Library with In-App Book Reader & PDF Downloader
 * 8. Persistent Global Audio Studio with Background Player
 */

window.Views = window.Views || {};
window.RealtimeIslamic = window.RealtimeIslamic || {};

// ============================================================================
// REAL-TIME ASTRONOMICAL PRAYER TIMES & QIBLA ENGINE
// ============================================================================

const CITIES_COORDINATES = {
  karachi: { name: 'کراچی (Karachi)', lat: 24.8607, lng: 67.0011, timezone: 5, country: '🇵🇰 پاکستان' },
  lahore: { name: 'لاہور (Lahore)', lat: 31.5204, lng: 74.3587, timezone: 5, country: '🇵🇰 پاکستان' },
  islamabad: { name: 'اسلام آباد (Islamabad)', lat: 33.6844, lng: 73.0479, timezone: 5, country: '🇵🇰 پاکستان' },
  rawalpindi: { name: 'راولپنڈی (Rawalpindi)', lat: 33.5651, lng: 73.0169, timezone: 5, country: '🇵🇰 پاکستان' },
  faisalabad: { name: 'فیصل آباد (Faisalabad)', lat: 31.4504, lng: 73.1350, timezone: 5, country: '🇵🇰 پاکستان' },
  multan: { name: 'ملتان (Multan)', lat: 30.1575, lng: 71.5249, timezone: 5, country: '🇵🇰 پاکستان' },
  peshawar: { name: 'پشاور (Peshawar)', lat: 34.0151, lng: 71.5249, timezone: 5, country: '🇵🇰 پاکستان' },
  quetta: { name: 'کوئٹہ (Quetta)', lat: 30.1798, lng: 66.9750, timezone: 5, country: '🇵🇰 پاکستان' },
  makkah: { name: 'مکہ مکرمہ (Makkah)', lat: 21.4225, lng: 39.8262, timezone: 3, country: '🇸🇦 سعودی عرب' },
  madinah: { name: 'مدینہ منورہ (Madinah)', lat: 24.5247, lng: 39.5692, timezone: 3, country: '🇸🇦 سعودی عرب' },
  riyadh: { name: 'ریاض (Riyadh)', lat: 24.7136, lng: 46.6753, timezone: 3, country: '🇸🇦 سعودی عرب' },
  dubai: { name: 'دبئی (Dubai)', lat: 25.2048, lng: 55.2708, timezone: 4, country: '🇦🇪 متحدہ عرب امارات' },
  london: { name: 'لندن (London)', lat: 51.5074, lng: -0.1278, timezone: 0, country: '🇬🇧 برطانیہ' },
  newyork: { name: 'نیویارک (New York)', lat: 40.7128, lng: -74.0060, timezone: -5, country: '🇺🇸 امریکہ' },
  toronto: { name: 'ٹورنٹو (Toronto)', lat: 43.6532, lng: -79.3832, timezone: -5, country: '🇨🇦 کینیڈا' },
  delhi: { name: 'دہلی (Delhi)', lat: 28.7041, lng: 77.1025, timezone: 5.5, country: '🇮🇳 بھارت' },
  mumbai: { name: 'ممبئی (Mumbai)', lat: 19.0760, lng: 72.8777, timezone: 5.5, country: '🇮🇳 بھارت' },
  dhaka: { name: 'ڈھاکہ (Dhaka)', lat: 23.8103, lng: 90.4125, timezone: 6, country: '🇧🇩 بنگلہ دیش' },
  kualalumpur: { name: 'کوالالمپور (Kuala Lumpur)', lat: 3.1390, lng: 101.6869, timezone: 8, country: '🇲🇾 ملائیشیا' },
  istanbul: { name: 'استنبول (Istanbul)', lat: 41.0082, lng: 28.9784, timezone: 3, country: '🇹🇷 ترکیہ' }
};

// Calculate Solar Prayer Times using Standard Karachi / MWL Equations
window.RealtimeIslamic.calculatePrayerTimes = function(lat, lng, date = new Date()) {
  const d = new Date(date);
  const dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  // Declination and Equation of Time approximations
  const B = (2 * Math.PI * (dayOfYear - 81)) / 365;
  const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); // in minutes
  const declination = 23.45 * Math.sin(B) * (Math.PI / 180); // in radians
  const latRad = lat * (Math.PI / 180);

  // Solar Noon (Zawal)
  const solarNoonMinutes = 720 - (lng * 4) - EoT + (date.getTimezoneOffset() * -1);
  const noonHour = solarNoonMinutes / 60;

  // Hour Angle function for sun altitude
  const hourAngle = (altDeg) => {
    const altRad = altDeg * (Math.PI / 180);
    const cosH = (Math.sin(altRad) - Math.sin(latRad) * Math.sin(declination)) / (Math.cos(latRad) * Math.cos(declination));
    if (cosH > 1) return 0;
    if (cosH < -1) return Math.PI;
    return Math.acos(cosH);
  };

  // Sun altitudes: Fajr (-18°), Sunrise (-0.833°), Maghrib (-0.833°), Isha (-18°)
  const fajrHA = hourAngle(-18) * (180 / Math.PI) * 4; // minutes
  const sunriseHA = hourAngle(-0.833) * (180 / Math.PI) * 4;
  const ishaHA = hourAngle(-18) * (180 / Math.PI) * 4;

  // Asr altitude calculation (Hanafi / Shafi shadow ratio)
  const asrAltRad = Math.atan(1 / (1 + Math.tan(Math.abs(latRad - declination))));
  const asrHA = Math.acos((Math.sin(asrAltRad) - Math.sin(latRad) * Math.sin(declination)) / (Math.cos(latRad) * Math.cos(declination))) * (180 / Math.PI) * 4;

  const formatHours = (minutes) => {
    while (minutes < 0) minutes += 1440;
    while (minutes >= 1440) minutes -= 1440;
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    const s = Math.floor((minutes * 60) % 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const dispH = h % 12 === 0 ? 12 : h % 12;
    return {
      rawMinutes: minutes,
      hours24: h,
      minutes: m,
      seconds: s,
      formatted: `${String(dispH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`,
      formatted24: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    };
  };

  return {
    fajr: formatHours(solarNoonMinutes - fajrHA),
    sunrise: formatHours(solarNoonMinutes - sunriseHA),
    dhuhr: formatHours(solarNoonMinutes),
    asr: formatHours(solarNoonMinutes + asrHA),
    maghrib: formatHours(solarNoonMinutes + sunriseHA),
    isha: formatHours(solarNoonMinutes + ishaHA)
  };
};

// Calculate Qibla Direction in Degrees from True North
window.RealtimeIslamic.calculateQiblaBearing = function(lat, lng) {
  const makkahLat = 21.4225 * (Math.PI / 180);
  const makkahLng = 39.8262 * (Math.PI / 180);
  const userLat = lat * (Math.PI / 180);
  const userLng = lng * (Math.PI / 180);

  const deltaLng = makkahLng - userLng;
  const y = Math.sin(deltaLng);
  const x = Math.cos(userLat) * Math.tan(makkahLat) - Math.sin(userLat) * Math.cos(deltaLng);
  let qibla = Math.atan2(y, x) * (180 / Math.PI);
  return (qibla + 360) % 360;
};

// Calculate Real-Time Hijri Date
window.RealtimeIslamic.getRealtimeHijriDate = function() {
  try {
    const today = new Date();
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(today);
    const day = parts.find(p => p.type === 'day')?.value || '1';
    const monthIndex = parseInt(parts.find(p => p.type === 'month')?.value || '1', 10);
    const year = parts.find(p => p.type === 'year')?.value || '1447';

    const ISLAMIC_MONTHS = [
      'محرم الحرام', 'صفر المظفر', 'ربیع الاول', 'ربیع الثانی',
      'جمادی الاول', 'جمادی الثانی', 'رجب المرجب', 'شعبان المعظم',
      'رمضان المبارک', 'شوال المکرم', 'ذی القعدہ', 'ذی الحجہ'
    ];

    const monthName = ISLAMIC_MONTHS[monthIndex - 1] || 'شوال المکرم';

    return {
      day,
      monthName,
      monthIndex,
      year,
      formattedUrdu: `${day} ${monthName} ${year}ھ`,
      formattedArabic: `${day} ${monthName} ${year} هـ`
    };
  } catch (e) {
    return {
      day: '06',
      monthName: 'ربیع الاول',
      monthIndex: 3,
      year: '1448',
      formattedUrdu: '06 ربیع الاول 1448ھ'
    };
  }
};

// Web Audio Acoustic Click Synthesizer for Digital Tasbeeh
window.RealtimeIslamic.playTasbeehClick = function() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // AudioContext not allowed before user interaction
  }
};

// ============================================================================
// 1. LIVE REAL-TIME PRAYER TIMES & INTERACTIVE QIBLA COMPASS VIEW
// ============================================================================

window.Views.renderPrayerTimesAndQibla = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  // Clear any existing real-time ticker
  if (window.RealtimeIslamic._prayerInterval) {
    clearInterval(window.RealtimeIslamic._prayerInterval);
  }

  const selectedCityKey = localStorage.getItem('learnhub_prayer_city') || 'karachi';
  const city = CITIES_COORDINATES[selectedCityKey] || CITIES_COORDINATES['karachi'];
  const qiblaDeg = Math.round(window.RealtimeIslamic.calculateQiblaBearing(city.lat, city.lng));
  const hijri = window.RealtimeIslamic.getRealtimeHijriDate();

  container.innerHTML = `
    <div class="space-y-8 animate-fade-in font-urdu pb-16" dir="rtl">
      
      <!-- Top Real-Time Header Banner -->
      <div class="rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-6 sm:p-10 text-white border border-emerald-500/20 shadow-2xl relative overflow-hidden">
        <div class="absolute -left-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div class="space-y-3 text-center lg:text-right">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>لائیو ریئل ٹائم فلکیاتی اوقاتِ نماز و سمتِ قبلہ</span>
            </div>
            
            <h1 class="text-2xl sm:text-4xl font-extrabold leading-tight">
              اوقاتِ نماز اور مکہ مکرمہ کا قبلہ رخ
            </h1>
            
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-emerald-200">
              <span class="bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 font-bold">
                🌙 آج: ${hijri.formattedUrdu}
              </span>
              <span class="bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 font-mono font-bold" id="live-gregorian-time">
                ${new Date().toLocaleDateString('ur-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          <!-- Real-Time Dynamic City Selector & GPS Auto-Detect -->
          <div class="flex flex-col sm:flex-row items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur border border-white/15 shrink-0">
            <div class="flex items-center gap-2">
              <i data-lucide="map-pin" class="w-4 h-4 text-emerald-400"></i>
              <select id="prayer-city-select" onchange="window.Views.onCityChanged(this.value)" class="bg-slate-900/90 text-xs font-bold text-white rounded-xl px-3 py-2 border border-slate-700 font-urdu">
                ${Object.entries(CITIES_COORDINATES).map(([key, item]) => `
                  <option value="${key}" ${key === selectedCityKey ? 'selected' : ''}>
                    ${item.country} — ${item.name}
                  </option>
                `).join('')}
              </select>
            </div>

            <button onclick="window.Views.detectGPSLocation()" class="btn-primary py-2 px-3.5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold flex items-center gap-1.5 shadow whitespace-nowrap">
              <i data-lucide="crosshair" class="w-3.5 h-3.5"></i>
              <span>میرا موجودہ مقام (GPS)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Real-Time Countdown & Current Active Prayer Tile -->
      <div class="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-2 border-emerald-500/40 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6" id="realtime-prayer-ticker-box">
        
        <!-- Next Prayer Details -->
        <div class="flex items-center gap-4 text-right">
          <div class="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl shadow-lg shrink-0">
            🕌
          </div>
          <div>
            <span class="text-xs text-emerald-300 font-bold uppercase tracking-wider block" id="current-active-prayer-badge">حالیہ نماز کا وقت جاری ہے</span>
            <h2 class="text-xl sm:text-2xl font-extrabold text-white mt-0.5" id="next-prayer-name-display">اگلی نماز: لوڈنگ...</h2>
          </div>
        </div>

        <!-- Live Hours:Minutes:Seconds Countdown Box -->
        <div class="text-center md:text-left bg-black/40 px-6 py-3.5 rounded-2xl border border-emerald-500/30">
          <span class="text-[11px] text-slate-400 font-bold block mb-1">اگلی نماز میں باقی وقت:</span>
          <div class="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tracking-wider" id="next-prayer-countdown">
            00:00:00
          </div>
        </div>

      </div>

      <!-- 6 Live Prayer Times KPI Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4" id="prayer-cards-grid">
        <!-- Rendered Dynamically -->
      </div>

      <!-- Interactive Qibla Compass & Adhan Room (2 Columns) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Live Real-Time Interactive Compass (Left 6 cols) -->
        <div class="lg:col-span-6 lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-5">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 class="text-base font-extrabold text-slate-900 dark:text-white">لائیو قبلہ کمپاس (Qibla Compass)</h3>
              <span class="text-xs text-slate-400 block mt-0.5">${city.name}</span>
            </div>
            <span class="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl font-mono font-extrabold text-sm border border-emerald-500/20">
              ${qiblaDeg}° ڈگری
            </span>
          </div>

          <!-- Graphical Realistic Compass Dial -->
          <div class="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto rounded-full border-8 border-slate-100 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-800 dark:to-slate-950 flex items-center justify-center shadow-2xl overflow-hidden">
            
            <!-- Cardinal Markers -->
            <span class="absolute top-2 text-xs font-extrabold text-rose-500 font-mono">N (شمال)</span>
            <span class="absolute bottom-2 text-xs font-extrabold text-slate-400 font-mono">S (جنوب)</span>
            <span class="absolute right-3 text-xs font-extrabold text-slate-400 font-mono">E (مشرق)</span>
            <span class="absolute left-3 text-xs font-extrabold text-emerald-500 font-mono">W (مغرب)</span>

            <!-- Outer Degree Ring Markers -->
            <div class="absolute inset-4 rounded-full border border-dashed border-slate-300 dark:border-slate-700 pointer-events-none"></div>

            <!-- Compass Needle Rotating in Real-time -->
            <div id="qibla-needle-pointer" class="w-2 h-44 sm:h-52 bg-transparent rounded-full shadow-2xl relative flex items-start justify-center transition-transform duration-300 ease-out" style="transform: rotate(${qiblaDeg}deg);">
              
              <!-- Kaaba Tip Needle (Green) -->
              <div class="w-7 h-7 bg-emerald-600 border-2 border-white text-white rounded-full text-xs flex items-center justify-center shadow-xl -top-2 animate-bounce">
                🕋
              </div>
              
              <!-- North Pointer Indicator (Red) -->
              <div class="w-3.5 h-3.5 bg-rose-500 border border-white rounded-full -bottom-1 absolute"></div>
            </div>

            <!-- Compass Center Hub -->
            <div class="w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-[10px] text-amber-400 font-mono shadow-md z-10">
              Q
            </div>
          </div>

          <div class="space-y-2">
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-urdu">
              📱 <strong>ہدایت:</strong> اپنے موبائل کو میز پر سیدھا رکھیں اور گھمائیں۔ سبز کعبہ 🕋 کا رخ مکہ مکرمہ کی عین درست سمت ہے۔
            </p>
            <button onclick="window.Views.enableLiveMobileOrientation()" class="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              🔄 موبائل موشن سینسر آن کریں (Enable Device Sensor)
            </button>
          </div>
        </div>

        <!-- Adhan Audio Suite & Hadith Guidelines (Right 6 cols) -->
        <div class="lg:col-span-6 lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="text-base font-extrabold text-slate-900 dark:text-white">
              روح پرور اذانِ حرمین شریفین
            </h3>
            <span class="badge bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
              HD Audio
            </span>
          </div>

          <!-- Makkah Adhan Player -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                🕋
              </span>
              <div>
                <h4 class="text-xs font-bold text-slate-900 dark:text-white">اذانِ مسجد الحرام (مکہ مکرمہ)</h4>
                <span class="text-[11px] text-slate-400 font-urdu">شیخ علی احمد ملا (مؤذن کعبہ)</span>
              </div>
            </div>

            <audio controls class="w-full sm:w-48 h-9">
              <source src="https://cdn.islamicfinder.org/audio/adhan/adhan_makkah.mp3" type="audio/mpeg">
            </audio>
          </div>

          <!-- Madinah Adhan Player -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg">
                🕌
              </span>
              <div>
                <h4 class="text-xs font-bold text-slate-900 dark:text-white">اذانِ مسجد نبوی (مدینہ منورہ)</h4>
                <span class="text-[11px] text-slate-400 font-urdu">مسجد نبوی شریف</span>
              </div>
            </div>

            <audio controls class="w-full sm:w-48 h-9">
              <source src="https://cdn.islamicfinder.org/audio/adhan/adhan_madina.mp3" type="audio/mpeg">
            </audio>
          </div>

          <!-- Authentic Prophetic Hadith -->
          <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <span class="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 block">✨ اذان کا جواب اور دعا کی فضیلت:</span>
            <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-urdu">
              رسول اللہ ﷺ نے فرمایا: "جس نے اذان سن کر یہ دعا پڑھی: <em>اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ...</em> تو قیامت کے دن اس کے لیے میری شفاعت واجب ہو جائے گی۔" (صحیح بخاری)
            </p>
          </div>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Start Real-Time Prayer Ticker Engine
  window.Views.startPrayerTickerEngine(city.lat, city.lng);
};

window.Views.onCityChanged = function(cityKey) {
  localStorage.setItem('learnhub_prayer_city', cityKey);
  window.Views.renderPrayerTimesAndQibla();
  window.App?.showToast('مقام کامیابی سے تبدیل ہو گیا!', 'success');
};

window.Views.detectGPSLocation = function() {
  if (!('geolocation' in navigator)) {
    window.App?.showToast('آپ کے براؤزر میں GPS لوکیشن دستیاب نہیں ہے۔', 'danger');
    return;
  }
  window.App?.showToast('📍 آپ کا GPS مقام تلاش کیا جا رہا ہے...', 'info');
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      CITIES_COORDINATES['custom_gps'] = {
        name: `آپ کا GPS مقام (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
        lat,
        lng,
        country: '📍 موجودہ مقام'
      };
      localStorage.setItem('learnhub_prayer_city', 'custom_gps');
      window.Views.renderPrayerTimesAndQibla();
      window.App?.showToast('✓ آپ کا GPS مقام کامیابی سے سیٹ ہو گیا!', 'success');
    },
    (err) => {
      window.App?.showToast('لوکیشن کی اجازت نہیں ملی۔ براہ کرم براؤزر میں اجازت دیں۔', 'warning');
    }
  );
};

// Enable Mobile Gyroscope / Compass DeviceOrientation API
window.Views.enableLiveMobileOrientation = function() {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response === 'granted') {
          window.Views.attachCompassListener();
        } else {
          window.App?.showToast('موشن سینسر کی اجازت مسترد ہو گئی۔', 'warning');
        }
      })
      .catch(console.error);
  } else {
    window.Views.attachCompassListener();
  }
};

window.Views.attachCompassListener = function() {
  const needle = document.getElementById('qibla-needle-pointer');
  if (!needle) return;

  window.addEventListener('deviceorientation', (event) => {
    let heading = event.alpha;
    if (event.webkitCompassHeading) {
      heading = event.webkitCompassHeading; // iOS Safari
    }
    if (heading !== null && heading !== undefined) {
      const selectedCityKey = localStorage.getItem('learnhub_prayer_city') || 'karachi';
      const city = CITIES_COORDINATES[selectedCityKey] || CITIES_COORDINATES['karachi'];
      const qiblaBearing = window.RealtimeIslamic.calculateQiblaBearing(city.lat, city.lng);
      const needleRotation = (qiblaBearing - heading + 360) % 360;
      needle.style.transform = `rotate(${needleRotation}deg)`;
    }
  });

  window.App?.showToast('✓ موبائل کمپاس سینسر فعال ہو گیا!', 'success');
};

// Real-Time 1-Second Ticking Prayer Countdown & Highlighter
window.Views.startPrayerTickerEngine = function(lat, lng) {
  const updateTimes = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const times = window.RealtimeIslamic.calculatePrayerTimes(lat, lng, now);

    const prayerSchedule = [
      { id: 'fajr', name: 'فجر', time: times.fajr, icon: '🌅', note: 'طلوع تک' },
      { id: 'sunrise', name: 'طلوعِ آفتاب', time: times.sunrise, icon: '☀️', note: 'اشراق' },
      { id: 'dhuhr', name: 'ظہر', time: times.dhuhr, icon: '☀️', note: 'زوال کے بعد' },
      { id: 'asr', name: 'عصر', time: times.asr, icon: '🌤️', note: 'حنفی/شافعی' },
      { id: 'maghrib', name: 'مغرب', time: times.maghrib, icon: '🌇', note: 'غروبِ آفتاب' },
      { id: 'isha', name: 'عشاء', time: times.isha, icon: '🌙', note: 'فجر تک' }
    ];

    // Find next upcoming prayer
    let nextPrayer = prayerSchedule.find(p => p.time.rawMinutes > currentMinutes);
    let isTomorrow = false;
    if (!nextPrayer) {
      nextPrayer = prayerSchedule[0]; // Next is tomorrow's Fajr
      isTomorrow = true;
    }

    // Calculate Remaining Time
    let diffMinutes = isTomorrow 
      ? (1440 - currentMinutes + nextPrayer.time.rawMinutes) 
      : (nextPrayer.time.rawMinutes - currentMinutes);

    const remSecsTotal = Math.max(0, Math.floor(diffMinutes * 60));
    const remH = Math.floor(remSecsTotal / 3600);
    const remM = Math.floor((remSecsTotal % 3600) / 60);
    const remS = remSecsTotal % 60;

    const cdText = `${String(remH).padStart(2, '0')}:${String(remM).padStart(2, '0')}:${String(remS).padStart(2, '0')}`;

    const cdEl = document.getElementById('next-prayer-countdown');
    if (cdEl) cdEl.textContent = cdText;

    const nextNameEl = document.getElementById('next-prayer-name-display');
    if (nextNameEl) nextNameEl.textContent = `اگلی نماز: ${nextPrayer.name} (${nextPrayer.time.formatted})`;

    // Render / Update 6 KPI Cards with Active Prayer Highlight
    const grid = document.getElementById('prayer-cards-grid');
    if (grid) {
      grid.innerHTML = prayerSchedule.map(p => {
        const isNext = p.id === nextPrayer.id;
        return `
          <div class="p-4 rounded-2xl transition shadow-md text-center space-y-1 relative ${
            isNext 
              ? 'bg-emerald-500/15 border-2 border-emerald-500 dark:border-emerald-400 scale-[1.02] shadow-emerald-500/20' 
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
          }">
            ${isNext ? '<span class="badge bg-emerald-600 text-white text-[9px] font-bold absolute -top-2 left-1/2 -translate-x-1/2 px-2 rounded-full">اگلی نماز</span>' : ''}
            <span class="text-xs ${isNext ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-500 dark:text-slate-400 font-bold'} block">
              ${p.icon} نمازِ ${p.name}
            </span>
            <span class="text-lg sm:text-xl font-extrabold font-mono ${isNext ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white'}">
              ${p.time.formatted}
            </span>
            <span class="text-[10px] text-slate-400 block">${p.note}</span>
          </div>
        `;
      }).join('');
    }
  };

  updateTimes();
  window.RealtimeIslamic._prayerInterval = setInterval(updateTimes, 1000);
};

// ============================================================================
// 2. REAL-TIME INTERACTIVE DIGITAL TASBEEH (مع آڈیو کلک و وائبریشن)
// ============================================================================

window.Views.renderDigitalTasbeeh = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const savedCount = parseInt(localStorage.getItem('learnhub_tasbeeh_count') || '0', 10);
  const savedTarget = parseInt(localStorage.getItem('learnhub_tasbeeh_target') || '33', 10);
  const savedDhikr = localStorage.getItem('learnhub_tasbeeh_dhikr') || 'سُبْحَانَ اللَّهِ';
  const totalLifetime = parseInt(localStorage.getItem('learnhub_tasbeeh_lifetime') || '0', 10);

  const pct = Math.min(100, Math.round((savedCount / savedTarget) * 100));

  container.innerHTML = `
    <div class="max-w-xl mx-auto space-y-6 font-urdu animate-fade-in text-center pb-16" dir="rtl">
      
      <!-- Top Title Bar -->
      <div class="space-y-2">
        <span class="badge bg-emerald-500/20 text-emerald-400 font-bold px-3.5 py-1.5 rounded-full text-xs border border-emerald-500/30">
          📿 روحانی سکون و اذکار
        </span>
        <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          ریئل ٹائم ڈیجیٹل تسبیح
        </h1>
        <p class="text-xs text-slate-500">اسکرین پر کہیں بھی ٹچ کریں، تسبیح خود بخود ریکارڈ ہو جائے گی</p>
      </div>

      <!-- Dhikr Selector Dropdown -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <label class="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">ذکر منتخب کریں:</label>
        <select id="tasbeeh-dhikr-select" onchange="window.Views.changeTasbeehDhikr(this.value)" class="form-select text-center text-sm font-arabic font-extrabold py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700">
          <option value="سُبْحَانَ اللَّهِ" ${savedDhikr === 'سُبْحَانَ اللَّهِ' ? 'selected' : ''}>سُبْحَانَ اللَّهِ (اللہ پاک ہے)</option>
          <option value="الْحَمْدُ لِلَّهِ" ${savedDhikr === 'الْحَمْدُ لِلَّهِ' ? 'selected' : ''}>الْحَمْدُ لِلَّهِ (تمام تعریف اللہ کے لیے ہے)</option>
          <option value="اللَّهُ أَكْبَرُ" ${savedDhikr === 'اللَّهُ أَكْبَرُ' ? 'selected' : ''}>اللَّهُ أَكْبَرُ (اللہ سب سے بڑا ہے)</option>
          <option value="لاَ إِلَهَ إِلاَّ اللَّهُ" ${savedDhikr === 'لاَ إِلَهَ إِلاَّ اللَّهُ' ? 'selected' : ''}>لاَ إِلَهَ إِلاَّ اللَّهُ (اللہ کے سوا کوئی معبود نہیں)</option>
          <option value="أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ" ${savedDhikr.includes('أَسْتَغْفِرُ') ? 'selected' : ''}>أَسْتَغْفِرُ اللَّهَ (استغفار و توبہ)</option>
          <option value="اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ" ${savedDhikr.includes('صَلِّ') ? 'selected' : ''}>اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ (درود شریف)</option>
          <option value="لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ" ${savedDhikr.includes('حَوْلَ') ? 'selected' : ''}>لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ</option>
        </select>
      </div>

      <!-- Main Giant Clickable Dial Circle -->
      <div class="relative flex flex-col items-center justify-center p-4">
        
        <!-- Animated Ring Canvas Progress -->
        <button 
          onclick="window.Views.incrementTasbeeh()" 
          id="tasbeeh-touch-circle"
          class="w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-950 border-8 border-emerald-400/40 text-white shadow-2xl shadow-emerald-500/40 flex flex-col items-center justify-center gap-2 transition active:scale-95 select-none cursor-pointer relative overflow-hidden group">
          
          <div class="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition rounded-full pointer-events-none"></div>
          
          <span class="text-sm sm:text-base font-bold text-emerald-200 tracking-wide font-arabic" id="tasbeeh-active-dhikr">${savedDhikr}</span>
          
          <!-- Live Big Counter Number -->
          <span class="text-6xl sm:text-7xl font-extrabold font-mono text-white tracking-tight" id="tasbeeh-count-display">
            ${savedCount}
          </span>
          
          <!-- Target & Progress Pill -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-emerald-300 font-bold font-mono px-3 py-1 bg-black/40 rounded-full border border-white/10" id="tasbeeh-target-label">
              ہدف: ${savedTarget}
            </span>
            <span class="text-xs text-amber-300 font-bold font-mono px-2 py-1 bg-black/40 rounded-full border border-white/10" id="tasbeeh-pct-label">
              ${pct}%
            </span>
          </div>

          <span class="text-[10px] text-emerald-100/70 mt-1 uppercase tracking-wider animate-pulse">ٹچ کریں (TAP)</span>
        </button>

      </div>

      <!-- Target Selection & Reset Controls -->
      <div class="grid grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
        <button onclick="window.Views.setTasbeehTarget(33)" class="py-2.5 rounded-xl text-xs font-bold transition ${savedTarget === 33 ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'}">
          33 بار
        </button>
        <button onclick="window.Views.setTasbeehTarget(100)" class="py-2.5 rounded-xl text-xs font-bold transition ${savedTarget === 100 ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'}">
          100 بار
        </button>
        <button onclick="window.Views.setTasbeehTarget(1000)" class="py-2.5 rounded-xl text-xs font-bold transition ${savedTarget === 1000 ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'}">
          1000 بار
        </button>
        <button onclick="window.Views.resetTasbeeh()" class="py-2.5 rounded-xl text-xs font-bold bg-rose-600/10 text-rose-600 hover:bg-rose-600 hover:text-white transition flex items-center justify-center gap-1">
          <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
          <span>ری سیٹ</span>
        </button>
      </div>

      <!-- Lifetime Aggregate Stats -->
      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow flex items-center justify-between text-xs">
        <span class="text-slate-500">کل تسبیحات (Lifetime Count):</span>
        <span class="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm" id="tasbeeh-lifetime-display">
          ${totalLifetime + savedCount} مرتبہ
        </span>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.incrementTasbeeh = function() {
  let count = parseInt(localStorage.getItem('learnhub_tasbeeh_count') || '0', 10);
  let lifetime = parseInt(localStorage.getItem('learnhub_tasbeeh_lifetime') || '0', 10);
  const target = parseInt(localStorage.getItem('learnhub_tasbeeh_target') || '33', 10);
  
  count++;
  lifetime++;
  localStorage.setItem('learnhub_tasbeeh_count', count.toString());
  localStorage.setItem('learnhub_tasbeeh_lifetime', lifetime.toString());

  // Real-time Sound Synthesis
  window.RealtimeIslamic.playTasbeehClick();

  // Real-time Haptic Vibration
  if ('vibrate' in navigator) {
    navigator.vibrate(40);
  }

  // Update Visuals
  const display = document.getElementById('tasbeeh-count-display');
  if (display) {
    display.textContent = count;
    display.classList.add('scale-110');
    setTimeout(() => display.classList.remove('scale-110'), 120);
  }

  const pct = Math.min(100, Math.round((count / target) * 100));
  const pctEl = document.getElementById('tasbeeh-pct-label');
  if (pctEl) pctEl.textContent = `${pct}%`;

  const ltEl = document.getElementById('tasbeeh-lifetime-display');
  if (ltEl) ltEl.textContent = `${lifetime} مرتبہ`;

  // Check Target Completion with Celebratory Confetti & Vibration
  if (count === target) {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
    if (window.confetti) {
      window.confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
    window.App?.showToast(`🎉 ماشاء اللہ! آپ کا ${target} مرتبہ کا ہدف مکمل ہو گیا ہے۔ تقبل اللہ!`, 'success');
  }
};

// ============================================================================
// 3. REAL-TIME DAILY ISLAMIC CHALLENGE BLITZ (مع لائیو ٹائمر و پوائنٹس سنک)
// ============================================================================

const DAILY_BLITZ_QUESTIONS = [
  {
    q: 'قرآن مجید کی سب سے عظیم اور فضیلت والی سورت کون سی ہے؟',
    options: ['سورۃ البقرہ', 'سورۃ الفاتحہ', 'سورۃ یٰسٓ', 'سورۃ الملک'],
    correct: 1,
    exp: 'صحیح بخاری کی حدیث کے مطابق سورۃ الفاتحہ قرآن مجید کی سب سے عظیم سورت (ام الکتاب) ہے۔'
  },
  {
    q: 'رسول اللہ ﷺ نے ہجرت کے وقت مدینہ منورہ میں پہلا خطبہ کس مسجد میں دیا تھا؟',
    options: ['مسجد قباء', 'مسجد جمعہ', 'مسجد نبوی', 'مسجد قبلتین'],
    correct: 1,
    exp: 'وادی رانوناء میں واقع "مسجدِ جمعہ" میں آپ ﷺ نے مدینہ منورہ کا پہلا باضابطہ خطبہ جمعہ ارشاد فرمایا۔'
  },
  {
    q: 'ارکانِ اسلام میں مالی عبادت کون سی ہے؟',
    options: ['نماز', 'روزہ', 'زکوٰۃ', 'حج'],
    correct: 2,
    exp: 'زکوٰۃ اسلام کا تیسرا رکن اور خالص مالی عبادت ہے جو صاحبِ نصاب مسلمانوں پر فرض ہے۔'
  },
  {
    q: 'قرآن مجید میں کس صحابی رسول کا نام صراحتاً ذکر ہوا ہے؟',
    options: ['حضرت ابوبکر صدیقؓ', 'حضرت عمر فاروقؓ', 'حضرت زید بن حارثہؓ', 'حضرت علی المرتضیٰؓ'],
    correct: 2,
    exp: 'سورۃ الاحزاب (آیت 37) میں حضرت زید بن حارثہ رضی اللہ عنہ کا نام مبارک صراحتاً مذکور ہے۔'
  },
  {
    q: 'تجوید میں حروفِ قلقلہ کی کل تعداد کتنی ہے؟',
    options: ['3', '5 (ق، ط، ب، ج، د)', '7', '6'],
    correct: 1,
    exp: 'حروفِ قلقلہ پانچ ہیں جن کا مجموعہ "قُطْبُ جَدٍّ" ہے۔'
  }
];

window.Views.renderDailyChallenge = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const todayStr = new Date().toISOString().split('T')[0];
  const lastCompleted = localStorage.getItem('learnhub_daily_blitz_date');
  const isAlreadyDone = lastCompleted === todayStr;

  container.innerHTML = `
    <div class="max-w-3xl mx-auto space-y-8 animate-fade-in font-urdu pb-16" dir="rtl">
      
      <!-- Top Banner -->
      <div class="rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-950 p-6 sm:p-10 text-white shadow-2xl border border-indigo-500/20 text-center space-y-3 relative overflow-hidden">
        <span class="badge bg-indigo-500/20 text-indigo-300 font-bold px-3.5 py-1.5 rounded-full text-xs border border-indigo-500/30">
          ⚡ آج کا لائیو 5 سوالات کا چیلنج
        </span>
        <h1 class="text-2xl sm:text-4xl font-extrabold">روزانہ کا اسلامی علمی چیلنج</h1>
        <p class="text-xs sm:text-sm text-indigo-200 max-w-xl mx-auto leading-relaxed">
          ہر روز 5 نئے سوالات حل کریں، اپنی روزانہ اسٹریک برقرار رکھیں اور 100 XP حاصل کر کے عالمی لیڈر بورڈ پر ٹاپ رینک کریں۔
        </p>

        <div class="pt-4 flex items-center justify-center gap-3">
          ${isAlreadyDone ? `
            <div class="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <span>✓ آپ آج کا چیلنج پہلے ہی مکمل کر چکے ہیں! کل دوبارہ نیا چیلنج آئے گا۔</span>
            </div>
          ` : `
            <button onclick="window.Views.startDailyBlitzGame()" class="btn-primary bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-8 py-3.5 rounded-2xl shadow-xl shadow-amber-500/25 text-sm transition scale-100 hover:scale-105">
              چیلنج شروع کریں &rarr;
            </button>
          `}
          <a href="#/leaderboard" class="btn-secondary px-6 py-3.5 text-xs font-bold rounded-2xl">
            🏆 لیڈر بورڈ دیکھیں
          </a>
        </div>
      </div>

      <!-- Live Interactive Blitz Arena Container -->
      <div id="daily-blitz-arena-mount" class="hidden"></div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.startDailyBlitzGame = function() {
  const mount = document.getElementById('daily-blitz-arena-mount');
  if (!mount) return;
  mount.classList.remove('hidden');

  window.Views._blitzState = {
    currentIndex: 0,
    score: 0,
    timerSeconds: 15,
    interval: null,
    questions: DAILY_BLITZ_QUESTIONS
  };

  window.Views.renderBlitzQuestion();
};

window.Views.renderBlitzQuestion = function() {
  const S = window.Views._blitzState;
  const mount = document.getElementById('daily-blitz-arena-mount');
  if (!mount) return;

  if (S.currentIndex >= S.questions.length) {
    // Game Complete!
    window.Views.finishBlitzGame();
    return;
  }

  const q = S.questions[S.currentIndex];
  S.timerSeconds = 15;

  mount.innerHTML = `
    <div class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
      
      <!-- Progress & Countdown -->
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <span class="px-3 py-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl text-xs font-mono">
          سوال ${S.currentIndex + 1} از 5
        </span>

        <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-950 text-white rounded-xl font-mono text-xs font-bold">
          <i data-lucide="clock" class="w-3.5 h-3.5 text-amber-400 animate-pulse"></i>
          <span id="blitz-timer-txt">${S.timerSeconds}s</span>
        </div>
      </div>

      <!-- Question -->
      <h3 class="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white leading-relaxed">
        ${q.q}
      </h3>

      <!-- Options -->
      <div class="space-y-3" id="blitz-options-box">
        ${q.options.map((opt, idx) => `
          <button onclick="window.Views.selectBlitzOption(${idx})" class="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-right text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 transition flex items-center justify-between">
            <span>${opt}</span>
            <span class="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-mono">${idx + 1}</span>
          </button>
        `).join('')}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Start 15s Question Countdown
  if (S.interval) clearInterval(S.interval);
  S.interval = setInterval(() => {
    S.timerSeconds--;
    const tEl = document.getElementById('blitz-timer-txt');
    if (tEl) tEl.textContent = `${S.timerSeconds}s`;

    if (S.timerSeconds <= 0) {
      clearInterval(S.interval);
      window.App?.showToast('وقت ختم ہو گیا!', 'warning');
      S.currentIndex++;
      window.Views.renderBlitzQuestion();
    }
  }, 1000);
};

window.Views.selectBlitzOption = function(selectedIdx) {
  const S = window.Views._blitzState;
  if (S.interval) clearInterval(S.interval);

  const q = S.questions[S.currentIndex];
  const isCorrect = selectedIdx === q.correct;
  if (isCorrect) {
    S.score += 20;
    window.App?.showToast('✓ ماشاء اللہ! درست جواب۔ (+20 XP)', 'success');
  } else {
    window.App?.showToast(`✗ غلط جواب۔ درست جواب: "${q.options[q.correct]}"`, 'danger');
  }

  S.currentIndex++;
  setTimeout(() => {
    window.Views.renderBlitzQuestion();
  }, 1000);
};

window.Views.finishBlitzGame = function() {
  const S = window.Views._blitzState;
  if (S.interval) clearInterval(S.interval);

  const todayStr = new Date().toISOString().split('T')[0];
  localStorage.setItem('learnhub_daily_blitz_date', todayStr);

  const mount = document.getElementById('daily-blitz-arena-mount');
  if (!mount) return;

  if (window.confetti) {
    window.confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  }

  mount.innerHTML = `
    <div class="lh-card p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-2xl text-center space-y-5">
      <span class="text-5xl">🎉</span>
      <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white">آج کا چیلنج مکمل ہو گیا!</h2>
      <p class="text-xs text-slate-500">آپ نے حاصل کیے:</p>
      
      <div class="text-4xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
        ${S.score} / 100 XP
      </div>

      <div class="pt-4 flex items-center justify-center gap-3">
        <a href="#/leaderboard" class="btn-primary bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs">
          🏆 لیڈر بورڈ رینکنگ دیکھیں
        </a>
      </div>
    </div>
  `;
};

/**
 * LearnHub Real-Time Prayer Times & Live Adhan Engine (v239.0.0)
 * 
 * 1. Automatic Live GPS Geolocation (silent background detection).
 * 2. Online AlAdhan Real-Time API with instant Astronomical calculation backup.
 * 3. Compact UI integration with 1-second live countdown ticker.
 * 4. Real-time Adhan audio engine and Firestore sync.
 */

window.PrayerService = (function() {
  'use strict';

  const STORAGE_KEY = 'learnhub_prayer_settings';
  const CACHE_TIMINGS_KEY = 'learnhub_aladhan_timings_cache';

  const DEFAULT_SETTINGS = {
    cityName: 'لائیو لوکیشن (GPS)',
    country: '📍 لائیو',
    lat: 28.7041,
    lng: 77.1025,
    timezone: 5.5,
    useGps: true,
    calculationMethod: 1, // 1: Karachi/Subcontinent, 2: ISNA, 3: MWL, 4: Makkah, 5: Egypt
    asrJuristic: 1, // 1: Hanafi, 0: Shafi/Standard
    autoAdhan: true,
    selectedMuezzin: 'makkah',
    volume: 0.8,
    lastPlayedPrayer: null
  };

  const MUEZZINS = [
    {
      id: 'makkah',
      name: 'اذانِ حرم مکی (مسجد الحرام - مکہ مکرمہ)',
      audioUrl: 'https://cdn.aladhan.com/audio/adhans/makkah.mp3',
      fajrAudioUrl: 'https://cdn.aladhan.com/audio/adhans/fajr/makkah.mp3'
    },
    {
      id: 'madinah',
      name: 'اذانِ مسجد نبوی (مدینہ منورہ)',
      audioUrl: 'https://cdn.aladhan.com/audio/adhans/madina.mp3',
      fajrAudioUrl: 'https://cdn.aladhan.com/audio/adhans/fajr/madina.mp3'
    },
    {
      id: 'alaqsa',
      name: 'اذانِ مسجد اقصی (القدس الشریف)',
      audioUrl: 'https://cdn.aladhan.com/audio/adhans/alaqsa.mp3',
      fajrAudioUrl: 'https://cdn.aladhan.com/audio/adhans/fajr/alaqsa.mp3'
    },
    {
      id: 'cairo',
      name: 'اذانِ مصر (شیخ مصطفیٰ اسماعیل رحمہ اللہ)',
      audioUrl: 'https://cdn.aladhan.com/audio/adhans/cairo.mp3',
      fajrAudioUrl: 'https://cdn.aladhan.com/audio/adhans/fajr/cairo.mp3'
    }
  ];

  let _currentAudio = null;
  let _tickerInterval = null;
  let _liveTimings = null;

  function getSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? Object.assign({}, DEFAULT_SETTINGS, JSON.parse(saved)) : DEFAULT_SETTINGS;
    } catch(e) {
      return DEFAULT_SETTINGS;
    }
  }

  function saveSettings(patch) {
    try {
      const current = getSettings();
      const updated = Object.assign({}, current, patch);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      if (window.Auth && window.Auth.getCurrentUser()) {
        const user = window.Auth.getCurrentUser();
        const uid = user.uid || user.id;
        if (window.cloudDb && window.cloudDb.update) {
          window.cloudDb.update('users', uid, { prayerSettings: updated }).catch(function() {});
        }
      }

      return updated;
    } catch(e) {
      return DEFAULT_SETTINGS;
    }
  }

  // Astronomical Solar Equation backup
  function calculateAstronomicalTimes(lat, lng, date, asrJuristic) {
    date = date || new Date();
    asrJuristic = (asrJuristic !== undefined) ? asrJuristic : 1;

    const d = new Date(date);
    const dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    const B = (2 * Math.PI * (dayOfYear - 81)) / 365;
    const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    const declination = 23.45 * Math.sin(B) * (Math.PI / 180);
    const latRad = lat * (Math.PI / 180);

    const solarNoonMinutes = 720 - (lng * 4) - EoT + (date.getTimezoneOffset() * -1);

    const hourAngle = (altDeg) => {
      const altRad = altDeg * (Math.PI / 180);
      const cosH = (Math.sin(altRad) - Math.sin(latRad) * Math.sin(declination)) / (Math.cos(latRad) * Math.cos(declination));
      if (cosH > 1) return 0;
      if (cosH < -1) return Math.PI;
      return Math.acos(cosH);
    };

    const fajrHA = hourAngle(-18) * (180 / Math.PI) * 4;
    const sunriseHA = hourAngle(-0.833) * (180 / Math.PI) * 4;
    const ishaHA = hourAngle(-18) * (180 / Math.PI) * 4;

    const shadowMultiplier = (asrJuristic === 1) ? 2 : 1;
    const asrAltRad = Math.atan(1 / (shadowMultiplier + Math.tan(Math.abs(latRad - declination))));
    const asrHA = Math.acos((Math.sin(asrAltRad) - Math.sin(latRad) * Math.sin(declination)) / (Math.cos(latRad) * Math.cos(declination))) * (180 / Math.PI) * 4;

    const formatObj = (minutes) => {
      while (minutes < 0) minutes += 1440;
      while (minutes >= 1440) minutes -= 1440;
      const h = Math.floor(minutes / 60);
      const m = Math.floor(minutes % 60);
      const s = Math.floor((minutes * 60) % 60);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const dispH = h % 12 === 0 ? 12 : h % 12;
      return {
        rawMinutes: Math.round(minutes),
        hours24: h,
        minutes: m,
        seconds: s,
        formatted: String(dispH).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ' ' + ampm,
        formatted24: String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0')
      };
    };

    return {
      fajr: formatObj(solarNoonMinutes - fajrHA),
      sunrise: formatObj(solarNoonMinutes - sunriseHA),
      dhuhr: formatObj(solarNoonMinutes),
      asr: formatObj(solarNoonMinutes + asrHA),
      maghrib: formatObj(solarNoonMinutes + sunriseHA),
      isha: formatObj(solarNoonMinutes + ishaHA)
    };
  }

  // Parse 24-hr time string "04:38" or "18:43" into standardized time object
  function parseTimeToObj(timeStr) {
    if (!timeStr) return { formatted: '--:--', rawMinutes: 0 };
    const clean = timeStr.split(' ')[0].trim();
    const parts = clean.split(':');
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const dispH = h % 12 === 0 ? 12 : h % 12;
    return {
      rawMinutes: h * 60 + m,
      hours24: h,
      minutes: m,
      formatted: String(dispH).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ' ' + ampm,
      formatted24: String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0')
    };
  }

  // Fetch Live Timings from AlAdhan API
  async function fetchLiveAlAdhanTimings(lat, lng, method) {
    const todayStr = new Date().toISOString().split('T')[0];
    const cacheKey = CACHE_TIMINGS_KEY + '_' + todayStr + '_' + lat.toFixed(2) + '_' + lng.toFixed(2);
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        _liveTimings = JSON.parse(cached);
        return _liveTimings;
      }
    } catch(e) {}

    try {
      const url = 'https://api.aladhan.com/v1/timings?latitude=' + lat + '&longitude=' + lng + '&method=' + (method || 1);
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.timings) {
          const t = json.data.timings;
          _liveTimings = {
            fajr: parseTimeToObj(t.Fajr),
            sunrise: parseTimeToObj(t.Sunrise),
            dhuhr: parseTimeToObj(t.Dhuhr),
            asr: parseTimeToObj(t.Asr),
            maghrib: parseTimeToObj(t.Maghrib),
            isha: parseTimeToObj(t.Isha)
          };
          try {
            localStorage.setItem(cacheKey, JSON.stringify(_liveTimings));
          } catch(e) {}
          return _liveTimings;
        }
      }
    } catch(e) {}

    _liveTimings = calculateAstronomicalTimes(lat, lng, new Date(), 1);
    return _liveTimings;
  }

  function getTimes(lat, lng, asrJuristic) {
    if (_liveTimings) return _liveTimings;
    const settings = getSettings();
    const effectiveLat = lat !== undefined ? lat : settings.lat;
    const effectiveLng = lng !== undefined ? lng : settings.lng;
    return calculateAstronomicalTimes(effectiveLat, effectiveLng, new Date(), asrJuristic !== undefined ? asrJuristic : settings.asrJuristic);
  }

  function getNextPrayerInfo(times) {
    if (!times || !times.fajr) return null;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

    const prayers = [
      { key: 'fajr', name: 'نمازِ فجر', nameArabic: 'الفَجْر', timeObj: times.fajr },
      { key: 'sunrise', name: 'طلوعِ آفتاب', nameArabic: 'الشُّرُوق', timeObj: times.sunrise },
      { key: 'dhuhr', name: 'نمازِ ظہر', nameArabic: 'الظُّهْر', timeObj: times.dhuhr },
      { key: 'asr', name: 'نمازِ عصر', nameArabic: 'العَصْر', timeObj: times.asr },
      { key: 'maghrib', name: 'نمازِ مغرب', nameArabic: 'المَغْرِب', timeObj: times.maghrib },
      { key: 'isha', name: 'نمازِ عشاء', nameArabic: 'العِشَاء', timeObj: times.isha }
    ];

    let next = null;
    let active = prayers[prayers.length - 1];

    for (let i = 0; i < prayers.length; i++) {
      if (prayers[i].timeObj.rawMinutes > currentMinutes) {
        next = prayers[i];
        active = (i > 0) ? prayers[i - 1] : prayers[prayers.length - 1];
        break;
      }
    }

    if (!next) {
      next = Object.assign({}, prayers[0], { isNextDay: true });
      active = prayers[prayers.length - 1];
    }

    const nextMin = next.isNextDay ? (next.timeObj.rawMinutes + 1440) : next.timeObj.rawMinutes;
    const diffMin = nextMin - currentMinutes;
    const diffSec = Math.max(0, Math.floor(diffMin * 60));
    const h = Math.floor(diffSec / 3600);
    const m = Math.floor((diffSec % 3600) / 60);
    const s = diffSec % 60;

    let countdownText = '';
    if (h > 0) countdownText += h + ' گھنٹہ ';
    if (m > 0 || h > 0) countdownText += m + ' منٹ ';
    countdownText += s + ' سیکنڈ باقی';

    return {
      activePrayer: active,
      nextPrayer: next,
      countdownText: countdownText,
      remainingMinutes: Math.round(diffMin),
      totalSecondsRemaining: diffSec,
      isPrayerNow: diffMin <= 1 && diffMin >= -15
    };
  }

  function playAdhan(isFajr) {
    const settings = getSettings();
    const muezzin = MUEZZINS.find(m => m.id === settings.selectedMuezzin) || MUEZZINS[0];
    const url = isFajr ? muezzin.fajrAudioUrl : muezzin.audioUrl;

    if (_currentAudio) {
      _currentAudio.pause();
    }

    const audio = new Audio(url);
    audio.volume = settings.volume || 0.8;
    _currentAudio = audio;

    audio.play().then(function() {
      window.App?.showToast('🔊 ' + muezzin.name + ' نشر ہو رہی ہے...', 'info');
    }).catch(function(err) {
      console.warn('[PrayerService] Audio playback note:', err.message);
    });

    return audio;
  }

  function stopAdhan() {
    if (_currentAudio) {
      _currentAudio.pause();
      _currentAudio = null;
    }
  }

  // Auto-detect Live GPS location in background
  function autoInitLiveLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          saveSettings({
            lat: lat,
            lng: lng,
            cityName: 'لائیو لوکیشن (GPS)',
            country: '📍 جی پی ایس',
            useGps: true
          });
          fetchLiveAlAdhanTimings(lat, lng, 1).then(function() {
            updateHomePrayerUi();
          });
        },
        function() {
          const s = getSettings();
          fetchLiveAlAdhanTimings(s.lat, s.lng, s.calculationMethod).then(function() {
            updateHomePrayerUi();
          });
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      const s = getSettings();
      fetchLiveAlAdhanTimings(s.lat, s.lng, s.calculationMethod).then(function() {
        updateHomePrayerUi();
      });
    }
  }

  function updateHomePrayerUi() {
    const settings = getSettings();
    const times = getTimes(settings.lat, settings.lng, settings.asrJuristic);
    const info = getNextPrayerInfo(times);
    if (!info) return;

    const nextEl = document.getElementById('home-prayer-next-title');
    const timeEl = document.getElementById('home-prayer-next-time');
    const countEl = document.getElementById('home-prayer-countdown-live');

    if (nextEl) nextEl.textContent = info.nextPrayer.name;
    if (timeEl) timeEl.textContent = info.nextPrayer.timeObj.formatted;
    if (countEl) countEl.textContent = info.countdownText;

    ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(k => {
      const el = document.getElementById('home-prayer-val-' + k);
      if (el && times[k]) el.textContent = times[k].formatted;
    });
  }

  function initRealtimeTicker() {
    if (_tickerInterval) clearInterval(_tickerInterval);

    _tickerInterval = setInterval(function() {
      const settings = getSettings();
      const times = getTimes(settings.lat, settings.lng, settings.asrJuristic);
      const info = getNextPrayerInfo(times);

      const countEl = document.getElementById('home-prayer-countdown-live');
      if (countEl && info) {
        countEl.textContent = info.countdownText;
      }

      if (settings.autoAdhan && info && info.isPrayerNow) {
        const todayKey = new Date().toDateString() + '_' + info.nextPrayer.key;
        if (settings.lastPlayedPrayer !== todayKey) {
          saveSettings({ lastPlayedPrayer: todayKey });
          playAdhan(info.nextPrayer.key === 'fajr');
          if (window.Notification && Notification.permission === 'granted') {
            new Notification('🕌 ' + info.nextPrayer.name + ' کا وقت ہو گیا ہے!', {
              body: 'اللہ اکبر! ' + info.nextPrayer.name + ' کا وقت ہو چکا ہے۔',
              icon: 'icons/icon-192.png'
            });
          }
        }
      }
    }, 1000);
  }

  // Initialize
  autoInitLiveLocation();
  initRealtimeTicker();

  return {
    getSettings,
    saveSettings,
    MUEZZINS,
    getTimes,
    calculateAstronomicalTimes,
    fetchLiveAlAdhanTimings,
    getNextPrayerInfo,
    playAdhan,
    stopAdhan,
    autoInitLiveLocation,
    updateHomePrayerUi
  };
})();

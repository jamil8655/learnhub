/**
 * LearnHub Complete Quran Service & State Management Engine
 * Production-ready caching, offline IndexedDB storage, bookmarks, private notes,
 * reading history & streaks, audio player engine, downloads manager, and card generator.
 */

window.QuranService = (function() {
  'use strict';

  const DB_NAME = 'learnhub_quran_db';
  const DB_VERSION = 1;
  const STORE_SURAHS = 'cached_surahs';
  const STORE_DOWNLOADS = 'downloaded_surahs';

  let _dbInstance = null;

  // Initialize IndexedDB for robust offline Quran storage
  async function getDb() {
    if (_dbInstance) return _dbInstance;
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        resolve(null);
        return;
      }
      const req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_SURAHS)) {
          db.createObjectStore(STORE_SURAHS, { keyPath: 'surahNumber' });
        }
        if (!db.objectStoreNames.contains(STORE_DOWNLOADS)) {
          db.createObjectStore(STORE_DOWNLOADS, { keyPath: 'surahNumber' });
        }
      };
      req.onsuccess = (e) => {
        _dbInstance = e.target.result;
        resolve(_dbInstance);
      };
      req.onerror = () => resolve(null);
    });
  }

  // --- 1. SETTINGS & PREFERENCES ---
  const DEFAULT_SETTINGS = {
    arabicFontSize: 28,
    translationFontSize: 16,
    tafsirFontSize: 15,
    arabicFont: 'amiri', // 'amiri', 'nastaliq', 'scheherazade'
    lineHeight: 'relaxed',
    viewMode: 'mushaf15', // 'mushaf15', 'ayah_cards', 'full_surah', 'hifz'
    showTranslation: true,
    selectedTranslation: 'ur_jalandhri',
    selectedTafsir: 'ahsanulbayan',
    selectedQari: 'alafasy',
    playbackSpeed: 1.0,
    repeatMode: 'off', // 'off', 'ayah', 'surah', 'range'
    repeatCount: 1,
    autoScroll: true,
    theme: 'system' // 'system', 'light', 'dark', 'sepia'
  };

  function getSettings() {
    try {
      const saved = localStorage.getItem('learnhub_quran_settings');
      return saved ? Object.assign({}, DEFAULT_SETTINGS, JSON.parse(saved)) : Object.assign({}, DEFAULT_SETTINGS);
    } catch(e) {
      return Object.assign({}, DEFAULT_SETTINGS);
    }
  }

  function saveSettings(patch) {
    try {
      const current = getSettings();
      const updated = Object.assign({}, current, patch);
      localStorage.setItem('learnhub_quran_settings', JSON.stringify(updated));
      return updated;
    } catch(e) {
      return DEFAULT_SETTINGS;
    }
  }

  // --- 2. SURAH FETCHING & HYBRID CACHING ---
  async function getSurahVerses(surahNumber) {
    const num = parseInt(surahNumber, 10);
    if (!num || num < 1 || num > 114) return [];

    // Check IndexedDB cache first
    try {
      const db = await getDb();
      if (db) {
        const tx = db.transaction(STORE_SURAHS, 'readonly');
        const store = tx.objectStore(STORE_SURAHS);
        const cached = await new Promise(res => {
          const req = store.get(num);
          req.onsuccess = () => res(req.result);
          req.onerror = () => res(null);
        });
        if (cached && cached.ayahs && cached.ayahs.length > 0) {
          return cached.ayahs;
        }
      }
    } catch (err) {
      console.warn('[QuranService] IndexedDB read error:', err);
    }

    // Try fetching from AlQuran Cloud Live API (Uthmani Arabic + Urdu Jalandhri + English Sahih)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);
      const url = `https://api.alquran.cloud/v1/surah/${num}/editions/quran-uthmani,ur.jalandhry,en.sahih`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length >= 3) {
          const arabicData = json.data[0].ayahs;
          const urduData = json.data[1].ayahs;
          const englishData = json.data[2].ayahs;

          const combined = arabicData.map((a, idx) => {
            let cleanText = a.text;
            if (num !== 1 && num !== 9 && idx === 0) {
              cleanText = cleanText.replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, '').trim();
            }
            return {
              number: a.number,
              numberInSurah: a.numberInSurah,
              juz: a.juz,
              page: a.page,
              hizbQuarter: a.hizbQuarter,
              sajda: a.sajda || false,
              text: cleanText,
              urdu: urduData[idx] ? urduData[idx].text : '',
              english: englishData[idx] ? englishData[idx].text : '',
              tafsir: ''
            };
          });

          // Save to IndexedDB for offline capability
          try {
            const db = await getDb();
            if (db) {
              const tx = db.transaction(STORE_SURAHS, 'readwrite');
              tx.objectStore(STORE_SURAHS).put({ surahNumber: num, ayahs: combined, cachedAt: Date.now() });
            }
          } catch(e) {}

          return combined;
        }
      }
    } catch (networkErr) {
      console.warn('[QuranService] Live API fetch failed, falling back to local dataset:', networkErr);
    }

    // Check Fallback Core Offline Verses
    if (window.QURAN_DATA && window.QURAN_DATA.CORE_OFFLINE_VERSES && window.QURAN_DATA.CORE_OFFLINE_VERSES[num]) {
      return window.QURAN_DATA.CORE_OFFLINE_VERSES[num];
    }

    // Secondary fallback: generate minimal placeholder so reader never blanks out
    const meta = (window.QURAN_DATA && window.QURAN_DATA.SURAHS.find(s => s.number === num)) || { ayahCount: 7 };
    const dummy = [];
    for (let i = 1; i <= meta.ayahCount; i++) {
      dummy.push({
        number: i,
        numberInSurah: i,
        juz: meta.juz || 1,
        page: meta.page || 1,
        text: `آية ${i} - ${meta.nameArabic || 'القرآن الكريم'}`,
        urdu: 'انٹرنیٹ کنکشن منقطع ہے۔ برائے مہربانی نیٹ بحال فرما کر دوبارہ کوشش کریں۔',
        english: 'Network offline. Please reconnect to load verse contents.',
        tafsir: ''
      });
    }
    return dummy;
  }

  // --- 3. BOOKMARKS MANAGEMENT ---
  function getBookmarks() {
    try {
      return JSON.parse(localStorage.getItem('learnhub_quran_bookmarks') || '[]');
    } catch(e) {
      return [];
    }
  }

  function addBookmark(surahNumber, ayahNumber, category = 'important', note = '') {
    const list = getBookmarks();
    const id = `bm_${surahNumber}_${ayahNumber}`;
    const filtered = list.filter(b => b.id !== id);
    const surahMeta = window.QURAN_DATA ? window.QURAN_DATA.SURAHS.find(s => s.number === surahNumber) : null;

    const newBookmark = {
      id,
      surahNumber,
      ayahNumber,
      surahNameArabic: surahMeta ? surahMeta.nameArabic : `سورة ${surahNumber}`,
      surahNameUrdu: surahMeta ? surahMeta.nameUrdu : '',
      category, // 'important', 'memorization', 'revision', 'study'
      note,
      createdAt: Date.now()
    };
    filtered.unshift(newBookmark);
    localStorage.setItem('learnhub_quran_bookmarks', JSON.stringify(filtered));
    return newBookmark;
  }

  function removeBookmark(id) {
    const list = getBookmarks();
    const filtered = list.filter(b => b.id !== id);
    localStorage.setItem('learnhub_quran_bookmarks', JSON.stringify(filtered));
    return filtered;
  }

  function isAyahBookmarked(surahNumber, ayahNumber) {
    const list = getBookmarks();
    return list.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
  }

  // --- 4. PRIVATE NOTES MANAGEMENT ---
  function getNotes() {
    try {
      return JSON.parse(localStorage.getItem('learnhub_quran_notes') || '[]');
    } catch(e) {
      return [];
    }
  }

  function saveNote(surahNumber, ayahNumber, noteText) {
    const list = getNotes();
    const id = `note_${surahNumber}_${ayahNumber}`;
    const filtered = list.filter(n => n.id !== id);
    const surahMeta = window.QURAN_DATA ? window.QURAN_DATA.SURAHS.find(s => s.number === surahNumber) : null;

    if (!noteText || noteText.trim() === '') {
      localStorage.setItem('learnhub_quran_notes', JSON.stringify(filtered));
      return null;
    }

    const newNote = {
      id,
      surahNumber,
      ayahNumber,
      surahNameArabic: surahMeta ? surahMeta.nameArabic : `سورة ${surahNumber}`,
      surahNameUrdu: surahMeta ? surahMeta.nameUrdu : '',
      text: noteText.trim(),
      updatedAt: Date.now()
    };
    filtered.unshift(newNote);
    localStorage.setItem('learnhub_quran_notes', JSON.stringify(filtered));
    return newNote;
  }

  function getNoteForAyah(surahNumber, ayahNumber) {
    const list = getNotes();
    const found = list.find(n => n.surahNumber === surahNumber && n.ayahNumber === ayahNumber);
    return found ? found.text : '';
  }

  function deleteNote(id) {
    const list = getNotes();
    const filtered = list.filter(n => n.id !== id);
    localStorage.setItem('learnhub_quran_notes', JSON.stringify(filtered));
    return filtered;
  }

  // --- 5. LAST READ POSITION & HISTORY ---
  function saveLastRead(surahNumber, ayahNumber, page, juz) {
    try {
      const data = {
        surahNumber,
        ayahNumber: ayahNumber || 1,
        page: page || 1,
        juz: juz || 1,
        timestamp: Date.now()
      };
      localStorage.setItem('learnhub_quran_last_read', JSON.stringify(data));
      addReadingHistory(surahNumber, ayahNumber || 1);
      recordDailyGoalAyah();
    } catch(e) {}
  }

  function getLastRead() {
    try {
      const data = localStorage.getItem('learnhub_quran_last_read');
      return data ? JSON.parse(data) : { surahNumber: 1, ayahNumber: 1, page: 1, juz: 1 };
    } catch(e) {
      return { surahNumber: 1, ayahNumber: 1, page: 1, juz: 1 };
    }
  }

  function getReadingHistory() {
    try {
      return JSON.parse(localStorage.getItem('learnhub_quran_history') || '[]');
    } catch(e) {
      return [];
    }
  }

  function addReadingHistory(surahNumber, ayahNumber) {
    const history = getReadingHistory();
    const surahMeta = window.QURAN_DATA ? window.QURAN_DATA.SURAHS.find(s => s.number === surahNumber) : null;
    const item = {
      surahNumber,
      ayahNumber,
      surahNameArabic: surahMeta ? surahMeta.nameArabic : `سورة ${surahNumber}`,
      surahNameUrdu: surahMeta ? surahMeta.nameUrdu : '',
      timestamp: Date.now()
    };
    const filtered = history.filter(h => h.surahNumber !== surahNumber);
    filtered.unshift(item);
    if (filtered.length > 20) filtered.pop();
    localStorage.setItem('learnhub_quran_history', JSON.stringify(filtered));
  }

  // --- 6. DAILY GOAL & READING STREAK ---
  function getDailyGoalData() {
    const todayStr = new Date().toISOString().slice(0, 10);
    try {
      const saved = JSON.parse(localStorage.getItem('learnhub_quran_daily_goal') || '{}');
      if (saved.date !== todayStr) {
        return {
          date: todayStr,
          targetAyahs: saved.targetAyahs || 10,
          readToday: 0,
          streak: calculateStreak(saved)
        };
      }
      return saved;
    } catch(e) {
      return { date: todayStr, targetAyahs: 10, readToday: 0, streak: 1 };
    }
  }

  function calculateStreak(prevData) {
    if (!prevData || !prevData.date) return 1;
    const prevDate = new Date(prevData.date);
    const now = new Date();
    const diffDays = Math.floor((now - prevDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 1 && prevData.readToday >= prevData.targetAyahs) {
      return (prevData.streak || 1) + 1;
    }
    return diffDays > 1 ? 1 : (prevData.streak || 1);
  }

  function recordDailyGoalAyah() {
    const goal = getDailyGoalData();
    goal.readToday = (goal.readToday || 0) + 1;
    localStorage.setItem('learnhub_quran_daily_goal', JSON.stringify(goal));
  }

  function setDailyGoalTarget(target) {
    const goal = getDailyGoalData();
    goal.targetAyahs = Math.max(1, parseInt(target, 10) || 10);
    localStorage.setItem('learnhub_quran_daily_goal', JSON.stringify(goal));
    return goal;
  }

  // --- 7. DOWNLOADS & OFFLINE STORAGE MANAGER ---
  async function downloadSurah(surahNumber, onProgress) {
    const num = parseInt(surahNumber, 10);
    if (onProgress) onProgress(15, 'آیات و تراجم ڈاؤن لوڈ ہو رہے ہیں...');

    const ayahs = await getSurahVerses(num);
    if (onProgress) onProgress(70, 'آف لائن ڈیٹا بیس میں محفوظ کیا جا رہا ہے...');

    const db = await getDb();
    if (db) {
      const tx = db.transaction(STORE_DOWNLOADS, 'readwrite');
      const store = tx.objectStore(STORE_DOWNLOADS);
      const surahMeta = window.QURAN_DATA ? window.QURAN_DATA.SURAHS.find(s => s.number === num) : null;
      store.put({
        surahNumber: num,
        surahNameArabic: surahMeta ? surahMeta.nameArabic : '',
        surahNameUrdu: surahMeta ? surahMeta.nameUrdu : '',
        ayahCount: ayahs.length,
        ayahs,
        downloadedAt: Date.now()
      });
    }

    if (onProgress) onProgress(100, 'ڈاؤن لوڈ مکمل!');
    return true;
  }

  async function getDownloadedSurahs() {
    const db = await getDb();
    if (!db) return [];
    return new Promise(res => {
      const tx = db.transaction(STORE_DOWNLOADS, 'readonly');
      const store = tx.objectStore(STORE_DOWNLOADS);
      const req = store.getAll();
      req.onsuccess = () => res(req.result || []);
      req.onerror = () => res([]);
    });
  }

  async function deleteDownloadedSurah(surahNumber) {
    const db = await getDb();
    if (!db) return;
    const num = parseInt(surahNumber, 10);
    const tx = db.transaction(STORE_DOWNLOADS, 'readwrite');
    tx.objectStore(STORE_DOWNLOADS).delete(num);
  }

  // --- 8. AUDIO PLAYER ENGINE WITH MEDIASESSION ---
  let _audioElement = null;
  let _currentPlaylist = [];
  let _currentIndex = 0;
  let _isPlaying = false;
  let _playbackCallbacks = [];

  function getAudioElement() {
    if (!_audioElement) {
      _audioElement = new Audio();
      _audioElement.preload = 'auto';

      _audioElement.onplay = () => {
        _isPlaying = true;
        notifyPlaybackState();
        updateMediaSession();
      };
      _audioElement.onpause = () => {
        _isPlaying = false;
        notifyPlaybackState();
      };
      _audioElement.onended = () => {
        handleTrackEnded();
      };
      _audioElement.onerror = (e) => {
        console.warn('[QuranAudio] Playback error:', e);
        _isPlaying = false;
        notifyPlaybackState();
      };
    }
    return _audioElement;
  }

  function playAyah(surahNumber, ayahNumber, ayahList) {
    const audio = getAudioElement();
    const settings = getSettings();
    const qari = (window.QURAN_DATA && window.QURAN_DATA.RECITERS.find(q => q.id === settings.selectedQari)) || (window.QURAN_DATA && window.QURAN_DATA.RECITERS[0]);
    if (!qari) return;

    if (ayahList && Array.isArray(ayahList)) {
      _currentPlaylist = ayahList;
      _currentIndex = _currentPlaylist.findIndex(a => a.numberInSurah === ayahNumber);
      if (_currentIndex === -1) _currentIndex = 0;
    }

    const currentAyahObj = _currentPlaylist[_currentIndex] || { numberInSurah: ayahNumber };
    const url = qari.ayahUrl(surahNumber, currentAyahObj.numberInSurah);

    audio.src = url;
    audio.playbackRate = settings.playbackSpeed || 1.0;
    audio.play().catch(e => console.warn('[QuranAudio] play rejected:', e));

    window.Views.activePlayingSurah = surahNumber;
    window.Views.activePlayingAyah = currentAyahObj.numberInSurah;

    // Cinematic Auto-Scroll & Golden Aura Activation
    if (typeof document !== 'undefined') {
      document.querySelectorAll('.ayah-reciting-aura').forEach(el => el.classList.remove('ayah-reciting-aura'));
      const activeEl = document.getElementById(`ayah-container-${currentAyahObj.numberInSurah}`);
      if (activeEl) {
        activeEl.classList.add('ayah-reciting-aura');
        if (window.Motion && typeof window.Motion.autoScrollToElement === 'function') {
          window.Motion.autoScrollToElement(activeEl, 140);
        }
      }
    }

    notifyPlaybackState();
    updateMediaSession();
  }

  function pauseAudio() {
    if (_audioElement) {
      _audioElement.pause();
    }
  }

  function resumeAudio() {
    if (_audioElement) {
      _audioElement.play().catch(e => console.warn('[QuranAudio] resume rejected:', e));
    }
  }

  function toggleAudio() {
    if (_isPlaying) {
      pauseAudio();
    } else {
      resumeAudio();
    }
  }

  function nextAyah() {
    if (_currentPlaylist.length === 0) return;
    if (_currentIndex < _currentPlaylist.length - 1) {
      _currentIndex++;
      const surahNum = window.Views.activePlayingSurah || 1;
      const nextObj = _currentPlaylist[_currentIndex];
      playAyah(surahNum, nextObj.numberInSurah, _currentPlaylist);
    }
  }

  function prevAyah() {
    if (_currentPlaylist.length === 0) return;
    if (_currentIndex > 0) {
      _currentIndex--;
      const surahNum = window.Views.activePlayingSurah || 1;
      const prevObj = _currentPlaylist[_currentIndex];
      playAyah(surahNum, prevObj.numberInSurah, _currentPlaylist);
    }
  }

  function setPlaybackSpeed(speed) {
    saveSettings({ playbackSpeed: speed });
    if (_audioElement) {
      _audioElement.playbackRate = speed;
    }
    notifyPlaybackState();
  }

  function handleTrackEnded() {
    const settings = getSettings();
    if (settings.repeatMode === 'ayah') {
      const audio = getAudioElement();
      audio.currentTime = 0;
      audio.play().catch(e => {});
      return;
    }

    if (_currentIndex < _currentPlaylist.length - 1) {
      nextAyah();
    } else {
      // Surah finished
      if (settings.repeatMode === 'surah') {
        _currentIndex = 0;
        const surahNum = window.Views.activePlayingSurah || 1;
        playAyah(surahNum, 1, _currentPlaylist);
      } else {
        _isPlaying = false;
        notifyPlaybackState();
      }
    }
  }

  function updateMediaSession() {
    if ('mediaSession' in navigator && window.Views.activePlayingSurah) {
      const surahMeta = window.QURAN_DATA ? window.QURAN_DATA.SURAHS.find(s => s.number === window.Views.activePlayingSurah) : null;
      const qari = window.QURAN_DATA ? window.QURAN_DATA.RECITERS.find(q => q.id === getSettings().selectedQari) : null;

      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${surahMeta ? surahMeta.nameArabic : ''} — آية ${window.Views.activePlayingAyah || 1}`,
        artist: qari ? qari.name : 'LearnHub Quran',
        album: `القرآن الكريم — ${surahMeta ? surahMeta.nameUrdu : ''}`,
        artwork: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => resumeAudio());
      navigator.mediaSession.setActionHandler('pause', () => pauseAudio());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevAyah());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextAyah());
    }
  }

  function onPlaybackStateChange(cb) {
    _playbackCallbacks.push(cb);
  }

  function notifyPlaybackState() {
    const state = {
      isPlaying: _isPlaying,
      surahNumber: window.Views.activePlayingSurah,
      ayahNumber: window.Views.activePlayingAyah,
      speed: getSettings().playbackSpeed
    };
    _playbackCallbacks.forEach(cb => {
      try { cb(state); } catch(e) {}
    });
  }

  // --- 9. AYAH CARD IMAGE GENERATOR ---
  function generateAyahCard(arabicText, urduText, surahName, ayahNum) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');

      // Background Gradient
      const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
      grad.addColorStop(0, '#064e3b'); // Emerald deep
      grad.addColorStop(0.5, '#022c22');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1080);

      // Gold Ornamental Border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 8;
      ctx.strokeRect(40, 40, 1000, 1000);

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, 970, 970);

      // Top Bismillah
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 36px "Amiri", serif';
      ctx.textAlign = 'center';
      ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', 540, 130);

      // Surah & Ayah Badge
      ctx.fillStyle = '#10b981';
      ctx.fillRect(400, 170, 280, 45);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Noto Nastaliq Urdu", sans-serif';
      ctx.fillText(`${surahName} • آية ${ayahNum}`, 540, 202);

      // Arabic Ayah Text (Wrapped)
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px "Amiri", "Scheherazade New", serif';
      ctx.direction = 'rtl';
      wrapText(ctx, arabicText, 540, 320, 900, 65);

      // Urdu Translation Text (Wrapped)
      ctx.fillStyle = '#a7f3d0';
      ctx.font = '500 28px "Noto Nastaliq Urdu", sans-serif';
      wrapText(ctx, urduText, 540, 680, 880, 52);

      // LearnHub Watermark
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 22px sans-serif';
      ctx.direction = 'ltr';
      ctx.fillText('LearnHub — Islamic Learning Platform (learnhubplatform.com)', 540, 990);

      resolve(canvas.toDataURL('image/png'));
    });
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let curY = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, curY);
        line = words[n] + ' ';
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, curY);
  }

  return {
    getSettings,
    saveSettings,
    getSurahVerses,
    getBookmarks,
    addBookmark,
    removeBookmark,
    isAyahBookmarked,
    getNotes,
    saveNote,
    getNoteForAyah,
    deleteNote,
    saveLastRead,
    getLastRead,
    getReadingHistory,
    getDailyGoalData,
    setDailyGoalTarget,
    recordDailyGoalAyah,
    downloadSurah,
    getDownloadedSurahs,
    deleteDownloadedSurah,
    playAyah,
    pauseAudio,
    resumeAudio,
    toggleAudio,
    nextAyah,
    prevAyah,
    setPlaybackSpeed,
    onPlaybackStateChange,
    generateAyahCard
  };
})();

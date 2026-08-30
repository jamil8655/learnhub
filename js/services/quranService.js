/**
 * LearnHub Complete Quran Service & State Management Engine
 * Production-ready caching, offline IndexedDB storage, bookmarks, private notes,
 * reading history & streaks, audio player engine, downloads manager, and Juz loader.
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
    return new Promise((resolve) => {
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

  // Universal Bismillah stripper for Verse 1 of Surahs 2..114
  function stripLeadingBismillah(text, surahNum, ayahNum) {
    if (surahNum === 1 || surahNum === 9 || ayahNum !== 1 || !text) return text;
    return text.replace(/^[^s]+[s]+[^s]+[s]+[^s]+[s]+[^s]+s*/, function(match) {
      const raw = match.replace(/[ً-ٰٟۖ-ۭ]/g, '').replace(/[ٱإأآ]/g, 'ا');
      if (raw.includes('بسم') && raw.includes('الله') && raw.includes('الرحمن') && raw.includes('الرحيم')) {
        return '';
      }
      return match;
    }).trim();
  }

  // --- 1. SETTINGS & PREFERENCES ---
  const DEFAULT_SETTINGS = {
    arabicFontSize: 30,
    translationFontSize: 16,
    tafsirFontSize: 15,
    arabicFont: 'amiri',
    lineHeight: 'relaxed',
    viewMode: 'ayah_cards',
    showTranslation: true,
    selectedTranslation: 'ur_jalandhri',
    selectedTafsir: 'ahsanulbayan',
    selectedQari: 'alafasy',
    playbackSpeed: 1.0,
    repeatMode: 'off',
    repeatCount: 1,
    autoScroll: true,
    theme: 'system'
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

    // Live API fetch with clean Bismillah stripping
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
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
            if (num !== 1 && num !== 9 && a.numberInSurah === 1) {
              cleanText = stripLeadingBismillah(cleanText, num, 1);
            }
            return {
              number: a.number,
              numberInSurah: a.numberInSurah,
              surahNumber: num,
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

          // Save to IndexedDB
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
      console.warn('[QuranService] Live API fetch failed:', networkErr);
    }

    // Check Fallback Core Offline Verses
    if (window.QURAN_DATA && window.QURAN_DATA.CORE_OFFLINE_VERSES && window.QURAN_DATA.CORE_OFFLINE_VERSES[num]) {
      return window.QURAN_DATA.CORE_OFFLINE_VERSES[num];
    }

    // Secondary minimal placeholder
    const meta = (window.QURAN_DATA && window.QURAN_DATA.SURAHS.find(s => s.number === num)) || { ayahCount: 7 };
    const dummy = [];
    for (let i = 1; i <= meta.ayahCount; i++) {
      dummy.push({
        number: i,
        numberInSurah: i,
        surahNumber: num,
        juz: meta.juz || 1,
        page: meta.page || 1,
        text: `آية ${i} - ${meta.nameArabic || 'القرآن الكريم'}`,
        urdu: 'انٹرنیٹ کنکشن بحال ہونے پر مکمل آیت اور ترجمہ خودکار لوڈ ہو جائے گا۔',
        english: 'Verse content will load when network connection is restored.',
        tafsir: ''
      });
    }
    return dummy;
  }

  // --- 3. JUZ / PARA FETCHING & COMPILATION ---
  async function getJuzVerses(juzNumber) {
    const num = parseInt(juzNumber, 10);
    if (!num || num < 1 || num > 30) return [];

    // Check local storage cache
    try {
      const cached = localStorage.getItem(`learnhub_quran_juz_${num}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}

    // Live API fetch for entire Juz
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);
      const url = `https://api.alquran.cloud/v1/juz/${num}/editions/quran-uthmani,ur.jalandhry,en.sahih`;
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
            const sNum = a.surah ? a.surah.number : 1;
            const aNum = a.numberInSurah;
            if (sNum !== 1 && aNum === 1) {
              cleanText = stripLeadingBismillah(cleanText, sNum, aNum);
            }
            return {
              number: a.number,
              numberInSurah: a.numberInSurah,
              surahNumber: sNum,
              surahMeta: a.surah,
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

          try {
            localStorage.setItem(`learnhub_quran_juz_${num}`, JSON.stringify(combined));
          } catch(e) {}

          return combined;
        }
      }
    } catch(e) {
      console.warn('[QuranService] Live Juz fetch failed, synthesizing from surahs:', e);
    }

    // Fallback: build from surahs
    const juzMeta = window.QURAN_DATA && window.QURAN_DATA.JUZ_LIST.find(j => j.juz === num);
    if (juzMeta) {
      let allAyahs = [];
      for (let s = juzMeta.startSurah; s <= juzMeta.endSurah; s++) {
        const sAyahs = await getSurahVerses(s);
        const inJuz = sAyahs.filter(a => a.juz === num).map(a => Object.assign({}, a, { surahNumber: s }));
        allAyahs = allAyahs.concat(inJuz);
      }
      if (allAyahs.length > 0) return allAyahs;
    }

    return [];
  }

  // --- 4. BOOKMARKS MANAGEMENT ---
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
      category,
      note,
      timestamp: Date.now()
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

  // --- 5. PRIVATE NOTES MANAGEMENT ---
  function getNotes() {
    try {
      return JSON.parse(localStorage.getItem('learnhub_quran_notes') || '[]');
    } catch(e) {
      return [];
    }
  }

  function saveNote(surahNumber, ayahNumber, text) {
    const list = getNotes();
    const id = `note_${surahNumber}_${ayahNumber}`;
    const filtered = list.filter(n => n.id !== id);
    const surahMeta = window.QURAN_DATA ? window.QURAN_DATA.SURAHS.find(s => s.number === surahNumber) : null;

    const newNote = {
      id,
      surahNumber,
      ayahNumber,
      surahNameArabic: surahMeta ? surahMeta.nameArabic : `سورة ${surahNumber}`,
      surahNameUrdu: surahMeta ? surahMeta.nameUrdu : '',
      text,
      date: new Date().toLocaleDateString('ur-PK'),
      timestamp: Date.now()
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

  // --- 6. LAST READ POSITION & HISTORY ---
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

  // --- 7. DAILY GOAL & READING STREAK ---
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

  // --- 8. DOWNLOADS & OFFLINE STORAGE ---
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

  // --- 9. AUDIO PLAYER ENGINE ---
  let _audioElement = null;
  let _currentPlaylist = [];
  let _currentIndex = 0;
  let _isPlaying = false;

  function getAudioElement() {
    if (!_audioElement) {
      _audioElement = new Audio();
      _audioElement.preload = 'auto';

      _audioElement.onplay = () => {
        _isPlaying = true;
      };
      _audioElement.onpause = () => {
        _isPlaying = false;
      };
      _audioElement.onended = () => {
        handleTrackEnded();
      };
      _audioElement.onerror = (e) => {
        console.warn('[QuranAudio] Playback error:', e);
        _isPlaying = false;
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
      _currentIndex = _currentPlaylist.findIndex(a => (a.surahNumber === surahNumber || !a.surahNumber) && a.numberInSurah === ayahNumber);
      if (_currentIndex === -1) _currentIndex = 0;
    }

    const currentAyahObj = _currentPlaylist[_currentIndex] || { numberInSurah: ayahNumber, surahNumber };
    const effectiveSurah = currentAyahObj.surahNumber || surahNumber;
    const url = qari.ayahUrl(effectiveSurah, currentAyahObj.numberInSurah);

    audio.src = url;
    audio.playbackRate = settings.playbackSpeed || 1.0;
    audio.play().catch(e => console.warn('[QuranAudio] play rejected:', e));

    window.Views.activePlayingSurah = effectiveSurah;
    window.Views.activePlayingAyah = currentAyahObj.numberInSurah;

    // Highlight and smooth scroll to verse
    if (typeof document !== 'undefined') {
      const activeEl = document.getElementById(`ayah-container-${effectiveSurah}-${currentAyahObj.numberInSurah}`) || document.getElementById(`ayah-container-${currentAyahObj.numberInSurah}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  function pauseAudio() {
    if (_audioElement) _audioElement.pause();
  }

  function resumeAudio() {
    if (_audioElement) _audioElement.play().catch(e => {});
  }

  function handleTrackEnded() {
    if (_currentIndex < _currentPlaylist.length - 1) {
      _currentIndex++;
      const nextObj = _currentPlaylist[_currentIndex];
      const sNum = nextObj.surahNumber || window.Views.activePlayingSurah || 1;
      playAyah(sNum, nextObj.numberInSurah, _currentPlaylist);
    } else {
      _isPlaying = false;
    }
  }

  return {
    getSettings,
    saveSettings,
    stripLeadingBismillah,
    getSurahVerses,
    getJuzVerses,
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
    downloadSurah,
    getDownloadedSurahs,
    deleteDownloadedSurah,
    playAyah,
    pauseAudio,
    resumeAudio
  };
})();

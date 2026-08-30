/**
 * LearnHub Quran Service & Audio Engine
 * Supports 114 Surahs, 30 Juz, 8 Classical Reciters, Offline Caching,
 * Bookmarks & Real-Time Dual-Direction Sync.
 */

window.QuranService = (function() {
  const DB_NAME = 'learnhub_quran_db';
  const DB_VERSION = 2;
  const STORE_SURAHS = 'surahs_cache';

  const DEFAULT_SETTINGS = {
    selectedQari: 'alafasy',
    selectedTranslation: 'ur_jalandhry',
    fontSizeArabic: 30,
    fontSizeTranslation: 14,
    showTajweed: true,
    showWordByWord: false,
    autoScroll: true,
    audioRepeatMode: 'none',
    playbackSpeed: 1.0
  };

  let _dbPromise = null;
  let _audioElement = null;
  let _currentPlaylist = [];
  let _currentIndex = 0;
  let _isPlaying = false;

  function getDb() {
    if (!_dbPromise) {
      _dbPromise = new Promise((resolve) => {
        if (!window.indexedDB) return resolve(null);
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_SURAHS)) {
            db.createObjectStore(STORE_SURAHS, { keyPath: 'surahNumber' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      });
    }
    return _dbPromise;
  }

  function stripLeadingBismillah(text, surahNum, ayahNum) {
    if (surahNum === 1 || surahNum === 9 || ayahNum !== 1 || !text) return text;
    return text.replace(/^[^\s]+[\s]+[^\s]+[\s]+[^\s]+[\s]+[^\s]+\s*/, function(match) {
      const raw = match.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '').replace(/[\u0671\u0625\u0623\u0622]/g, 'ا');
      if (raw.includes('بسم') && raw.includes('الله') && raw.includes('الرحمن') && raw.includes('الرحيم')) {
        return '';
      }
      return match;
    }).trim();
  }

  function getSettings() {
    try {
      const saved = localStorage.getItem('learnhub_quran_settings');
      return saved ? Object.assign({}, DEFAULT_SETTINGS, JSON.parse(saved)) : DEFAULT_SETTINGS;
    } catch(e) {
      return DEFAULT_SETTINGS;
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

  async function getSurahVerses(surahNumber) {
    const num = parseInt(surahNumber, 10);
    if (!num || num < 1 || num > 114) return [];

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
    } catch (err) {}

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
    } catch (err) {}

    const offlineData = window.QURAN_DATA && window.QURAN_DATA.CORE_OFFLINE_VERSES && window.QURAN_DATA.CORE_OFFLINE_VERSES[num];
    if (offlineData) {
      return offlineData.map(a => Object.assign({}, a, { surahNumber: num }));
    }

    return [];
  }

  async function getJuzVerses(juzNumber) {
    const num = parseInt(juzNumber, 10);
    if (!num || num < 1 || num > 30) return [];

    try {
      const cached = localStorage.getItem(`learnhub_quran_juz_${num}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}

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
            const sNum = a.surah ? a.surah.number : (a.surahNumber || 1);
            if (sNum !== 1 && sNum !== 9 && a.numberInSurah === 1) {
              cleanText = stripLeadingBismillah(cleanText, sNum, 1);
            }
            return {
              number: a.number,
              numberInSurah: a.numberInSurah,
              surahNumber: sNum,
              surahMeta: a.surah ? { number: a.surah.number, nameArabic: a.surah.name, nameUrdu: a.surah.englishName, ayahCount: a.surah.numberOfAyahs, type: a.surah.revelationType } : null,
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
    } catch(e) {}

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

  // --- BOOKMARKS ---
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
    const filtered = list.filter(b => b.id !== id && b.id !== `bm_${id}`);
    localStorage.setItem('learnhub_quran_bookmarks', JSON.stringify(filtered));
    return filtered;
  }

  function isAyahBookmarked(surahNumber, ayahNumber) {
    const list = getBookmarks();
    return list.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
  }

  // --- PRIVATE NOTES ---
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

  // --- LAST READ ---
  function saveLastRead(surahNumber, ayahNumber, page, juz) {
    try {
      const data = { surahNumber, ayahNumber: ayahNumber || 1, page: page || 1, juz: juz || 1, timestamp: Date.now() };
      localStorage.setItem('learnhub_quran_last_read', JSON.stringify(data));
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

  // --- AUDIO ENGINE ---
  function getAudioElement() {
    if (!_audioElement) {
      _audioElement = new Audio();
      _audioElement.preload = 'auto';

      _audioElement.onplay = () => {
        _isPlaying = true;
        updateAudioUiState(true);
      };
      _audioElement.onpause = () => {
        _isPlaying = false;
        updateAudioUiState(false);
      };
      _audioElement.onended = () => {
        handleTrackEnded();
      };
      _audioElement.onerror = (e) => {
        console.warn('[QuranAudio] Playback error:', e);
        _isPlaying = false;
        updateAudioUiState(false);
      };
    }
    return _audioElement;
  }

  function isPlaying() {
    return _isPlaying && _audioElement && !_audioElement.paused;
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
    audio.play().catch(e => console.warn('[QuranAudio] play error:', e));

    window.Views.activePlayingSurah = effectiveSurah;
    window.Views.activePlayingAyah = currentAyahObj.numberInSurah;

    updateAudioUiState(true);

    if (typeof document !== 'undefined') {
      const activeEl = document.getElementById(`ayah-container-${effectiveSurah}-${currentAyahObj.numberInSurah}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  function pauseAudio() {
    if (_audioElement) {
      _audioElement.pause();
    }
    _isPlaying = false;
    window.Views.activePlayingSurah = null;
    window.Views.activePlayingAyah = null;
    updateAudioUiState(false);
  }

  function resumeAudio() {
    if (_audioElement) {
      _audioElement.play().catch(e => {});
    }
  }

  function handleTrackEnded() {
    if (_currentIndex < _currentPlaylist.length - 1) {
      _currentIndex++;
      const nextObj = _currentPlaylist[_currentIndex];
      const sNum = nextObj.surahNumber || window.Views.activePlayingSurah || 1;
      playAyah(sNum, nextObj.numberInSurah, _currentPlaylist);
    } else {
      _isPlaying = false;
      window.Views.activePlayingSurah = null;
      window.Views.activePlayingAyah = null;
      updateAudioUiState(false);
    }
  }

  function updateAudioUiState(isPlaying) {
    if (typeof document === 'undefined') return;
    
    document.querySelectorAll('.ayah-play-btn').forEach(btn => {
      const sNum = parseInt(btn.getAttribute('data-surah'), 10);
      const aNum = parseInt(btn.getAttribute('data-ayah'), 10);
      const isThisPlaying = isPlaying && window.Views.activePlayingSurah === sNum && window.Views.activePlayingAyah === aNum;

      if (isThisPlaying) {
        btn.className = 'ayah-play-btn py-1 px-2.5 rounded-xl bg-teal-800 text-amber-300 ring-1 ring-amber-400 font-black shadow-xs transition flex items-center gap-1 shrink-0';
        btn.innerHTML = '<i data-lucide="pause" class="w-3.5 h-3.5 text-amber-300 fill-amber-300"></i><span class="text-[11px]">روکیں</span>';
      } else {
        btn.className = 'ayah-play-btn py-1 px-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 hover:bg-teal-800 hover:text-white border border-teal-600/30 transition flex items-center gap-1 shrink-0';
        btn.innerHTML = '<i data-lucide="volume-2" class="w-3.5 h-3.5 text-teal-600 dark:text-teal-400"></i><span class="text-[11px]">تلاوت</span>';
      }
    });

    document.querySelectorAll('.ayah-row-box').forEach(box => {
      const sNum = parseInt(box.getAttribute('data-surah'), 10);
      const aNum = parseInt(box.getAttribute('data-ayah'), 10);
      const isThisPlaying = isPlaying && window.Views.activePlayingSurah === sNum && window.Views.activePlayingAyah === aNum;

      if (isThisPlaying) {
        box.classList.add('border-teal-600', 'bg-teal-50/70', 'dark:bg-teal-950/50', 'shadow-md', 'ring-2', 'ring-teal-500/50');
      } else {
        box.classList.remove('border-teal-600', 'bg-teal-50/70', 'dark:bg-teal-950/50', 'shadow-md', 'ring-2', 'ring-teal-500/50');
      }
    });

    if (window.lucide) window.lucide.createIcons();
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
    saveLastRead,
    getLastRead,
    playAyah,
    pauseAudio,
    resumeAudio,
    isPlaying
  };
})();

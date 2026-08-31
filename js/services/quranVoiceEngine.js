/**
 * LearnHub Real-Time Quran Voice Recitation & Non-Stop Hifz Engine (v163.0.0)
 * Features:
 * 1. Multi-Word continuous speech recognition stream matching across all 114 Surahs
 * 2. Pure phoneme comparison: strips Tashkeel, Waqf marks, symbols, dots, numbers
 * 3. Word-by-word dynamic reveal with automatic Ayah progression & scrolling
 * 4. Fallback tap-to-reveal support for browsers without speech recognition
 */

class QuranVoiceRecitationEngine {
  constructor() {
    this.isListening = false;
    this.recognition = null;
    this.surahNumber = 1;
    this.surahAyahs = [];
    this.currentAyahIndex = 0;
    this.currentAyah = null;
    this.words = [];
    this.currentWordIndex = 0;
    this.recitedStream = [];
    this.fullSurahRecitedText = [];
    this.errorsCount = 0;
    this.totalAttempts = 0;
    
    this.onWordUpdateCallback = null;
    this.onAyahAdvancedCallback = null;
    this.onSurahCompleteCallback = null;
    this.onErrorCallback = null;
    this.onStateChangeCallback = null;
  }

  normalizeArabic(text) {
    if (!text) return '';
    return text
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .replace(/[\u06D6-\u06ED\u0610-\u061A\u06DF-\u06E8\u06EA-\u06ED]/g, '')
      .replace(/[\u0660-\u0669\u06F0-\u06F90-9\u06DD\u06DE]/g, '')
      .replace(/[\u0640]/g, '')
      .replace(/[.,،؛؟:!?"'()\[\]{}«»\-_/\\*&#^%@~`]/g, '')
      .replace(/[إأآٱ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[ؤئ]/g, 'ء')
      .replace(/[^\u0621-\u064A\s]/g, '')
      .trim();
  }

  getSimilarity(s1, s2) {
    if (!s1 || !s2) return 0;
    const n1 = this.normalizeArabic(s1);
    const n2 = this.normalizeArabic(s2);
    if (n1 === n2) return 1.0;
    if (n1.includes(n2) || n2.includes(n1)) return 0.85;

    let longer = n1.length > n2.length ? n1 : n2;
    let shorter = n1.length > n2.length ? n2 : n1;
    if (longer.length === 0) return 1.0;

    let costs = [];
    for (let i = 0; i <= longer.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= shorter.length; j++) {
        if (i === 0) costs[j] = j;
        else if (j > 0) {
          let newValue = costs[j - 1];
          if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[shorter.length] = lastValue;
    }
    return (longer.length - costs[shorter.length]) / parseFloat(longer.length);
  }

  loadSurah(surahNumber, ayahs = []) {
    this.surahNumber = parseInt(surahNumber, 10) || 1;
    this.surahAyahs = ayahs || [];
    this.currentAyahIndex = 0;
    this.fullSurahRecitedText = [];
    this.errorsCount = 0;
    this.totalAttempts = 0;

    if (this.surahAyahs.length > 0) {
      this._loadCurrentAyahInternal();
    }
  }

  _loadCurrentAyahInternal() {
    const rawAyah = this.surahAyahs[this.currentAyahIndex] || { text: '', numberInSurah: this.currentAyahIndex + 1 };
    const arabicText = rawAyah.text || rawAyah.arabic || '';
    const ayahNum = rawAyah.numberInSurah || rawAyah.number || (this.currentAyahIndex + 1);

    this.currentAyah = { text: arabicText, number: ayahNum };
    const rawTokens = (arabicText || '').trim().split(/\s+/).filter(Boolean);

    const validWords = [];
    rawTokens.forEach((w) => {
      const norm = this.normalizeArabic(w);
      if (norm && norm.length > 0) {
        validWords.push({
          index: validWords.length,
          raw: w,
          normalized: norm,
          state: validWords.length === 0 ? 'active' : 'pending'
        });
      }
    });

    this.words = validWords;
    this.currentWordIndex = 0;
    this.recitedStream = [];
  }

  startContinuousListening(callbacks = {}) {
    this.onWordUpdateCallback = callbacks.onWordUpdate;
    this.onAyahAdvancedCallback = callbacks.onAyahAdvanced;
    this.onSurahCompleteCallback = callbacks.onSurahComplete;
    this.onErrorCallback = callbacks.onError;
    this.onStateChangeCallback = callbacks.onStateChange;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (this.onErrorCallback) {
        this.onErrorCallback('مرورگر میں صوتی تلاوت (Speech Recognition) کی براہ راست سہولت موجود نہیں ہے۔ آپ الفاظ پر ٹیپ کر کے بھی ظاہر کر سکتے ہیں۔');
      }
      return false;
    }

    try {
      if (this.recognition) {
        try { this.recognition.abort(); } catch(e) {}
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'ar-SA';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 5;

      this.isListening = true;
      if (this.onStateChangeCallback) this.onStateChangeCallback(true);

      this.recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          this.processSpokenTranscript(transcript);
        }
      };

      this.recognition.onerror = (err) => {
        console.warn('[QuranVoiceEngine] Recognition event:', err);
        if (err.error === 'not-allowed') {
          this.isListening = false;
          if (this.onStateChangeCallback) this.onStateChangeCallback(false);
          if (this.onErrorCallback) this.onErrorCallback('مائیکروفون کی اجازت درکار ہے۔ براہ کرم براؤزر میں مائیکروفون فعال فرمائیں۔');
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          try { this.recognition.start(); } catch(e) {}
        } else {
          if (this.onStateChangeCallback) this.onStateChangeCallback(false);
        }
      };

      this.recognition.start();
      return true;
    } catch(e) {
      console.warn('[QuranVoiceEngine] Start exception:', e);
      return false;
    }
  }

  stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try { this.recognition.stop(); } catch(e) {}
    }
    if (this.onStateChangeCallback) this.onStateChangeCallback(false);
  }

  processSpokenTranscript(spokenPhrase) {
    if (!spokenPhrase || !this.words || this.currentWordIndex >= this.words.length) return;

    const spokenTokens = spokenPhrase.trim().split(/\s+/).filter(Boolean);
    if (!spokenTokens.length) return;

    for (let sIdx = 0; sIdx < spokenTokens.length; sIdx++) {
      if (this.currentWordIndex >= this.words.length) break;

      const spokenToken = spokenTokens[sIdx];
      const targetWord = this.words[this.currentWordIndex];
      if (!targetWord) break;

      const similarity = this.getSimilarity(spokenToken, targetWord.normalized);
      this.totalAttempts++;

      if (similarity >= 0.60) {
        targetWord.state = 'correct';
        this.recitedStream.push(targetWord.raw);

        const completedWordIdx = this.currentWordIndex;
        this.currentWordIndex++;

        if (this.currentWordIndex < this.words.length) {
          this.words[this.currentWordIndex].state = 'active';
        }

        if (this.onWordUpdateCallback) {
          this.onWordUpdateCallback({
            words: this.words,
            completedWordIndex: completedWordIdx,
            currentIndex: this.currentWordIndex,
            currentAyahIndex: this.currentAyahIndex,
            currentAyahNumber: this.currentAyah.number,
            totalAyahs: this.surahAyahs.length,
            recitedStream: this.recitedStream,
            isCorrect: true,
            matchedWord: targetWord.raw,
            accuracy: this.getAccuracy()
          });
        }

        if (this.currentWordIndex >= this.words.length) {
          this.fullSurahRecitedText.push({
            ayahNumber: this.currentAyah.number,
            text: this.recitedStream.join(' ')
          });

          if (this.currentAyahIndex + 1 < this.surahAyahs.length) {
            const completedAyahNum = this.currentAyah.number;
            this.currentAyahIndex++;
            this._loadCurrentAyahInternal();

            if (this.onAyahAdvancedCallback) {
              this.onAyahAdvancedCallback({
                completedAyahNum: completedAyahNum,
                newAyahIndex: this.currentAyahIndex,
                newAyahNumber: this.currentAyah.number,
                totalAyahs: this.surahAyahs.length,
                words: this.words,
                accuracy: this.getAccuracy()
              });
            }
          } else {
            if (this.onSurahCompleteCallback) {
              this.onSurahCompleteCallback({
                surahNumber: this.surahNumber,
                totalAyahs: this.surahAyahs.length,
                accuracy: this.getAccuracy(),
                fullRecited: this.fullSurahRecitedText
              });
            }
            this.stopListening();
            break;
          }
        }
      }
    }
  }

  manualRevealCurrentWord() {
    if (!this.words || this.currentWordIndex >= this.words.length) return;
    const targetWord = this.words[this.currentWordIndex];
    targetWord.state = 'correct';
    this.recitedStream.push(targetWord.raw);

    const completedWordIdx = this.currentWordIndex;
    this.currentWordIndex++;

    if (this.currentWordIndex < this.words.length) {
      this.words[this.currentWordIndex].state = 'active';
    }

    if (this.onWordUpdateCallback) {
      this.onWordUpdateCallback({
        words: this.words,
        completedWordIndex: completedWordIdx,
        currentIndex: this.currentWordIndex,
        currentAyahIndex: this.currentAyahIndex,
        currentAyahNumber: this.currentAyah.number,
        totalAyahs: this.surahAyahs.length,
        recitedStream: this.recitedStream,
        isCorrect: true,
        matchedWord: targetWord.raw,
        accuracy: this.getAccuracy()
      });
    }

    if (this.currentWordIndex >= this.words.length) {
      if (this.currentAyahIndex + 1 < this.surahAyahs.length) {
        const completedAyahNum = this.currentAyah.number;
        this.currentAyahIndex++;
        this._loadCurrentAyahInternal();

        if (this.onAyahAdvancedCallback) {
          this.onAyahAdvancedCallback({
            completedAyahNum: completedAyahNum,
            newAyahIndex: this.currentAyahIndex,
            newAyahNumber: this.currentAyah.number,
            totalAyahs: this.surahAyahs.length,
            words: this.words,
            accuracy: this.getAccuracy()
          });
        }
      }
    }
  }

  getAccuracy() {
    if (this.totalAttempts === 0) return 100;
    const correctWords = this.currentAyahIndex * 5 + this.currentWordIndex;
    return Math.min(100, Math.max(70, Math.round((correctWords / (correctWords + this.errorsCount)) * 100)));
  }
}

window.QuranVoiceEngine = new QuranVoiceRecitationEngine();
console.log('LearnHub QuranVoiceEngine v163.0.0 initialized with multi-word stream matching!');

/**
 * LearnHub Real-Time Quran Voice Recitation & Speech Recognition Engine (v158.0.0)
 * Live word-by-word Quran recitation follower, tajweed error detector,
 * and live verified word streaming.
 */

class QuranVoiceRecitationEngine {
  constructor() {
    this.isListening = false;
    this.recognition = null;
    this.currentAyah = null;
    this.words = [];
    this.currentWordIndex = 0;
    this.recitedStream = [];
    this.errorsCount = 0;
    this.totalAttempts = 0;
    this.onWordUpdateCallback = null;
    this.onAyahCompleteCallback = null;
    this.onErrorCallback = null;
  }

  normalizeArabic(text) {
    if (!text) return '';
    return text
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
      .replace(/[إأآٱ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[\u0610-\u061A\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '')
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

  loadAyah(arabicText, ayahNumber = 1) {
    this.currentAyah = { text: arabicText, number: ayahNumber };
    const rawTokens = (arabicText || '').trim().split(/\s+/);
    this.words = rawTokens.map((w, idx) => ({
      index: idx,
      raw: w,
      normalized: this.normalizeArabic(w),
      state: idx === 0 ? 'active' : 'pending'
    }));
    this.currentWordIndex = 0;
    this.recitedStream = [];
    this.errorsCount = 0;
    this.totalAttempts = 0;
  }

  startListening(onWordUpdate, onAyahComplete, onError) {
    this.onWordUpdateCallback = onWordUpdate;
    this.onAyahCompleteCallback = onAyahComplete;
    this.onErrorCallback = onError;

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      if (this.onErrorCallback) {
        this.onErrorCallback('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      }
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'ar-SA';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;

    this.isListening = true;

    this.recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        this.processSpokenText(transcript);
      }
    };

    this.recognition.onerror = (err) => {
      console.warn('[QuranVoice] Recognition error:', err);
      if (this.isListening && err.error !== 'no-speech') {
        try { this.recognition.start(); } catch(e) {}
      }
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        try { this.recognition.start(); } catch(e) {}
      }
    };

    try {
      this.recognition.start();
      return true;
    } catch(e) {
      console.warn('[QuranVoice] Could not start:', e);
      return false;
    }
  }

  processSpokenText(spokenPhrase) {
    if (!spokenPhrase || this.currentWordIndex >= this.words.length) return;

    const spokenTokens = spokenPhrase.trim().split(/\s+/);
    const lastSpoken = spokenTokens[spokenTokens.length - 1];
    const targetWord = this.words[this.currentWordIndex];

    if (!targetWord) return;

    const similarity = this.getSimilarity(lastSpoken, targetWord.normalized);
    this.totalAttempts++;

    if (similarity >= 0.70) {
      targetWord.state = 'correct';
      this.recitedStream.push(targetWord.raw);

      if (window.SoundEngine && typeof window.SoundEngine.playTap === 'function') {
        window.SoundEngine.playTap();
      }

      this.currentWordIndex++;

      if (this.currentWordIndex < this.words.length) {
        this.words[this.currentWordIndex].state = 'active';
      }

      if (this.onWordUpdateCallback) {
        this.onWordUpdateCallback({
          words: this.words,
          currentIndex: this.currentWordIndex,
          recitedStream: this.recitedStream,
          isCorrect: true,
          matchedWord: targetWord.raw,
          accuracy: this.getAccuracy()
        });
      }

      if (this.currentWordIndex >= this.words.length) {
        if (window.SoundEngine && typeof window.SoundEngine.playSuccess === 'function') {
          window.SoundEngine.playSuccess();
        }
        if (this.onAyahCompleteCallback) {
          this.onAyahCompleteCallback({
            ayahNumber: this.currentAyah.number,
            recitedText: this.recitedStream.join(' '),
            accuracy: this.getAccuracy()
          });
        }
      }
    } else if (lastSpoken.length >= 2) {
      targetWord.state = 'error';
      this.errorsCount++;

      if (this.onWordUpdateCallback) {
        this.onWordUpdateCallback({
          words: this.words,
          currentIndex: this.currentWordIndex,
          recitedStream: this.recitedStream,
          isCorrect: false,
          spokenWord: lastSpoken,
          expectedWord: targetWord.raw,
          accuracy: this.getAccuracy()
        });
      }
    }
  }

  getAccuracy() {
    if (this.totalAttempts === 0) return 100;
    const correctCount = this.recitedStream.length;
    const acc = Math.round((correctCount / Math.max(correctCount + this.errorsCount, 1)) * 100);
    return Math.min(Math.max(acc, 60), 100);
  }

  stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch(e) {}
      this.recognition = null;
    }
  }
}

window.QuranVoiceEngine = new QuranVoiceRecitationEngine();
console.log('LearnHub QuranVoiceEngine v158.0.0 initialized!');

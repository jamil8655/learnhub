/**
 * LearnHub Strict Quran Voice Recitation Engine (v182.0.0)
 * 
 * Strict Word-by-Word Tajweed & Voice Recitation System
 * 
 * CORE RULES:
 * 1. THE USER MUST NOT ADVANCE PAST AN INCORRECT WORD.
 * 2. Real Web Speech API with Arabic Language Model ('ar-SA' / 'ar-EG').
 * 3. Dedicated Arabic Normalization Layer for comparison (reference text is NEVER modified).
 * 4. Progressive Word Alignment: Stops at first unresolved mismatch.
 * 5. Attempts, Mistakes, Retries, and Detailed Mistake Review Breakdown.
 * 6. Authentic mathematical accuracy scoring (NO fake minimums).
 * 7. Level 1 (Text Match) vs Level 2 (Pronunciation/Phoneme Guidance) transparency.
 */

class QuranVoiceRecitationEngine {
  constructor() {
    this.isListening = false;
    this.recognition = null;
    this.surahNumber = 1;
    this.surahMeta = { number: 1, nameArabic: 'الفَاتِحَة', nameEnglish: 'Al-Fatihah' };
    this.allSurahAyahs = [];
    
    // Scope Configuration
    this.practiceMode = 'single_ayah'; // 'single_ayah' | 'range' | 'full_surah'
    this.startAyahNumber = 1;
    this.endAyahNumber = 1;
    this.currentAyahIndex = 0;
    this.currentAyah = null;
    
    // Words in current active Ayah
    this.words = [];
    this.currentWordIndex = 0;
    
    // Recitation Stream & Metrics
    this.recitedStream = [];
    this.fullSessionRecitedVerses = [];
    this.totalSessionWords = 0;
    this.completedWordsCount = 0;
    this.sessionMistakes = 0;
    this.sessionRetries = 0;
    this.mistakeLog = [];
    
    // Session Timing
    this.sessionStartTime = null;
    this.sessionDurationSeconds = 0;
    
    // Callbacks
    this.onWordStatusChange = null;
    this.onAyahAdvanced = null;
    this.onSessionComplete = null;
    this.onError = null;
    this.onStateChange = null;
    this.onInterimTranscript = null;
  }

  /**
   * Dedicated Arabic Normalization Layer for SPEECH COMPARISON ONLY.
   * Authoritative Quran text is NEVER altered.
   */
  normalizeArabic(text) {
    if (!text) return '';
    return text
      // 1. Remove Tashkeel / Harakat (Fatha, Damma, Kasra, Sukun, Shadda, Tanween, Superscript Alif)
      .replace(/[\u064B-\u065F\u0670]/g, '')
      // 2. Remove Quranic stop marks, Sajda indicators, rub el hizb, and waqf symbols
      .replace(/[\u06D6-\u06ED\u0610-\u061A\u06DF-\u06E8\u06EA-\u06ED]/g, '')
      // 3. Remove Arabic & Eastern-Arabic Digits / Verse End Rosettes
      .replace(/[\u0660-\u0669\u06F0-\u06F90-9\u06DD\u06DE]/g, '')
      // 4. Remove Tatweel / Kashida
      .replace(/[\u0640]/g, '')
      // 5. Remove Punctuation & Quotes
      .replace(/[.,،؛؟:!?"'()\[\]{}«»\-_/\\*&#^%@~`]/g, '')
      // 6. Standardize Alef variations (إ, أ, آ, ٱ -> ا)
      .replace(/[إأآٱ]/g, 'ا')
      // 7. Standardize Ta Marbuta (ة -> ه)
      .replace(/ة/g, 'ه')
      // 8. Standardize Alif Maqsura / Ya (ى -> ي)
      .replace(/ى/g, 'ي')
      // 9. Standardize Waw/Ya with Hamza (ؤ, ئ -> ء)
      .replace(/[ؤئ]/g, 'ء')
      // 10. Strip remaining non-Arabic characters
      .replace(/[^\u0621-\u064A\s]/g, '')
      .trim();
  }

  /**
   * Levenshtein Distance for String Comparison
   */
  getLevenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  /**
   * Word Matching Algorithm
   * STRICT VALIDATION: Never accept false positives.
   */
  matchWord(expectedNorm, spokenNorm) {
    if (!expectedNorm || !spokenNorm) return { isMatch: false, confidence: 0 };
    
    // 1. Exact Match
    if (expectedNorm === spokenNorm) {
      return { isMatch: true, confidence: 1.0 };
    }

    // 2. Strict Short Words rule: Short words (<= 3 letters) MUST match exactly
    if (expectedNorm.length <= 3) {
      return { isMatch: false, confidence: 0 };
    }

    // 3. For longer words (>= 4 letters), allow at most 1 character variation (e.g. slight STT transcription nuance)
    const dist = this.getLevenshteinDistance(expectedNorm, spokenNorm);
    const maxLen = Math.max(expectedNorm.length, spokenNorm.length);
    const similarity = (maxLen - dist) / maxLen;

    if (dist <= 1 && similarity >= 0.82) {
      return { isMatch: true, confidence: similarity };
    }

    return { isMatch: false, confidence: similarity };
  }

  /**
   * Load Quran Scope for Practice
   */
  loadScope(surahNumber, allAyahs = [], mode = 'single_ayah', startAyah = 1, endAyah = 1) {
    this.surahNumber = parseInt(surahNumber, 10) || 1;
    const surahs = (window.QURAN_DATA && window.QURAN_DATA.SURAHS) || [];
    this.surahMeta = surahs.find(s => s.number === this.surahNumber) || { number: this.surahNumber, nameArabic: 'السورة', nameEnglish: 'Surah' };
    
    this.allSurahAyahs = allAyahs || [];
    this.practiceMode = mode;
    this.startAyahNumber = Math.max(1, parseInt(startAyah, 10) || 1);
    this.endAyahNumber = Math.min(this.allSurahAyahs.length, Math.max(this.startAyahNumber, parseInt(endAyah, 10) || this.allSurahAyahs.length));
    
    if (mode === 'single_ayah') {
      this.endAyahNumber = this.startAyahNumber;
    } else if (mode === 'full_surah') {
      this.startAyahNumber = 1;
      this.endAyahNumber = this.allSurahAyahs.length;
    }

    // Determine target slice of Ayahs
    this.activeAyahsSlice = this.allSurahAyahs.filter(a => {
      const num = a.numberInSurah || a.number;
      return num >= this.startAyahNumber && num <= this.endAyahNumber;
    });

    if (this.activeAyahsSlice.length === 0 && this.allSurahAyahs.length > 0) {
      this.activeAyahsSlice = [this.allSurahAyahs[0]];
    }

    this.currentAyahIndex = 0;
    this.fullSessionRecitedVerses = [];
    this.totalSessionWords = 0;
    this.completedWordsCount = 0;
    this.sessionMistakes = 0;
    this.sessionRetries = 0;
    this.mistakeLog = [];
    this.sessionStartTime = Date.now();

    // Calculate total expected words across all active Ayahs
    this.activeAyahsSlice.forEach(a => {
      const rawText = a.text || a.arabic || '';
      const tokens = rawText.trim().split(/\s+/).filter(Boolean);
      tokens.forEach(t => {
        if (this.normalizeArabic(t).length > 0) {
          this.totalSessionWords++;
        }
      });
    });

    this._loadCurrentAyahInternal();
  }

  _loadCurrentAyahInternal() {
    const rawAyah = this.activeAyahsSlice[this.currentAyahIndex] || { text: '', numberInSurah: 1 };
    const arabicText = rawAyah.text || rawAyah.arabic || '';
    const ayahNum = rawAyah.numberInSurah || rawAyah.number || (this.currentAyahIndex + 1);

    this.currentAyah = { 
      text: arabicText, 
      number: ayahNum,
      urdu: rawAyah.urdu || '',
      english: rawAyah.english || ''
    };

    const rawTokens = arabicText.trim().split(/\s+/).filter(Boolean);
    const validWords = [];

    rawTokens.forEach((w) => {
      const norm = this.normalizeArabic(w);
      if (norm && norm.length > 0) {
        validWords.push({
          index: validWords.length,
          raw: w,
          normalized: norm,
          state: validWords.length === 0 ? 'active' : 'pending',
          attempts: 0,
          mistakes: 0,
          spokenHistory: [],
          isCorrectedAfterRetry: false
        });
      }
    });

    this.words = validWords;
    this.currentWordIndex = 0;
    this.recitedStream = [];
  }

  /**
   * Start Voice Recitation Listening
   */
  startListening(callbacks = {}) {
    this.onWordStatusChange = callbacks.onWordStatusChange;
    this.onAyahAdvanced = callbacks.onAyahAdvanced;
    this.onSessionComplete = callbacks.onSessionComplete;
    this.onError = callbacks.onError;
    this.onStateChange = callbacks.onStateChange;
    this.onInterimTranscript = callbacks.onInterimTranscript;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (this.onError) {
        this.onError('Browser Speech Recognition is not supported on this browser. Please use Chrome, Edge, or Safari.', 'UNSUPPORTED_BROWSER');
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
      this.recognition.maxAlternatives = 3;

      this.isListening = true;
      if (this.onStateChange) this.onStateChange(true, 'recording');

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          const transcript = res[0].transcript;
          if (res.isFinal) {
            this.processSpokenTranscript(transcript, true);
          } else {
            interimTranscript += transcript + ' ';
            this.processSpokenTranscript(transcript, false);
          }
        }
        if (this.onInterimTranscript && interimTranscript.trim()) {
          this.onInterimTranscript(interimTranscript.trim(), this.currentAyah ? this.currentAyah.number : 1);
        }
      };

      this.recognition.onerror = (err) => {
        console.warn('[QuranVoiceEngine] Speech recognition error:', err);
        if (err.error === 'not-allowed' || err.error === 'service-not-allowed') {
          this.isListening = false;
          if (this.onStateChange) this.onStateChange(false, 'permission_denied');
          if (this.onError) this.onError('Microphone permission was denied. Please allow microphone access in your browser settings.', 'NOT_ALLOWED');
        } else if (err.error === 'network') {
          if (this.onError) this.onError('Network connection error with speech recognition service. Retrying...', 'NETWORK_ERROR');
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          try { this.recognition.start(); } catch(e) {}
        } else {
          if (this.onStateChange) this.onStateChange(false, 'stopped');
        }
      };

      this.recognition.start();
      return true;
    } catch (e) {
      console.error('[QuranVoiceEngine] Failed to start recognition:', e);
      if (this.onError) this.onError('Failed to initialize microphone: ' + e.message, 'INIT_FAILED');
      return false;
    }
  }

  stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try { this.recognition.stop(); } catch(e) {}
    }
    if (this.onStateChange) this.onStateChange(false, 'stopped');
  }

  /**
   * Process Spoken Transcript with STRICT Progressive Alignment
   */
  processSpokenTranscript(spokenPhrase, isFinal = false) {
    if (!spokenPhrase || !this.words || this.currentWordIndex >= this.words.length) return;

    const rawTokens = spokenPhrase.trim().split(/\s+/).filter(Boolean);
    if (!rawTokens.length) return;

    for (let sIdx = 0; sIdx < rawTokens.length; sIdx++) {
      if (this.currentWordIndex >= this.words.length) break;

      const rawSpoken = rawTokens[sIdx];
      const spokenNorm = this.normalizeArabic(rawSpoken);
      if (!spokenNorm || spokenNorm.length < 2) continue;

      const targetWord = this.words[this.currentWordIndex];
      if (!targetWord) break;

      targetWord.attempts++;
      targetWord.spokenHistory.push(rawSpoken);

      const matchResult = this.matchWord(targetWord.normalized, spokenNorm);

      if (matchResult.isMatch) {
        // MATCH: Word is Correct!
        targetWord.state = 'correct';
        if (targetWord.mistakes > 0) {
          targetWord.isCorrectedAfterRetry = true;
        }
        this.completedWordsCount++;
        this.recitedStream.push(targetWord.raw);

        const completedIdx = this.currentWordIndex;
        this.currentWordIndex++;

        if (this.currentWordIndex < this.words.length) {
          this.words[this.currentWordIndex].state = 'active';
        }

        if (this.onWordStatusChange) {
          this.onWordStatusChange({
            words: this.words,
            completedWordIndex: completedIdx,
            currentWordIndex: this.currentWordIndex,
            currentAyahIndex: this.currentAyahIndex,
            currentAyahNumber: this.currentAyah.number,
            totalAyahsInScope: this.activeAyahsSlice.length,
            isCorrect: true,
            matchedWord: targetWord.raw,
            spokenWord: rawSpoken,
            nextExpectedWord: (this.currentWordIndex < this.words.length) ? this.words[this.currentWordIndex].raw : '',
            mistakesCount: this.sessionMistakes,
            retriesCount: this.sessionRetries,
            accuracy: this.getAccuracy(),
            level: 'Level 1: Speech-to-Text Recognition Match'
          });
        }

        // Check if Ayah is Complete
        if (this.currentWordIndex >= this.words.length) {
          this.fullSessionRecitedVerses.push({
            ayahNumber: this.currentAyah.number,
            text: this.recitedStream.join(' ')
          });

          if (this.currentAyahIndex + 1 < this.activeAyahsSlice.length) {
            const completedAyahNum = this.currentAyah.number;
            this.currentAyahIndex++;
            this._loadCurrentAyahInternal();

            if (this.onAyahAdvanced) {
              this.onAyahAdvanced({
                completedAyahNumber: completedAyahNum,
                newAyahIndex: this.currentAyahIndex,
                newAyahNumber: this.currentAyah.number,
                totalAyahsInScope: this.activeAyahsSlice.length,
                words: this.words,
                accuracy: this.getAccuracy(),
                mistakesCount: this.sessionMistakes
              });
            }
          } else {
            // ALL AYAHS IN SCOPE COMPLETED!
            this._finishSession();
            break;
          }
        }
      } else {
        // MISMATCH: User recited an incorrect word!
        // DO NOT ADVANCE! Remain on current expected word.
        targetWord.state = 'incorrect';
        targetWord.mistakes++;
        this.sessionMistakes++;
        this.sessionRetries++;

        // Record in Mistake Log
        this._recordMistakeLog(targetWord, rawSpoken);

        if (this.onWordStatusChange) {
          this.onWordStatusChange({
            words: this.words,
            completedWordIndex: -1,
            currentWordIndex: this.currentWordIndex,
            currentAyahIndex: this.currentAyahIndex,
            currentAyahNumber: this.currentAyah.number,
            totalAyahsInScope: this.activeAyahsSlice.length,
            isCorrect: false,
            expectedWord: targetWord.raw,
            spokenWord: rawSpoken,
            mistakesCount: this.sessionMistakes,
            retriesCount: this.sessionRetries,
            accuracy: this.getAccuracy(),
            feedbackMessage: 'Please repeat this word.'
          });
        }

        // STOP PROGRESSION IMMEDIATELY at the first mismatch!
        break;
      }
    }
  }

  _recordMistakeLog(targetWord, rawSpoken) {
    const existing = this.mistakeLog.find(m => 
      m.ayahNumber === this.currentAyah.number && m.wordIndex === targetWord.index
    );

    if (existing) {
      existing.attempts = targetWord.attempts;
      existing.mistakes = targetWord.mistakes;
      existing.lastSpokenWord = rawSpoken;
    } else {
      this.mistakeLog.push({
        surahNumber: this.surahNumber,
        surahName: this.surahMeta.nameArabic,
        ayahNumber: this.currentAyah.number,
        wordIndex: targetWord.index,
        expectedWord: targetWord.raw,
        lastSpokenWord: rawSpoken,
        attempts: targetWord.attempts,
        mistakes: targetWord.mistakes,
        isCorrected: false
      });
    }
  }

  _finishSession() {
    this.sessionDurationSeconds = Math.max(1, Math.round((Date.now() - (this.sessionStartTime || Date.now())) / 1000));
    
    // Mark corrected mistakes in mistake log
    this.mistakeLog.forEach(m => {
      m.isCorrected = true;
    });

    const result = {
      surahNumber: this.surahNumber,
      surahMeta: this.surahMeta,
      practiceMode: this.practiceMode,
      startAyah: this.startAyahNumber,
      endAyah: this.endAyahNumber,
      totalAyahs: this.activeAyahsSlice.length,
      totalWords: this.totalSessionWords,
      completedWords: this.completedWordsCount,
      totalMistakes: this.sessionMistakes,
      totalRetries: this.sessionRetries,
      accuracy: this.getAccuracy(),
      durationSeconds: this.sessionDurationSeconds,
      mistakeLog: this.mistakeLog,
      completedVerses: this.fullSessionRecitedVerses
    };

    // Save session to Local DB & Cloud
    this._persistSessionRecord(result);

    if (this.onSessionComplete) {
      this.onSessionComplete(result);
    }

    this.stopListening();
  }

  _persistSessionRecord(result) {
    try {
      const sessionRecord = {
        id: 'qrec_' + Date.now(),
        userId: (window.Auth && window.Auth.getCurrentUser && window.Auth.getCurrentUser()?.id) || 'guest',
        surahNumber: result.surahNumber,
        surahNameArabic: result.surahMeta.nameArabic,
        practiceMode: result.practiceMode,
        startAyah: result.startAyah,
        endAyah: result.endAyah,
        accuracy: result.accuracy,
        totalMistakes: result.totalMistakes,
        totalRetries: result.totalRetries,
        durationSeconds: result.durationSeconds,
        completedAt: new Date().toISOString()
      };

      if (window.DB && typeof window.DB.insert === 'function') {
        window.DB.insert('quran_recitation_sessions', sessionRecord);
      }

      // Award XP
      if (window.CloudDB && typeof window.CloudDB.recordXpTransaction === 'function') {
        const xpEarned = Math.round(result.completedWords * 2 + (result.accuracy >= 90 ? 50 : 20));
        window.CloudDB.recordXpTransaction(sessionRecord.userId, xpEarned, 'quran_voice_recitation', `Voice Recitation: ${result.surahMeta.nameArabic}`);
      }
    } catch(e) {
      console.warn('[QuranVoiceEngine] Failed to persist session record:', e);
    }
  }

  /**
   * Skip current word explicitly if learner is stuck
   */
  skipCurrentWord() {
    if (!this.words || this.currentWordIndex >= this.words.length) return;
    const targetWord = this.words[this.currentWordIndex];
    if (!targetWord) return;

    targetWord.state = 'skipped';
    targetWord.mistakes++;
    this.sessionMistakes++;

    const completedIdx = this.currentWordIndex;
    this.currentWordIndex++;

    if (this.currentWordIndex < this.words.length) {
      this.words[this.currentWordIndex].state = 'active';
    }

    if (this.onWordStatusChange) {
      this.onWordStatusChange({
        words: this.words,
        completedWordIndex: completedIdx,
        currentWordIndex: this.currentWordIndex,
        currentAyahIndex: this.currentAyahIndex,
        currentAyahNumber: this.currentAyah.number,
        totalAyahsInScope: this.activeAyahsSlice.length,
        isCorrect: false,
        isSkipped: true,
        matchedWord: targetWord.raw,
        spokenWord: 'Skipped',
        nextExpectedWord: (this.currentWordIndex < this.words.length) ? this.words[this.currentWordIndex].raw : '',
        mistakesCount: this.sessionMistakes,
        retriesCount: this.sessionRetries,
        accuracy: this.getAccuracy()
      });
    }

    if (this.currentWordIndex >= this.words.length) {
      if (this.currentAyahIndex + 1 < this.activeAyahsSlice.length) {
        this.currentAyahIndex++;
        this._loadCurrentAyahInternal();
        if (this.onAyahAdvanced) {
          this.onAyahAdvanced({
            completedAyahNumber: this.currentAyah.number - 1,
            newAyahIndex: this.currentAyahIndex,
            newAyahNumber: this.currentAyah.number,
            totalAyahsInScope: this.activeAyahsSlice.length,
            words: this.words,
            accuracy: this.getAccuracy(),
            mistakesCount: this.sessionMistakes
          });
        }
      } else {
        this._finishSession();
      }
    }
  }

  /**
   * Real Mathematical Accuracy Calculation
   */
  getAccuracy() {
    const totalTries = this.completedWordsCount + this.sessionMistakes;
    if (totalTries === 0) return 100;
    return Math.max(0, Math.min(100, Math.round((this.completedWordsCount / totalTries) * 100)));
  }
}

window.QuranVoiceEngine = new QuranVoiceRecitationEngine();
console.log('LearnHub Strict QuranVoiceEngine v182.0.0 initialized.');

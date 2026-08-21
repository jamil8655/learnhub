/**
 * LearnHub Adventure Game Engine
 * Manages player progression, game sessions, 7 interactive gameplay modes,
 * power-up inventory, combo multipliers, weak-area queues, and offline sync.
 */

class AdventureGameEngine {
  constructor() {
    this.storageKey = 'learnhub_adventure_profile_v1';
    this.syncQueueKey = 'learnhub_game_sync_queue';
    this.profile = this.loadProfile();
    this.activeSession = null;
    this.sessionTimer = null;
  }

  /* ==========================================================================
     PLAYER PROFILE & PROGRESSION
     ========================================================================== */

  loadProfile() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const p = JSON.parse(stored);
        if (p && typeof p === 'object') {
          return this._sanitizeProfile(p);
        }
      }
    } catch (e) {
      console.warn('[GameEngine] Error loading profile:', e);
    }
    return this._createDefaultProfile();
  }

  _createDefaultProfile() {
    const defaultProfile = {
      level: 1,
      totalXp: 0,
      coins: 250, // Starting coin bounty for new adventurers
      hearts: 3,
      maxHearts: 3,
      lastHeartRegenAt: new Date().toISOString(),
      streak: 1,
      longestStreak: 1,
      lastPlayedDate: new Date().toISOString().split('T')[0],
      unlockedWorlds: ['w-1'], // World 1 unlocked by default
      completedStages: {}, // e.g. { 'stg-1-1': { stars: 3, bestScore: 950, completedAt: '...' } }
      inventory: {
        hint: 3,
        fiftyFifty: 3,
        timeBoost: 2,
        extraLife: 1,
        streakShield: 1
      },
      weakAreas: [], // [{ questionId, worldId, stageId, title, topic, missedCount, lastMissedAt }]
      achievements: ['ach-first-step'],
      claimedMissions: [],
      stats: {
        stagesPlayed: 0,
        stagesWon: 0,
        questionsAnswered: 0,
        questionsCorrect: 0,
        maxCombo: 0,
        miniGamesWon: 0,
        bossDefeated: 0
      }
    };
    this.saveProfile(defaultProfile);
    return defaultProfile;
  }

  _sanitizeProfile(p) {
    p.level = p.level || 1;
    p.totalXp = Number(p.totalXp) || 0;
    p.coins = p.coins !== undefined ? Number(p.coins) : 250;
    p.hearts = p.hearts !== undefined ? Number(p.hearts) : 3;
    p.maxHearts = 3;
    p.streak = p.streak || 1;
    p.unlockedWorlds = Array.isArray(p.unlockedWorlds) && p.unlockedWorlds.length ? p.unlockedWorlds : ['w-1'];
    p.completedStages = p.completedStages || {};
    p.inventory = {
      hint: 3,
      fiftyFifty: 3,
      timeBoost: 2,
      extraLife: 1,
      streakShield: 1,
      ...(p.inventory || {})
    };
    p.weakAreas = Array.isArray(p.weakAreas) ? p.weakAreas : [];
    p.achievements = Array.isArray(p.achievements) ? p.achievements : ['ach-first-step'];
    p.claimedMissions = Array.isArray(p.claimedMissions) ? p.claimedMissions : [];
    p.stats = {
      stagesPlayed: 0,
      stagesWon: 0,
      questionsAnswered: 0,
      questionsCorrect: 0,
      maxCombo: 0,
      miniGamesWon: 0,
      bossDefeated: 0,
      ...(p.stats || {})
    };

    // Calculate level based on XP
    p.level = Math.floor(Math.sqrt(p.totalXp / 100)) + 1;
    return p;
  }

  saveProfile(profile = this.profile) {
    try {
      this.profile = profile;
      localStorage.setItem(this.storageKey, JSON.stringify(profile));
      window.dispatchEvent(new CustomEvent('learnhub:game_profile_updated', { detail: { profile } }));
    } catch (e) {
      console.warn('[GameEngine] Error saving profile:', e);
    }
  }

  getXpForNextLevel(level = this.profile.level) {
    // Level N requires (N)^2 * 100 total XP
    const currentLevelBaseXp = Math.pow(level - 1, 2) * 100;
    const nextLevelTargetXp = Math.pow(level, 2) * 100;
    const levelSpan = nextLevelTargetXp - currentLevelBaseXp;
    const progressInCurrentLevel = Math.max(0, this.profile.totalXp - currentLevelBaseXp);
    const percentage = Math.min(100, Math.round((progressInCurrentLevel / levelSpan) * 100));

    return {
      currentLevel: level,
      currentLevelBaseXp,
      nextLevelTargetXp,
      progressInCurrentLevel,
      xpNeeded: Math.max(0, nextLevelTargetXp - this.profile.totalXp),
      percentage
    };
  }

  addXp(amount) {
    const oldLevel = this.profile.level;
    this.profile.totalXp += Math.max(0, amount);
    this.profile.level = Math.floor(Math.sqrt(this.profile.totalXp / 100)) + 1;
    const leveledUp = this.profile.level > oldLevel;
    
    if (leveledUp) {
      this.profile.coins += 100; // Bonus coins on level-up
      if (window.GameSound) window.GameSound.playVictory();
    }
    this.saveProfile();
    return { newXp: this.profile.totalXp, newLevel: this.profile.level, leveledUp };
  }

  addCoins(amount) {
    this.profile.coins = Math.max(0, this.profile.coins + amount);
    this.saveProfile();
    return this.profile.coins;
  }

  spendCoins(amount) {
    if (this.profile.coins >= amount) {
      this.profile.coins -= amount;
      this.saveProfile();
      return true;
    }
    return false;
  }

  buyPowerUp(powerUpType, cost = 50) {
    if (this.spendCoins(cost)) {
      this.profile.inventory[powerUpType] = (this.profile.inventory[powerUpType] || 0) + 1;
      this.saveProfile();
      if (window.GameSound) window.GameSound.playCoin();
      return true;
    }
    return false;
  }

  usePowerUp(powerUpType) {
    if (this.profile.inventory[powerUpType] > 0) {
      this.profile.inventory[powerUpType] -= 1;
      this.saveProfile();
      if (window.GameSound) window.GameSound.playPowerUp();
      return true;
    }
    return false;
  }

  /* ==========================================================================
     STAGE SESSION LIFECYCLE & GAMEPLAY MODES
     ========================================================================== */

  startStage(worldId, stageId, mode = 'adventure') {
    const worlds = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gameWorlds') || []) : [];
    const world = worlds.find(w => w.id === worldId) || { id: worldId, title: 'عالمِ اسلام' };
    
    const stages = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gameStages') || []) : [];
    const stage = stages.find(s => s.id === stageId) || {
      id: stageId,
      worldId,
      title: 'مرحلۂ اول',
      difficulty: 'medium',
      timeLimitSeconds: 60,
      rewardXp: 150,
      rewardCoins: 50,
      type: 'mixed'
    };

    const questions = (window.DB && typeof window.DB.get === 'function')
      ? (window.DB.get('gameQuestions') || []).filter(q => q.stageId === stageId || q.worldId === worldId)
      : [];

    const activeQuestions = questions.length ? questions : this._getFallbackQuestions(stageId, stage.type);

    this.activeSession = {
      id: `sess-${Date.now()}`,
      worldId,
      world,
      stageId,
      stage,
      mode, // 'adventure' | 'daily' | 'speed' | 'boss' | 'practice'
      questions: activeQuestions,
      currentQuestionIndex: 0,
      score: 0,
      combo: 0,
      maxComboInSession: 0,
      lives: stage.type === 'boss' ? 4 : 3,
      maxLives: stage.type === 'boss' ? 4 : 3,
      correctCount: 0,
      wrongCount: 0,
      timeRemaining: stage.timeLimitSeconds || 60,
      isCompleted: false,
      isFailed: false,
      answersPayload: [],
      usedPowerUps: {
        fiftyFifty: false,
        hint: false,
        timeBoost: false
      }
    };

    this.profile.stats.stagesPlayed += 1;
    this.saveProfile();

    return this.activeSession;
  }

  getCurrentQuestion() {
    if (!this.activeSession || !this.activeSession.questions.length) return null;
    return this.activeSession.questions[this.activeSession.currentQuestionIndex] || null;
  }

  /* ==========================================================================
     SUBMIT ANSWER & EVALUATE ACROSS 7 GAME MODES
     ========================================================================== */

  submitAnswer(answerValue) {
    if (!this.activeSession || this.activeSession.isCompleted || this.activeSession.isFailed) {
      return null;
    }

    const currentQ = this.getCurrentQuestion();
    if (!currentQ) return null;

    let isCorrect = false;
    let feedback = '';
    const qType = currentQ.type || 'knowledge';

    switch (qType) {
      case 'knowledge':
      case 'standard':
      case 'audio_recitation':
      case 'image_challenge':
        isCorrect = Number(answerValue) === Number(currentQ.correctOptionIndex);
        feedback = currentQ.explanation || (isCorrect ? 'ماشاء اللہ! درست جواب۔' : 'جواب درست نہیں ہے۔');
        break;

      case 'sequential_order':
        // answerValue is expected to be an array of item IDs in chosen order
        const targetOrder = currentQ.correctSequence || [];
        isCorrect = Array.isArray(answerValue) && 
          answerValue.length === targetOrder.length && 
          answerValue.every((val, idx) => val === targetOrder[idx]);
        feedback = currentQ.explanation || 'ترتیب کی جانچ مکمل ہوئی۔';
        break;

      case 'memory_match':
        // answerValue is true if player matched all pairs under time
        isCorrect = !!answerValue;
        feedback = 'بہترین حافظہ اور فہم!';
        break;

      case 'term_connector':
        // answerValue is array of pairs [{ fromId, toId }]
        const expectedPairs = currentQ.correctPairs || [];
        isCorrect = Array.isArray(answerValue) &&
          answerValue.length === expectedPairs.length &&
          answerValue.every(p => expectedPairs.some(exp => exp.fromId === p.fromId && exp.toId === p.toId));
        feedback = currentQ.explanation || 'تمام اصطلاحات اور معانی کا درست ربط۔';
        break;

      case 'rapid_binary':
        // answerValue is boolean true/false or 'halal'/'haram'
        isCorrect = String(answerValue).toLowerCase() === String(currentQ.correctAnswer).toLowerCase();
        feedback = currentQ.explanation || (isCorrect ? 'فوری اور درست فیصلہ!' : 'غلط انتخاب۔');
        break;

      case 'verse_gem_bank':
        // answerValue is ordered words array
        const correctWords = currentQ.correctWords || [];
        isCorrect = Array.isArray(answerValue) &&
          answerValue.length === correctWords.length &&
          answerValue.every((w, i) => w.trim() === correctWords[i].trim());
        feedback = currentQ.explanation || 'آیت / حدیث مبارکہ کی خوبصورت تکمیل۔';
        break;

      default:
        isCorrect = answerValue === currentQ.correctOptionIndex;
    }

    // Process correctness & combo
    if (isCorrect) {
      this.activeSession.combo += 1;
      if (this.activeSession.combo > this.activeSession.maxComboInSession) {
        this.activeSession.maxComboInSession = this.activeSession.combo;
      }
      if (this.activeSession.combo > this.profile.stats.maxCombo) {
        this.profile.stats.maxCombo = this.activeSession.combo;
      }

      const comboMultiplier = 1 + Math.min(this.activeSession.combo * 0.2, 1.5);
      const pointsEarned = Math.round(100 * comboMultiplier);
      this.activeSession.score += pointsEarned;
      this.activeSession.correctCount += 1;
      this.profile.stats.questionsCorrect += 1;

      if (window.GameSound) {
        if (this.activeSession.combo > 1) {
          window.GameSound.playCombo(this.activeSession.combo);
        } else {
          window.GameSound.playCorrect();
        }
      }
    } else {
      this.activeSession.combo = 0;
      this.activeSession.wrongCount += 1;
      if (this.activeSession.mode !== 'practice') {
        this.activeSession.lives = Math.max(0, this.activeSession.lives - 1);
      }

      // Add to Weak Areas queue for smart review
      this._recordWeakArea(currentQ);

      if (window.GameSound) window.GameSound.playWrong();

      if (this.activeSession.lives <= 0 && this.activeSession.mode !== 'practice') {
        this.activeSession.isFailed = true;
      }
    }

    this.profile.stats.questionsAnswered += 1;

    // Record answer in session payload
    this.activeSession.answersPayload.push({
      questionId: currentQ.id,
      questionTitle: currentQ.title || currentQ.questionText,
      type: qType,
      userAnswer: answerValue,
      isCorrect,
      explanation: feedback
    });

    const isLastQuestion = this.activeSession.currentQuestionIndex >= this.activeSession.questions.length - 1;
    const shouldEndSession = this.activeSession.isFailed || isLastQuestion;

    if (shouldEndSession && !this.activeSession.isFailed) {
      this.activeSession.isCompleted = true;
      this._finalizeSessionRewards();
    }

    this.saveProfile();

    return {
      isCorrect,
      feedback,
      currentScore: this.activeSession.score,
      combo: this.activeSession.combo,
      livesRemaining: this.activeSession.lives,
      isFailed: this.activeSession.isFailed,
      isCompleted: this.activeSession.isCompleted,
      isLastQuestion,
      nextIndex: this.activeSession.currentQuestionIndex + 1
    };
  }

  nextQuestion() {
    if (!this.activeSession) return null;
    this.activeSession.currentQuestionIndex += 1;
    // Reset temporary question-specific power-up flags
    this.activeSession.usedPowerUps.fiftyFifty = false;
    this.activeSession.usedPowerUps.hint = false;
    return this.getCurrentQuestion();
  }

  _recordWeakArea(q) {
    const existingIdx = this.profile.weakAreas.findIndex(w => w.questionId === q.id);
    if (existingIdx !== -1) {
      this.profile.weakAreas[existingIdx].missedCount += 1;
      this.profile.weakAreas[existingIdx].lastMissedAt = new Date().toISOString();
    } else {
      this.profile.weakAreas.unshift({
        questionId: q.id,
        worldId: q.worldId || this.activeSession.worldId,
        stageId: q.stageId || this.activeSession.stageId,
        title: q.title || q.questionText || 'اسلامی سوال',
        topic: q.topic || 'عمومی اسلامی معلومات',
        missedCount: 1,
        lastMissedAt: new Date().toISOString()
      });
    }
  }

  _finalizeSessionRewards() {
    const totalQ = this.activeSession.questions.length || 1;
    const accuracy = Math.round((this.activeSession.correctCount / totalQ) * 100);

    // Calculate stars:
    // 3 Stars: 100% accuracy or 0 mistakes
    // 2 Stars: >= 80% accuracy
    // 1 Star:  >= 60% accuracy (Pass)
    // 0 Stars: < 60% accuracy
    let starsEarned = 0;
    if (accuracy === 100 || this.activeSession.wrongCount === 0) {
      starsEarned = 3;
    } else if (accuracy >= 80) {
      starsEarned = 2;
    } else if (accuracy >= 60) {
      starsEarned = 1;
    }

    const baseRewardXp = this.activeSession.stage.rewardXp || 150;
    const baseRewardCoins = this.activeSession.stage.rewardCoins || 50;

    const earnedXp = Math.round(baseRewardXp * (accuracy / 100) + (starsEarned === 3 ? 50 : 0));
    const earnedCoins = Math.round(baseRewardCoins * (starsEarned / 3) + (starsEarned === 3 ? 25 : 0));

    this.activeSession.earnedStars = starsEarned;
    this.activeSession.earnedXp = earnedXp;
    this.activeSession.earnedCoins = earnedCoins;
    this.activeSession.accuracy = accuracy;

    // Apply XP and Coins to global profile
    this.addXp(earnedXp);
    this.addCoins(earnedCoins);

    // Record stage completion
    if (starsEarned > 0) {
      const prev = this.profile.completedStages[this.activeSession.stageId] || { stars: 0, bestScore: 0 };
      this.profile.completedStages[this.activeSession.stageId] = {
        stars: Math.max(prev.stars, starsEarned),
        bestScore: Math.max(prev.bestScore, this.activeSession.score),
        completedAt: new Date().toISOString()
      };

      this.profile.stats.stagesWon += 1;

      // Unlock next stage / world if applicable
      this._checkUnlocks();
    }

    // Sound and animation triggers
    if (window.GameSound) {
      window.GameSound.playVictory();
    }

    // Queue attempt for offline/online cloud sync
    this._queueSyncEvent({
      stageId: this.activeSession.stageId,
      worldId: this.activeSession.worldId,
      score: this.activeSession.score,
      stars: starsEarned,
      xp: earnedXp,
      coins: earnedCoins,
      accuracy,
      completedAt: new Date().toISOString()
    });
  }

  _checkUnlocks() {
    // If completed stage is last stage in current world, unlock next world
    const worldOrder = ['w-1', 'w-2', 'w-3', 'w-4', 'w-5', 'w-6', 'w-7', 'w-8', 'w-9'];
    const curWorldIdx = worldOrder.indexOf(this.activeSession.worldId);
    if (curWorldIdx !== -1 && curWorldIdx < worldOrder.length - 1) {
      const nextWorldId = worldOrder[curWorldIdx + 1];
      if (!this.profile.unlockedWorlds.includes(nextWorldId)) {
        // Unlock next world if at least 4 stages completed in current world
        const currentWorldCompletedCount = Object.keys(this.profile.completedStages).filter(stgId => stgId.startsWith(`stg-${curWorldIdx + 1}`)).length;
        if (currentWorldCompletedCount >= 4 || this.activeSession.stage.type === 'boss') {
          this.profile.unlockedWorlds.push(nextWorldId);
        }
      }
    }
  }

  _queueSyncEvent(eventPayload) {
    try {
      const queue = JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
      queue.push({
        id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        ...eventPayload
      });
      localStorage.setItem(this.syncQueueKey, JSON.stringify(queue));
    } catch (e) {}
  }

  /* ==========================================================================
     POWER-UP IN-SESSION TRIGGERS
     ========================================================================== */

  applyFiftyFifty() {
    if (!this.activeSession || this.activeSession.usedPowerUps.fiftyFifty) return false;
    const currentQ = this.getCurrentQuestion();
    if (!currentQ || !Array.isArray(currentQ.options) || currentQ.options.length < 4) return false;

    if (this.usePowerUp('fiftyFifty')) {
      this.activeSession.usedPowerUps.fiftyFifty = true;
      const correctIdx = Number(currentQ.correctOptionIndex);
      const wrongIndices = [0, 1, 2, 3].filter(i => i !== correctIdx);
      // Pick 2 random wrong indices to eliminate
      const eliminated = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
      return eliminated; // indices of options to hide
    }
    return false;
  }

  applyHint() {
    if (!this.activeSession || this.activeSession.usedPowerUps.hint) return null;
    const currentQ = this.getCurrentQuestion();
    if (!currentQ) return null;

    if (this.usePowerUp('hint')) {
      this.activeSession.usedPowerUps.hint = true;
      return currentQ.hint || currentQ.explanation || 'غور سے سوال کے بنیادی ارکان کا مشاہدہ کریں۔';
    }
    return null;
  }

  applyTimeBoost() {
    if (!this.activeSession) return false;
    if (this.usePowerUp('timeBoost')) {
      this.activeSession.timeRemaining += 15;
      return this.activeSession.timeRemaining;
    }
    return false;
  }

  applyExtraLife() {
    if (!this.activeSession) return false;
    if (this.usePowerUp('extraLife')) {
      this.activeSession.lives = Math.min(this.activeSession.maxLives, this.activeSession.lives + 1);
      return this.activeSession.lives;
    }
    return false;
  }

  /* ==========================================================================
     FALLBACK CURATED CONTENT (9 WORLDS & RICH MINI-GAMES)
     ========================================================================== */

  _getFallbackQuestions(stageId, type) {
    if (type === 'sequential_order') {
      return [{
        id: `q-seq-${stageId}`,
        stageId,
        type: 'sequential_order',
        title: 'ترتیبِ وضو کا مرحلہ وار چیلنج',
        questionText: 'وضو کے درج ذیل ارکان و سنن کو ان کی صحیح شرعی ترتیب میں لگائیں:',
        items: [
          { id: 'w-1', text: 'دونوں ہاتھوں کو کلائیوں تک دھونا اور بسم اللہ پڑھنا' },
          { id: 'w-2', text: 'تین بار کلی کرنا اور مسواک کا استعمال' },
          { id: 'w-3', text: 'تین بار ناک میں پانی ڈال کر صاف کرنا' },
          { id: 'w-4', text: 'پیشانی سے ٹھوڑی تک پورا چہرہ تین بار دھونا' },
          { id: 'w-5', text: 'کہنیوں سمیت دونوں ہاتھ دھونا (پہلے دایاں، پھر بایاں)' },
          { id: 'w-6', text: 'پورے سر کا مسح اور کانوں کی صفائی' },
          { id: 'w-7', text: 'ٹخنوں سمیت دونوں پاؤں دھونا (پہلے دایاں)' }
        ],
        correctSequence: ['w-1', 'w-2', 'w-3', 'w-4', 'w-5', 'w-6', 'w-7'],
        explanation: 'وضو میں ترتیب مستحب و سنتِ مؤکدہ ہے جس کا لحاظ رکھنا کمالِ طہارت ہے۔'
      }];
    }

    if (type === 'memory_match') {
      return [{
        id: `q-mem-${stageId}`,
        stageId,
        type: 'memory_match',
        title: 'تطابقِ ذاکرہ — تجوید کی اصطلاحات',
        pairs: [
          { id: 'p1', term: 'اظہار', match: 'حروفِ حلقی پر نون ساکن کو ظاہر کر کے پڑھنا' },
          { id: 'p2', term: 'ادغام', match: 'حروفِ یرملون میں حرف کو ملا کر پڑھنا' },
          { id: 'p3', term: 'اقلاب', match: 'نون ساکن کے بعد باء آنے پر میم سے بدلنا' },
          { id: 'p4', term: 'اخفاء', match: 'حرف کو ناک میں چھپا کر غنہ کے ساتھ ادا کرنا' },
          { id: 'p5', term: 'قلقلہ', match: 'حروفِ قطب جد پر جنبش و گونج پیدا کرنا' },
          { id: 'p6', term: 'غنہ', match: 'ناک کے بانسے سے ادا ہونے والی دلکش آواز' }
        ],
        explanation: 'تجوید القرآن کی بنیادی قواعد کا درست فہم و تطابق۔'
      }];
    }

    if (type === 'term_connector') {
      return [{
        id: `q-conn-${stageId}`,
        stageId,
        type: 'term_connector',
        title: 'قرآنی کلمات اور اردو معانی کا ربط',
        leftColumn: [
          { id: 'l1', text: 'الصَّمَدُ' },
          { id: 'l2', text: 'الْفَلَقِ' },
          { id: 'l3', text: 'غَاسِقٍ' },
          { id: 'l4', text: 'الْوَسْوَاسِ' }
        ],
        rightColumn: [
          { id: 'r1', text: 'سب کا بے نیاز و سہارا' },
          { id: 'r2', text: 'صبح کی روشنی / پھوٹنا' },
          { id: 'r3', text: 'اندھیری رات جب چھا جائے' },
          { id: 'r4', text: 'وسوسہ ڈالنے والا، بہکانے والا' }
        ],
        correctPairs: [
          { fromId: 'l1', toId: 'r1' },
          { fromId: 'l2', toId: 'r2' },
          { fromId: 'l3', toId: 'r3' },
          { fromId: 'l4', toId: 'r4' }
        ],
        explanation: 'سورۃ الاخلاص اور معوذتین کے پاکیزہ کلمات کے مستند معانی۔'
      }];
    }

    if (type === 'rapid_binary') {
      return [{
        id: `q-bin-${stageId}`,
        stageId,
        type: 'rapid_binary',
        title: 'فوری فیصلہ — مکی یا مدنی سورت؟',
        questionText: 'کیا سورۃ البقرہ مدینہ منورہ میں نازل ہونے والی مدنی سورت ہے؟',
        correctAnswer: 'true',
        explanation: 'سورۃ البقرہ قرآن کریم کی طویل ترین اور سب سے پہلی نازل شدہ مدنی سورت ہے۔'
      }];
    }

    if (type === 'verse_gem_bank') {
      return [{
        id: `q-verse-${stageId}`,
        stageId,
        type: 'verse_gem_bank',
        title: 'تکمیلِ حدیث مبارکہ — نگینے فٹ کریں',
        questionText: 'حدیثِ نبوی ﷺ کے درج ذیل الفاظ کو درست ترتیب میں لگائیں:',
        versePrefix: 'إِنَّمَا الْأَعْمَالُ',
        verseSuffix: '...',
        wordBank: ['بِالنِّيَّاتِ', 'وَإِنَّمَا', 'لِكُلِّ', 'امْرِئٍ', 'مَا', 'نَوَى'],
        correctWords: ['بِالنِّيَّاتِ', 'وَإِنَّمَا', 'لِكُلِّ', 'امْرِئٍ', 'مَا', 'نَوَى'],
        explanation: 'صحیح بخاری کی پہلی حدیث مبارکہ: "اعمال کا دارومدار نیتوں پر ہے۔"'
      }];
    }

    // Default Knowledge Questions
    return [
      {
        id: `q-std-1-${stageId}`,
        stageId,
        type: 'knowledge',
        title: 'ایمان کے بنیادی ارکان',
        questionText: 'ایمانِ مجمل میں اللہ تعالیٰ کی وحدانیت کے بعد کس بات کا اقرار کیا گیا ہے؟',
        options: [
          'اس کے تمام اسماء و صفات کے ساتھ ایمان لانا اور تمام احکام کو قبول کرنا',
          'صرف زبان سے اقرار کرنا',
          'دنیاوی علوم میں کمال حاصل کرنا',
          'صرف فرشتوں کے نام یاد رکھنا'
        ],
        correctOptionIndex: 0,
        hint: 'ایمانِ مجمل کا متن: آمَنْتُ بِاللهِ كَمَا هُوَ بِأَسْمَائِهِ وَصِفَاتِهِ...',
        explanation: 'ایمانِ مجمل میں اللہ کے تمام پاکیزہ ناموں، صفات اور تمام نازل کردہ احکامات پر بغیر کسی تذبذب کے کامل ایمان لانا فرض ہے۔'
      },
      {
        id: `q-std-2-${stageId}`,
        stageId,
        type: 'knowledge',
        title: 'ارکانِ اسلام',
        questionText: 'اسلام کی عمارت کتنے بنیادی ستونوں پر استوار کی گئی ہے؟',
        options: ['3 ستون', '4 ستون', '5 ستون (شہادت، نماز، زکوٰۃ، روزہ، حج)', '7 ستون'],
        correctOptionIndex: 2,
        hint: 'حدیث شریف: بُنِيَ الإِسْلامُ عَلَى خَمْسٍ...',
        explanation: 'حدیثِ ابن عمر رضی اللہ عنہ کے مطابق اسلام کے پانچ ستون ہیں: توحید و رسالت کی گواہی، اقامتِ صلوٰۃ، ادائے زکوٰۃ، صومِ رمضان اور حجِ بیت اللہ۔'
      }
    ];
  }
}

// Global Singleton Adventure Game Engine
window.GameEngine = new AdventureGameEngine();

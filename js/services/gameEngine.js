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
      unlockedWorlds: ['cls-1'], // Class 1 unlocked by default
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
    p.unlockedWorlds = Array.isArray(p.unlockedWorlds) && p.unlockedWorlds.length ? p.unlockedWorlds.map(w => w === 'w-1' ? 'cls-1' : w) : ['cls-1'];
    if (!p.unlockedWorlds.includes('cls-1')) p.unlockedWorlds.unshift('cls-1');
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

  /**
   * Synchronize local game state with Firebase Cloud Firestore
   */
  async syncWithCloud(userId = null) {
    const user = window.Auth ? window.Auth.getCurrentUser() : null;
    const targetUserId = userId || user?.id;
    if (!targetUserId) return this.profile;

    if (window.CloudDB && typeof window.CloudDB.getGameProgress === 'function') {
      try {
        const cloudProgress = await window.CloudDB.getGameProgress(targetUserId);
        if (cloudProgress) {
          // Merge local and cloud progress (never downgrade XP, stars, or completed stages)
          this.profile.totalXp = Math.max(this.profile.totalXp || 0, Number(cloudProgress.totalXp) || 0);
          this.profile.coins = Math.max(this.profile.coins || 0, Number(cloudProgress.coins) || 0);
          this.profile.streak = Math.max(this.profile.streak || 1, Number(cloudProgress.streak) || 1);

          // Merge unlocked worlds
          const cloudWorlds = Array.isArray(cloudProgress.unlockedWorlds) ? cloudProgress.unlockedWorlds : [];
          cloudWorlds.forEach(w => {
            if (!this.profile.unlockedWorlds.includes(w)) {
              this.profile.unlockedWorlds.push(w);
            }
          });

          // Merge completed stages
          const cloudStages = cloudProgress.completedStages || {};
          Object.keys(cloudStages).forEach(stgId => {
            const cur = this.profile.completedStages[stgId];
            const cStage = cloudStages[stgId];
            if (!cur) {
              this.profile.completedStages[stgId] = cStage;
            } else {
              this.profile.completedStages[stgId] = {
                stars: Math.max(cur.stars || 0, cStage.stars || 0),
                bestScore: Math.max(cur.bestScore || 0, cStage.bestScore || 0),
                completedAt: cur.completedAt || cStage.completedAt || new Date().toISOString()
              };
            }
          });

          this.saveProfile();
        }

        // Save merged state back to cloud
        await window.CloudDB.saveGameProgress(targetUserId, this.profile);
      } catch (e) {
        console.warn('[GameEngine] syncWithCloud note:', e);
      }
    }
    return this.profile;
  }

  startStage(worldId, stageId, mode = 'adventure', previewMode = false) {
    const worlds = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gameWorlds') || []) : [];
    const world = worlds.find(w => w.id === worldId) || { id: worldId, title: 'کلاس اسلامی ایڈونچر' };

    let stages = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gameStages') || []) : [];
    let stage = stages.find(s => s.id === stageId);

    // If stage not found in DB, generate dynamically from the 100-stage blueprint
    if (!stage) {
      const matchNum = stageId.match(/\d+$/);
      const stageNum = matchNum ? parseInt(matchNum[0]) : 1;
      const classNumMatch = worldId.match(/\d+$/);
      const classNum = classNumMatch ? parseInt(classNumMatch[0]) : 1;
      const all100 = this.generateClass100Stages(worldId, classNum);
      stage = all100.find(s => s.id === stageId || s.stageNumber === stageNum) || all100[0];
    }

    if (!stage) {
      stage = {
        id: stageId,
        worldId,
        stageNumber: 1,
        title: 'اسلامی علمی چیلنج',
        timeLimitSeconds: 180, // Relaxed 3 minutes for kids
        rewardXp: 150,
        rewardCoins: 50,
        type: 'knowledge'
      };
    }

    // Ensure generous kid-friendly timer (minimum 180 seconds)
    const relaxedTime = Math.max(180, stage.timeLimitSeconds || 180);

    const isUserAdmin = window.Auth && typeof window.Auth.isAdmin === 'function' && window.Auth.isAdmin();
    const canSeeDrafts = previewMode || (isUserAdmin && mode === 'admin_preview');

    let allQuestions = (window.DB && typeof window.DB.get === 'function')
      ? (window.DB.get('gameQuestions') || [])
      : [];

    // Filter by draft status: regular players only get published questions
    if (!canSeeDrafts) {
      allQuestions = allQuestions.filter(q => q && (q.status === 'published' || q.isPublished === true || q.status === undefined));
    }

    let stageQuestions = allQuestions.filter(q => q.stageId === stageId);

    if (!stageQuestions.length) {
      stageQuestions = allQuestions.filter(q => q.worldId === worldId);
    }

    if (!stageQuestions.length || stageQuestions.length < 3) {
      const fallbackList = this._getFallbackQuestions(stageId, stage.type, stage.stageNumber || 1);
      fallbackList.forEach(fq => {
        if (!stageQuestions.some(sq => sq.id === fq.id)) {
          stageQuestions.push(fq);
        }
      });
    }

    const activeQuestions = stageQuestions.length ? stageQuestions : this._getFallbackQuestions(stageId, stage.type, stage.stageNumber || 1);
    stage.questions = activeQuestions;

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
      lives: stage.type === 'boss' ? 5 : 4,
      maxLives: stage.type === 'boss' ? 5 : 4,
      correctCount: 0,
      wrongCount: 0,
      timeRemaining: relaxedTime,
      timeRemainingSeconds: relaxedTime,
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

  /* ==========================================================================
     100-STAGE BLUEPRINT GENERATOR PER CLASS (مراحل 1 تا 100 کا مکمل خاکہ)
     ========================================================================== */

  generateClass100Stages(worldId = 'cls-1', classGrade = 1) {
    const stages = [];
    const topicsPool = [
      { title: 'بنیادی حروف و صوتی شناخت', type: 'visual_letter_object', icon: 'image' },
      { title: 'کلمۂ طیبہ و توحید کے نگینے', type: 'verse_gem_bank', icon: 'gem' },
      { title: 'تطابقِ ذاکرہ و اصطلاحات', type: 'memory_match', icon: 'grid' },
      { title: 'ترتیبِ وضو و سننِ نبوی', type: 'sequential_order', icon: 'layers' },
      { title: 'تیز رفتار شرعی فیصلہ', type: 'rapid_binary', icon: 'zap' },
      { title: 'صوتی تلاوت و قاری پہچان', type: 'audio_qari_guess', icon: 'headphones' },
      { title: 'حروف کے ہجے و کلمہ سازی', type: 'audio_speller', icon: 'spell-check' },
      { title: 'ارکانِ نماز و خشوع', type: 'knowledge', icon: 'help-circle' },
      { title: 'قرآنی سورتوں کا فہم', type: 'knowledge', icon: 'book' },
      { title: 'گلستانِ سیرتِ رسول ﷺ', type: 'knowledge', icon: 'sparkles' },
      { title: 'قصص الانبیاء علیہم السلام', type: 'knowledge', icon: 'sun' },
      { title: 'صحابہ کرام کے درخشندہ کارنامے', type: 'knowledge', icon: 'shield' },
      { title: 'آدابِ زندگی و حسنِ اخلاق', type: 'knowledge', icon: 'heart' },
      { title: 'احادیثِ صحیحہ کے سنہری اقوال', type: 'verse_gem_bank', icon: 'gem' },
      { title: 'تجوید و مخارج کے اسرار', type: 'memory_match', icon: 'grid' },
      { title: 'علمائے سلف و تاریخی فتوحات', type: 'knowledge', icon: 'award' }
    ];

    for (let i = 1; i <= 100; i++) {
      const isBoss = (i % 10 === 0);
      const topicIndex = (i - 1) % topicsPool.length;
      const baseTopic = topicsPool[topicIndex];
      
      let tierName = 'ابتدائی';
      if (i > 75) tierName = 'شاہی گرینڈ ماسٹر';
      else if (i > 50) tierName = 'اعلیٰ پیش قدمی';
      else if (i > 25) tierName = 'متوسط تربیت';

      const stageTitle = isBoss 
        ? `👑 لیول ${i} — کلاس ${classGrade} کا گولڈن چیمپئن چیلنج (${i === 100 ? 'شاہی گرینڈ فائنل' : 'سپر لیول ' + i})`
        : `لیول ${i} — ${baseTopic.title} [${tierName}]`;

      const stageType = isBoss ? 'boss' : baseTopic.type;
      const difficulty = i <= 25 ? 'easy' : (i <= 70 ? 'medium' : 'hard');
      const rewardXp = 100 + (i * 10);
      const rewardCoins = 30 + Math.round(i * 2.5);

      stages.push({
        id: `stg-${classGrade}-${i}`,
        worldId: worldId,
        stageNumber: i,
        title: stageTitle,
        type: stageType,
        difficulty: difficulty,
        timeLimitSeconds: isBoss ? 240 : 180, // Generous 3 to 4 minutes
        rewardXp: rewardXp,
        rewardCoins: rewardCoins,
        icon: isBoss ? 'crown' : baseTopic.icon,
        isBoss: isBoss
      });
    }

    return stages;
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
      case 'boss':
      case 'audio_qari_guess':
      case 'audio_surah_guess':
      case 'audio_next_verse':
      case 'audio_tajweed_makhraj':
      case 'video_clip_quiz':
      case 'video_spot_mistake':
      case 'video_3d_makhraj':
      case 'audio_adhan_guess':
      case 'audio_dua_guess':
      case 'audio_hadith_quiz':
      case 'audio_nasheed_poetry':
      case 'visual_letter_object':
      case 'animated_map_battle':
        const targetOptionIdx = currentQ.correctOptionIndex !== undefined 
          ? currentQ.correctOptionIndex 
          : (currentQ.correctAnswer !== undefined ? currentQ.correctAnswer : 0);
        isCorrect = Number(answerValue) === Number(targetOptionIdx);
        feedback = currentQ.explanation || (isCorrect ? 'ماشاء اللہ! درست جواب۔' : 'جواب درست نہیں ہے۔');
        break;

      case 'audio_speller':
        // answerValue is spelled word string e.g. "كتاب"
        const targetSpelling = (currentQ.spelledWord || currentQ.correctWord || currentQ.correctAnswer || '').trim();
        isCorrect = String(answerValue).trim() === targetSpelling;
        feedback = currentQ.explanation || (isCorrect ? 'شاندار! درست ہجے کے ساتھ لفظ مکمل ہوا۔' : 'ہجے درست نہیں ہے۔');
        break;

      case 'audio_word_meaning':
        isCorrect = Number(answerValue) === Number(currentQ.correctOptionIndex !== undefined ? currentQ.correctOptionIndex : currentQ.correctAnswer);
        feedback = currentQ.explanation || 'عربی لفظ اور اردو مفہوم کا درست ادراک۔';
        break;

      case 'sequential_order':
        // answerValue is expected to be an array of item IDs in chosen order
        const targetOrder = currentQ.correctSequence || (currentQ.items ? currentQ.items.map(i => i.id) : []);
        isCorrect = Array.isArray(answerValue) && 
          answerValue.length === targetOrder.length && 
          answerValue.every((val, idx) => val === targetOrder[idx]);
        feedback = currentQ.explanation || 'ترتیب کی جانچ مکمل ہوئی۔';
        break;

      case 'memory_match':
        // answerValue is true or 'all_pairs_matched' when player matched all pairs
        isCorrect = (answerValue === 'all_pairs_matched' || Boolean(answerValue));
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
        isCorrect = String(answerValue).toLowerCase() === String(currentQ.correctAnswer || currentQ.correct || 'true').toLowerCase();
        feedback = currentQ.explanation || (isCorrect ? 'فوری اور درست فیصلہ!' : 'غلط انتخاب۔');
        break;

      case 'verse_gem_bank':
      case 'audio_gem_bank':
        // answerValue is single word string or ordered words array
        if (Array.isArray(answerValue)) {
          const correctWords = currentQ.correctWords || [];
          isCorrect = answerValue.length === correctWords.length &&
            answerValue.every((w, i) => w.trim() === correctWords[i].trim());
        } else {
          const expectedWord = currentQ.missingWord || currentQ.correctWord || currentQ.correctAnswer || '';
          isCorrect = String(answerValue).trim() === String(expectedWord).trim();
        }
        feedback = currentQ.explanation || 'آیت / حدیث مبارکہ کی خوبصورت تکمیل۔';
        break;

      default:
        isCorrect = Number(answerValue) === Number(currentQ.correctOptionIndex !== undefined ? currentQ.correctOptionIndex : currentQ.correctAnswer);
    }

    // Process correctness & combo
    let pointsEarned = 0;
    if (isCorrect) {
      this.activeSession.combo += 1;
      if (this.activeSession.combo > this.activeSession.maxComboInSession) {
        this.activeSession.maxComboInSession = this.activeSession.combo;
      }
      if (this.activeSession.combo > this.profile.stats.maxCombo) {
        this.profile.stats.maxCombo = this.activeSession.combo;
      }

      const comboMultiplier = 1 + Math.min(this.activeSession.combo * 0.2, 1.5);
      pointsEarned = Math.round(100 * comboMultiplier);
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

      const isLastQuestion = this.activeSession.currentQuestionIndex >= this.activeSession.questions.length - 1;
      if (isLastQuestion) {
        this.activeSession.isCompleted = true;
        this._finalizeSessionRewards();
      } else {
        // Increment question index so next render shows the next challenge!
        this.activeSession.currentQuestionIndex += 1;
        this.activeSession.usedPowerUps.fiftyFifty = false;
        this.activeSession.usedPowerUps.hint = false;
      }
    } else {
      this.activeSession.combo = 0;
      this.activeSession.wrongCount += 1;
      // Deduct 15 points on mistake (minimum 0)
      this.activeSession.score = Math.max(0, this.activeSession.score - 15);

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

    this.saveProfile();

    const isComplete = this.activeSession.isCompleted || this.activeSession.isFailed;

    return {
      isCorrect,
      feedback,
      currentScore: this.activeSession.score,
      pointsEarned,
      combo: this.activeSession.combo,
      livesRemaining: this.activeSession.lives,
      isFailed: this.activeSession.isFailed,
      isCompleted: this.activeSession.isCompleted,
      isComplete,
      isLastQuestion: this.activeSession.isCompleted,
      nextIndex: this.activeSession.currentQuestionIndex,
      isPassed: this.activeSession.isCompleted && !this.activeSession.isFailed,
      stars: this.activeSession.earnedStars || (this.activeSession.lives > 0 ? 3 : 0),
      accuracy: this.activeSession.questions.length ? Math.round((this.activeSession.correctCount / this.activeSession.questions.length) * 100) : 100,
      earnedXp: this.activeSession.stage.rewardXp || 150,
      earnedCoins: this.activeSession.stage.rewardCoins || 50
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

    // Live Cloud Attempt Recording & Permanent History Preservation
    const curUser = window.Auth ? window.Auth.getCurrentUser() : null;
    if (curUser && window.CloudDB && typeof window.CloudDB.recordGameAttempt === 'function') {
      const attemptRecord = {
        userId: curUser.id,
        userName: curUser.name || 'طالب علم',
        userEmail: curUser.email || '',
        worldId: this.activeSession.worldId,
        stageId: this.activeSession.stageId,
        stageTitle: this.activeSession.stage?.title || 'اسلامی علمی مرحلہ',
        score: this.activeSession.score,
        stars: starsEarned,
        xp: earnedXp,
        coins: earnedCoins,
        accuracy,
        correctCount: this.activeSession.correctCount,
        wrongCount: this.activeSession.wrongCount,
        answers: this.activeSession.answersPayload || []
      };
      window.CloudDB.recordGameAttempt(attemptRecord).catch(() => {});
      window.CloudDB.saveGameProgress(curUser.id, this.profile).catch(() => {});
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
    // If completed stage is last stage in current class, unlock next class
    const worldOrder = ['cls-1', 'cls-2', 'cls-3', 'cls-4', 'cls-5', 'cls-6', 'cls-7', 'cls-8', 'cls-9', 'cls-10'];
    const curWorldIdx = worldOrder.indexOf(this.activeSession.worldId);
    if (curWorldIdx !== -1 && curWorldIdx < worldOrder.length - 1) {
      const nextWorldId = worldOrder[curWorldIdx + 1];
      if (!this.profile.unlockedWorlds.includes(nextWorldId)) {
        // Unlock next class if at least 3 stages completed in current class or boss stage won
        const currentWorldCompletedCount = Object.keys(this.profile.completedStages).filter(stgId => stgId.startsWith(`stg-${curWorldIdx + 1}`)).length;
        if (currentWorldCompletedCount >= 3 || this.activeSession.stage.type === 'boss') {
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

  _getFallbackQuestions(stageId, type, stageNumber = 1) {
    if (type === 'sequential_order') {
      return [{
        id: `q-seq-${stageId}`,
        stageId,
        type: 'sequential_order',
        title: `لیول ${stageNumber} — ترتیبِ عمل کا پزل`,
        questionText: 'وضو اور نماز کے درج ذیل ارکان و سنن کو ان کی صحیح شرعی ترتیب میں لگائیں:',
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
        title: `لیول ${stageNumber} — تطابقِ ذاکرہ (Memory Cards)`,
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

    if (type === 'rapid_binary') {
      return [{
        id: `q-bin-${stageId}`,
        stageId,
        type: 'rapid_binary',
        title: `لیول ${stageNumber} — تیز رفتار شرعی فیصلہ`,
        questionText: stageNumber % 2 === 0 
          ? 'کیا رسول اللہ ﷺ نے فرمایا ہے کہ "مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ رہیں"؟'
          : 'کیا نماز کے لیے قبلہ رخ ہونا اور باوضو ہونا لازمی شرط ہے؟',
        correctAnswer: 'true',
        explanation: 'صحیح احادیث مبارکہ اور قرآن کے صریح احکامات کی روشنی میں یہ بالکل درست ہے۔'
      }];
    }

    if (type === 'verse_gem_bank') {
      return [{
        id: `q-verse-${stageId}`,
        stageId,
        type: 'verse_gem_bank',
        title: `لیول ${stageNumber} — تکمیلِ کلمات و نگینہ پزل`,
        questionText: 'کلمۂ مبارکہ کے خالی مقام پر درست نگینہ چن کر فٹ کریں:',
        verseTemplate: 'لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ ___ اللهِ',
        missingWord: 'رَّسُوْلُ',
        wordBank: ['رَّسُوْلُ', 'نَبِيُّ', 'عَبْدُ', 'خَلِيْلُ'],
        explanation: 'کلمۂ طیبہ اسلام کا بنیادی کلمہ ہے: "اللہ کے سوا کوئی معبود نہیں، محمد ﷺ اللہ کے رسول ہیں۔"'
      }];
    }

    if (type === 'visual_letter_object') {
      const lettersData = [
        { emoji: '🕋', name: 'بیت اللہ (کعبہ)', letter: 'ب', options: ['ب', 'ت', 'ث', 'ج'] },
        { emoji: '📖', name: 'قرآن مجید', letter: 'ق', options: ['ق', 'ف', 'ک', 'ل'] },
        { emoji: '🕌', name: 'مسجد نبوی', letter: 'م', options: ['م', 'ن', 'ہ', 'و'] },
        { emoji: '🌙', name: 'ہلالِ رمضان', letter: 'ہ', options: ['ہ', 'ح', 'خ', 'ع'] }
      ];
      const selected = lettersData[(stageNumber - 1) % lettersData.length];
      return [{
        id: `q-vis-${stageId}`,
        stageId,
        type: 'visual_letter_object',
        title: `لیول ${stageNumber} — بصری تصویر و صوتی حرف`,
        questionText: 'تصویر کا مشاہدہ کریں اور اس کے پہلے حرف کا انتخاب فرمائیں:',
        objectEmoji: selected.emoji,
        objectName: selected.name,
        options: selected.options,
        correctOptionIndex: selected.options.indexOf(selected.letter),
        explanation: `${selected.name} کا پہلا حرف "${selected.letter}" ہے۔`
      }];
    }

    // Default Knowledge Questions Tailored for All 100 Stages
    return [
      {
        id: `q-std-1-${stageId}`,
        stageId,
        type: 'knowledge',
        title: `لیول ${stageNumber} — سوال اول: عقیدہ و توحید`,
        questionText: 'ایمانِ مجمل میں اللہ تعالیٰ کی وحدانیت کے بعد کس بات کا اقرار کیا گیا ہے؟',
        options: [
          'اس کے تمام اسماء و صفات کے ساتھ ایمان لانا اور تمام احکام کو قبول کرنا',
          'صرف زبان سے اقرار کرنا',
          'دنیاوی علوم میں کمال حاصل کرنا',
          'صرف فرشتوں کے نام یاد رکھنا'
        ],
        correctOptionIndex: 0,
        hint: 'ایمانِ مجمل کا متن: آمَنْتُ بِاللهِ كَمَا هُوَ بِأَسْمَائِهِ وَصِفَاتِهِ...',
        explanation: 'ایمانِ مجمل میں اللہ کے تمام پاکیزہ ناموں، صفات اور تمام نازل کردہ احکامات پر کامل ایمان لانا فرض ہے۔'
      },
      {
        id: `q-std-2-${stageId}`,
        stageId,
        type: 'knowledge',
        title: `لیول ${stageNumber} — سوال دوم: ارکانِ اسلام`,
        questionText: 'اسلام کی عمارت کتنے بنیادی ستونوں پر استوار کی گئی ہے؟',
        options: ['3 ستون', '4 ستون', '5 ستون (شہادت، نماز، زکوٰۃ، روزہ، حج)', '7 ستون'],
        correctOptionIndex: 2,
        hint: 'حدیث شریف: بُنِيَ الإِسْلامُ عَلَى خَمْسٍ...',
        explanation: 'حدیثِ ابن عمر رضی اللہ عنہ کے مطابق اسلام کے پانچ ستون ہیں۔'
      },
      {
        id: `q-std-3-${stageId}`,
        stageId,
        type: 'knowledge',
        title: `لیول ${stageNumber} — سوال سوم: قرآن و سنت کا فہم`,
        questionText: 'قرآن مجید کی سب سے پہلی نازل ہونے والی آیات مبارکہ کس سورۃ کی ہیں؟',
        options: ['سورۃ العلق (اقْرَأْ بِاسْمِ رَبِّكَ)', 'سورۃ الفاتحہ', 'سورۃ البقرۃ', 'سورۃ الاخلاص'],
        correctOptionIndex: 0,
        hint: 'غارِ حرا میں حضرت جبرائیل علیہ السلام نے پہلی وحی لائی۔',
        explanation: 'غارِ حرا میں سب سے پہلے سورۃ العلق کی ابتدائی پانچ آیات نازل ہوئیں۔'
      }
    ];
  }
}

// Global Singleton Adventure Game Engine
window.GameEngine = new AdventureGameEngine();

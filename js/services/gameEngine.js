/**
 * LearnHub Interactive Islamic Adventure Game Engine (v162.0.0)
 * Features:
 * 1. 100% Real Video Game Dynamics with Web Audio Synthesizers (Coins, Tap, Fanfare, LevelUp)
 * 2. Instant In-Game Dual Language Switcher (Urdu & English) across all 9 Realms
 * 3. In-Game Powerups (50/50, Ustadh AI Hint, Time Freeze, Extra Life)
 * 4. Avatar Character Progression & Daily Quest Missions
 */

class AdventureGameEngine {
  constructor() {
    this.storageKey = 'learnhub_adventure_profile_v1';
    this.gameLang = localStorage.getItem('learnhub_adv_lang') || 'ur';
    this.profile = this.loadProfile();
    this.audioCtx = null;
  }

  _initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.audioCtx = new AudioContext();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playTapSound() {
    try {
      this._initAudio();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch(e) {}
  }

  playCoinSound() {
    try {
      this._initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(now + 0.35);
    } catch(e) {}
  }

  playSuccessSound() {
    try {
      this._initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + (i * 0.08));
        gain.gain.setValueAtTime(0.25, now + (i * 0.08));
        gain.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.08) + 0.25);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + (i * 0.08));
        osc.stop(now + (i * 0.08) + 0.25);
      });
    } catch(e) {}
  }

  playErrorSound() {
    try {
      this._initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.25);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(now + 0.25);
    } catch(e) {}
  }

  playPowerupSound() {
    try {
      this._initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(now + 0.2);
    } catch(e) {}
  }

  setGameLanguage(lang = 'ur') {
    this.gameLang = lang;
    localStorage.setItem('learnhub_adv_lang', lang);
    return lang;
  }

  loadProfile() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const p = JSON.parse(stored);
        if (p && typeof p === 'object') {
          return this._sanitizeProfile(p);
        }
      }
    } catch (e) {}
    return this._createDefaultProfile();
  }

  _createDefaultProfile() {
    const defaultProfile = {
      level: 1,
      totalXp: 150,
      coins: 350,
      hearts: 5,
      maxHearts: 5,
      streak: 1,
      selectedAvatar: 'explorer',
      unlockedWorlds: ['cls-1'],
      completedStages: {},
      inventory: {
        aiHint: 5,
        fiftyFifty: 3,
        timeBoost: 3,
        extraLife: 2,
        streakShield: 1
      },
      weakAreas: [],
      achievements: ['ach-first-step'],
      claimedDailyReward: false,
      lastPlayedDate: new Date().toISOString().split('T')[0],
      dailyMissions: [
        { id: 'm1', title: { ur: 'جہان 1 کے 2 مراحل مکمل کریں', en: 'Complete 2 Stages in Realm 1' }, goal: 2, progress: 0, rewardCoins: 60, rewardXp: 40, claimed: false },
        { id: 'm2', title: { ur: 'ایک لفظی پزل حل کریں', en: 'Solve 1 Word Arranger Puzzle' }, goal: 1, progress: 0, rewardCoins: 40, rewardXp: 30, claimed: false },
        { id: 'm3', title: { ur: 'استاذ اے آئی کی مدد لیں', en: 'Consult Ustadh AI for a Hint' }, goal: 1, progress: 0, rewardCoins: 30, rewardXp: 20, claimed: false }
      ]
    };
    this.saveProfile(defaultProfile);
    return defaultProfile;
  }

  _sanitizeProfile(p) {
    p.level = p.level || 1;
    p.totalXp = Number(p.totalXp) || 0;
    p.coins = p.coins !== undefined ? Number(p.coins) : 350;
    p.hearts = p.hearts !== undefined ? Number(p.hearts) : 5;
    p.maxHearts = 5;
    p.streak = p.streak || 1;
    p.selectedAvatar = p.selectedAvatar || 'explorer';
    p.unlockedWorlds = Array.isArray(p.unlockedWorlds) && p.unlockedWorlds.length ? p.unlockedWorlds : ['cls-1'];
    p.completedStages = p.completedStages || {};
    p.inventory = {
      aiHint: 5,
      fiftyFifty: 3,
      timeBoost: 3,
      extraLife: 2,
      streakShield: 1,
      ...(p.inventory || {})
    };
    p.weakAreas = Array.isArray(p.weakAreas) ? p.weakAreas : [];
    p.achievements = Array.isArray(p.achievements) ? p.achievements : ['ach-first-step'];
    p.dailyMissions = Array.isArray(p.dailyMissions) && p.dailyMissions.length ? p.dailyMissions : [
      { id: 'm1', title: { ur: 'جہان 1 کے 2 مراحل مکمل کریں', en: 'Complete 2 Stages in Realm 1' }, goal: 2, progress: 0, rewardCoins: 60, rewardXp: 40, claimed: false },
      { id: 'm2', title: { ur: 'ایک لفظی پزل حل کریں', en: 'Solve 1 Word Arranger Puzzle' }, goal: 1, progress: 0, rewardCoins: 40, rewardXp: 30, claimed: false },
      { id: 'm3', title: { ur: 'استاذ اے آئی کی مدد لیں', en: 'Consult Ustadh AI for a Hint' }, goal: 1, progress: 0, rewardCoins: 30, rewardXp: 20, claimed: false }
    ];
    return p;
  }

  saveProfile(customProfile) {
    const p = customProfile || this.profile;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(p));
      if (window.DB && typeof window.DB.set === 'function') {
        window.DB.set('adventureProfile', p);
      }
    } catch (e) {}
    this.profile = p;
    return p;
  }

  getLevelInfo() {
    const xp = this.profile.totalXp;
    const levelThresholds = [0, 200, 500, 1000, 1800, 3000, 5000, 8000, 12000, 20000];
    let level = 1;
    for (let i = 0; i < levelThresholds.length; i++) {
      if (xp >= levelThresholds[i]) {
        level = i + 1;
      }
    }
    const currentBase = levelThresholds[level - 1] || 0;
    const nextTarget = levelThresholds[level] || (currentBase + 3000);
    const progressPercent = Math.min(Math.round(((xp - currentBase) / (nextTarget - currentBase)) * 100), 100);

    return {
      level,
      currentXp: xp,
      currentBase,
      nextTarget,
      progressPercent
    };
  }

  refillHearts() {
    if (this.profile.coins >= 50) {
      this.profile.coins -= 50;
      this.profile.hearts = 5;
      this.saveProfile();
      this.playCoinSound();
      return { success: true, message: this.gameLang === 'ur' ? 'تمام 5 دل بحال کر دیے گئے! ❤️' : 'All 5 Hearts fully restored! ❤️' };
    }
    return { success: false, message: this.gameLang === 'ur' ? 'دل بحال کرنے کے لیے کم از کم 50 سکے درکار ہیں۔' : 'You need at least 50 coins to restore hearts.' };
  }

  useFiftyFifty(currentOptions, correctIndex) {
    if (this.profile.inventory.fiftyFifty <= 0) {
      return { success: false, message: this.gameLang === 'ur' ? '50/50 پاور اپ ختم ہو چکا ہے!' : 'No 50/50 boosts left!' };
    }
    this.profile.inventory.fiftyFifty--;
    this.saveProfile();
    this.playPowerupSound();

    const wrongIndices = [0, 1, 2, 3].filter(idx => idx !== correctIndex);
    const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
    const eliminated = shuffled.slice(0, 2);

    return {
      success: true,
      eliminatedIndices: eliminated
    };
  }

  getAiHint(question) {
    if (this.profile.inventory.aiHint > 0) {
      this.profile.inventory.aiHint--;
      this.saveProfile();
    }
    this.playPowerupSound();

    const isUr = this.gameLang === 'ur';

    if (question && question.hint) {
      return typeof question.hint === 'object' ? (question.hint[this.gameLang] || question.hint.ur || question.hint.en) : question.hint;
    }
    if (question && question.explanation) {
      const exp = typeof question.explanation === 'object' ? (question.explanation[this.gameLang] || question.explanation.ur) : question.explanation;
      return (isUr ? 'استاذ اے آئی: ' : 'Ustadh AI: ') + exp.slice(0, 80) + '...';
    }

    const hintsUr = [
      'استاذ اے آئی: کلمہ طیبہ، عقیدہ توحید اور ارکانِ اسلام کے بنیادی ستونوں پر غور فرمائیں۔',
      'استاذ اے آئی: مکی اور مدنی ادوار کے سنہری تاریخی واقعات کو ذہن میں رکھیں۔',
      'استاذ اے آئی: حسنِ اخلاق اور سچائی کو پیشِ نظر رکھ کر جواب تلاش کریں۔'
    ];
    const hintsEn = [
      'Ustadh AI Hint: Focus on the foundational principles of Tawheed and Five Pillars.',
      'Ustadh AI Hint: Recall the chronological milestones of the Prophet ﷺ in Makkah & Madinah.',
      'Ustadh AI Hint: Reflect upon the core Islamic virtues of honesty, justice, and compassion.'
    ];

    const list = isUr ? hintsUr : hintsEn;
    return list[Math.floor(Math.random() * list.length)];
  }

  generateClass100Stages(worldId, grade = 1) {
    const isUr = this.gameLang === 'ur';
    const worldNames = {
      'cls-1': { ur: 'دیارِ ایمان', en: 'Diyar-e-Iman (Realm of Faith)' },
      'cls-2': { ur: 'نورِ قرآن', en: 'Noor-e-Quran (Light of Quran)' },
      'cls-3': { ur: 'سیرتِ مصطفیٰ ﷺ', en: 'Seerat-e-Mustafa ﷺ (Prophetic Era)' },
      'cls-4': { ur: 'قصص الانبیاء', en: 'Qasas-ul-Anbiya (Stories of Prophets)' },
      'cls-5': { ur: 'گلستانِ صحابہ', en: 'Gulistan-e-Sahaba (Companion Heroes)' },
      'cls-6': { ur: 'سلیقۂ اخلاق', en: 'Saleeqah-e-Akhlaq (Manners & Wisdom)' },
      'cls-7': { ur: 'محرابِ عبادت', en: 'Mihrab-e-Ibadat (Salah & Purification)' },
      'cls-8': { ur: 'سنہری دور', en: 'Sunehri Daur (Golden Islamic Era)' },
      'cls-9': { ur: 'بحر العلوم', en: 'Bahr-ul-Uloom (Ocean of Knowledge)' }
    };

    const wObj = worldNames[worldId] || { ur: 'جہان', en: 'Realm' };
    const wName = isUr ? wObj.ur : wObj.en;

    return Array.from({ length: 100 }, (_, i) => {
      const num = i + 1;
      let type = 'quiz';
      if (num % 10 === 0) type = 'boss_exam';
      else if (num % 5 === 0) type = 'word_puzzle';
      else if (num % 4 === 0) type = 'memory_match';
      else if (num % 3 === 0) type = 'timeline_drag';

      return {
        id: worldId + '-s' + num,
        stageNumber: num,
        worldId: worldId,
        title: (isUr ? ('مرحلہ ' + num + ' • ' + wName) : ('Stage ' + num + ' • ' + wName)),
        type: type,
        rewardXp: 50 + (num * 5),
        rewardCoins: 20 + Math.floor(num * 2),
        isBoss: num % 10 === 0
      };
    });
  }

  getMiniGameData(stageId, type) {
    const worldId = stageId ? stageId.split('-s')[0] : 'cls-1';
    const stageNum = stageId ? parseInt(stageId.split('-s')[1], 10) : 1;
    const isUr = this.gameLang === 'ur';

    if (type === 'word_puzzle') {
      const puzzles = {
        'cls-1': {
          targetPhrase: 'لَا إِلٰهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ',
          translation: isUr ? 'اللہ کے سوا کوئی معبود نہیں، اور محمد ﷺ اللہ کے رسول ہیں۔' : 'There is no deity worthy of worship except Allah, and Muhammad is His Messenger.',
          words: ['مُحَمَّدٌ', 'إِلَّا', 'رَسُولُ اللَّهِ', 'لَا إِلٰهَ', 'اللَّهُ'],
          correctSequence: ['لَا إِلٰهَ', 'إِلَّا', 'اللَّهُ', 'مُحَمَّدٌ', 'رَسُولُ اللَّهِ']
        },
        'cls-2': {
          targetPhrase: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
          translation: isUr ? 'بے شک ہم نے آپ کو حوضِ کوثر عطا فرمایا۔' : 'Indeed, We have granted you, [O Muhammad], al-Kawthar.',
          words: ['الْكَوْثَرَ', 'إِنَّا', 'أَعْطَيْنَاكَ'],
          correctSequence: ['إِنَّا', 'أَعْطَيْنَاكَ', 'الْكَوْثَرَ']
        },
        'cls-3': {
          targetPhrase: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ',
          translation: isUr ? 'اور بے شک آپ اخلاق کے اعلیٰ ترین درجے پر فائز ہیں۔' : 'And indeed, you are of a great moral character.',
          words: ['خُلُقٍ', 'عَظِيمٍ', 'وَإِنَّكَ', 'لَعَلَىٰ'],
          correctSequence: ['وَإِنَّكَ', 'لَعَلَىٰ', 'خُلُقٍ', 'عَظِيمٍ']
        },
        'cls-7': {
          targetPhrase: 'حَيَّ عَلَى الصَّلَاةِ حَيَّ عَلَى الْفَلَاحِ',
          translation: isUr ? 'نماز کی طرف آؤ، کامیابی کی طرف آؤ۔' : 'Come to prayer, come to success.',
          words: ['الْفَلَاحِ', 'حَيَّ عَلَى', 'الصَّلَاةِ', 'حَيَّ عَلَى'],
          correctSequence: ['حَيَّ عَلَى', 'الصَّلَاةِ', 'حَيَّ عَلَى', 'الْفَلَاحِ']
        }
      };
      const p = puzzles[worldId] || puzzles['cls-1'];
      return {
        targetPhrase: p.targetPhrase,
        translation: p.translation,
        words: [...p.words].sort(() => Math.random() - 0.5),
        correctSequence: p.correctSequence
      };
    }

    if (type === 'memory_match') {
      const realmCards = {
        'cls-1': [
          { id: 1, pairId: 'shahada', symbol: '☝️', label: isUr ? 'توحید' : 'Tawheed' },
          { id: 2, pairId: 'shahada', symbol: '☝️', label: isUr ? 'توحید' : 'Tawheed' },
          { id: 3, pairId: 'kaaba', symbol: '🕋', label: isUr ? 'کعبہ' : 'Al-Kaaba' },
          { id: 4, pairId: 'kaaba', symbol: '🕋', label: isUr ? 'کعبہ' : 'Al-Kaaba' },
          { id: 5, pairId: 'dua', symbol: '🤲', label: isUr ? 'دعا' : 'Dua' },
          { id: 6, pairId: 'dua', symbol: '🤲', label: isUr ? 'دعا' : 'Dua' },
          { id: 7, pairId: 'light', symbol: '✨', label: isUr ? 'نور' : 'Noor' },
          { id: 8, pairId: 'light', symbol: '✨', label: isUr ? 'نور' : 'Noor' }
        ],
        'cls-2': [
          { id: 1, pairId: 'quran', symbol: '📖', label: isUr ? 'قرآن' : 'Quran' },
          { id: 2, pairId: 'quran', symbol: '📖', label: isUr ? 'قرآن' : 'Quran' },
          { id: 3, pairId: 'pen', symbol: '✒️', label: isUr ? 'قلم' : 'Al-Qalam' },
          { id: 4, pairId: 'pen', symbol: '✒️', label: isUr ? 'قلم' : 'Al-Qalam' },
          { id: 5, pairId: 'star', symbol: '⭐', label: isUr ? 'آیت' : 'Ayah' },
          { id: 6, pairId: 'star', symbol: '⭐', label: isUr ? 'آیت' : 'Ayah' },
          { id: 7, pairId: 'heart', symbol: '💚', label: isUr ? 'حفظ' : 'Hifz' },
          { id: 8, pairId: 'heart', symbol: '💚', label: isUr ? 'حفظ' : 'Hifz' }
        ]
      };
      const cards = realmCards[worldId] || realmCards['cls-1'];
      return { cards: [...cards].sort(() => Math.random() - 0.5) };
    }

    if (type === 'timeline_drag') {
      const timelines = {
        'cls-3': {
          events: [
            { id: 'e1', title: isUr ? 'عام الفیل میں نبی کریم ﷺ کی ولادتِ باسعادت' : 'Birth of Prophet Muhammad ﷺ in Year of Elephant', year: '570 CE', order: 1 },
            { id: 'e2', title: isUr ? 'غارِ حرا میں پہلی وحی کا نزول' : 'First Divine Revelation in Cave Hira', year: '610 CE', order: 2 },
            { id: 'e3', title: isUr ? 'مکہ مکرمہ سے مدینہ منورہ کی طرف ہجرت' : 'The Great Migration (Hijrah to Madinah)', year: '622 CE', order: 3 },
            { id: 'e4', title: isUr ? 'فتحِ مکہ اور کعبہ میں داخلہ' : 'Conquest of Makkah (Fath Makkah)', year: '630 CE', order: 4 }
          ],
          correctOrder: ['e1', 'e2', 'e3', 'e4']
        },
        'cls-4': {
          events: [
            { id: 'p1', title: isUr ? 'حضرت آدم علیہ السلام (ابو البشر)' : 'Prophet Adam (AS) - Father of Humanity', year: 'Creation', order: 1 },
            { id: 'p2', title: isUr ? 'حضرت نوح علیہ السلام اور عظیم کشتی' : 'Prophet Nuh (AS) and the Great Ark', year: 'Early Era', order: 2 },
            { id: 'p3', title: isUr ? 'حضرت ابراہیم علیہ السلام کی تعمیرِ کعبہ' : 'Prophet Ibrahim (AS) builds the Kaaba', year: 'Middle Era', order: 3 },
            { id: 'p4', title: isUr ? 'حضرت موسیٰ علیہ السلام اور کوہِ طور' : 'Prophet Musa (AS) at Mount Sinai', year: 'Later Era', order: 4 }
          ],
          correctOrder: ['p1', 'p2', 'p3', 'p4']
        }
      };
      const t = timelines[worldId] || timelines['cls-3'];
      return {
        events: [...t.events].sort(() => Math.random() - 0.5),
        correctOrder: t.correctOrder
      };
    }

    const questionsByRealm = {
      'cls-1': [
        {
          question: isUr ? 'اسلام کا پہلا اور بنیادی رکن کیا ہے؟' : 'What is the First Pillar of Islam?',
          options: isUr 
            ? ['کلمۂ شہادت (توحید و رسالت کا اقرار)', 'نماز قائم کرنا', 'زکوٰۃ ادا کرنا', 'رمضان کے روزے'] 
            : ['Shahadah (Declaration of Faith)', 'Salah (Daily Prayers)', 'Zakat (Almsgiving)', 'Sawm (Fasting)'],
          correctIndex: 0,
          hint: isUr ? 'یہ شہادت ہے کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اس کے رسول ہیں۔' : 'It is the declaration that none is worthy of worship except Allah.',
          explanation: isUr ? 'اسلام کا پہلا رکن کلمۂ شہادت ہے جس سے انسان دائرۂ اسلام میں داخل ہوتا ہے۔' : 'The First Pillar is Shahadah: testifying that there is no god but Allah and Muhammad ﷺ is His Messenger.'
        },
        {
          question: isUr ? 'اللہ تعالیٰ کے 99 اسمائے حسنیٰ میں "الرَّحْمٰن" کا کیا مفہوم ہے؟' : 'What does "Ar-Rahman" mean in the 99 Names of Allah?',
          options: isUr 
            ? ['بے حد رحم فرمانے والا / تمام مخلوق پر مہربان', 'سب کچھ جاننے والا', 'پیدا فرمانے والا', 'بادشاہِ حقیقی'] 
            : ['The Most Gracious / Entirely Merciful', 'The All-Knowing', 'The Creator', 'The Supreme King'],
          correctIndex: 0,
          hint: isUr ? 'یہ دنیا میں تمام مخلوقات کے لیے اللہ کی عام رحمت کو ظاہر کرتا ہے۔' : 'It describes Allah’s all-encompassing mercy for all creation.',
          explanation: isUr ? 'الرحمن کا مطلب ہے بے پایاں رحمت والا جس کی رحمت تمام کائنات پر محیط ہے۔' : 'Ar-Rahman means The Most Gracious, whose mercy encompasses all creation in this world.'
        }
      ],
      'cls-2': [
        {
          question: isUr ? 'قرآن مجید میں کل کتنی سورتیں ہیں؟' : 'How many Surahs are there in the Holy Quran?',
          options: isUr ? ['114 سورتیں', '110 سورتیں', '120 سورتیں', '100 سورتیں'] : ['114 Surahs', '110 Surahs', '120 Surahs', '100 Surahs'],
          correctIndex: 0,
          hint: isUr ? 'سورۃ الفاتحہ سے شروع ہو کر سورۃ الناس پر ختم ہوتا ہے۔' : 'It starts with Surah Al-Fatihah and ends with Surah An-Nas.',
          explanation: isUr ? 'قرآن مجید میں کل 114 سورتیں اور 30 پارے ہیں۔' : 'The Holy Quran consists of 114 Surahs divided across 30 Juz.'
        },
        {
          question: isUr ? 'قرآنِ مجید کی کس سورت کو "قلبُ القرآن" (قرآن کا دل) کہا گیا ہے؟' : 'Which Surah is revered as the "Heart of the Quran"?',
          options: isUr ? ['سورۃ یٰسین', 'سورۃ الملک', 'سورۃ الکہف', 'سورۃ البقرہ'] : ['Surah Ya-Sin', 'Surah Al-Mulk', 'Surah Al-Kahf', 'Surah Al-Baqarah'],
          correctIndex: 0,
          hint: isUr ? 'یہ قرآن مجید کی 36ویں سورت ہے۔' : 'It is Surah number 36 in the Quran.',
          explanation: isUr ? 'سورۃ یٰسین کو اس کے عظیم مضامین کی وجہ سے قلب القرآن کا درجہ دیا گیا ہے۔' : 'Surah Ya-Sin is traditionally honored for its profound reminders of resurrection and faith.'
        }
      ],
      'cls-3': [
        {
          question: isUr ? 'نبی کریم ﷺ کی ولادتِ باسعادت کس مبارک شہر میں ہوئی؟' : 'In which city was Prophet Muhammad ﷺ born?',
          options: isUr ? ['مکہ مکرمہ', 'مدینہ منورہ', 'بیت المقدس', 'طائف'] : ['Makkah Al-Mukarramah', 'Madinah Al-Munawwarah', 'Jerusalem', 'Taif'],
          correctIndex: 0,
          hint: isUr ? 'یہ وہ شہر ہے جہاں بیت اللہ (کعبہ شریف) واقع ہے۔' : 'It is the city where the Holy Kaaba is located.',
          explanation: isUr ? 'آپ ﷺ کی ولادت 570ء میں مکہ مکرمہ میں ہوئی۔' : 'Prophet Muhammad ﷺ was born in Makkah in 570 CE.'
        },
        {
          question: isUr ? 'اسلام کی تاریخ کا پہلا اور عظیم معرکہ کون سا تھا؟' : 'What was the first major battle in Islamic history?',
          options: isUr ? ['غزوۂ بدر (2 ہجری)', 'غزوۂ احد (3 ہجری)', 'غزوۂ خندق (5 ہجری)', 'غزوۂ حنین (8 ہجری)'] : ['Battle of Badr (2 AH)', 'Battle of Uhud (3 AH)', 'Battle of Khandaq (5 AH)', 'Battle of Hunayn (8 AH)'],
          correctIndex: 0,
          hint: isUr ? 'یہ رمضان المبارک میں 2 ہجری کو پیش آیا تھا۔' : 'It occurred in Ramadan in the 2nd year after Hijrah.',
          explanation: isUr ? 'غزوہ بدر اسلام اور کفر کا پہلا فیصلہ کن معرکہ تھا۔' : 'The Battle of Badr took place in 2 AH and was the decisive victory for truth.'
        }
      ],
      'cls-4': [
        {
          question: isUr ? 'اللہ کے حکم سے عظیم کشتی (سفینہ) بنانے والے پیغمبر کون تھے؟' : 'Which Prophet was commanded to build the Great Ark?',
          options: isUr ? ['حضرت نوح علیہ السلام', 'حضرت ابراہیم علیہ السلام', 'حضرت موسیٰ علیہ السلام', 'حضرت یونس علیہ السلام'] : ['Prophet Nuh (AS)', 'Prophet Ibrahim (AS)', 'Prophet Musa (AS)', 'Prophet Yunus (AS)'],
          correctIndex: 0,
          hint: isUr ? 'انہوں نے ساڑھے نو سو سال اپنی قوم کو دین کی دعوت دی۔' : 'He preached to his people for 950 years.',
          explanation: isUr ? 'حضرت نوح علیہ السلام نے طوفان سے ایمان والوں کو بچانے کے لیے کشتی بنائی۔' : 'Prophet Nuh (AS) built the Ark under divine inspiration to save believers and animals.'
        }
      ],
      'cls-5': [
        {
          question: isUr ? 'اسلام کے سب سے پہلے خلیفۂ راشد کون منتخب ہوئے؟' : 'Who was the First Caliph of Islam (Khalifah)?',
          options: isUr ? ['حضرت ابوبکر صدیق رضی اللہ عنہ', 'حضرت عمر بن خطاب رضی اللہ عنہ', 'حضرت عثمان غنی رضی اللہ عنہ', 'حضرت علی المرتضیٰ رضی اللہ عنہ'] : ['Abu Bakr As-Siddiq (RA)', 'Umar ibn Al-Khattab (RA)', 'Uthman ibn Affan (RA)', 'Ali ibn Abi Talib (RA)'],
          correctIndex: 0,
          hint: isUr ? 'آپ ﷺ کے غار کے رفیق اور مردوں میں سب سے پہلے اسلام لانے والے تھے۔' : 'He was the closest companion and the first adult male to accept Islam.',
          explanation: isUr ? 'حضرت ابوبکر صدیق رضی اللہ عنہ کو مسلمانوں نے اپنا پہلا خلیفہ منتخب کیا۔' : 'Abu Bakr As-Siddiq (RA) was chosen as the first Caliph following the demise of the Prophet ﷺ.'
        }
      ],
      'cls-6': [
        {
          question: isUr ? 'اسلام میں سچائی اور راست بازی (صدق) کا کیا مقام ہے؟' : 'What is the Islamic teaching regarding honesty and truthfulness (Sidq)?',
          options: isUr ? ['یہ لازمی بنیادی نیکی ہے جو جنت کی راہ دکھاتی ہے', 'یہ اختیاری ہے', 'صرف دوستوں کے ساتھ ضروری ہے', 'کوئی اہمیت نہیں'] : ['It is an obligatory core virtue leading to righteousness', 'It is optional', 'Only needed among family', 'None of these'],
          correctIndex: 0,
          hint: isUr ? 'نبی کریم ﷺ نے فرمایا: سچائی نیکی کی طرف اور نیکی جنت کی طرف لے جاتی ہے۔' : 'The Prophet ﷺ stated that truthfulness leads to righteousness, which leads to Paradise.',
          explanation: isUr ? 'سچائی ہر مسلمان کے کردار کا ناگزیر اور مقدس ستون ہے۔' : 'Sidq (truthfulness) is an essential character trait of a true Muslim.'
        }
      ],
      'cls-7': [
        {
          question: isUr ? 'دن اور رات میں کل کتنی نمازیں فرض ہیں؟' : 'How many obligatory (Fard) daily prayers are there in Islam?',
          options: isUr ? ['5 وقت کی نمازیں', '3 وقت کی نمازیں', '7 وقت کی نمازیں', '4 وقت کی نمازیں'] : ['5 Daily Prayers', '3 Daily Prayers', '7 Daily Prayers', '4 Daily Prayers'],
          correctIndex: 0,
          hint: isUr ? 'فجر، ظہر، عصر، مغرب، اور عشاء۔' : 'Fajr, Dhuhr, Asr, Maghrib, and Isha.',
          explanation: isUr ? 'ہر مسلمان پر دن رات میں 5 نمازیں فرض کی گئی ہیں۔' : 'Muslims perform 5 daily prayers: Fajr, Dhuhr, Asr, Maghrib, and Isha.'
        }
      ],
      'cls-8': [
        {
          question: isUr ? 'اسلام کے سنہری دور میں بغداد میں قائم ہونے والا عظیم سائنسی و فکری مرکز کون سا تھا؟' : 'What was the famous center of learning founded in Baghdad during the Golden Era?',
          options: isUr ? ['بیت الحکمۃ (دار الحکمت)', 'جامعہ ازہر', 'مدرسہ نظامیہ', 'قرطبہ اکیڈمی'] : ['Bayt al-Hikmah (House of Wisdom)', 'Al-Azhar', 'Nizamiyya', 'Cordoba Academy'],
          correctIndex: 0,
          hint: isUr ? 'جہاں دنیا بھر کے سائنسی اور فلسفیانہ علوم کا عربی میں ترجمہ اور تحقیق کی گئی۔' : 'It translated scientific, mathematical, and philosophical texts.',
          explanation: isUr ? 'بیت الحکمہ بغداد کی عظیم بین الاقوامی ریسرچ یونیورسٹی تھی۔' : 'Bayt al-Hikmah (House of Wisdom) in Baghdad was a renowned intellectual academy.'
        }
      ],
      'cls-9': [
        {
          question: isUr ? 'علمِ حدیث میں سب سے اعلیٰ اور مستند ترین درجۂ روایت کون سا ہے؟' : 'What is the highest and most authentic grade of Hadith in Hadith terminology?',
          options: isUr ? ['حدیثِ صحیح', 'حدیثِ حسن', 'حدیثِ ضعیف', 'حدیثِ موضوع'] : ['Sahih (Authentic & Sound)', 'Hasan (Good)', 'Daif (Weak)', 'Mawdu (Fabricated)'],
          correctIndex: 0,
          hint: isUr ? 'جس کی سند مسلسل عادل اور ضابط راویوں سے مروی ہو۔' : 'Narrated by continuous chains of upright, precise transmitters with no defects.',
          explanation: isUr ? 'حدیثِ صحیح وہ ہے جو صحت و ثبوت کے تمام کڑے شرائط پر پوری اترے۔' : 'Sahih is the highest grade of Hadith fulfilling all criteria of rigorous authentication.'
        }
      ]
    };

    const pool = questionsByRealm[worldId] || questionsByRealm['cls-1'];
    const selectedQ = pool[stageNum % pool.length] || pool[0];
    return { ...selectedQ };
  }

  claimDailyTreasure() {
    const today = new Date().toISOString().split('T')[0];
    if (this.profile.lastPlayedDate === today && this.profile.claimedDailyReward) {
      return { 
        success: false, 
        message: this.gameLang === 'ur' ? 'آپ آج کا روزانہ خزانہ پہلے ہی کھول چکے ہیں! کل دوبارہ تشریف لائیں۔' : 'You have already unlocked today treasure chest! Come back tomorrow.' 
      };
    }

    const bonusCoins = 120 * this.profile.streak;
    const bonusXp = 60 * this.profile.streak;
    this.profile.coins += bonusCoins;
    this.profile.totalXp += bonusXp;
    this.profile.inventory.aiHint += 2;
    this.profile.inventory.fiftyFifty += 1;
    this.profile.hearts = 5;
    this.profile.claimedDailyReward = true;
    this.profile.lastPlayedDate = today;
    this.saveProfile();
    this.playCoinSound();

    return {
      success: true,
      coins: bonusCoins,
      xp: bonusXp,
      hints: 2,
      fiftyFifty: 1,
      streak: this.profile.streak
    };
  }
}

window.GameEngine = new AdventureGameEngine();
console.log('LearnHub GameEngine v162.0.0 initialized with audio synthesizers & dual-mode!');

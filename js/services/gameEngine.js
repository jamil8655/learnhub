/**
 * LearnHub Interactive Islamic Adventure Game Engine (v159.0.0)
 * 9 Sacred Realms, 100 Progressive Stages per Realm, Dynamic Question Pools,
 * 4 Interactive Mini-Game Modes, Ustadh AI Companion, and Audio FX.
 */

class AdventureGameEngine {
  constructor() {
    this.storageKey = 'learnhub_adventure_profile_v1';
    this.profile = this.loadProfile();
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
      lastPlayedDate: new Date().toISOString().split('T')[0]
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

  refillHearts() {
    if (this.profile.coins >= 50) {
      this.profile.coins -= 50;
      this.profile.hearts = 5;
      this.saveProfile();
      return { success: true, message: 'Hearts fully restored to 5! ❤️' };
    }
    return { success: false, message: 'You need at least 50 coins to restore hearts.' };
  }

  getAiHint(question) {
    if (this.profile.inventory.aiHint > 0) {
      this.profile.inventory.aiHint--;
      this.saveProfile();
    }

    if (question && question.hint) return question.hint;
    if (question && question.explanation) return 'Ustadh AI: Focus on ' + question.explanation.slice(0, 70) + '...';

    const hints = [
      'Ustadh AI Hint: Ponder the Oneness of Allah (Tawheed) and foundational sunnah.',
      'Ustadh AI Hint: Recall the historical milestones of the Makkan and Madani periods.',
      'Ustadh AI Hint: Consider the core ethical teachings of truthfulness and compassion in Islam.'
    ];
    return hints[Math.floor(Math.random() * hints.length)];
  }

  generateClass100Stages(worldId, grade = 1) {
    const worldNames = {
      'cls-1': 'Diyar-e-Iman (Realm of Faith)',
      'cls-2': 'Noor-e-Quran (Light of Quran)',
      'cls-3': 'Seerat-e-Mustafa ﷺ (Prophetic Era)',
      'cls-4': 'Qasas-ul-Anbiya (Stories of Prophets)',
      'cls-5': 'Gulistan-e-Sahaba (Companion Heroes)',
      'cls-6': 'Saleeqah-e-Akhlaq (Manners & Wisdom)',
      'cls-7': 'Mihrab-e-Ibadat (Salah & Purification)',
      'cls-8': 'Sunehri Daur (Golden Islamic Era)',
      'cls-9': 'Bahr-ul-Uloom (Ocean of Knowledge)'
    };

    const wName = worldNames[worldId] || 'Islamic Realm';

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
        title: 'Stage ' + num + ' • ' + wName,
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

    if (type === 'word_puzzle') {
      const puzzles = {
        'cls-1': {
          targetPhrase: 'لَا إِلٰهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ',
          translation: 'There is no true deity worthy of worship except Allah, and Muhammad is His Messenger.',
          words: ['مُحَمَّدٌ', 'إِلَّا', 'رَسُولُ اللَّهِ', 'لَا إِلٰهَ', 'اللَّهُ'],
          correctSequence: ['لَا إِلٰهَ', 'إِلَّا', 'اللَّهُ', 'مُحَمَّدٌ', 'رَسُولُ اللَّهِ']
        },
        'cls-2': {
          targetPhrase: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
          translation: 'Indeed, We have granted you, [O Muhammad], al-Kawthar.',
          words: ['الْكَوْثَرَ', 'إِنَّا', 'أَعْطَيْنَاكَ'],
          correctSequence: ['إِنَّا', 'أَعْطَيْنَاكَ', 'الْكَوْثَرَ']
        },
        'cls-3': {
          targetPhrase: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ',
          translation: 'And indeed, you are of a great moral character.',
          words: ['خُلُقٍ', 'عَظِيمٍ', 'وَإِنَّكَ', 'لَعَلَىٰ'],
          correctSequence: ['وَإِنَّكَ', 'لَعَلَىٰ', 'خُلُقٍ', 'عَظِيمٍ']
        },
        'cls-7': {
          targetPhrase: 'حَيَّ عَلَى الصَّلَاةِ حَيَّ عَلَى الْفَلَاحِ',
          translation: 'Come to prayer, come to success.',
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
          { id: 1, pairId: 'shahada', symbol: '☝️', label: 'Tawheed' },
          { id: 2, pairId: 'shahada', symbol: '☝️', label: 'Tawheed' },
          { id: 3, pairId: 'kaaba', symbol: '🕋', label: 'Al-Kaaba' },
          { id: 4, pairId: 'kaaba', symbol: '🕋', label: 'Al-Kaaba' },
          { id: 5, pairId: 'dua', symbol: '🤲', label: 'Dua' },
          { id: 6, pairId: 'dua', symbol: '🤲', label: 'Dua' },
          { id: 7, pairId: 'light', symbol: '✨', label: 'Noor' },
          { id: 8, pairId: 'light', symbol: '✨', label: 'Noor' }
        ],
        'cls-2': [
          { id: 1, pairId: 'quran', symbol: '📖', label: 'Quran' },
          { id: 2, pairId: 'quran', symbol: '📖', label: 'Quran' },
          { id: 3, pairId: 'pen', symbol: '✒️', label: 'Al-Qalam' },
          { id: 4, pairId: 'pen', symbol: '✒️', label: 'Al-Qalam' },
          { id: 5, pairId: 'star', symbol: '⭐', label: 'Ayah' },
          { id: 6, pairId: 'star', symbol: '⭐', label: 'Ayah' },
          { id: 7, pairId: 'heart', symbol: '💚', label: 'Hifz' },
          { id: 8, pairId: 'heart', symbol: '💚', label: 'Hifz' }
        ]
      };
      const cards = realmCards[worldId] || realmCards['cls-1'];
      return { cards: [...cards].sort(() => Math.random() - 0.5) };
    }

    if (type === 'timeline_drag') {
      const timelines = {
        'cls-3': {
          events: [
            { id: 'e1', title: 'Birth of Prophet Muhammad ﷺ in Year of Elephant', year: '570 CE', order: 1 },
            { id: 'e2', title: 'First Divine Revelation in Cave Hira', year: '610 CE', order: 2 },
            { id: 'e3', title: 'The Great Migration (Hijrah to Madinah)', year: '622 CE', order: 3 },
            { id: 'e4', title: 'Conquest of Makkah (Fath Makkah)', year: '630 CE', order: 4 }
          ],
          correctOrder: ['e1', 'e2', 'e3', 'e4']
        },
        'cls-4': {
          events: [
            { id: 'p1', title: 'Prophet Adam (AS) - Father of Humanity', year: 'Creation', order: 1 },
            { id: 'p2', title: 'Prophet Nuh (AS) and the Great Ark', year: 'Early Era', order: 2 },
            { id: 'p3', title: 'Prophet Ibrahim (AS) builds the Kaaba', year: 'Middle Era', order: 3 },
            { id: 'p4', title: 'Prophet Musa (AS) at Mount Sinai', year: 'Later Era', order: 4 }
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
          question: 'What is the First Pillar of Islam?',
          options: ['Shahadah (Declaration of Faith)', 'Salah (Daily Prayers)', 'Zakat (Almsgiving)', 'Sawm (Fasting)'],
          correctIndex: 0,
          hint: 'It is the declaration that none is worthy of worship except Allah.',
          explanation: 'The First Pillar is Shahadah: testifying that there is no god but Allah and Muhammad ﷺ is His Messenger.'
        },
        {
          question: 'What does "Ar-Rahman" mean in the 99 Names of Allah?',
          options: ['The Most Gracious / Entirely Merciful', 'The All-Knowing', 'The Creator', 'The Supreme King'],
          correctIndex: 0,
          hint: 'It describes Allah’s all-encompassing mercy for all creation.',
          explanation: 'Ar-Rahman means The Most Gracious, whose mercy encompasses all creation in this world.'
        }
      ],
      'cls-2': [
        {
          question: 'How many Surahs are there in the Holy Quran?',
          options: ['114 Surahs', '110 Surahs', '120 Surahs', '100 Surahs'],
          correctIndex: 0,
          hint: 'It starts with Surah Al-Fatihah and ends with Surah An-Nas.',
          explanation: 'The Holy Quran consists of 114 Surahs divided across 30 Juz.'
        },
        {
          question: 'Which Surah is revered as the "Heart of the Quran"?',
          options: ['Surah Ya-Sin', 'Surah Al-Mulk', 'Surah Al-Kahf', 'Surah Al-Baqarah'],
          correctIndex: 0,
          hint: 'It is Surah number 36 in the Quran.',
          explanation: 'Surah Ya-Sin is traditionally honored for its profound reminders of resurrection and faith.'
        }
      ],
      'cls-3': [
        {
          question: 'In which city was Prophet Muhammad ﷺ born?',
          options: ['Makkah Al-Mukarramah', 'Madinah Al-Munawwarah', 'Jerusalem', 'Taif'],
          correctIndex: 0,
          hint: 'It is the city where the Holy Kaaba is located.',
          explanation: 'Prophet Muhammad ﷺ was born in Makkah in 570 CE.'
        },
        {
          question: 'What was the first major battle in Islamic history?',
          options: ['Battle of Badr (2 AH)', 'Battle of Uhud (3 AH)', 'Battle of Khandaq (5 AH)', 'Battle of Hunayn (8 AH)'],
          correctIndex: 0,
          hint: 'It occurred in Ramadan in the 2nd year after Hijrah.',
          explanation: 'The Battle of Badr took place in 2 AH and was the decisive victory for truth.'
        }
      ],
      'cls-4': [
        {
          question: 'Which Prophet was commanded to build the Great Ark?',
          options: ['Prophet Nuh (AS)', 'Prophet Ibrahim (AS)', 'Prophet Musa (AS)', 'Prophet Yunus (AS)'],
          correctIndex: 0,
          hint: 'He preached to his people for 950 years.',
          explanation: 'Prophet Nuh (AS) built the Ark under divine inspiration to save believers and animals.'
        }
      ],
      'cls-5': [
        {
          question: 'Who was the First Caliph of Islam (Khalifah)?',
          options: ['Abu Bakr As-Siddiq (RA)', 'Umar ibn Al-Khattab (RA)', 'Uthman ibn Affan (RA)', 'Ali ibn Abi Talib (RA)'],
          correctIndex: 0,
          hint: 'He was the closest companion and the first adult male to accept Islam.',
          explanation: 'Abu Bakr As-Siddiq (RA) was chosen as the first Caliph following the demise of the Prophet ﷺ.'
        }
      ],
      'cls-6': [
        {
          question: 'What is the Islamic teaching regarding honesty and truthfulness (Sidq)?',
          options: ['It is an obligatory core virtue leading to righteousness', 'It is optional', 'Only needed among family', 'None of these'],
          correctIndex: 0,
          hint: 'The Prophet ﷺ stated that truthfulness leads to righteousness, which leads to Paradise.',
          explanation: 'Sidq (truthfulness) is an essential character trait of a true Muslim.'
        }
      ],
      'cls-7': [
        {
          question: 'How many obligatory (Fard) daily prayers are there in Islam?',
          options: ['5 Daily Prayers', '3 Daily Prayers', '7 Daily Prayers', '4 Daily Prayers'],
          correctIndex: 0,
          hint: 'Fajr, Dhuhr, Asr, Maghrib, and Isha.',
          explanation: 'Muslims perform 5 daily prayers: Fajr, Dhuhr, Asr, Maghrib, and Isha.'
        }
      ],
      'cls-8': [
        {
          question: 'What was the famous center of learning founded in Baghdad during the Golden Era?',
          options: ['Bayt al-Hikmah (House of Wisdom)', 'Al-Azhar', 'Nizamiyya', 'Cordoba Academy'],
          correctIndex: 0,
          hint: 'It translated scientific, mathematical, and philosophical texts.',
          explanation: 'Bayt al-Hikmah (House of Wisdom) in Baghdad was a renowned intellectual academy.'
        }
      ],
      'cls-9': [
        {
          question: 'What is the highest and most authentic grade of Hadith in Hadith terminology?',
          options: ['Sahih (Authentic & Sound)', 'Hasan (Good)', 'Daif (Weak)', 'Mawdu (Fabricated)'],
          correctIndex: 0,
          hint: 'Narrated by continuous chains of upright, precise transmitters with no defects.',
          explanation: 'Sahih is the highest grade of Hadith fulfilling all criteria of rigorous authentication.'
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
      return { success: false, message: 'You have already unlocked today treasure chest! Come back tomorrow.' };
    }

    const bonusCoins = 120 * this.profile.streak;
    const bonusXp = 60 * this.profile.streak;
    this.profile.coins += bonusCoins;
    this.profile.totalXp += bonusXp;
    this.profile.inventory.aiHint += 2;
    this.profile.hearts = 5;
    this.profile.claimedDailyReward = true;
    this.profile.lastPlayedDate = today;
    this.saveProfile();

    return {
      success: true,
      coins: bonusCoins,
      xp: bonusXp,
      hints: 2,
      streak: this.profile.streak
    };
  }
}

window.GameEngine = new AdventureGameEngine();
console.log('LearnHub GameEngine v159.0.0 initialized with full 9 Realms content!');

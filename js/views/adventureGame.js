/**
 * LearnHub Islamic Adventure Game View (v159.0.0)
 * #1 Spotlight Experience for Young Scholars & Children
 * With 9 Realms Roadmap, Interactive Mini-Games, Ustadh AI Companion, Hearts Refill, and Audio FX
 */

window.Views = window.Views || {};

window.Views.renderAdventureGame = function(params = {}, query = {}) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');

  const engine = window.GameEngine;
  const p = engine ? engine.profile : { level: 1, totalXp: 150, coins: 350, hearts: 5, streak: 1 };

  const worlds = [
    { id: 'cls-1', number: 1, name: isRtl ? 'دیارِ ایمان' : 'Realm 1: Diyar-e-Iman', subtitle: isRtl ? 'کلمۂ طیبہ، ارکانِ اسلام اور اللہ کے مبارک نام' : 'Foundations of Faith, Shahadah & Asma-ul-Husna', icon: '🌟', color: 'from-amber-500 to-teal-700' },
    { id: 'cls-2', number: 2, name: isRtl ? 'نورِ قرآن' : 'Realm 2: Noor-e-Quran', subtitle: isRtl ? 'تجوید، مخارجِ حروف اور نورانی سورتیں' : 'Tajweed Rules, Arabic Makharij & Short Surahs', icon: '📖', color: 'from-teal-600 to-emerald-800' },
    { id: 'cls-3', number: 3, name: isRtl ? 'سیرتِ مصطفیٰ ﷺ' : 'Realm 3: Seerat-e-Mustafa ﷺ', subtitle: isRtl ? 'مکی دور، ہجرتِ مدینہ اور سنہری معجزات' : 'Prophetic Era, Makkan Period & Hijrah Milestones', icon: '🕊️', color: 'from-emerald-700 to-teal-900' },
    { id: 'cls-4', number: 4, name: isRtl ? 'قصص الانبیاء' : 'Realm 4: Qasas-ul-Anbiya', subtitle: isRtl ? 'حضرت آدم علیہ السلام تا حضرت عیسیٰ علیہ السلام' : 'Stories & Miracles of the Illustrious Prophets', icon: '📜', color: 'from-indigo-600 to-purple-800' },
    { id: 'cls-5', number: 5, name: isRtl ? 'گلستانِ صحابہ' : 'Realm 5: Gulistan-e-Sahaba', subtitle: isRtl ? 'خلفائے راشدین اور بہادر صحابہ کرام کے کارنامے' : 'Khulafa-e-Rashideen & Heroes of the Sahabah', icon: '🛡️', color: 'from-purple-600 to-pink-800' },
    { id: 'cls-6', number: 6, name: isRtl ? 'سلیقۂ اخلاق' : 'Realm 6: Saleeqah-e-Akhlaq', subtitle: isRtl ? 'سچائی، امانت، والدین کا احترام اور حسنِ سلوک' : 'Truthfulness, Honesty, Respect to Parents & Adab', icon: '💎', color: 'from-amber-600 to-orange-800' },
    { id: 'cls-7', number: 7, name: isRtl ? 'محرابِ عبادت' : 'Realm 7: Mihrab-e-Ibadat', subtitle: isRtl ? 'وضو کی ترتیب، نماز کے ارکان اور دعائیں' : 'Step-by-Step Salah, Wudu & Daily Adhkar', icon: '🕌', color: 'from-teal-700 to-cyan-900' },
    { id: 'cls-8', number: 8, name: isRtl ? 'سنہری دور' : 'Realm 8: Sunehri Daur', subtitle: isRtl ? 'بیت الحکمہ اور عظیم مسلم سائنسدان و محدثین' : 'House of Wisdom & Islamic Golden Heritage', icon: '👑', color: 'from-yellow-600 to-amber-900' },
    { id: 'cls-9', number: 9, name: isRtl ? 'بحر العلوم' : 'Realm 9: Bahr-ul-Uloom', subtitle: isRtl ? 'اصولِ حدیث، فقہ اور ماسٹر چیلنجز' : 'Master Scholarly Puzzles & Advanced Wisdom', icon: '🌊', color: 'from-blue-700 to-slate-900' }
  ];

  const selectedWorldId = params.worldId || query.world || window._activeAdventureWorldId || 'cls-1';
  window._activeAdventureWorldId = selectedWorldId;
  const currentWorld = worlds.find(w => w.id === selectedWorldId) || worlds[0];

  const stages = engine.generateClass100Stages(currentWorld.id, currentWorld.number);
  const activeTier = window._activeStageTier || 1;
  const displayedStages = stages.filter(s => s.stageNumber >= (activeTier - 1) * 20 + 1 && s.stageNumber <= activeTier * 20);

  const L = {
    title: isRtl ? 'الْمُغَامَرَةُ الإِسْلامِيَّةُ الْكُبْرَى' : 'Grand Islamic Adventure Game',
    sub: isRtl ? '9 اسلامی جہان • 100 دلچسپ مراحل • استاذ اے آئی رفیق اور سنہری انعامات' : '9 Sacred Realms • 100 Progressive Stages • Ustadh AI Companion & Gold Rewards',
    hudLevel: isRtl ? ('لیول ' + p.level) : ('Lvl ' + p.level),
    hudCoins: isRtl ? (p.coins + ' سکے') : (p.coins + ' Coins'),
    btnTreasure: isRtl ? '🎁 روزانہ خزانہ' : '🎁 Daily Treasure',
    btnHearts: isRtl ? '❤️ دل ری فل' : '❤️ Refill Hearts',
    btnAiCompanion: isRtl ? '🤖 استاذ اے آئی' : '🤖 Ustadh AI',
    tierLabel: isRtl ? ('مراحل ' + ((activeTier - 1) * 20 + 1) + ' تا ' + (activeTier * 20)) : ('Stages ' + ((activeTier - 1) * 20 + 1) + ' - ' + (activeTier * 20)),
    stageLocked: isRtl ? 'مرحلہ مقفل ہے' : 'Locked Stage',
    stagePlay: isRtl ? 'کھیلیں' : 'Play Stage'
  };

  const tierButtonsHtml = [1, 2, 3, 4, 5].map(t => {
    return '<button onclick="window._activeStageTier = ' + t + '; window.Views.renderAdventureGame();" class="w-8 h-8 rounded-xl font-mono transition flex items-center justify-center font-bold ' + (activeTier === t ? 'bg-teal-700 text-amber-300 font-black border border-amber-400/40 shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700') + '">' + t + '</button>';
  }).join('');

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 ${fontClass} text-slate-900 dark:text-slate-100 transition-colors pb-28 select-none" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Top Majestic Kid-Friendly Header (Teal & Gold) -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-4xl mx-auto px-4 py-4 sm:py-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-3xl animate-bounce">🎮</span>
              <div>
                <h1 class="text-xl sm:text-2xl font-black font-arabic leading-tight">${L.title}</h1>
                <p class="text-[11px] text-teal-200 font-sans">${L.sub}</p>
              </div>
            </div>
            
            <!-- Quick HUD Badges -->
            <div class="flex items-center gap-1.5 font-mono text-xs font-bold">
              <span class="px-2.5 py-1 rounded-xl bg-teal-900 text-amber-300 border border-teal-600 shadow-xs">${L.hudLevel}</span>
              <button onclick="window.Views.openHeartsRefillModal()" class="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition flex items-center gap-1">
                <span>❤️</span>
                <span>${p.hearts}/5</span>
              </button>
              <span class="px-2.5 py-1 rounded-xl bg-amber-400 text-teal-950 font-black shadow-xs">🪙 ${p.coins}</span>
            </div>
          </div>
        </div>

        <!-- 100% SINGLE-LINE Horizontal 9 Realms Selector Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-1.5">
          <div class="max-w-4xl mx-auto px-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            ${worlds.map(w => {
              const isSelected = w.id === currentWorld.id;
              return `
                <button 
                  onclick="window._activeAdventureWorldId = '${w.id}'; window.Views.renderAdventureGame();"
                  class="shrink-0 py-1 px-3 rounded-xl transition font-bold flex items-center gap-1.5 ${isSelected ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}"
                >
                  <span>${w.icon}</span>
                  <span>${w.name}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Main Stages Road Canvas -->
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-4">
        
        <!-- Active Realm Spotlight Card -->
        <div class="p-5 rounded-3xl bg-gradient-to-r ${currentWorld.color} text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="space-y-1 text-center sm:text-left">
            <span class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-300 font-black text-[10px] uppercase tracking-wider">
              REALM #${currentWorld.number} OF 9
            </span>
            <h2 class="text-xl sm:text-2xl font-black font-arabic text-amber-300">${currentWorld.name}</h2>
            <p class="text-xs text-teal-100 max-w-md">${currentWorld.subtitle}</p>
          </div>
          
          <div class="flex flex-wrap items-center gap-2 shrink-0 justify-center">
            <button onclick="window.Views.openDailyTreasureModal()" class="py-2 px-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-black text-xs shadow-lg transition active:scale-95 flex items-center gap-1">
              <span>${L.btnTreasure}</span>
            </button>
            <button onclick="window.Views.openHeartsRefillModal()" class="py-2 px-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1">
              <span>${L.btnHearts}</span>
            </button>
            <button onclick="window.Views.openUstadhAiModal()" class="py-2 px-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs border border-white/30 transition flex items-center gap-1">
              <span>${L.btnAiCompanion}</span>
            </button>
          </div>
        </div>

        <!-- Tier Navigation Buttons (20 Stages per Tier) -->
        <div class="flex items-center justify-between text-xs font-bold px-1">
          <span class="text-slate-500">${L.tierLabel}</span>
          <div class="flex gap-1.5">
            ${tierButtonsHtml}
          </div>
        </div>

        <!-- Interactive 20 Stages Node Road Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
          ${displayedStages.map(stg => {
            const isCompleted = !!p.completedStages[stg.id];
            const isUnlocked = stg.stageNumber === 1 || !!p.completedStages[currentWorld.id + '-s' + (stg.stageNumber - 1)] || stg.stageNumber <= 3;
            
            return `
              <div 
                onclick="${isUnlocked ? `window.Views.startAdventureStage('${stg.id}', '${stg.type}')` : `window.App?.showToast('Complete previous stages to unlock!', 'warning')`}"
                class="p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 cursor-pointer group ${
                  isCompleted 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 shadow-sm' :
                  isUnlocked 
                    ? 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-teal-600 hover:shadow-md hover:scale-105' 
                    : 'bg-slate-100 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700 opacity-60'
                }"
              >
                <div class="flex items-center justify-between">
                  <span class="w-7 h-7 rounded-xl font-mono text-xs font-black flex items-center justify-center ${
                    isCompleted ? 'bg-emerald-600 text-white' :
                    isUnlocked ? 'bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-600/30' :
                    'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }">
                    ${stg.stageNumber}
                  </span>
                  <span class="text-sm">
                    ${stg.isBoss ? '👑' : stg.type === 'word_puzzle' ? '🧩' : stg.type === 'memory_match' ? '🃏' : stg.type === 'timeline_drag' ? '⏳' : '⭐'}
                  </span>
                </div>

                <div>
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">${stg.title}</h4>
                  <div class="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mt-1">
                    <span>+${stg.rewardXp} XP</span>
                    <span>•</span>
                    <span class="text-amber-500 font-bold">🪙 +${stg.rewardCoins}</span>
                  </div>
                </div>

                <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold ${isUnlocked ? 'text-teal-700 dark:text-teal-300' : 'text-slate-400'}">
                  <span>${isCompleted ? '⭐ Mastered' : isUnlocked ? L.stagePlay : L.stageLocked}</span>
                  <span>${isUnlocked ? '&rarr;' : '🔒'}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// Hearts Refill Modal
window.Views.openHeartsRefillModal = function() {
  const engine = window.GameEngine;
  const p = engine.profile;

  const modalHtml = `
    <div id="hearts-modal" class="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-4 select-none font-sans">
      <div class="bg-white dark:bg-slate-900 border-2 border-rose-500/40 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 text-slate-900 dark:text-slate-100">
        <span class="text-5xl animate-pulse">❤️</span>
        <h3 class="text-lg font-black text-rose-600 dark:text-rose-400">Restore Energy / Hearts</h3>
        <p class="text-xs text-slate-500">You currently have <strong>${p.hearts} / 5</strong> hearts. Hearts protect your adventure streak.</p>
        
        <div class="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-400 text-xs font-bold text-amber-800 dark:text-amber-300">
          Refill 5 Full Hearts for <strong>50 Coins 🪙</strong> (Your balance: ${p.coins} coins)
        </div>

        <div class="flex gap-2">
          <button onclick="document.getElementById('hearts-modal').remove()" class="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs">
            Close
          </button>
          <button onclick="const r = window.GameEngine.refillHearts(); window.App?.showToast(r.message, r.success ? 'success' : 'error'); document.getElementById('hearts-modal').remove(); window.Views.renderAdventureGame();" class="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md">
            Refill Now (50 🪙)
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('hearts-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

// Start Stage Action & Mini-Game Launcher
window.Views.startAdventureStage = function(stageId, type) {
  const engine = window.GameEngine;
  if (engine.profile.hearts <= 0) {
    window.Views.openHeartsRefillModal();
    window.App?.showToast('Out of hearts! Refill with coins to continue playing.', 'error');
    return;
  }

  const gameData = engine.getMiniGameData(stageId, type);

  if (type === 'word_puzzle') {
    window.Views.openWordPuzzleModal(stageId, gameData);
  } else if (type === 'memory_match') {
    window.Views.openMemoryMatchModal(stageId, gameData);
  } else if (type === 'timeline_drag') {
    window.Views.openTimelineDragModal(stageId, gameData);
  } else {
    window.Views.openClassicQuizStageModal(stageId, gameData);
  }
};

// 1. Word Puzzle Modal
window.Views.openWordPuzzleModal = function(stageId, data) {
  let chosenWords = [];

  window._handleWordClick = function(word, btnIdx) {
    chosenWords.push(word);
    document.getElementById('wp-btn-' + btnIdx)?.classList.add('opacity-30', 'pointer-events-none');
    document.getElementById('wp-answer-box').innerHTML = chosenWords.map(w => `<span class="px-2.5 py-1 rounded-xl bg-teal-800 text-amber-300 font-arabic text-sm font-bold shadow-xs">${w}</span>`).join(' ');
    
    if (chosenWords.length === data.correctSequence.length) {
      const isCorrect = chosenWords.join(' ') === data.correctSequence.join(' ');
      if (isCorrect) {
        window.Views.triggerStageVictory(stageId, 100, 50);
      } else {
        window.App?.showToast('Try again! Listen to the correct sequence.', 'error');
        chosenWords = [];
        setTimeout(() => window.Views.openWordPuzzleModal(stageId, data), 1000);
      }
    }
  };

  const modalHtml = `
    <div id="game-modal" class="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-3 sm:p-4 font-sans select-none">
      <div class="bg-white dark:bg-slate-900 border-2 border-amber-400/50 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100 text-xs text-center">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <span class="font-black text-amber-500 uppercase">🧩 Word Arranger Puzzle</span>
          <button onclick="document.getElementById('game-modal').remove()" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <p class="text-slate-500 dark:text-slate-400 text-xs">Tap the words in the correct sequence to build the Holy Declaration:</p>
        
        <div id="wp-answer-box" class="min-h-12 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-teal-600/40 flex flex-wrap items-center justify-center gap-2">
          <span class="text-slate-400 text-xs italic">Tap words below...</span>
        </div>

        <p class="text-xs font-medium text-slate-600 dark:text-slate-300 italic">${data.translation}</p>

        <div class="flex flex-wrap justify-center gap-2 pt-2">
          ${data.words.map((w, i) => `
            <button id="wp-btn-${i}" onclick="window._handleWordClick('${w}', ${i})" class="py-2.5 px-4 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-arabic text-sm font-bold border border-teal-600/40 hover:bg-teal-700 hover:text-amber-300 transition shadow-xs">
              ${w}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('game-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

// 2. Memory Match Cards Modal
window.Views.openMemoryMatchModal = function(stageId, data) {
  let flipped = [];
  let matched = 0;

  window._flipCard = function(idx, pairId) {
    const card = document.getElementById('mc-card-' + idx);
    if (!card || flipped.length >= 2 || card.classList.contains('matched')) return;

    card.classList.remove('bg-teal-800');
    card.classList.add('bg-amber-400', 'text-teal-950');
    card.innerHTML = data.cards[idx].symbol;
    flipped.push({ idx, pairId });

    if (flipped.length === 2) {
      if (flipped[0].pairId === flipped[1].pairId) {
        matched += 2;
        flipped = [];
        if (matched === data.cards.length) {
          setTimeout(() => window.Views.triggerStageVictory(stageId, 120, 60), 500);
        }
      } else {
        setTimeout(() => {
          flipped.forEach(f => {
            const c = document.getElementById('mc-card-' + f.idx);
            if (c) {
              c.classList.remove('bg-amber-400', 'text-teal-950');
              c.classList.add('bg-teal-800');
              c.innerHTML = '❓';
            }
          });
          flipped = [];
        }, 800);
      }
    }
  };

  const modalHtml = `
    <div id="game-modal" class="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-3 sm:p-4 font-sans select-none">
      <div class="bg-white dark:bg-slate-900 border-2 border-amber-400/50 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100 text-xs text-center">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <span class="font-black text-amber-500 uppercase">🃏 Islamic Memory Match Cards</span>
          <button onclick="document.getElementById('game-modal').remove()" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <p class="text-slate-500 dark:text-slate-400 text-xs">Find and match all pairs of sacred Islamic symbols:</p>

        <div class="grid grid-cols-4 gap-2.5 py-3">
          ${data.cards.map((c, i) => `
            <div id="mc-card-${i}" onclick="window._flipCard(${i}, '${c.pairId}')" class="h-16 rounded-2xl bg-teal-800 text-white font-black text-xl flex items-center justify-center cursor-pointer shadow-md transition hover:scale-105">
              ❓
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('game-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

// 3. Timeline Chronology Modal
window.Views.openTimelineDragModal = function(stageId, data) {
  let selected = [];

  window._pickTimelineEvent = function(id, btnIdx) {
    selected.push(id);
    document.getElementById('tl-btn-' + btnIdx)?.classList.add('opacity-30', 'pointer-events-none');
    
    if (selected.length === data.correctOrder.length) {
      const isCorrect = selected.join(',') === data.correctOrder.join(',');
      if (isCorrect) {
        window.Views.triggerStageVictory(stageId, 150, 75);
      } else {
        window.App?.showToast('Incorrect chronological sequence! Try again.', 'error');
        selected = [];
        setTimeout(() => window.Views.openTimelineDragModal(stageId, data), 1000);
      }
    }
  };

  const modalHtml = `
    <div id="game-modal" class="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-3 sm:p-4 font-sans select-none">
      <div class="bg-white dark:bg-slate-900 border-2 border-purple-500/50 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100 text-xs text-center">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <span class="font-black text-purple-500 uppercase">⏳ Seerah Timeline Chronology</span>
          <button onclick="document.getElementById('game-modal').remove()" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <p class="text-slate-500 dark:text-slate-400 text-xs">Tap the historical milestones in the order they occurred in history:</p>

        <div class="space-y-2 py-2">
          ${data.events.map((e, i) => `
            <button id="tl-btn-${i}" onclick="window._pickTimelineEvent('${e.id}', ${i})" class="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-600 font-bold text-xs text-left transition flex items-center justify-between">
              <span>${e.title}</span>
              <span class="font-mono text-teal-700 dark:text-teal-400 text-[11px]">${e.year}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('game-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

// 4. Classic Quiz Stage Modal with Ustadh AI Hint
window.Views.openClassicQuizStageModal = function(stageId, data) {
  const engine = window.GameEngine;

  window._submitQuizAnswer = function(optIdx) {
    if (optIdx === data.correctIndex) {
      window.Views.triggerStageVictory(stageId, 80, 40);
    } else {
      if (engine.profile.hearts > 0) engine.profile.hearts--;
      engine.saveProfile();
      window.App?.showToast('Not quite right! (-1 Heart ❤️). Ustadh AI suggests reviewing the hint!', 'error');
    }
  };

  const modalHtml = `
    <div id="game-modal" class="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-3 sm:p-4 font-sans select-none">
      <div class="bg-white dark:bg-slate-900 border-2 border-teal-600/50 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100 text-xs">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <span class="font-black text-teal-800 dark:text-teal-300 uppercase">⭐ Quest Challenge</span>
          <button onclick="document.getElementById('game-modal').remove()" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <h3 class="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-relaxed">${data.question}</h3>

        <div class="space-y-2">
          ${data.options.map((opt, i) => `
            <button onclick="window._submitQuizAnswer(${i})" class="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-teal-950 hover:border-teal-600 font-bold text-xs text-left transition flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-lg bg-teal-800 text-white font-mono flex items-center justify-center text-[10px] font-bold">${['A','B','C','D'][i]}</span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>

        <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button onclick="window.App?.showToast(window.GameEngine.getAiHint(window._activeGameData), 'info')" class="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1 hover:underline">
            <span>🤖 Ask Ustadh AI Hint</span>
          </button>
          <span class="text-slate-400 text-[11px]">Hints Left: ${engine.profile.inventory.aiHint}</span>
        </div>
      </div>
    </div>
  `;

  window._activeGameData = data;
  document.getElementById('game-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

// Victory Fanfare & Reward Distribution
window.Views.triggerStageVictory = function(stageId, xpReward = 100, coinReward = 50) {
  const engine = window.GameEngine;
  engine.profile.completedStages[stageId] = { stars: 3, completedAt: new Date().toISOString() };
  engine.profile.totalXp += xpReward;
  engine.profile.coins += coinReward;
  engine.saveProfile();

  document.getElementById('game-modal')?.remove();

  const victoryHtml = `
    <div id="victory-modal" class="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-4 select-none">
      <div class="bg-white dark:bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 text-slate-900 dark:text-slate-100">
        <span class="text-5xl animate-bounce">🏆</span>
        <h2 class="text-xl font-black font-arabic text-amber-500">Mubarak! Stage Cleared!</h2>
        <p class="text-xs text-slate-500">You earned extraordinary knowledge points and gold coins:</p>
        
        <div class="flex items-center justify-center gap-4 py-2">
          <div class="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950 border border-teal-600/40 font-mono font-bold text-teal-700 dark:text-teal-300 text-xs">
            +${xpReward} XP ⭐
          </div>
          <div class="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 border border-amber-600/40 font-mono font-bold text-amber-500 text-xs">
            +${coinReward} Coins 🪙
          </div>
        </div>

        <button onclick="document.getElementById('victory-modal').remove(); window.Views.renderAdventureGame();" class="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs shadow-lg transition">
          Continue Adventure &rarr;
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', victoryHtml);
  window.App?.showToast('🎉 Stage Cleared! Mubarak!', 'success');
};

// Daily Treasure Chest Modal
window.Views.openDailyTreasureModal = function() {
  const result = window.GameEngine.claimDailyTreasure();
  
  const modalHtml = `
    <div id="treasure-modal" class="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-4 select-none">
      <div class="bg-white dark:bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 text-slate-900 dark:text-slate-100">
        <span class="text-5xl animate-pulse">${result.success ? '🎁' : '⏳'}</span>
        <h2 class="text-xl font-black text-amber-500">${result.success ? 'Daily Treasure Unlocked!' : 'Already Claimed Today'}</h2>
        <p class="text-xs text-slate-500">${result.message || 'Streak bonus awarded! Return tomorrow for even greater rewards.'}</p>
        
        ${result.success ? `
          <div class="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 border border-amber-400 font-mono font-bold text-amber-600 text-xs space-y-1">
            <div>+${result.coins} Gold Coins 🪙</div>
            <div>+${result.xp} Scholarly XP ⭐</div>
            <div>+${result.hints} Ustadh AI Hints 🤖</div>
          </div>
        ` : ''}

        <button onclick="document.getElementById('treasure-modal').remove(); window.Views.renderAdventureGame();" class="w-full py-2.5 rounded-xl bg-teal-700 text-white font-bold text-xs">
          Alhamdulillah
        </button>
      </div>
    </div>
  `;

  document.getElementById('treasure-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

// Ustadh AI Companion Dialog Modal
window.Views.openUstadhAiModal = function() {
  const modalHtml = `
    <div id="ustadh-modal" class="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-3 sm:p-4 select-none font-sans">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100 text-xs">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🤖</span>
            <h3 class="text-sm font-black text-purple-600 dark:text-purple-400">Ustadh AI Child Companion</h3>
          </div>
          <button onclick="document.getElementById('ustadh-modal').remove()" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
          Assalamu Alaikum young scholar! I am your AI learning companion. Ask me anything about Quran stories, Prophet milestones, or prayer steps!
        </p>

        <div class="space-y-2">
          <button onclick="window.App?.showToast('Story of Prophet Yunus (AS): He repented inside the whale with La ilaha illa anta subhanaka inni kuntu minaz-zalimin.', 'info')" class="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-left border border-purple-600/30 text-xs">
            📖 Tell me the Story of Prophet Yunus (AS)
          </button>
          <button onclick="window.App?.showToast('Wudu Key Step: Wash face 3 times, hands to elbows, wipe head & ears, wash feet to ankles.', 'info')" class="w-full p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-left border border-teal-600/30 text-xs">
            💧 How do I perform Wudu step by step?
          </button>
          <button onclick="window.App?.showToast('First Surah revealed was Surah Al-Alaq in Cave Hira.', 'info')" class="w-full p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-left border border-amber-600/30 text-xs">
            ⭐ What was the first Quranic revelation?
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('ustadh-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

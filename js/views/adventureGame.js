/**
 * LearnHub Islamic Educational Adventure Game Client View
 * Bright, Cheerful, Professional Daylight UI with Classes 1 to 10 Progression,
 * 3D Adventure Level Nodes, 7 Interactive Gameplay Modes, HUD & Audio.
 */

window.Views = window.Views || {};

window.Views.renderAdventureGame = function(params = {}, query = {}) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const engine = window.GameEngine;
  const p = engine.loadProfile();
  const xpInfo = engine.getXpForNextLevel();

  const worlds = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gameWorlds') || []) : [];
  const stages = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gameStages') || []) : [];

  // Active selected class (defaults to latest unlocked class or 'cls-1')
  const selectedClassId = params.worldId || query.class || query.world || p.unlockedWorlds[p.unlockedWorlds.length - 1] || 'cls-1';
  const currentClass = worlds.find(w => w.id === selectedClassId) || worlds[0] || {
    id: 'cls-1',
    worldNumber: 1,
    classGrade: 1,
    title: 'کلاس 1 — ابتدائی دینی ایڈونچر',
    subtitle: 'بنیادی حروف، کلمۂ طیبہ، اللہ کے نام، دعائیں اور اچھے اخلاق',
    themeColor: '#f59e0b',
    gradient: 'from-amber-400 via-yellow-300 to-emerald-400',
    icon: 'sparkles'
  };

  const classStages = stages.filter(s => s.worldId === currentClass.id).sort((a, b) => a.stageNumber - b.stageNumber);

  // Generate full 100 stages for this class/world if not explicitly present in DB
  const activeLevels = (classStages.length >= 100) 
    ? classStages 
    : (window.GameEngine ? window.GameEngine.generateClass100Stages(currentClass.id, currentClass.classGrade || currentClass.worldNumber || 1) : []);

  // Stage Tier Filter (1: 1-25, 2: 26-50, 3: 51-75, 4: 76-100)
  window._activeStageTier = window._activeStageTier || 1;
  const tierMin = (window._activeStageTier - 1) * 25 + 1;
  const tierMax = window._activeStageTier * 25;
  const displayedLevels = activeLevels.filter(s => s.stageNumber >= tierMin && s.stageNumber <= tierMax);

  container.innerHTML = `
    <div class="min-h-screen bg-gradient-to-b from-sky-100 via-emerald-50/50 to-amber-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white font-urdu pb-28 select-none" dir="rtl">
      
      <!-- =========================================================================
           TOP GAME HUD (Player Status, Level, XP, Coins, Hearts, Streak, Sound Toggle)
           ========================================================================= -->
      <header class="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-emerald-200 dark:border-slate-800 shadow-md px-3 sm:px-6 py-2.5">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          <!-- Player Profile & Level Progress -->
          <div class="flex items-center gap-2.5 sm:gap-3">
            <div class="relative">
              <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-emerald-400 p-0.5 shadow-md flex items-center justify-center">
                <img src="https://avatars.githubusercontent.com/u/207941618?v=4" class="w-full h-full object-cover rounded-2xl" alt="Player">
              </div>
              <span class="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full border-2 border-white dark:border-slate-900 font-sans shadow">
                Lvl ${p.level}
              </span>
            </div>

            <!-- XP Meter -->
            <div class="hidden sm:block">
              <div class="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300 mb-1 font-sans">
                <span class="font-bold text-emerald-800 dark:text-emerald-400 font-urdu">علمی ترقی (XP)</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">${p.totalXp} XP (${xpInfo.percentage}%)</span>
              </div>
              <div class="w-28 sm:w-36 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600">
                <div class="h-full bg-gradient-to-r from-amber-400 via-emerald-500 to-teal-400 transition-all duration-500 rounded-full" style="width: ${xpInfo.percentage}%"></div>
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons: Missions & Power-Ups -->
          <div class="hidden md:flex items-center gap-2">
            <button onclick="window.Views.openDailyMissionsModal()" class="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-xs font-bold text-amber-900 dark:text-amber-300 hover:bg-amber-100 transition shadow-sm">
              <i data-lucide="scroll" class="w-4 h-4 text-amber-600 dark:text-amber-400"></i>
              <span>مشنز</span>
            </button>
            <button onclick="window.Views.openFriendArenaModal()" class="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-300 dark:border-indigo-700 text-xs font-bold text-indigo-900 dark:text-indigo-300 hover:bg-indigo-100 transition shadow-sm">
              <i data-lucide="swords" class="w-4 h-4 text-indigo-600 dark:text-indigo-400"></i>
              <span>مقابلہ (1-v-1)</span>
            </button>
          </div>

          <!-- Currency & Stats Badges -->
          <div class="flex items-center gap-2 sm:gap-3 font-sans">
            
            <!-- Coins Badge (Shop Trigger) -->
            <div class="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-600 px-2.5 sm:px-3 py-1 rounded-xl shadow-sm cursor-pointer hover:scale-105 transition" onclick="window.Views.openPowerUpStoreModal()" title="سکوں کی دکان">
              <span class="text-base sm:text-lg">🪙</span>
              <span id="hud-coins-counter" class="text-xs sm:text-sm font-black text-amber-800 dark:text-amber-300 font-sans">${p.coins}</span>
              <i data-lucide="plus" class="w-3 h-3 text-amber-600 dark:text-amber-400"></i>
            </div>

            <!-- Hearts / Lives Counter -->
            <div class="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-600 px-2 sm:px-3 py-1 rounded-xl shadow-sm">
              <span class="text-sm sm:text-base animate-pulse">❤️</span>
              <span class="text-xs sm:text-sm font-black text-rose-700 dark:text-rose-300">${p.hearts}/${p.maxHearts}</span>
            </div>

            <!-- Streak Flame -->
            <div class="flex items-center gap-1 bg-orange-50 dark:bg-orange-950/50 border border-orange-300 dark:border-orange-600 px-2 sm:px-3 py-1 rounded-xl shadow-sm">
              <span class="text-sm sm:text-base">🔥</span>
              <span class="text-xs sm:text-sm font-black text-orange-700 dark:text-orange-400">${p.streak}</span>
            </div>

            <!-- Sound Toggle Button -->
            <button onclick="window.Views.toggleSound(this)" class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300" title="صوتی اثرات آن / آف">
              <i data-lucide="${window.GameSound && window.GameSound.isMuted ? 'volume-x' : 'volume-2'}" class="w-4 h-4 text-emerald-600 dark:text-emerald-400"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- =========================================================================
           GRADE / CLASS SELECTOR BAR (کلاس 1 تا کلاس 10)
           ========================================================================= -->
      <div class="max-w-7xl mx-auto px-3 sm:px-6 pt-5 pb-3">
        <div class="flex items-center justify-between mb-2.5">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <i data-lucide="graduation-cap" class="w-5 h-5"></i>
            </span>
            <div>
              <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white">کلاس اور جماعت کا انتخاب</h3>
              <p class="text-[11px] text-slate-600 dark:text-slate-400">ہر کلاس میں 100 کوئز اور ایڈونچر مراحل دستیاب ہیں (لیول 1 تا 100)</p>
            </div>
          </div>
          <span class="text-xs font-black text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700">
            کلاس ${currentClass.classGrade || currentClass.worldNumber || 1} • 100 لیولز
          </span>
        </div>

        <!-- 10 Class Tabs Horizontal Scroll Ribbon -->
        <div class="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x">
          ${worlds.map((w, idx) => {
            const gradeNum = w.classGrade || w.worldNumber || (idx + 1);
            const isSelected = w.id === currentClass.id;
            
            return `
              <button 
                type="button"
                onclick="window.Views.renderAdventureGame({ worldId: '${w.id}' })"
                class="snap-start shrink-0 p-3 sm:p-3.5 rounded-2xl border-2 transition-all duration-300 text-right min-w-[140px] sm:min-w-[170px] cursor-pointer ${
                  isSelected 
                    ? 'bg-white dark:bg-slate-800 border-emerald-500 shadow-xl ring-4 ring-emerald-500/20 scale-105' 
                    : 'bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-emerald-400 shadow-sm hover:shadow-md'
                }"
              >
                <div class="flex items-center justify-between mb-1.5">
                  <span class="w-8 h-8 rounded-xl bg-gradient-to-tr ${w.gradient || 'from-emerald-500 to-teal-400'} flex items-center justify-center text-white text-xs shadow-md font-sans font-black">
                    ${gradeNum}
                  </span>
                  <span class="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">100 لیولز</span>
                </div>
                <div class="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">کلاس ${gradeNum}</div>
                <div class="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">${w.subtitle ? w.subtitle.substring(0, 20) + '...' : `جماعت ${gradeNum}`}</div>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- =========================================================================
           ADVENTURE CLASS OVERVIEW & VISUAL MAP
           ========================================================================= -->
      <main class="max-w-4xl mx-auto px-3 sm:px-6 py-2">
        <div class="relative bg-white dark:bg-slate-900 border-2 border-emerald-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-xl overflow-hidden">
          
          <!-- Class Hero Banner -->
          <div class="mb-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-r ${currentClass.gradient || 'from-emerald-500 via-teal-400 to-cyan-500'} text-slate-950 shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <!-- Decorative circle glow -->
            <div class="absolute -top-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>

            <div class="space-y-1.5 relative z-10">
              <div class="inline-flex items-center gap-1.5 bg-black/20 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm">
                <i data-lucide="award" class="w-3.5 h-3.5 text-amber-300"></i>
                <span>کلاس ${currentClass.classGrade || currentClass.worldNumber || 1} • کل 100 چیلنجز و کوئز</span>
              </div>
              <h2 class="text-xl sm:text-3xl font-black text-slate-950">${currentClass.title}</h2>
              <p class="text-xs sm:text-sm text-slate-900 font-semibold leading-relaxed max-w-xl">${currentClass.description || currentClass.subtitle || ''}</p>
            </div>

            <div class="shrink-0 flex items-center justify-center">
              <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/30 backdrop-blur-md border-2 border-white/50 flex items-center justify-center text-3xl sm:text-4xl shadow-inner animate-bounce-slow">
                ${currentClass.classGrade === 1 ? '🌟' : currentClass.classGrade === 2 ? '🕌' : currentClass.classGrade === 3 ? '💧' : currentClass.classGrade === 4 ? '📖' : currentClass.classGrade === 5 ? '🌸' : currentClass.classGrade === 6 ? '🌴' : currentClass.classGrade === 7 ? '🛡️' : currentClass.classGrade === 8 ? '🕋' : currentClass.classGrade === 9 ? '📜' : '👑'}
              </div>
            </div>
          </div>

          <!-- 100 Stages Tier Navigator (مراحل کے درجات) -->
          <div class="mb-6 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
              <button onclick="window._activeStageTier = 1; window.Views.renderAdventureGame({ worldId: '${currentClass.id}' });" class="py-2 px-3 rounded-xl text-xs font-black transition ${window._activeStageTier === 1 ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50'}">
                لیولز 1 - 25
              </button>
              <button onclick="window._activeStageTier = 2; window.Views.renderAdventureGame({ worldId: '${currentClass.id}' });" class="py-2 px-3 rounded-xl text-xs font-black transition ${window._activeStageTier === 2 ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50'}">
                لیولز 26 - 50
              </button>
              <button onclick="window._activeStageTier = 3; window.Views.renderAdventureGame({ worldId: '${currentClass.id}' });" class="py-2 px-3 rounded-xl text-xs font-black transition ${window._activeStageTier === 3 ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50'}">
                لیولز 51 - 75
              </button>
              <button onclick="window._activeStageTier = 4; window.Views.renderAdventureGame({ worldId: '${currentClass.id}' });" class="py-2 px-3 rounded-xl text-xs font-black transition ${window._activeStageTier === 4 ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50'}">
                لیولز 76 - 100 👑
              </button>
            </div>
            
            <div class="text-[11px] text-slate-500 dark:text-slate-400 font-bold px-2">
              دکھائے جا رہے ہیں: <strong class="text-emerald-600 font-mono">${tierMin} تا ${tierMax}</strong> از 100
            </div>
          </div>

          <!-- Level Nodes Journey Path (Bright & Playful 3D Level Cards) -->
          <div class="space-y-4 relative">
            
            ${displayedLevels.map((stage, idx) => {
              const isUnlocked = true;
              const stageProgress = p.completedStages[stage.id] || { stars: 0, bestScore: 0 };
              const isBoss = stage.isBoss || stage.type === 'boss';

              return `
                <div class="relative flex items-center justify-center">
                  <div 
                    onclick="window.Views.startAdventureStage('${currentClass.id}', '${stage.id}')"
                    class="group relative flex items-center gap-4 p-4 sm:p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer w-full ${
                      isBoss 
                        ? 'bg-gradient-to-r from-amber-50 to-yellow-100 dark:from-amber-950/40 dark:to-yellow-950/30 border-amber-400 shadow-xl hover:shadow-2xl hover:scale-[1.01]'
                        : 'bg-white dark:bg-slate-800 border-emerald-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-emerald-500 hover:scale-[1.01]'
                    }"
                  >
                    <!-- 3D Level Number Avatar -->
                    <div class="relative shrink-0">
                      <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center text-center shadow-md transition-transform group-hover:scale-105 ${
                        isBoss 
                          ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-amber-400/40 ring-2 ring-amber-300' 
                          : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/20'
                      }">
                        <span class="text-[9px] font-bold font-urdu leading-none">${isBoss ? 'فائنل' : 'لیول'}</span>
                        <span class="text-base sm:text-lg font-black font-sans -mt-0.5">${isBoss ? '👑' : stage.stageNumber}</span>
                      </div>
                      ${isUnlocked && stageProgress.stars > 0 ? `
                        <span class="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border border-white shadow">
                          <i data-lucide="check" class="w-3 h-3"></i>
                        </span>
                      ` : ''}
                    </div>

                    <!-- Level Information & Stars -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between gap-2">
                        <span class="text-xs font-black ${isBoss ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'} font-urdu flex items-center gap-1">
                          <span>${isBoss ? `👑 گولڈن چیمپئن لیول ${stage.stageNumber}` : `لیول ${stage.stageNumber}`}</span>
                          <span class="text-[10px] font-sans px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">${stage.difficulty === 'easy' ? 'ابتدائی' : (stage.difficulty === 'hard' ? 'ماسٹر' : 'متوسط')}</span>
                        </span>
                        
                        <!-- 1-3 Golden Stars Rating -->
                        <div class="flex items-center gap-0.5 text-sm">
                          <span class="${stageProgress.stars >= 1 ? 'text-amber-400 drop-shadow' : 'text-slate-300 dark:text-slate-600'}">★</span>
                          <span class="${stageProgress.stars >= 2 ? 'text-amber-400 drop-shadow' : 'text-slate-300 dark:text-slate-600'}">★</span>
                          <span class="${stageProgress.stars >= 3 ? 'text-amber-400 drop-shadow' : 'text-slate-300 dark:text-slate-600'}">★</span>
                        </div>
                      </div>

                      <h4 class="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate mt-0.5">${stage.title}</h4>
                      
                      <div class="flex items-center gap-3 mt-1 text-[11px] font-sans">
                        <span class="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                          ✨ +${stage.rewardXp || 150} XP
                        </span>
                        <span class="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                          🪙 +${stage.rewardCoins || 50} سکے
                        </span>
                        <span class="text-slate-400 text-[10px]">
                          ⏱️ 3 منٹ
                        </span>
                      </div>
                    </div>

                    <!-- Play CTA Button -->
                    <div class="shrink-0">
                      <button class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl ${isBoss ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' : 'bg-emerald-600 text-white hover:bg-emerald-500'} flex items-center justify-center shadow-md group-hover:scale-110 active:scale-95 transition">
                        <i data-lucide="play" class="w-4 h-4 fill-current"></i>
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}

          </div>
        </div>
      </main>

      <!-- Power-Up Quick Floating Dock (Store Shortcut) -->
      <div class="fixed bottom-20 left-4 z-30 hidden sm:block">
        <button onclick="window.Views.openPowerUpStoreModal()" class="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 border-2 border-amber-400 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition text-amber-900 dark:text-amber-300 font-bold text-xs">
          <span class="text-xl">🛍️</span>
          <span>پاور اپس اسٹور</span>
        </button>
      </div>

    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }
};

/* =============================================================================
   START ADVENTURE STAGE SESSION & 7 GAMEPLAY VIEWPORTS
   ============================================================================= */

window.Views.startAdventureStage = function(worldId, stageId) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const engine = window.GameEngine;
  const session = engine.startStage(worldId, stageId);

  if (!session) {
    window.App.showToast('مرحلہ شروع نہیں ہو سکا۔ دل ختم ہو چکے ہیں یا ڈیٹا دستیاب نہیں۔', 'error');
    return;
  }

  // Render Live Game Session Screen
  window.Views.renderLiveStageViewport(session);
};

window.Views.renderLiveStageViewport = function(session) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const questions = (session && session.questions && session.questions.length) 
    ? session.questions 
    : ((session && session.stage && session.stage.questions && session.stage.questions.length) 
        ? session.stage.questions 
        : (window.GameEngine ? window.GameEngine._getFallbackQuestions(session.stageId, session.stage ? session.stage.type : 'knowledge') : []));

  if (!questions || !questions.length) {
    window.App.showToast('اس مرحلے کے لیے سوالات دستیاب نہیں ہیں۔', 'error');
    window.Views.renderAdventureGame({ worldId: session.worldId });
    return;
  }

  const q = questions[session.currentQuestionIndex] || questions[0];
  const p = window.GameEngine.loadProfile();

  // Active in-game timer (Generous Kid-Friendly Mode)
  if (window._gameplayTimerInterval) {
    clearInterval(window._gameplayTimerInterval);
    window._gameplayTimerInterval = null;
  }

  window._gameplayTimerInterval = setInterval(() => {
    if (!window.GameEngine || !window.GameEngine.activeSession) {
      clearInterval(window._gameplayTimerInterval);
      return;
    }
    const sess = window.GameEngine.activeSession;
    if (sess.isCompleted || sess.isFailed) {
      clearInterval(window._gameplayTimerInterval);
      return;
    }
    sess.timeRemainingSeconds = Math.max(0, (sess.timeRemainingSeconds !== undefined ? sess.timeRemainingSeconds : 180) - 1);
    sess.timeRemaining = sess.timeRemainingSeconds;
    const timerEl = document.getElementById('gameplay-timer-counter');
    if (timerEl) {
      timerEl.innerText = `${sess.timeRemainingSeconds}s`;
    }
    // Instead of harsh cutoff, grant +60s bonus grace time so children can finish peacefully
    if (sess.timeRemainingSeconds <= 0) {
      sess.timeRemainingSeconds += 60;
      if (window.App && typeof window.App.showToast === 'function') {
        window.App.showToast('⏰ اضافی وقت شامل کر دیا گیا ہے (+60s)! اطمینان سے حل فرمائیں۔', 'info');
      }
    }
  }, 1000);

  container.innerHTML = `
    <div class="min-h-screen bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white font-urdu pb-28 select-none" dir="rtl">
      
      <!-- Stage Playing Top Header -->
      <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-emerald-200 dark:border-slate-800 px-3 sm:px-6 py-3 shadow-md sticky top-0 z-30">
        <div class="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          <!-- Exit Button -->
          <button onclick="window.Views.confirmExitStage()" class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition" title="ایڈونچر سے باہر جائیں">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>

          <!-- Progress Bar & Question Counter -->
          <div class="flex-1 max-w-md">
            <div class="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              <span>سوال ${session.currentQuestionIndex + 1} از ${questions.length}</span>
              <span class="font-sans text-emerald-600 dark:text-emerald-400">اسکور: ${session.score}</span>
            </div>
            <div class="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600">
              <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300" style="width: ${((session.currentQuestionIndex + 1) / questions.length) * 100}%"></div>
            </div>
          </div>

          <!-- In-Stage Hearts & Timer -->
          <div class="flex items-center gap-2 sm:gap-3 font-sans">
            <div class="flex items-center gap-1 bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 px-2.5 py-1 rounded-xl">
              <span class="text-sm animate-pulse">❤️</span>
              <span id="gameplay-lives-counter" class="text-xs sm:text-sm font-black text-rose-800 dark:text-rose-300">${session.lives}</span>
            </div>
            <div class="flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 px-2.5 py-1 rounded-xl">
              <span class="text-sm">⏱️</span>
              <span id="gameplay-timer-counter" class="text-xs sm:text-sm font-black text-amber-800 dark:text-amber-300">${session.timeRemainingSeconds}s</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Power-Ups In-Game Bar -->
      <div class="max-w-2xl mx-auto px-4 pt-3 flex items-center justify-center gap-2 sm:gap-3">
        <button onclick="window.Views.triggerFiftyFifty()" class="flex items-center gap-1.5 py-1.5 px-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 shadow-sm text-xs font-bold text-indigo-900 dark:text-indigo-200 transition active:scale-95">
          <span class="text-sm">✂️</span>
          <span>50/50</span>
          <span class="text-[10px] bg-indigo-100 dark:bg-indigo-900 px-1 rounded-full font-sans">${p.inventory.fiftyFifty || 0}</span>
        </button>

        <button onclick="window.Views.triggerHint()" class="flex items-center gap-1.5 py-1.5 px-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 hover:border-amber-500 shadow-sm text-xs font-bold text-amber-900 dark:text-amber-200 transition active:scale-95">
          <span class="text-sm">💡</span>
          <span>اشارہ (Hint)</span>
          <span class="text-[10px] bg-amber-100 dark:bg-amber-900 px-1 rounded-full font-sans">${p.inventory.hint || 0}</span>
        </button>

        <button onclick="window.Views.triggerTimeBoost()" class="flex items-center gap-1.5 py-1.5 px-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-teal-300 dark:border-teal-700 hover:border-teal-500 shadow-sm text-xs font-bold text-teal-900 dark:text-teal-200 transition active:scale-95">
          <span class="text-sm">⏳</span>
          <span>+15s وقت</span>
          <span class="text-[10px] bg-teal-100 dark:bg-teal-900 px-1 rounded-full font-sans">${p.inventory.timeBoost || 0}</span>
        </button>

        <button onclick="window.Views.triggerExtraLife()" class="flex items-center gap-1.5 py-1.5 px-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-rose-300 dark:border-rose-700 hover:border-rose-500 shadow-sm text-xs font-bold text-rose-900 dark:text-rose-200 transition active:scale-95">
          <span class="text-sm">❤️</span>
          <span>+1 دل</span>
          <span class="text-[10px] bg-rose-100 dark:bg-rose-900 px-1 rounded-full font-sans">${p.inventory.extraLife || 0}</span>
        </button>
      </div>

      <!-- Live Question / Puzzle Card Viewport -->
      <div class="max-w-2xl mx-auto px-4 py-4" id="game-active-question-card">
        ${window.Views.renderQuestionTypeViewport(q, session)}
      </div>

    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }
};

/* =============================================================================
   RENDER QUESTION TYPE VIEWPORTS (7 GAMEPLAY MECHANICS)
   ============================================================================= */

window.Views.renderQuestionTypeViewport = function(q, session) {
  if (!q) return '<div class="text-center p-8">کوئی سوال دستیاب نہیں ہے۔</div>';

  const type = q.type || 'knowledge';

  // 1. SEQUENTIAL ORDER PUZZLE (وضو و نماز کی ترتیب)
  if (type === 'sequential_order' && q.items) {
    return `
      <div class="bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-right">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold mb-3">
          <i data-lucide="layers" class="w-3.5 h-3.5"></i> ترتیبِ عمل کا پزل
        </div>
        <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2">${q.title}</h3>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">${q.questionText}</p>

        <!-- Interactive Drag/Shift List -->
        <div id="sequential-items-container" class="space-y-2.5 mb-6">
          ${q.items.map((item, idx) => `
            <div data-id="${item.id}" class="sequential-item flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-400 transition shadow-sm">
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex-1 leading-relaxed">${item.text}</span>
              <div class="flex items-center gap-1 shrink-0 mr-2">
                <button type="button" onclick="window.Views.moveSequentialItem('${item.id}', -1)" class="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-emerald-500 hover:text-white transition">
                  <i data-lucide="arrow-up" class="w-4 h-4"></i>
                </button>
                <button type="button" onclick="window.Views.moveSequentialItem('${item.id}', 1)" class="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-emerald-500 hover:text-white transition">
                  <i data-lucide="arrow-down" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <button onclick="window.Views.submitSequentialAnswer('${q.id}')" class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-sm shadow-lg transition active:scale-95 flex items-center justify-center gap-2">
          <span>ترتیب کی تصدیق کریں (Check Order)</span>
          <i data-lucide="check" class="w-5 h-5"></i>
        </button>
      </div>
    `;
  }

  // 2. MEMORY MATCH CARDS (کارڈز میچنگ)
  if (type === 'memory_match' && q.pairs) {
    // Generate shuffled card deck from pairs
    const cards = [];
    q.pairs.forEach(p => {
      cards.push({ id: p.id + '-term', matchId: p.id, text: p.term, isTerm: true });
      cards.push({ id: p.id + '-match', matchId: p.id, text: p.match, isTerm: false });
    });
    // Shuffle
    cards.sort(() => Math.random() - 0.5);
    window._activeMemoryCards = cards;
    window._selectedMemoryCards = [];

    return `
      <div class="bg-white dark:bg-slate-900 border-2 border-indigo-300 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-right">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold mb-3">
          <i data-lucide="grid" class="w-3.5 h-3.5"></i> تطابقِ ذاکرہ (Memory Cards)
        </div>
        <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2">${q.title}</h3>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6">درست جوڑوں کے کارڈز منتخب کریں اور ملاپ مکمل فرمائیں:</p>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6" id="memory-cards-grid">
          ${cards.map((c, i) => `
            <button 
              type="button"
              id="mem-card-${i}"
              data-index="${i}"
              data-match-id="${c.matchId}"
              onclick="window.Views.handleMemoryCardClick(${i})"
              class="p-4 h-24 sm:h-28 rounded-2xl bg-indigo-50 dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-700 hover:border-indigo-500 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 flex items-center justify-center text-center shadow-sm transition active:scale-95"
            >
              <span class="card-front-text line-clamp-3">${c.text}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 3. RAPID BINARY (تیز رفتار درست یا غلط)
  if (type === 'rapid_binary') {
    return `
      <div class="bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-right">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold mb-3">
          <i data-lucide="zap" class="w-3.5 h-3.5"></i> تیز رفتار فیصلہ (Rapid Binary)
        </div>
        <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2">${q.title}</h3>
        <div class="my-6 p-5 rounded-2xl bg-amber-50/50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-center">
          <p class="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-relaxed font-urdu">${q.questionText}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button onclick="window.Views.submitRapidAnswer('true', this)" class="py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-lg transition active:scale-95 flex items-center justify-center gap-2">
            <i data-lucide="check-circle" class="w-5 h-5"></i>
            <span>صحیح / درست (True)</span>
          </button>
          <button onclick="window.Views.submitRapidAnswer('false', this)" class="py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-base shadow-lg transition active:scale-95 flex items-center justify-center gap-2">
            <i data-lucide="x-circle" class="w-5 h-5"></i>
            <span>غلط / نادرست (False)</span>
          </button>
        </div>
      </div>
    `;
  }

  // 4. VERSE GEM BANK (کلمات کا نگینہ پزل)
  if (type === 'verse_gem_bank') {
    const rawTemplate = q.verseTemplate || 'لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ ___ اللهِ';
    const missingWord = q.missingWord || 'رَّسُوْلُ';
    const wordBank = q.wordBank || ['رَّسُوْلُ', 'نَبِيُّ', 'عَبْدُ', 'خَلِيْلُ'];

    return `
      <div class="bg-white dark:bg-slate-900 border-2 border-cyan-300 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-right">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 text-xs font-bold mb-3">
          <i data-lucide="gem" class="w-3.5 h-3.5"></i> تکمیلِ کلمات کا نگینہ
        </div>
        <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2">${q.title}</h3>
        
        <div class="my-6 p-6 rounded-2xl bg-cyan-50/50 dark:bg-slate-800 border-2 border-cyan-200 dark:border-slate-700 text-center">
          <div class="text-xl sm:text-2xl font-bold font-arabic text-emerald-800 dark:text-emerald-400 leading-loose" id="verse-display-box" dir="rtl">
            ${rawTemplate}
          </div>
        </div>

        <p class="text-xs font-bold text-slate-600 dark:text-slate-400 mb-3">درست لفظی نگینے پر کلک کر کے خالی جگہ پُر کریں:</p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          ${wordBank.map(w => `
            <button onclick="window.Views.submitGemAnswer('${w}', '${missingWord}', this)" class="py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-cyan-300 dark:border-cyan-700 hover:border-cyan-500 font-black font-arabic text-lg text-slate-800 dark:text-white shadow-sm hover:shadow-md transition active:scale-95">
              ${w}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 5. AUDIO QUESTIONS (قاری کی آواز، سورت، تجوید، اذان، دعائیں، احادیث)
  const isAudioType = [
    'audio_qari_guess',
    'audio_surah_guess',
    'audio_next_verse',
    'audio_tajweed_makhraj',
    'audio_adhan_guess',
    'audio_dua_guess',
    'audio_hadith_quiz',
    'audio_nasheed_poetry',
    'audio_word_meaning',
    'audio_recitation'
  ].includes(type);

  if (isAudioType && q.audioUrl) {
    const options = q.options || ['پہلا جواب', 'دوسرا جواب', 'تیسرا جواب', 'چوتھا جواب'];
    return `
      <div class="bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-right">
        <div class="flex items-center justify-between mb-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-black">
            <i data-lucide="headphones" class="w-3.5 h-3.5"></i>
            <span>صوتی چیلنج (Audio Challenge)</span>
          </span>
          ${q.reference ? `<span class="text-[11px] text-slate-500">${q.reference}</span>` : ''}
        </div>

        <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-1">${q.title}</h3>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-3">${q.questionText || 'آڈیو کو غور سے سنیں اور درست جواب منتخب فرمائیں:'}</p>

        <!-- Dynamic Audio Player -->
        ${window.MediaEngine.renderAudioPlayerHtml(q.audioUrl, q.audioTitle || 'تلاوت و کلام سنیں', `audio-q-${q.id}`)}

        <div class="space-y-3 mt-4" id="audio-options-container">
          ${options.map((opt, idx) => `
            <button 
              type="button" 
              onclick="window.Views.submitStandardOption(${idx}, this)"
              class="standard-option-btn w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-700/80 transition flex items-center justify-between text-right font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 active:scale-[0.98] shadow-sm"
            >
              <span class="flex-1 leading-relaxed">${opt}</span>
              <span class="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono font-bold mr-3 shrink-0">
                ${idx + 1}
              </span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 6. VIDEO QUESTIONS (سیرت، تاریخی مناظر، وضو/نماز کی غلطی، 3D مخارج)
  const isVideoType = [
    'video_clip_quiz',
    'video_spot_mistake',
    'video_3d_makhraj',
    'animated_map_battle'
  ].includes(type);

  if (isVideoType && q.videoUrl) {
    const options = q.options || ['پہلا جواب', 'دوسرا جواب', 'تیسرا جواب', 'چوتھا جواب'];
    return `
      <div class="bg-white dark:bg-slate-900 border-2 border-indigo-300 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-right">
        <div class="flex items-center justify-between mb-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-black">
            <i data-lucide="video" class="w-3.5 h-3.5"></i>
            <span>ویڈیو چیلنج (Video Challenge)</span>
          </span>
          ${q.reference ? `<span class="text-[11px] text-slate-500">${q.reference}</span>` : ''}
        </div>

        <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-1">${q.title}</h3>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-3">${q.questionText || 'ویڈیو کو دیکھ کر درست مشاہدے کا انتخاب کریں:'}</p>

        <!-- Dynamic Video Player -->
        ${window.MediaEngine.renderVideoPlayerHtml(q.videoUrl, q.posterUrl, q.videoTitle || 'ویڈیو مشاہدہ فرمائیں', `video-q-${q.id}`)}

        <div class="space-y-3 mt-4" id="video-options-container">
          ${options.map((opt, idx) => `
            <button 
              type="button" 
              onclick="window.Views.submitStandardOption(${idx}, this)"
              class="standard-option-btn w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-slate-700/80 transition flex items-center justify-between text-right font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 active:scale-[0.98] shadow-sm"
            >
              <span class="flex-1 leading-relaxed">${opt}</span>
              <span class="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono font-bold mr-3 shrink-0">
                ${idx + 1}
              </span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 7. AUDIO SPELLER (سن کر ہجے و حروف سازی)
  if (type === 'audio_speller') {
    const letters = q.letters || ['ك', 'ت', 'ا', 'ب', 'م', 'س', 'ج', 'د'];
    window._currentSpelledLetters = [];

    return `
      <div class="bg-white dark:bg-slate-900 border-2 border-teal-300 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-right">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 text-xs font-black mb-3">
          <i data-lucide="spell-check" class="w-3.5 h-3.5"></i> صوتی ہجے و کلمہ سازی (Audio Speller)
        </div>
        <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2">${q.title}</h3>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-3">${q.questionText || 'آواز سنیں اور حروف کے نگینوں کو دبا کر لفظ بنائیں:'}</p>

        <!-- Audio Trigger Player -->
        ${q.audioUrl ? window.MediaEngine.renderAudioPlayerHtml(q.audioUrl, 'لفظ کی آواز سنیں', `audio-spell-${q.id}`) : ''}

        <!-- Spelled Word Display Slots -->
        <div class="my-6 p-5 rounded-2xl bg-teal-50/50 dark:bg-slate-800 border-2 border-teal-200 dark:border-slate-700 text-center flex items-center justify-center gap-2 min-h-[64px]" id="spelled-word-display" dir="rtl">
          <span class="text-slate-400 text-xs">نیچے دیے گئے حروف پر کلک کریں...</span>
        </div>

        <!-- Letter Gems Keyboard Grid -->
        <div class="grid grid-cols-4 sm:grid-cols-6 gap-2.5 mb-4" dir="rtl">
          ${letters.map(char => `
            <button 
              type="button" 
              onclick="window.Views.addSpellerLetter('${char}')"
              class="h-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-teal-300 dark:border-teal-700 hover:border-teal-500 font-arabic font-black text-2xl text-teal-900 dark:text-teal-200 shadow-sm active:scale-90 transition flex items-center justify-center"
            >
              ${char}
            </button>
          `).join('')}
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button type="button" onclick="window.Views.clearSpellerLetters()" class="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition">
            حذف کریں (Clear)
          </button>
          <button type="button" onclick="window.Views.submitSpellerWord()" class="py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black shadow-md active:scale-95 transition flex items-center justify-center gap-1.5">
            <span>لفظ مکمل ہے (Submit)</span>
            <i data-lucide="check" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  }

  // 8. VISUAL LETTER & OBJECT MATCHER (تصویر اور صوتی حرف)
  if (type === 'visual_letter_object') {
    const options = q.options || ['الف', 'ب', 'ت', 'ث'];
    return `
      <div class="bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-right">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 text-xs font-black mb-3">
          <i data-lucide="image" class="w-3.5 h-3.5"></i> بصری تصویر و صوتی حرف
        </div>
        <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2">${q.title}</h3>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4">${q.questionText}</p>

        <!-- Big Visual Picture -->
        <div class="my-4 p-6 rounded-3xl bg-amber-50/60 dark:bg-slate-800 border-2 border-amber-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
          <div class="text-6xl sm:text-7xl mb-2 animate-bounce-slow">${q.objectEmoji || '🕋'}</div>
          <div class="text-sm font-black text-slate-800 dark:text-white">${q.objectName || 'بیت اللہ (کعبہ)'}</div>
        </div>

        <p class="text-xs font-bold text-slate-600 dark:text-slate-400 mb-3">اس تصویر کا پہلا حرف کون سا ہے؟</p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          ${options.map((opt, idx) => `
            <button 
              type="button" 
              onclick="window.Views.submitStandardOption(${idx}, this)"
              class="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 hover:border-amber-500 font-arabic font-black text-2xl text-slate-800 dark:text-white shadow-sm hover:shadow-md transition active:scale-95 text-center"
            >
              ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 9. STANDARD / BOSS MULTIPLE CHOICE QUESTION
  const options = q.options || ['پہلا جواب', 'دوسرا جواب', 'تیسرا جواب', 'چوتھا جواب'];
  const isBoss = session.stage.type === 'boss';

  return `
    <div class="bg-white dark:bg-slate-900 border-2 ${isBoss ? 'border-amber-400' : 'border-emerald-300 dark:border-slate-800'} rounded-3xl p-6 sm:p-8 shadow-xl text-right">
      <div class="flex items-center justify-between mb-3">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${isBoss ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'} text-xs font-bold">
          <i data-lucide="${isBoss ? 'crown' : 'help-circle'}" class="w-3.5 h-3.5"></i>
          <span>${isBoss ? '👑 فائنل چیمپئن چیلنج' : 'علمی انتخاب'}</span>
        </span>
        ${q.reference ? `<span class="text-[11px] text-slate-500 dark:text-slate-400">${q.reference}</span>` : ''}
      </div>

      <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2">${q.title}</h3>
      <p class="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200 mb-6 leading-relaxed">${q.questionText || ''}</p>

      <div class="space-y-3" id="standard-options-container">
        ${options.map((opt, idx) => `
          <button 
            type="button" 
            onclick="window.Views.submitStandardOption(${idx}, this)"
            class="standard-option-btn w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-700/80 transition flex items-center justify-between text-right font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 active:scale-[0.98] shadow-sm"
          >
            <span class="flex-1 leading-relaxed">${opt}</span>
            <span class="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono font-bold mr-3 shrink-0">
              ${idx + 1}
            </span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
};

/* =============================================================================
   GAMEPLAY ANSWER HANDLERS & INTERACTIVE PUZZLES
   ============================================================================= */

// 1. Interactive Sequential Order Movement & Submission
window.Views.moveSequentialItem = function(itemId, direction) {
  const container = document.getElementById('sequential-items-container');
  if (!container) return;

  const items = Array.from(container.querySelectorAll('.sequential-item'));
  const currentIndex = items.findIndex(el => el.getAttribute('data-id') === itemId);
  if (currentIndex === -1) return;

  const targetIndex = currentIndex + direction;
  if (targetIndex < 0 || targetIndex >= items.length) return;

  const currentEl = items[currentIndex];
  const targetEl = items[targetIndex];

  if (direction > 0) {
    container.insertBefore(targetEl, currentEl);
  } else {
    container.insertBefore(currentEl, targetEl);
  }

  if (window.GameSound) window.GameSound.playTap();
};

window.Views.submitSequentialAnswer = function(questionId) {
  const container = document.getElementById('sequential-items-container');
  if (!container) return;

  const items = Array.from(container.querySelectorAll('.sequential-item'));
  const currentSequence = items.map(el => el.getAttribute('data-id'));

  const engine = window.GameEngine;
  const currentQ = engine.getCurrentQuestion();
  if (!currentQ) return;

  const correctSeq = currentQ.correctSequence || (currentQ.items ? currentQ.items.map(i => i.id) : []);
  const isCorrect = JSON.stringify(currentSequence) === JSON.stringify(correctSeq);

  const result = engine.submitAnswer(isCorrect ? correctSeq : 'wrong_order');
  if (!result) return;

  window.Views.handleAnswerFeedback(result);
};

// 2. Interactive Memory Cards Flip & Match
window.Views.handleMemoryCardClick = function(cardIndex) {
  if (!window._activeMemoryCards || !window._activeMemoryCards[cardIndex]) return;
  window._selectedMemoryCards = window._selectedMemoryCards || [];

  const card = window._activeMemoryCards[cardIndex];
  const cardBtn = document.getElementById(`mem-card-${cardIndex}`);
  if (!cardBtn || cardBtn.classList.contains('matched') || window._selectedMemoryCards.some(sc => sc.index === cardIndex)) {
    return;
  }

  if (window.GameSound) window.GameSound.playTap();

  // Highlight selected card
  cardBtn.classList.add('ring-4', 'ring-indigo-500', 'bg-indigo-200', 'dark:bg-indigo-900');
  window._selectedMemoryCards.push({ index: cardIndex, card });

  if (window._selectedMemoryCards.length === 2) {
    const [first, second] = window._selectedMemoryCards;
    const firstBtn = document.getElementById(`mem-card-${first.index}`);
    const secondBtn = document.getElementById(`mem-card-${second.index}`);

    if (first.card.matchId === second.card.matchId) {
      // Match Found!
      setTimeout(() => {
        if (firstBtn) {
          firstBtn.classList.remove('ring-indigo-500', 'bg-indigo-200', 'dark:bg-indigo-900');
          firstBtn.classList.add('matched', 'bg-emerald-500', 'text-white', 'opacity-90', 'cursor-default');
          firstBtn.innerHTML = `<span>✓ ${first.card.text}</span>`;
        }
        if (secondBtn) {
          secondBtn.classList.remove('ring-indigo-500', 'bg-indigo-200', 'dark:bg-indigo-900');
          secondBtn.classList.add('matched', 'bg-emerald-500', 'text-white', 'opacity-90', 'cursor-default');
          secondBtn.innerHTML = `<span>✓ ${second.card.text}</span>`;
        }
        if (window.GameSound) window.GameSound.playCorrect();
        window._selectedMemoryCards = [];

        // Check if all pairs matched
        const allMatched = document.querySelectorAll('#memory-cards-grid .matched').length;
        if (allMatched >= window._activeMemoryCards.length) {
          const engine = window.GameEngine;
          const result = engine.submitAnswer('all_pairs_matched');
          if (result) window.Views.handleAnswerFeedback(result);
        }
      }, 400);
    } else {
      // Not a match
      setTimeout(() => {
        if (firstBtn) firstBtn.classList.remove('ring-4', 'ring-indigo-500', 'bg-indigo-200', 'dark:bg-indigo-900');
        if (secondBtn) secondBtn.classList.remove('ring-4', 'ring-indigo-500', 'bg-indigo-200', 'dark:bg-indigo-900');
        if (window.GameSound) window.GameSound.playWrong();
        window._selectedMemoryCards = [];
      }, 700);
    }
  }
};

// 3. Interactive Audio Speller Builders
window.Views.addSpellerLetter = function(char) {
  window._currentSpelledLetters = window._currentSpelledLetters || [];
  window._currentSpelledLetters.push(char);

  const displayBox = document.getElementById('spelled-word-display');
  if (displayBox) {
    displayBox.innerHTML = window._currentSpelledLetters.map(c => `
      <span class="w-10 h-10 rounded-xl bg-teal-600 text-white font-arabic font-black text-xl flex items-center justify-center shadow-md animate-scale-in">
        ${c}
      </span>
    `).join('');
  }

  if (window.GameSound) window.GameSound.playTap();
};

window.Views.clearSpellerLetters = function() {
  window._currentSpelledLetters = [];
  const displayBox = document.getElementById('spelled-word-display');
  if (displayBox) {
    displayBox.innerHTML = '<span class="text-slate-400 text-xs">نیچے دیے گئے حروف پر کلک کریں...</span>';
  }
};

window.Views.submitSpellerWord = function() {
  window._currentSpelledLetters = window._currentSpelledLetters || [];
  const spelled = window._currentSpelledLetters.join('').trim();
  if (!spelled) {
    window.App.showToast('براہِ کرم حروف پر کلک کر کے لفظ مکمل فرمائیں۔', 'warning');
    return;
  }

  const engine = window.GameEngine;
  const result = engine.submitAnswer(spelled);
  if (!result) return;

  window.Views.handleAnswerFeedback(result);
};

window.Views.submitStandardOption = function(selectedIndex, btnElement) {
  if (window.MediaEngine) window.MediaEngine.stopAllMedia();
  const engine = window.GameEngine;
  const currentQ = engine.getCurrentQuestion();
  if (!currentQ) return;

  const targetIdx = currentQ.correctOptionIndex !== undefined ? currentQ.correctOptionIndex : (currentQ.correctAnswer !== undefined ? currentQ.correctAnswer : 0);
  const isCorrect = Number(selectedIndex) === Number(targetIdx);

  if (btnElement) {
    if (isCorrect) {
      btnElement.classList.remove('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700');
      btnElement.classList.add('bg-emerald-500', 'text-white', 'border-emerald-600', 'ring-4', 'ring-emerald-400/40', 'scale-[1.02]');
    } else {
      btnElement.classList.remove('bg-slate-50', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700');
      btnElement.classList.add('bg-rose-100', 'text-rose-700', 'dark:bg-rose-950/60', 'dark:text-rose-300', 'border-rose-500', 'opacity-50', 'pointer-events-none', 'line-through');
    }
  }

  const result = engine.submitAnswer(selectedIndex);
  if (!result) return;

  window.Views.handleAnswerFeedback(result);
};

window.Views.submitRapidAnswer = function(choice, btnElement) {
  const engine = window.GameEngine;
  const currentQ = engine.getCurrentQuestion();
  if (!currentQ) return;

  const isCorrect = String(choice).toLowerCase() === String(currentQ.correctAnswer || currentQ.correct || 'true').toLowerCase();
  
  if (btnElement) {
    if (isCorrect) {
      btnElement.classList.add('ring-4', 'ring-emerald-400/40', 'scale-105');
    } else {
      btnElement.classList.add('opacity-40', 'pointer-events-none', 'grayscale');
    }
  }

  const result = engine.submitAnswer(isCorrect ? (currentQ.correctAnswer || 'true') : 'wrong_choice');
  if (!result) return;

  window.Views.handleAnswerFeedback(result);
};

window.Views.submitGemAnswer = function(selectedWord, correctWord, btnElement) {
  const engine = window.GameEngine;
  const isCorrect = String(selectedWord).trim() === String(correctWord).trim();

  if (btnElement) {
    if (isCorrect) {
      btnElement.classList.remove('bg-white', 'dark:bg-slate-800');
      btnElement.classList.add('bg-emerald-500', 'text-white', 'border-emerald-600', 'ring-4', 'ring-emerald-400/40', 'scale-105');
      const display = document.getElementById('verse-display-box');
      if (display) {
        display.innerHTML = display.innerHTML.replace('___', `<span class="text-amber-300 underline font-black">${selectedWord}</span>`);
      }
    } else {
      btnElement.classList.add('bg-rose-100', 'text-rose-700', 'dark:bg-rose-950', 'dark:text-rose-300', 'opacity-40', 'pointer-events-none', 'line-through');
    }
  }

  const result = engine.submitAnswer(isCorrect ? correctWord : 'wrong');
  if (!result) return;

  window.Views.handleAnswerFeedback(result);
};

window.Views.advanceToNextQuestion = function() {
  if (window._isAdvancingQuestion) return;
  window._isAdvancingQuestion = true;
  if (window._advanceTimeout) {
    clearTimeout(window._advanceTimeout);
    window._advanceTimeout = null;
  }
  const engine = window.GameEngine;
  if (engine && engine.activeSession) {
    if (engine.activeSession.isCompleted) {
      window.Views.renderStageCompletionModal({
        isPassed: true,
        stars: engine.activeSession.earnedStars || 3,
        accuracy: engine.activeSession.accuracy || 100,
        earnedXp: engine.activeSession.earnedXp || 150,
        earnedCoins: engine.activeSession.earnedCoins || 50
      });
    } else {
      window.Views.renderLiveStageViewport(engine.activeSession);
    }
  }
  setTimeout(() => { window._isAdvancingQuestion = false; }, 300);
};

window.Views.handleAnswerFeedback = function(result) {
  const engine = window.GameEngine;

  // Live HUD updates
  const livesCounter = document.getElementById('gameplay-lives-counter');
  if (livesCounter) livesCounter.innerText = result.livesRemaining;

  // Sound & Toast Feedback
  if (result.isCorrect) {
    if (window.GameSound) {
      if (result.combo > 1) {
        window.GameSound.playCombo(result.combo);
      } else {
        window.GameSound.playCorrect();
      }
    }
    window.App.showToast(`✨ شاندار! درست جواب (+${result.pointsEarned} پوائنٹس)`, 'success');

    // Show explicit Next Button for instant tapping
    const cardEl = document.getElementById('game-active-question-card');
    if (cardEl && !result.isComplete && !document.getElementById('next-action-trigger-btn')) {
      const nextBtnContainer = document.createElement('div');
      nextBtnContainer.id = 'next-action-trigger-btn';
      nextBtnContainer.className = 'mt-4 pt-2 animate-fade-in';
      nextBtnContainer.innerHTML = `
        <button onclick="window.Views.advanceToNextQuestion()" class="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 text-base transition active:scale-95 ring-4 ring-emerald-400/30">
          <span>اگلا سوال جاری رکھیں (Next Challenge)</span>
          <i data-lucide="arrow-left" class="w-5 h-5"></i>
        </button>
      `;
      cardEl.appendChild(nextBtnContainer);
      if (window.lucide) window.lucide.createIcons();
    }

    // Auto-advance after 1.1 seconds or immediately on click
    if (result.isComplete) {
      window._advanceTimeout = setTimeout(() => {
        window.Views.renderStageCompletionModal(result);
      }, 700);
    } else {
      window._advanceTimeout = setTimeout(() => {
        window.Views.advanceToNextQuestion();
      }, 1100);
    }
  } else {
    // Wrong Answer
    if (window.GameSound) window.GameSound.playWrong();

    if (result.isFailed) {
      // No more hearts/lives
      window.App.showToast('افسوس! تمام دل ختم ہو گئے۔ دوبارہ کوشش فرمائیں۔', 'error');
      setTimeout(() => {
        window.Views.renderStageCompletionModal(result);
      }, 700);
    } else {
      // Still has lives! Stay on the same question, allow picking another option
      window.App.showToast(`نادرست جواب! پوائنٹس کٹ گئے اور ایک دل کم ہو گیا (${result.livesRemaining} دل باقی)۔ دوبارہ کوشش کریں!`, 'error');
    }
  }
};

/* =============================================================================
   STAGE COMPLETION & VICTORY MODAL (Confetti Celebration)
   ============================================================================= */

window.Views.renderStageCompletionModal = function(result) {
  const isPassed = result.isPassed && result.stars > 0;
  const engine = window.GameEngine;
  const session = engine.activeSession;

  const modalHtml = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md font-urdu select-none animate-fade-in" dir="rtl">
      <div class="bg-white dark:bg-slate-900 border-2 ${isPassed ? 'border-amber-400' : 'border-rose-400'} rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl space-y-5">
        
        <!-- Trophy or Heartbreak Icon -->
        <div class="w-20 h-20 mx-auto rounded-3xl ${isPassed ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-amber-400/50 ring-4 ring-amber-300/40 animate-bounce-slow' : 'bg-rose-100 text-rose-600'} flex items-center justify-center text-4xl shadow-xl">
          ${isPassed ? '🏆' : '💔'}
        </div>

        <div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            ${isPassed ? 'ماشاءاللہ! مرحلہ فتح ہو گیا!' : 'افسوس! دل ختم ہو گئے'}
          </h2>
          <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">
            ${isPassed ? 'آپ نے شاندار کارکردگی کا مظاہرہ کر کے انعامات حاصل کیے۔' : 'دوبارہ کوشش کریں اور زیادہ غور سے جوابات دیں۔'}
          </p>
        </div>

        <!-- 3 Golden Stars Display -->
        <div class="flex items-center justify-center gap-2 text-3xl py-2">
          <span class="${result.stars >= 1 ? 'text-amber-400 animate-scale-in' : 'text-slate-300 dark:text-slate-700'}">★</span>
          <span class="${result.stars >= 2 ? 'text-amber-400 animate-scale-in' : 'text-slate-300 dark:text-slate-700'}">★</span>
          <span class="${result.stars >= 3 ? 'text-amber-400 animate-scale-in' : 'text-slate-300 dark:text-slate-700'}">★</span>
        </div>

        <!-- Stats Rewards Box -->
        <div class="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-sans">
          <div class="p-2">
            <div class="text-[10px] text-slate-500 font-urdu">علمی ترقی</div>
            <div class="text-sm font-black text-emerald-600 dark:text-emerald-400">+${result.earnedXp || 150} XP</div>
          </div>
          <div class="p-2">
            <div class="text-[10px] text-slate-500 font-urdu">طلائی سکے</div>
            <div class="text-sm font-black text-amber-600 dark:text-amber-400">+${result.earnedCoins || 50} 🪙</div>
          </div>
          <div class="p-2">
            <div class="text-[10px] text-slate-500 font-urdu">درستگی</div>
            <div class="text-sm font-black text-indigo-600 dark:text-indigo-400">${result.accuracy}%</div>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="space-y-2 pt-2">
          ${isPassed ? `
            <button onclick="window.Views.closeCompletionModalAndMap()" class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-sm shadow-lg active:scale-95 transition flex items-center justify-center gap-2">
              <span>ایڈونچر میپ پر واپس جائیں</span>
              <i data-lucide="map" class="w-4 h-4"></i>
            </button>
          ` : `
            <button onclick="window.Views.retryCurrentStage()" class="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-sm shadow-lg active:scale-95 transition flex items-center justify-center gap-2">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i>
              <span>دوبارہ کھیلیں (Retry)</span>
            </button>
            <button onclick="window.Views.closeCompletionModalAndMap()" class="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs hover:bg-slate-200 transition">
              میپ پر واپس جائیں
            </button>
          `}
        </div>

      </div>
    </div>
  `;

  const modalContainer = document.createElement('div');
  modalContainer.id = 'stage-completion-modal-root';
  modalContainer.innerHTML = modalHtml;
  document.body.appendChild(modalContainer);

  if (window.lucide) window.lucide.createIcons();
};

window.Views.closeCompletionModalAndMap = function() {
  if (window._gameplayTimerInterval) {
    clearInterval(window._gameplayTimerInterval);
    window._gameplayTimerInterval = null;
  }
  if (window.MediaEngine) window.MediaEngine.stopAllMedia();

  const root = document.getElementById('stage-completion-modal-root');
  if (root) root.remove();

  const engine = window.GameEngine;
  const worldId = engine.activeSession ? engine.activeSession.worldId : 'cls-1';
  engine.activeSession = null;

  window.Views.renderAdventureGame({ worldId });
};

window.Views.retryCurrentStage = function() {
  if (window._gameplayTimerInterval) {
    clearInterval(window._gameplayTimerInterval);
    window._gameplayTimerInterval = null;
  }
  if (window.MediaEngine) window.MediaEngine.stopAllMedia();

  const root = document.getElementById('stage-completion-modal-root');
  if (root) root.remove();

  const engine = window.GameEngine;
  if (engine.activeSession) {
    const { worldId, stageId } = engine.activeSession;
    window.Views.startAdventureStage(worldId, stageId);
  } else {
    window.Views.renderAdventureGame();
  }
};

window.Views.confirmExitStage = function() {
  if (confirm('کیا آپ واقعی اس مرحلے سے باہر جانا چاہتے ہیں؟ آپ کی موجودہ پیشرفت ضائع ہو سکتی ہے۔')) {
    if (window._gameplayTimerInterval) {
      clearInterval(window._gameplayTimerInterval);
      window._gameplayTimerInterval = null;
    }
    if (window.MediaEngine) window.MediaEngine.stopAllMedia();

    window.GameEngine.activeSession = null;
    window.Views.renderAdventureGame();
  }
};

/* =============================================================================
   POWER-UP TRIGGERS & MODALS (Store, Missions, 1-v-1 Arena)
   ============================================================================= */

window.Views.triggerFiftyFifty = function() {
  const engine = window.GameEngine;
  const eliminated = engine.applyFiftyFifty();
  if (eliminated && Array.isArray(eliminated)) {
    const btns = document.querySelectorAll('.standard-option-btn');
    eliminated.forEach(idx => {
      if (btns[idx]) {
        btns[idx].style.opacity = '0.25';
        btns[idx].style.pointerEvents = 'none';
        btns[idx].classList.add('line-through');
      }
    });
    window.App.showToast('50/50 لاگو! دو غلط جوابات خارج کر دیے گئے۔', 'success');
  } else {
    window.App.showToast('50/50 پہلے ہی استعمال ہو چکا ہے یا دستیاب نہیں۔', 'warning');
  }
};

window.Views.triggerHint = function() {
  const engine = window.GameEngine;
  const hintText = engine.applyHint();
  if (hintText) {
    window.App.showModal('💡 علمی اشارہ (Scholar\'s Hint)', `
      <div class="p-4 text-center font-urdu space-y-4" dir="rtl">
        <div class="text-4xl">✨</div>
        <p class="text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed">${hintText}</p>
        <button onclick="window.App.closeModal()" class="py-2.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md">سمجھ گیا (Got it)</button>
      </div>
    `);
  } else {
    window.App.showToast('اشارہ پہلے ہی استعمال ہو چکا ہے یا دستیاب نہیں۔', 'warning');
  }
};

window.Views.triggerTimeBoost = function() {
  const engine = window.GameEngine;
  const newTime = engine.applyTimeBoost();
  if (newTime) {
    const counter = document.getElementById('gameplay-timer-counter');
    if (counter) counter.innerText = `${newTime}s`;
    window.App.showToast('وقت میں +15 سیکنڈ کا اضافہ ہو گیا!', 'success');
  } else {
    window.App.showToast('وقت کا بوسٹ دستیاب نہیں ہے۔', 'warning');
  }
};

window.Views.triggerExtraLife = function() {
  const engine = window.GameEngine;
  const newLives = engine.applyExtraLife();
  if (newLives) {
    const counter = document.getElementById('gameplay-lives-counter');
    if (counter) counter.innerText = newLives;
    window.App.showToast('اضافی زندگی (+1 دل) بحال ہو گئی!', 'success');
  } else {
    window.App.showToast('دل پہلے ہی مکمل ہیں یا دستیاب نہیں۔', 'warning');
  }
};

window.Views.toggleSound = function(btn) {
  if (window.GameSound) {
    const isMuted = window.GameSound.toggleMute();
    window.App.showToast(isMuted ? 'صوتی اثرات بند کر دیے گئے۔' : 'صوتی اثرات آن ہو گئے۔ 🔔', 'info');
    if (btn) {
      btn.innerHTML = `<i data-lucide="${isMuted ? 'volume-x' : 'volume-2'}" class="w-4 h-4 text-emerald-600 dark:text-emerald-400"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
  }
};

/* =============================================================================
   POWER-UP STORE MODAL
   ============================================================================= */

window.Views.openPowerUpStoreModal = function() {
  const engine = window.GameEngine;
  const p = engine.loadProfile();
  const powerups = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gamePowerups') || []) : [];

  const modalHtml = `
    <div id="powerup-store-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md font-urdu select-none animate-fade-in" dir="rtl">
      <div class="bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-right shadow-2xl space-y-5">
        
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🛍️</span>
            <div>
              <h3 class="text-lg font-black text-slate-900 dark:text-white">سکوں کی دکان و پاور اپس</h3>
              <p class="text-[11px] text-slate-500">اپنے کمائے گئے طلائی سکوں سے پاور اپس خریدیں</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950 px-3 py-1 rounded-xl border border-amber-300 font-sans font-black text-amber-800 dark:text-amber-300">
            <span>🪙</span>
            <span>${p.coins}</span>
          </div>
        </div>

        <!-- Powerups Grid -->
        <div class="space-y-3 max-h-80 overflow-y-auto pr-1">
          ${powerups.map(item => `
            <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-lg">
                  ${item.type === 'hint' ? '💡' : item.type === 'fiftyFifty' ? '✂️' : item.type === 'timeBoost' ? '⏳' : '❤️'}
                </div>
                <div>
                  <h4 class="text-xs sm:text-sm font-black text-slate-900 dark:text-white">${item.title}</h4>
                  <p class="text-[10px] text-slate-500">${item.description}</p>
                </div>
              </div>
              <button 
                onclick="window.Views.buyPowerUp('${item.type}', ${item.costCoins})"
                class="py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-sm transition active:scale-95 shrink-0 flex items-center gap-1"
              >
                <span>${item.costCoins} 🪙</span>
                <span>خریدیں</span>
              </button>
            </div>
          `).join('')}
        </div>

        <button onclick="document.getElementById('powerup-store-modal').remove()" class="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200 transition">
          بند کریں
        </button>

      </div>
    </div>
  `;

  const existing = document.getElementById('powerup-store-modal');
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.innerHTML = modalHtml;
  document.body.appendChild(div.firstElementChild);
};

window.Views.buyPowerUp = function(powerUpType, cost) {
  const engine = window.GameEngine;
  const p = engine.loadProfile();

  if (p.coins < cost) {
    window.App.showToast('آپ کے پاس مطلوبہ سکے (Coins) موجود نہیں ہیں۔', 'warning');
    return;
  }

  p.coins -= cost;
  p.inventory[powerUpType] = (p.inventory[powerUpType] || 0) + 1;
  engine.saveProfile(p);

  if (window.GameSound) window.GameSound.playCoin();
  window.App.showToast('پاور اپ کامیابی سے خرید لیا گیا! 🎉', 'success');

  // Refresh modal
  window.Views.openPowerUpStoreModal();
};

/* =============================================================================
   DAILY MISSIONS & 1-V-1 ARENA MODALS
   ============================================================================= */

window.Views.openDailyMissionsModal = function() {
  const missions = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gameMissions') || []) : [];

  const modalHtml = `
    <div id="daily-missions-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md font-urdu select-none animate-fade-in" dir="rtl">
      <div class="bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full text-right shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>📜</span>
            <span>روزانہ و ہفتہ وار مشنز</span>
          </h3>
          <button onclick="document.getElementById('daily-missions-modal').remove()" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div class="space-y-3">
          ${missions.map(m => `
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-black text-slate-900 dark:text-white">${m.title}</h4>
                <span class="text-[10px] font-bold text-amber-600 dark:text-amber-400">+${m.rewardCoins} 🪙 | +${m.rewardXp} XP</span>
              </div>
              <p class="text-[11px] text-slate-600 dark:text-slate-400">${m.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const existing = document.getElementById('daily-missions-modal');
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.innerHTML = modalHtml;
  document.body.appendChild(div.firstElementChild);
};

window.Views.openFriendArenaModal = function() {
  const code = 'LH-ARENA-' + Math.floor(1000 + Math.random() * 9000);

  const modalHtml = `
    <div id="friend-arena-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md font-urdu select-none animate-fade-in" dir="rtl">
      <div class="bg-white dark:bg-slate-900 border-2 border-indigo-300 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl space-y-5">
        <div class="w-16 h-16 mx-auto rounded-3xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-3xl shadow-md">
          ⚔️
        </div>
        <div>
          <h3 class="text-lg font-black text-slate-900 dark:text-white">دوست سے 1-v-1 علمی مقابلہ</h3>
          <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">اپنے دوست کو روم کوڈ بھیجیں اور بیک وقت لائیو چیلنج کھیلیں</p>
        </div>

        <div class="p-4 bg-indigo-50 dark:bg-slate-800 rounded-2xl border-2 border-indigo-200 dark:border-slate-700">
          <div class="text-[10px] text-slate-500 font-urdu mb-1">آپ کا پرائیویٹ روم کوڈ:</div>
          <div class="text-xl font-black text-indigo-700 dark:text-indigo-400 font-mono select-all tracking-wider">${code}</div>
        </div>

        <button onclick="navigator.clipboard.writeText('${code}'); window.App.showToast('روم کوڈ کاپی ہو گیا! دوست کو واٹس ایپ پر بھیجیں۔', 'success')" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2">
          <span>روم کوڈ کاپی کریں</span>
          <i data-lucide="copy" class="w-4 h-4"></i>
        </button>

        <button onclick="document.getElementById('friend-arena-modal').remove()" class="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200 transition">
          بند کریں
        </button>
      </div>
    </div>
  `;

  const existing = document.getElementById('friend-arena-modal');
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.innerHTML = modalHtml;
  document.body.appendChild(div.firstElementChild);

  if (window.lucide) window.lucide.createIcons();
};

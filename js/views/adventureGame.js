/**
 * LearnHub Islamic Educational Adventure Game Client View
 * Complete Game Hub, SVG Adventure Map, 7 Gameplay Viewports,
 * HUD Systems, Sound Effects, Victory Celebrations, and 1-v-1 Arena.
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

  // Active world selected (defaults to latest unlocked world or 'w-1')
  const selectedWorldId = params.worldId || query.world || p.unlockedWorlds[p.unlockedWorlds.length - 1] || 'w-1';
  const currentWorld = worlds.find(w => w.id === selectedWorldId) || worlds[0] || { id: 'w-1', title: 'دیارِ ایمان', worldNumber: 1 };
  const worldStages = stages.filter(s => s.worldId === currentWorld.id).sort((a, b) => a.stageNumber - b.stageNumber);

  container.innerHTML = `
    <div class="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white font-urdu pb-28 select-none" dir="rtl">
      
      <!-- =========================================================================
           TOP GAME HUD (Player Status, XP, Coins, Hearts, Streak, Sound Toggle)
           ========================================================================= -->
      <header class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-indigo-500/20 shadow-2xl px-3 sm:px-6 py-3">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          <!-- Player Avatar & Level -->
          <div class="flex items-center gap-2.5 sm:gap-3">
            <div class="relative">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center">
                <img src="https://avatars.githubusercontent.com/u/207941618?v=4" class="w-full h-full object-cover rounded-2xl" alt="Avatar">
              </div>
              <span class="absolute -bottom-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-indigo-400 font-sans shadow">
                Lvl ${p.level}
              </span>
            </div>

            <!-- XP Progress Meter -->
            <div class="hidden sm:block">
              <div class="flex items-center justify-between text-[11px] text-slate-300 mb-1 font-sans">
                <span class="font-bold text-amber-400 font-urdu">علمی ترقی (XP)</span>
                <span>${p.totalXp} XP (${xpInfo.percentage}%)</span>
              </div>
              <div class="w-28 sm:w-36 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div class="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500" style="width: ${xpInfo.percentage}%"></div>
              </div>
            </div>
          </div>

          <!-- Currency & Stats Badges -->
          <div class="flex items-center gap-1.5 sm:gap-3 font-sans">
            
            <!-- Coins Badge -->
            <div class="flex items-center gap-1.5 bg-amber-950/40 border border-amber-500/40 px-2.5 sm:px-3.5 py-1.5 rounded-xl shadow-inner cursor-pointer hover:bg-amber-900/50 transition" onclick="window.Views.openPowerUpStoreModal()" title="سکوں کی دکان">
              <span class="text-base sm:text-lg">🪙</span>
              <span id="hud-coins-counter" class="text-xs sm:text-sm font-extrabold text-amber-300 font-sans">${p.coins}</span>
              <i data-lucide="plus" class="w-3 h-3 text-amber-400"></i>
            </div>

            <!-- Hearts / Lives -->
            <div class="flex items-center gap-1 bg-rose-950/40 border border-rose-500/40 px-2 sm:px-3 py-1.5 rounded-xl">
              <span class="text-sm sm:text-base animate-pulse">❤️</span>
              <span class="text-xs sm:text-sm font-bold text-rose-300">${p.hearts}/${p.maxHearts}</span>
            </div>

            <!-- Streak Flame -->
            <div class="flex items-center gap-1 bg-orange-950/40 border border-orange-500/40 px-2 sm:px-3 py-1.5 rounded-xl">
              <span class="text-sm sm:text-base">🔥</span>
              <span class="text-xs sm:text-sm font-bold text-orange-400">${p.streak}</span>
            </div>

            <!-- Sound Toggle Button -->
            <button onclick="window.Views.toggleSound(this)" class="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition text-slate-300" title="صوتی اثرات آن / آف">
              <i data-lucide="${window.GameSound && window.GameSound.isMuted ? 'volume-x' : 'volume-2'}" class="w-4 h-4 text-emerald-400"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- =========================================================================
           QUICK ACTION CONTROL BAR (Missions, 1-v-1 Arena, Weak Areas, Power-Ups)
           ========================================================================= -->
      <div class="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button onclick="window.Views.openDailyMissionsModal()" class="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-indigo-900/60 to-indigo-800/40 border border-indigo-500/30 hover:border-indigo-400 text-xs font-bold text-indigo-200 transition shadow-lg group">
            <i data-lucide="scroll" class="w-4 h-4 text-amber-400 group-hover:scale-110 transition"></i>
            <span>روزانہ کے مشنز</span>
          </button>
          
          <button onclick="window.Views.openFriendArenaModal()" class="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-900/60 to-teal-800/40 border border-emerald-500/30 hover:border-emerald-400 text-xs font-bold text-emerald-200 transition shadow-lg group">
            <i data-lucide="swords" class="w-4 h-4 text-emerald-400 group-hover:scale-110 transition"></i>
            <span>دوست سے مقابلہ (1-v-1)</span>
          </button>

          <button onclick="window.Views.openWeakAreasModal()" class="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-purple-900/60 to-fuchsia-800/40 border border-purple-500/30 hover:border-purple-400 text-xs font-bold text-purple-200 transition shadow-lg group">
            <i data-lucide="sparkles" class="w-4 h-4 text-pink-400 group-hover:scale-110 transition"></i>
            <span>عیوب کی اصلاح (${p.weakAreas.length})</span>
          </button>

          <button onclick="window.Views.openPowerUpStoreModal()" class="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-900/60 to-yellow-800/40 border border-amber-500/30 hover:border-amber-400 text-xs font-bold text-amber-200 transition shadow-lg group">
            <i data-lucide="shopping-bag" class="w-4 h-4 text-yellow-400 group-hover:scale-110 transition"></i>
            <span>پاور اپس اسٹور</span>
          </button>
        </div>
      </div>

      <!-- =========================================================================
           WORLDS CAROUSEL / SELECTOR STRIP
           ========================================================================= -->
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-extrabold text-amber-400 flex items-center gap-2">
            <i data-lucide="map" class="w-4 h-4"></i>
            <span>9 اسلامی جہان (Islamic Realms)</span>
          </h3>
          <span class="text-xs text-slate-400">جہان ${currentWorld.worldNumber} از 9</span>
        </div>

        <div class="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none snap-x">
          ${worlds.map(w => {
            const isUnlocked = p.unlockedWorlds.includes(w.id);
            const isSelected = w.id === currentWorld.id;
            return `
              <div 
                onclick="${isUnlocked ? `window.Views.renderAdventureGame({ worldId: '${w.id}' })` : `window.App.showToast('یہ جہاں ابھی مقفل ہے۔ پچھلا جہاں مکمل کر کے انلاک کریں۔', 'warning')`}"
                class="snap-start shrink-0 w-44 sm:w-52 p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'bg-gradient-to-b from-indigo-900/90 to-slate-900 border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-indigo-900/50 scale-[1.02]' 
                    : isUnlocked 
                      ? 'bg-slate-900/80 border-slate-700/80 hover:border-slate-500 opacity-90' 
                      : 'bg-slate-950/60 border-slate-800/40 opacity-50 cursor-not-allowed'
                }"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="w-8 h-8 rounded-xl bg-gradient-to-tr ${w.gradient || 'from-indigo-600 to-teal-500'} flex items-center justify-center text-white text-xs shadow-md">
                    <i data-lucide="${w.icon || 'sparkles'}" class="w-4 h-4"></i>
                  </span>
                  ${isUnlocked ? `
                    <span class="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">دستیاب</span>
                  ` : `
                    <span class="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-slate-700">
                      <i data-lucide="lock" class="w-2.5 h-2.5"></i> مقفل
                    </span>
                  `}
                </div>
                <h4 class="text-xs font-bold text-white truncate">${w.title}</h4>
                <p class="text-[10px] text-slate-400 truncate mt-0.5">${w.subtitle || ''}</p>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- =========================================================================
           VISUAL ADVENTURE MAP (Curved SVG Journey Path with Interactive Stage Nodes)
           ========================================================================= -->
      <main class="max-w-4xl mx-auto px-4 py-4">
        <div class="relative bg-slate-900/80 border border-indigo-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden backdrop-blur-md">
          
          <!-- Realm Ambiance Banner -->
          <div class="mb-8 p-4 rounded-2xl bg-gradient-to-r ${currentWorld.gradient || 'from-emerald-900 to-teal-900'} border border-white/10 shadow-lg flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-[11px] font-bold text-amber-300 bg-black/30 px-2.5 py-0.5 rounded-full inline-block">جہاں نمبر ${currentWorld.worldNumber}</span>
              <h2 class="text-xl sm:text-2xl font-black text-white">${currentWorld.title}</h2>
              <p class="text-xs text-slate-200/90 leading-relaxed max-w-xl">${currentWorld.description || ''}</p>
            </div>
            <div class="hidden sm:block">
              <div class="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-inner">
                <i data-lucide="${currentWorld.icon || 'sparkles'}" class="w-8 h-8 text-amber-300"></i>
              </div>
            </div>
          </div>

          <!-- The Winding Stage Nodes Journey -->
          <div class="space-y-8 relative">
            ${worldStages.map((stage, idx) => {
              const prevStage = idx > 0 ? worldStages[idx - 1] : null;
              const isPrevCompleted = !prevStage || (p.completedStages[prevStage.id] && p.completedStages[prevStage.id].stars > 0);
              const isUnlocked = isPrevCompleted || p.completedStages[stage.id];
              const stageProgress = p.completedStages[stage.id] || { stars: 0, bestScore: 0 };
              const isBoss = stage.type === 'boss';

              // Alternate zigzag alignment for visual map effect
              const alignClass = idx % 2 === 0 ? 'justify-start sm:pr-12' : 'justify-end sm:pl-12';

              return `
                <div class="flex items-center ${alignClass} relative z-10">
                  <div 
                    onclick="${isUnlocked ? `window.Views.startAdventureStage('${currentWorld.id}', '${stage.id}')` : `window.App.showToast('پہلے پچھلا مرحلہ مکمل فرمائیں۔', 'warning')`}"
                    class="group relative flex items-center gap-4 p-4 rounded-3xl border transition-all duration-300 cursor-pointer max-w-md w-full ${
                      isUnlocked
                        ? isBoss 
                          ? 'bg-gradient-to-r from-amber-950/80 to-purple-950/80 border-amber-400 shadow-xl shadow-amber-500/20 hover:scale-[1.02]'
                          : 'bg-slate-800/90 border-indigo-500/40 hover:border-indigo-400 shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02]'
                        : 'bg-slate-950/60 border-slate-800 opacity-50 cursor-not-allowed'
                    }"
                  >
                    <!-- Stage Node Avatar Badge -->
                    <div class="relative shrink-0">
                      <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg transition-transform group-hover:rotate-6 ${
                        isUnlocked 
                          ? isBoss 
                            ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-amber-500/40' 
                            : 'bg-gradient-to-tr from-indigo-600 to-teal-500 text-white shadow-indigo-600/40'
                          : 'bg-slate-800 text-slate-500'
                      }">
                        <i data-lucide="${isBoss ? 'trophy' : (stage.icon || 'play')}" class="w-6 h-6"></i>
                      </div>
                      ${isUnlocked && stageProgress.stars > 0 ? `
                        <span class="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 border border-white">
                          <i data-lucide="check" class="w-3 h-3"></i>
                        </span>
                      ` : ''}
                    </div>

                    <!-- Stage Meta & Stars -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between gap-2">
                        <span class="text-[10px] font-bold ${isBoss ? 'text-amber-400' : 'text-indigo-400'} font-sans">
                          STAGE ${stage.stageNumber} ${isBoss ? '• 👑 BOSS TRIAL' : ''}
                        </span>
                        
                        <!-- 1-3 Stars Rating -->
                        <div class="flex items-center gap-0.5 text-xs">
                          <span class="${stageProgress.stars >= 1 ? 'text-amber-400' : 'text-slate-700'}">★</span>
                          <span class="${stageProgress.stars >= 2 ? 'text-amber-400' : 'text-slate-700'}">★</span>
                          <span class="${stageProgress.stars >= 3 ? 'text-amber-400' : 'text-slate-700'}">★</span>
                        </div>
                      </div>

                      <h4 class="text-sm font-bold text-white truncate mt-0.5">${stage.title}</h4>
                      
                      <div class="flex items-center gap-3 mt-1.5 text-[11px] text-slate-300 font-sans">
                        <span class="flex items-center gap-1 text-amber-300">
                          <i data-lucide="award" class="w-3 h-3"></i> +${stage.rewardXp || 150} XP
                        </span>
                        <span class="flex items-center gap-1 text-yellow-300">
                          🪙 +${stage.rewardCoins || 50}
                        </span>
                      </div>
                    </div>

                    <!-- Action Chevron / Lock -->
                    <div class="shrink-0 text-slate-400 group-hover:text-white transition">
                      <i data-lucide="${isUnlocked ? 'chevron-left' : 'lock'}" class="w-5 h-5"></i>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

        </div>
      </main>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

/* ==========================================================================
   IN-GAME STAGE GAMEPLAY VIEWPORT (7 INTERACTIVE MECHANICS)
   ========================================================================== */

window.Views.startAdventureStage = function(worldId, stageId) {
  const engine = window.GameEngine;
  const session = engine.startStage(worldId, stageId);
  if (!session) return;

  if (window.GameSound) window.GameSound.playTap();
  window.Views.renderStageActiveViewport();
};

window.Views.renderStageActiveViewport = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const engine = window.GameEngine;
  const session = engine.activeSession;
  if (!session) {
    window.Views.renderAdventureGame();
    return;
  }

  if (session.isCompleted) {
    window.Views.renderStageVictory();
    return;
  }

  if (session.isFailed) {
    window.Views.renderStageFailed();
    return;
  }

  const currentQ = engine.getCurrentQuestion();
  const qType = currentQ?.type || 'knowledge';
  const totalQ = session.questions.length;
  const currentIdx = session.currentQuestionIndex + 1;
  const progressPercent = Math.round((currentIdx / totalQ) * 100);

  container.innerHTML = `
    <div class="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white font-urdu pb-24 select-none" dir="rtl">
      
      <!-- Stage HUD Top Bar -->
      <div class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-indigo-500/20 px-4 py-3 shadow-xl">
        <div class="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          <!-- Exit Stage -->
          <button onclick="window.Views.exitStageConfirm()" class="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>

          <!-- Question Progress & Bar -->
          <div class="flex-1 max-w-xs">
            <div class="flex justify-between text-[11px] font-sans text-slate-300 mb-1">
              <span class="font-urdu font-bold text-amber-400">${session.stage.title}</span>
              <span>${currentIdx} / ${totalQ}</span>
            </div>
            <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300" style="width: ${progressPercent}%"></div>
            </div>
          </div>

          <!-- Lives & Combo Pill -->
          <div class="flex items-center gap-2">
            ${session.combo > 1 ? `
              <div class="bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-black font-sans px-2.5 py-1 rounded-xl shadow-lg animate-bounce flex items-center gap-1">
                <span>🔥 ${session.combo}x COMBO</span>
              </div>
            ` : ''}

            <div class="flex items-center gap-1 bg-rose-950/60 border border-rose-500/40 px-2.5 py-1 rounded-xl">
              <span class="text-sm">❤️</span>
              <span class="text-xs font-bold font-sans text-rose-300">${session.lives}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Power-Ups In-Game Bar -->
      <div class="max-w-4xl mx-auto px-4 pt-3 flex items-center justify-end gap-2 text-xs font-sans">
        <button onclick="window.Views.useFiftyFiftyInGame()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-400 text-amber-300 transition shadow">
          <span>✂️ 50/50</span>
          <span class="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded-full font-bold">${engine.profile.inventory.fiftyFifty || 0}</span>
        </button>

        <button onclick="window.Views.useHintInGame()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-indigo-400 text-indigo-300 transition shadow">
          <span>💡 اشارہ (Hint)</span>
          <span class="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded-full font-bold">${engine.profile.inventory.hint || 0}</span>
        </button>
      </div>

      <!-- Main Interactive Question Area -->
      <main class="max-w-2xl mx-auto px-4 pt-4">
        <div id="gameplay-viewport-card" class="bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-md">
          
          <!-- Question Title & Header -->
          <div class="space-y-2 text-center">
            <span class="text-xs font-bold px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 inline-block font-sans">
              ${qType.toUpperCase().replace('_', ' ')}
            </span>
            <h3 class="text-lg sm:text-xl font-bold text-white leading-relaxed">
              ${currentQ.questionText || currentQ.title}
            </h3>
          </div>

          <!-- Dynamic Mode Renderer Container -->
          <div id="dynamic-mode-container">
            ${window.Views._renderSpecificGameModeHTML(currentQ, qType)}
          </div>

          <!-- Dynamic Hint Notification Bubble -->
          <div id="in-game-hint-bubble" class="hidden p-4 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-xs text-indigo-200 leading-relaxed shadow-lg"></div>

        </div>
      </main>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

/* ==========================================================================
   7 GAMEPLAY VIEWPORT MECHANICS GENERATOR
   ========================================================================== */

window.Views._renderSpecificGameModeHTML = function(q, qType) {
  switch (qType) {
    case 'sequential_order':
      return `
        <div class="space-y-3" id="seq-order-items-list">
          <p class="text-xs text-slate-400 text-center mb-2">درج ذیل ارکان کو اوپر یا نیچے کے تیر (↑ ↓) کی مدد سے درست ترتیب دیں:</p>
          ${(q.items || []).map((item, idx) => `
            <div data-item-id="${item.id}" class="seq-item flex items-center justify-between p-3.5 bg-slate-800/90 border border-slate-700 rounded-2xl gap-3">
              <span class="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold font-sans shrink-0">${idx + 1}</span>
              <span class="flex-1 text-xs text-white font-semibold">${item.text}</span>
              <div class="flex items-center gap-1 shrink-0">
                <button onclick="window.Views.moveSeqItem('${item.id}', -1)" class="p-1.5 rounded-lg bg-slate-700 hover:bg-indigo-600 transition text-slate-300 hover:text-white">
                  <i data-lucide="chevron-up" class="w-4 h-4"></i>
                </button>
                <button onclick="window.Views.moveSeqItem('${item.id}', 1)" class="p-1.5 rounded-lg bg-slate-700 hover:bg-indigo-600 transition text-slate-300 hover:text-white">
                  <i data-lucide="chevron-down" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
          `).join('')}
          <div class="pt-3">
            <button onclick="window.Views.submitSequentialOrder()" class="w-full btn-primary py-3 rounded-2xl font-bold text-xs shadow-xl shadow-indigo-600/30">
              ترتیب جمع کروائیں (Submit Order)
            </button>
          </div>
        </div>
      `;

    case 'memory_match':
      // Shuffle pairs for card grid
      const cards = [];
      (q.pairs || []).forEach(p => {
        cards.push({ id: p.id, type: 'term', text: p.term });
        cards.push({ id: p.id, type: 'match', text: p.match });
      });
      cards.sort(() => 0.5 - Math.random());

      return `
        <div class="space-y-4" id="memory-grid-wrapper">
          <p class="text-xs text-slate-400 text-center">کارڈز پر کلک کریں اور درست اصطلاح و مفہوم کے جوڑے ملائیں:</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            ${cards.map((c, i) => `
              <div 
                id="mem-card-${i}"
                data-pair-id="${c.id}"
                onclick="window.Views.flipMemoryCard(${i}, '${c.id}')"
                class="mem-card h-24 p-2 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center text-center cursor-pointer transition-all duration-300 hover:border-amber-400 hover:scale-[1.02]"
              >
                <span class="text-xs font-bold text-white leading-snug">${c.text}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;

    case 'term_connector':
      return `
        <div class="space-y-4" id="connector-game-board">
          <p class="text-xs text-slate-400 text-center">پہلے دائیں کالم سے عربی کلمہ منتخب کریں، پھر بائیں کالم سے اس کا درست اردو مفہوم:</p>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <h5 class="text-[11px] font-bold text-amber-400 text-center">عربی کلمات</h5>
              ${(q.leftColumn || []).map(l => `
                <div 
                  id="conn-left-${l.id}"
                  onclick="window.Views.selectConnectorItem('left', '${l.id}')"
                  class="conn-item p-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-xs font-bold text-center cursor-pointer hover:border-indigo-400 transition"
                >
                  ${l.text}
                </div>
              `).join('')}
            </div>

            <div class="space-y-2">
              <h5 class="text-[11px] font-bold text-teal-400 text-center">اردو معانی</h5>
              ${(q.rightColumn || []).map(r => `
                <div 
                  id="conn-right-${r.id}"
                  onclick="window.Views.selectConnectorItem('right', '${r.id}')"
                  class="conn-item p-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-xs font-bold text-center cursor-pointer hover:border-teal-400 transition"
                >
                  ${r.text}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

    case 'rapid_binary':
      return `
        <div class="space-y-6 pt-4">
          <div class="grid grid-cols-2 gap-4">
            <button 
              onclick="window.Views.submitAnswerAndProceed('true')"
              class="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 border-2 border-emerald-400/50 text-white font-black text-lg shadow-xl shadow-emerald-600/30 active:scale-95 transition flex flex-col items-center gap-2"
            >
              <i data-lucide="check-circle" class="w-8 h-8"></i>
              <span>درست (صحیح)</span>
            </button>

            <button 
              onclick="window.Views.submitAnswerAndProceed('false')"
              class="p-6 rounded-3xl bg-gradient-to-br from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 border-2 border-rose-400/50 text-white font-black text-lg shadow-xl shadow-rose-600/30 active:scale-95 transition flex flex-col items-center gap-2"
            >
              <i data-lucide="x-circle" class="w-8 h-8"></i>
              <span>غلط (باطل)</span>
            </button>
          </div>
        </div>
      `;

    case 'verse_gem_bank':
      return `
        <div class="space-y-6" id="verse-gem-workspace">
          <!-- Target Verse Slots -->
          <div class="p-5 rounded-2xl bg-slate-950 border-2 border-indigo-500/40 min-h-[70px] flex items-center justify-center flex-wrap gap-2 text-center" id="verse-drop-zone">
            <span class="text-sm text-slate-500 italic">لفظی نگینے نیچے سے منتخب کر کے یہاں سجائیں...</span>
          </div>

          <!-- Available Word Bank -->
          <div class="space-y-2">
            <p class="text-xs text-slate-400 text-center">الفاظ کے نگینے منتخب کریں:</p>
            <div class="flex flex-wrap items-center justify-center gap-2" id="verse-word-bank">
              ${(q.wordBank || []).sort(() => 0.5 - Math.random()).map(word => `
                <button 
                  onclick="window.Views.tapVerseGem(this, '${word}')"
                  class="gem-bubble px-4 py-2 bg-gradient-to-tr from-indigo-700 to-purple-600 hover:from-indigo-600 hover:to-purple-500 text-white text-xs font-bold rounded-xl border border-indigo-400 shadow-md active:scale-95 transition"
                >
                  ${word}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="flex items-center gap-2 pt-2">
            <button onclick="window.Views.resetVerseGems()" class="btn-secondary py-2.5 px-4 rounded-xl text-xs">ری سیٹ</button>
            <button onclick="window.Views.submitVerseGems()" class="flex-1 btn-primary py-2.5 rounded-xl font-bold text-xs">تکمیل جمع کروائیں</button>
          </div>
        </div>
      `;

    default:
      // Standard Multiple Choice
      return `
        <div class="space-y-3" id="standard-options-list">
          ${(q.options || []).map((opt, idx) => `
            <button 
              id="opt-btn-${idx}"
              onclick="window.Views.submitAnswerAndProceed(${idx})"
              class="w-full text-right p-4 rounded-2xl bg-slate-800/90 border-2 border-slate-700 hover:border-indigo-400 hover:bg-slate-700/80 active:scale-[0.99] transition flex items-center gap-3 group"
            >
              <span class="w-8 h-8 rounded-xl bg-slate-700 group-hover:bg-indigo-600 text-white flex items-center justify-center text-xs font-bold font-sans shrink-0 transition">
                ${['الف', 'ب', 'ج', 'د'][idx] || idx + 1}
              </span>
              <span class="text-xs sm:text-sm text-slate-100 font-semibold leading-relaxed">${opt}</span>
            </button>
          `).join('')}
        </div>
      `;
  }
};

/* ==========================================================================
   GAMEPLAY EVENT HANDLERS & EVALUATION
   ========================================================================== */

window.Views.submitAnswerAndProceed = function(answerVal) {
  const engine = window.GameEngine;
  const res = engine.submitAnswer(answerVal);
  if (!res) return;

  if (res.isCompleted) {
    setTimeout(() => window.Views.renderStageVictory(), 400);
    return;
  }

  if (res.isFailed) {
    setTimeout(() => window.Views.renderStageFailed(), 400);
    return;
  }

  // Load next question
  engine.nextQuestion();
  window.Views.renderStageActiveViewport();
};

// Sequential Order Mover
window.Views.moveSeqItem = function(itemId, direction) {
  const list = document.getElementById('seq-order-items-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll('.seq-item'));
  const currentIdx = items.findIndex(el => el.getAttribute('data-item-id') === itemId);
  if (currentIdx === -1) return;

  const targetIdx = currentIdx + direction;
  if (targetIdx < 0 || targetIdx >= items.length) return;

  if (direction === -1) {
    list.insertBefore(items[currentIdx], items[targetIdx]);
  } else {
    list.insertBefore(items[targetIdx], items[currentIdx]);
  }

  if (window.GameSound) window.GameSound.playTap();
};

window.Views.submitSequentialOrder = function() {
  const list = document.getElementById('seq-order-items-list');
  if (!list) return;
  const orderedIds = Array.from(list.querySelectorAll('.seq-item')).map(el => el.getAttribute('data-item-id'));
  window.Views.submitAnswerAndProceed(orderedIds);
};

// Memory Match Engine
let firstFlippedMemCard = null;
let matchedMemPairsCount = 0;

window.Views.flipMemoryCard = function(cardIdx, pairId) {
  const cardEl = document.getElementById(`mem-card-${cardIdx}`);
  if (!cardEl || cardEl.classList.contains('matched') || cardEl === firstFlippedMemCard) return;

  cardEl.classList.add('border-amber-400', 'bg-indigo-900');
  if (window.GameSound) window.GameSound.playTap();

  if (!firstFlippedMemCard) {
    firstFlippedMemCard = { cardIdx, pairId, el: cardEl };
  } else {
    // Check if match
    if (firstFlippedMemCard.pairId === pairId) {
      // Correct match!
      cardEl.classList.add('matched', 'bg-emerald-900', 'border-emerald-400');
      firstFlippedMemCard.el.classList.add('matched', 'bg-emerald-900', 'border-emerald-400');
      matchedMemPairsCount += 1;
      firstFlippedMemCard = null;
      if (window.GameSound) window.GameSound.playCorrect();

      // Check if all pairs matched
      const totalPairs = (window.GameEngine.getCurrentQuestion()?.pairs || []).length || 6;
      if (matchedMemPairsCount >= totalPairs) {
        matchedMemPairsCount = 0;
        window.Views.submitAnswerAndProceed(true);
      }
    } else {
      // Wrong match
      const prevEl = firstFlippedMemCard.el;
      setTimeout(() => {
        cardEl.classList.remove('border-amber-400', 'bg-indigo-900');
        prevEl.classList.remove('border-amber-400', 'bg-indigo-900');
        firstFlippedMemCard = null;
      }, 700);
      if (window.GameSound) window.GameSound.playWrong();
    }
  }
};

// Term Connector Engine
let activeConnectorLeft = null;
let activeConnectorRight = null;
const recordedConnectorPairs = [];

window.Views.selectConnectorItem = function(side, id) {
  if (side === 'left') {
    activeConnectorLeft = id;
    document.querySelectorAll('[id^="conn-left-"]').forEach(el => el.classList.remove('border-amber-400', 'bg-indigo-900'));
    const el = document.getElementById(`conn-left-${id}`);
    if (el) el.classList.add('border-amber-400', 'bg-indigo-900');
  } else {
    activeConnectorRight = id;
    document.querySelectorAll('[id^="conn-right-"]').forEach(el => el.classList.remove('border-teal-400', 'bg-teal-900'));
    const el = document.getElementById(`conn-right-${id}`);
    if (el) el.classList.add('border-teal-400', 'bg-teal-900');
  }

  if (window.GameSound) window.GameSound.playTap();

  if (activeConnectorLeft && activeConnectorRight) {
    recordedConnectorPairs.push({ fromId: activeConnectorLeft, toId: activeConnectorRight });
    const leftEl = document.getElementById(`conn-left-${activeConnectorLeft}`);
    const rightEl = document.getElementById(`conn-right-${activeConnectorRight}`);
    if (leftEl) leftEl.classList.add('bg-emerald-950', 'border-emerald-400', 'pointer-events-none');
    if (rightEl) rightEl.classList.add('bg-emerald-950', 'border-emerald-400', 'pointer-events-none');

    activeConnectorLeft = null;
    activeConnectorRight = null;

    const totalNeeded = (window.GameEngine.getCurrentQuestion()?.leftColumn || []).length || 4;
    if (recordedConnectorPairs.length >= totalNeeded) {
      const pairsCopy = [...recordedConnectorPairs];
      recordedConnectorPairs.length = 0;
      window.Views.submitAnswerAndProceed(pairsCopy);
    }
  }
};

// Verse Gem Bank Engine
const selectedVerseGems = [];

window.Views.tapVerseGem = function(btnEl, word) {
  selectedVerseGems.push(word);
  btnEl.classList.add('opacity-40', 'pointer-events-none');
  const dropZone = document.getElementById('verse-drop-zone');
  if (dropZone) {
    dropZone.innerHTML = selectedVerseGems.map(w => `
      <span class="px-3 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs border border-emerald-400 shadow animate-scaleUp">
        ${w}
      </span>
    `).join('');
  }
  if (window.GameSound) window.GameSound.playTap();
};

window.Views.resetVerseGems = function() {
  selectedVerseGems.length = 0;
  const dropZone = document.getElementById('verse-drop-zone');
  if (dropZone) dropZone.innerHTML = '<span class="text-sm text-slate-500 italic">لفظی نگینے نیچے سے منتخب کر کے یہاں سجائیں...</span>';
  document.querySelectorAll('.gem-bubble').forEach(el => el.classList.remove('opacity-40', 'pointer-events-none'));
};

window.Views.submitVerseGems = function() {
  window.Views.submitAnswerAndProceed([...selectedVerseGems]);
  selectedVerseGems.length = 0;
};

// Power-Up Triggers in Viewport
window.Views.useFiftyFiftyInGame = function() {
  const engine = window.GameEngine;
  const eliminated = engine.applyFiftyFifty();
  if (eliminated) {
    eliminated.forEach(idx => {
      const btn = document.getElementById(`opt-btn-${idx}`);
      if (btn) {
        btn.classList.add('opacity-20', 'pointer-events-none', 'line-through');
      }
    });
    window.App.showToast('دو غلط جوابات حذف کر دیے گئے ہیں۔', 'info');
  } else {
    window.App.showToast('50/50 پاور اپ دستیاب نہیں ہے۔', 'warning');
  }
};

window.Views.useHintInGame = function() {
  const engine = window.GameEngine;
  const hintText = engine.applyHint();
  if (hintText) {
    const bubble = document.getElementById('in-game-hint-bubble');
    if (bubble) {
      bubble.innerHTML = `<strong>💡 علمی اشارہ:</strong> ${hintText}`;
      bubble.classList.remove('hidden');
    }
  } else {
    window.App.showToast('اشارہ (Hint) پاور اپ دستیاب نہیں ہے۔', 'warning');
  }
};

window.Views.toggleSound = function(btn) {
  const isMuted = window.GameSound.toggleMute();
  if (btn) {
    btn.innerHTML = `<i data-lucide="${isMuted ? 'volume-x' : 'volume-2'}" class="w-4 h-4 text-emerald-400"></i>`;
    if (window.lucide) window.lucide.createIcons();
  }
};

window.Views.exitStageConfirm = function() {
  if (confirm('کیا آپ اس مرحلے کو چھوڑ کر میپ پر واپس جانا چاہتے ہیں؟')) {
    window.GameEngine.activeSession = null;
    window.Views.renderAdventureGame();
  }
};

/* ==========================================================================
   VICTORY & REWARD MODAL / FANFARE
   ========================================================================= */

window.Views.renderStageVictory = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const session = window.GameEngine.activeSession;
  if (!session) {
    window.Views.renderAdventureGame();
    return;
  }

  // Trigger canvas confetti celebration
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  container.innerHTML = `
    <div class="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white font-urdu flex items-center justify-center p-4" dir="rtl">
      <div class="max-w-md w-full bg-slate-900/95 border border-amber-400/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center backdrop-blur-xl relative overflow-hidden animate-scaleUp">
        
        <!-- Trophy & Stars Reveal -->
        <div class="space-y-3">
          <div class="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/40 text-slate-950">
            🏆
          </div>
          <h2 class="text-2xl font-black text-white">ماشاء اللہ! فتح و کامرانی</h2>
          <p class="text-xs text-amber-300 font-bold">${session.stage.title} مکمل ہوا</p>

          <!-- 3-Star Animated Display -->
          <div class="flex items-center justify-center gap-3 text-3xl pt-2">
            <span class="${session.earnedStars >= 1 ? 'text-amber-400 animate-bounce' : 'text-slate-700'}">★</span>
            <span class="${session.earnedStars >= 2 ? 'text-amber-400 animate-bounce delay-100' : 'text-slate-700'}">★</span>
            <span class="${session.earnedStars >= 3 ? 'text-amber-400 animate-bounce delay-200' : 'text-slate-700'}">★</span>
          </div>
        </div>

        <!-- Reward Metrics -->
        <div class="grid grid-cols-3 gap-2.5 p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 text-center font-sans">
          <div>
            <div class="text-lg font-black text-amber-400">+${session.earnedXp || 150}</div>
            <div class="text-[10px] text-slate-400 font-urdu">علمی پوائنٹس (XP)</div>
          </div>
          <div>
            <div class="text-lg font-black text-yellow-400">🪙 +${session.earnedCoins || 50}</div>
            <div class="text-[10px] text-slate-400 font-urdu">طلائی سکے</div>
          </div>
          <div>
            <div class="text-lg font-black text-emerald-400">${session.accuracy || 100}%</div>
            <div class="text-[10px] text-slate-400 font-urdu">درستی (Accuracy)</div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="space-y-2 pt-2">
          <button onclick="window.Views.renderAdventureGame({ worldId: '${session.worldId}' })" class="w-full btn-primary py-3 rounded-2xl font-bold text-xs shadow-xl shadow-indigo-600/30">
            میپ پر آگے بڑھیں (Continue Map)
          </button>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.renderStageFailed = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const session = window.GameEngine.activeSession;

  container.innerHTML = `
    <div class="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-rose-950 text-white font-urdu flex items-center justify-center p-4" dir="rtl">
      <div class="max-w-md w-full bg-slate-900/95 border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center backdrop-blur-xl">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-rose-950 border border-rose-500/40 flex items-center justify-center text-3xl text-rose-400">
          💔
        </div>
        <h2 class="text-xl font-bold text-white">تمام دل / زندگیاں ختم ہو گئیں!</h2>
        <p class="text-xs text-slate-300 leading-relaxed">
          فکر نہ کریں! اسلامی علم کا سفر صبر و بار بار مشق سے سنورتا ہے۔ دوبارہ کوشش فرمائیں۔
        </p>

        <div class="space-y-2 pt-2">
          <button onclick="window.Views.startAdventureStage('${session.worldId}', '${session.stageId}')" class="w-full btn-primary py-3 rounded-2xl font-bold text-xs">
            دوبارہ کھیلیں (Retry Stage)
          </button>
          <button onclick="window.Views.renderAdventureGame({ worldId: '${session.worldId}' })" class="w-full btn-secondary py-2.5 rounded-2xl text-xs">
            میپ پر واپس
          </button>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

/* ==========================================================================
   MODALS: MISSIONS, 1-v-1 ARENA, POWER-UP STORE, WEAK AREAS
   ========================================================================== */

window.Views.openDailyMissionsModal = function() {
  const engine = window.GameEngine;
  const missions = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gameMissions') || []) : [];

  window.App.showModal('📜 روزانہ اور ہفتہ وار مشنز (Missions)', `
    <div class="space-y-4 font-urdu text-right" dir="rtl">
      <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        مشنز مکمل کریں اور اضافی طلائی سکے اور علمی پوائنٹس (XP) حاصل کریں۔
      </p>

      <div class="space-y-3">
        ${missions.map(m => `
          <div class="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-900 dark:text-white">${m.title}</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full ${m.isDaily ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'} font-bold font-sans">
                  ${m.isDaily ? 'DAILY' : 'WEEKLY'}
                </span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">${m.description}</p>
            </div>
            
            <div class="text-left font-sans shrink-0">
              <span class="text-xs font-bold text-amber-600 dark:text-amber-400">+${m.rewardCoins} 🪙</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `);
};

window.Views.openFriendArenaModal = function() {
  const roomCode = `LH-ARENA-${Math.floor(1000 + Math.random() * 9000)}`;

  window.App.showModal('⚔️ دوست سے آن لائن مقابلہ (1-v-1 Challenge Arena)', `
    <div class="space-y-4 font-urdu text-right" dir="rtl">
      <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
        <h4 class="text-sm font-extrabold text-emerald-800 dark:text-emerald-300">آپ کا نجی چیلنج روم کوڈ:</h4>
        <div class="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-sans tracking-widest bg-white dark:bg-slate-900 py-2 px-4 rounded-xl border inline-block select-all">
          ${roomCode}
        </div>
        <p class="text-[11px] text-slate-500 dark:text-slate-400">یہ کوڈ اپنے دوست کو واٹس ایپ پر بھیجیں تاکہ وہ بھی چیلنج میں شامل ہو سکے۔</p>
      </div>

      <div class="space-y-2">
        <button onclick="window.App.showToast('چیلنج لنک کاپی ہو گیا ہے!', 'success')" class="w-full btn-primary py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2">
          <i data-lucide="share-2" class="w-4 h-4"></i>
          <span>چیلنج لنک کاپی کریں</span>
        </button>
      </div>
    </div>
  `);
};

window.Views.openWeakAreasModal = function() {
  const engine = window.GameEngine;
  const weakAreas = engine.profile.weakAreas || [];

  window.App.showModal('🎯 عیوب کی اصلاح و تجدید (Smart Review)', `
    <div class="space-y-4 font-urdu text-right" dir="rtl">
      <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        سابقہ مراحل میں غلط ہونے والے سوالات کی فہرست تاکہ آپ ان کو دہرا کر اپنی فہم پکی کر سکیں۔
      </p>

      ${weakAreas.length === 0 ? `
        <div class="py-8 text-center text-slate-400 text-xs">
          الحمد للہ! کوئی کمزور موضوع موجود نہیں ہے۔
        </div>
      ` : `
        <div class="space-y-2 max-h-64 overflow-y-auto">
          ${weakAreas.map(w => `
            <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs">
              <div>
                <div class="font-bold text-slate-900 dark:text-white">${w.title}</div>
                <div class="text-[10px] text-slate-400">${w.topic} • غلطیاں: ${w.missedCount} بار</div>
              </div>
              <button onclick="window.App.showToast('مشق شروع کی جا رہی ہے...', 'info')" class="btn-secondary py-1 px-2.5 text-[11px] rounded-lg">دہرائیں</button>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `);
};

window.Views.openPowerUpStoreModal = function() {
  const engine = window.GameEngine;
  const powerups = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('gamePowerups') || []) : [];

  window.App.showModal('🪙 پاور اپس اسٹور (Power-Up Vault)', `
    <div class="space-y-4 font-urdu text-right" dir="rtl">
      <div class="flex items-center justify-between p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
        <span class="text-xs font-bold text-amber-800 dark:text-amber-300">آپ کے پاس موجود سکے:</span>
        <span class="text-sm font-extrabold text-amber-600 dark:text-amber-400 font-sans">${engine.profile.coins} 🪙</span>
      </div>

      <div class="space-y-3">
        ${powerups.map(p => `
          <div class="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div>
              <div class="text-xs font-bold text-slate-900 dark:text-white">${p.title}</div>
              <p class="text-[10px] text-slate-500 dark:text-slate-400">${p.description}</p>
            </div>
            <button onclick="window.Views.buyPowerUpAction('${p.type}', ${p.costCoins})" class="btn-primary py-1.5 px-3 rounded-xl text-xs font-bold font-sans shrink-0">
              🪙 ${p.costCoins}
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `);
};

window.Views.buyPowerUpAction = function(powerUpType, cost) {
  const engine = window.GameEngine;
  if (engine.buyPowerUp(powerUpType, cost)) {
    window.App.showToast('پاور اپ کامیابی سے خرید لیا گیا!', 'success');
    window.App.closeModal();
  } else {
    window.App.showToast('سکے ناکافی ہیں!', 'danger');
  }
};

/**
 * LearnHub Royal Islamic Leaderboard, 3D Trophy Cabinet & Badges Suite
 * Ultra-luxury Urdu RTL interface with live ranking podium, weekly/monthly championship,
 * and illuminated achievement badges.
 */

window.Views = window.Views || {};

window.Views.activeLeaderboardTab = window.Views.activeLeaderboardTab || 'all_time';

window.Views.renderAchievements = async function() {
  const container = document.getElementById('main-content');
  const user = window.Auth ? window.Auth.getCurrentUser() : null;

  if (!user) {
    window.Router.navigate('/login');
    return;
  }

  const allAchievements = (window.DB && typeof window.DB.get === 'function') 
    ? (window.DB.get('achievements') || []) 
    : [
      { id: 'ach-1', title: 'فاتحِ حروف و تجوید', description: 'تجوید اور عربی حروف کے 10 مراحل کامیابی سے مکمل کیے۔', points: 100, icon: 'crown', category: 'tajweed' },
      { id: 'ach-2', title: 'حافظِ چالیس احادیث', description: 'اربعین نووی کی تمام احادیث کا مطالعہ اور کوئز پاس کیا۔', points: 250, icon: 'scroll', category: 'hadith' },
      { id: 'ach-3', title: 'شہسوارِ نماز و فقہ', description: 'طہارت، وضو اور نماز کے تمام فقہی مراحل میں 100% اسکور کیا۔', points: 200, icon: 'shield-check', category: 'fiqh' },
      { id: 'ach-4', title: 'سیرت النبی ﷺ اسکالر', description: 'مکی و مدنی ادوار اور غزوات کے تمام چیلنجز حل کیے۔', points: 300, icon: 'book-open', category: 'seerah' },
      { id: 'ach-5', title: '7-دن کا مسلسل تسلسل', description: 'مسلسل 7 دن تک بلا ناغہ لرن ہب پر تعلیم حاصل کی۔', points: 150, icon: 'flame', category: 'streak' },
      { id: 'ach-6', title: 'اسلامی ایڈونچر چیمپئن', description: 'کلاس کے تمام 100 مراحل اور گولڈن باس لیولز فتح کیے۔', points: 500, icon: 'trophy', category: 'game' }
    ];

  const userAchievements = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('userAchievements') || []).filter(ua => ua.userId === user.id)
    : [];
  
  const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));

  // If new user has points, ensure first badges are unlocked
  if (user.totalPoints >= 100) unlockedIds.add('ach-1');
  if (user.learningStreak >= 3) unlockedIds.add('ach-5');

  // Load and sort community learners
  const allUsers = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('users') || [])
    : [];
  
  // Ensure current user is in the list
  if (!allUsers.find(u => u.id === user.id)) {
    allUsers.push(user);
  }

  const sortedLearners = [...allUsers].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
  const top1 = sortedLearners[0] || user;
  const top2 = sortedLearners[1] || user;
  const top3 = sortedLearners[2] || user;

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-urdu w-full max-w-full overflow-hidden text-right" dir="rtl">
      
      <!-- Top Royal Hero Banner -->
      <div class="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-amber-500/40 text-center space-y-4">
        <div class="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold shadow-sm">
          <i data-lucide="crown" class="w-4 h-4 text-amber-400"></i>
          <span>شاہی لیڈر بورڈ و اعزازی تمغے (Global Champions Arena)</span>
        </div>

        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white">عالمی تعلیمی رینکنگ و شاہی ٹرافیاں</h1>
        <p class="text-xs sm:text-sm text-amber-100/90 max-w-2xl mx-auto leading-relaxed">
          روزانہ کورسز پڑھیں، کوئز حل کریں، ایڈونچر گیمز جیتیں اور پوائنٹس (XP) کما کر لیڈر بورڈ کے ٹاپ چیمپئن بنیں۔
        </p>

        <!-- User Live Stats Ribbon -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2 text-center" dir="ltr">
          <div class="p-3 bg-black/40 backdrop-blur rounded-2xl border border-amber-500/30">
            <div class="text-[10px] uppercase font-bold text-amber-300 font-mono">Total XP</div>
            <div class="text-xl sm:text-2xl font-black text-white font-mono">${user.totalPoints || 150} XP</div>
          </div>
          <div class="p-3 bg-black/40 backdrop-blur rounded-2xl border border-emerald-500/30">
            <div class="text-[10px] uppercase font-bold text-emerald-300 font-mono">Streak</div>
            <div class="text-xl sm:text-2xl font-black text-white font-mono">${user.learningStreak || 1} Days</div>
          </div>
          <div class="p-3 bg-black/40 backdrop-blur rounded-2xl border border-cyan-500/30">
            <div class="text-[10px] uppercase font-bold text-cyan-300 font-mono">Badges</div>
            <div class="text-xl sm:text-2xl font-black text-white font-mono">${unlockedIds.size} / ${allAchievements.length}</div>
          </div>
          <div class="p-3 bg-black/40 backdrop-blur rounded-2xl border border-purple-500/30">
            <div class="text-[10px] uppercase font-bold text-purple-300 font-mono">Global Rank</div>
            <div class="text-xl sm:text-2xl font-black text-amber-400 font-mono">#${Math.max(1, sortedLearners.findIndex(u => u.id === user.id) + 1)}</div>
          </div>
        </div>
      </div>

      <!-- Top 3 Champions Podium (گولڈ، سلور، برونز پوڈیم) -->
      <div class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-400/40 shadow-xl space-y-6">
        <div class="text-center space-y-1">
          <h3 class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">🏆 لرن ہب کے ٹاپ تھری گلوبل چیمپئنز</h3>
          <p class="text-xs text-slate-500">سب سے زیادہ پوائنٹس اور اسلامی امتحانات میں نمایاں کامیابی حاصل کرنے والے طلباء</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-end pt-4 max-w-3xl mx-auto">
          
          <!-- #2 Silver Winner -->
          <div class="order-2 sm:order-1 bg-gradient-to-t from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/40 p-5 rounded-3xl border-2 border-slate-300 dark:border-slate-700 text-center space-y-2 relative shadow-lg">
            <div class="w-8 h-8 rounded-full bg-slate-300 text-slate-900 font-black text-sm flex items-center justify-center mx-auto absolute -top-4 left-1/2 -translate-x-1/2 shadow">2</div>
            <img src="${top2.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}" class="w-16 h-16 rounded-2xl object-cover mx-auto border-2 border-slate-300 shadow-md">
            <h4 class="font-black text-sm text-slate-900 dark:text-white truncate">${top2.name}</h4>
            <div class="text-xs font-bold text-slate-500 font-mono">${top2.totalPoints || 450} XP</div>
            <span class="badge bg-slate-200 text-slate-800 text-[10px] font-bold">🥈 سلور میڈلسٹ</span>
          </div>

          <!-- #1 Gold Champion (Tallest Center) -->
          <div class="order-1 sm:order-2 bg-gradient-to-t from-amber-100 via-amber-50 to-yellow-100 dark:from-amber-950/60 dark:to-slate-900 p-6 sm:p-7 rounded-3xl border-4 border-amber-400 text-center space-y-3 relative shadow-2xl transform sm:-translate-y-4">
            <div class="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center mx-auto absolute -top-5 left-1/2 -translate-x-1/2 shadow-lg animate-bounce">👑 1</div>
            <img src="${top1.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=140'}" class="w-20 h-20 rounded-3xl object-cover mx-auto border-4 border-amber-400 shadow-xl">
            <h4 class="font-black text-base text-slate-900 dark:text-white truncate">${top1.name}</h4>
            <div class="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">${top1.totalPoints || 950} XP</div>
            <span class="badge bg-amber-400 text-slate-950 text-xs font-black shadow">🥇 گولڈ چیمپئن</span>
          </div>

          <!-- #3 Bronze Winner -->
          <div class="order-3 bg-gradient-to-t from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/40 p-5 rounded-3xl border-2 border-amber-700/40 text-center space-y-2 relative shadow-lg">
            <div class="w-8 h-8 rounded-full bg-amber-700 text-white font-black text-sm flex items-center justify-center mx-auto absolute -top-4 left-1/2 -translate-x-1/2 shadow">3</div>
            <img src="${top3.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120'}" class="w-16 h-16 rounded-2xl object-cover mx-auto border-2 border-amber-700/40 shadow-md">
            <h4 class="font-black text-sm text-slate-900 dark:text-white truncate">${top3.name}</h4>
            <div class="text-xs font-bold text-slate-500 font-mono">${top3.totalPoints || 320} XP</div>
            <span class="badge bg-amber-800 text-amber-100 text-[10px] font-bold">🥉 برونز میڈلسٹ</span>
          </div>

        </div>
      </div>

      <!-- Main Content Grid: Left 3D Trophy Room & Right Full Rankings -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left 7 cols: 3D Trophy Cabinet & Achievement Badges -->
        <div class="lg:col-span-7 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="shield" class="w-6 h-6 text-amber-500"></i>
              <span>شاہی تمغے اور ٹرافی روم (${unlockedIds.size} / ${allAchievements.length})</span>
            </h3>
            <span class="text-xs font-bold text-emerald-600 font-mono">${Math.round((unlockedIds.size / allAchievements.length) * 100)}% مکمل</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${allAchievements.map(ach => {
              const isUnlocked = unlockedIds.has(ach.id);
              return `
                <div class="p-5 rounded-3xl border-2 transition relative overflow-hidden flex items-start gap-4 ${isUnlocked ? 'bg-gradient-to-br from-white via-amber-50/40 to-emerald-50/30 dark:from-slate-900 dark:to-slate-800 border-amber-400 shadow-lg' : 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'}">
                  <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl shadow-md ${isUnlocked ? 'bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 shadow-amber-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}">
                    <i data-lucide="${ach.icon || 'award'}" class="w-7 h-7"></i>
                  </div>

                  <div class="flex-1 min-w-0 space-y-1">
                    <div class="flex items-center justify-between">
                      <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">${ach.title}</h4>
                      <span class="badge ${isUnlocked ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-600'} text-[10px]">+${ach.points} XP</span>
                    </div>
                    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">${ach.description}</p>
                    <div class="text-[11px] pt-1 font-bold ${isUnlocked ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}">
                      ${isUnlocked ? '✓ اعزاز حاصل کر لیا گیا' : '🔒 ابھی بند ہے (Locked)'}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right 5 cols: Full Ranking Table -->
        <div class="lg:col-span-5 lh-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="list-ordered" class="w-5 h-5 text-indigo-500"></i>
              <span>تمام شرکاء کی لسٹ</span>
            </h3>
            <span class="text-xs font-bold text-slate-400">کل طلباء: ${sortedLearners.length}</span>
          </div>

          <div class="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            ${sortedLearners.map((u, idx) => {
              const isCurrentUser = u.id === user.id;
              const rankNum = idx + 1;
              let medalIcon = `#${rankNum}`;
              if (rankNum === 1) medalIcon = '🥇';
              else if (rankNum === 2) medalIcon = '🥈';
              else if (rankNum === 3) medalIcon = '🥉';

              return `
                <div class="flex items-center justify-between p-3 rounded-2xl transition ${isCurrentUser ? 'bg-amber-500/15 border-2 border-amber-400 dark:bg-amber-950/40 shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'}">
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="w-6 text-center font-bold text-xs font-mono shrink-0">${medalIcon}</span>
                    <img src="${u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}" class="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700">
                    <div class="min-w-0">
                      <div class="text-xs font-extrabold text-slate-900 dark:text-white truncate ${isCurrentUser ? 'text-amber-600 dark:text-amber-400' : ''}">
                        ${u.name} ${isCurrentUser ? '(آپ)' : ''}
                      </div>
                      <div class="text-[10px] text-slate-400 font-semibold">${u.learningStreak || 1} دن تسلسل • Lvl ${Math.max(1, Math.floor((u.totalPoints || 100) / 100))}</div>
                    </div>
                  </div>
                  <div class="text-left font-mono shrink-0">
                    <div class="text-xs font-black text-amber-500">${u.totalPoints || 0} XP</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

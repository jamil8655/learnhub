/**
 * LearnHub Gamification & Achievements Module
 */

window.Views = window.Views || {};

window.Views.renderAchievements = async function() {
  const container = document.getElementById('main-content');
  const user = window.Auth.getCurrentUser();

  if (!user) {
    window.Router.navigate('/login');
    return;
  }

  const allAchievements = window.DB.get('achievements');
  const userAchievements = window.DB.get('userAchievements').filter(ua => ua.userId === user.id);
  const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));

  const users = window.DB.get('users').sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <!-- Gamification Header -->
      <div class="bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <span class="badge bg-white/20 text-white text-xs font-bold">Gamification & XP</span>
            <h1 class="text-3xl font-extrabold">Achievements & Badges</h1>
            <p class="text-xs sm:text-sm text-amber-100 max-w-xl">Earn XP points by finishing lessons, passing standalone quizzes, and maintaining daily learning streaks.</p>
          </div>

          <div class="flex items-center gap-6 bg-slate-950/30 backdrop-blur p-4 rounded-2xl border border-white/10 shrink-0">
            <div>
              <div class="text-[11px] uppercase tracking-wider text-amber-200 font-bold">Total XP Points</div>
              <div class="text-3xl font-extrabold text-white">${user.totalPoints || 1450} <span class="text-sm font-normal text-amber-300">XP</span></div>
            </div>
            <div class="h-10 w-px bg-white/20"></div>
            <div>
              <div class="text-[11px] uppercase tracking-wider text-amber-200 font-bold">Badges</div>
              <div class="text-3xl font-extrabold text-white">${userAchievements.length} / ${allAchievements.length}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Badges Grid & Leaderboard -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Badges Grid -->
        <div class="lg:col-span-8 space-y-6">
          <h3 class="font-bold text-xl text-slate-900 dark:text-white">Milestone Badges</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${allAchievements.map(ach => {
              const isUnlocked = unlockedIds.has(ach.id);
              const userAchRecord = userAchievements.find(ua => ua.achievementId === ach.id);

              return `
                <div class="lh-card p-5 flex items-start gap-4 transition ${isUnlocked ? 'border-amber-300 dark:border-amber-800/60 shadow-md bg-amber-50/30 dark:bg-amber-950/10' : 'opacity-60 bg-slate-50 dark:bg-slate-900/40'}">
                  <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${isUnlocked ? 'bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}">
                    <i data-lucide="${ach.icon || 'award'}" class="w-6 h-6"></i>
                  </div>
                  <div class="flex-1 min-w-0 space-y-1">
                    <div class="flex items-center justify-between">
                      <h4 class="font-bold text-sm text-slate-900 dark:text-white">${ach.title}</h4>
                      <span class="badge ${isUnlocked ? 'badge-warning' : 'badge-neutral'} text-[10px]">+${ach.points} XP</span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">${ach.description}</p>
                    <div class="text-[10px] pt-1 ${isUnlocked ? 'text-emerald-600 font-bold' : 'text-slate-400'}">
                      ${isUnlocked ? `Unlocked on ${new Date(userAchRecord.unlockedAt).toLocaleDateString()}` : '🔒 Locked'}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right Community XP Leaderboard -->
        <div class="lg:col-span-4 lh-card p-6 space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="trophy" class="w-4 h-4 text-amber-500"></i> Top Learners
            </h3>
            <span class="text-xs text-slate-400">Global XP</span>
          </div>

          <div class="space-y-3">
            ${users.map((u, idx) => `
              <div class="flex items-center justify-between p-2.5 rounded-xl ${u.id === user.id ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}">
                <div class="flex items-center gap-3">
                  <span class="w-5 text-xs font-extrabold ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-slate-500'}">#${idx + 1}</span>
                  <img src="${u.avatar}" class="w-8 h-8 rounded-full object-cover">
                  <div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">${u.name}</div>
                    <span class="text-[10px] text-slate-400">${u.learningStreak || 1} day streak</span>
                  </div>
                </div>
                <span class="text-xs font-bold text-amber-500">${u.totalPoints || 0} XP</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
};

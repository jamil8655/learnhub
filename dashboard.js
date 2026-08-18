/**
 * LearnHub User Learning Dashboard View
 * Premium dashboard with streak calendar, continue learning, and enrolled masterclasses.
 */

window.Views = window.Views || {};

window.Views.renderDashboard = async function() {
  const container = document.getElementById('main-content');
  const user = window.Auth.getCurrentUser();

  if (!user) {
    window.Router.navigate('/login');
    return;
  }

  const enrollments = await window.API.getEnrollments(user.id);
  const inProgressCourses = enrollments.filter(e => e.status === 'in_progress');
  const completedCourses = enrollments.filter(e => e.status === 'completed');
  const quizAttempts = window.DB.get('quizAttempts').filter(a => a.userId === user.id);
  const certificates = window.DB.get('certificates').filter(c => c.userId === user.id);
  const activityLogs = window.DB.get('activityLogs').filter(a => a.userId === user.id);
  const achievements = window.DB.get('userAchievements').filter(ua => ua.userId === user.id);

  // Resume course candidate
  const continueCourse = inProgressCourses[0] || enrollments[0];

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <!-- Welcome & Streak Banner -->
      <div class="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div class="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <img src="${user.avatar}" alt="${user.name}" class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-400/40 shadow-md">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <h1 class="text-2xl sm:text-3xl font-extrabold">Welcome back, ${user.name}!</h1>
                <span class="badge badge-warning text-xs capitalize">${user.role}</span>
              </div>
              <p class="text-xs sm:text-sm text-indigo-200">${user.headline || 'Ready to level up your engineering skills today?'}</p>
            </div>
          </div>

          <!-- Learning Streak Widget -->
          <div class="flex items-center gap-4 bg-slate-950/40 backdrop-blur border border-indigo-500/20 p-4 rounded-2xl shrink-0">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg text-white">
              <i data-lucide="flame" class="w-7 h-7"></i>
            </div>
            <div>
              <div class="text-[11px] uppercase tracking-wider text-amber-300 font-bold">Daily Streak</div>
              <div class="text-xl font-extrabold text-white">${user.learningStreak || 12} Days Active</div>
              <div class="text-[10px] text-slate-400">Personal Best: ${user.longestStreak || 21} days</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Metric KPIs -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <div class="lh-card p-5 space-y-1 border-l-4 border-l-indigo-500">
          <div class="text-xs text-slate-500 dark:text-slate-400 font-semibold">Enrolled Courses</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">${enrollments.length}</div>
        </div>
        <div class="lh-card p-5 space-y-1 border-l-4 border-l-emerald-500">
          <div class="text-xs text-slate-500 dark:text-slate-400 font-semibold">Completed Courses</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-emerald-600">${completedCourses.length}</div>
        </div>
        <div class="lh-card p-5 space-y-1 border-l-4 border-l-cyan-500">
          <div class="text-xs text-slate-500 dark:text-slate-400 font-semibold">Quiz Attempts</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-cyan-600">${quizAttempts.length}</div>
        </div>
        <div class="lh-card p-5 space-y-1 border-l-4 border-l-amber-500">
          <div class="text-xs text-slate-500 dark:text-slate-400 font-semibold">Certificates Earned</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-amber-500">${certificates.length}</div>
        </div>
      </div>

      <!-- Continue Learning & Heatmap Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Continue Learning Card -->
        <div class="lg:col-span-7 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="play-circle" class="w-5 h-5 text-indigo-600"></i> Continue Learning
            </h3>
            <a href="#/my-courses" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">All My Courses &rarr;</a>
          </div>

          ${continueCourse ? `
            <div class="lh-card p-6 flex flex-col sm:flex-row gap-6 items-center shadow-lg border-2 border-indigo-100 dark:border-indigo-950">
              <img src="${continueCourse.course?.thumbnail}" alt="${continueCourse.course?.title}" class="w-full sm:w-44 aspect-video rounded-xl object-cover">
              <div class="flex-1 min-w-0 space-y-3">
                <div>
                  <span class="badge badge-primary text-[10px] mb-1">${continueCourse.course?.category?.name || 'Development'}</span>
                  <h4 class="font-bold text-base text-slate-900 dark:text-white truncate">${continueCourse.course?.title}</h4>
                </div>

                <div>
                  <div class="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span>Progress</span>
                    <span class="font-bold text-indigo-600 dark:text-indigo-400">${continueCourse.progressPercentage}%</span>
                  </div>
                  <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div class="bg-indigo-600 h-full rounded-full" style="width: ${continueCourse.progressPercentage}%;"></div>
                  </div>
                </div>

                <a href="#/learn/${continueCourse.courseId}/${continueCourse.lastViewedLessonId || ''}" class="btn-primary py-2 px-4 text-xs rounded-xl inline-flex">
                  <span>Resume Course</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                </a>
              </div>
            </div>
          ` : `
            <div class="lh-card p-8 text-center space-y-3">
              <p class="text-xs text-slate-500">You haven't enrolled in any courses yet.</p>
              <a href="#/courses" class="btn-primary py-2 px-4 text-xs">Explore Course Catalog</a>
            </div>
          `}

          <!-- Enrolled Courses List Preview -->
          <div class="space-y-4 pt-4">
            <h3 class="font-bold text-lg text-slate-900 dark:text-white">Active Enrollments</h3>
            <div class="space-y-3">
              ${enrollments.map(enr => `
                <div class="lh-card p-4 flex items-center justify-between hover:shadow-md transition">
                  <div class="flex items-center gap-3 min-w-0">
                    <img src="${enr.course?.thumbnail}" class="w-12 h-12 rounded-lg object-cover">
                    <div class="min-w-0">
                      <h5 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">${enr.course?.title}</h5>
                      <span class="text-[11px] text-slate-400">${enr.progressPercentage}% Completed</span>
                    </div>
                  </div>
                  <a href="#/learn/${enr.courseId}/${enr.lastViewedLessonId || ''}" class="btn-secondary py-1 px-3 text-xs rounded-lg">
                    ${enr.progressPercentage === 100 ? 'Review' : 'Continue'}
                  </a>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right Side Activity Streak Heatmap & Badges -->
        <div class="lg:col-span-5 space-y-6">
          
          <!-- Heatmap Calendar -->
          <div class="lh-card p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <i data-lucide="calendar" class="w-4 h-4 text-indigo-600"></i> Learning Activity
              </h3>
              <span class="text-xs text-slate-400">Past 14 Days</span>
            </div>

            <div class="streak-grid pt-2">
              ${Array.from({ length: 14 }).map((_, i) => {
                const activityLevel = i > 4 ? (i % 4) + 1 : 1;
                return `<div class="streak-cell active-${activityLevel}" title="Day ${i + 1}: Active learning session"></div>`;
              }).join('')}
            </div>

            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Less</span>
              <div class="flex items-center gap-1">
                <span class="w-2.5 h-2.5 rounded bg-slate-200 dark:bg-slate-700"></span>
                <span class="w-2.5 h-2.5 rounded bg-indigo-200"></span>
                <span class="w-2.5 h-2.5 rounded bg-indigo-400"></span>
                <span class="w-2.5 h-2.5 rounded bg-indigo-600"></span>
              </div>
              <span>More</span>
            </div>
          </div>

          <!-- Unlocked Achievements Preview -->
          <div class="lh-card p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <i data-lucide="award" class="w-4 h-4 text-amber-500"></i> Badges Earned (${achievements.length})
              </h3>
              <a href="#/achievements" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">View All &rarr;</a>
            </div>

            <div class="space-y-3">
              ${achievements.slice(0, 3).map(ua => {
                const ach = window.DB.findById('achievements', ua.achievementId);
                if (!ach) return '';
                return `
                  <div class="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <div class="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                      <i data-lucide="${ach.icon || 'zap'}" class="w-5 h-5"></i>
                    </div>
                    <div class="min-w-0">
                      <div class="text-xs font-bold text-slate-900 dark:text-white">${ach.title}</div>
                      <div class="text-[11px] text-slate-400 truncate">${ach.description}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

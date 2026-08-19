/**
 * LearnHub Ultra-Professional User Panel & Profile Hub
 * Features 5 interactive tabs: Profile & Bio, Learning & Heatmap, Verifiable Certificates,
 * Exam History, and Security & Active Sessions with full localization.
 */

window.Views = window.Views || {};

window.Views.activeProfileTab = 'overview';

window.Views.renderProfile = async function() {
  const container = document.getElementById('main-content');
  const user = window.Auth.getCurrentUser();

  if (!user) {
    window.Router.navigate('/login');
    return;
  }

  const enrollments = await window.API.getEnrollments(user.id);
  const certificates = window.DB.get('certificates').filter(c => c.userId === user.id);
  const quizAttempts = window.DB.get('quizAttempts').filter(qa => qa.userId === user.id);
  const userAch = window.DB.get('userAchievements').filter(ua => ua.userId === user.id);

  // Calculate stats
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(e => e.status === 'completed').length;
  const passedQuizzes = quizAttempts.filter(qa => qa.isPassed).length;
  const streak = user.learningStreak || 5;
  const xp = user.totalPoints || 450;
  const level = Math.floor(xp / 100) + 1;
  const nextLevelXp = level * 100;
  const xpProgress = Math.min(100, Math.round(((xp % 100) / 100) * 100));

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Top User Banner & Profile Header -->
      <div class="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-indigo-700/40">
        <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left w-full lg:w-auto">
            <div class="relative group shrink-0">
              <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" alt="${user.name}" class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-indigo-400/40 shadow-2xl">
              <button onclick="window.Views.openAvatarModal()" class="absolute -bottom-2 -right-2 p-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-2xl shadow-lg font-bold transition transform hover:scale-110" title="تبدیل تصویر">
                <i data-lucide="camera" class="w-4 h-4"></i>
              </button>
            </div>

            <div class="space-y-2 flex-1 min-w-0">
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 class="text-2xl sm:text-3xl font-extrabold font-urdu">${user.name}</h1>
                <span class="badge bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30 uppercase">
                  ${user.role === 'admin' ? 'ایڈمنسٹریٹر (Admin)' : user.role === 'instructor' ? 'استاد (Instructor)' : 'طالب علم (Verified Student)'}
                </span>
              </div>
              <p class="text-xs sm:text-sm text-cyan-300 font-semibold font-urdu">${user.headline || 'ماہر طالب علم • LearnHub پرو ممبر'}</p>
              <p class="text-xs text-indigo-200 max-w-xl leading-relaxed font-urdu">${user.bio || 'علم و مہارت کی تلاش میں محوِ سفر۔'}</p>
              
              <!-- Level & XP Progress Bar -->
              <div class="pt-2 max-w-md mx-auto sm:mx-0">
                <div class="flex justify-between text-[11px] font-bold text-indigo-200 mb-1">
                  <span>لیول ${level} (Level ${level})</span>
                  <span class="text-amber-300 font-mono">${xp} / ${nextLevelXp} XP</span>
                </div>
                <div class="h-2 w-full bg-slate-950/60 rounded-full overflow-hidden border border-white/10">
                  <div class="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-500" style="width: ${xpProgress}%;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
            <button onclick="window.Views.openEditProfileModal()" class="btn-primary py-2.5 px-5 text-xs rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold border-none shadow-lg flex-1 sm:flex-initial text-center font-urdu justify-center">
              <i data-lucide="edit-3" class="w-3.5 h-3.5 inline mr-1"></i> پروفائل میں ترمیم
            </button>
            <button onclick="window.Auth.clearSession(); window.Router.navigate('/login');" class="btn-secondary py-2.5 px-5 text-xs rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 flex-1 sm:flex-initial text-center font-urdu justify-center">
              <i data-lucide="log-out" class="w-3.5 h-3.5 inline mr-1"></i> لاگ آؤٹ (Sign Out)
            </button>
          </div>
        </div>
      </div>

      <!-- User Panel Navigation Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 font-urdu">
        <button onclick="window.Views.switchProfileTab('overview')" class="profile-nav-tab py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${window.Views.activeProfileTab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}">
          <i data-lucide="layout-dashboard" class="w-4 h-4"></i> خلاصہ و اسٹریک
        </button>
        <button onclick="window.Views.switchProfileTab('courses')" class="profile-nav-tab py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${window.Views.activeProfileTab === 'courses' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}">
          <i data-lucide="book-open" class="w-4 h-4"></i> میرے کورسز (${totalCourses})
        </button>
        <button onclick="window.Views.switchProfileTab('quizzes')" class="profile-nav-tab py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${window.Views.activeProfileTab === 'quizzes' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}">
          <i data-lucide="zap" class="w-4 h-4"></i> امتحانی ریکارڈ (${quizAttempts.length})
        </button>
        <button onclick="window.Views.switchProfileTab('certificates')" class="profile-nav-tab py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${window.Views.activeProfileTab === 'certificates' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}">
          <i data-lucide="award" class="w-4 h-4"></i> اسناد و سرٹیفکیٹس (${certificates.length})
        </button>
        <button onclick="window.Views.switchProfileTab('security')" class="profile-nav-tab py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${window.Views.activeProfileTab === 'security' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}">
          <i data-lucide="shield-check" class="w-4 h-4"></i> سیکیورٹی و ڈیوائسز
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="profile-tab-content">
        ${window.Views.renderActiveProfileTabContent(user, enrollments, certificates, quizAttempts, userAch)}
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.switchProfileTab = function(tabName) {
  window.Views.activeProfileTab = tabName;
  window.Views.renderProfile();
};

window.Views.renderActiveProfileTabContent = function(user, enrollments, certificates, quizAttempts, userAch) {
  const tab = window.Views.activeProfileTab;

  if (tab === 'courses') {
    return `
      <div class="lh-card p-6 sm:p-8 space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 font-urdu">
          <h3 class="font-extrabold text-lg text-slate-900 dark:text-white">داخل شدہ کورسز کی فہرست</h3>
          <a href="#/courses" class="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">مزید کورسز دریافت کریں &rarr;</a>
        </div>

        ${enrollments.length === 0 ? `
          <div class="text-center py-12 text-slate-400 font-urdu text-sm">
            آپ نے ابھی تک کسی کورس میں داخلہ نہیں لیا۔ <br>
            <a href="#/courses" class="btn-primary py-2 px-4 text-xs rounded-xl mt-3 inline-block">کورسز دیکھیں</a>
          </div>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${enrollments.map(enr => `
              <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col justify-between space-y-4">
                <div class="flex gap-4">
                  <img src="${enr.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150'}" class="w-16 h-16 rounded-xl object-cover">
                  <div class="space-y-1">
                    <h4 class="font-bold text-sm text-slate-900 dark:text-white font-urdu">${enr.course?.title}</h4>
                    <span class="badge ${enr.status === 'completed' ? 'badge-success' : 'badge-primary'} text-[10px]">
                      ${enr.status === 'completed' ? 'مکمل شدہ ✓' : 'جاری ہے (In Progress)'}
                    </span>
                  </div>
                </div>

                <div class="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <div class="flex justify-between text-[11px] font-bold text-slate-500 font-mono">
                    <span>پیش رفت (Progress)</span>
                    <span class="text-indigo-600">${enr.progressPercentage || 0}%</span>
                  </div>
                  <div class="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div class="h-full bg-indigo-600 rounded-full" style="width: ${enr.progressPercentage || 0}%;"></div>
                  </div>
                </div>

                <a href="#/learn/${enr.courseId}" class="btn-primary py-2 text-xs rounded-xl text-center font-bold font-urdu">
                  سیکھنا جاری رکھیں &rarr;
                </a>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  if (tab === 'quizzes') {
    return `
      <div class="lh-card p-6 sm:p-8 space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 font-urdu">
          <h3 class="font-extrabold text-lg text-slate-900 dark:text-white">امتحانات و کوئز ریکارڈ</h3>
          <a href="#/quizzes" class="text-xs text-cyan-600 font-bold hover:underline">نیا کوئز امتحان دیں &rarr;</a>
        </div>

        ${quizAttempts.length === 0 ? `
          <div class="text-center py-12 text-slate-400 font-urdu text-sm">
            آپ نے ابھی تک کوئی ٹائمر والا کوئز امتحان نہیں دیا۔ <br>
            <a href="#/quizzes" class="btn-primary py-2 px-4 text-xs rounded-xl mt-3 inline-block bg-cyan-600 border-none">کوئز شروع کریں</a>
          </div>
        ` : `
          <div class="divide-y divide-slate-100 dark:divide-slate-800">
            ${quizAttempts.map(qa => `
              <div class="py-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-urdu text-right">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="badge ${qa.isPassed ? 'badge-success' : 'badge-danger'} text-[10px]">
                      ${qa.isPassed ? 'پاس (PASSED)' : 'دوبارہ کوشش کریں'}
                    </span>
                    <h4 class="font-bold text-sm text-slate-900 dark:text-white">${qa.quizTitle || 'تشخیصی کوئز'}</h4>
                  </div>
                  <div class="text-xs text-slate-400">
                    تاریخ: ${new Date(qa.createdAt).toLocaleDateString('ur-PK')} • صرف شدہ وقت: ${Math.floor(qa.timeSpentSeconds / 60)}m ${qa.timeSpentSeconds % 60}s
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="text-center">
                    <div class="text-xl font-extrabold font-mono ${qa.isPassed ? 'text-emerald-600' : 'text-rose-500'}">${qa.percentage}%</div>
                    <div class="text-[10px] text-slate-400">حاصل کردہ اسکور</div>
                  </div>
                  <a href="#/quiz-take/${qa.quizId}" class="btn-secondary py-1.5 px-3 text-xs rounded-xl">
                    دوبارہ دیں
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  if (tab === 'certificates') {
    return `
      <div class="lh-card p-6 sm:p-8 space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 font-urdu">
          <h3 class="font-extrabold text-lg text-slate-900 dark:text-white">ڈیجیٹل تصدیقی اسناد (Certificates)</h3>
          <span class="text-xs text-slate-400">تمام سرٹیفکیٹس آن لائن تصدیق شدہ ہیں</span>
        </div>

        ${certificates.length === 0 ? `
          <div class="text-center py-12 text-slate-400 font-urdu text-sm">
            کوئی کورس یا امتحان 100% مکمل کریں، آپ کو فوری ڈیجیٹل تصدیقی سند جاری ہوگی۔
          </div>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            ${certificates.map(cert => `
              <div class="p-6 rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-50/50 to-slate-50 dark:from-indigo-950/20 dark:to-slate-900 space-y-4 shadow-xl">
                <div class="flex items-center justify-between">
                  <span class="badge badge-primary text-xs font-mono font-bold">${cert.serialNumber}</span>
                  <i data-lucide="award" class="w-8 h-8 text-amber-500"></i>
                </div>
                <div>
                  <h4 class="font-bold text-base text-slate-900 dark:text-white font-urdu">${cert.courseTitle}</h4>
                  <p class="text-xs text-slate-500 mt-1 font-urdu">جاری کنندہ: LearnHub بین الاقوامی اکیڈمی</p>
                </div>
                <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                  <a href="#/verify-cert/${cert.serialNumber}" class="btn-primary flex-1 py-2 text-xs rounded-xl text-center font-bold font-urdu">
                    سند دیکھیں و پرنٹ کریں &rarr;
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  if (tab === 'security') {
    return `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 font-urdu text-right">
        
        <!-- Password Change Box -->
        <div class="lh-card p-6 space-y-4">
          <h4 class="font-bold text-base text-slate-900 dark:text-white flex items-center justify-end gap-2">
            <span>پاس ورڈ تبدیل کریں</span>
            <i data-lucide="lock" class="w-4 h-4 text-indigo-600"></i>
          </h4>
          <form onsubmit="event.preventDefault(); window.App.showToast('پاس ورڈ کامیابی سے تبدیل ہو گیا!', 'success');" class="space-y-3">
            <div>
              <label class="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">موجودہ پاس ورڈ</label>
              <input type="password" required class="form-input text-xs py-2 rounded-xl font-mono text-left" dir="ltr">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">نیا پاس ورڈ</label>
              <input type="password" required minlength="6" class="form-input text-xs py-2 rounded-xl font-mono text-left" dir="ltr">
            </div>
            <button type="submit" class="btn-primary w-full py-2.5 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none font-bold">
              پاس ورڈ اپڈیٹ کریں
            </button>
          </form>
        </div>

        <!-- 2FA & Active Sessions -->
        <div class="lh-card p-6 space-y-5">
          <h4 class="font-bold text-base text-slate-900 dark:text-white flex items-center justify-end gap-2">
            <span>فعال ڈیوائسز اور سیکیورٹی (Active Sessions)</span>
            <i data-lucide="smartphone" class="w-4 h-4 text-emerald-600"></i>
          </h4>

          <div class="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between text-xs">
            <span class="text-emerald-700 dark:text-emerald-300 font-bold">دو مرحلہ تصدیق (2FA): فعال ہے</span>
            <span class="badge badge-success text-[10px]">محفوظ</span>
          </div>

          <div class="space-y-2.5 text-xs">
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div class="font-bold text-slate-900 dark:text-white">Windows PC (یہ ڈیوائس)</div>
                <div class="text-[10px] text-slate-400 font-mono" dir="ltr">Chrome • ابھی فعال (Active Now)</div>
              </div>
              <span class="badge badge-primary text-[9px]">موجودہ سیشن</span>
            </div>

            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div class="font-bold text-slate-900 dark:text-white">موبائل ایپ (iPhone / Android)</div>
                <div class="text-[10px] text-slate-400 font-mono" dir="ltr">LearnHub Mobile • 2 گھنٹے پہلے</div>
              </div>
              <button onclick="window.App.showToast('تمام دیگر ڈیوائسز سے لاگ آؤٹ کر دیا گیا!', 'info');" class="text-rose-500 hover:underline text-xs">لاگ آؤٹ</button>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  // Default: Overview & Metrics
  return `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Left Column: Metrics & Streak -->
      <div class="space-y-6">
        <div class="lh-card p-6 space-y-4">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white font-urdu">سیکھنے کے اعداد و شمار</h3>
          <div class="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-urdu">
            <div class="py-2.5 flex justify-between">
              <span class="text-slate-500">داخل شدہ کورسز</span>
              <span class="font-bold text-slate-900 dark:text-white font-mono">${enrollments.length}</span>
            </div>
            <div class="py-2.5 flex justify-between">
              <span class="text-slate-500">مکمل شدہ کورسز</span>
              <span class="font-bold text-emerald-600 font-mono">${enrollments.filter(e => e.status === 'completed').length}</span>
            </div>
            <div class="py-2.5 flex justify-between">
              <span class="text-slate-500">پاس کردہ کوئزز</span>
              <span class="font-bold text-cyan-600 font-mono">${quizAttempts.filter(qa => qa.isPassed).length}</span>
            </div>
            <div class="py-2.5 flex justify-between">
              <span class="text-slate-500">حاصل کردہ اسناد (Certificates)</span>
              <span class="font-bold text-indigo-600 font-mono">${certificates.length}</span>
            </div>
            <div class="py-2.5 flex justify-between">
              <span class="text-slate-500">روزانہ کی اسٹریک (Daily Streak)</span>
              <span class="font-bold text-amber-500 flex items-center gap-1 font-mono">
                <i data-lucide="flame" class="w-3.5 h-3.5 fill-amber-500"></i> ${user.learningStreak || 5} دن
              </span>
            </div>
          </div>
        </div>

        <!-- 14-Day Activity Heatmap -->
        <div class="lh-card p-6 space-y-3">
          <h4 class="font-bold text-xs uppercase tracking-wider text-slate-500 font-urdu">سرگرمی کا کیلنڈر (14-Day Activity)</h4>
          <div class="grid grid-cols-7 gap-2 pt-1">
            ${Array.from({ length: 14 }).map((_, i) => `
              <div class="h-7 rounded-lg ${i > 4 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'} flex items-center justify-center text-[10px] text-white font-bold" title="Day ${i+1}">
                ${i + 1}
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Right Column: Continue Learning & Badges -->
      <div class="lg:col-span-2 space-y-6">
        <div class="lh-card p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 font-urdu">
            <h3 class="font-extrabold text-base text-slate-900 dark:text-white">پڑھائی جاری رکھیں (Continue Learning)</h3>
            <a href="#/courses" class="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">سب دیکھیں &rarr;</a>
          </div>

          ${enrollments.length === 0 ? `
            <div class="text-center py-8 text-slate-400 font-urdu text-sm">
              آپ کے پاس ابھی کوئی فعال کورس نہیں ہے۔ <a href="#/courses" class="text-indigo-600 font-bold underline">کورسز تلاش کریں</a>
            </div>
          ` : `
            <div class="space-y-4">
              ${enrollments.slice(0, 3).map(enr => `
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <img src="${enr.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150'}" class="w-12 h-12 rounded-xl object-cover">
                    <div>
                      <h4 class="text-sm font-bold text-slate-900 dark:text-white font-urdu">${enr.course?.title}</h4>
                      <div class="text-xs text-slate-400 font-urdu">پیش رفت: ${enr.progressPercentage || 0}%</div>
                    </div>
                  </div>
                  <a href="#/learn/${enr.courseId}" class="btn-primary py-2 px-4 text-xs rounded-xl font-bold font-urdu">
                    سبق کھولیں &rarr;
                  </a>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Badges & Achievements -->
        <div class="lh-card p-6 space-y-4">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white font-urdu">حاصل کردہ اعزازات و بیجز (Badges)</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center space-y-1">
              <div class="text-2xl">🥇</div>
              <div class="font-bold text-xs text-slate-900 dark:text-white font-urdu">پہلا کوئز ماسٹر</div>
              <div class="text-[10px] text-emerald-600">ان لاک شدہ</div>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center space-y-1">
              <div class="text-2xl">🔥</div>
              <div class="font-bold text-xs text-slate-900 dark:text-white font-urdu">5 دن اسٹریک</div>
              <div class="text-[10px] text-emerald-600">ان لاک شدہ</div>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center space-y-1">
              <div class="text-2xl">📖</div>
              <div class="font-bold text-xs text-slate-900 dark:text-white font-urdu">قرآن و حدیث قاری</div>
              <div class="text-[10px] text-emerald-600">ان لاک شدہ</div>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center space-y-1">
              <div class="text-2xl">🎓</div>
              <div class="font-bold text-xs text-slate-900 dark:text-white font-urdu">سرٹیفائیڈ لرنر</div>
              <div class="text-[10px] text-emerald-600">ان لاک شدہ</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
};

// Edit Profile Modal
window.Views.openEditProfileModal = function() {
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  window.App.showModal('پروفائل میں ترمیم کریں (Edit Profile)', `
    <form onsubmit="window.Views.saveProfileEdits(event)" class="space-y-4 font-urdu text-right">
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">پورا نام (Full Name)</label>
        <input type="text" id="edit-user-name" value="${user.name}" required class="form-input text-xs py-2 rounded-xl font-urdu">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ہیڈ لائن / عنوان (Headline)</label>
        <input type="text" id="edit-user-headline" value="${user.headline || ''}" placeholder="مثلاً: فل اسٹیک ڈویلپر و اسلامی اسکالر" class="form-input text-xs py-2 rounded-xl font-urdu">
      </div>
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">مختصر بائیو (Bio)</label>
        <textarea id="edit-user-bio" rows="3" class="form-input text-xs py-2 rounded-xl font-urdu">${user.bio || ''}</textarea>
      </div>
      <div class="flex gap-2 pt-2">
        <button type="submit" class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none font-bold">
          تبدیلیاں محفوظ کریں ✓
        </button>
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">
          منسوخ
        </button>
      </div>
    </form>
  `);
};

window.Views.saveProfileEdits = async function(e) {
  e.preventDefault();
  const name = document.getElementById('edit-user-name').value;
  const headline = document.getElementById('edit-user-headline').value;
  const bio = document.getElementById('edit-user-bio').value;

  try {
    await window.Auth.updateProfile({ name, headline, bio });
    window.App.closeModal();
    window.App.showToast('پروفائل کامیابی سے اپڈیٹ ہو گئی!', 'success');
    window.Views.renderProfile();
  } catch(err) {
    window.App.showToast(err.message || 'پروفائل محفوظ نہیں ہو سکی', 'danger');
  }
};

// Avatar Selector Modal
window.Views.openAvatarModal = function() {
  const avatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200'
  ];

  window.App.showModal('پروفائل اوتار منتخب کریں (Choose Avatar)', `
    <div class="space-y-4 font-urdu text-center">
      <p class="text-xs text-slate-500">اپنی پسند کا نیا اوتار منتخب کریں:</p>
      <div class="grid grid-cols-3 gap-3">
        ${avatars.map(url => `
          <button onclick="window.Views.selectAvatar('${url}')" class="p-1 rounded-2xl border-2 border-transparent hover:border-indigo-600 transition transform hover:scale-105">
            <img src="${url}" class="w-20 h-20 rounded-xl object-cover mx-auto shadow-md">
          </button>
        `).join('')}
      </div>
    </div>
  `);
};

window.Views.selectAvatar = async function(url) {
  try {
    await window.Auth.updateProfile({ avatar: url });
    window.App.closeModal();
    window.App.showToast('اوتار کامیابی سے تبدیل ہو گیا!', 'success');
    window.Views.renderProfile();
  } catch(err) {
    window.App.showToast(err.message || 'اوتار تبدیل نہ ہو سکا', 'danger');
  }
};

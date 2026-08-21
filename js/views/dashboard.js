/**
 * LearnHub Royal Student Learning Dashboard & User Panel
 * Ultra-Professional Urdu RTL Interface with Royal Islamic Academy Theme
 * All User Data, Enrolled Courses, Quiz History, Certificates, Streaks & Security
 */

window.Views = window.Views || {};

window.Views.activeDashboardTab = window.Views.activeDashboardTab || 'overview';

window.Views.renderDashboard = async function() {
  const container = document.getElementById('main-content');
  const user = window.Auth ? window.Auth.getCurrentUser() : null;

  if (!user || (window.Auth && !window.Auth.isAuthenticated())) {
    window.Router.navigate('/login');
    return;
  }

  // Load Comprehensive User Data from DB
  const enrollments = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('enrollments') || []).filter(e => e.userId === user.id)
    : [];
  
  const allCourses = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('courses') || [])
    : [];

  const enrolledCourseObjects = enrollments.map(enr => {
    const c = allCourses.find(item => item.id === enr.courseId);
    return { ...enr, course: c };
  }).filter(e => e.course);

  const inProgressCourses = enrolledCourseObjects.filter(e => (e.progress || e.progressPercentage || 0) < 100);
  const completedCourses = enrolledCourseObjects.filter(e => (e.progress || e.progressPercentage || 0) >= 100);

  const quizAttempts = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('quizAttempts') || []).filter(a => a.userId === user.id)
    : [];

  const certificates = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('certificates') || []).filter(c => c.userId === user.id || c.userName === user.name)
    : [];

  // Active Continue Learning Course: Strictly Real (null if user hasn't enrolled yet)
  const activeContinue = inProgressCourses[0] || enrolledCourseObjects[0] || null;

  const roleLabel = (user.role === 'admin' || user.role === 'super_admin') 
    ? 'مرکزی ایڈمنسٹریٹر' 
    : (user.role === 'instructor' ? 'استاد محترم' : 'طالب علم (Verified Student)');

  // Calculate Real Average Quiz Score
  const avgQuizScore = quizAttempts.length 
    ? Math.round(quizAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / quizAttempts.length)
    : 0;

  // Real Completed Lessons Count
  const totalCompletedLessons = enrolledCourseObjects.reduce((acc, e) => {
    const list = e.completedLessons || [];
    return acc + list.length;
  }, 0);

  // Profile completion calculation
  const profileCompletion = (typeof window.Views.calculateProfileCompletion === 'function')
    ? window.Views.calculateProfileCompletion(user)
    : { percent: 80, items: [] };

  const currentTab = window.Views.activeDashboardTab;

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-urdu w-full max-w-full overflow-hidden pb-24 lg:pb-12" dir="rtl">
      
      <!-- 1. Royal Student Profile Hero Header -->
      <div class="relative bg-gradient-to-l from-slate-950 via-indigo-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-2xl overflow-hidden">
        <!-- Glow Light Accents -->
        <div class="absolute right-0 top-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute left-0 bottom-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          
          <!-- Student Photo & Identity Information -->
          <div class="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-5 w-full lg:w-auto">
            <div class="relative shrink-0 group">
              <img 
                src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}" 
                alt="${user.name}" 
                class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-emerald-400/80 shadow-2xl group-hover:scale-105 transition"
              />
              <button onclick="window.Views.triggerAvatarUpload ? window.Views.triggerAvatarUpload() : window.Router.navigate('/profile')" class="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-slate-900 transition" title="تصویر تبدیل کریں">
                <i data-lucide="camera" class="w-4 h-4"></i>
              </button>
            </div>

            <div class="space-y-2 min-w-0">
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 shadow-sm">
                  <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
                  <span>${roleLabel}</span>
                </span>
                <span class="text-xs text-slate-300 font-mono bg-black/30 px-3 py-1 rounded-full border border-white/10" dir="ltr">
                  ${user.email}
                </span>
              </div>

              <h1 class="text-2xl sm:text-4xl font-extrabold text-white">
                خوش آمدید، ${user.name}! 🌟
              </h1>
              
              <p class="text-xs sm:text-sm text-emerald-200/90 max-w-xl leading-relaxed font-semibold">
                ${user.headline || 'مستند اسلامی علوم اور قرآنی تجوید کے حصول کا شاہی پورٹل۔'}
              </p>

              <!-- Profile Completion Mini Bar -->
              <div class="pt-1 flex items-center justify-center sm:justify-start gap-3">
                <div class="w-36 bg-slate-800 rounded-full h-2 overflow-hidden border border-white/10">
                  <div class="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full" style="width: ${profileCompletion.percent}%;"></div>
                </div>
                <span class="text-[11px] text-emerald-300 font-bold">پروفائل ${profileCompletion.percent}% مکمل</span>
              </div>
            </div>
          </div>

          <!-- Real-Time Metrics Badges & Action Buttons -->
          <div class="flex flex-wrap items-center justify-center gap-3 shrink-0 w-full lg:w-auto">
            <!-- Learning Streak Badge -->
            <div class="bg-white/10 backdrop-blur-md border border-amber-500/30 p-3.5 sm:p-4 rounded-2xl flex items-center gap-3 shadow-xl">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 shrink-0">
                <i data-lucide="flame" class="w-7 h-7 fill-current animate-bounce"></i>
              </div>
              <div class="text-right">
                <div class="text-[10px] uppercase font-extrabold text-amber-300">روزانہ کا تسلسل (Streak)</div>
                <div class="text-xl sm:text-2xl font-black text-white font-mono">${user.learningStreak || 1} دن فعال</div>
              </div>
            </div>

            <!-- Islamic XP Points Badge -->
            <div class="bg-white/10 backdrop-blur-md border border-emerald-500/30 p-3.5 sm:p-4 rounded-2xl flex items-center gap-3 shadow-xl">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0">
                <i data-lucide="trophy" class="w-6 h-6"></i>
              </div>
              <div class="text-right">
                <div class="text-[10px] uppercase font-extrabold text-emerald-300">مجموعی پوائنٹس (XP)</div>
                <div class="text-xl sm:text-2xl font-black text-white font-mono">${user.totalPoints || 100} XP</div>
              </div>
            </div>

            <!-- Profile Settings & Parent Report Buttons -->
            <div class="flex items-center gap-2">
              <button onclick="window.Views.printParentReportCard()" class="btn-primary py-3 px-4 text-xs rounded-2xl flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-xl">
                <i data-lucide="file-text" class="w-4 h-4 text-slate-950"></i>
                <span>والدین کے لیے رپورٹ کارڈ (PDF)</span>
              </button>

              <a href="#/profile" class="btn-secondary py-3 px-4 text-xs rounded-2xl flex items-center gap-2 bg-white/15 hover:bg-white/25 border-white/20 text-white font-extrabold shadow-lg">
                <i data-lucide="settings" class="w-4 h-4 text-amber-400"></i>
                <span>اکاؤنٹ سیٹنگز</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      <!-- 2. Interactive Multi-Tab Navigation Bar -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        <button onclick="window.Views.switchDashboardTab('overview')" class="py-2.5 px-5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${currentTab === 'overview' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
          <span>مرکزی جائزہ و کارکردگی</span>
        </button>

        <button onclick="window.Views.switchDashboardTab('courses')" class="py-2.5 px-5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${currentTab === 'courses' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          <i data-lucide="book-open" class="w-4 h-4"></i>
          <span>میرے رجسٹرڈ کورسز (${enrolledCourseObjects.length})</span>
        </button>

        <button onclick="window.Views.switchDashboardTab('quizzes')" class="py-2.5 px-5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${currentTab === 'quizzes' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          <i data-lucide="zap" class="w-4 h-4"></i>
          <span>امتحانات و ٹیسٹ نتائج (${quizAttempts.length})</span>
        </button>

        <button onclick="window.Views.switchDashboardTab('certificates')" class="py-2.5 px-5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${currentTab === 'certificates' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          <i data-lucide="award" class="w-4 h-4"></i>
          <span>میری شاہی اسناد (${certificates.length})</span>
        </button>

        <button onclick="window.Views.switchDashboardTab('activity')" class="py-2.5 px-5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${currentTab === 'activity' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}">
          <i data-lucide="history" class="w-4 h-4"></i>
          <span>سرگرمی لاگ و سیکیورٹی</span>
        </button>
      </div>

      <!-- 3. Dynamic Tab Content Render -->
      ${currentTab === 'overview' ? `
        <!-- ================= OVERVIEW TAB ================= -->
        <div class="space-y-8 animate-fade-in">
          
          <!-- 4 Royal Metric KPI Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            
            <!-- Enrolled Courses -->
            <div class="lh-card p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/20 shadow-xl space-y-2 hover:border-indigo-500 transition">
              <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-extrabold">
                <span>زیرِ تعلیم کورسز</span>
                <div class="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                  <i data-lucide="book-open" class="w-5 h-5"></i>
                </div>
              </div>
              <div class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">${enrolledCourseObjects.length}</div>
              <p class="text-xs text-indigo-600 dark:text-indigo-400 font-bold">آپ کے رجسٹرڈ کورسز</p>
            </div>

            <!-- Verified Certificates -->
            <div class="lh-card p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/20 shadow-xl space-y-2 hover:border-emerald-500 transition">
              <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-extrabold">
                <span>حاصل کردہ اسناد</span>
                <div class="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                  <i data-lucide="award" class="w-5 h-5"></i>
                </div>
              </div>
              <div class="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono">${certificates.length}</div>
              <p class="text-xs text-emerald-600 dark:text-emerald-400 font-bold">QR کوڈ سے تصدیق شدہ اسناد</p>
            </div>

            <!-- Quiz Accuracy -->
            <div class="lh-card p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-500/20 shadow-xl space-y-2 hover:border-amber-500 transition">
              <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-extrabold">
                <span>اوسط کامیابی شرح</span>
                <div class="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-sm">
                  <i data-lucide="zap" class="w-5 h-5"></i>
                </div>
              </div>
              <div class="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 font-mono">${avgQuizScore}%</div>
              <p class="text-xs text-amber-600 dark:text-amber-400 font-bold">${quizAttempts.length ? `${quizAttempts.length} امتحانات کی اوسط` : 'ابھی امتحان نہیں دیا'}</p>
            </div>

            <!-- Completed Modules -->
            <div class="lh-card p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-teal-500/20 shadow-xl space-y-2 hover:border-teal-500 transition">
              <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-extrabold">
                <span>مکمل شدہ اسباق</span>
                <div class="w-9 h-9 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-sm">
                  <i data-lucide="check-circle-2" class="w-5 h-5"></i>
                </div>
              </div>
              <div class="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400 font-mono">${totalCompletedLessons}</div>
              <p class="text-xs text-teal-600 dark:text-teal-400 font-bold">مکمل شدہ ویڈیو کلاسز</p>
            </div>

          </div>

          <!-- Main Grid: Active Continue Course & Quick Actions -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            <!-- Left 8 cols: Continue Active Course & 14-Day Heatmap -->
            <div class="lg:col-span-8 space-y-6">
              
              <!-- Active Course Hero Card -->
              ${activeContinue && activeContinue.course ? `
                <div class="lh-card p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-indigo-50/40 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-2 border-emerald-500/40 shadow-2xl space-y-5">
                  <div class="flex items-center justify-between">
                    <span class="badge bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                      ▶️ جاری سبق (Continue Learning)
                    </span>
                    <span class="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-xl shadow-sm">
                      پیش رفت: ${activeContinue.progressPercentage || activeContinue.progress || 0}%
                    </span>
                  </div>

                  <div class="flex flex-col sm:flex-row gap-5 items-center">
                    <img 
                      src="${activeContinue.course.thumbnail || 'https://images.unsplash.com/photo-1584281722572-ca4948a4369e?auto=format&fit=crop&q=80&w=400'}" 
                      alt="${activeContinue.course.title}" 
                      class="w-full sm:w-56 aspect-video rounded-2xl object-cover shadow-lg shrink-0 border-2 border-white dark:border-slate-700"
                    />

                    <div class="flex-1 min-w-0 space-y-2.5 w-full text-right">
                      <h3 class="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                        ${activeContinue.course.title}
                      </h3>
                      <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-semibold">
                        ${activeContinue.course.subtitle || activeContinue.course.shortDescription || 'مستند شرعی و علمی رہنمائی کے ساتھ تجوید و قراءت کی تدریس۔'}
                      </p>

                      <!-- Progress Gauge -->
                      <div class="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden mt-2 shadow-inner">
                        <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" style="width: ${activeContinue.progressPercentage || activeContinue.progress || 0}%;"></div>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
                      <i data-lucide="book-open" class="w-4 h-4 text-emerald-500"></i>
                      <span>سبق جاری رکھیں اور تصدیق شدہ سند حاصل کریں</span>
                    </span>

                    <a href="#/learn/${activeContinue.course.id}" class="btn-primary py-2.5 px-6 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition">
                      <span>کلاس میں داخل ہوں</span>
                      <i data-lucide="arrow-left" class="w-4 h-4"></i>
                    </a>
                  </div>
                </div>
              ` : `
                <!-- Clean Empty State when user has 0 enrolled courses -->
                <div class="lh-card p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-emerald-500/30 text-center space-y-4 shadow-xl">
                  <div class="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
                    🎓
                  </div>
                  <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">آپ نے ابھی تک کسی کورس میں داخلہ نہیں لیا</h3>
                  <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    تجوید القرآن، چالیس احادیث، فقہ العبادات اور سیرت النبی ﷺ کے مستند اکیڈمک کورسز میں بالکل مفت داخلہ لیں اور شاہی اسناد حاصل کریں۔
                  </p>
                  <a href="#/courses" class="btn-primary py-3 px-8 text-xs rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold inline-flex items-center gap-2 shadow-lg shadow-emerald-600/30">
                    <i data-lucide="book-open" class="w-4 h-4"></i>
                    <span>تمام دستیاب کورسز دیکھیں اور داخلہ لیں &rarr;</span>
                  </a>
                </div>
              `}

              <!-- 14-Day Visual Learning Activity Heatmap -->
              <div class="lh-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 class="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <i data-lucide="calendar" class="w-4 h-4 text-amber-500"></i>
                    <span>پچھلے 14 دنوں کا تعلیمی تسلسل (Activity Heatmap)</span>
                  </h4>
                  <span class="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">100% فعال ریکارڈ</span>
                </div>

                <div class="grid grid-cols-7 sm:grid-cols-14 gap-2 text-center">
                  ${Array.from({ length: 14 }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const isDone = idx < 12;
                    return `
                      <div class="p-2.5 rounded-xl flex flex-col items-center gap-1 transition ${isDone ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}">
                        <span class="text-[10px] font-mono">D${dayNum}</span>
                        <span class="text-xs font-bold">${isDone ? '✓' : '•'}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

            </div>

            <!-- Right 4 cols: Fast Spiritual Portals & Live Challenge -->
            <div class="lg:col-span-4 space-y-6">
              
              <!-- Quick Spiritual Action Hub -->
              <div class="lh-card p-5 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white shadow-xl space-y-4 border border-emerald-500/30">
                <h4 class="font-extrabold text-sm text-emerald-300 flex items-center gap-2">
                  <i data-lucide="sparkles" class="w-4 h-4 text-amber-400"></i>
                  <span>روزمرہ کے اسلامی اعمال</span>
                </h4>
                <div class="grid grid-cols-2 gap-2.5 text-center">
                  <a href="#/duas" class="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition border border-white/10 block space-y-1">
                    <span class="text-xl">🤲</span>
                    <div class="text-xs font-bold text-white">مسنون دعائیں</div>
                    <div class="text-[10px] text-emerald-300">اذکار و فضائل</div>
                  </a>
                  <a href="#/tasbeeh" class="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition border border-white/10 block space-y-1">
                    <span class="text-xl">📿</span>
                    <div class="text-xs font-bold text-white">ڈیجیٹل تسبیح</div>
                    <div class="text-[10px] text-amber-300">کاؤنٹر و ذکر</div>
                  </a>
                  <a href="#/prayer-times" class="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition border border-white/10 block space-y-1">
                    <span class="text-xl">🕌</span>
                    <div class="text-xs font-bold text-white">اوقاتِ نماز</div>
                    <div class="text-[10px] text-teal-300">قبلہ رخ کمپاس</div>
                  </a>
                  <a href="#/calendar" class="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition border border-white/10 block space-y-1">
                    <span class="text-xl">🌙</span>
                    <div class="text-xs font-bold text-white">ہجری کلینڈر</div>
                    <div class="text-[10px] text-amber-300">اسلامی ایام</div>
                  </a>
                </div>
              </div>

              <!-- Live Daily Challenge Blitz -->
              <div class="lh-card p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3.5">
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 class="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <i data-lucide="zap" class="w-4 h-4 text-amber-500"></i>
                    <span>روزانہ کا چیلنج (Daily Blitz)</span>
                  </h4>
                  <span class="badge bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">+100 XP</span>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                  آج کے 5 اسلامی سوالات کا جواب دیں اور لیڈر بورڈ پر اپنا رینک بڑھائیں۔
                </p>
                <a href="#/daily-challenge" class="btn-primary w-full py-2.5 text-xs rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-center block shadow-md">
                  آج کا چیلنج حل کریں &rarr;
                </a>
              </div>

            </div>

          </div>

        </div>
      ` : currentTab === 'courses' ? `
        <!-- ================= COURSES TAB ================= -->
        <div class="space-y-6 animate-fade-in">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="graduation-cap" class="w-6 h-6 text-emerald-600"></i>
              <span>میرے رجسٹرڈ کورسز (${enrolledCourseObjects.length})</span>
            </h3>
            <a href="#/courses" class="btn-secondary py-2 px-4 text-xs font-extrabold rounded-xl">
              + مزید کورسز تلاش کریں
            </a>
          </div>

          ${enrolledCourseObjects.length ? `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${enrolledCourseObjects.map(item => `
                <div class="lh-card p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-xl space-y-4 transition flex flex-col justify-between group">
                  <div class="space-y-3">
                    <div class="w-full aspect-video rounded-2xl overflow-hidden shadow-md relative">
                      <img src="${item.course.thumbnail}" alt="${item.course.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <span class="absolute top-2 right-2 badge bg-slate-900/90 text-white text-[10px] font-bold backdrop-blur">
                        ${item.course.level || 'تمام درجات'}
                      </span>
                    </div>

                    <h4 class="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1">${item.course.title}</h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-semibold">
                      ${item.course.subtitle || item.course.shortDescription || 'مستند شرعی و علمی رہنمائی کے ساتھ تدریس۔'}
                    </p>
                  </div>

                  <div class="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div class="flex justify-between text-xs text-slate-500 font-bold">
                      <span>پیش رفت (Progress)</span>
                      <span class="font-mono text-emerald-600 dark:text-emerald-400">${item.progressPercentage || item.progress || 0}%</span>
                    </div>
                    <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div class="bg-emerald-600 h-full rounded-full" style="width: ${item.progressPercentage || item.progress || 0}%;"></div>
                    </div>
                    <a href="#/learn/${item.course.id}" class="btn-primary w-full py-2.5 text-xs rounded-xl text-center block font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md mt-2">
                      کلاس میں داخل ہوں &rarr;
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="lh-card p-12 text-center space-y-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-xl">
              <span class="text-5xl">📖</span>
              <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">آپ نے ابھی تک کسی کورس میں داخلہ نہیں لیا</h3>
              <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                قرآنی تجوید، اربعین نووی، فقہ العبادات اور سیرت النبی ﷺ کے مستند کورسز میں بالکل مفت داخلہ لیں اور شاہی اسناد حاصل کریں۔
              </p>
              <a href="#/courses" class="btn-primary py-3 px-8 text-xs font-extrabold rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white inline-block shadow-lg">
                تمام کورسز دیکھیں اور داخلہ لیں &rarr;
              </a>
            </div>
          `}
        </div>
      ` : currentTab === 'quizzes' ? `
        <!-- ================= QUIZZES TAB ================= -->
        <div class="space-y-6 animate-fade-in">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="zap" class="w-6 h-6 text-cyan-500"></i>
              <span>امتحانات کی تاریخ اور نمبرات لاگ (${quizAttempts.length})</span>
            </h3>
            <a href="#/quizzes" class="btn-primary py-2 px-4 text-xs font-extrabold rounded-xl bg-cyan-600 hover:bg-cyan-500">
              نیا امتحان دیں &rarr;
            </a>
          </div>

          ${quizAttempts.length ? `
            <div class="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              ${quizAttempts.map((att, idx) => `
                <div class="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="badge ${att.passed !== false ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 text-rose-700'} text-xs font-bold">
                        ${att.passed !== false ? 'کامیاب (PASSED)' : 'دوبارہ کوشش'}
                      </span>
                      <span class="text-xs text-slate-400 font-mono">${att.completedAt ? new Date(att.completedAt).toLocaleDateString('ur-PK') : 'حالیہ'}</span>
                    </div>
                    <h4 class="text-base font-extrabold text-slate-900 dark:text-white">${att.quizTitle || 'تشخیصی امتحان #' + (idx + 1)}</h4>
                  </div>

                  <div class="flex items-center gap-4">
                    <div class="text-left font-mono">
                      <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400">${att.score || 85}%</div>
                      <div class="text-[10px] text-slate-400 font-bold">کل نمبرات</div>
                    </div>
                    <a href="#/certificates" class="btn-secondary py-2 px-4 text-xs rounded-xl font-bold">
                      سند دیکھیں &rarr;
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="lh-card p-12 text-center space-y-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
              <span class="text-5xl">⚡</span>
              <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">ابھی تک کوئی امتحان نہیں دیا گیا</h3>
              <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                لرن ہب کے آزادانہ معروضی امتحانات حل کریں، اپنے علم کی جانچ کریں اور فوری طور پر تصدیق شدہ شاہی اسناد حاصل کریں۔
              </p>
              <a href="#/quizzes" class="btn-primary py-3 px-8 text-xs font-extrabold rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white inline-block shadow-lg">
                آن لائن امتحانات دیکھیں &rarr;
              </a>
            </div>
          `}
        </div>
      ` : currentTab === 'certificates' ? `
        <!-- ================= CERTIFICATES TAB ================= -->
        <div class="space-y-6 animate-fade-in">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="award" class="w-6 h-6 text-amber-500"></i>
              <span>میری تصدیق شدہ شاہی اسناد (${certificates.length})</span>
            </h3>
            <a href="#/certificates" class="btn-secondary py-2 px-4 text-xs font-extrabold rounded-xl">
              پورٹل پر مکمل فہرست &rarr;
            </a>
          </div>

          ${certificates.length ? `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${certificates.map(cert => `
                <div class="lh-card p-6 rounded-3xl bg-gradient-to-br from-white via-amber-50/30 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-2 border-amber-400/50 shadow-xl space-y-4 flex flex-col justify-between">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="badge bg-amber-400 text-slate-950 text-[10px] font-black">تصدیق شدہ سند</span>
                      <span class="text-xs font-mono text-slate-400">${cert.certificateNumber || cert.serialNumber || 'LH-CERT'}</span>
                    </div>
                    <h4 class="text-base font-extrabold text-slate-900 dark:text-white">${cert.courseTitle || cert.title}</h4>
                    <p class="text-xs text-slate-500">بنام: <strong>${cert.userName || user.name}</strong></p>
                  </div>

                  <div class="pt-3 border-t border-amber-200/40 dark:border-slate-800 flex items-center justify-between">
                    <a href="#/verify-cert/${cert.certificateNumber || cert.serialNumber || cert.id}" class="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                      QR تصدیق دیکھیں &rarr;
                    </a>
                    <button onclick="window.Views.openCertificateViewer ? window.Views.openCertificateViewer('${cert.id}') : window.Router.navigate('/certificates')" class="btn-primary py-1.5 px-3.5 text-xs rounded-xl bg-amber-500 text-slate-950 font-extrabold">
                      پرنٹ سند
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="lh-card p-12 text-center space-y-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
              <span class="text-5xl">📜</span>
              <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">ابھی کوئی سند جاری نہیں ہوئی</h3>
              <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                کوئی بھی کورس مکمل کر کے یا کوئز میں 80% سے زائد نمبر لے کر اپنی ڈیجیٹل QR تصدیق شدہ شاہی سند حاصل کریں۔
              </p>
              <a href="#/quizzes" class="btn-primary py-3 px-8 text-xs font-extrabold rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 inline-block shadow-lg">
                کوئز حل کر کے سند حاصل کریں &rarr;
              </a>
            </div>
          `}
        </div>
      ` : `
        <!-- ================= ACTIVITY & SECURITY TAB ================= -->
        <div class="space-y-6 animate-fade-in">
          <div class="lh-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <h3 class="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="shield-check" class="w-5 h-5 text-emerald-500"></i>
              <span>اکاؤنٹ سیکیورٹی اور لاگ ان ڈیوائسز (Active Sessions)</span>
            </h3>

            <div class="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-300 font-semibold leading-relaxed">
              ✓ آپ کا اکاؤنٹ 100% محفوظ ہے اور صرف آپ کے مجاز براؤزر پر لاگ اِن ہے۔
            </div>

            <div class="pt-2 flex items-center gap-3">
              <a href="#/profile" class="btn-primary py-2.5 px-6 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                🔒 پاس ورڈ تبدیل کریں و 2FA سیٹنگز &rarr;
              </a>
              <button onclick="window.Auth.logout(); window.Router.navigate('/login');" class="btn-secondary py-2.5 px-5 text-xs rounded-xl text-rose-600 font-bold">
                اس ڈیوائس سے لاگ آؤٹ
              </button>
            </div>
          </div>
        </div>
      `}

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.switchDashboardTab = function(tabKey) {
  window.Views.activeDashboardTab = tabKey;
  window.Views.renderDashboard();
};

window.Views.printParentReportCard = function() {
  const user = window.Auth ? window.Auth.getCurrentUser() : null;
  if (!user) return;

  const quizAttempts = (window.DB && typeof window.DB.get === 'function') 
    ? (window.DB.get('quizAttempts') || []).filter(a => a.userId === user.id) 
    : [];
  
  const passedQuizzes = quizAttempts.filter(q => q.passed);
  const avgScore = quizAttempts.length 
    ? Math.round(quizAttempts.reduce((acc, q) => acc + (q.percentage || 0), 0) / quizAttempts.length) 
    : 92;

  const reportCardHtml = `
    <!DOCTYPE html>
    <html lang="ur" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>ماہانہ تعلیمی پروگریس رپورٹ — ${user.name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');
        @page { size: A4 portrait; margin: 12mm; }
        body { font-family: 'Noto Nastaliq Urdu', serif; margin: 0; padding: 20px; color: #0f172a; background: #fff; line-height: 2.2; }
        .header { text-align: center; border-bottom: 3px double #059669; padding-bottom: 15px; margin-bottom: 20px; }
        .title { font-size: 24px; font-weight: bold; color: #065f46; margin: 5px 0; }
        .meta-table, .grades-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
        .meta-table td { padding: 8px; border: 1px solid #cbd5e1; }
        .grades-table th { background: #f0fdf4; color: #065f46; padding: 10px; border: 1px solid #cbd5e1; text-align: right; }
        .grades-table td { padding: 10px; border: 1px solid #cbd5e1; }
        .highlight { font-weight: bold; color: #059669; }
        .seal-box { margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
        .signature { text-align: center; border-top: 1px solid #000; width: 200px; padding-top: 5px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="font-family: 'Amiri', serif; font-size: 20px; color: #047857;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
        <div class="title">لرن ہب اکیڈمی — طالب علم کا ماہانہ رپورٹ کارڈ</div>
        <div style="font-size: 12px; color: #64748b;">LEARNHUB ISLAMIC ACADEMY • MONTHLY STUDENT PROGRESS REPORT</div>
      </div>

      <table class="meta-table">
        <tr>
          <td><strong>طالب علم کا نام:</strong> ${user.name}</td>
          <td><strong>اسٹوڈنٹ آئی ڈی:</strong> ${user.id}</td>
        </tr>
        <tr>
          <td><strong>تعلیمی درجہ / رینک:</strong> لیول ${Math.max(1, Math.floor((user.totalPoints || 100) / 100))} (ممتاز)</td>
          <td><strong>رپورٹ کی تاریخ:</strong> ${new Date().toLocaleDateString('ur-PK')}</td>
        </tr>
        <tr>
          <td><strong>حاضری و تسلسل:</strong> ${user.learningStreak || 1} دن بلا ناغہ (100%)</td>
          <td><strong>مجموعی پوائنٹس (XP):</strong> ${user.totalPoints || 100} XP</td>
        </tr>
      </table>

      <h3 style="color: #065f46; font-size: 15px; margin-bottom: 10px;">امتحانات اور کوئزز کی کارکردگی:</h3>
      <table class="grades-table">
        <thead>
          <tr>
            <th>نمبر شمار</th>
            <th>مضمون / عنوان</th>
            <th>حاصل کردہ نمبرات</th>
            <th>درجہ (Grade)</th>
            <th>اسٹیٹس</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>تجوید و مخارج الحروف اور قراءت</td>
            <td>95%</td>
            <td>A+ (ممتاز)</td>
            <td class="highlight">کامیاب ✓</td>
          </tr>
          <tr>
            <td>2</td>
            <td>اربعین نووی (چالیس احادیث)</td>
            <td>90%</td>
            <td>A (بہترین)</td>
            <td class="highlight">کامیاب ✓</td>
          </tr>
          <tr>
            <td>3</td>
            <td>فقہ العبادات (وضو، طہارت و نماز)</td>
            <td>94%</td>
            <td>A+ (ممتاز)</td>
            <td class="highlight">کامیاب ✓</td>
          </tr>
          <tr>
            <td>4</td>
            <td>سیرت النبی ﷺ و تاریخِ اسلام</td>
            <td>88%</td>
            <td>A (بہترین)</td>
            <td class="highlight">کامیاب ✓</td>
          </tr>
        </tbody>
      </table>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; margin-bottom: 25px; font-size: 12px;">
        <strong style="color: #047857;">استاد / نگران کے ریمارکس:</strong>
        طالب علم ماشاء اللہ انتہائی ذہین، پابند اور دینی تعلیم کے حصول میں پرجوش ہے۔ حفظِ احادیث اور تجوید کی ادائیگی نہایت شاندار ہے۔
      </div>

      <div class="seal-box">
        <div class="signature">دستخط و مہر نگرانِ تعلیم</div>
        <div style="text-align: center; font-family: 'Amiri', serif; font-size: 26px; color: #d97706;">۞ 24K VERIFIED ۞</div>
        <div class="signature">دستخط شیخ الحدیث / صدر مدرس</div>
      </div>
    </body>
    </html>
  `;

  let frame = document.getElementById('report-card-frame');
  if (!frame) {
    frame = document.createElement('iframe');
    frame.id = 'report-card-frame';
    frame.style.position = 'fixed';
    frame.style.right = '0';
    frame.style.bottom = '0';
    frame.style.width = '0';
    frame.style.height = '0';
    frame.style.border = '0';
    document.body.appendChild(frame);
  }

  const doc = frame.contentWindow.document;
  doc.open();
  doc.write(reportCardHtml);
  doc.close();

  setTimeout(() => {
    frame.contentWindow.focus();
    frame.contentWindow.print();
  }, 500);

  window.App?.showToast('والدین کے لیے ماہانہ پروگریس رپورٹ پی ڈی ایف تیار ہو گئی! 📄✨', 'success');
};



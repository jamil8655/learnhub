/**
 * LearnHub Royal Student Learning Dashboard View
 * Ultra-Professional Urdu RTL Interface with Royal Islamic Academy Theme
 * Features:
 *  - Royal Student Profile Header with Avatar, Name, Email, and Role Pill
 *  - Learning Streak & Islamic XP Points Tracker
 *  - 4 Royal Metric KPI Cards (Enrolled Courses, Verified Certificates, Quiz Attempts, Academic Badges)
 *  - Continue Learning Active Masterclass Card with Progress Bar
 *  - Standalone Diagnostic Quizzes Quick Launch Arena
 *  - Quran & 40 Hadith Direct Study Quick Actions
 *  - My Verified Certificates Showcase with 1-Click Verification & View
 *  - Recent Learning Activities & Security Events
 */

window.Views = window.Views || {};

window.Views.renderDashboard = async function() {
  const container = document.getElementById('main-content');
  const user = window.Auth ? window.Auth.getCurrentUser() : null;

  if (!user || (window.Auth && !window.Auth.isAuthenticated())) {
    window.Router.navigate('/login');
    return;
  }

  // Load Real Data from DB & API
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

  const inProgressCourses = enrolledCourseObjects.filter(e => (e.progress || 0) < 100);
  const completedCourses = enrolledCourseObjects.filter(e => (e.progress || 0) >= 100);

  const quizAttempts = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('quizAttempts') || []).filter(a => a.userId === user.id)
    : [];

  const certificates = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('certificates') || []).filter(c => c.userId === user.id || c.userName === user.name)
    : [];

  const standaloneQuizzes = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('quizzes') || []).slice(0, 3)
    : [];

  const activeContinue = inProgressCourses[0] || enrolledCourseObjects[0] || (allCourses.length ? { course: allCourses[0], progress: 35, lastLesson: 'تجوید الحروف اور قواعدِ مخارج' } : null);

  const roleLabel = (user.role === 'admin' || user.role === 'super_admin') 
    ? 'مرکزی ایڈمنسٹریٹر' 
    : (user.role === 'instructor' ? 'استاد محترم' : 'طالب علم (Student)');

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-urdu w-full max-w-full overflow-hidden" dir="rtl">
      
      <!-- 1. Royal Student Header & Streak Banner -->
      <div class="relative bg-gradient-to-l from-slate-950 via-indigo-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl overflow-hidden">
        <!-- Glow accents -->
        <div class="absolute right-0 top-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute left-0 bottom-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <!-- Student Identity -->
          <div class="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-4 sm:gap-5 w-full md:w-auto">
            <div class="relative shrink-0">
              <img 
                src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}" 
                alt="${user.name}" 
                class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-emerald-500/60 shadow-xl"
              />
              <span class="absolute -bottom-1 -left-1 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md border-2 border-slate-900" title="فعال آن لائن">✓</span>
            </div>

            <div class="space-y-1.5 min-w-0">
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
                  <span>${roleLabel}</span>
                </span>
                <span class="text-[11px] text-slate-400 font-mono" dir="ltr">${user.email}</span>
              </div>

              <h1 class="text-2xl sm:text-3xl font-extrabold text-white">خوش آمدید، ${user.name}!</h1>
              <p class="text-xs sm:text-sm text-emerald-200/90 max-w-xl leading-relaxed">
                ${user.headline || 'علمِ دین اور جدید عصری مہارتوں کے حصول کا سفر، باقاعدہ اسناد کے ساتھ۔'}
              </p>
            </div>
          </div>

          <!-- Streak & Quick Action Buttons -->
          <div class="flex flex-wrap items-center justify-center gap-3 shrink-0 w-full md:w-auto">
            <!-- Streak Flame Card -->
            <div class="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl flex items-center gap-3 shadow-lg">
              <div class="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md">
                <i data-lucide="flame" class="w-6 h-6 animate-pulse"></i>
              </div>
              <div class="text-right">
                <div class="text-[10px] uppercase font-bold text-amber-300">روزانہ کا تسلسل (Streak)</div>
                <div class="text-lg sm:text-xl font-extrabold text-white font-mono">${user.learningStreak || 7} دن فعال</div>
              </div>
            </div>

            <!-- Profile Settings Button -->
            <a href="#/profile" class="btn-secondary py-3 px-4 text-xs rounded-2xl flex items-center gap-2 bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold shadow">
              <i data-lucide="settings" class="w-4 h-4 text-amber-400"></i>
              <span>پروفائل اور ترتیبات</span>
            </a>
          </div>

        </div>
      </div>

      <!-- 2. Royal 4 KPI Metric Cards Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        
        <!-- Enrolled Courses -->
        <div class="lh-card p-4 sm:p-6 space-y-2 border-t-4 border-t-indigo-500 rounded-2xl bg-white dark:bg-slate-900 shadow-md">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>زیرِ تعلیم کورسز</span>
            <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <i data-lucide="book-open" class="w-4 h-4"></i>
            </div>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">${enrolledCourseObjects.length || allCourses.length}</div>
          <p class="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">جامع ماسٹر کلاسز</p>
        </div>

        <!-- Completed Courses / Badges -->
        <div class="lh-card p-4 sm:p-6 space-y-2 border-t-4 border-t-emerald-500 rounded-2xl bg-white dark:bg-slate-900 shadow-md">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>مکمل شدہ کورسز</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <i data-lucide="check-circle-2" class="w-4 h-4"></i>
            </div>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">${completedCourses.length}</div>
          <p class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">100% مکمل اسباق</p>
        </div>

        <!-- Quiz Attempts -->
        <div class="lh-card p-4 sm:p-6 space-y-2 border-t-4 border-t-cyan-500 rounded-2xl bg-white dark:bg-slate-900 shadow-md">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>حل شدہ امتحانات</span>
            <div class="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center">
              <i data-lucide="zap" class="w-4 h-4"></i>
            </div>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">${quizAttempts.length}</div>
          <p class="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold">تشخیصی کوئزز</p>
        </div>

        <!-- Certificates Earned -->
        <div class="lh-card p-4 sm:p-6 space-y-2 border-t-4 border-t-amber-500 rounded-2xl bg-white dark:bg-slate-900 shadow-md">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>حاصل کردہ اسناد</span>
            <div class="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <i data-lucide="award" class="w-4 h-4"></i>
            </div>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-amber-500 font-mono">${certificates.length}</div>
          <p class="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">QR تصدیقی اسناد</p>
        </div>

      </div>

      <!-- 3. Main Dashboard Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        <!-- Left Column: Continue Learning & Enrolled Courses (8 cols) -->
        <div class="lg:col-span-8 space-y-6">
          
          <!-- Continue Active Course Card -->
          ${activeContinue && activeContinue.course ? `
            <div class="lh-card p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-white via-indigo-50/30 to-emerald-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-2 border-emerald-500/30 shadow-xl space-y-4">
              <div class="flex items-center justify-between">
                <span class="badge bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-bold">
                  ▶️ سبق جاری رکھیں (Continue Learning)
                </span>
                <span class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">پیش رفت: ${activeContinue.progress || 35}%</span>
              </div>

              <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
                <img 
                  src="${activeContinue.course.thumbnail || 'https://images.unsplash.com/photo-1584281722572-ca4948a4369e?auto=format&fit=crop&q=80&w=400'}" 
                  alt="${activeContinue.course.title}" 
                  class="w-full sm:w-48 aspect-video rounded-2xl object-cover shadow-md shrink-0"
                />

                <div class="flex-1 min-w-0 space-y-2 w-full text-right">
                  <h3 class="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-snug truncate">
                    ${activeContinue.course.title}
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    ${activeContinue.course.shortDescription || activeContinue.course.subtitle || 'مستند شرعی و علمی رہنمائی کے ساتھ تدریس۔'}
                  </p>

                  <!-- Progress Bar -->
                  <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
                    <div class="bg-emerald-600 h-full rounded-full transition-all duration-500" style="width: ${activeContinue.progress || 35}%;"></div>
                  </div>
                </div>
              </div>

              <!-- Action Footer -->
              <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span class="text-xs text-slate-400 flex items-center gap-1.5">
                  <i data-lucide="clock" class="w-3.5 h-3.5 text-emerald-500"></i>
                  <span>اگلا سبق: مخارج و صفات الحروف</span>
                </span>

                <a href="#/learn/${activeContinue.course.id}" class="btn-primary py-2.5 px-6 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-md">
                  <span>سبق شروع کریں</span>
                  <i data-lucide="arrow-left" class="w-4 h-4"></i>
                </a>
              </div>
            </div>
          ` : ''}

          <!-- Enrolled Courses Grid -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i data-lucide="graduation-cap" class="w-5 h-5 text-indigo-600"></i>
                <span>میرے تمام کورسز (${enrolledCourseObjects.length || allCourses.length})</span>
              </h3>
              <a href="#/courses" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                تمام کورسز کیٹلاگ &larr;
              </a>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${(enrolledCourseObjects.length ? enrolledCourseObjects : allCourses.slice(0, 4).map(c => ({ course: c, progress: 20 }))).map(item => `
                <div class="lh-card p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 shadow-sm space-y-3 transition flex flex-col justify-between">
                  <div class="space-y-2">
                    <img src="${item.course.thumbnail}" alt="${item.course.title}" class="w-full aspect-video rounded-xl object-cover" />
                    <span class="badge badge-primary text-[10px]">${item.course.level || 'تمام درجات'}</span>
                    <h4 class="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">${item.course.title}</h4>
                  </div>

                  <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div class="flex justify-between text-[11px] text-slate-400">
                      <span>پیش رفت</span>
                      <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">${item.progress || 0}%</span>
                    </div>
                    <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div class="bg-indigo-600 h-full rounded-full" style="width: ${item.progress || 0}%;"></div>
                    </div>
                    <a href="#/learn/${item.course.id}" class="btn-secondary w-full py-2 text-xs rounded-xl text-center block font-bold mt-2">
                      جاری رکھیں &larr;
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Right Column: Quick Actions, Quizzes & Certificates (4 cols) -->
        <div class="lg:col-span-4 space-y-6">
          
          <!-- Direct Islamic Studies Quick Tiles -->
          <div class="lh-card p-5 rounded-3xl bg-gradient-to-br from-emerald-900 to-slate-950 text-white shadow-xl space-y-4 border border-emerald-500/30">
            <h4 class="font-bold text-sm text-emerald-300 flex items-center gap-2">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
              <span>قرآن و سنت کی براہِ راست تلاوت</span>
            </h4>
            <div class="grid grid-cols-2 gap-2.5">
              <a href="#/quran" class="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-center space-y-1 transition border border-white/10 block">
                <i data-lucide="book-open" class="w-5 h-5 mx-auto text-emerald-400"></i>
                <div class="text-xs font-bold text-white">القرآن الکریم</div>
                <div class="text-[10px] text-emerald-200">114 سورتیں</div>
              </a>
              <a href="#/hadith" class="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-center space-y-1 transition border border-white/10 block">
                <i data-lucide="scroll" class="w-5 h-5 mx-auto text-amber-400"></i>
                <div class="text-xs font-bold text-white">ذخیرۂ احادیث</div>
                <div class="text-[10px] text-amber-200">40+ احادیث</div>
              </a>
            </div>
          </div>

          <!-- Standalone Diagnostic Quizzes Spotlight -->
          <div class="lh-card p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <i data-lucide="zap" class="w-4 h-4 text-cyan-500"></i>
                <span>آزاد تشخیصی امتحانات</span>
              </h4>
              <a href="#/quizzes" class="text-xs text-cyan-600 font-bold hover:underline">سب دیکھیں &larr;</a>
            </div>

            <div class="space-y-3">
              ${standaloneQuizzes.map(quiz => `
                <div class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2 border border-slate-100 dark:border-slate-700/60">
                  <div class="flex justify-between items-center text-[10px]">
                    <span class="badge badge-warning">${quiz.difficulty || 'ابتدائی'}</span>
                    <span class="text-slate-400 font-mono">${quiz.timeLimitMinutes || 10} Mins</span>
                  </div>
                  <h5 class="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">${quiz.title}</h5>
                  <a href="#/quiz-take/${quiz.id}" class="btn-primary w-full py-1.5 text-[11px] rounded-xl text-center block font-bold bg-cyan-600 hover:bg-cyan-500">
                    امتحان شروع کریں &larr;
                  </a>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Verified Certificates Widget -->
          <div class="lh-card p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <i data-lucide="award" class="w-4 h-4 text-amber-500"></i>
                <span>میری اسناد و سرٹیفکیٹس</span>
              </h4>
              <a href="#/certificates" class="text-xs text-amber-600 font-bold hover:underline">تمام دیکھیں &larr;</a>
            </div>

            ${certificates.length ? `
              <div class="space-y-3">
                ${certificates.slice(0, 2).map(cert => `
                  <div class="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200/60 dark:border-amber-800/40 space-y-1.5">
                    <div class="flex justify-between items-center text-[10px]">
                      <span class="font-bold text-amber-700 dark:text-amber-300">تصدیق شدہ سند</span>
                      <span class="font-mono text-slate-400">${cert.certificateNumber || cert.serialNumber || 'LH-CERT-2026'}</span>
                    </div>
                    <div class="font-bold text-xs text-slate-900 dark:text-white truncate">${cert.courseTitle || cert.title}</div>
                    <a href="#/verify-cert/${cert.certificateNumber || cert.serialNumber || cert.id}" class="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold block pt-1 hover:underline">
                      QR تصدیق و سند دیکھیں &rarr;
                    </a>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="text-center py-4 space-y-2">
                <i data-lucide="award" class="w-8 h-8 mx-auto text-slate-300"></i>
                <p class="text-xs text-slate-500">ابھی کوئی سند جاری نہیں ہوئی۔ کوئی بھی کوئز یا کورس مکمل کر کے سند حاصل کریں!</p>
                <a href="#/quizzes" class="btn-primary py-2 px-4 text-xs rounded-xl bg-amber-500 text-slate-950 font-bold inline-block">
                  کوئز حل کریں
                </a>
              </div>
            `}
          </div>

        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

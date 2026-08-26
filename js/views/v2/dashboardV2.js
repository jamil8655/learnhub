/**
 * LearnHub V2 Professional Student Dashboard
 * Modern, clean, minimal, mobile-first, and RTL-compatible.
 */

window.Views = window.Views || {};
window.Views.v2 = window.Views.v2 || {};

window.Views.v2.renderDashboard = function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const user = window.Auth.getCurrentUser() || { name: 'طالب علم', email: '', xp: 0, level: 1 };
  const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;
  const isRtl = window.I18N ? window.I18N.isRTL() : false;

  const enrollments = (window.DB && typeof window.DB.get === 'function')
    ? (window.DB.get('enrollments') || []).filter(e => e.userId === user.id)
    : [];

  const courses = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('courses') || []) : [];
  const activeCourse = enrollments.length > 0 ? courses.find(c => c.id === enrollments[0].courseId) : null;
  const streak = user.streak || 5;
  const xp = user.xp || 350;
  const nextLevelXp = 500;
  const xpPercent = Math.min(100, Math.round((xp / nextLevelXp) * 100));

  let activeCourseHtml = '';
  if (activeCourse) {
    activeCourseHtml = `
      <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4">
        <img src="${activeCourse.thumbnail || 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=200'}" class="w-full sm:w-28 h-20 rounded-xl object-cover" alt="${activeCourse.title}">
        <div class="flex-1 min-w-0 space-y-2 w-full">
          <h3 class="text-sm font-black text-slate-900 dark:text-white truncate">${activeCourse.title}</h3>
          <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div class="bg-emerald-500 h-2 rounded-full" style="width: 45%;"></div>
          </div>
          <div class="flex items-center justify-between text-[11px] text-slate-500">
            <span>45% مکمل شدہ</span>
            <a href="#/learn/${activeCourse.id}" class="v2-btn-primary py-1 px-3 text-xs">سبق شروع کریں</a>
          </div>
        </div>
      </div>
    `;
  } else {
    activeCourseHtml = `
      <div class="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700">
        <p class="text-xs text-slate-500 font-urdu mb-3">آپ نے ابھی تک کسی کورس میں داخلہ نہیں لیا۔</p>
        <a href="#/courses" class="v2-btn-primary text-xs">کورسز دیکھیں اور داخلہ لیں</a>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <!-- Top Welcome Hero Banner -->
      <div class="v2-card p-6 sm:p-8 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white relative overflow-hidden border-none shadow-xl">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md" alt="${user.name}">
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-xl sm:text-2xl font-black">${t('welcomeBack', 'خوش آمدید')}، ${user.name}</h1>
                <span class="v2-badge v2-badge-gold">V2 Beta</span>
              </div>
              <p class="text-xs sm:text-sm text-emerald-200 mt-1 font-urdu">علم کی راہ میں آپ کا سفر جاری ہے — آج کا ہدف مکمل کریں۔</p>
            </div>
          </div>

          <!-- Quick Metrics Bar -->
          <div class="flex items-center gap-3 bg-black/30 p-2.5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div class="px-3 py-1 text-center">
              <div class="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
                <i data-lucide="flame" class="w-4 h-4 text-orange-400"></i> ${streak}
              </div>
              <div class="text-[10px] text-slate-300 font-urdu">روزانہ تسلسل</div>
            </div>
            <div class="w-px h-8 bg-white/10"></div>
            <div class="px-3 py-1 text-center">
              <div class="text-lg font-black text-emerald-400 flex items-center justify-center gap-1">
                <i data-lucide="zap" class="w-4 h-4 text-yellow-300"></i> ${xp}
              </div>
              <div class="text-[10px] text-slate-300 font-urdu">کل حاصل کردہ XP</div>
            </div>
            <div class="w-px h-8 bg-white/10"></div>
            <div class="px-3 py-1 text-center">
              <div class="text-lg font-black text-cyan-300 flex items-center justify-center gap-1">
                <i data-lucide="award" class="w-4 h-4 text-cyan-300"></i> ${user.level || 1}
              </div>
              <div class="text-[10px] text-slate-300 font-urdu">تعلیمی لیول</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Grid: Learning Path & Sidebar Widgets -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left 2 Cols: Active Learning & Hubs -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Continue Learning Card -->
          <div class="v2-card p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <i data-lucide="play-circle" class="w-5 h-5 text-emerald-600"></i>
                <span>تعلیم جاری رکھیں (Continue Learning)</span>
              </h2>
              <a href="#/courses" class="text-xs font-bold text-emerald-600 hover:underline">تمام کورسز &rarr;</a>
            </div>
            ${activeCourseHtml}
          </div>

          <!-- Quick Islamic Hubs Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <a href="#/quran" class="v2-card v2-card-interactive p-4 text-center space-y-2 block">
              <div class="w-10 h-10 mx-auto rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center"><i data-lucide="book-open" class="w-5 h-5"></i></div>
              <div class="text-xs font-black text-slate-900 dark:text-white font-urdu">قرآن مجید</div>
              <div class="text-[10px] text-slate-400">114 سورتیں</div>
            </a>
            <a href="#/hadith" class="v2-card v2-card-interactive p-4 text-center space-y-2 block">
              <div class="w-10 h-10 mx-auto rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center"><i data-lucide="scroll" class="w-5 h-5"></i></div>
              <div class="text-xs font-black text-slate-900 dark:text-white font-urdu">کتبِ حدیث</div>
              <div class="text-[10px] text-slate-400">صحاح ستہ</div>
            </a>
            <a href="#/adventure" class="v2-card v2-card-interactive p-4 text-center space-y-2 block">
              <div class="w-10 h-10 mx-auto rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center"><i data-lucide="gamepad-2" class="w-5 h-5"></i></div>
              <div class="text-xs font-black text-slate-900 dark:text-white font-urdu">ایڈونچر گیم</div>
              <div class="text-[10px] text-slate-400">9 جہانیں</div>
            </a>
            <a href="#/library" class="v2-card v2-card-interactive p-4 text-center space-y-2 block">
              <div class="w-10 h-10 mx-auto rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center"><i data-lucide="library" class="w-5 h-5"></i></div>
              <div class="text-xs font-black text-slate-900 dark:text-white font-urdu">کتب خانہ</div>
              <div class="text-[10px] text-slate-400">300+ کتب</div>
            </a>
          </div>
        </div>

        <!-- Right 1 Col: XP Goal & Quick Actions -->
        <div class="space-y-6">
          <div class="v2-card p-6 space-y-4">
            <h3 class="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="target" class="w-4 h-4 text-amber-500"></i>
              <span>روزانہ کا تعلیمی ہدف</span>
            </h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-slate-600 dark:text-slate-300">${xp} / ${nextLevelXp} XP</span>
                <span class="text-emerald-600">${xpPercent}%</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div class="bg-gradient-to-r from-amber-500 to-yellow-400 h-2.5 rounded-full" style="width: ${xpPercent}%;"></div>
              </div>
            </div>
            <p class="text-[11px] text-slate-500 font-urdu leading-relaxed">اگلے لیول کے لیے مزید ${nextLevelXp - xp} XP درکار ہیں۔</p>
            <a href="#/adventure" class="v2-btn-secondary w-full text-xs">ایڈونچر کھیلیں</a>
          </div>

          <div class="v2-card p-6 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent border-amber-500/30 space-y-3">
            <div class="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-black text-sm">
              <i data-lucide="award" class="w-5 h-5 text-amber-500"></i>
              <span>شاہی اسناد و سرٹیفکیٹس</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 font-urdu">امتحانات میں نمایاں کامیابی پر تصدیق شدہ اسناد حاصل کریں۔</p>
            <a href="#/certificates" class="v2-btn-primary w-full text-xs">میری اسناد دیکھیں</a>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

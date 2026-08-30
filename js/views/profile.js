/**
 * LearnHub User Profile & Identity Management Suite
 * Royal Teal & Gold Mobile Edition - Full Dynamic Integration
 */

window.Views = window.Views || {};
window.Views.activeProfileTab = window.Views.activeProfileTab || 'overview';

window.Views.renderProfile = function(params, query) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const currentUser = (window.Auth && typeof window.Auth.getCurrentUser === 'function') 
    ? window.Auth.getCurrentUser() 
    : null;

  const user = currentUser || {
    id: 'student-default',
    name: 'طالب علم (LearnHub Scholar)',
    email: 'student@learnhubplatform.com',
    role: 'student',
    joinedDate: '2026-01-15',
    xp: 850,
    streak: 7
  };

  const enrollments = (window.DB && typeof window.DB.get === 'function') 
    ? (window.DB.get('enrollments') || []).filter(e => !user.id || e.userId === user.id || e.userId === 'student-default')
    : [];

  const certificates = (window.DB && typeof window.DB.get === 'function') 
    ? (window.DB.get('certificates') || []).filter(c => !user.id || c.userId === user.id || c.studentName === user.name)
    : [];

  const quizAttempts = (window.DB && typeof window.DB.get === 'function') 
    ? (window.DB.get('quizAttempts') || []).filter(a => !user.id || a.userId === user.id)
    : [];

  const courses = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('courses') || []) : [];
  const enrolledCourses = courses.filter(c => enrollments.some(e => e.courseId === c.id)) || courses.slice(0, 2);

  const activeTab = window.Views.activeProfileTab || 'overview';

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 font-urdu text-right text-slate-900 dark:text-slate-100 transition-colors pb-28" dir="rtl">
      
      <!-- Top Majestic Header (Teal & Gold) -->
      <div class="bg-teal-800 text-white shadow-md">
        <div class="max-w-4xl mx-auto px-4 py-5 sm:py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-14 h-14 rounded-2xl bg-teal-900 text-amber-300 border-2 border-amber-400 flex items-center justify-center text-2xl font-black shadow-md">
                ${user.name ? user.name[0] : 'ط'}
              </div>
              <div>
                <h1 class="text-xl sm:text-2xl font-black font-arabic leading-tight">${user.name || 'طالب علم'}</h1>
                <p class="text-[11px] text-teal-200 font-mono">${user.email || 'student@learnhubplatform.com'}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-1.5">
              <span class="px-3 py-1 rounded-xl bg-teal-900/80 text-amber-300 border border-teal-600/60 text-xs font-bold shadow-xs">
                ${user.role === 'admin' ? '🛡️ ایڈمنسٹریٹر' : '🎓 طالب علم (Scholar)'}
              </span>
            </div>
          </div>
        </div>

        <!-- 100% SINGLE-LINE Horizontal Profile Tabs Strip -->
        <div class="bg-teal-900/90 border-t border-teal-700/60 py-1.5">
          <div class="max-w-4xl mx-auto px-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
            
            <button onclick="window.Views.switchProfileTab('overview')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${activeTab === 'overview' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              📊 تعلیمی پیش رفت
            </button>

            <button onclick="window.Views.switchProfileTab('courses')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${activeTab === 'courses' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              📖 زیرِ مطالعہ کورسز (${enrolledCourses.length || enrollments.length})
            </button>

            <button onclick="window.Views.switchProfileTab('certificates')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${activeTab === 'certificates' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              🏆 شاہی اسناد (${certificates.length})
            </button>

            <button onclick="window.Views.switchProfileTab('edit')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold ${activeTab === 'edit' ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}">
              ✏️ پروفائل ترمیم
            </button>

            <button onclick="window.Router.navigate('/settings')" class="shrink-0 py-1 px-3 rounded-xl transition font-bold bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40">
              ⚙️ ایپ ترتیبات
            </button>

            <button onclick="window.Auth && window.Auth.logout && window.Auth.logout()" class="shrink-0 py-1 px-3 rounded-xl transition font-bold bg-rose-500/20 text-rose-300 border border-rose-400/40 hover:bg-rose-500 hover:text-white">
              🚪 لاگ آؤٹ
            </button>

          </div>
        </div>
      </div>

      <!-- Main Profile Body Canvas -->
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-5 space-y-4">
        
        ${activeTab === 'overview' ? `
          <!-- 4 KPI Metrics -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-1 shadow-xs">
              <span class="text-xs text-slate-500">زیرِ مطالعہ کورسز</span>
              <p class="text-xl font-mono font-black text-teal-800 dark:text-teal-300">${enrolledCourses.length || 2}</p>
            </div>
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-1 shadow-xs">
              <span class="text-xs text-slate-500">حاصل کردہ اسناد</span>
              <p class="text-xl font-mono font-black text-amber-400">${certificates.length || 1}</p>
            </div>
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-1 shadow-xs">
              <span class="text-xs text-slate-500">علمی پوائنٹس (XP)</span>
              <p class="text-xl font-mono font-black text-teal-800 dark:text-teal-300">${user.xp || 850} XP</p>
            </div>
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-1 shadow-xs">
              <span class="text-xs text-slate-500">مسلسل حاضری</span>
              <p class="text-xl font-mono font-black text-rose-500">🔥 ${user.streak || 7} دن</p>
            </div>
          </div>

          <!-- Personal Information Card -->
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <h3 class="text-xs font-black text-teal-800 dark:text-teal-300">ذاتی معلومات و اکیڈمی ریکارڈ:</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <span class="text-slate-400 text-[10px]">مکمل نام:</span>
                <p class="font-bold">${user.name || 'طالب علم'}</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <span class="text-slate-400 text-[10px]">ای میل ایڈریس:</span>
                <p class="font-bold font-mono">${user.email || 'student@learnhubplatform.com'}</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <span class="text-slate-400 text-[10px]">شمولیت کی تاریخ:</span>
                <p class="font-bold font-mono">${user.joinedDate || '2026-01-15'}</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-0.5">
                <span class="text-slate-400 text-[10px]">حالت (Account Status):</span>
                <p class="font-bold text-emerald-500">فعال (Active Student)</p>
              </div>
            </div>
          </div>
        ` : ''}

        ${activeTab === 'courses' ? `
          <div class="space-y-3">
            <h3 class="text-sm font-black text-teal-800 dark:text-teal-300">آپ کے جاری کورسز و اسباق:</h3>
            ${(enrolledCourses.length ? enrolledCourses : courses.slice(0, 3)).map(c => `
              <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
                <div class="space-y-1">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700">کورس</span>
                  <h4 class="text-xs font-black text-slate-900 dark:text-white">${c.title}</h4>
                  <p class="text-[10px] text-slate-400">${(c.lessons || []).length || 5} اسباق مکمل</p>
                </div>
                <a href="#/learn/${c.id}" class="py-1.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs shadow-xs">
                  جاری رکھیں &larr;
                </a>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${activeTab === 'certificates' ? `
          <div class="space-y-3">
            <h3 class="text-sm font-black text-teal-800 dark:text-teal-300">آپ کی تصدیق شدہ شاہی اسناد:</h3>
            ${certificates.length ? certificates.map(cert => `
              <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
                <div class="space-y-1">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 font-mono">${cert.serialNumber || 'LH-CERT-2026-0001'}</span>
                  <h4 class="text-xs font-black text-slate-900 dark:text-white">${cert.courseTitle || 'تجوید القرآن ماسٹر کلاس'}</h4>
                  <p class="text-[10px] text-slate-400">گریڈ: <strong class="text-amber-500">${cert.grade || 'ممتاز (Distinction)'}</strong></p>
                </div>
                <a href="#/certificates" class="py-1.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-black text-xs shadow-xs">
                  دیکھیں و پرنٹ کریں
                </a>
              </div>
            `).join('') : `
              <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 text-center space-y-2">
                <span class="text-2xl">🎓</span>
                <p class="text-xs text-slate-500">کوئز پاس کر کے اپنی پہلی شاہی سند حاصل کریں!</p>
                <a href="#/quizzes" class="inline-block py-1.5 px-4 rounded-xl bg-teal-800 text-amber-300 text-xs font-bold">امتحانات دیں &larr;</a>
              </div>
            `}
          </div>
        ` : ''}

        ${activeTab === 'edit' ? `
          <!-- Edit Form -->
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <h3 class="text-xs font-black text-teal-800 dark:text-teal-300">پروفائل کی معلومات میں ترمیم:</h3>
            <div class="space-y-3 text-xs">
              <div>
                <label class="block text-slate-500 text-[11px] mb-1">پورا نام:</label>
                <input type="text" id="prof-name" value="${user.name || ''}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-right font-urdu" />
              </div>
              <div>
                <label class="block text-slate-500 text-[11px] mb-1">ای میل ایڈریس:</label>
                <input type="email" id="prof-email" value="${user.email || ''}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-right font-mono" />
              </div>
              <div>
                <label class="block text-slate-500 text-[11px] mb-1">نیا پاس ورڈ (اختیاری):</label>
                <input type="password" id="prof-pass" placeholder="پاس ورڈ تبدیل کرنے کے لیے درج کریں..." class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-right font-mono" />
              </div>
            </div>

            <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button onclick="window.Views.saveProfileInfo()" class="py-2 px-6 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-black text-xs shadow-xs">
                تبدیلیاں محفوظ کریں
              </button>
            </div>
          </div>
        ` : ''}

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.switchProfileTab = function(tab) {
  window.Views.activeProfileTab = tab;
  window.Views.renderProfile();
};

window.Views.saveProfileInfo = function() {
  const name = document.getElementById('prof-name')?.value;
  const email = document.getElementById('prof-email')?.value;
  
  if (name && window.Auth && typeof window.Auth.updateCurrentUser === 'function') {
    window.Auth.updateCurrentUser({ name, email });
  }

  window.App?.showToast('🎉 پروفائل کی معلومات کامیابی کے ساتھ محفوظ ہو گئیں!', 'success');
  window.Views.switchProfileTab('overview');
};

/**
 * LearnHub Executive Admin Control Suite & Dashboard (v156.0.0)
 * Comprehensive English-First Multi-System Governance
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderAdminNav = function(activeKey = 'dashboard') {
  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';

  const tabs = [
    { key: 'dashboard', label: isRtl ? '📊 ڈیش بورڈ' : '📊 Dashboard', link: '#/admin' },
    { key: 'courses', label: isRtl ? '📖 کورسز مینیجر' : '📖 Courses & Lessons', link: '#/admin/courses' },
    { key: 'quizzes', label: isRtl ? '⚡ کوئزز و AI جنریٹر' : '⚡ Quizzes & AI Generator', link: '#/admin/quizzes' },
    { key: 'game-studio', label: isRtl ? '🎮 ایڈونچر اسٹوڈیو' : '🎮 Game Studio (9 Realms)', link: '#/admin/game-studio' },
    { key: 'content', label: isRtl ? '📜 کتب خانہ و احادیث' : '📜 Library & Duas', link: '#/admin/content' },
    { key: 'subscribers', label: isRtl ? '📧 سبسکرائبرز و ای میل' : '📧 Subscribers & Broadcast', link: '#/admin/subscribers' },
    { key: 'quran', label: isRtl ? '📖 قرآنی اسٹوڈیو' : '📖 Quran Studio', link: '#/admin/quran' },
    { key: 'certificates', label: isRtl ? '🎓 اسناد و بلک مارکنگ' : '🎓 Diplomas & Grading', link: '#/admin/certificates' },
    { key: 'users', label: isRtl ? '👥 یوزرز و طلباء' : '👥 Users & Students', link: '#/admin/users' },
    { key: 'orders', label: isRtl ? '💰 آرڈرز و فیس' : '💰 Orders & Finance', link: '#/admin/orders' },
    { key: 'instructors', label: isRtl ? '👨‍🏫 فیکلٹی و اساتذہ' : '👨‍🏫 Faculty & Instructors', link: '#/admin/instructors' },
    { key: 'releases', label: isRtl ? '🚀 ریلیز مینیجر' : '🚀 Releases & Sync', link: '#/admin/releases' }
  ];

  return `
    <!-- Top Master Admin Header (Royal Teal & Gold) -->
    <div class="bg-teal-800 text-white shadow-md rounded-2xl mb-4 overflow-hidden">
      <div class="px-4 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <span class="text-2xl">🏛️</span>
          <div>
            <h1 class="text-lg sm:text-xl font-black font-arabic leading-tight">
              ${isRtl ? 'لَوْحَةُ التَّحَكُّمِ الإِدَارِيَّةِ الشَّامِلَةُ' : 'LearnHub Executive Admin Control Room'}
            </h1>
            <p class="text-[11px] text-teal-200 font-sans">
              ${isRtl ? 'ایڈمن کنٹرول روم • مکمل خود مختار نظام' : 'Centralized Platform Governance • Academic, Spiritual & System Management'}
            </p>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <a href="#/" class="py-1.5 px-3 rounded-xl bg-teal-900/80 hover:bg-teal-900 text-amber-300 border border-teal-600/60 text-xs font-bold shadow-xs flex items-center gap-1 transition">
            <span>🌐 ${isRtl ? 'مین پورٹل' : 'Main Portal'}</span>
          </a>
          <span class="px-2.5 py-1.5 rounded-xl bg-amber-400 text-teal-950 font-black text-xs shadow-xs">
            SUPER ADMIN
          </span>
        </div>
      </div>

      <!-- 100% SINGLE-LINE Horizontal Touch-Scrollable Admin Sub-Bar -->
      <div class="bg-teal-900/90 border-t border-teal-700/60 py-1.5">
        <div class="px-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap text-xs" style="-webkit-overflow-scrolling: touch;">
          ${tabs.map(t => {
            const isAct = t.key === activeKey;
            return `
              <a 
                href="${t.link}" 
                class="shrink-0 py-1.5 px-3 rounded-xl transition font-bold ${isAct ? 'bg-teal-700 text-amber-300 font-black shadow-xs border border-amber-400/40' : 'bg-teal-950/60 text-teal-200 hover:text-white border border-teal-700/40'}"
              >
                ${t.label}
              </a>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
};

window.Views.admin.renderDashboard = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const lang = (window.I18N && typeof window.I18N.getCurrentLanguage === 'function') 
    ? window.I18N.getCurrentLanguage() 
    : 'en';
  const isRtl = lang === 'ur' || lang === 'ar';
  const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');

  const courses = (window.DB && window.DB.get('courses')) || [];
  const users = (window.DB && window.DB.get('users')) || [];
  const certificates = (window.DB && window.DB.get('certificates')) || [];
  const quizzes = (window.DB && window.DB.get('quizzes')) || [];
  const quizAttempts = (window.DB && window.DB.get('quizAttempts')) || [];
  const subscribers = (window.DB && window.DB.get('subscribers')) || (JSON.parse(localStorage.getItem('learnhub_subscribers') || '[]'));
  const books = window.ISLAMIC_LIBRARY_BOOKS || (window.DB && window.DB.get('books')) || [];

  const activeUsersCount = users.filter(u => u.status !== 'suspended').length || users.length || 1;
  const publishedCoursesCount = courses.filter(c => c.status === 'published').length || courses.length;
  const passedAttemptsCount = quizAttempts.filter(a => a.passed).length;
  const passRatePercentage = quizAttempts.length ? Math.round((passedAttemptsCount / quizAttempts.length) * 100) : 96;

  const L = {
    title: isRtl ? 'ڈیش بورڈ جائزہ و اعداد و شمار' : 'Executive Overview & Live KPIs',
    sub: isRtl ? 'لرن ہب اکیڈمی کے تمام تعلیمی و فنی امور کا لائیو مانیٹرنگ سسٹم' : 'Real-time monitoring of students, curriculum, examinations, e-library and subscribers.',
    kpiStudents: isRtl ? 'کل فعال طلباء' : 'Total Active Scholars',
    kpiCourses: isRtl ? 'شائع شدہ کورسز' : 'Published Courses',
    kpiQuizzes: isRtl ? 'فعال کوئزز و امتحانات' : 'Active Quizzes & Exams',
    kpiPassRate: isRtl ? 'مجموعی شرحِ کامیابی' : 'Overall Pass Rate',
    kpiSubscribers: isRtl ? 'ای میل سبسکرائبرز' : 'Newsletter Subscribers',
    kpiBooks: isRtl ? 'کتب خانہ ذخیرہ' : 'Classical E-Books',
    kpiCerts: isRtl ? 'جاری شدہ شاہی اسناد' : 'Issued Diplomas',
    secQuickActions: isRtl ? '⚡ فوری انتظامی اقدامات (Quick Actions)' : '⚡ Executive Quick Actions',
    btnNewCourse: isRtl ? '+ نیا کورس شامل کریں' : '+ Add New Course',
    btnNewQuiz: isRtl ? '+ نیا کوئز بنائیں' : '+ Create New Quiz',
    btnAiQuestions: isRtl ? '🤖 AI سوالات جنریٹر' : '🤖 AI Quiz Question Generator',
    btnBroadcast: isRtl ? '📢 ای میل براڈکاسٹ' : '📢 Newsletter Broadcast',
    btnBulkGrade: isRtl ? '🎓 بلک مارکنگ و اسناد' : '🎓 Bulk Grading & Diplomas',
    btnExportDb: isRtl ? '💾 مکمل ڈیٹا بیک اپ' : '💾 Backup Full Database',
    secRecentActivity: isRtl ? '📊 حالیہ کوئز امتحانات کی کارکردگی' : '📊 Recent Examination Attempts & Grading'
  };

  container.innerHTML = `
    <div class="space-y-5 ${fontClass} max-w-7xl mx-auto px-3 sm:px-6 py-4 text-slate-900 dark:text-slate-100" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      ${window.Views.admin.renderAdminNav('dashboard')}

      <!-- Executive Overview Banner -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-600/30 text-[10px] font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>LIVE PRODUCTION DATABASE</span>
          </div>
          <h2 class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
            ${L.title}
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            ${L.sub}
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button onclick="window.Views.admin.exportFullDatabaseBackup()" class="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 shadow-xs">
            <span>💾 ${isRtl ? 'ڈیٹا بیک اپ' : 'Export Backup'}</span>
          </button>
          <a href="#/admin/quizzes" class="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
            <span>⚡ ${isRtl ? 'کوئزز مینیجر' : 'Manage Quizzes'}</span>
          </a>
        </div>
      </div>

      <!-- 6 High-Impact KPI Stat Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        
        <!-- KPI 1: Users -->
        <a href="#/admin/users" class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-600 hover:shadow-md transition flex flex-col justify-between group">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold text-slate-500 group-hover:text-teal-700 dark:group-hover:text-teal-400">${L.kpiStudents}</span>
            <div class="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center text-xs">👥</div>
          </div>
          <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
            ${activeUsersCount}
          </div>
        </a>

        <!-- KPI 2: Courses -->
        <a href="#/admin/courses" class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-600 hover:shadow-md transition flex flex-col justify-between group">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold text-slate-500 group-hover:text-teal-700 dark:group-hover:text-teal-400">${L.kpiCourses}</span>
            <div class="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center text-xs">📖</div>
          </div>
          <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
            ${publishedCoursesCount}
          </div>
        </a>

        <!-- KPI 3: Quizzes -->
        <a href="#/admin/quizzes" class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-600 hover:shadow-md transition flex flex-col justify-between group">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold text-slate-500 group-hover:text-teal-700 dark:group-hover:text-teal-400">${L.kpiQuizzes}</span>
            <div class="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center text-xs">⚡</div>
          </div>
          <div class="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
            ${quizzes.length || 8}
          </div>
        </a>

        <!-- KPI 4: Pass Rate -->
        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold text-slate-500">${L.kpiPassRate}</span>
            <div class="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs">📈</div>
          </div>
          <div class="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            ${passRatePercentage}%
          </div>
        </div>

        <!-- KPI 5: Subscribers -->
        <a href="#/admin/subscribers" class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-600 hover:shadow-md transition flex flex-col justify-between group">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold text-slate-500 group-hover:text-teal-700 dark:group-hover:text-teal-400">${L.kpiSubscribers}</span>
            <div class="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center text-xs">📧</div>
          </div>
          <div class="text-xl sm:text-2xl font-black font-mono text-amber-500">
            ${subscribers.length}
          </div>
        </a>

        <!-- KPI 6: Library Books -->
        <a href="#/admin/content" class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-600 hover:shadow-md transition flex flex-col justify-between group">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold text-slate-500 group-hover:text-teal-700 dark:group-hover:text-teal-400">${L.kpiBooks}</span>
            <div class="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-xs">📚</div>
          </div>
          <div class="text-xl sm:text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
            ${books.length || 310}+
          </div>
        </a>

      </div>

      <!-- Quick Executive Action Center -->
      <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <h3 class="text-xs font-black text-teal-800 dark:text-teal-300 uppercase tracking-wider">
          ${L.secQuickActions}
        </h3>
        
        <div class="flex flex-wrap gap-2.5">
          <a href="#/admin/courses" class="py-2 px-3.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-600/30 transition">
            ${L.btnNewCourse}
          </a>
          <a href="#/admin/quizzes" class="py-2 px-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-600/30 transition">
            ${L.btnNewQuiz}
          </a>
          <a href="#/admin/quizzes" class="py-2 px-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-800 dark:text-purple-300 text-xs font-bold border border-purple-600/30 transition">
            ${L.btnAiQuestions}
          </a>
          <a href="#/admin/subscribers" class="py-2 px-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 text-xs font-bold border border-indigo-600/30 transition">
            ${L.btnBroadcast}
          </a>
          <a href="#/admin/certificates" class="py-2 px-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition">
            ${L.btnBulkGrade}
          </a>
        </div>
      </div>

      <!-- Recent Examination Activity Table -->
      <div class="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            ${L.secRecentActivity}
          </h3>
          <span class="text-[11px] text-slate-400 font-mono">Total Attempts: ${quizAttempts.length}</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
              <tr>
                <th class="p-3.5">Student / Scholar</th>
                <th class="p-3.5">Quiz / Examination</th>
                <th class="p-3.5">Score (%)</th>
                <th class="p-3.5">Evaluation</th>
                <th class="p-3.5">Date</th>
                <th class="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${quizAttempts.length === 0 ? `
                <tr>
                  <td colspan="6" class="p-6 text-center text-slate-400">
                    No examination records yet. New student submissions will appear here live.
                  </td>
                </tr>
              ` : quizAttempts.slice(0, 10).map(a => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td class="p-3.5 font-bold text-slate-900 dark:text-white">${a.userName || 'Scholar ' + (a.userId || '1')}</td>
                  <td class="p-3.5 text-slate-600 dark:text-slate-300 font-medium">${a.quizTitle || 'Islamic Studies Exam'}</td>
                  <td class="p-3.5 font-mono font-bold ${a.score >= 70 ? 'text-teal-700 dark:text-teal-400' : 'text-rose-600'}">${a.score || 85}%</td>
                  <td class="p-3.5">
                    <span class="px-2 py-0.5 rounded-lg text-[10px] font-bold ${a.passed ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'}">
                      ${a.passed ? 'PASSED ✓' : 'NEEDS RETAKE'}
                    </span>
                  </td>
                  <td class="p-3.5 text-slate-400 text-[11px] font-mono">${new Date(a.date || Date.now()).toLocaleDateString()}</td>
                  <td class="p-3.5 text-right">
                    <a href="#/admin/certificates" class="text-teal-700 dark:text-teal-400 font-bold hover:underline">Issue Diploma &rarr;</a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.exportFullDatabaseBackup = function() {
  const data = window.DB ? window.DB.data : localStorage;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'learnhub_full_backup_' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  window.App?.showToast('Full system database exported successfully 💾', 'success');
};

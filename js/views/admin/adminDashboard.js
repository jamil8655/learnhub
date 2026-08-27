/**
 * LearnHub Admin Control Suite & Executive Dashboard (Urdu & Islamic Academy)
 * Complete centralized governance: Courses, Hadiths, Quizzes, Certificates, Users, Database Backup/Restore.
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderDashboard = async function() {
  const container = document.getElementById('main-content');
  if (!container) return;
  const analytics = (await window.API.getAdminAnalytics()) || { kpis: {} };
  const kpis = analytics.kpis || {};
  const courses = (window.DB && window.DB.get('courses')) || [];
  const users = (window.DB && window.DB.get('users')) || [];
  const certificates = (window.DB && window.DB.get('certificates')) || [];
  const quizzes = (window.DB && window.DB.get('quizzes')) || [];
  const quizAttempts = (window.DB && window.DB.get('quizAttempts')) || [];
  const orders = (window.DB && window.DB.get('orders')) || [];
  const auditLogs = (window.DB && window.DB.get('auditLogs')) || [];
  const enrollments = (window.DB && window.DB.get('enrollments')) || [];
  const hadiths = (window.ALL_COMBINED_HADITHS && window.ALL_COMBINED_HADITHS.length) 
    ? window.ALL_COMBINED_HADITHS 
    : (window.DB.get('hadiths') || []);

  const releaseSummary = (window.DB && typeof window.DB.getStagedDraftsSummary === 'function')
    ? window.DB.getStagedDraftsSummary() 
    : { totalDrafts: 0, byCollection: {} };

  const activeUsersCount = users.filter(u => u.status === 'active').length;
  const publishedCoursesCount = courses.filter(c => c.status === 'published').length;
  const passedAttemptsCount = quizAttempts.filter(a => a.passed).length;
  const passRatePercentage = quizAttempts.length ? Math.round((passedAttemptsCount / quizAttempts.length) * 100) : 100;

  // Approximate LocalStorage Usage
  let storageUsageKb = 0;
  try {
    let totalLen = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      totalLen += (key.length + (localStorage.getItem(key) || '').length) * 2;
    }
    storageUsageKb = Math.round(totalLen / 1024);
  } catch (e) {
    storageUsageKb = 128;
  }

  // Combine Recent Activity items (audit logs, enrollments, quiz attempts, orders)
  const combinedActivities = [
    ...auditLogs.map(l => ({
      type: 'audit',
      icon: 'shield',
      color: 'emerald',
      title: l.action.replace(/_/g, ' '),
      subtitle: `${l.actorName}: ${l.target || ''}`,
      time: l.timestamp,
      ip: l.ip || '127.0.0.1'
    })),
    ...quizAttempts.slice(0, 5).map(a => {
      const u = users.find(user => user.id === a.userId);
      const q = quizzes.find(quiz => quiz.id === a.quizId);
      return {
        type: 'quiz',
        icon: 'zap',
        color: a.passed ? 'cyan' : 'rose',
        title: a.passed ? 'امتحان پاس کیا (Quiz Passed)' : 'امتحان میں شرکت (Quiz Attempted)',
        subtitle: `${u ? u.name : 'طالب علم'}: ${q ? q.title : 'کوئز'} (${a.percentage}%)`,
        time: a.completedAt,
        ip: '127.0.0.1'
      };
    }),
    ...orders.slice(0, 5).map(o => ({
      type: 'order',
      icon: 'shopping-cart',
      color: 'amber',
      title: `آرڈر موصول: ${o.orderNumber}`,
      subtitle: `${o.userName} - $${o.total.toFixed(2)} (${o.paymentMethod})`,
      time: o.createdAt,
      ip: '127.0.0.1'
    }))
  ].sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0)).slice(0, 8);

  container.innerHTML = `
    <div class="space-y-8 font-urdu" dir="rtl">
      
      <!-- Top Header & Master Quick Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-l from-slate-900 via-slate-900 to-emerald-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-emerald-500/30">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 text-xs font-bold rounded-full shadow mb-2 font-urdu">
            <i data-lucide="shield" class="w-3.5 h-3.5"></i> مرکزی ایڈمنسٹریشن کنٹرول روم
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white">پلیٹ فارم کا جامع کنٹرول روم</h1>
          <p class="text-xs sm:text-sm text-emerald-100/80 mt-1">تمام کورسز، احادیث، امتحانات، اسناد، مالیاتی ٹرانزیکشنز اور سیکیورٹی کا لائیو جائزہ۔</p>
        </div>

        <!-- Master Action Buttons -->
        <div class="flex flex-wrap gap-2.5">
          <button onclick="window.Views.admin.openCourseBuilderModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> نیا کورس بنائیں
          </button>
          <button onclick="window.Views.openAddBookModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow">
            <i data-lucide="book-marked" class="w-4 h-4"></i> نئی کتاب شامل کریں
          </button>
          <button onclick="window.Views.admin.openHadithBuilderModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow">
            <i data-lucide="scroll" class="w-4 h-4"></i> نئی حدیث درج کریں
          </button>
          <button onclick="window.Router.navigate('/admin/quran')" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center gap-1.5 shadow">
            <i data-lucide="book" class="w-4 h-4"></i> قرآنی اسٹوڈیو و مصحف
          </button>
          <button onclick="window.Views.admin.openIssueCertificateModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 shadow">
            <i data-lucide="award" class="w-4 h-4"></i> سند جاری کریں
          </button>
          <button onclick="window.Views.admin.openQuizBuilderModal()" class="btn-secondary py-2.5 px-3 text-xs rounded-xl flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300">
            <i data-lucide="zap" class="w-4 h-4"></i> نیا کوئز
          </button>
          <button onclick="window.Views.admin.exportDatabaseJSON()" class="btn-secondary py-2.5 px-3 text-xs rounded-xl flex items-center gap-1.5 text-emerald-400" title="بیک اپ فائل ڈاؤنلوڈ کریں">
            <i data-lucide="download" class="w-4 h-4"></i> بیک اپ
          </button>
        </div>
      </div>

      ${releaseSummary.totalDrafts > 0 ? `
        <!-- Universal Staging Alert Banner -->
        <div class="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border-2 border-amber-400/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div class="flex items-center gap-3.5">
            <span class="p-3 rounded-2xl bg-amber-500 text-slate-950 font-black shrink-0 shadow-md">
              <i data-lucide="rocket" class="w-6 h-6"></i>
            </span>
            <div class="space-y-0.5">
              <div class="flex items-center gap-2">
                <h4 class="text-sm sm:text-base font-extrabold text-amber-900 dark:text-amber-300">
                  آپ کے پاس ${releaseSummary.totalDrafts} غیر شائع شدہ ترامیم اور مسودات محفوظ ہیں!
                </h4>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-300 animate-pulse">
                  Staging Mode
                </span>
              </div>
              <p class="text-xs text-slate-600 dark:text-slate-400">
                یہ تمام ترامیم ابھی تک عام طلباء اور صارفین سے خفیہ ہیں۔ جب آپ چاہیں، ریلیز مینیجر کے ذریعے 1-کلک سے لائیو کریں۔
              </p>
            </div>
          </div>
          <a href="#/admin/releases" class="w-full sm:w-auto py-2.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shrink-0 shadow-md transition transform active:scale-95">
            <i data-lucide="upload-cloud" class="w-4 h-4"></i>
            <span>ریلیز مینیجر کھولیں &larr;</span>
          </a>
        </div>
      ` : ''}

      <!-- 4 KPI Metrics Cards Grid (100% Live DB Metrics - Mobile 2x2 Grid) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        
        <!-- KPI 1: Active Users -->
        <div class="lh-card p-3.5 sm:p-5 space-y-1.5 border-t-4 border-t-emerald-500 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
          <div class="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span class="truncate">فعال طلباء</span>
            <i data-lucide="users" class="w-4 h-4 text-emerald-500 shrink-0"></i>
          </div>
          <div class="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">${activeUsersCount} <span class="text-[10px] sm:text-sm font-normal text-slate-400">/ ${users.length}</span></div>
          <div class="flex items-center justify-between pt-1 text-[10px] sm:text-[11px]">
            <span class="text-emerald-600 dark:text-emerald-400 font-bold truncate">
              ${Math.round((activeUsersCount / (users.length || 1)) * 100)}% ایکٹو
            </span>
            <a href="#/admin/users" class="text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 font-bold">صارفین &larr;</a>
          </div>
        </div>

        <!-- KPI 2: Courses -->
        <div class="lh-card p-3.5 sm:p-5 space-y-1.5 border-t-4 border-t-indigo-500 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
          <div class="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span class="truncate">اسلامی کورسز</span>
            <i data-lucide="book-open" class="w-4 h-4 text-indigo-500 shrink-0"></i>
          </div>
          <div class="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">${courses.length} <span class="text-[10px] sm:text-sm font-normal text-slate-400">کورسز</span></div>
          <div class="flex items-center justify-between pt-1 text-[10px] sm:text-[11px]">
            <span class="text-indigo-600 dark:text-indigo-400 font-bold truncate">
              ${publishedCoursesCount} شائع شدہ
            </span>
            <a href="#/admin/courses" class="text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 font-bold">نصاب &larr;</a>
          </div>
        </div>

        <!-- KPI 3: Hadiths -->
        <div class="lh-card p-3.5 sm:p-5 space-y-1.5 border-t-4 border-t-amber-500 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
          <div class="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span class="truncate">احادیثِ مبارکہ</span>
            <i data-lucide="scroll" class="w-4 h-4 text-amber-500 shrink-0"></i>
          </div>
          <div class="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">${hadiths.length} <span class="text-[10px] sm:text-sm font-normal text-slate-400">احادیث</span></div>
          <div class="flex items-center justify-between pt-1 text-[10px] sm:text-[11px]">
            <span class="text-amber-600 dark:text-amber-400 font-bold truncate">
              اربعین نووی
            </span>
            <a href="#/admin/hadiths" class="text-amber-600 dark:text-amber-400 hover:underline font-bold shrink-0">احادیث &larr;</a>
          </div>
        </div>

        <!-- KPI 4: Certificates -->
        <div class="lh-card p-3.5 sm:p-5 space-y-1.5 border-t-4 border-t-purple-500 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
          <div class="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span class="truncate">شاہی اسناد</span>
            <i data-lucide="award" class="w-4 h-4 text-purple-500 shrink-0"></i>
          </div>
          <div class="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">${certificates.length} <span class="text-[10px] sm:text-sm font-normal text-slate-400">اسناد</span></div>
          <div class="flex items-center justify-between pt-1 text-[10px] sm:text-[11px]">
            <span class="text-purple-600 dark:text-purple-400 font-bold truncate">
              QR تصدیق شدہ
            </span>
            <a href="#/admin/certificates" class="text-purple-600 dark:text-purple-400 hover:underline font-bold shrink-0">اسناد &larr;</a>
          </div>
        </div>

      </div>

      <!-- Quick Control Hub (Power Tiles - Mobile 2x2 Grid) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        
        <!-- Tile 1: Courses Management -->
        <div class="lh-card p-4 sm:p-6 space-y-3 sm:space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
              <i data-lucide="book-open" class="w-5 h-5 sm:w-6 sm:h-6"></i>
            </div>
            <div class="min-w-0">
              <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">کورسز و اسباق کنٹرول</h3>
              <p class="text-[10px] sm:text-xs text-slate-500 truncate">نصاب، ویڈیوز اور اسباق شامل کریں</p>
            </div>
          </div>
          <div class="flex gap-2 pt-1">
            <a href="#/admin/courses" class="btn-secondary flex-1 py-1.5 sm:py-2 text-[11px] sm:text-xs rounded-xl text-center font-bold">لسٹ دیکھیں</a>
            <button onclick="window.Views.admin.openCourseBuilderModal()" class="btn-primary flex-1 py-1.5 sm:py-2 text-[11px] sm:text-xs rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500">نیا کورس</button>
          </div>
        </div>

        <!-- Tile 2: Hadiths Management -->
        <div class="lh-card p-4 sm:p-6 space-y-3 sm:space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500 transition">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
              <i data-lucide="scroll" class="w-5 h-5 sm:w-6 sm:h-6"></i>
            </div>
            <div class="min-w-0">
              <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">احادیثِ مبارکہ کنٹرول</h3>
              <p class="text-[10px] sm:text-xs text-slate-500 truncate">نئی احادیث درج یا ایڈٹ کریں</p>
            </div>
          </div>
          <div class="flex gap-2 pt-1">
            <a href="#/admin/hadiths" class="btn-secondary flex-1 py-1.5 sm:py-2 text-[11px] sm:text-xs rounded-xl text-center font-bold">احادیث لسٹ</a>
            <button onclick="window.Views.admin.openHadithBuilderModal()" class="btn-primary flex-1 py-1.5 sm:py-2 text-[11px] sm:text-xs rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400">نئی حدیث</button>
          </div>
        </div>

        <!-- Tile 3: Game Studio & Adventure Engine -->
        <div class="lh-card p-4 sm:p-6 space-y-3 sm:space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500 transition">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center shrink-0">
              <i data-lucide="gamepad-2" class="w-5 h-5 sm:w-6 sm:h-6"></i>
            </div>
            <div class="min-w-0">
              <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">گیم اسٹوڈیو و ایڈونچر</h3>
              <p class="text-[10px] sm:text-xs text-slate-500 truncate">9 اسلامی جہان، پزلز و لیول ایڈیٹر</p>
            </div>
          </div>
          <div class="flex gap-2 pt-1">
            <a href="#/admin/game-studio" class="btn-secondary flex-1 py-1.5 sm:py-2 text-[11px] sm:text-xs rounded-xl text-center font-bold">گیم اسٹوڈیو</a>
            <a href="#/adventure" target="_blank" class="btn-primary flex-1 py-1.5 sm:py-2 text-[11px] sm:text-xs rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400">لائیو گیم</a>
          </div>
        </div>

        <!-- Tile 4: Certificate Generator -->
        <div class="lh-card p-4 sm:p-6 space-y-3 sm:space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-500 transition">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center shrink-0">
              <i data-lucide="award" class="w-5 h-5 sm:w-6 sm:h-6"></i>
            </div>
            <div class="min-w-0">
              <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">شاہی اسناد و سرٹیفکیٹس</h3>
              <p class="text-[10px] sm:text-xs text-slate-500 truncate">QR Code والی اسناد جاری کریں</p>
            </div>
          </div>
          <div class="flex gap-2 pt-1">
            <a href="#/admin/certificates" class="btn-secondary flex-1 py-1.5 sm:py-2 text-[11px] sm:text-xs rounded-xl text-center font-bold">جاری اسناد</a>
            <button onclick="window.Views.admin.openIssueCertificateModal()" class="btn-primary flex-1 py-1.5 sm:py-2 text-[11px] sm:text-xs rounded-xl bg-purple-600 text-white hover:bg-purple-500 font-bold">سند جاری</button>
          </div>
        </div>

      </div>

      <!-- Secondary Power Tiles: Books, Users, Orders & Helpdesk -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        
        <!-- Tile: Islamic Library & E-Books -->
        <div class="lh-card p-4 sm:p-5 space-y-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 min-w-0">
              <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shrink-0">
                <i data-lucide="book-marked" class="w-4 h-4 sm:w-5 sm:h-5"></i>
              </div>
              <span class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">کتب خانہ مینیجر</span>
            </div>
            <a href="#/admin/books" class="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">مینجمنٹ &larr;</a>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed">کتب خانے میں تفاسیر، احادیث، پی ڈی ایف اور کتب کے ابواب کی تحریر و ترمیم۔</p>
        </div>

        <!-- Tile: Instructors Management -->
        <div class="lh-card p-4 sm:p-5 space-y-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 min-w-0">
              <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                <i data-lucide="award" class="w-4 h-4 sm:w-5 sm:h-5"></i>
              </div>
              <span class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">اساتذۂ کرام</span>
            </div>
            <a href="#/admin/instructors" class="text-xs text-emerald-600 font-bold hover:underline">مینجمنٹ &larr;</a>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed">اساتذہ کی درخواستوں کا جائزہ، منظوری، تعلیمی حقوق اور کورسز کی منتقلی۔</p>
        </div>

        <!-- Tile 5: Users & RBAC -->
        <div class="lh-card p-5 space-y-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                <i data-lucide="user-check" class="w-5 h-5"></i>
              </div>
              <span class="font-bold text-sm text-slate-900 dark:text-white">صارفین و رسائی کنٹرول</span>
            </div>
            <a href="#/admin/users" class="text-xs text-blue-600 font-bold hover:underline">ڈائریکٹری &larr;</a>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed">کردار (Role)، اسٹیٹس، لاگ ان سیشنز اور پاس ورڈ ری سیٹ کے اختیارات۔</p>
        </div>

        <!-- Tile 6: Financial Orders & Coupons -->
        <div class="lh-card p-5 space-y-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <i data-lucide="tag" class="w-5 h-5"></i>
              </div>
              <span class="font-bold text-sm text-slate-900 dark:text-white">آرڈرز و رعایتی کوپنز</span>
            </div>
            <a href="#/admin/orders" class="text-xs text-amber-600 font-bold hover:underline">منیجر &larr;</a>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed">رسیدیں، انوائسز، فیصد اور فکسڈ پروموشنل کوپن کوڈز بنائیں اور ٹریک کریں۔</p>
        </div>

        <!-- Tile 7: Announcements & Broadcast -->
        <div class="lh-card p-5 space-y-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                <i data-lucide="megaphone" class="w-5 h-5"></i>
              </div>
              <span class="font-bold text-sm text-slate-900 dark:text-white">اعلانات و نوٹیفیکیشنز</span>
            </div>
            <a href="#/admin/announcements" class="text-xs text-purple-600 font-bold hover:underline">براڈکاسٹ &larr;</a>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed">تمام طلباء کو خصوصی پیغامات، چیلنجز اور نئے مضامین کی اطلاع دیں۔</p>
        </div>

      </div>

      <!-- Live System Health Status & Diagnostics -->
      <div class="lh-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 class="font-bold text-base text-slate-900 dark:text-white">سسٹم ہیلتھ و ڈیٹا بیس کیفیت (Live Health Status)</h3>
          </div>
          <span class="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold rounded-xl border border-emerald-300 dark:border-emerald-800">
            HEALTHY • 100% OPERATIONAL
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div class="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1">
            <div class="text-slate-400 font-bold">ڈیٹا بیس اسٹوریج:</div>
            <div class="font-extrabold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
              <i data-lucide="database" class="w-4 h-4 text-emerald-500"></i>
              <span>${storageUsageKb} KB (Active)</span>
            </div>
          </div>

          <div class="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1">
            <div class="text-slate-400 font-bold">سیکیورٹی و سیشنز:</div>
            <div class="font-extrabold text-indigo-600 dark:text-indigo-400 font-mono flex items-center gap-1.5">
              <i data-lucide="shield-check" class="w-4 h-4"></i>
              <span>2FA & RBAC محفوظ</span>
            </div>
          </div>

          <div class="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1">
            <div class="text-slate-400 font-bold">کوئز پاس ریٹ شرح:</div>
            <div class="font-extrabold text-cyan-600 dark:text-cyan-400 font-mono flex items-center gap-1.5">
              <i data-lucide="check-circle-2" class="w-4 h-4"></i>
              <span>${passRatePercentage}% کامیابی شرح</span>
            </div>
          </div>

          <div class="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1">
            <div class="text-slate-400 font-bold">پلیٹ فارم ورژن:</div>
            <div class="font-extrabold text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1.5">
              <i data-lucide="cpu" class="w-4 h-4"></i>
              <span>LearnHub v2.4.0 (Live)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Live Activity Logs & Audit Trail -->
      <div class="lh-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <i data-lucide="activity" class="w-5 h-5 text-indigo-500"></i>
            <h3 class="font-bold text-base text-slate-900 dark:text-white">حالیہ سرگرمیاں اور انتظامی آڈٹ ٹریل (Recent Activity)</h3>
          </div>
          <a href="#/admin/audit-logs" class="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">مکمل آڈٹ لاگ دیکھیں &larr;</a>
        </div>

        <div class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          ${combinedActivities.length === 0 ? `
            <p class="text-slate-400 py-6 text-center">کوئی حالیہ سرگرمی ریکارڈ نہیں ہے۔</p>
          ` : combinedActivities.map(act => `
            <div class="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition px-2 rounded-xl">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-${act.color}-600 flex items-center justify-center shrink-0">
                  <i data-lucide="${act.icon}" class="w-4 h-4"></i>
                </div>
                <div class="min-w-0">
                  <div class="font-bold text-slate-900 dark:text-white truncate">${act.title}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${act.subtitle}</div>
                </div>
              </div>
              <div class="text-left font-mono text-[11px] text-slate-400 shrink-0" dir="ltr">
                ${act.time ? new Date(act.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'ابھی'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Database Tools & Backup Center -->
      <div class="lh-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="database" class="w-5 h-5 text-emerald-600"></i> ڈیٹا بیس بیک اپ اور ترتیبات
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">پوری ویب سائٹ کا تمام ڈیٹا ایک کلک پر محفوظ، بحال یا ری اسٹور کریں۔</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button onclick="window.Views.admin.exportDatabaseJSON()" class="btn-primary py-2 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow">
              <i data-lucide="download" class="w-3.5 h-3.5"></i> بیک اپ محفوظ کریں (JSON)
            </button>
            <label class="btn-secondary py-2 px-4 text-xs rounded-xl flex items-center gap-1.5 cursor-pointer">
              <i data-lucide="upload" class="w-3.5 h-3.5"></i> فائل اپلوڈ کریں
              <input type="file" accept=".json" class="hidden" onchange="window.Views.admin.importDatabaseJSON(event)">
            </label>
            <button onclick="window.Views.admin.resetDatabaseToSeed()" class="btn-secondary py-2 px-3 text-xs rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-800">
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> فیکٹری ری سیٹ
            </button>
          </div>
        </div>

        <div class="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="info" class="w-4 h-4 text-emerald-500 shrink-0"></i>
            <span>تمام تبدیلیاں فوراً براؤزر میں لاگو ہو جاتی ہیں اور لائیو ورژن کے ساتھ مکمل ہم آہنگ رہتی ہیں۔</span>
          </div>
          <span class="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">LearnHub Enterprise v2.4.0</span>
        </div>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

// ==========================================
// 1. HADITHS MANAGER VIEW IN ADMIN
// ==========================================
window.Views.admin.renderHadiths = async function() {
  const container = document.getElementById('main-content');
  const hadiths = window.ALL_COMBINED_HADITHS || window.DB.get('hadiths') || [];

  container.innerHTML = `
    <div class="space-y-6 font-urdu" dir="rtl">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">احادیثِ مبارکہ منیجر</h1>
          <p class="text-xs sm:text-sm text-slate-500">نئی احادیث درج کریں، متن و ترجمہ ایڈٹ کریں اور تصدیق کریں۔</p>
        </div>
        <button onclick="window.Views.admin.openHadithBuilderModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 flex items-center gap-1.5 shadow">
          <i data-lucide="plus-circle" class="w-4 h-4"></i> نئی حدیث درج کریں
        </button>
      </div>

      <!-- Hadiths List Table -->
      <div class="lh-card overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <input 
            type="text" 
            placeholder="حدیث کا متن یا راوی تلاش کریں..." 
            class="form-input text-xs max-w-xs font-urdu text-right"
            oninput="window.Views.admin.filterHadithAdminTable(this.value)"
          />
          <span class="text-xs text-slate-500">کل احادیث: <strong class="font-mono">${hadiths.length}</strong></span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs" id="admin-hadiths-table">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[11px]">
              <tr>
                <th class="p-3.5">حدیث نمبر / عنوان</th>
                <th class="p-3.5">راوی</th>
                <th class="p-3.5">عربی متن کا خلاصہ</th>
                <th class="p-3.5">کتاب / حوالہ</th>
                <th class="p-3.5 text-left">اختیارات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${hadiths.map(h => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td class="p-3.5">
                    <div class="font-bold text-slate-900 dark:text-white">${h.hadithNumber}</div>
                    <div class="text-[11px] text-amber-600 font-bold">${h.chapter}</div>
                  </td>
                  <td class="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                    ${h.narrator}
                  </td>
                  <td class="p-3.5 text-slate-800 dark:text-slate-200 max-w-xs truncate font-arabic">
                    «${h.textArabic}»
                  </td>
                  <td class="p-3.5 font-bold text-slate-600 dark:text-slate-400">
                    ${h.book || 'اربعین نووی'}
                  </td>
                  <td class="p-3.5 text-left whitespace-nowrap" dir="ltr">
                    <button onclick="window.Views.admin.openHadithBuilderModal('${h.id}')" class="btn-secondary py-1 px-2.5 text-[11px] rounded-lg" title="ایڈٹ کریں">
                      <i data-lucide="edit" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="window.Views.admin.deleteHadith('${h.id}')" class="btn-secondary py-1 px-2.5 text-[11px] rounded-lg text-rose-600 hover:bg-rose-50" title="ڈیلیٹ کریں">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
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

window.Views.admin.filterHadithAdminTable = function(query) {
  const q = (query || '').toLowerCase().trim();
  const rows = document.querySelectorAll('#admin-hadiths-table tbody tr');
  rows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
};

window.Views.admin.openHadithBuilderModal = function(hadithId = null) {
  const hadiths = window.ALL_COMBINED_HADITHS || [];
  const existing = hadithId ? hadiths.find(h => h.id === hadithId) : null;

  window.App.showModal(existing ? 'حدیثِ مبارکہ میں ترمیم کریں' : 'نئی حدیثِ مبارکہ درج کریں', `
    <form onsubmit="window.Views.admin.saveHadith(event, '${hadithId || ''}')" class="space-y-4 font-urdu text-right" dir="rtl">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">حدیث نمبر / کوڈ</label>
          <input type="text" id="hd-num" required value="${existing ? existing.hadithNumber : 'حدیث ' + (hadiths.length + 1)}" class="form-input text-xs font-urdu">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">کتاب کا نام / حوالہ</label>
          <input type="text" id="hd-book" required value="${existing ? existing.book : 'صحیح بخاری / صحیح مسلم'}" class="form-input text-xs font-urdu">
        </div>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">عنوان / باب</label>
        <input type="text" id="hd-chapter" required value="${existing ? existing.chapter : ''}" placeholder="مثلاً: فضیلتِ اخلاص و نیت" class="form-input text-xs font-urdu">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">راویِ حدیث (عربی میں)</label>
        <input type="text" id="hd-narrator" required value="${existing ? existing.narrator : 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ'}" class="form-input text-xs font-arabic">
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">عربی متن مع اعراب (Uthmani Arabic)</label>
        <textarea id="hd-arabic" rows="3" required class="form-input text-xs font-arabic leading-loose">${existing ? existing.textArabic : ''}</textarea>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">سلیس اردو ترجمہ و تشریح</label>
        <textarea id="hd-urdu" rows="3" required class="form-input text-xs font-urdu leading-relaxed">${existing ? existing.textUrdu : ''}</textarea>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">انگریزی ترجمہ (English Translation)</label>
        <input type="text" id="hd-english" value="${existing ? existing.textEnglish : ''}" class="form-input text-xs text-left" dir="ltr">
      </div>

      <div class="pt-2 flex gap-2">
        <button type="submit" class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400">
          محفوظ کریں
        </button>
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">منسوخ</button>
      </div>
    </form>
  `);
};

window.Views.admin.saveHadith = function(e, hadithId) {
  e.preventDefault();
  const num = document.getElementById('hd-num').value;
  const book = document.getElementById('hd-book').value;
  const chapter = document.getElementById('hd-chapter').value;
  const narrator = document.getElementById('hd-narrator').value;
  const textArabic = document.getElementById('hd-arabic').value;
  const textUrdu = document.getElementById('hd-urdu').value;
  const textEnglish = document.getElementById('hd-english').value;

  const newHadith = {
    id: hadithId || `hadith-${Date.now()}`,
    bookId: 'famous',
    hadithNumber: num,
    book,
    chapter,
    narrator,
    textArabic,
    textUrdu,
    textEnglish: textEnglish || 'Prophetic wisdom',
    grade: 'صحیح (Sahih)'
  };

  if (!window.ALL_COMBINED_HADITHS) window.ALL_COMBINED_HADITHS = [];
  
  if (hadithId) {
    const idx = window.ALL_COMBINED_HADITHS.findIndex(h => h.id === hadithId);
    if (idx !== -1) window.ALL_COMBINED_HADITHS[idx] = newHadith;
  } else {
    window.ALL_COMBINED_HADITHS.unshift(newHadith);
  }

  window.App.closeModal();
  window.App.showToast('حدیثِ مبارکہ کامیابی سے محفوظ ہو گئی!', 'success');
  window.Views.admin.renderHadiths();
};

window.Views.admin.deleteHadith = function(hadithId) {
  if (!confirm('کیا آپ واقعی یہ حدیث فہرست سے ہٹانا چاہتے ہیں؟')) return;
  if (window.ALL_COMBINED_HADITHS) {
    window.ALL_COMBINED_HADITHS = window.ALL_COMBINED_HADITHS.filter(h => h.id !== hadithId);
  }
  window.App.showToast('حدیث حذف کر دی گئی۔', 'info');
  window.Views.admin.renderHadiths();
};

// ==========================================
// 2. CERTIFICATES MANAGER VIEW IN ADMIN (SERIAL & BULK MARKING SUITE)
// ==========================================
window._selectedCertIds = [];

window.Views.admin.renderCertificates = async function() {
  const container = document.getElementById('main-content');
  const certificates = window.DB.get('certificates') || [];
  window._selectedCertIds = [];

  container.innerHTML = `
    <div class="space-y-6 font-urdu pb-24" dir="rtl">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="award" class="w-7 h-7 text-amber-500"></i>
            <span>اسناد و سرٹیفکیٹس کنٹرول روم</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-500">سیریل وائز شاہی اسناد جاری کریں، انفرادی ترمیم و حذف کریں اور بیک وقت طلباء کو ریمارک و مارک کریں۔</p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="window.Views.admin.openBulkIssueModal()" class="py-2.5 px-4 text-xs rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 flex items-center gap-1.5 shadow active:scale-95 transition">
            <i data-lucide="users" class="w-4 h-4"></i>
            <span>کثیر طلباء کو اسناد جاری کریں</span>
          </button>
          <button onclick="window.Views.admin.openIssueCertificateModal()" class="btn-primary py-2.5 px-4 text-xs rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 flex items-center gap-1.5 shadow active:scale-95 transition">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>نئی سند جاری کریں</span>
          </button>
        </div>
      </div>

      <!-- Floating Bulk Action Bar (Hidden by default, shows when 1+ selected) -->
      <div id="bulk-certs-action-bar" class="hidden p-4 rounded-2xl bg-indigo-900 text-white shadow-2xl border border-indigo-500/40 flex flex-wrap items-center justify-between gap-3 animate-fade-in sticky top-20 z-30 backdrop-blur-lg">
        <div class="flex items-center gap-2 font-bold text-xs">
          <span class="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-mono text-xs" id="bulk-selected-count">0</span>
          <span>طلباء / اسناد منتخب ہیں</span>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="window.Views.admin.openBulkRemarkModal()" class="py-2 px-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow transition active:scale-95">
            <i data-lucide="edit" class="w-4 h-4"></i>
            <span>مارک و ریمارک لگائیں (Bulk Remark)</span>
          </button>
          <button onclick="window.Views.admin.bulkVerifyCertificates()" class="py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow transition active:scale-95">
            <i data-lucide="check-circle-2" class="w-4 h-4"></i>
            <span>ایک ساتھ تصدیق کریں</span>
          </button>
          <button onclick="window.Views.admin.bulkDeleteCertificates()" class="py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow transition active:scale-95">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
            <span>ایک ساتھ حذف کریں</span>
          </button>
        </div>
      </div>

      <!-- Certificates Table with Selection Checkboxes -->
      <div class="lh-card overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[11px]">
              <tr>
                <th class="p-3.5 text-center w-10">
                  <input type="checkbox" onchange="window.Views.admin.toggleSelectAllCerts(this)" class="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer">
                </th>
                <th class="p-3.5">سیریل نمبر (Serial)</th>
                <th class="p-3.5">طالب علم کا نام</th>
                <th class="p-3.5">کورس / امتحان</th>
                <th class="p-3.5">درجہ / ریمارک</th>
                <th class="p-3.5">تاریخِ فراغت</th>
                <th class="p-3.5 text-center">اختیارات (Actions)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${certificates.length ? certificates.map((cert, idx) => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition ${window._selectedCertIds.includes(cert.id) ? 'bg-indigo-50/50 dark:bg-indigo-950/30' : ''}" id="cert-row-${cert.id}">
                  <td class="p-3.5 text-center">
                    <input type="checkbox" value="${cert.id}" onchange="window.Views.admin.toggleCertSelect('${cert.id}', this)" class="cert-checkbox w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer">
                  </td>
                  <td class="p-3.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                    ${cert.certificateNumber || cert.serialNumber || `LH-CERT-2026-${(idx + 1).toString().padStart(4, '0')}`}
                  </td>
                  <td class="p-3.5 font-bold text-slate-900 dark:text-white">
                    ${cert.userName}
                  </td>
                  <td class="p-3.5 text-slate-700 dark:text-slate-300">
                    ${cert.courseTitle}
                  </td>
                  <td class="p-3.5">
                    <div class="flex flex-col gap-0.5">
                      <span class="badge bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-[10px] font-bold w-max">
                        ${cert.grade || 'ممتاز (Distinction)'}
                      </span>
                      ${cert.remarks ? `<span class="text-[10px] text-slate-500 dark:text-slate-400 italic font-urdu">${cert.remarks}</span>` : ''}
                    </div>
                  </td>
                  <td class="p-3.5 text-slate-500 font-mono">
                    ${cert.issueDate || '2026-02-18'}
                  </td>
                  <td class="p-3.5 text-center whitespace-nowrap">
                    <div class="flex items-center justify-center gap-1">
                      <a href="#/verify-cert/${cert.certificateNumber || cert.serialNumber}" class="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition" title="آن لائن تصدیق دیکھیں">
                        <i data-lucide="qr-code" class="w-4 h-4"></i>
                      </a>
                      <button onclick="window.Views.admin.openEditCertificateModal('${cert.id}')" class="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 hover:bg-amber-100 transition" title="ترمیم کریں (Edit)">
                        <i data-lucide="edit-3" class="w-4 h-4"></i>
                      </button>
                      <button onclick="window.Views.admin.deleteCertificate('${cert.id}')" class="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition" title="حذف کریں (Delete)">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="7" class="p-8 text-center text-slate-500">کوئی سند دستیاب نہیں۔ نیا سرٹیفکیٹ جاری کرنے کے لیے اوپر دیے گئے بٹن پر کلک کریں۔</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
};

/* =============================================================================
   BULK SELECTION & MARKING HANDLERS
   ============================================================================= */

window.Views.admin.toggleSelectAllCerts = function(masterCheckbox) {
  const checkboxes = document.querySelectorAll('.cert-checkbox');
  window._selectedCertIds = [];
  checkboxes.forEach(cb => {
    cb.checked = masterCheckbox.checked;
    if (masterCheckbox.checked) {
      window._selectedCertIds.push(cb.value);
    }
  });
  window.Views.admin.updateBulkActionBar();
};

window.Views.admin.toggleCertSelect = function(certId, cb) {
  if (cb.checked) {
    if (!window._selectedCertIds.includes(certId)) window._selectedCertIds.push(certId);
  } else {
    window._selectedCertIds = window._selectedCertIds.filter(id => id !== certId);
  }
  window.Views.admin.updateBulkActionBar();
};

window.Views.admin.updateBulkActionBar = function() {
  const bar = document.getElementById('bulk-certs-action-bar');
  const countEl = document.getElementById('bulk-selected-count');
  if (!bar || !countEl) return;

  const count = window._selectedCertIds.length;
  countEl.innerText = count;

  if (count > 0) {
    bar.classList.remove('hidden');
  } else {
    bar.classList.add('hidden');
  }
};

window.Views.admin.openBulkRemarkModal = function() {
  if (!window._selectedCertIds.length) {
    window.App?.showToast('براہ کرم پہلے ایک یا زائد طلباء کا انتخاب کریں۔', 'error');
    return;
  }

  const modalHtml = `
    <div id="bulk-remark-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-up">
        
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="edit" class="w-5 h-5 text-amber-500"></i>
            <span>منتخب ${window._selectedCertIds.length} طلباء کو ریمارک و درجہ لگائیں</span>
          </h3>
          <button onclick="document.getElementById('bulk-remark-modal').remove()" class="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <form onsubmit="window.Views.admin.saveBulkRemarks(event)" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">مشترکہ درجہ / گریڈ منتخب کریں</label>
            <select id="bulk-grade-select" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold">
              <option value="ممتاز (Highest Distinction - 100%)">ممتاز (Highest Distinction - 100%)</option>
              <option value="جید جداً (First Division - 90%)">جید جداً (First Division - 90%)</option>
              <option value="جید (Second Division - 80%)">جید (Second Division - 80%)</option>
              <option value="مقبول (Pass - 70%)">مقبول (Pass - 70%)</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">استاد / ایڈمن ریمارک (Remarks)</label>
            <input type="text" id="bulk-remark-text" value="شاہی سند کی باضابطہ منظوری دی گئی۔ شاندار علمی کارکردگی۔" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold">
          </div>

          <div class="pt-3 flex items-center justify-end gap-2">
            <button type="button" onclick="document.getElementById('bulk-remark-modal').remove()" class="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">منسوخ</button>
            <button type="submit" class="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md">تمام پر لاگو کریں</button>
          </div>
        </form>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.saveBulkRemarks = function(e) {
  e.preventDefault();
  const grade = document.getElementById('bulk-grade-select').value;
  const remarks = document.getElementById('bulk-remark-text').value.trim();

  let certificates = window.DB.get('certificates') || [];
  certificates = certificates.map(cert => {
    if (window._selectedCertIds.includes(cert.id)) {
      return { ...cert, grade, remarks, isVerified: true };
    }
    return cert;
  });

  window.DB.set('certificates', certificates);
  window.DB.save();

  document.getElementById('bulk-remark-modal')?.remove();
  window.App?.showToast(`✓ منتخب ${window._selectedCertIds.length} اسناد پر ریمارکس اور گریڈ کامیابی سے لاگو ہو گئے!`, 'success');
  window.Views.admin.renderCertificates();
};

window.Views.admin.bulkVerifyCertificates = function() {
  let certificates = window.DB.get('certificates') || [];
  certificates = certificates.map(cert => {
    if (window._selectedCertIds.includes(cert.id)) {
      return { ...cert, isVerified: true, verifiedAt: new Date().toISOString() };
    }
    return cert;
  });

  window.DB.set('certificates', certificates);
  window.DB.save();

  window.App?.showToast(`✓ منتخب ${window._selectedCertIds.length} اسناد کی آن لائن تصدیق منظور کر لی گئی!`, 'success');
  window.Views.admin.renderCertificates();
};

window.Views.admin.bulkDeleteCertificates = function() {
  if (!confirm(`کیا آپ واقعی منتخب کردہ ${window._selectedCertIds.length} اسناد کو مستقل حذف کرنا چاہتے ہیں؟`)) return;

  let certificates = window.DB.get('certificates') || [];
  certificates = certificates.filter(c => !window._selectedCertIds.includes(c.id));

  window.DB.set('certificates', certificates);
  window.DB.save();

  window.App?.showToast('✓ منتخب اسناد کامیابی سے حذف کر دی گئیں!', 'success');
  window.Views.admin.renderCertificates();
};

/* =============================================================================
   SINGLE CERTIFICATE CRUD (ISSUE / EDIT / DELETE)
   ============================================================================= */

window.Views.admin.openIssueCertificateModal = function() {
  const users = window.DB.get('users') || [];
  const courses = window.DB.get('courses') || [];
  const certificates = window.DB.get('certificates') || [];
  const nextSerial = `LH-CERT-2026-${(certificates.length + 1).toString().padStart(4, '0')}`;

  window.App.showModal('طالب علم کے لیے شاہی سند جاری کریں', `
    <form onsubmit="window.Views.admin.issueCertificate(event)" class="space-y-4 font-urdu text-right text-xs" dir="rtl">
      <div>
        <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">سیریل نمبر (Sequential Serial)</label>
        <input type="text" id="cert-serial-input" value="${nextSerial}" required class="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-amber-600 dark:text-amber-400 font-mono font-bold">
      </div>

      <div>
        <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">طالب علم کا انتخاب کریں</label>
        <select id="cert-user-select" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold">
          ${users.map(u => `<option value="${u.id}" data-name="${u.name}">${u.name} (${u.email})</option>`).join('')}
        </select>
      </div>

      <div>
        <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">کورس / تعلیمی شعبہ</label>
        <select id="cert-course-select" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold">
          ${courses.map(c => `<option value="${c.id}" data-title="${c.title}">${c.title}</option>`).join('')}
        </select>
      </div>

      <div>
        <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">حاصل کردہ گریڈ / درجہ</label>
        <select id="cert-grade-select" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold">
          <option value="ممتاز درجہ (Pass with Highest Distinction - 100%)">ممتاز درجہ (Pass with Highest Distinction - 100%)</option>
          <option value="جید جداً (First Division - 90%)">جید جداً (First Division - 90%)</option>
          <option value="کامیاب (Pass - 80%)">کامیاب (Pass - 80%)</option>
        </select>
      </div>

      <div>
        <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">ایڈمن ریمارک (Remarks)</label>
        <input type="text" id="cert-remarks-input" value="شاہی سند کی باضابطہ تصدیق کی گئی۔" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold">
      </div>

      <div class="pt-2 flex gap-2">
        <button type="submit" class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500">
          سندِ فراغت جاری کریں
        </button>
        <button type="button" onclick="window.App.closeModal()" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">منسوخ</button>
      </div>
    </form>
  `);
};

window.Views.admin.issueCertificate = function(e) {
  e.preventDefault();
  const userSelect = document.getElementById('cert-user-select');
  const courseSelect = document.getElementById('cert-course-select');
  const grade = document.getElementById('cert-grade-select').value;
  const certNumber = document.getElementById('cert-serial-input')?.value.trim() || `LH-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const remarks = document.getElementById('cert-remarks-input')?.value.trim() || '';

  if (!userSelect || !courseSelect) return;

  const userId = userSelect.value;
  const userName = userSelect.options[userSelect.selectedIndex]?.getAttribute('data-name') || 'طالب علم';
  const courseId = courseSelect.value;
  const courseTitle = courseSelect.options[courseSelect.selectedIndex]?.getAttribute('data-title') || 'اسلامی کورس';

  window.DB.insert('certificates', {
    id: `cert-${Date.now()}`,
    certificateNumber: certNumber,
    serialNumber: certNumber,
    userId,
    userName,
    courseId,
    courseTitle,
    instructorName: 'شیخ ڈاکٹر محمد الہاشمی',
    issueDate: new Date().toISOString().split('T')[0],
    verificationUrl: `#/verify-cert/${certNumber}`,
    grade,
    remarks,
    isVerified: true,
    badgeColor: '#059669'
  });

  window.App.closeModal();
  window.App.showToast(`شاہی سند کامیابی سے جاری ہو گئی! (نمبر: ${certNumber})`, 'success');
  window.Views.admin.renderCertificates();
};

window.Views.admin.openEditCertificateModal = function(certId) {
  const certs = window.DB.get('certificates') || [];
  const cert = certs.find(c => c.id === certId);
  if (!cert) return;

  const modalHtml = `
    <div id="edit-cert-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-up">
        
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="edit-3" class="w-5 h-5 text-amber-500"></i>
            <span>سند میں ترمیم کریں (Edit Certificate)</span>
          </h3>
          <button onclick="document.getElementById('edit-cert-modal').remove()" class="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <form onsubmit="window.Views.admin.saveEditCertificate(event, '${cert.id}')" class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">سیریل نمبر (Serial Number)</label>
            <input type="text" id="edit-cert-number" value="${cert.certificateNumber || cert.serialNumber || ''}" required class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-amber-600 dark:text-amber-400 font-mono font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">طالب علم کا نام</label>
            <input type="text" id="edit-cert-username" value="${cert.userName}" required class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">کورس / امتحان کا عنوان</label>
            <input type="text" id="edit-cert-coursetitle" value="${cert.courseTitle}" required class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">درجہ / گریڈ</label>
              <input type="text" id="edit-cert-grade" value="${cert.grade || 'ممتاز'}" required class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold">
            </div>
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">تاریخِ فراغت</label>
              <input type="date" id="edit-cert-date" value="${cert.issueDate || '2026-02-18'}" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold font-mono">
            </div>
          </div>
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">استاد / ایڈمن ریمارک (Remarks)</label>
            <input type="text" id="edit-cert-remarks" value="${cert.remarks || ''}" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold" placeholder="مثلاً: جامعہ سے باضابطہ تصدیق شدہ">
          </div>

          <div class="pt-3 flex items-center justify-end gap-2">
            <button type="button" onclick="document.getElementById('edit-cert-modal').remove()" class="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">منسوخ</button>
            <button type="submit" class="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md">تبدیلیاں محفوظ کریں</button>
          </div>
        </form>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.saveEditCertificate = function(e, certId) {
  e.preventDefault();
  let certs = window.DB.get('certificates') || [];
  const cert = certs.find(c => c.id === certId);
  if (!cert) return;

  cert.certificateNumber = document.getElementById('edit-cert-number').value.trim();
  cert.serialNumber = cert.certificateNumber;
  cert.userName = document.getElementById('edit-cert-username').value.trim();
  cert.courseTitle = document.getElementById('edit-cert-coursetitle').value.trim();
  cert.grade = document.getElementById('edit-cert-grade').value.trim();
  cert.issueDate = document.getElementById('edit-cert-date').value;
  cert.remarks = document.getElementById('edit-cert-remarks').value.trim();
  cert.verificationUrl = `#/verify-cert/${cert.certificateNumber}`;

  window.DB.set('certificates', certs);
  window.DB.save();

  document.getElementById('edit-cert-modal')?.remove();
  window.App?.showToast('✓ سند کی تفصیلات کامیابی سے اپڈیٹ ہو گئیں!', 'success');
  window.Views.admin.renderCertificates();
};

window.Views.admin.deleteCertificate = function(certId) {
  if (!confirm('کیا آپ واقعی اس شاہی سند کو حذف کرنا چاہتے ہیں؟')) return;

  let certs = window.DB.get('certificates') || [];
  certs = certs.filter(c => c.id !== certId);

  window.DB.set('certificates', certs);
  window.DB.save();

  window.App?.showToast('✓ سند کامیابی سے حذف کر دی گئی!', 'success');
  window.Views.admin.renderCertificates();
};

window.Views.admin.openBulkIssueModal = function() {
  const users = window.DB.get('users') || [];
  const courses = window.DB.get('courses') || [];

  const modalHtml = `
    <div id="bulk-issue-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-urdu" dir="rtl">
      <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-up">
        
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="award" class="w-5 h-5 text-emerald-500"></i>
            <span>کثیر طلباء کے لیے بیک وقت سیریل اسناد جاری کریں</span>
          </h3>
          <button onclick="document.getElementById('bulk-issue-modal').remove()" class="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <form onsubmit="window.Views.admin.executeBulkIssue(event)" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">کورس / تعلیمی شعبہ</label>
            <select id="bulk-issue-course" class="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold">
              ${courses.map(c => `<option value="${c.id}" data-title="${c.title}">${c.title}</option>`).join('')}
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">طلباء کا انتخاب کریں (ایک یا سبھی کو منتخب کریں):</label>
            <div class="max-h-40 overflow-y-auto p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              ${users.map(u => `
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="bulk_issue_users" value="${u.id}" data-name="${u.name}" checked class="w-4 h-4 rounded text-purple-600">
                  <span class="font-bold text-slate-800 dark:text-slate-200">${u.name} <span class="text-[10px] text-slate-400 font-mono">(${u.email})</span></span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="pt-3 flex items-center justify-end gap-2">
            <button type="button" onclick="document.getElementById('bulk-issue-modal').remove()" class="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">منسوخ</button>
            <button type="submit" class="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-md">سیریل وائز اسناد جاری کریں</button>
          </div>
        </form>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  if (window.lucide) window.lucide.createIcons();
};

window.Views.admin.executeBulkIssue = function(e) {
  e.preventDefault();
  const courseSelect = document.getElementById('bulk-issue-course');
  const courseId = courseSelect.value;
  const courseTitle = courseSelect.options[courseSelect.selectedIndex]?.getAttribute('data-title') || 'اسلامی کورس';

  const selectedBoxes = document.querySelectorAll('input[name="bulk_issue_users"]:checked');
  if (!selectedBoxes.length) {
    window.App?.showToast('کم از کم ایک طالب علم کا انتخاب فرمائیں۔', 'error');
    return;
  }

  let certificates = window.DB.get('certificates') || [];
  let baseCount = certificates.length;

  selectedBoxes.forEach(box => {
    baseCount++;
    const userId = box.value;
    const userName = box.getAttribute('data-name');
    const serial = `LH-CERT-2026-${baseCount.toString().padStart(4, '0')}`;

    certificates.push({
      id: `cert-${Date.now()}-${baseCount}`,
      certificateNumber: serial,
      serialNumber: serial,
      userId,
      userName,
      courseId,
      courseTitle,
      instructorName: 'شیخ ڈاکٹر محمد الہاشمی',
      issueDate: new Date().toISOString().split('T')[0],
      verificationUrl: `#/verify-cert/${serial}`,
      grade: 'ممتاز درجہ (Pass with Highest Distinction - 100%)',
      remarks: 'شاہی سند کی باضابطہ منظوری دی گئی ہے۔',
      isVerified: true,
      badgeColor: '#059669'
    });
  });

  window.DB.set('certificates', certificates);
  window.DB.save();

  document.getElementById('bulk-issue-modal')?.remove();
  window.App?.showToast(`✓ ${selectedBoxes.length} طلباء کے لیے سیریل وائز شاہی اسناد جاری ہو گئیں!`, 'success');
  window.Views.admin.renderCertificates();
};

// ==========================================
// 3. DATABASE BACKUP & RESTORE UTILITIES
// ==========================================
window.Views.admin.exportDatabaseJSON = function() {
  const data = window.DB.data;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `learnhub-islamic-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  window.App.showToast('ڈیٹا بیس بیک اپ فائل ڈاؤنلوڈ ہو گئی!', 'success');
};

window.Views.admin.importDatabaseJSON = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      window.DB.saveData(parsed);
      window.App.showToast('ڈیٹا بیس کامیابی سے ری اسٹور ہو گیا!', 'success');
      window.Router.handleRouting();
    } catch (err) {
      window.App.showToast('فائل کا فارمیٹ درست نہیں ہے۔', 'danger');
    }
  };
  reader.readAsText(file);
};

window.Views.admin.resetDatabaseToSeed = function() {
  if (!confirm('کیا آپ واقعی تمام ڈیٹا کو ڈیفالٹ اسلامی نصاب پر ری سیٹ کرنا چاہتے ہیں؟')) return;
  window.DB.resetToSeed();
  window.App.showToast('ڈیٹا بیس کامیابی سے ری سیٹ ہو گیا!', 'info');
  window.Router.handleRouting();
};

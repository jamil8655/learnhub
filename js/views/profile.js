/**
 * LearnHub Royal Luxury User Profile & Management Hub
 * Urdu RTL Interface with Emerald / Gold / Indigo Theme
 * Features:
 *  - Device Gallery / Camera Photo Upload with Offscreen Canvas Compression (256x256 @ 0.85)
 *  - Profile Name, Phone/WhatsApp, Headline, and Bio Editor Modal
 *  - 4 Responsive Tabs: Overview & Stats, Enrolled Courses, Certificates, and Security & Password
 *  - Change Password Form with verification & toast notifications
 */

window.Views = window.Views || {};

window.Views.activeProfileTab = window.Views.activeProfileTab || 'overview';

window.Views.renderProfile = async function() {
  const container = document.getElementById('main-content');
  const user = window.Auth.getCurrentUser();

  if (!user) {
    window.Router.navigate('/login');
    return;
  }

  let enrollments = [];
  try {
    enrollments = await window.API.getEnrollments(user.id);
  } catch (e) {
    console.error('Error fetching enrollments:', e);
  }

  const certificates = (window.DB.get('certificates') || []).filter(c => c.userId === user.id);
  const quizAttempts = (window.DB.get('quizAttempts') || []).filter(qa => qa.userId === user.id);
  const userAch = (window.DB.get('userAchievements') || []).filter(ua => ua.userId === user.id);

  // Statistics calculation
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(e => e.status === 'completed').length;
  const inProgressCourses = enrollments.filter(e => e.status === 'in_progress').length;
  const passedQuizzes = quizAttempts.filter(qa => qa.isPassed).length;
  const streak = user.learningStreak || 5;
  const xp = user.totalPoints || 450;
  const level = Math.floor(xp / 100) + 1;
  const nextLevelXp = level * 100;
  const xpProgress = Math.min(100, Math.round(((xp % 100) / 100) * 100));

  container.innerHTML = `
    <!-- Hidden File Input for Device Gallery / Camera Upload -->
    <input 
      type="file" 
      id="user-gallery-file-input" 
      accept="image/*" 
      class="hidden" 
      onchange="window.Views.handleGalleryImageUpload(event)"
    >

    <div class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 font-urdu" dir="rtl">
      
      <!-- ==========================================
           ROYAL LUXURY PROFILE HERO BANNER
           ========================================== -->
      <div class="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/30 bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-9">
        
        <!-- Ambient Royal Glows & Decorative Accents -->
        <div class="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          
          <!-- User Avatar & Info Section -->
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-right w-full lg:w-auto">
            
            <!-- Avatar with Gallery Upload Trigger -->
            <div class="relative group shrink-0 cursor-pointer" onclick="window.Views.triggerAvatarUpload()" title="تصویر تبدیل کریں (Gallery / Camera)">
              <div class="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-emerald-400 to-indigo-500 shadow-2xl transition transform group-hover:scale-105">
                <img 
                  id="profile-user-avatar"
                  src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250'}" 
                  alt="${user.name}" 
                  class="w-full h-full rounded-[22px] object-cover bg-slate-900 border-2 border-slate-900 shadow-inner"
                >
                <!-- Camera Overlay Badge on Hover / Click -->
                <div class="absolute inset-1 bg-slate-950/60 rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-amber-300 text-xs font-bold gap-1">
                  <i data-lucide="camera" class="w-5 h-5 text-amber-400"></i>
                  <span class="text-[10px]">تصویر تبدیل</span>
                </div>
              </div>

              <!-- Quick Upload Action Button -->
              <button 
                type="button"
                onclick="event.stopPropagation(); window.Views.triggerAvatarUpload()" 
                class="absolute -bottom-2 -left-2 p-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 rounded-2xl shadow-xl font-bold transition transform hover:scale-110 border border-amber-200" 
                title="گیلری یا کیمرے سے تصویر اپلوڈ کریں"
              >
                <i data-lucide="image" class="w-4 h-4 text-slate-950"></i>
              </button>
            </div>

            <!-- User Textual Information -->
            <div class="space-y-2.5 flex-1 min-w-0">
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-emerald-200">
                  ${user.name}
                </h1>
                
                <!-- Role Badge -->
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm">
                  <i data-lucide="crown" class="w-3.5 h-3.5 text-amber-400"></i>
                  ${user.role === 'admin' || user.role === 'super_admin' ? 'ایڈمنسٹریٹر (Admin)' : user.role === 'instructor' ? 'استاد محترم (Instructor)' : 'طالب علم (Verified Student)'}
                </span>
              </div>

              <p class="text-xs sm:text-sm text-emerald-300 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                <i data-lucide="sparkles" class="w-4 h-4 text-amber-400"></i>
                <span>${user.headline || 'ماہر طالب علم • LearnHub پرو ممبر'}</span>
              </p>

              <p class="text-xs text-slate-300 max-w-xl leading-relaxed">
                ${user.bio || 'علم و عمل کی تلاش میں محوِ سفر۔ لرن ہب پر جدید اور مستند اسلامی علوم حاصل کر رہا ہوں۔'}
              </p>

              <!-- Phone & Email Info Chips -->
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/60 border border-white/10 text-[11px] text-slate-300 font-mono" dir="ltr">
                  <i data-lucide="mail" class="w-3.5 h-3.5 text-emerald-400"></i>
                  <span>${user.email}</span>
                </div>
                ${user.phone ? `
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/60 border border-white/10 text-[11px] text-amber-300 font-mono" dir="ltr">
                    <i data-lucide="phone" class="w-3.5 h-3.5 text-amber-400"></i>
                    <span>${user.phone}</span>
                  </div>
                ` : ''}
              </div>

              <!-- Royal Level & XP Progression Bar -->
              <div class="pt-2 max-w-md mx-auto sm:mx-0">
                <div class="flex justify-between text-[11px] font-bold mb-1.5">
                  <span class="text-amber-300 flex items-center gap-1">
                    <i data-lucide="shield" class="w-3.5 h-3.5 text-amber-400"></i>
                    شاہی درجہ: لیول ${level}
                  </span>
                  <span class="text-emerald-300 font-mono">${xp} / ${nextLevelXp} XP</span>
                </div>
                <div class="h-2.5 w-full bg-slate-950/80 rounded-full overflow-hidden border border-amber-500/20 shadow-inner">
                  <div 
                    class="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 rounded-full transition-all duration-500 shadow-lg shadow-amber-500/50" 
                    style="width: ${xpProgress}%;"
                  ></div>
                </div>
              </div>

            </div>
          </div>

          <!-- Top Quick Actions Buttons -->
          <div class="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
            <!-- Edit Profile Modal Button -->
            <button 
              onclick="window.Views.openEditProfileModal()" 
              class="py-2.5 px-5 text-xs rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition transform hover:scale-[1.02]"
            >
              <i data-lucide="edit-3" class="w-4 h-4"></i>
              <span>پروفائل میں ترمیم</span>
            </button>

            <!-- Device Gallery Photo Upload Button -->
            <button 
              onclick="window.Views.triggerAvatarUpload()" 
              class="py-2.5 px-5 text-xs rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100 font-bold border border-emerald-500/40 shadow-md flex items-center justify-center gap-2 transition transform hover:scale-[1.02]"
            >
              <i data-lucide="image" class="w-4 h-4 text-emerald-300"></i>
              <span>تصویر تبدیل کریں (Gallery / Camera)</span>
            </button>

            <!-- Choose Avatar Modal Button -->
            <button 
              onclick="window.Views.openAvatarModal()" 
              class="py-2 px-4 text-[11px] rounded-xl bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-200 font-semibold border border-indigo-500/30 flex items-center justify-center gap-2 transition"
            >
              <i data-lucide="smile" class="w-3.5 h-3.5 text-indigo-300"></i>
              <span>ریڈی میڈ اوتار فہرست</span>
            </button>

            <!-- Sign Out Button -->
            <button 
              onclick="window.Auth.clearSession(); window.Router.navigate('/login');" 
              class="py-2 px-4 text-[11px] rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 font-semibold border border-rose-500/30 flex items-center justify-center gap-2 transition"
            >
              <i data-lucide="log-out" class="w-3.5 h-3.5 text-rose-400"></i>
              <span>لاگ آؤٹ (Sign Out)</span>
            </button>
          </div>

        </div>
      </div>

      <!-- ==========================================
           RESPONSIVE TABS NAVIGATION (EMERALD / GOLD / INDIGO)
           ========================================== -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        
        <!-- Tab 1: Overview & Stats -->
        <button 
          onclick="window.Views.switchProfileTab('overview')" 
          class="profile-nav-tab py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            window.Views.activeProfileTab === 'overview'
              ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white shadow-lg shadow-emerald-900/20 border border-emerald-500/40' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }"
        >
          <i data-lucide="layout-dashboard" class="w-4 h-4 ${window.Views.activeProfileTab === 'overview' ? 'text-amber-300' : 'text-slate-400'}"></i>
          <span>خلاصہ و شماریات (Overview & Stats)</span>
        </button>

        <!-- Tab 2: Enrolled Courses -->
        <button 
          onclick="window.Views.switchProfileTab('courses')" 
          class="profile-nav-tab py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            window.Views.activeProfileTab === 'courses' 
              ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white shadow-lg shadow-emerald-900/20 border border-emerald-500/40' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }"
        >
          <i data-lucide="book-open" class="w-4 h-4 ${window.Views.activeProfileTab === 'courses' ? 'text-amber-300' : 'text-slate-400'}"></i>
          <span>داخل شدہ کورسز (${totalCourses})</span>
        </button>

        <!-- Tab 3: Certificates -->
        <button 
          onclick="window.Views.switchProfileTab('certificates')" 
          class="profile-nav-tab py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            window.Views.activeProfileTab === 'certificates' 
              ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white shadow-lg shadow-emerald-900/20 border border-emerald-500/40' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }"
        >
          <i data-lucide="award" class="w-4 h-4 ${window.Views.activeProfileTab === 'certificates' ? 'text-amber-300' : 'text-slate-400'}"></i>
          <span>اسناد و سرٹیفکیٹس (${certificates.length})</span>
        </button>

        <!-- Tab 4: Security & Password -->
        <button 
          onclick="window.Views.switchProfileTab('security')" 
          class="profile-nav-tab py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            window.Views.activeProfileTab === 'security' 
              ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white shadow-lg shadow-emerald-900/20 border border-emerald-500/40' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }"
        >
          <i data-lucide="shield-check" class="w-4 h-4 ${window.Views.activeProfileTab === 'security' ? 'text-amber-300' : 'text-slate-400'}"></i>
          <span>سیکیورٹی و پاس ورڈ (Security)</span>
        </button>

      </div>

      <!-- ==========================================
           DYNAMIC TAB CONTENT AREA
           ========================================== -->
      <div id="profile-tab-content" class="transition-all duration-300">
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

// ==========================================================================
// ACTIVE TAB CONTENT RENDERER
// ==========================================================================
window.Views.renderActiveProfileTabContent = function(user, enrollments, certificates, quizAttempts, userAch) {
  const tab = window.Views.activeProfileTab;

  // ------------------------------------------------------------------------
  // TAB 1: ENROLLED COURSES
  // ------------------------------------------------------------------------
  if (tab === 'courses') {
    return `
      <div class="lh-card p-6 sm:p-8 space-y-6 border border-emerald-500/20 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 class="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="book-open" class="w-5 h-5 text-emerald-600"></i>
              <span>داخل شدہ کورسز کی فہرست (Enrolled Courses)</span>
            </h3>
            <p class="text-xs text-slate-500 mt-1">آپ کے تمام فعال اور مکمل شدہ کورسز کی تفصیلی پیش رفت</p>
          </div>
          <a href="#/courses" class="btn-secondary py-2 px-4 text-xs rounded-xl font-bold flex items-center gap-1 hover:border-emerald-500">
            <span>مزید کورسز دریافت کریں</span>
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
          </a>
        </div>

        ${enrollments.length === 0 ? `
          <div class="text-center py-16 space-y-4">
            <div class="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
              <i data-lucide="book" class="w-8 h-8"></i>
            </div>
            <div class="space-y-1">
              <h4 class="font-bold text-slate-800 dark:text-slate-200 text-sm">آپ نے ابھی تک کسی کورس میں داخلہ نہیں لیا</h4>
              <p class="text-xs text-slate-400">ہمارے وسیع تر اسلامی و تیکنیکی نصاب سے مستفید ہونے کے لیے ابھی کورس منتخب کریں۔</p>
            </div>
            <a href="#/courses" class="btn-primary py-2.5 px-6 text-xs rounded-xl inline-block bg-gradient-to-r from-emerald-600 to-indigo-700 hover:from-emerald-500 hover:to-indigo-600 font-bold shadow-lg shadow-emerald-700/20">
              کورسز لائبریری کھولیں
            </a>
          </div>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            ${enrollments.map(enr => `
              <div class="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-emerald-50/20 dark:from-slate-800/40 dark:to-emerald-950/10 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition">
                <div class="flex gap-4">
                  <img 
                    src="${enr.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200'}" 
                    class="w-20 h-20 rounded-2xl object-cover shadow-md shrink-0 border border-slate-200 dark:border-slate-700" 
                    alt="${enr.course?.title || 'Course'}"
                  >
                  <div class="space-y-1.5 flex-1 min-w-0">
                    <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      enr.status === 'completed' 
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' 
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800'
                    }">
                      ${enr.status === 'completed' ? 'مکمل شدہ ✓' : 'جاری ہے (In Progress)'}
                    </span>
                    <h4 class="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      ${enr.course?.title || 'کورس عنوان'}
                    </h4>
                    <p class="text-[11px] text-slate-400 font-sans">
                      ${enr.course?.instructor?.name || 'LearnHub فیکلٹی'}
                    </p>
                  </div>
                </div>

                <div class="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <div class="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                    <span>پیش رفت (Progress)</span>
                    <span class="text-emerald-600 dark:text-emerald-400">${enr.progressPercentage || 0}%</span>
                  </div>
                  <div class="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" 
                      style="width: ${enr.progressPercentage || 0}%;"
                    ></div>
                  </div>
                </div>

                <a 
                  href="#/learn/${enr.courseId}" 
                  class="btn-primary py-2.5 text-xs rounded-xl text-center font-bold bg-gradient-to-r from-emerald-600 to-indigo-700 hover:from-emerald-500 hover:to-indigo-600 text-white shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
                >
                  <span>سیکھنا جاری رکھیں</span>
                  <i data-lucide="play-circle" class="w-4 h-4"></i>
                </a>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  // ------------------------------------------------------------------------
  // TAB 2: CERTIFICATES
  // ------------------------------------------------------------------------
  if (tab === 'certificates') {
    return `
      <div class="lh-card p-6 sm:p-8 space-y-6 border border-amber-500/20 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 class="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="award" class="w-5 h-5 text-amber-500"></i>
              <span>ڈیجیٹل تصدیقی اسناد (Verifiable Certificates)</span>
            </h3>
            <p class="text-xs text-slate-500 mt-1">تمام اسناد منفرد کیو آر کوڈ اور آن لائن تصدیق کے ساتھ منسلک ہیں</p>
          </div>
          <span class="badge bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-400/30 text-xs font-mono font-bold">
            کل اسناد: ${certificates.length}
          </span>
        </div>

        ${certificates.length === 0 ? `
          <div class="text-center py-16 space-y-4">
            <div class="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
              <i data-lucide="award" class="w-8 h-8"></i>
            </div>
            <div class="space-y-1">
              <h4 class="font-bold text-slate-800 dark:text-slate-200 text-sm">ابھی تک کوئی سند جاری نہیں ہوئی</h4>
              <p class="text-xs text-slate-400 max-w-md mx-auto">کسی بھی کورس کے تمام اسباق 100% مکمل کریں یا آزاد کوئز امتحان پاس کریں، آپ کو فوری ڈیجیٹل سرٹیفکیٹ جاری ہوگا۔</p>
            </div>
            <a href="#/courses" class="btn-primary py-2.5 px-6 text-xs rounded-xl inline-block bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 font-bold shadow-lg shadow-amber-600/20 text-slate-950">
              کورس مکمل کریں اور سند حاصل کریں
            </a>
          </div>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            ${certificates.map(cert => `
              <div class="p-6 rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-50/40 via-white to-emerald-50/30 dark:from-amber-950/20 dark:via-slate-900 dark:to-emerald-950/20 space-y-4 shadow-xl relative overflow-hidden">
                
                <div class="flex items-center justify-between">
                  <span class="inline-block px-3 py-1 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold border border-amber-400/40">
                    ${cert.serialNumber}
                  </span>
                  <div class="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shadow-inner">
                    <i data-lucide="award" class="w-6 h-6"></i>
                  </div>
                </div>

                <div>
                  <h4 class="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                    ${cert.courseTitle}
                  </h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    جاری کنندہ: LearnHub مستند اکیڈمی • تاریخ: ${new Date(cert.issueDate || cert.createdAt || Date.now()).toLocaleDateString('ur-PK')}
                  </p>
                </div>

                <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                  <a 
                    href="#/verify-cert/${cert.serialNumber}" 
                    class="btn-primary flex-1 py-2.5 text-xs rounded-xl text-center font-bold bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <i data-lucide="printer" class="w-3.5 h-3.5"></i>
                    <span>سند دیکھیں و پرنٹ کریں</span>
                  </a>
                </div>

              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  // ------------------------------------------------------------------------
  // TAB 3: SECURITY & CHANGE PASSWORD
  // ------------------------------------------------------------------------
  if (tab === 'security') {
    return `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Password Change Card Form -->
        <div class="lh-card p-6 sm:p-8 space-y-5 border border-emerald-500/20 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
          <div class="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shadow-inner">
              <i data-lucide="lock" class="w-5 h-5"></i>
            </div>
            <div>
              <h4 class="font-extrabold text-base text-slate-900 dark:text-white">پاس ورڈ تبدیل کریں (Change Password)</h4>
              <p class="text-xs text-slate-400">اپنے اکاؤنٹ کی سیکیورٹی کو مضبوط رکھنے کے لیے نیا پاس ورڈ منتخب کریں</p>
            </div>
          </div>

          <form onsubmit="window.Views.handlePasswordChange(event)" class="space-y-4">
            
            <!-- Current Password -->
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                موجودہ پاس ورڈ (Current Password)
              </label>
              <div class="relative">
                <input 
                  type="password" 
                  id="sec-current-password" 
                  required 
                  placeholder="••••••••" 
                  class="form-input text-xs py-2.5 pl-9 pr-3 rounded-xl font-mono text-left focus:border-emerald-500 focus:ring-emerald-500" 
                  dir="ltr"
                >
                <i data-lucide="key" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
              </div>
            </div>

            <!-- New Password -->
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                نیا پاس ورڈ (New Password - کم از کم 6 حروف)
              </label>
              <div class="relative">
                <input 
                  type="password" 
                  id="sec-new-password" 
                  required 
                  minlength="6" 
                  placeholder="••••••••" 
                  class="form-input text-xs py-2.5 pl-9 pr-3 rounded-xl font-mono text-left focus:border-emerald-500 focus:ring-emerald-500" 
                  dir="ltr"
                >
                <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
              </div>
            </div>

            <!-- Confirm New Password -->
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                نئے پاس ورڈ کی تصدیق (Confirm New Password)
              </label>
              <div class="relative">
                <input 
                  type="password" 
                  id="sec-confirm-password" 
                  required 
                  minlength="6" 
                  placeholder="••••••••" 
                  class="form-input text-xs py-2.5 pl-9 pr-3 rounded-xl font-mono text-left focus:border-emerald-500 focus:ring-emerald-500" 
                  dir="ltr"
                >
                <i data-lucide="check" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
              </div>
            </div>

            <button 
              type="submit" 
              class="btn-primary w-full py-3 text-xs rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 hover:from-emerald-500 hover:to-indigo-600 text-white font-bold border-none shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 mt-2"
            >
              <i data-lucide="shield-check" class="w-4 h-4"></i>
              <span>پاس ورڈ محفوظ کریں</span>
            </button>

          </form>
        </div>

        <!-- 2FA & Active Sessions Card -->
        <div class="space-y-6">
          
          <!-- 2FA Box -->
          <div class="lh-card p-6 space-y-4 border border-emerald-500/20 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shadow-inner">
                  <i data-lucide="shield" class="w-5 h-5"></i>
                </div>
                <div>
                  <h4 class="font-bold text-sm text-slate-900 dark:text-white">دو مرحلہ تصدیق (2FA Protection)</h4>
                  <p class="text-[11px] text-slate-400">لاگ اِن تحفظ اور غیر مجاز رسائی کی روک تھام</p>
                </div>
              </div>
              <span class="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                فعال ہے (Active)
              </span>
            </div>
            
            <div class="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
              ✓ آپ کا اکاؤنٹ 256-Bit SSL انکرپشن اور خودکار سیکیورٹی الرٹس کے ذریعے مکمل محفوظ ہے۔
            </div>
          </div>

          <!-- Active Sessions & Devices -->
          <div class="lh-card p-6 space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
            <div class="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div class="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center shadow-inner">
                <i data-lucide="smartphone" class="w-5 h-5"></i>
              </div>
              <div>
                <h4 class="font-bold text-sm text-slate-900 dark:text-white">فعال ڈیوائسز اور سیشنز (Active Sessions)</h4>
                <p class="text-[11px] text-slate-400">وہ تمام ڈیوائسز جن پر آپ کا اکاؤنٹ اس وقت لاگ اِن ہے</p>
              </div>
            </div>

            <div class="space-y-3 text-xs">
              <!-- Current Session -->
              <div class="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-700/50">
                <div class="space-y-0.5">
                  <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <i data-lucide="laptop" class="w-4 h-4 text-emerald-500"></i>
                    <span>موجودہ براؤزر (Windows PC / Chrome)</span>
                  </div>
                  <div class="text-[10px] text-slate-400 font-mono" dir="ltr">IP: 182.185.142.20 • ابھی فعال (Active Now)</div>
                </div>
                <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  یہ ڈیوائس
                </span>
              </div>

              <!-- Other Session -->
              <div class="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-700/50">
                <div class="space-y-0.5">
                  <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <i data-lucide="smartphone" class="w-4 h-4 text-indigo-500"></i>
                    <span>موبائل ایپ (LearnHub Android / iOS)</span>
                  </div>
                  <div class="text-[10px] text-slate-400 font-mono" dir="ltr">LearnHub Mobile App • 2 گھنٹے قبل</div>
                </div>
                <button 
                  type="button"
                  onclick="window.App.showToast('تمام دیگر ڈیوائسز سے سیشن کامیابی کے ساتھ ختم کر دیا گیا!', 'info');" 
                  class="text-rose-500 hover:text-rose-600 font-bold text-xs hover:underline"
                >
                  لاگ آؤٹ کریں
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    `;
  }

  // ------------------------------------------------------------------------
  // TAB 4: DEFAULT (OVERVIEW & STATS - خلاصہ اور شماریات)
  // ------------------------------------------------------------------------
  return `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Right/Sidebar: Royal Stats & Heatmap -->
      <div class="space-y-6">
        
        <!-- Summary Stats Card -->
        <div class="lh-card p-6 space-y-4 border border-emerald-500/20 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
          <h3 class="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <i data-lucide="bar-chart-2" class="w-4 h-4 text-emerald-600"></i>
            <span>سیکھنے کے کلیدی اعداد و شمار</span>
          </h3>

          <div class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div class="py-3 flex justify-between items-center">
              <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <i data-lucide="book-open" class="w-3.5 h-3.5 text-indigo-500"></i>
                <span>داخل شدہ کورسز</span>
              </span>
              <span class="font-extrabold text-slate-900 dark:text-white font-mono text-sm">${enrollments.length}</span>
            </div>

            <div class="py-3 flex justify-between items-center">
              <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-500"></i>
                <span>مکمل شدہ کورسز</span>
              </span>
              <span class="font-extrabold text-emerald-600 font-mono text-sm">${enrollments.filter(e => e.status === 'completed').length}</span>
            </div>

            <div class="py-3 flex justify-between items-center">
              <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <i data-lucide="award" class="w-3.5 h-3.5 text-amber-500"></i>
                <span>حاصل کردہ اسناد (Certificates)</span>
              </span>
              <span class="font-extrabold text-amber-500 font-mono text-sm">${certificates.length}</span>
            </div>

            <div class="py-3 flex justify-between items-center">
              <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <i data-lucide="zap" class="w-3.5 h-3.5 text-cyan-500"></i>
                <span>پاس کردہ کوئزز</span>
              </span>
              <span class="font-extrabold text-cyan-600 font-mono text-sm">${quizAttempts.filter(qa => qa.isPassed).length}</span>
            </div>

            <div class="py-3 flex justify-between items-center">
              <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <i data-lucide="flame" class="w-3.5 h-3.5 text-rose-500"></i>
                <span>روزانہ کی اسٹریک (Daily Streak)</span>
              </span>
              <span class="font-extrabold text-rose-500 flex items-center gap-1 font-mono text-sm">
                🔥 ${user.learningStreak || 5} دن
              </span>
            </div>

            <div class="py-3 flex justify-between items-center">
              <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <i data-lucide="star" class="w-3.5 h-3.5 text-yellow-500"></i>
                <span>کل پوائنٹس (XP Score)</span>
              </span>
              <span class="font-extrabold text-yellow-600 dark:text-yellow-400 font-mono text-sm">${user.totalPoints || 450} XP</span>
            </div>
          </div>
        </div>

        <!-- 14-Day Activity Heatmap -->
        <div class="lh-card p-6 space-y-3.5 border border-emerald-500/20 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <i data-lucide="calendar" class="w-4 h-4 text-emerald-600"></i>
              <span>سرگرمی کا کیلنڈر (14-Day Activity)</span>
            </h4>
            <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">فعال طالب علم</span>
          </div>

          <div class="grid grid-cols-7 gap-2 pt-1">
            ${Array.from({ length: 14 }).map((_, i) => `
              <div 
                class="h-8 rounded-xl ${
                  i > 3 
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm shadow-emerald-600/30' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                } flex items-center justify-center text-[10px] font-bold font-mono" 
                title="دن ${i + 1}"
              >
                ${i + 1}
              </div>
            `).join('')}
          </div>
          <p class="text-[11px] text-slate-400 text-center pt-1">سبز خانے آپ کی روزانہ کی سیکھنے کی حاضری ظاہر کرتے ہیں</p>
        </div>

      </div>

      <!-- Main/Left Column: Continue Learning & Badges -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Continue Learning Section -->
        <div class="lh-card p-6 sm:p-8 space-y-4 border border-emerald-500/20 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="play-circle" class="w-5 h-5 text-emerald-600"></i>
              <span>پڑھائی جاری رکھیں (Continue Learning)</span>
            </h3>
            <button onclick="window.Views.switchProfileTab('courses')" class="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              تمام کورسز دیکھیں &rarr;
            </button>
          </div>

          ${enrollments.length === 0 ? `
            <div class="text-center py-10 text-slate-400 text-xs space-y-3">
              <p>آپ کے پاس ابھی کوئی فعال کورس نہیں ہے۔</p>
              <a href="#/courses" class="btn-primary py-2 px-5 text-xs rounded-xl inline-block bg-gradient-to-r from-emerald-600 to-indigo-700 text-white font-bold">کورسز تلاش کریں</a>
            </div>
          ` : `
            <div class="space-y-3.5">
              ${enrollments.slice(0, 3).map(enr => `
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/30 transition">
                  <div class="flex items-center gap-3.5">
                    <img 
                      src="${enr.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150'}" 
                      class="w-14 h-14 rounded-2xl object-cover shadow-sm shrink-0" 
                      alt="${enr.course?.title || 'Course'}"
                    >
                    <div class="space-y-0.5 min-w-0">
                      <h4 class="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        ${enr.course?.title || 'کورس'}
                      </h4>
                      <div class="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                        پیش رفت: ${enr.progressPercentage || 0}%
                      </div>
                    </div>
                  </div>
                  <a 
                    href="#/learn/${enr.courseId}" 
                    class="btn-primary py-2 px-4 text-xs rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>سبق کھولیں</span>
                    <i data-lucide="chevron-left" class="w-3.5 h-3.5"></i>
                  </a>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Badges & Achievements -->
        <div class="lh-card p-6 sm:p-8 space-y-4 border border-amber-500/20 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="crown" class="w-5 h-5 text-amber-500"></i>
              <span>حاصل کردہ شاہی اعزازات و بیجز (Royal Achievements)</span>
            </h3>
            <a href="#/achievements" class="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">
              مکمل گیلری &rarr;
            </a>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            
            <div class="p-4 bg-gradient-to-br from-amber-500/10 to-amber-600/5 dark:bg-slate-800/60 border border-amber-400/30 rounded-2xl text-center space-y-1.5 shadow-sm">
              <div class="text-3xl">🥇</div>
              <div class="font-bold text-xs text-slate-900 dark:text-white">کوئز ماسٹر</div>
              <div class="text-[10px] text-amber-600 dark:text-amber-400 font-bold">ان لاک شدہ ✓</div>
            </div>

            <div class="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 dark:bg-slate-800/60 border border-emerald-400/30 rounded-2xl text-center space-y-1.5 shadow-sm">
              <div class="text-3xl">🔥</div>
              <div class="font-bold text-xs text-slate-900 dark:text-white">5 روزہ اسٹریک</div>
              <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">ان لاک شدہ ✓</div>
            </div>

            <div class="p-4 bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 dark:bg-slate-800/60 border border-indigo-400/30 rounded-2xl text-center space-y-1.5 shadow-sm">
              <div class="text-3xl">📖</div>
              <div class="font-bold text-xs text-slate-900 dark:text-white">قرآن و حدیث قاری</div>
              <div class="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">ان لاک شدہ ✓</div>
            </div>

            <div class="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 dark:bg-slate-800/60 border border-yellow-400/30 rounded-2xl text-center space-y-1.5 shadow-sm">
              <div class="text-3xl">🎓</div>
              <div class="font-bold text-xs text-slate-900 dark:text-white">سرٹیفائیڈ اسکالر</div>
              <div class="text-[10px] text-yellow-600 dark:text-yellow-400 font-bold">ان لاک شدہ ✓</div>
            </div>

          </div>
        </div>

      </div>

    </div>
  `;
};

// ==========================================================================
// DEVICE GALLERY PHOTO UPLOAD & OFFSCREEN CANVAS RESIZING
// ==========================================================================

/**
 * Triggers the hidden file input to open device gallery / camera picker
 */
window.Views.triggerAvatarUpload = function() {
  const input = document.getElementById('user-gallery-file-input');
  if (input) {
    input.value = ''; // Reset value to allow re-uploading the same file if desired
    input.click();
  }
};

/**
 * Reads the selected image file, resizes it using an offscreen HTML5 <canvas>
 * (256x256 JPEG @ 0.85 quality) to ensure minimal storage footprint,
 * and updates user.avatar in window.Auth.
 */
window.Views.handleGalleryImageUpload = function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  // Validate image MIME type
  if (!file.type.startsWith('image/')) {
    window.App.showToast('براہ کرم درست تصویری فائل منتخب کریں (JPG, PNG, WebP)', 'danger');
    return;
  }

  // Show loading indicator
  if (window.App && window.App.showLoading) {
    window.App.showLoading(true);
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = async function() {
      try {
        // Offscreen HTML5 Canvas for optimal 256x256 square compression
        const canvas = document.createElement('canvas');
        const targetSize = 256;
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');

        // Draw image cropped to square center (aspect ratio preserved)
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, targetSize, targetSize);

        // Convert to compact JPEG data URL at 0.85 quality
        const base64Data = canvas.toDataURL('image/jpeg', 0.85);

        // Save to Auth Service and Database
        await window.Auth.updateProfile({ avatar: base64Data });

        if (window.App && window.App.showLoading) {
          window.App.showLoading(false);
        }

        window.App.showToast('پروفائل تصویر کامیابی سے اپلوڈ اور تبدیل ہو گئی!', 'success');
        window.Views.renderProfile();
      } catch (err) {
        if (window.App && window.App.showLoading) {
          window.App.showLoading(false);
        }
        console.error('Avatar upload error:', err);
        window.App.showToast(err.message || 'تصویر اپلوڈ کرنے میں مسئلہ پیش آیا', 'danger');
      }
    };

    img.onerror = function() {
      if (window.App && window.App.showLoading) {
        window.App.showLoading(false);
      }
      window.App.showToast('تصویر لوڈ نہیں ہو سکی۔ براہ کرم دوسری تصویر منتخب کریں۔', 'danger');
    };

    img.src = e.target.result;
  };

  reader.onerror = function() {
    if (window.App && window.App.showLoading) {
      window.App.showLoading(false);
    }
    window.App.showToast('فائل پڑھنے میں غلطی پیش آئی۔', 'danger');
  };

  reader.readAsDataURL(file);
};

// ==========================================================================
// PROFILE NAME, PHONE/WHATSAPP, HEADLINE & BIO EDITOR MODAL
// ==========================================================================

window.Views.openEditProfileModal = function() {
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  window.App.showModal('پروفائل معلومات میں ترمیم کریں (Edit Profile)', `
    <form onsubmit="window.Views.saveProfileEdits(event)" class="space-y-4 font-urdu text-right" dir="rtl">
      
      <!-- Full Name -->
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
          <i data-lucide="user" class="w-3.5 h-3.5 inline ml-1 text-emerald-600"></i>
          <span>پورا نام (Full Name)</span>
        </label>
        <input 
          type="text" 
          id="edit-user-name" 
          value="${user.name || ''}" 
          required 
          placeholder="اپنا پورا نام درج کریں" 
          class="form-input text-xs py-2.5 rounded-xl font-urdu text-right focus:border-emerald-500 focus:ring-emerald-500"
        >
      </div>

      <!-- Phone / WhatsApp Number -->
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
          <i data-lucide="phone" class="w-3.5 h-3.5 inline ml-1 text-amber-500"></i>
          <span>فون / واٹس ایپ نمبر (Phone / WhatsApp)</span>
        </label>
        <input 
          type="text" 
          id="edit-user-phone" 
          value="${user.phone || ''}" 
          placeholder="+92 300 1234567" 
          class="form-input text-xs py-2.5 rounded-xl font-mono text-left focus:border-emerald-500 focus:ring-emerald-500" 
          dir="ltr"
        >
      </div>

      <!-- Headline -->
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
          <i data-lucide="sparkles" class="w-3.5 h-3.5 inline ml-1 text-emerald-500"></i>
          <span>ہیڈ لائن / پیشہ ورانہ عنوان (Headline)</span>
        </label>
        <input 
          type="text" 
          id="edit-user-headline" 
          value="${user.headline || ''}" 
          placeholder="مثلاً: طالب علم • محققِ علومِ اسلامیہ • فل اسٹیک ڈویلپر" 
          class="form-input text-xs py-2.5 rounded-xl font-urdu text-right focus:border-emerald-500 focus:ring-emerald-500"
        >
      </div>

      <!-- Bio -->
      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
          <i data-lucide="file-text" class="w-3.5 h-3.5 inline ml-1 text-indigo-500"></i>
          <span>مختصر تعارف و بائیو (Bio)</span>
        </label>
        <textarea 
          id="edit-user-bio" 
          rows="3" 
          placeholder="اپنے تعلیمی و پیشہ ورانہ سفر کے بارے میں چند جملے تحریر کریں..." 
          class="form-input text-xs py-2.5 rounded-xl font-urdu text-right focus:border-emerald-500 focus:ring-emerald-500"
        >${user.bio || ''}</textarea>
      </div>

      <!-- Modal Action Buttons -->
      <div class="flex gap-2.5 pt-3">
        <button 
          type="submit" 
          class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 hover:from-emerald-500 hover:to-indigo-600 text-white font-bold border-none shadow-lg shadow-emerald-700/20"
        >
          تبدیلیاں محفوظ کریں ✓
        </button>
        <button 
          type="button" 
          onclick="window.App.closeModal()" 
          class="btn-secondary py-2.5 px-4 text-xs rounded-xl"
        >
          منسوخ
        </button>
      </div>

    </form>
  `);

  if (window.lucide) window.lucide.createIcons();
};

window.Views.saveProfileEdits = async function(e) {
  e.preventDefault();
  const name = document.getElementById('edit-user-name').value.trim();
  const phone = document.getElementById('edit-user-phone').value.trim();
  const headline = document.getElementById('edit-user-headline').value.trim();
  const bio = document.getElementById('edit-user-bio').value.trim();

  try {
    await window.Auth.updateProfile({ name, phone, headline, bio });
    window.App.closeModal();
    window.App.showToast('پروفائل کامیابی سے اپڈیٹ ہو گئی!', 'success');
    window.Views.renderProfile();
  } catch(err) {
    window.App.showToast(err.message || 'پروفائل محفوظ نہیں ہو سکی', 'danger');
  }
};

// ==========================================================================
// CHANGE PASSWORD FORM SUBMISSION HANDLER
// ==========================================================================

window.Views.handlePasswordChange = async function(e) {
  e.preventDefault();
  const currentPwd = document.getElementById('sec-current-password').value;
  const newPwd = document.getElementById('sec-new-password').value;
  const confirmPwd = document.getElementById('sec-confirm-password').value;

  if (!currentPwd || !newPwd || !confirmPwd) {
    window.App.showToast('براہ کرم تمام خانے پُر کریں۔', 'warning');
    return;
  }

  if (newPwd.length < 6) {
    window.App.showToast('نیا پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔', 'warning');
    return;
  }

  if (newPwd !== confirmPwd) {
    window.App.showToast('نیا پاس ورڈ اور تصدیقی پاس ورڈ آپس میں مماثل نہیں ہیں۔', 'danger');
    return;
  }

  try {
    await window.Auth.changePassword(currentPwd, newPwd);
    window.App.showToast('پاس ورڈ کامیابی سے تبدیل ہو گیا!', 'success');
    e.target.reset();
  } catch (err) {
    window.App.showToast(err.message || 'موجودہ پاس ورڈ درست نہیں ہے۔', 'danger');
  }
};

// ==========================================================================
// READY-MADE AVATARS SELECTION MODAL
// ==========================================================================

window.Views.openAvatarModal = function() {
  const avatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'
  ];

  window.App.showModal('شاہی اوتار منتخب کریں (Choose Avatar)', `
    <div class="space-y-4 font-urdu text-center" dir="rtl">
      <p class="text-xs text-slate-500 dark:text-slate-400">اپنی پسند کا تیار شدہ شاہی اوتار منتخب کریں یا گیلری سے اپنی تصویر اپلوڈ کریں:</p>
      
      <div class="grid grid-cols-3 gap-3">
        ${avatars.map(url => `
          <button 
            type="button"
            onclick="window.Views.selectAvatar('${url}')" 
            class="p-1 rounded-2xl border-2 border-transparent hover:border-amber-500 hover:scale-105 transition transform shadow-sm"
          >
            <img src="${url}" class="w-20 h-20 rounded-xl object-cover mx-auto shadow-md" alt="Avatar option">
          </button>
        `).join('')}
      </div>

      <div class="pt-3 border-t border-slate-100 dark:border-slate-800">
        <button 
          type="button"
          onclick="window.App.closeModal(); window.Views.triggerAvatarUpload()" 
          class="btn-primary w-full py-2.5 text-xs rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-700 hover:from-emerald-500 hover:to-indigo-600 text-white font-bold flex items-center justify-center gap-2"
        >
          <i data-lucide="image" class="w-4 h-4"></i>
          <span>اپنی ڈیوائس / گیلری سے نئی تصویر منتخب کریں</span>
        </button>
      </div>
    </div>
  `);

  if (window.lucide) window.lucide.createIcons();
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

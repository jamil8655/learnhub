/**
 * LearnHub Royal Luxury User Profile & Management Hub
 * Urdu RTL Interface with Emerald / Gold / Indigo Theme
 * Features:
 *  - Profile Completion Meter Widget (Avatar, Bio, Phone, Email, 2FA)
 *  - Device Gallery / Camera Photo Upload with Offscreen Canvas Compression (256x256 @ 0.85)
 *  - Profile Name, Phone/WhatsApp, Headline, and Bio Editor Modal
 *  - 4 Responsive Tabs: Overview & Stats, Enrolled Courses, Certificates, and Security & Password
 *  - Comprehensive Security Management:
 *      * Change Password Form with live validation & strength meter
 *      * 2FA Management (Toggle, TOTP Secret / QR Modal, 8 Backup Recovery Codes viewer & downloader)
 *      * Active Sessions Manager (Device list, Current Session badge, Single & Bulk device revocation)
 *      * Change Email Form with current password verification
 *      * Account Deactivation & Permanent Deletion with confirmation modals
 */

window.Views = window.Views || {};

window.Views.activeProfileTab = window.Views.activeProfileTab || 'overview';

// ==========================================================================
// PROFILE COMPLETION CALCULATOR & HELPERS
// ==========================================================================
window.Views.calculateProfileCompletion = function(user) {
  if (!user) return { percent: 0, items: [] };

  const items = [
    {
      id: 'avatar',
      label: 'پروفائل تصویر اپلوڈ',
      desc: 'اپنی تصویر یا شاہی اوتار منتخب کریں',
      completed: !!(user.avatar && !user.avatar.includes('default') && user.avatar.length > 5),
      weight: 20,
      icon: 'camera',
      action: 'window.Views.triggerAvatarUpload()'
    },
    {
      id: 'bio',
      label: 'مختصر بائیو اور ہیڈ لائن',
      desc: 'اپنا تعلیمی و تحقیقی تعارف شامل کریں',
      completed: !!(user.bio && user.bio.trim().length > 10 && user.headline && user.headline.trim().length > 3),
      weight: 20,
      icon: 'file-text',
      action: 'window.Views.openEditProfileModal()'
    },
    {
      id: 'phone',
      label: 'فون / واٹس ایپ نمبر کی تصدیق',
      desc: 'SMS اور اہم نوٹیفکیشنز کے لیے فعال نمبر',
      completed: !!(user.phone && user.phone.trim().length >= 8),
      weight: 20,
      icon: 'phone',
      action: 'window.Views.openEditProfileModal()'
    },
    {
      id: 'email',
      label: 'ای میل ایڈریس کی تصدیق',
      desc: 'تصدیق شدہ پرائمری ای میل رابطہ',
      completed: !!(user.email && user.email.includes('@') && user.emailVerified !== false),
      weight: 20,
      icon: 'mail',
      action: 'window.Views.switchProfileTab("security")'
    },
    {
      id: '2fa',
      label: 'دو مرحلہ تصدیق (2FA Protection)',
      desc: 'اکاؤنٹ کے غیر مجاز لاگ اِن کا تحفظ',
      completed: !!(user.twoFactorEnabled === true),
      weight: 20,
      icon: 'shield-check',
      action: 'window.Views.switchProfileTab("security")'
    }
  ];

  const earned = items.reduce((acc, item) => item.completed ? acc + item.weight : acc, 0);
  return { percent: earned, items };
};

// ==========================================================================
// DEFAULT SESSIONS GENERATOR & RETRIEVER
// ==========================================================================
window.Views.getUserActiveSessions = function(userId) {
  const key = `learnhub_sessions_${userId}`;
  let sessions = [];
  try {
    const raw = localStorage.getItem(key);
    if (raw) sessions = JSON.parse(raw);
  } catch (e) {
    console.warn('Error loading sessions:', e);
  }

  // Also check database sessions if available
  if (window.DB && typeof window.DB.get === 'function') {
    const dbSessions = (window.DB.get('sessions') || []).filter(s => s && s.userId === userId && s.isValid !== false);
    if (dbSessions.length > 0) {
      return dbSessions.map(s => ({
        ...s,
        isCurrent: s.token === (localStorage.getItem('learnhub_session_token') || sessionStorage.getItem('learnhub_session_token')) || s.current === true || s.isCurrent === true,
        lastActive: s.lastActiveAt ? new Date(s.lastActiveAt).toLocaleTimeString('ur-PK') : (s.lastActive || 'ابھی فعال (Active Now)'),
        icon: s.device?.includes('Mobile') || s.device?.includes('Android') || s.device?.includes('iOS') ? 'smartphone' : (s.device?.includes('iPad') || s.device?.includes('Tablet') ? 'tablet' : 'laptop')
      }));
    }
  }

  if (!sessions || sessions.length === 0) {
    // Generate standard realistic initial session set
    sessions = [
      {
        id: `sess-${Date.now()}-1`,
        device: 'Windows PC (Chrome 122)',
        os: 'Windows 11 64-bit',
        browser: 'Google Chrome',
        ip: '182.185.142.20',
        location: 'لاہور، پاکستان (Lahore, PK)',
        lastActive: 'ابھی فعال (Active Now)',
        isCurrent: true,
        icon: 'laptop'
      },
      {
        id: `sess-${Date.now()}-2`,
        device: 'LearnHub Mobile App (Android)',
        os: 'Android 14 / One UI 6',
        browser: 'LearnHub Mobile PWA',
        ip: '175.107.214.88',
        location: 'اسلام آباد، پاکستان (Islamabad, PK)',
        lastActive: '2 گھنٹے قبل (2 hours ago)',
        isCurrent: false,
        icon: 'smartphone'
      },
      {
        id: `sess-${Date.now()}-3`,
        device: 'Apple iPad Pro (Safari)',
        os: 'iPadOS 17.4',
        browser: 'Safari Mobile',
        ip: '110.39.12.5',
        location: 'کراچی، پاکستان (Karachi, PK)',
        lastActive: 'کل دوپہر (Yesterday)',
        isCurrent: false,
        icon: 'tablet'
      }
    ];
    try {
      localStorage.setItem(key, JSON.stringify(sessions));
    } catch (e) {}
  }
  return sessions;
};

window.Views.saveUserActiveSessions = function(userId, sessions) {
  const key = `learnhub_sessions_${userId}`;
  try {
    localStorage.setItem(key, JSON.stringify(sessions));
  } catch (e) {}
};

// ==========================================================================
// MAIN PROFILE RENDER FUNCTION
// ==========================================================================
window.Views.renderProfile = async function() {
  const container = document.getElementById('main-content');
  const user = window.Auth.getCurrentUser();

  if (!user) {
    if (window.Router) window.Router.navigate('/login');
    else window.location.hash = '#/login';
    return;
  }

  let enrollments = [];
  if (window.API && typeof window.API.getEnrollments === 'function') {
    try {
      enrollments = await window.API.getEnrollments(user.id);
    } catch (e) {
      console.error('Error fetching enrollments:', e);
    }
  } else if (window.DB && typeof window.DB.get === 'function') {
    enrollments = (window.DB.get('enrollments') || []).filter(e => e && e.userId === user.id);
  }

  const certificates = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('certificates') || []).filter(c => c && c.userId === user.id) : [];
  const quizAttempts = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('quizAttempts') || []).filter(qa => qa && qa.userId === user.id) : [];
  const userAch = (window.DB && typeof window.DB.get === 'function') ? (window.DB.get('userAchievements') || []).filter(ua => ua && ua.userId === user.id) : [];

  // Statistics calculation
  const totalCourses = enrollments.length;
  const xp = user.totalPoints || 450;
  const level = Math.floor(xp / 100) + 1;
  const nextLevelXp = level * 100;
  const xpProgress = Math.min(100, Math.round(((xp % 100) / 100) * 100));

  // Profile completion meter calculation
  const completionData = window.Views.calculateProfileCompletion(user);

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
                  ${user.role === 'super_admin' ? 'سپر ایڈمن (Super Admin)' : user.role === 'admin' ? 'ایڈمنسٹریٹر (Admin)' : user.role === 'instructor' ? 'استاد محترم (Instructor)' : 'طالب علم (Verified Student)'}
                </span>

                ${user.twoFactorEnabled ? `
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <i data-lucide="shield-check" class="w-3 h-3 text-emerald-400"></i> 2FA محفوظ
                  </span>
                ` : ''}
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
              <span>تصویر تبدیل کریں (Gallery)</span>
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
              onclick="window.Auth.logout(); window.Router ? window.Router.navigate('/login') : (window.location.hash = '#/login');" 
              class="py-2 px-4 text-[11px] rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 font-semibold border border-rose-500/30 flex items-center justify-center gap-2 transition"
            >
              <i data-lucide="log-out" class="w-3.5 h-3.5 text-rose-400"></i>
              <span>لاگ آؤٹ (Sign Out)</span>
            </button>
          </div>

        </div>
      </div>

      <!-- ==========================================
           PROFILE COMPLETION METER WIDGET
           ========================================== -->
      <div class="lh-card p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-50/50 via-white to-emerald-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 shadow-xl space-y-4">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-bold text-xl shadow-lg shadow-amber-500/20">
              <i data-lucide="check-circle-2" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-extrabold text-base text-slate-900 dark:text-white">
                  پروفائل کی تکمیل کا میٹر (Profile Completion)
                </h3>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold font-mono ${
                  completionData.percent === 100 
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40' 
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-400/40'
                }">
                  پروفائل ${completionData.percent}% مکمل ہے
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                مکمل پروفائل آپ کے سرٹیفکیٹس کی تصدیق اور اکاؤنٹ سیکیورٹی کو 100% یقینی بناتی ہے۔
              </p>
            </div>
          </div>

          ${completionData.percent < 100 ? `
            <button 
              onclick="window.Views.openEditProfileModal()" 
              class="btn-primary py-2 px-4 text-xs rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold self-start sm:self-auto shadow-md"
            >
              باقی مراحل مکمل کریں &rarr;
            </button>
          ` : `
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/30">
              <i data-lucide="sparkles" class="w-4 h-4 text-amber-500"></i>
              مبارک! مکمل و محفوظ پروفائل
            </span>
          `}
        </div>

        <!-- Progress Bar -->
        <div class="space-y-1.5">
          <div class="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700">
            <div 
              class="h-full rounded-full transition-all duration-700 ${
                completionData.percent === 100
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 shadow-md shadow-emerald-500/40'
                  : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 shadow-md shadow-amber-500/30'
              }" 
              style="width: ${completionData.percent}%;"
            ></div>
          </div>
        </div>

        <!-- Checklist Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          ${completionData.items.map(item => `
            <div 
              onclick="${item.action}" 
              class="p-3 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                item.completed 
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300/60 dark:border-emerald-800/40 hover:border-emerald-500' 
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:border-amber-400'
              }"
            >
              <div class="flex items-center justify-between">
                <span class="w-7 h-7 rounded-xl flex items-center justify-center text-xs ${
                  item.completed 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }">
                  <i data-lucide="${item.completed ? 'check' : item.icon}" class="w-3.5 h-3.5"></i>
                </span>
                <span class="text-[10px] font-bold font-mono ${item.completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}">
                  ${item.completed ? '+20% مکمل' : 'باقی ہے'}
                </span>
              </div>
              <div>
                <div class="text-xs font-bold text-slate-900 dark:text-white">${item.label}</div>
                <div class="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">${item.desc}</div>
              </div>
            </div>
          `).join('')}
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
          <span>سیکیورٹی، 2FA و پاس ورڈ (Security Hub)</span>
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
                    ${cert.serialNumber || cert.certificateNumber}
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
                    href="#/verify-cert/${cert.serialNumber || cert.certificateNumber}" 
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
  // TAB 3: SECURITY, 2FA, PASSWORD, SESSIONS & ACCOUNT MANAGEMENT
  // ------------------------------------------------------------------------
  if (tab === 'security') {
    const sessions = window.Views.getUserActiveSessions(user.id);

    return `
      <div class="space-y-8 font-urdu" dir="rtl">
        
        <!-- Top Security Notice Banner -->
        <div class="p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/30 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0">
              <i data-lucide="shield-check" class="w-6 h-6"></i>
            </div>
            <div>
              <h4 class="font-extrabold text-sm text-emerald-200">اکاؤنٹ سیکیورٹی سینٹر (Account Security Shield)</h4>
              <p class="text-xs text-slate-300">آپ کا اکاؤنٹ 256-Bit SSL انکرپشن اور خودکار سیکیورٹی تصدیق کے ساتھ مکمل محفوظ ہے۔</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
              user.twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
            }">
              <i data-lucide="${user.twoFactorEnabled ? 'check-circle' : 'alert-triangle'}" class="w-3.5 h-3.5"></i>
              ${user.twoFactorEnabled ? '2FA فعال ہے' : '2FA غیر فعال ہے'}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Column 1: Password & Email Forms -->
          <div class="space-y-8">
            
            <!-- 1. Change Password Card Form with Live Validation -->
            <div class="lh-card p-6 sm:p-8 space-y-5 border border-emerald-500/20 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
              <div class="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div class="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shadow-inner">
                  <i data-lucide="lock" class="w-5 h-5"></i>
                </div>
                <div>
                  <h4 class="font-extrabold text-base text-slate-900 dark:text-white">پاس ورڈ تبدیل کریں (Change Password)</h4>
                  <p class="text-xs text-slate-400">مضبوط اور محفوظ پاس ورڈ کا انتخاب کریں</p>
                </div>
              </div>

              <form onsubmit="window.Views.handlePasswordChange(event)" class="space-y-4 text-right">
                
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
                      class="form-input text-xs py-2.5 pl-10 pr-3 rounded-xl font-mono text-left focus:border-emerald-500 focus:ring-emerald-500" 
                      dir="ltr"
                    >
                    <button 
                      type="button" 
                      onclick="window.Views.togglePasswordInputVisibility('sec-current-password', this)" 
                      class="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
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
                      class="form-input text-xs py-2.5 pl-10 pr-3 rounded-xl font-mono text-left focus:border-emerald-500 focus:ring-emerald-500" 
                      dir="ltr"
                      oninput="window.Views.validateProfilePasswordStrength(this.value)"
                    >
                    <button 
                      type="button" 
                      onclick="window.Views.togglePasswordInputVisibility('sec-new-password', this)" 
                      class="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                  </div>

                  <!-- Live Strength Indicator -->
                  <div class="mt-2 space-y-1" id="profile-pwd-strength-box">
                    <div class="flex justify-between text-[11px] font-mono">
                      <span id="profile-pwd-strength-text" class="text-slate-400">پاس ورڈ کی مضبوطی: انتظار...</span>
                      <span id="profile-pwd-strength-percent" class="font-bold text-slate-400">0%</span>
                    </div>
                    <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div id="profile-pwd-strength-bar" class="h-full bg-rose-500 w-0 transition-all duration-300"></div>
                    </div>
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
                      class="form-input text-xs py-2.5 pl-10 pr-3 rounded-xl font-mono text-left focus:border-emerald-500 focus:ring-emerald-500" 
                      dir="ltr"
                      oninput="window.Views.validatePasswordMatch()"
                    >
                    <button 
                      type="button" 
                      onclick="window.Views.togglePasswordInputVisibility('sec-confirm-password', this)" 
                      class="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                  </div>
                  <p id="profile-pwd-match-msg" class="text-[11px] text-slate-400 mt-1 hidden"></p>
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

            <!-- 2. Secure Email Change Card Form -->
            <div class="lh-card p-6 sm:p-8 space-y-5 border border-indigo-500/20 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
              <div class="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div class="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center shadow-inner">
                  <i data-lucide="mail" class="w-5 h-5"></i>
                </div>
                <div>
                  <h4 class="font-extrabold text-base text-slate-900 dark:text-white">ای میل ایڈریس تبدیل کریں (Change Email)</h4>
                  <p class="text-xs text-slate-400">سیکیورٹی کی تصدیق کے لیے موجودہ پاس ورڈ لازمی ہے</p>
                </div>
              </div>

              <form onsubmit="window.Views.handleChangeEmail(event)" class="space-y-4 text-right">
                
                <div>
                  <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    موجودہ ای میل (Current Email)
                  </label>
                  <input 
                    type="text" 
                    disabled 
                    value="${user.email}" 
                    class="form-input text-xs py-2.5 rounded-xl font-mono text-left bg-slate-100 dark:bg-slate-800 text-slate-500" 
                    dir="ltr"
                  >
                </div>

                <div>
                  <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    نیا ای میل ایڈریس (New Email Address)
                  </label>
                  <div class="relative">
                    <input 
                      type="email" 
                      id="sec-new-email" 
                      required 
                      placeholder="new-email@example.com" 
                      class="form-input text-xs py-2.5 pl-9 pr-3 rounded-xl font-mono text-left focus:border-indigo-500 focus:ring-indigo-500" 
                      dir="ltr"
                    >
                    <i data-lucide="at-sign" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
                  </div>
                </div>

                <div>
                  <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    موجودہ پاس ورڈ برائے تصدیق (Current Password)
                  </label>
                  <div class="relative">
                    <input 
                      type="password" 
                      id="sec-email-change-pwd" 
                      required 
                      placeholder="••••••••" 
                      class="form-input text-xs py-2.5 pl-9 pr-3 rounded-xl font-mono text-left focus:border-indigo-500 focus:ring-indigo-500" 
                      dir="ltr"
                    >
                    <i data-lucide="key" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
                  </div>
                </div>

                <button 
                  type="submit" 
                  class="btn-primary w-full py-2.5 text-xs rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold border-none shadow-md flex items-center justify-center gap-2"
                >
                  <i data-lucide="mail-check" class="w-4 h-4"></i>
                  <span>ای میل ایڈریس اپڈیٹ کریں</span>
                </button>

              </form>
            </div>

          </div>

          <!-- Column 2: 2FA Management, Active Sessions & Account Deactivation -->
          <div class="space-y-8">
            
            <!-- 3. 2FA Management & Recovery Codes Card -->
            <div class="lh-card p-6 sm:p-8 space-y-5 border border-emerald-500/20 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
              
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shadow-inner">
                    <i data-lucide="shield" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <h4 class="font-extrabold text-base text-slate-900 dark:text-white">دو مرحلہ تصدیق (2FA Management)</h4>
                    <p class="text-xs text-slate-400">Google Authenticator یا TOTP ایپس کے ذریعے لاگ اِن تحفظ</p>
                  </div>
                </div>

                <!-- 2FA State Badge -->
                <span class="inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  user.twoFactorEnabled 
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700'
                }">
                  ${user.twoFactorEnabled ? 'فعال (Enabled) ✓' : 'غیر فعال (Disabled)'}
                </span>
              </div>

              <!-- 2FA Description & Status -->
              <div class="p-4 rounded-2xl ${
                user.twoFactorEnabled 
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200' 
                  : 'bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200'
              } text-xs leading-relaxed space-y-2">
                <p>
                  ${user.twoFactorEnabled 
                    ? '✓ آپ کے اکاؤنٹ پر Two-Factor Authentication کامیابی سے فعال ہے۔ لاگ اِن کرتے وقت آپ سے 6 ہندسوں کا کوڈ طلب کیا جائے گا۔' 
                    : '⚠️ دو مرحلہ تصدیق غیر فعال ہے۔ اپنے اکاؤنٹ کو ہیکنگ اور پاس ورڈ چوری سے محفوظ رکھنے کے لیے اسے فوری فعال کریں۔'}
                </p>
              </div>

              <!-- 2FA Action Buttons -->
              <div class="flex flex-wrap gap-3">
                ${user.twoFactorEnabled ? `
                  <button 
                    type="button" 
                    onclick="window.Views.openBackupCodesModal()" 
                    class="btn-primary flex-1 py-2.5 px-4 text-xs rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold shadow-md flex items-center justify-center gap-2"
                  >
                    <i data-lucide="key" class="w-4 h-4"></i>
                    <span>8 بیک اپ ریکوری کوڈز دیکھیں</span>
                  </button>

                  <button 
                    type="button" 
                    onclick="window.Views.toggleTwoFactor(false)" 
                    class="btn-secondary py-2.5 px-4 text-xs rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-300 font-bold flex items-center justify-center gap-1.5"
                  >
                    <i data-lucide="shield-off" class="w-4 h-4 text-rose-500"></i>
                    <span>2FA بند کریں</span>
                  </button>
                ` : `
                  <button 
                    type="button" 
                    onclick="window.Views.openTwoFactorSetupModal()" 
                    class="btn-primary w-full py-3 text-xs rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 hover:from-emerald-500 hover:to-indigo-600 text-white font-bold shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2"
                  >
                    <i data-lucide="shield-check" class="w-4 h-4"></i>
                    <span>2FA فعال کریں (Setup Authenticator)</span>
                  </button>
                `}
              </div>

            </div>

            <!-- 4. Active Sessions Manager Card -->
            <div class="lh-card p-6 sm:p-8 space-y-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
              
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center shadow-inner">
                    <i data-lucide="laptop" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <h4 class="font-extrabold text-base text-slate-900 dark:text-white">فعال ڈیوائسز اور سیشنز (Active Sessions)</h4>
                    <p class="text-xs text-slate-400">وہ تمام ڈیوائسز جن پر آپ کا اکاؤنٹ اس وقت لاگ اِن ہے</p>
                  </div>
                </div>

                <button 
                  type="button" 
                  onclick="window.Views.revokeAllOtherSessions()" 
                  class="btn-secondary py-1.5 px-3 text-[11px] rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-300 font-bold flex items-center gap-1"
                  title="موجودہ ڈیوائس کے علاوہ باقی سب کو لاگ آؤٹ کریں"
                >
                  <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                  <span>تمام دیگر ڈیوائسز سے لاگ آؤٹ</span>
                </button>
              </div>

              <!-- Sessions List -->
              <div class="space-y-3">
                ${sessions.map(sess => `
                  <div class="p-3.5 rounded-2xl border transition flex items-center justify-between ${
                    sess.isCurrent 
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300/50 dark:border-emerald-800/40' 
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                  }">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl flex items-center justify-center ${
                        sess.isCurrent ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }">
                        <i data-lucide="${sess.icon || 'laptop'}" class="w-4 h-4"></i>
                      </div>
                      <div class="space-y-0.5 text-right">
                        <div class="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>${sess.device || 'Web Browser'}</span>
                          ${sess.isCurrent ? `
                            <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white">
                              موجودہ سیشن (This Device)
                            </span>
                          ` : ''}
                        </div>
                        <div class="text-[10px] text-slate-400 font-mono" dir="ltr">
                          ${sess.ip || '127.0.0.1'} • ${sess.os || ''} • ${sess.lastActive || 'Active'}
                        </div>
                        <div class="text-[10px] text-slate-500">${sess.location || 'Pakistan'}</div>
                      </div>
                    </div>

                    <div>
                      ${!sess.isCurrent ? `
                        <button 
                          type="button" 
                          onclick="window.Views.revokeSingleSession('${sess.id}')" 
                          class="py-1 px-2.5 text-[11px] rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 font-bold transition flex items-center gap-1"
                          title="اس ڈیوائس کا سیشن ختم کریں"
                        >
                          <i data-lucide="x" class="w-3 h-3"></i>
                          <span>اس ڈیوائس سے لاگ آؤٹ</span>
                        </button>
                      ` : `
                        <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-mono">فعال</span>
                      `}
                    </div>
                  </div>
                `).join('')}
              </div>

            </div>

            <!-- 5. Account Deactivation & Deletion Card (Danger Zone) -->
            <div class="lh-card p-6 sm:p-8 space-y-4 border-2 border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10 rounded-3xl shadow-xl">
              <div class="flex items-center gap-3 border-b border-rose-200/50 dark:border-rose-900/40 pb-3">
                <div class="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center shadow-inner">
                  <i data-lucide="alert-triangle" class="w-5 h-5"></i>
                </div>
                <div>
                  <h4 class="font-extrabold text-base text-rose-900 dark:text-rose-300">خطرناک زون (Account Management & Danger Zone)</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400">اکاؤنٹ معطلی یا مستقل حذف کرنے کے اختیارات</p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <!-- Deactivate Account Button -->
                <button 
                  type="button" 
                  onclick="window.Views.openDeactivateAccountModal()" 
                  class="py-2.5 px-4 text-xs rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-400/40 font-bold flex items-center justify-center gap-2 transition"
                >
                  <i data-lucide="pause-circle" class="w-4 h-4 text-amber-500"></i>
                  <span>اکاؤنٹ عارضی معطل کریں (Deactivate)</span>
                </button>

                <!-- Delete Account Button -->
                <button 
                  type="button" 
                  onclick="window.Views.openDeleteAccountModal()" 
                  class="py-2.5 px-4 text-xs rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition"
                >
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                  <span>اکاؤنٹ مستقل حذف کریں (Delete Account)</span>
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
              <span class="font-extrabold text-emerald-600 font-mono text-sm">${enrollments.filter(e => e && e.status === 'completed').length}</span>
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
              <span class="font-extrabold text-cyan-600 font-mono text-sm">${quizAttempts.filter(qa => qa && qa.isPassed).length}</span>
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
// PASSWORD LIVE VALIDATION & TOGGLE VISIBILITY
// ==========================================================================

window.Views.togglePasswordInputVisibility = function(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPwd = input.type === 'password';
  input.type = isPwd ? 'text' : 'password';
  if (btn) {
    btn.innerHTML = `<i data-lucide="${isPwd ? 'eye-off' : 'eye'}" class="w-4 h-4"></i>`;
    if (window.lucide) window.lucide.createIcons();
  }
};

window.Views.validateProfilePasswordStrength = function(val) {
  const label = document.getElementById('profile-pwd-strength-text');
  const percent = document.getElementById('profile-pwd-strength-percent');
  const bar = document.getElementById('profile-pwd-strength-bar');
  if (!bar || !label || !percent) return;

  let score = 0;
  if (val.length >= 6) score += 25;
  if (val.length >= 10) score += 25;
  if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score += 25;
  if (/[^A-Za-z0-9]/.test(val)) score += 25;

  percent.textContent = `${score}%`;
  bar.style.width = `${score}%`;

  if (score <= 25) {
    label.textContent = 'پاس ورڈ کی مضبوطی: کمزور (Weak)';
    bar.className = 'h-full bg-rose-500 transition-all duration-300';
  } else if (score <= 50) {
    label.textContent = 'پاس ورڈ کی مضبوطی: درمیانہ (Fair)';
    bar.className = 'h-full bg-amber-500 transition-all duration-300';
  } else if (score <= 75) {
    label.textContent = 'پاس ورڈ کی مضبوطی: اچھا (Good)';
    bar.className = 'h-full bg-cyan-500 transition-all duration-300';
  } else {
    label.textContent = 'پاس ورڈ کی مضبوطی: انتہائی مضبوط (Strong)';
    bar.className = 'h-full bg-emerald-500 transition-all duration-300';
  }

  window.Views.validatePasswordMatch();
};

window.Views.validatePasswordMatch = function() {
  const newPwd = document.getElementById('sec-new-password')?.value || '';
  const confirmPwd = document.getElementById('sec-confirm-password')?.value || '';
  const msg = document.getElementById('profile-pwd-match-msg');
  if (!msg) return;

  if (!confirmPwd) {
    msg.classList.add('hidden');
    return;
  }

  msg.classList.remove('hidden');
  if (newPwd === confirmPwd) {
    msg.textContent = '✓ دونوں پاس ورڈز ایک جیسے ہیں۔';
    msg.className = 'text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1';
  } else {
    msg.textContent = '✗ پاس ورڈ مماثل نہیں ہیں۔';
    msg.className = 'text-[11px] text-rose-500 font-bold mt-1';
  }
};

window.Views.handlePasswordChange = async function(e) {
  e.preventDefault();
  const currentPwd = document.getElementById('sec-current-password').value;
  const newPwd = document.getElementById('sec-new-password').value;
  const confirmPwd = document.getElementById('sec-confirm-password').value;

  if (!currentPwd || !newPwd || !confirmPwd) {
    window.App?.showToast('براہ کرم تمام خانے پُر کریں۔', 'warning');
    return;
  }

  if (newPwd.length < 6) {
    window.App?.showToast('نیا پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔', 'warning');
    return;
  }

  if (newPwd !== confirmPwd) {
    window.App?.showToast('نیا پاس ورڈ اور تصدیقی پاس ورڈ آپس میں مماثل نہیں ہیں۔', 'danger');
    return;
  }

  try {
    await window.Auth.changePassword(currentPwd, newPwd, confirmPwd);
    window.App?.showToast('پاس ورڈ کامیابی سے تبدیل اور محفوظ ہو گیا!', 'success');
    e.target.reset();
    const bar = document.getElementById('profile-pwd-strength-bar');
    if (bar) bar.style.width = '0%';
  } catch (err) {
    window.App?.showToast(err.message || 'موجودہ پاس ورڈ درست نہیں ہے۔', 'danger');
  }
};

// ==========================================================================
// SECURE EMAIL CHANGE HANDLER
// ==========================================================================
window.Views.handleChangeEmail = async function(e) {
  e.preventDefault();
  const newEmail = document.getElementById('sec-new-email').value.trim().toLowerCase();
  const password = document.getElementById('sec-email-change-pwd').value;
  const user = window.Auth.getCurrentUser();

  if (!user) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!newEmail || !emailRegex.test(newEmail)) {
    window.App?.showToast('براہ کرم درست ای میل ایڈریس درج کریں۔', 'warning');
    return;
  }

  if (newEmail === user.email.toLowerCase()) {
    window.App?.showToast('نیا ای میل موجودہ ای میل سے مختلف ہونا چاہیے۔', 'warning');
    return;
  }

  try {
    if (window.Auth.changeEmail) {
      await window.Auth.changeEmail(newEmail, password);
    } else {
      const userInDb = window.DB.findById('users', user.id);
      if (!userInDb || userInDb.password !== password) {
        throw new Error('موجودہ پاس ورڈ درست نہیں ہے۔ ای میل تبدیل نہیں کی جا سکی۔');
      }
      const existing = window.DB.get('users').find(u => u && u.email && u.email.toLowerCase() === newEmail && u.id !== user.id);
      if (existing) {
        throw new Error('یہ ای میل ایڈریس پہلے سے دوسرے اکاؤنٹ کے ساتھ رجسٹرڈ ہے۔');
      }
      const updated = window.DB.update('users', user.id, { email: newEmail });
      window.Auth.setSession(updated, true);
    }
    window.App?.showToast(`ای میل کامیابی کے ساتھ تبدیل کر کے ${newEmail} محفوظ کر دی گئی۔`, 'success');
    window.Views.renderProfile();
  } catch (err) {
    window.App?.showToast(err.message || 'ای میل تبدیل کرنے میں غلطی ہوئی۔', 'danger');
  }
};

// ==========================================================================
// 2FA TOTP SETUP & MODALS & RECOVERY CODES
// ==========================================================================
window.Views.openTwoFactorSetupModal = function() {
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  const sampleSecret = 'JBSWY3DPEHPK3PXP';
  const qrData = `otpauth://totp/LearnHub:${encodeURIComponent(user.email)}?secret=${sampleSecret}&issuer=LearnHub`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrData)}`;

  window.App.showModal('دو مرحلہ تصدیق (2FA Setup)', `
    <div class="space-y-5 font-urdu text-right" dir="rtl">
      
      <div class="space-y-1">
        <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">
          اپنے اکاؤنٹ پر Authenticator ایپ منسلک کریں
        </h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Google Authenticator، Microsoft Authenticator یا 2FAS ایپ کھولیں اور نیچے دیا گیا QR کوڈ اسکین کریں:
        </p>
      </div>

      <!-- Step 1: QR & Secret -->
      <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4">
        <!-- Generated QR Code -->
        <div class="w-32 h-32 bg-white p-2 rounded-xl shadow-md shrink-0 flex items-center justify-center border border-slate-200">
          <img src="${qrCodeUrl}" alt="QR Code" class="w-full h-full object-contain" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=LearnHub2FA'">
        </div>

        <div class="space-y-2 flex-1 min-w-0">
          <div class="text-xs font-bold text-slate-700 dark:text-slate-300">یا دستی کوڈ (Secret Key) درج کریں:</div>
          <div class="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
            <span class="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 select-all" dir="ltr">${sampleSecret}</span>
            <button 
              type="button" 
              onclick="navigator.clipboard.writeText('${sampleSecret}'); window.App?.showToast('خفیہ کوڈ کاپی ہو گیا!', 'info');" 
              class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
            >
              کاپی کریں
            </button>
          </div>
          <p class="text-[11px] text-slate-400">اکاؤنٹ نام: LearnHub (${user.email})</p>
        </div>
      </div>

      <!-- Step 2: Enter 6-digit Code -->
      <form onsubmit="window.Views.verifyAndEnableTwoFactor(event, '${sampleSecret}')" class="space-y-4">
        <div>
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            ایپ سے حاصل کردہ 6 ہندسوں کا کوڈ درج کریں:
          </label>
          <input 
            type="text" 
            id="totp-verification-input" 
            required 
            maxlength="6" 
            placeholder="123456" 
            class="form-input text-center text-lg tracking-widest font-mono py-2.5 rounded-xl border-2 focus:border-emerald-500" 
            dir="ltr"
          >
        </div>

        <div class="flex gap-2.5 pt-2">
          <button 
            type="submit" 
            class="btn-primary flex-1 py-3 text-xs rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-700 text-white font-bold shadow-lg shadow-emerald-700/20"
          >
            کوڈ کی تصدیق کریں اور 2FA فعال کریں ✓
          </button>
          <button 
            type="button" 
            onclick="window.App.closeModal()" 
            class="btn-secondary py-3 px-4 text-xs rounded-xl"
          >
            منسوخ
          </button>
        </div>
      </form>

    </div>
  `);

  if (window.lucide) window.lucide.createIcons();
};

window.Views.verifyAndEnableTwoFactor = async function(e, secret) {
  e.preventDefault();
  const code = document.getElementById('totp-verification-input').value.trim();
  const user = window.Auth.getCurrentUser();

  if (!code || code.length < 6) {
    window.App?.showToast('براہ کرم 6 ہندسوں کا درست کوڈ درج کریں۔', 'warning');
    return;
  }

  // Generate 8 new backup recovery codes
  const recoveryCodes = window.Views.generateRecoveryCodes();

  try {
    if (window.Auth.confirm2FA) {
      await window.Auth.confirm2FA(user.id, code);
    }
    const updated = window.DB && typeof window.DB.update === 'function' 
      ? window.DB.update('users', user.id, {
          twoFactorEnabled: true,
          twoFactorSecret: secret,
          backupRecoveryCodes: recoveryCodes
        })
      : { ...user, twoFactorEnabled: true, backupRecoveryCodes: recoveryCodes };

    window.Auth.setSession(updated, true);
    if (window.DB && typeof window.DB.logAudit === 'function') {
      window.DB.logAudit(user.name, '2FA_ENABLED', user.email);
    }
    window.App?.closeModal();
    window.App?.showToast('Two-Factor Authentication کامیابی سے فعال ہو گیا!', 'success');
    window.Views.renderProfile();
    // Open recovery codes viewer immediately so user can save them
    setTimeout(() => {
      window.Views.openBackupCodesModal();
    }, 400);
  } catch (err) {
    window.App?.showToast(err.message || '2FA فعال کرنے میں غلطی ہوئی۔', 'danger');
  }
};

window.Views.generateRecoveryCodes = function() {
  const codes = [];
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (let i = 0; i < 8; i++) {
    let part1 = '';
    let part2 = '';
    for (let j = 0; j < 4; j++) part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    for (let j = 0; j < 4; j++) part2 += chars.charAt(Math.floor(Math.random() * chars.length));
    codes.push(`${part1}-${part2}`);
  }
  return codes;
};

window.Views.openBackupCodesModal = function() {
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  let codes = user.backupRecoveryCodes;
  if (!codes || !Array.isArray(codes) || codes.length === 0) {
    codes = window.Views.generateRecoveryCodes();
    if (window.DB && typeof window.DB.update === 'function') {
      const updated = window.DB.update('users', user.id, { backupRecoveryCodes: codes });
      window.Auth.setSession(updated, true);
    }
  }

  const codesText = codes.join('\n');

  window.App.showModal('8 بیک اپ ریکوری کوڈز (Backup Recovery Codes)', `
    <div class="space-y-4 font-urdu text-right" dir="rtl">
      
      <div class="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-2xl text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
        ⚠️ ان کوڈز کو کسی محفوظ جگہ پر ڈاؤنلوڈ یا کاپی کر کے محفوظ رکھیں۔ اگر آپ کا فون گم ہو جائے تو آپ ان کی مدد سے اکاؤنٹ لاگ اِن کر سکیں گے۔ ہر کوڈ صرف ایک بار استعمال ہو سکتا ہے۔
      </div>

      <!-- 8 Codes Grid -->
      <div class="grid grid-cols-2 gap-2.5 p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
        ${codes.map((code, idx) => `
          <div class="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono text-xs font-bold text-slate-800 dark:text-slate-200" dir="ltr">
            <span class="text-slate-400 text-[10px] font-sans">#${idx + 1}</span>
            <span>${typeof code === 'string' ? code : (code.code || '')}</span>
          </div>
        `).join('')}
      </div>

      <!-- Action Buttons: Download & Copy -->
      <div class="flex flex-col sm:flex-row gap-2.5 pt-2">
        <button 
          type="button" 
          onclick="window.Views.downloadBackupCodesTxt('${user.name}', '${user.email}')" 
          class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold flex items-center justify-center gap-2 shadow"
        >
          <i data-lucide="download" class="w-4 h-4"></i>
          <span>فائل ڈاؤنلوڈ کریں (.txt)</span>
        </button>

        <button 
          type="button" 
          onclick="navigator.clipboard.writeText(\`${codesText}\`); window.App?.showToast('تمام 8 ریکوری کوڈز کاپی ہو گئے!', 'success');" 
          class="btn-secondary py-2.5 px-4 text-xs rounded-xl font-bold flex items-center justify-center gap-1.5"
        >
          <i data-lucide="copy" class="w-4 h-4"></i>
          <span>تمام کوڈز کاپی کریں</span>
        </button>

        <button 
          type="button" 
          onclick="window.Views.regenerateBackupCodes()" 
          class="btn-secondary py-2.5 px-3 text-xs rounded-xl text-amber-600 font-bold flex items-center justify-center gap-1"
          title="نئے کوڈز بنائیں"
        >
          <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
          <span>نئے بنائیں</span>
        </button>
      </div>

    </div>
  `);

  if (window.lucide) window.lucide.createIcons();
};

window.Views.downloadBackupCodesTxt = function(name, email) {
  const user = window.Auth.getCurrentUser();
  const codes = user?.backupRecoveryCodes || [];
  const content = `-----------------------------------------------------
LearnHub 2FA Backup Recovery Codes
User: ${name} (${email})
Generated: ${new Date().toLocaleString()}
-----------------------------------------------------

Keep these codes safe. Each code can be used once to access
your LearnHub account if you lose your authenticator device.

${codes.map((c, i) => `${i + 1}. ${typeof c === 'string' ? c : c.code}`).join('\n')}

-----------------------------------------------------
LearnHub Security Portal - https://learnhub.academy
-----------------------------------------------------`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `learnhub-2fa-backup-codes-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  window.App?.showToast('بیک اپ کوڈز کی فائل ڈاؤنلوڈ ہو گئی ہے!', 'success');
};

window.Views.regenerateBackupCodes = async function() {
  const user = window.Auth.getCurrentUser();
  if (!user) return;
  const newCodes = window.Views.generateRecoveryCodes();
  if (window.Auth.regenerateRecoveryCodes) {
    await window.Auth.regenerateRecoveryCodes(user.id);
  } else if (window.DB && typeof window.DB.update === 'function') {
    const updated = window.DB.update('users', user.id, { backupRecoveryCodes: newCodes });
    window.Auth.setSession(updated, true);
  }
  window.App?.showToast('نئے 8 بیک اپ کوڈز کامیابی سے بن گئے ہیں!', 'success');
  window.Views.openBackupCodesModal();
};

window.Views.toggleTwoFactor = async function(enable) {
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  if (!enable) {
    if (confirm('کیا آپ واقعی Two-Factor Authentication کو غیر فعال کرنا چاہتے ہیں؟ اس سے اکاؤنٹ کا تحفظ کم ہو سکتا ہے۔')) {
      if (window.Auth.disable2FA) {
        await window.Auth.disable2FA(user.id);
      } else if (window.DB && typeof window.DB.update === 'function') {
        const updated = window.DB.update('users', user.id, { twoFactorEnabled: false });
        window.Auth.setSession(updated, true);
      }
      window.App?.showToast('Two-Factor Authentication غیر فعال کر دی گئی ہے۔', 'info');
      window.Views.renderProfile();
    }
  }
};

// ==========================================================================
// ACTIVE SESSIONS MANAGEMENT
// ==========================================================================
window.Views.revokeSingleSession = async function(sessionId) {
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  try {
    if (window.Auth.revokeSession) {
      await window.Auth.revokeSession(sessionId, user.id);
    }
    let sessions = window.Views.getUserActiveSessions(user.id);
    sessions = sessions.filter(s => s.id !== sessionId);
    window.Views.saveUserActiveSessions(user.id, sessions);
    window.App?.showToast('منتخب ڈیوائس کا سیشن کامیابی سے ختم کر دیا گیا۔', 'success');
    window.Views.renderProfile();
  } catch (e) {
    window.App?.showToast(e.message || 'سیشن منسوخ نہیں کیا جا سکا', 'danger');
  }
};

window.Views.revokeAllOtherSessions = async function() {
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  try {
    if (window.Auth.revokeAllOtherSessions) {
      await window.Auth.revokeAllOtherSessions(user.id);
    }
    let sessions = window.Views.getUserActiveSessions(user.id);
    sessions = sessions.filter(s => s.isCurrent);
    window.Views.saveUserActiveSessions(user.id, sessions);
    window.App?.showToast('تمام دیگر ڈیوائسز سے سیشنز کامیابی کے ساتھ ختم کر دیے گئے!', 'success');
    window.Views.renderProfile();
  } catch (e) {
    window.App?.showToast(e.message || 'سیشنز ختم نہیں کیے جا سکے', 'danger');
  }
};

// ==========================================================================
// ACCOUNT DEACTIVATION & DELETION MODALS
// ==========================================================================
window.Views.openDeactivateAccountModal = function() {
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  window.App.showModal('اکاؤنٹ عارضی معطل کریں (Deactivate Account)', `
    <form onsubmit="window.Views.handleDeactivateAccount(event)" class="space-y-4 font-urdu text-right" dir="rtl">
      <div class="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
        ⚠️ اکاؤنٹ معطل کرنے سے آپ فوری طور پر لاگ آؤٹ ہو جائیں گے اور آپ کے کورسز کا ڈیٹا محفوظ رہے گا لیکن پبلک پروفائل عارضی طور پر چھپ جائے گی۔ آپ دوبارہ لاگ اِن کر کے کسی بھی وقت اسے بحال کر سکتے ہیں۔
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
          تصدیق کے لیے اپنا پاس ورڈ درج کریں:
        </label>
        <input 
          type="password" 
          id="deactivate-password-input" 
          required 
          placeholder="••••••••" 
          class="form-input text-xs py-2.5 rounded-xl font-mono text-left" 
          dir="ltr"
        >
      </div>

      <div class="flex gap-2.5 pt-2">
        <button 
          type="submit" 
          class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
        >
          اکاؤنٹ معطل کریں (Deactivate)
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

window.Views.handleDeactivateAccount = async function(e) {
  e.preventDefault();
  const pwd = document.getElementById('deactivate-password-input').value;
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  try {
    if (window.Auth.deactivateAccount) {
      await window.Auth.deactivateAccount(user.id, pwd);
    } else {
      const userInDb = window.DB.findById('users', user.id);
      if (!userInDb || userInDb.password !== pwd) {
        throw new Error('پاس ورڈ درست نہیں ہے۔ اکاؤنٹ معطل نہیں کیا جا سکا۔');
      }
      window.DB.update('users', user.id, { status: 'suspended' });
      window.Auth.clearSession();
    }
    window.App?.closeModal();
    window.App?.showToast('آپ کا اکاؤنٹ معطل کر دیا گیا ہے۔ دوبارہ فعال کرنے کے لیے سپورٹ یا لاگ اِن کریں۔', 'info');
    if (window.Router) window.Router.navigate('/login');
    else window.location.hash = '#/login';
  } catch (err) {
    window.App?.showToast(err.message || 'اکاؤنٹ معطل کرنے میں غلطی ہوئی۔', 'danger');
  }
};

window.Views.openDeleteAccountModal = function() {
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  window.App.showModal('اکاؤنٹ مستقل حذف کریں (Permanent Deletion)', `
    <form onsubmit="window.Views.handleDeleteAccount(event)" class="space-y-4 font-urdu text-right" dir="rtl">
      <div class="p-4 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 rounded-2xl text-xs text-rose-800 dark:text-rose-300 leading-relaxed space-y-2">
        <h5 class="font-extrabold text-sm flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
          <i data-lucide="alert-octagon" class="w-4 h-4"></i> انتہائی اہم انتباہ!
        </h5>
        <p>اکاؤنٹ ڈیلیٹ کرنے کے بعد آپ کے تمام داخل شدہ کورسز کی پیش رفت، کوئز کے رزلٹس، حاصل کردہ سرٹیفکیٹس اور پوائنٹس مستقل طور پر ضائع ہو جائیں گے اور انہیں بحال نہیں کیا جا سکے گا۔</p>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
          تصدیق کے لیے باکس میں <strong>"DELETE"</strong> ٹائپ کریں:
        </label>
        <input 
          type="text" 
          id="delete-confirmation-text" 
          required 
          placeholder="DELETE" 
          class="form-input text-xs py-2.5 rounded-xl font-mono text-center uppercase" 
          dir="ltr"
        >
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
          اپنا موجودہ پاس ورڈ درج کریں:
        </label>
        <input 
          type="password" 
          id="delete-password-input" 
          required 
          placeholder="••••••••" 
          class="form-input text-xs py-2.5 rounded-xl font-mono text-left" 
          dir="ltr"
        >
      </div>

      <div class="flex gap-2.5 pt-2">
        <button 
          type="submit" 
          class="btn-primary flex-1 py-3 text-xs rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30"
        >
          جی ہاں، میرا اکاؤنٹ مستقل ڈیلیٹ کریں
        </button>
        <button 
          type="button" 
          onclick="window.App.closeModal()" 
          class="btn-secondary py-3 px-4 text-xs rounded-xl"
        >
          منسوخ
        </button>
      </div>
    </form>
  `);

  if (window.lucide) window.lucide.createIcons();
};

window.Views.handleDeleteAccount = async function(e) {
  e.preventDefault();
  const confirmText = document.getElementById('delete-confirmation-text').value.trim();
  const pwd = document.getElementById('delete-password-input').value;
  const user = window.Auth.getCurrentUser();
  if (!user) return;

  if (confirmText !== 'DELETE') {
    window.App?.showToast('براہ کرم خانے میں درست طور پر DELETE لکھیں۔', 'warning');
    return;
  }

  try {
    if (window.Auth.deleteAccount) {
      await window.Auth.deleteAccount(user.id, pwd);
    } else {
      const userInDb = window.DB.findById('users', user.id);
      if (!userInDb || userInDb.password !== pwd) {
        throw new Error('پاس ورڈ درست نہیں ہے۔ اکاؤنٹ حذف نہیں کیا جا سکا۔');
      }
      window.DB.delete('users', user.id);
      window.Auth.clearSession();
    }
    window.App?.closeModal();
    window.App?.showToast('آپ کا اکاؤنٹ اور تمام متعلقہ ڈیٹا کامیابی سے حذف کر دیا گیا ہے۔', 'info');
    if (window.Router) window.Router.navigate('/login');
    else window.location.hash = '#/login';
  } catch (err) {
    window.App?.showToast(err.message || 'اکاؤنٹ ڈیلیٹ کرنے میں مسئلہ پیش آیا۔', 'danger');
  }
};

// ==========================================================================
// DEVICE GALLERY PHOTO UPLOAD & OFFSCREEN CANVAS RESIZING (256x256 @ 0.85)
// ==========================================================================

window.Views.triggerAvatarUpload = function() {
  const input = document.getElementById('user-gallery-file-input');
  if (input) {
    input.value = '';
    input.click();
  }
};

window.Views.handleGalleryImageUpload = function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    window.App?.showToast('براہ کرم درست تصویری فائل منتخب کریں (JPG, PNG, WebP)', 'danger');
    return;
  }

  if (window.App && typeof window.App.showLoading === 'function') {
    window.App.showLoading(true);
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = async function() {
      try {
        const canvas = document.createElement('canvas');
        const targetSize = 256;
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');

        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, targetSize, targetSize);
        const base64Data = canvas.toDataURL('image/jpeg', 0.85);

        await window.Auth.updateProfile({ avatar: base64Data });

        if (window.App && typeof window.App.showLoading === 'function') {
          window.App.showLoading(false);
        }

        if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
          window.App.updateNavbarUserUI();
        }

        window.App?.showToast('پروفائل تصویر کامیابی سے اپلوڈ اور تبدیل ہو گئی!', 'success');
        window.Views.renderProfile();
      } catch (err) {
        if (window.App && typeof window.App.showLoading === 'function') {
          window.App.showLoading(false);
        }
        console.error('Avatar upload error:', err);
        window.App?.showToast(err.message || 'تصویر اپلوڈ کرنے میں مسئلہ پیش آیا', 'danger');
      }
    };

    img.onerror = function() {
      if (window.App && typeof window.App.showLoading === 'function') {
        window.App.showLoading(false);
      }
      window.App?.showToast('تصویر لوڈ نہیں ہو سکی۔ براہ کرم دوسری تصویر منتخب کریں۔', 'danger');
    };

    img.src = e.target.result;
  };

  reader.onerror = function() {
    if (window.App && typeof window.App.showLoading === 'function') {
      window.App.showLoading(false);
    }
    window.App?.showToast('فائل پڑھنے میں غلطی پیش آئی۔', 'danger');
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
    window.App?.closeModal();
    if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
      window.App.updateNavbarUserUI();
    }
    window.App?.showToast('پروفائل کامیابی سے اپڈیٹ ہو گئی!', 'success');
    window.Views.renderProfile();
  } catch(err) {
    window.App?.showToast(err.message || 'پروفائل محفوظ نہیں ہو سکی', 'danger');
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
    window.App?.closeModal();
    if (window.App && typeof window.App.updateNavbarUserUI === 'function') {
      window.App.updateNavbarUserUI();
    }
    window.App?.showToast('اوتار کامیابی سے تبدیل ہو گیا!', 'success');
    window.Views.renderProfile();
  } catch(err) {
    window.App?.showToast(err.message || 'اوتار تبدیل نہ ہو سکا', 'danger');
  }
};

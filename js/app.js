/**
 * LearnHub Core Application Controller & UI Shell Manager
 */

window.App = {
  isDarkMode: false,
  deferredInstallPrompt: null,
  isAppInstalled: false,

  init() {
    // Step 1: Sanitize demo/test accounts from session storage
    try {
      const storedUser = localStorage.getItem('learnhub_session_user') || sessionStorage.getItem('learnhub_session_user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        const email = (u?.email || '').toLowerCase().trim();
        const isSuperAdmin = ['jrahmanansari@gmail.com', 'jrahmanansari132@gmail.com', 'jrahmanansari133@gmail.com'].includes(email);
        if (!isSuperAdmin && (!u || !u.email || email === 'student@learnhub.com' || email === 'admin@learnhub.com' || u.name === 'Alex Johnson')) {
          localStorage.removeItem('learnhub_session_user');
          sessionStorage.removeItem('learnhub_session_user');
          localStorage.removeItem('learnhub_session_token');
          sessionStorage.removeItem('learnhub_session_token');
          if (window.Auth) window.Auth.currentUser = null;
        }
      }
    } catch (e) {}

    // Step 2: If DB courses are missing, do a SAFE reset that preserves registered users
    if (!window.DB || !window.DB.findById('courses', 'crs-isl-1')) {
      if (window.DB) {
        // Backup all real registered users before resetting
        let registeredUsers = [];
        try {
          const allUsers = window.DB.get('users') || [];
          const mockEmails = new Set(['student@learnhub.com', 'instructor@learnhub.com', 'admin@learnhub.com']);
          registeredUsers = allUsers.filter(u => u && u.email && !mockEmails.has((u.email || '').toLowerCase().trim()));
        } catch (e) {}

        // Reset seed data (restores courses, categories, etc.)
        window.DB.resetToSeed();

        // Merge backed-up users back into DB
        try {
          if (registeredUsers.length > 0) {
            const currentUsers = window.DB.get('users') || [];
            const currentEmails = new Set(currentUsers.map(u => (u.email || '').toLowerCase().trim()));
            registeredUsers.forEach(u => {
              const em = (u.email || '').toLowerCase().trim();
              if (!currentEmails.has(em)) {
                window.DB.insert('users', u);
                currentEmails.add(em);
              }
            });
          }
        } catch (e) {}
      }
    }
    this.initTheme();
    this.registerRoutes();
    this.setupGlobalEvents();
    this.initAuthListener();
    window.Router.init();
  },

  initTheme() {
    const saved = localStorage.getItem('learnhub_dark_mode');
    this.isDarkMode = saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('learnhub_dark_mode', this.isDarkMode);
    this.showToast(this.isDarkMode ? 'Dark Mode enabled' : 'Light Mode enabled', 'info');
  },

  registerRoutes() {
    const R = window.Router;

    // Public & User Routes
    R.addRoute('/', () => window.Views.renderHome());
    R.addRoute('/courses', (params, query) => window.Views.renderCourses(params, query));
    R.addRoute('/courses/:id', (params) => window.Views.renderCourseDetails(params));
    R.addRoute('/learn/:courseId', (params) => window.Views.renderLearningPlayer(params), { isDistractionFree: true });
    R.addRoute('/learn/:courseId/:lessonId', (params) => window.Views.renderLearningPlayer(params), { isDistractionFree: true });
    
    // ISLAMIC ADVENTURE GAME ECOSYSTEM (9 Realms, Interactive Puzzles & Sagas)
    R.addRoute('/adventure', (params, query) => window.Views.renderAdventureGame(params, query));
    R.addRoute('/adventure/world/:worldId', (params, query) => window.Views.renderAdventureGame(params, query));
    R.addRoute('/adventure/stage/:stageId', (params, query) => window.Views.renderAdventureGame(params, query));
    R.addRoute('/quizzes', (params, query) => window.Views.renderAdventureGame(params, query));
    R.addRoute('/quizzes/:id', (params, query) => window.Views.renderAdventureGame(params, query));
    R.addRoute('/quiz-take/:id', (params, query) => window.Views.renderAdventureGame(params, query));
    R.addRoute('/my-quizzes', (params, query) => window.Views.renderAdventureGame(params, query));

    // Islamic & Knowledge Modules (Quran, Hadith, Articles)
    R.addRoute('/quran', (params) => window.Views.renderQuran(params));
    R.addRoute('/quran/:id', (params) => window.Views.renderQuran(params));
    R.addRoute('/hadith', () => window.Views.renderHadith());
    R.addRoute('/articles', (params) => window.Views.renderArticles(params));
    R.addRoute('/articles/:id', (params) => window.Views.renderArticles(params));

    // User Engagement & Dashboard
    R.addRoute('/dashboard', () => window.Views.renderDashboard(), { requiresAuth: true });
    R.addRoute('/my-courses', () => window.Views.renderDashboard(), { requiresAuth: true });
    R.addRoute('/profile', () => window.Views.renderProfile(), { requiresAuth: true });
    R.addRoute('/certificates', () => window.Views.renderCertificates(), { requiresAuth: true });
    R.addRoute('/verify-cert/:id', (params) => window.Views.renderVerifyCertificate(params));
    R.addRoute('/achievements', () => window.Views.renderAchievements(), { requiresAuth: true });
    R.addRoute('/wishlist', () => window.Views.renderWishlist(), { requiresAuth: true });
    R.addRoute('/bookmarks', () => window.Views.renderBookmarks(), { requiresAuth: true });
    R.addRoute('/notifications', () => window.Views.renderNotifications(), { requiresAuth: true });
    R.addRoute('/discussions', () => window.Views.renderDiscussions());
    R.addRoute('/resources', () => window.Views.renderResources());
    R.addRoute('/checkout', (params, query) => window.Views.renderCheckout(params, query), { requiresAuth: true });
    R.addRoute('/support', () => window.Views.renderSupport());
    R.addRoute('/privacy', () => window.Views.renderPrivacyPolicy());
    R.addRoute('/terms', () => window.Views.renderTermsOfService());
    R.addRoute('/become-instructor', () => window.Views.renderBecomeInstructor());
    R.addRoute('/instructors', () => window.Views.renderInstructorsDirectory());
    R.addRoute('/instructor/dashboard', () => window.Views.renderInstructorDashboard(), { requiresAuth: true });

    // Mega Islamic Features Routes
    R.addRoute('/duas', () => window.Views.renderDuasAndAzkar());
    R.addRoute('/tasbeeh', () => window.Views.renderDigitalTasbeeh());
    R.addRoute('/prayer-times', () => window.Views.renderPrayerTimesAndQibla());
    R.addRoute('/qibla', () => window.Views.renderPrayerTimesAndQibla());
    R.addRoute('/calendar', () => window.Views.renderHijriCalendar());
    R.addRoute('/daily-challenge', () => window.Views.renderDailyChallenge());
    R.addRoute('/leaderboard', () => window.Views.renderAchievements());
    R.addRoute('/trophies', () => window.Views.renderAchievements());
    R.addRoute('/makharij', () => window.Views.renderTajweedMakharij());
    R.addRoute('/flashcards', () => window.Views.renderFlashcardsHub());
    R.addRoute('/flashcards/:deckId', (params) => window.Views.renderFlashcardsStudyArena(params));
    R.addRoute('/donate', () => window.Views.renderDonationPortal());
    R.addRoute('/fees', () => window.Views.renderDonationPortal());
    R.addRoute('/library', () => window.Views.renderIslamicLibrary());
    R.addRoute('/podcasts', () => window.Views.renderAudioPodcasts());
    
    // Futuristic Islamic Super Ecosystem Routes
    R.addRoute('/ai-scholar', () => window.Views.renderAIScholar());
    R.addRoute('/ai-assistant', () => window.Views.renderAIScholar());
    R.addRoute('/live-streams', () => window.Views.renderLiveStreams());
    R.addRoute('/makkah-live', () => window.Views.renderLiveStreams());
    R.addRoute('/sunnah-tracker', () => window.Views.renderSunnahTracker());
    R.addRoute('/voice-tajweed', () => window.Views.renderVoiceTajweed());
    R.addRoute('/battle-arena', () => window.Views.renderQuizBattle());
    R.addRoute('/battle', () => window.Views.renderQuizBattle());
    R.addRoute('/quiz-wheel', () => window.Views.renderQuizSpinWheel());
    R.addRoute('/lucky-draw', () => window.Views.renderQuizSpinWheel());
    R.addRoute('/mirath', () => window.Views.renderMirathCalculator());
    R.addRoute('/asmaul-husna', () => window.Views.renderAsmaulHusna());
    R.addRoute('/heritage', () => window.Views.renderIslamicHeritage());
    R.addRoute('/moon-sighting', () => window.Views.renderMoonSighting());
    R.addRoute('/qibla-camera', () => window.Views.renderQiblaCamera());
    R.addRoute('/permissions', () => window.Views.renderPermissionsManager());
    R.addRoute('/assignments', () => window.Views.renderAssignments());
    R.addRoute('/takhreej', () => window.Views.renderHadithTakhreej());
    R.addRoute('/live-classes', () => window.Views.renderLiveClasses());
    R.addRoute('/reader/:id', (params) => window.Views.renderBookReader(params));

    // Auth & Identity Routes
    R.addRoute('/login', (params, query) => window.Views.renderLogin(params, query));
    R.addRoute('/register', (params, query) => window.Views.renderRegister(params, query));
    R.addRoute('/forgot-password', (params, query) => window.Views.renderForgotPassword(params, query));
    R.addRoute('/reset-password', (params, query) => window.Views.renderResetPassword(params, query));
    R.addRoute('/verify-email', (params, query) => window.Views.renderVerifyEmail(params, query));
    R.addRoute('/login-2fa', (params, query) => window.Views.render2FAChallenge(params, query));
    R.addRoute('/onboarding', (params, query) => window.Views.renderOnboarding(params, query));

    // ADMIN MANAGEMENT SUITE ROUTES
    R.addRoute('/admin', () => window.Views.admin.renderDashboard(), { requiresAdmin: true });
    R.addRoute('/admin/game-studio', () => window.Views.admin.renderGameStudio(), { requiresAdmin: true });
    R.addRoute('/admin/courses', () => window.Views.admin.renderCourses(), { requiresAdmin: true });
    R.addRoute('/admin/hadiths', () => window.Views.admin.renderHadiths(), { requiresAdmin: true });
    R.addRoute('/admin/quizzes', () => window.Views.admin.renderQuizzes(), { requiresAdmin: true });
    R.addRoute('/admin/certificates', () => window.Views.admin.renderCertificates(), { requiresAdmin: true });
    R.addRoute('/admin/users', () => window.Views.admin.renderUsers(), { requiresAdmin: true });
    R.addRoute('/admin/orders', () => window.Views.admin.renderOrders(), { requiresAdmin: true });
    R.addRoute('/admin/coupons', () => window.Views.admin.renderOrders(), { requiresAdmin: true });
    R.addRoute('/admin/categories', () => window.Views.admin.renderCategories(), { requiresAdmin: true });
    R.addRoute('/admin/instructors', () => window.Views.admin.renderInstructors(), { requiresAdmin: true });
    R.addRoute('/admin/reviews', () => window.Views.admin.renderReviews(), { requiresAdmin: true });
    R.addRoute('/admin/announcements', () => window.Views.admin.renderAnnouncements(), { requiresAdmin: true });
    R.addRoute('/admin/support', () => window.Views.admin.renderSupportTriage(), { requiresAdmin: true });
    R.addRoute('/admin/cms', () => window.Views.admin.renderCMS(), { requiresAdmin: true });
    R.addRoute('/admin/media', () => window.Views.admin.renderMedia(), { requiresAdmin: true });
    R.addRoute('/admin/audit-logs', () => window.Views.admin.renderAuditLogs(), { requiresAdmin: true });
    R.addRoute('/admin/settings', () => window.Views.admin.renderSettings(), { requiresAdmin: true });
  },

  updateLayoutForRoute(route, path) {
    const isAdminRoute = path.startsWith('/admin');
    const isPlayer = route.isDistractionFree;

    const publicNav = document.getElementById('public-navbar');
    const publicFooter = document.getElementById('public-footer');
    const adminSidebar = document.getElementById('admin-sidebar');
    const adminTopbar = document.getElementById('admin-topbar');
    const bottomNav = document.getElementById('app-bottom-nav');

    // Update Language Button Label
    const langLabel = document.getElementById('current-lang-label');
    if (langLabel && window.I18N) {
      const cur = window.I18N.getCurrentLanguage();
      langLabel.textContent = cur === 'ur' ? '🇵🇰 اردو' : cur === 'ar' ? '🇸🇦 العربية' : '🇬🇧 English';
    }

    // Update Bottom Tab Bar Active Highlighting
    if (bottomNav) {
      if (isPlayer) {
        bottomNav.classList.add('translate-y-full');
      } else {
        bottomNav.classList.remove('translate-y-full');
        const tabs = bottomNav.querySelectorAll('.bottom-tab');
        tabs.forEach(tab => {
          const tabPath = tab.getAttribute('data-path');
          const isDashboardTab = tabPath === '/dashboard' && (path.startsWith('/dashboard') || path.startsWith('/profile'));
          const isMatch = (tabPath === '/' && path === '/') || (tabPath !== '/' && path.startsWith(tabPath)) || isDashboardTab;
          if (isMatch) {
            tab.classList.add('text-indigo-600', 'dark:text-indigo-400', 'scale-105');
            tab.classList.remove('text-slate-500', 'dark:text-slate-400');
          } else {
            tab.classList.remove('text-indigo-600', 'dark:text-indigo-400', 'scale-105');
            tab.classList.add('text-slate-500', 'dark:text-slate-400');
          }
        });
      }
    }

    const adminBackdrop = document.getElementById('admin-sidebar-backdrop');
    const mobileDrawer = document.getElementById('mobile-menu-drawer');
    if (mobileDrawer) mobileDrawer.classList.add('hidden');

    if (isPlayer) {
      if (publicNav) publicNav.classList.add('hidden');
      if (publicFooter) publicFooter.classList.add('hidden');
      if (adminSidebar) {
        adminSidebar.classList.add('hidden');
        adminSidebar.classList.remove('flex', 'lg:flex');
      }
      if (adminTopbar) adminTopbar.classList.add('hidden');
      if (adminBackdrop) adminBackdrop.classList.add('hidden');
    } else if (isAdminRoute) {
      // Security Guard: Check admin authorization
      if (!window.Auth || !window.Auth.isAdmin()) {
        if (adminSidebar) {
          adminSidebar.classList.add('hidden');
          adminSidebar.classList.remove('flex', 'lg:flex');
        }
        if (adminTopbar) adminTopbar.classList.add('hidden');
        if (publicNav) publicNav.classList.remove('hidden');
        if (publicFooter) publicFooter.classList.remove('hidden');
        return;
      }

      if (publicNav) publicNav.classList.add('hidden');
      if (publicFooter) publicFooter.classList.add('hidden');
      if (adminTopbar) adminTopbar.classList.remove('hidden');
      if (adminBackdrop) adminBackdrop.classList.add('hidden');
      
      // On desktop (> 1024px) sidebar is flex; on mobile/tablet it is hidden until toggled
      if (adminSidebar) {
        if (window.innerWidth >= 1024) {
          adminSidebar.classList.remove('hidden');
          adminSidebar.classList.add('flex');
        } else {
          adminSidebar.classList.add('hidden');
          adminSidebar.classList.remove('flex');
        }
      }
      this.updateAdminActiveNav(path);
    } else {
      if (publicNav) publicNav.classList.remove('hidden');
      if (publicFooter) publicFooter.classList.remove('hidden');
      if (adminSidebar) {
        adminSidebar.classList.add('hidden');
        adminSidebar.classList.remove('flex', 'lg:flex');
      }
      if (adminTopbar) adminTopbar.classList.add('hidden');
      if (adminBackdrop) adminBackdrop.classList.add('hidden');
      this.updateNavbarUserUI();
    }
  },

  toggleAdminSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const backdrop = document.getElementById('admin-sidebar-backdrop');
    if (!sidebar) return;
    
    if (sidebar.classList.contains('hidden')) {
      sidebar.classList.remove('hidden');
      sidebar.classList.add('flex');
      if (backdrop) backdrop.classList.remove('hidden');
    } else {
      sidebar.classList.add('hidden');
      sidebar.classList.remove('flex');
      if (backdrop) backdrop.classList.add('hidden');
    }
    if (window.lucide) window.lucide.createIcons();
  },

  closeAdminSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const backdrop = document.getElementById('admin-sidebar-backdrop');
    if (sidebar && window.innerWidth < 1024) {
      sidebar.classList.add('hidden');
      sidebar.classList.remove('flex');
    }
    if (backdrop) backdrop.classList.add('hidden');
  },

  updateAdminActiveNav(path) {
    const links = document.querySelectorAll('#admin-sidebar a, .admin-tab-pill');
    links.forEach(a => {
      const href = a.getAttribute('href')?.replace('#', '') || '';
      if (path === href || (href !== '/admin' && path.startsWith(href))) {
        a.classList.add('bg-indigo-600', 'text-white', 'font-bold', 'shadow-sm');
        a.classList.remove('text-slate-400', 'text-slate-300', 'hover:bg-slate-800');
      } else {
        a.classList.remove('bg-indigo-600', 'text-white', 'font-bold', 'shadow-sm');
        a.classList.add('text-slate-300', 'hover:bg-slate-800');
      }
    });
  },

  updateNavbarUserUI() {
    const user = window.Auth.getCurrentUser();
    const userNav = document.getElementById('navbar-user-section');
    const mobileUserNav = document.getElementById('mobile-user-section');

    const t = (key, fallback) => window.I18N ? window.I18N.t(key, fallback) : fallback;

    if (user && window.Auth.isAuthenticated()) {
      const unreadNotifs = (window.DB && typeof window.DB.get === 'function')
        ? window.DB.get('notifications').filter(n => n.userId === user.id && !n.read).length
        : 0;

      const roleBadgeLabel = (user.role === 'admin' || user.role === 'super_admin')
        ? t('roleAdmin', 'ایڈمنسٹریٹر')
        : (user.role === 'instructor' ? t('roleInstructor', 'استاد محترم') : t('roleStudent', 'طالب علم'));

      if (userNav) {
        userNav.innerHTML = `
          <div class="flex items-center gap-3">
            <!-- Role Pill -->
            <span class="hidden sm:inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl text-[11px] font-bold text-indigo-600 dark:text-indigo-400 font-urdu border border-slate-200 dark:border-slate-700/60">
              <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
              <span>${roleBadgeLabel}</span>
            </span>

            <!-- Notification Bell -->
            <a href="#/notifications" class="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="${t('navNotifications', 'اطلاعات')}">
              <i data-lucide="bell" class="w-5 h-5"></i>
              ${unreadNotifs > 0 ? `
                <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
              ` : ''}
            </a>

            <!-- User Dropdown Menu -->
            <div class="relative group">
              <button class="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="w-8 h-8 rounded-full object-cover border border-indigo-200 shadow-sm" alt="${user.name}">
                <span class="text-xs font-bold text-slate-900 dark:text-white hidden sm:inline">${user.name.split(' ')[0]}</span>
                <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400"></i>
              </button>

              <div class="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 hidden group-hover:block z-50 font-urdu text-right" dir="rtl">
                <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div class="text-xs font-bold text-slate-900 dark:text-white">${user.name}</div>
                  <div class="text-[10px] text-slate-400 truncate" dir="ltr">${user.email}</div>
                </div>
                <a href="#/dashboard" class="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950">
                  <i data-lucide="layout-dashboard" class="w-4 h-4 text-indigo-500"></i> ${t('navDashboard', 'ڈیش بورڈ')}
                </a>
                <a href="#/profile" class="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950">
                  <i data-lucide="user" class="w-4 h-4 text-indigo-500"></i> ${t('profileSettings', 'پروفائل اور ترتیبات')}
                </a>
                <a href="#/certificates" class="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950">
                  <i data-lucide="award" class="w-4 h-4 text-indigo-500"></i> ${t('navCertificates', 'اسناد و سرٹیفکیٹس')}
                </a>
                ${window.Auth.isAdmin() ? `
                  <a href="#/admin" class="flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40">
                    <i data-lucide="shield" class="w-4 h-4 text-amber-500"></i> ${t('navAdmin', 'ایڈمن پینل')}
                  </a>
                ` : ''}
                <div class="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                <button onclick="window.Auth.logout(); window.Router.navigate('/login');" class="w-full text-right flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40">
                  <i data-lucide="log-out" class="w-4 h-4"></i> ${t('navSignOut', 'لاگ آؤٹ')}
                </button>
              </div>
            </div>
          </div>
        `;
      }

      if (mobileUserNav) {
        mobileUserNav.innerHTML = `
          <div class="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5 min-w-0">
              <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="w-9 h-9 rounded-xl object-cover border border-emerald-500/50 shadow-sm shrink-0" alt="${user.name}">
              <div class="min-w-0">
                <div class="font-bold text-slate-900 dark:text-white truncate text-xs">${user.name}</div>
                <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">${roleBadgeLabel}</div>
              </div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              ${window.Auth.isAdmin() ? `
                <a href="#/admin" onclick="document.getElementById('mobile-menu-drawer').classList.add('hidden')" class="p-2 rounded-xl bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 transition" title="ایڈمن پینل">
                  <i data-lucide="shield" class="w-4 h-4"></i>
                </a>
              ` : ''}
              <button onclick="window.Auth.logout(); window.Router.navigate('/login');" class="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition" title="لاگ آؤٹ">
                <i data-lucide="log-out" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        `;
      }
    } else {
      if (userNav) {
        userNav.innerHTML = `
          <div class="flex items-center gap-2 font-urdu" dir="rtl">
            <a href="#/login" class="btn-secondary py-1.5 px-3 text-xs rounded-lg">${t('navSignIn', 'لاگ اِن')}</a>
            <a href="#/register" class="btn-primary py-1.5 px-3.5 text-xs rounded-lg">${t('navGetStarted', 'اکاؤنٹ بنائیں')}</a>
          </div>
        `;
      }
      if (mobileUserNav) {
        mobileUserNav.innerHTML = `
          <div class="grid grid-cols-2 gap-2 pt-1 font-urdu">
            <a href="#/login" onclick="document.getElementById('mobile-menu-drawer').classList.add('hidden')" class="btn-secondary py-2 text-center text-xs rounded-xl">${t('navSignIn', 'لاگ اِن')}</a>
            <a href="#/register" onclick="document.getElementById('mobile-menu-drawer').classList.add('hidden')" class="btn-primary py-2 text-center text-xs rounded-xl">${t('navGetStarted', 'اکاؤنٹ بنائیں')}</a>
          </div>
        `;
      }
    }
    if (window.lucide) window.lucide.createIcons();
  },

  setupGlobalEvents() {
    // Omnibar Shortcut (Ctrl+K or Cmd+K)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openOmnibar();
      }
    });

    // Check if running as installed standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      this.isAppInstalled = true;
    }

    // Capture Native PWA / Android Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      console.log('[PWA] beforeinstallprompt event captured and deferred');
      this.updateInstallButtonUI(true);
    });

    // Native App Installed Event
    window.addEventListener('appinstalled', () => {
      this.deferredInstallPrompt = null;
      this.isAppInstalled = true;
      console.log('[PWA] LearnHub successfully installed');
      this.updateInstallButtonUI(false);
      this.showToast('LearnHub ایپ کامیابی کے ساتھ انسٹال ہو گئی ہے!', 'success');
    });

    // Smart Mobile Menu Drawer Auto-Close on Scroll Down
    let lastScrollPos = window.scrollY;
    window.addEventListener('scroll', () => {
      const drawer = document.getElementById('mobile-menu-drawer');
      if (drawer && !drawer.classList.contains('hidden')) {
        if (Math.abs(window.scrollY - lastScrollPos) > 30) {
          drawer.classList.add('hidden');
        }
      }
      lastScrollPos = window.scrollY;
    }, { passive: true });

    // Smart Mobile Menu Drawer Auto-Close on Outside Click
    document.addEventListener('click', (e) => {
      const drawer = document.getElementById('mobile-menu-drawer');
      const toggleBtn = e.target.closest('button[onclick*="mobile-menu-drawer"]');
      if (drawer && !drawer.classList.contains('hidden')) {
        if (!drawer.contains(e.target) && !toggleBtn) {
          drawer.classList.add('hidden');
        }
      }
    });

    // Close Mobile Drawer on Route Change
    window.addEventListener('hashchange', () => {
      const drawer = document.getElementById('mobile-menu-drawer');
      if (drawer) drawer.classList.add('hidden');
    });
  },

  // 1-Click PWA / Android Native App Installer
  async promptInstallPWA() {
    if (this.deferredInstallPrompt) {
      this.deferredInstallPrompt.prompt();
      const { outcome } = await this.deferredInstallPrompt.userChoice;
      console.log(`[PWA] Install prompt outcome: ${outcome}`);
      if (outcome === 'accepted') {
        this.showToast('LearnHub ایپ انسٹال ہو رہی ہے...', 'success');
      } else {
        this.showToast('انسٹالیشن منسوخ کر دی گئی', 'info');
      }
      this.deferredInstallPrompt = null;
      this.updateInstallButtonUI(false);
    } else {
      if (this.isAppInstalled) {
        this.showToast('LearnHub ایپ پہلے سے ہی آپ کے ڈیوائس پر انسٹال شدہ ہے۔', 'success');
      } else {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) {
          this.showModal('ایپ انسٹال کریں (iOS Safari)', `
            <div class="space-y-3 font-urdu text-right" dir="rtl">
              <p class="text-xs text-slate-600 dark:text-slate-300">
                اپنے آئی فون یا آئی پیڈ پر LearnHub انسٹال کرنے کے لیے درج ذیل مراحل پر عمل کریں:
              </p>
              <div class="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-2xl space-y-2.5 text-xs">
                <div class="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shrink-0 font-sans font-bold">1</span>
                  <span>سفاری براؤزر کے نیچے شیئر (Share) کے آئیکن پر کلک کریں۔</span>
                </div>
                <div class="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shrink-0 font-sans font-bold">2</span>
                  <span>مینو کو اوپر کر کے <strong>"Add to Home Screen"</strong> منتخب کریں۔</span>
                </div>
                <div class="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shrink-0 font-sans font-bold">3</span>
                  <span>اوپر دائیں جانب <strong>"Add"</strong> کا بٹن دبائیں۔</span>
                </div>
              </div>
            </div>
          `);
        } else {
          this.showModal('ایپ انسٹال کریں (Google Play / PWA)', `
            <div class="space-y-4 font-urdu text-right" dir="rtl">
              <div class="flex items-center gap-3.5 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-600/30">
                  <i data-lucide="download" class="w-6 h-6"></i>
                </div>
                <div>
                  <h4 class="text-sm font-extrabold text-slate-900 dark:text-white">LearnHub — مستند اسلامی اکیڈمی</h4>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400">تیز رفتار، محفوظ اور مکمل آف لائن سپورٹ</p>
                </div>
              </div>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                براؤزر مینو (تین ڈاٹس ⋮) میں جا کر <strong>"Install app"</strong> یا <strong>"Add to Home Screen"</strong> پر کلک کر کے ایپ ڈاؤن لوڈ کر سکتے ہیں۔
              </p>
              <div class="flex justify-end">
                <button onclick="window.App.closeModal()" class="w-full btn-primary py-2.5 text-xs font-bold rounded-xl shadow-md">سمجھ گیا</button>
              </div>
            </div>
          `);
        }
      }
    }
  },

  updateInstallButtonUI(isAvailable) {
    const btn = document.getElementById('pwa-install-btn');
    if (!btn) return;
    if (this.isAppInstalled) {
      btn.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-emerald-300"></i><span>ایپ انسٹال شدہ ہے</span>`;
      btn.classList.remove('from-emerald-600', 'to-teal-600');
      btn.classList.add('bg-slate-700', 'text-slate-300');
    } else if (isAvailable) {
      btn.classList.remove('hidden');
    }
    if (window.lucide) window.lucide.createIcons();
  },

  initAuthListener() {
    window.addEventListener('learnhub:auth_changed', () => {
      this.updateNavbarUserUI();
    });
  },

  // Global Toast Notifications
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `p-4 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold transition-all duration-300 transform translate-y-4 opacity-0 text-white ${
      type === 'success' ? 'bg-emerald-600' :
      type === 'danger' ? 'bg-rose-600' :
      type === 'warning' ? 'bg-amber-600' : 'bg-indigo-600'
    }`;

    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle' : type === 'danger' ? 'alert-circle' : 'info'}" class="w-4 h-4 shrink-0"></i>
      <span class="flex-1">${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    // Trigger animation
    setTimeout(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-x-full');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // Global Modals
  showModal(title, bodyHtml) {
    const modal = document.getElementById('global-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (!modal) return;

    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml;
    modal.classList.remove('hidden');

    if (window.lucide) window.lucide.createIcons();
  },

  closeModal() {
    const modal = document.getElementById('global-modal');
    if (modal) modal.classList.add('hidden');
  },

  // Global Omnibar Search (Courses, Quizzes, Instructors, Categories, Resources)
  openOmnibar() {
    this.showModal('Global Universal Search', `
      <div class="space-y-4">
        <div class="relative">
          <input 
            type="text" 
            id="omnibar-input"
            placeholder="Search across courses, standalone quizzes, instructors, lessons, resources..." 
            class="form-input py-3 pl-10 text-sm rounded-xl"
            oninput="window.App.handleOmnibarSearch(this.value)"
            autofocus
          />
          <i data-lucide="search" class="w-5 h-5 text-slate-400 absolute left-3 top-3.5"></i>
        </div>

        <div id="omnibar-results" class="max-h-80 overflow-y-auto space-y-2 text-xs">
          <p class="text-slate-400 text-center py-6">Type keywords to search LearnHub instantly...</p>
        </div>
      </div>
    `);
  },

  async handleOmnibarSearch(query) {
    const resultsContainer = document.getElementById('omnibar-results');
    if (!resultsContainer) return;

    if (!query || query.trim().length === 0) {
      resultsContainer.innerHTML = `<p class="text-slate-400 text-center py-6">Type keywords to search LearnHub instantly...</p>`;
      return;
    }

    const { courses, quizzes, instructors, categories, resources } = await window.API.globalSearch(query);

    const totalCount = courses.length + quizzes.length + instructors.length + categories.length + resources.length;

    if (totalCount === 0) {
      resultsContainer.innerHTML = `<p class="text-slate-400 text-center py-6">No matching results found for "${query}".</p>`;
      return;
    }

    let html = '';

    if (courses.length > 0) {
      html += `<div class="font-bold text-slate-400 uppercase text-[10px] pt-1">Courses (${courses.length})</div>`;
      courses.forEach(c => {
        html += `
          <a href="#/courses/${c.id}" onclick="window.App.closeModal()" class="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition block">
            <img src="${c.thumbnail}" class="w-10 h-7 rounded object-cover">
            <div class="flex-1 min-w-0">
              <div class="font-bold text-slate-900 dark:text-white truncate">${c.title}</div>
              <div class="text-[10px] text-slate-400">${c.category?.name || 'Tech'} • ${c.isFree ? 'FREE' : '$' + c.price}</div>
            </div>
          </a>
        `;
      });
    }

    if (quizzes.length > 0) {
      html += `<div class="font-bold text-cyan-500 uppercase text-[10px] pt-2">Standalone Quizzes (${quizzes.length})</div>`;
      quizzes.forEach(q => {
        html += `
          <a href="#/quiz-take/${q.id}" onclick="window.App.closeModal()" class="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition block">
            <div class="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold">
              <i data-lucide="zap" class="w-4 h-4"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-bold text-slate-900 dark:text-white truncate">${q.title}</div>
              <div class="text-[10px] text-slate-400">${q.difficulty} • ${q.timeLimitMinutes} mins</div>
            </div>
          </a>
        `;
      });
    }

    if (instructors.length > 0) {
      html += `<div class="font-bold text-indigo-500 uppercase text-[10px] pt-2">Instructors</div>`;
      instructors.forEach(inst => {
        html += `
          <div class="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            <img src="${inst.avatar}" class="w-7 h-7 rounded-full object-cover">
            <span class="font-bold text-slate-900 dark:text-white">${inst.name}</span>
            <span class="text-[10px] text-slate-400">${inst.title}</span>
          </div>
        `;
      });
    }

    resultsContainer.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  },

  renderAuthPage(mode = 'login') {
    if (mode === 'register') {
      return window.Views.renderRegister();
    }
    return window.Views.renderLogin();
  },

  showLoading(isLoading) {
    const loader = document.getElementById('global-loader');
    if (loader) {
      if (isLoading) loader.classList.remove('hidden');
      else loader.classList.add('hidden');
    }
  },

  renderError(msg) {
    const container = document.getElementById('main-content');
    container.innerHTML = `
      <div class="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div class="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl">⚠️</div>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white">Something Went Wrong</h2>
        <p class="text-xs text-slate-500">${msg}</p>
        <button onclick="window.Router.navigate('/')" class="btn-primary py-2 px-4 text-xs">Return Home</button>
      </div>
    `;
  }
};

window.Views.renderNotFound = function(path) {
  const container = document.getElementById('main-content');
  container.innerHTML = `
    <div class="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
      <div class="text-6xl font-extrabold gradient-text">404</div>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Page Not Found</h2>
      <p class="text-xs text-slate-500">The requested route <code>#${path}</code> does not exist.</p>
      <a href="#/" class="btn-primary py-2 px-5 text-xs rounded-xl">Back to Homepage</a>
    </div>
  `;
};

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});

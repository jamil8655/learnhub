/**
 * LearnHub Core Application Controller & UI Shell Manager
 */

window.App = {
  isDarkMode: false,
  deferredInstallPrompt: null,
  isAppInstalled: false,

  init() {
    // Step 1: Ensure active session is loaded into Auth
    try {
      if (window.Auth && typeof window.Auth.loadSession === 'function') {
        window.Auth.currentUser = window.Auth.loadSession();
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
    const mode = window.UI_CONFIG ? window.UI_CONFIG.getTheme() : (localStorage.getItem('learnhub_theme_mode') || (localStorage.getItem('learnhub_dark_mode') === 'true' ? 'dark' : 'light'));
    if (window.UI_CONFIG) {
      window.UI_CONFIG.setTheme(mode);
    } else {
      document.documentElement.classList.remove('dark', 'sepia-theme');
      if (mode === 'dark') document.documentElement.classList.add('dark');
      else if (mode === 'sepia') document.documentElement.classList.add('sepia-theme');
    }
  },

  toggleDarkMode() {
    const current = window.UI_CONFIG ? window.UI_CONFIG.getTheme() : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    if (window.UI_CONFIG) {
      window.UI_CONFIG.setTheme(next);
    } else {
      this.isDarkMode = next === 'dark';
      document.documentElement.classList.toggle('dark', this.isDarkMode);
    }
    this.showToast(next === 'dark' ? 'Dark Mode enabled' : 'Light Mode enabled', 'info');
  },

  registerRoutes() {
    const R = window.Router;

    // Public & User Routes
    R.addRoute('/', () => window.Views.renderHome());
    R.addRoute('/courses', (params, query) => {
      if (window.UI_CONFIG && window.UI_CONFIG.getVersion() === 'v2' && window.Views.v2 && typeof window.Views.v2.renderCourses === 'function') {
        return window.Views.v2.renderCourses(params, query);
      }
      return window.Views.renderCourses(params, query);
    });
    R.addRoute('/courses/:id', (params) => window.Views.renderCourseDetails(params));
    R.addRoute('/learn/:courseId', (params) => window.Views.renderLearningPlayer(params), { isDistractionFree: true });
    R.addRoute('/learn/:courseId/:lessonId', (params) => window.Views.renderLearningPlayer(params), { isDistractionFree: true });
    
    // ISLAMIC ADVENTURE GAME ECOSYSTEM (9 Realms, Interactive Puzzles & Sagas)
    R.addRoute('/adventure', (params, query) => window.Views.renderAdventureGame(params, query));
    R.addRoute('/adventure/world/:worldId', (params, query) => window.Views.renderAdventureGame(params, query));
    R.addRoute('/adventure/stage/:stageId', (params, query) => window.Views.renderAdventureGame(params, query));
    R.addRoute('/quizzes', (params, query) => {
      if (window.UI_CONFIG && window.UI_CONFIG.getVersion() === 'v2' && window.Views.v2 && typeof window.Views.v2.renderQuizzes === 'function') {
        return window.Views.v2.renderQuizzes(params, query);
      }
      return window.Views.renderAdventureGame(params, query);
    });
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
    R.addRoute('/dashboard', (params, query) => {
      if (window.UI_CONFIG && window.UI_CONFIG.getVersion() === 'v2' && window.Views.v2 && typeof window.Views.v2.renderDashboard === 'function') {
        return window.Views.v2.renderDashboard(params, query);
      }
      return window.Views.renderDashboard(params, query);
    }, { requiresAuth: true });
    R.addRoute('/my-courses', (params, query) => {
      if (window.UI_CONFIG && window.UI_CONFIG.getVersion() === 'v2' && window.Views.v2 && typeof window.Views.v2.renderDashboard === 'function') {
        return window.Views.v2.renderDashboard(params, query);
      }
      return window.Views.renderDashboard(params, query);
    }, { requiresAuth: true });
    R.addRoute('/profile', (params, query) => {
      if (window.UI_CONFIG && window.UI_CONFIG.getVersion() === 'v2' && window.Views.v2 && typeof window.Views.v2.renderProfile === 'function') {
        return window.Views.v2.renderProfile(params, query);
      }
      return window.Views.renderProfile(params, query);
    }, { requiresAuth: true });
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
    R.addRoute('/library', (params, query) => window.Views.renderIslamicLibrary(query?.cat || 'all'));
    R.addRoute('/books', (params, query) => window.Views.renderIslamicLibrary(query?.cat || 'all'));
    R.addRoute('/kutubkhana', (params, query) => window.Views.renderIslamicLibrary(query?.cat || 'all'));
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
    R.addRoute('/notes', () => window.Views.renderStudyNotes());
    R.addRoute('/study-notes', () => window.Views.renderStudyNotes());
    R.addRoute('/zakat', () => window.Views.renderZakatCalculator());
    R.addRoute('/zakat-calculator', () => window.Views.renderZakatCalculator());
    R.addRoute('/azkar', () => window.Views.renderDailyAzkar());
    R.addRoute('/daily-azkar', () => window.Views.renderDailyAzkar());
    R.addRoute('/masnoon-duas', () => window.Views.renderDailyAzkar());
    R.addRoute('/read/:id', (params) => window.Views.renderBookReader(params));
    R.addRoute('/book/:id', (params) => window.Views.renderBookReader(params));
    R.addRoute('/books/:id', (params) => window.Views.renderBookReader(params));
    R.addRoute('/library/:id', (params) => window.Views.renderBookReader(params));

    // Instructor Hub Routes
    R.addRoute('/instructor/students', () => window.Views.instructor ? window.Views.instructor.renderStudents() : window.Router.navigate('/instructor/dashboard'), { requiresInstructor: true });

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
    R.addRoute('/admin/dashboard', () => window.Views.admin.renderDashboard(), { requiresAdmin: true });
    R.addRoute('/admin/releases', () => window.Views.admin.renderReleaseManager(), { requiresAdmin: true });
    R.addRoute('/admin/game-studio', () => window.Views.admin.renderGameStudio(), { requiresAdmin: true });
    R.addRoute('/admin/courses', () => window.Views.admin.renderCourses(), { requiresAdmin: true });
    R.addRoute('/admin/books', (params, query) => window.Views.admin.renderBooks(query?.cat || 'all'), { requiresAdmin: true });
    R.addRoute('/admin/library', (params, query) => window.Views.admin.renderBooks(query?.cat || 'all'), { requiresAdmin: true });
    R.addRoute('/admin/content', (params, query) => window.Views.admin.renderBooks(query?.cat || 'all'), { requiresAdmin: true });
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
    R.addRoute('/admin/articles', () => window.Views.admin.renderAnnouncements(), { requiresAdmin: true });
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

  renderAdminStagingRibbon() {
    const isAdmin = window.Auth && typeof window.Auth.isAdmin === 'function' && window.Auth.isAdmin();
    const existingRibbon = document.getElementById('admin-staging-ribbon');

    if (!isAdmin) {
      if (existingRibbon) existingRibbon.remove();
      return;
    }

    const summary = (window.DB && typeof window.DB.getStagedDraftsSummary === 'function')
      ? window.DB.getStagedDraftsSummary()
      : { totalDrafts: 0 };

    const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;
    const isRtl = window.I18N ? window.I18N.isRTL() : false;
    const lang = window.I18N ? window.I18N.getLanguage() : 'en';
    const fontClass = lang === 'ur' ? 'font-urdu' : (lang === 'ar' ? 'font-arabic' : 'font-sans');

    const ribbonHtml = `
      <div id="admin-staging-ribbon" class="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white text-xs px-3 sm:px-6 py-2 border-b-2 border-amber-500/80 flex flex-wrap items-center justify-between gap-2 shadow-xl z-50 ${fontClass} sticky top-0" dir="${isRtl ? 'rtl' : 'ltr'}">
        <div class="flex items-center gap-2.5">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
          <span class="font-extrabold text-amber-300">🛡️ ${t('adminDraft', 'Admin Live Preview')}:</span>
          <span class="text-slate-200 hidden sm:inline">
            ${lang === 'en' 
              ? `You are in Admin Live Preview mode (${summary.totalDrafts} staged changes). Students only see published content.` 
              : (lang === 'ar' 
                  ? `أنت في وضع المعاينة المباشرة للإدارة (${summary.totalDrafts} تعديل محفوظ). الطلاب يشاهدون المنشور فقط.` 
                  : `آپ کو تمام نئے مسودات اور ترامیم لائیو نظر آ رہی ہیں (${summary.totalDrafts} ترامیم موجود ہیں) — دیگر طلباء کے لیے یہ خفیہ ہیں۔`)}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <a href="#/admin/releases" class="py-1 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow transition">
            <i data-lucide="rocket" class="w-3.5 h-3.5"></i>
            <span>${t('adminSidebarReleases', 'Release Hub')}</span>
          </a>
          ${summary.totalDrafts > 0 ? `
            <button onclick="window.App.quickDeployFromRibbon()" class="py-1 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow transition">
              <i data-lucide="upload-cloud" class="w-3.5 h-3.5"></i>
              <span>${t('adminDeployAll', 'Deploy All to Live 🚀')}</span>
            </button>
          ` : ''}
        </div>
      </div>
    `;

    if (!existingRibbon) {
      document.body.insertAdjacentHTML('afterbegin', ribbonHtml);
    } else {
      existingRibbon.outerHTML = ribbonHtml;
    }
    if (window.lucide) window.lucide.createIcons();
  },

  quickDeployFromRibbon() {
    if (confirm('کیا آپ تمام ترامیم اور مسودات کو فوراً تمام طلباء کے لیے لائیو شائع کرنا چاہتے ہیں؟')) {
      const count = window.DB ? window.DB.publishAllStagedDrafts() : 0;
      this.showToast(`🎉 مبارک! تمام ${count} ترامیم لائیو شائع ہو گئیں!`, 'success');
      this.renderAdminStagingRibbon();
      window.Router.handleRouting();
    }
  },

  updateNavbarUserUI() {
    this.renderAdminStagingRibbon();
    const user = window.Auth.getCurrentUser();
    const userNav = document.getElementById('navbar-user-section');
    const mobileUserNav = document.getElementById('mobile-user-section');

    const t = (key, fallback) => window.I18N ? window.I18N.t(key, fallback) : fallback;
    const isRtl = window.I18N ? window.I18N.isRTL() : false;
    const lang = window.I18N ? window.I18N.getLanguage() : 'en';

    if (user && window.Auth.isAuthenticated()) {
      const unreadNotifs = (window.DB && typeof window.DB.get === 'function')
        ? window.DB.get('notifications').filter(n => n.userId === user.id && !n.read).length
        : 0;

      const roleBadgeLabel = (user.role === 'admin' || user.role === 'super_admin')
        ? t('roleAdmin', 'Administrator')
        : (user.role === 'instructor' ? t('roleInstructor', 'Instructor') : t('roleStudent', 'Student'));

      if (userNav) {
        userNav.innerHTML = `
          <div class="flex items-center gap-2 sm:gap-3">
            <!-- Role Pill (Desktop) -->
            <span class="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/40 dark:to-teal-950/40 px-3 py-1.5 rounded-xl text-[11px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 shadow-sm">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-amber-500"></i>
              <span>${roleBadgeLabel}</span>
            </span>

            <!-- Notification Bell -->
            <a href="#/notifications" class="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="${t('navNotifications', 'Notifications')}">
              <i data-lucide="bell" class="w-5 h-5"></i>
              ${unreadNotifs > 0 ? `
                <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              ` : ''}
            </a>

            <!-- User Dropdown Menu (Desktop Only — on mobile/tablet, mobile drawer is used) -->
            <div class="relative group hidden lg:block">
              <button class="flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="w-8 h-8 rounded-xl object-cover border-2 border-emerald-500/60 shadow-md" alt="${user.name}">
                <span class="text-xs font-bold text-slate-900 dark:text-white">${user.name.split(' ')[0]}</span>
                <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400"></i>
              </button>

              <div class="absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 hidden group-hover:block z-50 text-start" dir="${isRtl ? 'rtl' : 'ltr'}">
                <!-- User Header -->
                <div class="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 rounded-t-3xl flex items-center gap-3">
                  <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="w-10 h-10 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0" alt="${user.name}">
                  <div class="min-w-0 flex-1">
                    <div class="text-xs font-extrabold text-slate-900 dark:text-white truncate">${user.name}</div>
                    <div class="text-[10px] text-slate-400 truncate" dir="ltr">${user.email}</div>
                  </div>
                </div>

                <div class="p-2 space-y-3">
                  <!-- Category 1: Personal Portal -->
                  <div>
                    <div class="px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">🎓 ${t('userMenuPersonalPortal', 'Personal Academic Portal')}</div>
                    <div class="space-y-0.5">
                      <a href="#/dashboard" class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 transition">
                        <i data-lucide="layout-dashboard" class="w-4 h-4 text-emerald-500"></i> <span>${t('userStudentDashboard', 'Student Dashboard')}</span>
                      </a>
                      <a href="#/profile" class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 transition">
                        <i data-lucide="user" class="w-4 h-4 text-indigo-500"></i> <span>${t('profileSettings', 'Profile & Settings')}</span>
                      </a>
                      <a href="#/certificates" class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 transition">
                        <i data-lucide="shield-check" class="w-4 h-4 text-amber-500"></i> <span>${t('userRoyalCertificates', 'Royal Certificates')}</span>
                      </a>
                      <a href="#/notes" class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 transition">
                        <i data-lucide="file-text" class="w-4 h-4 text-teal-500"></i> <span>${t('userStudyNotes', 'Personal Study Notes')}</span>
                      </a>
                    </div>
                  </div>

                  <!-- Category 2: Islamic Centers -->
                  <div class="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div class="px-2.5 py-1 text-[10px] font-bold text-amber-500 uppercase tracking-wider">📖 ${t('userMenuIslamicCenters', 'Islamic & Knowledge Hubs')}</div>
                    <div class="space-y-0.5">
                      <a href="#/quran" class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-500 transition">
                        <i data-lucide="book-marked" class="w-4 h-4 text-emerald-500"></i> <span>${t('navQuran', 'The Noble Quran (114 Surahs)')}</span>
                      </a>
                      <a href="#/library" class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-500 transition">
                        <i data-lucide="library" class="w-4 h-4 text-indigo-500"></i> <span>${t('navLibrary', 'Digital Library (300+ Books)')}</span>
                      </a>
                      <a href="#/adventure" class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-500 transition">
                        <i data-lucide="gamepad-2" class="w-4 h-4 text-purple-500"></i> <span>${t('navAdventure', 'Islamic Adventure Game')}</span>
                      </a>
                    </div>
                  </div>

                  <!-- Category 3: Admin & Account Control -->
                  <div class="pt-1 border-t border-slate-100 dark:border-slate-800">
                    ${window.Auth.isAdmin() ? `
                      <a href="#/admin" class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-black text-amber-600 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition mb-1 shadow-sm">
                        <i data-lucide="shield" class="w-4 h-4 text-amber-500"></i> <span>${t('navAdmin', 'Central Admin Console')}</span>
                      </a>
                    ` : ''}
                    <a href="#/support" class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                      <i data-lucide="message-square" class="w-4 h-4 text-cyan-500"></i> <span>${t('navSupport', '24/7 Customer Support')}</span>
                    </a>
                    <button onclick="window.Auth.logout(); window.Router.navigate('/login');" class="w-full text-start flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition">
                      <i data-lucide="log-out" class="w-4 h-4 text-rose-500"></i> <span>${t('navSignOut', 'Sign Out')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      if (mobileUserNav) {
        mobileUserNav.innerHTML = `
          <div class="p-3 bg-gradient-to-r from-slate-900 to-slate-950 rounded-2xl border border-emerald-500/30 shadow-lg flex items-center justify-between gap-3 text-start" dir="${isRtl ? 'rtl' : 'ltr'}">
            <div class="flex items-center gap-2.5 min-w-0">
              <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="w-10 h-10 rounded-xl object-cover border-2 border-amber-400 shadow-md shrink-0" alt="${user.name}">
              <div class="min-w-0">
                <div class="font-extrabold text-white truncate text-xs">${user.name}</div>
                <div class="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <i data-lucide="shield-check" class="w-3 h-3 text-amber-400"></i> ${roleBadgeLabel}
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              ${window.Auth.isAdmin() ? `
                <a href="#/admin" onclick="document.getElementById('mobile-menu-drawer').classList.add('hidden')" class="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30 transition shadow-sm" title="${t('navAdmin', 'Admin Console')}">
                  <i data-lucide="shield" class="w-4 h-4"></i>
                </a>
              ` : ''}
              <a href="#/profile" onclick="document.getElementById('mobile-menu-drawer').classList.add('hidden')" class="p-2 rounded-xl bg-slate-800 text-indigo-400 hover:bg-slate-700 transition" title="${t('profileSettings', 'Profile')}">
                <i data-lucide="user" class="w-4 h-4"></i>
              </a>
              <button onclick="window.Auth.logout(); window.Router.navigate('/login');" class="p-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition" title="${t('navSignOut', 'Sign Out')}">
                <i data-lucide="log-out" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        `;
      }
    } else {
      if (userNav) {
        userNav.innerHTML = `
          <div class="flex items-center gap-1.5" dir="${isRtl ? 'rtl' : 'ltr'}">
            <a href="#/login" class="py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-900/20 transition flex items-center gap-1">
              <i data-lucide="log-in" class="w-3.5 h-3.5"></i>
              <span data-i18n="navSignIn">${t('navSignIn', 'Sign In')}</span>
            </a>
            <a href="#/register" class="hidden md:inline-flex py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition">
              <span data-i18n="navGetStarted">${t('navGetStarted', 'Get Started Free')}</span>
            </a>
          </div>
        `;
      }
      if (mobileUserNav) {
        mobileUserNav.innerHTML = `
          <div class="grid grid-cols-2 gap-2 pt-1" dir="${isRtl ? 'rtl' : 'ltr'}">
            <a href="#/login" onclick="document.getElementById('mobile-menu-drawer').classList.add('hidden')" class="py-2.5 px-3 text-center text-xs font-black rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md flex items-center justify-center gap-1.5">
              <i data-lucide="log-in" class="w-3.5 h-3.5"></i>
              <span data-i18n="navSignIn">${t('navSignIn', 'Sign In')}</span>
            </a>
            <a href="#/register" onclick="document.getElementById('mobile-menu-drawer').classList.add('hidden')" class="py-2.5 px-3 text-center text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <span data-i18n="navGetStarted">${t('navGetStarted', 'Get Started Free')}</span>
            </a>
          </div>
        `;
      }
    }

    // Dynamic Bottom Navigation Tab 5 Update (Dashboard vs Login)
    const bottomNavFifthTab = document.querySelector('#app-bottom-nav a[data-path="/dashboard"], #app-bottom-nav a[data-path="/login"]');
    if (bottomNavFifthTab) {
      if (user && window.Auth.isAuthenticated()) {
        bottomNavFifthTab.setAttribute('href', '#/dashboard');
        bottomNavFifthTab.setAttribute('data-path', '/dashboard');
        bottomNavFifthTab.innerHTML = `
          <i data-lucide="layout-dashboard" class="w-5 h-5 mb-0.5 shrink-0"></i>
          <span class="text-[10px] font-bold truncate w-full" data-i18n="bottomNavDashboard">${t('bottomNavDashboard', 'Dashboard')}</span>
        `;
      } else {
        bottomNavFifthTab.setAttribute('href', '#/login');
        bottomNavFifthTab.setAttribute('data-path', '/login');
        bottomNavFifthTab.innerHTML = `
          <i data-lucide="log-in" class="w-5 h-5 mb-0.5 shrink-0 text-emerald-400"></i>
          <span class="text-[10px] font-extrabold truncate w-full text-emerald-400" data-i18n="bottomNavSignIn">${t('bottomNavSignIn', 'Sign In')}</span>
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
    window.addEventListener('learnhub:ui_version_changed', () => {
      this.updateNavbarUserUI();
      if (window.Views && window.Views.v2 && typeof window.Views.v2.renderNavigation === 'function') {
        window.Views.v2.renderNavigation();
      }
      if (window.Router && typeof window.Router.handleRouting === 'function') {
        window.Router.handleRouting();
      }
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

  // Global Omnibar Search (Courses, Quizzes, Books, Hadith, Instructors)
  openOmnibar() {
    const modal = document.getElementById('search-omnibar-modal');
    if (modal) {
      modal.classList.remove('hidden');
      const input = document.getElementById('omnibar-input');
      if (input) {
        input.value = '';
        input.focus();
      }
      const resultsContainer = document.getElementById('omnibar-results');
      if (resultsContainer) {
        const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;
        resultsContainer.innerHTML = `<p class="text-slate-400 text-center py-6" data-i18n="searchOmnibarInitial">${t('searchOmnibarInitial', 'Type keywords to search LearnHub instantly...')}</p>`;
      }
      this.activeOmnibarFilter = 'all';
      this.updateOmnibarFilterButtons();
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;
    this.showModal(t('searchOmnibarTitle', 'Universal Global Search'), `
      <div class="space-y-4">
        <div class="relative">
          <input 
            type="text" 
            id="omnibar-input"
            data-i18n-placeholder="searchOmnibarPlaceholder"
            placeholder="${t('searchOmnibarPlaceholder', 'Search across courses, books, hadith, quizzes, instructors...')}" 
            class="form-input py-3 pl-10 pr-4 text-sm rounded-xl w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            oninput="window.App.handleOmnibarSearch(this.value)"
            autofocus
          />
          <i data-lucide="search" class="w-5 h-5 text-slate-400 absolute left-3 top-3.5"></i>
        </div>

        <div id="omnibar-results" class="max-h-80 overflow-y-auto space-y-2 text-xs">
          <p class="text-slate-400 text-center py-6" data-i18n="searchOmnibarInitial">${t('searchOmnibarInitial', 'Type keywords to search LearnHub instantly...')}</p>
        </div>
      </div>
    `);
  },

  closeOmnibar() {
    const modal = document.getElementById('search-omnibar-modal');
    if (modal) modal.classList.add('hidden');
    this.closeModal();
  },

  filterOmnibar(category) {
    this.activeOmnibarFilter = category;
    this.updateOmnibarFilterButtons();
    const input = document.getElementById('omnibar-input');
    if (input && input.value) {
      this.handleOmnibarSearch(input.value);
    }
  },

  updateOmnibarFilterButtons() {
    const buttons = document.querySelectorAll('.omnibar-filter-btn');
    buttons.forEach(btn => {
      const filter = btn.getAttribute('data-filter');
      if (filter === (this.activeOmnibarFilter || 'all')) {
        btn.className = 'omnibar-filter-btn px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px] shadow-sm';
      } else {
        btn.className = 'omnibar-filter-btn px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-[11px]';
      }
    });
  },

  async handleOmnibarSearch(query) {
    const resultsContainer = document.getElementById('omnibar-results');
    if (!resultsContainer) return;

    const t = (k, f) => window.I18N ? window.I18N.t(k, f) : f;

    if (!query || query.trim().length === 0) {
      resultsContainer.innerHTML = `<p class="text-slate-400 text-center py-6" data-i18n="searchOmnibarInitial">${t('searchOmnibarInitial', 'Type keywords to search LearnHub instantly...')}</p>`;
      return;
    }

    const filter = this.activeOmnibarFilter || 'all';
    let { courses = [], quizzes = [], books = [], hadiths = [], instructors = [] } = await window.API.globalSearch(query);

    if (filter === 'courses') { quizzes = []; books = []; hadiths = []; instructors = []; }
    else if (filter === 'books') { courses = []; quizzes = []; hadiths = []; instructors = []; }
    else if (filter === 'hadith') { courses = []; quizzes = []; books = []; instructors = []; }
    else if (filter === 'quizzes') { courses = []; books = []; hadiths = []; instructors = []; }
    else if (filter === 'instructors') { courses = []; quizzes = []; books = []; hadiths = []; }

    const totalCount = courses.length + quizzes.length + books.length + hadiths.length + instructors.length;

    if (totalCount === 0) {
      resultsContainer.innerHTML = `<p class="text-slate-400 text-center py-6">${t('searchNoResults', 'No matching results found for')} "${query}".</p>`;
      return;
    }

    let html = '';

    if (books.length > 0) {
      html += `<div class="font-bold text-amber-500 uppercase text-[10px] pt-1 flex items-center gap-1.5"><i data-lucide="book-marked" class="w-3.5 h-3.5"></i> <span>${t('searchSectionBooks', 'Classical Books & References')} (${books.length})</span></div>`;
      books.forEach(b => {
        html += `
          <a href="javascript:void(0)" onclick="window.App.closeOmnibar(); window.Views.openBookReader('${b.id}');" class="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition block">
            <img src="${b.cover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}" class="w-8 h-10 rounded object-cover shadow-sm">
            <div class="flex-1 min-w-0 text-start">
              <div class="font-bold text-slate-900 dark:text-white truncate">${b.title}</div>
              <div class="text-[10px] text-amber-600 dark:text-amber-400 font-bold">${b.author} • ${b.categoryName || t('navLibrary', 'Books')}</div>
            </div>
          </a>
        `;
      });
    }

    if (hadiths.length > 0) {
      html += `<div class="font-bold text-emerald-500 uppercase text-[10px] pt-2 flex items-center gap-1.5"><i data-lucide="scroll" class="w-3.5 h-3.5"></i> <span>${t('searchSectionHadith', 'Hadith Sciences')} (${hadiths.length})</span></div>`;
      hadiths.forEach(h => {
        html += `
          <a href="#/hadith" onclick="window.App.closeOmnibar()" class="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition block">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <i data-lucide="scroll" class="w-4 h-4"></i>
            </div>
            <div class="flex-1 min-w-0 text-start">
              <div class="font-bold text-slate-900 dark:text-white truncate">${h.title || t('navHadith', 'Hadith')}</div>
              <div class="text-[10px] text-slate-400 truncate">${h.urdu || h.translation || ''}</div>
            </div>
          </a>
        `;
      });
    }

    if (courses.length > 0) {
      html += `<div class="font-bold text-indigo-400 uppercase text-[10px] pt-2 flex items-center gap-1.5"><i data-lucide="book-open" class="w-3.5 h-3.5"></i> <span>${t('searchSectionCourses', 'Courses & Lessons')} (${courses.length})</span></div>`;
      courses.forEach(c => {
        html += `
          <a href="#/courses/${c.id}" onclick="window.App.closeOmnibar()" class="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition block">
            <img src="${c.thumbnail}" class="w-10 h-7 rounded object-cover shadow-sm">
            <div class="flex-1 min-w-0 text-start">
              <div class="font-bold text-slate-900 dark:text-white truncate">${c.title}</div>
              <div class="text-[10px] text-slate-400">${c.category?.name || t('navCourses', 'Courses')} • ${c.isFree ? t('statusFree', 'FREE') : '$' + c.price}</div>
            </div>
          </a>
        `;
      });
    }

    if (quizzes.length > 0) {
      html += `<div class="font-bold text-cyan-500 uppercase text-[10px] pt-2 flex items-center gap-1.5"><i data-lucide="zap" class="w-3.5 h-3.5"></i> <span>${t('searchSectionQuizzes', 'Examinations & Quizzes')} (${quizzes.length})</span></div>`;
      quizzes.forEach(q => {
        html += `
          <a href="#/quiz-take/${q.id}" onclick="window.App.closeOmnibar()" class="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition block">
            <div class="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold shrink-0">
              <i data-lucide="zap" class="w-4 h-4"></i>
            </div>
            <div class="flex-1 min-w-0 text-start">
              <div class="font-bold text-slate-900 dark:text-white truncate">${q.title}</div>
              <div class="text-[10px] text-slate-400">${q.difficulty || ''} • ${q.timeLimitMinutes || 15}m</div>
            </div>
          </a>
        `;
      });
    }

    if (instructors.length > 0) {
      html += `<div class="font-bold text-purple-400 uppercase text-[10px] pt-2 flex items-center gap-1.5"><i data-lucide="award" class="w-3.5 h-3.5"></i> <span>${t('searchSectionInstructors', 'Scholars & Faculty')} (${instructors.length})</span></div>`;
      instructors.forEach(inst => {
        html += `
          <div class="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            <img src="${inst.avatar}" class="w-7 h-7 rounded-full object-cover shadow-sm">
            <div class="flex-1 min-w-0 text-start">
              <span class="font-bold text-slate-900 dark:text-white">${inst.name}</span>
              <div class="text-[10px] text-slate-400 truncate">${inst.title || ''}</div>
            </div>
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

/**
 * Fill the local content cache from Firestore once the app is up.
 *
 * Deliberately not awaited before init(): the cached catalogue renders
 * immediately, and content authored by other people arrives a moment later
 * without the user waiting on the network. If the sync brings anything new,
 * the current view re-renders so it appears without a manual refresh.
 */
async function _hydrateSharedContent() {
  if (!window.CloudDB || typeof window.CloudDB.syncContentFromCloud !== 'function') return;

  try {
    const result = await window.CloudDB.syncContentFromCloud();
    if (!result || !result.synced) return;

    const received = Object.values(result.summary || {})
      .reduce((total, count) => total + (count || 0), 0);
    if (received === 0) return;

    console.log('[LearnHub] Shared content synced:', result.summary);
    if (window.Router && typeof window.Router.handleRouting === 'function') {
      window.Router.handleRouting();
    }
  } catch (err) {
    // The cached catalogue is already on screen, so a failed sync changes nothing.
    console.warn('[LearnHub] Shared content sync unavailable:', err && err.message);
  }
}

// Robust Bootstrap application launcher
function _bootstrapApp() {
  if (window._appInitialized) return;
  window._appInitialized = true;
  try {
    if (window.App && typeof window.App.init === 'function') {
      window.App.init();
    }
  } catch (err) {
    console.error('[LearnHub] Boot initialization error:', err);
  }

  _hydrateSharedContent();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _bootstrapApp);
} else {
  _bootstrapApp();
}
window.addEventListener('load', _bootstrapApp);
setTimeout(_bootstrapApp, 100);


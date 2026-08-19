/**
 * LearnHub Core Application Controller & UI Shell Manager
 */

window.App = {
  isDarkMode: false,

  init() {
    if (!window.DB || !window.DB.findById('courses', 'crs-isl-1')) {
      if (window.DB) window.DB.resetToSeed();
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
    
    // STANDALONE QUIZZES MODULE (100% Independent)
    R.addRoute('/quizzes', (params, query) => window.Views.renderQuizzes(params, query));
    R.addRoute('/quizzes/:id', (params) => window.Views.renderQuizDetails(params));
    R.addRoute('/quiz-take/:id', (params) => window.Views.renderQuizTake(params));
    R.addRoute('/my-quizzes', () => window.Views.renderQuizzes({}, {}));

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

    // Auth Routes
    R.addRoute('/login', () => this.renderAuthPage('login'));
    R.addRoute('/register', () => this.renderAuthPage('register'));

    // ADMIN MANAGEMENT SUITE ROUTES
    R.addRoute('/admin', () => window.Views.admin.renderDashboard(), { requiresAdmin: true });
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
          if ((tabPath === '/' && path === '/') || (tabPath !== '/' && path.startsWith(tabPath))) {
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
        adminSidebar.classList.remove('flex');
      }
      if (adminTopbar) adminTopbar.classList.add('hidden');
      if (adminBackdrop) adminBackdrop.classList.add('hidden');
    } else if (isAdminRoute) {
      if (publicNav) publicNav.classList.add('hidden');
      if (publicFooter) publicFooter.classList.add('hidden');
      if (adminTopbar) adminTopbar.classList.remove('hidden');
      if (adminBackdrop) adminBackdrop.classList.add('hidden');
      
      // On desktop (> 1024px) sidebar is flex/block; on mobile/tablet it is hidden until toggled
      if (adminSidebar) {
        if (window.innerWidth >= 1024) {
          adminSidebar.classList.remove('hidden');
          adminSidebar.classList.add('lg:flex');
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
        adminSidebar.classList.remove('flex');
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
    const links = document.querySelectorAll('#admin-sidebar a');
    links.forEach(a => {
      const href = a.getAttribute('href')?.replace('#', '') || '';
      if (path === href || (href !== '/admin' && path.startsWith(href))) {
        a.classList.add('bg-indigo-600', 'text-white', 'font-bold');
        a.classList.remove('text-slate-400', 'hover:bg-slate-800');
      } else {
        a.classList.remove('bg-indigo-600', 'text-white', 'font-bold');
        a.classList.add('text-slate-400', 'hover:bg-slate-800');
      }
    });
  },

  updateNavbarUserUI() {
    const user = window.Auth.getCurrentUser();
    const userNav = document.getElementById('navbar-user-section');
    if (!userNav) return;

    if (user) {
      const unreadNotifs = window.DB.get('notifications').filter(n => n.userId === user.id && !n.read).length;

      const t = (key, fallback) => window.I18N ? window.I18N.t(key, fallback) : fallback;
      const currentLang = window.I18N ? window.I18N.getCurrentLanguage() : 'ur';

      userNav.innerHTML = `
        <div class="flex items-center gap-3">
          <!-- Role Switcher Quick Pill -->
          <div class="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-xl text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <span class="text-slate-400">${t('actingAs', 'Role:')}</span>
            <select onchange="window.Auth.quickSwitchUser(this.value); window.Router.handleRouting();" class="bg-transparent font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none cursor-pointer font-urdu">
              <option value="student" ${user.role === 'student' ? 'selected' : ''}>${t('roleStudent', 'طالب علم')}</option>
              <option value="instructor" ${user.role === 'instructor' ? 'selected' : ''}>${t('roleInstructor', 'استاد محترم')}</option>
              <option value="admin" ${user.role === 'admin' || user.role === 'super_admin' ? 'selected' : ''}>${t('roleAdmin', 'ایڈمنسٹریٹر')}</option>
            </select>
          </div>

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
              <img src="${user.avatar}" class="w-8 h-8 rounded-full object-cover border border-indigo-200">
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
              <button onclick="window.Auth.logout(); window.Router.navigate('/');" class="w-full text-right flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40">
                <i data-lucide="log-out" class="w-4 h-4"></i> ${t('navSignOut', 'لاگ آؤٹ')}
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      const t = (key, fallback) => window.I18N ? window.I18N.t(key, fallback) : fallback;
      userNav.innerHTML = `
        <div class="flex items-center gap-2 font-urdu" dir="rtl">
          <a href="#/login" class="btn-secondary py-1.5 px-3 text-xs rounded-lg">${t('navSignIn', 'لاگ ان')}</a>
          <a href="#/register" class="btn-primary py-1.5 px-3.5 text-xs rounded-lg">${t('navGetStarted', 'شروع کریں')}</a>
        </div>
      `;
    }
  },

  setupGlobalEvents() {
    // Omnibar Shortcut (Ctrl+K or Cmd+K)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openOmnibar();
      }
    });
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
    const container = document.getElementById('main-content');
    const isLogin = mode === 'login';

    // If user is already logged in, show permanent active session card
    if (window.Auth && window.Auth.isAuthenticated()) {
      const curUser = window.Auth.getCurrentUser();
      container.innerHTML = `
        <div class="min-h-[75vh] flex items-center justify-center px-4 py-12">
          <div class="max-w-md w-full lh-card p-8 text-center space-y-6 border-2 border-emerald-500/40 shadow-2xl">
            <div class="relative w-20 h-20 mx-auto">
              <img src="${curUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="w-20 h-20 rounded-full object-cover border-4 border-emerald-500 shadow-lg mx-auto" alt="${curUser.name}">
              <div class="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow">✓</div>
            </div>

            <div class="space-y-1 font-urdu">
              <span class="badge badge-success text-[10px]">مستقل فعال لاگ اِن (Active Session)</span>
              <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">${curUser.name}</h2>
              <p class="text-xs text-slate-400 font-mono" dir="ltr">${curUser.email}</p>
              <p class="text-xs text-emerald-600 dark:text-emerald-400 font-bold pt-1">آپ کا اکاؤنٹ پہلے سے محفوظ اور لاگ اِن ہے!</p>
            </div>

            <div class="space-y-2 pt-2">
              <a href="#/dashboard" class="btn-primary w-full py-3 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 border-none font-bold shadow-lg shadow-emerald-500/20 block text-center font-urdu">
                اپنے ڈیش بورڈ پر جائیں &rarr;
              </a>
              <button onclick="window.Auth.clearSession(); window.Router.navigate('/login');" class="btn-secondary w-full py-2.5 text-xs rounded-xl font-bold font-urdu">
                دوسرے اکاؤنٹ سے لاگ اِن ہوں (Log Out)
              </button>
            </div>
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    container.innerHTML = `
      <div class="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div class="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          
          <!-- Left Visual & Features Column -->
          <div class="bg-gradient-to-br from-indigo-700 via-indigo-900 to-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div class="space-y-4 relative z-10">
              <div class="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white shadow-xl">
                <i data-lucide="graduation-cap" class="w-7 h-7 text-cyan-300"></i>
              </div>
              <div>
                <span class="badge bg-white/10 text-cyan-300 text-[10px] font-bold uppercase tracking-wider border border-white/10">LearnHub Pro</span>
                <h2 class="text-2xl sm:text-3xl font-extrabold font-urdu mt-1">علم و مہارت کا عالمی پورٹل</h2>
              </div>
              <p class="text-xs text-indigo-200 leading-relaxed font-urdu">
                قرآن مجید، مستند احادیث، تشخیصی امتحانی کوئزز اور جدید ٹیکنالوجی ماسٹر کلاسز کے ساتھ اپنی صلاحیتوں کو نکھاریں۔
              </p>
            </div>

            <!-- Bullet Features -->
            <div class="space-y-3 pt-6 border-t border-white/10 relative z-10 text-xs font-urdu">
              <div class="flex items-center gap-2.5">
                <div class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs">✓</div>
                <span>تمام 114 سورتیں اور مستند احادیث</span>
              </div>
              <div class="flex items-center gap-2.5">
                <div class="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs">✓</div>
                <span>ٹائمر والے آزاد کوئزز اور رزلٹ کارڈز</span>
              </div>
              <div class="flex items-center gap-2.5">
                <div class="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs">✓</div>
                <span>ڈیجیٹل تصدیقی سرٹیفکیٹس</span>
              </div>
            </div>

            <!-- Security Badge & Guarantee -->
            <div class="pt-6 border-t border-white/10 relative z-10 flex items-center justify-between text-xs text-indigo-200 font-urdu">
              <span class="flex items-center gap-1.5 font-bold text-emerald-400">
                <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i> محفوظ لاگ اِن و سیکیورٹی
              </span>
              <span class="text-[10px] text-slate-300 font-mono">256-Bit SSL</span>
            </div>
          </div>

          <!-- Right Interactive Form Column -->
          <div class="p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <!-- Auth Mode Tabs Switcher -->
              <div class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
                <button 
                  onclick="window.Router.navigate('/login')" 
                  class="flex-1 py-2 text-xs font-bold rounded-xl transition ${isLogin ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-900'} font-urdu">
                  سائن اِن (Login)
                </button>
                <button 
                  onclick="window.Router.navigate('/register')" 
                  class="flex-1 py-2 text-xs font-bold rounded-xl transition ${!isLogin ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-900'} font-urdu">
                  نیا اکاؤنٹ بنائیں (Register)
                </button>
              </div>

              <!-- Header Text -->
              <div class="mb-5 font-urdu text-right">
                <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">
                  ${isLogin ? 'خوش آمدید! اپنے اکاؤنٹ میں داخل ہوں' : 'نیا مفت اکاؤنٹ رجسٹر کریں'}
                </h3>
                <p class="text-xs text-slate-500 mt-1">
                  ${isLogin ? 'اپنے ای میل اور پاس ورڈ سے لاگ اِن کریں۔' : 'چند سیکنڈز میں اپنا اکاؤنٹ بنا کر سیکھنا شروع کریں۔'}
                </p>
              </div>

              <!-- Form -->
              <form id="auth-form" onsubmit="window.App.handleAuthSubmit(event, '${mode}')" class="space-y-4 font-urdu text-right">
                
                ${!isLogin ? `
                  <div>
                    <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">پورا نام (Full Name)</label>
                    <input type="text" id="auth-name" required placeholder="مثلاً: محمد جمیل" class="form-input text-xs py-2.5 rounded-xl font-urdu">
                  </div>

                  <div>
                    <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">آپ کا کردار (Account Role)</label>
                    <select id="auth-role" class="form-select text-xs py-2.5 rounded-xl font-urdu">
                      <option value="student">🎓 طالب علم / سیکھنے والا (Student / Learner)</option>
                      <option value="instructor">👨‍🏫 استاد / کورس تخلیق کار (Instructor / Creator)</option>
                    </select>
                  </div>
                ` : ''}

                <div>
                  <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ای میل ایڈریس (Email Address)</label>
                  <div class="relative">
                    <input type="email" id="auth-email" required placeholder="name@learnhub.com" class="form-input text-xs py-2.5 pl-8 rounded-xl font-mono text-left" dir="ltr">
                    <i data-lucide="mail" class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5"></i>
                  </div>
                </div>

                <div>
                  <div class="flex items-center justify-between mb-1">
                    ${isLogin ? `
                      <button type="button" onclick="window.App.showForgotPasswordModal()" class="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline">
                        پاس ورڈ بھول گئے؟
                      </button>
                    ` : '<span></span>'}
                    <label class="text-xs font-bold text-slate-700 dark:text-slate-300">پاس ورڈ (Password)</label>
                  </div>
                  <div class="relative">
                    <input 
                      type="password" 
                      id="auth-password" 
                      required 
                      minlength="6" 
                      placeholder="••••••••" 
                      class="form-input text-xs py-2.5 pl-8 pr-8 rounded-xl font-mono text-left" 
                      dir="ltr"
                      oninput="window.App.updatePasswordStrength(this.value)"
                    >
                    <button type="button" onclick="window.App.togglePasswordVisibility()" class="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600">
                      <i data-lucide="eye" id="pwd-eye-icon" class="w-4 h-4"></i>
                    </button>
                  </div>

                  <!-- Live Password Strength Meter for Registration -->
                  ${!isLogin ? `
                    <div class="mt-2 space-y-1" id="pwd-strength-container">
                      <div class="flex justify-between text-[10px] text-slate-400">
                        <span id="pwd-strength-label">پاس ورڈ کی طاقت: کمزور</span>
                        <span id="pwd-strength-percent">0%</span>
                      </div>
                      <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div id="pwd-strength-bar" class="h-full bg-rose-500 w-0 transition-all duration-300"></div>
                      </div>
                    </div>
                  ` : ''}
                </div>

                ${isLogin ? `
                  <div class="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" id="auth-remember" checked class="text-indigo-600 focus:ring-indigo-500 rounded">
                      <span>مجھے یاد رکھیں (Remember Me)</span>
                    </label>
                  </div>
                ` : `
                  <div class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <input type="checkbox" required checked class="text-indigo-600 focus:ring-indigo-500 rounded">
                    <span>میں تمام قواعد و ضوابط (Terms) سے متفق ہوں۔</span>
                  </div>
                `}

                <button type="submit" class="btn-primary w-full py-3 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none font-bold shadow-lg shadow-indigo-500/20">
                  ${isLogin ? 'لاگ اِن کریں (Sign In) &rarr;' : 'نیا اکاؤنٹ بنائیں (Create Account) &rarr;'}
                </button>
              </form>

              <!-- Social Auth Simulation -->
              <div class="pt-4 space-y-3">
                <div class="relative flex items-center justify-center">
                  <div class="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                  <span class="bg-white dark:bg-slate-900 px-3 text-[10px] text-slate-400 uppercase tracking-wider absolute font-mono">یا بذریعہ</span>
                </div>

                <div class="grid grid-cols-2 gap-3 pt-1">
                  <button type="button" onclick="window.App.execSocialAuth('google', 'جمیل رحمن انصاری', 'JRahmanAnsari132@gmail.com', 'https://avatars.githubusercontent.com/u/207941618?v=4')" class="btn-secondary py-3 text-xs rounded-2xl flex items-center justify-center gap-2 hover:border-indigo-500 transition shadow-sm bg-white dark:bg-slate-800 border-2 font-bold group">
                    <svg class="w-4 h-4 group-hover:scale-110 transition" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/></svg>
                    <span>Google</span>
                  </button>
                  <button type="button" onclick="window.App.execSocialAuth('github', 'jamil8655', 'jamil8655@github.com', 'https://avatars.githubusercontent.com/u/207941618?v=4')" class="btn-secondary py-3 text-xs rounded-2xl flex items-center justify-center gap-2 hover:border-indigo-500 transition shadow-sm bg-white dark:bg-slate-800 border-2 font-bold group">
                    <svg class="w-4 h-4 group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                    <span>GitHub</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  initGoogleGIS() {
    try {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: window.GOOGLE_CLIENT_ID || '1047683935260-sample.apps.googleusercontent.com',
          callback: window.App.handleGoogleGISResponse,
          auto_select: false
        });

        const target = document.getElementById('google-gis-btn-wrapper');
        if (target) {
          window.google.accounts.id.renderButton(target, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 320
          });
        }
      }
    } catch(e) {}
  },

  handleGoogleGISResponse(response) {
    if (!response || !response.credential) return;
    const profile = window.App.parseJwt(response.credential);
    if (profile && profile.email) {
      window.App.execSocialAuth('google', profile.name || 'Google User', profile.email, profile.picture);
    }
  },

  parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  },

  togglePasswordVisibility() {
    const pwdInput = document.getElementById('auth-password');
    if (!pwdInput) return;
    pwdInput.type = pwdInput.type === 'password' ? 'text' : 'password';
  },

  updatePasswordStrength(val) {
    const label = document.getElementById('pwd-strength-label');
    const percent = document.getElementById('pwd-strength-percent');
    const bar = document.getElementById('pwd-strength-bar');
    if (!bar) return;

    let score = 0;
    if (val.length >= 6) score += 25;
    if (val.length >= 10) score += 25;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score += 25;
    if (/[^A-Za-z0-9]/.test(val)) score += 25;

    percent.textContent = `${score}%`;
    bar.style.width = `${score}%`;

    if (score <= 25) {
      label.textContent = 'پاس ورڈ کی طاقت: کمزور (Weak)';
      bar.className = 'h-full bg-rose-500 transition-all duration-300';
    } else if (score <= 50) {
      label.textContent = 'پاس ورڈ کی طاقت: درمیانہ (Fair)';
      bar.className = 'h-full bg-amber-500 transition-all duration-300';
    } else if (score <= 75) {
      label.textContent = 'پاس ورڈ کی طاقت: اچھا (Good)';
      bar.className = 'h-full bg-cyan-500 transition-all duration-300';
    } else {
      label.textContent = 'پاس ورڈ کی طاقت: مضبوط (Strong)';
      bar.className = 'h-full bg-emerald-500 transition-all duration-300';
    }
  },

  showForgotPasswordModal() {
    window.App.showModal('پاس ورڈ دوبارہ ترتیب دیں (Reset Password)', `
      <div class="space-y-4 font-urdu text-right">
        <p class="text-xs text-slate-600 dark:text-slate-400">
          اپنا رجسٹرڈ ای میل درج کریں۔ ہم آپ کو فوری پاس ورڈ ری سیٹ لنک بھیجیں گے:
        </p>
        <div>
          <input type="email" id="reset-email-input" placeholder="name@learnhub.com" class="form-input text-xs py-2.5 rounded-xl font-mono text-left" dir="ltr">
        </div>
        <div class="flex gap-2 pt-2">
          <button onclick="window.App.handlePasswordResetSim()" class="btn-primary flex-1 py-2.5 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none font-bold">
            ری سیٹ لنک بھیجیں &rarr;
          </button>
          <button onclick="window.App.closeModal()" class="btn-secondary py-2.5 px-4 text-xs rounded-xl">
            منسوخ
          </button>
        </div>
      </div>
    `);
  },

  handlePasswordResetSim() {
    const email = document.getElementById('reset-email-input')?.value;
    if (!email) {
      window.App.showToast('براہ کرم ای میل درج کریں۔', 'warning');
      return;
    }
    window.App.closeModal();
    window.App.showToast(`پاس ورڈ ری سیٹ لنک ${email} پر ارسال کر دیا گیا ہے!`, 'success');
  },

  socialLogin(provider) {
    if (provider === 'google') {
      window.App.execSocialAuth('google', 'جمیل رحمن انصاری', 'JRahmanAnsari132@gmail.com', 'https://avatars.githubusercontent.com/u/207941618?v=4');
    } else {
      window.App.execSocialAuth('github', 'jamil8655', 'jamil8655@github.com', 'https://avatars.githubusercontent.com/u/207941618?v=4');
    }
  },

  async execSocialAuth(provider, name, email, avatar) {
    window.App.closeModal();
    window.App.showLoading(true);
    try {
      const user = await window.Auth.loginWithSocial(provider, { name, email, avatar });
      window.App.showLoading(false);
      window.App.showToast(`خوش آمدید ${user.name}! آپ کامیابی سے لاگ اِن ہو چکے ہیں۔`, 'success');
      window.Router.navigate('/dashboard');
    } catch(err) {
      window.App.showLoading(false);
      window.App.showToast(err.message || 'لاگ اِن میں غلطی ہوئی', 'danger');
    }
  },

  fillDemoAuth(email, pwd) {
    const emailInput = document.getElementById('auth-email');
    const pwdInput = document.getElementById('auth-password');
    if (emailInput && pwdInput) {
      emailInput.value = email;
      pwdInput.value = pwd;
    }
  },

  async handleAuthSubmit(e, mode) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    try {
      if (mode === 'login') {
        const user = await window.Auth.login(email, password);
        this.showToast(`Welcome back, ${user.name}!`, 'success');
        if (user.role === 'admin' || user.role === 'super_admin') {
          window.Router.navigate('/admin');
        } else {
          window.Router.navigate('/dashboard');
        }
      } else {
        const name = document.getElementById('auth-name').value;
        const user = await window.Auth.register(name, email, password);
        this.showToast(`Account created! Welcome to LearnHub.`, 'success');
        window.Router.navigate('/dashboard');
      }
    } catch (err) {
      this.showToast(err.message || 'Authentication failed', 'danger');
    }
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

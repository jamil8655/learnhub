/**
 * LearnHub Client-Side Hash Router
 * Supports parameterized paths, query parameters, route guards, layout switching,
 * safe navigation, offline awareness, and accessibility focus management.
 */

class Router {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
    this.currentParams = {};
    this.currentQuery = {};
    this._isRouting = false;
    this._lastHash = null;

    window.addEventListener('hashchange', () => this.handleRouting());
    window.addEventListener('online', () => this._setConnectivityState(true));
    window.addEventListener('offline', () => this._setConnectivityState(false));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const drawer = document.getElementById('mobile-menu-drawer');
        if (drawer && !drawer.classList.contains('hidden')) drawer.classList.add('hidden');
      }
    });
  }

  addRoute(pathPattern, handler, options = {}) {
    const paramNames = [];
    const regexPath = pathPattern
      .replace(/([:*])(\w+)/g, (full, type, name) => {
        paramNames.push(name);
        return '([^\\/]+)';
      })
      .replace(/\//g, '\\/');

    this.routes.push({
      pattern: new RegExp(`^${regexPath}$`),
      pathPattern,
      paramNames,
      handler,
      requiresAuth: options.requiresAuth || false,
      requiresAdmin: options.requiresAdmin || false,
      requiresInstructor: options.requiresInstructor || false,
      isDistractionFree: options.isDistractionFree || false
    });
  }

  navigate(hashPath) {
    if (typeof hashPath !== 'string' || !hashPath.trim()) hashPath = '/';
    if (!hashPath.startsWith('#')) hashPath = `#${hashPath}`;
    if (window.location.hash === hashPath) {
      this.handleRouting();
      return;
    }
    window.location.hash = hashPath;
  }

  parseHash() {
    const rawHash = window.location.hash.slice(1) || '/';
    const [pathPart, queryPart] = rawHash.split('?');
    const query = {};

    if (queryPart) {
      const searchParams = new URLSearchParams(queryPart);
      for (const [key, value] of searchParams.entries()) query[key] = value;
    }

    return {
      path: pathPart.startsWith('/') ? pathPart : `/${pathPart}`,
      query
    };
  }

  _setConnectivityState(isOnline) {
    document.documentElement.dataset.connection = isOnline ? 'online' : 'offline';

    let banner = document.getElementById('learnhub-connectivity-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'learnhub-connectivity-banner';
      banner.setAttribute('role', 'status');
      banner.setAttribute('aria-live', 'polite');
      banner.className = 'fixed top-16 left-1/2 -translate-x-1/2 z-[70] hidden max-w-[calc(100%-2rem)] px-4 py-2 rounded-xl shadow-xl text-xs font-bold border';
      document.body.appendChild(banner);
    }

    if (isOnline) {
      banner.className += ' bg-emerald-50 text-emerald-700 border-emerald-200';
      banner.textContent = '✓ دوبارہ آن لائن ہو گئے ہیں۔ (Back online)';
      setTimeout(() => banner.classList.add('hidden'), 2500);
    } else {
      banner.className = 'fixed top-16 left-1/2 -translate-x-1/2 z-[70] max-w-[calc(100%-2rem)] px-4 py-2 rounded-xl shadow-xl text-xs font-bold border bg-amber-50 text-amber-800 border-amber-200';
      banner.textContent = '⚠ آپ آف لائن ہیں۔ محفوظ شدہ مواد دستیاب رہے گا۔ (You are offline. Cached content remains available.)';
      banner.classList.remove('hidden');
    }
  }

  _focusMainContent() {
    const main = document.getElementById('main-content');
    if (!main) return;
    if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
    try { main.focus({ preventScroll: true }); } catch (_) { main.focus(); }
  }

  async handleRouting() {
    if (this._isRouting) return;
    this._isRouting = true;

    try {
      const { path, query } = this.parseHash();
      this.currentQuery = query;

      let matchedRoute = null;
      let matchedParams = {};

      for (const route of this.routes) {
        const match = path.match(route.pattern);
        if (match) {
          matchedRoute = route;
          route.paramNames.forEach((name, index) => {
            try {
              matchedParams[name] = decodeURIComponent(match[index + 1]);
            } catch (_) {
              matchedParams[name] = match[index + 1];
            }
          });
          break;
        }
      }

      if (!matchedRoute) {
        matchedRoute = {
          handler: () => window.Views.renderNotFound(path),
          isDistractionFree: false
        };
      }

      this.currentRoute = matchedRoute;
      this.currentParams = matchedParams;

      const isUserAuthenticated = !!(window.Auth && window.Auth.isAuthenticated());

      if (matchedRoute.requiresAuth && !isUserAuthenticated) {
        window.App.showToast('اس صفحے تک رسائی کے لیے پہلے لاگ اِن کریں۔ (Please sign in to access this page)', 'warning');
        this.navigate('/login');
        return;
      }

      if (matchedRoute.requiresAdmin) {
        if (!isUserAuthenticated) {
          window.App.showToast('ایڈمن پینل کے لیے پہلے لاگ اِن کریں۔ (Please sign in for admin access)', 'warning');
          this.navigate('/login');
          return;
        }
        if (!window.Auth.isAdmin()) {
          window.App.showToast('ایڈمنسٹریٹر اختیارات درکار ہیں۔ (Administrator privileges required)', 'danger');
          this.navigate('/');
          return;
        }
      }

      if (matchedRoute.requiresInstructor) {
        if (!isUserAuthenticated) {
          window.App.showToast('اس صفحے کے لیے پہلے لاگ اِن کریں۔', 'warning');
          this.navigate('/login');
          return;
        }
        if (!window.Auth.isInstructor()) {
          window.App.showToast('استاد / انسٹرکٹر اختیارات درکار ہیں۔ (Instructor privileges required)', 'danger');
          this.navigate('/');
          return;
        }
      }

      const routeKey = `${path}?${new URLSearchParams(query).toString()}`;
      const routeChanged = this._lastHash !== routeKey;
      this._lastHash = routeKey;

      window.scrollTo({ top: 0, behavior: 'instant' });
      window.App.updateLayoutForRoute(matchedRoute, path);

      window.dispatchEvent(new CustomEvent('learnhub:route_changed', {
        detail: { path, query, params: matchedParams, routeChanged }
      }));

      try {
        window.App.showLoading(true);
        await matchedRoute.handler(matchedParams, query);
      } catch (err) {
        console.error('Route render error:', err);
        const safeMessage = err && err.message
          ? String(err.message).slice(0, 300)
          : 'صفحہ لوڈ کرنے میں غیر متوقع خرابی پیش آئی ہے۔';
        window.App.renderError(safeMessage);
      } finally {
        window.App.showLoading(false);
        if (window.lucide) window.lucide.createIcons();
        this._focusMainContent();
      }
    } finally {
      this._isRouting = false;
    }
  }

  init() {
    this._setConnectivityState(navigator.onLine !== false);
    this.handleRouting();
  }
}

window.Router = new Router();

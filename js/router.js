/**
 * LearnHub Client-Side Hash Router
 * Supports parameterized paths, query parameters, route guards, and layout switching.
 */

class Router {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
    this.currentParams = {};
    this.currentQuery = {};
    
    window.addEventListener('hashchange', () => this.handleRouting());
  }

  addRoute(pathPattern, handler, options = {}) {
    // Convert path pattern like "/courses/:id" to regex
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
    if (!hashPath.startsWith('#')) {
      hashPath = `#${hashPath}`;
    }
    window.location.hash = hashPath;
  }

  parseHash() {
    const rawHash = window.location.hash.slice(1) || '/';
    const [pathPart, queryPart] = rawHash.split('?');
    
    const query = {};
    if (queryPart) {
      const searchParams = new URLSearchParams(queryPart);
      for (const [key, value] of searchParams.entries()) {
        query[key] = value;
      }
    }

    return {
      path: pathPart.startsWith('/') ? pathPart : `/${pathPart}`,
      query
    };
  }

  async handleRouting() {
    const { path, query } = this.parseHash();
    this.currentQuery = query;

    // Find matching route
    let matchedRoute = null;
    let matchedParams = {};

    for (const route of this.routes) {
      const match = path.match(route.pattern);
      if (match) {
        matchedRoute = route;
        route.paramNames.forEach((name, index) => {
          matchedParams[name] = decodeURIComponent(match[index + 1]);
        });
        break;
      }
    }

    if (!matchedRoute) {
      // 404 Fallback
      matchedRoute = {
        handler: () => window.Views.renderNotFound(path),
        isDistractionFree: false
      };
    }

    this.currentRoute = matchedRoute;
    this.currentParams = matchedParams;

    // Route Guards for unauthenticated access
    const isUserAuthenticated = window.Auth && window.Auth.isAuthenticated();

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

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Handle Layout (standard vs distraction-free learning player vs admin sidebar)
    window.App.updateLayoutForRoute(matchedRoute, path);

    // Execute View Renderer
    try {
      window.App.showLoading(true);
      await matchedRoute.handler(matchedParams, query);
    } catch (err) {
      console.error('Route render error:', err);
      window.App.renderError(err.message || 'صفحہ لوڈ کرنے میں غیر متوقع خرابی پیش آئی ہے۔');
    } finally {
      window.App.showLoading(false);
      // Re-initialize any dynamic Lucide icons
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  }

  init() {
    this.handleRouting();
  }
}

window.Router = new Router();

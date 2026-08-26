/**
 * LearnHub Safe UI Error Boundary & Resilience Engine
 * Prevents UI breaks by automatically intercepting exceptions in v2 and safely falling back to v1.
 */

window.UIErrorBoundary = {
  async safeRender(v2RenderFn, v1RenderFn, params = {}, query = {}) {
    const activeVersion = window.UI_CONFIG ? window.UI_CONFIG.getVersion() : 'v1';

    // If active version is v1, run v1 directly
    if (activeVersion === 'v1' || !v2RenderFn) {
      if (typeof v1RenderFn === 'function') {
        return await v1RenderFn(params, query);
      }
      return;
    }

    // Try executing v2 with robust error boundary
    try {
      return await v2RenderFn(params, query);
    } catch (err) {
      console.error('[UIErrorBoundary] Caught exception in v2 view:', err);
      
      // Auto-fallback to stable v1
      if (typeof v1RenderFn === 'function') {
        try {
          if (window.App && typeof window.App.showToast === 'function') {
            window.App.showToast('نئے ڈیزائن میں مسئلہ پیش آنے پر خودکار طور پر مستحکم ورژن پر واپس کر دیا گیا ہے۔', 'warning');
          }
          return await v1RenderFn(params, query);
        } catch (fallbackErr) {
          console.error('[UIErrorBoundary] Fatal error in fallback view:', fallbackErr);
          if (window.App && typeof window.App.renderError === 'function') {
            window.App.renderError('صفحہ لوڈ کرنے میں خرابی پیش آئی ہے۔');
          }
        }
      }
    }
  }
};

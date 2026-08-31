/**
 * LearnHub Safe UI Error Boundary & Universal State Engine (v173.0.0)
 * Provides graceful Loading, Empty, Error and Retry handlers for all data-backed modules.
 */

window.UIErrorBoundary = {
  async safeRender(v2RenderFn, v1RenderFn, params = {}, query = {}) {
    const activeVersion = window.UI_CONFIG ? window.UI_CONFIG.getVersion() : 'v1';

    if (activeVersion === 'v1' || !v2RenderFn) {
      if (typeof v1RenderFn === 'function') {
        return await v1RenderFn(params, query);
      }
      return;
    }

    try {
      return await v2RenderFn(params, query);
    } catch (err) {
      console.error('[UIErrorBoundary] Caught exception in v2 view:', err);
      if (typeof v1RenderFn === 'function') {
        try {
          if (window.App && typeof window.App.showToast === 'function') {
            window.App.showToast('نئے ڈیزائن میں مسئلہ پیش آنے پر مستحکم موڈ فعال کر دیا گیا ہے۔', 'warning');
          }
          return await v1RenderFn(params, query);
        } catch (fallbackErr) {
          console.error('[UIErrorBoundary] Fatal error in fallback view:', fallbackErr);
        }
      }
    }
  },

  renderLoadingState(message = 'معلومات لوڈ ہو رہی ہیں...') {
    return `
      <div class="py-16 flex flex-col items-center justify-center space-y-4 text-center">
        <div class="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin"></div>
        <p class="text-xs text-slate-500 font-bold">${message}</p>
      </div>
    `;
  },

  renderEmptyState(title = 'کوئی ریکارڈ نہیں ملا', subtitle = 'اس سیکشن میں فی الوقت مواد موجود نہیں ہے۔', icon = 'inbox', actionText = null, actionFn = null) {
    return `
      <div class="py-16 px-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center space-y-3">
        <div class="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center mx-auto text-2xl shadow-inner">
          <i data-lucide="${icon}" class="w-7 h-7"></i>
        </div>
        <h3 class="font-bold text-sm text-slate-800 dark:text-slate-200">${title}</h3>
        <p class="text-xs text-slate-500 max-w-sm mx-auto">${subtitle}</p>
        ${actionText ? `
          <div class="pt-2">
            <button onclick="${actionFn || 'window.location.reload()'}" class="btn-primary py-2 px-5 text-xs font-bold rounded-xl shadow-md">
              ${actionText}
            </button>
          </div>
        ` : ''}
      </div>
    `;
  },

  renderErrorState(message = 'کنکشن میں رکاوٹ پیش آئی ہے۔', retryFn = 'window.location.reload()') {
    return `
      <div class="py-16 px-4 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-center space-y-3">
        <div class="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center mx-auto text-2xl">
          <i data-lucide="alert-triangle" class="w-7 h-7"></i>
        </div>
        <h3 class="font-bold text-sm text-rose-900 dark:text-rose-200">معلومات لوڈ نہیں ہو سکیں</h3>
        <p class="text-xs text-rose-700/80 dark:text-rose-300/80 max-w-sm mx-auto">${message}</p>
        <div class="pt-2">
          <button onclick="${retryFn}" class="py-2 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 mx-auto">
            <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
            <span>دوبارہ کوشش کریں (Retry)</span>
          </button>
        </div>
      </div>
    `;
  }
};

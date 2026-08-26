/**
 * LearnHub V2 Modern Responsive Navigation Engine
 */

window.Views = window.Views || {};
window.Views.v2 = window.Views.v2 || {};

window.Views.v2.renderNavigation = function() {
  const isV2 = window.UI_CONFIG && window.UI_CONFIG.getVersion() === 'v2';
  if (!isV2) return;
  const theme = window.UI_CONFIG ? window.UI_CONFIG.getTheme() : 'light';
  const userNav = document.getElementById('navbar-user-section');
  if (userNav && !document.getElementById('v2-theme-selector')) {
    const themePill = document.createElement('div');
    themePill.id = 'v2-theme-selector';
    themePill.className = 'flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs mr-2';
    themePill.innerHTML = `
      <button onclick="window.UI_CONFIG.setTheme('light')" class="p-1 rounded-lg ${theme === 'light' ? 'bg-white dark:bg-slate-700 shadow-sm text-amber-500' : 'text-slate-400'}" title="Light Mode">☀️</button>
      <button onclick="window.UI_CONFIG.setTheme('sepia')" class="p-1 rounded-lg ${theme === 'sepia' ? 'bg-amber-100 text-amber-800 font-bold shadow-sm' : 'text-slate-400'}" title="Sepia Mode">📜</button>
      <button onclick="window.UI_CONFIG.setTheme('dark')" class="p-1 rounded-lg ${theme === 'dark' ? 'bg-slate-900 text-indigo-400 shadow-sm' : 'text-slate-400'}" title="Dark Mode">🌙</button>
    `;
    userNav.prepend(themePill);
  }
};

/**
 * LearnHub Centralized UI Version & Feature Flag Engine
 * Controls safe co-existence of v1 (Current Production) and v2 (New Professional UI).
 */

(function() {
  const UI_STORAGE_KEY = 'learnhub_ui_version';
  const PREVIEW_STORAGE_KEY = 'learnhub_ui_preview_session';
  const BETA_OPT_IN_KEY = 'learnhub_user_beta_optin';
  const THEME_MODE_KEY = 'learnhub_theme_mode'; // 'light', 'dark', 'sepia'

  // Default Centralized Configuration
  const defaultConfig = {
    activeVersion: "v2", // Modern V2 Active by Default with safe V1 fallbacks
    allowExperimentalUI: true,
    featureFlags: {
      ENABLE_NEW_UI: true,
      NEW_DASHBOARD: true,
      NEW_NAVIGATION: true,
      NEW_COURSE_UI: true,
      NEW_QUIZ_UI: true,
      NEW_PROFILE_UI: true,
      TRIPLE_THEME: true,
      ALLOW_USER_BETA: true
    }
  };

  class UIConfigManager {
    constructor() {
      this.config = { ...defaultConfig };
      this.loadSettings();
    }

    loadSettings() {
      try {
        const savedVersion = typeof localStorage !== 'undefined' ? localStorage.getItem(UI_STORAGE_KEY) : null;
        if (savedVersion === 'v1' || savedVersion === 'v2') {
          this.config.activeVersion = savedVersion;
        }

        const flags = typeof localStorage !== 'undefined' ? localStorage.getItem('learnhub_ui_flags') : null;
        if (flags) {
          this.config.featureFlags = { ...this.config.featureFlags, ...JSON.parse(flags) };
        }
      } catch (e) {
        console.warn('[UIConfig] Error loading settings:', e);
      }
    }

    /**
     * Get the active UI version for the current session.
     * Admin preview session takes precedence over global default.
     */
    getVersion() {
      try {
        if (typeof sessionStorage !== 'undefined') {
          const sessionPreview = sessionStorage.getItem(PREVIEW_STORAGE_KEY);
          if (sessionPreview === 'v2' || sessionPreview === 'v1') {
            return sessionPreview;
          }
        }

        if (this.config.featureFlags.ALLOW_USER_BETA && typeof localStorage !== 'undefined') {
          const userBeta = localStorage.getItem(BETA_OPT_IN_KEY);
          if (userBeta === 'true') {
            return 'v2';
          }
        }

        return this.config.activeVersion || 'v1';
      } catch (e) {
        return 'v1';
      }
    }

    /**
     * Set global UI version (Admin action)
     */
    setVersion(version, persist = true) {
      if (version !== 'v1' && version !== 'v2') return;
      this.config.activeVersion = version;
      this.config.featureFlags.ENABLE_NEW_UI = (version === 'v2');

      if (persist && typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(UI_STORAGE_KEY, version);
          localStorage.setItem('learnhub_ui_flags', JSON.stringify(this.config.featureFlags));
        } catch (e) {}
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('learnhub:ui_version_changed', { detail: { version } }));
      }
    }

    /**
     * Set temporary Admin Preview (Only for this tab/session)
     */
    setAdminPreview(version) {
      try {
        if (typeof sessionStorage !== 'undefined') {
          if (version) {
            sessionStorage.setItem(PREVIEW_STORAGE_KEY, version);
          } else {
            sessionStorage.removeItem(PREVIEW_STORAGE_KEY);
          }
        }
      } catch (e) {}
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('learnhub:ui_version_changed', { detail: { version: this.getVersion() } }));
      }
    }

    /**
     * Emergency Rollback to v1
     */
    rollbackToV1() {
      try {
        if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(PREVIEW_STORAGE_KEY);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(UI_STORAGE_KEY, 'v1');
          this.config.activeVersion = 'v1';
          this.config.featureFlags.ENABLE_NEW_UI = false;
          localStorage.setItem('learnhub_ui_flags', JSON.stringify(this.config.featureFlags));
        }
      } catch (e) {}
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('learnhub:ui_version_changed', { detail: { version: 'v1' } }));
      }
    }

    /**
     * Check if a specific feature flag is active
     */
    isFeatureEnabled(flagName) {
      if (this.getVersion() === 'v2') return true;
      return !!this.config.featureFlags[flagName];
    }

    /**
     * Set feature flags
     */
    setFeatureFlag(flagName, value) {
      this.config.featureFlags[flagName] = !!value;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('learnhub_ui_flags', JSON.stringify(this.config.featureFlags));
        }
      } catch (e) {}
    }

    /**
     * Triple Theme System: 'light', 'dark', 'sepia'
     */
    getTheme() {
      try {
        return typeof localStorage !== 'undefined' ? localStorage.getItem(THEME_MODE_KEY) || 'light' : 'light';
      } catch (e) {
        return 'light';
      }
    }

    setTheme(mode) {
      const validModes = ['light', 'dark', 'sepia'];
      if (!validModes.includes(mode)) mode = 'light';
      
      try {
        if (typeof localStorage !== 'undefined') localStorage.setItem(THEME_MODE_KEY, mode);
      } catch (e) {}

      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.classList.remove('dark', 'sepia-theme');
        if (mode === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (mode === 'sepia') {
          document.documentElement.classList.add('sepia-theme');
        }
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('learnhub:theme_changed', { detail: { theme: mode } }));
      }
    }
  }

  if (typeof window !== 'undefined') {
    window.UI_CONFIG = new UIConfigManager();

    /**
     * Escape a value before interpolating it into an HTML template string.
     *
     * The views build markup with template literals and assign it through
     * innerHTML, so any user-authored value dropped in raw becomes a script
     * injection point. Anything a person typed — note titles and bodies,
     * review text, display names — must pass through this on the way in.
     *
     * Lives here because uiConfig.js is the first application script
     * index.html loads, so every view can rely on it being defined.
     */
    window.escapeHtml = function (value) {
      if (value === null || value === undefined) return '';
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };
  }
})();

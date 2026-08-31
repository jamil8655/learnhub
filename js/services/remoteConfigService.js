/**
 * LearnHub Remote Config & Feature Flags Service (v173.0.0)
 * Controls dynamic feature rollouts and module-level maintenance mode without requiring APK rebuilds.
 */

class RemoteConfigService {
  constructor() {
    this.defaults = {
      maintenanceMode: false,
      certificateVerification: true,
      newQuizSystem: true,
      premiumV2: true,
      newHomeScreen: true,
      newLearningPath: true,
      notificationsEnabled: true,
      
      // Module-level maintenance flags
      quranEnabled: true,
      coursesEnabled: true,
      quizEnabled: true,
      articlesEnabled: true,
      hadithEnabled: true,
      libraryEnabled: true,
      adventureEnabled: true
    };

    this.flags = { ...this.defaults };
    this._loadLocalCache();
    this.fetchRemoteConfig();
  }

  _loadLocalCache() {
    try {
      const stored = localStorage.getItem('learnhub_remote_flags');
      if (stored) {
        this.flags = { ...this.defaults, ...JSON.parse(stored) };
      }
    } catch (e) {}
  }

  async fetchRemoteConfig() {
    if (window.CloudDB && window.CloudDB.firestore) {
      try {
        const doc = await window.CloudDB.firestore.collection('settings').doc('remote_config').get();
        if (doc && doc.exists) {
          const remoteData = doc.data();
          this.flags = { ...this.defaults, ...remoteData };
          try {
            localStorage.setItem('learnhub_remote_flags', JSON.stringify(this.flags));
          } catch(e) {}
        }
      } catch (err) {
        console.warn('[RemoteConfig] Using cached/default flags:', err.message);
      }
    }
  }

  isEnabled(flagName) {
    if (this.flags[flagName] !== undefined) {
      return !!this.flags[flagName];
    }
    return this.defaults[flagName] !== undefined ? !!this.defaults[flagName] : true;
  }

  isModuleAvailable(moduleName) {
    if (this.flags.maintenanceMode) return false;
    const flagKey = moduleName + 'Enabled';
    if (this.flags[flagKey] !== undefined) {
      return !!this.flags[flagKey];
    }
    return true;
  }

  async setFlag(flagName, value) {
    this.flags[flagName] = value;
    try {
      localStorage.setItem('learnhub_remote_flags', JSON.stringify(this.flags));
      if (window.CloudDB && window.CloudDB.firestore && window.Auth && window.Auth.isAdmin()) {
        await window.CloudDB.firestore.collection('settings').doc('remote_config').set(this.flags, { merge: true });
        if (window.CloudDB.logAuditEvent) {
          window.CloudDB.logAuditEvent('REMOTE_CONFIG_UPDATED', 'settings', 'remote_config', { flag: flagName, value });
        }
      }
    } catch(e) {}
  }
}

window.RemoteConfig = new RemoteConfigService();

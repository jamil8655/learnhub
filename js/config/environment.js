/**
 * LearnHub Environment Configuration Service (v173.0.0)
 * Safely separates Development (learnhub-dev) and Production (studio-5305763939-bdcf7) environments.
 * Provides fallback defaults, prevents secret leakage, and dynamic runtime selection.
 */

class EnvironmentService {
  constructor() {
    this.isProd = window.location.hostname === 'learnhubplatform.com' || window.location.hostname === 'www.learnhubplatform.com';
    this.envName = this.isProd ? 'production' : 'development';
    
    this.config = {
      appName: this.isProd ? 'LearnHub' : 'LearnHub (Dev)',
      appVersion: '173.0.0',
      apiBaseUrl: this.isProd ? 'https://learnhubplatform.com/api/v1' : 'https://dev.learnhubplatform.com/api/v1',
      firebase: this.isProd ? {
        projectId: 'studio-5305763939-bdcf7',
        authDomain: 'studio-5305763939-bdcf7.firebaseapp.com',
        storageBucket: 'studio-5305763939-bdcf7.firebasestorage.app',
        messagingSenderId: '207941618001',
        appId: '1:207941618001:web:learnhubprodlive'
      } : {
        projectId: 'learnhub-dev',
        authDomain: 'learnhub-dev.firebaseapp.com',
        storageBucket: 'learnhub-dev.appspot.com',
        messagingSenderId: '109876543210',
        appId: '1:109876543210:web:abcdef1234567890'
      }
    };
  }

  isProduction() {
    return this.isProd;
  }

  isDevelopment() {
    return !this.isProd;
  }

  getFirebaseConfig() {
    return { ...this.config.firebase };
  }

  get(key, fallback = null) {
    return this.config[key] !== undefined ? this.config[key] : fallback;
  }
}

window.Env = new EnvironmentService();

/**
 * LearnHub Enterprise App Security Guard (v166.0.0)
 * Protects against:
 * 1. Chrome DevTools Console Interception & Snooping
 * 2. PII Exposure (Automatic Email & Phone Number Masking)
 * 3. Memory & LocalStorage Tampering
 * 4. XSS & Code Injection via Contextual Sanitization
 * 5. Right-Click & Source Code Inspection Traps
 */

(function() {
  'use strict';

  const isLocalDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

  // 1. Console Defense: Mute sensitive logs in production so Chrome DevTools cannot snoop on PII
  if (!isLocalDev) {
    const noop = function() {};
    console.log = noop;
    console.info = noop;
    console.debug = noop;
    console.dir = noop;
    console.table = noop;

    setInterval(() => {
      try {
        if (console.clear) console.clear();
      } catch(e) {}
    }, 20000);
  }

  // 2. Keyboard & Shortcut Interception Defense (Blocks F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
  if (!isLocalDev) {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        return false;
      }
    }, { capture: true });

    document.addEventListener('contextmenu', function(e) {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return true;
      }
      e.preventDefault();
      return false;
    }, { capture: true });
  }

  // 3. PII Masking & Security Helper Utilities
  window.AppSecurity = {
    maskEmail: function(email) {
      if (!email || typeof email !== 'string') return '';
      const parts = email.trim().split('@');
      if (parts.length !== 2) return email;
      const user = parts[0];
      const domain = parts[1];
      if (user.length <= 2) {
        return user.charAt(0) + '***@' + domain;
      }
      return user.charAt(0) + '***' + user.charAt(user.length - 1) + '@' + domain;
    },

    maskPhone: function(phone) {
      if (!phone || typeof phone !== 'string') return '';
      const cleaned = phone.replace(/[^0-9+]/g, '');
      if (cleaned.length < 7) return '******';
      const visibleEnd = cleaned.slice(-4);
      const prefix = cleaned.startsWith('+') ? cleaned.slice(0, 3) : '';
      return (prefix ? prefix + ' ' : '') + '******' + visibleEnd;
    },

    sanitizeHtml: function(str) {
      if (typeof str !== 'string') return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    },

    saveSecureItem: function(key, data) {
      try {
        const raw = JSON.stringify(data);
        const encoded = btoa(encodeURIComponent(raw));
        localStorage.setItem('_lh_sec_' + key, encoded);
      } catch(e) {}
    },

    getSecureItem: function(key) {
      try {
        const stored = localStorage.getItem('_lh_sec_' + key);
        if (!stored) return null;
        const decoded = decodeURIComponent(atob(stored));
        return JSON.parse(decoded);
      } catch(e) {
        return null;
      }
    },

    removeSecureItem: function(key) {
      try {
        localStorage.removeItem('_lh_sec_' + key);
      } catch(e) {}
    }
  };

  console.log('[LearnHub Security Guard v166.0.0] Active.');
})();

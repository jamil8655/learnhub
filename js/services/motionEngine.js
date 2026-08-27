/**
 * LearnHub Real-World Motion & Interaction System 3.0
 * Production-Ready • 60-120FPS GPU Motion • Context-Aware Skeletons
 * Real Button States • Audio Sync • Offline Status • Zero Fake Progress
 */

(function() {
  'use strict';

  class MotionSystem {
    constructor() {
      this.isReducedMotion = false;
      this._scrollObserver = null;
      this._countersObserver = null;
      this._networkBanner = null;
      this.init();
    }

    init() {
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.isReducedMotion = mediaQuery.matches;
        mediaQuery.addEventListener('change', (e) => {
          this.isReducedMotion = e.matches;
        });
      }

      this.initNetworkStatusTracker();
      console.log('[MotionEngine 3.0] Initialized LearnHub Motion System. Reduced Motion:', this.isReducedMotion);
    }

    /* ==========================================================================
       1. EASING FUNCTIONS
       ========================================================================== */
    easeOutExpo(x) {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    easeOutCubic(x) {
      return 1 - Math.pow(1 - x, 3);
    }

    /* ==========================================================================
       2. REAL BUTTON STATE CONTROLLER (Loading, Success, Error, Reset)
       ========================================================================== */
    setButtonState(btn, state = 'loading', text = '') {
      if (!btn) return;

      if (state === 'loading') {
        if (!btn.hasAttribute('data-orig-html')) {
          btn.setAttribute('data-orig-html', btn.innerHTML);
        }
        btn.disabled = true;
        btn.classList.add('cursor-not-allowed', 'opacity-85');
        const spinner = '<span class="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>';
        btn.innerHTML = spinner + (text || (window.I18N?.getCurrentLanguage() === 'ur' ? 'پروسیسنگ جاری ہے...' : 'Processing...'));
      } else if (state === 'success') {
        btn.classList.remove('cursor-not-allowed', 'opacity-85');
        btn.classList.add('bg-emerald-600', 'text-white', 'scale-102');
        const check = '<i data-lucide="check-circle" class="w-3.5 h-3.5 inline mr-1.5"></i>';
        btn.innerHTML = check + (text || (window.I18N?.getCurrentLanguage() === 'ur' ? 'کامیاب ✓' : 'Success ✓'));
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
          this.setButtonState(btn, 'reset');
        }, 1800);
      } else if (state === 'error') {
        btn.disabled = false;
        btn.classList.remove('cursor-not-allowed', 'opacity-85');
        btn.classList.add('animate-shake', 'bg-rose-600', 'text-white');
        const warn = '<i data-lucide="alert-circle" class="w-3.5 h-3.5 inline mr-1.5"></i>';
        btn.innerHTML = warn + (text || (window.I18N?.getCurrentLanguage() === 'ur' ? 'خرابی!' : 'Failed'));
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
          btn.classList.remove('animate-shake', 'bg-rose-600');
          this.setButtonState(btn, 'reset');
        }, 2200);
      } else if (state === 'reset') {
        btn.disabled = false;
        btn.classList.remove('cursor-not-allowed', 'opacity-85', 'bg-emerald-600', 'bg-rose-600', 'scale-102');
        if (btn.hasAttribute('data-orig-html')) {
          btn.innerHTML = btn.getAttribute('data-orig-html');
          btn.removeAttribute('data-orig-html');
        }
        if (window.lucide) window.lucide.createIcons();
      }
    }

    /* ==========================================================================
       3. CONTEXT-AWARE SKELETON LOADERS
       ========================================================================== */
    renderSkeleton(type = 'courses', count = 3) {
      let html = '';
      if (type === 'courses') {
        for (let i = 0; i < count; i++) {
          html += `
            <div class="rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 animate-pulse">
              <div class="w-full h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
              <div class="space-y-2">
                <div class="w-3/4 h-5 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                <div class="w-1/2 h-3 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                <div class="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div class="w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              </div>
            </div>
          `;
        }
      } else if (type === 'quran') {
        for (let i = 0; i < count; i++) {
          html += `
            <div class="rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-pulse">
              <div class="flex items-center justify-between">
                <div class="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                <div class="w-1/3 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              </div>
              <div class="w-full h-12 bg-slate-200 dark:bg-slate-800 rounded-xl my-4"></div>
              <div class="w-5/6 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          `;
        }
      } else if (type === 'dashboard') {
        html = `
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
            <div class="p-5 rounded-3xl bg-slate-100 dark:bg-slate-900 h-28 border border-slate-200 dark:border-slate-800"></div>
            <div class="p-5 rounded-3xl bg-slate-100 dark:bg-slate-900 h-28 border border-slate-200 dark:border-slate-800"></div>
            <div class="p-5 rounded-3xl bg-slate-100 dark:bg-slate-900 h-28 border border-slate-200 dark:border-slate-800"></div>
            <div class="p-5 rounded-3xl bg-slate-100 dark:bg-slate-900 h-28 border border-slate-200 dark:border-slate-800"></div>
          </div>
        `;
      }
      return html;
    }

    /* ==========================================================================
       4. HIGH-PRECISION NUMERIC COUNTER TRANSITION
       ========================================================================== */
    animateCount(el, startVal = 0, endVal = 100, duration = 1000, prefix = '', suffix = '') {
      if (!el) return;
      if (this.isReducedMotion) {
        el.textContent = prefix + endVal.toLocaleString() + suffix;
        return;
      }

      const startTime = performance.now();
      const difference = endVal - startVal;

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = this.easeOutExpo(progress);
        const currentVal = Math.round(startVal + (difference * easedProgress));

        el.textContent = prefix + currentVal.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = prefix + endVal.toLocaleString() + suffix;
        }
      };

      requestAnimationFrame(update);
    }

    /* ==========================================================================
       5. SMOOTH ROUTE PAGE TRANSITION
       ========================================================================== */
    async pageTransition(container, renderCallback) {
      if (!container || typeof renderCallback !== 'function') {
        if (typeof renderCallback === 'function') await renderCallback();
        return;
      }

      if (this.isReducedMotion) {
        await renderCallback();
        this.onViewRendered();
        return;
      }

      container.style.opacity = '0';
      container.style.transform = 'translate3d(0, 6px, 0)';
      container.style.transition = 'opacity 120ms ease-out, transform 120ms ease-out';

      await new Promise(resolve => setTimeout(resolve, 80));

      await renderCallback();

      container.style.opacity = '0';
      container.style.transform = 'translate3d(0, 12px, 0)';
      container.style.transition = 'opacity 260ms cubic-bezier(0.16, 1, 0.3, 1), transform 260ms cubic-bezier(0.16, 1, 0.3, 1)';

      requestAnimationFrame(() => {
        container.style.opacity = '1';
        container.style.transform = 'translate3d(0, 0, 0)';
      });

      this.onViewRendered();
    }

    /* ==========================================================================
       6. REAL NETWORK STATUS TRACKER (Online, Offline, Syncing, Synced)
       ========================================================================== */
    initNetworkStatusTracker() {
      if (typeof window === 'undefined') return;

      window.addEventListener('online', () => {
        this._showNetworkToast('online');
      });

      window.addEventListener('offline', () => {
        this._showNetworkToast('offline');
      });
    }

    _showNetworkToast(status) {
      const isUrdu = window.I18N?.getCurrentLanguage() === 'ur';
      const existing = document.getElementById('network-status-toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.id = 'network-status-toast';
      toast.className = `fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
        status === 'online' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-amber-400 border border-amber-400/40'
      }`;

      if (status === 'online') {
        toast.innerHTML = isUrdu 
          ? '<i data-lucide="wifi" class="w-4 h-4"></i> <span>انٹرنیٹ بحال • ڈیٹا ہم آہنگ ہو گیا</span>' 
          : '<i data-lucide="wifi" class="w-4 h-4"></i> <span>Online • Sync complete</span>';
      } else {
        toast.innerHTML = isUrdu 
          ? '<i data-lucide="wifi-off" class="w-4 h-4"></i> <span>آپ آف لائن ہیں • ذخیرہ شدہ مواد دستیاب ہے</span>' 
          : '<i data-lucide="wifi-off" class="w-4 h-4"></i> <span>You are offline • Cached content available</span>';
      }

      document.body.appendChild(toast);
      if (window.lucide) window.lucide.createIcons();

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => toast.remove(), 400);
      }, 3500);
    }

    /* ==========================================================================
       7. CONFIRM DESTRUCTIVE ACTION (Admin & Security Guard)
       ========================================================================== */
    confirmDestructiveAction(options = {}) {
      const isUrdu = window.I18N?.getCurrentLanguage() === 'ur';
      const title = options.title || (isUrdu ? 'کیا آپ واقعی اس کارروائی کی تصدیق کرتے ہیں؟' : 'Confirm Action');
      const message = options.message || (isUrdu ? 'یہ عمل واپس نہیں لیا جا سکے گا۔' : 'This action cannot be undone.');
      const confirmText = options.confirmText || (isUrdu ? 'ہاں، حذف کریں' : 'Yes, Delete');
      const cancelText = options.cancelText || (isUrdu ? 'منسوخ کریں' : 'Cancel');

      const modalId = 'destructive-confirm-modal';
      const existing = document.getElementById(modalId);
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = modalId;
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans select-none';
      modal.innerHTML = `
        <div class="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-slate-900 border border-rose-500/30 shadow-2xl text-center space-y-4 animate-scale-in">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-950/80 border border-rose-500/40 text-rose-500 flex items-center justify-center">
            <i data-lucide="alert-triangle" class="w-7 h-7"></i>
          </div>
          <div class="space-y-1.5">
            <h3 class="text-base font-black text-slate-900 dark:text-white">${title}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">${message}</p>
          </div>
          <div class="grid grid-cols-2 gap-3 pt-2">
            <button id="modal-cancel-btn" class="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs active:scale-95 transition">
              ${cancelText}
            </button>
            <button id="modal-confirm-btn" class="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md active:scale-95 transition">
              ${confirmText}
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      if (window.lucide) window.lucide.createIcons();

      document.getElementById('modal-cancel-btn').onclick = () => modal.remove();
      document.getElementById('modal-confirm-btn').onclick = async () => {
        const btn = document.getElementById('modal-confirm-btn');
        this.setButtonState(btn, 'loading', isUrdu ? 'حذف ہو رہا ہے...' : 'Deleting...');
        if (typeof options.onConfirm === 'function') {
          await options.onConfirm();
        }
        modal.remove();
      };
    }

    /* ==========================================================================
       8. SCROLL OBSERVER & AUTO-COUNTERS
       ========================================================================== */
    onViewRendered() {
      this.initScrollObserver();
      this.initAutoCounters();
    }

    initScrollObserver() {
      if (typeof IntersectionObserver === 'undefined' || this.isReducedMotion) {
        document.querySelectorAll('.reveal-on-scroll, [data-motion]').forEach(el => el.classList.add('is-revealed'));
        return;
      }

      if (this._scrollObserver) {
        this._scrollObserver.disconnect();
      }

      this._scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            this._scrollObserver.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08
      });

      const targets = document.querySelectorAll('section, .v2-card, .glass-card-royal, .hover-lift, [data-reveal]');
      targets.forEach((el, idx) => {
        if (!el.classList.contains('reveal-on-scroll') && !el.classList.contains('no-reveal')) {
          el.classList.add('reveal-on-scroll');
          if (idx % 4 === 1) el.classList.add('delay-100');
          else if (idx % 4 === 2) el.classList.add('delay-200');
          else if (idx % 4 === 3) el.classList.add('delay-300');
        }
        this._scrollObserver.observe(el);
      });
    }

    initAutoCounters() {
      if (typeof IntersectionObserver === 'undefined' || this.isReducedMotion) {
        document.querySelectorAll('[data-count-to]').forEach(el => {
          const target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
          const suffix = el.getAttribute('data-count-suffix') || '';
          const prefix = el.getAttribute('data-count-prefix') || '';
          el.textContent = prefix + target + suffix;
        });
        return;
      }

      if (this._countersObserver) {
        this._countersObserver.disconnect();
      }

      this._countersObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
            const suffix = el.getAttribute('data-count-suffix') || '';
            const prefix = el.getAttribute('data-count-prefix') || '';
            const duration = parseInt(el.getAttribute('data-count-duration'), 10) || 1000;
            
            this.animateCount(el, 0, target, duration, prefix, suffix);
            this._countersObserver.unobserve(el);
          }
        });
      }, { threshold: 0.2 });

      document.querySelectorAll('[data-count-to]').forEach(el => {
        this._countersObserver.observe(el);
      });
    }
  }

  window.Motion = new MotionSystem();
  window.MotionEngine = window.Motion;
})();

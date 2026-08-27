/**
 * LearnHub Premium Motion & Interaction Engine
 * World-Class 60FPS Hardware-Accelerated Animation & Micro-Interaction System
 * Zero External Dependencies • Accessible • Battery-Efficient
 */

(function() {
  'use strict';

  class MotionEngine {
    constructor() {
      this.isReducedMotion = false;
      this._scrollObserver = null;
      this._countersObserver = null;
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

      console.log('[MotionEngine] Initialized LearnHub Motion System. Reduced Motion:', this.isReducedMotion);
    }

    easeOutExpo(x) {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    easeOutCubic(x) {
      return 1 - Math.pow(1 - x, 3);
    }

    animateCount(el, startVal = 0, endVal = 100, duration = 1200, prefix = '', suffix = '') {
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

    animateProgress(el, targetPercent = 100, duration = 800) {
      if (!el) return;
      targetPercent = Math.max(0, Math.min(100, targetPercent));

      if (this.isReducedMotion) {
        el.style.width = targetPercent + '%';
        return;
      }

      el.style.transition = 'width ' + duration + 'ms cubic-bezier(0.16, 1, 0.3, 1)';
      requestAnimationFrame(() => {
        el.style.width = targetPercent + '%';
      });
    }

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
      container.style.transform = 'translate3d(0, 8px, 0)';
      container.style.transition = 'opacity 140ms ease-out, transform 140ms ease-out';

      await new Promise(resolve => setTimeout(resolve, 100));

      await renderCallback();

      container.style.opacity = '0';
      container.style.transform = 'translate3d(0, 16px, 0)';
      container.style.transition = 'opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), transform 320ms cubic-bezier(0.16, 1, 0.3, 1)';

      requestAnimationFrame(() => {
        container.style.opacity = '1';
        container.style.transform = 'translate3d(0, 0, 0)';
      });

      this.onViewRendered();
    }

    quizFeedback(isCorrect, element) {
      if (!element) return;
      if (this.isReducedMotion) return;

      if (isCorrect) {
        element.style.animation = 'scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both';
        if (window.SoundEngine && typeof window.SoundEngine.playCorrect === 'function') {
          window.SoundEngine.playCorrect();
        }
      } else {
        element.style.animation = 'shakeSoft 0.4s ease-in-out both';
        if (window.SoundEngine && typeof window.SoundEngine.playIncorrect === 'function') {
          window.SoundEngine.playIncorrect();
        }
      }

      setTimeout(() => {
        element.style.animation = '';
      }, 500);
    }

    celebrateAchievement(data = {}) {
      const title = data.title || 'نیا اعزاز حاصل ہوا!';
      const xp = data.xp || 50;
      const desc = data.desc || 'آپ نے شاندار علمی کارکردگی کا مظاہرہ کیا ہے۔';

      const existing = document.getElementById('motion-achievement-modal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'motion-achievement-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-urdu select-none';
      modal.innerHTML = '<div class="relative w-full max-w-sm p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 border-2 border-amber-400/60 shadow-2xl text-center text-white animate-scale-in">' +
        '<div class="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-emerald-400 p-1 shadow-xl flex items-center justify-center animate-float">' +
          '<div class="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-amber-400 text-3xl">🏆</div>' +
        '</div>' +
        '<div class="pt-10 space-y-3">' +
          '<span class="inline-block px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black">+' + xp + ' XP پوائنٹس</span>' +
          '<h3 class="text-xl font-black text-white">' + title + '</h3>' +
          '<p class="text-xs text-slate-300 leading-relaxed font-sans">' + desc + '</p>' +
          '<button onclick="document.getElementById(\'motion-achievement-modal\').remove()" class="w-full mt-4 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-extrabold text-xs shadow-lg active:scale-95 transition">ماشاء اللہ، جاری رکھیں</button>' +
        '</div>' +
      '</div>';

      document.body.appendChild(modal);
      if (window.SoundEngine && typeof window.SoundEngine.playVictory === 'function') {
        window.SoundEngine.playVictory();
      }
    }

    celebrateCertificate(data = {}) {
      const studentName = data.studentName || 'طالب علم';
      const certTitle = data.title || 'شاہی سندِ فراغت و تکمیل';
      const serial = data.serial || 'LH-CERT-2026';

      const existing = document.getElementById('motion-cert-modal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'motion-cert-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl font-urdu select-none';
      modal.innerHTML = '<div class="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-amber-400 shadow-2xl text-center text-white animate-scale-in space-y-4">' +
        '<div class="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center text-3xl shadow-lg animate-float">👑</div>' +
        '<span class="inline-block px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-black">مستند و مصدقہ شاہی سند</span>' +
        '<h3 class="text-xl sm:text-2xl font-black text-amber-300">' + certTitle + '</h3>' +
        '<p class="text-xs sm:text-sm text-slate-300 font-sans">مبارک ہو <strong class="text-white font-bold">' + studentName + '</strong>! آپ نے کامیابی کے ساتھ تمام مراحل مکمل کر لیے ہیں۔</p>' +
        '<div class="p-3 rounded-2xl bg-black/40 border border-slate-800 text-[11px] text-slate-400 font-mono">سیریل نمبر: <span class="text-amber-400 font-bold">' + serial + '</span></div>' +
        '<div class="grid grid-cols-2 gap-3 pt-2">' +
          '<button onclick="window.Router.navigate(\'/certificates\'); document.getElementById(\'motion-cert-modal\').remove();" class="py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition">سند دیکھیں اور پرنٹ کریں</button>' +
          '<button onclick="document.getElementById(\'motion-cert-modal\').remove()" class="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs active:scale-95 transition">بند کریں</button>' +
        '</div>' +
      '</div>';

      document.body.appendChild(modal);
      if (window.SoundEngine && typeof window.SoundEngine.playVictory === 'function') {
        window.SoundEngine.playVictory();
      }
    }

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
            const duration = parseInt(el.getAttribute('data-count-duration'), 10) || 1200;
            
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

  window.Motion = new MotionEngine();
})();

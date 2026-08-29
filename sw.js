/**
 * LearnHub Progressive Web App Service Worker
 * Robust Offline Caching & Background Resilience
 */

const CACHE_NAME = 'learnhub-static-v105.0.0';
const RUNTIME_CACHE = 'learnhub-runtime-v105.0.0';

const STATIC_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './css/styles.css',
  './css/v2/design-system.css',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/logo.png',
  './images/learnhub-logo.png',
  './favicon.png',
  './js/config/uiConfig.js',
  './js/services/uiErrorBoundary.js',
  './js/services/motionEngine.js',
  './js/app.js',
  './js/router.js',
  './js/i18n.js',
  './js/data/db.js',
  './js/data/quranData.js',
  './js/data/libraryData.js',
  './js/services/cloudDatabase.js',
  './js/services/quranService.js',
  './js/services/aiKnowledgeEngine.js',
  './js/services/aiToolsEngine.js',
  './js/services/aiScholarService.js',
  './js/data/api.js',
  './js/services/auth.js',
  './js/services/soundEngine.js',
  './js/services/mediaEngine.js',
  './js/services/gameEngine.js',
  './js/views/v2/dashboardV2.js',
  './js/views/v2/navigationV2.js',
  './js/views/v2/coursesV2.js',
  './js/views/v2/quizzesV2.js',
  './js/views/v2/profileV2.js',
  './js/views/authViews.js',
  './js/views/home.js',
  './js/views/adventureGame.js',
  './js/views/courses.js',
  './js/views/learningPlayer.js',
  './js/views/quizzes.js',
  './js/views/quran.js',
  './js/views/tafsirView.js',
  './js/views/hadith.js',
  './js/views/aiScholar.js',
  './js/views/islamicFeatures.js',
  './js/views/articles.js',
  './js/views/instructorViews.js',
  './js/views/dashboard.js',
  './js/views/profile.js',
  './js/views/certificates.js',
  './js/views/achievements.js',
  './js/views/engagement.js',
  './js/views/checkout.js',
  './js/views/support.js',
  './js/views/dailyAzkar.js',
  './js/views/zakatCalculator.js',
  './js/views/admin/adminDashboard.js',
  './js/views/admin/adminReleases.js',
  './js/views/admin/adminGameStudio.js',
  './js/views/admin/adminAiStudio.js',
  './js/views/admin/adminCourses.js',
  './js/views/admin/adminQuizzes.js',
  './js/views/admin/adminInstructors.js',
  './js/views/admin/adminUsers.js',
  './js/views/admin/adminOrders.js',
  './js/views/admin/adminContent.js',
  './js/views/admin/adminQuranStudio.js'
];

// Message Event Listener for Instant Skip Waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SW_SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ── NEVER cache these: Firebase/Auth/Firestore/reCAPTCHA/GenerativeAI ─────────
const NEVER_CACHE_PATTERNS = [
  'firestore.googleapis.com',
  'firebase.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'accounts.google.com',
  'googleapis.com/google.firestore',
  'generativelanguage.googleapis.com',
  'recaptcha',
  'www.google.com/recaptcha',
  'firebaseinstallations.googleapis.com'
];

// Install Event - Pre-cache App Shell with atomic resilience
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching App Shell v103.0.0');
      return Promise.allSettled(
        STATIC_ASSETS.map(asset => cache.add(asset).catch(e => console.warn('[SW] Cache item skipped:', asset, e)))
      );
    })
  );
});

// Activate Event - Purge all older caches immediately and claim clients
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('[ServiceWorker] Purging stale cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

/**
 * Fetch Event - Ultra-Fast Performance Architecture:
 * 1. Navigation requests: Network with 1.2s Fast Timeout -> Cached index.html
 * 2. Static Assets (.js, .css, images, fonts): Stale-While-Revalidate (Instant 5ms load + background update)
 * 3. Never-Cache API & Auth: Direct pass-through
 */
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // NEVER cache Firebase / Auth / Firestore / Gemini AI — private user data
  if (NEVER_CACHE_PATTERNS.some(pattern => request.url.includes(pattern))) {
    return; // Let browser handle directly
  }

  // 1. Navigation Requests: Fast Network with 1.2s Timeout -> Cached App Shell
  if (request.mode === 'navigate') {
    event.respondWith(
      new Promise((resolve) => {
        let responded = false;

        // Fast Timeout for slow networks / offline / TWA cold starts
        const timeoutId = setTimeout(() => {
          if (!responded) {
            responded = true;
            caches.match('./index.html').then((cached) => {
              if (cached) resolve(cached);
              else resolve(caches.match(request));
            });
          }
        }, 1200);

        fetch(request)
          .then((networkResponse) => {
            clearTimeout(timeoutId);
            if (!responded) {
              responded = true;
              if (networkResponse && networkResponse.status === 200) {
                const copy = networkResponse.clone();
                caches.open(CACHE_NAME).then((c) => c.put('./index.html', copy));
              }
              resolve(networkResponse);
            }
          })
          .catch(() => {
            clearTimeout(timeoutId);
            if (!responded) {
              responded = true;
              caches.match('./index.html').then((cachedIndex) => {
                resolve(cachedIndex || caches.match(request));
              });
            }
          });
      })
    );
    return;
  }

  // 2. Same-origin Scripts & Styles: Stale-While-Revalidate (Instant Cached Delivery + Background Revalidation)
  if (url.origin === self.location.origin && (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.html') || url.pathname.endsWith('.json'))) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        }).catch(() => {/* Offline fallback */});

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. Static Media / Icons / Images / External CDNs: Cache-First with Background Update
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          const responseToCache = networkResponse.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {/* Offline fallback */});

      return cachedResponse || fetchPromise;
    })
  );
});

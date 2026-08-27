/**
 * LearnHub Progressive Web App Service Worker
 * Performance-first caching with safe network handling for live data.
 */

const CACHE_NAME = 'learnhub-static-v98.0.0';
const RUNTIME_CACHE = 'learnhub-runtime-v98.0.0';

const STATIC_ASSETS = [
  './', './index.html', './manifest.json',
  './css/styles.css', './css/v2/design-system.css',
  './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-maskable-192.png', './icons/icon-maskable-512.png',
  './icons/logo.png', './images/learnhub-logo.png', './favicon.png',
  './js/config/uiConfig.js', './js/services/uiErrorBoundary.js',
  './js/services/motionEngine.js', './js/app.js', './js/router.js',
  './js/i18n.js', './js/data/db.js', './js/data/quranData.js',
  './js/data/libraryData.js', './js/services/cloudDatabase.js',
  './js/services/quranService.js', './js/data/api.js', './js/services/auth.js',
  './js/services/soundEngine.js', './js/services/mediaEngine.js',
  './js/services/gameEngine.js', './js/views/v2/dashboardV2.js',
  './js/views/v2/navigationV2.js', './js/views/v2/coursesV2.js',
  './js/views/v2/quizzesV2.js', './js/views/v2/profileV2.js',
  './js/views/authViews.js', './js/views/home.js', './js/views/adventureGame.js',
  './js/views/courses.js', './js/views/learningPlayer.js', './js/views/quizzes.js',
  './js/views/quran.js', './js/views/hadith.js', './js/views/islamicFeatures.js',
  './js/views/articles.js', './js/views/instructorViews.js', './js/views/dashboard.js',
  './js/views/profile.js', './js/views/certificates.js', './js/views/achievements.js',
  './js/views/engagement.js', './js/views/checkout.js', './js/views/support.js'
];

// Never intercept/cache private or live backend requests.
const NEVER_CACHE = [
  'firestore.googleapis.com', 'firebase.googleapis.com',
  'identitytoolkit.googleapis.com', 'securetoken.googleapis.com',
  'accounts.google.com', 'googleapis.com/google.firestore',
  'recaptcha', 'www.google.com/recaptcha',
  'firebaseinstallations.googleapis.com'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(STATIC_ASSETS).catch(err => console.warn('[SW] App shell cache warning:', err))
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME && key !== RUNTIME_CACHE)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SW_SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !request.url.startsWith('http')) return;

  const url = new URL(request.url);
  if (NEVER_CACHE.some(pattern => request.url.includes(pattern))) return;

  // HTML/navigation: network-first keeps deployments fresh, with instant cached fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok) caches.open(RUNTIME_CACHE).then(cache => cache.put(request, response.clone()));
        return response;
      }).catch(() =>
        caches.match(request).then(cached => cached || caches.match('./index.html'))
      )
    );
    return;
  }

  // Local application code: CACHE-FIRST + background revalidation.
  // This avoids the previous behavior where every JS/CSS file waited on the network.
  if (url.origin === self.location.origin &&
      /\.(?:js|css|html)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cached => {
        const refresh = fetch(request).then(response => {
          if (response.ok) caches.open(RUNTIME_CACHE).then(cache => cache.put(request, response.clone()));
          return response;
        }).catch(() => null);
        return cached || refresh;
      })
    );
    return;
  }

  // Images, fonts, icons and other static resources: cache-first with background refresh.
  event.respondWith(
    caches.match(request).then(cached => {
      const refresh = fetch(request).then(response => {
        if (response.ok || response.type === 'opaque') {
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, response.clone()));
        }
        return response;
      }).catch(() => null);
      return cached || refresh;
    })
  );
});

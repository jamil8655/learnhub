/**
 * LearnHub Progressive Web App Service Worker
 * Performance-first caching with safe network handling for live data.
 */

const CACHE_NAME = 'learnhub-static-v99.0.0';
const RUNTIME_CACHE = 'learnhub-runtime-v99.0.0';

// Keep the first-install app shell deliberately small. Feature views are
// cached on demand instead of blocking service-worker installation.
const STATIC_ASSETS = [
  './', './index.html', './manifest.json',
  './css/styles.css', './css/v2/design-system.css',
  './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-maskable-192.png', './icons/icon-maskable-512.png',
  './images/learnhub-logo.png', './favicon.png',
  './js/config/uiConfig.js', './js/services/uiErrorBoundary.js',
  './js/app.js', './js/router.js', './js/i18n.js', './js/data/db.js',
  './js/services/cloudDatabase.js', './js/data/api.js', './js/services/auth.js'
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
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(key => key !== CACHE_NAME && key !== RUNTIME_CACHE)
        .map(key => caches.delete(key))
    );

    // Allow the browser to start navigation requests through the SW as early
    // as possible on repeat visits.
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SW_SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !request.url.startsWith('http')) return;

  const url = new URL(request.url);
  if (NEVER_CACHE.some(pattern => request.url.includes(pattern))) return;

  // Navigation: use cached HTML immediately when available and refresh it in
  // the background. On a truly first visit, use navigation preload/network.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cached = await caches.match(request) || await caches.match('./index.html');
      const preload = await event.preloadResponse;
      const networkPromise = preload || fetch(request);

      if (cached) {
        event.waitUntil(networkPromise.then(response => {
          if (response?.ok) return caches.open(RUNTIME_CACHE).then(cache => cache.put(request, response.clone()));
        }).catch(() => undefined));
        return cached;
      }

      try {
        const response = await networkPromise;
        if (response?.ok) {
          event.waitUntil(caches.open(RUNTIME_CACHE).then(cache => cache.put(request, response.clone())));
        }
        return response;
      } catch {
        return caches.match('./index.html');
      }
    })());
    return;
  }

  // Local application code: cache-first with background revalidation.
  if (url.origin === self.location.origin && /\.(?:js|css|html)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cached => {
        const refresh = fetch(request).then(response => {
          if (response.ok) return caches.open(RUNTIME_CACHE).then(cache => cache.put(request, response.clone())).then(() => response);
          return response;
        }).catch(() => null);
        return cached || refresh;
      })
    );
    return;
  }

  // Images, fonts, icons and other static resources: cache-first with
  // background refresh. This keeps repeat visits fast without blocking UI.
  event.respondWith(
    caches.match(request).then(cached => {
      const refresh = fetch(request).then(response => {
        if (response.ok || response.type === 'opaque') {
          return caches.open(RUNTIME_CACHE).then(cache => cache.put(request, response.clone())).then(() => response);
        }
        return response;
      }).catch(() => null);
      return cached || refresh;
    })
  );
});

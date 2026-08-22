/**
 * LearnHub Progressive Web App Service Worker
 * Offline-first shell with safe cache lifecycle, runtime resilience,
 * navigation fallback and stale-cache recovery.
 */

const CACHE_VERSION = '52.0.0';
const CACHE_NAME = `learnhub-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `learnhub-runtime-${CACHE_VERSION}`;
const OFFLINE_URL = './index.html';

const STATIC_ASSETS = [
  './', './index.html', './manifest.json', './css/styles.css',
  './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-maskable-192.png', './icons/icon-maskable-512.png', './icons/icon.svg',
  './js/app.js', './js/router.js', './js/i18n.js',
  './js/data/db.js', './js/data/api.js', './js/services/cloudDatabase.js',
  './js/services/auth.js', './js/services/soundEngine.js', './js/services/mediaEngine.js',
  './js/services/gameEngine.js', './js/views/authViews.js', './js/views/home.js',
  './js/views/adventureGame.js', './js/views/courses.js', './js/views/learningPlayer.js',
  './js/views/quizzes.js', './js/views/quran.js', './js/views/hadith.js',
  './js/views/islamicFeatures.js', './js/views/articles.js', './js/views/instructorViews.js',
  './js/views/dashboard.js', './js/views/profile.js', './js/views/certificates.js',
  './js/views/achievements.js', './js/views/engagement.js', './js/views/checkout.js',
  './js/views/support.js', './js/views/admin/adminDashboard.js',
  './js/views/admin/adminGameStudio.js', './js/views/admin/adminCourses.js',
  './js/views/admin/adminQuizzes.js', './js/views/admin/adminInstructors.js',
  './js/views/admin/adminUsers.js', './js/views/admin/adminOrders.js',
  './js/views/admin/adminContent.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Cache each asset independently so one missing optional asset cannot abort
    // installation of the entire PWA shell.
    await Promise.allSettled(STATIC_ASSETS.map(async (asset) => {
      try { await cache.add(asset); } catch (error) {
        console.warn('[LearnHub SW] Could not cache:', asset, error);
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(name => name.startsWith('learnhub-') && ![CACHE_NAME, RUNTIME_CACHE].includes(name))
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

async function cacheNetworkResponse(cacheName, request, response) {
  if (!response || (response.status !== 200 && response.type !== 'opaque')) return response;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!['http:', 'https:'].includes(url.protocol)) return;

  // Never cache authenticated/API-like requests or third-party data as app data.
  const isSameOrigin = url.origin === self.location.origin;
  const isAppAsset = isSameOrigin && /\.(?:js|css|html|json|svg|png|jpg|jpeg|webp|ico|woff2?)$/i.test(url.pathname);

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const network = await fetch(request);
        if (network.ok) await cacheNetworkResponse(CACHE_NAME, request, network);
        return network;
      } catch (_) {
        return (await caches.match(request)) || (await caches.match(OFFLINE_URL)) || Response.error();
      }
    })());
    return;
  }

  if (isAppAsset) {
    event.respondWith((async () => {
      try {
        const network = await fetch(request);
        await cacheNetworkResponse(CACHE_NAME, request, network);
        return network;
      } catch (_) {
        return (await caches.match(request)) || Response.error();
      }
    })());
    return;
  }

  // Cache-first for safe public static media; failures simply fall back to network.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) {
      fetch(request).then(response => cacheNetworkResponse(RUNTIME_CACHE, request, response)).catch(() => {});
      return cached;
    }
    try {
      const network = await fetch(request);
      await cacheNetworkResponse(RUNTIME_CACHE, request, network);
      return network;
    } catch (_) {
      return Response.error();
    }
  })());
});

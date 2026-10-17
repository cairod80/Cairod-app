// Xairod Service Worker
// Strategy: Cache-first for static assets, network-first for API/auth/dynamic

const CACHE_VERSION = 'xairod-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const OFFLINE_URL = '/offline.html';

// Static assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.ico',
];

// Never cache these — always go to network
const NEVER_CACHE = [
  '/supabase',
  'supabase.co',
  'paystack.co',
  'googleapis.com',
  '/api/',
  '/auth/',
  '/__/auth/',
  'identitytoolkit',
  'securetoken',
];

const shouldNeverCache = (url) =>
  NEVER_CACHE.some(pattern => url.includes(pattern));

// ── INSTALL: pre-cache static shell ────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clean old caches ──────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith('xairod-') && key !== STATIC_CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ── FETCH: smart routing strategy ──────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = request.url;

  // Skip non-GET, chrome-extension, and browser-internal requests
  if (request.method !== 'GET') return;
  if (!url.startsWith('http')) return;

  // Never cache sensitive/dynamic requests — always network
  if (shouldNeverCache(url)) {
    event.respondWith(fetch(request));
    return;
  }

  // For navigation (HTML page loads) — network-first, offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone and cache the fresh response for future offline use
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(request)
            .then(cached => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // For static assets (JS/CSS/images/fonts) — cache-first
  if (
    url.includes('/static/') ||
    url.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff2?|ttf)(\?|$)/)
  ) {
    event.respondWith(
      caches.match(request)
        .then(cached => {
          if (cached) return cached;
          return fetch(request).then(response => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(STATIC_CACHE).then(cache => cache.put(request, clone));
            }
            return response;
          });
        })
    );
    return;
  }

  // Default: network-first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

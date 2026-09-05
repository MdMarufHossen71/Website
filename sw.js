/* Portfolio Service Worker — offline-first for static assets, network-first for HTML.
   Version: v1 — bump on deploy to force update. */
const CACHE = 'maruf-portfolio-v1';
const CORE = [
  './',
  'index.html',
  'offline.html',
  'site.webmanifest',
  'favicon-32x32.png',
  'android-chrome-192x192.png',
  'Design/style.css',
  'JavaScript/script.js',
  'assets/js/supabase-client.js',
  'assets/js/i18n.js',
  'assets/js/faq-bot.js',
  'assets/css/faq-bot.css'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Never cache analytics / ads / third-party APIs / supabase / calendly
  if (/googletagmanager|google-analytics|adsbygoogle|ahrefs|supabase|calendly|formspree/i.test(url.hostname + url.href)) {
    return;
  }

  // HTML pages: network-first, fall back to cache, then offline page
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((hit) => hit || caches.match('offline.html')))
    );
    return;
  }

  // Static assets: cache-first, update in background
  e.respondWith(
    caches.match(request).then((hit) => {
      const net = fetch(request)
        .then((res) => {
          if (res && res.status === 200 && (url.origin === location.origin)) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});

// Service worker pour Cultura — cache offline simple
const CACHE = 'cultura-v5';
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/app.js',
  './js/icons.js',
  './js/i18n.js',
  './js/data.js',
  './js/games/quiz.js',
  './js/games/timeAttack.js',
  './js/games/trueFalse.js',
  './js/games/memory.js',
  './js/games/guessImage.js',
  './data/themes.json',
  './data/flags.json',
  './data/cinema.json',
  './data/droit.json',
  './data/jeuxvideos.json',
  './data/litterature.json',
  './data/voitures.json',
  './data/sport.json',
  './data/histoire.json',
  './icons/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Mise en cache des ressources statiques fetchées
          if (res.ok && (req.url.includes('/data/') || req.url.includes('/icons/') || req.url.includes('/js/') || req.url.includes('/css/'))) {
            const clone = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});

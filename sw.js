// Garde la page relais en mémoire pour qu'un passage de tag fonctionne aussi sans internet.
// Aucune donnée de montre n'est mémorisée ici. Changer de version si index.html change.
const CACHE = 'relais-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['index.html'])));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

// Page demandée (avec ?m=montre0018) : internet d'abord, sinon la copie mémorisée
self.addEventListener('fetch', (e) => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(fetch(e.request).catch(() => caches.match('index.html')));
});

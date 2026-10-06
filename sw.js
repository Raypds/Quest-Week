// Service worker: rende l'app utilizzabile offline.
// Network-first: online carica sempre la versione aggiornata, offline usa la copia in cache.
const CACHE = 'questweek-v8';
const ASSETS = [
  './', 'index.html', 'manifest.json', 'draghetto.js',
  'icons/icon-32.png', 'icons/icon-192.png', 'icons/icon-512.png',
  'icons/icon-maskable-192.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  // cache: 'reload' = scarica i file freschi dal server, non la copia del browser
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Solo i file dell'app: le richieste a Supabase (dati, accesso) vanno sempre in rete e non si salvano
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    // cache: 'no-cache' = chiedi sempre al server se il file è cambiato (risposta minima se è uguale),
    // invece di riusare per minuti la copia del browser: così gli aggiornamenti arrivano subito
    fetch(e.request.url, { cache: 'no-cache', credentials: 'same-origin' })
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

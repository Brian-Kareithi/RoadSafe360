const CACHE_NAME = 'roadsafe360-v1';
const urlsToCache = [
  '/',
  '/auth',
  '/dashboard/admin',
  '/dashboard/police',
  '/dashboard/driver',
  '/dashboard/authority',
  '/licence',
  '/offences',
  '/appeals',
  '/reports',
  '/analytics',
  '/regions',
  '/notifications',
  '/settings',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      )
    )
  );
});

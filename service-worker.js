self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('loemii-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/scripts.js',
        '/manifest.json',
        '/service-worker.js',
        '/images/background.jpg',
        '/images/icon-192x192.png',
        '/images/icon-512x512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

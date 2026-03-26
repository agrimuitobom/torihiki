// Uninstall: clean up all caches and unregister
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))),
  );
  self.clients.claim();
  self.registration.unregister();
});

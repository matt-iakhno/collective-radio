const CACHE_NAME = "collective-radio-cache-v1";
const urlsToCache = ["/", "/index.html", "/manifest.webmanifest"];

// Install event: Cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Activate the new service worker immediately
});

// Fetch event: Serve cached content when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Activate event: Clean up old caches and notify clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim(); // Take control of all clients immediately
});

// Notify clients about updates
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Notify clients when a new service worker is activated
self.addEventListener("activate", async () => {
  const clients = await self.clients.matchAll({ type: "window" });
  clients.forEach((client) => client.postMessage({ type: "UPDATE_AVAILABLE" }));
});

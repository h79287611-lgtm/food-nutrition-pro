const cacheName = "food-nutrition-shell-v1";

self.addEventListener("install", event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.add("/")));
});

self.addEventListener("fetch", event => {
  if (event.request.mode !== "navigate" || new URL(event.request.url).pathname !== "/") return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put("/", response.clone());
      return response;
    } catch (error) {
      const offlinePage = await cache.match("/");
      if (offlinePage) return offlinePage;
      throw error;
    }
  })());
});

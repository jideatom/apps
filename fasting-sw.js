// NaijaFast v4 — force update
const CACHE = "naijafast-v4-r2";
const ASSETS = [
  "fasting-index.html",
  "fasting-food.html",
  "fasting-history.html",
  "fasting-manifest.json"
];
// Install: cache all, skip waiting immediately
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting(); // take over immediately
});
// Activate: delete ALL old caches, claim all clients NOW
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim()) // control all open tabs instantly
  );
});
// Fetch: network-first so fresh files always win, fall back to cache
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
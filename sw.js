const C = 'ai-net-v4';
const ASSETS = ['./index.html','./manifest.json','./style.css','./app.js','./icon-192.png','./icon-512.png'];
self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(C).then(function(cache) {
    return cache.addAll(ASSETS);
  }).then(function() { return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k) { return k !== C; }).map(function(k) {
      return caches.delete(k);
    }));
  }).then(function() { return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e) {
  e.respondWith(caches.match(e.request).then(function(r) {
    return r || fetch(e.request).catch(function() {
      return caches.match('./index.html');
    });
  }));
});
var cacheName = 'version1'
var appShellFiles = [
  '/Vue-app/',
  '/Vue-app/index.html',
  '/Vue-app/app.js',
  '/Vue-app/style.css',
  '/Vue-app/sleep.png',
  '/Vue-app/eat.png',
  '/Vue-app/repeat.png',
  '/Vue-app/icon96.png',
  '/Vue-app/icon64.png',
];

// Installing Service Worker
self.addEventListener('install', function(e) {
    console.log('[Service Worker] Install');
    e.waitUntil(
      caches.open(cacheName).then(function(cache) {
        console.log('[Service Worker] Caching all: app shell and content');
        return cache.addAll(contentToCache);
      })
    );
  });

  // Activate service worker on update
self.addEventListener('activate', (e) => {
    e.waitUntil(
      caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
          if(key !== cacheName) {
            return caches.delete(key);
          }
        }));
      })
    );
  });
  
  // Fetching content using Service Worker
  self.addEventListener('fetch', function(e) {
    e.respondWith(
      caches.match(e.request).then(function(r) {
        console.log('[Service Worker] Fetching resource: '+e.request.url);
        return r || fetch(e.request).then(function(response) {
          return caches.open(cacheName).then(function(cache) {
            console.log('[Service Worker] Caching new resource: ' + e.request.url);
            cache.put(e.request, response.clone());
            return response;
          });
        });
      })
    );
  });
  
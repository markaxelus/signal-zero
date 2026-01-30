const CACHE_NAME = 'map-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js',
  'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  // Try Network, fallback to Cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
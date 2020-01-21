const version = '0.0.3'
const CACHE_NAME = `hammerdice-v${version}`
const urlsToCache = [
  '/',
  '/index.html',
  '/main.js',
  'manifest.json',
  '/favicon.ico',
  'icon-72x72.png',
  'icon-96x96.png',
  'icon-128x128.png',
  'icon-144x144.png',
  'icon-152x152.png',
  'icon-192x192.png',
  'icon-384x384.png',
  'icon-512x512.png'
]

self.addEventListener('install', event =>
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
      })
      .then(() => self.clients.matchAll({ includeUncontrolled: true }))
      .then(clients => {
        if (self.registration.active) {
          self.skipWaiting()
          clients.forEach(client => client.postMessage('update-available'))
        }
      })
  )
)

self.addEventListener('fetch', event =>
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response
      }
      return fetch(event.request)
    })
  )
)

self.addEventListener('activate', event =>
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        )
      })
      .then(() => self.clients.claim())
  )
)

const CACHE_NAME = 'habit-tracker-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js'
];

// Установка — кешируем файлы
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Запросы — отдаём из кеша или сети
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Если в кеше — отдаём, иначе идём в сеть
                return response || fetch(event.request);
            })
    );
});

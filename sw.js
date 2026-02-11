const CACHE_NAME = 'calendar-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json'
];

// Установка - кешируем файлы
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Кеш открыт');
                return cache.addAll(urlsToCache);
            })
    );
});

// Запросы - отдаем из кеша или сети
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Если в кеше - отдаем, иначе идем в сеть
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Обновление - чистим старый кеш
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

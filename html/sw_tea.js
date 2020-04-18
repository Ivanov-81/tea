const CACHE_NAME = 'sw_tea_v1.0',
    CACHED_URLS = [
        './html/bundle.js',
        './html/styles.css',
    ];

// При установке воркера мы кешируем данные (статику).
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(cache => cache.addAll(CACHED_URLS))
            // `skipWaiting()` необходим, потому что мы хотим активировать SW
            // и контролировать его сразу, а не после перезагрузки.
            .then(() => self.skipWaiting())
    )
});
//
// self.addEventListener('activate', evt => {
//     evt.waitUntil(
//         caches.keys().then(CACHE_NAMES => {
//             return Promise.all(
//                 CACHE_NAMES.map(cache => {
//                     if(cache !== CACHE_NAME) {
//                         return caches.delete(cache);
//                     }
//                 })
//             )
//         })
//     );
// });
//
// self.addEventListener('fetch', event => {
//     if (event.request.method !== 'GET')
//         return;
//
//     event.respondWith(
//         fetch(event.request)
//             .then((response) => {
//                 if(response) {
//                     const resClone = response.clone();
//                     caches
//                         .open(CACHE_NAME)
//                         .then((cache) => {
//                             if (!/^https?:$/i.test(new URL(event.request.url).protocol)) return;
//                             cache.put(event.request, resClone);
//                         });
//                     return response;
//                 }
//             })
//             .catch(err => {
//                 return caches.match(event.request)
//                     .then(response => response)
//                     .catch(err => {
//                         console.log(err);
//                     })
//             })
//     );
// });

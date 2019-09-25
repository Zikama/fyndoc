//Initializing Service Worker.   
let refreshing;
const cacheName = "V1",
    sw = "Service Worker: ";
self.addEventListener("install", e => {}); //Activate  
self.addEventListener("activate", e => {
    e.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            return Promise.resolve((() => {
                cache.addAll(
                    [
                        '/404-page',
                        '/'
                    ]
                );

            })())
        })
        .then(() => {

            caches.keys().then(cache_nms => {
                return Promise.all(
                    cache_nms.map(cache => {
                        if (cache != cacheName) {
                            return caches.delete(cache);
                        }
                    })
                );
            })
        })
    );
});

function fetc(e) {
    e.respondWith(
        fetch(e.request)
        .then(res => {
            // Match 404 page
            if (res.status == 404) {
                return caches.match("/404-page").then(res => res).catch(() => {
                    return "/404-page"
                })
            }
            //Clone
            const resClone = res.clone(); // cache
            caches.open(cacheName)
                .then(cache => {
                    if (e.request.method == "GET") {
                        cache.put(e.request, resClone);
                    }
                });
            refreshing = res;
            return res;
        }).catch(err => caches.match(e.request).then(res => res)));
}
//Fetch
self.addEventListener("fetch",fetc);

self.addEventListener('message', (event) => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
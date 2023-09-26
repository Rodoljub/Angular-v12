const VERSION = 'v4';



self.addEventListener('install', event => event.waitUntil(installServiceWorker(event)));


async function installServiceWorker(event) {

    console.log(event)
    log("Service Worker installation started ");

    const testFolder = './';


    const cache = await caches.open(getCacheName());

    return cache.addAll([
        '/',
        "/favicon.ico",
        "/index.html"
    ]);
}

self.addEventListener('activate', () => activateSW());


async function activateSW() {

    log('Service Worker activated');

    const cacheKeys = await caches.keys();

    cacheKeys.forEach(cacheKey => {
        if (cacheKey !== getCacheName() ) {
            caches.delete(cacheKey);
        }
    });

}





self.addEventListener('fetch', event => event.respondWith(cacheThenNetwork(event)));



async function cacheThenNetwork(event) {

    const cache = await caches.open(getCacheName());

    const cachedResponse = await cache.match(event.request);

    if (cachedResponse) {
        log('Serving From Cache: ' + event.request.url);
        return cachedResponse;
    }
    console.log('fatch:' + event.request.destination)
    const networkResponse = await fetch(event.request);

    cache.put(event.request, networkResponse.clone());

    log('Calling network: ' + event.request.url);

    return networkResponse;


}




// self.addEventListener('fetch', function(e) {
//     var request = e.request;

//     e.respondWith(
//         fetch(e.request)
//         .then(function(res) {
//             return caches.open(getCacheName())
//                 .then(function(cache) {
//                     cache.put(e.request.url, res.clone());
//                     return res;
//                 })
//         })
//         .catch(function(err) {
//             return caches.match(e,request);
//         })
//     )
// })




function getCacheName() {
    return "app-cache-" + VERSION;
}


function log(message, ...data) {
    if (data.length > 0) {
        console.log(VERSION, message, data);
    }
    else {
        console.log(VERSION, message);
    }
}
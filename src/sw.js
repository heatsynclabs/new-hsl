import { startsWith } from 'lodash';

const CACHE_NAME = 'static-v1';
console.log('im the service worker ok!');


self.addEventListener('activate', (event) => {
  console.log('activate event', event);
});


self.addEventListener('install', (event) => {
  console.log('install', event);
});


self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }
  const cacheRequest = request.clone();
  const inspectRequest = request.clone();
  if (!startsWith(request.url, request.referrer)) {
    return;
  }
  console.log('inspectRequest', inspectRequest);
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            console.log('caching', event.request);
            cache.put(event.request, responseToCache);
          });
        return response;
      })
      .catch((err) => {
        console.log('couldnt fetch', err);
        return caches.match(cacheRequest);
      }),
  );
});

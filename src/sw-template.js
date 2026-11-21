const PREFIX = 'nathy-pwa-';
const CACHE = PREFIX + '__VERSION__';
const CORE = __CORE__;
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    for (const path of CORE) {
      const response = await fetch(new Request(path, {cache:'reload'}));
      if (!response.ok || response.redirected) throw new Error('App shell unavailable');
      await cache.put(path, response);
    }
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  const navigation = request.mode === 'navigate';
  if (!navigation && !['style','script','image','font'].includes(request.destination)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    try {
      const response = await fetch(request, {signal:controller.signal});
      if (response.ok && !response.redirected && (!navigation || response.headers.get('content-type')?.includes('text/html'))) {
        const key = navigation ? new URL(url.pathname, url.origin).href : request;
        await cache.put(key, response.clone());
      }
      return response;
    } catch {
      const pageKey = navigation && url.pathname === new URL(self.registration.scope).pathname ? new URL('index.html',self.registration.scope).href : new URL(url.pathname,url.origin).href;
      return await cache.match(navigation ? pageKey : request)
        || (navigation && await cache.match('offline.html'))
        || Response.error();
    } finally { clearTimeout(timer); }
  })());
});

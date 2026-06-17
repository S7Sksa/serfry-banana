const CACHE_NAME = 'serfry-banana-v1';
const OFFLINE_URL = '/index.html';

self.addEventListener('install', (event) => {
  // تخطي الانتظار لتفعيل النسخة الجديدة فوراً
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((name) => (name !== CACHE_NAME ? caches.delete(name) : undefined)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 🛡️ مهم جداً: لا تُخبّن طلبات Google Drive أو تيارات التحميل الكبيرة
  if (request.url.includes('googleapis.com') || request.url.includes('drive.google.com')) {
    return;
  }

  // 🌐 للصفحات الرئيسية (App Shell)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // 📦 للموارد الثابتة: Cache-First مع استرجاع من الشبكة عند التعطل
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) return networkResponse;

        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        return networkResponse;
      }).catch(() => {
        if (request.destination === 'document') return caches.match(OFFLINE_URL);
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
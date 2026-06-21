const AUTH_BYPASS_PREFIXES = ["/login", "/register", "/verify-2fa", "/app", "/api/"];

function shouldBypassServiceWorkerCache(url) {
  if (url.origin !== self.location.origin) return false;
  const path = url.pathname;
  return AUTH_BYPASS_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (shouldBypassServiceWorkerCache(url)) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(fetch(event.request));
});

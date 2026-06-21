const AUTH_BYPASS_PREFIXES = ["/login", "/register", "/verify-2fa", "/app", "/api/"];

function shouldBypassServiceWorkerCache(url) {
  if (url.origin !== self.location.origin) return false;
  const path = url.pathname;
  return AUTH_BYPASS_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
}

function passthroughFetch(request) {
  return fetch(request).catch(() => Response.error());
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Network-only passthrough. Never cache auth, APP, or API routes.
  if (shouldBypassServiceWorkerCache(url)) {
    event.respondWith(passthroughFetch(event.request));
    return;
  }

  event.respondWith(passthroughFetch(event.request));
});

// Bump this on any change to what/how this file caches — activate() uses
// it to drop every older cache so a deploy never serves stale assets.
const CACHE_VERSION = "pilu-shell-v1";

const PRECACHE_URLS = [
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/branding/pilu-logo.png",
  "/icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function isStaticAsset(url) {
  return url.pathname.startsWith("/_next/static/")
    || url.pathname.startsWith("/icons/")
    || url.pathname.startsWith("/branding/")
    || url.pathname === "/icon.png"
    || url.pathname === "/favicon.ico"
    || url.pathname === "/manifest.webmanifest";
}

/**
 * Real app-shell offline support, hand-rolled (no Workbox) to match the
 * rest of this app's dependency-light convention:
 *
 * - Navigations (loading a page, `mode: "navigate"`): network-first —
 *   always try the live page so signed-in content stays current — and on
 *   failure, fall back to whatever was last cached for that same URL, so
 *   an already-visited screen still opens without a connection.
 * - Static assets (`/_next/static/`, icons, branding, the manifest):
 *   cache-first. These are content-hashed and immutable per deploy, so
 *   there's nothing to go stale — serve instantly from cache and only
 *   hit the network the first time a given file is needed.
 * - Everything else (API routes, Supabase requests, RSC/data fetches,
 *   cross-origin requests, non-GET requests) is left completely alone —
 *   no `respondWith`, so the browser's normal fetch behavior applies.
 *   Offline writes are handled at the app layer instead (see
 *   lib/offline/), which knows how to queue and replay a mutation
 *   correctly; a service worker cache can't safely do that.
 */
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        });
      }),
    );
  }
});

// Push notification handling (Phase 19) — provider-agnostic: whichever
// service (FCM, OneSignal, or a bare Web Push send) delivers the push,
// this just needs a { title, body, link } shaped payload.
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload = {};
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Pilu", body: event.data.text() };
  }
  const { title = "Pilu", body, link } = payload;
  event.waitUntil(self.registration.showNotification(title, { body, data: { link }, icon: "/icons/icon-192.png", badge: "/icons/icon-192.png" }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = event.notification.data?.link || "/notifications/inbox";
  event.waitUntil(self.clients.openWindow(link));
});

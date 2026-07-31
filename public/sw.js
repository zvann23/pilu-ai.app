self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

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

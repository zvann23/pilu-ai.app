import type { PushProvider } from "./types";

/**
 * Firebase Cloud Messaging, implemented against the standard Web Push API
 * (PushManager + VAPID) rather than the Firebase SDK, so this adds no new
 * dependency. The returned subscription endpoint is what a server-side
 * sender would post to FCM's HTTP v1 API. Requires:
 *   - NEXT_PUBLIC_FCM_VAPID_KEY (the Firebase Cloud Messaging Web Push
 *     certificate key, from Firebase Console → Project Settings → Cloud
 *     Messaging)
 *   - A service worker registered at the app's origin (already true here —
 *     see public/sw.js) to receive the "push" event.
 */
function vapidKeyToBufferSource(vapidKey: string): BufferSource {
  const padding = "=".repeat((4 - (vapidKey.length % 4)) % 4);
  const base64 = (vapidKey + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0))).buffer as ArrayBuffer;
}

export const fcmPushProvider: PushProvider = {
  name: "fcm",

  isConfigured() {
    return Boolean(process.env.NEXT_PUBLIC_FCM_VAPID_KEY) && typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;
  },

  async register() {
    if (!this.isConfigured()) return null;
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKeyToBufferSource(process.env.NEXT_PUBLIC_FCM_VAPID_KEY as string),
    });
    return subscription.endpoint;
  },

  async unregister() {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    await subscription?.unsubscribe();
  },
};

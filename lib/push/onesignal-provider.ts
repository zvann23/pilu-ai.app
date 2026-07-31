import type { PushProvider } from "./types";

declare global {
  interface Window {
    OneSignalDeferred?: ((OneSignal: OneSignalWebSdk) => void)[];
  }
}

type OneSignalWebSdk = {
  init: (options: { appId: string }) => Promise<void>;
  Notifications: { requestPermission: () => Promise<boolean> };
  User: { PushSubscription: { id: string | null; optIn: () => Promise<void>; optOut: () => Promise<void> } };
};

let scriptLoadPromise: Promise<void> | null = null;

/** Loads OneSignal's Web SDK via a script tag — no npm dependency required. */
function loadOneSignalScript(): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load the OneSignal SDK"));
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

function withOneSignal<T>(run: (OneSignal: OneSignalWebSdk) => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push((OneSignal) => run(OneSignal).then(resolve).catch(reject));
  });
}

/**
 * OneSignal, via their Web SDK script tag. Requires
 * NEXT_PUBLIC_ONESIGNAL_APP_ID (from the OneSignal dashboard).
 */
export const oneSignalPushProvider: PushProvider = {
  name: "onesignal",

  isConfigured() {
    return Boolean(process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) && typeof window !== "undefined";
  },

  async register() {
    if (!this.isConfigured()) return null;
    await loadOneSignalScript();
    return withOneSignal(async (OneSignal) => {
      await OneSignal.init({ appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID as string });
      const granted = await OneSignal.Notifications.requestPermission();
      if (!granted) return null;
      await OneSignal.User.PushSubscription.optIn();
      return OneSignal.User.PushSubscription.id;
    });
  },

  async unregister() {
    if (!this.isConfigured()) return;
    await loadOneSignalScript();
    await withOneSignal((OneSignal) => OneSignal.User.PushSubscription.optOut());
  },
};

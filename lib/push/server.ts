import type { PushPayload, PushProviderName } from "./types";

/**
 * Server-side send — the counterpart to the client-side registration
 * providers. Actual delivery always happens from a server (never the
 * browser) since it requires each provider's private server key. No-ops
 * with a console note when that provider isn't configured, exactly like
 * askGemini()'s demo-mode fallback, so the rest of the notification
 * pipeline (in-app inbox, preferences) works the same whether or not push
 * is wired up yet.
 */
export async function sendPush(provider: PushProviderName, token: string, payload: PushPayload): Promise<void> {
  if (provider === "fcm") return sendViaFcm(token, payload);
  if (provider === "onesignal") return sendViaOneSignal(token, payload);
  console.info(`[push] No provider configured — would have sent "${payload.title}" to ${token.slice(0, 12)}…`);
}

async function sendViaFcm(token: string, payload: PushPayload): Promise<void> {
  const serverKey = process.env.FCM_SERVER_KEY;
  const projectId = process.env.FCM_PROJECT_ID;
  if (!serverKey || !projectId) {
    console.info("[push] FCM not configured (FCM_SERVER_KEY / FCM_PROJECT_ID) — skipping send.");
    return;
  }
  await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
    method: "POST",
    headers: { Authorization: `Bearer ${serverKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ message: { token, notification: { title: payload.title, body: payload.body }, webpush: payload.link ? { fcm_options: { link: payload.link } } : undefined } }),
  });
}

async function sendViaOneSignal(playerId: string, payload: PushPayload): Promise<void> {
  const apiKey = process.env.ONESIGNAL_REST_API_KEY;
  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  if (!apiKey || !appId) {
    console.info("[push] OneSignal not configured (ONESIGNAL_REST_API_KEY / NEXT_PUBLIC_ONESIGNAL_APP_ID) — skipping send.");
    return;
  }
  await fetch("https://onesignal.com/api/v1/notifications", {
    method: "POST",
    headers: { Authorization: `Basic ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: appId, include_player_ids: [playerId], headings: { en: payload.title }, contents: { en: payload.body ?? "" }, url: payload.link }),
  });
}

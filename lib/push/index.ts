import { fcmPushProvider } from "./fcm-provider";
import { noopPushProvider } from "./noop-provider";
import { oneSignalPushProvider } from "./onesignal-provider";
import type { PushProvider } from "./types";

export type { PushProvider, PushProviderName, PushPayload } from "./types";

/**
 * Which provider is active is a single env var (NEXT_PUBLIC_PUSH_PROVIDER),
 * never hardcoded in calling code — set it to "fcm" or "onesignal" and
 * configure that provider's own env vars to go live. Falls back to a
 * no-op provider so the rest of the app works identically either way.
 */
export function getPushProvider(): PushProvider {
  const selected = process.env.NEXT_PUBLIC_PUSH_PROVIDER;
  if (selected === "fcm" && fcmPushProvider.isConfigured()) return fcmPushProvider;
  if (selected === "onesignal" && oneSignalPushProvider.isConfigured()) return oneSignalPushProvider;
  return noopPushProvider;
}

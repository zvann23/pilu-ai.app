export type PushProviderName = "fcm" | "onesignal" | "none";

export type PushPayload = { title: string; body?: string; link?: string };

/**
 * Provider-agnostic push abstraction (Phase 19: "prepare architecture for
 * FCM or OneSignal, do not hardcode one provider"). The app talks to this
 * interface only — swapping providers, or wiring a real one in, never
 * touches calling code.
 */
export interface PushProvider {
  readonly name: PushProviderName;
  isConfigured(): boolean;
  /** Requests permission and registers this device, returning a token/player id to persist, or null if declined/unavailable. */
  register(): Promise<string | null>;
  /** Removes this device's registration. */
  unregister(token: string): Promise<void>;
}

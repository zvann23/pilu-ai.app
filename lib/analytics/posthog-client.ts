"use client";

import posthog from "posthog-js";

/**
 * The only file that imports posthog-js directly. Everything else goes
 * through analytics-service.ts. Capture never happens before the user has
 * granted analytics consent (see analytics-consent-banner.tsx) — this is
 * enforced here, not left to callers to remember.
 */

export type ConsentState = "granted" | "denied";
const CONSENT_STORAGE_KEY = "pilu-analytics-consent";

export function getStoredConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

function storeConsent(state: ConsentState) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, state);
}

let initialized = false;

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    // Manual, reviewed events only — autocapture and session recording are
    // the two most common ways a baby-tracking app accidentally leaks PII
    // into analytics (typed form values, recorded screens), so both stay off.
    autocapture: false,
    capture_pageview: false,
    disable_session_recording: true,
    respect_dnt: true,
    persistence: "localStorage+cookie",
    loaded: (client) => {
      if (getStoredConsent() !== "granted") client.opt_out_capturing();
    },
  });
  initialized = true;
}

export function grantConsent() {
  storeConsent("granted");
  ensureInitialized();
  if (initialized) posthog.opt_in_capturing();
}

export function denyConsent() {
  storeConsent("denied");
  if (initialized) posthog.opt_out_capturing();
}

/** Call once, as early as possible (e.g. from a root provider) — no-ops until consent is granted or NEXT_PUBLIC_POSTHOG_KEY is unset. */
export function initAnalyticsIfConsented() {
  if (getStoredConsent() === "granted") ensureInitialized();
}

export function capture(event: string, properties?: Record<string, unknown>) {
  if (!initialized || getStoredConsent() !== "granted") return;
  posthog.capture(event, properties);
}

/** Only ever pass the Supabase auth user id — never email, name, or phone. */
export function identifyUser(userId: string) {
  if (!initialized || getStoredConsent() !== "granted") return;
  posthog.identify(userId);
}

export function resetIdentity() {
  if (!initialized) return;
  posthog.reset();
}

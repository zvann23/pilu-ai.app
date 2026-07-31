"use client";

import type { PostHog } from "posthog-js";

/**
 * The only file that imports posthog-js — and even here, only dynamically,
 * loaded on demand once consent is actually granted. Nothing else in the
 * app should ever need the ~100KB+ SDK for a visitor who never opts in, so
 * it's kept out of the initial bundle entirely rather than statically
 * imported and merely left uninitialized.
 *
 * Everything else goes through analytics-service.ts. Capture never happens
 * before the user has granted analytics consent (see
 * analytics-consent-banner.tsx) — that's enforced here, not left to callers
 * to remember.
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

let posthogInstance: PostHog | null = null;
let loadPromise: Promise<PostHog | null> | null = null;

function loadPosthog(): Promise<PostHog | null> {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    if (typeof window === "undefined") return null;
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return null;

    const { default: posthog } = await import("posthog-js");
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
    posthogInstance = posthog;
    return posthog;
  })();
  return loadPromise;
}

export function grantConsent() {
  storeConsent("granted");
  loadPosthog().then((client) => client?.opt_in_capturing());
}

export function denyConsent() {
  storeConsent("denied");
  posthogInstance?.opt_out_capturing();
}

/** Call once, as early as possible (e.g. from a root provider) — no-ops until consent is granted or NEXT_PUBLIC_POSTHOG_KEY is unset. */
export function initAnalyticsIfConsented() {
  if (getStoredConsent() === "granted") loadPosthog();
}

export function capture(event: string, properties?: Record<string, unknown>) {
  if (getStoredConsent() !== "granted") return;
  posthogInstance?.capture(event, properties);
}

/** Only ever pass the Supabase auth user id — never email, name, or phone. */
export function identifyUser(userId: string) {
  if (getStoredConsent() !== "granted") return;
  posthogInstance?.identify(userId);
}

export function resetIdentity() {
  posthogInstance?.reset();
}

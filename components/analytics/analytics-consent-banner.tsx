"use client";

import { trackFirstLaunch } from "@/lib/analytics/analytics-service";
import { denyConsent, getStoredConsent, grantConsent } from "@/lib/analytics/posthog-client";
import { updateAnalyticsConsent } from "@/lib/supabase/profile-repository";
import { useSyncExternalStore } from "react";

const FIRST_LAUNCH_KEY = "pilu-first-launch-tracked";
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// Consent isn't decided yet (banner should show) until localStorage says otherwise — never during SSR, since it isn't reachable there.
function getSnapshot() {
  return getStoredConsent() === null;
}

function getServerSnapshot() {
  return false;
}

function notifyConsentChanged() {
  listeners.forEach((callback) => callback());
}

/** GDPR consent gate — nothing is captured (not even a screen view) until the parent explicitly accepts. */
export function AnalyticsConsentBanner({ userId }: { userId: string | null }) {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function syncConsent(consent: boolean) {
    if (userId) updateAnalyticsConsent(userId, consent).catch(() => undefined);
  }

  function accept() {
    grantConsent();
    syncConsent(true);
    // "First launch" is this device's first tracked session — nothing sends before consent, so it's tied to first Accept, not first page load.
    if (window.localStorage.getItem(FIRST_LAUNCH_KEY) === null) {
      window.localStorage.setItem(FIRST_LAUNCH_KEY, "1");
      trackFirstLaunch();
    }
    notifyConsentChanged();
  }

  function decline() {
    denyConsent();
    syncConsent(false);
    notifyConsentChanged();
  }

  if (!visible) return null;

  return (
    <div className="analytics-consent-banner" role="dialog" aria-label="Analytics preferences">
      <p>Pilu uses privacy-friendly analytics to understand how the app is used and improve it. We never send your baby&apos;s name, notes, or AI conversations — only anonymous usage events.</p>
      <div className="analytics-consent-banner__actions">
        <button type="button" className="button button--secondary" onClick={decline}>Decline</button>
        <button type="button" className="button button--primary" onClick={accept}>Accept</button>
      </div>
    </div>
  );
}

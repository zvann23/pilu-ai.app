import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";

/**
 * Server-side capture for events with no browser present (subscription
 * lifecycle changes detected via the Play RTDN webhook). Plain fetch
 * against PostHog's capture endpoint — no posthog-node dependency needed
 * for a handful of events. Respects the same consent decision as the
 * client (profiles.analytics_consent, synced by analytics-consent-banner.tsx)
 * since a server route has no access to browser localStorage.
 */

async function hasConsented(userId: string): Promise<boolean> {
  const admin = getSupabaseAdminClient();
  if (!admin) return false;
  const { data } = await admin.from("profiles").select("analytics_consent").eq("id", userId).maybeSingle();
  return data?.analytics_consent === true;
}

export async function captureServerEvent(userId: string, event: string, properties?: Record<string, unknown>): Promise<void> {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!apiKey) return;

  try {
    if (!(await hasConsented(userId))) return;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
    await fetch(`${host}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, event, distinct_id: userId, properties, timestamp: new Date().toISOString() }),
    });
  } catch {
    // Analytics must never break a real purchase or webhook flow.
  }
}

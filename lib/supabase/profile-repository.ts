import { supabase } from "@/lib/supabase/client";

export type Profile = { id: string; displayName: string | null; avatarUrl: string | null };

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("id, display_name, avatar_url").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data ? { id: data.id, displayName: data.display_name, avatarUrl: data.avatar_url } : null;
}

export async function updateDisplayName(userId: string, displayName: string): Promise<void> {
  const { error } = await supabase.from("profiles").update({ display_name: displayName, updated_at: new Date().toISOString() }).eq("id", userId);
  if (error) throw error;
}

/** Mirrors the client-side consent decision (see lib/analytics/posthog-client.ts) so server-side events — subscription lifecycle updates detected via the RTDN webhook, with no browser present — can also respect it. */
export async function updateAnalyticsConsent(userId: string, consent: boolean): Promise<void> {
  const { error } = await supabase.from("profiles").update({ analytics_consent: consent, updated_at: new Date().toISOString() }).eq("id", userId);
  if (error) throw error;
}

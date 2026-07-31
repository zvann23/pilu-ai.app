import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client for server-only code (cron routes) that needs to
 * read/write across every family, bypassing RLS. Never import this from a
 * client component — the service role key must never reach the browser.
 * Returns null when SUPABASE_SERVICE_ROLE_KEY isn't configured, so callers
 * can no-op gracefully rather than crash (same convention as
 * GEMINI_API_KEY / RESEND-style optional integrations elsewhere in Pilu).
 */
export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}

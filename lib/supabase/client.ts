import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseEnv } from "./env";

const { url, key } = requireSupabaseEnv();

// Cookie-based (not localStorage-only) so the session is visible to
// proxy.ts and server components too — required for real route
// gating, not just a client-side check after the page has already loaded.
export const supabase = createBrowserClient(url, key);

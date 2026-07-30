import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnvironment } from "@/lib/supabase/env";
import type { Database } from "@/types/database";
export function createBrowserSupabaseClient() { const { url, anonKey } = getSupabaseEnvironment(); return createBrowserClient<Database>(url, anonKey); }

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnvironment } from "@/lib/supabase/env";
import type { Database } from "@/types/database";
export async function createServerSupabaseClient() { const { url, anonKey } = getSupabaseEnvironment(); const cookieStore = await cookies(); return createServerClient<Database>(url, anonKey, { cookies: { getAll: () => cookieStore.getAll(), setAll: (cookiesToSet) => { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { /* Server Components cannot persist cookies; proxy.ts refreshes sessions when enabled. */ } } } }); }

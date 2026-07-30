import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasSupabaseEnvironment } from "@/lib/supabase/env";
export async function checkSupabaseConnection() { if (!hasSupabaseEnvironment()) return { configured: false as const, reachable: false as const }; const supabase = await createServerSupabaseClient(); const { error } = await supabase.from("profiles").select("id", { head: true, count: "exact" }).limit(1); return { configured: true as const, reachable: !error, errorCode: error?.code }; }

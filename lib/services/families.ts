import { createServerSupabaseClient } from "@/lib/supabase/server";
export async function createFamilyForCurrentUser(name: string) { const supabase = await createServerSupabaseClient(); const { data, error } = await supabase.rpc("create_family", { family_name: name.trim() }); if (error) throw error; return data; }

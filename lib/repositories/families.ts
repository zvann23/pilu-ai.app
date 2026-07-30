import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { FamilyRow } from "@/types/database";
export type Family = { id: string; name: string; ownerId: string; inviteCode: string };
export const toFamily = (row: FamilyRow): Family => ({ id: row.id, name: row.name, ownerId: row.owner_id, inviteCode: row.invite_code });
export async function listMyFamilies() { const supabase = await createServerSupabaseClient(); const { data, error } = await supabase.from("families").select().order("created_at", { ascending: true }); if (error) throw error; return data.map(toFamily); }

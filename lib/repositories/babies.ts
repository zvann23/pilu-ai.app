import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { BabyRow } from "@/types/database";
export type Baby = { id: string; familyId: string; firstName: string; lastName: string | null; nickname: string | null; dateOfBirth: string | null; dueDate: string | null; avatarUrl: string | null; isActive: boolean };
export const toBaby = (row: BabyRow): Baby => ({ id: row.id, familyId: row.family_id, firstName: row.first_name, lastName: row.last_name, nickname: row.nickname, dateOfBirth: row.date_of_birth, dueDate: row.due_date, avatarUrl: row.avatar_url, isActive: row.is_active });
export async function listFamilyBabies(familyId: string) { const supabase = await createServerSupabaseClient(); const { data, error } = await supabase.from("babies").select().eq("family_id", familyId).order("created_at", { ascending: true }); if (error) throw error; return data.map(toBaby); }

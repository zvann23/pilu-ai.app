import { supabase } from "@/lib/supabase/client";

export type Baby = {
  id: string;
  familyId: string;
  firstName: string;
  lastName: string | null;
  nickname: string | null;
  dateOfBirth: string | null;
  biologicalSex: "female" | "male" | "intersex" | "not_specified" | null;
};

type BabyRow = { id: string; family_id: string; first_name: string; last_name: string | null; nickname: string | null; date_of_birth: string | null; biological_sex: Baby["biologicalSex"] };

function rowToBaby(row: BabyRow): Baby {
  return { id: row.id, familyId: row.family_id, firstName: row.first_name, lastName: row.last_name, nickname: row.nickname, dateOfBirth: row.date_of_birth, biologicalSex: row.biological_sex };
}

export async function getFamilyBabies(familyId: string): Promise<Baby[]> {
  const { data, error } = await supabase
    .from("babies")
    .select("id, family_id, first_name, last_name, nickname, date_of_birth, biological_sex")
    .eq("family_id", familyId)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data as BabyRow[] ?? []).map(rowToBaby);
}

export async function createBaby(familyId: string, draft: { firstName: string; lastName?: string; nickname?: string; dateOfBirth?: string; biologicalSex?: Baby["biologicalSex"] }): Promise<Baby> {
  const { data, error } = await supabase
    .from("babies")
    .insert({
      family_id: familyId,
      first_name: draft.firstName,
      last_name: draft.lastName || null,
      nickname: draft.nickname || null,
      date_of_birth: draft.dateOfBirth || null,
      biological_sex: draft.biologicalSex || "not_specified",
    })
    .select("id, family_id, first_name, last_name, nickname, date_of_birth, biological_sex")
    .single();

  if (error) throw error;
  return rowToBaby(data as BabyRow);
}

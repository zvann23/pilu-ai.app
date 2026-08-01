import { supabase } from "@/lib/supabase/client";

export type Baby = {
  id: string;
  familyId: string;
  firstName: string;
  lastName: string | null;
  nickname: string | null;
  dateOfBirth: string | null;
  biologicalSex: "female" | "male" | "intersex" | "not_specified" | null;
  birthWeightGrams: number | null;
  birthLengthCm: number | null;
  motherName: string | null;
  fatherName: string | null;
  avatarUrl: string | null;
};

type BabyRow = {
  id: string;
  family_id: string;
  first_name: string;
  last_name: string | null;
  nickname: string | null;
  date_of_birth: string | null;
  biological_sex: Baby["biologicalSex"];
  birth_weight_grams: number | null;
  birth_length_cm: number | null;
  mother_name: string | null;
  father_name: string | null;
  avatar_url: string | null;
};

const babyColumns = "id, family_id, first_name, last_name, nickname, date_of_birth, biological_sex, birth_weight_grams, birth_length_cm, mother_name, father_name, avatar_url";

function rowToBaby(row: BabyRow): Baby {
  return {
    id: row.id,
    familyId: row.family_id,
    firstName: row.first_name,
    lastName: row.last_name,
    nickname: row.nickname,
    dateOfBirth: row.date_of_birth,
    biologicalSex: row.biological_sex,
    birthWeightGrams: row.birth_weight_grams,
    birthLengthCm: row.birth_length_cm,
    motherName: row.mother_name,
    fatherName: row.father_name,
    avatarUrl: row.avatar_url,
  };
}

export async function getFamilyBabies(familyId: string): Promise<Baby[]> {
  const { data, error } = await supabase
    .from("babies")
    .select(babyColumns)
    .eq("family_id", familyId)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data as BabyRow[] ?? []).map(rowToBaby);
}

export type BabyDraft = {
  firstName: string;
  lastName?: string;
  nickname?: string;
  dateOfBirth?: string;
  biologicalSex?: Baby["biologicalSex"];
  birthWeightGrams?: number;
  birthLengthCm?: number;
  motherName?: string;
  fatherName?: string;
};

export async function createBaby(familyId: string, draft: BabyDraft): Promise<Baby> {
  const { data, error } = await supabase
    .from("babies")
    .insert({
      family_id: familyId,
      first_name: draft.firstName,
      last_name: draft.lastName || null,
      nickname: draft.nickname || null,
      date_of_birth: draft.dateOfBirth || null,
      biological_sex: draft.biologicalSex || "not_specified",
      birth_weight_grams: draft.birthWeightGrams ?? null,
      birth_length_cm: draft.birthLengthCm ?? null,
      mother_name: draft.motherName || null,
      father_name: draft.fatherName || null,
    })
    .select(babyColumns)
    .single();

  if (error) throw error;
  return rowToBaby(data as BabyRow);
}

export async function updateBabyAvatarUrl(babyId: string, avatarUrl: string | null): Promise<void> {
  const { error } = await supabase.from("babies").update({ avatar_url: avatarUrl }).eq("id", babyId);
  if (error) throw error;
}

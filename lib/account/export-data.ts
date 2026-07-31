import { supabase } from "@/lib/supabase/client";

// Every table's own RLS already scopes rows to what this user can see
// (their profile, their family's babies, logs on those babies), so a
// plain unfiltered select is the correct export — no extra filtering
// needed here.
const BABY_LOG_TABLES = [
  "feeding_logs", "sleep_logs", "diaper_logs", "growth_logs", "milestones",
  "vaccines", "medicine_logs", "medicine_plans", "timeline_events",
  "memories", "journal_entries",
] as const;

const SLEEP_SOUND_TABLES = ["sleep_sound_preferences", "sleep_sound_favorites", "sleep_sound_recently_played"] as const;

export async function buildAccountExport(userId: string) {
  const [profileResult, familyMembershipResult, babiesResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("family_members").select("*, families(*)").eq("user_id", userId),
    supabase.from("babies").select("*"),
  ]);

  const logResults = await Promise.all(BABY_LOG_TABLES.map((table) => supabase.from(table).select("*")));
  const sleepSoundResults = await Promise.all(SLEEP_SOUND_TABLES.map((table) => supabase.from(table).select("*").eq("user_id", userId)));

  const allResults = [profileResult, familyMembershipResult, babiesResult, ...logResults, ...sleepSoundResults];
  const firstError = allResults.find((result) => result.error)?.error;
  if (firstError) throw firstError;

  const logs = Object.fromEntries(BABY_LOG_TABLES.map((table, index) => [table, logResults[index].data ?? []]));
  const sleepSounds = Object.fromEntries(SLEEP_SOUND_TABLES.map((table, index) => [table, sleepSoundResults[index].data ?? []]));

  return {
    exportedAt: new Date().toISOString(),
    profile: profileResult.data,
    familyMembership: familyMembershipResult.data ?? [],
    babies: babiesResult.data ?? [],
    logs,
    sleepSounds,
  };
}

export function downloadAccountExport(data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pilu-data-export-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

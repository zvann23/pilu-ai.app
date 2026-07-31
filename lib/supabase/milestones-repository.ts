import { supabase } from "@/lib/supabase/client";
import { fetchWithCacheFallback } from "@/lib/offline/queued-write";
import { cacheList, getCachedList } from "@/lib/offline/list-cache";
import { initialMilestones } from "@/lib/development-data";
import type { Milestone, MilestoneCategory, MilestoneStatus } from "@/types/development";

type MilestoneRow = { id: string; title: string; category: MilestoneCategory; achieved_at: string | null; notes: string | null; description: string; status: MilestoneStatus; typical_age: string | null };

const columns = "id, title, category, achieved_at, notes, description, status, typical_age";

function rowToMilestone(row: MilestoneRow): Milestone {
  return {
    id: row.id, title: row.title, description: row.description, category: row.category, status: row.status,
    typicalAge: row.typical_age ?? undefined, achievedDate: row.achieved_at?.slice(0, 10), note: row.notes ?? undefined,
  };
}

/**
 * Milestones is a fixed catalog (the ~22 well-known developmental
 * moments), not free-form user entries — every baby starts with the same
 * set and only its status/achieved date/note change. Seed once per baby
 * the first time this loads and the table is empty for them.
 */
export async function ensureMilestonesSeeded(babyId: string, createdBy: string): Promise<void> {
  const { count, error } = await supabase.from("milestones").select("id", { count: "exact", head: true }).eq("baby_id", babyId);
  if (error || (count ?? 0) > 0) return;

  // The mock catalog's achieved/inProgress statuses are fake demo progress
  // for a fake demo baby — a real seed starts fresh. "notApplicable" is
  // kept as-is since it means "not relevant yet" (e.g. solid foods before
  // weaning starts), not progress.
  const rows = initialMilestones.map((milestone) => ({
    id: crypto.randomUUID(), baby_id: babyId, created_by: createdBy, title: milestone.title, description: milestone.description,
    category: milestone.category, status: milestone.status === "notApplicable" ? "notApplicable" : "upcoming", typical_age: milestone.typicalAge ?? null,
  }));
  await supabase.from("milestones").insert(rows).then(() => undefined, () => undefined);
}

export async function listMilestones(babyId: string): Promise<Milestone[]> {
  const rows = await fetchWithCacheFallback<MilestoneRow>(
    "milestones", babyId,
    async () => {
      const { data, error } = await supabase.from("milestones").select(columns).eq("baby_id", babyId).order("category", { ascending: true });
      if (error) throw error;
      return (data ?? []) as MilestoneRow[];
    },
    getCachedList, cacheList,
  );
  return rows.map(rowToMilestone);
}

export function milestoneUpdateToRow(update: { status: MilestoneStatus; achievedDate?: string; note?: string }): Record<string, unknown> {
  return { status: update.status, achieved_at: update.achievedDate ?? null, notes: update.note ?? null };
}

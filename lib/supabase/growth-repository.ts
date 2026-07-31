import { supabase } from "@/lib/supabase/client";
import { fetchWithCacheFallback } from "@/lib/offline/queued-write";
import { cacheList, getCachedList } from "@/lib/offline/list-cache";
import type { GrowthMeasurement } from "@/types/development";

type GrowthRow = { id: string; measured_at: string; weight_grams: number | null; height_cm: number | null; head_circumference_cm: number | null; notes: string | null };

const columns = "id, measured_at, weight_grams, height_cm, head_circumference_cm, notes";

function rowToMeasurement(row: GrowthRow): GrowthMeasurement {
  const measured = new Date(row.measured_at);
  return {
    id: row.id, date: row.measured_at.slice(0, 10), time: measured.toISOString().slice(11, 16),
    weightKg: row.weight_grams != null ? row.weight_grams / 1000 : 0,
    lengthCm: row.height_cm ?? 0,
    headCircumferenceCm: row.head_circumference_cm ?? 0,
    note: row.notes ?? undefined,
  };
}

export async function listGrowthMeasurements(babyId: string): Promise<GrowthMeasurement[]> {
  const rows = await fetchWithCacheFallback<GrowthRow>(
    "growth_logs", babyId,
    async () => {
      const { data, error } = await supabase.from("growth_logs").select(columns).eq("baby_id", babyId).order("measured_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as GrowthRow[];
    },
    getCachedList, cacheList,
  );
  return rows.map(rowToMeasurement);
}

export function measurementToRow(id: string, babyId: string, createdBy: string, draft: Omit<GrowthMeasurement, "id" | "timelineActivityId">): Record<string, unknown> {
  return {
    id, baby_id: babyId, created_by: createdBy, measured_at: `${draft.date}T${draft.time}:00`,
    weight_grams: Math.round(draft.weightKg * 1000), height_cm: draft.lengthCm, head_circumference_cm: draft.headCircumferenceCm,
    notes: draft.note ?? null,
  };
}

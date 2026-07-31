import { supabase } from "@/lib/supabase/client";
import { fetchWithCacheFallback } from "@/lib/offline/queued-write";
import { cacheList, getCachedList } from "@/lib/offline/list-cache";
import type { MedicineFrequency, MedicineLog, MedicineRecord, MedicineType } from "@/types/care";

type PlanRow = {
  id: string; medicine_name: string; medicine_type: MedicineType; dose_text: string; instructions: string | null;
  frequency: MedicineFrequency; times: string[]; start_date: string; end_date: string | null; doctor: string | null; notes: string | null; active: boolean;
};
type LogRow = { id: string; medicine_name: string; amount: number | null; unit: string | null; administered_at: string; notes: string | null };

const planColumns = "id, medicine_name, medicine_type, dose_text, instructions, frequency, times, start_date, end_date, doctor, notes, active";
const logColumns = "id, medicine_name, amount, unit, administered_at, notes";

function rowToPlan(row: PlanRow): MedicineRecord {
  return {
    id: row.id, name: row.medicine_name, type: row.medicine_type, doseText: row.dose_text, instructions: row.instructions ?? undefined,
    frequency: row.frequency, times: row.times, startDate: row.start_date, endDate: row.end_date ?? undefined,
    doctor: row.doctor ?? undefined, notes: row.notes ?? undefined, active: row.active,
  };
}

/** medicine_logs has no medicine_id column — quick-add's ad-hoc entries and plan-driven doses both just record a name/time, correlated back to a plan (if any) by matching name client-side for "today's schedule" derivation. */
function rowToLog(row: LogRow): MedicineLog {
  const administered = new Date(row.administered_at);
  return {
    id: row.id, medicineId: row.medicine_name, date: row.administered_at.slice(0, 10), time: administered.toISOString().slice(11, 16),
    status: "given", doseText: row.notes ?? "", note: row.notes ?? undefined,
  };
}

export async function listMedicinePlans(babyId: string): Promise<MedicineRecord[]> {
  const rows = await fetchWithCacheFallback<PlanRow>(
    "medicine_plans", babyId,
    async () => {
      const { data, error } = await supabase.from("medicine_plans").select(planColumns).eq("baby_id", babyId).order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as PlanRow[];
    },
    getCachedList, cacheList,
  );
  return rows.map(rowToPlan);
}

export async function listMedicineLogs(babyId: string): Promise<MedicineLog[]> {
  const rows = await fetchWithCacheFallback<LogRow>(
    "medicine_logs", babyId,
    async () => {
      const { data, error } = await supabase.from("medicine_logs").select(logColumns).eq("baby_id", babyId).order("administered_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as LogRow[];
    },
    getCachedList, cacheList,
  );
  return rows.map(rowToLog);
}

export function planToRow(id: string, babyId: string, createdBy: string, draft: Omit<MedicineRecord, "id">): Record<string, unknown> {
  return {
    id, baby_id: babyId, created_by: createdBy, medicine_name: draft.name, medicine_type: draft.type, dose_text: draft.doseText,
    instructions: draft.instructions ?? null, frequency: draft.frequency, times: draft.times, start_date: draft.startDate,
    end_date: draft.endDate ?? null, doctor: draft.doctor ?? null, notes: draft.notes ?? null, active: draft.active,
  };
}

/** Ad-hoc quick-add entry ("Medicine name" + free-text dose) and a plan-driven "mark given/skipped" both land here — dose/status text folded into notes since medicine_logs has no separate columns for either. */
export function logToRow(id: string, babyId: string, createdBy: string, params: { medicineName: string; time: string; doseText?: string; status: "given" | "skipped"; note?: string }, occurredAtDate: string): Record<string, unknown> {
  const administeredAt = `${occurredAtDate}T${params.time}:00`;
  const label = params.status === "skipped" ? "Skipped" : "Given";
  const notes = [params.doseText ? `Dose: ${params.doseText}` : null, `Status: ${label}`, params.note].filter(Boolean).join(" — ");
  return { id, baby_id: babyId, created_by: createdBy, medicine_name: params.medicineName, administered_at: administeredAt, notes };
}

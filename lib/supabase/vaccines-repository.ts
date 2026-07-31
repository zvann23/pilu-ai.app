import { supabase } from "@/lib/supabase/client";
import { fetchWithCacheFallback } from "@/lib/offline/queued-write";
import { cacheList, getCachedList } from "@/lib/offline/list-cache";
import type { ReminderPreference, VaccineRecord, VaccineStatus } from "@/types/care";

type VaccineRow = {
  id: string; vaccine_name: string; dose_label: string | null; scheduled_date: string | null; administered_date: string | null;
  status: string; healthcare_provider: string | null; notes: string | null; document_name: string | null; lot_number: string | null; reminder_preference: ReminderPreference;
};

const columns = "id, vaccine_name, dose_label, scheduled_date, administered_date, status, healthcare_provider, notes, document_name, lot_number, reminder_preference";

const dbStatusToLocal: Record<string, VaccineStatus> = { scheduled: "upcoming", completed: "completed", postponed: "postponed", skipped: "needsAttention" };
const localStatusToDb: Record<VaccineStatus, string> = { upcoming: "scheduled", completed: "completed", postponed: "postponed", needsAttention: "skipped" };

function rowToVaccine(row: VaccineRow): VaccineRecord {
  return {
    id: row.id, name: row.vaccine_name, dose: row.dose_label ?? undefined,
    plannedDate: row.scheduled_date ?? row.administered_date ?? "", completedDate: row.administered_date ?? undefined,
    clinic: row.healthcare_provider ?? undefined, lotNumber: row.lot_number ?? undefined, notes: row.notes ?? undefined,
    status: dbStatusToLocal[row.status] ?? "upcoming", reminder: row.reminder_preference, documentName: row.document_name ?? undefined,
  };
}

export async function listVaccines(babyId: string): Promise<VaccineRecord[]> {
  const rows = await fetchWithCacheFallback<VaccineRow>(
    "vaccines", babyId,
    async () => {
      const { data, error } = await supabase.from("vaccines").select(columns).eq("baby_id", babyId).order("scheduled_date", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as VaccineRow[];
    },
    getCachedList, cacheList,
  );
  return rows.map(rowToVaccine);
}

export function vaccineToRow(id: string, babyId: string, createdBy: string, draft: Omit<VaccineRecord, "id" | "timelineActivityId">): Record<string, unknown> {
  return {
    id, baby_id: babyId, created_by: createdBy, vaccine_name: draft.name, dose_label: draft.dose ?? null,
    scheduled_date: draft.status === "upcoming" ? draft.plannedDate || null : null,
    administered_date: draft.status === "completed" ? draft.completedDate || draft.plannedDate || null : null,
    status: localStatusToDb[draft.status], healthcare_provider: draft.clinic ?? null, notes: draft.notes ?? null,
    document_name: draft.documentName ?? null, lot_number: draft.lotNumber ?? null, reminder_preference: draft.reminder,
  };
}

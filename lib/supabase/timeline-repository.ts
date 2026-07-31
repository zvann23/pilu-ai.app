import { supabase } from "@/lib/supabase/client";
import { fetchWithCacheFallback } from "@/lib/offline/queued-write";
import { cacheList, getCachedList } from "@/lib/offline/list-cache";
import type { Activity, ActivityKind } from "@/types/activity";

type TimelineRow = {
  id: string;
  baby_id: string;
  event_kind: string;
  occurred_at: string;
  title: string;
  value: string;
  secondary: string | null;
  note: string | null;
};

const columns = "id, baby_id, event_kind, occurred_at, title, value, secondary, note";

/** "today"/"previous"/"next" is a display grouping the UI derives from occurred_at, not something we store. */
function dateKeyFor(occurredAt: string): Activity["dateKey"] {
  const today = new Date().toISOString().slice(0, 10);
  const day = occurredAt.slice(0, 10);
  if (day === today) return "today";
  return day < today ? "previous" : "next";
}

function rowToActivity(row: TimelineRow): Activity {
  const occurred = new Date(row.occurred_at);
  return {
    id: row.id,
    kind: row.event_kind as ActivityKind,
    time: occurred.toISOString().slice(11, 16),
    dateKey: dateKeyFor(row.occurred_at),
    title: row.title,
    value: row.value,
    note: row.note ?? undefined,
    secondary: row.secondary ?? undefined,
  };
}

export function activityToTimelineRow(id: string, babyId: string, createdBy: string, activity: { kind: ActivityKind; time: string; title: string; value: string; note?: string; secondary?: string }): Record<string, unknown> {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id, baby_id: babyId, created_by: createdBy, event_kind: activity.kind,
    occurred_at: `${today}T${activity.time}:00`,
    title: activity.title, value: activity.value, secondary: activity.secondary ?? null, note: activity.note ?? null,
  };
}

export async function listTimelineActivities(babyId: string): Promise<Activity[]> {
  const rows = await fetchWithCacheFallback<TimelineRow>(
    "timeline_events", babyId,
    async () => {
      const { data, error } = await supabase.from("timeline_events").select(columns).eq("baby_id", babyId).order("occurred_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as TimelineRow[];
    },
    getCachedList, cacheList,
  );
  return rows.map(rowToActivity);
}

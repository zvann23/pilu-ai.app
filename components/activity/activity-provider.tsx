"use client";

import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { useFamilyActivityLogger } from "@/hooks/use-family-activity-logger";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { trackDiaperLogged, trackFeedingAdded, trackGrowthEntryAdded, trackMedicineLogged, trackMemoryCreated, trackSleepLogged } from "@/lib/analytics/analytics-service";
import { diaperActivityToRow } from "@/lib/supabase/diaper-repository";
import { feedingActivityToRow } from "@/lib/supabase/feeding-repository";
import { logToRow } from "@/lib/supabase/medicine-repository";
import { sleepActivityToRow } from "@/lib/supabase/sleep-repository";
import { activityToTimelineRow, listTimelineActivities } from "@/lib/supabase/timeline-repository";
import { initialActivities } from "@/lib/timeline-data";
import { queuedDelete, queuedInsert, queuedUpdate } from "@/lib/offline/queued-write";
import { isUuid } from "@/lib/uuid";
import type { Activity, ActivityDraft, ActivityKind } from "@/types/activity";
import type { ActivityEventKind } from "@/types/family";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ActivityContextValue = {
  activities: Activity[];
  isLoading: boolean;
  addActivity: (activity: ActivityDraft) => string;
  updateActivity: (id: string, activity: ActivityDraft) => void;
  removeActivity: (id: string) => void;
};

const ActivityContext = createContext<ActivityContextValue | null>(null);

type ActivityLike = { time: string; value: string; secondary?: string; note?: string };

/**
 * Maps the flattened Activity shape to a real Supabase table. Kinds with
 * no dedicated domain table — temperature, memory, and quick-add's
 * single-value "weight" (the Growth dashboard's own richer form, with a
 * full weight/length/head-circumference set, is the source of truth for
 * real measurements — see development-provider.tsx) — persist to
 * timeline_events only, exactly like they do today: made real, not
 * regressed.
 */
function buildDomainRow(id: string, babyId: string, createdBy: string, kind: ActivityKind, activity: ActivityLike, occurredAtDate: string): { table: string; row: Record<string, unknown> } | null {
  if (kind === "feeding" || kind === "bottle" || kind === "breastfeeding") {
    return { table: "feeding_logs", row: feedingActivityToRow(id, babyId, createdBy, { kind, ...activity }, occurredAtDate) };
  }
  if (kind === "sleep") return { table: "sleep_logs", row: sleepActivityToRow(id, babyId, createdBy, activity, occurredAtDate) };
  if (kind === "diaper") return { table: "diaper_logs", row: diaperActivityToRow(id, babyId, createdBy, activity, occurredAtDate) };
  if (kind === "medicine") return { table: "medicine_logs", row: logToRow(id, babyId, createdBy, { medicineName: activity.value, time: activity.time, doseText: activity.secondary, status: "given", note: activity.note }, occurredAtDate) };
  return null;
}

/** The UI only ever navigates a day at a time (see timeline-dashboard.tsx), so dateKey always means "relative to real today." */
function dateForKey(dateKey: Activity["dateKey"]): string {
  const offset = dateKey === "previous" ? -1 : dateKey === "next" ? 1 : 0;
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

/** Maps a logged activity to the shared family activity feed, when the family feature cares about that kind. `detail` carries the raw value (e.g. "110 ml", "1h 15min") so server-side summaries can parse real totals. */
function familyEventFor(activity: ActivityDraft): { kind: ActivityEventKind; title: string; detail?: string } | null {
  switch (activity.kind) {
    case "feeding": case "bottle": case "breastfeeding":
      return { kind: "feeding", title: "added a feeding", detail: activity.value };
    case "sleep":
      return { kind: "sleep", title: activity.secondary === "Nighttime sleep" ? "added a nighttime sleep" : "added a nap", detail: activity.value };
    case "diaper":
      return { kind: "diaper", title: "added a diaper change", detail: activity.value };
    case "weight":
      return { kind: "growth", title: "added a growth measurement", detail: activity.value };
    case "medicine":
      return { kind: "medicine", title: "logged medicine", detail: activity.value };
    case "memory":
      return { kind: "memory", title: "uploaded a new memory", detail: activity.value };
    default:
      return null;
  }
}

/** Every kind of activity, wherever it's logged from (Feeding/Sleep/Vaccines/Growth/Memory Book all funnel new entries through addActivity), reports through this single point rather than each feature calling analytics separately. */
function reportActivityAnalytics(activity: ActivityDraft) {
  switch (activity.kind) {
    case "feeding": case "bottle": case "breastfeeding":
      trackFeedingAdded(activity.kind);
      return;
    case "sleep":
      trackSleepLogged(activity.secondary);
      return;
    case "diaper":
      trackDiaperLogged();
      return;
    case "weight":
      trackGrowthEntryAdded();
      return;
    case "medicine":
      trackMedicineLogged();
      return;
    case "memory":
      trackMemoryCreated();
      return;
    default:
  }
}

/**
 * Backed by timeline_events (the unified activity feed) plus, for kinds
 * that have one, the matching domain table (feeding_logs/sleep_logs/
 * diaper_logs/medicine_logs) — both rows share the same client-generated
 * id so they can be updated/deleted together without a join. Every write
 * is optimistic (local state updates synchronously; the id is returned
 * synchronously, unchanged from the previous local-only behavior) with
 * the real persistence — including offline queueing — happening in the
 * background via lib/offline/queued-write.ts.
 */
export function ActivityProvider({ children }: { children: ReactNode }) {
  const { profile } = useBabyProfile();
  const { userId } = useSupabaseUser();
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [isLoading, setIsLoading] = useState(true);
  const logFamilyActivity = useFamilyActivityLogger();
  const babyId = profile.id;

  useEffect(() => {
    if (!isUuid(babyId)) return;
    let cancelled = false;
    listTimelineActivities(babyId)
      .then((rows) => { if (!cancelled) setActivities(rows); })
      .catch(() => undefined)
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [babyId]);

  const value = useMemo<ActivityContextValue>(() => ({
    activities,
    isLoading,
    addActivity: (activity) => {
      const id = crypto.randomUUID();
      setActivities((current) => [...current, { ...activity, id }]);

      const event = familyEventFor(activity);
      if (event) logFamilyActivity(event.kind, event.title, event.detail);
      reportActivityAnalytics(activity);

      if (isUuid(babyId) && userId) {
        const occurredAtDate = dateForKey(activity.dateKey);
        const domain = buildDomainRow(id, babyId, userId, activity.kind, activity, occurredAtDate);
        const timelineRow = activityToTimelineRow(id, babyId, userId, activity);
        if (domain) void queuedInsert(domain.table, domain.row, `${activity.title} — ${activity.value}`, { table: "timeline_events", row: timelineRow });
        else void queuedInsert("timeline_events", timelineRow, `${activity.title} — ${activity.value}`);
      }
      return id;
    },
    updateActivity: (id, activity) => {
      setActivities((current) => current.map((item) => item.id === id ? { ...activity, id } : item));
      if (isUuid(babyId) && userId) {
        const occurredAtDate = dateForKey(activity.dateKey);
        const domain = buildDomainRow(id, babyId, userId, activity.kind, activity, occurredAtDate);
        const timelineRow = activityToTimelineRow(id, babyId, userId, activity);
        if (domain) void queuedUpdate(domain.table, id, domain.row, `${activity.title} — ${activity.value}`, { table: "timeline_events", row: timelineRow, match: { id } });
        else void queuedUpdate("timeline_events", id, timelineRow, `${activity.title} — ${activity.value}`);
      }
    },
    removeActivity: (id) => {
      const existing = activities.find((item) => item.id === id);
      setActivities((current) => current.filter((item) => item.id !== id));
      if (isUuid(babyId) && userId && existing) {
        const occurredAtDate = dateForKey(existing.dateKey);
        const domain = buildDomainRow(id, babyId, userId, existing.kind, existing, occurredAtDate);
        if (domain) void queuedDelete(domain.table, id, `Delete ${existing.title}`, { table: "timeline_events", match: { id } });
        else void queuedDelete("timeline_events", id, `Delete ${existing.title}`);
      }
    },
  }), [activities, isLoading, logFamilyActivity, babyId, userId]);

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivities() {
  const context = useContext(ActivityContext);
  if (!context) throw new Error("useActivities must be used inside ActivityProvider");
  return context;
}

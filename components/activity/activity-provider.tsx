"use client";
/* eslint-disable react-hooks/set-state-in-effect -- state is hydrated from Supabase after the session resolves. */

import { usePiluData } from "@/components/data/pilu-data-provider";
import { initialActivities } from "@/lib/timeline-data";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Activity, ActivityDateKey, ActivityDraft, ActivityKind } from "@/types/activity";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ActivityContextValue = { activities: Activity[]; addActivity: (activity: ActivityDraft) => string; updateActivity: (id: string, activity: ActivityDraft) => void; removeActivity: (id: string) => void; };
const ActivityContext = createContext<ActivityContextValue | null>(null);
const eventKinds = new Set<ActivityKind>(["feeding", "breastfeeding", "bottle", "sleep", "diaper", "temperature", "medicine", "vaccine", "weight", "memory"]);

function activityDateKey(value: string): ActivityDateKey {
  const day = new Date(value); const today = new Date();
  const delta = Math.round((new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / 86_400_000);
  return delta < 0 ? "previous" : delta > 0 ? "next" : "today";
}
function occurredAt(activity: ActivityDraft) {
  const date = new Date(); date.setDate(date.getDate() + (activity.dateKey === "previous" ? -1 : activity.dateKey === "next" ? 1 : 0));
  const [hours, minutes] = activity.time.split(":").map(Number); date.setHours(hours || 0, minutes || 0, 0, 0); return date.toISOString();
}

export function ActivityProvider({ children }: { children: ReactNode }) {
  const { configured, activeBaby, userId } = usePiluData();
  const [activities, setActivities] = useState<Activity[]>(configured ? [] : initialActivities);

  useEffect(() => {
    if (!configured) { setActivities(initialActivities); return; }
    if (!activeBaby) { setActivities([]); return; }
    let cancelled = false;
    void (async () => {
      const { data, error } = await createBrowserSupabaseClient().from("timeline_events").select().eq("baby_id", activeBaby.id).order("occurred_at", { ascending: false });
      if (error || cancelled) return;
      setActivities(data.map((row) => ({ id: row.id, kind: eventKinds.has(row.event_kind as ActivityKind) ? row.event_kind as ActivityKind : "feeding", dateKey: activityDateKey(row.occurred_at), time: new Date(row.occurred_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }), title: row.title, value: row.value, secondary: row.secondary || undefined, note: row.note || undefined })));
    })();
    return () => { cancelled = true; };
  }, [configured, activeBaby]);

  const value = useMemo<ActivityContextValue>(() => ({
    activities,
    addActivity: (activity) => {
      const temporaryId = `activity-${Date.now()}`;
      setActivities((current) => [{ ...activity, id: temporaryId }, ...current]);
      if (configured && activeBaby && userId) void (async () => {
        const { data } = await createBrowserSupabaseClient().from("timeline_events").insert({ baby_id: activeBaby.id, created_by: userId, event_kind: activity.kind, occurred_at: occurredAt(activity), title: activity.title, value: activity.value, secondary: activity.secondary || null, note: activity.note || null }).select().single();
        if (data) setActivities((current) => current.map((item) => item.id === temporaryId ? { ...item, id: data.id } : item));
      })();
      return temporaryId;
    },
    updateActivity: (id, activity) => {
      setActivities((current) => current.map((item) => item.id === id ? { ...activity, id } : item));
      if (configured && activeBaby && userId && !id.startsWith("activity-")) void createBrowserSupabaseClient().from("timeline_events").update({ event_kind: activity.kind, occurred_at: occurredAt(activity), title: activity.title, value: activity.value, secondary: activity.secondary || null, note: activity.note || null }).eq("id", id);
    },
    removeActivity: (id) => {
      setActivities((current) => current.filter((item) => item.id !== id));
      if (configured && !id.startsWith("activity-")) void createBrowserSupabaseClient().from("timeline_events").delete().eq("id", id);
    },
  }), [activities, configured, activeBaby, userId]);
  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivities() { const context = useContext(ActivityContext); if (!context) throw new Error("useActivities must be used inside ActivityProvider"); return context; }

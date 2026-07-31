"use client";

import { useFamilyActivityLogger } from "@/hooks/use-family-activity-logger";
import { initialActivities } from "@/lib/timeline-data";
import type { Activity, ActivityDraft } from "@/types/activity";
import type { ActivityEventKind } from "@/types/family";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type ActivityContextValue = {
  activities: Activity[];
  addActivity: (activity: ActivityDraft) => string;
  updateActivity: (id: string, activity: ActivityDraft) => void;
  removeActivity: (id: string) => void;
};

const ActivityContext = createContext<ActivityContextValue | null>(null);

/** Maps a logged activity to the shared family activity feed, when the family feature cares about that kind. */
function familyEventFor(activity: ActivityDraft): { kind: ActivityEventKind; title: string } | null {
  switch (activity.kind) {
    case "feeding": case "bottle": case "breastfeeding":
      return { kind: "feeding", title: "added a feeding" };
    case "sleep":
      return { kind: "sleep", title: activity.secondary === "Nighttime sleep" ? "added a nighttime sleep" : "added a nap" };
    case "diaper":
      return { kind: "diaper", title: "added a diaper change" };
    case "weight":
      return { kind: "growth", title: "added a growth measurement" };
    case "medicine":
      return { kind: "medicine", title: "logged medicine" };
    case "memory":
      return { kind: "memory", title: "uploaded a new memory" };
    default:
      return null;
  }
}

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState(initialActivities);
  const logFamilyActivity = useFamilyActivityLogger();

  const value = useMemo<ActivityContextValue>(() => ({
    activities,
    addActivity: (activity) => {
      const id = `activity-${Date.now()}`;
      setActivities((current) => [...current, { ...activity, id }]);
      const event = familyEventFor(activity);
      if (event) logFamilyActivity(event.kind, event.title);
      return id;
    },
    updateActivity: (id, activity) => setActivities((current) => current.map((item) => item.id === id ? { ...activity, id } : item)),
    removeActivity: (id) => setActivities((current) => current.filter((item) => item.id !== id)),
  }), [activities, logFamilyActivity]);

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivities() {
  const context = useContext(ActivityContext);
  if (!context) throw new Error("useActivities must be used inside ActivityProvider");
  return context;
}

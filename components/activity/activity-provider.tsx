"use client";

import { initialActivities } from "@/lib/timeline-data";
import type { Activity, ActivityDraft } from "@/types/activity";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type ActivityContextValue = {
  activities: Activity[];
  addActivity: (activity: ActivityDraft) => void;
  updateActivity: (id: string, activity: ActivityDraft) => void;
  removeActivity: (id: string) => void;
};

const ActivityContext = createContext<ActivityContextValue | null>(null);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState(initialActivities);

  const value = useMemo<ActivityContextValue>(() => ({
    activities,
    addActivity: (activity) => setActivities((current) => [...current, { ...activity, id: `activity-${Date.now()}` }]),
    updateActivity: (id, activity) => setActivities((current) => current.map((item) => item.id === id ? { ...activity, id } : item)),
    removeActivity: (id) => setActivities((current) => current.filter((item) => item.id !== id)),
  }), [activities]);

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivities() {
  const context = useContext(ActivityContext);
  if (!context) throw new Error("useActivities must be used inside ActivityProvider");
  return context;
}

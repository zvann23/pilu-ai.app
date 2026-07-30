"use client";

import { useActivities } from "@/components/activity/activity-provider";
import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { initialGrowthMeasurements, initialMilestones, sortMeasurements } from "@/lib/development-data";
import type { GrowthMeasurement, Milestone, MilestoneUpdate } from "@/types/development";
import { createContext, useContext, useState, type ReactNode } from "react";

type DevelopmentContextValue = {
  measurements: GrowthMeasurement[];
  milestones: Milestone[];
  saveMeasurement: (measurement: Omit<GrowthMeasurement, "id" | "timelineActivityId">, id?: string) => void;
  removeMeasurement: (id: string) => void;
  updateMilestone: (id: string, update: MilestoneUpdate) => void;
};

const DevelopmentContext = createContext<DevelopmentContextValue | null>(null);

export function DevelopmentProvider({ children }: { children: ReactNode }) {
  const [measurements, setMeasurements] = useState(initialGrowthMeasurements);
  const [milestones, setMilestones] = useState(initialMilestones);
  const { addActivity, updateActivity, removeActivity } = useActivities();
  const { profile, saveProfile } = useBabyProfile();

  const saveMeasurement = (draft: Omit<GrowthMeasurement, "id" | "timelineActivityId">, id?: string) => {
    const current = id ? measurements.find((measurement) => measurement.id === id) : undefined;
    const activity = { kind: "weight" as const, dateKey: "today" as const, time: draft.time, title: "Growth measurement", value: `${draft.weightKg.toFixed(2)} kg · ${draft.lengthCm} cm · ${draft.headCircumferenceCm} cm`, note: draft.note };
    let timelineActivityId = current?.timelineActivityId;
    if (timelineActivityId) updateActivity(timelineActivityId, activity);
    else { timelineActivityId = addActivity(activity); }
    const next = { ...draft, id: id ?? `measurement-${Date.now()}`, timelineActivityId };
    setMeasurements((all) => sortMeasurements(id ? all.map((item) => item.id === id ? next : item) : [...all, next]));
    const latest = sortMeasurements(id ? measurements.map((item) => item.id === id ? next : item) : [...measurements, next]).at(-1) ?? next;
    saveProfile({ ...profile, currentGrowth: { weightKg: latest.weightKg.toFixed(2), lengthCm: String(latest.lengthCm), headCircumferenceCm: String(latest.headCircumferenceCm), updatedAt: latest.date === "2026-07-10" ? "Today" : latest.date } });
  };

  const removeMeasurement = (id: string) => {
    const target = measurements.find((measurement) => measurement.id === id);
    if (!target) return;
    if (target.timelineActivityId) removeActivity(target.timelineActivityId);
    const remaining = measurements.filter((measurement) => measurement.id !== id);
    setMeasurements(remaining);
    const latest = sortMeasurements(remaining).at(-1);
    if (latest) saveProfile({ ...profile, currentGrowth: { weightKg: latest.weightKg.toFixed(2), lengthCm: String(latest.lengthCm), headCircumferenceCm: String(latest.headCircumferenceCm), updatedAt: latest.date } });
  };

  const updateMilestone = (id: string, update: MilestoneUpdate) => {
    const current = milestones.find((milestone) => milestone.id === id);
    if (!current) return;
    let memoryActivityId = current.memoryActivityId;
    if (update.status === "achieved" && update.saveAsMemory && !memoryActivityId) {
      memoryActivityId = addActivity({ kind: "memory", dateKey: "today", time: "12:00", title: "Milestone memory", value: current.title, note: update.note || `Celebrating ${current.title}.` });
    }
    setMilestones((all) => all.map((milestone) => milestone.id === id ? { ...milestone, ...update, memoryActivityId, achievedDate: update.status === "achieved" ? update.achievedDate || milestone.achievedDate || "2026-07-10" : undefined } : milestone));
  };

  const value = { measurements, milestones, saveMeasurement, removeMeasurement, updateMilestone };
  return <DevelopmentContext.Provider value={value}>{children}</DevelopmentContext.Provider>;
}

export function useDevelopment() {
  const context = useContext(DevelopmentContext);
  if (!context) throw new Error("useDevelopment must be used inside DevelopmentProvider");
  return context;
}

"use client";

import { useActivities } from "@/components/activity/activity-provider";
import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { useFamilyActivityLogger } from "@/hooks/use-family-activity-logger";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { initialGrowthMeasurements, initialMilestones, sortMeasurements } from "@/lib/development-data";
import { measurementToRow, listGrowthMeasurements } from "@/lib/supabase/growth-repository";
import { ensureMilestonesSeeded, listMilestones, milestoneUpdateToRow } from "@/lib/supabase/milestones-repository";
import { activityToTimelineRow } from "@/lib/supabase/timeline-repository";
import { queuedDelete, queuedInsert, queuedUpdate } from "@/lib/offline/queued-write";
import { isUuid } from "@/lib/uuid";
import type { GrowthMeasurement, Milestone, MilestoneUpdate } from "@/types/development";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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
  const { userId } = useSupabaseUser();
  const logFamilyActivity = useFamilyActivityLogger();
  const babyId = profile.id;

  useEffect(() => {
    if (!isUuid(babyId) || !userId) return;
    let cancelled = false;
    ensureMilestonesSeeded(babyId, userId)
      .then(() => Promise.all([listGrowthMeasurements(babyId), listMilestones(babyId)]))
      .then(([growthRows, milestoneRows]) => {
        if (cancelled) return;
        setMeasurements(sortMeasurements(growthRows));
        setMilestones(milestoneRows);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [babyId, userId]);

  const saveMeasurement = (draft: Omit<GrowthMeasurement, "id" | "timelineActivityId">, id?: string) => {
    const current = id ? measurements.find((measurement) => measurement.id === id) : undefined;
    const activity = { kind: "weight" as const, dateKey: "today" as const, time: draft.time, title: "Growth measurement", value: `${draft.weightKg.toFixed(2)} kg · ${draft.lengthCm} cm · ${draft.headCircumferenceCm} cm`, note: draft.note };
    let timelineActivityId = current?.timelineActivityId;
    if (timelineActivityId) updateActivity(timelineActivityId, activity);
    else timelineActivityId = addActivity(activity);

    const measurementId = id ?? crypto.randomUUID();
    const next = { ...draft, id: measurementId, timelineActivityId };
    setMeasurements((all) => sortMeasurements(id ? all.map((item) => item.id === id ? next : item) : [...all, next]));

    const latest = sortMeasurements(id ? measurements.map((item) => item.id === id ? next : item) : [...measurements, next]).at(-1) ?? next;
    saveProfile({ ...profile, currentGrowth: { weightKg: latest.weightKg.toFixed(2), lengthCm: String(latest.lengthCm), headCircumferenceCm: String(latest.headCircumferenceCm), updatedAt: latest.date } });

    if (isUuid(babyId) && userId) {
      const row = measurementToRow(measurementId, babyId, userId, draft);
      const description = `Growth — ${draft.weightKg.toFixed(2)} kg`;
      if (id) void queuedUpdate("growth_logs", measurementId, row, description);
      else void queuedInsert("growth_logs", row, description);
    }
  };

  const removeMeasurement = (id: string) => {
    const target = measurements.find((measurement) => measurement.id === id);
    if (!target) return;
    if (target.timelineActivityId) removeActivity(target.timelineActivityId);
    const remaining = measurements.filter((measurement) => measurement.id !== id);
    setMeasurements(remaining);
    const latest = sortMeasurements(remaining).at(-1);
    if (latest) saveProfile({ ...profile, currentGrowth: { weightKg: latest.weightKg.toFixed(2), lengthCm: String(latest.lengthCm), headCircumferenceCm: String(latest.headCircumferenceCm), updatedAt: latest.date } });
    if (isUuid(babyId)) void queuedDelete("growth_logs", id, "Delete growth measurement");
  };

  const updateMilestone = (id: string, update: MilestoneUpdate) => {
    const current = milestones.find((milestone) => milestone.id === id);
    if (!current) return;
    let memoryActivityId = current.memoryActivityId;
    if (update.status === "achieved" && update.saveAsMemory && !memoryActivityId) {
      memoryActivityId = addActivity({ kind: "memory", dateKey: "today", time: "12:00", title: "Milestone memory", value: current.title, note: update.note || `Celebrating ${current.title}.` });
    }
    if (update.status === "achieved" && current.status !== "achieved") {
      logFamilyActivity("milestone", `marked "${current.title}" as achieved`);
    }
    const achievedDate = update.status === "achieved" ? update.achievedDate || current.achievedDate || new Date().toISOString().slice(0, 10) : undefined;
    setMilestones((all) => all.map((milestone) => milestone.id === id ? { ...milestone, ...update, memoryActivityId, achievedDate } : milestone));

    if (isUuid(babyId)) {
      void queuedUpdate("milestones", id, milestoneUpdateToRow({ status: update.status, achievedDate, note: update.note }), `Milestone — ${current.title}`);
    }
  };

  const value = { measurements, milestones, saveMeasurement, removeMeasurement, updateMilestone };
  return <DevelopmentContext.Provider value={value}>{children}</DevelopmentContext.Provider>;
}

export function useDevelopment() {
  const context = useContext(DevelopmentContext);
  if (!context) throw new Error("useDevelopment must be used inside DevelopmentProvider");
  return context;
}

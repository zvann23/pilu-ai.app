"use client";
/* eslint-disable react-hooks/set-state-in-effect -- feature data is hydrated from Supabase after the active baby resolves. */

import { useActivities } from "@/components/activity/activity-provider";
import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { usePiluData } from "@/components/data/pilu-data-provider";
import { initialGrowthMeasurements, initialMilestones, sortMeasurements } from "@/lib/development-data";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { GrowthMeasurement, Milestone, MilestoneUpdate } from "@/types/development";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type DevelopmentContextValue = { measurements: GrowthMeasurement[]; milestones: Milestone[]; saveMeasurement: (measurement: Omit<GrowthMeasurement, "id" | "timelineActivityId">, id?: string) => void; removeMeasurement: (id: string) => void; updateMilestone: (id: string, update: MilestoneUpdate) => void; };
const DevelopmentContext = createContext<DevelopmentContextValue | null>(null);
const iso = (date: string, time: string) => new Date(`${date}T${time || "12:00"}:00`).toISOString();

export function DevelopmentProvider({ children }: { children: ReactNode }) {
  const { configured, activeBaby, userId } = usePiluData();
  const [measurements, setMeasurements] = useState(configured ? [] : initialGrowthMeasurements);
  const [milestones, setMilestones] = useState(configured ? [] : initialMilestones);
  const { addActivity, updateActivity, removeActivity } = useActivities(); const { profile, saveProfile } = useBabyProfile();
  useEffect(() => {
    if (!configured) { setMeasurements(initialGrowthMeasurements); setMilestones(initialMilestones); return; }
    if (!activeBaby) { setMeasurements([]); setMilestones([]); return; }
    let cancelled = false;
    void (async () => { const supabase = createBrowserSupabaseClient(); const [{ data: growth }, { data: milestoneRows }] = await Promise.all([supabase.from("growth_logs").select().eq("baby_id", activeBaby.id).order("measured_at"), supabase.from("milestones").select().eq("baby_id", activeBaby.id).order("created_at")]); if (cancelled) return; setMeasurements(sortMeasurements((growth || []).map((row) => { const date = new Date(row.measured_at); return { id: row.id, date: date.toISOString().slice(0, 10), time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }), weightKg: Number(row.weight_grams || 0) / 1000, lengthCm: Number(row.height_cm || 0), headCircumferenceCm: Number(row.head_circumference_cm || 0), note: row.notes || undefined }; }))); setMilestones((milestoneRows || []).map((row) => ({ id: row.id, title: row.title, description: row.description, category: row.category as Milestone["category"], status: row.status as Milestone["status"], typicalAge: row.typical_age || undefined, achievedDate: row.achieved_at?.slice(0, 10), note: row.notes || undefined }))); })();
    return () => { cancelled = true; };
  }, [configured, activeBaby]);
  const saveMeasurement = (draft: Omit<GrowthMeasurement, "id" | "timelineActivityId">, id?: string) => { const current = id ? measurements.find((measurement) => measurement.id === id) : undefined; const activity = { kind: "weight" as const, dateKey: "today" as const, time: draft.time, title: "Growth measurement", value: `${draft.weightKg.toFixed(2)} kg · ${draft.lengthCm} cm · ${draft.headCircumferenceCm} cm`, note: draft.note }; const timelineActivityId = current?.timelineActivityId ? (updateActivity(current.timelineActivityId, activity), current.timelineActivityId) : addActivity(activity); const next = { ...draft, id: id ?? `measurement-${Date.now()}`, timelineActivityId }; setMeasurements((all) => sortMeasurements(id ? all.map((item) => item.id === id ? next : item) : [...all, next])); const latest = sortMeasurements([...measurements.filter((item) => item.id !== id), next]).at(-1) ?? next; saveProfile({ ...profile, currentGrowth: { weightKg: latest.weightKg.toFixed(2), lengthCm: String(latest.lengthCm), headCircumferenceCm: String(latest.headCircumferenceCm), updatedAt: latest.date } }); if (configured && activeBaby && userId) void (id ? createBrowserSupabaseClient().from("growth_logs").update({ measured_at: iso(draft.date, draft.time), weight_grams: draft.weightKg * 1000, height_cm: draft.lengthCm, head_circumference_cm: draft.headCircumferenceCm, notes: draft.note || null }).eq("id", id) : createBrowserSupabaseClient().from("growth_logs").insert({ baby_id: activeBaby.id, created_by: userId, measured_at: iso(draft.date, draft.time), weight_grams: draft.weightKg * 1000, height_cm: draft.lengthCm, head_circumference_cm: draft.headCircumferenceCm, notes: draft.note || null })); };
  const removeMeasurement = (id: string) => { const target = measurements.find((measurement) => measurement.id === id); if (!target) return; if (target.timelineActivityId) removeActivity(target.timelineActivityId); setMeasurements((all) => all.filter((measurement) => measurement.id !== id)); if (configured && !id.startsWith("measurement-")) void createBrowserSupabaseClient().from("growth_logs").delete().eq("id", id); };
  const updateMilestone = (id: string, update: MilestoneUpdate) => { const current = milestones.find((milestone) => milestone.id === id); if (!current) return; let memoryActivityId = current.memoryActivityId; if (update.status === "achieved" && update.saveAsMemory && !memoryActivityId) memoryActivityId = addActivity({ kind: "memory", dateKey: "today", time: "12:00", title: "Milestone memory", value: current.title, note: update.note || `Celebrating ${current.title}.` }); const next = { ...current, ...update, memoryActivityId, achievedDate: update.status === "achieved" ? update.achievedDate || current.achievedDate || new Date().toISOString().slice(0, 10) : undefined }; setMilestones((all) => all.map((milestone) => milestone.id === id ? next : milestone)); if (configured && !id.startsWith("milestone-")) void createBrowserSupabaseClient().from("milestones").update({ status: next.status, achieved_at: next.achievedDate ? `${next.achievedDate}T12:00:00Z` : null, notes: next.note || null }).eq("id", id); };
  return <DevelopmentContext.Provider value={{ measurements, milestones, saveMeasurement, removeMeasurement, updateMilestone }}>{children}</DevelopmentContext.Provider>;
}
export function useDevelopment() { const context = useContext(DevelopmentContext); if (!context) throw new Error("useDevelopment must be used inside DevelopmentProvider"); return context; }

"use client";

import { useActivities } from "@/components/activity/activity-provider";
import { initialAppointments, initialLogs, initialMedicines, initialSchedule, initialTemperatures, initialVaccines, sortAppointments } from "@/lib/care-data";
import type { MedicineLog, MedicineLogStatus, MedicineRecord, MedicineScheduleEntry, TemperatureReading, VaccineRecord } from "@/types/care";
import type { ActivityDraft } from "@/types/activity";
import { createContext, useContext, useState, type ReactNode } from "react";

type CareContextValue = {
  vaccines: VaccineRecord[]; appointments: typeof initialAppointments; medicines: MedicineRecord[]; schedule: MedicineScheduleEntry[]; logs: MedicineLog[]; temperatures: TemperatureReading[];
  saveVaccine: (record: Omit<VaccineRecord, "id" | "timelineActivityId">, id?: string) => void; removeVaccine: (id: string) => void; markAppointmentCompleted: (appointmentId: string) => void;
  saveMedicine: (record: Omit<MedicineRecord, "id">, id?: string) => void; removeMedicine: (id: string) => void; setScheduleStatus: (id: string, status: Exclude<MedicineLogStatus, "upcoming">, note?: string) => void; updateMedicineLogNote: (id: string, note?: string) => void; removeMedicineLog: (id: string) => void; recordTemperature: (activity: ActivityDraft) => void;
};
const CareContext = createContext<CareContextValue | null>(null);

export function CareProvider({ children }: { children: ReactNode }) {
  const [vaccines, setVaccines] = useState(initialVaccines); const [appointments] = useState(initialAppointments); const [medicines, setMedicines] = useState(initialMedicines); const [schedule, setSchedule] = useState(initialSchedule); const [logs, setLogs] = useState(initialLogs); const [temperatures, setTemperatures] = useState(initialTemperatures);
  const { addActivity, updateActivity, removeActivity } = useActivities();
  function saveVaccine(draft: Omit<VaccineRecord, "id" | "timelineActivityId">, id?: string) {
    const previous = id ? vaccines.find((record) => record.id === id) : undefined; let timelineActivityId = previous?.timelineActivityId;
    if (draft.status === "completed") { const activity = { kind: "vaccine" as const, dateKey: "today" as const, time: "12:00", title: "Vaccine completed", value: `${draft.name}${draft.dose ? ` — ${draft.dose}` : ""}`, note: draft.notes }; timelineActivityId ? updateActivity(timelineActivityId, activity) : timelineActivityId = addActivity(activity); }
    else if (timelineActivityId) { removeActivity(timelineActivityId); timelineActivityId = undefined; }
    const next = { ...draft, id: id ?? `vaccine-${Date.now()}`, timelineActivityId };
    setVaccines((all) => id ? all.map((record) => record.id === id ? next : record) : [...all, next]);
  }
  function removeVaccine(id: string) { const target = vaccines.find((record) => record.id === id); if (target?.timelineActivityId) removeActivity(target.timelineActivityId); setVaccines((all) => all.filter((record) => record.id !== id)); }
  function markAppointmentCompleted(appointmentId: string) { const appointment = appointments.find((item) => item.id === appointmentId); if (!appointment) return; const record = vaccines.find((item) => item.id === appointment.vaccineId); if (record) saveVaccine({ ...record, status: "completed", completedDate: appointment.date }, record.id); }
  function saveMedicine(draft: Omit<MedicineRecord, "id">, id?: string) {
    const next = { ...draft, id: id ?? `medicine-${Date.now()}` }; setMedicines((all) => id ? all.map((record) => record.id === id ? next : record) : [...all, next]);
    if (!id && draft.active) setSchedule((all) => [...all, ...draft.times.filter(Boolean).map((time, index) => ({ id: `schedule-${Date.now()}-${index}`, medicineId: next.id, time, status: "upcoming" as const }))]);
    if (id && !draft.active) setSchedule((all) => all.filter((entry) => entry.medicineId !== id));
  }
  function removeMedicine(id: string) { setMedicines((all) => all.filter((record) => record.id !== id)); setSchedule((all) => all.filter((entry) => entry.medicineId !== id)); }
  function setScheduleStatus(id: string, status: Exclude<MedicineLogStatus, "upcoming">, note?: string) { const entry = schedule.find((item) => item.id === id); if (!entry) return; const medicine = medicines.find((item) => item.id === entry.medicineId); if (!medicine) return; const activityId = addActivity({ kind: "medicine", dateKey: "today", time: entry.time, title: medicine.name, value: medicine.name, secondary: `${medicine.doseText} · ${status === "given" ? "Given" : "Skipped"}`, note }); setSchedule((all) => all.map((item) => item.id === id ? { ...item, status, note, timelineActivityId: activityId } : item)); setLogs((all) => [{ id: `medicine-log-${Date.now()}`, medicineId: medicine.id, date: "2026-07-10", time: entry.time, status, doseText: medicine.doseText, note, timelineActivityId: activityId }, ...all]); }
  function updateMedicineLogNote(id: string, note?: string) { setLogs((all) => all.map((log) => log.id === id ? { ...log, note } : log)); }
  function removeMedicineLog(id: string) { const target = logs.find((log) => log.id === id); if (target?.timelineActivityId) removeActivity(target.timelineActivityId); setLogs((all) => all.filter((log) => log.id !== id)); }
  function recordTemperature(activity: ActivityDraft) { const timelineActivityId = addActivity(activity); setTemperatures((all) => [{ id: `temperature-${Date.now()}`, time: activity.time, value: activity.value.replace(/[^0-9.]/g, ""), method: activity.secondary, note: activity.note, timelineActivityId }, ...all]); }
  return <CareContext.Provider value={{ vaccines, appointments: sortAppointments(appointments), medicines, schedule, logs, temperatures, saveVaccine, removeVaccine, markAppointmentCompleted, saveMedicine, removeMedicine, setScheduleStatus, updateMedicineLogNote, removeMedicineLog, recordTemperature }}>{children}</CareContext.Provider>;
}
export function useCare() { const context = useContext(CareContext); if (!context) throw new Error("useCare must be used inside CareProvider"); return context; }

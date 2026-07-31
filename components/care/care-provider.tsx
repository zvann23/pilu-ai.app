"use client";

import { useActivities } from "@/components/activity/activity-provider";
import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { initialAppointments, initialLogs, initialMedicines, initialSchedule, initialTemperatures, initialVaccines, sortAppointments } from "@/lib/care-data";
import { listMedicineLogs, listMedicinePlans, logToRow, planToRow } from "@/lib/supabase/medicine-repository";
import { listVaccines, vaccineToRow } from "@/lib/supabase/vaccines-repository";
import { queuedDelete, queuedInsert, queuedUpdate } from "@/lib/offline/queued-write";
import { isUuid } from "@/lib/uuid";
import type { MedicineLog, MedicineLogStatus, MedicineRecord, MedicineScheduleEntry, TemperatureReading, VaccineRecord } from "@/types/care";
import type { ActivityDraft } from "@/types/activity";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Appointment = (typeof initialAppointments)[number];

type CareContextValue = {
  vaccines: VaccineRecord[]; appointments: Appointment[]; medicines: MedicineRecord[]; schedule: MedicineScheduleEntry[]; logs: MedicineLog[]; temperatures: TemperatureReading[];
  saveVaccine: (record: Omit<VaccineRecord, "id" | "timelineActivityId">, id?: string) => void; removeVaccine: (id: string) => void; markAppointmentCompleted: (appointmentId: string) => void;
  saveMedicine: (record: Omit<MedicineRecord, "id">, id?: string) => void; removeMedicine: (id: string) => void; setScheduleStatus: (id: string, status: Exclude<MedicineLogStatus, "upcoming">, note?: string) => void; updateMedicineLogNote: (id: string, note?: string) => void; removeMedicineLog: (id: string) => void; recordTemperature: (activity: ActivityDraft) => void;
};
const CareContext = createContext<CareContextValue | null>(null);

/** Appointments aren't their own table — an "appointment" is just an upcoming (status: scheduled) vaccine viewed as a reminder, same shape the mock data always used. */
function appointmentsFromVaccines(vaccines: VaccineRecord[]): Appointment[] {
  return vaccines
    .filter((vaccine) => vaccine.status === "upcoming" && vaccine.plannedDate)
    .map((vaccine) => ({ id: `appointment-${vaccine.id}`, vaccineId: vaccine.id, date: vaccine.plannedDate, title: vaccine.dose ? `${vaccine.name} — ${vaccine.dose}` : vaccine.name, clinic: vaccine.clinic, notes: vaccine.notes }));
}

/** A medicine plan's "times" are its daily schedule; "upcoming" for today means no matching log exists yet today for that plan+time. */
function scheduleFromPlans(medicines: MedicineRecord[], logs: MedicineLog[]): MedicineScheduleEntry[] {
  const today = new Date().toISOString().slice(0, 10);
  const todaysLogs = new Set(logs.filter((log) => log.date === today).map((log) => `${log.medicineId}|${log.time}`));
  return medicines
    .filter((medicine) => medicine.active)
    .flatMap((medicine) => medicine.times.filter(Boolean).map((time) => ({ id: `schedule-${medicine.id}-${time}`, medicineId: medicine.id, time, status: "upcoming" as const })))
    .filter((entry) => !todaysLogs.has(`${entry.medicineId}|${entry.time}`));
}

export function CareProvider({ children }: { children: ReactNode }) {
  const [vaccines, setVaccines] = useState(initialVaccines);
  const [medicines, setMedicines] = useState(initialMedicines);
  const [logs, setLogs] = useState(initialLogs);
  const [temperatures, setTemperatures] = useState(initialTemperatures);
  const { addActivity, removeActivity } = useActivities();
  const { profile } = useBabyProfile();
  const { userId } = useSupabaseUser();
  const babyId = profile.id;

  useEffect(() => {
    if (!isUuid(babyId)) return;
    let cancelled = false;
    Promise.all([listVaccines(babyId), listMedicinePlans(babyId), listMedicineLogs(babyId)])
      .then(([vaccineRows, planRows, logRows]) => {
        if (cancelled) return;
        setVaccines(vaccineRows);
        setMedicines(planRows);
        setLogs(logRows);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [babyId]);

  function saveVaccine(draft: Omit<VaccineRecord, "id" | "timelineActivityId">, id?: string) {
    const vaccineId = id ?? crypto.randomUUID();
    const next = { ...draft, id: vaccineId };
    setVaccines((all) => id ? all.map((record) => record.id === id ? next : record) : [...all, next]);
    if (isUuid(babyId) && userId) {
      const row = vaccineToRow(vaccineId, babyId, userId, draft);
      const description = `Vaccine — ${draft.name}`;
      if (id) void queuedUpdate("vaccines", vaccineId, row, description);
      else void queuedInsert("vaccines", row, description);
    }
  }
  function removeVaccine(id: string) {
    setVaccines((all) => all.filter((record) => record.id !== id));
    if (isUuid(babyId)) void queuedDelete("vaccines", id, "Delete vaccine record");
  }
  function markAppointmentCompleted(appointmentId: string) {
    const appointment = appointmentsFromVaccines(vaccines).find((item) => item.id === appointmentId);
    if (!appointment) return;
    const record = vaccines.find((item) => item.id === appointment.vaccineId);
    if (record) saveVaccine({ ...record, status: "completed", completedDate: appointment.date }, record.id);
  }

  function saveMedicine(draft: Omit<MedicineRecord, "id">, id?: string) {
    const medicineId = id ?? crypto.randomUUID();
    const next = { ...draft, id: medicineId };
    setMedicines((all) => id ? all.map((record) => record.id === id ? next : record) : [...all, next]);
    if (isUuid(babyId) && userId) {
      const row = planToRow(medicineId, babyId, userId, draft);
      const description = `Medicine plan — ${draft.name}`;
      if (id) void queuedUpdate("medicine_plans", medicineId, row, description);
      else void queuedInsert("medicine_plans", row, description);
    }
  }
  function removeMedicine(id: string) {
    setMedicines((all) => all.filter((record) => record.id !== id));
    if (isUuid(babyId)) void queuedDelete("medicine_plans", id, "Delete medicine plan");
  }

  function setScheduleStatus(id: string, status: Exclude<MedicineLogStatus, "upcoming">, note?: string) {
    const entry = scheduleFromPlans(medicines, logs).find((item) => item.id === id);
    if (!entry) return;
    const medicine = medicines.find((item) => item.id === entry.medicineId);
    if (!medicine) return;
    const activityId = addActivity({ kind: "medicine", dateKey: "today", time: entry.time, title: medicine.name, value: medicine.name, secondary: `${medicine.doseText} · ${status === "given" ? "Given" : "Skipped"}`, note });
    const today = new Date().toISOString().slice(0, 10);
    const logId = crypto.randomUUID();
    setLogs((all) => [{ id: logId, medicineId: medicine.id, date: today, time: entry.time, status, doseText: medicine.doseText, note, timelineActivityId: activityId }, ...all]);
    if (isUuid(babyId) && userId) {
      const row = logToRow(logId, babyId, userId, { medicineName: medicine.name, time: entry.time, doseText: medicine.doseText, status, note }, today);
      void queuedInsert("medicine_logs", row, `${medicine.name} — ${status === "given" ? "Given" : "Skipped"}`);
    }
  }
  function updateMedicineLogNote(id: string, note?: string) {
    setLogs((all) => all.map((log) => log.id === id ? { ...log, note } : log));
    if (isUuid(babyId)) void queuedUpdate("medicine_logs", id, { notes: note ?? null }, "Update medicine note");
  }
  function removeMedicineLog(id: string) {
    const target = logs.find((log) => log.id === id);
    if (target?.timelineActivityId) removeActivity(target.timelineActivityId);
    setLogs((all) => all.filter((log) => log.id !== id));
    if (isUuid(babyId)) void queuedDelete("medicine_logs", id, "Delete medicine log");
  }

  // Temperature has no domain table — stays exactly as before: a local
  // reading list plus a real timeline_events entry via addActivity.
  function recordTemperature(activity: ActivityDraft) {
    const timelineActivityId = addActivity(activity);
    setTemperatures((all) => [{ id: `temperature-${Date.now()}`, time: activity.time, value: activity.value.replace(/[^0-9.]/g, ""), method: activity.secondary, note: activity.note, timelineActivityId }, ...all]);
  }

  const value = {
    vaccines, appointments: sortAppointments(appointmentsFromVaccines(vaccines)), medicines,
    schedule: scheduleFromPlans(medicines, logs), logs, temperatures,
    saveVaccine, removeVaccine, markAppointmentCompleted, saveMedicine, removeMedicine, setScheduleStatus, updateMedicineLogNote, removeMedicineLog, recordTemperature,
  };
  return <CareContext.Provider value={value}>{children}</CareContext.Provider>;
}
export function useCare() { const context = useContext(CareContext); if (!context) throw new Error("useCare must be used inside CareProvider"); return context; }

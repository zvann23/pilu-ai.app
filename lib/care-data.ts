import { intlLocaleTags, type Locale } from "@/lib/i18n/locales";
import type { MedicineLog, MedicineRecord, MedicineScheduleEntry, TemperatureReading, VaccineAppointment, VaccineRecord, VaccineStatus } from "@/types/care";

export const initialVaccines: VaccineRecord[] = [
  { id: "vaccine-one", name: "Routine infant vaccine", dose: "Dose 1", plannedDate: "2026-06-05", completedDate: "2026-06-05", clinic: "Sample family clinic", lotNumber: "DEMO-102", notes: "Sample record for local development.", status: "completed", reminder: "none", timelineActivityId: "vaccine-complete-one" },
  { id: "vaccine-two", name: "Routine infant vaccine", dose: "Dose 2", plannedDate: "2026-07-03", completedDate: "2026-07-03", clinic: "Sample family clinic", status: "completed", reminder: "none", timelineActivityId: "vaccine-complete-two" },
  { id: "vaccine-three", name: "Routine infant vaccine", dose: "Dose 3", plannedDate: "2026-08-15", clinic: "Sample family clinic", notes: "Sample appointment only.", status: "upcoming", reminder: "threeDays" },
  { id: "vaccine-consult", name: "Optional vaccine consultation", plannedDate: "2026-09-02", clinic: "Sample family clinic", status: "upcoming", reminder: "oneWeek" },
];

export const initialAppointments: VaccineAppointment[] = [
  { id: "appointment-august", vaccineId: "vaccine-three", date: "2026-08-15", title: "Routine infant vaccine — Dose 3", clinic: "Sample family clinic", notes: "Demo appointment. Confirm details with your clinic." },
];

export const initialMedicines: MedicineRecord[] = [
  { id: "vitamin-d", name: "Vitamin D", type: "vitamin", doseText: "1 dose", instructions: "Follow the directions from your healthcare professional or packaging.", frequency: "daily", times: ["18:00"], startDate: "2026-05-10", doctor: "Dr. Andrei Ionescu", active: true },
];
export const initialSchedule: MedicineScheduleEntry[] = [{ id: "schedule-vitamin-d", medicineId: "vitamin-d", time: "18:00", status: "upcoming" }];
export const initialLogs: MedicineLog[] = [{ id: "medicine-log-demo", medicineId: "vitamin-d", date: "2026-07-10", time: "15:00", status: "given", doseText: "1 dose", timelineActivityId: "medicine-1500" }];
export const initialTemperatures: TemperatureReading[] = [{ id: "temperature-demo", time: "16:20", value: "36.8", method: "Underarm", timelineActivityId: "temperature-1620" }];

export function filterVaccines(records: VaccineRecord[], filter: "all" | VaccineStatus) { return filter === "all" ? records : records.filter((record) => record.status === filter); }
export function sortAppointments(appointments: VaccineAppointment[]) { return [...appointments].sort((a, b) => a.date.localeCompare(b.date)); }
export function formatCareDate(date: string, locale: Locale = "en") { return new Intl.DateTimeFormat(intlLocaleTags[locale], { day: "numeric", month: "long" }).format(new Date(`${date}T12:00:00`)); }
export function vaccineStatusLabel(status: VaccineStatus, labels: Record<VaccineStatus, string>) { return labels[status]; }
export function medicineStatusLabel(status: "upcoming" | "given" | "skipped", labels: Record<"upcoming" | "given" | "skipped", string>) { return labels[status]; }

export type VaccineStatus = "upcoming" | "completed" | "postponed" | "needsAttention";
export type ReminderPreference = "none" | "oneDay" | "threeDays" | "oneWeek";
export type VaccineRecord = { id: string; name: string; dose?: string; plannedDate: string; completedDate?: string; clinic?: string; lotNumber?: string; notes?: string; status: VaccineStatus; reminder: ReminderPreference; documentName?: string; timelineActivityId?: string };
export type VaccineAppointment = { id: string; vaccineId: string; date: string; title: string; clinic?: string; notes?: string };

export type MedicineType = "medicine" | "vitamin" | "supplement" | "other";
export type MedicineFrequency = "once" | "daily" | "multipleDaily" | "certainDays" | "asInstructed" | "custom";
export type MedicineRecord = { id: string; name: string; type: MedicineType; doseText: string; instructions?: string; frequency: MedicineFrequency; times: string[]; startDate: string; endDate?: string; doctor?: string; notes?: string; active: boolean };
export type MedicineLogStatus = "upcoming" | "given" | "skipped";
export type MedicineScheduleEntry = { id: string; medicineId: string; time: string; status: MedicineLogStatus; note?: string; timelineActivityId?: string };
export type MedicineLog = { id: string; medicineId: string; date: string; time: string; status: Exclude<MedicineLogStatus, "upcoming">; doseText: string; note?: string; timelineActivityId?: string };
export type TemperatureReading = { id: string; time: string; value: string; method?: string; note?: string; timelineActivityId?: string };

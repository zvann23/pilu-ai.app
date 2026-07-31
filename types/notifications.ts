export const notificationCategories = [
  "feeding_reminder", "sleep_reminder", "medicine_reminder", "vaccine_reminder", "growth_reminder",
  "memory_of_day", "weekly_report_ready", "family_activity", "elite_updates",
  "daily_summary", "weekly_summary", "custom_reminder",
] as const;
export type NotificationCategory = (typeof notificationCategories)[number];

/** The 9 categories a user can individually toggle — the other 3 are system-generated and always on. */
export const preferenceCategories = [
  "feeding_reminder", "sleep_reminder", "medicine_reminder", "vaccine_reminder", "growth_reminder",
  "memory_of_day", "weekly_report_ready", "family_activity", "elite_updates",
] as const;
export type PreferenceCategory = (typeof preferenceCategories)[number];

export type NotificationStatus = "unread" | "read" | "archived";

export const reminderTypes = ["vaccine", "doctor_appointment", "medicine", "birthday", "family_event", "custom"] as const;
export type ReminderType = (typeof reminderTypes)[number];

export const recurrenceOptions = ["once", "daily", "weekly", "monthly"] as const;
export type Recurrence = (typeof recurrenceOptions)[number];

export const daysModes = ["all", "weekdays", "weekends"] as const;
export type DaysMode = (typeof daysModes)[number];

export type NotificationPreferences = {
  userId: string;
  feedingReminder: boolean;
  sleepReminder: boolean;
  medicineReminder: boolean;
  vaccineReminder: boolean;
  growthReminder: boolean;
  memoryOfDay: boolean;
  weeklyReportReady: boolean;
  familyActivity: boolean;
  eliteUpdates: boolean;
  pushEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  daysMode: DaysMode;
  timezone: string;
};

export type Reminder = {
  id: string;
  userId: string;
  familyId: string | null;
  title: string;
  reminderType: ReminderType;
  recurrence: Recurrence;
  dueAt: string;
  isPrivate: boolean;
  notes: string | null;
  completedAt: string | null;
  createdAt: string;
};

export type NotificationItem = {
  id: string;
  userId: string;
  familyId: string | null;
  category: NotificationCategory;
  title: string;
  body: string | null;
  status: NotificationStatus;
  link: string | null;
  reminderId: string | null;
  createdAt: string;
};

export type NotificationGroup = "babyCare" | "parents";

export const preferenceMeta: Record<PreferenceCategory, { label: string; description: string; group: NotificationGroup }> = {
  feeding_reminder: { label: "Feeding reminder", description: "A gentle nudge around your baby's usual feeding time.", group: "babyCare" },
  sleep_reminder: { label: "Sleep reminder", description: "A gentle nudge around your baby's usual sleep time.", group: "babyCare" },
  medicine_reminder: { label: "Medicine reminder", description: "When a scheduled dose is coming up.", group: "babyCare" },
  vaccine_reminder: { label: "Vaccine reminder", description: "When an upcoming vaccine is approaching.", group: "babyCare" },
  growth_reminder: { label: "Growth reminder", description: "A nudge to log a new measurement.", group: "babyCare" },
  memory_of_day: { label: "Memory of the day", description: "A favorite memory resurfaced from your Memory Book.", group: "parents" },
  weekly_report_ready: { label: "Weekly AI report ready", description: "When a new AI Reports summary is ready to read.", group: "parents" },
  family_activity: { label: "New family activity", description: "When another family member logs care or memories.", group: "parents" },
  elite_updates: { label: "Elite feature updates", description: "News about new Pilu Elite features.", group: "parents" },
};

export const reminderTypeLabels: Record<ReminderType, string> = {
  vaccine: "Vaccine", doctor_appointment: "Doctor appointment", medicine: "Medicine", birthday: "Birthday", family_event: "Family event", custom: "Custom",
};

export const recurrenceLabels: Record<Recurrence, string> = { once: "Once", daily: "Daily", weekly: "Weekly", monthly: "Monthly" };

export const categoryLabels: Record<NotificationCategory, string> = {
  feeding_reminder: "Feeding reminder", sleep_reminder: "Sleep reminder", medicine_reminder: "Medicine reminder",
  vaccine_reminder: "Vaccine reminder", growth_reminder: "Growth reminder", memory_of_day: "Memory of the day",
  weekly_report_ready: "Weekly AI report", family_activity: "Family activity", elite_updates: "Elite update",
  daily_summary: "Daily summary", weekly_summary: "Weekly summary", custom_reminder: "Reminder",
};

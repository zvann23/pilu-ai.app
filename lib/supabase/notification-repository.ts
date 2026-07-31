import { supabase } from "@/lib/supabase/client";
import type {
  DaysMode, NotificationCategory, NotificationItem, NotificationPreferences, NotificationStatus,
  Recurrence, Reminder, ReminderType,
} from "@/types/notifications";

type PreferencesRow = {
  user_id: string; feeding_reminder: boolean; sleep_reminder: boolean; medicine_reminder: boolean; vaccine_reminder: boolean; growth_reminder: boolean;
  memory_of_day: boolean; weekly_report_ready: boolean; family_activity: boolean; elite_updates: boolean; push_enabled: boolean;
  quiet_hours_enabled: boolean; quiet_hours_start: string; quiet_hours_end: string; days_mode: DaysMode; timezone: string;
};
type ReminderRow = { id: string; user_id: string; family_id: string | null; title: string; reminder_type: ReminderType; recurrence: Recurrence; due_at: string; is_private: boolean; notes: string | null; completed_at: string | null; created_at: string };
type NotificationRow = { id: string; user_id: string; family_id: string | null; category: NotificationCategory; title: string; body: string | null; status: NotificationStatus; link: string | null; reminder_id: string | null; created_at: string };

const defaultPreferences = (userId: string): NotificationPreferences => ({
  userId, feedingReminder: true, sleepReminder: true, medicineReminder: true, vaccineReminder: true, growthReminder: true,
  memoryOfDay: true, weeklyReportReady: true, familyActivity: true, eliteUpdates: true, pushEnabled: false,
  quietHoursEnabled: false, quietHoursStart: "21:00", quietHoursEnd: "07:00", daysMode: "all", timezone: "UTC",
});

function rowToPreferences(row: PreferencesRow): NotificationPreferences {
  return {
    userId: row.user_id, feedingReminder: row.feeding_reminder, sleepReminder: row.sleep_reminder, medicineReminder: row.medicine_reminder,
    vaccineReminder: row.vaccine_reminder, growthReminder: row.growth_reminder, memoryOfDay: row.memory_of_day, weeklyReportReady: row.weekly_report_ready,
    familyActivity: row.family_activity, eliteUpdates: row.elite_updates, pushEnabled: row.push_enabled, quietHoursEnabled: row.quiet_hours_enabled,
    quietHoursStart: row.quiet_hours_start.slice(0, 5), quietHoursEnd: row.quiet_hours_end.slice(0, 5), daysMode: row.days_mode, timezone: row.timezone,
  };
}

function rowToReminder(row: ReminderRow): Reminder {
  return { id: row.id, userId: row.user_id, familyId: row.family_id, title: row.title, reminderType: row.reminder_type, recurrence: row.recurrence, dueAt: row.due_at, isPrivate: row.is_private, notes: row.notes, completedAt: row.completed_at, createdAt: row.created_at };
}

function rowToNotification(row: NotificationRow): NotificationItem {
  return { id: row.id, userId: row.user_id, familyId: row.family_id, category: row.category, title: row.title, body: row.body, status: row.status, link: row.link, reminderId: row.reminder_id, createdAt: row.created_at };
}

export async function getPreferences(userId: string): Promise<NotificationPreferences> {
  const { data, error } = await supabase.from("notification_preferences").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data ? rowToPreferences(data as PreferencesRow) : defaultPreferences(userId);
}

export async function savePreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
  const payload: Record<string, unknown> = { user_id: userId, updated_at: new Date().toISOString() };
  if (preferences.feedingReminder !== undefined) payload.feeding_reminder = preferences.feedingReminder;
  if (preferences.sleepReminder !== undefined) payload.sleep_reminder = preferences.sleepReminder;
  if (preferences.medicineReminder !== undefined) payload.medicine_reminder = preferences.medicineReminder;
  if (preferences.vaccineReminder !== undefined) payload.vaccine_reminder = preferences.vaccineReminder;
  if (preferences.growthReminder !== undefined) payload.growth_reminder = preferences.growthReminder;
  if (preferences.memoryOfDay !== undefined) payload.memory_of_day = preferences.memoryOfDay;
  if (preferences.weeklyReportReady !== undefined) payload.weekly_report_ready = preferences.weeklyReportReady;
  if (preferences.familyActivity !== undefined) payload.family_activity = preferences.familyActivity;
  if (preferences.eliteUpdates !== undefined) payload.elite_updates = preferences.eliteUpdates;
  if (preferences.pushEnabled !== undefined) payload.push_enabled = preferences.pushEnabled;
  if (preferences.quietHoursEnabled !== undefined) payload.quiet_hours_enabled = preferences.quietHoursEnabled;
  if (preferences.quietHoursStart !== undefined) payload.quiet_hours_start = preferences.quietHoursStart;
  if (preferences.quietHoursEnd !== undefined) payload.quiet_hours_end = preferences.quietHoursEnd;
  if (preferences.daysMode !== undefined) payload.days_mode = preferences.daysMode;
  if (preferences.timezone !== undefined) payload.timezone = preferences.timezone;

  const { data, error } = await supabase.from("notification_preferences").upsert(payload, { onConflict: "user_id" }).select("*").single();
  if (error) throw error;
  return rowToPreferences(data as PreferencesRow);
}

export async function listReminders(userId: string): Promise<Reminder[]> {
  const { data, error } = await supabase.from("reminders").select("*").order("due_at", { ascending: true });
  if (error) throw error;
  return (data as ReminderRow[] ?? []).map(rowToReminder).filter((reminder) => reminder.userId === userId || !reminder.isPrivate);
}

export async function createReminder(userId: string, draft: { title: string; reminderType: ReminderType; recurrence: Recurrence; dueAt: string; isPrivate: boolean; notes?: string; familyId?: string | null }): Promise<Reminder> {
  const { data, error } = await supabase
    .from("reminders")
    .insert({ user_id: userId, family_id: draft.isPrivate ? null : draft.familyId, title: draft.title, reminder_type: draft.reminderType, recurrence: draft.recurrence, due_at: draft.dueAt, is_private: draft.isPrivate, notes: draft.notes || null })
    .select("*")
    .single();
  if (error) throw error;
  return rowToReminder(data as ReminderRow);
}

export async function updateReminder(id: string, patch: Partial<{ title: string; dueAt: string; notes: string | null; completedAt: string | null }>): Promise<void> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.title !== undefined) payload.title = patch.title;
  if (patch.dueAt !== undefined) payload.due_at = patch.dueAt;
  if (patch.notes !== undefined) payload.notes = patch.notes;
  if (patch.completedAt !== undefined) payload.completed_at = patch.completedAt;
  const { error } = await supabase.from("reminders").update(payload).eq("id", id);
  if (error) throw error;
}

export async function deleteReminder(id: string): Promise<void> {
  const { error } = await supabase.from("reminders").delete().eq("id", id);
  if (error) throw error;
}

export async function listNotifications(userId: string, options?: { status?: NotificationStatus; limit?: number }): Promise<NotificationItem[]> {
  let query = supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(options?.limit ?? 100);
  if (options?.status) query = query.eq("status", options.status);
  const { data, error } = await query;
  if (error) throw error;
  return (data as NotificationRow[] ?? []).map(rowToNotification);
}

export async function unreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "unread");
  if (error) throw error;
  return count ?? 0;
}

export async function createNotification(userId: string, draft: { category: NotificationCategory; title: string; body?: string; link?: string; familyId?: string | null; reminderId?: string | null }): Promise<NotificationItem> {
  const { data, error } = await supabase
    .from("notifications")
    .insert({ user_id: userId, family_id: draft.familyId ?? null, category: draft.category, title: draft.title, body: draft.body ?? null, link: draft.link ?? null, reminder_id: draft.reminderId ?? null })
    .select("*")
    .single();
  if (error) throw error;
  return rowToNotification(data as NotificationRow);
}

export async function setNotificationStatus(id: string, status: NotificationStatus): Promise<void> {
  const { error } = await supabase.from("notifications").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function markAllRead(userId: string): Promise<void> {
  const { error } = await supabase.from("notifications").update({ status: "read" }).eq("user_id", userId).eq("status", "unread");
  if (error) throw error;
}

export async function deleteNotification(id: string): Promise<void> {
  const { error } = await supabase.from("notifications").delete().eq("id", id);
  if (error) throw error;
}

export async function hasNotificationToday(userId: string, category: NotificationCategory, sinceIso: string): Promise<boolean> {
  const { count, error } = await supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("category", category).gte("created_at", sinceIso);
  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function notifyFamilyMembers(familyId: string, excludingUserId: string, category: NotificationCategory, title: string, body?: string, link?: string): Promise<void> {
  const { error } = await supabase.rpc("notify_family_members", { target_family_id: familyId, excluding_user_id: excludingUserId, notif_category: category, notif_title: title, notif_body: body ?? null, notif_link: link ?? null });
  if (error) throw error;
}

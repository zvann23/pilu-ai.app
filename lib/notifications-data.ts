import { activityMinutes, milkAmount, sortByTime, todayActivities } from "@/lib/activity-calculations";
import type { Activity } from "@/types/activity";
import type { FamilyActivityEvent } from "@/types/family";
import type { NotificationPreferences } from "@/types/notifications";

function minutesSinceMidnight(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(date);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

function timeStringToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

/** Respects an overnight window (e.g. 21:00 → 07:00) as well as a same-day one. */
export function isWithinQuietHours(preferences: NotificationPreferences, now = new Date()): boolean {
  if (!preferences.quietHoursEnabled) return false;
  const current = minutesSinceMidnight(now, preferences.timezone);
  const start = timeStringToMinutes(preferences.quietHoursStart);
  const end = timeStringToMinutes(preferences.quietHoursEnd);
  if (start === end) return false;
  return start < end ? current >= start && current < end : current >= start || current < end;
}

export function isAllowedDay(preferences: NotificationPreferences, now = new Date()): boolean {
  if (preferences.daysMode === "all") return true;
  const day = new Intl.DateTimeFormat("en-US", { timeZone: preferences.timezone, weekday: "short" }).format(now);
  const isWeekend = day === "Sat" || day === "Sun";
  return preferences.daysMode === "weekends" ? isWeekend : !isWeekend;
}

export function shouldDeliverNotification(preferences: NotificationPreferences, now = new Date()): boolean {
  return isAllowedDay(preferences, now) && !isWithinQuietHours(preferences, now);
}

/**
 * Looks at gaps between today's logged feedings/sleeps to describe a
 * routine in the parent's own words — "Emma usually eats about every
 * 3h" — rather than a fixed clock-time nag. This only has one day of
 * activity data to work with (see README notes on the mock dataset), so
 * it describes today's rhythm honestly rather than claiming a multi-day
 * trend it can't actually see.
 */
export function computeRoutineGapMinutes(activities: Activity[], kinds: string[]): number | null {
  const entries = sortByTime(todayActivities(activities).filter((activity) => kinds.includes(activity.kind)));
  if (entries.length < 2) return null;
  const gaps: number[] = [];
  for (let i = 1; i < entries.length; i += 1) {
    const [prevHour, prevMinute] = entries[i - 1].time.split(":").map(Number);
    const [hour, minute] = entries[i].time.split(":").map(Number);
    gaps.push(hour * 60 + minute - (prevHour * 60 + prevMinute));
  }
  return Math.round(gaps.reduce((total, value) => total + value, 0) / gaps.length);
}

export function formatGap(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours && mins) return `${hours}h ${mins}m`;
  if (hours) return `${hours}h`;
  return `${mins}m`;
}

export function buildSmartFeedingMessage(babyName: string, activities: Activity[]): string | null {
  const gap = computeRoutineGapMinutes(activities, ["feeding", "bottle", "breastfeeding"]);
  if (!gap) return null;
  return `${babyName} usually eats about every ${formatGap(gap)} — it's around that time now.`;
}

export function buildSmartSleepMessage(babyName: string, activities: Activity[]): string | null {
  const gap = computeRoutineGapMinutes(activities, ["sleep"]);
  if (!gap) return null;
  return `${babyName} usually settles for a nap about every ${formatGap(gap)} — worth watching for sleepy cues soon.`;
}

export type DailySummaryStats = { feedings: number; diapers: number; napMinutes: number; newMilestones: number; newMemories: number };

export function computeDailySummaryStats(activities: Activity[], memoryCount: number, milestoneCount: number): DailySummaryStats {
  const today = todayActivities(activities);
  return {
    feedings: today.filter((activity) => ["feeding", "bottle", "breastfeeding"].includes(activity.kind)).length,
    diapers: today.filter((activity) => activity.kind === "diaper").length,
    napMinutes: today.filter((activity) => activity.kind === "sleep").reduce((total, activity) => total + activityMinutes(activity.value), 0),
    newMilestones: milestoneCount,
    newMemories: memoryCount,
  };
}

export function formatDailySummaryBody(stats: DailySummaryStats): string {
  const hours = Math.floor(stats.napMinutes / 60);
  const minutes = stats.napMinutes % 60;
  const nap = hours ? `${hours}h ${minutes}m naps` : `${minutes}m naps`;
  const lines = [
    `${stats.feedings} feeding${stats.feedings === 1 ? "" : "s"}`,
    `${stats.diapers} diaper change${stats.diapers === 1 ? "" : "s"}`,
    nap,
  ];
  if (stats.newMilestones) lines.push(`${stats.newMilestones} new milestone${stats.newMilestones === 1 ? "" : "s"}`);
  if (stats.newMemories) lines.push(`${stats.newMemories} ${stats.newMemories === 1 ? "memory" : "memories"} added`);
  return lines.map((line) => `• ${line}`).join("\n");
}

/** Server-side variant: builds the same style of summary purely from the real, persisted family activity feed (Phase 18). */
export function computeSummaryFromEvents(events: FamilyActivityEvent[]): DailySummaryStats {
  const count = (kind: string) => events.filter((event) => event.kind === kind).length;
  const napMinutes = events
    .filter((event) => event.kind === "sleep")
    .reduce((total, event) => total + parseDurationMinutes(event.detail), 0);
  return { feedings: count("feeding"), diapers: count("diaper"), napMinutes, newMilestones: count("milestone"), newMemories: count("memory") };
}

function parseDurationMinutes(detail: string | null): number {
  if (!detail) return 0;
  const hours = Number(detail.match(/(\d+)h/)?.[1] ?? 0);
  const minutes = Number(detail.match(/(\d+)\s*m(?:in)?/)?.[1] ?? 0);
  return hours * 60 + minutes;
}

export function todayDateKey(timeZone?: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timeZone || "UTC", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

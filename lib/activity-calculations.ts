import type { Activity } from "@/types/activity";

const feedingKinds = new Set(["feeding", "bottle", "breastfeeding"]);
const bottleKinds = new Set(["feeding", "bottle"]);
const referenceMinutes = 20 * 60 + 45;

export const todayActivities = (activities: Activity[]) => activities.filter((activity) => activity.dateKey === "today");
export const feedingActivities = (activities: Activity[]) => todayActivities(activities).filter((activity) => feedingKinds.has(activity.kind));
export const sleepActivities = (activities: Activity[]) => todayActivities(activities).filter((activity) => activity.kind === "sleep");
export const activityMinutes = (value: string) => { const hours = Number(value.match(/(\d+)h/)?.[1] ?? 0); const minutes = Number(value.match(/(\d+)\s*(?:m|min)/)?.[1] ?? 0); return hours * 60 + minutes; };
export const milkAmount = (value: string) => Number(value.match(/[\d.]+/)?.[0] ?? 0);
export const formatDuration = (minutes: number) => minutes >= 60 ? `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ""}` : `${Math.max(0, minutes)}m`;
export const timeToMinutes = (time: string) => { const [hour, minute] = time.split(":").map(Number); return hour * 60 + minute; };
export const minutesToTime = (minutes: number) => `${String(Math.floor((minutes % 1440) / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
export const sortByTime = (activities: Activity[]) => activities.toSorted((first, second) => first.time.localeCompare(second.time));
export const lastOf = (activities: Activity[]) => sortByTime(activities).at(-1);
export const timeSince = (time?: string) => { if (!time) return "No entries yet"; const difference = Math.max(0, referenceMinutes - timeToMinutes(time)); return formatDuration(difference).replace(" ", " ") + " ago"; };

export function getFeedingStats(activities: Activity[]) {
  const entries = feedingActivities(activities); const bottles = entries.filter((activity) => bottleKinds.has(activity.kind)); const totalMilk = bottles.reduce((total, activity) => total + milkAmount(activity.value), 0); const last = lastOf(entries);
  return { entries, totalMilk, feedingCount: entries.length, averageBottle: bottles.length ? Math.round(totalMilk / bottles.length) : 0, last, sinceLast: timeSince(last?.time), bottles };
}

export function getSleepStats(activities: Activity[]) {
  const entries = sleepActivities(activities); const durations = entries.map((activity) => activityMinutes(activity.value)); const totalMinutes = durations.reduce((total, value) => total + value, 0); const longest = Math.max(0, ...durations); const last = lastOf(entries); const lastEnd = last ? timeToMinutes(last.time) + activityMinutes(last.value) : 0;
  return { entries, totalMinutes, naps: entries.filter((activity) => activity.secondary !== "Nighttime sleep").length, longest, last, lastEnd, wakeMinutes: Math.max(0, referenceMinutes - lastEnd) };
}

import type { LucideIcon } from "lucide-react";
import { Droplets, HeartPulse, Images, Milk, Moon, Pill, Plus, Scale, Thermometer } from "lucide-react";
import type { ActivityDict } from "@/lib/i18n/dictionary/activity";
import type { ActivityKind } from "@/types/activity";
import { formatDuration, getSleepStats, lastOf, timeSince, todayActivities } from "@/lib/activity-calculations";
import type { Activity } from "@/types/activity";

export type ActivitySummary = { label: string; time: string; detail: string; icon: LucideIcon; tone: "pink" | "blue" | "yellow" };
export type QuickAddOption = { id: keyof ActivityDict["kinds"]; icon: LucideIcon; kind?: ActivityKind };
export type RecentActivity = { id: "feeding" | "sleep" | "diaper"; detail: string; time: string; icon: LucideIcon; tone: "pink" | "blue" | "yellow" };

export function getHomeActivitySummaries(activities: Activity[], activityDict: ActivityDict): ActivitySummary[] {
  const today = todayActivities(activities);
  const feeding = lastOf(today.filter((activity) => activity.kind === "feeding" || activity.kind === "bottle" || activity.kind === "breastfeeding"));
  const sleep = lastOf(today.filter((activity) => activity.kind === "sleep"));
  const sleepStats = getSleepStats(activities);
  const diaper = lastOf(today.filter((activity) => activity.kind === "diaper"));
  const { noEntriesYet, agoTemplate } = activityDict;
  return [
    { label: activityDict.lastFeeding, time: timeSince(feeding?.time, noEntriesYet, agoTemplate), detail: feeding?.value ?? noEntriesYet, icon: Milk, tone: "pink" },
    { label: activityDict.lastSleep, time: sleep ? agoTemplate.replace("{duration}", formatDuration(sleepStats.wakeMinutes)) : noEntriesYet, detail: sleep?.value ?? "—", icon: Moon, tone: "blue" },
    { label: activityDict.lastDiaper, time: diaper ? timeSince(diaper.time, noEntriesYet, agoTemplate) : noEntriesYet, detail: diaper?.value ?? "—", icon: Droplets, tone: "yellow" },
  ];
}

export const quickAddActions: QuickAddOption[] = [
  { id: "feeding", icon: Milk },
  { id: "sleep", icon: Moon },
  { id: "diaper", icon: Droplets },
  { id: "temperature", icon: Thermometer },
  { id: "medicine", icon: Pill },
  { id: "more", icon: Plus },
];

export const quickAddOptions: QuickAddOption[] = [
  { id: "feeding", icon: Milk, kind: "feeding" },
  { id: "breastfeeding", icon: HeartPulse, kind: "breastfeeding" },
  { id: "bottle", icon: Milk, kind: "bottle" },
  { id: "sleep", icon: Moon, kind: "sleep" },
  { id: "diaper", icon: Droplets, kind: "diaper" },
  { id: "temperature", icon: Thermometer, kind: "temperature" },
  { id: "medicine", icon: Pill, kind: "medicine" },
  { id: "weight", icon: Scale, kind: "weight" },
  { id: "memory", icon: Images, kind: "memory" },
];

export const recentActivities: RecentActivity[] = [
  { id: "feeding", detail: "120 ml", time: "2h 15m", icon: Milk, tone: "pink" },
  { id: "sleep", detail: "45 min", time: "1h 20m", icon: Moon, tone: "blue" },
  { id: "diaper", detail: "wet", time: "45m", icon: Droplets, tone: "yellow" },
];

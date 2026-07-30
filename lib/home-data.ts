import type { LucideIcon } from "lucide-react";
import { Droplets, HeartPulse, Images, Milk, Moon, Pill, Plus, Scale, Thermometer } from "lucide-react";
import type { ActivityKind } from "@/types/activity";

export type ActivitySummary = { label: string; time: string; detail: string; icon: LucideIcon; tone: "pink" | "blue" | "yellow" };
export type QuickAddOption = { label: string; icon: LucideIcon; kind?: ActivityKind };
export type RecentActivity = { label: string; detail: string; time: string; icon: LucideIcon; tone: "pink" | "blue" | "yellow" };

export const baby = { name: "Emma", age: "2 months & 5 days old", initial: "E" };

export const activitySummaries: ActivitySummary[] = [
  { label: "Last feeding", time: "2h 15m ago", detail: "120 ml", icon: Milk, tone: "pink" },
  { label: "Last sleep", time: "1h 20m ago", detail: "45 min", icon: Moon, tone: "blue" },
  { label: "Last diaper", time: "45m ago", detail: "Wet", icon: Droplets, tone: "yellow" },
];

export const quickAddActions: QuickAddOption[] = [
  { label: "Feeding", icon: Milk },
  { label: "Sleep", icon: Moon },
  { label: "Diaper", icon: Droplets },
  { label: "Temperature", icon: Thermometer },
  { label: "Medicine", icon: Pill },
  { label: "More", icon: Plus },
];

export const quickAddOptions: QuickAddOption[] = [
  { label: "Feeding", icon: Milk, kind: "feeding" },
  { label: "Breastfeeding", icon: HeartPulse, kind: "breastfeeding" },
  { label: "Bottle", icon: Milk, kind: "bottle" },
  { label: "Sleep", icon: Moon, kind: "sleep" },
  { label: "Diaper", icon: Droplets, kind: "diaper" },
  { label: "Temperature", icon: Thermometer, kind: "temperature" },
  { label: "Medicine", icon: Pill, kind: "medicine" },
  { label: "Weight", icon: Scale, kind: "weight" },
  { label: "Memory", icon: Images, kind: "memory" },
];

export const recentActivities: RecentActivity[] = [
  { label: "Feeding", detail: "120 ml", time: "2h 15m ago", icon: Milk, tone: "pink" },
  { label: "Sleep", detail: "45 min", time: "1h 20m ago", icon: Moon, tone: "blue" },
  { label: "Diaper", detail: "Wet", time: "45m ago", icon: Droplets, tone: "yellow" },
];

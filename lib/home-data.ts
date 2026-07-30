import type { LucideIcon } from "lucide-react";
import { Droplets, HeartPulse, Images, Milk, Moon, Pill, Plus, Scale, Thermometer } from "lucide-react";

export type ActivitySummary = { label: string; time: string; detail: string; icon: LucideIcon; tone: "pink" | "blue" | "yellow" };
export type QuickAddOption = { label: string; icon: LucideIcon };
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
  { label: "Feeding", icon: Milk },
  { label: "Breastfeeding", icon: HeartPulse },
  { label: "Bottle", icon: Milk },
  { label: "Sleep", icon: Moon },
  { label: "Diaper", icon: Droplets },
  { label: "Temperature", icon: Thermometer },
  { label: "Medicine", icon: Pill },
  { label: "Weight", icon: Scale },
  { label: "Memory", icon: Images },
];

export const recentActivities: RecentActivity[] = [
  { label: "Feeding", detail: "120 ml", time: "2h 15m ago", icon: Milk, tone: "pink" },
  { label: "Sleep", detail: "45 min", time: "1h 20m ago", icon: Moon, tone: "blue" },
  { label: "Diaper", detail: "Wet", time: "45m ago", icon: Droplets, tone: "yellow" },
];

import type { LucideIcon } from "lucide-react";
import { Droplets, HeartPulse, Images, Milk, Moon, Pill, Scale, Thermometer } from "lucide-react";
import type { Activity, ActivityFilter, ActivityKind } from "@/types/activity";

export type ActivityAppearance = { label: string; icon: LucideIcon; tone: "pink" | "blue" | "yellow" | "purple" };

export const activityAppearance: Record<ActivityKind, ActivityAppearance> = {
  feeding: { label: "Feeding", icon: Milk, tone: "pink" },
  breastfeeding: { label: "Breastfeeding", icon: HeartPulse, tone: "pink" },
  bottle: { label: "Bottle", icon: Milk, tone: "pink" },
  sleep: { label: "Sleep", icon: Moon, tone: "blue" },
  diaper: { label: "Diaper", icon: Droplets, tone: "yellow" },
  temperature: { label: "Temperature", icon: Thermometer, tone: "purple" },
  medicine: { label: "Medicine", icon: Pill, tone: "purple" },
  weight: { label: "Weight", icon: Scale, tone: "blue" },
  memory: { label: "Memory", icon: Images, tone: "yellow" },
};

export const activityFilters: { id: ActivityFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "feeding", label: "Feeding" },
  { id: "sleep", label: "Sleep" },
  { id: "diaper", label: "Diaper" },
  { id: "temperature", label: "Temperature" },
  { id: "medicine", label: "Medicine" },
  { id: "weight", label: "Growth" },
  { id: "memory", label: "Memory" },
];

export const initialActivities: Activity[] = [
  { id: "feeding-0620", kind: "bottle", dateKey: "today", time: "06:20", title: "Feeding", value: "110 ml", secondary: "Bottle" },
  { id: "feeding-0830", kind: "bottle", dateKey: "today", time: "08:30", title: "Feeding", value: "120 ml", secondary: "Bottle", note: "Finished the full bottle" },
  { id: "sleep-0915", kind: "sleep", dateKey: "today", time: "09:15", title: "Sleep", value: "1h 15min", note: "Morning nap" },
  { id: "diaper-1045", kind: "diaper", dateKey: "today", time: "10:45", title: "Diaper", value: "Wet" },
  { id: "feeding-1200", kind: "bottle", dateKey: "today", time: "12:00", title: "Feeding", value: "100 ml", secondary: "Bottle" },
  { id: "sleep-1330", kind: "sleep", dateKey: "today", time: "13:30", title: "Sleep", value: "1h 55min", secondary: "Nap" },
  { id: "diaper-1430", kind: "diaper", dateKey: "today", time: "14:30", title: "Diaper", value: "Dirty" },
  { id: "medicine-1500", kind: "medicine", dateKey: "today", time: "15:00", title: "Medicine", value: "Vitamin D", secondary: "1 dose" },
  { id: "temperature-1620", kind: "temperature", dateKey: "today", time: "16:20", title: "Temperature", value: "36.8°C" },
  { id: "memory-1700", kind: "memory", dateKey: "today", time: "17:00", title: "Memory", value: "First big smile today" },
  { id: "sleep-1710", kind: "sleep", dateKey: "today", time: "17:10", title: "Sleep", value: "2h 10min", secondary: "Nap" },
  { id: "feeding-1630", kind: "bottle", dateKey: "today", time: "16:30", title: "Feeding", value: "100 ml", secondary: "Bottle" },
  { id: "feeding-1830", kind: "bottle", dateKey: "today", time: "18:30", title: "Feeding", value: "110 ml", secondary: "Bottle" },
];

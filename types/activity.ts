export const activityKinds = [
  "feeding", "breastfeeding", "bottle", "sleep", "diaper", "temperature", "medicine", "vaccine", "weight", "memory",
] as const;

export type ActivityKind = (typeof activityKinds)[number];
export type ActivityFilter = "all" | ActivityKind;
export type ActivityDateKey = "previous" | "today" | "next";

export type Activity = {
  id: string;
  kind: ActivityKind;
  time: string;
  dateKey: ActivityDateKey;
  title: string;
  value: string;
  note?: string;
  secondary?: string;
};

export type ActivityDraft = Omit<Activity, "id">;

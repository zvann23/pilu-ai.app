export type DayPeriod = "morning" | "afternoon" | "evening" | "night";

/** Based on the device's local clock — every caller passes `new Date()` explicitly. */
export function getDayPeriod(date: Date): DayPeriod {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}


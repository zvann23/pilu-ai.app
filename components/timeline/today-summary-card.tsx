"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import type { Activity } from "@/types/activity";

export function TodaySummaryCard({ activities }: { activities: Activity[] }) {
  const { t } = useLocale();
  const dict = t((d) => d.timeline.todaySummary);
  const feedings = activities.filter((activity) => activity.kind === "feeding" || activity.kind === "bottle" || activity.kind === "breastfeeding").length;
  const diapers = activities.filter((activity) => activity.kind === "diaper").length;
  const sleeps = activities.filter((activity) => activity.kind === "sleep");
  const sleepMinutes = sleeps.reduce((total, activity) => {
    const hours = Number(activity.value.match(/(\d+)h/)?.[1] ?? 0);
    const minutes = Number(activity.value.match(/(\d+)\s*(?:m|min)/)?.[1] ?? 0);
    return total + hours * 60 + minutes;
  }, 0);
  const temperature = [...activities].reverse().find((activity) => activity.kind === "temperature")?.value ?? "—";
  return <section className="today-summary" aria-label="Today summary"><p>{dict.heading}</p><div><span><strong>{feedings}</strong> {dict.feedings}</span><span><strong>{Math.floor(sleepMinutes / 60)}h {sleepMinutes % 60 ? `${sleepMinutes % 60}m` : ""}</strong> {dict.sleep}</span><span><strong>{diapers}</strong> {dict.diapers}</span><span><strong>{temperature}</strong> {dict.latestTemp}</span></div></section>;
}

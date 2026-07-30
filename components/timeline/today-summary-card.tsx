import type { Activity } from "@/types/activity";

export function TodaySummaryCard({ activities }: { activities: Activity[] }) {
  const feedings = activities.filter((activity) => activity.kind === "feeding" || activity.kind === "bottle" || activity.kind === "breastfeeding").length;
  const diapers = activities.filter((activity) => activity.kind === "diaper").length;
  const sleeps = activities.filter((activity) => activity.kind === "sleep");
  const sleepMinutes = sleeps.reduce((total, activity) => {
    const hours = Number(activity.value.match(/(\d+)h/)?.[1] ?? 0);
    const minutes = Number(activity.value.match(/(\d+)\s*(?:m|min)/)?.[1] ?? 0);
    return total + hours * 60 + minutes;
  }, 0);
  const temperature = [...activities].reverse().find((activity) => activity.kind === "temperature")?.value ?? "—";
  return <section className="today-summary" aria-label="Today summary"><p>Today at a glance</p><div><span><strong>{feedings}</strong> feedings</span><span><strong>{Math.floor(sleepMinutes / 60)}h {sleepMinutes % 60 ? `${sleepMinutes % 60}m` : ""}</strong> sleep</span><span><strong>{diapers}</strong> diapers</span><span><strong>{temperature}</strong> latest temp</span></div></section>;
}

import type { ActivitySummary } from "@/lib/home-data";

export function ActivitySummaryCard({ activity }: { activity: ActivitySummary }) {
  const Icon = activity.icon;
  return (
    <article className="activity-summary-card">
      <div className={`activity-summary-card__icon activity-summary-card__icon--${activity.tone}`}><Icon size={18} aria-hidden="true" /></div>
      <p>{activity.label}</p>
      <strong>{activity.time}</strong>
      <span>{activity.detail}</span>
    </article>
  );
}

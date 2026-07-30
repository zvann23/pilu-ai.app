import { activityAppearance } from "@/lib/timeline-data";
import type { Activity } from "@/types/activity";
import { ActivityActionMenu } from "./activity-action-menu";

export function ActivityCard({ activity, onEdit, onDelete }: { activity: Activity; onEdit: () => void; onDelete: () => void }) {
  const appearance = activityAppearance[activity.kind];
  const Icon = appearance.icon;
  return <article className="timeline-card"><time>{activity.time}</time><div className={`timeline-card__icon timeline-card__icon--${appearance.tone}`}><Icon size={19} aria-hidden="true" /></div><div className="timeline-card__content"><div><h3>{activity.title}</h3><strong>{activity.value}</strong></div>{activity.secondary ? <span>{activity.secondary}</span> : null}{activity.note ? <p>{activity.note}</p> : null}</div><ActivityActionMenu onEdit={onEdit} onDelete={onDelete} /></article>;
}

import type { Activity } from "@/types/activity";
import { ActivityCard } from "./activity-card";

export function ActivityTimeline({ activities, onEdit, onDelete }: { activities: Activity[]; onEdit: (activity: Activity) => void; onDelete: (activity: Activity) => void }) {
  return <section className="activity-timeline" aria-label="Activities"><div className="activity-timeline__line" aria-hidden="true" />{activities.map((activity) => <ActivityCard key={activity.id} activity={activity} onEdit={() => onEdit(activity)} onDelete={() => onDelete(activity)} />)}</section>;
}

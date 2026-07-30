import { activityFilters } from "@/lib/timeline-data";
import type { ActivityFilter } from "@/types/activity";

export function ActivityFilterChips({ active, onChange }: { active: ActivityFilter; onChange: (filter: ActivityFilter) => void }) {
  return <div className="activity-filters" aria-label="Filter timeline">{activityFilters.map((filter) => <button key={filter.id} type="button" className={active === filter.id ? "activity-filters__chip activity-filters__chip--active" : "activity-filters__chip"} onClick={() => onChange(filter.id)}>{filter.label}</button>)}</div>;
}

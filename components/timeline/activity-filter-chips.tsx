"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { activityFilters } from "@/lib/timeline-data";
import type { ActivityFilter } from "@/types/activity";

export function ActivityFilterChips({ active, onChange }: { active: ActivityFilter; onChange: (filter: ActivityFilter) => void }) {
  const { t } = useLocale();
  const activityKinds = t((d) => d.activity.kinds);
  const timelineDict = t((d) => d.timeline.filters);

  function label(filter: ActivityFilter): string {
    if (filter === "all") return timelineDict.all;
    if (filter === "weight") return timelineDict.growth;
    return activityKinds[filter];
  }

  return <div className="activity-filters" aria-label="Filter timeline">{activityFilters.map((filter) => <button key={filter} type="button" className={active === filter ? "activity-filters__chip activity-filters__chip--active" : "activity-filters__chip"} onClick={() => onChange(filter)}>{label(filter)}</button>)}</div>;
}

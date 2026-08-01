"use client";

import { ActivityCard } from "@/components/timeline/activity-card";
import { useLocale } from "@/components/i18n/locale-provider";
import { sortByTime } from "@/lib/activity-calculations";
import type { Activity } from "@/types/activity";
import { useState } from "react";

export function ActivityHistory({ title, entries, filters, isVisible, onEdit, onDelete }: { title: string; entries: Activity[]; filters: string[]; isVisible: (filterIndex: number, entry: Activity) => boolean; onEdit: (activity: Activity) => void; onDelete: (activity: Activity) => void }) {
  const { t } = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const visible = sortByTime(entries).toReversed().filter((entry) => isVisible(activeIndex, entry));
  return <section className="module-history"><header><h2>{title}</h2><div>{filters.map((filter, index) => <button key={filter} type="button" className={activeIndex === index ? "module-history__chip module-history__chip--active" : "module-history__chip"} onClick={() => setActiveIndex(index)}>{filter}</button>)}</div></header>{visible.length ? <div className="module-history__entries">{visible.map((entry) => <ActivityCard key={entry.id} activity={entry} onEdit={() => onEdit(entry)} onDelete={() => onDelete(entry)} />)}</div> : <p className="module-history__empty">{t((d) => d.common.noEntriesLoggedYet)}</p>}</section>;
}

"use client";

import { ActivityCard } from "@/components/timeline/activity-card";
import { sortByTime } from "@/lib/activity-calculations";
import type { Activity } from "@/types/activity";
import { useState } from "react";

export function ActivityHistory({ title, entries, filters, onEdit, onDelete }: { title: string; entries: Activity[]; filters: string[]; onEdit: (activity: Activity) => void; onDelete: (activity: Activity) => void }) {
  const [active, setActive] = useState("All"); const visible = sortByTime(entries).toReversed().filter((entry) => active === "All" || (active === "Bottle" && (entry.kind === "bottle" || entry.kind === "feeding")) || (active === "Breastfeeding" && entry.kind === "breastfeeding") || (active === "Formula" && entry.secondary?.includes("Formula")) || (active === "Breast milk" && entry.secondary?.includes("Breast milk")) || (active === "Nap" && entry.secondary !== "Nighttime sleep") || (active === "Nighttime" && entry.secondary === "Nighttime sleep"));
  return <section className="module-history"><header><h2>{title}</h2><div>{filters.map((filter) => <button key={filter} type="button" className={active === filter ? "module-history__chip module-history__chip--active" : "module-history__chip"} onClick={() => setActive(filter)}>{filter}</button>)}</div></header>{visible.length ? <div className="module-history__entries">{visible.map((entry) => <ActivityCard key={entry.id} activity={entry} onEdit={() => onEdit(entry)} onDelete={() => onDelete(entry)} />)}</div> : <p className="module-history__empty">No entries logged yet.</p>}</section>;
}

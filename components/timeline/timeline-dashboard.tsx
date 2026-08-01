"use client";

import { useActivities } from "@/components/activity/activity-provider";
import { FloatingAddButton } from "@/components/home/floating-add-button";
import { QuickAddBottomSheet } from "@/components/home/quick-add-bottom-sheet";
import { useLocale } from "@/components/i18n/locale-provider";
import type { Activity, ActivityDateKey, ActivityDraft, ActivityFilter, ActivityKind } from "@/types/activity";
import { useMemo, useRef, useState } from "react";
import { ActivityFilterChips } from "./activity-filter-chips";
import { ActivityFormSheet } from "./activity-form-sheet";
import { ActivityTimeline } from "./activity-timeline";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { TimelineHeader } from "./timeline-header";
import { Toast } from "./toast";
import { TodaySummaryCard } from "./today-summary-card";

export function TimelineDashboard() {
  const { activities, addActivity, updateActivity, removeActivity } = useActivities();
  const { t } = useLocale();
  const emptyStateDict = t((d) => d.timeline.emptyState);
  const toastsDict = t((d) => d.timeline.toasts);
  const fallbackTitle = t((d) => d.timeline.deleteDialog.fallbackTitle);
  const [dateKey, setDateKey] = useState<ActivityDateKey>("today");
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [formKind, setFormKind] = useState<ActivityKind | null>(null);
  const [editing, setEditing] = useState<Activity | undefined>();
  const [deleting, setDeleting] = useState<Activity | undefined>();
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeout = useRef<number | undefined>(undefined);
  const dayActivities = useMemo(() => activities.filter((activity) => activity.dateKey === dateKey), [activities, dateKey]);
  const visibleActivities = useMemo(() => dayActivities.filter((activity) => filter === "all" || activity.kind === filter || (filter === "feeding" && (activity.kind === "bottle" || activity.kind === "breastfeeding"))).toSorted((first, second) => first.time.localeCompare(second.time)), [dayActivities, filter]);
  function showToast(message: string) { setToast(message); window.clearTimeout(toastTimeout.current); toastTimeout.current = window.setTimeout(() => setToast(null), 3200); }
  function openNewForm(kind: ActivityKind) { setQuickAddOpen(false); setEditing(undefined); setFormKind(kind); }
  function closeForm() { setFormKind(null); setEditing(undefined); }
  function saveActivity(draft: ActivityDraft) { if (editing) { updateActivity(editing.id, draft); showToast(toastsDict.activityUpdated); } else { addActivity(draft); showToast(toastsDict.activityAdded); } closeForm(); }
  function editActivity(activity: Activity) { setEditing(activity); setFormKind(activity.kind); }
  function confirmDelete() { if (!deleting) return; removeActivity(deleting.id); showToast(toastsDict.activityRemoved); setDeleting(undefined); }
  return <div className="timeline-dashboard"><TimelineHeader dateKey={dateKey} onDateChange={setDateKey} /><TodaySummaryCard activities={dayActivities} /><ActivityFilterChips active={filter} onChange={setFilter} />{visibleActivities.length ? <ActivityTimeline activities={visibleActivities} onEdit={editActivity} onDelete={setDeleting} /> : <section className="timeline-empty"><p>{emptyStateDict.message}</p><button type="button" className="button button--primary" onClick={() => setQuickAddOpen(true)}>{emptyStateDict.addButton}</button></section>}<FloatingAddButton onClick={() => setQuickAddOpen(true)} /><QuickAddBottomSheet open={quickAddOpen} onClose={() => setQuickAddOpen(false)} onSelect={openNewForm} /><ActivityFormSheet open={Boolean(formKind)} kind={formKind} dateKey={dateKey} activity={editing} onClose={closeForm} onSave={saveActivity} /><ConfirmDeleteDialog open={Boolean(deleting)} title={deleting?.title ?? fallbackTitle} onCancel={() => setDeleting(undefined)} onConfirm={confirmDelete} /><Toast message={toast} /></div>;
}

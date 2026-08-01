"use client";

import { useActivities } from "@/components/activity/activity-provider";
import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { useLocale } from "@/components/i18n/locale-provider";
import { PiluIllustration } from "@/components/illustrations/pilu-illustration";
import { ActivityFormSheet } from "@/components/timeline/activity-form-sheet";
import { ConfirmDeleteDialog } from "@/components/timeline/confirm-delete-dialog";
import { Toast } from "@/components/timeline/toast";
import { ActivityHistory } from "@/components/tracking/activity-history";
import { BottleFormSheet } from "@/components/tracking/bottle-form-sheet";
import { BreastfeedingTimer } from "@/components/tracking/breastfeeding-timer";
import { getFeedingStats, sortByTime } from "@/lib/activity-calculations";
import type { Activity, ActivityDraft, ActivityKind } from "@/types/activity";
import { History, Milk, Plus, Timer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function FeedingDashboard() {
  const { activities, addActivity, updateActivity, removeActivity } = useActivities();
  const { profile } = useBabyProfile();
  const { t } = useLocale();
  const activityDict = t((d) => d.activity);
  const stats = getFeedingStats(activities, activityDict.noEntriesYet, activityDict.agoTemplate);
  const [bottleOpen, setBottleOpen] = useState(false);
  const [formKind, setFormKind] = useState<ActivityKind | null>(null);
  const [editing, setEditing] = useState<Activity | undefined>();
  const [deleting, setDeleting] = useState<Activity | undefined>();
  const [toast, setToast] = useState<string | null>(null);

  const done = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 3000); };
  const save = (draft: ActivityDraft) => { if (editing) updateActivity(editing.id, draft); else addActivity(draft); setEditing(undefined); setFormKind(null); done(editing ? "Feeding updated" : "Feeding added to Timeline"); };
  const edit = (activity: Activity) => { setEditing(activity); setFormKind(activity.kind); };
  const remove = () => { if (!deleting) return; removeActivity(deleting.id); setDeleting(undefined); done("Feeding removed"); };
  const recentBottles = sortByTime(stats.bottles).slice(-3);
  const insightAverage = recentBottles.length ? Math.round(recentBottles.reduce((sum, item) => sum + Number(item.value.match(/[\d.]+/)?.[0] ?? 0), 0) / recentBottles.length) : 0;

  return <div className="tracker-page"><header className="tracker-page__header"><p>Track bottles, breastfeeding and feeding patterns</p><h1>Feeding</h1></header><section className="module-summary module-summary--feeding"><PiluIllustration variant="feeding-bottle" alt="" className="module-summary__illustration" /><p>Today&apos;s feeding</p><div><span><strong>{stats.totalMilk} ml</strong>Total milk</span><span><strong>{stats.feedingCount}</strong>Feedings</span><span><strong>{stats.averageBottle} ml</strong>Average bottle</span><span><strong>{stats.sinceLast}</strong>Last feeding</span></div></section><section className="module-actions" aria-label="Feeding actions"><button type="button" onClick={() => setBottleOpen(true)}><Milk size={20} aria-hidden="true" />Add bottle</button><button type="button" onClick={() => setFormKind("breastfeeding")}><Timer size={20} aria-hidden="true" />Start breastfeeding</button><button type="button" onClick={() => setFormKind("feeding")}><Plus size={20} aria-hidden="true" />Add feeding</button><Link href="/timeline"><History size={20} aria-hidden="true" />View timeline</Link></section>{formKind === "breastfeeding" && !editing ? <BreastfeedingTimer onFinish={(side, minutes) => { addActivity({ kind: "breastfeeding", dateKey: "today", time: "18:30", title: "Breastfeeding", value: `${minutes} min`, secondary: side }); setFormKind(null); done("Breastfeeding saved to Timeline"); }} /> : null}<section className="module-insight"><p>Based on recent activity</p><h2>{profile.preferredName} usually feeds every 2h 45m.</h2><span>The last three bottles averaged {insightAverage || 0} ml. This is an activity summary, not medical advice.</span></section><ActivityHistory title="Feeding history" entries={stats.entries} filters={["All", "Bottle", "Breastfeeding", "Formula", "Breast milk"]} onEdit={edit} onDelete={setDeleting} /><BottleFormSheet open={bottleOpen} onClose={() => setBottleOpen(false)} onSave={(draft) => { addActivity(draft); done("Bottle added to Timeline"); }} /><ActivityFormSheet open={Boolean(formKind) && (formKind !== "breastfeeding" || Boolean(editing))} kind={formKind} dateKey="today" activity={editing} onClose={() => { setFormKind(null); setEditing(undefined); }} onSave={save} /><ConfirmDeleteDialog open={Boolean(deleting)} title={deleting?.title ?? "feeding"} onCancel={() => setDeleting(undefined)} onConfirm={remove} /><Toast message={toast} /></div>;
}

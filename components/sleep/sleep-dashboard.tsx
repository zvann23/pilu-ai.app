"use client";

import { useActivities } from "@/components/activity/activity-provider";
import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { format, useLocale } from "@/components/i18n/locale-provider";
import { PiluIllustration } from "@/components/illustrations/pilu-illustration";
import { ActivityFormSheet } from "@/components/timeline/activity-form-sheet";
import { ConfirmDeleteDialog } from "@/components/timeline/confirm-delete-dialog";
import { Toast } from "@/components/timeline/toast";
import { ActivityHistory } from "@/components/tracking/activity-history";
import { SleepTimer } from "@/components/tracking/sleep-timer";
import { formatDuration, getSleepStats, timeToMinutes } from "@/lib/activity-calculations";
import type { Activity, ActivityDraft } from "@/types/activity";
import { History, Moon, Plus, Timer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function SleepDashboard() {
  const { activities, addActivity, updateActivity, removeActivity } = useActivities();
  const { profile } = useBabyProfile();
  const { t } = useLocale();
  const dict = t((d) => d.care.sleep);
  const stats = getSleepStats(activities);
  const [timerOpen, setTimerOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [editing, setEditing] = useState<Activity | undefined>();
  const [deleting, setDeleting] = useState<Activity | undefined>();
  const [toast, setToast] = useState<string | null>(null);

  const done = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 3000); };
  const save = (draft: ActivityDraft) => { if (editing) updateActivity(editing.id, draft); else addActivity(draft); setEditing(undefined); setManualOpen(false); done(editing ? dict.toasts.updated : dict.toasts.addedToTimeline); };
  const remove = () => { if (!deleting) return; removeActivity(deleting.id); setDeleting(undefined); done(dict.toasts.removed); };

  const historyVisible = (index: number, entry: Activity) => index === 0 || (index === 1 && entry.secondary !== "Nighttime sleep") || (index === 2 && entry.secondary === "Nighttime sleep");

  return <div className="tracker-page"><header className="tracker-page__header"><p>{dict.subtitle}</p><h1>{dict.title}</h1></header><section className="module-summary module-summary--sleep"><PiluIllustration variant="pacifier-pillow" alt="" className="module-summary__illustration" /><p>{dict.todaysSleep}</p><div><span><strong>{formatDuration(stats.totalMinutes)}</strong>{dict.totalSleep}</span><span><strong>{stats.naps}</strong>{dict.naps}</span><span><strong>{formatDuration(stats.longest)}</strong>{dict.longestSleep}</span><span><strong>{dict.awakePrefix} {formatDuration(stats.wakeMinutes)}</strong>{dict.wakeWindow}</span></div></section><section className="module-actions" aria-label="Sleep actions"><button type="button" onClick={() => setTimerOpen(true)}><Timer size={20} aria-hidden="true" />{dict.startSleep}</button><button type="button" onClick={() => setManualOpen(true)}><Plus size={20} aria-hidden="true" />{dict.addSleepManually}</button><button type="button" onClick={() => setTimerOpen(true)}><Moon size={20} aria-hidden="true" />{dict.wakeBaby}</button><Link href="/timeline"><History size={20} aria-hidden="true" />{dict.viewTimeline}</Link></section>{timerOpen ? <SleepTimer onWake={(sleepType, minutes) => { addActivity({ kind: "sleep", dateKey: "today", time: "18:30", title: "Sleep", value: `${minutes} min`, secondary: sleepType }); setTimerOpen(false); done(dict.sleepSavedToTimeline); }} /> : null}<section className="wake-window"><p>{dict.wakeWindow}</p><h2>{format(dict.awakeForTemplate, { name: profile.preferredName, duration: formatDuration(stats.wakeMinutes) })}</h2><span>{format(dict.lastSleepEndedTemplate, { time: stats.last ? `${String(Math.floor(stats.lastEnd / 60)).padStart(2, "0")}:${String(stats.lastEnd % 60).padStart(2, "0")}` : dict.noneDash })}</span></section><DailySleepTimeline entries={stats.entries} label={dict.todaysSleep} /><ActivityHistory title={dict.historyTitle} entries={stats.entries} filters={dict.filters} isVisible={historyVisible} onEdit={(activity) => { setEditing(activity); setManualOpen(true); }} onDelete={setDeleting} /><ActivityFormSheet open={manualOpen} kind="sleep" dateKey="today" activity={editing} onClose={() => { setManualOpen(false); setEditing(undefined); }} onSave={save} /><ConfirmDeleteDialog open={Boolean(deleting)} title={deleting?.title ?? dict.fallbackTitle} onCancel={() => setDeleting(undefined)} onConfirm={remove} /><Toast message={toast} /></div>;
}

function DailySleepTimeline({ entries, label }: { entries: Activity[]; label: string }) { return <section className="daily-sleep"><header><p>{label}</p><span>00:00 <i /> 12:00 <i /> 24:00</span></header><div className="daily-sleep__track">{entries.map((entry) => { const start = timeToMinutes(entry.time); const duration = Number(entry.value.match(/(\d+)h/)?.[1] ?? 0) * 60 + Number(entry.value.match(/(\d+)\s*(?:m|min)/)?.[1] ?? 0); return <div key={entry.id} title={`${entry.time} · ${entry.value}`} style={{ left: `${(start / 1440) * 100}%`, width: `${Math.max(4, (duration / 1440) * 100)}%` }} />; })}</div></section>; }

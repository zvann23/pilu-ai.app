"use client";

import { useActivities } from "@/components/activity/activity-provider";
import { useBabyProfile } from "@/components/baby/baby-profile-provider";
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
  const stats = getSleepStats(activities);
  const [timerOpen, setTimerOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [editing, setEditing] = useState<Activity | undefined>();
  const [deleting, setDeleting] = useState<Activity | undefined>();
  const [toast, setToast] = useState<string | null>(null);

  const done = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 3000); };
  const save = (draft: ActivityDraft) => { if (editing) updateActivity(editing.id, draft); else addActivity(draft); setEditing(undefined); setManualOpen(false); done(editing ? "Sleep updated" : "Sleep added to Timeline"); };
  const remove = () => { if (!deleting) return; removeActivity(deleting.id); setDeleting(undefined); done("Sleep removed"); };

  return <div className="tracker-page"><header className="tracker-page__header"><p>Track naps, nighttime sleep and wake windows</p><h1>Sleep</h1></header><section className="module-summary module-summary--sleep"><PiluIllustration variant="pacifier-pillow" alt="" className="module-summary__illustration" /><p>Today&apos;s sleep</p><div><span><strong>{formatDuration(stats.totalMinutes)}</strong>Total sleep</span><span><strong>{stats.naps}</strong>Naps</span><span><strong>{formatDuration(stats.longest)}</strong>Longest sleep</span><span><strong>Awake {formatDuration(stats.wakeMinutes)}</strong>Wake window</span></div></section><section className="module-actions" aria-label="Sleep actions"><button type="button" onClick={() => setTimerOpen(true)}><Timer size={20} aria-hidden="true" />Start sleep</button><button type="button" onClick={() => setManualOpen(true)}><Plus size={20} aria-hidden="true" />Add sleep manually</button><button type="button" onClick={() => setTimerOpen(true)}><Moon size={20} aria-hidden="true" />Wake baby</button><Link href="/timeline"><History size={20} aria-hidden="true" />View timeline</Link></section>{timerOpen ? <SleepTimer onWake={(sleepType, minutes) => { addActivity({ kind: "sleep", dateKey: "today", time: "18:30", title: "Sleep", value: `${minutes} min`, secondary: sleepType }); setTimerOpen(false); done("Sleep saved to Timeline"); }} /> : null}<section className="wake-window"><p>Wake window</p><h2>{profile.preferredName} has been awake for {formatDuration(stats.wakeMinutes)}.</h2><span>Last sleep ended at {stats.last ? `${String(Math.floor(stats.lastEnd / 60)).padStart(2, "0")}:${String(stats.lastEnd % 60).padStart(2, "0")}` : "—"}. Next nap estimate coming later.</span></section><DailySleepTimeline entries={stats.entries} /><ActivityHistory title="Sleep history" entries={stats.entries} filters={["All", "Nap", "Nighttime"]} onEdit={(activity) => { setEditing(activity); setManualOpen(true); }} onDelete={setDeleting} /><ActivityFormSheet open={manualOpen} kind="sleep" dateKey="today" activity={editing} onClose={() => { setManualOpen(false); setEditing(undefined); }} onSave={save} /><ConfirmDeleteDialog open={Boolean(deleting)} title={deleting?.title ?? "sleep"} onCancel={() => setDeleting(undefined)} onConfirm={remove} /><Toast message={toast} /></div>;
}

function DailySleepTimeline({ entries }: { entries: Activity[] }) { return <section className="daily-sleep"><header><p>Today&apos;s sleep</p><span>00:00 <i /> 12:00 <i /> 24:00</span></header><div className="daily-sleep__track">{entries.map((entry) => { const start = timeToMinutes(entry.time); const duration = Number(entry.value.match(/(\d+)h/)?.[1] ?? 0) * 60 + Number(entry.value.match(/(\d+)\s*(?:m|min)/)?.[1] ?? 0); return <div key={entry.id} title={`${entry.time} · ${entry.value}`} style={{ left: `${(start / 1440) * 100}%`, width: `${Math.max(4, (duration / 1440) * 100)}%` }} />; })}</div></section>; }

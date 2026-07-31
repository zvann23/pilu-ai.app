"use client";

import { ActivitySummaryCard } from "@/components/home/activity-summary-card";
import { AskPiluCard } from "@/components/home/ask-pilu-card";
import { FloatingAddButton } from "@/components/home/floating-add-button";
import { HomeGreeting } from "@/components/home/home-greeting";
import { InsightCard } from "@/components/home/insight-card";
import { LatestReportHomeCard } from "@/components/home/latest-report-home-card";
import { NextMilestoneCard } from "@/components/home/next-milestone-card";
import { CareItemHomeCard } from "@/components/home/care-item-home-card";
import { RecentMemoryHomeCard } from "@/components/home/recent-memory-home-card";
import { QuickAddBottomSheet } from "@/components/home/quick-add-bottom-sheet";
import { QuickAddGrid } from "@/components/home/quick-add-grid";
import { RecentActivityList } from "@/components/home/recent-activity-list";
import { TodaysRemindersCard } from "@/components/home/todays-reminders-card";
import { UpcomingRemindersCard } from "@/components/home/upcoming-reminders-card";
import { useActivities } from "@/components/activity/activity-provider";
import { ActivityFormSheet } from "@/components/timeline/activity-form-sheet";
import { Toast } from "@/components/timeline/toast";
import { getHomeActivitySummaries } from "@/lib/home-data";
import type { ActivityDraft, ActivityKind } from "@/types/activity";
import { useRef, useState } from "react";

export function HomeDashboard() {
  const { addActivity, activities } = useActivities();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [formKind, setFormKind] = useState<ActivityKind | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeout = useRef<number | undefined>(undefined);

  function openForm(kind: ActivityKind) { setQuickAddOpen(false); setFormKind(kind); }
  function saveActivity(activity: ActivityDraft) { addActivity(activity); setFormKind(null); setToast("Activity added to Timeline"); window.clearTimeout(toastTimeout.current); toastTimeout.current = window.setTimeout(() => setToast(null), 3200); }

  return (
    <div className="home-dashboard">
      <HomeGreeting />
      <section className="activity-summary-grid" aria-label="Latest baby activity">
        {getHomeActivitySummaries(activities).map((activity) => <ActivitySummaryCard key={activity.label} activity={activity} />)}
      </section>
      <AskPiluCard />
      <InsightCard />
      <LatestReportHomeCard />
      <TodaysRemindersCard />
      <UpcomingRemindersCard />
      <NextMilestoneCard />
      <CareItemHomeCard />
      <RecentMemoryHomeCard />
      <QuickAddGrid onOpen={() => setQuickAddOpen(true)} />
      <RecentActivityList />
      <FloatingAddButton onClick={() => setQuickAddOpen(true)} />
      <QuickAddBottomSheet open={quickAddOpen} onClose={() => setQuickAddOpen(false)} onSelect={openForm} />
      <ActivityFormSheet open={Boolean(formKind)} kind={formKind} dateKey="today" onClose={() => setFormKind(null)} onSave={saveActivity} />
      <Toast message={toast} />
    </div>
  );
}

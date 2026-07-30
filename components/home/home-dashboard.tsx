"use client";

import { ActivitySummaryCard } from "@/components/home/activity-summary-card";
import { AskPiluCard } from "@/components/home/ask-pilu-card";
import { FloatingAddButton } from "@/components/home/floating-add-button";
import { HomeGreeting } from "@/components/home/home-greeting";
import { InsightCard } from "@/components/home/insight-card";
import { QuickAddBottomSheet } from "@/components/home/quick-add-bottom-sheet";
import { QuickAddGrid } from "@/components/home/quick-add-grid";
import { RecentActivityList } from "@/components/home/recent-activity-list";
import { activitySummaries } from "@/lib/home-data";
import { useState } from "react";

export function HomeDashboard() {
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  return (
    <div className="home-dashboard">
      <HomeGreeting />
      <section className="activity-summary-grid" aria-label="Latest baby activity">
        {activitySummaries.map((activity) => <ActivitySummaryCard key={activity.label} activity={activity} />)}
      </section>
      <AskPiluCard />
      <InsightCard />
      <QuickAddGrid onOpen={() => setQuickAddOpen(true)} />
      <RecentActivityList />
      <FloatingAddButton onClick={() => setQuickAddOpen(true)} />
      <QuickAddBottomSheet open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </div>
  );
}

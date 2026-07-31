"use client";

import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import type { ActivityDateKey } from "@/types/activity";
import { DateNavigator } from "./date-navigator";

export function TimelineHeader({ dateKey, onDateChange }: { dateKey: ActivityDateKey; onDateChange: (value: ActivityDateKey) => void }) {
  const { profile } = useBabyProfile();
  return <header className="timeline-header"><div><p>{profile.preferredName}&apos;s daily activity</p><h1>Timeline</h1></div><DateNavigator dateKey={dateKey} onChange={onDateChange} /></header>;
}

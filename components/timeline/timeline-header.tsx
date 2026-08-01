"use client";

import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { format, useLocale } from "@/components/i18n/locale-provider";
import type { ActivityDateKey } from "@/types/activity";
import { DateNavigator } from "./date-navigator";

export function TimelineHeader({ dateKey, onDateChange }: { dateKey: ActivityDateKey; onDateChange: (value: ActivityDateKey) => void }) {
  const { profile } = useBabyProfile();
  const { t } = useLocale();
  const dict = t((d) => d.timeline.header);
  return <header className="timeline-header"><div><p>{format(dict.subtitleTemplate, { name: profile.preferredName })}</p><h1>{dict.title}</h1></div><DateNavigator dateKey={dateKey} onChange={onDateChange} /></header>;
}

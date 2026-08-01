"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import type { ActivityDateKey } from "@/types/activity";

export function DateNavigator({ dateKey, onChange }: { dateKey: ActivityDateKey; onChange: (value: ActivityDateKey) => void }) {
  const { t } = useLocale();
  const dict = t((d) => d.timeline.dateNavigator);
  const labels: Record<ActivityDateKey, string> = { previous: dict.yesterdayLabel, today: dict.todayLabel, next: dict.tomorrowLabel };
  const previous: Record<ActivityDateKey, ActivityDateKey> = { previous: "previous", today: "previous", next: "today" };
  const next: Record<ActivityDateKey, ActivityDateKey> = { previous: "today", today: "next", next: "next" };
  return <div className="date-navigator"><button type="button" className="icon-button icon-button--soft" aria-label={dict.previousDay} onClick={() => onChange(previous[dateKey])}><ChevronLeft size={21} aria-hidden="true" /></button><span>{labels[dateKey]}</span><button type="button" className="icon-button icon-button--soft" aria-label={dict.nextDay} onClick={() => onChange(next[dateKey])}><ChevronRight size={21} aria-hidden="true" /></button><button type="button" className="icon-button icon-button--soft date-navigator__calendar" aria-label={dict.calendarComingSoon} title={dict.calendarComingSoon}><CalendarDays size={19} aria-hidden="true" /></button></div>;
}

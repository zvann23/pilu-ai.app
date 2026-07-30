import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import type { ActivityDateKey } from "@/types/activity";

const labels: Record<ActivityDateKey, string> = { previous: "Yesterday, 11 May", today: "Today, 12 May", next: "Tomorrow, 13 May" };
export function DateNavigator({ dateKey, onChange }: { dateKey: ActivityDateKey; onChange: (value: ActivityDateKey) => void }) {
  const previous: Record<ActivityDateKey, ActivityDateKey> = { previous: "previous", today: "previous", next: "today" };
  const next: Record<ActivityDateKey, ActivityDateKey> = { previous: "today", today: "next", next: "next" };
  return <div className="date-navigator"><button type="button" className="icon-button icon-button--soft" aria-label="Previous day" onClick={() => onChange(previous[dateKey])}><ChevronLeft size={21} aria-hidden="true" /></button><span>{labels[dateKey]}</span><button type="button" className="icon-button icon-button--soft" aria-label="Next day" onClick={() => onChange(next[dateKey])}><ChevronRight size={21} aria-hidden="true" /></button><button type="button" className="icon-button icon-button--soft date-navigator__calendar" aria-label="Calendar placeholder" title="Calendar coming soon"><CalendarDays size={19} aria-hidden="true" /></button></div>;
}

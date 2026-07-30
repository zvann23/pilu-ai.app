import type { ActivityDateKey } from "@/types/activity";
import { DateNavigator } from "./date-navigator";

export function TimelineHeader({ dateKey, onDateChange }: { dateKey: ActivityDateKey; onDateChange: (value: ActivityDateKey) => void }) {
  return <header className="timeline-header"><div><p>Emma&apos;s daily activity</p><h1>Timeline</h1></div><DateNavigator dateKey={dateKey} onChange={onDateChange} /></header>;
}

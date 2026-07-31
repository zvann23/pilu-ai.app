import type { NotificationCategory } from "@/types/notifications";
import { Award, Bell, CalendarClock, HeartPulse, Images, Milk, Moon, Pill, ShieldCheck, Sparkles, Users } from "lucide-react";

const icons: Record<NotificationCategory, typeof Bell> = {
  feeding_reminder: Milk,
  sleep_reminder: Moon,
  medicine_reminder: Pill,
  vaccine_reminder: ShieldCheck,
  growth_reminder: HeartPulse,
  memory_of_day: Images,
  weekly_report_ready: Sparkles,
  family_activity: Users,
  elite_updates: Sparkles,
  daily_summary: CalendarClock,
  weekly_summary: CalendarClock,
  custom_reminder: Bell,
};

export function NotificationIcon({ category, size = 18 }: { category: NotificationCategory; size?: number }) {
  const Icon = icons[category] ?? Award;
  return <Icon size={size} aria-hidden="true" />;
}

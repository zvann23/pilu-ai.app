"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { useReminders } from "@/hooks/use-reminders";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { intlLocaleTags, type Locale } from "@/lib/i18n/locales";
import { todayDateKey } from "@/lib/notifications-data";
import { reminderTypeLabels } from "@/types/notifications";
import { CalendarClock } from "lucide-react";
import Link from "next/link";

function formatDue(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocaleTags[locale], { day: "numeric", month: "short" }).format(new Date(iso));
}

export function UpcomingRemindersCard() {
  const { userId } = useSupabaseUser();
  const { reminders } = useReminders(userId);
  const { locale, t } = useLocale();
  const dict = t((d) => d.home.remindersCard);
  const today = todayDateKey();
  const upcoming = reminders.filter((reminder) => !reminder.completedAt && reminder.dueAt.slice(0, 10) > today).slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <section className="reminders-home-card">
      <div className="reminders-home-card__heading"><CalendarClock size={18} aria-hidden="true" /><h2>{dict.upcomingHeading}</h2></div>
      <ul>
        {upcoming.map((reminder) => (
          <li key={reminder.id}><span>{formatDue(reminder.dueAt, locale)}</span>{reminder.title}<em>{reminderTypeLabels[reminder.reminderType]}</em></li>
        ))}
      </ul>
      <Link href="/notifications">{dict.button}</Link>
    </section>
  );
}

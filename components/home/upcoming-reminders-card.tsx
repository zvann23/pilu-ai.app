"use client";

import { useReminders } from "@/hooks/use-reminders";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { todayDateKey } from "@/lib/notifications-data";
import { reminderTypeLabels } from "@/types/notifications";
import { CalendarClock } from "lucide-react";
import Link from "next/link";

function formatDue(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(iso));
}

export function UpcomingRemindersCard() {
  const { userId } = useSupabaseUser();
  const { reminders } = useReminders(userId);
  const today = todayDateKey();
  const upcoming = reminders.filter((reminder) => !reminder.completedAt && reminder.dueAt.slice(0, 10) > today).slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <section className="reminders-home-card">
      <div className="reminders-home-card__heading"><CalendarClock size={18} aria-hidden="true" /><h2>Upcoming reminders</h2></div>
      <ul>
        {upcoming.map((reminder) => (
          <li key={reminder.id}><span>{formatDue(reminder.dueAt)}</span>{reminder.title}<em>{reminderTypeLabels[reminder.reminderType]}</em></li>
        ))}
      </ul>
      <Link href="/notifications">Manage reminders</Link>
    </section>
  );
}

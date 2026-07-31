"use client";

import { useReminders } from "@/hooks/use-reminders";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { todayDateKey } from "@/lib/notifications-data";
import { reminderTypeLabels } from "@/types/notifications";
import { CalendarCheck } from "lucide-react";
import Link from "next/link";

export function TodaysRemindersCard() {
  const { userId } = useSupabaseUser();
  const { reminders } = useReminders(userId);
  const today = todayDateKey();
  const todays = reminders.filter((reminder) => !reminder.completedAt && reminder.dueAt.slice(0, 10) === today);

  if (todays.length === 0) return null;

  return (
    <section className="reminders-home-card">
      <div className="reminders-home-card__heading"><CalendarCheck size={18} aria-hidden="true" /><h2>Today&apos;s reminders</h2></div>
      <ul>
        {todays.slice(0, 3).map((reminder) => (
          <li key={reminder.id}><span>{reminderTypeLabels[reminder.reminderType]}</span>{reminder.title}</li>
        ))}
      </ul>
      <Link href="/notifications">Manage reminders</Link>
    </section>
  );
}

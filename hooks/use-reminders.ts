"use client";

import { createReminder, deleteReminder, listReminders, updateReminder } from "@/lib/supabase/notification-repository";
import type { Recurrence, Reminder, ReminderType } from "@/types/notifications";
import { useCallback, useEffect, useState } from "react";

function advanceDueDate(dueAt: string, recurrence: Recurrence): string {
  const date = new Date(dueAt);
  if (recurrence === "daily") date.setDate(date.getDate() + 1);
  else if (recurrence === "weekly") date.setDate(date.getDate() + 7);
  else if (recurrence === "monthly") date.setMonth(date.getMonth() + 1);
  return date.toISOString();
}

export function useReminders(userId: string | null) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    if (!userId) return;
    listReminders(userId)
      .then(setReminders)
      .catch(() => setError("Could not load reminders."));
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    listReminders(userId)
      .then(setReminders)
      .catch(() => setError("Could not load reminders."))
      .finally(() => setIsLoading(false));
  }, [userId]);

  const create = useCallback(
    async (draft: { title: string; reminderType: ReminderType; recurrence: Recurrence; dueAt: string; isPrivate: boolean; notes?: string; familyId?: string | null }) => {
      if (!userId) return;
      try {
        await createReminder(userId, draft);
        refresh();
      } catch {
        setError("Could not save this reminder.");
      }
    },
    [userId, refresh],
  );

  /** For a recurring reminder, marking it done rolls it forward instead of removing it. */
  const complete = useCallback(
    async (reminder: Reminder) => {
      try {
        if (reminder.recurrence === "once") {
          await updateReminder(reminder.id, { completedAt: new Date().toISOString() });
        } else {
          await updateReminder(reminder.id, { dueAt: advanceDueDate(reminder.dueAt, reminder.recurrence), completedAt: new Date().toISOString() });
        }
        refresh();
      } catch {
        setError("Could not update this reminder.");
      }
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await deleteReminder(id);
        refresh();
      } catch {
        setError("Could not delete this reminder.");
      }
    },
    [refresh],
  );

  return { reminders, isLoading: userId ? isLoading : false, error, create, complete, remove, refresh };
}

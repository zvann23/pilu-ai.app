"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { intlLocaleTags } from "@/lib/i18n/locales";
import type { Reminder } from "@/types/notifications";
import { Check, Trash2 } from "lucide-react";

export function ReminderList({ reminders, onComplete, onDelete }: { reminders: Reminder[]; onComplete: (reminder: Reminder) => void; onDelete: (id: string) => void }) {
  const { t, locale } = useLocale();
  const nd = t((d) => d.notifications);

  function formatDue(iso: string) {
    return new Intl.DateTimeFormat(intlLocaleTags[locale], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
  }

  if (reminders.length === 0) {
    return <p className="family-activity-feed__empty">{nd.reminders.emptyList}</p>;
  }

  return (
    <ul className="reminder-list">
      {reminders.map((reminder) => (
        <li key={reminder.id} className="reminder-card">
          <div>
            <p>{reminder.title}</p>
            <span>{nd.reminders.typeLabels[reminder.reminderType]} · {formatDue(reminder.dueAt)}{reminder.recurrence !== "once" ? ` · ${nd.reminders.recurrenceLabels[reminder.recurrence]}` : ""}{!reminder.isPrivate ? nd.reminders.sharedSuffix : ""}</span>
          </div>
          <div className="reminder-card__actions">
            <button type="button" className="icon-button icon-button--soft" aria-label={nd.reminders.markDoneAriaTemplate.replace("{title}", reminder.title)} onClick={() => onComplete(reminder)}><Check size={16} aria-hidden="true" /></button>
            <button type="button" className="icon-button icon-button--soft" aria-label={nd.reminders.deleteAriaTemplate.replace("{title}", reminder.title)} onClick={() => onDelete(reminder.id)}><Trash2 size={16} aria-hidden="true" /></button>
          </div>
        </li>
      ))}
    </ul>
  );
}

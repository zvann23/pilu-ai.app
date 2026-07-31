"use client";

import { reminderTypeLabels, type Reminder } from "@/types/notifications";
import { Check, Trash2 } from "lucide-react";

function formatDue(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export function ReminderList({ reminders, onComplete, onDelete }: { reminders: Reminder[]; onComplete: (reminder: Reminder) => void; onDelete: (id: string) => void }) {
  if (reminders.length === 0) {
    return <p className="family-activity-feed__empty">No reminders yet.</p>;
  }

  return (
    <ul className="reminder-list">
      {reminders.map((reminder) => (
        <li key={reminder.id} className="reminder-card">
          <div>
            <p>{reminder.title}</p>
            <span>{reminderTypeLabels[reminder.reminderType]} · {formatDue(reminder.dueAt)}{reminder.recurrence !== "once" ? ` · ${reminder.recurrence}` : ""}{!reminder.isPrivate ? " · Shared" : ""}</span>
          </div>
          <div className="reminder-card__actions">
            <button type="button" className="icon-button icon-button--soft" aria-label={`Mark ${reminder.title} done`} onClick={() => onComplete(reminder)}><Check size={16} aria-hidden="true" /></button>
            <button type="button" className="icon-button icon-button--soft" aria-label={`Delete ${reminder.title}`} onClick={() => onDelete(reminder.id)}><Trash2 size={16} aria-hidden="true" /></button>
          </div>
        </li>
      ))}
    </ul>
  );
}

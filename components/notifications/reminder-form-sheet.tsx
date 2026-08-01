"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { recurrenceOptions, reminderTypes, type Recurrence, type ReminderType } from "@/types/notifications";
import { X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

export function ReminderFormSheet({
  open, canShareWithFamily, onClose, onSave,
}: {
  open: boolean;
  canShareWithFamily: boolean;
  onClose: () => void;
  onSave: (draft: { title: string; reminderType: ReminderType; recurrence: Recurrence; dueAt: string; isPrivate: boolean; notes?: string }) => void;
}) {
  const { t } = useLocale();
  const nd = t((d) => d.notifications);
  const [title, setTitle] = useState("");
  const [reminderType, setReminderType] = useState<ReminderType>("custom");
  const [recurrence, setRecurrence] = useState<Recurrence>("once");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [isPrivate, setIsPrivate] = useState(true);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !date) return;
    onSave({ title: title.trim(), reminderType, recurrence, dueAt: new Date(`${date}T${time}`).toISOString(), isPrivate });
    setTitle("");
    setDate("");
  }

  return (
    <div className="bottom-sheet-layer bottom-sheet-layer--open">
      <button className="bottom-sheet-overlay" type="button" onClick={onClose} aria-label={nd.reminderForm.closeSheetAria} />
      <section className="reminder-sheet" role="dialog" aria-modal="true" aria-labelledby="reminder-sheet-title">
        <div className="invite-sheet__top">
          <span aria-hidden="true" />
          <h2 id="reminder-sheet-title">{nd.reminderForm.heading}</h2>
          <button ref={closeButton} type="button" className="icon-button icon-button--soft" onClick={onClose} aria-label={nd.reminderForm.closeAria}><X size={20} aria-hidden="true" /></button>
        </div>
        <form onSubmit={submit}>
          <label>{nd.reminderForm.titleLabel}<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={nd.reminderForm.titlePlaceholder} maxLength={160} required /></label>
          <label>{nd.reminderForm.typeLabel}
            <select value={reminderType} onChange={(event) => setReminderType(event.target.value as ReminderType)}>
              {reminderTypes.map((type) => <option key={type} value={type}>{nd.reminders.typeLabels[type]}</option>)}
            </select>
          </label>
          <div className="reminder-sheet__row">
            <label>{nd.reminderForm.dateLabel}<input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label>
            <label>{nd.reminderForm.timeLabel}<input type="time" value={time} onChange={(event) => setTime(event.target.value)} required /></label>
          </div>
          <label>{nd.reminderForm.repeatsLabel}
            <select value={recurrence} onChange={(event) => setRecurrence(event.target.value as Recurrence)}>
              {recurrenceOptions.map((option) => <option key={option} value={option}>{nd.reminders.recurrenceLabels[option]}</option>)}
            </select>
          </label>
          {canShareWithFamily && (
            <label className="notification-toggle">
              <div><p>{nd.reminderForm.shareWithFamilyLabel}</p><span>{nd.reminderForm.shareWithFamilyDescription}</span></div>
              <input type="checkbox" role="switch" checked={!isPrivate} onChange={(event) => setIsPrivate(!event.target.checked)} />
            </label>
          )}
          <button type="submit" className="button button--primary">{nd.reminderForm.saveReminder}</button>
        </form>
      </section>
    </div>
  );
}

"use client";

import { recurrenceOptions, recurrenceLabels, reminderTypes, reminderTypeLabels, type Recurrence, type ReminderType } from "@/types/notifications";
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
      <button className="bottom-sheet-overlay" type="button" onClick={onClose} aria-label="Close reminder form" />
      <section className="reminder-sheet" role="dialog" aria-modal="true" aria-labelledby="reminder-sheet-title">
        <div className="invite-sheet__top">
          <span aria-hidden="true" />
          <h2 id="reminder-sheet-title">New reminder</h2>
          <button ref={closeButton} type="button" className="icon-button icon-button--soft" onClick={onClose} aria-label="Close"><X size={20} aria-hidden="true" /></button>
        </div>
        <form onSubmit={submit}>
          <label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Next vaccine" maxLength={160} required /></label>
          <label>Type
            <select value={reminderType} onChange={(event) => setReminderType(event.target.value as ReminderType)}>
              {reminderTypes.map((type) => <option key={type} value={type}>{reminderTypeLabels[type]}</option>)}
            </select>
          </label>
          <div className="reminder-sheet__row">
            <label>Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label>
            <label>Time<input type="time" value={time} onChange={(event) => setTime(event.target.value)} required /></label>
          </div>
          <label>Repeats
            <select value={recurrence} onChange={(event) => setRecurrence(event.target.value as Recurrence)}>
              {recurrenceOptions.map((option) => <option key={option} value={option}>{recurrenceLabels[option]}</option>)}
            </select>
          </label>
          {canShareWithFamily && (
            <label className="notification-toggle">
              <div><p>Share with family</p><span>Other active family members will be able to see this reminder.</span></div>
              <input type="checkbox" role="switch" checked={!isPrivate} onChange={(event) => setIsPrivate(!event.target.checked)} />
            </label>
          )}
          <button type="submit" className="button button--primary">Save reminder</button>
        </form>
      </section>
    </div>
  );
}

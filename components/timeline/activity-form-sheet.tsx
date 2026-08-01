"use client";

import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { format, useLocale } from "@/components/i18n/locale-provider";
import type { Activity, ActivityDateKey, ActivityDraft, ActivityKind } from "@/types/activity";
import { ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";

type FormValues = Record<string, string>;

function defaults(kind: ActivityKind, activity?: Activity): FormValues {
  const amount = activity?.value.replace(/[^0-9.]/g, "") ?? "";
  return {
    time: activity?.time ?? "18:00", note: activity?.note ?? "", amount, feedingType: activity?.secondary ?? "Bottle", side: activity?.secondary ?? "Both", duration: amount,
    sleepType: activity?.secondary ?? "Nap", diaperType: activity?.value ?? "Wet", temperature: amount, method: activity?.secondary ?? "Underarm", medicine: activity?.value ?? "", dose: activity?.secondary ?? "",
    weight: amount, title: activity?.value ?? "", image: "", kind,
  };
}

export function ActivityFormSheet({ open, kind, dateKey, activity, onClose, onSave }: { open: boolean; kind: ActivityKind | null; dateKey: ActivityDateKey; activity?: Activity; onClose: () => void; onSave: (activity: ActivityDraft) => void }) {
  const { t } = useLocale();
  const formDict = t((d) => d.timeline.form);
  const activityKinds = t((d) => d.activity.kinds);
  const closeButton = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<number | null>(null);
  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = originalOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [open, onClose]);
  if (!kind) return null;
  const label = activityKinds[kind];
  const sheetTitle = format(activity ? formDict.editTitleTemplate : formDict.addTitleTemplate, { label });
  return <div className={`activity-form-layer${open ? " activity-form-layer--open" : ""}`} aria-hidden={!open} inert={!open}><button className="bottom-sheet-overlay" type="button" tabIndex={open ? 0 : -1} aria-label={formDict.closeLabel} onClick={onClose} /><section className="activity-form-sheet" role="dialog" aria-modal="true" aria-label={sheetTitle} onPointerDown={(event: PointerEvent<HTMLElement>) => { if (event.pointerType === "touch") swipeStart.current = event.clientY; }} onPointerUp={(event: PointerEvent<HTMLElement>) => { if (swipeStart.current !== null && event.clientY - swipeStart.current > 76) onClose(); swipeStart.current = null; }}><div className="activity-form-sheet__top"><span aria-hidden="true" /><h2>{sheetTitle}</h2><button ref={closeButton} type="button" className="icon-button icon-button--soft" onClick={onClose} aria-label={formDict.closeLabel}><X size={20} aria-hidden="true" /></button></div><ActivityForm key={activity?.id ?? kind} kind={kind} dateKey={dateKey} activity={activity} onCancel={onClose} onSave={onSave} /></section></div>;
}

function ActivityForm({ kind, dateKey, activity, onCancel, onSave }: { kind: ActivityKind; dateKey: ActivityDateKey; activity?: Activity; onCancel: () => void; onSave: (activity: ActivityDraft) => void }) {
  const { profile } = useBabyProfile();
  const { t } = useLocale();
  const formDict = t((d) => d.timeline.form);
  const activityKinds = t((d) => d.activity.kinds);
  const [values, setValues] = useState(() => defaults(kind, activity));
  const [error, setError] = useState<string | null>(null);
  const label = activityKinds[kind];
  const update = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }));
  const field = (name: string, fieldLabel: string, props: { type?: string; placeholder?: string; step?: string } = {}) => <label className="activity-form__field"><span>{fieldLabel}</span><input name={name} type={props.type ?? "text"} value={values[name]} placeholder={props.placeholder} step={props.step} onChange={(event) => update(name, event.target.value)} /></label>;
  const select = (name: string, fieldLabel: string, options: string[]) => <label className="activity-form__field"><span>{fieldLabel}</span><select value={values[name]} onChange={(event) => update(name, event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const required = kind === "memory" ? ["title"] : kind === "medicine" ? ["medicine", "dose"] : kind === "temperature" ? ["temperature"] : kind === "weight" ? ["weight"] : kind === "diaper" ? ["diaperType"] : kind === "sleep" || kind === "breastfeeding" ? ["duration"] : ["amount"];
    if (required.some((name) => !values[name]?.trim())) { setError(formDict.validationError); return; }
    const base = { time: values.time, dateKey, note: values.note.trim() || undefined };
    const draft: ActivityDraft = kind === "feeding" || kind === "bottle" ? { ...base, kind, title: "Feeding", value: `${values.amount} ml`, secondary: values.feedingType } : kind === "breastfeeding" ? { ...base, kind, title: "Breastfeeding", value: `${values.duration} min`, secondary: values.side } : kind === "sleep" ? { ...base, kind, title: "Sleep", value: `${values.duration} min`, secondary: values.sleepType } : kind === "diaper" ? { ...base, kind, title: "Diaper", value: values.diaperType } : kind === "temperature" ? { ...base, kind, title: "Temperature", value: `${values.temperature}°C`, secondary: values.method } : kind === "medicine" ? { ...base, kind, title: "Medicine", value: values.medicine, secondary: values.dose } : kind === "weight" ? { ...base, kind, title: "Weight", value: `${values.weight} kg` } : { ...base, kind, title: "Memory", value: values.title };
    onSave(draft);
  }
  return <form className="activity-form" onSubmit={submit}><p className="activity-form__intro">{format(formDict.introTemplate, { name: profile.preferredName })}</p><div className="activity-form__grid">{field("time", kind === "weight" ? formDict.dateTimeLabel : kind === "sleep" ? formDict.startTimeLabel : formDict.timeLabel, { type: "time" })}{(kind === "feeding" || kind === "bottle") ? <>{field("amount", formDict.amountLabel, { type: "number", placeholder: "120" })}{select("feedingType", formDict.feedingTypeLabel, ["Bottle", "Formula", "Expressed milk"])}</> : null}{kind === "breastfeeding" ? <>{select("side", formDict.sideLabel, ["Left", "Right", "Both"])}{field("duration", formDict.durationLabel, { type: "number", placeholder: "20" })}</> : null}{kind === "sleep" ? <>{field("duration", formDict.durationLabel, { type: "number", placeholder: "45" })}{select("sleepType", formDict.sleepTypeLabel, ["Nap", "Nighttime sleep"])}</> : null}{kind === "diaper" ? select("diaperType", formDict.diaperLabel, ["Wet", "Dirty", "Both"]) : null}{kind === "temperature" ? <>{field("temperature", formDict.temperatureLabel, { type: "number", step: "0.1", placeholder: "36.8" })}{select("method", formDict.methodLabel, ["Underarm", "Ear", "Forehead", "Rectal"])}</> : null}{kind === "medicine" ? <>{field("medicine", formDict.medicineNameLabel, { placeholder: formDict.medicineNamePlaceholder })}{field("dose", formDict.doseLabel, { placeholder: formDict.dosePlaceholder })}</> : null}{kind === "weight" ? field("weight", formDict.weightLabel, { type: "number", step: "0.01", placeholder: "5.42" }) : null}{kind === "memory" ? <><label className="activity-form__field activity-form__field--full"><span>{formDict.titleLabel}</span><input value={values.title} placeholder={formDict.titlePlaceholder} onChange={(event) => update("title", event.target.value)} /></label><button className="image-placeholder" type="button"><ImagePlus size={19} aria-hidden="true" />{formDict.imageUploadComingSoon}</button></> : null}<label className="activity-form__field activity-form__field--full"><span>{formDict.noteLabel} <em>{formDict.noteOptional}</em></span><textarea value={values.note} placeholder={formDict.notePlaceholder} rows={3} onChange={(event) => update("note", event.target.value)} /></label></div>{error ? <p className="activity-form__error" role="alert">{error}</p> : null}<div className="activity-form__actions"><button type="button" className="button button--secondary" onClick={onCancel}>{formDict.cancel}</button><button type="submit" className="button button--primary">{format(formDict.saveTemplate, { label })}</button></div></form>;
}

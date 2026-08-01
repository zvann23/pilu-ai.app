"use client";

import { format, useLocale } from "@/components/i18n/locale-provider";
import { useEffect, useRef } from "react";

export function ConfirmDeleteDialog({ open, title, onCancel, onConfirm }: { open: boolean; title: string; onCancel: () => void; onConfirm: () => void }) {
  const { t } = useLocale();
  const dict = t((d) => d.timeline.deleteDialog);
  const cancelButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    cancelButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);
  if (!open) return null;
  return <div className="dialog-layer" role="presentation"><button className="dialog-layer__overlay" type="button" onClick={onCancel} aria-label="Close delete confirmation" /><section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title"><p>{dict.eyebrow}</p><h2 id="delete-dialog-title">{format(dict.titleTemplate, { title })}</h2><span>{dict.body}</span><div><button ref={cancelButton} type="button" className="button button--secondary" onClick={onCancel}>{dict.keep}</button><button type="button" className="button button--danger" onClick={onConfirm}>{dict.deleteButton}</button></div></section></div>;
}

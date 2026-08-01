"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { useEffect, useRef } from "react";

export function ConfirmDialog({
  open, eyebrow, title, message, confirmLabel, danger, onCancel, onConfirm,
}: {
  open: boolean;
  eyebrow: string;
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useLocale();
  const fd = t((d) => d.family);
  const cancelButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="dialog-layer" role="presentation">
      <button className="dialog-layer__overlay" type="button" onClick={onCancel} aria-label={fd.confirmDialog.closeConfirmationAriaTemplate.replace("{title}", title)} />
      <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="family-confirm-dialog-title">
        <p>{eyebrow}</p>
        <h2 id="family-confirm-dialog-title">{title}</h2>
        <span>{message}</span>
        <div>
          <button ref={cancelButton} type="button" className="button button--secondary" onClick={onCancel}>{fd.confirmDialog.cancel}</button>
          <button type="button" className={danger ? "button button--danger" : "button button--primary"} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { useEffect, useRef, useState } from "react";

const CONFIRM_WORD = "DELETE";

export function DeleteAccountDialog({
  open, isDeleting, error, onCancel, onConfirm,
}: {
  open: boolean;
  isDeleting: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useLocale();
  const [typedWord, setTypedWord] = useState("");
  const cancelButton = useRef<HTMLButtonElement>(null);

  function handleCancel() {
    setTypedWord("");
    onCancel();
  }

  useEffect(() => {
    if (!open) return;
    cancelButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleCancel is stable enough for this dialog's lifetime
  }, [open]);

  if (!open) return null;

  const canConfirm = typedWord.trim() === CONFIRM_WORD && !isDeleting;
  const [confirmLabelBefore, confirmLabelAfter] = t((d) => d.settings.deleteDialog.typedConfirmLabel).split("{word}");

  return (
    <div className="dialog-layer" role="presentation">
      <button className="dialog-layer__overlay" type="button" onClick={handleCancel} aria-label="Close delete account confirmation" />
      <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-account-dialog-title">
        <p>{t((d) => d.settings.deleteDialog.eyebrow)}</p>
        <h2 id="delete-account-dialog-title">{t((d) => d.settings.deleteDialog.title)}</h2>
        <span>{t((d) => d.settings.deleteDialog.body1)}</span>
        <span>
          <strong>{t((d) => d.settings.deleteDialog.body2Strong)}</strong> {t((d) => d.settings.deleteDialog.body2Rest)}
        </span>
        <label className="confirm-dialog__typed-confirm">
          {confirmLabelBefore}<strong>{CONFIRM_WORD}</strong>{confirmLabelAfter}
          <input
            type="text"
            value={typedWord}
            onChange={(event) => setTypedWord(event.target.value)}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={isDeleting}
          />
        </label>
        {error ? <p className="activity-form__error">{error}</p> : null}
        <div>
          <button ref={cancelButton} type="button" className="button button--secondary" onClick={handleCancel} disabled={isDeleting}>
            {t((d) => d.settings.deleteDialog.cancel)}
          </button>
          <button type="button" className="button button--danger" onClick={onConfirm} disabled={!canConfirm}>
            {isDeleting ? t((d) => d.settings.deleteDialog.confirmButtonLoading) : t((d) => d.settings.deleteDialog.confirmButton)}
          </button>
        </div>
      </section>
    </div>
  );
}

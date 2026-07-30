"use client";

import { useEffect, useRef } from "react";

export function ConfirmDeleteDialog({ open, title, onCancel, onConfirm }: { open: boolean; title: string; onCancel: () => void; onConfirm: () => void }) {
  const cancelButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    cancelButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);
  if (!open) return null;
  return <div className="dialog-layer" role="presentation"><button className="dialog-layer__overlay" type="button" onClick={onCancel} aria-label="Close delete confirmation" /><section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title"><p>Remove activity</p><h2 id="delete-dialog-title">Delete {title}?</h2><span>This only removes it from this local session.</span><div><button ref={cancelButton} type="button" className="button button--secondary" onClick={onCancel}>Keep activity</button><button type="button" className="button button--danger" onClick={onConfirm}>Delete</button></div></section></div>;
}

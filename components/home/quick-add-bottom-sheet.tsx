"use client";

import { quickAddOptions } from "@/lib/home-data";
import type { ActivityKind } from "@/types/activity";
import { X } from "lucide-react";
import { useEffect, useRef, type PointerEvent } from "react";

export function QuickAddBottomSheet({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (kind: ActivityKind) => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = originalOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [open, onClose]);

  function closeSheet() { onClose(); }
  function handlePointerDown(event: PointerEvent<HTMLElement>) { if (event.pointerType === "touch") swipeStart.current = event.clientY; }
  function handlePointerUp(event: PointerEvent<HTMLElement>) { if (swipeStart.current !== null && event.clientY - swipeStart.current > 76) closeSheet(); swipeStart.current = null; }

  return (
    <div className={`bottom-sheet-layer${open ? " bottom-sheet-layer--open" : ""}`} aria-hidden={!open} inert={!open}>
      <button className="bottom-sheet-overlay" type="button" tabIndex={open ? 0 : -1} aria-label="Close quick add" onClick={closeSheet} />
      <section className="quick-add-sheet" role="dialog" aria-modal="true" aria-label="Quick add activity" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
        <div className="quick-add-sheet__top"><span aria-hidden="true" /><h2>Quick add</h2><button ref={closeButtonRef} className="icon-button icon-button--soft" type="button" onClick={closeSheet} aria-label="Close quick add"><X size={21} aria-hidden="true" /></button></div>
        <div className="quick-add-sheet__grid">
          {quickAddOptions.map((option) => { const Icon = option.icon; return <button key={option.label} type="button" onClick={() => onSelect(option.kind!)}><Icon size={21} aria-hidden="true" /><span>{option.label}</span></button>; })}
        </div>
      </section>
    </div>
  );
}

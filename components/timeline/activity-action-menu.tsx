"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ActivityActionMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const { t } = useLocale();
  const dict = t((d) => d.timeline.actionMenu);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => { if (!menu.current?.contains(event.target as Node)) setOpen(false); };
    if (open) document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);
  return <div className="activity-action-menu" ref={menu}><button type="button" className="icon-button activity-action-menu__trigger" aria-label={dict.label} aria-expanded={open} onClick={() => setOpen((value) => !value)}><MoreHorizontal size={19} aria-hidden="true" /></button>{open ? <div className="activity-action-menu__list"><button type="button" onClick={() => { setOpen(false); onEdit(); }}><Pencil size={16} aria-hidden="true" />{dict.edit}</button><button type="button" onClick={() => { setOpen(false); onDelete(); }}><Trash2 size={16} aria-hidden="true" />{dict.delete}</button></div> : null}</div>;
}

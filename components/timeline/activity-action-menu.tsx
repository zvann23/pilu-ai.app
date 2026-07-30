"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ActivityActionMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => { if (!menu.current?.contains(event.target as Node)) setOpen(false); };
    if (open) document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);
  return <div className="activity-action-menu" ref={menu}><button type="button" className="icon-button activity-action-menu__trigger" aria-label="Activity actions" aria-expanded={open} onClick={() => setOpen((value) => !value)}><MoreHorizontal size={19} aria-hidden="true" /></button>{open ? <div className="activity-action-menu__list"><button type="button" onClick={() => { setOpen(false); onEdit(); }}><Pencil size={16} aria-hidden="true" />Edit</button><button type="button" onClick={() => { setOpen(false); onDelete(); }}><Trash2 size={16} aria-hidden="true" />Delete</button></div> : null}</div>;
}

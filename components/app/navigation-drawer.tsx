"use client";

import { Logo } from "@/components/branding/logo";
import { DrawerSection } from "@/components/app/drawer-section";
import { navigationSections } from "@/lib/navigation";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export function NavigationDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div className={`drawer-layer${open ? " drawer-layer--open" : ""}`} aria-hidden={!open} inert={!open}>
      <button className="drawer-overlay" type="button" tabIndex={open ? 0 : -1} aria-label="Close navigation menu" onClick={onClose} />
      <aside className="navigation-drawer" role="dialog" aria-modal="true" aria-label="Pilu navigation menu">
        <div className="navigation-drawer__top">
          <Logo className="navigation-drawer__logo" />
          <button ref={closeButtonRef} className="icon-button icon-button--soft" type="button" onClick={onClose} aria-label="Close navigation menu">
            <X size={21} aria-hidden="true" />
          </button>
        </div>
        <div className="baby-summary">
          <div className="baby-summary__avatar" aria-hidden="true">E</div>
          <div>
            <p>Emma</p>
            <span>2 months &amp; 5 days old</span>
          </div>
        </div>
        <nav className="navigation-drawer__nav" aria-label="Pilu primary navigation">
          {navigationSections.map((section) => <DrawerSection key={section.title} section={section} onNavigate={onClose} />)}
        </nav>
      </aside>
    </div>
  );
}

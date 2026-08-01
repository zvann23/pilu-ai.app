"use client";

import { PiluLogo } from "@/components/branding/logo";
import { BabyAvatar } from "@/components/baby/baby-avatar";
import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { DrawerSection } from "@/components/app/drawer-section";
import { useLocale } from "@/components/i18n/locale-provider";
import { getBabyAge } from "@/lib/baby-data";
import { supabase } from "@/lib/supabase/client";
import { visibleNavigationSections } from "@/lib/navigation";
import { LogOut, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function NavigationDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { profile } = useBabyProfile();
  const { t } = useLocale();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

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
          <PiluLogo size="medium" className="navigation-drawer__logo" />
          <button ref={closeButtonRef} className="icon-button icon-button--soft" type="button" onClick={onClose} aria-label="Close navigation menu">
            <X size={21} aria-hidden="true" />
          </button>
        </div>
        <div className="baby-summary">
          <BabyAvatar name={profile.preferredName} photoPreview={profile.photoPreview} className="baby-summary__avatar" />
          <div>
            <p>{profile.preferredName}</p>
            <span>{getBabyAge(profile.dateOfBirth, t((d) => d.baby.age))}</span>
          </div>
        </div>
        <nav className="navigation-drawer__nav" aria-label="Pilu primary navigation">
          {visibleNavigationSections.map((section) => <DrawerSection key={section.id} section={section} onNavigate={onClose} />)}
        </nav>
        <button type="button" className="navigation-drawer__sign-out" onClick={signOut}>
          <LogOut size={18} aria-hidden="true" />
          {t((d) => d.common.signOut)}
        </button>
      </aside>
    </div>
  );
}

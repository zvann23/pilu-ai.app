"use client";

import { PiluLogo } from "@/components/branding/logo";
import { Bell, Menu } from "lucide-react";
import Link from "next/link";

export function AppHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="app-header">
      <button className="icon-button" type="button" onClick={onMenuClick} aria-label="Open navigation menu">
        <Menu size={23} strokeWidth={2} aria-hidden="true" />
      </button>
      <Link href="/home" className="app-header__logo" aria-label="Pilu home">
        <PiluLogo size="small" priority />
      </Link>
      <Link href="/notifications" className="icon-button" aria-label="Open notifications">
        <Bell size={21} strokeWidth={1.9} aria-hidden="true" />
      </Link>
    </header>
  );
}

"use client";

import { PiluLogo } from "@/components/branding/logo";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { useUnreadBadge } from "@/hooks/use-unread-badge";
import { Bell, Menu } from "lucide-react";
import Link from "next/link";

export function AppHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { userId } = useSupabaseUser();
  const unreadCount = useUnreadBadge(userId);

  return (
    <header className="app-header">
      <button className="icon-button" type="button" onClick={onMenuClick} aria-label="Open navigation menu">
        <Menu size={23} strokeWidth={2} aria-hidden="true" />
      </button>
      <Link href="/home" className="app-header__logo" aria-label="Pilu home">
        <PiluLogo size="small" priority />
      </Link>
      <Link href="/notifications/inbox" className="icon-button app-header__bell" aria-label={unreadCount > 0 ? `Open notifications, ${unreadCount} unread` : "Open notifications"}>
        <Bell size={21} strokeWidth={1.9} aria-hidden="true" />
        {unreadCount > 0 ? <span className="app-header__badge" aria-hidden="true">{unreadCount > 9 ? "9+" : unreadCount}</span> : null}
      </Link>
    </header>
  );
}

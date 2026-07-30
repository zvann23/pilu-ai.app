"use client";

import { AppHeader } from "@/components/app/app-header";
import { NavigationDrawer } from "@/components/app/navigation-drawer";
import { PwaRegistration } from "@/components/ui/pwa-registration";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

const EDGE_SWIPE_WIDTH = 28;
const SWIPE_THRESHOLD = 72;

export function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const swipeStart = useRef<{ x: number; track: boolean } | null>(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (drawerOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [drawerOpen]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch") return;
    swipeStart.current = { x: event.clientX, track: drawerOpen || event.clientX <= EDGE_SWIPE_WIDTH };
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start?.track || event.pointerType !== "touch") return;

    const distance = event.clientX - start.x;
    if (!drawerOpen && distance > SWIPE_THRESHOLD) setDrawerOpen(true);
    if (drawerOpen && distance < -SWIPE_THRESHOLD) setDrawerOpen(false);
  }

  return (
    <div className="app-shell" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
      <PwaRegistration />
      <div className="app-frame">
        <AppHeader onMenuClick={() => setDrawerOpen(true)} />
        <main className="app-main">{children}</main>
      </div>
      <NavigationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}

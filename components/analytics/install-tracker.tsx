"use client";

import { trackAppInstalled } from "@/lib/analytics/analytics-service";
import { useEffect } from "react";

/** Fires when the browser reports the PWA was actually added to the home screen — a real signal, not a prompt shown or a click. */
export function InstallTracker() {
  useEffect(() => {
    function onInstalled() {
      trackAppInstalled();
    }
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  return null;
}

"use client";

import { trackScreenView } from "@/lib/analytics/analytics-service";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Next.js client-side navigation doesn't trigger a real page load, so screen views need to be captured manually on every route change. */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackScreenView(pathname);
  }, [pathname]);

  return null;
}

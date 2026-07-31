"use client";

import { trackFirstAidOpened } from "@/lib/analytics/analytics-service";
import { useEffect } from "react";

export function FirstAidOpenedTracker() {
  useEffect(() => {
    trackFirstAidOpened();
  }, []);

  return null;
}

"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

/**
 * PLACEHOLDER — Phase 20 (Stripe + Elite + Premium) hasn't landed yet, so
 * there is no real entitlements source today. This reads the
 * `profiles.subscription_tier` column added by the Sleep Sounds migration
 * (default 'free') so gating has something real to check against.
 *
 * When Phase 20 ships, replace the body of this hook with the real
 * subscription lookup — every consumer only depends on the returned
 * { isElite, isLoading } shape, so nothing else needs to change.
 */
export function useEliteAccess(userId: string | null) {
  const [isElite, setIsElite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setIsElite(data?.subscription_tier === "elite");
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (!userId) return { isElite: false, isLoading: false };
  return { isElite, isLoading };
}

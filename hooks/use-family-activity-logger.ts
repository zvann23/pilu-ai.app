"use client";

import { getMyFamily, logActivityEvent } from "@/lib/supabase/family-repository";
import { getProfile } from "@/lib/supabase/profile-repository";
import type { ActivityEventKind } from "@/types/family";
import { useCallback, useEffect, useRef } from "react";
import { useSupabaseUser } from "./use-supabase-user";

/**
 * Fire-and-forget bridge from Pilu's existing local activity providers to
 * the shared family activity feed. Every existing provider keeps working
 * exactly as before if this fails or the user has no family yet — it never
 * throws and never blocks the caller.
 */
export function useFamilyActivityLogger() {
  const { userId } = useSupabaseUser();
  const contextRef = useRef<{ familyId: string | null; displayName: string }>({ familyId: null, displayName: "A family member" });

  useEffect(() => {
    if (!userId) return;
    Promise.all([getMyFamily(userId), getProfile(userId)])
      .then(([family, profile]) => {
        contextRef.current = { familyId: family?.family.id ?? null, displayName: profile?.displayName || "A family member" };
      })
      .catch(() => undefined);
  }, [userId]);

  return useCallback(
    (kind: ActivityEventKind, title: string, detail?: string) => {
      const { familyId, displayName } = contextRef.current;
      if (!userId || !familyId) return;
      logActivityEvent(familyId, userId, displayName, kind, title, detail).catch(() => undefined);
    },
    [userId],
  );
}

"use client";

import { getProfile, updateDisplayName } from "@/lib/supabase/profile-repository";
import { useCallback, useEffect, useState } from "react";

export function useDisplayName(userId: string | null) {
  const [displayName, setDisplayNameState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getProfile(userId)
      .then((profile) => {
        if (!cancelled) setDisplayNameState(profile?.displayName ?? null);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const setDisplayName = useCallback(
    async (name: string) => {
      if (!userId) return;
      const trimmed = name.trim();
      if (!trimmed) return;
      await updateDisplayName(userId, trimmed);
      setDisplayNameState(trimmed);
    },
    [userId],
  );

  return { displayName, isLoading: userId ? isLoading : false, setDisplayName };
}

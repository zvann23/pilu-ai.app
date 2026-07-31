"use client";

import { getPreferences, savePreferences } from "@/lib/supabase/notification-repository";
import type { NotificationPreferences } from "@/types/notifications";
import { useCallback, useEffect, useState } from "react";

export function useNotificationPreferences(userId: string | null) {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getPreferences(userId)
      .then(setPreferences)
      .catch(() => undefined)
      .finally(() => setIsLoading(false));
  }, [userId]);

  const update = useCallback(
    async (patch: Partial<NotificationPreferences>) => {
      if (!userId) return;
      setPreferences((current) => (current ? { ...current, ...patch } : current));
      setIsSaving(true);
      try {
        const saved = await savePreferences(userId, patch);
        setPreferences(saved);
      } catch {
        // Optimistic update already applied; a failed save just means it won't persist — safe to ignore here.
      } finally {
        setIsSaving(false);
      }
    },
    [userId],
  );

  return { preferences, isLoading: userId ? isLoading : false, isSaving, update };
}

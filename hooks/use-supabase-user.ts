"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

/**
 * Pilu has no sign-in flow yet, so this establishes an anonymous Supabase
 * session per device (auth.uid() still resolves, RLS still applies) instead
 * of building a login screen just for this feature. Requires "Allow
 * anonymous sign-ins" enabled in the Supabase project's Auth settings.
 * Once real account auth lands, anonymous sessions can be upgraded via
 * supabase.auth.linkIdentity() without a data migration.
 */
export function useSupabaseUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function ensureSession() {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        if (!cancelled) {
          setUserId(session.user.id);
          setIsLoading(false);
        }
        return;
      }

      const { data, error } = await supabase.auth.signInAnonymously();
      if (cancelled) return;

      if (error) {
        console.error("Anonymous sign-in failed", error);
        setIsLoading(false);
        return;
      }

      setUserId(data.user?.id ?? null);
      setIsLoading(false);
    }

    ensureSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { userId, isLoading };
}

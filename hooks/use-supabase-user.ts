"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

/**
 * Reads the current (real) Supabase session. Every route under (app) is
 * gated by middleware.ts, so by the time any of these pages render there
 * is always a real, signed-in user — this hook does not create sessions
 * itself (it used to fall back to an anonymous sign-in before real auth
 * existed; that fallback is gone now that middleware is the single source
 * of truth for "is this user allowed here").
 */
export function useSupabaseUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      setUserId(session?.user?.id ?? null);
      setIsLoading(false);
    });

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

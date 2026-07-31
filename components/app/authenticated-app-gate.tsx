"use client";

import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { getFamilyBabies } from "@/lib/supabase/babies-repository";
import { getMyFamily } from "@/lib/supabase/family-repository";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/**
 * middleware.ts already guarantees a session exists here — this gate
 * covers the next layer: does this account have a family and a baby yet?
 * If not, send them to onboarding rather than showing an empty/broken app.
 * /family/join is exempt so an invited caregiver can redeem their code
 * before the family necessarily has a baby of its own.
 */
export function AuthenticatedAppGate({ children }: { children: ReactNode }) {
  const { userId, isLoading: isAuthLoading } = useSupabaseUser();
  const pathname = usePathname();
  const router = useRouter();
  const isExempt = pathname.startsWith("/family/join");
  // Checked once per session (not on every navigation) — once onboarded, always onboarded.
  const [status, setStatus] = useState<"checking" | "ready">("checking");

  useEffect(() => {
    if (!userId || isAuthLoading || status === "ready" || isExempt) return;

    let cancelled = false;
    getMyFamily(userId)
      .then(async (result) => {
        if (cancelled) return;
        if (!result) {
          router.push("/onboarding");
          return;
        }
        const babies = await getFamilyBabies(result.family.id);
        if (cancelled) return;
        if (babies.length === 0) {
          router.push("/onboarding");
          return;
        }
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("ready");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deliberately runs once per session, not per navigation
  }, [userId, isAuthLoading]);

  if (status === "checking" && !isExempt) {
    return <div className="family-page" aria-busy="true" />;
  }

  return <>{children}</>;
}

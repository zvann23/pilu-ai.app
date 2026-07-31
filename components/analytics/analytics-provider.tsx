"use client";

import { AnalyticsConsentBanner } from "@/components/analytics/analytics-consent-banner";
import { InstallTracker } from "@/components/analytics/install-tracker";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { getStoredConsent, identifyUser, initAnalyticsIfConsented, resetIdentity } from "@/lib/analytics/posthog-client";
import { updateAnalyticsConsent } from "@/lib/supabase/profile-repository";
import { useEffect, type ReactNode } from "react";

/**
 * Mounted once at the root layout so screen views and install/consent
 * tracking cover every route, including /login and /sign-up. Person
 * identification uses only the Supabase user id — see posthog-client.ts.
 */
export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const { userId } = useSupabaseUser();

  useEffect(() => {
    initAnalyticsIfConsented();
  }, []);

  useEffect(() => {
    if (!userId) {
      resetIdentity();
      return;
    }
    identifyUser(userId);
    const consent = getStoredConsent();
    if (consent) updateAnalyticsConsent(userId, consent === "granted").catch(() => undefined);
  }, [userId]);

  return (
    <>
      {children}
      <PageViewTracker />
      <InstallTracker />
      <AnalyticsConsentBanner userId={userId} />
    </>
  );
}

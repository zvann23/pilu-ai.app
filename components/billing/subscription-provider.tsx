"use client";

import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { effectiveTier, hasFeature } from "@/lib/billing/entitlements";
import { getMyFamily } from "@/lib/supabase/family-repository";
import { getFamilySubscription } from "@/lib/supabase/subscription-repository";
import type { FamilySubscription, FeatureKey, SubscriptionTier } from "@/types/billing";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type SubscriptionContextValue = {
  subscription: FamilySubscription | null;
  tier: SubscriptionTier;
  isLoading: boolean;
  hasFeature: (feature: FeatureKey) => boolean;
  refresh: () => void;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { userId, isLoading: isAuthLoading } = useSupabaseUser();
  const [subscription, setSubscription] = useState<FamilySubscription | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    getMyFamily(userId)
      .then((result) => (result ? getFamilySubscription(result.family.id) : null))
      .then((result) => {
        if (cancelled) return;
        setSubscription(result);
        setIsFetching(false);
      })
      .catch(() => {
        if (!cancelled) setIsFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, refreshToken]);

  const isLoading = isAuthLoading || (Boolean(userId) && isFetching);
  const tier = effectiveTier(subscription);
  const value: SubscriptionContextValue = {
    subscription,
    tier,
    isLoading,
    hasFeature: (feature) => hasFeature(tier, feature),
    refresh: () => setRefreshToken((current) => current + 1),
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error("useSubscription must be used inside SubscriptionProvider");
  return context;
}

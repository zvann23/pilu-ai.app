"use client";

import { UpgradePrompt } from "@/components/billing/upgrade-prompt";
import { useSubscription } from "@/components/billing/subscription-provider";
import type { FeatureKey } from "@/types/billing";
import type { ReactNode } from "react";

export function FeatureGate({ feature, title, description, children }: { feature: FeatureKey; title: string; description: string; children: ReactNode }) {
  const { hasFeature, isLoading } = useSubscription();

  if (isLoading) return <div className="family-page" aria-busy="true" />;
  if (!hasFeature(feature)) return <UpgradePrompt feature={feature} title={title} description={description} />;
  return <>{children}</>;
}

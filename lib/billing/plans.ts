import type { BillingPeriod, FeatureKey, PlanId, SubscriptionTier } from "@/types/billing";

export type PlanCatalogEntry = {
  id: PlanId;
  tier: SubscriptionTier;
  billingPeriod: BillingPeriod | null;
  /** Must match a Play Console subscription product ID exactly — see /account/plans setup notes. */
  playProductId: string | null;
  playBasePlanId: string | null;
  displayName: string;
  tagline: string;
};

/**
 * Marketing copy and Play product mapping for each plan — mirrors the
 * subscription_plans table (source of truth for entitlement checks) but
 * kept as static app config so pricing copy doesn't need a DB round trip.
 * Real prices are never hardcoded here: Play Billing returns localized
 * pricing per-device once wired to a real Play Console listing.
 */
export const planCatalog: PlanCatalogEntry[] = [
  { id: "free", tier: "free", billingPeriod: null, playProductId: null, playBasePlanId: null, displayName: "Free", tagline: "Everything you need to get started." },
  { id: "elite_monthly", tier: "elite", billingPeriod: "monthly", playProductId: "pilu_elite", playBasePlanId: "elite-monthly", displayName: "Elite Monthly", tagline: "Billed monthly." },
  { id: "elite_yearly", tier: "elite", billingPeriod: "yearly", playProductId: "pilu_elite", playBasePlanId: "elite-yearly", displayName: "Elite Yearly", tagline: "Billed yearly — best value." },
  { id: "premium_monthly", tier: "premium", billingPeriod: "monthly", playProductId: "pilu_premium", playBasePlanId: "premium-monthly", displayName: "Premium Monthly", tagline: "Billed monthly." },
  { id: "premium_yearly", tier: "premium", billingPeriod: "yearly", playProductId: "pilu_premium", playBasePlanId: "premium-yearly", displayName: "Premium Yearly", tagline: "Billed yearly — best value." },
];

export const featureLabels: Record<FeatureKey, string> = {
  sleep_sounds: "Sleep Sounds",
  unlimited_ai: "Unlimited Ask Pilu",
  unlimited_memories: "Unlimited Memories",
  ai_reports: "AI Reports",
  advanced_ai: "Advanced AI",
  ai_vision: "AI Vision",
};

export const tierFeatures: Record<SubscriptionTier, FeatureKey[]> = {
  free: [],
  elite: ["sleep_sounds", "unlimited_ai", "unlimited_memories", "ai_reports"],
  premium: ["sleep_sounds", "unlimited_ai", "unlimited_memories", "ai_reports", "advanced_ai", "ai_vision"],
};

export const tierTagline: Record<SubscriptionTier, string> = {
  free: "Gentle basics for every family.",
  elite: "Sleep Sounds, unlimited Ask Pilu, unlimited Memories, and AI Reports.",
  premium: "Everything in Elite, plus Advanced AI and AI Vision.",
};

export function planById(id: PlanId): PlanCatalogEntry {
  const plan = planCatalog.find((entry) => entry.id === id);
  if (!plan) throw new Error(`Unknown plan id: ${id}`);
  return plan;
}

export function plansForTier(tier: SubscriptionTier): PlanCatalogEntry[] {
  return planCatalog.filter((entry) => entry.tier === tier);
}

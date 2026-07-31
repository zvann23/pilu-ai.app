export type SubscriptionTier = "free" | "elite" | "premium";
export type BillingPeriod = "monthly" | "yearly";
export type SubscriptionStatus = "active" | "grace_period" | "on_hold" | "paused" | "canceled" | "expired" | "pending";

export type PlanId = "free" | "elite_monthly" | "elite_yearly" | "premium_monthly" | "premium_yearly";

export type FeatureKey =
  | "sleep_sounds"
  | "unlimited_ai"
  | "unlimited_memories"
  | "ai_reports"
  | "advanced_ai"
  | "ai_vision";

export type FamilySubscription = {
  familyId: string;
  planId: PlanId;
  tier: SubscriptionTier;
  billingPeriod: BillingPeriod | null;
  status: SubscriptionStatus;
  autoRenewing: boolean;
  cancelAtPeriodEnd: boolean;
  acknowledged: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  canceledAt: string | null;
};

/** A subscription still unlocks its tier's features through grace_period and on_hold — Google is still trying to collect payment, access shouldn't drop the moment a card fails. */
export const ENTITLED_STATUSES: SubscriptionStatus[] = ["active", "grace_period", "on_hold"];

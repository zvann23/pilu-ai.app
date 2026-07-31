import { tierFeatures } from "@/lib/billing/plans";
import { ENTITLED_STATUSES, type FamilySubscription, type FeatureKey, type SubscriptionTier } from "@/types/billing";

/** The tier a family currently has access to. A lapsed/expired/pending subscription always reads as free — never trust a stale row past its status. */
export function effectiveTier(subscription: FamilySubscription | null): SubscriptionTier {
  if (!subscription) return "free";
  return ENTITLED_STATUSES.includes(subscription.status) ? subscription.tier : "free";
}

export function hasFeature(tier: SubscriptionTier, feature: FeatureKey): boolean {
  return tierFeatures[tier].includes(feature);
}

export function subscriptionHasFeature(subscription: FamilySubscription | null, feature: FeatureKey): boolean {
  return hasFeature(effectiveTier(subscription), feature);
}

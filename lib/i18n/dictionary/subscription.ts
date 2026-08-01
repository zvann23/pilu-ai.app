import type { FeatureKey, SubscriptionStatus, SubscriptionTier } from "@/types/billing";

export type SubscriptionDict = {
  pageHeaders: {
    subscriptionEyebrow: string; growTitle: string; growDescription: string;
    accountEyebrow: string; accountSubscriptionTitle: string; accountSubscriptionDescription: string;
    plansTitle: string; plansDescription: string;
  };
  planComparison: {
    billingPeriodAriaLabel: string; monthly: string; yearly: string;
    unavailableAndroidOnly: string; purchaseIncomplete: string; purchaseUnconfirmed: string; welcomeTemplate: string;
    yourPlan: string; seePriceInPlayStore: string; freeFeatures: string; openingPlayStore: string; chooseTemplate: string;
    tierNames: Record<SubscriptionTier, string>;
  };
  status: {
    labels: Record<SubscriptionStatus, string>; freePlanHeading: string; freePlanBody: string; seePlans: string;
    renews: string; doesNotRenew: string; currentPeriodEnds: string; manageNote: string; manageInPlay: string; changePlan: string; dateFallback: string;
  };
  upgradePrompt: { eyebrowSuffixTemplate: string; seeElitePremium: string };
  plans: { featureLabels: Record<FeatureKey, string>; tierTagline: Record<SubscriptionTier, string> };
};

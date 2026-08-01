import type { SubscriptionDict } from "@/lib/i18n/dictionary/subscription";

export const subscription = {
  pageHeaders: {
    subscriptionEyebrow: "Pilu Elite & Premium", growTitle: "Grow with Pilu", growDescription: "Upgrade your whole family's plan — Sleep Sounds, unlimited Ask Pilu, unlimited Memories, AI Reports, and more.",
    accountEyebrow: "Account", accountSubscriptionTitle: "Subscription", accountSubscriptionDescription: "Your family's current Pilu plan.",
    plansTitle: "Plans", plansDescription: "Compare Free, Elite, and Premium and choose what fits your family.",
  },
  planComparison: {
    billingPeriodAriaLabel: "Billing period", monthly: "Monthly", yearly: "Yearly",
    unavailableAndroidOnly: "Subscribing works from the Pilu Android app. Open Pilu on your Android device to upgrade — your plan will apply to your whole family everywhere, including here.",
    purchaseIncomplete: "The purchase didn't complete. Please try again.",
    purchaseUnconfirmed: "We couldn't confirm this purchase yet. It will update shortly.",
    welcomeTemplate: "You're all set — welcome to Pilu {plan}!",
    yourPlan: "Your plan", seePriceInPlayStore: "See price in Play Store", freeFeatures: "Core baby tracking, timeline, and family sharing",
    openingPlayStore: "Opening Play Store…", chooseTemplate: "Choose {tier}",
    tierNames: { free: "Free", elite: "Elite", premium: "Premium" },
  },
  status: {
    labels: { active: "Active", grace_period: "Payment issue — in grace period", on_hold: "Payment issue — on hold", paused: "Paused", canceled: "Canceled", expired: "Expired", pending: "Pending" },
    freePlanHeading: "You're on the Free plan", freePlanBody: "Upgrade to Elite or Premium to unlock Sleep Sounds, unlimited Ask Pilu, unlimited Memories, and AI Reports.", seePlans: "See plans",
    renews: "Renews", doesNotRenew: "Does not renew", currentPeriodEnds: "Current period ends",
    manageNote: "Subscriptions are managed through Google Play — cancel, change plan, or update payment there.",
    manageInPlay: "Manage in Google Play", changePlan: "Change plan", dateFallback: "—",
  },
  upgradePrompt: { eyebrowSuffixTemplate: "{feature} is a Pilu Elite feature", seeElitePremium: "See Pilu Elite & Premium" },
  plans: {
    featureLabels: {
      sleep_sounds: "Sleep Sounds", unlimited_ai: "Unlimited Ask Pilu", unlimited_memories: "Unlimited Memories",
      ai_reports: "AI Reports", advanced_ai: "Advanced AI", ai_vision: "Unlimited Pilu Vision scans",
    },
    tierTagline: {
      free: "Gentle basics for every family.",
      elite: "Sleep Sounds, unlimited Ask Pilu, Memories, Pilu Vision, and AI Reports.",
      premium: "Everything in Elite, plus Advanced AI.",
    },
  },
} satisfies SubscriptionDict;

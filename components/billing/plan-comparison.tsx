"use client";

import { useSubscription } from "@/components/billing/subscription-provider";
import { getProductDetails, isBillingAvailable, purchaseSubscription } from "@/lib/billing/digital-goods-client";
import { featureLabels, planCatalog, tierFeatures, tierTagline } from "@/lib/billing/plans";
import type { BillingPeriod, PlanId, SubscriptionTier } from "@/types/billing";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

const paidTiers: SubscriptionTier[] = ["elite", "premium"];

export function PlanComparison() {
  const { tier: currentTier, refresh } = useSubscription();
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const [billingAvailable, setBillingAvailable] = useState<boolean | null>(null);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    isBillingAvailable().then(async (available) => {
      if (cancelled) return;
      setBillingAvailable(available);
      if (!available) return;
      const productIds = Array.from(new Set(planCatalog.map((entry) => entry.playProductId).filter((id): id is string => Boolean(id))));
      const details = await getProductDetails(productIds);
      if (cancelled) return;
      setPrices(Object.fromEntries(details.map((item) => [item.itemId, `${item.price.value} ${item.price.currency}`])));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function choose(planId: PlanId) {
    const plan = planCatalog.find((entry) => entry.id === planId);
    if (!plan?.playProductId || !billingAvailable) return;
    setPendingPlan(planId);
    setStatus(null);
    try {
      const result = await purchaseSubscription(plan.playProductId, plan.displayName);
      if (!result) {
        setStatus("The purchase didn't complete. Please try again.");
        return;
      }
      const response = await fetch("/api/billing/verify-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseToken: result.purchaseToken }),
      });
      if (!response.ok) {
        setStatus("We couldn't confirm this purchase yet. It will update shortly.");
        return;
      }
      setStatus("You're all set — welcome to Pilu " + plan.displayName.split(" ")[0] + "!");
      refresh();
    } finally {
      setPendingPlan(null);
    }
  }

  return (
    <div className="plan-comparison">
      <div className="plan-comparison__toggle" role="group" aria-label="Billing period">
        <button type="button" className={period === "monthly" ? "plan-comparison__toggle-button plan-comparison__toggle-button--active" : "plan-comparison__toggle-button"} onClick={() => setPeriod("monthly")}>Monthly</button>
        <button type="button" className={period === "yearly" ? "plan-comparison__toggle-button plan-comparison__toggle-button--active" : "plan-comparison__toggle-button"} onClick={() => setPeriod("yearly")}>Yearly</button>
      </div>

      {billingAvailable === false ? (
        <p className="plan-comparison__unavailable">Subscribing works from the Pilu Android app. Open Pilu on your Android device to upgrade — your plan will apply to your whole family everywhere, including here.</p>
      ) : null}
      {status ? <p className="plan-comparison__status">{status}</p> : null}

      <div className="plan-comparison__grid">
        <PlanCard tier="free" isCurrent={currentTier === "free"} />
        {paidTiers.map((tier) => {
          const planId = `${tier}_${period}` as PlanId;
          const plan = planCatalog.find((entry) => entry.id === planId);
          return (
            <PlanCard
              key={tier}
              tier={tier}
              isCurrent={currentTier === tier}
              priceLabel={plan?.playProductId ? prices[plan.playProductId] : undefined}
              canPurchase={billingAvailable === true}
              isPending={pendingPlan === planId}
              onChoose={planId ? () => choose(planId) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}

function PlanCard({ tier, isCurrent, priceLabel, canPurchase, isPending, onChoose }: { tier: SubscriptionTier; isCurrent: boolean; priceLabel?: string; canPurchase?: boolean; isPending?: boolean; onChoose?: () => void }) {
  return (
    <article className={isCurrent ? "plan-card plan-card--current" : "plan-card"}>
      <header>
        <h2>{tier === "free" ? "Free" : tier === "elite" ? "Elite" : "Premium"}</h2>
        {isCurrent ? <span className="plan-card__badge">Your plan</span> : null}
      </header>
      <p className="plan-card__tagline">{tierTagline[tier]}</p>
      {tier !== "free" ? <strong className="plan-card__price">{priceLabel ?? "See price in Play Store"}</strong> : null}
      <ul className="plan-card__features">
        {tier === "free" ? <li>Core baby tracking, timeline, and family sharing</li> : tierFeatures[tier].map((feature) => <li key={feature}><Check size={15} aria-hidden="true" />{featureLabels[feature]}</li>)}
      </ul>
      {tier !== "free" && !isCurrent ? (
        <button type="button" className="button button--primary" disabled={!canPurchase || isPending} onClick={onChoose}>
          {isPending ? "Opening Play Store…" : `Choose ${tier === "elite" ? "Elite" : "Premium"}`}
        </button>
      ) : null}
    </article>
  );
}

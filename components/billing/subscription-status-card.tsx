"use client";

import { useSubscription } from "@/components/billing/subscription-provider";
import { SkeletonScreen } from "@/components/ui/skeleton-screen";
import { planCatalog } from "@/lib/billing/plans";
import Link from "next/link";

const statusLabel: Record<string, string> = {
  active: "Active",
  grace_period: "Payment issue — in grace period",
  on_hold: "Payment issue — on hold",
  paused: "Paused",
  canceled: "Canceled",
  expired: "Expired",
  pending: "Pending",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

export function SubscriptionStatusCard() {
  const { subscription, tier, isLoading } = useSubscription();

  if (isLoading) return <SkeletonScreen variant="card" />;

  if (!subscription || tier === "free") {
    return (
      <section className="subscription-status-card">
        <h2>You&apos;re on the Free plan</h2>
        <p>Upgrade to Elite or Premium to unlock Sleep Sounds, unlimited Ask Pilu, unlimited Memories, and AI Reports.</p>
        <Link href="/subscription" className="button button--primary">See plans</Link>
      </section>
    );
  }

  const plan = planCatalog.find((entry) => entry.id === subscription.planId);

  return (
    <section className="subscription-status-card">
      <h2>{plan?.displayName ?? subscription.planId}</h2>
      <p className="subscription-status-card__status">{statusLabel[subscription.status] ?? subscription.status}</p>
      <dl className="subscription-status-card__details">
        <div><dt>Renews</dt><dd>{subscription.cancelAtPeriodEnd ? "Does not renew" : formatDate(subscription.expiresAt)}</dd></div>
        <div><dt>Current period ends</dt><dd>{formatDate(subscription.expiresAt)}</dd></div>
      </dl>
      <p className="subscription-status-card__manage-note">Subscriptions are managed through Google Play — cancel, change plan, or update payment there.</p>
      <a href="https://play.google.com/store/account/subscriptions" target="_blank" rel="noreferrer" className="button button--secondary">Manage in Google Play</a>
      <Link href="/subscription" className="subscription-status-card__change-plan">Change plan</Link>
    </section>
  );
}

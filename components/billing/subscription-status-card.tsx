"use client";

import { useSubscription } from "@/components/billing/subscription-provider";
import { useLocale } from "@/components/i18n/locale-provider";
import { SkeletonScreen } from "@/components/ui/skeleton-screen";
import { intlLocaleTags } from "@/lib/i18n/locales";
import { planCatalog } from "@/lib/billing/plans";
import Link from "next/link";

export function SubscriptionStatusCard() {
  const { t, locale } = useLocale();
  const sd = t((d) => d.subscription.status);
  const { subscription, tier, isLoading } = useSubscription();

  function formatDate(value: string | null) {
    if (!value) return sd.dateFallback;
    return new Intl.DateTimeFormat(intlLocaleTags[locale], { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
  }

  if (isLoading) return <SkeletonScreen variant="card" />;

  if (!subscription || tier === "free") {
    return (
      <section className="subscription-status-card">
        <h2>{sd.freePlanHeading}</h2>
        <p>{sd.freePlanBody}</p>
        <Link href="/subscription" className="button button--primary">{sd.seePlans}</Link>
      </section>
    );
  }

  const plan = planCatalog.find((entry) => entry.id === subscription.planId);

  return (
    <section className="subscription-status-card">
      <h2>{plan?.displayName ?? subscription.planId}</h2>
      <p className="subscription-status-card__status">{sd.labels[subscription.status] ?? subscription.status}</p>
      <dl className="subscription-status-card__details">
        <div><dt>{sd.renews}</dt><dd>{subscription.cancelAtPeriodEnd ? sd.doesNotRenew : formatDate(subscription.expiresAt)}</dd></div>
        <div><dt>{sd.currentPeriodEnds}</dt><dd>{formatDate(subscription.expiresAt)}</dd></div>
      </dl>
      <p className="subscription-status-card__manage-note">{sd.manageNote}</p>
      <a href="https://play.google.com/store/account/subscriptions" target="_blank" rel="noreferrer" className="button button--secondary">{sd.manageInPlay}</a>
      <Link href="/subscription" className="subscription-status-card__change-plan">{sd.changePlan}</Link>
    </section>
  );
}

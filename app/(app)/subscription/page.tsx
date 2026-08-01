"use client";

import { PlanComparison } from "@/components/billing/plan-comparison";
import { useLocale } from "@/components/i18n/locale-provider";
import { PageHeader } from "@/components/ui/page-header";

export default function SubscriptionPage() {
  const { t } = useLocale();
  const sd = t((d) => d.subscription.pageHeaders);
  return (
    <div className="app-page-stack">
      <PageHeader eyebrow={sd.subscriptionEyebrow} title={sd.growTitle} description={sd.growDescription} />
      <PlanComparison />
    </div>
  );
}

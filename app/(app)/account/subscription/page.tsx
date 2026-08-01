"use client";

import { SubscriptionStatusCard } from "@/components/billing/subscription-status-card";
import { useLocale } from "@/components/i18n/locale-provider";
import { PageHeader } from "@/components/ui/page-header";

export default function AccountSubscriptionPage() {
  const { t } = useLocale();
  const sd = t((d) => d.subscription.pageHeaders);
  return (
    <div className="app-page-stack">
      <PageHeader eyebrow={sd.accountEyebrow} title={sd.accountSubscriptionTitle} description={sd.accountSubscriptionDescription} />
      <SubscriptionStatusCard />
    </div>
  );
}

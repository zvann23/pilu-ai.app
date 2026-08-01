"use client";

import { PlanComparison } from "@/components/billing/plan-comparison";
import { useLocale } from "@/components/i18n/locale-provider";
import { PageHeader } from "@/components/ui/page-header";

export default function AccountPlansPage() {
  const { t } = useLocale();
  const sd = t((d) => d.subscription.pageHeaders);
  return (
    <div className="app-page-stack">
      <PageHeader eyebrow={sd.accountEyebrow} title={sd.plansTitle} description={sd.plansDescription} />
      <PlanComparison />
    </div>
  );
}

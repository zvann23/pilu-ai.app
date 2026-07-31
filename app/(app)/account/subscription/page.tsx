import { SubscriptionStatusCard } from "@/components/billing/subscription-status-card";
import { PageHeader } from "@/components/ui/page-header";

export default function AccountSubscriptionPage() {
  return (
    <div className="app-page-stack">
      <PageHeader eyebrow="Account" title="Subscription" description="Your family's current Pilu plan." />
      <SubscriptionStatusCard />
    </div>
  );
}

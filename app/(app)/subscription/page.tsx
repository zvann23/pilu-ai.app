import { PlanComparison } from "@/components/billing/plan-comparison";
import { PageHeader } from "@/components/ui/page-header";

export default function SubscriptionPage() {
  return (
    <div className="app-page-stack">
      <PageHeader eyebrow="Pilu Elite & Premium" title="Grow with Pilu" description="Upgrade your whole family's plan — Sleep Sounds, unlimited Ask Pilu, unlimited Memories, AI Reports, and more." />
      <PlanComparison />
    </div>
  );
}

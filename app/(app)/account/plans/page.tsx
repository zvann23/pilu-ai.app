import { PlanComparison } from "@/components/billing/plan-comparison";
import { PageHeader } from "@/components/ui/page-header";

export default function AccountPlansPage() {
  return (
    <div className="app-page-stack">
      <PageHeader eyebrow="Account" title="Plans" description="Compare Free, Elite, and Premium and choose what fits your family." />
      <PlanComparison />
    </div>
  );
}

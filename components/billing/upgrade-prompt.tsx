import { Sparkles } from "lucide-react";
import { PiluIllustration } from "@/components/illustrations/pilu-illustration";
import { featureLabels } from "@/lib/billing/plans";
import type { FeatureKey } from "@/types/billing";
import Link from "next/link";

export function UpgradePrompt({ feature, title, description }: { feature: FeatureKey; title: string; description: string }) {
  return (
    <section className="upgrade-prompt">
      <div className="upgrade-prompt__icon" aria-hidden="true"><Sparkles size={20} /></div>
      <div>
        <span className="upgrade-prompt__eyebrow">{featureLabels[feature]} is a Pilu Elite feature</span>
        <h2>{title}</h2>
        <p>{description}</p>
        <Link href="/subscription" className="button button--primary">See Pilu Elite &amp; Premium</Link>
      </div>
      <PiluIllustration variant="teddy" className="upgrade-prompt__illustration" />
    </section>
  );
}

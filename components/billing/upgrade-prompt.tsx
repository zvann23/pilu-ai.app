"use client";

import { Sparkles } from "lucide-react";
import { PiluIllustration } from "@/components/illustrations/pilu-illustration";
import { useLocale } from "@/components/i18n/locale-provider";
import type { FeatureKey } from "@/types/billing";
import Link from "next/link";

export function UpgradePrompt({ feature, title, description }: { feature: FeatureKey; title: string; description: string }) {
  const { t } = useLocale();
  const sd = t((d) => d.subscription);
  return (
    <section className="upgrade-prompt">
      <div className="upgrade-prompt__icon" aria-hidden="true"><Sparkles size={20} /></div>
      <div>
        <span className="upgrade-prompt__eyebrow">{sd.upgradePrompt.eyebrowSuffixTemplate.replace("{feature}", sd.plans.featureLabels[feature])}</span>
        <h2>{title}</h2>
        <p>{description}</p>
        <Link href="/subscription" className="button button--primary">{sd.upgradePrompt.seeElitePremium}</Link>
      </div>
      <PiluIllustration variant="teddy" className="upgrade-prompt__illustration" />
    </section>
  );
}

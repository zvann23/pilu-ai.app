"use client";

import { Sparkles } from "lucide-react";
import { PiluIllustration } from "@/components/illustrations/pilu-illustration";
import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { format, useLocale } from "@/components/i18n/locale-provider";

export function InsightCard() {
  const { profile } = useBabyProfile();
  const { t } = useLocale();
  const dict = t((d) => d.home.insightCard);
  return (
    <section className="insight-card">
      <div className="insight-card__heading"><Sparkles size={18} aria-hidden="true" /><h2>{dict.heading}</h2></div>
      <p>{format(dict.body, { name: profile.preferredName })}</p>
      <span>{dict.footer}</span>
      <PiluIllustration variant="sleeping-baby" className="insight-card__illustration" />
    </section>
  );
}

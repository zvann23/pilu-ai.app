"use client";

import { Sparkles } from "lucide-react";
import { PiluIllustration } from "@/components/illustrations/pilu-illustration";
import { useBabyProfile } from "@/components/baby/baby-profile-provider";

export function InsightCard() {
  const { profile } = useBabyProfile();
  return (
    <section className="insight-card">
      <div className="insight-card__heading"><Sparkles size={18} aria-hidden="true" /><h2>Today&apos;s insight</h2></div>
      <p>{profile.preferredName} had a good night — 6h 45m of sleep with 2 wake-ups, and feeding well.</p>
      <span>Based on today&apos;s mock activity.</span>
      <PiluIllustration variant="sleeping-baby" className="insight-card__illustration" />
    </section>
  );
}

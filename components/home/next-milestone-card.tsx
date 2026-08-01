"use client";

import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { useDevelopment } from "@/components/development/development-provider";
import { format, useLocale } from "@/components/i18n/locale-provider";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function NextMilestoneCard() {
  const { milestones } = useDevelopment();
  const { profile } = useBabyProfile();
  const { t } = useLocale();
  const dict = t((d) => d.home.nextMilestoneCard);
  const next = milestones.find((milestone) => milestone.id === "social-smile") ?? milestones.find((milestone) => milestone.status === "inProgress" || milestone.status === "upcoming");
  if (!next) return null;
  return <section className="next-milestone-card"><div><Sparkles size={18} aria-hidden="true" /><p>{dict.label}</p></div><h2>{format(dict.body, { name: profile.preferredName, milestone: next.title.toLowerCase() })}</h2><span>{dict.footer}</span><Link href="/milestones">{dict.button}</Link></section>;
}

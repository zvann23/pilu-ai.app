"use client";

import { useDevelopment } from "@/components/development/development-provider";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function NextMilestoneCard() {
  const { milestones } = useDevelopment();
  const next = milestones.find((milestone) => milestone.id === "social-smile") ?? milestones.find((milestone) => milestone.status === "inProgress" || milestone.status === "upcoming");
  if (!next) return null;
  return <section className="next-milestone-card"><div><Sparkles size={18} aria-hidden="true" /><p>Next milestone</p></div><h2>Emma may soon begin {next.title.toLowerCase()}.</h2><span>General developmental guidance</span><Link href="/milestones">Explore milestones</Link></section>;
}

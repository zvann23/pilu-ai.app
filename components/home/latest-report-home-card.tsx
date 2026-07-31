"use client";

import { useLatestReport } from "@/hooks/use-reports";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { reportTypeLabels } from "@/lib/reports-data";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function LatestReportHomeCard() {
  const { userId } = useSupabaseUser();
  const { latestReport, isLoading } = useLatestReport(userId);

  if (isLoading) return null;

  if (!latestReport) {
    return (
      <section className="latest-report-home-card">
        <div className="latest-report-home-card__icon"><Sparkles size={20} aria-hidden="true" /></div>
        <div>
          <p>Pilu Elite</p>
          <h2>Your first AI report is ready to generate</h2>
          <span>A calm summary of feeding, sleep, growth, and happy moments.</span>
        </div>
        <Link href="/reports">Generate report</Link>
      </section>
    );
  }

  return (
    <section className="latest-report-home-card">
      <div className="latest-report-home-card__icon"><Sparkles size={20} aria-hidden="true" /></div>
      <div>
        <p>Latest AI Report · {reportTypeLabels[latestReport.type]}</p>
        <h2>{latestReport.periodLabel}</h2>
        <span className="latest-report-home-card__overview">{latestReport.content.overview}</span>
      </div>
      <Link href="/reports">View full report</Link>
    </section>
  );
}

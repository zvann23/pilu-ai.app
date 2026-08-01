"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { useLatestReport } from "@/hooks/use-reports";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { reportTypeLabels } from "@/lib/reports-data";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function LatestReportHomeCard() {
  const { userId } = useSupabaseUser();
  const { latestReport, isLoading } = useLatestReport(userId);
  const { t } = useLocale();
  const dict = t((d) => d.home.latestReportCard);

  if (isLoading) return null;

  if (!latestReport) {
    return (
      <section className="latest-report-home-card">
        <div className="latest-report-home-card__icon"><Sparkles size={20} aria-hidden="true" /></div>
        <div>
          <p>{dict.eyebrow}</p>
          <h2>{dict.emptyHeading}</h2>
          <span>{dict.emptyDescription}</span>
        </div>
        <Link href="/reports">{dict.generateButton}</Link>
      </section>
    );
  }

  return (
    <section className="latest-report-home-card">
      <div className="latest-report-home-card__icon"><Sparkles size={20} aria-hidden="true" /></div>
      <div>
        <p>{dict.latestPrefix} · {reportTypeLabels[latestReport.type]}</p>
        <h2>{latestReport.periodLabel}</h2>
        <span className="latest-report-home-card__overview">{latestReport.content.overview}</span>
      </div>
      <Link href="/reports">{dict.viewButton}</Link>
    </section>
  );
}

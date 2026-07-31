"use client";

import { useActivities } from "@/components/activity/activity-provider";
import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { useCare } from "@/components/care/care-provider";
import { useDevelopment } from "@/components/development/development-provider";
import { useMemories } from "@/components/memory/memory-provider";
import { buildReportCharts, buildReportContext } from "@/lib/reports-data";
import { getLatestReport, listReports, saveReport } from "@/lib/supabase/reports-repository";
import type { GeneratedReport, ReportType } from "@/types/reports";
import { useCallback, useEffect, useState } from "react";

export function useReports(userId: string | null) {
  const { profile } = useBabyProfile();
  const { activities } = useActivities();
  const { measurements, milestones } = useDevelopment();
  const { medicines } = useCare();
  const { memories, journalEntries } = useMemories();

  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    listReports(userId)
      .then((rows) => {
        if (!cancelled) setReports(rows);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setIsLoadingHistory(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const generate = useCallback(
    async (reportType: ReportType) => {
      setIsGenerating(true);
      setError(null);
      try {
        const context = buildReportContext({ reportType, profile, activities, measurements, milestones, medicines, memories, journalEntries });
        const response = await fetch("/api/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reportType, context }),
        });
        const content: unknown = await response.json();
        if (!response.ok || !content || typeof content !== "object" || "error" in (content as Record<string, unknown>)) {
          throw new Error("Pilu couldn't prepare this report right now. Please try again.");
        }

        const draft: Omit<GeneratedReport, "id"> = {
          type: reportType,
          babyName: profile.preferredName,
          periodStart: context.periodStart,
          periodEnd: context.periodEnd,
          periodLabel: context.periodLabel,
          generatedAt: new Date().toISOString(),
          content: content as GeneratedReport["content"],
          charts: buildReportCharts(activities, measurements),
        };

        let saved: GeneratedReport = { ...draft, id: `local-${Date.now()}` };
        if (userId) {
          try {
            saved = await saveReport(userId, draft);
          } catch {
            // Persisting is best-effort — the freshly generated report still displays locally.
          }
        }

        setReports((current) => [saved, ...current]);
        return saved;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Pilu couldn't prepare this report right now. Please try again.");
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [profile, activities, measurements, milestones, medicines, memories, journalEntries, userId],
  );

  return { reports, isLoadingHistory: userId ? isLoadingHistory : false, isGenerating, error, generate, babyName: profile.preferredName };
}

export function useLatestReport(userId: string | null) {
  const [latestReport, setLatestReport] = useState<GeneratedReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getLatestReport(userId)
      .then((report) => {
        if (!cancelled) setLatestReport(report);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { latestReport, isLoading: userId ? isLoading : false };
}

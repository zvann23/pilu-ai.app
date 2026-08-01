import { defaultLocale, type Locale } from "@/lib/i18n/locales";
import { dictionaries } from "@/lib/i18n/translations";
import type { ReportContent } from "@/types/reports";

function stringArray(value: unknown, max: number): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, max) : [];
}

export function validateReportContent(value: unknown): ReportContent | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  const requiredStrings = ["overview", "routineTrends", "sleepSummary", "feedingSummary", "growthProgress", "milestones", "happyMoments", "disclaimer"];
  if (requiredStrings.some((key) => typeof data[key] !== "string" || !(data[key] as string).trim())) return null;

  return {
    overview: (data.overview as string).trim(),
    todaysHighlights: stringArray(data.todaysHighlights, 6),
    routineTrends: (data.routineTrends as string).trim(),
    sleepSummary: (data.sleepSummary as string).trim(),
    feedingSummary: (data.feedingSummary as string).trim(),
    growthProgress: (data.growthProgress as string).trim(),
    milestones: (data.milestones as string).trim(),
    happyMoments: (data.happyMoments as string).trim(),
    suggestionsForParents: stringArray(data.suggestionsForParents, 6),
    pediatricianQuestions: stringArray(data.pediatricianQuestions, 6),
    disclaimer: (data.disclaimer as string).trim(),
  };
}

export function safeFallbackReportContent(locale: Locale = defaultLocale): ReportContent {
  const { safeFallback } = dictionaries[locale].reportsAi;
  return {
    overview: safeFallback.overview,
    todaysHighlights: [],
    routineTrends: safeFallback.routineTrends,
    sleepSummary: safeFallback.sleepSummary,
    feedingSummary: safeFallback.feedingSummary,
    growthProgress: safeFallback.growthProgress,
    milestones: safeFallback.milestones,
    happyMoments: safeFallback.happyMoments,
    suggestionsForParents: [safeFallback.suggestion],
    pediatricianQuestions: [],
    disclaimer: safeFallback.disclaimer,
  };
}

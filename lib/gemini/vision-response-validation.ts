import { defaultLocale, type Locale } from "@/lib/i18n/locales";
import { dictionaries } from "@/lib/i18n/translations";
import type { VisionAnalysis } from "@/types/vision";

function stringArray(value: unknown, limit: number): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, limit) : [];
}

export function validateVisionAnalysis(value: unknown): VisionAnalysis | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (typeof data.title !== "string" || !data.title.trim() || typeof data.summary !== "string" || !data.summary.trim() || typeof data.recommendation !== "string" || !data.recommendation.trim() || typeof data.disclaimer !== "string" || !data.disclaimer.trim()) {
    return null;
  }
  return {
    title: data.title.trim(),
    summary: data.summary.trim(),
    keyPoints: stringArray(data.keyPoints, 8),
    concerns: stringArray(data.concerns, 6),
    recommendation: data.recommendation.trim(),
    disclaimer: data.disclaimer.trim(),
  };
}

export function safeFallbackVisionAnalysis(locale: Locale = defaultLocale): VisionAnalysis {
  const { safeFallback } = dictionaries[locale].vision;
  return {
    title: safeFallback.title,
    summary: safeFallback.summary,
    keyPoints: [],
    concerns: [],
    recommendation: safeFallback.recommendation,
    disclaimer: safeFallback.disclaimer,
  };
}

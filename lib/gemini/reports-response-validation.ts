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

export function safeFallbackReportContent(): ReportContent {
  return {
    overview: "Pilu couldn't prepare a full report right now, but here is a gentle placeholder based on what's available.",
    todaysHighlights: [],
    routineTrends: "Not enough information was available to describe routines this time.",
    sleepSummary: "Sleep information will appear here once a report is generated.",
    feedingSummary: "Feeding information will appear here once a report is generated.",
    growthProgress: "Growth information will appear here once a report is generated.",
    milestones: "Milestone information will appear here once a report is generated.",
    happyMoments: "Happy moments will appear here once a report is generated.",
    suggestionsForParents: ["Try generating this report again in a moment."],
    pediatricianQuestions: [],
    disclaimer: "Pilu provides general parenting information and does not replace medical advice.",
  };
}

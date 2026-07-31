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

export function safeFallbackVisionAnalysis(): VisionAnalysis {
  return {
    title: "Pilu couldn't read this photo",
    summary: "Pilu wasn't able to prepare a full analysis for this photo right now. A clear, well-lit photo of the front of the item or label usually works best.",
    keyPoints: [],
    concerns: [],
    recommendation: "Try again with a clearer photo, or check the packaging directly. If you're concerned about a health or safety question, it's always okay to contact your pediatrician.",
    disclaimer: "Pilu Vision provides general information and does not replace medical advice or professional product safety guidance.",
  };
}

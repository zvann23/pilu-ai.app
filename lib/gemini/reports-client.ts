import { GEMINI_MODEL, GEMINI_TIMEOUT_MS } from "@/lib/gemini/config";
import { PILU_REPORT_SYSTEM_PROMPT } from "@/lib/gemini/reports-system-prompt";
import { safeFallbackReportContent, validateReportContent } from "@/lib/gemini/reports-response-validation";
import type { ReportContent, ReportContext } from "@/types/reports";

const responseSchema = {
  type: "OBJECT",
  properties: {
    overview: { type: "STRING" },
    todaysHighlights: { type: "ARRAY", items: { type: "STRING" } },
    routineTrends: { type: "STRING" },
    sleepSummary: { type: "STRING" },
    feedingSummary: { type: "STRING" },
    growthProgress: { type: "STRING" },
    milestones: { type: "STRING" },
    happyMoments: { type: "STRING" },
    suggestionsForParents: { type: "ARRAY", items: { type: "STRING" } },
    pediatricianQuestions: { type: "ARRAY", items: { type: "STRING" } },
    disclaimer: { type: "STRING" },
  },
  required: [
    "overview", "todaysHighlights", "routineTrends", "sleepSummary", "feedingSummary",
    "growthProgress", "milestones", "happyMoments", "suggestionsForParents", "pediatricianQuestions", "disclaimer",
  ],
};

function demoReportContent(context: ReportContext): ReportContent {
  return {
    overview: `Demo mode: Pilu would use ${context.baby.name}'s ${context.reportType} data to write a calm, personalized overview here. Gemini is not connected, so this is a placeholder.`,
    todaysHighlights: [`${context.feeding.feedingCount} feedings logged`, `${Math.round(context.sleep.totalSleepMinutes / 60)}h of sleep logged`, `${context.diapers.total} diaper changes logged`],
    routineTrends: "Demo mode: a gentle description of the rhythms Pilu noticed would appear here.",
    sleepSummary: "Demo mode: a warm summary of sleep patterns would appear here.",
    feedingSummary: "Demo mode: a warm summary of feeding patterns would appear here.",
    growthProgress: context.growth.latest ? `Demo mode: ${context.baby.name}'s latest measurement was ${context.growth.latest.weightKg} kg.` : "Demo mode: no growth measurements are available yet for this period.",
    milestones: context.milestones.achievedInPeriod.length ? `Demo mode: ${context.milestones.achievedInPeriod.length} milestone(s) were reached this period.` : "Demo mode: no milestones were marked achieved in this period.",
    happyMoments: context.memoriesInPeriod.length ? `Demo mode: ${context.memoriesInPeriod.length} memory/memories were saved this period.` : "Demo mode: no memories were saved in this period.",
    suggestionsForParents: ["Notice patterns over time rather than any single day.", "Keep saving small moments in Memory Book — they add up beautifully."],
    pediatricianQuestions: ["Is there anything about our current routine you'd recommend adjusting?"],
    disclaimer: "Demo response — Gemini is not connected. Pilu provides general parenting information and does not replace medical advice.",
    demo: true,
  };
}

export async function askGeminiForReport(context: ReportContext): Promise<ReportContent> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return demoReportContent(context);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: PILU_REPORT_SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: `Generate a ${context.reportType} report from this data: ${JSON.stringify(context)}` }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema },
      }),
    });
    if (!response.ok) throw new Error("Gemini request failed");
    const payload = (await response.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return safeFallbackReportContent();
    try {
      return validateReportContent(JSON.parse(text)) ?? safeFallbackReportContent();
    } catch {
      return safeFallbackReportContent();
    }
  } finally {
    clearTimeout(timeout);
  }
}

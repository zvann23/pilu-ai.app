import { GEMINI_MODEL, GEMINI_TIMEOUT_MS } from "@/lib/gemini/config";
import { getPiluReportSystemPrompt } from "@/lib/gemini/reports-system-prompt";
import { safeFallbackReportContent, validateReportContent } from "@/lib/gemini/reports-response-validation";
import { format } from "@/lib/i18n/format";
import { defaultLocale, type Locale } from "@/lib/i18n/locales";
import { dictionaries } from "@/lib/i18n/translations";
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

function demoReportContent(context: ReportContext, locale: Locale): ReportContent {
  const { demo } = dictionaries[locale].reportsAi;
  return {
    overview: format(demo.overviewTemplate, { name: context.baby.name }),
    todaysHighlights: [
      format(demo.highlightFeedingsTemplate, { count: String(context.feeding.feedingCount) }),
      format(demo.highlightSleepTemplate, { hours: String(Math.round(context.sleep.totalSleepMinutes / 60)) }),
      format(demo.highlightDiapersTemplate, { count: String(context.diapers.total) }),
    ],
    routineTrends: demo.routineTrends,
    sleepSummary: demo.sleepSummary,
    feedingSummary: demo.feedingSummary,
    growthProgress: context.growth.latest ? format(demo.growthProgressWithDataTemplate, { name: context.baby.name, weight: String(context.growth.latest.weightKg) }) : demo.growthProgressEmpty,
    milestones: context.milestones.achievedInPeriod.length ? format(demo.milestonesWithDataTemplate, { count: String(context.milestones.achievedInPeriod.length) }) : demo.milestonesEmpty,
    happyMoments: context.memoriesInPeriod.length ? format(demo.happyMomentsWithDataTemplate, { count: String(context.memoriesInPeriod.length) }) : demo.happyMomentsEmpty,
    suggestionsForParents: [demo.suggestion1, demo.suggestion2],
    pediatricianQuestions: [demo.pediatricianQuestion1],
    disclaimer: demo.disclaimer,
    demo: true,
  };
}

export async function askGeminiForReport(context: ReportContext, locale: Locale = defaultLocale): Promise<ReportContent> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return demoReportContent(context, locale);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: getPiluReportSystemPrompt(locale) }] },
        contents: [{ role: "user", parts: [{ text: `Generate a ${context.reportType} report from this data: ${JSON.stringify(context)}` }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema },
      }),
    });
    if (!response.ok) throw new Error("Gemini request failed");
    const payload = (await response.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return safeFallbackReportContent(locale);
    try {
      return validateReportContent(JSON.parse(text)) ?? safeFallbackReportContent(locale);
    } catch {
      return safeFallbackReportContent(locale);
    }
  } finally {
    clearTimeout(timeout);
  }
}

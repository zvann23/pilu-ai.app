import { GEMINI_MODEL, GEMINI_TIMEOUT_MS } from "@/lib/gemini/config";
import { getPiluVisionSystemPrompt } from "@/lib/gemini/vision-system-prompt";
import { safeFallbackVisionAnalysis, validateVisionAnalysis } from "@/lib/gemini/vision-response-validation";
import { defaultLocale, type Locale } from "@/lib/i18n/locales";
import { dictionaries } from "@/lib/i18n/translations";
import { visionCategoryLabels } from "@/types/vision";
import type { VisionAnalysis, VisionCategory } from "@/types/vision";

const responseSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    summary: { type: "STRING" },
    keyPoints: { type: "ARRAY", items: { type: "STRING" } },
    concerns: { type: "ARRAY", items: { type: "STRING" } },
    recommendation: { type: "STRING" },
    disclaimer: { type: "STRING" },
  },
  required: ["title", "summary", "keyPoints", "concerns", "recommendation", "disclaimer"],
};

function demoAnalysis(category: VisionCategory, locale: Locale): VisionAnalysis {
  const { demo } = dictionaries[locale].vision;
  const label = dictionaries[locale].vision.categoryLabels[category];
  return {
    title: demo.titleTemplate.replace("{label}", label),
    summary: demo.summaryTemplate.replace("{label}", label.toLowerCase()),
    keyPoints: [demo.keyPoint],
    concerns: [],
    recommendation: demo.recommendation,
    disclaimer: demo.disclaimer,
    demo: true,
  };
}

export async function askGeminiVision(category: VisionCategory, imageBase64: string, mimeType: string, locale: Locale = defaultLocale): Promise<VisionAnalysis> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return demoAnalysis(category, locale);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: getPiluVisionSystemPrompt(locale) }] },
        contents: [{
          role: "user",
          parts: [
            { text: `The parent scanned this photo as category: ${visionCategoryLabels[category]}. Describe what you see.` },
            { inlineData: { mimeType, data: imageBase64 } },
          ],
        }],
        generationConfig: { responseMimeType: "application/json", responseSchema },
      }),
    });
    if (!response.ok) throw new Error("Gemini request failed");
    const payload = (await response.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return safeFallbackVisionAnalysis(locale);
    try {
      return validateVisionAnalysis(JSON.parse(text)) ?? safeFallbackVisionAnalysis(locale);
    } catch {
      return safeFallbackVisionAnalysis(locale);
    }
  } finally {
    clearTimeout(timeout);
  }
}

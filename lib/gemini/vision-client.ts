import { GEMINI_MODEL, GEMINI_TIMEOUT_MS } from "@/lib/gemini/config";
import { PILU_VISION_SYSTEM_PROMPT } from "@/lib/gemini/vision-system-prompt";
import { safeFallbackVisionAnalysis, validateVisionAnalysis } from "@/lib/gemini/vision-response-validation";
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

function demoAnalysis(category: VisionCategory): VisionAnalysis {
  const label = visionCategoryLabels[category];
  return {
    title: `Demo mode: ${label} scan`,
    summary: `Demo mode: Pilu Vision would identify what's in this ${label.toLowerCase()} photo here. Gemini is not connected, so this is a placeholder.`,
    keyPoints: ["Demo mode: notable details from the photo would appear here."],
    concerns: [],
    recommendation: "Demo mode: gentle next-step guidance would appear here.",
    disclaimer: "Demo response — Gemini is not connected. Pilu Vision provides general information and does not replace medical advice.",
    demo: true,
  };
}

export async function askGeminiVision(category: VisionCategory, imageBase64: string, mimeType: string): Promise<VisionAnalysis> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return demoAnalysis(category);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: PILU_VISION_SYSTEM_PROMPT }] },
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
    if (!text) return safeFallbackVisionAnalysis();
    try {
      return validateVisionAnalysis(JSON.parse(text)) ?? safeFallbackVisionAnalysis();
    } catch {
      return safeFallbackVisionAnalysis();
    }
  } finally {
    clearTimeout(timeout);
  }
}

import { GEMINI_MODEL, GEMINI_TIMEOUT_MS } from "@/lib/gemini/config";
import { getPiluSystemPrompt } from "@/lib/gemini/system-prompt";
import { safeFallbackResponse, validatePiluResponse } from "@/lib/gemini/response-validation";
import { format } from "@/lib/i18n/format";
import { defaultLocale, type Locale } from "@/lib/i18n/locales";
import { dictionaries } from "@/lib/i18n/translations";
import type { MinimalBabyContext, PiluResponse } from "@/types/chat";

const responseSchema = { type: "OBJECT", properties: { answer: { type: "STRING" }, followUpQuestion: { type: "STRING", nullable: true }, urgency: { type: "STRING", enum: ["normal", "contact_doctor", "urgent"] }, suggestedActions: { type: "ARRAY", items: { type: "STRING" } }, disclaimer: { type: "STRING" } }, required: ["answer", "followUpQuestion", "urgency", "suggestedActions", "disclaimer"] };

export async function askGemini(message: string, babyContext: MinimalBabyContext, locale: Locale = defaultLocale): Promise<PiluResponse> {
  const key = process.env.GEMINI_API_KEY;
  const { demo } = dictionaries[locale].gemini;
  if (!key) return { answer: format(demo.answerTemplate, { name: babyContext.preferredName, message }), followUpQuestion: demo.followUpQuestion, urgency: "normal", suggestedActions: [demo.action1, demo.action2], disclaimer: demo.disclaimer, demo: true };
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`, { method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal, body: JSON.stringify({ systemInstruction: { parts: [{ text: getPiluSystemPrompt(locale) }] }, contents: [{ role: "user", parts: [{ text: `Baby context: ${JSON.stringify(babyContext)}\n\nParent question: ${message}` }] }], generationConfig: { responseMimeType: "application/json", responseSchema } }) });
    if (!response.ok) throw new Error("Gemini request failed");
    const payload = await response.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return safeFallbackResponse(locale);
    try { return validatePiluResponse(JSON.parse(text)) ?? safeFallbackResponse(locale); } catch { return safeFallbackResponse(locale); }
  } finally { clearTimeout(timeout); }
}

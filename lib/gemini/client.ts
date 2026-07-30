import { GEMINI_MODEL, GEMINI_TIMEOUT_MS } from "@/lib/gemini/config";
import { PILU_SYSTEM_PROMPT } from "@/lib/gemini/system-prompt";
import { safeFallbackResponse, validatePiluResponse } from "@/lib/gemini/response-validation";
import type { MinimalBabyContext, PiluResponse } from "@/types/chat";

const responseSchema = { type: "OBJECT", properties: { answer: { type: "STRING" }, followUpQuestion: { type: "STRING", nullable: true }, urgency: { type: "STRING", enum: ["normal", "contact_doctor", "urgent"] }, suggestedActions: { type: "ARRAY", items: { type: "STRING" } }, disclaimer: { type: "STRING" } }, required: ["answer", "followUpQuestion", "urgency", "suggestedActions", "disclaimer"] };

export async function askGemini(message: string, babyContext: MinimalBabyContext): Promise<PiluResponse> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { answer: `Demo mode: Pilu would use ${babyContext.preferredName}’s profile to offer a gentle, age-aware answer. For “${message}”, a helpful next step is to observe how your baby is feeding, sleeping, and settling, then contact your pediatrician if you are concerned.`, followUpQuestion: "When did you first notice this?", urgency: "normal", suggestedActions: ["Notice changes in feeding, sleep, and comfort.", "Write down anything that seems different."], disclaimer: "Demo response — Gemini is not connected. Pilu provides general parenting information and does not replace medical advice.", demo: true };
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`, { method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal, body: JSON.stringify({ systemInstruction: { parts: [{ text: PILU_SYSTEM_PROMPT }] }, contents: [{ role: "user", parts: [{ text: `Baby context: ${JSON.stringify(babyContext)}\n\nParent question: ${message}` }] }], generationConfig: { responseMimeType: "application/json", responseSchema } }) });
    if (!response.ok) throw new Error("Gemini request failed");
    const payload = await response.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return safeFallbackResponse();
    try { return validatePiluResponse(JSON.parse(text)) ?? safeFallbackResponse(); } catch { return safeFallbackResponse(); }
  } finally { clearTimeout(timeout); }
}

import { defaultLocale, type Locale } from "@/lib/i18n/locales";
import { dictionaries } from "@/lib/i18n/translations";
import type { ChatUrgency, PiluResponse } from "@/types/chat";

const urgency = new Set<ChatUrgency>(["normal", "contact_doctor", "urgent"]);
export function validatePiluResponse(value: unknown): PiluResponse | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (typeof data.answer !== "string" || !data.answer.trim() || typeof data.disclaimer !== "string" || !urgency.has(data.urgency as ChatUrgency)) return null;
  return { answer: data.answer.trim(), followUpQuestion: typeof data.followUpQuestion === "string" ? data.followUpQuestion : null, urgency: data.urgency as ChatUrgency, suggestedActions: Array.isArray(data.suggestedActions) ? data.suggestedActions.filter((item): item is string => typeof item === "string").slice(0, 4) : [], disclaimer: data.disclaimer };
}

export function safeFallbackResponse(locale: Locale = defaultLocale): PiluResponse {
  const { safeFallback } = dictionaries[locale].gemini;
  return { answer: safeFallback.answer, followUpQuestion: safeFallback.followUpQuestion, urgency: "normal", suggestedActions: [safeFallback.action], disclaimer: safeFallback.disclaimer };
}

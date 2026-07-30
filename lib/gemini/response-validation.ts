import type { ChatUrgency, PiluResponse } from "@/types/chat";

const urgency = new Set<ChatUrgency>(["normal", "contact_doctor", "urgent"]);
export function validatePiluResponse(value: unknown): PiluResponse | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (typeof data.answer !== "string" || !data.answer.trim() || typeof data.disclaimer !== "string" || !urgency.has(data.urgency as ChatUrgency)) return null;
  return { answer: data.answer.trim(), followUpQuestion: typeof data.followUpQuestion === "string" ? data.followUpQuestion : null, urgency: data.urgency as ChatUrgency, suggestedActions: Array.isArray(data.suggestedActions) ? data.suggestedActions.filter((item): item is string => typeof item === "string").slice(0, 4) : [], disclaimer: data.disclaimer };
}

export function safeFallbackResponse(): PiluResponse { return { answer: "Pilu can share general parenting information, but I couldn’t prepare a full answer right now. If you are worried about your baby, it is always okay to contact your pediatrician.", followUpQuestion: "Would you like to share when this started and how your baby seems otherwise?", urgency: "normal", suggestedActions: ["Observe any changes in feeding, sleep, or comfort."], disclaimer: "Pilu provides general parenting information and does not replace medical advice." }; }

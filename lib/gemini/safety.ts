import type { ChatUrgency, PiluResponse } from "@/types/chat";

const urgentPatterns = [/not breathing/i, /blue lips/i, /severe choking/i, /unconscious/i, /seizure/i, /poison(?:ing)?/i, /serious allergic reaction/i, /newborn.{0,24}(?:high fever|fever.{0,8}3[89])/i];
const doctorPatterns = [/fever/i, /rash/i, /vomit(?:ing)?/i, /diarrh(?:ea)?/i, /not feeding/i, /dehydrat/i];

export function getMessageUrgency(message: string): ChatUrgency { if (urgentPatterns.some((pattern) => pattern.test(message))) return "urgent"; if (doctorPatterns.some((pattern) => pattern.test(message))) return "contact_doctor"; return "normal"; }
export function urgentSafetyResponse(): PiluResponse { return { answer: "This could be urgent. Please contact your local emergency services immediately, or seek emergency care now. If it is safe to do so, stay with your baby and follow any instructions from emergency professionals.", followUpQuestion: null, urgency: "urgent", suggestedActions: ["Contact local emergency services immediately.", "Do not wait for an online answer before seeking urgent help."], disclaimer: "This is general safety guidance, not a diagnosis." }; }

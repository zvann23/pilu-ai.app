import { defaultLocale, type Locale } from "@/lib/i18n/locales";
import { dictionaries } from "@/lib/i18n/translations";
import type { ChatUrgency, PiluResponse } from "@/types/chat";

const urgentPatterns = [
  /not breathing/i, /blue lips/i, /severe choking/i, /unconscious/i, /seizure/i, /poison(?:ing)?/i, /serious allergic reaction/i, /newborn.{0,24}(?:high fever|fever.{0,8}3[89])/i,
  /nu respir[ăa]/i, /buze vinete/i, /sufocare severă/i, /inconștient/i, /convulsi[ei]/i, /otr[ăa]vi/i, /reacție alergică severă/i, /nou-n[ăa]scut.{0,24}febră mare/i,
  /no respira/i, /labios azules/i, /(?:atragantamiento|asfixia) severa/i, /inconsciente/i, /convulsi[oó]n/i, /(?:envenenamiento|intoxicaci[oó]n)/i, /reacci[oó]n alérgica grave/i, /rec[ié]en nacido.{0,24}fiebre alta/i,
];
const doctorPatterns = [
  /fever/i, /rash/i, /vomit(?:ing)?/i, /diarrh(?:ea)?/i, /not feeding/i, /dehydrat/i,
  /febr[ăa]/i, /erupți[ei]/i, /vomit[ăa]/i, /diaree/i, /nu (?:mănâncă|se hrănește)/i, /deshidrat/i,
  /fiebre/i, /(?:sarpullido|erupci[oó]n)/i, /vomit/i, /diarrea/i, /no (?:come|se alimenta)/i, /deshidrat/i,
];

export function getMessageUrgency(message: string): ChatUrgency { if (urgentPatterns.some((pattern) => pattern.test(message))) return "urgent"; if (doctorPatterns.some((pattern) => pattern.test(message))) return "contact_doctor"; return "normal"; }

export function urgentSafetyResponse(locale: Locale = defaultLocale): PiluResponse {
  const { urgentSafety } = dictionaries[locale].gemini;
  return { answer: urgentSafety.answer, followUpQuestion: null, urgency: "urgent", suggestedActions: [urgentSafety.action1, urgentSafety.action2], disclaimer: urgentSafety.disclaimer };
}

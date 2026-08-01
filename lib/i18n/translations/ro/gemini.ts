import type { GeminiDict } from "@/lib/i18n/dictionary/gemini";

export const gemini = {
  demo: {
    answerTemplate: "Mod demo: Pilu ar folosi profilul lui {name} pentru a oferi un răspuns blând, adaptat vârstei. Pentru „{message}”, un pas util este să observi cum se hrănește, doarme și se liniștește bebelușul tău, apoi să contactezi medicul pediatru dacă ești îngrijorat(ă).",
    followUpQuestion: "Când ai observat asta pentru prima dată?",
    action1: "Observă schimbări în hrănire, somn și confort.",
    action2: "Notează orice pare diferit.",
    disclaimer: "Răspuns demo — Gemini nu este conectat. Pilu oferă informații generale pentru părinți și nu înlocuiește sfatul medical.",
  },
  safeFallback: {
    answer: "Pilu poate oferi informații generale pentru părinți, dar nu am putut pregăti un răspuns complet chiar acum. Dacă ești îngrijorat(ă) pentru bebelușul tău, este oricând în regulă să contactezi medicul pediatru.",
    followUpQuestion: "Vrei să îmi spui când a început acest lucru și cum pare bebelușul altfel?",
    action: "Observă orice schimbare în hrănire, somn sau confort.",
    disclaimer: "Pilu oferă informații generale pentru părinți și nu înlocuiește sfatul medical.",
  },
  urgentSafety: {
    answer: "Aceasta ar putea fi o urgență. Te rugăm să contactezi imediat serviciile locale de urgență sau să soliciți îngrijire de urgență acum. Dacă este sigur, rămâi lângă bebelușul tău și urmează instrucțiunile profesioniștilor de urgență.",
    action1: "Contactează imediat serviciile locale de urgență.",
    action2: "Nu aștepta un răspuns online înainte de a căuta ajutor urgent.",
    disclaimer: "Acesta este un sfat general de siguranță, nu un diagnostic.",
  },
  routeErrors: {
    rateLimited: "Pilu are nevoie de o mică pauză. Te rugăm să încerci din nou peste un minut.",
    badRequest: "Te rugăm să scrii o întrebare scurtă pentru Pilu.",
    serverError: "Pilu nu a putut răspunde chiar acum. Te rugăm să încerci din nou.",
  },
} satisfies GeminiDict;

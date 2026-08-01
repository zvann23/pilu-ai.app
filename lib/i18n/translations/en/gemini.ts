import type { GeminiDict } from "@/lib/i18n/dictionary/gemini";

export const gemini = {
  demo: {
    answerTemplate: "Demo mode: Pilu would use {name}'s profile to offer a gentle, age-aware answer. For \"{message}\", a helpful next step is to observe how your baby is feeding, sleeping, and settling, then contact your pediatrician if you are concerned.",
    followUpQuestion: "When did you first notice this?",
    action1: "Notice changes in feeding, sleep, and comfort.",
    action2: "Write down anything that seems different.",
    disclaimer: "Demo response — Gemini is not connected. Pilu provides general parenting information and does not replace medical advice.",
  },
  safeFallback: {
    answer: "Pilu can share general parenting information, but I couldn't prepare a full answer right now. If you are worried about your baby, it is always okay to contact your pediatrician.",
    followUpQuestion: "Would you like to share when this started and how your baby seems otherwise?",
    action: "Observe any changes in feeding, sleep, or comfort.",
    disclaimer: "Pilu provides general parenting information and does not replace medical advice.",
  },
  urgentSafety: {
    answer: "This could be urgent. Please contact your local emergency services immediately, or seek emergency care now. If it is safe to do so, stay with your baby and follow any instructions from emergency professionals.",
    action1: "Contact local emergency services immediately.",
    action2: "Do not wait for an online answer before seeking urgent help.",
    disclaimer: "This is general safety guidance, not a diagnosis.",
  },
  routeErrors: {
    rateLimited: "Pilu needs a small pause. Please try again in a minute.",
    badRequest: "Please write a short question for Pilu.",
    serverError: "Pilu couldn't answer right now. Please try again.",
  },
} satisfies GeminiDict;

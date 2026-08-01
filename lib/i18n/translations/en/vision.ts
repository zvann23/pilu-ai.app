import type { VisionDict } from "@/lib/i18n/dictionary/vision";

export const vision = {
  header: { eyebrow: "Pilu Vision", title: "Scan it, understand it", subtitle: "Food, bottles, labels, ingredients, toys, and baby products — Pilu Vision reads the photo and explains what it sees." },
  categoryPickerAriaLabel: "Scan category",
  categoryLabels: { food: "Food", bottle: "Bottle", label: "Label", ingredients: "Ingredients", toy: "Toy", baby_product: "Baby product", rash: "Rash analysis", skin: "Skin observations", stool: "Stool observations" },
  soonSuffix: "Soon",
  soonTitle: "Coming soon",
  analyzing: "Analyzing…",
  takePhoto: "Take photo",
  chooseFromGallery: "Choose from gallery",
  quota: { unlimited: "Unlimited scans with your plan.", remainingTemplate: "{remaining} of {total} free scans left today.", upgrade: " Upgrade for unlimited" },
  result: { removeFromSaved: "Remove from saved scans", saveThisScan: "Save this scan", worthDoubleChecking: "Worth double-checking" },
  history: { historyTab: "History", savedTab: "Saved scans", listsAriaLabel: "Scan lists", emptySaved: "Nothing saved yet — tap the heart on a scan to keep it here.", emptyHistory: "Your scans will appear here.", deleteThisScan: "Delete this scan" },
  errors: {
    analyzeFailed: "Pilu Vision couldn't analyze this photo right now. Please try again.",
    rateLimited: "Pilu needs a small pause before analyzing another photo. Please try again in a minute.",
    photoRequired: "A photo is required.",
    categoryUnavailable: "This scan type isn't available yet.",
    authRequired: "Authentication is required",
    familyRequired: "You need a family before using Pilu Vision",
    babyRequired: "Add your baby's profile before using Pilu Vision",
    freeLimitTemplate: "Free plans include {limit} Pilu Vision scans per day — upgrade to Elite for unlimited scans.",
    saveFailed: "Pilu Vision analyzed this photo but couldn't save it. Please try again.",
  },
  demo: {
    titleTemplate: "Demo mode: {label} scan",
    summaryTemplate: "Demo mode: Pilu Vision would identify what's in this {label} photo here. Gemini is not connected, so this is a placeholder.",
    keyPoint: "Demo mode: notable details from the photo would appear here.",
    recommendation: "Demo mode: gentle next-step guidance would appear here.",
    disclaimer: "Demo response — Gemini is not connected. Pilu Vision provides general information and does not replace medical advice.",
  },
  safeFallback: {
    title: "Pilu couldn't read this photo",
    summary: "Pilu wasn't able to prepare a full analysis for this photo right now. A clear, well-lit photo of the front of the item or label usually works best.",
    recommendation: "Try again with a clearer photo, or check the packaging directly. If you're concerned about a health or safety question, it's always okay to contact your pediatrician.",
    disclaimer: "Pilu Vision provides general information and does not replace medical advice or professional product safety guidance.",
  },
} satisfies VisionDict;

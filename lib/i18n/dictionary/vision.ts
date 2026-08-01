import type { VisionCategory } from "@/types/vision";

export type VisionDict = {
  header: { eyebrow: string; title: string; subtitle: string };
  categoryPickerAriaLabel: string;
  categoryLabels: Record<VisionCategory, string>;
  soonSuffix: string;
  soonTitle: string;
  analyzing: string;
  takePhoto: string;
  chooseFromGallery: string;
  quota: { unlimited: string; remainingTemplate: string; upgrade: string };
  result: { removeFromSaved: string; saveThisScan: string; worthDoubleChecking: string };
  history: { historyTab: string; savedTab: string; listsAriaLabel: string; emptySaved: string; emptyHistory: string; deleteThisScan: string };
  errors: { analyzeFailed: string; rateLimited: string; photoRequired: string; categoryUnavailable: string; authRequired: string; familyRequired: string; babyRequired: string; freeLimitTemplate: string; saveFailed: string };
  demo: { titleTemplate: string; summaryTemplate: string; keyPoint: string; recommendation: string; disclaimer: string };
  safeFallback: { title: string; summary: string; recommendation: string; disclaimer: string };
};

"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { OnboardingFlow } from "@/components/auth/onboarding-flow";
import { useLocale } from "@/components/i18n/locale-provider";

export default function OnboardingPage() {
  const { t } = useLocale();
  const ad = t((d) => d.auth.onboarding);
  return (
    <AuthShell eyebrow={ad.eyebrow} title={ad.title} subtitle={ad.subtitle}>
      <OnboardingFlow />
    </AuthShell>
  );
}

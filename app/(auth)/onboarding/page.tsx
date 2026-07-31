import { AuthShell } from "@/components/auth/auth-shell";
import { OnboardingFlow } from "@/components/auth/onboarding-flow";

export default function OnboardingPage() {
  return (
    <AuthShell eyebrow="Almost there" title="Set up your family" subtitle="A few quick steps and Pilu is ready for you.">
      <OnboardingFlow />
    </AuthShell>
  );
}

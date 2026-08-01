"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { useLocale } from "@/components/i18n/locale-provider";

export default function SignUpPage() {
  const { t } = useLocale();
  const ad = t((d) => d.auth.signUp);
  return (
    <AuthShell eyebrow={ad.eyebrow} title={ad.title} subtitle={ad.subtitle}>
      <SignUpForm />
    </AuthShell>
  );
}

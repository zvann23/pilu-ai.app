"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { useLocale } from "@/components/i18n/locale-provider";
import { Suspense } from "react";

export default function LoginPage() {
  const { t } = useLocale();
  const ad = t((d) => d.auth.login);
  return (
    <AuthShell eyebrow={ad.eyebrow} title={ad.title} subtitle={ad.subtitle}>
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

// LoginForm reads useSearchParams(), which forces this subtree behind a
// Suspense boundary. A same-shaped fallback (rather than null) keeps the
// vertically-centered auth shell from jumping once the real form mounts.
function LoginFormFallback() {
  const { t } = useLocale();
  const ad = t((d) => d.auth.login);
  return (
    <div className="auth-form" aria-hidden="true">
      <div className="google-button" />
      <div className="auth-form__divider"><span>{ad.or}</span></div>
      <label>{ad.emailLabel}<input type="email" disabled /></label>
      <label>{ad.passwordLabel}<input type="password" disabled /></label>
      <button type="button" className="button button--primary" disabled>{ad.signIn}</button>
      <p className="auth-form__switch">{ad.newToPilu} <span>{ad.createAccount}</span></p>
    </div>
  );
}

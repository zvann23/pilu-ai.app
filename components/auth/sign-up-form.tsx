"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { trackAccountCreated } from "@/lib/analytics/analytics-service";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { GoogleButton } from "./google-button";

export function SignUpForm() {
  const { t } = useLocale();
  const ad = t((d) => d.auth.signUp);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError(ad.passwordTooShort);
      return;
    }
    setIsSubmitting(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setIsSubmitting(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    trackAccountCreated("password");
    if (data.session) {
      router.push("/onboarding");
      router.refresh();
      return;
    }
    // No session back means Supabase requires email confirmation before sign-in.
    setConfirmationSent(true);
  }

  if (confirmationSent) {
    const [before, after] = ad.confirmationSentTemplate.split("{email}");
    return (
      <div className="auth-form">
        <p className="auth-form__confirmation">{before}<strong>{email}</strong>{after}</p>
        <Link href="/login" className="button button--secondary">{ad.backToSignIn}</Link>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <GoogleButton />
      <div className="auth-form__divider"><span>{ad.or}</span></div>
      <label>{ad.emailLabel}<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label>{ad.passwordLabel}<input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /></label>
      {error ? <p className="auth-form__error">{error}</p> : null}
      <button type="submit" className="button button--primary" disabled={isSubmitting}>{isSubmitting ? ad.creatingAccount : ad.createAccount}</button>
      <p className="auth-form__switch">{ad.alreadyHaveAccount} <Link href="/login">{ad.signIn}</Link></p>
      <p className="auth-form__switch"><Link href="/privacy-policy">{ad.privacyPolicy}</Link></p>
    </form>
  );
}

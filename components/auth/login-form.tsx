"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { trackLogin } from "@/lib/analytics/analytics-service";
import { supabase } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { GoogleButton } from "./google-button";

export function LoginForm() {
  const { t } = useLocale();
  const ad = t((d) => d.auth.login);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const callbackError = searchParams.get("error") === "auth-callback-failed" ? ad.callbackFailed : null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setIsSubmitting(false);
    if (signInError) {
      setError(signInError.message === "Invalid login credentials" ? ad.invalidCredentials : signInError.message);
      return;
    }
    trackLogin("password");
    router.push(searchParams.get("next") || "/home");
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <GoogleButton />
      <div className="auth-form__divider"><span>{ad.or}</span></div>
      <label>{ad.emailLabel}<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label>{ad.passwordLabel}<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
      {(error || callbackError) ? <p className="auth-form__error">{error || callbackError}</p> : null}
      <button type="submit" className="button button--primary" disabled={isSubmitting}>{isSubmitting ? ad.signingIn : ad.signIn}</button>
      <p className="auth-form__switch">{ad.newToPilu} <Link href="/sign-up">{ad.createAccount}</Link></p>
    </form>
  );
}

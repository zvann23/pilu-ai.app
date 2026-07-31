"use client";

import { trackAccountCreated } from "@/lib/analytics/analytics-service";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { GoogleButton } from "./google-button";

export function SignUpForm() {
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
      setError("Password must be at least 8 characters.");
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
    return (
      <div className="auth-form">
        <p className="auth-form__confirmation">Check <strong>{email}</strong> for a confirmation link to finish creating your account.</p>
        <Link href="/login" className="button button--secondary">Back to sign in</Link>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <GoogleButton />
      <div className="auth-form__divider"><span>or</span></div>
      <label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label>Password<input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /></label>
      {error ? <p className="auth-form__error">{error}</p> : null}
      <button type="submit" className="button button--primary" disabled={isSubmitting}>{isSubmitting ? "Creating account…" : "Create account"}</button>
      <p className="auth-form__switch">Already have an account? <Link href="/login">Sign in</Link></p>
    </form>
  );
}

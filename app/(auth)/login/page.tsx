import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <AuthShell eyebrow="Welcome back" title="Sign in to Pilu" subtitle="Your baby's calm companion, right where you left it.">
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
  return (
    <div className="auth-form" aria-hidden="true">
      <div className="google-button" />
      <div className="auth-form__divider"><span>or</span></div>
      <label>Email<input type="email" disabled /></label>
      <label>Password<input type="password" disabled /></label>
      <button type="button" className="button button--primary" disabled>Sign in</button>
      <p className="auth-form__switch">New to Pilu? <span>Create an account</span></p>
    </div>
  );
}

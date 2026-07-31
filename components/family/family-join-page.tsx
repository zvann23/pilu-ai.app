"use client";

import { Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useFamilyContext } from "./family-provider";

export function FamilyJoinPage() {
  const { family, isMutating, error, join, clearError } = useFamilyContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [code, setCode] = useState(searchParams.get("code") ?? "");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (joined && family) {
      const timeout = window.setTimeout(() => router.push("/family"), 1200);
      return () => window.clearTimeout(timeout);
    }
  }, [joined, family, router]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    clearError();
    if (!code.trim()) return;
    const result = await join(code.trim());
    if (result !== null) setJoined(true);
  }

  if (joined) {
    return (
      <div className="family-onboarding">
        <Users size={26} aria-hidden="true" />
        <h2>You&apos;re in!</h2>
        <p>Taking you to your family now…</p>
      </div>
    );
  }

  return (
    <div className="family-onboarding">
      <Users size={26} aria-hidden="true" />
      <h2>Join a family</h2>
      <p>Enter the invite code someone shared with you.</p>
      <form onSubmit={submit}>
        <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Invite code" maxLength={40} autoFocus />
        {error ? <p className="family-onboarding__error">{error}</p> : null}
        <button type="submit" className="button button--primary" disabled={isMutating}>{isMutating ? "Joining…" : "Join family"}</button>
      </form>
    </div>
  );
}

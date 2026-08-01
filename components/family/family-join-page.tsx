"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useFamilyContext } from "./family-provider";

export function FamilyJoinPage() {
  const { t } = useLocale();
  const fd = t((d) => d.family.join);
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
        <h2>{fd.joinedHeading}</h2>
        <p>{fd.joinedBody}</p>
      </div>
    );
  }

  return (
    <div className="family-onboarding">
      <Users size={26} aria-hidden="true" />
      <h2>{fd.heading}</h2>
      <p>{fd.body}</p>
      <form onSubmit={submit}>
        <input value={code} onChange={(event) => setCode(event.target.value)} placeholder={fd.placeholder} maxLength={40} autoFocus />
        {error ? <p className="family-onboarding__error">{error}</p> : null}
        <button type="submit" className="button button--primary" disabled={isMutating}>{isMutating ? fd.joining : fd.joinFamily}</button>
      </form>
    </div>
  );
}

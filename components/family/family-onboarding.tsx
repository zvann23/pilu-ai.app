"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { Users } from "lucide-react";
import { useState, type FormEvent } from "react";

export function FamilyOnboarding({
  isMutating, error, onCreate, onJoin,
}: {
  isMutating: boolean;
  error: string | null;
  onCreate: (name: string) => void;
  onJoin: (code: string) => void;
}) {
  const { t } = useLocale();
  const fd = t((d) => d.family.onboarding);
  const [mode, setMode] = useState<"create" | "join">("create");
  const [familyName, setFamilyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (mode === "create") {
      if (familyName.trim()) onCreate(familyName.trim());
    } else if (inviteCode.trim()) {
      onJoin(inviteCode.trim());
    }
  }

  return (
    <div className="family-onboarding">
      <Users size={26} aria-hidden="true" />
      <h2>{fd.heading}</h2>
      <p>{fd.body}</p>

      <div className="family-onboarding__toggle" role="tablist" aria-label={fd.toggleAriaLabel}>
        <button type="button" role="tab" aria-selected={mode === "create"} className={mode === "create" ? "family-onboarding__toggle-button family-onboarding__toggle-button--active" : "family-onboarding__toggle-button"} onClick={() => setMode("create")}>{fd.createTab}</button>
        <button type="button" role="tab" aria-selected={mode === "join"} className={mode === "join" ? "family-onboarding__toggle-button family-onboarding__toggle-button--active" : "family-onboarding__toggle-button"} onClick={() => setMode("join")}>{fd.joinTab}</button>
      </div>

      <form onSubmit={submit}>
        {mode === "create" ? (
          <input value={familyName} onChange={(event) => setFamilyName(event.target.value)} placeholder={fd.createPlaceholder} maxLength={80} />
        ) : (
          <input value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} placeholder={fd.joinPlaceholder} maxLength={40} />
        )}
        {error ? <p className="family-onboarding__error">{error}</p> : null}
        <button type="submit" className="button button--primary" disabled={isMutating}>
          {isMutating ? fd.pleaseWait : mode === "create" ? fd.createFamily : fd.joinFamily}
        </button>
      </form>
    </div>
  );
}

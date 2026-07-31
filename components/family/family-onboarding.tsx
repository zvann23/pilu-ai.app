"use client";

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
      <h2>Bring your family together</h2>
      <p>Create a family to invite trusted caregivers, or join one with an invite code.</p>

      <div className="family-onboarding__toggle" role="tablist" aria-label="Create or join a family">
        <button type="button" role="tab" aria-selected={mode === "create"} className={mode === "create" ? "family-onboarding__toggle-button family-onboarding__toggle-button--active" : "family-onboarding__toggle-button"} onClick={() => setMode("create")}>Create a family</button>
        <button type="button" role="tab" aria-selected={mode === "join"} className={mode === "join" ? "family-onboarding__toggle-button family-onboarding__toggle-button--active" : "family-onboarding__toggle-button"} onClick={() => setMode("join")}>Join a family</button>
      </div>

      <form onSubmit={submit}>
        {mode === "create" ? (
          <input value={familyName} onChange={(event) => setFamilyName(event.target.value)} placeholder="e.g. The Popescu Family" maxLength={80} />
        ) : (
          <input value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} placeholder="Enter your invite code" maxLength={40} />
        )}
        {error ? <p className="family-onboarding__error">{error}</p> : null}
        <button type="submit" className="button button--primary" disabled={isMutating}>
          {isMutating ? "Please wait…" : mode === "create" ? "Create family" : "Join family"}
        </button>
      </form>
    </div>
  );
}

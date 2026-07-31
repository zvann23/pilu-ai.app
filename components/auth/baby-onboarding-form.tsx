"use client";

import type { Baby } from "@/lib/supabase/babies-repository";
import { Baby as BabyIcon } from "lucide-react";
import { useState, type FormEvent } from "react";

export function BabyOnboardingForm({ isSaving, error, onSave }: { isSaving: boolean; error: string | null; onSave: (draft: { firstName: string; dateOfBirth?: string; biologicalSex?: Baby["biologicalSex"] }) => void }) {
  const [firstName, setFirstName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [biologicalSex, setBiologicalSex] = useState<NonNullable<Baby["biologicalSex"]>>("not_specified");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!firstName.trim()) return;
    onSave({ firstName: firstName.trim(), dateOfBirth: dateOfBirth || undefined, biologicalSex });
  }

  return (
    <div className="family-onboarding">
      <BabyIcon size={26} aria-hidden="true" />
      <h2>Tell us about your baby</h2>
      <p>This creates your baby&apos;s real profile in Pilu.</p>
      <form onSubmit={submit}>
        <input aria-label="Baby's name" value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Baby's name" maxLength={80} required />
        <input aria-label="Date of birth" type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} max={new Date().toISOString().slice(0, 10)} />
        <select aria-label="Biological sex" value={biologicalSex} onChange={(event) => setBiologicalSex(event.target.value as NonNullable<Baby["biologicalSex"]>)}>
          <option value="not_specified">Prefer not to say</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="intersex">Intersex</option>
        </select>
        {error ? <p className="family-onboarding__error">{error}</p> : null}
        <button type="submit" className="button button--primary" disabled={isSaving}>{isSaving ? "Saving…" : "Continue"}</button>
      </form>
    </div>
  );
}

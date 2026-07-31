"use client";

import type { Baby, BabyDraft } from "@/lib/supabase/babies-repository";
import { Baby as BabyIcon } from "lucide-react";
import { useState, type FormEvent } from "react";

export function BabyOnboardingForm({ isSaving, error, onSave }: { isSaving: boolean; error: string | null; onSave: (draft: BabyDraft) => void }) {
  const [firstName, setFirstName] = useState("");
  const [nickname, setNickname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [biologicalSex, setBiologicalSex] = useState<NonNullable<Baby["biologicalSex"]>>("not_specified");
  const [birthWeightKg, setBirthWeightKg] = useState("");
  const [birthLengthCm, setBirthLengthCm] = useState("");
  const [motherName, setMotherName] = useState("");
  const [fatherName, setFatherName] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!firstName.trim()) return;
    onSave({
      firstName: firstName.trim(),
      nickname: nickname.trim() || undefined,
      dateOfBirth: dateOfBirth || undefined,
      biologicalSex,
      birthWeightGrams: birthWeightKg ? Math.round(Number(birthWeightKg) * 1000) : undefined,
      birthLengthCm: birthLengthCm ? Number(birthLengthCm) : undefined,
      motherName: motherName.trim() || undefined,
      fatherName: fatherName.trim() || undefined,
    });
  }

  return (
    <div className="family-onboarding baby-onboarding">
      <BabyIcon size={26} aria-hidden="true" />
      <h2>Tell us about your baby</h2>
      <p>This creates your baby&apos;s real profile in Pilu. Only their name is required — add the rest whenever you&apos;re ready.</p>
      <form className="auth-form baby-onboarding__form" onSubmit={submit}>
        <label>
          <span>Baby&apos;s name</span>
          <input value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Baby's name" maxLength={80} required />
        </label>
        <label>
          <span>Nickname <em>Optional</em></span>
          <input value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="What you usually call them" maxLength={80} />
        </label>
        <label>
          <span>Date of birth <em>Optional</em></span>
          <input type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} max={new Date().toISOString().slice(0, 10)} />
        </label>
        <label>
          <span>Sex <em>Optional</em></span>
          <select value={biologicalSex} onChange={(event) => setBiologicalSex(event.target.value as NonNullable<Baby["biologicalSex"]>)}>
            <option value="not_specified">Prefer not to say</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="intersex">Intersex</option>
          </select>
        </label>
        <label>
          <span>Birth weight (kg) <em>Optional</em></span>
          <input type="number" step="0.01" min="0" value={birthWeightKg} onChange={(event) => setBirthWeightKg(event.target.value)} placeholder="3.25" />
        </label>
        <label>
          <span>Birth length (cm) <em>Optional</em></span>
          <input type="number" step="0.1" min="0" value={birthLengthCm} onChange={(event) => setBirthLengthCm(event.target.value)} placeholder="50" />
        </label>
        <label>
          <span>Mom&apos;s name <em>Optional</em></span>
          <input value={motherName} onChange={(event) => setMotherName(event.target.value)} placeholder="Mom's name" maxLength={120} />
        </label>
        <label>
          <span>Dad&apos;s name <em>Optional</em></span>
          <input value={fatherName} onChange={(event) => setFatherName(event.target.value)} placeholder="Dad's name" maxLength={120} />
        </label>
        {error ? <p className="family-onboarding__error">{error}</p> : null}
        <button type="submit" className="button button--primary" disabled={isSaving}>{isSaving ? "Saving…" : "Continue"}</button>
      </form>
    </div>
  );
}

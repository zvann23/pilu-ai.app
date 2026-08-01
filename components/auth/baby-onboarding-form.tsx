"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import type { Baby, BabyDraft } from "@/lib/supabase/babies-repository";
import { Baby as BabyIcon } from "lucide-react";
import { useState, type FormEvent } from "react";

export function BabyOnboardingForm({ isSaving, error, onSave }: { isSaving: boolean; error: string | null; onSave: (draft: BabyDraft) => void }) {
  const { t } = useLocale();
  const ad = t((d) => d.auth.babyForm);
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
      <h2>{ad.heading}</h2>
      <p>{ad.body}</p>
      <form className="auth-form baby-onboarding__form" onSubmit={submit}>
        <label>
          <span>{ad.nameLabel}</span>
          <input value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder={ad.namePlaceholder} maxLength={80} required />
        </label>
        <label>
          <span>{ad.nicknameLabel} <em>{ad.optional}</em></span>
          <input value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder={ad.nicknamePlaceholder} maxLength={80} />
        </label>
        <label>
          <span>{ad.dobLabel} <em>{ad.optional}</em></span>
          <input type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} max={new Date().toISOString().slice(0, 10)} />
        </label>
        <label>
          <span>{ad.sexLabel} <em>{ad.optional}</em></span>
          <select value={biologicalSex} onChange={(event) => setBiologicalSex(event.target.value as NonNullable<Baby["biologicalSex"]>)}>
            <option value="not_specified">{ad.sexNotSpecified}</option>
            <option value="female">{ad.sexFemale}</option>
            <option value="male">{ad.sexMale}</option>
            <option value="intersex">{ad.sexIntersex}</option>
          </select>
        </label>
        <label>
          <span>{ad.birthWeightLabel} <em>{ad.optional}</em></span>
          <input type="number" step="0.01" min="0" value={birthWeightKg} onChange={(event) => setBirthWeightKg(event.target.value)} placeholder="3.25" />
        </label>
        <label>
          <span>{ad.birthLengthLabel} <em>{ad.optional}</em></span>
          <input type="number" step="0.1" min="0" value={birthLengthCm} onChange={(event) => setBirthLengthCm(event.target.value)} placeholder="50" />
        </label>
        <label>
          <span>{ad.motherNameLabel} <em>{ad.optional}</em></span>
          <input value={motherName} onChange={(event) => setMotherName(event.target.value)} placeholder={ad.motherNamePlaceholder} maxLength={120} />
        </label>
        <label>
          <span>{ad.fatherNameLabel} <em>{ad.optional}</em></span>
          <input value={fatherName} onChange={(event) => setFatherName(event.target.value)} placeholder={ad.fatherNamePlaceholder} maxLength={120} />
        </label>
        {error ? <p className="family-onboarding__error">{error}</p> : null}
        <button type="submit" className="button button--primary" disabled={isSaving}>{isSaving ? ad.saving : ad.continueLabel}</button>
      </form>
    </div>
  );
}

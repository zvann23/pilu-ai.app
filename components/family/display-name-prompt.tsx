"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";

export function DisplayNamePrompt({ onSave }: { onSave: (name: string) => Promise<void> }) {
  const { t } = useLocale();
  const fd = t((d) => d.family.displayNamePrompt);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError(fd.errorEmptyName);
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await onSave(name.trim());
    } catch {
      setError(fd.errorSaveFailed);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="display-name-prompt">
      <Sparkles size={22} aria-hidden="true" />
      <h2>{fd.heading}</h2>
      <p>{fd.body}</p>
      <form onSubmit={submit}>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder={fd.placeholder} maxLength={40} />
        {error ? <p className="display-name-prompt__error">{error}</p> : null}
        <button type="submit" className="button button--primary" disabled={isSaving}>{isSaving ? fd.saving : fd.continueLabel}</button>
      </form>
    </div>
  );
}

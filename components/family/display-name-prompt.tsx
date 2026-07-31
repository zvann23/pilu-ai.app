"use client";

import { Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";

export function DisplayNamePrompt({ onSave }: { onSave: (name: string) => Promise<void> }) {
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Please tell us what to call you.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await onSave(name.trim());
    } catch {
      setError("Could not save your name. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="display-name-prompt">
      <Sparkles size={22} aria-hidden="true" />
      <h2>What should we call you?</h2>
      <p>Other family members will see this name on shared updates — like &quot;Mom added a feeding.&quot;</p>
      <form onSubmit={submit}>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Mom, Dad, Grandma, or your name" maxLength={40} />
        {error ? <p className="display-name-prompt__error">{error}</p> : null}
        <button type="submit" className="button button--primary" disabled={isSaving}>{isSaving ? "Saving…" : "Continue"}</button>
      </form>
    </div>
  );
}

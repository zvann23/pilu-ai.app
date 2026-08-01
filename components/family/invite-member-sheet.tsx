"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import type { FamilyInvitation, InvitableRole } from "@/types/family";
import { Check, Copy, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

export function InviteMemberSheet({
  open, isMutating, error, onClose, onInvite,
}: {
  open: boolean;
  isMutating: boolean;
  error?: string | null;
  onClose: () => void;
  onInvite: (options: { email?: string; role: InvitableRole }) => Promise<FamilyInvitation | null>;
}) {
  const { t } = useLocale();
  const fd = t((d) => d.family.inviteSheet);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InvitableRole>("caregiver");
  const [created, setCreated] = useState<FamilyInvitation | null>(null);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleClose is stable enough for this dialog's lifetime
  }, [open]);

  if (!open) return null;

  const inviteLink = created ? (typeof window !== "undefined" ? `${window.location.origin}/family/join?code=${created.inviteCode}` : "") : "";

  function handleClose() {
    setCreated(null);
    setCopied(null);
    onClose();
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const invitation = await onInvite({ email: email.trim() || undefined, role });
    if (invitation) setCreated(invitation);
  }

  async function copy(value: string, kind: "code" | "link") {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="bottom-sheet-layer bottom-sheet-layer--open">
      <button className="bottom-sheet-overlay" type="button" onClick={handleClose} aria-label={fd.closeSheetAria} />
      <section className="invite-sheet" role="dialog" aria-modal="true" aria-labelledby="invite-sheet-title">
        <div className="invite-sheet__top">
          <span aria-hidden="true" />
          <h2 id="invite-sheet-title">{fd.heading}</h2>
          <button ref={closeButton} type="button" className="icon-button icon-button--soft" onClick={handleClose} aria-label={fd.closeAria}><X size={20} aria-hidden="true" /></button>
        </div>

        {!created ? (
          <form onSubmit={submit}>
            <p className="invite-sheet__intro">{fd.roleIntro}</p>
            <label>{fd.emailLabel} <em>{fd.optional}</em>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={fd.emailPlaceholder} />
            </label>
            <fieldset className="invite-sheet__role">
              <legend>{fd.roleLegend}</legend>
              <button type="button" className={role === "caregiver" ? "invite-sheet__role-option invite-sheet__role-option--active" : "invite-sheet__role-option"} onClick={() => setRole("caregiver")}>{fd.caregiver}</button>
              <button type="button" className={role === "parent" ? "invite-sheet__role-option invite-sheet__role-option--active" : "invite-sheet__role-option"} onClick={() => setRole("parent")}>{fd.parent}</button>
            </fieldset>
            {error ? <p className="family-onboarding__error">{error}</p> : null}
            <button type="submit" className="button button--primary" disabled={isMutating}>{isMutating ? fd.creatingInvite : fd.createInvite}</button>
          </form>
        ) : (
          <div className="invite-result">
            <p>{created.email ? fd.inviteCreatedForTemplate.replace("{email}", created.email) : fd.inviteCreated} {fd.shareHint}</p>
            <div className="invite-result__row">
              <span>{created.inviteCode}</span>
              <button type="button" onClick={() => copy(created.inviteCode, "code")}>{copied === "code" ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{fd.copyCode}</button>
            </div>
            <div className="invite-result__row">
              <span>{inviteLink}</span>
              <button type="button" onClick={() => copy(inviteLink, "link")}>{copied === "link" ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{fd.copyLink}</button>
            </div>
            <button type="button" className="button button--secondary" onClick={handleClose}>{fd.done}</button>
          </div>
        )}
      </section>
    </div>
  );
}

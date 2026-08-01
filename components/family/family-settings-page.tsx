"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { familyRoles } from "@/types/family";
import { LogOut, Settings, UserPlus, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ConfirmDialog } from "./confirm-dialog";
import { FamilyEmptyState } from "./family-empty-state";
import { useFamilyContext } from "./family-provider";
import { InviteMemberSheet } from "./invite-member-sheet";

export function FamilySettingsPage() {
  const { t } = useLocale();
  const fd = t((d) => d.family);
  const { family, myMembership, members, permissions, isMutating, error, rename, leave, transfer, invite } = useFamilyContext();
  const [name, setName] = useState(family?.name ?? "");
  const [transferTo, setTransferTo] = useState("");
  const [confirmingLeave, setConfirmingLeave] = useState(false);
  const [confirmingTransfer, setConfirmingTransfer] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!family || !myMembership) return <FamilyEmptyState />;

  const otherMembers = members.filter((member) => !member.isCurrentUser);

  function submitRename(event: FormEvent) {
    event.preventDefault();
    if (name.trim() && name.trim() !== family?.name) {
      rename(name.trim());
      setToast(fd.settings.toastFamilyNameUpdated);
      window.setTimeout(() => setToast(null), 3000);
    }
  }

  return (
    <div className="family-settings-page">
      <header className="family-header">
        <div><p>{fd.eyebrow}</p><h1>{fd.settings.title}</h1><span>{fd.settings.manageTemplate.replace("{name}", family.name)}</span></div>
        <Settings size={29} aria-hidden="true" />
      </header>

      {permissions?.editFamilySettings && (
        <section className="family-settings-section">
          <h2>{fd.settings.familyNameHeading}</h2>
          <form onSubmit={submitRename}>
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} />
            <button type="submit" className="button button--secondary" disabled={isMutating}>{fd.settings.save}</button>
          </form>
        </section>
      )}

      {permissions?.invite && (
        <section className="family-settings-section">
          <h2>{fd.settings.inviteMemberHeading}</h2>
          <p>{fd.settings.inviteMemberBodyTemplate.replace("{name}", family.name)}</p>
          <button type="button" className="button button--secondary" onClick={() => setInviteOpen(true)}><UserPlus size={16} aria-hidden="true" />{fd.settings.inviteMemberButton}</button>
        </section>
      )}

      {permissions?.transferOwnership && otherMembers.length > 0 && (
        <section className="family-settings-section">
          <h2>{fd.settings.transferOwnershipHeading}</h2>
          <p>{fd.settings.transferOwnershipBody}</p>
          <select value={transferTo} onChange={(event) => setTransferTo(event.target.value)}>
            <option value="">{fd.settings.chooseMemberPlaceholder}</option>
            {otherMembers.map((member) => <option key={member.userId} value={member.userId}>{member.displayName} ({fd.roles.labels[member.role]})</option>)}
          </select>
          <button type="button" className="button button--secondary" disabled={!transferTo || isMutating} onClick={() => setConfirmingTransfer(true)}>{fd.settings.transferButton}</button>
        </section>
      )}

      <section className="family-settings-section">
        <h2>{fd.settings.rolesHeading}</h2>
        <ul className="family-role-reference">
          {familyRoles.map((role) => <li key={role}><Users size={16} aria-hidden="true" /><div><strong>{fd.roles.labels[role]}</strong><span>{fd.roles.descriptions[role]}</span></div></li>)}
        </ul>
      </section>

      <section className="family-settings-section family-settings-section--danger">
        <h2>{fd.settings.leaveHeading}</h2>
        {myMembership.role === "owner" ? (
          <p>{fd.settings.leaveOwnerBodyTemplate.replace("{name}", family.name)}</p>
        ) : (
          <>
            <p>{fd.settings.leaveBodyTemplate.replace("{name}", family.name)}</p>
            <button type="button" className="button button--danger" onClick={() => setConfirmingLeave(true)}><LogOut size={16} aria-hidden="true" />{fd.settings.leaveButton}</button>
          </>
        )}
      </section>

      {error ? <p className="family-onboarding__error">{error}</p> : null}
      {toast ? <div className="pilu-toast" role="status">{toast}</div> : null}

      <ConfirmDialog
        open={confirmingLeave}
        eyebrow={fd.settings.confirmLeave.eyebrow}
        title={fd.settings.confirmLeave.titleTemplate.replace("{name}", family.name)}
        message={fd.settings.confirmLeave.message}
        confirmLabel={fd.settings.confirmLeave.confirmLabel}
        danger
        onCancel={() => setConfirmingLeave(false)}
        onConfirm={() => { leave(); setConfirmingLeave(false); }}
      />

      <ConfirmDialog
        open={confirmingTransfer}
        eyebrow={fd.settings.confirmTransfer.eyebrow}
        title={fd.settings.confirmTransfer.title}
        message={fd.settings.confirmTransfer.message}
        confirmLabel={fd.settings.confirmTransfer.confirmLabel}
        onCancel={() => setConfirmingTransfer(false)}
        onConfirm={() => { if (transferTo) transfer(transferTo); setConfirmingTransfer(false); }}
      />

      <InviteMemberSheet open={inviteOpen} isMutating={isMutating} error={error} onClose={() => setInviteOpen(false)} onInvite={invite} />
    </div>
  );
}

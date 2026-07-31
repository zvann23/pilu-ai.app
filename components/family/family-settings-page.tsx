"use client";

import { familyRoles, roleDescriptions, roleLabels } from "@/types/family";
import { LogOut, Settings, UserPlus, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ConfirmDialog } from "./confirm-dialog";
import { FamilyEmptyState } from "./family-empty-state";
import { useFamilyContext } from "./family-provider";
import { InviteMemberSheet } from "./invite-member-sheet";

export function FamilySettingsPage() {
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
      setToast("Family name updated");
      window.setTimeout(() => setToast(null), 3000);
    }
  }

  return (
    <div className="family-settings-page">
      <header className="family-header">
        <div><p>Shared Parents</p><h1>Family Settings</h1><span>Manage {family.name}.</span></div>
        <Settings size={29} aria-hidden="true" />
      </header>

      {permissions?.editFamilySettings && (
        <section className="family-settings-section">
          <h2>Family name</h2>
          <form onSubmit={submitRename}>
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} />
            <button type="submit" className="button button--secondary" disabled={isMutating}>Save</button>
          </form>
        </section>
      )}

      {permissions?.invite && (
        <section className="family-settings-section">
          <h2>Invite a member</h2>
          <p>Bring another trusted caregiver into {family.name}.</p>
          <button type="button" className="button button--secondary" onClick={() => setInviteOpen(true)}><UserPlus size={16} aria-hidden="true" />Invite member</button>
        </section>
      )}

      {permissions?.transferOwnership && otherMembers.length > 0 && (
        <section className="family-settings-section">
          <h2>Transfer ownership</h2>
          <p>Make another active member the family owner. You&apos;ll become a parent.</p>
          <select value={transferTo} onChange={(event) => setTransferTo(event.target.value)}>
            <option value="">Choose a member…</option>
            {otherMembers.map((member) => <option key={member.userId} value={member.userId}>{member.displayName} ({roleLabels[member.role]})</option>)}
          </select>
          <button type="button" className="button button--secondary" disabled={!transferTo || isMutating} onClick={() => setConfirmingTransfer(true)}>Transfer ownership</button>
        </section>
      )}

      <section className="family-settings-section">
        <h2>Roles &amp; permissions</h2>
        <ul className="family-role-reference">
          {familyRoles.map((role) => <li key={role}><Users size={16} aria-hidden="true" /><div><strong>{roleLabels[role]}</strong><span>{roleDescriptions[role]}</span></div></li>)}
        </ul>
      </section>

      <section className="family-settings-section family-settings-section--danger">
        <h2>Leave family</h2>
        {myMembership.role === "owner" ? (
          <p>Transfer ownership to another member before leaving {family.name}.</p>
        ) : (
          <>
            <p>You&apos;ll lose access to {family.name} immediately.</p>
            <button type="button" className="button button--danger" onClick={() => setConfirmingLeave(true)}><LogOut size={16} aria-hidden="true" />Leave family</button>
          </>
        )}
      </section>

      {error ? <p className="family-onboarding__error">{error}</p> : null}
      {toast ? <div className="pilu-toast" role="status">{toast}</div> : null}

      <ConfirmDialog
        open={confirmingLeave}
        eyebrow="Leave family"
        title={`Leave ${family.name}?`}
        message="You will lose access to shared logs, memories, and updates immediately."
        confirmLabel="Leave family"
        danger
        onCancel={() => setConfirmingLeave(false)}
        onConfirm={() => { leave(); setConfirmingLeave(false); }}
      />

      <ConfirmDialog
        open={confirmingTransfer}
        eyebrow="Transfer ownership"
        title="Transfer ownership?"
        message="You will become a parent and lose owner-only permissions like inviting or removing members."
        confirmLabel="Transfer"
        onCancel={() => setConfirmingTransfer(false)}
        onConfirm={() => { if (transferTo) transfer(transferTo); setConfirmingTransfer(false); }}
      />

      <InviteMemberSheet open={inviteOpen} isMutating={isMutating} error={error} onClose={() => setInviteOpen(false)} onInvite={invite} />
    </div>
  );
}

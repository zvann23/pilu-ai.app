"use client";

import { Mail, UserPlus } from "lucide-react";
import { useState } from "react";
import { FamilyEmptyState } from "./family-empty-state";
import { useFamilyContext } from "./family-provider";
import { InviteMemberSheet } from "./invite-member-sheet";

function formatExpiry(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(iso));
}

export function FamilyInvitationsPage() {
  const { family, myMembership, invitations, permissions, isMutating, error, invite, resend, cancel } = useFamilyContext();
  const [inviteOpen, setInviteOpen] = useState(false);

  if (!family) return <FamilyEmptyState />;

  if (!permissions?.invite) {
    return (
      <div className="family-empty-state">
        <Mail size={24} aria-hidden="true" />
        <p>Only {myMembership?.role === "parent" ? "the family owner" : "the owner"} can manage invitations.</p>
      </div>
    );
  }

  return (
    <div className="family-invitations-page">
      <header className="family-header">
        <div><p>Shared Parents</p><h1>Invitations</h1><span>Track who&apos;s been invited to join.</span></div>
        <button type="button" className="button button--primary" onClick={() => setInviteOpen(true)}><UserPlus size={16} aria-hidden="true" />Invite</button>
      </header>

      {invitations.length === 0 ? (
        <p className="family-activity-feed__empty">No invitations yet.</p>
      ) : (
        <ul className="family-invitation-list">
          {invitations.map((invitation) => (
            <li key={invitation.id} className="family-invitation-card">
              <div>
                <p>{invitation.email || "Invite link"} <span className={`invitation-status-badge invitation-status-badge--${invitation.status}`}>{invitation.status}</span></p>
                <span>{invitation.role === "parent" ? "Parent" : "Caregiver"} · Code {invitation.inviteCode} · {invitation.status === "pending" ? `Expires ${formatExpiry(invitation.expiresAt)}` : formatExpiry(invitation.expiresAt)}</span>
              </div>
              {(invitation.status === "pending" || invitation.status === "expired") && (
                <div className="family-member-card__actions">
                  <button type="button" className="text-button" disabled={isMutating} onClick={() => resend(invitation.id)}>Resend</button>
                  {invitation.status === "pending" && <button type="button" className="text-button text-button--danger" disabled={isMutating} onClick={() => cancel(invitation.id)}>Cancel</button>}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <InviteMemberSheet open={inviteOpen} isMutating={isMutating} error={error} onClose={() => setInviteOpen(false)} onInvite={invite} />
    </div>
  );
}

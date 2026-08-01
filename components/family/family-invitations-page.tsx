"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { intlLocaleTags } from "@/lib/i18n/locales";
import { Mail, UserPlus } from "lucide-react";
import { useState } from "react";
import { FamilyEmptyState } from "./family-empty-state";
import { useFamilyContext } from "./family-provider";
import { InviteMemberSheet } from "./invite-member-sheet";

export function FamilyInvitationsPage() {
  const { t, locale } = useLocale();
  const fd = t((d) => d.family);
  const { family, myMembership, invitations, permissions, isMutating, error, invite, resend, cancel } = useFamilyContext();
  const [inviteOpen, setInviteOpen] = useState(false);

  function formatExpiry(iso: string) {
    return new Intl.DateTimeFormat(intlLocaleTags[locale], { day: "numeric", month: "short" }).format(new Date(iso));
  }

  if (!family) return <FamilyEmptyState />;

  if (!permissions?.invite) {
    return (
      <div className="family-empty-state">
        <Mail size={24} aria-hidden="true" />
        <p>{fd.invitations.onlyOwnerCanManageTemplate.replace("{who}", myMembership?.role === "parent" ? fd.invitations.whoFamilyOwner : fd.invitations.whoOwner)}</p>
      </div>
    );
  }

  return (
    <div className="family-invitations-page">
      <header className="family-header">
        <div><p>{fd.eyebrow}</p><h1>{fd.invitations.title}</h1><span>{fd.invitations.subtitle}</span></div>
        <button type="button" className="button button--primary" onClick={() => setInviteOpen(true)}><UserPlus size={16} aria-hidden="true" />{fd.invitations.invite}</button>
      </header>

      {invitations.length === 0 ? (
        <p className="family-activity-feed__empty">{fd.invitations.noInvitationsYet}</p>
      ) : (
        <ul className="family-invitation-list">
          {invitations.map((invitation) => (
            <li key={invitation.id} className="family-invitation-card">
              <div>
                <p>{invitation.email || fd.invitations.inviteLinkFallback} <span className={`invitation-status-badge invitation-status-badge--${invitation.status}`}>{fd.invitations.statusLabels[invitation.status]}</span></p>
                <span>{invitation.role === "parent" ? fd.roles.labels.parent : fd.roles.labels.caregiver} · Code {invitation.inviteCode} · {invitation.status === "pending" ? fd.invitations.expiresTemplate.replace("{date}", formatExpiry(invitation.expiresAt)) : formatExpiry(invitation.expiresAt)}</span>
              </div>
              {(invitation.status === "pending" || invitation.status === "expired") && (
                <div className="family-member-card__actions">
                  <button type="button" className="text-button" disabled={isMutating} onClick={() => resend(invitation.id)}>{fd.invitations.resend}</button>
                  {invitation.status === "pending" && <button type="button" className="text-button text-button--danger" disabled={isMutating} onClick={() => cancel(invitation.id)}>{fd.invitations.cancel}</button>}
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

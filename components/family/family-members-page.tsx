"use client";

import { invitableRoles, roleLabels, type FamilyMember, type InvitableRole } from "@/types/family";
import { Users } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "./confirm-dialog";
import { FamilyEmptyState } from "./family-empty-state";
import { useFamilyContext } from "./family-provider";
import { MemberAvatar } from "./member-avatar";
import { RoleBadge } from "./role-badge";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

function formatLastActive(iso: string) {
  const diffMinutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (diffMinutes < 5) return "Active now";
  if (diffMinutes < 60) return `Active ${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `Active ${Math.round(diffMinutes / 60)}h ago`;
  return `Active ${formatDate(iso)}`;
}

export function FamilyMembersPage() {
  const { family, members, permissions, isMutating, changeRole, remove } = useFamilyContext();
  const [removing, setRemoving] = useState<FamilyMember | null>(null);

  if (!family) return <FamilyEmptyState />;

  return (
    <div className="family-members-page">
      <header className="family-header">
        <div><p>Shared Parents</p><h1>Members</h1><span>{members.length} {members.length === 1 ? "person cares" : "people care"} for your family.</span></div>
        <Users size={29} aria-hidden="true" />
      </header>

      <ul className="family-member-list">
        {members.map((member) => (
          <li key={member.id} className="family-member-card">
            <MemberAvatar name={member.displayName} />
            <div>
              <p>{member.displayName}{member.isCurrentUser ? " (You)" : ""}</p>
              <RoleBadge role={member.role} />
              <span>Joined {formatDate(member.joinedAt)} · {formatLastActive(member.lastSeenAt)}</span>
            </div>
            {permissions?.removeMembers && !member.isCurrentUser && member.role !== "owner" ? (
              <div className="family-member-card__actions">
                <select
                  aria-label={`Change ${member.displayName}'s role`}
                  value={member.role}
                  disabled={isMutating}
                  onChange={(event) => changeRole(member.id, event.target.value as InvitableRole)}
                >
                  {invitableRoles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}
                </select>
                <button type="button" className="text-button text-button--danger" onClick={() => setRemoving(member)}>Remove</button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={Boolean(removing)}
        eyebrow="Remove member"
        title={`Remove ${removing?.displayName ?? "this member"}?`}
        message="They will lose access to this family immediately. You can invite them again later."
        confirmLabel="Remove"
        danger
        onCancel={() => setRemoving(null)}
        onConfirm={() => { if (removing) remove(removing.userId); setRemoving(null); }}
      />
    </div>
  );
}

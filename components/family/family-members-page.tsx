"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import type { FamilyDict } from "@/lib/i18n/dictionary/family";
import { intlLocaleTags, type Locale } from "@/lib/i18n/locales";
import { invitableRoles, type FamilyMember, type InvitableRole } from "@/types/family";
import { Users } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "./confirm-dialog";
import { FamilyEmptyState } from "./family-empty-state";
import { useFamilyContext } from "./family-provider";
import { MemberAvatar } from "./member-avatar";
import { RoleBadge } from "./role-badge";

function formatDate(iso: string | null, fd: FamilyDict["members"], locale: Locale) {
  if (!iso) return fd.dateFallback;
  return new Intl.DateTimeFormat(intlLocaleTags[locale], { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

function formatLastActive(iso: string, fd: FamilyDict["members"], locale: Locale) {
  const diffMinutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (diffMinutes < 5) return fd.activeNow;
  if (diffMinutes < 60) return fd.activeMinutesAgoTemplate.replace("{minutes}", String(diffMinutes));
  if (diffMinutes < 1440) return fd.activeHoursAgoTemplate.replace("{hours}", String(Math.round(diffMinutes / 60)));
  return fd.activeOnDateTemplate.replace("{date}", formatDate(iso, fd, locale));
}

export function FamilyMembersPage() {
  const { t, locale } = useLocale();
  const fd = t((d) => d.family);
  const { family, members, permissions, isMutating, changeRole, remove } = useFamilyContext();
  const [removing, setRemoving] = useState<FamilyMember | null>(null);

  if (!family) return <FamilyEmptyState />;

  return (
    <div className="family-members-page">
      <header className="family-header">
        <div><p>{fd.eyebrow}</p><h1>{fd.members.title}</h1><span>{(members.length === 1 ? fd.members.memberCountOneTemplate : fd.members.memberCountOtherTemplate).replace("{count}", String(members.length))}</span></div>
        <Users size={29} aria-hidden="true" />
      </header>

      <ul className="family-member-list">
        {members.map((member) => (
          <li key={member.id} className="family-member-card">
            <MemberAvatar name={member.displayName} />
            <div>
              <p>{member.displayName}{member.isCurrentUser ? fd.members.you : ""}</p>
              <RoleBadge role={member.role} />
              <span>{fd.members.joinedTemplate.replace("{date}", formatDate(member.joinedAt, fd.members, locale)).replace("{lastActive}", formatLastActive(member.lastSeenAt, fd.members, locale))}</span>
            </div>
            {permissions?.removeMembers && !member.isCurrentUser && member.role !== "owner" ? (
              <div className="family-member-card__actions">
                <select
                  aria-label={fd.members.changeRoleAriaTemplate.replace("{name}", member.displayName)}
                  value={member.role}
                  disabled={isMutating}
                  onChange={(event) => changeRole(member.id, event.target.value as InvitableRole)}
                >
                  {invitableRoles.map((role) => <option key={role} value={role}>{fd.roles.labels[role]}</option>)}
                </select>
                <button type="button" className="text-button text-button--danger" onClick={() => setRemoving(member)}>{fd.members.remove}</button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={Boolean(removing)}
        eyebrow={fd.members.confirmRemove.eyebrow}
        title={fd.members.confirmRemove.titleTemplate.replace("{name}", removing?.displayName ?? fd.members.confirmRemove.fallbackName)}
        message={fd.members.confirmRemove.message}
        confirmLabel={fd.members.confirmRemove.confirmLabel}
        danger
        onCancel={() => setRemoving(null)}
        onConfirm={() => { if (removing) remove(removing.userId); setRemoving(null); }}
      />
    </div>
  );
}

"use client";

import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { Bell, Sparkles, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { FamilyActivityFeed } from "./family-activity-feed";
import { FamilyOnboarding } from "./family-onboarding";
import { useFamilyContext } from "./family-provider";
import { InviteMemberSheet } from "./invite-member-sheet";
import { MemberAvatar } from "./member-avatar";
import { RoleBadge } from "./role-badge";

export function FamilyOverview() {
  const { family, myMembership, members, events, permissions, ownerName, isMutating, error, notification, create, join, invite } = useFamilyContext();
  const { profile } = useBabyProfile();
  const [inviteOpen, setInviteOpen] = useState(false);

  if (!family || !myMembership) {
    return <FamilyOnboarding isMutating={isMutating} error={error} onCreate={create} onJoin={join} />;
  }

  return (
    <div className="family-overview">
      <header className="family-header">
        <div>
          <p>Shared Parents</p>
          <h1>{family.name}</h1>
          <span>Everyone here can help care for {profile.preferredName}.</span>
        </div>
        <Users size={29} aria-hidden="true" />
      </header>

      {notification ? <p className="family-notification-banner"><Bell size={15} aria-hidden="true" />{notification}</p> : null}

      <section className="family-summary-card">
        <div className="family-summary-card__stat"><MemberAvatar name={profile.preferredName} /><span>Active baby</span><strong>{profile.preferredName}</strong></div>
        <div className="family-summary-card__stat"><Users size={20} aria-hidden="true" /><span>Members</span><strong>{members.length}</strong></div>
        <div className="family-summary-card__stat"><Sparkles size={20} aria-hidden="true" /><span>Owner</span><strong>{ownerName}</strong></div>
        <div className="family-summary-card__you">You are signed in as <strong>{myMembership.displayName}</strong> <RoleBadge role={myMembership.role} /></div>
        {permissions?.invite ? (
          <button type="button" className="button button--primary" onClick={() => setInviteOpen(true)}><UserPlus size={16} aria-hidden="true" />Invite member</button>
        ) : null}
      </section>

      <section className="family-activity-section">
        <header><p>Recent updates</p><h2>Family Activity</h2></header>
        <FamilyActivityFeed events={events} members={members} showFilters limit={20} />
      </section>

      {error ? <p className="family-onboarding__error">{error}</p> : null}

      <InviteMemberSheet open={inviteOpen} isMutating={isMutating} error={error} onClose={() => setInviteOpen(false)} onInvite={invite} />
    </div>
  );
}

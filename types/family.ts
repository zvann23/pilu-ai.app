export const familyRoles = ["owner", "parent", "caregiver"] as const;
export type FamilyRole = (typeof familyRoles)[number];

export const invitableRoles = ["parent", "caregiver"] as const;
export type InvitableRole = (typeof invitableRoles)[number];

export type MemberStatus = "invited" | "active" | "removed";
export type InvitationStatus = "pending" | "accepted" | "expired" | "revoked";

export type Family = { id: string; name: string; ownerId: string; inviteCode: string; createdAt: string; updatedAt: string };

export type FamilyMember = {
  id: string;
  familyId: string;
  userId: string;
  role: FamilyRole;
  status: MemberStatus;
  displayName: string;
  avatarUrl: string | null;
  joinedAt: string | null;
  lastSeenAt: string;
  isCurrentUser: boolean;
};

export type FamilyInvitation = {
  id: string;
  familyId: string;
  invitedBy: string;
  email: string | null;
  role: InvitableRole;
  inviteCode: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
};

export const activityEventKinds = [
  "feeding", "sleep", "diaper", "growth", "medicine", "memory", "milestone",
  "member_joined", "member_left", "member_removed", "role_changed", "family_renamed", "ownership_transferred",
] as const;
export type ActivityEventKind = (typeof activityEventKinds)[number];

export type FamilyActivityEvent = {
  id: string;
  familyId: string;
  actorId: string | null;
  actorName: string;
  kind: ActivityEventKind;
  title: string;
  detail: string | null;
  createdAt: string;
};

/** What a role is allowed to do — mirrors the Phase 18 spec exactly. */
export type RolePermissions = {
  invite: boolean;
  removeMembers: boolean;
  transferOwnership: boolean;
  editFamilySettings: boolean;
  viewEverything: boolean;
  addLogs: boolean;
  editLogs: boolean;
  uploadMemories: boolean;
  useAi: boolean;
  manageBabyProfile: boolean;
  addFeeding: boolean;
  addSleep: boolean;
  addDiapers: boolean;
  manageSubscriptions: boolean;
  deleteFamily: boolean;
};

export const rolePermissions: Record<FamilyRole, RolePermissions> = {
  owner: {
    invite: true, removeMembers: true, transferOwnership: true, editFamilySettings: true,
    viewEverything: true, addLogs: true, editLogs: true, uploadMemories: true, useAi: true, manageBabyProfile: true,
    addFeeding: true, addSleep: true, addDiapers: true, manageSubscriptions: true, deleteFamily: true,
  },
  parent: {
    invite: false, removeMembers: false, transferOwnership: false, editFamilySettings: false,
    viewEverything: true, addLogs: true, editLogs: true, uploadMemories: true, useAi: true, manageBabyProfile: true,
    addFeeding: true, addSleep: true, addDiapers: true, manageSubscriptions: false, deleteFamily: false,
  },
  caregiver: {
    invite: false, removeMembers: false, transferOwnership: false, editFamilySettings: false,
    viewEverything: true, addLogs: false, editLogs: false, uploadMemories: false, useAi: false, manageBabyProfile: false,
    addFeeding: true, addSleep: true, addDiapers: true, manageSubscriptions: false, deleteFamily: false,
  },
};

export const roleLabels: Record<FamilyRole, string> = { owner: "Owner", parent: "Parent", caregiver: "Caregiver" };
export const roleDescriptions: Record<FamilyRole, string> = {
  owner: "Invites and removes members, transfers ownership, and edits family settings.",
  parent: "Views everything, adds and edits logs, uploads memories, uses Ask Pilu, and manages the baby profile.",
  caregiver: "Views baby information and can add feeding, sleep, and diaper entries.",
};

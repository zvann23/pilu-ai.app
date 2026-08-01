import type { ActivityEventKind, FamilyRole, InvitationStatus } from "@/types/family";

export type FamilyDict = {
  eyebrow: string;
  roles: { labels: Record<FamilyRole, string>; descriptions: Record<FamilyRole, string> };
  emptyState: { noFamily: string; createOrJoinLink: string };
  displayNamePrompt: { heading: string; body: string; placeholder: string; errorEmptyName: string; errorSaveFailed: string; saving: string; continueLabel: string };
  onboarding: {
    heading: string; body: string; toggleAriaLabel: string; createTab: string; joinTab: string;
    createPlaceholder: string; joinPlaceholder: string; pleaseWait: string; createFamily: string; joinFamily: string;
  };
  join: { joinedHeading: string; joinedBody: string; heading: string; body: string; placeholder: string; joining: string; joinFamily: string };
  confirmDialog: { cancel: string; closeConfirmationAriaTemplate: string };
  inviteSheet: {
    closeSheetAria: string; heading: string; closeAria: string; roleIntro: string; emailLabel: string; optional: string; emailPlaceholder: string;
    roleLegend: string; caregiver: string; parent: string; creatingInvite: string; createInvite: string;
    inviteCreatedForTemplate: string; inviteCreated: string; shareHint: string; copyCode: string; copyLink: string; done: string;
  };
  overview: {
    subtitleTemplate: string; activeBaby: string; members: string; owner: string; youAreSignedInTemplate: string;
    inviteMember: string; recentUpdatesEyebrow: string; familyActivityTitle: string; unknownOwner: string;
  };
  invitations: {
    title: string; subtitle: string; invite: string; noInvitationsYet: string; inviteLinkFallback: string;
    onlyOwnerCanManageTemplate: string; whoFamilyOwner: string; whoOwner: string;
    expiresTemplate: string; resend: string; cancel: string; statusLabels: Record<InvitationStatus, string>;
  };
  settings: {
    title: string; manageTemplate: string; familyNameHeading: string; save: string;
    inviteMemberHeading: string; inviteMemberBodyTemplate: string; inviteMemberButton: string;
    transferOwnershipHeading: string; transferOwnershipBody: string; chooseMemberPlaceholder: string; transferButton: string;
    rolesHeading: string; leaveHeading: string; leaveOwnerBodyTemplate: string; leaveBodyTemplate: string; leaveButton: string;
    toastFamilyNameUpdated: string;
    confirmLeave: { eyebrow: string; titleTemplate: string; message: string; confirmLabel: string };
    confirmTransfer: { eyebrow: string; title: string; message: string; confirmLabel: string };
  };
  members: {
    title: string; memberCountOneTemplate: string; memberCountOtherTemplate: string; you: string;
    joinedTemplate: string; changeRoleAriaTemplate: string; remove: string; dateFallback: string;
    activeNow: string; activeMinutesAgoTemplate: string; activeHoursAgoTemplate: string; activeOnDateTemplate: string;
    confirmRemove: { eyebrow: string; titleTemplate: string; fallbackName: string; message: string; confirmLabel: string };
  };
  activityFeed: {
    kindLabels: Record<ActivityEventKind, string>;
    noActivityYet: string; allMembers: string; allTypes: string;
    filterByMember: string; filterByType: string; filterByDate: string;
    justNow: string; minutesAgoTemplate: string; hoursAgoTemplate: string;
  };
  errors: { couldNotLoad: string; generic: string };
};

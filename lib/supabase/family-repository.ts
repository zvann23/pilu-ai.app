import { supabase } from "@/lib/supabase/client";
import type { ActivityEventKind, Family, FamilyActivityEvent, FamilyInvitation, FamilyMember, FamilyRole, InvitableRole, InvitationStatus, MemberStatus } from "@/types/family";

type FamilyRow = { id: string; name: string; owner_id: string; invite_code: string; created_at: string; updated_at: string };
type MemberRow = {
  id: string; family_id: string; user_id: string; role: FamilyRole; status: MemberStatus; joined_at: string | null; last_seen_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | { display_name: string | null; avatar_url: string | null }[] | null;
};
type InvitationRow = { id: string; family_id: string; invited_by: string; email: string | null; role: InvitableRole; invite_code: string; status: InvitationStatus; expires_at: string; created_at: string };
export type EventRow = { id: string; family_id: string; actor_id: string | null; actor_name: string; event_kind: ActivityEventKind; title: string; detail: string | null; created_at: string };

function rowToFamily(row: FamilyRow): Family {
  return { id: row.id, name: row.name, ownerId: row.owner_id, inviteCode: row.invite_code, createdAt: row.created_at, updatedAt: row.updated_at };
}

function profileOf(row: MemberRow) {
  return Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
}

function rowToMember(row: MemberRow, currentUserId: string): FamilyMember {
  const profile = profileOf(row);
  return {
    id: row.id, familyId: row.family_id, userId: row.user_id, role: row.role, status: row.status,
    displayName: profile?.display_name || "Family member", avatarUrl: profile?.avatar_url ?? null,
    joinedAt: row.joined_at, lastSeenAt: row.last_seen_at, isCurrentUser: row.user_id === currentUserId,
  };
}

function rowToInvitation(row: InvitationRow): FamilyInvitation {
  const effectiveStatus: InvitationStatus = row.status === "pending" && new Date(row.expires_at).getTime() < Date.now() ? "expired" : row.status;
  return { id: row.id, familyId: row.family_id, invitedBy: row.invited_by, email: row.email, role: row.role, inviteCode: row.invite_code, status: effectiveStatus, expiresAt: row.expires_at, createdAt: row.created_at };
}

export function rowToEvent(row: EventRow): FamilyActivityEvent {
  return { id: row.id, familyId: row.family_id, actorId: row.actor_id, actorName: row.actor_name, kind: row.event_kind, title: row.title, detail: row.detail, createdAt: row.created_at };
}

/** The family the current user actively belongs to (Pilu supports one active family per account). */
export async function getMyFamily(userId: string): Promise<{ family: Family; member: FamilyMember } | null> {
  const { data, error } = await supabase
    .from("family_members")
    .select("id, family_id, user_id, role, status, joined_at, last_seen_at, profiles(display_name, avatar_url), families(id, name, owner_id, invite_code, created_at, updated_at)")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const familyRaw = Array.isArray(data.families) ? data.families[0] : data.families;
  if (!familyRaw) return null;

  return { family: rowToFamily(familyRaw as FamilyRow), member: rowToMember(data as MemberRow, userId) };
}

export async function createFamily(name: string): Promise<string> {
  const { data, error } = await supabase.rpc("create_family", { family_name: name });
  if (error) throw error;
  return data as string;
}

export async function renameFamily(familyId: string, name: string): Promise<void> {
  const { error } = await supabase.from("families").update({ name, updated_at: new Date().toISOString() }).eq("id", familyId);
  if (error) throw error;
}

export async function listMembers(familyId: string, currentUserId: string): Promise<FamilyMember[]> {
  const { data, error } = await supabase
    .from("family_members")
    .select("id, family_id, user_id, role, status, joined_at, last_seen_at, profiles(display_name, avatar_url)")
    .eq("family_id", familyId)
    .eq("status", "active")
    .order("joined_at", { ascending: true });

  if (error) throw error;
  return (data as MemberRow[] ?? []).map((row) => rowToMember(row, currentUserId));
}

export async function changeMemberRole(memberRowId: string, role: InvitableRole): Promise<void> {
  const { error } = await supabase.from("family_members").update({ role }).eq("id", memberRowId);
  if (error) throw error;
}

export async function removeMember(familyId: string, userId: string): Promise<void> {
  const { error } = await supabase.rpc("remove_family_member", { target_family_id: familyId, target_user_id: userId });
  if (error) throw error;
}

export async function leaveFamily(familyId: string): Promise<void> {
  const { error } = await supabase.rpc("leave_family", { target_family_id: familyId });
  if (error) throw error;
}

export async function transferOwnership(familyId: string, newOwnerUserId: string): Promise<void> {
  const { error } = await supabase.rpc("transfer_family_ownership", { target_family_id: familyId, new_owner_user_id: newOwnerUserId });
  if (error) throw error;
}

export async function touchPresence(familyId: string): Promise<void> {
  const { error } = await supabase.rpc("touch_family_presence", { target_family_id: familyId });
  if (error) throw error;
}

export async function listInvitations(familyId: string): Promise<FamilyInvitation[]> {
  const { data, error } = await supabase
    .from("family_invitations")
    .select("id, family_id, invited_by, email, role, invite_code, status, expires_at, created_at")
    .eq("family_id", familyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as InvitationRow[] ?? []).map(rowToInvitation);
}

export async function createInvitation(familyId: string, invitedBy: string, options: { email?: string; role: InvitableRole }): Promise<FamilyInvitation> {
  const { data, error } = await supabase
    .from("family_invitations")
    .insert({ family_id: familyId, invited_by: invitedBy, email: options.email || null, role: options.role })
    .select("id, family_id, invited_by, email, role, invite_code, status, expires_at, created_at")
    .single();

  if (error) throw error;
  return rowToInvitation(data as InvitationRow);
}

export async function resendInvitation(invitationId: string): Promise<FamilyInvitation> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("family_invitations")
    .update({ status: "pending", expires_at: expiresAt })
    .eq("id", invitationId)
    .select("id, family_id, invited_by, email, role, invite_code, status, expires_at, created_at")
    .single();

  if (error) throw error;
  return rowToInvitation(data as InvitationRow);
}

export async function cancelInvitation(invitationId: string): Promise<void> {
  const { error } = await supabase.from("family_invitations").update({ status: "revoked" }).eq("id", invitationId);
  if (error) throw error;
}

export async function redeemInvite(code: string): Promise<string> {
  const { data, error } = await supabase.rpc("redeem_family_invite", { code });
  if (error) throw error;
  return data as string;
}

export async function listActivityEvents(familyId: string, options?: { limit?: number }): Promise<FamilyActivityEvent[]> {
  const { data, error } = await supabase
    .from("family_activity_events")
    .select("id, family_id, actor_id, actor_name, event_kind, title, detail, created_at")
    .eq("family_id", familyId)
    .order("created_at", { ascending: false })
    .limit(options?.limit ?? 50);

  if (error) throw error;
  return (data as EventRow[] ?? []).map(rowToEvent);
}

export async function logActivityEvent(familyId: string, actorId: string, actorName: string, kind: ActivityEventKind, title: string, detail?: string): Promise<void> {
  const { error } = await supabase.from("family_activity_events").insert({ family_id: familyId, actor_id: actorId, actor_name: actorName, event_kind: kind, title, detail: detail ?? null });
  if (error) throw error;
}

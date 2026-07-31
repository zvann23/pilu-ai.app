"use client";

import { supabase } from "@/lib/supabase/client";
import {
  cancelInvitation, changeMemberRole, createFamily, createInvitation, getMyFamily, leaveFamily,
  listActivityEvents, listInvitations, listMembers, redeemInvite, removeMember, renameFamily,
  resendInvitation, rowToEvent, touchPresence, transferOwnership, type EventRow,
} from "@/lib/supabase/family-repository";
import { rolePermissions } from "@/types/family";
import type { Family, FamilyActivityEvent, FamilyInvitation, FamilyMember, InvitableRole } from "@/types/family";
import { useCallback, useEffect, useRef, useState } from "react";

const NOTIFICATION_KINDS_TO_ANNOUNCE = new Set(["feeding", "sleep", "diaper", "growth", "medicine", "memory", "milestone"]);

export function useFamily(userId: string | null, displayName: string | null) {
  const [family, setFamily] = useState<Family | null>(null);
  const [myMembership, setMyMembership] = useState<FamilyMember | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [invitations, setInvitations] = useState<FamilyInvitation[]>([]);
  const [events, setEvents] = useState<FamilyActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const notificationTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const announce = useCallback((message: string) => {
    setNotification(message);
    clearTimeout(notificationTimeout.current);
    notificationTimeout.current = setTimeout(() => setNotification(null), 5000);
  }, []);

  const refreshMembers = useCallback(
    (familyId: string) => {
      if (!userId) return;
      listMembers(familyId, userId).then(setMembers).catch(() => undefined);
    },
    [userId],
  );

  const refreshInvitations = useCallback((familyId: string, isOwner: boolean) => {
    if (!isOwner) {
      setInvitations([]);
      return;
    }
    listInvitations(familyId).then(setInvitations).catch(() => undefined);
  }, []);

  const load = useCallback(async () => {
    if (!userId) return;
    try {
      const result = await getMyFamily(userId);
      if (!result) {
        setFamily(null);
        setMyMembership(null);
        setMembers([]);
        setInvitations([]);
        setEvents([]);
        return;
      }
      setFamily(result.family);
      setMyMembership(result.member);
      const [membersList, eventsList] = await Promise.all([
        listMembers(result.family.id, userId),
        listActivityEvents(result.family.id),
      ]);
      setMembers(membersList);
      setEvents(eventsList);
      if (result.member.role === "owner") refreshInvitations(result.family.id, true);
      touchPresence(result.family.id).catch(() => undefined);
    } catch {
      setError("Could not load your family right now.");
    } finally {
      setIsLoading(false);
    }
  }, [userId, refreshInvitations]);

  useEffect(() => {
    if (!userId) return;
    getMyFamily(userId)
      .then((result) => {
        if (!result) {
          setFamily(null);
          setMyMembership(null);
          setMembers([]);
          setInvitations([]);
          setEvents([]);
          return;
        }
        setFamily(result.family);
        setMyMembership(result.member);
        return Promise.all([listMembers(result.family.id, userId), listActivityEvents(result.family.id)]).then(([membersList, eventsList]) => {
          setMembers(membersList);
          setEvents(eventsList);
          if (result.member.role === "owner") refreshInvitations(result.family.id, true);
          touchPresence(result.family.id).catch(() => undefined);
        });
      })
      .catch(() => setError("Could not load your family right now."))
      .finally(() => setIsLoading(false));
  }, [userId, refreshInvitations]);

  // Realtime: activity events power live notifications + the feed; member
  // and invitation changes just trigger a re-fetch (simpler and more
  // robust than patching state from partial change payloads).
  useEffect(() => {
    if (!family || !userId) return;

    const channel = supabase
      .channel(`family-${family.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "family_activity_events", filter: `family_id=eq.${family.id}` }, (payload) => {
        const event = rowToEvent(payload.new as EventRow);
        setEvents((current) => [event, ...current].slice(0, 50));
        if (event.actorId !== userId && (NOTIFICATION_KINDS_TO_ANNOUNCE.has(event.kind) || event.kind === "member_joined")) {
          announce(event.title);
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "family_members", filter: `family_id=eq.${family.id}` }, () => refreshMembers(family.id))
      .on("postgres_changes", { event: "*", schema: "public", table: "family_invitations", filter: `family_id=eq.${family.id}` }, () => refreshInvitations(family.id, myMembership?.role === "owner"))
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [family, userId, myMembership?.role, announce, refreshMembers, refreshInvitations]);

  async function withMutation<T>(action: () => Promise<T>): Promise<T | null> {
    setIsMutating(true);
    setError(null);
    try {
      return await action();
    } catch (err) {
      // Supabase RPC/query errors (raised Postgres exceptions, RLS denials,
      // etc.) reach here as plain parsed-JSON objects with a `message`
      // field, not real Error instances — `err instanceof Error` misses
      // them entirely and always fell back to a generic message, hiding
      // the actual, often actionable reason (e.g. "This invite is invalid
      // or has expired").
      const message = typeof err === "object" && err !== null && "message" in err && typeof err.message === "string" ? err.message : "Something went wrong. Please try again.";
      setError(message);
      return null;
    } finally {
      setIsMutating(false);
    }
  }

  const create = useCallback((name: string) => withMutation(async () => { await createFamily(name); await load(); }), [load]);

  const join = useCallback((code: string) => withMutation(async () => { await redeemInvite(code.trim()); await load(); }), [load]);

  const invite = useCallback(
    (options: { email?: string; role: InvitableRole }) =>
      withMutation(async () => {
        if (!family || !userId) return null;
        const invitation = await createInvitation(family.id, userId, options);
        refreshInvitations(family.id, true);
        return invitation;
      }),
    [family, userId, refreshInvitations],
  );

  const resend = useCallback((invitationId: string) => withMutation(async () => { await resendInvitation(invitationId); if (family) refreshInvitations(family.id, true); }), [family, refreshInvitations]);
  const cancel = useCallback((invitationId: string) => withMutation(async () => { await cancelInvitation(invitationId); if (family) refreshInvitations(family.id, true); }), [family, refreshInvitations]);

  const changeRole = useCallback(
    (memberRowId: string, role: InvitableRole) => withMutation(async () => { await changeMemberRole(memberRowId, role); if (family) refreshMembers(family.id); }),
    [family, refreshMembers],
  );

  const remove = useCallback(
    (targetUserId: string) => withMutation(async () => { if (!family) return; await removeMember(family.id, targetUserId); refreshMembers(family.id); }),
    [family, refreshMembers],
  );

  const leave = useCallback(() => withMutation(async () => { if (!family) return; await leaveFamily(family.id); await load(); }), [family, load]);

  const transfer = useCallback(
    (newOwnerUserId: string) => withMutation(async () => { if (!family) return; await transferOwnership(family.id, newOwnerUserId); await load(); }),
    [family, load],
  );

  const rename = useCallback(
    (name: string) => withMutation(async () => { if (!family) return; await renameFamily(family.id, name); setFamily((current) => (current ? { ...current, name } : current)); }),
    [family],
  );

  const permissions = myMembership ? rolePermissions[myMembership.role] : null;

  return {
    family, myMembership, members, invitations, events, permissions,
    isLoading, isMutating, notification, error, clearError: () => setError(null),
    create, join, invite, resend, cancel, changeRole, remove, leave, transfer, rename,
    ownerName: members.find((member) => member.role === "owner")?.displayName ?? "—",
    displayName,
  };
}

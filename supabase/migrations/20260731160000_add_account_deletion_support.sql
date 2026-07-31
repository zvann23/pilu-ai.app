-- GDPR self-service account deletion (Settings -> Account).
--
-- Deleting the auth.users row itself has to go through the Supabase Admin
-- API (auth.admin.deleteUser), not raw SQL, so GoTrue also cleans up
-- sessions/identities correctly. This function does everything that step
-- depends on: it refuses to proceed if the caller owns a family that
-- still has other active members (deleting it out from under them would
-- destroy their shared baby data — they must transfer ownership or remove
-- the other members first, both already supported in Family Settings),
-- then removes any family the caller solely owns (cascading through
-- babies and every log/memory/journal/timeline/vaccine/medicine entry),
-- and finally cleans up three FKs to profiles that were never given
-- ON DELETE CASCADE/SET NULL — family_invitations.invited_by/accepted_by,
-- family_activity_events.actor_id, vision_scans.created_by — so the
-- eventual auth.users delete doesn't hit a foreign key violation.

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  caller_id uuid;
  blocking_family record;
begin
  caller_id := auth.uid();
  if caller_id is null then
    raise exception 'Authentication is required';
  end if;

  select f.id, f.name into blocking_family
  from public.families f
  where f.owner_id = caller_id
  and exists (
    select 1 from public.family_members fm
    where fm.family_id = f.id and fm.user_id <> caller_id and fm.status = 'active'
  )
  limit 1;

  if found then
    raise exception 'You own "%" which has other members. Transfer ownership or remove them in Family Settings before deleting your account.', blocking_family.name;
  end if;

  delete from public.families where owner_id = caller_id;

  update public.family_activity_events set actor_id = null where actor_id = caller_id;
  update public.family_invitations set accepted_by = null where accepted_by = caller_id;
  delete from public.family_invitations where invited_by = caller_id;
  update public.vision_scans set created_by = null where created_by = caller_id;
end;
$function$;

revoke execute on function public.delete_own_account() from public;
revoke execute on function public.delete_own_account() from anon;
grant execute on function public.delete_own_account() to authenticated;

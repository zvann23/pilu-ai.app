-- Bug fix: family_invitations.role is `text`, but family_members.role is
-- the `family_role` enum. redeem_family_invite()'s INSERT never cast
-- between them, so every single invite redemption has always failed with
-- "column \"role\" is of type family_role but expression is of type text"
-- — reproduced directly against the live database (rolled back, no data
-- changed) while investigating a user report that "Join family" always
-- shows a generic error. Fix: cast inv.role explicitly on insert.

create or replace function public.redeem_family_invite(code text)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  inv record;
  member_name text;
begin
  if auth.uid() is null then raise exception 'Authentication is required'; end if;

  select * into inv from public.family_invitations
    where invite_code = code and status = 'pending' and expires_at > now();
  if not found then raise exception 'This invite is invalid or has expired'; end if;

  select coalesce(display_name, 'A new member') into member_name from public.profiles where id = auth.uid();

  insert into public.family_members (family_id, user_id, role, status, joined_at, last_seen_at)
    values (inv.family_id, auth.uid(), inv.role::public.family_role, 'active', now(), now())
    on conflict (family_id, user_id) do update
      set status = 'active', role = excluded.role, joined_at = coalesce(public.family_members.joined_at, now()), last_seen_at = now();

  update public.family_invitations set status = 'accepted', accepted_by = auth.uid(), accepted_at = now() where id = inv.id;

  insert into public.family_activity_events (family_id, actor_id, actor_name, event_kind, title)
    values (inv.family_id, auth.uid(), member_name, 'member_joined', member_name || ' joined the family');

  return inv.family_id;
end;
$$;

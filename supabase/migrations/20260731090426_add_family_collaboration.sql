-- Phase 18: Shared Parents & Family Collaboration
-- Builds on the families/family_members tables and is_family_owner /
-- is_active_family_member helpers already shipped in the initial schema
-- (unused until now). Adds invitations, a family activity feed (used for
-- both the Activity Feed UI and cross-device notifications), and presence.

-- 1. Presence: a lightweight, honest "last active" signal.
alter table public.family_members
  add column if not exists last_seen_at timestamptz not null default now();

-- 2. Invitations.
create table public.family_invitations (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  invited_by uuid not null references public.profiles(id),
  email text,
  role text not null default 'caregiver' check (role = any (array['parent'::text, 'caregiver'::text])),
  invite_code text not null unique default substr(replace((gen_random_uuid())::text, '-'::text, ''::text), 1, 10),
  status text not null default 'pending' check (status = any (array['pending'::text, 'accepted'::text, 'expired'::text, 'revoked'::text])),
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_by uuid references public.profiles(id),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.family_invitations enable row level security;

-- Only the family owner manages invitations directly. Redemption by the
-- invitee (who isn't a member yet) goes through redeem_family_invite()
-- below instead, so an invite code is never something the table's RLS
-- needs to expose to a non-member.
create policy "family_invitations_select_owner"
  on public.family_invitations for select
  using (public.is_family_owner(family_id));

create policy "family_invitations_insert_owner"
  on public.family_invitations for insert
  with check (public.is_family_owner(family_id) and invited_by = auth.uid());

create policy "family_invitations_update_owner"
  on public.family_invitations for update
  using (public.is_family_owner(family_id))
  with check (public.is_family_owner(family_id));

create index family_invitations_family_id_idx on public.family_invitations (family_id, created_at desc);

-- 3. Family activity feed — powers both the Activity Feed UI and
-- cross-device notifications ("Mom added a feeding").
create table public.family_activity_events (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  actor_name text not null,
  event_kind text not null check (event_kind = any (array['feeding'::text, 'sleep'::text, 'diaper'::text, 'growth'::text, 'medicine'::text, 'memory'::text, 'milestone'::text, 'member_joined'::text, 'member_left'::text, 'member_removed'::text, 'role_changed'::text, 'family_renamed'::text, 'ownership_transferred'::text])),
  title text not null check (char_length(trim(title)) >= 1 and char_length(trim(title)) <= 200),
  detail text,
  created_at timestamptz not null default now()
);

alter table public.family_activity_events enable row level security;

create policy "family_activity_events_select_members"
  on public.family_activity_events for select
  using (public.is_active_family_member(family_id));

create policy "family_activity_events_insert_members"
  on public.family_activity_events for insert
  with check (public.is_active_family_member(family_id) and (actor_id is null or actor_id = auth.uid()));

create index family_activity_events_family_id_created_at_idx
  on public.family_activity_events (family_id, created_at desc);

-- 4. RPCs — mirror the SECURITY DEFINER pattern already used by
-- create_family(), so privileged multi-row/cross-permission operations
-- (joining via code, leaving, removing, transferring ownership) stay out
-- of client-writable RLS entirely.

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
    values (inv.family_id, auth.uid(), inv.role, 'active', now(), now())
    on conflict (family_id, user_id) do update
      set status = 'active', role = excluded.role, joined_at = coalesce(public.family_members.joined_at, now()), last_seen_at = now();

  update public.family_invitations set status = 'accepted', accepted_by = auth.uid(), accepted_at = now() where id = inv.id;

  insert into public.family_activity_events (family_id, actor_id, actor_name, event_kind, title)
    values (inv.family_id, auth.uid(), member_name, 'member_joined', member_name || ' joined the family');

  return inv.family_id;
end;
$$;

create or replace function public.remove_family_member(target_family_id uuid, target_user_id uuid)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare actor_name text;
begin
  if not public.is_family_owner(target_family_id) then raise exception 'Only the family owner can remove a member'; end if;
  if target_user_id = auth.uid() then raise exception 'Use leave_family to remove yourself'; end if;

  update public.family_members set status = 'removed' where family_id = target_family_id and user_id = target_user_id;

  select coalesce(display_name, 'A member') into actor_name from public.profiles where id = target_user_id;
  insert into public.family_activity_events (family_id, actor_id, actor_name, event_kind, title)
    values (target_family_id, auth.uid(), actor_name, 'member_removed', actor_name || ' was removed from the family');
end;
$$;

create or replace function public.leave_family(target_family_id uuid)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare actor_name text;
begin
  if auth.uid() is null then raise exception 'Authentication is required'; end if;
  if public.is_family_owner(target_family_id) then raise exception 'Transfer ownership before leaving the family'; end if;

  update public.family_members set status = 'removed' where family_id = target_family_id and user_id = auth.uid();

  select coalesce(display_name, 'A member') into actor_name from public.profiles where id = auth.uid();
  insert into public.family_activity_events (family_id, actor_id, actor_name, event_kind, title)
    values (target_family_id, auth.uid(), actor_name, 'member_left', actor_name || ' left the family');
end;
$$;

create or replace function public.transfer_family_ownership(target_family_id uuid, new_owner_user_id uuid)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare new_owner_name text;
begin
  if not public.is_family_owner(target_family_id) then raise exception 'Only the family owner can transfer ownership'; end if;
  if not exists (select 1 from public.family_members where family_id = target_family_id and user_id = new_owner_user_id and status = 'active') then
    raise exception 'The selected member is not an active family member';
  end if;

  update public.families set owner_id = new_owner_user_id, updated_at = now() where id = target_family_id;
  update public.family_members set role = 'parent' where family_id = target_family_id and user_id = auth.uid();
  update public.family_members set role = 'owner' where family_id = target_family_id and user_id = new_owner_user_id;

  select coalesce(display_name, 'A member') into new_owner_name from public.profiles where id = new_owner_user_id;
  insert into public.family_activity_events (family_id, actor_id, actor_name, event_kind, title)
    values (target_family_id, auth.uid(), new_owner_name, 'ownership_transferred', 'Ownership was transferred to ' || new_owner_name);
end;
$$;

create or replace function public.touch_family_presence(target_family_id uuid)
returns void
language sql
security definer
set search_path to 'public'
as $$
  update public.family_members set last_seen_at = now() where family_id = target_family_id and user_id = auth.uid();
$$;

-- 5. Realtime: let clients subscribe to change streams for these tables.
-- Supabase Realtime still authorizes each row against the subscriber's
-- own RLS, so this does not widen access beyond the policies above.
alter publication supabase_realtime add table public.family_members;
alter publication supabase_realtime add table public.family_invitations;
alter publication supabase_realtime add table public.family_activity_events;

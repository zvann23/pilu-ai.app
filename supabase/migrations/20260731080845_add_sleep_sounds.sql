-- Phase 16: Sleep Sounds (Elite)
-- Matches existing pilu-ai.app conventions: uuid pk via gen_random_uuid(),
-- timestamptz created_at/updated_at defaults, RLS enabled on every table,
-- check constraints for bounded/enumerated text fields.
--
-- Already applied to the live project (kcgtcitpxzmkeddaxdku) via the
-- Supabase MCP connector — this file reconciles local migration history
-- with that change, it does not re-apply it.

-- 1. Minimal entitlement stub on profiles.
-- NOTE: there is no subscription/tier system yet (that's Phase 20 — Stripe).
-- This column is a placeholder so Elite-gating has something real to read
-- from today. Phase 20 should replace the default-only logic here with
-- actual Stripe webhook writes (and can rename/extend this column instead
-- of adding a parallel one).
alter table public.profiles
  add column if not exists subscription_tier text not null default 'free';

alter table public.profiles
  add constraint profiles_subscription_tier_check
  check (subscription_tier = any (array['free'::text, 'elite'::text]));

-- 2. Per-user sleep sound preferences (last sound + last volume).
-- One row per user, upserted on every change.
create table public.sleep_sound_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  last_sound_id text,
  last_volume numeric not null default 0.6 check (last_volume >= 0 and last_volume <= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sleep_sound_preferences enable row level security;

create policy "sleep_sound_preferences_select_own"
  on public.sleep_sound_preferences for select
  using (auth.uid() = user_id);

create policy "sleep_sound_preferences_upsert_own"
  on public.sleep_sound_preferences for insert
  with check (auth.uid() = user_id);

create policy "sleep_sound_preferences_update_own"
  on public.sleep_sound_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3. Favorites.
create table public.sleep_sound_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  sound_id text not null check (char_length(trim(sound_id)) >= 1 and char_length(trim(sound_id)) <= 80),
  created_at timestamptz not null default now(),
  unique (user_id, sound_id)
);

alter table public.sleep_sound_favorites enable row level security;

create policy "sleep_sound_favorites_select_own"
  on public.sleep_sound_favorites for select
  using (auth.uid() = user_id);

create policy "sleep_sound_favorites_insert_own"
  on public.sleep_sound_favorites for insert
  with check (auth.uid() = user_id);

create policy "sleep_sound_favorites_delete_own"
  on public.sleep_sound_favorites for delete
  using (auth.uid() = user_id);

-- 4. Recently played — one row per (user, sound), bumped on each play so
-- "recently played" is a cheap "order by last_played_at desc limit n".
create table public.sleep_sound_recently_played (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  sound_id text not null check (char_length(trim(sound_id)) >= 1 and char_length(trim(sound_id)) <= 80),
  play_count integer not null default 1 check (play_count >= 1),
  last_played_at timestamptz not null default now(),
  unique (user_id, sound_id)
);

alter table public.sleep_sound_recently_played enable row level security;

create policy "sleep_sound_recently_played_select_own"
  on public.sleep_sound_recently_played for select
  using (auth.uid() = user_id);

create policy "sleep_sound_recently_played_insert_own"
  on public.sleep_sound_recently_played for insert
  with check (auth.uid() = user_id);

create policy "sleep_sound_recently_played_update_own"
  on public.sleep_sound_recently_played for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index sleep_sound_recently_played_user_id_last_played_at_idx
  on public.sleep_sound_recently_played (user_id, last_played_at desc);

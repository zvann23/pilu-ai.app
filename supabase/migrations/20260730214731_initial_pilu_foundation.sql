-- Pilu database foundation. This migration is intended for Pilu's separate Supabase project only.
create type public.family_role as enum ('owner', 'parent', 'caregiver');
create type public.family_member_status as enum ('invited', 'active', 'removed');
create type public.feeding_type as enum ('breastfeeding', 'bottle', 'formula', 'pumped_milk', 'solid_food', 'water', 'custom');
create type public.sleep_type as enum ('nap', 'night_sleep', 'custom');
create type public.vaccine_status as enum ('scheduled', 'completed', 'postponed', 'skipped');
create type public.ai_message_role as enum ('user', 'assistant', 'system');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  first_name text,
  last_name text,
  avatar_url text,
  preferred_language text not null default 'en' check (char_length(preferred_language) between 2 and 16),
  timezone text not null default 'UTC',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  invite_code text not null unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 16) check (char_length(invite_code) >= 12),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.family_role not null default 'parent',
  status public.family_member_status not null default 'invited',
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  unique (family_id, user_id)
);

create table public.babies (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  first_name text not null check (char_length(trim(first_name)) between 1 and 80),
  last_name text,
  nickname text,
  date_of_birth date,
  due_date date,
  biological_sex text check (biological_sex in ('female', 'male', 'intersex', 'not_specified')),
  birth_weight_grams numeric(8, 2) check (birth_weight_grams is null or birth_weight_grams >= 0),
  birth_length_cm numeric(6, 2) check (birth_length_cm is null or birth_length_cm >= 0),
  avatar_url text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (date_of_birth is null or due_date is null or due_date <= date_of_birth)
);

create table public.feeding_logs (
  id uuid primary key default gen_random_uuid(), baby_id uuid not null references public.babies(id) on delete cascade, created_by uuid references public.profiles(id) on delete set null,
  feeding_type public.feeding_type not null, started_at timestamptz not null, ended_at timestamptz, duration_minutes integer check (duration_minutes is null or duration_minutes >= 0), breast_side text check (breast_side is null or breast_side in ('left', 'right', 'both')), amount_ml numeric(8, 2) check (amount_ml is null or amount_ml >= 0), food_name text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check (ended_at is null or ended_at >= started_at)
);
create table public.sleep_logs (
  id uuid primary key default gen_random_uuid(), baby_id uuid not null references public.babies(id) on delete cascade, created_by uuid references public.profiles(id) on delete set null,
  started_at timestamptz not null, ended_at timestamptz, duration_minutes integer check (duration_minutes is null or duration_minutes >= 0), sleep_type public.sleep_type not null default 'nap', sleep_location text, quality text check (quality is null or quality in ('restless', 'fair', 'good', 'unknown')), notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check (ended_at is null or ended_at >= started_at)
);
create table public.diaper_logs (
  id uuid primary key default gen_random_uuid(), baby_id uuid not null references public.babies(id) on delete cascade, created_by uuid references public.profiles(id) on delete set null,
  logged_at timestamptz not null default now(), diaper_type text not null check (diaper_type in ('wet', 'dirty', 'mixed', 'dry', 'other')), stool_color text, stool_consistency text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.growth_logs (
  id uuid primary key default gen_random_uuid(), baby_id uuid not null references public.babies(id) on delete cascade, created_by uuid references public.profiles(id) on delete set null,
  measured_at timestamptz not null, weight_grams numeric(10, 2) check (weight_grams is null or weight_grams >= 0), height_cm numeric(7, 2) check (height_cm is null or height_cm >= 0), head_circumference_cm numeric(7, 2) check (head_circumference_cm is null or head_circumference_cm >= 0), notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.milestones (
  id uuid primary key default gen_random_uuid(), baby_id uuid not null references public.babies(id) on delete cascade, created_by uuid references public.profiles(id) on delete set null,
  title text not null check (char_length(trim(title)) between 1 and 160), category text not null, achieved_at timestamptz, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.vaccines (
  id uuid primary key default gen_random_uuid(), baby_id uuid not null references public.babies(id) on delete cascade, created_by uuid references public.profiles(id) on delete set null,
  vaccine_name text not null check (char_length(trim(vaccine_name)) between 1 and 160), scheduled_date date, administered_date date, status public.vaccine_status not null default 'scheduled', dose_label text, healthcare_provider text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check (administered_date is null or scheduled_date is null or administered_date >= scheduled_date - 3650)
);
create table public.medicine_logs (
  id uuid primary key default gen_random_uuid(), baby_id uuid not null references public.babies(id) on delete cascade, created_by uuid references public.profiles(id) on delete set null,
  medicine_name text not null check (char_length(trim(medicine_name)) between 1 and 160), amount numeric(9, 3) check (amount is null or amount >= 0), unit text, administered_at timestamptz not null, prescribed_by text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.memories (
  id uuid primary key default gen_random_uuid(), baby_id uuid not null references public.babies(id) on delete cascade, created_by uuid references public.profiles(id) on delete set null,
  memory_type text not null, title text not null check (char_length(trim(title)) between 1 and 160), caption text, notes text, occurred_at timestamptz not null, image_path text, related_milestone_id uuid references public.milestones(id) on delete set null, is_favorite boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(), baby_id uuid not null references public.babies(id) on delete cascade, created_by uuid references public.profiles(id) on delete set null,
  entry_date date not null, activity_summary text not null, parent_note text, highlight text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (baby_id, entry_date)
);
create table public.article_bookmarks (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, article_slug text not null check (char_length(trim(article_slug)) between 1 and 200), created_at timestamptz not null default now(), unique (user_id, article_slug)
);
create table public.article_feedback (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, article_slug text not null check (char_length(trim(article_slug)) between 1 and 200), was_helpful boolean not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (user_id, article_slug)
);
create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, baby_id uuid references public.babies(id) on delete set null, title text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.ai_messages (
  id uuid primary key default gen_random_uuid(), conversation_id uuid not null references public.ai_conversations(id) on delete cascade, role public.ai_message_role not null, content text not null check (char_length(content) > 0), created_at timestamptz not null default now()
);

create index family_members_family_user_active_idx on public.family_members (family_id, user_id) where status = 'active';
create index babies_family_active_idx on public.babies (family_id, is_active);
create index feeding_logs_baby_started_idx on public.feeding_logs (baby_id, started_at desc);
create index sleep_logs_baby_started_idx on public.sleep_logs (baby_id, started_at desc);
create index diaper_logs_baby_logged_idx on public.diaper_logs (baby_id, logged_at desc);
create index growth_logs_baby_measured_idx on public.growth_logs (baby_id, measured_at desc);
create index milestones_baby_achieved_idx on public.milestones (baby_id, achieved_at desc);
create index vaccines_baby_scheduled_idx on public.vaccines (baby_id, scheduled_date);
create index medicine_logs_baby_administered_idx on public.medicine_logs (baby_id, administered_at desc);
create index memories_baby_occurred_idx on public.memories (baby_id, occurred_at desc);
create index journal_entries_baby_date_idx on public.journal_entries (baby_id, entry_date desc);
create index ai_conversations_user_updated_idx on public.ai_conversations (user_id, updated_at desc);
create index ai_messages_conversation_created_idx on public.ai_messages (conversation_id, created_at);

create function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin
  insert into public.profiles (id, display_name, first_name, avatar_url)
  values (new.id, nullif(new.raw_user_meta_data ->> 'full_name', ''), nullif(coalesce(new.raw_user_meta_data ->> 'first_name', split_part(coalesce(new.raw_user_meta_data ->> 'full_name', ''), ' ', 1)), ''), nullif(new.raw_user_meta_data ->> 'avatar_url', ''))
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create function public.is_active_family_member(target_family_id uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.family_members fm where fm.family_id = target_family_id and fm.user_id = (select auth.uid()) and fm.status = 'active');
$$;
create function public.is_family_owner(target_family_id uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.families f where f.id = target_family_id and f.owner_id = (select auth.uid()));
$$;
create function public.can_access_baby(target_baby_id uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.babies b where b.id = target_baby_id and public.is_active_family_member(b.family_id));
$$;
create function public.owns_ai_conversation(target_conversation_id uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.ai_conversations c where c.id = target_conversation_id and c.user_id = (select auth.uid()));
$$;
create function public.create_family(family_name text) returns uuid language plpgsql security definer set search_path = public as $$
declare new_family_id uuid;
begin
  if (select auth.uid()) is null then raise exception 'Authentication is required'; end if;
  if nullif(trim(family_name), '') is null then raise exception 'Family name is required'; end if;
  insert into public.families (name, owner_id) values (trim(family_name), (select auth.uid())) returning id into new_family_id;
  insert into public.family_members (family_id, user_id, role, status, joined_at) values (new_family_id, (select auth.uid()), 'owner', 'active', now());
  return new_family_id;
end; $$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger families_updated_at before update on public.families for each row execute function public.set_updated_at();
create trigger babies_updated_at before update on public.babies for each row execute function public.set_updated_at();
create trigger feeding_logs_updated_at before update on public.feeding_logs for each row execute function public.set_updated_at();
create trigger sleep_logs_updated_at before update on public.sleep_logs for each row execute function public.set_updated_at();
create trigger diaper_logs_updated_at before update on public.diaper_logs for each row execute function public.set_updated_at();
create trigger growth_logs_updated_at before update on public.growth_logs for each row execute function public.set_updated_at();
create trigger milestones_updated_at before update on public.milestones for each row execute function public.set_updated_at();
create trigger vaccines_updated_at before update on public.vaccines for each row execute function public.set_updated_at();
create trigger medicine_logs_updated_at before update on public.medicine_logs for each row execute function public.set_updated_at();
create trigger memories_updated_at before update on public.memories for each row execute function public.set_updated_at();
create trigger journal_entries_updated_at before update on public.journal_entries for each row execute function public.set_updated_at();
create trigger article_feedback_updated_at before update on public.article_feedback for each row execute function public.set_updated_at();
create trigger ai_conversations_updated_at before update on public.ai_conversations for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.babies enable row level security;
alter table public.feeding_logs enable row level security;
alter table public.sleep_logs enable row level security;
alter table public.diaper_logs enable row level security;
alter table public.growth_logs enable row level security;
alter table public.milestones enable row level security;
alter table public.vaccines enable row level security;
alter table public.medicine_logs enable row level security;
alter table public.memories enable row level security;
alter table public.journal_entries enable row level security;
alter table public.article_bookmarks enable row level security;
alter table public.article_feedback enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "families_select_members" on public.families for select to authenticated using (public.is_active_family_member(id));
create policy "families_update_owner" on public.families for update to authenticated using (public.is_family_owner(id)) with check (owner_id = (select auth.uid()));
create policy "families_delete_owner" on public.families for delete to authenticated using (public.is_family_owner(id));
create policy "family_members_select_members" on public.family_members for select to authenticated using (public.is_active_family_member(family_id));
create policy "family_members_insert_owner" on public.family_members for insert to authenticated with check (public.is_family_owner(family_id));
create policy "family_members_update_owner" on public.family_members for update to authenticated using (public.is_family_owner(family_id)) with check (public.is_family_owner(family_id));
create policy "family_members_delete_owner" on public.family_members for delete to authenticated using (public.is_family_owner(family_id));
create policy "babies_select_members" on public.babies for select to authenticated using (public.is_active_family_member(family_id));
create policy "babies_insert_members" on public.babies for insert to authenticated with check (public.is_active_family_member(family_id));
create policy "babies_update_members" on public.babies for update to authenticated using (public.is_active_family_member(family_id)) with check (public.is_active_family_member(family_id));
create policy "babies_delete_members" on public.babies for delete to authenticated using (public.is_active_family_member(family_id));

create policy "feeding_select_members" on public.feeding_logs for select to authenticated using (public.can_access_baby(baby_id));
create policy "feeding_insert_members" on public.feeding_logs for insert to authenticated with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "feeding_update_creator" on public.feeding_logs for update to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid())) with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "feeding_delete_creator" on public.feeding_logs for delete to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "sleep_select_members" on public.sleep_logs for select to authenticated using (public.can_access_baby(baby_id));
create policy "sleep_insert_members" on public.sleep_logs for insert to authenticated with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "sleep_update_creator" on public.sleep_logs for update to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid())) with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "sleep_delete_creator" on public.sleep_logs for delete to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "diaper_select_members" on public.diaper_logs for select to authenticated using (public.can_access_baby(baby_id));
create policy "diaper_insert_members" on public.diaper_logs for insert to authenticated with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "diaper_update_creator" on public.diaper_logs for update to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid())) with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "diaper_delete_creator" on public.diaper_logs for delete to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "growth_select_members" on public.growth_logs for select to authenticated using (public.can_access_baby(baby_id));
create policy "growth_insert_members" on public.growth_logs for insert to authenticated with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "growth_update_creator" on public.growth_logs for update to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid())) with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "growth_delete_creator" on public.growth_logs for delete to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "milestones_select_members" on public.milestones for select to authenticated using (public.can_access_baby(baby_id));
create policy "milestones_insert_members" on public.milestones for insert to authenticated with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "milestones_update_creator" on public.milestones for update to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid())) with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "milestones_delete_creator" on public.milestones for delete to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "vaccines_select_members" on public.vaccines for select to authenticated using (public.can_access_baby(baby_id));
create policy "vaccines_insert_members" on public.vaccines for insert to authenticated with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "vaccines_update_creator" on public.vaccines for update to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid())) with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "vaccines_delete_creator" on public.vaccines for delete to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "medicine_select_members" on public.medicine_logs for select to authenticated using (public.can_access_baby(baby_id));
create policy "medicine_insert_members" on public.medicine_logs for insert to authenticated with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "medicine_update_creator" on public.medicine_logs for update to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid())) with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "medicine_delete_creator" on public.medicine_logs for delete to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "memories_select_members" on public.memories for select to authenticated using (public.can_access_baby(baby_id));
create policy "memories_insert_members" on public.memories for insert to authenticated with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "memories_update_creator" on public.memories for update to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid())) with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "memories_delete_creator" on public.memories for delete to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "journals_select_members" on public.journal_entries for select to authenticated using (public.can_access_baby(baby_id));
create policy "journals_insert_members" on public.journal_entries for insert to authenticated with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "journals_update_creator" on public.journal_entries for update to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid())) with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "journals_delete_creator" on public.journal_entries for delete to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "bookmarks_own" on public.article_bookmarks for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "feedback_own" on public.article_feedback for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "conversations_own" on public.ai_conversations for select to authenticated using (user_id = (select auth.uid()) and (baby_id is null or public.can_access_baby(baby_id)));
create policy "conversations_insert_own" on public.ai_conversations for insert to authenticated with check (user_id = (select auth.uid()) and (baby_id is null or public.can_access_baby(baby_id)));
create policy "conversations_update_own" on public.ai_conversations for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and (baby_id is null or public.can_access_baby(baby_id)));
create policy "conversations_delete_own" on public.ai_conversations for delete to authenticated using (user_id = (select auth.uid()));
create policy "messages_select_owner" on public.ai_messages for select to authenticated using (public.owns_ai_conversation(conversation_id));
create policy "messages_insert_owner" on public.ai_messages for insert to authenticated with check (public.owns_ai_conversation(conversation_id));
create policy "messages_update_owner" on public.ai_messages for update to authenticated using (public.owns_ai_conversation(conversation_id)) with check (public.owns_ai_conversation(conversation_id));
create policy "messages_delete_owner" on public.ai_messages for delete to authenticated using (public.owns_ai_conversation(conversation_id));

grant select, insert, update, delete on all tables in schema public to authenticated;
revoke all on function public.handle_new_user() from public;
revoke all on function public.is_active_family_member(uuid) from public;
revoke all on function public.is_family_owner(uuid) from public;
revoke all on function public.can_access_baby(uuid) from public;
revoke all on function public.owns_ai_conversation(uuid) from public;
revoke all on function public.create_family(text) from public;
grant execute on function public.is_active_family_member(uuid), public.is_family_owner(uuid), public.can_access_baby(uuid), public.owns_ai_conversation(uuid), public.create_family(text) to authenticated;

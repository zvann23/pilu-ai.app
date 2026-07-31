-- Phase 19: Smart Notifications & Reminders
-- Persists notification preferences, reminders, the notification inbox,
-- and a push-subscription table for a future FCM/OneSignal integration.
-- Reuses is_active_family_member() from the family collaboration schema
-- for "shared with family" reminders and cross-member notification fan-out.

-- 1. Per-user notification preferences (one row per user).
create table public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  feeding_reminder boolean not null default true,
  sleep_reminder boolean not null default true,
  medicine_reminder boolean not null default true,
  vaccine_reminder boolean not null default true,
  growth_reminder boolean not null default true,
  memory_of_day boolean not null default true,
  weekly_report_ready boolean not null default true,
  family_activity boolean not null default true,
  elite_updates boolean not null default true,
  push_enabled boolean not null default false,
  quiet_hours_enabled boolean not null default false,
  quiet_hours_start time not null default '21:00',
  quiet_hours_end time not null default '07:00',
  days_mode text not null default 'all' check (days_mode = any (array['all'::text, 'weekdays'::text, 'weekends'::text])),
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notification_preferences enable row level security;

create policy "notification_preferences_select_own"
  on public.notification_preferences for select
  using (auth.uid() = user_id);

create policy "notification_preferences_upsert_own"
  on public.notification_preferences for insert
  with check (auth.uid() = user_id);

create policy "notification_preferences_update_own"
  on public.notification_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 2. Reminders — once/daily/weekly/monthly, optionally shared with a family.
create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  family_id uuid references public.families(id) on delete cascade,
  title text not null check (char_length(trim(title)) >= 1 and char_length(trim(title)) <= 160),
  reminder_type text not null default 'custom' check (reminder_type = any (array['vaccine'::text, 'doctor_appointment'::text, 'medicine'::text, 'birthday'::text, 'family_event'::text, 'custom'::text])),
  recurrence text not null default 'once' check (recurrence = any (array['once'::text, 'daily'::text, 'weekly'::text, 'monthly'::text])),
  due_at timestamptz not null,
  is_private boolean not null default true,
  notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reminders_family_required_when_shared check (is_private or family_id is not null)
);

alter table public.reminders enable row level security;

create policy "reminders_select_own_or_shared"
  on public.reminders for select
  using (user_id = auth.uid() or (not is_private and family_id is not null and public.is_active_family_member(family_id)));

create policy "reminders_insert_own"
  on public.reminders for insert
  with check (user_id = auth.uid() and (family_id is null or public.is_active_family_member(family_id)));

create policy "reminders_update_own"
  on public.reminders for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "reminders_delete_own"
  on public.reminders for delete
  using (user_id = auth.uid());

create index reminders_user_id_due_at_idx on public.reminders (user_id, due_at);
create index reminders_family_id_due_at_idx on public.reminders (family_id, due_at) where family_id is not null;

-- 3. Notifications — always a personal row per recipient, even when the
-- underlying event is family-wide, so "private reminders remain private"
-- and RLS never needs to reason about shared rows.
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  family_id uuid references public.families(id) on delete cascade,
  category text not null check (category = any (array['feeding_reminder'::text, 'sleep_reminder'::text, 'medicine_reminder'::text, 'vaccine_reminder'::text, 'growth_reminder'::text, 'memory_of_day'::text, 'weekly_report_ready'::text, 'family_activity'::text, 'elite_updates'::text, 'daily_summary'::text, 'weekly_summary'::text, 'custom_reminder'::text])),
  title text not null check (char_length(trim(title)) >= 1 and char_length(trim(title)) <= 200),
  body text,
  status text not null default 'unread' check (status = any (array['unread'::text, 'read'::text, 'archived'::text])),
  link text,
  reminder_id uuid references public.reminders(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "notifications_select_own"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "notifications_insert_own"
  on public.notifications for insert
  with check (user_id = auth.uid());

create policy "notifications_update_own"
  on public.notifications for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "notifications_delete_own"
  on public.notifications for delete
  using (user_id = auth.uid());

create index notifications_user_id_created_at_idx on public.notifications (user_id, created_at desc);
create index notifications_user_id_status_idx on public.notifications (user_id, status);

-- Fan-out RPC: lets any active family member create a notification for
-- every OTHER active member of the same family (e.g. "New family
-- activity") without needing a permissive cross-user RLS insert policy.
create or replace function public.notify_family_members(target_family_id uuid, excluding_user_id uuid, notif_category text, notif_title text, notif_body text, notif_link text default null)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if not public.is_active_family_member(target_family_id) then
    raise exception 'Only active family members can notify the family';
  end if;

  insert into public.notifications (user_id, family_id, category, title, body, link)
  select fm.user_id, target_family_id, notif_category, notif_title, notif_body, notif_link
  from public.family_members fm
  join public.notification_preferences np on np.user_id = fm.user_id
  where fm.family_id = target_family_id
    and fm.status = 'active'
    and fm.user_id <> excluding_user_id
    and (notif_category <> 'family_activity' or np.family_activity);
end;
$$;

revoke execute on function public.notify_family_members(uuid, uuid, text, text, text, text) from public;
grant execute on function public.notify_family_members(uuid, uuid, text, text, text, text) to authenticated;

-- 4. Push subscription placeholder — architecture only, provider-agnostic.
create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null check (provider = any (array['fcm'::text, 'onesignal'::text])),
  token text not null,
  created_at timestamptz not null default now(),
  unique (user_id, provider)
);

alter table public.push_subscriptions enable row level security;

create policy "push_subscriptions_select_own"
  on public.push_subscriptions for select
  using (user_id = auth.uid());

create policy "push_subscriptions_insert_own"
  on public.push_subscriptions for insert
  with check (user_id = auth.uid());

create policy "push_subscriptions_delete_own"
  on public.push_subscriptions for delete
  using (user_id = auth.uid());

-- 5. Realtime, so the inbox and Home badge counter update live.
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.reminders;

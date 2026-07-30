create table public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  baby_id uuid not null references public.babies(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  event_kind text not null check (event_kind in ('feeding', 'breastfeeding', 'bottle', 'sleep', 'diaper', 'temperature', 'medicine', 'vaccine', 'weight', 'memory')),
  occurred_at timestamptz not null,
  title text not null check (char_length(trim(title)) between 1 and 160),
  value text not null default '',
  secondary text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index timeline_events_baby_occurred_idx on public.timeline_events (baby_id, occurred_at desc);
create trigger timeline_events_updated_at before update on public.timeline_events for each row execute function public.set_updated_at();
alter table public.timeline_events enable row level security;
create policy "timeline_events_select_members" on public.timeline_events for select to authenticated using (public.can_access_baby(baby_id));
create policy "timeline_events_insert_members" on public.timeline_events for insert to authenticated with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "timeline_events_update_creator" on public.timeline_events for update to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid())) with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "timeline_events_delete_creator" on public.timeline_events for delete to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
grant select, insert, update, delete on public.timeline_events to authenticated;

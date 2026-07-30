alter table public.milestones
  add column description text not null default '',
  add column status text not null default 'upcoming' check (status in ('upcoming', 'inProgress', 'achieved', 'notApplicable')),
  add column typical_age text;

create table public.medicine_plans (
  id uuid primary key default gen_random_uuid(),
  baby_id uuid not null references public.babies(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  medicine_name text not null check (char_length(trim(medicine_name)) between 1 and 160),
  medicine_type text not null check (medicine_type in ('medicine', 'vitamin', 'supplement', 'other')),
  dose_text text not null,
  instructions text,
  frequency text not null,
  times text[] not null default '{}',
  start_date date not null,
  end_date date,
  doctor text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index medicine_plans_baby_active_idx on public.medicine_plans (baby_id, active);
create trigger medicine_plans_updated_at before update on public.medicine_plans for each row execute function public.set_updated_at();
alter table public.medicine_plans enable row level security;
create policy "medicine_plans_select_members" on public.medicine_plans for select to authenticated using (public.can_access_baby(baby_id));
create policy "medicine_plans_insert_members" on public.medicine_plans for insert to authenticated with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "medicine_plans_update_creator" on public.medicine_plans for update to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid())) with check (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
create policy "medicine_plans_delete_creator" on public.medicine_plans for delete to authenticated using (public.can_access_baby(baby_id) and created_by = (select auth.uid()));
grant select, insert, update, delete on public.medicine_plans to authenticated;

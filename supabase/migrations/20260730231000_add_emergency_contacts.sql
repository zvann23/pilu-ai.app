create type public.emergency_contact_type as enum ('general_emergency', 'pediatrician', 'clinic', 'trusted_caregiver', 'poison_information');
create table public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  contact_type public.emergency_contact_type not null,
  label text not null check (char_length(trim(label)) between 1 and 100),
  name text,
  phone_number text,
  country_code text check (country_code is null or char_length(country_code) between 2 and 3),
  is_primary boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (family_id, contact_type)
);
create index emergency_contacts_family_idx on public.emergency_contacts (family_id);
create trigger emergency_contacts_updated_at before update on public.emergency_contacts for each row execute function public.set_updated_at();
alter table public.emergency_contacts enable row level security;
create policy "emergency_contacts_select_members" on public.emergency_contacts for select to authenticated using (public.is_active_family_member(family_id));
create policy "emergency_contacts_insert_owner" on public.emergency_contacts for insert to authenticated with check (public.is_family_owner(family_id) and created_by = (select auth.uid()));
create policy "emergency_contacts_update_owner" on public.emergency_contacts for update to authenticated using (public.is_family_owner(family_id)) with check (public.is_family_owner(family_id));
create policy "emergency_contacts_delete_owner" on public.emergency_contacts for delete to authenticated using (public.is_family_owner(family_id));
grant select, insert, update, delete on public.emergency_contacts to authenticated;

-- Phase 21: AI Vision
-- Mirrors the memories table's baby_id + can_access_baby() scoping
-- convention rather than the family_id-only pattern used for billing.
-- image_path is reserved for a future Supabase Storage upload (same
-- unused convention as memories.image_path) — scans are analyzed from an
-- in-memory image the client sends to /api/vision/analyze and only the
-- resulting analysis is persisted, not the photo itself, for now.

create table public.vision_scans (
  id uuid primary key default gen_random_uuid(),
  baby_id uuid not null references public.babies(id) on delete cascade,
  created_by uuid references public.profiles(id),
  category text not null check (category in ('food', 'bottle', 'label', 'ingredients', 'toy', 'baby_product', 'rash', 'skin', 'stool')),
  title text not null,
  summary text not null,
  key_points text[] not null default '{}',
  concerns text[] not null default '{}',
  recommendation text not null,
  image_path text,
  is_saved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.vision_scans enable row level security;

create policy "vision_scans_select_members"
  on public.vision_scans for select
  using (public.can_access_baby(baby_id));

create policy "vision_scans_insert_members"
  on public.vision_scans for insert
  with check (public.can_access_baby(baby_id) and created_by = auth.uid());

create policy "vision_scans_update_creator"
  on public.vision_scans for update
  using (public.can_access_baby(baby_id) and created_by = auth.uid())
  with check (public.can_access_baby(baby_id) and created_by = auth.uid());

create policy "vision_scans_delete_creator"
  on public.vision_scans for delete
  using (public.can_access_baby(baby_id) and created_by = auth.uid());

create index vision_scans_baby_id_created_at_idx on public.vision_scans (baby_id, created_at desc);

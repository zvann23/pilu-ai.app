-- Phase 17: AI Reports & Insights
-- Stores generated Daily/Weekly/Monthly AI report summaries so they can be
-- redisplayed, regenerated, and previewed on the Home dashboard without
-- recomputing. Matches existing conventions: uuid pk via gen_random_uuid(),
-- timestamptz created_at, RLS enabled, auth.uid() = user_id.

create table public.ai_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  baby_id uuid references public.babies(id) on delete cascade,
  report_type text not null check (report_type = any (array['daily'::text, 'weekly'::text, 'monthly'::text])),
  period_start date not null,
  period_end date not null,
  title text not null check (char_length(trim(title)) >= 1 and char_length(trim(title)) <= 160),
  content jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.ai_reports enable row level security;

create policy "ai_reports_select_own"
  on public.ai_reports for select
  using (auth.uid() = user_id);

create policy "ai_reports_insert_own"
  on public.ai_reports for insert
  with check (auth.uid() = user_id);

create policy "ai_reports_delete_own"
  on public.ai_reports for delete
  using (auth.uid() = user_id);

create index ai_reports_user_id_created_at_idx
  on public.ai_reports (user_id, created_at desc);

create index ai_reports_user_id_report_type_created_at_idx
  on public.ai_reports (user_id, report_type, created_at desc);

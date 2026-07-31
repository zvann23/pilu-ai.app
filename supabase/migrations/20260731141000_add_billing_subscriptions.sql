-- Phase 20: Google Play Billing
-- Subscriptions are per-family (Pilu is a shared-family app — one plan
-- covers every caregiver in the family), not per-user. The pre-existing
-- profiles.subscription_tier column predates this design and is left
-- untouched/unused rather than dropped.
--
-- Every write to these tables happens server-side (service role only, via
-- the /api/billing/* routes after verifying the purchase against the
-- Google Play Developer API) — RLS below only ever grants SELECT to
-- family members, never INSERT/UPDATE/DELETE, so a compromised or
-- malicious client can read its own family's entitlement but can never
-- grant itself one.

create table public.subscription_plans (
  id text primary key,
  tier text not null check (tier in ('free', 'elite', 'premium')),
  billing_period text check (billing_period in ('monthly', 'yearly')),
  play_product_id text,
  play_base_plan_id text,
  display_name text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (play_product_id, play_base_plan_id)
);

alter table public.subscription_plans enable row level security;

create policy "subscription_plans_select_authenticated"
  on public.subscription_plans for select
  to authenticated
  using (true);

insert into public.subscription_plans (id, tier, billing_period, play_product_id, play_base_plan_id, display_name, sort_order) values
  ('free', 'free', null, null, null, 'Free', 0),
  ('elite_monthly', 'elite', 'monthly', 'pilu_elite', 'elite-monthly', 'Elite Monthly', 1),
  ('elite_yearly', 'elite', 'yearly', 'pilu_elite', 'elite-yearly', 'Elite Yearly', 2),
  ('premium_monthly', 'premium', 'monthly', 'pilu_premium', 'premium-monthly', 'Premium Monthly', 3),
  ('premium_yearly', 'premium', 'yearly', 'pilu_premium', 'premium-yearly', 'Premium Yearly', 4);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  plan_id text not null references public.subscription_plans(id),
  status text not null default 'active' check (status in ('active', 'grace_period', 'on_hold', 'paused', 'canceled', 'expired', 'pending')),
  play_purchase_token text,
  play_order_id text,
  environment text not null default 'production' check (environment in ('production', 'sandbox')),
  auto_renewing boolean not null default false,
  cancel_at_period_end boolean not null default false,
  acknowledged boolean not null default false,
  starts_at timestamptz,
  expires_at timestamptz,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (family_id)
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_members"
  on public.subscriptions for select
  using (public.is_active_family_member(family_id));

create index subscriptions_play_purchase_token_idx on public.subscriptions (play_purchase_token);

create table public.purchase_receipts (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  play_purchase_token text not null unique,
  play_product_id text not null,
  verified_at timestamptz not null default now(),
  verification_result jsonb,
  created_at timestamptz not null default now()
);

alter table public.purchase_receipts enable row level security;

create policy "purchase_receipts_select_members"
  on public.purchase_receipts for select
  using (public.is_active_family_member(family_id));

create index purchase_receipts_family_id_idx on public.purchase_receipts (family_id, created_at desc);

create table public.subscription_events (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references public.families(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  event_type text not null,
  source text not null default 'client' check (source in ('client', 'rtdn', 'manual')),
  raw_payload jsonb,
  occurred_at timestamptz not null default now()
);

alter table public.subscription_events enable row level security;

create policy "subscription_events_select_members"
  on public.subscription_events for select
  using (family_id is not null and public.is_active_family_member(family_id));

create index subscription_events_family_id_idx on public.subscription_events (family_id, occurred_at desc);

create or replace function public.set_subscription_updated_at()
returns trigger
language plpgsql
set search_path to 'public'
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_subscription_updated_at();

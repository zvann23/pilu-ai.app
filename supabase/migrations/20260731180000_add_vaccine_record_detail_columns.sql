-- Real Supabase persistence for Feeding/Sleep/Diaper/Growth/Milestones/
-- Vaccines/Medicine (see lib/offline/ and the *-repository.ts files added
-- alongside this migration). The local-only VaccineRecord type carries a
-- few fields the original vaccines table never had — add them rather
-- than silently dropping user-facing functionality.

alter table public.vaccines
  add column if not exists document_name text,
  add column if not exists lot_number text,
  add column if not exists reminder_preference text not null default 'none'
    check (reminder_preference = any (array['none'::text, 'oneDay'::text, 'threeDays'::text, 'oneWeek'::text]));

# Pilu Supabase setup

Pilu must use a **new, separate Supabase project**. Do not reuse the Phelo project, its URL, API keys, database, or environment variables.

1. In Supabase, create a project named `pilu` in the desired region and wait until it is healthy.
2. In the Pilu project’s Connect dialog, copy its Project URL and the browser-safe anonymous/publishable API key.
3. Create `pilu/.env.local` from `.env.example` and set only:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-pilu-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-browser-safe-key
   ```
4. Add the same two variables to the separate Pilu Vercel project. Never add a service-role or secret key to a `NEXT_PUBLIC_` variable.
5. Link the Supabase CLI to the Pilu project, then apply `supabase/migrations/20260730214731_initial_pilu_foundation.sql` with the normal migration workflow.
6. Generate fresh database types from the connected Pilu project and compare them with `types/database.ts` whenever the schema changes.
7. Use the Supabase dashboard or CLI to verify that RLS is enabled for every `public` user-data table and review the security advisors.
8. Create two non-production test users. Confirm active members can read shared family data, while a user outside the family sees no rows. Confirm the profile trigger and `create_family` function behave as expected.

This phase deliberately leaves authentication UI and existing local mock modules unchanged.

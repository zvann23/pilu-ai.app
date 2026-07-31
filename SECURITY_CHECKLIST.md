# Pilu — Security Checklist

Status as verified in this session, mostly via the Supabase MCP against
the live `pilu-ai.app` project (ref `kcgtcitpxzmkeddaxdku`) plus a direct
read of the relevant source files. Anything not directly verifiable from
this sandbox (no outbound network to Google/Play/Vercel APIs) is marked
as such rather than assumed.

## Database (Supabase)

- [x] **Row Level Security enabled on every table.** Verified live: all
      35 `public` tables report `rls_enabled: true` (`list_tables`, zero
      exceptions).
- [x] **SECURITY DEFINER RPCs are the only privileged surface, and each
      does its own authorization check.** `can_access_baby`,
      `create_family`, `is_active_family_member`, `is_family_owner`,
      `leave_family`, `notify_family_members`, `owns_ai_conversation`,
      `redeem_family_invite`, `remove_family_member`,
      `touch_family_presence`, `transfer_family_ownership` — all flagged
      by Supabase's security advisor as "executable by authenticated
      users," which is correct and intentional: this is Pilu's RPC layer
      for cross-row checks that plain RLS can't express (e.g. "is this
      user a member of this family"), each with `EXECUTE` already revoked
      from `anon` (Supabase auto-grants `anon` separately from `PUBLIC`,
      so this revoke has to be explicit — see the `harden_*` migrations).
- [ ] **Leaked password protection is disabled.** Real, actionable finding
      from the live security advisor. Enable in Supabase Dashboard →
      Authentication → Policies before launch. Cannot be toggled via the
      SQL-level MCP tools used in this session — it's an Auth service
      setting, not a table/policy.
- [ ] **Migration history gap.** `supabase/migrations/` in this repo is
      missing the 5 earliest migrations that built the foundational
      schema (applied live but never committed as files — see
      `DEPLOYMENT.md` §3). Not a live-security issue today, but means this
      repo cannot currently be used alone to stand up a second
      correctly-secured environment; a baseline migration should be
      generated from the live schema before that's needed.

## Authentication

- [x] Real Supabase Auth (`@supabase/ssr`), cookie-based sessions, no
      custom session/token handling.
- [x] `proxy.ts` gates every route except `/login`, `/sign-up`, and
      `/auth/callback`, redirecting unauthenticated requests to `/login`
      with a `next` return param.
- [x] Session validation uses `supabase.auth.getUser()`, **not**
      `getSession()` — `getUser()` revalidates the JWT against Supabase's
      auth server on every request, so a tampered or stale cookie can't
      fake a session (a deliberate choice documented inline in `proxy.ts`).
- [x] Authenticated users hitting `/login` or `/sign-up` are redirected to
      `/home` rather than shown the auth forms again.

## Secrets handling

- [x] `SUPABASE_SERVICE_ROLE_KEY` is server-only, used exclusively by
      `lib/supabase/admin-client.ts` for the two cron summary routes
      (which must read across every family, bypassing RLS by design).
      Never referenced in any client component or `NEXT_PUBLIC_*` var.
- [x] `admin-client.ts` returns `null` when the service role key is
      unset, and both cron routes check for that and skip cleanly rather
      than throwing — consistent no-op-when-unconfigured pattern.
- [x] `CRON_SECRET` — cron routes check `Authorization: Bearer <value>`
      when the secret is set, preventing arbitrary callers from
      triggering the summary jobs (and their Gemini API usage) on demand.
- [x] `RTDN_WEBHOOK_SECRET` — the Play Console Real-Time Developer
      Notification webhook requires a matching `?secret=` query param;
      requests without it are rejected.
- [x] `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` — used only server-side in
      `lib/billing/google-play-client.ts` for hand-rolled JWT signing
      against the Play Developer API; never sent to the client.
- [x] `GEMINI_API_KEY` — used only in `lib/gemini/*` server modules,
      never exposed client-side (Ask Pilu, Reports, and Vision all proxy
      through Next.js API routes).
- [x] Core Supabase vars (`NEXT_PUBLIC_SUPABASE_URL`,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY`) fail loudly via
      `requireSupabaseEnv()` if missing — no silent fallback to a fake
      host (Phase 17 fix).

## AI feature safety

- [x] Ask Pilu, AI Reports, and AI Vision each define their own system
      prompt (`lib/gemini/system-prompt.ts`,
      `lib/gemini/reports-system-prompt.ts`,
      `lib/gemini/vision-system-prompt.ts`) plus response validation
      (`response-validation.ts`, `reports-response-validation.ts`,
      `vision-response-validation.ts`) and a shared safety module
      (`lib/gemini/safety.ts`).
- [x] Quota enforcement exists on the Vision route (per Phase 21) to
      bound Gemini API cost/abuse from a single account.
- [ ] **First Aid is not built** (confirmed by reading
      `app/(app)/[slug]/page.tsx`: it renders the generic "coming soon"
      stub, same as Quick Add/Diapers/Solid Foods/Smart
      Routines/Settings/Help). No AI feature currently claims to give
      emergency medical guidance — verify this remains true if First Aid
      is built later; it should have explicit, prominent
      "call emergency services" framing given the audience.

## Application-layer

- [x] `lint` (ESLint via `eslint .`) — clean.
- [x] `typecheck` (`tsc --noEmit`, run as part of `next build`) — clean.
- [x] Production `build` — clean, all 80 static/SSG paths and 7 API
      routes compile.
- [x] No secrets or `.env.local` committed — `.env.example` documents
      names only, values blank.

## Not verifiable from this sandbox

- Whether `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, and the billing/
  push/analytics secrets are actually set correctly in Vercel's
  Production environment — this session has no visibility into the
  Vercel project (see `DEPLOYMENT.md` §4).
- Live behavior of the Play Console RTDN webhook and purchase
  verification against real Google traffic — outbound network to Google's
  Play Developer API is blocked from this sandbox; this was validated
  by code review only.

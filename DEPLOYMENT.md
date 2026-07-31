# Pilu — Deployment Guide

This is a real operational runbook, written from what was actually verified
in this environment. Where something could not be verified from here (no
outbound network access to live third-party services other than the
Supabase MCP channel, no Android toolchain), that is stated explicitly
rather than assumed.

## 1. Environments

| Environment | Project | Notes |
|---|---|---|
| Supabase | `pilu-ai.app` (ref `kcgtcitpxzmkeddaxdku`, `eu-central-1`) | Live, `ACTIVE_HEALTHY`. Verified via Supabase MCP in this session. |
| Vercel | `https://pilu-ai.vercel.app` | Referenced throughout the repo (RTDN webhook URL comment, this doc's `NEXT_PUBLIC_SITE_URL` fallback) as the production origin. **Not visible from this session's Vercel MCP connection** — see §4. |

## 2. Required environment variables

Set these in Vercel's Project Settings → Environment Variables (Production).
`.env.example` in the repo root is the source of truth; keep the two in
sync when either changes.

### Required — the app will not start without these
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/publishable key |

`lib/supabase/env.ts` throws loudly if either is missing — this is
intentional (Phase 17 fix) so a misconfigured deploy fails at request time
instead of silently serving a broken app.

### Required for AI features
| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Powers Ask Pilu, AI Reports, and AI Vision |

### Required for the summary cron jobs
| Variable | Purpose |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; lets the cron routes read across every family, bypassing RLS. Never expose to the browser. |
| `CRON_SECRET` | Optional but recommended — Vercel Cron sends it as `Authorization: Bearer <value>`; the routes only enforce it when set. |

`vercel.json` already schedules both cron routes:
- `/api/cron/daily-summary` — `0 20 * * *` (20:00 UTC daily)
- `/api/cron/weekly-summary` — `0 20 * * 0` (20:00 UTC Sundays)

### Optional — each integration no-ops gracefully when unset
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_PUSH_PROVIDER` (`fcm` or `onesignal`) | Enables push delivery |
| `NEXT_PUBLIC_FCM_VAPID_KEY`, `FCM_SERVER_KEY`, `FCM_PROJECT_ID` | Firebase Cloud Messaging |
| `NEXT_PUBLIC_ONESIGNAL_APP_ID`, `ONESIGNAL_REST_API_KEY` | OneSignal |
| `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`, `GOOGLE_PLAY_PACKAGE_NAME` | Play purchase verification (see §5) |
| `RTDN_WEBHOOK_SECRET` | Appended as `?secret=` on the Play Console Pub/Sub push endpoint |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Analytics — **must be a PostHog project of Pilu's own**, never Phelo's |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for `metadataBase`, `robots.ts`, `sitemap.ts`. Falls back to `https://pilu-ai.vercel.app` if unset — set it explicitly once a final domain is chosen. |

## 3. Database (Supabase)

Verified live via Supabase MCP on 2026-07-31:

- **35 tables**, **RLS enabled on every one** (`list_tables` confirmed no
  exceptions).
- **17 migrations applied** to the live project.
- Security advisor (`get_advisors`, type `security`) returned:
  - 12 `WARN`-level "SECURITY DEFINER function executable by authenticated
    users" notices, for `can_access_baby`, `create_family`,
    `is_active_family_member`, `is_family_owner`, `leave_family`,
    `notify_family_members`, `owns_ai_conversation`,
    `redeem_family_invite`, `remove_family_member`, `touch_family_presence`,
    `transfer_family_ownership`. **This is intentional** — these are the
    app's RPC layer, deliberately `SECURITY DEFINER` with an internal
    authorization check in each function body, and `EXECUTE` was already
    revoked from `anon` (see `SECURITY_CHECKLIST.md`). Flagged here so a
    future auditor doesn't mistake it for an oversight.
  - 1 real, actionable `WARN`: **leaked password protection is disabled**
    in Supabase Auth. Fix before launch — Supabase Dashboard → Authentication
    → Policies → enable "Leaked password protection" (checks against
    HaveIBeenPwned). This is an auth-service setting, not a SQL migration,
    so it isn't something this session's tools could flip directly.

### ⚠️ Known gap: incomplete migration history in this repo

`supabase/migrations/` in this repo contains **12 files**, all dated
2026-07-31 (Sleep Sounds onward). The live project has **17 applied
migrations**, the earliest 5 dated 2026-07-30:
`initial_pilu_foundation`, `add_timeline_events`, `add_feature_data_details`,
`harden_function_permissions`, `add_emergency_contacts`. These five were
applied directly to the live Supabase project in early development but were
never committed as migration files.

**Practical effect:** running `supabase db push` (or otherwise replaying
`supabase/migrations/` in order) against a *fresh* Supabase project will
**not** reproduce the current schema — it's missing the foundational
tables (`profiles`, `families`, `babies`, `feeding_logs`, `timeline_events`,
etc.) that everything else depends on.

**This is not a blocker for deploying against the existing, already-migrated
`pilu-ai.app` Supabase project** (Vercel just needs its URL/anon key, per
§2). It **is** a blocker for disaster recovery or spinning up a second
environment (staging) from this repo alone. Recommended fix: from a machine
with the Supabase CLI linked to the live project, run `supabase db pull` (or
`db dump --schema public`) to generate a baseline migration capturing the
current schema, and commit it as the new first file in
`supabase/migrations/`. This needs the Supabase CLI against the live
project and was not attempted here to avoid hand-reconstructing five
historical migrations' RLS policies and function bodies from memory.

## 4. Vercel deployment

This session's Vercel MCP connection is scoped to a different
team/account and does not show a `pilu-ai` project — `list_projects` /
`get_project` return nothing for it. Yet `https://pilu-ai.vercel.app` is
referenced as the real production origin (RTDN webhook URL, `NEXT_PUBLIC_SITE_URL`
fallback). The most likely explanation is a GitHub → Vercel integration
tied to a different Vercel account than the one this session is connected
to, auto-deploying on push to `main`. **This should be confirmed by
whoever owns the Vercel account** — this document cannot verify deploy
status from here.

Standing recommendation either way:
1. Vercel project should track this repo's `main` branch for production
   deploys, with Preview deployments on other branches/PRs.
2. Framework preset: Next.js (auto-detected). Build command / output:
   defaults are correct — no custom `next.config.ts` build overrides exist.
3. Set every variable from §2 in Production (and Preview, with test-safe
   values, if preview deploys should also work end-to-end).
4. `vercel.json`'s two cron entries are picked up automatically on deploy —
   no manual Vercel Cron setup needed beyond having `CRON_SECRET` set.
5. After deploy, set `NEXT_PUBLIC_SITE_URL` to the final canonical domain
   and redeploy so `sitemap.xml`/`robots.txt`/OG metadata resolve correctly.

## 5. Google Play Billing

Backend status (per prior confirmation from the project owner —
"steps 1–3 done"): service account configured, Play Developer API
reachable, RTDN webhook wired. Code-level, this is complete and functions:
`lib/billing/google-play-client.ts` (hand-rolled service-account JWT
signing, no `googleapis` dependency), `lib/billing/subscription-writer.ts`,
`app/api/billing/verify-purchase/route.ts`, `app/api/billing/rtdn/route.ts`.

**What's still required and cannot be done from this repo/sandbox:**
Google Play Billing's actual purchase UI (`BillingClient`) is
native-Android-only. The only web-reachable purchase surface — the Digital
Goods API + Payment Request API — only functions inside a **Trusted Web
Activity (TWA)**, i.e. an Android app that wraps this PWA. That Android
project does not exist in this repository and building one is outside what
this session can do (no Android toolchain, no Play Console access). Until
a TWA/APK exists and is uploaded to Play Console:
- The backend will correctly verify and record purchases *if* a purchase
  token reaches it, but nothing in the current web app can generate one.
- Treat Elite features as backend-ready, front-end-blocked on the TWA.

## 6. PWA verification

Verified directly in this session:

- **Manifest** (`app/manifest.ts` → `/manifest.webmanifest`): name
  "Pilu", `standalone` display, correct theme (`#0F3473`) and background
  (`#FEF7F1`) colors, 192/512/maskable-512 icons declared.
- **Icons** (`public/icons/`): `apple-touch-icon.png`, `icon-192.png`,
  `icon-512.png`, `icon-maskable-512.png` — all present, all real
  non-trivial file sizes (6.9–44.6 KB), not placeholders.
- **Splash**: `public/branding/pilu-splash.png` referenced as
  `apple-touch-startup-image` in `app/layout.tsx`.
- **Metadata**: `metadataBase` now set (added this phase) so relative
  icon/OG URLs resolve to an absolute origin.
- **`robots.ts`**: allows all crawling except `/api/` and `/auth/callback`;
  now references `sitemap.xml` (added this phase).
- **`sitemap.ts`**: added this phase. Pilu is a gated app — nearly every
  route requires a session (`proxy.ts`'s `publicPathPrefixes`) — so the
  sitemap intentionally lists only the two pages a crawler can actually
  reach: `/login` and `/sign-up`.
- **Installability**: manifest + icons + `display: standalone` +
  HTTPS (via Vercel) satisfy Chrome's installability criteria.
- **Offline support — real finding, not a stub check**: `public/sw.js`
  registers `install`/`activate`/`push`/`notificationclick` listeners only.
  It has **no `fetch` listener and does no caching** — it exists solely to
  receive push notifications, not to serve pages offline. Pilu **installs**
  like a native app but requires network connectivity to function after
  launch. If true offline support is wanted, that's new work (a cache
  strategy + `fetch` handler), not something already built.
- **Lighthouse**: re-run per the Phase 23 methodology (`npx lighthouse`
  against a real `next start` production server, Chromium at
  `/opt/pw-browsers/chromium` via `CHROME_PATH`) — see `RELEASE_CHECKLIST.md`
  for the latest scores captured in this phase.

## 7. Google Play Store release artifacts

This repository is a **web app**. It has no Android project, so the
following are **not producible from here** and are listed as owner
action items, not claims of completion:

- [ ] Build a TWA (e.g. via Bubblewrap or Android Studio) wrapping
      `https://pilu-ai.vercel.app`, using `public/manifest.webmanifest`
      as the source of truth for name/icons/colors.
- [ ] Generate a signed release `.aab` and upload to Play Console.
- [ ] Complete Play Console's Data Safety form — cross-reference
      `PRIVACY_CHECKLIST.md` for what Pilu actually collects and sends to
      which processor.
- [ ] Add Digital Asset Links (`assetlinks.json`) verifying domain
      ownership between the TWA and `pilu-ai.vercel.app`, required for the
      TWA to run without a browser address bar.
- [ ] Store listing: screenshots, feature graphic, short/long description,
      content rating questionnaire, privacy policy URL.
- [ ] Configure the Play Console subscription products referenced by
      `lib/billing/plans.ts` so their product IDs match what
      `verify-purchase`/RTDN expect.
- [ ] Point the Play Console RTDN Pub/Sub topic's push subscription at
      `https://pilu-ai.vercel.app/api/billing/rtdn?secret=<RTDN_WEBHOOK_SECRET>`.

See `RELEASE_CHECKLIST.md` for the full pre-launch checklist combining
these with the web-side items.

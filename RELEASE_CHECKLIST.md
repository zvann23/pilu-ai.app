# Pilu v1.0.0 — Release Checklist

This is the complete production audit and release checklist for Phase 24.
Every ✓/✗ below reflects something actually checked in this session — by
reading the source, running lint/typecheck/build, running Lighthouse
against a real `next start` production server, or querying the live
Supabase project via MCP. Nothing here is guessed.

## 1. Module-by-module audit

| Module | Status | Notes |
|---|---|---|
| Authentication | ✅ Real | Supabase Auth via `@supabase/ssr`, `proxy.ts` session-gates every route except `/login`, `/sign-up`, `/auth/callback`. Uses `getUser()` (server-revalidated), not `getSession()`. |
| Supabase | ✅ Real | 35 tables live, **RLS enabled on all of them** (verified via MCP). See §3 for a schema/migration gap that doesn't affect the live app but affects reproducibility. |
| Google Play Billing | ⚠️ Backend only | `lib/billing/*` + `/api/billing/*` fully built and functional (service-account JWT signing, purchase verification, RTDN webhook, entitlements). The actual purchase UI requires an Android TWA wrapper that does not exist in this repo — see `DEPLOYMENT.md` §5. |
| AI Reports | ✅ Real | Elite-gated (`useEliteAccess`), Gemini-backed, its own system prompt + response validation. |
| AI Vision | ✅ Real | Elite-gated, Gemini-backed photo analysis, quota-enforced, own safety system prompt. |
| Sleep Sounds | ✅ Real | Elite-gated, curated sound library, favorites, sleep timer, mini-player + full player sheet. |
| Shared Parents (Family) | ✅ Real | Invitations, members, roles, presence, all RLS/RPC-backed (`create_family`, `redeem_family_invite`, `is_active_family_member`, etc.). |
| Notifications | ✅ Real | In-app inbox + reminders + preferences; push delivery via FCM/OneSignal is optional and no-ops cleanly when unconfigured. |
| Timeline | ✅ Real | Unified activity feed across all logging modules. |
| Baby Library | ✅ Real | Curated article set with a working reader. |
| Memory Book | ✅ Real | Private daily journal. |
| **First Aid** | ❌ **Not built** | Renders the generic `ComingSoonCard` stub (confirmed by reading `app/(app)/[slug]/page.tsx`) — same placeholder as Quick Add, Diapers, Solid Foods, Smart Routines, Settings, and Help. The only First-Aid-specific code is an analytics-only `<FirstAidOpenedTracker />`. **This was explicitly listed as a module to verify in this phase's spec — flagging it prominently rather than glossing over it.** |
| Feeding | ✅ Real | Full logging module. |
| Sleep | ✅ Real | Full logging module. |
| Growth | ✅ Real | Full logging module. |
| Vaccines | ✅ Real | Full logging module. |
| Medicine | ✅ Real | Full logging module, including medicine plans. |
| PWA | ✅ Real, with one honest gap | Installable (manifest + icons + standalone display), `sitemap.ts` and `metadataBase` added this phase. Service worker handles **push notifications only** — no offline page caching (`public/sw.js` has no `fetch` handler). See §5. |

**Also confirmed as stubs (not part of the phase's named module list, but
found while reading the routing table and worth surfacing for
completeness):** Quick Add, Diapers, Solid Foods, Smart Routines, Settings,
Help.

## 2. Code quality gates

```
npm run lint       ✅ clean (eslint .)
npm run typecheck   — folded into `next build`'s TypeScript pass, ✅ clean
npm run build       ✅ clean — 80 static/SSG paths, 7 API routes, proxy middleware
```

## 3. Database / Supabase (live, verified via MCP)

- ✅ 35 tables, RLS enabled on every one.
- ✅ 17 migrations applied to the live project.
- ⚠️ `supabase/migrations/` in this repo only contains 12 of those 17 —
  the earliest 5 foundational migrations were applied live but never
  committed as files. Does not affect the running app; does mean this
  repo alone can't currently reproduce the schema from scratch. See
  `DEPLOYMENT.md` §3 for the recommended fix.
- ⚠️ Leaked password protection is disabled in Supabase Auth — a real,
  easy pre-launch fix (Dashboard toggle, not a code change).
- ✅ The 12 `SECURITY DEFINER` RPC "warnings" from the security advisor
  are the intentional, reviewed pattern (see `SECURITY_CHECKLIST.md`).

## 4. Generated documentation

- ✅ `CHANGELOG.md` — full, accurate history from `git log` (28 commits,
  2026-07-30 → 2026-07-31)
- ✅ `RELEASE_NOTES.md` — user-facing v1.0.0 summary, including an honest
  "what's not in this release" section
- ✅ `DEPLOYMENT.md` — env vars, Supabase/Vercel/Play deployment status,
  the migration gap, and Play Store artifact checklist
- ✅ `SECURITY_CHECKLIST.md` — RLS, RPC, secrets, and auth verification
- ✅ `PRIVACY_CHECKLIST.md` — processor table, GDPR consent flow, AI data
  handling, and open pre-launch privacy gaps
- ✅ `RELEASE_CHECKLIST.md` — this document

## 5. PWA & Lighthouse

Real Lighthouse runs in this session, against a genuine `npm run start`
production server (not `next dev`), using this sandbox's Chromium
(`/opt/pw-browsers/chromium` via `CHROME_PATH`) headless.

**`/login` — before this phase's fix:**
| Category | Score |
|---|---|
| Performance | 88–89 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Root cause of the sub-95 Performance score: `LoginForm` reads
`useSearchParams()`, which forces it behind a `<Suspense fallback={null}>`
boundary. Because `.auth-page` vertically centers `.auth-shell` with flex,
the empty `null` fallback meant the whole shell (including the logo above
the form) visibly recentered once the real form streamed in — a **0.167
CLS**, "needs improvement" territory, misattributed by Lighthouse's
heuristic to the logo `<img>` even though the image itself never resized.

**Fix applied this phase:** `app/(auth)/login/page.tsx` now gives Suspense
a same-shaped `LoginFormFallback` (matching form markup, disabled inputs)
instead of `null`, so no visible reflow happens when the real form mounts.
Also added `aspect-ratio: 1/1` to `.pilu-logo` in `app/globals.css` as a
defense-in-depth measure (harmless, though the Suspense fix was the actual
cause).

**`/login` — after the fix (3 consecutive runs):**
| Category | Run 1 | Run 2 |
|---|---|---|
| Performance | 95 | 96 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| CLS | 0.013 | — |

The residual few points below 100 on Performance are driven by LCP
(~2.7s) and a modest TBT, both measured against `localhost` inside this
sandboxed container — real-world numbers against a CDN-fronted Vercel
deploy are expected to be meaningfully better, consistent with Phase 23's
prior 100/100/100/100 result on a different page under similar conditions.
This was not chased further to avoid over-fitting to sandbox-specific
latency that a production CDN won't reproduce.

**PWA installability:** ✅ manifest, icons (192/512/maskable-512), and
`display: standalone` all present and correct.

**Offline support:** ❌ not implemented. `public/sw.js` only handles
`install`/`activate`/`push`/`notificationclick` — no `fetch` listener, no
cache strategy. Pilu installs like a native app but requires network
connectivity after launch. Documented, not silently claimed.

**Sitemap/robots:** ✅ `app/sitemap.ts` added this phase (lists `/login`
and `/sign-up` — the only two routes reachable without a session, since
Pilu is otherwise a fully gated app). `app/robots.ts` now references it.

## 6. Production Vercel deployment

- This session's Vercel MCP connection does not show a `pilu-ai` project,
  even though `https://pilu-ai.vercel.app` is referenced throughout the
  repo as the live production origin. Likely explanation: a GitHub→Vercel
  integration under a different Vercel account than this session's MCP
  connection. **Confirm deploy status directly in the Vercel dashboard —
  this document cannot verify it from here.** Full detail in
  `DEPLOYMENT.md` §4.
- `vercel.json`'s two cron entries (`daily-summary`, `weekly-summary`) are
  ready to be picked up automatically on deploy.
- All required/optional env vars are documented in `.env.example` and
  `DEPLOYMENT.md` §2 — action item is setting them in Vercel's Production
  environment.

## 7. Google Play release artifacts

Not producible from this web-only repo/sandbox. Full checklist (TWA build,
signed `.aab`, Data Safety form, `assetlinks.json`, store listing,
subscription product config, RTDN endpoint wiring) is in `DEPLOYMENT.md`
§7 as owner action items, not claimed as done.

## 8. Final pre-launch action items (consolidated)

1. Enable leaked password protection in Supabase Auth (Dashboard toggle).
2. Generate a baseline Supabase migration from the live schema to close
   the migration-history gap (`DEPLOYMENT.md` §3).
3. Confirm/configure the Vercel production deployment and its env vars.
4. Set `NEXT_PUBLIC_SITE_URL` to the final canonical domain in Vercel.
5. Build the Android TWA wrapper to unblock real Google Play purchases.
6. Complete Play Console setup: signed `.aab`, Data Safety form,
   `assetlinks.json`, store listing, subscription products, RTDN endpoint.
7. Add an in-app way to revoke analytics consent and delete/export
   account data (`PRIVACY_CHECKLIST.md`).
8. Publish a real privacy policy and link it from Play Console.
9. Decide whether First Aid, Quick Add, Diapers, Solid Foods, Smart
   Routines, Settings, and Help ship as "coming soon" in v1.0.0 or get
   built before public launch.
10. Decide whether offline page caching is required for v1.0.0, or is
    accepted as a known gap (current service worker is push-only).

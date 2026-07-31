# Changelog

All notable changes to Pilu are documented in this file. Dates reflect the
day each change landed on the development branch.

## [1.0.0] — 2026-07-31

First public release candidate. Everything below shipped across the
2026-07-30 → 2026-07-31 development window that built Pilu from an empty
repository to a production-audited PWA.

### Added
- Initial Pilu PWA project scaffold, app shell, and navigation drawer
- Home dashboard and quick-add sheet
- Timeline with local activity logging
- Baby profile and local profile state
- Ask Pilu — Gemini-powered chat assistant
- Feeding and Sleep tracking modules
- Growth and Milestones modules
- Vaccines and Medicine tracking
- Memory Book — local daily journal
- Baby Library — article reader with a curated content set
- Sleep Sounds (Pilu Elite)
- AI Reports and insights (Pilu Elite)
- Shared family collaboration — invitations, members, roles, presence
- Smart reminders and notifications, including push (FCM/OneSignal, optional)
- Real authentication, session gating, and onboarding (Supabase Auth)
- Google Play Billing — server-side purchase verification and entitlements
- AI Vision — Gemini-powered photo scanning (Pilu Elite)
- PostHog analytics with a GDPR consent gate and a documented event catalog
- Full visual identity and supporting illustration set
- `app/sitemap.ts` and an updated `robots.ts` that references it
- `metadataBase` on root metadata so relative OG/icon URLs resolve correctly

### Changed
- Application background iterated from off-white → light blue → warm off-white
  (final)
- Baby name is now used consistently everywhere instead of placeholder text;
  onboarding expanded to collect it up front

### Fixed
- Supabase client now fails loudly on missing/misconfigured env vars instead
  of silently falling back to a non-functional placeholder host
- `/robots.txt` and `/sitemap.xml` no longer redirect to `/login` (proxy
  matcher now excludes them)
- Color contrast failures identified by a real Lighthouse audit (darkened
  `--pilu-pink`, increased a low-opacity text color from 62% → 68%)
- `posthog-js` (228 KB) no longer loads eagerly on every page — it now
  dynamically imports only after analytics consent is granted

### Known limitations (see `RELEASE_NOTES.md` and `DEPLOYMENT.md`)
- First Aid, Quick Add, Diapers, Solid Foods, Smart Routines, Settings, and
  Help are placeholder ("coming soon") screens, not implemented features
- Google Play Billing's native purchase flow requires an Android TWA/APK
  wrapper that does not exist in this repository
- The service worker (`public/sw.js`) handles push notifications only; it
  does not cache pages or assets for offline use

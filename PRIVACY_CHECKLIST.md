# Pilu — Privacy Checklist

Pilu handles data about babies and their families — a sensitive category
deserving real care, not boilerplate. This checklist reflects what the
code actually does, verified by reading the relevant source in this
session, not what a generic template would claim.

## Data processors (who Pilu sends data to, and why)

| Processor | What it receives | Why |
|---|---|---|
| **Supabase** (`pilu-ai.app`, `eu-central-1`) | All app data: profiles, babies, logs, journal entries, family membership, subscriptions | System of record. EU region selected. |
| **Google Gemini** | Ask Pilu questions, Vision photos, and the underlying activity data summarized into AI Reports | Only when the user actively uses an AI feature; nothing sent passively. |
| **Google Play** | Purchase tokens, subscription product IDs | Billing verification only (`lib/billing/*`). |
| **PostHog** | Anonymous/pseudonymous product-analytics events (see below) | Usage analytics — **must be Pilu's own PostHog project**, never Phelo's. |
| **FCM / OneSignal** (optional, whichever is configured) | Device push token, notification title/body/link | Push notification delivery only; no-ops entirely if unconfigured. |

## GDPR consent

- [x] Analytics is **opt-in**, not opt-out. `components/analytics/
      analytics-consent-banner.tsx` gates all PostHog activity, including
      screen views — nothing is sent before the user accepts.
- [x] `posthog-js` (228 KB) is not loaded at all until consent is granted
      — a dynamic `import("posthog-js")` runs only on accept, so declining
      costs nothing in bundle weight either.
- [x] Consent is persisted server-side too
      (`profiles.analytics_consent`, migration
      `20260731150000_add_analytics_consent.sql`), so server-only events
      (e.g. Play billing webhooks, which have no browser/localStorage
      access) can still respect a user's choice.
- [ ] **No visible mechanism yet to revoke consent after granting it** —
      the banner handles the initial choice; a settings toggle to turn
      analytics back off later was not found in this audit. Recommended
      addition before or shortly after launch (Settings is currently a
      stub page — see `RELEASE_NOTES.md` — so this has nowhere to live
      yet).
- [ ] **No visible account-deletion / data-export flow.** GDPR Articles
      15 (access) and 17 (erasure) generally require this. Not found in
      this audit — Settings being a stub means there's currently no
      in-app way for a user to delete their account or export their data.
      Treat as a pre-launch gap for any EU users.

## What analytics does and does not collect

Enforced by convention in `lib/analytics/events.ts` (the single source of
truth every feature is required to route through — direct `posthog-js`
calls elsewhere are treated as a bug):

- [x] **Never** sends a baby's name, date of birth, or other identifying
      detail about a child.
- [x] **Never** sends medical notes, medicine names/doses, vaccine
      details, or any free-text/user-authored content.
- [x] **Never** sends Ask Pilu questions/answers or Vision analysis
      text/photos — only that the feature was used, not its content.
- [x] Prefers categorical properties (plan id, activity kind, screen
      name) over free text.
- [x] Person identification uses only the opaque Supabase auth user id via
      `posthog.identify()` — never email, name, or phone. Pre-login events
      use PostHog's anonymous device id.

## AI features and data sent to Google

- [x] **Ask Pilu**: sends the user's typed question (and relevant baby
      context needed to answer it) to Gemini. This is inherent to the
      feature — a chat assistant needs the chat content — and is
      distinct from analytics, which explicitly excludes this content.
- [x] **AI Vision**: sends the photo the user chooses to scan to Gemini,
      plus a safety system prompt (`lib/gemini/vision-system-prompt.ts`).
      Only sent on explicit user action (uploading a photo), never in the
      background.
- [x] **AI Reports**: sends aggregated activity data (feeding/sleep/growth
      log summaries) to Gemini to generate the report text.
- [ ] **No explicit in-app disclosure found** stating "your questions/
      photos/activity summaries are sent to Google's Gemini API to
      generate this feature's response." This is standard and expected
      for an AI feature, but should be stated plainly in the privacy
      policy and, ideally, near the feature itself (e.g. a one-line note
      on the Ask Pilu / Vision screens) before public launch.

## Missing artifact: a real privacy policy

This audit reviewed what the *code* does. It did not find (and this repo
likely doesn't contain) a published, user-facing privacy policy document —
required for the Play Console Data Safety form and for GDPR compliance
generally. **Action item, not something this session generated**: write
and publish a privacy policy that accurately reflects the processor table
and AI-data-sharing notes above, then link it from Play Console and (once
Settings exists) from within the app.

## Baby/family data isolation

- [x] Verified via RLS: every table scoping to a baby or family is
      protected by row-level security tied to family membership (see
      `SECURITY_CHECKLIST.md` for the live RLS verification).
- [x] Shared-family data (Phase 18) is scoped to explicit family
      membership via `is_active_family_member`/`can_access_baby` — a
      parent only sees data for babies in families they belong to.

## Summary of open items before public launch

1. Add an in-app way to revoke analytics consent and to delete/export
   account data (GDPR Art. 15/17).
2. Publish a real privacy policy covering the processor table above,
   including the AI-data-sharing disclosure.
3. Add a one-line "sent to Google Gemini" disclosure near Ask Pilu, AI
   Reports, and AI Vision.
4. Complete Play Console's Data Safety questionnaire using this document
   as the source of truth once the above are addressed.

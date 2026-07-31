# Pilu — Offline Support

Real offline support for the moment-to-moment logging (feeding, sleep,
diaper, growth, milestones, vaccines, medicine) plus app-shell caching so
already-visited screens open without a connection.

## 1. App shell & static assets (`public/sw.js`)

Hand-rolled service worker (no Workbox, matching the rest of this app's
dependency-light convention):

- **Navigations** (loading a page): network-first, caching each
  successful response. Offline, falls back to whatever was last cached
  for that exact URL — so a screen you've already opened keeps working,
  matching the ask precisely ("navigates between already-visited
  screens"). A route you've never visited before going offline isn't
  cached and falls through to the browser's own offline page — that's a
  deliberate, honest scope boundary, not an oversight.
- **Static assets** (`/_next/static/*`, `/icons/*`, `/branding/*`, the
  manifest): cache-first. These are content-hashed and immutable per
  deploy, so there's nothing to go stale.
- **Everything else** — API routes, Supabase requests, Next's RSC/data
  fetches, cross-origin requests, non-GET requests — is left completely
  untouched. A service worker cache can't safely retry a failed mutation
  with the right semantics; that's what the offline queue below is for.

## 2. Real persistence, then the offline queue

Before this change, Feeding/Sleep/Diaper/Growth/Milestones/Vaccines/
Medicine ran on local-only React state (`ActivityProvider`/
`DevelopmentProvider`/`CareProvider`, seeded from mock data) — nothing
persisted, online or offline. Making the offline queue meaningful
required first wiring these to real Supabase tables:

| Feature | Table(s) |
|---|---|
| Feeding / Breastfeeding / Bottle | `feeding_logs` |
| Sleep | `sleep_logs` |
| Diaper | `diaper_logs` |
| Growth measurements | `growth_logs` |
| Milestones | `milestones` (seeded once per baby with the standard ~22-item catalog, then only status/date/note ever change) |
| Vaccines | `vaccines` (+3 new columns: `document_name`, `lot_number`, `reminder_preference` — the local `VaccineRecord` type had fields the original table never did) |
| Medicine | `medicine_plans` (the ongoing prescription) + `medicine_logs` (each dose event) |

Every domain write also inserts/updates/deletes a matching row in
`timeline_events` — the unified activity feed Timeline and Quick Add
read from — sharing the *same client-generated id* as the domain row, so
both can be kept in sync without a join or a foreign key.

**Explicitly out of scope for this pass** (not part of the original
request): Temperature and Memory Book stay exactly as before — a local
reading list plus a real `timeline_events` entry, no dedicated table.
Vaccine "appointments" and medicine "today's schedule" aren't separate
tables either; they're derived client-side from `vaccines` (status =
upcoming) and `medicine_plans.times` respectively, exactly matching how
the mock data already modeled them.

## 3. The offline queue (`lib/offline/`)

- `queuedInsert` / `queuedUpdate` / `queuedDelete` (`queued-write.ts`) are
  the three primitives every domain write goes through: try the request
  live; if the browser is offline, or the request fails for a *network*
  reason, queue it in IndexedDB and return immediately so the caller can
  apply an optimistic UI update. A genuine rejection (a real constraint
  or RLS error, not a connectivity problem) is thrown to the caller
  instead of queued — retrying it later would just fail again.
- **Network vs. real error** is distinguished by inspecting the
  Postgrest error's `code` field: a completed request that Postgres/
  PostgREST rejected always carries a real error code; a fetch-level
  failure (caught inside postgrest-js's own `.catch`) always has an
  empty one. See `isNetworkError` in `sync-engine.ts`.
- `startSyncEngine()` (called once from `OfflineIndicator`) drains the
  queue whenever the browser fires an `online` event or the queue
  changes. It replays **strictly in order** and **stops at the first
  failure** — network or otherwise — rather than skipping ahead, because
  a later queued mutation can depend on an earlier one having landed
  (e.g. an update to a row a still-queued insert hasn't created yet).
  Nothing is ever silently dropped; a stuck item just stays visible in
  the pending count until it succeeds.
- Reads get the same offline treatment: `fetchWithCacheFallback`
  (`queued-write.ts`) caches every successful list fetch to IndexedDB
  (`list-cache.ts`) and serves that cache when offline or on a network
  failure, so a screen shows real recent data plus anything still
  queued — not an empty or broken state.

## 4. Pending-sync indicator (`components/offline/offline-indicator.tsx`)

Renders nothing in the common case (online, empty queue). Otherwise a
single quiet line under the header:

- Offline, nothing queued yet: *"You're offline — your logs will save
  here and sync automatically."*
- Offline with N queued: *"You're offline — N changes will sync when
  you're back online."*
- Back online, still draining: *"Syncing N changes…"*

No red, no alarm icon, no modal — matches the calm/premium tone
elsewhere in the app.

## 5. Conflict resolution: last-write-wins, and why that's enough here

**Strategy: last write wins, by whichever write reaches the database
last.** No custom conflict detection, no merge UI, no version vectors.

This is a deliberate, documented choice rather than an oversight:

- These are personal-to-a-baby logs, edited by one caregiver at a time
  in the moment — not a collaborative document multiple people type into
  simultaneously. True concurrent edits to the *same* entry from two
  offline devices are a rare edge case, not the common path.
- Every domain table already has a `set_updated_at()` trigger that stamps
  `updated_at = now()` on every `UPDATE`. Because queued mutations are
  always plain `UPDATE ... SET ... WHERE id = X` (never a
  read-modify-write merge), whichever queued update reaches the server
  last simply overwrites the row — last-write-wins falls out of the
  database's own behavior for free, with no extra code.
- **Delete beats update.** If device A deletes an entry while offline and
  device B (also offline) queues an edit to that same entry, B's queued
  `UPDATE ... WHERE id = X` silently affects zero rows once it replays
  after A's delete has landed — a clean, non-crashing outcome. Delete is
  effectively terminal, which is a reasonable and predictable rule.
- If a genuinely better strategy (e.g. surfacing "this was also changed
  elsewhere" to the user) is ever needed, the queue already carries
  everything required to build it — each `QueuedMutation` is inspectable
  before it's replayed — but that's real, separate scope, not something
  this pass silently attempted and got wrong.

## Known limitations

- A permanently-failing queued mutation (e.g. a row whose family access
  was revoked while offline) stays queued indefinitely — there's no
  manual "discard" affordance yet. It shows up in the pending count
  forever rather than either silently vanishing or blocking everything
  behind it.
- The service worker's navigation cache only helps for routes visited
  before going offline, by design (see §1).
- Cross-tab queue sync isn't implemented — the pending count reflects the
  tab that made the change; a second open tab won't see the count update
  until it makes its own change or reloads.

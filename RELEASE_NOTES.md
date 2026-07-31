# Pilu v1.0.0 — Release Notes

Pilu is your baby's AI companion: a calm, mobile-first PWA for tracking
feeding, sleep, growth, and the thousand small moments of a baby's first
years — with an AI assistant, AI-read photo scans, and tools the whole
family can share.

## What's in v1.0.0

**Core tracking**
Feeding, Sleep, Growth, Milestones, Vaccines, and Medicine logging, plus a
unified Timeline that ties every entry together.

**AI features**
- **Ask Pilu** — a Gemini-powered chat assistant for parenting questions
- **AI Vision** (Elite) — scan a photo (e.g. a rash, a growth chart, a
  medicine label) for a calm, plain-language read
- **AI Reports** (Elite) — daily/weekly summaries and insights generated
  from your logged activity

**Family**
Invite co-parents and caregivers into a shared family space with roles,
member management, and real-time presence.

**Sleep Sounds** (Elite)
A curated library of white noise, nature sounds, and lullabies with
favorites and a sleep timer.

**Memory Book**
A private daily journal for the moments worth keeping.

**Baby Library**
A curated set of articles on newborn care, sleep, and development.

**Notifications**
In-app reminders and notification center, with optional push notification
delivery (Firebase Cloud Messaging or OneSignal).

**Installable app**
Pilu installs to your home screen like a native app, with its own icon,
splash screen, and standalone display mode.

## Pilu Elite

Sleep Sounds, AI Reports, and AI Vision are part of **Pilu Elite**, Pilu's
paid tier. Purchases are verified server-side via Google Play. See
`DEPLOYMENT.md` for the current status of the Google Play purchase flow.

## What's not in this release

Being upfront about what v1.0.0 does **not** include:

- **First Aid, Quick Add, Diapers, Solid Foods, Smart Routines, Settings,
  and Help** are placeholder "coming soon" screens in the navigation. They
  are not implemented yet — this includes First Aid, despite guidance to
  reach an emergency contact or medical professional for anything urgent.
- **Google Play purchases** cannot complete end-to-end from the web app
  alone. The backend (purchase verification, entitlements, webhooks) is
  built and functional, but Google's purchase UI only works inside a
  Trusted Web Activity (Android app wrapper), which has not been built.
  See `DEPLOYMENT.md` for what remains.
- **Offline support** is partial: Pilu installs and launches like a native
  app, but the service worker does not cache pages for offline browsing —
  a network connection is required to use the app after launch.

## Feedback

Pilu is a first release. If something looks wrong or missing, that's
expected in places — see the limitations above before reporting duplicates.

/**
 * ============================================================================
 * PILU ANALYTICS EVENT CATALOG — single source of truth
 * ============================================================================
 *
 * Every PostHog event Pilu sends is declared here. Do not call posthog-js
 * directly from a component or route — call the matching function in
 * lib/analytics/analytics-service.ts instead, which sends events declared
 * in this file. This keeps naming consistent and gives us one place to
 * check what any given feature reports.
 *
 * NAMING CONVENTION
 * snake_case, past tense for things that happened ("feeding_added",
 * "onboarding_completed"). Reuse an existing event instead of inventing a
 * near-duplicate — check this file first.
 *
 * PRIVACY — read before adding a new event or property
 * - Never include a baby's name, date of birth, or any other identifying
 *   detail about a child.
 * - Never include health/medical notes, medicine names/doses, vaccine
 *   details, or free-text notes of any kind.
 * - Never include Ask Pilu questions/answers or Pilu Vision analysis
 *   text/photos — only that the feature was used, not its content.
 * - Prefer categorical properties (a plan id, a activity kind, a screen
 *   name) over anything free-text or user-authored.
 * - Person identification uses only the Supabase auth user id (already an
 *   opaque UUID) via posthog.identify() — never email, name, or phone.
 *   Anonymous, pre-login events (first_launch, public screen views) are
 *   sent under PostHog's own anonymous device id, not identified.
 * - Analytics only sends after the user accepts the GDPR consent banner
 *   (components/analytics/analytics-consent-banner.tsx) or has previously
 *   accepted; declining stops all capture, including screen views.
 *
 * FUNNELS (configure these as Funnel insights in the PostHog UI — the
 * event names below are what you'd chain together)
 * 1. Installation → Registration: app_installed → account_created
 * 2. Registration → Baby Created: account_created → baby_created
 * 3. Baby Created → First Log: baby_created → (first of feeding_added /
 *    sleep_logged / diaper_logged / growth_entry_added / medicine_logged /
 *    memory_created)
 * 4. First Log → Elite Upgrade: any log event → subscription_started
 *    (filter properties.tier = "elite")
 * 5. Elite → Premium Upgrade: subscription_started (tier=elite) →
 *    subscription_started (tier=premium)
 *
 * RETENTION (configure as Retention/Trends insights in PostHog — no extra
 * event needed, PostHog derives these from any identified event volume)
 * - DAU / WAU / MAU: Trends insight on any event (e.g. $pageview),
 *   unique users, daily/weekly/monthly.
 * - Returning users: Retention insight anchored on login or $pageview.
 * - Session duration: PostHog's built-in session length, from $pageview
 *   events (autocapture-derived session tracking still works with
 *   autocapture off, since $pageview alone is enough for session length).
 * - Most used features: Trends insight breaking down feature_used and the
 *   per-feature log events by count.
 * ============================================================================
 */

export const AnalyticsEvent = {
  // Lifecycle
  APP_INSTALLED: "app_installed",
  FIRST_LAUNCH: "first_launch",
  ACCOUNT_CREATED: "account_created",
  LOGIN: "login",
  ONBOARDING_COMPLETED: "onboarding_completed",
  BABY_CREATED: "baby_created",

  // Subscription
  SUBSCRIPTION_STARTED: "subscription_started",
  SUBSCRIPTION_RENEWED: "subscription_renewed",
  SUBSCRIPTION_CANCELLED: "subscription_cancelled",

  // AI features
  AI_CONVERSATION_STARTED: "ai_conversation_started",
  AI_VISION_SCAN: "ai_vision_scan",

  // Tracking
  FEEDING_ADDED: "feeding_added",
  SLEEP_LOGGED: "sleep_logged",
  DIAPER_LOGGED: "diaper_logged",
  GROWTH_ENTRY_ADDED: "growth_entry_added",
  MEDICINE_LOGGED: "medicine_logged",
  MEMORY_CREATED: "memory_created",

  // Engagement
  FIRST_AID_OPENED: "first_aid_opened",
  NOTIFICATION_OPENED: "notification_opened",
  REMINDER_COMPLETED: "reminder_completed",
  FEATURE_USED: "feature_used",
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

/** Property shape per event — kept intentionally small and non-identifying. */
export type AnalyticsEventProperties = {
  [AnalyticsEvent.APP_INSTALLED]: Record<string, never>;
  /** Fires once per browser/device the first time Pilu loads. */
  [AnalyticsEvent.FIRST_LAUNCH]: Record<string, never>;
  /** Google OAuth isn't tracked here today — the session is established via a server-side redirect (app/auth/callback) with no safe single client call site to fire this from without risking a duplicate event. Only password sign-up fires this. */
  [AnalyticsEvent.ACCOUNT_CREATED]: { method: "password" | "google" };
  /** Same Google OAuth limitation as account_created — only password sign-in fires this today. */
  [AnalyticsEvent.LOGIN]: { method: "password" | "google" };
  [AnalyticsEvent.ONBOARDING_COMPLETED]: Record<string, never>;
  /** Fires when a family's first baby profile is created — distinct from onboarding_completed for funnel step 2. */
  [AnalyticsEvent.BABY_CREATED]: Record<string, never>;
  [AnalyticsEvent.SUBSCRIPTION_STARTED]: { planId: string; tier: "elite" | "premium" };
  [AnalyticsEvent.SUBSCRIPTION_RENEWED]: { planId: string; tier: "elite" | "premium" };
  [AnalyticsEvent.SUBSCRIPTION_CANCELLED]: { planId: string; tier: "elite" | "premium" };
  [AnalyticsEvent.AI_CONVERSATION_STARTED]: Record<string, never>;
  /** category is the scan type (e.g. "food"), never the photo or the analysis text. */
  [AnalyticsEvent.AI_VISION_SCAN]: { category: string };
  [AnalyticsEvent.FEEDING_ADDED]: { kind: "feeding" | "bottle" | "breastfeeding" };
  [AnalyticsEvent.SLEEP_LOGGED]: { sleepType?: string };
  [AnalyticsEvent.DIAPER_LOGGED]: Record<string, never>;
  [AnalyticsEvent.GROWTH_ENTRY_ADDED]: Record<string, never>;
  [AnalyticsEvent.MEDICINE_LOGGED]: Record<string, never>;
  /** source distinguishes Memory Book entries from milestone-triggered memories — never the memory's title/caption. */
  [AnalyticsEvent.MEMORY_CREATED]: { source?: string };
  [AnalyticsEvent.FIRST_AID_OPENED]: Record<string, never>;
  [AnalyticsEvent.NOTIFICATION_OPENED]: { category?: string };
  [AnalyticsEvent.REMINDER_COMPLETED]: { kind?: string };
  /** Generic hook for any feature not covered by a dedicated event above. */
  [AnalyticsEvent.FEATURE_USED]: { feature: string };
};

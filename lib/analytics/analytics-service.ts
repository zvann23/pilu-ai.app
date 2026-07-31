import { capture } from "@/lib/analytics/posthog-client";
import { AnalyticsEvent, type AnalyticsEventName, type AnalyticsEventProperties } from "@/lib/analytics/events";

/**
 * The only entry point features should use to report analytics — never
 * import posthog-js or lib/analytics/posthog-client.ts directly outside
 * this file and the provider/consent components. See events.ts for what
 * each event means and the privacy rules for what may go in properties.
 */
function track<Event extends AnalyticsEventName>(event: Event, properties: AnalyticsEventProperties[Event]) {
  capture(event, properties);
}

export function trackAppInstalled() {
  track(AnalyticsEvent.APP_INSTALLED, {});
}

export function trackFirstLaunch() {
  track(AnalyticsEvent.FIRST_LAUNCH, {});
}

export function trackAccountCreated(method: "password" | "google") {
  track(AnalyticsEvent.ACCOUNT_CREATED, { method });
}

export function trackLogin(method: "password" | "google") {
  track(AnalyticsEvent.LOGIN, { method });
}

export function trackOnboardingCompleted() {
  track(AnalyticsEvent.ONBOARDING_COMPLETED, {});
}

export function trackBabyCreated() {
  track(AnalyticsEvent.BABY_CREATED, {});
}

export function trackSubscriptionStarted(planId: string, tier: "elite" | "premium") {
  track(AnalyticsEvent.SUBSCRIPTION_STARTED, { planId, tier });
}

export function trackSubscriptionRenewed(planId: string, tier: "elite" | "premium") {
  track(AnalyticsEvent.SUBSCRIPTION_RENEWED, { planId, tier });
}

export function trackSubscriptionCancelled(planId: string, tier: "elite" | "premium") {
  track(AnalyticsEvent.SUBSCRIPTION_CANCELLED, { planId, tier });
}

export function trackAiConversationStarted() {
  track(AnalyticsEvent.AI_CONVERSATION_STARTED, {});
}

export function trackAiVisionScan(category: string) {
  track(AnalyticsEvent.AI_VISION_SCAN, { category });
}

export function trackFeedingAdded(kind: "feeding" | "bottle" | "breastfeeding") {
  track(AnalyticsEvent.FEEDING_ADDED, { kind });
}

export function trackSleepLogged(sleepType?: string) {
  track(AnalyticsEvent.SLEEP_LOGGED, { sleepType });
}

export function trackDiaperLogged() {
  track(AnalyticsEvent.DIAPER_LOGGED, {});
}

export function trackGrowthEntryAdded() {
  track(AnalyticsEvent.GROWTH_ENTRY_ADDED, {});
}

export function trackMedicineLogged() {
  track(AnalyticsEvent.MEDICINE_LOGGED, {});
}

export function trackMemoryCreated(source?: string) {
  track(AnalyticsEvent.MEMORY_CREATED, { source });
}

export function trackFirstAidOpened() {
  track(AnalyticsEvent.FIRST_AID_OPENED, {});
}

export function trackNotificationOpened(category?: string) {
  track(AnalyticsEvent.NOTIFICATION_OPENED, { category });
}

export function trackReminderCompleted(kind?: string) {
  track(AnalyticsEvent.REMINDER_COMPLETED, { kind });
}

export function trackFeatureUsed(feature: string) {
  track(AnalyticsEvent.FEATURE_USED, { feature });
}

export function trackScreenView(pathname: string) {
  capture("$pageview", { $current_url: pathname });
}

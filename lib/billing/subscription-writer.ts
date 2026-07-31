import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import type { PlaySubscriptionState } from "@/lib/billing/google-play-client";
import { planById } from "@/lib/billing/plans";
import { captureServerEvent } from "@/lib/analytics/server-capture";
import { AnalyticsEvent } from "@/lib/analytics/events";
import type { PlanId } from "@/types/billing";

/**
 * The only code path allowed to write to subscriptions/purchase_receipts/
 * subscription_events — always runs server-side with the service role,
 * after a purchase has been independently verified against the Google
 * Play Developer API. RLS on these tables grants client roles SELECT
 * only, so this is enforced at the database level too, not just here.
 */

async function resolvePlanId(playProductId: string | null, basePlanId: string | null): Promise<PlanId | null> {
  const admin = getSupabaseAdminClient();
  if (!admin || !playProductId) return null;
  const { data } = await admin
    .from("subscription_plans")
    .select("id")
    .eq("play_product_id", playProductId)
    .eq("play_base_plan_id", basePlanId)
    .maybeSingle();
  return (data?.id as PlanId | undefined) ?? null;
}

const activeLikeStatuses = new Set(["active", "grace_period", "on_hold"]);

/** Best-effort analytics signal — never lets a tracking failure affect the actual subscription write. */
async function trackLifecycleChange(admin: NonNullable<ReturnType<typeof getSupabaseAdminClient>>, familyId: string, planId: PlanId, priorStatus: string | null, priorExpiresAt: string | null, nextStatus: string, nextExpiresAt: string | null) {
  try {
    const plan = planById(planId);
    if (plan.tier === "free") return;

    let eventName: string | null = null;
    if (!priorStatus) eventName = AnalyticsEvent.SUBSCRIPTION_STARTED;
    else if (activeLikeStatuses.has(priorStatus) && (nextStatus === "canceled" || nextStatus === "expired")) eventName = AnalyticsEvent.SUBSCRIPTION_CANCELLED;
    else if (nextStatus === "active" && priorExpiresAt && nextExpiresAt && new Date(nextExpiresAt) > new Date(priorExpiresAt)) eventName = AnalyticsEvent.SUBSCRIPTION_RENEWED;
    if (!eventName) return;

    const { data: family } = await admin.from("families").select("owner_id").eq("id", familyId).maybeSingle();
    if (!family?.owner_id) return;
    await captureServerEvent(family.owner_id, eventName, { planId, tier: plan.tier });
  } catch {
    // Never let analytics affect the subscription write above.
  }
}

export async function recordVerifiedPurchase(familyId: string, purchaseToken: string, verified: PlaySubscriptionState, source: "client" | "rtdn"): Promise<{ planId: PlanId } | null> {
  const admin = getSupabaseAdminClient();
  if (!admin) return null;

  const planId = await resolvePlanId(verified.productId, verified.basePlanId);
  if (!planId) return null;

  const { data: prior } = await admin.from("subscriptions").select("status, expires_at").eq("family_id", familyId).maybeSingle();

  const { data: subscription, error } = await admin
    .from("subscriptions")
    .upsert(
      {
        family_id: familyId,
        plan_id: planId,
        status: verified.status,
        play_purchase_token: purchaseToken,
        auto_renewing: verified.autoRenewing,
        cancel_at_period_end: !verified.autoRenewing,
        acknowledged: verified.acknowledged,
        starts_at: verified.startsAt,
        expires_at: verified.expiresAt,
        canceled_at: verified.status === "canceled" ? new Date().toISOString() : null,
        environment: "production",
      },
      { onConflict: "family_id" },
    )
    .select("id")
    .single();

  if (error) throw error;

  await admin.from("purchase_receipts").upsert(
    { family_id: familyId, play_purchase_token: purchaseToken, play_product_id: verified.productId ?? "unknown", verification_result: verified.raw as object },
    { onConflict: "play_purchase_token" },
  );

  await admin.from("subscription_events").insert({
    family_id: familyId,
    subscription_id: subscription?.id ?? null,
    event_type: verified.status,
    source,
    raw_payload: verified.raw as object,
  });

  await trackLifecycleChange(admin, familyId, planId, prior?.status ?? null, prior?.expires_at ?? null, verified.status, verified.expiresAt);

  return { planId };
}

/** RTDN events (grace period, on_hold, cancellation, expiry, revocation) arrive keyed by purchase token, not family_id — look the family up first. */
export async function findFamilyIdByPurchaseToken(purchaseToken: string): Promise<string | null> {
  const admin = getSupabaseAdminClient();
  if (!admin) return null;
  const { data } = await admin.from("subscriptions").select("family_id").eq("play_purchase_token", purchaseToken).maybeSingle();
  return data?.family_id ?? null;
}

import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import type { PlaySubscriptionState } from "@/lib/billing/google-play-client";
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

export async function recordVerifiedPurchase(familyId: string, purchaseToken: string, verified: PlaySubscriptionState, source: "client" | "rtdn"): Promise<{ planId: PlanId } | null> {
  const admin = getSupabaseAdminClient();
  if (!admin) return null;

  const planId = await resolvePlanId(verified.productId, verified.basePlanId);
  if (!planId) return null;

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

  return { planId };
}

/** RTDN events (grace period, on_hold, cancellation, expiry, revocation) arrive keyed by purchase token, not family_id — look the family up first. */
export async function findFamilyIdByPurchaseToken(purchaseToken: string): Promise<string | null> {
  const admin = getSupabaseAdminClient();
  if (!admin) return null;
  const { data } = await admin.from("subscriptions").select("family_id").eq("play_purchase_token", purchaseToken).maybeSingle();
  return data?.family_id ?? null;
}

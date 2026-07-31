import { supabase } from "@/lib/supabase/client";
import type { FamilySubscription, PlanId, SubscriptionStatus } from "@/types/billing";

type SubscriptionRow = {
  family_id: string;
  plan_id: PlanId;
  status: SubscriptionStatus;
  auto_renewing: boolean;
  cancel_at_period_end: boolean;
  acknowledged: boolean;
  starts_at: string | null;
  expires_at: string | null;
  canceled_at: string | null;
  subscription_plans: { tier: FamilySubscription["tier"]; billing_period: FamilySubscription["billingPeriod"] } | { tier: FamilySubscription["tier"]; billing_period: FamilySubscription["billingPeriod"] }[] | null;
};

function planOf(row: SubscriptionRow) {
  return Array.isArray(row.subscription_plans) ? row.subscription_plans[0] : row.subscription_plans;
}

function rowToSubscription(row: SubscriptionRow): FamilySubscription {
  const plan = planOf(row);
  return {
    familyId: row.family_id,
    planId: row.plan_id,
    tier: plan?.tier ?? "free",
    billingPeriod: plan?.billing_period ?? null,
    status: row.status,
    autoRenewing: row.auto_renewing,
    cancelAtPeriodEnd: row.cancel_at_period_end,
    acknowledged: row.acknowledged,
    startsAt: row.starts_at,
    expiresAt: row.expires_at,
    canceledAt: row.canceled_at,
  };
}

/**
 * Reads only — every write to `subscriptions` happens server-side after
 * verifying a purchase against the Google Play Developer API (see
 * app/api/billing/*), never directly from the client.
 */
export async function getFamilySubscription(familyId: string): Promise<FamilySubscription | null> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("family_id, plan_id, status, auto_renewing, cancel_at_period_end, acknowledged, starts_at, expires_at, canceled_at, subscription_plans(tier, billing_period)")
    .eq("family_id", familyId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return rowToSubscription(data as SubscriptionRow);
}

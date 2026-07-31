import { ENTITLED_STATUSES, type SubscriptionStatus, type SubscriptionTier } from "@/types/billing";
import type { SupabaseClient } from "@supabase/supabase-js";

type PlanRow = { tier: SubscriptionTier } | { tier: SubscriptionTier }[] | null;

/**
 * Server-side tier lookup for API routes — takes an already-authenticated
 * server client (carries the request's own session/RLS) rather than the
 * browser-only client subscription-repository.ts uses. A lapsed/expired
 * subscription reads as free, same rule as lib/billing/entitlements.ts.
 */
export async function getFamilyTierServer(supabase: SupabaseClient, familyId: string): Promise<SubscriptionTier> {
  const { data } = await supabase
    .from("subscriptions")
    .select("status, subscription_plans(tier)")
    .eq("family_id", familyId)
    .maybeSingle();

  if (!data) return "free";
  const status = data.status as SubscriptionStatus;
  if (!ENTITLED_STATUSES.includes(status)) return "free";

  const plan = data.subscription_plans as PlanRow;
  const tier = Array.isArray(plan) ? plan[0]?.tier : plan?.tier;
  return tier ?? "free";
}

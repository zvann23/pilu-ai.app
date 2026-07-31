import { acknowledgePlaySubscriptionPurchase, isGooglePlayConfigured, verifyPlaySubscriptionPurchase } from "@/lib/billing/google-play-client";
import { recordVerifiedPurchase } from "@/lib/billing/subscription-writer";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * The purchase token from the Digital Goods purchase flow is the only
 * thing the client sends — everything else (which product, which plan,
 * whether it's actually valid) is re-derived here from the Google Play
 * Developer API. A client claiming "I bought Premium" is never enough on
 * its own to grant Premium.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { purchaseToken?: string } | null;
  const purchaseToken = body?.purchaseToken;
  if (!purchaseToken) {
    return NextResponse.json({ error: "purchaseToken is required" }, { status: 400 });
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication is required" }, { status: 401 });
  }

  if (!isGooglePlayConfigured()) {
    return NextResponse.json({ error: "Billing verification is not configured yet" }, { status: 503 });
  }

  const { data: membership } = await supabase
    .from("family_members")
    .select("family_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();
  if (!membership) {
    return NextResponse.json({ error: "You need a family before purchasing a subscription" }, { status: 404 });
  }

  const verified = await verifyPlaySubscriptionPurchase(purchaseToken);
  if (!verified) {
    return NextResponse.json({ error: "This purchase could not be verified" }, { status: 422 });
  }

  if (!verified.acknowledged && verified.productId) {
    await acknowledgePlaySubscriptionPurchase(verified.productId, purchaseToken);
  }

  const result = await recordVerifiedPurchase(membership.family_id as string, purchaseToken, verified, "client");
  if (!result) {
    return NextResponse.json({ error: "This purchase does not match a known Pilu plan" }, { status: 422 });
  }

  return NextResponse.json({ planId: result.planId, status: verified.status });
}

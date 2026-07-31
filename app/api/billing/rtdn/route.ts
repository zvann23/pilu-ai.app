import { verifyPlaySubscriptionPurchase } from "@/lib/billing/google-play-client";
import { findFamilyIdByPurchaseToken, recordVerifiedPurchase } from "@/lib/billing/subscription-writer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type PubSubPushBody = { message?: { data?: string; messageId?: string } };
type RtdnPayload = { subscriptionNotification?: { purchaseToken?: string; notificationType?: number } };

/**
 * Google Play Real-time Developer Notifications, delivered as a Pub/Sub
 * push subscription — this is how the backend learns about grace period
 * entry, billing retries, cancellations, and expirations without polling.
 * The notification itself is just a nudge ("something changed for this
 * token"); the actual new state is always re-fetched from the Developer
 * API, never trusted from the notification payload.
 *
 * Setup (Razvan, manual): Play Console → Monetization setup → Real-time
 * developer notifications → create a Pub/Sub topic, then a push
 * subscription on that topic pointing at
 * https://pilu-ai.vercel.app/api/billing/rtdn?secret=<RTDN_WEBHOOK_SECRET>
 * (set RTDN_WEBHOOK_SECRET in Vercel to whatever you put in that URL).
 *
 * Always acks (200) once the message is parsed, even if it doesn't match
 * a known purchase — returning an error would make Pub/Sub redeliver the
 * same message forever.
 */
export async function POST(request: Request) {
  const secret = process.env.RTDN_WEBHOOK_SECRET;
  if (secret && new URL(request.url).searchParams.get("secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as PubSubPushBody | null;
  const encoded = body?.message?.data;
  if (!encoded) return NextResponse.json({ ok: true });

  let payload: RtdnPayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64").toString("utf8")) as RtdnPayload;
  } catch {
    return NextResponse.json({ ok: true });
  }

  const purchaseToken = payload.subscriptionNotification?.purchaseToken;
  if (!purchaseToken) return NextResponse.json({ ok: true });

  const familyId = await findFamilyIdByPurchaseToken(purchaseToken);
  if (!familyId) return NextResponse.json({ ok: true });

  const verified = await verifyPlaySubscriptionPurchase(purchaseToken);
  if (!verified) return NextResponse.json({ ok: true });

  await recordVerifiedPurchase(familyId, purchaseToken, verified, "rtdn");
  return NextResponse.json({ ok: true });
}

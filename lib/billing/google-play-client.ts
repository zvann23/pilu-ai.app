import { createSign } from "crypto";
import type { SubscriptionStatus } from "@/types/billing";

/**
 * Minimal Google Play Developer API (androidpublisher) client for
 * server-side purchase verification — no `googleapis` dependency, just a
 * hand-rolled service-account JWT Bearer exchange and a couple of REST
 * calls. Returns null/false when GOOGLE_PLAY_SERVICE_ACCOUNT_JSON or
 * GOOGLE_PLAY_PACKAGE_NAME aren't configured yet, so routes can no-op
 * gracefully rather than crash (same convention as admin-client.ts).
 *
 * Setup (Razvan, manual — cannot be done from here):
 * 1. Google Cloud Console → create a service account with access to the
 *    Play Console's API, download its JSON key.
 * 2. Play Console → Setup → API access → link the Cloud project and grant
 *    the service account "View financial data" + "Manage orders and
 *    subscriptions" permissions.
 * 3. Set GOOGLE_PLAY_SERVICE_ACCOUNT_JSON (the full downloaded JSON, as a
 *    single-line string) and GOOGLE_PLAY_PACKAGE_NAME (e.g. app.pilu.android)
 *    in Vercel's Production environment variables.
 */

type ServiceAccount = { client_email: string; private_key: string };

function loadServiceAccount(): ServiceAccount | null {
  const raw = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ServiceAccount>;
    if (!parsed.client_email || !parsed.private_key) return null;
    return { client_email: parsed.client_email, private_key: parsed.private_key };
  } catch {
    return null;
  }
}

function packageName(): string | null {
  return process.env.GOOGLE_PLAY_PACKAGE_NAME || null;
}

export function isGooglePlayConfigured(): boolean {
  return loadServiceAccount() !== null && packageName() !== null;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getAccessToken(account: ServiceAccount): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: account.client_email,
    scope: "https://www.googleapis.com/auth/androidpublisher",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = base64url(signer.sign(account.private_key));
  const jwt = `${unsigned}.${signature}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { access_token?: string };
  return data.access_token ?? null;
}

async function authorizedRequest(path: string, init?: RequestInit): Promise<Response | null> {
  const account = loadServiceAccount();
  if (!account) return null;
  const accessToken = await getAccessToken(account);
  if (!accessToken) return null;
  return fetch(`https://androidpublisher.googleapis.com/androidpublisher/v3${path}`, {
    ...init,
    headers: { ...init?.headers, Authorization: `Bearer ${accessToken}` },
  });
}

const stateMap: Record<string, SubscriptionStatus> = {
  SUBSCRIPTION_STATE_ACTIVE: "active",
  SUBSCRIPTION_STATE_IN_GRACE_PERIOD: "grace_period",
  SUBSCRIPTION_STATE_ON_HOLD: "on_hold",
  SUBSCRIPTION_STATE_PAUSED: "paused",
  SUBSCRIPTION_STATE_CANCELED: "canceled",
  SUBSCRIPTION_STATE_EXPIRED: "expired",
  SUBSCRIPTION_STATE_PENDING: "pending",
};

type SubscriptionPurchaseV2 = {
  subscriptionState?: string;
  startTime?: string;
  linkedPurchaseToken?: string;
  acknowledgementState?: string;
  lineItems?: { productId?: string; expiryTime?: string; autoRenewingPlan?: { autoRenewEnabled?: boolean }; offerDetails?: { basePlanId?: string } }[];
};

export type PlaySubscriptionState = {
  status: SubscriptionStatus;
  autoRenewing: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  acknowledged: boolean;
  linkedPurchaseToken: string | null;
  productId: string | null;
  basePlanId: string | null;
  raw: unknown;
};

function mapSubscriptionV2(data: SubscriptionPurchaseV2): PlaySubscriptionState {
  const lineItem = data.lineItems?.[0];
  return {
    status: stateMap[data.subscriptionState ?? ""] ?? "pending",
    autoRenewing: lineItem?.autoRenewingPlan?.autoRenewEnabled ?? false,
    startsAt: data.startTime ?? null,
    expiresAt: lineItem?.expiryTime ?? null,
    acknowledged: data.acknowledgementState === "ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED",
    linkedPurchaseToken: data.linkedPurchaseToken ?? null,
    productId: lineItem?.productId ?? null,
    basePlanId: lineItem?.offerDetails?.basePlanId ?? null,
    raw: data,
  };
}

/** The single source of truth for what a purchase token actually grants — never trust the productId/state the client claims, always re-fetch it here. */
export async function verifyPlaySubscriptionPurchase(purchaseToken: string): Promise<PlaySubscriptionState | null> {
  const pkg = packageName();
  if (!pkg) return null;
  const response = await authorizedRequest(`/applications/${pkg}/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`);
  if (!response || !response.ok) return null;
  const data = (await response.json()) as SubscriptionPurchaseV2;
  return mapSubscriptionV2(data);
}

/** Play requires every subscription purchase to be acknowledged within 3 days or it's automatically refunded. */
export async function acknowledgePlaySubscriptionPurchase(playProductId: string, purchaseToken: string): Promise<boolean> {
  const pkg = packageName();
  if (!pkg) return false;
  const response = await authorizedRequest(
    `/applications/${pkg}/purchases/subscriptions/${encodeURIComponent(playProductId)}/tokens/${encodeURIComponent(purchaseToken)}:acknowledge`,
    { method: "POST" },
  );
  return response?.ok ?? false;
}

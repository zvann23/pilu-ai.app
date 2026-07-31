/**
 * The only way a web app reaches Google Play Billing is the Digital Goods
 * API, paired with the Payment Request API's `https://play.google.com/billing`
 * payment method. Both are only implemented inside a Trusted Web Activity —
 * a native Android wrapper around this site, published through Play — so
 * in a normal browser (including every environment this was built and
 * tested in) `isBillingAvailable()` resolves false and every call below is
 * a safe, deliberate no-op. Nothing here throws when Billing is unavailable.
 */

type DigitalGoodsItemDetails = {
  itemId: string;
  title: string;
  description: string;
  price: { currency: string; value: string };
  subscriptionPeriod?: string;
};

type DigitalGoodsPurchaseDetails = {
  itemId: string;
  purchaseToken: string;
};

type DigitalGoodsService = {
  getDetails: (itemIds: string[]) => Promise<DigitalGoodsItemDetails[]>;
  listPurchases: () => Promise<DigitalGoodsPurchaseDetails[]>;
  listPurchaseHistory?: () => Promise<DigitalGoodsPurchaseDetails[]>;
  consume?: (purchaseToken: string) => Promise<void>;
};

declare global {
  interface Window {
    getDigitalGoodsService?: (paymentMethod: string) => Promise<DigitalGoodsService>;
  }
}

const PLAY_BILLING_METHOD = "https://play.google.com/billing";
let cachedService: DigitalGoodsService | null | undefined;

async function resolveService(): Promise<DigitalGoodsService | null> {
  if (cachedService !== undefined) return cachedService;
  if (typeof window === "undefined" || !window.getDigitalGoodsService) {
    cachedService = null;
    return cachedService;
  }
  try {
    cachedService = await window.getDigitalGoodsService(PLAY_BILLING_METHOD);
  } catch {
    cachedService = null;
  }
  return cachedService;
}

export async function isBillingAvailable(): Promise<boolean> {
  return (await resolveService()) !== null;
}

export async function getProductDetails(itemIds: string[]): Promise<DigitalGoodsItemDetails[]> {
  const service = await resolveService();
  if (!service) return [];
  try {
    return await service.getDetails(itemIds);
  } catch {
    return [];
  }
}

export async function listActivePurchases(): Promise<DigitalGoodsPurchaseDetails[]> {
  const service = await resolveService();
  if (!service) return [];
  try {
    return await service.listPurchases();
  } catch {
    return [];
  }
}

export type PurchaseResult = { purchaseToken: string; itemId: string };

/**
 * Runs the native Play purchase sheet via the Payment Request API and
 * resolves once the purchase token comes back. Callers must send the
 * resulting token to /api/billing/verify-purchase — this function only
 * completes the purchase UI flow, it never grants access on its own.
 */
export async function purchaseSubscription(productId: string, priceLabel: string): Promise<PurchaseResult | null> {
  if (typeof window === "undefined" || !("PaymentRequest" in window)) return null;
  if (!(await isBillingAvailable())) return null;

  const request = new PaymentRequest(
    [{ supportedMethods: PLAY_BILLING_METHOD, data: { sku: productId } }],
    { total: { label: priceLabel, amount: { currency: "USD", value: "0" } } },
  );

  try {
    const response = await request.show();
    const details = response.details as { purchaseToken?: string; itemId?: string } | undefined;
    if (!details?.purchaseToken) {
      await response.complete("fail");
      return null;
    }
    await response.complete("success");
    return { purchaseToken: details.purchaseToken, itemId: details.itemId ?? productId };
  } catch {
    return null;
  }
}

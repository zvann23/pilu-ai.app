type RateEntry = { count: number; resetAt: number };
const WINDOW_MS = 60_000;

function createRateLimiter(maxRequests: number) {
  const entries = new Map<string, RateEntry>();
  return (key: string) => {
    const now = Date.now();
    const existing = entries.get(key);
    if (!existing || existing.resetAt < now) {
      entries.set(key, { count: 1, resetAt: now + WINDOW_MS });
      return { allowed: true };
    }
    if (existing.count >= maxRequests) return { allowed: false };
    existing.count += 1;
    return { allowed: true };
  };
}

export const checkAskPiluRateLimit = createRateLimiter(12);
/** Report generation is heavier than a chat turn, so it gets a lower ceiling. */
export const checkReportsRateLimit = createRateLimiter(6);
/** Image analysis is the heaviest call Pilu makes — this is abuse protection, separate from the per-tier daily scan quota. */
export const checkVisionRateLimit = createRateLimiter(6);

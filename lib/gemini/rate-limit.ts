type RateEntry = { count: number; resetAt: number };
const entries = new Map<string, RateEntry>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 12;

export function checkAskPiluRateLimit(key: string) {
  const now = Date.now(); const existing = entries.get(key);
  if (!existing || existing.resetAt < now) { entries.set(key, { count: 1, resetAt: now + WINDOW_MS }); return { allowed: true }; }
  if (existing.count >= MAX_REQUESTS) return { allowed: false };
  existing.count += 1; return { allowed: true };
}

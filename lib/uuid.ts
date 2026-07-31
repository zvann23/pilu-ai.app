const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Distinguishes a real Supabase row id from the local mock scaffold's placeholder ids (e.g. "emma") while the baby/family hasn't loaded yet. */
export function isUuid(value: string | undefined | null): value is string {
  return !!value && UUID_RE.test(value);
}

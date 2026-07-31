"use client";

import { supabase } from "@/lib/supabase/client";
import { enqueueMutation } from "./mutation-queue";
import { isNetworkError } from "./sync-engine";

type MirrorWrite = { table: string; row: Record<string, unknown> };
type MirrorUpdate = { table: string; row: Record<string, unknown>; match: Record<string, unknown> };
type MirrorDelete = { table: string; match: Record<string, unknown> };

/**
 * The three primitives every offline-aware domain repository is built
 * from: try the write live; if the browser is offline or the request
 * fails for a network reason, queue it and return immediately so the
 * caller can apply an optimistic local update. A genuine (non-network)
 * rejection — a real constraint or RLS error — is thrown to the caller
 * rather than queued, since retrying it later would just fail again.
 */

export async function queuedInsert(table: string, row: Record<string, unknown>, description: string, mirror?: MirrorWrite): Promise<{ synced: boolean }> {
  if (typeof navigator !== "undefined" && navigator.onLine) {
    try {
      const { error } = await supabase.from(table).insert(row);
      if (!error) {
        if (mirror) await supabase.from(mirror.table).insert(mirror.row).then(() => undefined, () => undefined);
        return { synced: true };
      }
      if (!isNetworkError(error)) throw error;
    } catch (err) {
      if (!isNetworkError(err)) throw err;
    }
  }
  await enqueueMutation({
    table, operation: "insert", payload: row,
    mirrorTable: mirror?.table, mirrorOperation: mirror ? "insert" : undefined, mirrorPayload: mirror?.row,
    description,
  });
  return { synced: false };
}

export async function queuedUpdate(table: string, id: string, row: Record<string, unknown>, description: string, mirror?: MirrorUpdate): Promise<{ synced: boolean }> {
  if (typeof navigator !== "undefined" && navigator.onLine) {
    try {
      const { error } = await supabase.from(table).update(row).eq("id", id);
      if (!error) {
        if (mirror) await supabase.from(mirror.table).update(mirror.row).match(mirror.match).then(() => undefined, () => undefined);
        return { synced: true };
      }
      if (!isNetworkError(error)) throw error;
    } catch (err) {
      if (!isNetworkError(err)) throw err;
    }
  }
  await enqueueMutation({
    table, operation: "update", payload: row, match: { id },
    mirrorTable: mirror?.table, mirrorOperation: mirror ? "update" : undefined, mirrorPayload: mirror?.row, mirrorMatch: mirror?.match,
    description,
  });
  return { synced: false };
}

export async function queuedDelete(table: string, id: string, description: string, mirror?: MirrorDelete): Promise<{ synced: boolean }> {
  if (typeof navigator !== "undefined" && navigator.onLine) {
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (!error) {
        if (mirror) await supabase.from(mirror.table).delete().match(mirror.match).then(() => undefined, () => undefined);
        return { synced: true };
      }
      if (!isNetworkError(error)) throw error;
    } catch (err) {
      if (!isNetworkError(err)) throw err;
    }
  }
  await enqueueMutation({
    table, operation: "delete", match: { id },
    mirrorTable: mirror?.table, mirrorOperation: mirror ? "delete" : undefined, mirrorMatch: mirror?.match,
    description,
  });
  return { synced: false };
}

/** Live fetch with a cache fallback for offline reads — see list-cache.ts. */
export async function fetchWithCacheFallback<T>(table: string, scopeId: string, fetcher: () => Promise<T[]>, cacheGet: (table: string, scopeId: string) => Promise<T[]>, cacheSet: (table: string, scopeId: string, rows: T[]) => Promise<void>): Promise<T[]> {
  if (typeof navigator !== "undefined" && !navigator.onLine) return cacheGet(table, scopeId);
  try {
    const rows = await fetcher();
    void cacheSet(table, scopeId, rows);
    return rows;
  } catch (err) {
    if (isNetworkError(err)) return cacheGet(table, scopeId);
    throw err;
  }
}

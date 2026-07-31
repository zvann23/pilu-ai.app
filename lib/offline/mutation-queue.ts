"use client";

import { MUTATIONS_STORE, idbDelete, idbGetAll, idbPut } from "./db";

export type QueuedOperation = "insert" | "update" | "delete";

/**
 * One queued write. `table`/`payload`/`match` describe the primary
 * Supabase call (`match` is the `.eq(...)` filter for update/delete —
 * always `{ id }` here, since every domain row uses a client-generated
 * uuid as its primary key). `mirror*` optionally describes a second
 * write to `timeline_events` (see lib/supabase/timeline-mirror.ts) kept
 * in the same queue entry so both apply together on replay.
 */
export type QueuedMutation = {
  id: string;
  createdAt: number;
  table: string;
  operation: QueuedOperation;
  payload?: Record<string, unknown>;
  match?: Record<string, unknown>;
  mirrorTable?: string;
  mirrorOperation?: QueuedOperation;
  mirrorPayload?: Record<string, unknown>;
  mirrorMatch?: Record<string, unknown>;
  /** Human-readable label for the pending-sync indicator, e.g. "Feeding — 120 ml". */
  description: string;
};

const listeners = new Set<() => void>();

function notifyChanged() {
  listeners.forEach((callback) => callback());
}

export function subscribeToQueue(callback: () => void) {
  listeners.add(callback);
  return () => { listeners.delete(callback); };
}

export async function enqueueMutation(mutation: Omit<QueuedMutation, "id" | "createdAt">): Promise<void> {
  const record: QueuedMutation = { ...mutation, id: crypto.randomUUID(), createdAt: Date.now() };
  await idbPut(MUTATIONS_STORE, record);
  notifyChanged();
}

export async function listQueuedMutations(): Promise<QueuedMutation[]> {
  try {
    const all = await idbGetAll<QueuedMutation>(MUTATIONS_STORE);
    return all.sort((a, b) => a.createdAt - b.createdAt);
  } catch {
    return [];
  }
}

export async function removeQueuedMutation(id: string): Promise<void> {
  await idbDelete(MUTATIONS_STORE, id);
  notifyChanged();
}

export async function countQueuedMutations(): Promise<number> {
  return (await listQueuedMutations()).length;
}

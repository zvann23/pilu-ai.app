"use client";

import { supabase } from "@/lib/supabase/client";
import { listQueuedMutations, removeQueuedMutation, subscribeToQueue, type QueuedMutation, type QueuedOperation } from "./mutation-queue";

/**
 * Distinguishes "the network is the problem" from "Postgres rejected this
 * request." postgrest-js only ever throws a real PostgrestError (with a
 * populated `code`) for a response that actually reached the server; a
 * fetch-level failure is caught internally and surfaced as
 * `{ message: "FetchError: ..." | "TypeError: ...", code: "" }` (see
 * PostgrestBuilder's fetch .catch handler). An empty code means "retry
 * later"; a real one means the request completed and was rejected.
 */
export function isNetworkError(error: unknown): boolean {
  if (!error || typeof error !== "object") return true;
  const code = (error as { code?: unknown }).code;
  return code === "" || code === undefined;
}

async function runOperation(table: string, operation: QueuedOperation, payload?: Record<string, unknown>, match?: Record<string, unknown>) {
  const query = supabase.from(table);
  if (operation === "insert") {
    const { error } = await query.insert(payload ?? {});
    if (error) throw error;
    return;
  }
  if (operation === "update") {
    let builder = query.update(payload ?? {});
    for (const [key, value] of Object.entries(match ?? {})) builder = builder.eq(key, value as never);
    const { error } = await builder;
    if (error) throw error;
    return;
  }
  // delete
  let builder = query.delete();
  for (const [key, value] of Object.entries(match ?? {})) builder = builder.eq(key, value as never);
  const { error } = await builder;
  if (error) throw error;
}

async function applyMutation(mutation: QueuedMutation): Promise<void> {
  await runOperation(mutation.table, mutation.operation, mutation.payload, mutation.match);
  if (mutation.mirrorTable && mutation.mirrorOperation) {
    // The timeline_events mirror is best-effort — the domain row (the
    // real data) already landed successfully above, so a mirror failure
    // shouldn't leave the domain write stuck retrying forever.
    try {
      await runOperation(mutation.mirrorTable, mutation.mirrorOperation, mutation.mirrorPayload, mutation.mirrorMatch);
    } catch {
      // swallow — the timeline feed will just be missing this one entry
    }
  }
}

let syncing = false;

/**
 * Drains the queue strictly in order. Stops at the first failure —
 * whether that's a network hiccup or a genuine rejection — rather than
 * skipping ahead, because a later queued mutation can depend on an
 * earlier one having landed (e.g. an update to a row a still-queued
 * insert hasn't created yet). A stuck item stays visible in the pending
 * count until it succeeds; nothing is silently dropped.
 */
export async function syncQueuedMutations(): Promise<void> {
  if (syncing || typeof navigator !== "undefined" && !navigator.onLine) return;
  syncing = true;
  try {
    const queue = await listQueuedMutations();
    for (const mutation of queue) {
      try {
        await applyMutation(mutation);
        await removeQueuedMutation(mutation.id);
      } catch (error) {
        if (isNetworkError(error)) return; // stop the whole drain, try again next reconnect
        return; // genuine rejection — leave it queued rather than lose the write
      }
    }
  } finally {
    syncing = false;
  }
}

let started = false;

/** Call once from a client root — wires reconnect/queue-change events to auto-drain. */
export function startSyncEngine() {
  if (started || typeof window === "undefined") return;
  started = true;
  window.addEventListener("online", () => void syncQueuedMutations());
  subscribeToQueue(() => void syncQueuedMutations());
  if (navigator.onLine) void syncQueuedMutations();
}

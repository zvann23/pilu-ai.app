"use client";

import { LISTS_STORE, idbGet, idbPut } from "./db";

type CacheEntry<T> = { key: string; rows: T[]; cachedAt: number };

function cacheKey(table: string, scopeId: string) {
  return `${table}:${scopeId}`;
}

export async function cacheList<T>(table: string, scopeId: string, rows: T[]): Promise<void> {
  try {
    await idbPut<CacheEntry<T>>(LISTS_STORE, { key: cacheKey(table, scopeId), rows, cachedAt: Date.now() });
  } catch {
    // best-effort — a cache-write failure shouldn't break the live fetch that just succeeded
  }
}

export async function getCachedList<T>(table: string, scopeId: string): Promise<T[]> {
  try {
    const entry = await idbGet<CacheEntry<T>>(LISTS_STORE, cacheKey(table, scopeId));
    return entry?.rows ?? [];
  } catch {
    return [];
  }
}

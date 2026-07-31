"use client";

/**
 * Minimal, dependency-free IndexedDB wrapper. Two object stores:
 * - `mutations`: the offline write queue (see mutation-queue.ts)
 * - `lists`: a read-through cache of the last successful fetch per
 *   (table, baby) pair, so offline screens show real recent data plus
 *   whatever's still queued, instead of an empty/error state.
 */

const DB_NAME = "pilu-offline";
const DB_VERSION = 1;
export const MUTATIONS_STORE = "mutations";
export const LISTS_STORE = "lists";

let dbPromise: Promise<IDBDatabase> | null = null;

export function openOfflineDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("IndexedDB unavailable"));
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(MUTATIONS_STORE)) {
        const store = db.createObjectStore(MUTATIONS_STORE, { keyPath: "id" });
        store.createIndex("createdAt", "createdAt");
      }
      if (!db.objectStoreNames.contains(LISTS_STORE)) {
        db.createObjectStore(LISTS_STORE, { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

export async function idbGetAll<T>(storeName: string): Promise<T[]> {
  const db = await openOfflineDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, "readonly").objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}

export async function idbGet<T>(storeName: string, key: string): Promise<T | undefined> {
  const db = await openOfflineDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, "readonly").objectStore(storeName).get(key);
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error);
  });
}

export async function idbPut<T>(storeName: string, value: T): Promise<void> {
  const db = await openOfflineDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, "readwrite").objectStore(storeName).put(value);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function idbDelete(storeName: string, key: string): Promise<void> {
  const db = await openOfflineDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, "readwrite").objectStore(storeName).delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

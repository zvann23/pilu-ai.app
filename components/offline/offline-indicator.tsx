"use client";

import { startSyncEngine } from "@/lib/offline/sync-engine";
import { countQueuedMutations, subscribeToQueue } from "@/lib/offline/mutation-queue";
import { useOnlineStatus } from "@/lib/offline/network-status";
import { CloudOff, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

/** Calm, non-alarming connectivity + pending-sync status. Renders nothing when online with an empty queue — the common case. */
export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    startSyncEngine();
    let cancelled = false;
    const refresh = () => { countQueuedMutations().then((count) => { if (!cancelled) setPendingCount(count); }); };
    refresh();
    return subscribeToQueue(refresh);
  }, []);

  if (isOnline && pendingCount === 0) return null;

  return (
    <div className="offline-indicator" role="status">
      {!isOnline ? (
        <>
          <CloudOff size={15} aria-hidden="true" />
          <span>{pendingCount > 0 ? `You're offline — ${pendingCount} ${pendingCount === 1 ? "change" : "changes"} will sync when you're back online.` : "You're offline — your logs will save here and sync automatically."}</span>
        </>
      ) : (
        <>
          <RefreshCw size={15} aria-hidden="true" className="offline-indicator__spin" />
          <span>Syncing {pendingCount} {pendingCount === 1 ? "change" : "changes"}…</span>
        </>
      )}
    </div>
  );
}

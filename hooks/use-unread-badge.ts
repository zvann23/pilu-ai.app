"use client";

import { supabase } from "@/lib/supabase/client";
import { unreadCount } from "@/lib/supabase/notification-repository";
import { useEffect, useState } from "react";

/** Lightweight — just the count, for the header bell badge. Full notification bodies live in useNotifications. */
export function useUnreadBadge(userId: string | null) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const refresh = () => unreadCount(userId).then((value) => { if (!cancelled) setCount(value); }).catch(() => undefined);
    refresh();

    const channel = supabase
      .channel(`unread-badge-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }, refresh)
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return count;
}

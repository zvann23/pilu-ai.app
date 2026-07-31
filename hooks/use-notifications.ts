"use client";

import { trackNotificationOpened } from "@/lib/analytics/analytics-service";
import { supabase } from "@/lib/supabase/client";
import { deleteNotification, listNotifications, markAllRead, setNotificationStatus } from "@/lib/supabase/notification-repository";
import type { NotificationCategory, NotificationItem, NotificationStatus } from "@/types/notifications";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<NotificationStatus | "all">("unread");
  const [categoryFilter, setCategoryFilter] = useState<NotificationCategory | "all">("all");

  useEffect(() => {
    if (!userId) return;
    listNotifications(userId)
      .then(setNotifications)
      .catch(() => undefined)
      .finally(() => setIsLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }, () => {
        listNotifications(userId).then(setNotifications).catch(() => undefined);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const filtered = useMemo(
    () => notifications.filter((item) => (statusFilter === "all" || item.status === statusFilter) && (categoryFilter === "all" || item.category === categoryFilter)),
    [notifications, statusFilter, categoryFilter],
  );

  const markRead = useCallback((id: string) => {
    const target = notifications.find((item) => item.id === id);
    if (target && target.status !== "read") trackNotificationOpened(target.category);
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, status: "read" } : item)));
    setNotificationStatus(id, "read").catch(() => undefined);
  }, [notifications]);

  const archive = useCallback((id: string) => {
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, status: "archived" } : item)));
    setNotificationStatus(id, "archived").catch(() => undefined);
  }, []);

  const remove = useCallback((id: string) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
    deleteNotification(id).catch(() => undefined);
  }, []);

  const markAll = useCallback(() => {
    if (!userId) return;
    setNotifications((current) => current.map((item) => (item.status === "unread" ? { ...item, status: "read" } : item)));
    markAllRead(userId).catch(() => undefined);
  }, [userId]);

  return {
    notifications: filtered,
    allNotifications: notifications,
    isLoading: userId ? isLoading : false,
    statusFilter, setStatusFilter, categoryFilter, setCategoryFilter,
    markRead, archive, remove, markAll,
  };
}

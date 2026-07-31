"use client";

import { useActivities } from "@/components/activity/activity-provider";
import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { useDevelopment } from "@/components/development/development-provider";
import { useMemories } from "@/components/memory/memory-provider";
import {
  buildSmartFeedingMessage, buildSmartSleepMessage, computeDailySummaryStats,
  formatDailySummaryBody, shouldDeliverNotification, todayDateKey,
} from "@/lib/notifications-data";
import { createNotification, hasNotificationToday } from "@/lib/supabase/notification-repository";
import type { NotificationPreferences } from "@/types/notifications";
import { useEffect, useRef } from "react";

/**
 * Client-side generator for the "smart" reminders and evening summaries —
 * runs once per session (guarded against duplicates via
 * hasNotificationToday) whenever a page mounts this hook while the user
 * has preferences loaded. Real cron-based generation for the family
 * activity feed also exists server-side (see app/api/cron/*); this covers
 * the parts that only exist in local activity data.
 */
export function useSmartNotifications(userId: string | null, preferences: NotificationPreferences | null) {
  const { profile } = useBabyProfile();
  const { activities } = useActivities();
  const { memories } = useMemories();
  const { milestones } = useDevelopment();
  const attempted = useRef(false);

  useEffect(() => {
    if (!userId || !preferences || attempted.current) return;
    if (!shouldDeliverNotification(preferences)) return;
    attempted.current = true;

    const today = todayDateKey(preferences.timezone);
    const sinceIso = `${today}T00:00:00.000Z`;
    const hourNow = Number(new Intl.DateTimeFormat("en-GB", { timeZone: preferences.timezone, hour: "2-digit", hour12: false }).format(new Date()));
    const isEvening = hourNow >= 18;
    const isSunday = new Intl.DateTimeFormat("en-US", { timeZone: preferences.timezone, weekday: "short" }).format(new Date()) === "Sun";

    async function generate() {
      if (preferences!.feedingReminder) {
        const message = buildSmartFeedingMessage(profile.preferredName, activities);
        if (message && !(await hasNotificationToday(userId!, "feeding_reminder", sinceIso))) {
          await createNotification(userId!, { category: "feeding_reminder", title: `${profile.preferredName}'s feeding routine`, body: message });
        }
      }

      if (preferences!.sleepReminder) {
        const message = buildSmartSleepMessage(profile.preferredName, activities);
        if (message && !(await hasNotificationToday(userId!, "sleep_reminder", sinceIso))) {
          await createNotification(userId!, { category: "sleep_reminder", title: `${profile.preferredName}'s sleep routine`, body: message });
        }
      }

      if (isEvening && !(await hasNotificationToday(userId!, "daily_summary", sinceIso))) {
        const milestonesToday = milestones.filter((milestone) => milestone.achievedDate === today).length;
        const memoriesToday = memories.filter((memory) => memory.date === today).length;
        const stats = computeDailySummaryStats(activities, memoriesToday, milestonesToday);
        await createNotification(userId!, { category: "daily_summary", title: "Today's Summary", body: formatDailySummaryBody(stats), link: "/timeline" });
      }

      if (isEvening && isSunday && !(await hasNotificationToday(userId!, "weekly_summary", sinceIso))) {
        const stats = computeDailySummaryStats(activities, memories.length, milestones.filter((milestone) => milestone.status === "achieved").length);
        await createNotification(userId!, { category: "weekly_summary", title: "This Week's Summary", body: formatDailySummaryBody(stats), link: "/reports" });
      }
    }

    generate().catch(() => undefined);
  }, [userId, preferences, profile, activities, memories, milestones]);
}

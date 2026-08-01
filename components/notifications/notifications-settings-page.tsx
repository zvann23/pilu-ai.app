"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { useNotificationPreferences } from "@/hooks/use-notification-preferences";
import { useReminders } from "@/hooks/use-reminders";
import { useSmartNotifications } from "@/hooks/use-smart-notifications";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { getMyFamily } from "@/lib/supabase/family-repository";
import { Bell, Inbox, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NotificationPreferencesForm } from "./notification-preferences-form";
import { PushRegistrationCard } from "./push-registration-card";
import { ReminderFormSheet } from "./reminder-form-sheet";
import { ReminderList } from "./reminder-list";

export function NotificationsSettingsPage() {
  const { t } = useLocale();
  const nd = t((d) => d.notifications);
  const { userId } = useSupabaseUser();
  const { preferences, isLoading, update } = useNotificationPreferences(userId);
  const { reminders, create, complete, remove } = useReminders(userId);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [familyId, setFamilyId] = useState<string | null>(null);
  useSmartNotifications(userId, preferences);

  useEffect(() => {
    if (!userId) return;
    getMyFamily(userId).then((result) => setFamilyId(result?.family.id ?? null)).catch(() => undefined);
  }, [userId]);

  const upcoming = reminders.filter((reminder) => !reminder.completedAt || reminder.recurrence !== "once");

  return (
    <div className="notifications-page">
      <header className="family-header">
        <div><p>{nd.eyebrow}</p><h1>{nd.settingsPage.title}</h1><span>{nd.settingsPage.subtitle}</span></div>
        <Link href="/notifications/inbox" className="icon-button" aria-label={nd.settingsPage.inboxAriaLabel}><Inbox size={22} aria-hidden="true" /></Link>
      </header>

      {isLoading || !preferences ? (
        <div className="report-empty-state" aria-busy="true"><Bell size={24} aria-hidden="true" /><h2>{nd.settingsPage.loading}</h2></div>
      ) : (
        <>
          <PushRegistrationCard pushEnabled={preferences.pushEnabled} onToggle={(enabled) => update({ pushEnabled: enabled })} />
          <NotificationPreferencesForm preferences={preferences} onChange={update} />

          <section className="notification-preferences__group">
            <div className="notification-preferences__reminders-header">
              <h2>{nd.settingsPage.remindersHeading}</h2>
              <button type="button" className="button button--secondary" onClick={() => setSheetOpen(true)}><Plus size={16} aria-hidden="true" />{nd.settingsPage.newReminder}</button>
            </div>
            <ReminderList reminders={upcoming} onComplete={complete} onDelete={remove} />
          </section>
        </>
      )}

      <ReminderFormSheet
        open={sheetOpen}
        canShareWithFamily={Boolean(familyId)}
        onClose={() => setSheetOpen(false)}
        onSave={(draft) => { create({ ...draft, familyId }); setSheetOpen(false); }}
      />
    </div>
  );
}

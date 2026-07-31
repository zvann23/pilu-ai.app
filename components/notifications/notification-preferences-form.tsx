"use client";

import { daysModes, preferenceCategories, preferenceMeta, type NotificationPreferences } from "@/types/notifications";

const groupLabels = { babyCare: "Baby Care", parents: "Parents" } as const;
const daysModeLabels: Record<(typeof daysModes)[number], string> = { all: "Every day", weekdays: "Weekdays only", weekends: "Weekends only" };

export function NotificationPreferencesForm({ preferences, onChange }: { preferences: NotificationPreferences; onChange: (patch: Partial<NotificationPreferences>) => void }) {
  return (
    <div className="notification-preferences">
      {(["babyCare", "parents"] as const).map((group) => (
        <section key={group} className="notification-preferences__group">
          <h2>{groupLabels[group]}</h2>
          {preferenceCategories.filter((category) => preferenceMeta[category].group === group).map((category) => {
            const key = toPreferenceKey(category);
            return (
              <label key={category} className="notification-toggle">
                <div>
                  <p>{preferenceMeta[category].label}</p>
                  <span>{preferenceMeta[category].description}</span>
                </div>
                <input type="checkbox" role="switch" checked={preferences[key] as boolean} onChange={(event) => onChange({ [key]: event.target.checked })} />
              </label>
            );
          })}
        </section>
      ))}

      <section className="notification-preferences__group">
        <h2>Quiet hours &amp; timing</h2>
        <label className="notification-toggle">
          <div><p>Quiet hours</p><span>Pause reminders while your family is likely asleep.</span></div>
          <input type="checkbox" role="switch" checked={preferences.quietHoursEnabled} onChange={(event) => onChange({ quietHoursEnabled: event.target.checked })} />
        </label>
        {preferences.quietHoursEnabled && (
          <div className="notification-preferences__time-range">
            <label>From <input type="time" value={preferences.quietHoursStart} onChange={(event) => onChange({ quietHoursStart: event.target.value })} /></label>
            <label>To <input type="time" value={preferences.quietHoursEnd} onChange={(event) => onChange({ quietHoursEnd: event.target.value })} /></label>
          </div>
        )}

        <label className="notification-preferences__field">
          <p>Days</p>
          <select value={preferences.daysMode} onChange={(event) => onChange({ daysMode: event.target.value as NotificationPreferences["daysMode"] })}>
            {daysModes.map((mode) => <option key={mode} value={mode}>{daysModeLabels[mode]}</option>)}
          </select>
        </label>

        <label className="notification-preferences__field">
          <p>Timezone</p>
          <select value={preferences.timezone} onChange={(event) => onChange({ timezone: event.target.value })}>
            {commonTimezones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}
          </select>
        </label>
      </section>
    </div>
  );
}

function toPreferenceKey(category: string): keyof NotificationPreferences {
  return category.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase()) as keyof NotificationPreferences;
}

const commonTimezones = [
  "UTC", "Europe/London", "Europe/Bucharest", "Europe/Berlin", "America/New_York", "America/Chicago",
  "America/Denver", "America/Los_Angeles", "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore", "Australia/Sydney",
];

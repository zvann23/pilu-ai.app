"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { daysModes, preferenceCategories, preferenceMeta, type NotificationPreferences } from "@/types/notifications";

export function NotificationPreferencesForm({ preferences, onChange }: { preferences: NotificationPreferences; onChange: (patch: Partial<NotificationPreferences>) => void }) {
  const { t } = useLocale();
  const nd = t((d) => d.notifications.preferences);
  const groupLabels = { babyCare: nd.groupBabyCare, parents: nd.groupParents } as const;

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
                  <p>{nd.meta[category].label}</p>
                  <span>{nd.meta[category].description}</span>
                </div>
                <input type="checkbox" role="switch" checked={preferences[key] as boolean} onChange={(event) => onChange({ [key]: event.target.checked })} />
              </label>
            );
          })}
        </section>
      ))}

      <section className="notification-preferences__group">
        <h2>{nd.quietHoursTitle}</h2>
        <label className="notification-toggle">
          <div><p>{nd.quietHoursToggleLabel}</p><span>{nd.quietHoursToggleDescription}</span></div>
          <input type="checkbox" role="switch" checked={preferences.quietHoursEnabled} onChange={(event) => onChange({ quietHoursEnabled: event.target.checked })} />
        </label>
        {preferences.quietHoursEnabled && (
          <div className="notification-preferences__time-range">
            <label>{nd.from} <input type="time" value={preferences.quietHoursStart} onChange={(event) => onChange({ quietHoursStart: event.target.value })} /></label>
            <label>{nd.to} <input type="time" value={preferences.quietHoursEnd} onChange={(event) => onChange({ quietHoursEnd: event.target.value })} /></label>
          </div>
        )}

        <label className="notification-preferences__field">
          <p>{nd.daysLabel}</p>
          <select value={preferences.daysMode} onChange={(event) => onChange({ daysMode: event.target.value as NotificationPreferences["daysMode"] })}>
            {daysModes.map((mode) => <option key={mode} value={mode}>{nd.daysModeLabels[mode]}</option>)}
          </select>
        </label>

        <label className="notification-preferences__field">
          <p>{nd.timezoneLabel}</p>
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

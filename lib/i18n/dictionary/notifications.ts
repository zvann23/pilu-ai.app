import type { DaysMode, NotificationCategory, PreferenceCategory, Recurrence, ReminderType } from "@/types/notifications";

export type NotificationsDict = {
  eyebrow: string;
  settingsPage: { title: string; subtitle: string; inboxAriaLabel: string; loading: string; remindersHeading: string; newReminder: string };
  inboxPage: {
    title: string; subtitle: string; markAllAria: string; filterByStatusAria: string;
    statusTabs: { unread: string; read: string; archived: string; all: string };
    filterByCategoryAria: string; allCategories: string; loading: string; emptyTitle: string; emptyBody: string;
  };
  push: {
    title: string; bodyTemplate: string; firebaseLabel: string; oneSignalLabel: string; enabledStatus: string;
    requesting: string; enableButton: string; deniedError: string; notConnected: string;
  };
  preferences: {
    groupBabyCare: string; groupParents: string; quietHoursTitle: string; quietHoursToggleLabel: string; quietHoursToggleDescription: string;
    from: string; to: string; daysLabel: string; timezoneLabel: string;
    daysModeLabels: Record<DaysMode, string>;
    meta: Record<PreferenceCategory, { label: string; description: string }>;
  };
  reminders: {
    emptyList: string; sharedSuffix: string; markDoneAriaTemplate: string; deleteAriaTemplate: string;
    typeLabels: Record<ReminderType, string>; recurrenceLabels: Record<Recurrence, string>;
  };
  reminderForm: {
    closeSheetAria: string; closeAria: string; heading: string; titleLabel: string; titlePlaceholder: string; typeLabel: string;
    dateLabel: string; timeLabel: string; repeatsLabel: string; shareWithFamilyLabel: string; shareWithFamilyDescription: string; saveReminder: string;
  };
  categoryLabels: Record<NotificationCategory, string>;
  item: { archiveAria: string; deleteAria: string; minutesAgoTemplate: string; hoursAgoTemplate: string };
};

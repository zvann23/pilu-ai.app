import type { NotificationsDict } from "@/lib/i18n/dictionary/notifications";

export const notifications = {
  eyebrow: "Pilu",
  settingsPage: { title: "Notifications", subtitle: "Choose what Pilu should remind you about.", inboxAriaLabel: "Open notification inbox", loading: "Loading…", remindersHeading: "Reminders", newReminder: "New reminder" },
  inboxPage: {
    title: "Inbox", subtitle: "Everything Pilu has let you know.", markAllAria: "Mark all as read", filterByStatusAria: "Filter by status",
    statusTabs: { unread: "Unread", read: "Read", archived: "Archived", all: "All" },
    filterByCategoryAria: "Filter by category", allCategories: "All categories", loading: "Loading…",
    emptyTitle: "Nothing here", emptyBody: "Notifications will appear as Pilu has something gentle to share.",
  },
  push: {
    title: "Push notifications", bodyTemplate: "Get reminders even when Pilu isn't open, via {provider}.",
    firebaseLabel: "Firebase Cloud Messaging", oneSignalLabel: "OneSignal", enabledStatus: "Push is enabled on this device.",
    requesting: "Requesting…", enableButton: "Enable push notifications",
    deniedError: "Permission was declined — enable notifications for Pilu in your browser settings to try again.",
    notConnected: "Push notifications aren't connected yet on this deployment — in-app and email-style reminders still work fully. Pilu is built to support Firebase Cloud Messaging or OneSignal without changing this screen once one is configured.",
  },
  preferences: {
    groupBabyCare: "Baby Care", groupParents: "Parents", quietHoursTitle: "Quiet hours & timing",
    quietHoursToggleLabel: "Quiet hours", quietHoursToggleDescription: "Pause reminders while your family is likely asleep.",
    from: "From", to: "To", daysLabel: "Days", timezoneLabel: "Timezone",
    daysModeLabels: { all: "Every day", weekdays: "Weekdays only", weekends: "Weekends only" },
    meta: {
      feeding_reminder: { label: "Feeding reminder", description: "A gentle nudge around your baby's usual feeding time." },
      sleep_reminder: { label: "Sleep reminder", description: "A gentle nudge around your baby's usual sleep time." },
      medicine_reminder: { label: "Medicine reminder", description: "When a scheduled dose is coming up." },
      vaccine_reminder: { label: "Vaccine reminder", description: "When an upcoming vaccine is approaching." },
      growth_reminder: { label: "Growth reminder", description: "A nudge to log a new measurement." },
      memory_of_day: { label: "Memory of the day", description: "A favorite memory resurfaced from your Memory Book." },
      weekly_report_ready: { label: "Weekly AI report ready", description: "When a new AI Reports summary is ready to read." },
      family_activity: { label: "New family activity", description: "When another family member logs care or memories." },
      elite_updates: { label: "Elite feature updates", description: "News about new Pilu Elite features." },
    },
  },
  reminders: {
    emptyList: "No reminders yet.", sharedSuffix: " · Shared", markDoneAriaTemplate: "Mark {title} done", deleteAriaTemplate: "Delete {title}",
    typeLabels: { vaccine: "Vaccine", doctor_appointment: "Doctor appointment", medicine: "Medicine", birthday: "Birthday", family_event: "Family event", custom: "Custom" },
    recurrenceLabels: { once: "Once", daily: "Daily", weekly: "Weekly", monthly: "Monthly" },
  },
  reminderForm: {
    closeSheetAria: "Close reminder form", closeAria: "Close", heading: "New reminder", titleLabel: "Title", titlePlaceholder: "e.g. Next vaccine", typeLabel: "Type",
    dateLabel: "Date", timeLabel: "Time", repeatsLabel: "Repeats",
    shareWithFamilyLabel: "Share with family", shareWithFamilyDescription: "Other active family members will be able to see this reminder.", saveReminder: "Save reminder",
  },
  categoryLabels: {
    feeding_reminder: "Feeding reminder", sleep_reminder: "Sleep reminder", medicine_reminder: "Medicine reminder",
    vaccine_reminder: "Vaccine reminder", growth_reminder: "Growth reminder", memory_of_day: "Memory of the day",
    weekly_report_ready: "Weekly AI report", family_activity: "Family activity", elite_updates: "Elite update",
    daily_summary: "Daily summary", weekly_summary: "Weekly summary", custom_reminder: "Reminder",
  },
  item: { archiveAria: "Archive", deleteAria: "Delete", minutesAgoTemplate: "{m}m ago", hoursAgoTemplate: "{h}h ago" },
} satisfies NotificationsDict;

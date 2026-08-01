import type { HomeDict } from "@/lib/i18n/dictionary/home";

export const home = {
  greeting: {
    morning: "Good morning,",
    afternoon: "Good afternoon,",
    evening: "Good evening,",
    night: "Good night,",
  },
  askPiluCard: {
    heading: "Ask Pilu",
    description: "Questions about feeding, sleep, crying or your baby's development?",
    button: "Talk to Pilu",
  },
  insightCard: {
    heading: "Today's insight",
    body: "{name} had a good night — 6h 45m of sleep with 2 wake-ups, and feeding well.",
    footer: "Based on today's mock activity.",
  },
  latestReportCard: {
    eyebrow: "Pilu Elite",
    emptyHeading: "Your first AI report is ready to generate",
    emptyDescription: "A calm summary of feeding, sleep, growth, and happy moments.",
    generateButton: "Generate report",
    latestPrefix: "Latest AI Report",
    viewButton: "View full report",
  },
  nextMilestoneCard: {
    label: "Next milestone",
    body: "{name} may soon begin {milestone}.",
    footer: "General developmental guidance",
    button: "Explore milestones",
  },
  careItemCard: {
    label: "Next care item",
    medicineScheduled: "{medicine} scheduled at {time}",
    vaccineAppointment: "Vaccine appointment on {date}",
    noneScheduled: "No care item scheduled",
    footer: "Parent-entered local schedule",
    button: "View details",
  },
  recentMemoryCard: {
    label: "Recent memory",
    favorite: "Kept as a favorite",
    button: "Open Memory Book",
  },
  remindersCard: {
    todayHeading: "Today's reminders",
    upcomingHeading: "Upcoming reminders",
    button: "Manage reminders",
  },
  quickAdd: {
    heading: "Quick add",
    subheading: "Log a recent activity",
    sheetTitle: "Quick add",
    closeLabel: "Close quick add",
  },
  recentActivity: {
    heading: "Recent activity",
    subheading: "A little look at today",
    button: "View timeline",
  },
  floatingAddButtonLabel: "Open quick add",
  activityAddedToast: "Activity added to Timeline",
} satisfies HomeDict;

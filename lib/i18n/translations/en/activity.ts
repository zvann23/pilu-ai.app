import type { ActivityDict } from "@/lib/i18n/dictionary/activity";

export const activity = {
  kinds: {
    feeding: "Feeding",
    breastfeeding: "Breastfeeding",
    bottle: "Bottle",
    sleep: "Sleep",
    diaper: "Diaper",
    temperature: "Temperature",
    medicine: "Medicine",
    weight: "Weight",
    memory: "Memory",
    more: "More",
  },
  lastFeeding: "Last feeding",
  lastSleep: "Last sleep",
  lastDiaper: "Last diaper",
  diaperWet: "Wet",
  noEntriesYet: "No entries yet",
  agoTemplate: "{duration} ago",
} satisfies ActivityDict;

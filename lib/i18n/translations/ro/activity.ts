import type { ActivityDict } from "@/lib/i18n/dictionary/activity";

export const activity = {
  kinds: {
    feeding: "Hrănire",
    breastfeeding: "Alăptare",
    bottle: "Biberon",
    sleep: "Somn",
    diaper: "Scutec",
    temperature: "Temperatură",
    medicine: "Medicament",
    weight: "Greutate",
    memory: "Amintire",
    more: "Mai multe",
  },
  lastFeeding: "Ultima hrănire",
  lastSleep: "Ultimul somn",
  lastDiaper: "Ultimul scutec",
  diaperWet: "Ud",
  noEntriesYet: "Nicio înregistrare încă",
  agoTemplate: "acum {duration}",
} satisfies ActivityDict;

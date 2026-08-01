import type { ActivityDict } from "@/lib/i18n/dictionary/activity";

export const activity = {
  kinds: {
    feeding: "Alimentación",
    breastfeeding: "Lactancia",
    bottle: "Biberón",
    sleep: "Sueño",
    diaper: "Pañal",
    temperature: "Temperatura",
    medicine: "Medicamento",
    weight: "Peso",
    memory: "Recuerdo",
    more: "Más",
  },
  lastFeeding: "Última alimentación",
  lastSleep: "Último sueño",
  lastDiaper: "Último pañal",
  diaperWet: "Mojado",
  noEntriesYet: "Aún no hay registros",
  agoTemplate: "hace {duration}",
} satisfies ActivityDict;

export type ActivityDict = {
  kinds: {
    feeding: string;
    breastfeeding: string;
    bottle: string;
    sleep: string;
    diaper: string;
    temperature: string;
    medicine: string;
    weight: string;
    memory: string;
    more: string;
  };
  lastFeeding: string;
  lastSleep: string;
  lastDiaper: string;
  diaperWet: string;
  noEntriesYet: string;
  /** Contains a `{duration}` placeholder, e.g. "{duration} ago" or "hace {duration}". */
  agoTemplate: string;
};

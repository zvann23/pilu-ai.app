export const memoryTypes = ["photo", "milestone", "firstMoment", "dailyMoment", "familyMoment", "growth", "custom"] as const;
export type MemoryType = (typeof memoryTypes)[number];
export type MemoryFilter = "all" | "favorites" | "milestones" | "photos" | "firstMoments";

export type Memory = {
  id: string;
  type: MemoryType;
  title: string;
  date: string;
  time?: string;
  caption?: string;
  note?: string;
  imagePreview?: string;
  imageAlt?: string;
  favorite: boolean;
  privateNote: boolean;
  milestoneId?: string;
  milestoneName?: string;
  milestoneCategory?: string;
  achievedDate?: string;
  timelineActivityId?: string;
  source?: "memoryBook" | "milestone";
};

export type MemoryDraft = Omit<Memory, "id" | "timelineActivityId" | "source">;

export type JournalEntry = {
  id: string;
  date: string;
  summary: string;
  note?: string;
  highlight?: string;
};

export type JournalDraft = Omit<JournalEntry, "id">;

export type MonthlyRecap = {
  label: string;
  memoryCount: number;
  milestoneCount: number;
  loggedDays: number;
  favoriteMemory?: Memory;
  photoCount: number;
};

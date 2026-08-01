import type { MemoryType } from "@/types/memory";

export type MemoryDict = {
  header: { eyebrow: string; addMemory: string; memoriesLabel: string; thisMonthLabel: string; keptClose: string };
  filters: { all: string; favorites: string; milestones: string; photos: string; firstMoments: string };
  monthSection: { thisMonth: string; recentMemories: string; earlier: string; savedTemplate: string };
  card: { openAriaTemplate: string; removeFavoriteAriaTemplate: string; addFavoriteAriaTemplate: string };
  detail: { closeLabel: string; memoryLabel: string; removeFavorite: string; addFavorite: string; privateNote: string; share: string; edit: string; delete: string; achievedPrefix: string };
  addFlow: {
    editEyebrow: string; newEyebrow: string; editTitle: string; newTitle: string; closeLabel: string;
    memoryType: string; relatedMilestone: string; optional: string; noRelatedMilestone: string;
    title: string; titlePlaceholder: string; date: string; time: string;
    shortCaption: string; captionPlaceholder: string; longerNote: string; notePlaceholder: string;
    keepFavorite: string; privateNoteCheckbox: string; privateNotePlaceholder: string;
    cancel: string; saveChanges: string; saveMemory: string;
    errorNoImage: string; errorTooLarge: string; errorNoTitle: string;
  };
  imagePicker: { localPreview: string; notUploaded: string; remove: string; imageDescription: string; altTextOptional: string; uploadHint: string };
  journal: { todaysJournal: string; softRecord: string; edit: string; addNote: string; noNoteYet: string; dailyJournal: string; updateToday: string; saveToday: string; closeLabel: string; journalDate: string; localSummary: string; highlight: string; highlightPlaceholder: string; personalNote: string; notePlaceholder: string; cancel: string; save: string };
  journalHistory: { label: string; heading: string; editAriaTemplate: string; deleteAriaTemplate: string; defaultHighlight: string; emptyMessage: string };
  recap: { labelTemplate: string; littleMoments: string; memories: string; milestones: string; loggedDays: string; photos: string; favoritePrefix: string; generateAiStory: string; aiComingSoon: string; share: string; export: string; createAlbum: string };
  emptyState: { favoritesTitle: string; favoritesHeading: string; quietPageTitle: string; quietPageHeading: string; allFilterSubtitle: string; otherFilterSubtitle: string; addMemory: string };
  deleteDialog: { eyebrow: string; titleTemplate: string; body: string; keep: string; delete: string; fallbackTitle: string };
  toasts: { memoryUpdated: string; memorySaved: string; memoryRemoved: string; journalRemoved: string; journalUpdated: string; journalSaved: string; sharingComingSoon: string; freeLimitTemplate: string };
  types: Record<MemoryType, string>;
  dailySummary: { feedingOne: string; feedingOther: string; slept: string; diaperOne: string; diaperOther: string; memorySharedOne: string; memorySharedOtherTemplate: string; todayTemplate: string };
};

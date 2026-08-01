import type { MemoryDict } from "@/lib/i18n/dictionary/memory";

export const memory = {
  header: { eyebrow: "Memory Book", addMemory: "Add memory", memoriesLabel: "memories", thisMonthLabel: "this month", keptClose: "kept close" },
  filters: { all: "All", favorites: "Favorites", milestones: "Milestones", photos: "Photos", firstMoments: "First moments" },
  monthSection: { thisMonth: "This month", recentMemories: "Recent memories", earlier: "Earlier", savedTemplate: "{count} saved" },
  card: { openAriaTemplate: "Open memory: {title}", removeFavoriteAriaTemplate: "Remove {title} from favorites", addFavoriteAriaTemplate: "Add {title} to favorites" },
  detail: { closeLabel: "Close memory detail", memoryLabel: "Memory", removeFavorite: "Remove from favorites", addFavorite: "Add to favorites", privateNote: "Private note", share: "Share", edit: "Edit", delete: "Delete", achievedPrefix: "achieved" },
  addFlow: {
    editEyebrow: "Edit memory", newEyebrow: "A little moment", editTitle: "Update your memory", newTitle: "Add to Memory Book", closeLabel: "Close memory form",
    memoryType: "Memory type", relatedMilestone: "Related milestone", optional: "Optional", noRelatedMilestone: "No related milestone",
    title: "Title", titlePlaceholder: "e.g. First big smile", date: "Date", time: "Time",
    shortCaption: "Short caption", captionPlaceholder: "A few words to remember it by", longerNote: "Longer note", notePlaceholder: "The details you will want to keep...",
    keepFavorite: "Keep this as a favorite", privateNoteCheckbox: "Private note", privateNotePlaceholder: "Placeholder for future sharing controls",
    cancel: "Cancel", saveChanges: "Save changes", saveMemory: "Save memory",
    errorNoImage: "Choose an image file for the local preview.", errorTooLarge: "Choose an image smaller than 6 MB.", errorNoTitle: "Add a short title for this memory.",
  },
  imagePicker: { localPreview: "Local photo preview", notUploaded: "Optional, not uploaded", remove: "Remove", imageDescription: "Image description", altTextOptional: "Optional alt text", uploadHint: "PNG, JPG or WebP up to 6 MB" },
  journal: { todaysJournal: "Today's journal", softRecord: "A soft record of today", edit: "Edit", addNote: "Add note", noNoteYet: "No personal note yet. Add one whenever it feels right.", dailyJournal: "Daily journal", updateToday: "Update today", saveToday: "Save today", closeLabel: "Close journal form", journalDate: "Journal date", localSummary: "Local activity summary", highlight: "Highlight of the day", highlightPlaceholder: "e.g. A calm afternoon together", personalNote: "Personal note", notePlaceholder: "A few words for future you...", cancel: "Cancel", save: "Save journal" },
  journalHistory: { label: "Journal history", heading: "Days you've kept", editAriaTemplate: "Edit journal entry for {date}", deleteAriaTemplate: "Delete journal entry for {date}", defaultHighlight: "A little day together", emptyMessage: "No journal entries yet. Today's first page is waiting." },
  recap: { labelTemplate: "{name}'s {month}", littleMoments: "Little moments, kept together.", memories: "memories", milestones: "milestones", loggedDays: "logged days", photos: "photos", favoritePrefix: "Favorite:", generateAiStory: "Generate AI story", aiComingSoon: "AI monthly stories will be available later.", share: "Share", export: "Export", createAlbum: "Create album" },
  emptyState: { favoritesTitle: "No favorites yet", favoritesHeading: "Keep the moments that matter most close.", quietPageTitle: "A quiet page", quietPageHeading: "Your first memory is ready to be saved.", allFilterSubtitle: "Photos, little notes and milestone memories will gather here.", otherFilterSubtitle: "Try another filter or add a new little moment.", addMemory: "Add memory" },
  deleteDialog: { eyebrow: "Memory Book", titleTemplate: "Delete {title}?", body: "This only removes it from this local session.", keep: "Keep memory", delete: "Delete", fallbackTitle: "this memory" },
  toasts: { memoryUpdated: "Memory updated", memorySaved: "Memory saved to your book", memoryRemoved: "Memory removed from this local session", journalRemoved: "Journal entry removed", journalUpdated: "Journal entry updated", journalSaved: "Today's journal saved", sharingComingSoon: "Sharing and album export are coming later.", freeLimitTemplate: "Free plans keep your latest {limit} memories — upgrade to Elite for unlimited memories." },
  types: { photo: "Photo", milestone: "Milestone", firstMoment: "First moment", dailyMoment: "Daily moment", familyMoment: "Family moment", growth: "Growth memory", custom: "Custom" },
  dailySummary: { feedingOne: "feeding", feedingOther: "feedings", slept: "slept", diaperOne: "diaper change", diaperOther: "diaper changes", memorySharedOne: "shared one special memory", memorySharedOtherTemplate: "shared {count} special memories", todayTemplate: "Today {name} had {parts}." },
} satisfies MemoryDict;

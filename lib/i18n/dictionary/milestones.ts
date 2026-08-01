type MilestoneItemCopy = { title: string; description: string; typicalAge?: string };

export type MilestonesDict = {
  subtitle: string;
  title: string;
  overview: { achieved: string; comingUp: string; memories: string };
  categories: { all: string; social: string; communication: string; movement: string; learning: string; feeding: string; firstMoments: string };
  statuses: { upcoming: string; inProgress: string; achieved: string; notApplicable: string };
  card: { openAriaTemplate: string; achievedTemplate: string; gentleMilestone: string; relatedMemorySaved: string };
  upcomingCard: { label: string; heading: string; note: string; generalGuidance: string };
  disclaimer: string;
  detail: {
    eyebrow: string;
    closeLabel: string;
    statusLabel: string;
    dateAchieved: string;
    note: string;
    optional: string;
    localPhotoPreview: string;
    notUploaded: string;
    localImagePreviewSelected: string;
    localImagePreviewAlt: string;
    saveAsMemory: string;
    cancel: string;
    save: string;
  };
  toasts: { saved: string; updated: string };
  items: Record<string, MilestoneItemCopy>;
};

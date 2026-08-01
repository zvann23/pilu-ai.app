export type HomeDict = {
  greeting: {
    morning: string;
    afternoon: string;
    evening: string;
    night: string;
  };
  askPiluCard: {
    heading: string;
    description: string;
    button: string;
  };
  insightCard: {
    heading: string;
    body: string;
    footer: string;
  };
  latestReportCard: {
    eyebrow: string;
    emptyHeading: string;
    emptyDescription: string;
    generateButton: string;
    latestPrefix: string;
    viewButton: string;
  };
  nextMilestoneCard: {
    label: string;
    body: string;
    footer: string;
    button: string;
  };
  careItemCard: {
    label: string;
    medicineScheduled: string;
    vaccineAppointment: string;
    noneScheduled: string;
    footer: string;
    button: string;
  };
  recentMemoryCard: {
    label: string;
    favorite: string;
    button: string;
  };
  remindersCard: {
    todayHeading: string;
    upcomingHeading: string;
    button: string;
  };
  quickAdd: {
    heading: string;
    subheading: string;
    sheetTitle: string;
    closeLabel: string;
  };
  recentActivity: {
    heading: string;
    subheading: string;
    button: string;
  };
  floatingAddButtonLabel: string;
  activityAddedToast: string;
};

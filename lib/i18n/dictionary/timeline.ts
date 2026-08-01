export type TimelineDict = {
  header: {
    /** Contains a `{name}` placeholder. */
    subtitleTemplate: string;
    title: string;
  };
  dateNavigator: {
    previousDay: string;
    nextDay: string;
    calendarComingSoon: string;
    yesterdayLabel: string;
    todayLabel: string;
    tomorrowLabel: string;
  };
  filters: {
    all: string;
    growth: string;
  };
  todaySummary: {
    heading: string;
    feedings: string;
    sleep: string;
    diapers: string;
    latestTemp: string;
  };
  emptyState: {
    message: string;
    addButton: string;
  };
  actionMenu: {
    label: string;
    edit: string;
    delete: string;
  };
  deleteDialog: {
    eyebrow: string;
    /** Contains a `{title}` placeholder. */
    titleTemplate: string;
    body: string;
    keep: string;
    deleteButton: string;
    fallbackTitle: string;
  };
  form: {
    /** Contains a `{label}` placeholder. */
    editTitleTemplate: string;
    /** Contains a `{label}` placeholder. */
    addTitleTemplate: string;
    closeLabel: string;
    /** Contains a `{name}` placeholder. */
    introTemplate: string;
    timeLabel: string;
    dateTimeLabel: string;
    startTimeLabel: string;
    amountLabel: string;
    feedingTypeLabel: string;
    sideLabel: string;
    durationLabel: string;
    sleepTypeLabel: string;
    diaperLabel: string;
    temperatureLabel: string;
    methodLabel: string;
    medicineNameLabel: string;
    doseLabel: string;
    weightLabel: string;
    titleLabel: string;
    titlePlaceholder: string;
    imageUploadComingSoon: string;
    medicineNamePlaceholder: string;
    dosePlaceholder: string;
    noteLabel: string;
    noteOptional: string;
    notePlaceholder: string;
    validationError: string;
    cancel: string;
    /** Contains a `{label}` placeholder. */
    saveTemplate: string;
  };
  toasts: {
    activityAdded: string;
    activityUpdated: string;
    activityRemoved: string;
  };
};

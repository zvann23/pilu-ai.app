export type CareDict = {
  feeding: {
    subtitle: string;
    title: string;
    todaysFeeding: string;
    totalMilk: string;
    feedingsLabel: string;
    averageBottle: string;
    lastFeedingLabel: string;
    addBottle: string;
    startBreastfeeding: string;
    addFeeding: string;
    viewTimeline: string;
    breastfeedingSaved: string;
    basedOnRecent: string;
    /** Contains a `{name}` placeholder. */
    usuallyFeedsTemplate: string;
    /** Contains an `{average}` placeholder. */
    lastThreeBottlesTemplate: string;
    historyTitle: string;
    filters: string[];
    toasts: { updated: string; addedToTimeline: string; removed: string };
    fallbackTitle: string;
    bottleForm: {
      addTitle: string;
      closeLabel: string;
      date: string;
      startTime: string;
      amountPrepared: string;
      amountConsumed: string;
      milkType: string;
      bottleTemperature: string;
      duration: string;
      note: string;
      optional: string;
      cancel: string;
      save: string;
    };
    breastfeedingTimer: {
      label: string;
      start: string;
      resume: string;
      pause: string;
      reset: string;
      resetAria: string;
      finish: string;
    };
  };
  sleep: {
    subtitle: string;
    title: string;
    todaysSleep: string;
    totalSleep: string;
    naps: string;
    longestSleep: string;
    awakePrefix: string;
    wakeWindow: string;
    startSleep: string;
    addSleepManually: string;
    wakeBaby: string;
    viewTimeline: string;
    sleepSavedToTimeline: string;
    /** Contains `{name}` and `{duration}` placeholders. */
    awakeForTemplate: string;
    /** Contains a `{time}` placeholder. */
    lastSleepEndedTemplate: string;
    nextNapEstimate: string;
    noneDash: string;
    historyTitle: string;
    filters: string[];
    toasts: { updated: string; addedToTimeline: string; removed: string };
    fallbackTitle: string;
    timerLabel: string;
    resume: string;
    pause: string;
  };
  vaccines: {
    subtitle: string;
    title: string;
    demoNote: string;
    summary: { label: string; heading: string; addRecord: string; completed: string; upcoming: string; needsAttention: string; nextAppointmentTemplate: string };
    filters: { all: string; upcoming: string; completed: string; needsAttention: string };
    statuses: { upcoming: string; completed: string; postponed: string; needsAttention: string };
    record: { sampleRecord: string; completedTemplate: string; plannedTemplate: string; editAriaTemplate: string; deleteAriaTemplate: string };
    appointments: { heading: string; subheading: string; markCompleted: string; completed: string; addToCalendar: string };
    reminder: { label: string; options: string[]; note: string };
    form: {
      recordEyebrow: string;
      editTitle: string;
      addTitle: string;
      closeLabel: string;
      vaccineName: string;
      dose: string;
      optional: string;
      plannedDate: string;
      status: string;
      completedDate: string;
      clinic: string;
      lotNumber: string;
      documentPhoto: string;
      documentNote: string;
      notes: string;
      cancel: string;
      save: string;
      validationName: string;
      validationCompletedDate: string;
      validationFile: string;
    };
    toasts: { markedCompleted: string; calendarComingSoon: string; removed: string; updated: string; saved: string };
  };
  medicine: {
    subtitle: string;
    title: string;
    safetyNoticeStrong: string;
    safetyNoticeBody: string;
    summary: { todaysCare: string; heading: string; addMedicine: string; active: string; loggedToday: string; recentTemperature: string; nextTemplate: string; noneToday: string };
    listHeading: { label: string; heading: string; add: string };
    active: string;
    inactive: string;
    statuses: { upcoming: string; given: string; skipped: string };
    scheduleHeading: { label: string; heading: string };
    schedulePlaceholder: string;
    markGiven: string;
    skip: string;
    optionalNotePrompt: string;
    historyHeading: { label: string; heading: string };
    editDoseNoteAria: string;
    deleteDoseLogAria: string;
    editNotePrompt: string;
    fallbackMedicineName: string;
    temperatureHistory: { heading: string; latest: string; addTemperature: string; recorded: string; warning: string };
    form: {
      recordEyebrow: string;
      editTitle: string;
      addTitle: string;
      closeLabel: string;
      name: string;
      type: string;
      doseText: string;
      doseNote: string;
      frequency: string;
      timesOfDay: string;
      commaSeparated: string;
      startDate: string;
      endDate: string;
      prescribingDoctor: string;
      instructions: string;
      notes: string;
      activeCheckbox: string;
      cancel: string;
      save: string;
      validation: string;
      types: string[];
      frequencies: string[];
    };
    detail: {
      schedule: string;
      frequency: string;
      instructions: string;
      noInstructions: string;
      notes: string;
      noNotes: string;
      todaysEntries: string;
      noEntriesToday: string;
      edit: string;
      deactivate: string;
      closeLabel: string;
    };
    toasts: { doseLogged: string; skippedLogged: string; removed: string; noteUpdated: string; logRemoved: string; updated: string; saved: string; markedInactive: string; addedToTimeline: string };
  };
  growth: {
    /** Contains a `{name}` placeholder. */
    subtitleTemplate: string;
    title: string;
    summary: { label: string; headingTemplate: string; addMeasurement: string; weight: string; length: string; headCircumference: string; updatedPrefix: string; today: string };
    metrics: { weight: string; length: string; headCircumference: string };
    metricFullLabels: { weight: string; length: string; headCircumference: string };
    /** Contains `{change}` and `{unit}` placeholders. */
    sinceLastTemplate: string;
    firstMeasurement: string;
    percentile: { heading: string; body: string };
    history: { label: string; heading: string; editAriaTemplate: string; deleteAriaTemplate: string };
    chart: {
      historyLabel: string;
      /** Contains a `{metric}` placeholder. */
      overTimeTemplate: string;
      /** Contains a `{metric}` placeholder. */
      historyTemplate: string;
      /** Contains `{value}` and `{date}` placeholders. */
      onDateTemplate: string;
      caption: string;
    };
    form: {
      eyebrow: string;
      editTitle: string;
      addTitle: string;
      closeLabel: string;
      date: string;
      time: string;
      weightKg: string;
      lengthCm: string;
      headCircumferenceCm: string;
      note: string;
      optional: string;
      cancel: string;
      saveAndAddAnother: string;
      saveChanges: string;
      saveMeasurement: string;
      validation: string;
    };
    toasts: { updated: string; addedToTimeline: string; removed: string };
  };
};

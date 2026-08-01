export type ReportsAiDict = {
  demo: {
    /** Contains a `{name}` placeholder. */
    overviewTemplate: string;
    /** Contains a `{count}` placeholder. */
    highlightFeedingsTemplate: string;
    /** Contains an `{hours}` placeholder. */
    highlightSleepTemplate: string;
    /** Contains a `{count}` placeholder. */
    highlightDiapersTemplate: string;
    routineTrends: string;
    sleepSummary: string;
    feedingSummary: string;
    /** Contains `{name}` and `{weight}` placeholders. */
    growthProgressWithDataTemplate: string;
    growthProgressEmpty: string;
    /** Contains a `{count}` placeholder. */
    milestonesWithDataTemplate: string;
    milestonesEmpty: string;
    /** Contains a `{count}` placeholder. */
    happyMomentsWithDataTemplate: string;
    happyMomentsEmpty: string;
    suggestion1: string;
    suggestion2: string;
    pediatricianQuestion1: string;
    disclaimer: string;
  };
  safeFallback: {
    overview: string;
    routineTrends: string;
    sleepSummary: string;
    feedingSummary: string;
    growthProgress: string;
    milestones: string;
    happyMoments: string;
    suggestion: string;
    disclaimer: string;
  };
  routeErrors: {
    rateLimited: string;
    badRequest: string;
    serverError: string;
  };
};

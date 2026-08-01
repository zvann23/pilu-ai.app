export const reportTypes = ["daily", "weekly", "monthly"] as const;
export type ReportType = (typeof reportTypes)[number];

export type ReportChartPoint = { label: string; value: number };
export type ReportChart = { title: string; unit: string; points: ReportChartPoint[] };

export type ReportCharts = {
  sleep: ReportChart;
  feeding: ReportChart;
  growth: { metric: "weight"; unit: string; points: { label: string; value: number; date: string }[] };
};

/** The structured content Gemini returns — never diagnosis, medication, or a replacement for a pediatrician. */
export type ReportContent = {
  overview: string;
  todaysHighlights: string[];
  routineTrends: string;
  sleepSummary: string;
  feedingSummary: string;
  growthProgress: string;
  milestones: string;
  happyMoments: string;
  suggestionsForParents: string[];
  pediatricianQuestions: string[];
  disclaimer: string;
  demo?: boolean;
};

export type GeneratedReport = {
  id: string;
  type: ReportType;
  babyName: string;
  periodStart: string;
  periodEnd: string;
  periodLabel: string;
  generatedAt: string;
  content: ReportContent;
  charts: ReportCharts;
};

export type ReportRequest = { reportType: ReportType; context: ReportContext; locale?: string };

/** Everything Gemini is given to write the report — built entirely from data already in the app. */
export type ReportContext = {
  reportType: ReportType;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  dataNote: string;
  baby: { name: string; age: string; dateOfBirth: string; premature: boolean };
  preferences: {
    mainFeedingMethod: string;
    typicalBottleAmount: string;
    wakeUpTime: string;
    bedtime: string;
    feedingInterval: string;
    preferredSleepSound: string;
    calmingNotes: string;
  };
  feeding: { feedingCount: number; totalMilkMl: number; averageBottleMl: number; lastFeedingTime: string | null };
  sleep: { totalSleepMinutes: number; naps: number; longestSleepMinutes: number };
  diapers: { total: number; wet: number; dirty: number };
  growth: {
    latest: { date: string; weightKg: number; lengthCm: number; headCircumferenceCm: number } | null;
    changeSincePrevious: { weightKg: number; lengthCm: number; headCircumferenceCm: number } | null;
    measurementsInPeriod: number;
  };
  milestones: {
    achievedInPeriod: { title: string; category: string; achievedDate: string }[];
    inProgress: { title: string; category: string }[];
  };
  medicines: { name: string; doseText: string; frequency: string }[];
  memoriesInPeriod: { title: string; caption: string | null; date: string }[];
  journalInPeriod: { date: string; summary: string; highlight: string | null }[];
};

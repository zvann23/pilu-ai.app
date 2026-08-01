import type { ReportsAiDict } from "@/lib/i18n/dictionary/reports-ai";

export const reportsAi = {
  demo: {
    overviewTemplate: "Demo mode: Pilu would use {name}'s data to write a calm, personalized overview here. Gemini is not connected, so this is a placeholder.",
    highlightFeedingsTemplate: "{count} feedings logged",
    highlightSleepTemplate: "{hours}h of sleep logged",
    highlightDiapersTemplate: "{count} diaper changes logged",
    routineTrends: "Demo mode: a gentle description of the rhythms Pilu noticed would appear here.",
    sleepSummary: "Demo mode: a warm summary of sleep patterns would appear here.",
    feedingSummary: "Demo mode: a warm summary of feeding patterns would appear here.",
    growthProgressWithDataTemplate: "Demo mode: {name}'s latest measurement was {weight} kg.",
    growthProgressEmpty: "Demo mode: no growth measurements are available yet for this period.",
    milestonesWithDataTemplate: "Demo mode: {count} milestone(s) were reached this period.",
    milestonesEmpty: "Demo mode: no milestones were marked achieved in this period.",
    happyMomentsWithDataTemplate: "Demo mode: {count} memory/memories were saved this period.",
    happyMomentsEmpty: "Demo mode: no memories were saved in this period.",
    suggestion1: "Notice patterns over time rather than any single day.",
    suggestion2: "Keep saving small moments in Memory Book — they add up beautifully.",
    pediatricianQuestion1: "Is there anything about our current routine you'd recommend adjusting?",
    disclaimer: "Demo response — Gemini is not connected. Pilu provides general parenting information and does not replace medical advice.",
  },
  safeFallback: {
    overview: "Pilu couldn't prepare a full report right now, but here is a gentle placeholder based on what's available.",
    routineTrends: "Not enough information was available to describe routines this time.",
    sleepSummary: "Sleep information will appear here once a report is generated.",
    feedingSummary: "Feeding information will appear here once a report is generated.",
    growthProgress: "Growth information will appear here once a report is generated.",
    milestones: "Milestone information will appear here once a report is generated.",
    happyMoments: "Happy moments will appear here once a report is generated.",
    suggestion: "Try generating this report again in a moment.",
    disclaimer: "Pilu provides general parenting information and does not replace medical advice.",
  },
  routeErrors: {
    rateLimited: "Pilu needs a small pause before generating another report. Please try again in a minute.",
    badRequest: "Could not read the report request.",
    serverError: "Pilu couldn't prepare this report right now. Please try again.",
  },
} satisfies ReportsAiDict;

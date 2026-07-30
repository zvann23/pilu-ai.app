export const growthMetrics = ["weight", "length", "headCircumference"] as const;
export type GrowthMetric = (typeof growthMetrics)[number];

export type GrowthMeasurement = {
  id: string;
  date: string;
  time: string;
  weightKg: number;
  lengthCm: number;
  headCircumferenceCm: number;
  note?: string;
  timelineActivityId?: string;
};

export const milestoneCategories = ["social", "communication", "movement", "learning", "feeding", "firstMoments"] as const;
export type MilestoneCategory = (typeof milestoneCategories)[number];
export type MilestoneStatus = "upcoming" | "inProgress" | "achieved" | "notApplicable";

export type Milestone = {
  id: string;
  title: string;
  description: string;
  category: MilestoneCategory;
  status: MilestoneStatus;
  typicalAge?: string;
  achievedDate?: string;
  note?: string;
  imagePreview?: string;
  memoryActivityId?: string;
};

export type MilestoneUpdate = Pick<Milestone, "status" | "achievedDate" | "note" | "imagePreview"> & { saveAsMemory?: boolean };

export type VisionCategory = "food" | "bottle" | "label" | "ingredients" | "toy" | "baby_product" | "rash" | "skin" | "stool";

/** Free plans get a daily taste of Pilu Vision; Elite and Premium are unlimited. */
export const FREE_DAILY_VISION_SCANS = 3;

/** These call Gemini Vision today. */
export const activeVisionCategories: VisionCategory[] = ["food", "bottle", "label", "ingredients", "toy", "baby_product"];

/** Reserved category values with no analysis wired up yet — shown in the UI as "coming soon". */
export const placeholderVisionCategories: VisionCategory[] = ["rash", "skin", "stool"];

export const visionCategoryLabels: Record<VisionCategory, string> = {
  food: "Food",
  bottle: "Bottle",
  label: "Label",
  ingredients: "Ingredients",
  toy: "Toy",
  baby_product: "Baby product",
  rash: "Rash analysis",
  skin: "Skin observations",
  stool: "Stool observations",
};

export type VisionAnalysis = {
  title: string;
  summary: string;
  keyPoints: string[];
  concerns: string[];
  recommendation: string;
  disclaimer: string;
  demo?: boolean;
};

export type VisionScan = VisionAnalysis & {
  id: string;
  babyId: string;
  category: VisionCategory;
  isSaved: boolean;
  createdAt: string;
};

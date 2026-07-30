export type CaregiverPermission = "Full access" | "View and add activities" | "View only";

export type GrowthMeasurement = { weightKg: string; lengthCm: string; headCircumferenceCm: string; updatedAt: string };
export type FeedingProfile = { mainMethod: "Breastfeeding" | "Formula feeding" | "Mixed feeding"; breastfeeding: string; formulaFeeding: string; mixedFeeding: string; formulaBrand: string; formulaType: string; typicalBottleAmount: string; difficulties: string };
export type HealthProfile = { bloodType: string; allergies: string; conditions: string; medicines: string; pediatricianName: string; pediatricianPhone: string; emergencyNotes: string };
export type CareRoutine = { wakeUpTime: string; bedtime: string; feedingInterval: string; preferredSleepSound: string; calmingNotes: string };
export type Caregiver = { id: string; name: string; relationship: "Mother" | "Father" | "Other caregiver"; phone: string; permission: CaregiverPermission };

export type BabyProfile = {
  id: string;
  fullName: string;
  preferredName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  sex: "Female" | "Male" | "Prefer not to say";
  birthType: "Natural birth" | "C-section" | "Assisted birth";
  premature: boolean;
  gestationalAge: string;
  birthHospital: string;
  birthCountry: string;
  birthGrowth: GrowthMeasurement;
  currentGrowth: GrowthMeasurement;
  feeding: FeedingProfile;
  health: HealthProfile;
  routine: CareRoutine;
  caregivers: Caregiver[];
  photoPreview?: string;
};

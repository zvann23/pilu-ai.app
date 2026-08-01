import { getBabyAge } from "@/lib/baby-data";
import { en } from "@/lib/i18n/translations/en";
import type { BabyProfile } from "@/types/baby";
import type { MinimalBabyContext } from "@/types/chat";

/** Age is rendered in English regardless of the app's locale — it's internal context for Gemini, not shown to the parent, and the model is separately instructed which language to answer in. */
export function toMinimalBabyContext(profile: BabyProfile): MinimalBabyContext {
  return { preferredName: profile.preferredName, age: getBabyAge(profile.dateOfBirth, en.baby.age), dateOfBirth: profile.dateOfBirth, premature: profile.premature, mainFeedingMethod: profile.feeding.mainMethod, typicalBottleAmount: profile.feeding.typicalBottleAmount, knownAllergies: profile.health.allergies, medicalConditions: profile.health.conditions, currentMedicines: profile.health.medicines, routineNotes: profile.routine.calmingNotes };
}

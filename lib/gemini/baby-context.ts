import { getBabyAge } from "@/lib/baby-data";
import type { BabyProfile } from "@/types/baby";
import type { MinimalBabyContext } from "@/types/chat";

export function toMinimalBabyContext(profile: BabyProfile): MinimalBabyContext {
  return { preferredName: profile.preferredName, age: getBabyAge(profile.dateOfBirth), dateOfBirth: profile.dateOfBirth, premature: profile.premature, mainFeedingMethod: profile.feeding.mainMethod, typicalBottleAmount: profile.feeding.typicalBottleAmount, knownAllergies: profile.health.allergies, medicalConditions: profile.health.conditions, currentMedicines: profile.health.medicines, routineNotes: profile.routine.calmingNotes };
}

import type { BabyProfile } from "@/types/baby";

export type ChatUrgency = "normal" | "contact_doctor" | "urgent";
export type MinimalBabyContext = Pick<BabyProfile, "preferredName" | "dateOfBirth" | "premature"> & { age: string; mainFeedingMethod: string; typicalBottleAmount: string; knownAllergies: string; medicalConditions: string; currentMedicines: string; routineNotes: string };
export type PiluResponse = { answer: string; followUpQuestion: string | null; urgency: ChatUrgency; suggestedActions: string[]; disclaimer: string; demo?: boolean };
export type ChatMessage = { id: string; role: "parent" | "pilu" | "safety"; text: string; response?: PiluResponse };
export type AskPiluRequest = { message: string; babyContext: MinimalBabyContext };

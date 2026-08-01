import type { BabyDict } from "@/lib/i18n/dictionary/baby";
import { intlLocaleTags, type Locale } from "@/lib/i18n/locales";
import type { BabyProfile } from "@/types/baby";

export const profileReferenceDate = new Date("2026-07-10T12:00:00");

export const mockBabyProfile: BabyProfile = {
  id: "emma",
  fullName: "Emma Popescu",
  preferredName: "Emma",
  dateOfBirth: "2026-05-05",
  timeOfBirth: "08:45",
  sex: "Female",
  birthType: "Natural birth",
  premature: false,
  gestationalAge: "39 weeks",
  birthHospital: "Pilu Maternity Centre",
  birthCountry: "Romania",
  birthGrowth: { weightKg: "3.25", lengthCm: "50", headCircumferenceCm: "34", updatedAt: "5 May 2026" },
  currentGrowth: { weightKg: "5.10", lengthCm: "58", headCircumferenceCm: "38", updatedAt: "Today" },
  feeding: { mainMethod: "Formula feeding", breastfeeding: "No", formulaFeeding: "Yes", mixedFeeding: "No", formulaBrand: "Example formula", formulaType: "Stage 1", typicalBottleAmount: "120", difficulties: "None noted" },
  health: { bloodType: "O+", allergies: "None known", conditions: "None known", medicines: "Vitamin D", pediatricianName: "Dr. Andrei Ionescu", pediatricianPhone: "+40 700 000 000", emergencyNotes: "No emergency notes" },
  routine: { wakeUpTime: "07:00", bedtime: "20:30", feedingInterval: "Every 3 hours", preferredSleepSound: "Gentle rain", calmingNotes: "A calm walk and gentle rocking help settle." },
  caregivers: [
    { id: "mother", name: "Ana Popescu", relationship: "Mother", phone: "+40 700 000 001", permission: "Full access" },
    { id: "father", name: "Mihai Popescu", relationship: "Father", phone: "+40 700 000 002", permission: "View and add activities" },
    { id: "grandmother", name: "Elena Popescu", relationship: "Other caregiver", phone: "+40 700 000 003", permission: "View only" },
  ],
};

function pluralPart(count: number, form: { one: string; other: string }) { return `${count} ${count === 1 ? form.one : form.other}`; }

export function getBabyAge(dateOfBirth: string, ageDict: BabyDict["age"], referenceDate = profileReferenceDate) {
  const birthDate = new Date(`${dateOfBirth}T12:00:00`);
  let years = referenceDate.getFullYear() - birthDate.getFullYear();
  let months = referenceDate.getMonth() - birthDate.getMonth();
  let days = referenceDate.getDate() - birthDate.getDate();
  if (days < 0) { months -= 1; days += new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0).getDate(); }
  if (months < 0) { years -= 1; months += 12; }
  if (years > 0) return `${pluralPart(years, ageDict.years)}${months ? ` ${ageDict.and} ${pluralPart(months, ageDict.months)}` : ""}${ageDict.suffix}`;
  if (months > 0) return `${pluralPart(months, ageDict.months)}${days ? ` ${ageDict.and} ${pluralPart(days, ageDict.days)}` : ""}${ageDict.suffix}`;
  return `${pluralPart(Math.max(days, 0), ageDict.days)}${ageDict.suffix}`;
}

export function formatBabyDate(date: string, locale: Locale = "en") {
  return new Intl.DateTimeFormat(intlLocaleTags[locale], { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

import { intlLocaleTags, type Locale } from "@/lib/i18n/locales";
import type { GrowthMeasurement, GrowthMetric, Milestone } from "@/types/development";

export const initialGrowthMeasurements: GrowthMeasurement[] = [
  { id: "growth-birth", date: "2026-05-05", time: "08:45", weightKg: 3.25, lengthCm: 50, headCircumferenceCm: 34, note: "Birth measurement" },
  { id: "growth-week-2", date: "2026-05-19", time: "10:00", weightKg: 3.55, lengthCm: 51.5, headCircumferenceCm: 34.8 },
  { id: "growth-week-4", date: "2026-06-02", time: "10:15", weightKg: 4.1, lengthCm: 53.5, headCircumferenceCm: 35.7 },
  { id: "growth-week-6", date: "2026-06-16", time: "10:10", weightKg: 4.65, lengthCm: 55.8, headCircumferenceCm: 36.8 },
  { id: "growth-week-8", date: "2026-07-10", time: "09:50", weightKg: 5.1, lengthCm: 58, headCircumferenceCm: 38, note: "A calm check-in today." },
];

export const initialMilestones: Milestone[] = [
  { id: "social-smile", title: "First social smile", description: "A smile shared during a familiar, gentle interaction.", category: "social", status: "achieved", typicalAge: "Often seen in the first months", achievedDate: "2026-07-02", note: "Big smiles after breakfast.", memoryActivityId: "memory-smile" },
  { id: "social-familiar", title: "Recognizes familiar faces", description: "Shows growing interest in familiar people.", category: "social", status: "achieved", typicalAge: "General early-month guidance", achievedDate: "2026-07-07" },
  { id: "social-laugh", title: "Laughs aloud", description: "Begins to respond with small laughs during play.", category: "social", status: "upcoming", typicalAge: "General guidance only" },
  { id: "communication-coo", title: "Makes cooing sounds", description: "Experiments with soft vowel-like sounds.", category: "communication", status: "inProgress", typicalAge: "General early-month guidance" },
  { id: "communication-voices", title: "Turns toward voices", description: "Notices and looks toward familiar voices.", category: "communication", status: "achieved", typicalAge: "General early-month guidance", achievedDate: "2026-06-24" },
  { id: "communication-word", title: "Says first word", description: "Uses a first meaningful word in their own time.", category: "communication", status: "upcoming", typicalAge: "A later first-moment" },
  { id: "movement-head", title: "Holds head up", description: "Builds steadier head control during supported tummy time.", category: "movement", status: "inProgress", typicalAge: "General early-month guidance" },
  { id: "movement-roll", title: "Rolls over", description: "Finds a new way to move from one position to another.", category: "movement", status: "upcoming", typicalAge: "General guidance only" },
  { id: "movement-sit", title: "Sits without support", description: "Sits independently when ready.", category: "movement", status: "upcoming" },
  { id: "movement-crawl", title: "Crawls", description: "Explores moving across the floor in their own way.", category: "movement", status: "upcoming" },
  { id: "movement-steps", title: "Takes first steps", description: "Takes independent early steps when ready.", category: "movement", status: "upcoming" },
  { id: "learning-follow", title: "Follows objects with eyes", description: "Tracks a gentle moving object with their eyes.", category: "learning", status: "achieved", typicalAge: "General early-month guidance", achievedDate: "2026-06-12" },
  { id: "learning-reach", title: "Reaches for toys", description: "Begins reaching for nearby toys and familiar objects.", category: "learning", status: "upcoming" },
  { id: "learning-explore", title: "Explores objects", description: "Explores safe objects with curiosity.", category: "learning", status: "upcoming" },
  { id: "feeding-bottle", title: "Holds bottle", description: "Practices helping with a bottle during feeds.", category: "feeding", status: "upcoming" },
  { id: "feeding-solids", title: "Tries solid food", description: "A future feeding milestone for when your family is ready.", category: "feeding", status: "notApplicable" },
  { id: "feeding-spoon", title: "Uses a spoon", description: "Experiments with a spoon in a later stage.", category: "feeding", status: "upcoming" },
  { id: "first-bath", title: "First bath", description: "A first quiet bath-time memory.", category: "firstMoments", status: "achieved", achievedDate: "2026-05-08", note: "Loved the warm water." },
  { id: "first-outing", title: "First outing", description: "A first little family outing.", category: "firstMoments", status: "achieved", achievedDate: "2026-05-14", memoryActivityId: "memory-outing" },
  { id: "first-tooth", title: "First tooth", description: "A future first-moment to save.", category: "firstMoments", status: "upcoming" },
  { id: "first-haircut", title: "First haircut", description: "A future first-moment to save.", category: "firstMoments", status: "upcoming" },
  { id: "first-birthday", title: "First birthday", description: "A future first birthday celebration.", category: "firstMoments", status: "upcoming" },
];

export function sortMeasurements(measurements: GrowthMeasurement[]) { return [...measurements].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)); }
export function metricValue(measurement: GrowthMeasurement, metric: GrowthMetric) { return metric === "weight" ? measurement.weightKg : metric === "length" ? measurement.lengthCm : measurement.headCircumferenceCm; }
export function metricUnit(metric: GrowthMetric) { return metric === "weight" ? "kg" : "cm"; }
export function metricLabel(metric: GrowthMetric, labels: Record<GrowthMetric, string>) { return labels[metric]; }
export function formatMeasurementValue(value: number, metric: GrowthMetric) { return `${metric === "weight" ? value.toFixed(2) : value} ${metricUnit(metric)}`; }
export function formatGrowthDate(date: string, locale: Locale = "en") { return new Intl.DateTimeFormat(intlLocaleTags[locale], { day: "numeric", month: "short" }).format(new Date(`${date}T12:00:00`)); }
export function formatAchievementDate(date: string | undefined, locale: Locale = "en") { return date ? new Intl.DateTimeFormat(intlLocaleTags[locale], { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`)) : ""; }

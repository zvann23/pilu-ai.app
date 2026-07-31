import { profileReferenceDate } from "@/lib/baby-data";
import { activityMinutes, milkAmount, todayActivities } from "@/lib/activity-calculations";
import { sortMeasurements } from "@/lib/development-data";
import type { Activity } from "@/types/activity";
import type { BabyProfile } from "@/types/baby";
import type { GrowthMeasurement, Milestone } from "@/types/development";
import type { JournalEntry, Memory } from "@/types/memory";
import type { MedicineRecord } from "@/types/care";
import type { ReportChart, ReportCharts, ReportContext, ReportType } from "@/types/reports";

export const reportTypeLabels: Record<ReportType, string> = { daily: "Daily", weekly: "Weekly", monthly: "Monthly" };
export const reportTypeDescriptions: Record<ReportType, string> = {
  daily: "A calm look at today.",
  weekly: "Gentle patterns from the last 7 days.",
  monthly: "The bigger picture from the last 30 days.",
};

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatPeriodLabel(start: string, end: string, type: ReportType) {
  const formatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" });
  if (type === "daily") return formatter.format(new Date(`${end}T12:00:00`));
  return `${formatter.format(new Date(`${start}T12:00:00`))} – ${formatter.format(new Date(`${end}T12:00:00`))}`;
}

export function getReportPeriod(reportType: ReportType, referenceDate = profileReferenceDate) {
  const periodEnd = toIsoDate(referenceDate);
  const daysBack = reportType === "daily" ? 0 : reportType === "weekly" ? 6 : 29;
  const start = new Date(referenceDate);
  start.setDate(start.getDate() - daysBack);
  const periodStart = toIsoDate(start);
  return { periodStart, periodEnd, periodLabel: formatPeriodLabel(periodStart, periodEnd, reportType) };
}

function withinPeriod(date: string, periodStart: string, periodEnd: string) {
  return date >= periodStart && date <= periodEnd;
}

export function buildReportContext({
  reportType,
  profile,
  activities,
  measurements,
  milestones,
  medicines,
  memories,
  journalEntries,
}: {
  reportType: ReportType;
  profile: BabyProfile;
  activities: Activity[];
  measurements: GrowthMeasurement[];
  milestones: Milestone[];
  medicines: MedicineRecord[];
  memories: Memory[];
  journalEntries: JournalEntry[];
}): ReportContext {
  const { periodStart, periodEnd, periodLabel } = getReportPeriod(reportType);
  const today = todayActivities(activities);

  const feedingEntries = today.filter((activity) => ["feeding", "bottle", "breastfeeding"].includes(activity.kind));
  const bottleEntries = feedingEntries.filter((activity) => ["feeding", "bottle"].includes(activity.kind));
  const totalMilkMl = bottleEntries.reduce((total, activity) => total + milkAmount(activity.value), 0);
  const sleepEntries = today.filter((activity) => activity.kind === "sleep");
  const sleepMinutes = sleepEntries.map((activity) => activityMinutes(activity.value));
  const diaperEntries = today.filter((activity) => activity.kind === "diaper");

  const orderedMeasurements = sortMeasurements(measurements);
  const inPeriodMeasurements = orderedMeasurements.filter((measurement) => withinPeriod(measurement.date, periodStart, periodEnd));
  const latest = orderedMeasurements.at(-1);
  const previous = orderedMeasurements.at(-2);

  const achievedInPeriod = milestones
    .filter((milestone) => milestone.status === "achieved" && milestone.achievedDate && withinPeriod(milestone.achievedDate, periodStart, periodEnd))
    .map((milestone) => ({ title: milestone.title, category: milestone.category, achievedDate: milestone.achievedDate as string }));
  const inProgress = milestones
    .filter((milestone) => milestone.status === "inProgress")
    .slice(0, 5)
    .map((milestone) => ({ title: milestone.title, category: milestone.category }));

  const memoriesInPeriod = memories
    .filter((memory) => withinPeriod(memory.date, periodStart, periodEnd))
    .slice(0, 8)
    .map((memory) => ({ title: memory.title, caption: memory.caption ?? null, date: memory.date }));

  const journalInPeriod = journalEntries
    .filter((entry) => withinPeriod(entry.date, periodStart, periodEnd))
    .map((entry) => ({ date: entry.date, summary: entry.summary, highlight: entry.highlight ?? null }));

  return {
    reportType,
    periodLabel,
    periodStart,
    periodEnd,
    dataNote:
      reportType === "daily"
        ? "Feeding, sleep, and diaper entries below are today's full activity log."
        : "This account currently has detailed feeding, sleep, and diaper logs only for the most recent day — treat those numbers as a snapshot of a recent day, not an average across the whole period. Growth, milestones, memories, and journal entries below genuinely span the requested period.",
    baby: { name: profile.preferredName, age: ageFromDob(profile.dateOfBirth), dateOfBirth: profile.dateOfBirth, premature: profile.premature },
    preferences: {
      mainFeedingMethod: profile.feeding.mainMethod,
      typicalBottleAmount: profile.feeding.typicalBottleAmount,
      wakeUpTime: profile.routine.wakeUpTime,
      bedtime: profile.routine.bedtime,
      feedingInterval: profile.routine.feedingInterval,
      preferredSleepSound: profile.routine.preferredSleepSound,
      calmingNotes: profile.routine.calmingNotes,
    },
    feeding: {
      feedingCount: feedingEntries.length,
      totalMilkMl,
      averageBottleMl: bottleEntries.length ? Math.round(totalMilkMl / bottleEntries.length) : 0,
      lastFeedingTime: feedingEntries.at(-1)?.time ?? null,
    },
    sleep: {
      totalSleepMinutes: sleepMinutes.reduce((total, value) => total + value, 0),
      naps: sleepEntries.filter((activity) => activity.secondary !== "Nighttime sleep").length,
      longestSleepMinutes: Math.max(0, ...sleepMinutes),
    },
    diapers: {
      total: diaperEntries.length,
      wet: diaperEntries.filter((activity) => activity.value.toLowerCase().includes("wet")).length,
      dirty: diaperEntries.filter((activity) => activity.value.toLowerCase().includes("dirty")).length,
    },
    growth: {
      latest: latest ? { date: latest.date, weightKg: latest.weightKg, lengthCm: latest.lengthCm, headCircumferenceCm: latest.headCircumferenceCm } : null,
      changeSincePrevious:
        latest && previous
          ? { weightKg: Number((latest.weightKg - previous.weightKg).toFixed(2)), lengthCm: Number((latest.lengthCm - previous.lengthCm).toFixed(1)), headCircumferenceCm: Number((latest.headCircumferenceCm - previous.headCircumferenceCm).toFixed(1)) }
          : null,
      measurementsInPeriod: inPeriodMeasurements.length,
    },
    milestones: { achievedInPeriod, inProgress },
    medicines: medicines.filter((medicine) => medicine.active).map((medicine) => ({ name: medicine.name, doseText: medicine.doseText, frequency: medicine.frequency })),
    memoriesInPeriod,
    journalInPeriod,
  };
}

function ageFromDob(dateOfBirth: string) {
  const birth = new Date(`${dateOfBirth}T12:00:00`);
  const days = Math.max(0, Math.round((profileReferenceDate.getTime() - birth.getTime()) / 86_400_000));
  if (days < 60) return `${days} day${days === 1 ? "" : "s"} old`;
  const months = Math.floor(days / 30.4);
  return `${months} month${months === 1 ? "" : "s"} old`;
}

function timeBarChart(title: string, unit: string, activities: Activity[], valueOf: (activity: Activity) => number): ReportChart {
  return { title, unit, points: activities.map((activity) => ({ label: activity.time, value: valueOf(activity) })) };
}

export function buildReportCharts(activities: Activity[], measurements: GrowthMeasurement[]): ReportCharts {
  const today = todayActivities(activities);
  const sleepEntries = today.filter((activity) => activity.kind === "sleep");
  const feedingEntries = today.filter((activity) => ["feeding", "bottle"].includes(activity.kind));
  const ordered = sortMeasurements(measurements);

  return {
    sleep: timeBarChart("Sleep by time of day", "min", sleepEntries, (activity) => activityMinutes(activity.value)),
    feeding: timeBarChart("Feeding by time of day", "ml", feedingEntries, (activity) => milkAmount(activity.value)),
    growth: {
      metric: "weight",
      unit: "kg",
      points: ordered.map((measurement) => ({ label: measurement.date.slice(5), value: measurement.weightKg, date: measurement.date })),
    },
  };
}

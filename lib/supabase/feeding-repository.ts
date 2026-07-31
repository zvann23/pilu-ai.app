/** Maps the flattened Activity shape (see activity-form-sheet.tsx) to a real feeding_logs row. feeding_logs is the source of truth; timeline_events is a display mirror kept in sync alongside it. */
export type FeedingActivityInput = { kind: "feeding" | "bottle" | "breastfeeding"; time: string; value: string; secondary?: string; note?: string };

const feedingTypeBySecondary: Record<string, string> = { Bottle: "bottle", Formula: "formula", "Expressed milk": "pumped_milk" };
const breastSideBySecondary: Record<string, string> = { Left: "left", Right: "right", Both: "both" };

export function feedingActivityToRow(id: string, babyId: string, createdBy: string, activity: FeedingActivityInput, occurredAtDate: string): Record<string, unknown> {
  const startedAt = `${occurredAtDate}T${activity.time}:00`;
  const numeric = parseFloat(activity.value.replace(/[^0-9.]/g, "")) || null;

  if (activity.kind === "breastfeeding") {
    return {
      id, baby_id: babyId, created_by: createdBy, feeding_type: "breastfeeding",
      started_at: startedAt, duration_minutes: numeric != null ? Math.round(numeric) : null,
      breast_side: activity.secondary ? breastSideBySecondary[activity.secondary] ?? null : null,
      notes: activity.note ?? null,
    };
  }
  return {
    id, baby_id: babyId, created_by: createdBy,
    feeding_type: activity.secondary ? feedingTypeBySecondary[activity.secondary] ?? "bottle" : "bottle",
    started_at: startedAt, amount_ml: numeric, notes: activity.note ?? null,
  };
}

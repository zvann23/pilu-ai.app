export type DiaperActivityInput = { time: string; value: string; note?: string };

export function diaperActivityToRow(id: string, babyId: string, createdBy: string, activity: DiaperActivityInput, occurredAtDate: string): Record<string, unknown> {
  const loggedAt = `${occurredAtDate}T${activity.time}:00`;
  const diaperType = activity.value === "Both" ? "mixed" : activity.value.toLowerCase();
  return {
    id, baby_id: babyId, created_by: createdBy,
    diaper_type: ["wet", "dirty", "mixed"].includes(diaperType) ? diaperType : "other",
    logged_at: loggedAt, notes: activity.note ?? null,
  };
}

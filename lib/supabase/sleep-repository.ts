export type SleepActivityInput = { time: string; value: string; secondary?: string; note?: string };

export function sleepActivityToRow(id: string, babyId: string, createdBy: string, activity: SleepActivityInput, occurredAtDate: string): Record<string, unknown> {
  const startedAt = `${occurredAtDate}T${activity.time}:00`;
  const minutes = parseFloat(activity.value.replace(/[^0-9.]/g, "")) || null;
  return {
    id, baby_id: babyId, created_by: createdBy,
    sleep_type: activity.secondary === "Nighttime sleep" ? "night_sleep" : "nap",
    started_at: startedAt, duration_minutes: minutes != null ? Math.round(minutes) : null,
    notes: activity.note ?? null,
  };
}

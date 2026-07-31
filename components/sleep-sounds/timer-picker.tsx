"use client";

import { SLEEP_TIMER_OPTIONS, type SleepTimerOption } from "@/types/sleep-sounds";

const labels: Record<SleepTimerOption, string> = { 15: "15 min", 30: "30 min", 45: "45 min", 60: "60 min", manual: "Until stopped" };

export function TimerPicker({ value, onChange }: { value: SleepTimerOption | null; onChange: (option: SleepTimerOption) => void }) {
  return (
    <div className="sleep-timer-picker" role="group" aria-label="Sleep timer">
      {SLEEP_TIMER_OPTIONS.map((option) => (
        <button
          key={String(option)}
          type="button"
          className={`sleep-timer-picker__option${value === option ? " sleep-timer-picker__option--active" : ""}`}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
}

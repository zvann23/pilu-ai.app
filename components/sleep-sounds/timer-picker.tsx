"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { SLEEP_TIMER_OPTIONS, type SleepTimerOption } from "@/types/sleep-sounds";

export function TimerPicker({ value, onChange }: { value: SleepTimerOption | null; onChange: (option: SleepTimerOption) => void }) {
  const { t } = useLocale();
  const timerOptions = t((d) => d.sleepSounds.timerOptions);
  const labels: Record<SleepTimerOption, string> = { 15: timerOptions.min15, 30: timerOptions.min30, 45: timerOptions.min45, 60: timerOptions.min60, manual: timerOptions.manual };
  return (
    <div className="sleep-timer-picker" role="group" aria-label={t((d) => d.sleepSounds.playerSheet.sleepTimer)}>
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

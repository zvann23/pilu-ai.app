"use client";

import type { SleepTimerOption } from "@/types/sleep-sounds";
import { useCallback, useEffect, useRef, useState } from "react";

export function useSleepTimer(onExpire: () => void) {
  const [timer, setTimer] = useState<SleepTimerOption | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearActiveInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRemainingSeconds(null);
  }, []);

  const start = useCallback(
    (option: SleepTimerOption) => {
      clearActiveInterval();
      setTimer(option);

      if (option === "manual") return;

      let secondsLeft = option * 60;
      setRemainingSeconds(secondsLeft);

      intervalRef.current = setInterval(() => {
        secondsLeft -= 1;
        setRemainingSeconds(secondsLeft);
        if (secondsLeft <= 0) {
          clearActiveInterval();
          setTimer(null);
          onExpire();
        }
      }, 1000);
    },
    [clearActiveInterval, onExpire],
  );

  const cancel = useCallback(() => {
    clearActiveInterval();
    setTimer(null);
  }, [clearActiveInterval]);

  useEffect(() => clearActiveInterval, [clearActiveInterval]);

  return { timer, remainingSeconds, start, cancel };
}

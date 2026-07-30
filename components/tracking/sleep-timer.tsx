"use client";

import { Moon, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/activity-calculations";

export function SleepTimer({ onWake }: { onWake: (sleepType: string, minutes: number) => void }) {
  const [sleepType, setSleepType] = useState("Nap"); const [running, setRunning] = useState(false); const [elapsed, setElapsed] = useState(0);
  useEffect(() => { if (!running) return; const interval = window.setInterval(() => setElapsed((seconds) => seconds + 1), 1000); return () => window.clearInterval(interval); }, [running]);
  const wake = () => { if (!elapsed) return; onWake(sleepType, Math.max(1, Math.round(elapsed / 60))); setElapsed(0); setRunning(false); };
  return <section className="tracker-timer tracker-timer--sleep"><header><div><p>Sleep timer</p><strong aria-live="polite">{formatDuration(Math.floor(elapsed / 60))}</strong></div><div className="timer-sides">{["Nap", "Nighttime sleep"].map((option) => <button key={option} type="button" className={sleepType === option ? "timer-sides__option timer-sides__option--active" : "timer-sides__option"} onClick={() => setSleepType(option)}>{option}</button>)}</div></header><div className="tracker-timer__actions">{!running ? <button type="button" className="button button--primary" onClick={() => setRunning(true)}><Play size={16} aria-hidden="true" />{elapsed ? "Resume" : "Start sleep"}</button> : <button type="button" className="button button--secondary" onClick={() => setRunning(false)}><Pause size={16} aria-hidden="true" />Pause</button>}<button type="button" className="button button--secondary" disabled={!elapsed} onClick={wake}><Moon size={16} aria-hidden="true" />Wake baby</button><button type="button" className="button button--secondary" onClick={() => { setElapsed(0); setRunning(false); }}><RotateCcw size={16} aria-hidden="true" />Cancel</button></div></section>;
}

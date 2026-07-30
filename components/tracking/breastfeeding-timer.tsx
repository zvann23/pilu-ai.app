"use client";

import { Pause, Play, RotateCcw, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/activity-calculations";

export function BreastfeedingTimer({ onFinish }: { onFinish: (side: string, minutes: number) => void }) {
  const [side, setSide] = useState("Both"); const [running, setRunning] = useState(false); const [elapsed, setElapsed] = useState(0);
  useEffect(() => { if (!running) return; const interval = window.setInterval(() => setElapsed((seconds) => seconds + 1), 1000); return () => window.clearInterval(interval); }, [running]);
  const finish = () => { if (!elapsed) return; onFinish(side, Math.max(1, Math.round(elapsed / 60))); setElapsed(0); setRunning(false); };
  return <section className="tracker-timer"><header><div><p>Breastfeeding timer</p><strong aria-live="polite">{formatDuration(Math.floor(elapsed / 60))}</strong></div><div className="timer-sides">{["Left", "Right", "Both"].map((option) => <button key={option} type="button" className={side === option ? "timer-sides__option timer-sides__option--active" : "timer-sides__option"} onClick={() => setSide(option)}>{option}</button>)}</div></header><div className="tracker-timer__actions">{!running ? <button type="button" className="button button--primary" onClick={() => setRunning(true)}><Play size={16} aria-hidden="true" />{elapsed ? "Resume" : "Start"}</button> : <button type="button" className="button button--secondary" onClick={() => setRunning(false)}><Pause size={16} aria-hidden="true" />Pause</button>}<button type="button" className="button button--secondary" onClick={() => { setElapsed(0); setRunning(false); }} aria-label="Reset breastfeeding timer"><RotateCcw size={16} aria-hidden="true" />Reset</button><button type="button" className="button button--secondary" disabled={!elapsed} onClick={finish}><Square size={15} aria-hidden="true" />Finish</button></div></section>;
}

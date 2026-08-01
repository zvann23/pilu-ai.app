"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import type { SleepSound, SleepTimerOption } from "@/types/sleep-sounds";
import { Pause, Play, X } from "lucide-react";
import { useEffect, useRef, type PointerEvent } from "react";
import { TimerPicker } from "./timer-picker";
import { SoundIllustration } from "./sound-illustration";

export function PlayerSheet({
  open,
  sound,
  isPlaying,
  volume,
  timer,
  timerRemainingSeconds,
  onTogglePlay,
  onVolumeChange,
  onTimerChange,
  onCancelTimer,
  onClose,
}: {
  open: boolean;
  sound: SleepSound;
  isPlaying: boolean;
  volume: number;
  timer: SleepTimerOption | null;
  timerRemainingSeconds: number | null;
  onTogglePlay: () => void;
  onVolumeChange: (volume: number) => void;
  onTimerChange: (option: SleepTimerOption) => void;
  onCancelTimer: () => void;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const sd = t((d) => d.sleepSounds);
  const closeButton = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div className={`sleep-sounds-player-layer${open ? " sleep-sounds-player-layer--open" : ""}`} aria-hidden={!open} inert={!open}>
      <button className="bottom-sheet-overlay" type="button" tabIndex={open ? 0 : -1} aria-label={sd.playerSheet.closePlayer} onClick={onClose} />
      <section
        className="sleep-sounds-player-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={sd.playerSheet.playerAriaTemplate.replace("{name}", sound.name)}
        onPointerDown={(event: PointerEvent<HTMLElement>) => {
          if (event.pointerType === "touch") swipeStart.current = event.clientY;
        }}
        onPointerUp={(event: PointerEvent<HTMLElement>) => {
          if (swipeStart.current !== null && event.clientY - swipeStart.current > 76) onClose();
          swipeStart.current = null;
        }}
      >
        <div className="sleep-sounds-player-sheet__top">
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <button ref={closeButton} type="button" className="icon-button icon-button--soft" onClick={onClose} aria-label={sd.playerSheet.closePlayer}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="sleep-sounds-player-sheet__art">
          <SoundIllustration name={sound.illustration} />
        </div>

        <h2>{sound.name}</h2>
        <p className="sleep-sounds-player-sheet__description">{sound.description}</p>

        <div className="sleep-sounds-player-sheet__transport">
          <button type="button" onClick={onTogglePlay} aria-label={isPlaying ? sd.miniPlayer.pause : sd.miniPlayer.play}>
            {isPlaying ? <Pause size={22} aria-hidden="true" /> : <Play size={22} aria-hidden="true" />}
          </button>
        </div>

        <div className="sleep-sounds-player-sheet__field">
          <label htmlFor="sleep-sound-volume">{sd.playerSheet.volume}</label>
          <input
            id="sleep-sound-volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
          />
        </div>

        <div className="sleep-sounds-player-sheet__field">
          <div className="sleep-sounds-player-sheet__timer-row">
            <span>{sd.playerSheet.sleepTimer}</span>
            {timer && timer !== "manual" && timerRemainingSeconds !== null && (
              <button type="button" onClick={onCancelTimer}>
                {sd.playerSheet.cancelTemplate.replace("{time}", formatRemaining(timerRemainingSeconds))}
              </button>
            )}
          </div>
          <TimerPicker value={timer} onChange={onTimerChange} />
        </div>
      </section>
    </div>
  );
}

function formatRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

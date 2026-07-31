"use client";

import type { SleepSound } from "@/types/sleep-sounds";
import { Pause, Play } from "lucide-react";
import { SoundIllustration } from "./sound-illustration";

export function MiniPlayerBar({
  sound,
  isPlaying,
  onExpand,
  onTogglePlay,
}: {
  sound: SleepSound;
  isPlaying: boolean;
  onExpand: () => void;
  onTogglePlay: () => void;
}) {
  return (
    <div className="sleep-sounds-mini-player">
      <button type="button" onClick={onExpand} aria-label={`Open ${sound.name} player`}>
        <div className="sleep-sounds-mini-player__art">
          <SoundIllustration name={sound.illustration} />
        </div>
        <div className="sleep-sounds-mini-player__meta">
          <p>{sound.name}</p>
          <span>{isPlaying ? "Playing" : "Paused"}</span>
        </div>
      </button>
      <button
        type="button"
        className="sleep-sounds-mini-player__toggle"
        onClick={onTogglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
      </button>
    </div>
  );
}

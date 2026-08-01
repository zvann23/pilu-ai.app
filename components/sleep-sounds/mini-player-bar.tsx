"use client";

import { useLocale } from "@/components/i18n/locale-provider";
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
  const { t } = useLocale();
  const sd = t((d) => d.sleepSounds);
  return (
    <div className="sleep-sounds-mini-player">
      <button type="button" onClick={onExpand} aria-label={sd.miniPlayer.openAriaTemplate.replace("{name}", sound.name)}>
        <div className="sleep-sounds-mini-player__art">
          <SoundIllustration name={sound.illustration} />
        </div>
        <div className="sleep-sounds-mini-player__meta">
          <p>{sound.name}</p>
          <span>{isPlaying ? sd.miniPlayer.playing : sd.miniPlayer.paused}</span>
        </div>
      </button>
      <button
        type="button"
        className="sleep-sounds-mini-player__toggle"
        onClick={onTogglePlay}
        aria-label={isPlaying ? sd.miniPlayer.pause : sd.miniPlayer.play}
      >
        {isPlaying ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
      </button>
    </div>
  );
}

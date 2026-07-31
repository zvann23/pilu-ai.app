"use client";

import type { SleepSound } from "@/types/sleep-sounds";
import { FavoriteButton } from "./favorite-button";
import { SoundIllustration } from "./sound-illustration";

export function SoundCard({
  sound,
  isActive,
  isFavorite,
  onSelect,
  onToggleFavorite,
}: {
  sound: SleepSound;
  isActive: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <div className={`sleep-sound-card${isActive ? " sleep-sound-card--active" : ""}`}>
      {isActive && <span className="sleep-sound-card__playing" aria-hidden="true" />}
      <button type="button" className="sleep-sound-card__button" aria-pressed={isActive} onClick={onSelect}>
        <div className="sleep-sound-card__art">
          <SoundIllustration name={sound.illustration} />
        </div>
        <div>
          <h3>{sound.name}</h3>
          <p>{sound.description}</p>
        </div>
      </button>
      <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} label={sound.name} />
    </div>
  );
}

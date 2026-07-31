"use client";

import type { SleepSound } from "@/types/sleep-sounds";
import { SoundCard } from "./sound-card";

export function SoundSection({
  eyebrow,
  title,
  sounds,
  activeSoundId,
  favoriteIds,
  onSelect,
  onToggleFavorite,
  emptyMessage,
}: {
  eyebrow: string;
  title: string;
  sounds: SleepSound[];
  activeSoundId: string | null;
  favoriteIds: string[];
  onSelect: (soundId: string) => void;
  onToggleFavorite: (soundId: string) => void;
  emptyMessage?: string;
}) {
  if (sounds.length === 0 && !emptyMessage) return null;

  return (
    <section className="sleep-sounds-section">
      <header>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
      </header>
      {sounds.length === 0 ? (
        <p className="sleep-sounds-empty">{emptyMessage}</p>
      ) : (
        <div className="sleep-sound-grid">
          {sounds.map((sound) => (
            <SoundCard
              key={sound.id}
              sound={sound}
              isActive={sound.id === activeSoundId}
              isFavorite={favoriteIds.includes(sound.id)}
              onSelect={() => onSelect(sound.id)}
              onToggleFavorite={() => onToggleFavorite(sound.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

"use client";

import { useSleepSoundsPlayer } from "@/hooks/use-sleep-sounds-player";
import { useEliteAccess } from "@/hooks/use-elite-access";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { getRecommendedSounds, getSoundById, getSoundsByGroup, sleepSoundGroupLabels } from "@/lib/sleep-sounds-data";
import { Volume2 } from "lucide-react";
import { useMemo, useState } from "react";
import { EliteUpgradeScreen } from "./elite-upgrade-screen";
import { MiniPlayerBar } from "./mini-player-bar";
import { PlayerSheet } from "./player-sheet";
import { SoundSection } from "./sound-section";

export function SleepSoundsDashboard() {
  const { userId, isLoading: isUserLoading } = useSupabaseUser();
  const { isElite, isLoading: isEliteLoading } = useEliteAccess(userId);
  const player = useSleepSoundsPlayer(userId);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const favoriteSounds = useMemo(
    () => player.favoriteIds.map(getSoundById).filter((sound): sound is NonNullable<typeof sound> => Boolean(sound)),
    [player.favoriteIds],
  );

  if (isUserLoading || isEliteLoading) {
    return <div className="sleep-sounds-page" aria-busy="true" />;
  }

  if (!isElite) {
    return (
      <div className="sleep-sounds-page">
        <EliteUpgradeScreen />
      </div>
    );
  }

  const activeSound = player.currentSound;

  return (
    <div className="sleep-sounds-page">
      <header className="sleep-sounds-header">
        <div>
          <p>Pilu Elite</p>
          <h1>Sleep Sounds</h1>
          <span>Calming sounds to help your little one drift off.</span>
        </div>
        <Volume2 size={29} aria-hidden="true" />
      </header>

      <SoundSection
        eyebrow="Curated for tonight"
        title="Recommended"
        sounds={getRecommendedSounds()}
        activeSoundId={player.soundId}
        favoriteIds={player.favoriteIds}
        onSelect={player.play}
        onToggleFavorite={player.toggleFavorite}
      />
      <SoundSection
        eyebrow="Kept for later"
        title="Favorites"
        sounds={favoriteSounds}
        activeSoundId={player.soundId}
        favoriteIds={player.favoriteIds}
        onSelect={player.play}
        onToggleFavorite={player.toggleFavorite}
        emptyMessage="Tap the heart on any sound to save it here."
      />
      <SoundSection
        eyebrow="Steady and familiar"
        title={sleepSoundGroupLabels["white-noise"]}
        sounds={getSoundsByGroup("white-noise")}
        activeSoundId={player.soundId}
        favoriteIds={player.favoriteIds}
        onSelect={player.play}
        onToggleFavorite={player.toggleFavorite}
      />
      <SoundSection
        eyebrow="Outdoors, gently"
        title={sleepSoundGroupLabels.nature}
        sounds={getSoundsByGroup("nature")}
        activeSoundId={player.soundId}
        favoriteIds={player.favoriteIds}
        onSelect={player.play}
        onToggleFavorite={player.toggleFavorite}
      />
      <SoundSection
        eyebrow="Soft melodies"
        title={sleepSoundGroupLabels.lullabies}
        sounds={getSoundsByGroup("lullabies")}
        activeSoundId={player.soundId}
        favoriteIds={player.favoriteIds}
        onSelect={player.play}
        onToggleFavorite={player.toggleFavorite}
      />

      {activeSound && !isSheetOpen && (
        <MiniPlayerBar
          sound={activeSound}
          isPlaying={player.isPlaying}
          onExpand={() => setIsSheetOpen(true)}
          onTogglePlay={() => (player.isPlaying ? player.pause() : player.play(activeSound.id))}
        />
      )}

      {activeSound && (
        <PlayerSheet
          open={isSheetOpen}
          sound={activeSound}
          isPlaying={player.isPlaying}
          volume={player.volume}
          timer={player.timer}
          timerRemainingSeconds={player.timerRemainingSeconds}
          onTogglePlay={() => (player.isPlaying ? player.pause() : player.play(activeSound.id))}
          onVolumeChange={player.setVolume}
          onTimerChange={player.startTimer}
          onCancelTimer={player.cancelTimer}
          onClose={() => setIsSheetOpen(false)}
        />
      )}
    </div>
  );
}

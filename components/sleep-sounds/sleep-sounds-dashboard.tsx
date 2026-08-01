"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { SkeletonScreen } from "@/components/ui/skeleton-screen";
import { useSleepSoundsPlayer } from "@/hooks/use-sleep-sounds-player";
import { useEliteAccess } from "@/hooks/use-elite-access";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { getRecommendedSounds, getSoundById, getSoundsByGroup } from "@/lib/sleep-sounds-data";
import { Volume2 } from "lucide-react";
import { useMemo, useState } from "react";
import { EliteUpgradeScreen } from "./elite-upgrade-screen";
import { MiniPlayerBar } from "./mini-player-bar";
import { PlayerSheet } from "./player-sheet";
import { SoundSection } from "./sound-section";

export function SleepSoundsDashboard() {
  const { t } = useLocale();
  const sd = t((d) => d.sleepSounds);
  const { userId, isLoading: isUserLoading } = useSupabaseUser();
  const { isElite, isLoading: isEliteLoading } = useEliteAccess(userId);
  const player = useSleepSoundsPlayer(userId);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const favoriteSounds = useMemo(
    () => player.favoriteIds.map((id) => getSoundById(id, sd)).filter((sound): sound is NonNullable<typeof sound> => Boolean(sound)),
    [player.favoriteIds, sd],
  );

  if (isUserLoading || isEliteLoading) {
    return <SkeletonScreen />;
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
          <p>{sd.header.eyebrow}</p>
          <h1>{sd.header.title}</h1>
          <span>{sd.header.subtitle}</span>
        </div>
        <Volume2 size={29} aria-hidden="true" />
      </header>

      <SoundSection
        eyebrow={sd.sections.recommendedEyebrow}
        title={sd.sections.recommendedTitle}
        sounds={getRecommendedSounds(sd)}
        activeSoundId={player.soundId}
        favoriteIds={player.favoriteIds}
        onSelect={player.play}
        onToggleFavorite={player.toggleFavorite}
      />
      <SoundSection
        eyebrow={sd.sections.favoritesEyebrow}
        title={sd.sections.favoritesTitle}
        sounds={favoriteSounds}
        activeSoundId={player.soundId}
        favoriteIds={player.favoriteIds}
        onSelect={player.play}
        onToggleFavorite={player.toggleFavorite}
        emptyMessage={sd.sections.favoritesEmpty}
      />
      <SoundSection
        eyebrow={sd.sections.whiteNoiseEyebrow}
        title={sd.groupLabels["white-noise"]}
        sounds={getSoundsByGroup("white-noise", sd)}
        activeSoundId={player.soundId}
        favoriteIds={player.favoriteIds}
        onSelect={player.play}
        onToggleFavorite={player.toggleFavorite}
      />
      <SoundSection
        eyebrow={sd.sections.natureEyebrow}
        title={sd.groupLabels.nature}
        sounds={getSoundsByGroup("nature", sd)}
        activeSoundId={player.soundId}
        favoriteIds={player.favoriteIds}
        onSelect={player.play}
        onToggleFavorite={player.toggleFavorite}
      />
      <SoundSection
        eyebrow={sd.sections.lullabiesEyebrow}
        title={sd.groupLabels.lullabies}
        sounds={getSoundsByGroup("lullabies", sd)}
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

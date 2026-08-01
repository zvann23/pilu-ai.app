"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { getSoundById } from "@/lib/sleep-sounds-data";
import {
  addFavorite,
  getPreferences,
  listFavoriteSoundIds,
  listRecentlyPlayed,
  recordPlay,
  removeFavorite,
  savePreferences,
} from "@/lib/supabase/sleep-sounds-repository";
import type { RecentlyPlayedRow, SleepTimerOption } from "@/types/sleep-sounds";
import { useAudioEngine } from "./use-audio-engine";
import { useMediaSession } from "./use-media-session";
import { useSleepTimer } from "./use-sleep-timer";
import { useCallback, useEffect, useRef, useState } from "react";

const FADE_SECONDS = 2.5;
const VOLUME_SAVE_DEBOUNCE_MS = 800;

/**
 * Everything the Sleep Sounds screen needs: playback, favorites, recently
 * played, timer, and persistence — wired together and debounced so the UI
 * layer stays presentational. Does NOT autoplay: it only restores the last
 * sound/volume as state, playback always starts from an explicit tap.
 */
export function useSleepSoundsPlayer(userId: string | null) {
  const { t } = useLocale();
  const soundsDict = t((d) => d.sleepSounds);
  const engine = useAudioEngine();
  const [soundId, setSoundId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.6);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedRow[]>([]);
  const [isReady, setIsReady] = useState(false);
  const volumeSaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    Promise.all([getPreferences(userId), listFavoriteSoundIds(userId), listRecentlyPlayed(userId)]).then(
      ([prefs, favorites, recent]) => {
        if (cancelled) return;
        setSoundId(prefs.lastSoundId);
        setVolumeState(prefs.lastVolume);
        setFavoriteIds(favorites);
        setRecentlyPlayed(recent);
        setIsReady(true);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // `stop` needs to cancel the active timer, but the timer's onExpire needs
  // to call `stop` — a ref breaks the circular dependency without resorting
  // to forward-reference lint suppressions.
  const cancelTimerRef = useRef<() => void>(() => undefined);

  const stop = useCallback(async () => {
    await engine.stop(FADE_SECONDS);
    setIsPlaying(false);
    cancelTimerRef.current();
  }, [engine]);

  const timer = useSleepTimer(() => {
    stop();
  });

  useEffect(() => {
    cancelTimerRef.current = timer.cancel;
  }, [timer.cancel]);

  const play = useCallback(
    async (id: string) => {
      const sound = getSoundById(id, soundsDict);
      if (!sound) return;

      try {
        // Audio sources are placeholders until real licensed loops are
        // sourced (see README) — a missing file should not crash playback.
        await engine.play({ src: sound.audioSrc, volume, fadeInSeconds: FADE_SECONDS });
      } catch (error) {
        console.error(`Could not play "${sound.name}"`, error);
        return;
      }

      setSoundId(id);
      setIsPlaying(true);

      if (userId) {
        savePreferences(userId, { lastSoundId: id });
        recordPlay(userId, id).then(() => listRecentlyPlayed(userId).then(setRecentlyPlayed));
      }
    },
    [engine, volume, userId, soundsDict],
  );

  const pause = useCallback(() => {
    engine.pause();
    setIsPlaying(false);
    timer.cancel();
  }, [engine, timer]);

  const setVolume = useCallback(
    (next: number) => {
      setVolumeState(next);
      engine.setVolume(next);

      if (!userId) return;
      if (volumeSaveTimeout.current) clearTimeout(volumeSaveTimeout.current);
      volumeSaveTimeout.current = setTimeout(() => {
        savePreferences(userId, { lastVolume: next });
      }, VOLUME_SAVE_DEBOUNCE_MS);
    },
    [engine, userId],
  );

  const toggleFavorite = useCallback(
    async (id: string) => {
      if (!userId) return;
      const isFavorite = favoriteIds.includes(id);
      setFavoriteIds((prev) => (isFavorite ? prev.filter((f) => f !== id) : [...prev, id]));
      if (isFavorite) {
        await removeFavorite(userId, id);
      } else {
        await addFavorite(userId, id);
      }
    },
    [favoriteIds, userId],
  );

  const startTimer = useCallback((option: SleepTimerOption) => timer.start(option), [timer]);

  const currentSound = soundId ? getSoundById(soundId, soundsDict) : undefined;

  useMediaSession({
    title: currentSound?.name ?? "Pilu Sleep Sounds",
    isPlaying,
    onPlay: () => currentSound && play(currentSound.id),
    onPause: pause,
    onStop: stop,
  });

  useEffect(() => {
    return () => {
      if (volumeSaveTimeout.current) clearTimeout(volumeSaveTimeout.current);
    };
  }, []);

  return {
    isReady,
    soundId,
    currentSound,
    isPlaying,
    volume,
    favoriteIds,
    recentlyPlayed,
    timer: timer.timer,
    timerRemainingSeconds: timer.remainingSeconds,
    play,
    pause,
    stop,
    setVolume,
    toggleFavorite,
    startTimer,
    cancelTimer: timer.cancel,
  };
}

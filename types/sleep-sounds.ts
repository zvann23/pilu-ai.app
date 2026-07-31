export type SleepSoundGroup = "white-noise" | "nature" | "lullabies";

export type SleepSoundSection = "recommended" | "favorites" | "white-noise" | "nature" | "lullabies";

export type SleepSoundIllustrationName =
  | "white-noise"
  | "fan"
  | "pink-noise"
  | "brown-noise"
  | "heartbeat"
  | "womb"
  | "rain"
  | "ocean"
  | "forest"
  | "fireplace"
  | "lullaby"
  | "piano"
  | "music-box";

export type SleepSound = {
  /** Stable slug, also the DB key used in favorites / recently played / preferences. */
  id: string;
  name: string;
  group: SleepSoundGroup;
  description: string;
  /** Path or CDN URL to the looping audio asset — placeholder until real audio is sourced, see README. */
  audioSrc: string;
  illustration: SleepSoundIllustrationName;
  /** Length of the source loop in seconds, before the engine loops it. */
  loopDurationSeconds: number;
  isElite: boolean;
};

export const SLEEP_TIMER_OPTIONS = [15, 30, 45, 60, "manual"] as const;
export type SleepTimerOption = (typeof SLEEP_TIMER_OPTIONS)[number];

export type SleepSoundPreferences = {
  lastSoundId: string | null;
  lastVolume: number;
};

export type RecentlyPlayedRow = {
  soundId: string;
  lastPlayedAt: string;
  playCount: number;
};

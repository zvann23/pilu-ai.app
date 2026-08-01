import type { SleepSoundsDict } from "@/lib/i18n/dictionary/sleep-sounds";
import type { SleepSound, SleepSoundGroup, SleepSoundSection } from "@/types/sleep-sounds";

/**
 * Audio sources are placeholders — real licensed, loop-ready audio files
 * still need to be sourced and hosted (Supabase Storage or a CDN both work
 * with the current player) before this ships to users.
 */
type SoundBase = Omit<SleepSound, "name" | "description">;

export const sleepSoundsBase: SoundBase[] = [
  // White Noise — steady, textureless sounds (grouped with heartbeat/womb,
  // which serve the same "constant background" function for babies).
  { id: "white-noise", group: "white-noise", audioSrc: "/audio/sleep-sounds/white-noise.mp3", illustration: "white-noise", loopDurationSeconds: 600, isElite: true },
  { id: "fan", group: "white-noise", audioSrc: "/audio/sleep-sounds/fan.mp3", illustration: "fan", loopDurationSeconds: 600, isElite: true },
  { id: "pink-noise", group: "white-noise", audioSrc: "/audio/sleep-sounds/pink-noise.mp3", illustration: "pink-noise", loopDurationSeconds: 600, isElite: true },
  { id: "brown-noise", group: "white-noise", audioSrc: "/audio/sleep-sounds/brown-noise.mp3", illustration: "brown-noise", loopDurationSeconds: 600, isElite: true },
  { id: "heartbeat", group: "white-noise", audioSrc: "/audio/sleep-sounds/heartbeat.mp3", illustration: "heartbeat", loopDurationSeconds: 300, isElite: true },
  { id: "womb-sounds", group: "white-noise", audioSrc: "/audio/sleep-sounds/womb-sounds.mp3", illustration: "womb", loopDurationSeconds: 300, isElite: true },

  // Nature
  { id: "rain", group: "nature", audioSrc: "/audio/sleep-sounds/rain.mp3", illustration: "rain", loopDurationSeconds: 600, isElite: true },
  { id: "ocean-waves", group: "nature", audioSrc: "/audio/sleep-sounds/ocean-waves.mp3", illustration: "ocean", loopDurationSeconds: 600, isElite: true },
  { id: "forest", group: "nature", audioSrc: "/audio/sleep-sounds/forest.mp3", illustration: "forest", loopDurationSeconds: 600, isElite: true },
  { id: "fireplace", group: "nature", audioSrc: "/audio/sleep-sounds/fireplace.mp3", illustration: "fireplace", loopDurationSeconds: 600, isElite: true },

  // Lullabies
  { id: "lullaby", group: "lullabies", audioSrc: "/audio/sleep-sounds/lullaby.mp3", illustration: "lullaby", loopDurationSeconds: 180, isElite: true },
  { id: "piano", group: "lullabies", audioSrc: "/audio/sleep-sounds/piano.mp3", illustration: "piano", loopDurationSeconds: 180, isElite: true },
  { id: "music-box", group: "lullabies", audioSrc: "/audio/sleep-sounds/music-box.mp3", illustration: "music-box", loopDurationSeconds: 120, isElite: true },
];

/** Curated starter set shown in the "Recommended" section. */
export const recommendedSoundIds = ["white-noise", "rain", "heartbeat", "lullaby"];

export const sleepSoundSectionOrder: SleepSoundSection[] = ["recommended", "favorites", "white-noise", "nature", "lullabies"];

function buildSound(base: SoundBase, dict: SleepSoundsDict): SleepSound {
  const copy = dict.sounds[base.id];
  return { ...base, name: copy?.name ?? base.id, description: copy?.description ?? "" };
}

export function getSoundById(id: string, dict: SleepSoundsDict): SleepSound | undefined {
  const base = sleepSoundsBase.find((sound) => sound.id === id);
  return base ? buildSound(base, dict) : undefined;
}

export function getSoundsByGroup(group: SleepSoundGroup, dict: SleepSoundsDict): SleepSound[] {
  return sleepSoundsBase.filter((sound) => sound.group === group).map((sound) => buildSound(sound, dict));
}

export function getRecommendedSounds(dict: SleepSoundsDict): SleepSound[] {
  return recommendedSoundIds.map((id) => getSoundById(id, dict)).filter((sound): sound is SleepSound => Boolean(sound));
}

import type { SleepSound, SleepSoundGroup, SleepSoundSection } from "@/types/sleep-sounds";

/**
 * Audio sources are placeholders — real licensed, loop-ready audio files
 * still need to be sourced and hosted (Supabase Storage or a CDN both work
 * with the current player) before this ships to users.
 */
export const sleepSounds: SleepSound[] = [
  // White Noise — steady, textureless sounds (grouped with heartbeat/womb,
  // which serve the same "constant background" function for babies).
  { id: "white-noise", name: "White Noise", group: "white-noise", description: "Even, full-spectrum hush that masks sudden household sounds.", audioSrc: "/audio/sleep-sounds/white-noise.mp3", illustration: "white-noise", loopDurationSeconds: 600, isElite: true },
  { id: "fan", name: "Fan", group: "white-noise", description: "The steady whir of a box fan on a warm night.", audioSrc: "/audio/sleep-sounds/fan.mp3", illustration: "fan", loopDurationSeconds: 600, isElite: true },
  { id: "pink-noise", name: "Pink Noise", group: "white-noise", description: "Softer and deeper than white noise, easier on tiny ears.", audioSrc: "/audio/sleep-sounds/pink-noise.mp3", illustration: "pink-noise", loopDurationSeconds: 600, isElite: true },
  { id: "brown-noise", name: "Brown Noise", group: "white-noise", description: "Deep, rumbling low end — like distant thunder that never arrives.", audioSrc: "/audio/sleep-sounds/brown-noise.mp3", illustration: "brown-noise", loopDurationSeconds: 600, isElite: true },
  { id: "heartbeat", name: "Heartbeat", group: "white-noise", description: "A calm, steady heartbeat — the most familiar sound there is.", audioSrc: "/audio/sleep-sounds/heartbeat.mp3", illustration: "heartbeat", loopDurationSeconds: 300, isElite: true },
  { id: "womb-sounds", name: "Womb Sounds", group: "white-noise", description: "The muffled whoosh newborns knew before the world got loud.", audioSrc: "/audio/sleep-sounds/womb-sounds.mp3", illustration: "womb", loopDurationSeconds: 300, isElite: true },

  // Nature
  { id: "rain", name: "Rain", group: "nature", description: "A gentle, steady rainfall on a quiet roof.", audioSrc: "/audio/sleep-sounds/rain.mp3", illustration: "rain", loopDurationSeconds: 600, isElite: true },
  { id: "ocean-waves", name: "Ocean Waves", group: "nature", description: "Slow waves rolling in and pulling back out.", audioSrc: "/audio/sleep-sounds/ocean-waves.mp3", illustration: "ocean", loopDurationSeconds: 600, isElite: true },
  { id: "forest", name: "Forest", group: "nature", description: "Wind through leaves and distant birdsong at dusk.", audioSrc: "/audio/sleep-sounds/forest.mp3", illustration: "forest", loopDurationSeconds: 600, isElite: true },
  { id: "fireplace", name: "Fireplace", group: "nature", description: "A crackling fire on a cold, cozy evening.", audioSrc: "/audio/sleep-sounds/fireplace.mp3", illustration: "fireplace", loopDurationSeconds: 600, isElite: true },

  // Lullabies
  { id: "lullaby", name: "Lullabies", group: "lullabies", description: "A gentle, wordless lullaby melody on repeat.", audioSrc: "/audio/sleep-sounds/lullaby.mp3", illustration: "lullaby", loopDurationSeconds: 180, isElite: true },
  { id: "piano", name: "Piano", group: "lullabies", description: "Soft, slow piano — simple and unhurried.", audioSrc: "/audio/sleep-sounds/piano.mp3", illustration: "piano", loopDurationSeconds: 180, isElite: true },
  { id: "music-box", name: "Music Box", group: "lullabies", description: "A delicate, familiar music-box tune.", audioSrc: "/audio/sleep-sounds/music-box.mp3", illustration: "music-box", loopDurationSeconds: 120, isElite: true },
];

/** Curated starter set shown in the "Recommended" section. */
export const recommendedSoundIds = ["white-noise", "rain", "heartbeat", "lullaby"];

export const sleepSoundGroupLabels: Record<SleepSoundGroup, string> = {
  "white-noise": "White Noise",
  nature: "Nature",
  lullabies: "Lullabies",
};

export const sleepSoundSectionOrder: SleepSoundSection[] = ["recommended", "favorites", "white-noise", "nature", "lullabies"];

export function getSoundById(id: string): SleepSound | undefined {
  return sleepSounds.find((sound) => sound.id === id);
}

export function getSoundsByGroup(group: SleepSoundGroup): SleepSound[] {
  return sleepSounds.filter((sound) => sound.group === group);
}

export function getRecommendedSounds(): SleepSound[] {
  return recommendedSoundIds.map(getSoundById).filter((sound): sound is SleepSound => Boolean(sound));
}

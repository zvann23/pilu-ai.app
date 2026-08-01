import type { SleepSoundsDict } from "@/lib/i18n/dictionary/sleep-sounds";

export const sleepSounds = {
  header: { eyebrow: "Pilu Elite", title: "Sleep Sounds", subtitle: "Calming sounds to help your little one drift off." },
  sections: {
    recommendedEyebrow: "Curated for tonight", recommendedTitle: "Recommended",
    favoritesEyebrow: "Kept for later", favoritesTitle: "Favorites", favoritesEmpty: "Tap the heart on any sound to save it here.",
    whiteNoiseEyebrow: "Steady and familiar", natureEyebrow: "Outdoors, gently", lullabiesEyebrow: "Soft melodies",
  },
  groupLabels: { "white-noise": "White Noise", nature: "Nature", lullabies: "Lullabies" },
  favorite: { removeAriaTemplate: "Remove {label} from favorites", addAriaTemplate: "Add {label} to favorites" },
  miniPlayer: { openAriaTemplate: "Open {name} player", playing: "Playing", paused: "Paused", pause: "Pause", play: "Play" },
  playerSheet: { closePlayer: "Close player", playerAriaTemplate: "{name} player", volume: "Volume", sleepTimer: "Sleep timer", cancelTemplate: "Cancel · {time}" },
  timerOptions: { min15: "15 min", min30: "30 min", min45: "45 min", min60: "60 min", manual: "Until stopped" },
  elite: { title: "Sleep Sounds is a Pilu Elite feature", body: "Unlock white noise, nature sounds, lullabies, and more — with timers, favorites, and background playback — with Pilu Elite.", upgrade: "Upgrade to Elite" },
  sounds: {
    "white-noise": { name: "White Noise", description: "Even, full-spectrum hush that masks sudden household sounds." },
    fan: { name: "Fan", description: "The steady whir of a box fan on a warm night." },
    "pink-noise": { name: "Pink Noise", description: "Softer and deeper than white noise, easier on tiny ears." },
    "brown-noise": { name: "Brown Noise", description: "Deep, rumbling low end — like distant thunder that never arrives." },
    heartbeat: { name: "Heartbeat", description: "A calm, steady heartbeat — the most familiar sound there is." },
    "womb-sounds": { name: "Womb Sounds", description: "The muffled whoosh newborns knew before the world got loud." },
    rain: { name: "Rain", description: "A gentle, steady rainfall on a quiet roof." },
    "ocean-waves": { name: "Ocean Waves", description: "Slow waves rolling in and pulling back out." },
    forest: { name: "Forest", description: "Wind through leaves and distant birdsong at dusk." },
    fireplace: { name: "Fireplace", description: "A crackling fire on a cold, cozy evening." },
    lullaby: { name: "Lullabies", description: "A gentle, wordless lullaby melody on repeat." },
    piano: { name: "Piano", description: "Soft, slow piano — simple and unhurried." },
    "music-box": { name: "Music Box", description: "A delicate, familiar music-box tune." },
  },
} satisfies SleepSoundsDict;

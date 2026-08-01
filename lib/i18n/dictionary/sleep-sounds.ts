import type { SleepSoundGroup } from "@/types/sleep-sounds";

export type SleepSoundsDict = {
  header: { eyebrow: string; title: string; subtitle: string };
  sections: {
    recommendedEyebrow: string; recommendedTitle: string;
    favoritesEyebrow: string; favoritesTitle: string; favoritesEmpty: string;
    whiteNoiseEyebrow: string; natureEyebrow: string; lullabiesEyebrow: string;
  };
  groupLabels: Record<SleepSoundGroup, string>;
  favorite: { removeAriaTemplate: string; addAriaTemplate: string };
  miniPlayer: { openAriaTemplate: string; playing: string; paused: string; pause: string; play: string };
  playerSheet: { closePlayer: string; playerAriaTemplate: string; volume: string; sleepTimer: string; cancelTemplate: string };
  timerOptions: { min15: string; min30: string; min45: string; min60: string; manual: string };
  elite: { title: string; body: string; upgrade: string };
  sounds: Record<string, { name: string; description: string }>;
};

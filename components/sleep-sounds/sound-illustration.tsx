import type { ReactNode } from "react";
import type { SleepSoundIllustrationName } from "@/types/sleep-sounds";

type SoundIllustrationProps = {
  name: SleepSoundIllustrationName;
  className?: string;
};

/**
 * PLACEHOLDER illustrations — simple, cohesive, rounded pastel icons so the
 * feature is usable and on-brand immediately. The brief calls for
 * children's-book-quality artwork (sleeping baby, teddy bear, moon, clouds,
 * stars); swap these for real illustrations from Pilu's illustrator before
 * shipping. Every icon shares the same soft rounded badge so a mixed set of
 * final artwork can drop in without changing any layout code.
 */
export function SoundIllustration({ name, className }: SoundIllustrationProps) {
  return (
    <div className={`sleep-sound-illustration ${className ?? ""}`} style={{ background: badgeBackgrounds[name] }}>
      <svg viewBox="0 0 48 48" width="60%" height="60%" fill="none" aria-hidden="true">
        {iconPaths[name]}
      </svg>
    </div>
  );
}

const rose = "var(--pilu-pink)";
const blush = "var(--pilu-light-pink)";
const periwinkle = "var(--pilu-light-blue)";
const gold = "var(--pilu-yellow)";
const navy = "var(--pilu-dark-blue)";

const badgeBackgrounds: Record<SleepSoundIllustrationName, string> = {
  "white-noise": `linear-gradient(160deg, rgb(180 189 222 / 33%), rgb(180 189 222 / 13%))`,
  fan: `linear-gradient(160deg, rgb(180 189 222 / 33%), rgb(180 189 222 / 13%))`,
  "pink-noise": `linear-gradient(160deg, rgb(248 202 228 / 47%), rgb(248 202 228 / 13%))`,
  "brown-noise": `linear-gradient(160deg, rgb(15 52 115 / 20%), rgb(180 189 222 / 13%))`,
  heartbeat: `linear-gradient(160deg, rgb(234 105 147 / 33%), rgb(234 105 147 / 9%))`,
  womb: `linear-gradient(160deg, rgb(234 105 147 / 27%), rgb(248 202 228 / 20%))`,
  rain: `linear-gradient(160deg, rgb(180 189 222 / 40%), rgb(180 189 222 / 13%))`,
  ocean: `linear-gradient(160deg, rgb(15 52 115 / 20%), rgb(180 189 222 / 20%))`,
  forest: `linear-gradient(160deg, rgb(255 219 152 / 33%), rgb(180 189 222 / 13%))`,
  fireplace: `linear-gradient(160deg, rgb(255 219 152 / 47%), rgb(234 105 147 / 13%))`,
  lullaby: `linear-gradient(160deg, rgb(248 202 228 / 40%), rgb(255 219 152 / 13%))`,
  piano: `linear-gradient(160deg, rgb(15 52 115 / 13%), rgb(248 202 228 / 13%))`,
  "music-box": `linear-gradient(160deg, rgb(255 219 152 / 40%), rgb(248 202 228 / 13%))`,
};

const iconPaths: Record<SleepSoundIllustrationName, ReactNode> = {
  "white-noise": (
    <>
      <circle cx="24" cy="20" r="9" fill={gold} />
      <path d="M12 34c4-3 8-3 12 0s8 3 12 0" stroke={navy} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  fan: (
    <>
      <circle cx="24" cy="24" r="4" fill={navy} />
      <path
        d="M24 24c0-6 4-10 8-10s2 8-8 10Zm0 0c0 6-4 10-8 10s-2-8 8-10Zm0 0c6 0 10 4 10 8s-8 2-10-8Zm0 0c-6 0-10-4-10-8s8-2 10 8Z"
        fill={periwinkle}
      />
    </>
  ),
  "pink-noise": (
    <>
      <circle cx="16" cy="26" r="5" fill={rose} />
      <circle cx="26" cy="18" r="7" fill={blush} />
      <circle cx="34" cy="28" r="4" fill={rose} />
    </>
  ),
  "brown-noise": (
    <>
      <path d="M8 30c4-10 10-16 16-16s12 6 16 16" stroke={navy} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="30" r="4" fill={navy} />
    </>
  ),
  heartbeat: (
    <>
      <path
        d="M24 34S10 25 10 16.5C10 11.8 13.8 8 18.5 8c2.7 0 5.1 1.3 6.5 3.3C26.4 9.3 28.8 8 31.5 8 36.2 8 40 11.8 40 16.5 40 25 24 34 24 34Z"
        fill={rose}
      />
      <path d="M12 22h5l3-6 4 9 3-5h9" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  womb: (
    <>
      <path d="M24 10c-7 0-12 6-12 13 0 8 6 13 6 13h12s6-5 6-13c0-7-5-13-12-13Z" fill={blush} />
      <circle cx="24" cy="24" r="5" fill={rose} />
    </>
  ),
  rain: (
    <>
      <path d="M14 20a8 8 0 0 1 15-4 7 7 0 0 1 7 7c0 .3 0 .7-.1 1H16a8 8 0 0 1-2-4Z" fill={periwinkle} />
      <path d="M16 30v4M24 30v6M32 30v4" stroke={navy} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  ocean: (
    <>
      <path d="M6 22c4-3 8-3 12 0s8 3 12 0 8-3 12 0" stroke={navy} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M6 30c4-3 8-3 12 0s8 3 12 0 8-3 12 0" stroke={periwinkle} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),
  forest: <path d="M24 8 16 24h5l-6 10h9v6h4v-6h9l-6-10h5Z" fill={periwinkle} />,
  fireplace: (
    <path d="M24 10c3 5-3 6-1 11 2-2 3-1 3 1 0 4-3 7-7 7s-7-3-7-7c0-6 6-8 12-12Z" fill={rose} />
  ),
  lullaby: (
    <>
      <path d="M18 10a12 12 0 1 0 12 14 9 9 0 0 1-12-14Z" fill={gold} />
      <circle cx="33" cy="14" r="1.6" fill={gold} />
      <circle cx="37" cy="20" r="1.2" fill={gold} />
    </>
  ),
  piano: (
    <>
      <rect x="10" y="18" width="28" height="14" rx="2" fill={navy} />
      <rect x="12" y="18" width="24" height="9" fill="#fff" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={13.5 + i * 4.6} y="18" width="2.6" height="6" fill={navy} />
      ))}
    </>
  ),
  "music-box": (
    <>
      <rect x="12" y="20" width="24" height="16" rx="3" fill={gold} />
      <path d="M18 20v-4a6 6 0 0 1 12 0v4" stroke={navy} strokeWidth="2.2" fill="none" />
      <circle cx="24" cy="28" r="3" fill={navy} />
    </>
  ),
};

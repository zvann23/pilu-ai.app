import { Volume2 } from "lucide-react";
import Link from "next/link";

/** Shown in place of the sound library for Free-tier users. */
export function EliteUpgradeScreen() {
  return (
    <div className="sleep-sounds-elite">
      <div className="sleep-sounds-elite__art">
        <Volume2 size={40} aria-hidden="true" color="var(--pilu-pink)" />
      </div>
      <h2>Sleep Sounds is a Pilu Elite feature</h2>
      <p>
        Unlock white noise, nature sounds, lullabies, and more — with timers, favorites, and background
        playback — with Pilu Elite.
      </p>
      <Link href="/subscription">Upgrade to Elite</Link>
    </div>
  );
}

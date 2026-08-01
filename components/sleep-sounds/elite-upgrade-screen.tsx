"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { Volume2 } from "lucide-react";
import Link from "next/link";

/** Shown in place of the sound library for Free-tier users. */
export function EliteUpgradeScreen() {
  const { t } = useLocale();
  const sd = t((d) => d.sleepSounds);
  return (
    <div className="sleep-sounds-elite">
      <div className="sleep-sounds-elite__art">
        <Volume2 size={40} aria-hidden="true" color="var(--pilu-pink)" />
      </div>
      <h2>{sd.elite.title}</h2>
      <p>{sd.elite.body}</p>
      <Link href="/subscription">{sd.elite.upgrade}</Link>
    </div>
  );
}

"use client";

import { BabyAvatar } from "@/components/baby/baby-avatar";
import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { useLocale } from "@/components/i18n/locale-provider";
import { PiluIllustration } from "@/components/illustrations/pilu-illustration";
import { getBabyAge } from "@/lib/baby-data";
import { getDayPeriod, type DayPeriod } from "@/lib/greeting";
import { useEffect, useState } from "react";

export function HomeGreeting() {
  const { profile } = useBabyProfile();
  const { t } = useLocale();
  // Starts at "morning" so the server-rendered shell and the first client
  // render match exactly; the effect below swaps in the real device-clock
  // period right after mount, same as the app's other client-only values.
  const [period, setPeriod] = useState<DayPeriod>("morning");

  useEffect(() => {
    const updatePeriod = () => setPeriod(getDayPeriod(new Date()));
    updatePeriod();
    const id = window.setInterval(updatePeriod, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const isNight = period === "night";

  return (
    <header className="home-greeting">
      <PiluIllustration variant={isNight ? "sleeping-baby" : "sunny-cloud"} alt="" className="home-greeting__illustration" priority />
      <div className="home-greeting__text">
        <p>{t((d) => d.home.greeting[period])}</p>
        <h1>{profile.preferredName}</h1>
        <span>{getBabyAge(profile.dateOfBirth, t((d) => d.baby.age))}</span>
      </div>
      <BabyAvatar name={profile.preferredName} photoPreview={profile.photoPreview} className="home-greeting__avatar" />
    </header>
  );
}

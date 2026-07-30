"use client";

import { BabyAvatar } from "@/components/baby/baby-avatar";
import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { getBabyAge } from "@/lib/baby-data";

export function HomeGreeting() {
  const { profile } = useBabyProfile();
  return (
    <header className="home-greeting">
      <div>
        <p>Good morning,</p>
        <h1>{profile.preferredName}</h1>
        <span>{getBabyAge(profile.dateOfBirth)}</span>
      </div>
      <BabyAvatar name={profile.preferredName} photoPreview={profile.photoPreview} className="home-greeting__avatar" />
    </header>
  );
}

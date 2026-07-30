"use client";
/* eslint-disable react-hooks/set-state-in-effect -- the active database baby is reflected after context hydration. */

import { type ActiveBaby, usePiluData } from "@/components/data/pilu-data-provider";
import { mockBabyProfile } from "@/lib/baby-data";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { BabyProfile } from "@/types/baby";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type BabyProfileContextValue = { profile: BabyProfile; saveProfile: (profile: BabyProfile) => void };
const BabyProfileContext = createContext<BabyProfileContextValue | null>(null);

function profileFromBaby(baby: ActiveBaby): BabyProfile {
  const name = baby.firstName;
  return {
    ...mockBabyProfile,
    id: baby.id,
    fullName: name,
    preferredName: baby.nickname || name,
    dateOfBirth: baby.dateOfBirth || "",
    photoPreview: baby.avatarUrl || undefined,
  };
}

export function BabyProfileProvider({ children }: { children: ReactNode }) {
  const { configured, activeBaby } = usePiluData();
  const [profile, setProfile] = useState<BabyProfile>(mockBabyProfile);

  useEffect(() => {
    if (!configured) { setProfile(mockBabyProfile); return; }
    if (activeBaby) setProfile(profileFromBaby(activeBaby));
  }, [configured, activeBaby]);

  const saveProfile = (next: BabyProfile) => {
    setProfile(next);
    if (!configured || !activeBaby) return;
    const names = next.fullName.trim().split(/\s+/);
    void createBrowserSupabaseClient().from("babies").update({
      first_name: names[0] || next.preferredName || activeBaby.firstName,
      last_name: names.slice(1).join(" ") || null,
      nickname: next.preferredName || null,
      date_of_birth: next.dateOfBirth || null,
      avatar_url: next.photoPreview || null,
      notes: next.health.emergencyNotes || null,
    }).eq("id", activeBaby.id);
  };

  const value = { profile, saveProfile };
  return <BabyProfileContext.Provider value={value}>{children}</BabyProfileContext.Provider>;
}

export function useBabyProfile() {
  const context = useContext(BabyProfileContext);
  if (!context) throw new Error("useBabyProfile must be used inside BabyProfileProvider");
  return context;
}

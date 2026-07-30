"use client";

import { mockBabyProfile } from "@/lib/baby-data";
import type { BabyProfile } from "@/types/baby";
import { createContext, useContext, useState, type ReactNode } from "react";

type BabyProfileContextValue = { profile: BabyProfile; saveProfile: (profile: BabyProfile) => void };
const BabyProfileContext = createContext<BabyProfileContextValue | null>(null);

export function BabyProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(mockBabyProfile);
  return <BabyProfileContext.Provider value={{ profile, saveProfile: setProfile }}>{children}</BabyProfileContext.Provider>;
}

export function useBabyProfile() {
  const context = useContext(BabyProfileContext);
  if (!context) throw new Error("useBabyProfile must be used inside BabyProfileProvider");
  return context;
}

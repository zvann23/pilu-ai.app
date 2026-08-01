"use client";

import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { mockBabyProfile } from "@/lib/baby-data";
import { removeBabyAvatarFile, uploadBabyAvatarFile } from "@/lib/supabase/baby-avatar-storage";
import { getFamilyBabies, updateBabyAvatarUrl, type Baby } from "@/lib/supabase/babies-repository";
import { getMyFamily } from "@/lib/supabase/family-repository";
import { isUuid } from "@/lib/uuid";
import type { BabyProfile, Caregiver } from "@/types/baby";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type BabyProfileContextValue = { profile: BabyProfile; saveProfile: (profile: BabyProfile) => void };
const BabyProfileContext = createContext<BabyProfileContextValue | null>(null);

const sexLabel: Record<NonNullable<Baby["biologicalSex"]>, BabyProfile["sex"]> = {
  female: "Female", male: "Male", intersex: "Prefer not to say", not_specified: "Prefer not to say",
};

/**
 * Seeds the identity, birth-measurement, and parent fields from the real
 * baby record created during onboarding — everything else on BabyProfile
 * (feeding preferences, health notes, current growth history shown
 * elsewhere) still comes from the local mock scaffold. Migrating those
 * remaining fields to real per-user Supabase data is a further,
 * separately-scoped piece of work, not part of this auth fix.
 */
export function BabyProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(mockBabyProfile);
  const { userId } = useSupabaseUser();
  const familyId = useRef<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    getMyFamily(userId)
      .then((result) => {
        if (!result) return null;
        familyId.current = result.family.id;
        return getFamilyBabies(result.family.id);
      })
      .then((babies) => {
        if (cancelled || !babies?.length) return;
        const baby = babies[0];
        const preferredName = baby.nickname || baby.firstName;
        const caregivers: Caregiver[] = [];
        if (baby.motherName) caregivers.push({ id: "mother", name: baby.motherName, relationship: "Mother", phone: "", permission: "Full access" });
        if (baby.fatherName) caregivers.push({ id: "father", name: baby.fatherName, relationship: "Father", phone: "", permission: "Full access" });
        setProfile((current) => ({
          ...current,
          id: baby.id,
          fullName: baby.lastName ? `${baby.firstName} ${baby.lastName}` : baby.firstName,
          preferredName,
          dateOfBirth: baby.dateOfBirth || current.dateOfBirth,
          sex: baby.biologicalSex ? sexLabel[baby.biologicalSex] : current.sex,
          photoPreview: baby.avatarUrl || current.photoPreview,
          birthGrowth: {
            ...current.birthGrowth,
            weightKg: baby.birthWeightGrams != null ? (baby.birthWeightGrams / 1000).toFixed(2) : current.birthGrowth.weightKg,
            lengthCm: baby.birthLengthCm != null ? String(baby.birthLengthCm) : current.birthGrowth.lengthCm,
          },
          caregivers,
        }));
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [userId]);

  /**
   * Photo persistence only — the rest of BabyProfile (feeding preferences,
   * health notes, etc.) still comes from the local mock scaffold, unchanged
   * from before. Runs fire-and-forget in the background so Save stays
   * instant; a real Supabase-backed baby id is required since the mock
   * scaffold's placeholder id has no row to attach a storage path to.
   */
  function saveProfile(nextProfile: BabyProfile) {
    const photoChanged = nextProfile.photoPreview !== profile.photoPreview;
    setProfile(nextProfile);

    const activeFamilyId = familyId.current;
    if (!photoChanged || !isUuid(nextProfile.id) || !activeFamilyId) return;

    if (nextProfile.photoPreview?.startsWith("data:")) {
      uploadBabyAvatarFile(activeFamilyId, nextProfile.id, nextProfile.photoPreview)
        .then((url) => {
          setProfile((current) => (current.id === nextProfile.id ? { ...current, photoPreview: url } : current));
          return updateBabyAvatarUrl(nextProfile.id, url);
        })
        .catch((error) => console.error("Failed to save baby photo", error));
    } else if (!nextProfile.photoPreview) {
      removeBabyAvatarFile(activeFamilyId, nextProfile.id).catch(() => undefined);
      updateBabyAvatarUrl(nextProfile.id, null).catch((error) => console.error("Failed to clear baby photo", error));
    }
  }

  return <BabyProfileContext.Provider value={{ profile, saveProfile }}>{children}</BabyProfileContext.Provider>;
}

export function useBabyProfile() {
  const context = useContext(BabyProfileContext);
  if (!context) throw new Error("useBabyProfile must be used inside BabyProfileProvider");
  return context;
}

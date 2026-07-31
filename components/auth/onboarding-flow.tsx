"use client";

import { DisplayNamePrompt } from "@/components/family/display-name-prompt";
import { FamilyOnboarding } from "@/components/family/family-onboarding";
import { SkeletonScreen } from "@/components/ui/skeleton-screen";
import { trackBabyCreated, trackOnboardingCompleted } from "@/lib/analytics/analytics-service";
import { useDisplayName } from "@/hooks/use-display-name";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { createBaby, getFamilyBabies } from "@/lib/supabase/babies-repository";
import { createFamily, getMyFamily, redeemInvite } from "@/lib/supabase/family-repository";
import type { BabyDraft } from "@/lib/supabase/babies-repository";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BabyOnboardingForm } from "./baby-onboarding-form";

type AsyncStep = "pending" | "family" | "baby";

export function OnboardingFlow() {
  const router = useRouter();
  const { userId, isLoading: isAuthLoading } = useSupabaseUser();
  const { displayName, isLoading: isNameLoading, setDisplayName } = useDisplayName(userId);
  const [asyncStep, setAsyncStep] = useState<AsyncStep>("pending");
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || isAuthLoading || isNameLoading || !displayName || asyncStep !== "pending") return;

    let cancelled = false;
    getMyFamily(userId)
      .then(async (result) => {
        if (cancelled) return;
        if (!result) {
          setAsyncStep("family");
          return;
        }
        setFamilyId(result.family.id);
        const babies = await getFamilyBabies(result.family.id);
        if (cancelled) return;
        if (babies.length > 0) {
          router.push("/home");
          router.refresh();
          return;
        }
        setAsyncStep("baby");
      })
      .catch(() => {
        if (!cancelled) setAsyncStep("family");
      });

    return () => {
      cancelled = true;
    };
  }, [userId, isAuthLoading, isNameLoading, displayName, asyncStep, router]);

  async function saveName(name: string) {
    await setDisplayName(name);
  }

  async function createFamilyAndContinue(name: string) {
    setIsMutating(true);
    setError(null);
    try {
      const id = await createFamily(name);
      setFamilyId(id);
      setAsyncStep("baby");
    } catch {
      setError("Could not create your family. Please try again.");
    } finally {
      setIsMutating(false);
    }
  }

  async function joinFamilyAndContinue(code: string) {
    setIsMutating(true);
    setError(null);
    try {
      const id = await redeemInvite(code);
      const babies = await getFamilyBabies(id);
      if (babies.length > 0) {
        router.push("/home");
        router.refresh();
        return;
      }
      setFamilyId(id);
      setAsyncStep("baby");
    } catch {
      setError("That invite code didn't work — check it and try again.");
    } finally {
      setIsMutating(false);
    }
  }

  async function saveBaby(draft: BabyDraft) {
    if (!familyId) return;
    setIsMutating(true);
    setError(null);
    try {
      await createBaby(familyId, draft);
      trackBabyCreated();
      trackOnboardingCompleted();
      router.push("/home");
      router.refresh();
    } catch {
      setError("Could not save your baby's profile. Please try again.");
      setIsMutating(false);
    }
  }

  if (isAuthLoading || isNameLoading) return <SkeletonScreen variant="card" />;
  if (!displayName) return <DisplayNamePrompt onSave={saveName} />;
  if (asyncStep === "pending") return <SkeletonScreen variant="card" />;
  if (asyncStep === "family") return <FamilyOnboarding isMutating={isMutating} error={error} onCreate={createFamilyAndContinue} onJoin={joinFamilyAndContinue} />;
  return <BabyOnboardingForm isSaving={isMutating} error={error} onSave={saveBaby} />;
}

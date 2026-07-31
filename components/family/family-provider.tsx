"use client";

import { useDisplayName } from "@/hooks/use-display-name";
import { useFamily } from "@/hooks/use-family";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { createContext, useContext, type ReactNode } from "react";

type FamilyContextValue = ReturnType<typeof useFamily> & {
  userId: string | null;
  isAuthLoading: boolean;
  isDisplayNameLoading: boolean;
  setDisplayName: (name: string) => Promise<void>;
};

const FamilyContext = createContext<FamilyContextValue | null>(null);

/**
 * Scoped to the /family route subtree only — deliberately not wired into
 * the global app layout, so this feature's data loading stays contained
 * to the pages that need it.
 */
export function FamilyProvider({ children }: { children: ReactNode }) {
  const { userId, isLoading: isAuthLoading } = useSupabaseUser();
  const { displayName, isLoading: isDisplayNameLoading, setDisplayName } = useDisplayName(userId);
  const family = useFamily(userId, displayName);

  return (
    <FamilyContext.Provider value={{ ...family, userId, isAuthLoading, isDisplayNameLoading, setDisplayName }}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamilyContext() {
  const context = useContext(FamilyContext);
  if (!context) throw new Error("useFamilyContext must be used inside FamilyProvider");
  return context;
}

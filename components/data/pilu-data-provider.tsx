"use client";
/* eslint-disable react-hooks/set-state-in-effect -- session and active baby are hydrated from Supabase. */

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { hasSupabaseEnvironment } from "@/lib/supabase/env";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ActiveBaby = {
  id: string;
  familyId: string;
  firstName: string;
  nickname: string | null;
  dateOfBirth: string | null;
  dueDate: string | null;
  avatarUrl: string | null;
};

type PiluDataContextValue = {
  configured: boolean;
  loading: boolean;
  userId: string | null;
  familyId: string | null;
  babies: ActiveBaby[];
  activeBaby: ActiveBaby | null;
  setActiveBabyId: (id: string) => void;
  refresh: () => Promise<void>;
};

const PiluDataContext = createContext<PiluDataContextValue | null>(null);
const preferenceKey = "pilu.active-baby-id";

export function PiluDataProvider({ children }: { children: ReactNode }) {
  const configured = hasSupabaseEnvironment();
  const [loading, setLoading] = useState(configured);
  const [userId, setUserId] = useState<string | null>(null);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [babies, setBabies] = useState<ActiveBaby[]>([]);
  const [activeBabyId, setActiveBabyIdState] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!configured) return;
    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUserId(null); setFamilyId(null); setBabies([]); setActiveBabyIdState(null);
        return;
      }
      setUserId(user.id);
      const { data: memberships, error: membershipError } = await supabase
        .from("family_members")
        .select("family_id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .limit(1);
      if (membershipError) throw membershipError;
      const nextFamilyId = memberships?.[0]?.family_id ?? null;
      setFamilyId(nextFamilyId);
      if (!nextFamilyId) { setBabies([]); setActiveBabyIdState(null); return; }
      const { data, error } = await supabase.from("babies").select("id, family_id, first_name, nickname, date_of_birth, due_date, avatar_url").eq("family_id", nextFamilyId).eq("is_active", true).order("created_at");
      if (error) throw error;
      const nextBabies = data.map((baby) => ({ id: baby.id, familyId: baby.family_id, firstName: baby.first_name, nickname: baby.nickname, dateOfBirth: baby.date_of_birth, dueDate: baby.due_date, avatarUrl: baby.avatar_url }));
      setBabies(nextBabies);
      const saved = window.localStorage.getItem(preferenceKey);
      setActiveBabyIdState(nextBabies.some((baby) => baby.id === saved) ? saved : nextBabies[0]?.id ?? null);
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => { void refresh(); }, [refresh]);

  const setActiveBabyId = useCallback((id: string) => {
    if (!babies.some((baby) => baby.id === id)) return;
    window.localStorage.setItem(preferenceKey, id);
    setActiveBabyIdState(id);
  }, [babies]);

  const activeBaby = babies.find((baby) => baby.id === activeBabyId) ?? null;
  const value = useMemo(() => ({ configured, loading, userId, familyId, babies, activeBaby, setActiveBabyId, refresh }), [configured, loading, userId, familyId, babies, activeBaby, setActiveBabyId, refresh]);
  return <PiluDataContext.Provider value={value}>{children}</PiluDataContext.Provider>;
}

export function usePiluData() {
  const context = useContext(PiluDataContext);
  if (!context) throw new Error("usePiluData must be used inside PiluDataProvider");
  return context;
}

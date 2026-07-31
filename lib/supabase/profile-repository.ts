import { supabase } from "@/lib/supabase/client";

export type Profile = { id: string; displayName: string | null; avatarUrl: string | null };

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("id, display_name, avatar_url").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data ? { id: data.id, displayName: data.display_name, avatarUrl: data.avatar_url } : null;
}

export async function updateDisplayName(userId: string, displayName: string): Promise<void> {
  const { error } = await supabase.from("profiles").update({ display_name: displayName, updated_at: new Date().toISOString() }).eq("id", userId);
  if (error) throw error;
}

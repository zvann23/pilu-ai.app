import { supabase } from "@/lib/supabase/client";
import type { RecentlyPlayedRow, SleepSoundPreferences } from "@/types/sleep-sounds";

export async function getPreferences(userId: string): Promise<SleepSoundPreferences> {
  const { data, error } = await supabase
    .from("sleep_sound_preferences")
    .select("last_sound_id, last_volume")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  return {
    lastSoundId: data?.last_sound_id ?? null,
    lastVolume: data?.last_volume ?? 0.6,
  };
}

export async function savePreferences(userId: string, preferences: Partial<SleepSoundPreferences>): Promise<void> {
  const { error } = await supabase.from("sleep_sound_preferences").upsert(
    {
      user_id: userId,
      ...(preferences.lastSoundId !== undefined && { last_sound_id: preferences.lastSoundId }),
      ...(preferences.lastVolume !== undefined && { last_volume: preferences.lastVolume }),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) throw error;
}

export async function listFavoriteSoundIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase.from("sleep_sound_favorites").select("sound_id").eq("user_id", userId);

  if (error) throw error;
  return (data ?? []).map((row) => row.sound_id as string);
}

export async function addFavorite(userId: string, soundId: string): Promise<void> {
  const { error } = await supabase
    .from("sleep_sound_favorites")
    .upsert({ user_id: userId, sound_id: soundId }, { onConflict: "user_id,sound_id" });

  if (error) throw error;
}

export async function removeFavorite(userId: string, soundId: string): Promise<void> {
  const { error } = await supabase
    .from("sleep_sound_favorites")
    .delete()
    .eq("user_id", userId)
    .eq("sound_id", soundId);

  if (error) throw error;
}

export async function listRecentlyPlayed(userId: string, limit = 8): Promise<RecentlyPlayedRow[]> {
  const { data, error } = await supabase
    .from("sleep_sound_recently_played")
    .select("sound_id, last_played_at, play_count")
    .eq("user_id", userId)
    .order("last_played_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    soundId: row.sound_id as string,
    lastPlayedAt: row.last_played_at as string,
    playCount: row.play_count as number,
  }));
}

export async function recordPlay(userId: string, soundId: string): Promise<void> {
  // Upsert + increment. Left as a read-then-write since play events aren't
  // high-frequency; switch to an RPC if that ever changes.
  const { data: existing, error: fetchError } = await supabase
    .from("sleep_sound_recently_played")
    .select("play_count")
    .eq("user_id", userId)
    .eq("sound_id", soundId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  const { error } = await supabase.from("sleep_sound_recently_played").upsert(
    {
      user_id: userId,
      sound_id: soundId,
      play_count: (existing?.play_count ?? 0) + 1,
      last_played_at: new Date().toISOString(),
    },
    { onConflict: "user_id,sound_id" },
  );

  if (error) throw error;
}

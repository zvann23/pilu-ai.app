import "server-only";
import { hasSupabaseEnvironment } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
export async function getPiluAuthState() { if (!hasSupabaseEnvironment()) return { configured: false as const, user: null, profile: null }; const supabase = await createServerSupabaseClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return { configured: true as const, user: null, profile: null }; const { data: profile } = await supabase.from("profiles").select("id, onboarding_completed").eq("id", user.id).maybeSingle(); return { configured: true as const, user, profile }; }

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Falls back to a placeholder so a missing env var never breaks the build
  // (e.g. a fresh Vercel deploy before env vars are configured) — real
  // network calls will simply fail until NEXT_PUBLIC_SUPABASE_URL /
  // NEXT_PUBLIC_SUPABASE_ANON_KEY are set.
  console.warn("Supabase env vars are not set — Supabase-backed features will not work.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
);

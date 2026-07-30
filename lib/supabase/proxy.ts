import { createServerClient } from "@supabase/ssr";
import { hasSupabaseEnvironment, getSupabaseEnvironment } from "@/lib/supabase/env";
import type { Database } from "@/types/database";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSupabaseSession(request: NextRequest) {
  if (!hasSupabaseEnvironment()) return NextResponse.next({ request });
  const { url, anonKey } = getSupabaseEnvironment();
  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });
  await supabase.auth.getClaims();
  return response;
}

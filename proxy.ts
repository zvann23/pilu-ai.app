import type { NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/proxy";
import { hasSupabaseEnvironment } from "@/lib/supabase/env";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { NextResponse } from "next/server";
const publicPaths = ["/auth", "/onboarding", "/manifest.webmanifest", "/icon.png", "/favicon.ico"];
export async function proxy(request: NextRequest) {
  const response = await updateSupabaseSession(request);
  if (!hasSupabaseEnvironment() || publicPaths.some((path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`))) return response;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!; const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createServerClient<Database>(url, anonKey, { cookies: { getAll: () => request.cookies.getAll(), setAll: () => undefined } });
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) { const destination = request.nextUrl.clone(); destination.pathname = "/auth"; destination.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`); return NextResponse.redirect(destination); }
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };

import { getFamilyTierServer } from "@/lib/billing/server-subscription";
import { checkVisionRateLimit } from "@/lib/gemini/rate-limit";
import { askGeminiVision } from "@/lib/gemini/vision-client";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { activeVisionCategories, FREE_DAILY_VISION_SCANS } from "@/types/vision";
import type { VisionCategory } from "@/types/vision";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type AnalyzeRequest = { category?: string; imageBase64?: string; mimeType?: string };

function isActiveCategory(value: unknown): value is VisionCategory {
  return typeof value === "string" && (activeVisionCategories as string[]).includes(value);
}

/** Never trusts a client-claimed babyId or plan — both are re-derived from the authenticated user's own family here. */
export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const rateKey = forwarded?.split(",")[0]?.trim() || "local";
  if (!checkVisionRateLimit(rateKey).allowed) {
    return NextResponse.json({ error: "Pilu needs a small pause before analyzing another photo. Please try again in a minute." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as AnalyzeRequest | null;
  if (!body?.imageBase64 || !body.mimeType) {
    return NextResponse.json({ error: "A photo is required." }, { status: 400 });
  }
  if (!isActiveCategory(body.category)) {
    return NextResponse.json({ error: "This scan type isn't available yet." }, { status: 400 });
  }
  const category = body.category;

  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Authentication is required" }, { status: 401 });

  const { data: membership } = await supabase
    .from("family_members")
    .select("family_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();
  if (!membership) return NextResponse.json({ error: "You need a family before using Pilu Vision" }, { status: 404 });

  const { data: baby } = await supabase
    .from("babies")
    .select("id")
    .eq("family_id", membership.family_id)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();
  if (!baby) return NextResponse.json({ error: "Add your baby's profile before using Pilu Vision" }, { status: 404 });

  const tier = await getFamilyTierServer(supabase, membership.family_id as string);
  if (tier === "free") {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("vision_scans")
      .select("id", { count: "exact", head: true })
      .eq("baby_id", baby.id)
      .gte("created_at", startOfDay.toISOString());
    if ((count ?? 0) >= FREE_DAILY_VISION_SCANS) {
      return NextResponse.json(
        { error: `Free plans include ${FREE_DAILY_VISION_SCANS} Pilu Vision scans per day — upgrade to Elite for unlimited scans.`, limitReached: true },
        { status: 403 },
      );
    }
  }

  const analysis = await askGeminiVision(category, body.imageBase64, body.mimeType);

  const { data: scan, error } = await supabase
    .from("vision_scans")
    .insert({
      baby_id: baby.id,
      created_by: user.id,
      category,
      title: analysis.title,
      summary: analysis.summary,
      key_points: analysis.keyPoints,
      concerns: analysis.concerns,
      recommendation: analysis.recommendation,
    })
    .select("id, category, title, summary, key_points, concerns, recommendation, is_saved, created_at")
    .single();

  if (error || !scan) {
    return NextResponse.json({ error: "Pilu Vision analyzed this photo but couldn't save it. Please try again." }, { status: 500 });
  }

  return NextResponse.json({
    id: scan.id,
    category: scan.category,
    title: scan.title,
    summary: scan.summary,
    keyPoints: scan.key_points,
    concerns: scan.concerns,
    recommendation: scan.recommendation,
    disclaimer: analysis.disclaimer,
    isSaved: scan.is_saved,
    createdAt: scan.created_at,
    demo: analysis.demo,
  });
}

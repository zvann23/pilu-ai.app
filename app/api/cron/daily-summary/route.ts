import { computeSummaryFromEvents, formatDailySummaryBody } from "@/lib/notifications-data";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Vercel Cron target (see vercel.json) — generates "Today's Summary" for
 * every family from the real, persisted family_activity_events feed
 * (Phase 18), one notification per active member. Requires
 * SUPABASE_SERVICE_ROLE_KEY; no-ops cleanly without it, same as this
 * app's other optional server integrations.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ skipped: "SUPABASE_SERVICE_ROLE_KEY not configured" });

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: families, error: familiesError } = await admin.from("families").select("id");
  if (familiesError) return NextResponse.json({ error: familiesError.message }, { status: 500 });

  let generated = 0;
  for (const family of families ?? []) {
    const { data: events } = await admin
      .from("family_activity_events")
      .select("id, family_id, actor_id, actor_name, event_kind, title, detail, created_at")
      .eq("family_id", family.id)
      .gte("created_at", since);

    const mapped = (events ?? []).map((row) => ({ id: row.id, familyId: row.family_id, actorId: row.actor_id, actorName: row.actor_name, kind: row.event_kind, title: row.title, detail: row.detail, createdAt: row.created_at }));
    const stats = computeSummaryFromEvents(mapped);
    if (!stats.feedings && !stats.diapers && !stats.napMinutes && !stats.newMilestones && !stats.newMemories) continue;

    const { data: members } = await admin.from("family_members").select("user_id").eq("family_id", family.id).eq("status", "active");
    for (const member of members ?? []) {
      const { count } = await admin.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", member.user_id).eq("category", "daily_summary").gte("created_at", since);
      if (count && count > 0) continue;
      await admin.from("notifications").insert({ user_id: member.user_id, family_id: family.id, category: "daily_summary", title: "Today's Summary", body: formatDailySummaryBody(stats), link: "/timeline" });
      generated += 1;
    }
  }

  return NextResponse.json({ generated });
}

import { askGeminiForReport } from "@/lib/gemini/reports-client";
import { checkReportsRateLimit } from "@/lib/gemini/rate-limit";
import { reportTypes } from "@/types/reports";
import type { ReportRequest } from "@/types/reports";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function isReportRequest(value: unknown): value is ReportRequest {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<ReportRequest>;
  return typeof data.reportType === "string" && (reportTypes as readonly string[]).includes(data.reportType) && Boolean(data.context && typeof data.context === "object");
}

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const rateKey = forwarded?.split(",")[0]?.trim() || "local";
  if (!checkReportsRateLimit(rateKey).allowed) {
    return NextResponse.json({ error: "Pilu needs a small pause before generating another report. Please try again in a minute." }, { status: 429 });
  }
  try {
    const body: unknown = await request.json();
    if (!isReportRequest(body)) return NextResponse.json({ error: "Could not read the report request." }, { status: 400 });
    const content = await askGeminiForReport(body.context);
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: "Pilu couldn't prepare this report right now. Please try again." }, { status: 503 });
  }
}

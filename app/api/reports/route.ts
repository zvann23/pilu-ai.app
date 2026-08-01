import { askGeminiForReport } from "@/lib/gemini/reports-client";
import { checkReportsRateLimit } from "@/lib/gemini/rate-limit";
import { defaultLocale, isLocale } from "@/lib/i18n/locales";
import { dictionaries } from "@/lib/i18n/translations";
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
  let body: unknown;
  try { body = await request.json(); } catch { body = null; }
  const rawLocale = body && typeof body === "object" ? (body as Partial<ReportRequest>).locale : undefined;
  const locale = typeof rawLocale === "string" && isLocale(rawLocale) ? rawLocale : defaultLocale;
  const { routeErrors } = dictionaries[locale].reportsAi;

  if (!checkReportsRateLimit(rateKey).allowed) {
    return NextResponse.json({ error: routeErrors.rateLimited }, { status: 429 });
  }
  try {
    if (!isReportRequest(body)) return NextResponse.json({ error: routeErrors.badRequest }, { status: 400 });
    const content = await askGeminiForReport(body.context, locale);
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: routeErrors.serverError }, { status: 503 });
  }
}

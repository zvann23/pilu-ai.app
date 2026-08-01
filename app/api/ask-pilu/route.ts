import { askGemini } from "@/lib/gemini/client";
import { checkAskPiluRateLimit } from "@/lib/gemini/rate-limit";
import { getMessageUrgency, urgentSafetyResponse } from "@/lib/gemini/safety";
import { defaultLocale, isLocale } from "@/lib/i18n/locales";
import { dictionaries } from "@/lib/i18n/translations";
import type { AskPiluRequest } from "@/types/chat";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function isRequest(value: unknown): value is AskPiluRequest {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<AskPiluRequest>;
  return typeof data.message === "string" && data.message.trim().length > 0 && data.message.length <= 1_200 && Boolean(data.babyContext && typeof data.babyContext === "object");
}

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const rateKey = forwarded?.split(",")[0]?.trim() || "local";
  let body: unknown;
  try { body = await request.json(); } catch { body = null; }
  const rawLocale = body && typeof body === "object" ? (body as Partial<AskPiluRequest>).locale : undefined;
  const locale = typeof rawLocale === "string" && isLocale(rawLocale) ? rawLocale : defaultLocale;
  const { routeErrors } = dictionaries[locale].gemini;

  if (!checkAskPiluRateLimit(rateKey).allowed) return NextResponse.json({ error: routeErrors.rateLimited }, { status: 429 });
  try {
    if (!isRequest(body)) return NextResponse.json({ error: routeErrors.badRequest }, { status: 400 });
    if (getMessageUrgency(body.message) === "urgent") return NextResponse.json(urgentSafetyResponse(locale));
    const response = await askGemini(body.message.trim(), body.babyContext, locale);
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: routeErrors.serverError }, { status: 503 });
  }
}

import { askGemini } from "@/lib/gemini/client";
import { checkAskPiluRateLimit } from "@/lib/gemini/rate-limit";
import { getMessageUrgency, urgentSafetyResponse } from "@/lib/gemini/safety";
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
  if (!checkAskPiluRateLimit(rateKey).allowed) return NextResponse.json({ error: "Pilu needs a small pause. Please try again in a minute." }, { status: 429 });
  try {
    const body: unknown = await request.json();
    if (!isRequest(body)) return NextResponse.json({ error: "Please write a short question for Pilu." }, { status: 400 });
    if (getMessageUrgency(body.message) === "urgent") return NextResponse.json(urgentSafetyResponse());
    const response = await askGemini(body.message.trim(), body.babyContext);
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Pilu couldn’t answer right now. Please try again." }, { status: 503 });
  }
}

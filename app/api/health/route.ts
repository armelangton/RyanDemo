import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "fire-protection-field-assistant",
    cpscRecallApi: "configured",
    aiSummaries: process.env.OPENAI_API_KEY ? "openai-configured" : "fallback-demo",
  });
}

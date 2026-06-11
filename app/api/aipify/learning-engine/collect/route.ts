import { NextResponse } from "next/server";
import { collectLearningSignalsJob } from "@/lib/aipify/learning-engine/jobs";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { since?: string };
    const result = await collectLearningSignalsJob(body.since);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to collect learning signals" }, { status: 500 });
  }
}

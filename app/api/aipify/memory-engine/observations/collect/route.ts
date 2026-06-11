import { NextRequest, NextResponse } from "next/server";
import { collectMemoryObservationsJob, generateMemoryRecommendationsJob } from "@/lib/aipify/memory/jobs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { tenant_slug?: string; generate?: boolean };
    const collected = await collectMemoryObservationsJob(body.tenant_slug);
    const generated = body.generate !== false ? await generateMemoryRecommendationsJob() : null;
    return NextResponse.json({ collected, generated });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to collect observations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

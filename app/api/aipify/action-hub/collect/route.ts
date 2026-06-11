import { NextResponse } from "next/server";
import { collectActionRecommendationsJob } from "@/lib/aipify/action-hub/jobs";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { since?: string };
    const result = await collectActionRecommendationsJob(body.since);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to collect action recommendations" }, { status: 500 });
  }
}

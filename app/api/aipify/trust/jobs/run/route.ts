import { NextResponse } from "next/server";
import { calculateTrustScoreJob } from "@/lib/aipify/trust-engine/jobs";

export async function POST() {
  try {
    const result = await calculateTrustScoreJob();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to run trust jobs" }, { status: 500 });
  }
}

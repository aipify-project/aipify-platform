import { NextResponse } from "next/server";
import { resetTenantLearningJob } from "@/lib/aipify/learning-engine/jobs";

export async function POST() {
  try {
    const result = await resetTenantLearningJob();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to reset tenant learning" }, { status: 500 });
  }
}

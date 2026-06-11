import { NextResponse } from "next/server";
import { seedUnonightPilotLearningJob } from "@/lib/aipify/learning-engine/jobs";

export async function POST() {
  try {
    const result = await seedUnonightPilotLearningJob();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to seed Unonight pilot learning" }, { status: 500 });
  }
}

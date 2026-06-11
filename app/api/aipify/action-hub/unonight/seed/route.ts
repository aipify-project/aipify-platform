import { NextResponse } from "next/server";
import { seedUnonightPilotActionsJob } from "@/lib/aipify/action-hub/jobs";

export async function POST() {
  try {
    const result = await seedUnonightPilotActionsJob();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to seed Unonight pilot actions" }, { status: 500 });
  }
}

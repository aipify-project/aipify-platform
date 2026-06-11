import { NextResponse } from "next/server";
import { seedUnonightPilotSkillsJob } from "@/lib/aipify/skills/jobs";

export async function POST() {
  try {
    const data = await seedUnonightPilotSkillsJob();
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to seed Unonight skills";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { collectAppTelemetryJob } from "@/lib/aipify/app-ecosystem/jobs";

export async function POST() {
  try {
    const result = await collectAppTelemetryJob();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to collect telemetry" }, { status: 500 });
  }
}

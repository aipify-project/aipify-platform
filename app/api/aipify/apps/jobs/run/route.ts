import { NextResponse } from "next/server";
import {
  checkAppUpdatesJob,
  collectAppTelemetryJob,
  processAppReviewQueueJob,
} from "@/lib/aipify/app-ecosystem/jobs";

export async function POST() {
  try {
    const [review, updates, telemetry] = await Promise.all([
      processAppReviewQueueJob(),
      checkAppUpdatesJob(),
      collectAppTelemetryJob(),
    ]);
    return NextResponse.json({ review, updates, telemetry });
  } catch {
    return NextResponse.json({ error: "Failed to run app ecosystem jobs" }, { status: 500 });
  }
}

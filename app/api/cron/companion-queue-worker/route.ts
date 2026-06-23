import { NextResponse } from "next/server";
import { runCompanionQueueWorker } from "@/lib/app/companion/chat-queue/worker-run";
import { logCompanionWorkerEvent } from "@/lib/app/companion/chat-queue/worker-log";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

function authorizeCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceRoleClient();
    const result = await runCompanionQueueWorker(supabase);

    logCompanionWorkerEvent("worker_run_finish", {
      workerId: result.workerId,
      claimed: result.claimed,
      completed: result.completed,
      failed: result.failed,
      retried: result.retried,
      ok: result.ok,
    });

    return NextResponse.json(result);
  } catch {
    logCompanionWorkerEvent("worker_run_error", { errorCode: "worker_run_failed" });
    return NextResponse.json({ ok: false, error: "worker_run_failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}

import { after } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { logCompanionWorkerEvent } from "./worker-log";
import { isCompanionWorkerConfigured } from "./worker-config";
import { runCompanionQueueWorker, triggerCompanionQueueWorker } from "./worker-run";

export type CompanionWorkerDispatchResult =
  | { ok: true }
  | { ok: false; error_code: "worker_not_configured" | "worker_dispatch_failed" };

export { isCompanionWorkerConfigured } from "./worker-config";

/** Run the durable queue worker inline with the service-role client. */
export async function dispatchCompanionQueueWorker(options: {
  origin?: string;
} = {}): Promise<CompanionWorkerDispatchResult> {
  if (!isCompanionWorkerConfigured()) {
    logCompanionWorkerEvent("dispatch_skipped", { errorCode: "worker_not_configured" });
    return { ok: false, error_code: "worker_not_configured" };
  }

  try {
    const supabase = createServiceRoleClient();
    const result = await runCompanionQueueWorker(supabase);

    logCompanionWorkerEvent("dispatch_inline_finish", {
      workerId: result.workerId,
      claimed: result.claimed,
      completed: result.completed,
      failed: result.failed,
      retried: result.retried,
      ok: result.ok,
    });

    if (!result.ok) {
      return { ok: false, error_code: "worker_dispatch_failed" };
    }

    return { ok: true };
  } catch {
    logCompanionWorkerEvent("dispatch_failed", { errorCode: "worker_dispatch_failed" });
    return { ok: false, error_code: "worker_dispatch_failed" };
  } finally {
    triggerCompanionQueueWorker(options.origin);
  }
}

/**
 * Enqueue/retry/process routes call this after persisting queue state.
 * Uses `after()` so Vercel keeps the invocation alive for inline worker dispatch.
 * Cron HTTP trigger remains a cross-instance fallback.
 */
export function scheduleCompanionQueueWorkerDispatch(options: { origin?: string } = {}): void {
  after(async () => {
    await dispatchCompanionQueueWorker(options);
  });
  triggerCompanionQueueWorker(options.origin);
}

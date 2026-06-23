import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  COMPANION_QUEUE_LEASE_SECONDS,
  COMPANION_QUEUE_WORKER_BATCH_SIZE,
  COMPANION_QUEUE_WORKER_MAX_ROUNDS,
} from "./worker-config";
import { logCompanionWorkerEvent } from "./worker-log";
import { processWorkerQueueJob, type WorkerQueueJob } from "./worker-process-item";

export type CompanionQueueWorkerRunResult = {
  ok: boolean;
  workerId: string;
  claimed: number;
  completed: number;
  failed: number;
  retried: number;
  recovered?: { requeued: number; failed: number };
};

export async function runCompanionQueueWorker(
  supabase: SupabaseClient,
  options: { batchSize?: number; workerId?: string } = {},
): Promise<CompanionQueueWorkerRunResult> {
  const workerId = options.workerId ?? `worker-${randomUUID().slice(0, 8)}`;
  const batchSize = options.batchSize ?? COMPANION_QUEUE_WORKER_BATCH_SIZE;

  const { data: recoverRaw } = await supabase.rpc("companion_queue_worker_recover_stale", {
    p_lease_seconds: COMPANION_QUEUE_LEASE_SECONDS,
  });

  const recovered = {
    requeued: Number(recoverRaw?.requeued ?? 0),
    failed: Number(recoverRaw?.failed ?? 0),
  };

  if (recovered.requeued > 0 || recovered.failed > 0) {
    logCompanionWorkerEvent("recover_stale", {
      workerId,
      requeued: recovered.requeued,
      failedPermanent: recovered.failed,
    });
  }

  let totalClaimed = 0;
  let completed = 0;
  let failed = 0;
  let retried = 0;

  for (let round = 0; round < COMPANION_QUEUE_WORKER_MAX_ROUNDS; round += 1) {
    const { data: claimRaw, error: claimError } = await supabase.rpc(
      "companion_queue_worker_claim_batch",
      {
        p_worker_id: workerId,
        p_batch_size: batchSize,
        p_lease_seconds: COMPANION_QUEUE_LEASE_SECONDS,
      },
    );

    if (claimError) {
      logCompanionWorkerEvent("claim_failed", { workerId, errorCode: "claim_failed" });
      return {
        ok: false,
        workerId,
        claimed: totalClaimed,
        completed,
        failed,
        retried,
        recovered,
      };
    }

    const jobs = (Array.isArray(claimRaw?.jobs) ? claimRaw.jobs : []) as WorkerQueueJob[];
    if (jobs.length === 0) break;

    totalClaimed += jobs.length;

    logCompanionWorkerEvent("claim_batch", {
      workerId,
      claimed: jobs.length,
      round,
    });

    for (const job of jobs) {
      const outcome = await processWorkerQueueJob(supabase, workerId, job);
      if (outcome === "completed") completed += 1;
      else if (outcome === "retried") retried += 1;
      else failed += 1;
    }
  }

  return {
    ok: true,
    workerId,
    claimed: totalClaimed,
    completed,
    failed,
    retried,
    recovered,
  };
}

/** HTTP cron fallback — primary dispatch is inline via dispatch-worker. */
export function triggerCompanionQueueWorker(origin?: string): void {
  const base = origin ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    logCompanionWorkerEvent("cron_trigger_skipped", { errorCode: "cron_secret_missing" });
    return;
  }

  void fetch(`${base.replace(/\/$/, "")}/api/cron/companion-queue-worker`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${secret}`,
    },
  }).catch(() => {
    logCompanionWorkerEvent("cron_trigger_failed", { errorCode: "cron_fetch_failed" });
  });
}

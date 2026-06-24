export const COMPANION_QUEUE_LEASE_SECONDS = 180;
export const COMPANION_QUEUE_WORKER_BATCH_SIZE = 5;
export const COMPANION_QUEUE_MAX_ATTEMPTS = 3;
export const COMPANION_QUEUE_HEARTBEAT_INTERVAL_MS = 15_000;
/** UI surfaces a dispatch error when waiting exceeds this threshold. */
export const COMPANION_QUEUE_DISPATCH_STALL_MS = 45_000;
/** Hard limit for a full-route worker turn — per-route budgets use worker-route-timeout. */
export const COMPANION_QUEUE_JOB_TIMEOUT_MS = 60_000;
/** Exact-source / external RPC budget per job step. */
export const COMPANION_QUEUE_RPC_TIMEOUT_MS = 15_000;
/** Bootstrap RPC budget for worker tenant runtime. */
export const COMPANION_QUEUE_BOOTSTRAP_TIMEOUT_MS = 20_000;
/** UI: show active working copy after this wait. */
export const COMPANION_QUEUE_UI_WORKING_MS = 5_000;
/** UI: explain longer-than-normal wait. */
export const COMPANION_QUEUE_UI_LONG_WAIT_MS = 15_000;
/** UI: controlled timeout — offer retry without creating a duplicate enqueue. */
export const COMPANION_QUEUE_UI_TIMEOUT_MS = 90_000;
/** Max claim rounds per cron invocation — drains sequential conversation queues. */
export const COMPANION_QUEUE_WORKER_MAX_ROUNDS = 12;

export function isCompanionWorkerConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

export type CompanionQueueRetryDecision = {
  retryable: boolean;
  permanent: boolean;
  errorCode: string;
};

/** Controlled retry — transient errors retry until max_attempts. */
export function resolveCompanionQueueRetry(errorCode: string): CompanionQueueRetryDecision {
  const permanentCodes = new Set([
    "empty_query",
    "unauthorized",
    "no_profile",
    "tenant_mismatch",
    "worker_bootstrap_failed",
    "turn_failed",
  ]);

  if (permanentCodes.has(errorCode)) {
    return { retryable: false, permanent: true, errorCode };
  }

  if (errorCode === "turn_timeout" || errorCode === "timed_out") {
    return { retryable: false, permanent: true, errorCode };
  }

  if (
    errorCode === "worker_heartbeat_stale_max_attempts" ||
    errorCode === "lease_expired_max_attempts" ||
    errorCode === "orphaned_processing_max_attempts"
  ) {
    return { retryable: false, permanent: true, errorCode };
  }

  if (
    errorCode === "worker_bootstrap_timeout" ||
    errorCode === "worker_heartbeat_stale" ||
    errorCode === "rpc_timeout" ||
    errorCode === "lease_expired"
  ) {
    return { retryable: true, permanent: false, errorCode };
  }

  return { retryable: true, permanent: false, errorCode };
}

export function shouldNotifyCompanionReply(companionActiveAtEnqueue: boolean): boolean {
  return companionActiveAtEnqueue !== true;
}

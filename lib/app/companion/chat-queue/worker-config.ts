export const COMPANION_QUEUE_LEASE_SECONDS = 300;
export const COMPANION_QUEUE_WORKER_BATCH_SIZE = 5;
export const COMPANION_QUEUE_MAX_ATTEMPTS = 3;
export const COMPANION_QUEUE_HEARTBEAT_INTERVAL_MS = 30_000;
/** Max claim rounds per cron invocation — drains sequential conversation queues. */
export const COMPANION_QUEUE_WORKER_MAX_ROUNDS = 12;

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
    "turn_failed",
  ]);

  if (permanentCodes.has(errorCode)) {
    return { retryable: false, permanent: true, errorCode };
  }

  return { retryable: true, permanent: false, errorCode };
}

export function shouldNotifyCompanionReply(companionActiveAtEnqueue: boolean): boolean {
  return companionActiveAtEnqueue !== true;
}

import type { Translator } from "@/lib/i18n/translate";

const ERROR_PREFIX = "customerApp.companionExperience.queue.errors.";

export function resolveCompanionQueueErrorPrimary(
  errorCode: string | null | undefined,
  t: Translator,
): string | null {
  if (!errorCode) return null;

  if (errorCode === "turn_timeout" || errorCode === "timed_out") {
    return t(`${ERROR_PREFIX}turnTimeoutPrimary`);
  }

  const keyed = t(`${ERROR_PREFIX}${errorCode}`);
  if (keyed !== `${ERROR_PREFIX}${errorCode}`) return keyed;

  return t(`${ERROR_PREFIX}generic`);
}

export function resolveCompanionQueueErrorSecondary(
  errorCode: string | null | undefined,
  t: Translator,
): string | null {
  if (!errorCode) return null;
  if (errorCode === "turn_timeout" || errorCode === "timed_out") {
    return t(`${ERROR_PREFIX}turnTimeoutSecondary`);
  }
  return null;
}

/** Hide raw English worker diagnostics from customer UI. */
export function sanitizeCompanionQueueErrorMessage(
  errorCode: string | null | undefined,
  errorMessage: string | null | undefined,
  t: Translator,
): string | null {
  const localized = resolveCompanionQueueErrorPrimary(errorCode, t);
  if (localized) return localized;

  if (!errorMessage?.trim()) return null;
  if (/companion turn exceeded|production time budget/i.test(errorMessage)) {
    return t(`${ERROR_PREFIX}turnTimeoutPrimary`);
  }
  return null;
}

export function resolveCompanionQueueDisplayError(
  item: { error_code?: string | null; error_message?: string | null },
  labels: {
    turnTimeoutPrimary: string;
    turnTimeoutSecondary: string;
    generic: string;
  },
): { primary: string | null; secondary: string | null } {
  const code = item.error_code ?? null;
  if (code === "turn_timeout" || code === "timed_out") {
    return {
      primary: labels.turnTimeoutPrimary,
      secondary: labels.turnTimeoutSecondary,
    };
  }

  if (
    code === "worker_heartbeat_stale_max_attempts" ||
    code === "lease_expired_max_attempts" ||
    code === "orphaned_processing_max_attempts" ||
    item.error_message?.includes("maximum attempts reached") ||
    item.error_message?.includes("worker_heartbeat_stale_max_attempts") ||
    item.error_message?.includes("lease_expired_max_attempts") ||
    item.error_message?.includes("orphaned_processing_max_attempts")
  ) {
    return {
      primary: labels.turnTimeoutPrimary,
      secondary: labels.turnTimeoutSecondary,
    };
  }

  if (
    item.error_message &&
    /worker stopped|lease expired|orphaned processing|companion turn exceeded|production time budget/i.test(
      item.error_message,
    )
  ) {
    return {
      primary: labels.turnTimeoutPrimary,
      secondary: labels.turnTimeoutSecondary,
    };
  }

  if (code) {
    return { primary: labels.generic, secondary: null };
  }

  return { primary: null, secondary: null };
}

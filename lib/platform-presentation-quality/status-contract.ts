/**
 * Central Platform status label + severity contract.
 * Components must not switch on language or render raw enums.
 */

export const PLATFORM_STATUS_CODES = [
  "active",
  "ready",
  "enabled",
  "disabled",
  "pending",
  "provisioning",
  "provisioned",
  "verified",
  "acknowledged",
  "attention",
  "blocked",
  "failed",
  "suspended",
  "revoked",
  "expired",
  "archived",
  "not_ready",
  "not_configured",
  "not_available",
  "licensed",
  "inactive",
  "trialing",
  "trial",
  "cancelled",
  "canceled",
  "past_due",
  "paused",
  "unpaid",
  "installing",
  "checking_requirements",
  "not_started",
  "awaiting_confirmation",
  "ready_for_activation",
  "activating",
  "partial",
  "healthy",
  "partially_ready",
  "outdated",
  "security_error",
  "conflict",
  "historical",
  "unknown",
] as const;

export type PlatformStatusCode = (typeof PLATFORM_STATUS_CODES)[number];

/** Locale JSON keys under platform.presentationQuality.statuses.* (camelCase). */
export const PLATFORM_STATUS_LOCALE_KEYS: Record<PlatformStatusCode, string> = {
  active: "active",
  ready: "ready",
  enabled: "enabled",
  disabled: "disabled",
  pending: "pending",
  provisioning: "provisioning",
  provisioned: "provisioned",
  verified: "verified",
  acknowledged: "acknowledged",
  attention: "attention",
  blocked: "blocked",
  failed: "failed",
  suspended: "suspended",
  revoked: "revoked",
  expired: "expired",
  archived: "archived",
  not_ready: "notReady",
  not_configured: "notConfigured",
  not_available: "notAvailable",
  licensed: "licensed",
  inactive: "inactive",
  trialing: "trialing",
  trial: "trial",
  cancelled: "cancelled",
  canceled: "cancelled",
  past_due: "pastDue",
  paused: "paused",
  unpaid: "unpaid",
  installing: "installing",
  checking_requirements: "checkingRequirements",
  not_started: "notStarted",
  awaiting_confirmation: "awaitingConfirmation",
  ready_for_activation: "readyForActivation",
  activating: "activating",
  partial: "partial",
  healthy: "healthy",
  partially_ready: "partiallyReady",
  outdated: "outdated",
  security_error: "securityError",
  conflict: "conflict",
  historical: "historical",
  unknown: "unknown",
};

export type PlatformStatusSeverity =
  | "success"
  | "warning"
  | "danger"
  | "muted"
  | "info";

const SUCCESS = new Set([
  "active",
  "ready",
  "enabled",
  "verified",
  "acknowledged",
  "provisioned",
  "licensed",
  "healthy",
]);

const WARNING = new Set([
  "pending",
  "provisioning",
  "attention",
  "partial",
  "partially_ready",
  "outdated",
  "installing",
  "checking_requirements",
  "awaiting_confirmation",
  "ready_for_activation",
  "activating",
  "trialing",
  "trial",
  "paused",
  "past_due",
]);

const DANGER = new Set([
  "failed",
  "blocked",
  "revoked",
  "security_error",
  "conflict",
  "unpaid",
  "suspended",
]);

const MUTED = new Set([
  "not_configured",
  "not_available",
  "not_ready",
  "archived",
  "disabled",
  "inactive",
  "historical",
  "expired",
  "cancelled",
  "canceled",
  "not_started",
]);

export function normalizePlatformStatusCode(
  value: string | null | undefined,
): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  return trimmed
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

export function resolvePlatformStatusSeverity(
  status: string | null | undefined,
): PlatformStatusSeverity {
  const code = normalizePlatformStatusCode(status);
  if (!code) return "muted";
  if (SUCCESS.has(code)) return "success";
  if (WARNING.has(code)) return "warning";
  if (DANGER.has(code)) return "danger";
  if (MUTED.has(code)) return "muted";
  return "info";
}

export type ResolvePlatformStatusLabelInput = {
  status: string | null | undefined;
  labels: Record<string, string>;
  unknownFallback: string;
  /** Prefer empty label over unknown when status is blank. */
  emptyFallback?: string;
  /** When true (default in development), log unknown statuses once. */
  logUnknown?: boolean;
};

const warnedUnknown = new Set<string>();

/**
 * Map a technical status to a localized business label.
 * Never returns the raw enum in production when unknownFallback is provided.
 */
export function resolvePlatformStatusLabel(
  input: ResolvePlatformStatusLabelInput,
): string {
  let code = normalizePlatformStatusCode(input.status);
  if (!code) {
    return input.emptyFallback ?? input.unknownFallback;
  }
  if (PLATFORM_STATUS_ALIASES[code]) {
    code = PLATFORM_STATUS_ALIASES[code];
  }
  if (PLATFORM_STATUS_ALIASES[code.replace(/_/g, "")]) {
    code = PLATFORM_STATUS_ALIASES[code.replace(/_/g, "")];
  }

  const fromMap =
    input.labels[code] ??
    input.labels[code.replace(/_/g, "")] ??
    input.labels[PLATFORM_STATUS_LOCALE_KEYS[code as PlatformStatusCode] ?? ""];

  if (fromMap && fromMap.trim()) {
    return fromMap.trim();
  }

  const shouldLog =
    input.logUnknown ?? process.env.NODE_ENV !== "production";
  if (shouldLog && !warnedUnknown.has(code)) {
    warnedUnknown.add(code);
    console.warn(
      `[platform-presentation-quality] Unknown status code "${code}" — using controlled fallback`,
    );
  }

  return input.unknownFallback;
}

export type PlatformStatusPresentation = {
  code: string | null;
  label: string;
  severity: PlatformStatusSeverity;
  ariaLabel: string;
};

export function getPlatformStatusPresentation(
  input: ResolvePlatformStatusLabelInput,
): PlatformStatusPresentation {
  const code = normalizePlatformStatusCode(input.status);
  const label = resolvePlatformStatusLabel(input);
  const severity = resolvePlatformStatusSeverity(code);
  return {
    code,
    label,
    severity,
    ariaLabel: label,
  };
}

/** Aliases that normalize to a canonical status code before label lookup. */
export const PLATFORM_STATUS_ALIASES: Record<string, string> = {
  ok: "verified",
  complete: "active",
  completed: "active",
  success: "active",
  live: "active",
  on: "enabled",
  off: "disabled",
  notready: "not_ready",
  notconfigured: "not_configured",
  notavailable: "not_available",
  requires_attention: "attention",
  needs_attention: "attention",
  needs_follow_up: "attention",
};

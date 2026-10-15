/**
 * Platform password recovery — map provider failures to stable public codes.
 * Never surface raw provider messages in the UI (account enumeration / i18n).
 */

import { logAuthRecoveryEvent } from "./auth-recovery-log";

export type ForgotPasswordErrorCode =
  | "email_required"
  | "rate_limited"
  | "delivery_failed"
  | "request_failed"
  | "generic";

/** Public API codes returned to the client (never raw provider text). */
export const FORGOT_PASSWORD_PUBLIC_ERROR_CODES = [
  "email_required",
  "rate_limited",
  "delivery_failed",
  "request_failed",
  "generic",
] as const;

export function isForgotPasswordPublicErrorCode(
  value: unknown,
): value is ForgotPasswordErrorCode {
  return (
    typeof value === "string" &&
    (FORGOT_PASSWORD_PUBLIC_ERROR_CODES as readonly string[]).includes(value)
  );
}

export function normalizeForgotPasswordEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Map Auth provider / transport errors to UI codes.
 * Unknown-user style messages are treated as delivery-neutral success at the
 * route layer (anti-enumeration) — this mapper is for real send failures.
 */
export function mapForgotPasswordProviderError(
  message: string | null | undefined,
): ForgotPasswordErrorCode {
  const normalized = String(message ?? "")
    .trim()
    .toLowerCase();

  if (!normalized) return "delivery_failed";

  if (
    normalized.includes("rate limit") ||
    normalized.includes("too many requests") ||
    normalized.includes("email rate") ||
    normalized.includes("over_email_send_rate_limit") ||
    normalized.includes("429")
  ) {
    return "rate_limited";
  }

  if (
    normalized.includes("error sending recovery email") ||
    normalized.includes("error sending magic link") ||
    normalized.includes("error sending confirmation") ||
    normalized.includes("error sending email") ||
    normalized.includes("unable to send") ||
    normalized.includes("smtp") ||
    normalized.includes("mail")
  ) {
    return "delivery_failed";
  }

  // Do not leak "user not found" via a distinct code — route treats as success.
  if (
    normalized.includes("user not found") ||
    normalized.includes("user_not_found") ||
    normalized.includes("email not found")
  ) {
    return "generic";
  }

  return "delivery_failed";
}

/** Provider messages that must not reveal whether an account exists. */
export function isForgotPasswordUnknownAccountMessage(
  message: string | null | undefined,
): boolean {
  const normalized = String(message ?? "")
    .trim()
    .toLowerCase();
  return (
    normalized.includes("user not found") ||
    normalized.includes("user_not_found") ||
    normalized.includes("email not found")
  );
}

export function logForgotPasswordFailure(details: {
  code: ForgotPasswordErrorCode;
  status: number;
  /** Provider message hashed length only — never log the email or token. */
  providerMessageLength?: number;
}): void {
  logAuthRecoveryEvent("forgot_password_failed", {
    code: details.code,
    status: String(details.status),
    providerMessageLength:
      details.providerMessageLength !== undefined
        ? String(details.providerMessageLength)
        : undefined,
  });
}

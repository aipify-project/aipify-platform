/** Safe auth recovery logging — never log tokens, codes, or credentials. */

export type AuthRecoveryErrorCode =
  | "missing_code"
  | "otp_expired"
  | "invalid_code"
  | "exchange_failed";

export function mapAuthCallbackError(message: string): AuthRecoveryErrorCode {
  const lower = message.toLowerCase();
  if (lower.includes("expired") || lower.includes("otp_expired")) {
    return "otp_expired";
  }
  if (
    lower.includes("invalid") ||
    lower.includes("bad_code") ||
    lower.includes("not_found") ||
    lower.includes("flow_state")
  ) {
    return "invalid_code";
  }
  return "exchange_failed";
}

export function logAuthRecoveryEvent(
  event: string,
  details: Record<string, string | boolean | undefined>,
): void {
  const safe: Record<string, string | boolean> = {};
  for (const [key, value] of Object.entries(details)) {
    if (value === undefined) continue;
    safe[key] = value;
  }
  console.info("[auth-recovery]", event, safe);
}

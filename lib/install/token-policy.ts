/** Install token security policy (Phase 24 — no manual license keys for standard users). */

export const TOKEN_SECURITY_RULES = [
  "Customers should never handle raw tokens unless using Developer Settings.",
  "Tokens must never appear in application logs.",
  "Tokens must never be emailed.",
  "Tokens must be revocable via server-side rotation.",
  "All validation must occur server-side.",
] as const;

export const INSTALL_TOKEN_VALIDATION_CHECKS = [
  "tenant",
  "subscription",
  "domain",
  "installation_count",
  "plan_limits",
  "allowed_modules",
  "heartbeat_status",
] as const;

export type InstallTokenValidationCheck =
  (typeof INSTALL_TOKEN_VALIDATION_CHECKS)[number];

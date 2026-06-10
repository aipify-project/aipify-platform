import type { OffboardingStep } from "./types";

/** Subscription end procedure (Phase 19 §20). */
export const OFFBOARDING_SEQUENCE: readonly OffboardingStep[] = [
  "disable_installations",
  "invalidate_tokens",
  "terminate_connectors",
  "retain_legal_records_only",
] as const;

export const OFFBOARDING_PRINCIPLE =
  "Customer operational data remains with the customer. Aipify retains only legally required records.";

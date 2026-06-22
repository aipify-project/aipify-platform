/**
 * Sole Core allowlist file for forbidden customer/pilot name literals.
 * Excluded from COMPANION_CORE_CUSTOMER_SPECIFIC_NAMES content scan.
 */
export const FORBIDDEN_CUSTOMER_PILOT_NAMES = [
  "unonight",
  "unonatt",
  "xentora",
] as const;

export type ForbiddenCustomerPilotName = (typeof FORBIDDEN_CUSTOMER_PILOT_NAMES)[number];

import { PAYMENT_GRACE_PERIOD_DAYS, PAUSED_STATE_MESSAGE, REACTIVATION_MESSAGE } from "./engine";

export const PAYMENT_POLICY_SUMMARY = {
  gracePeriodDays: PAYMENT_GRACE_PERIOD_DAYS,
  duringGracePeriod: [
    "Display warning notifications",
    "Allow full system access",
  ],
  afterGracePeriod: [
    "Pause Aipify services",
    "Preserve configuration",
    "Do not delete customer settings",
    "Do not delete customer metadata",
  ],
} as const;

export function getGracePeriodDescription(): string {
  return `Grace period: ${PAYMENT_GRACE_PERIOD_DAYS} calendar days after payment becomes overdue.`;
}

export { PAUSED_STATE_MESSAGE, REACTIVATION_MESSAGE };

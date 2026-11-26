/**
 * Optional CSP ← signed Stripe TEST bridge.
 *
 * Default OFF. Does not enable Production live wiring.
 * Callers must pass `signatureVerified: true` only after `authorizeStripeWebhook`.
 */
import { CSP_STRIPE_LIVE_WIRING_ENABLED, mapVerifiedStripeEventToPaidPeriod } from "./stripe-adapter";

/** Compile-time + env gate. LIVE wiring remains false; TEST bridge requires explicit env. */
export const CSP_STRIPE_TEST_BRIDGE_ENABLED =
  process.env.AIPIFY_CSP_STRIPE_TEST_BRIDGE === "1" && CSP_STRIPE_LIVE_WIRING_ENABLED === false;

export type CspStripeTestBridgeInput = {
  signatureVerified: boolean;
  eventId: string;
  eventType: string;
  amountPaid?: number;
  customerOrgId: string;
  productKey: string;
  periodOrdinal: number;
  billingInterval?: "monthly" | "annual";
  currentPaidPeriods: number;
  processedEventIds?: readonly string[];
};

export type CspStripeTestBridgeResult =
  | { ok: false; reason: "bridge_disabled" | "unverified_event" | "not_mapped" | "failed_or_ignored" }
  | {
      ok: true;
      paymentEventPayload: {
        eventId: string;
        eventType: "paid_period" | "refund" | "chargeback";
        customerOrgId: string;
        productKey: string;
        periodOrdinal: number;
        billingInterval: "monthly" | "annual";
      };
    };

export function buildCspPaymentEventFromVerifiedStripeTest(
  input: CspStripeTestBridgeInput,
): CspStripeTestBridgeResult {
  if (!CSP_STRIPE_TEST_BRIDGE_ENABLED) return { ok: false, reason: "bridge_disabled" };
  if (input.signatureVerified !== true) return { ok: false, reason: "unverified_event" };

  const mapped = mapVerifiedStripeEventToPaidPeriod({
    signatureVerified: true,
    eventType: input.eventType,
    eventId: input.eventId,
    amountPaid: input.amountPaid,
    currentPaidPeriods: input.currentPaidPeriods,
    periodOrdinal: input.periodOrdinal,
    processedEventIds: input.processedEventIds,
  });
  if (!mapped.mapped) return { ok: false, reason: "not_mapped" };
  if (mapped.kind === "failed_charge") return { ok: false, reason: "failed_or_ignored" };

  const eventType =
    mapped.kind === "reversal"
      ? ("chargeback" as const)
      : ("paid_period" as const);

  return {
    ok: true,
    paymentEventPayload: {
      eventId: input.eventId,
      eventType,
      customerOrgId: input.customerOrgId,
      productKey: input.productKey,
      periodOrdinal: input.periodOrdinal,
      billingInterval: input.billingInterval === "annual" ? "annual" : "monthly",
    },
  };
}

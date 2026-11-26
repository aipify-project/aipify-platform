/**
 * Optional CSP paid-period application from an already-authorized Stripe TEST webhook.
 * Never runs unless AIPIFY_CSP_STRIPE_TEST_BRIDGE=1 and LIVE wiring is false.
 * Requires explicit CSP metadata on the Stripe object — no client partner_id.
 */
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { callCspRpc } from "./core-rpc";
import {
  buildCspPaymentEventFromVerifiedStripeTest,
  isCspStripeTestBridgeEnabled,
} from "./stripe-test-bridge";

export { isCspStripeTestBridgeEnabled };

export type StripeObjectForCsp = {
  id?: string;
  amount_paid?: number;
  metadata?: Record<string, unknown> | null;
};

function metaString(meta: Record<string, unknown> | null | undefined, keys: string[]): string {
  if (!meta) return "";
  for (const key of keys) {
    const value = meta[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

/**
 * Best-effort CSP commission update after Stripe signature verification.
 * Missing CSP metadata → no-op (billing webhook continues). Failures never throw.
 */
export async function maybeApplyCspPaidPeriodFromAuthorizedStripeTest(input: {
  eventId: string;
  eventType: string;
  object: StripeObjectForCsp;
}): Promise<{ attempted: boolean; applied: boolean; reason?: string }> {
  if (!isCspStripeTestBridgeEnabled()) {
    return { attempted: false, applied: false, reason: "bridge_disabled" };
  }

  const meta = input.object.metadata ?? null;
  const customerOrgId = metaString(meta, ["csp_customer_org_id", "customer_org_id", "aipify_org_id"]);
  const productKey = metaString(meta, ["csp_product_key", "product_key"]).toLowerCase();
  const periodRaw = metaString(meta, ["csp_period_ordinal", "period_ordinal"]);
  const periodOrdinal = Number(periodRaw);
  const billingRaw = metaString(meta, ["csp_billing_interval", "billing_interval"]).toLowerCase();
  const billingInterval = billingRaw === "annual" || billingRaw === "year" || billingRaw === "yearly"
    ? ("annual" as const)
    : ("monthly" as const);

  if (!customerOrgId || !productKey || !Number.isInteger(periodOrdinal) || periodOrdinal < 1) {
    return { attempted: false, applied: false, reason: "csp_metadata_required" };
  }

  const amountPaid =
    typeof input.object.amount_paid === "number" && Number.isFinite(input.object.amount_paid)
      ? input.object.amount_paid
      : undefined;

  const mapped = buildCspPaymentEventFromVerifiedStripeTest({
    signatureVerified: true,
    eventId: input.eventId,
    eventType: input.eventType,
    amountPaid,
    customerOrgId,
    productKey,
    periodOrdinal,
    billingInterval,
    // Ordinal/idempotency truth lives in Core; bridge only shapes the payload.
    currentPaidPeriods: Math.max(0, periodOrdinal - 1),
  });
  if (!mapped.ok) {
    return { attempted: true, applied: false, reason: mapped.reason };
  }

  try {
    const supabase = createServiceRoleClient();
    const result = await callCspRpc(supabase, "csp_apply_paid_period_event", {
      p_payload: mapped.paymentEventPayload,
    });
    if (!result.ready) {
      return { attempted: true, applied: false, reason: "core_rpc_not_ready" };
    }
    return { attempted: true, applied: true };
  } catch {
    return { attempted: true, applied: false, reason: "apply_failed" };
  }
}

import { NextResponse } from "next/server";
import { callCspRpc, failClosedJson } from "@/lib/certified-sales-partner";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * Internal verified subscription period events for CSP commission.
 * Does NOT charge Stripe. Requires trusted server secret + Core service role.
 *
 * Payload matches Core `csp_apply_paid_period_event(p_payload jsonb)`:
 *   eventId, eventType (paid_period|refund|chargeback), customerOrgId, productKey,
 *   periodOrdinal (paid_period), optional billingInterval (monthly|annual).
 *
 * Partner is resolved server-side from first-wins attribution — never from the client.
 * Live Stripe wiring remains gated separately (`CSP_STRIPE_LIVE_WIRING_ENABLED = false`).
 */
export async function POST(request: Request) {
  try {
    const secret = request.headers.get("x-aipify-csp-payment-event-secret");
    const expected = process.env.AIPIFY_CSP_PAYMENT_EVENT_SECRET;
    if (!expected || !secret || secret !== expected) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      eventId?: string;
      event_id?: string;
      eventType?: string;
      event_type?: string;
      customerOrgId?: string;
      customer_org_id?: string;
      productKey?: string;
      product_key?: string;
      periodOrdinal?: number;
      period_ordinal?: number;
      billingInterval?: string;
      billing_interval?: string;
    };

    const eventId = String(body.eventId ?? body.event_id ?? "").trim();
    const eventType = String(body.eventType ?? body.event_type ?? "").trim().toLowerCase();
    const customerOrgId = String(body.customerOrgId ?? body.customer_org_id ?? "").trim();
    const productKey = String(body.productKey ?? body.product_key ?? "").trim().toLowerCase();
    const periodOrdinal = Number(body.periodOrdinal ?? body.period_ordinal);
    const billingInterval = String(body.billingInterval ?? body.billing_interval ?? "monthly")
      .trim()
      .toLowerCase();

    if (!eventId || !eventType || !customerOrgId || !productKey) {
      return NextResponse.json({ error: "payload_required" }, { status: 400 });
    }
    if (!["paid_period", "refund", "chargeback"].includes(eventType)) {
      return NextResponse.json({ error: "invalid_event_type" }, { status: 400 });
    }
    if (eventType === "paid_period" && (!Number.isInteger(periodOrdinal) || periodOrdinal < 1)) {
      return NextResponse.json({ error: "invalid_period_ordinal" }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
      eventId,
      eventType,
      customerOrgId,
      productKey,
      billingInterval: billingInterval === "annual" || billingInterval === "year" || billingInterval === "yearly"
        ? "annual"
        : "monthly",
    };
    if (eventType === "paid_period" || Number.isInteger(periodOrdinal)) {
      payload.periodOrdinal = periodOrdinal;
    }

    const supabase = createServiceRoleClient();
    const result = await callCspRpc(supabase, "csp_apply_paid_period_event", {
      p_payload: payload,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    return NextResponse.json({ persistence: result.data });
  } catch {
    return NextResponse.json({ error: "payment_event_failed" }, { status: 500 });
  }
}

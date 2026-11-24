import { NextResponse } from "next/server";
import {
  applyVerifiedPaidPeriod,
  callCspRpc,
  failClosedJson,
} from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";

/**
 * Internal verified subscription period events for CSP commission.
 * Does NOT charge Stripe. Requires trusted server caller + active Core.
 * Live Stripe wiring and real test charges need separate owner payment consent.
 */
export async function POST(request: Request) {
  try {
    const secret = request.headers.get("x-aipify-csp-payment-event-secret");
    const expected = process.env.AIPIFY_CSP_PAYMENT_EVENT_SECRET;
    if (!expected || !secret || secret !== expected) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      qualified_sale_id?: string;
      current_paid_periods?: number;
      event_period_ordinal?: number;
      is_successful_charge?: boolean;
      is_duplicate?: boolean;
      is_refund_or_chargeback?: boolean;
    };

    if (!body.qualified_sale_id || typeof body.current_paid_periods !== "number") {
      return NextResponse.json({ error: "sale_and_periods_required" }, { status: 400 });
    }

    const mapped = applyVerifiedPaidPeriod({
      currentPaidPeriods: body.current_paid_periods,
      eventPeriodOrdinal: Number(body.event_period_ordinal ?? 0),
      isSuccessfulCharge: body.is_successful_charge === true,
      isDuplicate: body.is_duplicate === true,
      isRefundOrChargeback: body.is_refund_or_chargeback === true,
    });

    const supabase = await createClient();
    const result = await callCspRpc(supabase, "csp_apply_paid_period_event", {
      p_qualified_sale_id: body.qualified_sale_id,
      p_paid_periods_count: mapped.paidPeriods,
      p_status: mapped.status,
      p_commission_earned: mapped.commissionEarned,
      p_earn_once: mapped.newlyEarned,
      p_needs_reversal_review: mapped.needsReversalReview,
      p_changed: mapped.changed,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json({ ...closed.body, mapped }, { status: closed.status });
    }
    return NextResponse.json({ mapped, persistence: result.data });
  } catch {
    return NextResponse.json({ error: "payment_event_failed" }, { status: 500 });
  }
}

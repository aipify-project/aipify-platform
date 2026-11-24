import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import {
  callCspRpc,
  failClosedJson,
  validateSettlementTransition,
  type CspSettlementStatus,
} from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";

const STATUSES: readonly CspSettlementStatus[] = ["open", "closed", "approved", "paid", "voided"];

/** Platform finance settlement transitions — manual bank payout recording only. */
export async function GET() {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const result = await callCspRpc(supabase, "csp_list_monthly_settlements");
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "settlements_load_failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      settlement_id?: string;
      from_status?: string;
      to_status?: string;
      rejection_reason?: string;
      paid_at?: string;
      payment_reference?: string;
    };

    if (!body.settlement_id || !body.from_status || !body.to_status) {
      return NextResponse.json({ error: "settlement_transition_fields_required" }, { status: 400 });
    }
    if (
      !(STATUSES as readonly string[]).includes(body.from_status) ||
      !(STATUSES as readonly string[]).includes(body.to_status)
    ) {
      return NextResponse.json({ error: "invalid_settlement_status" }, { status: 400 });
    }

    const validation = validateSettlementTransition(
      body.from_status as CspSettlementStatus,
      body.to_status as CspSettlementStatus,
      {
        rejectionReason: body.rejection_reason,
        paidAt: body.paid_at,
        paymentReference: body.payment_reference,
        adminId: user.id,
      },
    );
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const result = await callCspRpc(supabase, "csp_transition_settlement", {
      p_settlement_id: body.settlement_id,
      p_from_status: body.from_status,
      p_to_status: body.to_status,
      p_rejection_reason: body.rejection_reason ?? null,
      p_paid_at: body.paid_at ?? null,
      p_payment_reference: body.payment_reference ?? null,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "settlement_transition_failed" }, { status: 500 });
  }
}

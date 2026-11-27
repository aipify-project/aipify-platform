import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc, failClosedJson } from "@/lib/certified-sales-partner";
import { buildSettlementTransitionArgs } from "@/lib/certified-sales-partner/settlement-transition-args";
import { createClient } from "@/lib/supabase/server";

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
      bank_payout_confirmed?: boolean;
    };

    const validation = buildSettlementTransitionArgs({
      settlementId: body.settlement_id,
      fromStatus: body.from_status,
      toStatus: body.to_status,
      rejectionReason: body.rejection_reason,
      paidAt: body.paid_at,
      paymentReference: body.payment_reference,
      adminId: user.id,
      bankPayoutConfirmed: body.bank_payout_confirmed === true,
    });
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const result = await callCspRpc(
      supabase,
      "csp_transition_settlement",
      { ...validation.args } as Record<string, unknown>,
    );
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "settlement_transition_failed" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { parseEconomySettlementDetail, parseEconomyActionResult } from "@/lib/partners-portal/economy-engine";
import { requirePartnersPortalApiAccess } from "@/lib/partners-portal/server-access";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;
    const { id } = await context.params;
    const { data, error } = await gate.access.supabase.rpc("get_growth_partner_economy_settlement", {
      p_settlement_id: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseEconomySettlementDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load settlement" }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;
    const { id } = await context.params;
    const body = (await request.json()) as { approval_statement?: string };
    const { data, error } = await gate.access.supabase.rpc("approve_growth_partner_economy_settlement", {
      p_settlement_id: id,
      p_approval_statement: body.approval_statement ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseEconomyActionResult(data));
  } catch {
    return NextResponse.json({ error: "Settlement approval failed" }, { status: 500 });
  }
}
